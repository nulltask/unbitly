
var extract = require('../');
var assert = require('better-assert');
var app = require('./server');
var base = 'http://0.0.0.0:' + app.get('port');

describe('unbitly', function() {

  before(function(done) {
    app.listen(app.get('port'), done);
  });

  describe('extract', function() {

    it('redirect (1 hop)', function(done) {
      extract(base + '/1', function(err, url, stack) {
        if (err) throw err;
        assert(base + '/' === url);
        assert(1 === stack.length);
        done();
      });
    });

    it('redirect (2 hop)', function(done) {
      extract(base + '/2', function(err, url, stack) {
        if (err) throw err;
        assert(base + '/' === url);
        assert(2 === stack.length);
        done();
      });
    });

    it('redirect (relative path)', function(done) {
      extract(base + '/relative', function(err, url, stack) {
        if (err) throw err;
        assert(base + '/' === url);
        assert(1 === stack.length);
        done();
      });
    });

    it('redirect loop', function(done) {
      extract(base + '/loop', function(err, url, stack) {
        if (err) throw err;
        assert(null === url);
        assert(10 === stack.length);
        done();
      });
    });

    it('redirect loop (maxDepth = 5)', function(done) {
      extract.maxDepth = 5;
      extract(base + '/loop', function(err, url, stack) {
        if (err) throw err;
        assert(null === url);
        assert(5 === stack.length);
        done();
      });
    });

    it('no redirect', function(done) {
      extract(base + '/', function(err, url, stack) {
        if (err) throw err;
        assert(base + '/' === url);
        assert(0 === stack.length);
        done();
      });
    });

    it('unsupported protocol', function(done) {
      extract('foo://bar', function(err, url , stack) {
        assert(err);
        done();
      });
    });

    it('less arguments', function() {
      var assert = require('assert');
      assert.throws(function() {
        extract();
      });
      assert.throws(function() {
        extract(base);
      });
    });
  });
});