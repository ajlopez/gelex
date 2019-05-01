
const gelex = require('..');

exports['define and use rule with transform function'] = function (test) {
    const ldef = gelex.definition();
        
    ldef.define('symbol', '#[a-zA-Z_][a-zA-Z_]*', function (value) { return value.substring(1); });
    
    const lexer = ldef.lexer('  #a #abc');
    
    const result = lexer.next();
    
    test.ok(result);
    test.deepEqual(result, { type: 'symbol', value: 'a', begin: 2, end: 3 });
    
    const result2 = lexer.next();
    
    test.ok(result2);
    test.deepEqual(result2, { type: 'symbol', value: 'abc', begin: 5, end: 8 });
};

