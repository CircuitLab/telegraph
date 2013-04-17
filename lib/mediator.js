
var io = require('socket.io');
var Emitter = require('osc-emitter');
var Receiver = require('./osc-receiver');
var EventEmitter = require('events').EventEmitter;

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

      //TODO mongodbに保存
      console.log(timestamp);
      client.emit('semaphoreStart', value);
      emitter.emit('/states/start', timestamp, trimMessage);
    });

    //TODO tumblr
    client.on('share', function(){
      console.log('share');
      client.emit('share');
    });

    //TODO 状態の初期化
    client.on('end', function(){
      emitter.emit('end');
      client.emit('end');
    });

    receiver.on('/captured', function(done, next){
      console.log('success');
      client.emit('/states/captured', done, next);   
    });

    //TODO gifの保存urlの生成
    receiver.on('semaphoreEnd', function(){
      var url = 'http://example.com';
      var qrcode = 'http://presen.php-web.net/wp-content/uploads/2009/02/chart.png';
      client.emit('semaphoreEnd',{
        url: url,
        qrcode: qrcode
      });
    });
  });
}

Mediator.prototype.__proto__ = EventEmitter.prototype;
Mediator.prototype.uploaded = function(){

  this._socket.sockets.emit('semaphoreEnd');
};

