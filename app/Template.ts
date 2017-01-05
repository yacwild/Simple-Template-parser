/// <reference path='./Utils.ts'/>   

module api{
    
    export interface IHelper{
        compile(toke:string):string;
    }

    export class AbstractHelper implements IHelper{
        helperRegs = [];     
        name       = 'AbstractHelper'; 

        expr(str) {
            return '(function(){try{return(' + str + ')}catch(e){return ""}})()';
        }

        compile(token:string):string{
            var compiled:string = '';
            Utils.forEach(this.helperRegs,(value)=>{
            
                if(value.reg.test(token)){                   
                    compiled = value.output(token);
                    return false;
                }
            });
            return compiled;
        }    
    }

    export class SwitchHelper extends AbstractHelper {
        name = 'SwitchHelper';
        helperRegs =[ 
            {reg: /^switch\s+(.+)$/, output: (token)=>'switch(' + (RegExp.$1) + '){'},
            {reg: /^case\s+(.+)$/, output:(token)=> 'case ' + (RegExp.$1) + ' :' },
            {reg: /^endCase$/i, output:(token)=> ';break;'  },
            {reg: /^default$/i, output:(token)=> 'default:'  },
            {reg: /^endSwitch$/i, output: (token)=>'}' },
        ];
    }

    export class IfHelper extends AbstractHelper {
        name = 'IfHelper';
        helperRegs =[ 
            {reg: /^if\s+(.+)$/, output: (token)=>'if(' + this.expr(RegExp.$1) + '){'},
            {reg: /^elseif\s+(.+)$/, output:(token)=> '}else if(' + this.expr(RegExp.$1) + '){'},
            {reg: /^else$/, output:(token)=> '}else{'  },
            {reg: /^endif$/i, output: (token)=>'}' },
        ];
    }

    export class EachHelper extends AbstractHelper {
        name = 'EachHelper';
        helperRegs =[ 
            {reg: /^each\s+(.+)\s+as\s+(\w+)(?:\s*,\s*(\w+))?$/, output: (token)=>'__EACH(' + this.expr(RegExp.$1) + ',function(' + RegExp.$2 + ',' + (RegExp.$3 || '__index') + '){'},
            {reg: /^endeach$/i, output: (token)=>'});' },
        ];
    }

    export class VarHelper extends AbstractHelper {
        name = 'VarHelper';
        helperRegs =[ 
            {reg: /^(\w+)\s*=\s*(.+)$/, output: (token)=>'var ' + RegExp.$1 + '=' + this.expr(RegExp.$2) + ';'}
        ];
    }

    export class ExpressionHelper extends AbstractHelper {
        name = 'ExpressionHelper';
        helperRegs =[ 
            {reg: /^.*?$/, output: (token)=> TemplateManager.getStrpush(this.expr(token))}
        ];
    }


    export class TemplateManager {  
        static REGEXPs  = { QUOTE:/'/g, LINE:/[\t\b\f\r\n]/g, ESCAPE:/\\/g };
        static TOKENS   = { OPEN:'{%', CLOSE:'%}' };
        static _defaultHelper:IHelper = new ExpressionHelper();
        static _helpers:IHelper[]     = [new IfHelper, new EachHelper, new VarHelper, new SwitchHelper];
        static _sources:{[name:string]:Template} = {};

        static register(id:string, source:string):Template{
            if(!TemplateManager._sources[id]){
                TemplateManager._sources[id] = new Template(source);
            }
            return TemplateManager._sources[id];
        }

        static getTemplate(id:string):Template{
            return TemplateManager._sources[id];
        }

        static addHelper(helper:IHelper){
            TemplateManager._helpers.push(helper);
        }

        static getTemplateParsed(template){
            var body = ['var __C=[]; with(__D){'];
             var part, content,staticContent;
            template = template.split(TemplateManager.TOKENS.OPEN);
            body.push(TemplateManager.getStrpush( TemplateManager.quote(template.shift()) ));

            while (part = template.shift()) {
                var parts = part.split(TemplateManager.TOKENS.CLOSE), token;
                if (parts.length > 1 && (token = Utils.trim(parts.shift()))) {
                    Utils.forEach(TemplateManager._helpers,(value)=>{
                        return !(content = value.compile(token));
                    });
                    if(!content.length){
                        content = TemplateManager._defaultHelper.compile(token);
                    }
                    body.push(content);
                }
                
                staticContent = parts.join(TemplateManager.TOKENS.CLOSE);
                if(staticContent)
                    body.push(
                        TemplateManager.getStrpush(TemplateManager.quote(staticContent))
                    );

            }
            body.push('} return __C.join("");');
            return body.join('');
        }

        static getStrpush(value){
            return '__C.push(' + value  + ');';
        }

        static quote(str) {                        
            return "'" + str.replace(TemplateManager.REGEXPs.ESCAPE, '\\\\')
                            .replace(TemplateManager.REGEXPs.QUOTE, "\\'")
                            .replace(TemplateManager.REGEXPs.LINE, ' ') + "'";
        }
    }

    export class Template{
        raw:string;
        compile:Function;
        constructor(template) {   
            this.raw           = template;   
            this.compile        = new Function('__D, __EACH', TemplateManager.getTemplateParsed(template));
        }
        
        render(data){
            return this.compile(data, Utils.forEach);
        }
    }







}
