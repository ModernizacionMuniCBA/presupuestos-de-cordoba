window.already_read_data_grafico = false;
window.already_read_data_tabla = false;
window.datos_tabla = [];
window.datos_grafico = [];
window.con_deuda = [];
window.sin_deuda = [];
window.visualizationCorrientes = null;
window.$btnConIntereses = $("#con-intereses");
window.$btnSinIntereses = $("#sin-intereses");
var textoExplicativo = {
  '2017': 'Para el caso del 2017 se expone información al 2º trimestre con actualización trimestral.',
  '2018': 'Para el caso del 2018 se expone información al 1º trimestre con actualización trimestral.'
}
var textoAclaracion = {
  '2017': '(*) Los datos de 2017 son al 3º trimestre.',
  '2018': '(*) Los datos de 2018 son al 1º trimestre.'
}

var tablaEjecucion = {
  '2017': 'Trimestre III 2017',
  '2018': 'Trimestre I 2018'
}

var titTabla = {
  '2017': 'Ejecutado al 3º Trim. 2017',
  '2018': 'Ejecutado al 1º Trim. 2018'
}

$('.definicionYear').html(textoExplicativo[selectedYear]);
$('.aclaracion').html(textoAclaracion[selectedYear]);
$('.titTrim').html(titTabla[selectedYear]);

function dibujar() {
  already_read_data_tabla=false;
  $('.definicionYear').html(textoExplicativo[selectedYear]);
  $('.aclaracion').html(textoAclaracion[selectedYear]);
  $('.titTrim').html(titTabla[selectedYear]);

  dibujarD3();
}

function dibujarD3() {
  if (!already_read_data_grafico) {
    $.getJSON("https://sheets.googleapis.com/v4/spreadsheets/1bb72z4oCul0FWPDfoMoV_pfI_pbzGbQO7PT-Ukqm94o/values/2018?key="+apiKey, function(dataJSON) {
      datos_grafico = dataJSON.values;
      already_read_data_grafico = true;
      dibujarD3();
    });
  } else if (!already_read_data_tabla) {
    $.getJSON("https://sheets.googleapis.com/v4/spreadsheets/1Lu7tzYu5bMwJ-Yib3pGAbWDqkufov8BJP27HKzx8wEE/values/"+tablaEjecucion[selectedYear]+"?key="+apiKey, function(dataJSON) {
      datos_tabla = dataJSON.values;
      already_read_data_tabla = true;
      dibujarD3();
    });
  } else {
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
  for(var i = 1; i<=5; i++){
    con_deuda.push({
      id: "Resultado Económico con intereses de la deuda",
      año: datos_grafico[i][1],
      "millones de pesos": parseInt(datos_grafico[i][2])
    });
    sin_deuda.push({
      id: "Resultado Económico sin intereses de la deuda",
      año: datos_grafico[i][1],
      "millones de pesos": parseInt(datos_grafico[i][3])
    });
  }

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
      range: [0, 1200],
      label: {
        padding: 8
      },
      ticks: [0, 200, 400, 600, 800, 1000, 1200]
    })
    .format("es_ES")
    .format({
      "number": function(number, key) {
        var formatted = d3plus.number.format(number, key);
        if (key.key === "millones de pesos") {
          if (key.labels == false) {
            return "$" + number.toLocaleString("es-AR");
          }
          return "$" + number.toLocaleString("es-AR") + " millones";
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
  console.log(datos_tabla);
  var i = 0;
  $.each(datos_tabla, function(key, val) {
    i += 1;
    if(i>1){
      var partida = val[0];
      var partida_splited = partida.split('.');
      var nivel = partida_splited.length;
      var nivel_princ = parseInt(partida_splited[0]);
      //var subnivel = partida_splited[1] ? parseInt(partida_splited[1]) : null;
      var concepto = val[1];
      var ejecutado = val[2].split('.').join("");
      var definitivo = val[3].split('.').join("");
      var porcentajeEjecucion = val[4];
      if (i != datos_tabla.length) {
        $tabla.append('<tr class="nivel-3"><td>' + concepto + '</td><td>$' + Number(ejecutado).toLocaleString("es-AR") + '</td><td>$' + Number(definitivo).toLocaleString("es-AR") + '</td><td>' + porcentajeEjecucion + '</td></tr>');
      } else {
        $tabla.append('<tr class="nivel-2"><td>' + concepto + '</td><td>$' + Number(ejecutado).toLocaleString("es-AR") + '</td><td>$' + Number(definitivo).toLocaleString("es-AR") + '</td><td>' + porcentajeEjecucion + '</td></tr>');
      }
    }
  });
}

$(window).on('resize', function() {
  dibujarD3();
});

$btnSinIntereses.click(function() {
  if (visualizationCorrientes) {
    $btnSinIntereses.toggleClass("btn-default btn-primary");
    $btnConIntereses.toggleClass("btn-default btn-primary");
    visualizationCorrientes.data(sin_deuda).draw();
  }
});
$btnConIntereses.click(function() {
  if (visualizationCorrientes) {
    $btnConIntereses.toggleClass("btn-default btn-primary");
    $btnSinIntereses.toggleClass("btn-default btn-primary");
    visualizationCorrientes.data(con_deuda).draw();
  }
});

dibujarD3();
