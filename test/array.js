
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
