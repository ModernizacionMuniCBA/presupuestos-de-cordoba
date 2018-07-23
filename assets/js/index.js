var selectedYear = "2018";
// var selectY ;

jQuery(window).bind('hashchange', function () {
  //detect hash change
  var tab = window.location.hash.slice(1);
  finishedDrawing();
  var text_selected = $(this).data('year');
  selectedYear = tab;
  Cookies.set('year', selectedYear);
  dibujar();
  $(".dropdown .selectedYear").text(tab);
  $(".dropdown .selectedYear").attr("href", "#"+tab);

});

$(document).ready(function() {

  var URLactual = window.location;
  var url = URLactual.toString();
  var seleccionado = url.substring(url.indexOf('#')+1, url.indexOf('#')+5);
  if(seleccionado == 'http'){seleccionado = 2018;}
  if (Cookies.get('year') == undefined) {
    selectedYear = seleccionado;
    Cookies.set('year', seleccionado);
    dibujar();
    $(".dropdown .selectedYear").text(seleccionado);
    $(".dropdown .selectedYear").attr("href", "#"+seleccionado);
  } else {
    selectedYear = seleccionado;
    Cookies.set('year', seleccionado);
    dibujar();
    $(".dropdown .selectedYear").text(seleccionado);
    $(".dropdown .selectedYear").attr("href", "#"+seleccionado);
  }

  finishedDrawing();
  $(".selected li a").click(function(e){
    var text_selected = $(this).data('year');
    selectedYear = text_selected;
    Cookies.set('year', selectedYear);
    dibujar();
    $(".dropdown .selectedYear").text(text_selected);
    $(".dropdown .selectedYear").attr("href", "#"+text_selected);
  });
});


var uuid_analytics = "UA-79840006-1";

(function(i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r;
  i[r] = i[r] || function() {
    (i[r].q = i[r].q || []).push(arguments)
  }, i[r].l = 1 * new Date();
  a = s.createElement(o),
    m = s.getElementsByTagName(o)[0];
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

ga('create', uuid_analytics, 'auto');

window.touchAnalytics = function(page, title) {
  ga('send', 'pageview', {
    'page': page,
    'title': title
  });
};
