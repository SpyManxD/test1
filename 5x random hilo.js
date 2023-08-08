function getData(a) {
    for (var b, c = document.cookie.split("; "), d = c.length; d--; )
        if (b = c[d].split("="), b[0] === a)
            return b[1];
    return!1
}
function higherBet() {
    $(".max-bet").text("Cu?c cao nh?t: " + higherbet + " BTC")
}
function changeBet(a) {
    startValue = a
}
function realtime(a) {
    var b = parseInt(a, 10), c = Math.floor(b / 3600), d = Math.floor((b - 3600 * c) / 60), e = b - 3600 * c - 60 * d;
    0 != c ? c += " Hours " : c = "", 0 != d ? d += " Minutes " : d = "", 10 > e && (e = e);
    var a = "Playing time = " + c + d + e + " Secondes";
    return a
}
function roundnumb() {
    round == stopAt ? stopGame() : (round += 1, $(".so-lan-danh").text("L?n dánh: " + round + " / " + stopAt));
    var a = $("#balance").text(), b = (Number(a) - Number(startbalance)).toFixed(8);
    $(".check-start").html('L?i nhu?n: <span style="color:#f00">' + b + "</span> BTC")
}
function multiply() {
    var a = $("#double_your_btc_stake").val(), b = (1 * a).toFixed(8), c = (2 * a).toFixed(8), d = $(".in-check-lose").val();
    (4 == d || 8 == d || 12 == d || 16 == d || 20 == d || 25 == d || 30 == d || 35 == d || 40 == d || 45 == d || 50 == d || 54 == d || 58 == d || 62 == d || 66 == d || 70 == d || 75 == d || 80 == d || 85 == d || 90 == d || 95 == d || 100 == d || 105 == d) && (b = c), 35 == d && (confirm("Tài kho?n c?a b?n dang di vào chu?i c?a freebitco.in v?i m?c chu?i 86, tools t? d?ng d?ng, n?u b?n mu?n ti?p t?c choi ti?p thì b?m vào OK. D?ng l?i thì b?m H?Y !!!") || (document.location = "/")), 40 == d && (confirm("Tài kho?n c?a b?n dang di vào chu?i c?a freebitco.in v?i m?c chu?i 95, tools t? d?ng d?ng, n?u b?n mu?n ti?p t?c choi ti?p thì b?m vào OK. D?ng l?i thì b?m H?Y !!!") || (document.location = "/")), 45 == d && (confirm("Tài kho?n c?a b?n dang di vào chu?i c?a freebitco.in v?i m?c chu?i 95, tools t? d?ng d?ng, n?u b?n mu?n ti?p t?c choi ti?p thì b?m vào OK. D?ng l?i thì b?m H?Y !!!") || (document.location = "/")), $("#double_your_btc_stake").val(b), b > higherbet && (higherbet = b)
}
function getRandomWait() {
    var a = parseInt($(".in-check-lose").val()), b = maxWait + 50 * a;
    return console.log("Waiting for " + b + "ms before next bet."), b
}
function startGame(a) {
    starttime = (new Date).getTime(), startValue = prompt("B?n cu?c bao nhiêu :", "0.00000001"), oldbet = startValue, round = 0, gameLost = 0, gameWin = 0, reset(), 1 == x ? (console.log("Ðánh Hi random 1"), $hiButton.trigger("click")) : (console.log("Ðánh Lo random 2"), $loButton.trigger("click")), stopAt = null !== a ? a : -1
}
function stopGame() {
    stopped = !0, startValue = oldbet
}
function reset() {
    round % 100 === 0 && 0 != round && (startValue = (1 * startValue).toFixed(8)), $("#double_your_btc_stake").val(startValue)
}
function deexponentize(a) {
    return 1e6 * a
}
function iHaveEnoughMoni() {
    var a = deexponentize(parseFloat($("#balance").text())), b = deexponentize($("#double_your_btc_stake").val());
    return 2 * a / 100 * (2 * b) > stopPercentage / 100
}
function stopBeforeRedirect() {
    var a = parseInt($("title").text());
    return stopBefore > a ? (stopGame(), !0) : !1
}
var startbalance = 0,
        stopAt = "?",
        round = 0,
        gameLost = 0,
        gameWin = 0,
        higherbet = 0;
startbalance = $("#balance").text();
var startValue = "0.00000001",
        stopPercentage = .001,
        maxWait = 800,
        stopped = !1,
        stopBefore = 2,
        oldbet = 1e-8,
        $loButton = $("#double_your_btc_bet_lo_button"),
        $hiButton = $("#double_your_btc_bet_hi_button"),
        x = Math.floor(2 * Math.random() + 1);
1 == x ? console.log("Random" + x, "color: #00CC00") : console.log("Random " + x, "color: #FF0000"),
        $("#double_your_btc_bet_lose").unbind(),
        $(".payout_value_input").val(5),
        $("#double_your_btc_bet_win").unbind();
var $min = 5,
        $max = 8,
        $max_lan_danh = 999;
