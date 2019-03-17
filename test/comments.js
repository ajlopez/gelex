
const gelex = require('..');

exports['skip comments'] = function (test) {
    const def = gelex.definition();
    
    def.define('name', '[a-z][a-z]*');
    def.defineComment('/*', '*/');
    
    const lexer = def.lexer('  /* a comment */foo/*another\ncomment *');
    
    const result = lexer.next();
    
    test.ok(result);
    test.equal(result.value, 'foo');
    test.equal(result.type, 'name');
    
    test.equal(lexer.next(), null);
};

exports['skip line comments'] = function (test) {
    const def = gelex.definition();
    
    def.define('name', '[a-z][a-z]*');
    def.defineComment('//');
    
    const lexer = def.lexer('  // a line comment\r\nfoo//another line comment');
    
    const result = lexer.next();
    
    test.ok(result);
    test.equal(result.value, 'foo');
    test.equal(result.type, 'name');
    
    test.equal(lexer.next(), null);
};

