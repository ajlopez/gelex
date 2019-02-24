
const scanners = require('./scanners');

const rules = [];

function CharRule(name, data) {
    this.name = function () { return name; };
    this.match = function(ch) { return data.indexOf(ch) >= 0 ? ch : null; };
}

function defineRule(name, data) {
    rules.push(new CharRule(name, data));
}

function Lexer(text) {
    const scanner = scanners.scanner(text);

    this.position = function () { return scanner.position(); };
    
    this.next = function () {
        skipSpaces();
        
        const begin = scanner.position();
        
        const ch = scanner.scan();

        if (ch == null)
            return null;

        var token = null;

        for (var n in rules) {
            const rule = rules[n];
            const value = rule.match(ch);
            
            if (value === null)
                continue;
            
            const newtoken = { type: rule.name(), value: value, begin: begin, end: scanner.position() - 1 };

            if (!token || token.end < newtoken.end)
                token = newtoken;
        }

        if (token)
            return token;

        return {
            type: 'unknown',
            value: ch,
            begin: begin,
            end: scanner.position() - 1
        };
    };
    
    function skipSpaces() {
        var ch = scanner.scan();
        
        while (ch && ch <= ' ')
            ch = scanner.scan();
        
        if (ch)
            scanner.seek(scanner.position() - 1);
    }
}

function createLexer(text) {
    return new Lexer(text);
}

module.exports = {
    define: defineRule,
    lexer: createLexer
};

