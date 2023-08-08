//bat dau 0.0000005 sau 15 lan ma thua 
//thi tang len 15 * 0.00000005 . Neu ma thua nua thi se la 
//0.0000001125

var startValue = '0.00000005', // Don't lower the decimal point more than 4x of current balance
  stopPercentage = 0.008, // In %. I wouldn't recommend going past 0.08
  maxWait = 10, // In milliseconds
  stopped = false,
  stopBefore = 3; // In minutes
let backodd = 15;
var startodd = 2;

var $loButton = $('#double_your_btc_bet_lo_button'),
  $hiButton = $('#double_your_btc_bet_hi_button');

function multiply(){
  var current = $('#double_your_btc_stake').val();
  var multiply = (current * 2).toFixed(8);
  $('#double_your_btc_stake').val(multiply);
}

function getRandomWait(){
  var wait = Math.floor(Math.random() * maxWait ) + 400;

  console.log('Waiting for ' + wait + 'ms before next bet.');

  return wait ;
}

function startGame(){
  console.log('Game started!');
  reset();
  $loButton.trigger('click');
}

function stopGame(){
  console.log('Game will stop soon! Let me finish.');
  stopped = true;
}

function reset(){
  $('#double_your_btc_stake').val(startValue);
}

// quick and dirty hack if you have very little bitcoins like 0.0000001
function deexponentize(number){
  return number * 1000000;
}

function iHaveEnoughMoni(){
  var balance = deexponentize(parseFloat($('#balance').text()));
  var current = deexponentize($('#double_your_btc_stake').val());

  return ((balance2)/100) * (current2) > stopPercentage/100;
}

function changeodd(){
  var cur = parseFloat( $('#double_your_btc_payout_multiplier').val() ); 
  cur = cur + 1;
  if (cur >= backodd){
    let  current = $('#double_your_btc_stake').val();
    let multiply = (backodd * current).toFixed(8);
    $('#double_your_btc_stake').val(multiply);

    $('#double_your_btc_payout_multiplier').val(startodd);
  }else {
    $('#double_your_btc_payout_multiplier').val(cur);
  }
}

// Unbind old shit
$('#double_your_btc_bet_lose').unbind();
$('#double_your_btc_bet_win').unbind();

// Loser
$('#double_your_btc_bet_lose').bind("DOMSubtreeModified",function(event){
  if( $(event.currentTarget).is(':contains("lose")') )
  {
    console.log('You LOST! Multiplying your bet and betting again.');

    changeodd();

    setTimeout(function(){
      $loButton.trigger('click');
    }, getRandomWait());

    //  $loButton.trigger('click');
  }
});
// Timeout
$('#double_your_btc_error').bind("DOMSubtreeModified",function(event){
  if( $(event.currentTarget).is(':contains("timed")') )
  {
    console.log('You timout !Click again.');

    //changeodd();

    setTimeout(function(){
      $loButton.trigger('click');
    }, getRandomWait());

    //  $loButton.trigger('click');
  }
});


function resetodd(){
  $('#double_your_btc_payout_multiplier').val(startodd);
}

// Winner
$('#double_your_btc_bet_win').bind("DOMSubtreeModified",function(event){
  if( $(event.currentTarget).is(':contains("win")') )
  {
    resetodd();

    $('#double_your_btc_stake').val(startValue);
    setTimeout(function(){
      $loButton.trigger('click');
    }, getRandomWait());

    //$loButton.trigger('click');
  }
});startGame();