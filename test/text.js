
const gelex = require('..');

exports['get string'] = function (test) {
    const def = gelex.definition();
    
    def.defineText('string', '"', '"');
    
    const lexer = def.lexer('"foo" "bar"');
    
    const result = lexer.next();
    
    test.ok(result);
    test.deepEqual(result, { type: 'string', value: 'foo', begin: 0, end: 4 });
    
    const result2 = lexer.next();
    
    test.ok(result2);
    test.deepEqual(result2, { type: 'string', value: 'bar', begin: 6, end: 10 });
};

exports['get string with escape'] = function (test) {
    const def = gelex.definition();
    
    def.defineText('string', '"', '"', 
        { escape: '\\', escaped: { 'n': '\n', 'r': '\r' } });
    
    const lexer = def.lexer('"foo\\r\\n" "foo\\\"bar"');
    
    const result = lexer.next();
    
    test.ok(result);
    test.deepEqual(result, { type: 'string', value: 'foo\r\n', begin: 0, end: 8 });
    
    const result2 = lexer.next();
    
    test.ok(result2);
    test.deepEqual(result2, { type: 'string', value: 'foo"bar', begin: 10, end: 19 });
};

exports['unclose string'] = function (test) {
    const def = gelex.definition();
    
    def.defineText('string', '"', '"');
    
    const lexer = def.lexer('"foo');
    
    try {
        lexer.next();
    }
    catch (ex) {
        test.equal(ex, 'Error: unclosed text');
        return;
    }
    
    test.fail();
};

