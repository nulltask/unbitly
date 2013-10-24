
var express = require('express');
var app = module.exports = express();

app.set('port', process.env.PORT || 3000);
app.use(app.router);

app.get('/', function(req, res) {
  res.send('hello');
});

app.get('/1', function(req, res) {
  res.redirect('http://' + req.get('Host') + ':' + app.get('port') + '/');
});

app.get('/2', function(req, res) {
  res.redirect('http://' + req.get('Host') + ':' + app.get('port') + '/1');
});

app.get('/loop', function(req, res) {
  res.redirect('http://' + req.get('Host') + ':' + app.get('port') + '/loop');
});