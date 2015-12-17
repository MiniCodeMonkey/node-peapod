/* global describe, it */

var Peapod = require('..');
var assert = require('assert');

describe('Peapod', function () {
    var config = {
        username: process.env.PEAPOD_USERNAME,
        password: process.env.PEAPOD_PASSWORD
    };

    var authenticatedClient = new Peapod(config);

    it('Is instantiable', function () {
        var client = new Peapod();
        assert(client instanceof Peapod);
    });

    it('Is configurable', function () {
        var config = {
            foo: 'bar'
        };

        var client = new Peapod(config);

        assert(typeof client.config !== 'undefined');

        assert(typeof client.config.username !== 'undefined');
        assert.equal(client.config.username, '');

        assert(typeof client.config.password !== 'undefined');
        assert.equal(client.config.password, '');
    });

    it('Has prototype methods', function () {
        var client = new Peapod();
        assert(typeof client.search === 'function');
    });

    it('Can Search', function (done) {
        this.timeout(10000);

        authenticatedClient.search('yogurt', function (err, results) {
            assert(err === null);
            assert(results.products.length > 1);
            done();
        });
    });

    it('Can Add to Cart', function (done) {
        this.timeout(10000);

        var productId = 146412; // Fage Total 2% Greek Yogurt Strained with Honey Low Fat All Natural

        authenticatedClient.addToCart(productId, 1, function (err, didSucceed) {
            assert(err === null);
            assert(didSucceed);
            done();
        });
    });

    it('Can View Cart', function (done) {
        this.timeout(10000);

        authenticatedClient.viewCart(function (err, results) {
            assert(err === null);
            assert(results.items.length > 0);
            done();
        });
    });

    it('Can Remove from Cart', function (done) {
        this.timeout(10000);

        var productId = 146412; // Fage Total 2% Greek Yogurt Strained with Honey Low Fat All Natural

        authenticatedClient.removeFromCart(productId, function (err, didSucceed) {
            assert(err === null);
            assert(didSucceed);
            done();
        });
    });
});
