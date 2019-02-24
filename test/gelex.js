
const gelex = require('..');

exports['get unknown character'] = function (test) {
    const lexer = gelex.lexer('@');
    
    const result = lexer.next();
    
    test.ok(result);
    test.deepEqual(result, { type: 'unknown', value: '@', begin: 0, end: 0 });
};

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

exports['get zero and one skipping spaces'] = function (test) {
    gelex.define('zero', '0');
    gelex.define('one', '1');
    
    const lexer = gelex.lexer('   0 1  ');
    
    var result = lexer.next();
    
    test.deepEqual(result, { type: 'zero', value: '0', begin: 3, end: 3 });

    var result = lexer.next();
    
    test.deepEqual(result, { type: 'one', value: '1', begin: 5, end: 5 });
    
    test.equal(lexer.next(), null);
    test.equal(lexer.position(), 8);
};

exports['get zero and one skipping tabs and spaces'] = function (test) {
    gelex.define('zero', '0');
    gelex.define('one', '1');
    
    const lexer = gelex.lexer('\t  0\t1  ');
    
    var result = lexer.next();
    
    test.deepEqual(result, { type: 'zero', value: '0', begin: 3, end: 3 });

    var result = lexer.next();
    
    test.deepEqual(result, { type: 'one', value: '1', begin: 5, end: 5 });
    
    test.equal(lexer.next(), null);
    test.equal(lexer.position(), 8);
};
