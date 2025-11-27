const y = /* @__PURE__ */ Object.create(null);
y.open = "0";
y.close = "1";
y.ping = "2";
y.pong = "3";
y.message = "4";
y.upgrade = "5";
y.noop = "6";
const S = /* @__PURE__ */ Object.create(null);
Object.keys(y).forEach((i) => {
  S[y[i]] = i;
});
const L = { type: "error", data: "parser error" }, j = typeof Blob == "function" || typeof Blob < "u" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]", Q = typeof ArrayBuffer == "function", G = (i) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(i) : i && i.buffer instanceof ArrayBuffer, D = ({ type: i, data: e }, t, s) => j && e instanceof Blob ? t ? s(e) : K(e, s) : Q && (e instanceof ArrayBuffer || G(e)) ? t ? s(e) : K(new Blob([e]), s) : s(y[i] + (e || "")), K = (i, e) => {
  const t = new FileReader();
  return t.onload = function() {
    const s = t.result.split(",")[1];
    e("b" + (s || ""));
  }, t.readAsDataURL(i);
};
function W(i) {
  return i instanceof Uint8Array ? i : i instanceof ArrayBuffer ? new Uint8Array(i) : new Uint8Array(i.buffer, i.byteOffset, i.byteLength);
}
let O;
function he(i, e) {
  if (j && i.data instanceof Blob)
    return i.data.arrayBuffer().then(W).then(e);
  if (Q && (i.data instanceof ArrayBuffer || G(i.data)))
    return e(W(i.data));
  D(i, !1, (t) => {
    O || (O = new TextEncoder()), e(O.encode(t));
  });
}
const Y = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", E = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (let i = 0; i < Y.length; i++)
  E[Y.charCodeAt(i)] = i;
