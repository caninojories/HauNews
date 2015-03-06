var express = require('express')
var app = express()

app.use(express.static(__dirname + '/public'));
app.set( 'view engine', 'html' );
app.get('/post/:id', function(req, res) {
  res.sendFile('read.html',{ root: __dirname + '/public'});
});

app.get('/cict', function(req, res){
	res.sendFile('department.html',{ root: __dirname + '/public'});
});

app.get('/cba', function(req, res){
	res.sendFile('department.html',{ root: __dirname + '/public'});
});

app.get('/chm', function(req, res){
	res.sendFile('department.html',{ root: __dirname + '/public'});
});

app.get('/cased', function(req, res){
	res.sendFile('department.html',{ root: __dirname + '/public'});
});

app.get('/cea', function(req, res){
	res.sendFile('department.html',{ root: __dirname + '/public'});
});

app.get('/cnams', function(req, res){
	res.sendFile('department.html',{ root: __dirname + '/public'});
});

app.get('/highschool', function(req, res){
	res.sendFile('department.html',{ root: __dirname + '/public'});
});

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})