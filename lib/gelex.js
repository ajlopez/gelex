
const scanners = require('./scanners');

const rules = [];

function isManyExpression(expr) {
    return expr.length > 1 && expr[expr.length - 1] === '*';
}

function AndRule(rules) {
    this.match = function (scanner) {
        var result = '';

        const begin = scanner.position();
        
        for (var n = 0; n < rules.length; n++) {
            const rule = rules[n];
            const value = rule.match(scanner);
            
            if (!value) {
                scanner.seek(begin);
                return null;
            }

            result += value;
        }

        return result;
    };
}

function OrRule(rules) {
    this.match = function (scanner) {
        const begin = scanner.position();

        var result = null;
        var resultend;
        
        for (var n = 0; n < rules.length; n++) {
            scanner.seek(begin);
            
            const rule = rules[n];
            const value = rule.match(scanner);
            
            if (!value)
                continue;
            
            if (!result || result.length < value.length) {
                result = value;
                resultend = scanner.position();
            }
        }

        if (result) {
            scanner.seek(resultend);
            return result;
        }
        
        scanner.seek(begin);
        
        return null;
    };
}

function ManyRule(rule) {
    this.match = function(scanner) {
        var begin = scanner.position();
        var value = '';
        var result;
        
        while (result = rule.match(scanner))
            value += result;
                
        return value;
    };
}

function CharRule(data) {
    this.match = function(scanner) {
        const begin = scanner.position();
        const ch = scanner.scan();
       
        if (data.indexOf(ch) >= 0)
           return ch;
       
       scanner.seek(begin);
       
       return null;
    }
}

function RangeRule(from, to) {
    this.match = function(scanner) { 
        const begin = scanner.position();
        const ch = scanner.scan();
       
        if (ch >= from && ch <= to)
            return ch;
        
        scanner.seek(begin);
        
        return null; 
    };
}

function LexerDefinition() {
    const rules = [];
    
    function createOrRule(data) {
        const rules = [];

        while (data.length)
            if (data[1] === '-') {
                const from = data[0];
                const to = data[2];
                data = data.substring(3);
                
                rules.push(new RangeRule(from, to));
            }
            else {
                rules.push(new CharRule(data));
                data = '';
            }
            
        if (rules.length === 0)
            return null;
        
        if (rules.length === 1)
            return rules[0];
        
        return new OrRule(rules);
    }
    
    function createRule(data) {
        const rules = [];
        
        while (data.length) 
        if (data[0] === '[' && data.indexOf(']') > 0) {
                const p = data.indexOf(']');
                const subdata = data.substring(1, p);
                const rule = createOrRule(subdata);
                data = data.substring(p + 1);
                
                rules.push(rule);
            }
            else if (data[0] === '*' && rules.length) {
                rules[rules.length - 1] = new ManyRule(rules[rules.length - 1]);
                data = data.substring(1);
            }    
            else {
                const rule = new CharRule(data[0]);
                data = data.substring(1);
                rules.push(rule);
            }
            
        if (rules.length === 0)
            return null;
        
        if (rules.length === 1)
            return rules[0];
        
        return new AndRule(rules);
    }

    this.define = function (name, data) {
        if (Array.isArray(data))
            for (let k = 0; k < data.length; k++)
                rules.push({ name: name, rule: createRule(data[k]) });
        else
            rules.push({ name: name, rule: createRule(data) });
    };
    
    this.lexer = function (text) {
        return new Lexer(text, rules);
    };
}

function Lexer(text, rules) {
    const scanner = scanners.scanner(text);

    this.position = function () { return scanner.position(); };
    
    this.next = function () {
        skipSpaces();

        if (!scanner.peek())
            return null;
        
        const begin = scanner.position();
        
        var token = null;

        for (var n in rules) {
            scanner.seek(begin);
            
            const rule = rules[n];
            const value = rule.rule.match(scanner);
            
            if (value === null)
                continue;
            
            const newtoken = { type: rule.name, value: value, begin: begin, end: scanner.position() - 1 };

            if (!token || token.value.length < newtoken.value.length)
                token = newtoken;            
        }

        if (token) {
            scanner.seek(token.end + 1);
            return token;
        }

        scanner.seek(begin);
        
        const ch = scanner.scan();
        
        return {
            type: 'unknown',
            value: ch,
            begin: begin,
            end: begin
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

module.exports = {
    definition: function () { return new LexerDefinition(); }
};

