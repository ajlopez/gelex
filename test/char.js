
const gelex = require('..').definition();

exports['get char'] = function (test) {
    const lexer = gelex.lexer('@');
    
    const result = lexer.char('@');
    
    test.ok(result);
    test.deepEqual(result, { type: 'char', value: '@', begin: 0, end: 0 });

    test.equal(lexer.next(), null);
};

exports['get no char'] = function (test) {
    const lexer = gelex.lexer('@');
    
    const result = lexer.char('X');
    
    test.ok(!result);
};

exports['get new line as char'] = function (test) {
    const lexer = gelex.lexer('\n');
    
    const result = lexer.char('\n');
    
    test.ok(result);
    test.deepEqual(result, { type: 'char', value: '\n', begin: 0, end: 0 });

    test.equal(lexer.next(), null);
};

exports['get new line as char skipping spaces'] = function (test) {
    const lexer = gelex.lexer(' \r\n  \r\n');
    
    const result = lexer.char('\n');
    
    test.ok(result);
    test.deepEqual(result, { type: 'char', value: '\n', begin: 2, end: 2 });

    test.equal(lexer.next(), null);
};

