$(document).ready(function(){
  console.log('ready');
  // console.log(localStorage.getItem('praytime'));

  var today_date = function() {
    var today = new Date();
    $('.today_date').append(dateFormat("dddd, mmmm dS yyyy"));
    $('.hour').prepend(dateFormat("hh:MM TT"));
  }

  if (localStorage.getItem("praytime")) {
    console.log('localStorage');
    var data = JSON.parse(localStorage.getItem("praytime"));

    $('#loading').css('display', 'none');
    $('#prayers_app .main').css('display', 'block');
    showhour(data);
    today_date();

  } else {
    function success(position) {
      console.log('success');
      salatAPI = "http://muslimsalat.com/"+position.coords.latitude+" "+position.coords.longitude+"/daily.json?key=6c8f3b746d6abcac6d1a3e85fe605a05";
      console.log(salatAPI);
      request();
      today_date();
    }

    function error(position) {
      console.log('fail');
      fail();
    }

    console.log('No localStorage');

    navigator.geolocation.getCurrentPosition(success, error);
  }



  function showhour(data) {
    var items = data.items;
    $.each(items, function(i, vals){
      $('.prayers_list .main').prepend('<ul class="praytime_list '+ i +' '+ vals.date_for + '"></ul>');

      $.each(vals, function(iv, val){
        if (iv != 'shurooq') {
          if (iv == 'date_for') {
            $('.praytime_list.'+i).append('<li class="pray_day ' + iv +'"></li>');
            $('.praytime_list.'+i+' > .pray_day.'+iv)
            .append('<span class="day">'+ val +'</span>');
          } else {
            $('.praytime_list.'+i).append('<li class="praytime ' + iv +'"></li>');
            $('.praytime_list.'+i+' > .praytime.'+iv)
            .append('<span class="pray">'+ iv +'</span>')
            .append('<span class="time">'+ val +'</span>');
          }
        }
      });
    });
  }

  var result = function(data) {
    $('#loading').css('display', 'none');
    $('#prayersapp .main').css('display', 'block');
    var store_data = JSON.stringify(data);

    var store_settings = {};
    store_settings.period = data.for;
    store_settings.method = data.method;
    store_settings.method = data.method;
    store_settings.town = data.city;
    // console.log(store_settings);
    var store_settings = JSON.stringify(store_settings);

    if (window.localStorage) {
      localStorage.setItem("praytime",store_data);
      localStorage.setItem("settings",store_settings);
    }

    showhour(data);

  };

  var fail = function() {
    $('#loading').css('display', 'block');
    // $('#loading').html(' Something wrong ! ');
    alert('Please check your internet conection');

  }

  var throbber = function() {
    $('#loading').css('display', 'block');
    $('#prayersapp .main').css('display', 'none');
  };

  var request = function(){

    var xhr = new XMLHttpRequest({mozSystem: true});

    xhr.open("GET", salatAPI, true);

    xhr.onreadystatechange = function() {

      if (xhr.readyState == 4) {
        console.log(xhr);
        if(xhr.status == '200') {
          console.log(xhr.responseText);
          data = JSON.parse(xhr.responseText);
          result(data);
        }
      }
    }
    xhr.send();
  }

  $('#prayers_settings .finish').on('click', function(){
    var settings = {};
    settings.town = $('#town').val();
    settings.method = $('#method').val();
    settings.period = $('#period').val();

    settings = JSON.stringify(settings);

    if (window.localStorage) {
      localStorage.setItem("settings",settings);
    }

    // console.log(settings);
    $('#prayers_settings').css('display','none');
    $('#prayers_list').css('display', 'block');
  });

  $('#prayers_list .settings').on('click', function(){
    console.log('clicked')
    $('#prayers_settings').css('display','block');
    $('#prayers_list').css('display', 'none');
  });

});

