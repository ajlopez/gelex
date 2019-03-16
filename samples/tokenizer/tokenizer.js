
const gelex = require('../..');
const def = gelex.definition();

def.define('integer', '[0123456789][0123456789]*');

const text = process.argv[2];

const lexer = def.lexer(text);

var token;

while (token = lexer.next())
    console.dir(token);

