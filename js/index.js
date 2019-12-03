$(function() {
  setTimeout(function() {
    $('.mask').fadeOut(600, function() {
      $('body').css({ overflowX: 'hidden', overflowY: 'auto'});
      $('#contaier').fadeIn(1000);
      $('#star').fadeIn(1000);
    });
  }, 1500);

  /* inv */
  var alertMaskEle = $('.alert-mask');
  var loadingEle = $('.alert-loading');
  var alertEle = $('.alert');
  $('#inv-btn').click(function() {
    var inv = $('#inv').val();
    alertMaskEle.show();
    loadingEle.show();

    $.ajax({                   
      url: 'http://47.244.198.190:9901/cpmsserver/v1/checkcode',
      type: "GET",             
      dateType:'json',         
      beforeSend: function(request) { 
        request.setRequestHeader("access_token", "PbiO7Fs4aFSZbGtfFqcGl9LuVrwFDoAytgdBq");
      },
      data: {
        invite_code: inv
      },
      success: function(req) {
        // console.log(req);
        if (req.code == 200) {
          $('#inv').val('');
          setLocalStorage('invCode', req.data.code);
          setLocalStorage('lv', req.data.level);
          window.location.href = './home.html';
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // console.log(XMLHttpRequest, textStatus, errorThrown);
        // console.log(XMLHttpRequest.responseJSON.msg);

        setTimeout(function() {
          if (XMLHttpRequest.responseJSON.code != 200) {
            loadingEle.hide();
            alertEle.find('.desc').empty().html(XMLHttpRequest.responseJSON.msg);
            alertEle.fadeIn();
          }
        }, 1000);
      }
    });
  });

  /* close alert */
  alertEle.click(function() {
    alertEle.fadeOut(1000, function() {
      loadingEle.hide();
      alertMaskEle.hide();
    });
  });
});
