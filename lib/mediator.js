
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

  // this._socket.on('/foo/baz', function() {
  //   this._emitter.emit('/foo/baz');
  // });

  // this._receiver.on('/foo/bar', function(val) {
  //   this._socket.emit('/foo/bar', val);
  // });
  
  //INFO index.jadeの <a>と<form>もeventがある。 
  socket.sockets.on('connection', function(client) {

    client.on('start', function() {
      client.emmit('input');
    });

    client.on('message', function(forms){
      //console.log(forms);
      var message = forms.message[0].value;
      client.emit('semaphoreStart', {
        message: message
      });

    });

    //TODO semaphoreの処理
    client.on('semaphore', function(){

    });

    //TODO QRcode生成とか 
    client.on('semaphoreEnd', function(info){
      //var gif = info.gif;

      //TODO qrcodeのリンクとかを生成して送る。
      client.emit('thanks', newInfo);

    });

    //TODO tumblr gifを受け取る
    client.on('share', function(){
      //client.emit('share', info);
    });

    //TODO 状態の初期化
    client.on('end', function(){
      client.emit('end', info);
    });


  });


}

// var Mediator = require('mediator');
// var socket = io.listen();
// var mediator = new Mediator(socket);
//
// 

Mediator.prototype.__proto__ = EventEmitter.prototype;