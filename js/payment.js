$(function() {
  /* get config */
  if (!getLocalStorage('invCode')) {
    return window.location.href = "./index.html"
  }

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
        init(req.data);
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

/* init */
function init(data) {
  setTimeout(function() {
    $('.mask').fadeOut(600, function() {
      $('body').css({ overflowX: 'hidden', overflowY: 'auto'});
      $('#contaier').fadeIn(1000);
    });
  }, 1500);

  $('#chain span').html(data.cny_name);
  $('#warningPrice').html(data.unit_price + ' ' + data.cny_name);

  /* transaction search */
  var alertMaskEle = $('.alert-mask');
  var loadingEle = $('.alert-loading');
  var alertEle = $('.alert');
  $('#search-btn').click(function() {
    alertMaskEle.show();
    loadingEle.show();
    var transactionId = $('#searchId').val();
    // var email = $('#email').val();
    $.ajax({
      url: 'http://47.244.198.190:9901/cpmsserver/v1/checkorder',
      type: "GET",
      dateType:'json',
      beforeSend: function(request) {
        request.setRequestHeader("access_token", "PbiO7Fs4aFSZbGtfFqcGl9LuVrwFDoAytgdBq");
      },
      data: {
        order_id: transactionId,
        // email: email,
        // user_level: getLocalStorage('lv'),
        // invite_code: getLocalStorage('invCode')
      },
      success: function(req) {
        // console.log(req);
        if (req.code == 200) {
          var statusText = '';
          switch (req.data.status) {
            case 2:
              statusText = 'Failure to pay';
              break;
            case 3:
              statusText = 'Successful payment';
              break;
            default:
              statusText = 'Waiting for payment';
          }

          loadingEle.hide();
          alertEle.find('.desc').empty().html(statusText);
          alertEle.fadeIn();

          /* key */
          if (req.data.status == 3 && req.data.keys.length) {
            var listEle = $('.key-list');
            var ulEle = listEle.find('ul');
            ulEle.empty();
            req.data.keys.forEach(function(val, key) {
              ulEle.append('<li>' + val + '</li>');
            });
            listEle.show();
          }
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

  /* buy */
  var lv = getLocalStorage('lv');
  var buyInfoELe = $('#buyInfo');
  var cny = data.cny.toLocaleUpperCase();
  var unit_price = data.unit_price;
  var wallet_address = data.wallet_address;

  if (lv == 1) {
    buyInfoELe.find('span').html(unit_price + '&nbsp;' + cny);
  } else {
    $('#buyNum').css('display', 'inline-block');
  }

  $('#buyNum').keyup(function() {
    var buyNum  = $(this).val();
    var reg = new RegExp('^[0-9]*$', 'g');

    if (buyNum == "") {
      return buyInfoELe.find('span').html('0');
    }

    if (!reg.test(buyNum) || buyNum == 0) {
      $(this).val('');
      buyInfoELe.find('span').html('0');
    } else {
      if (lv == 1) {
        buyNum = 1;
        $(this).val(1);
      }

      buyInfoELe.find('span').html(parseFloat(accMul(buyNum,  unit_price)) + '&nbsp;' + cny);
    }
  });

  /* payment */
  var buyBtn = $('#buy-btn');
  buyBtn.click(function() {
    alertMaskEle.show();
    loadingEle.show();
    $('#transactionId').html('').hide();
    $('#goToPay').attr('href', '').hide();
    var email = $('#buy-email').val();

    $.ajax({
      url: 'http://47.244.198.190:9901/cpmsserver/v1/genpaymentinfo',
      type: "POST",
      dateType:'json',
      beforeSend: function(request) {
        request.setRequestHeader("access_token", "PbiO7Fs4aFSZbGtfFqcGl9LuVrwFDoAytgdBq");
      },
      data: {
        email: email,
        key_count: $('#buyNum').val(),
        user_level: getLocalStorage('lv'),
        invite_code: getLocalStorage('invCode')
      },
      success: function(req) {
        // console.log(req);
        if (req.code == 200) {
          $('#transactionId').html('Transaction Id: ' + req.data.order_id).css({
            display: 'block',
            marginTop: '46px',
            textAlign: 'left',
            lineHeight: '36px',
            'user-select': 'text'
          });
          $('#goToPay').attr('href', req.data.checkout_url).show();
          loadingEle.hide();
          alertMaskEle.hide();
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
    alertEle.fadeOut(300, function() {
      loadingEle.hide();
      alertMaskEle.hide();
    });
  });

  /* qrcode */
  winner_qrcode(wallet_address);

  /* copy */
  $('#addr #info').html('address: ' + wallet_address);
  winner_copy(wallet_address);
};

/* qrcode */
function winner_qrcode(str) {
  var qrcode = new QRCode(document.getElementById("qrcode"), {
    text: str,
    width: 128,
    height: 128,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
  });
}

/* copy */
function winner_copy (url) {
  var clipboard = new ClipboardJS('#copy', {
    text: function() {
      return url;
    }
  });

  clipboard.on('success', function(e) {
    var alertMaskEle = $('.alert-mask');
    var alertEle = $('.alert');
    alertMaskEle.show();
    alertEle.show();
    alertEle.find('.desc').empty().html('copy success: ' + url);
    alertEle.fadeIn();
  });

  clipboard.on('error', function(e) {
    console.log(e);
  });
}

function accMul(arg1, arg2) {
  var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length;
  } catch (e) {
  }
  try {
    m += s2.split(".")[1].length;
  } catch (e) {
  }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", ""))
    / Math.pow(10, m);
}
