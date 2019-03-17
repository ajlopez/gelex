
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

