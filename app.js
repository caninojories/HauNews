var express = require('express')
var app = express()

app.use(express.static(__dirname + '/public'));
app.set('port', process.env.PORT || 3000);
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

app.listen(app.get('port'), function() {
  console.log("Listening to port: " + app.get('port'));
});

app.get('/user/verify/:id', function(req, res){
  res.sendFile('verify.html',{ root: __dirname + '/public'});
})
