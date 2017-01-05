
describe('Template parser', function() {
    var temp;
    it('if helper', function() {
        temp = new  api.Template('<h1>{% if a == b %}A and B are equals{% endif %}</h1>');
        expect(temp.render({a:1,b:2})).toBe('<h1></h1>');
        expect(temp.render({a:1,b:1})).toBe('<h1>A and B are equals</h1>');
    });

    it('elseif helper', function() {
        temp = new  api.Template('<h1>{% if a == b %}A and B are equals{% elseif b < 3 %}B is smaller than 3{% endif %}</h1>');
        expect(temp.render({a:1,b:2})).toBe('<h1>B is smaller than 3</h1>');
    });

    it('else helper', function() {
        temp = new  api.Template('<h1>{% if a == b %}A and B are equals{% elseif b < 3 %}B is smaller than 3{% else %}Another result{% endif %}</h1>');
        expect(temp.render({a:1,b:5})).toBe('<h1>Another result</h1>');
    });

    it('Variables helper', function() {
        temp = new  api.Template('{% title %} {% user.age %}');
        expect(temp.render({title:'Test Templating',user:{age:15}})).toBe('Test Templating 15');
    });

    it('ForEach helper', function() {
        temp = new  api.Template('<ul>{% each items as item %}<li>{% item.name %}</li>{% endeach %}</ul>');
        expect(temp.render({items:[{name:'House'},{name:'Aparment'}]})).toBe('<ul><li>House</li><li>Aparment</li></ul>');
    });
});