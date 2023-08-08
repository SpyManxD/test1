// ==UserScript==
// @name        Ding x10(antoan)
// @namespace   ...
// @description odd x10, profit 2.5
// ==OpenUserJS==
// @author ding2020
// @collaborator DingBiz
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
    
var startbalance = 0,
        stopAt = '?',
        round = 0,
        gameLost = 0,
        gameWin = 0,
        higherbet = 0,
        startbalance = $('#balance')['text'](),
        old_amount = Number(startbalance)['toFixed'](8),
        new_amount = Number(0.003)['toFixed'](8);
                function _0xe70dx3() {
                    $('.max-bet')['text']('C\u01B0\u1EE3c cao nh\u1EA5t: ' + higherbet + ' BTC')
                }

                function _0xe70dx4() {
                    round == stopAt ? (_0xe70dx1a = !0, _0xe70dx19 = _0xe70dx1b) : (round += 1, $('.so-lan-danh')['text']('L\u1EA7n \u0111\xE1nh: ' + round + ' / ' + stopAt));
                    var _0xe70dxf = $('#balance')['text'](),
                        _0xe70dx10 = (Number(_0xe70dxf) - Number(startbalance))['toFixed'](8),
                        _0xe70dxf = (Number(_0xe70dxf) * _0xe70dx1c / 100)['toFixed'](8);
                    _0xe70dx10 >= _0xe70dxf && (alert('L\xE3i b\u1EA1n \u0111\xE3 \u0111\u1EA1t ' + _0xe70dx1c + '%'), _0xe70dx1a = !0, _0xe70dx19 = _0xe70dx1b);
                    $('.check-start')['html']('L\u1EE3i nhu\u1EADn: <span style="color:#f00">' + _0xe70dx10 + '</span> BTC')
                }

                function _0xe70dx5() {
                    console['clear']();
                    var _0xe70dxf = (1 * $('#double_your_btc_stake')['val']())['toFixed'](8);
                    $('.win-dupbo')['val']();
                    $('#double_your_btc_stake')['val'](_0xe70dxf);
                    higherbet < _0xe70dxf && (higherbet = _0xe70dxf)
                }

                function _0xe70dx11() {
                    var _0xe70dxf = $('#double_your_btc_stake')['val']();
                    var _0xe70dx10 = $('.xbefore')['val']();
                    var _0xe70dx12 = _0xe70dx10 * _0xe70dx19,
                        _0xe70dx5 = $('.maxloser')['val'](),
                        _0xe70dx13 = (_0xe70dxf * _0xe70dx10)['toFixed'](8);
                    _0xe70dx13 > _0xe70dx12 ? (_0xe70dx12 = parseInt($('.maxheight')['val']()), _0xe70dx13 = parseInt($('.win-dupbo')['val']()), _0xe70dx13 == _0xe70dx12 + 1 || _0xe70dx13 == _0xe70dx12 + 4 || _0xe70dx13 == _0xe70dx12 + 8 || _0xe70dx13 == _0xe70dx12 + 12 || _0xe70dx13 == _0xe70dx12 + 16 || _0xe70dx13 == _0xe70dx12 + 20 || _0xe70dx13 == _0xe70dx12 + 25 || _0xe70dx13 == _0xe70dx12 + 30 || _0xe70dx13 == _0xe70dx12 + 35 || _0xe70dx13 == _0xe70dx12 + 40 || _0xe70dx13 == _0xe70dx12 + 45 || _0xe70dx13 == _0xe70dx12 + 50 || _0xe70dx13 == _0xe70dx12 + 54 || _0xe70dx13 == _0xe70dx12 + 58 || _0xe70dx13 == _0xe70dx12 + 62 || _0xe70dx13 == _0xe70dx12 + 66 || _0xe70dx13 == _0xe70dx12 + 70 || _0xe70dx13 == _0xe70dx12 + 75 || _0xe70dx13 == _0xe70dx12 + 80 || _0xe70dx13 == _0xe70dx12 + 85 || _0xe70dx13 == _0xe70dx12 + 90 || _0xe70dx13 == _0xe70dx12 + 95 ? (console['log'](_0xe70dx13), _0xe70dx10 = $('.xbefore')['val'](), multi = (2 * _0xe70dxf)['toFixed'](8)) : multi = _0xe70dxf, 60 != _0xe70dx13 && 65 != _0xe70dx13 || confirm('T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n \u0111ang \u0111i v\xE0o chu\u1ED7i c\u1EE7a freebitco.in v\u1EDBi m\u1EE9c chu\u1ED5i ' + _0xe70dx13 + ', tools t\u1EF1 \u0111\u1ED9ng d\u1EEBng, n\u1EBFu b\u1EA1n mu\u1ED1n ti\u1EBFp t\u1EE5c ch\u01A1i ti\u1EBFp th\xEC b\u1EA5m v\xE0o OK. D\u1EEBng l\u1EA1i th\xEC b\u1EA5m H\u1EE6Y !!!') || (document['location'] = '/'), multi > _0xe70dx5 && (multi = (1E-8 * _0xe70dx10)['toFixed'](8)), $('#double_your_btc_stake')['val'](multi)) : $('#double_your_btc_stake')['val'](_0xe70dx13)
                }

                function _0xe70dx14() {
                    var _0xe70dxf = 200 + 10 * parseInt($('.win-dupbo')['val']());
                    console['log']('\u0110ang \u0111\u1EE3i ' + _0xe70dxf + 'ms tr\u01B0\u1EDBc khi \u0111\u1EB7t c\u01B0\u1EE3c ti\u1EBFp theo.');
                    return _0xe70dxf
                }

                function _0xe70dx15(_0xe70dxf) {
                    starttime = (new Date)['getTime']();
                    _0xe70dx19 = prompt('B\u1EA1n c\u01B0\u1EE3c bao nhi\xEAu :', '0.00000002');
                    checkch = prompt('Check chu\u1ED7i b\xE0o nhi\xEAu :', '25');
                    xb = prompt('X bao nhi\xEAu cho l\u1EA7n \u0111\u1EA7u :', '2');
                    ma = prompt('Gi\u1EDBi h\u1EA1n loser tr\u1EDF v\u1EC1 :', '0.00364000');
                    _0xe70dx1c = prompt('L\xE3i bao nhi\xEAu % :', '10');
                    30 < _0xe70dx1c && (_0xe70dx1c = 30, alert('Kh\xF4ng \u0111\u01B0\u1EE3c ph\xE9p nh\u1EADp s\u1ED1 l\xE3i l\u1EDBn h\u01A1n 30% so v\u1EDBi s\u1ED1 v\u1ED1n, m\u1EB7c \u0111\u1ECBnh s\u1EBD l\u1EA5y 30% n\u1EBFu nh\u1EADp l\u1EDBn h\u01A1n !'));
                    _0xe70dx1b = _0xe70dx19;
                    $('.xbefore')['val'](xb);
                    $('.maxloser')['val'](ma);
                    $('.maxheight')['val'](checkch);
                    gameWin = gameLost = round = 0;
                    _0xe70dx16();
                    1 == _0xe70dx1f ? _0xe70dx1e['trigger']('click') : _0xe70dx1d['trigger']('click');
                    stopAt = null !== _0xe70dxf ? _0xe70dxf : -1
                }

                function _0xe70dx16() {
                    0 === round % 100 && 0 != round && (_0xe70dx19 = (1 * _0xe70dx19)['toFixed'](8));
                    $('.win-next')['val'](0);
                    $('.check-lose')['val'](0);
                    $('.check-win')['val'](0);
                    $('.win-dupbo')['val'](0);
                    $('#double_your_btc_stake')['val'](_0xe70dx19)
                }

                function _0xe70dx17() {
                    var _0xe70dxf = 1E6 * parseFloat($('#balance')['text']()),
                        _0xe70dx10 = 1E6 * $('#double_your_btc_stake')['val']();
                    return 1E-5 < 2 * _0xe70dxf / 100 * 2 * _0xe70dx10
                }
                var _0xe70dx19 = '0.00000001',
                    _0xe70dx1a = !1,
                    _0xe70dx1b = 1E-8,
                    _0xe70dx1c = 30,
                    _0xe70dx1d = $('#double_your_btc_bet_lo_button'),
                    _0xe70dx1e = $('#double_your_btc_bet_hi_button'),
                    _0xe70dx1f = Math['floor'](2 * Math['random']() + 1);
                $('#double_your_btc_bet_lose')['unbind']();
                $('#double_your_btc_bet_win')['unbind']();
                $('#double_your_btc_bet_lose')['bind']('DOMSubtreeModified', function(_0xe70dxf) {
                    if ($(_0xe70dxf['currentTarget'])['is'](':contains("lose")')) {
                        _0xe70dxf = parseInt($('.win-dupbo')['val']());
                        var _0xe70dx10 = parseInt($('.xbefore')['val']());
                        parseInt($('.maxloser')['val']());
                        parseInt($('.wuynh-hi')['val']());
                        var _0xe70dx12 = parseInt($('.wuynh-lo')['val']());
                        parseInt($('.an-hi')['val']());
                        parseInt($('.thua-hi')['val']());
                        parseInt($('.an-lo')['val']());
                        var _0xe70dx19 = parseInt($('.thua-lo')['val']());
                        0 == _0xe70dx13 && alert('S\u1ED1 max cao nh\u1EA5t ch\u01B0a nh\u1EADp !');
                        0 == _0xe70dx10 && alert('S\u1ED1 c\u01B0\u1EE3c nh\xE2n l\xEAn \u0111\u1EA7u ch\u01B0a nh\u1EADp !');
                        gameLost += 1;
                        _0xe70dx4();
                        $('.thang-thua')['html']('<span style="color:green">Win: ' + gameWin + ' - Lost: ' + gameLost + '</span>');
                        endtime = (new Date)['getTime']();
                        var _0xe70dx13 = parseInt($('.maxheight')['val']());
                        parseInt($('.win-next')['val']());
                        _0xe70dx10 = parseInt($('.win-dupbo')['val']());
                        _0xe70dx3();
                        $('.win-dupbo')['val'](_0xe70dxf + 1);
                        _0xe70dx12 += 1;
                        _0xe70dx19 += 1;
                        _0xe70dxf = parseInt($('.check-win')['val']());
                        $('.wuynh-lo')['val'](_0xe70dx12);
                        $('.thua-lo')['val'](_0xe70dx19);
                        _0xe70dx10 >= _0xe70dx13 ? _0xe70dx11() : ($('.check-win')['val'](0), _0xe70dx5());
                        setTimeout(function() {
                            1 == Math['floor'](2 * Math['random']() + 1) ? _0xe70dx1d['trigger']('click') : _0xe70dx1e['trigger']('click')
                        }, _0xe70dx14())
                    }
                });
                $('#double_your_btc_bet_win')['bind']('DOMSubtreeModified', function(_0xe70dxf) {
                    if ($(_0xe70dxf['currentTarget'])['is'](':contains("win")') && (gameWin += 1, _0xe70dx4(), endtime = (new Date)['getTime'](), _0xe70dx3(), 2 > parseInt($('title')['text']()) ? (_0xe70dx1a = !0, _0xe70dx19 = _0xe70dx1b, _0xe70dxf = !0) : _0xe70dxf = !1, !_0xe70dxf)) {
                        if (_0xe70dx17()) {
                            parseInt($('.wuynh-hi')['val']());
                            var _0xe70dx10 = parseInt($('.wuynh-lo')['val']());
                            parseInt($('.an-hi')['val']());
                            _0xe70dxf = parseInt($('.an-lo')['val']());
                            _0xe70dx10 += 1;
                            _0xe70dxf += 1;
                            parseInt($('.thua-lo')['val']());
                            parseInt($('.check-win')['val']());
                            parseInt($('.win-next')['val']());
                            parseInt($('.win-dupbo')['val']());
                            parseInt($('.check-lose')['val']());
                            parseInt($('.check-win')['val']());
                            parseInt($('.maxheight')['val']());
                            $('.wuynh-lo')['val'](_0xe70dx10);
                            $('.an-lo')['val'](_0xe70dxf);
                            _0xe70dx5();
                            _0xe70dx16();
                            if (_0xe70dx1a) {
                                return _0xe70dx1a = !1
                            }
                        };
                        setTimeout(function() {
                            1 == Math['floor'](2 * Math['random']() + 1) ? _0xe70dx1d['trigger']('click') : _0xe70dx1e['trigger']('click')
                        }, _0xe70dx14())
                    }
                });
                $('.payout_value_input')['val'](10);
                $('nav')['prepend']('<input class="check-lose" value="0"><input class="check-win" value="0"><input class="xbefore" value="0"><input class="maxloser" value="0"><input class="maxheight" value="0"><p class="all-th"><span class="so-lan-danh"></span><br/><span class="thang-thua"></span><br/></p><label class="entry-hi">S\u1ED1 l\u1EA7n \u0111\xE1nh BET LO<input class="wuynh-hi" value="0" style="width:100%"/><input class="an-hi" value="0" style="width:50%;color:#fff;background:green"><input class="thua-hi" value="0" style="width:50%;color:#fff;background:#f00"></label><label class="entry-lo">S\u1ED1 l\u1EA7n \u0111\xE1nh BET<input class="wuynh-lo" value="0" style="width:100%"/><input class="an-lo" value="0" style="width:50%;color:#fff;background:green"><input class="win-next" value="0" style="width:50%;color:#fff;background:green"><input class="thua-lo" value="0" style="width:50%;color:#fff;background:#f00"></label><input class="win-dupbo" value="0" style="width:50%;color:#fff;background:#f00"></label><button class="check-start"></button><button class="max-bet"></button><button class="load-lai">StopNow</button><button class="cuoc-lai">C\u01B0\u1EE3c l\u1EA1i</button><button class="check-stop">StopWin</button>');
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
                    top: '173px',
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
                $('.load-lai')['click'](function() {
                    document['location'] = '/'
                });
                $('.check-stop')['click'](function() {
                    _0xe70dx1a = !0;
                    _0xe70dx19 = _0xe70dx1b
                });
                $('.cuoc-lai')['click'](function() {
                    _0xe70dx15()
                });
                _0xe70dx15()