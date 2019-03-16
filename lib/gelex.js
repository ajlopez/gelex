
const scanners = require('./scanners');

const rules = [];

function isManyExpression(expr) {
    return expr.length > 1 && expr[expr.length - 1] === '*';
}

function AndRule(name, rules) {
    this.name = function () { return name; };
    this.match = function (ch, scanner) {
        var result = '';
        
        for (var n = 0; n < rules.length; n++) {
            if (n)
                ch = scanner.scan();
            
            const rule = rules[n];
            const value = rule.match(ch, scanner);
            
            if (value == null)
                return null;

            result += value;
        }

        return result;
    };
}

function ManyRule(name, rule) {
    this.name = function () { return name; };
    
    this.match = function(ch, scanner) {
        var value = '';
        
        while (rule.match(ch, scanner)) {
            value += ch;
            ch = scanner.scan();
        }
        
        if (ch)
            scanner.seek(scanner.position() - 1);
        
        return value;
    };
}

function CharRule(name, data) {
    this.name = function () { return name; };
    this.match = function(ch) { return data.indexOf(ch) >= 0 ? ch : null; };
}

function createRule(name, data) {
    const rules = [];
    
    while (data.length) 
        if (data[0] === '[') {
            const p = data.indexOf(']');
            let rule = new CharRule(name, data.substring(1, p));
            data = data.substring(p + 1);
            
            rules.push(rule);
        }
        else if (data[0] === '*' && rules.length) {
            rules[rules.length - 1] = new ManyRule(name, rules[rules.length - 1]);
            data = data.substring(1);
        }    
        else {
            const rule = new CharRule(name, data[0]);
            data = data.substring(1);
            rules.push(rule);
        }
        
    if (rules.length === 0)
        return null;
    
    if (rules.length === 1)
        return rules[0];
    
    return new AndRule(name, rules);
}

function defineRule(name, data) {
    rules.push(createRule(name, data));
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

        const p = scanner.position();

        for (var n in rules) {
            scanner.seek(p);

            const rule = rules[n];
            const value = rule.match(ch, scanner);
            
            if (value === null)
                continue;
            
            const newtoken = { type: rule.name(), value: value, begin: begin, end: scanner.position() - 1 };

            if (!token || token.end < newtoken.end)
                token = newtoken;            
        }

        if (token) {
            scanner.seek(token.end + 1);
            return token;
        }

        scanner.seek(p);
        
        return {
            type: 'unknown',
            value: ch,
            begin: begin,
            end: p - 1
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

