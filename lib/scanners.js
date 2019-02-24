
function Scanner() {
    this.position = function () { return 0; }
}

function createScanner() {
    return new Scanner();
}

module.exports = {
    scanner: createScanner
}

