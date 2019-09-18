
const gelex = require('..').definition();

exports['get unknown character'] = function (test) {
    const lexer = gelex.lexer('@');
    
    const result = lexer.next();
    
    test.ok(result);
    test.deepEqual(result, { type: 'unknown', value: '@', begin: 0, end: 0 });

    test.equal(lexer.next(), null);
};

exports['get digits'] = function (test) {
    gelex.define('prime', '[2357]');
    
    const primes = '2357';
    
    const lexer = gelex.lexer(primes);
    
    for (var k = 0; k < primes.length; k++) {
        const result = lexer.next();
        
        test.ok(result);
        test.deepEqual(result, { type: 'prime', value: primes[k], begin: k, end: k });
    }
    
    test.equal(lexer.next(), null);
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

exports['get two digits'] = function (test) {
    gelex.define('twodigits', '[0123456789][0123456789]');
    
    const lexer = gelex.lexer('1234');
    
    var result = lexer.next();
    
    test.deepEqual(result, { type: 'twodigits', value: '12', begin: 0, end: 1 });

    var result = lexer.next();
    
    test.deepEqual(result, { type: 'twodigits', value: '34', begin: 2, end: 3 });
    
    test.equal(lexer.next(), null);
    test.equal(lexer.position(), 4);
};

exports['get integer'] = function (test) {
    gelex.define('integer', '[0123456789][0123456789]*');
    
    const lexer = gelex.lexer('1234');
    
    var result = lexer.next();
    
    test.deepEqual(result, { type: 'integer', value: '1234', begin: 0, end: 3 });
    
    test.equal(lexer.next(), null);
    test.equal(lexer.position(), 4);
};

exports['get integer twice using seek'] = function (test) {
    gelex.define('integer', '[0-9][0-9]*');
    
    const lexer = gelex.lexer('  1234  ');
    
    var result = lexer.next();
    
    test.deepEqual(result, { type: 'integer', value: '1234', begin: 2, end: 5 });
    
    test.equal(lexer.next(), null);
    test.equal(lexer.position(), 8);
    
    lexer.seek(result.begin);
    
    test.equal(lexer.position(), result.begin);
    
    var result2 = lexer.next();
    
    test.deepEqual(result2, { type: 'integer', value: '1234', begin: 2, end: 5 });
    
    test.equal(lexer.next(), null);
    test.equal(lexer.position(), 8);
};
