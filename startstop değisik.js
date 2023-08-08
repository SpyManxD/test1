document.getElementById("free_play_link_li").innerHTML = '<a href="#" onclick="setvars()" class="free_play_link">START BOT</a>';

var stopped,
    min,
    speed,
    max,
    randbet = Math.floor(Math.random() * 10) + 7,
    betsince = '0',
    random,
    betval,
    lastbet;



function hilo(bet) {
    DoubleYourBTC(bet);
    lastbet = bet;
}

function setvars() {
    min = prompt('Min bet', '0.00000005');
    max = prompt('Max bet', '0.000000500');
    speed = prompt('Wait between each bet', '1250');
    start();
    //  randbet = prompt('After how many bets should the next bet be a random high value bet?', '7');
}

function martingale() {
    if (betsince == randbet) {
        betval = random();
        if (betval >= max) {
            betval = max
        }
        else {
            $('#double_your_btc_stake').val(betval);
        }
        betsince = '0';
        hilo('lo');


    }
    else {
        betsince++;

        if ($('#double_your_btc_bet_lose').html() !== '') {

            if ($('#double_your_btc_stake').val() >= max) {
                $('#double_your_btc_stake').val(max);
                hilo('hi');

            }
            else {
                $('#double_your_btc_2x').click();
                hilo('hi');
            }
        }
        else if ($('#double_your_btc_bet_win').html() !== '') {
            $('#double_your_btc_stake').val(min);
            hilo('hi');
        }
        else { sleep(alert("Are you sure you want to continue?")); }
    }
}

function random() {
    return Math.pow((Math.random() * 5.6) + 4.5, -8);
}

function start() {
    document.getElementById("free_play_link_li").innerHTML = '<a href="#" onclick="stop()" class="free_play_link">STOP BOT</a>';
    stopped = false;
    hilo('hi');
    var randspeed = (Math.random() * speed) + 500;
    setInterval(bet, randspeed)
}

function bet() {
    if (stopped != true) {
        martingale();
    }
    else {
        stop();
    }
}

function stop() {
    stopped = true;
    clearInterval();

    document.getElementById("free_play_link_li").innerHTML = '<a href="#" onclick="setvars()" class="free_play_link">START BOT</a>';
}