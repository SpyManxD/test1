var x = 
  '<div id="botonera" class="large-12 small-12 columns center">'+
            '<button id="start" onclick="iniciar()" class="btn btn-primary" style="margin:0 0 10px 0; padding:3px; width:auto;">Iniciar</button>'+
        '</div>' +
  '<div class="large-12 small-12 columns center">'+ 
   '<input type="text" id="patrones" value="RRR-VVV" style="text-align:center; height:30px;">'+ 
        '</div><br><br><br><br><br><br>';      
$("#double_your_btc_right_section p:first").html(x);
$(".jackpot_container").remove();
$(".jackpot_row").remove();
$('#double_your_btc_bet_lose').unbind();
$('#double_your_btc_bet_win').unbind();
var jugadas; var patron; var boton; var buscandoPatron = false;
var hacerParada = false; var balanceInicial; var balanceActual;
var stop_fibo = false;
var if_win_fibo = false;
var base_fibo = "0.00000001";
var arr_fibo = [];



function iniciar(){
 buscandoPatron = true;
 boton = $("#double_your_btc_bet_hi_button");
 //var boton = $("#double_your_btc_bet_lo_button");
 patron=$("#patrones").val();
    hacerParada=false;
   $("#botonera").html('<button id="start" onclick="parar()" class="btn btn-warning style="margin:0 0 10px 0; padding:3px; width:auto;">Parar</button>');
    jugadas = "";
    $('#double_your_btc_stake').val('0.00000001');
    //$("#double_your_btc_bet_hi_button").trigger("click"); 
 boton.trigger("click");
    balanceInicial = ( parseInt(parseFloat ( $("#balance").html() ) * 100000000) );
}

function parar(){
    hacerParada = true;
    $("#botonera").html('<button id="start" onclick="iniciar()" class="class="btn btn-primary" style="margin:0 0 10px 0; padding:3px; width:auto;">Iniciar</button>');
}

$('#double_your_btc_bet_lose').bind("DOMSubtreeModified",function(event){
    if (hacerParada && buscandoPatron === true) return;
 if( $(event.currentTarget).is(':contains("lose")') ){ 
  if(buscandoPatron === true)validarPatron("R");
 }
});

$('#double_your_btc_bet_win').bind("DOMSubtreeModified",function(event){
    if (hacerParada && buscandoPatron === true) return;
    if( $(event.currentTarget).is(':contains("win")') ){ 
     stop_fibo = true;
     arr_fibo = []
     $("#double_your_btc_stake").val("0.00000001")
  if(buscandoPatron === true)validarPatron("V");
 }
});

function validarPatron(resultado){
 jugadas+= resultado;
 var cadena = $("#patrones").val();
    var patrones = cadena.split("-");
    for (var i = 0; i < patrones.length; i++) {
        var longitud = patrones[i].length;
        var valor = jugadas.substr(jugadas.length - longitud);
        var patron = patrones[i].substr(0,longitud);
        if (valor==patron){
    parar();
    balanceActual =  (parseInt(parseFloat ($("#balance").html())*100000000));
    var inversion = balanceActual-balanceInicial;
    alert("Patrón encontrado: " + valor + "\nInversión:" + inversion + " satoshis" );
    return;
  }
 }
 boton.trigger("click");        
}




var x2 = '<div class="row fibo" style="width:280px;">'+
            '   <ul style="list-style:none; text-align: center; margin-left:1em;margin-top:10px;">'+
            '       <li class="bet_amount_box bold multiplier_header_background bet_amount_options_margin" style="padding:4px 5px;">ESC</li>'+
            '       <li class="bet_amount_box bold bet_amount_options bet_amount_options_margin"><a class="iniciar_fibo" side="H" style="color: inherit;">HI</a></li>'+
            '       <li class="bet_amount_box bold bet_amount_options bet_amount_options_margin"><a class="iniciar_fibo" side="L" style="color: inherit;">LO</a></li>'+
            '       <li class="bet_amount_box bold bet_amount_options bet_amount_options_margin"><a id="reset_fibo" style="color: inherit;">RESET</a></li>'+
            '   </ul>'+
            '   <input type="hidden" id="count_fibo" value="1" style="text-align:center; height:30px;">'+
            '</div><br><br>';
$("#double_your_btc_stake").after(x2);


function iniciar_fibo(side_fibo){
    var count = $('#count_fibo').val();
    var firstFibo = fib(count);
    var newStake =  new Number(firstFibo).toFixed(8);
    count++;
    $('#count_fibo').val(count);
    $('#double_your_btc_stake').val(newStake);
    //console.log('newStack',newStake);
    boton_fibo = $("#double_your_btc_bet_hi_button");
    if(side_fibo=="H"){
        boton_fibo = $("#double_your_btc_bet_hi_button");
    }
    if(side_fibo=="L"){
        boton_fibo = $("#double_your_btc_bet_lo_button");
    }
    boton_fibo.trigger("click");
    
}
function reset_fibo(){
    $('#count_fibo').val('1');
    $('#double_your_btc_stake').val('0.00000001');
    arr_fibo = [];
}
function fib(n){
    arr_fibo = [];
    var n1 = parseFloat(base_fibo).toFixed(8);
    n1 = parseFloat(n1);
    var n2 = parseFloat(0);
    for (i = 0; i <= n; i++){

       var suma = n1 + n2*0.87;
        n1 = n2;
        n2 = suma;
        arr_fibo.push(suma)
    }
    return arr_fibo[n]
}

$(function(){        
    $(".fibo").on("click", ".iniciar_fibo", function(){
        iniciar_fibo($(this).attr("side"))      
    })
    $(".fibo").on("click", "#reset_fibo", function(){
        reset_fibo()
    })
})