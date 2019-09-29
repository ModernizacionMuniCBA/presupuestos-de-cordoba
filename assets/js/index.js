var selectedYear = "2019";

// Capturamos evento de hashchange ("#") en la url.
$(window).bind('hashchange', function () {
  //detect hash change
  var tab = window.location.hash.slice(1);
  finishedDrawing();
  var text_selected = $(this).data('year');
  let parsedYear = parseInt(tab, 10);

  // Hay páginas que modifican el hash de la URL con valores
  // que no se corresponden con años. Esto arrastra ciertos otros problemas a lo largo
  // del sitio. Debemos asegurarnos que el hash SEA, al menos, un número.
  if (!isNaN(parsedYear)) {
    selectedYear = parsedYear;
    Cookies.set('year', selectedYear);
    $(".dropdown .selectedYear").text(tab);
    $(".dropdown .selectedYear").attr("href", "#" + parsedYear);
  }

  /*selectedYear = tab;
  Cookies.set('year', selectedYear);
  $(".dropdown .selectedYear").text(tab);
  $(".dropdown .selectedYear").attr("href", "#"+tab);*/
  
  // Cuando nos encontramos en la home, la función "dibujar()" no existe debido
  // a que no se cargan los .js correspondientes y los mismos sólamente
  // son cargados desde las visualizaciones correspondientes.
  // Envolvemos la función dentro de un try como workaround, sin embargo
  // lo ideal es crear un template correctamente y sólo hacer la modificación
  // de datos necesarios según la visualización en la que nos encontremos.
  try { dibujar(); }
  catch { /* No tenemos nada que hacer. */ }
});

$(document).ready(function() {

  var URLactual = window.location;
  var url = URLactual.toString();
  var seleccionado = url.substring(url.indexOf('#')+1, url.indexOf('#')+5);
  if(seleccionado == 'http'){seleccionado = 2019;}
  // -- Para probar en Localhost 
  if (!seleccionado) seleccionado = 2019;
  // --
  
  // -- ???
  /*if (Cookies.get('year') == undefined) {
    selectedYear = seleccionado;
    Cookies.set('year', seleccionado);
    $(".dropdown .selectedYear").text(seleccionado);
    $(".dropdown .selectedYear").attr("href", "#"+seleccionado);
    //dibujar();
  } else {
    selectedYear = seleccionado;
    Cookies.set('year', seleccionado);
    $(".dropdown .selectedYear").text(seleccionado);
    $(".dropdown .selectedYear").attr("href", "#"+seleccionado);
    //dibujar();
  }*/
  // --

  //let yearFromCookies = Cookies.get("year");

  selectedYear = seleccionado;
  Cookies.set("year", seleccionado);
  $(".dropdown .selectedYear").text(seleccionado).attr("href", "#" + seleccionado);
  try { dibujar(); }
  catch { /* No tenemos nada que hacer. */ }

  finishedDrawing();

  $(".yearSelector").click(function(e) {
    //var text_selected = $(this).data('year');
    let text_selected = $(this).attr("data-year");
    let parsedYear = parseInt(text_selected, 10);

    // Hay páginas que modifican el hash de la URL con valores
    // que no se corresponden con años. Esto arrastra ciertos otros problemas a lo largo
    // del sitio. Debemos asegurarnos que el hash SEA, al menos, un número.
    if (!isNaN(parsedYear)) {
      selectedYear = parsedYear;
      Cookies.set('year', selectedYear);
      $(".dropdown .selectedYear").text(text_selected);
      $(".dropdown .selectedYear").attr("href", "#" + parsedYear);
    }
    //try { dibujar(); }
    //catch { /* No tenemos nada que hacer. */ }
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
