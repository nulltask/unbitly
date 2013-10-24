
/**
 * Module dependencies.
 */

var debug = require('debug')('unbitly');
var pkg = require('./package');
var http = require('http');
var parse = require('url').parse;

/**
 * Supported protocol regex.
 */

var supportedRegex = /^https?:$/;

/**
 * Expose `extract`.
 */

module.exports = extract;

/**
 * Extract a given url.
 *
 * @param {String} url
 * @param {Array} stack
 * @param {Function} callback
 */

function extract(url, stack, callback) {
  switch (arguments.length) {
    case 2:
      // url, callback
      callback = stack;
      stack = [];
      break;
    case 3:
      // url, stack, callback
      break;
    default:
      throw new TypeError('url and callback required.');
  }

  var parsed = parse(url);

  if (!supportedRegex.test(parsed.protocol)) {
    return callback(new Error('Unsupported protocol.'), null, stack);
  }

  var options = {
    hostname: parsed.hostname,
    port: parsed.port || ('https:' === parsed.protocol
      ? 443
      : 80),
    path: parsed.path,
    method: 'HEAD',
    headers: {
      'host': parsed.hostname,
      'user-agent': exports.userAgent,
      'accept': '*/*',
      'accept-encoding': 'gzip,deflate'
    }
  };

  var req = http.request(options, function(res) {
    var location = res.headers.location;
    if (location) {
      debug('[%s] redirect detected: %s -> %s', stack.length, url, location);
      stack.push(location);
      if (stack.length >= exports.maxDepth) {
        return callback(null, null, stack);
      }
      return extract(location, stack, callback); // recursive
    }

    debug('[%s] redirect finished: %s', stack.length, url);
    callback(null, url, stack);
  });

  req.once('error', function(err) {
    callback(err, null, stack);
  });

  req.end();
};

/**
 * Max redirection depth.
 */

exports.maxDepth = 10;

/**
 * User agent.
 */

exports.userAgent = 'unbitly ' + pkg.version;
