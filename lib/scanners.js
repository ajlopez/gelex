
function Scanner(text) {
    const l = text ? text.length : 0;
    var p = 0;

    this.position = function () { return p; }

    this.seek = function (newp) { p = newp; }
    
    this.peek = function (length) {
        if (p >= l)
            return null;
        
        if (length)
            return text.substring(p, p + length);
        
        return text[p];
    }

    this.scan = function () {
        if (p >= l)
            return null;

        return text[p++];
    }
}

function createScanner(text) {
    return new Scanner(text);
}

module.exports = {
    scanner: createScanner
}

