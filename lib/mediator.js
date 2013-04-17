
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

  //INFO index.jadeの <a>と<form>もeventがある。 
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
        emitter.emit('/states/start', timestamp, trimMessage)  
      })
    });

    //TODO tumblr
    client.on('share', function(timestamp){
      var teleTumblr = new TeleTumblr();
      teleTumblr.postPhoto(timestamp, function(){
        console.log('share');
        client.emit('shared');
      }, function(err){
        console.error(err);
      })
    });

    //TODO 状態の初期化
    client.on('end', function(){
      emitter.emit('/end');
      client.emit('ended');
    });

    receiver.on('/captured', function(done, next){
      console.log('/states/captured');
      client.emit('/states/captured', done, next);   
    });
 
  });
}

Mediator.prototype.__proto__ = EventEmitter.prototype;

Mediator.prototype.semaphoreEnd = function(timestamp){
  Play.findOne({timestamp: timestamp}, function(err, play){
    var path = '/plays/'+play.timestamp;
    this._socket.sockets.emit('semaphoreEnd', path, timestamp);
  });

};
