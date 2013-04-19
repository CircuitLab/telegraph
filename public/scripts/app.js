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

    if( !( confirm('tumblrの特設サイトに投稿されます。\nよろしいですか？') ) ){
      return false;
    }

    var timestamp = $(this).attr('timestamp');
    $endButton.addClass('disabled');
    $shareButton.addClass('disabled');
    socket.emit('share', timestamp);
    return false;
  });

  $endButton.on('click',function(){
    if($(this).hasClass('disabled')){ return false;};

    if( !confirm('終了します。\nよろしいですか？') ){
      return false;
    }

    console.log('href:',$(this).attr('href'));
    socket.emit('end');
    return false;
  });

  $form.on('submit', function(){

    var value = $(this).serializeArray();
    var text = $inputText.val();
    console.log('text:',text);
    console.log('value:',value);
    if( (/^\s/.test(text)) || text.length == 0 ){
      alert('何か入力して下さい。');
      return false;
    }

    //var action = $(this).attr('action');
    socket.emit('message', {
      message: value
    });
    $inputText.val('');
    return false;
  })

  $inputText.keypress(function(e){
    var backSpace = 8;
    var enter = 13;
    var inputed = String.fromCharCode(e.keyCode);
    console.log(e.keyCode);
    if(e.keyCode == backSpace){
      return true;
    }
    if(e.keyCode == enter){
      return true;
    }

    if(/[a-zA-Z ]/.test(inputed)){
      console.log('いい：',inputed);
    }else{
      console.log('だめ：',inputed);
      alert('アルファベットかスペースで入力してください。');
      return false;
    }
  });

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

  socket.on('semaphoreEnd', function(path, timestamp){
    var url = 'http://teba.uniba.jp' + path;
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

  // keyboard hide
  $('#input form').on('submit', _submit);

  function _submit(e){
    e.preventDefault();
    var $text = $('#inputText');
    $text.blur();
  };
});