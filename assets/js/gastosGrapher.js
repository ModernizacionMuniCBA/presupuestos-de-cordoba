window.already_printed_corrientes = false;
window.already_printed_capital = false;
window.already_printed_finalidad_funcion = false;
window.already_printed_finalidad = false;
window.already_printed_clasificacion = false;

function dibujarD3_gastos() {
  dibujarD3_gastos_corrientes();
  dibujarD3_gastos_capital();
  dibujarD3_gastos_finalidad();
  dibujarD3_gastos_finalidad_funcion();
  $.getJSON("https://sheets.googleapis.com/v4/spreadsheets/11UGXTNvmaOezQNpFXxMXps_gT7kwEP08YeMdcz4wKXo/values/" + selectedYear + "?key=AIzaSyDWqm99ehcgTUcnekuujkT2P95l-kor_mM", function(dataJSON) {
    $("#clasificacion-economica-gasto").empty();
    var datos = [];
    var datos_clasif_econo = [];
    var detalle = [];
    var $tabla = $("#tbody-clasificacion-gasto");
    var i = 0;
    $tabla.empty();
    $.each(dataJSON.values, function(key, val) {
      if (key > 0) {
        i += 1;
        var partida = val[1];
        var nivel_tabla = val[0];
        var partida_splited = partida.split('.');
        var nivel = partida_splited.length;
        var nivel_princ = parseInt(partida_splited[0]);
        var subnivel = parseInt(partida_splited[1]);
        var concepto = val[2];
        var total = val[3];
        if (nivel_tabla != -2) {
          if (partida_splited[1] == "") {
            nivel -= 1;
          }
          detalle[nivel] = concepto;

          if (nivel == 3 && nivel_princ == 2 && subnivel == 4) {
            nivel = 4;
            detalle[3] = concepto
          }
          if (nivel == 4) {

            var linea = {
              "key": concepto,
              "rec1": detalle[3],
              "rec2": detalle[2],
              "rec3": detalle[1],
              "valor": parseInt(total.split('.').join(""))
            }

            datos.push(linea);
          }
          if (nivel <= 4) {
            if (partida == "-2") {
              $tabla.append('<tr class="nivel-' + nivel + ' total"><td></td><th scope="row"> </th><td>' + concepto + '</td><td>$' + total.toLocaleString("es-AR") + '</td></tr>');
            } else {
              var mostrar = nivel == 4 ? " style='display:none'" : '';
              var plus = nivel == 3 ? ' <button class="btn btn-xs btn-default pull-right"><i class="fa fa-plus "><i></button>' : '';
              if (i > 1) {
                $tabla.append('<tr' + mostrar + ' class="nivel-' + nivel + '"><td>' + plus + '</td><th scope="row">' + partida + '</th><td>' + concepto + '</td><td>$' + total.toLocaleString("es-AR") + '</td></tr>');
              } else {
                $tabla.append('<tr' + mostrar + ' class="nivel-1"><td>' + plus + '</td><th scope="row">' + partida + '</th><td>' + concepto + '</td><td>$' + total.toLocaleString("es-AR") + '</td></tr>');
              }
            }

          }
        }
      }
    });

    //console.log(datos);
    var data = d3.nest()
      .key(function(d) {
        return d.rec1;
      })
      .key(function(d) {
        return d.rec2;
      })
      .key(function(d) {
        return d.rec3;
      })
      .entries(datos);

    // console.log(data);
    var visualization = d3plus.viz()
      .background("#EEEEEE")
      .container("#clasificacion-economica-gasto")
      .legend({
        "size": 30
      })
      .tooltip(true)
      .tooltip({
        "children": 0
      })
      .data(datos)
      .type("tree_map")
      .id(["rec3", "rec2", "rec1", "key"])
      .size("valor")
      .format("es_ES")
      .format({
        "number": function(number, key) {
          var formatted = d3plus.number.format(number, key);
          if (key.key === "valor") {
            var formatted = number.toLocaleString("es-AR")
            return "$" + formatted;
          } else {
            return formatted
          }
        }
      })
      // .dev(true)
      .draw();
    already_printed_clasificacion = true;
  });
}

