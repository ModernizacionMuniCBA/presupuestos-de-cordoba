
window.already_printed_ae = false;
function dibujarD3_ing() {
  $.getJSON("https://spreadsheets.google.com/feeds/list/1jcG9GJScORYkrCyq5l5A9VojBng5Dzq7vDqpqWSBcQo/od6/public/values?alt=json", function( dataJSON ) {
  $("#ingresosGraph").empty();
    var datos = [];
    var detalle = [];
    $.each( dataJSON.feed.entry, function( key, val ) {
      var partida = val.gsx$partidas.$t;
      var partida_splited = partida.split('.');
      var nivel = partida_splited.length;
      var nivel_princ = parseInt(partida_splited[0]);
      var nombre = val.gsx$concepto.$t;
      var total = val.gsx$total.$t;
      if (partida_splited[1]==""){
        nivel -=1;
      }
      detalle[nivel] = nombre;

      if (nivel_princ == 3){
        nivel = 4
        detalle[2] = detalle[1]
        detalle[3] = detalle[1]
        detalle[4] = detalle[1]
      }else if (nivel_princ == 2 && nivel == 3) {
        nivel = 4
        detalle[4] = detalle[3]
      }

      if (nivel == 4){
        var linea = {"key": detalle[4],
                "rec1": detalle[1],
                "rec2": detalle[2],
                "rec3": detalle[3],
               "valor": parseInt(total.split('.').join(""))
             }
          datos.push(linea);
      }
    });
    // console.log(datos);


    var data = d3.nest()
                .key(function(d) { return d.rec1; })
                .key(function(d) { return d.rec2; })
                .key(function(d) { return d.rec3; })
                .entries(datos);

    // console.log(data);
    var visualization = d3plus.viz()
      .background("#EEEEEE")
      .container("#ingresosGraph")
      .legend({"size": 30})
      // .labels({"align": "left", "valign": "top"})
      .tooltip(true)
      .tooltip({"children":0})
      // .tooltip({"large":getTooltipWidth(), "small":getTooltipWidth()})
      .data(datos)
      .type("tree_map")
      .id(["rec1", "rec2", "rec3", "key"])
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
      .dev(true)
      .draw();

  });



}

