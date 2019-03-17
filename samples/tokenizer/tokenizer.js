
const gelex = require('../..');
const def = gelex.definition();

def.define('integer', '[0123456789][0123456789]*');
def.define('name', '[a-zA-Z_][a-zA-Z0-9_]*');
def.define('delimiter', [ '{', '}', ',', ';' ]);
def.define('operator', [ '+', '-', '*', '/', '==', '===', '**', '^', '!', '|', '||', '&', '&&' ]);
def.defineText('string', "'", "'");
def.defineText('string', '"', '"');

const text = process.argv[2];

const lexer = def.lexer(text);

var token;

while (token = lexer.next())
    console.dir(token);

