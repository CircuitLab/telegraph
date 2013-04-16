$(document).ready(function(){
  var socket = io.connect();
  //socket.emit('connection', {});
  var $front = $('#front');
  var $input = $('#input');
  var $semaphore = $('#semaphore ');
  var $end = $('#end');
  var $qrcode = $('#qrcode');
  var $url = $('#url');
  var $a = $('a');
  var $form = $('form');
  var $inputText = $('input[type="text"]');
  var $input = $('#input');
  //var info = undefined;

  $a.on('click touchEnd',function(){
    var href = $(this).attr('href');
    socket.emit(href);
    return false;
  });

  $form.on('submit', function(){
    var value = $(this).serializeArray();
    var action = $(this).attr('action');
    socket.emit(action, {
      message: value
    });
    $inputText.val('');
    return false;
  })

  socket.on('input',function(){
    showOnly($input);
  });

  socket.on('semaphoreStart', function(value){
    //info = dataInfo;
    //console.log(info);
    showOnly($semaphore);
    showLetter(value);
  });

  socket.on('/states/captured', function(done, next){
    console.log('next:',next);
    showOnly($semaphore);
    showLetter(next);
  });

  socket.on('semaphoreEnd', function(info){
    var url = info.url;
    var qrcode = info.qrcode;
    $url.html(url);
    $qrcode.attr('src', qrcode);
    showOnly($end);
  });

  socket.on('share', function(info){
    alert('shareしました。');
  });

  socket.on('end',function(info){
    info = undefined;
    showOnly($front);
  });

  function showOnly($visible){
    $front.hide();
    $input.hide();
    $semaphore.hide();
    $end.hide();
    $visible.show();
  }

  function showLetter(letter){
    $('.letter').hide();
    $('#'+letter).show();
  }


});