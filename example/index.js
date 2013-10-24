
var extract = require('../');

extract('http://fb.me', function(err, url, stack) {
  if (err) return console.error(err);

  // url: https://www.facebook.com/
  // stack: [ 'http://www.facebook.com/', 'https://www.facebook.com/' ]
  console.log(url, stack);
});
