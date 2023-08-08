function Random(seed) {
  this.seed = Math.random() * Math.pow(2,31);
  this.a = 1103515245;
  this.c = 12345;
  this.m = Math.pow(2, 31);
}

Random.prototype.next = function() {
  this.seed = (this.a * this.seed + this.c) % this.m;
  return this.seed;
};

Random.prototype.nextFloat = function() {
  return this.next() / this.m;
};

var rand = new Random();

var startValue = "0.00000001",
    minimumBalance =  0.00131072,
    multiplier = 2.1,
    stopPercentage = 0.01,
    minWait = 50,
    maxWait = 150,
    stopped = false,
    stopBefore = 3,
    originalBalance = 0,
    beforeStreakBalance = 0,
    averageStartTime=Date.now(),
    gameStartTime=Date.now(),
    satoshisWagered = 0,
    targetValue = 0.00242780,
    autoset_payout = false,
    run_period = 10 * 60 * 1000,
    pause_period = 5 * 60 * 1000,
    btcsgd = 10000;

var bets = 0,
    lossStreak = 0,
    maxLossStreak = [],
    wins  = 0,
    loss  = 0;

var $loButton = $("#double_your_btc_bet_lo_button"),
    $hiButton = $("#double_your_btc_bet_hi_button"),
    $stake    = $("#double_your_btc_stake"),
    $payout   = $("#double_your_btc_payout_multiplier"),
    $lose     = $("#double_your_btc_bet_lose"),
    $win      = $("#double_your_btc_bet_win"),
    $err      = $("#double_your_btc_error"),
    $bal      = $("#balance"),
    $baBal    = $("#bonus_account_balance"),
    $btn      = $loButton,
    thresholds = [0,1],
    payoutTable = [4,3];

var lastBetWin = false,
    side = "lo";

function clearBindings() {
  $lose.unbind();
  $win.unbind();
  $err.unbind();
}

function getBalance() {
  let mainBal = parseFloat($bal.text());
  let baBal  = parseFloat($baBal.text());

  return mainBal + baBal;
}

function randomIntFromInterval(min,max){
  return Math.floor(rand.nextFloat()*(max-min+1)+min);
}

var charSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split('');

function getRandomString(){  
  var lastPoz = 0;
  var randomString = "";
  for (var i = 0; i < 16; i++) {
    var randomPoz = randomIntFromInterval(0, charSet.length - 1);
    randomString += charSet[randomPoz];
    if (lastPoz != randomPoz) {
      var tmp = charSet[lastPoz];
      charSet[lastPoz] = charSet[randomPoz];
      charSet[randomPoz] = tmp;
      lastPoz = randomPoz;
    }
  }
  return randomString;
}

function reseed() {
  var str = getRandomString();
  $("#next_client_seed").val(str);
}

function multiply(){
  var current = $stake.val();
  var x = current * multiplier;
  var x2 = parseFloat(x.toFixed(8)) * multiplier;
  $stake.val(x.toFixed(8));
}

function getRandomWait(){
  var wait = randomIntFromInterval(minWait, maxWait);
  console.log("Waiting for " + wait + " ms");
  return wait;
}

function reset(){
  $stake.val(startValue);
  
  lossStreak = 0;
  beforeStreakBalance = getBalance();
}

function resetStartValues(){
  originalBalance = getBalance();
  satoshisWagered = 0;
  gameStartTime = Date.now();
}

function startGame(){
  console.log("Game started!");
  originalBalance = getBalance();
  reset();
  $btn.trigger("click");
  setTimeout(stopGame, run_period);
}
function stopGame(){
  console.log("Game will stop soon! Let me finish.");
  stopped = true;
  setTimeout(startGame, pause_period);
}

function deexponentize(number){
  return number * 1000000;
}
function iHaveEnoughMoney(){
  var balance = deexponentize(getBalance());
  var current = deexponentize($stake.val());
  return ((balance*multiplier)/100) * (current*multiplier) > stopPercentage/100;
}
function stopBeforeRedirect(){
  var minutes = parseInt($("title").text());
  if( minutes < stopBefore )
  {
    console.log("Approaching redirect! Stop the game so we don't get redirected while losing.");
    stopGame();
    return true;
  }
  return false;
}

function nextClick() {
  var x = parseFloat($stake.val());
  var a = parseFloat(startValue);
  if (autoset_payout) {
      if (lossStreak >= thresholds[thresholds.length-1]) {
        $payout.val(2);
      }  
      for (var idx=0; idx < thresholds.length; idx++) {
        if (lossStreak < thresholds[idx]) {
          $payout.val(payoutTable[idx]);
          break;
        }
      }
  }
  if (lastBetWin) {
    side = side === "lo" ? "hi" : "lo";
    $btn = $("#double_your_btc_bet_"+side+"_button");
  }
  if (lossStreak % randomIntFromInterval(2,5) === 0) {
    reseed();
  }
  $btn.trigger("click");
}

