var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Utils;
(function (Utils) {
    /**
     * Inspect all items of Array or Object
     * @param obj
     * @param callback
     */
    function forEach(obj, callback) {
        if (isFunction(callback) && obj) {
            if (isArraylike(obj) && !isEmptyArray(obj)) {
                for (var i = 0; i < obj.length && callback.call(obj[i], obj[i], i) !== false; i++) {
                }
            }
            else if (isObject(obj) && !isEmptyObject(obj)) {
                for (var attribute in obj) {
                    if (obj.hasOwnProperty(attribute) && callback.call(obj[attribute], obj[attribute], attribute) === false) {
                        break;
                    }
                }
            }
        }
    }
    Utils.forEach = forEach;
    /**
     *
     * @param dest
     * @param src
     * @param notOverwrite
     * @returns {Object}
     */
    function cloneObject(dest, src, notOverwrite) {
        if (notOverwrite === void 0) { notOverwrite = false; }
        for (var prop in src) {
            if (src.hasOwnProperty(prop)) {
                var value = src[prop];
                if (!notOverwrite || !(prop in dest)) {
                    dest[prop] = value;
                }
            }
        }
        return dest;
    }
    Utils.cloneObject = cloneObject;
    /**
     *
     */
    function isEmptyObject(obj) {
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                return false;
            }
        }
        return true;
    }
    Utils.isEmptyObject = isEmptyObject;
    /**
     *
     */
    function isEmptyArray(obj) {
        return !(obj && obj.length);
    }
    Utils.isEmptyArray = isEmptyArray;
    /**
     *
     */
    function isFunction(value) { return value instanceof Function || typeof value === 'function'; }
    Utils.isFunction = isFunction;
    /**
     * Check if the vlaue is a Array
     * @param value
     * @returns {boolean}
     */
    function isArray(value) { return value instanceof Array; }
    Utils.isArray = isArray;
    /**
     *
     */
    function isArraylike(value) {
        var length = 'length' in value && value.length;
        if (isFunction(value)) {
            return false;
        }
        if (value.nodeType === 1 && length) {
            return true;
        }
        return isArray(value) || length === 0 ||
            typeof length === 'number' && length > 0 && (length - 1) in value;
    }
    Utils.isArraylike = isArraylike;
    /**
     * Check if the vlaue is a Object
     * @param value
     * @returns {boolean}
     */
    function isObject(value) { return value instanceof Object && !(value instanceof Array); }
    Utils.isObject = isObject;
    /**
     * Check if the vlaue is a Null
     * @param value
     * @returns {boolean}
     */
    function isNull(value) { return value === null; }
    Utils.isNull = isNull;
    /**
     * Check if the vlaue is a string
     * @param value
     * @returns {boolean}
     */
    function isString(value) { return typeof value === 'string'; }
    Utils.isString = isString;
    /**
     * Check if the vlaue is a Numeric
     * @param value
     * @returns {boolean}
     */
    function isNumeric(value) { return !isNaN(parseFloat(value)) && isFinite(value); }
    Utils.isNumeric = isNumeric;
    /**
     *
     */
    function trim(str) {
        if (isFunction(trim))
            return str.trim();
        else
            return str.replace(/\S/.test('\xA0') ? /^[\s\xA0]+|[\s\xA0]+$/g : /^\s+|\s+$/g, '');
    }
    Utils.trim = trim;
})(Utils || (Utils = {}));
/// <reference path='./Utils.ts'/>   
var api;
(function (api) {
    var AbstractHelper = (function () {
        function AbstractHelper() {
            this.helperRegs = [];
            this.name = 'AbstractHelper';
        }
        AbstractHelper.prototype.expr = function (str) {
            return '(function(){try{return(' + str + ')}catch(e){return ""}})()';
        };
        AbstractHelper.prototype.compile = function (token) {
            var compiled = '';
            Utils.forEach(this.helperRegs, function (value) {
                if (value.reg.test(token)) {
                    compiled = value.output(token);
                    return false;
                }
            });
            return compiled;
        };
        return AbstractHelper;
    }());
    api.AbstractHelper = AbstractHelper;
    var SwitchHelper = (function (_super) {
        __extends(SwitchHelper, _super);
        function SwitchHelper() {
            _super.apply(this, arguments);
            this.name = 'SwitchHelper';
            this.helperRegs = [
                { reg: /^switch\s+(.+)$/, output: function (token) { return 'switch(' + (RegExp.$1) + '){'; } },
                { reg: /^case\s+(.+)$/, output: function (token) { return 'case ' + (RegExp.$1) + ' :'; } },
                { reg: /^endCase$/i, output: function (token) { return ';break;'; } },
                { reg: /^default$/i, output: function (token) { return 'default:'; } },
                { reg: /^endSwitch$/i, output: function (token) { return '}'; } },
            ];
        }
        return SwitchHelper;
    }(AbstractHelper));
    api.SwitchHelper = SwitchHelper;
    var IfHelper = (function (_super) {
        __extends(IfHelper, _super);
        function IfHelper() {
            var _this = this;
            _super.apply(this, arguments);
            this.name = 'IfHelper';
            this.helperRegs = [
                { reg: /^if\s+(.+)$/, output: function (token) { return 'if(' + _this.expr(RegExp.$1) + '){'; } },
                { reg: /^elseif\s+(.+)$/, output: function (token) { return '}else if(' + _this.expr(RegExp.$1) + '){'; } },
                { reg: /^else$/, output: function (token) { return '}else{'; } },
                { reg: /^endif$/i, output: function (token) { return '}'; } },
            ];
        }
        return IfHelper;
    }(AbstractHelper));
    api.IfHelper = IfHelper;
    var EachHelper = (function (_super) {
        __extends(EachHelper, _super);
        function EachHelper() {
            var _this = this;
            _super.apply(this, arguments);
            this.name = 'EachHelper';
            this.helperRegs = [
                { reg: /^each\s+(.+)\s+as\s+(\w+)(?:\s*,\s*(\w+))?$/, output: function (token) { return '__EACH(' + _this.expr(RegExp.$1) + ',function(' + RegExp.$2 + ',' + (RegExp.$3 || '__index') + '){'; } },
                { reg: /^endeach$/i, output: function (token) { return '});'; } },
            ];
        }
        return EachHelper;
    }(AbstractHelper));
    api.EachHelper = EachHelper;
    var VarHelper = (function (_super) {
        __extends(VarHelper, _super);
        function VarHelper() {
            var _this = this;
            _super.apply(this, arguments);
            this.name = 'VarHelper';
            this.helperRegs = [
                { reg: /^(\w+)\s*=\s*(.+)$/, output: function (token) { return 'var ' + RegExp.$1 + '=' + _this.expr(RegExp.$2) + ';'; } }
            ];
        }
        return VarHelper;
    }(AbstractHelper));
    api.VarHelper = VarHelper;
    var ExpressionHelper = (function (_super) {
        __extends(ExpressionHelper, _super);
        function ExpressionHelper() {
            var _this = this;
            _super.apply(this, arguments);
            this.name = 'ExpressionHelper';
            this.helperRegs = [
                { reg: /^.*?$/, output: function (token) { return TemplateManager.getStrpush(_this.expr(token)); } }
            ];
        }
        return ExpressionHelper;
    }(AbstractHelper));
    api.ExpressionHelper = ExpressionHelper;
    var TemplateManager = (function () {
        function TemplateManager() {
        }
        TemplateManager.register = function (id, source) {
            if (!TemplateManager._sources[id]) {
                TemplateManager._sources[id] = new Template(source);
            }
            return TemplateManager._sources[id];
        };
        TemplateManager.getTemplate = function (id) {
            return TemplateManager._sources[id];
        };
        TemplateManager.addHelper = function (helper) {
            TemplateManager._helpers.push(helper);
        };
        TemplateManager.getTemplateParsed = function (template) {
            var body = ['var __C=[]; with(__D){'];
            var part, content, staticContent;
            template = template.split(TemplateManager.TOKENS.OPEN);
            body.push(TemplateManager.getStrpush(TemplateManager.quote(template.shift())));
            while (part = template.shift()) {
                var parts = part.split(TemplateManager.TOKENS.CLOSE), token;
                if (parts.length > 1 && (token = Utils.trim(parts.shift()))) {
                    Utils.forEach(TemplateManager._helpers, function (value) {
                        return !(content = value.compile(token));
                    });
                    if (!content.length) {
                        content = TemplateManager._defaultHelper.compile(token);
                    }
                    body.push(content);
                }
                staticContent = parts.join(TemplateManager.TOKENS.CLOSE);
                if (staticContent)
                    body.push(TemplateManager.getStrpush(TemplateManager.quote(staticContent)));
            }
            body.push('} return __C.join("");');
            console.log(body.join(''));
            return body.join('');
        };
        TemplateManager.getStrpush = function (value) {
            return '__C.push(' + value + ');';
        };
        TemplateManager.quote = function (str) {
            return "'" + str.replace(TemplateManager.REGEXPs.ESCAPE, '\\\\')
                .replace(TemplateManager.REGEXPs.QUOTE, "\\'")
                .replace(TemplateManager.REGEXPs.LINE, ' ') + "'";
        };
        TemplateManager.REGEXPs = { QUOTE: /'/g, LINE: /[\t\b\f\r\n]/g, ESCAPE: /\\/g };
        TemplateManager.TOKENS = { OPEN: '{%', CLOSE: '%}' };
        TemplateManager._defaultHelper = new ExpressionHelper();
        TemplateManager._helpers = [new IfHelper, new EachHelper, new VarHelper, new SwitchHelper];
        TemplateManager._sources = {};
        return TemplateManager;
    }());
    api.TemplateManager = TemplateManager;
    var Template = (function () {
        function Template(template) {
            this.raw = template;
            this.compile = new Function('__D, __EACH', TemplateManager.getTemplateParsed(template));
        }
        Template.prototype.render = function (data) {
            return this.compile(data, Utils.forEach);
        };
        return Template;
    }());
    api.Template = Template;
})(api || (api = {}));