function llenarTablas_ing(){
  //Llenar Tabla de Ingresos Corrientes Propios
  $.getJSON("https://spreadsheets.google.com/feeds/list/1nkqXSu3MlK7uKDqaL-EqG4ZeZTNSDYPklNGS-YRrTnM/od6/public/values?alt=json", function( data ) {
    var items = [];
    $.each( data.feed.entry, function( key, val ) {
      var partida = val.gsx$partidas.$t;
      var partida_splited = partida.split('.');
      var nivel = partida_splited.length;
      var concepto = val.gsx$concepto.$t;
      var total = val.gsx$total.$t;
      if (partida_splited[1]==""){
        nivel -=1;
      }
      if (nivel <= 3){
        if(partida_splited[0] == "1" || partida_splited[0] == "01" ){
          if(partida_splited[1] == ""){
            $("#tbody-ingresos-corrientes-propios").append('<tr class="nivel-'+nivel+'"><th scope="row">'+partida+'</th><td>'+concepto+'</td><td>$'+total.toLocaleString("es-AR")+'</td></tr>');
          }else if(partida_splited[1] == "01"){
            $("#tbody-ingresos-corrientes-propios").append('<tr class="nivel-'+nivel+'"><th scope="row">'+partida+'</th><td>'+concepto+'</td><td>$'+total.toLocaleString("es-AR")+'</td></tr>');
          }
        }
      }
    });
  });
  //Llenar tabla de Ingresos Corrientes No Propios
  $.getJSON("https://spreadsheets.google.com/feeds/list/1mYqmTfiEEHJyofD636sojncI2UwAgFT_kQpIujkudMQ/od6/public/values?alt=json", function( data ) {
    var items = [];
    // console.log(data.feed.entry);
    $.each( data.feed.entry, function( key, val ) {
      var partida = val.gsx$partidas.$t;
      var partida_splited = partida.split('.');
      var nivel = partida_splited.length;
      var concepto = val.gsx$concepto.$t;
      var total = val.gsx$total.$t;
      if (partida_splited[1]==""){
        nivel -=1;
      }
      if (nivel <= 4){
        if(partida_splited[0] == "1" || partida_splited[0] == "01" ){
          if(partida_splited[1] == ""){
            $("#tbody-ingresos-corrientes-no-propios").append('<tr class="nivel-'+nivel+'"><th scope="row">'+partida+'</th><td>'+concepto+'</td><td>$'+total.toLocaleString("es-AR")+'</td></tr>');
          }else if(partida_splited[1] == "02"){
            $("#tbody-ingresos-corrientes-no-propios").append('<tr class="nivel-'+nivel+'"><th scope="row">'+partida+'</th><td>'+concepto+'</td><td>$'+total.toLocaleString("es-AR")+'</td></tr>');
          }
        }
      }
    });
  });

  //Llenar tabla de Ingresos de Capital
    $.getJSON("https://spreadsheets.google.com/feeds/list/1RJjQTHJEMeZ4KVwYrqylGJJqkw-QiY1eHSdDxdoDoFU/od6/public/values?alt=json", function( data ) {
      var items = [];
      // console.log(data.feed.entry);
      $.each( data.feed.entry, function( key, val ) {
        var partida = val.gsx$_cn6ca.$t;
        var partida_splited = partida.split('.');
        var nivel = partida_splited.length;
        var concepto = val.gsx$concepto.$t;
        var total = val.gsx$total.$t;
        if (partida_splited[1]==""){
          nivel -=1;
        }
        // console.log(partida_splited);
        if (nivel <= 3){
          if(partida_splited[0] == "2" || partida_splited[0] == "02" ){
            if(partida_splited[0] == "2"){
              $("#tbody-ingresos-capital").append('<tr class="nivel-'+nivel+'"><th scope="row">'+partida+'</th><td>'+concepto+'</td><td>$'+total.toLocaleString("es-AR")+'</td></tr>');
            }else{
              $("#tbody-ingresos-capital").append('<tr class="nivel-'+nivel+'"><th scope="row">'+partida+'</th><td>'+concepto+'</td><td>$'+total.toLocaleString("es-AR")+'</td></tr>');
            }
          }
        }
      });
    });

}

