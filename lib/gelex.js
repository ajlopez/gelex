
const scanners = require('./scanners');

function isManyExpression(expr) {
    return expr.length > 1 && expr[expr.length - 1] === '*';
}

function CommentRule(start, end) {
    this.first = function () { return start[0]; };
    
    this.match = function (scanner) {
        if (scanner.peek(start.length) !== start)
            return null;
        
        scanner.seek(scanner.position() + start.length);
        
        while (scanner.peek(end.length) !== end)
            if (!scanner.scan())
                break;
            
        if (scanner.peek(end.length) === end)
            scanner.seek(scanner.position() + end.length);
        
        return start + end;
    }
}

function LineCommentRule(start) {
    this.first = function () { return start[0]; };
    
    this.match = function (scanner) {
        if (scanner.peek(start.length) !== start)
            return null;
        
        scanner.seek(scanner.position() + start.length);
        
        let ch;
        
        for (let ch = scanner.peek(1); ch != '\n' && ch != '\r'; ch = scanner.peek(1))
                if (!scanner.scan())
                    break;
                    
        return start;
    }
}

function AndRule(rules) {
    this.first = function () { return rules[0].first(); };
    
    this.match = function (scanner) {
        var result = '';

        const begin = scanner.position();
        
        for (var n = 0; n < rules.length; n++) {
            const rule = rules[n];
            const value = rule.match(scanner);
            
            if (value == null) {
                scanner.seek(begin);
                return null;
            }

            result += value;
        }

        return result;
    };
}

function OrRule(rules) {
    this.first = function () {
        let result = '';
        
        for (let k = 0; k < rules.length; k++)
            result += rules[k].first();
        
        return result;
    };
    
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

function TransformRule(rule, trfn) {
    this.first = function () { return rule.first(); };
    
    this.match = function (scanner) {
        const result = rule.match(scanner);
        
        if (result == null)
            return null;
        
        if (trfn)
            return trfn(result);
        
        return result;
    };
}

function ManyRule(rule) {
    this.first = function () { return rule.first(); };
    
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
    this.first = function () { return data; };
    
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
    this.first = function () {
        let result = '';
        
        const fromvalue = from.charCodeAt(0);
        const tovalue = to.charCodeAt(0);
        
        for (let k = fromvalue; k <= tovalue; k++)
            result += String.fromCharCode(k);
        
        return result;
    };
        
    this.match = function(scanner) { 
        const begin = scanner.position();
        const ch = scanner.scan();
       
        if (ch >= from && ch <= to)
            return ch;
        
        scanner.seek(begin);
        
        return null; 
    };
}

function TextRule(start, end, options) {
    options = options || {};
    
    this.first = function () { return start[0]; };
    
    this.match = function (scanner) {
        if (scanner.peek(start.length) !== start)
            return null;
        
        scanner.seek(scanner.position() + start.length);

        let result = '';

        while (scanner.peek(end.length) !== end) {
            let ch = scanner.scan();

            if (!ch)
                break;
            
            if (ch === options.escape) {
                ch = scanner.scan();
                
                if (options.escaped && options.escaped[ch])
                    result += options.escaped[ch];
                else
                    result += ch;
                
                continue;
            }

            result += ch;
        }
        
        if (scanner.peek(end.length) === end)
            scanner.seek(scanner.position() + end.length);
        else
            throw new Error('unclosed text');
            
        return result;
    };
}

function LexerDefinition() {
    const rules = {};
    const commentRules = [];
    
    function createOrRule(data) {
        if (data === '.')
            return new RangeRule(String.fromCharCode(0), String.fromCharCode(255));
        
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
    
    function createRule(data, trfn) {
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
            if (trfn)
                return new TransformRule(rules[0], trfn);
            else
                return rules[0];
        
        if (trfn)
            return new TransformRule(new AndRule(rules), trfn);
        else
            return new AndRule(rules);
    }
    
    function addRuleChar(name, rule, ch) {
        if (!rules[ch]) {
            rules[ch] = [ { name: name, rule: rule } ];
            return;
        }
        
        for (let k = 0; k < rules[ch].length; k++)
            if (rules[ch][k].rule === rule)
                return;
            
        rules[ch].push({ name: name, rule: rule });
    }
    
    function addRule(name, rule) {
        const first = rule.first();
        
        for (let k = 0; k < first.length; k++)
            addRuleChar(name, rule, first[k]);
    }

    this.define = function (name, data, trfn) {
        if (Array.isArray(data))
            for (let k = 0; k < data.length; k++)
                addRule(name, createRule(data[k], trfn));
        else if (typeof data === 'object')
            addRule(name, data);
        else
            addRule(name, createRule(data, trfn));
    };
    
    this.defineText = function (name, start, end, options) {
        addRule(name, new TextRule(start, end, options));
    }
    
    this.defineComment = function (start, end) {
        if (!end)
            commentRules.push(new LineCommentRule(start));
        else
            commentRules.push(new CommentRule(start, end));
    }
    
    this.lexer = function (text) {
        return new Lexer(text, rules, commentRules);
    };
}

function Lexer(text, rules, commentRules) {
    const scanner = scanners.scanner(text);

    this.position = function () { return scanner.position(); };
    
    this.seek = function (newposition) { scanner.seek(newposition); };
    
    this.char = function (ch) {
        skipSpacesAndComments(ch);
        
        const firstch = scanner.peek();
        
        if (firstch === ch) {
            const position = scanner.position();
            const ch = scanner.scan();
            
            return {
                type: 'char',
                value: ch,
                begin: position,
                end: position
            };
        }
        
        return null;
    }
    
    this.next = function () {
        skipSpacesAndComments();

        const firstch = scanner.peek();
        
        if (!firstch)
            return null;
        
        const begin = scanner.position();
        
        if (!rules[firstch]) {
            const ch = scanner.scan();
            
            return {
                type: 'unknown',
                value: ch,
                begin: begin,
                end: begin
            };
        }
        
        var token = null;
        
        const chrules = rules[firstch];

        for (var n in chrules) {
            scanner.seek(begin);
            
            const rule = chrules[n];
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
    
    function skipSpacesAndComments(except) {
        let begin = scanner.position();
        
        skipSpaces(except);
        skipComments();
        
        while (begin != scanner.position()) {
            begin = scanner.position();
            skipSpaces(except);
            skipComments();
        }
    }
    
    function skipSpaces(except) {
        var ch = scanner.scan();
        
        while (ch && ch <= ' ' && !rules[ch] && ch !== except)
            ch = scanner.scan();
        
        if (ch)
            scanner.seek(scanner.position() - 1);
    }
    
    function skipComments() {
        for (let k = 0; k < commentRules.length; k++)
            commentRules[k].match(scanner);
    }
}

module.exports = {
    definition: function () { return new LexerDefinition(); }
};

