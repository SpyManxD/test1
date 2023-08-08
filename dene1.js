function DoubleYourBTC(mode) {
    $('#double_your_btc_digits').show();
    var intervalID = setInterval(function () {
        if (mode == 'hi') {
            $('#double_your_btc_digits').html(Math.floor(Math.random() * 5250) + 1 + 1000);
        }
        if (mode == 'lo') {
                    $('#double_your_btc_digits').html(Math.floor(Math.random() * 4750) + 1 + 5250);
                }
            }, 1);
        //...далее идет проверка разных условий страницы сайта, вывод надписей и какие скрипты сработали- загруженные или подставные (часть кода):
          var client_seed = $('#next_client_seed').val();
            $.get('/cgi-bin/bet.pl?m=' + mode + '&client_seed=' + client_seed + '&jackpot=' + jackpot + '&stake=' + bet + '&multiplier=' + $('#payout_multiplier_div').slider('value'), function (data) {
                var result = data.split(':');
                $('#double_your_btc_error').html('');
                $('#double_your_btc_error').hide();
                $('#double_your_btc_stake').removeClass('input-error');
          $('#double_your_btc_bet_win').html('');
                $('#double_your_btc_bet_lose').html('');
               $('#jackpot_message').removeClass('green');
                $('#jackpot_message').removeClass('red');
                $('#jackpot_message').html('');
                $('#jackpot_message').hide();
                if (result[0] == 's1') {
                    $('#double_your_btc_result').show();
                    var number = result[2];
                    var single_digit = number.split('');
                    if (number.toString().length < 5) {
                        var remaining = 5 - number.toString().length;
                        for (var i = 0; i < remaining; i++) {
                            single_digit.unshift('0');
                        }
                    }
                clearInterval(intervalID);
                $('#double_your_btc_digits').html(single_digit[0] + single_digit[1] + single_digit[2] + single_digit[3] + single_digit[4]);
                $('#balance').html(result[3]);
                $('#balance2').html(result[3]);
                $('#balance_usd').html(result[5]);
                $('#next_server_seed_hash').val(result[6]);
                $('#next_nonce').html(result[8]);
                $('.previous_server_seed').html(result[9]);
                $('.previous_server_seed').val(result[9]);
                $('#previous_server_seed_hash').val(result[10]);
                $('.previous_client_seed').html(result[11]);