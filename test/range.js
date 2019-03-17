
const gelex = require('..');

exports['get integer'] = function (test) {
    const def = gelex.definition();
    def.define('integer', '[0-9][0-9]*');
    
    const lexer = def.lexer('123 42');
    
    const result = lexer.next();
    
    test.ok(result);
    test.deepEqual(result, { type: 'integer', value: '123', begin: 0, end: 2 });

    const result2 = lexer.next();
    
    test.ok(result2);
    test.deepEqual(result2, { type: 'integer', value: '42', begin: 4, end: 5 });

    test.equal(lexer.next(), null);
};

exports['get one digit integer'] = function (test) {
    const def = gelex.definition();
    def.define('integer', '[0-9][0-9]*');
    
    const lexer = def.lexer('1');
    
    const result = lexer.next();
    
    test.ok(result);
    test.deepEqual(result, { type: 'integer', value: '1', begin: 0, end: 0 });
};

exports['get name'] = function (test) {
    const def = gelex.definition();
    def.define('name', '[a-zA-Z_][a-zA-Z0-9_]*');
    
    const lexer = def.lexer('foo bar42 _x _x123 foo_bar');
    
    const expected = [ 'foo', 'bar42', '_x', '_x123', 'foo_bar' ];
    
    for (let k = 0; k < expected.length; k++) {
        const result = lexer.next();
        
        test.ok(result);
        test.equal(result.type, 'name');
        test.equal(result.value, expected[k]);
    }

    test.equal(lexer.next(), null);
};
