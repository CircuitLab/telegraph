var OscReceiver = require('./lib/osc-receiver.js');

var receiver = new OscReceiver();
receiver.bind(7000);
receiver.on('/3/rotary3', function(v){
  console.log(v);
});