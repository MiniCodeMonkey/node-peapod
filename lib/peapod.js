var request = require('request'),
    async = require('async'),
    extend = require('util')._extend;

/**
 * Peapod constructor
 * @param  {Object} config
 */
var Peapod = function (config) {
    this.config = extend({
        base_url: 'https://www.peapod.com/api/',
        username: '',
        password: ''
    }, config);

    this.isAuthenticated = false;
    this.jar = request.jar();
};

Peapod.prototype.request = function (method, path, params, cb) {
    var self = this;

    if (!this.isAuthenticated) {
        this.authenticate(function(err, isAuthenticated) {
            if (isAuthenticated) {
                self.request(method, path, params, cb);
            } else {
                cb(err);
            }
        });
    } else {
        var options = {
            method: method,
            url: this.config.base_url + path,
            gzip: true,
            jar: this.jar,
            headers: {
                'referer': 'http://www.peapod.com/shop/'
            }
        };

        if (method !== 'GET' && method !== 'DELETE') {
            options.json = params;
        } else {
            options.qs = params;
        }

        request(options, function (err, res, body) {
            if (err || res.statusCode !== 200) {
                self.authenticate(function(err, isAuthenticated) {
                    if (isAuthenticated) {
                        self.request(method, path, params, cb);
                    } else {
                        cb(err);
                    }
                });
            } else if (res.statusCode !== 200) {
                cb(new Error(err));
            } else {
                cb(null, body, res);
            }
        });
    }
};

Peapod.prototype.makeInitialRequest = function(cb) {
    var options = {
        method: 'GET',
        url: 'http://www.peapod.com/shop/auth.jhtml',
        gzip: true,
        jar: this.jar
    };

    request(options, function (err, res, body) {
        if (err) {
            cb(err)
        } else if (res.statusCode !== 200) {
            cb(new Error(body));
        } else {
            cb(null);
        }
    });
};

Peapod.prototype.makeSessionRequest = function(cb) {
    var config = this.config || {};

    var options = {
        method: 'OPTIONS',
        url: this.config.base_url + 'v2.0/user/login',
        gzip: true,
        jar: this.jar,
        headers: {
            'access-control-request-headers': 'accept, content-type',
            'access-control-request-method': 'POST',
            'accept': '*/*'
        }
    };

    request(options, function (err, res, body) {
        if (err) {
            cb(err)
        } else if (res.statusCode !== 200) {
            cb(new Error(body));
        } else {
            cb(null);
        }
    });
};

Peapod.prototype.makeLoginRequest = function(cb) {
    var options = {
      method: 'POST',
      url: this.config.base_url + 'v2.0/user/login',
      gzip: true,
      jar: this.jar,
      headers: {
        'accept': 'application/json, text/plain, */*',
        'referer': 'http://www.peapod.com/shop/auth.jhtml'
      },
      json: {
        loginName: this.config.username,
        password: this.config.password,
        rememberMe: true
      }
    };

    request(options, function (err, res, body) {
        if (err) {
            cb(err)
        } else if (res.statusCode !== 200) {
            cb(new Error(body));
        } else {
            cb(null);
        }
    });
};

Peapod.prototype.authenticate = function (callback) {
    if (typeof callback !== 'function') {
        callback = function() {};
    }

    var self = this;

    async.series([
        function (cb) {
            self.makeInitialRequest(cb);
        },
        function (cb) {
            self.makeSessionRequest(cb);
        },
        function (cb) {
            self.makeLoginRequest(cb);
        }
    ],
    function(err, results) {
        self.isAuthenticated = (err === null);
        callback(err, self.isAuthenticated);
    });
};

Peapod.prototype.search = function (query, callback) {
    var params = {
        'facet': 'singleRootCat,brands,nutrition,specials,newArrivals',
        'facetExcludeFilter': 'true',
        'filter': '',
        'flags': 'true',
        'keywords': query,
        'nutrition': 'true',
        'rows': '120',
        'sort': 'bestMatch+asc',
        'start': '0'
    };

    this.request('GET', 'v2.0/user/products', params, function (err, body, response) {
        if (err) {
            callback(err, null);
        } else {
            var json = JSON.parse(body);
            callback(null, json.response);
        }
    });
};

Peapod.prototype.addToCart = function (productId, quantity, callback) {
    var params = {
        items: [{
            productId: productId,
            quantity: quantity,
            coupon: null
        }]
    };

    this.request('PUT', 'v3.0/user/cart', params, function (err, body, response) {
        if (err) {
            callback(err, null);
        } else {
            var didSucceed = body.response.errors.length <= 0 && body.response.successes.length === 1;

            callback(null, didSucceed);
        }
    });
};

Peapod.prototype.removeFromCart = function (productId, callback) {
    var params = {
        productId: productId
    };

    this.request('DELETE', 'v3.0/user/cart', params, function (err, body, response) {
        if (err) {
            callback(err, null);
        } else {
            var json = JSON.parse(body);
            var didSucceed = json.response.errors.length <= 0 && json.response.successes.length === 1;

            callback(null, didSucceed);
        }
    });
};

Peapod.prototype.viewCart = function (callback) {
    var params = {
        flags: true,
        image: true,
        sort: 'category asc'
    };

    this.request('GET', 'v3.0/user/cart', params, function (err, body, response) {
        if (err) {
            callback(err, null);
        } else {
            var json = JSON.parse(body);
            callback(null, json.response);
        }
    });
};


module.exports = Peapod;

