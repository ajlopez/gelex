
const gelex = require('..');

exports['get operators'] = function (test) {
    const def = gelex.definition();
    const operators = [ '<', '>', '+', '-', '===', '==' ];
    def.define('operator', operators);
    
    const lexer = def.lexer('<>+-=====');
    
    for (let k = 0; k < operators.length; k++) {
        const result = lexer.next();

        test.ok(result);
        test.equal(result.type, 'operator');
        test.equal(result.value, operators[k]);
    }

    test.equal(lexer.next(), null);
};

exports['get new lines'] = function (test) {
    const def = gelex.definition();
    def.define('newline', [ '\r\n', '\r', '\n' ]);
    
    const lexer = def.lexer(' \r\n \n\r');
    const expected = [ '\r\n', '\n', '\r' ];
    
    for (let k = 0; k < expected.length; k++) {
        const result = lexer.next();

        test.ok(result);
        test.equal(result.type, 'newline');
        test.equal(result.value, expected[k]);
    }

    test.equal(lexer.next(), null);
};

