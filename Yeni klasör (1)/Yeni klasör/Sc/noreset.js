let currentProfit = 0
function random() {
    return Math.random() * 100;
}


var autobet_dnr = true;
var sc_div = document.createElement('div');
document.body.children[1].children[0].appendChild(sc_div);
var sc_divStyle = sc_div.style;
sc_div.id = 'vurus_sc_ui';
sc_divStyle.margin = '0px';
sc_divStyle.backgroundColor = '#14213D';
sc_divStyle.marginLeft = '0px';
sc_divStyle.position = 'fixed';
sc_divStyle.right = '100px';
sc_divStyle.top = '45px';
sc_divStyle.width = '260px';
sc_divStyle.height = '130px';
sc_divStyle.padding = '4px';

sc_div.innerHTML = '<div class="vrs" style="width:100%; position:relative; padding:5px; color:#fff; font-size:12px;"><div class="vars"><label for="btc_price_try" style="color:#fff;">Btc Fiyat</label><input id="btc_price_try" type="number" style="color:#81b29a; background:transparent; border:1px solid #81b29a; border-radius:4px;" value="62210" /></div><div class="vars" style="font-size:18px" id="profit_display">Test </div></div>'

function profitColor() {
    if (currentProfit <= 0) {
        $('#profit_display').css('color', '#ff0000')
    } else {
        $('#profit_display').css('color', '#2bf07d')
    }
}
$("body").on('DOMSubtreeModified', "#double_your_btc_bet_win", function () {
    let content = $(this).text()
    let price = parseFloat($('#btc_price_try').val())
    if (content != "") {
        var number = parseFloat(content.match(/[\d\.]+/))
        currentProfit += number
        profitColor()
        $('#profit_display').html(`${parseFloat(currentProfit).toFixed(8)} BTC <br>${parseFloat(currentProfit * price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} TRY`)
    }

});

$("body").on('DOMSubtreeModified', "#double_your_btc_bet_lose", function () {

    let content = $(this).text()
    let price = parseFloat($('#btc_price_try').val())
    if (content != "") {
        var number = parseFloat(content.match(/[\d\.]+/))
        currentProfit -= number
        profitColor()
        $('#profit_display').html(`${parseFloat(currentProfit).toFixed(8)} BTC <br>${parseFloat(currentProfit * price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} TRY`)

    }
});

