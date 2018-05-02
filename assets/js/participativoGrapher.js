window.already_printed_participativo = false;

function dibujarD3_participativo() {
  $.getJSON("https://sheets.googleapis.com/v4/spreadsheets/1O2Dk6ndwUnfOXE-YKMvSNuprFCpaMDaHz5OUAdxNLNw/values/"+selectedYear+"?key=AIzaSyDWqm99ehcgTUcnekuujkT2P95l-kor_mM", function( dataJSON ) {
    var datos = [];
    var detalle = []
    var $tabla = $("#tbody-participativo");
    $("#participativoGraph").empty();
    $tabla.empty();
    $.each( dataJSON.values, function( key, val ) {
    	if(key>0){
    	      var concepto = val[1];
    	      var porcentaje = val[2]
    	      var nivel_tabla = val[0];
    	      var monto = val[3];
    	      var nivel_tabla_splited = nivel_tabla.split('.');
    	      var nivel = nivel_tabla_splited.length + 1;
    	      var texto = val[4];
    	      detalle[nivel] = concepto.toLowerCase().split(' ').join('_');

    	      if (nivel_tabla.length == 1 && nivel_tabla != 9) {
    	        datos.push({
    	          "key": concepto.substr(14,concepto.length-1),
    	          "valor": parseInt(val[3].split(".").join(""))
    	        });
    	      }

    	      if(nivel_tabla == "9"){
    	        $tabla.append('<tr class="nivel-1"><td></td><td>'+concepto+'</td><td>'+porcentaje+'</td><td>$'+monto.toLocaleString("es-AR")+'</td></tr>');
    	      }else{
    	        if(nivel == 3){
    	          $tabla.append('<tr class="table-clickable nivel-3" data-toggle="collapse" data-target="#texto-'+detalle[2]+'-'+detalle[3]+'"><td><button class="btn btn-xs btn-default pull-right"><i class="fa fa-plus "></i></button></td><td>'+concepto+'</td><td>'+porcentaje+'</td><td>$'+monto.toLocaleString("es-AR")+'</td></tr>');
    	          $tabla.append('<tr class="collapse gray" id="texto-'+detalle[2]+'-'+detalle[3]+'"><td></td><td colspan="3">'+texto+'</td></tr>');
    	        }else{
    	          $tabla.append('<tr class="nivel-'+nivel+'"><td></td><td>'+concepto+'</td><td>'+porcentaje+'</td><td>$'+monto.toLocaleString("es-AR")+'</td></tr>');
    	        }
    	      }
    	}
    });
    console.log(datos);
    var visualization = d3plus.viz()
      .container("#participativoGraph")
      .background("#EEEEEE")
      .legend({"size": 50})
      .tooltip(true)
      .tooltip({"children":0})
      .data(datos)
      .type("pie")
      .id(["key"])
      .size("valor")
      .format("es_ES")
      .format({
          "number": function(number, key) {
            var formatted = d3plus.number.format(number, key);
            if (key.key === "valor") {
                var formatted = number.toLocaleString("es-AR")
                return "$" + formatted;
            }
            else {
              return formatted
            }
          }
      })
      .draw();
    already_printed_participativo=true;
  });
}

dibujarD3_participativo();

$("#tbody-participativo").on("click", ".nivel-3", function() {
  $(this).find("button>i").toggleClass("fa-plus fa-minus");
});

// $(window).on('resize', function(){
//   dibujarD3_participativo();
// });
