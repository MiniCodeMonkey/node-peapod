# Peapod

<a href="https://nodei.co/npm/peapod/"><img src="https://nodei.co/npm/peapod.png"></a>

A library for accessing the unofficial [Peapod](http://www.peapod.com) API.

## Installation
    npm install peapod

## Usage

### Configuration

```JavaScript
var Peapod = require('peapod');

var config = {
    username: 'account@example.com',
    password: 'Example',
}

var peapod = new Peapod(config);

```

### Search

```JavaScript
peapod.search('yougurt', function (err, results) {
    console.log(results.products);
});
```

### Cart

```JavaScript
var productId = 146412; // Fage Total 2% Greek Yogurt Strained with Honey Low Fat All Natural
var quantity = 1;

peapod.addToCart(productId, quantity, function (err, didSucceed) {
    console.log(didSucceed);
});

peapod.viewCart(function (err, results) {
    console.log(results.items);
});

peapod.removeFromCart(productId, function (err, didSucceed) {
    console.log(didSucceed);
});
```

## License

The MIT License (MIT)

Copyright (c) 2015 Mathias Hansen & Jake Mercurio

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