function dibujarD3_gastos_corrientes() {
  $.getJSON("https://sheets.googleapis.com/v4/spreadsheets/12aHIOCmpAYYOx2mBoO_IzAqfjeOUX0AnX7BheISd4go/values/" + selectedYear + "?key=AIzaSyDWqm99ehcgTUcnekuujkT2P95l-kor_mM", function(dataJSON) {
    var datos = [];
    var datos_clasif_econo = [];
    var detalle = [];
    var $tabla = $("#tbody-gastos-corrientes");
    $tabla.empty();
    var regexDosNumeros = /[0-9]{2}/;
    // console.log(dataJSON.feed.entry);
    var i = 0;
    $.each(dataJSON.values, function(key, val) {
      if (key > 0) {
        i += 1;
        var partida = val[0];
        var partida_splited = partida.split('.');
        var nivel = partida_splited.length;
        var nivel_princ = parseInt(partida_splited[0]);
        var concepto = val[1];
        var total = val[2];
        if (partida_splited[1] == "") {
          nivel -= 1;
        }
        detalle[nivel] = concepto;

        if (partida_splited[0] == "-1" && i > 1) {
          if (concepto.toUpperCase() != "EROGACIONES DE CAPITAL") {
            $tabla.append('<tr class="nivel-1"><td>' + concepto + '</td><td>$' + total.toLocaleString("es-AR") + '</td></tr>');
          }
        }
        if (partida_splited[0] == "0") {
          $tabla.append('<tr class="nivel-2"><td>' + concepto + '</td><td>$' + total.toLocaleString("es-AR") + '</td></tr>');
        } else if (nivel_princ == 1) {
          if (regexDosNumeros.test(concepto.substr(0, 2))) {
            concepto = concepto.substr(2, concepto.length - 1);
          }
          $tabla.append('<tr class="nivel-3"><td>' + concepto + '</td><td>$' + total.toLocaleString("es-AR") + '</td></tr>');
        }
      }

    });
  });
}

function dibujarD3_gastos_capital() {
  $.getJSON("https://sheets.googleapis.com/v4/spreadsheets/1dHvfU13hR8rThdLqplWKSMg6t8Xt3oq1nxB9c-ZJlfA/values/" + selectedYear + "?key=AIzaSyDWqm99ehcgTUcnekuujkT2P95l-kor_mM", function(dataJSON) {
    var datos = [];
    var datos_clasif_econo = [];
    var detalle = [];
    var i = 0;
    $("#tbody-gastos-capital").empty();
    $.each(dataJSON.values, function(key, val) {
      if (key > 0) {
        i += 1;
        var partida = val[0];
        var partida_splited = partida.split('.');
        var nivel = partida_splited.length;
        var nivel_princ = parseInt(partida_splited[0]);
        var concepto = val[1];
        var total = val[2];
        if (partida_splited[1] == "") {
          nivel -= 1;
        }
        detalle[nivel] = concepto;

        if (partida_splited[0] == "-1" && i > 1) {
          if (concepto.toUpperCase() != "EROGACIONES CORRIENTES") {
            $("#tbody-gastos-capital").append('<tr class="nivel-1"><td>' + concepto + '</td><td>$' + total.toLocaleString("es-AR") + '</td></tr>');
          }
        }
        if (partida_splited[0] == "0") {
          $("#tbody-gastos-capital").append('<tr class="nivel-2"><td>' + concepto + '</td><td>$' + total.toLocaleString("es-AR") + '</td></tr>');
        }
        if (partida_splited[0] == "1") {
          $("#tbody-gastos-capital").append('<tr class="nivel-3"><td>' + concepto + '</td><td>$' + total.toLocaleString("es-AR") + '</td></tr>');
        }
      }
    });
  });
}

function dibujarD3_gastos_finalidad() {
  $.getJSON("https://sheets.googleapis.com/v4/spreadsheets/1kNKGph0cxoVQf2WHSJK3ok7MoHg8vmISX5WFJ40jnyc/values/" + selectedYear + "?key=AIzaSyDWqm99ehcgTUcnekuujkT2P95l-kor_mM", function(dataJSON) {
    $("#gastos-finalidad").empty();
    var datos = [];
    var i = 0;
    var entradas = dataJSON.values;
    $("#tbody-gastos-finalidad").empty();
    $.each(entradas, function(key, val) {
      if (key > 0) {
        i += 1;
        var concepto = val[0];
        var total = val[1];
        if (i > 1) {
          var linea = {
            "key": concepto,
            "valor": parseInt(total.split('.').join(""))
          }
          datos.push(linea);
          $("#tbody-gastos-finalidad").append('<tr class="nivel-3"><td>' + concepto + '</td><td>$' + total.toLocaleString("es-AR") + '</td></tr>');
        } else {
          $("#tbody-gastos-finalidad").append('<tr class="nivel-2"><td>' + concepto + '</td><td>$' + total.toLocaleString("es-AR") + '</td></tr>');
        }
      }

    });
    // Grafico Gastos por Clasificacion Economica
    var visualization = d3plus.viz()
      .container("#gastos-finalidad")
      .background("#EEEEEE")
      .legend({
        "size": 50
      })
      .tooltip(true)
      .tooltip({
        "children": 0
      })
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
          } else {
            return formatted
          }
        }
      })
      .draw();
    already_printed_finalidad = true;

  });
}

