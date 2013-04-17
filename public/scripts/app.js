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
  var $okBtn = $('#okBtn');

  $startButton.on('click',function(){
    socket.emit('start');
    return false;
  });

  $shareButton.on('click',function(){
    if($(this).hasClass('disabled')){ return false;};

    var timestamp = $(this).attr('timestamp');
    $endButton.addClass('disabled');
    $shareButton.addClass('disabled');
    socket.emit('share', timestamp);
    return false;
  });

  $endButton.on('click',function(){
    if($(this).hasClass('disabled')){ return false;};

    console.log('href:',$(this).attr('href'));
    socket.emit('end');
    return false;
  });

  $form.on('submit', function(){
    var value = $(this).serializeArray();
    //var action = $(this).attr('action');
    socket.emit('message', {
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
    $shareButton.addClass('disabled');
    $endButton.removeClass('disabled');
    //socket.emit('end');
  });

  socket.on('ended',function(){
    $shareButton.removeClass('disabled');
    $endButton.removeClass('disabled');
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