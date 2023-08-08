function getNewSeed() {
    var result = '';
    var length = 64;
    var chars = 'ABCDEF0123456789abcdef';
    for (var i = length; i > 0; --i) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}+
setInterval(function(){ 
    $('#next_client_seed').val(getNewSeed())
}, 1975);
const sleep = m => new Promise(r => setTimeout(r, m))

var START = 0
var
    min,
    speed,
    max,
    before,
    after,
    betafter,
    betbefore,
    base,
    counter = 0,
    randhilo,
    multiplier,
    seedint,
    betval,
    multiply,
    interval,
    lastbet,
    mode = 'hi',
    jackpot = 0,
    max_win_amount,
    qw_bet = 0.00000001,
    max_deposit_bonus,
    lose_count = 0;
let fv = 0
function random() {
    return Math.random() * 100;
}

function hilo() {
    counter++;
    console.log(counter);
    if (randhilo == 'hi') {
        DoubleYourBTC('hi');
        mode = 'hi';
    }
    else if (randhilo == 'lo') {
        DoubleYourBTC('lo');
        mode = 'lo';
    }
    else {
        randbet();
    }

}

function randbet() {
    var i = random();
    if (i >= 50) {
        // DoubleYourBTC('hi');
        mode = 'hi';

    }
    else if (i <= 49) {
        // DoubleYourBTC('lo');
        mode = 'lo';

    }
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


var sc_div = document.createElement('div');
document.body.children[1].children[0].appendChild(sc_div);
var sc_divStyle = sc_div.style;
sc_div.id = 'vurus_sc_ui';
sc_divStyle.margin = '0px';
sc_divStyle.backgroundColor = '#14213D';
sc_divStyle.marginLeft = '0px';
sc_divStyle.position = 'fixed';
sc_divStyle.left = '100px';
sc_divStyle.top = '45px';
sc_divStyle.width = '260px';
sc_divStyle.height = '500px';
sc_divStyle.padding = '4px';

sc_div.innerHTML = '<div class="vrs" style="width:100%; position:relative; padding:5px; color:#fff; font-size:12px;"><div class="vars"><label for="min_bet" style="color:#fff;">Min. Bet</label><input id="min_bet" type="text" style="color:#81b29a; background:transparent; border:1px solid #81b29a; border-radius:4px;" value="1" /></div><div class="vars"><label for="max_bet" style="color:#fff;">Max Bet</label><input id="max_bet" type="text" style="color:#81b29a; background:transparent; border:1px solid #81b29a; border-radius:4px;" value="100000000" /></div><div class="vars"><label for="bet_after" style="color:#fff;">Kaç kayıp sonrası katlasın</label><input id="bet_after" type="text" style="color:#81b29a; background:transparent; border:1px solid #81b29a; border-radius:4px;" value="9" /></div><div class="vars"><label for="bet_before" style="color:#fff;">Kaç kayıpta dursun</label><input id="bet_before" type="text" style="color:#81b29a; background:transparent; border:1px solid #81b29a; border-radius:4px;" value="20" /></div><div class="vars"><label for="qw_base_bet" style="color:#fff;">Vuruş Başlangıcı</label><input id="qw_base_bet" type="number" style="color:#81b29a; background:transparent; border:1px solid #81b29a; border-radius:4px;" value="100" /></div><div class="vars"><label for="speed" style="color:#fff;">Hız</label><input id="qw_speed" type="text" style="color:#81b29a; background:transparent; border:1px solid #81b29a; border-radius:4px;" value="1200" /></div><div class="vars"><label for="multiplier" style="color:#fff;">Katlama</label><input id="multiplier" type="text" style="color:#81b29a; background:transparent; border:1px solid #81b29a; border-radius:4px;" value="2.00" /></div><div class="vars"><label for="multiply" style="color:#fff;">Kayıp Sonrası Katlama</label><input id="multiply" type="number" style="color:#81b29a; background:transparent; border:1px solid #81b29a; border-radius:4px;" value="2" /></div><div class="vars"><label for="rand_hilo" style="color:#fff;">Rastgele hi/lo</label><input id="rand_hilo" type="text" style="color:#81b29a; background:transparent; border:1px solid #81b29a; border-radius:4px;" value="hi" /></div><div class="vars"><button class="btn" id="vrs_start" class="background:#2a9d8f !important;" onclick="run_qw();">Start</button><button class="btn" id="vrs_stop" class="background:#e63946 !important" onclick="stop_qw();">Stop</button></div></div>'

document.onkeypress = function (e) {
    e = e || window.event;
    if (e.keyCode == 115) {

        stop_qw()

    }
};


var textInput = document.getElementById('double_your_btc_stake');

textInput.addEventListener('keyup', function (e) {
    if (e.keyCode == 83) {
        stop_qw()
    }
});

function stop_qw() {
    START = 0
}

function run_qw2() {
    START = 1


    speed = parseInt($('#qw_speed').val());
    base = parseInt($('#base_bet').val());
    betafter = parseInt($('#bet_after').val());
    multiply = parseFloat($('#multiply').val())
    let multiplier = parseFloat($('#multiplier').val())
    $('#double_your_btc_payout_multiplier').val(multiplier)
    let qw_b = qw_bet
    let fv = 0
    let qw_int = setInterval(() => {

        if (START == 0) {
            clearInterval(qw_int)
        }
        if (START == 1) {
            randbet()


            if (lose_count >= betafter) {

                if (fv >= 1) {
                    fv++
                    qw_b *= multiply
                } else if (fv == 0) {
                    qw_b = 0.00000014
                    fv = 1
                }
            }
            if (lose_count == 0) {
                qw_b = qw_bet
                fv = 0
            }
            $('#double_your_btc_stake').val(parseFloat(qw_b).toFixed(8));
            betval = $('#double_your_btc_stake').val();
            qw_start(parseFloat(qw_b).toFixed(8))
            console.log(`fv = ${fv}`, lose_count, betafter, parseFloat(qw_b).toFixed(8))
        }
    }, speed);
}

let multipliers = parseFloat($('#multiplier').val())
$('#double_your_btc_payout_multiplier').val(multipliers)
START = 1


speed = parseInt($('#qw_speed').val());
base = parseInt($('#qw_base_bet').val()) / 100000000;
betafter = parseInt($('#bet_after').val());
multiply = parseFloat($('#multiply').val())
let qw_b = qw_bet

async function run_qw() {
    try {
        START = 1

        //let multiplier = parseFloat($('#multiplier').val())
        // $('#double_your_btc_payout_multiplier').val(multiplier)
       


        if (START == 0) {
            console.log("STOPPED")
            //break
        }

        //randbet()
        if (lose_count >= betafter) {

            if (fv >= 1) {
                fv++
                qw_b *= multiply
                console.log("multiply", multiply, qw_b, "base_bet", base)
            } else if (fv == 0) {
                qw_b = base
                fv = 1

                console.log("base girdi")
            }
        }
        if (lose_count == 0 || fv == 0) {
            qw_b = qw_bet
            fv = 0
        }

        console.log("++++multiply", multiply, qw_b, "base_bet", base)
        $('#double_your_btc_stake').val(parseFloat(qw_b).toFixed(8));
        betval = $('#double_your_btc_stake').val();



        qw_start(parseFloat(qw_b).toFixed(8), function (data) {
            if (START == 1) {
                run_qw()
                //break
            }
            //run_qw()
        })



        //console.log(`fv = ${fv}`, lose_count, betafter, parseFloat(qw_b).toFixed(8))
        //await sleep(speed)


    } catch (e) {
        console.log(e)
    }
}