$("#double_your_btc_bet_lose").bind("DOMSubtreeModified",
        function (a) {
            if ($(a.currentTarget).is(':contains("lose")')) {
                var b = parseInt($(".in-check-lose").val()),
                        c = parseInt($(".wuynh-hi").val()),
                        d = parseInt($(".wuynh-lo").val()),
                        e = (parseInt($(".an-hi").val()), parseInt($(".thua-hi").val())),
                        f = (parseInt($(".an-lo").val()), parseInt($(".thua-lo").val())),
                        g = c + d;
                gameLost += 1, roundnumb(),
                        $(".thang-thua").html('<span style="color:green">Win: ' + gameWin + " - Lost: " + gameLost + "</span>"), endtime = (new Date).getTime();
                Math.floor((endtime - starttime) / 1e3);
                if (higherBet(), g > $max_lan_danh)
                    if ($(".in-check-lose").val(b + 1), b > $min && $max > b) {
                        var h = d + 1, i = f + 1;
                        $(".wuynh-lo").val(h), $(".thua-lo").val(i), multiply(), setTimeout(function () {
                            var a = Math.floor(2 * Math.random() + 1);
                            1 == a ? (console.log("Thua Hi random 1"), $loButton.trigger("click")) : $hiButton.trigger("click")
                        }, getRandomWait())
                    } else {
                        var h = c + 1, j = e + 1;
                        $(".wuynh-hi").val(h), $(".thua-hi").val(j), multiply(), setTimeout(function () {
                            var a = Math.floor(2 * Math.random() + 1);
                            1 == a ? (console.log("Thua Hi random 1"), $hiButton.trigger("click")) : (console.log("Thua Lo random 2"), $loButton.trigger("click"))
                        }, getRandomWait())
                    }
                else if ($(".in-check-lose").val(b + 1), b > $min && $max > b) {
                    var h = c + 1, j = e + 1;
                    $(".wuynh-hi").val(h), $(".thua-hi").val(j), multiply(), setTimeout(function () {
                        var a = Math.floor(2 * Math.random() + 1);
                        1 == a ? (console.log("Thua Hi random 1"), $hiButton.trigger("click")) : (console.log("Thua Lo random 2"), $loButton.trigger("click"))
                    }, getRandomWait())
                } else {
                    var h = d + 1, i = f + 1;
                    $(".wuynh-lo").val(h), $(".thua-lo").val(i), multiply(), setTimeout(function () {
                        var a = Math.floor(2 * Math.random() + 1);
                        1 == a ? (console.log("Thua Lo random 1"), $loButton.trigger("click")) : (console.log("Thua Hi random 2"), $hiButton.trigger("click"))
                    }, getRandomWait())
                }
            }
        }), $("#double_your_btc_bet_win").bind("DOMSubtreeModified", function (a) {
    if ($(a.currentTarget).is(':contains("win")')) {
        gameWin += 1, roundnumb(), endtime = (new Date).getTime();
        Math.floor((endtime - starttime) / 1e3);
        if (higherBet(), stopBeforeRedirect())
            return;
        if (iHaveEnoughMoni()) {
            var b = parseInt($(".in-check-lose").val()), c = parseInt($(".wuynh-hi").val()), d = parseInt($(".wuynh-lo").val()), e = parseInt($(".an-hi").val()), f = parseInt($(".an-lo").val()), g = c + 1, h = d + 1, i = e + 1, j = f + 1, k = (parseInt($(".thua-lo").val()), c + d);
            if (k > $max_lan_danh) {
                if (b > $min && $max > b) {
                    if ($(".wuynh-lo").val(h), $(".an-lo").val(j), $(".in-check-lose").val(0), reset(), stopped)
                        return stopped = !1, !1
                } else if ($(".wuynh-hi").val(g), $(".an-hi").val(i), $(".in-check-lose").val(0), reset(), stopped)
                    return stopped = !1, !1
            } else if (b > $min && $max > b) {
                if ($(".wuynh-hi").val(g), $(".an-hi").val(i), $(".in-check-lose").val(0), reset(), stopped)
                    return stopped = !1, !1
            } else if ($(".wuynh-lo").val(h), $(".an-lo").val(j), $(".in-check-lose").val(0), reset(), stopped)
                return stopped = !1, !1
        }
        setTimeout(function () {
            var a = Math.floor(2 * Math.random() + 1);
            1 == a ? (console.log("Thua Hi random 1"), $hiButton.trigger("click")) : (console.log("Thua Lo random 2"), $loButton.trigger("click"))
        }, getRandomWait())
    }
}), $("nav").prepend('<span class="check-lose" >Ðang dánh:<br/><input value="0" class="in-check-lose"></span><button class="check-start"></button><button class="load-lai">StopNow</button><button class="check-stop">StopWin</button>'), $(".check-lose").css({position: "fixed", top: "45px", left: 0, width: "167px"}), $(".in-check-lose").css({width: "167px"}), $(".check-start").css({position: "fixed", top: "150px", left: 0, width: "167px", background: "#ddd"}), $(".check-stop").css({position: "fixed", top: "250px", left: 0, width: "167px", background: "#ddd", cursor: "pointer"}), $(".load-lai").css({position: "fixed", top: "75px", right: 0, width: "167px", background: "#ddd", cursor: "pointer"}), $(".load-lai").click(function () {
    document.location = "/"
}), $(".check-stop").click(function () {
    stopGame()
}), startGame();