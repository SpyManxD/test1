// ==UserScript==
// @name  Auto Dice
// @namespace   ...
// @description Claim Free
// ==OpenUserJS==
// @author hoangtoanit
// @collaborator hoangtoanit
// ==/OpenUserJS==
// @include     https://freebitco.in/*
// @run-at      document-end
// @grant       GM_addStyle
// @grant       GM_getResourceURL
// @grant		GM_xmlhttpRequest
// @grant       unsafeWindow
// @version     0.0.1
// @icon        https://freebitco.in/favicon.ico
// @credit      ...
// ==/UserScript==
setTimeout(console.log('Start game!'), 60000);
$('.play_jackpot:checked').removeAttr('checked');
$('.jackpot_input_margin:checked').removeAttr('checked');
bconfig = {
	maxBet: 0.00000210,
	resetBet: 0.00000100,
	interest: 0.00005000,
	wait: 400
};

var balance = parseFloat($('#balance')['text']());

var payout = 10;
var countLose = 25;
var countWin = 4;
$('#double_your_btc_min').click();
var startStake = $('#double_your_btc_stake').val();
var	stake = 3;
var interest = 0.00000500;
var confirmStop = false;
var xConfirm = 80;

var hilo = 'lo';

var stopBefore = 5;
var winCount = 0;
var loseCount = 0;
var anlo = 0;
var thualo = 0;

var x = 0;
var xHight = 0;
var cWin = 0;
var counter = 0;
var loseStop = 0;

setParam = function() {	
	$('.maxheight').val(countLose);
	$('.xbefore').val(stake);
	$('.maxloser').val(bconfig.maxBet['toFixed'](8));	
	interest = bconfig.interest;
}

function stopBeforeRedirect() {
	var minutes = parseInt($('title').text());
	if(minutes < stopBefore) {
		console.log('Approaching redirect! Stop the game so we don\'t get redirected while loosing.');
		return true;
	}
	return false;
}

// quick and dirty hack if you have very little bitcoins like 0.0000001
function deexponentize(number) {
	return number * 1000000;
}
function iHaveEnoughMoni() {
	var balance = deexponentize(parseFloat($('#balance').text()));
	var current = deexponentize($('#double_your_btc_stake').val());
	return ((balance*2)/100) * (current*2) > stopPercentage/100;
}

function getRandomWait() {
	var wait = Math.floor(Math.random() * 100) + bconfig.wait;
	console.log('Waiting for ' + wait + 'ms before next bet.');
	return wait;
}

function bet() {
	$('.play_jackpot:checked').removeAttr('checked');
	$('.jackpot_input_margin:checked').removeAttr('checked');
	$('.win-dupbo').val(loseCount);
	$('.win-next').val(winCount);
	$('.wuynh-lo').val(counter);	
	$('.check-start').html('L\u1EE3i nhu\u1EADn: <span style="color:#f00">' + Number(parseFloat($('#balance')['text']()) - balance)['toFixed'](8) + '</span> BTC');
	$('.max-bet').html('C\u01B0\u1EE3c cao nh\u1EA5t: ' + Number(xHight)['toFixed'](8) + ' BTC');
	$('.an-lo').val(anlo);
	$('.thua-lo').val(thualo);
	
	if (parseFloat($('#balance')['text']()) - balance >= interest) {
		throw new Error('Đã đạt lãi như kỳ vọng: ' + Number(parseFloat($('#balance')['text']()) - balance)['toFixed'](8));
	}
	
	if(counter > 3000 && parseFloat($('#balance')['text']()) > balance) {
		throw new Error('Stop Game!');
	}
	
	$('#double_your_btc_bet_lose').unbind();
	$('#double_your_btc_bet_win').unbind();
	
	hilo = (1 == Math['floor'](2 * Math['random']() + 1)) ? 'lo' : 'hi';
	
	$('#double_your_btc_bet_' + hilo + '_button').click();
}

rollDice = function() {
	countLose = $('.maxheight').val();
	stake = $('.xbefore').val();
	maxBet = $('.maxloser').val();
	
	$('.check-start').html('L\u1EE3i nhu\u1EADn: <span style="color:#f00">' + Number(parseFloat($('#balance')['text']()) - balance)['toFixed'](8) + '</span> BTC');
	$('.max-bet').html('C\u01B0\u1EE3c cao nh\u1EA5t: ' + Number(xHight)['toFixed'](8) + ' BTC');
	
	if ($('#double_your_btc_bet_lose').html() != '') {
		if($('#double_your_btc_bet_lose').html().indexOf('lose') != -1) {
			if (loseCount >= countLose) {
				if (x > startStake) {
					if (x < 0.00000040) {
						if((loseCount - countLose) % 5 == 0) {
							x = x * 2;
						}	
					} else {
						x = Number(x) + 0.00000003;
					}
				} else {
					x = stake * startStake;
				}	
				if (x > xHight) {
					xHight = x;
				}
				if (loseCount > $('.check-lose').val()) {
					$('.check-lose').val(loseCount);
				}
				if(x > bconfig.maxBet) {
					x = bconfig.resetBet;
				}
				
				$('#double_your_btc_stake').val(Number(x).toFixed(8));			
			}		
			thualo++;
			loseCount++;
			winCount = 0;
			bet();
		}
		$('#double_your_btc_bet_lose').html('');
	} 
	if ($('#double_your_btc_bet_win').html() != '') {
		if($('#double_your_btc_bet_win').html().indexOf('win') != -1) {
			if(stopBeforeRedirect()) {
				return;
			}
			x = 0;
			anlo++;
			winCount ++;
			loseCount = 0;	
			$('#double_your_btc_min').click();
			$('#double_your_btc_stake').val(startStake);
			bet();
		}
		$('#double_your_btc_bet_win').html('');
	}
	
	counter ++;			
	setTimeout(rollDice, getRandomWait());
};

