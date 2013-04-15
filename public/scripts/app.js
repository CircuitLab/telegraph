$(document).ready(function(){
  // ここに処理を記述します
  var socket = io.connect();
  //socket.emit('connection', {});

  $('a').on('click touchEnd',function(){
    var href = $(this).attr('href');
    socket.emit(href, {});
    return false;
  });

  $('form').on('submit', function(){
    var value = $(this).serializeArray();
    var action = $(this).attr('action');
    socket.emit(action, {
      message: value
    });
    //console.log(values);
    return false;
  })

  //TODO #inputを表示
  socket.on('input',function(){
    
  });

  //TODO #semaphoreを実装
  socket.on('semaphoreStart', function(info){
    
    var message = info.message;

    //TODO 終了した時の処理
    setInterval(function(){
      socket.emit('semaphoreEnd');
    }, 2000);
  });


  //TODO #thanksを表示
  socket.on('thanks',function(info){

  });

  //TODO shareした時の画面を表示する
  socket.on('share',function(info){

  });

  //TODO 初期画面に戻る。
  socket.on('end',function(info){

  });

});