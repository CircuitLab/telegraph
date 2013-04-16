var Receiver = require('../lib/osc-receiver.js');
console.log(Receiver);
var receiver = new Receiver();
receiver.bind(9337);

//最初にformにニュr得したのをtrimして渡す
receiver.on('start', function(timestamp, trimMessage){
  console.log('timestamp:', timestamp);
  console.log('trimMessage:', trimMessage);
});

receiver.on('end', function(){
  console.log('end');
});