function msg_numToVarInt(a) {
    if (253 > a)
        return [a];
    if (65535 >= a)
        return [253, a & 255, a >>> 8];
    throw "message too large";
}
function msg_bytes(a) {
    a = Crypto.charenc.UTF8.stringToBytes(a);
    return msg_numToVarInt(a.length).concat(a)
}
function msg_digest(a) {
    a = msg_bytes("Bitcoin Signed Message:\n").concat(msg_bytes(a));
    return Crypto.SHA256(Crypto.SHA256(a, {
        asBytes: !0
    }), {
        asBytes: !0
    })
}
function verify_message(a, g, f) {
    try {
        var e = Crypto.util.base64ToBytes(a)
    } catch (d) {
        return !1
    }
    if (65 != e.length)
        return !1;
    var b = BigInteger.fromByteArrayUnsigned(e.slice(1, 33));
    a = BigInteger.fromByteArrayUnsigned(e.slice(33, 65));
    var c = !1
      , e = e[0];
    if (27 > e || 35 <= e)
        return !1;
    31 <= e && (c = !0,
    e -= 4);
    var h = BigInteger.valueOf(e - 27)
      , m = getSECCurveByName("secp256k1")
      , l = m.getCurve()
      , n = l.getA().toBigInteger()
      , q = l.getB().toBigInteger()
      , p = l.getQ()
      , e = m.getG()
      , m = m.getN()
      , r = b.add(m.multiply(h.divide(BigInteger.valueOf(2))))
      , n = r.multiply(r).multiply(r).add(n.multiply(r)).add(q).mod(p).modPow(p.add(BigInteger.ONE).divide(BigInteger.valueOf(4)), p)
      , h = n.subtract(h).isEven() ? n : p.subtract(n)
      , l = new ECPointFp(l,l.fromBigInteger(r),l.fromBigInteger(h));
    g = BigInteger.fromByteArrayUnsigned(msg_digest(g)).negate().mod(m);
    b = b.modInverse(m);
    a = l.multiply(a).add(e.multiply(g)).multiply(b).getEncoded(c);
    a = new Bitcoin.Address(Bitcoin.Util.sha256ripe160(a));
    a.version = f ? f : 0;
    return a.toString()
}
function sign_message(a, g, f, e) {
    if (!a)
        return !1;
    var d = a.sign(msg_digest(g));
    a = new Bitcoin.Address(a.getPubKeyHash());
    a.version = e ? e : 0;
    for (var b = Bitcoin.ECDSA.parseSig(d), d = [0], d = d.concat(b.r.toByteArrayUnsigned()), d = d.concat(b.s.toByteArrayUnsigned()), b = 0; 4 > b; b++) {
        var c = 27 + b;
        f && (c += 4);
        d[0] = c;
        c = Crypto.util.bytesToBase64(d);
        if (verify_message(c, g, e) == a)
            return c
    }
    return !1
}
function bitcoinsig_test() {
    payload = Bitcoin.Base58.decode("5JeWZ1z6sRcLTJXdQEDdB986E6XfLAkj9CgNE4EHzr5GmjrVFpf");
    secret = payload.slice(1, 33);
    compressed = 38 == payload.length;
    console.log(verify_message("HDiv4Oe9SjM1FFVbKk4m3N34efYiRgkQGGoEm564ldYt44jHVTuX23+WnihNMi4vujvpUs1M529P3kftjDezn9E=", "test message"));
    sig = sign_message(new Bitcoin.ECKey(secret), "test message", compressed);
    console.log(verify_message(sig, "test message"))
}
"undefined" != typeof require && require.main === module && (window = global,
navigator = {},
Bitcoin = {},
eval(require("fs").readFileSync("./bitcoinjs-min.js") + ""),
eval(require("path").basename(module.filename, ".js") + "_test()"));
(function() {
    var a = window.Crypto = {}
      , g = a.util = {
        rotl: function(a, d) {
            return a << d | a >>> 32 - d
        },
        rotr: function(a, d) {
            return a << 32 - d | a >>> d
        },
        endian: function(a) {
            if (a.constructor == Number)
                return g.rotl(a, 8) & 16711935 | g.rotl(a, 24) & 4278255360;
            for (var d = 0; d < a.length; d++)
                a[d] = g.endian(a[d]);
            return a
        },
        randomBytes: function(a) {
            for (var d = []; 0 < a; a--)
                d.push(Math.floor(256 * Math.random()));
            return d
        },
        bytesToWords: function(a) {
            for (var d = [], b = 0, c = 0; b < a.length; b++,
            c += 8)
                d[c >>> 5] |= a[b] << 24 - c % 32;
            return d
        },
        wordsToBytes: function(a) {
            for (var d = [], b = 0; b < 32 * a.length; b += 8)
                d.push(a[b >>> 5] >>> 24 - b % 32 & 255);
            return d
        },
        bytesToHex: function(a) {
            for (var d = [], b = 0; b < a.length; b++)
                d.push((a[b] >>> 4).toString(16)),
                d.push((a[b] & 15).toString(16));
            return d.join("")
        },
        hexToBytes: function(a) {
            for (var d = [], b = 0; b < a.length; b += 2)
                d.push(parseInt(a.substr(b, 2), 16));
            return d
        },
        bytesToBase64: function(a) {
            if ("function" == typeof btoa)
                return btoa(f.bytesToString(a));
            for (var d = [], b = 0; b < a.length; b += 3)
                for (var c = a[b] << 16 | a[b + 1] << 8 | a[b + 2], h = 0; 4 > h; h++)
                    8 * b + 6 * h <= 8 * a.length ? d.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(c >>> 6 * (3 - h) & 63)) : d.push("=");
            return d.join("")
        },
        base64ToBytes: function(a) {
            if ("function" == typeof atob)
                return f.stringToBytes(atob(a));
            a = a.replace(/[^A-Z0-9+\/]/ig, "");
            for (var d = [], b = 0, c = 0; b < a.length; c = ++b % 4)
                0 != c && d.push(("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(a.charAt(b - 1)) & Math.pow(2, -2 * c + 8) - 1) << 2 * c | "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(a.charAt(b)) >>> 6 - 2 * c);
            return d
        }
    };
    a.mode = {};
    a = a.charenc = {};
    a.UTF8 = {
        stringToBytes: function(a) {
            return f.stringToBytes(unescape(encodeURIComponent(a)))
        },
        bytesToString: function(a) {
            return decodeURIComponent(escape(f.bytesToString(a)))
        }
    };
    var f = a.Binary = {
        stringToBytes: function(a) {
            for (var d = [], b = 0; b < a.length; b++)
                d.push(a.charCodeAt(b));
            return d
        },
        bytesToString: function(a) {
            for (var d = [], b = 0; b < a.length; b++)
                d.push(String.fromCharCode(a[b]));
            return d.join("")
        }
    }
}
)();
(function() {
    var a = Crypto
      , g = a.util
      , f = a.charenc
      , e = f.UTF8
      , d = f.Binary
      , b = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]
      , c = a.SHA256 = function(a, b) {
        var e = g.wordsToBytes(c._sha256(a));
        return b && b.asBytes ? e : b && b.asString ? d.bytesToString(e) : g.bytesToHex(e)
    }
    ;
    c._sha256 = function(a) {
        a.constructor == String && (a = e.stringToBytes(a));
        var d = g.bytesToWords(a)
          , c = 8 * a.length;
        a = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225];
        var f = [], q, p, r, s, u, v, x, B, C, w, y;
        d[c >> 5] |= 128 << 24 - c % 32;
        d[(c + 64 >> 9 << 4) + 15] = c;
        for (B = 0; B < d.length; B += 16) {
            c = a[0];
            q = a[1];
            p = a[2];
            r = a[3];
            s = a[4];
            u = a[5];
            v = a[6];
            x = a[7];
            for (C = 0; 64 > C; C++) {
                16 > C ? f[C] = d[C + B] : (w = f[C - 15],
                y = f[C - 2],
                f[C] = ((w << 25 | w >>> 7) ^ (w << 14 | w >>> 18) ^ w >>> 3) + (f[C - 7] >>> 0) + ((y << 15 | y >>> 17) ^ (y << 13 | y >>> 19) ^ y >>> 10) + (f[C - 16] >>> 0));
                y = c & q ^ c & p ^ q & p;
                var A = (c << 30 | c >>> 2) ^ (c << 19 | c >>> 13) ^ (c << 10 | c >>> 22);
                w = (x >>> 0) + ((s << 26 | s >>> 6) ^ (s << 21 | s >>> 11) ^ (s << 7 | s >>> 25)) + (s & u ^ ~s & v) + b[C] + (f[C] >>> 0);
                y = A + y;
                x = v;
                v = u;
                u = s;
                s = r + w;
                r = p;
                p = q;
                q = c;
                c = w + y
            }
            a[0] += c;
            a[1] += q;
            a[2] += p;
            a[3] += r;
            a[4] += s;
            a[5] += u;
            a[6] += v;
            a[7] += x
        }
        return a
    }
    ;
    c._blocksize = 16
}
)();
(function() {
    function a(a, c, d, b) {
        return 0 <= a && 15 >= a ? c ^ d ^ b : 16 <= a && 31 >= a ? c & d | ~c & b : 32 <= a && 47 >= a ? (c | ~d) ^ b : 48 <= a && 63 >= a ? c & b | d & ~b : 64 <= a && 79 >= a ? c ^ (d | ~b) : "rmd160_f: j out of range"
    }
    function g(a, c) {
        var d = (a & 65535) + (c & 65535);
        return (a >> 16) + (c >> 16) + (d >> 16) << 16 | d & 65535
    }
    function f(a, c) {
        return a << c | a >>> 32 - c
    }
    var e = Crypto
      , d = e.util
      , b = e.charenc
      , c = b.UTF8
      , h = b.Binary;
    d.bytesToLWords = function(a) {
        for (var c = Array(a.length >> 2), d = 0; d < c.length; d++)
            c[d] = 0;
        for (d = 0; d < 8 * a.length; d += 8)
            c[d >> 5] |= (a[d / 8] & 255) << d % 32;
        return c
    }
    ;
    d.lWordsToBytes = function(a) {
        for (var c = [], d = 0; d < 32 * a.length; d += 8)
            c.push(a[d >> 5] >>> d % 32 & 255);
        return c
    }
    ;
    var m = e.RIPEMD160 = function(a, c) {
        var b = d.lWordsToBytes(m._rmd160(a));
        return c && c.asBytes ? b : c && c.asString ? h.bytesToString(b) : d.bytesToHex(b)
    }
    ;
    m._rmd160 = function(b) {
        b.constructor == String && (b = c.stringToBytes(b));
        var h = d.bytesToLWords(b);
        b = 8 * b.length;
        h[b >> 5] |= 128 << b % 32;
        h[(b + 64 >>> 9 << 4) + 14] = b;
        b = 1732584193;
        for (var e = 4023233417, m = 2562383102, x = 271733878, B = 3285377520, C = 0; C < h.length; C += 16) {
            for (var w, y = b, A = e, N = m, I = x, J = B, F = b, L = e, E = m, R = x, Y = B, K = 0; 79 >= K; ++K)
                w = g(y, a(K, A, N, I)),
                w = g(w, h[C + l[K]]),
                w = g(w, 0 <= K && 15 >= K ? 0 : 16 <= K && 31 >= K ? 1518500249 : 32 <= K && 47 >= K ? 1859775393 : 48 <= K && 63 >= K ? 2400959708 : 64 <= K && 79 >= K ? 2840853838 : "rmd160_K1: j out of range"),
                w = g(f(w, q[K]), J),
                y = J,
                J = I,
                I = f(N, 10),
                N = A,
                A = w,
                w = g(F, a(79 - K, L, E, R)),
                w = g(w, h[C + n[K]]),
                w = g(w, 0 <= K && 15 >= K ? 1352829926 : 16 <= K && 31 >= K ? 1548603684 : 32 <= K && 47 >= K ? 1836072691 : 48 <= K && 63 >= K ? 2053994217 : 64 <= K && 79 >= K ? 0 : "rmd160_K2: j out of range"),
                w = g(f(w, p[K]), Y),
                F = Y,
                Y = R,
                R = f(E, 10),
                E = L,
                L = w;
            w = g(e, g(N, R));
            e = g(m, g(I, Y));
            m = g(x, g(J, F));
            x = g(B, g(y, L));
            B = g(b, g(A, E));
            b = w
        }
        return [b, e, m, x, B]
    }
    ;
    var l = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13]
      , n = [5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11]
      , q = [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6]
      , p = [8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11]
}
)();
function Arcfour() {
    this.j = this.i = 0;
    this.S = []
}
function ARC4init(a) {
    var g, f, e;
    for (g = 0; 256 > g; ++g)
        this.S[g] = g;
    for (g = f = 0; 256 > g; ++g)
        f = f + this.S[g] + a[g % a.length] & 255,
        e = this.S[g],
        this.S[g] = this.S[f],
        this.S[f] = e;
    this.j = this.i = 0
}
function ARC4next() {
    var a;
    return this.i = this.i + 1 & 255,
    this.j = this.j + this.S[this.i] & 255,
    a = this.S[this.i],
    this.S[this.i] = this.S[this.j],
    this.S[this.j] = a,
    this.S[a + this.S[this.i] & 255]
}
function prng_newstate() {
    return new Arcfour
}
Arcfour.prototype.init = ARC4init;
Arcfour.prototype.next = ARC4next;
var rng_psize = 256;
function rng_seed_int(a) {
    rng_pool[rng_pptr++] ^= a & 255;
    rng_pool[rng_pptr++] ^= a >> 8 & 255;
    rng_pool[rng_pptr++] ^= a >> 16 & 255;
    rng_pool[rng_pptr++] ^= a >> 24 & 255;
    rng_pptr >= rng_psize && (rng_pptr -= rng_psize)
}
function rng_seed_time() {
    rng_seed_int((new Date).getTime())
}
function rng_get_byte() {
    if (null == rng_state) {
        rng_seed_time();
        rng_state = prng_newstate();
        rng_state.init(rng_pool);
        for (rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr)
            rng_pool[rng_pptr] = 0;
        rng_pptr = 0
    }
    return rng_state.next()
}
function rng_get_bytes(a) {
    var g;
    for (g = 0; g < a.length; ++g)
        a[g] = rng_get_byte()
}
function SecureRandom() {}
var rng_state, rng_pool, rng_pptr;
if (null == rng_pool) {
    rng_pool = [];
    rng_pptr = 0;
    var t;
    if ("Netscape" == navigator.appName && "5" > navigator.appVersion && window.crypto) {
        var z = window.crypto.random(32);
        for (t = 0; t < z.length; ++t)
            rng_pool[rng_pptr++] = z.charCodeAt(t) & 255
    }
    for (; rng_pptr < rng_psize; )
        t = Math.floor(65536 * Math.random()),
        rng_pool[rng_pptr++] = t >>> 8,
        rng_pool[rng_pptr++] = t & 255;
    rng_pptr = 0;
    rng_seed_time()
}
SecureRandom.prototype.nextBytes = rng_get_bytes;
function BigInteger(a, g, f) {
    null != a && ("number" == typeof a ? this.fromNumber(a, g, f) : null == g && "string" != typeof a ? this.fromString(a, 256) : this.fromString(a, g))
}
function nbi() {
    return new BigInteger(null)
}
function am1(a, g, f, e, d, b) {
    for (; 0 <= --b; ) {
        var c = g * this[a++] + f[e] + d;
        d = Math.floor(c / 67108864);
        f[e++] = c & 67108863
    }
    return d
}
function am2(a, g, f, e, d, b) {
    var c = g & 32767;
    for (g >>= 15; 0 <= --b; ) {
        var h = this[a] & 32767
          , m = this[a++] >> 15
          , l = g * h + m * c
          , h = c * h + ((l & 32767) << 15) + f[e] + (d & 1073741823);
        d = (h >>> 30) + (l >>> 15) + g * m + (d >>> 30);
        f[e++] = h & 1073741823
    }
    return d
}
function am3(a, g, f, e, d, b) {
    var c = g & 16383;
    for (g >>= 14; 0 <= --b; ) {
        var h = this[a] & 16383
          , m = this[a++] >> 14
          , l = g * h + m * c
          , h = c * h + ((l & 16383) << 14) + f[e] + d;
        d = (h >> 28) + (l >> 14) + g * m;
        f[e++] = h & 268435455
    }
    return d
}
function int2char(a) {
    return BI_RM.charAt(a)
}
function intAt(a, g) {
    var f = BI_RC[a.charCodeAt(g)];
    return null == f ? -1 : f
}
function bnpCopyTo(a) {
    for (var g = this.t - 1; 0 <= g; --g)
        a[g] = this[g];
    a.t = this.t;
    a.s = this.s
}
function bnpFromInt(a) {
    this.t = 1;
    this.s = 0 > a ? -1 : 0;
    0 < a ? this[0] = a : -1 > a ? this[0] = a + DV : this.t = 0
}
function nbv(a) {
    var g = nbi();
    return g.fromInt(a),
    g
}
function bnpFromString(a, g) {
    var f;
    if (16 == g)
        f = 4;
    else if (8 == g)
        f = 3;
    else if (256 == g)
        f = 8;
    else if (2 == g)
        f = 1;
    else if (32 == g)
        f = 5;
    else {
        if (4 != g) {
            this.fromRadix(a, g);
            return
        }
        f = 2
    }
    this.s = this.t = 0;
    for (var e = a.length, d = !1, b = 0; 0 <= --e; ) {
        var c = 8 == f ? a[e] & 255 : intAt(a, e);
        0 > c ? "-" == a.charAt(e) && (d = !0) : (d = !1,
        0 == b ? this[this.t++] = c : b + f > this.DB ? (this[this.t - 1] |= (c & (1 << this.DB - b) - 1) << b,
        this[this.t++] = c >> this.DB - b) : this[this.t - 1] |= c << b,
        b += f,
        b >= this.DB && (b -= this.DB))
    }
    8 == f && 0 != (a[0] & 128) && (this.s = -1,
    0 < b && (this[this.t - 1] |= (1 << this.DB - b) - 1 << b));
    this.clamp();
    d && BigInteger.ZERO.subTo(this, this)
}
function bnpClamp() {
    for (var a = this.s & this.DM; 0 < this.t && this[this.t - 1] == a; )
        --this.t
}
function bnToString(a) {
    if (0 > this.s)
        return "-" + this.negate().toString(a);
    if (16 == a)
        a = 4;
    else if (8 == a)
        a = 3;
    else if (2 == a)
        a = 1;
    else if (32 == a)
        a = 5;
    else {
        if (4 != a)
            return this.toRadix(a);
        a = 2
    }
    var g = (1 << a) - 1, f, e = !1, d = "", b = this.t, c = this.DB - b * this.DB % a;
    if (0 < b--)
        for (c < this.DB && 0 < (f = this[b] >> c) && (e = !0,
        d = int2char(f)); 0 <= b; )
            c < a ? (f = (this[b] & (1 << c) - 1) << a - c,
            f |= this[--b] >> (c += this.DB - a)) : (f = this[b] >> (c -= a) & g,
            0 >= c && (c += this.DB,
            --b)),
            0 < f && (e = !0),
            e && (d += int2char(f));
    return e ? d : "0"
}
function bnNegate() {
    var a = nbi();
    return BigInteger.ZERO.subTo(this, a),
    a
}
function bnAbs() {
    return 0 > this.s ? this.negate() : this
}
function bnCompareTo(a) {
    var g = this.s - a.s;
    if (0 != g)
        return g;
    var f = this.t
      , g = f - a.t;
    if (0 != g)
        return 0 > this.s ? -g : g;
    for (; 0 <= --f; )
        if (0 != (g = this[f] - a[f]))
            return g;
    return 0
}
function nbits(a) {
    var g = 1, f;
    return 0 != (f = a >>> 16) && (a = f,
    g += 16),
    0 != (f = a >> 8) && (a = f,
    g += 8),
    0 != (f = a >> 4) && (a = f,
    g += 4),
    0 != (f = a >> 2) && (a = f,
    g += 2),
    0 != a >> 1 && (g += 1),
    g
}
function bnBitLength() {
    return 0 >= this.t ? 0 : this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ this.s & this.DM)
}
function bnpDLShiftTo(a, g) {
    var f;
    for (f = this.t - 1; 0 <= f; --f)
        g[f + a] = this[f];
    for (f = a - 1; 0 <= f; --f)
        g[f] = 0;
    g.t = this.t + a;
    g.s = this.s
}
function bnpDRShiftTo(a, g) {
    for (var f = a; f < this.t; ++f)
        g[f - a] = this[f];
    g.t = Math.max(this.t - a, 0);
    g.s = this.s
}
function bnpLShiftTo(a, g) {
    var f = a % this.DB, e = this.DB - f, d = (1 << e) - 1, b = Math.floor(a / this.DB), c = this.s << f & this.DM, h;
    for (h = this.t - 1; 0 <= h; --h)
        g[h + b + 1] = this[h] >> e | c,
        c = (this[h] & d) << f;
    for (h = b - 1; 0 <= h; --h)
        g[h] = 0;
    g[b] = c;
    g.t = this.t + b + 1;
    g.s = this.s;
    g.clamp()
}
function bnpRShiftTo(a, g) {
    g.s = this.s;
    var f = Math.floor(a / this.DB);
    if (f >= this.t)
        g.t = 0;
    else {
        var e = a % this.DB
          , d = this.DB - e
          , b = (1 << e) - 1;
        g[0] = this[f] >> e;
        for (var c = f + 1; c < this.t; ++c)
            g[c - f - 1] |= (this[c] & b) << d,
            g[c - f] = this[c] >> e;
        0 < e && (g[this.t - f - 1] |= (this.s & b) << d);
        g.t = this.t - f;
        g.clamp()
    }
}
function bnpSubTo(a, g) {
    for (var f = 0, e = 0, d = Math.min(a.t, this.t); f < d; )
        e += this[f] - a[f],
        g[f++] = e & this.DM,
        e >>= this.DB;
    if (a.t < this.t) {
        for (e -= a.s; f < this.t; )
            e += this[f],
            g[f++] = e & this.DM,
            e >>= this.DB;
        e += this.s
    } else {
        for (e += this.s; f < a.t; )
            e -= a[f],
            g[f++] = e & this.DM,
            e >>= this.DB;
        e -= a.s
    }
    g.s = 0 > e ? -1 : 0;
    -1 > e ? g[f++] = this.DV + e : 0 < e && (g[f++] = e);
    g.t = f;
    g.clamp()
}
function bnpMultiplyTo(a, g) {
    var f = this.abs()
      , e = a.abs()
      , d = f.t;
    for (g.t = d + e.t; 0 <= --d; )
        g[d] = 0;
    for (d = 0; d < e.t; ++d)
        g[d + f.t] = f.am(0, e[d], g, d, 0, f.t);
    g.s = 0;
    g.clamp();
    this.s != a.s && BigInteger.ZERO.subTo(g, g)
}
function bnpSquareTo(a) {
    for (var g = this.abs(), f = a.t = 2 * g.t; 0 <= --f; )
        a[f] = 0;
    for (f = 0; f < g.t - 1; ++f) {
        var e = g.am(f, g[f], a, 2 * f, 0, 1);
        (a[f + g.t] += g.am(f + 1, 2 * g[f], a, 2 * f + 1, e, g.t - f - 1)) >= g.DV && (a[f + g.t] -= g.DV,
        a[f + g.t + 1] = 1)
    }
    0 < a.t && (a[a.t - 1] += g.am(f, g[f], a, 2 * f, 0, 1));
    a.s = 0;
    a.clamp()
}
function bnpDivRemTo(a, g, f) {
    var e = a.abs();
    if (!(0 >= e.t)) {
        var d = this.abs();
        if (d.t < e.t)
            null != g && g.fromInt(0),
            null != f && this.copyTo(f);
        else {
            null == f && (f = nbi());
            var b = nbi()
              , c = this.s;
            a = a.s;
            var h = this.DB - nbits(e[e.t - 1]);
            0 < h ? (e.lShiftTo(h, b),
            d.lShiftTo(h, f)) : (e.copyTo(b),
            d.copyTo(f));
            e = b.t;
            d = b[e - 1];
            if (0 != d) {
                var m = d * (1 << this.F1) + (1 < e ? b[e - 2] >> this.F2 : 0)
                  , l = this.FV / m
                  , m = (1 << this.F1) / m
                  , n = 1 << this.F2
                  , q = f.t
                  , p = q - e
                  , r = null == g ? nbi() : g;
                b.dlShiftTo(p, r);
                0 <= f.compareTo(r) && (f[f.t++] = 1,
                f.subTo(r, f));
                BigInteger.ONE.dlShiftTo(e, r);
                for (r.subTo(b, b); b.t < e; )
                    b[b.t++] = 0;
                for (; 0 <= --p; ) {
                    var s = f[--q] == d ? this.DM : Math.floor(f[q] * l + (f[q - 1] + n) * m);
                    if ((f[q] += b.am(0, s, f, p, 0, e)) < s)
                        for (b.dlShiftTo(p, r),
                        f.subTo(r, f); f[q] < --s; )
                            f.subTo(r, f)
                }
                null != g && (f.drShiftTo(e, g),
                c != a && BigInteger.ZERO.subTo(g, g));
                f.t = e;
                f.clamp();
                0 < h && f.rShiftTo(h, f);
                0 > c && BigInteger.ZERO.subTo(f, f)
            }
        }
    }
}
function bnMod(a) {
    var g = nbi();
    return this.abs().divRemTo(a, null, g),
    0 > this.s && 0 < g.compareTo(BigInteger.ZERO) && a.subTo(g, g),
    g
}
function Classic(a) {
    this.m = a
}
function cConvert(a) {
    return 0 > a.s || 0 <= a.compareTo(this.m) ? a.mod(this.m) : a
}
function cRevert(a) {
    return a
}
function cReduce(a) {
    a.divRemTo(this.m, null, a)
}
function cMulTo(a, g, f) {
    a.multiplyTo(g, f);
    this.reduce(f)
}
function cSqrTo(a, g) {
    a.squareTo(g);
    this.reduce(g)
}
function bnpInvDigit() {
    if (1 > this.t)
        return 0;
    var a = this[0];
    if (0 == (a & 1))
        return 0;
    var g = a & 3;
    return g = g * (2 - (a & 15) * g) & 15,
    g = g * (2 - (a & 255) * g) & 255,
    g = g * (2 - ((a & 65535) * g & 65535)) & 65535,
    g = g * (2 - a * g % this.DV) % this.DV,
    0 < g ? this.DV - g : -g
}
function Montgomery(a) {
    this.m = a;
    this.mp = a.invDigit();
    this.mpl = this.mp & 32767;
    this.mph = this.mp >> 15;
    this.um = (1 << a.DB - 15) - 1;
    this.mt2 = 2 * a.t
}
function montConvert(a) {
    var g = nbi();
    return a.abs().dlShiftTo(this.m.t, g),
    g.divRemTo(this.m, null, g),
    0 > a.s && 0 < g.compareTo(BigInteger.ZERO) && this.m.subTo(g, g),
    g
}
function montRevert(a) {
    var g = nbi();
    return a.copyTo(g),
    this.reduce(g),
    g
}
function montReduce(a) {
    for (; a.t <= this.mt2; )
        a[a.t++] = 0;
    for (var g = 0; g < this.m.t; ++g) {
        var f = a[g] & 32767
          , e = f * this.mpl + ((f * this.mph + (a[g] >> 15) * this.mpl & this.um) << 15) & a.DM
          , f = g + this.m.t;
        for (a[f] += this.m.am(0, e, a, g, 0, this.m.t); a[f] >= a.DV; )
            a[f] -= a.DV,
            a[++f]++
    }
    a.clamp();
    a.drShiftTo(this.m.t, a);
    0 <= a.compareTo(this.m) && a.subTo(this.m, a)
}
function montSqrTo(a, g) {
    a.squareTo(g);
    this.reduce(g)
}
function montMulTo(a, g, f) {
    a.multiplyTo(g, f);
    this.reduce(f)
}
function bnpIsEven() {
    return 0 == (0 < this.t ? this[0] & 1 : this.s)
}
function bnpExp(a, g) {
    if (4294967295 < a || 1 > a)
        return BigInteger.ONE;
    var f = nbi()
      , e = nbi()
      , d = g.convert(this)
      , b = nbits(a) - 1;
    for (d.copyTo(f); 0 <= --b; )
        if (g.sqrTo(f, e),
        0 < (a & 1 << b))
            g.mulTo(e, d, f);
        else
            var c = f
              , f = e
              , e = c;
    return g.revert(f)
}
function bnModPowInt(a, g) {
    var f;
    return 256 > a || g.isEven() ? f = new Classic(g) : f = new Montgomery(g),
    this.exp(a, f)
}
var dbits, canary = 0xdeadbeefcafe, j_lm = 15715070 == (canary & 16777215);
j_lm && "Microsoft Internet Explorer" == navigator.appName ? (BigInteger.prototype.am = am2,
dbits = 30) : j_lm && "Netscape" != navigator.appName ? (BigInteger.prototype.am = am1,
dbits = 26) : (BigInteger.prototype.am = am3,
dbits = 28);
BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = (1 << dbits) - 1;
BigInteger.prototype.DV = 1 << dbits;
var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2, BI_FP);
BigInteger.prototype.F1 = BI_FP - dbits;
BigInteger.prototype.F2 = 2 * dbits - BI_FP;
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz", BI_RC = [], rr, vv;
rr = 48;
for (vv = 0; 9 >= vv; ++vv)
    BI_RC[rr++] = vv;
rr = 97;
for (vv = 10; 36 > vv; ++vv)
    BI_RC[rr++] = vv;
rr = 65;
for (vv = 10; 36 > vv; ++vv)
    BI_RC[rr++] = vv;
Classic.prototype.convert = cConvert;
Classic.prototype.revert = cRevert;
Classic.prototype.reduce = cReduce;
Classic.prototype.mulTo = cMulTo;
Classic.prototype.sqrTo = cSqrTo;
Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;
BigInteger.prototype.copyTo = bnpCopyTo;
BigInteger.prototype.fromInt = bnpFromInt;
BigInteger.prototype.fromString = bnpFromString;
BigInteger.prototype.clamp = bnpClamp;
BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
BigInteger.prototype.drShiftTo = bnpDRShiftTo;
BigInteger.prototype.lShiftTo = bnpLShiftTo;
BigInteger.prototype.rShiftTo = bnpRShiftTo;
BigInteger.prototype.subTo = bnpSubTo;
BigInteger.prototype.multiplyTo = bnpMultiplyTo;
BigInteger.prototype.squareTo = bnpSquareTo;
BigInteger.prototype.divRemTo = bnpDivRemTo;
BigInteger.prototype.invDigit = bnpInvDigit;
BigInteger.prototype.isEven = bnpIsEven;
BigInteger.prototype.exp = bnpExp;
BigInteger.prototype.toString = bnToString;
BigInteger.prototype.negate = bnNegate;
BigInteger.prototype.abs = bnAbs;
BigInteger.prototype.compareTo = bnCompareTo;
BigInteger.prototype.bitLength = bnBitLength;
BigInteger.prototype.mod = bnMod;
BigInteger.prototype.modPowInt = bnModPowInt;
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);
function bnClone() {
    var a = nbi();
    return this.copyTo(a),
    a
}
function bnIntValue() {
    if (0 > this.s) {
        if (1 == this.t)
            return this[0] - this.DV;
        if (0 == this.t)
            return -1
    } else {
        if (1 == this.t)
            return this[0];
        if (0 == this.t)
            return 0
    }
    return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0]
}
function bnByteValue() {
    return 0 == this.t ? this.s : this[0] << 24 >> 24
}
function bnShortValue() {
    return 0 == this.t ? this.s : this[0] << 16 >> 16
}
function bnpChunkSize(a) {
    return Math.floor(Math.LN2 * this.DB / Math.log(a))
}
function bnSigNum() {
    return 0 > this.s ? -1 : 0 >= this.t || 1 == this.t && 0 >= this[0] ? 0 : 1
}
function bnpToRadix(a) {
    null == a && (a = 10);
    if (0 == this.signum() || 2 > a || 36 < a)
        return "0";
    var g = this.chunkSize(a)
      , g = Math.pow(a, g)
      , f = nbv(g)
      , e = nbi()
      , d = nbi()
      , b = "";
    for (this.divRemTo(f, e, d); 0 < e.signum(); )
        b = (g + d.intValue()).toString(a).substr(1) + b,
        e.divRemTo(f, e, d);
    return d.intValue().toString(a) + b
}
function bnpFromRadix(a, g) {
    this.fromInt(0);
    null == g && (g = 10);
    for (var f = this.chunkSize(g), e = Math.pow(g, f), d = !1, b = 0, c = 0, h = 0; h < a.length; ++h) {
        var m = intAt(a, h);
        0 > m ? "-" == a.charAt(h) && 0 == this.signum() && (d = !0) : (c = g * c + m,
        ++b >= f && (this.dMultiply(e),
        this.dAddOffset(c, 0),
        b = 0,
        c = 0))
    }
    0 < b && (this.dMultiply(Math.pow(g, b)),
    this.dAddOffset(c, 0));
    d && BigInteger.ZERO.subTo(this, this)
}
function bnpFromNumber(a, g, f) {
    if ("number" == typeof g)
        if (2 > a)
            this.fromInt(1);
        else
            for (this.fromNumber(a, f),
            this.testBit(a - 1) || this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this),
            this.isEven() && this.dAddOffset(1, 0); !this.isProbablePrime(g); )
                this.dAddOffset(2, 0),
                this.bitLength() > a && this.subTo(BigInteger.ONE.shiftLeft(a - 1), this);
    else {
        f = [];
        var e = a & 7;
        f.length = (a >> 3) + 1;
        g.nextBytes(f);
        0 < e ? f[0] &= (1 << e) - 1 : f[0] = 0;
        this.fromString(f, 256)
    }
}
function bnToByteArray() {
    var a = this.t
      , g = [];
    g[0] = this.s;
    var f = this.DB - a * this.DB % 8, e, d = 0;
    if (0 < a--)
        for (f < this.DB && (e = this[a] >> f) != (this.s & this.DM) >> f && (g[d++] = e | this.s << this.DB - f); 0 <= a; )
            if (8 > f ? (e = (this[a] & (1 << f) - 1) << 8 - f,
            e |= this[--a] >> (f += this.DB - 8)) : (e = this[a] >> (f -= 8) & 255,
            0 >= f && (f += this.DB,
            --a)),
            0 != (e & 128) && (e |= -256),
            0 == d && (this.s & 128) != (e & 128) && ++d,
            0 < d || e != this.s)
                g[d++] = e;
    return g
}
function bnEquals(a) {
    return 0 == this.compareTo(a)
}
function bnMin(a) {
    return 0 > this.compareTo(a) ? this : a
}
function bnMax(a) {
    return 0 < this.compareTo(a) ? this : a
}
function bnpBitwiseTo(a, g, f) {
    var e, d, b = Math.min(a.t, this.t);
    for (e = 0; e < b; ++e)
        f[e] = g(this[e], a[e]);
    if (a.t < this.t) {
        d = a.s & this.DM;
        for (e = b; e < this.t; ++e)
            f[e] = g(this[e], d);
        f.t = this.t
    } else {
        d = this.s & this.DM;
        for (e = b; e < a.t; ++e)
            f[e] = g(d, a[e]);
        f.t = a.t
    }
    f.s = g(this.s, a.s);
    f.clamp()
}
function op_and(a, g) {
    return a & g
}
function bnAnd(a) {
    var g = nbi();
    return this.bitwiseTo(a, op_and, g),
    g
}
function op_or(a, g) {
    return a | g
}
function bnOr(a) {
    var g = nbi();
    return this.bitwiseTo(a, op_or, g),
    g
}
function op_xor(a, g) {
    return a ^ g
}
function bnXor(a) {
    var g = nbi();
    return this.bitwiseTo(a, op_xor, g),
    g
}
function op_andnot(a, g) {
    return a & ~g
}
function bnAndNot(a) {
    var g = nbi();
    return this.bitwiseTo(a, op_andnot, g),
    g
}
function bnNot() {
    for (var a = nbi(), g = 0; g < this.t; ++g)
        a[g] = this.DM & ~this[g];
    return a.t = this.t,
    a.s = ~this.s,
    a
}
function bnShiftLeft(a) {
    var g = nbi();
    return 0 > a ? this.rShiftTo(-a, g) : this.lShiftTo(a, g),
    g
}
function bnShiftRight(a) {
    var g = nbi();
    return 0 > a ? this.lShiftTo(-a, g) : this.rShiftTo(a, g),
    g
}
function lbit(a) {
    if (0 == a)
        return -1;
    var g = 0;
    return 0 == (a & 65535) && (a >>= 16,
    g += 16),
    0 == (a & 255) && (a >>= 8,
    g += 8),
    0 == (a & 15) && (a >>= 4,
    g += 4),
    0 == (a & 3) && (a >>= 2,
    g += 2),
    0 == (a & 1) && ++g,
    g
}
function bnGetLowestSetBit() {
    for (var a = 0; a < this.t; ++a)
        if (0 != this[a])
            return a * this.DB + lbit(this[a]);
    return 0 > this.s ? this.t * this.DB : -1
}
function cbit(a) {
    for (var g = 0; 0 != a; )
        a &= a - 1,
        ++g;
    return g
}
function bnBitCount() {
    for (var a = 0, g = this.s & this.DM, f = 0; f < this.t; ++f)
        a += cbit(this[f] ^ g);
    return a
}
function bnTestBit(a) {
    var g = Math.floor(a / this.DB);
    return g >= this.t ? 0 != this.s : 0 != (this[g] & 1 << a % this.DB)
}
function bnpChangeBit(a, g) {
    var f = BigInteger.ONE.shiftLeft(a);
    return this.bitwiseTo(f, g, f),
    f
}
function bnSetBit(a) {
    return this.changeBit(a, op_or)
}
function bnClearBit(a) {
    return this.changeBit(a, op_andnot)
}
function bnFlipBit(a) {
    return this.changeBit(a, op_xor)
}
function bnpAddTo(a, g) {
    for (var f = 0, e = 0, d = Math.min(a.t, this.t); f < d; )
        e += this[f] + a[f],
        g[f++] = e & this.DM,
        e >>= this.DB;
    if (a.t < this.t) {
        for (e += a.s; f < this.t; )
            e += this[f],
            g[f++] = e & this.DM,
            e >>= this.DB;
        e += this.s
    } else {
        for (e += this.s; f < a.t; )
            e += a[f],
            g[f++] = e & this.DM,
            e >>= this.DB;
        e += a.s
    }
    g.s = 0 > e ? -1 : 0;
    0 < e ? g[f++] = e : -1 > e && (g[f++] = this.DV + e);
    g.t = f;
    g.clamp()
}
function bnAdd(a) {
    var g = nbi();
    return this.addTo(a, g),
    g
}
function bnSubtract(a) {
    var g = nbi();
    return this.subTo(a, g),
    g
}
function bnMultiply(a) {
    var g = nbi();
    return this.multiplyTo(a, g),
    g
}
function bnSquare() {
    var a = nbi();
    return this.squareTo(a),
    a
}
function bnDivide(a) {
    var g = nbi();
    return this.divRemTo(a, g, null),
    g
}
function bnRemainder(a) {
    var g = nbi();
    return this.divRemTo(a, null, g),
    g
}
function bnDivideAndRemainder(a) {
    var g = nbi()
      , f = nbi();
    return this.divRemTo(a, g, f),
    [g, f]
}
function bnpDMultiply(a) {
    this[this.t] = this.am(0, a - 1, this, 0, 0, this.t);
    ++this.t;
    this.clamp()
}
function bnpDAddOffset(a, g) {
    if (0 != a) {
        for (; this.t <= g; )
            this[this.t++] = 0;
        for (this[g] += a; this[g] >= this.DV; )
            this[g] -= this.DV,
            ++g >= this.t && (this[this.t++] = 0),
            ++this[g]
    }
}
function NullExp() {}
function nNop(a) {
    return a
}
function nMulTo(a, g, f) {
    a.multiplyTo(g, f)
}
function nSqrTo(a, g) {
    a.squareTo(g)
}
function bnPow(a) {
    return this.exp(a, new NullExp)
}
function bnpMultiplyLowerTo(a, g, f) {
    var e = Math.min(this.t + a.t, g);
    f.s = 0;
    for (f.t = e; 0 < e; )
        f[--e] = 0;
    var d;
    for (d = f.t - this.t; e < d; ++e)
        f[e + this.t] = this.am(0, a[e], f, e, 0, this.t);
    for (d = Math.min(a.t, g); e < d; ++e)
        this.am(0, a[e], f, e, 0, g - e);
    f.clamp()
}
function bnpMultiplyUpperTo(a, g, f) {
    --g;
    var e = f.t = this.t + a.t - g;
    for (f.s = 0; 0 <= --e; )
        f[e] = 0;
    for (e = Math.max(g - this.t, 0); e < a.t; ++e)
        f[this.t + e - g] = this.am(g - e, a[e], f, 0, 0, this.t + e - g);
    f.clamp();
    f.drShiftTo(1, f)
}
function Barrett(a) {
    this.r2 = nbi();
    this.q3 = nbi();
    BigInteger.ONE.dlShiftTo(2 * a.t, this.r2);
    this.mu = this.r2.divide(a);
    this.m = a
}
function barrettConvert(a) {
    if (0 > a.s || a.t > 2 * this.m.t)
        return a.mod(this.m);
    if (0 > a.compareTo(this.m))
        return a;
    var g = nbi();
    return a.copyTo(g),
    this.reduce(g),
    g
}
function barrettRevert(a) {
    return a
}
function barrettReduce(a) {
    a.drShiftTo(this.m.t - 1, this.r2);
    a.t > this.m.t + 1 && (a.t = this.m.t + 1,
    a.clamp());
    this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
    for (this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2); 0 > a.compareTo(this.r2); )
        a.dAddOffset(1, this.m.t + 1);
    for (a.subTo(this.r2, a); 0 <= a.compareTo(this.m); )
        a.subTo(this.m, a)
}
function barrettSqrTo(a, g) {
    a.squareTo(g);
    this.reduce(g)
}
function barrettMulTo(a, g, f) {
    a.multiplyTo(g, f);
    this.reduce(f)
}
function bnModPow(a, g) {
    var f = a.bitLength(), e, d = nbv(1), b;
    if (0 >= f)
        return d;
    18 > f ? e = 1 : 48 > f ? e = 3 : 144 > f ? e = 4 : 768 > f ? e = 5 : e = 6;
    8 > f ? b = new Classic(g) : g.isEven() ? b = new Barrett(g) : b = new Montgomery(g);
    var c = []
      , h = 3
      , m = e - 1
      , l = (1 << e) - 1;
    c[1] = b.convert(this);
    if (1 < e)
        for (f = nbi(),
        b.sqrTo(c[1], f); h <= l; )
            c[h] = nbi(),
            b.mulTo(f, c[h - 2], c[h]),
            h += 2;
    for (var n = a.t - 1, q, p = !0, r = nbi(), s, f = nbits(a[n]) - 1; 0 <= n; ) {
        f >= m ? q = a[n] >> f - m & l : (q = (a[n] & (1 << f + 1) - 1) << m - f,
        0 < n && (q |= a[n - 1] >> this.DB + f - m));
        for (h = e; 0 == (q & 1); )
            q >>= 1,
            --h;
        0 > (f -= h) && (f += this.DB,
        --n);
        if (p)
            c[q].copyTo(d),
            p = !1;
        else {
            for (; 1 < h; )
                b.sqrTo(d, r),
                b.sqrTo(r, d),
                h -= 2;
            0 < h ? b.sqrTo(d, r) : (s = d,
            d = r,
            r = s);
            b.mulTo(r, c[q], d)
        }
        for (; 0 <= n && 0 == (a[n] & 1 << f); )
            b.sqrTo(d, r),
            s = d,
            d = r,
            r = s,
            0 > --f && (f = this.DB - 1,
            --n)
    }
    return b.revert(d)
}
function bnGCD(a) {
    var g = 0 > this.s ? this.negate() : this.clone();
    a = 0 > a.s ? a.negate() : a.clone();
    if (0 > g.compareTo(a)) {
        var f = g
          , g = a;
        a = f
    }
    var f = g.getLowestSetBit()
      , e = a.getLowestSetBit();
    if (0 > e)
        return g;
    f < e && (e = f);
    for (0 < e && (g.rShiftTo(e, g),
    a.rShiftTo(e, a)); 0 < g.signum(); )
        0 < (f = g.getLowestSetBit()) && g.rShiftTo(f, g),
        0 < (f = a.getLowestSetBit()) && a.rShiftTo(f, a),
        0 <= g.compareTo(a) ? (g.subTo(a, g),
        g.rShiftTo(1, g)) : (a.subTo(g, a),
        a.rShiftTo(1, a));
    return 0 < e && a.lShiftTo(e, a),
    a
}
function bnpModInt(a) {
    if (0 >= a)
        return 0;
    var g = this.DV % a
      , f = 0 > this.s ? a - 1 : 0;
    if (0 < this.t)
        if (0 == g)
            f = this[0] % a;
        else
            for (var e = this.t - 1; 0 <= e; --e)
                f = (g * f + this[e]) % a;
    return f
}
function bnModInverse(a) {
    var g = a.isEven();
    if (this.isEven() && g || 0 == a.signum())
        return BigInteger.ZERO;
    for (var f = a.clone(), e = this.clone(), d = nbv(1), b = nbv(0), c = nbv(0), h = nbv(1); 0 != f.signum(); ) {
        for (; f.isEven(); )
            f.rShiftTo(1, f),
            g ? (d.isEven() && b.isEven() || (d.addTo(this, d),
            b.subTo(a, b)),
            d.rShiftTo(1, d)) : b.isEven() || b.subTo(a, b),
            b.rShiftTo(1, b);
        for (; e.isEven(); )
            e.rShiftTo(1, e),
            g ? (c.isEven() && h.isEven() || (c.addTo(this, c),
            h.subTo(a, h)),
            c.rShiftTo(1, c)) : h.isEven() || h.subTo(a, h),
            h.rShiftTo(1, h);
        0 <= f.compareTo(e) ? (f.subTo(e, f),
        g && d.subTo(c, d),
        b.subTo(h, b)) : (e.subTo(f, e),
        g && c.subTo(d, c),
        h.subTo(b, h))
    }
    return 0 != e.compareTo(BigInteger.ONE) ? BigInteger.ZERO : 0 <= h.compareTo(a) ? h.subtract(a) : 0 > h.signum() ? (h.addTo(a, h),
    0 > h.signum() ? h.add(a) : h) : h
}
function bnIsProbablePrime(a) {
    var g, f = this.abs();
    if (1 == f.t && f[0] <= lowprimes[lowprimes.length - 1]) {
        for (g = 0; g < lowprimes.length; ++g)
            if (f[0] == lowprimes[g])
                return !0;
        return !1
    }
    if (f.isEven())
        return !1;
    for (g = 1; g < lowprimes.length; ) {
        for (var e = lowprimes[g], d = g + 1; d < lowprimes.length && e < lplim; )
            e *= lowprimes[d++];
        for (e = f.modInt(e); g < d; )
            if (0 == e % lowprimes[g++])
                return !1
    }
    return f.millerRabin(a)
}
function bnpMillerRabin(a) {
    var g = this.subtract(BigInteger.ONE)
      , f = g.getLowestSetBit();
    if (0 >= f)
        return !1;
    var e = g.shiftRight(f);
    a = a + 1 >> 1;
    a > lowprimes.length && (a = lowprimes.length);
    for (var d = nbi(), b = 0; b < a; ++b) {
        d.fromInt(lowprimes[Math.floor(Math.random() * lowprimes.length)]);
        var c = d.modPow(e, this);
        if (0 != c.compareTo(BigInteger.ONE) && 0 != c.compareTo(g)) {
            for (var h = 1; h++ < f && 0 != c.compareTo(g); )
                if (c = c.modPowInt(2, this),
                0 == c.compareTo(BigInteger.ONE))
                    return !1;
            if (0 != c.compareTo(g))
                return !1
        }
    }
    return !0
}
NullExp.prototype.convert = nNop;
NullExp.prototype.revert = nNop;
NullExp.prototype.mulTo = nMulTo;
NullExp.prototype.sqrTo = nSqrTo;
Barrett.prototype.convert = barrettConvert;
Barrett.prototype.revert = barrettRevert;
Barrett.prototype.reduce = barrettReduce;
Barrett.prototype.mulTo = barrettMulTo;
Barrett.prototype.sqrTo = barrettSqrTo;
var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997]
  , lplim = 67108864 / lowprimes[lowprimes.length - 1];
BigInteger.prototype.chunkSize = bnpChunkSize;
BigInteger.prototype.toRadix = bnpToRadix;
BigInteger.prototype.fromRadix = bnpFromRadix;
BigInteger.prototype.fromNumber = bnpFromNumber;
BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
BigInteger.prototype.changeBit = bnpChangeBit;
BigInteger.prototype.addTo = bnpAddTo;
BigInteger.prototype.dMultiply = bnpDMultiply;
BigInteger.prototype.dAddOffset = bnpDAddOffset;
BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
BigInteger.prototype.modInt = bnpModInt;
BigInteger.prototype.millerRabin = bnpMillerRabin;
BigInteger.prototype.clone = bnClone;
BigInteger.prototype.intValue = bnIntValue;
BigInteger.prototype.byteValue = bnByteValue;
BigInteger.prototype.shortValue = bnShortValue;
BigInteger.prototype.signum = bnSigNum;
BigInteger.prototype.toByteArray = bnToByteArray;
BigInteger.prototype.equals = bnEquals;
BigInteger.prototype.min = bnMin;
BigInteger.prototype.max = bnMax;
BigInteger.prototype.and = bnAnd;
BigInteger.prototype.or = bnOr;
BigInteger.prototype.xor = bnXor;
BigInteger.prototype.andNot = bnAndNot;
BigInteger.prototype.not = bnNot;
BigInteger.prototype.shiftLeft = bnShiftLeft;
BigInteger.prototype.shiftRight = bnShiftRight;
BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
BigInteger.prototype.bitCount = bnBitCount;
BigInteger.prototype.testBit = bnTestBit;
BigInteger.prototype.setBit = bnSetBit;
BigInteger.prototype.clearBit = bnClearBit;
BigInteger.prototype.flipBit = bnFlipBit;
BigInteger.prototype.add = bnAdd;
BigInteger.prototype.subtract = bnSubtract;
BigInteger.prototype.multiply = bnMultiply;
BigInteger.prototype.divide = bnDivide;
BigInteger.prototype.remainder = bnRemainder;
BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
BigInteger.prototype.modPow = bnModPow;
BigInteger.prototype.modInverse = bnModInverse;
BigInteger.prototype.pow = bnPow;
BigInteger.prototype.gcd = bnGCD;
BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
BigInteger.prototype.square = bnSquare;
function ECFieldElementFp(a, g) {
    this.x = g;
    this.q = a
}
function feFpEquals(a) {
    return a == this ? !0 : this.q.equals(a.q) && this.x.equals(a.x)
}
function feFpToBigInteger() {
    return this.x
}
function feFpNegate() {
    return new ECFieldElementFp(this.q,this.x.negate().mod(this.q))
}
function feFpAdd(a) {
    return new ECFieldElementFp(this.q,this.x.add(a.toBigInteger()).mod(this.q))
}
function feFpSubtract(a) {
    return new ECFieldElementFp(this.q,this.x.subtract(a.toBigInteger()).mod(this.q))
}
function feFpMultiply(a) {
    return new ECFieldElementFp(this.q,this.x.multiply(a.toBigInteger()).mod(this.q))
}
function feFpSquare() {
    return new ECFieldElementFp(this.q,this.x.square().mod(this.q))
}
function feFpDivide(a) {
    return new ECFieldElementFp(this.q,this.x.multiply(a.toBigInteger().modInverse(this.q)).mod(this.q))
}
function ECPointFp(a, g, f, e) {
    this.curve = a;
    this.x = g;
    this.y = f;
    null == e ? this.z = BigInteger.ONE : this.z = e;
    this.zinv = null
}
function pointFpGetX() {
    return null == this.zinv && (this.zinv = this.z.modInverse(this.curve.q)),
    this.curve.fromBigInteger(this.x.toBigInteger().multiply(this.zinv).mod(this.curve.q))
}
function pointFpGetY() {
    return null == this.zinv && (this.zinv = this.z.modInverse(this.curve.q)),
    this.curve.fromBigInteger(this.y.toBigInteger().multiply(this.zinv).mod(this.curve.q))
}
function pointFpEquals(a) {
    if (a == this)
        return !0;
    if (this.isInfinity())
        return a.isInfinity();
    if (a.isInfinity())
        return this.isInfinity();
    var g, f;
    return g = a.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(a.z)).mod(this.curve.q),
    g.equals(BigInteger.ZERO) ? (f = a.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(a.z)).mod(this.curve.q),
    f.equals(BigInteger.ZERO)) : !1
}
function pointFpIsInfinity() {
    return null == this.x && null == this.y ? !0 : this.z.equals(BigInteger.ZERO) && !this.y.toBigInteger().equals(BigInteger.ZERO)
}
function pointFpNegate() {
    return new ECPointFp(this.curve,this.x,this.y.negate(),this.z)
}
function pointFpAdd(a) {
    if (this.isInfinity())
        return a;
    if (a.isInfinity())
        return this;
    var g = a.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(a.z)).mod(this.curve.q)
      , f = a.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(a.z)).mod(this.curve.q);
    if (BigInteger.ZERO.equals(f))
        return BigInteger.ZERO.equals(g) ? this.twice() : this.curve.getInfinity();
    var e = new BigInteger("3")
      , d = this.x.toBigInteger()
      , b = this.y.toBigInteger();
    a.x.toBigInteger();
    a.y.toBigInteger();
    var c = f.square()
      , h = c.multiply(f)
      , d = d.multiply(c)
      , c = g.square().multiply(this.z)
      , f = c.subtract(d.shiftLeft(1)).multiply(a.z).subtract(h).multiply(f).mod(this.curve.q)
      , g = d.multiply(e).multiply(g).subtract(b.multiply(h)).subtract(c.multiply(g)).multiply(a.z).add(g.multiply(h)).mod(this.curve.q);
    a = h.multiply(this.z).multiply(a.z).mod(this.curve.q);
    return new ECPointFp(this.curve,this.curve.fromBigInteger(f),this.curve.fromBigInteger(g),a)
}
function pointFpTwice() {
    if (this.isInfinity())
        return this;
    if (0 == this.y.toBigInteger().signum())
        return this.curve.getInfinity();
    var a = new BigInteger("3")
      , g = this.x.toBigInteger()
      , f = this.y.toBigInteger()
      , e = f.multiply(this.z)
      , d = e.multiply(f).mod(this.curve.q)
      , f = this.curve.a.toBigInteger()
      , b = g.square().multiply(a);
    BigInteger.ZERO.equals(f) || (b = b.add(this.z.square().multiply(f)));
    b = b.mod(this.curve.q);
    f = b.square().subtract(g.shiftLeft(3).multiply(d)).shiftLeft(1).multiply(e).mod(this.curve.q);
    a = b.multiply(a).multiply(g).subtract(d.shiftLeft(1)).shiftLeft(2).multiply(d).subtract(b.square().multiply(b)).mod(this.curve.q);
    e = e.square().multiply(e).shiftLeft(3).mod(this.curve.q);
    return new ECPointFp(this.curve,this.curve.fromBigInteger(f),this.curve.fromBigInteger(a),e)
}
function pointFpMultiply(a) {
    if (this.isInfinity())
        return this;
    if (0 == a.signum())
        return this.curve.getInfinity();
    var g = a.multiply(new BigInteger("3")), f = this.negate(), e = this, d;
    for (d = g.bitLength() - 2; 0 < d; --d) {
        var e = e.twice()
          , b = g.testBit(d)
          , c = a.testBit(d);
        b != c && (e = e.add(b ? this : f))
    }
    return e
}
function pointFpMultiplyTwo(a, g, f) {
    var e;
    a.bitLength() > f.bitLength() ? e = a.bitLength() - 1 : e = f.bitLength() - 1;
    for (var d = this.curve.getInfinity(), b = this.add(g); 0 <= e; )
        d = d.twice(),
        a.testBit(e) ? f.testBit(e) ? d = d.add(b) : d = d.add(this) : f.testBit(e) && (d = d.add(g)),
        --e;
    return d
}
function ECCurveFp(a, g, f) {
    this.q = a;
    this.a = this.fromBigInteger(g);
    this.b = this.fromBigInteger(f);
    this.infinity = new ECPointFp(this,null,null)
}
function curveFpGetQ() {
    return this.q
}
function curveFpGetA() {
    return this.a
}
function curveFpGetB() {
    return this.b
}
function curveFpEquals(a) {
    return a == this ? !0 : this.q.equals(a.q) && this.a.equals(a.a) && this.b.equals(a.b)
}
function curveFpGetInfinity() {
    return this.infinity
}
function curveFpFromBigInteger(a) {
    return new ECFieldElementFp(this.q,a)
}
function curveFpDecodePointHex(a) {
    switch (parseInt(a.substr(0, 2), 16)) {
    case 0:
        return this.infinity;
    case 2:
    case 3:
        return null;
    case 4:
    case 6:
    case 7:
        var g = (a.length - 2) / 2
          , f = a.substr(2, g);
        a = a.substr(g + 2, g);
        return new ECPointFp(this,this.fromBigInteger(new BigInteger(f,16)),this.fromBigInteger(new BigInteger(a,16)));
    default:
        return null
    }
}
ECFieldElementFp.prototype.equals = feFpEquals;
ECFieldElementFp.prototype.toBigInteger = feFpToBigInteger;
ECFieldElementFp.prototype.negate = feFpNegate;
ECFieldElementFp.prototype.add = feFpAdd;
ECFieldElementFp.prototype.subtract = feFpSubtract;
ECFieldElementFp.prototype.multiply = feFpMultiply;
ECFieldElementFp.prototype.square = feFpSquare;
ECFieldElementFp.prototype.divide = feFpDivide;
ECPointFp.prototype.getX = pointFpGetX;
ECPointFp.prototype.getY = pointFpGetY;
ECPointFp.prototype.equals = pointFpEquals;
ECPointFp.prototype.isInfinity = pointFpIsInfinity;
ECPointFp.prototype.negate = pointFpNegate;
ECPointFp.prototype.add = pointFpAdd;
ECPointFp.prototype.twice = pointFpTwice;
ECPointFp.prototype.multiply = pointFpMultiply;
ECPointFp.prototype.multiplyTwo = pointFpMultiplyTwo;
ECCurveFp.prototype.getQ = curveFpGetQ;
ECCurveFp.prototype.getA = curveFpGetA;
ECCurveFp.prototype.getB = curveFpGetB;
ECCurveFp.prototype.equals = curveFpEquals;
ECCurveFp.prototype.getInfinity = curveFpGetInfinity;
ECCurveFp.prototype.fromBigInteger = curveFpFromBigInteger;
ECCurveFp.prototype.decodePointHex = curveFpDecodePointHex;
function X9ECParameters(a, g, f, e) {
    this.curve = a;
    this.g = g;
    this.n = f;
    this.h = e
}
function x9getCurve() {
    return this.curve
}
function x9getG() {
    return this.g
}
function x9getN() {
    return this.n
}
function x9getH() {
    return this.h
}
function fromHex(a) {
    return new BigInteger(a,16)
}
function secp128r1() {
    var a = fromHex("FFFFFFFDFFFFFFFFFFFFFFFFFFFFFFFF")
      , g = fromHex("FFFFFFFDFFFFFFFFFFFFFFFFFFFFFFFC")
      , f = fromHex("E87579C11079F43DD824993C2CEE5ED3")
      , e = fromHex("FFFFFFFE0000000075A30D1B9038A115")
      , d = BigInteger.ONE
      , a = new ECCurveFp(a,g,f)
      , g = a.decodePointHex("04161FF7528B899B2D0C28607CA52C5B86CF5AC8395BAFEB13C02DA292DDED7A83");
    return new X9ECParameters(a,g,e,d)
}
function secp160k1() {
    var a = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFAC73")
      , g = BigInteger.ZERO
      , f = fromHex("7")
      , e = fromHex("0100000000000000000001B8FA16DFAB9ACA16B6B3")
      , d = BigInteger.ONE
      , a = new ECCurveFp(a,g,f)
      , g = a.decodePointHex("043B4C382CE37AA192A4019E763036F4F5DD4D7EBB938CF935318FDCED6BC28286531733C3F03C4FEE");
    return new X9ECParameters(a,g,e,d)
}
function secp160r1() {
    var a = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFF")
      , g = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFC")
      , f = fromHex("1C97BEFC54BD7A8B65ACF89F81D4D4ADC565FA45")
      , e = fromHex("0100000000000000000001F4C8F927AED3CA752257")
      , d = BigInteger.ONE
      , a = new ECCurveFp(a,g,f)
      , g = a.decodePointHex("044A96B5688EF573284664698968C38BB913CBFC8223A628553168947D59DCC912042351377AC5FB32");
    return new X9ECParameters(a,g,e,d)
}
function secp192k1() {
    var a = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFEE37")
      , g = BigInteger.ZERO
      , f = fromHex("3")
      , e = fromHex("FFFFFFFFFFFFFFFFFFFFFFFE26F2FC170F69466A74DEFD8D")
      , d = BigInteger.ONE
      , a = new ECCurveFp(a,g,f)
      , g = a.decodePointHex("04DB4FF10EC057E9AE26B07D0280B7F4341DA5D1B1EAE06C7D9B2F2F6D9C5628A7844163D015BE86344082AA88D95E2F9D");
    return new X9ECParameters(a,g,e,d)
}
function secp192r1() {
    var a = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFF")
      , g = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFC")
      , f = fromHex("64210519E59C80E70FA7E9AB72243049FEB8DEECC146B9B1")
      , e = fromHex("FFFFFFFFFFFFFFFFFFFFFFFF99DEF836146BC9B1B4D22831")
      , d = BigInteger.ONE
      , a = new ECCurveFp(a,g,f)
      , g = a.decodePointHex("04188DA80EB03090F67CBF20EB43A18800F4FF0AFD82FF101207192B95FFC8DA78631011ED6B24CDD573F977A11E794811");
    return new X9ECParameters(a,g,e,d)
}
function secp224r1() {
    var a = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF000000000000000000000001")
      , g = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFE")
      , f = fromHex("B4050A850C04B3ABF54132565044B0B7D7BFD8BA270B39432355FFB4")
      , e = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFF16A2E0B8F03E13DD29455C5C2A3D")
      , d = BigInteger.ONE
      , a = new ECCurveFp(a,g,f)
      , g = a.decodePointHex("04B70E0CBD6BB4BF7F321390B94A03C1D356C21122343280D6115C1D21BD376388B5F723FB4C22DFE6CD4375A05A07476444D5819985007E34");
    return new X9ECParameters(a,g,e,d)
}
function secp256k1() {
    var a = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F")
      , g = BigInteger.ZERO
      , f = fromHex("7")
      , e = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141")
      , d = BigInteger.ONE
      , a = new ECCurveFp(a,g,f)
      , g = a.decodePointHex("0479BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8");
    return new X9ECParameters(a,g,e,d)
}
function secp256r1() {
    var a = fromHex("FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF")
      , g = fromHex("FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFC")
      , f = fromHex("5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B")
      , e = fromHex("FFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551")
      , d = BigInteger.ONE
      , a = new ECCurveFp(a,g,f)
      , g = a.decodePointHex("046B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C2964FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5");
    return new X9ECParameters(a,g,e,d)
}
function getSECCurveByName(a) {
    return "secp128r1" == a ? secp128r1() : "secp160k1" == a ? secp160k1() : "secp160r1" == a ? secp160r1() : "secp192k1" == a ? secp192k1() : "secp192r1" == a ? secp192r1() : "secp224r1" == a ? secp224r1() : "secp256k1" == a ? secp256k1() : "secp256r1" == a ? secp256r1() : null
}
X9ECParameters.prototype.getCurve = x9getCurve;
X9ECParameters.prototype.getG = x9getG;
X9ECParameters.prototype.getN = x9getN;
X9ECParameters.prototype.getH = x9getH;
var EventEmitter = function() {};
EventEmitter.prototype.on = function(a, g, f) {
    f || (f = this);
    this._listeners || (this._listeners = {});
    this._listeners[a] || (this._listeners[a] = []);
    this._unbinders || (this._unbinders = {});
    this._unbinders[a] || (this._unbinders[a] = []);
    this._unbinders[a].push(g);
    this._listeners[a].push(function(a) {
        g.apply(f, [a])
    })
}
;
EventEmitter.prototype.trigger = function(a, g) {
    void 0 === g && (g = {});
    this._listeners || (this._listeners = {});
    if (this._listeners[a])
        for (var f = this._listeners[a].length; f--; )
            this._listeners[a][f](g)
}
;
EventEmitter.prototype.removeListener = function(a, g) {
    this._unbinders || (this._unbinders = {});
    if (this._unbinders[a])
        for (var f = this._unbinders[a].length; f--; )
            this._unbinders[a][f] === g && (this._unbinders[a].splice(f, 1),
            this._listeners[a].splice(f, 1))
}
;
EventEmitter.augment = function(a) {
    for (var g in EventEmitter.prototype)
        a[g] || (a[g] = EventEmitter.prototype[g])
}
;
(function(a) {
    "object" != typeof module && (a.EventEmitter = EventEmitter)
}
)("object" == typeof module ? module.exports : window.Bitcoin = {});
BigInteger.valueOf = nbv;
BigInteger.prototype.toByteArrayUnsigned = function() {
    var a = this.abs().toByteArray();
    return a.length ? (0 == a[0] && (a = a.slice(1)),
    a.map(function(a) {
        return 0 > a ? a + 256 : a
    })) : a
}
;
BigInteger.fromByteArrayUnsigned = function(a) {
    return a.length ? a[0] & 128 ? new BigInteger([0].concat(a)) : new BigInteger(a) : a.valueOf(0)
}
;
BigInteger.prototype.toByteArraySigned = function() {
    var a = this.abs().toByteArrayUnsigned();
    return 0 > this.compareTo(BigInteger.ZERO) ? a[0] & 128 ? a.unshift(128) : a[0] |= 128 : a[0] & 128 && a.unshift(0),
    a
}
;
BigInteger.fromByteArraySigned = function(a) {
    return a[0] & 128 ? (a[0] &= 127,
    BigInteger.fromByteArrayUnsigned(a).negate()) : BigInteger.fromByteArrayUnsigned(a)
}
;
var names = "log debug info warn error assert dir dirxml group groupEnd time timeEnd count trace profile profileEnd".split(" ");
"undefined" == typeof window.console && (window.console = {});
for (var i = 0; i < names.length; ++i)
    "undefined" == typeof window.console[names[i]] && (window.console[names[i]] = function() {}
    );
Bitcoin.Util = {
    isArray: Array.isArray || function(a) {
        return "[object Array]" === Object.prototype.toString.call(a)
    }
    ,
    makeFilledArray: function(a, g) {
        for (var f = [], e = 0; e < a; )
            f[e++] = g;
        return f
    },
    numToVarInt: function(a) {
        return 253 > a ? [a] : 65536 >= a ? [253, a >>> 8, a & 255] : 1 >= a ? [254].concat(Crypto.util.wordsToBytes([a])) : [255].concat(Crypto.util.wordsToBytes([a >>> 32, a]))
    },
    valueToBigInt: function(a) {
        return a instanceof BigInteger ? a : BigInteger.fromByteArrayUnsigned(a)
    },
    formatValue: function(a) {
        var g = this.valueToBigInt(a).toString();
        a = 8 < g.length ? g.substr(0, g.length - 8) : "0";
        for (g = 8 < g.length ? g.substr(g.length - 8) : g; 8 > g.length; )
            g = "0" + g;
        for (g = g.replace(/0*$/, ""); 2 > g.length; )
            g += "0";
        return a + "." + g
    },
    parseValue: function(a) {
        var g = a.split(".");
        a = g[0];
        for (g = g[1] || "0"; 8 > g.length; )
            g += "0";
        g = g.replace(/^0+/g, "");
        a = BigInteger.valueOf(parseInt(a));
        return a = a.multiply(BigInteger.valueOf(1E8)),
        a = a.add(BigInteger.valueOf(parseInt(g))),
        a
    },
    sha256ripe160: function(a) {
        return Crypto.RIPEMD160(Crypto.SHA256(a, {
            asBytes: !0
        }), {
            asBytes: !0
        })
    }
};
for (i in Crypto.util)
    Crypto.util.hasOwnProperty(i) && (Bitcoin.Util[i] = Crypto.util[i]);
(function(a) {
    a.Base58 = {
        alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
        validRegex: /^[1-9A-HJ-NP-Za-km-z]+$/,
        base: BigInteger.valueOf(58),
        encode: function(a) {
            for (var e = BigInteger.fromByteArrayUnsigned(a), d = []; 0 <= e.compareTo(g.base); ) {
                var b = e.mod(g.base);
                d.unshift(g.alphabet[b.intValue()]);
                e = e.subtract(b).divide(g.base)
            }
            d.unshift(g.alphabet[e.intValue()]);
            for (e = 0; e < a.length && 0 == a[e]; e++)
                d.unshift(g.alphabet[0]);
            return d.join("")
        },
        decode: function(a) {
            for (var e = BigInteger.valueOf(0), d = 0, b = a.length - 1; 0 <= b; b--) {
                var c = g.alphabet.indexOf(a[b]);
                if (0 > c)
                    throw "Invalid character";
                e = e.add(BigInteger.valueOf(c).multiply(g.base.pow(a.length - 1 - b)));
                "1" == a[b] ? d++ : d = 0
            }
            for (a = e.toByteArrayUnsigned(); 0 < d--; )
                a.unshift(0);
            return a
        }
    };
    var g = a.Base58
}
)("undefined" != typeof Bitcoin ? Bitcoin : module.exports);
Bitcoin.Address = function(a) {
    "string" == typeof a && (a = Bitcoin.Address.decodeString(a));
    this.hash = a;
    this.version = 0
}
;
Bitcoin.Address.prototype.toString = function() {
    var a = this.hash.slice(0);
    a.unshift(this.version);
    var g = Crypto.SHA256(Crypto.SHA256(a, {
        asBytes: !0
    }), {
        asBytes: !0
    })
      , a = a.concat(g.slice(0, 4));
    return Bitcoin.Base58.encode(a)
}
;
Bitcoin.Address.prototype.getHashBase64 = function() {
    return Crypto.util.bytesToBase64(this.hash)
}
;
Bitcoin.Address.decodeString = function(a) {
    var g = Bitcoin.Base58.decode(a);
    a = g.slice(0, 21);
    var f = Crypto.SHA256(Crypto.SHA256(a, {
        asBytes: !0
    }), {
        asBytes: !0
    });
    if (f[0] != g[21] || f[1] != g[22] || f[2] != g[23] || f[3] != g[24])
        throw "Checksum validation failed!";
    g = a.shift();
    if (0 != g)
        throw "Version " + g + " not supported!";
    return a
}
;
function integerToBytes(a, g) {
    var f = a.toByteArrayUnsigned();
    if (g < f.length)
        f = f.slice(f.length - g);
    else
        for (; g > f.length; )
            f.unshift(0);
    return f
}
function dmp(a) {
    return a instanceof BigInteger || (a = a.toBigInteger()),
    Crypto.util.bytesToHex(a.toByteArrayUnsigned())
}
ECFieldElementFp.prototype.getByteLength = function() {
    return Math.floor((this.toBigInteger().bitLength() + 7) / 8)
}
;
ECPointFp.prototype.getEncoded = function(a) {
    var g = this.getX().toBigInteger()
      , f = this.getY().toBigInteger()
      , g = integerToBytes(g, 32);
    return a ? f.isEven() ? g.unshift(2) : g.unshift(3) : (g.unshift(4),
    g = g.concat(integerToBytes(f, 32))),
    g
}
;
ECPointFp.decodeFrom = function(a, g) {
    var f = g.length - 1
      , e = g.slice(1, 1 + f / 2)
      , f = g.slice(1 + f / 2, 1 + f);
    e.unshift(0);
    f.unshift(0);
    e = new BigInteger(e);
    f = new BigInteger(f);
    return new ECPointFp(a,a.fromBigInteger(e),a.fromBigInteger(f))
}
;
ECPointFp.prototype.add2D = function(a) {
    if (this.isInfinity())
        return a;
    if (a.isInfinity())
        return this;
    if (this.x.equals(a.x))
        return this.y.equals(a.y) ? this.twice() : this.curve.getInfinity();
    var g = a.x.subtract(this.x)
      , g = a.y.subtract(this.y).divide(g);
    a = g.square().subtract(this.x).subtract(a.x);
    g = g.multiply(this.x.subtract(a)).subtract(this.y);
    return new ECPointFp(this.curve,a,g)
}
;
ECPointFp.prototype.twice2D = function() {
    if (this.isInfinity())
        return this;
    if (0 == this.y.toBigInteger().signum())
        return this.curve.getInfinity();
    var a = this.curve.fromBigInteger(BigInteger.valueOf(2))
      , g = this.curve.fromBigInteger(BigInteger.valueOf(3))
      , g = this.x.square().multiply(g).add(this.curve.a).divide(this.y.multiply(a))
      , a = g.square().subtract(this.x.multiply(a))
      , g = g.multiply(this.x.subtract(a)).subtract(this.y);
    return new ECPointFp(this.curve,a,g)
}
;
ECPointFp.prototype.multiply2D = function(a) {
    if (this.isInfinity())
        return this;
    if (0 == a.signum())
        return this.curve.getInfinity();
    var g = a.multiply(new BigInteger("3")), f = this.negate(), e = this, d;
    for (d = g.bitLength() - 2; 0 < d; --d) {
        var e = e.twice()
          , b = g.testBit(d)
          , c = a.testBit(d);
        b != c && (e = e.add2D(b ? this : f))
    }
    return e
}
;
ECPointFp.prototype.isOnCurve = function() {
    var a = this.getX().toBigInteger()
      , g = this.getY().toBigInteger()
      , f = this.curve.getA().toBigInteger()
      , e = this.curve.getB().toBigInteger()
      , d = this.curve.getQ()
      , g = g.multiply(g).mod(d)
      , a = a.multiply(a).multiply(a).add(f.multiply(a)).add(e).mod(d);
    return g.equals(a)
}
;
ECPointFp.prototype.toString = function() {
    return "(" + this.getX().toBigInteger().toString() + "," + this.getY().toBigInteger().toString() + ")"
}
;
ECPointFp.prototype.validate = function() {
    var a = this.curve.getQ();
    if (this.isInfinity())
        throw Error("Point is at infinity.");
    var g = this.getX().toBigInteger()
      , f = this.getY().toBigInteger();
    if (0 > g.compareTo(BigInteger.ONE) || 0 < g.compareTo(a.subtract(BigInteger.ONE)))
        throw Error("x coordinate out of bounds");
    if (0 > f.compareTo(BigInteger.ONE) || 0 < f.compareTo(a.subtract(BigInteger.ONE)))
        throw Error("y coordinate out of bounds");
    if (!this.isOnCurve())
        throw Error("Point is not on the curve.");
    if (this.multiply(a).isInfinity())
        throw Error("Point is not a scalar multiple of G.");
    return !0
}
;
Bitcoin.ECDSA = function() {
    var a = getSECCurveByName("secp256k1")
      , g = new SecureRandom
      , f = null
      , e = {
        getBigRandom: function(a) {
            return (new BigInteger(a.bitLength(),g)).mod(a.subtract(BigInteger.ONE)).add(BigInteger.ONE)
        },
        sign: function(d, b) {
            var c = a.getN()
              , h = BigInteger.fromByteArrayUnsigned(d);
            do
                var f = e.getBigRandom(c)
                  , g = a.getG().multiply(f).getX().toBigInteger().mod(c);
            while (0 >= g.compareTo(BigInteger.ZERO));c = f.modInverse(c).multiply(h.add(b.multiply(g))).mod(c);
            return e.serializeSig(g, c)
        },
        verify: function(d, b, c) {
            var h;
            if (Bitcoin.Util.isArray(b))
                b = e.parseSig(b);
            else if ("object" != typeof b || !b.r || !b.s)
                throw "Invalid value for signature";
            h = b.r;
            b = b.s;
            if (!(c instanceof ECPointFp)) {
                if (!Bitcoin.Util.isArray(c))
                    throw "Invalid format for pubkey value, must be byte array or ECPointFp";
                c = ECPointFp.decodeFrom(a.getCurve(), c)
            }
            d = BigInteger.fromByteArrayUnsigned(d);
            return e.verifyRaw(d, h, b, c)
        },
        verifyRaw: function(d, b, c, h) {
            var e = a.getN()
              , f = a.getG();
            if (0 > b.compareTo(BigInteger.ONE) || 0 <= b.compareTo(e) || 0 > c.compareTo(BigInteger.ONE) || 0 <= c.compareTo(e))
                return !1;
            c = c.modInverse(e);
            d = d.multiply(c).mod(e);
            c = b.multiply(c).mod(e);
            return f.multiply(d).add(h.multiply(c)).getX().toBigInteger().mod(e).equals(b)
        },
        serializeSig: function(a, b) {
            var c = a.toByteArraySigned()
              , h = b.toByteArraySigned()
              , e = [];
            return e.push(2),
            e.push(c.length),
            e = e.concat(c),
            e.push(2),
            e.push(h.length),
            e = e.concat(h),
            e.unshift(e.length),
            e.unshift(48),
            e
        },
        parseSig: function(a) {
            var b;
            if (48 != a[0])
                throw Error("Signature not a valid DERSequence");
            b = 2;
            if (2 != a[b])
                throw Error("First element in signature must be a DERInteger");
            var c = a.slice(b + 2, b + 2 + a[b + 1]);
            b += 2 + a[b + 1];
            if (2 != a[b])
                throw Error("Second element in signature must be a DERInteger");
            a = a.slice(b + 2, b + 2 + a[b + 1]);
            c = BigInteger.fromByteArrayUnsigned(c);
            a = BigInteger.fromByteArrayUnsigned(a);
            return {
                r: c,
                s: a
            }
        },
        parseSigCompact: function(d) {
            if (65 !== d.length)
                throw "Signature has the wrong length";
            var b = d[0] - 27;
            if (0 > b || 7 < b)
                throw "Invalid signature type";
            var c = a.getN()
              , h = BigInteger.fromByteArrayUnsigned(d.slice(1, 33)).mod(c);
            d = BigInteger.fromByteArrayUnsigned(d.slice(33, 65)).mod(c);
            return {
                r: h,
                s: d,
                i: b
            }
        },
        recoverPubKey: function(d, b, c, h) {
            h &= 3;
            var g = h & 1
              , l = h >> 1
              , n = a.getN();
            h = a.getG();
            var q = a.getCurve()
              , p = q.getQ()
              , r = q.getA().toBigInteger()
              , s = q.getB().toBigInteger();
            f || (f = p.add(BigInteger.ONE).divide(BigInteger.valueOf(4)));
            l = l ? d.add(n) : d;
            r = l.multiply(l).multiply(l).add(r.multiply(l)).add(s).mod(p).modPow(f, p);
            r.isEven();
            g = (r.isEven() ? !g : g) ? r : p.subtract(r);
            g = new ECPointFp(q,q.fromBigInteger(l),q.fromBigInteger(g));
            g.validate();
            c = BigInteger.fromByteArrayUnsigned(c);
            q = BigInteger.ZERO.subtract(c).mod(n);
            n = d.modInverse(n);
            r = Math.max(b.bitLength(), q.bitLength());
            p = g.add2D(h);
            l = g.curve.getInfinity();
            for (r -= 1; 0 <= r; --r)
                l = l.twice2D(),
                l.z = BigInteger.ONE,
                b.testBit(r) ? q.testBit(r) ? l = l.add2D(p) : l = l.add2D(g) : q.testBit(r) && (l = l.add2D(h));
            g = l.multiply(n);
            console.log("G.x: ", Crypto.util.bytesToHex(h.x.toBigInteger().toByteArrayUnsigned()));
            console.log("G.y: ", Crypto.util.bytesToHex(h.y.toBigInteger().toByteArrayUnsigned()));
            console.log("s: ", Crypto.util.bytesToHex(n.toByteArrayUnsigned()));
            console.log("Q.x: ", Crypto.util.bytesToHex(g.x.toBigInteger().toByteArrayUnsigned()));
            console.log("Q.y: ", Crypto.util.bytesToHex(g.y.toBigInteger().toByteArrayUnsigned()));
            g.validate();
            if (!e.verifyRaw(c, d, b, g))
                throw "Pubkey recovery unsuccessful";
            d = new Bitcoin.ECKey;
            return d.pub = g,
            d
        },
        calcPubkeyRecoveryParam: function(a, b, c, h) {
            for (var e = 0; 4 > e; e++)
                try {
                    if (Bitcoin.ECDSA.recoverPubKey(b, c, h, e).getBitcoinAddress().toString() == a)
                        return e
                } catch (f) {}
            throw "Unable to find valid recovery factor";
        }
    };
    return e
}();
Bitcoin.ECKey = function() {
    var a = Bitcoin.ECDSA
      , g = getSECCurveByName("secp256k1");
    new SecureRandom;
    var f = function(e) {
        e ? e instanceof BigInteger ? this.priv = e : Bitcoin.Util.isArray(e) ? this.priv = BigInteger.fromByteArrayUnsigned(e) : "string" == typeof e && (51 == e.length && "5" == e[0] ? this.priv = BigInteger.fromByteArrayUnsigned(f.decodeString(e)) : this.priv = BigInteger.fromByteArrayUnsigned(Crypto.util.base64ToBytes(e))) : (e = g.getN(),
        this.priv = a.getBigRandom(e));
        this.compressed = !!f.compressByDefault
    };
    return f.compressByDefault = !1,
    f.prototype.setCompressed = function(a) {
        this.compressed = !!a
    }
    ,
    f.prototype.getPub = function() {
        return this.getPubPoint().getEncoded(this.compressed)
    }
    ,
    f.prototype.getPubPoint = function() {
        return this.pub || (this.pub = g.getG().multiply(this.priv)),
        this.pub
    }
    ,
    f.prototype.getPubKeyHash = function() {
        return this.pubKeyHash ? this.pubKeyHash : this.pubKeyHash = Bitcoin.Util.sha256ripe160(this.getPub())
    }
    ,
    f.prototype.getBitcoinAddress = function() {
        var a = this.getPubKeyHash();
        return new Bitcoin.Address(a)
    }
    ,
    f.prototype.getExportedPrivateKey = function() {
        for (var a = this.priv.toByteArrayUnsigned(); 32 > a.length; )
            a.unshift(0);
        a.unshift(128);
        var d = Crypto.SHA256(Crypto.SHA256(a, {
            asBytes: !0
        }), {
            asBytes: !0
        })
          , a = a.concat(d.slice(0, 4));
        return Bitcoin.Base58.encode(a)
    }
    ,
    f.prototype.setPub = function(a) {
        this.pub = ECPointFp.decodeFrom(g.getCurve(), a)
    }
    ,
    f.prototype.toString = function(a) {
        return "base64" === a ? Crypto.util.bytesToBase64(this.priv.toByteArrayUnsigned()) : Crypto.util.bytesToHex(this.priv.toByteArrayUnsigned())
    }
    ,
    f.prototype.sign = function(e) {
        return a.sign(e, this.priv)
    }
    ,
    f.prototype.verify = function(e, d) {
        return a.verify(e, d, this.getPub())
    }
    ,
    f.decodeString = function(a) {
        var d = Bitcoin.Base58.decode(a);
        a = d.slice(0, 33);
        var b = Crypto.SHA256(Crypto.SHA256(a, {
            asBytes: !0
        }), {
            asBytes: !0
        });
        if (b[0] != d[33] || b[1] != d[34] || b[2] != d[35] || b[3] != d[36])
            throw "Checksum validation failed!";
        d = a.shift();
        if (128 != d)
            throw "Version " + d + " not supported!";
        return a
    }
    ,
    f
}();
(function() {
    var a = Bitcoin.Opcode = function(a) {
        this.code = a
    }
    ;
    a.prototype.toString = function() {
        return a.reverseMap[this.code]
    }
    ;
    a.map = {
        OP_0: 0,
        OP_FALSE: 0,
        OP_PUSHDATA1: 76,
        OP_PUSHDATA2: 77,
        OP_PUSHDATA4: 78,
        OP_1NEGATE: 79,
        OP_RESERVED: 80,
        OP_1: 81,
        OP_TRUE: 81,
        OP_2: 82,
        OP_3: 83,
        OP_4: 84,
        OP_5: 85,
        OP_6: 86,
        OP_7: 87,
        OP_8: 88,
        OP_9: 89,
        OP_10: 90,
        OP_11: 91,
        OP_12: 92,
        OP_13: 93,
        OP_14: 94,
        OP_15: 95,
        OP_16: 96,
        OP_NOP: 97,
        OP_VER: 98,
        OP_IF: 99,
        OP_NOTIF: 100,
        OP_VERIF: 101,
        OP_VERNOTIF: 102,
        OP_ELSE: 103,
        OP_ENDIF: 104,
        OP_VERIFY: 105,
        OP_RETURN: 106,
        OP_TOALTSTACK: 107,
        OP_FROMALTSTACK: 108,
        OP_2DROP: 109,
        OP_2DUP: 110,
        OP_3DUP: 111,
        OP_2OVER: 112,
        OP_2ROT: 113,
        OP_2SWAP: 114,
        OP_IFDUP: 115,
        OP_DEPTH: 116,
        OP_DROP: 117,
        OP_DUP: 118,
        OP_NIP: 119,
        OP_OVER: 120,
        OP_PICK: 121,
        OP_ROLL: 122,
        OP_ROT: 123,
        OP_SWAP: 124,
        OP_TUCK: 125,
        OP_CAT: 126,
        OP_SUBSTR: 127,
        OP_LEFT: 128,
        OP_RIGHT: 129,
        OP_SIZE: 130,
        OP_INVERT: 131,
        OP_AND: 132,
        OP_OR: 133,
        OP_XOR: 134,
        OP_EQUAL: 135,
        OP_EQUALVERIFY: 136,
        OP_RESERVED1: 137,
        OP_RESERVED2: 138,
        OP_1ADD: 139,
        OP_1SUB: 140,
        OP_2MUL: 141,
        OP_2DIV: 142,
        OP_NEGATE: 143,
        OP_ABS: 144,
        OP_NOT: 145,
        OP_0NOTEQUAL: 146,
        OP_ADD: 147,
        OP_SUB: 148,
        OP_MUL: 149,
        OP_DIV: 150,
        OP_MOD: 151,
        OP_LSHIFT: 152,
        OP_RSHIFT: 153,
        OP_BOOLAND: 154,
        OP_BOOLOR: 155,
        OP_NUMEQUAL: 156,
        OP_NUMEQUALVERIFY: 157,
        OP_NUMNOTEQUAL: 158,
        OP_LESSTHAN: 159,
        OP_GREATERTHAN: 160,
        OP_LESSTHANOREQUAL: 161,
        OP_GREATERTHANOREQUAL: 162,
        OP_MIN: 163,
        OP_MAX: 164,
        OP_WITHIN: 165,
        OP_RIPEMD160: 166,
        OP_SHA1: 167,
        OP_SHA256: 168,
        OP_HASH160: 169,
        OP_HASH256: 170,
        OP_CODESEPARATOR: 171,
        OP_CHECKSIG: 172,
        OP_CHECKSIGVERIFY: 173,
        OP_CHECKMULTISIG: 174,
        OP_CHECKMULTISIGVERIFY: 175,
        OP_NOP1: 176,
        OP_NOP2: 177,
        OP_NOP3: 178,
        OP_NOP4: 179,
        OP_NOP5: 180,
        OP_NOP6: 181,
        OP_NOP7: 182,
        OP_NOP8: 183,
        OP_NOP9: 184,
        OP_NOP10: 185,
        OP_PUBKEYHASH: 253,
        OP_PUBKEY: 254,
        OP_INVALIDOPCODE: 255
    };
    a.reverseMap = [];
    for (var g in a.map)
        a.reverseMap[a.map[g]] = g
}
)();
(function() {
    var a = Bitcoin.Opcode, g;
    for (g in a.map)
        eval("var " + g + " = " + a.map[g] + ";");
    var f = Bitcoin.Script = function(a) {
        if (a)
            if ("string" == typeof a)
                this.buffer = Crypto.util.base64ToBytes(a);
            else if (Bitcoin.Util.isArray(a))
                this.buffer = a;
            else {
                if (!(a instanceof f))
                    throw Error("Invalid script");
                this.buffer = a.buffer
            }
        else
            this.buffer = [];
        this.parse()
    }
    ;
    f.prototype.parse = function() {
        function a(c) {
            d.chunks.push(d.buffer.slice(b, b + c));
            b += c
        }
        var d = this;
        this.chunks = [];
        for (var b = 0; b < this.buffer.length; ) {
            var c = this.buffer[b++];
            240 <= c && (c = c << 8 | this.buffer[b++]);
            var h;
            0 < c && c < OP_PUSHDATA1 ? a(c) : c == OP_PUSHDATA1 ? (h = this.buffer[b++],
            a(h)) : c == OP_PUSHDATA2 ? (h = this.buffer[b++] << 8 | this.buffer[b++],
            a(h)) : c == OP_PUSHDATA4 ? (h = this.buffer[b++] << 24 | this.buffer[b++] << 16 | this.buffer[b++] << 8 | this.buffer[b++],
            a(h)) : this.chunks.push(c)
        }
    }
    ;
    f.prototype.getOutType = function() {
        return this.chunks[this.chunks.length - 1] == OP_CHECKMULTISIG && 3 >= this.chunks[this.chunks.length - 2] ? "Multisig" : 5 == this.chunks.length && this.chunks[0] == OP_DUP && this.chunks[1] == OP_HASH160 && this.chunks[3] == OP_EQUALVERIFY && this.chunks[4] == OP_CHECKSIG ? "Address" : 2 == this.chunks.length && this.chunks[1] == OP_CHECKSIG ? "Pubkey" : "Strange"
    }
    ;
    f.prototype.simpleOutHash = function() {
        switch (this.getOutType()) {
        case "Address":
            return this.chunks[2];
        case "Pubkey":
            return Bitcoin.Util.sha256ripe160(this.chunks[0]);
        default:
            throw Error("Encountered non-standard scriptPubKey");
        }
    }
    ;
    f.prototype.simpleOutPubKeyHash = f.prototype.simpleOutHash;
    f.prototype.getInType = function() {
        return 1 == this.chunks.length && Bitcoin.Util.isArray(this.chunks[0]) ? "Pubkey" : 2 == this.chunks.length && Bitcoin.Util.isArray(this.chunks[0]) && Bitcoin.Util.isArray(this.chunks[1]) ? "Address" : "Strange"
    }
    ;
    f.prototype.simpleInPubKey = function() {
        switch (this.getInType()) {
        case "Address":
            return this.chunks[1];
        case "Pubkey":
            throw Error("Script does not contain pubkey.");
        default:
            throw Error("Encountered non-standard scriptSig");
        }
    }
    ;
    f.prototype.simpleInHash = function() {
        return Bitcoin.Util.sha256ripe160(this.simpleInPubKey())
    }
    ;
    f.prototype.simpleInPubKeyHash = f.prototype.simpleInHash;
    f.prototype.writeOp = function(a) {
        this.buffer.push(a);
        this.chunks.push(a)
    }
    ;
    f.prototype.writeBytes = function(a) {
        a.length < OP_PUSHDATA1 ? this.buffer.push(a.length) : 255 >= a.length ? (this.buffer.push(OP_PUSHDATA1),
        this.buffer.push(a.length)) : 65535 >= a.length ? (this.buffer.push(OP_PUSHDATA2),
        this.buffer.push(a.length & 255),
        this.buffer.push(a.length >>> 8 & 255)) : (this.buffer.push(OP_PUSHDATA4),
        this.buffer.push(a.length & 255),
        this.buffer.push(a.length >>> 8 & 255),
        this.buffer.push(a.length >>> 16 & 255),
        this.buffer.push(a.length >>> 24 & 255));
        this.buffer = this.buffer.concat(a);
        this.chunks.push(a)
    }
    ;
    f.createOutputScript = function(a) {
        var d = new f;
        return d.writeOp(OP_DUP),
        d.writeOp(OP_HASH160),
        d.writeBytes(a.hash),
        d.writeOp(OP_EQUALVERIFY),
        d.writeOp(OP_CHECKSIG),
        d
    }
    ;
    f.prototype.extractAddresses = function(a) {
        switch (this.getOutType()) {
        case "Address":
            return a.push(new Address(this.chunks[2])),
            1;
        case "Pubkey":
            return a.push(new Address(Util.sha256ripe160(this.chunks[0]))),
            1;
        case "Multisig":
            for (var d = 1; d < this.chunks.length - 2; ++d)
                a.push(new Address(Util.sha256ripe160(this.chunks[d])));
            return this.chunks[0] - OP_1 + 1;
        default:
            throw Error("Encountered non-standard scriptPubKey");
        }
    }
    ;
    f.createMultiSigOutputScript = function(a, d) {
        var b = new Bitcoin.Script;
        b.writeOp(OP_1 + a - 1);
        for (var c = 0; c < d.length; ++c)
            b.writeBytes(d[c]);
        return b.writeOp(OP_1 + d.length - 1),
        b.writeOp(OP_CHECKMULTISIG),
        b
    }
    ;
    f.createInputScript = function(a, d) {
        var b = new f;
        return b.writeBytes(a),
        b.writeBytes(d),
        b
    }
    ;
    f.prototype.clone = function() {
        return new f(this.buffer)
    }
}
)();
(function() {
    var a = Bitcoin.Script
      , g = Bitcoin.Transaction = function(a) {
        this.version = 1;
        this.lock_time = 0;
        this.ins = [];
        this.outs = [];
        this.block = this.timestamp = null;
        if (a) {
            a.hash && (this.hash = a.hash);
            a.version && (this.version = a.version);
            a.lock_time && (this.lock_time = a.lock_time);
            if (a.ins && a.ins.length)
                for (var b = 0; b < a.ins.length; b++)
                    this.addInput(new f(a.ins[b]));
            if (a.outs && a.outs.length)
                for (b = 0; b < a.outs.length; b++)
                    this.addOutput(new e(a.outs[b]));
            a.timestamp && (this.timestamp = a.timestamp);
            a.block && (this.block = a.block)
        }
    }
    ;
    g.objectify = function(a) {
        for (var b = [], c = 0; c < a.length; c++)
            b.push(new g(a[c]));
        return b
    }
    ;
    g.prototype.addInput = function(a, b) {
        a instanceof f ? this.ins.push(a) : this.ins.push(new f({
            outpoint: {
                hash: a.hash,
                index: b
            },
            script: new Bitcoin.Script,
            sequence: 4294967295
        }))
    }
    ;
    g.prototype.addOutput = function(d, b) {
        if (d instanceof e)
            this.outs.push(d);
        else {
            if (b instanceof BigInteger)
                for (b = b.toByteArrayUnsigned().reverse(); 8 > b.length; )
                    b.push(0);
            else
                Bitcoin.Util.isArray(b);
            this.outs.push(new e({
                value: b,
                script: a.createOutputScript(d)
            }))
        }
    }
    ;
    g.prototype.serialize = function() {
        for (var a = [], a = a.concat(Crypto.util.wordsToBytes([parseInt(this.version)]).reverse()), a = a.concat(Bitcoin.Util.numToVarInt(this.ins.length)), b = 0; b < this.ins.length; b++)
            var c = this.ins[b]
              , a = a.concat(Crypto.util.base64ToBytes(c.outpoint.hash))
              , a = a.concat(Crypto.util.wordsToBytes([parseInt(c.outpoint.index)]).reverse())
              , h = c.script.buffer
              , a = a.concat(Bitcoin.Util.numToVarInt(h.length))
              , a = a.concat(h)
              , a = a.concat(Crypto.util.wordsToBytes([parseInt(c.sequence)]).reverse());
        a = a.concat(Bitcoin.Util.numToVarInt(this.outs.length));
        for (b = 0; b < this.outs.length; b++)
            c = this.outs[b],
            a = a.concat(c.value),
            h = c.script.buffer,
            a = a.concat(Bitcoin.Util.numToVarInt(h.length)),
            a = a.concat(h);
        return a = a.concat(Crypto.util.wordsToBytes([parseInt(this.lock_time)]).reverse()),
        a
    }
    ;
    g.prototype.hashTransactionForSignature = function(d, b, c) {
        for (var h = this.clone(), e = 0; e < h.ins.length; e++)
            h.ins[e].script = new a;
        h.ins[b].script = d;
        if (2 == (c & 31))
            for (h.outs = [],
            e = 0; e < h.ins.length; e++)
                e != b && (h.ins[e].sequence = 0);
        else
            3 == (c & 31);
        c & 80 && (h.ins = [h.ins[b]]);
        d = h.serialize();
        d = d.concat(Crypto.util.wordsToBytes([parseInt(c)]).reverse());
        c = Crypto.SHA256(d, {
            asBytes: !0
        });
        return Crypto.SHA256(c, {
            asBytes: !0
        })
    }
    ;
    g.prototype.getHash = function() {
        var a = this.serialize();
        return Crypto.SHA256(Crypto.SHA256(a, {
            asBytes: !0
        }), {
            asBytes: !0
        })
    }
    ;
    g.prototype.clone = function() {
        var a = new g;
        a.version = this.version;
        a.lock_time = this.lock_time;
        for (var b = 0; b < this.ins.length; b++) {
            var c = this.ins[b].clone();
            a.addInput(c)
        }
        for (b = 0; b < this.outs.length; b++)
            c = this.outs[b].clone(),
            a.addOutput(c);
        return a
    }
    ;
    g.prototype.analyze = function(a) {
        if (a instanceof Bitcoin.Wallet) {
            for (var b = !0, c = !0, h = null, e = null, f = null, g = this.outs.length - 1; 0 <= g; g--)
                h = this.outs[g].script.simpleOutPubKeyHash(),
                a.hasHash(h) ? e = h : c = !1;
            for (g = this.ins.length - 1; 0 <= g; g--)
                if (f = this.ins[g].script.simpleInPubKeyHash(),
                !a.hasHash(f)) {
                    b = !1;
                    break
                }
            a = this.calcImpact(a);
            g = {};
            return g.impact = a,
            0 < a.sign && 0 < a.value.compareTo(BigInteger.ZERO) ? (g.type = "recv",
            g.addr = new Bitcoin.Address(e)) : b && c ? g.type = "self" : b ? (g.type = "sent",
            g.addr = new Bitcoin.Address(h)) : g.type = "other",
            g
        }
        return null
    }
    ;
    g.prototype.getDescription = function(a) {
        a = this.analyze(a);
        if (!a)
            return "";
        switch (a.type) {
        case "recv":
            return "Received with " + a.addr;
        case "sent":
            return "Payment to " + a.addr;
        case "self":
            return "Payment to yourself";
        default:
            return ""
        }
    }
    ;
    g.prototype.getTotalOutValue = function() {
        for (var a = BigInteger.ZERO, b = 0; b < this.outs.length; b++)
            a = a.add(Bitcoin.Util.valueToBigInt(this.outs[b].value));
        return a
    }
    ;
    g.prototype.getTotalValue = g.prototype.getTotalOutValue;
    g.prototype.calcImpact = function(a) {
        if (a instanceof Bitcoin.Wallet) {
            for (var b = BigInteger.ZERO, c = 0; c < this.outs.length; c++) {
                var h = this.outs[c]
                  , e = Crypto.util.bytesToBase64(h.script.simpleOutPubKeyHash());
                a.hasHash(e) && (b = b.add(Bitcoin.Util.valueToBigInt(h.value)))
            }
            h = BigInteger.ZERO;
            for (c = 0; c < this.ins.length; c++) {
                var f = this.ins[c]
                  , e = Crypto.util.bytesToBase64(f.script.simpleInPubKeyHash());
                a.hasHash(e) && (e = a.txIndex[f.outpoint.hash]) && (h = h.add(Bitcoin.Util.valueToBigInt(e.outs[f.outpoint.index].value)))
            }
            return 0 <= b.compareTo(h) ? {
                sign: 1,
                value: b.subtract(h)
            } : {
                sign: -1,
                value: h.subtract(b)
            }
        }
        return BigInteger.ZERO
    }
    ;
    var f = Bitcoin.TransactionIn = function(d) {
        this.outpoint = d.outpoint;
        d.script instanceof a ? this.script = d.script : this.script = new a(d.script);
        this.sequence = d.sequence
    }
    ;
    f.prototype.clone = function() {
        return new f({
            outpoint: {
                hash: this.outpoint.hash,
                index: this.outpoint.index
            },
            script: this.script.clone(),
            sequence: this.sequence
        })
    }
    ;
    var e = Bitcoin.TransactionOut = function(d) {
        d.script instanceof a ? this.script = d.script : this.script = new a(d.script);
        if (Bitcoin.Util.isArray(d.value))
            this.value = d.value;
        else if ("string" == typeof d.value) {
            for (d = (new BigInteger(d.value,10)).toString(16); 16 > d.length; )
                d = "0" + d;
            this.value = Crypto.util.hexToBytes(d)
        }
    }
    ;
    e.prototype.clone = function() {
        return new e({
            script: this.script.clone(),
            value: this.value.slice(0)
        })
    }
}
)();
Bitcoin.Wallet = function() {
    var a = Bitcoin.Script
      , g = Bitcoin.TransactionIn
      , f = Bitcoin.TransactionOut
      , e = function() {
        var a = [];
        this.addressHashes = [];
        this.txIndex = {};
        this.unspentOuts = [];
        this.addressPointer = 0;
        this.addKey = function(b, c) {
            b instanceof Bitcoin.ECKey || (b = new Bitcoin.ECKey(b));
            a.push(b);
            c && ("string" == typeof c && (c = Crypto.util.base64ToBytes(c)),
            b.setPub(c));
            this.addressHashes.push(b.getBitcoinAddress().getHashBase64())
        }
        ;
        this.addKeys = function(a, c) {
            "string" == typeof a && (a = a.split(","));
            "string" == typeof c && (c = c.split(","));
            var d;
            if (Array.isArray(c) && a.length == c.length)
                for (d = 0; d < a.length; d++)
                    this.addKey(a[d], c[d]);
            else
                for (d = 0; d < a.length; d++)
                    this.addKey(a[d])
        }
        ;
        this.getKeys = function() {
            for (var b = [], c = 0; c < a.length; c++)
                b.push(a[c].toString("base64"));
            return b
        }
        ;
        this.getPubKeys = function() {
            for (var b = [], c = 0; c < a.length; c++)
                b.push(Crypto.util.bytesToBase64(a[c].getPub()));
            return b
        }
        ;
        this.clear = function() {
            a = []
        }
        ;
        this.getLength = function() {
            return a.length
        }
        ;
        this.getAllAddresses = function() {
            for (var b = [], c = 0; c < a.length; c++)
                b.push(a[c].getBitcoinAddress());
            return b
        }
        ;
        this.getCurAddress = function() {
            return a[this.addressPointer] ? a[this.addressPointer].getBitcoinAddress() : null
        }
        ;
        this.getNextAddress = function() {
            return this.addressPointer++,
            a[this.addressPointer] || this.generateAddress(),
            a[this.addressPointer].getBitcoinAddress()
        }
        ;
        this.signWithKey = function(b, c) {
            b = Crypto.util.bytesToBase64(b);
            for (var h = 0; h < this.addressHashes.length; h++)
                if (this.addressHashes[h] == b)
                    return a[h].sign(c);
            throw Error("Missing key for signature");
        }
        ;
        this.getPubKeyFromHash = function(b) {
            b = Crypto.util.bytesToBase64(b);
            for (var c = 0; c < this.addressHashes.length; c++)
                if (this.addressHashes[c] == b)
                    return a[c].getPub();
            throw Error("Hash unknown");
        }
    };
    return e.prototype.generateAddress = function() {
        this.addKey(new Bitcoin.ECKey)
    }
    ,
    e.prototype.process = function(a) {
        if (!this.txIndex[a.hash]) {
            var b, c, h;
            for (b = 0; b < a.outs.length; b++) {
                var e = new f(a.outs[b]);
                h = Crypto.util.bytesToBase64(e.script.simpleOutPubKeyHash());
                for (c = 0; c < this.addressHashes.length; c++)
                    if (this.addressHashes[c] === h) {
                        this.unspentOuts.push({
                            tx: a,
                            index: b,
                            out: e
                        });
                        break
                    }
            }
            for (b = 0; b < a.ins.length; b++)
                for (e = new g(a.ins[b]),
                c = e.script.simpleInPubKey(),
                h = Crypto.util.bytesToBase64(Bitcoin.Util.sha256ripe160(c)),
                c = 0; c < this.addressHashes.length; c++)
                    if (this.addressHashes[c] === h) {
                        for (c = 0; c < this.unspentOuts.length; c++)
                            e.outpoint.hash == this.unspentOuts[c].tx.hash && e.outpoint.index == this.unspentOuts[c].index && this.unspentOuts.splice(c, 1);
                        break
                    }
            this.txIndex[a.hash] = a
        }
    }
    ,
    e.prototype.getBalance = function() {
        for (var a = BigInteger.valueOf(0), b = 0; b < this.unspentOuts.length; b++)
            a = a.add(Bitcoin.Util.valueToBigInt(this.unspentOuts[b].out.value));
        return a
    }
    ,
    e.prototype.createSend = function(d, b, c) {
        var h = []
          , e = b.add(c)
          , f = BigInteger.ZERO;
        for (c = 0; c < this.unspentOuts.length && !(h.push(this.unspentOuts[c]),
        f = f.add(Bitcoin.Util.valueToBigInt(this.unspentOuts[c].out.value)),
        0 <= f.compareTo(e)); c++)
            ;
        if (0 > f.compareTo(e))
            throw Error("Insufficient funds.");
        f = f.subtract(e);
        e = new Bitcoin.Transaction;
        for (c = 0; c < h.length; c++)
            e.addInput(h[c].tx, h[c].index);
        e.addOutput(d, b);
        0 < f.compareTo(BigInteger.ZERO) && e.addOutput(this.getNextAddress(), f);
        for (c = 0; c < e.ins.length; c++)
            b = e.hashTransactionForSignature(h[c].out.script, c, 1),
            d = h[c].out.script.simpleOutPubKeyHash(),
            b = this.signWithKey(d, b),
            b.push(1),
            e.ins[c].script = a.createInputScript(b, this.getPubKeyFromHash(d));
        return e
    }
    ,
    e.prototype.clearTransactions = function() {
        this.txIndex = {};
        this.unspentOuts = []
    }
    ,
    e.prototype.hasHash = function(a) {
        Bitcoin.Util.isArray(a) && (a = Crypto.util.bytesToBase64(a));
        for (var b = 0; b < this.addressHashes.length; b++)
            if (this.addressHashes[b] === a)
                return !0;
        return !1
    }
    ,
    e
}();
var TransactionDatabase = function() {
    this.txs = [];
    this.txIndex = {}
};
EventEmitter.augment(TransactionDatabase.prototype);
TransactionDatabase.prototype.addTransaction = function(a) {
    this.addTransactionNoUpdate(a);
    $(this).trigger("update")
}
;
TransactionDatabase.prototype.addTransactionNoUpdate = function(a) {
    this.txIndex[a.hash] || (this.txs.push(new Bitcoin.Transaction(a)),
    this.txIndex[a.hash] = a)
}
;
TransactionDatabase.prototype.removeTransaction = function(a) {
    this.removeTransactionNoUpdate(a);
    $(this).trigger("update")
}
;
TransactionDatabase.prototype.removeTransactionNoUpdate = function(a) {
    if (this.txIndex[a]) {
        for (var g = 0, f = this.txs.length; g < f; g++)
            if (this.txs[g].hash == a) {
                this.txs.splice(g, 1);
                break
            }
        delete this.txIndex[a]
    }
}
;
TransactionDatabase.prototype.loadTransactions = function(a) {
    for (var g = 0; g < a.length; g++)
        this.addTransactionNoUpdate(a[g]);
    $(this).trigger("update")
}
;
TransactionDatabase.prototype.getTransactions = function() {
    return this.txs
}
;
TransactionDatabase.prototype.clear = function() {
    this.txs = [];
    this.txIndex = {};
    $(this).trigger("update")
}
;
(function(a, g) {
    function f(a) {
        var c = a.length
          , b = k.type(a);
        return k.isWindow(a) ? !1 : 1 === a.nodeType && c ? !0 : "array" === b || "function" !== b && (0 === c || "number" == typeof c && 0 < c && c - 1 in a)
    }
    function e(a) {
        var c = Xa[a] = {};
        return k.each(a.match(da) || [], function(a, b) {
            c[b] = !0
        }),
        c
    }
    function d(a, c, b, d) {
        if (k.acceptData(a)) {
            var h, e, f = k.expando, m = a.nodeType, l = m ? k.cache : a, n = m ? a[f] : a[f] && f;
            if (n && l[n] && (d || l[n].data) || b !== g || "string" != typeof c)
                return n || (n = m ? a[f] = fa.pop() || k.guid++ : f),
                l[n] || (l[n] = m ? {} : {
                    toJSON: k.noop
                }),
                ("object" == typeof c || "function" == typeof c) && (d ? l[n] = k.extend(l[n], c) : l[n].data = k.extend(l[n].data, c)),
                e = l[n],
                d || (e.data || (e.data = {}),
                e = e.data),
                b !== g && (e[k.camelCase(c)] = b),
                "string" == typeof c ? (h = e[c],
                null == h && (h = e[k.camelCase(c)])) : h = e,
                h
        }
    }
    function b(a, c, b) {
        if (k.acceptData(a)) {
            var d, e, f = a.nodeType, g = f ? k.cache : a, m = f ? a[k.expando] : k.expando;
            if (g[m]) {
                if (c && (d = b ? g[m] : g[m].data)) {
                    k.isArray(c) ? c = c.concat(k.map(c, k.camelCase)) : c in d ? c = [c] : (c = k.camelCase(c),
                    c = c in d ? [c] : c.split(" "));
                    for (e = c.length; e--; )
                        delete d[c[e]];
                    if (b ? !h(d) : !k.isEmptyObject(d))
                        return
                }
                (b || (delete g[m].data,
                h(g[m]))) && (f ? k.cleanData([a], !0) : k.support.deleteExpando || g != g.window ? delete g[m] : g[m] = null)
            }
        }
    }
    function c(a, c, b) {
        if (b === g && 1 === a.nodeType) {
            var d = "data-" + c.replace(xb, "-$1").toLowerCase();
            if (b = a.getAttribute(d),
            "string" == typeof b) {
                try {
                    b = "true" === b ? !0 : "false" === b ? !1 : "null" === b ? null : +b + "" === b ? +b : yb.test(b) ? k.parseJSON(b) : b
                } catch (h) {}
                k.data(a, c, b)
            } else
                b = g
        }
        return b
    }
    function h(a) {
        for (var c in a)
            if (("data" !== c || !k.isEmptyObject(a[c])) && "toJSON" !== c)
                return !1;
        return !0
    }
    function m() {
        return !0
    }
    function l() {
        return !1
    }
    function n() {
        try {
            return G.activeElement
        } catch (a) {}
    }
    function q(a, c) {
        do
            a = a[c];
        while (a && 1 !== a.nodeType);return a
    }
    function p(a, c, b) {
        if (k.isFunction(c))
            return k.grep(a, function(a, d) {
                return !!c.call(a, d, a) !== b
            });
        if (c.nodeType)
            return k.grep(a, function(a) {
                return a === c !== b
            });
        if ("string" == typeof c) {
            if (zb.test(c))
                return k.filter(c, a, b);
            c = k.filter(c, a)
        }
        return k.grep(a, function(a) {
            return 0 <= k.inArray(a, c) !== b
        })
    }
    function r(a) {
        var c = Ya.split("|");
        a = a.createDocumentFragment();
        if (a.createElement)
            for (; c.length; )
                a.createElement(c.pop());
        return a
    }
    function s(a, c) {
        return k.nodeName(a, "table") && k.nodeName(1 === c.nodeType ? c : c.firstChild, "tr") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a
    }
    function u(a) {
        return a.type = (null !== k.find.attr(a, "type")) + "/" + a.type,
        a
    }
    function v(a) {
        var c = Ab.exec(a.type);
        return c ? a.type = c[1] : a.removeAttribute("type"),
        a
    }
    function x(a, c) {
        for (var b, d = 0; null != (b = a[d]); d++)
            k._data(b, "globalEval", !c || k._data(c[d], "globalEval"))
    }
    function B(a, c) {
        if (1 === c.nodeType && k.hasData(a)) {
            var b, d, h;
            d = k._data(a);
            var e = k._data(c, d)
              , f = d.events;
            if (f)
                for (b in delete e.handle,
                e.events = {},
                f)
                    for (d = 0,
                    h = f[b].length; h > d; d++)
                        k.event.add(c, b, f[b][d]);
            e.data && (e.data = k.extend({}, e.data))
        }
    }
    function C(a, c) {
        var b, d, h = 0, e = typeof a.getElementsByTagName !== aa ? a.getElementsByTagName(c || "*") : typeof a.querySelectorAll !== aa ? a.querySelectorAll(c || "*") : g;
        if (!e)
            for (e = [],
            b = a.childNodes || a; null != (d = b[h]); h++)
                !c || k.nodeName(d, c) ? e.push(d) : k.merge(e, C(d, c));
        return c === g || c && k.nodeName(a, c) ? k.merge([a], e) : e
    }
    function w(a) {
        Ja.test(a.type) && (a.defaultChecked = a.checked)
    }
    function y(a, c) {
        if (c in a)
            return c;
        for (var b = c.charAt(0).toUpperCase() + c.slice(1), d = c, h = Za.length; h--; )
            if (c = Za[h] + b,
            c in a)
                return c;
        return d
    }
    function A(a, c) {
        return a = c || a,
        "none" === k.css(a, "display") || !k.contains(a.ownerDocument, a)
    }
    function N(a, c) {
        for (var b, d, h, e = [], f = 0, g = a.length; g > f; f++)
            d = a[f],
            d.style && (e[f] = k._data(d, "olddisplay"),
            b = d.style.display,
            c ? (e[f] || "none" !== b || (d.style.display = ""),
            "" === d.style.display && A(d) && (e[f] = k._data(d, "olddisplay", L(d.nodeName)))) : e[f] || (h = A(d),
            (b && "none" !== b || !h) && k._data(d, "olddisplay", h ? b : k.css(d, "display"))));
        for (f = 0; g > f; f++)
            d = a[f],
            d.style && (c && "none" !== d.style.display && "" !== d.style.display || (d.style.display = c ? e[f] || "" : "none"));
        return a
    }
    function I(a, c, b) {
        return (a = Bb.exec(c)) ? Math.max(0, a[1] - (b || 0)) + (a[2] || "px") : c
    }
    function J(a, c, b, d, h) {
        c = b === (d ? "border" : "content") ? 4 : "width" === c ? 1 : 0;
        for (var e = 0; 4 > c; c += 2)
            "margin" === b && (e += k.css(a, b + na[c], !0, h)),
            d ? ("content" === b && (e -= k.css(a, "padding" + na[c], !0, h)),
            "margin" !== b && (e -= k.css(a, "border" + na[c] + "Width", !0, h))) : (e += k.css(a, "padding" + na[c], !0, h),
            "padding" !== b && (e += k.css(a, "border" + na[c] + "Width", !0, h)));
        return e
    }
    function F(a, c, b) {
        var d = !0
          , h = "width" === c ? a.offsetWidth : a.offsetHeight
          , e = ia(a)
          , f = k.support.boxSizing && "border-box" === k.css(a, "boxSizing", !1, e);
        if (0 >= h || null == h) {
            if (h = ba(a, c, e),
            (0 > h || null == h) && (h = a.style[c]),
            xa.test(h))
                return h;
            d = f && (k.support.boxSizingReliable || h === a.style[c]);
            h = parseFloat(h) || 0
        }
        return h + J(a, c, b || (f ? "border" : "content"), d, e) + "px"
    }
    function L(a) {
        var c = G
          , b = $a[a];
        return b || (b = E(a, c),
        "none" !== b && b || (ja = (ja || k("<iframe frameborder='0' width='0' height='0'/>").css("cssText", "display:block !important")).appendTo(c.documentElement),
        c = (ja[0].contentWindow || ja[0].contentDocument).document,
        c.write("<!doctype html><html><body>"),
        c.close(),
        b = E(a, c),
        ja.detach()),
        $a[a] = b),
        b
    }
    function E(a, c) {
        var b = k(c.createElement(a)).appendTo(c.body)
          , d = k.css(b[0], "display");
        return b.remove(),
        d
    }
    function R(a, c, b, d) {
        var h;
        if (k.isArray(c))
            k.each(c, function(c, h) {
                b || Cb.test(a) ? d(a, h) : R(a + "[" + ("object" == typeof h ? c : "") + "]", h, b, d)
            });
        else if (b || "object" !== k.type(c))
            d(a, c);
        else
            for (h in c)
                R(a + "[" + h + "]", c[h], b, d)
    }
    function Y(a) {
        return function(c, b) {
            "string" != typeof c && (b = c,
            c = "*");
            var d, h = 0, e = c.toLowerCase().match(da) || [];
            if (k.isFunction(b))
                for (; d = e[h++]; )
                    "+" === d[0] ? (d = d.slice(1) || "*",
                    (a[d] = a[d] || []).unshift(b)) : (a[d] = a[d] || []).push(b)
        }
    }
    function K(a, c, b, d) {
        function h(m) {
            var l;
            return e[m] = !0,
            k.each(a[m] || [], function(a, m) {
                var H = m(c, b, d);
                return "string" != typeof H || f || e[H] ? f ? !(l = H) : g : (c.dataTypes.unshift(H),
                h(H),
                !1)
            }),
            l
        }
        var e = {}
          , f = a === Ka;
        return h(c.dataTypes[0]) || !e["*"] && h("*")
    }
    function P(a, c) {
        var b, d, h = k.ajaxSettings.flatOptions || {};
        for (d in c)
            c[d] !== g && ((h[d] ? a : b || (b = {}))[d] = c[d]);
        return b && k.extend(!0, a, b),
        a
    }
    function W() {
        try {
            return new a.XMLHttpRequest
        } catch (c) {}
    }
    function S() {
        return setTimeout(function() {
            pa = g
        }),
        pa = k.now()
    }
    function D(a, c, b) {
        for (var d, h = (oa[c] || []).concat(oa["*"]), e = 0, f = h.length; f > e; e++)
            if (d = h[e].call(b, c, a))
                return d
    }
    function O(a, c, b) {
        var d, h = 0, e = ya.length, f = k.Deferred().always(function() {
            delete g.elem
        }), g = function() {
            if (d)
                return !1;
            for (var c = pa || S(), c = Math.max(0, m.startTime + m.duration - c), b = 1 - (c / m.duration || 0), h = 0, e = m.tweens.length; e > h; h++)
                m.tweens[h].run(b);
            return f.notifyWith(a, [m, b, c]),
            1 > b && e ? c : (f.resolveWith(a, [m]),
            !1)
        }, m = f.promise({
            elem: a,
            props: k.extend({}, c),
            opts: k.extend(!0, {
                specialEasing: {}
            }, b),
            originalProperties: c,
            originalOptions: b,
            startTime: pa || S(),
            duration: b.duration,
            tweens: [],
            createTween: function(c, b) {
                var d = k.Tween(a, m.opts, c, b, m.opts.specialEasing[c] || m.opts.easing);
                return m.tweens.push(d),
                d
            },
            stop: function(c) {
                var b = 0
                  , h = c ? m.tweens.length : 0;
                if (d)
                    return this;
                for (d = !0; h > b; b++)
                    m.tweens[b].run(1);
                return c ? f.resolveWith(a, [m, c]) : f.rejectWith(a, [m, c]),
                this
            }
        });
        b = m.props;
        for (M(b, m.opts.specialEasing); e > h; h++)
            if (c = ya[h].call(m, a, b, m.opts))
                return c;
        return k.map(b, D, m),
        k.isFunction(m.opts.start) && m.opts.start.call(a, m),
        k.fx.timer(k.extend(g, {
            elem: a,
            anim: m,
            queue: m.opts.queue
        })),
        m.progress(m.opts.progress).done(m.opts.done, m.opts.complete).fail(m.opts.fail).always(m.opts.always)
    }
    function M(a, c) {
        var b, d, h, e, f;
        for (b in a)
            if (d = k.camelCase(b),
            h = c[d],
            e = a[b],
            k.isArray(e) && (h = e[1],
            e = a[b] = e[0]),
            b !== d && (a[d] = e,
            delete a[b]),
            f = k.cssHooks[d],
            f && "expand"in f)
                for (b in e = f.expand(e),
                delete a[d],
                e)
                    b in a || (a[b] = e[b],
                    c[b] = h);
            else
                c[d] = h
    }
    function Q(a, c, b, d, h) {
        return new Q.prototype.init(a,c,b,d,h)
    }
    function ga(a, c) {
        var b, d = {
            height: a
        }, h = 0;
        for (c = c ? 1 : 0; 4 > h; h += 2 - c)
            b = na[h],
            d["margin" + b] = d["padding" + b] = a;
        return c && (d.opacity = d.width = a),
        d
    }
    function V(a) {
        return k.isWindow(a) ? a : 9 === a.nodeType ? a.defaultView || a.parentWindow : !1
    }
    var ca, U, aa = typeof g, Aa = a.location, G = a.document, Fa = G.documentElement, Ga = a.jQuery, Ba = a.$, za = {}, fa = [], ab = fa.concat, La = fa.push, ka = fa.slice, bb = fa.indexOf, Db = za.toString, qa = za.hasOwnProperty, Ma = "1.10.2".trim, k = function(a, c) {
        return new k.fn.init(a,c,U)
    }, Ca = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, da = /\S+/g, Eb = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, Fb = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, cb = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, Gb = /^[\],:{}\s]*$/, Hb = /(?:^|:|,)(?:\s*\[)+/g, Ib = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g, Jb = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g, Kb = /^-ms-/, Lb = /-([\da-z])/gi, Mb = function(a, c) {
        return c.toUpperCase()
    }, Z = function(a) {
        (G.addEventListener || "load" === a.type || "complete" === G.readyState) && (db(),
        k.ready())
    }, db = function() {
        G.addEventListener ? (G.removeEventListener("DOMContentLoaded", Z, !1),
        a.removeEventListener("load", Z, !1)) : (G.detachEvent("onreadystatechange", Z),
        a.detachEvent("onload", Z))
    };
    k.fn = k.prototype = {
        jquery: "1.10.2",
        constructor: k,
        init: function(a, c, b) {
            var d, h;
            if (!a)
                return this;
            if ("string" == typeof a) {
                if (d = "<" === a.charAt(0) && ">" === a.charAt(a.length - 1) && 3 <= a.length ? [null, a, null] : Fb.exec(a),
                !d || !d[1] && c)
                    return !c || c.jquery ? (c || b).find(a) : this.constructor(c).find(a);
                if (d[1]) {
                    if (c = c instanceof k ? c[0] : c,
                    k.merge(this, k.parseHTML(d[1], c && c.nodeType ? c.ownerDocument || c : G, !0)),
                    cb.test(d[1]) && k.isPlainObject(c))
                        for (d in c)
                            k.isFunction(this[d]) ? this[d](c[d]) : this.attr(d, c[d]);
                    return this
                }
                if (h = G.getElementById(d[2]),
                h && h.parentNode) {
                    if (h.id !== d[2])
                        return b.find(a);
                    this.length = 1;
                    this[0] = h
                }
                return this.context = G,
                this.selector = a,
                this
            }
            return a.nodeType ? (this.context = this[0] = a,
            this.length = 1,
            this) : k.isFunction(a) ? b.ready(a) : (a.selector !== g && (this.selector = a.selector,
            this.context = a.context),
            k.makeArray(a, this))
        },
        selector: "",
        length: 0,
        toArray: function() {
            return ka.call(this)
        },
        get: function(a) {
            return null == a ? this.toArray() : 0 > a ? this[this.length + a] : this[a]
        },
        pushStack: function(a) {
            a = k.merge(this.constructor(), a);
            return a.prevObject = this,
            a.context = this.context,
            a
        },
        each: function(a, c) {
            return k.each(this, a, c)
        },
        ready: function(a) {
            return k.ready.promise().done(a),
            this
        },
        slice: function() {
            return this.pushStack(ka.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(a) {
            var c = this.length;
            a = +a + (0 > a ? c : 0);
            return this.pushStack(0 <= a && c > a ? [this[a]] : [])
        },
        map: function(a) {
            return this.pushStack(k.map(this, function(c, b) {
                return a.call(c, b, c)
            }))
        },
        end: function() {
            return this.prevObject || this.constructor(null)
        },
        push: La,
        sort: [].sort,
        splice: [].splice
    };
    k.fn.init.prototype = k.fn;
    k.extend = k.fn.extend = function() {
        var a, c, b, d, h, e, f = arguments[0] || {}, m = 1, l = arguments.length, n = !1;
        "boolean" == typeof f && (n = f,
        f = arguments[1] || {},
        m = 2);
        "object" == typeof f || k.isFunction(f) || (f = {});
        for (l === m && (f = this,
        --m); l > m; m++)
            if (null != (h = arguments[m]))
                for (d in h)
                    a = f[d],
                    b = h[d],
                    f !== b && (n && b && (k.isPlainObject(b) || (c = k.isArray(b))) ? (c ? (c = !1,
                    e = a && k.isArray(a) ? a : []) : e = a && k.isPlainObject(a) ? a : {},
                    f[d] = k.extend(n, e, b)) : b !== g && (f[d] = b));
        return f
    }
    ;
    k.extend({
        expando: "jQuery" + ("1.10.2" + Math.random()).replace(/\D/g, ""),
        noConflict: function(c) {
            return a.$ === k && (a.$ = Ba),
            c && a.jQuery === k && (a.jQuery = Ga),
            k
        },
        isReady: !1,
        readyWait: 1,
        holdReady: function(a) {
            a ? k.readyWait++ : k.ready(!0)
        },
        ready: function(a) {
            if (!0 === a ? !--k.readyWait : !k.isReady) {
                if (!G.body)
                    return setTimeout(k.ready);
                k.isReady = !0;
                !0 !== a && 0 < --k.readyWait || (ca.resolveWith(G, [k]),
                k.fn.trigger && k(G).trigger("ready").off("ready"))
            }
        },
        isFunction: function(a) {
            return "function" === k.type(a)
        },
        isArray: Array.isArray || function(a) {
            return "array" === k.type(a)
        }
        ,
        isWindow: function(a) {
            return null != a && a == a.window
        },
        isNumeric: function(a) {
            return !isNaN(parseFloat(a)) && isFinite(a)
        },
        type: function(a) {
            return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? za[Db.call(a)] || "object" : typeof a
        },
        isPlainObject: function(a) {
            var c;
            if (!a || "object" !== k.type(a) || a.nodeType || k.isWindow(a))
                return !1;
            try {
                if (a.constructor && !qa.call(a, "constructor") && !qa.call(a.constructor.prototype, "isPrototypeOf"))
                    return !1
            } catch (b) {
                return !1
            }
            if (k.support.ownLast)
                for (c in a)
                    return qa.call(a, c);
            for (c in a)
                ;
            return c === g || qa.call(a, c)
        },
        isEmptyObject: function(a) {
            for (var c in a)
                return !1;
            return !0
        },
        error: function(a) {
            throw Error(a);
        },
        parseHTML: function(a, c, b) {
            if (!a || "string" != typeof a)
                return null;
            "boolean" == typeof c && (b = c,
            c = !1);
            c = c || G;
            var d = cb.exec(a);
            b = !b && [];
            return d ? [c.createElement(d[1])] : (d = k.buildFragment([a], c, b),
            b && k(b).remove(),
            k.merge([], d.childNodes))
        },
        parseJSON: function(c) {
            return a.JSON && a.JSON.parse ? a.JSON.parse(c) : null === c ? c : "string" == typeof c && (c = k.trim(c),
            c && Gb.test(c.replace(Ib, "@").replace(Jb, "]").replace(Hb, ""))) ? Function("return " + c)() : (k.error("Invalid JSON: " + c),
            g)
        },
        parseXML: function(c) {
            var b, d;
            if (!c || "string" != typeof c)
                return null;
            try {
                a.DOMParser ? (d = new DOMParser,
                b = d.parseFromString(c, "text/xml")) : (b = new ActiveXObject("Microsoft.XMLDOM"),
                b.async = "false",
                b.loadXML(c))
            } catch (h) {
                b = g
            }
            return b && b.documentElement && !b.getElementsByTagName("parsererror").length || k.error("Invalid XML: " + c),
            b
        },
        noop: function() {},
        globalEval: function(c) {
            c && k.trim(c) && (a.execScript || function(c) {
                a.eval.call(a, c)
            }
            )(c)
        },
        camelCase: function(a) {
            return a.replace(Kb, "ms-").replace(Lb, Mb)
        },
        nodeName: function(a, c) {
            return a.nodeName && a.nodeName.toLowerCase() === c.toLowerCase()
        },
        each: function(a, c, b) {
            var d, h = 0, e = a.length, g = f(a);
            if (b)
                if (g)
                    for (; e > h && (d = c.apply(a[h], b),
                    !1 !== d); h++)
                        ;
                else
                    for (h in a) {
                        if (d = c.apply(a[h], b),
                        !1 === d)
                            break
                    }
            else if (g)
                for (; e > h && (d = c.call(a[h], h, a[h]),
                !1 !== d); h++)
                    ;
            else
                for (h in a)
                    if (d = c.call(a[h], h, a[h]),
                    !1 === d)
                        break;
            return a
        },
        trim: Ma && !Ma.call("\ufeff\u00a0") ? function(a) {
            return null == a ? "" : Ma.call(a)
        }
        : function(a) {
            return null == a ? "" : (a + "").replace(Eb, "")
        }
        ,
        makeArray: function(a, c) {
            var b = c || [];
            return null != a && (f(Object(a)) ? k.merge(b, "string" == typeof a ? [a] : a) : La.call(b, a)),
            b
        },
        inArray: function(a, c, b) {
            var d;
            if (c) {
                if (bb)
                    return bb.call(c, a, b);
                d = c.length;
                for (b = b ? 0 > b ? Math.max(0, d + b) : b : 0; d > b; b++)
                    if (b in c && c[b] === a)
                        return b
            }
            return -1
        },
        merge: function(a, c) {
            var b = c.length
              , d = a.length
              , h = 0;
            if ("number" == typeof b)
                for (; b > h; h++)
                    a[d++] = c[h];
            else
                for (; c[h] !== g; )
                    a[d++] = c[h++];
            return a.length = d,
            a
        },
        grep: function(a, c, b) {
            var d, h = [], e = 0, f = a.length;
            for (b = !!b; f > e; e++)
                d = !!c(a[e], e),
                b !== d && h.push(a[e]);
            return h
        },
        map: function(a, c, b) {
            var d, h = 0, e = a.length, g = [];
            if (f(a))
                for (; e > h; h++)
                    d = c(a[h], h, b),
                    null != d && (g[g.length] = d);
            else
                for (h in a)
                    d = c(a[h], h, b),
                    null != d && (g[g.length] = d);
            return ab.apply([], g)
        },
        guid: 1,
        proxy: function(a, c) {
            var b, d, h;
            return "string" == typeof c && (h = a[c],
            c = a,
            a = h),
            k.isFunction(a) ? (b = ka.call(arguments, 2),
            d = function() {
                return a.apply(c || this, b.concat(ka.call(arguments)))
            }
            ,
            d.guid = a.guid = a.guid || k.guid++,
            d) : g
        },
        access: function(a, c, b, d, h, e, f) {
            var m = 0
              , l = a.length
              , n = null == b;
            if ("object" === k.type(b))
                for (m in h = !0,
                b)
                    k.access(a, c, m, b[m], !0, e, f);
            else if (d !== g && (h = !0,
            k.isFunction(d) || (f = !0),
            n && (f ? (c.call(a, d),
            c = null) : (n = c,
            c = function(a, c, b) {
                return n.call(k(a), b)
            }
            )),
            c))
                for (; l > m; m++)
                    c(a[m], b, f ? d : d.call(a[m], m, c(a[m], b)));
            return h ? a : n ? c.call(a) : l ? c(a[0], b) : e
        },
        now: function() {
            return (new Date).getTime()
        },
        swap: function(a, c, b, d) {
            var h, e = {};
            for (h in c)
                e[h] = a.style[h],
                a.style[h] = c[h];
            b = b.apply(a, d || []);
            for (h in c)
                a.style[h] = e[h];
            return b
        }
    });
    k.ready.promise = function(c) {
        if (!ca)
            if (ca = k.Deferred(),
            "complete" === G.readyState)
                setTimeout(k.ready);
            else if (G.addEventListener)
                G.addEventListener("DOMContentLoaded", Z, !1),
                a.addEventListener("load", Z, !1);
            else {
                G.attachEvent("onreadystatechange", Z);
                a.attachEvent("onload", Z);
                var b = !1;
                try {
                    b = null == a.frameElement && G.documentElement
                } catch (d) {}
                b && b.doScroll && function Ea() {
                    if (!k.isReady) {
                        try {
                            b.doScroll("left")
                        } catch (a) {
                            return setTimeout(Ea, 50)
                        }
                        db();
                        k.ready()
                    }
                }()
            }
        return ca.promise(c)
    }
    ;
    k.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(a, c) {
        za["[object " + c + "]"] = c.toLowerCase()
    });
    U = k(G);
    (function(a, c) {
        function b(a, c, d, h) {
            var e, f, g, m, l;
            if ((c ? c.ownerDocument || c : V) !== J && N(c),
            c = c || J,
            d = d || [],
            !a || "string" != typeof a)
                return d;
            if (1 !== (m = c.nodeType) && 9 !== m)
                return [];
            if (R && !h) {
                if (e = wa.exec(a))
                    if (g = e[1])
                        if (9 === m) {
                            if (f = c.getElementById(g),
                            !f || !f.parentNode)
                                return d;
                            if (f.id === g)
                                return d.push(f),
                                d
                        } else {
                            if (c.ownerDocument && (f = c.ownerDocument.getElementById(g)) && W(c, f) && f.id === g)
                                return d.push(f),
                                d
                        }
                    else {
                        if (e[2])
                            return ra.apply(d, c.getElementsByTagName(a)),
                            d;
                        if ((g = e[3]) && y.getElementsByClassName && c.getElementsByClassName)
                            return ra.apply(d, c.getElementsByClassName(g)),
                            d
                    }
                if (y.qsa && (!K || !K.test(a))) {
                    if (f = e = O,
                    g = c,
                    l = 9 === m && a,
                    1 === m && "object" !== c.nodeName.toLowerCase()) {
                        m = p(a);
                        (e = c.getAttribute("id")) ? f = e.replace(za, "\\$&") : c.setAttribute("id", f);
                        f = "[id='" + f + "'] ";
                        for (g = m.length; g--; )
                            m[g] = f + r(m[g]);
                        g = Ba.test(a) && c.parentNode || c;
                        l = m.join(",")
                    }
                    if (l)
                        try {
                            return ra.apply(d, g.querySelectorAll(l)),
                            d
                        } catch (H) {} finally {
                            e || c.removeAttribute("id")
                        }
                }
            }
            var n;
            a: {
                a = a.replace(fa, "$1");
                var k, q;
                f = p(a);
                if (!h && 1 === f.length) {
                    if (n = f[0] = f[0].slice(0),
                    2 < n.length && "ID" === (k = n[0]).type && y.getById && 9 === c.nodeType && R && A.relative[n[1].type]) {
                        if (c = (A.find.ID(k.matches[0].replace(sa, ta), c) || [])[0],
                        !c) {
                            n = d;
                            break a
                        }
                        a = a.slice(n.shift().value.length)
                    }
                    for (m = ja.needsContext.test(a) ? 0 : n.length; m-- && (k = n[m],
                    !A.relative[e = k.type]); )
                        if ((q = A.find[e]) && (h = q(k.matches[0].replace(sa, ta), Ba.test(n[0].type) && c.parentNode || c))) {
                            if (n.splice(m, 1),
                            a = h.length && r(n),
                            !a) {
                                n = (ra.apply(d, h),
                                d);
                                break a
                            }
                            break
                        }
                }
                n = (D(a, f)(h, c, !R, d, Ba.test(a)),
                d)
            }
            return n
        }
        function d() {
            function a(b, d) {
                return c.push(b += " ") > A.cacheLength && delete a[c.shift()],
                a[b] = d
            }
            var c = [];
            return a
        }
        function h(a) {
            return a[O] = !0,
            a
        }
        function e(a) {
            var c = J.createElement("div");
            try {
                return !!a(c)
            } catch (b) {
                return !1
            } finally {
                c.parentNode && c.parentNode.removeChild(c)
            }
        }
        function f(a, c) {
            for (var b = a.split("|"), d = a.length; d--; )
                A.attrHandle[b[d]] = c
        }
        function g(a, c) {
            var b = c && a
              , d = b && 1 === a.nodeType && 1 === c.nodeType && (~c.sourceIndex || Ga) - (~a.sourceIndex || Ga);
            if (d)
                return d;
            if (b)
                for (; b = b.nextSibling; )
                    if (b === c)
                        return -1;
            return a ? 1 : -1
        }
        function m(a) {
            return function(c) {
                return "input" === c.nodeName.toLowerCase() && c.type === a
            }
        }
        function l(a) {
            return function(c) {
                var b = c.nodeName.toLowerCase();
                return ("input" === b || "button" === b) && c.type === a
            }
        }
        function n(a) {
            return h(function(c) {
                return c = +c,
                h(function(b, d) {
                    for (var h, e = a([], b.length, c), f = e.length; f--; )
                        b[h = e[f]] && (b[h] = !(d[h] = b[h]))
                })
            })
        }
        function q() {}
        function p(a, c) {
            var d, h, e, f, g, m, l;
            if (g = ca[a + " "])
                return c ? 0 : g.slice(0);
            g = a;
            m = [];
            for (l = A.preFilter; g; ) {
                d && !(h = pa.exec(g)) || (h && (g = g.slice(h[0].length) || g),
                m.push(e = []));
                d = !1;
                (h = Fa.exec(g)) && (d = h.shift(),
                e.push({
                    value: d,
                    type: h[0].replace(fa, " ")
                }),
                g = g.slice(d.length));
                for (f in A.filter)
                    !(h = ja[f].exec(g)) || l[f] && !(h = l[f](h)) || (d = h.shift(),
                    e.push({
                        value: d,
                        type: f,
                        matches: h
                    }),
                    g = g.slice(d.length));
                if (!d)
                    break
            }
            return c ? g.length : g ? b.error(a) : ca(a, m).slice(0)
        }
        function r(a) {
            for (var c = 0, b = a.length, d = ""; b > c; c++)
                d += a[c].value;
            return d
        }
        function s(a, c, b) {
            var d = c.dir
              , h = b && "parentNode" === d
              , e = Y++;
            return c.first ? function(c, b, e) {
                for (; c = c[d]; )
                    if (1 === c.nodeType || h)
                        return a(c, b, e)
            }
            : function(c, b, f) {
                var g, m, l, H = G + " " + e;
                if (f)
                    for (; c = c[d]; ) {
                        if ((1 === c.nodeType || h) && a(c, b, f))
                            return !0
                    }
                else
                    for (; c = c[d]; )
                        if (1 === c.nodeType || h)
                            if (l = c[O] || (c[O] = {}),
                            (m = l[d]) && m[0] === H) {
                                if (!0 === (g = m[1]) || g === E)
                                    return !0 === g
                            } else if (m = l[d] = [H],
                            m[1] = a(c, b, f) || E,
                            !0 === m[1])
                                return !0
            }
        }
        function v(a) {
            return 1 < a.length ? function(c, b, d) {
                for (var h = a.length; h--; )
                    if (!a[h](c, b, d))
                        return !1;
                return !0
            }
            : a[0]
        }
        function u(a, c, b, d, h) {
            for (var e, f = [], g = 0, m = a.length, l = null != c; m > g; g++)
                (e = a[g]) && (!b || b(e, d, h)) && (f.push(e),
                l && c.push(g));
            return f
        }
        function C(a, c, d, e, f, g) {
            return e && !e[O] && (e = C(e)),
            f && !f[O] && (f = C(f, g)),
            h(function(h, g, m, l) {
                var H, n, k = [], q = [], T = g.length, p;
                if (!(p = h)) {
                    p = c || "*";
                    for (var r = m.nodeType ? [m] : m, ea = [], s = 0, v = r.length; v > s; s++)
                        b(p, r[s], ea);
                    p = ea
                }
                p = !a || !h && c ? p : u(p, k, a, m, l);
                r = d ? f || (h ? a : T || e) ? [] : g : p;
                if (d && d(p, r, m, l),
                e)
                    for (H = u(r, q),
                    e(H, [], m, l),
                    m = H.length; m--; )
                        (n = H[m]) && (r[q[m]] = !(p[q[m]] = n));
                if (h) {
                    if (f || a) {
                        if (f) {
                            H = [];
                            for (m = r.length; m--; )
                                (n = r[m]) && H.push(p[m] = n);
                            f(null, r = [], H, l)
                        }
                        for (m = r.length; m--; )
                            (n = r[m]) && -1 < (H = f ? ba.call(h, n) : k[m]) && (h[H] = !(g[H] = n))
                    }
                } else
                    r = u(r === g ? r.splice(T, r.length) : r),
                    f ? f(null, g, r, l) : ra.apply(g, r)
            })
        }
        function x(a) {
            var c, b, d, h = a.length, e = A.relative[a[0].type];
            b = e || A.relative[" "];
            for (var f = e ? 1 : 0, g = s(function(a) {
                return a === c
            }, b, !0), m = s(function(a) {
                return -1 < ba.call(c, a)
            }, b, !0), l = [function(a, b, d) {
                return !e && (d || b !== L) || ((c = b).nodeType ? g(a, b, d) : m(a, b, d))
            }
            ]; h > f; f++)
                if (b = A.relative[a[f].type])
                    l = [s(v(l), b)];
                else {
                    if (b = A.filter[a[f].type].apply(null, a[f].matches),
                    b[O]) {
                        for (d = ++f; h > d && !A.relative[a[d].type]; d++)
                            ;
                        return C(1 < f && v(l), 1 < f && r(a.slice(0, f - 1).concat({
                            value: " " === a[f - 2].type ? "*" : ""
                        })).replace(fa, "$1"), b, d > f && x(a.slice(f, d)), h > d && x(a = a.slice(d)), h > d && r(a))
                    }
                    l.push(b)
                }
            return v(l)
        }
        function B(a, c) {
            var d = 0
              , e = 0 < c.length
              , f = 0 < a.length
              , g = function(h, g, m, l, H) {
                var n, k, q = [], T = 0, p = "0", r = h && [], ea = null != H, s = L, v = h || f && A.find.TAG("*", H && g.parentNode || g), Ea = G += null == s ? 1 : Math.random() || 0.1;
                for (ea && (L = g !== J && g,
                E = d); null != (H = v[p]); p++) {
                    if (f && H) {
                        for (n = 0; k = a[n++]; )
                            if (k(H, g, m)) {
                                l.push(H);
                                break
                            }
                        ea && (G = Ea,
                        E = ++d)
                    }
                    e && ((H = !k && H) && T--,
                    h && r.push(H))
                }
                if (T += p,
                e && p !== T) {
                    for (n = 0; k = c[n++]; )
                        k(r, q, g, m);
                    if (h) {
                        if (0 < T)
                            for (; p--; )
                                r[p] || q[p] || (q[p] = ma.call(l));
                        q = u(q)
                    }
                    ra.apply(l, q);
                    ea && !h && 0 < q.length && 1 < T + c.length && b.uniqueSort(l)
                }
                return ea && (G = Ea,
                L = s),
                r
            };
            return e ? h(g) : g
        }
        var w, y, E, A, Q, I, D, L, F, N, J, P, R, K, S, M, W, O = "sizzle" + -new Date, V = a.document, G = 0, Y = 0, ga = d(), ca = d(), U = d(), aa = !1, Aa = function(a, c) {
            return a === c ? (aa = !0,
            0) : 0
        }, X = typeof c, Ga = -2147483648, da = {}.hasOwnProperty, Z = [], ma = Z.pop, na = Z.push, ra = Z.push, ia = Z.slice, ba = Z.indexOf || function(a) {
            for (var c = 0, b = this.length; b > c; c++)
                if (this[c] === a)
                    return c;
            return -1
        }
        , ka = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+".replace("w", "w#"), la = "\\[[\\x20\\t\\r\\n\\f]*((?:\\\\.|[\\w-]|[^\\x00-\\xa0])+)[\\x20\\t\\r\\n\\f]*(?:([*^$|!~]?=)[\\x20\\t\\r\\n\\f]*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + ka + ")|)|)[\\x20\\t\\r\\n\\f]*\\]", ha = ":((?:\\\\.|[\\w-]|[^\\x00-\\xa0])+)(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + la.replace(3, 8) + ")*)|.*)\\)|)", fa = RegExp("^[\\x20\\t\\r\\n\\f]+|((?:^|[^\\\\])(?:\\\\.)*)[\\x20\\t\\r\\n\\f]+$", "g"), pa = /^[\x20\t\r\n\f]*,[\x20\t\r\n\f]*/, Fa = /^[\x20\t\r\n\f]*([>+~]|[\x20\t\r\n\f])[\x20\t\r\n\f]*/, Ba = /[\x20\t\r\n\f]*[+~]/, qa = RegExp("=[\\x20\\t\\r\\n\\f]*([^\\]'\"]*)[\\x20\\t\\r\\n\\f]*\\]", "g"), ua = RegExp(ha), va = RegExp("^" + ka + "$"), ja = {
            ID: /^#((?:\\.|[\w-]|[^\x00-\xa0])+)/,
            CLASS: /^\.((?:\\.|[\w-]|[^\x00-\xa0])+)/,
            TAG: RegExp("^(" + "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+".replace("w", "w*") + ")"),
            ATTR: RegExp("^" + la),
            PSEUDO: RegExp("^" + ha),
            CHILD: RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\([\\x20\\t\\r\\n\\f]*(even|odd|(([+-]|)(\\d*)n|)[\\x20\\t\\r\\n\\f]*(?:([+-]|)[\\x20\\t\\r\\n\\f]*(\\d+)|))[\\x20\\t\\r\\n\\f]*\\)|)", "i"),
            bool: RegExp("^(?:checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)$", "i"),
            needsContext: RegExp("^[\\x20\\t\\r\\n\\f]*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\([\\x20\\t\\r\\n\\f]*((?:-\\d)?\\d*)[\\x20\\t\\r\\n\\f]*\\)|)(?=[^-]|$)", "i")
        }, oa = /^[^{]+\{\s*\[native \w/, wa = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, xa = /^(?:input|select|textarea|button)$/i, ya = /^h\d$/i, za = /'|\\/g, sa = RegExp("\\\\([\\da-f]{1,6}[\\x20\\t\\r\\n\\f]?|([\\x20\\t\\r\\n\\f])|.)", "ig"), ta = function(a, c, b) {
            a = "0x" + c - 65536;
            return a !== a || b ? c : 0 > a ? String.fromCharCode(a + 65536) : String.fromCharCode(55296 | a >> 10, 56320 | 1023 & a)
        };
        try {
            ra.apply(Z = ia.call(V.childNodes), V.childNodes),
            Z[V.childNodes.length].nodeType
        } catch (Ca) {
            ra = {
                apply: Z.length ? function(a, c) {
                    na.apply(a, ia.call(c))
                }
                : function(a, c) {
                    for (var b = a.length, d = 0; a[b++] = c[d++]; )
                        ;
                    a.length = b - 1
                }
            }
        }
        I = b.isXML = function(a) {
            return (a = a && (a.ownerDocument || a).documentElement) ? "HTML" !== a.nodeName : !1
        }
        ;
        y = b.support = {};
        N = b.setDocument = function(a) {
            var b = a ? a.ownerDocument || a : V;
            a = b.defaultView;
            return b !== J && 9 === b.nodeType && b.documentElement ? (J = b,
            P = b.documentElement,
            R = !I(b),
            a && a.attachEvent && a !== a.top && a.attachEvent("onbeforeunload", function() {
                N()
            }),
            y.attributes = e(function(a) {
                return a.className = "i",
                !a.getAttribute("className")
            }),
            y.getElementsByTagName = e(function(a) {
                return a.appendChild(b.createComment("")),
                !a.getElementsByTagName("*").length
            }),
            y.getElementsByClassName = e(function(a) {
                return a.innerHTML = "<div class='a'></div><div class='a i'></div>",
                a.firstChild.className = "i",
                2 === a.getElementsByClassName("i").length
            }),
            y.getById = e(function(a) {
                return P.appendChild(a).id = O,
                !b.getElementsByName || !b.getElementsByName(O).length
            }),
            y.getById ? (A.find.ID = function(a, c) {
                if (typeof c.getElementById !== X && R) {
                    var b = c.getElementById(a);
                    return b && b.parentNode ? [b] : []
                }
            }
            ,
            A.filter.ID = function(a) {
                var c = a.replace(sa, ta);
                return function(a) {
                    return a.getAttribute("id") === c
                }
            }
            ) : (delete A.find.ID,
            A.filter.ID = function(a) {
                var c = a.replace(sa, ta);
                return function(a) {
                    return (a = typeof a.getAttributeNode !== X && a.getAttributeNode("id")) && a.value === c
                }
            }
            ),
            A.find.TAG = y.getElementsByTagName ? function(a, b) {
                return typeof b.getElementsByTagName !== X ? b.getElementsByTagName(a) : c
            }
            : function(a, c) {
                var b, d = [], h = 0, e = c.getElementsByTagName(a);
                if ("*" === a) {
                    for (; b = e[h++]; )
                        1 === b.nodeType && d.push(b);
                    return d
                }
                return e
            }
            ,
            A.find.CLASS = y.getElementsByClassName && function(a, b) {
                return typeof b.getElementsByClassName !== X && R ? b.getElementsByClassName(a) : c
            }
            ,
            S = [],
            K = [],
            (y.qsa = oa.test(b.querySelectorAll)) && (e(function(a) {
                a.innerHTML = "<select><option selected=''></option></select>";
                a.querySelectorAll("[selected]").length || K.push("\\[[\\x20\\t\\r\\n\\f]*(?:value|checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)");
                a.querySelectorAll(":checked").length || K.push(":checked")
            }),
            e(function(a) {
                var c = b.createElement("input");
                c.setAttribute("type", "hidden");
                a.appendChild(c).setAttribute("t", "");
                a.querySelectorAll("[t^='']").length && K.push("[*^$]=[\\x20\\t\\r\\n\\f]*(?:''|\"\")");
                a.querySelectorAll(":enabled").length || K.push(":enabled", ":disabled");
                a.querySelectorAll("*,:x");
                K.push(",.*:")
            })),
            (y.matchesSelector = oa.test(M = P.webkitMatchesSelector || P.mozMatchesSelector || P.oMatchesSelector || P.msMatchesSelector)) && e(function(a) {
                y.disconnectedMatch = M.call(a, "div");
                M.call(a, "[s!='']:x");
                S.push("!=", ha)
            }),
            K = K.length && RegExp(K.join("|")),
            S = S.length && RegExp(S.join("|")),
            W = oa.test(P.contains) || P.compareDocumentPosition ? function(a, c) {
                var b = 9 === a.nodeType ? a.documentElement : a
                  , d = c && c.parentNode;
                return a === d || !(!d || 1 !== d.nodeType || !(b.contains ? b.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)))
            }
            : function(a, c) {
                if (c)
                    for (; c = c.parentNode; )
                        if (c === a)
                            return !0;
                return !1
            }
            ,
            Aa = P.compareDocumentPosition ? function(a, c) {
                if (a === c)
                    return aa = !0,
                    0;
                var d = c.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition(c);
                return d ? 1 & d || !y.sortDetached && c.compareDocumentPosition(a) === d ? a === b || W(V, a) ? -1 : c === b || W(V, c) ? 1 : F ? ba.call(F, a) - ba.call(F, c) : 0 : 4 & d ? -1 : 1 : a.compareDocumentPosition ? -1 : 1
            }
            : function(a, c) {
                var d, h = 0;
                d = a.parentNode;
                var e = c.parentNode
                  , f = [a]
                  , m = [c];
                if (a === c)
                    return aa = !0,
                    0;
                if (!d || !e)
                    return a === b ? -1 : c === b ? 1 : d ? -1 : e ? 1 : F ? ba.call(F, a) - ba.call(F, c) : 0;
                if (d === e)
                    return g(a, c);
                for (d = a; d = d.parentNode; )
                    f.unshift(d);
                for (d = c; d = d.parentNode; )
                    m.unshift(d);
                for (; f[h] === m[h]; )
                    h++;
                return h ? g(f[h], m[h]) : f[h] === V ? -1 : m[h] === V ? 1 : 0
            }
            ,
            b) : J
        }
        ;
        b.matches = function(a, c) {
            return b(a, null, null, c)
        }
        ;
        b.matchesSelector = function(a, c) {
            if ((a.ownerDocument || a) !== J && N(a),
            c = c.replace(qa, "='$1']"),
            y.matchesSelector && R && !(S && S.test(c) || K && K.test(c)))
                try {
                    var d = M.call(a, c);
                    if (d || y.disconnectedMatch || a.document && 11 !== a.document.nodeType)
                        return d
                } catch (h) {}
            return 0 < b(c, J, null, [a]).length
        }
        ;
        b.contains = function(a, c) {
            return (a.ownerDocument || a) !== J && N(a),
            W(a, c)
        }
        ;
        b.attr = function(a, b) {
            (a.ownerDocument || a) !== J && N(a);
            var d = A.attrHandle[b.toLowerCase()]
              , d = d && da.call(A.attrHandle, b.toLowerCase()) ? d(a, b, !R) : c;
            return d === c ? y.attributes || !R ? a.getAttribute(b) : (d = a.getAttributeNode(b)) && d.specified ? d.value : null : d
        }
        ;
        b.error = function(a) {
            throw Error("Syntax error, unrecognized expression: " + a);
        }
        ;
        b.uniqueSort = function(a) {
            var c, b = [], d = 0, h = 0;
            if (aa = !y.detectDuplicates,
            F = !y.sortStable && a.slice(0),
            a.sort(Aa),
            aa) {
                for (; c = a[h++]; )
                    c === a[h] && (d = b.push(h));
                for (; d--; )
                    a.splice(b[d], 1)
            }
            return a
        }
        ;
        Q = b.getText = function(a) {
            var c, b = "", d = 0;
            if (c = a.nodeType)
                if (1 === c || 9 === c || 11 === c) {
                    if ("string" == typeof a.textContent)
                        return a.textContent;
                    for (a = a.firstChild; a; a = a.nextSibling)
                        b += Q(a)
                } else {
                    if (3 === c || 4 === c)
                        return a.nodeValue
                }
            else
                for (; c = a[d]; d++)
                    b += Q(c);
            return b
        }
        ;
        A = b.selectors = {
            cacheLength: 50,
            createPseudo: h,
            match: ja,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(a) {
                    return a[1] = a[1].replace(sa, ta),
                    a[3] = (a[4] || a[5] || "").replace(sa, ta),
                    "~=" === a[2] && (a[3] = " " + a[3] + " "),
                    a.slice(0, 4)
                },
                CHILD: function(a) {
                    return a[1] = a[1].toLowerCase(),
                    "nth" === a[1].slice(0, 3) ? (a[3] || b.error(a[0]),
                    a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])),
                    a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && b.error(a[0]),
                    a
                },
                PSEUDO: function(a) {
                    var b, d = !a[5] && a[2];
                    return ja.CHILD.test(a[0]) ? null : (a[3] && a[4] !== c ? a[2] = a[4] : d && ua.test(d) && (b = p(d, !0)) && (b = d.indexOf(")", d.length - b) - d.length) && (a[0] = a[0].slice(0, b),
                    a[2] = d.slice(0, b)),
                    a.slice(0, 3))
                }
            },
            filter: {
                TAG: function(a) {
                    var c = a.replace(sa, ta).toLowerCase();
                    return "*" === a ? function() {
                        return !0
                    }
                    : function(a) {
                        return a.nodeName && a.nodeName.toLowerCase() === c
                    }
                },
                CLASS: function(a) {
                    var c = ga[a + " "];
                    return c || (c = RegExp("(^|[\\x20\\t\\r\\n\\f])" + a + "([\\x20\\t\\r\\n\\f]|$)")) && ga(a, function(a) {
                        return c.test("string" == typeof a.className && a.className || typeof a.getAttribute !== X && a.getAttribute("class") || "")
                    })
                },
                ATTR: function(a, c, d) {
                    return function(h) {
                        h = b.attr(h, a);
                        return null == h ? "!=" === c : c ? (h += "",
                        "=" === c ? h === d : "!=" === c ? h !== d : "^=" === c ? d && 0 === h.indexOf(d) : "*=" === c ? d && -1 < h.indexOf(d) : "$=" === c ? d && h.slice(-d.length) === d : "~=" === c ? -1 < (" " + h + " ").indexOf(d) : "|=" === c ? h === d || h.slice(0, d.length + 1) === d + "-" : !1) : !0
                    }
                },
                CHILD: function(a, c, b, d, h) {
                    var e = "nth" !== a.slice(0, 3)
                      , f = "last" !== a.slice(-4)
                      , g = "of-type" === c;
                    return 1 === d && 0 === h ? function(a) {
                        return !!a.parentNode
                    }
                    : function(c, b, m) {
                        var l, H, n, k, q;
                        b = e !== f ? "nextSibling" : "previousSibling";
                        var T = c.parentNode
                          , Da = g && c.nodeName.toLowerCase();
                        m = !m && !g;
                        if (T) {
                            if (e) {
                                for (; b; ) {
                                    for (H = c; H = H[b]; )
                                        if (g ? H.nodeName.toLowerCase() === Da : 1 === H.nodeType)
                                            return !1;
                                    q = b = "only" === a && !q && "nextSibling"
                                }
                                return !0
                            }
                            if (q = [f ? T.firstChild : T.lastChild],
                            f && m)
                                for (m = T[O] || (T[O] = {}),
                                l = m[a] || [],
                                k = l[0] === G && l[1],
                                n = l[0] === G && l[2],
                                H = k && T.childNodes[k]; H = ++k && H && H[b] || (n = k = 0) || q.pop(); ) {
                                    if (1 === H.nodeType && ++n && H === c) {
                                        m[a] = [G, k, n];
                                        break
                                    }
                                }
                            else if (m && (l = (c[O] || (c[O] = {}))[a]) && l[0] === G)
                                n = l[1];
                            else
                                for (; (H = ++k && H && H[b] || (n = k = 0) || q.pop()) && ((g ? H.nodeName.toLowerCase() !== Da : 1 !== H.nodeType) || !++n || (m && ((H[O] || (H[O] = {}))[a] = [G, n]),
                                H !== c)); )
                                    ;
                            return n -= h,
                            n === d || 0 === n % d && 0 <= n / d
                        }
                    }
                },
                PSEUDO: function(a, c) {
                    var d, e = A.pseudos[a] || A.setFilters[a.toLowerCase()] || b.error("unsupported pseudo: " + a);
                    return e[O] ? e(c) : 1 < e.length ? (d = [a, a, "", c],
                    A.setFilters.hasOwnProperty(a.toLowerCase()) ? h(function(a, b) {
                        for (var d, h = e(a, c), f = h.length; f--; )
                            d = ba.call(a, h[f]),
                            a[d] = !(b[d] = h[f])
                    }) : function(a) {
                        return e(a, 0, d)
                    }
                    ) : e
                }
            },
            pseudos: {
                not: h(function(a) {
                    var c = []
                      , b = []
                      , d = D(a.replace(fa, "$1"));
                    return d[O] ? h(function(a, c, b, h) {
                        var e;
                        b = d(a, null, h, []);
                        for (h = a.length; h--; )
                            (e = b[h]) && (a[h] = !(c[h] = e))
                    }) : function(a, h, e) {
                        return c[0] = a,
                        d(c, null, e, b),
                        !b.pop()
                    }
                }),
                has: h(function(a) {
                    return function(c) {
                        return 0 < b(a, c).length
                    }
                }),
                contains: h(function(a) {
                    return function(c) {
                        return -1 < (c.textContent || c.innerText || Q(c)).indexOf(a)
                    }
                }),
                lang: h(function(a) {
                    return va.test(a || "") || b.error("unsupported lang: " + a),
                    a = a.replace(sa, ta).toLowerCase(),
                    function(c) {
                        var b;
                        do
                            if (b = R ? c.lang : c.getAttribute("xml:lang") || c.getAttribute("lang"))
                                return b = b.toLowerCase(),
                                b === a || 0 === b.indexOf(a + "-");
                        while ((c = c.parentNode) && 1 === c.nodeType);return !1
                    }
                }),
                target: function(c) {
                    var b = a.location && a.location.hash;
                    return b && b.slice(1) === c.id
                },
                root: function(a) {
                    return a === P
                },
                focus: function(a) {
                    return a === J.activeElement && (!J.hasFocus || J.hasFocus()) && !!(a.type || a.href || ~a.tabIndex)
                },
                enabled: function(a) {
                    return !1 === a.disabled
                },
                disabled: function(a) {
                    return !0 === a.disabled
                },
                checked: function(a) {
                    var c = a.nodeName.toLowerCase();
                    return "input" === c && !!a.checked || "option" === c && !!a.selected
                },
                selected: function(a) {
                    return a.parentNode && a.parentNode.selectedIndex,
                    !0 === a.selected
                },
                empty: function(a) {
                    for (a = a.firstChild; a; a = a.nextSibling)
                        if ("@" < a.nodeName || 3 === a.nodeType || 4 === a.nodeType)
                            return !1;
                    return !0
                },
                parent: function(a) {
                    return !A.pseudos.empty(a)
                },
                header: function(a) {
                    return ya.test(a.nodeName)
                },
                input: function(a) {
                    return xa.test(a.nodeName)
                },
                button: function(a) {
                    var c = a.nodeName.toLowerCase();
                    return "input" === c && "button" === a.type || "button" === c
                },
                text: function(a) {
                    var c;
                    return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (c = a.getAttribute("type")) || c.toLowerCase() === a.type)
                },
                first: n(function() {
                    return [0]
                }),
                last: n(function(a, c) {
                    return [c - 1]
                }),
                eq: n(function(a, c, b) {
                    return [0 > b ? b + c : b]
                }),
                even: n(function(a, c) {
                    for (var b = 0; c > b; b += 2)
                        a.push(b);
                    return a
                }),
                odd: n(function(a, c) {
                    for (var b = 1; c > b; b += 2)
                        a.push(b);
                    return a
                }),
                lt: n(function(a, c, b) {
                    for (c = 0 > b ? b + c : b; 0 <= --c; )
                        a.push(c);
                    return a
                }),
                gt: n(function(a, c, b) {
                    for (b = 0 > b ? b + c : b; c > ++b; )
                        a.push(b);
                    return a
                })
            }
        };
        A.pseudos.nth = A.pseudos.eq;
        for (w in {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        })
            A.pseudos[w] = m(w);
        for (w in {
            submit: !0,
            reset: !0
        })
            A.pseudos[w] = l(w);
        q.prototype = A.filters = A.pseudos;
        A.setFilters = new q;
        D = b.compile = function(a, c) {
            var b, d = [], h = [], e = U[a + " "];
            if (!e) {
                c || (c = p(a));
                for (b = c.length; b--; )
                    e = x(c[b]),
                    e[O] ? d.push(e) : h.push(e);
                e = U(a, B(h, d))
            }
            return e
        }
        ;
        y.sortStable = O.split("").sort(Aa).join("") === O;
        y.detectDuplicates = aa;
        N();
        y.sortDetached = e(function(a) {
            return 1 & a.compareDocumentPosition(J.createElement("div"))
        });
        e(function(a) {
            return a.innerHTML = "<a href='#'></a>",
            "#" === a.firstChild.getAttribute("href")
        }) || f("type|href|height|width", function(a, b, d) {
            return d ? c : a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2)
        });
        y.attributes && e(function(a) {
            return a.innerHTML = "<input/>",
            a.firstChild.setAttribute("value", ""),
            "" === a.firstChild.getAttribute("value")
        }) || f("value", function(a, b, d) {
            return d || "input" !== a.nodeName.toLowerCase() ? c : a.defaultValue
        });
        e(function(a) {
            return null == a.getAttribute("disabled")
        }) || f("checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", function(a, b, d) {
            var h;
            return d ? c : (h = a.getAttributeNode(b)) && h.specified ? h.value : !0 === a[b] ? b.toLowerCase() : null
        });
        k.find = b;
        k.expr = b.selectors;
        k.expr[":"] = k.expr.pseudos;
        k.unique = b.uniqueSort;
        k.text = b.getText;
        k.isXMLDoc = b.isXML;
        k.contains = b.contains
    }
    )(a);
    var Xa = {};
    k.Callbacks = function(a) {
        a = "string" == typeof a ? Xa[a] || e(a) : k.extend({}, a);
        var c, b, d, h, f, m, l = [], n = !a.once && [], q = function(e) {
            b = a.memory && e;
            d = !0;
            f = m || 0;
            m = 0;
            h = l.length;
            for (c = !0; l && h > f; f++)
                if (!1 === l[f].apply(e[0], e[1]) && a.stopOnFalse) {
                    b = !1;
                    break
                }
            c = !1;
            l && (n ? n.length && q(n.shift()) : b ? l = [] : p.disable())
        }, p = {
            add: function() {
                if (l) {
                    var d = l.length;
                    (function Nb(c) {
                        k.each(c, function(c, b) {
                            var d = k.type(b);
                            "function" === d ? a.unique && p.has(b) || l.push(b) : b && b.length && "string" !== d && Nb(b)
                        })
                    }
                    )(arguments);
                    c ? h = l.length : b && (m = d,
                    q(b))
                }
                return this
            },
            remove: function() {
                return l && k.each(arguments, function(a, b) {
                    for (var d; -1 < (d = k.inArray(b, l, d)); )
                        l.splice(d, 1),
                        c && (h >= d && h--,
                        f >= d && f--)
                }),
                this
            },
            has: function(a) {
                return a ? -1 < k.inArray(a, l) : !(!l || !l.length)
            },
            empty: function() {
                return l = [],
                h = 0,
                this
            },
            disable: function() {
                return l = n = b = g,
                this
            },
            disabled: function() {
                return !l
            },
            lock: function() {
                return n = g,
                b || p.disable(),
                this
            },
            locked: function() {
                return !n
            },
            fireWith: function(a, b) {
                return !l || d && !n || (b = b || [],
                b = [a, b.slice ? b.slice() : b],
                c ? n.push(b) : q(b)),
                this
            },
            fire: function() {
                return p.fireWith(this, arguments),
                this
            },
            fired: function() {
                return !!d
            }
        };
        return p
    }
    ;
    k.extend({
        Deferred: function(a) {
            var c = [["resolve", "done", k.Callbacks("once memory"), "resolved"], ["reject", "fail", k.Callbacks("once memory"), "rejected"], ["notify", "progress", k.Callbacks("memory")]]
              , b = "pending"
              , d = {
                state: function() {
                    return b
                },
                always: function() {
                    return h.done(arguments).fail(arguments),
                    this
                },
                then: function() {
                    var a = arguments;
                    return k.Deferred(function(b) {
                        k.each(c, function(c, e) {
                            var f = e[0]
                              , g = k.isFunction(a[c]) && a[c];
                            h[e[1]](function() {
                                var a = g && g.apply(this, arguments);
                                a && k.isFunction(a.promise) ? a.promise().done(b.resolve).fail(b.reject).progress(b.notify) : b[f + "With"](this === d ? b.promise() : this, g ? [a] : arguments)
                            })
                        });
                        a = null
                    }).promise()
                },
                promise: function(a) {
                    return null != a ? k.extend(a, d) : d
                }
            }
              , h = {};
            return d.pipe = d.then,
            k.each(c, function(a, e) {
                var f = e[2]
                  , g = e[3];
                d[e[1]] = f.add;
                g && f.add(function() {
                    b = g
                }, c[1 ^ a][2].disable, c[2][2].lock);
                h[e[0]] = function() {
                    return h[e[0] + "With"](this === h ? d : this, arguments),
                    this
                }
                ;
                h[e[0] + "With"] = f.fireWith
            }),
            d.promise(h),
            a && a.call(h, h),
            h
        },
        when: function(a) {
            var c = 0, b = ka.call(arguments), d = b.length, h = 1 !== d || a && k.isFunction(a.promise) ? d : 0, e = 1 === h ? a : k.Deferred(), f = function(a, c, b) {
                return function(d) {
                    c[a] = this;
                    b[a] = 1 < arguments.length ? ka.call(arguments) : d;
                    b === g ? e.notifyWith(c, b) : --h || e.resolveWith(c, b)
                }
            }, g, m, l;
            if (1 < d)
                for (g = Array(d),
                m = Array(d),
                l = Array(d); d > c; c++)
                    b[c] && k.isFunction(b[c].promise) ? b[c].promise().done(f(c, l, b)).fail(e.reject).progress(f(c, m, g)) : --h;
            return h || e.resolveWith(l, b),
            e.promise()
        }
    });
    k.support = function(c) {
        var b, d, h, e, f, g, m = G.createElement("div");
        if (m.setAttribute("className", "t"),
        m.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",
        b = m.getElementsByTagName("*") || [],
        d = m.getElementsByTagName("a")[0],
        !d || !d.style || !b.length)
            return c;
        h = G.createElement("select");
        e = h.appendChild(G.createElement("option"));
        b = m.getElementsByTagName("input")[0];
        d.style.cssText = "top:1px;float:left;opacity:.5";
        c.getSetAttribute = "t" !== m.className;
        c.leadingWhitespace = 3 === m.firstChild.nodeType;
        c.tbody = !m.getElementsByTagName("tbody").length;
        c.htmlSerialize = !!m.getElementsByTagName("link").length;
        c.style = /top/.test(d.getAttribute("style"));
        c.hrefNormalized = "/a" === d.getAttribute("href");
        c.opacity = /^0.5/.test(d.style.opacity);
        c.cssFloat = !!d.style.cssFloat;
        c.checkOn = !!b.value;
        c.optSelected = e.selected;
        c.enctype = !!G.createElement("form").enctype;
        c.html5Clone = "<:nav></:nav>" !== G.createElement("nav").cloneNode(!0).outerHTML;
        c.inlineBlockNeedsLayout = !1;
        c.shrinkWrapBlocks = !1;
        c.pixelPosition = !1;
        c.deleteExpando = !0;
        c.noCloneEvent = !0;
        c.reliableMarginRight = !0;
        c.boxSizingReliable = !0;
        b.checked = !0;
        c.noCloneChecked = b.cloneNode(!0).checked;
        h.disabled = !0;
        c.optDisabled = !e.disabled;
        try {
            delete m.test
        } catch (l) {
            c.deleteExpando = !1
        }
        b = G.createElement("input");
        b.setAttribute("value", "");
        c.input = "" === b.getAttribute("value");
        b.value = "t";
        b.setAttribute("type", "radio");
        c.radioValue = "t" === b.value;
        b.setAttribute("checked", "t");
        b.setAttribute("name", "t");
        d = G.createDocumentFragment();
        d.appendChild(b);
        c.appendChecked = b.checked;
        c.checkClone = d.cloneNode(!0).cloneNode(!0).lastChild.checked;
        m.attachEvent && (m.attachEvent("onclick", function() {
            c.noCloneEvent = !1
        }),
        m.cloneNode(!0).click());
        for (g in {
            submit: !0,
            change: !0,
            focusin: !0
        })
            m.setAttribute(d = "on" + g, "t"),
            c[g + "Bubbles"] = d in a || !1 === m.attributes[d].expando;
        m.style.backgroundClip = "content-box";
        m.cloneNode(!0).style.backgroundClip = "";
        c.clearCloneStyle = "content-box" === m.style.backgroundClip;
        for (g in k(c))
            break;
        return c.ownLast = "0" !== g,
        k(function() {
            var b, d, h, e = G.getElementsByTagName("body")[0];
            e && (b = G.createElement("div"),
            b.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px",
            e.appendChild(b).appendChild(m),
            m.innerHTML = "<table><tr><td></td><td>t</td></tr></table>",
            h = m.getElementsByTagName("td"),
            h[0].style.cssText = "padding:0;margin:0;border:0;display:none",
            f = 0 === h[0].offsetHeight,
            h[0].style.display = "",
            h[1].style.display = "none",
            c.reliableHiddenOffsets = f && 0 === h[0].offsetHeight,
            m.innerHTML = "",
            m.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;",
            k.swap(e, null != e.style.zoom ? {
                zoom: 1
            } : {}, function() {
                c.boxSizing = 4 === m.offsetWidth
            }),
            a.getComputedStyle && (c.pixelPosition = "1%" !== (a.getComputedStyle(m, null) || {}).top,
            c.boxSizingReliable = "4px" === (a.getComputedStyle(m, null) || {
                width: "4px"
            }).width,
            d = m.appendChild(G.createElement("div")),
            d.style.cssText = m.style.cssText = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
            d.style.marginRight = d.style.width = "0",
            m.style.width = "1px",
            c.reliableMarginRight = !parseFloat((a.getComputedStyle(d, null) || {}).marginRight)),
            typeof m.style.zoom !== aa && (m.innerHTML = "",
            m.style.cssText = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;width:1px;padding:1px;display:inline;zoom:1",
            c.inlineBlockNeedsLayout = 3 === m.offsetWidth,
            m.style.display = "block",
            m.innerHTML = "<div></div>",
            m.firstChild.style.width = "5px",
            c.shrinkWrapBlocks = 3 !== m.offsetWidth,
            c.inlineBlockNeedsLayout && (e.style.zoom = 1)),
            e.removeChild(b),
            b = m = h = d = null)
        }),
        b = h = d = e = d = b = null,
        c
    }({});
    var yb = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/
      , xb = /([A-Z])/g;
    k.extend({
        cache: {},
        noData: {
            applet: !0,
            embed: !0,
            object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        },
        hasData: function(a) {
            return a = a.nodeType ? k.cache[a[k.expando]] : a[k.expando],
            !!a && !h(a)
        },
        data: function(a, c, b) {
            return d(a, c, b)
        },
        removeData: function(a, c) {
            return b(a, c)
        },
        _data: function(a, c, b) {
            return d(a, c, b, !0)
        },
        _removeData: function(a, c) {
            return b(a, c, !0)
        },
        acceptData: function(a) {
            if (a.nodeType && 1 !== a.nodeType && 9 !== a.nodeType)
                return !1;
            var c = a.nodeName && k.noData[a.nodeName.toLowerCase()];
            return !c || !0 !== c && a.getAttribute("classid") === c
        }
    });
    k.fn.extend({
        data: function(a, b) {
            var d, h, e = null, f = 0, m = this[0];
            if (a === g) {
                if (this.length && (e = k.data(m),
                1 === m.nodeType && !k._data(m, "parsedAttrs"))) {
                    for (d = m.attributes; d.length > f; f++)
                        h = d[f].name,
                        0 === h.indexOf("data-") && (h = k.camelCase(h.slice(5)),
                        c(m, h, e[h]));
                    k._data(m, "parsedAttrs", !0)
                }
                return e
            }
            return "object" == typeof a ? this.each(function() {
                k.data(this, a)
            }) : 1 < arguments.length ? this.each(function() {
                k.data(this, a, b)
            }) : m ? c(m, a, k.data(m, a)) : null
        },
        removeData: function(a) {
            return this.each(function() {
                k.removeData(this, a)
            })
        }
    });
    k.extend({
        queue: function(a, c, b) {
            var d;
            return a ? (c = (c || "fx") + "queue",
            d = k._data(a, c),
            b && (!d || k.isArray(b) ? d = k._data(a, c, k.makeArray(b)) : d.push(b)),
            d || []) : g
        },
        dequeue: function(a, c) {
            c = c || "fx";
            var b = k.queue(a, c)
              , d = b.length
              , h = b.shift()
              , e = k._queueHooks(a, c)
              , f = function() {
                k.dequeue(a, c)
            };
            "inprogress" === h && (h = b.shift(),
            d--);
            h && ("fx" === c && b.unshift("inprogress"),
            delete e.stop,
            h.call(a, f, e));
            !d && e && e.empty.fire()
        },
        _queueHooks: function(a, c) {
            var b = c + "queueHooks";
            return k._data(a, b) || k._data(a, b, {
                empty: k.Callbacks("once memory").add(function() {
                    k._removeData(a, c + "queue");
                    k._removeData(a, b)
                })
            })
        }
    });
    k.fn.extend({
        queue: function(a, c) {
            var b = 2;
            return "string" != typeof a && (c = a,
            a = "fx",
            b--),
            b > arguments.length ? k.queue(this[0], a) : c === g ? this : this.each(function() {
                var b = k.queue(this, a, c);
                k._queueHooks(this, a);
                "fx" === a && "inprogress" !== b[0] && k.dequeue(this, a)
            })
        },
        dequeue: function(a) {
            return this.each(function() {
                k.dequeue(this, a)
            })
        },
        delay: function(a, c) {
            return a = k.fx ? k.fx.speeds[a] || a : a,
            c = c || "fx",
            this.queue(c, function(c, b) {
                var d = setTimeout(c, a);
                b.stop = function() {
                    clearTimeout(d)
                }
            })
        },
        clearQueue: function(a) {
            return this.queue(a || "fx", [])
        },
        promise: function(a, c) {
            var b, d = 1, h = k.Deferred(), e = this, f = this.length, m = function() {
                --d || h.resolveWith(e, [e])
            };
            "string" != typeof a && (c = a,
            a = g);
            for (a = a || "fx"; f--; )
                (b = k._data(e[f], a + "queueHooks")) && b.empty && (d++,
                b.empty.add(m));
            return m(),
            h.promise(c)
        }
    });
    var ua, eb, Na = /[\t\r\n\f]/g, Ob = /\r/g, Pb = /^(?:input|select|textarea|button|object)$/i, Qb = /^(?:a|area)$/i, Oa = /^(?:checked|selected)$/i, la = k.support.getSetAttribute, Ha = k.support.input;
    k.fn.extend({
        attr: function(a, c) {
            return k.access(this, k.attr, a, c, 1 < arguments.length)
        },
        removeAttr: function(a) {
            return this.each(function() {
                k.removeAttr(this, a)
            })
        },
        prop: function(a, c) {
            return k.access(this, k.prop, a, c, 1 < arguments.length)
        },
        removeProp: function(a) {
            return a = k.propFix[a] || a,
            this.each(function() {
                try {
                    this[a] = g,
                    delete this[a]
                } catch (c) {}
            })
        },
        addClass: function(a) {
            var c, b, d, h, e, f = 0, g = this.length;
            c = "string" == typeof a && a;
            if (k.isFunction(a))
                return this.each(function(c) {
                    k(this).addClass(a.call(this, c, this.className))
                });
            if (c)
                for (c = (a || "").match(da) || []; g > f; f++)
                    if (b = this[f],
                    d = 1 === b.nodeType && (b.className ? (" " + b.className + " ").replace(Na, " ") : " ")) {
                        for (e = 0; h = c[e++]; )
                            0 > d.indexOf(" " + h + " ") && (d += h + " ");
                        b.className = k.trim(d)
                    }
            return this
        },
        removeClass: function(a) {
            var c, b, d, h, e, f = 0, g = this.length;
            c = 0 === arguments.length || "string" == typeof a && a;
            if (k.isFunction(a))
                return this.each(function(c) {
                    k(this).removeClass(a.call(this, c, this.className))
                });
            if (c)
                for (c = (a || "").match(da) || []; g > f; f++)
                    if (b = this[f],
                    d = 1 === b.nodeType && (b.className ? (" " + b.className + " ").replace(Na, " ") : "")) {
                        for (e = 0; h = c[e++]; )
                            for (; 0 <= d.indexOf(" " + h + " "); )
                                d = d.replace(" " + h + " ", " ");
                        b.className = a ? k.trim(d) : ""
                    }
            return this
        },
        toggleClass: function(a, c) {
            var b = typeof a;
            return "boolean" == typeof c && "string" === b ? c ? this.addClass(a) : this.removeClass(a) : k.isFunction(a) ? this.each(function(b) {
                k(this).toggleClass(a.call(this, b, this.className, c), c)
            }) : this.each(function() {
                if ("string" === b)
                    for (var c, d = 0, h = k(this), e = a.match(da) || []; c = e[d++]; )
                        h.hasClass(c) ? h.removeClass(c) : h.addClass(c);
                else
                    (b === aa || "boolean" === b) && (this.className && k._data(this, "__className__", this.className),
                    this.className = this.className || !1 === a ? "" : k._data(this, "__className__") || "")
            })
        },
        hasClass: function(a) {
            a = " " + a + " ";
            for (var c = 0, b = this.length; b > c; c++)
                if (1 === this[c].nodeType && 0 <= (" " + this[c].className + " ").replace(Na, " ").indexOf(a))
                    return !0;
            return !1
        },
        val: function(a) {
            var c, b, d, h = this[0];
            if (arguments.length)
                return d = k.isFunction(a),
                this.each(function(c) {
                    var h;
                    1 === this.nodeType && (h = d ? a.call(this, c, k(this).val()) : a,
                    null == h ? h = "" : "number" == typeof h ? h += "" : k.isArray(h) && (h = k.map(h, function(a) {
                        return null == a ? "" : a + ""
                    })),
                    b = k.valHooks[this.type] || k.valHooks[this.nodeName.toLowerCase()],
                    b && "set"in b && b.set(this, h, "value") !== g || (this.value = h))
                });
            if (h)
                return b = k.valHooks[h.type] || k.valHooks[h.nodeName.toLowerCase()],
                b && "get"in b && (c = b.get(h, "value")) !== g ? c : (c = h.value,
                "string" == typeof c ? c.replace(Ob, "") : null == c ? "" : c)
        }
    });
    k.extend({
        valHooks: {
            option: {
                get: function(a) {
                    var c = k.find.attr(a, "value");
                    return null != c ? c : a.text
                }
            },
            select: {
                get: function(a) {
                    for (var c, b = a.options, d = a.selectedIndex, h = "select-one" === a.type || 0 > d, e = h ? null : [], f = h ? d + 1 : b.length, g = 0 > d ? f : h ? d : 0; f > g; g++)
                        if (c = b[g],
                        !(!c.selected && g !== d || (k.support.optDisabled ? c.disabled : null !== c.getAttribute("disabled")) || c.parentNode.disabled && k.nodeName(c.parentNode, "optgroup"))) {
                            if (a = k(c).val(),
                            h)
                                return a;
                            e.push(a)
                        }
                    return e
                },
                set: function(a, c) {
                    for (var b, d, h = a.options, e = k.makeArray(c), f = h.length; f--; )
                        d = h[f],
                        (d.selected = 0 <= k.inArray(k(d).val(), e)) && (b = !0);
                    return b || (a.selectedIndex = -1),
                    e
                }
            }
        },
        attr: function(a, c, b) {
            var d, h, e = a.nodeType;
            if (a && 3 !== e && 8 !== e && 2 !== e)
                return typeof a.getAttribute === aa ? k.prop(a, c, b) : (1 === e && k.isXMLDoc(a) || (c = c.toLowerCase(),
                d = k.attrHooks[c] || (k.expr.match.bool.test(c) ? eb : ua)),
                b === g ? d && "get"in d && null !== (h = d.get(a, c)) ? h : (h = k.find.attr(a, c),
                null == h ? g : h) : null !== b ? d && "set"in d && (h = d.set(a, b, c)) !== g ? h : (a.setAttribute(c, b + ""),
                b) : (k.removeAttr(a, c),
                g))
        },
        removeAttr: function(a, c) {
            var b, d, h = 0, e = c && c.match(da);
            if (e && 1 === a.nodeType)
                for (; b = e[h++]; )
                    d = k.propFix[b] || b,
                    k.expr.match.bool.test(b) ? Ha && la || !Oa.test(b) ? a[d] = !1 : a[k.camelCase("default-" + b)] = a[d] = !1 : k.attr(a, b, ""),
                    a.removeAttribute(la ? b : d)
        },
        attrHooks: {
            type: {
                set: function(a, c) {
                    if (!k.support.radioValue && "radio" === c && k.nodeName(a, "input")) {
                        var b = a.value;
                        return a.setAttribute("type", c),
                        b && (a.value = b),
                        c
                    }
                }
            }
        },
        propFix: {
            "for": "htmlFor",
            "class": "className"
        },
        prop: function(a, c, b) {
            var d, h, e, f = a.nodeType;
            if (a && 3 !== f && 8 !== f && 2 !== f)
                return e = 1 !== f || !k.isXMLDoc(a),
                e && (c = k.propFix[c] || c,
                h = k.propHooks[c]),
                b !== g ? h && "set"in h && (d = h.set(a, b, c)) !== g ? d : a[c] = b : h && "get"in h && null !== (d = h.get(a, c)) ? d : a[c]
        },
        propHooks: {
            tabIndex: {
                get: function(a) {
                    var c = k.find.attr(a, "tabindex");
                    return c ? parseInt(c, 10) : Pb.test(a.nodeName) || Qb.test(a.nodeName) && a.href ? 0 : -1
                }
            }
        }
    });
    eb = {
        set: function(a, c, b) {
            return !1 === c ? k.removeAttr(a, b) : Ha && la || !Oa.test(b) ? a.setAttribute(!la && k.propFix[b] || b, b) : a[k.camelCase("default-" + b)] = a[b] = !0,
            b
        }
    };
    k.each(k.expr.match.bool.source.match(/\w+/g), function(a, c) {
        var b = k.expr.attrHandle[c] || k.find.attr;
        k.expr.attrHandle[c] = Ha && la || !Oa.test(c) ? function(a, c, d) {
            var h = k.expr.attrHandle[c];
            a = d ? g : (k.expr.attrHandle[c] = g) != b(a, c, d) ? c.toLowerCase() : null;
            return k.expr.attrHandle[c] = h,
            a
        }
        : function(a, c, b) {
            return b ? g : a[k.camelCase("default-" + c)] ? c.toLowerCase() : null
        }
    });
    Ha && la || (k.attrHooks.value = {
        set: function(a, c, b) {
            return k.nodeName(a, "input") ? (a.defaultValue = c,
            g) : ua && ua.set(a, c, b)
        }
    });
    la || (ua = {
        set: function(a, c, b) {
            var d = a.getAttributeNode(b);
            return d || a.setAttributeNode(d = a.ownerDocument.createAttribute(b)),
            d.value = c += "",
            "value" === b || c === a.getAttribute(b) ? c : g
        }
    },
    k.expr.attrHandle.id = k.expr.attrHandle.name = k.expr.attrHandle.coords = function(a, c, b) {
        var d;
        return b ? g : (d = a.getAttributeNode(c)) && "" !== d.value ? d.value : null
    }
    ,
    k.valHooks.button = {
        get: function(a, c) {
            var b = a.getAttributeNode(c);
            return b && b.specified ? b.value : g
        },
        set: ua.set
    },
    k.attrHooks.contenteditable = {
        set: function(a, c, b) {
            ua.set(a, "" === c ? !1 : c, b)
        }
    },
    k.each(["width", "height"], function(a, c) {
        k.attrHooks[c] = {
            set: function(a, b) {
                return "" === b ? (a.setAttribute(c, "auto"),
                b) : g
            }
        }
    }));
    k.support.hrefNormalized || k.each(["href", "src"], function(a, c) {
        k.propHooks[c] = {
            get: function(a) {
                return a.getAttribute(c, 4)
            }
        }
    });
    k.support.style || (k.attrHooks.style = {
        get: function(a) {
            return a.style.cssText || g
        },
        set: function(a, c) {
            return a.style.cssText = c + ""
        }
    });
    k.support.optSelected || (k.propHooks.selected = {
        get: function(a) {
            a = a.parentNode;
            return a && (a.selectedIndex,
            a.parentNode && a.parentNode.selectedIndex),
            null
        }
    });
    k.each("tabIndex readOnly maxLength cellSpacing cellPadding rowSpan colSpan useMap frameBorder contentEditable".split(" "), function() {
        k.propFix[this.toLowerCase()] = this
    });
    k.support.enctype || (k.propFix.enctype = "encoding");
    k.each(["radio", "checkbox"], function() {
        k.valHooks[this] = {
            set: function(a, c) {
                return k.isArray(c) ? a.checked = 0 <= k.inArray(k(a).val(), c) : g
            }
        };
        k.support.checkOn || (k.valHooks[this].get = function(a) {
            return null === a.getAttribute("value") ? "on" : a.value
        }
        )
    });
    var Pa = /^(?:input|select|textarea)$/i
      , Rb = /^key/
      , Sb = /^(?:mouse|contextmenu)|click/
      , fb = /^(?:focusinfocus|focusoutblur)$/
      , gb = /^([^.]*)(?:\.(.+)|)$/;
    k.event = {
        global: {},
        add: function(a, c, b, d, h) {
            var e, f, m, l, n, q, p, r, s, v;
            if (m = k._data(a)) {
                b.handler && (l = b,
                b = l.handler,
                h = l.selector);
                b.guid || (b.guid = k.guid++);
                (f = m.events) || (f = m.events = {});
                (q = m.handle) || (q = m.handle = function(a) {
                    return typeof k === aa || a && k.event.triggered === a.type ? g : k.event.dispatch.apply(q.elem, arguments)
                }
                ,
                q.elem = a);
                c = (c || "").match(da) || [""];
                for (m = c.length; m--; )
                    e = gb.exec(c[m]) || [],
                    s = v = e[1],
                    e = (e[2] || "").split(".").sort(),
                    s && (n = k.event.special[s] || {},
                    s = (h ? n.delegateType : n.bindType) || s,
                    n = k.event.special[s] || {},
                    p = k.extend({
                        type: s,
                        origType: v,
                        data: d,
                        handler: b,
                        guid: b.guid,
                        selector: h,
                        needsContext: h && k.expr.match.needsContext.test(h),
                        namespace: e.join(".")
                    }, l),
                    (r = f[s]) || (r = f[s] = [],
                    r.delegateCount = 0,
                    n.setup && !1 !== n.setup.call(a, d, e, q) || (a.addEventListener ? a.addEventListener(s, q, !1) : a.attachEvent && a.attachEvent("on" + s, q))),
                    n.add && (n.add.call(a, p),
                    p.handler.guid || (p.handler.guid = b.guid)),
                    h ? r.splice(r.delegateCount++, 0, p) : r.push(p),
                    k.event.global[s] = !0);
                a = null
            }
        },
        remove: function(a, c, b, d, h) {
            var e, f, g, m, l, n, q, p, r, s, v, u = k.hasData(a) && k._data(a);
            if (u && (n = u.events)) {
                c = (c || "").match(da) || [""];
                for (l = c.length; l--; )
                    if (g = gb.exec(c[l]) || [],
                    r = v = g[1],
                    s = (g[2] || "").split(".").sort(),
                    r) {
                        q = k.event.special[r] || {};
                        r = (d ? q.delegateType : q.bindType) || r;
                        p = n[r] || [];
                        g = g[2] && RegExp("(^|\\.)" + s.join("\\.(?:.*\\.|)") + "(\\.|$)");
                        for (m = e = p.length; e--; )
                            f = p[e],
                            !h && v !== f.origType || b && b.guid !== f.guid || g && !g.test(f.namespace) || d && d !== f.selector && ("**" !== d || !f.selector) || (p.splice(e, 1),
                            f.selector && p.delegateCount--,
                            q.remove && q.remove.call(a, f));
                        m && !p.length && (q.teardown && !1 !== q.teardown.call(a, s, u.handle) || k.removeEvent(a, r, u.handle),
                        delete n[r])
                    } else
                        for (r in n)
                            k.event.remove(a, r + c[l], b, d, !0);
                k.isEmptyObject(n) && (delete u.handle,
                k._removeData(a, "events"))
            }
        },
        trigger: function(c, b, d, h) {
            var e, f, m, l, n, q, p = [d || G], r = qa.call(c, "type") ? c.type : c;
            q = qa.call(c, "namespace") ? c.namespace.split(".") : [];
            if (m = e = d = d || G,
            3 !== d.nodeType && 8 !== d.nodeType && !fb.test(r + k.event.triggered) && (0 <= r.indexOf(".") && (q = r.split("."),
            r = q.shift(),
            q.sort()),
            f = 0 > r.indexOf(":") && "on" + r,
            c = c[k.expando] ? c : new k.Event(r,"object" == typeof c && c),
            c.isTrigger = h ? 2 : 3,
            c.namespace = q.join("."),
            c.namespace_re = c.namespace ? RegExp("(^|\\.)" + q.join("\\.(?:.*\\.|)") + "(\\.|$)") : null,
            c.result = g,
            c.target || (c.target = d),
            b = null == b ? [c] : k.makeArray(b, [c]),
            n = k.event.special[r] || {},
            h || !n.trigger || !1 !== n.trigger.apply(d, b))) {
                if (!h && !n.noBubble && !k.isWindow(d)) {
                    l = n.delegateType || r;
                    for (fb.test(l + r) || (m = m.parentNode); m; m = m.parentNode)
                        p.push(m),
                        e = m;
                    e === (d.ownerDocument || G) && p.push(e.defaultView || e.parentWindow || a)
                }
                for (q = 0; (m = p[q++]) && !c.isPropagationStopped(); )
                    c.type = 1 < q ? l : n.bindType || r,
                    (e = (k._data(m, "events") || {})[c.type] && k._data(m, "handle")) && e.apply(m, b),
                    (e = f && m[f]) && k.acceptData(m) && e.apply && !1 === e.apply(m, b) && c.preventDefault();
                if (c.type = r,
                !(h || c.isDefaultPrevented() || n._default && !1 !== n._default.apply(p.pop(), b)) && k.acceptData(d) && f && d[r] && !k.isWindow(d)) {
                    (e = d[f]) && (d[f] = null);
                    k.event.triggered = r;
                    try {
                        d[r]()
                    } catch (s) {}
                    k.event.triggered = g;
                    e && (d[f] = e)
                }
                return c.result
            }
        },
        dispatch: function(a) {
            a = k.event.fix(a);
            var c, b, d, h, e, f = [], m = ka.call(arguments);
            c = (k._data(this, "events") || {})[a.type] || [];
            var l = k.event.special[a.type] || {};
            if (m[0] = a,
            a.delegateTarget = this,
            !l.preDispatch || !1 !== l.preDispatch.call(this, a)) {
                f = k.event.handlers.call(this, a, c);
                for (c = 0; (h = f[c++]) && !a.isPropagationStopped(); )
                    for (a.currentTarget = h.elem,
                    e = 0; (d = h.handlers[e++]) && !a.isImmediatePropagationStopped(); )
                        a.namespace_re && !a.namespace_re.test(d.namespace) || (a.handleObj = d,
                        a.data = d.data,
                        b = ((k.event.special[d.origType] || {}).handle || d.handler).apply(h.elem, m),
                        b === g || !1 !== (a.result = b) || (a.preventDefault(),
                        a.stopPropagation()));
                return l.postDispatch && l.postDispatch.call(this, a),
                a.result
            }
        },
        handlers: function(a, c) {
            var b, d, h, e, f = [], m = c.delegateCount, l = a.target;
            if (m && l.nodeType && (!a.button || "click" !== a.type))
                for (; l != this; l = l.parentNode || this)
                    if (1 === l.nodeType && (!0 !== l.disabled || "click" !== a.type)) {
                        h = [];
                        for (e = 0; m > e; e++)
                            d = c[e],
                            b = d.selector + " ",
                            h[b] === g && (h[b] = d.needsContext ? 0 <= k(b, this).index(l) : k.find(b, this, null, [l]).length),
                            h[b] && h.push(d);
                        h.length && f.push({
                            elem: l,
                            handlers: h
                        })
                    }
            return c.length > m && f.push({
                elem: this,
                handlers: c.slice(m)
            }),
            f
        },
        fix: function(a) {
            if (a[k.expando])
                return a;
            var c, b, d;
            c = a.type;
            var h = a
              , e = this.fixHooks[c];
            e || (this.fixHooks[c] = e = Sb.test(c) ? this.mouseHooks : Rb.test(c) ? this.keyHooks : {});
            d = e.props ? this.props.concat(e.props) : this.props;
            a = new k.Event(h);
            for (c = d.length; c--; )
                b = d[c],
                a[b] = h[b];
            return a.target || (a.target = h.srcElement || G),
            3 === a.target.nodeType && (a.target = a.target.parentNode),
            a.metaKey = !!a.metaKey,
            e.filter ? e.filter(a, h) : a
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: ["char", "charCode", "key", "keyCode"],
            filter: function(a, c) {
                return null == a.which && (a.which = null != c.charCode ? c.charCode : c.keyCode),
                a
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(a, c) {
                var b, d, h, e = c.button, f = c.fromElement;
                return null == a.pageX && null != c.clientX && (d = a.target.ownerDocument || G,
                h = d.documentElement,
                b = d.body,
                a.pageX = c.clientX + (h && h.scrollLeft || b && b.scrollLeft || 0) - (h && h.clientLeft || b && b.clientLeft || 0),
                a.pageY = c.clientY + (h && h.scrollTop || b && b.scrollTop || 0) - (h && h.clientTop || b && b.clientTop || 0)),
                !a.relatedTarget && f && (a.relatedTarget = f === a.target ? c.toElement : f),
                a.which || e === g || (a.which = 1 & e ? 1 : 2 & e ? 3 : 4 & e ? 2 : 0),
                a
            }
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function() {
                    if (this !== n() && this.focus)
                        try {
                            return this.focus(),
                            !1
                        } catch (a) {}
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    return this === n() && this.blur ? (this.blur(),
                    !1) : g
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    return k.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(),
                    !1) : g
                },
                _default: function(a) {
                    return k.nodeName(a.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function(a) {
                    a.result !== g && (a.originalEvent.returnValue = a.result)
                }
            }
        },
        simulate: function(a, c, b, d) {
            a = k.extend(new k.Event, b, {
                type: a,
                isSimulated: !0,
                originalEvent: {}
            });
            d ? k.event.trigger(a, null, c) : k.event.dispatch.call(c, a);
            a.isDefaultPrevented() && b.preventDefault()
        }
    };
    k.removeEvent = G.removeEventListener ? function(a, c, b) {
        a.removeEventListener && a.removeEventListener(c, b, !1)
    }
    : function(a, c, b) {
        c = "on" + c;
        a.detachEvent && (typeof a[c] === aa && (a[c] = null),
        a.detachEvent(c, b))
    }
    ;
    k.Event = function(a, c) {
        return this instanceof k.Event ? (a && a.type ? (this.originalEvent = a,
        this.type = a.type,
        this.isDefaultPrevented = a.defaultPrevented || !1 === a.returnValue || a.getPreventDefault && a.getPreventDefault() ? m : l) : this.type = a,
        c && k.extend(this, c),
        this.timeStamp = a && a.timeStamp || k.now(),
        this[k.expando] = !0,
        g) : new k.Event(a,c)
    }
    ;
    k.Event.prototype = {
        isDefaultPrevented: l,
        isPropagationStopped: l,
        isImmediatePropagationStopped: l,
        preventDefault: function() {
            var a = this.originalEvent;
            this.isDefaultPrevented = m;
            a && (a.preventDefault ? a.preventDefault() : a.returnValue = !1)
        },
        stopPropagation: function() {
            var a = this.originalEvent;
            this.isPropagationStopped = m;
            a && (a.stopPropagation && a.stopPropagation(),
            a.cancelBubble = !0)
        },
        stopImmediatePropagation: function() {
            this.isImmediatePropagationStopped = m;
            this.stopPropagation()
        }
    };
    k.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    }, function(a, c) {
        k.event.special[a] = {
            delegateType: c,
            bindType: c,
            handle: function(a) {
                var b, d = a.relatedTarget, h = a.handleObj;
                return (!d || d !== this && !k.contains(this, d)) && (a.type = h.origType,
                b = h.handler.apply(this, arguments),
                a.type = c),
                b
            }
        }
    });
    k.support.submitBubbles || (k.event.special.submit = {
        setup: function() {
            return k.nodeName(this, "form") ? !1 : (k.event.add(this, "click._submit keypress._submit", function(a) {
                a = a.target;
                (a = k.nodeName(a, "input") || k.nodeName(a, "button") ? a.form : g) && !k._data(a, "submitBubbles") && (k.event.add(a, "submit._submit", function(a) {
                    a._submit_bubble = !0
                }),
                k._data(a, "submitBubbles", !0))
            }),
            g)
        },
        postDispatch: function(a) {
            a._submit_bubble && (delete a._submit_bubble,
            this.parentNode && !a.isTrigger && k.event.simulate("submit", this.parentNode, a, !0))
        },
        teardown: function() {
            return k.nodeName(this, "form") ? !1 : (k.event.remove(this, "._submit"),
            g)
        }
    });
    k.support.changeBubbles || (k.event.special.change = {
        setup: function() {
            return Pa.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (k.event.add(this, "propertychange._change", function(a) {
                "checked" === a.originalEvent.propertyName && (this._just_changed = !0)
            }),
            k.event.add(this, "click._change", function(a) {
                this._just_changed && !a.isTrigger && (this._just_changed = !1);
                k.event.simulate("change", this, a, !0)
            })),
            !1) : (k.event.add(this, "beforeactivate._change", function(a) {
                a = a.target;
                Pa.test(a.nodeName) && !k._data(a, "changeBubbles") && (k.event.add(a, "change._change", function(a) {
                    !this.parentNode || a.isSimulated || a.isTrigger || k.event.simulate("change", this.parentNode, a, !0)
                }),
                k._data(a, "changeBubbles", !0))
            }),
            g)
        },
        handle: function(a) {
            var c = a.target;
            return this !== c || a.isSimulated || a.isTrigger || "radio" !== c.type && "checkbox" !== c.type ? a.handleObj.handler.apply(this, arguments) : g
        },
        teardown: function() {
            return k.event.remove(this, "._change"),
            !Pa.test(this.nodeName)
        }
    });
    k.support.focusinBubbles || k.each({
        focus: "focusin",
        blur: "focusout"
    }, function(a, c) {
        var b = 0
          , d = function(a) {
            k.event.simulate(c, a.target, k.event.fix(a), !0)
        };
        k.event.special[c] = {
            setup: function() {
                0 === b++ && G.addEventListener(a, d, !0)
            },
            teardown: function() {
                0 === --b && G.removeEventListener(a, d, !0)
            }
        }
    });
    k.fn.extend({
        on: function(a, c, b, d, h) {
            var e, f;
            if ("object" == typeof a) {
                "string" != typeof c && (b = b || c,
                c = g);
                for (e in a)
                    this.on(e, c, b, a[e], h);
                return this
            }
            if (null == b && null == d ? (d = c,
            b = c = g) : null == d && ("string" == typeof c ? (d = b,
            b = g) : (d = b,
            b = c,
            c = g)),
            !1 === d)
                d = l;
            else if (!d)
                return this;
            return 1 === h && (f = d,
            d = function(a) {
                return k().off(a),
                f.apply(this, arguments)
            }
            ,
            d.guid = f.guid || (f.guid = k.guid++)),
            this.each(function() {
                k.event.add(this, a, d, b, c)
            })
        },
        one: function(a, c, b, d) {
            return this.on(a, c, b, d, 1)
        },
        off: function(a, c, b) {
            var d, h;
            if (a && a.preventDefault && a.handleObj)
                return d = a.handleObj,
                k(a.delegateTarget).off(d.namespace ? d.origType + "." + d.namespace : d.origType, d.selector, d.handler),
                this;
            if ("object" == typeof a) {
                for (h in a)
                    this.off(h, c, a[h]);
                return this
            }
            return (!1 === c || "function" == typeof c) && (b = c,
            c = g),
            !1 === b && (b = l),
            this.each(function() {
                k.event.remove(this, a, b, c)
            })
        },
        trigger: function(a, c) {
            return this.each(function() {
                k.event.trigger(a, c, this)
            })
        },
        triggerHandler: function(a, c) {
            var b = this[0];
            return b ? k.event.trigger(a, c, b, !0) : g
        }
    });
    var zb = /^.[^:#\[\.,]*$/
      , Tb = /^(?:parents|prev(?:Until|All))/
      , hb = k.expr.match.needsContext
      , Ub = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
    k.fn.extend({
        find: function(a) {
            var c, b = [], d = this, h = d.length;
            if ("string" != typeof a)
                return this.pushStack(k(a).filter(function() {
                    for (c = 0; h > c; c++)
                        if (k.contains(d[c], this))
                            return !0
                }));
            for (c = 0; h > c; c++)
                k.find(a, d[c], b);
            return b = this.pushStack(1 < h ? k.unique(b) : b),
            b.selector = this.selector ? this.selector + " " + a : a,
            b
        },
        has: function(a) {
            var c, b = k(a, this), d = b.length;
            return this.filter(function() {
                for (c = 0; d > c; c++)
                    if (k.contains(this, b[c]))
                        return !0
            })
        },
        not: function(a) {
            return this.pushStack(p(this, a || [], !0))
        },
        filter: function(a) {
            return this.pushStack(p(this, a || [], !1))
        },
        is: function(a) {
            return !!p(this, "string" == typeof a && hb.test(a) ? k(a) : a || [], !1).length
        },
        closest: function(a, c) {
            for (var b, d = 0, h = this.length, e = [], f = hb.test(a) || "string" != typeof a ? k(a, c || this.context) : 0; h > d; d++)
                for (b = this[d]; b && b !== c; b = b.parentNode)
                    if (11 > b.nodeType && (f ? -1 < f.index(b) : 1 === b.nodeType && k.find.matchesSelector(b, a))) {
                        e.push(b);
                        break
                    }
            return this.pushStack(1 < e.length ? k.unique(e) : e)
        },
        index: function(a) {
            return a ? "string" == typeof a ? k.inArray(this[0], k(a)) : k.inArray(a.jquery ? a[0] : a, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(a, c) {
            var b = "string" == typeof a ? k(a, c) : k.makeArray(a && a.nodeType ? [a] : a)
              , b = k.merge(this.get(), b);
            return this.pushStack(k.unique(b))
        },
        addBack: function(a) {
            return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
        }
    });
    k.each({
        parent: function(a) {
            return (a = a.parentNode) && 11 !== a.nodeType ? a : null
        },
        parents: function(a) {
            return k.dir(a, "parentNode")
        },
        parentsUntil: function(a, c, b) {
            return k.dir(a, "parentNode", b)
        },
        next: function(a) {
            return q(a, "nextSibling")
        },
        prev: function(a) {
            return q(a, "previousSibling")
        },
        nextAll: function(a) {
            return k.dir(a, "nextSibling")
        },
        prevAll: function(a) {
            return k.dir(a, "previousSibling")
        },
        nextUntil: function(a, c, b) {
            return k.dir(a, "nextSibling", b)
        },
        prevUntil: function(a, c, b) {
            return k.dir(a, "previousSibling", b)
        },
        siblings: function(a) {
            return k.sibling((a.parentNode || {}).firstChild, a)
        },
        children: function(a) {
            return k.sibling(a.firstChild)
        },
        contents: function(a) {
            return k.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : k.merge([], a.childNodes)
        }
    }, function(a, c) {
        k.fn[a] = function(b, d) {
            var h = k.map(this, c, b);
            return "Until" !== a.slice(-5) && (d = b),
            d && "string" == typeof d && (h = k.filter(d, h)),
            1 < this.length && (Ub[a] || (h = k.unique(h)),
            Tb.test(a) && (h = h.reverse())),
            this.pushStack(h)
        }
    });
    k.extend({
        filter: function(a, c, b) {
            var d = c[0];
            return b && (a = ":not(" + a + ")"),
            1 === c.length && 1 === d.nodeType ? k.find.matchesSelector(d, a) ? [d] : [] : k.find.matches(a, k.grep(c, function(a) {
                return 1 === a.nodeType
            }))
        },
        dir: function(a, c, b) {
            var d = [];
            for (a = a[c]; a && 9 !== a.nodeType && (b === g || 1 !== a.nodeType || !k(a).is(b)); )
                1 === a.nodeType && d.push(a),
                a = a[c];
            return d
        },
        sibling: function(a, c) {
            for (var b = []; a; a = a.nextSibling)
                1 === a.nodeType && a !== c && b.push(a);
            return b
        }
    });
    var Ya = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video"
      , Vb = / jQuery\d+="(?:null|\d+)"/g
      , ib = RegExp("<(?:" + Ya + ")[\\s/>]", "i")
      , Qa = /^\s+/
      , jb = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi
      , kb = /<([\w:]+)/
      , lb = /<tbody/i
      , Wb = /<|&#?\w+;/
      , Xb = /<(?:script|style|link)/i
      , Ja = /^(?:checkbox|radio)$/i
      , Yb = /checked\s*(?:[^=]|=\s*.checked.)/i
      , mb = /^$|\/(?:java|ecma)script/i
      , Ab = /^true\/(.*)/
      , Zb = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g
      , X = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        legend: [1, "<fieldset>", "</fieldset>"],
        area: [1, "<map>", "</map>"],
        param: [1, "<object>", "</object>"],
        thead: [1, "<table>", "</table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: k.support.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
    }
      , Ra = r(G).appendChild(G.createElement("div"));
    X.optgroup = X.option;
    X.tbody = X.tfoot = X.colgroup = X.caption = X.thead;
    X.th = X.td;
    k.fn.extend({
        text: function(a) {
            return k.access(this, function(a) {
                return a === g ? k.text(this) : this.empty().append((this[0] && this[0].ownerDocument || G).createTextNode(a))
            }, null, a, arguments.length)
        },
        append: function() {
            return this.domManip(arguments, function(a) {
                1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || s(this, a).appendChild(a)
            })
        },
        prepend: function() {
            return this.domManip(arguments, function(a) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var c = s(this, a);
                    c.insertBefore(a, c.firstChild)
                }
            })
        },
        before: function() {
            return this.domManip(arguments, function(a) {
                this.parentNode && this.parentNode.insertBefore(a, this)
            })
        },
        after: function() {
            return this.domManip(arguments, function(a) {
                this.parentNode && this.parentNode.insertBefore(a, this.nextSibling)
            })
        },
        remove: function(a, c) {
            for (var b, d = a ? k.filter(a, this) : this, h = 0; null != (b = d[h]); h++)
                c || 1 !== b.nodeType || k.cleanData(C(b)),
                b.parentNode && (c && k.contains(b.ownerDocument, b) && x(C(b, "script")),
                b.parentNode.removeChild(b));
            return this
        },
        empty: function() {
            for (var a, c = 0; null != (a = this[c]); c++) {
                for (1 === a.nodeType && k.cleanData(C(a, !1)); a.firstChild; )
                    a.removeChild(a.firstChild);
                a.options && k.nodeName(a, "select") && (a.options.length = 0)
            }
            return this
        },
        clone: function(a, c) {
            return a = null == a ? !1 : a,
            c = null == c ? a : c,
            this.map(function() {
                return k.clone(this, a, c)
            })
        },
        html: function(a) {
            return k.access(this, function(a) {
                var c = this[0] || {}
                  , b = 0
                  , d = this.length;
                if (a === g)
                    return 1 === c.nodeType ? c.innerHTML.replace(Vb, "") : g;
                if (!("string" != typeof a || Xb.test(a) || !k.support.htmlSerialize && ib.test(a) || !k.support.leadingWhitespace && Qa.test(a) || X[(kb.exec(a) || ["", ""])[1].toLowerCase()])) {
                    a = a.replace(jb, "<$1></$2>");
                    try {
                        for (; d > b; b++)
                            c = this[b] || {},
                            1 === c.nodeType && (k.cleanData(C(c, !1)),
                            c.innerHTML = a);
                        c = 0
                    } catch (h) {}
                }
                c && this.empty().append(a)
            }, null, a, arguments.length)
        },
        replaceWith: function() {
            var a = k.map(this, function(a) {
                return [a.nextSibling, a.parentNode]
            })
              , c = 0;
            return this.domManip(arguments, function(b) {
                var d = a[c++]
                  , h = a[c++];
                h && (d && d.parentNode !== h && (d = this.nextSibling),
                k(this).remove(),
                h.insertBefore(b, d))
            }, !0),
            c ? this : this.remove()
        },
        detach: function(a) {
            return this.remove(a, !0)
        },
        domManip: function(a, c, b) {
            a = ab.apply([], a);
            var d, h, e, f, g = 0, m = this.length, l = this, n = m - 1, q = a[0], p = k.isFunction(q);
            if (p || !(1 >= m || "string" != typeof q || k.support.checkClone) && Yb.test(q))
                return this.each(function(d) {
                    var h = l.eq(d);
                    p && (a[0] = q.call(this, d, h.html()));
                    h.domManip(a, c, b)
                });
            if (m && (f = k.buildFragment(a, this[0].ownerDocument, !1, !b && this),
            d = f.firstChild,
            1 === f.childNodes.length && (f = d),
            d)) {
                e = k.map(C(f, "script"), u);
                for (h = e.length; m > g; g++)
                    d = f,
                    g !== n && (d = k.clone(d, !0, !0),
                    h && k.merge(e, C(d, "script"))),
                    c.call(this[g], d, g);
                if (h)
                    for (f = e[e.length - 1].ownerDocument,
                    k.map(e, v),
                    g = 0; h > g; g++)
                        d = e[g],
                        mb.test(d.type || "") && !k._data(d, "globalEval") && k.contains(f, d) && (d.src ? k._evalUrl(d.src) : k.globalEval((d.text || d.textContent || d.innerHTML || "").replace(Zb, "")));
                f = d = null
            }
            return this
        }
    });
    k.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(a, c) {
        k.fn[a] = function(a) {
            for (var b = 0, d = [], h = k(a), e = h.length - 1; e >= b; b++)
                a = b === e ? this : this.clone(!0),
                k(h[b])[c](a),
                La.apply(d, a.get());
            return this.pushStack(d)
        }
    });
    k.extend({
        clone: function(a, c, b) {
            var d, h, e, f, g, m = k.contains(a.ownerDocument, a);
            if (k.support.html5Clone || k.isXMLDoc(a) || !ib.test("<" + a.nodeName + ">") ? e = a.cloneNode(!0) : (Ra.innerHTML = a.outerHTML,
            Ra.removeChild(e = Ra.firstChild)),
            !(k.support.noCloneEvent && k.support.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || k.isXMLDoc(a)))
                for (d = C(e),
                g = C(a),
                f = 0; null != (h = g[f]); ++f)
                    if (d[f]) {
                        var l = d[f]
                          , n = void 0
                          , q = void 0
                          , p = void 0;
                        if (1 === l.nodeType) {
                            if (n = l.nodeName.toLowerCase(),
                            !k.support.noCloneEvent && l[k.expando]) {
                                p = k._data(l);
                                for (q in p.events)
                                    k.removeEvent(l, q, p.handle);
                                l.removeAttribute(k.expando)
                            }
                            "script" === n && l.text !== h.text ? (u(l).text = h.text,
                            v(l)) : "object" === n ? (l.parentNode && (l.outerHTML = h.outerHTML),
                            k.support.html5Clone && h.innerHTML && !k.trim(l.innerHTML) && (l.innerHTML = h.innerHTML)) : "input" === n && Ja.test(h.type) ? (l.defaultChecked = l.checked = h.checked,
                            l.value !== h.value && (l.value = h.value)) : "option" === n ? l.defaultSelected = l.selected = h.defaultSelected : ("input" === n || "textarea" === n) && (l.defaultValue = h.defaultValue)
                        }
                    }
            if (c)
                if (b)
                    for (g = g || C(a),
                    d = d || C(e),
                    f = 0; null != (h = g[f]); f++)
                        B(h, d[f]);
                else
                    B(a, e);
            return d = C(e, "script"),
            0 < d.length && x(d, !m && C(a, "script")),
            e
        },
        buildFragment: function(a, c, b, d) {
            for (var h, e, f, g, m, l, n, q = a.length, p = r(c), s = [], v = 0; q > v; v++)
                if (e = a[v],
                e || 0 === e)
                    if ("object" === k.type(e))
                        k.merge(s, e.nodeType ? [e] : e);
                    else if (Wb.test(e)) {
                        g = g || p.appendChild(c.createElement("div"));
                        m = (kb.exec(e) || ["", ""])[1].toLowerCase();
                        n = X[m] || X._default;
                        g.innerHTML = n[1] + e.replace(jb, "<$1></$2>") + n[2];
                        for (h = n[0]; h--; )
                            g = g.lastChild;
                        if (!k.support.leadingWhitespace && Qa.test(e) && s.push(c.createTextNode(Qa.exec(e)[0])),
                        !k.support.tbody)
                            for (h = (e = "table" !== m || lb.test(e) ? "<table>" !== n[1] || lb.test(e) ? 0 : g : g.firstChild) && e.childNodes.length; h--; )
                                k.nodeName(l = e.childNodes[h], "tbody") && !l.childNodes.length && e.removeChild(l);
                        k.merge(s, g.childNodes);
                        for (g.textContent = ""; g.firstChild; )
                            g.removeChild(g.firstChild);
                        g = p.lastChild
                    } else
                        s.push(c.createTextNode(e));
            g && p.removeChild(g);
            k.support.appendChecked || k.grep(C(s, "input"), w);
            for (v = 0; e = s[v++]; )
                if ((!d || -1 === k.inArray(e, d)) && (f = k.contains(e.ownerDocument, e),
                g = C(p.appendChild(e), "script"),
                f && x(g),
                b))
                    for (h = 0; e = g[h++]; )
                        mb.test(e.type || "") && b.push(e);
            return p
        },
        cleanData: function(a, c) {
            for (var b, d, h, e, f = 0, g = k.expando, m = k.cache, l = k.support.deleteExpando, n = k.event.special; null != (b = a[f]); f++)
                if ((c || k.acceptData(b)) && (h = b[g],
                e = h && m[h])) {
                    if (e.events)
                        for (d in e.events)
                            n[d] ? k.event.remove(b, d) : k.removeEvent(b, d, e.handle);
                    m[h] && (delete m[h],
                    l ? delete b[g] : typeof b.removeAttribute !== aa ? b.removeAttribute(g) : b[g] = null,
                    fa.push(h))
                }
        },
        _evalUrl: function(a) {
            return k.ajax({
                url: a,
                type: "GET",
                dataType: "script",
                async: !1,
                global: !1,
                "throws": !0
            })
        }
    });
    k.fn.extend({
        wrapAll: function(a) {
            if (k.isFunction(a))
                return this.each(function(c) {
                    k(this).wrapAll(a.call(this, c))
                });
            if (this[0]) {
                var c = k(a, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && c.insertBefore(this[0]);
                c.map(function() {
                    for (var a = this; a.firstChild && 1 === a.firstChild.nodeType; )
                        a = a.firstChild;
                    return a
                }).append(this)
            }
            return this
        },
        wrapInner: function(a) {
            return k.isFunction(a) ? this.each(function(c) {
                k(this).wrapInner(a.call(this, c))
            }) : this.each(function() {
                var c = k(this)
                  , b = c.contents();
                b.length ? b.wrapAll(a) : c.append(a)
            })
        },
        wrap: function(a) {
            var c = k.isFunction(a);
            return this.each(function(b) {
                k(this).wrapAll(c ? a.call(this, b) : a)
            })
        },
        unwrap: function() {
            return this.parent().each(function() {
                k.nodeName(this, "body") || k(this).replaceWith(this.childNodes)
            }).end()
        }
    });
    var ja, ia, ba, Sa = /alpha\([^)]*\)/i, $b = /opacity\s*=\s*([^)]*)/, ac = /^(top|right|bottom|left)$/, bc = /^(none|table(?!-c[ea]).+)/, nb = /^margin/, Bb = RegExp("^(" + Ca + ")(.*)$", "i"), xa = RegExp("^(" + Ca + ")(?!px)[a-z%]+$", "i"), cc = RegExp("^([+-])=(" + Ca + ")", "i"), $a = {
        BODY: "block"
    }, dc = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }, ob = {
        letterSpacing: 0,
        fontWeight: 400
    }, na = ["Top", "Right", "Bottom", "Left"], Za = ["Webkit", "O", "Moz", "ms"];
    k.fn.extend({
        css: function(a, c) {
            return k.access(this, function(a, c, b) {
                var d, h = {}, e = 0;
                if (k.isArray(c)) {
                    d = ia(a);
                    for (b = c.length; b > e; e++)
                        h[c[e]] = k.css(a, c[e], !1, d);
                    return h
                }
                return b !== g ? k.style(a, c, b) : k.css(a, c)
            }, a, c, 1 < arguments.length)
        },
        show: function() {
            return N(this, !0)
        },
        hide: function() {
            return N(this)
        },
        toggle: function(a) {
            return "boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function() {
                A(this) ? k(this).show() : k(this).hide()
            })
        }
    });
    k.extend({
        cssHooks: {
            opacity: {
                get: function(a, c) {
                    if (c) {
                        var b = ba(a, "opacity");
                        return "" === b ? "1" : b
                    }
                }
            }
        },
        cssNumber: {
            columnCount: !0,
            fillOpacity: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": k.support.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(a, c, b, d) {
            if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
                var h, e, f, m = k.camelCase(c), l = a.style;
                if (c = k.cssProps[m] || (k.cssProps[m] = y(l, m)),
                f = k.cssHooks[c] || k.cssHooks[m],
                b === g)
                    return f && "get"in f && (h = f.get(a, !1, d)) !== g ? h : l[c];
                if (e = typeof b,
                "string" === e && (h = cc.exec(b)) && (b = (h[1] + 1) * h[2] + parseFloat(k.css(a, c)),
                e = "number"),
                !(null == b || "number" === e && isNaN(b) || ("number" !== e || k.cssNumber[m] || (b += "px"),
                k.support.clearCloneStyle || "" !== b || 0 !== c.indexOf("background") || (l[c] = "inherit"),
                f && "set"in f && (b = f.set(a, b, d)) === g)))
                    try {
                        l[c] = b
                    } catch (n) {}
            }
        },
        css: function(a, c, b, d) {
            var h, e, f, m = k.camelCase(c);
            return c = k.cssProps[m] || (k.cssProps[m] = y(a.style, m)),
            f = k.cssHooks[c] || k.cssHooks[m],
            f && "get"in f && (e = f.get(a, !0, b)),
            e === g && (e = ba(a, c, d)),
            "normal" === e && c in ob && (e = ob[c]),
            "" === b || b ? (h = parseFloat(e),
            !0 === b || k.isNumeric(h) ? h || 0 : e) : e
        }
    });
    a.getComputedStyle ? (ia = function(c) {
        return a.getComputedStyle(c, null)
    }
    ,
    ba = function(a, c, b) {
        var d, h, e, f = (b = b || ia(a)) ? b.getPropertyValue(c) || b[c] : g, m = a.style;
        return b && ("" !== f || k.contains(a.ownerDocument, a) || (f = k.style(a, c)),
        xa.test(f) && nb.test(c) && (d = m.width,
        h = m.minWidth,
        e = m.maxWidth,
        m.minWidth = m.maxWidth = m.width = f,
        f = b.width,
        m.width = d,
        m.minWidth = h,
        m.maxWidth = e)),
        f
    }
    ) : G.documentElement.currentStyle && (ia = function(a) {
        return a.currentStyle
    }
    ,
    ba = function(a, c, b) {
        var d, h, e;
        b = (b = b || ia(a)) ? b[c] : g;
        var f = a.style;
        return null == b && f && f[c] && (b = f[c]),
        xa.test(b) && !ac.test(c) && (d = f.left,
        h = a.runtimeStyle,
        e = h && h.left,
        e && (h.left = a.currentStyle.left),
        f.left = "fontSize" === c ? "1em" : b,
        b = f.pixelLeft + "px",
        f.left = d,
        e && (h.left = e)),
        "" === b ? "auto" : b
    }
    );
    k.each(["height", "width"], function(a, c) {
        k.cssHooks[c] = {
            get: function(a, b, d) {
                return b ? 0 === a.offsetWidth && bc.test(k.css(a, "display")) ? k.swap(a, dc, function() {
                    return F(a, c, d)
                }) : F(a, c, d) : g
            },
            set: function(a, b, d) {
                var h = d && ia(a);
                return I(a, b, d ? J(a, c, d, k.support.boxSizing && "border-box" === k.css(a, "boxSizing", !1, h), h) : 0)
            }
        }
    });
    k.support.opacity || (k.cssHooks.opacity = {
        get: function(a, c) {
            return $b.test((c && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? 0.01 * parseFloat(RegExp.$1) + "" : c ? "1" : ""
        },
        set: function(a, c) {
            var b = a.style
              , d = a.currentStyle
              , h = k.isNumeric(c) ? "alpha(opacity=" + 100 * c + ")" : ""
              , e = d && d.filter || b.filter || "";
            b.zoom = 1;
            (1 <= c || "" === c) && "" === k.trim(e.replace(Sa, "")) && b.removeAttribute && (b.removeAttribute("filter"),
            "" === c || d && !d.filter) || (b.filter = Sa.test(e) ? e.replace(Sa, h) : e + " " + h)
        }
    });
    k(function() {
        k.support.reliableMarginRight || (k.cssHooks.marginRight = {
            get: function(a, c) {
                return c ? k.swap(a, {
                    display: "inline-block"
                }, ba, [a, "marginRight"]) : g
            }
        });
        !k.support.pixelPosition && k.fn.position && k.each(["top", "left"], function(a, c) {
            k.cssHooks[c] = {
                get: function(a, b) {
                    return b ? (b = ba(a, c),
                    xa.test(b) ? k(a).position()[c] + "px" : b) : g
                }
            }
        })
    });
    k.expr && k.expr.filters && (k.expr.filters.hidden = function(a) {
        return 0 >= a.offsetWidth && 0 >= a.offsetHeight || !k.support.reliableHiddenOffsets && "none" === (a.style && a.style.display || k.css(a, "display"))
    }
    ,
    k.expr.filters.visible = function(a) {
        return !k.expr.filters.hidden(a)
    }
    );
    k.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(a, c) {
        k.cssHooks[a + c] = {
            expand: function(b) {
                var d = 0
                  , h = {};
                for (b = "string" == typeof b ? b.split(" ") : [b]; 4 > d; d++)
                    h[a + na[d] + c] = b[d] || b[d - 2] || b[0];
                return h
            }
        };
        nb.test(a) || (k.cssHooks[a + c].set = I)
    });
    var ec = /%20/g
      , Cb = /\[\]$/
      , pb = /\r?\n/g
      , fc = /^(?:submit|button|image|reset|file)$/i
      , gc = /^(?:input|select|textarea|keygen)/i;
    k.fn.extend({
        serialize: function() {
            return k.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var a = k.prop(this, "elements");
                return a ? k.makeArray(a) : this
            }).filter(function() {
                var a = this.type;
                return this.name && !k(this).is(":disabled") && gc.test(this.nodeName) && !fc.test(a) && (this.checked || !Ja.test(a))
            }).map(function(a, c) {
                var b = k(this).val();
                return null == b ? null : k.isArray(b) ? k.map(b, function(a) {
                    return {
                        name: c.name,
                        value: a.replace(pb, "\r\n")
                    }
                }) : {
                    name: c.name,
                    value: b.replace(pb, "\r\n")
                }
            }).get()
        }
    });
    k.param = function(a, c) {
        var b, d = [], h = function(a, c) {
            c = k.isFunction(c) ? c() : null == c ? "" : c;
            d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(c)
        };
        if (c === g && (c = k.ajaxSettings && k.ajaxSettings.traditional),
        k.isArray(a) || a.jquery && !k.isPlainObject(a))
            k.each(a, function() {
                h(this.name, this.value)
            });
        else
            for (b in a)
                R(b, a[b], c, h);
        return d.join("&").replace(ec, "+")
    }
    ;
    k.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(a, c) {
        k.fn[c] = function(a, b) {
            return 0 < arguments.length ? this.on(c, null, a, b) : this.trigger(c)
        }
    });
    k.fn.extend({
        hover: function(a, c) {
            return this.mouseenter(a).mouseleave(c || a)
        },
        bind: function(a, c, b) {
            return this.on(a, null, c, b)
        },
        unbind: function(a, c) {
            return this.off(a, null, c)
        },
        delegate: function(a, c, b, d) {
            return this.on(c, a, b, d)
        },
        undelegate: function(a, c, b) {
            return 1 === arguments.length ? this.off(a, "**") : this.off(c, a || "**", b)
        }
    });
    var ha, ma, Ta = k.now(), Ua = /\?/, hc = /#.*$/, qb = /([?&])_=[^&]*/, ic = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm, jc = /^(?:GET|HEAD)$/, kc = /^\/\//, rb = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/, sb = k.fn.load, tb = {}, Ka = {}, ub = "*/".concat("*");
    try {
        ma = Aa.href
    } catch (oc) {
        ma = G.createElement("a"),
        ma.href = "",
        ma = ma.href
    }
    ha = rb.exec(ma.toLowerCase()) || [];
    k.fn.load = function(a, c, b) {
        if ("string" != typeof a && sb)
            return sb.apply(this, arguments);
        var d, h, e, f = this, m = a.indexOf(" ");
        return 0 <= m && (d = a.slice(m, a.length),
        a = a.slice(0, m)),
        k.isFunction(c) ? (b = c,
        c = g) : c && "object" == typeof c && (e = "POST"),
        0 < f.length && k.ajax({
            url: a,
            type: e,
            dataType: "html",
            data: c
        }).done(function(a) {
            h = arguments;
            f.html(d ? k("<div>").append(k.parseHTML(a)).find(d) : a)
        }).complete(b && function(a, c) {
            f.each(b, h || [a.responseText, c, a])
        }
        ),
        this
    }
    ;
    k.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(a, c) {
        k.fn[c] = function(a) {
            return this.on(c, a)
        }
    });
    k.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: ma,
            type: "GET",
            isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(ha[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": ub,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": k.parseJSON,
                "text xml": k.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(a, c) {
            return c ? P(P(a, k.ajaxSettings), c) : P(k.ajaxSettings, a)
        },
        ajaxPrefilter: Y(tb),
        ajaxTransport: Y(Ka),
        ajax: function(a, c) {
            function b(a, c, d, h) {
                var q, H, x, B, y = c;
                if (2 !== w) {
                    w = 2;
                    m && clearTimeout(m);
                    n = g;
                    f = h || "";
                    A.readyState = 0 < a ? 4 : 0;
                    h = 200 <= a && 300 > a || 304 === a;
                    if (d) {
                        x = p;
                        for (var T = A, E, Q, I, D, ea = x.contents, J = x.dataTypes; "*" === J[0]; )
                            J.shift(),
                            Q === g && (Q = x.mimeType || T.getResponseHeader("Content-Type"));
                        if (Q)
                            for (D in ea)
                                if (ea[D] && ea[D].test(Q)) {
                                    J.unshift(D);
                                    break
                                }
                        if (J[0]in d)
                            I = J[0];
                        else {
                            for (D in d) {
                                if (!J[0] || x.converters[D + " " + J[0]]) {
                                    I = D;
                                    break
                                }
                                E || (E = D)
                            }
                            I = I || E
                        }
                        x = I ? (I !== J[0] && J.unshift(I),
                        d[I]) : g
                    }
                    var L;
                    a: {
                        d = p;
                        E = x;
                        Q = A;
                        I = h;
                        var F, P, N;
                        x = {};
                        T = d.dataTypes.slice();
                        if (T[1])
                            for (F in d.converters)
                                x[F.toLowerCase()] = d.converters[F];
                        for (D = T.shift(); D; )
                            if (d.responseFields[D] && (Q[d.responseFields[D]] = E),
                            !N && I && d.dataFilter && (E = d.dataFilter(E, d.dataType)),
                            N = D,
                            D = T.shift())
                                if ("*" === D)
                                    D = N;
                                else if ("*" !== N && N !== D) {
                                    if (F = x[N + " " + D] || x["* " + D],
                                    !F)
                                        for (L in x)
                                            if (P = L.split(" "),
                                            P[1] === D && (F = x[N + " " + P[0]] || x["* " + P[0]])) {
                                                !0 === F ? F = x[L] : !0 !== x[L] && (D = P[0],
                                                T.unshift(P[1]));
                                                break
                                            }
                                    if (!0 !== F)
                                        if (F && d["throws"])
                                            E = F(E);
                                        else
                                            try {
                                                E = F(E)
                                            } catch (Da) {
                                                L = {
                                                    state: "parsererror",
                                                    error: F ? Da : "No conversion from " + N + " to " + D
                                                };
                                                break a
                                            }
                                }
                        L = {
                            state: "success",
                            data: E
                        }
                    }
                    x = L;
                    h ? (p.ifModified && (B = A.getResponseHeader("Last-Modified"),
                    B && (k.lastModified[e] = B),
                    B = A.getResponseHeader("etag"),
                    B && (k.etag[e] = B)),
                    204 === a || "HEAD" === p.type ? y = "nocontent" : 304 === a ? y = "notmodified" : (y = x.state,
                    q = x.data,
                    H = x.error,
                    h = !H)) : (H = y,
                    (a || !y) && (y = "error",
                    0 > a && (a = 0)));
                    A.status = a;
                    A.statusText = (c || y) + "";
                    h ? v.resolveWith(r, [q, y, A]) : v.rejectWith(r, [A, y, H]);
                    A.statusCode(C);
                    C = g;
                    l && s.trigger(h ? "ajaxSuccess" : "ajaxError", [A, p, h ? q : H]);
                    u.fireWith(r, [A, y]);
                    l && (s.trigger("ajaxComplete", [A, p]),
                    --k.active || k.event.trigger("ajaxStop"))
                }
            }
            "object" == typeof a && (c = a,
            a = g);
            c = c || {};
            var d, h, e, f, m, l, n, q, p = k.ajaxSetup({}, c), r = p.context || p, s = p.context && (r.nodeType || r.jquery) ? k(r) : k.event, v = k.Deferred(), u = k.Callbacks("once memory"), C = p.statusCode || {}, x = {}, B = {}, w = 0, y = "canceled", A = {
                readyState: 0,
                getResponseHeader: function(a) {
                    var c;
                    if (2 === w) {
                        if (!q)
                            for (q = {}; c = ic.exec(f); )
                                q[c[1].toLowerCase()] = c[2];
                        c = q[a.toLowerCase()]
                    }
                    return null == c ? null : c
                },
                getAllResponseHeaders: function() {
                    return 2 === w ? f : null
                },
                setRequestHeader: function(a, c) {
                    var b = a.toLowerCase();
                    return w || (a = B[b] = B[b] || a,
                    x[a] = c),
                    this
                },
                overrideMimeType: function(a) {
                    return w || (p.mimeType = a),
                    this
                },
                statusCode: function(a) {
                    var c;
                    if (a)
                        if (2 > w)
                            for (c in a)
                                C[c] = [C[c], a[c]];
                        else
                            A.always(a[A.status]);
                    return this
                },
                abort: function(a) {
                    a = a || y;
                    return n && n.abort(a),
                    b(0, a),
                    this
                }
            };
            if (v.promise(A).complete = u.add,
            A.success = A.done,
            A.error = A.fail,
            p.url = ((a || p.url || ma) + "").replace(hc, "").replace(kc, ha[1] + "//"),
            p.type = c.method || c.type || p.method || p.type,
            p.dataTypes = k.trim(p.dataType || "*").toLowerCase().match(da) || [""],
            null == p.crossDomain && (d = rb.exec(p.url.toLowerCase()),
            p.crossDomain = !(!d || d[1] === ha[1] && d[2] === ha[2] && (d[3] || ("http:" === d[1] ? "80" : "443")) === (ha[3] || ("http:" === ha[1] ? "80" : "443")))),
            p.data && p.processData && "string" != typeof p.data && (p.data = k.param(p.data, p.traditional)),
            K(tb, p, c, A),
            2 === w)
                return A;
            (l = p.global) && 0 === k.active++ && k.event.trigger("ajaxStart");
            p.type = p.type.toUpperCase();
            p.hasContent = !jc.test(p.type);
            e = p.url;
            p.hasContent || (p.data && (e = p.url += (Ua.test(e) ? "&" : "?") + p.data,
            delete p.data),
            !1 === p.cache && (p.url = qb.test(e) ? e.replace(qb, "$1_=" + Ta++) : e + (Ua.test(e) ? "&" : "?") + "_=" + Ta++));
            p.ifModified && (k.lastModified[e] && A.setRequestHeader("If-Modified-Since", k.lastModified[e]),
            k.etag[e] && A.setRequestHeader("If-None-Match", k.etag[e]));
            (p.data && p.hasContent && !1 !== p.contentType || c.contentType) && A.setRequestHeader("Content-Type", p.contentType);
            A.setRequestHeader("Accept", p.dataTypes[0] && p.accepts[p.dataTypes[0]] ? p.accepts[p.dataTypes[0]] + ("*" !== p.dataTypes[0] ? ", " + ub + "; q=0.01" : "") : p.accepts["*"]);
            for (h in p.headers)
                A.setRequestHeader(h, p.headers[h]);
            if (p.beforeSend && (!1 === p.beforeSend.call(r, A, p) || 2 === w))
                return A.abort();
            y = "abort";
            for (h in {
                success: 1,
                error: 1,
                complete: 1
            })
                A[h](p[h]);
            if (n = K(Ka, p, c, A)) {
                A.readyState = 1;
                l && s.trigger("ajaxSend", [A, p]);
                p.async && 0 < p.timeout && (m = setTimeout(function() {
                    A.abort("timeout")
                }, p.timeout));
                try {
                    w = 1,
                    n.send(x, b)
                } catch (E) {
                    if (!(2 > w))
                        throw E;
                    b(-1, E)
                }
            } else
                b(-1, "No Transport");
            return A
        },
        getJSON: function(a, c, b) {
            return k.get(a, c, b, "json")
        },
        getScript: function(a, c) {
            return k.get(a, g, c, "script")
        }
    });
    k.each(["get", "post"], function(a, c) {
        k[c] = function(a, b, d, h) {
            return k.isFunction(b) && (h = h || d,
            d = b,
            b = g),
            k.ajax({
                url: a,
                type: c,
                dataType: h,
                data: b,
                success: d
            })
        }
    });
    k.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function(a) {
                return k.globalEval(a),
                a
            }
        }
    });
    k.ajaxPrefilter("script", function(a) {
        a.cache === g && (a.cache = !1);
        a.crossDomain && (a.type = "GET",
        a.global = !1)
    });
    k.ajaxTransport("script", function(a) {
        if (a.crossDomain) {
            var c, b = G.head || k("head")[0] || G.documentElement;
            return {
                send: function(d, h) {
                    c = G.createElement("script");
                    c.async = !0;
                    a.scriptCharset && (c.charset = a.scriptCharset);
                    c.src = a.url;
                    c.onload = c.onreadystatechange = function(a, b) {
                        (b || !c.readyState || /loaded|complete/.test(c.readyState)) && (c.onload = c.onreadystatechange = null,
                        c.parentNode && c.parentNode.removeChild(c),
                        c = null,
                        b || h(200, "success"))
                    }
                    ;
                    b.insertBefore(c, b.firstChild)
                },
                abort: function() {
                    c && c.onload(g, !0)
                }
            }
        }
    });
    var vb = []
      , Va = /(=)\?(?=&|$)|\?\?/;
    k.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var a = vb.pop() || k.expando + "_" + Ta++;
            return this[a] = !0,
            a
        }
    });
    k.ajaxPrefilter("json jsonp", function(c, b, d) {
        var h, e, f, m = !1 !== c.jsonp && (Va.test(c.url) ? "url" : "string" == typeof c.data && !(c.contentType || "").indexOf("application/x-www-form-urlencoded") && Va.test(c.data) && "data");
        return m || "jsonp" === c.dataTypes[0] ? (h = c.jsonpCallback = k.isFunction(c.jsonpCallback) ? c.jsonpCallback() : c.jsonpCallback,
        m ? c[m] = c[m].replace(Va, "$1" + h) : !1 !== c.jsonp && (c.url += (Ua.test(c.url) ? "&" : "?") + c.jsonp + "=" + h),
        c.converters["script json"] = function() {
            return f || k.error(h + " was not called"),
            f[0]
        }
        ,
        c.dataTypes[0] = "json",
        e = a[h],
        a[h] = function() {
            f = arguments
        }
        ,
        d.always(function() {
            a[h] = e;
            c[h] && (c.jsonpCallback = b.jsonpCallback,
            vb.push(h));
            f && k.isFunction(e) && e(f[0]);
            f = e = g
        }),
        "script") : g
    });
    var va, wa, lc = 0, Wa = a.ActiveXObject && function() {
        for (var a in va)
            va[a](g, !0)
    }
    ;
    k.ajaxSettings.xhr = a.ActiveXObject ? function() {
        var c;
        if (!(c = !this.isLocal && W()))
            a: {
                try {
                    c = new a.ActiveXObject("Microsoft.XMLHTTP");
                    break a
                } catch (b) {}
                c = void 0
            }
        return c
    }
    : W;
    wa = k.ajaxSettings.xhr();
    k.support.cors = !!wa && "withCredentials"in wa;
    (wa = k.support.ajax = !!wa) && k.ajaxTransport(function(c) {
        if (!c.crossDomain || k.support.cors) {
            var b;
            return {
                send: function(d, h) {
                    var e, f, m = c.xhr();
                    if (c.username ? m.open(c.type, c.url, c.async, c.username, c.password) : m.open(c.type, c.url, c.async),
                    c.xhrFields)
                        for (f in c.xhrFields)
                            m[f] = c.xhrFields[f];
                    c.mimeType && m.overrideMimeType && m.overrideMimeType(c.mimeType);
                    c.crossDomain || d["X-Requested-With"] || (d["X-Requested-With"] = "XMLHttpRequest");
                    try {
                        for (f in d)
                            m.setRequestHeader(f, d[f])
                    } catch (l) {}
                    m.send(c.hasContent && c.data || null);
                    b = function(a, d) {
                        var f, l, n, q;
                        try {
                            if (b && (d || 4 === m.readyState))
                                if (b = g,
                                e && (m.onreadystatechange = k.noop,
                                Wa && delete va[e]),
                                d)
                                    4 !== m.readyState && m.abort();
                                else {
                                    q = {};
                                    f = m.status;
                                    l = m.getAllResponseHeaders();
                                    "string" == typeof m.responseText && (q.text = m.responseText);
                                    try {
                                        n = m.statusText
                                    } catch (p) {
                                        n = ""
                                    }
                                    f || !c.isLocal || c.crossDomain ? 1223 === f && (f = 204) : f = q.text ? 200 : 404
                                }
                        } catch (r) {
                            d || h(-1, r)
                        }
                        q && h(f, n, q, l)
                    }
                    ;
                    c.async ? 4 === m.readyState ? setTimeout(b) : (e = ++lc,
                    Wa && (va || (va = {},
                    k(a).unload(Wa)),
                    va[e] = b),
                    m.onreadystatechange = b) : b()
                },
                abort: function() {
                    b && b(g, !0)
                }
            }
        }
    });
    var pa, Ia, mc = /^(?:toggle|show|hide)$/, wb = RegExp("^(?:([+-])=|)(" + Ca + ")([a-z%]*)$", "i"), nc = /queueHooks$/, ya = [function(a, c, b) {
        var d, h, e, f, g, m = this, l = {}, n = a.style, q = a.nodeType && A(a), p = k._data(a, "fxshow");
        b.queue || (f = k._queueHooks(a, "fx"),
        null == f.unqueued && (f.unqueued = 0,
        g = f.empty.fire,
        f.empty.fire = function() {
            f.unqueued || g()
        }
        ),
        f.unqueued++,
        m.always(function() {
            m.always(function() {
                f.unqueued--;
                k.queue(a, "fx").length || f.empty.fire()
            })
        }));
        1 === a.nodeType && ("height"in c || "width"in c) && (b.overflow = [n.overflow, n.overflowX, n.overflowY],
        "inline" === k.css(a, "display") && "none" === k.css(a, "float") && (k.support.inlineBlockNeedsLayout && "inline" !== L(a.nodeName) ? n.zoom = 1 : n.display = "inline-block"));
        b.overflow && (n.overflow = "hidden",
        k.support.shrinkWrapBlocks || m.always(function() {
            n.overflow = b.overflow[0];
            n.overflowX = b.overflow[1];
            n.overflowY = b.overflow[2]
        }));
        for (d in c)
            (h = c[d],
            mc.exec(h)) && (delete c[d],
            e = e || "toggle" === h,
            h !== (q ? "hide" : "show")) && (l[d] = p && p[d] || k.style(a, d));
        if (!k.isEmptyObject(l))
            for (d in p ? "hidden"in p && (q = p.hidden) : p = k._data(a, "fxshow", {}),
            e && (p.hidden = !q),
            q ? k(a).show() : m.done(function() {
                k(a).hide()
            }),
            m.done(function() {
                var c;
                k._removeData(a, "fxshow");
                for (c in l)
                    k.style(a, c, l[c])
            }),
            l)
                c = D(q ? p[d] : 0, d, m),
                d in p || (p[d] = c.start,
                q && (c.end = c.start,
                c.start = "width" === d || "height" === d ? 1 : 0))
    }
    ], oa = {
        "*": [function(a, c) {
            var b = this.createTween(a, c)
              , d = b.cur()
              , h = wb.exec(c)
              , e = h && h[3] || (k.cssNumber[a] ? "" : "px")
              , f = (k.cssNumber[a] || "px" !== e && +d) && wb.exec(k.css(b.elem, a))
              , g = 1
              , m = 20;
            if (f && f[3] !== e) {
                e = e || f[3];
                h = h || [];
                f = +d || 1;
                do
                    g = g || ".5",
                    f /= g,
                    k.style(b.elem, a, f + e);
                while (g !== (g = b.cur() / d) && 1 !== g && --m)
            }
            return h && (f = b.start = +f || +d || 0,
            b.unit = e,
            b.end = h[1] ? f + (h[1] + 1) * h[2] : +h[2]),
            b
        }
        ]
    };
    k.Animation = k.extend(O, {
        tweener: function(a, c) {
            k.isFunction(a) ? (c = a,
            a = ["*"]) : a = a.split(" ");
            for (var b, d = 0, h = a.length; h > d; d++)
                b = a[d],
                oa[b] = oa[b] || [],
                oa[b].unshift(c)
        },
        prefilter: function(a, c) {
            c ? ya.unshift(a) : ya.push(a)
        }
    });
    k.Tween = Q;
    Q.prototype = {
        constructor: Q,
        init: function(a, c, b, d, h, e) {
            this.elem = a;
            this.prop = b;
            this.easing = h || "swing";
            this.options = c;
            this.start = this.now = this.cur();
            this.end = d;
            this.unit = e || (k.cssNumber[b] ? "" : "px")
        },
        cur: function() {
            var a = Q.propHooks[this.prop];
            return a && a.get ? a.get(this) : Q.propHooks._default.get(this)
        },
        run: function(a) {
            var c, b = Q.propHooks[this.prop];
            return this.pos = c = this.options.duration ? k.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : a,
            this.now = (this.end - this.start) * c + this.start,
            this.options.step && this.options.step.call(this.elem, this.now, this),
            b && b.set ? b.set(this) : Q.propHooks._default.set(this),
            this
        }
    };
    Q.prototype.init.prototype = Q.prototype;
    Q.propHooks = {
        _default: {
            get: function(a) {
                var c;
                return null == a.elem[a.prop] || a.elem.style && null != a.elem.style[a.prop] ? (c = k.css(a.elem, a.prop, ""),
                c && "auto" !== c ? c : 0) : a.elem[a.prop]
            },
            set: function(a) {
                k.fx.step[a.prop] ? k.fx.step[a.prop](a) : a.elem.style && (null != a.elem.style[k.cssProps[a.prop]] || k.cssHooks[a.prop]) ? k.style(a.elem, a.prop, a.now + a.unit) : a.elem[a.prop] = a.now
            }
        }
    };
    Q.propHooks.scrollTop = Q.propHooks.scrollLeft = {
        set: function(a) {
            a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now)
        }
    };
    k.each(["toggle", "show", "hide"], function(a, c) {
        var b = k.fn[c];
        k.fn[c] = function(a, d, h) {
            return null == a || "boolean" == typeof a ? b.apply(this, arguments) : this.animate(ga(c, !0), a, d, h)
        }
    });
    k.fn.extend({
        fadeTo: function(a, c, b, d) {
            return this.filter(A).css("opacity", 0).show().end().animate({
                opacity: c
            }, a, b, d)
        },
        animate: function(a, c, b, d) {
            var h = k.isEmptyObject(a)
              , e = k.speed(c, b, d);
            c = function() {
                var c = O(this, k.extend({}, a), e);
                (h || k._data(this, "finish")) && c.stop(!0)
            }
            ;
            return c.finish = c,
            h || !1 === e.queue ? this.each(c) : this.queue(e.queue, c)
        },
        stop: function(a, c, b) {
            var d = function(a) {
                var c = a.stop;
                delete a.stop;
                c(b)
            };
            return "string" != typeof a && (b = c,
            c = a,
            a = g),
            c && !1 !== a && this.queue(a || "fx", []),
            this.each(function() {
                var c = !0
                  , h = null != a && a + "queueHooks"
                  , e = k.timers
                  , f = k._data(this);
                if (h)
                    f[h] && f[h].stop && d(f[h]);
                else
                    for (h in f)
                        f[h] && f[h].stop && nc.test(h) && d(f[h]);
                for (h = e.length; h--; )
                    e[h].elem !== this || null != a && e[h].queue !== a || (e[h].anim.stop(b),
                    c = !1,
                    e.splice(h, 1));
                !c && b || k.dequeue(this, a)
            })
        },
        finish: function(a) {
            return !1 !== a && (a = a || "fx"),
            this.each(function() {
                var c, b = k._data(this), d = b[a + "queue"];
                c = b[a + "queueHooks"];
                var h = k.timers
                  , e = d ? d.length : 0;
                b.finish = !0;
                k.queue(this, a, []);
                c && c.stop && c.stop.call(this, !0);
                for (c = h.length; c--; )
                    h[c].elem === this && h[c].queue === a && (h[c].anim.stop(!0),
                    h.splice(c, 1));
                for (c = 0; e > c; c++)
                    d[c] && d[c].finish && d[c].finish.call(this);
                delete b.finish
            })
        }
    });
    k.each({
        slideDown: ga("show"),
        slideUp: ga("hide"),
        slideToggle: ga("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(a, c) {
        k.fn[a] = function(a, b, d) {
            return this.animate(c, a, b, d)
        }
    });
    k.speed = function(a, c, b) {
        var d = a && "object" == typeof a ? k.extend({}, a) : {
            complete: b || !b && c || k.isFunction(a) && a,
            duration: a,
            easing: b && c || c && !k.isFunction(c) && c
        };
        return d.duration = k.fx.off ? 0 : "number" == typeof d.duration ? d.duration : d.duration in k.fx.speeds ? k.fx.speeds[d.duration] : k.fx.speeds._default,
        (null == d.queue || !0 === d.queue) && (d.queue = "fx"),
        d.old = d.complete,
        d.complete = function() {
            k.isFunction(d.old) && d.old.call(this);
            d.queue && k.dequeue(this, d.queue)
        }
        ,
        d
    }
    ;
    k.easing = {
        linear: function(a) {
            return a
        },
        swing: function(a) {
            return 0.5 - Math.cos(a * Math.PI) / 2
        }
    };
    k.timers = [];
    k.fx = Q.prototype.init;
    k.fx.tick = function() {
        var a, c = k.timers, b = 0;
        for (pa = k.now(); c.length > b; b++)
            a = c[b],
            a() || c[b] !== a || c.splice(b--, 1);
        c.length || k.fx.stop();
        pa = g
    }
    ;
    k.fx.timer = function(a) {
        a() && k.timers.push(a) && k.fx.start()
    }
    ;
    k.fx.interval = 13;
    k.fx.start = function() {
        Ia || (Ia = setInterval(k.fx.tick, k.fx.interval))
    }
    ;
    k.fx.stop = function() {
        clearInterval(Ia);
        Ia = null
    }
    ;
    k.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    };
    k.fx.step = {};
    k.expr && k.expr.filters && (k.expr.filters.animated = function(a) {
        return k.grep(k.timers, function(c) {
            return a === c.elem
        }).length
    }
    );
    k.fn.offset = function(a) {
        if (arguments.length)
            return a === g ? this : this.each(function(c) {
                k.offset.setOffset(this, a, c)
            });
        var c, b, d = {
            top: 0,
            left: 0
        }, h = this[0], e = h && h.ownerDocument;
        if (e)
            return c = e.documentElement,
            k.contains(c, h) ? (typeof h.getBoundingClientRect !== aa && (d = h.getBoundingClientRect()),
            b = V(e),
            {
                top: d.top + (b.pageYOffset || c.scrollTop) - (c.clientTop || 0),
                left: d.left + (b.pageXOffset || c.scrollLeft) - (c.clientLeft || 0)
            }) : d
    }
    ;
    k.offset = {
        setOffset: function(a, c, b) {
            var d = k.css(a, "position");
            "static" === d && (a.style.position = "relative");
            var h = k(a), e = h.offset(), f = k.css(a, "top"), g = k.css(a, "left"), m = {}, l = {}, n, q;
            ("absolute" === d || "fixed" === d) && -1 < k.inArray("auto", [f, g]) ? (l = h.position(),
            n = l.top,
            q = l.left) : (n = parseFloat(f) || 0,
            q = parseFloat(g) || 0);
            k.isFunction(c) && (c = c.call(a, b, e));
            null != c.top && (m.top = c.top - e.top + n);
            null != c.left && (m.left = c.left - e.left + q);
            "using"in c ? c.using.call(a, m) : h.css(m)
        }
    };
    k.fn.extend({
        position: function() {
            if (this[0]) {
                var a, c, b = {
                    top: 0,
                    left: 0
                }, d = this[0];
                return "fixed" === k.css(d, "position") ? c = d.getBoundingClientRect() : (a = this.offsetParent(),
                c = this.offset(),
                k.nodeName(a[0], "html") || (b = a.offset()),
                b.top += k.css(a[0], "borderTopWidth", !0),
                b.left += k.css(a[0], "borderLeftWidth", !0)),
                {
                    top: c.top - b.top - k.css(d, "marginTop", !0),
                    left: c.left - b.left - k.css(d, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var a = this.offsetParent || Fa; a && !k.nodeName(a, "html") && "static" === k.css(a, "position"); )
                    a = a.offsetParent;
                return a || Fa
            })
        }
    });
    k.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(a, c) {
        var b = /Y/.test(c);
        k.fn[a] = function(d) {
            return k.access(this, function(a, d, h) {
                var e = V(a);
                return h === g ? e ? c in e ? e[c] : e.document.documentElement[d] : a[d] : (e ? e.scrollTo(b ? k(e).scrollLeft() : h, b ? h : k(e).scrollTop()) : a[d] = h,
                g)
            }, a, d, arguments.length, null)
        }
    });
    k.each({
        Height: "height",
        Width: "width"
    }, function(a, c) {
        k.each({
            padding: "inner" + a,
            content: c,
            "": "outer" + a
        }, function(b, d) {
            k.fn[d] = function(d, h) {
                var e = arguments.length && (b || "boolean" != typeof d)
                  , f = b || (!0 === d || !0 === h ? "margin" : "border");
                return k.access(this, function(c, b, d) {
                    var h;
                    return k.isWindow(c) ? c.document.documentElement["client" + a] : 9 === c.nodeType ? (h = c.documentElement,
                    Math.max(c.body["scroll" + a], h["scroll" + a], c.body["offset" + a], h["offset" + a], h["client" + a])) : d === g ? k.css(c, b, f) : k.style(c, b, d, f)
                }, c, e ? d : g, e, null)
            }
        })
    });
    k.fn.size = function() {
        return this.length
    }
    ;
    k.fn.andSelf = k.fn.addBack;
    "object" == typeof module && module && "object" == typeof module.exports ? module.exports = k : (a.jQuery = a.$ = k,
    "function" == typeof define && define.amd && define("jquery", [], function() {
        return k
    }))
}
)(window);
!function(a, g) {
    function f(c, b) {
        var d, f, g, q = c.nodeName.toLowerCase();
        return "area" === q ? (d = c.parentNode,
        f = d.name,
        c.href && f && "map" === d.nodeName.toLowerCase() ? (g = a("img[usemap=#" + f + "]")[0],
        !!g && e(g)) : !1) : (/input|select|textarea|button|object/.test(q) ? !c.disabled : "a" === q ? c.href || b : b) && e(c)
    }
    function e(c) {
        return a.expr.filters.visible(c) && !a(c).parents().addBack().filter(function() {
            return "hidden" === a.css(this, "visibility")
        }).length
    }
    var d = 0
      , b = /^ui-id-\d+$/;
    a.ui = a.ui || {};
    a.extend(a.ui, {
        version: "1.10.3",
        keyCode: {
            BACKSPACE: 8,
            COMMA: 188,
            DELETE: 46,
            DOWN: 40,
            END: 35,
            ENTER: 13,
            ESCAPE: 27,
            HOME: 36,
            LEFT: 37,
            NUMPAD_ADD: 107,
            NUMPAD_DECIMAL: 110,
            NUMPAD_DIVIDE: 111,
            NUMPAD_ENTER: 108,
            NUMPAD_MULTIPLY: 106,
            NUMPAD_SUBTRACT: 109,
            PAGE_DOWN: 34,
            PAGE_UP: 33,
            PERIOD: 190,
            RIGHT: 39,
            SPACE: 32,
            TAB: 9,
            UP: 38
        }
    });
    a.fn.extend({
        focus: function(c) {
            return function(b, d) {
                return "number" == typeof b ? this.each(function() {
                    var c = this;
                    setTimeout(function() {
                        a(c).focus();
                        d && d.call(c)
                    }, b)
                }) : c.apply(this, arguments)
            }
        }(a.fn.focus),
        scrollParent: function() {
            var c;
            return c = a.ui.ie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? this.parents().filter(function() {
                return /(relative|absolute|fixed)/.test(a.css(this, "position")) && /(auto|scroll)/.test(a.css(this, "overflow") + a.css(this, "overflow-y") + a.css(this, "overflow-x"))
            }).eq(0) : this.parents().filter(function() {
                return /(auto|scroll)/.test(a.css(this, "overflow") + a.css(this, "overflow-y") + a.css(this, "overflow-x"))
            }).eq(0),
            /fixed/.test(this.css("position")) || !c.length ? a(document) : c
        },
        zIndex: function(c) {
            if (c !== g)
                return this.css("zIndex", c);
            if (this.length) {
                var b, d;
                for (c = a(this[0]); c.length && c[0] !== document; ) {
                    if (b = c.css("position"),
                    ("absolute" === b || "relative" === b || "fixed" === b) && (d = parseInt(c.css("zIndex"), 10),
                    !isNaN(d) && 0 !== d))
                        return d;
                    c = c.parent()
                }
            }
            return 0
        },
        uniqueId: function() {
            return this.each(function() {
                this.id || (this.id = "ui-id-" + ++d)
            })
        },
        removeUniqueId: function() {
            return this.each(function() {
                b.test(this.id) && a(this).removeAttr("id")
            })
        }
    });
    a.extend(a.expr[":"], {
        data: a.expr.createPseudo ? a.expr.createPseudo(function(c) {
            return function(b) {
                return !!a.data(b, c)
            }
        }) : function(c, b, d) {
            return !!a.data(c, d[3])
        }
        ,
        focusable: function(c) {
            return f(c, !isNaN(a.attr(c, "tabindex")))
        },
        tabbable: function(c) {
            var b = a.attr(c, "tabindex")
              , d = isNaN(b);
            return (d || 0 <= b) && f(c, !d)
        }
    });
    a("<a>").outerWidth(1).jquery || a.each(["Width", "Height"], function(c, b) {
        function d(c, b, h, f) {
            return a.each(e, function() {
                b -= parseFloat(a.css(c, "padding" + this)) || 0;
                h && (b -= parseFloat(a.css(c, "border" + this + "Width")) || 0);
                f && (b -= parseFloat(a.css(c, "margin" + this)) || 0)
            }),
            b
        }
        var e = "Width" === b ? ["Left", "Right"] : ["Top", "Bottom"]
          , f = b.toLowerCase()
          , q = {
            innerWidth: a.fn.innerWidth,
            innerHeight: a.fn.innerHeight,
            outerWidth: a.fn.outerWidth,
            outerHeight: a.fn.outerHeight
        };
        a.fn["inner" + b] = function(c) {
            return c === g ? q["inner" + b].call(this) : this.each(function() {
                a(this).css(f, d(this, c) + "px")
            })
        }
        ;
        a.fn["outer" + b] = function(c, e) {
            return "number" != typeof c ? q["outer" + b].call(this, c) : this.each(function() {
                a(this).css(f, d(this, c, !0, e) + "px")
            })
        }
    });
    a.fn.addBack || (a.fn.addBack = function(a) {
        return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
    }
    );
    a("<a>").data("a-b", "a").removeData("a-b").data("a-b") && (a.fn.removeData = function(c) {
        return function(b) {
            return arguments.length ? c.call(this, a.camelCase(b)) : c.call(this)
        }
    }(a.fn.removeData));
    a.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase());
    a.support.selectstart = "onselectstart"in document.createElement("div");
    a.fn.extend({
        disableSelection: function() {
            return this.bind((a.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function(a) {
                a.preventDefault()
            })
        },
        enableSelection: function() {
            return this.unbind(".ui-disableSelection")
        }
    });
    a.extend(a.ui, {
        plugin: {
            add: function(c, b, d) {
                var e;
                c = a.ui[c].prototype;
                for (e in d)
                    c.plugins[e] = c.plugins[e] || [],
                    c.plugins[e].push([b, d[e]])
            },
            call: function(a, b, d) {
                var e = a.plugins[b];
                if (e && a.element[0].parentNode && 11 !== a.element[0].parentNode.nodeType)
                    for (b = 0; b < e.length; b++)
                        a.options[e[b][0]] && e[b][1].apply(a.element, d)
            }
        },
        hasScroll: function(c, b) {
            if ("hidden" === a(c).css("overflow"))
                return !1;
            var d = b && "left" === b ? "scrollLeft" : "scrollTop"
              , e = !1;
            return 0 < c[d] ? !0 : (c[d] = 1,
            e = 0 < c[d],
            c[d] = 0,
            e)
        }
    })
}(jQuery);
(function(a, g) {
    var f = 0
      , e = Array.prototype.slice
      , d = a.cleanData;
    a.cleanData = function(b) {
        for (var c, h = 0; null != (c = b[h]); h++)
            try {
                a(c).triggerHandler("remove")
            } catch (e) {}
        d(b)
    }
    ;
    a.widget = function(b, c, d) {
        var e, f, g, q, p = {}, r = b.split(".")[0];
        b = b.split(".")[1];
        e = r + "-" + b;
        d || (d = c,
        c = a.Widget);
        a.expr[":"][e.toLowerCase()] = function(c) {
            return !!a.data(c, e)
        }
        ;
        a[r] = a[r] || {};
        f = a[r][b];
        g = a[r][b] = function(a, c) {
            return this._createWidget ? (arguments.length && this._createWidget(a, c),
            void 0) : new g(a,c)
        }
        ;
        a.extend(g, f, {
            version: d.version,
            _proto: a.extend({}, d),
            _childConstructors: []
        });
        q = new c;
        q.options = a.widget.extend({}, q.options);
        a.each(d, function(b, d) {
            return a.isFunction(d) ? (p[b] = function() {
                var a = function() {
                    return c.prototype[b].apply(this, arguments)
                }
                  , h = function(a) {
                    return c.prototype[b].apply(this, a)
                };
                return function() {
                    var c, b = this._super, e = this._superApply;
                    return this._super = a,
                    this._superApply = h,
                    c = d.apply(this, arguments),
                    this._super = b,
                    this._superApply = e,
                    c
                }
            }(),
            void 0) : (p[b] = d,
            void 0)
        });
        g.prototype = a.widget.extend(q, {
            widgetEventPrefix: f ? q.widgetEventPrefix : b
        }, p, {
            constructor: g,
            namespace: r,
            widgetName: b,
            widgetFullName: e
        });
        f ? (a.each(f._childConstructors, function(c, b) {
            var d = b.prototype;
            a.widget(d.namespace + "." + d.widgetName, g, b._proto)
        }),
        delete f._childConstructors) : c._childConstructors.push(g);
        a.widget.bridge(b, g)
    }
    ;
    a.widget.extend = function(b) {
        for (var c, d, f = e.call(arguments, 1), l = 0, n = f.length; n > l; l++)
            for (c in f[l])
                d = f[l][c],
                f[l].hasOwnProperty(c) && d !== g && (b[c] = a.isPlainObject(d) ? a.isPlainObject(b[c]) ? a.widget.extend({}, b[c], d) : a.widget.extend({}, d) : d);
        return b
    }
    ;
    a.widget.bridge = function(b, c) {
        var d = c.prototype.widgetFullName || b;
        a.fn[b] = function(f) {
            var l = "string" == typeof f
              , n = e.call(arguments, 1)
              , q = this;
            return f = !l && n.length ? a.widget.extend.apply(null, [f].concat(n)) : f,
            l ? this.each(function() {
                var c, e = a.data(this, d);
                return e ? a.isFunction(e[f]) && "_" !== f.charAt(0) ? (c = e[f].apply(e, n),
                c !== e && c !== g ? (q = c && c.jquery ? q.pushStack(c.get()) : c,
                !1) : void 0) : a.error("no such method '" + f + "' for " + b + " widget instance") : a.error("cannot call methods on " + b + " prior to initialization; attempted to call method '" + f + "'")
            }) : this.each(function() {
                var b = a.data(this, d);
                b ? b.option(f || {})._init() : a.data(this, d, new c(f,this))
            }),
            q
        }
    }
    ;
    a.Widget = function() {}
    ;
    a.Widget._childConstructors = [];
    a.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        defaultElement: "<div>",
        options: {
            disabled: !1,
            create: null
        },
        _createWidget: function(b, c) {
            c = a(c || this.defaultElement || this)[0];
            this.element = a(c);
            this.uuid = f++;
            this.eventNamespace = "." + this.widgetName + this.uuid;
            this.options = a.widget.extend({}, this.options, this._getCreateOptions(), b);
            this.bindings = a();
            this.hoverable = a();
            this.focusable = a();
            c !== this && (a.data(c, this.widgetFullName, this),
            this._on(!0, this.element, {
                remove: function(a) {
                    a.target === c && this.destroy()
                }
            }),
            this.document = a(c.style ? c.ownerDocument : c.document || c),
            this.window = a(this.document[0].defaultView || this.document[0].parentWindow));
            this._create();
            this._trigger("create", null, this._getCreateEventData());
            this._init()
        },
        _getCreateOptions: a.noop,
        _getCreateEventData: a.noop,
        _create: a.noop,
        _init: a.noop,
        destroy: function() {
            this._destroy();
            this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(a.camelCase(this.widgetFullName));
            this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled ui-state-disabled");
            this.bindings.unbind(this.eventNamespace);
            this.hoverable.removeClass("ui-state-hover");
            this.focusable.removeClass("ui-state-focus")
        },
        _destroy: a.noop,
        widget: function() {
            return this.element
        },
        option: function(b, c) {
            var d, e, f, n = b;
            if (0 === arguments.length)
                return a.widget.extend({}, this.options);
            if ("string" == typeof b)
                if (n = {},
                d = b.split("."),
                b = d.shift(),
                d.length) {
                    e = n[b] = a.widget.extend({}, this.options[b]);
                    for (f = 0; f < d.length - 1; f++)
                        e[d[f]] = e[d[f]] || {},
                        e = e[d[f]];
                    if (b = d.pop(),
                    c === g)
                        return e[b] === g ? null : e[b];
                    e[b] = c
                } else {
                    if (c === g)
                        return this.options[b] === g ? null : this.options[b];
                    n[b] = c
                }
            return this._setOptions(n),
            this
        },
        _setOptions: function(a) {
            for (var c in a)
                this._setOption(c, a[c]);
            return this
        },
        _setOption: function(a, c) {
            return this.options[a] = c,
            "disabled" === a && (this.widget().toggleClass(this.widgetFullName + "-disabled ui-state-disabled", !!c).attr("aria-disabled", c),
            this.hoverable.removeClass("ui-state-hover"),
            this.focusable.removeClass("ui-state-focus")),
            this
        },
        enable: function() {
            return this._setOption("disabled", !1)
        },
        disable: function() {
            return this._setOption("disabled", !0)
        },
        _on: function(b, c, d) {
            var e, f = this;
            "boolean" != typeof b && (d = c,
            c = b,
            b = !1);
            d ? (c = e = a(c),
            this.bindings = this.bindings.add(c)) : (d = c,
            c = this.element,
            e = this.widget());
            a.each(d, function(d, h) {
                function g() {
                    return b || !0 !== f.options.disabled && !a(this).hasClass("ui-state-disabled") ? ("string" == typeof h ? f[h] : h).apply(f, arguments) : void 0
                }
                "string" != typeof h && (g.guid = h.guid = h.guid || g.guid || a.guid++);
                var r = d.match(/^(\w+)\s*(.*)$/)
                  , s = r[1] + f.eventNamespace;
                (r = r[2]) ? e.delegate(r, s, g) : c.bind(s, g)
            })
        },
        _off: function(a, c) {
            c = (c || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace;
            a.unbind(c).undelegate(c)
        },
        _delay: function(a, c) {
            var d = this;
            return setTimeout(function() {
                return ("string" == typeof a ? d[a] : a).apply(d, arguments)
            }, c || 0)
        },
        _hoverable: function(b) {
            this.hoverable = this.hoverable.add(b);
            this._on(b, {
                mouseenter: function(c) {
                    a(c.currentTarget).addClass("ui-state-hover")
                },
                mouseleave: function(c) {
                    a(c.currentTarget).removeClass("ui-state-hover")
                }
            })
        },
        _focusable: function(b) {
            this.focusable = this.focusable.add(b);
            this._on(b, {
                focusin: function(c) {
                    a(c.currentTarget).addClass("ui-state-focus")
                },
                focusout: function(c) {
                    a(c.currentTarget).removeClass("ui-state-focus")
                }
            })
        },
        _trigger: function(b, c, d) {
            var e, f = this.options[b];
            if (d = d || {},
            c = a.Event(c),
            c.type = (b === this.widgetEventPrefix ? b : this.widgetEventPrefix + b).toLowerCase(),
            c.target = this.element[0],
            b = c.originalEvent)
                for (e in b)
                    e in c || (c[e] = b[e]);
            return this.element.trigger(c, d),
            !(a.isFunction(f) && !1 === f.apply(this.element[0], [c].concat(d)) || c.isDefaultPrevented())
        }
    };
    a.each({
        show: "fadeIn",
        hide: "fadeOut"
    }, function(b, c) {
        a.Widget.prototype["_" + b] = function(d, e, f) {
            "string" == typeof e && (e = {
                effect: e
            });
            var g, q = e ? !0 === e || "number" == typeof e ? c : e.effect || c : b;
            e = e || {};
            "number" == typeof e && (e = {
                duration: e
            });
            g = !a.isEmptyObject(e);
            e.complete = f;
            e.delay && d.delay(e.delay);
            g && a.effects && a.effects.effect[q] ? d[b](e) : q !== b && d[q] ? d[q](e.duration, e.easing, f) : d.queue(function(c) {
                a(this)[b]();
                f && f.call(d[0]);
                c()
            })
        }
    })
}
)(jQuery);
(function(a) {
    var g = !1;
    a(document).mouseup(function() {
        g = !1
    });
    a.widget("ui.mouse", {
        version: "1.10.3",
        options: {
            cancel: "input,textarea,button,select,option",
            distance: 1,
            delay: 0
        },
        _mouseInit: function() {
            var f = this;
            this.element.bind("mousedown." + this.widgetName, function(a) {
                return f._mouseDown(a)
            }).bind("click." + this.widgetName, function(e) {
                return !0 === a.data(e.target, f.widgetName + ".preventClickEvent") ? (a.removeData(e.target, f.widgetName + ".preventClickEvent"),
                e.stopImmediatePropagation(),
                !1) : void 0
            });
            this.started = !1
        },
        _mouseDestroy: function() {
            this.element.unbind("." + this.widgetName);
            this._mouseMoveDelegate && a(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate)
        },
        _mouseDown: function(f) {
            if (!g) {
                this._mouseStarted && this._mouseUp(f);
                this._mouseDownEvent = f;
                var e = this
                  , d = 1 === f.which
                  , b = "string" == typeof this.options.cancel && f.target.nodeName ? a(f.target).closest(this.options.cancel).length : !1;
                return d && !b && this._mouseCapture(f) ? (this.mouseDelayMet = !this.options.delay,
                this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function() {
                    e.mouseDelayMet = !0
                }, this.options.delay)),
                this._mouseDistanceMet(f) && this._mouseDelayMet(f) && (this._mouseStarted = !1 !== this._mouseStart(f),
                !this._mouseStarted) ? (f.preventDefault(),
                !0) : (!0 === a.data(f.target, this.widgetName + ".preventClickEvent") && a.removeData(f.target, this.widgetName + ".preventClickEvent"),
                this._mouseMoveDelegate = function(a) {
                    return e._mouseMove(a)
                }
                ,
                this._mouseUpDelegate = function(a) {
                    return e._mouseUp(a)
                }
                ,
                a(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate),
                f.preventDefault(),
                g = !0,
                !0)) : !0
            }
        },
        _mouseMove: function(f) {
            return a.ui.ie && (!document.documentMode || 9 > document.documentMode) && !f.button ? this._mouseUp(f) : this._mouseStarted ? (this._mouseDrag(f),
            f.preventDefault()) : (this._mouseDistanceMet(f) && this._mouseDelayMet(f) && (this._mouseStarted = !1 !== this._mouseStart(this._mouseDownEvent, f),
            this._mouseStarted ? this._mouseDrag(f) : this._mouseUp(f)),
            !this._mouseStarted)
        },
        _mouseUp: function(f) {
            return a(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate),
            this._mouseStarted && (this._mouseStarted = !1,
            f.target === this._mouseDownEvent.target && a.data(f.target, this.widgetName + ".preventClickEvent", !0),
            this._mouseStop(f)),
            !1
        },
        _mouseDistanceMet: function(a) {
            return Math.max(Math.abs(this._mouseDownEvent.pageX - a.pageX), Math.abs(this._mouseDownEvent.pageY - a.pageY)) >= this.options.distance
        },
        _mouseDelayMet: function() {
            return this.mouseDelayMet
        },
        _mouseStart: function() {},
        _mouseDrag: function() {},
        _mouseStop: function() {},
        _mouseCapture: function() {
            return !0
        }
    })
}
)(jQuery);
(function(a) {
    a.widget("ui.draggable", a.ui.mouse, {
        version: "1.10.3",
        widgetEventPrefix: "drag",
        options: {
            addClasses: !0,
            appendTo: "parent",
            axis: !1,
            connectToSortable: !1,
            containment: !1,
            cursor: "auto",
            cursorAt: !1,
            grid: !1,
            handle: !1,
            helper: "original",
            iframeFix: !1,
            opacity: !1,
            refreshPositions: !1,
            revert: !1,
            revertDuration: 500,
            scope: "default",
            scroll: !0,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            snap: !1,
            snapMode: "both",
            snapTolerance: 20,
            stack: !1,
            zIndex: !1,
            drag: null,
            start: null,
            stop: null
        },
        _create: function() {
            "original" !== this.options.helper || /^(?:r|a|f)/.test(this.element.css("position")) || (this.element[0].style.position = "relative");
            this.options.addClasses && this.element.addClass("ui-draggable");
            this.options.disabled && this.element.addClass("ui-draggable-disabled");
            this._mouseInit()
        },
        _destroy: function() {
            this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled");
            this._mouseDestroy()
        },
        _mouseCapture: function(g) {
            var f = this.options;
            return this.helper || f.disabled || 0 < a(g.target).closest(".ui-resizable-handle").length ? !1 : (this.handle = this._getHandle(g),
            this.handle ? (a(!0 === f.iframeFix ? "iframe" : f.iframeFix).each(function() {
                a("<div class='ui-draggable-iframeFix' style='background: #fff;'></div>").css({
                    width: this.offsetWidth + "px",
                    height: this.offsetHeight + "px",
                    position: "absolute",
                    opacity: "0.001",
                    zIndex: 1E3
                }).css(a(this).offset()).appendTo("body")
            }),
            !0) : !1)
        },
        _mouseStart: function(g) {
            var f = this.options;
            return this.helper = this._createHelper(g),
            this.helper.addClass("ui-draggable-dragging"),
            this._cacheHelperProportions(),
            a.ui.ddmanager && (a.ui.ddmanager.current = this),
            this._cacheMargins(),
            this.cssPosition = this.helper.css("position"),
            this.scrollParent = this.helper.scrollParent(),
            this.offsetParent = this.helper.offsetParent(),
            this.offsetParentCssPosition = this.offsetParent.css("position"),
            this.offset = this.positionAbs = this.element.offset(),
            this.offset = {
                top: this.offset.top - this.margins.top,
                left: this.offset.left - this.margins.left
            },
            this.offset.scroll = !1,
            a.extend(this.offset, {
                click: {
                    left: g.pageX - this.offset.left,
                    top: g.pageY - this.offset.top
                },
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset()
            }),
            this.originalPosition = this.position = this._generatePosition(g),
            this.originalPageX = g.pageX,
            this.originalPageY = g.pageY,
            f.cursorAt && this._adjustOffsetFromHelper(f.cursorAt),
            this._setContainment(),
            !1 === this._trigger("start", g) ? (this._clear(),
            !1) : (this._cacheHelperProportions(),
            a.ui.ddmanager && !f.dropBehaviour && a.ui.ddmanager.prepareOffsets(this, g),
            this._mouseDrag(g, !0),
            a.ui.ddmanager && a.ui.ddmanager.dragStart(this, g),
            !0)
        },
        _mouseDrag: function(g, f) {
            if ("fixed" === this.offsetParentCssPosition && (this.offset.parent = this._getParentOffset()),
            this.position = this._generatePosition(g),
            this.positionAbs = this._convertPositionTo("absolute"),
            !f) {
                var e = this._uiHash();
                if (!1 === this._trigger("drag", g, e))
                    return this._mouseUp({}),
                    !1;
                this.position = e.position
            }
            return this.options.axis && "y" === this.options.axis || (this.helper[0].style.left = this.position.left + "px"),
            this.options.axis && "x" === this.options.axis || (this.helper[0].style.top = this.position.top + "px"),
            a.ui.ddmanager && a.ui.ddmanager.drag(this, g),
            !1
        },
        _mouseStop: function(g) {
            var f = this
              , e = !1;
            return a.ui.ddmanager && !this.options.dropBehaviour && (e = a.ui.ddmanager.drop(this, g)),
            this.dropped && (e = this.dropped,
            this.dropped = !1),
            "original" !== this.options.helper || a.contains(this.element[0].ownerDocument, this.element[0]) ? ("invalid" === this.options.revert && !e || "valid" === this.options.revert && e || !0 === this.options.revert || a.isFunction(this.options.revert) && this.options.revert.call(this.element, e) ? a(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
                !1 !== f._trigger("stop", g) && f._clear()
            }) : !1 !== this._trigger("stop", g) && this._clear(),
            !1) : !1
        },
        _mouseUp: function(g) {
            return a("div.ui-draggable-iframeFix").each(function() {
                this.parentNode.removeChild(this)
            }),
            a.ui.ddmanager && a.ui.ddmanager.dragStop(this, g),
            a.ui.mouse.prototype._mouseUp.call(this, g)
        },
        cancel: function() {
            return this.helper.is(".ui-draggable-dragging") ? this._mouseUp({}) : this._clear(),
            this
        },
        _getHandle: function(g) {
            return this.options.handle ? !!a(g.target).closest(this.element.find(this.options.handle)).length : !0
        },
        _createHelper: function(g) {
            var f = this.options;
            g = a.isFunction(f.helper) ? a(f.helper.apply(this.element[0], [g])) : "clone" === f.helper ? this.element.clone().removeAttr("id") : this.element;
            return g.parents("body").length || g.appendTo("parent" === f.appendTo ? this.element[0].parentNode : f.appendTo),
            g[0] === this.element[0] || /(fixed|absolute)/.test(g.css("position")) || g.css("position", "absolute"),
            g
        },
        _adjustOffsetFromHelper: function(g) {
            "string" == typeof g && (g = g.split(" "));
            a.isArray(g) && (g = {
                left: +g[0],
                top: +g[1] || 0
            });
            "left"in g && (this.offset.click.left = g.left + this.margins.left);
            "right"in g && (this.offset.click.left = this.helperProportions.width - g.right + this.margins.left);
            "top"in g && (this.offset.click.top = g.top + this.margins.top);
            "bottom"in g && (this.offset.click.top = this.helperProportions.height - g.bottom + this.margins.top)
        },
        _getParentOffset: function() {
            var g = this.offsetParent.offset();
            return "absolute" === this.cssPosition && this.scrollParent[0] !== document && a.contains(this.scrollParent[0], this.offsetParent[0]) && (g.left += this.scrollParent.scrollLeft(),
            g.top += this.scrollParent.scrollTop()),
            (this.offsetParent[0] === document.body || this.offsetParent[0].tagName && "html" === this.offsetParent[0].tagName.toLowerCase() && a.ui.ie) && (g = {
                top: 0,
                left: 0
            }),
            {
                top: g.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                left: g.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
            }
        },
        _getRelativeOffset: function() {
            if ("relative" === this.cssPosition) {
                var a = this.element.position();
                return {
                    top: a.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
                    left: a.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
                }
            }
            return {
                top: 0,
                left: 0
            }
        },
        _cacheMargins: function() {
            this.margins = {
                left: parseInt(this.element.css("marginLeft"), 10) || 0,
                top: parseInt(this.element.css("marginTop"), 10) || 0,
                right: parseInt(this.element.css("marginRight"), 10) || 0,
                bottom: parseInt(this.element.css("marginBottom"), 10) || 0
            }
        },
        _cacheHelperProportions: function() {
            this.helperProportions = {
                width: this.helper.outerWidth(),
                height: this.helper.outerHeight()
            }
        },
        _setContainment: function() {
            var g, f, e, d = this.options;
            return d.containment ? "window" === d.containment ? (this.containment = [a(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left, a(window).scrollTop() - this.offset.relative.top - this.offset.parent.top, a(window).scrollLeft() + a(window).width() - this.helperProportions.width - this.margins.left, a(window).scrollTop() + (a(window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top],
            void 0) : "document" === d.containment ? (this.containment = [0, 0, a(document).width() - this.helperProportions.width - this.margins.left, (a(document).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top],
            void 0) : d.containment.constructor === Array ? (this.containment = d.containment,
            void 0) : ("parent" === d.containment && (d.containment = this.helper[0].parentNode),
            f = a(d.containment),
            e = f[0],
            e && (g = "hidden" !== f.css("overflow"),
            this.containment = [(parseInt(f.css("borderLeftWidth"), 10) || 0) + (parseInt(f.css("paddingLeft"), 10) || 0), (parseInt(f.css("borderTopWidth"), 10) || 0) + (parseInt(f.css("paddingTop"), 10) || 0), (g ? Math.max(e.scrollWidth, e.offsetWidth) : e.offsetWidth) - (parseInt(f.css("borderRightWidth"), 10) || 0) - (parseInt(f.css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, (g ? Math.max(e.scrollHeight, e.offsetHeight) : e.offsetHeight) - (parseInt(f.css("borderBottomWidth"), 10) || 0) - (parseInt(f.css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom],
            this.relative_container = f),
            void 0) : (this.containment = null,
            void 0)
        },
        _convertPositionTo: function(g, f) {
            f || (f = this.position);
            var e = "absolute" === g ? 1 : -1
              , d = "absolute" !== this.cssPosition || this.scrollParent[0] !== document && a.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent;
            return this.offset.scroll || (this.offset.scroll = {
                top: d.scrollTop(),
                left: d.scrollLeft()
            }),
            {
                top: f.top + this.offset.relative.top * e + this.offset.parent.top * e - ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() : this.offset.scroll.top) * e,
                left: f.left + this.offset.relative.left * e + this.offset.parent.left * e - ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : this.offset.scroll.left) * e
            }
        },
        _generatePosition: function(g) {
            var f, e, d, b, c = this.options, h = "absolute" !== this.cssPosition || this.scrollParent[0] !== document && a.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent, m = g.pageX, l = g.pageY;
            return this.offset.scroll || (this.offset.scroll = {
                top: h.scrollTop(),
                left: h.scrollLeft()
            }),
            this.originalPosition && (this.containment && (this.relative_container ? (e = this.relative_container.offset(),
            f = [this.containment[0] + e.left, this.containment[1] + e.top, this.containment[2] + e.left, this.containment[3] + e.top]) : f = this.containment,
            g.pageX - this.offset.click.left < f[0] && (m = f[0] + this.offset.click.left),
            g.pageY - this.offset.click.top < f[1] && (l = f[1] + this.offset.click.top),
            g.pageX - this.offset.click.left > f[2] && (m = f[2] + this.offset.click.left),
            g.pageY - this.offset.click.top > f[3] && (l = f[3] + this.offset.click.top)),
            c.grid && (d = c.grid[1] ? this.originalPageY + Math.round((l - this.originalPageY) / c.grid[1]) * c.grid[1] : this.originalPageY,
            l = f ? d - this.offset.click.top >= f[1] || d - this.offset.click.top > f[3] ? d : d - this.offset.click.top >= f[1] ? d - c.grid[1] : d + c.grid[1] : d,
            b = c.grid[0] ? this.originalPageX + Math.round((m - this.originalPageX) / c.grid[0]) * c.grid[0] : this.originalPageX,
            m = f ? b - this.offset.click.left >= f[0] || b - this.offset.click.left > f[2] ? b : b - this.offset.click.left >= f[0] ? b - c.grid[0] : b + c.grid[0] : b)),
            {
                top: l - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() : this.offset.scroll.top),
                left: m - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : this.offset.scroll.left)
            }
        },
        _clear: function() {
            this.helper.removeClass("ui-draggable-dragging");
            this.helper[0] === this.element[0] || this.cancelHelperRemoval || this.helper.remove();
            this.helper = null;
            this.cancelHelperRemoval = !1
        },
        _trigger: function(g, f, e) {
            return e = e || this._uiHash(),
            a.ui.plugin.call(this, g, [f, e]),
            "drag" === g && (this.positionAbs = this._convertPositionTo("absolute")),
            a.Widget.prototype._trigger.call(this, g, f, e)
        },
        plugins: {},
        _uiHash: function() {
            return {
                helper: this.helper,
                position: this.position,
                originalPosition: this.originalPosition,
                offset: this.positionAbs
            }
        }
    });
    a.ui.plugin.add("draggable", "connectToSortable", {
        start: function(g, f) {
            var e = a(this).data("ui-draggable")
              , d = e.options
              , b = a.extend({}, f, {
                item: e.element
            });
            e.sortables = [];
            a(d.connectToSortable).each(function() {
                var c = a.data(this, "ui-sortable");
                c && !c.options.disabled && (e.sortables.push({
                    instance: c,
                    shouldRevert: c.options.revert
                }),
                c.refreshPositions(),
                c._trigger("activate", g, b))
            })
        },
        stop: function(g, f) {
            var e = a(this).data("ui-draggable")
              , d = a.extend({}, f, {
                item: e.element
            });
            a.each(e.sortables, function() {
                this.instance.isOver ? (this.instance.isOver = 0,
                e.cancelHelperRemoval = !0,
                this.instance.cancelHelperRemoval = !1,
                this.shouldRevert && (this.instance.options.revert = this.shouldRevert),
                this.instance._mouseStop(g),
                this.instance.options.helper = this.instance.options._helper,
                "original" === e.options.helper && this.instance.currentItem.css({
                    top: "auto",
                    left: "auto"
                })) : (this.instance.cancelHelperRemoval = !1,
                this.instance._trigger("deactivate", g, d))
            })
        },
        drag: function(g, f) {
            var e = a(this).data("ui-draggable")
              , d = this;
            a.each(e.sortables, function() {
                var b = !1
                  , c = this;
                this.instance.positionAbs = e.positionAbs;
                this.instance.helperProportions = e.helperProportions;
                this.instance.offset.click = e.offset.click;
                this.instance._intersectsWith(this.instance.containerCache) && (b = !0,
                a.each(e.sortables, function() {
                    return this.instance.positionAbs = e.positionAbs,
                    this.instance.helperProportions = e.helperProportions,
                    this.instance.offset.click = e.offset.click,
                    this !== c && this.instance._intersectsWith(this.instance.containerCache) && a.contains(c.instance.element[0], this.instance.element[0]) && (b = !1),
                    b
                }));
                b ? (this.instance.isOver || (this.instance.isOver = 1,
                this.instance.currentItem = a(d).clone().removeAttr("id").appendTo(this.instance.element).data("ui-sortable-item", !0),
                this.instance.options._helper = this.instance.options.helper,
                this.instance.options.helper = function() {
                    return f.helper[0]
                }
                ,
                g.target = this.instance.currentItem[0],
                this.instance._mouseCapture(g, !0),
                this.instance._mouseStart(g, !0, !0),
                this.instance.offset.click.top = e.offset.click.top,
                this.instance.offset.click.left = e.offset.click.left,
                this.instance.offset.parent.left -= e.offset.parent.left - this.instance.offset.parent.left,
                this.instance.offset.parent.top -= e.offset.parent.top - this.instance.offset.parent.top,
                e._trigger("toSortable", g),
                e.dropped = this.instance.element,
                e.currentItem = e.element,
                this.instance.fromOutside = e),
                this.instance.currentItem && this.instance._mouseDrag(g)) : this.instance.isOver && (this.instance.isOver = 0,
                this.instance.cancelHelperRemoval = !0,
                this.instance.options.revert = !1,
                this.instance._trigger("out", g, this.instance._uiHash(this.instance)),
                this.instance._mouseStop(g, !0),
                this.instance.options.helper = this.instance.options._helper,
                this.instance.currentItem.remove(),
                this.instance.placeholder && this.instance.placeholder.remove(),
                e._trigger("fromSortable", g),
                e.dropped = !1)
            })
        }
    });
    a.ui.plugin.add("draggable", "cursor", {
        start: function() {
            var g = a("body")
              , f = a(this).data("ui-draggable").options;
            g.css("cursor") && (f._cursor = g.css("cursor"));
            g.css("cursor", f.cursor)
        },
        stop: function() {
            var g = a(this).data("ui-draggable").options;
            g._cursor && a("body").css("cursor", g._cursor)
        }
    });
    a.ui.plugin.add("draggable", "opacity", {
        start: function(g, f) {
            var e = a(f.helper)
              , d = a(this).data("ui-draggable").options;
            e.css("opacity") && (d._opacity = e.css("opacity"));
            e.css("opacity", d.opacity)
        },
        stop: function(g, f) {
            var e = a(this).data("ui-draggable").options;
            e._opacity && a(f.helper).css("opacity", e._opacity)
        }
    });
    a.ui.plugin.add("draggable", "scroll", {
        start: function() {
            var g = a(this).data("ui-draggable");
            g.scrollParent[0] !== document && "HTML" !== g.scrollParent[0].tagName && (g.overflowOffset = g.scrollParent.offset())
        },
        drag: function(g) {
            var f = a(this).data("ui-draggable")
              , e = f.options
              , d = !1;
            f.scrollParent[0] !== document && "HTML" !== f.scrollParent[0].tagName ? (e.axis && "x" === e.axis || (f.overflowOffset.top + f.scrollParent[0].offsetHeight - g.pageY < e.scrollSensitivity ? f.scrollParent[0].scrollTop = d = f.scrollParent[0].scrollTop + e.scrollSpeed : g.pageY - f.overflowOffset.top < e.scrollSensitivity && (f.scrollParent[0].scrollTop = d = f.scrollParent[0].scrollTop - e.scrollSpeed)),
            e.axis && "y" === e.axis || (f.overflowOffset.left + f.scrollParent[0].offsetWidth - g.pageX < e.scrollSensitivity ? f.scrollParent[0].scrollLeft = d = f.scrollParent[0].scrollLeft + e.scrollSpeed : g.pageX - f.overflowOffset.left < e.scrollSensitivity && (f.scrollParent[0].scrollLeft = d = f.scrollParent[0].scrollLeft - e.scrollSpeed))) : (e.axis && "x" === e.axis || (g.pageY - a(document).scrollTop() < e.scrollSensitivity ? d = a(document).scrollTop(a(document).scrollTop() - e.scrollSpeed) : a(window).height() - (g.pageY - a(document).scrollTop()) < e.scrollSensitivity && (d = a(document).scrollTop(a(document).scrollTop() + e.scrollSpeed))),
            e.axis && "y" === e.axis || (g.pageX - a(document).scrollLeft() < e.scrollSensitivity ? d = a(document).scrollLeft(a(document).scrollLeft() - e.scrollSpeed) : a(window).width() - (g.pageX - a(document).scrollLeft()) < e.scrollSensitivity && (d = a(document).scrollLeft(a(document).scrollLeft() + e.scrollSpeed))));
            !1 !== d && a.ui.ddmanager && !e.dropBehaviour && a.ui.ddmanager.prepareOffsets(f, g)
        }
    });
    a.ui.plugin.add("draggable", "snap", {
        start: function() {
            var g = a(this).data("ui-draggable")
              , f = g.options;
            g.snapElements = [];
            a(f.snap.constructor !== String ? f.snap.items || ":data(ui-draggable)" : f.snap).each(function() {
                var e = a(this)
                  , d = e.offset();
                this !== g.element[0] && g.snapElements.push({
                    item: this,
                    width: e.outerWidth(),
                    height: e.outerHeight(),
                    top: d.top,
                    left: d.left
                })
            })
        },
        drag: function(g, f) {
            var e, d, b, c, h, m, l, n, q, p, r = a(this).data("ui-draggable"), s = r.options, u = s.snapTolerance, v = f.offset.left, x = v + r.helperProportions.width, B = f.offset.top, C = B + r.helperProportions.height;
            for (q = r.snapElements.length - 1; 0 <= q; q--)
                h = r.snapElements[q].left,
                m = h + r.snapElements[q].width,
                l = r.snapElements[q].top,
                n = l + r.snapElements[q].height,
                h - u > x || v > m + u || l - u > C || B > n + u || !a.contains(r.snapElements[q].item.ownerDocument, r.snapElements[q].item) ? (r.snapElements[q].snapping && r.options.snap.release && r.options.snap.release.call(r.element, g, a.extend(r._uiHash(), {
                    snapItem: r.snapElements[q].item
                })),
                r.snapElements[q].snapping = !1) : ("inner" !== s.snapMode && (e = Math.abs(l - C) <= u,
                d = Math.abs(n - B) <= u,
                b = Math.abs(h - x) <= u,
                c = Math.abs(m - v) <= u,
                e && (f.position.top = r._convertPositionTo("relative", {
                    top: l - r.helperProportions.height,
                    left: 0
                }).top - r.margins.top),
                d && (f.position.top = r._convertPositionTo("relative", {
                    top: n,
                    left: 0
                }).top - r.margins.top),
                b && (f.position.left = r._convertPositionTo("relative", {
                    top: 0,
                    left: h - r.helperProportions.width
                }).left - r.margins.left),
                c && (f.position.left = r._convertPositionTo("relative", {
                    top: 0,
                    left: m
                }).left - r.margins.left)),
                p = e || d || b || c,
                "outer" !== s.snapMode && (e = Math.abs(l - B) <= u,
                d = Math.abs(n - C) <= u,
                b = Math.abs(h - v) <= u,
                c = Math.abs(m - x) <= u,
                e && (f.position.top = r._convertPositionTo("relative", {
                    top: l,
                    left: 0
                }).top - r.margins.top),
                d && (f.position.top = r._convertPositionTo("relative", {
                    top: n - r.helperProportions.height,
                    left: 0
                }).top - r.margins.top),
                b && (f.position.left = r._convertPositionTo("relative", {
                    top: 0,
                    left: h
                }).left - r.margins.left),
                c && (f.position.left = r._convertPositionTo("relative", {
                    top: 0,
                    left: m - r.helperProportions.width
                }).left - r.margins.left)),
                !r.snapElements[q].snapping && (e || d || b || c || p) && r.options.snap.snap && r.options.snap.snap.call(r.element, g, a.extend(r._uiHash(), {
                    snapItem: r.snapElements[q].item
                })),
                r.snapElements[q].snapping = e || d || b || c || p)
        }
    });
    a.ui.plugin.add("draggable", "stack", {
        start: function() {
            var g, f = this.data("ui-draggable").options, f = a.makeArray(a(f.stack)).sort(function(e, d) {
                return (parseInt(a(e).css("zIndex"), 10) || 0) - (parseInt(a(d).css("zIndex"), 10) || 0)
            });
            f.length && (g = parseInt(a(f[0]).css("zIndex"), 10) || 0,
            a(f).each(function(e) {
                a(this).css("zIndex", g + e)
            }),
            this.css("zIndex", g + f.length))
        }
    });
    a.ui.plugin.add("draggable", "zIndex", {
        start: function(g, f) {
            var e = a(f.helper)
              , d = a(this).data("ui-draggable").options;
            e.css("zIndex") && (d._zIndex = e.css("zIndex"));
            e.css("zIndex", d.zIndex)
        },
        stop: function(g, f) {
            var e = a(this).data("ui-draggable").options;
            e._zIndex && a(f.helper).css("zIndex", e._zIndex)
        }
    })
}
)(jQuery);
(function(a) {
    a.widget("ui.droppable", {
        version: "1.10.3",
        widgetEventPrefix: "drop",
        options: {
            accept: "*",
            activeClass: !1,
            addClasses: !0,
            greedy: !1,
            hoverClass: !1,
            scope: "default",
            tolerance: "intersect",
            activate: null,
            deactivate: null,
            drop: null,
            out: null,
            over: null
        },
        _create: function() {
            var g = this.options
              , f = g.accept;
            this.isover = !1;
            this.isout = !0;
            this.accept = a.isFunction(f) ? f : function(a) {
                return a.is(f)
            }
            ;
            this.proportions = {
                width: this.element[0].offsetWidth,
                height: this.element[0].offsetHeight
            };
            a.ui.ddmanager.droppables[g.scope] = a.ui.ddmanager.droppables[g.scope] || [];
            a.ui.ddmanager.droppables[g.scope].push(this);
            g.addClasses && this.element.addClass("ui-droppable")
        },
        _destroy: function() {
            for (var g = 0, f = a.ui.ddmanager.droppables[this.options.scope]; g < f.length; g++)
                f[g] === this && f.splice(g, 1);
            this.element.removeClass("ui-droppable ui-droppable-disabled")
        },
        _setOption: function(g, f) {
            "accept" === g && (this.accept = a.isFunction(f) ? f : function(a) {
                return a.is(f)
            }
            );
            a.Widget.prototype._setOption.apply(this, arguments)
        },
        _activate: function(g) {
            var f = a.ui.ddmanager.current;
            this.options.activeClass && this.element.addClass(this.options.activeClass);
            f && this._trigger("activate", g, this.ui(f))
        },
        _deactivate: function(g) {
            var f = a.ui.ddmanager.current;
            this.options.activeClass && this.element.removeClass(this.options.activeClass);
            f && this._trigger("deactivate", g, this.ui(f))
        },
        _over: function(g) {
            var f = a.ui.ddmanager.current;
            f && (f.currentItem || f.element)[0] !== this.element[0] && this.accept.call(this.element[0], f.currentItem || f.element) && (this.options.hoverClass && this.element.addClass(this.options.hoverClass),
            this._trigger("over", g, this.ui(f)))
        },
        _out: function(g) {
            var f = a.ui.ddmanager.current;
            f && (f.currentItem || f.element)[0] !== this.element[0] && this.accept.call(this.element[0], f.currentItem || f.element) && (this.options.hoverClass && this.element.removeClass(this.options.hoverClass),
            this._trigger("out", g, this.ui(f)))
        },
        _drop: function(g, f) {
            var e = f || a.ui.ddmanager.current
              , d = !1;
            return e && (e.currentItem || e.element)[0] !== this.element[0] ? (this.element.find(":data(ui-droppable)").not(".ui-draggable-dragging").each(function() {
                var b = a.data(this, "ui-droppable");
                return b.options.greedy && !b.options.disabled && b.options.scope === e.options.scope && b.accept.call(b.element[0], e.currentItem || e.element) && a.ui.intersect(e, a.extend(b, {
                    offset: b.element.offset()
                }), b.options.tolerance) ? (d = !0,
                !1) : void 0
            }),
            d ? !1 : this.accept.call(this.element[0], e.currentItem || e.element) ? (this.options.activeClass && this.element.removeClass(this.options.activeClass),
            this.options.hoverClass && this.element.removeClass(this.options.hoverClass),
            this._trigger("drop", g, this.ui(e)),
            this.element) : !1) : !1
        },
        ui: function(a) {
            return {
                draggable: a.currentItem || a.element,
                helper: a.helper,
                position: a.position,
                offset: a.positionAbs
            }
        }
    });
    a.ui.intersect = function(a, f, e) {
        if (!f.offset)
            return !1;
        var d, b, c = (a.positionAbs || a.position.absolute).left, h = c + a.helperProportions.width, m = (a.positionAbs || a.position.absolute).top, l = m + a.helperProportions.height, n = f.offset.left, q = n + f.proportions.width, p = f.offset.top, r = p + f.proportions.height;
        switch (e) {
        case "fit":
            return c >= n && q >= h && m >= p && r >= l;
        case "intersect":
            return n < c + a.helperProportions.width / 2 && h - a.helperProportions.width / 2 < q && p < m + a.helperProportions.height / 2 && l - a.helperProportions.height / 2 < r;
        case "pointer":
            return d = (a.positionAbs || a.position.absolute).left + (a.clickOffset || a.offset.click).left,
            b = (a.positionAbs || a.position.absolute).top + (a.clickOffset || a.offset.click).top,
            b > p && p + f.proportions.height > b && d > n && n + f.proportions.width > d;
        case "touch":
            return (m >= p && r >= m || l >= p && r >= l || p > m && l > r) && (c >= n && q >= c || h >= n && q >= h || n > c && h > q);
        default:
            return !1
        }
    }
    ;
    a.ui.ddmanager = {
        current: null,
        droppables: {
            "default": []
        },
        prepareOffsets: function(g, f) {
            var e, d, b = a.ui.ddmanager.droppables[g.options.scope] || [], c = f ? f.type : null, h = (g.currentItem || g.element).find(":data(ui-droppable)").addBack();
            e = 0;
            a: for (; e < b.length; e++)
                if (!(b[e].options.disabled || g && !b[e].accept.call(b[e].element[0], g.currentItem || g.element))) {
                    for (d = 0; d < h.length; d++)
                        if (h[d] === b[e].element[0]) {
                            b[e].proportions.height = 0;
                            continue a
                        }
                    b[e].visible = "none" !== b[e].element.css("display");
                    b[e].visible && ("mousedown" === c && b[e]._activate.call(b[e], f),
                    b[e].offset = b[e].element.offset(),
                    b[e].proportions = {
                        width: b[e].element[0].offsetWidth,
                        height: b[e].element[0].offsetHeight
                    })
                }
        },
        drop: function(g, f) {
            var e = !1;
            return a.each((a.ui.ddmanager.droppables[g.options.scope] || []).slice(), function() {
                this.options && (!this.options.disabled && this.visible && a.ui.intersect(g, this, this.options.tolerance) && (e = this._drop.call(this, f) || e),
                !this.options.disabled && this.visible && this.accept.call(this.element[0], g.currentItem || g.element) && (this.isout = !0,
                this.isover = !1,
                this._deactivate.call(this, f)))
            }),
            e
        },
        dragStart: function(g, f) {
            g.element.parentsUntil("body").bind("scroll.droppable", function() {
                g.options.refreshPositions || a.ui.ddmanager.prepareOffsets(g, f)
            })
        },
        drag: function(g, f) {
            g.options.refreshPositions && a.ui.ddmanager.prepareOffsets(g, f);
            a.each(a.ui.ddmanager.droppables[g.options.scope] || [], function() {
                if (!this.options.disabled && !this.greedyChild && this.visible) {
                    var e, d, b, c = a.ui.intersect(g, this, this.options.tolerance);
                    (c = !c && this.isover ? "isout" : c && !this.isover ? "isover" : null) && (this.options.greedy && (d = this.options.scope,
                    b = this.element.parents(":data(ui-droppable)").filter(function() {
                        return a.data(this, "ui-droppable").options.scope === d
                    }),
                    b.length && (e = a.data(b[0], "ui-droppable"),
                    e.greedyChild = "isover" === c)),
                    e && "isover" === c && (e.isover = !1,
                    e.isout = !0,
                    e._out.call(e, f)),
                    this[c] = !0,
                    this["isout" === c ? "isover" : "isout"] = !1,
                    this["isover" === c ? "_over" : "_out"].call(this, f),
                    e && "isout" === c && (e.isout = !1,
                    e.isover = !0,
                    e._over.call(e, f)))
                }
            })
        },
        dragStop: function(g, f) {
            g.element.parentsUntil("body").unbind("scroll.droppable");
            g.options.refreshPositions || a.ui.ddmanager.prepareOffsets(g, f)
        }
    }
}
)(jQuery);
(function(a) {
    function g(a) {
        return parseInt(a, 10) || 0
    }
    function f(a) {
        return !isNaN(parseInt(a, 10))
    }
    a.widget("ui.resizable", a.ui.mouse, {
        version: "1.10.3",
        widgetEventPrefix: "resize",
        options: {
            alsoResize: !1,
            animate: !1,
            animateDuration: "slow",
            animateEasing: "swing",
            aspectRatio: !1,
            autoHide: !1,
            containment: !1,
            ghost: !1,
            grid: !1,
            handles: "e,s,se",
            helper: !1,
            maxHeight: null,
            maxWidth: null,
            minHeight: 10,
            minWidth: 10,
            zIndex: 90,
            resize: null,
            start: null,
            stop: null
        },
        _create: function() {
            var e, d, b, c, h, f = this, g = this.options;
            if (this.element.addClass("ui-resizable"),
            a.extend(this, {
                _aspectRatio: !!g.aspectRatio,
                aspectRatio: g.aspectRatio,
                originalElement: this.element,
                _proportionallyResizeElements: [],
                _helper: g.helper || g.ghost || g.animate ? g.helper || "ui-resizable-helper" : null
            }),
            this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i) && (this.element.wrap(a("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({
                position: this.element.css("position"),
                width: this.element.outerWidth(),
                height: this.element.outerHeight(),
                top: this.element.css("top"),
                left: this.element.css("left")
            })),
            this.element = this.element.parent().data("ui-resizable", this.element.data("ui-resizable")),
            this.elementIsWrapper = !0,
            this.element.css({
                marginLeft: this.originalElement.css("marginLeft"),
                marginTop: this.originalElement.css("marginTop"),
                marginRight: this.originalElement.css("marginRight"),
                marginBottom: this.originalElement.css("marginBottom")
            }),
            this.originalElement.css({
                marginLeft: 0,
                marginTop: 0,
                marginRight: 0,
                marginBottom: 0
            }),
            this.originalResizeStyle = this.originalElement.css("resize"),
            this.originalElement.css("resize", "none"),
            this._proportionallyResizeElements.push(this.originalElement.css({
                position: "static",
                zoom: 1,
                display: "block"
            })),
            this.originalElement.css({
                margin: this.originalElement.css("margin")
            }),
            this._proportionallyResize()),
            this.handles = g.handles || (a(".ui-resizable-handle", this.element).length ? {
                n: ".ui-resizable-n",
                e: ".ui-resizable-e",
                s: ".ui-resizable-s",
                w: ".ui-resizable-w",
                se: ".ui-resizable-se",
                sw: ".ui-resizable-sw",
                ne: ".ui-resizable-ne",
                nw: ".ui-resizable-nw"
            } : "e,s,se"),
            this.handles.constructor === String)
                for ("all" === this.handles && (this.handles = "n,e,s,w,se,sw,ne,nw"),
                e = this.handles.split(","),
                this.handles = {},
                d = 0; d < e.length; d++)
                    b = a.trim(e[d]),
                    h = "ui-resizable-" + b,
                    c = a("<div class='ui-resizable-handle " + h + "'></div>"),
                    c.css({
                        zIndex: g.zIndex
                    }),
                    "se" === b && c.addClass("ui-icon ui-icon-gripsmall-diagonal-se"),
                    this.handles[b] = ".ui-resizable-" + b,
                    this.element.append(c);
            this._renderAxis = function(c) {
                var b, d, h, e;
                c = c || this.element;
                for (b in this.handles)
                    this.handles[b].constructor === String && (this.handles[b] = a(this.handles[b], this.element).show()),
                    this.elementIsWrapper && this.originalElement[0].nodeName.match(/textarea|input|select|button/i) && (d = a(this.handles[b], this.element),
                    e = /sw|ne|nw|se|n|s/.test(b) ? d.outerHeight() : d.outerWidth(),
                    h = ["padding", /ne|nw|n/.test(b) ? "Top" : /se|sw|s/.test(b) ? "Bottom" : /^e$/.test(b) ? "Right" : "Left"].join(""),
                    c.css(h, e),
                    this._proportionallyResize()),
                    a(this.handles[b]).length
            }
            ;
            this._renderAxis(this.element);
            this._handles = a(".ui-resizable-handle", this.element).disableSelection();
            this._handles.mouseover(function() {
                f.resizing || (this.className && (c = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i)),
                f.axis = c && c[1] ? c[1] : "se")
            });
            g.autoHide && (this._handles.hide(),
            a(this.element).addClass("ui-resizable-autohide").mouseenter(function() {
                g.disabled || (a(this).removeClass("ui-resizable-autohide"),
                f._handles.show())
            }).mouseleave(function() {
                g.disabled || f.resizing || (a(this).addClass("ui-resizable-autohide"),
                f._handles.hide())
            }));
            this._mouseInit()
        },
        _destroy: function() {
            this._mouseDestroy();
            var e, d = function(b) {
                a(b).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").removeData("ui-resizable").unbind(".resizable").find(".ui-resizable-handle").remove()
            };
            return this.elementIsWrapper && (d(this.element),
            e = this.element,
            this.originalElement.css({
                position: e.css("position"),
                width: e.outerWidth(),
                height: e.outerHeight(),
                top: e.css("top"),
                left: e.css("left")
            }).insertAfter(e),
            e.remove()),
            this.originalElement.css("resize", this.originalResizeStyle),
            d(this.originalElement),
            this
        },
        _mouseCapture: function(e) {
            var d, b, c = !1;
            for (d in this.handles)
                b = a(this.handles[d])[0],
                (b === e.target || a.contains(b, e.target)) && (c = !0);
            return !this.options.disabled && c
        },
        _mouseStart: function(e) {
            var d, b, c, h = this.options, f = this.element.position(), l = this.element;
            return this.resizing = !0,
            /absolute/.test(l.css("position")) ? l.css({
                position: "absolute",
                top: l.css("top"),
                left: l.css("left")
            }) : l.is(".ui-draggable") && l.css({
                position: "absolute",
                top: f.top,
                left: f.left
            }),
            this._renderProxy(),
            d = g(this.helper.css("left")),
            b = g(this.helper.css("top")),
            h.containment && (d += a(h.containment).scrollLeft() || 0,
            b += a(h.containment).scrollTop() || 0),
            this.offset = this.helper.offset(),
            this.position = {
                left: d,
                top: b
            },
            this.size = this._helper ? {
                width: l.outerWidth(),
                height: l.outerHeight()
            } : {
                width: l.width(),
                height: l.height()
            },
            this.originalSize = this._helper ? {
                width: l.outerWidth(),
                height: l.outerHeight()
            } : {
                width: l.width(),
                height: l.height()
            },
            this.originalPosition = {
                left: d,
                top: b
            },
            this.sizeDiff = {
                width: l.outerWidth() - l.width(),
                height: l.outerHeight() - l.height()
            },
            this.originalMousePosition = {
                left: e.pageX,
                top: e.pageY
            },
            this.aspectRatio = "number" == typeof h.aspectRatio ? h.aspectRatio : this.originalSize.width / this.originalSize.height || 1,
            c = a(".ui-resizable-" + this.axis).css("cursor"),
            a("body").css("cursor", "auto" === c ? this.axis + "-resize" : c),
            l.addClass("ui-resizable-resizing"),
            this._propagate("start", e),
            !0
        },
        _mouseDrag: function(e) {
            var d, b = this.helper, c = {}, h = this.originalMousePosition, f = this.position.top, g = this.position.left, n = this.size.width, q = this.size.height, p = e.pageX - h.left || 0, h = e.pageY - h.top || 0, r = this._change[this.axis];
            return r ? (d = r.apply(this, [e, p, h]),
            this._updateVirtualBoundaries(e.shiftKey),
            (this._aspectRatio || e.shiftKey) && (d = this._updateRatio(d, e)),
            d = this._respectSize(d, e),
            this._updateCache(d),
            this._propagate("resize", e),
            this.position.top !== f && (c.top = this.position.top + "px"),
            this.position.left !== g && (c.left = this.position.left + "px"),
            this.size.width !== n && (c.width = this.size.width + "px"),
            this.size.height !== q && (c.height = this.size.height + "px"),
            b.css(c),
            !this._helper && this._proportionallyResizeElements.length && this._proportionallyResize(),
            a.isEmptyObject(c) || this._trigger("resize", e, this.ui()),
            !1) : !1
        },
        _mouseStop: function(e) {
            this.resizing = !1;
            var d, b, c, h, f, g, n, q = this.options;
            return this._helper && (d = this._proportionallyResizeElements,
            b = d.length && /textarea/i.test(d[0].nodeName),
            c = b && a.ui.hasScroll(d[0], "left") ? 0 : this.sizeDiff.height,
            h = b ? 0 : this.sizeDiff.width,
            f = {
                width: this.helper.width() - h,
                height: this.helper.height() - c
            },
            g = parseInt(this.element.css("left"), 10) + (this.position.left - this.originalPosition.left) || null,
            n = parseInt(this.element.css("top"), 10) + (this.position.top - this.originalPosition.top) || null,
            q.animate || this.element.css(a.extend(f, {
                top: n,
                left: g
            })),
            this.helper.height(this.size.height),
            this.helper.width(this.size.width),
            this._helper && !q.animate && this._proportionallyResize()),
            a("body").css("cursor", "auto"),
            this.element.removeClass("ui-resizable-resizing"),
            this._propagate("stop", e),
            this._helper && this.helper.remove(),
            !1
        },
        _updateVirtualBoundaries: function(a) {
            var d, b, c, h, g;
            g = this.options;
            g = {
                minWidth: f(g.minWidth) ? g.minWidth : 0,
                maxWidth: f(g.maxWidth) ? g.maxWidth : 1 / 0,
                minHeight: f(g.minHeight) ? g.minHeight : 0,
                maxHeight: f(g.maxHeight) ? g.maxHeight : 1 / 0
            };
            (this._aspectRatio || a) && (d = g.minHeight * this.aspectRatio,
            c = g.minWidth / this.aspectRatio,
            b = g.maxHeight * this.aspectRatio,
            h = g.maxWidth / this.aspectRatio,
            d > g.minWidth && (g.minWidth = d),
            c > g.minHeight && (g.minHeight = c),
            b < g.maxWidth && (g.maxWidth = b),
            h < g.maxHeight && (g.maxHeight = h));
            this._vBoundaries = g
        },
        _updateCache: function(a) {
            this.offset = this.helper.offset();
            f(a.left) && (this.position.left = a.left);
            f(a.top) && (this.position.top = a.top);
            f(a.height) && (this.size.height = a.height);
            f(a.width) && (this.size.width = a.width)
        },
        _updateRatio: function(a) {
            var d = this.position
              , b = this.size
              , c = this.axis;
            return f(a.height) ? a.width = a.height * this.aspectRatio : f(a.width) && (a.height = a.width / this.aspectRatio),
            "sw" === c && (a.left = d.left + (b.width - a.width),
            a.top = null),
            "nw" === c && (a.top = d.top + (b.height - a.height),
            a.left = d.left + (b.width - a.width)),
            a
        },
        _respectSize: function(a) {
            var d = this._vBoundaries
              , b = this.axis
              , c = f(a.width) && d.maxWidth && d.maxWidth < a.width
              , h = f(a.height) && d.maxHeight && d.maxHeight < a.height
              , g = f(a.width) && d.minWidth && d.minWidth > a.width
              , l = f(a.height) && d.minHeight && d.minHeight > a.height
              , n = this.originalPosition.left + this.originalSize.width
              , q = this.position.top + this.size.height
              , p = /sw|nw|w/.test(b)
              , b = /nw|ne|n/.test(b);
            return g && (a.width = d.minWidth),
            l && (a.height = d.minHeight),
            c && (a.width = d.maxWidth),
            h && (a.height = d.maxHeight),
            g && p && (a.left = n - d.minWidth),
            c && p && (a.left = n - d.maxWidth),
            l && b && (a.top = q - d.minHeight),
            h && b && (a.top = q - d.maxHeight),
            a.width || a.height || a.left || !a.top ? a.width || a.height || a.top || !a.left || (a.left = null) : a.top = null,
            a
        },
        _proportionallyResize: function() {
            if (this._proportionallyResizeElements.length) {
                var a, d, b, c, h, f = this.helper || this.element;
                for (a = 0; a < this._proportionallyResizeElements.length; a++) {
                    if (h = this._proportionallyResizeElements[a],
                    !this.borderDif)
                        for (this.borderDif = [],
                        b = [h.css("borderTopWidth"), h.css("borderRightWidth"), h.css("borderBottomWidth"), h.css("borderLeftWidth")],
                        c = [h.css("paddingTop"), h.css("paddingRight"), h.css("paddingBottom"), h.css("paddingLeft")],
                        d = 0; d < b.length; d++)
                            this.borderDif[d] = (parseInt(b[d], 10) || 0) + (parseInt(c[d], 10) || 0);
                    h.css({
                        height: f.height() - this.borderDif[0] - this.borderDif[2] || 0,
                        width: f.width() - this.borderDif[1] - this.borderDif[3] || 0
                    })
                }
            }
        },
        _renderProxy: function() {
            var e = this.options;
            this.elementOffset = this.element.offset();
            this._helper ? (this.helper = this.helper || a("<div style='overflow:hidden;'></div>"),
            this.helper.addClass(this._helper).css({
                width: this.element.outerWidth() - 1,
                height: this.element.outerHeight() - 1,
                position: "absolute",
                left: this.elementOffset.left + "px",
                top: this.elementOffset.top + "px",
                zIndex: ++e.zIndex
            }),
            this.helper.appendTo("body").disableSelection()) : this.helper = this.element
        },
        _change: {
            e: function(a, d) {
                return {
                    width: this.originalSize.width + d
                }
            },
            w: function(a, d) {
                return {
                    left: this.originalPosition.left + d,
                    width: this.originalSize.width - d
                }
            },
            n: function(a, d, b) {
                return {
                    top: this.originalPosition.top + b,
                    height: this.originalSize.height - b
                }
            },
            s: function(a, d, b) {
                return {
                    height: this.originalSize.height + b
                }
            },
            se: function(e, d, b) {
                return a.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [e, d, b]))
            },
            sw: function(e, d, b) {
                return a.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [e, d, b]))
            },
            ne: function(e, d, b) {
                return a.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [e, d, b]))
            },
            nw: function(e, d, b) {
                return a.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [e, d, b]))
            }
        },
        _propagate: function(e, d) {
            a.ui.plugin.call(this, e, [d, this.ui()]);
            "resize" !== e && this._trigger(e, d, this.ui())
        },
        plugins: {},
        ui: function() {
            return {
                originalElement: this.originalElement,
                element: this.element,
                helper: this.helper,
                position: this.position,
                size: this.size,
                originalSize: this.originalSize,
                originalPosition: this.originalPosition
            }
        }
    });
    a.ui.plugin.add("resizable", "animate", {
        stop: function(e) {
            var d = a(this).data("ui-resizable")
              , b = d.options
              , c = d._proportionallyResizeElements
              , h = c.length && /textarea/i.test(c[0].nodeName)
              , f = h && a.ui.hasScroll(c[0], "left") ? 0 : d.sizeDiff.height
              , h = {
                width: d.size.width - (h ? 0 : d.sizeDiff.width),
                height: d.size.height - f
            }
              , f = parseInt(d.element.css("left"), 10) + (d.position.left - d.originalPosition.left) || null
              , g = parseInt(d.element.css("top"), 10) + (d.position.top - d.originalPosition.top) || null;
            d.element.animate(a.extend(h, g && f ? {
                top: g,
                left: f
            } : {}), {
                duration: b.animateDuration,
                easing: b.animateEasing,
                step: function() {
                    var b = {
                        width: parseInt(d.element.css("width"), 10),
                        height: parseInt(d.element.css("height"), 10),
                        top: parseInt(d.element.css("top"), 10),
                        left: parseInt(d.element.css("left"), 10)
                    };
                    c && c.length && a(c[0]).css({
                        width: b.width,
                        height: b.height
                    });
                    d._updateCache(b);
                    d._propagate("resize", e)
                }
            })
        }
    });
    a.ui.plugin.add("resizable", "containment", {
        start: function() {
            var e, d, b, c, h, f, l, n = a(this).data("ui-resizable"), q = n.element, p = n.options.containment;
            (q = p instanceof a ? p.get(0) : /parent/.test(p) ? q.parent().get(0) : p) && (n.containerElement = a(q),
            /document/.test(p) || p === document ? (n.containerOffset = {
                left: 0,
                top: 0
            },
            n.containerPosition = {
                left: 0,
                top: 0
            },
            n.parentData = {
                element: a(document),
                left: 0,
                top: 0,
                width: a(document).width(),
                height: a(document).height() || document.body.parentNode.scrollHeight
            }) : (e = a(q),
            d = [],
            a(["Top", "Right", "Left", "Bottom"]).each(function(a, c) {
                d[a] = g(e.css("padding" + c))
            }),
            n.containerOffset = e.offset(),
            n.containerPosition = e.position(),
            n.containerSize = {
                height: e.innerHeight() - d[3],
                width: e.innerWidth() - d[1]
            },
            b = n.containerOffset,
            c = n.containerSize.height,
            h = n.containerSize.width,
            f = a.ui.hasScroll(q, "left") ? q.scrollWidth : h,
            l = a.ui.hasScroll(q) ? q.scrollHeight : c,
            n.parentData = {
                element: q,
                left: b.left,
                top: b.top,
                width: f,
                height: l
            }))
        },
        resize: function(e) {
            var d, b, c, h, f = a(this).data("ui-resizable");
            d = f.options;
            b = f.containerOffset;
            c = f.position;
            e = f._aspectRatio || e.shiftKey;
            h = {
                top: 0,
                left: 0
            };
            var g = f.containerElement;
            g[0] !== document && /static/.test(g.css("position")) && (h = b);
            c.left < (f._helper ? b.left : 0) && (f.size.width += f._helper ? f.position.left - b.left : f.position.left - h.left,
            e && (f.size.height = f.size.width / f.aspectRatio),
            f.position.left = d.helper ? b.left : 0);
            c.top < (f._helper ? b.top : 0) && (f.size.height += f._helper ? f.position.top - b.top : f.position.top,
            e && (f.size.width = f.size.height * f.aspectRatio),
            f.position.top = f._helper ? b.top : 0);
            f.offset.left = f.parentData.left + f.position.left;
            f.offset.top = f.parentData.top + f.position.top;
            d = Math.abs(f.offset.left - h.left + f.sizeDiff.width);
            b = Math.abs((f._helper ? f.offset.top - h.top : f.offset.top - b.top) + f.sizeDiff.height);
            c = f.containerElement.get(0) === f.element.parent().get(0);
            h = /relative|absolute/.test(f.containerElement.css("position"));
            c && h && (d -= f.parentData.left);
            d + f.size.width >= f.parentData.width && (f.size.width = f.parentData.width - d,
            e && (f.size.height = f.size.width / f.aspectRatio));
            b + f.size.height >= f.parentData.height && (f.size.height = f.parentData.height - b,
            e && (f.size.width = f.size.height * f.aspectRatio))
        },
        stop: function() {
            var e = a(this).data("ui-resizable")
              , d = e.options
              , b = e.containerOffset
              , c = e.containerPosition
              , h = e.containerElement
              , f = a(e.helper)
              , g = f.offset()
              , n = f.outerWidth() - e.sizeDiff.width
              , f = f.outerHeight() - e.sizeDiff.height;
            e._helper && !d.animate && /relative/.test(h.css("position")) && a(this).css({
                left: g.left - c.left - b.left,
                width: n,
                height: f
            });
            e._helper && !d.animate && /static/.test(h.css("position")) && a(this).css({
                left: g.left - c.left - b.left,
                width: n,
                height: f
            })
        }
    });
    a.ui.plugin.add("resizable", "alsoResize", {
        start: function() {
            var e = a(this).data("ui-resizable").options
              , d = function(b) {
                a(b).each(function() {
                    var c = a(this);
                    c.data("ui-resizable-alsoresize", {
                        width: parseInt(c.width(), 10),
                        height: parseInt(c.height(), 10),
                        left: parseInt(c.css("left"), 10),
                        top: parseInt(c.css("top"), 10)
                    })
                })
            };
            "object" != typeof e.alsoResize || e.alsoResize.parentNode ? d(e.alsoResize) : e.alsoResize.length ? (e.alsoResize = e.alsoResize[0],
            d(e.alsoResize)) : a.each(e.alsoResize, function(a) {
                d(a)
            })
        },
        resize: function(e, d) {
            var b = a(this).data("ui-resizable")
              , c = b.options
              , h = b.originalSize
              , f = b.originalPosition
              , g = {
                height: b.size.height - h.height || 0,
                width: b.size.width - h.width || 0,
                top: b.position.top - f.top || 0,
                left: b.position.left - f.left || 0
            }
              , n = function(c, b) {
                a(c).each(function() {
                    var c = a(this)
                      , h = a(this).data("ui-resizable-alsoresize")
                      , e = {}
                      , f = b && b.length ? b : c.parents(d.originalElement[0]).length ? ["width", "height"] : ["width", "height", "top", "left"];
                    a.each(f, function(a, c) {
                        var b = (h[c] || 0) + (g[c] || 0);
                        b && 0 <= b && (e[c] = b || null)
                    });
                    c.css(e)
                })
            };
            "object" != typeof c.alsoResize || c.alsoResize.nodeType ? n(c.alsoResize) : a.each(c.alsoResize, function(a, c) {
                n(a, c)
            })
        },
        stop: function() {
            a(this).removeData("resizable-alsoresize")
        }
    });
    a.ui.plugin.add("resizable", "ghost", {
        start: function() {
            var e = a(this).data("ui-resizable")
              , d = e.options
              , b = e.size;
            e.ghost = e.originalElement.clone();
            e.ghost.css({
                opacity: 0.25,
                display: "block",
                position: "relative",
                height: b.height,
                width: b.width,
                margin: 0,
                left: 0,
                top: 0
            }).addClass("ui-resizable-ghost").addClass("string" == typeof d.ghost ? d.ghost : "");
            e.ghost.appendTo(e.helper)
        },
        resize: function() {
            var e = a(this).data("ui-resizable");
            e.ghost && e.ghost.css({
                position: "relative",
                height: e.size.height,
                width: e.size.width
            })
        },
        stop: function() {
            var e = a(this).data("ui-resizable");
            e.ghost && e.helper && e.helper.get(0).removeChild(e.ghost.get(0))
        }
    });
    a.ui.plugin.add("resizable", "grid", {
        resize: function() {
            var e = a(this).data("ui-resizable")
              , d = e.options
              , b = e.size
              , c = e.originalSize
              , h = e.originalPosition
              , f = e.axis
              , g = "number" == typeof d.grid ? [d.grid, d.grid] : d.grid
              , n = g[0] || 1
              , q = g[1] || 1
              , p = Math.round((b.width - c.width) / n) * n
              , b = Math.round((b.height - c.height) / q) * q
              , r = c.width + p
              , c = c.height + b
              , s = d.maxWidth && d.maxWidth < r
              , u = d.maxHeight && d.maxHeight < c
              , v = d.minWidth && d.minWidth > r
              , x = d.minHeight && d.minHeight > c;
            d.grid = g;
            v && (r += n);
            x && (c += q);
            s && (r -= n);
            u && (c -= q);
            /^(se|s|e)$/.test(f) ? (e.size.width = r,
            e.size.height = c) : /^(ne)$/.test(f) ? (e.size.width = r,
            e.size.height = c,
            e.position.top = h.top - b) : /^(sw)$/.test(f) ? (e.size.width = r,
            e.size.height = c,
            e.position.left = h.left - p) : (e.size.width = r,
            e.size.height = c,
            e.position.top = h.top - b,
            e.position.left = h.left - p)
        }
    })
}
)(jQuery);
(function(a) {
    a.widget("ui.selectable", a.ui.mouse, {
        version: "1.10.3",
        options: {
            appendTo: "body",
            autoRefresh: !0,
            distance: 0,
            filter: "*",
            tolerance: "touch",
            selected: null,
            selecting: null,
            start: null,
            stop: null,
            unselected: null,
            unselecting: null
        },
        _create: function() {
            var g, f = this;
            this.element.addClass("ui-selectable");
            this.dragged = !1;
            this.refresh = function() {
                g = a(f.options.filter, f.element[0]);
                g.addClass("ui-selectee");
                g.each(function() {
                    var e = a(this)
                      , d = e.offset();
                    a.data(this, "selectable-item", {
                        element: this,
                        $element: e,
                        left: d.left,
                        top: d.top,
                        right: d.left + e.outerWidth(),
                        bottom: d.top + e.outerHeight(),
                        startselected: !1,
                        selected: e.hasClass("ui-selected"),
                        selecting: e.hasClass("ui-selecting"),
                        unselecting: e.hasClass("ui-unselecting")
                    })
                })
            }
            ;
            this.refresh();
            this.selectees = g.addClass("ui-selectee");
            this._mouseInit();
            this.helper = a("<div class='ui-selectable-helper'></div>")
        },
        _destroy: function() {
            this.selectees.removeClass("ui-selectee").removeData("selectable-item");
            this.element.removeClass("ui-selectable ui-selectable-disabled");
            this._mouseDestroy()
        },
        _mouseStart: function(g) {
            var f = this
              , e = this.options;
            this.opos = [g.pageX, g.pageY];
            this.options.disabled || (this.selectees = a(e.filter, this.element[0]),
            this._trigger("start", g),
            a(e.appendTo).append(this.helper),
            this.helper.css({
                left: g.pageX,
                top: g.pageY,
                width: 0,
                height: 0
            }),
            e.autoRefresh && this.refresh(),
            this.selectees.filter(".ui-selected").each(function() {
                var d = a.data(this, "selectable-item");
                d.startselected = !0;
                g.metaKey || g.ctrlKey || (d.$element.removeClass("ui-selected"),
                d.selected = !1,
                d.$element.addClass("ui-unselecting"),
                d.unselecting = !0,
                f._trigger("unselecting", g, {
                    unselecting: d.element
                }))
            }),
            a(g.target).parents().addBack().each(function() {
                var d, b = a.data(this, "selectable-item");
                return b ? (d = !g.metaKey && !g.ctrlKey || !b.$element.hasClass("ui-selected"),
                b.$element.removeClass(d ? "ui-unselecting" : "ui-selected").addClass(d ? "ui-selecting" : "ui-unselecting"),
                b.unselecting = !d,
                b.selecting = d,
                b.selected = d,
                d ? f._trigger("selecting", g, {
                    selecting: b.element
                }) : f._trigger("unselecting", g, {
                    unselecting: b.element
                }),
                !1) : void 0
            }))
        },
        _mouseDrag: function(g) {
            if (this.dragged = !0,
            !this.options.disabled) {
                var f, e = this, d = this.options, b = this.opos[0], c = this.opos[1], h = g.pageX, m = g.pageY;
                return b > h && (f = h,
                h = b,
                b = f),
                c > m && (f = m,
                m = c,
                c = f),
                this.helper.css({
                    left: b,
                    top: c,
                    width: h - b,
                    height: m - c
                }),
                this.selectees.each(function() {
                    var f = a.data(this, "selectable-item")
                      , n = !1;
                    f && f.element !== e.element[0] && ("touch" === d.tolerance ? n = !(f.left > h || f.right < b || f.top > m || f.bottom < c) : "fit" === d.tolerance && (n = f.left > b && f.right < h && f.top > c && f.bottom < m),
                    n ? (f.selected && (f.$element.removeClass("ui-selected"),
                    f.selected = !1),
                    f.unselecting && (f.$element.removeClass("ui-unselecting"),
                    f.unselecting = !1),
                    f.selecting || (f.$element.addClass("ui-selecting"),
                    f.selecting = !0,
                    e._trigger("selecting", g, {
                        selecting: f.element
                    }))) : (f.selecting && ((g.metaKey || g.ctrlKey) && f.startselected ? (f.$element.removeClass("ui-selecting"),
                    f.selecting = !1,
                    f.$element.addClass("ui-selected"),
                    f.selected = !0) : (f.$element.removeClass("ui-selecting"),
                    f.selecting = !1,
                    f.startselected && (f.$element.addClass("ui-unselecting"),
                    f.unselecting = !0),
                    e._trigger("unselecting", g, {
                        unselecting: f.element
                    }))),
                    f.selected && (g.metaKey || g.ctrlKey || f.startselected || (f.$element.removeClass("ui-selected"),
                    f.selected = !1,
                    f.$element.addClass("ui-unselecting"),
                    f.unselecting = !0,
                    e._trigger("unselecting", g, {
                        unselecting: f.element
                    })))))
                }),
                !1
            }
        },
        _mouseStop: function(g) {
            var f = this;
            return this.dragged = !1,
            a(".ui-unselecting", this.element[0]).each(function() {
                var e = a.data(this, "selectable-item");
                e.$element.removeClass("ui-unselecting");
                e.unselecting = !1;
                e.startselected = !1;
                f._trigger("unselected", g, {
                    unselected: e.element
                })
            }),
            a(".ui-selecting", this.element[0]).each(function() {
                var e = a.data(this, "selectable-item");
                e.$element.removeClass("ui-selecting").addClass("ui-selected");
                e.selecting = !1;
                e.selected = !0;
                e.startselected = !0;
                f._trigger("selected", g, {
                    selected: e.element
                })
            }),
            this._trigger("stop", g),
            this.helper.remove(),
            !1
        }
    })
}
)(jQuery);
(function(a) {
    function g(a) {
        return /left|right/.test(a.css("float")) || /inline|table-cell/.test(a.css("display"))
    }
    a.widget("ui.sortable", a.ui.mouse, {
        version: "1.10.3",
        widgetEventPrefix: "sort",
        ready: !1,
        options: {
            appendTo: "parent",
            axis: !1,
            connectWith: !1,
            containment: !1,
            cursor: "auto",
            cursorAt: !1,
            dropOnEmpty: !0,
            forcePlaceholderSize: !1,
            forceHelperSize: !1,
            grid: !1,
            handle: !1,
            helper: "original",
            items: "> *",
            opacity: !1,
            placeholder: !1,
            revert: !1,
            scroll: !0,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            scope: "default",
            tolerance: "intersect",
            zIndex: 1E3,
            activate: null,
            beforeStop: null,
            change: null,
            deactivate: null,
            out: null,
            over: null,
            receive: null,
            remove: null,
            sort: null,
            start: null,
            stop: null,
            update: null
        },
        _create: function() {
            var a = this.options;
            this.containerCache = {};
            this.element.addClass("ui-sortable");
            this.refresh();
            this.floating = this.items.length ? "x" === a.axis || g(this.items[0].item) : !1;
            this.offset = this.element.offset();
            this._mouseInit();
            this.ready = !0
        },
        _destroy: function() {
            this.element.removeClass("ui-sortable ui-sortable-disabled");
            this._mouseDestroy();
            for (var a = this.items.length - 1; 0 <= a; a--)
                this.items[a].item.removeData(this.widgetName + "-item");
            return this
        },
        _setOption: function(f, e) {
            "disabled" === f ? (this.options[f] = e,
            this.widget().toggleClass("ui-sortable-disabled", !!e)) : a.Widget.prototype._setOption.apply(this, arguments)
        },
        _mouseCapture: function(f, e) {
            var d = null
              , b = !1
              , c = this;
            return this.reverting ? !1 : this.options.disabled || "static" === this.options.type ? !1 : (this._refreshItems(f),
            a(f.target).parents().each(function() {
                return a.data(this, c.widgetName + "-item") === c ? (d = a(this),
                !1) : void 0
            }),
            a.data(f.target, c.widgetName + "-item") === c && (d = a(f.target)),
            d ? !this.options.handle || e || (a(this.options.handle, d).find("*").addBack().each(function() {
                this === f.target && (b = !0)
            }),
            b) ? (this.currentItem = d,
            this._removeCurrentsFromItems(),
            !0) : !1 : !1)
        },
        _mouseStart: function(f, e, d) {
            var b;
            e = this.options;
            if (this.currentContainer = this,
            this.refreshPositions(),
            this.helper = this._createHelper(f),
            this._cacheHelperProportions(),
            this._cacheMargins(),
            this.scrollParent = this.helper.scrollParent(),
            this.offset = this.currentItem.offset(),
            this.offset = {
                top: this.offset.top - this.margins.top,
                left: this.offset.left - this.margins.left
            },
            a.extend(this.offset, {
                click: {
                    left: f.pageX - this.offset.left,
                    top: f.pageY - this.offset.top
                },
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset()
            }),
            this.helper.css("position", "absolute"),
            this.cssPosition = this.helper.css("position"),
            this.originalPosition = this._generatePosition(f),
            this.originalPageX = f.pageX,
            this.originalPageY = f.pageY,
            e.cursorAt && this._adjustOffsetFromHelper(e.cursorAt),
            this.domPosition = {
                prev: this.currentItem.prev()[0],
                parent: this.currentItem.parent()[0]
            },
            this.helper[0] !== this.currentItem[0] && this.currentItem.hide(),
            this._createPlaceholder(),
            e.containment && this._setContainment(),
            e.cursor && "auto" !== e.cursor && (b = this.document.find("body"),
            this.storedCursor = b.css("cursor"),
            b.css("cursor", e.cursor),
            this.storedStylesheet = a("<style>*{ cursor: " + e.cursor + " !important; }</style>").appendTo(b)),
            e.opacity && (this.helper.css("opacity") && (this._storedOpacity = this.helper.css("opacity")),
            this.helper.css("opacity", e.opacity)),
            e.zIndex && (this.helper.css("zIndex") && (this._storedZIndex = this.helper.css("zIndex")),
            this.helper.css("zIndex", e.zIndex)),
            this.scrollParent[0] !== document && "HTML" !== this.scrollParent[0].tagName && (this.overflowOffset = this.scrollParent.offset()),
            this._trigger("start", f, this._uiHash()),
            this._preserveHelperProportions || this._cacheHelperProportions(),
            !d)
                for (d = this.containers.length - 1; 0 <= d; d--)
                    this.containers[d]._trigger("activate", f, this._uiHash(this));
            return a.ui.ddmanager && (a.ui.ddmanager.current = this),
            a.ui.ddmanager && !e.dropBehaviour && a.ui.ddmanager.prepareOffsets(this, f),
            this.dragging = !0,
            this.helper.addClass("ui-sortable-helper"),
            this._mouseDrag(f),
            !0
        },
        _mouseDrag: function(f) {
            var e, d, b, c;
            e = this.options;
            var h = !1;
            this.position = this._generatePosition(f);
            this.positionAbs = this._convertPositionTo("absolute");
            this.lastPositionAbs || (this.lastPositionAbs = this.positionAbs);
            this.options.scroll && (this.scrollParent[0] !== document && "HTML" !== this.scrollParent[0].tagName ? (this.overflowOffset.top + this.scrollParent[0].offsetHeight - f.pageY < e.scrollSensitivity ? this.scrollParent[0].scrollTop = h = this.scrollParent[0].scrollTop + e.scrollSpeed : f.pageY - this.overflowOffset.top < e.scrollSensitivity && (this.scrollParent[0].scrollTop = h = this.scrollParent[0].scrollTop - e.scrollSpeed),
            this.overflowOffset.left + this.scrollParent[0].offsetWidth - f.pageX < e.scrollSensitivity ? this.scrollParent[0].scrollLeft = h = this.scrollParent[0].scrollLeft + e.scrollSpeed : f.pageX - this.overflowOffset.left < e.scrollSensitivity && (this.scrollParent[0].scrollLeft = h = this.scrollParent[0].scrollLeft - e.scrollSpeed)) : (f.pageY - a(document).scrollTop() < e.scrollSensitivity ? h = a(document).scrollTop(a(document).scrollTop() - e.scrollSpeed) : a(window).height() - (f.pageY - a(document).scrollTop()) < e.scrollSensitivity && (h = a(document).scrollTop(a(document).scrollTop() + e.scrollSpeed)),
            f.pageX - a(document).scrollLeft() < e.scrollSensitivity ? h = a(document).scrollLeft(a(document).scrollLeft() - e.scrollSpeed) : a(window).width() - (f.pageX - a(document).scrollLeft()) < e.scrollSensitivity && (h = a(document).scrollLeft(a(document).scrollLeft() + e.scrollSpeed))),
            !1 !== h && a.ui.ddmanager && !e.dropBehaviour && a.ui.ddmanager.prepareOffsets(this, f));
            this.positionAbs = this._convertPositionTo("absolute");
            this.options.axis && "y" === this.options.axis || (this.helper[0].style.left = this.position.left + "px");
            this.options.axis && "x" === this.options.axis || (this.helper[0].style.top = this.position.top + "px");
            for (e = this.items.length - 1; 0 <= e; e--)
                if (d = this.items[e],
                b = d.item[0],
                c = this._intersectsWithPointer(d),
                c && d.instance === this.currentContainer && b !== this.currentItem[0] && this.placeholder[1 === c ? "next" : "prev"]()[0] !== b && !a.contains(this.placeholder[0], b) && ("semi-dynamic" === this.options.type ? !a.contains(this.element[0], b) : !0)) {
                    if (this.direction = 1 === c ? "down" : "up",
                    "pointer" !== this.options.tolerance && !this._intersectsWithSides(d))
                        break;
                    this._rearrange(f, d);
                    this._trigger("change", f, this._uiHash());
                    break
                }
            return this._contactContainers(f),
            a.ui.ddmanager && a.ui.ddmanager.drag(this, f),
            this._trigger("sort", f, this._uiHash()),
            this.lastPositionAbs = this.positionAbs,
            !1
        },
        _mouseStop: function(f, e) {
            if (f) {
                if (a.ui.ddmanager && !this.options.dropBehaviour && a.ui.ddmanager.drop(this, f),
                this.options.revert) {
                    var d = this
                      , b = this.placeholder.offset()
                      , c = this.options.axis
                      , h = {};
                    c && "x" !== c || (h.left = b.left - this.offset.parent.left - this.margins.left + (this.offsetParent[0] === document.body ? 0 : this.offsetParent[0].scrollLeft));
                    c && "y" !== c || (h.top = b.top - this.offset.parent.top - this.margins.top + (this.offsetParent[0] === document.body ? 0 : this.offsetParent[0].scrollTop));
                    this.reverting = !0;
                    a(this.helper).animate(h, parseInt(this.options.revert, 10) || 500, function() {
                        d._clear(f)
                    })
                } else
                    this._clear(f, e);
                return !1
            }
        },
        cancel: function() {
            if (this.dragging) {
                this._mouseUp({
                    target: null
                });
                "original" === this.options.helper ? this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper") : this.currentItem.show();
                for (var f = this.containers.length - 1; 0 <= f; f--)
                    this.containers[f]._trigger("deactivate", null, this._uiHash(this)),
                    this.containers[f].containerCache.over && (this.containers[f]._trigger("out", null, this._uiHash(this)),
                    this.containers[f].containerCache.over = 0)
            }
            return this.placeholder && (this.placeholder[0].parentNode && this.placeholder[0].parentNode.removeChild(this.placeholder[0]),
            "original" !== this.options.helper && this.helper && this.helper[0].parentNode && this.helper.remove(),
            a.extend(this, {
                helper: null,
                dragging: !1,
                reverting: !1,
                _noFinalSort: null
            }),
            this.domPosition.prev ? a(this.domPosition.prev).after(this.currentItem) : a(this.domPosition.parent).prepend(this.currentItem)),
            this
        },
        serialize: function(f) {
            var e = this._getItemsAsjQuery(f && f.connected)
              , d = [];
            return f = f || {},
            a(e).each(function() {
                var b = (a(f.item || this).attr(f.attribute || "id") || "").match(f.expression || /(.+)[\-=_](.+)/);
                b && d.push((f.key || b[1] + "[]") + "=" + (f.key && f.expression ? b[1] : b[2]))
            }),
            !d.length && f.key && d.push(f.key + "="),
            d.join("&")
        },
        toArray: function(f) {
            var e = this._getItemsAsjQuery(f && f.connected)
              , d = [];
            return f = f || {},
            e.each(function() {
                d.push(a(f.item || this).attr(f.attribute || "id") || "")
            }),
            d
        },
        _intersectsWith: function(a) {
            var e = this.positionAbs.left
              , d = e + this.helperProportions.width
              , b = this.positionAbs.top
              , c = b + this.helperProportions.height
              , h = a.left
              , g = h + a.width
              , l = a.top
              , n = l + a.height
              , q = this.offset.click.top
              , p = this.offset.click.left
              , p = "y" === this.options.axis || e + p > h && g > e + p
              , q = ("x" === this.options.axis || b + q > l && n > b + q) && p;
            return "pointer" === this.options.tolerance || this.options.forcePointerForContainers || "pointer" !== this.options.tolerance && this.helperProportions[this.floating ? "width" : "height"] > a[this.floating ? "width" : "height"] ? q : h < e + this.helperProportions.width / 2 && d - this.helperProportions.width / 2 < g && l < b + this.helperProportions.height / 2 && c - this.helperProportions.height / 2 < n
        },
        _intersectsWithPointer: function(a) {
            var e = "y" === this.options.axis || this.positionAbs.left + this.offset.click.left > a.left && a.left + a.width > this.positionAbs.left + this.offset.click.left;
            a = ("x" === this.options.axis || this.positionAbs.top + this.offset.click.top > a.top && a.top + a.height > this.positionAbs.top + this.offset.click.top) && e;
            var e = this._getDragVerticalDirection()
              , d = this._getDragHorizontalDirection();
            return a ? this.floating ? d && "right" === d || "down" === e ? 2 : 1 : e && ("down" === e ? 2 : 1) : !1
        },
        _intersectsWithSides: function(a) {
            var e = this.positionAbs.top + this.offset.click.top > a.top + a.height / 2 && a.top + a.height / 2 + a.height > this.positionAbs.top + this.offset.click.top;
            a = this.positionAbs.left + this.offset.click.left > a.left + a.width / 2 && a.left + a.width / 2 + a.width > this.positionAbs.left + this.offset.click.left;
            var d = this._getDragVerticalDirection()
              , b = this._getDragHorizontalDirection();
            return this.floating && b ? "right" === b && a || "left" === b && !a : d && ("down" === d && e || "up" === d && !e)
        },
        _getDragVerticalDirection: function() {
            var a = this.positionAbs.top - this.lastPositionAbs.top;
            return 0 !== a && (0 < a ? "down" : "up")
        },
        _getDragHorizontalDirection: function() {
            var a = this.positionAbs.left - this.lastPositionAbs.left;
            return 0 !== a && (0 < a ? "right" : "left")
        },
        refresh: function(a) {
            return this._refreshItems(a),
            this.refreshPositions(),
            this
        },
        _connectWith: function() {
            var a = this.options;
            return a.connectWith.constructor === String ? [a.connectWith] : a.connectWith
        },
        _getItemsAsjQuery: function(f) {
            var e, d, b, c = [], h = [], g = this._connectWith();
            if (g && f)
                for (f = g.length - 1; 0 <= f; f--)
                    for (d = a(g[f]),
                    e = d.length - 1; 0 <= e; e--)
                        (b = a.data(d[e], this.widgetFullName)) && b !== this && !b.options.disabled && h.push([a.isFunction(b.options.items) ? b.options.items.call(b.element) : a(b.options.items, b.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), b]);
            h.push([a.isFunction(this.options.items) ? this.options.items.call(this.element, null, {
                options: this.options,
                item: this.currentItem
            }) : a(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), this]);
            for (f = h.length - 1; 0 <= f; f--)
                h[f][0].each(function() {
                    c.push(this)
                });
            return a(c)
        },
        _removeCurrentsFromItems: function() {
            var f = this.currentItem.find(":data(" + this.widgetName + "-item)");
            this.items = a.grep(this.items, function(a) {
                for (var d = 0; d < f.length; d++)
                    if (f[d] === a.item[0])
                        return !1;
                return !0
            })
        },
        _refreshItems: function(f) {
            this.items = [];
            this.containers = [this];
            var e, d, b, c, h, g = this.items, l = [[a.isFunction(this.options.items) ? this.options.items.call(this.element[0], f, {
                item: this.currentItem
            }) : a(this.options.items, this.element), this]];
            if ((h = this._connectWith()) && this.ready)
                for (e = h.length - 1; 0 <= e; e--)
                    for (b = a(h[e]),
                    d = b.length - 1; 0 <= d; d--)
                        (c = a.data(b[d], this.widgetFullName)) && c !== this && !c.options.disabled && (l.push([a.isFunction(c.options.items) ? c.options.items.call(c.element[0], f, {
                            item: this.currentItem
                        }) : a(c.options.items, c.element), c]),
                        this.containers.push(c));
            for (e = l.length - 1; 0 <= e; e--)
                for (f = l[e][1],
                b = l[e][0],
                d = 0,
                h = b.length; h > d; d++)
                    c = a(b[d]),
                    c.data(this.widgetName + "-item", f),
                    g.push({
                        item: c,
                        instance: f,
                        width: 0,
                        height: 0,
                        left: 0,
                        top: 0
                    })
        },
        refreshPositions: function(f) {
            this.offsetParent && this.helper && (this.offset.parent = this._getParentOffset());
            var e, d, b, c;
            for (e = this.items.length - 1; 0 <= e; e--)
                d = this.items[e],
                d.instance !== this.currentContainer && this.currentContainer && d.item[0] !== this.currentItem[0] || (b = this.options.toleranceElement ? a(this.options.toleranceElement, d.item) : d.item,
                f || (d.width = b.outerWidth(),
                d.height = b.outerHeight()),
                c = b.offset(),
                d.left = c.left,
                d.top = c.top);
            if (this.options.custom && this.options.custom.refreshContainers)
                this.options.custom.refreshContainers.call(this);
            else
                for (e = this.containers.length - 1; 0 <= e; e--)
                    c = this.containers[e].element.offset(),
                    this.containers[e].containerCache.left = c.left,
                    this.containers[e].containerCache.top = c.top,
                    this.containers[e].containerCache.width = this.containers[e].element.outerWidth(),
                    this.containers[e].containerCache.height = this.containers[e].element.outerHeight();
            return this
        },
        _createPlaceholder: function(f) {
            f = f || this;
            var e, d = f.options;
            d.placeholder && d.placeholder.constructor !== String || (e = d.placeholder,
            d.placeholder = {
                element: function() {
                    var b = f.currentItem[0].nodeName.toLowerCase()
                      , c = a("<" + b + ">", f.document[0]).addClass(e || f.currentItem[0].className + " ui-sortable-placeholder").removeClass("ui-sortable-helper");
                    return "tr" === b ? f.currentItem.children().each(function() {
                        a("<td>&#160;</td>", f.document[0]).attr("colspan", a(this).attr("colspan") || 1).appendTo(c)
                    }) : "img" === b && c.attr("src", f.currentItem.attr("src")),
                    e || c.css("visibility", "hidden"),
                    c
                },
                update: function(a, c) {
                    (!e || d.forcePlaceholderSize) && (c.height() || c.height(f.currentItem.innerHeight() - parseInt(f.currentItem.css("paddingTop") || 0, 10) - parseInt(f.currentItem.css("paddingBottom") || 0, 10)),
                    c.width() || c.width(f.currentItem.innerWidth() - parseInt(f.currentItem.css("paddingLeft") || 0, 10) - parseInt(f.currentItem.css("paddingRight") || 0, 10)))
                }
            });
            f.placeholder = a(d.placeholder.element.call(f.element, f.currentItem));
            f.currentItem.after(f.placeholder);
            d.placeholder.update(f, f.placeholder)
        },
        _contactContainers: function(f) {
            var e, d, b, c, h, m, l, n, q, p = d = null;
            for (e = this.containers.length - 1; 0 <= e; e--)
                a.contains(this.currentItem[0], this.containers[e].element[0]) || (this._intersectsWith(this.containers[e].containerCache) ? d && a.contains(this.containers[e].element[0], d.element[0]) || (d = this.containers[e],
                p = e) : this.containers[e].containerCache.over && (this.containers[e]._trigger("out", f, this._uiHash(this)),
                this.containers[e].containerCache.over = 0));
            if (d)
                if (1 === this.containers.length)
                    this.containers[p].containerCache.over || (this.containers[p]._trigger("over", f, this._uiHash(this)),
                    this.containers[p].containerCache.over = 1);
                else {
                    e = 1E4;
                    b = null;
                    c = (q = d.floating || g(this.currentItem)) ? "left" : "top";
                    h = q ? "width" : "height";
                    m = this.positionAbs[c] + this.offset.click[c];
                    for (d = this.items.length - 1; 0 <= d; d--)
                        a.contains(this.containers[p].element[0], this.items[d].item[0]) && this.items[d].item[0] !== this.currentItem[0] && (!q || this.positionAbs.top + this.offset.click.top > this.items[d].top && this.items[d].top + this.items[d].height > this.positionAbs.top + this.offset.click.top) && (l = this.items[d].item.offset()[c],
                        n = !1,
                        Math.abs(l - m) > Math.abs(l + this.items[d][h] - m) && (n = !0,
                        l += this.items[d][h]),
                        Math.abs(l - m) < e && (e = Math.abs(l - m),
                        b = this.items[d],
                        this.direction = n ? "up" : "down"));
                    (b || this.options.dropOnEmpty) && this.currentContainer !== this.containers[p] && (b ? this._rearrange(f, b, null, !0) : this._rearrange(f, null, this.containers[p].element, !0),
                    this._trigger("change", f, this._uiHash()),
                    this.containers[p]._trigger("change", f, this._uiHash(this)),
                    this.currentContainer = this.containers[p],
                    this.options.placeholder.update(this.currentContainer, this.placeholder),
                    this.containers[p]._trigger("over", f, this._uiHash(this)),
                    this.containers[p].containerCache.over = 1)
                }
        },
        _createHelper: function(f) {
            var e = this.options;
            f = a.isFunction(e.helper) ? a(e.helper.apply(this.element[0], [f, this.currentItem])) : "clone" === e.helper ? this.currentItem.clone() : this.currentItem;
            return f.parents("body").length || a("parent" !== e.appendTo ? e.appendTo : this.currentItem[0].parentNode)[0].appendChild(f[0]),
            f[0] === this.currentItem[0] && (this._storedCSS = {
                width: this.currentItem[0].style.width,
                height: this.currentItem[0].style.height,
                position: this.currentItem.css("position"),
                top: this.currentItem.css("top"),
                left: this.currentItem.css("left")
            }),
            (!f[0].style.width || e.forceHelperSize) && f.width(this.currentItem.width()),
            (!f[0].style.height || e.forceHelperSize) && f.height(this.currentItem.height()),
            f
        },
        _adjustOffsetFromHelper: function(f) {
            "string" == typeof f && (f = f.split(" "));
            a.isArray(f) && (f = {
                left: +f[0],
                top: +f[1] || 0
            });
            "left"in f && (this.offset.click.left = f.left + this.margins.left);
            "right"in f && (this.offset.click.left = this.helperProportions.width - f.right + this.margins.left);
            "top"in f && (this.offset.click.top = f.top + this.margins.top);
            "bottom"in f && (this.offset.click.top = this.helperProportions.height - f.bottom + this.margins.top)
        },
        _getParentOffset: function() {
            this.offsetParent = this.helper.offsetParent();
            var f = this.offsetParent.offset();
            return "absolute" === this.cssPosition && this.scrollParent[0] !== document && a.contains(this.scrollParent[0], this.offsetParent[0]) && (f.left += this.scrollParent.scrollLeft(),
            f.top += this.scrollParent.scrollTop()),
            (this.offsetParent[0] === document.body || this.offsetParent[0].tagName && "html" === this.offsetParent[0].tagName.toLowerCase() && a.ui.ie) && (f = {
                top: 0,
                left: 0
            }),
            {
                top: f.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                left: f.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
            }
        },
        _getRelativeOffset: function() {
            if ("relative" === this.cssPosition) {
                var a = this.currentItem.position();
                return {
                    top: a.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
                    left: a.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
                }
            }
            return {
                top: 0,
                left: 0
            }
        },
        _cacheMargins: function() {
            this.margins = {
                left: parseInt(this.currentItem.css("marginLeft"), 10) || 0,
                top: parseInt(this.currentItem.css("marginTop"), 10) || 0
            }
        },
        _cacheHelperProportions: function() {
            this.helperProportions = {
                width: this.helper.outerWidth(),
                height: this.helper.outerHeight()
            }
        },
        _setContainment: function() {
            var f, e, d, b = this.options;
            "parent" === b.containment && (b.containment = this.helper[0].parentNode);
            "document" !== b.containment && "window" !== b.containment || (this.containment = [0 - this.offset.relative.left - this.offset.parent.left, 0 - this.offset.relative.top - this.offset.parent.top, a("document" === b.containment ? document : window).width() - this.helperProportions.width - this.margins.left, (a("document" === b.containment ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top]);
            /^(document|window|parent)$/.test(b.containment) || (f = a(b.containment)[0],
            e = a(b.containment).offset(),
            d = "hidden" !== a(f).css("overflow"),
            this.containment = [e.left + (parseInt(a(f).css("borderLeftWidth"), 10) || 0) + (parseInt(a(f).css("paddingLeft"), 10) || 0) - this.margins.left, e.top + (parseInt(a(f).css("borderTopWidth"), 10) || 0) + (parseInt(a(f).css("paddingTop"), 10) || 0) - this.margins.top, e.left + (d ? Math.max(f.scrollWidth, f.offsetWidth) : f.offsetWidth) - (parseInt(a(f).css("borderLeftWidth"), 10) || 0) - (parseInt(a(f).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, e.top + (d ? Math.max(f.scrollHeight, f.offsetHeight) : f.offsetHeight) - (parseInt(a(f).css("borderTopWidth"), 10) || 0) - (parseInt(a(f).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top])
        },
        _convertPositionTo: function(f, e) {
            e || (e = this.position);
            var d = "absolute" === f ? 1 : -1
              , b = "absolute" !== this.cssPosition || this.scrollParent[0] !== document && a.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent
              , c = /(html|body)/i.test(b[0].tagName);
            return {
                top: e.top + this.offset.relative.top * d + this.offset.parent.top * d - ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() : c ? 0 : b.scrollTop()) * d,
                left: e.left + this.offset.relative.left * d + this.offset.parent.left * d - ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : c ? 0 : b.scrollLeft()) * d
            }
        },
        _generatePosition: function(f) {
            var e, d, b = this.options, c = f.pageX, h = f.pageY, g = "absolute" !== this.cssPosition || this.scrollParent[0] !== document && a.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent, l = /(html|body)/i.test(g[0].tagName);
            return "relative" !== this.cssPosition || this.scrollParent[0] !== document && this.scrollParent[0] !== this.offsetParent[0] || (this.offset.relative = this._getRelativeOffset()),
            this.originalPosition && (this.containment && (f.pageX - this.offset.click.left < this.containment[0] && (c = this.containment[0] + this.offset.click.left),
            f.pageY - this.offset.click.top < this.containment[1] && (h = this.containment[1] + this.offset.click.top),
            f.pageX - this.offset.click.left > this.containment[2] && (c = this.containment[2] + this.offset.click.left),
            f.pageY - this.offset.click.top > this.containment[3] && (h = this.containment[3] + this.offset.click.top)),
            b.grid && (e = this.originalPageY + Math.round((h - this.originalPageY) / b.grid[1]) * b.grid[1],
            h = this.containment ? e - this.offset.click.top >= this.containment[1] && e - this.offset.click.top <= this.containment[3] ? e : e - this.offset.click.top >= this.containment[1] ? e - b.grid[1] : e + b.grid[1] : e,
            d = this.originalPageX + Math.round((c - this.originalPageX) / b.grid[0]) * b.grid[0],
            c = this.containment ? d - this.offset.click.left >= this.containment[0] && d - this.offset.click.left <= this.containment[2] ? d : d - this.offset.click.left >= this.containment[0] ? d - b.grid[0] : d + b.grid[0] : d)),
            {
                top: h - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() : l ? 0 : g.scrollTop()),
                left: c - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : l ? 0 : g.scrollLeft())
            }
        },
        _rearrange: function(a, e, d, b) {
            d ? d[0].appendChild(this.placeholder[0]) : e.item[0].parentNode.insertBefore(this.placeholder[0], "down" === this.direction ? e.item[0] : e.item[0].nextSibling);
            var c = this.counter = this.counter ? ++this.counter : 1;
            this._delay(function() {
                c === this.counter && this.refreshPositions(!b)
            })
        },
        _clear: function(a, e) {
            this.reverting = !1;
            var d, b = [];
            if (!this._noFinalSort && this.currentItem.parent().length && this.placeholder.before(this.currentItem),
            this._noFinalSort = null,
            this.helper[0] === this.currentItem[0]) {
                for (d in this._storedCSS)
                    "auto" !== this._storedCSS[d] && "static" !== this._storedCSS[d] || (this._storedCSS[d] = "");
                this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")
            } else
                this.currentItem.show();
            this.fromOutside && !e && b.push(function(a) {
                this._trigger("receive", a, this._uiHash(this.fromOutside))
            });
            !this.fromOutside && this.domPosition.prev === this.currentItem.prev().not(".ui-sortable-helper")[0] && this.domPosition.parent === this.currentItem.parent()[0] || e || b.push(function(a) {
                this._trigger("update", a, this._uiHash())
            });
            this !== this.currentContainer && (e || (b.push(function(a) {
                this._trigger("remove", a, this._uiHash())
            }),
            b.push(function(a) {
                return function(b) {
                    a._trigger("receive", b, this._uiHash(this))
                }
            }
            .call(this, this.currentContainer)),
            b.push(function(a) {
                return function(b) {
                    a._trigger("update", b, this._uiHash(this))
                }
            }
            .call(this, this.currentContainer))));
            for (d = this.containers.length - 1; 0 <= d; d--)
                e || b.push(function(a) {
                    return function(b) {
                        a._trigger("deactivate", b, this._uiHash(this))
                    }
                }
                .call(this, this.containers[d])),
                this.containers[d].containerCache.over && (b.push(function(a) {
                    return function(b) {
                        a._trigger("out", b, this._uiHash(this))
                    }
                }
                .call(this, this.containers[d])),
                this.containers[d].containerCache.over = 0);
            if (this.storedCursor && (this.document.find("body").css("cursor", this.storedCursor),
            this.storedStylesheet.remove()),
            this._storedOpacity && this.helper.css("opacity", this._storedOpacity),
            this._storedZIndex && this.helper.css("zIndex", "auto" === this._storedZIndex ? "" : this._storedZIndex),
            this.dragging = !1,
            this.cancelHelperRemoval) {
                if (!e) {
                    this._trigger("beforeStop", a, this._uiHash());
                    for (d = 0; d < b.length; d++)
                        b[d].call(this, a);
                    this._trigger("stop", a, this._uiHash())
                }
                return this.fromOutside = !1,
                !1
            }
            if (e || this._trigger("beforeStop", a, this._uiHash()),
            this.placeholder[0].parentNode.removeChild(this.placeholder[0]),
            this.helper[0] !== this.currentItem[0] && this.helper.remove(),
            this.helper = null,
            !e) {
                for (d = 0; d < b.length; d++)
                    b[d].call(this, a);
                this._trigger("stop", a, this._uiHash())
            }
            return this.fromOutside = !1,
            !0
        },
        _trigger: function() {
            !1 === a.Widget.prototype._trigger.apply(this, arguments) && this.cancel()
        },
        _uiHash: function(f) {
            var e = f || this;
            return {
                helper: e.helper,
                placeholder: e.placeholder || a([]),
                position: e.position,
                originalPosition: e.originalPosition,
                offset: e.positionAbs,
                item: e.currentItem,
                sender: f ? f.element : null
            }
        }
    })
}
)(jQuery);
(function(a, g) {
    a.effects = {
        effect: {}
    };
    (function(a, e) {
        function d(a, c, b) {
            var d = p[c.type] || {};
            return null == a ? b || !c.def ? null : c.def : (a = d.floor ? ~~a : parseFloat(a),
            isNaN(a) ? c.def : d.mod ? (a + d.mod) % d.mod : 0 > a ? 0 : d.max < a ? d.max : a)
        }
        function b(c) {
            var b = n()
              , d = b._rgba = [];
            return c = c.toLowerCase(),
            u(l, function(a, h) {
                var e, f = h.re.exec(c), f = f && h.parse(f), g = h.space || "rgba";
                return f ? (e = b[g](f),
                b[q[g].cache] = e[q[g].cache],
                d = b._rgba = e._rgba,
                !1) : void 0
            }),
            d.length ? ("0,0,0,0" === d.join() && a.extend(d, h.transparent),
            b) : h[c]
        }
        function c(a, c, b) {
            return b = (b + 1) % 1,
            1 > 6 * b ? a + 6 * (c - a) * b : 1 > 2 * b ? c : 2 > 3 * b ? a + 6 * (c - a) * (2 / 3 - b) : a
        }
        var h, g = /^([\-+])=\s*(\d+\.?\d*)/, l = [{
            re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
            parse: function(a) {
                return [a[1], a[2], a[3], a[4]]
            }
        }, {
            re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
            parse: function(a) {
                return [2.55 * a[1], 2.55 * a[2], 2.55 * a[3], a[4]]
            }
        }, {
            re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,
            parse: function(a) {
                return [parseInt(a[1], 16), parseInt(a[2], 16), parseInt(a[3], 16)]
            }
        }, {
            re: /#([a-f0-9])([a-f0-9])([a-f0-9])/,
            parse: function(a) {
                return [parseInt(a[1] + a[1], 16), parseInt(a[2] + a[2], 16), parseInt(a[3] + a[3], 16)]
            }
        }, {
            re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
            space: "hsla",
            parse: function(a) {
                return [a[1], a[2] / 100, a[3] / 100, a[4]]
            }
        }], n = a.Color = function(c, b, d, h) {
            return new a.Color.fn.parse(c,b,d,h)
        }
        , q = {
            rgba: {
                props: {
                    red: {
                        idx: 0,
                        type: "byte"
                    },
                    green: {
                        idx: 1,
                        type: "byte"
                    },
                    blue: {
                        idx: 2,
                        type: "byte"
                    }
                }
            },
            hsla: {
                props: {
                    hue: {
                        idx: 0,
                        type: "degrees"
                    },
                    saturation: {
                        idx: 1,
                        type: "percent"
                    },
                    lightness: {
                        idx: 2,
                        type: "percent"
                    }
                }
            }
        }, p = {
            "byte": {
                floor: !0,
                max: 255
            },
            percent: {
                max: 1
            },
            degrees: {
                mod: 360,
                floor: !0
            }
        }, r = n.support = {}, s = a("<p>")[0], u = a.each;
        s.style.cssText = "background-color:rgba(1,1,1,.5)";
        r.rgba = -1 < s.style.backgroundColor.indexOf("rgba");
        u(q, function(a, c) {
            c.cache = "_" + a;
            c.props.alpha = {
                idx: 3,
                type: "percent",
                def: 1
            }
        });
        n.fn = a.extend(n.prototype, {
            parse: function(c, g, m, l) {
                if (c === e)
                    return this._rgba = [null, null, null, null],
                    this;
                (c.jquery || c.nodeType) && (c = a(c).css(g),
                g = e);
                var p = this
                  , r = a.type(c)
                  , s = this._rgba = [];
                return g !== e && (c = [c, g, m, l],
                r = "array"),
                "string" === r ? this.parse(b(c) || h._default) : "array" === r ? (u(q.rgba.props, function(a, b) {
                    s[b.idx] = d(c[b.idx], b)
                }),
                this) : "object" === r ? (c instanceof n ? u(q, function(a, b) {
                    c[b.cache] && (p[b.cache] = c[b.cache].slice())
                }) : u(q, function(b, h) {
                    var e = h.cache;
                    u(h.props, function(a, b) {
                        if (!p[e] && h.to) {
                            if ("alpha" === a || null == c[a])
                                return;
                            p[e] = h.to(p._rgba)
                        }
                        p[e][b.idx] = d(c[a], b, !0)
                    });
                    p[e] && 0 > a.inArray(null, p[e].slice(0, 3)) && (p[e][3] = 1,
                    h.from && (p._rgba = h.from(p[e])))
                }),
                this) : void 0
            },
            is: function(a) {
                var c = n(a)
                  , b = !0
                  , d = this;
                return u(q, function(a, h) {
                    var e, f = c[h.cache];
                    return f && (e = d[h.cache] || h.to && h.to(d._rgba) || [],
                    u(h.props, function(a, c) {
                        return null != f[c.idx] ? b = f[c.idx] === e[c.idx] : void 0
                    })),
                    b
                }),
                b
            },
            _space: function() {
                var a = []
                  , c = this;
                return u(q, function(b, d) {
                    c[d.cache] && a.push(b)
                }),
                a.pop()
            },
            transition: function(a, c) {
                var b = n(a)
                  , h = b._space()
                  , e = q[h]
                  , f = 0 === this.alpha() ? n("transparent") : this
                  , g = f[e.cache] || e.to(f._rgba)
                  , m = g.slice();
                return b = b[e.cache],
                u(e.props, function(a, h) {
                    var e = h.idx
                      , f = g[e]
                      , l = b[e]
                      , n = p[h.type] || {};
                    null !== l && (null === f ? m[e] = l : (n.mod && (l - f > n.mod / 2 ? f += n.mod : f - l > n.mod / 2 && (f -= n.mod)),
                    m[e] = d((l - f) * c + f, h)))
                }),
                this[h](m)
            },
            blend: function(c) {
                if (1 === this._rgba[3])
                    return this;
                var b = this._rgba.slice()
                  , d = b.pop()
                  , h = n(c)._rgba;
                return n(a.map(b, function(a, c) {
                    return (1 - d) * h[c] + d * a
                }))
            },
            toRgbaString: function() {
                var c = "rgba("
                  , b = a.map(this._rgba, function(a, c) {
                    return null == a ? 2 < c ? 1 : 0 : a
                });
                return 1 === b[3] && (b.pop(),
                c = "rgb("),
                c + b.join() + ")"
            },
            toHslaString: function() {
                var c = "hsla("
                  , b = a.map(this.hsla(), function(a, c) {
                    return null == a && (a = 2 < c ? 1 : 0),
                    c && 3 > c && (a = Math.round(100 * a) + "%"),
                    a
                });
                return 1 === b[3] && (b.pop(),
                c = "hsl("),
                c + b.join() + ")"
            },
            toHexString: function(c) {
                var b = this._rgba.slice()
                  , d = b.pop();
                return c && b.push(~~(255 * d)),
                "#" + a.map(b, function(a) {
                    return a = (a || 0).toString(16),
                    1 === a.length ? "0" + a : a
                }).join("")
            },
            toString: function() {
                return 0 === this._rgba[3] ? "transparent" : this.toRgbaString()
            }
        });
        n.fn.parse.prototype = n.fn;
        q.hsla.to = function(a) {
            if (null == a[0] || null == a[1] || null == a[2])
                return [null, null, null, a[3]];
            var c, b, d = a[0] / 255, h = a[1] / 255, e = a[2] / 255;
            a = a[3];
            var f = Math.max(d, h, e)
              , g = Math.min(d, h, e)
              , m = f - g
              , l = f + g
              , n = 0.5 * l;
            return c = g === f ? 0 : d === f ? 60 * (h - e) / m + 360 : h === f ? 60 * (e - d) / m + 120 : 60 * (d - h) / m + 240,
            b = 0 === m ? 0 : 0.5 >= n ? m / l : m / (2 - l),
            [Math.round(c) % 360, b, n, null == a ? 1 : a]
        }
        ;
        q.hsla.from = function(a) {
            if (null == a[0] || null == a[1] || null == a[2])
                return [null, null, null, a[3]];
            var b = a[0] / 360
              , d = a[1]
              , h = a[2];
            a = a[3];
            d = 0.5 >= h ? h * (1 + d) : h + d - h * d;
            h = 2 * h - d;
            return [Math.round(255 * c(h, d, b + 1 / 3)), Math.round(255 * c(h, d, b)), Math.round(255 * c(h, d, b - 1 / 3)), a]
        }
        ;
        u(q, function(c, b) {
            var h = b.props
              , l = b.cache
              , q = b.to
              , p = b.from;
            n.fn[c] = function(c) {
                if (q && !this[l] && (this[l] = q(this._rgba)),
                c === e)
                    return this[l].slice();
                var b, g = a.type(c), m = "array" === g || "object" === g ? c : arguments, r = this[l].slice();
                return u(h, function(a, c) {
                    var b = m["object" === g ? a : c.idx];
                    null == b && (b = r[c.idx]);
                    r[c.idx] = d(b, c)
                }),
                p ? (b = n(p(r)),
                b[l] = r,
                b) : n(r)
            }
            ;
            u(h, function(b, d) {
                n.fn[b] || (n.fn[b] = function(h) {
                    var e, l = a.type(h), n = "alpha" === b ? this._hsla ? "hsla" : "rgba" : c, q = this[n](), p = q[d.idx];
                    return "undefined" === l ? p : ("function" === l && (h = h.call(this, p),
                    l = a.type(h)),
                    null == h && d.empty ? this : ("string" === l && (e = g.exec(h),
                    e && (h = p + parseFloat(e[2]) * ("+" === e[1] ? 1 : -1))),
                    q[d.idx] = h,
                    this[n](q)))
                }
                )
            })
        });
        n.hook = function(c) {
            c = c.split(" ");
            u(c, function(c, d) {
                a.cssHooks[d] = {
                    set: function(c, h) {
                        var e, g = "";
                        if ("transparent" !== h && ("string" !== a.type(h) || (e = b(h)))) {
                            if (h = n(e || h),
                            !r.rgba && 1 !== h._rgba[3]) {
                                for (e = "backgroundColor" === d ? c.parentNode : c; ("" === g || "transparent" === g) && e && e.style; )
                                    try {
                                        g = a.css(e, "backgroundColor"),
                                        e = e.parentNode
                                    } catch (m) {}
                                h = h.blend(g && "transparent" !== g ? g : "_default")
                            }
                            h = h.toRgbaString()
                        }
                        try {
                            c.style[d] = h
                        } catch (l) {}
                    }
                };
                a.fx.step[d] = function(c) {
                    c.colorInit || (c.start = n(c.elem, d),
                    c.end = n(c.end),
                    c.colorInit = !0);
                    a.cssHooks[d].set(c.elem, c.start.transition(c.end, c.pos))
                }
            })
        }
        ;
        n.hook("backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor");
        a.cssHooks.borderColor = {
            expand: function(a) {
                var c = {};
                return u(["Top", "Right", "Bottom", "Left"], function(b, d) {
                    c["border" + d + "Color"] = a
                }),
                c
            }
        };
        h = a.Color.names = {
            aqua: "#00ffff",
            black: "#000000",
            blue: "#0000ff",
            fuchsia: "#ff00ff",
            gray: "#808080",
            green: "#008000",
            lime: "#00ff00",
            maroon: "#800000",
            navy: "#000080",
            olive: "#808000",
            purple: "#800080",
            red: "#ff0000",
            silver: "#c0c0c0",
            teal: "#008080",
            white: "#ffffff",
            yellow: "#ffff00",
            transparent: [null, null, null, 0],
            _default: "#ffffff"
        }
    }
    )(jQuery);
    (function() {
        function f(b) {
            var c, d = b.ownerDocument.defaultView ? b.ownerDocument.defaultView.getComputedStyle(b, null) : b.currentStyle, e = {};
            if (d && d.length && d[0] && d[d[0]])
                for (b = d.length; b--; )
                    c = d[b],
                    "string" == typeof d[c] && (e[a.camelCase(c)] = d[c]);
            else
                for (c in d)
                    "string" == typeof d[c] && (e[c] = d[c]);
            return e
        }
        var e = ["add", "remove", "toggle"]
          , d = {
            border: 1,
            borderBottom: 1,
            borderColor: 1,
            borderLeft: 1,
            borderRight: 1,
            borderTop: 1,
            borderWidth: 1,
            margin: 1,
            padding: 1
        };
        a.each(["borderLeftStyle", "borderRightStyle", "borderBottomStyle", "borderTopStyle"], function(b, c) {
            a.fx.step[c] = function(a) {
                ("none" !== a.end && !a.setAttr || 1 === a.pos && !a.setAttr) && (jQuery.style(a.elem, c, a.end),
                a.setAttr = !0)
            }
        });
        a.fn.addBack || (a.fn.addBack = function(a) {
            return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
        }
        );
        a.effects.animateClass = function(b, c, h, g) {
            var l = a.speed(c, h, g);
            return this.queue(function() {
                var c, h = a(this), g = h.attr("class") || "", m = l.children ? h.find("*").addBack() : h, m = m.map(function() {
                    return {
                        el: a(this),
                        start: f(this)
                    }
                });
                c = function() {
                    a.each(e, function(a, c) {
                        b[c] && h[c + "Class"](b[c])
                    })
                }
                ;
                c();
                m = m.map(function() {
                    this.end = f(this.el[0]);
                    var c = this.start, b = this.end, h, e, g = {};
                    for (h in b)
                        e = b[h],
                        c[h] !== e && (d[h] || (a.fx.step[h] || !isNaN(parseFloat(e))) && (g[h] = e));
                    return this.diff = g,
                    this
                });
                h.attr("class", g);
                m = m.map(function() {
                    var c = this
                      , b = a.Deferred()
                      , d = a.extend({}, l, {
                        queue: !1,
                        complete: function() {
                            b.resolve(c)
                        }
                    });
                    return this.el.animate(this.diff, d),
                    b.promise()
                });
                a.when.apply(a, m.get()).done(function() {
                    c();
                    a.each(arguments, function() {
                        var c = this.el;
                        a.each(this.diff, function(a) {
                            c.css(a, "")
                        })
                    });
                    l.complete.call(h[0])
                })
            })
        }
        ;
        a.fn.extend({
            addClass: function(b) {
                return function(c, d, e, f) {
                    return d ? a.effects.animateClass.call(this, {
                        add: c
                    }, d, e, f) : b.apply(this, arguments)
                }
            }(a.fn.addClass),
            removeClass: function(b) {
                return function(c, d, e, f) {
                    return 1 < arguments.length ? a.effects.animateClass.call(this, {
                        remove: c
                    }, d, e, f) : b.apply(this, arguments)
                }
            }(a.fn.removeClass),
            toggleClass: function(b) {
                return function(c, d, e, f, n) {
                    return "boolean" == typeof d || d === g ? e ? a.effects.animateClass.call(this, d ? {
                        add: c
                    } : {
                        remove: c
                    }, e, f, n) : b.apply(this, arguments) : a.effects.animateClass.call(this, {
                        toggle: c
                    }, d, e, f)
                }
            }(a.fn.toggleClass),
            switchClass: function(b, c, d, e, f) {
                return a.effects.animateClass.call(this, {
                    add: c,
                    remove: b
                }, d, e, f)
            }
        })
    }
    )();
    (function() {
        function f(d, b, c, h) {
            return a.isPlainObject(d) && (b = d,
            d = d.effect),
            d = {
                effect: d
            },
            null == b && (b = {}),
            a.isFunction(b) && (h = b,
            c = null,
            b = {}),
            ("number" == typeof b || a.fx.speeds[b]) && (h = c,
            c = b,
            b = {}),
            a.isFunction(c) && (h = c,
            c = null),
            b && a.extend(d, b),
            c = c || b.duration,
            d.duration = a.fx.off ? 0 : "number" == typeof c ? c : c in a.fx.speeds ? a.fx.speeds[c] : a.fx.speeds._default,
            d.complete = h || b.complete,
            d
        }
        function e(d) {
            return !d || "number" == typeof d || a.fx.speeds[d] ? !0 : "string" != typeof d || a.effects.effect[d] ? a.isFunction(d) ? !0 : "object" != typeof d || d.effect ? !1 : !0 : !0
        }
        a.extend(a.effects, {
            version: "1.10.3",
            save: function(a, b) {
                for (var c = 0; c < b.length; c++)
                    null !== b[c] && a.data("ui-effects-" + b[c], a[0].style[b[c]])
            },
            restore: function(a, b) {
                var c, h;
                for (h = 0; h < b.length; h++)
                    null !== b[h] && (c = a.data("ui-effects-" + b[h]),
                    c === g && (c = ""),
                    a.css(b[h], c))
            },
            setMode: function(a, b) {
                return "toggle" === b && (b = a.is(":hidden") ? "show" : "hide"),
                b
            },
            getBaseline: function(a, b) {
                var c, h;
                switch (a[0]) {
                case "top":
                    c = 0;
                    break;
                case "middle":
                    c = 0.5;
                    break;
                case "bottom":
                    c = 1;
                    break;
                default:
                    c = a[0] / b.height
                }
                switch (a[1]) {
                case "left":
                    h = 0;
                    break;
                case "center":
                    h = 0.5;
                    break;
                case "right":
                    h = 1;
                    break;
                default:
                    h = a[1] / b.width
                }
                return {
                    x: h,
                    y: c
                }
            },
            createWrapper: function(d) {
                if (d.parent().is(".ui-effects-wrapper"))
                    return d.parent();
                var b = {
                    width: d.outerWidth(!0),
                    height: d.outerHeight(!0),
                    "float": d.css("float")
                }
                  , c = a("<div></div>").addClass("ui-effects-wrapper").css({
                    fontSize: "100%",
                    background: "transparent",
                    border: "none",
                    margin: 0,
                    padding: 0
                })
                  , h = {
                    width: d.width(),
                    height: d.height()
                }
                  , e = document.activeElement;
                try {
                    e.id
                } catch (f) {
                    e = document.body
                }
                return d.wrap(c),
                (d[0] === e || a.contains(d[0], e)) && a(e).focus(),
                c = d.parent(),
                "static" === d.css("position") ? (c.css({
                    position: "relative"
                }),
                d.css({
                    position: "relative"
                })) : (a.extend(b, {
                    position: d.css("position"),
                    zIndex: d.css("z-index")
                }),
                a.each(["top", "left", "bottom", "right"], function(a, c) {
                    b[c] = d.css(c);
                    isNaN(parseInt(b[c], 10)) && (b[c] = "auto")
                }),
                d.css({
                    position: "relative",
                    top: 0,
                    left: 0,
                    right: "auto",
                    bottom: "auto"
                })),
                d.css(h),
                c.css(b).show()
            },
            removeWrapper: function(d) {
                var b = document.activeElement;
                return d.parent().is(".ui-effects-wrapper") && (d.parent().replaceWith(d),
                (d[0] === b || a.contains(d[0], b)) && a(b).focus()),
                d
            },
            setTransition: function(d, b, c, h) {
                return h = h || {},
                a.each(b, function(a, b) {
                    var e = d.cssUnit(b);
                    0 < e[0] && (h[b] = e[0] * c + e[1])
                }),
                h
            }
        });
        a.fn.extend({
            effect: function() {
                function d(c) {
                    function d() {
                        a.isFunction(f) && f.call(h[0]);
                        a.isFunction(c) && c()
                    }
                    var h = a(this)
                      , f = b.complete
                      , g = b.mode;
                    (h.is(":hidden") ? "hide" === g : "show" === g) ? (h[g](),
                    d()) : e.call(h[0], b, d)
                }
                var b = f.apply(this, arguments)
                  , c = b.mode
                  , h = b.queue
                  , e = a.effects.effect[b.effect];
                return a.fx.off || !e ? c ? this[c](b.duration, b.complete) : this.each(function() {
                    b.complete && b.complete.call(this)
                }) : !1 === h ? this.each(d) : this.queue(h || "fx", d)
            },
            show: function(a) {
                return function(b) {
                    if (e(b))
                        return a.apply(this, arguments);
                    var c = f.apply(this, arguments);
                    return c.mode = "show",
                    this.effect.call(this, c)
                }
            }(a.fn.show),
            hide: function(a) {
                return function(b) {
                    if (e(b))
                        return a.apply(this, arguments);
                    var c = f.apply(this, arguments);
                    return c.mode = "hide",
                    this.effect.call(this, c)
                }
            }(a.fn.hide),
            toggle: function(a) {
                return function(b) {
                    if (e(b) || "boolean" == typeof b)
                        return a.apply(this, arguments);
                    var c = f.apply(this, arguments);
                    return c.mode = "toggle",
                    this.effect.call(this, c)
                }
            }(a.fn.toggle),
            cssUnit: function(d) {
                var b = this.css(d)
                  , c = [];
                return a.each(["em", "px", "%", "pt"], function(a, d) {
                    0 < b.indexOf(d) && (c = [parseFloat(b), d])
                }),
                c
            }
        })
    }
    )();
    (function() {
        var f = {};
        a.each(["Quad", "Cubic", "Quart", "Quint", "Expo"], function(a, d) {
            f[d] = function(b) {
                return Math.pow(b, a + 2)
            }
        });
        a.extend(f, {
            Sine: function(a) {
                return 1 - Math.cos(a * Math.PI / 2)
            },
            Circ: function(a) {
                return 1 - Math.sqrt(1 - a * a)
            },
            Elastic: function(a) {
                return 0 === a || 1 === a ? a : -Math.pow(2, 8 * (a - 1)) * Math.sin((80 * (a - 1) - 7.5) * Math.PI / 15)
            },
            Back: function(a) {
                return a * a * (3 * a - 2)
            },
            Bounce: function(a) {
                for (var d, b = 4; a < ((d = Math.pow(2, --b)) - 1) / 11; )
                    ;
                return 1 / Math.pow(4, 3 - b) - 7.5625 * Math.pow((3 * d - 2) / 22 - a, 2)
            }
        });
        a.each(f, function(e, d) {
            a.easing["easeIn" + e] = d;
            a.easing["easeOut" + e] = function(a) {
                return 1 - d(1 - a)
            }
            ;
            a.easing["easeInOut" + e] = function(a) {
                return 0.5 > a ? d(2 * a) / 2 : 1 - d(-2 * a + 2) / 2
            }
        })
    }
    )()
}
)(jQuery);
(function(a) {
    var g = 0
      , f = {}
      , e = {};
    f.height = f.paddingTop = f.paddingBottom = f.borderTopWidth = f.borderBottomWidth = "hide";
    e.height = e.paddingTop = e.paddingBottom = e.borderTopWidth = e.borderBottomWidth = "show";
    a.widget("ui.accordion", {
        version: "1.10.3",
        options: {
            active: 0,
            animate: {},
            collapsible: !1,
            event: "click",
            header: "> li > :first-child,> :not(li):even",
            heightStyle: "auto",
            icons: {
                activeHeader: "ui-icon-triangle-1-s",
                header: "ui-icon-triangle-1-e"
            },
            activate: null,
            beforeActivate: null
        },
        _create: function() {
            var d = this.options;
            this.prevShow = this.prevHide = a();
            this.element.addClass("ui-accordion ui-widget ui-helper-reset").attr("role", "tablist");
            d.collapsible || !1 !== d.active && null != d.active || (d.active = 0);
            this._processPanels();
            0 > d.active && (d.active += this.headers.length);
            this._refresh()
        },
        _getCreateEventData: function() {
            return {
                header: this.active,
                panel: this.active.length ? this.active.next() : a(),
                content: this.active.length ? this.active.next() : a()
            }
        },
        _createIcons: function() {
            var d = this.options.icons;
            d && (a("<span>").addClass("ui-accordion-header-icon ui-icon " + d.header).prependTo(this.headers),
            this.active.children(".ui-accordion-header-icon").removeClass(d.header).addClass(d.activeHeader),
            this.headers.addClass("ui-accordion-icons"))
        },
        _destroyIcons: function() {
            this.headers.removeClass("ui-accordion-icons").children(".ui-accordion-header-icon").remove()
        },
        _destroy: function() {
            var a;
            this.element.removeClass("ui-accordion ui-widget ui-helper-reset").removeAttr("role");
            this.headers.removeClass("ui-accordion-header ui-accordion-header-active ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top").removeAttr("role").removeAttr("aria-selected").removeAttr("aria-controls").removeAttr("tabIndex").each(function() {
                /^ui-accordion/.test(this.id) && this.removeAttribute("id")
            });
            this._destroyIcons();
            a = this.headers.next().css("display", "").removeAttr("role").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-labelledby").removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-state-disabled").each(function() {
                /^ui-accordion/.test(this.id) && this.removeAttribute("id")
            });
            "content" !== this.options.heightStyle && a.css("height", "")
        },
        _setOption: function(a, b) {
            return "active" === a ? (this._activate(b),
            void 0) : ("event" === a && (this.options.event && this._off(this.headers, this.options.event),
            this._setupEvents(b)),
            this._super(a, b),
            "collapsible" !== a || b || !1 !== this.options.active || this._activate(0),
            "icons" === a && (this._destroyIcons(),
            b && this._createIcons()),
            "disabled" === a && this.headers.add(this.headers.next()).toggleClass("ui-state-disabled", !!b),
            void 0)
        },
        _keydown: function(d) {
            if (!d.altKey && !d.ctrlKey) {
                var b = a.ui.keyCode
                  , c = this.headers.length
                  , h = this.headers.index(d.target)
                  , e = !1;
                switch (d.keyCode) {
                case b.RIGHT:
                case b.DOWN:
                    e = this.headers[(h + 1) % c];
                    break;
                case b.LEFT:
                case b.UP:
                    e = this.headers[(h - 1 + c) % c];
                    break;
                case b.SPACE:
                case b.ENTER:
                    this._eventHandler(d);
                    break;
                case b.HOME:
                    e = this.headers[0];
                    break;
                case b.END:
                    e = this.headers[c - 1]
                }
                e && (a(d.target).attr("tabIndex", -1),
                a(e).attr("tabIndex", 0),
                e.focus(),
                d.preventDefault())
            }
        },
        _panelKeyDown: function(d) {
            d.keyCode === a.ui.keyCode.UP && d.ctrlKey && a(d.currentTarget).prev().focus()
        },
        refresh: function() {
            var d = this.options;
            this._processPanels();
            !1 === d.active && !0 === d.collapsible || !this.headers.length ? (d.active = !1,
            this.active = a()) : !1 === d.active ? this._activate(0) : this.active.length && !a.contains(this.element[0], this.active[0]) ? this.headers.length === this.headers.find(".ui-state-disabled").length ? (d.active = !1,
            this.active = a()) : this._activate(Math.max(0, d.active - 1)) : d.active = this.headers.index(this.active);
            this._destroyIcons();
            this._refresh()
        },
        _processPanels: function() {
            this.headers = this.element.find(this.options.header).addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-all");
            this.headers.next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom").filter(":not(.ui-accordion-content-active)").hide()
        },
        _refresh: function() {
            var d, b = this.options, c = b.heightStyle, h = this.element.parent(), e = this.accordionId = "ui-accordion-" + (this.element.attr("id") || ++g);
            this.active = this._findActive(b.active).addClass("ui-accordion-header-active ui-state-active ui-corner-top").removeClass("ui-corner-all");
            this.active.next().addClass("ui-accordion-content-active").show();
            this.headers.attr("role", "tab").each(function(c) {
                var b = a(this)
                  , d = b.attr("id")
                  , h = b.next()
                  , f = h.attr("id");
                d || (d = e + "-header-" + c,
                b.attr("id", d));
                f || (f = e + "-panel-" + c,
                h.attr("id", f));
                b.attr("aria-controls", f);
                h.attr("aria-labelledby", d)
            }).next().attr("role", "tabpanel");
            this.headers.not(this.active).attr({
                "aria-selected": "false",
                tabIndex: -1
            }).next().attr({
                "aria-expanded": "false",
                "aria-hidden": "true"
            }).hide();
            this.active.length ? this.active.attr({
                "aria-selected": "true",
                tabIndex: 0
            }).next().attr({
                "aria-expanded": "true",
                "aria-hidden": "false"
            }) : this.headers.eq(0).attr("tabIndex", 0);
            this._createIcons();
            this._setupEvents(b.event);
            "fill" === c ? (d = h.height(),
            this.element.siblings(":visible").each(function() {
                var c = a(this)
                  , b = c.css("position");
                "absolute" !== b && "fixed" !== b && (d -= c.outerHeight(!0))
            }),
            this.headers.each(function() {
                d -= a(this).outerHeight(!0)
            }),
            this.headers.next().each(function() {
                a(this).height(Math.max(0, d - a(this).innerHeight() + a(this).height()))
            }).css("overflow", "auto")) : "auto" === c && (d = 0,
            this.headers.next().each(function() {
                d = Math.max(d, a(this).css("height", "").height())
            }).height(d))
        },
        _activate: function(d) {
            d = this._findActive(d)[0];
            d !== this.active[0] && (d = d || this.active[0],
            this._eventHandler({
                target: d,
                currentTarget: d,
                preventDefault: a.noop
            }))
        },
        _findActive: function(d) {
            return "number" == typeof d ? this.headers.eq(d) : a()
        },
        _setupEvents: function(d) {
            var b = {
                keydown: "_keydown"
            };
            d && a.each(d.split(" "), function(a, d) {
                b[d] = "_eventHandler"
            });
            this._off(this.headers.add(this.headers.next()));
            this._on(this.headers, b);
            this._on(this.headers.next(), {
                keydown: "_panelKeyDown"
            });
            this._hoverable(this.headers);
            this._focusable(this.headers)
        },
        _eventHandler: function(d) {
            var b = this.options
              , c = this.active
              , h = a(d.currentTarget)
              , e = h[0] === c[0]
              , f = e && b.collapsible
              , g = f ? a() : h.next()
              , q = c.next()
              , g = {
                oldHeader: c,
                oldPanel: q,
                newHeader: f ? a() : h,
                newPanel: g
            };
            d.preventDefault();
            e && !b.collapsible || !1 === this._trigger("beforeActivate", d, g) || (b.active = f ? !1 : this.headers.index(h),
            this.active = e ? a() : h,
            this._toggle(g),
            c.removeClass("ui-accordion-header-active ui-state-active"),
            b.icons && c.children(".ui-accordion-header-icon").removeClass(b.icons.activeHeader).addClass(b.icons.header),
            e || (h.removeClass("ui-corner-all").addClass("ui-accordion-header-active ui-state-active ui-corner-top"),
            b.icons && h.children(".ui-accordion-header-icon").removeClass(b.icons.header).addClass(b.icons.activeHeader),
            h.next().addClass("ui-accordion-content-active")))
        },
        _toggle: function(d) {
            var b = d.newPanel
              , c = this.prevShow.length ? this.prevShow : d.oldPanel;
            this.prevShow.add(this.prevHide).stop(!0, !0);
            this.prevShow = b;
            this.prevHide = c;
            this.options.animate ? this._animate(b, c, d) : (c.hide(),
            b.show(),
            this._toggleComplete(d));
            c.attr({
                "aria-expanded": "false",
                "aria-hidden": "true"
            });
            c.prev().attr("aria-selected", "false");
            b.length && c.length ? c.prev().attr("tabIndex", -1) : b.length && this.headers.filter(function() {
                return 0 === a(this).attr("tabIndex")
            }).attr("tabIndex", -1);
            b.attr({
                "aria-expanded": "true",
                "aria-hidden": "false"
            }).prev().attr({
                "aria-selected": "true",
                tabIndex: 0
            })
        },
        _animate: function(a, b, c) {
            var h, g, l, n = this, q = 0, p = a.length && (!b.length || a.index() < b.index()), r = this.options.animate || {}, p = p && r.down || r, s = function() {
                n._toggleComplete(c)
            };
            return "number" == typeof p && (l = p),
            "string" == typeof p && (g = p),
            g = g || p.easing || r.easing,
            l = l || p.duration || r.duration,
            b.length ? a.length ? (h = a.show().outerHeight(),
            b.animate(f, {
                duration: l,
                easing: g,
                step: function(a, c) {
                    c.now = Math.round(a)
                }
            }),
            a.hide().animate(e, {
                duration: l,
                easing: g,
                complete: s,
                step: function(a, c) {
                    c.now = Math.round(a);
                    "height" !== c.prop ? q += c.now : "content" !== n.options.heightStyle && (c.now = Math.round(h - b.outerHeight() - q),
                    q = 0)
                }
            }),
            void 0) : b.animate(f, l, g, s) : a.animate(e, l, g, s)
        },
        _toggleComplete: function(a) {
            var b = a.oldPanel;
            b.removeClass("ui-accordion-content-active").prev().removeClass("ui-corner-top").addClass("ui-corner-all");
            b.length && (b.parent()[0].className = b.parent()[0].className);
            this._trigger("activate", null, a)
        }
    })
}
)(jQuery);
(function(a) {
    var g = 0;
    a.widget("ui.autocomplete", {
        version: "1.10.3",
        defaultElement: "<input>",
        options: {
            appendTo: null,
            autoFocus: !1,
            delay: 300,
            minLength: 1,
            position: {
                my: "left top",
                at: "left bottom",
                collision: "none"
            },
            source: null,
            change: null,
            close: null,
            focus: null,
            open: null,
            response: null,
            search: null,
            select: null
        },
        pending: 0,
        _create: function() {
            var f, e, d, b = this.element[0].nodeName.toLowerCase(), c = "textarea" === b, b = "input" === b;
            this.isMultiLine = c ? !0 : b ? !1 : this.element.prop("isContentEditable");
            this.valueMethod = this.element[c || b ? "val" : "text"];
            this.isNewMenu = !0;
            this.element.addClass("ui-autocomplete-input").attr("autocomplete", "off");
            this._on(this.element, {
                keydown: function(c) {
                    if (this.element.prop("readOnly"))
                        return f = !0,
                        d = !0,
                        e = !0,
                        void 0;
                    e = d = f = !1;
                    var b = a.ui.keyCode;
                    switch (c.keyCode) {
                    case b.PAGE_UP:
                        f = !0;
                        this._move("previousPage", c);
                        break;
                    case b.PAGE_DOWN:
                        f = !0;
                        this._move("nextPage", c);
                        break;
                    case b.UP:
                        f = !0;
                        this._keyEvent("previous", c);
                        break;
                    case b.DOWN:
                        f = !0;
                        this._keyEvent("next", c);
                        break;
                    case b.ENTER:
                    case b.NUMPAD_ENTER:
                        this.menu.active && (f = !0,
                        c.preventDefault(),
                        this.menu.select(c));
                        break;
                    case b.TAB:
                        this.menu.active && this.menu.select(c);
                        break;
                    case b.ESCAPE:
                        this.menu.element.is(":visible") && (this._value(this.term),
                        this.close(c),
                        c.preventDefault());
                        break;
                    default:
                        e = !0,
                        this._searchTimeout(c)
                    }
                },
                keypress: function(c) {
                    if (f)
                        return f = !1,
                        (!this.isMultiLine || this.menu.element.is(":visible")) && c.preventDefault(),
                        void 0;
                    if (!e) {
                        var b = a.ui.keyCode;
                        switch (c.keyCode) {
                        case b.PAGE_UP:
                            this._move("previousPage", c);
                            break;
                        case b.PAGE_DOWN:
                            this._move("nextPage", c);
                            break;
                        case b.UP:
                            this._keyEvent("previous", c);
                            break;
                        case b.DOWN:
                            this._keyEvent("next", c)
                        }
                    }
                },
                input: function(a) {
                    return d ? (d = !1,
                    a.preventDefault(),
                    void 0) : (this._searchTimeout(a),
                    void 0)
                },
                focus: function() {
                    this.selectedItem = null;
                    this.previous = this._value()
                },
                blur: function(a) {
                    return this.cancelBlur ? (delete this.cancelBlur,
                    void 0) : (clearTimeout(this.searching),
                    this.close(a),
                    this._change(a),
                    void 0)
                }
            });
            this._initSource();
            this.menu = a("<ul>").addClass("ui-autocomplete ui-front").appendTo(this._appendTo()).menu({
                role: null
            }).hide().data("ui-menu");
            this._on(this.menu.element, {
                mousedown: function(c) {
                    c.preventDefault();
                    this.cancelBlur = !0;
                    this._delay(function() {
                        delete this.cancelBlur
                    });
                    var b = this.menu.element[0];
                    a(c.target).closest(".ui-menu-item").length || this._delay(function() {
                        var c = this;
                        this.document.one("mousedown", function(d) {
                            d.target === c.element[0] || d.target === b || a.contains(b, d.target) || c.close()
                        })
                    })
                },
                menufocus: function(c, b) {
                    if (this.isNewMenu && (this.isNewMenu = !1,
                    c.originalEvent && /^mouse/.test(c.originalEvent.type)))
                        return this.menu.blur(),
                        this.document.one("mousemove", function() {
                            a(c.target).trigger(c.originalEvent)
                        }),
                        void 0;
                    var d = b.item.data("ui-autocomplete-item");
                    !1 !== this._trigger("focus", c, {
                        item: d
                    }) ? c.originalEvent && /^key/.test(c.originalEvent.type) && this._value(d.value) : this.liveRegion.text(d.value)
                },
                menuselect: function(a, c) {
                    var b = c.item.data("ui-autocomplete-item")
                      , d = this.previous;
                    this.element[0] !== this.document[0].activeElement && (this.element.focus(),
                    this.previous = d,
                    this._delay(function() {
                        this.previous = d;
                        this.selectedItem = b
                    }));
                    !1 !== this._trigger("select", a, {
                        item: b
                    }) && this._value(b.value);
                    this.term = this._value();
                    this.close(a);
                    this.selectedItem = b
                }
            });
            this.liveRegion = a("<span>", {
                role: "status",
                "aria-live": "polite"
            }).addClass("ui-helper-hidden-accessible").insertBefore(this.element);
            this._on(this.window, {
                beforeunload: function() {
                    this.element.removeAttr("autocomplete")
                }
            })
        },
        _destroy: function() {
            clearTimeout(this.searching);
            this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete");
            this.menu.element.remove();
            this.liveRegion.remove()
        },
        _setOption: function(a, e) {
            this._super(a, e);
            "source" === a && this._initSource();
            "appendTo" === a && this.menu.element.appendTo(this._appendTo());
            "disabled" === a && e && this.xhr && this.xhr.abort()
        },
        _appendTo: function() {
            var f = this.options.appendTo;
            return f && (f = f.jquery || f.nodeType ? a(f) : this.document.find(f).eq(0)),
            f || (f = this.element.closest(".ui-front")),
            f.length || (f = this.document[0].body),
            f
        },
        _initSource: function() {
            var f, e, d = this;
            a.isArray(this.options.source) ? (f = this.options.source,
            this.source = function(b, c) {
                c(a.ui.autocomplete.filter(f, b.term))
            }
            ) : "string" == typeof this.options.source ? (e = this.options.source,
            this.source = function(b, c) {
                d.xhr && d.xhr.abort();
                d.xhr = a.ajax({
                    url: e,
                    data: b,
                    dataType: "json",
                    success: function(a) {
                        c(a)
                    },
                    error: function() {
                        c([])
                    }
                })
            }
            ) : this.source = this.options.source
        },
        _searchTimeout: function(a) {
            clearTimeout(this.searching);
            this.searching = this._delay(function() {
                this.term !== this._value() && (this.selectedItem = null,
                this.search(null, a))
            }, this.options.delay)
        },
        search: function(a, e) {
            return a = null != a ? a : this._value(),
            this.term = this._value(),
            a.length < this.options.minLength ? this.close(e) : !1 !== this._trigger("search", e) ? this._search(a) : void 0
        },
        _search: function(a) {
            this.pending++;
            this.element.addClass("ui-autocomplete-loading");
            this.cancelSearch = !1;
            this.source({
                term: a
            }, this._response())
        },
        _response: function() {
            var a = this
              , e = ++g;
            return function(d) {
                e === g && a.__response(d);
                a.pending--;
                a.pending || a.element.removeClass("ui-autocomplete-loading")
            }
        },
        __response: function(a) {
            a && (a = this._normalize(a));
            this._trigger("response", null, {
                content: a
            });
            !this.options.disabled && a && a.length && !this.cancelSearch ? (this._suggest(a),
            this._trigger("open")) : this._close()
        },
        close: function(a) {
            this.cancelSearch = !0;
            this._close(a)
        },
        _close: function(a) {
            this.menu.element.is(":visible") && (this.menu.element.hide(),
            this.menu.blur(),
            this.isNewMenu = !0,
            this._trigger("close", a))
        },
        _change: function(a) {
            this.previous !== this._value() && this._trigger("change", a, {
                item: this.selectedItem
            })
        },
        _normalize: function(f) {
            return f.length && f[0].label && f[0].value ? f : a.map(f, function(e) {
                return "string" == typeof e ? {
                    label: e,
                    value: e
                } : a.extend({
                    label: e.label || e.value,
                    value: e.value || e.label
                }, e)
            })
        },
        _suggest: function(f) {
            var e = this.menu.element.empty();
            this._renderMenu(e, f);
            this.isNewMenu = !0;
            this.menu.refresh();
            e.show();
            this._resizeMenu();
            e.position(a.extend({
                of: this.element
            }, this.options.position));
            this.options.autoFocus && this.menu.next()
        },
        _resizeMenu: function() {
            var a = this.menu.element;
            a.outerWidth(Math.max(a.width("").outerWidth() + 1, this.element.outerWidth()))
        },
        _renderMenu: function(f, e) {
            var d = this;
            a.each(e, function(a, c) {
                d._renderItemData(f, c)
            })
        },
        _renderItemData: function(a, e) {
            return this._renderItem(a, e).data("ui-autocomplete-item", e)
        },
        _renderItem: function(f, e) {
            return a("<li>").append(a("<a>").text(e.label)).appendTo(f)
        },
        _move: function(a, e) {
            return this.menu.element.is(":visible") ? this.menu.isFirstItem() && /^previous/.test(a) || this.menu.isLastItem() && /^next/.test(a) ? (this._value(this.term),
            this.menu.blur(),
            void 0) : (this.menu[a](e),
            void 0) : (this.search(null, e),
            void 0)
        },
        widget: function() {
            return this.menu.element
        },
        _value: function() {
            return this.valueMethod.apply(this.element, arguments)
        },
        _keyEvent: function(a, e) {
            this.isMultiLine && !this.menu.element.is(":visible") || (this._move(a, e),
            e.preventDefault())
        }
    });
    a.extend(a.ui.autocomplete, {
        escapeRegex: function(a) {
            return a.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")
        },
        filter: function(f, e) {
            var d = RegExp(a.ui.autocomplete.escapeRegex(e), "i");
            return a.grep(f, function(a) {
                return d.test(a.label || a.value || a)
            })
        }
    });
    a.widget("ui.autocomplete", a.ui.autocomplete, {
        options: {
            messages: {
                noResults: "No search results.",
                results: function(a) {
                    return a + (1 < a ? " results are" : " result is") + " available, use up and down arrow keys to navigate."
                }
            }
        },
        __response: function(a) {
            var e;
            this._superApply(arguments);
            this.options.disabled || this.cancelSearch || (e = a && a.length ? this.options.messages.results(a.length) : this.options.messages.noResults,
            this.liveRegion.text(e))
        }
    })
}
)(jQuery);
(function(a) {
    var g, f, e, d, b = function() {
        var c = a(this);
        setTimeout(function() {
            c.find(":ui-button").button("refresh")
        }, 1)
    }, c = function(c) {
        var b = c.name
          , d = c.form
          , e = a([]);
        return b && (b = b.replace(/'/g, "\\'"),
        e = d ? a(d).find("[name='" + b + "']") : a("[name='" + b + "']", c.ownerDocument).filter(function() {
            return !this.form
        })),
        e
    };
    a.widget("ui.button", {
        version: "1.10.3",
        defaultElement: "<button>",
        options: {
            disabled: null,
            text: !0,
            label: null,
            icons: {
                primary: null,
                secondary: null
            }
        },
        _create: function() {
            this.element.closest("form").unbind("reset" + this.eventNamespace).bind("reset" + this.eventNamespace, b);
            "boolean" != typeof this.options.disabled ? this.options.disabled = !!this.element.prop("disabled") : this.element.prop("disabled", this.options.disabled);
            this._determineButtonType();
            this.hasTitle = !!this.buttonElement.attr("title");
            var h = this
              , m = this.options
              , l = "checkbox" === this.type || "radio" === this.type
              , n = l ? "" : "ui-state-active";
            null === m.label && (m.label = "input" === this.type ? this.buttonElement.val() : this.buttonElement.html());
            this._hoverable(this.buttonElement);
            this.buttonElement.addClass("ui-button ui-widget ui-state-default ui-corner-all").attr("role", "button").bind("mouseenter" + this.eventNamespace, function() {
                m.disabled || this === g && a(this).addClass("ui-state-active")
            }).bind("mouseleave" + this.eventNamespace, function() {
                m.disabled || a(this).removeClass(n)
            }).bind("click" + this.eventNamespace, function(a) {
                m.disabled && (a.preventDefault(),
                a.stopImmediatePropagation())
            });
            this.element.bind("focus" + this.eventNamespace, function() {
                h.buttonElement.addClass("ui-state-focus")
            }).bind("blur" + this.eventNamespace, function() {
                h.buttonElement.removeClass("ui-state-focus")
            });
            l && (this.element.bind("change" + this.eventNamespace, function() {
                d || h.refresh()
            }),
            this.buttonElement.bind("mousedown" + this.eventNamespace, function(a) {
                m.disabled || (d = !1,
                f = a.pageX,
                e = a.pageY)
            }).bind("mouseup" + this.eventNamespace, function(a) {
                m.disabled || (f !== a.pageX || e !== a.pageY) && (d = !0)
            }));
            "checkbox" === this.type ? this.buttonElement.bind("click" + this.eventNamespace, function() {
                return m.disabled || d ? !1 : void 0
            }) : "radio" === this.type ? this.buttonElement.bind("click" + this.eventNamespace, function() {
                if (m.disabled || d)
                    return !1;
                a(this).addClass("ui-state-active");
                h.buttonElement.attr("aria-pressed", "true");
                var b = h.element[0];
                c(b).not(b).map(function() {
                    return a(this).button("widget")[0]
                }).removeClass("ui-state-active").attr("aria-pressed", "false")
            }) : (this.buttonElement.bind("mousedown" + this.eventNamespace, function() {
                return m.disabled ? !1 : (a(this).addClass("ui-state-active"),
                g = this,
                h.document.one("mouseup", function() {
                    g = null
                }),
                void 0)
            }).bind("mouseup" + this.eventNamespace, function() {
                return m.disabled ? !1 : (a(this).removeClass("ui-state-active"),
                void 0)
            }).bind("keydown" + this.eventNamespace, function(c) {
                return m.disabled ? !1 : ((c.keyCode === a.ui.keyCode.SPACE || c.keyCode === a.ui.keyCode.ENTER) && a(this).addClass("ui-state-active"),
                void 0)
            }).bind("keyup" + this.eventNamespace + " blur" + this.eventNamespace, function() {
                a(this).removeClass("ui-state-active")
            }),
            this.buttonElement.is("a") && this.buttonElement.keyup(function(c) {
                c.keyCode === a.ui.keyCode.SPACE && a(this).click()
            }));
            this._setOption("disabled", m.disabled);
            this._resetButton()
        },
        _determineButtonType: function() {
            var a, c, b;
            this.type = this.element.is("[type=checkbox]") ? "checkbox" : this.element.is("[type=radio]") ? "radio" : this.element.is("input") ? "input" : "button";
            "checkbox" === this.type || "radio" === this.type ? (a = this.element.parents().last(),
            c = "label[for='" + this.element.attr("id") + "']",
            this.buttonElement = a.find(c),
            this.buttonElement.length || (a = a.length ? a.siblings() : this.element.siblings(),
            this.buttonElement = a.filter(c),
            this.buttonElement.length || (this.buttonElement = a.find(c))),
            this.element.addClass("ui-helper-hidden-accessible"),
            b = this.element.is(":checked"),
            b && this.buttonElement.addClass("ui-state-active"),
            this.buttonElement.prop("aria-pressed", b)) : this.buttonElement = this.element
        },
        widget: function() {
            return this.buttonElement
        },
        _destroy: function() {
            this.element.removeClass("ui-helper-hidden-accessible");
            this.buttonElement.removeClass("ui-button ui-widget ui-state-default ui-corner-all ui-state-hover ui-state-active  ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only").removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html());
            this.hasTitle || this.buttonElement.removeAttr("title")
        },
        _setOption: function(a, c) {
            return this._super(a, c),
            "disabled" === a ? (c ? this.element.prop("disabled", !0) : this.element.prop("disabled", !1),
            void 0) : (this._resetButton(),
            void 0)
        },
        refresh: function() {
            var b = this.element.is("input, button") ? this.element.is(":disabled") : this.element.hasClass("ui-button-disabled");
            b !== this.options.disabled && this._setOption("disabled", b);
            "radio" === this.type ? c(this.element[0]).each(function() {
                a(this).is(":checked") ? a(this).button("widget").addClass("ui-state-active").attr("aria-pressed", "true") : a(this).button("widget").removeClass("ui-state-active").attr("aria-pressed", "false")
            }) : "checkbox" === this.type && (this.element.is(":checked") ? this.buttonElement.addClass("ui-state-active").attr("aria-pressed", "true") : this.buttonElement.removeClass("ui-state-active").attr("aria-pressed", "false"))
        },
        _resetButton: function() {
            if ("input" === this.type)
                return this.options.label && this.element.val(this.options.label),
                void 0;
            var c = this.buttonElement.removeClass("ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only")
              , b = a("<span></span>", this.document[0]).addClass("ui-button-text").html(this.options.label).appendTo(c.empty()).text()
              , d = this.options.icons
              , e = d.primary && d.secondary
              , f = [];
            d.primary || d.secondary ? (this.options.text && f.push("ui-button-text-icon" + (e ? "s" : d.primary ? "-primary" : "-secondary")),
            d.primary && c.prepend("<span class='ui-button-icon-primary ui-icon " + d.primary + "'></span>"),
            d.secondary && c.append("<span class='ui-button-icon-secondary ui-icon " + d.secondary + "'></span>"),
            this.options.text || (f.push(e ? "ui-button-icons-only" : "ui-button-icon-only"),
            this.hasTitle || c.attr("title", a.trim(b)))) : f.push("ui-button-text-only");
            c.addClass(f.join(" "))
        }
    });
    a.widget("ui.buttonset", {
        version: "1.10.3",
        options: {
            items: "button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(ui-button)"
        },
        _create: function() {
            this.element.addClass("ui-buttonset")
        },
        _init: function() {
            this.refresh()
        },
        _setOption: function(a, c) {
            "disabled" === a && this.buttons.button("option", a, c);
            this._super(a, c)
        },
        refresh: function() {
            var c = "rtl" === this.element.css("direction");
            this.buttons = this.element.find(this.options.items).filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function() {
                return a(this).button("widget")[0]
            }).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass(c ? "ui-corner-right" : "ui-corner-left").end().filter(":last").addClass(c ? "ui-corner-left" : "ui-corner-right").end().end()
        },
        _destroy: function() {
            this.element.removeClass("ui-buttonset");
            this.buttons.map(function() {
                return a(this).button("widget")[0]
            }).removeClass("ui-corner-left ui-corner-right").end().button("destroy")
        }
    })
}
)(jQuery);
(function(a, g) {
    function f() {
        this._curInst = null;
        this._keyEvent = !1;
        this._disabledInputs = [];
        this._inDialog = this._datepickerShowing = !1;
        this._mainDivId = "ui-datepicker-div";
        this._inlineClass = "ui-datepicker-inline";
        this._appendClass = "ui-datepicker-append";
        this._triggerClass = "ui-datepicker-trigger";
        this._dialogClass = "ui-datepicker-dialog";
        this._disableClass = "ui-datepicker-disabled";
        this._unselectableClass = "ui-datepicker-unselectable";
        this._currentClass = "ui-datepicker-current-day";
        this._dayOverClass = "ui-datepicker-days-cell-over";
        this.regional = [];
        this.regional[""] = {
            closeText: "Done",
            prevText: "Prev",
            nextText: "Next",
            currentText: "Today",
            monthNames: "January February March April May June July August September October November December".split(" "),
            monthNamesShort: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
            dayNames: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
            dayNamesShort: "Sun Mon Tue Wed Thu Fri Sat".split(" "),
            dayNamesMin: "Su Mo Tu We Th Fr Sa".split(" "),
            weekHeader: "Wk",
            dateFormat: "mm/dd/yy",
            firstDay: 0,
            isRTL: !1,
            showMonthAfterYear: !1,
            yearSuffix: ""
        };
        this._defaults = {
            showOn: "focus",
            showAnim: "fadeIn",
            showOptions: {},
            defaultDate: null,
            appendText: "",
            buttonText: "...",
            buttonImage: "",
            buttonImageOnly: !1,
            hideIfNoPrevNext: !1,
            navigationAsDateFormat: !1,
            gotoCurrent: !1,
            changeMonth: !1,
            changeYear: !1,
            yearRange: "c-10:c+10",
            showOtherMonths: !1,
            selectOtherMonths: !1,
            showWeek: !1,
            calculateWeek: this.iso8601Week,
            shortYearCutoff: "+10",
            minDate: null,
            maxDate: null,
            duration: "fast",
            beforeShowDay: null,
            beforeShow: null,
            onSelect: null,
            onChangeMonthYear: null,
            onClose: null,
            numberOfMonths: 1,
            showCurrentAtPos: 0,
            stepMonths: 1,
            stepBigMonths: 12,
            altField: "",
            altFormat: "",
            constrainInput: !0,
            showButtonPanel: !1,
            autoSize: !1,
            disabled: !1
        };
        a.extend(this._defaults, this.regional[""]);
        this.dpDiv = e(a("<div id='" + this._mainDivId + "' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"))
    }
    function e(c) {
        return c.delegate("button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a", "mouseout", function() {
            a(this).removeClass("ui-state-hover");
            -1 !== this.className.indexOf("ui-datepicker-prev") && a(this).removeClass("ui-datepicker-prev-hover");
            -1 !== this.className.indexOf("ui-datepicker-next") && a(this).removeClass("ui-datepicker-next-hover")
        }).delegate("button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a", "mouseover", function() {
            a.datepicker._isDisabledDatepicker(b.inline ? c.parent()[0] : b.input[0]) || (a(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"),
            a(this).addClass("ui-state-hover"),
            -1 !== this.className.indexOf("ui-datepicker-prev") && a(this).addClass("ui-datepicker-prev-hover"),
            -1 !== this.className.indexOf("ui-datepicker-next") && a(this).addClass("ui-datepicker-next-hover"))
        })
    }
    function d(c, b) {
        a.extend(c, b);
        for (var d in b)
            null == b[d] && (c[d] = b[d]);
        return c
    }
    a.extend(a.ui, {
        datepicker: {
            version: "1.10.3"
        }
    });
    var b;
    a.extend(f.prototype, {
        markerClassName: "hasDatepicker",
        maxRows: 4,
        _widgetDatepicker: function() {
            return this.dpDiv
        },
        setDefaults: function(a) {
            return d(this._defaults, a || {}),
            this
        },
        _attachDatepicker: function(c, b) {
            var d, e, f;
            d = c.nodeName.toLowerCase();
            e = "div" === d || "span" === d;
            c.id || (this.uuid += 1,
            c.id = "dp" + this.uuid);
            f = this._newInst(a(c), e);
            f.settings = a.extend({}, b || {});
            "input" === d ? this._connectDatepicker(c, f) : e && this._inlineDatepicker(c, f)
        },
        _newInst: function(c, b) {
            return {
                id: c[0].id.replace(/([^A-Za-z0-9_\-])/g, "\\\\$1"),
                input: c,
                selectedDay: 0,
                selectedMonth: 0,
                selectedYear: 0,
                drawMonth: 0,
                drawYear: 0,
                inline: b,
                dpDiv: b ? e(a("<div class='" + this._inlineClass + " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")) : this.dpDiv
            }
        },
        _connectDatepicker: function(c, b) {
            var d = a(c);
            b.append = a([]);
            b.trigger = a([]);
            d.hasClass(this.markerClassName) || (this._attachments(d, b),
            d.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp),
            this._autoSize(b),
            a.data(c, "datepicker", b),
            b.settings.disabled && this._disableDatepicker(c))
        },
        _attachments: function(c, b) {
            var d, e, f;
            d = this._get(b, "appendText");
            var g = this._get(b, "isRTL");
            b.append && b.append.remove();
            d && (b.append = a("<span class='" + this._appendClass + "'>" + d + "</span>"),
            c[g ? "before" : "after"](b.append));
            c.unbind("focus", this._showDatepicker);
            b.trigger && b.trigger.remove();
            d = this._get(b, "showOn");
            "focus" !== d && "both" !== d || c.focus(this._showDatepicker);
            "button" !== d && "both" !== d || (e = this._get(b, "buttonText"),
            f = this._get(b, "buttonImage"),
            b.trigger = a(this._get(b, "buttonImageOnly") ? a("<img/>").addClass(this._triggerClass).attr({
                src: f,
                alt: e,
                title: e
            }) : a("<button type='button'></button>").addClass(this._triggerClass).html(f ? a("<img/>").attr({
                src: f,
                alt: e,
                title: e
            }) : e)),
            c[g ? "before" : "after"](b.trigger),
            b.trigger.click(function() {
                return a.datepicker._datepickerShowing && a.datepicker._lastInput === c[0] ? a.datepicker._hideDatepicker() : a.datepicker._datepickerShowing && a.datepicker._lastInput !== c[0] ? (a.datepicker._hideDatepicker(),
                a.datepicker._showDatepicker(c[0])) : a.datepicker._showDatepicker(c[0]),
                !1
            }))
        },
        _autoSize: function(a) {
            if (this._get(a, "autoSize") && !a.inline) {
                var b, d, e, f, g = new Date(2009,11,20), p = this._get(a, "dateFormat");
                p.match(/[DM]/) && (b = function(a) {
                    for (f = e = d = 0; f < a.length; f++)
                        a[f].length > d && (d = a[f].length,
                        e = f);
                    return e
                }
                ,
                g.setMonth(b(this._get(a, p.match(/MM/) ? "monthNames" : "monthNamesShort"))),
                g.setDate(b(this._get(a, p.match(/DD/) ? "dayNames" : "dayNamesShort")) + 20 - g.getDay()));
                a.input.attr("size", this._formatDate(a, g).length)
            }
        },
        _inlineDatepicker: function(c, b) {
            var d = a(c);
            d.hasClass(this.markerClassName) || (d.addClass(this.markerClassName).append(b.dpDiv),
            a.data(c, "datepicker", b),
            this._setDate(b, this._getDefaultDate(b), !0),
            this._updateDatepicker(b),
            this._updateAlternate(b),
            b.settings.disabled && this._disableDatepicker(c),
            b.dpDiv.css("display", "block"))
        },
        _dialogDatepicker: function(c, b, e, f, g) {
            var q, p, r, s, u;
            c = this._dialogInst;
            return c || (this.uuid += 1,
            q = "dp" + this.uuid,
            this._dialogInput = a("<input type='text' id='" + q + "' style='position: absolute; top: -100px; width: 0px;'/>"),
            this._dialogInput.keydown(this._doKeyDown),
            a("body").append(this._dialogInput),
            c = this._dialogInst = this._newInst(this._dialogInput, !1),
            c.settings = {},
            a.data(this._dialogInput[0], "datepicker", c)),
            d(c.settings, f || {}),
            b = b && b.constructor === Date ? this._formatDate(c, b) : b,
            this._dialogInput.val(b),
            this._pos = g ? g.length ? g : [g.pageX, g.pageY] : null,
            this._pos || (p = document.documentElement.clientWidth,
            r = document.documentElement.clientHeight,
            s = document.documentElement.scrollLeft || document.body.scrollLeft,
            u = document.documentElement.scrollTop || document.body.scrollTop,
            this._pos = [p / 2 - 100 + s, r / 2 - 150 + u]),
            this._dialogInput.css("left", this._pos[0] + 20 + "px").css("top", this._pos[1] + "px"),
            c.settings.onSelect = e,
            this._inDialog = !0,
            this.dpDiv.addClass(this._dialogClass),
            this._showDatepicker(this._dialogInput[0]),
            a.blockUI && a.blockUI(this.dpDiv),
            a.data(this._dialogInput[0], "datepicker", c),
            this
        },
        _destroyDatepicker: function(c) {
            var b, d = a(c), e = a.data(c, "datepicker");
            d.hasClass(this.markerClassName) && (b = c.nodeName.toLowerCase(),
            a.removeData(c, "datepicker"),
            "input" === b ? (e.append.remove(),
            e.trigger.remove(),
            d.removeClass(this.markerClassName).unbind("focus", this._showDatepicker).unbind("keydown", this._doKeyDown).unbind("keypress", this._doKeyPress).unbind("keyup", this._doKeyUp)) : ("div" === b || "span" === b) && d.removeClass(this.markerClassName).empty())
        },
        _enableDatepicker: function(c) {
            var b, d, e = a(c), f = a.data(c, "datepicker");
            e.hasClass(this.markerClassName) && (b = c.nodeName.toLowerCase(),
            "input" === b ? (c.disabled = !1,
            f.trigger.filter("button").each(function() {
                this.disabled = !1
            }).end().filter("img").css({
                opacity: "1.0",
                cursor: ""
            })) : ("div" === b || "span" === b) && (d = e.children("." + this._inlineClass),
            d.children().removeClass("ui-state-disabled"),
            d.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled", !1)),
            this._disabledInputs = a.map(this._disabledInputs, function(a) {
                return a === c ? null : a
            }))
        },
        _disableDatepicker: function(c) {
            var b, d, e = a(c), f = a.data(c, "datepicker");
            e.hasClass(this.markerClassName) && (b = c.nodeName.toLowerCase(),
            "input" === b ? (c.disabled = !0,
            f.trigger.filter("button").each(function() {
                this.disabled = !0
            }).end().filter("img").css({
                opacity: "0.5",
                cursor: "default"
            })) : ("div" === b || "span" === b) && (d = e.children("." + this._inlineClass),
            d.children().addClass("ui-state-disabled"),
            d.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled", !0)),
            this._disabledInputs = a.map(this._disabledInputs, function(a) {
                return a === c ? null : a
            }),
            this._disabledInputs[this._disabledInputs.length] = c)
        },
        _isDisabledDatepicker: function(a) {
            if (!a)
                return !1;
            for (var b = 0; b < this._disabledInputs.length; b++)
                if (this._disabledInputs[b] === a)
                    return !0;
            return !1
        },
        _getInst: function(c) {
            try {
                return a.data(c, "datepicker")
            } catch (b) {
                throw "Missing instance data for this datepicker";
            }
        },
        _optionDatepicker: function(c, b, e) {
            var f, n, q, p, r = this._getInst(c);
            return 2 === arguments.length && "string" == typeof b ? "defaults" === b ? a.extend({}, a.datepicker._defaults) : r ? "all" === b ? a.extend({}, r.settings) : this._get(r, b) : null : (f = b || {},
            "string" == typeof b && (f = {},
            f[b] = e),
            r && (this._curInst === r && this._hideDatepicker(),
            n = this._getDateDatepicker(c, !0),
            q = this._getMinMaxDate(r, "min"),
            p = this._getMinMaxDate(r, "max"),
            d(r.settings, f),
            null !== q && f.dateFormat !== g && f.minDate === g && (r.settings.minDate = this._formatDate(r, q)),
            null !== p && f.dateFormat !== g && f.maxDate === g && (r.settings.maxDate = this._formatDate(r, p)),
            "disabled"in f && (f.disabled ? this._disableDatepicker(c) : this._enableDatepicker(c)),
            this._attachments(a(c), r),
            this._autoSize(r),
            this._setDate(r, n),
            this._updateAlternate(r),
            this._updateDatepicker(r)),
            void 0)
        },
        _changeDatepicker: function(a, b, d) {
            this._optionDatepicker(a, b, d)
        },
        _refreshDatepicker: function(a) {
            (a = this._getInst(a)) && this._updateDatepicker(a)
        },
        _setDateDatepicker: function(a, b) {
            var d = this._getInst(a);
            d && (this._setDate(d, b),
            this._updateDatepicker(d),
            this._updateAlternate(d))
        },
        _getDateDatepicker: function(a, b) {
            var d = this._getInst(a);
            return d && !d.inline && this._setDateFromField(d, b),
            d ? this._getDate(d) : null
        },
        _doKeyDown: function(c) {
            var b, d, e, f = a.datepicker._getInst(c.target), g = !0, p = f.dpDiv.is(".ui-datepicker-rtl");
            if (f._keyEvent = !0,
            a.datepicker._datepickerShowing)
                switch (c.keyCode) {
                case 9:
                    a.datepicker._hideDatepicker();
                    g = !1;
                    break;
                case 13:
                    return e = a("td." + a.datepicker._dayOverClass + ":not(." + a.datepicker._currentClass + ")", f.dpDiv),
                    e[0] && a.datepicker._selectDay(c.target, f.selectedMonth, f.selectedYear, e[0]),
                    b = a.datepicker._get(f, "onSelect"),
                    b ? (d = a.datepicker._formatDate(f),
                    b.apply(f.input ? f.input[0] : null, [d, f])) : a.datepicker._hideDatepicker(),
                    !1;
                case 27:
                    a.datepicker._hideDatepicker();
                    break;
                case 33:
                    a.datepicker._adjustDate(c.target, c.ctrlKey ? -a.datepicker._get(f, "stepBigMonths") : -a.datepicker._get(f, "stepMonths"), "M");
                    break;
                case 34:
                    a.datepicker._adjustDate(c.target, c.ctrlKey ? +a.datepicker._get(f, "stepBigMonths") : +a.datepicker._get(f, "stepMonths"), "M");
                    break;
                case 35:
                    (c.ctrlKey || c.metaKey) && a.datepicker._clearDate(c.target);
                    g = c.ctrlKey || c.metaKey;
                    break;
                case 36:
                    (c.ctrlKey || c.metaKey) && a.datepicker._gotoToday(c.target);
                    g = c.ctrlKey || c.metaKey;
                    break;
                case 37:
                    (c.ctrlKey || c.metaKey) && a.datepicker._adjustDate(c.target, p ? 1 : -1, "D");
                    g = c.ctrlKey || c.metaKey;
                    c.originalEvent.altKey && a.datepicker._adjustDate(c.target, c.ctrlKey ? -a.datepicker._get(f, "stepBigMonths") : -a.datepicker._get(f, "stepMonths"), "M");
                    break;
                case 38:
                    (c.ctrlKey || c.metaKey) && a.datepicker._adjustDate(c.target, -7, "D");
                    g = c.ctrlKey || c.metaKey;
                    break;
                case 39:
                    (c.ctrlKey || c.metaKey) && a.datepicker._adjustDate(c.target, p ? -1 : 1, "D");
                    g = c.ctrlKey || c.metaKey;
                    c.originalEvent.altKey && a.datepicker._adjustDate(c.target, c.ctrlKey ? +a.datepicker._get(f, "stepBigMonths") : +a.datepicker._get(f, "stepMonths"), "M");
                    break;
                case 40:
                    (c.ctrlKey || c.metaKey) && a.datepicker._adjustDate(c.target, 7, "D");
                    g = c.ctrlKey || c.metaKey;
                    break;
                default:
                    g = !1
                }
            else
                36 === c.keyCode && c.ctrlKey ? a.datepicker._showDatepicker(this) : g = !1;
            g && (c.preventDefault(),
            c.stopPropagation())
        },
        _doKeyPress: function(c) {
            var b, d, e = a.datepicker._getInst(c.target);
            return a.datepicker._get(e, "constrainInput") ? (b = a.datepicker._possibleChars(a.datepicker._get(e, "dateFormat")),
            d = String.fromCharCode(null == c.charCode ? c.keyCode : c.charCode),
            c.ctrlKey || c.metaKey || " " > d || !b || -1 < b.indexOf(d)) : void 0
        },
        _doKeyUp: function(c) {
            c = a.datepicker._getInst(c.target);
            if (c.input.val() !== c.lastVal)
                try {
                    a.datepicker.parseDate(a.datepicker._get(c, "dateFormat"), c.input ? c.input.val() : null, a.datepicker._getFormatConfig(c)) && (a.datepicker._setDateFromField(c),
                    a.datepicker._updateAlternate(c),
                    a.datepicker._updateDatepicker(c))
                } catch (b) {}
            return !0
        },
        _showDatepicker: function(c) {
            if (c = c.target || c,
            "input" !== c.nodeName.toLowerCase() && (c = a("input", c.parentNode)[0]),
            !a.datepicker._isDisabledDatepicker(c) && a.datepicker._lastInput !== c) {
                var b, e, f, g, q, p;
                b = a.datepicker._getInst(c);
                a.datepicker._curInst && a.datepicker._curInst !== b && (a.datepicker._curInst.dpDiv.stop(!0, !0),
                b && a.datepicker._datepickerShowing && a.datepicker._hideDatepicker(a.datepicker._curInst.input[0]));
                e = (e = a.datepicker._get(b, "beforeShow")) ? e.apply(c, [c, b]) : {};
                !1 !== e && (d(b.settings, e),
                b.lastVal = null,
                a.datepicker._lastInput = c,
                a.datepicker._setDateFromField(b),
                a.datepicker._inDialog && (c.value = ""),
                a.datepicker._pos || (a.datepicker._pos = a.datepicker._findPos(c),
                a.datepicker._pos[1] += c.offsetHeight),
                f = !1,
                a(c).parents().each(function() {
                    return f |= "fixed" === a(this).css("position"),
                    !f
                }),
                g = {
                    left: a.datepicker._pos[0],
                    top: a.datepicker._pos[1]
                },
                a.datepicker._pos = null,
                b.dpDiv.empty(),
                b.dpDiv.css({
                    position: "absolute",
                    display: "block",
                    top: "-1000px"
                }),
                a.datepicker._updateDatepicker(b),
                g = a.datepicker._checkOffset(b, g, f),
                b.dpDiv.css({
                    position: a.datepicker._inDialog && a.blockUI ? "static" : f ? "fixed" : "absolute",
                    display: "none",
                    left: g.left + "px",
                    top: g.top + "px"
                }),
                b.inline || (q = a.datepicker._get(b, "showAnim"),
                p = a.datepicker._get(b, "duration"),
                b.dpDiv.zIndex(a(c).zIndex() + 1),
                a.datepicker._datepickerShowing = !0,
                a.effects && a.effects.effect[q] ? b.dpDiv.show(q, a.datepicker._get(b, "showOptions"), p) : b.dpDiv[q || "show"](q ? p : null),
                a.datepicker._shouldFocusInput(b) && b.input.focus(),
                a.datepicker._curInst = b))
            }
        },
        _updateDatepicker: function(c) {
            this.maxRows = 4;
            b = c;
            c.dpDiv.empty().append(this._generateHTML(c));
            this._attachHandlers(c);
            c.dpDiv.find("." + this._dayOverClass + " a").mouseover();
            var d, e = this._getNumberOfMonths(c), f = e[1];
            c.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width("");
            1 < f && c.dpDiv.addClass("ui-datepicker-multi-" + f).css("width", 17 * f + "em");
            c.dpDiv[(1 !== e[0] || 1 !== e[1] ? "add" : "remove") + "Class"]("ui-datepicker-multi");
            c.dpDiv[(this._get(c, "isRTL") ? "add" : "remove") + "Class"]("ui-datepicker-rtl");
            c === a.datepicker._curInst && a.datepicker._datepickerShowing && a.datepicker._shouldFocusInput(c) && c.input.focus();
            c.yearshtml && (d = c.yearshtml,
            setTimeout(function() {
                d === c.yearshtml && c.yearshtml && c.dpDiv.find("select.ui-datepicker-year:first").replaceWith(c.yearshtml);
                d = c.yearshtml = null
            }, 0))
        },
        _shouldFocusInput: function(a) {
            return a.input && a.input.is(":visible") && !a.input.is(":disabled") && !a.input.is(":focus")
        },
        _checkOffset: function(c, b, d) {
            var e = c.dpDiv.outerWidth()
              , f = c.dpDiv.outerHeight()
              , g = c.input ? c.input.outerWidth() : 0
              , p = c.input ? c.input.outerHeight() : 0
              , r = document.documentElement.clientWidth + (d ? 0 : a(document).scrollLeft())
              , s = document.documentElement.clientHeight + (d ? 0 : a(document).scrollTop());
            return b.left -= this._get(c, "isRTL") ? e - g : 0,
            b.left -= d && b.left === c.input.offset().left ? a(document).scrollLeft() : 0,
            b.top -= d && b.top === c.input.offset().top + p ? a(document).scrollTop() : 0,
            b.left -= Math.min(b.left, b.left + e > r && r > e ? Math.abs(b.left + e - r) : 0),
            b.top -= Math.min(b.top, b.top + f > s && s > f ? Math.abs(f + p) : 0),
            b
        },
        _findPos: function(c) {
            for (var b, d = this._getInst(c), d = this._get(d, "isRTL"); c && ("hidden" === c.type || 1 !== c.nodeType || a.expr.filters.hidden(c)); )
                c = c[d ? "previousSibling" : "nextSibling"];
            return b = a(c).offset(),
            [b.left, b.top]
        },
        _hideDatepicker: function(c) {
            var b, d, e, f, g = this._curInst;
            !g || c && g !== a.data(c, "datepicker") || this._datepickerShowing && (b = this._get(g, "showAnim"),
            d = this._get(g, "duration"),
            e = function() {
                a.datepicker._tidyDialog(g)
            }
            ,
            a.effects && (a.effects.effect[b] || a.effects[b]) ? g.dpDiv.hide(b, a.datepicker._get(g, "showOptions"), d, e) : g.dpDiv["slideDown" === b ? "slideUp" : "fadeIn" === b ? "fadeOut" : "hide"](b ? d : null, e),
            b || e(),
            this._datepickerShowing = !1,
            f = this._get(g, "onClose"),
            f && f.apply(g.input ? g.input[0] : null, [g.input ? g.input.val() : "", g]),
            this._lastInput = null,
            this._inDialog && (this._dialogInput.css({
                position: "absolute",
                left: "0",
                top: "-100px"
            }),
            a.blockUI && (a.unblockUI(),
            a("body").append(this.dpDiv))),
            this._inDialog = !1)
        },
        _tidyDialog: function(a) {
            a.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")
        },
        _checkExternalClick: function(c) {
            if (a.datepicker._curInst) {
                c = a(c.target);
                var b = a.datepicker._getInst(c[0]);
                (c[0].id !== a.datepicker._mainDivId && 0 === c.parents("#" + a.datepicker._mainDivId).length && !(c.hasClass(a.datepicker.markerClassName) || c.closest("." + a.datepicker._triggerClass).length || !a.datepicker._datepickerShowing || a.datepicker._inDialog && a.blockUI) || c.hasClass(a.datepicker.markerClassName) && a.datepicker._curInst !== b) && a.datepicker._hideDatepicker()
            }
        },
        _adjustDate: function(c, b, d) {
            c = a(c);
            var e = this._getInst(c[0]);
            this._isDisabledDatepicker(c[0]) || (this._adjustInstDate(e, b + ("M" === d ? this._get(e, "showCurrentAtPos") : 0), d),
            this._updateDatepicker(e))
        },
        _gotoToday: function(c) {
            var b;
            c = a(c);
            var d = this._getInst(c[0]);
            this._get(d, "gotoCurrent") && d.currentDay ? (d.selectedDay = d.currentDay,
            d.drawMonth = d.selectedMonth = d.currentMonth,
            d.drawYear = d.selectedYear = d.currentYear) : (b = new Date,
            d.selectedDay = b.getDate(),
            d.drawMonth = d.selectedMonth = b.getMonth(),
            d.drawYear = d.selectedYear = b.getFullYear());
            this._notifyChange(d);
            this._adjustDate(c)
        },
        _selectMonthYear: function(c, b, d) {
            c = a(c);
            var e = this._getInst(c[0]);
            e["selected" + ("M" === d ? "Month" : "Year")] = e["draw" + ("M" === d ? "Month" : "Year")] = parseInt(b.options[b.selectedIndex].value, 10);
            this._notifyChange(e);
            this._adjustDate(c)
        },
        _selectDay: function(c, b, d, e) {
            var f, g = a(c);
            a(e).hasClass(this._unselectableClass) || this._isDisabledDatepicker(g[0]) || (f = this._getInst(g[0]),
            f.selectedDay = f.currentDay = a("a", e).html(),
            f.selectedMonth = f.currentMonth = b,
            f.selectedYear = f.currentYear = d,
            this._selectDate(c, this._formatDate(f, f.currentDay, f.currentMonth, f.currentYear)))
        },
        _clearDate: function(c) {
            c = a(c);
            this._selectDate(c, "")
        },
        _selectDate: function(c, b) {
            var d;
            d = a(c);
            var e = this._getInst(d[0]);
            b = null != b ? b : this._formatDate(e);
            e.input && e.input.val(b);
            this._updateAlternate(e);
            (d = this._get(e, "onSelect")) ? d.apply(e.input ? e.input[0] : null, [b, e]) : e.input && e.input.trigger("change");
            e.inline ? this._updateDatepicker(e) : (this._hideDatepicker(),
            this._lastInput = e.input[0],
            "object" != typeof e.input[0] && e.input.focus(),
            this._lastInput = null)
        },
        _updateAlternate: function(c) {
            var b, d, e, f = this._get(c, "altField");
            f && (b = this._get(c, "altFormat") || this._get(c, "dateFormat"),
            d = this._getDate(c),
            e = this.formatDate(b, d, this._getFormatConfig(c)),
            a(f).each(function() {
                a(this).val(e)
            }))
        },
        noWeekends: function(a) {
            a = a.getDay();
            return [0 < a && 6 > a, ""]
        },
        iso8601Week: function(a) {
            var b;
            a = new Date(a.getTime());
            return a.setDate(a.getDate() + 4 - (a.getDay() || 7)),
            b = a.getTime(),
            a.setMonth(0),
            a.setDate(1),
            Math.floor(Math.round((b - a) / 864E5) / 7) + 1
        },
        parseDate: function(c, b, d) {
            if (null == c || null == b)
                throw "Invalid arguments";
            if (b = "object" == typeof b ? b.toString() : b + "",
            "" === b)
                return null;
            var e, f, g, p, r = 0, s = (d ? d.shortYearCutoff : null) || this._defaults.shortYearCutoff, s = "string" != typeof s ? s : (new Date).getFullYear() % 100 + parseInt(s, 10), u = (d ? d.dayNamesShort : null) || this._defaults.dayNamesShort, v = (d ? d.dayNames : null) || this._defaults.dayNames, x = (d ? d.monthNamesShort : null) || this._defaults.monthNamesShort;
            d = (d ? d.monthNames : null) || this._defaults.monthNames;
            var B = -1
              , C = -1
              , w = -1
              , y = -1
              , A = !1
              , N = function(a) {
                a = e + 1 < c.length && c.charAt(e + 1) === a;
                return a && e++,
                a
            }
              , I = function(a) {
                var c = N(a);
                a = RegExp("^\\d{1," + ("@" === a ? 14 : "!" === a ? 20 : "y" === a && c ? 4 : "o" === a ? 3 : 2) + "}");
                a = b.substring(r).match(a);
                if (!a)
                    throw "Missing number at position " + r;
                return r += a[0].length,
                parseInt(a[0], 10)
            }
              , J = function(c, d, e) {
                var f = -1;
                c = a.map(N(c) ? e : d, function(a, c) {
                    return [[c, a]]
                }).sort(function(a, c) {
                    return -(a[1].length - c[1].length)
                });
                if (a.each(c, function(a, c) {
                    var d = c[1];
                    return b.substr(r, d.length).toLowerCase() === d.toLowerCase() ? (f = c[0],
                    r += d.length,
                    !1) : void 0
                }),
                -1 !== f)
                    return f + 1;
                throw "Unknown name at position " + r;
            }
              , F = function() {
                if (b.charAt(r) !== c.charAt(e))
                    throw "Unexpected literal at position " + r;
                r++
            };
            for (e = 0; e < c.length; e++)
                if (A)
                    "'" !== c.charAt(e) || N("'") ? F() : A = !1;
                else
                    switch (c.charAt(e)) {
                    case "d":
                        w = I("d");
                        break;
                    case "D":
                        J("D", u, v);
                        break;
                    case "o":
                        y = I("o");
                        break;
                    case "m":
                        C = I("m");
                        break;
                    case "M":
                        C = J("M", x, d);
                        break;
                    case "y":
                        B = I("y");
                        break;
                    case "@":
                        p = new Date(I("@"));
                        B = p.getFullYear();
                        C = p.getMonth() + 1;
                        w = p.getDate();
                        break;
                    case "!":
                        p = new Date((I("!") - this._ticksTo1970) / 1E4);
                        B = p.getFullYear();
                        C = p.getMonth() + 1;
                        w = p.getDate();
                        break;
                    case "'":
                        N("'") ? F() : A = !0;
                        break;
                    default:
                        F()
                    }
            if (r < b.length && (g = b.substr(r),
            !/^\s+/.test(g)))
                throw "Extra/unparsed characters found in date: " + g;
            if (-1 === B ? B = (new Date).getFullYear() : 100 > B && (B += (new Date).getFullYear() - (new Date).getFullYear() % 100 + (s >= B ? 0 : -100)),
            -1 < y)
                for (C = 1,
                w = y; !(f = this._getDaysInMonth(B, C - 1),
                f >= w); )
                    C++,
                    w -= f;
            if (p = this._daylightSavingAdjust(new Date(B,C - 1,w)),
            p.getFullYear() !== B || p.getMonth() + 1 !== C || p.getDate() !== w)
                throw "Invalid date";
            return p
        },
        ATOM: "yy-mm-dd",
        COOKIE: "D, dd M yy",
        ISO_8601: "yy-mm-dd",
        RFC_822: "D, d M y",
        RFC_850: "DD, dd-M-y",
        RFC_1036: "D, d M y",
        RFC_1123: "D, d M yy",
        RFC_2822: "D, d M yy",
        RSS: "D, d M y",
        TICKS: "!",
        TIMESTAMP: "@",
        W3C: "yy-mm-dd",
        _ticksTo1970: 864E9 * (718685 + Math.floor(492.5) - Math.floor(19.7) + Math.floor(4.925)),
        formatDate: function(a, b, d) {
            if (!b)
                return "";
            var e, f = (d ? d.dayNamesShort : null) || this._defaults.dayNamesShort, g = (d ? d.dayNames : null) || this._defaults.dayNames, p = (d ? d.monthNamesShort : null) || this._defaults.monthNamesShort;
            d = (d ? d.monthNames : null) || this._defaults.monthNames;
            var r = function(b) {
                b = e + 1 < a.length && a.charAt(e + 1) === b;
                return b && e++,
                b
            }
              , s = function(a, c, b) {
                c = "" + c;
                if (r(a))
                    for (; c.length < b; )
                        c = "0" + c;
                return c
            }
              , u = function(a, c, b, d) {
                return r(a) ? d[c] : b[c]
            }
              , v = ""
              , x = !1;
            if (b)
                for (e = 0; e < a.length; e++)
                    if (x)
                        "'" !== a.charAt(e) || r("'") ? v += a.charAt(e) : x = !1;
                    else
                        switch (a.charAt(e)) {
                        case "d":
                            v += s("d", b.getDate(), 2);
                            break;
                        case "D":
                            v += u("D", b.getDay(), f, g);
                            break;
                        case "o":
                            v += s("o", Math.round(((new Date(b.getFullYear(),b.getMonth(),b.getDate())).getTime() - (new Date(b.getFullYear(),0,0)).getTime()) / 864E5), 3);
                            break;
                        case "m":
                            v += s("m", b.getMonth() + 1, 2);
                            break;
                        case "M":
                            v += u("M", b.getMonth(), p, d);
                            break;
                        case "y":
                            v += r("y") ? b.getFullYear() : (10 > b.getYear() % 100 ? "0" : "") + b.getYear() % 100;
                            break;
                        case "@":
                            v += b.getTime();
                            break;
                        case "!":
                            v += 1E4 * b.getTime() + this._ticksTo1970;
                            break;
                        case "'":
                            r("'") ? v += "'" : x = !0;
                            break;
                        default:
                            v += a.charAt(e)
                        }
            return v
        },
        _possibleChars: function(a) {
            var b, d = "", e = !1, f = function(d) {
                d = b + 1 < a.length && a.charAt(b + 1) === d;
                return d && b++,
                d
            };
            for (b = 0; b < a.length; b++)
                if (e)
                    "'" !== a.charAt(b) || f("'") ? d += a.charAt(b) : e = !1;
                else
                    switch (a.charAt(b)) {
                    case "d":
                    case "m":
                    case "y":
                    case "@":
                        d += "0123456789";
                        break;
                    case "D":
                    case "M":
                        return null;
                    case "'":
                        f("'") ? d += "'" : e = !0;
                        break;
                    default:
                        d += a.charAt(b)
                    }
            return d
        },
        _get: function(a, b) {
            return a.settings[b] !== g ? a.settings[b] : this._defaults[b]
        },
        _setDateFromField: function(a, b) {
            if (a.input.val() !== a.lastVal) {
                var d = this._get(a, "dateFormat")
                  , e = a.lastVal = a.input ? a.input.val() : null
                  , f = this._getDefaultDate(a)
                  , g = f
                  , p = this._getFormatConfig(a);
                try {
                    g = this.parseDate(d, e, p) || f
                } catch (r) {
                    e = b ? "" : e
                }
                a.selectedDay = g.getDate();
                a.drawMonth = a.selectedMonth = g.getMonth();
                a.drawYear = a.selectedYear = g.getFullYear();
                a.currentDay = e ? g.getDate() : 0;
                a.currentMonth = e ? g.getMonth() : 0;
                a.currentYear = e ? g.getFullYear() : 0;
                this._adjustInstDate(a)
            }
        },
        _getDefaultDate: function(a) {
            return this._restrictMinMax(a, this._determineDate(a, this._get(a, "defaultDate"), new Date))
        },
        _determineDate: function(c, b, d) {
            var e = function(a) {
                var c = new Date;
                return c.setDate(c.getDate() + a),
                c
            }
              , f = function(b) {
                try {
                    return a.datepicker.parseDate(a.datepicker._get(c, "dateFormat"), b, a.datepicker._getFormatConfig(c))
                } catch (d) {}
                for (var e = (b.toLowerCase().match(/^c/) ? a.datepicker._getDate(c) : null) || new Date, f = e.getFullYear(), h = e.getMonth(), e = e.getDate(), g = /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g, m = g.exec(b); m; ) {
                    switch (m[2] || "d") {
                    case "d":
                    case "D":
                        e += parseInt(m[1], 10);
                        break;
                    case "w":
                    case "W":
                        e += 7 * parseInt(m[1], 10);
                        break;
                    case "m":
                    case "M":
                        h += parseInt(m[1], 10);
                        e = Math.min(e, a.datepicker._getDaysInMonth(f, h));
                        break;
                    case "y":
                    case "Y":
                        f += parseInt(m[1], 10),
                        e = Math.min(e, a.datepicker._getDaysInMonth(f, h))
                    }
                    m = g.exec(b)
                }
                return new Date(f,h,e)
            };
            b = null == b || "" === b ? d : "string" == typeof b ? f(b) : "number" == typeof b ? isNaN(b) ? d : e(b) : new Date(b.getTime());
            return b = b && "Invalid Date" === b.toString() ? d : b,
            b && (b.setHours(0),
            b.setMinutes(0),
            b.setSeconds(0),
            b.setMilliseconds(0)),
            this._daylightSavingAdjust(b)
        },
        _daylightSavingAdjust: function(a) {
            return a ? (a.setHours(12 < a.getHours() ? a.getHours() + 2 : 0),
            a) : null
        },
        _setDate: function(a, b, d) {
            var e = !b
              , f = a.selectedMonth
              , g = a.selectedYear;
            b = this._restrictMinMax(a, this._determineDate(a, b, new Date));
            a.selectedDay = a.currentDay = b.getDate();
            a.drawMonth = a.selectedMonth = a.currentMonth = b.getMonth();
            a.drawYear = a.selectedYear = a.currentYear = b.getFullYear();
            f === a.selectedMonth && g === a.selectedYear || d || this._notifyChange(a);
            this._adjustInstDate(a);
            a.input && a.input.val(e ? "" : this._formatDate(a))
        },
        _getDate: function(a) {
            return !a.currentYear || a.input && "" === a.input.val() ? null : this._daylightSavingAdjust(new Date(a.currentYear,a.currentMonth,a.currentDay))
        },
        _attachHandlers: function(c) {
            var b = this._get(c, "stepMonths")
              , d = "#" + c.id.replace(/\\\\/g, "\\");
            c.dpDiv.find("[data-handler]").map(function() {
                a(this).bind(this.getAttribute("data-event"), {
                    prev: function() {
                        a.datepicker._adjustDate(d, -b, "M")
                    },
                    next: function() {
                        a.datepicker._adjustDate(d, +b, "M")
                    },
                    hide: function() {
                        a.datepicker._hideDatepicker()
                    },
                    today: function() {
                        a.datepicker._gotoToday(d)
                    },
                    selectDay: function() {
                        return a.datepicker._selectDay(d, +this.getAttribute("data-month"), +this.getAttribute("data-year"), this),
                        !1
                    },
                    selectMonth: function() {
                        return a.datepicker._selectMonthYear(d, this, "M"),
                        !1
                    },
                    selectYear: function() {
                        return a.datepicker._selectMonthYear(d, this, "Y"),
                        !1
                    }
                }[this.getAttribute("data-handler")])
            })
        },
        _generateHTML: function(a) {
            var b, d, e, f, g, p, r, s, u, v, x, B, C, w, y, A, N, I, J, F, L, E, R, Y, K, P, W, S = new Date, S = this._daylightSavingAdjust(new Date(S.getFullYear(),S.getMonth(),S.getDate())), D = this._get(a, "isRTL");
            p = this._get(a, "showButtonPanel");
            e = this._get(a, "hideIfNoPrevNext");
            g = this._get(a, "navigationAsDateFormat");
            var O = this._getNumberOfMonths(a)
              , M = this._get(a, "showCurrentAtPos");
            f = this._get(a, "stepMonths");
            var Q = 1 !== O[0] || 1 !== O[1]
              , ga = this._daylightSavingAdjust(a.currentDay ? new Date(a.currentYear,a.currentMonth,a.currentDay) : new Date(9999,9,9))
              , V = this._getMinMaxDate(a, "min")
              , ca = this._getMinMaxDate(a, "max")
              , M = a.drawMonth - M
              , U = a.drawYear;
            if (0 > M && (M += 12,
            U--),
            ca)
                for (b = this._daylightSavingAdjust(new Date(ca.getFullYear(),ca.getMonth() - O[0] * O[1] + 1,ca.getDate())),
                b = V && V > b ? V : b; this._daylightSavingAdjust(new Date(U,M,1)) > b; )
                    M--,
                    0 > M && (M = 11,
                    U--);
            a.drawMonth = M;
            a.drawYear = U;
            b = this._get(a, "prevText");
            b = g ? this.formatDate(b, this._daylightSavingAdjust(new Date(U,M - f,1)), this._getFormatConfig(a)) : b;
            b = this._canAdjustMonth(a, -1, U, M) ? "<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click' title='" + b + "'><span class='ui-icon ui-icon-circle-triangle-" + (D ? "e" : "w") + "'>" + b + "</span></a>" : e ? "" : "<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='" + b + "'><span class='ui-icon ui-icon-circle-triangle-" + (D ? "e" : "w") + "'>" + b + "</span></a>";
            d = this._get(a, "nextText");
            d = g ? this.formatDate(d, this._daylightSavingAdjust(new Date(U,M + f,1)), this._getFormatConfig(a)) : d;
            e = this._canAdjustMonth(a, 1, U, M) ? "<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click' title='" + d + "'><span class='ui-icon ui-icon-circle-triangle-" + (D ? "w" : "e") + "'>" + d + "</span></a>" : e ? "" : "<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='" + d + "'><span class='ui-icon ui-icon-circle-triangle-" + (D ? "w" : "e") + "'>" + d + "</span></a>";
            f = this._get(a, "currentText");
            d = this._get(a, "gotoCurrent") && a.currentDay ? ga : S;
            f = g ? this.formatDate(f, d, this._getFormatConfig(a)) : f;
            g = a.inline ? "" : "<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>" + this._get(a, "closeText") + "</button>";
            p = p ? "<div class='ui-datepicker-buttonpane ui-widget-content'>" + (D ? g : "") + (this._isInRange(a, d) ? "<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'>" + f + "</button>" : "") + (D ? "" : g) + "</div>" : "";
            g = parseInt(this._get(a, "firstDay"), 10);
            g = isNaN(g) ? 0 : g;
            f = this._get(a, "showWeek");
            d = this._get(a, "dayNames");
            r = this._get(a, "dayNamesMin");
            s = this._get(a, "monthNames");
            u = this._get(a, "monthNamesShort");
            v = this._get(a, "beforeShowDay");
            x = this._get(a, "showOtherMonths");
            B = this._get(a, "selectOtherMonths");
            C = this._getDefaultDate(a);
            w = "";
            for (A = 0; A < O[0]; A++) {
                N = "";
                this.maxRows = 4;
                for (I = 0; I < O[1]; I++) {
                    if (J = this._daylightSavingAdjust(new Date(U,M,a.selectedDay)),
                    y = " ui-corner-all",
                    F = "",
                    Q) {
                        if (F += "<div class='ui-datepicker-group",
                        1 < O[1])
                            switch (I) {
                            case 0:
                                F += " ui-datepicker-group-first";
                                y = " ui-corner-" + (D ? "right" : "left");
                                break;
                            case O[1] - 1:
                                F += " ui-datepicker-group-last";
                                y = " ui-corner-" + (D ? "left" : "right");
                                break;
                            default:
                                F += " ui-datepicker-group-middle",
                                y = ""
                            }
                        F += "'>"
                    }
                    F += "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" + y + "'>" + (/all|left/.test(y) && 0 === A ? D ? e : b : "") + (/all|right/.test(y) && 0 === A ? D ? b : e : "") + this._generateMonthYearHeader(a, M, U, V, ca, 0 < A || 0 < I, s, u) + "</div><table class='ui-datepicker-calendar'><thead><tr>";
                    L = f ? "<th class='ui-datepicker-week-col'>" + this._get(a, "weekHeader") + "</th>" : "";
                    for (y = 0; 7 > y; y++)
                        E = (y + g) % 7,
                        L += "<th" + (5 <= (y + g + 6) % 7 ? " class='ui-datepicker-week-end'" : "") + "><span title='" + d[E] + "'>" + r[E] + "</span></th>";
                    F += L + "</tr></thead><tbody>";
                    L = this._getDaysInMonth(U, M);
                    U === a.selectedYear && M === a.selectedMonth && (a.selectedDay = Math.min(a.selectedDay, L));
                    y = (this._getFirstDayOfMonth(U, M) - g + 7) % 7;
                    L = Math.ceil((y + L) / 7);
                    this.maxRows = L = Q ? this.maxRows > L ? this.maxRows : L : L;
                    E = this._daylightSavingAdjust(new Date(U,M,1 - y));
                    for (R = 0; L > R; R++) {
                        F += "<tr>";
                        Y = f ? "<td class='ui-datepicker-week-col'>" + this._get(a, "calculateWeek")(E) + "</td>" : "";
                        for (y = 0; 7 > y; y++)
                            K = v ? v.apply(a.input ? a.input[0] : null, [E]) : [!0, ""],
                            W = (P = E.getMonth() !== M) && !B || !K[0] || V && V > E || ca && E > ca,
                            Y += "<td class='" + (5 <= (y + g + 6) % 7 ? " ui-datepicker-week-end" : "") + (P ? " ui-datepicker-other-month" : "") + (E.getTime() === J.getTime() && M === a.selectedMonth && a._keyEvent || C.getTime() === E.getTime() && C.getTime() === J.getTime() ? " " + this._dayOverClass : "") + (W ? " " + this._unselectableClass + " ui-state-disabled" : "") + (P && !x ? "" : " " + K[1] + (E.getTime() === ga.getTime() ? " " + this._currentClass : "") + (E.getTime() === S.getTime() ? " ui-datepicker-today" : "")) + "'" + (P && !x || !K[2] ? "" : " title='" + K[2].replace(/'/g, "&#39;") + "'") + (W ? "" : " data-handler='selectDay' data-event='click' data-month='" + E.getMonth() + "' data-year='" + E.getFullYear() + "'") + ">" + (P && !x ? "&#xa0;" : W ? "<span class='ui-state-default'>" + E.getDate() + "</span>" : "<a class='ui-state-default" + (E.getTime() === S.getTime() ? " ui-state-highlight" : "") + (E.getTime() === ga.getTime() ? " ui-state-active" : "") + (P ? " ui-priority-secondary" : "") + "' href='#'>" + E.getDate() + "</a>") + "</td>",
                            E.setDate(E.getDate() + 1),
                            E = this._daylightSavingAdjust(E);
                        F += Y + "</tr>"
                    }
                    M++;
                    11 < M && (M = 0,
                    U++);
                    F += "</tbody></table>" + (Q ? "</div>" + (0 < O[0] && I === O[1] - 1 ? "<div class='ui-datepicker-row-break'></div>" : "") : "");
                    N += F
                }
                w += N
            }
            return w += p,
            a._keyEvent = !1,
            w
        },
        _generateMonthYearHeader: function(a, b, d, e, f, g, p, r) {
            var s, u, v, x = this._get(a, "changeMonth"), B = this._get(a, "changeYear"), C = this._get(a, "showMonthAfterYear"), w = "<div class='ui-datepicker-title'>", y = "";
            if (g || !x)
                y += "<span class='ui-datepicker-month'>" + p[b] + "</span>";
            else {
                p = e && e.getFullYear() === d;
                s = f && f.getFullYear() === d;
                y += "<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>";
                for (u = 0; 12 > u; u++)
                    (!p || u >= e.getMonth()) && (!s || u <= f.getMonth()) && (y += "<option value='" + u + "'" + (u === b ? " selected='selected'" : "") + ">" + r[u] + "</option>");
                y += "</select>"
            }
            if (C || (w += y + (!g && x && B ? "" : "&#xa0;")),
            !a.yearshtml)
                if (a.yearshtml = "",
                g || !B)
                    w += "<span class='ui-datepicker-year'>" + d + "</span>";
                else {
                    r = this._get(a, "yearRange").split(":");
                    v = (new Date).getFullYear();
                    p = function(a) {
                        a = a.match(/c[+\-].*/) ? d + parseInt(a.substring(1), 10) : a.match(/[+\-].*/) ? v + parseInt(a, 10) : parseInt(a, 10);
                        return isNaN(a) ? v : a
                    }
                    ;
                    b = p(r[0]);
                    r = Math.max(b, p(r[1] || ""));
                    b = e ? Math.max(b, e.getFullYear()) : b;
                    r = f ? Math.min(r, f.getFullYear()) : r;
                    for (a.yearshtml += "<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>"; r >= b; b++)
                        a.yearshtml += "<option value='" + b + "'" + (b === d ? " selected='selected'" : "") + ">" + b + "</option>";
                    a.yearshtml += "</select>";
                    w += a.yearshtml;
                    a.yearshtml = null
                }
            return w += this._get(a, "yearSuffix"),
            C && (w += (!g && x && B ? "" : "&#xa0;") + y),
            w += "</div>"
        },
        _adjustInstDate: function(a, b, d) {
            var e = a.drawYear + ("Y" === d ? b : 0)
              , f = a.drawMonth + ("M" === d ? b : 0);
            b = Math.min(a.selectedDay, this._getDaysInMonth(e, f)) + ("D" === d ? b : 0);
            e = this._restrictMinMax(a, this._daylightSavingAdjust(new Date(e,f,b)));
            a.selectedDay = e.getDate();
            a.drawMonth = a.selectedMonth = e.getMonth();
            a.drawYear = a.selectedYear = e.getFullYear();
            "M" !== d && "Y" !== d || this._notifyChange(a)
        },
        _restrictMinMax: function(a, b) {
            var d = this._getMinMaxDate(a, "min")
              , e = this._getMinMaxDate(a, "max")
              , d = d && d > b ? d : b;
            return e && d > e ? e : d
        },
        _notifyChange: function(a) {
            var b = this._get(a, "onChangeMonthYear");
            b && b.apply(a.input ? a.input[0] : null, [a.selectedYear, a.selectedMonth + 1, a])
        },
        _getNumberOfMonths: function(a) {
            a = this._get(a, "numberOfMonths");
            return null == a ? [1, 1] : "number" == typeof a ? [1, a] : a
        },
        _getMinMaxDate: function(a, b) {
            return this._determineDate(a, this._get(a, b + "Date"), null)
        },
        _getDaysInMonth: function(a, b) {
            return 32 - this._daylightSavingAdjust(new Date(a,b,32)).getDate()
        },
        _getFirstDayOfMonth: function(a, b) {
            return (new Date(a,b,1)).getDay()
        },
        _canAdjustMonth: function(a, b, d, e) {
            var f = this._getNumberOfMonths(a);
            d = this._daylightSavingAdjust(new Date(d,e + (0 > b ? b : f[0] * f[1]),1));
            return 0 > b && d.setDate(this._getDaysInMonth(d.getFullYear(), d.getMonth())),
            this._isInRange(a, d)
        },
        _isInRange: function(a, b) {
            var d, e, f = this._getMinMaxDate(a, "min"), g = this._getMinMaxDate(a, "max"), p = null, r = null, s = this._get(a, "yearRange");
            return s && (d = s.split(":"),
            e = (new Date).getFullYear(),
            p = parseInt(d[0], 10),
            r = parseInt(d[1], 10),
            d[0].match(/[+\-].*/) && (p += e),
            d[1].match(/[+\-].*/) && (r += e)),
            (!f || b.getTime() >= f.getTime()) && (!g || b.getTime() <= g.getTime()) && (!p || b.getFullYear() >= p) && (!r || b.getFullYear() <= r)
        },
        _getFormatConfig: function(a) {
            var b = this._get(a, "shortYearCutoff");
            return b = "string" != typeof b ? b : (new Date).getFullYear() % 100 + parseInt(b, 10),
            {
                shortYearCutoff: b,
                dayNamesShort: this._get(a, "dayNamesShort"),
                dayNames: this._get(a, "dayNames"),
                monthNamesShort: this._get(a, "monthNamesShort"),
                monthNames: this._get(a, "monthNames")
            }
        },
        _formatDate: function(a, b, d, e) {
            b || (a.currentDay = a.selectedDay,
            a.currentMonth = a.selectedMonth,
            a.currentYear = a.selectedYear);
            b = b ? "object" == typeof b ? b : this._daylightSavingAdjust(new Date(e,d,b)) : this._daylightSavingAdjust(new Date(a.currentYear,a.currentMonth,a.currentDay));
            return this.formatDate(this._get(a, "dateFormat"), b, this._getFormatConfig(a))
        }
    });
    a.fn.datepicker = function(b) {
        if (!this.length)
            return this;
        a.datepicker.initialized || (a(document).mousedown(a.datepicker._checkExternalClick),
        a.datepicker.initialized = !0);
        0 === a("#" + a.datepicker._mainDivId).length && a("body").append(a.datepicker.dpDiv);
        var d = Array.prototype.slice.call(arguments, 1);
        return "string" != typeof b || "isDisabled" !== b && "getDate" !== b && "widget" !== b ? "option" === b && 2 === arguments.length && "string" == typeof arguments[1] ? a.datepicker["_" + b + "Datepicker"].apply(a.datepicker, [this[0]].concat(d)) : this.each(function() {
            "string" == typeof b ? a.datepicker["_" + b + "Datepicker"].apply(a.datepicker, [this].concat(d)) : a.datepicker._attachDatepicker(this, b)
        }) : a.datepicker["_" + b + "Datepicker"].apply(a.datepicker, [this[0]].concat(d))
    }
    ;
    a.datepicker = new f;
    a.datepicker.initialized = !1;
    a.datepicker.uuid = (new Date).getTime();
    a.datepicker.version = "1.10.3"
}
)(jQuery);
(function(a) {
    var g = {
        buttons: !0,
        height: !0,
        maxHeight: !0,
        maxWidth: !0,
        minHeight: !0,
        minWidth: !0,
        width: !0
    }
      , f = {
        maxHeight: !0,
        maxWidth: !0,
        minHeight: !0,
        minWidth: !0
    };
    a.widget("ui.dialog", {
        version: "1.10.3",
        options: {
            appendTo: "body",
            autoOpen: !0,
            buttons: [],
            closeOnEscape: !0,
            closeText: "close",
            dialogClass: "",
            draggable: !0,
            hide: null,
            height: "auto",
            maxHeight: null,
            maxWidth: null,
            minHeight: 150,
            minWidth: 150,
            modal: !1,
            position: {
                my: "center",
                at: "center",
                of: window,
                collision: "fit",
                using: function(e) {
                    var d = a(this).css(e).offset().top;
                    0 > d && a(this).css("top", e.top - d)
                }
            },
            resizable: !0,
            show: null,
            title: null,
            width: 300,
            beforeClose: null,
            close: null,
            drag: null,
            dragStart: null,
            dragStop: null,
            focus: null,
            open: null,
            resize: null,
            resizeStart: null,
            resizeStop: null
        },
        _create: function() {
            this.originalCss = {
                display: this.element[0].style.display,
                width: this.element[0].style.width,
                minHeight: this.element[0].style.minHeight,
                maxHeight: this.element[0].style.maxHeight,
                height: this.element[0].style.height
            };
            this.originalPosition = {
                parent: this.element.parent(),
                index: this.element.parent().children().index(this.element)
            };
            this.originalTitle = this.element.attr("title");
            this.options.title = this.options.title || this.originalTitle;
            this._createWrapper();
            this.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(this.uiDialog);
            this._createTitlebar();
            this._createButtonPane();
            this.options.draggable && a.fn.draggable && this._makeDraggable();
            this.options.resizable && a.fn.resizable && this._makeResizable();
            this._isOpen = !1
        },
        _init: function() {
            this.options.autoOpen && this.open()
        },
        _appendTo: function() {
            var e = this.options.appendTo;
            return e && (e.jquery || e.nodeType) ? a(e) : this.document.find(e || "body").eq(0)
        },
        _destroy: function() {
            var a, d = this.originalPosition;
            this._destroyOverlay();
            this.element.removeUniqueId().removeClass("ui-dialog-content ui-widget-content").css(this.originalCss).detach();
            this.uiDialog.stop(!0, !0).remove();
            this.originalTitle && this.element.attr("title", this.originalTitle);
            a = d.parent.children().eq(d.index);
            a.length && a[0] !== this.element[0] ? a.before(this.element) : d.parent.append(this.element)
        },
        widget: function() {
            return this.uiDialog
        },
        disable: a.noop,
        enable: a.noop,
        close: function(e) {
            var d = this;
            this._isOpen && !1 !== this._trigger("beforeClose", e) && (this._isOpen = !1,
            this._destroyOverlay(),
            this.opener.filter(":focusable").focus().length || a(this.document[0].activeElement).blur(),
            this._hide(this.uiDialog, this.options.hide, function() {
                d._trigger("close", e)
            }))
        },
        isOpen: function() {
            return this._isOpen
        },
        moveToTop: function() {
            this._moveToTop()
        },
        _moveToTop: function(a, d) {
            var b = !!this.uiDialog.nextAll(":visible").insertBefore(this.uiDialog).length;
            return b && !d && this._trigger("focus", a),
            b
        },
        open: function() {
            var e = this;
            return this._isOpen ? (this._moveToTop() && this._focusTabbable(),
            void 0) : (this._isOpen = !0,
            this.opener = a(this.document[0].activeElement),
            this._size(),
            this._position(),
            this._createOverlay(),
            this._moveToTop(null, !0),
            this._show(this.uiDialog, this.options.show, function() {
                e._focusTabbable();
                e._trigger("focus")
            }),
            this._trigger("open"),
            void 0)
        },
        _focusTabbable: function() {
            var a = this.element.find("[autofocus]");
            a.length || (a = this.element.find(":tabbable"));
            a.length || (a = this.uiDialogButtonPane.find(":tabbable"));
            a.length || (a = this.uiDialogTitlebarClose.filter(":tabbable"));
            a.length || (a = this.uiDialog);
            a.eq(0).focus()
        },
        _keepFocus: function(e) {
            function d() {
                var b = this.document[0].activeElement;
                this.uiDialog[0] === b || a.contains(this.uiDialog[0], b) || this._focusTabbable()
            }
            e.preventDefault();
            d.call(this);
            this._delay(d)
        },
        _createWrapper: function() {
            this.uiDialog = a("<div>").addClass("ui-dialog ui-widget ui-widget-content ui-corner-all ui-front " + this.options.dialogClass).hide().attr({
                tabIndex: -1,
                role: "dialog"
            }).appendTo(this._appendTo());
            this._on(this.uiDialog, {
                keydown: function(e) {
                    if (this.options.closeOnEscape && !e.isDefaultPrevented() && e.keyCode && e.keyCode === a.ui.keyCode.ESCAPE)
                        return e.preventDefault(),
                        this.close(e),
                        void 0;
                    if (e.keyCode === a.ui.keyCode.TAB) {
                        var d = this.uiDialog.find(":tabbable")
                          , b = d.filter(":first")
                          , d = d.filter(":last");
                        e.target !== d[0] && e.target !== this.uiDialog[0] || e.shiftKey ? e.target !== b[0] && e.target !== this.uiDialog[0] || !e.shiftKey || (d.focus(1),
                        e.preventDefault()) : (b.focus(1),
                        e.preventDefault())
                    }
                },
                mousedown: function(a) {
                    this._moveToTop(a) && this._focusTabbable()
                }
            });
            this.element.find("[aria-describedby]").length || this.uiDialog.attr({
                "aria-describedby": this.element.uniqueId().attr("id")
            })
        },
        _createTitlebar: function() {
            var e;
            this.uiDialogTitlebar = a("<div>").addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix").prependTo(this.uiDialog);
            this._on(this.uiDialogTitlebar, {
                mousedown: function(d) {
                    a(d.target).closest(".ui-dialog-titlebar-close") || this.uiDialog.focus()
                }
            });
            this.uiDialogTitlebarClose = a("<button></button>").button({
                label: this.options.closeText,
                icons: {
                    primary: "ui-icon-closethick"
                },
                text: !1
            }).addClass("ui-dialog-titlebar-close").appendTo(this.uiDialogTitlebar);
            this._on(this.uiDialogTitlebarClose, {
                click: function(a) {
                    a.preventDefault();
                    this.close(a)
                }
            });
            e = a("<span>").uniqueId().addClass("ui-dialog-title").prependTo(this.uiDialogTitlebar);
            this._title(e);
            this.uiDialog.attr({
                "aria-labelledby": e.attr("id")
            })
        },
        _title: function(a) {
            this.options.title || a.html("&#160;");
            a.text(this.options.title)
        },
        _createButtonPane: function() {
            this.uiDialogButtonPane = a("<div>").addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix");
            this.uiButtonSet = a("<div>").addClass("ui-dialog-buttonset").appendTo(this.uiDialogButtonPane);
            this._createButtons()
        },
        _createButtons: function() {
            var e = this
              , d = this.options.buttons;
            return this.uiDialogButtonPane.remove(),
            this.uiButtonSet.empty(),
            a.isEmptyObject(d) || a.isArray(d) && !d.length ? (this.uiDialog.removeClass("ui-dialog-buttons"),
            void 0) : (a.each(d, function(b, c) {
                var d, f;
                c = a.isFunction(c) ? {
                    click: c,
                    text: b
                } : c;
                c = a.extend({
                    type: "button"
                }, c);
                d = c.click;
                c.click = function() {
                    d.apply(e.element[0], arguments)
                }
                ;
                f = {
                    icons: c.icons,
                    text: c.showText
                };
                delete c.icons;
                delete c.showText;
                a("<button></button>", c).button(f).appendTo(e.uiButtonSet)
            }),
            this.uiDialog.addClass("ui-dialog-buttons"),
            this.uiDialogButtonPane.appendTo(this.uiDialog),
            void 0)
        },
        _makeDraggable: function() {
            function e(a) {
                return {
                    position: a.position,
                    offset: a.offset
                }
            }
            var d = this
              , b = this.options;
            this.uiDialog.draggable({
                cancel: ".ui-dialog-content, .ui-dialog-titlebar-close",
                handle: ".ui-dialog-titlebar",
                containment: "document",
                start: function(b, f) {
                    a(this).addClass("ui-dialog-dragging");
                    d._blockFrames();
                    d._trigger("dragStart", b, e(f))
                },
                drag: function(a, b) {
                    d._trigger("drag", a, e(b))
                },
                stop: function(c, f) {
                    b.position = [f.position.left - d.document.scrollLeft(), f.position.top - d.document.scrollTop()];
                    a(this).removeClass("ui-dialog-dragging");
                    d._unblockFrames();
                    d._trigger("dragStop", c, e(f))
                }
            })
        },
        _makeResizable: function() {
            function e(a) {
                return {
                    originalPosition: a.originalPosition,
                    originalSize: a.originalSize,
                    position: a.position,
                    size: a.size
                }
            }
            var d = this
              , b = this.options
              , c = b.resizable
              , f = this.uiDialog.css("position")
              , c = "string" == typeof c ? c : "n,e,s,w,se,sw,ne,nw";
            this.uiDialog.resizable({
                cancel: ".ui-dialog-content",
                containment: "document",
                alsoResize: this.element,
                maxWidth: b.maxWidth,
                maxHeight: b.maxHeight,
                minWidth: b.minWidth,
                minHeight: this._minHeight(),
                handles: c,
                start: function(b, c) {
                    a(this).addClass("ui-dialog-resizing");
                    d._blockFrames();
                    d._trigger("resizeStart", b, e(c))
                },
                resize: function(a, b) {
                    d._trigger("resize", a, e(b))
                },
                stop: function(c, f) {
                    b.height = a(this).height();
                    b.width = a(this).width();
                    a(this).removeClass("ui-dialog-resizing");
                    d._unblockFrames();
                    d._trigger("resizeStop", c, e(f))
                }
            }).css("position", f)
        },
        _minHeight: function() {
            var a = this.options;
            return "auto" === a.height ? a.minHeight : Math.min(a.minHeight, a.height)
        },
        _position: function() {
            var a = this.uiDialog.is(":visible");
            a || this.uiDialog.show();
            this.uiDialog.position(this.options.position);
            a || this.uiDialog.hide()
        },
        _setOptions: function(e) {
            var d = this
              , b = !1
              , c = {};
            a.each(e, function(a, e) {
                d._setOption(a, e);
                a in g && (b = !0);
                a in f && (c[a] = e)
            });
            b && (this._size(),
            this._position());
            this.uiDialog.is(":data(ui-resizable)") && this.uiDialog.resizable("option", c)
        },
        _setOption: function(a, d) {
            var b, c, f = this.uiDialog;
            "dialogClass" === a && f.removeClass(this.options.dialogClass).addClass(d);
            "disabled" !== a && (this._super(a, d),
            "appendTo" === a && this.uiDialog.appendTo(this._appendTo()),
            "buttons" === a && this._createButtons(),
            "closeText" === a && this.uiDialogTitlebarClose.button({
                label: "" + d
            }),
            "draggable" === a && (b = f.is(":data(ui-draggable)"),
            b && !d && f.draggable("destroy"),
            !b && d && this._makeDraggable()),
            "position" === a && this._position(),
            "resizable" === a && (c = f.is(":data(ui-resizable)"),
            c && !d && f.resizable("destroy"),
            c && "string" == typeof d && f.resizable("option", "handles", d),
            c || !1 === d || this._makeResizable()),
            "title" === a && this._title(this.uiDialogTitlebar.find(".ui-dialog-title")))
        },
        _size: function() {
            var a, d, b, c = this.options;
            this.element.show().css({
                width: "auto",
                minHeight: 0,
                maxHeight: "none",
                height: 0
            });
            c.minWidth > c.width && (c.width = c.minWidth);
            a = this.uiDialog.css({
                height: "auto",
                width: c.width
            }).outerHeight();
            d = Math.max(0, c.minHeight - a);
            b = "number" == typeof c.maxHeight ? Math.max(0, c.maxHeight - a) : "none";
            "auto" === c.height ? this.element.css({
                minHeight: d,
                maxHeight: b,
                height: "auto"
            }) : this.element.height(Math.max(0, c.height - a));
            this.uiDialog.is(":data(ui-resizable)") && this.uiDialog.resizable("option", "minHeight", this._minHeight())
        },
        _blockFrames: function() {
            this.iframeBlocks = this.document.find("iframe").map(function() {
                var e = a(this);
                return a("<div>").css({
                    position: "absolute",
                    width: e.outerWidth(),
                    height: e.outerHeight()
                }).appendTo(e.parent()).offset(e.offset())[0]
            })
        },
        _unblockFrames: function() {
            this.iframeBlocks && (this.iframeBlocks.remove(),
            delete this.iframeBlocks)
        },
        _allowInteraction: function(e) {
            return a(e.target).closest(".ui-dialog").length ? !0 : !!a(e.target).closest(".ui-datepicker").length
        },
        _createOverlay: function() {
            if (this.options.modal) {
                var e = this
                  , d = this.widgetFullName;
                a.ui.dialog.overlayInstances || this._delay(function() {
                    a.ui.dialog.overlayInstances && this.document.bind("focusin.dialog", function(b) {
                        e._allowInteraction(b) || (b.preventDefault(),
                        a(".ui-dialog:visible:last .ui-dialog-content").data(d)._focusTabbable())
                    })
                });
                this.overlay = a("<div>").addClass("ui-widget-overlay ui-front").appendTo(this._appendTo());
                this._on(this.overlay, {
                    mousedown: "_keepFocus"
                });
                a.ui.dialog.overlayInstances++
            }
        },
        _destroyOverlay: function() {
            this.options.modal && this.overlay && (a.ui.dialog.overlayInstances--,
            a.ui.dialog.overlayInstances || this.document.unbind("focusin.dialog"),
            this.overlay.remove(),
            this.overlay = null)
        }
    });
    a.ui.dialog.overlayInstances = 0;
    !1 !== a.uiBackCompat && a.widget("ui.dialog", a.ui.dialog, {
        _position: function() {
            var e, d = this.options.position, b = [], c = [0, 0];
            d ? (("string" == typeof d || "object" == typeof d && "0"in d) && (b = d.split ? d.split(" ") : [d[0], d[1]],
            1 === b.length && (b[1] = b[0]),
            a.each(["left", "top"], function(a, d) {
                +b[a] === b[a] && (c[a] = b[a],
                b[a] = d)
            }),
            d = {
                my: b[0] + (0 > c[0] ? c[0] : "+" + c[0]) + " " + b[1] + (0 > c[1] ? c[1] : "+" + c[1]),
                at: b.join(" ")
            }),
            d = a.extend({}, a.ui.dialog.prototype.options.position, d)) : d = a.ui.dialog.prototype.options.position;
            (e = this.uiDialog.is(":visible")) || this.uiDialog.show();
            this.uiDialog.position(d);
            e || this.uiDialog.hide()
        }
    })
}
)(jQuery);
(function(a) {
    var g = /up|down|vertical/
      , f = /up|left|vertical|horizontal/;
    a.effects.effect.blind = function(e, d) {
        var b, c, h, m = a(this), l = "position top bottom left right height width".split(" "), n = a.effects.setMode(m, e.mode || "hide");
        b = e.direction || "up";
        var q = g.test(b)
          , p = q ? "height" : "width"
          , r = q ? "top" : "left"
          , s = f.test(b)
          , u = {}
          , v = "show" === n;
        m.parent().is(".ui-effects-wrapper") ? a.effects.save(m.parent(), l) : a.effects.save(m, l);
        m.show();
        b = a.effects.createWrapper(m).css({
            overflow: "hidden"
        });
        c = b[p]();
        h = parseFloat(b.css(r)) || 0;
        u[p] = v ? c : 0;
        s || (m.css(q ? "bottom" : "right", 0).css(q ? "top" : "left", "auto").css({
            position: "absolute"
        }),
        u[r] = v ? h : c + h);
        v && (b.css(p, 0),
        s || b.css(r, h + c));
        b.animate(u, {
            duration: e.duration,
            easing: e.easing,
            queue: !1,
            complete: function() {
                "hide" === n && m.hide();
                a.effects.restore(m, l);
                a.effects.removeWrapper(m);
                d()
            }
        })
    }
}
)(jQuery);
(function(a) {
    a.effects.effect.bounce = function(g, f) {
        var e, d, b, c = a(this), h = "position top bottom left right height width".split(" "), m = a.effects.setMode(c, g.mode || "effect"), l = "hide" === m;
        e = "show" === m;
        var n = g.direction || "up"
          , m = g.distance
          , q = g.times || 5
          , p = 2 * q + (e || l ? 1 : 0)
          , r = g.duration / p
          , s = g.easing
          , u = "up" === n || "down" === n ? "top" : "left"
          , n = "up" === n || "left" === n
          , v = c.queue()
          , x = v.length;
        (e || l) && h.push("opacity");
        a.effects.save(c, h);
        c.show();
        a.effects.createWrapper(c);
        m || (m = c["top" === u ? "outerHeight" : "outerWidth"]() / 3);
        e && (b = {
            opacity: 1
        },
        b[u] = 0,
        c.css("opacity", 0).css(u, n ? 2 * -m : 2 * m).animate(b, r, s));
        l && (m /= Math.pow(2, q - 1));
        b = {};
        for (e = b[u] = 0; q > e; e++)
            d = {},
            d[u] = (n ? "-=" : "+=") + m,
            c.animate(d, r, s).animate(b, r, s),
            m = l ? 2 * m : m / 2;
        l && (d = {
            opacity: 0
        },
        d[u] = (n ? "-=" : "+=") + m,
        c.animate(d, r, s));
        c.queue(function() {
            l && c.hide();
            a.effects.restore(c, h);
            a.effects.removeWrapper(c);
            f()
        });
        1 < x && v.splice.apply(v, [1, 0].concat(v.splice(x, p + 1)));
        c.dequeue()
    }
}
)(jQuery);
(function(a) {
    a.effects.effect.clip = function(g, f) {
        var e, d, b = a(this), c = "position top bottom left right height width".split(" "), h = "show" === a.effects.setMode(b, g.mode || "hide"), m = "vertical" === (g.direction || "vertical"), l = m ? "height" : "width", m = m ? "top" : "left", n = {};
        a.effects.save(b, c);
        b.show();
        e = a.effects.createWrapper(b).css({
            overflow: "hidden"
        });
        e = "IMG" === b[0].tagName ? e : b;
        d = e[l]();
        h && (e.css(l, 0),
        e.css(m, d / 2));
        n[l] = h ? d : 0;
        n[m] = h ? 0 : d / 2;
        e.animate(n, {
            queue: !1,
            duration: g.duration,
            easing: g.easing,
            complete: function() {
                h || b.hide();
                a.effects.restore(b, c);
                a.effects.removeWrapper(b);
                f()
            }
        })
    }
}
)(jQuery);
(function(a) {
    a.effects.effect.drop = function(g, f) {
        var e, d = a(this), b = "position top bottom left right opacity height width".split(" "), c = a.effects.setMode(d, g.mode || "hide"), h = "show" === c;
        e = g.direction || "left";
        var m = "up" === e || "down" === e ? "top" : "left"
          , l = "up" === e || "left" === e ? "pos" : "neg"
          , n = {
            opacity: h ? 1 : 0
        };
        a.effects.save(d, b);
        d.show();
        a.effects.createWrapper(d);
        e = g.distance || d["top" === m ? "outerHeight" : "outerWidth"](!0) / 2;
        h && d.css("opacity", 0).css(m, "pos" === l ? -e : e);
        n[m] = (h ? "pos" === l ? "+=" : "-=" : "pos" === l ? "-=" : "+=") + e;
        d.animate(n, {
            queue: !1,
            duration: g.duration,
            easing: g.easing,
            complete: function() {
                "hide" === c && d.hide();
                a.effects.restore(d, b);
                a.effects.removeWrapper(d);
                f()
            }
        })
    }
}
)(jQuery);
(function(a) {
    a.effects.effect.explode = function(g, f) {
        function e() {
            x.push(this);
            x.length === n * q && (p.css({
                visibility: "visible"
            }),
            a(x).remove(),
            r || p.hide(),
            f())
        }
        var d, b, c, h, m, l, n = g.pieces ? Math.round(Math.sqrt(g.pieces)) : 3, q = n, p = a(this), r = "show" === a.effects.setMode(p, g.mode || "hide"), s = p.show().css("visibility", "hidden").offset(), u = Math.ceil(p.outerWidth() / q), v = Math.ceil(p.outerHeight() / n), x = [];
        for (d = 0; n > d; d++)
            for (h = s.top + d * v,
            l = d - (n - 1) / 2,
            b = 0; q > b; b++)
                c = s.left + b * u,
                m = b - (q - 1) / 2,
                p.clone().appendTo("body").wrap("<div></div>").css({
                    position: "absolute",
                    visibility: "visible",
                    left: -b * u,
                    top: -d * v
                }).parent().addClass("ui-effects-explode").css({
                    position: "absolute",
                    overflow: "hidden",
                    width: u,
                    height: v,
                    left: c + (r ? m * u : 0),
                    top: h + (r ? l * v : 0),
                    opacity: r ? 0 : 1
                }).animate({
                    left: c + (r ? 0 : m * u),
                    top: h + (r ? 0 : l * v),
                    opacity: r ? 1 : 0
                }, g.duration || 500, g.easing, e)
    }
}
)(jQuery);
(function(a) {
    a.effects.effect.fade = function(g, f) {
        var e = a(this)
          , d = a.effects.setMode(e, g.mode || "toggle");
        e.animate({
            opacity: d
        }, {
            queue: !1,
            duration: g.duration,
            easing: g.easing,
            complete: f
        })
    }
}
)(jQuery);
(function(a) {
    a.effects.effect.fold = function(g, f) {
        var e, d, b = a(this), c = "position top bottom left right height width".split(" ");
        e = a.effects.setMode(b, g.mode || "hide");
        var h = "show" === e
          , m = "hide" === e
          , l = g.size || 15
          , n = /([0-9]+)%/.exec(l)
          , q = !!g.horizFirst
          , p = (d = h !== q) ? ["width", "height"] : ["height", "width"]
          , r = g.duration / 2
          , s = {}
          , u = {};
        a.effects.save(b, c);
        b.show();
        e = a.effects.createWrapper(b).css({
            overflow: "hidden"
        });
        d = d ? [e.width(), e.height()] : [e.height(), e.width()];
        n && (l = parseInt(n[1], 10) / 100 * d[m ? 0 : 1]);
        h && e.css(q ? {
            height: 0,
            width: l
        } : {
            height: l,
            width: 0
        });
        s[p[0]] = h ? d[0] : l;
        u[p[1]] = h ? d[1] : 0;
        e.animate(s, r, g.easing).animate(u, r, g.easing, function() {
            m && b.hide();
            a.effects.restore(b, c);
            a.effects.removeWrapper(b);
            f()
        })
    }
}
)(jQuery);
(function(a) {
    a.effects.effect.highlight = function(g, f) {
        var e = a(this)
          , d = ["backgroundImage", "backgroundColor", "opacity"]
          , b = a.effects.setMode(e, g.mode || "show")
          , c = {
            backgroundColor: e.css("backgroundColor")
        };
        "hide" === b && (c.opacity = 0);
        a.effects.save(e, d);
        e.show().css({
            backgroundImage: "none",
            backgroundColor: g.color || "#ffff99"
        }).animate(c, {
            queue: !1,
            duration: g.duration,
            easing: g.easing,
            complete: function() {
                "hide" === b && e.hide();
                a.effects.restore(e, d);
                f()
            }
        })
    }
}
)(jQuery);
(function(a) {
    a.effects.effect.pulsate = function(g, f) {
        var e, d = a(this), b = a.effects.setMode(d, g.mode || "show");
        e = "show" === b;
        var c = "hide" === b
          , b = 2 * (g.times || 5) + (e || "hide" === b ? 1 : 0)
          , h = g.duration / b
          , m = 0
          , l = d.queue()
          , n = l.length;
        (e || !d.is(":visible")) && (d.css("opacity", 0).show(),
        m = 1);
        for (e = 1; b > e; e++)
            d.animate({
                opacity: m
            }, h, g.easing),
            m = 1 - m;
        d.animate({
            opacity: m
        }, h, g.easing);
        d.queue(function() {
            c && d.hide();
            f()
        });
        1 < n && l.splice.apply(l, [1, 0].concat(l.splice(n, b + 1)));
        d.dequeue()
    }
}
)(jQuery);
(function(a) {
    a.effects.effect.puff = function(g, f) {
        var e = a(this)
          , d = a.effects.setMode(e, g.mode || "hide")
          , b = "hide" === d
          , c = parseInt(g.percent, 10) || 150
          , h = c / 100
          , m = {
            height: e.height(),
            width: e.width(),
            outerHeight: e.outerHeight(),
            outerWidth: e.outerWidth()
        };
        a.extend(g, {
            effect: "scale",
            queue: !1,
            fade: !0,
            mode: d,
            complete: f,
            percent: b ? c : 100,
            from: b ? m : {
                height: m.height * h,
                width: m.width * h,
                outerHeight: m.outerHeight * h,
                outerWidth: m.outerWidth * h
            }
        });
        e.effect(g)
    }
    ;
    a.effects.effect.scale = function(g, f) {
        var e = a(this)
          , d = a.extend(!0, {}, g)
          , b = a.effects.setMode(e, g.mode || "effect")
          , c = parseInt(g.percent, 10) || (0 === parseInt(g.percent, 10) ? 0 : "hide" === b ? 0 : 100)
          , h = g.direction || "both"
          , m = g.origin
          , l = {
            height: e.height(),
            width: e.width(),
            outerHeight: e.outerHeight(),
            outerWidth: e.outerWidth()
        }
          , n = "horizontal" !== h ? c / 100 : 1
          , c = "vertical" !== h ? c / 100 : 1;
        d.effect = "size";
        d.queue = !1;
        d.complete = f;
        "effect" !== b && (d.origin = m || ["middle", "center"],
        d.restore = !0);
        d.from = g.from || ("show" === b ? {
            height: 0,
            width: 0,
            outerHeight: 0,
            outerWidth: 0
        } : l);
        d.to = {
            height: l.height * n,
            width: l.width * c,
            outerHeight: l.outerHeight * n,
            outerWidth: l.outerWidth * c
        };
        d.fade && ("show" === b && (d.from.opacity = 0,
        d.to.opacity = 1),
        "hide" === b && (d.from.opacity = 1,
        d.to.opacity = 0));
        e.effect(d)
    }
    ;
    a.effects.effect.size = function(g, f) {
        var e, d, b, c, h, m, l = a(this), n = "position top bottom left right width height overflow opacity".split(" ");
        h = "position top bottom left right overflow opacity".split(" ");
        var q = ["width", "height", "overflow"]
          , p = ["fontSize"]
          , r = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"]
          , s = ["borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight"]
          , u = a.effects.setMode(l, g.mode || "effect")
          , v = g.restore || "effect" !== u
          , x = g.scale || "both"
          , B = g.origin || ["middle", "center"]
          , C = l.css("position")
          , w = v ? n : h
          , y = {
            height: 0,
            width: 0,
            outerHeight: 0,
            outerWidth: 0
        };
        "show" === u && l.show();
        h = {
            height: l.height(),
            width: l.width(),
            outerHeight: l.outerHeight(),
            outerWidth: l.outerWidth()
        };
        "toggle" === g.mode && "show" === u ? (l.from = g.to || y,
        l.to = g.from || h) : (l.from = g.from || ("show" === u ? y : h),
        l.to = g.to || ("hide" === u ? y : h));
        b = l.from.height / h.height;
        c = l.from.width / h.width;
        e = l.to.height / h.height;
        d = l.to.width / h.width;
        ("box" === x || "both" === x) && (b !== e && (w = w.concat(r),
        l.from = a.effects.setTransition(l, r, b, l.from),
        l.to = a.effects.setTransition(l, r, e, l.to)),
        c !== d && (w = w.concat(s),
        l.from = a.effects.setTransition(l, s, c, l.from),
        l.to = a.effects.setTransition(l, s, d, l.to)));
        ("content" === x || "both" === x) && b !== e && (w = w.concat(p).concat(q),
        l.from = a.effects.setTransition(l, p, b, l.from),
        l.to = a.effects.setTransition(l, p, e, l.to));
        a.effects.save(l, w);
        l.show();
        a.effects.createWrapper(l);
        l.css("overflow", "hidden").css(l.from);
        B && (m = a.effects.getBaseline(B, h),
        l.from.top = (h.outerHeight - l.outerHeight()) * m.y,
        l.from.left = (h.outerWidth - l.outerWidth()) * m.x,
        l.to.top = (h.outerHeight - l.to.outerHeight) * m.y,
        l.to.left = (h.outerWidth - l.to.outerWidth) * m.x);
        l.css(l.from);
        "content" !== x && "both" !== x || (r = r.concat(["marginTop", "marginBottom"]).concat(p),
        s = s.concat(["marginLeft", "marginRight"]),
        q = n.concat(r).concat(s),
        l.find("*[width]").each(function() {
            var f = a(this)
              , h = f.height()
              , m = f.width()
              , l = f.outerHeight()
              , n = f.outerWidth();
            v && a.effects.save(f, q);
            f.from = {
                height: h * b,
                width: m * c,
                outerHeight: l * b,
                outerWidth: n * c
            };
            f.to = {
                height: h * e,
                width: m * d,
                outerHeight: h * e,
                outerWidth: m * d
            };
            b !== e && (f.from = a.effects.setTransition(f, r, b, f.from),
            f.to = a.effects.setTransition(f, r, e, f.to));
            c !== d && (f.from = a.effects.setTransition(f, s, c, f.from),
            f.to = a.effects.setTransition(f, s, d, f.to));
            f.css(f.from);
            f.animate(f.to, g.duration, g.easing, function() {
                v && a.effects.restore(f, q)
            })
        }));
        l.animate(l.to, {
            queue: !1,
            duration: g.duration,
            easing: g.easing,
            complete: function() {
                0 === l.to.opacity && l.css("opacity", l.from.opacity);
                "hide" === u && l.hide();
                a.effects.restore(l, w);
                v || ("static" === C ? l.css({
                    position: "relative",
                    top: l.to.top,
                    left: l.to.left
                }) : a.each(["top", "left"], function(a, b) {
                    l.css(b, function(b, c) {
                        var d = parseInt(c, 10)
                          , e = a ? l.to.left : l.to.top;
                        return "auto" === c ? e + "px" : d + e + "px"
                    })
                }));
                a.effects.removeWrapper(l);
                f()
            }
        })
    }
}
)(jQuery);
(function(a) {
    a.effects.effect.shake = function(g, f) {
        var e, d = a(this), b = "position top bottom left right height width".split(" "), c = a.effects.setMode(d, g.mode || "effect"), h = g.direction || "left";
        e = g.distance || 20;
        var m = g.times || 3
          , l = 2 * m + 1
          , n = Math.round(g.duration / l)
          , q = "up" === h || "down" === h ? "top" : "left"
          , p = "up" === h || "left" === h
          , h = {}
          , r = {}
          , s = {}
          , u = d.queue()
          , v = u.length;
        a.effects.save(d, b);
        d.show();
        a.effects.createWrapper(d);
        h[q] = (p ? "-=" : "+=") + e;
        r[q] = (p ? "+=" : "-=") + 2 * e;
        s[q] = (p ? "-=" : "+=") + 2 * e;
        d.animate(h, n, g.easing);
        for (e = 1; m > e; e++)
            d.animate(r, n, g.easing).animate(s, n, g.easing);
        d.animate(r, n, g.easing).animate(h, n / 2, g.easing).queue(function() {
            "hide" === c && d.hide();
            a.effects.restore(d, b);
            a.effects.removeWrapper(d);
            f()
        });
        1 < v && u.splice.apply(u, [1, 0].concat(u.splice(v, l + 1)));
        d.dequeue()
    }
}
)(jQuery);
(function(a) {
    a.effects.effect.slide = function(g, f) {
        var e, d = a(this), b = "position top bottom left right width height".split(" "), c = a.effects.setMode(d, g.mode || "show"), h = "show" === c;
        e = g.direction || "left";
        var m = "up" === e || "down" === e ? "top" : "left"
          , l = "up" === e || "left" === e
          , n = {};
        a.effects.save(d, b);
        d.show();
        e = g.distance || d["top" === m ? "outerHeight" : "outerWidth"](!0);
        a.effects.createWrapper(d).css({
            overflow: "hidden"
        });
        h && d.css(m, l ? isNaN(e) ? "-" + e : -e : e);
        n[m] = (h ? l ? "+=" : "-=" : l ? "-=" : "+=") + e;
        d.animate(n, {
            queue: !1,
            duration: g.duration,
            easing: g.easing,
            complete: function() {
                "hide" === c && d.hide();
                a.effects.restore(d, b);
                a.effects.removeWrapper(d);
                f()
            }
        })
    }
}
)(jQuery);
(function(a) {
    a.effects.effect.transfer = function(g, f) {
        var e = a(this)
          , d = a(g.to)
          , b = "fixed" === d.css("position")
          , c = a("body")
          , h = b ? c.scrollTop() : 0
          , c = b ? c.scrollLeft() : 0
          , m = d.offset()
          , d = {
            top: m.top - h,
            left: m.left - c,
            height: d.innerHeight(),
            width: d.innerWidth()
        }
          , m = e.offset()
          , l = a("<div class='ui-effects-transfer'></div>").appendTo(document.body).addClass(g.className).css({
            top: m.top - h,
            left: m.left - c,
            height: e.innerHeight(),
            width: e.innerWidth(),
            position: b ? "fixed" : "absolute"
        }).animate(d, g.duration, g.easing, function() {
            l.remove();
            f()
        })
    }
}
)(jQuery);
(function(a) {
    a.widget("ui.menu", {
        version: "1.10.3",
        defaultElement: "<ul>",
        delay: 300,
        options: {
            icons: {
                submenu: "ui-icon-carat-1-e"
            },
            menus: "ul",
            position: {
                my: "left top",
                at: "right top"
            },
            role: "menu",
            blur: null,
            focus: null,
            select: null
        },
        _create: function() {
            this.activeMenu = this.element;
            this.mouseHandled = !1;
            this.element.uniqueId().addClass("ui-menu ui-widget ui-widget-content ui-corner-all").toggleClass("ui-menu-icons", !!this.element.find(".ui-icon").length).attr({
                role: this.options.role,
                tabIndex: 0
            }).bind("click" + this.eventNamespace, a.proxy(function(a) {
                this.options.disabled && a.preventDefault()
            }, this));
            this.options.disabled && this.element.addClass("ui-state-disabled").attr("aria-disabled", "true");
            this._on({
                "mousedown .ui-menu-item > a": function(a) {
                    a.preventDefault()
                },
                "click .ui-state-disabled > a": function(a) {
                    a.preventDefault()
                },
                "click .ui-menu-item:has(a)": function(g) {
                    var f = a(g.target).closest(".ui-menu-item");
                    !this.mouseHandled && f.not(".ui-state-disabled").length && (this.mouseHandled = !0,
                    this.select(g),
                    f.has(".ui-menu").length ? this.expand(g) : this.element.is(":focus") || (this.element.trigger("focus", [!0]),
                    this.active && 1 === this.active.parents(".ui-menu").length && clearTimeout(this.timer)))
                },
                "mouseenter .ui-menu-item": function(g) {
                    var f = a(g.currentTarget);
                    f.siblings().children(".ui-state-active").removeClass("ui-state-active");
                    this.focus(g, f)
                },
                mouseleave: "collapseAll",
                "mouseleave .ui-menu": "collapseAll",
                focus: function(a, f) {
                    var e = this.active || this.element.children(".ui-menu-item").eq(0);
                    f || this.focus(a, e)
                },
                blur: function(g) {
                    this._delay(function() {
                        a.contains(this.element[0], this.document[0].activeElement) || this.collapseAll(g)
                    })
                },
                keydown: "_keydown"
            });
            this.refresh();
            this._on(this.document, {
                click: function(g) {
                    a(g.target).closest(".ui-menu").length || this.collapseAll(g);
                    this.mouseHandled = !1
                }
            })
        },
        _destroy: function() {
            this.element.removeAttr("aria-activedescendant").find(".ui-menu").addBack().removeClass("ui-menu ui-widget ui-widget-content ui-corner-all ui-menu-icons").removeAttr("role").removeAttr("tabIndex").removeAttr("aria-labelledby").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-disabled").removeUniqueId().show();
            this.element.find(".ui-menu-item").removeClass("ui-menu-item").removeAttr("role").removeAttr("aria-disabled").children("a").removeUniqueId().removeClass("ui-corner-all ui-state-hover").removeAttr("tabIndex").removeAttr("role").removeAttr("aria-haspopup").children().each(function() {
                var g = a(this);
                g.data("ui-menu-submenu-carat") && g.remove()
            });
            this.element.find(".ui-menu-divider").removeClass("ui-menu-divider ui-widget-content")
        },
        _keydown: function(g) {
            function f(a) {
                return a.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")
            }
            var e, d, b, c, h = !0;
            switch (g.keyCode) {
            case a.ui.keyCode.PAGE_UP:
                this.previousPage(g);
                break;
            case a.ui.keyCode.PAGE_DOWN:
                this.nextPage(g);
                break;
            case a.ui.keyCode.HOME:
                this._move("first", "first", g);
                break;
            case a.ui.keyCode.END:
                this._move("last", "last", g);
                break;
            case a.ui.keyCode.UP:
                this.previous(g);
                break;
            case a.ui.keyCode.DOWN:
                this.next(g);
                break;
            case a.ui.keyCode.LEFT:
                this.collapse(g);
                break;
            case a.ui.keyCode.RIGHT:
                this.active && !this.active.is(".ui-state-disabled") && this.expand(g);
                break;
            case a.ui.keyCode.ENTER:
            case a.ui.keyCode.SPACE:
                this._activate(g);
                break;
            case a.ui.keyCode.ESCAPE:
                this.collapse(g);
                break;
            default:
                h = !1,
                e = this.previousFilter || "",
                d = String.fromCharCode(g.keyCode),
                b = !1,
                clearTimeout(this.filterTimer),
                d === e ? b = !0 : d = e + d,
                c = RegExp("^" + f(d), "i"),
                e = this.activeMenu.children(".ui-menu-item").filter(function() {
                    return c.test(a(this).children("a").text())
                }),
                e = b && -1 !== e.index(this.active.next()) ? this.active.nextAll(".ui-menu-item") : e,
                e.length || (d = String.fromCharCode(g.keyCode),
                c = RegExp("^" + f(d), "i"),
                e = this.activeMenu.children(".ui-menu-item").filter(function() {
                    return c.test(a(this).children("a").text())
                })),
                e.length ? (this.focus(g, e),
                1 < e.length ? (this.previousFilter = d,
                this.filterTimer = this._delay(function() {
                    delete this.previousFilter
                }, 1E3)) : delete this.previousFilter) : delete this.previousFilter
            }
            h && g.preventDefault()
        },
        _activate: function(a) {
            this.active.is(".ui-state-disabled") || (this.active.children("a[aria-haspopup='true']").length ? this.expand(a) : this.select(a))
        },
        refresh: function() {
            var g, f = this.options.icons.submenu;
            g = this.element.find(this.options.menus);
            g.filter(":not(.ui-menu)").addClass("ui-menu ui-widget ui-widget-content ui-corner-all").hide().attr({
                role: this.options.role,
                "aria-hidden": "true",
                "aria-expanded": "false"
            }).each(function() {
                var e = a(this)
                  , d = e.prev("a")
                  , b = a("<span>").addClass("ui-menu-icon ui-icon " + f).data("ui-menu-submenu-carat", !0);
                d.attr("aria-haspopup", "true").prepend(b);
                e.attr("aria-labelledby", d.attr("id"))
            });
            g = g.add(this.element);
            g.children(":not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role", "presentation").children("a").uniqueId().addClass("ui-corner-all").attr({
                tabIndex: -1,
                role: this._itemRole()
            });
            g.children(":not(.ui-menu-item)").each(function() {
                var e = a(this);
                /[^\-\u2014\u2013\s]/.test(e.text()) || e.addClass("ui-widget-content ui-menu-divider")
            });
            g.children(".ui-state-disabled").attr("aria-disabled", "true");
            this.active && !a.contains(this.element[0], this.active[0]) && this.blur()
        },
        _itemRole: function() {
            return {
                menu: "menuitem",
                listbox: "option"
            }[this.options.role]
        },
        _setOption: function(a, f) {
            "icons" === a && this.element.find(".ui-menu-icon").removeClass(this.options.icons.submenu).addClass(f.submenu);
            this._super(a, f)
        },
        focus: function(a, f) {
            var e;
            this.blur(a, a && "focus" === a.type);
            this._scrollIntoView(f);
            this.active = f.first();
            e = this.active.children("a").addClass("ui-state-focus");
            this.options.role && this.element.attr("aria-activedescendant", e.attr("id"));
            this.active.parent().closest(".ui-menu-item").children("a:first").addClass("ui-state-active");
            a && "keydown" === a.type ? this._close() : this.timer = this._delay(function() {
                this._close()
            }, this.delay);
            e = f.children(".ui-menu");
            e.length && /^mouse/.test(a.type) && this._startOpening(e);
            this.activeMenu = f.parent();
            this._trigger("focus", a, {
                item: f
            })
        },
        _scrollIntoView: function(g) {
            var f, e, d, b, c, h;
            this._hasScroll() && (f = parseFloat(a.css(this.activeMenu[0], "borderTopWidth")) || 0,
            e = parseFloat(a.css(this.activeMenu[0], "paddingTop")) || 0,
            d = g.offset().top - this.activeMenu.offset().top - f - e,
            b = this.activeMenu.scrollTop(),
            c = this.activeMenu.height(),
            h = g.height(),
            0 > d ? this.activeMenu.scrollTop(b + d) : d + h > c && this.activeMenu.scrollTop(b + d - c + h))
        },
        blur: function(a, f) {
            f || clearTimeout(this.timer);
            this.active && (this.active.children("a").removeClass("ui-state-focus"),
            this.active = null,
            this._trigger("blur", a, {
                item: this.active
            }))
        },
        _startOpening: function(a) {
            clearTimeout(this.timer);
            "true" === a.attr("aria-hidden") && (this.timer = this._delay(function() {
                this._close();
                this._open(a)
            }, this.delay))
        },
        _open: function(g) {
            var f = a.extend({
                of: this.active
            }, this.options.position);
            clearTimeout(this.timer);
            this.element.find(".ui-menu").not(g.parents(".ui-menu")).hide().attr("aria-hidden", "true");
            g.show().removeAttr("aria-hidden").attr("aria-expanded", "true").position(f)
        },
        collapseAll: function(g, f) {
            clearTimeout(this.timer);
            this.timer = this._delay(function() {
                var e = f ? this.element : a(g && g.target).closest(this.element.find(".ui-menu"));
                e.length || (e = this.element);
                this._close(e);
                this.blur(g);
                this.activeMenu = e
            }, this.delay)
        },
        _close: function(a) {
            a || (a = this.active ? this.active.parent() : this.element);
            a.find(".ui-menu").hide().attr("aria-hidden", "true").attr("aria-expanded", "false").end().find("a.ui-state-active").removeClass("ui-state-active")
        },
        collapse: function(a) {
            var f = this.active && this.active.parent().closest(".ui-menu-item", this.element);
            f && f.length && (this._close(),
            this.focus(a, f))
        },
        expand: function(a) {
            var f = this.active && this.active.children(".ui-menu ").children(".ui-menu-item").first();
            f && f.length && (this._open(f.parent()),
            this._delay(function() {
                this.focus(a, f)
            }))
        },
        next: function(a) {
            this._move("next", "first", a)
        },
        previous: function(a) {
            this._move("prev", "last", a)
        },
        isFirstItem: function() {
            return this.active && !this.active.prevAll(".ui-menu-item").length
        },
        isLastItem: function() {
            return this.active && !this.active.nextAll(".ui-menu-item").length
        },
        _move: function(a, f, e) {
            var d;
            this.active && (d = "first" === a || "last" === a ? this.active["first" === a ? "prevAll" : "nextAll"](".ui-menu-item").eq(-1) : this.active[a + "All"](".ui-menu-item").eq(0));
            d && d.length && this.active || (d = this.activeMenu.children(".ui-menu-item")[f]());
            this.focus(e, d)
        },
        nextPage: function(g) {
            var f, e, d;
            return this.active ? (this.isLastItem() || (this._hasScroll() ? (e = this.active.offset().top,
            d = this.element.height(),
            this.active.nextAll(".ui-menu-item").each(function() {
                return f = a(this),
                0 > f.offset().top - e - d
            }),
            this.focus(g, f)) : this.focus(g, this.activeMenu.children(".ui-menu-item")[this.active ? "last" : "first"]())),
            void 0) : (this.next(g),
            void 0)
        },
        previousPage: function(g) {
            var f, e, d;
            return this.active ? (this.isFirstItem() || (this._hasScroll() ? (e = this.active.offset().top,
            d = this.element.height(),
            this.active.prevAll(".ui-menu-item").each(function() {
                return f = a(this),
                0 < f.offset().top - e + d
            }),
            this.focus(g, f)) : this.focus(g, this.activeMenu.children(".ui-menu-item").first())),
            void 0) : (this.next(g),
            void 0)
        },
        _hasScroll: function() {
            return this.element.outerHeight() < this.element.prop("scrollHeight")
        },
        select: function(g) {
            this.active = this.active || a(g.target).closest(".ui-menu-item");
            var f = {
                item: this.active
            };
            this.active.has(".ui-menu").length || this.collapseAll(g, !0);
            this._trigger("select", g, f)
        }
    })
}
)(jQuery);
(function(a, g) {
    function f(a, b, c) {
        return [parseFloat(a[0]) * (p.test(a[0]) ? b / 100 : 1), parseFloat(a[1]) * (p.test(a[1]) ? c / 100 : 1)]
    }
    function e(b) {
        var c = b[0];
        return 9 === c.nodeType ? {
            width: b.width(),
            height: b.height(),
            offset: {
                top: 0,
                left: 0
            }
        } : a.isWindow(c) ? {
            width: b.width(),
            height: b.height(),
            offset: {
                top: b.scrollTop(),
                left: b.scrollLeft()
            }
        } : c.preventDefault ? {
            width: 0,
            height: 0,
            offset: {
                top: c.pageY,
                left: c.pageX
            }
        } : {
            width: b.outerWidth(),
            height: b.outerHeight(),
            offset: b.offset()
        }
    }
    a.ui = a.ui || {};
    var d, b = Math.max, c = Math.abs, h = Math.round, m = /left|center|right/, l = /top|center|bottom/, n = /[\+\-]\d+(\.[\d]+)?%?/, q = /^\w+/, p = /%$/, r = a.fn.position;
    a.position = {
        scrollbarWidth: function() {
            if (d !== g)
                return d;
            var b, c, e = a("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"), f = e.children()[0];
            return a("body").append(e),
            b = f.offsetWidth,
            e.css("overflow", "scroll"),
            c = f.offsetWidth,
            b === c && (c = e[0].clientWidth),
            e.remove(),
            d = b - c
        },
        getScrollInfo: function(b) {
            var c = b.isWindow ? "" : b.element.css("overflow-x")
              , d = b.isWindow ? "" : b.element.css("overflow-y")
              , c = "scroll" === c || "auto" === c && b.width < b.element[0].scrollWidth;
            return {
                width: "scroll" === d || "auto" === d && b.height < b.element[0].scrollHeight ? a.position.scrollbarWidth() : 0,
                height: c ? a.position.scrollbarWidth() : 0
            }
        },
        getWithinInfo: function(b) {
            b = a(b || window);
            var c = a.isWindow(b[0]);
            return {
                element: b,
                isWindow: c,
                offset: b.offset() || {
                    left: 0,
                    top: 0
                },
                scrollLeft: b.scrollLeft(),
                scrollTop: b.scrollTop(),
                width: c ? b.width() : b.outerWidth(),
                height: c ? b.height() : b.outerHeight()
            }
        }
    };
    a.fn.position = function(d) {
        if (!d || !d.of)
            return r.apply(this, arguments);
        d = a.extend({}, d);
        var g, p, x, B, C, w, y = a(d.of), A = a.position.getWithinInfo(d.within), N = a.position.getScrollInfo(A), I = (d.collision || "flip").split(" "), J = {};
        return w = e(y),
        y[0].preventDefault && (d.at = "left top"),
        p = w.width,
        x = w.height,
        B = w.offset,
        C = a.extend({}, B),
        a.each(["my", "at"], function() {
            var a, b, c = (d[this] || "").split(" ");
            1 === c.length && (c = m.test(c[0]) ? c.concat(["center"]) : l.test(c[0]) ? ["center"].concat(c) : ["center", "center"]);
            c[0] = m.test(c[0]) ? c[0] : "center";
            c[1] = l.test(c[1]) ? c[1] : "center";
            a = n.exec(c[0]);
            b = n.exec(c[1]);
            J[this] = [a ? a[0] : 0, b ? b[0] : 0];
            d[this] = [q.exec(c[0])[0], q.exec(c[1])[0]]
        }),
        1 === I.length && (I[1] = I[0]),
        "right" === d.at[0] ? C.left += p : "center" === d.at[0] && (C.left += p / 2),
        "bottom" === d.at[1] ? C.top += x : "center" === d.at[1] && (C.top += x / 2),
        g = f(J.at, p, x),
        C.left += g[0],
        C.top += g[1],
        this.each(function() {
            var e, m, l = a(this), n = l.outerWidth(), q = l.outerHeight(), r = parseInt(a.css(this, "marginLeft"), 10) || 0, w = parseInt(a.css(this, "marginTop"), 10) || 0, W = n + r + (parseInt(a.css(this, "marginRight"), 10) || 0) + N.width, S = q + w + (parseInt(a.css(this, "marginBottom"), 10) || 0) + N.height, D = a.extend({}, C), O = f(J.my, l.outerWidth(), l.outerHeight());
            "right" === d.my[0] ? D.left -= n : "center" === d.my[0] && (D.left -= n / 2);
            "bottom" === d.my[1] ? D.top -= q : "center" === d.my[1] && (D.top -= q / 2);
            D.left += O[0];
            D.top += O[1];
            a.support.offsetFractions || (D.left = h(D.left),
            D.top = h(D.top));
            e = {
                marginLeft: r,
                marginTop: w
            };
            a.each(["left", "top"], function(b, c) {
                a.ui.position[I[b]] && a.ui.position[I[b]][c](D, {
                    targetWidth: p,
                    targetHeight: x,
                    elemWidth: n,
                    elemHeight: q,
                    collisionPosition: e,
                    collisionWidth: W,
                    collisionHeight: S,
                    offset: [g[0] + O[0], g[1] + O[1]],
                    my: d.my,
                    at: d.at,
                    within: A,
                    elem: l
                })
            });
            d.using && (m = function(a) {
                var e = B.left - D.left
                  , f = e + p - n
                  , g = B.top - D.top
                  , h = g + x - q
                  , m = {
                    target: {
                        element: y,
                        left: B.left,
                        top: B.top,
                        width: p,
                        height: x
                    },
                    element: {
                        element: l,
                        left: D.left,
                        top: D.top,
                        width: n,
                        height: q
                    },
                    horizontal: 0 > f ? "left" : 0 < e ? "right" : "center",
                    vertical: 0 > h ? "top" : 0 < g ? "bottom" : "middle"
                };
                n > p && c(e + f) < p && (m.horizontal = "center");
                q > x && c(g + h) < x && (m.vertical = "middle");
                m.important = b(c(e), c(f)) > b(c(g), c(h)) ? "horizontal" : "vertical";
                d.using.call(this, a, m)
            }
            );
            l.offset(a.extend(D, {
                using: m
            }))
        })
    }
    ;
    a.ui.position = {
        fit: {
            left: function(a, c) {
                var d, e = c.within, f = e.isWindow ? e.scrollLeft : e.offset.left, e = e.width, g = a.left - c.collisionPosition.marginLeft, h = f - g, m = g + c.collisionWidth - e - f;
                c.collisionWidth > e ? 0 < h && 0 >= m ? (d = a.left + h + c.collisionWidth - e - f,
                a.left += h - d) : a.left = 0 < m && 0 >= h ? f : h > m ? f + e - c.collisionWidth : f : 0 < h ? a.left += h : 0 < m ? a.left -= m : a.left = b(a.left - g, a.left)
            },
            top: function(a, c) {
                var d, e = c.within, e = e.isWindow ? e.scrollTop : e.offset.top, f = c.within.height, g = a.top - c.collisionPosition.marginTop, h = e - g, m = g + c.collisionHeight - f - e;
                c.collisionHeight > f ? 0 < h && 0 >= m ? (d = a.top + h + c.collisionHeight - f - e,
                a.top += h - d) : a.top = 0 < m && 0 >= h ? e : h > m ? e + f - c.collisionHeight : e : 0 < h ? a.top += h : 0 < m ? a.top -= m : a.top = b(a.top - g, a.top)
            }
        },
        flip: {
            left: function(a, b) {
                var d, e, f = b.within, g = f.offset.left + f.scrollLeft, h = f.width, f = f.isWindow ? f.scrollLeft : f.offset.left, m = a.left - b.collisionPosition.marginLeft, l = m - f, m = m + b.collisionWidth - h - f, n = "left" === b.my[0] ? -b.elemWidth : "right" === b.my[0] ? b.elemWidth : 0, p = "left" === b.at[0] ? b.targetWidth : "right" === b.at[0] ? -b.targetWidth : 0, q = -2 * b.offset[0];
                0 > l ? (d = a.left + n + p + q + b.collisionWidth - h - g,
                (0 > d || d < c(l)) && (a.left += n + p + q)) : 0 < m && (e = a.left - b.collisionPosition.marginLeft + n + p + q - f,
                (0 < e || c(e) < m) && (a.left += n + p + q))
            },
            top: function(a, b) {
                var d, e, f = b.within, g = f.offset.top + f.scrollTop, h = f.height, f = f.isWindow ? f.scrollTop : f.offset.top, m = a.top - b.collisionPosition.marginTop, l = m - f, m = m + b.collisionHeight - h - f, n = "top" === b.my[1] ? -b.elemHeight : "bottom" === b.my[1] ? b.elemHeight : 0, p = "top" === b.at[1] ? b.targetHeight : "bottom" === b.at[1] ? -b.targetHeight : 0, q = -2 * b.offset[1];
                0 > l ? (e = a.top + n + p + q + b.collisionHeight - h - g,
                a.top + n + p + q > l && (0 > e || e < c(l)) && (a.top += n + p + q)) : 0 < m && (d = a.top - b.collisionPosition.marginTop + n + p + q - f,
                a.top + n + p + q > m && (0 < d || c(d) < m) && (a.top += n + p + q))
            }
        },
        flipfit: {
            left: function() {
                a.ui.position.flip.left.apply(this, arguments);
                a.ui.position.fit.left.apply(this, arguments)
            },
            top: function() {
                a.ui.position.flip.top.apply(this, arguments);
                a.ui.position.fit.top.apply(this, arguments)
            }
        }
    };
    (function() {
        var b, c, d, e, f = document.getElementsByTagName("body")[0];
        d = document.createElement("div");
        b = document.createElement(f ? "div" : "body");
        c = {
            visibility: "hidden",
            width: 0,
            height: 0,
            border: 0,
            margin: 0,
            background: "none"
        };
        f && a.extend(c, {
            position: "absolute",
            left: "-1000px",
            top: "-1000px"
        });
        for (e in c)
            b.style[e] = c[e];
        b.appendChild(d);
        c = f || document.documentElement;
        c.insertBefore(b, c.firstChild);
        d.style.cssText = "position: absolute; left: 10.7432222px;";
        d = a(d).offset().left;
        a.support.offsetFractions = 10 < d && 11 > d;
        b.innerHTML = "";
        c.removeChild(b)
    }
    )()
}
)(jQuery);
(function(a, g) {
    a.widget("ui.progressbar", {
        version: "1.10.3",
        options: {
            max: 100,
            value: 0,
            change: null,
            complete: null
        },
        min: 0,
        _create: function() {
            this.oldValue = this.options.value = this._constrainedValue();
            this.element.addClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").attr({
                role: "progressbar",
                "aria-valuemin": this.min
            });
            this.valueDiv = a("<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>").appendTo(this.element);
            this._refreshValue()
        },
        _destroy: function() {
            this.element.removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow");
            this.valueDiv.remove()
        },
        value: function(a) {
            return a === g ? this.options.value : (this.options.value = this._constrainedValue(a),
            this._refreshValue(),
            void 0)
        },
        _constrainedValue: function(a) {
            return a === g && (a = this.options.value),
            this.indeterminate = !1 === a,
            "number" != typeof a && (a = 0),
            this.indeterminate ? !1 : Math.min(this.options.max, Math.max(this.min, a))
        },
        _setOptions: function(a) {
            var e = a.value;
            delete a.value;
            this._super(a);
            this.options.value = this._constrainedValue(e);
            this._refreshValue()
        },
        _setOption: function(a, e) {
            "max" === a && (e = Math.max(this.min, e));
            this._super(a, e)
        },
        _percentage: function() {
            return this.indeterminate ? 100 : 100 * (this.options.value - this.min) / (this.options.max - this.min)
        },
        _refreshValue: function() {
            var f = this.options.value
              , e = this._percentage();
            this.valueDiv.toggle(this.indeterminate || f > this.min).toggleClass("ui-corner-right", f === this.options.max).width(e.toFixed(0) + "%");
            this.element.toggleClass("ui-progressbar-indeterminate", this.indeterminate);
            this.indeterminate ? (this.element.removeAttr("aria-valuenow"),
            this.overlayDiv || (this.overlayDiv = a("<div class='ui-progressbar-overlay'></div>").appendTo(this.valueDiv))) : (this.element.attr({
                "aria-valuemax": this.options.max,
                "aria-valuenow": f
            }),
            this.overlayDiv && (this.overlayDiv.remove(),
            this.overlayDiv = null));
            this.oldValue !== f && (this.oldValue = f,
            this._trigger("change"));
            f === this.options.max && this._trigger("complete")
        }
    })
}
)(jQuery);
(function(a) {
    a.widget("ui.slider", a.ui.mouse, {
        version: "1.10.3",
        widgetEventPrefix: "slide",
        options: {
            animate: !1,
            distance: 0,
            max: 100,
            min: 0,
            orientation: "horizontal",
            range: !1,
            step: 1,
            value: 0,
            values: null,
            change: null,
            slide: null,
            start: null,
            stop: null
        },
        _create: function() {
            this._mouseSliding = this._keySliding = !1;
            this._animateOff = !0;
            this._handleIndex = null;
            this._detectOrientation();
            this._mouseInit();
            this.element.addClass("ui-slider ui-slider-" + this.orientation + " ui-widget ui-widget-content ui-corner-all");
            this._refresh();
            this._setOption("disabled", this.options.disabled);
            this._animateOff = !1
        },
        _refresh: function() {
            this._createRange();
            this._createHandles();
            this._setupEvents();
            this._refreshValue()
        },
        _createHandles: function() {
            var g, f;
            g = this.options;
            var e = this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all")
              , d = [];
            f = g.values && g.values.length || 1;
            e.length > f && (e.slice(f).remove(),
            e = e.slice(0, f));
            for (g = e.length; f > g; g++)
                d.push("<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>");
            this.handles = e.add(a(d.join("")).appendTo(this.element));
            this.handle = this.handles.eq(0);
            this.handles.each(function(b) {
                a(this).data("ui-slider-handle-index", b)
            })
        },
        _createRange: function() {
            var g = this.options
              , f = "";
            g.range ? (!0 === g.range && (g.values ? g.values.length && 2 !== g.values.length ? g.values = [g.values[0], g.values[0]] : a.isArray(g.values) && (g.values = g.values.slice(0)) : g.values = [this._valueMin(), this._valueMin()]),
            this.range && this.range.length ? this.range.removeClass("ui-slider-range-min ui-slider-range-max").css({
                left: "",
                bottom: ""
            }) : (this.range = a("<div></div>").appendTo(this.element),
            f = "ui-slider-range ui-widget-header ui-corner-all"),
            this.range.addClass(f + ("min" === g.range || "max" === g.range ? " ui-slider-range-" + g.range : ""))) : this.range = a([])
        },
        _setupEvents: function() {
            var a = this.handles.add(this.range).filter("a");
            this._off(a);
            this._on(a, this._handleEvents);
            this._hoverable(a);
            this._focusable(a)
        },
        _destroy: function() {
            this.handles.remove();
            this.range.remove();
            this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-widget ui-widget-content ui-corner-all");
            this._mouseDestroy()
        },
        _mouseCapture: function(g) {
            var f, e, d, b, c, h, m, l, n = this, q = this.options;
            return q.disabled ? !1 : (this.elementSize = {
                width: this.element.outerWidth(),
                height: this.element.outerHeight()
            },
            this.elementOffset = this.element.offset(),
            f = {
                x: g.pageX,
                y: g.pageY
            },
            e = this._normValueFromMouse(f),
            d = this._valueMax() - this._valueMin() + 1,
            this.handles.each(function(f) {
                var h = Math.abs(e - n.values(f));
                (d > h || d === h && (f === n._lastChangedValue || n.values(f) === q.min)) && (d = h,
                b = a(this),
                c = f)
            }),
            h = this._start(g, c),
            !1 === h ? !1 : (this._mouseSliding = !0,
            this._handleIndex = c,
            b.addClass("ui-state-active").focus(),
            m = b.offset(),
            l = !a(g.target).parents().addBack().is(".ui-slider-handle"),
            this._clickOffset = l ? {
                left: 0,
                top: 0
            } : {
                left: g.pageX - m.left - b.width() / 2,
                top: g.pageY - m.top - b.height() / 2 - (parseInt(b.css("borderTopWidth"), 10) || 0) - (parseInt(b.css("borderBottomWidth"), 10) || 0) + (parseInt(b.css("marginTop"), 10) || 0)
            },
            this.handles.hasClass("ui-state-hover") || this._slide(g, c, e),
            this._animateOff = !0,
            !0))
        },
        _mouseStart: function() {
            return !0
        },
        _mouseDrag: function(a) {
            var f = this._normValueFromMouse({
                x: a.pageX,
                y: a.pageY
            });
            return this._slide(a, this._handleIndex, f),
            !1
        },
        _mouseStop: function(a) {
            return this.handles.removeClass("ui-state-active"),
            this._mouseSliding = !1,
            this._stop(a, this._handleIndex),
            this._change(a, this._handleIndex),
            this._handleIndex = null,
            this._clickOffset = null,
            this._animateOff = !1,
            !1
        },
        _detectOrientation: function() {
            this.orientation = "vertical" === this.options.orientation ? "vertical" : "horizontal"
        },
        _normValueFromMouse: function(a) {
            var f, e, d, b, c;
            return "horizontal" === this.orientation ? (f = this.elementSize.width,
            e = a.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0)) : (f = this.elementSize.height,
            e = a.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0)),
            d = e / f,
            1 < d && (d = 1),
            0 > d && (d = 0),
            "vertical" === this.orientation && (d = 1 - d),
            b = this._valueMax() - this._valueMin(),
            c = this._valueMin() + d * b,
            this._trimAlignValue(c)
        },
        _start: function(a, f) {
            var e = {
                handle: this.handles[f],
                value: this.value()
            };
            return this.options.values && this.options.values.length && (e.value = this.values(f),
            e.values = this.values()),
            this._trigger("start", a, e)
        },
        _slide: function(a, f, e) {
            var d, b, c;
            this.options.values && this.options.values.length ? (d = this.values(f ? 0 : 1),
            2 === this.options.values.length && !0 === this.options.range && (0 === f && e > d || 1 === f && d > e) && (e = d),
            e !== this.values(f) && (b = this.values(),
            b[f] = e,
            c = this._trigger("slide", a, {
                handle: this.handles[f],
                value: e,
                values: b
            }),
            this.values(f ? 0 : 1),
            !1 !== c && this.values(f, e, !0))) : e !== this.value() && (c = this._trigger("slide", a, {
                handle: this.handles[f],
                value: e
            }),
            !1 !== c && this.value(e))
        },
        _stop: function(a, f) {
            var e = {
                handle: this.handles[f],
                value: this.value()
            };
            this.options.values && this.options.values.length && (e.value = this.values(f),
            e.values = this.values());
            this._trigger("stop", a, e)
        },
        _change: function(a, f) {
            if (!this._keySliding && !this._mouseSliding) {
                var e = {
                    handle: this.handles[f],
                    value: this.value()
                };
                this.options.values && this.options.values.length && (e.value = this.values(f),
                e.values = this.values());
                this._lastChangedValue = f;
                this._trigger("change", a, e)
            }
        },
        value: function(a) {
            return arguments.length ? (this.options.value = this._trimAlignValue(a),
            this._refreshValue(),
            this._change(null, 0),
            void 0) : this._value()
        },
        values: function(g, f) {
            var e, d, b;
            if (1 < arguments.length)
                return this.options.values[g] = this._trimAlignValue(f),
                this._refreshValue(),
                this._change(null, g),
                void 0;
            if (!arguments.length)
                return this._values();
            if (!a.isArray(arguments[0]))
                return this.options.values && this.options.values.length ? this._values(g) : this.value();
            e = this.options.values;
            d = arguments[0];
            for (b = 0; b < e.length; b += 1)
                e[b] = this._trimAlignValue(d[b]),
                this._change(null, b);
            this._refreshValue()
        },
        _setOption: function(g, f) {
            var e, d = 0;
            switch ("range" === g && !0 === this.options.range && ("min" === f ? (this.options.value = this._values(0),
            this.options.values = null) : "max" === f && (this.options.value = this._values(this.options.values.length - 1),
            this.options.values = null)),
            a.isArray(this.options.values) && (d = this.options.values.length),
            a.Widget.prototype._setOption.apply(this, arguments),
            g) {
            case "orientation":
                this._detectOrientation();
                this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-" + this.orientation);
                this._refreshValue();
                break;
            case "value":
                this._animateOff = !0;
                this._refreshValue();
                this._change(null, 0);
                this._animateOff = !1;
                break;
            case "values":
                this._animateOff = !0;
                this._refreshValue();
                for (e = 0; d > e; e += 1)
                    this._change(null, e);
                this._animateOff = !1;
                break;
            case "min":
            case "max":
                this._animateOff = !0;
                this._refreshValue();
                this._animateOff = !1;
                break;
            case "range":
                this._animateOff = !0,
                this._refresh(),
                this._animateOff = !1
            }
        },
        _value: function() {
            return this._trimAlignValue(this.options.value)
        },
        _values: function(a) {
            var f, e;
            if (arguments.length)
                return f = this.options.values[a],
                this._trimAlignValue(f);
            if (this.options.values && this.options.values.length) {
                f = this.options.values.slice();
                for (e = 0; e < f.length; e += 1)
                    f[e] = this._trimAlignValue(f[e]);
                return f
            }
            return []
        },
        _trimAlignValue: function(a) {
            if (a <= this._valueMin())
                return this._valueMin();
            if (a >= this._valueMax())
                return this._valueMax();
            var f = 0 < this.options.step ? this.options.step : 1
              , e = (a - this._valueMin()) % f;
            a -= e;
            return 2 * Math.abs(e) >= f && (a += 0 < e ? f : -f),
            parseFloat(a.toFixed(5))
        },
        _valueMin: function() {
            return this.options.min
        },
        _valueMax: function() {
            return this.options.max
        },
        _refreshValue: function() {
            var g, f, e, d, b, c = this.options.range, h = this.options, m = this, l = this._animateOff ? !1 : h.animate, n = {};
            this.options.values && this.options.values.length ? this.handles.each(function(b) {
                f = 100 * ((m.values(b) - m._valueMin()) / (m._valueMax() - m._valueMin()));
                n["horizontal" === m.orientation ? "left" : "bottom"] = f + "%";
                a(this).stop(1, 1)[l ? "animate" : "css"](n, h.animate);
                !0 === m.options.range && ("horizontal" === m.orientation ? (0 === b && m.range.stop(1, 1)[l ? "animate" : "css"]({
                    left: f + "%"
                }, h.animate),
                1 === b && m.range[l ? "animate" : "css"]({
                    width: f - g + "%"
                }, {
                    queue: !1,
                    duration: h.animate
                })) : (0 === b && m.range.stop(1, 1)[l ? "animate" : "css"]({
                    bottom: f + "%"
                }, h.animate),
                1 === b && m.range[l ? "animate" : "css"]({
                    height: f - g + "%"
                }, {
                    queue: !1,
                    duration: h.animate
                })));
                g = f
            }) : (e = this.value(),
            d = this._valueMin(),
            b = this._valueMax(),
            f = b !== d ? (e - d) / (b - d) * 100 : 0,
            n["horizontal" === this.orientation ? "left" : "bottom"] = f + "%",
            this.handle.stop(1, 1)[l ? "animate" : "css"](n, h.animate),
            "min" === c && "horizontal" === this.orientation && this.range.stop(1, 1)[l ? "animate" : "css"]({
                width: f + "%"
            }, h.animate),
            "max" === c && "horizontal" === this.orientation && this.range[l ? "animate" : "css"]({
                width: 100 - f + "%"
            }, {
                queue: !1,
                duration: h.animate
            }),
            "min" === c && "vertical" === this.orientation && this.range.stop(1, 1)[l ? "animate" : "css"]({
                height: f + "%"
            }, h.animate),
            "max" === c && "vertical" === this.orientation && this.range[l ? "animate" : "css"]({
                height: 100 - f + "%"
            }, {
                queue: !1,
                duration: h.animate
            }))
        },
        _handleEvents: {
            keydown: function(g) {
                var f, e, d, b = a(g.target).data("ui-slider-handle-index");
                switch (g.keyCode) {
                case a.ui.keyCode.HOME:
                case a.ui.keyCode.END:
                case a.ui.keyCode.PAGE_UP:
                case a.ui.keyCode.PAGE_DOWN:
                case a.ui.keyCode.UP:
                case a.ui.keyCode.RIGHT:
                case a.ui.keyCode.DOWN:
                case a.ui.keyCode.LEFT:
                    if (g.preventDefault(),
                    !this._keySliding && (this._keySliding = !0,
                    a(g.target).addClass("ui-state-active"),
                    f = this._start(g, b),
                    !1 === f))
                        return
                }
                switch (d = this.options.step,
                f = e = this.options.values && this.options.values.length ? this.values(b) : this.value(),
                g.keyCode) {
                case a.ui.keyCode.HOME:
                    e = this._valueMin();
                    break;
                case a.ui.keyCode.END:
                    e = this._valueMax();
                    break;
                case a.ui.keyCode.PAGE_UP:
                    e = this._trimAlignValue(f + (this._valueMax() - this._valueMin()) / 5);
                    break;
                case a.ui.keyCode.PAGE_DOWN:
                    e = this._trimAlignValue(f - (this._valueMax() - this._valueMin()) / 5);
                    break;
                case a.ui.keyCode.UP:
                case a.ui.keyCode.RIGHT:
                    if (f === this._valueMax())
                        return;
                    e = this._trimAlignValue(f + d);
                    break;
                case a.ui.keyCode.DOWN:
                case a.ui.keyCode.LEFT:
                    if (f === this._valueMin())
                        return;
                    e = this._trimAlignValue(f - d)
                }
                this._slide(g, b, e)
            },
            click: function(a) {
                a.preventDefault()
            },
            keyup: function(g) {
                var f = a(g.target).data("ui-slider-handle-index");
                this._keySliding && (this._keySliding = !1,
                this._stop(g, f),
                this._change(g, f),
                a(g.target).removeClass("ui-state-active"))
            }
        }
    })
}
)(jQuery);
(function(a) {
    function g(a) {
        return function() {
            var e = this.element.val();
            a.apply(this, arguments);
            this._refresh();
            e !== this.element.val() && this._trigger("change")
        }
    }
    a.widget("ui.spinner", {
        version: "1.10.3",
        defaultElement: "<input>",
        widgetEventPrefix: "spin",
        options: {
            culture: null,
            icons: {
                down: "ui-icon-triangle-1-s",
                up: "ui-icon-triangle-1-n"
            },
            incremental: !0,
            max: null,
            min: null,
            numberFormat: null,
            page: 10,
            step: 1,
            change: null,
            spin: null,
            start: null,
            stop: null
        },
        _create: function() {
            this._setOption("max", this.options.max);
            this._setOption("min", this.options.min);
            this._setOption("step", this.options.step);
            this._value(this.element.val(), !0);
            this._draw();
            this._on(this._events);
            this._refresh();
            this._on(this.window, {
                beforeunload: function() {
                    this.element.removeAttr("autocomplete")
                }
            })
        },
        _getCreateOptions: function() {
            var f = {}
              , e = this.element;
            return a.each(["min", "max", "step"], function(a, b) {
                var c = e.attr(b);
                void 0 !== c && c.length && (f[b] = c)
            }),
            f
        },
        _events: {
            keydown: function(a) {
                this._start(a) && this._keydown(a) && a.preventDefault()
            },
            keyup: "_stop",
            focus: function() {
                this.previous = this.element.val()
            },
            blur: function(a) {
                return this.cancelBlur ? (delete this.cancelBlur,
                void 0) : (this._stop(),
                this._refresh(),
                this.previous !== this.element.val() && this._trigger("change", a),
                void 0)
            },
            mousewheel: function(a, e) {
                if (e) {
                    if (!this.spinning && !this._start(a))
                        return !1;
                    this._spin((0 < e ? 1 : -1) * this.options.step, a);
                    clearTimeout(this.mousewheelTimer);
                    this.mousewheelTimer = this._delay(function() {
                        this.spinning && this._stop(a)
                    }, 100);
                    a.preventDefault()
                }
            },
            "mousedown .ui-spinner-button": function(f) {
                function e() {
                    this.element[0] === this.document[0].activeElement || (this.element.focus(),
                    this.previous = d,
                    this._delay(function() {
                        this.previous = d
                    }))
                }
                var d;
                d = this.element[0] === this.document[0].activeElement ? this.previous : this.element.val();
                f.preventDefault();
                e.call(this);
                this.cancelBlur = !0;
                this._delay(function() {
                    delete this.cancelBlur;
                    e.call(this)
                });
                !1 !== this._start(f) && this._repeat(null, a(f.currentTarget).hasClass("ui-spinner-up") ? 1 : -1, f)
            },
            "mouseup .ui-spinner-button": "_stop",
            "mouseenter .ui-spinner-button": function(f) {
                return a(f.currentTarget).hasClass("ui-state-active") ? !1 === this._start(f) ? !1 : (this._repeat(null, a(f.currentTarget).hasClass("ui-spinner-up") ? 1 : -1, f),
                void 0) : void 0
            },
            "mouseleave .ui-spinner-button": "_stop"
        },
        _draw: function() {
            var a = this.uiSpinner = this.element.addClass("ui-spinner-input").attr("autocomplete", "off").wrap(this._uiSpinnerHtml()).parent().append(this._buttonHtml());
            this.element.attr("role", "spinbutton");
            this.buttons = a.find(".ui-spinner-button").attr("tabIndex", -1).button().removeClass("ui-corner-all");
            this.buttons.height() > Math.ceil(0.5 * a.height()) && 0 < a.height() && a.height(a.height());
            this.options.disabled && this.disable()
        },
        _keydown: function(f) {
            var e = this.options
              , d = a.ui.keyCode;
            switch (f.keyCode) {
            case d.UP:
                return this._repeat(null, 1, f),
                !0;
            case d.DOWN:
                return this._repeat(null, -1, f),
                !0;
            case d.PAGE_UP:
                return this._repeat(null, e.page, f),
                !0;
            case d.PAGE_DOWN:
                return this._repeat(null, -e.page, f),
                !0
            }
            return !1
        },
        _uiSpinnerHtml: function() {
            return "<span class='ui-spinner ui-widget ui-widget-content ui-corner-all'></span>"
        },
        _buttonHtml: function() {
            return "<a class='ui-spinner-button ui-spinner-up ui-corner-tr'><span class='ui-icon " + this.options.icons.up + "'>&#9650;</span></a><a class='ui-spinner-button ui-spinner-down ui-corner-br'><span class='ui-icon " + this.options.icons.down + "'>&#9660;</span></a>"
        },
        _start: function(a) {
            return this.spinning || !1 !== this._trigger("start", a) ? (this.counter || (this.counter = 1),
            this.spinning = !0,
            !0) : !1
        },
        _repeat: function(a, e, d) {
            a = a || 500;
            clearTimeout(this.timer);
            this.timer = this._delay(function() {
                this._repeat(40, e, d)
            }, a);
            this._spin(e * this.options.step, d)
        },
        _spin: function(a, e) {
            var d = this.value() || 0;
            this.counter || (this.counter = 1);
            d = this._adjustValue(d + a * this._increment(this.counter));
            this.spinning && !1 === this._trigger("spin", e, {
                value: d
            }) || (this._value(d),
            this.counter++)
        },
        _increment: function(f) {
            var e = this.options.incremental;
            return e ? a.isFunction(e) ? e(f) : Math.floor(f * f * f / 5E4 - f * f / 500 + 17 * f / 200 + 1) : 1
        },
        _precision: function() {
            var a = this._precisionOf(this.options.step);
            return null !== this.options.min && (a = Math.max(a, this._precisionOf(this.options.min))),
            a
        },
        _precisionOf: function(a) {
            a = a.toString();
            var e = a.indexOf(".");
            return -1 === e ? 0 : a.length - e - 1
        },
        _adjustValue: function(a) {
            var e, d, b = this.options;
            return e = null !== b.min ? b.min : 0,
            d = a - e,
            d = Math.round(d / b.step) * b.step,
            a = e + d,
            a = parseFloat(a.toFixed(this._precision())),
            null !== b.max && a > b.max ? b.max : null !== b.min && a < b.min ? b.min : a
        },
        _stop: function(a) {
            this.spinning && (clearTimeout(this.timer),
            clearTimeout(this.mousewheelTimer),
            this.counter = 0,
            this.spinning = !1,
            this._trigger("stop", a))
        },
        _setOption: function(a, e) {
            if ("culture" === a || "numberFormat" === a) {
                var d = this._parse(this.element.val());
                return this.options[a] = e,
                this.element.val(this._format(d)),
                void 0
            }
            "max" !== a && "min" !== a && "step" !== a || "string" != typeof e || (e = this._parse(e));
            "icons" === a && (this.buttons.first().find(".ui-icon").removeClass(this.options.icons.up).addClass(e.up),
            this.buttons.last().find(".ui-icon").removeClass(this.options.icons.down).addClass(e.down));
            this._super(a, e);
            "disabled" === a && (e ? (this.element.prop("disabled", !0),
            this.buttons.button("disable")) : (this.element.prop("disabled", !1),
            this.buttons.button("enable")))
        },
        _setOptions: g(function(a) {
            this._super(a);
            this._value(this.element.val())
        }),
        _parse: function(a) {
            return "string" == typeof a && "" !== a && (a = window.Globalize && this.options.numberFormat ? Globalize.parseFloat(a, 10, this.options.culture) : +a),
            "" === a || isNaN(a) ? null : a
        },
        _format: function(a) {
            return "" === a ? "" : window.Globalize && this.options.numberFormat ? Globalize.format(a, this.options.numberFormat, this.options.culture) : a
        },
        _refresh: function() {
            this.element.attr({
                "aria-valuemin": this.options.min,
                "aria-valuemax": this.options.max,
                "aria-valuenow": this._parse(this.element.val())
            })
        },
        _value: function(a, e) {
            var d;
            "" !== a && (d = this._parse(a),
            null !== d && (e || (d = this._adjustValue(d)),
            a = this._format(d)));
            this.element.val(a);
            this._refresh()
        },
        _destroy: function() {
            this.element.removeClass("ui-spinner-input").prop("disabled", !1).removeAttr("autocomplete").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow");
            this.uiSpinner.replaceWith(this.element)
        },
        stepUp: g(function(a) {
            this._stepUp(a)
        }),
        _stepUp: function(a) {
            this._start() && (this._spin((a || 1) * this.options.step),
            this._stop())
        },
        stepDown: g(function(a) {
            this._stepDown(a)
        }),
        _stepDown: function(a) {
            this._start() && (this._spin((a || 1) * -this.options.step),
            this._stop())
        },
        pageUp: g(function(a) {
            this._stepUp((a || 1) * this.options.page)
        }),
        pageDown: g(function(a) {
            this._stepDown((a || 1) * this.options.page)
        }),
        value: function(a) {
            return arguments.length ? (g(this._value).call(this, a),
            void 0) : this._parse(this.element.val())
        },
        widget: function() {
            return this.uiSpinner
        }
    })
}
)(jQuery);
(function(a, g) {
    function f(a) {
        return 1 < a.hash.length && decodeURIComponent(a.href.replace(d, "")) === decodeURIComponent(location.href.replace(d, ""))
    }
    var e = 0
      , d = /#.*$/;
    a.widget("ui.tabs", {
        version: "1.10.3",
        delay: 300,
        options: {
            active: null,
            collapsible: !1,
            event: "click",
            heightStyle: "content",
            hide: null,
            show: null,
            activate: null,
            beforeActivate: null,
            beforeLoad: null,
            load: null
        },
        _create: function() {
            var b = this
              , c = this.options;
            this.running = !1;
            this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all").toggleClass("ui-tabs-collapsible", c.collapsible).delegate(".ui-tabs-nav > li", "mousedown" + this.eventNamespace, function(b) {
                a(this).is(".ui-state-disabled") && b.preventDefault()
            }).delegate(".ui-tabs-anchor", "focus" + this.eventNamespace, function() {
                a(this).closest("li").is(".ui-state-disabled") && this.blur()
            });
            this._processTabs();
            c.active = this._initialActive();
            a.isArray(c.disabled) && (c.disabled = a.unique(c.disabled.concat(a.map(this.tabs.filter(".ui-state-disabled"), function(a) {
                return b.tabs.index(a)
            }))).sort());
            this.active = !1 !== this.options.active && this.anchors.length ? this._findActive(c.active) : a();
            this._refresh();
            this.active.length && this.load(c.active)
        },
        _initialActive: function() {
            var b = this.options.active
              , c = this.options.collapsible
              , d = location.hash.substring(1);
            return null === b && (d && this.tabs.each(function(c, e) {
                return a(e).attr("aria-controls") === d ? (b = c,
                !1) : void 0
            }),
            null === b && (b = this.tabs.index(this.tabs.filter(".ui-tabs-active"))),
            (null === b || -1 === b) && (b = this.tabs.length ? 0 : !1)),
            !1 !== b && (b = this.tabs.index(this.tabs.eq(b)),
            -1 === b && (b = c ? !1 : 0)),
            !c && !1 === b && this.anchors.length && (b = 0),
            b
        },
        _getCreateEventData: function() {
            return {
                tab: this.active,
                panel: this.active.length ? this._getPanelForTab(this.active) : a()
            }
        },
        _tabKeydown: function(b) {
            var c = a(this.document[0].activeElement).closest("li")
              , d = this.tabs.index(c)
              , e = !0;
            if (!this._handlePageNav(b)) {
                switch (b.keyCode) {
                case a.ui.keyCode.RIGHT:
                case a.ui.keyCode.DOWN:
                    d++;
                    break;
                case a.ui.keyCode.UP:
                case a.ui.keyCode.LEFT:
                    e = !1;
                    d--;
                    break;
                case a.ui.keyCode.END:
                    d = this.anchors.length - 1;
                    break;
                case a.ui.keyCode.HOME:
                    d = 0;
                    break;
                case a.ui.keyCode.SPACE:
                    return b.preventDefault(),
                    clearTimeout(this.activating),
                    this._activate(d),
                    void 0;
                case a.ui.keyCode.ENTER:
                    return b.preventDefault(),
                    clearTimeout(this.activating),
                    this._activate(d === this.options.active ? !1 : d),
                    void 0;
                default:
                    return
                }
                b.preventDefault();
                clearTimeout(this.activating);
                d = this._focusNextTab(d, e);
                b.ctrlKey || (c.attr("aria-selected", "false"),
                this.tabs.eq(d).attr("aria-selected", "true"),
                this.activating = this._delay(function() {
                    this.option("active", d)
                }, this.delay))
            }
        },
        _panelKeydown: function(b) {
            this._handlePageNav(b) || b.ctrlKey && b.keyCode === a.ui.keyCode.UP && (b.preventDefault(),
            this.active.focus())
        },
        _handlePageNav: function(b) {
            return b.altKey && b.keyCode === a.ui.keyCode.PAGE_UP ? (this._activate(this._focusNextTab(this.options.active - 1, !1)),
            !0) : b.altKey && b.keyCode === a.ui.keyCode.PAGE_DOWN ? (this._activate(this._focusNextTab(this.options.active + 1, !0)),
            !0) : void 0
        },
        _findNextTab: function(b, c) {
            for (var d = this.tabs.length - 1; -1 !== a.inArray((b > d && (b = 0),
            0 > b && (b = d),
            b), this.options.disabled); )
                b = c ? b + 1 : b - 1;
            return b
        },
        _focusNextTab: function(a, c) {
            return a = this._findNextTab(a, c),
            this.tabs.eq(a).focus(),
            a
        },
        _setOption: function(a, c) {
            return "active" === a ? (this._activate(c),
            void 0) : "disabled" === a ? (this._setupDisabled(c),
            void 0) : (this._super(a, c),
            "collapsible" === a && (this.element.toggleClass("ui-tabs-collapsible", c),
            c || !1 !== this.options.active || this._activate(0)),
            "event" === a && this._setupEvents(c),
            "heightStyle" === a && this._setupHeightStyle(c),
            void 0)
        },
        _tabId: function(a) {
            return a.attr("aria-controls") || "ui-tabs-" + ++e
        },
        _sanitizeSelector: function(a) {
            return a ? a.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g, "\\$&") : ""
        },
        refresh: function() {
            var b = this.options
              , c = this.tablist.children(":has(a[href])");
            b.disabled = a.map(c.filter(".ui-state-disabled"), function(a) {
                return c.index(a)
            });
            this._processTabs();
            !1 !== b.active && this.anchors.length ? this.active.length && !a.contains(this.tablist[0], this.active[0]) ? this.tabs.length === b.disabled.length ? (b.active = !1,
            this.active = a()) : this._activate(this._findNextTab(Math.max(0, b.active - 1), !1)) : b.active = this.tabs.index(this.active) : (b.active = !1,
            this.active = a());
            this._refresh()
        },
        _refresh: function() {
            this._setupDisabled(this.options.disabled);
            this._setupEvents(this.options.event);
            this._setupHeightStyle(this.options.heightStyle);
            this.tabs.not(this.active).attr({
                "aria-selected": "false",
                tabIndex: -1
            });
            this.panels.not(this._getPanelForTab(this.active)).hide().attr({
                "aria-expanded": "false",
                "aria-hidden": "true"
            });
            this.active.length ? (this.active.addClass("ui-tabs-active ui-state-active").attr({
                "aria-selected": "true",
                tabIndex: 0
            }),
            this._getPanelForTab(this.active).show().attr({
                "aria-expanded": "true",
                "aria-hidden": "false"
            })) : this.tabs.eq(0).attr("tabIndex", 0)
        },
        _processTabs: function() {
            var b = this;
            this.tablist = this._getList().addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").attr("role", "tablist");
            this.tabs = this.tablist.find("> li:has(a[href])").addClass("ui-state-default ui-corner-top").attr({
                role: "tab",
                tabIndex: -1
            });
            this.anchors = this.tabs.map(function() {
                return a("a", this)[0]
            }).addClass("ui-tabs-anchor").attr({
                role: "presentation",
                tabIndex: -1
            });
            this.panels = a();
            this.anchors.each(function(c, d) {
                var e, g, n, q = a(d).uniqueId().attr("id"), p = a(d).closest("li"), r = p.attr("aria-controls");
                f(d) ? (e = d.hash,
                g = b.element.find(b._sanitizeSelector(e))) : (n = b._tabId(p),
                e = "#" + n,
                g = b.element.find(e),
                g.length || (g = b._createPanel(n),
                g.insertAfter(b.panels[c - 1] || b.tablist)),
                g.attr("aria-live", "polite"));
                g.length && (b.panels = b.panels.add(g));
                r && p.data("ui-tabs-aria-controls", r);
                p.attr({
                    "aria-controls": e.substring(1),
                    "aria-labelledby": q
                });
                g.attr("aria-labelledby", q)
            });
            this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").attr("role", "tabpanel")
        },
        _getList: function() {
            return this.element.find("ol,ul").eq(0)
        },
        _createPanel: function(b) {
            return a("<div>").attr("id", b).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").data("ui-tabs-destroy", !0)
        },
        _setupDisabled: function(b) {
            a.isArray(b) && (b.length ? b.length === this.anchors.length && (b = !0) : b = !1);
            for (var c, d = 0; c = this.tabs[d]; d++)
                !0 === b || -1 !== a.inArray(d, b) ? a(c).addClass("ui-state-disabled").attr("aria-disabled", "true") : a(c).removeClass("ui-state-disabled").removeAttr("aria-disabled");
            this.options.disabled = b
        },
        _setupEvents: function(b) {
            var c = {
                click: function(a) {
                    a.preventDefault()
                }
            };
            b && a.each(b.split(" "), function(a, b) {
                c[b] = "_eventHandler"
            });
            this._off(this.anchors.add(this.tabs).add(this.panels));
            this._on(this.anchors, c);
            this._on(this.tabs, {
                keydown: "_tabKeydown"
            });
            this._on(this.panels, {
                keydown: "_panelKeydown"
            });
            this._focusable(this.tabs);
            this._hoverable(this.tabs)
        },
        _setupHeightStyle: function(b) {
            var c, d = this.element.parent();
            "fill" === b ? (c = d.height(),
            c -= this.element.outerHeight() - this.element.height(),
            this.element.siblings(":visible").each(function() {
                var b = a(this)
                  , d = b.css("position");
                "absolute" !== d && "fixed" !== d && (c -= b.outerHeight(!0))
            }),
            this.element.children().not(this.panels).each(function() {
                c -= a(this).outerHeight(!0)
            }),
            this.panels.each(function() {
                a(this).height(Math.max(0, c - a(this).innerHeight() + a(this).height()))
            }).css("overflow", "auto")) : "auto" === b && (c = 0,
            this.panels.each(function() {
                c = Math.max(c, a(this).height("").height())
            }).height(c))
        },
        _eventHandler: function(b) {
            var c = this.options
              , d = this.active
              , e = a(b.currentTarget).closest("li")
              , f = e[0] === d[0]
              , g = f && c.collapsible
              , q = g ? a() : this._getPanelForTab(e)
              , p = d.length ? this._getPanelForTab(d) : a()
              , d = {
                oldTab: d,
                oldPanel: p,
                newTab: g ? a() : e,
                newPanel: q
            };
            b.preventDefault();
            e.hasClass("ui-state-disabled") || e.hasClass("ui-tabs-loading") || this.running || f && !c.collapsible || !1 === this._trigger("beforeActivate", b, d) || (c.active = g ? !1 : this.tabs.index(e),
            this.active = f ? a() : e,
            this.xhr && this.xhr.abort(),
            p.length || q.length || a.error("jQuery UI Tabs: Mismatching fragment identifier."),
            q.length && this.load(this.tabs.index(e), b),
            this._toggle(b, d))
        },
        _toggle: function(b, c) {
            function d() {
                f.running = !1;
                f._trigger("activate", b, c)
            }
            function e() {
                c.newTab.closest("li").addClass("ui-tabs-active ui-state-active");
                g.length && f.options.show ? f._show(g, f.options.show, d) : (g.show(),
                d())
            }
            var f = this
              , g = c.newPanel
              , q = c.oldPanel;
            this.running = !0;
            q.length && this.options.hide ? this._hide(q, this.options.hide, function() {
                c.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active");
                e()
            }) : (c.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"),
            q.hide(),
            e());
            q.attr({
                "aria-expanded": "false",
                "aria-hidden": "true"
            });
            c.oldTab.attr("aria-selected", "false");
            g.length && q.length ? c.oldTab.attr("tabIndex", -1) : g.length && this.tabs.filter(function() {
                return 0 === a(this).attr("tabIndex")
            }).attr("tabIndex", -1);
            g.attr({
                "aria-expanded": "true",
                "aria-hidden": "false"
            });
            c.newTab.attr({
                "aria-selected": "true",
                tabIndex: 0
            })
        },
        _activate: function(b) {
            var c;
            b = this._findActive(b);
            b[0] !== this.active[0] && (b.length || (b = this.active),
            c = b.find(".ui-tabs-anchor")[0],
            this._eventHandler({
                target: c,
                currentTarget: c,
                preventDefault: a.noop
            }))
        },
        _findActive: function(b) {
            return !1 === b ? a() : this.tabs.eq(b)
        },
        _getIndex: function(a) {
            return "string" == typeof a && (a = this.anchors.index(this.anchors.filter("[href$='" + a + "']"))),
            a
        },
        _destroy: function() {
            this.xhr && this.xhr.abort();
            this.element.removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible");
            this.tablist.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").removeAttr("role");
            this.anchors.removeClass("ui-tabs-anchor").removeAttr("role").removeAttr("tabIndex").removeUniqueId();
            this.tabs.add(this.panels).each(function() {
                a.data(this, "ui-tabs-destroy") ? a(this).remove() : a(this).removeClass("ui-state-default ui-state-active ui-state-disabled ui-corner-top ui-corner-bottom ui-widget-content ui-tabs-active ui-tabs-panel").removeAttr("tabIndex").removeAttr("aria-live").removeAttr("aria-busy").removeAttr("aria-selected").removeAttr("aria-labelledby").removeAttr("aria-hidden").removeAttr("aria-expanded").removeAttr("role")
            });
            this.tabs.each(function() {
                var b = a(this)
                  , c = b.data("ui-tabs-aria-controls");
                c ? b.attr("aria-controls", c).removeData("ui-tabs-aria-controls") : b.removeAttr("aria-controls")
            });
            this.panels.show();
            "content" !== this.options.heightStyle && this.panels.css("height", "")
        },
        enable: function(b) {
            var c = this.options.disabled;
            !1 !== c && (b === g ? c = !1 : (b = this._getIndex(b),
            c = a.isArray(c) ? a.map(c, function(a) {
                return a !== b ? a : null
            }) : a.map(this.tabs, function(a, c) {
                return c !== b ? c : null
            })),
            this._setupDisabled(c))
        },
        disable: function(b) {
            var c = this.options.disabled;
            if (!0 !== c) {
                if (b === g)
                    c = !0;
                else {
                    if (b = this._getIndex(b),
                    -1 !== a.inArray(b, c))
                        return;
                    c = a.isArray(c) ? a.merge([b], c).sort() : [b]
                }
                this._setupDisabled(c)
            }
        },
        load: function(b, c) {
            b = this._getIndex(b);
            var d = this
              , e = this.tabs.eq(b)
              , g = e.find(".ui-tabs-anchor")
              , n = this._getPanelForTab(e)
              , q = {
                tab: e,
                panel: n
            };
            f(g[0]) || (this.xhr = a.ajax(this._ajaxSettings(g, c, q)),
            this.xhr && "canceled" !== this.xhr.statusText && (e.addClass("ui-tabs-loading"),
            n.attr("aria-busy", "true"),
            this.xhr.success(function(a) {
                setTimeout(function() {
                    n.html(a);
                    d._trigger("load", c, q)
                }, 1)
            }).complete(function(a, b) {
                setTimeout(function() {
                    "abort" === b && d.panels.stop(!1, !0);
                    e.removeClass("ui-tabs-loading");
                    n.removeAttr("aria-busy");
                    a === d.xhr && delete d.xhr
                }, 1)
            })))
        },
        _ajaxSettings: function(b, c, d) {
            var e = this;
            return {
                url: b.attr("href"),
                beforeSend: function(b, f) {
                    return e._trigger("beforeLoad", c, a.extend({
                        jqXHR: b,
                        ajaxSettings: f
                    }, d))
                }
            }
        },
        _getPanelForTab: function(b) {
            b = a(b).attr("aria-controls");
            return this.element.find(this._sanitizeSelector("#" + b))
        }
    })
}
)(jQuery);
(function(a) {
    function g(d, b) {
        var c = (d.attr("aria-describedby") || "").split(/\s+/);
        c.push(b);
        d.data("ui-tooltip-id", b).attr("aria-describedby", a.trim(c.join(" ")))
    }
    function f(d) {
        var b = d.data("ui-tooltip-id")
          , c = (d.attr("aria-describedby") || "").split(/\s+/)
          , b = a.inArray(b, c);
        -1 !== b && c.splice(b, 1);
        d.removeData("ui-tooltip-id");
        (c = a.trim(c.join(" "))) ? d.attr("aria-describedby", c) : d.removeAttr("aria-describedby")
    }
    var e = 0;
    a.widget("ui.tooltip", {
        version: "1.10.3",
        options: {
            content: function() {
                var d = a(this).attr("title") || "";
                return a("<a>").text(d).html()
            },
            hide: !0,
            items: "[title]:not([disabled])",
            position: {
                my: "left top+15",
                at: "left bottom",
                collision: "flipfit flip"
            },
            show: !0,
            tooltipClass: null,
            track: !1,
            close: null,
            open: null
        },
        _create: function() {
            this._on({
                mouseover: "open",
                focusin: "open"
            });
            this.tooltips = {};
            this.parents = {};
            this.options.disabled && this._disable()
        },
        _setOption: function(d, b) {
            var c = this;
            return "disabled" === d ? (this[b ? "_disable" : "_enable"](),
            this.options[d] = b,
            void 0) : (this._super(d, b),
            "content" === d && a.each(this.tooltips, function(a, b) {
                c._updateContent(b)
            }),
            void 0)
        },
        _disable: function() {
            var d = this;
            a.each(this.tooltips, function(b, c) {
                var e = a.Event("blur");
                e.target = e.currentTarget = c[0];
                d.close(e, !0)
            });
            this.element.find(this.options.items).addBack().each(function() {
                var b = a(this);
                b.is("[title]") && b.data("ui-tooltip-title", b.attr("title")).attr("title", "")
            })
        },
        _enable: function() {
            this.element.find(this.options.items).addBack().each(function() {
                var d = a(this);
                d.data("ui-tooltip-title") && d.attr("title", d.data("ui-tooltip-title"))
            })
        },
        open: function(d) {
            var b = this
              , c = a(d ? d.target : this.element).closest(this.options.items);
            c.length && !c.data("ui-tooltip-id") && (c.attr("title") && c.data("ui-tooltip-title", c.attr("title")),
            c.data("ui-tooltip-open", !0),
            d && "mouseover" === d.type && c.parents().each(function() {
                var c, d = a(this);
                d.data("ui-tooltip-open") && (c = a.Event("blur"),
                c.target = c.currentTarget = this,
                b.close(c, !0));
                d.attr("title") && (d.uniqueId(),
                b.parents[this.id] = {
                    element: this,
                    title: d.attr("title")
                },
                d.attr("title", ""))
            }),
            this._updateContent(c, d))
        },
        _updateContent: function(a, b) {
            var c, e = this.options.content, f = this, g = b ? b.type : null;
            return "string" == typeof e ? this._open(b, a, e) : (c = e.call(a[0], function(c) {
                a.data("ui-tooltip-open") && f._delay(function() {
                    b && (b.type = g);
                    this._open(b, a, c)
                })
            }),
            c && this._open(b, a, c),
            void 0)
        },
        _open: function(d, b, c) {
            function e(a) {
                n.of = a;
                f.is(":hidden") || f.position(n)
            }
            var f, l, n = a.extend({}, this.options.position);
            if (c) {
                if (f = this._find(b),
                f.length)
                    return f.find(".ui-tooltip-content").html(c),
                    void 0;
                b.is("[title]") && (d && "mouseover" === d.type ? b.attr("title", "") : b.removeAttr("title"));
                f = this._tooltip(b);
                g(b, f.attr("id"));
                f.find(".ui-tooltip-content").html(c);
                this.options.track && d && /^mouse/.test(d.type) ? (this._on(this.document, {
                    mousemove: e
                }),
                e(d)) : f.position(a.extend({
                    of: b
                }, this.options.position));
                f.hide();
                this._show(f, this.options.show);
                this.options.show && this.options.show.delay && (l = this.delayedShow = setInterval(function() {
                    f.is(":visible") && (e(n.of),
                    clearInterval(l))
                }, a.fx.interval));
                this._trigger("open", d, {
                    tooltip: f
                });
                c = {
                    keyup: function(c) {
                        c.keyCode === a.ui.keyCode.ESCAPE && (c = a.Event(c),
                        c.currentTarget = b[0],
                        this.close(c, !0))
                    },
                    remove: function() {
                        this._removeTooltip(f)
                    }
                };
                d && "mouseover" !== d.type || (c.mouseleave = "close");
                d && "focusin" !== d.type || (c.focusout = "close");
                this._on(!0, b, c)
            }
        },
        close: function(d) {
            var b = this
              , c = a(d ? d.currentTarget : this.element)
              , e = this._find(c);
            this.closing || (clearInterval(this.delayedShow),
            c.data("ui-tooltip-title") && c.attr("title", c.data("ui-tooltip-title")),
            f(c),
            e.stop(!0),
            this._hide(e, this.options.hide, function() {
                b._removeTooltip(a(this))
            }),
            c.removeData("ui-tooltip-open"),
            this._off(c, "mouseleave focusout keyup"),
            c[0] !== this.element[0] && this._off(c, "remove"),
            this._off(this.document, "mousemove"),
            d && "mouseleave" === d.type && a.each(this.parents, function(c, d) {
                a(d.element).attr("title", d.title);
                delete b.parents[c]
            }),
            this.closing = !0,
            this._trigger("close", d, {
                tooltip: e
            }),
            this.closing = !1)
        },
        _tooltip: function(d) {
            var b = "ui-tooltip-" + e++
              , c = a("<div>").attr({
                id: b,
                role: "tooltip"
            }).addClass("ui-tooltip ui-widget ui-corner-all ui-widget-content " + (this.options.tooltipClass || ""));
            return a("<div>").addClass("ui-tooltip-content").appendTo(c),
            c.appendTo(this.document[0].body),
            this.tooltips[b] = d,
            c
        },
        _find: function(d) {
            return (d = d.data("ui-tooltip-id")) ? a("#" + d) : a()
        },
        _removeTooltip: function(a) {
            a.remove();
            delete this.tooltips[a.attr("id")]
        },
        _destroy: function() {
            var d = this;
            a.each(this.tooltips, function(b, c) {
                var e = a.Event("blur");
                e.target = e.currentTarget = c[0];
                d.close(e, !0);
                a("#" + b).remove();
                c.data("ui-tooltip-title") && (c.attr("title", c.data("ui-tooltip-title")),
                c.removeData("ui-tooltip-title"))
            })
        }
    })
}
)(jQuery);
(function(a) {
    "function" === typeof define && define.amd ? define(["jquery"], a) : a(jQuery)
}
)(function(a) {
    function g(a) {
        if (d.raw)
            return a;
        try {
            return decodeURIComponent(a.replace(e, " "))
        } catch (c) {}
    }
    function f(a) {
        0 === a.indexOf('"') && (a = a.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\"));
        a = g(a);
        try {
            return d.json ? JSON.parse(a) : a
        } catch (c) {}
    }
    var e = /\+/g
      , d = a.cookie = function(b, c, e) {
        if (void 0 !== c) {
            e = a.extend({}, d.defaults, e);
            if ("number" === typeof e.expires) {
                var m = e.expires
                  , l = e.expires = new Date;
                l.setDate(l.getDate() + m)
            }
            c = d.json ? JSON.stringify(c) : String(c);
            return document.cookie = [d.raw ? b : encodeURIComponent(b), "=", d.raw ? c : encodeURIComponent(c), e.expires ? "; expires=" + e.expires.toUTCString() : "", e.path ? "; path=" + e.path : "", e.domain ? "; domain=" + e.domain : "", e.secure ? "; secure" : ""].join("")
        }
        c = b ? void 0 : {};
        e = document.cookie ? document.cookie.split("; ") : [];
        m = 0;
        for (l = e.length; m < l; m++) {
            var n = e[m].split("=")
              , q = g(n.shift())
              , n = n.join("=");
            if (b && b === q) {
                c = f(n);
                break
            }
            b || void 0 === (n = f(n)) || (c[q] = n)
        }
        return c
    }
    ;
    d.defaults = {};
    a.removeCookie = function(b, c) {
        return void 0 !== a.cookie(b) ? (a.cookie(b, "", a.extend({}, c, {
            expires: -1
        })),
        !0) : !1
    }
});
(function(a) {
    function g() {
        function d(a) {
            a = 1E12 > a ? c ? performance.now() + performance.timing.navigationStart : b() : a || b();
            1E3 <= a - g && (e._updateTargets(),
            g = a);
            f(d)
        }
        this.regional = [];
        this.regional[""] = {
            labels: "Years Months Weeks Days Hours Minutes Seconds".split(" "),
            labels1: "Year Month Week Day Hour Minute Second".split(" "),
            compactLabels: ["y", "m", "w", "d"],
            whichLabels: null,
            digits: "0123456789".split(""),
            timeSeparator: ":",
            isRTL: !1
        };
        this._defaults = {
            until: null,
            since: null,
            timezone: null,
            serverSync: null,
            format: "dHMS",
            layout: "",
            compact: !1,
            significant: 0,
            description: "",
            expiryUrl: "",
            expiryText: "",
            alwaysExpire: !1,
            onExpiry: null,
            onTick: null,
            tickInterval: 1
        };
        a.extend(this._defaults, this.regional[""]);
        this._serverSyncs = [];
        var b = "function" == typeof Date.now ? Date.now : function() {
            return (new Date).getTime()
        }
          , c = window.performance && "function" == typeof window.performance.now
          , f = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || null
          , g = 0;
        !f || a.noRequestAnimationFrame ? (a.noRequestAnimationFrame = null,
        setInterval(function() {
            e._updateTargets()
        }, 980)) : (g = window.animationStartTime || window.webkitAnimationStartTime || window.mozAnimationStartTime || window.oAnimationStartTime || window.msAnimationStartTime || b(),
        f(d))
    }
    a.extend(g.prototype, {
        markerClassName: "hasCountdown",
        propertyName: "countdown",
        _rtlClass: "countdown_rtl",
        _sectionClass: "countdown_section",
        _amountClass: "countdown_amount",
        _rowClass: "countdown_row",
        _holdingClass: "countdown_holding",
        _showClass: "countdown_show",
        _descrClass: "countdown_descr",
        _timerTargets: [],
        setDefaults: function(d) {
            this._resetExtraLabels(this._defaults, d);
            a.extend(this._defaults, d || {})
        },
        UTCDate: function(a, b, c, e, f, g, n, q) {
            "object" == typeof b && b.constructor == Date && (q = b.getMilliseconds(),
            n = b.getSeconds(),
            g = b.getMinutes(),
            f = b.getHours(),
            e = b.getDate(),
            c = b.getMonth(),
            b = b.getFullYear());
            var p = new Date;
            p.setUTCFullYear(b);
            p.setUTCDate(1);
            p.setUTCMonth(c || 0);
            p.setUTCDate(e || 1);
            p.setUTCHours(f || 0);
            p.setUTCMinutes((g || 0) - (30 > Math.abs(a) ? 60 * a : a));
            p.setUTCSeconds(n || 0);
            p.setUTCMilliseconds(q || 0);
            return p
        },
        periodsToSeconds: function(a) {
            return 31557600 * a[0] + 2629800 * a[1] + 604800 * a[2] + 86400 * a[3] + 3600 * a[4] + 60 * a[5] + a[6]
        },
        _attachPlugin: function(d, b) {
            d = a(d);
            if (!d.hasClass(this.markerClassName)) {
                var c = {
                    options: a.extend({}, this._defaults),
                    _periods: [0, 0, 0, 0, 0, 0, 0]
                };
                d.addClass(this.markerClassName).data(this.propertyName, c);
                this._optionPlugin(d, b)
            }
        },
        _addTarget: function(a) {
            this._hasTarget(a) || this._timerTargets.push(a)
        },
        _hasTarget: function(d) {
            return -1 < a.inArray(d, this._timerTargets)
        },
        _removeTarget: function(d) {
            this._timerTargets = a.map(this._timerTargets, function(a) {
                return a == d ? null : a
            })
        },
        _updateTargets: function() {
            for (var a = this._timerTargets.length - 1; 0 <= a; a--)
                this._updateCountdown(this._timerTargets[a])
        },
        _optionPlugin: function(d, b, c) {
            d = a(d);
            var e = d.data(this.propertyName);
            if (!b || "string" == typeof b && null == c) {
                var f = b;
                return (b = (e || {}).options) && f ? b[f] : b
            }
            d.hasClass(this.markerClassName) && (b = b || {},
            "string" == typeof b && (f = b,
            b = {},
            b[f] = c),
            b.layout && (b.layout = b.layout.replace(/&lt;/g, "<").replace(/&gt;/g, ">")),
            this._resetExtraLabels(e.options, b),
            c = e.options.timezone != b.timezone,
            a.extend(e.options, b),
            this._adjustSettings(d, e, null != b.until || null != b.since || c),
            b = new Date,
            (e._since && e._since < b || e._until && e._until > b) && this._addTarget(d[0]),
            this._updateCountdown(d, e))
        },
        _updateCountdown: function(d, b) {
            var c = a(d);
            if (b = b || c.data(this.propertyName)) {
                c.html(this._generateHTML(b)).toggleClass(this._rtlClass, b.options.isRTL);
                if (a.isFunction(b.options.onTick)) {
                    var e = "lap" != b._hold ? b._periods : this._calculatePeriods(b, b._show, b.options.significant, new Date);
                    1 != b.options.tickInterval && 0 != this.periodsToSeconds(e) % b.options.tickInterval || b.options.onTick.apply(d, [e])
                }
                if ("pause" != b._hold && (b._since ? b._now.getTime() < b._since.getTime() : b._now.getTime() >= b._until.getTime()) && !b._expiring) {
                    b._expiring = !0;
                    if (this._hasTarget(d) || b.options.alwaysExpire)
                        this._removeTarget(d),
                        a.isFunction(b.options.onExpiry) && b.options.onExpiry.apply(d, []),
                        b.options.expiryText && (e = b.options.layout,
                        b.options.layout = b.options.expiryText,
                        this._updateCountdown(d, b),
                        b.options.layout = e),
                        b.options.expiryUrl && (window.location = b.options.expiryUrl);
                    b._expiring = !1
                } else
                    "pause" == b._hold && this._removeTarget(d);
                c.data(this.propertyName, b)
            }
        },
        _resetExtraLabels: function(a, b) {
            var c = !1, e;
            for (e in b)
                if ("whichLabels" != e && e.match(/[Ll]abels/)) {
                    c = !0;
                    break
                }
            if (c)
                for (e in a)
                    e.match(/[Ll]abels[02-9]|compactLabels1/) && (a[e] = null)
        },
        _adjustSettings: function(d, b, c) {
            for (var e = 0, e = null, f = 0; f < this._serverSyncs.length; f++)
                if (this._serverSyncs[f][0] == b.options.serverSync) {
                    e = this._serverSyncs[f][1];
                    break
                }
            null != e ? (e = b.options.serverSync ? e : 0,
            d = new Date) : (e = a.isFunction(b.options.serverSync) ? b.options.serverSync.apply(d, []) : null,
            d = new Date,
            e = e ? d.getTime() - e.getTime() : 0,
            this._serverSyncs.push([b.options.serverSync, e]));
            f = b.options.timezone;
            f = null == f ? -d.getTimezoneOffset() : f;
            if (c || !c && null == b._until && null == b._since)
                b._since = b.options.since,
                null != b._since && (b._since = this.UTCDate(f, this._determineTime(b._since, null)),
                b._since && e && b._since.setMilliseconds(b._since.getMilliseconds() + e)),
                b._until = this.UTCDate(f, this._determineTime(b.options.until, d)),
                e && b._until.setMilliseconds(b._until.getMilliseconds() + e);
            b._show = this._determineShow(b)
        },
        _destroyPlugin: function(d) {
            d = a(d);
            d.hasClass(this.markerClassName) && (this._removeTarget(d[0]),
            d.removeClass(this.markerClassName).empty().removeData(this.propertyName))
        },
        _pausePlugin: function(a) {
            this._hold(a, "pause")
        },
        _lapPlugin: function(a) {
            this._hold(a, "lap")
        },
        _resumePlugin: function(a) {
            this._hold(a, null)
        },
        _hold: function(d, b) {
            var c = a.data(d, this.propertyName);
            if (c) {
                if ("pause" == c._hold && !b) {
                    c._periods = c._savePeriods;
                    var e = c._since ? "-" : "+";
                    c[c._since ? "_since" : "_until"] = this._determineTime(e + c._periods[0] + "y" + e + c._periods[1] + "o" + e + c._periods[2] + "w" + e + c._periods[3] + "d" + e + c._periods[4] + "h" + e + c._periods[5] + "m" + e + c._periods[6] + "s");
                    this._addTarget(d)
                }
                c._hold = b;
                c._savePeriods = "pause" == b ? c._periods : null;
                a.data(d, this.propertyName, c);
                this._updateCountdown(d, c)
            }
        },
        _getTimesPlugin: function(d) {
            return (d = a.data(d, this.propertyName)) ? "pause" == d._hold ? d._savePeriods : d._hold ? this._calculatePeriods(d, d._show, d.options.significant, new Date) : d._periods : null
        },
        _determineTime: function(a, b) {
            var c = function(a) {
                var b = new Date;
                b.setTime(b.getTime() + 1E3 * a);
                return b
            }
              , f = function(a) {
                a = a.toLowerCase();
                for (var b = new Date, c = b.getFullYear(), d = b.getMonth(), f = b.getDate(), g = b.getHours(), h = b.getMinutes(), b = b.getSeconds(), u = /([+-]?[0-9]+)\s*(s|m|h|d|w|o|y)?/g, v = u.exec(a); v; ) {
                    switch (v[2] || "s") {
                    case "s":
                        b += parseInt(v[1], 10);
                        break;
                    case "m":
                        h += parseInt(v[1], 10);
                        break;
                    case "h":
                        g += parseInt(v[1], 10);
                        break;
                    case "d":
                        f += parseInt(v[1], 10);
                        break;
                    case "w":
                        f += 7 * parseInt(v[1], 10);
                        break;
                    case "o":
                        d += parseInt(v[1], 10);
                        f = Math.min(f, e._getDaysInMonth(c, d));
                        break;
                    case "y":
                        c += parseInt(v[1], 10),
                        f = Math.min(f, e._getDaysInMonth(c, d))
                    }
                    v = u.exec(a)
                }
                return new Date(c,d,f,g,h,b,0)
            };
            (c = null == a ? b : "string" == typeof a ? f(a) : "number" == typeof a ? c(a) : a) && c.setMilliseconds(0);
            return c
        },
        _getDaysInMonth: function(a, b) {
            return 32 - (new Date(a,b,32)).getDate()
        },
        _normalLabels: function(a) {
            return a
        },
        _generateHTML: function(d) {
            var b = this;
            d._periods = d._hold ? d._periods : this._calculatePeriods(d, d._show, d.options.significant, new Date);
            for (var c = !1, f = 0, g = d.options.significant, l = a.extend({}, d._show), n = 0; 6 >= n; n++)
                c |= "?" == d._show[n] && 0 < d._periods[n],
                l[n] = "?" != d._show[n] || c ? d._show[n] : null,
                f += l[n] ? 1 : 0,
                g -= 0 < d._periods[n] ? 1 : 0;
            for (var q = [!1, !1, !1, !1, !1, !1, !1], n = 6; 0 <= n; n--)
                d._show[n] && (d._periods[n] ? q[n] = !0 : (q[n] = 0 < g,
                g--));
            var p = d.options.compact ? d.options.compactLabels : d.options.labels
              , r = d.options.whichLabels || this._normalLabels
              , c = function(a) {
                var c = d.options["compactLabels" + r(d._periods[a])];
                return l[a] ? b._translateDigits(d, d._periods[a]) + (c ? c[a] : p[a]) + " " : ""
            }
              , g = function(a) {
                var c = d.options["labels" + r(d._periods[a])];
                return !d.options.significant && l[a] || d.options.significant && q[a] ? '<span class="' + e._sectionClass + '"><span class="' + e._amountClass + '">' + b._translateDigits(d, d._periods[a]) + "</span><br/>" + (c ? c[a] : p[a]) + "</span>" : ""
            };
            return d.options.layout ? this._buildLayout(d, l, d.options.layout, d.options.compact, d.options.significant, q) : (d.options.compact ? '<span class="' + this._rowClass + " " + this._amountClass + (d._hold ? " " + this._holdingClass : "") + '">' + c(0) + c(1) + c(2) + c(3) + (l[4] ? this._minDigits(d, d._periods[4], 2) : "") + (l[5] ? (l[4] ? d.options.timeSeparator : "") + this._minDigits(d, d._periods[5], 2) : "") + (l[6] ? (l[4] || l[5] ? d.options.timeSeparator : "") + this._minDigits(d, d._periods[6], 2) : "") : '<span class="' + this._rowClass + " " + this._showClass + (d.options.significant || f) + (d._hold ? " " + this._holdingClass : "") + '">' + g(0) + g(1) + g(2) + g(3) + g(4) + g(5) + g(6)) + "</span>" + (d.options.description ? '<span class="' + this._rowClass + " " + this._descrClass + '">' + d.options.description + "</span>" : "")
        },
        _buildLayout: function(d, b, c, e, f, g) {
            var n = d.options[e ? "compactLabels" : "labels"]
              , q = d.options.whichLabels || this._normalLabels
              , p = function(a) {
                return (d.options[(e ? "compactLabels" : "labels") + q(d._periods[a])] || n)[a]
            }
              , r = function(a, b) {
                return d.options.digits[Math.floor(a / b) % 10]
            }
              , p = {
                desc: d.options.description,
                sep: d.options.timeSeparator,
                yl: p(0),
                yn: this._minDigits(d, d._periods[0], 1),
                ynn: this._minDigits(d, d._periods[0], 2),
                ynnn: this._minDigits(d, d._periods[0], 3),
                y1: r(d._periods[0], 1),
                y10: r(d._periods[0], 10),
                y100: r(d._periods[0], 100),
                y1000: r(d._periods[0], 1E3),
                ol: p(1),
                on: this._minDigits(d, d._periods[1], 1),
                onn: this._minDigits(d, d._periods[1], 2),
                onnn: this._minDigits(d, d._periods[1], 3),
                o1: r(d._periods[1], 1),
                o10: r(d._periods[1], 10),
                o100: r(d._periods[1], 100),
                o1000: r(d._periods[1], 1E3),
                wl: p(2),
                wn: this._minDigits(d, d._periods[2], 1),
                wnn: this._minDigits(d, d._periods[2], 2),
                wnnn: this._minDigits(d, d._periods[2], 3),
                w1: r(d._periods[2], 1),
                w10: r(d._periods[2], 10),
                w100: r(d._periods[2], 100),
                w1000: r(d._periods[2], 1E3),
                dl: p(3),
                dn: this._minDigits(d, d._periods[3], 1),
                dnn: this._minDigits(d, d._periods[3], 2),
                dnnn: this._minDigits(d, d._periods[3], 3),
                d1: r(d._periods[3], 1),
                d10: r(d._periods[3], 10),
                d100: r(d._periods[3], 100),
                d1000: r(d._periods[3], 1E3),
                hl: p(4),
                hn: this._minDigits(d, d._periods[4], 1),
                hnn: this._minDigits(d, d._periods[4], 2),
                hnnn: this._minDigits(d, d._periods[4], 3),
                h1: r(d._periods[4], 1),
                h10: r(d._periods[4], 10),
                h100: r(d._periods[4], 100),
                h1000: r(d._periods[4], 1E3),
                ml: p(5),
                mn: this._minDigits(d, d._periods[5], 1),
                mnn: this._minDigits(d, d._periods[5], 2),
                mnnn: this._minDigits(d, d._periods[5], 3),
                m1: r(d._periods[5], 1),
                m10: r(d._periods[5], 10),
                m100: r(d._periods[5], 100),
                m1000: r(d._periods[5], 1E3),
                sl: p(6),
                sn: this._minDigits(d, d._periods[6], 1),
                snn: this._minDigits(d, d._periods[6], 2),
                snnn: this._minDigits(d, d._periods[6], 3),
                s1: r(d._periods[6], 1),
                s10: r(d._periods[6], 10),
                s100: r(d._periods[6], 100),
                s1000: r(d._periods[6], 1E3)
            }
              , s = c;
            for (c = 0; 6 >= c; c++)
                r = "yowdhms".charAt(c),
                s = s.replace(RegExp("\\{" + r + "<\\}([\\s\\S]*)\\{" + r + ">\\}", "g"), !f && b[c] || f && g[c] ? "$1" : "");
            a.each(p, function(a, b) {
                s = s.replace(RegExp("\\{" + a + "\\}", "g"), b)
            });
            return s
        },
        _minDigits: function(a, b, c) {
            b = "" + b;
            if (b.length >= c)
                return this._translateDigits(a, b);
            b = "0000000000" + b;
            return this._translateDigits(a, b.substr(b.length - c))
        },
        _translateDigits: function(a, b) {
            return ("" + b).replace(/[0-9]/g, function(b) {
                return a.options.digits[b]
            })
        },
        _determineShow: function(a) {
            a = a.options.format;
            var b = [];
            b[0] = a.match("y") ? "?" : a.match("Y") ? "!" : null;
            b[1] = a.match("o") ? "?" : a.match("O") ? "!" : null;
            b[2] = a.match("w") ? "?" : a.match("W") ? "!" : null;
            b[3] = a.match("d") ? "?" : a.match("D") ? "!" : null;
            b[4] = a.match("h") ? "?" : a.match("H") ? "!" : null;
            b[5] = a.match("m") ? "?" : a.match("M") ? "!" : null;
            b[6] = a.match("s") ? "?" : a.match("S") ? "!" : null;
            return b
        },
        _calculatePeriods: function(a, b, c, f) {
            a._now = f;
            a._now.setMilliseconds(0);
            var g = new Date(a._now.getTime());
            a._since ? f.getTime() < a._since.getTime() ? a._now = f = g : f = a._since : (g.setTime(a._until.getTime()),
            f.getTime() > a._until.getTime() && (a._now = f = g));
            var l = [0, 0, 0, 0, 0, 0, 0];
            if (b[0] || b[1]) {
                var n = e._getDaysInMonth(f.getFullYear(), f.getMonth())
                  , q = e._getDaysInMonth(g.getFullYear(), g.getMonth())
                  , q = g.getDate() == f.getDate() || g.getDate() >= Math.min(n, q) && f.getDate() >= Math.min(n, q)
                  , q = Math.max(0, 12 * (g.getFullYear() - f.getFullYear()) + g.getMonth() - f.getMonth() + (g.getDate() < f.getDate() && !q || q && 60 * (60 * g.getHours() + g.getMinutes()) + g.getSeconds() < 60 * (60 * f.getHours() + f.getMinutes()) + f.getSeconds() ? -1 : 0));
                l[0] = b[0] ? Math.floor(q / 12) : 0;
                l[1] = b[1] ? q - 12 * l[0] : 0;
                f = new Date(f.getTime());
                n = f.getDate() == n;
                q = e._getDaysInMonth(f.getFullYear() + l[0], f.getMonth() + l[1]);
                f.getDate() > q && f.setDate(q);
                f.setFullYear(f.getFullYear() + l[0]);
                f.setMonth(f.getMonth() + l[1]);
                n && f.setDate(q)
            }
            var p = Math.floor((g.getTime() - f.getTime()) / 1E3);
            f = function(a, c) {
                l[a] = b[a] ? Math.floor(p / c) : 0;
                p -= l[a] * c
            }
            ;
            f(2, 604800);
            f(3, 86400);
            f(4, 3600);
            f(5, 60);
            f(6, 1);
            if (0 < p && !a._since)
                for (a = [1, 12, 4.3482, 7, 24, 60, 60],
                f = 6,
                g = 1,
                n = 6; 0 <= n; n--)
                    b[n] && (l[f] >= g && (l[f] = 0,
                    p = 1),
                    0 < p && (l[n]++,
                    p = 0,
                    f = n,
                    g = 1)),
                    g *= a[n];
            if (c)
                for (n = 0; 6 >= n; n++)
                    c && l[n] ? c-- : c || (l[n] = 0);
            return l
        }
    });
    var f = ["getTimes"];
    a.fn.countdown = function(d) {
        var b = Array.prototype.slice.call(arguments, 1);
        return "option" == d && (0 == b.length || 1 == b.length && "string" == typeof b[0]) || -1 < a.inArray(d, f) ? e["_" + d + "Plugin"].apply(e, [this[0]].concat(b)) : this.each(function() {
            if ("string" == typeof d) {
                if (!e["_" + d + "Plugin"])
                    throw "Unknown command: " + d;
                e["_" + d + "Plugin"].apply(e, [this].concat(b))
            } else
                e._attachPlugin(this, d || {})
        })
    }
    ;
    var e = a.countdown = new g
}
)(jQuery);
window.Modernizr = function(a, g, f) {
    var e = {}, d = g.documentElement, b = g.createElement("modernizr"), b = b.style, c = {}.toString, h = " -webkit- -moz- -o- -ms- ".split(" "), m = {}, l = [], n = l.slice, q, p = function(a, b, c, e) {
        var f, h, m, l, n = g.createElement("div"), p = g.body, q = p || g.createElement("body");
        if (parseInt(c, 10))
            for (; c--; )
                m = g.createElement("div"),
                m.id = e ? e[c] : "modernizr" + (c + 1),
                n.appendChild(m);
        return f = ['&#173;<style id="smodernizr">', a, "</style>"].join(""),
        n.id = "modernizr",
        (p ? n : q).innerHTML += f,
        q.appendChild(n),
        p || (q.style.background = "",
        q.style.overflow = "hidden",
        l = d.style.overflow,
        d.style.overflow = "hidden",
        d.appendChild(q)),
        h = b(n, a),
        p ? n.parentNode.removeChild(n) : (q.parentNode.removeChild(q),
        d.style.overflow = l),
        !!h
    }, r = {}.hasOwnProperty, s;
    "undefined" !== typeof r && "undefined" !== typeof r.call ? s = function(a, b) {
        return r.call(a, b)
    }
    : s = function(a, b) {
        return b in a && "undefined" === typeof a.constructor.prototype[b]
    }
    ;
    Function.prototype.bind || (Function.prototype.bind = function(a) {
        var b = this;
        if ("function" != typeof b)
            throw new TypeError;
        var c = n.call(arguments, 1)
          , d = function() {
            if (this instanceof d) {
                var e = function() {};
                e.prototype = b.prototype;
                var e = new e
                  , f = b.apply(e, c.concat(n.call(arguments)));
                return Object(f) === f ? f : e
            }
            return b.apply(a, c.concat(n.call(arguments)))
        };
        return d
    }
    );
    m.touch = function() {
        var b;
        return "ontouchstart"in a || a.DocumentTouch && g instanceof DocumentTouch ? b = !0 : p(["@media (", h.join("touch-enabled),("), "modernizr){#modernizr{top:9px;position:absolute}}"].join(""), function(a) {
            b = 9 === a.offsetTop
        }),
        b
    }
    ;
    m.svg = function() {
        return !!g.createElementNS && !!g.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect
    }
    ;
    m.inlinesvg = function() {
        var a = g.createElement("div");
        return a.innerHTML = "<svg/>",
        "http://www.w3.org/2000/svg" == (a.firstChild && a.firstChild.namespaceURI)
    }
    ;
    m.svgclippaths = function() {
        return !!g.createElementNS && /SVGClipPath/.test(c.call(g.createElementNS("http://www.w3.org/2000/svg", "clipPath")))
    }
    ;
    for (var u in m)
        s(m, u) && (q = u.toLowerCase(),
        e[q] = m[u](),
        l.push((e[q] ? "" : "no-") + q));
    e.addTest = function(a, b) {
        if ("object" == typeof a)
            for (var c in a)
                s(a, c) && e.addTest(c, a[c]);
        else {
            a = a.toLowerCase();
            if (e[a] !== f)
                return e;
            b = "function" == typeof b ? b() : b;
            d.className += " " + (b ? "" : "no-") + a;
            e[a] = b
        }
        return e
    }
    ;
    b.cssText = "";
    return b = null,
    function(a, b) {
        function c() {
            var a = u.elements;
            return "string" == typeof a ? a.split(" ") : a
        }
        function d(a) {
            var b = r[a[p]];
            return b || (b = {},
            q++,
            a[p] = q,
            r[q] = b),
            b
        }
        function e(a, c, f) {
            c || (c = b);
            if (s)
                return c.createElement(a);
            f || (f = d(c));
            var g;
            return f.cache[a] ? g = f.cache[a].cloneNode() : l.test(a) ? g = (f.cache[a] = f.createElem(a)).cloneNode() : g = f.createElem(a),
            g.canHaveChildren && !m.test(a) ? f.frag.appendChild(g) : g
        }
        function f(a, b) {
            b.cache || (b.cache = {},
            b.createElem = a.createElement,
            b.createFrag = a.createDocumentFragment,
            b.frag = b.createFrag());
            a.createElement = function(c) {
                return u.shivMethods ? e(c, a, b) : b.createElem(c)
            }
            ;
            a.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + c().join().replace(/\w+/g, function(a) {
                return b.createElem(a),
                b.frag.createElement(a),
                'c("' + a + '")'
            }) + ");return n}")(u, b.frag)
        }
        function g(a) {
            a || (a = b);
            var c = d(a);
            if (u.shivCSS && !n && !c.hasCSS) {
                var e, h = a;
                e = h.createElement("p");
                h = h.getElementsByTagName("head")[0] || h.documentElement;
                e = (e.innerHTML = "x<style>article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}</style>",
                h.insertBefore(e.lastChild, h.firstChild));
                c.hasCSS = !!e
            }
            return s || f(a, c),
            a
        }
        var h = a.html5 || {}, m = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i, l = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i, n, p = "_html5shiv", q = 0, r = {}, s;
        (function() {
            try {
                var a = b.createElement("a");
                a.innerHTML = "<xyz></xyz>";
                n = "hidden"in a;
                var c;
                if (!(c = 1 == a.childNodes.length)) {
                    b.createElement("a");
                    var d = b.createDocumentFragment();
                    c = "undefined" == typeof d.cloneNode || "undefined" == typeof d.createDocumentFragment || "undefined" == typeof d.createElement
                }
                s = c
            } catch (e) {
                s = n = !0
            }
        }
        )();
        var u = {
            elements: h.elements || "abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",
            shivCSS: !1 !== h.shivCSS,
            supportsUnknownElements: s,
            shivMethods: !1 !== h.shivMethods,
            type: "default",
            shivDocument: g,
            createElement: e,
            createDocumentFragment: function(a, e) {
                a || (a = b);
                if (s)
                    return a.createDocumentFragment();
                e = e || d(a);
                for (var f = e.frag.cloneNode(), g = 0, h = c(), m = h.length; g < m; g++)
                    f.createElement(h[g]);
                return f
            }
        };
        a.html5 = u;
        g(b)
    }(this, g),
    e._version = "2.6.2",
    e._prefixes = h,
    e.mq = function(b) {
        var c = a.matchMedia || a.msMatchMedia;
        if (c)
            return c(b).matches;
        var d;
        return p("@media " + b + " { #modernizr { position: absolute; } }", function(b) {
            d = "absolute" == (a.getComputedStyle ? getComputedStyle(b, null) : b.currentStyle).position
        }),
        d
    }
    ,
    e.testStyles = p,
    d.className = d.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (" js " + l.join(" ")),
    e
}(this, this.document);
(function(a, g, f) {
    function e(a) {
        return "[object Function]" == s.call(a)
    }
    function d(a) {
        return "string" == typeof a
    }
    function b() {}
    function c(a) {
        return !a || "loaded" == a || "complete" == a || "uninitialized" == a
    }
    function h() {
        var a = u.shift();
        v = 1;
        a ? a.t ? p(function() {
            ("c" == a.t ? L.injectCss : L.injectJs)(a.s, 0, a.a, a.x, a.e, 1)
        }, 0) : (a(),
        h()) : v = 0
    }
    function m(a, b, d, e, f, m, l) {
        function n(d) {
            if (!s && c(q.readyState) && (x.r = s = 1,
            !v && h(),
            q.onload = q.onreadystatechange = null,
            d)) {
                "img" != a && p(function() {
                    C.removeChild(q)
                }, 50);
                for (var e in I[b])
                    I[b].hasOwnProperty(e) && I[b][e].onload()
            }
        }
        l = l || L.errorTimeout;
        var q = g.createElement(a)
          , s = 0
          , w = 0
          , x = {
            t: d,
            s: b,
            e: f,
            a: m,
            x: l
        };
        1 === I[b] && (w = 1,
        I[b] = []);
        "object" == a ? q.data = b : (q.src = b,
        q.type = a);
        q.width = q.height = "0";
        q.onerror = q.onload = q.onreadystatechange = function() {
            n.call(this, w)
        }
        ;
        u.splice(e, 0, x);
        "img" != a && (w || 2 === I[b] ? (C.insertBefore(q, B ? null : r),
        p(n, l)) : I[b].push(q))
    }
    function l(a, b, c, e, f) {
        return v = 0,
        b = b || "j",
        d(a) ? m("c" == b ? y : w, a, b, this.i++, c, e, f) : (u.splice(this.i++, 0, a),
        1 == u.length && h()),
        this
    }
    function n() {
        var a = L;
        return a.loader = {
            load: l,
            i: 0
        },
        a
    }
    var q = g.documentElement, p = a.setTimeout, r = g.getElementsByTagName("script")[0], s = {}.toString, u = [], v = 0, x = "MozAppearance"in q.style, B = x && !!g.createRange().compareNode, C = B ? q : r.parentNode, q = a.opera && "[object Opera]" == s.call(a.opera), q = !!g.attachEvent && !q, w = x ? "object" : q ? "script" : "img", y = q ? "script" : w, A = Array.isArray || function(a) {
        return "[object Array]" == s.call(a)
    }
    , N = [], I = {}, J = {
        timeout: function(a, b) {
            return b.length && (a.timeout = b[0]),
            a
        }
    }, F, L;
    L = function(a) {
        function c(a) {
            a = a.split("!");
            var b = N.length, d = a.pop(), e = a.length, d = {
                url: d,
                origUrl: d,
                prefixes: a
            }, f, g, h;
            for (g = 0; g < e; g++)
                h = a[g].split("="),
                (f = J[h.shift()]) && (d = f(d, h));
            for (g = 0; g < b; g++)
                d = N[g](d);
            return d
        }
        function g(a, b, d, h, m) {
            var l = c(a)
              , p = l.autoCallback;
            l.url.split(".").pop().split("?").shift();
            l.bypass || (b && (b = e(b) ? b : b[a] || b[h] || b[a.split("/").pop().split("?")[0]]),
            l.instead ? l.instead(a, b, d, h, m) : (I[l.url] ? l.noexec = !0 : I[l.url] = 1,
            d.load(l.url, l.forceCSS || !l.forceJS && "css" == l.url.split(".").pop().split("?").shift() ? "c" : f, l.noexec, l.attrs, l.timeout),
            (e(b) || e(p)) && d.load(function() {
                n();
                b && b(l.origUrl, m, h);
                p && p(l.origUrl, m, h);
                I[l.url] = 2
            })))
        }
        function h(a, c) {
            function f(a, b) {
                if (a)
                    if (d(a))
                        b || (n = function() {
                            var a = [].slice.call(arguments);
                            p.apply(this, a);
                            q()
                        }
                        ),
                        g(a, n, c, 0, m);
                    else {
                        if (Object(a) === a)
                            for (s in r = function() {
                                var b = 0, c;
                                for (c in a)
                                    a.hasOwnProperty(c) && b++;
                                return b
                            }(),
                            a)
                                a.hasOwnProperty(s) && (!b && !--r && (e(n) ? n = function() {
                                    var a = [].slice.call(arguments);
                                    p.apply(this, a);
                                    q()
                                }
                                : n[s] = function(a) {
                                    return function() {
                                        var b = [].slice.call(arguments);
                                        a && a.apply(this, b);
                                        q()
                                    }
                                }(p[s])),
                                g(a[s], n, c, s, m))
                    }
                else
                    !b && q()
            }
            var m = !!a.test, l = a.load || a.both, n = a.callback || b, p = n, q = a.complete || b, r, s;
            f(m ? a.yep : a.nope, !!l);
            l && f(l)
        }
        var m, l, p = this.yepnope.loader;
        if (d(a))
            g(a, 0, p, 0);
        else if (A(a))
            for (m = 0; m < a.length; m++)
                l = a[m],
                d(l) ? g(l, 0, p, 0) : A(l) ? L(l) : Object(l) === l && h(l, p);
        else
            Object(a) === a && h(a, p)
    }
    ;
    L.addPrefix = function(a, b) {
        J[a] = b
    }
    ;
    L.addFilter = function(a) {
        N.push(a)
    }
    ;
    L.errorTimeout = 1E4;
    null == g.readyState && g.addEventListener && (g.readyState = "loading",
    g.addEventListener("DOMContentLoaded", F = function() {
        g.removeEventListener("DOMContentLoaded", F, 0);
        g.readyState = "complete"
    }
    , 0));
    a.yepnope = n();
    a.yepnope.executeStack = h;
    a.yepnope.injectJs = function(a, d, e, f, m, l) {
        var n = g.createElement("script"), q, s;
        f = f || L.errorTimeout;
        n.src = a;
        for (s in e)
            n.setAttribute(s, e[s]);
        d = l ? h : d || b;
        n.onreadystatechange = n.onload = function() {
            !q && c(n.readyState) && (q = 1,
            d(),
            n.onload = n.onreadystatechange = null)
        }
        ;
        p(function() {
            q || (q = 1,
            d(1))
        }, f);
        m ? n.onload() : r.parentNode.insertBefore(n, r)
    }
    ;
    a.yepnope.injectCss = function(a, c, d, e, f, m) {
        e = g.createElement("link");
        var l;
        c = m ? h : c || b;
        e.href = a;
        e.rel = "stylesheet";
        e.type = "text/css";
        for (l in d)
            e.setAttribute(l, d[l]);
        f || (r.parentNode.insertBefore(e, r),
        p(c, 0))
    }
}
)(this, document);
Modernizr.load = function() {
    yepnope.apply(window, [].slice.call(arguments, 0))
}
;
Modernizr.addTest("ie8compat", function() {
    return !window.addEventListener && document.documentMode && 7 === document.documentMode
});
var libFuncName = null;
if ("undefined" == typeof jQuery && "undefined" == typeof Zepto && "function" == typeof $)
    libFuncName = $;
else if ("function" == typeof jQuery)
    libFuncName = jQuery;
else {
    if ("function" != typeof Zepto)
        throw new TypeError;
    libFuncName = Zepto
}
(function(a, g, f, e) {
    a("head").append('<meta class="foundation-mq-small">');
    a("head").append('<meta class="foundation-mq-medium">');
    a("head").append('<meta class="foundation-mq-large">');
    g.matchMedia = g.matchMedia || function(a, b) {
        var c, e = a.documentElement, f = e.firstElementChild || e.firstChild, g = a.createElement("body"), n = a.createElement("div");
        return n.id = "mq-test-1",
        n.style.cssText = "position:absolute;top:-100em",
        g.style.background = "none",
        g.appendChild(n),
        function(a) {
            return n.innerHTML = '&shy;<style media="' + a + '"> #mq-test-1 { width: 42px; }</style>',
            e.insertBefore(g, f),
            c = 42 === n.offsetWidth,
            e.removeChild(g),
            {
                matches: c,
                media: a
            }
        }
    }(f);
    Array.prototype.filter || (Array.prototype.filter = function(a, b) {
        if (null == this)
            throw new TypeError;
        var c = Object(this)
          , e = c.length >>> 0;
        if ("function" == typeof a) {
            for (var f = [], g = 0; g < e; g++)
                if (g in c) {
                    var n = c[g];
                    a && a.call(b, n, g, c) && f.push(n)
                }
            return f
        }
    }
    );
    Function.prototype.bind || (Function.prototype.bind = function(a) {
        if ("function" != typeof this)
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        var b = Array.prototype.slice.call(arguments, 1)
          , c = this
          , e = function() {}
          , f = function() {
            return c.apply(this instanceof e && a ? this : a, b.concat(Array.prototype.slice.call(arguments)))
        };
        return e.prototype = this.prototype,
        f.prototype = new e,
        f
    }
    );
    Array.prototype.indexOf || (Array.prototype.indexOf = function(a) {
        if (null == this)
            throw new TypeError;
        var b = Object(this)
          , c = b.length >>> 0;
        if (0 === c)
            return -1;
        var e = 0;
        1 < arguments.length && (e = Number(arguments[1]),
        e != e ? e = 0 : 0 != e && Infinity != e && -Infinity != e && (e = (0 < e || -1) * Math.floor(Math.abs(e))));
        if (e >= c)
            return -1;
        for (e = 0 <= e ? e : Math.max(c - Math.abs(e), 0); e < c; e++)
            if (e in b && b[e] === a)
                return e;
        return -1
    }
    );
    a.fn.stop = a.fn.stop || function() {
        return this
    }
    ;
    g.Foundation = {
        name: "Foundation",
        version: "4.3.2",
        cache: {},
        media_queries: {
            small: a(".foundation-mq-small").css("font-family").replace(/\'/g, ""),
            medium: a(".foundation-mq-medium").css("font-family").replace(/\'/g, ""),
            large: a(".foundation-mq-large").css("font-family").replace(/\'/g, "")
        },
        stylesheet: a("<style></style>").appendTo("head")[0].sheet,
        init: function(d, b, c, e, f, g) {
            c = [d, c, e, f];
            e = [];
            (g = g || !1) && (this.nc = g);
            this.rtl = /rtl/i.test(a("html").attr("dir"));
            this.scope = d || this.scope;
            if (b && "string" == typeof b && !/reflow/i.test(b)) {
                if (/off/i.test(b))
                    return this.off();
                d = b.split(" ");
                if (0 < d.length)
                    for (g = d.length - 1; 0 <= g; g--)
                        e.push(this.init_lib(d[g], c))
            } else {
                /reflow/i.test(b) && (c[1] = "reflow");
                for (var n in this.libs)
                    e.push(this.init_lib(n, c))
            }
            return "function" == typeof b && c.unshift(b),
            this.response_obj(e, c)
        },
        response_obj: function(a, b) {
            for (var c = 0, e = b.length; c < e; c++)
                if ("function" == typeof b[c])
                    return b[c]({
                        errors: a.filter(function(a) {
                            if ("string" == typeof a)
                                return a
                        })
                    });
            return a
        },
        init_lib: function(a, b) {
            return this.trap(function() {
                return this.libs.hasOwnProperty(a) ? (this.patch(this.libs[a]),
                this.libs[a].init.apply(this.libs[a], b)) : function() {}
            }
            .bind(this), a)
        },
        trap: function(a, b) {
            if (!this.nc)
                try {
                    return a()
                } catch (c) {
                    return this.error({
                        name: b,
                        message: "could not be initialized",
                        more: c.name + " " + c.message
                    })
                }
            return a()
        },
        patch: function(a) {
            this.fix_outer(a);
            a.scope = this.scope;
            a.rtl = this.rtl
        },
        inherit: function(a, b) {
            for (var c = b.split(" "), e = c.length - 1; 0 <= e; e--)
                this.lib_methods.hasOwnProperty(c[e]) && (this.libs[a.name][c[e]] = this.lib_methods[c[e]])
        },
        random_str: function(a) {
            var b = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
            a || (a = Math.floor(Math.random() * b.length));
            for (var c = "", e = 0; e < a; e++)
                c += b[Math.floor(Math.random() * b.length)];
            return c
        },
        libs: {},
        lib_methods: {
            set_data: function(a, b) {
                var c = [this.name, +new Date, Foundation.random_str(5)].join("-");
                return Foundation.cache[c] = b,
                a.attr("data-" + this.name + "-id", c),
                b
            },
            get_data: function(a) {
                return Foundation.cache[a.attr("data-" + this.name + "-id")]
            },
            remove_data: function(d) {
                d ? (delete Foundation.cache[d.attr("data-" + this.name + "-id")],
                d.attr("data-" + this.name + "-id", "")) : a("[data-" + this.name + "-id]").each(function() {
                    delete Foundation.cache[a(this).attr("data-" + this.name + "-id")];
                    a(this).attr("data-" + this.name + "-id", "")
                })
            },
            throttle: function(a, b) {
                var c = null;
                return function() {
                    var e = this
                      , f = arguments;
                    clearTimeout(c);
                    c = setTimeout(function() {
                        a.apply(e, f)
                    }, b)
                }
            },
            data_options: function(d) {
                var b = {}, c, e = (d.attr("data-options") || ":").split(";");
                for (d = e.length - 1; 0 <= d; d--)
                    c = e[d].split(":"),
                    /true/i.test(c[1]) && (c[1] = !0),
                    /false/i.test(c[1]) && (c[1] = !1),
                    !isNaN(c[1] - 0) && null !== c[1] && "" !== c[1] && !1 !== c[1] && !0 !== c[1] && (c[1] = parseInt(c[1], 10)),
                    2 === c.length && 0 < c[0].length && (b["string" == typeof c[0] ? a.trim(c[0]) : c[0]] = "string" == typeof c[1] ? a.trim(c[1]) : c[1]);
                return b
            },
            delay: function(a, b) {
                return setTimeout(a, b)
            },
            scrollTo: function(d, b, c) {
                if (!(0 > c)) {
                    var e = (b - a(g).scrollTop()) / c * 10;
                    this.scrollToTimerCache = setTimeout(function() {
                        isNaN(parseInt(e, 10)) || (g.scrollTo(0, a(g).scrollTop() + e),
                        this.scrollTo(d, b, c - 10))
                    }
                    .bind(this), 10)
                }
            },
            scrollLeft: function(a) {
                if (a.length)
                    return "scrollLeft"in a[0] ? a[0].scrollLeft : a[0].pageXOffset
            },
            empty: function(a) {
                if (a.length && 0 < a.length)
                    return !1;
                if (a.length && 0 === a.length)
                    return !0;
                for (var b in a)
                    if (hasOwnProperty.call(a, b))
                        return !1;
                return !0
            },
            addCustomRule: function(a, b) {
                b === e ? Foundation.stylesheet.insertRule(a, Foundation.stylesheet.cssRules.length) : Foundation.media_queries[b] !== e && Foundation.stylesheet.insertRule("@media " + Foundation.media_queries[b] + "{ " + a + " }")
            }
        },
        fix_outer: function(a) {
            a.outerHeight = function(a, c) {
                return "function" == typeof Zepto ? a.height() : "undefined" != typeof c ? a.outerHeight(c) : a.outerHeight()
            }
            ;
            a.outerWidth = function(a, c) {
                return "function" == typeof Zepto ? a.width() : "undefined" != typeof c ? a.outerWidth(c) : a.outerWidth()
            }
        },
        error: function(a) {
            return a.name + " " + a.message + "; " + a.more
        },
        off: function() {
            return a(this.scope).off(".fndtn"),
            a(g).off(".fndtn"),
            !0
        },
        zj: a
    };
    a.fn.foundation = function() {
        var a = Array.prototype.slice.call(arguments, 0);
        return this.each(function() {
            return Foundation.init.apply(Foundation, [this].concat(a)),
            this
        })
    }
}
)(libFuncName, this, this.document);
(function(a, g, f, e) {
    Foundation.libs.alerts = {
        name: "alerts",
        version: "4.3.2",
        settings: {
            animation: "fadeOut",
            speed: 300,
            callback: function() {}
        },
        init: function(d, b, c) {
            return this.scope = d || this.scope,
            Foundation.inherit(this, "data_options"),
            "object" == typeof b && a.extend(!0, this.settings, b),
            "string" != typeof b ? (this.settings.init || this.events(),
            this.settings.init) : this[b].call(this, c)
        },
        events: function() {
            var d = this;
            a(this.scope).on("click.fndtn.alerts", "[data-alert] a.close", function(b) {
                var c = a(this).closest("[data-alert]")
                  , e = a.extend({}, d.settings, d.data_options(c));
                b.preventDefault();
                c[e.animation](e.speed, function() {
                    a(this).remove();
                    e.callback()
                })
            });
            this.settings.init = !0
        },
        off: function() {
            a(this.scope).off(".fndtn.alerts")
        },
        reflow: function() {}
    }
}
)(Foundation.zj, this, this.document);
(function(a, g, f, e) {
    Foundation.libs.clearing = {
        name: "clearing",
        version: "4.3.2",
        settings: {
            templates: {
                viewing: '<a href="#" class="clearing-close">&times;</a><div class="visible-img" style="display: none"><img src="//:0"><p class="clearing-caption"></p><a href="#" class="clearing-main-prev"><span></span></a><a href="#" class="clearing-main-next"><span></span></a></div>'
            },
            close_selectors: ".clearing-close",
            init: !1,
            locked: !1
        },
        init: function(d, b, c) {
            var e = this;
            return Foundation.inherit(this, "set_data get_data remove_data throttle data_options"),
            "object" == typeof b && (c = a.extend(!0, this.settings, b)),
            "string" != typeof b ? (a(this.scope).find("ul[data-clearing]").each(function() {
                var b = a(this)
                  , c = c || {}
                  , d = b.find("li");
                !e.get_data(b) && 0 < d.length && (c.$parent = b.parent(),
                e.set_data(b, a.extend({}, e.settings, c, e.data_options(b))),
                e.assemble(b.find("li")),
                e.settings.init || e.events().swipe_events())
            }),
            this.settings.init) : this[b].call(this, c)
        },
        events: function() {
            var d = this;
            return a(this.scope).on("click.fndtn.clearing", "ul[data-clearing] li", function(b, c, e) {
                c = c || a(this);
                e = e || c;
                var f = c.next("li")
                  , g = d.get_data(c.parent())
                  , n = a(b.target);
                b.preventDefault();
                g || d.init();
                e.hasClass("visible") && c[0] === e[0] && 0 < f.length && d.is_open(c) && (e = f,
                n = e.find("img"));
                d.open(n, c, e);
                d.update_paddles(e)
            }).on("click.fndtn.clearing", ".clearing-main-next", function(a) {
                this.nav(a, "next")
            }
            .bind(this)).on("click.fndtn.clearing", ".clearing-main-prev", function(a) {
                this.nav(a, "prev")
            }
            .bind(this)).on("click.fndtn.clearing", this.settings.close_selectors, function(a) {
                Foundation.libs.clearing.close(a, this)
            }).on("keydown.fndtn.clearing", function(a) {
                this.keydown(a)
            }
            .bind(this)),
            a(g).on("resize.fndtn.clearing", function() {
                this.resize()
            }
            .bind(this)),
            this.settings.init = !0,
            this
        },
        swipe_events: function() {
            var d = this;
            a(this.scope).on("touchstart.fndtn.clearing", ".visible-img", function(b) {
                b.touches || (b = b.originalEvent);
                var c = {
                    start_page_x: b.touches[0].pageX,
                    start_page_y: b.touches[0].pageY,
                    start_time: (new Date).getTime(),
                    delta_x: 0,
                    is_scrolling: e
                };
                a(this).data("swipe-transition", c);
                b.stopPropagation()
            }).on("touchmove.fndtn.clearing", ".visible-img", function(b) {
                b.touches || (b = b.originalEvent);
                if (!(1 < b.touches.length || b.scale && 1 !== b.scale)) {
                    var c = a(this).data("swipe-transition");
                    "undefined" == typeof c && (c = {});
                    c.delta_x = b.touches[0].pageX - c.start_page_x;
                    "undefined" == typeof c.is_scrolling && (c.is_scrolling = !!(c.is_scrolling || Math.abs(c.delta_x) < Math.abs(b.touches[0].pageY - c.start_page_y)));
                    if (!c.is_scrolling && !c.active) {
                        b.preventDefault();
                        var e = 0 > c.delta_x ? "next" : "prev";
                        c.active = !0;
                        d.nav(b, e)
                    }
                }
            }).on("touchend.fndtn.clearing", ".visible-img", function(b) {
                a(this).data("swipe-transition", {});
                b.stopPropagation()
            })
        },
        assemble: function(d) {
            var b = d.parent();
            b.after('<div id="foundationClearingHolder"></div>');
            d = a("#foundationClearingHolder");
            var c = this.get_data(b)
              , b = b.detach()
              , b = '<div class="carousel">' + this.outerHTML(b[0]) + "</div>";
            return d.after('<div class="clearing-assembled"><div>' + c.templates.viewing + b + "</div></div>").remove()
        },
        open: function(a, b, c) {
            var e = c.closest(".clearing-assembled")
              , f = e.find("div").first()
              , g = f.find(".visible-img")
              , n = g.find("img").not(a);
            this.locked() || (n.attr("src", this.load(a)).css("visibility", "hidden"),
            this.loaded(n, function() {
                n.css("visibility", "visible");
                e.addClass("clearing-blackout");
                f.addClass("clearing-container");
                g.show();
                this.fix_height(c).caption(g.find(".clearing-caption"), a).center(n).shift(b, c, function() {
                    c.siblings().removeClass("visible");
                    c.addClass("visible")
                })
            }
            .bind(this)))
        },
        close: function(d, b) {
            d.preventDefault();
            var c;
            c = a(b);
            c = /blackout/.test(c.selector) ? c : c.closest(".clearing-blackout");
            var e, f;
            return b === d.target && c && (e = c.find("div").first(),
            f = e.find(".visible-img"),
            this.settings.prev_index = 0,
            c.find("ul[data-clearing]").attr("style", "").closest(".clearing-blackout").removeClass("clearing-blackout"),
            e.removeClass("clearing-container"),
            f.hide()),
            !1
        },
        is_open: function(a) {
            return 0 < a.parent().prop("style").length
        },
        keydown: function(d) {
            var b = a(".clearing-blackout").find("ul[data-clearing]");
            39 === d.which && this.go(b, "next");
            37 === d.which && this.go(b, "prev");
            27 === d.which && a("a.clearing-close").trigger("click")
        },
        nav: function(d, b) {
            var c = a(".clearing-blackout").find("ul[data-clearing]");
            d.preventDefault();
            this.go(c, b)
        },
        resize: function() {
            var d = a(".clearing-blackout .visible-img").find("img");
            d.length && this.center(d)
        },
        fix_height: function(d) {
            d = d.parent().children();
            var b = this;
            return d.each(function() {
                var c = a(this)
                  , d = c.find("img");
                c.height() > b.outerHeight(d) && c.addClass("fix-height")
            }).closest("ul").width(100 * d.length + "%"),
            this
        },
        update_paddles: function(a) {
            var b = a.closest(".carousel").siblings(".visible-img");
            0 < a.next().length ? b.find(".clearing-main-next").removeClass("disabled") : b.find(".clearing-main-next").addClass("disabled");
            0 < a.prev().length ? b.find(".clearing-main-prev").removeClass("disabled") : b.find(".clearing-main-prev").addClass("disabled")
        },
        center: function(a) {
            return this.rtl ? a.css({
                marginRight: -(this.outerWidth(a) / 2),
                marginTop: -(this.outerHeight(a) / 2)
            }) : a.css({
                marginLeft: -(this.outerWidth(a) / 2),
                marginTop: -(this.outerHeight(a) / 2)
            }),
            this
        },
        load: function(a) {
            var b = "A" === a[0].nodeName ? a.attr("href") : a.parent().attr("href");
            return this.preload(a),
            b ? b : a.attr("src")
        },
        preload: function(a) {
            this.img(a.closest("li").next()).img(a.closest("li").prev())
        },
        loaded: function(a, b) {
            function c() {
                b()
            }
            function e() {
                this.one("load", c);
                if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
                    var a = this.attr("src")
                      , b = a.match(/\?/) ? "&" : "?"
                      , b = b + ("random=" + (new Date).getTime());
                    this.attr("src", a + b)
                }
            }
            a.attr("src") ? a[0].complete || 4 === a[0].readyState ? b() : e.call(a) : b()
        },
        img: function(a) {
            if (a.length) {
                var b = new Image
                  , c = a.find("a");
                c.length ? b.src = c.attr("href") : b.src = a.find("img").attr("src")
            }
            return this
        },
        caption: function(a, b) {
            var c = b.data("caption");
            return c ? a.html(c).show() : a.text("").hide(),
            this
        },
        go: function(a, b) {
            var c = a.find(".visible")
              , e = c[b]();
            e.length && e.find("img").trigger("click", [c, e])
        },
        shift: function(a, b, c) {
            var e = b.parent()
              , f = this.settings.prev_index || b.index();
            a = this.direction(e, a, b);
            var g = parseInt(e.css("left"), 10), n = this.outerWidth(b), q;
            b.index() === f || /skip/.test(a) ? /skip/.test(a) && (q = b.index() - this.settings.up_count,
            this.lock(),
            0 < q ? e.animate({
                left: -(q * n)
            }, 300, this.unlock()) : e.animate({
                left: 0
            }, 300, this.unlock())) : /left/.test(a) ? (this.lock(),
            e.animate({
                left: g + n
            }, 300, this.unlock())) : /right/.test(a) && (this.lock(),
            e.animate({
                left: g - n
            }, 300, this.unlock()));
            c()
        },
        direction: function(d, b, c) {
            d = d.find("li");
            b = this.outerWidth(d) + this.outerWidth(d) / 4;
            b = Math.floor(this.outerWidth(a(".clearing-container")) / b) - 1;
            c = d.index(c);
            var e;
            return this.settings.up_count = b,
            this.adjacent(this.settings.prev_index, c) ? c > b && c > this.settings.prev_index ? e = "right" : c > b - 1 && c <= this.settings.prev_index ? e = "left" : e = !1 : e = "skip",
            this.settings.prev_index = c,
            e
        },
        adjacent: function(a, b) {
            for (var c = b + 1; c >= b - 1; c--)
                if (c === a)
                    return !0;
            return !1
        },
        lock: function() {
            this.settings.locked = !0
        },
        unlock: function() {
            this.settings.locked = !1
        },
        locked: function() {
            return this.settings.locked
        },
        outerHTML: function(a) {
            return a.outerHTML || (new XMLSerializer).serializeToString(a)
        },
        off: function() {
            a(this.scope).off(".fndtn.clearing");
            a(g).off(".fndtn.clearing");
            this.remove_data();
            this.settings.init = !1
        },
        reflow: function() {
            this.init()
        }
    }
}
)(Foundation.zj, this, this.document);
(function(a, g, f) {
    function e(a) {
        return a
    }
    function d(a) {
        return decodeURIComponent(a.replace(b, " "))
    }
    var b = /\+/g
      , c = a.cookie = function(b, m, l) {
        if (m !== f) {
            l = a.extend({}, c.defaults, l);
            null === m && (l.expires = -1);
            if ("number" == typeof l.expires) {
                var n = l.expires
                  , q = l.expires = new Date;
                q.setDate(q.getDate() + n)
            }
            return m = c.json ? JSON.stringify(m) : String(m),
            g.cookie = [encodeURIComponent(b), "=", c.raw ? m : encodeURIComponent(m), l.expires ? "; expires=" + l.expires.toUTCString() : "", l.path ? "; path=" + l.path : "", l.domain ? "; domain=" + l.domain : "", l.secure ? "; secure" : ""].join("")
        }
        m = c.raw ? e : d;
        l = g.cookie.split("; ");
        n = 0;
        for (q = l.length; n < q; n++) {
            var p = l[n].split("=");
            if (m(p.shift()) === b)
                return b = m(p.join("=")),
                c.json ? JSON.parse(b) : b
        }
        return null
    }
    ;
    c.defaults = {};
    a.removeCookie = function(b, c) {
        return null !== a.cookie(b) ? (a.cookie(b, null, c),
        !0) : !1
    }
}
)(Foundation.zj, document);
(function(a, g, f, e) {
    Foundation.libs.dropdown = {
        name: "dropdown",
        version: "4.3.2",
        settings: {
            activeClass: "open",
            is_hover: !1,
            opened: function() {},
            closed: function() {}
        },
        init: function(d, b, c) {
            return this.scope = d || this.scope,
            Foundation.inherit(this, "throttle scrollLeft data_options"),
            "object" == typeof b && a.extend(!0, this.settings, b),
            "string" != typeof b ? (this.settings.init || this.events(),
            this.settings.init) : this[b].call(this, c)
        },
        events: function() {
            var d = this;
            a(this.scope).on("click.fndtn.dropdown", "[data-dropdown]", function(b) {
                var c = a.extend({}, d.settings, d.data_options(a(this)));
                b.preventDefault();
                c.is_hover || d.toggle(a(this))
            }).on("mouseenter", "[data-dropdown]", function(b) {
                a.extend({}, d.settings, d.data_options(a(this))).is_hover && d.toggle(a(this))
            }).on("mouseleave", "[data-dropdown-content]", function(b) {
                b = a('[data-dropdown="' + a(this).attr("id") + '"]');
                a.extend({}, d.settings, d.data_options(b)).is_hover && d.close.call(d, a(this))
            }).on("opened.fndtn.dropdown", "[data-dropdown-content]", this.settings.opened).on("closed.fndtn.dropdown", "[data-dropdown-content]", this.settings.closed);
            a(f).on("click.fndtn.dropdown", function(b) {
                var c = a(b.target).closest("[data-dropdown-content]");
                a(b.target).data("dropdown") || a(b.target).parent().data("dropdown") || (!a(b.target).data("revealId") && 0 < c.length && (a(b.target).is("[data-dropdown-content]") || a.contains(c.first()[0], b.target)) ? b.stopPropagation() : d.close.call(d, a("[data-dropdown-content]")))
            });
            a(g).on("resize.fndtn.dropdown", d.throttle(function() {
                d.resize.call(d)
            }, 50)).trigger("resize");
            this.settings.init = !0
        },
        close: function(d) {
            var b = this;
            d.each(function() {
                a(this).hasClass(b.settings.activeClass) && (a(this).css(Foundation.rtl ? "right" : "left", "-99999px").removeClass(b.settings.activeClass),
                a(this).trigger("closed"))
            })
        },
        open: function(a, b) {
            this.css(a.addClass(this.settings.activeClass), b);
            a.trigger("opened")
        },
        toggle: function(d) {
            var b = a("#" + d.data("dropdown"));
            0 !== b.length && (this.close.call(this, a("[data-dropdown-content]").not(b)),
            b.hasClass(this.settings.activeClass) ? this.close.call(this, b) : (this.close.call(this, a("[data-dropdown-content]")),
            this.open.call(this, b, d)))
        },
        resize: function() {
            var d = a("[data-dropdown-content].open")
              , b = a("[data-dropdown='" + d.attr("id") + "']");
            d.length && b.length && this.css(d, b)
        },
        css: function(d, b) {
            var c = d.offsetParent()
              , e = b.offset();
            e.top -= c.offset().top;
            e.left -= c.offset().left;
            this.small() ? (d.css({
                position: "absolute",
                width: "95%",
                "max-width": "none",
                top: e.top + this.outerHeight(b)
            }),
            d.css(Foundation.rtl ? "right" : "left", "2.5%")) : (!Foundation.rtl && a(g).width() > this.outerWidth(d) + b.offset().left && !this.data_options(b).align_right ? (c = e.left,
            d.hasClass("right") && d.removeClass("right")) : (d.hasClass("right") || d.addClass("right"),
            c = e.left - (this.outerWidth(d) - this.outerWidth(b))),
            d.attr("style", "").css({
                position: "absolute",
                top: e.top + this.outerHeight(b),
                left: c
            }));
            return d
        },
        small: function() {
            return 768 > a(g).width() || a("html").hasClass("lt-ie9")
        },
        off: function() {
            a(this.scope).off(".fndtn.dropdown");
            a("html, body").off(".fndtn.dropdown");
            a(g).off(".fndtn.dropdown");
            a("[data-dropdown-content]").off(".fndtn.dropdown");
            this.settings.init = !1
        },
        reflow: function() {}
    }
}
)(Foundation.zj, this, this.document);
(function(a, g, f, e) {
    Foundation.libs.forms = {
        name: "forms",
        version: "4.3.2",
        cache: {},
        settings: {
            disable_class: "no-custom",
            last_combo: null
        },
        init: function(b, c, d) {
            return "object" == typeof c && a.extend(!0, this.settings, c),
            "string" != typeof c ? (this.settings.init || this.events(),
            this.assemble(),
            this.settings.init) : this[c].call(this, d)
        },
        assemble: function() {
            var b = this;
            a('form.custom input[type="radio"],[type="checkbox"]', a(this.scope)).not('[data-customforms="disabled"]').not("." + this.settings.disable_class).each(function(a, d) {
                b.set_custom_markup(d)
            }).change(function() {
                b.set_custom_markup(this)
            });
            a("form.custom select", a(this.scope)).not('[data-customforms="disabled"]').not("." + this.settings.disable_class).not("[multiple=multiple]").each(this.append_custom_select)
        },
        events: function() {
            var b = this;
            a(this.scope).on("click.fndtn.forms", "form.custom span.custom.checkbox", function(c) {
                c.preventDefault();
                c.stopPropagation();
                b.toggle_checkbox(a(this))
            }).on("click.fndtn.forms", "form.custom span.custom.radio", function(c) {
                c.preventDefault();
                c.stopPropagation();
                b.toggle_radio(a(this))
            }).on("change.fndtn.forms", "form.custom select", function(c, d) {
                a(this).is('[data-customforms="disabled"]') || b.refresh_custom_select(a(this), d)
            }).on("click.fndtn.forms", "form.custom label", function(c) {
                if (a(c.target).is("label")) {
                    var d = a("#" + b.escape(a(this).attr("for"))).not('[data-customforms="disabled"]'), e, f;
                    0 !== d.length && ("checkbox" === d.attr("type") ? (c.preventDefault(),
                    e = a(this).find("span.custom.checkbox"),
                    0 === e.length && (e = d.add(this).siblings("span.custom.checkbox").first()),
                    b.toggle_checkbox(e)) : "radio" === d.attr("type") && (c.preventDefault(),
                    f = a(this).find("span.custom.radio"),
                    0 === f.length && (f = d.add(this).siblings("span.custom.radio").first()),
                    b.toggle_radio(f)))
                }
            }).on("mousedown.fndtn.forms", "form.custom div.custom.dropdown", function() {
                return !1
            }).on("click.fndtn.forms", "form.custom div.custom.dropdown a.current, form.custom div.custom.dropdown a.selector", function(c) {
                var e = a(this).closest("div.custom.dropdown")
                  , f = d(e, "select");
                e.hasClass("open") || a(b.scope).trigger("click");
                c.preventDefault();
                if (!1 === f.is(":disabled"))
                    return e.toggleClass("open"),
                    e.hasClass("open") ? a(b.scope).on("click.fndtn.forms.customdropdown", function() {
                        e.removeClass("open");
                        a(b.scope).off(".fndtn.forms.customdropdown")
                    }) : a(b.scope).on(".fndtn.forms.customdropdown"),
                    !1
            }).on("click.fndtn.forms touchend.fndtn.forms", "form.custom div.custom.dropdown li", function(b) {
                var e = a(this)
                  , g = e.closest("div.custom.dropdown")
                  , l = d(g, "select")
                  , n = 0;
                b.preventDefault();
                b.stopPropagation();
                a(this).hasClass("disabled") || (a("div.dropdown").not(g).removeClass("open"),
                b = e.closest("ul").find("li.selected"),
                b.removeClass("selected"),
                e.addClass("selected"),
                g.removeClass("open").find("a.current").text(e.text()),
                e.closest("ul").find("li").each(function(a) {
                    e[0] === this && (n = a)
                }),
                l[0].selectedIndex = n,
                l.data("prevalue", b.html()),
                "undefined" != typeof f.createEvent ? (g = f.createEvent("HTMLEvents"),
                g.initEvent("change", !0, !0),
                l[0].dispatchEvent(g)) : l[0].fireEvent("onchange"))
            });
            a(g).on("keydown", function(b) {
                var e = Foundation.libs.forms
                  , f = a(".custom.dropdown")
                  , g = d(f, "select")
                  , n = a("input,select,textarea,button");
                0 < f.length && f.hasClass("open") && (b.preventDefault(),
                9 === b.which && (a(n[a(n).index(g) + 1]).focus(),
                f.removeClass("open")),
                13 === b.which && f.find("li.selected").trigger("click"),
                27 === b.which && f.removeClass("open"),
                65 <= b.which && 90 >= b.which && (n = e.go_to(f, b.which),
                g = f.find("li.selected"),
                n && (g.removeClass("selected"),
                e.scrollTo(n.addClass("selected"), 300))),
                38 === b.which ? (g = f.find("li.selected"),
                b = g.prev(":not(.disabled)"),
                0 < b.length && (b.parent()[0].scrollTop = b.parent().scrollTop() - e.outerHeight(b),
                g.removeClass("selected"),
                b.addClass("selected"))) : 40 === b.which && (g = f.find("li.selected"),
                n = g.next(":not(.disabled)"),
                0 < n.length && (n.parent()[0].scrollTop = n.parent().scrollTop() + e.outerHeight(n),
                g.removeClass("selected"),
                n.addClass("selected"))))
            });
            a(g).on("keyup", function(b) {
                b = f.activeElement;
                var d = a(".custom.dropdown");
                b === d.find(".current")[0] && d.find(".selector").focus().click()
            });
            this.settings.init = !0
        },
        go_to: function(a, c) {
            var d = a.find("li")
              , e = d.length;
            if (0 < e)
                for (var f = 0; f < e; f++)
                    if (d.eq(f).text().charAt(0).toLowerCase() === String.fromCharCode(c).toLowerCase())
                        return d.eq(f)
        },
        scrollTo: function(a, c) {
            if (!(0 > c)) {
                var d = a.parent()
                  , e = (this.outerHeight(a) * a.index() - d.scrollTop()) / c * 10;
                this.scrollToTimerCache = setTimeout(function() {
                    isNaN(parseInt(e, 10)) || (d[0].scrollTop = d.scrollTop() + e,
                    this.scrollTo(a, c - 10))
                }
                .bind(this), 10)
            }
        },
        set_custom_markup: function(b) {
            b = a(b);
            var c = b.attr("type")
              , d = b.next("span.custom." + c);
            b.parent().hasClass("switch") || b.addClass("hidden-field");
            0 === d.length && (d = a('<span class="custom ' + c + '"></span>').insertAfter(b));
            d.toggleClass("checked", b.is(":checked"));
            d.toggleClass("disabled", b.is(":disabled"))
        },
        append_custom_select: function(b, c) {
            var d = Foundation.libs.forms
              , e = a(c)
              , f = e.next("div.custom.dropdown")
              , g = f.find("ul");
            f.find(".current");
            f.find(".selector");
            var q = e.find("option"), p = q.filter(":selected"), r = e.attr("class") ? e.attr("class").split(" ") : [], s = 0, u = "", v, x = !1;
            0 === f.length ? (f = e.hasClass("small") ? "small" : e.hasClass("medium") ? "medium" : e.hasClass("large") ? "large" : e.hasClass("expand") ? "expand" : "",
            f = a('<div class="' + ["custom", "dropdown", f].concat(r).filter(function(a, b, c) {
                return "" === a ? !1 : c.indexOf(a) === b
            }).join(" ") + '"><a href="#" class="selector"></a><ul /></div>'),
            f.find(".selector"),
            g = f.find("ul"),
            u = q.map(function() {
                return "<li class='" + (a(this).attr("class") ? a(this).attr("class") : "") + "'>" + a(this).html() + "</li>"
            }).get().join(""),
            g.append(u),
            x = f.prepend('<a href="#" class="current">' + (p.html() || "") + "</a>").find(".current"),
            e.after(f).addClass("hidden-field")) : (u = q.map(function() {
                return "<li>" + a(this).html() + "</li>"
            }).get().join(""),
            g.html("").append(u));
            d.assign_id(e, f);
            f.toggleClass("disabled", e.is(":disabled"));
            v = g.find("li");
            d.cache[f.data("id")] = v.length;
            q.each(function(b) {
                this.selected && (v.eq(b).addClass("selected"),
                x && x.html(a(this).html()));
                a(this).is(":disabled") && v.eq(b).addClass("disabled")
            });
            f.is(".small, .medium, .large, .expand") || (f.addClass("open"),
            d = Foundation.libs.forms,
            d.hidden_fix.adjust(g),
            s = d.outerWidth(v) > s ? d.outerWidth(v) : s,
            Foundation.libs.forms.hidden_fix.reset(),
            f.removeClass("open"))
        },
        assign_id: function(a, c) {
            var d = [+new Date, Foundation.random_str(5)].join("-");
            a.attr("data-id", d);
            c.attr("data-id", d)
        },
        refresh_custom_select: function(b, c) {
            var d = this
              , e = 0
              , f = b.next()
              , g = b.find("option")
              , q = f.find("ul")
              , p = f.find("li");
            if (g.length !== this.cache[f.data("id")] || c) {
                q.html("");
                var r = "";
                g.each(function() {
                    var b = a(this)
                      , c = b.html()
                      , d = this.selected;
                    r += '<li class="' + (d ? " selected " : "") + (b.is(":disabled") ? " disabled " : "") + '">' + c + "</li>";
                    d && f.find(".current").html(c)
                });
                q.html(r);
                f.removeAttr("style");
                q.removeAttr("style");
                f.find("li").each(function() {
                    f.addClass("open");
                    d.outerWidth(a(this)) > e && (e = d.outerWidth(a(this)));
                    f.removeClass("open")
                });
                p = f.find("li");
                this.cache[f.data("id")] = p.length
            }
        },
        refresh_custom_selection: function(b) {
            var c = a("option:selected", b).text();
            a("a.current", b.next()).text(c)
        },
        toggle_checkbox: function(a) {
            var c = a.prev()
              , d = c[0];
            !1 === c.is(":disabled") && (d.checked = d.checked ? !1 : !0,
            a.toggleClass("checked"),
            c.trigger("change"))
        },
        toggle_radio: function(a) {
            var c = a.prev()
              , d = c.closest("form.custom")
              , e = c[0];
            !1 === c.is(":disabled") && (d.find('input[type="radio"][name="' + this.escape(c.attr("name")) + '"]').next().not(a).removeClass("checked"),
            a.hasClass("checked") || a.toggleClass("checked"),
            e.checked = a.hasClass("checked"),
            c.trigger("change"))
        },
        escape: function(a) {
            return a ? a.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") : ""
        },
        hidden_fix: {
            tmp: [],
            hidden: null,
            adjust: function(b) {
                var c = this;
                c.hidden = b.parents();
                c.hidden = c.hidden.add(b).filter(":hidden");
                c.hidden.each(function() {
                    var b = a(this);
                    c.tmp.push(b.attr("style"));
                    b.css({
                        visibility: "hidden",
                        display: "block"
                    })
                })
            },
            reset: function() {
                var b = this;
                b.hidden.each(function(c) {
                    var d = a(this);
                    c = b.tmp[c];
                    c === e ? d.removeAttr("style") : d.attr("style", c)
                });
                b.tmp = [];
                b.hidden = null
            }
        },
        off: function() {
            a(this.scope).off(".fndtn.forms")
        },
        reflow: function() {}
    };
    var d = function(b, c) {
        for (b = b.prev(); b.length; ) {
            if (b.is(c))
                return b;
            b = b.prev()
        }
        return a()
    }
}
)(Foundation.zj, this, this.document);
(function(a, g, f, e) {
    var d = d || !1;
    Foundation.libs.joyride = {
        name: "joyride",
        version: "4.3.2",
        defaults: {
            expose: !1,
            modal: !1,
            tipLocation: "bottom",
            nubPosition: "auto",
            scrollSpeed: 300,
            timer: 0,
            startTimerOnClick: !0,
            startOffset: 0,
            nextButton: !0,
            tipAnimation: "fade",
            pauseAfter: [],
            exposed: [],
            tipAnimationFadeSpeed: 300,
            cookieMonster: !1,
            cookieName: "joyride",
            cookieDomain: !1,
            cookieExpires: 365,
            tipContainer: "body",
            postRideCallback: function() {},
            postStepCallback: function() {},
            preStepCallback: function() {},
            preRideCallback: function() {},
            postExposeCallback: function() {},
            template: {
                link: '<a href="#close" class="joyride-close-tip">&times;</a>',
                timer: '<div class="joyride-timer-indicator-wrap"><span class="joyride-timer-indicator"></span></div>',
                tip: '<div class="joyride-tip-guide"><span class="joyride-nub"></span></div>',
                wrapper: '<div class="joyride-content-wrapper"></div>',
                button: '<a href="#" class="small button joyride-next-tip"></a>',
                modal: '<div class="joyride-modal-bg"></div>',
                expose: '<div class="joyride-expose-wrapper"></div>',
                exposeCover: '<div class="joyride-expose-cover"></div>'
            },
            exposeAddClass: ""
        },
        settings: {},
        init: function(b, c, d) {
            return this.scope = b || this.scope,
            Foundation.inherit(this, "throttle data_options scrollTo scrollLeft delay"),
            "object" == typeof c ? a.extend(!0, this.settings, this.defaults, c) : a.extend(!0, this.settings, this.defaults, d),
            "string" != typeof c ? (this.settings.init || this.events(),
            this.settings.init) : this[c].call(this, d)
        },
        events: function() {
            var b = this;
            a(this.scope).on("click.joyride", ".joyride-next-tip, .joyride-modal-bg", function(a) {
                a.preventDefault();
                1 > this.settings.$li.next().length ? this.end() : 0 < this.settings.timer ? (clearTimeout(this.settings.automate),
                this.hide(),
                this.show(),
                this.startTimer()) : (this.hide(),
                this.show())
            }
            .bind(this)).on("click.joyride", ".joyride-close-tip", function(a) {
                a.preventDefault();
                this.end()
            }
            .bind(this));
            a(g).on("resize.fndtn.joyride", b.throttle(function() {
                0 < a("[data-joyride]").length && b.settings.$next_tip && (0 < b.settings.exposed.length && a(b.settings.exposed).each(function() {
                    var c = a(this);
                    b.un_expose(c);
                    b.expose(c)
                }),
                b.is_phone() ? b.pos_phone() : b.pos_default(!1, !0))
            }, 100));
            this.settings.init = !0
        },
        start: function() {
            var b = this
              , c = a(this.scope).find("[data-joyride]")
              , d = ["timer", "scrollSpeed", "startOffset", "tipAnimationFadeSpeed", "cookieExpires"]
              , e = d.length;
            this.settings.init || this.events();
            this.settings.$content_el = c;
            this.settings.$body = a(this.settings.tipContainer);
            this.settings.body_offset = a(this.settings.tipContainer).position();
            this.settings.$tip_content = this.settings.$content_el.find("> li");
            this.settings.paused = !1;
            this.settings.attempts = 0;
            this.settings.tipLocationPatterns = {
                top: ["bottom"],
                bottom: [],
                left: ["right", "top", "bottom"],
                right: ["left", "top", "bottom"]
            };
            "function" != typeof a.cookie && (this.settings.cookieMonster = !1);
            if (!this.settings.cookieMonster || this.settings.cookieMonster && null === a.cookie(this.settings.cookieName))
                this.settings.$tip_content.each(function(c) {
                    var f = a(this);
                    a.extend(!0, b.settings, b.data_options(f));
                    for (var g = e - 1; 0 <= g; g--)
                        b.settings[d[g]] = parseInt(b.settings[d[g]], 10);
                    b.create({
                        $li: f,
                        index: c
                    })
                }),
                !this.settings.startTimerOnClick && 0 < this.settings.timer ? (this.show("init"),
                this.startTimer()) : this.show("init")
        },
        resume: function() {
            this.set_li();
            this.show()
        },
        tip_template: function(b) {
            var c, d;
            return b.tip_class = b.tip_class || "",
            c = a(this.settings.template.tip).addClass(b.tip_class),
            d = a.trim(a(b.li).html()) + this.button_text(b.button_text) + this.settings.template.link + this.timer_instance(b.index),
            c.append(a(this.settings.template.wrapper)),
            c.first().attr("data-index", b.index),
            a(".joyride-content-wrapper", c).append(d),
            c[0]
        },
        timer_instance: function(b) {
            var c;
            return 0 === b && this.settings.startTimerOnClick && 0 < this.settings.timer || 0 === this.settings.timer ? c = "" : c = this.outerHTML(a(this.settings.template.timer)[0]),
            c
        },
        button_text: function(b) {
            return this.settings.nextButton ? (b = a.trim(b) || "Next",
            b = this.outerHTML(a(this.settings.template.button).append(b)[0])) : b = "",
            b
        },
        create: function(b) {
            var c = b.$li.attr("data-button") || b.$li.attr("data-text")
              , d = b.$li.attr("class");
            b = a(this.tip_template({
                tip_class: d,
                index: b.index,
                button_text: c,
                li: b.$li
            }));
            a(this.settings.tipContainer).append(b)
        },
        show: function(b) {
            var c = null;
            this.settings.$li === e || -1 === a.inArray(this.settings.$li.index(), this.settings.pauseAfter) ? (this.settings.paused ? this.settings.paused = !1 : this.set_li(b),
            this.settings.attempts = 0,
            this.settings.$li.length && 0 < this.settings.$target.length ? (b && (this.settings.preRideCallback(this.settings.$li.index(), this.settings.$next_tip),
            this.settings.modal && this.show_modal()),
            this.settings.preStepCallback(this.settings.$li.index(), this.settings.$next_tip),
            this.settings.modal && this.settings.expose && this.expose(),
            this.settings.tipSettings = a.extend(this.settings, this.data_options(this.settings.$li)),
            this.settings.timer = parseInt(this.settings.timer, 10),
            this.settings.tipSettings.tipLocationPattern = this.settings.tipLocationPatterns[this.settings.tipSettings.tipLocation],
            /body/i.test(this.settings.$target.selector) || this.scroll_to(),
            this.is_phone() ? this.pos_phone(!0) : this.pos_default(!0),
            c = this.settings.$next_tip.find(".joyride-timer-indicator"),
            /pop/i.test(this.settings.tipAnimation) ? (c.width(0),
            0 < this.settings.timer ? (this.settings.$next_tip.show(),
            this.delay(function() {
                c.animate({
                    width: c.parent().width()
                }, this.settings.timer, "linear")
            }
            .bind(this), this.settings.tipAnimationFadeSpeed)) : this.settings.$next_tip.show()) : /fade/i.test(this.settings.tipAnimation) && (c.width(0),
            0 < this.settings.timer ? (this.settings.$next_tip.fadeIn(this.settings.tipAnimationFadeSpeed).show(),
            this.delay(function() {
                c.animate({
                    width: c.parent().width()
                }, this.settings.timer, "linear")
            }
            .bind(this), this.settings.tipAnimationFadeSpeed)) : this.settings.$next_tip.fadeIn(this.settings.tipAnimationFadeSpeed)),
            this.settings.$current_tip = this.settings.$next_tip) : this.settings.$li && 1 > this.settings.$target.length ? this.show() : this.end()) : this.settings.paused = !0
        },
        is_phone: function() {
            return d ? d.mq("only screen and (max-width: 767px)") || 0 < a(".lt-ie9").length : 767 > a(g).width()
        },
        hide: function() {
            this.settings.modal && this.settings.expose && this.un_expose();
            this.settings.modal || a(".joyride-modal-bg").hide();
            this.settings.$current_tip.css("visibility", "hidden");
            setTimeout(a.proxy(function() {
                this.hide();
                this.css("visibility", "visible")
            }, this.settings.$current_tip), 0);
            this.settings.postStepCallback(this.settings.$li.index(), this.settings.$current_tip)
        },
        set_li: function(a) {
            a ? (this.settings.$li = this.settings.$tip_content.eq(this.settings.startOffset),
            this.set_next_tip(),
            this.settings.$current_tip = this.settings.$next_tip) : (this.settings.$li = this.settings.$li.next(),
            this.set_next_tip());
            this.set_target()
        },
        set_next_tip: function() {
            this.settings.$next_tip = a(".joyride-tip-guide[data-index='" + this.settings.$li.index() + "']");
            this.settings.$next_tip.data("closed", "")
        },
        set_target: function() {
            var b = this.settings.$li.attr("data-class")
              , c = this.settings.$li.attr("data-id");
            this.settings.$target = c ? a(f.getElementById(c)) : b ? a("." + b).first() : a("body")
        },
        scroll_to: function() {
            var b;
            b = a(g).height() / 2;
            b = Math.ceil(this.settings.$target.offset().top - b + this.outerHeight(this.settings.$next_tip));
            0 < b && this.scrollTo(a("html, body"), b, this.settings.scrollSpeed)
        },
        paused: function() {
            return -1 === a.inArray(this.settings.$li.index() + 1, this.settings.pauseAfter)
        },
        restart: function() {
            this.hide();
            this.settings.$li = e;
            this.show("init")
        },
        pos_default: function(b, c) {
            Math.ceil(a(g).height() / 2);
            this.settings.$next_tip.offset();
            var d = this.settings.$next_tip.find(".joyride-nub")
              , e = Math.ceil(this.outerWidth(d) / 2)
              , f = Math.ceil(this.outerHeight(d) / 2)
              , n = b || !1;
            n && (this.settings.$next_tip.css("visibility", "hidden"),
            this.settings.$next_tip.show());
            /body/i.test(this.settings.$target.selector) ? this.settings.$li.length && this.pos_modal(d) : (this.bottom() ? (e = this.settings.$target.offset().left,
            Foundation.rtl && (e = this.settings.$target.offset().width - this.settings.$next_tip.width() + e),
            this.settings.$next_tip.css({
                top: this.settings.$target.offset().top + f + this.outerHeight(this.settings.$target),
                left: e
            }),
            this.nub_position(d, this.settings.tipSettings.nubPosition, "top")) : this.top() ? (e = this.settings.$target.offset().left,
            Foundation.rtl && (e = this.settings.$target.offset().width - this.settings.$next_tip.width() + e),
            this.settings.$next_tip.css({
                top: this.settings.$target.offset().top - this.outerHeight(this.settings.$next_tip) - f,
                left: e
            }),
            this.nub_position(d, this.settings.tipSettings.nubPosition, "bottom")) : this.right() ? (this.settings.$next_tip.css({
                top: this.settings.$target.offset().top,
                left: this.outerWidth(this.settings.$target) + this.settings.$target.offset().left + e
            }),
            this.nub_position(d, this.settings.tipSettings.nubPosition, "left")) : this.left() && (this.settings.$next_tip.css({
                top: this.settings.$target.offset().top,
                left: this.settings.$target.offset().left - this.outerWidth(this.settings.$next_tip) - e
            }),
            this.nub_position(d, this.settings.tipSettings.nubPosition, "right")),
            !this.visible(this.corners(this.settings.$next_tip)) && this.settings.attempts < this.settings.tipSettings.tipLocationPattern.length && (d.removeClass("bottom").removeClass("top").removeClass("right").removeClass("left"),
            this.settings.tipSettings.tipLocation = this.settings.tipSettings.tipLocationPattern[this.settings.attempts],
            this.settings.attempts++,
            this.pos_default()));
            n && (this.settings.$next_tip.hide(),
            this.settings.$next_tip.css("visibility", "visible"))
        },
        pos_phone: function(b) {
            var c = this.outerHeight(this.settings.$next_tip);
            this.settings.$next_tip.offset();
            var d = this.outerHeight(this.settings.$target)
              , e = a(".joyride-nub", this.settings.$next_tip)
              , f = Math.ceil(this.outerHeight(e) / 2);
            b = b || !1;
            e.removeClass("bottom").removeClass("top").removeClass("right").removeClass("left");
            b && (this.settings.$next_tip.css("visibility", "hidden"),
            this.settings.$next_tip.show());
            /body/i.test(this.settings.$target.selector) ? this.settings.$li.length && this.pos_modal(e) : this.top() ? (this.settings.$next_tip.offset({
                top: this.settings.$target.offset().top - c - f
            }),
            e.addClass("bottom")) : (this.settings.$next_tip.offset({
                top: this.settings.$target.offset().top + d + f
            }),
            e.addClass("top"));
            b && (this.settings.$next_tip.hide(),
            this.settings.$next_tip.css("visibility", "visible"))
        },
        pos_modal: function(a) {
            this.center();
            a.hide();
            this.show_modal()
        },
        show_modal: function() {
            if (!this.settings.$next_tip.data("closed")) {
                var b = a(".joyride-modal-bg");
                1 > b.length && a("body").append(this.settings.template.modal).show();
                /pop/i.test(this.settings.tipAnimation) ? b.show() : b.fadeIn(this.settings.tipAnimationFadeSpeed)
            }
        },
        expose: function() {
            var b, c, d, e, f, n = "expose-" + Math.floor(1E4 * Math.random());
            if (0 < arguments.length && arguments[0]instanceof a)
                d = arguments[0];
            else {
                if (!this.settings.$target || /body/i.test(this.settings.$target.selector))
                    return !1;
                d = this.settings.$target
            }
            if (1 > d.length)
                return g.console && console.error("element not valid", d),
                !1;
            b = a(this.settings.template.expose);
            this.settings.$body.append(b);
            b.css({
                top: d.offset().top,
                left: d.offset().left,
                width: this.outerWidth(d, !0),
                height: this.outerHeight(d, !0)
            });
            c = a(this.settings.template.exposeCover);
            e = {
                zIndex: d.css("z-index"),
                position: d.css("position")
            };
            f = null == d.attr("class") ? "" : d.attr("class");
            d.css("z-index", parseInt(b.css("z-index")) + 1);
            "static" == e.position && d.css("position", "relative");
            d.data("expose-css", e);
            d.data("orig-class", f);
            d.attr("class", f + " " + this.settings.exposeAddClass);
            c.css({
                top: d.offset().top,
                left: d.offset().left,
                width: this.outerWidth(d, !0),
                height: this.outerHeight(d, !0)
            });
            this.settings.$body.append(c);
            b.addClass(n);
            c.addClass(n);
            d.data("expose", n);
            this.settings.postExposeCallback(this.settings.$li.index(), this.settings.$next_tip, d);
            this.add_exposed(d)
        },
        un_expose: function() {
            var b, c, d;
            d = !1;
            if (0 < arguments.length && arguments[0]instanceof a)
                c = arguments[0];
            else {
                if (!this.settings.$target || /body/i.test(this.settings.$target.selector))
                    return !1;
                c = this.settings.$target
            }
            if (1 > c.length)
                return g.console && console.error("element not valid", c),
                !1;
            b = c.data("expose");
            b = a("." + b);
            1 < arguments.length && (d = arguments[1]);
            !0 === d ? a(".joyride-expose-wrapper,.joyride-expose-cover").remove() : b.remove();
            d = c.data("expose-css");
            "auto" == d.zIndex ? c.css("z-index", "") : c.css("z-index", d.zIndex);
            d.position != c.css("position") && ("static" == d.position ? c.css("position", "") : c.css("position", d.position));
            d = c.data("orig-class");
            c.attr("class", d);
            c.removeData("orig-classes");
            c.removeData("expose");
            c.removeData("expose-z-index");
            this.remove_exposed(c)
        },
        add_exposed: function(b) {
            this.settings.exposed = this.settings.exposed || [];
            b instanceof a || "object" == typeof b ? this.settings.exposed.push(b[0]) : "string" == typeof b && this.settings.exposed.push(b)
        },
        remove_exposed: function(b) {
            var c;
            b instanceof a ? c = b[0] : "string" == typeof b && (c = b);
            this.settings.exposed = this.settings.exposed || [];
            b = this.settings.exposed.length;
            for (var d = 0; d < b; d++)
                if (this.settings.exposed[d] == c) {
                    this.settings.exposed.splice(d, 1);
                    break
                }
        },
        center: function() {
            var b = a(g);
            return this.settings.$next_tip.css({
                top: (b.height() - this.outerHeight(this.settings.$next_tip)) / 2 + b.scrollTop(),
                left: (b.width() - this.outerWidth(this.settings.$next_tip)) / 2 + this.scrollLeft(b)
            }),
            !0
        },
        bottom: function() {
            return /bottom/i.test(this.settings.tipSettings.tipLocation)
        },
        top: function() {
            return /top/i.test(this.settings.tipSettings.tipLocation)
        },
        right: function() {
            return /right/i.test(this.settings.tipSettings.tipLocation)
        },
        left: function() {
            return /left/i.test(this.settings.tipSettings.tipLocation)
        },
        corners: function(b) {
            var c = a(g)
              , d = c.height() / 2
              , d = Math.ceil(this.settings.$target.offset().top - d + this.settings.$next_tip.outerHeight())
              , e = c.width() + this.scrollLeft(c)
              , f = c.height() + d
              , n = c.height() + c.scrollTop()
              , q = c.scrollTop();
            return d < q && (0 > d ? q = 0 : q = d),
            f > n && (n = f),
            [b.offset().top < q, e < b.offset().left + b.outerWidth(), n < b.offset().top + b.outerHeight(), this.scrollLeft(c) > b.offset().left]
        },
        visible: function(a) {
            for (var c = a.length; c--; )
                if (a[c])
                    return !1;
            return !0
        },
        nub_position: function(a, c, d) {
            "auto" === c ? a.addClass(d) : a.addClass(c)
        },
        startTimer: function() {
            this.settings.$li.length ? this.settings.automate = setTimeout(function() {
                this.hide();
                this.show();
                this.startTimer()
            }
            .bind(this), this.settings.timer) : clearTimeout(this.settings.automate)
        },
        end: function() {
            this.settings.cookieMonster && a.cookie(this.settings.cookieName, "ridden", {
                expires: this.settings.cookieExpires,
                domain: this.settings.cookieDomain
            });
            0 < this.settings.timer && clearTimeout(this.settings.automate);
            this.settings.modal && this.settings.expose && this.un_expose();
            this.settings.$next_tip.data("closed", !0);
            a(".joyride-modal-bg").hide();
            this.settings.$current_tip.hide();
            this.settings.postStepCallback(this.settings.$li.index(), this.settings.$current_tip);
            this.settings.postRideCallback(this.settings.$li.index(), this.settings.$current_tip);
            a(".joyride-tip-guide").remove()
        },
        outerHTML: function(a) {
            return a.outerHTML || (new XMLSerializer).serializeToString(a)
        },
        off: function() {
            a(this.scope).off(".joyride");
            a(g).off(".joyride");
            a(".joyride-close-tip, .joyride-next-tip, .joyride-modal-bg").off(".joyride");
            a(".joyride-tip-guide, .joyride-modal-bg").remove();
            clearTimeout(this.settings.automate);
            this.settings = {}
        },
        reflow: function() {}
    }
}
)(Foundation.zj, this, this.document);
(function(a, g, f, e) {
    Foundation.libs.magellan = {
        name: "magellan",
        version: "4.3.2",
        settings: {
            activeClass: "active",
            threshold: 0
        },
        init: function(d, b, c) {
            return this.scope = d || this.scope,
            Foundation.inherit(this, "data_options"),
            "object" == typeof b && a.extend(!0, this.settings, b),
            "string" != typeof b ? (this.settings.init || (this.fixed_magellan = a("[data-magellan-expedition]"),
            this.set_threshold(),
            this.last_destination = a("[data-magellan-destination]").last(),
            this.events()),
            this.settings.init) : this[b].call(this, c)
        },
        events: function() {
            var d = this;
            a(this.scope).on("arrival.fndtn.magellan", "[data-magellan-arrival]", function(b) {
                b = a(this);
                var c = b.closest("[data-magellan-expedition]").attr("data-magellan-active-class") || d.settings.activeClass;
                b.closest("[data-magellan-expedition]").find("[data-magellan-arrival]").not(b).removeClass(c);
                b.addClass(c)
            });
            this.fixed_magellan.on("update-position.fndtn.magellan", function() {
                a(this)
            }).trigger("update-position");
            a(g).on("resize.fndtn.magellan", function() {
                this.fixed_magellan.trigger("update-position")
            }
            .bind(this)).on("scroll.fndtn.magellan", function() {
                var b = a(g).scrollTop();
                d.fixed_magellan.each(function() {
                    var c = a(this);
                    "undefined" == typeof c.data("magellan-top-offset") && c.data("magellan-top-offset", c.offset().top);
                    "undefined" == typeof c.data("magellan-fixed-position") && c.data("magellan-fixed-position", !1);
                    var e = b + d.settings.threshold > c.data("magellan-top-offset")
                      , f = c.attr("data-magellan-top-offset");
                    c.data("magellan-fixed-position") != e && (c.data("magellan-fixed-position", e),
                    e ? (c.addClass("fixed"),
                    c.css({
                        position: "fixed",
                        top: 0
                    })) : (c.removeClass("fixed"),
                    c.css({
                        position: "",
                        top: ""
                    })),
                    e && "undefined" != typeof f && 0 != f && c.css({
                        position: "fixed",
                        top: f + "px"
                    }))
                })
            });
            0 < this.last_destination.length && a(g).on("scroll.fndtn.magellan", function(b) {
                var c = a(g).scrollTop()
                  , e = c + a(g).height()
                  , f = Math.ceil(d.last_destination.offset().top);
                a("[data-magellan-destination]").each(function() {
                    var b = a(this)
                      , g = b.attr("data-magellan-destination");
                    b.offset().top - c <= d.settings.threshold && a("[data-magellan-arrival='" + g + "']").trigger("arrival");
                    e >= a(d.scope).height() && f > c && f < e && a("[data-magellan-arrival]").last().trigger("arrival")
                })
            });
            this.settings.init = !0
        },
        set_threshold: function() {
            "number" != typeof this.settings.threshold && (this.settings.threshold = 0 < this.fixed_magellan.length ? this.outerHeight(this.fixed_magellan, !0) : 0)
        },
        off: function() {
            a(this.scope).off(".fndtn.magellan");
            a(g).off(".fndtn.magellan")
        },
        reflow: function() {}
    }
}
)(Foundation.zj, this, this.document);
(function(a, g, f, e) {
    var d = function() {}
      , b = function(b, d) {
        if (b.hasClass(d.slides_container_class))
            return this;
        var q = this, p, r, s, u, v = 0, x, B;
        b.children().first().addClass(d.active_slide_class);
        q.update_slide_number = function(c) {
            d.slide_number && (r.find("span:first").text(parseInt(c) + 1),
            r.find("span:last").text(b.children().length));
            d.bullets && (s.children().removeClass(d.bullets_active_class),
            a(s.children().get(c)).addClass(d.bullets_active_class))
        }
        ;
        q.update_active_link = function(c) {
            c = a('a[data-orbit-link="' + b.children().eq(c).attr("data-orbit-slide") + '"]');
            c.parents("ul").find("[data-orbit-link]").removeClass(d.bullets_active_class);
            c.addClass(d.bullets_active_class)
        }
        ;
        q.build_markup = function() {
            b.wrap('<div class="' + d.container_class + '"></div>');
            p = b.parent();
            b.addClass(d.slides_container_class);
            d.navigation_arrows && (p.append(a('<a href="#"><span></span></a>').addClass(d.prev_class)),
            p.append(a('<a href="#"><span></span></a>').addClass(d.next_class)));
            d.timer && (u = a("<div>").addClass(d.timer_container_class),
            u.append("<span>"),
            u.append(a("<div>").addClass(d.timer_progress_class)),
            u.addClass(d.timer_paused_class),
            p.append(u));
            d.slide_number && (r = a("<div>").addClass(d.slide_number_class),
            r.append("<span></span> " + d.slide_number_text + " <span></span>"),
            p.append(r));
            d.bullets && (s = a("<ol>").addClass(d.bullets_container_class),
            p.append(s),
            b.children().each(function(b, c) {
                var d = a("<li>").attr("data-orbit-slide", b);
                s.append(d)
            }));
            d.stack_on_small && p.addClass(d.stack_on_small_class);
            q.update_slide_number(0);
            q.update_active_link(0)
        }
        ;
        q._goto = function(c, e) {
            if (c === v)
                return !1;
            "object" == typeof B && B.restart();
            var f = b.children()
              , g = "next";
            c < v && (g = "prev");
            c >= f.length ? c = 0 : 0 > c && (c = f.length - 1);
            var h = a(f.get(v))
              , m = a(f.get(c));
            h.css("zIndex", 2);
            h.removeClass(d.active_slide_class);
            m.css("zIndex", 4).addClass(d.active_slide_class);
            b.trigger("orbit:before-slide-change");
            d.before_slide_change();
            q.update_active_link(c);
            var p = function() {
                var a = function() {
                    v = c;
                    !0 === e && (B = q.create_timer(),
                    B.start());
                    q.update_slide_number(v);
                    b.trigger("orbit:after-slide-change", [{
                        slide_number: v,
                        total_slides: f.length
                    }]);
                    d.after_slide_change(v, f.length)
                };
                b.height() != m.height() && d.variable_height ? b.animate({
                    height: m.height()
                }, 250, "linear", a) : a()
            };
            if (1 === f.length)
                return p(),
                !1;
            var r = function() {
                "next" === g && x.next(h, m, p);
                "prev" === g && x.prev(h, m, p)
            };
            m.height() > b.height() && d.variable_height ? b.animate({
                height: m.height()
            }, 250, "linear", r) : r()
        }
        ;
        q.next = function(a) {
            a.stopImmediatePropagation();
            a.preventDefault();
            q._goto(v + 1)
        }
        ;
        q.prev = function(a) {
            a.stopImmediatePropagation();
            a.preventDefault();
            q._goto(v - 1)
        }
        ;
        q.link_custom = function(b) {
            b.preventDefault();
            b = a(this).attr("data-orbit-link");
            "string" == typeof b && "" != (b = a.trim(b)) && (b = p.find("[data-orbit-slide=" + b + "]"),
            -1 != b.index() && q._goto(b.index()))
        }
        ;
        q.link_bullet = function(b) {
            b = a(this).attr("data-orbit-slide");
            "string" == typeof b && "" != (b = a.trim(b)) && q._goto(parseInt(b))
        }
        ;
        q.timer_callback = function() {
            q._goto(v + 1, !0)
        }
        ;
        q.compute_dimensions = function() {
            var c = a(b.children().get(v)).height();
            d.variable_height || b.children().each(function() {
                a(this).height() > c && (c = a(this).height())
            });
            b.height(c)
        }
        ;
        q.create_timer = function() {
            return new c(p.find("." + d.timer_container_class),d,q.timer_callback)
        }
        ;
        q.stop_timer = function() {
            "object" == typeof B && B.stop()
        }
        ;
        q.toggle_timer = function() {
            p.find("." + d.timer_container_class).hasClass(d.timer_paused_class) ? ("undefined" == typeof B && (B = q.create_timer()),
            B.start()) : "object" == typeof B && B.stop()
        }
        ;
        q.init = function() {
            q.build_markup();
            d.timer && (B = q.create_timer(),
            B.start());
            x = new m(d,b);
            "slide" === d.animation && (x = new h(d,b));
            p.on("click", "." + d.next_class, q.next);
            p.on("click", "." + d.prev_class, q.prev);
            p.on("click", "[data-orbit-slide]", q.link_bullet);
            p.on("click", q.toggle_timer);
            d.swipe && p.on("touchstart.fndtn.orbit", function(a) {
                a.touches || (a = a.originalEvent);
                var b = {
                    start_page_x: a.touches[0].pageX,
                    start_page_y: a.touches[0].pageY,
                    start_time: (new Date).getTime(),
                    delta_x: 0,
                    is_scrolling: e
                };
                p.data("swipe-transition", b);
                a.stopPropagation()
            }).on("touchmove.fndtn.orbit", function(a) {
                a.touches || (a = a.originalEvent);
                if (!(1 < a.touches.length || a.scale && 1 !== a.scale)) {
                    var b = p.data("swipe-transition");
                    "undefined" == typeof b && (b = {});
                    b.delta_x = a.touches[0].pageX - b.start_page_x;
                    "undefined" == typeof b.is_scrolling && (b.is_scrolling = !!(b.is_scrolling || Math.abs(b.delta_x) < Math.abs(a.touches[0].pageY - b.start_page_y)));
                    b.is_scrolling || b.active || (a.preventDefault(),
                    a = 0 > b.delta_x ? v + 1 : v - 1,
                    b.active = !0,
                    q._goto(a))
                }
            }).on("touchend.fndtn.orbit", function(a) {
                p.data("swipe-transition", {});
                a.stopPropagation()
            });
            p.on("mouseenter.fndtn.orbit", function(a) {
                d.timer && d.pause_on_hover && q.stop_timer()
            }).on("mouseleave.fndtn.orbit", function(a) {
                d.timer && d.resume_on_mouseout && B.start()
            });
            a(f).on("click", "[data-orbit-link]", q.link_custom);
            a(g).on("resize", q.compute_dimensions);
            a(g).on("load", q.compute_dimensions);
            a(g).on("load", function() {
                p.prev(".preloader").css("display", "none")
            });
            b.trigger("orbit:ready")
        }
        ;
        q.init()
    }
      , c = function(a, b, c) {
        var d = this, e = b.timer_speed, f = a.find("." + b.timer_progress_class), g, h, m = -1;
        this.update_progress = function(a) {
            var b = f.clone();
            b.attr("style", "");
            b.css("width", a + "%");
            f.replaceWith(b);
            f = b
        }
        ;
        this.restart = function() {
            clearTimeout(h);
            a.addClass(b.timer_paused_class);
            m = -1;
            d.update_progress(0)
        }
        ;
        this.start = function() {
            if (!a.hasClass(b.timer_paused_class))
                return !0;
            m = -1 === m ? e : m;
            a.removeClass(b.timer_paused_class);
            g = (new Date).getTime();
            f.animate({
                width: "100%"
            }, m, "linear");
            h = setTimeout(function() {
                d.restart();
                c()
            }, m);
            a.trigger("orbit:timer-started")
        }
        ;
        this.stop = function() {
            if (a.hasClass(b.timer_paused_class))
                return !0;
            clearTimeout(h);
            a.addClass(b.timer_paused_class);
            var c = (new Date).getTime();
            m -= c - g;
            d.update_progress(100 - m / e * 100);
            a.trigger("orbit:timer-stopped")
        }
    }
      , h = function(b, c) {
        var d = b.animation_speed
          , e = 1 === a("html[dir=rtl]").length ? "marginRight" : "marginLeft"
          , f = {};
        f[e] = "0%";
        this.next = function(a, b, c) {
            b.animate(f, d, "linear", function() {
                a.css(e, "100%");
                c()
            })
        }
        ;
        this.prev = function(a, b, c) {
            b.css(e, "-100%");
            b.animate(f, d, "linear", function() {
                a.css(e, "100%");
                c()
            })
        }
    }
      , m = function(b, c) {
        var d = b.animation_speed;
        a("html[dir=rtl]");
        this.next = function(a, b, c) {
            b.css({
                margin: "0%",
                opacity: "0.01"
            });
            b.animate({
                opacity: "1"
            }, d, "linear", function() {
                a.css("margin", "100%");
                c()
            })
        }
        ;
        this.prev = function(a, b, c) {
            b.css({
                margin: "0%",
                opacity: "0.01"
            });
            b.animate({
                opacity: "1"
            }, d, "linear", function() {
                a.css("margin", "100%");
                c()
            })
        }
    };
    Foundation.libs = Foundation.libs || {};
    Foundation.libs.orbit = {
        name: "orbit",
        version: "4.3.2",
        settings: {
            animation: "slide",
            timer_speed: 1E4,
            pause_on_hover: !0,
            resume_on_mouseout: !1,
            animation_speed: 500,
            stack_on_small: !1,
            navigation_arrows: !0,
            slide_number: !0,
            slide_number_text: "of",
            container_class: "orbit-container",
            stack_on_small_class: "orbit-stack-on-small",
            next_class: "orbit-next",
            prev_class: "orbit-prev",
            timer_container_class: "orbit-timer",
            timer_paused_class: "paused",
            timer_progress_class: "orbit-progress",
            slides_container_class: "orbit-slides-container",
            bullets_container_class: "orbit-bullets",
            bullets_active_class: "active",
            slide_number_class: "orbit-slide-number",
            caption_class: "orbit-caption",
            active_slide_class: "active",
            orbit_transition_class: "orbit-transitioning",
            bullets: !0,
            timer: !0,
            variable_height: !1,
            swipe: !0,
            before_slide_change: d,
            after_slide_change: d
        },
        init: function(c, d, e) {
            var f = this;
            Foundation.inherit(f, "data_options");
            "object" == typeof d && a.extend(!0, f.settings, d);
            a(c).is("[data-orbit]") && (d = a(c),
            e = f.data_options(d),
            new b(d,a.extend({}, f.settings, e)));
            a("[data-orbit]", c).each(function(c, d) {
                var e = a(d)
                  , g = f.data_options(e);
                new b(e,a.extend({}, f.settings, g))
            })
        }
    }
}
)(Foundation.zj, this, this.document);
(function(a, g, f, e) {
    Foundation.libs.reveal = {
        name: "reveal",
        version: "4.3.2",
        locked: !1,
        settings: {
            animation: "fadeAndPop",
            animationSpeed: 250,
            closeOnBackgroundClick: !0,
            closeOnEsc: !0,
            dismissModalClass: "close-reveal-modal",
            bgClass: "reveal-modal-bg",
            open: function() {},
            opened: function() {},
            close: function() {},
            closed: function() {},
            bg: a(".reveal-modal-bg"),
            css: {
                open: {
                    opacity: 0,
                    visibility: "visible",
                    display: "block"
                },
                close: {
                    opacity: 1,
                    visibility: "hidden",
                    display: "none"
                }
            }
        },
        init: function(d, b, c) {
            return Foundation.inherit(this, "data_options delay"),
            "object" == typeof b ? a.extend(!0, this.settings, b) : "undefined" != typeof c && a.extend(!0, this.settings, c),
            "string" != typeof b ? (this.events(),
            this.settings.init) : this[b].call(this, c)
        },
        events: function() {
            var d = this;
            return a(this.scope).off(".fndtn.reveal").on("click.fndtn.reveal", "[data-reveal-id]", function(b) {
                b.preventDefault();
                if (!d.locked) {
                    b = a(this);
                    var c = b.data("reveal-ajax");
                    d.locked = !0;
                    "undefined" == typeof c ? d.open.call(d, b) : (c = !0 === c ? b.attr("href") : c,
                    d.open.call(d, b, {
                        url: c
                    }))
                }
            }).on("click.fndtn.reveal touchend", this.close_targets(), function(b) {
                b.preventDefault();
                if (!d.locked) {
                    var c = a.extend({}, d.settings, d.data_options(a(".reveal-modal.open")));
                    b = a(b.target)[0] === a("." + c.bgClass)[0];
                    if (!b || c.closeOnBackgroundClick)
                        d.locked = !0,
                        d.close.call(d, b ? a(".reveal-modal.open") : a(this).closest(".reveal-modal"))
                }
            }),
            a(this.scope).hasClass("reveal-modal") ? a(this.scope).on("open.fndtn.reveal", this.settings.open).on("opened.fndtn.reveal", this.settings.opened).on("opened.fndtn.reveal", this.open_video).on("close.fndtn.reveal", this.settings.close).on("closed.fndtn.reveal", this.settings.closed).on("closed.fndtn.reveal", this.close_video) : a(this.scope).on("open.fndtn.reveal", ".reveal-modal", this.settings.open).on("opened.fndtn.reveal", ".reveal-modal", this.settings.opened).on("opened.fndtn.reveal", ".reveal-modal", this.open_video).on("close.fndtn.reveal", ".reveal-modal", this.settings.close).on("closed.fndtn.reveal", ".reveal-modal", this.settings.closed).on("closed.fndtn.reveal", ".reveal-modal", this.close_video),
            a("body").bind("keyup.reveal", function(b) {
                var c = a(".reveal-modal.open")
                  , e = a.extend({}, d.settings, d.data_options(c));
                27 === b.which && e.closeOnEsc && c.foundation("reveal", "close")
            }),
            !0
        },
        open: function(d, b) {
            if (d)
                if ("undefined" != typeof d.selector)
                    var c = a("#" + d.data("reveal-id"));
                else
                    c = a(this.scope),
                    b = d;
            else
                c = a(this.scope);
            if (!c.hasClass("open")) {
                var e = a(".reveal-modal.open");
                "undefined" == typeof c.data("css-top") && c.data("css-top", parseInt(c.css("top"), 10)).data("offset", this.cache_offset(c));
                c.trigger("open");
                1 > e.length && this.toggle_bg();
                if ("undefined" != typeof b && b.url) {
                    var f = this
                      , g = "undefined" != typeof b.success ? b.success : null;
                    a.extend(b, {
                        success: function(b, d, p) {
                            a.isFunction(g) && g(b, d, p);
                            c.html(b);
                            a(c).foundation("section", "reflow");
                            f.hide(e, f.settings.css.close);
                            f.show(c, f.settings.css.open)
                        }
                    });
                    a.ajax(b)
                } else
                    this.hide(e, this.settings.css.close),
                    this.show(c, this.settings.css.open)
            }
        },
        close: function(d) {
            d = d && d.length ? d : a(this.scope);
            var b = a(".reveal-modal.open");
            0 < b.length && (this.locked = !0,
            d.trigger("close"),
            this.toggle_bg(),
            this.hide(b, this.settings.css.close))
        },
        close_targets: function() {
            var a = "." + this.settings.dismissModalClass;
            return this.settings.closeOnBackgroundClick ? a + ", ." + this.settings.bgClass : a
        },
        toggle_bg: function() {
            0 === a("." + this.settings.bgClass).length && (this.settings.bg = a("<div />", {
                "class": this.settings.bgClass
            }).appendTo("body"));
            0 < this.settings.bg.filter(":visible").length ? this.hide(this.settings.bg) : this.show(this.settings.bg)
        },
        show: function(d, b) {
            if (b) {
                if (0 === d.parent("body").length) {
                    var c = d.wrap('<div style="display: none;" />').parent();
                    d.on("closed.fndtn.reveal.wrapped", function() {
                        d.detach().appendTo(c);
                        d.unwrap().unbind("closed.fndtn.reveal.wrapped")
                    });
                    d.detach().appendTo("body")
                }
                if (/pop/i.test(this.settings.animation)) {
                    b.top = a(g).scrollTop() - d.data("offset") + "px";
                    var e = {
                        top: a(g).scrollTop() + d.data("css-top") + "px",
                        opacity: 1
                    };
                    return this.delay(function() {
                        return d.css(b).animate(e, this.settings.animationSpeed, "linear", function() {
                            this.locked = !1;
                            d.trigger("opened")
                        }
                        .bind(this)).addClass("open")
                    }
                    .bind(this), this.settings.animationSpeed / 2)
                }
                return /fade/i.test(this.settings.animation) ? (e = {
                    opacity: 1
                },
                this.delay(function() {
                    return d.css(b).animate(e, this.settings.animationSpeed, "linear", function() {
                        this.locked = !1;
                        d.trigger("opened")
                    }
                    .bind(this)).addClass("open")
                }
                .bind(this), this.settings.animationSpeed / 2)) : d.css(b).show().css({
                    opacity: 1
                }).addClass("open").trigger("opened")
            }
            return /fade/i.test(this.settings.animation) ? d.fadeIn(this.settings.animationSpeed / 2) : d.show()
        },
        hide: function(d, b) {
            if (b) {
                if (/pop/i.test(this.settings.animation)) {
                    var c = {
                        top: -a(g).scrollTop() - d.data("offset") + "px",
                        opacity: 0
                    };
                    return this.delay(function() {
                        return d.animate(c, this.settings.animationSpeed, "linear", function() {
                            this.locked = !1;
                            d.css(b).trigger("closed")
                        }
                        .bind(this)).removeClass("open")
                    }
                    .bind(this), this.settings.animationSpeed / 2)
                }
                return /fade/i.test(this.settings.animation) ? (c = {
                    opacity: 0
                },
                this.delay(function() {
                    return d.animate(c, this.settings.animationSpeed, "linear", function() {
                        this.locked = !1;
                        d.css(b).trigger("closed")
                    }
                    .bind(this)).removeClass("open")
                }
                .bind(this), this.settings.animationSpeed / 2)) : d.hide().css(b).removeClass("open").trigger("closed")
            }
            return /fade/i.test(this.settings.animation) ? d.fadeOut(this.settings.animationSpeed / 2) : d.hide()
        },
        close_video: function(d) {
            d = a(this).find(".flex-video");
            var b = d.find("iframe");
            0 < b.length && (b.attr("data-src", b[0].src),
            b.attr("src", "about:blank"),
            d.hide())
        },
        open_video: function(d) {
            d = a(this).find(".flex-video");
            var b = d.find("iframe");
            if (0 < b.length) {
                if ("string" == typeof b.attr("data-src"))
                    b[0].src = b.attr("data-src");
                else {
                    var c = b[0].src;
                    b[0].src = e;
                    b[0].src = c
                }
                d.show()
            }
        },
        cache_offset: function(a) {
            var b = a.show().height() + parseInt(a.css("top"), 10);
            return a.hide(),
            b
        },
        off: function() {
            a(this.scope).off(".fndtn.reveal")
        },
        reflow: function() {}
    }
}
)(Foundation.zj, this, this.document);
(function(a, g, f) {
    Foundation.libs.section = {
        name: "section",
        version: "4.3.2",
        settings: {
            deep_linking: !1,
            small_breakpoint: 768,
            one_up: !0,
            multi_expand: !1,
            section_selector: "[data-section]",
            region_selector: "section, .section, [data-section-region]",
            title_selector: ".title, [data-section-title]",
            resized_data_attr: "data-section-resized",
            small_style_data_attr: "data-section-small-style",
            content_selector: ".content, [data-section-content]",
            nav_selector: '[data-section="vertical-nav"], [data-section="horizontal-nav"]',
            active_class: "active",
            callback: function() {}
        },
        init: function(e, d, b) {
            return Foundation.inherit(this, "throttle data_options position_right offset_right"),
            "object" == typeof d && a.extend(!0, this.settings, d),
            "string" != typeof d ? (this.events(),
            !0) : this[d].call(this, b)
        },
        events: function() {
            for (var e = this, d = [], b = e.settings.section_selector, c = e.settings.region_selector.split(","), h = e.settings.title_selector.split(","), m = 0, l = c.length; m < l; m++)
                for (var n = c[m], q = 0, p = h.length; q < p; q++) {
                    var r = b + ">" + n + ">" + h[q];
                    d.push(r + " a");
                    d.push(r)
                }
            a(e.scope).on("click.fndtn.section", d.join(","), function(b) {
                var c = a(this).closest(e.settings.title_selector);
                e.close_navs(c);
                0 < c.siblings(e.settings.content_selector).length && e.toggle_active.call(c[0], b)
            });
            a(g).on("resize.fndtn.section", e.throttle(function() {
                e.resize()
            }, 30)).on("hashchange.fndtn.section", e.set_active_from_hash);
            a(f).on("click.fndtn.section", function(b) {
                b.isPropagationStopped && b.isPropagationStopped() || b.target !== f && e.close_navs(a(b.target).closest(e.settings.title_selector))
            });
            a(g).triggerHandler("resize.fndtn.section");
            a(g).triggerHandler("hashchange.fndtn.section")
        },
        close_navs: function(e) {
            var d = Foundation.libs.section
              , b = a(d.settings.nav_selector).filter(function() {
                return !a.extend({}, d.settings, d.data_options(a(this))).one_up
            });
            if (0 < e.length) {
                var c = e.parent().parent();
                if (d.is_horizontal_nav(c) || d.is_vertical_nav(c))
                    b = b.filter(function() {
                        return this !== c[0]
                    })
            }
            b.children(d.settings.region_selector).removeClass(d.settings.active_class)
        },
        toggle_active: function(e) {
            var d = a(this)
              , b = Foundation.libs.section
              , c = d.parent()
              , d = d.siblings(b.settings.content_selector)
              , f = c.parent()
              , g = a.extend({}, b.settings, b.data_options(f))
              , l = f.children(b.settings.region_selector).filter("." + b.settings.active_class);
            !g.deep_linking && 0 < d.length && e.preventDefault();
            e.stopPropagation();
            if (!c.hasClass(b.settings.active_class)) {
                if (!b.is_accordion(f) || b.is_accordion(f) && !b.settings.multi_expand)
                    l.removeClass(b.settings.active_class),
                    l.trigger("closed.fndtn.section");
                c.addClass(b.settings.active_class);
                b.resize(c.find(b.settings.section_selector).not("[" + b.settings.resized_data_attr + "]"), !0);
                c.trigger("opened.fndtn.section")
            } else if (c.hasClass(b.settings.active_class) && b.is_accordion(f) || !g.one_up && (b.small(f) || b.is_vertical_nav(f) || b.is_horizontal_nav(f) || b.is_accordion(f)))
                c.removeClass(b.settings.active_class),
                c.trigger("closed.fndtn.section");
            g.callback(f)
        },
        check_resize_timer: null,
        resize: function(e, d) {
            var b = Foundation.libs.section
              , c = a(b.settings.section_selector)
              , f = b.small(c)
              , g = function(a, c) {
                return !b.is_accordion(a) && !a.is("[" + b.settings.resized_data_attr + "]") && (!f || b.is_horizontal_tabs(a)) && c === ("none" === a.css("display") || !a.parent().is(":visible"))
            };
            e = e || a(b.settings.section_selector);
            clearTimeout(b.check_resize_timer);
            f || e.removeAttr(b.settings.small_style_data_attr);
            e.filter(function() {
                return g(a(this), !1)
            }).each(function() {
                var c = a(this)
                  , e = c.children(b.settings.region_selector)
                  , f = e.children(b.settings.title_selector)
                  , g = e.children(b.settings.content_selector)
                  , h = 0;
                if (d && 0 == c.children(b.settings.region_selector).filter("." + b.settings.active_class).length) {
                    var m = a.extend({}, b.settings, b.data_options(c));
                    m.deep_linking || !m.one_up && (b.is_horizontal_nav(c) || b.is_vertical_nav(c) || b.is_accordion(c)) || e.filter(":visible").first().addClass(b.settings.active_class)
                }
                if (b.is_horizontal_tabs(c) || b.is_auto(c)) {
                    var u = 0;
                    f.each(function() {
                        var c = a(this);
                        if (c.is(":visible")) {
                            c.css(b.rtl ? "right" : "left", u);
                            var d = parseInt(c.css("border-" + (b.rtl ? "left" : "right") + "-width"), 10);
                            "Nan" === d.toString() && (d = 0);
                            u += b.outerWidth(c) - d;
                            h = Math.max(h, b.outerHeight(c))
                        }
                    });
                    f.css("height", h);
                    e.each(function() {
                        var c = a(this)
                          , d = c.children(b.settings.content_selector)
                          , d = parseInt(d.css("border-top-width"), 10);
                        "Nan" === d.toString() && (d = 0);
                        c.css("padding-top", h - d)
                    });
                    c.css("min-height", h)
                } else if (b.is_horizontal_nav(c)) {
                    var v = !0;
                    f.each(function() {
                        h = Math.max(h, b.outerHeight(a(this)))
                    });
                    e.each(function() {
                        var d = a(this);
                        d.css("margin-left", "-" + (v ? c : d.children(b.settings.title_selector)).css("border-left-width"));
                        v = !1
                    });
                    e.css("margin-top", "-" + c.css("border-top-width"));
                    f.css("height", h);
                    g.css("top", h);
                    c.css("min-height", h)
                } else if (b.is_vertical_tabs(c)) {
                    var x = 0;
                    f.each(function() {
                        var c = a(this);
                        if (c.is(":visible")) {
                            c.css("top", x);
                            var d = parseInt(c.css("border-top-width"), 10);
                            "Nan" === d.toString() && (d = 0);
                            x += b.outerHeight(c) - d
                        }
                    });
                    g.css("min-height", x + 1)
                } else if (b.is_vertical_nav(c)) {
                    var B = 0
                      , C = !0;
                    f.each(function() {
                        B = Math.max(B, b.outerWidth(a(this)))
                    });
                    e.each(function() {
                        var d = a(this);
                        d.css("margin-top", "-" + (C ? c : d.children(b.settings.title_selector)).css("border-top-width"));
                        C = !1
                    });
                    f.css("width", B);
                    g.css(b.rtl ? "right" : "left", B);
                    c.css("width", B)
                }
                c.attr(b.settings.resized_data_attr, !0)
            });
            0 < a(b.settings.section_selector).filter(function() {
                return g(a(this), !0)
            }).length && (b.check_resize_timer = setTimeout(function() {
                b.resize(e.filter(function() {
                    return g(a(this), !1)
                }), !0)
            }, 700));
            f && e.attr(b.settings.small_style_data_attr, !0)
        },
        is_vertical_nav: function(a) {
            return /vertical-nav/i.test(a.data("section"))
        },
        is_horizontal_nav: function(a) {
            return /horizontal-nav/i.test(a.data("section"))
        },
        is_accordion: function(a) {
            return /accordion/i.test(a.data("section"))
        },
        is_horizontal_tabs: function(a) {
            return /^tabs$/i.test(a.data("section"))
        },
        is_vertical_tabs: function(a) {
            return /vertical-tabs/i.test(a.data("section"))
        },
        is_auto: function(a) {
            a = a.data("section");
            return "" === a || /auto/i.test(a)
        },
        set_active_from_hash: function() {
            var e = Foundation.libs.section, d = g.location.hash.substring(1), b = a(e.settings.section_selector), c;
            b.each(function() {
                var b = a(this);
                b.children(e.settings.region_selector).each(function() {
                    var f = a(this).children(e.settings.content_selector).data("slug");
                    if (RegExp(f, "i").test(d))
                        return c = b,
                        !1
                });
                if (null != c)
                    return !1
            });
            null != c && b.each(function() {
                if (c == a(this)) {
                    var b = a(this)
                      , f = a.extend({}, e.settings, e.data_options(b))
                      , g = b.children(e.settings.region_selector)
                      , n = f.deep_linking && 0 < d.length
                      , q = !1;
                    g.each(function() {
                        var b = a(this);
                        if (q)
                            b.removeClass(e.settings.active_class);
                        else if (n) {
                            var c = b.children(e.settings.content_selector).data("slug");
                            c && RegExp(c, "i").test(d) ? (b.hasClass(e.settings.active_class) || b.addClass(e.settings.active_class),
                            q = !0) : b.removeClass(e.settings.active_class)
                        } else
                            b.hasClass(e.settings.active_class) && (q = !0)
                    });
                    q || !f.one_up && (e.is_horizontal_nav(b) || e.is_vertical_nav(b) || e.is_accordion(b)) || g.filter(":visible").first().addClass(e.settings.active_class)
                }
            })
        },
        reflow: function() {
            var e = Foundation.libs.section;
            a(e.settings.section_selector).removeAttr(e.settings.resized_data_attr);
            e.throttle(function() {
                e.resize()
            }, 30)()
        },
        small: function(e) {
            var d = a.extend({}, this.settings, this.data_options(e));
            return this.is_horizontal_tabs(e) ? !1 : e && this.is_accordion(e) ? !0 : a("html").hasClass("lt-ie9") ? !0 : a("html").hasClass("ie8compat") ? !0 : a(this.scope).width() < d.small_breakpoint
        },
        off: function() {
            a(this.scope).off(".fndtn.section");
            a(g).off(".fndtn.section");
            a(f).off(".fndtn.section")
        }
    };
    a.fn.reflow_section = function(a) {
        var d = this
          , b = Foundation.libs.section;
        return d.removeAttr(b.settings.resized_data_attr),
        b.throttle(function() {
            b.resize(d, a)
        }, 30)(),
        this
    }
}
)(Foundation.zj, window, document);
(function(a, g, f, e) {
    Foundation.libs.tooltips = {
        name: "tooltips",
        version: "4.3.2",
        settings: {
            selector: ".has-tip",
            additionalInheritableClasses: [],
            tooltipClass: ".tooltip",
            touchCloseText: "tap to close",
            appendTo: "body",
            "disable-for-touch": !1,
            tipTemplate: function(a, b) {
                return '<span data-selector="' + a + '" class="' + Foundation.libs.tooltips.settings.tooltipClass.substring(1) + '">' + b + '<span class="nub"></span></span>'
            }
        },
        cache: {},
        init: function(d, b, c) {
            Foundation.inherit(this, "data_options");
            var e = this;
            "object" == typeof b ? a.extend(!0, this.settings, b) : "undefined" != typeof c && a.extend(!0, this.settings, c);
            if ("string" == typeof b)
                return this[b].call(this, c);
            Modernizr.touch ? a(this.scope).on("click.fndtn.tooltip touchstart.fndtn.tooltip touchend.fndtn.tooltip", "[data-tooltip]", function(b) {
                var c = a.extend({}, e.settings, e.data_options(a(this)));
                c["disable-for-touch"] || (b.preventDefault(),
                a(c.tooltipClass).hide(),
                e.showOrCreateTip(a(this)))
            }).on("click.fndtn.tooltip touchstart.fndtn.tooltip touchend.fndtn.tooltip", this.settings.tooltipClass, function(b) {
                b.preventDefault();
                a(this).fadeOut(150)
            }) : a(this.scope).on("mouseenter.fndtn.tooltip mouseleave.fndtn.tooltip", "[data-tooltip]", function(b) {
                var c = a(this);
                /enter|over/i.test(b.type) ? e.showOrCreateTip(c) : ("mouseout" === b.type || "mouseleave" === b.type) && e.hide(c)
            })
        },
        showOrCreateTip: function(a) {
            var b = this.getTip(a);
            return b && 0 < b.length ? this.show(a) : this.create(a)
        },
        getTip: function(d) {
            d = this.selector(d);
            var b = null;
            return d && (b = a('span[data-selector="' + d + '"]' + this.settings.tooltipClass)),
            "object" == typeof b ? b : !1
        },
        selector: function(a) {
            var b = a.attr("id")
              , c = a.attr("data-tooltip") || a.attr("data-selector");
            return (b && 1 > b.length || !b) && "string" != typeof c && (c = "tooltip" + Math.random().toString(36).substring(7),
            a.attr("data-selector", c)),
            b && 0 < b.length ? b : c
        },
        create: function(d) {
            var b = a(this.settings.tipTemplate(this.selector(d), a("<div></div>").html(d.attr("title")).html()))
              , c = this.inheritable_classes(d);
            b.addClass(c).appendTo(this.settings.appendTo);
            Modernizr.touch && b.append('<span class="tap-to-close">' + this.settings.touchCloseText + "</span>");
            d.removeAttr("title").attr("title", "");
            this.show(d)
        },
        reposition: function(d, b, c) {
            var e, f, l, n;
            b.css("visibility", "hidden").show();
            e = d.data("width");
            f = b.children(".nub");
            l = this.outerHeight(f);
            this.outerHeight(f);
            n = function(a, b, c, d, e, f) {
                return a.css({
                    top: b ? b : "auto",
                    bottom: d ? d : "auto",
                    left: e ? e : "auto",
                    right: c ? c : "auto",
                    width: f ? f : "auto"
                }).end()
            }
            ;
            n(b, d.offset().top + this.outerHeight(d) + 10, "auto", "auto", d.offset().left, e);
            767 > a(g).width() ? (n(b, d.offset().top + this.outerHeight(d) + 10, "auto", "auto", 12.5, a(this.scope).width()),
            b.addClass("tip-override"),
            n(f, -l, "auto", "auto", d.offset().left)) : (f = d.offset().left,
            Foundation.rtl && (f = d.offset().left + d.offset().width - this.outerWidth(b)),
            n(b, d.offset().top + this.outerHeight(d) + 10, "auto", "auto", f, e),
            b.removeClass("tip-override"),
            c && -1 < c.indexOf("tip-top") ? n(b, d.offset().top - this.outerHeight(b), "auto", "auto", f, e).removeClass("tip-override") : c && -1 < c.indexOf("tip-left") ? n(b, d.offset().top + this.outerHeight(d) / 2 - 2.5 * l, "auto", "auto", d.offset().left - this.outerWidth(b) - l, e).removeClass("tip-override") : c && -1 < c.indexOf("tip-right") && n(b, d.offset().top + this.outerHeight(d) / 2 - 2.5 * l, "auto", "auto", d.offset().left + this.outerWidth(d) + l, e).removeClass("tip-override"));
            b.css("visibility", "visible").hide()
        },
        inheritable_classes: function(d) {
            var b = ["tip-top", "tip-left", "tip-bottom", "tip-right", "noradius"].concat(this.settings.additionalInheritableClasses);
            d = (d = d.attr("class")) ? a.map(d.split(" "), function(c, d) {
                if (-1 !== a.inArray(c, b))
                    return c
            }).join(" ") : "";
            return a.trim(d)
        },
        show: function(a) {
            var b = this.getTip(a);
            this.reposition(a, b, a.attr("class"));
            b.fadeIn(150)
        },
        hide: function(a) {
            this.getTip(a).fadeOut(150)
        },
        reload: function() {
            var d = a(this);
            return d.data("fndtn-tooltips") ? d.foundationTooltips("destroy").foundationTooltips("init") : d.foundationTooltips("init")
        },
        off: function() {
            a(this.scope).off(".fndtn.tooltip");
            a(this.settings.tooltipClass).each(function(d) {
                a("[data-tooltip]").get(d).attr("title", a(this).text())
            }).remove()
        },
        reflow: function() {}
    }
}
)(Foundation.zj, this, this.document);
(function(a, g, f, e) {
    Foundation.libs.topbar = {
        name: "topbar",
        version: "4.3.2",
        settings: {
            index: 0,
            stickyClass: "sticky",
            custom_back_text: !0,
            back_text: "Back",
            is_hover: !0,
            mobile_show_parent_link: !1,
            scrolltop: !0,
            init: !1
        },
        init: function(d, b, c) {
            Foundation.inherit(this, "data_options addCustomRule");
            var e = this;
            return "object" == typeof b ? a.extend(!0, this.settings, b) : "undefined" != typeof c && a.extend(!0, this.settings, c),
            "string" != typeof b ? (a(".top-bar, [data-topbar]").each(function() {
                a.extend(!0, e.settings, e.data_options(a(this)));
                e.settings.$w = a(g);
                e.settings.$topbar = a(this);
                e.settings.$section = e.settings.$topbar.find("section");
                e.settings.$titlebar = e.settings.$topbar.children("ul").first();
                e.settings.$topbar.data("index", 0);
                var b = e.settings.$topbar.parent();
                b.hasClass("fixed") || b.hasClass(e.settings.stickyClass) ? (e.settings.$topbar.data("height", e.outerHeight(b)),
                e.settings.$topbar.data("stickyoffset", b.offset().top)) : e.settings.$topbar.data("height", e.outerHeight(e.settings.$topbar));
                b = a("<div class='top-bar-js-breakpoint'/>").insertAfter(e.settings.$topbar);
                e.settings.breakPoint = b.width();
                b.remove();
                e.assemble();
                e.settings.is_hover && e.settings.$topbar.find(".has-dropdown").addClass("not-click");
                e.addCustomRule(".f-topbar-fixed { padding-top: " + e.settings.$topbar.data("height") + "px }");
                e.settings.$topbar.parent().hasClass("fixed") && a("body").addClass("f-topbar-fixed")
            }),
            e.settings.init || this.events(),
            this.settings.init) : this[b].call(this, c)
        },
        toggle: function() {
            var d = a(".top-bar, [data-topbar]")
              , b = d.find("section, .section");
            this.breakpoint() && (this.rtl ? (b.css({
                right: "0%"
            }),
            b.find(">.name").css({
                right: "100%"
            })) : (b.css({
                left: "0%"
            }),
            b.find(">.name").css({
                left: "100%"
            })),
            b.find("li.moved").removeClass("moved"),
            d.data("index", 0),
            d.toggleClass("expanded").css("height", ""));
            this.settings.scrolltop ? d.hasClass("expanded") ? d.parent().hasClass("fixed") && (this.settings.scrolltop ? (d.parent().removeClass("fixed"),
            d.addClass("fixed"),
            a("body").removeClass("f-topbar-fixed"),
            g.scrollTo(0, 0)) : d.parent().removeClass("expanded")) : d.hasClass("fixed") && (d.parent().addClass("fixed"),
            d.removeClass("fixed"),
            a("body").addClass("f-topbar-fixed")) : (d.parent().hasClass(this.settings.stickyClass) && d.parent().addClass("fixed"),
            d.parent().hasClass("fixed") && (d.hasClass("expanded") ? (d.addClass("fixed"),
            d.parent().addClass("expanded")) : (d.removeClass("fixed"),
            d.parent().removeClass("expanded"),
            this.updateStickyPositioning())))
        },
        timer: null,
        events: function() {
            var d = this;
            a(this.scope).off(".fndtn.topbar").on("click.fndtn.topbar", ".top-bar .toggle-topbar, [data-topbar] .toggle-topbar", function(a) {
                a.preventDefault();
                d.toggle()
            }).on("click.fndtn.topbar", ".top-bar li.has-dropdown", function(b) {
                var c = a(this)
                  , e = a(b.target);
                c.closest("[data-topbar], .top-bar").data("topbar");
                e.data("revealId") ? d.toggle() : d.breakpoint() || d.settings.is_hover && !Modernizr.touch || (b.stopImmediatePropagation(),
                "A" === e[0].nodeName && e.parent().hasClass("has-dropdown") && b.preventDefault(),
                c.hasClass("hover") ? (c.removeClass("hover").find("li").removeClass("hover"),
                c.parents("li.hover").removeClass("hover")) : c.addClass("hover"))
            }).on("click.fndtn.topbar", ".top-bar .has-dropdown>a, [data-topbar] .has-dropdown>a", function(b) {
                if (d.breakpoint() && a(g).width() != d.settings.breakPoint) {
                    b.preventDefault();
                    b = a(this);
                    var c = b.closest(".top-bar, [data-topbar]")
                      , e = c.find("section, .section");
                    b.next(".dropdown").outerHeight();
                    var f = b.closest("li");
                    c.data("index", c.data("index") + 1);
                    f.addClass("moved");
                    d.rtl ? (e.css({
                        right: -(100 * c.data("index")) + "%"
                    }),
                    e.find(">.name").css({
                        right: 100 * c.data("index") + "%"
                    })) : (e.css({
                        left: -(100 * c.data("index")) + "%"
                    }),
                    e.find(">.name").css({
                        left: 100 * c.data("index") + "%"
                    }));
                    c.css("height", d.outerHeight(b.siblings("ul"), !0) + d.settings.$topbar.data("height"))
                }
            });
            a(g).on("resize.fndtn.topbar", function() {
                if ("undefined" != typeof d.settings.$topbar) {
                    var b = d.settings.$topbar.parent("." + this.settings.stickyClass), c;
                    if (!d.breakpoint()) {
                        var e = d.settings.$topbar.hasClass("expanded");
                        a(".top-bar, [data-topbar]").css("height", "").removeClass("expanded").find("li").removeClass("hover");
                        e && d.toggle()
                    }
                    0 < b.length && (b.hasClass("fixed") ? (b.removeClass("fixed"),
                    c = b.offset().top,
                    a(f.body).hasClass("f-topbar-fixed") && (c -= d.settings.$topbar.data("height")),
                    d.settings.$topbar.data("stickyoffset", c),
                    b.addClass("fixed")) : (c = b.offset().top,
                    d.settings.$topbar.data("stickyoffset", c)))
                }
            }
            .bind(this));
            a("body").on("click.fndtn.topbar", function(b) {
                0 < a(b.target).closest("li").closest("li.hover").length || a(".top-bar li, [data-topbar] li").removeClass("hover")
            });
            a(this.scope).on("click.fndtn", ".top-bar .has-dropdown .back, [data-topbar] .has-dropdown .back", function(b) {
                b.preventDefault();
                var c = a(this);
                b = c.closest(".top-bar, [data-topbar]");
                var e = b.find("section, .section")
                  , f = c.closest("li.moved")
                  , c = f.parent();
                b.data("index", b.data("index") - 1);
                d.rtl ? (e.css({
                    right: -(100 * b.data("index")) + "%"
                }),
                e.find(">.name").css({
                    right: 100 * b.data("index") + "%"
                })) : (e.css({
                    left: -(100 * b.data("index")) + "%"
                }),
                e.find(">.name").css({
                    left: 100 * b.data("index") + "%"
                }));
                0 === b.data("index") ? b.css("height", "") : b.css("height", d.outerHeight(c, !0) + d.settings.$topbar.data("height"));
                setTimeout(function() {
                    f.removeClass("moved")
                }, 300)
            })
        },
        breakpoint: function() {
            return a(f).width() <= this.settings.breakPoint || a("html").hasClass("lt-ie9")
        },
        assemble: function() {
            var d = this;
            this.settings.$section.detach();
            this.settings.$section.find(".has-dropdown>a").each(function() {
                var b = a(this)
                  , c = b.siblings(".dropdown")
                  , e = b.attr("href")
                  , e = d.settings.mobile_show_parent_link && e && 1 < e.length ? a('<li class="title back js-generated"><h5><a href="#"></a></h5></li><li><a class="parent-link js-generated" href="' + e + '">' + b.text() + "</a></li>") : a('<li class="title back js-generated"><h5><a href="#"></a></h5></li>');
                1 == d.settings.custom_back_text ? e.find("h5>a").html(d.settings.back_text) : e.find("h5>a").html("&laquo; " + b.html());
                c.prepend(e)
            });
            this.settings.$section.appendTo(this.settings.$topbar);
            this.sticky()
        },
        height: function(d) {
            var b = 0
              , c = this;
            return d.find("> li").each(function() {
                b += c.outerHeight(a(this), !0)
            }),
            b
        },
        sticky: function() {
            var d = this;
            a(g).scroll(function() {
                d.updateStickyPositioning()
            })
        },
        updateStickyPositioning: function() {
            var d = "." + this.settings.stickyClass
              , b = a(g);
            if (0 < a(d).length) {
                var c = this.settings.$topbar.data("stickyoffset");
                a(d).hasClass("expanded") || (b.scrollTop() > c ? a(d).hasClass("fixed") || (a(d).addClass("fixed"),
                a("body").addClass("f-topbar-fixed")) : b.scrollTop() <= c && a(d).hasClass("fixed") && (a(d).removeClass("fixed"),
                a("body").removeClass("f-topbar-fixed")))
            }
        },
        off: function() {
            a(this.scope).off(".fndtn.topbar");
            a(g).off(".fndtn.topbar")
        },
        reflow: function() {}
    }
}
)(Foundation.zj, this, this.document);
(function(a, g, f, e) {
    Foundation.libs.interchange = {
        name: "interchange",
        version: "4.2.4",
        cache: {},
        images_loaded: !1,
        settings: {
            load_attr: "interchange",
            named_queries: {
                "default": "only screen and (min-width: 1px)",
                small: "only screen and (min-width: 768px)",
                medium: "only screen and (min-width: 1280px)",
                large: "only screen and (min-width: 1440px)",
                landscape: "only screen and (orientation: landscape)",
                portrait: "only screen and (orientation: portrait)",
                retina: "only screen and (-webkit-min-device-pixel-ratio: 2),only screen and (min--moz-device-pixel-ratio: 2),only screen and (-o-min-device-pixel-ratio: 2/1),only screen and (min-device-pixel-ratio: 2),only screen and (min-resolution: 192dpi),only screen and (min-resolution: 2dppx)"
            },
            directives: {
                replace: function(a, b) {
                    if (/IMG/.test(a[0].nodeName)) {
                        var c = a[0].src;
                        if (!RegExp(b, "i").test(c))
                            return a[0].src = b,
                            a.trigger("replace", [a[0].src, c])
                    }
                }
            }
        },
        init: function(d, b, c) {
            return Foundation.inherit(this, "throttle"),
            "object" == typeof b && a.extend(!0, this.settings, b),
            this.events(),
            this.images(),
            "string" != typeof b ? this.settings.init : this[b].call(this, c)
        },
        events: function() {
            var d = this;
            a(g).on("resize.fndtn.interchange", d.throttle(function() {
                d.resize.call(d)
            }, 50))
        },
        resize: function() {
            var d = this.cache;
            if (this.images_loaded)
                for (var b in d) {
                    if (d.hasOwnProperty(b)) {
                        var c = this.results(b, d[b]);
                        c && this.settings.directives[c.scenario[1]](c.el, c.scenario[0])
                    }
                }
            else
                setTimeout(a.proxy(this.resize, this), 50)
        },
        results: function(d, b) {
            var c = b.length;
            if (0 < c)
                for (var e = a('[data-uuid="' + d + '"]'), c = c - 1; 0 <= c; c--) {
                    var f, g = b[c][2];
                    this.settings.named_queries.hasOwnProperty(g) ? f = matchMedia(this.settings.named_queries[g]) : f = matchMedia(g);
                    if (f.matches)
                        return {
                            el: e,
                            scenario: b[c]
                        }
                }
            return !1
        },
        images: function(a) {
            return "undefined" == typeof this.cached_images || a ? this.update_images() : this.cached_images
        },
        update_images: function() {
            var d = f.getElementsByTagName("img")
              , b = d.length
              , c = 0
              , e = "data-" + this.settings.load_attr;
            this.cached_images = [];
            this.images_loaded = !1;
            for (var g = b - 1; 0 <= g; g--)
                this.loaded(a(d[g]), function(a) {
                    c++;
                    a && 0 < (a.getAttribute(e) || "").length && this.cached_images.push(a);
                    c === b && (this.images_loaded = !0,
                    this.enhance())
                }
                .bind(this));
            return "deferred"
        },
        loaded: function(a, b) {
            function c() {
                b(a[0])
            }
            function e() {
                this.one("load", c);
                if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
                    var a = this.attr("src")
                      , b = a.match(/\?/) ? "&" : "?"
                      , b = b + ("random=" + (new Date).getTime());
                    this.attr("src", a + b)
                }
            }
            a.attr("src") ? a[0].complete || 4 === a[0].readyState ? c() : e.call(a) : c()
        },
        enhance: function() {
            for (var d = this.images().length - 1; 0 <= d; d--)
                this._object(a(this.images()[d]));
            return a(g).trigger("resize")
        },
        parse_params: function(a, b, c) {
            return [this.trim(a), this.convert_directive(b), this.trim(c)]
        },
        convert_directive: function(a) {
            a = this.trim(a);
            return 0 < a.length ? a : "replace"
        },
        _object: function(a) {
            var b = this.parse_data_attr(a)
              , c = []
              , e = b.length;
            if (0 < e)
                for (e -= 1; 0 <= e; e--) {
                    var f = b[e].split(/\((.*?)(\))$/);
                    if (1 < f.length) {
                        var g = f[0].split(",")
                          , f = this.parse_params(g[0], g[1], f[1]);
                        c.push(f)
                    }
                }
            return this.store(a, c)
        },
        uuid: function(a) {
            function b() {
                return (65536 * (1 + Math.random()) | 0).toString(16).substring(1)
            }
            a = a || "-";
            return b() + b() + a + b() + a + b() + a + b() + a + b() + b() + b()
        },
        store: function(a, b) {
            var c = this.uuid()
              , e = a.data("uuid");
            return e ? this.cache[e] : (a.attr("data-uuid", c),
            this.cache[c] = b)
        },
        trim: function(d) {
            return "string" == typeof d ? a.trim(d) : d
        },
        parse_data_attr: function(a) {
            a = a.data(this.settings.load_attr).split(/\[(.*?)\]/);
            for (var b = [], c = a.length - 1; 0 <= c; c--)
                4 < a[c].replace(/[\W\d]+/, "").length && b.push(a[c]);
            return b
        },
        reflow: function() {
            this.images(!0)
        }
    }
}
)(Foundation.zj, this, this.document);
(function(a) {
    a.Placeholders = {
        Utils: {
            addEventListener: function(a, f, e) {
                if (a.addEventListener)
                    return a.addEventListener(f, e, !1);
                if (a.attachEvent)
                    return a.attachEvent("on" + f, e)
            },
            inArray: function(a, f) {
                var e, d;
                e = 0;
                for (d = a.length; e < d; e++)
                    if (a[e] === f)
                        return !0;
                return !1
            },
            moveCaret: function(a, f) {
                var e;
                a.createTextRange ? (e = a.createTextRange(),
                e.move("character", f),
                e.select()) : a.selectionStart && (a.focus(),
                a.setSelectionRange(f, f))
            },
            changeType: function(a, f) {
                try {
                    return a.type = f,
                    !0
                } catch (e) {
                    return !1
                }
            }
        }
    }
}
)(this);
(function(a) {
    function g() {}
    function f(a) {
        var b;
        return a.value === a.getAttribute(w) && "true" === a.getAttribute(y) ? (a.setAttribute(y, "false"),
        a.value = "",
        a.className = a.className.replace(x, ""),
        b = a.getAttribute(A),
        b && (a.type = b),
        !0) : !1
    }
    function e(a) {
        var b, c = a.getAttribute(w);
        return "" === a.value && c ? (a.setAttribute(y, "true"),
        a.value = c,
        a.className += " " + v,
        b = a.getAttribute(A),
        b ? a.type = "text" : "password" === a.type && E.changeType(a, "text") && a.setAttribute(A, "password"),
        !0) : !1
    }
    function d(a, b) {
        var c, d, e, f, g;
        if (a && a.getAttribute(w))
            b(a);
        else
            for (c = a ? a.getElementsByTagName("input") : B,
            d = a ? a.getElementsByTagName("textarea") : C,
            g = 0,
            f = c.length + d.length; g < f; g++)
                e = g < c.length ? c[g] : d[g - c.length],
                b(e)
    }
    function b(a) {
        d(a, f)
    }
    function c(a) {
        d(a, e)
    }
    function h(a) {
        return function() {
            R && a.value === a.getAttribute(w) && "true" === a.getAttribute(y) ? E.moveCaret(a, 0) : f(a)
        }
    }
    function m(a) {
        return function() {
            e(a)
        }
    }
    function l(a) {
        return function(b) {
            K = a.value;
            if ("true" === a.getAttribute(y) && K === a.getAttribute(w) && E.inArray(u, b.keyCode))
                return b.preventDefault && b.preventDefault(),
                !1
        }
    }
    function n(a) {
        return function() {
            var b;
            "true" === a.getAttribute(y) && a.value !== K && (a.className = a.className.replace(x, ""),
            a.value = a.value.replace(a.getAttribute(w), ""),
            a.setAttribute(y, !1),
            b = a.getAttribute(A),
            b && (a.type = b));
            "" === a.value && (a.blur(),
            E.moveCaret(a, 0))
        }
    }
    function q(a) {
        return function() {
            a === document.activeElement && a.value === a.getAttribute(w) && "true" === a.getAttribute(y) && E.moveCaret(a, 0)
        }
    }
    function p(a) {
        return function() {
            b(a)
        }
    }
    function r(a) {
        a.form && (S = a.form,
        S.getAttribute(N) || (E.addEventListener(S, "submit", p(S)),
        S.setAttribute(N, "true")));
        E.addEventListener(a, "focus", h(a));
        E.addEventListener(a, "blur", m(a));
        R && (E.addEventListener(a, "keydown", l(a)),
        E.addEventListener(a, "keyup", n(a)),
        E.addEventListener(a, "click", q(a)));
        a.setAttribute(I, "true");
        a.setAttribute(w, P);
        e(a)
    }
    var s = "text search url tel email password number textarea".split(" "), u = [27, 33, 34, 35, 36, 37, 38, 39, 40, 8, 46], v = "placeholdersjs", x = RegExp("(?:^|\\s)" + v + "(?!\\S)"), B, C, w = "data-placeholder-value", y = "data-placeholder-active", A = "data-placeholder-type", N = "data-placeholder-submit", I = "data-placeholder-bound", J = document.createElement("input"), F = document.getElementsByTagName("head")[0], L = document.documentElement;
    a = a.Placeholders;
    var E = a.Utils, R, Y, K, P, W, S, D, O, M;
    a.nativeSupport = void 0 !== J.placeholder;
    if (!a.nativeSupport) {
        B = document.getElementsByTagName("input");
        C = document.getElementsByTagName("textarea");
        R = "false" === L.getAttribute("data-placeholder-focus");
        Y = "false" !== L.getAttribute("data-placeholder-live");
        J = document.createElement("style");
        J.type = "text/css";
        L = document.createTextNode("." + v + " { color:#ccc; }");
        J.styleSheet ? J.styleSheet.cssText = L.nodeValue : J.appendChild(L);
        F.insertBefore(J, F.firstChild);
        M = 0;
        for (O = B.length + C.length; M < O; M++)
            D = M < B.length ? B[M] : C[M - B.length],
            (P = D.attributes.placeholder) && (P = P.nodeValue,
            P && E.inArray(s, D.type) && r(D));
        W = setInterval(function() {
            M = 0;
            for (O = B.length + C.length; M < O; M++)
                if (D = M < B.length ? B[M] : C[M - B.length],
                (P = D.attributes.placeholder) && (P = P.nodeValue) && E.inArray(s, D.type) && (D.getAttribute(I) || r(D),
                P !== D.getAttribute(w) || "password" === D.type && !D.getAttribute(A)))
                    "password" === D.type && !D.getAttribute(A) && E.changeType(D, "text") && D.setAttribute(A, "password"),
                    D.value === D.getAttribute(w) && (D.value = P),
                    D.setAttribute(w, P);
            Y || clearInterval(W)
        }, 100)
    }
    a.disable = a.nativeSupport ? g : b;
    a.enable = a.nativeSupport ? g : c
}
)(this);
(function(a, g, f, e) {
    Foundation.libs.abide = {
        name: "abide",
        version: "4.3.2",
        settings: {
            live_validate: !0,
            focus_on_invalid: !0,
            timeout: 1E3,
            patterns: {
                alpha: /[a-zA-Z]+/,
                alpha_numeric: /[a-zA-Z0-9]+/,
                integer: /-?\d+/,
                number: /-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?/,
                password: /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
                card: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
                cvv: /^([0-9]){3,4}$/,
                email: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                url: /(https?|ftp|file|ssh):\/\/(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?/,
                domain: /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/,
                datetime: /([0-2][0-9]{3})\-([0-1][0-9])\-([0-3][0-9])T([0-5][0-9])\:([0-5][0-9])\:([0-5][0-9])(Z|([\-\+]([0-1][0-9])\:00))/,
                date: /(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))/,
                time: /(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}/,
                dateISO: /\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}/,
                month_day_year: /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/,
                color: /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/
            }
        },
        timer: null,
        init: function(d, b, c) {
            "object" == typeof b && a.extend(!0, this.settings, b);
            if ("string" == typeof b)
                return this[b].call(this, c);
            this.settings.init || this.events()
        },
        events: function() {
            var d = this
              , b = a("form[data-abide]", this.scope).attr("novalidate", "novalidate");
            b.on("submit validate", function(b) {
                return d.validate(a(this).find("input, textarea, select").get(), b)
            });
            this.settings.init = !0;
            if (this.settings.live_validate)
                b.find("input, textarea, select").on("blur change", function(a) {
                    d.validate([this], a)
                }).on("keydown", function(a) {
                    clearTimeout(d.timer);
                    d.timer = setTimeout(function() {
                        d.validate([this], a)
                    }
                    .bind(this), d.settings.timeout)
                })
        },
        validate: function(d, b) {
            for (var c = this.parse_patterns(d), e = c.length, f = a(d[0]).closest("form"), g = 0; g < e; g++)
                if (!c[g] && /submit/.test(b.type))
                    return this.settings.focus_on_invalid && d[g].focus(),
                    f.trigger("invalid"),
                    a(d[g]).closest("form").attr("data-invalid", ""),
                    !1;
            return /submit/.test(b.type) && f.trigger("valid"),
            f.removeAttr("data-invalid"),
            !0
        },
        parse_patterns: function(a) {
            for (var b = [], c = a.length - 1; 0 <= c; c--)
                b.push(this.pattern(a[c]));
            return this.check_validation_and_apply_styles(b)
        },
        pattern: function(a) {
            var b = a.getAttribute("type")
              , c = "string" == typeof a.getAttribute("required");
            if (this.settings.patterns.hasOwnProperty(b))
                return [a, this.settings.patterns[b], c];
            b = a.getAttribute("pattern") || "";
            return this.settings.patterns.hasOwnProperty(b) && 0 < b.length ? [a, this.settings.patterns[b], c] : 0 < b.length ? [a, RegExp(b), c] : (b = /.*/,
            [a, b, c])
        },
        check_validation_and_apply_styles: function(d) {
            for (var b = [], c = d.length - 1; 0 <= c; c--) {
                var e = d[c][0]
                  , f = d[c][2]
                  , g = e.value
                  , n = f ? 0 < e.value.length : !0;
                "radio" === e.type && f ? b.push(this.valid_radio(e, f)) : d[c][1].test(g) && n || !f && 1 > e.value.length ? (a(e).removeAttr("data-invalid").parent().removeClass("error"),
                b.push(!0)) : (a(e).attr("data-invalid", "").parent().addClass("error"),
                b.push(!1))
            }
            return b
        },
        valid_radio: function(d, b) {
            for (var c = d.getAttribute("name"), c = f.getElementsByName(c), e = c.length, g = !1, l = 0; l < e; l++)
                c[l].checked && (g = !0);
            for (l = 0; l < e; l++)
                g ? a(c[l]).removeAttr("data-invalid").parent().removeClass("error") : a(c[l]).attr("data-invalid", "").parent().addClass("error");
            return g
        }
    }
}
)(Foundation.zj, this, this.document);
(function() {
    function a(a, c) {
        var l = a[0]
          , n = a[1]
          , q = a[2]
          , p = a[3]
          , l = f(l, n, q, p, c[0], 7, -680876936)
          , p = f(p, l, n, q, c[1], 12, -389564586)
          , q = f(q, p, l, n, c[2], 17, 606105819)
          , n = f(n, q, p, l, c[3], 22, -1044525330)
          , l = f(l, n, q, p, c[4], 7, -176418897)
          , p = f(p, l, n, q, c[5], 12, 1200080426)
          , q = f(q, p, l, n, c[6], 17, -1473231341)
          , n = f(n, q, p, l, c[7], 22, -45705983)
          , l = f(l, n, q, p, c[8], 7, 1770035416)
          , p = f(p, l, n, q, c[9], 12, -1958414417)
          , q = f(q, p, l, n, c[10], 17, -42063)
          , n = f(n, q, p, l, c[11], 22, -1990404162)
          , l = f(l, n, q, p, c[12], 7, 1804603682)
          , p = f(p, l, n, q, c[13], 12, -40341101)
          , q = f(q, p, l, n, c[14], 17, -1502002290)
          , n = f(n, q, p, l, c[15], 22, 1236535329)
          , l = e(l, n, q, p, c[1], 5, -165796510)
          , p = e(p, l, n, q, c[6], 9, -1069501632)
          , q = e(q, p, l, n, c[11], 14, 643717713)
          , n = e(n, q, p, l, c[0], 20, -373897302)
          , l = e(l, n, q, p, c[5], 5, -701558691)
          , p = e(p, l, n, q, c[10], 9, 38016083)
          , q = e(q, p, l, n, c[15], 14, -660478335)
          , n = e(n, q, p, l, c[4], 20, -405537848)
          , l = e(l, n, q, p, c[9], 5, 568446438)
          , p = e(p, l, n, q, c[14], 9, -1019803690)
          , q = e(q, p, l, n, c[3], 14, -187363961)
          , n = e(n, q, p, l, c[8], 20, 1163531501)
          , l = e(l, n, q, p, c[13], 5, -1444681467)
          , p = e(p, l, n, q, c[2], 9, -51403784)
          , q = e(q, p, l, n, c[7], 14, 1735328473)
          , n = e(n, q, p, l, c[12], 20, -1926607734)
          , l = g(n ^ q ^ p, l, n, c[5], 4, -378558)
          , p = g(l ^ n ^ q, p, l, c[8], 11, -2022574463)
          , q = g(p ^ l ^ n, q, p, c[11], 16, 1839030562)
          , n = g(q ^ p ^ l, n, q, c[14], 23, -35309556)
          , l = g(n ^ q ^ p, l, n, c[1], 4, -1530992060)
          , p = g(l ^ n ^ q, p, l, c[4], 11, 1272893353)
          , q = g(p ^ l ^ n, q, p, c[7], 16, -155497632)
          , n = g(q ^ p ^ l, n, q, c[10], 23, -1094730640)
          , l = g(n ^ q ^ p, l, n, c[13], 4, 681279174)
          , p = g(l ^ n ^ q, p, l, c[0], 11, -358537222)
          , q = g(p ^ l ^ n, q, p, c[3], 16, -722521979)
          , n = g(q ^ p ^ l, n, q, c[6], 23, 76029189)
          , l = g(n ^ q ^ p, l, n, c[9], 4, -640364487)
          , p = g(l ^ n ^ q, p, l, c[12], 11, -421815835)
          , q = g(p ^ l ^ n, q, p, c[15], 16, 530742520)
          , n = g(q ^ p ^ l, n, q, c[2], 23, -995338651)
          , l = d(l, n, q, p, c[0], 6, -198630844)
          , p = d(p, l, n, q, c[7], 10, 1126891415)
          , q = d(q, p, l, n, c[14], 15, -1416354905)
          , n = d(n, q, p, l, c[5], 21, -57434055)
          , l = d(l, n, q, p, c[12], 6, 1700485571)
          , p = d(p, l, n, q, c[3], 10, -1894986606)
          , q = d(q, p, l, n, c[10], 15, -1051523)
          , n = d(n, q, p, l, c[1], 21, -2054922799)
          , l = d(l, n, q, p, c[8], 6, 1873313359)
          , p = d(p, l, n, q, c[15], 10, -30611744)
          , q = d(q, p, l, n, c[6], 15, -1560198380)
          , n = d(n, q, p, l, c[13], 21, 1309151649)
          , l = d(l, n, q, p, c[4], 6, -145523070)
          , p = d(p, l, n, q, c[11], 10, -1120210379)
          , q = d(q, p, l, n, c[2], 15, 718787259)
          , n = d(n, q, p, l, c[9], 21, -343485551);
        a[0] = b(l, a[0]);
        a[1] = b(n, a[1]);
        a[2] = b(q, a[2]);
        a[3] = b(p, a[3])
    }
    function g(a, c, d, e, f, g) {
        c = b(b(c, a), b(e, g));
        return b(c << f | c >>> 32 - f, d)
    }
    function f(a, b, c, d, e, f, r) {
        return g(b & c | ~b & d, a, b, e, f, r)
    }
    function e(a, b, c, d, e, f, r) {
        return g(b & d | c & ~d, a, b, e, f, r)
    }
    function d(a, b, c, d, e, f, r) {
        return g(c ^ (b | ~d), a, b, e, f, r)
    }
    function b(a, b) {
        return a + b & 4294967295
    }
    var c = "0123456789abcdef".split("");
    md5 = function(b) {
        var d = b;
        /[\x80-\xFF]/.test(d) && (d = unescape(encodeURI(d)));
        txt = "";
        var e = d.length;
        b = [1732584193, -271733879, -1732584194, 271733878];
        var f;
        for (f = 64; f <= d.length; f += 64) {
            for (var g = b, p = d.substring(f - 64, f), r = [], s = void 0, s = 0; 64 > s; s += 4)
                r[s >> 2] = p.charCodeAt(s) + (p.charCodeAt(s + 1) << 8) + (p.charCodeAt(s + 2) << 16) + (p.charCodeAt(s + 3) << 24);
            a(g, r)
        }
        d = d.substring(f - 64);
        g = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (f = 0; f < d.length; f++)
            g[f >> 2] |= d.charCodeAt(f) << (f % 4 << 3);
        g[f >> 2] |= 128 << (f % 4 << 3);
        if (55 < f)
            for (a(b, g),
            f = 0; 16 > f; f++)
                g[f] = 0;
        g[14] = 8 * e;
        a(b, g);
        for (d = 0; d < b.length; d++) {
            e = b;
            f = d;
            g = b[d];
            p = "";
            for (r = 0; 4 > r; r++)
                p += c[g >> 8 * r + 4 & 15] + c[g >> 8 * r & 15];
            e[f] = p
        }
        return b.join("")
    }
    ;
    "5d41402abc4b2a76b9719d911017c592" != md5("hello") && (b = function(a, b) {
        var c = (a & 65535) + (b & 65535);
        return (a >> 16) + (b >> 16) + (c >> 16) << 16 | c & 65535
    }
    )
}
)();
(function(a) {
    a.fingerprint = function() {
        function g() {
            return [navigator.userAgent, [screen.height, screen.width, screen.colorDepth].join("x"), (new Date).getTimezoneOffset(), !!window.sessionStorage, !!window.localStorage, a.map(navigator.plugins, function(e) {
                return [e.name, e.description, a.map(e, function(a) {
                    return [a.type, a.suffixes].join("~")
                }).join(",")].join("::")
            }).join(";")].join("###")
        }
        var f;
        if ("function" == typeof window.md5)
            f = md5(g());
        else
            throw "md5 unavailable, please get it from http://github.com/wbond/md5-js/";
        return f
    }
}
)(jQuery);
(function(a) {
    "function" === typeof define && define.amd ? define(a) : window.purl = a()
}
)(function() {
    function a(a, b) {
        for (var c = decodeURI(a), c = n[b ? "strict" : "loose"].exec(c), d = {
            attr: {},
            param: {},
            seg: {}
        }, f = 14; f--; )
            d.attr[m[f]] = c[f] || "";
        d.param.query = e(d.attr.query);
        d.param.fragment = e(d.attr.fragment);
        d.seg.path = d.attr.path.replace(/^\/+|\/+$/g, "").split("/");
        d.seg.fragment = d.attr.fragment.replace(/^\/+|\/+$/g, "").split("/");
        d.attr.base = d.attr.host ? (d.attr.protocol ? d.attr.protocol + "://" + d.attr.host : d.attr.host) + (d.attr.port ? ":" + d.attr.port : "") : "";
        return d
    }
    function g(a) {
        a = a.tagName;
        return "undefined" !== typeof a ? h[a.toLowerCase()] : a
    }
    function f(a, c, d, e) {
        var g = a.shift();
        if (g) {
            var h = c[d] = c[d] || [];
            if ("]" == g)
                if (b(h))
                    "" !== e && h.push(e);
                else if ("object" == typeof h) {
                    c = a = h;
                    d = [];
                    for (var l in c)
                        c.hasOwnProperty(l) && d.push(l);
                    a[d.length] = e
                } else
                    c[d] = [c[d], e];
            else {
                ~g.indexOf("]") && (g = g.substr(0, g.length - 1));
                if (!q.test(g) && b(h))
                    if (0 === c[d].length)
                        h = c[d] = {};
                    else {
                        l = {};
                        for (var m in c[d])
                            l[m] = c[d][m];
                        h = c[d] = l
                    }
                f(a, h, g, e)
            }
        } else
            b(c[d]) ? c[d].push(e) : c[d] = "object" == typeof c[d] ? e : "undefined" == typeof c[d] ? e : [c[d], e]
    }
    function e(a) {
        return d(String(a).split(/&|;/), function(a, c) {
            try {
                c = decodeURIComponent(c.replace(/\+/g, " "))
            } catch (d) {}
            var e = c.indexOf("="), g;
            a: {
                for (var h = c.length, l, m = 0; m < h; ++m)
                    if (l = c[m],
                    "]" == l && (g = !1),
                    "[" == l && (g = !0),
                    "=" == l && !g) {
                        g = m;
                        break a
                    }
                g = void 0
            }
            h = c.substr(0, g || e);
            g = c.substr(g || e, c.length);
            g = g.substr(g.indexOf("=") + 1, g.length);
            "" === h && (h = c,
            g = "");
            e = h;
            h = g;
            if (~e.indexOf("]")) {
                var n = e.split("[");
                f(n, a, "base", h)
            } else {
                if (!q.test(e) && b(a.base)) {
                    g = {};
                    for (n in a.base)
                        g[n] = a.base[n];
                    a.base = g
                }
                "" !== e && (n = a.base,
                g = n[e],
                "undefined" === typeof g ? n[e] = h : b(g) ? g.push(h) : n[e] = [g, h])
            }
            return a
        }, {
            base: {}
        }).base
    }
    function d(a, b, c) {
        for (var d = 0, e = a.length >> 0; d < e; )
            d in a && (c = b.call(void 0, c, a[d], d, a)),
            ++d;
        return c
    }
    function b(a) {
        return "[object Array]" === Object.prototype.toString.call(a)
    }
    function c(b, c) {
        1 === arguments.length && !0 === b && (c = !0,
        b = void 0);
        b = b || window.location.toString();
        return {
            data: a(b, c || !1),
            attr: function(a) {
                a = l[a] || a;
                return "undefined" !== typeof a ? this.data.attr[a] : this.data.attr
            },
            param: function(a) {
                return "undefined" !== typeof a ? this.data.param.query[a] : this.data.param.query
            },
            fparam: function(a) {
                return "undefined" !== typeof a ? this.data.param.fragment[a] : this.data.param.fragment
            },
            segment: function(a) {
                if ("undefined" === typeof a)
                    return this.data.seg.path;
                a = 0 > a ? this.data.seg.path.length + a : a - 1;
                return this.data.seg.path[a]
            },
            fsegment: function(a) {
                if ("undefined" === typeof a)
                    return this.data.seg.fragment;
                a = 0 > a ? this.data.seg.fragment.length + a : a - 1;
                return this.data.seg.fragment[a]
            }
        }
    }
    var h = {
        a: "href",
        img: "src",
        form: "action",
        base: "href",
        script: "src",
        iframe: "src",
        link: "href",
        embed: "src",
        object: "data"
    }
      , m = "source protocol authority userInfo user password host port relative path directory file query fragment".split(" ")
      , l = {
        anchor: "fragment"
    }
      , n = {
        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    }
      , q = /^[0-9]+$/;
    c.jQuery = function(a) {
        null != a && (a.fn.url = function(b) {
            var d = "";
            this.length && (d = a(this).attr(g(this[0])) || "");
            return c(d, b)
        }
        ,
        a.url = c)
    }
    ;
    c.jQuery(window.jQuery);
    return c
});
