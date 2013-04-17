var TeleTumblr = require('../lib/tele-tumblr');
var gifUrl = 'http://teba.uniba.jp/plays/1366171231572/animation';
var timestamp = 1366171231572;
var teleTumblr = new TeleTumblr();

teleTumblr.postPhoto(timestamp, function(id){
  return console.log('たんぶら::id:',id);
}, function(err){
  return console.error(err);
})
