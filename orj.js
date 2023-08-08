function clickFree()
{
timeR = $('title').text();
replText = timeR.replace("- FreeBitco.in - Win free bitcoins every hour!", "");
var num = replText.replace(/[^0-9]/g,'');
if (Number(num)==0){
document.getElementById('free_play_form_button').click();
}
}


//clickFree();

function doubleplusone(numbase,mult,times)
{
var i=0;
var path=[];
path=[numbase];
for (i = 0; i < times; i++) { numbase=(numbase*2)+mult; path.push(numbase);

};
return path;
}

function ChangeClass(classname,txt)
{
x=document.getElementsByClassName(classname); // Find the elements
for(var i = 0; i < x.length; i++){
x[0].innerText=txt; // Change the content
}

}
//ChangeClass("auto_bet_second_column bold",(Math.round(pattern[breaking]/0.00000001)*2));

//checkbox checkbox
function checkSetup()
{
var chkBox = document.getElementById('autobet_lose_increase_bet');
if (!chkBox.checked)
{
document.getElementById('autobet_lose_increase_bet').checked=true;
}
//autobet_lose_return_to_base
var chkBox = document.getElementById('autobet_lose_return_to_base');
if (chkBox.checked)
{
document.getElementById('autobet_lose_return_to_base').checked=false;
}
//autobet_change_client_seed
var chkBox = document.getElementById('autobet_change_client_seed');
if (!chkBox.checked)
{
document.getElementById('autobet_change_client_seed').checked=true;
}
//autobet_dnr
var chkBox = document.getElementById('autobet_dnr');
if (!chkBox.checked)
{
document.getElementById('autobet_dnr').checked=true;
}
//percent increase
document.getElementById("autobet_lose_increase_bet_percent").value = 100;
document.getElementById("autobet_roll_count").value = 100000;
}
checkSetup();

function getConfirmation(){
var retVal = confirm("Breached 2nd Level: Commencing 10X");
if( retVal == true ){

pattern1=doubleplusone(0.00000001,(Number(profit2)*10),25);
}
else{
stop_autobet == true;
}
}

//longest streak
var loss_streak=0;
var streak_val=0;
var highest_streak=0;
//bet won
//delay
var delay = prompt("Delay", 1);
var highest_won=0;
var highest_occur=0;
var win_streak=0;
var streak_avg=0;
var lastmode="";
var lastresult=0;
var safety=0;
var mode2 = false;
//the balanse persist
balanse =0;
//var newbalance= $('#balance').text();
var orig_base_bet=0.00000001;
var bet_temp =0;
//increase percentage
var inc = 1.40;
var inc_temp =1.05;
var inc_orig = 1.40;
var loss_streak_new=0;
var alerted=0;
var chance_streak=0;
//var profit = 0.00000002;
var profit = prompt("Profit", 2);
profit=Number(profit)*0.00000001;
//breaking point
var breaking = prompt("Half Stop1", 6);
breaking=Number(breaking);
var break_mult=15;
var crazyno=1;
var pot=[];
//

var delay1 = prompt("2nd Delay", 5);
delay1=Number(delay1);
var delay2 =0;


//define pattern and pattern1
var pattern0=doubleplusone(0.00000001,profit,25);
var pattern=doubleplusone(0.00000001,profit,25);
//profit on breach
var profit2 = prompt("Profit2 \nBal will be at "+String(Math.round(pattern[breaking-delay]/0.00000001*2)), Math.round(pattern0[breaking-delay]/0.00000001));
profit2=Number(profit2)*0.00000001;
var pattern1=doubleplusone(0.00000001,Number(profit2),25);

var breaking2 = prompt("Half Stop2", 21);
breaking2=Number(breaking2);


//alert(pattern1);
ChangeClass("auto_bet_second_column bold","HalfStop");
ChangeClass("earn_btc_link","E");
ChangeClass("lottery_link","L");
ChangeClass("refer_link","Ref");
ChangeClass("faq_link","F");
ChangeClass("edit_link","JackPot "+pot);
ChangeClass("stats_link","S");
//half stop
document.getElementById("stop_after_profit_value").value = (Math.round(pattern[breaking-delay]/0.00000001)*2);
//time

