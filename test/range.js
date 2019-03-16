
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
