
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

exports['scan two characters'] = function (test) {
    const scanner = scanners.scanner('01');

    var result = scanner.scan();

    test.equal(result, '0');
    test.equal(scanner.position(), 1);

    var result = scanner.scan();

    test.equal(result, '1');
    test.equal(scanner.position(), 2);

    test.equal(scanner.scan(), null);
};

exports['scan same character twice'] = function (test) {
    const scanner = scanners.scanner('0');

    var result = scanner.scan();

    test.equal(result, '0');
    test.equal(scanner.position(), 1);

    scanner.seek(0);

    var result = scanner.scan();

    test.equal(result, '0');
    test.equal(scanner.position(), 1);

    test.equal(scanner.scan(), null);
};

exports['peek first character'] = function (test) {
    const scanner = scanners.scanner('0123');

    test.equal(scanner.peek(), '0');
    test.equal(scanner.position(), 0);
};

exports['peek first character using length'] = function (test) {
    const scanner = scanners.scanner('0123');

    test.equal(scanner.peek(1), '0');
    test.equal(scanner.position(), 0);
};

exports['peek first two characters using length'] = function (test) {
    const scanner = scanners.scanner('0123');

    test.equal(scanner.peek(2), '01');
    test.equal(scanner.position(), 0);
};

