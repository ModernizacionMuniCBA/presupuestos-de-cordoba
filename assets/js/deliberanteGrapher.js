function dibujarD3_gastos_ejecutivo() {
  $.getJSON("https://spreadsheets.google.com/feeds/list/1ggtT2Mv0OnAtSASEvg_LTVthzehuotx8_GvrdY58Kaw/od6/public/values?alt=json", function( dataJSON ) {
    var $tabla = $("#tbody-gastos-concejo-deliberante");
    var datos = dataJSON.feed.entry;

    for (var key = 0; key < datos.length; key++) {
      var val = datos[key];
      var partida = val.gsx$partida.$t;
      var nivel = val.gsx$nivel.$t;
      var nivel_princ = parseInt(nivel) + 2;
      var concepto = val.gsx$concepto.$t;
      var total = val.gsx$concejodeliberante.$t;
      if(total == ""){
        total= 0 ;
      }

      var mostrar = nivel >= 2 ? " style='display:none'":'';
      var nivelProximoDato = key+1 !== datos.length ? datos[key+1].gsx$nivel.$t : false;
      var esColapsable = nivel_princ >= 3 && nivelProximoDato > nivel;
      var plus = esColapsable ? ' <button class="btn btn-xs btn-default pull-right"><i class="fa fa-plus "></i></button>' : '';
      var claseColapsable = esColapsable ? ' pointer' : '';

      $tabla.append('<tr'+mostrar+' class="nivel-'+nivel_princ+claseColapsable+'"><td>'+plus+'</td><th>'+partida+'</th><td>'+concepto+'</td><td>$'+total.toLocaleString("es-AR")+'</td></tr>');
    }

    var $ultimaFila = $tabla.find('tr').last().detach().addClass('total');
    $tabla.prepend($ultimaFila);
  });
}
dibujarD3_gastos_ejecutivo();

$("#tbody-gastos-concejo-deliberante").on("click", ".nivel-3", function(){
  var $boton = $(this);
  $filas = $(this).nextUntil(".nivel-3,.nivel-2").filter(".nivel-4");
  if ($filas.length > 0) {
    $boton.find('button>i').toggleClass("fa-plus fa-minus");
    $filas.slideToggle();
  }
});
$("#tbody-gastos-concejo-deliberante").on("click", ".nivel-4", function(){
  var $boton = $(this);
  $filas = $(this).nextUntil(".nivel-4,.nivel-3").filter(".nivel-5");
  if ($filas.length > 0) {
    $boton.find('button>i').toggleClass("fa-plus fa-minus");
    $filas.slideToggle();
  }
});
$("#tbody-gastos-concejo-deliberante").on("click", ".nivel-5", function(){
  var $boton = $(this);
  $filas = $(this).nextUntil(".nivel-5,.nivel-4,.nivel-3").filter(".nivel-6");
  if ($filas.length > 0) {
    $boton.find('button>i').toggleClass("fa-plus fa-minus");
    $filas.slideToggle();
  }
});