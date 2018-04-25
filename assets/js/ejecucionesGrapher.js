window.already_read_data_grafico = false;
window.already_read_data_tabla = false;
window.datos_tabla = [];
window.datos_grafico = [];
window.con_deuda = [];
window.sin_deuda = [];
window.visualizationCorrientes = null;
window.$btnConIntereses = $("#con-intereses");
window.$btnSinIntereses = $("#sin-intereses");

function dibujarD3() {
  if(!already_read_data_grafico){
    $.getJSON("https://spreadsheets.google.com/feeds/list/1bb72z4oCul0FWPDfoMoV_pfI_pbzGbQO7PT-Ukqm94o/ocwg0jj/public/values?alt=json", function( dataJSON ) {
      datos_grafico = dataJSON.feed.entry;
      already_read_data_grafico = true;
      dibujarD3();
    });
  } else if(!already_read_data_tabla) {
    $.getJSON("https://spreadsheets.google.com/feeds/list/1Lu7tzYu5bMwJ-Yib3pGAbWDqkufov8BJP27HKzx8wEE/od6/public/values?alt=json", function( dataJSON ) {
      datos_tabla = dataJSON.feed.entry;
      already_read_data_tabla = true;
      dibujarD3();
    });
  }else{
    dibujarD3_ejecuciones_presupuestarias_grafico();
    dibujarD3_ejecuciones_presupuestarias_tabla();
  }
}

function dibujarD3_ejecuciones_presupuestarias_grafico() {
  $("#grafico-ejecuciones").empty();
    var corrientes = [];
    var capital = [];
    con_deuda = [];
    sin_deuda = [];
    $.each(datos_grafico, function( key, val ) {
      var concepto = val.gsx$_cokwr.$t;
      concepto = concepto == "2017" ? "2017 *" : concepto;
      con_deuda.push({
        id: "Resultado Económico con intereses de la deuda",
        año: concepto,
        "millones de pesos": parseInt(val.gsx$coninteresesdedeuda.$t)
      });
      sin_deuda.push({
        id: "Resultado Económico sin intereses de la deuda",
        año: concepto,
        "millones de pesos": parseInt(val.gsx$sininteresesdedeuda.$t)
      });
    });

    visualizationCorrientes = d3plus.viz()
      .container("#grafico-ejecuciones")
      .background("#EEEEEE")
      .data(con_deuda)
      .type("bar")
      .height(400)
      .id("id")
      .x({
        value: "año",
        grid: false,
        label: {
          padding: 8
        }
      })
      .y({
        value: "millones de pesos",
        grid: false,
        range: [0,1200],
        label: {
          padding: 8
        },
        ticks: [0,200,400,600,800,1000,1200]
      })
      .format("es_ES")
      .format({
          "number": function(number, key) {
            var formatted = d3plus.number.format(number, key);
            if (key.key === "millones de pesos") {
              if (key.labels == false) {
                return "$"+ number.toLocaleString("es-AR");
              }
              return "$"+ number.toLocaleString("es-AR") + " millones";
            } else {
              return formatted
            }
          }
      })
      .draw();
}

function dibujarD3_ejecuciones_presupuestarias_tabla() {
  var $tabla = $("#tbody-ejecuciones");
  $tabla.empty();
    var i = 0;
    $.each(datos_tabla, function( key, val ) {
      i += 1;
      var partida = val.gsx$partida.$t;
      var partida_splited = partida.split('.');
      var nivel = partida_splited.length;
      var nivel_princ = parseInt(partida_splited[0]);
      //var subnivel = partida_splited[1] ? parseInt(partida_splited[1]) : null;
      var concepto = val.gsx$denominacion.$t;
      var ejecutado = val.gsx$ejecutado.$t.split('.').join("");
      var definitivo = val.gsx$presupuestodefinitivo.$t.split('.').join("");
      var porcentajeEjecucion = val.gsx$deejecución.$t;
      if(i != datos_tabla.length){
          $tabla.append('<tr class="nivel-3"><td>'+concepto+'</td><td>$'+Number(ejecutado).toLocaleString("es-AR")+'</td><td>$'+Number(definitivo).toLocaleString("es-AR")+'</td><td>'+porcentajeEjecucion+'</td></tr>');
      }else{
          $tabla.append('<tr class="nivel-2"><td>'+concepto+'</td><td>$'+Number(ejecutado).toLocaleString("es-AR")+'</td><td>$'+Number(definitivo).toLocaleString("es-AR")+'</td><td>'+porcentajeEjecucion+'</td></tr>');
      }
    });
}

$(window).on('resize', function(){
  dibujarD3();
});

$btnSinIntereses.click(function(){
  if(visualizationCorrientes) {
    $btnSinIntereses.toggleClass("btn-default btn-primary");
    $btnConIntereses.toggleClass("btn-default btn-primary");
    visualizationCorrientes.data(sin_deuda).draw();
  }
});
$btnConIntereses.click(function(){
  if(visualizationCorrientes) {
    $btnConIntereses.toggleClass("btn-default btn-primary");
    $btnSinIntereses.toggleClass("btn-default btn-primary");
    visualizationCorrientes.data(con_deuda).draw();
  }
});

dibujarD3();