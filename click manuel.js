const sleep = m => new Promise(r => setTimeout(r, m))

var START = 0

let currentProfit = 0
function random() {
    return Math.random() * 100;
}
function qw_start(qb, callback) {
    var client_seed = getNewSeed();
    $.get('/cgi-bin/bet.pl?m=' + mode + '&client_seed=' + client_seed + '&jackpot=0&stake=' + qb + '&multiplier=' + $("#double_your_btc_payout_multiplier").val() + '&rand=' + Math.random(), function (data) {
        var result = data.split(":");
        $('#double_your_btc_error').html("");
        $('#double_your_btc_error').hide();
        $('#double_your_btc_stake').removeClass('input-error');
        $('#double_your_btc_bet_win').html("");
        $('#double_your_btc_bet_lose').html("");
        $('#double_your_btc_bet_win').hide();
        $('#double_your_btc_bet_lose').hide();
        $('#jackpot_message').removeClass('green');
        $('#jackpot_message').removeClass('red');
        $('#jackpot_message').html('');
        $('#jackpot_message').hide();
        $('#double_your_btc_result').show();
        if (result[0] == "s1") {
            var number = result[2];
            var single_digit = number.split("");
            if (number.toString().length < 5) {
                var remaining = 5 - number.toString().length;
                for (var i = 0; i < remaining; i++) {
                    single_digit.unshift('0')
                }
            }
            $("#multiplier_first_digit").html(single_digit[0]);
            $("#multiplier_second_digit").html(single_digit[1]);
            $("#multiplier_third_digit").html(single_digit[2]);
            $("#multiplier_fourth_digit").html(single_digit[3]);
            $("#multiplier_fifth_digit").html(single_digit[4]);
            $('#balance').html(result[3]);
            max_deposit_bonus = parseFloat(result[18]).toFixed(8);
            balanceChanged();
            $('#balance_usd').html(result[5]);
            $('#next_server_seed_hash').val(result[6]);
            $('#next_nonce').html(result[8]);
            $('.previous_server_seed').html(result[9]);
            $('.previous_server_seed').val(result[9]);
            $('#previous_server_seed_hash').val(result[10]);
            $('.previous_client_seed').html(result[11]);
            $('.previous_client_seed').val(result[11]);
            $('.previous_nonce').html(result[12]);
            $('#previous_roll').html(result[2]);
            $('#no_previous_rolls_msg').hide();
            $('#previous_rolls_table').show();
            $('#previous_roll_strings').show();
            $('#bonus_account_balance').html(result[16] + " BTC");
            $('#bonus_account_wager').html(result[17] + " BTC");
            if ((parseFloat(result[16]) <= 0 || parseFloat(result[17]) <= 0) && bonus_table_closed == 0) {
                setTimeout(function () {
                    $('#bonus_account_table').hide();
                    bonus_table_closed = 1
                }, 5000)
            }
            if (max_deposit_bonus >= parseFloat(min_bonus_amount) && bonus_table_closed == 1) {
                $('#bonus_eligible_msg').show()
            }
            if (parseFloat(result[19]) > 0 && parseFloat(result[19]) < 100) {
                $('.multiply_max_bet').html(result[19] + " BTC");
                $('.multiply_max_bet').val(result[19]);
                max_win_amount = parseFloat(result[19])
            }
            $("#verify_rolls_link").attr("href", "https://s3.amazonaws.com/roll-verifier/verify.html?server_seed=" + result[9] + "&client_seed=" + result[11] + "&server_seed_hash=" + result[10] + "&nonce=" + result[12]);
            var capsmode = mode.toUpperCase();

            if (result[1] == "w") {
                lose_count = 0
                fv = 0
                $('#double_your_btc_bet_win').show();
                $('#double_your_btc_bet_win').html("You BET " + capsmode + " so you win " + result[4] + " BTC!");
                if ($("#manual_enable_sounds").is(":checked")) {
                    $.ionSound.play("bell_ring")
                }
                callback(true)
            }
            if (result[1] == "l") {
                lose_count++;
                $('#double_your_btc_bet_lose').show();
                $('#double_your_btc_bet_lose').html("You BET " + capsmode + " so you lose " + result[4] + " BTC");
                if ($("#manual_enable_sounds").is(":checked")) {
                    $.ionSound.play("tap")
                }
                callback(false)
            }
            if (jackpot != 0) {
                $('#jackpot_message').show();
                if (result[13] == "1") {
                    $('#jackpot_message').addClass('green');
                    $('#jackpot_message').html("Congratulations! You have won the jackpot of " + result[15] + " BTC")
                } else {
                    $('#jackpot_message').addClass('red');
                    $('#jackpot_message').html("Sorry, you did not win the jackpot.")
                }
            }
            $("#double_your_btc_bet_hi_button").attr("disabled", false);
            $("#double_your_btc_bet_lo_button").attr("disabled", false);
            insertIntoBetHistory(result[1], result[4], result[2], result[9], result[11], result[10], result[12], "DICE", mode, jackpot, qb, $("#double_your_btc_payout_multiplier").val(), result[20], result[21], result[22], result[23])

        } else {
            $('#double_your_btc_error').show();
            $('#double_your_btc_digits').hide();
            if (parseFloat(result[1]) > 0 && parseFloat(result[1]) < 100) {
                $('.multiply_max_bet').html(result[1] + " BTC");
                $('.multiply_max_bet').val(result[1]);
                max_win_amount = parseFloat(result[1])
            }
            BetErrors(result[0]);
            $("#multiplier_first_digit").html(0);
            $("#multiplier_second_digit").html(0);
            $("#multiplier_third_digit").html(0);
            $("#multiplier_fourth_digit").html(0);
            $("#multiplier_fifth_digit").html(0);
            if (result[0] == "e6") {
                $("#double_your_btc_bet_hi_button").attr("disabled", true);
                $("#double_your_btc_bet_lo_button").attr("disabled", true)
            } else {
                $("#double_your_btc_bet_hi_button").attr("disabled", false);
                $("#double_your_btc_bet_lo_button").attr("disabled", false)
            }

        }
    })
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
sc_divStyle.height = '130px';
sc_divStyle.padding = '4px';

sc_div.innerHTML = '<div class="vrs" style="width:100%; position:relative; padding:5px; color:#fff; font-size:12px;"><div class="vars"><label for="btc_price_try" style="color:#fff;">Btc Fiyat</label><input id="btc_price_try" type="number" style="color:#81b29a; background:transparent; border:1px solid #81b29a; border-radius:4px;" value="62210" /></div><div class="vars" style="font-size:18px" id="profit_display">Test </div></div>'

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


var startValue = '0.00000064', // Don't lower the decimal point more than 4x of current balance
    bet_odds = '2.71',
    maxWait = 555,
    stopped = true, // debugging
    stopBefore = 1; // In minutes for timer before stopping redirect on webpage
var $loButton = $('#double_your_btc_bet_lo_button'),
    $hiButton = $('#double_your_btc_bet_hi_button');
function multiply() {
    var current = $('#double_your_btc_stake').val();
    var multiply = (current * 2).toFixed(8);
    $('#double_your_btc_stake').val(multiply);
}
function getRandomWait() {
    var wait = Math.floor(Math.random() * maxWait) + 100;
    console.log('Waiting for ' + wait + 'ms before next bet.');
    return wait;
}
function startGame() {
    console.log('Game started!');
    reset();
}
function stopGame() {
    console.log('Game will stop soon! Let me finish.');
    stopped = true;
}
function reset() {
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
    if ($(event.currentTarget).is(':contains("lose")')) {
        console.log('You LOST! Multiplying your bet and betting again.');
        multiply();
        setTimeout(function () {
        }, getRandomWait());
    }
});
$('#double_your_btc_bet_win').bind("DOMSubtreeModified", function (event) {
    if ($(event.currentTarget).is(':contains("win")')) {
        reset();
        getRandomWait();
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
}); startGame()