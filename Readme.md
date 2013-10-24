
# unbitly

  Shortened URL extractor

## Installation

npm:

    $ npm install unbitly

## Usage

```javascript
var extract = require('unbitly');

extract('http://fb.me', function(err, url, stack) {
  if (err) return console.error(err);

  // url: https://www.facebook.com/
  // stack: [ 'http://www.facebook.com/', 'https://www.facebook.com/' ]
  console.log(url, stack);
});
```

## License 

The MIT License

Copyright (c) 2013 Seiya Konno &lt;nulltask@gmail.com&gt;
