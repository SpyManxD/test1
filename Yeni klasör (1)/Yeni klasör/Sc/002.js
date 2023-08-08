const sleep = m => new Promise(r => setTimeout(r, m))

var START = 0

let currentProfit = 0,
currentLose = 0
function random() {
    return Math.random() * 100;
}

var autobet_dnr = true;
var start_multiplier = '2.77';
var $multiplier = $('#double_your_btc_payout_multiplier');
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
sc_divStyle.height = '240px';
sc_divStyle.padding = '4px';

sc_div.innerHTML = '<div class="vrs" style="width:100%; position:relative; padding:5px; color:#fff; font-size:12px;"><div class="vars"><label for="btc_price_try" style="color:#fff;">Btc Fiyat</label><input id="btc_price_try" type="number" style="color:#81b29a; background:transparent; border:1px solid #81b29a; border-radius:4px;" value="62210" /></div><div class="vars"><label for="stoploss" style="color:#fff;">STOP (BTC)</label><input id="stoploss" type="number" style="color:#81b29a; background:transparent; border:1px solid #81b29a; border-radius:4px;" value="0.00012" /></div><div class="vars"><label for="stopprofit" style="color:#fff;">KARDA DUR (BTC)</label><input id="stopprofit" type="number" style="color:#81b29a; background:transparent; border:1px solid #81b29a; border-radius:4px;" value="0.002" /></div><div class="vars"><button class="btn" onclick="startGame()">Start</button><button class="btn" onclick="stopGame()">Stop</button></div><div class="vars" style="font-size:18px" id="profit_display">Test </div></div>'

function getNewSeed() {
    var result = '';
    var length = 64;
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
    for (var i = length; i > 0; --i) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}
function profitColor() {
    if (currentProfit <= 0) {
        $('#profit_display').css('color', '#ff0000')
    } else {
        $('#profit_display').css('color', '#2bf07d')
    }
}



var startValue = '0.00000002', // Don't lower the decimal point more than 4x of current balance
    bet_odds = '2.51',
    maxWait = 555,
    stopped = false, // debugging
    stopBefore = 1,
    stopval = $('#stoploss').val(),
    profitval = $('#stopprofit').val();
var $loButton = $('#double_your_btc_bet_lo_button'),
    $hiButton = $('#double_your_btc_bet_hi_button');
function multiply() {
    var current = $('#double_your_btc_stake').val();
    var multiply = (current * 2).toFixed(8);
    $('#double_your_btc_stake').val(multiply);
}

$("body").on('DOMSubtreeModified', "#double_your_btc_bet_win", function () {
    let content = $(this).text()
    let price = parseFloat($('#btc_price_try').val())
    currentLose = 0
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


function getRandomWait() {
    var wait = Math.floor(Math.random() * maxWait) + 100;
    //console.log('Waiting for ' + wait + 'ms before next bet.');
    return wait;
}
function startGame() {
    stopped = false;
    currentProfit = 0
    $('#double_your_btc_payout_multiplier').val('2.35')
    $("#disable_animation_checkbox").attr('checked', true);
    stopval = parseFloat($('#stoploss').val()),
        profitval = parseFloat($('#stopprofit').val());
    console.log('Game started!');

    reset();
    $loButton.trigger('click');
}
function stopGame() {
   
    console.log('Game will stop soon! Let me finish.');
    stopped = true;
    currentProfit = 0
    currentLose = 0
}
function reset() {
    $('#next_client_seed').val(getNewSeed())
    $('#double_your_btc_stake').val(startValue);
}
function deexponentize(number) {
    return number * 10000000;
}
function iHaveEnoughMoni() {
    var balance = deexponentize(parseFloat($('#balance').text()));
    var current = deexponentize($('#double_your_btc_stake').val());
    return ((balance) * 2.71 / 100) * (current * 2) > stopPercentage / 100;
}
function stopBeforeRedirect() {
    var minutes = parseInt($('title').text());
    if (minutes < stopBefore) {
        console.log('Approaching redirect! Stop the game so we don\'t get redirected while loosing.');
        stopGame();
        return true;
    }
    return false;
}
$('#double_your_btc_bet_lose').unbind();
$('#double_your_btc_bet_win').unbind();

$('#double_your_btc_bet_lose').bind("DOMSubtreeModified", function (event) {
    if (stopped == false) {
        if ($(event.currentTarget).is(':contains("lose")')) {
            stopval = parseFloat($('#stoploss').val()),
            profitval = parseFloat($('#stopprofit').val());
            let loseVal = parseFloat($('#double_your_btc_stake').val());
            currentLose += loseVal
            // if (stopped) {
            $('#next_client_seed').val(getNewSeed())
            console.log('You LOST! Multiplying your bet and betting again.');
            multiply();
            let mltp = parseFloat($('#double_your_btc_stake').val());
            if (currentProfit >= profitval) {
                reset()
                stopGame()
                alert(profitval + ' karda durduruldu')
            } else {
                if (currentLose <= stopval) {

                    setTimeout(function () {
                        $hiButton.trigger('click');
                    }, getRandomWait());
                    if (stopBeforeRedirect()) {
                        return;
                    }
                    if (iHaveEnoughMoni()) {
                        console.log('You WON! But don\'t be greedy. Restarting!');
                        reset();
                        if (stopped) {
                            stopped = false;
                            return false;
                        }
                    }
                    else {
                        reset()
                        console.log('You WON! Betting again');
                    }

                } else {
                    stopGame()
                    currentProfit = 0
                    alert(stopval + ' zararda durduruldu')

                }
            }
            //}

        }
    }
});
$('#double_your_btc_bet_win').bind("DOMSubtreeModified", function (event) {
    if ($(event.currentTarget).is(':contains("win")')) {
        reset();
        $loButton.trigger('click');
        if (stopBeforeRedirect()) {
            return;
        }
        if (iHaveEnoughMoni()) {
            console.log('You WON! But don\'t be greedy. Restarting!');
            reset();
            if (stopped) {
                stopped = false;
                return false;
            }
        }
        else {
            console.log('You WON! Betting again');
        }
        setTimeout(function () {
        }, getRandomWait());
    }
});
