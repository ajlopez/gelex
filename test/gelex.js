
const gelex = require('..');

exports['get zero and one'] = function (test) {
    gelex.define('zero', '0');
    gelex.define('one', '1');
    
    const lexer = gelex.lexer('01');
    
    var result = lexer.next();
    
    test.deepEqual(result, { type: 'zero', value: '0', begin: 0, end: 0 });

    var result = lexer.next();
    
    test.deepEqual(result, { type: 'one', value: '1', begin: 1, end: 1 });
    
    test.equal(lexer.next(), null);
    test.equal(lexer.position(), 2);
};
