//FIFTYMILLION_CHANNEL

var startValue = '0.0000001', // Don't lower the decimal point more than 4x of current balance
maxWait = 555,
stopped = false, // debugging
stopBefore = 1; // In minutes for timer before stopping redirect on webpage
var $loButton = $('#double_your_btc_bet_lo_button'),
$hiButton = $('#double_your_btc_bet_hi_button');
function multiply(){
var current = $('#double_your_btc_stake').val();
var multiply = (current * 2).toFixed(8);
$('#double_your_btc_stake').val(multiply);
}
function getRandomWait(){
var wait = Math.floor(Math.random() * maxWait ) + 100;
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
function deexponentize(number){
return number * 10000000;
}
function iHaveEnoughMoni(){
var balance = deexponentize(parseFloat($('#balance').text()));
var current = deexponentize($('#double_your_btc_stake').val());
return ((balance)*2/100) * (current*2.77) > stopPercentage/100;
}
function stopBeforeRedirect(){
var minutes = parseInt($('title').text());
if( minutes < stopBefore )
{
console.log('Approaching redirect! Stop the game so we don\'t get redirected while loosing.');
stopGame();
return true;
}
return false;
}
$('#double_your_btc_bet_lose').unbind();
$('#double_your_btc_bet_win').unbind();
$('#double_your_btc_bet_lose').bind("DOMSubtreeModified",function(event){
if( $(event.currentTarget).is(':contains("lose")') )
{
console.log('You LOST! Multiplying your bet and betting again.');
multiply();
setTimeout(function(){
$loButton.trigger('click');
}, getRandomWait());
}
});
$('#double_your_btc_bet_win').bind("DOMSubtreeModified",function(event){
if( $(event.currentTarget).is(':contains("win")') )
{
reset();
getRandomWait();
$hiButton.trigger('click');
if( stopBeforeRedirect() )
                {
                        return;
                }
if( iHaveEnoughMoni() )
{
console.log('You WON! But don\'t be greedy. Restarting!');
reset();
if( stopped )
{
stopped = false;
return false;
}
}
else
{
console.log('You WON! Betting again');
}
setTimeout(function(){
$loButton.trigger('click');
}, getRandomWait());
}
});startGame()