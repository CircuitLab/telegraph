
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , io = require('socket.io')
  , Mediator = require('./lib/mediator');

var app = express();
var pkg = require('./package');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

app.locals.title = pkg.title;

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.front.index);


app.get('/admin', routes.admin.index);
// app.get('/trials/:id');

// app.post('/trials/:id/pictures', function(req, res) {
// });

var server = http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
var socket = io.listen(server);
var mediator = new Mediator(socket);

app.post('/plays/:timestamp/pictures', function(req, res){
  //TODO gifの保存
  //mimetypeで jpg gifで振り分け
  var file = req.files.upfile;
  // console.log('file.path:',file.path);
  console.log('req.files', req.files);
  res.send(200);
  mediator.uploaded();
});

