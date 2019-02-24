
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

exports['scan character'] = function (test) {
    const scanner = scanners.scanner('0');

    const result = scanner.scan();

    test.equal(result, '0');

    test.equal(scanner.position(), 1);
    test.equal(scanner.scan(), null);
};

