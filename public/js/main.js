
$('document').ready(function () {
  "use strict"; // Start of use strict

  //-- Auto selecting City & State on adding the pincode
  var findpin = $('#pinCode');
  var pinError = $('#pinError');
  pinError.hide();
  findpin.on('load change paste keyup blur', function () {
    function addCode(val1, val2) {
      $("#city").attr('value', val2);
      $('#state').attr('value', val1);
      $("#cityName").attr('value', val2);
      $('#stateName').attr('value', val1);
    }
    if (findpin.val().length == 6) {
      $.getJSON("https://secure.geonames.org/postalCodeLookupJSON?&country=IN&callback=?", { postalcode: this.value }, function (data) {
        if (data && data.postalcodes && data.postalcodes.length > 0) {
          pinError.hide();
          addCode(data.postalcodes[0].adminName1, data.postalcodes[0].adminName2);
        } else {
          addCode('', '');
          pinError.show();
        }
      })
    } else {
      addCode('', '');
      pinError.show();
    }
  });

  //-- Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 54)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function () {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#mainNav',
    offset: 64
  });

  //-- Timeline functionality
  var date = new Date(),
    currentDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  $("event").each(function () {
    var specifiedDate = $(this).data('date');
    if (specifiedDate == currentDate) {
      $(this).addClass('complete');
      $(this).find('.status').addClass('active');
    } else if (currentDate > specifiedDate) {
      $(this).addClass('complete');
      $(this).find('.status').removeClass('active');
    } else {
      $(this).removeClass('complete');
    }
  });

  //-- Inhibits null links
  $('a[href="#"],a[href="#0"]').each(function () {
    this.href = 'javascript:void(0);';
  });

}); // End of use strict