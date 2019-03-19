
const gelex = require('..');

function CharacterRule(ch) {
    this.first = function () { return ch; };
    
    this.match = function (scanner) {
        if (scanner.peek() !== ch)
            return null;
        
        scanner.scan();
        
        return scanner.scan();
    };
}

exports['define and use custom rule'] = function (test) {
    const ldef = gelex.definition();
        
    ldef.define('character', new CharacterRule('$'));
    
    const lexer = ldef.lexer('  $a $b');
    
    const result = lexer.next();
    
    test.ok(result);
    test.deepEqual(result, { type: 'character', value: 'a', begin: 2, end: 3 });
    
    const result2 = lexer.next();
    
    test.ok(result2);
    test.deepEqual(result2, { type: 'character', value: 'b', begin: 5, end: 6 });    
};