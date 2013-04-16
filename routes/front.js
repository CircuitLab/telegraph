
exports.index = function(req, res) {

  var letters = [];
  for (var charCode = 65; charCode <= 90; charCode++) {
    letters.push(String.fromCharCode(charCode));
  };

  res.render('front/index', { title: 'デバタイプ', letters: letters });
};

// exports.ready = function(req, res){
//   res.render('front/ready', { title: '伝えたい内容を入力！' });
// };

// //TODO oF側にcontentを送る処理
// exports.start = function(req, res){
//   //console.log(req.body.content);
//   var letters = req.body.content.split('');
//   res.render('front/start', { 
//     title: 'start',
//     letters: letters
//   });
// };

// socket.on('connect', function(){
//   socket.on('event', function(data){

//   });
//   //socket.on('disconnect', fucntion(){});
// });