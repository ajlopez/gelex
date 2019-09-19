# Gelex

Generic lexer, WIP.

## Install

Run
```
npm install gelex
```

## Use

Get the library reference
```js
const gelex = require('gelex')
```

Create a lexer definition
```js
const def = gelex.definition()
```

Define a rule, with token name and expression:
```js
def.define('integer', '[0123456789][0123456789]*');
```
The text between `[` and `]` describe optional characters.

The asterisc `*` indicates zero or more occurrences

Optional characters could be defined in ranges using `-`:
```js
def.define('name', '[a-zA-Z_][a-zA-Z0-9_]*');
```

Define a delimited text (a string):
```js
def.defineText('string', '"', '"');
```
The second argument is the starting text delimiter and the third argument is 
the ending text delimiter.

Escaped characters could be optionally defined:
```js
def.defineText('string', '"', '"',
    {
        escape: '\\',
        escaped: { 'n': '\n', 'r': '\r', 't': '\t' }
    }
);
```
The `escaped` field is a map from mapped character and its final
representation. A escaped character not included in this map
is mapped to itself, ie: an escaped double quote is mapped
to a double quote in the above definition.

Define many rules in one, using an array:
```js
def.define('delimiter', [ '{', '}', ',', ';' ]);
def.define('operator', [ '+', '-', '*', '/', '==', '===', '**', '^', '!', '|', '||', '&', '&&' ]);
```

It is equivalent to define each rule:
```js
def.define('delimiter', '{' );
def.define('delimiter', '}' );
...
```

Matching any character using `[.]`:
```
def.define('anychar', '[.]');
```

Define a rule with transform
```
def.define('symbol', '#[a-zA-Z_][a-zA-Z_]*', trfn);
```
where `trfn` is a function that receives the scanned text value and returns
another value. Example:

```
def.define('symbol', '#[a-zA-Z_][a-zA-Z_]*', 
    function (value) {
        return value.substring(1); // removing initial #
    });
```

Define a custom rule
```
def.define('character', rule);
```
where `rule` is an object with two functions:

- `first()`: returns the initial characters for the rule
- `match(scanner)`: returns null if no match, or the detected value as string if there is a match.

Example, a rule detecting `$a` as the character `a` (as in Smalltalk):

```
function CharacterRule(ch) {
    this.first = function () { return ch; };
    
    this.match = function (scanner) {
        if (scanner.peek() !== ch)
            return null;
        
        scanner.scan();
        
        return scanner.scan();
    };
}
```

Define a comment
```
def.defineComment('/*', '*/');
```
The first argument is the starting text delimiter. The second
argument is the ending text delimiter. Current version does not
support nested comments, yet.

A comment is processed like an space character.

Define a line comment, giving only one argument:
```
def.defineComment('//');
```


Create and use a lexer:
```js
const lexer = def.lexer();

const token = lexer.next();
```

Each token is retrieved in order invoking lexer `next` function.
It returns `null` when the tokens are exhausted.

Each token is an object with fields:

- `type`: the token type name, defined using the `define` function; ie `integer`.
- `value`: the string value of the token
- `begin`: start position in input text
- `end`: end position in input text

Example:

```js
const gelex = require('../..');
const def = gelex.definition();

def.define('integer', '[0123456789][0123456789]*');
def.define('name', '[a-zA-Z_][a-zA-Z0-9_]*');
def.define('delimiter', [ '{', '}', ',', ';' ]);
def.define('operator', [ '+', '-', '*', '/', '==', '===', '**', '^', '!', '|', '||', '&', '&&' ]);
def.defineText('string', "'", "'");
def.defineText('string', '"', '"');

const lexer = def.lexer('1 2 42 foo bar + * {},===== "foo" "bar"');

let token;

while (token = lexer.next())
    console.dir(token);

```

Expected output:

Expected output:

```js
{ type: 'unknown', value: '1', begin: 0, end: 0 }
{ type: 'unknown', value: '2', begin: 2, end: 2 }
{ type: 'integer', value: '42', begin: 4, end: 5 }
{ type: 'name', value: 'foo', begin: 7, end: 9 }
{ type: 'name', value: 'bar', begin: 11, end: 13 }
{ type: 'operator', value: '+', begin: 15, end: 15 }
{ type: 'operator', value: '*', begin: 17, end: 17 }
{ type: 'delimiter', value: '{', begin: 19, end: 19 }
{ type: 'delimiter', value: '}', begin: 20, end: 20 }
{ type: 'delimiter', value: ',', begin: 21, end: 21 }
{ type: 'operator', value: '===', begin: 22, end: 24 }
{ type: 'operator', value: '==', begin: 25, end: 26 }
{ type: 'string', value: 'foo', begin: 28, end: 32 }
{ type: 'string', value: 'bar', begin: 34, end: 38 }
```

## Versions

- Version 0.0.1, first version.
- Version 0.0.2, fixing ManyRule.
- Version 0.0.3, detecting unclosed strings, match any character rule.
- Version 0.0.4, custom rule
- Version 0.0.4, custom rule
- Version 0.0.5, transform function in define
- Version 0.0.6, char function in Lexer
- Version 0.0.7, seek function in Lexer

## Previous work

- [SimpleGrammar](https://github.com/ajlopez/SimpleGrammar)

## Samples

- [Tokenizer](https://github.com/ajlopez/gelex/tree/master/samples/tokenizer)

## References

TBD

## To Do

- Support nested comments
- Detect unclosed comments
- Programming language sample

## License

MIT

## Contribution

Feel free to [file issues](https://github.com/ajlopez/gelex) and submit
[pull requests](https://github.com/ajlopez/gelex/pulls) — contributions are
welcome.

If you submit a pull request, please be sure to add or update corresponding
test cases, and ensure that `npm test` continues to pass.