function dibujarD3_AE() {

  $.getJSON("https://spreadsheets.google.com/feeds/list/1lJgGTuLvAMulKx59cJckTzvIFlur-fs2Twyh1dUOKgU/od6/public/values?alt=json", function( data ) {
    $("#afectacion-especifica-j").empty();
    $("#afectacion-especifica-jm").empty();
    $("#afectacion-especifica-propios").empty();
    $("#afectacion-especifica-no_propios").empty();

    var items = [];
    var datos = [];
    var datos_jm = [];
    var datos_propios = [];
    var datos_no_propios = [];
    $.each( data.feed.entry, function( key, val ) {
      var partida = val.gsx$_cn6ca.$t;
      var partida_splited = partida.split('.');
      var nivel = partida_splited.length;
      var concepto = val.gsx$concepto.$t;
      var total = val.gsx$afectacionespecifica.$t;
      if (partida_splited[1]==""){
        nivel -=1;
      }

      if(partida_splited[0] != "I -" && window.already_printed_ae === false){
        $("#tbody-ingresos-afectacion").append('<tr class="nivel-'+nivel+'"><th scope="row">'+partida+'</th><td>'+concepto+'</td><td>$'+total.toLocaleString("es-AR")+'</td></tr>');
      }

      if(nivel==2){
        var linea = {"key": concepto,
                "valor": parseInt(total.split('.').join(""))
             }
          datos.push(linea);
      }
      if(nivel==3){
        var linea = {"key": concepto,
                "valor": parseInt(total.split('.').join(""))
             }
          datos_jm.push(linea);
      }
      if(nivel==4 && partida_splited[1] == "01"){
        var linea = {"Nombre": concepto,
                        "key": partida,
                      "valor": parseInt(total.split('.').join(""))
             }
          datos_propios.push(linea);
      }
      if(nivel==4 && partida_splited[1] == "02"){
        var linea = {"Nombre": concepto,
                        "key": partida,
                      "valor": parseInt(total.split('.').join(""))
             }
          datos_no_propios.push(linea);
      }


    });
    //Grafico de Afectacion Especifica - Totales
    var data = d3.nest()
                .entries(datos);


    var visualization = d3plus.viz()
      .container("#afectacion-especifica-j")
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

    // Grafico de Afectacion Especifica Jurisdicciones
    var data = d3.nest()
                .entries(datos_jm);


    var visualization = d3plus.viz()
      .container("#afectacion-especifica-jm")
      .background("#EEEEEE")
      .tooltip(true)
      .tooltip({"children":0})
      .data(datos_jm)
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

    // Grafico de Afectacion Especifica Propios

    var data = d3.nest()
                .entries(datos_propios);

    // console.log(datos_propios);
    var visualization = d3plus.viz()
      .container("#afectacion-especifica-propios")
      .background("#EEEEEE")
      .tooltip(true)
      .tooltip({"children":0})
      .data(datos_propios)
      .type("bar")
      .id("key")
      .text("Nombre")
      .y("valor")
      .y({"stacked": false, "value": "valor", "grid":false, "label": false, "scale": "discrete"})
      .x("key")
      .x({"scale": "discrete", "grid":false, "label": false}) // Manually set Y-axis to be discrete
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
      .order({"sort": "desc","value": "valor"})
      .draw();

    // Grafico de Afectacion Especifica No Propios
    var data = d3.nest()
                .entries(datos_no_propios);

    var visualization = d3plus.viz()
      .container("#afectacion-especifica-no_propios")
      .background("#EEEEEE")
      .tooltip(true)
      .tooltip({"children":0})
      .data(datos_no_propios)
      .type("bar")
      .id("key")
      .text("Nombre")
      .y("valor")
      .y({"scale": "discrete", "stacked": false, "value": "valor", "grid":false, "label": false})
      .x("key")
      .x({"scale": "discrete", "grid":false,  "label": false}) // Manually set Y-axis to be discrete
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
      .order({"sort": "desc","value": "valor"})
      .draw();
    already_printed_ae = true;
  });
}


dibujarD3_ing();
llenarTablas_ing();


$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  // e.prevenDefault();
  if(history.pushState) {
    history.pushState(null, null, '#'+e.target.hash.substr(1));
  }
  else {
      location.hash = '#'+e.target.hash.substr(1);
  }

  if(e.target.hash.substr(1) == 'afectacion'){
    dibujarD3_AE();
  }
  return false ;
})

$(window).on('resize', function(){
  dibujarD3_ing();
  dibujarD3_AE();
});


$( document ).ready(function() {
  var hash = window.location.hash;
  hash = hash.substring(hash.indexOf('#')+1).toLowerCase();
  // console.log(hash);
  if(hash == "propios" || hash == "no-propios"){
    $('.nav-tabs a[href="#corrientes"]').tab('show');
    // $('.nav-tabs a[href="#'+hash+'"]').tab('show');
  }else if (hash == "cortoplazo" || hash == "largoplazo"){
    $('.nav-tabs a[href="#capital"]').tab('show');
    // $('.nav-tabs a[href="#'+hash+'"]').tab('show');
  }
  $('.nav-tabs a[href="#'+hash+'"]').tab('show');
  if(hash!= ""){
    $('html, body').animate({

        scrollTop: $("#"+hash).offset().top-275
      }, 1000);
  }

});
