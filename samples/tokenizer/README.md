# Tokenizer sample

Take an string and produce the tokens.

The lexer is defined as
```js
const gelex = require('../..');
const def = gelex.definition();

def.define('integer', '[0123456789][0123456789]*');
def.define('name', '[a-zA-Z_][a-zA-Z0-9_]*');
def.define('delimiter', [ '{', '}', ',', ';' ]);
def.define('operator', [ '+', '-', '*', '/', '==', '===', '**', '^', '!', '|', '||', '&', '&&' ]);
def.defineText('string', "'", "'");
def.defineText('string', '"', '"');
```

Run

```
node tokenized.js <string>
```

Example
```
node tokenizer.js '1 2 42 foo bar + * {},===== "foo" "bar"'
```
(in Windows, use double quotes to enclose the supplied string),

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
