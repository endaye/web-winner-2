$(function() {
  $.ajax({
    url: 'http://47.244.198.190:9901/cpmsserver/v1/btcconf',
    type: "GET",
    dateType:'json',
    beforeSend: function(request) {
      request.setRequestHeader("access_token", "PbiO7Fs4aFSZbGtfFqcGl9LuVrwFDoAytgdBq");
    },
    success: function(req) {
      // console.log(req);
      if (req.code == 200) {
        $('.payment-btn span').html('Purchase ' + parseFloat(req.data.unit_price) + ' ' + req.data.cny.toLocaleUpperCase());
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

