intr=0;
i=2/3;
lessJ=0.8;
plusM=1;
var minstake   = 0.00000004;
lessOdd=1;
sv=minstake;
nStake=(1+randInt(2,9)/10);
j=1.4;
n=j;
//-----------------------------------------
var autorounds = 9999989088;         // n° de rolls
//======================================================
// if (profit > profit_max) {
    //     error_title = "Maximum profit exceeded";
    //     error_info = "Maximum profit: " + number_format(profit_max, devise_decimal);
    //     error_value = "Maximum profit exceeded - Maximum profit: " + number_format(profit_max, devise_decimal);
    //     error = true;
    // }
    // else if (amount > balance) {
    //     error_title = "Bet amount";
    //     error_info = "Maximum bet: " + number_format(balance, devise_decimal);
    //     error_value = "Bet amount - Maximum bet: " + number_format(balance, devise_decimal);
    //     error = true;
    // }
var handbrake  = 0.00001;  // valor lose pause game
var autoruns   = 1;
    // else if (amount > bet_max) {
    //     error_title = "Bet amount";
    //     error_info = "Maximum bet: " + number_format(bet_max, devise_decimal);
    //     error_value = "Bet amount - Maximum bet: " + number_format(bet_max, devise_decimal);
    //     error = true;
    // }
    // else if (amount < bet_min) {
    //     error_title = "Bet amount";
    //     error_info = "Minimum bet: " + number_format(bet_min, devise_decimal);
    //     error_value = "Bet amount - Minimum bet: " + number_format(bet_min, devise_decimal);
    //     error = true;
    // }







odds=document.getElementById("double_your_btc_payout_multiplier");
odds.value=7;

stake = document.getElementById('double_your_btc_stake').value;
stake=minstake;

function playnow() {
       if (autoruns > autorounds ) { console.log('Limit reached'); return; }



 document.getElementById('double_your_btc_bet_hi_button').click();



       setTimeout(checkresults, 1);
       return;}
function checkresults() {
       if (document.getElementById('double_your_btc_bet_hi_button').disabled === true) {
              setTimeout(checkresults, 1);
              return;
       }
       


var won = document.getElementById('double_your_btc_bet_win').innerHTML;

var lost = document.getElementById('double_your_btc_bet_lose').innerHTML;



       if (won.match(/(\d+\.\d+)/) !== null) { won = won.match(/(\d+\.\d+)/)[0]; } else { won = false; }
     
       if (lost.match(/(\d+\.\d+)/) !== null) { lost = lost.match(/(\d+\.\d+)/)[0]; } else { lost = false; }
       if (won && !lost) {minstake=sv;handbrake=0.00001; stake = minstake; console.log('Bet #' + autoruns + '/' + autorounds + ': Won  ' + won  + ' Stake: ' + stake.toFixed(8));
odds.value=(parseInt(odds.value)+(plusM)*0.3993333).toString();
}
       if (lost && !won) { stake = (stake/nStake) * j * lessJ; console.log('Bet #' + autoruns + '/' + autorounds + ': Lost ' + lost + ' Stake: ' + stake.toFixed(8));
odds.value-=0.3993333*(j*1.2)*lessOdd;
}
       if (!won && !lost) { console.log('Something went wrong'); return; }


if( stake.toFixed(8)==0){ stake=minstake;}

 document.getElementById('double_your_btc_stake').value = stake.toFixed(8);
       autoruns++;
       if (stake >= handbrake) {
             document.getElementById('handbrakealert').play();
console.log('Handbrake triggered! Execute playnow() to override');
return;
       }

       
       intr=setTimeout(playnow,200);

       }


setTimeout(function(){
stake=minstake;
playnow();
},100);

/*
setTimeout(function(){
setInterval(function(){
clearTimeout(intr);
},10000);
},5000);
*/

function rand(){

document.getElementById('next_client_seed').value=makeId(randInt(1,50));

if(odds.value<1.1)odds.value=1.1;

if(stake<minstake)stake=minstake;
if(odds.value<1.2){i=2/3;j=n;clearTimeout(intr);stake=minstake;playnow();stake=minstake;odds.value=8;alert(minstake);stake=minstake;}
if(odds.value>2){i=0;}
if(odds.value<5){lessJ=2;lessOdd=1;}else{lessJ=1;lessOdd=2;if(odds.value>8)odds.value=3.9;}

}

window.setInterval(rand, 10);

function randInt(min, max) { min = Math.ceil(min); max = Math.floor(max); return Math.floor(Math.random() * (max - min + 1)) + min; }

var last;
var current;
/*
setInterval(function(){
if(current!=null)last=current;
current=$('#balance').text();
alert(last+' '+current+' '+minstake+(last<current).toString());
if(last!=null)if((last<current)||(odds.value<1.5)){
document.getElementById('handbrakealert').play();
minstake=minstake*2;
odds.value=7;
alert('minstaked');
playnow();
}else{minstake=sv;}

},30000);*/

setInterval(function(){
n=randInt(13,19)/10;
nStake=(1+randInt(1,5)/10);
//plusM*=-1;
alert(n);
},10000);

function makeId(length) { var result = ''; var characters = 'Azj3biornw847917519u4hbsnd9211nudhhdbzlmegop'; var charactersLength = characters.length; for ( var i = 0; i < length; i++ ) { result += characters.charAt(Math.floor(Math.random() * charactersLength)); } return result; }

// Created by AB_498