const le = (i) => {
  let e = i.length * 0.75, t = i.length, s, n = 0, r, o, a, h;
  i[i.length - 1] === "=" && (e--, i[i.length - 2] === "=" && e--);
  const p = new ArrayBuffer(e), u = new Uint8Array(p);
  for (s = 0; s < t; s += 4)
    r = E[i.charCodeAt(s)], o = E[i.charCodeAt(s + 1)], a = E[i.charCodeAt(s + 2)], h = E[i.charCodeAt(s + 3)], u[n++] = r << 2 | o >> 4, u[n++] = (o & 15) << 4 | a >> 2, u[n++] = (a & 3) << 6 | h & 63;
  return p;
}, ue = typeof ArrayBuffer == "function", $ = (i, e) => {
  if (typeof i != "string")
    return {
      type: "message",
      data: Z(i, e)
    };
  const t = i.charAt(0);
  return t === "b" ? {
    type: "message",
    data: de(i.substring(1), e)
  } : S[t] ? i.length > 1 ? {
    type: S[t],
    data: i.substring(1)
  } : {
    type: S[t]
  } : L;
}, de = (i, e) => {
  if (ue) {
    const t = le(i);
    return Z(t, e);
  } else
    return { base64: !0, data: i };
}, Z = (i, e) => {
  switch (e) {
    case "blob":
      return i instanceof Blob ? i : new Blob([i]);
    case "arraybuffer":
    default:
      return i instanceof ArrayBuffer ? i : i.buffer;
  }
}, ee = "", pe = (i, e) => {
  const t = i.length, s = new Array(t);
  let n = 0;
  i.forEach((r, o) => {
    D(r, !1, (a) => {
      s[o] = a, ++n === t && e(s.join(ee));
    });
  });
}, fe = (i, e) => {
  const t = i.split(ee), s = [];
  for (let n = 0; n < t.length; n++) {
    const r = $(t[n], e);
    if (s.push(r), r.type === "error")
      break;
  }
  return s;
};
function ge() {
  return new TransformStream({
    transform(i, e) {
      he(i, (t) => {
        const s = t.length;
        let n;
        if (s < 126)
          n = new Uint8Array(1), new DataView(n.buffer).setUint8(0, s);
        else if (s < 65536) {
          n = new Uint8Array(3);
          const r = new DataView(n.buffer);
          r.setUint8(0, 126), r.setUint16(1, s);
        } else {
          n = new Uint8Array(9);
          const r = new DataView(n.buffer);
          r.setUint8(0, 127), r.setBigUint64(1, BigInt(s));
        }
        i.data && typeof i.data != "string" && (n[0] |= 128), e.enqueue(n), e.enqueue(t);
      });
    }
  });
}
let I;
function k(i) {
  return i.reduce((e, t) => e + t.length, 0);
}
function T(i, e) {
  if (i[0].length === e)
    return i.shift();
  const t = new Uint8Array(e);
  let s = 0;
  for (let n = 0; n < e; n++)
    t[n] = i[0][s++], s === i[0].length && (i.shift(), s = 0);
  return i.length && s < i[0].length && (i[0] = i[0].slice(s)), t;
}
function ye(i, e) {
  I || (I = new TextDecoder());
  const t = [];
  let s = 0, n = -1, r = !1;
  return new TransformStream({
    transform(o, a) {
      for (t.push(o); ; ) {
        if (s === 0) {
          if (k(t) < 1)
            break;
          const h = T(t, 1);
          r = (h[0] & 128) === 128, n = h[0] & 127, n < 126 ? s = 3 : n === 126 ? s = 1 : s = 2;
        } else if (s === 1) {
          if (k(t) < 2)
            break;
          const h = T(t, 2);
          n = new DataView(h.buffer, h.byteOffset, h.length).getUint16(0), s = 3;
        } else if (s === 2) {
          if (k(t) < 8)
            break;
          const h = T(t, 8), p = new DataView(h.buffer, h.byteOffset, h.length), u = p.getUint32(0);
          if (u > Math.pow(2, 21) - 1) {
            a.enqueue(L);
            break;
          }
          n = u * Math.pow(2, 32) + p.getUint32(4), s = 3;
        } else {
          if (k(t) < n)
            break;
          const h = T(t, n);
          a.enqueue($(r ? h : I.decode(h), e)), s = 0;
        }
        if (n === 0 || n > i) {
          a.enqueue(L);
          break;
        }
      }
    }
  });
}
const te = 4;
function l(i) {
  if (i) return me(i);
}
function me(i) {
  for (var e in l.prototype)
    i[e] = l.prototype[e];
  return i;
}
l.prototype.on = l.prototype.addEventListener = function(i, e) {
  return this._callbacks = this._callbacks || {}, (this._callbacks["$" + i] = this._callbacks["$" + i] || []).push(e), this;
};
l.prototype.once = function(i, e) {
  function t() {
    this.off(i, t), e.apply(this, arguments);
  }
  return t.fn = e, this.on(i, t), this;
};
l.prototype.off = l.prototype.removeListener = l.prototype.removeAllListeners = l.prototype.removeEventListener = function(i, e) {
  if (this._callbacks = this._callbacks || {}, arguments.length == 0)
    return this._callbacks = {}, this;
  var t = this._callbacks["$" + i];
  if (!t) return this;
  if (arguments.length == 1)
    return delete this._callbacks["$" + i], this;
  for (var s, n = 0; n < t.length; n++)
    if (s = t[n], s === e || s.fn === e) {
      t.splice(n, 1);
      break;
    }
  return t.length === 0 && delete this._callbacks["$" + i], this;
};
l.prototype.emit = function(i) {
  this._callbacks = this._callbacks || {};
  for (var e = new Array(arguments.length - 1), t = this._callbacks["$" + i], s = 1; s < arguments.length; s++)
    e[s - 1] = arguments[s];
  if (t) {
    t = t.slice(0);
    for (var s = 0, n = t.length; s < n; ++s)
      t[s].apply(this, e);
  }
  return this;
};
l.prototype.emitReserved = l.prototype.emit;
l.prototype.listeners = function(i) {
  return this._callbacks = this._callbacks || {}, this._callbacks["$" + i] || [];
};
l.prototype.hasListeners = function(i) {
  return !!this.listeners(i).length;
};
const x = typeof Promise == "function" && typeof Promise.resolve == "function" ? (e) => Promise.resolve().then(e) : (e, t) => t(e, 0), d = typeof self < "u" ? self : typeof window < "u" ? window : Function("return this")(), _e = "arraybuffer";
function se(i, ...e) {
  return e.reduce((t, s) => (i.hasOwnProperty(s) && (t[s] = i[s]), t), {});
}
const ve = d.setTimeout, be = d.clearTimeout;
function R(i, e) {
  e.useNativeTimers ? (i.setTimeoutFn = ve.bind(d), i.clearTimeoutFn = be.bind(d)) : (i.setTimeoutFn = d.setTimeout.bind(d), i.clearTimeoutFn = d.clearTimeout.bind(d));
}
const we = 1.33;
function Ee(i) {
  return typeof i == "string" ? ke(i) : Math.ceil((i.byteLength || i.size) * we);
}
function ke(i) {
  let e = 0, t = 0;
  for (let s = 0, n = i.length; s < n; s++)
    e = i.charCodeAt(s), e < 128 ? t += 1 : e < 2048 ? t += 2 : e < 55296 || e >= 57344 ? t += 3 : (s++, t += 4);
  return t;
}
function ie() {
  return Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 5);
}
function Te(i) {
  let e = "";
  for (let t in i)
    i.hasOwnProperty(t) && (e.length && (e += "&"), e += encodeURIComponent(t) + "=" + encodeURIComponent(i[t]));
  return e;
}
function Se(i) {
  let e = {}, t = i.split("&");
  for (let s = 0, n = t.length; s < n; s++) {
    let r = t[s].split("=");
    e[decodeURIComponent(r[0])] = decodeURIComponent(r[1]);
  }
  return e;
}
class Ae extends Error {
  constructor(e, t, s) {
    super(e), this.description = t, this.context = s, this.type = "TransportError";
  }
}
class z extends l {
  /**
   * Transport abstract constructor.
   *
   * @param {Object} opts - options
   * @protected
   */
  constructor(e) {
    super(), this.writable = !1, R(this, e), this.opts = e, this.query = e.query, this.socket = e.socket, this.supportsBinary = !e.forceBase64;
  }
  /**
   * Emits an error.
   *
   * @param {String} reason
   * @param description
   * @param context - the error context
   * @return {Transport} for chaining
   * @protected
   */
  onError(e, t, s) {
    return super.emitReserved("error", new Ae(e, t, s)), this;
  }
  /**
   * Opens the transport.
   */
  open() {
    return this.readyState = "opening", this.doOpen(), this;
  }
  /**
   * Closes the transport.
   */
  close() {
    return (this.readyState === "opening" || this.readyState === "open") && (this.doClose(), this.onClose()), this;
  }
  /**
   * Sends multiple packets.
   *
   * @param {Array} packets
   */
  send(e) {
    this.readyState === "open" && this.write(e);
  }
  /**
   * Called upon open
   *
   * @protected
   */
  onOpen() {
    this.readyState = "open", this.writable = !0, super.emitReserved("open");
  }
  /**
   * Called with data.
   *
   * @param {String} data
   * @protected
   */
  onData(e) {
    const t = $(e, this.socket.binaryType);
    this.onPacket(t);
  }
  /**
   * Called with a decoded packet.
   *
   * @protected
   */
  onPacket(e) {
    super.emitReserved("packet", e);
  }
  /**
   * Called upon close.
   *
   * @protected
   */
  onClose(e) {
    this.readyState = "closed", super.emitReserved("close", e);
  }
  /**
   * Pauses the transport, in order not to lose packets during an upgrade.
   *
   * @param onPause
   */
  pause(e) {
  }
  createUri(e, t = {}) {
    return e + "://" + this._hostname() + this._port() + this.opts.path + this._query(t);
  }
  _hostname() {
    const e = this.opts.hostname;
    return e.indexOf(":") === -1 ? e : "[" + e + "]";
  }
  _port() {
    return this.opts.port && (this.opts.secure && +(this.opts.port !== 443) || !this.opts.secure && Number(this.opts.port) !== 80) ? ":" + this.opts.port : "";
  }
  _query(e) {
    const t = Te(e);
    return t.length ? "?" + t : "";
  }
}
class Be extends z {
  constructor() {
    super(...arguments), this._polling = !1;
  }
  get name() {
    return "polling";
  }
  /**
   * Opens the socket (triggers polling). We write a PING message to determine
   * when the transport is open.
   *
   * @protected
   */
  doOpen() {
    this._poll();
  }
  /**
   * Pauses polling.
   *
   * @param {Function} onPause - callback upon buffers are flushed and transport is paused
   * @package
   */
  pause(e) {
    this.readyState = "pausing";
    const t = () => {
      this.readyState = "paused", e();
    };
    if (this._polling || !this.writable) {
      let s = 0;
      this._polling && (s++, this.once("pollComplete", function() {
        --s || t();
      })), this.writable || (s++, this.once("drain", function() {
        --s || t();
      }));
    } else
      t();
  }
  /**
   * Starts polling cycle.
   *
   * @private
   */
  _poll() {
    this._polling = !0, this.doPoll(), this.emitReserved("poll");
  }
  /**
   * Overloads onData to detect payloads.
   *
   * @protected
   */
  onData(e) {
    const t = (s) => {
      if (this.readyState === "opening" && s.type === "open" && this.onOpen(), s.type === "close")
        return this.onClose({ description: "transport closed by the server" }), !1;
      this.onPacket(s);
    };
    fe(e, this.socket.binaryType).forEach(t), this.readyState !== "closed" && (this._polling = !1, this.emitReserved("pollComplete"), this.readyState === "open" && this._poll());
  }
  /**
   * For polling, send a close packet.
   *
   * @protected
   */
  doClose() {
    const e = () => {
      this.write([{ type: "close" }]);
    };
    this.readyState === "open" ? e() : this.once("open", e);
  }
  /**
   * Writes a packets payload.
   *
   * @param {Array} packets - data packets
   * @protected
   */
  write(e) {
    this.writable = !1, pe(e, (t) => {
      this.doWrite(t, () => {
        this.writable = !0, this.emitReserved("drain");
      });
    });
  }
  /**
   * Generates uri for connection.
   *
   * @private
   */
  uri() {
    const e = this.opts.secure ? "https" : "http", t = this.query || {};
    return this.opts.timestampRequests !== !1 && (t[this.opts.timestampParam] = ie()), !this.supportsBinary && !t.sid && (t.b64 = 1), this.createUri(e, t);
  }
}
let ne = !1;
try {
  ne = typeof XMLHttpRequest < "u" && "withCredentials" in new XMLHttpRequest();
} catch {
}
const Ce = ne;
function xe() {
}
class Re extends Be {
  /**
   * XHR Polling constructor.
   *
   * @param {Object} opts
   * @package
   */
  constructor(e) {
    if (super(e), typeof location < "u") {
      const t = location.protocol === "https:";
      let s = location.port;
      s || (s = t ? "443" : "80"), this.xd = typeof location < "u" && e.hostname !== location.hostname || s !== e.port;
    }
  }
  /**
   * Sends data.
   *
   * @param {String} data to send.
   * @param {Function} called upon flush.
   * @private
   */
  doWrite(e, t) {
    const s = this.request({
      method: "POST",
      data: e
    });
    s.on("success", t), s.on("error", (n, r) => {
      this.onError("xhr post error", n, r);
    });
  }
  /**
   * Starts a poll cycle.
   *
   * @private
   */
  doPoll() {
    const e = this.request();
    e.on("data", this.onData.bind(this)), e.on("error", (t, s) => {
      this.onError("xhr poll error", t, s);
    }), this.pollXhr = e;
  }
}
class g extends l {
  /**
   * Request constructor
   *
   * @param {Object} options
   * @package
   */
  constructor(e, t, s) {
    super(), this.createRequest = e, R(this, s), this._opts = s, this._method = s.method || "GET", this._uri = t, this._data = s.data !== void 0 ? s.data : null, this._create();
  }
  /**
   * Creates the XHR object and sends the request.
   *
   * @private
   */
  _create() {
    var e;
    const t = se(this._opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
    t.xdomain = !!this._opts.xd;
    const s = this._xhr = this.createRequest(t);
    try {
      s.open(this._method, this._uri, !0);
      try {
        if (this._opts.extraHeaders) {
          s.setDisableHeaderCheck && s.setDisableHeaderCheck(!0);
          for (let n in this._opts.extraHeaders)
            this._opts.extraHeaders.hasOwnProperty(n) && s.setRequestHeader(n, this._opts.extraHeaders[n]);
        }
      } catch {
      }
      if (this._method === "POST")
        try {
          s.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
        } catch {
        }
      try {
        s.setRequestHeader("Accept", "*/*");
      } catch {
      }
      (e = this._opts.cookieJar) === null || e === void 0 || e.addCookies(s), "withCredentials" in s && (s.withCredentials = this._opts.withCredentials), this._opts.requestTimeout && (s.timeout = this._opts.requestTimeout), s.onreadystatechange = () => {
        var n;
        s.readyState === 3 && ((n = this._opts.cookieJar) === null || n === void 0 || n.parseCookies(
          // @ts-ignore
          s.getResponseHeader("set-cookie")
        )), s.readyState === 4 && (s.status === 200 || s.status === 1223 ? this._onLoad() : this.setTimeoutFn(() => {
          this._onError(typeof s.status == "number" ? s.status : 0);
        }, 0));
      }, s.send(this._data);
    } catch (n) {
      this.setTimeoutFn(() => {
        this._onError(n);
      }, 0);
      return;
    }
    typeof document < "u" && (this._index = g.requestsCount++, g.requests[this._index] = this);
  }
  /**
   * Called upon error.
   *
   * @private
   */
  _onError(e) {
    this.emitReserved("error", e, this._xhr), this._cleanup(!0);
  }
  /**
   * Cleans up house.
   *
   * @private
   */
  _cleanup(e) {
    if (!(typeof this._xhr > "u" || this._xhr === null)) {
      if (this._xhr.onreadystatechange = xe, e)
        try {
          this._xhr.abort();
        } catch {
        }
      typeof document < "u" && delete g.requests[this._index], this._xhr = null;
    }
  }
  /**
   * Called upon load.
   *
   * @private
   */
  _onLoad() {
    const e = this._xhr.responseText;
    e !== null && (this.emitReserved("data", e), this.emitReserved("success"), this._cleanup());
  }
  /**
   * Aborts the request.
   *
   * @package
   */
  abort() {
    this._cleanup();
  }
}
g.requestsCount = 0;
g.requests = {};
if (typeof document < "u") {
  if (typeof attachEvent == "function")
    attachEvent("onunload", X);
  else if (typeof addEventListener == "function") {
    const i = "onpagehide" in d ? "pagehide" : "unload";
    addEventListener(i, X, !1);
  }
}
function X() {
  for (let i in g.requests)
    g.requests.hasOwnProperty(i) && g.requests[i].abort();
}
const Oe = function() {
  const i = re({
    xdomain: !1
  });
  return i && i.responseType !== null;
}();
class Ie extends Re {
  constructor(e) {
    super(e);
    const t = e && e.forceBase64;
    this.supportsBinary = Oe && !t;
  }
  request(e = {}) {
    return Object.assign(e, { xd: this.xd }, this.opts), new g(re, this.uri(), e);
  }
}
function re(i) {
  const e = i.xdomain;
  try {
    if (typeof XMLHttpRequest < "u" && (!e || Ce))
      return new XMLHttpRequest();
  } catch {
  }
  if (!e)
    try {
      return new d[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
    } catch {
    }
}
const oe = typeof navigator < "u" && typeof navigator.product == "string" && navigator.product.toLowerCase() === "reactnative";
class Ne extends z {
  get name() {
    return "websocket";
  }
  doOpen() {
    const e = this.uri(), t = this.opts.protocols, s = oe ? {} : se(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
    this.opts.extraHeaders && (s.headers = this.opts.extraHeaders);
    try {
      this.ws = this.createSocket(e, t, s);
    } catch (n) {
      return this.emitReserved("error", n);
    }
    this.ws.binaryType = this.socket.binaryType, this.addEventListeners();
  }
  /**
   * Adds event listeners to the socket
   *
   * @private
   */
  addEventListeners() {
    this.ws.onopen = () => {
      this.opts.autoUnref && this.ws._socket.unref(), this.onOpen();
    }, this.ws.onclose = (e) => this.onClose({
      description: "websocket connection closed",
      context: e
    }), this.ws.onmessage = (e) => this.onData(e.data), this.ws.onerror = (e) => this.onError("websocket error", e);
  }
  write(e) {
    this.writable = !1;
    for (let t = 0; t < e.length; t++) {
      const s = e[t], n = t === e.length - 1;
      D(s, this.supportsBinary, (r) => {
        try {
          this.doWrite(s, r);
        } catch {
        }
        n && x(() => {
          this.writable = !0, this.emitReserved("drain");
        }, this.setTimeoutFn);
      });
    }
  }
  doClose() {
    typeof this.ws < "u" && (this.ws.onerror = () => {
    }, this.ws.close(), this.ws = null);
  }
  /**
   * Generates uri for connection.
   *
   * @private
   */
  uri() {
    const e = this.opts.secure ? "wss" : "ws", t = this.query || {};
    return this.opts.timestampRequests && (t[this.opts.timestampParam] = ie()), this.supportsBinary || (t.b64 = 1), this.createUri(e, t);
  }
}
const N = d.WebSocket || d.MozWebSocket;
class Le extends Ne {
  createSocket(e, t, s) {
    return oe ? new N(e, t, s) : t ? new N(e, t) : new N(e);
  }
  doWrite(e, t) {
    this.ws.send(t);
  }
}
class Pe extends z {
  get name() {
    return "webtransport";
  }
  doOpen() {
    try {
      this._transport = new WebTransport(this.createUri("https"), this.opts.transportOptions[this.name]);
    } catch (e) {
      return this.emitReserved("error", e);
    }
    this._transport.closed.then(() => {
      this.onClose();
    }).catch((e) => {
      this.onError("webtransport error", e);
    }), this._transport.ready.then(() => {
      this._transport.createBidirectionalStream().then((e) => {
        const t = ye(Number.MAX_SAFE_INTEGER, this.socket.binaryType), s = e.readable.pipeThrough(t).getReader(), n = ge();
        n.readable.pipeTo(e.writable), this._writer = n.writable.getWriter();
        const r = () => {
          s.read().then(({ done: a, value: h }) => {
            a || (this.onPacket(h), r());
          }).catch((a) => {
          });
        };
        r();
        const o = { type: "open" };
        this.query.sid && (o.data = `{"sid":"${this.query.sid}"}`), this._writer.write(o).then(() => this.onOpen());
      });
    });
  }
  write(e) {
    this.writable = !1;
    for (let t = 0; t < e.length; t++) {
      const s = e[t], n = t === e.length - 1;
      this._writer.write(s).then(() => {
        n && x(() => {
          this.writable = !0, this.emitReserved("drain");
        }, this.setTimeoutFn);
      });
    }
  }
  doClose() {
    var e;
    (e = this._transport) === null || e === void 0 || e.close();
  }
}
const Fe = {
  websocket: Le,
  webtransport: Pe,
  polling: Ie
}, Me = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, qe = [
  "source",
  "protocol",
  "authority",
  "userInfo",
  "user",
  "password",
  "host",
  "port",
  "relative",
  "path",
  "directory",
  "file",
  "query",
  "anchor"
];
function P(i) {
  if (i.length > 8e3)
    throw "URI too long";
  const e = i, t = i.indexOf("["), s = i.indexOf("]");
  t != -1 && s != -1 && (i = i.substring(0, t) + i.substring(t, s).replace(/:/g, ";") + i.substring(s, i.length));
  let n = Me.exec(i || ""), r = {}, o = 14;
  for (; o--; )
    r[qe[o]] = n[o] || "";
  return t != -1 && s != -1 && (r.source = e, r.host = r.host.substring(1, r.host.length - 1).replace(/;/g, ":"), r.authority = r.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), r.ipv6uri = !0), r.pathNames = Ue(r, r.path), r.queryKey = De(r, r.query), r;
}
function Ue(i, e) {
  const t = /\/{2,9}/g, s = e.replace(t, "/").split("/");
  return (e.slice(0, 1) == "/" || e.length === 0) && s.splice(0, 1), e.slice(-1) == "/" && s.splice(s.length - 1, 1), s;
}
function De(i, e) {
  const t = {};
  return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function(s, n, r) {
    n && (t[n] = r);
  }), t;
}
const F = typeof addEventListener == "function" && typeof removeEventListener == "function", A = [];
F && addEventListener("offline", () => {
  A.forEach((i) => i());
}, !1);
class _ extends l {
  /**
   * Socket constructor.
   *
   * @param {String|Object} uri - uri or options
   * @param {Object} opts - options
   */
  constructor(e, t) {
    if (super(), this.binaryType = _e, this.writeBuffer = [], this._prevBufferLen = 0, this._pingInterval = -1, this._pingTimeout = -1, this._maxPayload = -1, this._pingTimeoutTime = 1 / 0, e && typeof e == "object" && (t = e, e = null), e) {
      const s = P(e);
      t.hostname = s.host, t.secure = s.protocol === "https" || s.protocol === "wss", t.port = s.port, s.query && (t.query = s.query);
    } else t.host && (t.hostname = P(t.host).host);
    R(this, t), this.secure = t.secure != null ? t.secure : typeof location < "u" && location.protocol === "https:", t.hostname && !t.port && (t.port = this.secure ? "443" : "80"), this.hostname = t.hostname || (typeof location < "u" ? location.hostname : "localhost"), this.port = t.port || (typeof location < "u" && location.port ? location.port : this.secure ? "443" : "80"), this.transports = [], this._transportsByName = {}, t.transports.forEach((s) => {
      const n = s.prototype.name;
      this.transports.push(n), this._transportsByName[n] = s;
    }), this.opts = Object.assign({
      path: "/engine.io",
      agent: !1,
      withCredentials: !1,
      upgrade: !0,
      timestampParam: "t",
      rememberUpgrade: !1,
      addTrailingSlash: !0,
      rejectUnauthorized: !0,
      perMessageDeflate: {
        threshold: 1024
      },
      transportOptions: {},
      closeOnBeforeunload: !1
    }, t), this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : ""), typeof this.opts.query == "string" && (this.opts.query = Se(this.opts.query)), F && (this.opts.closeOnBeforeunload && (this._beforeunloadEventListener = () => {
      this.transport && (this.transport.removeAllListeners(), this.transport.close());
    }, addEventListener("beforeunload", this._beforeunloadEventListener, !1)), this.hostname !== "localhost" && (this._offlineEventListener = () => {
      this._onClose("transport close", {
        description: "network connection lost"
      });
    }, A.push(this._offlineEventListener))), this.opts.withCredentials && (this._cookieJar = void 0), this._open();
  }
  /**
   * Creates transport of the given type.
   *
   * @param {String} name - transport name
   * @return {Transport}
   * @private
   */
  createTransport(e) {
    const t = Object.assign({}, this.opts.query);
    t.EIO = te, t.transport = e, this.id && (t.sid = this.id);
    const s = Object.assign({}, this.opts, {
      query: t,
      socket: this,
      hostname: this.hostname,
      secure: this.secure,
      port: this.port
    }, this.opts.transportOptions[e]);
    return new this._transportsByName[e](s);
  }
  /**
   * Initializes transport to use and starts probe.
   *
   * @private
   */
  _open() {
    if (this.transports.length === 0) {
      this.setTimeoutFn(() => {
        this.emitReserved("error", "No transports available");
      }, 0);
      return;
    }
    const e = this.opts.rememberUpgrade && _.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1 ? "websocket" : this.transports[0];
    this.readyState = "opening";
    const t = this.createTransport(e);
    t.open(), this.setTransport(t);
  }
  /**
   * Sets the current transport. Disables the existing one (if any).
   *
   * @private
   */
  setTransport(e) {
    this.transport && this.transport.removeAllListeners(), this.transport = e, e.on("drain", this._onDrain.bind(this)).on("packet", this._onPacket.bind(this)).on("error", this._onError.bind(this)).on("close", (t) => this._onClose("transport close", t));
  }
  /**
   * Called when connection is deemed open.
   *
   * @private
   */
  onOpen() {
    this.readyState = "open", _.priorWebsocketSuccess = this.transport.name === "websocket", this.emitReserved("open"), this.flush();
  }
  /**
   * Handles a packet.
   *
   * @private
   */
  _onPacket(e) {
    if (this.readyState === "opening" || this.readyState === "open" || this.readyState === "closing")
      switch (this.emitReserved("packet", e), this.emitReserved("heartbeat"), e.type) {
        case "open":
          this.onHandshake(JSON.parse(e.data));
          break;
        case "ping":
          this._sendPacket("pong"), this.emitReserved("ping"), this.emitReserved("pong"), this._resetPingTimeout();
          break;
        case "error":
          const t = new Error("server error");
          t.code = e.data, this._onError(t);
          break;
        case "message":
          this.emitReserved("data", e.data), this.emitReserved("message", e.data);
          break;
      }
  }
  /**
   * Called upon handshake completion.
   *
   * @param {Object} data - handshake obj
   * @private
   */
  onHandshake(e) {
    this.emitReserved("handshake", e), this.id = e.sid, this.transport.query.sid = e.sid, this._pingInterval = e.pingInterval, this._pingTimeout = e.pingTimeout, this._maxPayload = e.maxPayload, this.onOpen(), this.readyState !== "closed" && this._resetPingTimeout();
  }
  /**
   * Sets and resets ping timeout timer based on server pings.
   *
   * @private
   */
  _resetPingTimeout() {
    this.clearTimeoutFn(this._pingTimeoutTimer);
    const e = this._pingInterval + this._pingTimeout;
    this._pingTimeoutTime = Date.now() + e, this._pingTimeoutTimer = this.setTimeoutFn(() => {
      this._onClose("ping timeout");
    }, e), this.opts.autoUnref && this._pingTimeoutTimer.unref();
  }
  /**
   * Called on `drain` event
   *
   * @private
   */
  _onDrain() {
    this.writeBuffer.splice(0, this._prevBufferLen), this._prevBufferLen = 0, this.writeBuffer.length === 0 ? this.emitReserved("drain") : this.flush();
  }
  /**
   * Flush write buffers.
   *
   * @private
   */
  flush() {
    if (this.readyState !== "closed" && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
      const e = this._getWritablePackets();
      this.transport.send(e), this._prevBufferLen = e.length, this.emitReserved("flush");
    }
  }
  /**
   * Ensure the encoded size of the writeBuffer is below the maxPayload value sent by the server (only for HTTP
   * long-polling)
   *
   * @private
   */
  _getWritablePackets() {
    if (!(this._maxPayload && this.transport.name === "polling" && this.writeBuffer.length > 1))
      return this.writeBuffer;
    let t = 1;
    for (let s = 0; s < this.writeBuffer.length; s++) {
      const n = this.writeBuffer[s].data;
      if (n && (t += Ee(n)), s > 0 && t > this._maxPayload)
        return this.writeBuffer.slice(0, s);
      t += 2;
    }
    return this.writeBuffer;
  }
  /**
   * Checks whether the heartbeat timer has expired but the socket has not yet been notified.
   *
   * Note: this method is private for now because it does not really fit the WebSocket API, but if we put it in the
   * `write()` method then the message would not be buffered by the Socket.IO client.
   *
   * @return {boolean}
   * @private
   */
  /* private */
  _hasPingExpired() {
    if (!this._pingTimeoutTime)
      return !0;
    const e = Date.now() > this._pingTimeoutTime;
    return e && (this._pingTimeoutTime = 0, x(() => {
      this._onClose("ping timeout");
    }, this.setTimeoutFn)), e;
  }
  /**
   * Sends a message.
   *
   * @param {String} msg - message.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @return {Socket} for chaining.
   */
  write(e, t, s) {
    return this._sendPacket("message", e, t, s), this;
  }
  /**
   * Sends a message. Alias of {@link Socket#write}.
   *
   * @param {String} msg - message.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @return {Socket} for chaining.
   */
  send(e, t, s) {
    return this._sendPacket("message", e, t, s), this;
  }
  /**
   * Sends a packet.
   *
   * @param {String} type: packet type.
   * @param {String} data.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @private
   */
  _sendPacket(e, t, s, n) {
    if (typeof t == "function" && (n = t, t = void 0), typeof s == "function" && (n = s, s = null), this.readyState === "closing" || this.readyState === "closed")
      return;
    s = s || {}, s.compress = s.compress !== !1;
    const r = {
      type: e,
      data: t,
      options: s
    };
    this.emitReserved("packetCreate", r), this.writeBuffer.push(r), n && this.once("flush", n), this.flush();
  }
  /**
   * Closes the connection.
   */
  close() {
    const e = () => {
      this._onClose("forced close"), this.transport.close();
    }, t = () => {
      this.off("upgrade", t), this.off("upgradeError", t), e();
    }, s = () => {
      this.once("upgrade", t), this.once("upgradeError", t);
    };
    return (this.readyState === "opening" || this.readyState === "open") && (this.readyState = "closing", this.writeBuffer.length ? this.once("drain", () => {
      this.upgrading ? s() : e();
    }) : this.upgrading ? s() : e()), this;
  }
  /**
   * Called upon transport error
   *
   * @private
   */
  _onError(e) {
    if (_.priorWebsocketSuccess = !1, this.opts.tryAllTransports && this.transports.length > 1 && this.readyState === "opening")
      return this.transports.shift(), this._open();
    this.emitReserved("error", e), this._onClose("transport error", e);
  }
  /**
   * Called upon transport close.
   *
   * @private
   */
  _onClose(e, t) {
    if (this.readyState === "opening" || this.readyState === "open" || this.readyState === "closing") {
      if (this.clearTimeoutFn(this._pingTimeoutTimer), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), F && (this._beforeunloadEventListener && removeEventListener("beforeunload", this._beforeunloadEventListener, !1), this._offlineEventListener)) {
        const s = A.indexOf(this._offlineEventListener);
        s !== -1 && A.splice(s, 1);
      }
      this.readyState = "closed", this.id = null, this.emitReserved("close", e, t), this.writeBuffer = [], this._prevBufferLen = 0;
    }
  }
}
_.protocol = te;
class $e extends _ {
  constructor() {
    super(...arguments), this._upgrades = [];
  }
  onOpen() {
    if (super.onOpen(), this.readyState === "open" && this.opts.upgrade)
      for (let e = 0; e < this._upgrades.length; e++)
        this._probe(this._upgrades[e]);
  }
  /**
   * Probes a transport.
   *
   * @param {String} name - transport name
   * @private
   */
  _probe(e) {
    let t = this.createTransport(e), s = !1;
    _.priorWebsocketSuccess = !1;
    const n = () => {
      s || (t.send([{ type: "ping", data: "probe" }]), t.once("packet", (m) => {
        if (!s)
          if (m.type === "pong" && m.data === "probe") {
            if (this.upgrading = !0, this.emitReserved("upgrading", t), !t)
              return;
            _.priorWebsocketSuccess = t.name === "websocket", this.transport.pause(() => {
              s || this.readyState !== "closed" && (u(), this.setTransport(t), t.send([{ type: "upgrade" }]), this.emitReserved("upgrade", t), t = null, this.upgrading = !1, this.flush());
            });
          } else {
            const b = new Error("probe error");
            b.transport = t.name, this.emitReserved("upgradeError", b);
          }
      }));
    };
    function r() {
      s || (s = !0, u(), t.close(), t = null);
    }
    const o = (m) => {
      const b = new Error("probe error: " + m);
      b.transport = t.name, r(), this.emitReserved("upgradeError", b);
    };
    function a() {
      o("transport closed");
    }
    function h() {
      o("socket closed");
    }
    function p(m) {
      t && m.name !== t.name && r();
    }
    const u = () => {
      t.removeListener("open", n), t.removeListener("error", o), t.removeListener("close", a), this.off("close", h), this.off("upgrading", p);
    };
    t.once("open", n), t.once("error", o), t.once("close", a), this.once("close", h), this.once("upgrading", p), this._upgrades.indexOf("webtransport") !== -1 && e !== "webtransport" ? this.setTimeoutFn(() => {
      s || t.open();
    }, 200) : t.open();
  }
  onHandshake(e) {
    this._upgrades = this._filterUpgrades(e.upgrades), super.onHandshake(e);
  }
  /**
   * Filters upgrades, returning only those matching client transports.
   *
   * @param {Array} upgrades - server upgrades
   * @private
   */
  _filterUpgrades(e) {
    const t = [];
    for (let s = 0; s < e.length; s++)
      ~this.transports.indexOf(e[s]) && t.push(e[s]);
    return t;
  }
}
let ze = class extends $e {
  constructor(e, t = {}) {
    const s = typeof e == "object" ? e : t;
    (!s.transports || s.transports && typeof s.transports[0] == "string") && (s.transports = (s.transports || ["polling", "websocket", "webtransport"]).map((n) => Fe[n]).filter((n) => !!n)), super(e, s);
  }
};
function Ve(i, e = "", t) {
  let s = i;
  t = t || typeof location < "u" && location, i == null && (i = t.protocol + "//" + t.host), typeof i == "string" && (i.charAt(0) === "/" && (i.charAt(1) === "/" ? i = t.protocol + i : i = t.host + i), /^(https?|wss?):\/\//.test(i) || (typeof t < "u" ? i = t.protocol + "//" + i : i = "https://" + i), s = P(i)), s.port || (/^(http|ws)$/.test(s.protocol) ? s.port = "80" : /^(http|ws)s$/.test(s.protocol) && (s.port = "443")), s.path = s.path || "/";
  const r = s.host.indexOf(":") !== -1 ? "[" + s.host + "]" : s.host;
  return s.id = s.protocol + "://" + r + ":" + s.port + e, s.href = s.protocol + "://" + r + (t && t.port === s.port ? "" : ":" + s.port), s;
}
const He = typeof ArrayBuffer == "function", Ke = (i) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(i) : i.buffer instanceof ArrayBuffer, ae = Object.prototype.toString, We = typeof Blob == "function" || typeof Blob < "u" && ae.call(Blob) === "[object BlobConstructor]", Ye = typeof File == "function" || typeof File < "u" && ae.call(File) === "[object FileConstructor]";
function V(i) {
  return He && (i instanceof ArrayBuffer || Ke(i)) || We && i instanceof Blob || Ye && i instanceof File;
}
function B(i, e) {
  if (!i || typeof i != "object")
    return !1;
  if (Array.isArray(i)) {
    for (let t = 0, s = i.length; t < s; t++)
      if (B(i[t]))
        return !0;
    return !1;
  }
  if (V(i))
    return !0;
  if (i.toJSON && typeof i.toJSON == "function" && arguments.length === 1)
    return B(i.toJSON(), !0);
  for (const t in i)
    if (Object.prototype.hasOwnProperty.call(i, t) && B(i[t]))
      return !0;
  return !1;
}
function Xe(i) {
  const e = [], t = i.data, s = i;
  return s.data = M(t, e), s.attachments = e.length, { packet: s, buffers: e };
}
function M(i, e) {
  if (!i)
    return i;
  if (V(i)) {
    const t = { _placeholder: !0, num: e.length };
    return e.push(i), t;
  } else if (Array.isArray(i)) {
    const t = new Array(i.length);
    for (let s = 0; s < i.length; s++)
      t[s] = M(i[s], e);
    return t;
  } else if (typeof i == "object" && !(i instanceof Date)) {
    const t = {};
    for (const s in i)
      Object.prototype.hasOwnProperty.call(i, s) && (t[s] = M(i[s], e));
    return t;
  }
  return i;
}
function Je(i, e) {
  return i.data = q(i.data, e), delete i.attachments, i;
}
function q(i, e) {
  if (!i)
    return i;
  if (i && i._placeholder === !0) {
    if (typeof i.num == "number" && i.num >= 0 && i.num < e.length)
      return e[i.num];
    throw new Error("illegal attachments");
  } else if (Array.isArray(i))
    for (let t = 0; t < i.length; t++)
      i[t] = q(i[t], e);
  else if (typeof i == "object")
    for (const t in i)
      Object.prototype.hasOwnProperty.call(i, t) && (i[t] = q(i[t], e));
  return i;
}
const je = [
  "connect",
  "connect_error",
  "disconnect",
  "disconnecting",
  "newListener",
  "removeListener"
  // used by the Node.js EventEmitter
], Qe = 5;
var c;
(function(i) {
  i[i.CONNECT = 0] = "CONNECT", i[i.DISCONNECT = 1] = "DISCONNECT", i[i.EVENT = 2] = "EVENT", i[i.ACK = 3] = "ACK", i[i.CONNECT_ERROR = 4] = "CONNECT_ERROR", i[i.BINARY_EVENT = 5] = "BINARY_EVENT", i[i.BINARY_ACK = 6] = "BINARY_ACK";
})(c || (c = {}));
class Ge {
  /**
   * Encoder constructor
   *
   * @param {function} replacer - custom replacer to pass down to JSON.parse
   */
  constructor(e) {
    this.replacer = e;
  }
  /**
   * Encode a packet as a single string if non-binary, or as a
   * buffer sequence, depending on packet type.
   *
   * @param {Object} obj - packet object
   */
  encode(e) {
    return (e.type === c.EVENT || e.type === c.ACK) && B(e) ? this.encodeAsBinary({
      type: e.type === c.EVENT ? c.BINARY_EVENT : c.BINARY_ACK,
      nsp: e.nsp,
      data: e.data,
      id: e.id
    }) : [this.encodeAsString(e)];
  }
  /**
   * Encode packet as string.
   */
  encodeAsString(e) {
    let t = "" + e.type;
    return (e.type === c.BINARY_EVENT || e.type === c.BINARY_ACK) && (t += e.attachments + "-"), e.nsp && e.nsp !== "/" && (t += e.nsp + ","), e.id != null && (t += e.id), e.data != null && (t += JSON.stringify(e.data, this.replacer)), t;
  }
  /**
   * Encode packet as 'buffer sequence' by removing blobs, and
   * deconstructing packet into object with placeholders and
   * a list of buffers.
   */
  encodeAsBinary(e) {
    const t = Xe(e), s = this.encodeAsString(t.packet), n = t.buffers;
    return n.unshift(s), n;
  }
}
function J(i) {
  return Object.prototype.toString.call(i) === "[object Object]";
}
class H extends l {
  /**
   * Decoder constructor
   *
   * @param {function} reviver - custom reviver to pass down to JSON.stringify
   */
  constructor(e) {
    super(), this.reviver = e;
  }
  /**
   * Decodes an encoded packet string into packet JSON.
   *
   * @param {String} obj - encoded packet
   */
  add(e) {
    let t;
    if (typeof e == "string") {
      if (this.reconstructor)
        throw new Error("got plaintext data when reconstructing a packet");
      t = this.decodeString(e);
      const s = t.type === c.BINARY_EVENT;
      s || t.type === c.BINARY_ACK ? (t.type = s ? c.EVENT : c.ACK, this.reconstructor = new Ze(t), t.attachments === 0 && super.emitReserved("decoded", t)) : super.emitReserved("decoded", t);
    } else if (V(e) || e.base64)
      if (this.reconstructor)
        t = this.reconstructor.takeBinaryData(e), t && (this.reconstructor = null, super.emitReserved("decoded", t));
      else
        throw new Error("got binary data when not reconstructing a packet");
    else
      throw new Error("Unknown type: " + e);
  }
  /**
   * Decode a packet String (JSON data)
   *
   * @param {String} str
   * @return {Object} packet
   */
  decodeString(e) {
    let t = 0;
    const s = {
      type: Number(e.charAt(0))
    };
    if (c[s.type] === void 0)
      throw new Error("unknown packet type " + s.type);
    if (s.type === c.BINARY_EVENT || s.type === c.BINARY_ACK) {
      const r = t + 1;
      for (; e.charAt(++t) !== "-" && t != e.length; )
        ;
      const o = e.substring(r, t);
      if (o != Number(o) || e.charAt(t) !== "-")
        throw new Error("Illegal attachments");
      s.attachments = Number(o);
    }
    if (e.charAt(t + 1) === "/") {
      const r = t + 1;
      for (; ++t && !(e.charAt(t) === "," || t === e.length); )
        ;
      s.nsp = e.substring(r, t);
    } else
      s.nsp = "/";
    const n = e.charAt(t + 1);
    if (n !== "" && Number(n) == n) {
      const r = t + 1;
      for (; ++t; ) {
        const o = e.charAt(t);
        if (o == null || Number(o) != o) {
          --t;
          break;
        }
        if (t === e.length)
          break;
      }
      s.id = Number(e.substring(r, t + 1));
    }
    if (e.charAt(++t)) {
      const r = this.tryParse(e.substr(t));
      if (H.isPayloadValid(s.type, r))
        s.data = r;
      else
        throw new Error("invalid payload");
    }
    return s;
  }
  tryParse(e) {
    try {
      return JSON.parse(e, this.reviver);
    } catch {
      return !1;
    }
  }
  static isPayloadValid(e, t) {
    switch (e) {
      case c.CONNECT:
        return J(t);
      case c.DISCONNECT:
        return t === void 0;
      case c.CONNECT_ERROR:
        return typeof t == "string" || J(t);
      case c.EVENT:
      case c.BINARY_EVENT:
        return Array.isArray(t) && (typeof t[0] == "number" || typeof t[0] == "string" && je.indexOf(t[0]) === -1);
      case c.ACK:
      case c.BINARY_ACK:
        return Array.isArray(t);
    }
  }
  /**
   * Deallocates a parser's resources
   */
  destroy() {
    this.reconstructor && (this.reconstructor.finishedReconstruction(), this.reconstructor = null);
  }
}
class Ze {
  constructor(e) {
    this.packet = e, this.buffers = [], this.reconPack = e;
  }
  /**
   * Method to be called when binary data received from connection
   * after a BINARY_EVENT packet.
   *
   * @param {Buffer | ArrayBuffer} binData - the raw binary data received
   * @return {null | Object} returns null if more binary data is expected or
   *   a reconstructed packet object if all buffers have been received.
   */
  takeBinaryData(e) {
    if (this.buffers.push(e), this.buffers.length === this.reconPack.attachments) {
      const t = Je(this.reconPack, this.buffers);
      return this.finishedReconstruction(), t;
    }
    return null;
  }
  /**
   * Cleans up binary packet reconstruction variables.
   */
  finishedReconstruction() {
    this.reconPack = null, this.buffers = [];
  }
}
const et = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Decoder: H,
  Encoder: Ge,
  get PacketType() {
    return c;
  },
  protocol: Qe
}, Symbol.toStringTag, { value: "Module" }));
function f(i, e, t) {
  return i.on(e, t), function() {
    i.off(e, t);
  };
}
const tt = Object.freeze({
  connect: 1,
  connect_error: 1,
  disconnect: 1,
  disconnecting: 1,
  // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
  newListener: 1,
  removeListener: 1
});
class ce extends l {
  /**
   * `Socket` constructor.
   */
  constructor(e, t, s) {
    super(), this.connected = !1, this.recovered = !1, this.receiveBuffer = [], this.sendBuffer = [], this._queue = [], this._queueSeq = 0, this.ids = 0, this.acks = {}, this.flags = {}, this.io = e, this.nsp = t, s && s.auth && (this.auth = s.auth), this._opts = Object.assign({}, s), this.io._autoConnect && this.open();
  }
  /**
   * Whether the socket is currently disconnected
   *
   * @example
   * const socket = io();
   *
   * socket.on("connect", () => {
   *   console.log(socket.disconnected); // false
   * });
   *
   * socket.on("disconnect", () => {
   *   console.log(socket.disconnected); // true
   * });
   */
  get disconnected() {
    return !this.connected;
  }
  /**
   * Subscribe to open, close and packet events
   *
   * @private
   */
  subEvents() {
    if (this.subs)
      return;
    const e = this.io;
    this.subs = [
      f(e, "open", this.onopen.bind(this)),
      f(e, "packet", this.onpacket.bind(this)),
      f(e, "error", this.onerror.bind(this)),
      f(e, "close", this.onclose.bind(this))
    ];
  }
  /**
   * Whether the Socket will try to reconnect when its Manager connects or reconnects.
   *
   * @example
   * const socket = io();
   *
   * console.log(socket.active); // true
   *
   * socket.on("disconnect", (reason) => {
   *   if (reason === "io server disconnect") {
   *     // the disconnection was initiated by the server, you need to manually reconnect
   *     console.log(socket.active); // false
   *   }
   *   // else the socket will automatically try to reconnect
   *   console.log(socket.active); // true
   * });
   */
  get active() {
    return !!this.subs;
  }
  /**
   * "Opens" the socket.
   *
   * @example
   * const socket = io({
   *   autoConnect: false
   * });
   *
   * socket.connect();
   */
  connect() {
    return this.connected ? this : (this.subEvents(), this.io._reconnecting || this.io.open(), this.io._readyState === "open" && this.onopen(), this);
  }
  /**
   * Alias for {@link connect()}.
   */
  open() {
    return this.connect();
  }
  /**
   * Sends a `message` event.
   *
   * This method mimics the WebSocket.send() method.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
   *
   * @example
   * socket.send("hello");
   *
   * // this is equivalent to
   * socket.emit("message", "hello");
   *
   * @return self
   */
  send(...e) {
    return e.unshift("message"), this.emit.apply(this, e), this;
  }
  /**
   * Override `emit`.
   * If the event is in `events`, it's emitted normally.
   *
   * @example
   * socket.emit("hello", "world");
   *
   * // all serializable datastructures are supported (no need to call JSON.stringify)
   * socket.emit("hello", 1, "2", { 3: ["4"], 5: Uint8Array.from([6]) });
   *
   * // with an acknowledgement from the server
   * socket.emit("hello", "world", (val) => {
   *   // ...
   * });
   *
   * @return self
   */
  emit(e, ...t) {
    var s, n, r;
    if (tt.hasOwnProperty(e))
      throw new Error('"' + e.toString() + '" is a reserved event name');
    if (t.unshift(e), this._opts.retries && !this.flags.fromQueue && !this.flags.volatile)
      return this._addToQueue(t), this;
    const o = {
      type: c.EVENT,
      data: t
    };
    if (o.options = {}, o.options.compress = this.flags.compress !== !1, typeof t[t.length - 1] == "function") {
      const u = this.ids++, m = t.pop();
      this._registerAckCallback(u, m), o.id = u;
    }
    const a = (n = (s = this.io.engine) === null || s === void 0 ? void 0 : s.transport) === null || n === void 0 ? void 0 : n.writable, h = this.connected && !(!((r = this.io.engine) === null || r === void 0) && r._hasPingExpired());
    return this.flags.volatile && !a || (h ? (this.notifyOutgoingListeners(o), this.packet(o)) : this.sendBuffer.push(o)), this.flags = {}, this;
  }
  /**
   * @private
   */
  _registerAckCallback(e, t) {
    var s;
    const n = (s = this.flags.timeout) !== null && s !== void 0 ? s : this._opts.ackTimeout;
    if (n === void 0) {
      this.acks[e] = t;
      return;
    }
    const r = this.io.setTimeoutFn(() => {
      delete this.acks[e];
      for (let a = 0; a < this.sendBuffer.length; a++)
        this.sendBuffer[a].id === e && this.sendBuffer.splice(a, 1);
      t.call(this, new Error("operation has timed out"));
    }, n), o = (...a) => {
      this.io.clearTimeoutFn(r), t.apply(this, a);
    };
    o.withError = !0, this.acks[e] = o;
  }
  /**
   * Emits an event and waits for an acknowledgement
   *
   * @example
   * // without timeout
   * const response = await socket.emitWithAck("hello", "world");
   *
   * // with a specific timeout
   * try {
   *   const response = await socket.timeout(1000).emitWithAck("hello", "world");
   * } catch (err) {
   *   // the server did not acknowledge the event in the given delay
   * }
   *
   * @return a Promise that will be fulfilled when the server acknowledges the event
   */
  emitWithAck(e, ...t) {
    return new Promise((s, n) => {
      const r = (o, a) => o ? n(o) : s(a);
      r.withError = !0, t.push(r), this.emit(e, ...t);
    });
  }
  /**
   * Add the packet to the queue.
   * @param args
   * @private
   */
  _addToQueue(e) {
    let t;
    typeof e[e.length - 1] == "function" && (t = e.pop());
    const s = {
      id: this._queueSeq++,
      tryCount: 0,
      pending: !1,
      args: e,
      flags: Object.assign({ fromQueue: !0 }, this.flags)
    };
    e.push((n, ...r) => s !== this._queue[0] ? void 0 : (n !== null ? s.tryCount > this._opts.retries && (this._queue.shift(), t && t(n)) : (this._queue.shift(), t && t(null, ...r)), s.pending = !1, this._drainQueue())), this._queue.push(s), this._drainQueue();
  }
  /**
   * Send the first packet of the queue, and wait for an acknowledgement from the server.
   * @param force - whether to resend a packet that has not been acknowledged yet
   *
   * @private
   */
  _drainQueue(e = !1) {
    if (!this.connected || this._queue.length === 0)
      return;
    const t = this._queue[0];
    t.pending && !e || (t.pending = !0, t.tryCount++, this.flags = t.flags, this.emit.apply(this, t.args));
  }
  /**
   * Sends a packet.
   *
   * @param packet
   * @private
   */
  packet(e) {
    e.nsp = this.nsp, this.io._packet(e);
  }
  /**
   * Called upon engine `open`.
   *
   * @private
   */
  onopen() {
    typeof this.auth == "function" ? this.auth((e) => {
      this._sendConnectPacket(e);
    }) : this._sendConnectPacket(this.auth);
  }
  /**
   * Sends a CONNECT packet to initiate the Socket.IO session.
   *
   * @param data
   * @private
   */
  _sendConnectPacket(e) {
    this.packet({
      type: c.CONNECT,
      data: this._pid ? Object.assign({ pid: this._pid, offset: this._lastOffset }, e) : e
    });
  }
  /**
   * Called upon engine or manager `error`.
   *
   * @param err
   * @private
   */
  onerror(e) {
    this.connected || this.emitReserved("connect_error", e);
  }
  /**
   * Called upon engine `close`.
   *
   * @param reason
   * @param description
   * @private
   */
  onclose(e, t) {
    this.connected = !1, delete this.id, this.emitReserved("disconnect", e, t), this._clearAcks();
  }
  /**
   * Clears the acknowledgement handlers upon disconnection, since the client will never receive an acknowledgement from
   * the server.
   *
   * @private
   */
  _clearAcks() {
    Object.keys(this.acks).forEach((e) => {
      if (!this.sendBuffer.some((s) => String(s.id) === e)) {
        const s = this.acks[e];
        delete this.acks[e], s.withError && s.call(this, new Error("socket has been disconnected"));
      }
    });
  }
  /**
   * Called with socket packet.
   *
   * @param packet
   * @private
   */
  onpacket(e) {
    if (e.nsp === this.nsp)
      switch (e.type) {
        case c.CONNECT:
          e.data && e.data.sid ? this.onconnect(e.data.sid, e.data.pid) : this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
          break;
        case c.EVENT:
        case c.BINARY_EVENT:
          this.onevent(e);
          break;
        case c.ACK:
        case c.BINARY_ACK:
          this.onack(e);
          break;
        case c.DISCONNECT:
          this.ondisconnect();
          break;
        case c.CONNECT_ERROR:
          this.destroy();
          const s = new Error(e.data.message);
          s.data = e.data.data, this.emitReserved("connect_error", s);
          break;
      }
  }
  /**
   * Called upon a server event.
   *
   * @param packet
   * @private
   */
  onevent(e) {
    const t = e.data || [];
    e.id != null && t.push(this.ack(e.id)), this.connected ? this.emitEvent(t) : this.receiveBuffer.push(Object.freeze(t));
  }
  emitEvent(e) {
    if (this._anyListeners && this._anyListeners.length) {
      const t = this._anyListeners.slice();
      for (const s of t)
        s.apply(this, e);
    }
    super.emit.apply(this, e), this._pid && e.length && typeof e[e.length - 1] == "string" && (this._lastOffset = e[e.length - 1]);
  }
  /**
   * Produces an ack callback to emit with an event.
   *
   * @private
   */
  ack(e) {
    const t = this;
    let s = !1;
    return function(...n) {
      s || (s = !0, t.packet({
        type: c.ACK,
        id: e,
        data: n
      }));
    };
  }
  /**
   * Called upon a server acknowledgement.
   *
   * @param packet
   * @private
   */
  onack(e) {
    const t = this.acks[e.id];
    typeof t == "function" && (delete this.acks[e.id], t.withError && e.data.unshift(null), t.apply(this, e.data));
  }
  /**
   * Called upon server connect.
   *
   * @private
   */
  onconnect(e, t) {
    this.id = e, this.recovered = t && this._pid === t, this._pid = t, this.connected = !0, this.emitBuffered(), this.emitReserved("connect"), this._drainQueue(!0);
  }
  /**
   * Emit buffered events (received and emitted).
   *
   * @private
   */
  emitBuffered() {
    this.receiveBuffer.forEach((e) => this.emitEvent(e)), this.receiveBuffer = [], this.sendBuffer.forEach((e) => {
      this.notifyOutgoingListeners(e), this.packet(e);
    }), this.sendBuffer = [];
  }
  /**
   * Called upon server disconnect.
   *
   * @private
   */
  ondisconnect() {
    this.destroy(), this.onclose("io server disconnect");
  }
  /**
   * Called upon forced client/server side disconnections,
   * this method ensures the manager stops tracking us and
   * that reconnections don't get triggered for this.
   *
   * @private
   */
  destroy() {
    this.subs && (this.subs.forEach((e) => e()), this.subs = void 0), this.io._destroy(this);
  }
  /**
   * Disconnects the socket manually. In that case, the socket will not try to reconnect.
   *
   * If this is the last active Socket instance of the {@link Manager}, the low-level connection will be closed.
   *
   * @example
   * const socket = io();
   *
   * socket.on("disconnect", (reason) => {
   *   // console.log(reason); prints "io client disconnect"
   * });
   *
   * socket.disconnect();
   *
   * @return self
   */
  disconnect() {
    return this.connected && this.packet({ type: c.DISCONNECT }), this.destroy(), this.connected && this.onclose("io client disconnect"), this;
  }
  /**
   * Alias for {@link disconnect()}.
   *
   * @return self
   */
  close() {
    return this.disconnect();
  }
  /**
   * Sets the compress flag.
   *
   * @example
   * socket.compress(false).emit("hello");
   *
   * @param compress - if `true`, compresses the sending data
   * @return self
   */
  compress(e) {
    return this.flags.compress = e, this;
  }
  /**
   * Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
   * ready to send messages.
   *
   * @example
   * socket.volatile.emit("hello"); // the server may or may not receive it
   *
   * @returns self
   */
  get volatile() {
    return this.flags.volatile = !0, this;
  }
  /**
   * Sets a modifier for a subsequent event emission that the callback will be called with an error when the
   * given number of milliseconds have elapsed without an acknowledgement from the server:
   *
   * @example
   * socket.timeout(5000).emit("my-event", (err) => {
   *   if (err) {
   *     // the server did not acknowledge the event in the given delay
   *   }
   * });
   *
   * @returns self
   */
  timeout(e) {
    return this.flags.timeout = e, this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback.
   *
   * @example
   * socket.onAny((event, ...args) => {
   *   console.log(`got ${event}`);
   * });
   *
   * @param listener
   */
  onAny(e) {
    return this._anyListeners = this._anyListeners || [], this._anyListeners.push(e), this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback. The listener is added to the beginning of the listeners array.
   *
   * @example
   * socket.prependAny((event, ...args) => {
   *   console.log(`got event ${event}`);
   * });
   *
   * @param listener
   */
  prependAny(e) {
    return this._anyListeners = this._anyListeners || [], this._anyListeners.unshift(e), this;
  }
  /**
   * Removes the listener that will be fired when any event is emitted.
   *
   * @example
   * const catchAllListener = (event, ...args) => {
   *   console.log(`got event ${event}`);
   * }
   *
   * socket.onAny(catchAllListener);
   *
   * // remove a specific listener
   * socket.offAny(catchAllListener);
   *
   * // or remove all listeners
   * socket.offAny();
   *
   * @param listener
   */
  offAny(e) {
    if (!this._anyListeners)
      return this;
    if (e) {
      const t = this._anyListeners;
      for (let s = 0; s < t.length; s++)
        if (e === t[s])
          return t.splice(s, 1), this;
    } else
      this._anyListeners = [];
    return this;
  }
  /**
   * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
   * e.g. to remove listeners.
   */
  listenersAny() {
    return this._anyListeners || [];
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback.
   *
   * Note: acknowledgements sent to the server are not included.
   *
   * @example
   * socket.onAnyOutgoing((event, ...args) => {
   *   console.log(`sent event ${event}`);
   * });
   *
   * @param listener
   */
  onAnyOutgoing(e) {
    return this._anyOutgoingListeners = this._anyOutgoingListeners || [], this._anyOutgoingListeners.push(e), this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback. The listener is added to the beginning of the listeners array.
   *
   * Note: acknowledgements sent to the server are not included.
   *
   * @example
   * socket.prependAnyOutgoing((event, ...args) => {
   *   console.log(`sent event ${event}`);
   * });
   *
   * @param listener
   */
  prependAnyOutgoing(e) {
    return this._anyOutgoingListeners = this._anyOutgoingListeners || [], this._anyOutgoingListeners.unshift(e), this;
  }
  /**
   * Removes the listener that will be fired when any event is emitted.
   *
   * @example
   * const catchAllListener = (event, ...args) => {
   *   console.log(`sent event ${event}`);
   * }
   *
   * socket.onAnyOutgoing(catchAllListener);
   *
   * // remove a specific listener
   * socket.offAnyOutgoing(catchAllListener);
   *
   * // or remove all listeners
   * socket.offAnyOutgoing();
   *
   * @param [listener] - the catch-all listener (optional)
   */
  offAnyOutgoing(e) {
    if (!this._anyOutgoingListeners)
      return this;
    if (e) {
      const t = this._anyOutgoingListeners;
      for (let s = 0; s < t.length; s++)
        if (e === t[s])
          return t.splice(s, 1), this;
    } else
      this._anyOutgoingListeners = [];
    return this;
  }
  /**
   * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
   * e.g. to remove listeners.
   */
  listenersAnyOutgoing() {
    return this._anyOutgoingListeners || [];
  }
  /**
   * Notify the listeners for each packet sent
   *
   * @param packet
   *
   * @private
   */
  notifyOutgoingListeners(e) {
    if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
      const t = this._anyOutgoingListeners.slice();
      for (const s of t)
        s.apply(this, e.data);
    }
  }
}
function v(i) {
  i = i || {}, this.ms = i.min || 100, this.max = i.max || 1e4, this.factor = i.factor || 2, this.jitter = i.jitter > 0 && i.jitter <= 1 ? i.jitter : 0, this.attempts = 0;
}
v.prototype.duration = function() {
  var i = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var e = Math.random(), t = Math.floor(e * this.jitter * i);
    i = Math.floor(e * 10) & 1 ? i + t : i - t;
  }
  return Math.min(i, this.max) | 0;
};
v.prototype.reset = function() {
  this.attempts = 0;
};
v.prototype.setMin = function(i) {
  this.ms = i;
};
v.prototype.setMax = function(i) {
  this.max = i;
};
v.prototype.setJitter = function(i) {
  this.jitter = i;
};
class U extends l {
  constructor(e, t) {
    var s;
    super(), this.nsps = {}, this.subs = [], e && typeof e == "object" && (t = e, e = void 0), t = t || {}, t.path = t.path || "/socket.io", this.opts = t, R(this, t), this.reconnection(t.reconnection !== !1), this.reconnectionAttempts(t.reconnectionAttempts || 1 / 0), this.reconnectionDelay(t.reconnectionDelay || 1e3), this.reconnectionDelayMax(t.reconnectionDelayMax || 5e3), this.randomizationFactor((s = t.randomizationFactor) !== null && s !== void 0 ? s : 0.5), this.backoff = new v({
      min: this.reconnectionDelay(),
      max: this.reconnectionDelayMax(),
      jitter: this.randomizationFactor()
    }), this.timeout(t.timeout == null ? 2e4 : t.timeout), this._readyState = "closed", this.uri = e;
    const n = t.parser || et;
    this.encoder = new n.Encoder(), this.decoder = new n.Decoder(), this._autoConnect = t.autoConnect !== !1, this._autoConnect && this.open();
  }
  reconnection(e) {
    return arguments.length ? (this._reconnection = !!e, e || (this.skipReconnect = !0), this) : this._reconnection;
  }
  reconnectionAttempts(e) {
    return e === void 0 ? this._reconnectionAttempts : (this._reconnectionAttempts = e, this);
  }
  reconnectionDelay(e) {
    var t;
    return e === void 0 ? this._reconnectionDelay : (this._reconnectionDelay = e, (t = this.backoff) === null || t === void 0 || t.setMin(e), this);
  }
  randomizationFactor(e) {
    var t;
    return e === void 0 ? this._randomizationFactor : (this._randomizationFactor = e, (t = this.backoff) === null || t === void 0 || t.setJitter(e), this);
  }
  reconnectionDelayMax(e) {
    var t;
    return e === void 0 ? this._reconnectionDelayMax : (this._reconnectionDelayMax = e, (t = this.backoff) === null || t === void 0 || t.setMax(e), this);
  }
  timeout(e) {
    return arguments.length ? (this._timeout = e, this) : this._timeout;
  }
  /**
   * Starts trying to reconnect if reconnection is enabled and we have not
   * started reconnecting yet
   *
   * @private
   */
  maybeReconnectOnOpen() {
    !this._reconnecting && this._reconnection && this.backoff.attempts === 0 && this.reconnect();
  }
  /**
   * Sets the current transport `socket`.
   *
   * @param {Function} fn - optional, callback
   * @return self
   * @public
   */
  open(e) {
    if (~this._readyState.indexOf("open"))
      return this;
    this.engine = new ze(this.uri, this.opts);
    const t = this.engine, s = this;
    this._readyState = "opening", this.skipReconnect = !1;
    const n = f(t, "open", function() {
      s.onopen(), e && e();
    }), r = (a) => {
      this.cleanup(), this._readyState = "closed", this.emitReserved("error", a), e ? e(a) : this.maybeReconnectOnOpen();
    }, o = f(t, "error", r);
    if (this._timeout !== !1) {
      const a = this._timeout, h = this.setTimeoutFn(() => {
        n(), r(new Error("timeout")), t.close();
      }, a);
      this.opts.autoUnref && h.unref(), this.subs.push(() => {
        this.clearTimeoutFn(h);
      });
    }
    return this.subs.push(n), this.subs.push(o), this;
  }
  /**
   * Alias for open()
   *
   * @return self
   * @public
   */
  connect(e) {
    return this.open(e);
  }
  /**
   * Called upon transport open.
   *
   * @private
   */
  onopen() {
    this.cleanup(), this._readyState = "open", this.emitReserved("open");
    const e = this.engine;
    this.subs.push(
      f(e, "ping", this.onping.bind(this)),
      f(e, "data", this.ondata.bind(this)),
      f(e, "error", this.onerror.bind(this)),
      f(e, "close", this.onclose.bind(this)),
      // @ts-ignore
      f(this.decoder, "decoded", this.ondecoded.bind(this))
    );
  }
  /**
   * Called upon a ping.
   *
   * @private
   */
  onping() {
    this.emitReserved("ping");
  }
  /**
   * Called with data.
   *
   * @private
   */
  ondata(e) {
    try {
      this.decoder.add(e);
    } catch (t) {
      this.onclose("parse error", t);
    }
  }
  /**
   * Called when parser fully decodes a packet.
   *
   * @private
   */
  ondecoded(e) {
    x(() => {
      this.emitReserved("packet", e);
    }, this.setTimeoutFn);
  }
  /**
   * Called upon socket error.
   *
   * @private
   */
  onerror(e) {
    this.emitReserved("error", e);
  }
  /**
   * Creates a new socket for the given `nsp`.
   *
   * @return {Socket}
   * @public
   */
  socket(e, t) {
    let s = this.nsps[e];
    return s ? this._autoConnect && !s.active && s.connect() : (s = new ce(this, e, t), this.nsps[e] = s), s;
  }
  /**
   * Called upon a socket close.
   *
   * @param socket
   * @private
   */
  _destroy(e) {
    const t = Object.keys(this.nsps);
    for (const s of t)
      if (this.nsps[s].active)
        return;
    this._close();
  }
  /**
   * Writes a packet.
   *
   * @param packet
   * @private
   */
  _packet(e) {
    const t = this.encoder.encode(e);
    for (let s = 0; s < t.length; s++)
      this.engine.write(t[s], e.options);
  }
  /**
   * Clean up transport subscriptions and packet buffer.
   *
   * @private
   */
  cleanup() {
    this.subs.forEach((e) => e()), this.subs.length = 0, this.decoder.destroy();
  }
  /**
   * Close the current socket.
   *
   * @private
   */
  _close() {
    this.skipReconnect = !0, this._reconnecting = !1, this.onclose("forced close");
  }
  /**
   * Alias for close()
   *
   * @private
   */
  disconnect() {
    return this._close();
  }
  /**
   * Called when:
   *
   * - the low-level engine is closed
   * - the parser encountered a badly formatted packet
   * - all sockets are disconnected
   *
   * @private
   */
  onclose(e, t) {
    var s;
    this.cleanup(), (s = this.engine) === null || s === void 0 || s.close(), this.backoff.reset(), this._readyState = "closed", this.emitReserved("close", e, t), this._reconnection && !this.skipReconnect && this.reconnect();
  }
  /**
   * Attempt a reconnection.
   *
   * @private
   */
  reconnect() {
    if (this._reconnecting || this.skipReconnect)
      return this;
    const e = this;
    if (this.backoff.attempts >= this._reconnectionAttempts)
      this.backoff.reset(), this.emitReserved("reconnect_failed"), this._reconnecting = !1;
    else {
      const t = this.backoff.duration();
      this._reconnecting = !0;
      const s = this.setTimeoutFn(() => {
        e.skipReconnect || (this.emitReserved("reconnect_attempt", e.backoff.attempts), !e.skipReconnect && e.open((n) => {
          n ? (e._reconnecting = !1, e.reconnect(), this.emitReserved("reconnect_error", n)) : e.onreconnect();
        }));
      }, t);
      this.opts.autoUnref && s.unref(), this.subs.push(() => {
        this.clearTimeoutFn(s);
      });
    }
  }
  /**
   * Called upon successful reconnect.
   *
   * @private
   */
  onreconnect() {
    const e = this.backoff.attempts;
    this._reconnecting = !1, this.backoff.reset(), this.emitReserved("reconnect", e);
  }
}
const w = {};
function C(i, e) {
  typeof i == "object" && (e = i, i = void 0), e = e || {};
  const t = Ve(i, e.path || "/socket.io"), s = t.source, n = t.id, r = t.path, o = w[n] && r in w[n].nsps, a = e.forceNew || e["force new connection"] || e.multiplex === !1 || o;
  let h;
  return a ? h = new U(s, e) : (w[n] || (w[n] = new U(s, e)), h = w[n]), t.query && !e.query && (e.query = t.queryKey), h.socket(t.path, e);
}
Object.assign(C, {
  Manager: U,
  Socket: ce,
  io: C,
  connect: C
});
class st {
  constructor(e) {
    this.config = {
      // API Configuration
      apiKey: e.apiKey,
      apiUrl: e.apiUrl || "http://localhost:3000",
      wsUrl: e.wsUrl || "http://localhost:3000",
      userName: e.userName || "Guest",
      // Colors
      primaryColor: e.primaryColor || "#4F46E5",
      secondaryColor: e.secondaryColor || "#FFFFFF",
      textColor: e.textColor || "#1F2937",
      botMessageBg: e.botMessageBg || "#F3F4F6",
      userMessageBg: e.userMessageBg || "#4F46E5",
      userMessageText: e.userMessageText || "#FFFFFF",
      // Positioning
      position: e.position || "bottom-right",
      offsetX: e.offsetX || "20px",
      offsetY: e.offsetY || "20px",
      // Sizing
      widgetWidth: e.widgetWidth || "380px",
      widgetHeight: e.widgetHeight || "600px",
      buttonSize: e.buttonSize || "60px",
      // Typography
      fontFamily: e.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: e.fontSize || "14px",
      // Border Radius
      borderRadius: e.borderRadius || "12px",
      buttonRadius: e.buttonRadius || "50%",
      messageBubbleRadius: e.messageBubbleRadius || "12px",
      // Text & Messages
      welcomeMessage: e.welcomeMessage || "Здравствуйте! Чем могу помочь?",
      buttonText: e.buttonText || "Поддержка",
      placeholderText: e.placeholderText || "Напишите сообщение...",
      headerTitle: e.headerTitle || "Поддержка",
      headerSubtitle: e.headerSubtitle || "Онлайн",
      // Icons & Avatar
      botAvatar: e.botAvatar || null,
      userAvatar: e.userAvatar || null,
      // Animations
      enableAnimations: e.enableAnimations !== !1,
      // Features
      showTimestamp: e.showTimestamp !== !1,
      showAvatar: e.showAvatar !== !1,
      enableSound: e.enableSound || !1,
      // Z-index
      zIndex: e.zIndex || 999999,
      // Headless mode - hide built-in toggle button
      headless: e.headless || !1
    }, this.chatId = this.generateChatId(), this.isOpen = !1, this.isInitialized = !1, this.messages = [], this.socket = null, this.boundTriggers = [], this.init();
  }
  generateChatId() {
    const e = localStorage.getItem("aisup_chat_id");
    if (e) return e;
    const t = `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return localStorage.setItem("aisup_chat_id", t), t;
  }
  init() {
    this.injectStyles(), this.createWidget(), this.connectWebSocket();
  }
  injectStyles() {
    const e = document.documentElement;
    e.style.setProperty("--aisup-primary", this.config.primaryColor), e.style.setProperty("--aisup-secondary", this.config.secondaryColor), e.style.setProperty("--aisup-text", this.config.textColor), e.style.setProperty("--aisup-bot-message-bg", this.config.botMessageBg), e.style.setProperty("--aisup-user-message-bg", this.config.userMessageBg), e.style.setProperty("--aisup-user-message-text", this.config.userMessageText), e.style.setProperty("--aisup-widget-width", this.config.widgetWidth), e.style.setProperty("--aisup-widget-height", this.config.widgetHeight), e.style.setProperty("--aisup-button-size", this.config.buttonSize), e.style.setProperty("--aisup-font-family", this.config.fontFamily), e.style.setProperty("--aisup-font-size", this.config.fontSize), e.style.setProperty("--aisup-radius", this.config.borderRadius), e.style.setProperty("--aisup-button-radius", this.config.buttonRadius), e.style.setProperty("--aisup-bubble-radius", this.config.messageBubbleRadius), e.style.setProperty("--aisup-offset-x", this.config.offsetX), e.style.setProperty("--aisup-offset-y", this.config.offsetY), e.style.setProperty("--aisup-z-index", this.config.zIndex), this.config.enableAnimations || e.style.setProperty("--aisup-transition", "none");
  }
  createWidget() {
    this.container = document.createElement("div"), this.container.className = `aisup-widget aisup-${this.config.position}`;
    const e = this.config.headless ? "display: none;" : "";
    this.container.innerHTML = `
      <button class="aisup-toggle-btn" id="aisup-toggle" style="${e}">
        <svg class="aisup-icon-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <svg class="aisup-icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        <span class="aisup-notification-badge" id="aisup-badge" style="display: none;">0</span>
      </button>

      <div class="aisup-chat-window" id="aisup-window">
        <div class="aisup-chat-header">
          <div class="aisup-header-info">
            <div class="aisup-status-indicator"></div>
            <div>
              <div class="aisup-header-title">${this.config.headerTitle}</div>
              <div class="aisup-header-subtitle">${this.config.headerSubtitle}</div>
            </div>
          </div>
          <button class="aisup-close-btn" id="aisup-close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="aisup-messages" id="aisup-messages">
          <div class="aisup-loading" id="aisup-loading">
            <div class="aisup-spinner"></div>
            <div>Инициализация чата...</div>
          </div>
        </div>

        <div class="aisup-input-area">
          <div class="aisup-typing-indicator" id="aisup-typing" style="display: none;">
            <span></span><span></span><span></span>
          </div>
          <div class="aisup-input-wrapper">
            <input 
              type="file" 
              id="aisup-file-input" 
              accept="image/*,video/*,.pdf,.doc,.docx,.txt" 
              style="display: none;"
            />
            <button class="aisup-attach-btn" id="aisup-attach" title="Прикрепить файл" disabled>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
              </svg>
            </button>
            <input 
              type="text" 
              id="aisup-input" 
              placeholder="${this.config.placeholderText}" 
              disabled
            />
            <button class="aisup-send-btn" id="aisup-send" disabled>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `, document.body.appendChild(this.container), this.attachEventListeners();
  }
  attachEventListeners() {
    const e = document.getElementById("aisup-toggle"), t = document.getElementById("aisup-close"), s = document.getElementById("aisup-send"), n = document.getElementById("aisup-input"), r = document.getElementById("aisup-attach"), o = document.getElementById("aisup-file-input");
    e.addEventListener("click", () => this.toggle()), t.addEventListener("click", () => this.close()), s.addEventListener("click", () => this.sendMessage()), n.addEventListener("keypress", (a) => {
      a.key === "Enter" && !a.shiftKey && (a.preventDefault(), this.sendMessage());
    }), r.addEventListener("click", () => o.click()), o.addEventListener("change", (a) => this.handleFileSelect(a));
  }
  async connectWebSocket() {
    try {
      this.socket = C(this.config.wsUrl, {
        auth: { apiKey: this.config.apiKey }
      }), this.socket.on("connect", () => {
        console.log("[AISup] WebSocket connected"), this.initializeChat();
      }), this.socket.on("connect_error", (e) => {
        console.error("[AISup] Connection error:", e), this.showError("Ошибка подключения. Пожалуйста, обновите страницу.");
      }), this.socket.on("message_added", ({ chatId: e, message: t }) => {
        console.log("[AISup] message_added event:", {
          receivedChatId: e,
          expectedChatId: this.mongoChatId,
          messageRole: t.role,
          messageType: t.type,
          match: e === this.mongoChatId
        }), e === this.mongoChatId && t.role !== "user" && (console.log("[AISup] Adding bot message to UI"), t.type === "photo" || t.type === "file" || t.type === "video" ? this.addFileMessage({
          url: t.content,
          type: t.type,
          caption: t.caption
        }, "bot") : this.addMessage(t.content, "bot"), this.hideTyping(), this.isOpen || this.showNotification());
      }), this.socket.on("chat_updated", ({ chat: e }) => {
        e.mode === "operator" && this.showSystemMessage("Оператор подключился к чату");
      });
    } catch (e) {
      console.error("[AISup] Socket init error:", e);
    }
  }
  async initializeChat() {
    try {
      const t = await (await fetch(`${this.config.apiUrl}/api/integration/init`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this.config.apiKey
        },
        body: JSON.stringify({
          chatId: this.chatId,
          chatNickname: this.config.userName
        })
      })).json();
      t.response === "success" && (this.isInitialized = !0, this.mongoChatId = t.data.chatId, console.log("[AISup] MongoDB chat ID:", this.mongoChatId), console.log("[AISup] Widget chat ID:", this.chatId), this.socket.emit("integration_join", { chatId: this.chatId }, (s) => {
        console.log("[AISup] integration_join response:", s), s.status === "ok" ? (s.chatId && (this.mongoChatId = s.chatId, console.log("[AISup] Updated MongoDB chat ID from join:", this.mongoChatId)), console.log("[AISup] Successfully joined chat room for:", this.chatId)) : console.error("[AISup] Failed to join chat room:", s.message);
      }), await this.loadMessages(), this.messages.length === 0 && t.data.startMessage && this.addMessage(t.data.startMessage, "bot"), document.getElementById("aisup-input").disabled = !1, document.getElementById("aisup-send").disabled = !1, document.getElementById("aisup-attach").disabled = !1, this.hideLoading());
    } catch (e) {
      console.error("[AISup] Init error:", e), this.showError("Не удалось инициализировать чат");
    }
  }
  async loadMessages() {
    try {
      const t = await (await fetch(`${this.config.apiUrl}/api/integration/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this.config.apiKey
        },
        body: JSON.stringify({ chatId: this.chatId })
      })).json();
      t.response === "success" && t.data.length > 0 && (this.messages = t.data, t.data.forEach((s) => {
        s.type === "photo" || s.type === "file" || s.type === "video" ? this.addFileMessage({ url: s.content, type: s.type, caption: s.caption }, s.role, !1) : this.addMessage(s.content, s.role, !1);
      }));
    } catch (e) {
      console.error("[AISup] Load messages error:", e);
    }
  }
  async sendMessage() {
    const e = document.getElementById("aisup-input"), t = e.value.trim();
    if (!(!t || !this.isInitialized)) {
      this.addMessage(t, "user"), e.value = "", this.showTyping();
      try {
        if (!(await fetch(`${this.config.apiUrl}/api/integration/send-message`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": this.config.apiKey
          },
          body: JSON.stringify({
            chatId: this.chatId,
            messageText: t
          })
        })).ok)
          throw new Error("Failed to send message");
      } catch (s) {
        console.error("[AISup] Send error:", s), this.hideTyping(), this.showError("Не удалось отправить сообщение");
      }
    }
  }
  handleFileSelect(e) {
    const t = e.target.files[0];
    if (!t) return;
    const s = 10 * 1024 * 1024;
    if (t.size > s) {
      this.showError("Файл слишком большой. Максимум 10 МБ"), e.target.value = "";
      return;
    }
    this.sendFile(t), e.target.value = "";
  }
  async sendFile(e) {
    if (this.isInitialized) {
      this.addFileMessage(e, "user", !0), this.showTyping();
      try {
        const t = new FormData();
        t.append("file", e), t.append("chatId", this.chatId);
        const s = await fetch(`${this.config.apiUrl}/api/integration/send-file`, {
          method: "POST",
          headers: {
            "X-API-Key": this.config.apiKey
          },
          body: t
        });
        if (!s.ok)
          throw new Error("Failed to upload file");
        const n = await s.json();
        console.log("[AISup] File uploaded:", n);
      } catch (t) {
        console.error("[AISup] File upload error:", t), this.hideTyping(), this.showError("Не удалось загрузить файл");
      }
    }
  }
  addMessage(e, t, s = !0) {
    const n = document.getElementById("aisup-messages"), r = document.createElement("div");
    r.className = `aisup-message aisup-message-${t}`;
    const o = (/* @__PURE__ */ new Date()).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    r.innerHTML = `
      <div class="aisup-message-content">
        <div class="aisup-message-text">${this.escapeHtml(e)}</div>
        <div class="aisup-message-time">${o}</div>
      </div>
    `, n.appendChild(r), s && this.scrollToBottom();
  }
  addFileMessage(e, t, s = !1) {
    const n = document.getElementById("aisup-messages"), r = document.createElement("div");
    r.className = `aisup-message aisup-message-${t}`;
    const o = (/* @__PURE__ */ new Date()).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    let a = "";
    if (s) {
      const h = e.name || "file", p = this.formatFileSize(e.size || 0);
      a = `
        <div class="aisup-file-message">
          <div class="aisup-file-icon">📎</div>
          <div class="aisup-file-info">
            <div class="aisup-file-name">${this.escapeHtml(h)}</div>
            <div class="aisup-file-size">${p} • Загрузка...</div>
          </div>
        </div>
      `;
    } else if (e.type === "photo" && e.url)
      a = `
        <div class="aisup-image-message">
          <img src="${e.url}" alt="Image" onclick="window.open('${e.url}', '_blank')" />
          ${e.caption ? `<div class="aisup-image-caption">${this.escapeHtml(e.caption)}</div>` : ""}
        </div>
      `;
    else if (e.type === "video" && e.url)
      a = `
        <div class="aisup-video-message">
          <video controls src="${e.url}"></video>
          ${e.caption ? `<div class="aisup-image-caption">${this.escapeHtml(e.caption)}</div>` : ""}
        </div>
      `;
    else if (e.url) {
      const h = e.url.split("/").pop() || "file";
      a = `
        <div class="aisup-file-message">
          <a href="${e.url}" target="_blank" class="aisup-file-link">
            <div class="aisup-file-icon">📄</div>
            <div class="aisup-file-info">
              <div class="aisup-file-name">${this.escapeHtml(h)}</div>
              <div class="aisup-file-action">Открыть файл</div>
            </div>
          </a>
        </div>
      `;
    }
    r.innerHTML = `
      <div class="aisup-message-content">
        ${a}
        <div class="aisup-message-time">${o}</div>
      </div>
    `, n.appendChild(r), this.scrollToBottom();
  }
  formatFileSize(e) {
    if (e === 0) return "0 Bytes";
    const t = 1024, s = ["Bytes", "KB", "MB", "GB"], n = Math.floor(Math.log(e) / Math.log(t));
    return Math.round(e / Math.pow(t, n) * 100) / 100 + " " + s[n];
  }
  showSystemMessage(e) {
    const t = document.getElementById("aisup-messages"), s = document.createElement("div");
    s.className = "aisup-message-system", s.textContent = e, t.appendChild(s), this.scrollToBottom();
  }
  showError(e) {
    this.hideLoading(), this.showSystemMessage(`❌ ${e}`);
  }
  showTyping() {
    document.getElementById("aisup-typing").style.display = "flex";
  }
  hideTyping() {
    document.getElementById("aisup-typing").style.display = "none";
  }
  showNotification() {
    const e = document.getElementById("aisup-badge"), t = parseInt(e.textContent) || 0;
    e.textContent = t + 1, e.style.display = "flex";
  }
  hideNotification() {
    const e = document.getElementById("aisup-badge");
    e.textContent = "0", e.style.display = "none";
  }
  hideLoading() {
    const e = document.getElementById("aisup-loading");
    e && (e.style.display = "none");
  }
  scrollToBottom() {
    const e = document.getElementById("aisup-messages");
    e.scrollTop = e.scrollHeight;
  }
  toggle() {
    this.isOpen ? this.close() : this.open();
  }
  open() {
    var e;
    this.isOpen = !0, this.container.classList.add("aisup-open"), this.hideNotification(), setTimeout(() => this.scrollToBottom(), 100), (e = document.getElementById("aisup-input")) == null || e.focus();
  }
  close() {
    this.isOpen = !1, this.container.classList.remove("aisup-open");
  }
  escapeHtml(e) {
    const t = document.createElement("div");
    return t.textContent = e, t.innerHTML;
  }
  /**
   * Attach widget toggle to custom element(s)
   * @param {string|Element|Element[]} selector - CSS selector, element, or array of elements
   * @returns {AISupportWidget} - Returns this for chaining
   */
  attachTo(e) {
    let t = [];
    return typeof e == "string" ? t = Array.from(document.querySelectorAll(e)) : e instanceof Element ? t = [e] : Array.isArray(e) && (t = e), t.forEach((s) => {
      const n = (r) => {
        r.preventDefault(), r.stopPropagation(), this.toggle();
      };
      s.addEventListener("click", n), this.boundTriggers.push({ element: s, handler: n });
    }), this;
  }
  /**
   * Remove all attached triggers
   */
  detach() {
    return this.boundTriggers.forEach(({ element: e, handler: t }) => {
      e.removeEventListener("click", t);
    }), this.boundTriggers = [], this;
  }
  destroy() {
    this.detach(), this.socket && this.socket.disconnect(), this.container && this.container.remove();
  }
}
window.AISupportWidget = st;
export {
  st as default
};