function formatTime(seconds) {
  var sign = "";
  if (seconds < 0) {
    sign = "-";
  }
  quotient  = Math.floor(Math.abs(seconds));
  _seconds  = quotient % 60;
  quotient -= _seconds;
  quotient /= 60;
  _minutes  = quotient % 60;
  quotient -= _minutes;
  quotient /= 60;
  _hours    = quotient % 24;
  quotient -= _hours;
  quotient /= 24;
  _days     = quotient;

  _str =  sign + (_days > 0 ? _days + "d " : "");
  _str += _hours < 10 ? "0" + _hours : _hours;
  _str += ":";
  _str += _minutes < 10 ? "0" + _minutes : _minutes;
  _str += ":";
  _str += _seconds < 10 ? "0" + _seconds : _seconds;
  return _str;
}

function getProfit() {
  return getBalance() - originalBalance;
}

function getAverage() {
  averageProfit = getBalance() - averageStartValue;
}

function recalculateTarget() {
  var betSize = parseFloat(startValue);
  targetValue=0;
  while (getBalance() > targetValue) {
    targetValue += betSize;
    betSize = parseFloat((betSize * multiplier).toFixed(8));
  }
}

function printStats() {
  console.clear();
  css = "background-color: black; color: #0f0; font-size: 10pt";
  elapsedTime = Date.now()-gameStartTime;
  elapsedSeconds = Math.floor(elapsedTime / 1000);

  sgdBalance = getBalance() * btcsgd;
  sgdProfit = (getBalance() - originalBalance) * btcsgd;
  perSecondSgdProfit = sgdProfit/elapsedSeconds;
  perSecondSgdProfit -= (perSecondSgdProfit/elapsedSeconds);
  perMinuteSgdProfit = perSecondSgdProfit * 60;
  perHourSgdProfit = perMinuteSgdProfit * 60;
  perDaySgdProfit = perHourSgdProfit * 24;
  
  var betSize = parseFloat(startValue);
  
  if (getBalance() > targetValue) {
    recalculateTarget();
  }
  
  targetValueSgd = targetValue * btcsgd;

  str = "Balance:\t\tS$ " + sgdBalance.toFixed(4) + "\t| ";
  str += "Profit since start:\tS$ " + sgdProfit.toFixed(4) + "\t| ";
  str += "Rate of earnings: S$ " + perMinuteSgdProfit.toFixed(4) + "/minute";

  str += "\n";

  str += "Time before S$" + targetValueSgd.toFixed(2) + ":\t";
  str += formatTime((targetValueSgd - sgdBalance) / perSecondSgdProfit) + "\t| ";
  str += "Total Wagered:\tBTC " + satoshisWagered.toFixed(8) + "\t| ";
  str += "Time since start:\t" + formatTime(elapsedSeconds);

  str = "%c" + str
  console.log(str, css);
}

clearBindings();

$lose.bind("DOMSubtreeModified",function(event){
  if($(event.currentTarget).is(':contains("lose")') )
  {
    lossStreak++;
    loss++;
    bets++;
    satoshisWagered += $stake.val() * 1;
    lastBetWin = false;
    /*if (getBalance() < minimumBalance) {
      clearBindings();
      return null;
    }*/
    multiply();
    setTimeout(nextClick, randomIntFromInterval(minWait, maxWait));
  }
});

$win.bind("DOMSubtreeModified",function(event){
  if($(event.currentTarget).is(":contains('win')") )
  {

    if (maxLossStreak[lossStreak]) {
      maxLossStreak[lossStreak] = maxLossStreak[lossStreak] + 1;
    } else {
      maxLossStreak[lossStreak] = 1;
    }
    wins++;
    bets++;

    lastBetWin = true;
    satoshisWagered += $stake.val() * 1;
    
    if (getBalance() > targetValue) {
      if (getBalance() > minimumBalance) {
        thresholds = thresholds.map(x => x+1);
        thresholds.unshift(0);
        payoutTable.unshift(payoutTable[0]+1);
      } else {
          multiplier = multiplier > 2.0 ? 2.0 : 2.1;
          $payout.val(multiplier > 2.0 ? 2.0 : 2.1);
      }
    }

    if( stopBeforeRedirect() )
    {
      return;
    }
    if( iHaveEnoughMoney() )
    {
      reset();
      if( stopped )
      {
        stopped = false;
        return false;
      }
    }

    setTimeout(nextClick, randomIntFromInterval(minWait, maxWait));
  }
});

$err.bind("DOMSubtreeModified", function(event){
  if($(event.currentTarget).is(':contains("timed out")') )
  {
    console.log("Request timed out! :( But we're betting again!");
    nextClick();
  }
});
