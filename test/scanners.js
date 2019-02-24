
const scanners = require('../lib/scanners');

exports['create scanner'] = function (test) {
    const scanner = scanners.scanner();

    test.ok(scanner);
    test.equal(typeof scanner, 'object');
};

exports['initial position'] = function (test) {
    const scanner = scanners.scanner();

    test.equal(scanner.position(), 0);
};