function dibujarD3_gastos_finalidad_funcion() {
  $.getJSON("https://sheets.googleapis.com/v4/spreadsheets/1kneGr7WYlVWQ4KyzH79bm3W5tHW4C45z1HYg1AYrlJg/values/" + selectedYear + "?key=AIzaSyDWqm99ehcgTUcnekuujkT2P95l-kor_mM", function(dataJSON) {
    $("#finalidadFuncionGraph").empty();
    var datos = [];
    var detalle = [];
    var i = 0;
    // console.log(dataJSON.feed.entry);
    $("#tbody-gastos-finalidad-funcion").empty();
    $.each(dataJSON.values, function(key, val) {
      if (key > 0) {
        i += 1;
        var partida = val[0];
        var partida_splited = partida.split('.');
        var nivel = partida_splited.length;
        var nivel_princ = parseInt(partida_splited[0]);
        var concepto = val[1];
        var total = val[2];
        var nivel_aux = nivel;
        if (partida_splited[1] == "") {
          nivel -= 1;
        } else {
          nivel_aux += 1;
        }
        if (i > 1) {
          $("#tbody-gastos-finalidad-funcion").append('<tr class="nivel-' + nivel_aux + '"><td>' + concepto + '</td><td>$' + total.toLocaleString("es-AR") + '</td></tr>');
        } else {
          $("#tbody-gastos-finalidad-funcion").append('<tr class="nivel-1"><td>' + concepto + '</td><td>$' + total.toLocaleString("es-AR") + '</td></tr>');
        }


        if (partida_splited[0] != "-1") {
          detalle[nivel] = concepto;
          if (nivel == 2) {
            var linea = {
              "key": detalle[2],
              "rec1": detalle[1],
              "valor": parseInt(total.split('.').join(""))
            }
            datos.push(linea);
          }

        }
      }


    });
    // console.log(datos);



    var data = d3.nest()
      .key(function(d) {
        return d.rec1;
      })
      .entries(datos);

    // console.log(data);
    var visualization = d3plus.viz()
      .background("#EEEEEE")
      .container("#finalidadFuncionGraph")
      .legend({
        "size": 30
      })
      // .labels({"align": "left", "valign": "top"})
      .tooltip(true)
      .tooltip({
        "children": 0
      })
      // .tooltip({"large":getTooltipWidth(), "small":getTooltipWidth()})
      .data(datos)
      .type("tree_map")
      .id(["rec1", "key"])
      .size("valor")
      .format("es_ES")
      .format({
        "number": function(number, key) {
          var formatted = d3plus.number.format(number, key);
          if (key.key === "valor") {
            var formatted = number.toLocaleString("es-AR")
            return "$" + formatted;
          } else {
            return formatted
          }
        }
      })
      // .dev(true)
      .draw();
    already_printed_finalidad_funcion = true;

  });

}
dibujarD3_gastos();



$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
  // e.prevenDefault();
  if (history.pushState) {
    history.pushState(null, null, '#' + e.target.hash.substr(1));
  } else {
    location.hash = '#' + e.target.hash.substr(1);
  }
  dibujarD3_gastos();
  // if(e.target.hash.substr(1) == 'en-que'){
  //   dibujarD3_gastos();
  // }
  return false;
})

$(window).on('resize', function() {
  dibujarD3_gastos();
});

function dibujar() {
  dibujarD3_gastos();
  dibujarD3_gastos_corrientes();
  dibujarD3_gastos_capital();
  dibujarD3_gastos_finalidad();
  dibujarD3_gastos_finalidad_funcion()
}

$(document).ready(function() {
  var hash = window.location.hash;
  hash = hash.substring(hash.indexOf('#') + 1).toLowerCase();
  // console.log(hash);
  if (hash == "propios" || hash == "no-propios") {
    $('.nav-tabs a[href="#corrientes"]').tab('show');
    // $('.nav-tabs a[href="#'+hash+'"]').tab('show');
  } else if (hash == "cortoplazo" || hash == "largoplazo") {
    $('.nav-tabs a[href="#capital"]').tab('show');
    // $('.nav-tabs a[href="#'+hash+'"]').tab('show');
  }
  $('.nav-tabs a[href="#' + hash + '"]').tab('show');
  if (hash != "") {
    $('html, body').animate({

      scrollTop: $("#" + hash).offset().top - 275
    }, 1000);
  }

});
