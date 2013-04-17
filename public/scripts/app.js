//scrollのバウンドを消す
document.ontouchmove = function(event){
    event.preventDefault();
};

$(document).ready(function(){
  var socket = io.connect();
  var qrSize = 300;
  var $front = $('#front');
  var $input = $('#input');
  var $semaphore = $('#semaphore');
  var $end = $('#end');
  var $qrImg = $('#qrImg');
  var $url = $('#url');
  var $startButton = $('#startButton');
  var $shareButton = $('#shareButton');
  var $endButton = $('#endButton');
  var $form = $('form');
  var $inputText = $('input[type="text"]');
  var $input = $('#input');
  var $submit = $('input[type=image]');

  $startButton.on('click touchEnd',function(){
    socket.emit('start');
    return false;
  });
  
  $submit.on('click', function(e) {
    $(this).parents('form').trigger('submit');
    return false;
  });

  $shareButton.on('click touchEnd',function(){
    var timestamp = $(this).attr('timestamp');
    socket.emit('share', timestamp);
    return false;
  });

  $endButton.on('click touchEnd',function(){
    console.log('href:',$(this).attr('href'));
    socket.emit('end');
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
    showOnly($semaphore);
    showLetter(value);
  });

  socket.on('/states/captured', function(done, next){
    showOnly($semaphore);
    showLetter(next);
  });

  //TODO qrcodeは googleを使う
  socket.on('semaphoreEnd', function(path, timestamp){
    var url = 'http://' + location.host + path;
    // var qrcode = info.qrcode;
    $url.html(url);
    $shareButton.attr('timestamp', timestamp);
    var qrcode = 'http://chart.apis.google.com/chart?chs='+qrSize+'x'+qrSize+'&cht=qr&chl='+url;
    $qrImg.attr('src', qrcode);
    showOnly($end);
  });

  socket.on('shared', function(isSuccess){
    if(isSuccess){
      alert('shareしました。');
    }else{
      //alert('');
      console.error('share error');
    }
    //socket.emit('end');
  });

  socket.on('ended',function(){
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