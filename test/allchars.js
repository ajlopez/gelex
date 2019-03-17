
const gelex = require('..');

exports['get any character'] = function (test) {
    const def = gelex.definition();
    def.define('char', '[.]');
    
    const expected = 'abc';
    const lexer = def.lexer(expected);
    
    for (let k = 0; k < expected.length; k++) {
        const result = lexer.next();

        test.ok(result);
        test.equal(result.type, 'char');
        test.equal(result.value, expected[k]);
    }

    test.equal(lexer.next(), null);
};
