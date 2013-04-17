
var io = require('socket.io');
var Emitter = require('osc-emitter');
var Receiver = require('./osc-receiver');
var EventEmitter = require('events').EventEmitter;
var models = require('../models');
var Play = models.Play;
var db = models.db;
var TeleTumblr = require('./tele-tumblr');

module.exports = Mediator;

/**
 * @param [io.Manager] socket
 */

function Mediator(socket) {
  EventEmitter.call(this);
  var socket = this._socket = socket;  // via. Socket.IO
  var emitter = this._emitter = new Emitter();  // to oF
  var receiver = this._receiver = new Receiver();  // via. oF
  receiver.bind(3486);
  emitter.add('localhost', 9337);

  socket.sockets.on('connection', function(client) {

    client.on('start', function() {
      client.emit('input');
    });

    client.on('message', function(forms){
      var message = forms.message[0].value.toUpperCase();
      var trimMessage = message.replace(/\s|　/g,'');
      var value = trimMessage.split('').shift();
      var timestamp = new Date().getTime();
      var play = new Play({
        timestamp: timestamp,
        message: message
      });

      play.save(function(err){
        if(err){return}
        console.log('timestamp:', timestamp);
        client.emit('semaphoreStart', value);
        emitter.emit('/states/start', timestamp.toString(), trimMessage)  
      })
    });

    client.on('share', function(timestamp){
      var teleTumblr = new TeleTumblr();
      teleTumblr.postPhoto(timestamp, function(tumblrId){
        //console.log('share');
        client.emit('shared',true);
      }, function(err){
        console.error(err);
        client.emit('shared',false);
      });
    });

    client.on('end', function(){
      console.log('end');
      emitter.emit('/end', 0);
      client.emit('ended');
    });

    receiver.on('/captured', function(done, next){
      console.log('/states/captured');
      client.emit('/states/captured', done, next);   
    });
   
    receiver.on('/debug/semaphoreEnd',function(){
      var timestamp = 1366171231572;
      var path = '/plays/'+timestamp;
      client.emit('semaphoreEnd', path, timestamp);
    })

  });
}

Mediator.prototype.__proto__ = EventEmitter.prototype;

Mediator.prototype.semaphoreEnd = function(timestamp){
  var self = this;
  Play.findOne({timestamp: timestamp}, function(err, play){
    var path = '/plays/'+play.timestamp;
    self._socket.sockets.emit('semaphoreEnd', path, timestamp);
  });
};
