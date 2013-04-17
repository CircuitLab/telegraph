$(document).ready(function(){
  var socket = io.connect();
  var qrSize = 300;
  var $front = $('#front');
  var $input = $('#input');
  var $semaphore = $('#semaphore ');
  var $end = $('#end');
  var $qrcode = $('#qrcode');
  var $url = $('#url');
  var $startButton = $('#startButton');
  var $shareButton = $('#shareButton');
  var $endButton = $('#endButton');
  var $form = $('form');
  var $inputText = $('input[type="text"]');
  var $input = $('#input');

  $startButton.on('click touchEnd',function(){
    var href = $(this).attr('href');
    socket.emit(href);
    return false;
  });

  $shareButton.on('click touchEnd',function(){
    var href = $(this).attr('href');
    var timestamp = $(this).attr('timestamp');
    socket.emit(href, timestamp);
    return false;
  });

  $endButton.on('click touchEnd',function(){
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
    $qrcode.attr('src', qrcode);
    showOnly($end);
  });

  socket.on('shared', function(info){
    alert('shareしました。');
  });

  socket.on('ended',function(info){
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