$('nav')['prepend']('<input class="check-lose" value="0"><input class="check-win" value="0"><input class="xbefore" value="0"><input class="maxloser" value="0"><input class="maxheight" value="0"><p class="all-th"><span class="so-lan-danh"></span><br/><span class="thang-thua"></span><br/></p><label class="entry-hi">S\u1ED1 l\u1EA7n \u0111\xE1nh BET LO<input class="wuynh-hi" value="0" style="width:100%"/><input class="an-hi" value="0" style="width:50%;color:#fff;background:green"><input class="thua-hi" value="0" style="width:50%;color:#fff;background:#f00"></label><label class="entry-lo">S\u1ED1 l\u1EA7n \u0111\xE1nh BET<input class="wuynh-lo" value="0" style="width:100%"/><input class="an-lo" value="0" style="width:50%;color:#fff;background:green"><input class="win-next" value="0" style="width:50%;color:#fff;background:green"><input class="thua-lo" value="0" style="width:50%;color:#fff;background:#f00"></label><input class="win-dupbo" value="0" style="width:50%;color:#fff;background:#f00"></label><button class="check-start"></button><button class="max-bet"></button><button class="load-lai" onclick="stop()">StopNow</button>');

$('.check-lose')['css']({
    position: 'fixed',
    top: '45px',
    left: 0,
    width: '82.5px'
});
$('.check-win')['css']({
    position: 'fixed',
    top: '45px',
    left: '82.5px',
    width: '82.5px'
});
$('.win-dupbo')['css']({
    position: 'fixed',
    top: '75px',
    left: '0px',
    width: '82.5px',
    height: '30px'
});
$('.win-next')['css']({
    position: 'fixed',
    top: '75px',
    left: '82.5px',
    width: '82.5px',
    height: '30px'
});
$('.max-bet')['css']({
    position: 'fixed',
    top: '105px',
    left: 0,
    width: '165px'
});
$('.check-start')['css']({
    position: 'fixed',
    top: '230px',
    left: 0,
    width: '165px',
    background: '#ddd'
});
$('.check-stop')['css']({
    position: 'fixed',
    top: '290px',
    left: 0,
    width: '165px',
    background: '#ddd',
    cursor: 'pointer'
});
$('.all-th')['css']({
    position: 'fixed',
    top: '180px',
    display: 'none',
    right: 0,
    width: '300px',
    background: '#ddd',
    "\x62\x6F\x72\x64\x65\x72\x2D\x74\x6F\x70": '2px solid #aaa'
});
$('.entry-hi')['css']({
    position: 'fixed',
    padding: '5px',
    top: '45px',
    right: 0,
    display: 'none',
    width: '150px',
    background: '#ddd',
    cursor: 'pointer'
});
$('.entry-lo')['css']({
    position: 'fixed',
    padding: '5px',
    top: '45px',
    right: '0px',
    width: '167px',
    background: '#ddd',
    cursor: 'pointer',
    "\x62\x6F\x72\x64\x65\x72\x2D\x72\x69\x67\x68\x74": '2px solid #aaa'
});
$('.load-lai')['css']({
    position: 'fixed',
    top: '250px',
    right: 0,
    width: '167px',
    background: '#ddd',
    cursor: 'pointer'
});
$('.cuoc-lai')['css']({
    position: 'fixed',
    top: '200px',
    right: 0,
    width: '167px',
    background: '#ddd',
    cursor: 'pointer'
});
$('.maxheight')['css']({
    position: 'fixed',
    top: '300px',
    right: '100px',
    width: '67px'
});
$('.xbefore')['css']({
    position: 'fixed',
    top: '300px',
    right: '0px',
    width: '100px'
});
$('.maxloser')['css']({
    position: 'fixed',
    top: '335px',
    right: '0px',
    width: '167px'
});

$('#double_your_btc_min').click();
$('#double_your_btc_stake').val(startStake);
$('#double_your_btc_payout_multiplier').val(payout);

stop = function() {
	document['location'] = '/';
};

setParam();

$('#double_your_btc_bet_' + hilo + '_button').click();

rollDice();