function realtime(time) {
var sec_num =parseInt(time, 10) ; // don't forget the second param
var hours = Math.floor(sec_num / 3600);
var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
var seconds = sec_num - (hours * 3600) - (minutes * 60);

if (hours!=0) {hours = hours+' h ';} else{hours = '';}

if (minutes!=0) {minutes = minutes+' m ';}
else{minutes = '';}


if (seconds < 10) {seconds = seconds;}
var time = 'Gametime: '+hours+minutes+seconds+' s';
return time;
}
var gamestart=false;
var starttime=(new Date()).getTime();


function summary_win(){
var i=0;
summa=[]
for (i = 0; i < 25; i++) { summa.push(0);

};
return summa
}
var wins=summary_win();
var losses=summary_win();
var computed = false;
var safetyness=0;

function summarize(amount0,wins,losses,delay,base,breaking){
//delay adjustments
var i=0;
//var destinationArray = Array.from(sourceArray);
var amount=Array.from(amount0);;


for (i = 0; i < delay; i++) { amount.unshift(base)

}
//safetyness
var i=0;
for (i = 0; i <= breaking; i++) { if (computed===false) {safetyness=safetyness+amount[i];}

}
//alert(safetyness);

var i=0;
summary=[];
//alert((profit*(breaking*break_mult)/0.00000001));
var firstbreach=Math.round(amount[breaking]/0.00000001)*2;
secondtries=(Math.round(amount[breaking]/0.00000001)*2)/((profit2/0.00000001));
summary.push("1st Level Breach Bal: "+firstbreach);
summary.push("Win tries for reset: "+secondtries.toFixed(2));
for (i = 0; i <= breaking; i++) { summary.push(String(i+1)+". "+String(Math.round(amount[i]/0.00000001))+" "+String(wins[i])+"/"+String(losses[i])+" Avg:"+String(Math.round(wins[i]/(losses[i]+wins[i])*100))+"%");};

return summary.join('\r\n');
};

function summarize1(amount,wins,losses,delay,base,breaking,break_mult){
//delay adjustments
//insert sencond delay
var base1=0.00000001;
var i=0;
var amount1=Array.from(amount);

//alert(amount1);
for (i = 0; i < Number(delay)+Number(delay1); i++) { amount1.unshift(base1)

}

// var i=0;

var i=0;
for (i = 0; i <= breaking2; i++) { if (computed===false) {safetyness=safetyness+amount1[i];}

};
//stop computing
computed=true;
//define safety level
var x=Number(breaking)+Number(delay)+Number(delay1);
var i=0;
summary=[];
summary.push(String(delay)+Math.round(profit/0.00000001)+String(breaking)+String(delay1)+" Safety: "+String(Math.round(safetyness/0.00000001))+" level "+x+". Your Balance: "+Math.round(Number($('#balance').text())/0.00000001));
for (i = 0; i <= breaking2; i++) { summary.push(String(i+1)+". "+String(Math.round((Number(amount1[i])/0.00000001))) +" "+String(wins[i+breaking])+"/"+String(losses[i+breaking])+" Avg:"+String(Math.round(wins[i+breaking]/(losses[i+breaking]+wins[i+breaking])*100))+"%")};

return summary.join('\r\n');
};

