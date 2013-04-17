
/**
 * Module dependencies.
 */

var express = require('express')
  , fs = require('fs')
  , http = require('http')
  , path = require('path')
  , io = require('socket.io')
  , mime = require('mime')
  , routes = require('./routes')
  , Mediator = require('./lib/mediator')
  , models = require('./models')
  , Play = models.Play
  , db = models.db;

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
//TODO routes.play.show
app.get('/plays/:timestamp', routes.play.show);
app.get('/plays/:timestamp/animation', routes.play.animation);

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
  var files = req.files;
  var animation;
  var frames = [];
  console.log('req:',req);
  var timestamp = req.query['timestamp'];

  Object.keys(files).forEach(function(file) { 
    var fileInfo = files[file];
    var path = fileInfo['path'];
    var name = fileInfo['name'];
    var buf = fs.readFileSync(path);
    console.log('mime.lookup(name):'+mime.lookup(name));
    if(mime.lookup(name) == 'image/gif' ){
      animation = buf;
    }else{
      frames.push(buf);
    }
  });

  //TODO fileを読み込んでdbに保存
  Play.findOne({timestamp: timestamp}, function(err, play){
    //play.frames = 'frames';
    play.animation = animation;
    play.frames = frames;

    play.save(function(err, play){
      if(err) return res.send(500);
      mediator.semaphoreEnd(play.timestamp);
      res.send(200);
    });
  });
});
