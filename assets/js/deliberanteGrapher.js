function dibujarD3_gastos_delibertante() {
  $.getJSON("https://sheets.googleapis.com/v4/spreadsheets/1bYCECQ2H15g3-IbGP3t_F3v0146VC99NqjehOWkkvhY/values/" + selectedYear + "?key=AIzaSyDWqm99ehcgTUcnekuujkT2P95l-kor_mM", function(dataJSON) {
    var $tabla = $("#tbody-gastos-concejo-deliberante");
    var datos = dataJSON.values;
    $tabla.empty();
    for (var key = 1; key < datos.length; key++) {
      var val = datos[key];
      var partida = val[1];
      var nivel = val[0]
      var nivel_princ = parseInt(nivel) + 2;
      var concepto = val[2];
      var total = val[3];
      if (total == undefined) {
        total = 0;
      }

      var mostrar = nivel >= 2 ? " style='display:none'" : '';
      var nivelProximoDato = key + 1 !== datos.length ? datos[key + 1][0] : false;
      var esColapsable = nivel_princ >= 3 && nivelProximoDato > nivel;
      var plus = esColapsable ? ' <button class="btn btn-xs btn-default pull-right"><i class="fa fa-plus "></i></button>' : '';
      var claseColapsable = esColapsable ? ' pointer' : '';
      $tabla.append('<tr' + mostrar + ' class="nivel-' + nivel_princ + claseColapsable + '"><td>' + plus + '</td><th>' + partida + '</th><td>' + concepto + '</td><td>$' + total.toLocaleString("es-AR") + '</td></tr>');
    }

    var $ultimaFila = $tabla.find('tr').last().detach().addClass('total');
    $tabla.prepend($ultimaFila);
  });
}
dibujarD3_gastos_delibertante();

function dibujar() {
  dibujarD3_gastos_delibertante()
}

$("#tbody-gastos-concejo-deliberante").on("click", ".nivel-3", function() {
  var $boton = $(this);
  $filas = $(this).nextUntil(".nivel-3,.nivel-2").filter(".nivel-4");
  if ($filas.length > 0) {
    $boton.find('button>i').toggleClass("fa-plus fa-minus");
    $filas.slideToggle();
  }
});
$("#tbody-gastos-concejo-deliberante").on("click", ".nivel-4", function() {
  var $boton = $(this);
  $filas = $(this).nextUntil(".nivel-4,.nivel-3").filter(".nivel-5");
  if ($filas.length > 0) {
    $boton.find('button>i').toggleClass("fa-plus fa-minus");
    $filas.slideToggle();
  }
});
$("#tbody-gastos-concejo-deliberante").on("click", ".nivel-5", function() {
  var $boton = $(this);
  $filas = $(this).nextUntil(".nivel-5,.nivel-4,.nivel-3").filter(".nivel-6");
  if ($filas.length > 0) {
    $boton.find('button>i').toggleClass("fa-plus fa-minus");
    $filas.slideToggle();
  }
});
