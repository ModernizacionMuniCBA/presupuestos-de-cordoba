$(document).ready(function() {
  //Navigation Menu Slider
  $('#nav-expander').on('click', function(e) {
    e.preventDefault();
    $('body').toggleClass('nav-expanded');
    $(this).toggleClass('is-closed is-open');
  });
  $('#nav-close').on('click', function(e) {
    e.preventDefault();
    $('body').removeClass('nav-expanded');
    $('#nav-expander').toggleClass('is-closed is-open');
  });
});