function AutoBet(mode, bet_count, max_bet, base_bet, autobet_win_return_to_base, autobet_lose_return_to_base, autobet_win_increase_bet_percent, autobet_lose_increase_bet_percent, change_client_seed, reset_after_max_bet, rolls_played, biggest_bet, biggest_win, session_pl, autobet_win_change_odds, autobet_lose_change_odds, stop_after_profit, stop_after_loss, logging, enable_sounds) {

//
//define pattern
base=0.00000001;
//pattern=doubleplusone(0.00000001,profit,25);//
//balanse=0;
//compose summary

if (stop_autobet == true) {
highest_streak=0;safety=0; StopAutoBet();
//time
if (gamestart===true){
var endtime=(new Date()).getTime();
var time=Math.floor((endtime-starttime )/1000);
var gametime=realtime(time);gamestart=false;
ChangeClass("multiplier_header_background bold auto_bet_on_p","Last "+gametime)};
alert(summarize(pattern,wins,losses,delay,base,breaking));
alert(summarize1(pattern1,wins,losses,delay,base,breaking,break_mult));
return;
} else { document.getElementById("free_play_link_li").innerHTML = '<a href="#" class="free_play_link">STRK='+highest_streak+' at '+Math.round(Number(biggest_bet)/0.00000001)+'('+highest_won+'/'+highest_occur+') Set Up= '+delay+'_'+Math.round(profit/0.00000001)+'_'+breaking+' '+String(delay1)+'_'+Math.round((profit2/0.00000001))+'_'+breaking2+' Bal= '+Math.round(balanse)+'</a>';
var endtime=(new Date()).getTime();
var time=Math.floor((endtime-starttime )/1000);
var gametime=realtime(time);
ChangeClass("multiplier_header_background bold auto_bet_on_p",gametime);
//ChangeClass("earn_btc_link",gametime);
//change location of display
//ChangeClass("auto_bet_element",'STREAK='+highest_streak+' at '+Math.round(Number(biggest_bet)/0.00000001)+'('+highest_won+'/'+highest_occur+') Set Up= '+delay+'_'+Math.round(profit/0.00000001)+'_'+breaking+'_'+String(delay1)+' Redeem= '+(profit*(breaking*(Number(delay)+breaking+Number(delay1)))/0.00000001)+' Bal= '+Math.round(balanse));
//log in start time
if (gamestart===false){starttime=(new Date()).getTime();gamestart=true}

//Get your free BTC
clickFree();
$('#double_your_btc_digits').show();
$('#autobet_results_box').show();
$("#double_your_btc_bet_hi_button").attr("disabled", true);
$("#double_your_btc_bet_lo_button").attr("disabled", true);
var bet = parseFloat($("#double_your_btc_stake").val()).toFixed(8);
if (parseFloat(bet) > parseFloat(biggest_bet)) {
biggest_bet = bet;
}
autobet_win_increase_bet_percent = parseFloat(autobet_win_increase_bet_percent).toFixed(2);
autobet_lose_increase_bet_percent = parseFloat(autobet_lose_increase_bet_percent).toFixed(2);
var jackpot = 0;
var jackpot_arr =[];
//disable jackpot
//var jackpot_arr = $('.play_jackpot:checkbox:checked').map(function() {
// return this.value;
//}).get();
if (jackpot_arr.length > 0) {
jackpot = jackpot_arr.toString();
}
var client_seed = $('#next_client_seed').val();
var new_mode = mode;
//introduce alternating missions
function getMission(){
var myrandom1 = Math.floor(Math.random()*(2-1+1)+1);
if (myrandom1 == 1) {
new_mode1 = "hi";return new_mode1;
} else {
new_mode1 = "lo";return new_mode1;
}

};



//var table= calculatepath(base_bet,autobet_lose_increase_bet_percent,max_bet);
//console.clear();
//console.log(table);
/*
if (mode == "alternate") {
var myrandom = Math.floor(Math.random()*(2-1+1)+1);
if (myrandom == 1) {
new_mode = "hi";
} else {
new_mode = "lo";
}
}*/
//this is mission based
if (loss_streak==0){new_mode=getMission();lastmode=new_mode} else {new_mode=lastmode}//alert(new_mode);
//if (lastmode=="hi" && lastresult>5000 && lastresult<5251){safety++;new_mode="lo";bet=bet/2;lastmode=new_mode};
//if (lastmode=="lo" && lastresult>4749 && lastresult<5001){safety++;new_mode="hi";bet=bet/2;lastmode=new_mode};
//this is random based
new_mode=getMission();

$.get('/cgi-bin/bet.pl?m=' + new_mode + '&client_seed=' + client_seed + '&jackpot=' + jackpot + '&stake=' + bet + '&multiplier=' + $("#double_your_btc_payout_multiplier").val() + '&rand=' + Math.random(), function(data) {
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
bet_count--;
rolls_played++;
$('#rolls_played_count').html(rolls_played);
$('#rolls_remaining_count').html(bet_count);
$('#autobet_highest_bet').html(biggest_bet + " BTC");
var number = result[2];
//adjust lastresult
lastresult=Number(number);
if (lastresult==8888){
pot.push(document.getElementById("rolls_played_count").textContent);
//alert("Jackpot in "+document.getElementById("rolls_played_count").textContent);
}
var single_digit = number.split("");
if (number.toString().length < 5) {
var remaining = 5 - number.toString().length;
for (var i = 0; i < remaining; i++) {
single_digit.unshift('0');
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
$('#user_claimed_deposit_bonus').hide();
bonus_table_closed = 1;
}, 5000);
}
if (max_deposit_bonus >= parseFloat(min_bonus_amount) && bonus_table_closed == 1) {
$('#bonus_eligible_msg').show();
}
if (parseFloat(result[19]) > 0 && parseFloat(result[19]) < 100) {
$('.multiply_max_bet').html(result[19] + " BTC");
$('.multiply_max_bet').val(result[19]);
max_win_amount = parseFloat(result[19]);
}
$("#verify_rolls_link").attr("href", "https://s3.amazonaws.com/roll-verifier/verify.html?server_seed=" + result[9] + "&client_seed=" + result[11] + "&server_seed_hash=" + result[10] + "&nonce=" + result[12]);
insertIntoBetHistory(result[1], result[4], result[2], result[9], result[11], result[10], result[12], "DICE", new_mode, jackpot, bet, $("#double_your_btc_payout_multiplier").val(), result[20], result[21], result[22], result[23]);
var capsmode = new_mode.toUpperCase();
var bet_profit = "";
if (result[1] == "w") {
//win_streak++;//if(streak_val<Number(result[4])){streak_val=Number(result[4])};

win_streak=loss_streak_new+1;
//if(highest_streak==win_streak){highest_won++;highest_occur++;};
//if(highest_streak<loss_streak){highest_won=1;highest_occur=0;highest_streak=win_streak};
//increasing if last was streak was 10 above
//if (loss_streak>10){pattern=doubleplusone(0.00000001,profit*10,25);}else{pattern=doubleplusone(0.00000001,profit,25);};

wins[win_streak-1]=wins[win_streak-1]+1;
if (balanse<=0){balanse=0;delay2=0;};
if (balanse>0){balanse=balanse-(parseFloat(result[4])/0.00000001);
//reset balanse if less than 100
if (balanse<20){balanse=0;delay2=0;
//decrease profit*
pattern1=doubleplusone(0.00000001,Number(profit2),25);
}
};
loss_streak_new=0;
loss_streak=0;
//add win to highest bid
if (parseFloat(result[4]) == parseFloat(biggest_win)) {
highest_won++;highest_occur++
}
if (parseFloat(result[4]) > parseFloat(biggest_win)) {
highest_won=1;highest_occur=1;highest_streak=win_streak;
}
//if(Number(result[4])==Number(biggest_bet)){highest_won++;highest_occur++};
//if(Number(result[4])>Number(biggest_bet)){};
$('#double_your_btc_bet_win').show();
$('#double_your_btc_bet_win').html("You BET " + capsmode + " so you win " + result[4] + " BTC!");
bet_profit = "<font color=green>+" + result[4] + "</font>";
session_pl = parseFloat(((session_pl * 100000000) + (result[4] * 100000000)) / 100000000).toFixed(8);
if (autobet_win_return_to_base == 1) {

$("#double_your_btc_stake").val(parseFloat(base_bet).toFixed(8));

} else if (parseFloat(autobet_win_increase_bet_percent) != 0) {
var new_bet_size = parseFloat((bet * ((autobet_win_increase_bet_percent / 100) + 1))).toFixed(8);
$("#double_your_btc_stake").val(new_bet_size);
}
if (parseFloat(result[4]) > parseFloat(biggest_win)) {
biggest_win = parseFloat(result[4]).toFixed(8);
}
$('#autobet_highest_win').html(biggest_win + " BTC");
if (autobet_win_change_odds != 0) {
$("#double_your_btc_payout_multiplier").val(autobet_win_change_odds);
$("#double_your_btc_payout_multiplier").keyup();
}
if (enable_sounds === 1) {
$.ionSound.play("bell_ring");
}
}
if (result[1] == "l") {losses[loss_streak]=losses[loss_streak]+1;
loss_streak_new++; loss_streak++;win_streak=0;
if(highest_streak==loss_streak_new){highest_occur++;};
if(highest_streak<loss_streak_new){highest_occur=1;highest_won=0;highest_streak=loss_streak_new};
$('#double_your_btc_bet_lose').show();
$('#double_your_btc_bet_lose').html("You BET " + capsmode + " so you lose " + result[4] + " BTC");
bet_profit = "<font color=red>-" + result[4] + "</font>";
session_pl = parseFloat(((session_pl * 100000000) - (result[4] * 100000000)) / 100000000).toFixed(8);
if (autobet_lose_return_to_base == 1) {
$("#double_your_btc_stake").val(parseFloat(base_bet).toFixed(8));
} else if (autobet_lose_increase_bet_percent != 0) {
//alter bet size to prolong chain

//the balanse system limit 10 combinations
//stay in that state until you even out then back to base



//stay at current chance 33% or increase only 75%
//ar toss=Math.floor(Math.random()*(3-1+1)+1);
//Limiter
if (balanse==0){var breaker=breaking} else {breaker=breaking2};
if (loss_streak>breaker){
if (balanse>0){getConfirmation()};

balanse=balanse+((parseFloat(result[4])/0.00000001));
loss_streak=0; }
if (balanse>0){//alert("implemented "+balanse);
pattern=pattern1;
//alert(pattern1);
balanse=balanse+(parseFloat(result[4])/0.00000001);
//safer for 2nd breach
delay2=delay1;

}
//wait until it ends
//pattern=doubleplusone(0.00000001,profit-profit,25);
else {pattern=pattern0;delay2=0;};
//alert();

if (loss_streak<Number(delay)+Number(delay2)){new_bet_size=parseFloat(base);
//Insert here the crazy bet
var crazy=Math.floor(Math.random()*(2-1+1)+1);//0 or 1
if (crazy==1){new_bet_size=parseFloat(base)*Number(crazyno);}

}
//else if (balanse>0){new_bet_size=parseFloat(base_bet);alert("Staying at"+base_bet);}
else {var new_bet_size = parseFloat(pattern[loss_streak-Number(delay2)-Number(delay)]).toFixed(8);}

$("#double_your_btc_stake").val(new_bet_size);
}
if (autobet_lose_change_odds != 0) {
$("#double_your_btc_payout_multiplier").val(autobet_lose_change_odds);
$("#double_your_btc_payout_multiplier").keyup();
}
/*if (enable_sounds === 1) {
$.ionSound.play("tap");
}*/
} /*if (logging === 1){var currentdate = new Date();var curtime = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();autobet_history[rolls_played-1] = {'time': curtime, 'multiplier': $("#double_your_btc_payout_multiplier").val(),'stake': bet,'bet': capsmode,'roll': single_digit[0]+single_digit[1]+single_digit[2]+single_digit[3]+single_digit[4],'profit': bet_profit,'verify': "<a href='https://s3.amazonaws.com/roll-verifier/verify.html?server_seed="+result[9]+"&client_seed="+result[11]+"&server_seed_hash="+result[10]+"&nonce="+result[12]+"' target=_blank>CLICK</a>"};}*/
if (jackpot != 0) {
$('#jackpot_message').show();
if (result[13] == "1") {
$('#jackpot_message').addClass('green');
$('#jackpot_message').html("Congratulations! You have won the jackpot of " + result[15] + " BTC");
} else {
$('#jackpot_message').addClass('red');
$('#jackpot_message').html("Sorry, you did not win the jackpot.");
}
}
$("#double_your_btc_bet_hi_button").attr("disabled", false);
$("#double_your_btc_bet_lo_button").attr("disabled", false);
$('#autobet_pl').removeClass();
$('#autobet_pl').addClass('bold');
if (parseFloat(session_pl) < 0) {
$('#autobet_pl').css({
'background-color': '#FF6666'
});
} else {
$('#autobet_pl').css({
'background-color': '#33FF33'
});
}
$('#autobet_pl').html(session_pl + ' BTC');
if (bet_count > 0) {
bet = parseFloat($("#double_your_btc_stake").val()).toFixed(8);
if (parseFloat(bet) > parseFloat(max_bet) || parseFloat(bet * ($("#double_your_btc_payout_multiplier").val() - 1)) > parseFloat(max_win_amount)) {
if (reset_after_max_bet == 1) {
$("#double_your_btc_stake").val(parseFloat(base_bet).toFixed(8));
} else {
stop_autobet = true;
}
}
function randomseed(new_mode){
charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
var randomPoz = Math.floor(Math.random() * charSet.length);
var randomString = charSet.substring(randomPoz, randomPoz + 1);
randomString1 = '0000000000000000';
if (new_mode1 == "hi"){return '9999999999999999';}
else {return randomString1}

};
if (change_client_seed == 1) {
charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
var randomString = '';
for (var i = 0; i < 16; i++) {
var randomPoz = Math.floor(Math.random() * charSet.length);
randomString += charSet.substring(randomPoz, randomPoz + 1);

}
//modify seed
randomString = randomseed(new_mode);
$('#next_client_seed').val(randomString);
}
if ((parseFloat(stop_after_profit) > 0 && parseFloat(session_pl) >= parseFloat(stop_after_profit)) || (parseFloat(stop_after_loss) > 0 && parseFloat(session_pl) <= -1 * parseFloat(stop_after_loss))) {
stop_autobet = true;
}
AutoBet(mode, bet_count, max_bet, base_bet, autobet_win_return_to_base, autobet_lose_return_to_base, autobet_win_increase_bet_percent, autobet_lose_increase_bet_percent, change_client_seed, reset_after_max_bet, rolls_played, biggest_bet, biggest_win, session_pl, autobet_win_change_odds, autobet_lose_change_odds, stop_after_profit, stop_after_loss, logging, enable_sounds);
} else {
StopAutoBet();
}
} else {
$('#double_your_btc_error').show();
$('#double_your_btc_digits').hide();
if (parseFloat(result[1]) > 0 && parseFloat(result[1]) < 100) {
$('.multiply_max_bet').html(result[1] + " BTC");
$('.multiply_max_bet').val(result[1]);
max_win_amount = parseFloat(result[1]);
}
BetErrors(result[0]);
StopAutoBet();
if (result[0] == "e6") {
$("#double_your_btc_bet_hi_button").attr("disabled", true);
$("#double_your_btc_bet_lo_button").attr("disabled", true);
} else {
$("#double_your_btc_bet_hi_button").attr("disabled", false);
$("#double_your_btc_bet_lo_button").attr("disabled", false);
}
}
}).fail(function() {
AutoBet(mode, bet_count, max_bet, base_bet, autobet_win_return_to_base, autobet_lose_return_to_base, autobet_win_increase_bet_percent, autobet_lose_increase_bet_percent, change_client_seed, reset_after_max_bet, rolls_played, biggest_bet, biggest_win, session_pl, autobet_win_change_odds, autobet_lose_change_odds, stop_after_profit, stop_after_loss, logging);
});
}
}