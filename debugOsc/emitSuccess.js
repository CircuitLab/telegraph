var Emitter = require('osc-emitter');
var emitter = new Emitter();
emitter.add('localhost', 3486);
emitter.emit('/states/captured','before','S');