//#region \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), s = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, c = (n, r, a) => (a = n == null ? {} : e(i(n)), s(r || !n || !n.__esModule ? t(a, "default", {
	value: n,
	enumerable: !0
}) : a, n)), l = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), o = Symbol.for("react.consumer"), s = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), l = Symbol.for("react.suspense"), u = Symbol.for("react.memo"), d = Symbol.for("react.lazy"), f = Symbol.for("react.activity"), p = Symbol.iterator;
	function m(e) {
		return typeof e != "object" || !e ? null : (e = p && e[p] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var h = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	}, g = Object.assign, _ = {};
	function v(e, t, n) {
		this.props = e, this.context = t, this.refs = _, this.updater = n || h;
	}
	v.prototype.isReactComponent = {}, v.prototype.setState = function(e, t) {
		if (typeof e != "object" && typeof e != "function" && e != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, e, t, "setState");
	}, v.prototype.forceUpdate = function(e) {
		this.updater.enqueueForceUpdate(this, e, "forceUpdate");
	};
	function y() {}
	y.prototype = v.prototype;
	function b(e, t, n) {
		this.props = e, this.context = t, this.refs = _, this.updater = n || h;
	}
	var x = b.prototype = new y();
	x.constructor = b, g(x, v.prototype), x.isPureReactComponent = !0;
	var S = Array.isArray;
	function C() {}
	var w = {
		H: null,
		A: null,
		T: null,
		S: null
	}, T = Object.prototype.hasOwnProperty;
	function E(e, n, r) {
		var i = r.ref;
		return {
			$$typeof: t,
			type: e,
			key: n,
			ref: i === void 0 ? null : i,
			props: r
		};
	}
	function D(e, t) {
		return E(e.type, t, e.props);
	}
	function O(e) {
		return typeof e == "object" && !!e && e.$$typeof === t;
	}
	function k(e) {
		var t = {
			"=": "=0",
			":": "=2"
		};
		return "$" + e.replace(/[=:]/g, function(e) {
			return t[e];
		});
	}
	var A = /\/+/g;
	function j(e, t) {
		return typeof e == "object" && e && e.key != null ? k("" + e.key) : t.toString(36);
	}
	function M(e) {
		switch (e.status) {
			case "fulfilled": return e.value;
			case "rejected": throw e.reason;
			default: switch (typeof e.status == "string" ? e.then(C, C) : (e.status = "pending", e.then(function(t) {
				e.status === "pending" && (e.status = "fulfilled", e.value = t);
			}, function(t) {
				e.status === "pending" && (e.status = "rejected", e.reason = t);
			})), e.status) {
				case "fulfilled": return e.value;
				case "rejected": throw e.reason;
			}
		}
		throw e;
	}
	function N(e, r, i, a, o) {
		var s = typeof e;
		(s === "undefined" || s === "boolean") && (e = null);
		var c = !1;
		if (e === null) c = !0;
		else switch (s) {
			case "bigint":
			case "string":
			case "number":
				c = !0;
				break;
			case "object": switch (e.$$typeof) {
				case t:
				case n:
					c = !0;
					break;
				case d: return c = e._init, N(c(e._payload), r, i, a, o);
			}
		}
		if (c) return o = o(e), c = a === "" ? "." + j(e, 0) : a, S(o) ? (i = "", c != null && (i = c.replace(A, "$&/") + "/"), N(o, r, i, "", function(e) {
			return e;
		})) : o != null && (O(o) && (o = D(o, i + (o.key == null || e && e.key === o.key ? "" : ("" + o.key).replace(A, "$&/") + "/") + c)), r.push(o)), 1;
		c = 0;
		var l = a === "" ? "." : a + ":";
		if (S(e)) for (var u = 0; u < e.length; u++) a = e[u], s = l + j(a, u), c += N(a, r, i, s, o);
		else if (u = m(e), typeof u == "function") for (e = u.call(e), u = 0; !(a = e.next()).done;) a = a.value, s = l + j(a, u++), c += N(a, r, i, s, o);
		else if (s === "object") {
			if (typeof e.then == "function") return N(M(e), r, i, a, o);
			throw r = String(e), Error("Objects are not valid as a React child (found: " + (r === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : r) + "). If you meant to render a collection of children, use an array instead.");
		}
		return c;
	}
	function P(e, t, n) {
		if (e == null) return e;
		var r = [], i = 0;
		return N(e, r, "", "", function(e) {
			return t.call(n, e, i++);
		}), r;
	}
	function F(e) {
		if (e._status === -1) {
			var t = e._result;
			t = t(), t.then(function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 1, e._result = t);
			}, function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 2, e._result = t);
			}), e._status === -1 && (e._status = 0, e._result = t);
		}
		if (e._status === 1) return e._result.default;
		throw e._result;
	}
	var I = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	}, L = {
		map: P,
		forEach: function(e, t, n) {
			P(e, function() {
				t.apply(this, arguments);
			}, n);
		},
		count: function(e) {
			var t = 0;
			return P(e, function() {
				t++;
			}), t;
		},
		toArray: function(e) {
			return P(e, function(e) {
				return e;
			}) || [];
		},
		only: function(e) {
			if (!O(e)) throw Error("React.Children.only expected to receive a single React element child.");
			return e;
		}
	};
	e.Activity = f, e.Children = L, e.Component = v, e.Fragment = r, e.Profiler = a, e.PureComponent = b, e.StrictMode = i, e.Suspense = l, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = w, e.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(e) {
			return w.H.useMemoCache(e);
		}
	}, e.cache = function(e) {
		return function() {
			return e.apply(null, arguments);
		};
	}, e.cacheSignal = function() {
		return null;
	}, e.cloneElement = function(e, t, n) {
		if (e == null) throw Error("The argument must be a React element, but you passed " + e + ".");
		var r = g({}, e.props), i = e.key;
		if (t != null) for (a in t.key !== void 0 && (i = "" + t.key), t) !T.call(t, a) || a === "key" || a === "__self" || a === "__source" || a === "ref" && t.ref === void 0 || (r[a] = t[a]);
		var a = arguments.length - 2;
		if (a === 1) r.children = n;
		else if (1 < a) {
			for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
			r.children = o;
		}
		return E(e.type, i, r);
	}, e.createContext = function(e) {
		return e = {
			$$typeof: s,
			_currentValue: e,
			_currentValue2: e,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		}, e.Provider = e, e.Consumer = {
			$$typeof: o,
			_context: e
		}, e;
	}, e.createElement = function(e, t, n) {
		var r, i = {}, a = null;
		if (t != null) for (r in t.key !== void 0 && (a = "" + t.key), t) T.call(t, r) && r !== "key" && r !== "__self" && r !== "__source" && (i[r] = t[r]);
		var o = arguments.length - 2;
		if (o === 1) i.children = n;
		else if (1 < o) {
			for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
			i.children = s;
		}
		if (e && e.defaultProps) for (r in o = e.defaultProps, o) i[r] === void 0 && (i[r] = o[r]);
		return E(e, a, i);
	}, e.createRef = function() {
		return { current: null };
	}, e.forwardRef = function(e) {
		return {
			$$typeof: c,
			render: e
		};
	}, e.isValidElement = O, e.lazy = function(e) {
		return {
			$$typeof: d,
			_payload: {
				_status: -1,
				_result: e
			},
			_init: F
		};
	}, e.memo = function(e, t) {
		return {
			$$typeof: u,
			type: e,
			compare: t === void 0 ? null : t
		};
	}, e.startTransition = function(e) {
		var t = w.T, n = {};
		w.T = n;
		try {
			var r = e(), i = w.S;
			i !== null && i(n, r), typeof r == "object" && r && typeof r.then == "function" && r.then(C, I);
		} catch (e) {
			I(e);
		} finally {
			t !== null && n.types !== null && (t.types = n.types), w.T = t;
		}
	}, e.unstable_useCacheRefresh = function() {
		return w.H.useCacheRefresh();
	}, e.use = function(e) {
		return w.H.use(e);
	}, e.useActionState = function(e, t, n) {
		return w.H.useActionState(e, t, n);
	}, e.useCallback = function(e, t) {
		return w.H.useCallback(e, t);
	}, e.useContext = function(e) {
		return w.H.useContext(e);
	}, e.useDebugValue = function() {}, e.useDeferredValue = function(e, t) {
		return w.H.useDeferredValue(e, t);
	}, e.useEffect = function(e, t) {
		return w.H.useEffect(e, t);
	}, e.useEffectEvent = function(e) {
		return w.H.useEffectEvent(e);
	}, e.useId = function() {
		return w.H.useId();
	}, e.useImperativeHandle = function(e, t, n) {
		return w.H.useImperativeHandle(e, t, n);
	}, e.useInsertionEffect = function(e, t) {
		return w.H.useInsertionEffect(e, t);
	}, e.useLayoutEffect = function(e, t) {
		return w.H.useLayoutEffect(e, t);
	}, e.useMemo = function(e, t) {
		return w.H.useMemo(e, t);
	}, e.useOptimistic = function(e, t) {
		return w.H.useOptimistic(e, t);
	}, e.useReducer = function(e, t, n) {
		return w.H.useReducer(e, t, n);
	}, e.useRef = function(e) {
		return w.H.useRef(e);
	}, e.useState = function(e) {
		return w.H.useState(e);
	}, e.useSyncExternalStore = function(e, t, n) {
		return w.H.useSyncExternalStore(e, t, n);
	}, e.useTransition = function() {
		return w.H.useTransition();
	}, e.version = "19.2.6";
})), u = /* @__PURE__ */ o(((e, t) => {
	t.exports = l();
})), d = /* @__PURE__ */ o(((e) => {
	function t(e, t) {
		var n = e.length;
		e.push(t);
		a: for (; 0 < n;) {
			var r = n - 1 >>> 1, a = e[r];
			if (0 < i(a, t)) e[r] = t, e[n] = a, n = r;
			else break a;
		}
	}
	function n(e) {
		return e.length === 0 ? null : e[0];
	}
	function r(e) {
		if (e.length === 0) return null;
		var t = e[0], n = e.pop();
		if (n !== t) {
			e[0] = n;
			a: for (var r = 0, a = e.length, o = a >>> 1; r < o;) {
				var s = 2 * (r + 1) - 1, c = e[s], l = s + 1, u = e[l];
				if (0 > i(c, n)) l < a && 0 > i(u, c) ? (e[r] = u, e[l] = n, r = l) : (e[r] = c, e[s] = n, r = s);
				else if (l < a && 0 > i(u, n)) e[r] = u, e[l] = n, r = l;
				else break a;
			}
		}
		return t;
	}
	function i(e, t) {
		var n = e.sortIndex - t.sortIndex;
		return n === 0 ? e.id - t.id : n;
	}
	if (e.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
		var a = performance;
		e.unstable_now = function() {
			return a.now();
		};
	} else {
		var o = Date, s = o.now();
		e.unstable_now = function() {
			return o.now() - s;
		};
	}
	var c = [], l = [], u = 1, d = null, f = 3, p = !1, m = !1, h = !1, g = !1, _ = typeof setTimeout == "function" ? setTimeout : null, v = typeof clearTimeout == "function" ? clearTimeout : null, y = typeof setImmediate < "u" ? setImmediate : null;
	function b(e) {
		for (var i = n(l); i !== null;) {
			if (i.callback === null) r(l);
			else if (i.startTime <= e) r(l), i.sortIndex = i.expirationTime, t(c, i);
			else break;
			i = n(l);
		}
	}
	function x(e) {
		if (h = !1, b(e), !m) if (n(c) !== null) m = !0, S || (S = !0, O());
		else {
			var t = n(l);
			t !== null && j(x, t.startTime - e);
		}
	}
	var S = !1, C = -1, w = 5, T = -1;
	function E() {
		return g ? !0 : !(e.unstable_now() - T < w);
	}
	function D() {
		if (g = !1, S) {
			var t = e.unstable_now();
			T = t;
			var i = !0;
			try {
				a: {
					m = !1, h && (h = !1, v(C), C = -1), p = !0;
					var a = f;
					try {
						b: {
							for (b(t), d = n(c); d !== null && !(d.expirationTime > t && E());) {
								var o = d.callback;
								if (typeof o == "function") {
									d.callback = null, f = d.priorityLevel;
									var s = o(d.expirationTime <= t);
									if (t = e.unstable_now(), typeof s == "function") {
										d.callback = s, b(t), i = !0;
										break b;
									}
									d === n(c) && r(c), b(t);
								} else r(c);
								d = n(c);
							}
							if (d !== null) i = !0;
							else {
								var u = n(l);
								u !== null && j(x, u.startTime - t), i = !1;
							}
						}
						break a;
					} finally {
						d = null, f = a, p = !1;
					}
					i = void 0;
				}
			} finally {
				i ? O() : S = !1;
			}
		}
	}
	var O;
	if (typeof y == "function") O = function() {
		y(D);
	};
	else if (typeof MessageChannel < "u") {
		var k = new MessageChannel(), A = k.port2;
		k.port1.onmessage = D, O = function() {
			A.postMessage(null);
		};
	} else O = function() {
		_(D, 0);
	};
	function j(t, n) {
		C = _(function() {
			t(e.unstable_now());
		}, n);
	}
	e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(e) {
		e.callback = null;
	}, e.unstable_forceFrameRate = function(e) {
		0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : w = 0 < e ? Math.floor(1e3 / e) : 5;
	}, e.unstable_getCurrentPriorityLevel = function() {
		return f;
	}, e.unstable_next = function(e) {
		switch (f) {
			case 1:
			case 2:
			case 3:
				var t = 3;
				break;
			default: t = f;
		}
		var n = f;
		f = t;
		try {
			return e();
		} finally {
			f = n;
		}
	}, e.unstable_requestPaint = function() {
		g = !0;
	}, e.unstable_runWithPriority = function(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5: break;
			default: e = 3;
		}
		var n = f;
		f = e;
		try {
			return t();
		} finally {
			f = n;
		}
	}, e.unstable_scheduleCallback = function(r, i, a) {
		var o = e.unstable_now();
		switch (typeof a == "object" && a ? (a = a.delay, a = typeof a == "number" && 0 < a ? o + a : o) : a = o, r) {
			case 1:
				var s = -1;
				break;
			case 2:
				s = 250;
				break;
			case 5:
				s = 1073741823;
				break;
			case 4:
				s = 1e4;
				break;
			default: s = 5e3;
		}
		return s = a + s, r = {
			id: u++,
			callback: i,
			priorityLevel: r,
			startTime: a,
			expirationTime: s,
			sortIndex: -1
		}, a > o ? (r.sortIndex = a, t(l, r), n(c) === null && r === n(l) && (h ? (v(C), C = -1) : h = !0, j(x, a - o))) : (r.sortIndex = s, t(c, r), m || p || (m = !0, S || (S = !0, O()))), r;
	}, e.unstable_shouldYield = E, e.unstable_wrapCallback = function(e) {
		var t = f;
		return function() {
			var n = f;
			f = t;
			try {
				return e.apply(this, arguments);
			} finally {
				f = n;
			}
		};
	};
})), f = /* @__PURE__ */ o(((e, t) => {
	t.exports = d();
})), p = /* @__PURE__ */ o(((e) => {
	var t = u();
	function n(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function r() {}
	var i = {
		d: {
			f: r,
			r: function() {
				throw Error(n(522));
			},
			D: r,
			C: r,
			L: r,
			m: r,
			X: r,
			S: r,
			M: r
		},
		p: 0,
		findDOMNode: null
	}, a = Symbol.for("react.portal");
	function o(e, t, n) {
		var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
		return {
			$$typeof: a,
			key: r == null ? null : "" + r,
			children: e,
			containerInfo: t,
			implementation: n
		};
	}
	var s = t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function c(e, t) {
		if (e === "font") return "";
		if (typeof t == "string") return t === "use-credentials" ? t : "";
	}
	e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = i, e.createPortal = function(e, t) {
		var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
		if (!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11) throw Error(n(299));
		return o(e, t, null, r);
	}, e.flushSync = function(e) {
		var t = s.T, n = i.p;
		try {
			if (s.T = null, i.p = 2, e) return e();
		} finally {
			s.T = t, i.p = n, i.d.f();
		}
	}, e.preconnect = function(e, t) {
		typeof e == "string" && (t ? (t = t.crossOrigin, t = typeof t == "string" ? t === "use-credentials" ? t : "" : void 0) : t = null, i.d.C(e, t));
	}, e.prefetchDNS = function(e) {
		typeof e == "string" && i.d.D(e);
	}, e.preinit = function(e, t) {
		if (typeof e == "string" && t && typeof t.as == "string") {
			var n = t.as, r = c(n, t.crossOrigin), a = typeof t.integrity == "string" ? t.integrity : void 0, o = typeof t.fetchPriority == "string" ? t.fetchPriority : void 0;
			n === "style" ? i.d.S(e, typeof t.precedence == "string" ? t.precedence : void 0, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o
			}) : n === "script" && i.d.X(e, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0
			});
		}
	}, e.preinitModule = function(e, t) {
		if (typeof e == "string") if (typeof t == "object" && t) {
			if (t.as == null || t.as === "script") {
				var n = c(t.as, t.crossOrigin);
				i.d.M(e, {
					crossOrigin: n,
					integrity: typeof t.integrity == "string" ? t.integrity : void 0,
					nonce: typeof t.nonce == "string" ? t.nonce : void 0
				});
			}
		} else t ?? i.d.M(e);
	}, e.preload = function(e, t) {
		if (typeof e == "string" && typeof t == "object" && t && typeof t.as == "string") {
			var n = t.as, r = c(n, t.crossOrigin);
			i.d.L(e, n, {
				crossOrigin: r,
				integrity: typeof t.integrity == "string" ? t.integrity : void 0,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0,
				type: typeof t.type == "string" ? t.type : void 0,
				fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0,
				referrerPolicy: typeof t.referrerPolicy == "string" ? t.referrerPolicy : void 0,
				imageSrcSet: typeof t.imageSrcSet == "string" ? t.imageSrcSet : void 0,
				imageSizes: typeof t.imageSizes == "string" ? t.imageSizes : void 0,
				media: typeof t.media == "string" ? t.media : void 0
			});
		}
	}, e.preloadModule = function(e, t) {
		if (typeof e == "string") if (t) {
			var n = c(t.as, t.crossOrigin);
			i.d.m(e, {
				as: typeof t.as == "string" && t.as !== "script" ? t.as : void 0,
				crossOrigin: n,
				integrity: typeof t.integrity == "string" ? t.integrity : void 0
			});
		} else i.d.m(e);
	}, e.requestFormReset = function(e) {
		i.d.r(e);
	}, e.unstable_batchedUpdates = function(e, t) {
		return e(t);
	}, e.useFormState = function(e, t, n) {
		return s.H.useFormState(e, t, n);
	}, e.useFormStatus = function() {
		return s.H.useHostTransitionStatus();
	}, e.version = "19.2.6";
})), m = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = p();
})), h = /* @__PURE__ */ o(((e) => {
	var t = f(), n = u(), r = m();
	function i(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function a(e) {
		return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
	}
	function o(e) {
		var t = e, n = e;
		if (e.alternate) for (; t.return;) t = t.return;
		else {
			e = t;
			do
				t = e, t.flags & 4098 && (n = t.return), e = t.return;
			while (e);
		}
		return t.tag === 3 ? n : null;
	}
	function s(e) {
		if (e.tag === 13) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function c(e) {
		if (e.tag === 31) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function l(e) {
		if (o(e) !== e) throw Error(i(188));
	}
	function d(e) {
		var t = e.alternate;
		if (!t) {
			if (t = o(e), t === null) throw Error(i(188));
			return t === e ? e : null;
		}
		for (var n = e, r = t;;) {
			var a = n.return;
			if (a === null) break;
			var s = a.alternate;
			if (s === null) {
				if (r = a.return, r !== null) {
					n = r;
					continue;
				}
				break;
			}
			if (a.child === s.child) {
				for (s = a.child; s;) {
					if (s === n) return l(a), e;
					if (s === r) return l(a), t;
					s = s.sibling;
				}
				throw Error(i(188));
			}
			if (n.return !== r.return) n = a, r = s;
			else {
				for (var c = !1, u = a.child; u;) {
					if (u === n) {
						c = !0, n = a, r = s;
						break;
					}
					if (u === r) {
						c = !0, r = a, n = s;
						break;
					}
					u = u.sibling;
				}
				if (!c) {
					for (u = s.child; u;) {
						if (u === n) {
							c = !0, n = s, r = a;
							break;
						}
						if (u === r) {
							c = !0, r = s, n = a;
							break;
						}
						u = u.sibling;
					}
					if (!c) throw Error(i(189));
				}
			}
			if (n.alternate !== r) throw Error(i(190));
		}
		if (n.tag !== 3) throw Error(i(188));
		return n.stateNode.current === n ? e : t;
	}
	function p(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e;
		for (e = e.child; e !== null;) {
			if (t = p(e), t !== null) return t;
			e = e.sibling;
		}
		return null;
	}
	var h = Object.assign, g = Symbol.for("react.element"), _ = Symbol.for("react.transitional.element"), v = Symbol.for("react.portal"), y = Symbol.for("react.fragment"), b = Symbol.for("react.strict_mode"), x = Symbol.for("react.profiler"), S = Symbol.for("react.consumer"), C = Symbol.for("react.context"), w = Symbol.for("react.forward_ref"), T = Symbol.for("react.suspense"), E = Symbol.for("react.suspense_list"), D = Symbol.for("react.memo"), O = Symbol.for("react.lazy"), k = Symbol.for("react.activity"), A = Symbol.for("react.memo_cache_sentinel"), j = Symbol.iterator;
	function M(e) {
		return typeof e != "object" || !e ? null : (e = j && e[j] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var N = Symbol.for("react.client.reference");
	function P(e) {
		if (e == null) return null;
		if (typeof e == "function") return e.$$typeof === N ? null : e.displayName || e.name || null;
		if (typeof e == "string") return e;
		switch (e) {
			case y: return "Fragment";
			case x: return "Profiler";
			case b: return "StrictMode";
			case T: return "Suspense";
			case E: return "SuspenseList";
			case k: return "Activity";
		}
		if (typeof e == "object") switch (e.$$typeof) {
			case v: return "Portal";
			case C: return e.displayName || "Context";
			case S: return (e._context.displayName || "Context") + ".Consumer";
			case w:
				var t = e.render;
				return e = e.displayName, e ||= (e = t.displayName || t.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
			case D: return t = e.displayName || null, t === null ? P(e.type) || "Memo" : t;
			case O:
				t = e._payload, e = e._init;
				try {
					return P(e(t));
				} catch {}
		}
		return null;
	}
	var F = Array.isArray, I = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, L = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, R = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, ee = [], te = -1;
	function z(e) {
		return { current: e };
	}
	function B(e) {
		0 > te || (e.current = ee[te], ee[te] = null, te--);
	}
	function V(e, t) {
		te++, ee[te] = e.current, e.current = t;
	}
	var ne = z(null), H = z(null), U = z(null), re = z(null);
	function ie(e, t) {
		switch (V(U, t), V(H, e), V(ne, null), t.nodeType) {
			case 9:
			case 11:
				e = (e = t.documentElement) && (e = e.namespaceURI) ? Vd(e) : 0;
				break;
			default: if (e = t.tagName, t = t.namespaceURI) t = Vd(t), e = Hd(t, e);
			else switch (e) {
				case "svg":
					e = 1;
					break;
				case "math":
					e = 2;
					break;
				default: e = 0;
			}
		}
		B(ne), V(ne, e);
	}
	function ae() {
		B(ne), B(H), B(U);
	}
	function oe(e) {
		e.memoizedState !== null && V(re, e);
		var t = ne.current, n = Hd(t, e.type);
		t !== n && (V(H, e), V(ne, n));
	}
	function se(e) {
		H.current === e && (B(ne), B(H)), re.current === e && (B(re), Qf._currentValue = R);
	}
	var ce, le;
	function ue(e) {
		if (ce === void 0) try {
			throw Error();
		} catch (e) {
			var t = e.stack.trim().match(/\n( *(at )?)/);
			ce = t && t[1] || "", le = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + ce + e + le;
	}
	var de = !1;
	function fe(e, t) {
		if (!e || de) return "";
		de = !0;
		var n = Error.prepareStackTrace;
		Error.prepareStackTrace = void 0;
		try {
			var r = { DetermineComponentFrameRoot: function() {
				try {
					if (t) {
						var n = function() {
							throw Error();
						};
						if (Object.defineProperty(n.prototype, "props", { set: function() {
							throw Error();
						} }), typeof Reflect == "object" && Reflect.construct) {
							try {
								Reflect.construct(n, []);
							} catch (e) {
								var r = e;
							}
							Reflect.construct(e, [], n);
						} else {
							try {
								n.call();
							} catch (e) {
								r = e;
							}
							e.call(n.prototype);
						}
					} else {
						try {
							throw Error();
						} catch (e) {
							r = e;
						}
						(n = e()) && typeof n.catch == "function" && n.catch(function() {});
					}
				} catch (e) {
					if (e && r && typeof e.stack == "string") return [e.stack, r.stack];
				}
				return [null, null];
			} };
			r.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
			var i = Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot, "name");
			i && i.configurable && Object.defineProperty(r.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
			var a = r.DetermineComponentFrameRoot(), o = a[0], s = a[1];
			if (o && s) {
				var c = o.split("\n"), l = s.split("\n");
				for (i = r = 0; r < c.length && !c[r].includes("DetermineComponentFrameRoot");) r++;
				for (; i < l.length && !l[i].includes("DetermineComponentFrameRoot");) i++;
				if (r === c.length || i === l.length) for (r = c.length - 1, i = l.length - 1; 1 <= r && 0 <= i && c[r] !== l[i];) i--;
				for (; 1 <= r && 0 <= i; r--, i--) if (c[r] !== l[i]) {
					if (r !== 1 || i !== 1) do
						if (r--, i--, 0 > i || c[r] !== l[i]) {
							var u = "\n" + c[r].replace(" at new ", " at ");
							return e.displayName && u.includes("<anonymous>") && (u = u.replace("<anonymous>", e.displayName)), u;
						}
					while (1 <= r && 0 <= i);
					break;
				}
			}
		} finally {
			de = !1, Error.prepareStackTrace = n;
		}
		return (n = e ? e.displayName || e.name : "") ? ue(n) : "";
	}
	function pe(e, t) {
		switch (e.tag) {
			case 26:
			case 27:
			case 5: return ue(e.type);
			case 16: return ue("Lazy");
			case 13: return e.child !== t && t !== null ? ue("Suspense Fallback") : ue("Suspense");
			case 19: return ue("SuspenseList");
			case 0:
			case 15: return fe(e.type, !1);
			case 11: return fe(e.type.render, !1);
			case 1: return fe(e.type, !0);
			case 31: return ue("Activity");
			default: return "";
		}
	}
	function me(e) {
		try {
			var t = "", n = null;
			do
				t += pe(e, n), n = e, e = e.return;
			while (e);
			return t;
		} catch (e) {
			return "\nError generating stack: " + e.message + "\n" + e.stack;
		}
	}
	var he = Object.prototype.hasOwnProperty, ge = t.unstable_scheduleCallback, _e = t.unstable_cancelCallback, ve = t.unstable_shouldYield, ye = t.unstable_requestPaint, be = t.unstable_now, xe = t.unstable_getCurrentPriorityLevel, Se = t.unstable_ImmediatePriority, Ce = t.unstable_UserBlockingPriority, we = t.unstable_NormalPriority, Te = t.unstable_LowPriority, Ee = t.unstable_IdlePriority, De = t.log, Oe = t.unstable_setDisableYieldValue, ke = null, Ae = null;
	function je(e) {
		if (typeof De == "function" && Oe(e), Ae && typeof Ae.setStrictMode == "function") try {
			Ae.setStrictMode(ke, e);
		} catch {}
	}
	var Me = Math.clz32 ? Math.clz32 : Fe, Ne = Math.log, Pe = Math.LN2;
	function Fe(e) {
		return e >>>= 0, e === 0 ? 32 : 31 - (Ne(e) / Pe | 0) | 0;
	}
	var Ie = 256, Le = 262144, Re = 4194304;
	function ze(e) {
		var t = e & 42;
		if (t !== 0) return t;
		switch (e & -e) {
			case 1: return 1;
			case 2: return 2;
			case 4: return 4;
			case 8: return 8;
			case 16: return 16;
			case 32: return 32;
			case 64: return 64;
			case 128: return 128;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072: return e & 261888;
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return e & 3932160;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return e & 62914560;
			case 67108864: return 67108864;
			case 134217728: return 134217728;
			case 268435456: return 268435456;
			case 536870912: return 536870912;
			case 1073741824: return 0;
			default: return e;
		}
	}
	function Be(e, t, n) {
		var r = e.pendingLanes;
		if (r === 0) return 0;
		var i = 0, a = e.suspendedLanes, o = e.pingedLanes;
		e = e.warmLanes;
		var s = r & 134217727;
		return s === 0 ? (s = r & ~a, s === 0 ? o === 0 ? n || (n = r & ~e, n !== 0 && (i = ze(n))) : i = ze(o) : i = ze(s)) : (r = s & ~a, r === 0 ? (o &= s, o === 0 ? n || (n = s & ~e, n !== 0 && (i = ze(n))) : i = ze(o)) : i = ze(r)), i === 0 ? 0 : t !== 0 && t !== i && (t & a) === 0 && (a = i & -i, n = t & -t, a >= n || a === 32 && n & 4194048) ? t : i;
	}
	function Ve(e, t) {
		return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
	}
	function He(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 4:
			case 8:
			case 64: return t + 250;
			case 16:
			case 32:
			case 128:
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return t + 5e3;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return -1;
			case 67108864:
			case 134217728:
			case 268435456:
			case 536870912:
			case 1073741824: return -1;
			default: return -1;
		}
	}
	function Ue() {
		var e = Re;
		return Re <<= 1, !(Re & 62914560) && (Re = 4194304), e;
	}
	function We(e) {
		for (var t = [], n = 0; 31 > n; n++) t.push(e);
		return t;
	}
	function Ge(e, t) {
		e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
	}
	function Ke(e, t, n, r, i, a) {
		var o = e.pendingLanes;
		e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
		var s = e.entanglements, c = e.expirationTimes, l = e.hiddenUpdates;
		for (n = o & ~n; 0 < n;) {
			var u = 31 - Me(n), d = 1 << u;
			s[u] = 0, c[u] = -1;
			var f = l[u];
			if (f !== null) for (l[u] = null, u = 0; u < f.length; u++) {
				var p = f[u];
				p !== null && (p.lane &= -536870913);
			}
			n &= ~d;
		}
		r !== 0 && qe(e, r, 0), a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
	}
	function qe(e, t, n) {
		e.pendingLanes |= t, e.suspendedLanes &= ~t;
		var r = 31 - Me(t);
		e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 1073741824 | n & 261930;
	}
	function Je(e, t) {
		var n = e.entangledLanes |= t;
		for (e = e.entanglements; n;) {
			var r = 31 - Me(n), i = 1 << r;
			i & t | e[r] & t && (e[r] |= t), n &= ~i;
		}
	}
	function Ye(e, t) {
		var n = t & -t;
		return n = n & 42 ? 1 : Xe(n), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
	}
	function Xe(e) {
		switch (e) {
			case 2:
				e = 1;
				break;
			case 8:
				e = 4;
				break;
			case 32:
				e = 16;
				break;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152:
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
				e = 128;
				break;
			case 268435456:
				e = 134217728;
				break;
			default: e = 0;
		}
		return e;
	}
	function Ze(e) {
		return e &= -e, 2 < e ? 8 < e ? e & 134217727 ? 32 : 268435456 : 8 : 2;
	}
	function Qe() {
		var e = L.p;
		return e === 0 ? (e = window.event, e === void 0 ? 32 : mp(e.type)) : e;
	}
	function $e(e, t) {
		var n = L.p;
		try {
			return L.p = e, t();
		} finally {
			L.p = n;
		}
	}
	var et = Math.random().toString(36).slice(2), tt = "__reactFiber$" + et, nt = "__reactProps$" + et, rt = "__reactContainer$" + et, it = "__reactEvents$" + et, at = "__reactListeners$" + et, ot = "__reactHandles$" + et, st = "__reactResources$" + et, ct = "__reactMarker$" + et;
	function lt(e) {
		delete e[tt], delete e[nt], delete e[it], delete e[at], delete e[ot];
	}
	function W(e) {
		var t = e[tt];
		if (t) return t;
		for (var n = e.parentNode; n;) {
			if (t = n[rt] || n[tt]) {
				if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = df(e); e !== null;) {
					if (n = e[tt]) return n;
					e = df(e);
				}
				return t;
			}
			e = n, n = e.parentNode;
		}
		return null;
	}
	function ut(e) {
		if (e = e[tt] || e[rt]) {
			var t = e.tag;
			if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
		}
		return null;
	}
	function dt(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
		throw Error(i(33));
	}
	function ft(e) {
		var t = e[st];
		return t ||= e[st] = {
			hoistableStyles: /* @__PURE__ */ new Map(),
			hoistableScripts: /* @__PURE__ */ new Map()
		}, t;
	}
	function pt(e) {
		e[ct] = !0;
	}
	var mt = /* @__PURE__ */ new Set(), ht = {};
	function gt(e, t) {
		_t(e, t), _t(e + "Capture", t);
	}
	function _t(e, t) {
		for (ht[e] = t, e = 0; e < t.length; e++) mt.add(t[e]);
	}
	var vt = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), yt = {}, bt = {};
	function G(e) {
		return he.call(bt, e) ? !0 : he.call(yt, e) ? !1 : vt.test(e) ? bt[e] = !0 : (yt[e] = !0, !1);
	}
	function xt(e, t, n) {
		if (G(t)) if (n === null) e.removeAttribute(t);
		else {
			switch (typeof n) {
				case "undefined":
				case "function":
				case "symbol":
					e.removeAttribute(t);
					return;
				case "boolean":
					var r = t.toLowerCase().slice(0, 5);
					if (r !== "data-" && r !== "aria-") {
						e.removeAttribute(t);
						return;
					}
			}
			e.setAttribute(t, "" + n);
		}
	}
	function St(e, t, n) {
		if (n === null) e.removeAttribute(t);
		else {
			switch (typeof n) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(t);
					return;
			}
			e.setAttribute(t, "" + n);
		}
	}
	function Ct(e, t, n, r) {
		if (r === null) e.removeAttribute(n);
		else {
			switch (typeof r) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(n);
					return;
			}
			e.setAttributeNS(t, n, "" + r);
		}
	}
	function wt(e) {
		switch (typeof e) {
			case "bigint":
			case "boolean":
			case "number":
			case "string":
			case "undefined": return e;
			case "object": return e;
			default: return "";
		}
	}
	function Tt(e) {
		var t = e.type;
		return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
	}
	function Et(e, t, n) {
		var r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
		if (!e.hasOwnProperty(t) && r !== void 0 && typeof r.get == "function" && typeof r.set == "function") {
			var i = r.get, a = r.set;
			return Object.defineProperty(e, t, {
				configurable: !0,
				get: function() {
					return i.call(this);
				},
				set: function(e) {
					n = "" + e, a.call(this, e);
				}
			}), Object.defineProperty(e, t, { enumerable: r.enumerable }), {
				getValue: function() {
					return n;
				},
				setValue: function(e) {
					n = "" + e;
				},
				stopTracking: function() {
					e._valueTracker = null, delete e[t];
				}
			};
		}
	}
	function Dt(e) {
		if (!e._valueTracker) {
			var t = Tt(e) ? "checked" : "value";
			e._valueTracker = Et(e, t, "" + e[t]);
		}
	}
	function K(e) {
		if (!e) return !1;
		var t = e._valueTracker;
		if (!t) return !0;
		var n = t.getValue(), r = "";
		return e && (r = Tt(e) ? e.checked ? "true" : "false" : e.value), e = r, e === n ? !1 : (t.setValue(e), !0);
	}
	function Ot(e) {
		if (e ||= typeof document < "u" ? document : void 0, e === void 0) return null;
		try {
			return e.activeElement || e.body;
		} catch {
			return e.body;
		}
	}
	var kt = /[\n"\\]/g;
	function At(e) {
		return e.replace(kt, function(e) {
			return "\\" + e.charCodeAt(0).toString(16) + " ";
		});
	}
	function jt(e, t, n, r, i, a, o, s) {
		e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + wt(t)) : e.value !== "" + wt(t) && (e.value = "" + wt(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : Nt(e, o, wt(n)) : Nt(e, o, wt(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + wt(s) : e.removeAttribute("name");
	}
	function Mt(e, t, n, r, i, a, o, s) {
		if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (e.type = a), t != null || n != null) {
			if (!(a !== "submit" && a !== "reset" || t != null)) {
				Dt(e);
				return;
			}
			n = n == null ? "" : "" + wt(n), t = t == null ? n : "" + wt(t), s || t === e.value || (e.value = t), e.defaultValue = t;
		}
		r ??= i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), Dt(e);
	}
	function Nt(e, t, n) {
		t === "number" && Ot(e.ownerDocument) === e || e.defaultValue === "" + n || (e.defaultValue = "" + n);
	}
	function Pt(e, t, n, r) {
		if (e = e.options, t) {
			t = {};
			for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
			for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
		} else {
			for (n = "" + wt(n), t = null, i = 0; i < e.length; i++) {
				if (e[i].value === n) {
					e[i].selected = !0, r && (e[i].defaultSelected = !0);
					return;
				}
				t !== null || e[i].disabled || (t = e[i]);
			}
			t !== null && (t.selected = !0);
		}
	}
	function Ft(e, t, n) {
		if (t != null && (t = "" + wt(t), t !== e.value && (e.value = t), n == null)) {
			e.defaultValue !== t && (e.defaultValue = t);
			return;
		}
		e.defaultValue = n == null ? "" : "" + wt(n);
	}
	function It(e, t, n, r) {
		if (t == null) {
			if (r != null) {
				if (n != null) throw Error(i(92));
				if (F(r)) {
					if (1 < r.length) throw Error(i(93));
					r = r[0];
				}
				n = r;
			}
			n ??= "", t = n;
		}
		n = wt(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), Dt(e);
	}
	function Lt(e, t) {
		if (t) {
			var n = e.firstChild;
			if (n && n === e.lastChild && n.nodeType === 3) {
				n.nodeValue = t;
				return;
			}
		}
		e.textContent = t;
	}
	var Rt = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function zt(e, t, n) {
		var r = t.indexOf("--") === 0;
		n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || Rt.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
	}
	function Bt(e, t, n) {
		if (t != null && typeof t != "object") throw Error(i(62));
		if (e = e.style, n != null) {
			for (var r in n) !n.hasOwnProperty(r) || t != null && t.hasOwnProperty(r) || (r.indexOf("--") === 0 ? e.setProperty(r, "") : r === "float" ? e.cssFloat = "" : e[r] = "");
			for (var a in t) r = t[a], t.hasOwnProperty(a) && n[a] !== r && zt(e, a, r);
		} else for (var o in t) t.hasOwnProperty(o) && zt(e, o, t[o]);
	}
	function Vt(e) {
		if (e.indexOf("-") === -1) return !1;
		switch (e) {
			case "annotation-xml":
			case "color-profile":
			case "font-face":
			case "font-face-src":
			case "font-face-uri":
			case "font-face-format":
			case "font-face-name":
			case "missing-glyph": return !1;
			default: return !0;
		}
	}
	var Ht = new Map([
		["acceptCharset", "accept-charset"],
		["htmlFor", "for"],
		["httpEquiv", "http-equiv"],
		["crossOrigin", "crossorigin"],
		["accentHeight", "accent-height"],
		["alignmentBaseline", "alignment-baseline"],
		["arabicForm", "arabic-form"],
		["baselineShift", "baseline-shift"],
		["capHeight", "cap-height"],
		["clipPath", "clip-path"],
		["clipRule", "clip-rule"],
		["colorInterpolation", "color-interpolation"],
		["colorInterpolationFilters", "color-interpolation-filters"],
		["colorProfile", "color-profile"],
		["colorRendering", "color-rendering"],
		["dominantBaseline", "dominant-baseline"],
		["enableBackground", "enable-background"],
		["fillOpacity", "fill-opacity"],
		["fillRule", "fill-rule"],
		["floodColor", "flood-color"],
		["floodOpacity", "flood-opacity"],
		["fontFamily", "font-family"],
		["fontSize", "font-size"],
		["fontSizeAdjust", "font-size-adjust"],
		["fontStretch", "font-stretch"],
		["fontStyle", "font-style"],
		["fontVariant", "font-variant"],
		["fontWeight", "font-weight"],
		["glyphName", "glyph-name"],
		["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
		["glyphOrientationVertical", "glyph-orientation-vertical"],
		["horizAdvX", "horiz-adv-x"],
		["horizOriginX", "horiz-origin-x"],
		["imageRendering", "image-rendering"],
		["letterSpacing", "letter-spacing"],
		["lightingColor", "lighting-color"],
		["markerEnd", "marker-end"],
		["markerMid", "marker-mid"],
		["markerStart", "marker-start"],
		["overlinePosition", "overline-position"],
		["overlineThickness", "overline-thickness"],
		["paintOrder", "paint-order"],
		["panose-1", "panose-1"],
		["pointerEvents", "pointer-events"],
		["renderingIntent", "rendering-intent"],
		["shapeRendering", "shape-rendering"],
		["stopColor", "stop-color"],
		["stopOpacity", "stop-opacity"],
		["strikethroughPosition", "strikethrough-position"],
		["strikethroughThickness", "strikethrough-thickness"],
		["strokeDasharray", "stroke-dasharray"],
		["strokeDashoffset", "stroke-dashoffset"],
		["strokeLinecap", "stroke-linecap"],
		["strokeLinejoin", "stroke-linejoin"],
		["strokeMiterlimit", "stroke-miterlimit"],
		["strokeOpacity", "stroke-opacity"],
		["strokeWidth", "stroke-width"],
		["textAnchor", "text-anchor"],
		["textDecoration", "text-decoration"],
		["textRendering", "text-rendering"],
		["transformOrigin", "transform-origin"],
		["underlinePosition", "underline-position"],
		["underlineThickness", "underline-thickness"],
		["unicodeBidi", "unicode-bidi"],
		["unicodeRange", "unicode-range"],
		["unitsPerEm", "units-per-em"],
		["vAlphabetic", "v-alphabetic"],
		["vHanging", "v-hanging"],
		["vIdeographic", "v-ideographic"],
		["vMathematical", "v-mathematical"],
		["vectorEffect", "vector-effect"],
		["vertAdvY", "vert-adv-y"],
		["vertOriginX", "vert-origin-x"],
		["vertOriginY", "vert-origin-y"],
		["wordSpacing", "word-spacing"],
		["writingMode", "writing-mode"],
		["xmlnsXlink", "xmlns:xlink"],
		["xHeight", "x-height"]
	]), Ut = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function Wt(e) {
		return Ut.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
	}
	function Gt() {}
	var Kt = null;
	function qt(e) {
		return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
	}
	var Jt = null, Yt = null;
	function Xt(e) {
		var t = ut(e);
		if (t && (e = t.stateNode)) {
			var n = e[nt] || null;
			a: switch (e = t.stateNode, t.type) {
				case "input":
					if (jt(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
						for (n = e; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll("input[name=\"" + At("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
							var r = n[t];
							if (r !== e && r.form === e.form) {
								var a = r[nt] || null;
								if (!a) throw Error(i(90));
								jt(r, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name);
							}
						}
						for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && K(r);
					}
					break a;
				case "textarea":
					Ft(e, n.value, n.defaultValue);
					break a;
				case "select": t = n.value, t != null && Pt(e, !!n.multiple, t, !1);
			}
		}
	}
	var Zt = !1;
	function Qt(e, t, n) {
		if (Zt) return e(t, n);
		Zt = !0;
		try {
			return e(t);
		} finally {
			if (Zt = !1, (Jt !== null || Yt !== null) && (yu(), Jt && (t = Jt, e = Yt, Yt = Jt = null, Xt(t), e))) for (t = 0; t < e.length; t++) Xt(e[t]);
		}
	}
	function $t(e, t) {
		var n = e.stateNode;
		if (n === null) return null;
		var r = n[nt] || null;
		if (r === null) return null;
		n = r[t];
		a: switch (t) {
			case "onClick":
			case "onClickCapture":
			case "onDoubleClick":
			case "onDoubleClickCapture":
			case "onMouseDown":
			case "onMouseDownCapture":
			case "onMouseMove":
			case "onMouseMoveCapture":
			case "onMouseUp":
			case "onMouseUpCapture":
			case "onMouseEnter":
				(r = !r.disabled) || (e = e.type, r = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !r;
				break a;
			default: e = !1;
		}
		if (e) return null;
		if (n && typeof n != "function") throw Error(i(231, t, typeof n));
		return n;
	}
	var en = !(typeof window > "u" || window.document === void 0 || window.document.createElement === void 0), tn = !1;
	if (en) try {
		var nn = {};
		Object.defineProperty(nn, "passive", { get: function() {
			tn = !0;
		} }), window.addEventListener("test", nn, nn), window.removeEventListener("test", nn, nn);
	} catch {
		tn = !1;
	}
	var rn = null, an = null, on = null;
	function sn() {
		if (on) return on;
		var e, t = an, n = t.length, r, i = "value" in rn ? rn.value : rn.textContent, a = i.length;
		for (e = 0; e < n && t[e] === i[e]; e++);
		var o = n - e;
		for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
		return on = i.slice(e, 1 < r ? 1 - r : void 0);
	}
	function cn(e) {
		var t = e.keyCode;
		return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
	}
	function ln() {
		return !0;
	}
	function un() {
		return !1;
	}
	function dn(e) {
		function t(t, n, r, i, a) {
			for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
			return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? ln : un, this.isPropagationStopped = un, this;
		}
		return h(t.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var e = this.nativeEvent;
				e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = ln);
			},
			stopPropagation: function() {
				var e = this.nativeEvent;
				e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = ln);
			},
			persist: function() {},
			isPersistent: ln
		}), t;
	}
	var q = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(e) {
			return e.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, fn = dn(q), pn = h({}, q, {
		view: 0,
		detail: 0
	}), mn = dn(pn), hn, gn, _n, vn = h({}, pn, {
		screenX: 0,
		screenY: 0,
		clientX: 0,
		clientY: 0,
		pageX: 0,
		pageY: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		getModifierState: kn,
		button: 0,
		buttons: 0,
		relatedTarget: function(e) {
			return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
		},
		movementX: function(e) {
			return "movementX" in e ? e.movementX : (e !== _n && (_n && e.type === "mousemove" ? (hn = e.screenX - _n.screenX, gn = e.screenY - _n.screenY) : gn = hn = 0, _n = e), hn);
		},
		movementY: function(e) {
			return "movementY" in e ? e.movementY : gn;
		}
	}), yn = dn(vn), bn = dn(h({}, vn, { dataTransfer: 0 })), xn = dn(h({}, pn, { relatedTarget: 0 })), Sn = dn(h({}, q, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Cn = dn(h({}, q, { clipboardData: function(e) {
		return "clipboardData" in e ? e.clipboardData : window.clipboardData;
	} })), wn = dn(h({}, q, { data: 0 })), Tn = {
		Esc: "Escape",
		Spacebar: " ",
		Left: "ArrowLeft",
		Up: "ArrowUp",
		Right: "ArrowRight",
		Down: "ArrowDown",
		Del: "Delete",
		Win: "OS",
		Menu: "ContextMenu",
		Apps: "ContextMenu",
		Scroll: "ScrollLock",
		MozPrintableKey: "Unidentified"
	}, En = {
		8: "Backspace",
		9: "Tab",
		12: "Clear",
		13: "Enter",
		16: "Shift",
		17: "Control",
		18: "Alt",
		19: "Pause",
		20: "CapsLock",
		27: "Escape",
		32: " ",
		33: "PageUp",
		34: "PageDown",
		35: "End",
		36: "Home",
		37: "ArrowLeft",
		38: "ArrowUp",
		39: "ArrowRight",
		40: "ArrowDown",
		45: "Insert",
		46: "Delete",
		112: "F1",
		113: "F2",
		114: "F3",
		115: "F4",
		116: "F5",
		117: "F6",
		118: "F7",
		119: "F8",
		120: "F9",
		121: "F10",
		122: "F11",
		123: "F12",
		144: "NumLock",
		145: "ScrollLock",
		224: "Meta"
	}, Dn = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function On(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = Dn[e]) ? !!t[e] : !1;
	}
	function kn() {
		return On;
	}
	var An = dn(h({}, pn, {
		key: function(e) {
			if (e.key) {
				var t = Tn[e.key] || e.key;
				if (t !== "Unidentified") return t;
			}
			return e.type === "keypress" ? (e = cn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? En[e.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: kn,
		charCode: function(e) {
			return e.type === "keypress" ? cn(e) : 0;
		},
		keyCode: function(e) {
			return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		},
		which: function(e) {
			return e.type === "keypress" ? cn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		}
	})), jn = dn(h({}, vn, {
		pointerId: 0,
		width: 0,
		height: 0,
		pressure: 0,
		tangentialPressure: 0,
		tiltX: 0,
		tiltY: 0,
		twist: 0,
		pointerType: 0,
		isPrimary: 0
	})), Mn = dn(h({}, pn, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: kn
	})), Nn = dn(h({}, q, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Pn = dn(h({}, vn, {
		deltaX: function(e) {
			return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
		},
		deltaY: function(e) {
			return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), Fn = dn(h({}, q, {
		newState: 0,
		oldState: 0
	})), In = [
		9,
		13,
		27,
		32
	], Ln = en && "CompositionEvent" in window, Rn = null;
	en && "documentMode" in document && (Rn = document.documentMode);
	var zn = en && "TextEvent" in window && !Rn, Bn = en && (!Ln || Rn && 8 < Rn && 11 >= Rn), Vn = " ", Hn = !1;
	function Un(e, t) {
		switch (e) {
			case "keyup": return In.indexOf(t.keyCode) !== -1;
			case "keydown": return t.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function Wn(e) {
		return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
	}
	var Gn = !1;
	function Kn(e, t) {
		switch (e) {
			case "compositionend": return Wn(t);
			case "keypress": return t.which === 32 ? (Hn = !0, Vn) : null;
			case "textInput": return e = t.data, e === Vn && Hn ? null : e;
			default: return null;
		}
	}
	function qn(e, t) {
		if (Gn) return e === "compositionend" || !Ln && Un(e, t) ? (e = sn(), on = an = rn = null, Gn = !1, e) : null;
		switch (e) {
			case "paste": return null;
			case "keypress":
				if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
					if (t.char && 1 < t.char.length) return t.char;
					if (t.which) return String.fromCharCode(t.which);
				}
				return null;
			case "compositionend": return Bn && t.locale !== "ko" ? null : t.data;
			default: return null;
		}
	}
	var Jn = {
		color: !0,
		date: !0,
		datetime: !0,
		"datetime-local": !0,
		email: !0,
		month: !0,
		number: !0,
		password: !0,
		range: !0,
		search: !0,
		tel: !0,
		text: !0,
		time: !0,
		url: !0,
		week: !0
	};
	function Yn(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t === "input" ? !!Jn[e.type] : t === "textarea";
	}
	function Xn(e, t, n, r) {
		Jt ? Yt ? Yt.push(r) : Yt = [r] : Jt = r, t = Td(t, "onChange"), 0 < t.length && (n = new fn("onChange", "change", null, n, r), e.push({
			event: n,
			listeners: t
		}));
	}
	var Zn = null, Qn = null;
	function $n(e) {
		Q(e, 0);
	}
	function er(e) {
		if (K(dt(e))) return e;
	}
	function tr(e, t) {
		if (e === "change") return t;
	}
	var nr = !1;
	if (en) {
		var rr;
		if (en) {
			var ir = "oninput" in document;
			if (!ir) {
				var ar = document.createElement("div");
				ar.setAttribute("oninput", "return;"), ir = typeof ar.oninput == "function";
			}
			rr = ir;
		} else rr = !1;
		nr = rr && (!document.documentMode || 9 < document.documentMode);
	}
	function or() {
		Zn && (Zn.detachEvent("onpropertychange", sr), Qn = Zn = null);
	}
	function sr(e) {
		if (e.propertyName === "value" && er(Qn)) {
			var t = [];
			Xn(t, Qn, e, qt(e)), Qt($n, t);
		}
	}
	function cr(e, t, n) {
		e === "focusin" ? (or(), Zn = t, Qn = n, Zn.attachEvent("onpropertychange", sr)) : e === "focusout" && or();
	}
	function lr(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return er(Qn);
	}
	function ur(e, t) {
		if (e === "click") return er(t);
	}
	function dr(e, t) {
		if (e === "input" || e === "change") return er(t);
	}
	function fr(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var pr = typeof Object.is == "function" ? Object.is : fr;
	function mr(e, t) {
		if (pr(e, t)) return !0;
		if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
		var n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (r = 0; r < n.length; r++) {
			var i = n[r];
			if (!he.call(t, i) || !pr(e[i], t[i])) return !1;
		}
		return !0;
	}
	function hr(e) {
		for (; e && e.firstChild;) e = e.firstChild;
		return e;
	}
	function gr(e, t) {
		var n = hr(e);
		e = 0;
		for (var r; n;) {
			if (n.nodeType === 3) {
				if (r = e + n.textContent.length, e <= t && r >= t) return {
					node: n,
					offset: t - e
				};
				e = r;
			}
			a: {
				for (; n;) {
					if (n.nextSibling) {
						n = n.nextSibling;
						break a;
					}
					n = n.parentNode;
				}
				n = void 0;
			}
			n = hr(n);
		}
	}
	function _r(e, t) {
		return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? _r(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
	}
	function vr(e) {
		e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
		for (var t = Ot(e.document); t instanceof e.HTMLIFrameElement;) {
			try {
				var n = typeof t.contentWindow.location.href == "string";
			} catch {
				n = !1;
			}
			if (n) e = t.contentWindow;
			else break;
			t = Ot(e.document);
		}
		return t;
	}
	function yr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
	}
	var br = en && "documentMode" in document && 11 >= document.documentMode, xr = null, Sr = null, Cr = null, wr = !1;
	function Tr(e, t, n) {
		var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		wr || xr == null || xr !== Ot(r) || (r = xr, "selectionStart" in r && yr(r) ? r = {
			start: r.selectionStart,
			end: r.selectionEnd
		} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
			anchorNode: r.anchorNode,
			anchorOffset: r.anchorOffset,
			focusNode: r.focusNode,
			focusOffset: r.focusOffset
		}), Cr && mr(Cr, r) || (Cr = r, r = Td(Sr, "onSelect"), 0 < r.length && (t = new fn("onSelect", "select", null, t, n), e.push({
			event: t,
			listeners: r
		}), t.target = xr)));
	}
	function Er(e, t) {
		var n = {};
		return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
	}
	var Dr = {
		animationend: Er("Animation", "AnimationEnd"),
		animationiteration: Er("Animation", "AnimationIteration"),
		animationstart: Er("Animation", "AnimationStart"),
		transitionrun: Er("Transition", "TransitionRun"),
		transitionstart: Er("Transition", "TransitionStart"),
		transitioncancel: Er("Transition", "TransitionCancel"),
		transitionend: Er("Transition", "TransitionEnd")
	}, Or = {}, kr = {};
	en && (kr = document.createElement("div").style, "AnimationEvent" in window || (delete Dr.animationend.animation, delete Dr.animationiteration.animation, delete Dr.animationstart.animation), "TransitionEvent" in window || delete Dr.transitionend.transition);
	function Ar(e) {
		if (Or[e]) return Or[e];
		if (!Dr[e]) return e;
		var t = Dr[e], n;
		for (n in t) if (t.hasOwnProperty(n) && n in kr) return Or[e] = t[n];
		return e;
	}
	var jr = Ar("animationend"), Mr = Ar("animationiteration"), Nr = Ar("animationstart"), Pr = Ar("transitionrun"), Fr = Ar("transitionstart"), Ir = Ar("transitioncancel"), Lr = Ar("transitionend"), Rr = /* @__PURE__ */ new Map(), zr = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	zr.push("scrollEnd");
	function Br(e, t) {
		Rr.set(e, t), gt(t, [e]);
	}
	var Vr = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	}, Hr = [], Ur = 0, Wr = 0;
	function Gr() {
		for (var e = Ur, t = Wr = Ur = 0; t < e;) {
			var n = Hr[t];
			Hr[t++] = null;
			var r = Hr[t];
			Hr[t++] = null;
			var i = Hr[t];
			Hr[t++] = null;
			var a = Hr[t];
			if (Hr[t++] = null, r !== null && i !== null) {
				var o = r.pending;
				o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
			}
			a !== 0 && Yr(n, i, a);
		}
	}
	function Kr(e, t, n, r) {
		Hr[Ur++] = e, Hr[Ur++] = t, Hr[Ur++] = n, Hr[Ur++] = r, Wr |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
	}
	function qr(e, t, n, r) {
		return Kr(e, t, n, r), Xr(e);
	}
	function Jr(e, t) {
		return Kr(e, null, null, t), Xr(e);
	}
	function Yr(e, t, n) {
		e.lanes |= n;
		var r = e.alternate;
		r !== null && (r.lanes |= n);
		for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & 1 || (i = !0)), e = a, a = a.return;
		return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - Me(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
	}
	function Xr(e) {
		if (50 < uu) throw uu = 0, du = null, Error(i(185));
		for (var t = e.return; t !== null;) e = t, t = e.return;
		return e.tag === 3 ? e.stateNode : null;
	}
	var Zr = {};
	function Qr(e, t, n, r) {
		this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
	}
	function $r(e, t, n, r) {
		return new Qr(e, t, n, r);
	}
	function ei(e) {
		return e = e.prototype, !(!e || !e.isReactComponent);
	}
	function ti(e, t) {
		var n = e.alternate;
		return n === null ? (n = $r(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 65011712, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
	}
	function ni(e, t) {
		e.flags &= 65011714;
		var n = e.alternate;
		return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}), e;
	}
	function ri(e, t, n, r, a, o) {
		var s = 0;
		if (r = e, typeof e == "function") ei(e) && (s = 1);
		else if (typeof e == "string") s = Uf(e, n, ne.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else a: switch (e) {
			case k: return e = $r(31, n, t, a), e.elementType = k, e.lanes = o, e;
			case y: return ii(n.children, a, o, t);
			case b:
				s = 8, a |= 24;
				break;
			case x: return e = $r(12, n, t, a | 2), e.elementType = x, e.lanes = o, e;
			case T: return e = $r(13, n, t, a), e.elementType = T, e.lanes = o, e;
			case E: return e = $r(19, n, t, a), e.elementType = E, e.lanes = o, e;
			default:
				if (typeof e == "object" && e) switch (e.$$typeof) {
					case C:
						s = 10;
						break a;
					case S:
						s = 9;
						break a;
					case w:
						s = 11;
						break a;
					case D:
						s = 14;
						break a;
					case O:
						s = 16, r = null;
						break a;
				}
				s = 29, n = Error(i(130, e === null ? "null" : typeof e, "")), r = null;
		}
		return t = $r(s, n, t, a), t.elementType = e, t.type = r, t.lanes = o, t;
	}
	function ii(e, t, n, r) {
		return e = $r(7, e, r, t), e.lanes = n, e;
	}
	function ai(e, t, n) {
		return e = $r(6, e, null, t), e.lanes = n, e;
	}
	function oi(e) {
		var t = $r(18, null, null, 0);
		return t.stateNode = e, t;
	}
	function si(e, t, n) {
		return t = $r(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
			containerInfo: e.containerInfo,
			pendingChildren: null,
			implementation: e.implementation
		}, t;
	}
	var ci = /* @__PURE__ */ new WeakMap();
	function li(e, t) {
		if (typeof e == "object" && e) {
			var n = ci.get(e);
			return n === void 0 ? (t = {
				value: e,
				source: t,
				stack: me(t)
			}, ci.set(e, t), t) : n;
		}
		return {
			value: e,
			source: t,
			stack: me(t)
		};
	}
	var ui = [], di = 0, fi = null, pi = 0, mi = [], hi = 0, gi = null, _i = 1, vi = "";
	function yi(e, t) {
		ui[di++] = pi, ui[di++] = fi, fi = e, pi = t;
	}
	function bi(e, t, n) {
		mi[hi++] = _i, mi[hi++] = vi, mi[hi++] = gi, gi = e;
		var r = _i;
		e = vi;
		var i = 32 - Me(r) - 1;
		r &= ~(1 << i), n += 1;
		var a = 32 - Me(t) + i;
		if (30 < a) {
			var o = i - i % 5;
			a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, _i = 1 << 32 - Me(t) + i | n << i | r, vi = a + e;
		} else _i = 1 << a | n << i | r, vi = e;
	}
	function xi(e) {
		e.return !== null && (yi(e, 1), bi(e, 1, 0));
	}
	function Si(e) {
		for (; e === fi;) fi = ui[--di], ui[di] = null, pi = ui[--di], ui[di] = null;
		for (; e === gi;) gi = mi[--hi], mi[hi] = null, vi = mi[--hi], mi[hi] = null, _i = mi[--hi], mi[hi] = null;
	}
	function Ci(e, t) {
		mi[hi++] = _i, mi[hi++] = vi, mi[hi++] = gi, _i = t.id, vi = t.overflow, gi = e;
	}
	var wi = null, Ti = null, Ei = !1, Di = null, Oi = !1, ki = Error(i(519));
	function Ai(e) {
		throw Ii(li(Error(i(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", "")), e)), ki;
	}
	function ji(e) {
		var t = e.stateNode, n = e.type, r = e.memoizedProps;
		switch (t[tt] = e, t[nt] = r, n) {
			case "dialog":
				$("cancel", t), $("close", t);
				break;
			case "iframe":
			case "object":
			case "embed":
				$("load", t);
				break;
			case "video":
			case "audio":
				for (n = 0; n < _d.length; n++) $(_d[n], t);
				break;
			case "source":
				$("error", t);
				break;
			case "img":
			case "image":
			case "link":
				$("error", t), $("load", t);
				break;
			case "details":
				$("toggle", t);
				break;
			case "input":
				$("invalid", t), Mt(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
				break;
			case "select":
				$("invalid", t);
				break;
			case "textarea": $("invalid", t), It(t, r.value, r.defaultValue, r.children);
		}
		n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || jd(t.textContent, n) ? (r.popover != null && ($("beforetoggle", t), $("toggle", t)), r.onScroll != null && $("scroll", t), r.onScrollEnd != null && $("scrollend", t), r.onClick != null && (t.onclick = Gt), t = !0) : t = !1, t || Ai(e, !0);
	}
	function Mi(e) {
		for (wi = e.return; wi;) switch (wi.tag) {
			case 5:
			case 31:
			case 13:
				Oi = !1;
				return;
			case 27:
			case 3:
				Oi = !0;
				return;
			default: wi = wi.return;
		}
	}
	function Ni(e) {
		if (e !== wi) return !1;
		if (!Ei) return Mi(e), Ei = !0, !1;
		var t = e.tag, n;
		if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = !(n !== "form" && n !== "button") || Ud(e.type, e.memoizedProps)), n = !n), n && Ti && Ai(e), Mi(e), t === 13) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			Ti = uf(e);
		} else if (t === 31) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			Ti = uf(e);
		} else t === 27 ? (t = Ti, Zd(e.type) ? (e = lf, lf = null, Ti = e) : Ti = t) : Ti = wi ? cf(e.stateNode.nextSibling) : null;
		return !0;
	}
	function Pi() {
		Ti = wi = null, Ei = !1;
	}
	function Fi() {
		var e = Di;
		return e !== null && (Xl === null ? Xl = e : Xl.push.apply(Xl, e), Di = null), e;
	}
	function Ii(e) {
		Di === null ? Di = [e] : Di.push(e);
	}
	var Li = z(null), Ri = null, zi = null;
	function Bi(e, t, n) {
		V(Li, t._currentValue), t._currentValue = n;
	}
	function Vi(e) {
		e._currentValue = Li.current, B(Li);
	}
	function Hi(e, t, n) {
		for (; e !== null;) {
			var r = e.alternate;
			if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
			e = e.return;
		}
	}
	function Ui(e, t, n, r) {
		var a = e.child;
		for (a !== null && (a.return = e); a !== null;) {
			var o = a.dependencies;
			if (o !== null) {
				var s = a.child;
				o = o.firstContext;
				a: for (; o !== null;) {
					var c = o;
					o = a;
					for (var l = 0; l < t.length; l++) if (c.context === t[l]) {
						o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), Hi(o.return, n, e), r || (s = null);
						break a;
					}
					o = c.next;
				}
			} else if (a.tag === 18) {
				if (s = a.return, s === null) throw Error(i(341));
				s.lanes |= n, o = s.alternate, o !== null && (o.lanes |= n), Hi(s, n, e), s = null;
			} else s = a.child;
			if (s !== null) s.return = a;
			else for (s = a; s !== null;) {
				if (s === e) {
					s = null;
					break;
				}
				if (a = s.sibling, a !== null) {
					a.return = s.return, s = a;
					break;
				}
				s = s.return;
			}
			a = s;
		}
	}
	function Wi(e, t, n, r) {
		e = null;
		for (var a = t, o = !1; a !== null;) {
			if (!o) {
				if (a.flags & 524288) o = !0;
				else if (a.flags & 262144) break;
			}
			if (a.tag === 10) {
				var s = a.alternate;
				if (s === null) throw Error(i(387));
				if (s = s.memoizedProps, s !== null) {
					var c = a.type;
					pr(a.pendingProps.value, s.value) || (e === null ? e = [c] : e.push(c));
				}
			} else if (a === re.current) {
				if (s = a.alternate, s === null) throw Error(i(387));
				s.memoizedState.memoizedState !== a.memoizedState.memoizedState && (e === null ? e = [Qf] : e.push(Qf));
			}
			a = a.return;
		}
		e !== null && Ui(t, e, n, r), t.flags |= 262144;
	}
	function Gi(e) {
		for (e = e.firstContext; e !== null;) {
			if (!pr(e.context._currentValue, e.memoizedValue)) return !0;
			e = e.next;
		}
		return !1;
	}
	function Ki(e) {
		Ri = e, zi = null, e = e.dependencies, e !== null && (e.firstContext = null);
	}
	function qi(e) {
		return Yi(Ri, e);
	}
	function Ji(e, t) {
		return Ri === null && Ki(e), Yi(e, t);
	}
	function Yi(e, t) {
		var n = t._currentValue;
		if (t = {
			context: t,
			memoizedValue: n,
			next: null
		}, zi === null) {
			if (e === null) throw Error(i(308));
			zi = t, e.dependencies = {
				lanes: 0,
				firstContext: t
			}, e.flags |= 524288;
		} else zi = zi.next = t;
		return n;
	}
	var Xi = typeof AbortController < "u" ? AbortController : function() {
		var e = [], t = this.signal = {
			aborted: !1,
			addEventListener: function(t, n) {
				e.push(n);
			}
		};
		this.abort = function() {
			t.aborted = !0, e.forEach(function(e) {
				return e();
			});
		};
	}, Zi = t.unstable_scheduleCallback, Qi = t.unstable_NormalPriority, $i = {
		$$typeof: C,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function ea() {
		return {
			controller: new Xi(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function ta(e) {
		e.refCount--, e.refCount === 0 && Zi(Qi, function() {
			e.controller.abort();
		});
	}
	var na = null, ra = 0, ia = 0, aa = null;
	function oa(e, t) {
		if (na === null) {
			var n = na = [];
			ra = 0, ia = dd(), aa = {
				status: "pending",
				value: void 0,
				then: function(e) {
					n.push(e);
				}
			};
		}
		return ra++, t.then(sa, sa), t;
	}
	function sa() {
		if (--ra === 0 && na !== null) {
			aa !== null && (aa.status = "fulfilled");
			var e = na;
			na = null, ia = 0, aa = null;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
	}
	function ca(e, t) {
		var n = [], r = {
			status: "pending",
			value: null,
			reason: null,
			then: function(e) {
				n.push(e);
			}
		};
		return e.then(function() {
			r.status = "fulfilled", r.value = t;
			for (var e = 0; e < n.length; e++) (0, n[e])(t);
		}, function(e) {
			for (r.status = "rejected", r.reason = e, e = 0; e < n.length; e++) (0, n[e])(void 0);
		}), r;
	}
	var la = I.S;
	I.S = function(e, t) {
		$l = be(), typeof t == "object" && t && typeof t.then == "function" && oa(e, t), la !== null && la(e, t);
	};
	var ua = z(null);
	function da() {
		var e = ua.current;
		return e === null ? Il.pooledCache : e;
	}
	function fa(e, t) {
		t === null ? V(ua, ua.current) : V(ua, t.pool);
	}
	function pa() {
		var e = da();
		return e === null ? null : {
			parent: $i._currentValue,
			pool: e
		};
	}
	var ma = Error(i(460)), ha = Error(i(474)), ga = Error(i(542)), _a = { then: function() {} };
	function va(e) {
		return e = e.status, e === "fulfilled" || e === "rejected";
	}
	function ya(e, t, n) {
		switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(Gt, Gt), t = n), t.status) {
			case "fulfilled": return t.value;
			case "rejected": throw e = t.reason, Ca(e), e;
			default:
				if (typeof t.status == "string") t.then(Gt, Gt);
				else {
					if (e = Il, e !== null && 100 < e.shellSuspendCounter) throw Error(i(482));
					e = t, e.status = "pending", e.then(function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "fulfilled", n.value = e;
						}
					}, function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "rejected", n.reason = e;
						}
					});
				}
				switch (t.status) {
					case "fulfilled": return t.value;
					case "rejected": throw e = t.reason, Ca(e), e;
				}
				throw xa = t, ma;
		}
	}
	function ba(e) {
		try {
			var t = e._init;
			return t(e._payload);
		} catch (e) {
			throw typeof e == "object" && e && typeof e.then == "function" ? (xa = e, ma) : e;
		}
	}
	var xa = null;
	function Sa() {
		if (xa === null) throw Error(i(459));
		var e = xa;
		return xa = null, e;
	}
	function Ca(e) {
		if (e === ma || e === ga) throw Error(i(483));
	}
	var wa = null, Ta = 0;
	function Ea(e) {
		var t = Ta;
		return Ta += 1, wa === null && (wa = []), ya(wa, e, t);
	}
	function Da(e, t) {
		t = t.props.ref, e.ref = t === void 0 ? null : t;
	}
	function Oa(e, t) {
		throw t.$$typeof === g ? Error(i(525)) : (e = Object.prototype.toString.call(t), Error(i(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
	}
	function ka(e) {
		function t(t, n) {
			if (e) {
				var r = t.deletions;
				r === null ? (t.deletions = [n], t.flags |= 16) : r.push(n);
			}
		}
		function n(n, r) {
			if (!e) return null;
			for (; r !== null;) t(n, r), r = r.sibling;
			return null;
		}
		function r(e) {
			for (var t = /* @__PURE__ */ new Map(); e !== null;) e.key === null ? t.set(e.index, e) : t.set(e.key, e), e = e.sibling;
			return t;
		}
		function a(e, t) {
			return e = ti(e, t), e.index = 0, e.sibling = null, e;
		}
		function o(t, n, r) {
			return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 67108866, n) : (r = r.index, r < n ? (t.flags |= 67108866, n) : r)) : (t.flags |= 1048576, n);
		}
		function s(t) {
			return e && t.alternate === null && (t.flags |= 67108866), t;
		}
		function c(e, t, n, r) {
			return t === null || t.tag !== 6 ? (t = ai(n, e.mode, r), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function l(e, t, n, r) {
			var i = n.type;
			return i === y ? d(e, t, n.props.children, r, n.key) : t !== null && (t.elementType === i || typeof i == "object" && i && i.$$typeof === O && ba(i) === t.type) ? (t = a(t, n.props), Da(t, n), t.return = e, t) : (t = ri(n.type, n.key, n.props, null, e.mode, r), Da(t, n), t.return = e, t);
		}
		function u(e, t, n, r) {
			return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = si(n, e.mode, r), t.return = e, t) : (t = a(t, n.children || []), t.return = e, t);
		}
		function d(e, t, n, r, i) {
			return t === null || t.tag !== 7 ? (t = ii(n, e.mode, r, i), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function f(e, t, n) {
			if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = ai("" + t, e.mode, n), t.return = e, t;
			if (typeof t == "object" && t) {
				switch (t.$$typeof) {
					case _: return n = ri(t.type, t.key, t.props, null, e.mode, n), Da(n, t), n.return = e, n;
					case v: return t = si(t, e.mode, n), t.return = e, t;
					case O: return t = ba(t), f(e, t, n);
				}
				if (F(t) || M(t)) return t = ii(t, e.mode, n, null), t.return = e, t;
				if (typeof t.then == "function") return f(e, Ea(t), n);
				if (t.$$typeof === C) return f(e, Ji(e, t), n);
				Oa(e, t);
			}
			return null;
		}
		function p(e, t, n, r) {
			var i = t === null ? null : t.key;
			if (typeof n == "string" && n !== "" || typeof n == "number" || typeof n == "bigint") return i === null ? c(e, t, "" + n, r) : null;
			if (typeof n == "object" && n) {
				switch (n.$$typeof) {
					case _: return n.key === i ? l(e, t, n, r) : null;
					case v: return n.key === i ? u(e, t, n, r) : null;
					case O: return n = ba(n), p(e, t, n, r);
				}
				if (F(n) || M(n)) return i === null ? d(e, t, n, r, null) : null;
				if (typeof n.then == "function") return p(e, t, Ea(n), r);
				if (n.$$typeof === C) return p(e, t, Ji(e, n), r);
				Oa(e, n);
			}
			return null;
		}
		function m(e, t, n, r, i) {
			if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, c(t, e, "" + r, i);
			if (typeof r == "object" && r) {
				switch (r.$$typeof) {
					case _: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
					case v: return e = e.get(r.key === null ? n : r.key) || null, u(t, e, r, i);
					case O: return r = ba(r), m(e, t, n, r, i);
				}
				if (F(r) || M(r)) return e = e.get(n) || null, d(t, e, r, i, null);
				if (typeof r.then == "function") return m(e, t, n, Ea(r), i);
				if (r.$$typeof === C) return m(e, t, n, Ji(t, r), i);
				Oa(t, r);
			}
			return null;
		}
		function h(i, a, s, c) {
			for (var l = null, u = null, d = a, h = a = 0, g = null; d !== null && h < s.length; h++) {
				d.index > h ? (g = d, d = null) : g = d.sibling;
				var _ = p(i, d, s[h], c);
				if (_ === null) {
					d === null && (d = g);
					break;
				}
				e && d && _.alternate === null && t(i, d), a = o(_, a, h), u === null ? l = _ : u.sibling = _, u = _, d = g;
			}
			if (h === s.length) return n(i, d), Ei && yi(i, h), l;
			if (d === null) {
				for (; h < s.length; h++) d = f(i, s[h], c), d !== null && (a = o(d, a, h), u === null ? l = d : u.sibling = d, u = d);
				return Ei && yi(i, h), l;
			}
			for (d = r(d); h < s.length; h++) g = m(d, i, h, s[h], c), g !== null && (e && g.alternate !== null && d.delete(g.key === null ? h : g.key), a = o(g, a, h), u === null ? l = g : u.sibling = g, u = g);
			return e && d.forEach(function(e) {
				return t(i, e);
			}), Ei && yi(i, h), l;
		}
		function g(a, s, c, l) {
			if (c == null) throw Error(i(151));
			for (var u = null, d = null, h = s, g = s = 0, _ = null, v = c.next(); h !== null && !v.done; g++, v = c.next()) {
				h.index > g ? (_ = h, h = null) : _ = h.sibling;
				var y = p(a, h, v.value, l);
				if (y === null) {
					h === null && (h = _);
					break;
				}
				e && h && y.alternate === null && t(a, h), s = o(y, s, g), d === null ? u = y : d.sibling = y, d = y, h = _;
			}
			if (v.done) return n(a, h), Ei && yi(a, g), u;
			if (h === null) {
				for (; !v.done; g++, v = c.next()) v = f(a, v.value, l), v !== null && (s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
				return Ei && yi(a, g), u;
			}
			for (h = r(h); !v.done; g++, v = c.next()) v = m(h, a, g, v.value, l), v !== null && (e && v.alternate !== null && h.delete(v.key === null ? g : v.key), s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
			return e && h.forEach(function(e) {
				return t(a, e);
			}), Ei && yi(a, g), u;
		}
		function b(e, r, o, c) {
			if (typeof o == "object" && o && o.type === y && o.key === null && (o = o.props.children), typeof o == "object" && o) {
				switch (o.$$typeof) {
					case _:
						a: {
							for (var l = o.key; r !== null;) {
								if (r.key === l) {
									if (l = o.type, l === y) {
										if (r.tag === 7) {
											n(e, r.sibling), c = a(r, o.props.children), c.return = e, e = c;
											break a;
										}
									} else if (r.elementType === l || typeof l == "object" && l && l.$$typeof === O && ba(l) === r.type) {
										n(e, r.sibling), c = a(r, o.props), Da(c, o), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								} else t(e, r);
								r = r.sibling;
							}
							o.type === y ? (c = ii(o.props.children, e.mode, c, o.key), c.return = e, e = c) : (c = ri(o.type, o.key, o.props, null, e.mode, c), Da(c, o), c.return = e, e = c);
						}
						return s(e);
					case v:
						a: {
							for (l = o.key; r !== null;) {
								if (r.key === l) if (r.tag === 4 && r.stateNode.containerInfo === o.containerInfo && r.stateNode.implementation === o.implementation) {
									n(e, r.sibling), c = a(r, o.children || []), c.return = e, e = c;
									break a;
								} else {
									n(e, r);
									break;
								}
								else t(e, r);
								r = r.sibling;
							}
							c = si(o, e.mode, c), c.return = e, e = c;
						}
						return s(e);
					case O: return o = ba(o), b(e, r, o, c);
				}
				if (F(o)) return h(e, r, o, c);
				if (M(o)) {
					if (l = M(o), typeof l != "function") throw Error(i(150));
					return o = l.call(o), g(e, r, o, c);
				}
				if (typeof o.then == "function") return b(e, r, Ea(o), c);
				if (o.$$typeof === C) return b(e, r, Ji(e, o), c);
				Oa(e, o);
			}
			return typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint" ? (o = "" + o, r !== null && r.tag === 6 ? (n(e, r.sibling), c = a(r, o), c.return = e, e = c) : (n(e, r), c = ai(o, e.mode, c), c.return = e, e = c), s(e)) : n(e, r);
		}
		return function(e, t, n, r) {
			try {
				Ta = 0;
				var i = b(e, t, n, r);
				return wa = null, i;
			} catch (t) {
				if (t === ma || t === ga) throw t;
				var a = $r(29, t, null, e.mode);
				return a.lanes = r, a.return = e, a;
			}
		};
	}
	var Aa = ka(!0), ja = ka(!1), Ma = !1;
	function Na(e) {
		e.updateQueue = {
			baseState: e.memoizedState,
			firstBaseUpdate: null,
			lastBaseUpdate: null,
			shared: {
				pending: null,
				lanes: 0,
				hiddenCallbacks: null
			},
			callbacks: null
		};
	}
	function Pa(e, t) {
		e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
			baseState: e.baseState,
			firstBaseUpdate: e.firstBaseUpdate,
			lastBaseUpdate: e.lastBaseUpdate,
			shared: e.shared,
			callbacks: null
		});
	}
	function Fa(e) {
		return {
			lane: e,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function Ia(e, t, n) {
		var r = e.updateQueue;
		if (r === null) return null;
		if (r = r.shared, Fl & 2) {
			var i = r.pending;
			return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = Xr(e), Yr(e, null, n), t;
		}
		return Kr(e, r, t, n), Xr(e);
	}
	function La(e, t, n) {
		if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, Je(e, n);
		}
	}
	function Ra(e, t) {
		var n = e.updateQueue, r = e.alternate;
		if (r !== null && (r = r.updateQueue, n === r)) {
			var i = null, a = null;
			if (n = n.firstBaseUpdate, n !== null) {
				do {
					var o = {
						lane: n.lane,
						tag: n.tag,
						payload: n.payload,
						callback: null,
						next: null
					};
					a === null ? i = a = o : a = a.next = o, n = n.next;
				} while (n !== null);
				a === null ? i = a = t : a = a.next = t;
			} else i = a = t;
			n = {
				baseState: r.baseState,
				firstBaseUpdate: i,
				lastBaseUpdate: a,
				shared: r.shared,
				callbacks: r.callbacks
			}, e.updateQueue = n;
			return;
		}
		e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
	}
	var za = !1;
	function Ba() {
		if (za) {
			var e = aa;
			if (e !== null) throw e;
		}
	}
	function Va(e, t, n, r) {
		za = !1;
		var i = e.updateQueue;
		Ma = !1;
		var a = i.firstBaseUpdate, o = i.lastBaseUpdate, s = i.shared.pending;
		if (s !== null) {
			i.shared.pending = null;
			var c = s, l = c.next;
			c.next = null, o === null ? a = l : o.next = l, o = c;
			var u = e.alternate;
			u !== null && (u = u.updateQueue, s = u.lastBaseUpdate, s !== o && (s === null ? u.firstBaseUpdate = l : s.next = l, u.lastBaseUpdate = c));
		}
		if (a !== null) {
			var d = i.baseState;
			o = 0, u = l = c = null, s = a;
			do {
				var f = s.lane & -536870913, p = f !== s.lane;
				if (p ? (Z & f) === f : (r & f) === f) {
					f !== 0 && f === ia && (za = !0), u !== null && (u = u.next = {
						lane: 0,
						tag: s.tag,
						payload: s.payload,
						callback: null,
						next: null
					});
					a: {
						var m = e, g = s;
						f = t;
						var _ = n;
						switch (g.tag) {
							case 1:
								if (m = g.payload, typeof m == "function") {
									d = m.call(_, d, f);
									break a;
								}
								d = m;
								break a;
							case 3: m.flags = m.flags & -65537 | 128;
							case 0:
								if (m = g.payload, f = typeof m == "function" ? m.call(_, d, f) : m, f == null) break a;
								d = h({}, d, f);
								break a;
							case 2: Ma = !0;
						}
					}
					f = s.callback, f !== null && (e.flags |= 64, p && (e.flags |= 8192), p = i.callbacks, p === null ? i.callbacks = [f] : p.push(f));
				} else p = {
					lane: f,
					tag: s.tag,
					payload: s.payload,
					callback: s.callback,
					next: null
				}, u === null ? (l = u = p, c = d) : u = u.next = p, o |= f;
				if (s = s.next, s === null) {
					if (s = i.shared.pending, s === null) break;
					p = s, s = p.next, p.next = null, i.lastBaseUpdate = p, i.shared.pending = null;
				}
			} while (1);
			u === null && (c = d), i.baseState = c, i.firstBaseUpdate = l, i.lastBaseUpdate = u, a === null && (i.shared.lanes = 0), Wl |= o, e.lanes = o, e.memoizedState = d;
		}
	}
	function Ha(e, t) {
		if (typeof e != "function") throw Error(i(191, e));
		e.call(t);
	}
	function Ua(e, t) {
		var n = e.callbacks;
		if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) Ha(n[e], t);
	}
	var Wa = z(null), Ga = z(0);
	function Ka(e, t) {
		e = Hl, V(Ga, e), V(Wa, t), Hl = e | t.baseLanes;
	}
	function qa() {
		V(Ga, Hl), V(Wa, Wa.current);
	}
	function Ja() {
		Hl = Ga.current, B(Wa), B(Ga);
	}
	var Ya = z(null), Xa = null;
	function Za(e) {
		var t = e.alternate;
		V(no, no.current & 1), V(Ya, e), Xa === null && (t === null || Wa.current !== null || t.memoizedState !== null) && (Xa = e);
	}
	function Qa(e) {
		V(no, no.current), V(Ya, e), Xa === null && (Xa = e);
	}
	function $a(e) {
		e.tag === 22 ? (V(no, no.current), V(Ya, e), Xa === null && (Xa = e)) : eo(e);
	}
	function eo() {
		V(no, no.current), V(Ya, Ya.current);
	}
	function to(e) {
		B(Ya), Xa === e && (Xa = null), B(no);
	}
	var no = z(0);
	function ro(e) {
		for (var t = e; t !== null;) {
			if (t.tag === 13) {
				var n = t.memoizedState;
				if (n !== null && (n = n.dehydrated, n === null || af(n) || of(n))) return t;
			} else if (t.tag === 19 && (t.memoizedProps.revealOrder === "forwards" || t.memoizedProps.revealOrder === "backwards" || t.memoizedProps.revealOrder === "unstable_legacy-backwards" || t.memoizedProps.revealOrder === "together")) {
				if (t.flags & 128) return t;
			} else if (t.child !== null) {
				t.child.return = t, t = t.child;
				continue;
			}
			if (t === e) break;
			for (; t.sibling === null;) {
				if (t.return === null || t.return === e) return null;
				t = t.return;
			}
			t.sibling.return = t.return, t = t.sibling;
		}
		return null;
	}
	var io = 0, J = null, ao = null, oo = null, so = !1, co = !1, lo = !1, uo = 0, fo = 0, po = null, mo = 0;
	function ho() {
		throw Error(i(321));
	}
	function go(e, t) {
		if (t === null) return !1;
		for (var n = 0; n < t.length && n < e.length; n++) if (!pr(e[n], t[n])) return !1;
		return !0;
	}
	function _o(e, t, n, r, i, a) {
		return io = a, J = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, I.H = e === null || e.memoizedState === null ? Ps : Fs, lo = !1, a = n(r, i), lo = !1, co && (a = yo(t, n, r, i)), vo(e), a;
	}
	function vo(e) {
		I.H = Ns;
		var t = ao !== null && ao.next !== null;
		if (io = 0, oo = ao = J = null, so = !1, fo = 0, po = null, t) throw Error(i(300));
		e === null || Qs || (e = e.dependencies, e !== null && Gi(e) && (Qs = !0));
	}
	function yo(e, t, n, r) {
		J = e;
		var a = 0;
		do {
			if (co && (po = null), fo = 0, co = !1, 25 <= a) throw Error(i(301));
			if (a += 1, oo = ao = null, e.updateQueue != null) {
				var o = e.updateQueue;
				o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
			}
			I.H = Is, o = t(n, r);
		} while (co);
		return o;
	}
	function bo() {
		var e = I.H, t = e.useState()[0];
		return t = typeof t.then == "function" ? Do(t) : t, e = e.useState()[0], (ao === null ? null : ao.memoizedState) !== e && (J.flags |= 1024), t;
	}
	function xo() {
		var e = uo !== 0;
		return uo = 0, e;
	}
	function So(e, t, n) {
		t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
	}
	function Co(e) {
		if (so) {
			for (e = e.memoizedState; e !== null;) {
				var t = e.queue;
				t !== null && (t.pending = null), e = e.next;
			}
			so = !1;
		}
		io = 0, oo = ao = J = null, co = !1, fo = uo = 0, po = null;
	}
	function wo() {
		var e = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return oo === null ? J.memoizedState = oo = e : oo = oo.next = e, oo;
	}
	function To() {
		if (ao === null) {
			var e = J.alternate;
			e = e === null ? null : e.memoizedState;
		} else e = ao.next;
		var t = oo === null ? J.memoizedState : oo.next;
		if (t !== null) oo = t, ao = e;
		else {
			if (e === null) throw J.alternate === null ? Error(i(467)) : Error(i(310));
			ao = e, e = {
				memoizedState: ao.memoizedState,
				baseState: ao.baseState,
				baseQueue: ao.baseQueue,
				queue: ao.queue,
				next: null
			}, oo === null ? J.memoizedState = oo = e : oo = oo.next = e;
		}
		return oo;
	}
	function Eo() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function Do(e) {
		var t = fo;
		return fo += 1, po === null && (po = []), e = ya(po, e, t), t = J, (oo === null ? t.memoizedState : oo.next) === null && (t = t.alternate, I.H = t === null || t.memoizedState === null ? Ps : Fs), e;
	}
	function Oo(e) {
		if (typeof e == "object" && e) {
			if (typeof e.then == "function") return Do(e);
			if (e.$$typeof === C) return qi(e);
		}
		throw Error(i(438, String(e)));
	}
	function ko(e) {
		var t = null, n = J.updateQueue;
		if (n !== null && (t = n.memoCache), t == null) {
			var r = J.alternate;
			r !== null && (r = r.updateQueue, r !== null && (r = r.memoCache, r != null && (t = {
				data: r.data.map(function(e) {
					return e.slice();
				}),
				index: 0
			})));
		}
		if (t ??= {
			data: [],
			index: 0
		}, n === null && (n = Eo(), J.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = A;
		return t.index++, n;
	}
	function Ao(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function jo(e) {
		return Mo(To(), ao, e);
	}
	function Mo(e, t, n) {
		var r = e.queue;
		if (r === null) throw Error(i(311));
		r.lastRenderedReducer = n;
		var a = e.baseQueue, o = r.pending;
		if (o !== null) {
			if (a !== null) {
				var s = a.next;
				a.next = o.next, o.next = s;
			}
			t.baseQueue = a = o, r.pending = null;
		}
		if (o = e.baseState, a === null) e.memoizedState = o;
		else {
			t = a.next;
			var c = s = null, l = null, u = t, d = !1;
			do {
				var f = u.lane & -536870913;
				if (f === u.lane ? (io & f) === f : (Z & f) === f) {
					var p = u.revertLane;
					if (p === 0) l !== null && (l = l.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}), f === ia && (d = !0);
					else if ((io & p) === p) {
						u = u.next, p === ia && (d = !0);
						continue;
					} else f = {
						lane: 0,
						revertLane: u.revertLane,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}, l === null ? (c = l = f, s = o) : l = l.next = f, J.lanes |= p, Wl |= p;
					f = u.action, lo && n(o, f), o = u.hasEagerState ? u.eagerState : n(o, f);
				} else p = {
					lane: f,
					revertLane: u.revertLane,
					gesture: u.gesture,
					action: u.action,
					hasEagerState: u.hasEagerState,
					eagerState: u.eagerState,
					next: null
				}, l === null ? (c = l = p, s = o) : l = l.next = p, J.lanes |= f, Wl |= f;
				u = u.next;
			} while (u !== null && u !== t);
			if (l === null ? s = o : l.next = c, !pr(o, e.memoizedState) && (Qs = !0, d && (n = aa, n !== null))) throw n;
			e.memoizedState = o, e.baseState = s, e.baseQueue = l, r.lastRenderedState = o;
		}
		return a === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
	}
	function No(e) {
		var t = To(), n = t.queue;
		if (n === null) throw Error(i(311));
		n.lastRenderedReducer = e;
		var r = n.dispatch, a = n.pending, o = t.memoizedState;
		if (a !== null) {
			n.pending = null;
			var s = a = a.next;
			do
				o = e(o, s.action), s = s.next;
			while (s !== a);
			pr(o, t.memoizedState) || (Qs = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
		}
		return [o, r];
	}
	function Po(e, t, n) {
		var r = J, a = To(), o = Ei;
		if (o) {
			if (n === void 0) throw Error(i(407));
			n = n();
		} else n = t();
		var s = !pr((ao || a).memoizedState, n);
		if (s && (a.memoizedState = n, Qs = !0), a = a.queue, as(Lo.bind(null, r, a, e), [e]), a.getSnapshot !== t || s || oo !== null && oo.memoizedState.tag & 1) {
			if (r.flags |= 2048, es(9, { destroy: void 0 }, Io.bind(null, r, a, n, t), null), Il === null) throw Error(i(349));
			o || io & 127 || Fo(r, t, n);
		}
		return n;
	}
	function Fo(e, t, n) {
		e.flags |= 16384, e = {
			getSnapshot: t,
			value: n
		}, t = J.updateQueue, t === null ? (t = Eo(), J.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
	}
	function Io(e, t, n, r) {
		t.value = n, t.getSnapshot = r, Ro(t) && zo(e);
	}
	function Lo(e, t, n) {
		return n(function() {
			Ro(t) && zo(e);
		});
	}
	function Ro(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !pr(e, n);
		} catch {
			return !0;
		}
	}
	function zo(e) {
		var t = Jr(e, 2);
		t !== null && mu(t, e, 2);
	}
	function Bo(e) {
		var t = wo();
		if (typeof e == "function") {
			var n = e;
			if (e = n(), lo) {
				je(!0);
				try {
					n();
				} finally {
					je(!1);
				}
			}
		}
		return t.memoizedState = t.baseState = e, t.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: Ao,
			lastRenderedState: e
		}, t;
	}
	function Vo(e, t, n, r) {
		return e.baseState = n, Mo(e, ao, typeof r == "function" ? r : Ao);
	}
	function Ho(e, t, n, r, a) {
		if (As(e)) throw Error(i(485));
		if (e = t.action, e !== null) {
			var o = {
				payload: a,
				action: e,
				next: null,
				isTransition: !0,
				status: "pending",
				value: null,
				reason: null,
				listeners: [],
				then: function(e) {
					o.listeners.push(e);
				}
			};
			I.T === null ? o.isTransition = !1 : n(!0), r(o), n = t.pending, n === null ? (o.next = t.pending = o, Uo(t, o)) : (o.next = n.next, t.pending = n.next = o);
		}
	}
	function Uo(e, t) {
		var n = t.action, r = t.payload, i = e.state;
		if (t.isTransition) {
			var a = I.T, o = {};
			I.T = o;
			try {
				var s = n(i, r), c = I.S;
				c !== null && c(o, s), Wo(e, t, s);
			} catch (n) {
				Ko(e, t, n);
			} finally {
				a !== null && o.types !== null && (a.types = o.types), I.T = a;
			}
		} else try {
			a = n(i, r), Wo(e, t, a);
		} catch (n) {
			Ko(e, t, n);
		}
	}
	function Wo(e, t, n) {
		typeof n == "object" && n && typeof n.then == "function" ? n.then(function(n) {
			Go(e, t, n);
		}, function(n) {
			return Ko(e, t, n);
		}) : Go(e, t, n);
	}
	function Go(e, t, n) {
		t.status = "fulfilled", t.value = n, qo(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, Uo(e, n)));
	}
	function Ko(e, t, n) {
		var r = e.pending;
		if (e.pending = null, r !== null) {
			r = r.next;
			do
				t.status = "rejected", t.reason = n, qo(t), t = t.next;
			while (t !== r);
		}
		e.action = null;
	}
	function qo(e) {
		e = e.listeners;
		for (var t = 0; t < e.length; t++) (0, e[t])();
	}
	function Jo(e, t) {
		return t;
	}
	function Yo(e, t) {
		if (Ei) {
			var n = Il.formState;
			if (n !== null) {
				a: {
					var r = J;
					if (Ei) {
						if (Ti) {
							b: {
								for (var i = Ti, a = Oi; i.nodeType !== 8;) {
									if (!a) {
										i = null;
										break b;
									}
									if (i = cf(i.nextSibling), i === null) {
										i = null;
										break b;
									}
								}
								a = i.data, i = a === "F!" || a === "F" ? i : null;
							}
							if (i) {
								Ti = cf(i.nextSibling), r = i.data === "F!";
								break a;
							}
						}
						Ai(r);
					}
					r = !1;
				}
				r && (t = n[0]);
			}
		}
		return n = wo(), n.memoizedState = n.baseState = t, r = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: Jo,
			lastRenderedState: t
		}, n.queue = r, n = Ds.bind(null, J, r), r.dispatch = n, r = Bo(!1), a = ks.bind(null, J, !1, r.queue), r = wo(), i = {
			state: t,
			dispatch: null,
			action: e,
			pending: null
		}, r.queue = i, n = Ho.bind(null, J, i, a, n), i.dispatch = n, r.memoizedState = e, [
			t,
			n,
			!1
		];
	}
	function Xo(e) {
		return Zo(To(), ao, e);
	}
	function Zo(e, t, n) {
		if (t = Mo(e, t, Jo)[0], e = jo(Ao)[0], typeof t == "object" && t && typeof t.then == "function") try {
			var r = Do(t);
		} catch (e) {
			throw e === ma ? ga : e;
		}
		else r = t;
		t = To();
		var i = t.queue, a = i.dispatch;
		return n !== t.memoizedState && (J.flags |= 2048, es(9, { destroy: void 0 }, Qo.bind(null, i, n), null)), [
			r,
			a,
			e
		];
	}
	function Qo(e, t) {
		e.action = t;
	}
	function $o(e) {
		var t = To(), n = ao;
		if (n !== null) return Zo(t, n, e);
		To(), t = t.memoizedState, n = To();
		var r = n.queue.dispatch;
		return n.memoizedState = e, [
			t,
			r,
			!1
		];
	}
	function es(e, t, n, r) {
		return e = {
			tag: e,
			create: n,
			deps: r,
			inst: t,
			next: null
		}, t = J.updateQueue, t === null && (t = Eo(), J.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
	}
	function ts() {
		return To().memoizedState;
	}
	function ns(e, t, n, r) {
		var i = wo();
		J.flags |= e, i.memoizedState = es(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r);
	}
	function rs(e, t, n, r) {
		var i = To();
		r = r === void 0 ? null : r;
		var a = i.memoizedState.inst;
		ao !== null && r !== null && go(r, ao.memoizedState.deps) ? i.memoizedState = es(t, a, n, r) : (J.flags |= e, i.memoizedState = es(1 | t, a, n, r));
	}
	function is(e, t) {
		ns(8390656, 8, e, t);
	}
	function as(e, t) {
		rs(2048, 8, e, t);
	}
	function os(e) {
		J.flags |= 4;
		var t = J.updateQueue;
		if (t === null) t = Eo(), J.updateQueue = t, t.events = [e];
		else {
			var n = t.events;
			n === null ? t.events = [e] : n.push(e);
		}
	}
	function ss(e) {
		var t = To().memoizedState;
		return os({
			ref: t,
			nextImpl: e
		}), function() {
			if (Fl & 2) throw Error(i(440));
			return t.impl.apply(void 0, arguments);
		};
	}
	function cs(e, t) {
		return rs(4, 2, e, t);
	}
	function ls(e, t) {
		return rs(4, 4, e, t);
	}
	function us(e, t) {
		if (typeof t == "function") {
			e = e();
			var n = t(e);
			return function() {
				typeof n == "function" ? n() : t(null);
			};
		}
		if (t != null) return e = e(), t.current = e, function() {
			t.current = null;
		};
	}
	function ds(e, t, n) {
		n = n == null ? null : n.concat([e]), rs(4, 4, us.bind(null, t, e), n);
	}
	function fs() {}
	function ps(e, t) {
		var n = To();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		return t !== null && go(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
	}
	function ms(e, t) {
		var n = To();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		if (t !== null && go(t, r[1])) return r[0];
		if (r = e(), lo) {
			je(!0);
			try {
				e();
			} finally {
				je(!1);
			}
		}
		return n.memoizedState = [r, t], r;
	}
	function hs(e, t, n) {
		return n === void 0 || io & 1073741824 && !(Z & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = pu(), J.lanes |= e, Wl |= e, n);
	}
	function gs(e, t, n, r) {
		return pr(n, t) ? n : Wa.current === null ? !(io & 42) || io & 1073741824 && !(Z & 261930) ? (Qs = !0, e.memoizedState = n) : (e = pu(), J.lanes |= e, Wl |= e, t) : (e = hs(e, n, r), pr(e, t) || (Qs = !0), e);
	}
	function _s(e, t, n, r, i) {
		var a = L.p;
		L.p = a !== 0 && 8 > a ? a : 8;
		var o = I.T, s = {};
		I.T = s, ks(e, !1, t, n);
		try {
			var c = i(), l = I.S;
			l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function" ? Os(e, t, ca(c, r), fu(e)) : Os(e, t, r, fu(e));
		} catch (n) {
			Os(e, t, {
				then: function() {},
				status: "rejected",
				reason: n
			}, fu());
		} finally {
			L.p = a, o !== null && s.types !== null && (o.types = s.types), I.T = o;
		}
	}
	function vs() {}
	function ys(e, t, n, r) {
		if (e.tag !== 5) throw Error(i(476));
		var a = bs(e).queue;
		_s(e, a, t, R, n === null ? vs : function() {
			return xs(e), n(r);
		});
	}
	function bs(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: R,
			baseState: R,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: Ao,
				lastRenderedState: R
			},
			next: null
		};
		var n = {};
		return t.next = {
			memoizedState: n,
			baseState: n,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: Ao,
				lastRenderedState: n
			},
			next: null
		}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
	}
	function xs(e) {
		var t = bs(e);
		t.next === null && (t = e.alternate.memoizedState), Os(e, t.next.queue, {}, fu());
	}
	function Ss() {
		return qi(Qf);
	}
	function Cs() {
		return To().memoizedState;
	}
	function ws() {
		return To().memoizedState;
	}
	function Ts(e) {
		for (var t = e.return; t !== null;) {
			switch (t.tag) {
				case 24:
				case 3:
					var n = fu();
					e = Fa(n);
					var r = Ia(t, e, n);
					r !== null && (mu(r, t, n), La(r, t, n)), t = { cache: ea() }, e.payload = t;
					return;
			}
			t = t.return;
		}
	}
	function Es(e, t, n) {
		var r = fu();
		n = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, As(e) ? js(t, n) : (n = qr(e, t, n, r), n !== null && (mu(n, e, r), Ms(n, t, r)));
	}
	function Ds(e, t, n) {
		Os(e, t, n, fu());
	}
	function Os(e, t, n, r) {
		var i = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (As(e)) js(t, i);
		else {
			var a = e.alternate;
			if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
				var o = t.lastRenderedState, s = a(o, n);
				if (i.hasEagerState = !0, i.eagerState = s, pr(s, o)) return Kr(e, t, i, 0), Il === null && Gr(), !1;
			} catch {}
			if (n = qr(e, t, i, r), n !== null) return mu(n, e, r), Ms(n, t, r), !0;
		}
		return !1;
	}
	function ks(e, t, n, r) {
		if (r = {
			lane: 2,
			revertLane: dd(),
			gesture: null,
			action: r,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, As(e)) {
			if (t) throw Error(i(479));
		} else t = qr(e, n, r, 2), t !== null && mu(t, e, 2);
	}
	function As(e) {
		var t = e.alternate;
		return e === J || t !== null && t === J;
	}
	function js(e, t) {
		co = so = !0;
		var n = e.pending;
		n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
	}
	function Ms(e, t, n) {
		if (n & 4194048) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, Je(e, n);
		}
	}
	var Ns = {
		readContext: qi,
		use: Oo,
		useCallback: ho,
		useContext: ho,
		useEffect: ho,
		useImperativeHandle: ho,
		useLayoutEffect: ho,
		useInsertionEffect: ho,
		useMemo: ho,
		useReducer: ho,
		useRef: ho,
		useState: ho,
		useDebugValue: ho,
		useDeferredValue: ho,
		useTransition: ho,
		useSyncExternalStore: ho,
		useId: ho,
		useHostTransitionStatus: ho,
		useFormState: ho,
		useActionState: ho,
		useOptimistic: ho,
		useMemoCache: ho,
		useCacheRefresh: ho
	};
	Ns.useEffectEvent = ho;
	var Ps = {
		readContext: qi,
		use: Oo,
		useCallback: function(e, t) {
			return wo().memoizedState = [e, t === void 0 ? null : t], e;
		},
		useContext: qi,
		useEffect: is,
		useImperativeHandle: function(e, t, n) {
			n = n == null ? null : n.concat([e]), ns(4194308, 4, us.bind(null, t, e), n);
		},
		useLayoutEffect: function(e, t) {
			return ns(4194308, 4, e, t);
		},
		useInsertionEffect: function(e, t) {
			ns(4, 2, e, t);
		},
		useMemo: function(e, t) {
			var n = wo();
			t = t === void 0 ? null : t;
			var r = e();
			if (lo) {
				je(!0);
				try {
					e();
				} finally {
					je(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		},
		useReducer: function(e, t, n) {
			var r = wo();
			if (n !== void 0) {
				var i = n(t);
				if (lo) {
					je(!0);
					try {
						n(t);
					} finally {
						je(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = Es.bind(null, J, e), [r.memoizedState, e];
		},
		useRef: function(e) {
			var t = wo();
			return e = { current: e }, t.memoizedState = e;
		},
		useState: function(e) {
			e = Bo(e);
			var t = e.queue, n = Ds.bind(null, J, t);
			return t.dispatch = n, [e.memoizedState, n];
		},
		useDebugValue: fs,
		useDeferredValue: function(e, t) {
			return hs(wo(), e, t);
		},
		useTransition: function() {
			var e = Bo(!1);
			return e = _s.bind(null, J, e.queue, !0, !1), wo().memoizedState = e, [!1, e];
		},
		useSyncExternalStore: function(e, t, n) {
			var r = J, a = wo();
			if (Ei) {
				if (n === void 0) throw Error(i(407));
				n = n();
			} else {
				if (n = t(), Il === null) throw Error(i(349));
				Z & 127 || Fo(r, t, n);
			}
			a.memoizedState = n;
			var o = {
				value: n,
				getSnapshot: t
			};
			return a.queue = o, is(Lo.bind(null, r, o, e), [e]), r.flags |= 2048, es(9, { destroy: void 0 }, Io.bind(null, r, o, n, t), null), n;
		},
		useId: function() {
			var e = wo(), t = Il.identifierPrefix;
			if (Ei) {
				var n = vi, r = _i;
				n = (r & ~(1 << 32 - Me(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = uo++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = mo++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		},
		useHostTransitionStatus: Ss,
		useFormState: Yo,
		useActionState: Yo,
		useOptimistic: function(e) {
			var t = wo();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = ks.bind(null, J, !0, n), n.dispatch = t, [e, t];
		},
		useMemoCache: ko,
		useCacheRefresh: function() {
			return wo().memoizedState = Ts.bind(null, J);
		},
		useEffectEvent: function(e) {
			var t = wo(), n = { impl: e };
			return t.memoizedState = n, function() {
				if (Fl & 2) throw Error(i(440));
				return n.impl.apply(void 0, arguments);
			};
		}
	}, Fs = {
		readContext: qi,
		use: Oo,
		useCallback: ps,
		useContext: qi,
		useEffect: as,
		useImperativeHandle: ds,
		useInsertionEffect: cs,
		useLayoutEffect: ls,
		useMemo: ms,
		useReducer: jo,
		useRef: ts,
		useState: function() {
			return jo(Ao);
		},
		useDebugValue: fs,
		useDeferredValue: function(e, t) {
			return gs(To(), ao.memoizedState, e, t);
		},
		useTransition: function() {
			var e = jo(Ao)[0], t = To().memoizedState;
			return [typeof e == "boolean" ? e : Do(e), t];
		},
		useSyncExternalStore: Po,
		useId: Cs,
		useHostTransitionStatus: Ss,
		useFormState: Xo,
		useActionState: Xo,
		useOptimistic: function(e, t) {
			return Vo(To(), ao, e, t);
		},
		useMemoCache: ko,
		useCacheRefresh: ws
	};
	Fs.useEffectEvent = ss;
	var Is = {
		readContext: qi,
		use: Oo,
		useCallback: ps,
		useContext: qi,
		useEffect: as,
		useImperativeHandle: ds,
		useInsertionEffect: cs,
		useLayoutEffect: ls,
		useMemo: ms,
		useReducer: No,
		useRef: ts,
		useState: function() {
			return No(Ao);
		},
		useDebugValue: fs,
		useDeferredValue: function(e, t) {
			var n = To();
			return ao === null ? hs(n, e, t) : gs(n, ao.memoizedState, e, t);
		},
		useTransition: function() {
			var e = No(Ao)[0], t = To().memoizedState;
			return [typeof e == "boolean" ? e : Do(e), t];
		},
		useSyncExternalStore: Po,
		useId: Cs,
		useHostTransitionStatus: Ss,
		useFormState: $o,
		useActionState: $o,
		useOptimistic: function(e, t) {
			var n = To();
			return ao === null ? (n.baseState = e, [e, n.queue.dispatch]) : Vo(n, ao, e, t);
		},
		useMemoCache: ko,
		useCacheRefresh: ws
	};
	Is.useEffectEvent = ss;
	function Ls(e, t, n, r) {
		t = e.memoizedState, n = n(r, t), n = n == null ? t : h({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
	}
	var Rs = {
		enqueueSetState: function(e, t, n) {
			e = e._reactInternals;
			var r = fu(), i = Fa(r);
			i.payload = t, n != null && (i.callback = n), t = Ia(e, i, r), t !== null && (mu(t, e, r), La(t, e, r));
		},
		enqueueReplaceState: function(e, t, n) {
			e = e._reactInternals;
			var r = fu(), i = Fa(r);
			i.tag = 1, i.payload = t, n != null && (i.callback = n), t = Ia(e, i, r), t !== null && (mu(t, e, r), La(t, e, r));
		},
		enqueueForceUpdate: function(e, t) {
			e = e._reactInternals;
			var n = fu(), r = Fa(n);
			r.tag = 2, t != null && (r.callback = t), t = Ia(e, r, n), t !== null && (mu(t, e, n), La(t, e, n));
		}
	};
	function zs(e, t, n, r, i, a, o) {
		return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !mr(n, r) || !mr(i, a) : !0;
	}
	function Bs(e, t, n, r) {
		e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && Rs.enqueueReplaceState(t, t.state, null);
	}
	function Vs(e, t) {
		var n = t;
		if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
		if (e = e.defaultProps) for (var i in n === t && (n = h({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
		return n;
	}
	function Hs(e) {
		Vr(e);
	}
	function Us(e) {
		console.error(e);
	}
	function Ws(e) {
		Vr(e);
	}
	function Gs(e, t) {
		try {
			var n = e.onUncaughtError;
			n(t.value, { componentStack: t.stack });
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function Ks(e, t, n) {
		try {
			var r = e.onCaughtError;
			r(n.value, {
				componentStack: n.stack,
				errorBoundary: t.tag === 1 ? t.stateNode : null
			});
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function qs(e, t, n) {
		return n = Fa(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
			Gs(e, t);
		}, n;
	}
	function Js(e) {
		return e = Fa(e), e.tag = 3, e;
	}
	function Ys(e, t, n, r) {
		var i = n.type.getDerivedStateFromError;
		if (typeof i == "function") {
			var a = r.value;
			e.payload = function() {
				return i(a);
			}, e.callback = function() {
				Ks(t, n, r);
			};
		}
		var o = n.stateNode;
		o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
			Ks(t, n, r), typeof i != "function" && (nu === null ? nu = new Set([this]) : nu.add(this));
			var e = r.stack;
			this.componentDidCatch(r.value, { componentStack: e === null ? "" : e });
		});
	}
	function Xs(e, t, n, r, a) {
		if (n.flags |= 32768, typeof r == "object" && r && typeof r.then == "function") {
			if (t = n.alternate, t !== null && Wi(t, n, a, !0), n = Ya.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13: return Xa === null ? Eu() : n.alternate === null && Ul === 0 && (Ul = 3), n.flags &= -257, n.flags |= 65536, n.lanes = a, r === _a ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = new Set([r]) : t.add(r), Gu(e, r, a)), !1;
					case 22: return n.flags |= 65536, r === _a ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
						transitions: null,
						markerInstances: null,
						retryQueue: new Set([r])
					}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = new Set([r]) : n.add(r)), Gu(e, r, a)), !1;
				}
				throw Error(i(435, n.tag));
			}
			return Gu(e, r, a), Eu(), !1;
		}
		if (Ei) return t = Ya.current, t === null ? (r !== ki && (t = Error(i(423), { cause: r }), Ii(li(t, n))), e = e.current.alternate, e.flags |= 65536, a &= -a, e.lanes |= a, r = li(r, n), a = qs(e.stateNode, r, a), Ra(e, a), Ul !== 4 && (Ul = 2)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = a, r !== ki && (e = Error(i(422), { cause: r }), Ii(li(e, n)))), !1;
		var o = Error(i(520), { cause: r });
		if (o = li(o, n), Yl === null ? Yl = [o] : Yl.push(o), Ul !== 4 && (Ul = 2), t === null) return !0;
		r = li(r, n), n = t;
		do {
			switch (n.tag) {
				case 3: return n.flags |= 65536, e = a & -a, n.lanes |= e, e = qs(n.stateNode, r, e), Ra(n, e), !1;
				case 1: if (t = n.type, o = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (nu === null || !nu.has(o)))) return n.flags |= 65536, a &= -a, n.lanes |= a, a = Js(a), Ys(a, e, n, r), Ra(n, a), !1;
			}
			n = n.return;
		} while (n !== null);
		return !1;
	}
	var Zs = Error(i(461)), Qs = !1;
	function $s(e, t, n, r) {
		t.child = e === null ? ja(t, null, n, r) : Aa(t, e.child, n, r);
	}
	function ec(e, t, n, r, i) {
		n = n.render;
		var a = t.ref;
		if ("ref" in r) {
			var o = {};
			for (var s in r) s !== "ref" && (o[s] = r[s]);
		} else o = r;
		return Ki(t), r = _o(e, t, n, o, a, i), s = xo(), e !== null && !Qs ? (So(e, t, i), wc(e, t, i)) : (Ei && s && xi(t), t.flags |= 1, $s(e, t, r, i), t.child);
	}
	function tc(e, t, n, r, i) {
		if (e === null) {
			var a = n.type;
			return typeof a == "function" && !ei(a) && a.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = a, nc(e, t, a, r, i)) : (e = ri(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
		}
		if (a = e.child, !Tc(e, i)) {
			var o = a.memoizedProps;
			if (n = n.compare, n = n === null ? mr : n, n(o, r) && e.ref === t.ref) return wc(e, t, i);
		}
		return t.flags |= 1, e = ti(a, r), e.ref = t.ref, e.return = t, t.child = e;
	}
	function nc(e, t, n, r, i) {
		if (e !== null) {
			var a = e.memoizedProps;
			if (mr(a, r) && e.ref === t.ref) if (Qs = !1, t.pendingProps = r = a, Tc(e, i)) e.flags & 131072 && (Qs = !0);
			else return t.lanes = e.lanes, wc(e, t, i);
		}
		return uc(e, t, n, r, i);
	}
	function rc(e, t, n, r) {
		var i = r.children, a = e === null ? null : e.memoizedState;
		if (e === null && t.stateNode === null && (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), r.mode === "hidden") {
			if (t.flags & 128) {
				if (a = a === null ? n : a.baseLanes | n, e !== null) {
					for (r = t.child = e.child, i = 0; r !== null;) i = i | r.lanes | r.childLanes, r = r.sibling;
					r = i & ~a;
				} else r = 0, t.child = null;
				return ac(e, t, a, n, r);
			}
			if (n & 536870912) t.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, e !== null && fa(t, a === null ? null : a.cachePool), a === null ? qa() : Ka(t, a), $a(t);
			else return r = t.lanes = 536870912, ac(e, t, a === null ? n : a.baseLanes | n, n, r);
		} else a === null ? (e !== null && fa(t, null), qa(), eo(t)) : (fa(t, a.cachePool), Ka(t, a), eo(t), t.memoizedState = null);
		return $s(e, t, i, n), t.child;
	}
	function ic(e, t) {
		return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), t.sibling;
	}
	function ac(e, t, n, r, i) {
		var a = da();
		return a = a === null ? null : {
			parent: $i._currentValue,
			pool: a
		}, t.memoizedState = {
			baseLanes: n,
			cachePool: a
		}, e !== null && fa(t, null), qa(), $a(t), e !== null && Wi(e, t, r, !0), t.childLanes = i, null;
	}
	function oc(e, t) {
		return t = yc({
			mode: t.mode,
			children: t.children
		}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
	}
	function sc(e, t, n) {
		return Aa(t, e.child, null, n), e = oc(t, t.pendingProps), e.flags |= 2, to(t), t.memoizedState = null, e;
	}
	function cc(e, t, n) {
		var r = t.pendingProps, a = (t.flags & 128) != 0;
		if (t.flags &= -129, e === null) {
			if (Ei) {
				if (r.mode === "hidden") return e = oc(t, r), t.lanes = 536870912, ic(null, e);
				if (Qa(t), (e = Ti) ? (e = rf(e, Oi), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: gi === null ? null : {
						id: _i,
						overflow: vi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = oi(e), n.return = t, t.child = n, wi = t, Ti = null)) : e = null, e === null) throw Ai(t);
				return t.lanes = 536870912, null;
			}
			return oc(t, r);
		}
		var o = e.memoizedState;
		if (o !== null) {
			var s = o.dehydrated;
			if (Qa(t), a) if (t.flags & 256) t.flags &= -257, t = sc(e, t, n);
			else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
			else throw Error(i(558));
			else if (Qs || Wi(e, t, n, !1), a = (n & e.childLanes) !== 0, Qs || a) {
				if (r = Il, r !== null && (s = Ye(r, n), s !== 0 && s !== o.retryLane)) throw o.retryLane = s, Jr(e, s), mu(r, e, s), Zs;
				Eu(), t = sc(e, t, n);
			} else e = o.treeContext, Ti = cf(s.nextSibling), wi = t, Ei = !0, Di = null, Oi = !1, e !== null && Ci(t, e), t = oc(t, r), t.flags |= 4096;
			return t;
		}
		return e = ti(e.child, {
			mode: r.mode,
			children: r.children
		}), e.ref = t.ref, t.child = e, e.return = t, e;
	}
	function lc(e, t) {
		var n = t.ref;
		if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
		else {
			if (typeof n != "function" && typeof n != "object") throw Error(i(284));
			(e === null || e.ref !== n) && (t.flags |= 4194816);
		}
	}
	function uc(e, t, n, r, i) {
		return Ki(t), n = _o(e, t, n, r, void 0, i), r = xo(), e !== null && !Qs ? (So(e, t, i), wc(e, t, i)) : (Ei && r && xi(t), t.flags |= 1, $s(e, t, n, i), t.child);
	}
	function dc(e, t, n, r, i, a) {
		return Ki(t), t.updateQueue = null, n = yo(t, r, n, i), vo(e), r = xo(), e !== null && !Qs ? (So(e, t, a), wc(e, t, a)) : (Ei && r && xi(t), t.flags |= 1, $s(e, t, n, a), t.child);
	}
	function fc(e, t, n, r, i) {
		if (Ki(t), t.stateNode === null) {
			var a = Zr, o = n.contextType;
			typeof o == "object" && o && (a = qi(o)), a = new n(r, a), t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = Rs, t.stateNode = a, a._reactInternals = t, a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, Na(t), o = n.contextType, a.context = typeof o == "object" && o ? qi(o) : Zr, a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (Ls(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && Rs.enqueueReplaceState(a, a.state, null), Va(t, r, a, i), Ba(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
		} else if (e === null) {
			a = t.stateNode;
			var s = t.memoizedProps, c = Vs(n, s);
			a.props = c;
			var l = a.context, u = n.contextType;
			o = Zr, typeof u == "object" && u && (o = qi(u));
			var d = n.getDerivedStateFromProps;
			u = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, u || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (s || l !== o) && Bs(t, a, r, o), Ma = !1;
			var f = t.memoizedState;
			a.state = f, Va(t, r, a, i), Ba(), l = t.memoizedState, s || f !== l || Ma ? (typeof d == "function" && (Ls(t, n, d, r), l = t.memoizedState), (c = Ma || zs(t, n, c, r, f, l, o)) ? (u || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = o, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
		} else {
			a = t.stateNode, Pa(e, t), o = t.memoizedProps, u = Vs(n, o), a.props = u, d = t.pendingProps, f = a.context, l = n.contextType, c = Zr, typeof l == "object" && l && (c = qi(l)), s = n.getDerivedStateFromProps, (l = typeof s == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== d || f !== c) && Bs(t, a, r, c), Ma = !1, f = t.memoizedState, a.state = f, Va(t, r, a, i), Ba();
			var p = t.memoizedState;
			o !== d || f !== p || Ma || e !== null && e.dependencies !== null && Gi(e.dependencies) ? (typeof s == "function" && (Ls(t, n, s, r), p = t.memoizedState), (u = Ma || zs(t, n, u, r, f, p, c) || e !== null && e.dependencies !== null && Gi(e.dependencies)) ? (l || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, p, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, p, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = c, r = u) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), r = !1);
		}
		return a = r, lc(e, t), r = (t.flags & 128) != 0, a || r ? (a = t.stateNode, n = r && typeof n.getDerivedStateFromError != "function" ? null : a.render(), t.flags |= 1, e !== null && r ? (t.child = Aa(t, e.child, null, i), t.child = Aa(t, null, n, i)) : $s(e, t, n, i), t.memoizedState = a.state, e = t.child) : e = wc(e, t, i), e;
	}
	function pc(e, t, n, r) {
		return Pi(), t.flags |= 256, $s(e, t, n, r), t.child;
	}
	var mc = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function hc(e) {
		return {
			baseLanes: e,
			cachePool: pa()
		};
	}
	function gc(e, t, n) {
		return e = e === null ? 0 : e.childLanes & ~n, t && (e |= ql), e;
	}
	function _c(e, t, n) {
		var r = t.pendingProps, a = !1, o = (t.flags & 128) != 0, s;
		if ((s = o) || (s = e !== null && e.memoizedState === null ? !1 : (no.current & 2) != 0), s && (a = !0, t.flags &= -129), s = (t.flags & 32) != 0, t.flags &= -33, e === null) {
			if (Ei) {
				if (a ? Za(t) : eo(t), (e = Ti) ? (e = rf(e, Oi), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: gi === null ? null : {
						id: _i,
						overflow: vi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = oi(e), n.return = t, t.child = n, wi = t, Ti = null)) : e = null, e === null) throw Ai(t);
				return of(e) ? t.lanes = 32 : t.lanes = 536870912, null;
			}
			var c = r.children;
			return r = r.fallback, a ? (eo(t), a = t.mode, c = yc({
				mode: "hidden",
				children: c
			}, a), r = ii(r, a, n, null), c.return = t, r.return = t, c.sibling = r, t.child = c, r = t.child, r.memoizedState = hc(n), r.childLanes = gc(e, s, n), t.memoizedState = mc, ic(null, r)) : (Za(t), vc(t, c));
		}
		var l = e.memoizedState;
		if (l !== null && (c = l.dehydrated, c !== null)) {
			if (o) t.flags & 256 ? (Za(t), t.flags &= -257, t = bc(e, t, n)) : t.memoizedState === null ? (eo(t), c = r.fallback, a = t.mode, r = yc({
				mode: "visible",
				children: r.children
			}, a), c = ii(c, a, n, null), c.flags |= 2, r.return = t, c.return = t, r.sibling = c, t.child = r, Aa(t, e.child, null, n), r = t.child, r.memoizedState = hc(n), r.childLanes = gc(e, s, n), t.memoizedState = mc, t = ic(null, r)) : (eo(t), t.child = e.child, t.flags |= 128, t = null);
			else if (Za(t), of(c)) {
				if (s = c.nextSibling && c.nextSibling.dataset, s) var u = s.dgst;
				s = u, r = Error(i(419)), r.stack = "", r.digest = s, Ii({
					value: r,
					source: null,
					stack: null
				}), t = bc(e, t, n);
			} else if (Qs || Wi(e, t, n, !1), s = (n & e.childLanes) !== 0, Qs || s) {
				if (s = Il, s !== null && (r = Ye(s, n), r !== 0 && r !== l.retryLane)) throw l.retryLane = r, Jr(e, r), mu(s, e, r), Zs;
				af(c) || Eu(), t = bc(e, t, n);
			} else af(c) ? (t.flags |= 192, t.child = e.child, t = null) : (e = l.treeContext, Ti = cf(c.nextSibling), wi = t, Ei = !0, Di = null, Oi = !1, e !== null && Ci(t, e), t = vc(t, r.children), t.flags |= 4096);
			return t;
		}
		return a ? (eo(t), c = r.fallback, a = t.mode, l = e.child, u = l.sibling, r = ti(l, {
			mode: "hidden",
			children: r.children
		}), r.subtreeFlags = l.subtreeFlags & 65011712, u === null ? (c = ii(c, a, n, null), c.flags |= 2) : c = ti(u, c), c.return = t, r.return = t, r.sibling = c, t.child = r, ic(null, r), r = t.child, c = e.child.memoizedState, c === null ? c = hc(n) : (a = c.cachePool, a === null ? a = pa() : (l = $i._currentValue, a = a.parent === l ? a : {
			parent: l,
			pool: l
		}), c = {
			baseLanes: c.baseLanes | n,
			cachePool: a
		}), r.memoizedState = c, r.childLanes = gc(e, s, n), t.memoizedState = mc, ic(e.child, r)) : (Za(t), n = e.child, e = n.sibling, n = ti(n, {
			mode: "visible",
			children: r.children
		}), n.return = t, n.sibling = null, e !== null && (s = t.deletions, s === null ? (t.deletions = [e], t.flags |= 16) : s.push(e)), t.child = n, t.memoizedState = null, n);
	}
	function vc(e, t) {
		return t = yc({
			mode: "visible",
			children: t
		}, e.mode), t.return = e, e.child = t;
	}
	function yc(e, t) {
		return e = $r(22, e, null, t), e.lanes = 0, e;
	}
	function bc(e, t, n) {
		return Aa(t, e.child, null, n), e = vc(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
	}
	function xc(e, t, n) {
		e.lanes |= t;
		var r = e.alternate;
		r !== null && (r.lanes |= t), Hi(e.return, t, n);
	}
	function Sc(e, t, n, r, i, a) {
		var o = e.memoizedState;
		o === null ? e.memoizedState = {
			isBackwards: t,
			rendering: null,
			renderingStartTime: 0,
			last: r,
			tail: n,
			tailMode: i,
			treeForkCount: a
		} : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = i, o.treeForkCount = a);
	}
	function Cc(e, t, n) {
		var r = t.pendingProps, i = r.revealOrder, a = r.tail;
		r = r.children;
		var o = no.current, s = (o & 2) != 0;
		if (s ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, V(no, o), $s(e, t, r, n), r = Ei ? pi : 0, !s && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
			if (e.tag === 13) e.memoizedState !== null && xc(e, n, t);
			else if (e.tag === 19) xc(e, n, t);
			else if (e.child !== null) {
				e.child.return = e, e = e.child;
				continue;
			}
			if (e === t) break a;
			for (; e.sibling === null;) {
				if (e.return === null || e.return === t) break a;
				e = e.return;
			}
			e.sibling.return = e.return, e = e.sibling;
		}
		switch (i) {
			case "forwards":
				for (n = t.child, i = null; n !== null;) e = n.alternate, e !== null && ro(e) === null && (i = n), n = n.sibling;
				n = i, n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), Sc(t, !1, i, n, a, r);
				break;
			case "backwards":
			case "unstable_legacy-backwards":
				for (n = null, i = t.child, t.child = null; i !== null;) {
					if (e = i.alternate, e !== null && ro(e) === null) {
						t.child = i;
						break;
					}
					e = i.sibling, i.sibling = n, n = i, i = e;
				}
				Sc(t, !0, n, null, a, r);
				break;
			case "together":
				Sc(t, !1, null, null, void 0, r);
				break;
			default: t.memoizedState = null;
		}
		return t.child;
	}
	function wc(e, t, n) {
		if (e !== null && (t.dependencies = e.dependencies), Wl |= t.lanes, (n & t.childLanes) === 0) if (e !== null) {
			if (Wi(e, t, n, !1), (n & t.childLanes) === 0) return null;
		} else return null;
		if (e !== null && t.child !== e.child) throw Error(i(153));
		if (t.child !== null) {
			for (e = t.child, n = ti(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = ti(e, e.pendingProps), n.return = t;
			n.sibling = null;
		}
		return t.child;
	}
	function Tc(e, t) {
		return (e.lanes & t) === 0 ? (e = e.dependencies, !!(e !== null && Gi(e))) : !0;
	}
	function Ec(e, t, n) {
		switch (t.tag) {
			case 3:
				ie(t, t.stateNode.containerInfo), Bi(t, $i, e.memoizedState.cache), Pi();
				break;
			case 27:
			case 5:
				oe(t);
				break;
			case 4:
				ie(t, t.stateNode.containerInfo);
				break;
			case 10:
				Bi(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return t.flags |= 128, Qa(t), null;
				break;
			case 13:
				var r = t.memoizedState;
				if (r !== null) return r.dehydrated === null ? (n & t.child.childLanes) === 0 ? (Za(t), e = wc(e, t, n), e === null ? null : e.sibling) : _c(e, t, n) : (Za(t), t.flags |= 128, null);
				Za(t);
				break;
			case 19:
				var i = (e.flags & 128) != 0;
				if (r = (n & t.childLanes) !== 0, r ||= (Wi(e, t, n, !1), (n & t.childLanes) !== 0), i) {
					if (r) return Cc(e, t, n);
					t.flags |= 128;
				}
				if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), V(no, no.current), r) break;
				return null;
			case 22: return t.lanes = 0, rc(e, t, n, t.pendingProps);
			case 24: Bi(t, $i, e.memoizedState.cache);
		}
		return wc(e, t, n);
	}
	function Dc(e, t, n) {
		if (e !== null) if (e.memoizedProps !== t.pendingProps) Qs = !0;
		else {
			if (!Tc(e, n) && !(t.flags & 128)) return Qs = !1, Ec(e, t, n);
			Qs = !!(e.flags & 131072);
		}
		else Qs = !1, Ei && t.flags & 1048576 && bi(t, pi, t.index);
		switch (t.lanes = 0, t.tag) {
			case 16:
				a: {
					var r = t.pendingProps;
					if (e = ba(t.elementType), t.type = e, typeof e == "function") ei(e) ? (r = Vs(e, r), t.tag = 1, t = fc(null, t, e, r, n)) : (t.tag = 0, t = uc(null, t, e, r, n));
					else {
						if (e != null) {
							var a = e.$$typeof;
							if (a === w) {
								t.tag = 11, t = ec(null, t, e, r, n);
								break a;
							} else if (a === D) {
								t.tag = 14, t = tc(null, t, e, r, n);
								break a;
							}
						}
						throw t = P(e) || e, Error(i(306, t, ""));
					}
				}
				return t;
			case 0: return uc(e, t, t.type, t.pendingProps, n);
			case 1: return r = t.type, a = Vs(r, t.pendingProps), fc(e, t, r, a, n);
			case 3:
				a: {
					if (ie(t, t.stateNode.containerInfo), e === null) throw Error(i(387));
					r = t.pendingProps;
					var o = t.memoizedState;
					a = o.element, Pa(e, t), Va(t, r, null, n);
					var s = t.memoizedState;
					if (r = s.cache, Bi(t, $i, r), r !== o.cache && Ui(t, [$i], n, !0), Ba(), r = s.element, o.isDehydrated) if (o = {
						element: r,
						isDehydrated: !1,
						cache: s.cache
					}, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
						t = pc(e, t, r, n);
						break a;
					} else if (r !== a) {
						a = li(Error(i(424)), t), Ii(a), t = pc(e, t, r, n);
						break a;
					} else {
						switch (e = t.stateNode.containerInfo, e.nodeType) {
							case 9:
								e = e.body;
								break;
							default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
						}
						for (Ti = cf(e.firstChild), wi = t, Ei = !0, Di = null, Oi = !0, n = ja(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 4096, n = n.sibling;
					}
					else {
						if (Pi(), r === a) {
							t = wc(e, t, n);
							break a;
						}
						$s(e, t, r, n);
					}
					t = t.child;
				}
				return t;
			case 26: return lc(e, t), e === null ? (n = kf(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : Ei || (n = t.type, e = t.pendingProps, r = Bd(U.current).createElement(n), r[tt] = t, r[nt] = e, Pd(r, n, e), pt(r), t.stateNode = r) : t.memoizedState = kf(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
			case 27: return oe(t), e === null && Ei && (r = t.stateNode = ff(t.type, t.pendingProps, U.current), wi = t, Oi = !0, a = Ti, Zd(t.type) ? (lf = a, Ti = cf(r.firstChild)) : Ti = a), $s(e, t, t.pendingProps.children, n), lc(e, t), e === null && (t.flags |= 4194304), t.child;
			case 5: return e === null && Ei && ((a = r = Ti) && (r = tf(r, t.type, t.pendingProps, Oi), r === null ? a = !1 : (t.stateNode = r, wi = t, Ti = cf(r.firstChild), Oi = !1, a = !0)), a || Ai(t)), oe(t), a = t.type, o = t.pendingProps, s = e === null ? null : e.memoizedProps, r = o.children, Ud(a, o) ? r = null : s !== null && Ud(a, s) && (t.flags |= 32), t.memoizedState !== null && (a = _o(e, t, bo, null, null, n), Qf._currentValue = a), lc(e, t), $s(e, t, r, n), t.child;
			case 6: return e === null && Ei && ((e = n = Ti) && (n = nf(n, t.pendingProps, Oi), n === null ? e = !1 : (t.stateNode = n, wi = t, Ti = null, e = !0)), e || Ai(t)), null;
			case 13: return _c(e, t, n);
			case 4: return ie(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = Aa(t, null, r, n) : $s(e, t, r, n), t.child;
			case 11: return ec(e, t, t.type, t.pendingProps, n);
			case 7: return $s(e, t, t.pendingProps, n), t.child;
			case 8: return $s(e, t, t.pendingProps.children, n), t.child;
			case 12: return $s(e, t, t.pendingProps.children, n), t.child;
			case 10: return r = t.pendingProps, Bi(t, t.type, r.value), $s(e, t, r.children, n), t.child;
			case 9: return a = t.type._context, r = t.pendingProps.children, Ki(t), a = qi(a), r = r(a), t.flags |= 1, $s(e, t, r, n), t.child;
			case 14: return tc(e, t, t.type, t.pendingProps, n);
			case 15: return nc(e, t, t.type, t.pendingProps, n);
			case 19: return Cc(e, t, n);
			case 31: return cc(e, t, n);
			case 22: return rc(e, t, n, t.pendingProps);
			case 24: return Ki(t), r = qi($i), e === null ? (a = da(), a === null && (a = Il, o = ea(), a.pooledCache = o, o.refCount++, o !== null && (a.pooledCacheLanes |= n), a = o), t.memoizedState = {
				parent: r,
				cache: a
			}, Na(t), Bi(t, $i, a)) : ((e.lanes & n) !== 0 && (Pa(e, t), Va(t, null, null, n), Ba()), a = e.memoizedState, o = t.memoizedState, a.parent === r ? (r = o.cache, Bi(t, $i, r), r !== a.cache && Ui(t, [$i], n, !0)) : (a = {
				parent: r,
				cache: r
			}, t.memoizedState = a, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = a), Bi(t, $i, r))), $s(e, t, t.pendingProps.children, n), t.child;
			case 29: throw t.pendingProps;
		}
		throw Error(i(156, t.tag));
	}
	function Y(e) {
		e.flags |= 4;
	}
	function Oc(e, t, n, r, i) {
		if ((t = (e.mode & 32) != 0) && (t = !1), t) {
			if (e.flags |= 16777216, (i & 335544128) === i) if (e.stateNode.complete) e.flags |= 8192;
			else if (Cu()) e.flags |= 8192;
			else throw xa = _a, ha;
		} else e.flags &= -16777217;
	}
	function kc(e, t) {
		if (t.type !== "stylesheet" || t.state.loading & 4) e.flags &= -16777217;
		else if (e.flags |= 16777216, !Wf(t)) if (Cu()) e.flags |= 8192;
		else throw xa = _a, ha;
	}
	function Ac(e, t) {
		t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : Ue(), e.lanes |= t, Jl |= t);
	}
	function jc(e, t) {
		if (!Ei) switch (e.tailMode) {
			case "hidden":
				t = e.tail;
				for (var n = null; t !== null;) t.alternate !== null && (n = t), t = t.sibling;
				n === null ? e.tail = null : n.sibling = null;
				break;
			case "collapsed":
				n = e.tail;
				for (var r = null; n !== null;) n.alternate !== null && (r = n), n = n.sibling;
				r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
		}
	}
	function Mc(e) {
		var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
		if (t) for (var i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 65011712, r |= i.flags & 65011712, i.return = e, i = i.sibling;
		else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
		return e.subtreeFlags |= r, e.childLanes = n, t;
	}
	function Nc(e, t, n) {
		var r = t.pendingProps;
		switch (Si(t), t.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return Mc(t), null;
			case 1: return Mc(t), null;
			case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), Vi($i), ae(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (Ni(t) ? Y(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, Fi())), Mc(t), null;
			case 26:
				var a = t.type, o = t.memoizedState;
				return e === null ? (Y(t), o === null ? (Mc(t), Oc(t, a, null, r, n)) : (Mc(t), kc(t, o))) : o ? o === e.memoizedState ? (Mc(t), t.flags &= -16777217) : (Y(t), Mc(t), kc(t, o)) : (e = e.memoizedProps, e !== r && Y(t), Mc(t), Oc(t, a, e, r, n)), null;
			case 27:
				if (se(t), n = U.current, a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && Y(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return Mc(t), null;
					}
					e = ne.current, Ni(t) ? ji(t, e) : (e = ff(a, r, n), t.stateNode = e, Y(t));
				}
				return Mc(t), null;
			case 5:
				if (se(t), a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && Y(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return Mc(t), null;
					}
					if (o = ne.current, Ni(t)) ji(t, o);
					else {
						var s = Bd(U.current);
						switch (o) {
							case 1:
								o = s.createElementNS("http://www.w3.org/2000/svg", a);
								break;
							case 2:
								o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
								break;
							default: switch (a) {
								case "svg":
									o = s.createElementNS("http://www.w3.org/2000/svg", a);
									break;
								case "math":
									o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
									break;
								case "script":
									o = s.createElement("div"), o.innerHTML = "<script><\/script>", o = o.removeChild(o.firstChild);
									break;
								case "select":
									o = typeof r.is == "string" ? s.createElement("select", { is: r.is }) : s.createElement("select"), r.multiple ? o.multiple = !0 : r.size && (o.size = r.size);
									break;
								default: o = typeof r.is == "string" ? s.createElement(a, { is: r.is }) : s.createElement(a);
							}
						}
						o[tt] = t, o[nt] = r;
						a: for (s = t.child; s !== null;) {
							if (s.tag === 5 || s.tag === 6) o.appendChild(s.stateNode);
							else if (s.tag !== 4 && s.tag !== 27 && s.child !== null) {
								s.child.return = s, s = s.child;
								continue;
							}
							if (s === t) break a;
							for (; s.sibling === null;) {
								if (s.return === null || s.return === t) break a;
								s = s.return;
							}
							s.sibling.return = s.return, s = s.sibling;
						}
						t.stateNode = o;
						a: switch (Pd(o, a, r), a) {
							case "button":
							case "input":
							case "select":
							case "textarea":
								r = !!r.autoFocus;
								break a;
							case "img":
								r = !0;
								break a;
							default: r = !1;
						}
						r && Y(t);
					}
				}
				return Mc(t), Oc(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== r && Y(t);
				else {
					if (typeof r != "string" && t.stateNode === null) throw Error(i(166));
					if (e = U.current, Ni(t)) {
						if (e = t.stateNode, n = t.memoizedProps, r = null, a = wi, a !== null) switch (a.tag) {
							case 27:
							case 5: r = a.memoizedProps;
						}
						e[tt] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || jd(e.nodeValue, n)), e || Ai(t, !0);
					} else e = Bd(e).createTextNode(r), e[tt] = t, t.stateNode = e;
				}
				return Mc(t), null;
			case 31:
				if (n = t.memoizedState, e === null || e.memoizedState !== null) {
					if (r = Ni(t), n !== null) {
						if (e === null) {
							if (!r) throw Error(i(318));
							if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(557));
							e[tt] = t;
						} else Pi(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						Mc(t), e = !1;
					} else n = Fi(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
					if (!e) return t.flags & 256 ? (to(t), t) : (to(t), null);
					if (t.flags & 128) throw Error(i(558));
				}
				return Mc(t), null;
			case 13:
				if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
					if (a = Ni(t), r !== null && r.dehydrated !== null) {
						if (e === null) {
							if (!a) throw Error(i(318));
							if (a = t.memoizedState, a = a === null ? null : a.dehydrated, !a) throw Error(i(317));
							a[tt] = t;
						} else Pi(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						Mc(t), a = !1;
					} else a = Fi(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), a = !0;
					if (!a) return t.flags & 256 ? (to(t), t) : (to(t), null);
				}
				return to(t), t.flags & 128 ? (t.lanes = n, t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, a = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (a = r.alternate.memoizedState.cachePool.pool), o = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (o = r.memoizedState.cachePool.pool), o !== a && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), Ac(t, t.updateQueue), Mc(t), null);
			case 4: return ae(), e === null && xd(t.stateNode.containerInfo), Mc(t), null;
			case 10: return Vi(t.type), Mc(t), null;
			case 19:
				if (B(no), r = t.memoizedState, r === null) return Mc(t), null;
				if (a = (t.flags & 128) != 0, o = r.rendering, o === null) if (a) jc(r, !1);
				else {
					if (Ul !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
						if (o = ro(e), o !== null) {
							for (t.flags |= 128, jc(r, !1), e = o.updateQueue, t.updateQueue = e, Ac(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) ni(n, e), n = n.sibling;
							return V(no, no.current & 1 | 2), Ei && yi(t, r.treeForkCount), t.child;
						}
						e = e.sibling;
					}
					r.tail !== null && be() > eu && (t.flags |= 128, a = !0, jc(r, !1), t.lanes = 4194304);
				}
				else {
					if (!a) if (e = ro(o), e !== null) {
						if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, Ac(t, e), jc(r, !0), r.tail === null && r.tailMode === "hidden" && !o.alternate && !Ei) return Mc(t), null;
					} else 2 * be() - r.renderingStartTime > eu && n !== 536870912 && (t.flags |= 128, a = !0, jc(r, !1), t.lanes = 4194304);
					r.isBackwards ? (o.sibling = t.child, t.child = o) : (e = r.last, e === null ? t.child = o : e.sibling = o, r.last = o);
				}
				return r.tail === null ? (Mc(t), null) : (e = r.tail, r.rendering = e, r.tail = e.sibling, r.renderingStartTime = be(), e.sibling = null, n = no.current, V(no, a ? n & 1 | 2 : n & 1), Ei && yi(t, r.treeForkCount), e);
			case 22:
			case 23: return to(t), Ja(), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (Mc(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Mc(t), n = t.updateQueue, n !== null && Ac(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && B(ua), null;
			case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), Vi($i), Mc(t), null;
			case 25: return null;
			case 30: return null;
		}
		throw Error(i(156, t.tag));
	}
	function Pc(e, t) {
		switch (Si(t), t.tag) {
			case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 3: return Vi($i), ae(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
			case 26:
			case 27:
			case 5: return se(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if (to(t), t.alternate === null) throw Error(i(340));
					Pi();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 13:
				if (to(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
					if (t.alternate === null) throw Error(i(340));
					Pi();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 19: return B(no), null;
			case 4: return ae(), null;
			case 10: return Vi(t.type), null;
			case 22:
			case 23: return to(t), Ja(), e !== null && B(ua), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 24: return Vi($i), null;
			case 25: return null;
			default: return null;
		}
	}
	function Fc(e, t) {
		switch (Si(t), t.tag) {
			case 3:
				Vi($i), ae();
				break;
			case 26:
			case 27:
			case 5:
				se(t);
				break;
			case 4:
				ae();
				break;
			case 31:
				t.memoizedState !== null && to(t);
				break;
			case 13:
				to(t);
				break;
			case 19:
				B(no);
				break;
			case 10:
				Vi(t.type);
				break;
			case 22:
			case 23:
				to(t), Ja(), e !== null && B(ua);
				break;
			case 24: Vi($i);
		}
	}
	function Ic(e, t) {
		try {
			var n = t.updateQueue, r = n === null ? null : n.lastEffect;
			if (r !== null) {
				var i = r.next;
				n = i;
				do {
					if ((n.tag & e) === e) {
						r = void 0;
						var a = n.create, o = n.inst;
						r = a(), o.destroy = r;
					}
					n = n.next;
				} while (n !== i);
			}
		} catch (e) {
			Wu(t, t.return, e);
		}
	}
	function Lc(e, t, n) {
		try {
			var r = t.updateQueue, i = r === null ? null : r.lastEffect;
			if (i !== null) {
				var a = i.next;
				r = a;
				do {
					if ((r.tag & e) === e) {
						var o = r.inst, s = o.destroy;
						if (s !== void 0) {
							o.destroy = void 0, i = t;
							var c = n, l = s;
							try {
								l();
							} catch (e) {
								Wu(i, c, e);
							}
						}
					}
					r = r.next;
				} while (r !== a);
			}
		} catch (e) {
			Wu(t, t.return, e);
		}
	}
	function Rc(e) {
		var t = e.updateQueue;
		if (t !== null) {
			var n = e.stateNode;
			try {
				Ua(t, n);
			} catch (t) {
				Wu(e, e.return, t);
			}
		}
	}
	function zc(e, t, n) {
		n.props = Vs(e.type, e.memoizedProps), n.state = e.memoizedState;
		try {
			n.componentWillUnmount();
		} catch (n) {
			Wu(e, t, n);
		}
	}
	function Bc(e, t) {
		try {
			var n = e.ref;
			if (n !== null) {
				switch (e.tag) {
					case 26:
					case 27:
					case 5:
						var r = e.stateNode;
						break;
					case 30:
						r = e.stateNode;
						break;
					default: r = e.stateNode;
				}
				typeof n == "function" ? e.refCleanup = n(r) : n.current = r;
			}
		} catch (n) {
			Wu(e, t, n);
		}
	}
	function Vc(e, t) {
		var n = e.ref, r = e.refCleanup;
		if (n !== null) if (typeof r == "function") try {
			r();
		} catch (n) {
			Wu(e, t, n);
		} finally {
			e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
		}
		else if (typeof n == "function") try {
			n(null);
		} catch (n) {
			Wu(e, t, n);
		}
		else n.current = null;
	}
	function Hc(e) {
		var t = e.type, n = e.memoizedProps, r = e.stateNode;
		try {
			a: switch (t) {
				case "button":
				case "input":
				case "select":
				case "textarea":
					n.autoFocus && r.focus();
					break a;
				case "img": n.src ? r.src = n.src : n.srcSet && (r.srcset = n.srcSet);
			}
		} catch (t) {
			Wu(e, e.return, t);
		}
	}
	function Uc(e, t, n) {
		try {
			var r = e.stateNode;
			Fd(r, e.type, n, t), r[nt] = t;
		} catch (t) {
			Wu(e, e.return, t);
		}
	}
	function Wc(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Zd(e.type) || e.tag === 4;
	}
	function Gc(e) {
		a: for (;;) {
			for (; e.sibling === null;) {
				if (e.return === null || Wc(e.return)) return null;
				e = e.return;
			}
			for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
				if (e.tag === 27 && Zd(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue a;
				e.child.return = e, e = e.child;
			}
			if (!(e.flags & 2)) return e.stateNode;
		}
	}
	function Kc(e, t, n) {
		var r = e.tag;
		if (r === 5 || r === 6) e = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(e, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(e), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = Gt));
		else if (r !== 4 && (r === 27 && Zd(e.type) && (n = e.stateNode, t = null), e = e.child, e !== null)) for (Kc(e, t, n), e = e.sibling; e !== null;) Kc(e, t, n), e = e.sibling;
	}
	function qc(e, t, n) {
		var r = e.tag;
		if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
		else if (r !== 4 && (r === 27 && Zd(e.type) && (n = e.stateNode), e = e.child, e !== null)) for (qc(e, t, n), e = e.sibling; e !== null;) qc(e, t, n), e = e.sibling;
	}
	function Jc(e) {
		var t = e.stateNode, n = e.memoizedProps;
		try {
			for (var r = e.type, i = t.attributes; i.length;) t.removeAttributeNode(i[0]);
			Pd(t, r, n), t[tt] = e, t[nt] = n;
		} catch (t) {
			Wu(e, e.return, t);
		}
	}
	var Yc = !1, Xc = !1, Zc = !1, Qc = typeof WeakSet == "function" ? WeakSet : Set, $c = null;
	function el(e, t) {
		if (e = e.containerInfo, Rd = sp, e = vr(e), yr(e)) {
			if ("selectionStart" in e) var n = {
				start: e.selectionStart,
				end: e.selectionEnd
			};
			else a: {
				n = (n = e.ownerDocument) && n.defaultView || window;
				var r = n.getSelection && n.getSelection();
				if (r && r.rangeCount !== 0) {
					n = r.anchorNode;
					var a = r.anchorOffset, o = r.focusNode;
					r = r.focusOffset;
					try {
						n.nodeType, o.nodeType;
					} catch {
						n = null;
						break a;
					}
					var s = 0, c = -1, l = -1, u = 0, d = 0, f = e, p = null;
					b: for (;;) {
						for (var m; f !== n || a !== 0 && f.nodeType !== 3 || (c = s + a), f !== o || r !== 0 && f.nodeType !== 3 || (l = s + r), f.nodeType === 3 && (s += f.nodeValue.length), (m = f.firstChild) !== null;) p = f, f = m;
						for (;;) {
							if (f === e) break b;
							if (p === n && ++u === a && (c = s), p === o && ++d === r && (l = s), (m = f.nextSibling) !== null) break;
							f = p, p = f.parentNode;
						}
						f = m;
					}
					n = c === -1 || l === -1 ? null : {
						start: c,
						end: l
					};
				} else n = null;
			}
			n ||= {
				start: 0,
				end: 0
			};
		} else n = null;
		for (zd = {
			focusedElem: e,
			selectionRange: n
		}, sp = !1, $c = t; $c !== null;) if (t = $c, e = t.child, t.subtreeFlags & 1028 && e !== null) e.return = t, $c = e;
		else for (; $c !== null;) {
			switch (t = $c, o = t.alternate, e = t.flags, t.tag) {
				case 0:
					if (e & 4 && (e = t.updateQueue, e = e === null ? null : e.events, e !== null)) for (n = 0; n < e.length; n++) a = e[n], a.ref.impl = a.nextImpl;
					break;
				case 11:
				case 15: break;
				case 1:
					if (e & 1024 && o !== null) {
						e = void 0, n = t, a = o.memoizedProps, o = o.memoizedState, r = n.stateNode;
						try {
							var h = Vs(n.type, a);
							e = r.getSnapshotBeforeUpdate(h, o), r.__reactInternalSnapshotBeforeUpdate = e;
						} catch (e) {
							Wu(n, n.return, e);
						}
					}
					break;
				case 3:
					if (e & 1024) {
						if (e = t.stateNode.containerInfo, n = e.nodeType, n === 9) ef(e);
						else if (n === 1) switch (e.nodeName) {
							case "HEAD":
							case "HTML":
							case "BODY":
								ef(e);
								break;
							default: e.textContent = "";
						}
					}
					break;
				case 5:
				case 26:
				case 27:
				case 6:
				case 4:
				case 17: break;
				default: if (e & 1024) throw Error(i(163));
			}
			if (e = t.sibling, e !== null) {
				e.return = t.return, $c = e;
				break;
			}
			$c = t.return;
		}
	}
	function tl(e, t, n) {
		var r = n.flags;
		switch (n.tag) {
			case 0:
			case 11:
			case 15:
				gl(e, n), r & 4 && Ic(5, n);
				break;
			case 1:
				if (gl(e, n), r & 4) if (e = n.stateNode, t === null) try {
					e.componentDidMount();
				} catch (e) {
					Wu(n, n.return, e);
				}
				else {
					var i = Vs(n.type, t.memoizedProps);
					t = t.memoizedState;
					try {
						e.componentDidUpdate(i, t, e.__reactInternalSnapshotBeforeUpdate);
					} catch (e) {
						Wu(n, n.return, e);
					}
				}
				r & 64 && Rc(n), r & 512 && Bc(n, n.return);
				break;
			case 3:
				if (gl(e, n), r & 64 && (e = n.updateQueue, e !== null)) {
					if (t = null, n.child !== null) switch (n.child.tag) {
						case 27:
						case 5:
							t = n.child.stateNode;
							break;
						case 1: t = n.child.stateNode;
					}
					try {
						Ua(e, t);
					} catch (e) {
						Wu(n, n.return, e);
					}
				}
				break;
			case 27: t === null && r & 4 && Jc(n);
			case 26:
			case 5:
				gl(e, n), t === null && r & 4 && Hc(n), r & 512 && Bc(n, n.return);
				break;
			case 12:
				gl(e, n);
				break;
			case 31:
				gl(e, n), r & 4 && sl(e, n);
				break;
			case 13:
				gl(e, n), r & 4 && cl(e, n), r & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = Ju.bind(null, n), sf(e, n))));
				break;
			case 22:
				if (r = n.memoizedState !== null || Yc, !r) {
					t = t !== null && t.memoizedState !== null || Xc, i = Yc;
					var a = Xc;
					Yc = r, (Xc = t) && !a ? vl(e, n, (n.subtreeFlags & 8772) != 0) : gl(e, n), Yc = i, Xc = a;
				}
				break;
			case 30: break;
			default: gl(e, n);
		}
	}
	function nl(e) {
		var t = e.alternate;
		t !== null && (e.alternate = null, nl(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && lt(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
	}
	var rl = null, il = !1;
	function al(e, t, n) {
		for (n = n.child; n !== null;) ol(e, t, n), n = n.sibling;
	}
	function ol(e, t, n) {
		if (Ae && typeof Ae.onCommitFiberUnmount == "function") try {
			Ae.onCommitFiberUnmount(ke, n);
		} catch {}
		switch (n.tag) {
			case 26:
				Xc || Vc(n, t), al(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && (n = n.stateNode, n.parentNode.removeChild(n));
				break;
			case 27:
				Xc || Vc(n, t);
				var r = rl, i = il;
				Zd(n.type) && (rl = n.stateNode, il = !1), al(e, t, n), pf(n.stateNode), rl = r, il = i;
				break;
			case 5: Xc || Vc(n, t);
			case 6:
				if (r = rl, i = il, rl = null, al(e, t, n), rl = r, il = i, rl !== null) if (il) try {
					(rl.nodeType === 9 ? rl.body : rl.nodeName === "HTML" ? rl.ownerDocument.body : rl).removeChild(n.stateNode);
				} catch (e) {
					Wu(n, t, e);
				}
				else try {
					rl.removeChild(n.stateNode);
				} catch (e) {
					Wu(n, t, e);
				}
				break;
			case 18:
				rl !== null && (il ? (e = rl, Qd(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), Np(e)) : Qd(rl, n.stateNode));
				break;
			case 4:
				r = rl, i = il, rl = n.stateNode.containerInfo, il = !0, al(e, t, n), rl = r, il = i;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				Lc(2, n, t), Xc || Lc(4, n, t), al(e, t, n);
				break;
			case 1:
				Xc || (Vc(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function" && zc(n, t, r)), al(e, t, n);
				break;
			case 21:
				al(e, t, n);
				break;
			case 22:
				Xc = (r = Xc) || n.memoizedState !== null, al(e, t, n), Xc = r;
				break;
			default: al(e, t, n);
		}
	}
	function sl(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
			e = e.dehydrated;
			try {
				Np(e);
			} catch (e) {
				Wu(t, t.return, e);
			}
		}
	}
	function cl(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
			Np(e);
		} catch (e) {
			Wu(t, t.return, e);
		}
	}
	function ll(e) {
		switch (e.tag) {
			case 31:
			case 13:
			case 19:
				var t = e.stateNode;
				return t === null && (t = e.stateNode = new Qc()), t;
			case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new Qc()), t;
			default: throw Error(i(435, e.tag));
		}
	}
	function ul(e, t) {
		var n = ll(e);
		t.forEach(function(t) {
			if (!n.has(t)) {
				n.add(t);
				var r = Yu.bind(null, e, t);
				t.then(r, r);
			}
		});
	}
	function dl(e, t) {
		var n = t.deletions;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var a = n[r], o = e, s = t, c = s;
			a: for (; c !== null;) {
				switch (c.tag) {
					case 27:
						if (Zd(c.type)) {
							rl = c.stateNode, il = !1;
							break a;
						}
						break;
					case 5:
						rl = c.stateNode, il = !1;
						break a;
					case 3:
					case 4:
						rl = c.stateNode.containerInfo, il = !0;
						break a;
				}
				c = c.return;
			}
			if (rl === null) throw Error(i(160));
			ol(o, s, a), rl = null, il = !1, o = a.alternate, o !== null && (o.return = null), a.return = null;
		}
		if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) pl(t, e), t = t.sibling;
	}
	var fl = null;
	function pl(e, t) {
		var n = e.alternate, r = e.flags;
		switch (e.tag) {
			case 0:
			case 11:
			case 14:
			case 15:
				dl(t, e), ml(e), r & 4 && (Lc(3, e, e.return), Ic(3, e), Lc(5, e, e.return));
				break;
			case 1:
				dl(t, e), ml(e), r & 512 && (Xc || n === null || Vc(n, n.return)), r & 64 && Yc && (e = e.updateQueue, e !== null && (r = e.callbacks, r !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? r : n.concat(r))));
				break;
			case 26:
				var a = fl;
				if (dl(t, e), ml(e), r & 512 && (Xc || n === null || Vc(n, n.return)), r & 4) {
					var o = n === null ? null : n.memoizedState;
					if (r = e.memoizedState, n === null) if (r === null) if (e.stateNode === null) {
						a: {
							r = e.type, n = e.memoizedProps, a = a.ownerDocument || a;
							b: switch (r) {
								case "title":
									o = a.getElementsByTagName("title")[0], (!o || o[ct] || o[tt] || o.namespaceURI === "http://www.w3.org/2000/svg" || o.hasAttribute("itemprop")) && (o = a.createElement(r), a.head.insertBefore(o, a.querySelector("head > title"))), Pd(o, r, n), o[tt] = e, pt(o), r = o;
									break a;
								case "link":
									var s = Vf("link", "href", a).get(r + (n.href || ""));
									if (s) {
										for (var c = 0; c < s.length; c++) if (o = s[c], o.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && o.getAttribute("rel") === (n.rel == null ? null : n.rel) && o.getAttribute("title") === (n.title == null ? null : n.title) && o.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
											s.splice(c, 1);
											break b;
										}
									}
									o = a.createElement(r), Pd(o, r, n), a.head.appendChild(o);
									break;
								case "meta":
									if (s = Vf("meta", "content", a).get(r + (n.content || ""))) {
										for (c = 0; c < s.length; c++) if (o = s[c], o.getAttribute("content") === (n.content == null ? null : "" + n.content) && o.getAttribute("name") === (n.name == null ? null : n.name) && o.getAttribute("property") === (n.property == null ? null : n.property) && o.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && o.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
											s.splice(c, 1);
											break b;
										}
									}
									o = a.createElement(r), Pd(o, r, n), a.head.appendChild(o);
									break;
								default: throw Error(i(468, r));
							}
							o[tt] = e, pt(o), r = o;
						}
						e.stateNode = r;
					} else Hf(a, e.type, e.stateNode);
					else e.stateNode = If(a, r, e.memoizedProps);
					else o === r ? r === null && e.stateNode !== null && Uc(e, e.memoizedProps, n.memoizedProps) : (o === null ? n.stateNode !== null && (n = n.stateNode, n.parentNode.removeChild(n)) : o.count--, r === null ? Hf(a, e.type, e.stateNode) : If(a, r, e.memoizedProps));
				}
				break;
			case 27:
				dl(t, e), ml(e), r & 512 && (Xc || n === null || Vc(n, n.return)), n !== null && r & 4 && Uc(e, e.memoizedProps, n.memoizedProps);
				break;
			case 5:
				if (dl(t, e), ml(e), r & 512 && (Xc || n === null || Vc(n, n.return)), e.flags & 32) {
					a = e.stateNode;
					try {
						Lt(a, "");
					} catch (t) {
						Wu(e, e.return, t);
					}
				}
				r & 4 && e.stateNode != null && (a = e.memoizedProps, Uc(e, a, n === null ? a : n.memoizedProps)), r & 1024 && (Zc = !0);
				break;
			case 6:
				if (dl(t, e), ml(e), r & 4) {
					if (e.stateNode === null) throw Error(i(162));
					r = e.memoizedProps, n = e.stateNode;
					try {
						n.nodeValue = r;
					} catch (t) {
						Wu(e, e.return, t);
					}
				}
				break;
			case 3:
				if (Bf = null, a = fl, fl = gf(t.containerInfo), dl(t, e), fl = a, ml(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
					Np(t.containerInfo);
				} catch (t) {
					Wu(e, e.return, t);
				}
				Zc && (Zc = !1, hl(e));
				break;
			case 4:
				r = fl, fl = gf(e.stateNode.containerInfo), dl(t, e), ml(e), fl = r;
				break;
			case 12:
				dl(t, e), ml(e);
				break;
			case 31:
				dl(t, e), ml(e), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, ul(e, r)));
				break;
			case 13:
				dl(t, e), ml(e), e.child.flags & 8192 && e.memoizedState !== null != (n !== null && n.memoizedState !== null) && (Ql = be()), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, ul(e, r)));
				break;
			case 22:
				a = e.memoizedState !== null;
				var l = n !== null && n.memoizedState !== null, u = Yc, d = Xc;
				if (Yc = u || a, Xc = d || l, dl(t, e), Xc = d, Yc = u, ml(e), r & 8192) a: for (t = e.stateNode, t._visibility = a ? t._visibility & -2 : t._visibility | 1, a && (n === null || l || Yc || Xc || _l(e)), n = null, t = e;;) {
					if (t.tag === 5 || t.tag === 26) {
						if (n === null) {
							l = n = t;
							try {
								if (o = l.stateNode, a) s = o.style, typeof s.setProperty == "function" ? s.setProperty("display", "none", "important") : s.display = "none";
								else {
									c = l.stateNode;
									var f = l.memoizedProps.style, p = f != null && f.hasOwnProperty("display") ? f.display : null;
									c.style.display = p == null || typeof p == "boolean" ? "" : ("" + p).trim();
								}
							} catch (e) {
								Wu(l, l.return, e);
							}
						}
					} else if (t.tag === 6) {
						if (n === null) {
							l = t;
							try {
								l.stateNode.nodeValue = a ? "" : l.memoizedProps;
							} catch (e) {
								Wu(l, l.return, e);
							}
						}
					} else if (t.tag === 18) {
						if (n === null) {
							l = t;
							try {
								var m = l.stateNode;
								a ? $d(m, !0) : $d(l.stateNode, !1);
							} catch (e) {
								Wu(l, l.return, e);
							}
						}
					} else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === e) && t.child !== null) {
						t.child.return = t, t = t.child;
						continue;
					}
					if (t === e) break a;
					for (; t.sibling === null;) {
						if (t.return === null || t.return === e) break a;
						n === t && (n = null), t = t.return;
					}
					n === t && (n = null), t.sibling.return = t.return, t = t.sibling;
				}
				r & 4 && (r = e.updateQueue, r !== null && (n = r.retryQueue, n !== null && (r.retryQueue = null, ul(e, n))));
				break;
			case 19:
				dl(t, e), ml(e), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, ul(e, r)));
				break;
			case 30: break;
			case 21: break;
			default: dl(t, e), ml(e);
		}
	}
	function ml(e) {
		var t = e.flags;
		if (t & 2) {
			try {
				for (var n, r = e.return; r !== null;) {
					if (Wc(r)) {
						n = r;
						break;
					}
					r = r.return;
				}
				if (n == null) throw Error(i(160));
				switch (n.tag) {
					case 27:
						var a = n.stateNode;
						qc(e, Gc(e), a);
						break;
					case 5:
						var o = n.stateNode;
						n.flags & 32 && (Lt(o, ""), n.flags &= -33), qc(e, Gc(e), o);
						break;
					case 3:
					case 4:
						var s = n.stateNode.containerInfo;
						Kc(e, Gc(e), s);
						break;
					default: throw Error(i(161));
				}
			} catch (t) {
				Wu(e, e.return, t);
			}
			e.flags &= -3;
		}
		t & 4096 && (e.flags &= -4097);
	}
	function hl(e) {
		if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
			var t = e;
			hl(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
		}
	}
	function gl(e, t) {
		if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) tl(e, t.alternate, t), t = t.sibling;
	}
	function _l(e) {
		for (e = e.child; e !== null;) {
			var t = e;
			switch (t.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					Lc(4, t, t.return), _l(t);
					break;
				case 1:
					Vc(t, t.return);
					var n = t.stateNode;
					typeof n.componentWillUnmount == "function" && zc(t, t.return, n), _l(t);
					break;
				case 27: pf(t.stateNode);
				case 26:
				case 5:
					Vc(t, t.return), _l(t);
					break;
				case 22:
					t.memoizedState === null && _l(t);
					break;
				case 30:
					_l(t);
					break;
				default: _l(t);
			}
			e = e.sibling;
		}
	}
	function vl(e, t, n) {
		for (n &&= (t.subtreeFlags & 8772) != 0, t = t.child; t !== null;) {
			var r = t.alternate, i = e, a = t, o = a.flags;
			switch (a.tag) {
				case 0:
				case 11:
				case 15:
					vl(i, a, n), Ic(4, a);
					break;
				case 1:
					if (vl(i, a, n), r = a, i = r.stateNode, typeof i.componentDidMount == "function") try {
						i.componentDidMount();
					} catch (e) {
						Wu(r, r.return, e);
					}
					if (r = a, i = r.updateQueue, i !== null) {
						var s = r.stateNode;
						try {
							var c = i.shared.hiddenCallbacks;
							if (c !== null) for (i.shared.hiddenCallbacks = null, i = 0; i < c.length; i++) Ha(c[i], s);
						} catch (e) {
							Wu(r, r.return, e);
						}
					}
					n && o & 64 && Rc(a), Bc(a, a.return);
					break;
				case 27: Jc(a);
				case 26:
				case 5:
					vl(i, a, n), n && r === null && o & 4 && Hc(a), Bc(a, a.return);
					break;
				case 12:
					vl(i, a, n);
					break;
				case 31:
					vl(i, a, n), n && o & 4 && sl(i, a);
					break;
				case 13:
					vl(i, a, n), n && o & 4 && cl(i, a);
					break;
				case 22:
					a.memoizedState === null && vl(i, a, n), Bc(a, a.return);
					break;
				case 30: break;
				default: vl(i, a, n);
			}
			t = t.sibling;
		}
	}
	function yl(e, t) {
		var n = null;
		e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && ta(n));
	}
	function bl(e, t) {
		e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && ta(e));
	}
	function xl(e, t, n, r) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) Sl(e, t, n, r), t = t.sibling;
	}
	function Sl(e, t, n, r) {
		var i = t.flags;
		switch (t.tag) {
			case 0:
			case 11:
			case 15:
				xl(e, t, n, r), i & 2048 && Ic(9, t);
				break;
			case 1:
				xl(e, t, n, r);
				break;
			case 3:
				xl(e, t, n, r), i & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && ta(e)));
				break;
			case 12:
				if (i & 2048) {
					xl(e, t, n, r), e = t.stateNode;
					try {
						var a = t.memoizedProps, o = a.id, s = a.onPostCommit;
						typeof s == "function" && s(o, t.alternate === null ? "mount" : "update", e.passiveEffectDuration, -0);
					} catch (e) {
						Wu(t, t.return, e);
					}
				} else xl(e, t, n, r);
				break;
			case 31:
				xl(e, t, n, r);
				break;
			case 13:
				xl(e, t, n, r);
				break;
			case 23: break;
			case 22:
				a = t.stateNode, o = t.alternate, t.memoizedState === null ? a._visibility & 2 ? xl(e, t, n, r) : (a._visibility |= 2, Cl(e, t, n, r, (t.subtreeFlags & 10256) != 0 || !1)) : a._visibility & 2 ? xl(e, t, n, r) : wl(e, t), i & 2048 && yl(o, t);
				break;
			case 24:
				xl(e, t, n, r), i & 2048 && bl(t.alternate, t);
				break;
			default: xl(e, t, n, r);
		}
	}
	function Cl(e, t, n, r, i) {
		for (i &&= (t.subtreeFlags & 10256) != 0 || !1, t = t.child; t !== null;) {
			var a = e, o = t, s = n, c = r, l = o.flags;
			switch (o.tag) {
				case 0:
				case 11:
				case 15:
					Cl(a, o, s, c, i), Ic(8, o);
					break;
				case 23: break;
				case 22:
					var u = o.stateNode;
					o.memoizedState === null ? (u._visibility |= 2, Cl(a, o, s, c, i)) : u._visibility & 2 ? Cl(a, o, s, c, i) : wl(a, o), i && l & 2048 && yl(o.alternate, o);
					break;
				case 24:
					Cl(a, o, s, c, i), i && l & 2048 && bl(o.alternate, o);
					break;
				default: Cl(a, o, s, c, i);
			}
			t = t.sibling;
		}
	}
	function wl(e, t) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) {
			var n = e, r = t, i = r.flags;
			switch (r.tag) {
				case 22:
					wl(n, r), i & 2048 && yl(r.alternate, r);
					break;
				case 24:
					wl(n, r), i & 2048 && bl(r.alternate, r);
					break;
				default: wl(n, r);
			}
			t = t.sibling;
		}
	}
	var Tl = 8192;
	function El(e, t, n) {
		if (e.subtreeFlags & Tl) for (e = e.child; e !== null;) Dl(e, t, n), e = e.sibling;
	}
	function Dl(e, t, n) {
		switch (e.tag) {
			case 26:
				El(e, t, n), e.flags & Tl && e.memoizedState !== null && Gf(n, fl, e.memoizedState, e.memoizedProps);
				break;
			case 5:
				El(e, t, n);
				break;
			case 3:
			case 4:
				var r = fl;
				fl = gf(e.stateNode.containerInfo), El(e, t, n), fl = r;
				break;
			case 22:
				e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = Tl, Tl = 16777216, El(e, t, n), Tl = r) : El(e, t, n));
				break;
			default: El(e, t, n);
		}
	}
	function Ol(e) {
		var t = e.alternate;
		if (t !== null && (e = t.child, e !== null)) {
			t.child = null;
			do
				t = e.sibling, e.sibling = null, e = t;
			while (e !== null);
		}
	}
	function kl(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				$c = r, Ml(r, e);
			}
			Ol(e);
		}
		if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) Al(e), e = e.sibling;
	}
	function Al(e) {
		switch (e.tag) {
			case 0:
			case 11:
			case 15:
				kl(e), e.flags & 2048 && Lc(9, e, e.return);
				break;
			case 3:
				kl(e);
				break;
			case 12:
				kl(e);
				break;
			case 22:
				var t = e.stateNode;
				e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, jl(e)) : kl(e);
				break;
			default: kl(e);
		}
	}
	function jl(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				$c = r, Ml(r, e);
			}
			Ol(e);
		}
		for (e = e.child; e !== null;) {
			switch (t = e, t.tag) {
				case 0:
				case 11:
				case 15:
					Lc(8, t, t.return), jl(t);
					break;
				case 22:
					n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, jl(t));
					break;
				default: jl(t);
			}
			e = e.sibling;
		}
	}
	function Ml(e, t) {
		for (; $c !== null;) {
			var n = $c;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					Lc(8, n, t);
					break;
				case 23:
				case 22:
					if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
						var r = n.memoizedState.cachePool.pool;
						r != null && r.refCount++;
					}
					break;
				case 24: ta(n.memoizedState.cache);
			}
			if (r = n.child, r !== null) r.return = n, $c = r;
			else a: for (n = e; $c !== null;) {
				r = $c;
				var i = r.sibling, a = r.return;
				if (nl(r), r === n) {
					$c = null;
					break a;
				}
				if (i !== null) {
					i.return = a, $c = i;
					break a;
				}
				$c = a;
			}
		}
	}
	var Nl = {
		getCacheForType: function(e) {
			var t = qi($i), n = t.data.get(e);
			return n === void 0 && (n = e(), t.data.set(e, n)), n;
		},
		cacheSignal: function() {
			return qi($i).controller.signal;
		}
	}, Pl = typeof WeakMap == "function" ? WeakMap : Map, Fl = 0, Il = null, X = null, Z = 0, Ll = 0, Rl = null, zl = !1, Bl = !1, Vl = !1, Hl = 0, Ul = 0, Wl = 0, Gl = 0, Kl = 0, ql = 0, Jl = 0, Yl = null, Xl = null, Zl = !1, Ql = 0, $l = 0, eu = Infinity, tu = null, nu = null, ru = 0, iu = null, au = null, ou = 0, su = 0, cu = null, lu = null, uu = 0, du = null;
	function fu() {
		return Fl & 2 && Z !== 0 ? Z & -Z : I.T === null ? Qe() : dd();
	}
	function pu() {
		if (ql === 0) if (!(Z & 536870912) || Ei) {
			var e = Le;
			Le <<= 1, !(Le & 3932160) && (Le = 262144), ql = e;
		} else ql = 536870912;
		return e = Ya.current, e !== null && (e.flags |= 32), ql;
	}
	function mu(e, t, n) {
		(e === Il && (Ll === 2 || Ll === 9) || e.cancelPendingCommit !== null) && (xu(e, 0), vu(e, Z, ql, !1)), Ge(e, n), (!(Fl & 2) || e !== Il) && (e === Il && (!(Fl & 2) && (Gl |= n), Ul === 4 && vu(e, Z, ql, !1)), rd(e));
	}
	function hu(e, t, n) {
		if (Fl & 6) throw Error(i(327));
		var r = !n && (t & 127) == 0 && (t & e.expiredLanes) === 0 || Ve(e, t), a = r ? ku(e, t) : Du(e, t, !0), o = r;
		do {
			if (a === 0) {
				Bl && !r && vu(e, t, 0, !1);
				break;
			} else {
				if (n = e.current.alternate, o && !_u(n)) {
					a = Du(e, t, !1), o = !1;
					continue;
				}
				if (a === 2) {
					if (o = t, e.errorRecoveryDisabledLanes & o) var s = 0;
					else s = e.pendingLanes & -536870913, s = s === 0 ? s & 536870912 ? 536870912 : 0 : s;
					if (s !== 0) {
						t = s;
						a: {
							var c = e;
							a = Yl;
							var l = c.current.memoizedState.isDehydrated;
							if (l && (xu(c, s).flags |= 256), s = Du(c, s, !1), s !== 2) {
								if (Vl && !l) {
									c.errorRecoveryDisabledLanes |= o, Gl |= o, a = 4;
									break a;
								}
								o = Xl, Xl = a, o !== null && (Xl === null ? Xl = o : Xl.push.apply(Xl, o));
							}
							a = s;
						}
						if (o = !1, a !== 2) continue;
					}
				}
				if (a === 1) {
					xu(e, 0), vu(e, t, 0, !0);
					break;
				}
				a: {
					switch (r = e, o = a, o) {
						case 0:
						case 1: throw Error(i(345));
						case 4: if ((t & 4194048) !== t) break;
						case 6:
							vu(r, t, ql, !zl);
							break a;
						case 2:
							Xl = null;
							break;
						case 3:
						case 5: break;
						default: throw Error(i(329));
					}
					if ((t & 62914560) === t && (a = Ql + 300 - be(), 10 < a)) {
						if (vu(r, t, ql, !zl), Be(r, 0, !0) !== 0) break a;
						ou = t, r.timeoutHandle = Kd(gu.bind(null, r, n, Xl, tu, Zl, t, ql, Gl, Jl, zl, o, "Throttled", -0, 0), a);
						break a;
					}
					gu(r, n, Xl, tu, Zl, t, ql, Gl, Jl, zl, o, null, -0, 0);
				}
			}
			break;
		} while (1);
		rd(e);
	}
	function gu(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
		if (e.timeoutHandle = -1, d = t.subtreeFlags, d & 8192 || (d & 16785408) == 16785408) {
			d = {
				stylesheets: null,
				count: 0,
				imgCount: 0,
				imgBytes: 0,
				suspenseyImages: [],
				waitingForImages: !0,
				waitingForViewTransition: !1,
				unsuspend: Gt
			}, Dl(t, a, d);
			var m = (a & 62914560) === a ? Ql - be() : (a & 4194048) === a ? $l - be() : 0;
			if (m = qf(d, m), m !== null) {
				ou = a, e.cancelPendingCommit = m(Iu.bind(null, e, t, a, n, r, i, o, s, c, u, d, null, f, p)), vu(e, a, o, !l);
				return;
			}
		}
		Iu(e, t, a, n, r, i, o, s, c);
	}
	function _u(e) {
		for (var t = e;;) {
			var n = t.tag;
			if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null))) for (var r = 0; r < n.length; r++) {
				var i = n[r], a = i.getSnapshot;
				i = i.value;
				try {
					if (!pr(a(), i)) return !1;
				} catch {
					return !1;
				}
			}
			if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
			else {
				if (t === e) break;
				for (; t.sibling === null;) {
					if (t.return === null || t.return === e) return !0;
					t = t.return;
				}
				t.sibling.return = t.return, t = t.sibling;
			}
		}
		return !0;
	}
	function vu(e, t, n, r) {
		t &= ~Kl, t &= ~Gl, e.suspendedLanes |= t, e.pingedLanes &= ~t, r && (e.warmLanes |= t), r = e.expirationTimes;
		for (var i = t; 0 < i;) {
			var a = 31 - Me(i), o = 1 << a;
			r[a] = -1, i &= ~o;
		}
		n !== 0 && qe(e, n, t);
	}
	function yu() {
		return Fl & 6 ? !0 : (id(0, !1), !1);
	}
	function bu() {
		if (X !== null) {
			if (Ll === 0) var e = X.return;
			else e = X, zi = Ri = null, Co(e), wa = null, Ta = 0, e = X;
			for (; e !== null;) Fc(e.alternate, e), e = e.return;
			X = null;
		}
	}
	function xu(e, t) {
		var n = e.timeoutHandle;
		n !== -1 && (e.timeoutHandle = -1, qd(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), ou = 0, bu(), Il = e, X = n = ti(e.current, null), Z = t, Ll = 0, Rl = null, zl = !1, Bl = Ve(e, t), Vl = !1, Jl = ql = Kl = Gl = Wl = Ul = 0, Xl = Yl = null, Zl = !1, t & 8 && (t |= t & 32);
		var r = e.entangledLanes;
		if (r !== 0) for (e = e.entanglements, r &= t; 0 < r;) {
			var i = 31 - Me(r), a = 1 << i;
			t |= e[i], r &= ~a;
		}
		return Hl = t, Gr(), n;
	}
	function Su(e, t) {
		J = null, I.H = Ns, t === ma || t === ga ? (t = Sa(), Ll = 3) : t === ha ? (t = Sa(), Ll = 4) : Ll = t === Zs ? 8 : typeof t == "object" && t && typeof t.then == "function" ? 6 : 1, Rl = t, X === null && (Ul = 1, Gs(e, li(t, e.current)));
	}
	function Cu() {
		var e = Ya.current;
		return e === null ? !0 : (Z & 4194048) === Z ? Xa === null : (Z & 62914560) === Z || Z & 536870912 ? e === Xa : !1;
	}
	function wu() {
		var e = I.H;
		return I.H = Ns, e === null ? Ns : e;
	}
	function Tu() {
		var e = I.A;
		return I.A = Nl, e;
	}
	function Eu() {
		Ul = 4, zl || (Z & 4194048) !== Z && Ya.current !== null || (Bl = !0), !(Wl & 134217727) && !(Gl & 134217727) || Il === null || vu(Il, Z, ql, !1);
	}
	function Du(e, t, n) {
		var r = Fl;
		Fl |= 2;
		var i = wu(), a = Tu();
		(Il !== e || Z !== t) && (tu = null, xu(e, t)), t = !1;
		var o = Ul;
		a: do
			try {
				if (Ll !== 0 && X !== null) {
					var s = X, c = Rl;
					switch (Ll) {
						case 8:
							bu(), o = 6;
							break a;
						case 3:
						case 2:
						case 9:
						case 6:
							Ya.current === null && (t = !0);
							var l = Ll;
							if (Ll = 0, Rl = null, Nu(e, s, c, l), n && Bl) {
								o = 0;
								break a;
							}
							break;
						default: l = Ll, Ll = 0, Rl = null, Nu(e, s, c, l);
					}
				}
				Ou(), o = Ul;
				break;
			} catch (t) {
				Su(e, t);
			}
		while (1);
		return t && e.shellSuspendCounter++, zi = Ri = null, Fl = r, I.H = i, I.A = a, X === null && (Il = null, Z = 0, Gr()), o;
	}
	function Ou() {
		for (; X !== null;) ju(X);
	}
	function ku(e, t) {
		var n = Fl;
		Fl |= 2;
		var r = wu(), a = Tu();
		Il !== e || Z !== t ? (tu = null, eu = be() + 500, xu(e, t)) : Bl = Ve(e, t);
		a: do
			try {
				if (Ll !== 0 && X !== null) {
					t = X;
					var o = Rl;
					b: switch (Ll) {
						case 1:
							Ll = 0, Rl = null, Nu(e, t, o, 1);
							break;
						case 2:
						case 9:
							if (va(o)) {
								Ll = 0, Rl = null, Mu(t);
								break;
							}
							t = function() {
								Ll !== 2 && Ll !== 9 || Il !== e || (Ll = 7), rd(e);
							}, o.then(t, t);
							break a;
						case 3:
							Ll = 7;
							break a;
						case 4:
							Ll = 5;
							break a;
						case 7:
							va(o) ? (Ll = 0, Rl = null, Mu(t)) : (Ll = 0, Rl = null, Nu(e, t, o, 7));
							break;
						case 5:
							var s = null;
							switch (X.tag) {
								case 26: s = X.memoizedState;
								case 5:
								case 27:
									var c = X;
									if (s ? Wf(s) : c.stateNode.complete) {
										Ll = 0, Rl = null;
										var l = c.sibling;
										if (l !== null) X = l;
										else {
											var u = c.return;
											u === null ? X = null : (X = u, Pu(u));
										}
										break b;
									}
							}
							Ll = 0, Rl = null, Nu(e, t, o, 5);
							break;
						case 6:
							Ll = 0, Rl = null, Nu(e, t, o, 6);
							break;
						case 8:
							bu(), Ul = 6;
							break a;
						default: throw Error(i(462));
					}
				}
				Au();
				break;
			} catch (t) {
				Su(e, t);
			}
		while (1);
		return zi = Ri = null, I.H = r, I.A = a, Fl = n, X === null ? (Il = null, Z = 0, Gr(), Ul) : 0;
	}
	function Au() {
		for (; X !== null && !ve();) ju(X);
	}
	function ju(e) {
		var t = Dc(e.alternate, e, Hl);
		e.memoizedProps = e.pendingProps, t === null ? Pu(e) : X = t;
	}
	function Mu(e) {
		var t = e, n = t.alternate;
		switch (t.tag) {
			case 15:
			case 0:
				t = dc(n, t, t.pendingProps, t.type, void 0, Z);
				break;
			case 11:
				t = dc(n, t, t.pendingProps, t.type.render, t.ref, Z);
				break;
			case 5: Co(t);
			default: Fc(n, t), t = X = ni(t, Hl), t = Dc(n, t, Hl);
		}
		e.memoizedProps = e.pendingProps, t === null ? Pu(e) : X = t;
	}
	function Nu(e, t, n, r) {
		zi = Ri = null, Co(t), wa = null, Ta = 0;
		var i = t.return;
		try {
			if (Xs(e, i, t, n, Z)) {
				Ul = 1, Gs(e, li(n, e.current)), X = null;
				return;
			}
		} catch (t) {
			if (i !== null) throw X = i, t;
			Ul = 1, Gs(e, li(n, e.current)), X = null;
			return;
		}
		t.flags & 32768 ? (Ei || r === 1 ? e = !0 : Bl || Z & 536870912 ? e = !1 : (zl = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = Ya.current, r !== null && r.tag === 13 && (r.flags |= 16384))), Fu(t, e)) : Pu(t);
	}
	function Pu(e) {
		var t = e;
		do {
			if (t.flags & 32768) {
				Fu(t, zl);
				return;
			}
			e = t.return;
			var n = Nc(t.alternate, t, Hl);
			if (n !== null) {
				X = n;
				return;
			}
			if (t = t.sibling, t !== null) {
				X = t;
				return;
			}
			X = t = e;
		} while (t !== null);
		Ul === 0 && (Ul = 5);
	}
	function Fu(e, t) {
		do {
			var n = Pc(e.alternate, e);
			if (n !== null) {
				n.flags &= 32767, X = n;
				return;
			}
			if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
				X = e;
				return;
			}
			X = e = n;
		} while (e !== null);
		Ul = 6, X = null;
	}
	function Iu(e, t, n, r, a, o, s, c, l) {
		e.cancelPendingCommit = null;
		do
			Vu();
		while (ru !== 0);
		if (Fl & 6) throw Error(i(327));
		if (t !== null) {
			if (t === e.current) throw Error(i(177));
			if (o = t.lanes | t.childLanes, o |= Wr, Ke(e, n, o, s, c, l), e === Il && (X = Il = null, Z = 0), au = t, iu = e, ou = n, su = o, cu = a, lu = r, t.subtreeFlags & 10256 || t.flags & 10256 ? (e.callbackNode = null, e.callbackPriority = 0, Xu(we, function() {
				return Hu(), null;
			})) : (e.callbackNode = null, e.callbackPriority = 0), r = (t.flags & 13878) != 0, t.subtreeFlags & 13878 || r) {
				r = I.T, I.T = null, a = L.p, L.p = 2, s = Fl, Fl |= 4;
				try {
					el(e, t, n);
				} finally {
					Fl = s, L.p = a, I.T = r;
				}
			}
			ru = 1, Lu(), Ru(), zu();
		}
	}
	function Lu() {
		if (ru === 1) {
			ru = 0;
			var e = iu, t = au, n = (t.flags & 13878) != 0;
			if (t.subtreeFlags & 13878 || n) {
				n = I.T, I.T = null;
				var r = L.p;
				L.p = 2;
				var i = Fl;
				Fl |= 4;
				try {
					pl(t, e);
					var a = zd, o = vr(e.containerInfo), s = a.focusedElem, c = a.selectionRange;
					if (o !== s && s && s.ownerDocument && _r(s.ownerDocument.documentElement, s)) {
						if (c !== null && yr(s)) {
							var l = c.start, u = c.end;
							if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
							else {
								var d = s.ownerDocument || document, f = d && d.defaultView || window;
								if (f.getSelection) {
									var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
									!p.extend && h > g && (o = g, g = h, h = o);
									var _ = gr(s, h), v = gr(s, g);
									if (_ && v && (p.rangeCount !== 1 || p.anchorNode !== _.node || p.anchorOffset !== _.offset || p.focusNode !== v.node || p.focusOffset !== v.offset)) {
										var y = d.createRange();
										y.setStart(_.node, _.offset), p.removeAllRanges(), h > g ? (p.addRange(y), p.extend(v.node, v.offset)) : (y.setEnd(v.node, v.offset), p.addRange(y));
									}
								}
							}
						}
						for (d = [], p = s; p = p.parentNode;) p.nodeType === 1 && d.push({
							element: p,
							left: p.scrollLeft,
							top: p.scrollTop
						});
						for (typeof s.focus == "function" && s.focus(), s = 0; s < d.length; s++) {
							var b = d[s];
							b.element.scrollLeft = b.left, b.element.scrollTop = b.top;
						}
					}
					sp = !!Rd, zd = Rd = null;
				} finally {
					Fl = i, L.p = r, I.T = n;
				}
			}
			e.current = t, ru = 2;
		}
	}
	function Ru() {
		if (ru === 2) {
			ru = 0;
			var e = iu, t = au, n = (t.flags & 8772) != 0;
			if (t.subtreeFlags & 8772 || n) {
				n = I.T, I.T = null;
				var r = L.p;
				L.p = 2;
				var i = Fl;
				Fl |= 4;
				try {
					tl(e, t.alternate, t);
				} finally {
					Fl = i, L.p = r, I.T = n;
				}
			}
			ru = 3;
		}
	}
	function zu() {
		if (ru === 4 || ru === 3) {
			ru = 0, ye();
			var e = iu, t = au, n = ou, r = lu;
			t.subtreeFlags & 10256 || t.flags & 10256 ? ru = 5 : (ru = 0, au = iu = null, Bu(e, e.pendingLanes));
			var i = e.pendingLanes;
			if (i === 0 && (nu = null), Ze(n), t = t.stateNode, Ae && typeof Ae.onCommitFiberRoot == "function") try {
				Ae.onCommitFiberRoot(ke, t, void 0, (t.current.flags & 128) == 128);
			} catch {}
			if (r !== null) {
				t = I.T, i = L.p, L.p = 2, I.T = null;
				try {
					for (var a = e.onRecoverableError, o = 0; o < r.length; o++) {
						var s = r[o];
						a(s.value, { componentStack: s.stack });
					}
				} finally {
					I.T = t, L.p = i;
				}
			}
			ou & 3 && Vu(), rd(e), i = e.pendingLanes, n & 261930 && i & 42 ? e === du ? uu++ : (uu = 0, du = e) : uu = 0, id(0, !1);
		}
	}
	function Bu(e, t) {
		(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, ta(t)));
	}
	function Vu() {
		return Lu(), Ru(), zu(), Hu();
	}
	function Hu() {
		if (ru !== 5) return !1;
		var e = iu, t = su;
		su = 0;
		var n = Ze(ou), r = I.T, a = L.p;
		try {
			L.p = 32 > n ? 32 : n, I.T = null, n = cu, cu = null;
			var o = iu, s = ou;
			if (ru = 0, au = iu = null, ou = 0, Fl & 6) throw Error(i(331));
			var c = Fl;
			if (Fl |= 4, Al(o.current), Sl(o, o.current, s, n), Fl = c, id(0, !1), Ae && typeof Ae.onPostCommitFiberRoot == "function") try {
				Ae.onPostCommitFiberRoot(ke, o);
			} catch {}
			return !0;
		} finally {
			L.p = a, I.T = r, Bu(e, t);
		}
	}
	function Uu(e, t, n) {
		t = li(n, t), t = qs(e.stateNode, t, 2), e = Ia(e, t, 2), e !== null && (Ge(e, 2), rd(e));
	}
	function Wu(e, t, n) {
		if (e.tag === 3) Uu(e, e, n);
		else for (; t !== null;) {
			if (t.tag === 3) {
				Uu(t, e, n);
				break;
			} else if (t.tag === 1) {
				var r = t.stateNode;
				if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (nu === null || !nu.has(r))) {
					e = li(n, e), n = Js(2), r = Ia(t, n, 2), r !== null && (Ys(n, r, t, e), Ge(r, 2), rd(r));
					break;
				}
			}
			t = t.return;
		}
	}
	function Gu(e, t, n) {
		var r = e.pingCache;
		if (r === null) {
			r = e.pingCache = new Pl();
			var i = /* @__PURE__ */ new Set();
			r.set(t, i);
		} else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
		i.has(n) || (Vl = !0, i.add(n), e = Ku.bind(null, e, t, n), t.then(e, e));
	}
	function Ku(e, t, n) {
		var r = e.pingCache;
		r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, Il === e && (Z & n) === n && (Ul === 4 || Ul === 3 && (Z & 62914560) === Z && 300 > be() - Ql ? !(Fl & 2) && xu(e, 0) : Kl |= n, Jl === Z && (Jl = 0)), rd(e);
	}
	function qu(e, t) {
		t === 0 && (t = Ue()), e = Jr(e, t), e !== null && (Ge(e, t), rd(e));
	}
	function Ju(e) {
		var t = e.memoizedState, n = 0;
		t !== null && (n = t.retryLane), qu(e, n);
	}
	function Yu(e, t) {
		var n = 0;
		switch (e.tag) {
			case 31:
			case 13:
				var r = e.stateNode, a = e.memoizedState;
				a !== null && (n = a.retryLane);
				break;
			case 19:
				r = e.stateNode;
				break;
			case 22:
				r = e.stateNode._retryCache;
				break;
			default: throw Error(i(314));
		}
		r !== null && r.delete(t), qu(e, n);
	}
	function Xu(e, t) {
		return ge(e, t);
	}
	var Zu = null, Qu = null, $u = !1, ed = !1, td = !1, nd = 0;
	function rd(e) {
		e !== Qu && e.next === null && (Qu === null ? Zu = Qu = e : Qu = Qu.next = e), ed = !0, $u || ($u = !0, ud());
	}
	function id(e, t) {
		if (!td && ed) {
			td = !0;
			do
				for (var n = !1, r = Zu; r !== null;) {
					if (!t) if (e !== 0) {
						var i = r.pendingLanes;
						if (i === 0) var a = 0;
						else {
							var o = r.suspendedLanes, s = r.pingedLanes;
							a = (1 << 31 - Me(42 | e) + 1) - 1, a &= i & ~(o & ~s), a = a & 201326741 ? a & 201326741 | 1 : a ? a | 2 : 0;
						}
						a !== 0 && (n = !0, ld(r, a));
					} else a = Z, a = Be(r, r === Il ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1), !(a & 3) || Ve(r, a) || (n = !0, ld(r, a));
					r = r.next;
				}
			while (n);
			td = !1;
		}
	}
	function ad() {
		od();
	}
	function od() {
		ed = $u = !1;
		var e = 0;
		nd !== 0 && Gd() && (e = nd);
		for (var t = be(), n = null, r = Zu; r !== null;) {
			var i = r.next, a = sd(r, t);
			a === 0 ? (r.next = null, n === null ? Zu = i : n.next = i, i === null && (Qu = n)) : (n = r, (e !== 0 || a & 3) && (ed = !0)), r = i;
		}
		ru !== 0 && ru !== 5 || id(e, !1), nd !== 0 && (nd = 0);
	}
	function sd(e, t) {
		for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
			var o = 31 - Me(a), s = 1 << o, c = i[o];
			c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = He(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
		}
		if (t = Il, n = Z, n = Be(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r = e.callbackNode, n === 0 || e === t && (Ll === 2 || Ll === 9) || e.cancelPendingCommit !== null) return r !== null && r !== null && _e(r), e.callbackNode = null, e.callbackPriority = 0;
		if (!(n & 3) || Ve(e, n)) {
			if (t = n & -n, t === e.callbackPriority) return t;
			switch (r !== null && _e(r), Ze(n)) {
				case 2:
				case 8:
					n = Ce;
					break;
				case 32:
					n = we;
					break;
				case 268435456:
					n = Ee;
					break;
				default: n = we;
			}
			return r = cd.bind(null, e), n = ge(n, r), e.callbackPriority = t, e.callbackNode = n, t;
		}
		return r !== null && r !== null && _e(r), e.callbackPriority = 2, e.callbackNode = null, 2;
	}
	function cd(e, t) {
		if (ru !== 0 && ru !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
		var n = e.callbackNode;
		if (Vu() && e.callbackNode !== n) return null;
		var r = Z;
		return r = Be(e, e === Il ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r === 0 ? null : (hu(e, r, t), sd(e, be()), e.callbackNode != null && e.callbackNode === n ? cd.bind(null, e) : null);
	}
	function ld(e, t) {
		if (Vu()) return null;
		hu(e, t, !0);
	}
	function ud() {
		Yd(function() {
			Fl & 6 ? ge(Se, ad) : od();
		});
	}
	function dd() {
		if (nd === 0) {
			var e = ia;
			e === 0 && (e = Ie, Ie <<= 1, !(Ie & 261888) && (Ie = 256)), nd = e;
		}
		return nd;
	}
	function fd(e) {
		return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : Wt("" + e);
	}
	function pd(e, t) {
		var n = t.ownerDocument.createElement("input");
		return n.name = t.name, n.value = t.value, e.id && n.setAttribute("form", e.id), t.parentNode.insertBefore(n, t), e = new FormData(e), n.parentNode.removeChild(n), e;
	}
	function md(e, t, n, r, i) {
		if (t === "submit" && n && n.stateNode === i) {
			var a = fd((i[nt] || null).action), o = r.submitter;
			o && (t = (t = o[nt] || null) ? fd(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
			var s = new fn("action", "action", null, r, i);
			e.push({
				event: s,
				listeners: [{
					instance: null,
					listener: function() {
						if (r.defaultPrevented) {
							if (nd !== 0) {
								var e = o ? pd(i, o) : new FormData(i);
								ys(n, {
									pending: !0,
									data: e,
									method: i.method,
									action: a
								}, null, e);
							}
						} else typeof a == "function" && (s.preventDefault(), e = o ? pd(i, o) : new FormData(i), ys(n, {
							pending: !0,
							data: e,
							method: i.method,
							action: a
						}, a, e));
					},
					currentTarget: i
				}]
			});
		}
	}
	for (var hd = 0; hd < zr.length; hd++) {
		var gd = zr[hd];
		Br(gd.toLowerCase(), "on" + (gd[0].toUpperCase() + gd.slice(1)));
	}
	Br(jr, "onAnimationEnd"), Br(Mr, "onAnimationIteration"), Br(Nr, "onAnimationStart"), Br("dblclick", "onDoubleClick"), Br("focusin", "onFocus"), Br("focusout", "onBlur"), Br(Pr, "onTransitionRun"), Br(Fr, "onTransitionStart"), Br(Ir, "onTransitionCancel"), Br(Lr, "onTransitionEnd"), _t("onMouseEnter", ["mouseout", "mouseover"]), _t("onMouseLeave", ["mouseout", "mouseover"]), _t("onPointerEnter", ["pointerout", "pointerover"]), _t("onPointerLeave", ["pointerout", "pointerover"]), gt("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), gt("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), gt("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]), gt("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), gt("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), gt("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
	var _d = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), vd = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(_d));
	function Q(e, t) {
		t = (t & 4) != 0;
		for (var n = 0; n < e.length; n++) {
			var r = e[n], i = r.event;
			r = r.listeners;
			a: {
				var a = void 0;
				if (t) for (var o = r.length - 1; 0 <= o; o--) {
					var s = r[o], c = s.instance, l = s.currentTarget;
					if (s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						Vr(e);
					}
					i.currentTarget = null, a = c;
				}
				else for (o = 0; o < r.length; o++) {
					if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						Vr(e);
					}
					i.currentTarget = null, a = c;
				}
			}
		}
	}
	function $(e, t) {
		var n = t[it];
		n === void 0 && (n = t[it] = /* @__PURE__ */ new Set());
		var r = e + "__bubble";
		n.has(r) || (Sd(t, e, 2, !1), n.add(r));
	}
	function yd(e, t, n) {
		var r = 0;
		t && (r |= 4), Sd(n, e, r, t);
	}
	var bd = "_reactListening" + Math.random().toString(36).slice(2);
	function xd(e) {
		if (!e[bd]) {
			e[bd] = !0, mt.forEach(function(t) {
				t !== "selectionchange" && (vd.has(t) || yd(t, !1, e), yd(t, !0, e));
			});
			var t = e.nodeType === 9 ? e : e.ownerDocument;
			t === null || t[bd] || (t[bd] = !0, yd("selectionchange", !1, t));
		}
	}
	function Sd(e, t, n, r) {
		switch (mp(t)) {
			case 2:
				var i = cp;
				break;
			case 8:
				i = lp;
				break;
			default: i = up;
		}
		n = i.bind(null, t, n, e), i = void 0, !tn || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
			capture: !0,
			passive: i
		}) : i === void 0 ? e.addEventListener(t, n, !1) : e.addEventListener(t, n, { passive: i });
	}
	function Cd(e, t, n, r, i) {
		var a = r;
		if (!(t & 1) && !(t & 2) && r !== null) a: for (;;) {
			if (r === null) return;
			var s = r.tag;
			if (s === 3 || s === 4) {
				var c = r.stateNode.containerInfo;
				if (c === i) break;
				if (s === 4) for (s = r.return; s !== null;) {
					var l = s.tag;
					if ((l === 3 || l === 4) && s.stateNode.containerInfo === i) return;
					s = s.return;
				}
				for (; c !== null;) {
					if (s = W(c), s === null) return;
					if (l = s.tag, l === 5 || l === 6 || l === 26 || l === 27) {
						r = a = s;
						continue a;
					}
					c = c.parentNode;
				}
			}
			r = r.return;
		}
		Qt(function() {
			var r = a, i = qt(n), s = [];
			a: {
				var c = Rr.get(e);
				if (c !== void 0) {
					var l = fn, u = e;
					switch (e) {
						case "keypress": if (cn(n) === 0) break a;
						case "keydown":
						case "keyup":
							l = An;
							break;
						case "focusin":
							u = "focus", l = xn;
							break;
						case "focusout":
							u = "blur", l = xn;
							break;
						case "beforeblur":
						case "afterblur":
							l = xn;
							break;
						case "click": if (n.button === 2) break a;
						case "auxclick":
						case "dblclick":
						case "mousedown":
						case "mousemove":
						case "mouseup":
						case "mouseout":
						case "mouseover":
						case "contextmenu":
							l = yn;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							l = bn;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							l = Mn;
							break;
						case jr:
						case Mr:
						case Nr:
							l = Sn;
							break;
						case Lr:
							l = Nn;
							break;
						case "scroll":
						case "scrollend":
							l = mn;
							break;
						case "wheel":
							l = Pn;
							break;
						case "copy":
						case "cut":
						case "paste":
							l = Cn;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							l = jn;
							break;
						case "toggle":
						case "beforetoggle": l = Fn;
					}
					var d = (t & 4) != 0, f = !d && (e === "scroll" || e === "scrollend"), p = d ? c === null ? null : c + "Capture" : c;
					d = [];
					for (var m = r, h; m !== null;) {
						var g = m;
						if (h = g.stateNode, g = g.tag, g !== 5 && g !== 26 && g !== 27 || h === null || p === null || (g = $t(m, p), g != null && d.push(wd(m, g, h))), f) break;
						m = m.return;
					}
					0 < d.length && (c = new l(c, u, null, n, i), s.push({
						event: c,
						listeners: d
					}));
				}
			}
			if (!(t & 7)) {
				a: {
					if (c = e === "mouseover" || e === "pointerover", l = e === "mouseout" || e === "pointerout", c && n !== Kt && (u = n.relatedTarget || n.fromElement) && (W(u) || u[rt])) break a;
					if ((l || c) && (c = i.window === i ? i : (c = i.ownerDocument) ? c.defaultView || c.parentWindow : window, l ? (u = n.relatedTarget || n.toElement, l = r, u = u ? W(u) : null, u !== null && (f = o(u), d = u.tag, u !== f || d !== 5 && d !== 27 && d !== 6) && (u = null)) : (l = null, u = r), l !== u)) {
						if (d = yn, g = "onMouseLeave", p = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (d = jn, g = "onPointerLeave", p = "onPointerEnter", m = "pointer"), f = l == null ? c : dt(l), h = u == null ? c : dt(u), c = new d(g, m + "leave", l, n, i), c.target = f, c.relatedTarget = h, g = null, W(i) === r && (d = new d(p, m + "enter", u, n, i), d.target = h, d.relatedTarget = f, g = d), f = g, l && u) b: {
							for (d = Ed, p = l, m = u, h = 0, g = p; g; g = d(g)) h++;
							g = 0;
							for (var _ = m; _; _ = d(_)) g++;
							for (; 0 < h - g;) p = d(p), h--;
							for (; 0 < g - h;) m = d(m), g--;
							for (; h--;) {
								if (p === m || m !== null && p === m.alternate) {
									d = p;
									break b;
								}
								p = d(p), m = d(m);
							}
							d = null;
						}
						else d = null;
						l !== null && Dd(s, c, l, d, !1), u !== null && f !== null && Dd(s, f, u, d, !0);
					}
				}
				a: {
					if (c = r ? dt(r) : window, l = c.nodeName && c.nodeName.toLowerCase(), l === "select" || l === "input" && c.type === "file") var v = tr;
					else if (Yn(c)) if (nr) v = dr;
					else {
						v = lr;
						var y = cr;
					}
					else l = c.nodeName, !l || l.toLowerCase() !== "input" || c.type !== "checkbox" && c.type !== "radio" ? r && Vt(r.elementType) && (v = tr) : v = ur;
					if (v &&= v(e, r)) {
						Xn(s, v, n, i);
						break a;
					}
					y && y(e, c, r), e === "focusout" && r && c.type === "number" && r.memoizedProps.value != null && Nt(c, "number", c.value);
				}
				switch (y = r ? dt(r) : window, e) {
					case "focusin":
						(Yn(y) || y.contentEditable === "true") && (xr = y, Sr = r, Cr = null);
						break;
					case "focusout":
						Cr = Sr = xr = null;
						break;
					case "mousedown":
						wr = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						wr = !1, Tr(s, n, i);
						break;
					case "selectionchange": if (br) break;
					case "keydown":
					case "keyup": Tr(s, n, i);
				}
				var b;
				if (Ln) b: {
					switch (e) {
						case "compositionstart":
							var x = "onCompositionStart";
							break b;
						case "compositionend":
							x = "onCompositionEnd";
							break b;
						case "compositionupdate":
							x = "onCompositionUpdate";
							break b;
					}
					x = void 0;
				}
				else Gn ? Un(e, n) && (x = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (x = "onCompositionStart");
				x && (Bn && n.locale !== "ko" && (Gn || x !== "onCompositionStart" ? x === "onCompositionEnd" && Gn && (b = sn()) : (rn = i, an = "value" in rn ? rn.value : rn.textContent, Gn = !0)), y = Td(r, x), 0 < y.length && (x = new wn(x, e, null, n, i), s.push({
					event: x,
					listeners: y
				}), b ? x.data = b : (b = Wn(n), b !== null && (x.data = b)))), (b = zn ? Kn(e, n) : qn(e, n)) && (x = Td(r, "onBeforeInput"), 0 < x.length && (y = new wn("onBeforeInput", "beforeinput", null, n, i), s.push({
					event: y,
					listeners: x
				}), y.data = b)), md(s, e, r, n, i);
			}
			Q(s, t);
		});
	}
	function wd(e, t, n) {
		return {
			instance: e,
			listener: t,
			currentTarget: n
		};
	}
	function Td(e, t) {
		for (var n = t + "Capture", r = []; e !== null;) {
			var i = e, a = i.stateNode;
			if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = $t(e, n), i != null && r.unshift(wd(e, i, a)), i = $t(e, t), i != null && r.push(wd(e, i, a))), e.tag === 3) return r;
			e = e.return;
		}
		return [];
	}
	function Ed(e) {
		if (e === null) return null;
		do
			e = e.return;
		while (e && e.tag !== 5 && e.tag !== 27);
		return e || null;
	}
	function Dd(e, t, n, r, i) {
		for (var a = t._reactName, o = []; n !== null && n !== r;) {
			var s = n, c = s.alternate, l = s.stateNode;
			if (s = s.tag, c !== null && c === r) break;
			s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = $t(n, a), l != null && o.unshift(wd(n, l, c))) : i || (l = $t(n, a), l != null && o.push(wd(n, l, c)))), n = n.return;
		}
		o.length !== 0 && e.push({
			event: t,
			listeners: o
		});
	}
	var Od = /\r\n?/g, kd = /\u0000|\uFFFD/g;
	function Ad(e) {
		return (typeof e == "string" ? e : "" + e).replace(Od, "\n").replace(kd, "");
	}
	function jd(e, t) {
		return t = Ad(t), Ad(e) === t;
	}
	function Md(e, t, n, r, a, o) {
		switch (n) {
			case "children":
				typeof r == "string" ? t === "body" || t === "textarea" && r === "" || Lt(e, r) : (typeof r == "number" || typeof r == "bigint") && t !== "body" && Lt(e, "" + r);
				break;
			case "className":
				St(e, "class", r);
				break;
			case "tabIndex":
				St(e, "tabindex", r);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				St(e, n, r);
				break;
			case "style":
				Bt(e, r, o);
				break;
			case "data": if (t !== "object") {
				St(e, "data", r);
				break;
			}
			case "src":
			case "href":
				if (r === "" && (t !== "a" || n !== "href")) {
					e.removeAttribute(n);
					break;
				}
				if (r == null || typeof r == "function" || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = Wt("" + r), e.setAttribute(n, r);
				break;
			case "action":
			case "formAction":
				if (typeof r == "function") {
					e.setAttribute(n, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
					break;
				} else typeof o == "function" && (n === "formAction" ? (t !== "input" && Md(e, t, "name", a.name, a, null), Md(e, t, "formEncType", a.formEncType, a, null), Md(e, t, "formMethod", a.formMethod, a, null), Md(e, t, "formTarget", a.formTarget, a, null)) : (Md(e, t, "encType", a.encType, a, null), Md(e, t, "method", a.method, a, null), Md(e, t, "target", a.target, a, null)));
				if (r == null || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = Wt("" + r), e.setAttribute(n, r);
				break;
			case "onClick":
				r != null && (e.onclick = Gt);
				break;
			case "onScroll":
				r != null && $("scroll", e);
				break;
			case "onScrollEnd":
				r != null && $("scrollend", e);
				break;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						e.innerHTML = n;
					}
				}
				break;
			case "multiple":
				e.multiple = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "muted":
				e.muted = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "defaultValue":
			case "defaultChecked":
			case "innerHTML":
			case "ref": break;
			case "autoFocus": break;
			case "xlinkHref":
				if (r == null || typeof r == "function" || typeof r == "boolean" || typeof r == "symbol") {
					e.removeAttribute("xlink:href");
					break;
				}
				n = Wt("" + r), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
				break;
			case "contentEditable":
			case "spellCheck":
			case "draggable":
			case "value":
			case "autoReverse":
			case "externalResourcesRequired":
			case "focusable":
			case "preserveAlpha":
				r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, "" + r) : e.removeAttribute(n);
				break;
			case "inert":
			case "allowFullScreen":
			case "async":
			case "autoPlay":
			case "controls":
			case "default":
			case "defer":
			case "disabled":
			case "disablePictureInPicture":
			case "disableRemotePlayback":
			case "formNoValidate":
			case "hidden":
			case "loop":
			case "noModule":
			case "noValidate":
			case "open":
			case "playsInline":
			case "readOnly":
			case "required":
			case "reversed":
			case "scoped":
			case "seamless":
			case "itemScope":
				r && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, "") : e.removeAttribute(n);
				break;
			case "capture":
			case "download":
				!0 === r ? e.setAttribute(n, "") : !1 !== r && r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "cols":
			case "rows":
			case "size":
			case "span":
				r != null && typeof r != "function" && typeof r != "symbol" && !isNaN(r) && 1 <= r ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "rowSpan":
			case "start":
				r == null || typeof r == "function" || typeof r == "symbol" || isNaN(r) ? e.removeAttribute(n) : e.setAttribute(n, r);
				break;
			case "popover":
				$("beforetoggle", e), $("toggle", e), xt(e, "popover", r);
				break;
			case "xlinkActuate":
				Ct(e, "http://www.w3.org/1999/xlink", "xlink:actuate", r);
				break;
			case "xlinkArcrole":
				Ct(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", r);
				break;
			case "xlinkRole":
				Ct(e, "http://www.w3.org/1999/xlink", "xlink:role", r);
				break;
			case "xlinkShow":
				Ct(e, "http://www.w3.org/1999/xlink", "xlink:show", r);
				break;
			case "xlinkTitle":
				Ct(e, "http://www.w3.org/1999/xlink", "xlink:title", r);
				break;
			case "xlinkType":
				Ct(e, "http://www.w3.org/1999/xlink", "xlink:type", r);
				break;
			case "xmlBase":
				Ct(e, "http://www.w3.org/XML/1998/namespace", "xml:base", r);
				break;
			case "xmlLang":
				Ct(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", r);
				break;
			case "xmlSpace":
				Ct(e, "http://www.w3.org/XML/1998/namespace", "xml:space", r);
				break;
			case "is":
				xt(e, "is", r);
				break;
			case "innerText":
			case "textContent": break;
			default: (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") && (n = Ht.get(n) || n, xt(e, n, r));
		}
	}
	function Nd(e, t, n, r, a, o) {
		switch (n) {
			case "style":
				Bt(e, r, o);
				break;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						e.innerHTML = n;
					}
				}
				break;
			case "children":
				typeof r == "string" ? Lt(e, r) : (typeof r == "number" || typeof r == "bigint") && Lt(e, "" + r);
				break;
			case "onScroll":
				r != null && $("scroll", e);
				break;
			case "onScrollEnd":
				r != null && $("scrollend", e);
				break;
			case "onClick":
				r != null && (e.onclick = Gt);
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref": break;
			case "innerText":
			case "textContent": break;
			default: if (!ht.hasOwnProperty(n)) a: {
				if (n[0] === "o" && n[1] === "n" && (a = n.endsWith("Capture"), t = n.slice(2, a ? n.length - 7 : void 0), o = e[nt] || null, o = o == null ? null : o[n], typeof o == "function" && e.removeEventListener(t, o, a), typeof r == "function")) {
					typeof o != "function" && o !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(t, r, a);
					break a;
				}
				n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : xt(e, n, r);
			}
		}
	}
	function Pd(e, t, n) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "img":
				$("error", e), $("load", e);
				var r = !1, a = !1, o;
				for (o in n) if (n.hasOwnProperty(o)) {
					var s = n[o];
					if (s != null) switch (o) {
						case "src":
							r = !0;
							break;
						case "srcSet":
							a = !0;
							break;
						case "children":
						case "dangerouslySetInnerHTML": throw Error(i(137, t));
						default: Md(e, t, o, s, n, null);
					}
				}
				a && Md(e, t, "srcSet", n.srcSet, n, null), r && Md(e, t, "src", n.src, n, null);
				return;
			case "input":
				$("invalid", e);
				var c = o = s = a = null, l = null, u = null;
				for (r in n) if (n.hasOwnProperty(r)) {
					var d = n[r];
					if (d != null) switch (r) {
						case "name":
							a = d;
							break;
						case "type":
							s = d;
							break;
						case "checked":
							l = d;
							break;
						case "defaultChecked":
							u = d;
							break;
						case "value":
							o = d;
							break;
						case "defaultValue":
							c = d;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (d != null) throw Error(i(137, t));
							break;
						default: Md(e, t, r, d, n, null);
					}
				}
				Mt(e, o, c, l, u, s, a, !1);
				return;
			case "select":
				for (a in $("invalid", e), r = s = o = null, n) if (n.hasOwnProperty(a) && (c = n[a], c != null)) switch (a) {
					case "value":
						o = c;
						break;
					case "defaultValue":
						s = c;
						break;
					case "multiple": r = c;
					default: Md(e, t, a, c, n, null);
				}
				t = o, n = s, e.multiple = !!r, t == null ? n != null && Pt(e, !!r, n, !0) : Pt(e, !!r, t, !1);
				return;
			case "textarea":
				for (s in $("invalid", e), o = a = r = null, n) if (n.hasOwnProperty(s) && (c = n[s], c != null)) switch (s) {
					case "value":
						r = c;
						break;
					case "defaultValue":
						a = c;
						break;
					case "children":
						o = c;
						break;
					case "dangerouslySetInnerHTML":
						if (c != null) throw Error(i(91));
						break;
					default: Md(e, t, s, c, n, null);
				}
				It(e, r, a, o);
				return;
			case "option":
				for (l in n) if (n.hasOwnProperty(l) && (r = n[l], r != null)) switch (l) {
					case "selected":
						e.selected = r && typeof r != "function" && typeof r != "symbol";
						break;
					default: Md(e, t, l, r, n, null);
				}
				return;
			case "dialog":
				$("beforetoggle", e), $("toggle", e), $("cancel", e), $("close", e);
				break;
			case "iframe":
			case "object":
				$("load", e);
				break;
			case "video":
			case "audio":
				for (r = 0; r < _d.length; r++) $(_d[r], e);
				break;
			case "image":
				$("error", e), $("load", e);
				break;
			case "details":
				$("toggle", e);
				break;
			case "embed":
			case "source":
			case "link": $("error", e), $("load", e);
			case "area":
			case "base":
			case "br":
			case "col":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "track":
			case "wbr":
			case "menuitem":
				for (u in n) if (n.hasOwnProperty(u) && (r = n[u], r != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML": throw Error(i(137, t));
					default: Md(e, t, u, r, n, null);
				}
				return;
			default: if (Vt(t)) {
				for (d in n) n.hasOwnProperty(d) && (r = n[d], r !== void 0 && Nd(e, t, d, r, n, void 0));
				return;
			}
		}
		for (c in n) n.hasOwnProperty(c) && (r = n[c], r != null && Md(e, t, c, r, n, null));
	}
	function Fd(e, t, n, r) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "input":
				var a = null, o = null, s = null, c = null, l = null, u = null, d = null;
				for (m in n) {
					var f = n[m];
					if (n.hasOwnProperty(m) && f != null) switch (m) {
						case "checked": break;
						case "value": break;
						case "defaultValue": l = f;
						default: r.hasOwnProperty(m) || Md(e, t, m, null, r, f);
					}
				}
				for (var p in r) {
					var m = r[p];
					if (f = n[p], r.hasOwnProperty(p) && (m != null || f != null)) switch (p) {
						case "type":
							o = m;
							break;
						case "name":
							a = m;
							break;
						case "checked":
							u = m;
							break;
						case "defaultChecked":
							d = m;
							break;
						case "value":
							s = m;
							break;
						case "defaultValue":
							c = m;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (m != null) throw Error(i(137, t));
							break;
						default: m !== f && Md(e, t, p, m, r, f);
					}
				}
				jt(e, s, c, l, u, d, o, a);
				return;
			case "select":
				for (o in m = s = c = p = null, n) if (l = n[o], n.hasOwnProperty(o) && l != null) switch (o) {
					case "value": break;
					case "multiple": m = l;
					default: r.hasOwnProperty(o) || Md(e, t, o, null, r, l);
				}
				for (a in r) if (o = r[a], l = n[a], r.hasOwnProperty(a) && (o != null || l != null)) switch (a) {
					case "value":
						p = o;
						break;
					case "defaultValue":
						c = o;
						break;
					case "multiple": s = o;
					default: o !== l && Md(e, t, a, o, r, l);
				}
				t = c, n = s, r = m, p == null ? !!r != !!n && (t == null ? Pt(e, !!n, n ? [] : "", !1) : Pt(e, !!n, t, !0)) : Pt(e, !!n, p, !1);
				return;
			case "textarea":
				for (c in m = p = null, n) if (a = n[c], n.hasOwnProperty(c) && a != null && !r.hasOwnProperty(c)) switch (c) {
					case "value": break;
					case "children": break;
					default: Md(e, t, c, null, r, a);
				}
				for (s in r) if (a = r[s], o = n[s], r.hasOwnProperty(s) && (a != null || o != null)) switch (s) {
					case "value":
						p = a;
						break;
					case "defaultValue":
						m = a;
						break;
					case "children": break;
					case "dangerouslySetInnerHTML":
						if (a != null) throw Error(i(91));
						break;
					default: a !== o && Md(e, t, s, a, r, o);
				}
				Ft(e, p, m);
				return;
			case "option":
				for (var h in n) if (p = n[h], n.hasOwnProperty(h) && p != null && !r.hasOwnProperty(h)) switch (h) {
					case "selected":
						e.selected = !1;
						break;
					default: Md(e, t, h, null, r, p);
				}
				for (l in r) if (p = r[l], m = n[l], r.hasOwnProperty(l) && p !== m && (p != null || m != null)) switch (l) {
					case "selected":
						e.selected = p && typeof p != "function" && typeof p != "symbol";
						break;
					default: Md(e, t, l, p, r, m);
				}
				return;
			case "img":
			case "link":
			case "area":
			case "base":
			case "br":
			case "col":
			case "embed":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "source":
			case "track":
			case "wbr":
			case "menuitem":
				for (var g in n) p = n[g], n.hasOwnProperty(g) && p != null && !r.hasOwnProperty(g) && Md(e, t, g, null, r, p);
				for (u in r) if (p = r[u], m = n[u], r.hasOwnProperty(u) && p !== m && (p != null || m != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML":
						if (p != null) throw Error(i(137, t));
						break;
					default: Md(e, t, u, p, r, m);
				}
				return;
			default: if (Vt(t)) {
				for (var _ in n) p = n[_], n.hasOwnProperty(_) && p !== void 0 && !r.hasOwnProperty(_) && Nd(e, t, _, void 0, r, p);
				for (d in r) p = r[d], m = n[d], !r.hasOwnProperty(d) || p === m || p === void 0 && m === void 0 || Nd(e, t, d, p, r, m);
				return;
			}
		}
		for (var v in n) p = n[v], n.hasOwnProperty(v) && p != null && !r.hasOwnProperty(v) && Md(e, t, v, null, r, p);
		for (f in r) p = r[f], m = n[f], !r.hasOwnProperty(f) || p === m || p == null && m == null || Md(e, t, f, p, r, m);
	}
	function Id(e) {
		switch (e) {
			case "css":
			case "script":
			case "font":
			case "img":
			case "image":
			case "input":
			case "link": return !0;
			default: return !1;
		}
	}
	function Ld() {
		if (typeof performance.getEntriesByType == "function") {
			for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), r = 0; r < n.length; r++) {
				var i = n[r], a = i.transferSize, o = i.initiatorType, s = i.duration;
				if (a && s && Id(o)) {
					for (o = 0, s = i.responseEnd, r += 1; r < n.length; r++) {
						var c = n[r], l = c.startTime;
						if (l > s) break;
						var u = c.transferSize, d = c.initiatorType;
						u && Id(d) && (c = c.responseEnd, o += u * (c < s ? 1 : (s - l) / (c - l)));
					}
					if (--r, t += 8 * (a + o) / (i.duration / 1e3), e++, 10 < e) break;
				}
			}
			if (0 < e) return t / e / 1e6;
		}
		return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
	}
	var Rd = null, zd = null;
	function Bd(e) {
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	function Vd(e) {
		switch (e) {
			case "http://www.w3.org/2000/svg": return 1;
			case "http://www.w3.org/1998/Math/MathML": return 2;
			default: return 0;
		}
	}
	function Hd(e, t) {
		if (e === 0) switch (t) {
			case "svg": return 1;
			case "math": return 2;
			default: return 0;
		}
		return e === 1 && t === "foreignObject" ? 0 : e;
	}
	function Ud(e, t) {
		return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
	}
	var Wd = null;
	function Gd() {
		var e = window.event;
		return e && e.type === "popstate" ? e === Wd ? !1 : (Wd = e, !0) : (Wd = null, !1);
	}
	var Kd = typeof setTimeout == "function" ? setTimeout : void 0, qd = typeof clearTimeout == "function" ? clearTimeout : void 0, Jd = typeof Promise == "function" ? Promise : void 0, Yd = typeof queueMicrotask == "function" ? queueMicrotask : Jd === void 0 ? Kd : function(e) {
		return Jd.resolve(null).then(e).catch(Xd);
	};
	function Xd(e) {
		setTimeout(function() {
			throw e;
		});
	}
	function Zd(e) {
		return e === "head";
	}
	function Qd(e, t) {
		var n = t, r = 0;
		do {
			var i = n.nextSibling;
			if (e.removeChild(n), i && i.nodeType === 8) if (n = i.data, n === "/$" || n === "/&") {
				if (r === 0) {
					e.removeChild(i), Np(t);
					return;
				}
				r--;
			} else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&") r++;
			else if (n === "html") pf(e.ownerDocument.documentElement);
			else if (n === "head") {
				n = e.ownerDocument.head, pf(n);
				for (var a = n.firstChild; a;) {
					var o = a.nextSibling, s = a.nodeName;
					a[ct] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && a.rel.toLowerCase() === "stylesheet" || n.removeChild(a), a = o;
				}
			} else n === "body" && pf(e.ownerDocument.body);
			n = i;
		} while (n);
		Np(t);
	}
	function $d(e, t) {
		var n = e;
		e = 0;
		do {
			var r = n.nextSibling;
			if (n.nodeType === 1 ? t ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (t ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), r && r.nodeType === 8) if (n = r.data, n === "/$") {
				if (e === 0) break;
				e--;
			} else n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || e++;
			n = r;
		} while (n);
	}
	function ef(e) {
		var t = e.firstChild;
		for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
			var n = t;
			switch (t = t.nextSibling, n.nodeName) {
				case "HTML":
				case "HEAD":
				case "BODY":
					ef(n), lt(n);
					continue;
				case "SCRIPT":
				case "STYLE": continue;
				case "LINK": if (n.rel.toLowerCase() === "stylesheet") continue;
			}
			e.removeChild(n);
		}
	}
	function tf(e, t, n, r) {
		for (; e.nodeType === 1;) {
			var i = n;
			if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
				if (!r && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
			} else if (!r) if (t === "input" && e.type === "hidden") {
				var a = i.name == null ? null : "" + i.name;
				if (i.type === "hidden" && e.getAttribute("name") === a) return e;
			} else return e;
			else if (!e[ct]) switch (t) {
				case "meta":
					if (!e.hasAttribute("itemprop")) break;
					return e;
				case "link":
					if (a = e.getAttribute("rel"), a === "stylesheet" && e.hasAttribute("data-precedence") || a !== i.rel || e.getAttribute("href") !== (i.href == null || i.href === "" ? null : i.href) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin) || e.getAttribute("title") !== (i.title == null ? null : i.title)) break;
					return e;
				case "style":
					if (e.hasAttribute("data-precedence")) break;
					return e;
				case "script":
					if (a = e.getAttribute("src"), (a !== (i.src == null ? null : i.src) || e.getAttribute("type") !== (i.type == null ? null : i.type) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin)) && a && e.hasAttribute("async") && !e.hasAttribute("itemprop")) break;
					return e;
				default: return e;
			}
			if (e = cf(e.nextSibling), e === null) break;
		}
		return null;
	}
	function nf(e, t, n) {
		if (t === "") return null;
		for (; e.nodeType !== 3;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = cf(e.nextSibling), e === null)) return null;
		return e;
	}
	function rf(e, t) {
		for (; e.nodeType !== 8;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = cf(e.nextSibling), e === null)) return null;
		return e;
	}
	function af(e) {
		return e.data === "$?" || e.data === "$~";
	}
	function of(e) {
		return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
	}
	function sf(e, t) {
		var n = e.ownerDocument;
		if (e.data === "$~") e._reactRetry = t;
		else if (e.data !== "$?" || n.readyState !== "loading") t();
		else {
			var r = function() {
				t(), n.removeEventListener("DOMContentLoaded", r);
			};
			n.addEventListener("DOMContentLoaded", r), e._reactRetry = r;
		}
	}
	function cf(e) {
		for (; e != null; e = e.nextSibling) {
			var t = e.nodeType;
			if (t === 1 || t === 3) break;
			if (t === 8) {
				if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F") break;
				if (t === "/$" || t === "/&") return null;
			}
		}
		return e;
	}
	var lf = null;
	function uf(e) {
		e = e.nextSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "/$" || n === "/&") {
					if (t === 0) return cf(e.nextSibling);
					t--;
				} else n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || t++;
			}
			e = e.nextSibling;
		}
		return null;
	}
	function df(e) {
		e = e.previousSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
					if (t === 0) return e;
					t--;
				} else n !== "/$" && n !== "/&" || t++;
			}
			e = e.previousSibling;
		}
		return null;
	}
	function ff(e, t, n) {
		switch (t = Bd(n), e) {
			case "html":
				if (e = t.documentElement, !e) throw Error(i(452));
				return e;
			case "head":
				if (e = t.head, !e) throw Error(i(453));
				return e;
			case "body":
				if (e = t.body, !e) throw Error(i(454));
				return e;
			default: throw Error(i(451));
		}
	}
	function pf(e) {
		for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
		lt(e);
	}
	var mf = /* @__PURE__ */ new Map(), hf = /* @__PURE__ */ new Set();
	function gf(e) {
		return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
	}
	var _f = L.d;
	L.d = {
		f: vf,
		r: yf,
		D: Sf,
		C: Cf,
		L: wf,
		m: Tf,
		X: Df,
		S: Ef,
		M: Of
	};
	function vf() {
		var e = _f.f(), t = yu();
		return e || t;
	}
	function yf(e) {
		var t = ut(e);
		t !== null && t.tag === 5 && t.type === "form" ? xs(t) : _f.r(e);
	}
	var bf = typeof document > "u" ? null : document;
	function xf(e, t, n) {
		var r = bf;
		if (r && typeof t == "string" && t) {
			var i = At(t);
			i = "link[rel=\"" + e + "\"][href=\"" + i + "\"]", typeof n == "string" && (i += "[crossorigin=\"" + n + "\"]"), hf.has(i) || (hf.add(i), e = {
				rel: e,
				crossOrigin: n,
				href: t
			}, r.querySelector(i) === null && (t = r.createElement("link"), Pd(t, "link", e), pt(t), r.head.appendChild(t)));
		}
	}
	function Sf(e) {
		_f.D(e), xf("dns-prefetch", e, null);
	}
	function Cf(e, t) {
		_f.C(e, t), xf("preconnect", e, t);
	}
	function wf(e, t, n) {
		_f.L(e, t, n);
		var r = bf;
		if (r && e && t) {
			var i = "link[rel=\"preload\"][as=\"" + At(t) + "\"]";
			t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + At(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + At(n.imageSizes) + "\"]")) : i += "[href=\"" + At(e) + "\"]";
			var a = i;
			switch (t) {
				case "style":
					a = Af(e);
					break;
				case "script": a = Pf(e);
			}
			mf.has(a) || (e = h({
				rel: "preload",
				href: t === "image" && n && n.imageSrcSet ? void 0 : e,
				as: t
			}, n), mf.set(a, e), r.querySelector(i) !== null || t === "style" && r.querySelector(jf(a)) || t === "script" && r.querySelector(Ff(a)) || (t = r.createElement("link"), Pd(t, "link", e), pt(t), r.head.appendChild(t)));
		}
	}
	function Tf(e, t) {
		_f.m(e, t);
		var n = bf;
		if (n && e) {
			var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + At(r) + "\"][href=\"" + At(e) + "\"]", a = i;
			switch (r) {
				case "audioworklet":
				case "paintworklet":
				case "serviceworker":
				case "sharedworker":
				case "worker":
				case "script": a = Pf(e);
			}
			if (!mf.has(a) && (e = h({
				rel: "modulepreload",
				href: e
			}, t), mf.set(a, e), n.querySelector(i) === null)) {
				switch (r) {
					case "audioworklet":
					case "paintworklet":
					case "serviceworker":
					case "sharedworker":
					case "worker":
					case "script": if (n.querySelector(Ff(a))) return;
				}
				r = n.createElement("link"), Pd(r, "link", e), pt(r), n.head.appendChild(r);
			}
		}
	}
	function Ef(e, t, n) {
		_f.S(e, t, n);
		var r = bf;
		if (r && e) {
			var i = ft(r).hoistableStyles, a = Af(e);
			t ||= "default";
			var o = i.get(a);
			if (!o) {
				var s = {
					loading: 0,
					preload: null
				};
				if (o = r.querySelector(jf(a))) s.loading = 5;
				else {
					e = h({
						rel: "stylesheet",
						href: e,
						"data-precedence": t
					}, n), (n = mf.get(a)) && Rf(e, n);
					var c = o = r.createElement("link");
					pt(c), Pd(c, "link", e), c._p = new Promise(function(e, t) {
						c.onload = e, c.onerror = t;
					}), c.addEventListener("load", function() {
						s.loading |= 1;
					}), c.addEventListener("error", function() {
						s.loading |= 2;
					}), s.loading |= 4, Lf(o, t, r);
				}
				o = {
					type: "stylesheet",
					instance: o,
					count: 1,
					state: s
				}, i.set(a, o);
			}
		}
	}
	function Df(e, t) {
		_f.X(e, t);
		var n = bf;
		if (n && e) {
			var r = ft(n).hoistableScripts, i = Pf(e), a = r.get(i);
			a || (a = n.querySelector(Ff(i)), a || (e = h({
				src: e,
				async: !0
			}, t), (t = mf.get(i)) && zf(e, t), a = n.createElement("script"), pt(a), Pd(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Of(e, t) {
		_f.M(e, t);
		var n = bf;
		if (n && e) {
			var r = ft(n).hoistableScripts, i = Pf(e), a = r.get(i);
			a || (a = n.querySelector(Ff(i)), a || (e = h({
				src: e,
				async: !0,
				type: "module"
			}, t), (t = mf.get(i)) && zf(e, t), a = n.createElement("script"), pt(a), Pd(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function kf(e, t, n, r) {
		var a = (a = U.current) ? gf(a) : null;
		if (!a) throw Error(i(446));
		switch (e) {
			case "meta":
			case "title": return null;
			case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (t = Af(n.href), n = ft(a).hoistableStyles, r = n.get(t), r || (r = {
				type: "style",
				instance: null,
				count: 0,
				state: null
			}, n.set(t, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			case "link":
				if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
					e = Af(n.href);
					var o = ft(a).hoistableStyles, s = o.get(e);
					if (s || (a = a.ownerDocument || a, s = {
						type: "stylesheet",
						instance: null,
						count: 0,
						state: {
							loading: 0,
							preload: null
						}
					}, o.set(e, s), (o = a.querySelector(jf(e))) && !o._p && (s.instance = o, s.state.loading = 5), mf.has(e) || (n = {
						rel: "preload",
						as: "style",
						href: n.href,
						crossOrigin: n.crossOrigin,
						integrity: n.integrity,
						media: n.media,
						hrefLang: n.hrefLang,
						referrerPolicy: n.referrerPolicy
					}, mf.set(e, n), o || Nf(a, e, n, s.state))), t && r === null) throw Error(i(528, ""));
					return s;
				}
				if (t && r !== null) throw Error(i(529, ""));
				return null;
			case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = Pf(n), n = ft(a).hoistableScripts, r = n.get(t), r || (r = {
				type: "script",
				instance: null,
				count: 0,
				state: null
			}, n.set(t, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			default: throw Error(i(444, e));
		}
	}
	function Af(e) {
		return "href=\"" + At(e) + "\"";
	}
	function jf(e) {
		return "link[rel=\"stylesheet\"][" + e + "]";
	}
	function Mf(e) {
		return h({}, e, {
			"data-precedence": e.precedence,
			precedence: null
		});
	}
	function Nf(e, t, n, r) {
		e.querySelector("link[rel=\"preload\"][as=\"style\"][" + t + "]") ? r.loading = 1 : (t = e.createElement("link"), r.preload = t, t.addEventListener("load", function() {
			return r.loading |= 1;
		}), t.addEventListener("error", function() {
			return r.loading |= 2;
		}), Pd(t, "link", n), pt(t), e.head.appendChild(t));
	}
	function Pf(e) {
		return "[src=\"" + At(e) + "\"]";
	}
	function Ff(e) {
		return "script[async]" + e;
	}
	function If(e, t, n) {
		if (t.count++, t.instance === null) switch (t.type) {
			case "style":
				var r = e.querySelector("style[data-href~=\"" + At(n.href) + "\"]");
				if (r) return t.instance = r, pt(r), r;
				var a = h({}, n, {
					"data-href": n.href,
					"data-precedence": n.precedence,
					href: null,
					precedence: null
				});
				return r = (e.ownerDocument || e).createElement("style"), pt(r), Pd(r, "style", a), Lf(r, n.precedence, e), t.instance = r;
			case "stylesheet":
				a = Af(n.href);
				var o = e.querySelector(jf(a));
				if (o) return t.state.loading |= 4, t.instance = o, pt(o), o;
				r = Mf(n), (a = mf.get(a)) && Rf(r, a), o = (e.ownerDocument || e).createElement("link"), pt(o);
				var s = o;
				return s._p = new Promise(function(e, t) {
					s.onload = e, s.onerror = t;
				}), Pd(o, "link", r), t.state.loading |= 4, Lf(o, n.precedence, e), t.instance = o;
			case "script": return o = Pf(n.src), (a = e.querySelector(Ff(o))) ? (t.instance = a, pt(a), a) : (r = n, (a = mf.get(o)) && (r = h({}, n), zf(r, a)), e = e.ownerDocument || e, a = e.createElement("script"), pt(a), Pd(a, "link", r), e.head.appendChild(a), t.instance = a);
			case "void": return null;
			default: throw Error(i(443, t.type));
		}
		else t.type === "stylesheet" && !(t.state.loading & 4) && (r = t.instance, t.state.loading |= 4, Lf(r, n.precedence, e));
		return t.instance;
	}
	function Lf(e, t, n) {
		for (var r = n.querySelectorAll("link[rel=\"stylesheet\"][data-precedence],style[data-precedence]"), i = r.length ? r[r.length - 1] : null, a = i, o = 0; o < r.length; o++) {
			var s = r[o];
			if (s.dataset.precedence === t) a = s;
			else if (a !== i) break;
		}
		a ? a.parentNode.insertBefore(e, a.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
	}
	function Rf(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.title ??= t.title;
	}
	function zf(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.integrity ??= t.integrity;
	}
	var Bf = null;
	function Vf(e, t, n) {
		if (Bf === null) {
			var r = /* @__PURE__ */ new Map(), i = Bf = /* @__PURE__ */ new Map();
			i.set(n, r);
		} else i = Bf, r = i.get(n), r || (r = /* @__PURE__ */ new Map(), i.set(n, r));
		if (r.has(e)) return r;
		for (r.set(e, null), n = n.getElementsByTagName(e), i = 0; i < n.length; i++) {
			var a = n[i];
			if (!(a[ct] || a[tt] || e === "link" && a.getAttribute("rel") === "stylesheet") && a.namespaceURI !== "http://www.w3.org/2000/svg") {
				var o = a.getAttribute(t) || "";
				o = e + o;
				var s = r.get(o);
				s ? s.push(a) : r.set(o, [a]);
			}
		}
		return r;
	}
	function Hf(e, t, n) {
		e = e.ownerDocument || e, e.head.insertBefore(n, t === "title" ? e.querySelector("head > title") : null);
	}
	function Uf(e, t, n) {
		if (n === 1 || t.itemProp != null) return !1;
		switch (e) {
			case "meta":
			case "title": return !0;
			case "style":
				if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "") break;
				return !0;
			case "link":
				if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError) break;
				switch (t.rel) {
					case "stylesheet": return e = t.disabled, typeof t.precedence == "string" && e == null;
					default: return !0;
				}
			case "script": if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string") return !0;
		}
		return !1;
	}
	function Wf(e) {
		return !(e.type === "stylesheet" && !(e.state.loading & 3));
	}
	function Gf(e, t, n, r) {
		if (n.type === "stylesheet" && (typeof r.media != "string" || !1 !== matchMedia(r.media).matches) && !(n.state.loading & 4)) {
			if (n.instance === null) {
				var i = Af(r.href), a = t.querySelector(jf(i));
				if (a) {
					t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = Jf.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = a, pt(a);
					return;
				}
				a = t.ownerDocument || t, r = Mf(r), (i = mf.get(i)) && Rf(r, i), a = a.createElement("link"), pt(a);
				var o = a;
				o._p = new Promise(function(e, t) {
					o.onload = e, o.onerror = t;
				}), Pd(a, "link", r), n.instance = a;
			}
			e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && !(n.state.loading & 3) && (e.count++, n = Jf.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
		}
	}
	var Kf = 0;
	function qf(e, t) {
		return e.stylesheets && e.count === 0 && Xf(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
			var r = setTimeout(function() {
				if (e.stylesheets && Xf(e, e.stylesheets), e.unsuspend) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, 6e4 + t);
			0 < e.imgBytes && Kf === 0 && (Kf = 62500 * Ld());
			var i = setTimeout(function() {
				if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && Xf(e, e.stylesheets), e.unsuspend)) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, (e.imgBytes > Kf ? 50 : 800) + t);
			return e.unsuspend = n, function() {
				e.unsuspend = null, clearTimeout(r), clearTimeout(i);
			};
		} : null;
	}
	function Jf() {
		if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
			if (this.stylesheets) Xf(this, this.stylesheets);
			else if (this.unsuspend) {
				var e = this.unsuspend;
				this.unsuspend = null, e();
			}
		}
	}
	var Yf = null;
	function Xf(e, t) {
		e.stylesheets = null, e.unsuspend !== null && (e.count++, Yf = /* @__PURE__ */ new Map(), t.forEach(Zf, e), Yf = null, Jf.call(e));
	}
	function Zf(e, t) {
		if (!(t.state.loading & 4)) {
			var n = Yf.get(e);
			if (n) var r = n.get(null);
			else {
				n = /* @__PURE__ */ new Map(), Yf.set(e, n);
				for (var i = e.querySelectorAll("link[data-precedence],style[data-precedence]"), a = 0; a < i.length; a++) {
					var o = i[a];
					(o.nodeName === "LINK" || o.getAttribute("media") !== "not all") && (n.set(o.dataset.precedence, o), r = o);
				}
				r && n.set(null, r);
			}
			i = t.instance, o = i.getAttribute("data-precedence"), a = n.get(o) || r, a === r && n.set(null, i), n.set(o, i), this.count++, r = Jf.bind(this), i.addEventListener("load", r), i.addEventListener("error", r), a ? a.parentNode.insertBefore(i, a.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(i, e.firstChild)), t.state.loading |= 4;
		}
	}
	var Qf = {
		$$typeof: C,
		Provider: null,
		Consumer: null,
		_currentValue: R,
		_currentValue2: R,
		_threadCount: 0
	};
	function $f(e, t, n, r, i, a, o, s, c) {
		this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = We(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = We(0), this.hiddenUpdates = We(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function ep(e, t, n, r, i, a, o, s, c, l, u, d) {
		return e = new $f(e, t, n, o, c, l, u, d, s), t = 1, !0 === a && (t |= 24), a = $r(3, null, null, t), e.current = a, a.stateNode = e, t = ea(), t.refCount++, e.pooledCache = t, t.refCount++, a.memoizedState = {
			element: r,
			isDehydrated: n,
			cache: t
		}, Na(a), e;
	}
	function tp(e) {
		return e ? (e = Zr, e) : Zr;
	}
	function np(e, t, n, r, i, a) {
		i = tp(i), r.context === null ? r.context = i : r.pendingContext = i, r = Fa(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (r.callback = a), n = Ia(e, r, t), n !== null && (mu(n, e, t), La(n, e, t));
	}
	function rp(e, t) {
		if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
			var n = e.retryLane;
			e.retryLane = n !== 0 && n < t ? n : t;
		}
	}
	function ip(e, t) {
		rp(e, t), (e = e.alternate) && rp(e, t);
	}
	function ap(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = Jr(e, 67108864);
			t !== null && mu(t, e, 67108864), ip(e, 67108864);
		}
	}
	function op(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = fu();
			t = Xe(t);
			var n = Jr(e, t);
			n !== null && mu(n, e, t), ip(e, t);
		}
	}
	var sp = !0;
	function cp(e, t, n, r) {
		var i = I.T;
		I.T = null;
		var a = L.p;
		try {
			L.p = 2, up(e, t, n, r);
		} finally {
			L.p = a, I.T = i;
		}
	}
	function lp(e, t, n, r) {
		var i = I.T;
		I.T = null;
		var a = L.p;
		try {
			L.p = 8, up(e, t, n, r);
		} finally {
			L.p = a, I.T = i;
		}
	}
	function up(e, t, n, r) {
		if (sp) {
			var i = dp(r);
			if (i === null) Cd(e, t, r, fp, n), Cp(e, r);
			else if (Tp(i, e, t, n, r)) r.stopPropagation();
			else if (Cp(e, r), t & 4 && -1 < Sp.indexOf(e)) {
				for (; i !== null;) {
					var a = ut(i);
					if (a !== null) switch (a.tag) {
						case 3:
							if (a = a.stateNode, a.current.memoizedState.isDehydrated) {
								var o = ze(a.pendingLanes);
								if (o !== 0) {
									var s = a;
									for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
										var c = 1 << 31 - Me(o);
										s.entanglements[1] |= c, o &= ~c;
									}
									rd(a), !(Fl & 6) && (eu = be() + 500, id(0, !1));
								}
							}
							break;
						case 31:
						case 13: s = Jr(a, 2), s !== null && mu(s, a, 2), yu(), ip(a, 2);
					}
					if (a = dp(r), a === null && Cd(e, t, r, fp, n), a === i) break;
					i = a;
				}
				i !== null && r.stopPropagation();
			} else Cd(e, t, r, null, n);
		}
	}
	function dp(e) {
		return e = qt(e), pp(e);
	}
	var fp = null;
	function pp(e) {
		if (fp = null, e = W(e), e !== null) {
			var t = o(e);
			if (t === null) e = null;
			else {
				var n = t.tag;
				if (n === 13) {
					if (e = s(t), e !== null) return e;
					e = null;
				} else if (n === 31) {
					if (e = c(t), e !== null) return e;
					e = null;
				} else if (n === 3) {
					if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
					e = null;
				} else t !== e && (e = null);
			}
		}
		return fp = e, null;
	}
	function mp(e) {
		switch (e) {
			case "beforetoggle":
			case "cancel":
			case "click":
			case "close":
			case "contextmenu":
			case "copy":
			case "cut":
			case "auxclick":
			case "dblclick":
			case "dragend":
			case "dragstart":
			case "drop":
			case "focusin":
			case "focusout":
			case "input":
			case "invalid":
			case "keydown":
			case "keypress":
			case "keyup":
			case "mousedown":
			case "mouseup":
			case "paste":
			case "pause":
			case "play":
			case "pointercancel":
			case "pointerdown":
			case "pointerup":
			case "ratechange":
			case "reset":
			case "resize":
			case "seeked":
			case "submit":
			case "toggle":
			case "touchcancel":
			case "touchend":
			case "touchstart":
			case "volumechange":
			case "change":
			case "selectionchange":
			case "textInput":
			case "compositionstart":
			case "compositionend":
			case "compositionupdate":
			case "beforeblur":
			case "afterblur":
			case "beforeinput":
			case "blur":
			case "fullscreenchange":
			case "focus":
			case "hashchange":
			case "popstate":
			case "select":
			case "selectstart": return 2;
			case "drag":
			case "dragenter":
			case "dragexit":
			case "dragleave":
			case "dragover":
			case "mousemove":
			case "mouseout":
			case "mouseover":
			case "pointermove":
			case "pointerout":
			case "pointerover":
			case "scroll":
			case "touchmove":
			case "wheel":
			case "mouseenter":
			case "mouseleave":
			case "pointerenter":
			case "pointerleave": return 8;
			case "message": switch (xe()) {
				case Se: return 2;
				case Ce: return 8;
				case we:
				case Te: return 32;
				case Ee: return 268435456;
				default: return 32;
			}
			default: return 32;
		}
	}
	var hp = !1, gp = null, _p = null, vp = null, yp = /* @__PURE__ */ new Map(), bp = /* @__PURE__ */ new Map(), xp = [], Sp = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
	function Cp(e, t) {
		switch (e) {
			case "focusin":
			case "focusout":
				gp = null;
				break;
			case "dragenter":
			case "dragleave":
				_p = null;
				break;
			case "mouseover":
			case "mouseout":
				vp = null;
				break;
			case "pointerover":
			case "pointerout":
				yp.delete(t.pointerId);
				break;
			case "gotpointercapture":
			case "lostpointercapture": bp.delete(t.pointerId);
		}
	}
	function wp(e, t, n, r, i, a) {
		return e === null || e.nativeEvent !== a ? (e = {
			blockedOn: t,
			domEventName: n,
			eventSystemFlags: r,
			nativeEvent: a,
			targetContainers: [i]
		}, t !== null && (t = ut(t), t !== null && ap(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
	}
	function Tp(e, t, n, r, i) {
		switch (t) {
			case "focusin": return gp = wp(gp, e, t, n, r, i), !0;
			case "dragenter": return _p = wp(_p, e, t, n, r, i), !0;
			case "mouseover": return vp = wp(vp, e, t, n, r, i), !0;
			case "pointerover":
				var a = i.pointerId;
				return yp.set(a, wp(yp.get(a) || null, e, t, n, r, i)), !0;
			case "gotpointercapture": return a = i.pointerId, bp.set(a, wp(bp.get(a) || null, e, t, n, r, i)), !0;
		}
		return !1;
	}
	function Ep(e) {
		var t = W(e.target);
		if (t !== null) {
			var n = o(t);
			if (n !== null) {
				if (t = n.tag, t === 13) {
					if (t = s(n), t !== null) {
						e.blockedOn = t, $e(e.priority, function() {
							op(n);
						});
						return;
					}
				} else if (t === 31) {
					if (t = c(n), t !== null) {
						e.blockedOn = t, $e(e.priority, function() {
							op(n);
						});
						return;
					}
				} else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
					e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
					return;
				}
			}
		}
		e.blockedOn = null;
	}
	function Dp(e) {
		if (e.blockedOn !== null) return !1;
		for (var t = e.targetContainers; 0 < t.length;) {
			var n = dp(e.nativeEvent);
			if (n === null) {
				n = e.nativeEvent;
				var r = new n.constructor(n.type, n);
				Kt = r, n.target.dispatchEvent(r), Kt = null;
			} else return t = ut(n), t !== null && ap(t), e.blockedOn = n, !1;
			t.shift();
		}
		return !0;
	}
	function Op(e, t, n) {
		Dp(e) && n.delete(t);
	}
	function kp() {
		hp = !1, gp !== null && Dp(gp) && (gp = null), _p !== null && Dp(_p) && (_p = null), vp !== null && Dp(vp) && (vp = null), yp.forEach(Op), bp.forEach(Op);
	}
	function Ap(e, n) {
		e.blockedOn === n && (e.blockedOn = null, hp || (hp = !0, t.unstable_scheduleCallback(t.unstable_NormalPriority, kp)));
	}
	var jp = null;
	function Mp(e) {
		jp !== e && (jp = e, t.unstable_scheduleCallback(t.unstable_NormalPriority, function() {
			jp === e && (jp = null);
			for (var t = 0; t < e.length; t += 3) {
				var n = e[t], r = e[t + 1], i = e[t + 2];
				if (typeof r != "function") {
					if (pp(r || n) === null) continue;
					break;
				}
				var a = ut(n);
				a !== null && (e.splice(t, 3), t -= 3, ys(a, {
					pending: !0,
					data: i,
					method: n.method,
					action: r
				}, r, i));
			}
		}));
	}
	function Np(e) {
		function t(t) {
			return Ap(t, e);
		}
		gp !== null && Ap(gp, e), _p !== null && Ap(_p, e), vp !== null && Ap(vp, e), yp.forEach(t), bp.forEach(t);
		for (var n = 0; n < xp.length; n++) {
			var r = xp[n];
			r.blockedOn === e && (r.blockedOn = null);
		}
		for (; 0 < xp.length && (n = xp[0], n.blockedOn === null);) Ep(n), n.blockedOn === null && xp.shift();
		if (n = (e.ownerDocument || e).$$reactFormReplay, n != null) for (r = 0; r < n.length; r += 3) {
			var i = n[r], a = n[r + 1], o = i[nt] || null;
			if (typeof a == "function") o || Mp(n);
			else if (o) {
				var s = null;
				if (a && a.hasAttribute("formAction")) {
					if (i = a, o = a[nt] || null) s = o.formAction;
					else if (pp(i) !== null) continue;
				} else s = o.action;
				typeof s == "function" ? n[r + 1] = s : (n.splice(r, 3), r -= 3), Mp(n);
			}
		}
	}
	function Pp() {
		function e(e) {
			e.canIntercept && e.info === "react-transition" && e.intercept({
				handler: function() {
					return new Promise(function(e) {
						return i = e;
					});
				},
				focusReset: "manual",
				scroll: "manual"
			});
		}
		function t() {
			i !== null && (i(), i = null), r || setTimeout(n, 20);
		}
		function n() {
			if (!r && !navigation.transition) {
				var e = navigation.currentEntry;
				e && e.url != null && navigation.navigate(e.url, {
					state: e.getState(),
					info: "react-transition",
					history: "replace"
				});
			}
		}
		if (typeof navigation == "object") {
			var r = !1, i = null;
			return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(n, 100), function() {
				r = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), i !== null && (i(), i = null);
			};
		}
	}
	function Fp(e) {
		this._internalRoot = e;
	}
	Ip.prototype.render = Fp.prototype.render = function(e) {
		var t = this._internalRoot;
		if (t === null) throw Error(i(409));
		var n = t.current;
		np(n, fu(), e, t, null, null);
	}, Ip.prototype.unmount = Fp.prototype.unmount = function() {
		var e = this._internalRoot;
		if (e !== null) {
			this._internalRoot = null;
			var t = e.containerInfo;
			np(e.current, 2, null, e, null, null), yu(), t[rt] = null;
		}
	};
	function Ip(e) {
		this._internalRoot = e;
	}
	Ip.prototype.unstable_scheduleHydration = function(e) {
		if (e) {
			var t = Qe();
			e = {
				blockedOn: null,
				target: e,
				priority: t
			};
			for (var n = 0; n < xp.length && t !== 0 && t < xp[n].priority; n++);
			xp.splice(n, 0, e), n === 0 && Ep(e);
		}
	};
	var Lp = n.version;
	if (Lp !== "19.2.6") throw Error(i(527, Lp, "19.2.6"));
	L.findDOMNode = function(e) {
		var t = e._reactInternals;
		if (t === void 0) throw typeof e.render == "function" ? Error(i(188)) : (e = Object.keys(e).join(","), Error(i(268, e)));
		return e = d(t), e = e === null ? null : p(e), e = e === null ? null : e.stateNode, e;
	};
	var Rp = {
		bundleType: 0,
		version: "19.2.6",
		rendererPackageName: "react-dom",
		currentDispatcherRef: I,
		reconcilerVersion: "19.2.6"
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var zp = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!zp.isDisabled && zp.supportsFiber) try {
			ke = zp.inject(Rp), Ae = zp;
		} catch {}
	}
	e.createRoot = function(e, t) {
		if (!a(e)) throw Error(i(299));
		var n = !1, r = "", o = Hs, s = Us, c = Ws;
		return t != null && (!0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (o = t.onUncaughtError), t.onCaughtError !== void 0 && (s = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = ep(e, 1, !1, null, null, n, r, null, o, s, c, Pp), e[rt] = t.current, xd(e), new Fp(t);
	};
})), g = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = h();
})), _ = /* @__PURE__ */ c(u()), v = g();
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.2.9_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/utils/esm/mergeObjects.js
function y(e, t) {
	if (e && !t) return e;
	if (!e && t) return t;
	if (e || t) return {
		...e,
		...t
	};
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/merge-props/mergeProps.js
var b = {};
function x(e, t, n, r, i) {
	if (!n && !r && !i && !e) return C(t);
	let a = C(e);
	return t && (a = w(a, t)), n && (a = w(a, n)), r && (a = w(a, r)), i && (a = w(a, i)), a;
}
function S(e) {
	if (e.length === 0) return b;
	if (e.length === 1) return C(e[0]);
	let t = C(e[0]);
	for (let n = 1; n < e.length; n += 1) t = w(t, e[n]);
	return t;
}
function C(e) {
	return O(e) ? { ...k(e, b) } : T(e);
}
function w(e, t) {
	return O(t) ? k(t, e) : E(e, t);
}
function T(e) {
	let t = { ...e };
	for (let e in t) {
		let n = t[e];
		D(e, n) && (t[e] = j(n));
	}
	return t;
}
function E(e, t) {
	if (!t) return e;
	for (let n in t) {
		let r = t[n];
		switch (n) {
			case "style":
				e[n] = y(e.style, r);
				break;
			case "className":
				e[n] = N(e.className, r);
				break;
			default: D(n, r) ? e[n] = A(e[n], r) : e[n] = r;
		}
	}
	return e;
}
function D(e, t) {
	let n = e.charCodeAt(0), r = e.charCodeAt(1), i = e.charCodeAt(2);
	return n === 111 && r === 110 && i >= 65 && i <= 90 && (typeof t == "function" || t === void 0);
}
function O(e) {
	return typeof e == "function";
}
function k(e, t) {
	return O(e) ? e(t) : e ?? b;
}
function A(e, t) {
	return t ? e ? (...n) => {
		let r = n[0];
		if (P(r)) {
			let i = r;
			M(i);
			let a = t(...n);
			return i.baseUIHandlerPrevented || e?.(...n), a;
		}
		let i = t(...n);
		return e?.(...n), i;
	} : j(t) : e;
}
function j(e) {
	return e && ((...t) => {
		let n = t[0];
		return P(n) && M(n), e(...t);
	});
}
function M(e) {
	return e.preventBaseUIHandler = () => {
		e.baseUIHandlerPrevented = !0;
	}, e;
}
function N(e, t) {
	return t ? e ? t + " " + e : t : e;
}
function P(e) {
	return typeof e == "object" && !!e && "nativeEvent" in e;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.2.9_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/utils/esm/formatErrorMessage.js
function F(e, t) {
	return function(n, ...r) {
		let i = new URL(e);
		return i.searchParams.set("code", n.toString()), r.forEach((e) => i.searchParams.append("args[]", e)), `${t} error #${n}; visit ${i} for the full message.`;
	};
}
var I = F("https://base-ui.com/production-error", "Base UI"), L = {};
function R(e, t) {
	let n = _.useRef(L);
	return n.current === L && (n.current = e(t)), n;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.2.9_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/utils/esm/useMergedRefs.js
function ee(e, t, n, r) {
	let i = R(z).current;
	return B(i, e, t, n, r) && ne(i, [
		e,
		t,
		n,
		r
	]), i.callback;
}
function te(e) {
	let t = R(z).current;
	return V(t, e) && ne(t, e), t.callback;
}
function z() {
	return {
		callback: null,
		cleanup: null,
		refs: []
	};
}
function B(e, t, n, r, i) {
	return e.refs[0] !== t || e.refs[1] !== n || e.refs[2] !== r || e.refs[3] !== i;
}
function V(e, t) {
	return e.refs.length !== t.length || e.refs.some((e, n) => e !== t[n]);
}
function ne(e, t) {
	if (e.refs = t, t.every((e) => e == null)) {
		e.callback = null;
		return;
	}
	e.callback = (n) => {
		if (e.cleanup &&= (e.cleanup(), null), n != null) {
			let r = Array(t.length).fill(null);
			for (let e = 0; e < t.length; e += 1) {
				let i = t[e];
				if (i != null) switch (typeof i) {
					case "function": {
						let t = i(n);
						typeof t == "function" && (r[e] = t);
						break;
					}
					case "object":
						i.current = n;
						break;
					default:
				}
			}
			e.cleanup = () => {
				for (let e = 0; e < t.length; e += 1) {
					let n = t[e];
					if (n != null) switch (typeof n) {
						case "function": {
							let t = r[e];
							typeof t == "function" ? t() : n(null);
							break;
						}
						case "object":
							n.current = null;
							break;
						default:
					}
				}
			};
		}
	};
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.2.9_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/utils/esm/reactVersion.js
var H = 19;
function U(e) {
	return H >= e;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.2.9_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/utils/esm/getReactElementRef.js
function re(e) {
	if (!/* @__PURE__ */ _.isValidElement(e)) return null;
	let t = e, n = t.props;
	return (U(19) ? n?.ref : t.ref) ?? null;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.2.9_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/utils/esm/empty.js
function ie() {}
Object.freeze([]);
var ae = Object.freeze({});
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/internals/getStateAttributesProps.js
function oe(e, t) {
	let n = {};
	for (let r in e) {
		let i = e[r];
		if (t?.hasOwnProperty(r)) {
			let e = t[r](i);
			e != null && Object.assign(n, e);
			continue;
		}
		i === !0 ? n[`data-${r.toLowerCase()}`] = "" : i && (n[`data-${r.toLowerCase()}`] = i.toString());
	}
	return n;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/utils/resolveClassName.js
function se(e, t) {
	return typeof e == "function" ? e(t) : e;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/utils/resolveStyle.js
function ce(e, t) {
	return typeof e == "function" ? e(t) : e;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/internals/useRenderElement.js
function le(e, t, n = {}) {
	let r = t.render, i = ue(t, n);
	return n.enabled === !1 ? null : pe(e, r, i, n.state ?? ae);
}
function ue(e, t = {}) {
	let { className: n, style: r, render: i } = e, { state: a = ae, ref: o, props: s, stateAttributesMapping: c, enabled: l = !0 } = t, u = l ? se(n, a) : void 0, d = l ? ce(r, a) : void 0, f = l ? oe(a, c) : ae, p = l && s ? de(s) : void 0, m = l ? y(f, p) ?? {} : ae;
	return typeof document < "u" && (l ? Array.isArray(o) ? m.ref = te([
		m.ref,
		re(i),
		...o
	]) : m.ref = ee(m.ref, re(i), o) : ee(null, null)), l ? (u !== void 0 && (m.className = N(m.className, u)), d !== void 0 && (m.style = y(m.style, d)), m) : ae;
}
function de(e) {
	return Array.isArray(e) ? S(e) : x(void 0, e);
}
var fe = Symbol.for("react.lazy");
function pe(e, t, n, r) {
	if (t) {
		if (typeof t == "function") return t(n, r);
		let e = x(n, t.props);
		e.ref = n.ref;
		let i = t;
		return i?.$$typeof === fe && (i = _.Children.toArray(t)[0]), /* @__PURE__ */ _.cloneElement(i, e);
	}
	if (e && typeof e == "string") return me(e, n);
	throw Error(I(8));
}
function me(e, t) {
	return e === "button" ? /* @__PURE__ */ (0, _.createElement)("button", {
		type: "button",
		...t,
		key: t.key
	}) : e === "img" ? /* @__PURE__ */ (0, _.createElement)("img", {
		alt: "",
		...t,
		key: t.key
	}) : /* @__PURE__ */ _.createElement(e, t);
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/use-render/useRender.js
function he(e) {
	return le(e.defaultTagName ?? "div", e, e);
}
//#endregion
//#region node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs
function ge(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") if (Array.isArray(e)) {
		var i = e.length;
		for (t = 0; t < i; t++) e[t] && (n = ge(e[t])) && (r && (r += " "), r += n);
	} else for (n in e) e[n] && (r && (r += " "), r += n);
	return r;
}
function _e() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = ge(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.mjs
var ve = (e) => typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e, ye = _e, be = (e, t) => (n) => {
	if (t?.variants == null) return ye(e, n?.class, n?.className);
	let { variants: r, defaultVariants: i } = t, a = Object.keys(r).map((e) => {
		let t = n?.[e], a = i?.[e];
		if (t === null) return null;
		let o = ve(t) || ve(a);
		return r[e][o];
	}), o = n && Object.entries(n).reduce((e, t) => {
		let [n, r] = t;
		return r === void 0 || (e[n] = r), e;
	}, {});
	return ye(e, a, t?.compoundVariants?.reduce((e, t) => {
		let { class: n, className: r, ...a } = t;
		return Object.entries(a).every((e) => {
			let [t, n] = e;
			return Array.isArray(n) ? n.includes({
				...i,
				...o
			}[t]) : {
				...i,
				...o
			}[t] === n;
		}) ? [
			...e,
			n,
			r
		] : e;
	}, []), n?.class, n?.className);
}, xe = (e, t) => {
	let n = Array(e.length + t.length);
	for (let t = 0; t < e.length; t++) n[t] = e[t];
	for (let r = 0; r < t.length; r++) n[e.length + r] = t[r];
	return n;
}, Se = (e, t) => ({
	classGroupId: e,
	validator: t
}), Ce = (e = /* @__PURE__ */ new Map(), t = null, n) => ({
	nextPart: e,
	validators: t,
	classGroupId: n
}), we = "-", Te = [], Ee = "arbitrary..", De = (e) => {
	let t = Ae(e), { conflictingClassGroups: n, conflictingClassGroupModifiers: r } = e;
	return {
		getClassGroupId: (e) => {
			if (e.startsWith("[") && e.endsWith("]")) return ke(e);
			let n = e.split(we);
			return Oe(n, +(n[0] === "" && n.length > 1), t);
		},
		getConflictingClassGroupIds: (e, t) => {
			if (t) {
				let t = r[e], i = n[e];
				return t ? i ? xe(i, t) : t : i || Te;
			}
			return n[e] || Te;
		}
	};
}, Oe = (e, t, n) => {
	if (e.length - t === 0) return n.classGroupId;
	let r = e[t], i = n.nextPart.get(r);
	if (i) {
		let n = Oe(e, t + 1, i);
		if (n) return n;
	}
	let a = n.validators;
	if (a === null) return;
	let o = t === 0 ? e.join(we) : e.slice(t).join(we), s = a.length;
	for (let e = 0; e < s; e++) {
		let t = a[e];
		if (t.validator(o)) return t.classGroupId;
	}
}, ke = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
	let t = e.slice(1, -1), n = t.indexOf(":"), r = t.slice(0, n);
	return r ? Ee + r : void 0;
})(), Ae = (e) => {
	let { theme: t, classGroups: n } = e;
	return je(n, t);
}, je = (e, t) => {
	let n = Ce();
	for (let r in e) {
		let i = e[r];
		Me(i, n, r, t);
	}
	return n;
}, Me = (e, t, n, r) => {
	let i = e.length;
	for (let a = 0; a < i; a++) {
		let i = e[a];
		Ne(i, t, n, r);
	}
}, Ne = (e, t, n, r) => {
	if (typeof e == "string") {
		Pe(e, t, n);
		return;
	}
	if (typeof e == "function") {
		Fe(e, t, n, r);
		return;
	}
	Ie(e, t, n, r);
}, Pe = (e, t, n) => {
	let r = e === "" ? t : Le(t, e);
	r.classGroupId = n;
}, Fe = (e, t, n, r) => {
	if (Re(e)) {
		Me(e(r), t, n, r);
		return;
	}
	t.validators === null && (t.validators = []), t.validators.push(Se(n, e));
}, Ie = (e, t, n, r) => {
	let i = Object.entries(e), a = i.length;
	for (let e = 0; e < a; e++) {
		let [a, o] = i[e];
		Me(o, Le(t, a), n, r);
	}
}, Le = (e, t) => {
	let n = e, r = t.split(we), i = r.length;
	for (let e = 0; e < i; e++) {
		let t = r[e], i = n.nextPart.get(t);
		i || (i = Ce(), n.nextPart.set(t, i)), n = i;
	}
	return n;
}, Re = (e) => "isThemeGetter" in e && e.isThemeGetter === !0, ze = (e) => {
	if (e < 1) return {
		get: () => void 0,
		set: () => {}
	};
	let t = 0, n = Object.create(null), r = Object.create(null), i = (i, a) => {
		n[i] = a, t++, t > e && (t = 0, r = n, n = Object.create(null));
	};
	return {
		get(e) {
			let t = n[e];
			if (t !== void 0) return t;
			if ((t = r[e]) !== void 0) return i(e, t), t;
		},
		set(e, t) {
			e in n ? n[e] = t : i(e, t);
		}
	};
}, Be = "!", Ve = ":", He = [], Ue = (e, t, n, r, i) => ({
	modifiers: e,
	hasImportantModifier: t,
	baseClassName: n,
	maybePostfixModifierPosition: r,
	isExternal: i
}), We = (e) => {
	let { prefix: t, experimentalParseClassName: n } = e, r = (e) => {
		let t = [], n = 0, r = 0, i = 0, a, o = e.length;
		for (let s = 0; s < o; s++) {
			let o = e[s];
			if (n === 0 && r === 0) {
				if (o === Ve) {
					t.push(e.slice(i, s)), i = s + 1;
					continue;
				}
				if (o === "/") {
					a = s;
					continue;
				}
			}
			o === "[" ? n++ : o === "]" ? n-- : o === "(" ? r++ : o === ")" && r--;
		}
		let s = t.length === 0 ? e : e.slice(i), c = s, l = !1;
		s.endsWith(Be) ? (c = s.slice(0, -1), l = !0) : s.startsWith(Be) && (c = s.slice(1), l = !0);
		let u = a && a > i ? a - i : void 0;
		return Ue(t, l, c, u);
	};
	if (t) {
		let e = t + Ve, n = r;
		r = (t) => t.startsWith(e) ? n(t.slice(e.length)) : Ue(He, !1, t, void 0, !0);
	}
	if (n) {
		let e = r;
		r = (t) => n({
			className: t,
			parseClassName: e
		});
	}
	return r;
}, Ge = (e) => {
	let t = /* @__PURE__ */ new Map();
	return e.orderSensitiveModifiers.forEach((e, n) => {
		t.set(e, 1e6 + n);
	}), (e) => {
		let n = [], r = [];
		for (let i = 0; i < e.length; i++) {
			let a = e[i], o = a[0] === "[", s = t.has(a);
			o || s ? (r.length > 0 && (r.sort(), n.push(...r), r = []), n.push(a)) : r.push(a);
		}
		return r.length > 0 && (r.sort(), n.push(...r)), n;
	};
}, Ke = (e) => ({
	cache: ze(e.cacheSize),
	parseClassName: We(e),
	sortModifiers: Ge(e),
	postfixLookupClassGroupIds: qe(e),
	...De(e)
}), qe = (e) => {
	let t = Object.create(null), n = e.postfixLookupClassGroups;
	if (n) for (let e = 0; e < n.length; e++) t[n[e]] = !0;
	return t;
}, Je = /\s+/, Ye = (e, t) => {
	let { parseClassName: n, getClassGroupId: r, getConflictingClassGroupIds: i, sortModifiers: a, postfixLookupClassGroupIds: o } = t, s = [], c = e.trim().split(Je), l = "";
	for (let e = c.length - 1; e >= 0; --e) {
		let t = c[e], { isExternal: u, modifiers: d, hasImportantModifier: f, baseClassName: p, maybePostfixModifierPosition: m } = n(t);
		if (u) {
			l = t + (l.length > 0 ? " " + l : l);
			continue;
		}
		let h = !!m, g;
		if (h) {
			g = r(p.substring(0, m));
			let e = g && o[g] ? r(p) : void 0;
			e && e !== g && (g = e, h = !1);
		} else g = r(p);
		if (!g) {
			if (!h) {
				l = t + (l.length > 0 ? " " + l : l);
				continue;
			}
			if (g = r(p), !g) {
				l = t + (l.length > 0 ? " " + l : l);
				continue;
			}
			h = !1;
		}
		let _ = d.length === 0 ? "" : d.length === 1 ? d[0] : a(d).join(":"), v = f ? _ + Be : _, y = v + g;
		if (s.indexOf(y) > -1) continue;
		s.push(y);
		let b = i(g, h);
		for (let e = 0; e < b.length; ++e) {
			let t = b[e];
			s.push(v + t);
		}
		l = t + (l.length > 0 ? " " + l : l);
	}
	return l;
}, Xe = (...e) => {
	let t = 0, n, r, i = "";
	for (; t < e.length;) (n = e[t++]) && (r = Ze(n)) && (i && (i += " "), i += r);
	return i;
}, Ze = (e) => {
	if (typeof e == "string") return e;
	let t, n = "";
	for (let r = 0; r < e.length; r++) e[r] && (t = Ze(e[r])) && (n && (n += " "), n += t);
	return n;
}, Qe = (e, ...t) => {
	let n, r, i, a, o = (o) => (n = Ke(t.reduce((e, t) => t(e), e())), r = n.cache.get, i = n.cache.set, a = s, s(o)), s = (e) => {
		let t = r(e);
		if (t) return t;
		let a = Ye(e, n);
		return i(e, a), a;
	};
	return a = o, (...e) => a(Xe(...e));
}, $e = [], et = (e) => {
	let t = (t) => t[e] || $e;
	return t.isThemeGetter = !0, t;
}, tt = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, nt = /^\((?:(\w[\w-]*):)?(.+)\)$/i, rt = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, it = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, at = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, ot = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, st = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, ct = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, lt = (e) => rt.test(e), W = (e) => !!e && !Number.isNaN(Number(e)), ut = (e) => !!e && Number.isInteger(Number(e)), dt = (e) => e.endsWith("%") && W(e.slice(0, -1)), ft = (e) => it.test(e), pt = () => !0, mt = (e) => at.test(e) && !ot.test(e), ht = () => !1, gt = (e) => st.test(e), _t = (e) => ct.test(e), vt = (e) => !G(e) && !K(e), yt = (e) => e.startsWith("@container") && (e[10] === "/" && e[11] !== void 0 || e[11] === "s" && e[16] !== void 0 && e.startsWith("-size/", 10) || e[11] === "n" && e[18] !== void 0 && e.startsWith("-normal/", 10)), bt = (e) => Ft(e, zt, ht), G = (e) => tt.test(e), xt = (e) => Ft(e, Bt, mt), St = (e) => Ft(e, Vt, W), Ct = (e) => Ft(e, Ut, pt), wt = (e) => Ft(e, Ht, ht), Tt = (e) => Ft(e, Lt, ht), Et = (e) => Ft(e, Rt, _t), Dt = (e) => Ft(e, Wt, gt), K = (e) => nt.test(e), Ot = (e) => It(e, Bt), kt = (e) => It(e, Ht), At = (e) => It(e, Lt), jt = (e) => It(e, zt), Mt = (e) => It(e, Rt), Nt = (e) => It(e, Wt, !0), Pt = (e) => It(e, Ut, !0), Ft = (e, t, n) => {
	let r = tt.exec(e);
	return r ? r[1] ? t(r[1]) : n(r[2]) : !1;
}, It = (e, t, n = !1) => {
	let r = nt.exec(e);
	return r ? r[1] ? t(r[1]) : n : !1;
}, Lt = (e) => e === "position" || e === "percentage", Rt = (e) => e === "image" || e === "url", zt = (e) => e === "length" || e === "size" || e === "bg-size", Bt = (e) => e === "length", Vt = (e) => e === "number", Ht = (e) => e === "family-name", Ut = (e) => e === "number" || e === "weight", Wt = (e) => e === "shadow", Gt = /* @__PURE__ */ Qe(() => {
	let e = et("color"), t = et("font"), n = et("text"), r = et("font-weight"), i = et("tracking"), a = et("leading"), o = et("breakpoint"), s = et("container"), c = et("spacing"), l = et("radius"), u = et("shadow"), d = et("inset-shadow"), f = et("text-shadow"), p = et("drop-shadow"), m = et("blur"), h = et("perspective"), g = et("aspect"), _ = et("ease"), v = et("animate"), y = () => [
		"auto",
		"avoid",
		"all",
		"avoid-page",
		"page",
		"left",
		"right",
		"column"
	], b = () => [
		"center",
		"top",
		"bottom",
		"left",
		"right",
		"top-left",
		"left-top",
		"top-right",
		"right-top",
		"bottom-right",
		"right-bottom",
		"bottom-left",
		"left-bottom"
	], x = () => [
		...b(),
		K,
		G
	], S = () => [
		"auto",
		"hidden",
		"clip",
		"visible",
		"scroll"
	], C = () => [
		"auto",
		"contain",
		"none"
	], w = () => [
		K,
		G,
		c
	], T = () => [
		lt,
		"full",
		"auto",
		...w()
	], E = () => [
		ut,
		"none",
		"subgrid",
		K,
		G
	], D = () => [
		"auto",
		{ span: [
			"full",
			ut,
			K,
			G
		] },
		ut,
		K,
		G
	], O = () => [
		ut,
		"auto",
		K,
		G
	], k = () => [
		"auto",
		"min",
		"max",
		"fr",
		K,
		G
	], A = () => [
		"start",
		"end",
		"center",
		"between",
		"around",
		"evenly",
		"stretch",
		"baseline",
		"center-safe",
		"end-safe"
	], j = () => [
		"start",
		"end",
		"center",
		"stretch",
		"center-safe",
		"end-safe"
	], M = () => ["auto", ...w()], N = () => [
		lt,
		"auto",
		"full",
		"dvw",
		"dvh",
		"lvw",
		"lvh",
		"svw",
		"svh",
		"min",
		"max",
		"fit",
		...w()
	], P = () => [
		lt,
		"screen",
		"full",
		"dvw",
		"lvw",
		"svw",
		"min",
		"max",
		"fit",
		...w()
	], F = () => [
		lt,
		"screen",
		"full",
		"lh",
		"dvh",
		"lvh",
		"svh",
		"min",
		"max",
		"fit",
		...w()
	], I = () => [
		e,
		K,
		G
	], L = () => [
		...b(),
		At,
		Tt,
		{ position: [K, G] }
	], R = () => ["no-repeat", { repeat: [
		"",
		"x",
		"y",
		"space",
		"round"
	] }], ee = () => [
		"auto",
		"cover",
		"contain",
		jt,
		bt,
		{ size: [K, G] }
	], te = () => [
		dt,
		Ot,
		xt
	], z = () => [
		"",
		"none",
		"full",
		l,
		K,
		G
	], B = () => [
		"",
		W,
		Ot,
		xt
	], V = () => [
		"solid",
		"dashed",
		"dotted",
		"double"
	], ne = () => [
		"normal",
		"multiply",
		"screen",
		"overlay",
		"darken",
		"lighten",
		"color-dodge",
		"color-burn",
		"hard-light",
		"soft-light",
		"difference",
		"exclusion",
		"hue",
		"saturation",
		"color",
		"luminosity"
	], H = () => [
		W,
		dt,
		At,
		Tt
	], U = () => [
		"",
		"none",
		m,
		K,
		G
	], re = () => [
		"none",
		W,
		K,
		G
	], ie = () => [
		"none",
		W,
		K,
		G
	], ae = () => [
		W,
		K,
		G
	], oe = () => [
		lt,
		"full",
		...w()
	];
	return {
		cacheSize: 500,
		theme: {
			animate: [
				"spin",
				"ping",
				"pulse",
				"bounce"
			],
			aspect: ["video"],
			blur: [ft],
			breakpoint: [ft],
			color: [pt],
			container: [ft],
			"drop-shadow": [ft],
			ease: [
				"in",
				"out",
				"in-out"
			],
			font: [vt],
			"font-weight": [
				"thin",
				"extralight",
				"light",
				"normal",
				"medium",
				"semibold",
				"bold",
				"extrabold",
				"black"
			],
			"inset-shadow": [ft],
			leading: [
				"none",
				"tight",
				"snug",
				"normal",
				"relaxed",
				"loose"
			],
			perspective: [
				"dramatic",
				"near",
				"normal",
				"midrange",
				"distant",
				"none"
			],
			radius: [ft],
			shadow: [ft],
			spacing: ["px", W],
			text: [ft],
			"text-shadow": [ft],
			tracking: [
				"tighter",
				"tight",
				"normal",
				"wide",
				"wider",
				"widest"
			]
		},
		classGroups: {
			aspect: [{ aspect: [
				"auto",
				"square",
				lt,
				G,
				K,
				g
			] }],
			container: ["container"],
			"container-type": [{ "@container": [
				"",
				"normal",
				"size",
				K,
				G
			] }],
			"container-named": [yt],
			columns: [{ columns: [
				W,
				G,
				K,
				s
			] }],
			"break-after": [{ "break-after": y() }],
			"break-before": [{ "break-before": y() }],
			"break-inside": [{ "break-inside": [
				"auto",
				"avoid",
				"avoid-page",
				"avoid-column"
			] }],
			"box-decoration": [{ "box-decoration": ["slice", "clone"] }],
			box: [{ box: ["border", "content"] }],
			display: [
				"block",
				"inline-block",
				"inline",
				"flex",
				"inline-flex",
				"table",
				"inline-table",
				"table-caption",
				"table-cell",
				"table-column",
				"table-column-group",
				"table-footer-group",
				"table-header-group",
				"table-row-group",
				"table-row",
				"flow-root",
				"grid",
				"inline-grid",
				"contents",
				"list-item",
				"hidden"
			],
			sr: ["sr-only", "not-sr-only"],
			float: [{ float: [
				"right",
				"left",
				"none",
				"start",
				"end"
			] }],
			clear: [{ clear: [
				"left",
				"right",
				"both",
				"none",
				"start",
				"end"
			] }],
			isolation: ["isolate", "isolation-auto"],
			"object-fit": [{ object: [
				"contain",
				"cover",
				"fill",
				"none",
				"scale-down"
			] }],
			"object-position": [{ object: x() }],
			overflow: [{ overflow: S() }],
			"overflow-x": [{ "overflow-x": S() }],
			"overflow-y": [{ "overflow-y": S() }],
			overscroll: [{ overscroll: C() }],
			"overscroll-x": [{ "overscroll-x": C() }],
			"overscroll-y": [{ "overscroll-y": C() }],
			position: [
				"static",
				"fixed",
				"absolute",
				"relative",
				"sticky"
			],
			inset: [{ inset: T() }],
			"inset-x": [{ "inset-x": T() }],
			"inset-y": [{ "inset-y": T() }],
			start: [{
				"inset-s": T(),
				start: T()
			}],
			end: [{
				"inset-e": T(),
				end: T()
			}],
			"inset-bs": [{ "inset-bs": T() }],
			"inset-be": [{ "inset-be": T() }],
			top: [{ top: T() }],
			right: [{ right: T() }],
			bottom: [{ bottom: T() }],
			left: [{ left: T() }],
			visibility: [
				"visible",
				"invisible",
				"collapse"
			],
			z: [{ z: [
				ut,
				"auto",
				K,
				G
			] }],
			basis: [{ basis: [
				lt,
				"full",
				"auto",
				s,
				...w()
			] }],
			"flex-direction": [{ flex: [
				"row",
				"row-reverse",
				"col",
				"col-reverse"
			] }],
			"flex-wrap": [{ flex: [
				"nowrap",
				"wrap",
				"wrap-reverse"
			] }],
			flex: [{ flex: [
				W,
				lt,
				"auto",
				"initial",
				"none",
				G
			] }],
			grow: [{ grow: [
				"",
				W,
				K,
				G
			] }],
			shrink: [{ shrink: [
				"",
				W,
				K,
				G
			] }],
			order: [{ order: [
				ut,
				"first",
				"last",
				"none",
				K,
				G
			] }],
			"grid-cols": [{ "grid-cols": E() }],
			"col-start-end": [{ col: D() }],
			"col-start": [{ "col-start": O() }],
			"col-end": [{ "col-end": O() }],
			"grid-rows": [{ "grid-rows": E() }],
			"row-start-end": [{ row: D() }],
			"row-start": [{ "row-start": O() }],
			"row-end": [{ "row-end": O() }],
			"grid-flow": [{ "grid-flow": [
				"row",
				"col",
				"dense",
				"row-dense",
				"col-dense"
			] }],
			"auto-cols": [{ "auto-cols": k() }],
			"auto-rows": [{ "auto-rows": k() }],
			gap: [{ gap: w() }],
			"gap-x": [{ "gap-x": w() }],
			"gap-y": [{ "gap-y": w() }],
			"justify-content": [{ justify: [...A(), "normal"] }],
			"justify-items": [{ "justify-items": [...j(), "normal"] }],
			"justify-self": [{ "justify-self": ["auto", ...j()] }],
			"align-content": [{ content: ["normal", ...A()] }],
			"align-items": [{ items: [...j(), { baseline: ["", "last"] }] }],
			"align-self": [{ self: [
				"auto",
				...j(),
				{ baseline: ["", "last"] }
			] }],
			"place-content": [{ "place-content": A() }],
			"place-items": [{ "place-items": [...j(), "baseline"] }],
			"place-self": [{ "place-self": ["auto", ...j()] }],
			p: [{ p: w() }],
			px: [{ px: w() }],
			py: [{ py: w() }],
			ps: [{ ps: w() }],
			pe: [{ pe: w() }],
			pbs: [{ pbs: w() }],
			pbe: [{ pbe: w() }],
			pt: [{ pt: w() }],
			pr: [{ pr: w() }],
			pb: [{ pb: w() }],
			pl: [{ pl: w() }],
			m: [{ m: M() }],
			mx: [{ mx: M() }],
			my: [{ my: M() }],
			ms: [{ ms: M() }],
			me: [{ me: M() }],
			mbs: [{ mbs: M() }],
			mbe: [{ mbe: M() }],
			mt: [{ mt: M() }],
			mr: [{ mr: M() }],
			mb: [{ mb: M() }],
			ml: [{ ml: M() }],
			"space-x": [{ "space-x": w() }],
			"space-x-reverse": ["space-x-reverse"],
			"space-y": [{ "space-y": w() }],
			"space-y-reverse": ["space-y-reverse"],
			size: [{ size: N() }],
			"inline-size": [{ inline: ["auto", ...P()] }],
			"min-inline-size": [{ "min-inline": ["auto", ...P()] }],
			"max-inline-size": [{ "max-inline": ["none", ...P()] }],
			"block-size": [{ block: ["auto", ...F()] }],
			"min-block-size": [{ "min-block": ["auto", ...F()] }],
			"max-block-size": [{ "max-block": ["none", ...F()] }],
			w: [{ w: [
				s,
				"screen",
				...N()
			] }],
			"min-w": [{ "min-w": [
				s,
				"screen",
				"none",
				...N()
			] }],
			"max-w": [{ "max-w": [
				s,
				"screen",
				"none",
				"prose",
				{ screen: [o] },
				...N()
			] }],
			h: [{ h: [
				"screen",
				"lh",
				...N()
			] }],
			"min-h": [{ "min-h": [
				"screen",
				"lh",
				"none",
				...N()
			] }],
			"max-h": [{ "max-h": [
				"screen",
				"lh",
				...N()
			] }],
			"font-size": [{ text: [
				"base",
				n,
				Ot,
				xt
			] }],
			"font-smoothing": ["antialiased", "subpixel-antialiased"],
			"font-style": ["italic", "not-italic"],
			"font-weight": [{ font: [
				r,
				Pt,
				Ct
			] }],
			"font-stretch": [{ "font-stretch": [
				"ultra-condensed",
				"extra-condensed",
				"condensed",
				"semi-condensed",
				"normal",
				"semi-expanded",
				"expanded",
				"extra-expanded",
				"ultra-expanded",
				dt,
				G
			] }],
			"font-family": [{ font: [
				kt,
				wt,
				t
			] }],
			"font-features": [{ "font-features": [G] }],
			"fvn-normal": ["normal-nums"],
			"fvn-ordinal": ["ordinal"],
			"fvn-slashed-zero": ["slashed-zero"],
			"fvn-figure": ["lining-nums", "oldstyle-nums"],
			"fvn-spacing": ["proportional-nums", "tabular-nums"],
			"fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
			tracking: [{ tracking: [
				i,
				K,
				G
			] }],
			"line-clamp": [{ "line-clamp": [
				W,
				"none",
				K,
				St
			] }],
			leading: [{ leading: [a, ...w()] }],
			"list-image": [{ "list-image": [
				"none",
				K,
				G
			] }],
			"list-style-position": [{ list: ["inside", "outside"] }],
			"list-style-type": [{ list: [
				"disc",
				"decimal",
				"none",
				K,
				G
			] }],
			"text-alignment": [{ text: [
				"left",
				"center",
				"right",
				"justify",
				"start",
				"end"
			] }],
			"placeholder-color": [{ placeholder: I() }],
			"text-color": [{ text: I() }],
			"text-decoration": [
				"underline",
				"overline",
				"line-through",
				"no-underline"
			],
			"text-decoration-style": [{ decoration: [...V(), "wavy"] }],
			"text-decoration-thickness": [{ decoration: [
				W,
				"from-font",
				"auto",
				K,
				xt
			] }],
			"text-decoration-color": [{ decoration: I() }],
			"underline-offset": [{ "underline-offset": [
				W,
				"auto",
				K,
				G
			] }],
			"text-transform": [
				"uppercase",
				"lowercase",
				"capitalize",
				"normal-case"
			],
			"text-overflow": [
				"truncate",
				"text-ellipsis",
				"text-clip"
			],
			"text-wrap": [{ text: [
				"wrap",
				"nowrap",
				"balance",
				"pretty"
			] }],
			indent: [{ indent: w() }],
			"tab-size": [{ tab: [
				ut,
				K,
				G
			] }],
			"vertical-align": [{ align: [
				"baseline",
				"top",
				"middle",
				"bottom",
				"text-top",
				"text-bottom",
				"sub",
				"super",
				K,
				G
			] }],
			whitespace: [{ whitespace: [
				"normal",
				"nowrap",
				"pre",
				"pre-line",
				"pre-wrap",
				"break-spaces"
			] }],
			break: [{ break: [
				"normal",
				"words",
				"all",
				"keep"
			] }],
			wrap: [{ wrap: [
				"break-word",
				"anywhere",
				"normal"
			] }],
			hyphens: [{ hyphens: [
				"none",
				"manual",
				"auto"
			] }],
			content: [{ content: [
				"none",
				K,
				G
			] }],
			"bg-attachment": [{ bg: [
				"fixed",
				"local",
				"scroll"
			] }],
			"bg-clip": [{ "bg-clip": [
				"border",
				"padding",
				"content",
				"text"
			] }],
			"bg-origin": [{ "bg-origin": [
				"border",
				"padding",
				"content"
			] }],
			"bg-position": [{ bg: L() }],
			"bg-repeat": [{ bg: R() }],
			"bg-size": [{ bg: ee() }],
			"bg-image": [{ bg: [
				"none",
				{
					linear: [
						{ to: [
							"t",
							"tr",
							"r",
							"br",
							"b",
							"bl",
							"l",
							"tl"
						] },
						ut,
						K,
						G
					],
					radial: [
						"",
						K,
						G
					],
					conic: [
						ut,
						K,
						G
					]
				},
				Mt,
				Et
			] }],
			"bg-color": [{ bg: I() }],
			"gradient-from-pos": [{ from: te() }],
			"gradient-via-pos": [{ via: te() }],
			"gradient-to-pos": [{ to: te() }],
			"gradient-from": [{ from: I() }],
			"gradient-via": [{ via: I() }],
			"gradient-to": [{ to: I() }],
			rounded: [{ rounded: z() }],
			"rounded-s": [{ "rounded-s": z() }],
			"rounded-e": [{ "rounded-e": z() }],
			"rounded-t": [{ "rounded-t": z() }],
			"rounded-r": [{ "rounded-r": z() }],
			"rounded-b": [{ "rounded-b": z() }],
			"rounded-l": [{ "rounded-l": z() }],
			"rounded-ss": [{ "rounded-ss": z() }],
			"rounded-se": [{ "rounded-se": z() }],
			"rounded-ee": [{ "rounded-ee": z() }],
			"rounded-es": [{ "rounded-es": z() }],
			"rounded-tl": [{ "rounded-tl": z() }],
			"rounded-tr": [{ "rounded-tr": z() }],
			"rounded-br": [{ "rounded-br": z() }],
			"rounded-bl": [{ "rounded-bl": z() }],
			"border-w": [{ border: B() }],
			"border-w-x": [{ "border-x": B() }],
			"border-w-y": [{ "border-y": B() }],
			"border-w-s": [{ "border-s": B() }],
			"border-w-e": [{ "border-e": B() }],
			"border-w-bs": [{ "border-bs": B() }],
			"border-w-be": [{ "border-be": B() }],
			"border-w-t": [{ "border-t": B() }],
			"border-w-r": [{ "border-r": B() }],
			"border-w-b": [{ "border-b": B() }],
			"border-w-l": [{ "border-l": B() }],
			"divide-x": [{ "divide-x": B() }],
			"divide-x-reverse": ["divide-x-reverse"],
			"divide-y": [{ "divide-y": B() }],
			"divide-y-reverse": ["divide-y-reverse"],
			"border-style": [{ border: [
				...V(),
				"hidden",
				"none"
			] }],
			"divide-style": [{ divide: [
				...V(),
				"hidden",
				"none"
			] }],
			"border-color": [{ border: I() }],
			"border-color-x": [{ "border-x": I() }],
			"border-color-y": [{ "border-y": I() }],
			"border-color-s": [{ "border-s": I() }],
			"border-color-e": [{ "border-e": I() }],
			"border-color-bs": [{ "border-bs": I() }],
			"border-color-be": [{ "border-be": I() }],
			"border-color-t": [{ "border-t": I() }],
			"border-color-r": [{ "border-r": I() }],
			"border-color-b": [{ "border-b": I() }],
			"border-color-l": [{ "border-l": I() }],
			"divide-color": [{ divide: I() }],
			"outline-style": [{ outline: [
				...V(),
				"none",
				"hidden"
			] }],
			"outline-offset": [{ "outline-offset": [
				W,
				K,
				G
			] }],
			"outline-w": [{ outline: [
				"",
				W,
				Ot,
				xt
			] }],
			"outline-color": [{ outline: I() }],
			shadow: [{ shadow: [
				"",
				"none",
				u,
				Nt,
				Dt
			] }],
			"shadow-color": [{ shadow: I() }],
			"inset-shadow": [{ "inset-shadow": [
				"none",
				d,
				Nt,
				Dt
			] }],
			"inset-shadow-color": [{ "inset-shadow": I() }],
			"ring-w": [{ ring: B() }],
			"ring-w-inset": ["ring-inset"],
			"ring-color": [{ ring: I() }],
			"ring-offset-w": [{ "ring-offset": [W, xt] }],
			"ring-offset-color": [{ "ring-offset": I() }],
			"inset-ring-w": [{ "inset-ring": B() }],
			"inset-ring-color": [{ "inset-ring": I() }],
			"text-shadow": [{ "text-shadow": [
				"none",
				f,
				Nt,
				Dt
			] }],
			"text-shadow-color": [{ "text-shadow": I() }],
			opacity: [{ opacity: [
				W,
				K,
				G
			] }],
			"mix-blend": [{ "mix-blend": [
				...ne(),
				"plus-darker",
				"plus-lighter"
			] }],
			"bg-blend": [{ "bg-blend": ne() }],
			"mask-clip": [{ "mask-clip": [
				"border",
				"padding",
				"content",
				"fill",
				"stroke",
				"view"
			] }, "mask-no-clip"],
			"mask-composite": [{ mask: [
				"add",
				"subtract",
				"intersect",
				"exclude"
			] }],
			"mask-image-linear-pos": [{ "mask-linear": [W] }],
			"mask-image-linear-from-pos": [{ "mask-linear-from": H() }],
			"mask-image-linear-to-pos": [{ "mask-linear-to": H() }],
			"mask-image-linear-from-color": [{ "mask-linear-from": I() }],
			"mask-image-linear-to-color": [{ "mask-linear-to": I() }],
			"mask-image-t-from-pos": [{ "mask-t-from": H() }],
			"mask-image-t-to-pos": [{ "mask-t-to": H() }],
			"mask-image-t-from-color": [{ "mask-t-from": I() }],
			"mask-image-t-to-color": [{ "mask-t-to": I() }],
			"mask-image-r-from-pos": [{ "mask-r-from": H() }],
			"mask-image-r-to-pos": [{ "mask-r-to": H() }],
			"mask-image-r-from-color": [{ "mask-r-from": I() }],
			"mask-image-r-to-color": [{ "mask-r-to": I() }],
			"mask-image-b-from-pos": [{ "mask-b-from": H() }],
			"mask-image-b-to-pos": [{ "mask-b-to": H() }],
			"mask-image-b-from-color": [{ "mask-b-from": I() }],
			"mask-image-b-to-color": [{ "mask-b-to": I() }],
			"mask-image-l-from-pos": [{ "mask-l-from": H() }],
			"mask-image-l-to-pos": [{ "mask-l-to": H() }],
			"mask-image-l-from-color": [{ "mask-l-from": I() }],
			"mask-image-l-to-color": [{ "mask-l-to": I() }],
			"mask-image-x-from-pos": [{ "mask-x-from": H() }],
			"mask-image-x-to-pos": [{ "mask-x-to": H() }],
			"mask-image-x-from-color": [{ "mask-x-from": I() }],
			"mask-image-x-to-color": [{ "mask-x-to": I() }],
			"mask-image-y-from-pos": [{ "mask-y-from": H() }],
			"mask-image-y-to-pos": [{ "mask-y-to": H() }],
			"mask-image-y-from-color": [{ "mask-y-from": I() }],
			"mask-image-y-to-color": [{ "mask-y-to": I() }],
			"mask-image-radial": [{ "mask-radial": [K, G] }],
			"mask-image-radial-from-pos": [{ "mask-radial-from": H() }],
			"mask-image-radial-to-pos": [{ "mask-radial-to": H() }],
			"mask-image-radial-from-color": [{ "mask-radial-from": I() }],
			"mask-image-radial-to-color": [{ "mask-radial-to": I() }],
			"mask-image-radial-shape": [{ "mask-radial": ["circle", "ellipse"] }],
			"mask-image-radial-size": [{ "mask-radial": [{
				closest: ["side", "corner"],
				farthest: ["side", "corner"]
			}] }],
			"mask-image-radial-pos": [{ "mask-radial-at": b() }],
			"mask-image-conic-pos": [{ "mask-conic": [W] }],
			"mask-image-conic-from-pos": [{ "mask-conic-from": H() }],
			"mask-image-conic-to-pos": [{ "mask-conic-to": H() }],
			"mask-image-conic-from-color": [{ "mask-conic-from": I() }],
			"mask-image-conic-to-color": [{ "mask-conic-to": I() }],
			"mask-mode": [{ mask: [
				"alpha",
				"luminance",
				"match"
			] }],
			"mask-origin": [{ "mask-origin": [
				"border",
				"padding",
				"content",
				"fill",
				"stroke",
				"view"
			] }],
			"mask-position": [{ mask: L() }],
			"mask-repeat": [{ mask: R() }],
			"mask-size": [{ mask: ee() }],
			"mask-type": [{ "mask-type": ["alpha", "luminance"] }],
			"mask-image": [{ mask: [
				"none",
				K,
				G
			] }],
			filter: [{ filter: [
				"",
				"none",
				K,
				G
			] }],
			blur: [{ blur: U() }],
			brightness: [{ brightness: [
				W,
				K,
				G
			] }],
			contrast: [{ contrast: [
				W,
				K,
				G
			] }],
			"drop-shadow": [{ "drop-shadow": [
				"",
				"none",
				p,
				Nt,
				Dt
			] }],
			"drop-shadow-color": [{ "drop-shadow": I() }],
			grayscale: [{ grayscale: [
				"",
				W,
				K,
				G
			] }],
			"hue-rotate": [{ "hue-rotate": [
				W,
				K,
				G
			] }],
			invert: [{ invert: [
				"",
				W,
				K,
				G
			] }],
			saturate: [{ saturate: [
				W,
				K,
				G
			] }],
			sepia: [{ sepia: [
				"",
				W,
				K,
				G
			] }],
			"backdrop-filter": [{ "backdrop-filter": [
				"",
				"none",
				K,
				G
			] }],
			"backdrop-blur": [{ "backdrop-blur": U() }],
			"backdrop-brightness": [{ "backdrop-brightness": [
				W,
				K,
				G
			] }],
			"backdrop-contrast": [{ "backdrop-contrast": [
				W,
				K,
				G
			] }],
			"backdrop-grayscale": [{ "backdrop-grayscale": [
				"",
				W,
				K,
				G
			] }],
			"backdrop-hue-rotate": [{ "backdrop-hue-rotate": [
				W,
				K,
				G
			] }],
			"backdrop-invert": [{ "backdrop-invert": [
				"",
				W,
				K,
				G
			] }],
			"backdrop-opacity": [{ "backdrop-opacity": [
				W,
				K,
				G
			] }],
			"backdrop-saturate": [{ "backdrop-saturate": [
				W,
				K,
				G
			] }],
			"backdrop-sepia": [{ "backdrop-sepia": [
				"",
				W,
				K,
				G
			] }],
			"border-collapse": [{ border: ["collapse", "separate"] }],
			"border-spacing": [{ "border-spacing": w() }],
			"border-spacing-x": [{ "border-spacing-x": w() }],
			"border-spacing-y": [{ "border-spacing-y": w() }],
			"table-layout": [{ table: ["auto", "fixed"] }],
			caption: [{ caption: ["top", "bottom"] }],
			transition: [{ transition: [
				"",
				"all",
				"colors",
				"opacity",
				"shadow",
				"transform",
				"none",
				K,
				G
			] }],
			"transition-behavior": [{ transition: ["normal", "discrete"] }],
			duration: [{ duration: [
				W,
				"initial",
				K,
				G
			] }],
			ease: [{ ease: [
				"linear",
				"initial",
				_,
				K,
				G
			] }],
			delay: [{ delay: [
				W,
				K,
				G
			] }],
			animate: [{ animate: [
				"none",
				v,
				K,
				G
			] }],
			backface: [{ backface: ["hidden", "visible"] }],
			perspective: [{ perspective: [
				h,
				K,
				G
			] }],
			"perspective-origin": [{ "perspective-origin": x() }],
			rotate: [{ rotate: re() }],
			"rotate-x": [{ "rotate-x": re() }],
			"rotate-y": [{ "rotate-y": re() }],
			"rotate-z": [{ "rotate-z": re() }],
			scale: [{ scale: ie() }],
			"scale-x": [{ "scale-x": ie() }],
			"scale-y": [{ "scale-y": ie() }],
			"scale-z": [{ "scale-z": ie() }],
			"scale-3d": ["scale-3d"],
			skew: [{ skew: ae() }],
			"skew-x": [{ "skew-x": ae() }],
			"skew-y": [{ "skew-y": ae() }],
			transform: [{ transform: [
				K,
				G,
				"",
				"none",
				"gpu",
				"cpu"
			] }],
			"transform-origin": [{ origin: x() }],
			"transform-style": [{ transform: ["3d", "flat"] }],
			translate: [{ translate: oe() }],
			"translate-x": [{ "translate-x": oe() }],
			"translate-y": [{ "translate-y": oe() }],
			"translate-z": [{ "translate-z": oe() }],
			"translate-none": ["translate-none"],
			zoom: [{ zoom: [
				ut,
				K,
				G
			] }],
			accent: [{ accent: I() }],
			appearance: [{ appearance: ["none", "auto"] }],
			"caret-color": [{ caret: I() }],
			"color-scheme": [{ scheme: [
				"normal",
				"dark",
				"light",
				"light-dark",
				"only-dark",
				"only-light"
			] }],
			cursor: [{ cursor: [
				"auto",
				"default",
				"pointer",
				"wait",
				"text",
				"move",
				"help",
				"not-allowed",
				"none",
				"context-menu",
				"progress",
				"cell",
				"crosshair",
				"vertical-text",
				"alias",
				"copy",
				"no-drop",
				"grab",
				"grabbing",
				"all-scroll",
				"col-resize",
				"row-resize",
				"n-resize",
				"e-resize",
				"s-resize",
				"w-resize",
				"ne-resize",
				"nw-resize",
				"se-resize",
				"sw-resize",
				"ew-resize",
				"ns-resize",
				"nesw-resize",
				"nwse-resize",
				"zoom-in",
				"zoom-out",
				K,
				G
			] }],
			"field-sizing": [{ "field-sizing": ["fixed", "content"] }],
			"pointer-events": [{ "pointer-events": ["auto", "none"] }],
			resize: [{ resize: [
				"none",
				"",
				"y",
				"x"
			] }],
			"scroll-behavior": [{ scroll: ["auto", "smooth"] }],
			"scrollbar-thumb-color": [{ "scrollbar-thumb": I() }],
			"scrollbar-track-color": [{ "scrollbar-track": I() }],
			"scrollbar-gutter": [{ "scrollbar-gutter": [
				"auto",
				"stable",
				"both"
			] }],
			"scrollbar-w": [{ scrollbar: [
				"auto",
				"thin",
				"none"
			] }],
			"scroll-m": [{ "scroll-m": w() }],
			"scroll-mx": [{ "scroll-mx": w() }],
			"scroll-my": [{ "scroll-my": w() }],
			"scroll-ms": [{ "scroll-ms": w() }],
			"scroll-me": [{ "scroll-me": w() }],
			"scroll-mbs": [{ "scroll-mbs": w() }],
			"scroll-mbe": [{ "scroll-mbe": w() }],
			"scroll-mt": [{ "scroll-mt": w() }],
			"scroll-mr": [{ "scroll-mr": w() }],
			"scroll-mb": [{ "scroll-mb": w() }],
			"scroll-ml": [{ "scroll-ml": w() }],
			"scroll-p": [{ "scroll-p": w() }],
			"scroll-px": [{ "scroll-px": w() }],
			"scroll-py": [{ "scroll-py": w() }],
			"scroll-ps": [{ "scroll-ps": w() }],
			"scroll-pe": [{ "scroll-pe": w() }],
			"scroll-pbs": [{ "scroll-pbs": w() }],
			"scroll-pbe": [{ "scroll-pbe": w() }],
			"scroll-pt": [{ "scroll-pt": w() }],
			"scroll-pr": [{ "scroll-pr": w() }],
			"scroll-pb": [{ "scroll-pb": w() }],
			"scroll-pl": [{ "scroll-pl": w() }],
			"snap-align": [{ snap: [
				"start",
				"end",
				"center",
				"align-none"
			] }],
			"snap-stop": [{ snap: ["normal", "always"] }],
			"snap-type": [{ snap: [
				"none",
				"x",
				"y",
				"both"
			] }],
			"snap-strictness": [{ snap: ["mandatory", "proximity"] }],
			touch: [{ touch: [
				"auto",
				"none",
				"manipulation"
			] }],
			"touch-x": [{ "touch-pan": [
				"x",
				"left",
				"right"
			] }],
			"touch-y": [{ "touch-pan": [
				"y",
				"up",
				"down"
			] }],
			"touch-pz": ["touch-pinch-zoom"],
			select: [{ select: [
				"none",
				"text",
				"all",
				"auto"
			] }],
			"will-change": [{ "will-change": [
				"auto",
				"scroll",
				"contents",
				"transform",
				K,
				G
			] }],
			fill: [{ fill: ["none", ...I()] }],
			"stroke-w": [{ stroke: [
				W,
				Ot,
				xt,
				St
			] }],
			stroke: [{ stroke: ["none", ...I()] }],
			"forced-color-adjust": [{ "forced-color-adjust": ["auto", "none"] }]
		},
		conflictingClassGroups: {
			"container-named": ["container-type"],
			overflow: ["overflow-x", "overflow-y"],
			overscroll: ["overscroll-x", "overscroll-y"],
			inset: [
				"inset-x",
				"inset-y",
				"inset-bs",
				"inset-be",
				"start",
				"end",
				"top",
				"right",
				"bottom",
				"left"
			],
			"inset-x": ["right", "left"],
			"inset-y": ["top", "bottom"],
			flex: [
				"basis",
				"grow",
				"shrink"
			],
			gap: ["gap-x", "gap-y"],
			p: [
				"px",
				"py",
				"ps",
				"pe",
				"pbs",
				"pbe",
				"pt",
				"pr",
				"pb",
				"pl"
			],
			px: ["pr", "pl"],
			py: ["pt", "pb"],
			m: [
				"mx",
				"my",
				"ms",
				"me",
				"mbs",
				"mbe",
				"mt",
				"mr",
				"mb",
				"ml"
			],
			mx: ["mr", "ml"],
			my: ["mt", "mb"],
			size: ["w", "h"],
			"font-size": ["leading"],
			"fvn-normal": [
				"fvn-ordinal",
				"fvn-slashed-zero",
				"fvn-figure",
				"fvn-spacing",
				"fvn-fraction"
			],
			"fvn-ordinal": ["fvn-normal"],
			"fvn-slashed-zero": ["fvn-normal"],
			"fvn-figure": ["fvn-normal"],
			"fvn-spacing": ["fvn-normal"],
			"fvn-fraction": ["fvn-normal"],
			"line-clamp": ["display", "overflow"],
			rounded: [
				"rounded-s",
				"rounded-e",
				"rounded-t",
				"rounded-r",
				"rounded-b",
				"rounded-l",
				"rounded-ss",
				"rounded-se",
				"rounded-ee",
				"rounded-es",
				"rounded-tl",
				"rounded-tr",
				"rounded-br",
				"rounded-bl"
			],
			"rounded-s": ["rounded-ss", "rounded-es"],
			"rounded-e": ["rounded-se", "rounded-ee"],
			"rounded-t": ["rounded-tl", "rounded-tr"],
			"rounded-r": ["rounded-tr", "rounded-br"],
			"rounded-b": ["rounded-br", "rounded-bl"],
			"rounded-l": ["rounded-tl", "rounded-bl"],
			"border-spacing": ["border-spacing-x", "border-spacing-y"],
			"border-w": [
				"border-w-x",
				"border-w-y",
				"border-w-s",
				"border-w-e",
				"border-w-bs",
				"border-w-be",
				"border-w-t",
				"border-w-r",
				"border-w-b",
				"border-w-l"
			],
			"border-w-x": ["border-w-r", "border-w-l"],
			"border-w-y": ["border-w-t", "border-w-b"],
			"border-color": [
				"border-color-x",
				"border-color-y",
				"border-color-s",
				"border-color-e",
				"border-color-bs",
				"border-color-be",
				"border-color-t",
				"border-color-r",
				"border-color-b",
				"border-color-l"
			],
			"border-color-x": ["border-color-r", "border-color-l"],
			"border-color-y": ["border-color-t", "border-color-b"],
			translate: [
				"translate-x",
				"translate-y",
				"translate-none"
			],
			"translate-none": [
				"translate",
				"translate-x",
				"translate-y",
				"translate-z"
			],
			"scroll-m": [
				"scroll-mx",
				"scroll-my",
				"scroll-ms",
				"scroll-me",
				"scroll-mbs",
				"scroll-mbe",
				"scroll-mt",
				"scroll-mr",
				"scroll-mb",
				"scroll-ml"
			],
			"scroll-mx": ["scroll-mr", "scroll-ml"],
			"scroll-my": ["scroll-mt", "scroll-mb"],
			"scroll-p": [
				"scroll-px",
				"scroll-py",
				"scroll-ps",
				"scroll-pe",
				"scroll-pbs",
				"scroll-pbe",
				"scroll-pt",
				"scroll-pr",
				"scroll-pb",
				"scroll-pl"
			],
			"scroll-px": ["scroll-pr", "scroll-pl"],
			"scroll-py": ["scroll-pt", "scroll-pb"],
			touch: [
				"touch-x",
				"touch-y",
				"touch-pz"
			],
			"touch-x": ["touch"],
			"touch-y": ["touch"],
			"touch-pz": ["touch"]
		},
		conflictingClassGroupModifiers: { "font-size": ["leading"] },
		postfixLookupClassGroups: ["container-type"],
		orderSensitiveModifiers: [
			"*",
			"**",
			"after",
			"backdrop",
			"before",
			"details-content",
			"file",
			"first-letter",
			"first-line",
			"marker",
			"placeholder",
			"selection"
		]
	};
});
//#endregion
//#region src/lib/utils.ts
function Kt(...e) {
	return Gt(_e(e));
}
//#endregion
//#region src/components/ui/badge.tsx
var qt = be("group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-none border-0 bg-transparent px-0 py-0 text-[0.625rem] font-semibold tracking-widest whitespace-nowrap uppercase transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-0 has-data-[icon=inline-start]:pl-0 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!", {
	variants: { variant: {
		default: "text-foreground [a]:hover:text-foreground/70",
		secondary: "text-muted-foreground [a]:hover:text-foreground",
		destructive: "text-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:text-destructive/70",
		outline: "text-foreground [a]:hover:text-foreground/70",
		ghost: "text-muted-foreground hover:text-foreground",
		link: "text-foreground underline-offset-4 hover:underline"
	} },
	defaultVariants: { variant: "default" }
});
function Jt({ className: e, variant: t = "default", render: n, ...r }) {
	return he({
		defaultTagName: "span",
		props: x({ className: Kt(qt({ variant: t }), e) }, r),
		render: n,
		state: {
			slot: "badge",
			variant: t
		}
	});
}
//#endregion
//#region node_modules/.pnpm/home-assistant-js-websocket@9.6.0/node_modules/home-assistant-js-websocket/dist/messages.js
function Yt() {
	return { type: "get_states" };
}
//#endregion
//#region node_modules/.pnpm/home-assistant-js-websocket@9.6.0/node_modules/home-assistant-js-websocket/dist/util.js
var Xt = (e, t, n, r) => {
	let [i, a, o] = e.split(".", 3);
	return Number(i) > t || Number(i) === t && (r === void 0 ? Number(a) >= n : Number(a) > n) || r !== void 0 && Number(i) === t && Number(a) === n && Number(o) >= r;
}, Zt = (e) => {
	let t = [];
	function n(e) {
		let n = [];
		for (let r = 0; r < t.length; r++) t[r] === e ? e = null : n.push(t[r]);
		t = n;
	}
	function r(n, r) {
		e = r ? n : Object.assign(Object.assign({}, e), n);
		let i = t;
		for (let t = 0; t < i.length; t++) i[t](e);
	}
	return {
		get state() {
			return e;
		},
		action(t) {
			function n(e) {
				r(e, !1);
			}
			return function() {
				let r = [e];
				for (let e = 0; e < arguments.length; e++) r.push(arguments[e]);
				let i = t.apply(this, r);
				if (i != null) return i instanceof Promise ? i.then(n) : n(i);
			};
		},
		setState: r,
		clearState() {
			e = void 0;
		},
		subscribe(e) {
			return t.push(e), () => {
				n(e);
			};
		}
	};
}, Qt = 5e3, $t = (e, t, n, r, i = { unsubGrace: !0 }) => {
	if (e[t]) return e[t];
	let a = 0, o, s, c = Zt(), l = () => {
		if (!n) throw Error("Collection does not support refresh");
		return n(e).then((e) => c.setState(e, !0));
	}, u = () => l().catch((t) => {
		if (e.connected) throw t;
	}), d = () => {
		if (s !== void 0) {
			clearTimeout(s), s = void 0;
			return;
		}
		r && (o = r(e, c)), n && (e.addEventListener("ready", u), u()), e.addEventListener("disconnected", m);
	}, f = () => {
		s = void 0, o && o.then((e) => {
			e();
		}), c.clearState(), e.removeEventListener("ready", l), e.removeEventListener("disconnected", m);
	}, p = () => {
		s = setTimeout(f, Qt);
	}, m = () => {
		s && (clearTimeout(s), f());
	};
	return e[t] = {
		get state() {
			return c.state;
		},
		refresh: l,
		subscribe(e) {
			a++, a === 1 && d();
			let t = c.subscribe(e);
			return c.state !== void 0 && setTimeout(() => e(c.state), 0), () => {
				t(), a--, a || (i.unsubGrace ? p() : f());
			};
		}
	}, e[t];
}, en = (e) => e.sendMessagePromise(Yt());
//#endregion
//#region node_modules/.pnpm/home-assistant-js-websocket@9.6.0/node_modules/home-assistant-js-websocket/dist/entities.js
function tn(e, t) {
	let n = Object.assign({}, e.state);
	if (t.a) for (let e in t.a) {
		let r = t.a[e], i = (/* @__PURE__ */ new Date(r.lc * 1e3)).toISOString();
		n[e] = {
			entity_id: e,
			state: r.s,
			attributes: r.a,
			context: typeof r.c == "string" ? {
				id: r.c,
				parent_id: null,
				user_id: null
			} : r.c,
			last_changed: i,
			last_updated: r.lu ? (/* @__PURE__ */ new Date(r.lu * 1e3)).toISOString() : i
		};
	}
	if (t.r) for (let e of t.r) delete n[e];
	if (t.c) for (let e in t.c) {
		let r = n[e];
		if (!r) {
			console.warn("Received state update for unknown entity", e);
			continue;
		}
		r = Object.assign({}, r);
		let { "+": i, "-": a } = t.c[e], o = i?.a || a?.a, s = o ? Object.assign({}, r.attributes) : r.attributes;
		if (i && (i.s !== void 0 && (r.state = i.s), i.c && (typeof i.c == "string" ? r.context = Object.assign(Object.assign({}, r.context), { id: i.c }) : r.context = Object.assign(Object.assign({}, r.context), i.c)), i.lc ? r.last_updated = r.last_changed = (/* @__PURE__ */ new Date(i.lc * 1e3)).toISOString() : i.lu && (r.last_updated = (/* @__PURE__ */ new Date(i.lu * 1e3)).toISOString()), i.a && Object.assign(s, i.a)), a?.a) for (let e of a.a) delete s[e];
		o && (r.attributes = s), n[e] = r;
	}
	e.setState(n, !0);
}
var nn = (e, t) => e.subscribeMessage((e) => tn(t, e), { type: "subscribe_entities" });
function rn(e, t) {
	let n = e.state;
	if (n === void 0) return;
	let { entity_id: r, new_state: i } = t.data;
	if (i) e.setState({ [i.entity_id]: i });
	else {
		let t = Object.assign({}, n);
		delete t[r], e.setState(t, !0);
	}
}
async function an(e) {
	let t = await en(e), n = {};
	for (let e = 0; e < t.length; e++) {
		let r = t[e];
		n[r.entity_id] = r;
	}
	return n;
}
var on = (e, t) => e.subscribeEvents((e) => rn(t, e), "state_changed"), sn = (e) => Xt(e.haVersion, 2022, 4, 0) ? $t(e, "_ent", void 0, nn) : $t(e, "_ent", an, on), cn = (e, t) => sn(e).subscribe(t);
//#endregion
//#region src/lib/ha.ts
async function ln() {
	if (window.hassConnection) {
		let { conn: e } = await window.hassConnection;
		return e;
	}
	throw Error("Not running inside HA and VITE_HA_URL / VITE_HA_TOKEN are unset. Copy .env.example to .env and add a long-lived access token.");
}
function un(e, t) {
	return cn(e, t);
}
//#endregion
//#region node_modules/.pnpm/react@19.2.6/node_modules/react/cjs/react-jsx-runtime.production.js
var dn = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.fragment");
	function r(e, n, r) {
		var i = null;
		if (r !== void 0 && (i = "" + r), n.key !== void 0 && (i = "" + n.key), "key" in n) for (var a in r = {}, n) a !== "key" && (r[a] = n[a]);
		else r = n;
		return n = r.ref, {
			$$typeof: t,
			type: e,
			key: i,
			ref: n === void 0 ? null : n,
			props: r
		};
	}
	e.Fragment = n, e.jsx = r, e.jsxs = r;
})), q = (/* @__PURE__ */ o(((e, t) => {
	t.exports = dn();
})))(), fn = (0, _.createContext)(null);
function pn({ children: e }) {
	let [t, n] = (0, _.useState)("connecting"), [r, i] = (0, _.useState)(null), [a, o] = (0, _.useState)({});
	(0, _.useEffect)(() => {
		let e = !1, t;
		return ln().then((r) => {
			if (e) {
				r.close();
				return;
			}
			n("connected"), t = un(r, (e) => o({ ...e }));
		}).catch((t) => {
			e || (n("error"), i(t instanceof Error ? t.message : String(t)));
		}), () => {
			e = !0, t?.();
		};
	}, []);
	let s = (0, _.useMemo)(() => ({
		status: t,
		error: r,
		entities: a
	}), [
		t,
		r,
		a
	]);
	return /* @__PURE__ */ (0, q.jsx)(fn.Provider, {
		value: s,
		children: e
	});
}
function mn() {
	let e = (0, _.useContext)(fn);
	if (!e) throw Error("useLiveState must be used inside <LiveStateProvider>");
	return e;
}
function hn(e) {
	let { entities: t } = mn();
	if (e) return t[e]?.state;
}
function gn(e) {
	return hn(`automation.${e}`) === "on";
}
//#endregion
//#region src/lib/registry.tsx
var _n = (0, _.createContext)(null);
async function vn(e) {
	let [t, n, r] = await Promise.all([
		e.sendMessagePromise({ type: "config/entity_registry/list" }),
		e.sendMessagePromise({ type: "config/area_registry/list" }),
		e.sendMessagePromise({ type: "config/label_registry/list" })
	]), i;
	try {
		i = (await e.sendMessagePromise({ type: "homeassistant/expose_entity/list" }))?.exposed_entities ?? {};
	} catch {
		i = {};
	}
	return {
		entities: t,
		areas: n,
		labels: r,
		exposure: i
	};
}
function yn({ children: e }) {
	let [t, n] = (0, _.useState)("loading"), [r, i] = (0, _.useState)(null), [a, o] = (0, _.useState)(/* @__PURE__ */ new Map()), [s, c] = (0, _.useState)(/* @__PURE__ */ new Map()), [l, u] = (0, _.useState)(/* @__PURE__ */ new Map()), [d, f] = (0, _.useState)({}), [p, m] = (0, _.useState)(0);
	(0, _.useEffect)(() => {
		let e = !1;
		return ln().then(async (t) => {
			let r = await vn(t);
			e || (o(new Map(r.entities.map((e) => [e.entity_id, e]))), c(new Map(r.areas.map((e) => [e.area_id, e]))), u(new Map(r.labels.map((e) => [e.label_id, e]))), f(r.exposure), n("ready"));
		}).catch((t) => {
			e || (i(t instanceof Error ? t.message : String(t)), n("error"));
		}), () => {
			e = !0;
		};
	}, [p]);
	let h = (0, _.useCallback)(() => m((e) => e + 1), []), g = (0, _.useMemo)(() => ({
		status: t,
		error: r,
		entities: a,
		areas: s,
		labels: l,
		exposure: d,
		refresh: h
	}), [
		t,
		r,
		a,
		s,
		l,
		d,
		h
	]);
	return /* @__PURE__ */ (0, q.jsx)(_n.Provider, {
		value: g,
		children: e
	});
}
function bn() {
	let e = (0, _.useContext)(_n);
	if (!e) throw Error("useRegistry must be used inside <RegistryProvider>");
	return e;
}
function xn() {
	return bn().status;
}
function Sn() {
	return bn().error;
}
function Cn() {
	return bn().refresh;
}
function wn(e) {
	let { entities: t, areas: n, labels: r, exposure: i } = bn();
	if (!e) return null;
	let a = t.get(e);
	if (!a) return {
		entityId: e,
		areaName: null,
		enabled: !0,
		visible: !0,
		labels: [],
		exposure: i[e] ?? {},
		platform: null,
		inRegistry: !1
	};
	let o = a.area_id ? n.get(a.area_id)?.name ?? null : null, s = a.labels.map((e) => r.get(e)?.name).filter((e) => !!e);
	return {
		entityId: e,
		areaName: o,
		enabled: a.disabled_by === null,
		visible: a.hidden_by === null,
		labels: s,
		exposure: i[e] ?? {},
		platform: a.platform,
		inRegistry: !0
	};
}
//#endregion
//#region src/lib/graph.ts
var Tn = null;
function En() {
	return Tn || (Tn = fetch("/local/terminus/graph.json").then((e) => {
		if (!e.ok) throw Error(`graph.json: HTTP ${e.status}`);
		return e.json();
	}), Tn);
}
//#endregion
//#region src/lib/router.ts
function Dn(e) {
	let t = e.replace(/^#\/?/, "");
	if (t === "") return { name: "map" };
	let [n, ...r] = t.split("/");
	return n === "auto" && r.length === 1 && r[0] !== "" ? {
		name: "auto",
		id: decodeURIComponent(r[0])
	} : { name: "map" };
}
function On(e) {
	return e.name === "map" ? "#/" : `#/auto/${encodeURIComponent(e.id)}`;
}
function kn(e) {
	return window.addEventListener("hashchange", e), () => window.removeEventListener("hashchange", e);
}
function An() {
	return window.location.hash;
}
function jn() {
	return "";
}
function Mn() {
	return Dn((0, _.useSyncExternalStore)(kn, An, jn));
}
function Nn(e) {
	let t = On(e);
	window.location.hash !== t.replace(/^#/, "#") && (window.location.hash = t);
}
//#endregion
//#region node_modules/.pnpm/classcat@5.0.5/node_modules/classcat/index.js
function Pn(e) {
	if (typeof e == "string" || typeof e == "number") return "" + e;
	let t = "";
	if (Array.isArray(e)) for (let n = 0, r; n < e.length; n++) (r = Pn(e[n])) !== "" && (t += (t && " ") + r);
	else for (let n in e) e[n] && (t += (t && " ") + n);
	return t;
}
//#endregion
//#region node_modules/.pnpm/d3-dispatch@3.0.1/node_modules/d3-dispatch/src/dispatch.js
var Fn = { value: () => {} };
function In() {
	for (var e = 0, t = arguments.length, n = {}, r; e < t; ++e) {
		if (!(r = arguments[e] + "") || r in n || /[\s.]/.test(r)) throw Error("illegal type: " + r);
		n[r] = [];
	}
	return new Ln(n);
}
function Ln(e) {
	this._ = e;
}
function Rn(e, t) {
	return e.trim().split(/^|\s+/).map(function(e) {
		var n = "", r = e.indexOf(".");
		if (r >= 0 && (n = e.slice(r + 1), e = e.slice(0, r)), e && !t.hasOwnProperty(e)) throw Error("unknown type: " + e);
		return {
			type: e,
			name: n
		};
	});
}
Ln.prototype = In.prototype = {
	constructor: Ln,
	on: function(e, t) {
		var n = this._, r = Rn(e + "", n), i, a = -1, o = r.length;
		if (arguments.length < 2) {
			for (; ++a < o;) if ((i = (e = r[a]).type) && (i = zn(n[i], e.name))) return i;
			return;
		}
		if (t != null && typeof t != "function") throw Error("invalid callback: " + t);
		for (; ++a < o;) if (i = (e = r[a]).type) n[i] = Bn(n[i], e.name, t);
		else if (t == null) for (i in n) n[i] = Bn(n[i], e.name, null);
		return this;
	},
	copy: function() {
		var e = {}, t = this._;
		for (var n in t) e[n] = t[n].slice();
		return new Ln(e);
	},
	call: function(e, t) {
		if ((i = arguments.length - 2) > 0) for (var n = Array(i), r = 0, i, a; r < i; ++r) n[r] = arguments[r + 2];
		if (!this._.hasOwnProperty(e)) throw Error("unknown type: " + e);
		for (a = this._[e], r = 0, i = a.length; r < i; ++r) a[r].value.apply(t, n);
	},
	apply: function(e, t, n) {
		if (!this._.hasOwnProperty(e)) throw Error("unknown type: " + e);
		for (var r = this._[e], i = 0, a = r.length; i < a; ++i) r[i].value.apply(t, n);
	}
};
function zn(e, t) {
	for (var n = 0, r = e.length, i; n < r; ++n) if ((i = e[n]).name === t) return i.value;
}
function Bn(e, t, n) {
	for (var r = 0, i = e.length; r < i; ++r) if (e[r].name === t) {
		e[r] = Fn, e = e.slice(0, r).concat(e.slice(r + 1));
		break;
	}
	return n != null && e.push({
		name: t,
		value: n
	}), e;
}
var Vn = {
	svg: "http://www.w3.org/2000/svg",
	xhtml: "http://www.w3.org/1999/xhtml",
	xlink: "http://www.w3.org/1999/xlink",
	xml: "http://www.w3.org/XML/1998/namespace",
	xmlns: "http://www.w3.org/2000/xmlns/"
};
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/namespace.js
function Hn(e) {
	var t = e += "", n = t.indexOf(":");
	return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), Vn.hasOwnProperty(t) ? {
		space: Vn[t],
		local: e
	} : e;
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/creator.js
function Un(e) {
	return function() {
		var t = this.ownerDocument, n = this.namespaceURI;
		return n === "http://www.w3.org/1999/xhtml" && t.documentElement.namespaceURI === "http://www.w3.org/1999/xhtml" ? t.createElement(e) : t.createElementNS(n, e);
	};
}
function Wn(e) {
	return function() {
		return this.ownerDocument.createElementNS(e.space, e.local);
	};
}
function Gn(e) {
	var t = Hn(e);
	return (t.local ? Wn : Un)(t);
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selector.js
function Kn() {}
function qn(e) {
	return e == null ? Kn : function() {
		return this.querySelector(e);
	};
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/select.js
function Jn(e) {
	typeof e != "function" && (e = qn(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = Array(o), c, l, u = 0; u < o; ++u) (c = a[u]) && (l = e.call(c, c.__data__, u, a)) && ("__data__" in c && (l.__data__ = c.__data__), s[u] = l);
	return new Ii(r, this._parents);
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/array.js
function Yn(e) {
	return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selectorAll.js
function Xn() {
	return [];
}
function Zn(e) {
	return e == null ? Xn : function() {
		return this.querySelectorAll(e);
	};
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/selectAll.js
function Qn(e) {
	return function() {
		return Yn(e.apply(this, arguments));
	};
}
function $n(e) {
	e = typeof e == "function" ? Qn(e) : Zn(e);
	for (var t = this._groups, n = t.length, r = [], i = [], a = 0; a < n; ++a) for (var o = t[a], s = o.length, c, l = 0; l < s; ++l) (c = o[l]) && (r.push(e.call(c, c.__data__, l, o)), i.push(c));
	return new Ii(r, i);
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/matcher.js
function er(e) {
	return function() {
		return this.matches(e);
	};
}
function tr(e) {
	return function(t) {
		return t.matches(e);
	};
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/selectChild.js
var nr = Array.prototype.find;
function rr(e) {
	return function() {
		return nr.call(this.children, e);
	};
}
function ir() {
	return this.firstElementChild;
}
function ar(e) {
	return this.select(e == null ? ir : rr(typeof e == "function" ? e : tr(e)));
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/selectChildren.js
var or = Array.prototype.filter;
function sr() {
	return Array.from(this.children);
}
function cr(e) {
	return function() {
		return or.call(this.children, e);
	};
}
function lr(e) {
	return this.selectAll(e == null ? sr : cr(typeof e == "function" ? e : tr(e)));
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/filter.js
function ur(e) {
	typeof e != "function" && (e = er(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = [], c, l = 0; l < o; ++l) (c = a[l]) && e.call(c, c.__data__, l, a) && s.push(c);
	return new Ii(r, this._parents);
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/sparse.js
function dr(e) {
	return Array(e.length);
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/enter.js
function fr() {
	return new Ii(this._enter || this._groups.map(dr), this._parents);
}
function pr(e, t) {
	this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
pr.prototype = {
	constructor: pr,
	appendChild: function(e) {
		return this._parent.insertBefore(e, this._next);
	},
	insertBefore: function(e, t) {
		return this._parent.insertBefore(e, t);
	},
	querySelector: function(e) {
		return this._parent.querySelector(e);
	},
	querySelectorAll: function(e) {
		return this._parent.querySelectorAll(e);
	}
};
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/constant.js
function mr(e) {
	return function() {
		return e;
	};
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/data.js
function hr(e, t, n, r, i, a) {
	for (var o = 0, s, c = t.length, l = a.length; o < l; ++o) (s = t[o]) ? (s.__data__ = a[o], r[o] = s) : n[o] = new pr(e, a[o]);
	for (; o < c; ++o) (s = t[o]) && (i[o] = s);
}
function gr(e, t, n, r, i, a, o) {
	var s, c, l = /* @__PURE__ */ new Map(), u = t.length, d = a.length, f = Array(u), p;
	for (s = 0; s < u; ++s) (c = t[s]) && (f[s] = p = o.call(c, c.__data__, s, t) + "", l.has(p) ? i[s] = c : l.set(p, c));
	for (s = 0; s < d; ++s) p = o.call(e, a[s], s, a) + "", (c = l.get(p)) ? (r[s] = c, c.__data__ = a[s], l.delete(p)) : n[s] = new pr(e, a[s]);
	for (s = 0; s < u; ++s) (c = t[s]) && l.get(f[s]) === c && (i[s] = c);
}
function _r(e) {
	return e.__data__;
}
function vr(e, t) {
	if (!arguments.length) return Array.from(this, _r);
	var n = t ? gr : hr, r = this._parents, i = this._groups;
	typeof e != "function" && (e = mr(e));
	for (var a = i.length, o = Array(a), s = Array(a), c = Array(a), l = 0; l < a; ++l) {
		var u = r[l], d = i[l], f = d.length, p = yr(e.call(u, u && u.__data__, l, r)), m = p.length, h = s[l] = Array(m), g = o[l] = Array(m);
		n(u, d, h, g, c[l] = Array(f), p, t);
		for (var _ = 0, v = 0, y, b; _ < m; ++_) if (y = h[_]) {
			for (_ >= v && (v = _ + 1); !(b = g[v]) && ++v < m;);
			y._next = b || null;
		}
	}
	return o = new Ii(o, r), o._enter = s, o._exit = c, o;
}
function yr(e) {
	return typeof e == "object" && "length" in e ? e : Array.from(e);
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/exit.js
function br() {
	return new Ii(this._exit || this._groups.map(dr), this._parents);
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/join.js
function xr(e, t, n) {
	var r = this.enter(), i = this, a = this.exit();
	return typeof e == "function" ? (r = e(r), r &&= r.selection()) : r = r.append(e + ""), t != null && (i = t(i), i &&= i.selection()), n == null ? a.remove() : n(a), r && i ? r.merge(i).order() : i;
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/merge.js
function Sr(e) {
	for (var t = e.selection ? e.selection() : e, n = this._groups, r = t._groups, i = n.length, a = r.length, o = Math.min(i, a), s = Array(i), c = 0; c < o; ++c) for (var l = n[c], u = r[c], d = l.length, f = s[c] = Array(d), p, m = 0; m < d; ++m) (p = l[m] || u[m]) && (f[m] = p);
	for (; c < i; ++c) s[c] = n[c];
	return new Ii(s, this._parents);
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/order.js
function Cr() {
	for (var e = this._groups, t = -1, n = e.length; ++t < n;) for (var r = e[t], i = r.length - 1, a = r[i], o; --i >= 0;) (o = r[i]) && (a && o.compareDocumentPosition(a) ^ 4 && a.parentNode.insertBefore(o, a), a = o);
	return this;
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/sort.js
function wr(e) {
	e ||= Tr;
	function t(t, n) {
		return t && n ? e(t.__data__, n.__data__) : !t - !n;
	}
	for (var n = this._groups, r = n.length, i = Array(r), a = 0; a < r; ++a) {
		for (var o = n[a], s = o.length, c = i[a] = Array(s), l, u = 0; u < s; ++u) (l = o[u]) && (c[u] = l);
		c.sort(t);
	}
	return new Ii(i, this._parents).order();
}
function Tr(e, t) {
	return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/call.js
function Er() {
	var e = arguments[0];
	return arguments[0] = this, e.apply(null, arguments), this;
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/nodes.js
function Dr() {
	return Array.from(this);
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/node.js
function Or() {
	for (var e = this._groups, t = 0, n = e.length; t < n; ++t) for (var r = e[t], i = 0, a = r.length; i < a; ++i) {
		var o = r[i];
		if (o) return o;
	}
	return null;
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/size.js
function kr() {
	let e = 0;
	for (let t of this) ++e;
	return e;
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/empty.js
function Ar() {
	return !this.node();
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/each.js
function jr(e) {
	for (var t = this._groups, n = 0, r = t.length; n < r; ++n) for (var i = t[n], a = 0, o = i.length, s; a < o; ++a) (s = i[a]) && e.call(s, s.__data__, a, i);
	return this;
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/attr.js
function Mr(e) {
	return function() {
		this.removeAttribute(e);
	};
}
function Nr(e) {
	return function() {
		this.removeAttributeNS(e.space, e.local);
	};
}
function Pr(e, t) {
	return function() {
		this.setAttribute(e, t);
	};
}
function Fr(e, t) {
	return function() {
		this.setAttributeNS(e.space, e.local, t);
	};
}
function Ir(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
	};
}
function Lr(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
	};
}
function Rr(e, t) {
	var n = Hn(e);
	if (arguments.length < 2) {
		var r = this.node();
		return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
	}
	return this.each((t == null ? n.local ? Nr : Mr : typeof t == "function" ? n.local ? Lr : Ir : n.local ? Fr : Pr)(n, t));
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/window.js
function zr(e) {
	return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/style.js
function Br(e) {
	return function() {
		this.style.removeProperty(e);
	};
}
function Vr(e, t, n) {
	return function() {
		this.style.setProperty(e, t, n);
	};
}
function Hr(e, t, n) {
	return function() {
		var r = t.apply(this, arguments);
		r == null ? this.style.removeProperty(e) : this.style.setProperty(e, r, n);
	};
}
function Ur(e, t, n) {
	return arguments.length > 1 ? this.each((t == null ? Br : typeof t == "function" ? Hr : Vr)(e, t, n ?? "")) : Wr(this.node(), e);
}
function Wr(e, t) {
	return e.style.getPropertyValue(t) || zr(e).getComputedStyle(e, null).getPropertyValue(t);
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/property.js
function Gr(e) {
	return function() {
		delete this[e];
	};
}
function Kr(e, t) {
	return function() {
		this[e] = t;
	};
}
function qr(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? delete this[e] : this[e] = n;
	};
}
function Jr(e, t) {
	return arguments.length > 1 ? this.each((t == null ? Gr : typeof t == "function" ? qr : Kr)(e, t)) : this.node()[e];
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/classed.js
function Yr(e) {
	return e.trim().split(/^|\s+/);
}
function Xr(e) {
	return e.classList || new Zr(e);
}
function Zr(e) {
	this._node = e, this._names = Yr(e.getAttribute("class") || "");
}
Zr.prototype = {
	add: function(e) {
		this._names.indexOf(e) < 0 && (this._names.push(e), this._node.setAttribute("class", this._names.join(" ")));
	},
	remove: function(e) {
		var t = this._names.indexOf(e);
		t >= 0 && (this._names.splice(t, 1), this._node.setAttribute("class", this._names.join(" ")));
	},
	contains: function(e) {
		return this._names.indexOf(e) >= 0;
	}
};
function Qr(e, t) {
	for (var n = Xr(e), r = -1, i = t.length; ++r < i;) n.add(t[r]);
}
function $r(e, t) {
	for (var n = Xr(e), r = -1, i = t.length; ++r < i;) n.remove(t[r]);
}
function ei(e) {
	return function() {
		Qr(this, e);
	};
}
function ti(e) {
	return function() {
		$r(this, e);
	};
}
function ni(e, t) {
	return function() {
		(t.apply(this, arguments) ? Qr : $r)(this, e);
	};
}
function ri(e, t) {
	var n = Yr(e + "");
	if (arguments.length < 2) {
		for (var r = Xr(this.node()), i = -1, a = n.length; ++i < a;) if (!r.contains(n[i])) return !1;
		return !0;
	}
	return this.each((typeof t == "function" ? ni : t ? ei : ti)(n, t));
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/text.js
function ii() {
	this.textContent = "";
}
function ai(e) {
	return function() {
		this.textContent = e;
	};
}
function oi(e) {
	return function() {
		var t = e.apply(this, arguments);
		this.textContent = t ?? "";
	};
}
function si(e) {
	return arguments.length ? this.each(e == null ? ii : (typeof e == "function" ? oi : ai)(e)) : this.node().textContent;
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/html.js
function ci() {
	this.innerHTML = "";
}
function li(e) {
	return function() {
		this.innerHTML = e;
	};
}
function ui(e) {
	return function() {
		var t = e.apply(this, arguments);
		this.innerHTML = t ?? "";
	};
}
function di(e) {
	return arguments.length ? this.each(e == null ? ci : (typeof e == "function" ? ui : li)(e)) : this.node().innerHTML;
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/raise.js
function fi() {
	this.nextSibling && this.parentNode.appendChild(this);
}
function pi() {
	return this.each(fi);
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/lower.js
function mi() {
	this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function hi() {
	return this.each(mi);
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/append.js
function gi(e) {
	var t = typeof e == "function" ? e : Gn(e);
	return this.select(function() {
		return this.appendChild(t.apply(this, arguments));
	});
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/insert.js
function _i() {
	return null;
}
function vi(e, t) {
	var n = typeof e == "function" ? e : Gn(e), r = t == null ? _i : typeof t == "function" ? t : qn(t);
	return this.select(function() {
		return this.insertBefore(n.apply(this, arguments), r.apply(this, arguments) || null);
	});
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/remove.js
function yi() {
	var e = this.parentNode;
	e && e.removeChild(this);
}
function bi() {
	return this.each(yi);
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/clone.js
function xi() {
	var e = this.cloneNode(!1), t = this.parentNode;
	return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Si() {
	var e = this.cloneNode(!0), t = this.parentNode;
	return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Ci(e) {
	return this.select(e ? Si : xi);
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/datum.js
function wi(e) {
	return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/on.js
function Ti(e) {
	return function(t) {
		e.call(this, t, this.__data__);
	};
}
function Ei(e) {
	return e.trim().split(/^|\s+/).map(function(e) {
		var t = "", n = e.indexOf(".");
		return n >= 0 && (t = e.slice(n + 1), e = e.slice(0, n)), {
			type: e,
			name: t
		};
	});
}
function Di(e) {
	return function() {
		var t = this.__on;
		if (t) {
			for (var n = 0, r = -1, i = t.length, a; n < i; ++n) a = t[n], (!e.type || a.type === e.type) && a.name === e.name ? this.removeEventListener(a.type, a.listener, a.options) : t[++r] = a;
			++r ? t.length = r : delete this.__on;
		}
	};
}
function Oi(e, t, n) {
	return function() {
		var r = this.__on, i, a = Ti(t);
		if (r) {
			for (var o = 0, s = r.length; o < s; ++o) if ((i = r[o]).type === e.type && i.name === e.name) {
				this.removeEventListener(i.type, i.listener, i.options), this.addEventListener(i.type, i.listener = a, i.options = n), i.value = t;
				return;
			}
		}
		this.addEventListener(e.type, a, n), i = {
			type: e.type,
			name: e.name,
			value: t,
			listener: a,
			options: n
		}, r ? r.push(i) : this.__on = [i];
	};
}
function ki(e, t, n) {
	var r = Ei(e + ""), i, a = r.length, o;
	if (arguments.length < 2) {
		var s = this.node().__on;
		if (s) {
			for (var c = 0, l = s.length, u; c < l; ++c) for (i = 0, u = s[c]; i < a; ++i) if ((o = r[i]).type === u.type && o.name === u.name) return u.value;
		}
		return;
	}
	for (s = t ? Oi : Di, i = 0; i < a; ++i) this.each(s(r[i], t, n));
	return this;
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/dispatch.js
function Ai(e, t, n) {
	var r = zr(e), i = r.CustomEvent;
	typeof i == "function" ? i = new i(t, n) : (i = r.document.createEvent("Event"), n ? (i.initEvent(t, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(t, !1, !1)), e.dispatchEvent(i);
}
function ji(e, t) {
	return function() {
		return Ai(this, e, t);
	};
}
function Mi(e, t) {
	return function() {
		return Ai(this, e, t.apply(this, arguments));
	};
}
function Ni(e, t) {
	return this.each((typeof t == "function" ? Mi : ji)(e, t));
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/iterator.js
function* Pi() {
	for (var e = this._groups, t = 0, n = e.length; t < n; ++t) for (var r = e[t], i = 0, a = r.length, o; i < a; ++i) (o = r[i]) && (yield o);
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/index.js
var Fi = [null];
function Ii(e, t) {
	this._groups = e, this._parents = t;
}
function Li() {
	return new Ii([[document.documentElement]], Fi);
}
function Ri() {
	return this;
}
Ii.prototype = Li.prototype = {
	constructor: Ii,
	select: Jn,
	selectAll: $n,
	selectChild: ar,
	selectChildren: lr,
	filter: ur,
	data: vr,
	enter: fr,
	exit: br,
	join: xr,
	merge: Sr,
	selection: Ri,
	order: Cr,
	sort: wr,
	call: Er,
	nodes: Dr,
	node: Or,
	size: kr,
	empty: Ar,
	each: jr,
	attr: Rr,
	style: Ur,
	property: Jr,
	classed: ri,
	text: si,
	html: di,
	raise: pi,
	lower: hi,
	append: gi,
	insert: vi,
	remove: bi,
	clone: Ci,
	datum: wi,
	on: ki,
	dispatch: Ni,
	[Symbol.iterator]: Pi
};
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/select.js
function zi(e) {
	return typeof e == "string" ? new Ii([[document.querySelector(e)]], [document.documentElement]) : new Ii([[e]], Fi);
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/sourceEvent.js
function Bi(e) {
	let t;
	for (; t = e.sourceEvent;) e = t;
	return e;
}
//#endregion
//#region node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/pointer.js
function Vi(e, t) {
	if (e = Bi(e), t === void 0 && (t = e.currentTarget), t) {
		var n = t.ownerSVGElement || t;
		if (n.createSVGPoint) {
			var r = n.createSVGPoint();
			return r.x = e.clientX, r.y = e.clientY, r = r.matrixTransform(t.getScreenCTM().inverse()), [r.x, r.y];
		}
		if (t.getBoundingClientRect) {
			var i = t.getBoundingClientRect();
			return [e.clientX - i.left - t.clientLeft, e.clientY - i.top - t.clientTop];
		}
	}
	return [e.pageX, e.pageY];
}
//#endregion
//#region node_modules/.pnpm/d3-drag@3.0.0/node_modules/d3-drag/src/noevent.js
var Hi = { passive: !1 }, Ui = {
	capture: !0,
	passive: !1
};
function Wi(e) {
	e.stopImmediatePropagation();
}
function Gi(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region node_modules/.pnpm/d3-drag@3.0.0/node_modules/d3-drag/src/nodrag.js
function Ki(e) {
	var t = e.document.documentElement, n = zi(e).on("dragstart.drag", Gi, Ui);
	"onselectstart" in t ? n.on("selectstart.drag", Gi, Ui) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function qi(e, t) {
	var n = e.document.documentElement, r = zi(e).on("dragstart.drag", null);
	t && (r.on("click.drag", Gi, Ui), setTimeout(function() {
		r.on("click.drag", null);
	}, 0)), "onselectstart" in n ? r.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
//#endregion
//#region node_modules/.pnpm/d3-drag@3.0.0/node_modules/d3-drag/src/constant.js
var Ji = (e) => () => e;
//#endregion
//#region node_modules/.pnpm/d3-drag@3.0.0/node_modules/d3-drag/src/event.js
function Yi(e, { sourceEvent: t, subject: n, target: r, identifier: i, active: a, x: o, y: s, dx: c, dy: l, dispatch: u }) {
	Object.defineProperties(this, {
		type: {
			value: e,
			enumerable: !0,
			configurable: !0
		},
		sourceEvent: {
			value: t,
			enumerable: !0,
			configurable: !0
		},
		subject: {
			value: n,
			enumerable: !0,
			configurable: !0
		},
		target: {
			value: r,
			enumerable: !0,
			configurable: !0
		},
		identifier: {
			value: i,
			enumerable: !0,
			configurable: !0
		},
		active: {
			value: a,
			enumerable: !0,
			configurable: !0
		},
		x: {
			value: o,
			enumerable: !0,
			configurable: !0
		},
		y: {
			value: s,
			enumerable: !0,
			configurable: !0
		},
		dx: {
			value: c,
			enumerable: !0,
			configurable: !0
		},
		dy: {
			value: l,
			enumerable: !0,
			configurable: !0
		},
		_: { value: u }
	});
}
Yi.prototype.on = function() {
	var e = this._.on.apply(this._, arguments);
	return e === this._ ? this : e;
};
//#endregion
//#region node_modules/.pnpm/d3-drag@3.0.0/node_modules/d3-drag/src/drag.js
function Xi(e) {
	return !e.ctrlKey && !e.button;
}
function Zi() {
	return this.parentNode;
}
function Qi(e, t) {
	return t ?? {
		x: e.x,
		y: e.y
	};
}
function $i() {
	return navigator.maxTouchPoints || "ontouchstart" in this;
}
function ea() {
	var e = Xi, t = Zi, n = Qi, r = $i, i = {}, a = In("start", "drag", "end"), o = 0, s, c, l, u, d = 0;
	function f(e) {
		e.on("mousedown.drag", p).filter(r).on("touchstart.drag", g).on("touchmove.drag", _, Hi).on("touchend.drag touchcancel.drag", v).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	}
	function p(n, r) {
		if (!(u || !e.call(this, n, r))) {
			var i = y(this, t.call(this, n, r), n, r, "mouse");
			i && (zi(n.view).on("mousemove.drag", m, Ui).on("mouseup.drag", h, Ui), Ki(n.view), Wi(n), l = !1, s = n.clientX, c = n.clientY, i("start", n));
		}
	}
	function m(e) {
		if (Gi(e), !l) {
			var t = e.clientX - s, n = e.clientY - c;
			l = t * t + n * n > d;
		}
		i.mouse("drag", e);
	}
	function h(e) {
		zi(e.view).on("mousemove.drag mouseup.drag", null), qi(e.view, l), Gi(e), i.mouse("end", e);
	}
	function g(n, r) {
		if (e.call(this, n, r)) {
			var i = n.changedTouches, a = t.call(this, n, r), o = i.length, s, c;
			for (s = 0; s < o; ++s) (c = y(this, a, n, r, i[s].identifier, i[s])) && (Wi(n), c("start", n, i[s]));
		}
	}
	function _(e) {
		var t = e.changedTouches, n = t.length, r, a;
		for (r = 0; r < n; ++r) (a = i[t[r].identifier]) && (Gi(e), a("drag", e, t[r]));
	}
	function v(e) {
		var t = e.changedTouches, n = t.length, r, a;
		for (u && clearTimeout(u), u = setTimeout(function() {
			u = null;
		}, 500), r = 0; r < n; ++r) (a = i[t[r].identifier]) && (Wi(e), a("end", e, t[r]));
	}
	function y(e, t, r, s, c, l) {
		var u = a.copy(), d = Vi(l || r, t), p, m, h;
		if ((h = n.call(e, new Yi("beforestart", {
			sourceEvent: r,
			target: f,
			identifier: c,
			active: o,
			x: d[0],
			y: d[1],
			dx: 0,
			dy: 0,
			dispatch: u
		}), s)) != null) return p = h.x - d[0] || 0, m = h.y - d[1] || 0, function n(r, a, l) {
			var g = d, _;
			switch (r) {
				case "start":
					i[c] = n, _ = o++;
					break;
				case "end": delete i[c], --o;
				case "drag":
					d = Vi(l || a, t), _ = o;
					break;
			}
			u.call(r, e, new Yi(r, {
				sourceEvent: a,
				subject: h,
				target: f,
				identifier: c,
				active: _,
				x: d[0] + p,
				y: d[1] + m,
				dx: d[0] - g[0],
				dy: d[1] - g[1],
				dispatch: u
			}), s);
		};
	}
	return f.filter = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : Ji(!!t), f) : e;
	}, f.container = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : Ji(e), f) : t;
	}, f.subject = function(e) {
		return arguments.length ? (n = typeof e == "function" ? e : Ji(e), f) : n;
	}, f.touchable = function(e) {
		return arguments.length ? (r = typeof e == "function" ? e : Ji(!!e), f) : r;
	}, f.on = function() {
		var e = a.on.apply(a, arguments);
		return e === a ? f : e;
	}, f.clickDistance = function(e) {
		return arguments.length ? (d = (e = +e) * e, f) : Math.sqrt(d);
	}, f;
}
//#endregion
//#region node_modules/.pnpm/d3-color@3.1.0/node_modules/d3-color/src/define.js
function ta(e, t, n) {
	e.prototype = t.prototype = n, n.constructor = e;
}
function na(e, t) {
	var n = Object.create(e.prototype);
	for (var r in t) n[r] = t[r];
	return n;
}
//#endregion
//#region node_modules/.pnpm/d3-color@3.1.0/node_modules/d3-color/src/color.js
function ra() {}
var ia = .7, aa = 1 / ia, oa = "\\s*([+-]?\\d+)\\s*", sa = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", ca = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", la = /^#([0-9a-f]{3,8})$/, ua = RegExp(`^rgb\\(${oa},${oa},${oa}\\)$`), da = RegExp(`^rgb\\(${ca},${ca},${ca}\\)$`), fa = RegExp(`^rgba\\(${oa},${oa},${oa},${sa}\\)$`), pa = RegExp(`^rgba\\(${ca},${ca},${ca},${sa}\\)$`), ma = RegExp(`^hsl\\(${sa},${ca},${ca}\\)$`), ha = RegExp(`^hsla\\(${sa},${ca},${ca},${sa}\\)$`), ga = {
	aliceblue: 15792383,
	antiquewhite: 16444375,
	aqua: 65535,
	aquamarine: 8388564,
	azure: 15794175,
	beige: 16119260,
	bisque: 16770244,
	black: 0,
	blanchedalmond: 16772045,
	blue: 255,
	blueviolet: 9055202,
	brown: 10824234,
	burlywood: 14596231,
	cadetblue: 6266528,
	chartreuse: 8388352,
	chocolate: 13789470,
	coral: 16744272,
	cornflowerblue: 6591981,
	cornsilk: 16775388,
	crimson: 14423100,
	cyan: 65535,
	darkblue: 139,
	darkcyan: 35723,
	darkgoldenrod: 12092939,
	darkgray: 11119017,
	darkgreen: 25600,
	darkgrey: 11119017,
	darkkhaki: 12433259,
	darkmagenta: 9109643,
	darkolivegreen: 5597999,
	darkorange: 16747520,
	darkorchid: 10040012,
	darkred: 9109504,
	darksalmon: 15308410,
	darkseagreen: 9419919,
	darkslateblue: 4734347,
	darkslategray: 3100495,
	darkslategrey: 3100495,
	darkturquoise: 52945,
	darkviolet: 9699539,
	deeppink: 16716947,
	deepskyblue: 49151,
	dimgray: 6908265,
	dimgrey: 6908265,
	dodgerblue: 2003199,
	firebrick: 11674146,
	floralwhite: 16775920,
	forestgreen: 2263842,
	fuchsia: 16711935,
	gainsboro: 14474460,
	ghostwhite: 16316671,
	gold: 16766720,
	goldenrod: 14329120,
	gray: 8421504,
	green: 32768,
	greenyellow: 11403055,
	grey: 8421504,
	honeydew: 15794160,
	hotpink: 16738740,
	indianred: 13458524,
	indigo: 4915330,
	ivory: 16777200,
	khaki: 15787660,
	lavender: 15132410,
	lavenderblush: 16773365,
	lawngreen: 8190976,
	lemonchiffon: 16775885,
	lightblue: 11393254,
	lightcoral: 15761536,
	lightcyan: 14745599,
	lightgoldenrodyellow: 16448210,
	lightgray: 13882323,
	lightgreen: 9498256,
	lightgrey: 13882323,
	lightpink: 16758465,
	lightsalmon: 16752762,
	lightseagreen: 2142890,
	lightskyblue: 8900346,
	lightslategray: 7833753,
	lightslategrey: 7833753,
	lightsteelblue: 11584734,
	lightyellow: 16777184,
	lime: 65280,
	limegreen: 3329330,
	linen: 16445670,
	magenta: 16711935,
	maroon: 8388608,
	mediumaquamarine: 6737322,
	mediumblue: 205,
	mediumorchid: 12211667,
	mediumpurple: 9662683,
	mediumseagreen: 3978097,
	mediumslateblue: 8087790,
	mediumspringgreen: 64154,
	mediumturquoise: 4772300,
	mediumvioletred: 13047173,
	midnightblue: 1644912,
	mintcream: 16121850,
	mistyrose: 16770273,
	moccasin: 16770229,
	navajowhite: 16768685,
	navy: 128,
	oldlace: 16643558,
	olive: 8421376,
	olivedrab: 7048739,
	orange: 16753920,
	orangered: 16729344,
	orchid: 14315734,
	palegoldenrod: 15657130,
	palegreen: 10025880,
	paleturquoise: 11529966,
	palevioletred: 14381203,
	papayawhip: 16773077,
	peachpuff: 16767673,
	peru: 13468991,
	pink: 16761035,
	plum: 14524637,
	powderblue: 11591910,
	purple: 8388736,
	rebeccapurple: 6697881,
	red: 16711680,
	rosybrown: 12357519,
	royalblue: 4286945,
	saddlebrown: 9127187,
	salmon: 16416882,
	sandybrown: 16032864,
	seagreen: 3050327,
	seashell: 16774638,
	sienna: 10506797,
	silver: 12632256,
	skyblue: 8900331,
	slateblue: 6970061,
	slategray: 7372944,
	slategrey: 7372944,
	snow: 16775930,
	springgreen: 65407,
	steelblue: 4620980,
	tan: 13808780,
	teal: 32896,
	thistle: 14204888,
	tomato: 16737095,
	turquoise: 4251856,
	violet: 15631086,
	wheat: 16113331,
	white: 16777215,
	whitesmoke: 16119285,
	yellow: 16776960,
	yellowgreen: 10145074
};
ta(ra, xa, {
	copy(e) {
		return Object.assign(new this.constructor(), this, e);
	},
	displayable() {
		return this.rgb().displayable();
	},
	hex: _a,
	formatHex: _a,
	formatHex8: va,
	formatHsl: ya,
	formatRgb: ba,
	toString: ba
});
function _a() {
	return this.rgb().formatHex();
}
function va() {
	return this.rgb().formatHex8();
}
function ya() {
	return Pa(this).formatHsl();
}
function ba() {
	return this.rgb().formatRgb();
}
function xa(e) {
	var t, n;
	return e = (e + "").trim().toLowerCase(), (t = la.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? Sa(t) : n === 3 ? new Ea(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? Ca(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? Ca(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = ua.exec(e)) ? new Ea(t[1], t[2], t[3], 1) : (t = da.exec(e)) ? new Ea(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = fa.exec(e)) ? Ca(t[1], t[2], t[3], t[4]) : (t = pa.exec(e)) ? Ca(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = ma.exec(e)) ? Na(t[1], t[2] / 100, t[3] / 100, 1) : (t = ha.exec(e)) ? Na(t[1], t[2] / 100, t[3] / 100, t[4]) : ga.hasOwnProperty(e) ? Sa(ga[e]) : e === "transparent" ? new Ea(NaN, NaN, NaN, 0) : null;
}
function Sa(e) {
	return new Ea(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function Ca(e, t, n, r) {
	return r <= 0 && (e = t = n = NaN), new Ea(e, t, n, r);
}
function wa(e) {
	return e instanceof ra || (e = xa(e)), e ? (e = e.rgb(), new Ea(e.r, e.g, e.b, e.opacity)) : new Ea();
}
function Ta(e, t, n, r) {
	return arguments.length === 1 ? wa(e) : new Ea(e, t, n, r ?? 1);
}
function Ea(e, t, n, r) {
	this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
ta(Ea, Ta, na(ra, {
	brighter(e) {
		return e = e == null ? aa : aa ** +e, new Ea(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? ia : ia ** +e, new Ea(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	rgb() {
		return this;
	},
	clamp() {
		return new Ea(ja(this.r), ja(this.g), ja(this.b), Aa(this.opacity));
	},
	displayable() {
		return -.5 <= this.r && this.r < 255.5 && -.5 <= this.g && this.g < 255.5 && -.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
	},
	hex: Da,
	formatHex: Da,
	formatHex8: Oa,
	formatRgb: ka,
	toString: ka
}));
function Da() {
	return `#${Ma(this.r)}${Ma(this.g)}${Ma(this.b)}`;
}
function Oa() {
	return `#${Ma(this.r)}${Ma(this.g)}${Ma(this.b)}${Ma((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function ka() {
	let e = Aa(this.opacity);
	return `${e === 1 ? "rgb(" : "rgba("}${ja(this.r)}, ${ja(this.g)}, ${ja(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function Aa(e) {
	return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function ja(e) {
	return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function Ma(e) {
	return e = ja(e), (e < 16 ? "0" : "") + e.toString(16);
}
function Na(e, t, n, r) {
	return r <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new Ia(e, t, n, r);
}
function Pa(e) {
	if (e instanceof Ia) return new Ia(e.h, e.s, e.l, e.opacity);
	if (e instanceof ra || (e = xa(e)), !e) return new Ia();
	if (e instanceof Ia) return e;
	e = e.rgb();
	var t = e.r / 255, n = e.g / 255, r = e.b / 255, i = Math.min(t, n, r), a = Math.max(t, n, r), o = NaN, s = a - i, c = (a + i) / 2;
	return s ? (o = t === a ? (n - r) / s + (n < r) * 6 : n === a ? (r - t) / s + 2 : (t - n) / s + 4, s /= c < .5 ? a + i : 2 - a - i, o *= 60) : s = c > 0 && c < 1 ? 0 : o, new Ia(o, s, c, e.opacity);
}
function Fa(e, t, n, r) {
	return arguments.length === 1 ? Pa(e) : new Ia(e, t, n, r ?? 1);
}
function Ia(e, t, n, r) {
	this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
ta(Ia, Fa, na(ra, {
	brighter(e) {
		return e = e == null ? aa : aa ** +e, new Ia(this.h, this.s, this.l * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? ia : ia ** +e, new Ia(this.h, this.s, this.l * e, this.opacity);
	},
	rgb() {
		var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < .5 ? n : 1 - n) * t, i = 2 * n - r;
		return new Ea(za(e >= 240 ? e - 240 : e + 120, i, r), za(e, i, r), za(e < 120 ? e + 240 : e - 120, i, r), this.opacity);
	},
	clamp() {
		return new Ia(La(this.h), Ra(this.s), Ra(this.l), Aa(this.opacity));
	},
	displayable() {
		return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
	},
	formatHsl() {
		let e = Aa(this.opacity);
		return `${e === 1 ? "hsl(" : "hsla("}${La(this.h)}, ${Ra(this.s) * 100}%, ${Ra(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
	}
}));
function La(e) {
	return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function Ra(e) {
	return Math.max(0, Math.min(1, e || 0));
}
function za(e, t, n) {
	return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
//#endregion
//#region node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/constant.js
var Ba = (e) => () => e;
//#endregion
//#region node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/color.js
function Va(e, t) {
	return function(n) {
		return e + n * t;
	};
}
function Ha(e, t, n) {
	return e **= +n, t = t ** +n - e, n = 1 / n, function(r) {
		return (e + r * t) ** +n;
	};
}
function Ua(e) {
	return (e = +e) == 1 ? Wa : function(t, n) {
		return n - t ? Ha(t, n, e) : Ba(isNaN(t) ? n : t);
	};
}
function Wa(e, t) {
	var n = t - e;
	return n ? Va(e, n) : Ba(isNaN(e) ? t : e);
}
//#endregion
//#region node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/rgb.js
var Ga = (function e(t) {
	var n = Ua(t);
	function r(e, t) {
		var r = n((e = Ta(e)).r, (t = Ta(t)).r), i = n(e.g, t.g), a = n(e.b, t.b), o = Wa(e.opacity, t.opacity);
		return function(t) {
			return e.r = r(t), e.g = i(t), e.b = a(t), e.opacity = o(t), e + "";
		};
	}
	return r.gamma = e, r;
})(1);
//#endregion
//#region node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/numberArray.js
function Ka(e, t) {
	t ||= [];
	var n = e ? Math.min(t.length, e.length) : 0, r = t.slice(), i;
	return function(a) {
		for (i = 0; i < n; ++i) r[i] = e[i] * (1 - a) + t[i] * a;
		return r;
	};
}
function qa(e) {
	return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
//#endregion
//#region node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/array.js
function Ja(e, t) {
	var n = t ? t.length : 0, r = e ? Math.min(n, e.length) : 0, i = Array(r), a = Array(n), o;
	for (o = 0; o < r; ++o) i[o] = ro(e[o], t[o]);
	for (; o < n; ++o) a[o] = t[o];
	return function(e) {
		for (o = 0; o < r; ++o) a[o] = i[o](e);
		return a;
	};
}
//#endregion
//#region node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/date.js
function Ya(e, t) {
	var n = /* @__PURE__ */ new Date();
	return e = +e, t = +t, function(r) {
		return n.setTime(e * (1 - r) + t * r), n;
	};
}
//#endregion
//#region node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/number.js
function Xa(e, t) {
	return e = +e, t = +t, function(n) {
		return e * (1 - n) + t * n;
	};
}
//#endregion
//#region node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/object.js
function Za(e, t) {
	var n = {}, r = {}, i;
	for (i in (typeof e != "object" || !e) && (e = {}), (typeof t != "object" || !t) && (t = {}), t) i in e ? n[i] = ro(e[i], t[i]) : r[i] = t[i];
	return function(e) {
		for (i in n) r[i] = n[i](e);
		return r;
	};
}
//#endregion
//#region node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/string.js
var Qa = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, $a = new RegExp(Qa.source, "g");
function eo(e) {
	return function() {
		return e;
	};
}
function to(e) {
	return function(t) {
		return e(t) + "";
	};
}
function no(e, t) {
	var n = Qa.lastIndex = $a.lastIndex = 0, r, i, a, o = -1, s = [], c = [];
	for (e += "", t += ""; (r = Qa.exec(e)) && (i = $a.exec(t));) (a = i.index) > n && (a = t.slice(n, a), s[o] ? s[o] += a : s[++o] = a), (r = r[0]) === (i = i[0]) ? s[o] ? s[o] += i : s[++o] = i : (s[++o] = null, c.push({
		i: o,
		x: Xa(r, i)
	})), n = $a.lastIndex;
	return n < t.length && (a = t.slice(n), s[o] ? s[o] += a : s[++o] = a), s.length < 2 ? c[0] ? to(c[0].x) : eo(t) : (t = c.length, function(e) {
		for (var n = 0, r; n < t; ++n) s[(r = c[n]).i] = r.x(e);
		return s.join("");
	});
}
//#endregion
//#region node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/value.js
function ro(e, t) {
	var n = typeof t, r;
	return t == null || n === "boolean" ? Ba(t) : (n === "number" ? Xa : n === "string" ? (r = xa(t)) ? (t = r, Ga) : no : t instanceof xa ? Ga : t instanceof Date ? Ya : qa(t) ? Ka : Array.isArray(t) ? Ja : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? Za : Xa)(e, t);
}
//#endregion
//#region node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/transform/decompose.js
var io = 180 / Math.PI, J = {
	translateX: 0,
	translateY: 0,
	rotate: 0,
	skewX: 0,
	scaleX: 1,
	scaleY: 1
};
function ao(e, t, n, r, i, a) {
	var o, s, c;
	return (o = Math.sqrt(e * e + t * t)) && (e /= o, t /= o), (c = e * n + t * r) && (n -= e * c, r -= t * c), (s = Math.sqrt(n * n + r * r)) && (n /= s, r /= s, c /= s), e * r < t * n && (e = -e, t = -t, c = -c, o = -o), {
		translateX: i,
		translateY: a,
		rotate: Math.atan2(t, e) * io,
		skewX: Math.atan(c) * io,
		scaleX: o,
		scaleY: s
	};
}
//#endregion
//#region node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/transform/parse.js
var oo;
function so(e) {
	let t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
	return t.isIdentity ? J : ao(t.a, t.b, t.c, t.d, t.e, t.f);
}
function co(e) {
	return e == null || (oo ||= document.createElementNS("http://www.w3.org/2000/svg", "g"), oo.setAttribute("transform", e), !(e = oo.transform.baseVal.consolidate())) ? J : (e = e.matrix, ao(e.a, e.b, e.c, e.d, e.e, e.f));
}
//#endregion
//#region node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/transform/index.js
function lo(e, t, n, r) {
	function i(e) {
		return e.length ? e.pop() + " " : "";
	}
	function a(e, r, i, a, o, s) {
		if (e !== i || r !== a) {
			var c = o.push("translate(", null, t, null, n);
			s.push({
				i: c - 4,
				x: Xa(e, i)
			}, {
				i: c - 2,
				x: Xa(r, a)
			});
		} else (i || a) && o.push("translate(" + i + t + a + n);
	}
	function o(e, t, n, a) {
		e === t ? t && n.push(i(n) + "rotate(" + t + r) : (e - t > 180 ? t += 360 : t - e > 180 && (e += 360), a.push({
			i: n.push(i(n) + "rotate(", null, r) - 2,
			x: Xa(e, t)
		}));
	}
	function s(e, t, n, a) {
		e === t ? t && n.push(i(n) + "skewX(" + t + r) : a.push({
			i: n.push(i(n) + "skewX(", null, r) - 2,
			x: Xa(e, t)
		});
	}
	function c(e, t, n, r, a, o) {
		if (e !== n || t !== r) {
			var s = a.push(i(a) + "scale(", null, ",", null, ")");
			o.push({
				i: s - 4,
				x: Xa(e, n)
			}, {
				i: s - 2,
				x: Xa(t, r)
			});
		} else (n !== 1 || r !== 1) && a.push(i(a) + "scale(" + n + "," + r + ")");
	}
	return function(t, n) {
		var r = [], i = [];
		return t = e(t), n = e(n), a(t.translateX, t.translateY, n.translateX, n.translateY, r, i), o(t.rotate, n.rotate, r, i), s(t.skewX, n.skewX, r, i), c(t.scaleX, t.scaleY, n.scaleX, n.scaleY, r, i), t = n = null, function(e) {
			for (var t = -1, n = i.length, a; ++t < n;) r[(a = i[t]).i] = a.x(e);
			return r.join("");
		};
	};
}
var uo = lo(so, "px, ", "px)", "deg)"), fo = lo(co, ", ", ")", ")"), po = 1e-12;
function mo(e) {
	return ((e = Math.exp(e)) + 1 / e) / 2;
}
function ho(e) {
	return ((e = Math.exp(e)) - 1 / e) / 2;
}
function go(e) {
	return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
var _o = (function e(t, n, r) {
	function i(e, i) {
		var a = e[0], o = e[1], s = e[2], c = i[0], l = i[1], u = i[2], d = c - a, f = l - o, p = d * d + f * f, m, h;
		if (p < po) h = Math.log(u / s) / t, m = function(e) {
			return [
				a + e * d,
				o + e * f,
				s * Math.exp(t * e * h)
			];
		};
		else {
			var g = Math.sqrt(p), _ = (u * u - s * s + r * p) / (2 * s * n * g), v = (u * u - s * s - r * p) / (2 * u * n * g), y = Math.log(Math.sqrt(_ * _ + 1) - _);
			h = (Math.log(Math.sqrt(v * v + 1) - v) - y) / t, m = function(e) {
				var r = e * h, i = mo(y), c = s / (n * g) * (i * go(t * r + y) - ho(y));
				return [
					a + c * d,
					o + c * f,
					s * i / mo(t * r + y)
				];
			};
		}
		return m.duration = h * 1e3 * t / Math.SQRT2, m;
	}
	return i.rho = function(t) {
		var n = Math.max(.001, +t), r = n * n;
		return e(n, r, r * r);
	}, i;
})(Math.SQRT2, 2, 4), vo = 0, yo = 0, bo = 0, xo = 1e3, So, Co, wo = 0, To = 0, Eo = 0, Do = typeof performance == "object" && performance.now ? performance : Date, Oo = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
	setTimeout(e, 17);
};
function ko() {
	return To ||= (Oo(Ao), Do.now() + Eo);
}
function Ao() {
	To = 0;
}
function jo() {
	this._call = this._time = this._next = null;
}
jo.prototype = Mo.prototype = {
	constructor: jo,
	restart: function(e, t, n) {
		if (typeof e != "function") throw TypeError("callback is not a function");
		n = (n == null ? ko() : +n) + (t == null ? 0 : +t), !this._next && Co !== this && (Co ? Co._next = this : So = this, Co = this), this._call = e, this._time = n, Lo();
	},
	stop: function() {
		this._call && (this._call = null, this._time = Infinity, Lo());
	}
};
function Mo(e, t, n) {
	var r = new jo();
	return r.restart(e, t, n), r;
}
function No() {
	ko(), ++vo;
	for (var e = So, t; e;) (t = To - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
	--vo;
}
function Po() {
	To = (wo = Do.now()) + Eo, vo = yo = 0;
	try {
		No();
	} finally {
		vo = 0, Io(), To = 0;
	}
}
function Fo() {
	var e = Do.now(), t = e - wo;
	t > xo && (Eo -= t, wo = e);
}
function Io() {
	for (var e, t = So, n, r = Infinity; t;) t._call ? (r > t._time && (r = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : So = n);
	Co = e, Lo(r);
}
function Lo(e) {
	vo || (yo &&= clearTimeout(yo), e - To > 24 ? (e < Infinity && (yo = setTimeout(Po, e - Do.now() - Eo)), bo &&= clearInterval(bo)) : (bo ||= (wo = Do.now(), setInterval(Fo, xo)), vo = 1, Oo(Po)));
}
//#endregion
//#region node_modules/.pnpm/d3-timer@3.0.1/node_modules/d3-timer/src/timeout.js
function Ro(e, t, n) {
	var r = new jo();
	return t = t == null ? 0 : +t, r.restart((n) => {
		r.stop(), e(n + t);
	}, t, n), r;
}
//#endregion
//#region node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/schedule.js
var zo = In("start", "end", "cancel", "interrupt"), Bo = [];
function Vo(e, t, n, r, i, a) {
	var o = e.__transition;
	if (!o) e.__transition = {};
	else if (n in o) return;
	Go(e, n, {
		name: t,
		index: r,
		group: i,
		on: zo,
		tween: Bo,
		time: a.time,
		delay: a.delay,
		duration: a.duration,
		ease: a.ease,
		timer: null,
		state: 0
	});
}
function Ho(e, t) {
	var n = Wo(e, t);
	if (n.state > 0) throw Error("too late; already scheduled");
	return n;
}
function Uo(e, t) {
	var n = Wo(e, t);
	if (n.state > 3) throw Error("too late; already running");
	return n;
}
function Wo(e, t) {
	var n = e.__transition;
	if (!n || !(n = n[t])) throw Error("transition not found");
	return n;
}
function Go(e, t, n) {
	var r = e.__transition, i;
	r[t] = n, n.timer = Mo(a, 0, n.time);
	function a(e) {
		n.state = 1, n.timer.restart(o, n.delay, n.time), n.delay <= e && o(e - n.delay);
	}
	function o(a) {
		var l, u, d, f;
		if (n.state !== 1) return c();
		for (l in r) if (f = r[l], f.name === n.name) {
			if (f.state === 3) return Ro(o);
			f.state === 4 ? (f.state = 6, f.timer.stop(), f.on.call("interrupt", e, e.__data__, f.index, f.group), delete r[l]) : +l < t && (f.state = 6, f.timer.stop(), f.on.call("cancel", e, e.__data__, f.index, f.group), delete r[l]);
		}
		if (Ro(function() {
			n.state === 3 && (n.state = 4, n.timer.restart(s, n.delay, n.time), s(a));
		}), n.state = 2, n.on.call("start", e, e.__data__, n.index, n.group), n.state === 2) {
			for (n.state = 3, i = Array(d = n.tween.length), l = 0, u = -1; l < d; ++l) (f = n.tween[l].value.call(e, e.__data__, n.index, n.group)) && (i[++u] = f);
			i.length = u + 1;
		}
	}
	function s(t) {
		for (var r = t < n.duration ? n.ease.call(null, t / n.duration) : (n.timer.restart(c), n.state = 5, 1), a = -1, o = i.length; ++a < o;) i[a].call(e, r);
		n.state === 5 && (n.on.call("end", e, e.__data__, n.index, n.group), c());
	}
	function c() {
		for (var i in n.state = 6, n.timer.stop(), delete r[t], r) return;
		delete e.__transition;
	}
}
//#endregion
//#region node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/interrupt.js
function Ko(e, t) {
	var n = e.__transition, r, i, a = !0, o;
	if (n) {
		for (o in t = t == null ? null : t + "", n) {
			if ((r = n[o]).name !== t) {
				a = !1;
				continue;
			}
			i = r.state > 2 && r.state < 5, r.state = 6, r.timer.stop(), r.on.call(i ? "interrupt" : "cancel", e, e.__data__, r.index, r.group), delete n[o];
		}
		a && delete e.__transition;
	}
}
//#endregion
//#region node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/selection/interrupt.js
function qo(e) {
	return this.each(function() {
		Ko(this, e);
	});
}
//#endregion
//#region node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/tween.js
function Jo(e, t) {
	var n, r;
	return function() {
		var i = Uo(this, e), a = i.tween;
		if (a !== n) {
			r = n = a;
			for (var o = 0, s = r.length; o < s; ++o) if (r[o].name === t) {
				r = r.slice(), r.splice(o, 1);
				break;
			}
		}
		i.tween = r;
	};
}
function Yo(e, t, n) {
	var r, i;
	if (typeof n != "function") throw Error();
	return function() {
		var a = Uo(this, e), o = a.tween;
		if (o !== r) {
			i = (r = o).slice();
			for (var s = {
				name: t,
				value: n
			}, c = 0, l = i.length; c < l; ++c) if (i[c].name === t) {
				i[c] = s;
				break;
			}
			c === l && i.push(s);
		}
		a.tween = i;
	};
}
function Xo(e, t) {
	var n = this._id;
	if (e += "", arguments.length < 2) {
		for (var r = Wo(this.node(), n).tween, i = 0, a = r.length, o; i < a; ++i) if ((o = r[i]).name === e) return o.value;
		return null;
	}
	return this.each((t == null ? Jo : Yo)(n, e, t));
}
function Zo(e, t, n) {
	var r = e._id;
	return e.each(function() {
		var e = Uo(this, r);
		(e.value ||= {})[t] = n.apply(this, arguments);
	}), function(e) {
		return Wo(e, r).value[t];
	};
}
//#endregion
//#region node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/interpolate.js
function Qo(e, t) {
	var n;
	return (typeof t == "number" ? Xa : t instanceof xa ? Ga : (n = xa(t)) ? (t = n, Ga) : no)(e, t);
}
//#endregion
//#region node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/attr.js
function $o(e) {
	return function() {
		this.removeAttribute(e);
	};
}
function es(e) {
	return function() {
		this.removeAttributeNS(e.space, e.local);
	};
}
function ts(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = this.getAttribute(e);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function ns(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = this.getAttributeNS(e.space, e.local);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function rs(e, t, n) {
	var r, i, a;
	return function() {
		var o, s = n(this), c;
		return s == null ? void this.removeAttribute(e) : (o = this.getAttribute(e), c = s + "", o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s)));
	};
}
function is(e, t, n) {
	var r, i, a;
	return function() {
		var o, s = n(this), c;
		return s == null ? void this.removeAttributeNS(e.space, e.local) : (o = this.getAttributeNS(e.space, e.local), c = s + "", o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s)));
	};
}
function as(e, t) {
	var n = Hn(e), r = n === "transform" ? fo : Qo;
	return this.attrTween(e, typeof t == "function" ? (n.local ? is : rs)(n, r, Zo(this, "attr." + e, t)) : t == null ? (n.local ? es : $o)(n) : (n.local ? ns : ts)(n, r, t));
}
//#endregion
//#region node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/attrTween.js
function os(e, t) {
	return function(n) {
		this.setAttribute(e, t.call(this, n));
	};
}
function ss(e, t) {
	return function(n) {
		this.setAttributeNS(e.space, e.local, t.call(this, n));
	};
}
function cs(e, t) {
	var n, r;
	function i() {
		var i = t.apply(this, arguments);
		return i !== r && (n = (r = i) && ss(e, i)), n;
	}
	return i._value = t, i;
}
function ls(e, t) {
	var n, r;
	function i() {
		var i = t.apply(this, arguments);
		return i !== r && (n = (r = i) && os(e, i)), n;
	}
	return i._value = t, i;
}
function us(e, t) {
	var n = "attr." + e;
	if (arguments.length < 2) return (n = this.tween(n)) && n._value;
	if (t == null) return this.tween(n, null);
	if (typeof t != "function") throw Error();
	var r = Hn(e);
	return this.tween(n, (r.local ? cs : ls)(r, t));
}
//#endregion
//#region node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/delay.js
function ds(e, t) {
	return function() {
		Ho(this, e).delay = +t.apply(this, arguments);
	};
}
function fs(e, t) {
	return t = +t, function() {
		Ho(this, e).delay = t;
	};
}
function ps(e) {
	var t = this._id;
	return arguments.length ? this.each((typeof e == "function" ? ds : fs)(t, e)) : Wo(this.node(), t).delay;
}
//#endregion
//#region node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/duration.js
function ms(e, t) {
	return function() {
		Uo(this, e).duration = +t.apply(this, arguments);
	};
}
function hs(e, t) {
	return t = +t, function() {
		Uo(this, e).duration = t;
	};
}
function gs(e) {
	var t = this._id;
	return arguments.length ? this.each((typeof e == "function" ? ms : hs)(t, e)) : Wo(this.node(), t).duration;
}
//#endregion
//#region node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/ease.js
function _s(e, t) {
	if (typeof t != "function") throw Error();
	return function() {
		Uo(this, e).ease = t;
	};
}
function vs(e) {
	var t = this._id;
	return arguments.length ? this.each(_s(t, e)) : Wo(this.node(), t).ease;
}
//#endregion
//#region node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/easeVarying.js
function ys(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		if (typeof n != "function") throw Error();
		Uo(this, e).ease = n;
	};
}
function bs(e) {
	if (typeof e != "function") throw Error();
	return this.each(ys(this._id, e));
}
//#endregion
//#region node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/filter.js
function xs(e) {
	typeof e != "function" && (e = er(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = [], c, l = 0; l < o; ++l) (c = a[l]) && e.call(c, c.__data__, l, a) && s.push(c);
	return new Xs(r, this._parents, this._name, this._id);
}
//#endregion
//#region node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/merge.js
function Ss(e) {
	if (e._id !== this._id) throw Error();
	for (var t = this._groups, n = e._groups, r = t.length, i = n.length, a = Math.min(r, i), o = Array(r), s = 0; s < a; ++s) for (var c = t[s], l = n[s], u = c.length, d = o[s] = Array(u), f, p = 0; p < u; ++p) (f = c[p] || l[p]) && (d[p] = f);
	for (; s < r; ++s) o[s] = t[s];
	return new Xs(o, this._parents, this._name, this._id);
}
//#endregion
//#region node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/on.js
function Cs(e) {
	return (e + "").trim().split(/^|\s+/).every(function(e) {
		var t = e.indexOf(".");
		return t >= 0 && (e = e.slice(0, t)), !e || e === "start";
	});
}
function ws(e, t, n) {
	var r, i, a = Cs(t) ? Ho : Uo;
	return function() {
		var o = a(this, e), s = o.on;
		s !== r && (i = (r = s).copy()).on(t, n), o.on = i;
	};
}
function Ts(e, t) {
	var n = this._id;
	return arguments.length < 2 ? Wo(this.node(), n).on.on(e) : this.each(ws(n, e, t));
}
//#endregion
//#region node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/remove.js
function Es(e) {
	return function() {
		var t = this.parentNode;
		for (var n in this.__transition) if (+n !== e) return;
		t && t.removeChild(this);
	};
}
function Ds() {
	return this.on("end.remove", Es(this._id));
}
//#endregion
//#region node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/select.js
function Os(e) {
	var t = this._name, n = this._id;
	typeof e != "function" && (e = qn(e));
	for (var r = this._groups, i = r.length, a = Array(i), o = 0; o < i; ++o) for (var s = r[o], c = s.length, l = a[o] = Array(c), u, d, f = 0; f < c; ++f) (u = s[f]) && (d = e.call(u, u.__data__, f, s)) && ("__data__" in u && (d.__data__ = u.__data__), l[f] = d, Vo(l[f], t, n, f, l, Wo(u, n)));
	return new Xs(a, this._parents, t, n);
}
//#endregion
//#region node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/selectAll.js
function ks(e) {
	var t = this._name, n = this._id;
	typeof e != "function" && (e = Zn(e));
	for (var r = this._groups, i = r.length, a = [], o = [], s = 0; s < i; ++s) for (var c = r[s], l = c.length, u, d = 0; d < l; ++d) if (u = c[d]) {
		for (var f = e.call(u, u.__data__, d, c), p, m = Wo(u, n), h = 0, g = f.length; h < g; ++h) (p = f[h]) && Vo(p, t, n, h, f, m);
		a.push(f), o.push(u);
	}
	return new Xs(a, o, t, n);
}
//#endregion
//#region node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/selection.js
var As = Li.prototype.constructor;
function js() {
	return new As(this._groups, this._parents);
}
//#endregion
//#region node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/style.js
function Ms(e, t) {
	var n, r, i;
	return function() {
		var a = Wr(this, e), o = (this.style.removeProperty(e), Wr(this, e));
		return a === o ? null : a === n && o === r ? i : i = t(n = a, r = o);
	};
}
function Ns(e) {
	return function() {
		this.style.removeProperty(e);
	};
}
function Ps(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = Wr(this, e);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function Fs(e, t, n) {
	var r, i, a;
	return function() {
		var o = Wr(this, e), s = n(this), c = s + "";
		return s ?? (c = s = (this.style.removeProperty(e), Wr(this, e))), o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s));
	};
}
function Is(e, t) {
	var n, r, i, a = "style." + t, o = "end." + a, s;
	return function() {
		var c = Uo(this, e), l = c.on, u = c.value[a] == null ? s ||= Ns(t) : void 0;
		(l !== n || i !== u) && (r = (n = l).copy()).on(o, i = u), c.on = r;
	};
}
function Ls(e, t, n) {
	var r = (e += "") == "transform" ? uo : Qo;
	return t == null ? this.styleTween(e, Ms(e, r)).on("end.style." + e, Ns(e)) : typeof t == "function" ? this.styleTween(e, Fs(e, r, Zo(this, "style." + e, t))).each(Is(this._id, e)) : this.styleTween(e, Ps(e, r, t), n).on("end.style." + e, null);
}
//#endregion
//#region node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/styleTween.js
function Rs(e, t, n) {
	return function(r) {
		this.style.setProperty(e, t.call(this, r), n);
	};
}
function zs(e, t, n) {
	var r, i;
	function a() {
		var a = t.apply(this, arguments);
		return a !== i && (r = (i = a) && Rs(e, a, n)), r;
	}
	return a._value = t, a;
}
function Bs(e, t, n) {
	var r = "style." + (e += "");
	if (arguments.length < 2) return (r = this.tween(r)) && r._value;
	if (t == null) return this.tween(r, null);
	if (typeof t != "function") throw Error();
	return this.tween(r, zs(e, t, n ?? ""));
}
//#endregion
//#region node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/text.js
function Vs(e) {
	return function() {
		this.textContent = e;
	};
}
function Hs(e) {
	return function() {
		var t = e(this);
		this.textContent = t ?? "";
	};
}
function Us(e) {
	return this.tween("text", typeof e == "function" ? Hs(Zo(this, "text", e)) : Vs(e == null ? "" : e + ""));
}
//#endregion
//#region node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/textTween.js
function Ws(e) {
	return function(t) {
		this.textContent = e.call(this, t);
	};
}
function Gs(e) {
	var t, n;
	function r() {
		var r = e.apply(this, arguments);
		return r !== n && (t = (n = r) && Ws(r)), t;
	}
	return r._value = e, r;
}
function Ks(e) {
	var t = "text";
	if (arguments.length < 1) return (t = this.tween(t)) && t._value;
	if (e == null) return this.tween(t, null);
	if (typeof e != "function") throw Error();
	return this.tween(t, Gs(e));
}
//#endregion
//#region node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/transition.js
function qs() {
	for (var e = this._name, t = this._id, n = Qs(), r = this._groups, i = r.length, a = 0; a < i; ++a) for (var o = r[a], s = o.length, c, l = 0; l < s; ++l) if (c = o[l]) {
		var u = Wo(c, t);
		Vo(c, e, n, l, o, {
			time: u.time + u.delay + u.duration,
			delay: 0,
			duration: u.duration,
			ease: u.ease
		});
	}
	return new Xs(r, this._parents, e, n);
}
//#endregion
//#region node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/end.js
function Js() {
	var e, t, n = this, r = n._id, i = n.size();
	return new Promise(function(a, o) {
		var s = { value: o }, c = { value: function() {
			--i === 0 && a();
		} };
		n.each(function() {
			var n = Uo(this, r), i = n.on;
			i !== e && (t = (e = i).copy(), t._.cancel.push(s), t._.interrupt.push(s), t._.end.push(c)), n.on = t;
		}), i === 0 && a();
	});
}
//#endregion
//#region node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/index.js
var Ys = 0;
function Xs(e, t, n, r) {
	this._groups = e, this._parents = t, this._name = n, this._id = r;
}
function Zs(e) {
	return Li().transition(e);
}
function Qs() {
	return ++Ys;
}
var $s = Li.prototype;
Xs.prototype = Zs.prototype = {
	constructor: Xs,
	select: Os,
	selectAll: ks,
	selectChild: $s.selectChild,
	selectChildren: $s.selectChildren,
	filter: xs,
	merge: Ss,
	selection: js,
	transition: qs,
	call: $s.call,
	nodes: $s.nodes,
	node: $s.node,
	size: $s.size,
	empty: $s.empty,
	each: $s.each,
	on: Ts,
	attr: as,
	attrTween: us,
	style: Ls,
	styleTween: Bs,
	text: Us,
	textTween: Ks,
	remove: Ds,
	tween: Xo,
	delay: ps,
	duration: gs,
	ease: vs,
	easeVarying: bs,
	end: Js,
	[Symbol.iterator]: $s[Symbol.iterator]
};
//#endregion
//#region node_modules/.pnpm/d3-ease@3.0.1/node_modules/d3-ease/src/cubic.js
function ec(e) {
	return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
//#endregion
//#region node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/selection/transition.js
var tc = {
	time: null,
	delay: 0,
	duration: 250,
	ease: ec
};
function nc(e, t) {
	for (var n; !(n = e.__transition) || !(n = n[t]);) if (!(e = e.parentNode)) throw Error(`transition ${t} not found`);
	return n;
}
function rc(e) {
	var t, n;
	e instanceof Xs ? (t = e._id, e = e._name) : (t = Qs(), (n = tc).time = ko(), e = e == null ? null : e + "");
	for (var r = this._groups, i = r.length, a = 0; a < i; ++a) for (var o = r[a], s = o.length, c, l = 0; l < s; ++l) (c = o[l]) && Vo(c, e, t, l, o, n || nc(c, t));
	return new Xs(r, this._parents, e, t);
}
Li.prototype.interrupt = qo, Li.prototype.transition = rc;
//#endregion
//#region node_modules/.pnpm/d3-zoom@3.0.0/node_modules/d3-zoom/src/constant.js
var ic = (e) => () => e;
//#endregion
//#region node_modules/.pnpm/d3-zoom@3.0.0/node_modules/d3-zoom/src/event.js
function ac(e, { sourceEvent: t, target: n, transform: r, dispatch: i }) {
	Object.defineProperties(this, {
		type: {
			value: e,
			enumerable: !0,
			configurable: !0
		},
		sourceEvent: {
			value: t,
			enumerable: !0,
			configurable: !0
		},
		target: {
			value: n,
			enumerable: !0,
			configurable: !0
		},
		transform: {
			value: r,
			enumerable: !0,
			configurable: !0
		},
		_: { value: i }
	});
}
//#endregion
//#region node_modules/.pnpm/d3-zoom@3.0.0/node_modules/d3-zoom/src/transform.js
function oc(e, t, n) {
	this.k = e, this.x = t, this.y = n;
}
oc.prototype = {
	constructor: oc,
	scale: function(e) {
		return e === 1 ? this : new oc(this.k * e, this.x, this.y);
	},
	translate: function(e, t) {
		return e === 0 & t === 0 ? this : new oc(this.k, this.x + this.k * e, this.y + this.k * t);
	},
	apply: function(e) {
		return [e[0] * this.k + this.x, e[1] * this.k + this.y];
	},
	applyX: function(e) {
		return e * this.k + this.x;
	},
	applyY: function(e) {
		return e * this.k + this.y;
	},
	invert: function(e) {
		return [(e[0] - this.x) / this.k, (e[1] - this.y) / this.k];
	},
	invertX: function(e) {
		return (e - this.x) / this.k;
	},
	invertY: function(e) {
		return (e - this.y) / this.k;
	},
	rescaleX: function(e) {
		return e.copy().domain(e.range().map(this.invertX, this).map(e.invert, e));
	},
	rescaleY: function(e) {
		return e.copy().domain(e.range().map(this.invertY, this).map(e.invert, e));
	},
	toString: function() {
		return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
	}
};
var sc = new oc(1, 0, 0);
cc.prototype = oc.prototype;
function cc(e) {
	for (; !e.__zoom;) if (!(e = e.parentNode)) return sc;
	return e.__zoom;
}
//#endregion
//#region node_modules/.pnpm/d3-zoom@3.0.0/node_modules/d3-zoom/src/noevent.js
function lc(e) {
	e.stopImmediatePropagation();
}
function uc(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region node_modules/.pnpm/d3-zoom@3.0.0/node_modules/d3-zoom/src/zoom.js
function dc(e) {
	return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function fc() {
	var e = this;
	return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function pc() {
	return this.__zoom || sc;
}
function mc(e) {
	return -e.deltaY * (e.deltaMode === 1 ? .05 : e.deltaMode ? 1 : .002) * (e.ctrlKey ? 10 : 1);
}
function hc() {
	return navigator.maxTouchPoints || "ontouchstart" in this;
}
function gc(e, t, n) {
	var r = e.invertX(t[0][0]) - n[0][0], i = e.invertX(t[1][0]) - n[1][0], a = e.invertY(t[0][1]) - n[0][1], o = e.invertY(t[1][1]) - n[1][1];
	return e.translate(i > r ? (r + i) / 2 : Math.min(0, r) || Math.max(0, i), o > a ? (a + o) / 2 : Math.min(0, a) || Math.max(0, o));
}
function _c() {
	var e = dc, t = fc, n = gc, r = mc, i = hc, a = [0, Infinity], o = [[-Infinity, -Infinity], [Infinity, Infinity]], s = 250, c = _o, l = In("start", "zoom", "end"), u, d, f, p = 500, m = 150, h = 0, g = 10;
	function _(e) {
		e.property("__zoom", pc).on("wheel.zoom", w, { passive: !1 }).on("mousedown.zoom", T).on("dblclick.zoom", E).filter(i).on("touchstart.zoom", D).on("touchmove.zoom", O).on("touchend.zoom touchcancel.zoom", k).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	}
	_.transform = function(e, t, n, r) {
		var i = e.selection ? e.selection() : e;
		i.property("__zoom", pc), e === i ? i.interrupt().each(function() {
			S(this, arguments).event(r).start().zoom(null, typeof t == "function" ? t.apply(this, arguments) : t).end();
		}) : x(e, t, n, r);
	}, _.scaleBy = function(e, t, n, r) {
		_.scaleTo(e, function() {
			return this.__zoom.k * (typeof t == "function" ? t.apply(this, arguments) : t);
		}, n, r);
	}, _.scaleTo = function(e, r, i, a) {
		_.transform(e, function() {
			var e = t.apply(this, arguments), a = this.__zoom, s = i == null ? b(e) : typeof i == "function" ? i.apply(this, arguments) : i, c = a.invert(s), l = typeof r == "function" ? r.apply(this, arguments) : r;
			return n(y(v(a, l), s, c), e, o);
		}, i, a);
	}, _.translateBy = function(e, r, i, a) {
		_.transform(e, function() {
			return n(this.__zoom.translate(typeof r == "function" ? r.apply(this, arguments) : r, typeof i == "function" ? i.apply(this, arguments) : i), t.apply(this, arguments), o);
		}, null, a);
	}, _.translateTo = function(e, r, i, a, s) {
		_.transform(e, function() {
			var e = t.apply(this, arguments), s = this.__zoom, c = a == null ? b(e) : typeof a == "function" ? a.apply(this, arguments) : a;
			return n(sc.translate(c[0], c[1]).scale(s.k).translate(typeof r == "function" ? -r.apply(this, arguments) : -r, typeof i == "function" ? -i.apply(this, arguments) : -i), e, o);
		}, a, s);
	};
	function v(e, t) {
		return t = Math.max(a[0], Math.min(a[1], t)), t === e.k ? e : new oc(t, e.x, e.y);
	}
	function y(e, t, n) {
		var r = t[0] - n[0] * e.k, i = t[1] - n[1] * e.k;
		return r === e.x && i === e.y ? e : new oc(e.k, r, i);
	}
	function b(e) {
		return [(+e[0][0] + +e[1][0]) / 2, (+e[0][1] + +e[1][1]) / 2];
	}
	function x(e, n, r, i) {
		e.on("start.zoom", function() {
			S(this, arguments).event(i).start();
		}).on("interrupt.zoom end.zoom", function() {
			S(this, arguments).event(i).end();
		}).tween("zoom", function() {
			var e = this, a = arguments, o = S(e, a).event(i), s = t.apply(e, a), l = r == null ? b(s) : typeof r == "function" ? r.apply(e, a) : r, u = Math.max(s[1][0] - s[0][0], s[1][1] - s[0][1]), d = e.__zoom, f = typeof n == "function" ? n.apply(e, a) : n, p = c(d.invert(l).concat(u / d.k), f.invert(l).concat(u / f.k));
			return function(e) {
				if (e === 1) e = f;
				else {
					var t = p(e), n = u / t[2];
					e = new oc(n, l[0] - t[0] * n, l[1] - t[1] * n);
				}
				o.zoom(null, e);
			};
		});
	}
	function S(e, t, n) {
		return !n && e.__zooming || new C(e, t);
	}
	function C(e, n) {
		this.that = e, this.args = n, this.active = 0, this.sourceEvent = null, this.extent = t.apply(e, n), this.taps = 0;
	}
	C.prototype = {
		event: function(e) {
			return e && (this.sourceEvent = e), this;
		},
		start: function() {
			return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
		},
		zoom: function(e, t) {
			return this.mouse && e !== "mouse" && (this.mouse[1] = t.invert(this.mouse[0])), this.touch0 && e !== "touch" && (this.touch0[1] = t.invert(this.touch0[0])), this.touch1 && e !== "touch" && (this.touch1[1] = t.invert(this.touch1[0])), this.that.__zoom = t, this.emit("zoom"), this;
		},
		end: function() {
			return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
		},
		emit: function(e) {
			var t = zi(this.that).datum();
			l.call(e, this.that, new ac(e, {
				sourceEvent: this.sourceEvent,
				target: _,
				type: e,
				transform: this.that.__zoom,
				dispatch: l
			}), t);
		}
	};
	function w(t, ...i) {
		if (!e.apply(this, arguments)) return;
		var s = S(this, i).event(t), c = this.__zoom, l = Math.max(a[0], Math.min(a[1], c.k * 2 ** r.apply(this, arguments))), u = Vi(t);
		if (s.wheel) (s.mouse[0][0] !== u[0] || s.mouse[0][1] !== u[1]) && (s.mouse[1] = c.invert(s.mouse[0] = u)), clearTimeout(s.wheel);
		else if (c.k === l) return;
		else s.mouse = [u, c.invert(u)], Ko(this), s.start();
		uc(t), s.wheel = setTimeout(d, m), s.zoom("mouse", n(y(v(c, l), s.mouse[0], s.mouse[1]), s.extent, o));
		function d() {
			s.wheel = null, s.end();
		}
	}
	function T(t, ...r) {
		if (f || !e.apply(this, arguments)) return;
		var i = t.currentTarget, a = S(this, r, !0).event(t), s = zi(t.view).on("mousemove.zoom", d, !0).on("mouseup.zoom", p, !0), c = Vi(t, i), l = t.clientX, u = t.clientY;
		Ki(t.view), lc(t), a.mouse = [c, this.__zoom.invert(c)], Ko(this), a.start();
		function d(e) {
			if (uc(e), !a.moved) {
				var t = e.clientX - l, r = e.clientY - u;
				a.moved = t * t + r * r > h;
			}
			a.event(e).zoom("mouse", n(y(a.that.__zoom, a.mouse[0] = Vi(e, i), a.mouse[1]), a.extent, o));
		}
		function p(e) {
			s.on("mousemove.zoom mouseup.zoom", null), qi(e.view, a.moved), uc(e), a.event(e).end();
		}
	}
	function E(r, ...i) {
		if (e.apply(this, arguments)) {
			var a = this.__zoom, c = Vi(r.changedTouches ? r.changedTouches[0] : r, this), l = a.invert(c), u = a.k * (r.shiftKey ? .5 : 2), d = n(y(v(a, u), c, l), t.apply(this, i), o);
			uc(r), s > 0 ? zi(this).transition().duration(s).call(x, d, c, r) : zi(this).call(_.transform, d, c, r);
		}
	}
	function D(t, ...n) {
		if (e.apply(this, arguments)) {
			var r = t.touches, i = r.length, a = S(this, n, t.changedTouches.length === i).event(t), o, s, c, l;
			for (lc(t), s = 0; s < i; ++s) c = r[s], l = Vi(c, this), l = [
				l,
				this.__zoom.invert(l),
				c.identifier
			], a.touch0 ? !a.touch1 && a.touch0[2] !== l[2] && (a.touch1 = l, a.taps = 0) : (a.touch0 = l, o = !0, a.taps = 1 + !!u);
			u &&= clearTimeout(u), o && (a.taps < 2 && (d = l[0], u = setTimeout(function() {
				u = null;
			}, p)), Ko(this), a.start());
		}
	}
	function O(e, ...t) {
		if (this.__zooming) {
			var r = S(this, t).event(e), i = e.changedTouches, a = i.length, s, c, l, u;
			for (uc(e), s = 0; s < a; ++s) c = i[s], l = Vi(c, this), r.touch0 && r.touch0[2] === c.identifier ? r.touch0[0] = l : r.touch1 && r.touch1[2] === c.identifier && (r.touch1[0] = l);
			if (c = r.that.__zoom, r.touch1) {
				var d = r.touch0[0], f = r.touch0[1], p = r.touch1[0], m = r.touch1[1], h = (h = p[0] - d[0]) * h + (h = p[1] - d[1]) * h, g = (g = m[0] - f[0]) * g + (g = m[1] - f[1]) * g;
				c = v(c, Math.sqrt(h / g)), l = [(d[0] + p[0]) / 2, (d[1] + p[1]) / 2], u = [(f[0] + m[0]) / 2, (f[1] + m[1]) / 2];
			} else if (r.touch0) l = r.touch0[0], u = r.touch0[1];
			else return;
			r.zoom("touch", n(y(c, l, u), r.extent, o));
		}
	}
	function k(e, ...t) {
		if (this.__zooming) {
			var n = S(this, t).event(e), r = e.changedTouches, i = r.length, a, o;
			for (lc(e), f && clearTimeout(f), f = setTimeout(function() {
				f = null;
			}, p), a = 0; a < i; ++a) o = r[a], n.touch0 && n.touch0[2] === o.identifier ? delete n.touch0 : n.touch1 && n.touch1[2] === o.identifier && delete n.touch1;
			if (n.touch1 && !n.touch0 && (n.touch0 = n.touch1, delete n.touch1), n.touch0) n.touch0[1] = this.__zoom.invert(n.touch0[0]);
			else if (n.end(), n.taps === 2 && (o = Vi(o, this), Math.hypot(d[0] - o[0], d[1] - o[1]) < g)) {
				var s = zi(this).on("dblclick.zoom");
				s && s.apply(this, arguments);
			}
		}
	}
	return _.wheelDelta = function(e) {
		return arguments.length ? (r = typeof e == "function" ? e : ic(+e), _) : r;
	}, _.filter = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : ic(!!t), _) : e;
	}, _.touchable = function(e) {
		return arguments.length ? (i = typeof e == "function" ? e : ic(!!e), _) : i;
	}, _.extent = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : ic([[+e[0][0], +e[0][1]], [+e[1][0], +e[1][1]]]), _) : t;
	}, _.scaleExtent = function(e) {
		return arguments.length ? (a[0] = +e[0], a[1] = +e[1], _) : [a[0], a[1]];
	}, _.translateExtent = function(e) {
		return arguments.length ? (o[0][0] = +e[0][0], o[1][0] = +e[1][0], o[0][1] = +e[0][1], o[1][1] = +e[1][1], _) : [[o[0][0], o[0][1]], [o[1][0], o[1][1]]];
	}, _.constrain = function(e) {
		return arguments.length ? (n = e, _) : n;
	}, _.duration = function(e) {
		return arguments.length ? (s = +e, _) : s;
	}, _.interpolate = function(e) {
		return arguments.length ? (c = e, _) : c;
	}, _.on = function() {
		var e = l.on.apply(l, arguments);
		return e === l ? _ : e;
	}, _.clickDistance = function(e) {
		return arguments.length ? (h = (e = +e) * e, _) : Math.sqrt(h);
	}, _.tapDistance = function(e) {
		return arguments.length ? (g = +e, _) : g;
	}, _;
}
//#endregion
//#region node_modules/.pnpm/@xyflow+system@0.0.76/node_modules/@xyflow/system/dist/esm/index.js
var vc = {
	error001: () => "[React Flow]: Seems like you have not used zustand provider as an ancestor. Help: https://reactflow.dev/error#001",
	error002: () => "It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them.",
	error003: (e) => `Node type "${e}" not found. Using fallback type "default".`,
	error004: () => "The React Flow parent container needs a width and a height to render the graph.",
	error005: () => "Only child nodes can use a parent extent.",
	error006: () => "Can't create edge. An edge needs a source and a target.",
	error007: (e) => `The old edge with id=${e} does not exist.`,
	error009: (e) => `Marker type "${e}" doesn't exist.`,
	error008: (e, { id: t, sourceHandle: n, targetHandle: r }) => `Couldn't create edge for ${e} handle id: "${e === "source" ? n : r}", edge id: ${t}.`,
	error010: () => "Handle: No node id found. Make sure to only use a Handle inside a custom Node.",
	error011: (e) => `Edge type "${e}" not found. Using fallback type "default".`,
	error012: (e) => `Node with id "${e}" does not exist, it may have been removed. This can happen when a node is deleted before the "onNodeClick" handler is called.`,
	error013: (e = "react") => `It seems that you haven't loaded the styles. Please import '@xyflow/${e}/dist/style.css' or base.css to make sure everything is working properly.`,
	error014: () => "useNodeConnections: No node ID found. Call useNodeConnections inside a custom Node or provide a node ID.",
	error015: () => "It seems that you are trying to drag a node that is not initialized. Please use onNodesChange as explained in the docs."
}, yc = [[-Infinity, -Infinity], [Infinity, Infinity]], bc = [
	"Enter",
	" ",
	"Escape"
], xc = {
	"node.a11yDescription.default": "Press enter or space to select a node. Press delete to remove it and escape to cancel.",
	"node.a11yDescription.keyboardDisabled": "Press enter or space to select a node. You can then use the arrow keys to move the node around. Press delete to remove it and escape to cancel.",
	"node.a11yDescription.ariaLiveMessage": ({ direction: e, x: t, y: n }) => `Moved selected node ${e}. New position, x: ${t}, y: ${n}`,
	"edge.a11yDescription.default": "Press enter or space to select an edge. You can then press delete to remove it or escape to cancel.",
	"controls.ariaLabel": "Control Panel",
	"controls.zoomIn.ariaLabel": "Zoom In",
	"controls.zoomOut.ariaLabel": "Zoom Out",
	"controls.fitView.ariaLabel": "Fit View",
	"controls.interactive.ariaLabel": "Toggle Interactivity",
	"minimap.ariaLabel": "Mini Map",
	"handle.ariaLabel": "Handle"
}, Sc;
(function(e) {
	e.Strict = "strict", e.Loose = "loose";
})(Sc ||= {});
var Cc;
(function(e) {
	e.Free = "free", e.Vertical = "vertical", e.Horizontal = "horizontal";
})(Cc ||= {});
var wc;
(function(e) {
	e.Partial = "partial", e.Full = "full";
})(wc ||= {});
var Tc = {
	inProgress: !1,
	isValid: null,
	from: null,
	fromHandle: null,
	fromPosition: null,
	fromNode: null,
	to: null,
	toHandle: null,
	toPosition: null,
	toNode: null,
	pointer: null
}, Ec;
(function(e) {
	e.Bezier = "default", e.Straight = "straight", e.Step = "step", e.SmoothStep = "smoothstep", e.SimpleBezier = "simplebezier";
})(Ec ||= {});
var Dc;
(function(e) {
	e.Arrow = "arrow", e.ArrowClosed = "arrowclosed";
})(Dc ||= {});
var Y;
(function(e) {
	e.Left = "left", e.Top = "top", e.Right = "right", e.Bottom = "bottom";
})(Y ||= {});
var Oc = {
	[Y.Left]: Y.Right,
	[Y.Right]: Y.Left,
	[Y.Top]: Y.Bottom,
	[Y.Bottom]: Y.Top
};
function kc(e) {
	return e === null ? null : e ? "valid" : "invalid";
}
var Ac = (e) => "id" in e && "source" in e && "target" in e, jc = (e) => "id" in e && "position" in e && !("source" in e) && !("target" in e), Mc = (e) => "id" in e && "internals" in e && !("source" in e) && !("target" in e), Nc = (e, t = [0, 0]) => {
	let { width: n, height: r } = fl(e), i = e.origin ?? t, a = n * i[0], o = r * i[1];
	return {
		x: e.position.x - a,
		y: e.position.y - o
	};
}, Pc = (e, t = { nodeOrigin: [0, 0] }) => e.length === 0 ? {
	x: 0,
	y: 0,
	width: 0,
	height: 0
} : Yc(e.reduce((e, n) => {
	let r = typeof n == "string", i = !t.nodeLookup && !r ? n : void 0;
	return t.nodeLookup && (i = r ? t.nodeLookup.get(n) : Mc(n) ? n : t.nodeLookup.get(n.id)), qc(e, i ? Zc(i, t.nodeOrigin) : {
		x: 0,
		y: 0,
		x2: 0,
		y2: 0
	});
}, {
	x: Infinity,
	y: Infinity,
	x2: -Infinity,
	y2: -Infinity
})), Fc = (e, t = {}) => {
	let n = {
		x: Infinity,
		y: Infinity,
		x2: -Infinity,
		y2: -Infinity
	}, r = !1;
	return e.forEach((e) => {
		(t.filter === void 0 || t.filter(e)) && (n = qc(n, Zc(e)), r = !0);
	}), r ? Yc(n) : {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	};
}, Ic = (e, t, [n, r, i] = [
	0,
	0,
	1
], a = !1, o = !1) => {
	let s = {
		...il(t, [
			n,
			r,
			i
		]),
		width: t.width / i,
		height: t.height / i
	}, c = [];
	for (let t of e.values()) {
		let { measured: e, selectable: n = !0, hidden: r = !1 } = t;
		if (o && !n || r) continue;
		let i = e.width ?? t.width ?? t.initialWidth ?? null, l = e.height ?? t.height ?? t.initialHeight ?? null, u = $c(s, Xc(t)), d = (i ?? 0) * (l ?? 0), f = a && u > 0;
		(!t.internals.handleBounds || f || u >= d || t.dragging) && c.push(t);
	}
	return c;
}, Lc = (e, t) => {
	let n = /* @__PURE__ */ new Set();
	return e.forEach((e) => {
		n.add(e.id);
	}), t.filter((e) => n.has(e.source) || n.has(e.target));
};
function Rc(e, t) {
	let n = /* @__PURE__ */ new Map(), r = t?.nodes ? new Set(t.nodes.map((e) => e.id)) : null;
	return e.forEach((e) => {
		e.measured.width && e.measured.height && (t?.includeHiddenNodes || !e.hidden) && (!r || r.has(e.id)) && n.set(e.id, e);
	}), n;
}
async function zc({ nodes: e, width: t, height: n, panZoom: r, minZoom: i, maxZoom: a }, o) {
	if (e.size === 0) return Promise.resolve(!0);
	let s = ll(Fc(Rc(e, o)), t, n, o?.minZoom ?? i, o?.maxZoom ?? a, o?.padding ?? .1);
	return await r.setViewport(s, {
		duration: o?.duration,
		ease: o?.ease,
		interpolate: o?.interpolate
	}), Promise.resolve(!0);
}
function Bc({ nodeId: e, nextPosition: t, nodeLookup: n, nodeOrigin: r = [0, 0], nodeExtent: i, onError: a }) {
	let o = n.get(e), s = o.parentId ? n.get(o.parentId) : void 0, { x: c, y: l } = s ? s.internals.positionAbsolute : {
		x: 0,
		y: 0
	}, u = o.origin ?? r, d = o.extent || i;
	if (o.extent === "parent" && !o.expandParent) if (!s) a?.("005", vc.error005());
	else {
		let e = s.measured.width, t = s.measured.height;
		e && t && (d = [[c, l], [c + e, l + t]]);
	}
	else s && dl(o.extent) && (d = [[o.extent[0][0] + c, o.extent[0][1] + l], [o.extent[1][0] + c, o.extent[1][1] + l]]);
	let f = dl(d) ? Uc(t, d, o.measured) : t;
	return (o.measured.width === void 0 || o.measured.height === void 0) && a?.("015", vc.error015()), {
		position: {
			x: f.x - c + (o.measured.width ?? 0) * u[0],
			y: f.y - l + (o.measured.height ?? 0) * u[1]
		},
		positionAbsolute: f
	};
}
async function Vc({ nodesToRemove: e = [], edgesToRemove: t = [], nodes: n, edges: r, onBeforeDelete: i }) {
	let a = new Set(e.map((e) => e.id)), o = [];
	for (let e of n) {
		if (e.deletable === !1) continue;
		let t = a.has(e.id), n = !t && e.parentId && o.find((t) => t.id === e.parentId);
		(t || n) && o.push(e);
	}
	let s = new Set(t.map((e) => e.id)), c = r.filter((e) => e.deletable !== !1), l = Lc(o, c);
	for (let e of c) s.has(e.id) && !l.find((t) => t.id === e.id) && l.push(e);
	if (!i) return {
		edges: l,
		nodes: o
	};
	let u = await i({
		nodes: o,
		edges: l
	});
	return typeof u == "boolean" ? u ? {
		edges: l,
		nodes: o
	} : {
		edges: [],
		nodes: []
	} : u;
}
var Hc = (e, t = 0, n = 1) => Math.min(Math.max(e, t), n), Uc = (e = {
	x: 0,
	y: 0
}, t, n) => ({
	x: Hc(e.x, t[0][0], t[1][0] - (n?.width ?? 0)),
	y: Hc(e.y, t[0][1], t[1][1] - (n?.height ?? 0))
});
function Wc(e, t, n) {
	let { width: r, height: i } = fl(n), { x: a, y: o } = n.internals.positionAbsolute;
	return Uc(e, [[a, o], [a + r, o + i]], t);
}
var Gc = (e, t, n) => e < t ? Hc(Math.abs(e - t), 1, t) / t : e > n ? -Hc(Math.abs(e - n), 1, t) / t : 0, Kc = (e, t, n = 15, r = 40) => [Gc(e.x, r, t.width - r) * n, Gc(e.y, r, t.height - r) * n], qc = (e, t) => ({
	x: Math.min(e.x, t.x),
	y: Math.min(e.y, t.y),
	x2: Math.max(e.x2, t.x2),
	y2: Math.max(e.y2, t.y2)
}), Jc = ({ x: e, y: t, width: n, height: r }) => ({
	x: e,
	y: t,
	x2: e + n,
	y2: t + r
}), Yc = ({ x: e, y: t, x2: n, y2: r }) => ({
	x: e,
	y: t,
	width: n - e,
	height: r - t
}), Xc = (e, t = [0, 0]) => {
	let { x: n, y: r } = Mc(e) ? e.internals.positionAbsolute : Nc(e, t);
	return {
		x: n,
		y: r,
		width: e.measured?.width ?? e.width ?? e.initialWidth ?? 0,
		height: e.measured?.height ?? e.height ?? e.initialHeight ?? 0
	};
}, Zc = (e, t = [0, 0]) => {
	let { x: n, y: r } = Mc(e) ? e.internals.positionAbsolute : Nc(e, t);
	return {
		x: n,
		y: r,
		x2: n + (e.measured?.width ?? e.width ?? e.initialWidth ?? 0),
		y2: r + (e.measured?.height ?? e.height ?? e.initialHeight ?? 0)
	};
}, Qc = (e, t) => Yc(qc(Jc(e), Jc(t))), $c = (e, t) => {
	let n = Math.max(0, Math.min(e.x + e.width, t.x + t.width) - Math.max(e.x, t.x)), r = Math.max(0, Math.min(e.y + e.height, t.y + t.height) - Math.max(e.y, t.y));
	return Math.ceil(n * r);
}, el = (e) => tl(e.width) && tl(e.height) && tl(e.x) && tl(e.y), tl = (e) => !isNaN(e) && isFinite(e), nl = (e, t) => {}, rl = (e, t = [1, 1]) => ({
	x: t[0] * Math.round(e.x / t[0]),
	y: t[1] * Math.round(e.y / t[1])
}), il = ({ x: e, y: t }, [n, r, i], a = !1, o = [1, 1]) => {
	let s = {
		x: (e - n) / i,
		y: (t - r) / i
	};
	return a ? rl(s, o) : s;
}, al = ({ x: e, y: t }, [n, r, i]) => ({
	x: e * i + n,
	y: t * i + r
});
function ol(e, t) {
	if (typeof e == "number") return Math.floor((t - t / (1 + e)) * .5);
	if (typeof e == "string" && e.endsWith("px")) {
		let t = parseFloat(e);
		if (!Number.isNaN(t)) return Math.floor(t);
	}
	if (typeof e == "string" && e.endsWith("%")) {
		let n = parseFloat(e);
		if (!Number.isNaN(n)) return Math.floor(t * n * .01);
	}
	return console.error(`[React Flow] The padding value "${e}" is invalid. Please provide a number or a string with a valid unit (px or %).`), 0;
}
function sl(e, t, n) {
	if (typeof e == "string" || typeof e == "number") {
		let r = ol(e, n), i = ol(e, t);
		return {
			top: r,
			right: i,
			bottom: r,
			left: i,
			x: i * 2,
			y: r * 2
		};
	}
	if (typeof e == "object") {
		let r = ol(e.top ?? e.y ?? 0, n), i = ol(e.bottom ?? e.y ?? 0, n), a = ol(e.left ?? e.x ?? 0, t), o = ol(e.right ?? e.x ?? 0, t);
		return {
			top: r,
			right: o,
			bottom: i,
			left: a,
			x: a + o,
			y: r + i
		};
	}
	return {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		x: 0,
		y: 0
	};
}
function cl(e, t, n, r, i, a) {
	let { x: o, y: s } = al(e, [
		t,
		n,
		r
	]), { x: c, y: l } = al({
		x: e.x + e.width,
		y: e.y + e.height
	}, [
		t,
		n,
		r
	]), u = i - c, d = a - l;
	return {
		left: Math.floor(o),
		top: Math.floor(s),
		right: Math.floor(u),
		bottom: Math.floor(d)
	};
}
var ll = (e, t, n, r, i, a) => {
	let o = sl(a, t, n), s = (t - o.x) / e.width, c = (n - o.y) / e.height, l = Hc(Math.min(s, c), r, i), u = e.x + e.width / 2, d = e.y + e.height / 2, f = t / 2 - u * l, p = n / 2 - d * l, m = cl(e, f, p, l, t, n), h = {
		left: Math.min(m.left - o.left, 0),
		top: Math.min(m.top - o.top, 0),
		right: Math.min(m.right - o.right, 0),
		bottom: Math.min(m.bottom - o.bottom, 0)
	};
	return {
		x: f - h.left + h.right,
		y: p - h.top + h.bottom,
		zoom: l
	};
}, ul = () => typeof navigator < "u" && navigator?.userAgent?.indexOf("Mac") >= 0;
function dl(e) {
	return e != null && e !== "parent";
}
function fl(e) {
	return {
		width: e.measured?.width ?? e.width ?? e.initialWidth ?? 0,
		height: e.measured?.height ?? e.height ?? e.initialHeight ?? 0
	};
}
function pl(e) {
	return (e.measured?.width ?? e.width ?? e.initialWidth) !== void 0 && (e.measured?.height ?? e.height ?? e.initialHeight) !== void 0;
}
function ml(e, t = {
	width: 0,
	height: 0
}, n, r, i) {
	let a = { ...e }, o = r.get(n);
	if (o) {
		let e = o.origin || i;
		a.x += o.internals.positionAbsolute.x - (t.width ?? 0) * e[0], a.y += o.internals.positionAbsolute.y - (t.height ?? 0) * e[1];
	}
	return a;
}
function hl(e, t) {
	if (e.size !== t.size) return !1;
	for (let n of e) if (!t.has(n)) return !1;
	return !0;
}
function gl() {
	let e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
function _l(e) {
	return {
		...xc,
		...e || {}
	};
}
function vl(e, { snapGrid: t = [0, 0], snapToGrid: n = !1, transform: r, containerBounds: i }) {
	let { x: a, y: o } = wl(e), s = il({
		x: a - (i?.left ?? 0),
		y: o - (i?.top ?? 0)
	}, r), { x: c, y: l } = n ? rl(s, t) : s;
	return {
		xSnapped: c,
		ySnapped: l,
		...s
	};
}
var yl = (e) => ({
	width: e.offsetWidth,
	height: e.offsetHeight
}), bl = (e) => e?.getRootNode?.() || window?.document, xl = [
	"INPUT",
	"SELECT",
	"TEXTAREA"
];
function Sl(e) {
	let t = e.composedPath?.()?.[0] || e.target;
	return t?.nodeType === 1 ? xl.includes(t.nodeName) || t.hasAttribute("contenteditable") || !!t.closest(".nokey") : !1;
}
var Cl = (e) => "clientX" in e, wl = (e, t) => {
	let n = Cl(e), r = n ? e.clientX : e.touches?.[0].clientX, i = n ? e.clientY : e.touches?.[0].clientY;
	return {
		x: r - (t?.left ?? 0),
		y: i - (t?.top ?? 0)
	};
}, Tl = (e, t, n, r, i) => {
	let a = t.querySelectorAll(`.${e}`);
	return !a || !a.length ? null : Array.from(a).map((t) => {
		let a = t.getBoundingClientRect();
		return {
			id: t.getAttribute("data-handleid"),
			type: e,
			nodeId: i,
			position: t.getAttribute("data-handlepos"),
			x: (a.left - n.left) / r,
			y: (a.top - n.top) / r,
			...yl(t)
		};
	});
};
function El({ sourceX: e, sourceY: t, targetX: n, targetY: r, sourceControlX: i, sourceControlY: a, targetControlX: o, targetControlY: s }) {
	let c = e * .125 + i * .375 + o * .375 + n * .125, l = t * .125 + a * .375 + s * .375 + r * .125;
	return [
		c,
		l,
		Math.abs(c - e),
		Math.abs(l - t)
	];
}
function Dl(e, t) {
	return e >= 0 ? .5 * e : t * 25 * Math.sqrt(-e);
}
function Ol({ pos: e, x1: t, y1: n, x2: r, y2: i, c: a }) {
	switch (e) {
		case Y.Left: return [t - Dl(t - r, a), n];
		case Y.Right: return [t + Dl(r - t, a), n];
		case Y.Top: return [t, n - Dl(n - i, a)];
		case Y.Bottom: return [t, n + Dl(i - n, a)];
	}
}
function kl({ sourceX: e, sourceY: t, sourcePosition: n = Y.Bottom, targetX: r, targetY: i, targetPosition: a = Y.Top, curvature: o = .25 }) {
	let [s, c] = Ol({
		pos: n,
		x1: e,
		y1: t,
		x2: r,
		y2: i,
		c: o
	}), [l, u] = Ol({
		pos: a,
		x1: r,
		y1: i,
		x2: e,
		y2: t,
		c: o
	}), [d, f, p, m] = El({
		sourceX: e,
		sourceY: t,
		targetX: r,
		targetY: i,
		sourceControlX: s,
		sourceControlY: c,
		targetControlX: l,
		targetControlY: u
	});
	return [
		`M${e},${t} C${s},${c} ${l},${u} ${r},${i}`,
		d,
		f,
		p,
		m
	];
}
function Al({ sourceX: e, sourceY: t, targetX: n, targetY: r }) {
	let i = Math.abs(n - e) / 2, a = n < e ? n + i : n - i, o = Math.abs(r - t) / 2;
	return [
		a,
		r < t ? r + o : r - o,
		i,
		o
	];
}
function jl({ sourceNode: e, targetNode: t, selected: n = !1, zIndex: r = 0, elevateOnSelect: i = !1, zIndexMode: a = "basic" }) {
	return a === "manual" ? r : (i && n ? r + 1e3 : r) + Math.max(e.parentId || i && e.selected ? e.internals.z : 0, t.parentId || i && t.selected ? t.internals.z : 0);
}
function Ml({ sourceNode: e, targetNode: t, width: n, height: r, transform: i }) {
	let a = qc(Zc(e), Zc(t));
	return a.x === a.x2 && (a.x2 += 1), a.y === a.y2 && (a.y2 += 1), $c({
		x: -i[0] / i[2],
		y: -i[1] / i[2],
		width: n / i[2],
		height: r / i[2]
	}, Yc(a)) > 0;
}
var Nl = ({ source: e, sourceHandle: t, target: n, targetHandle: r }) => `xy-edge__${e}${t || ""}-${n}${r || ""}`, Pl = (e, t) => t.some((t) => t.source === e.source && t.target === e.target && (t.sourceHandle === e.sourceHandle || !t.sourceHandle && !e.sourceHandle) && (t.targetHandle === e.targetHandle || !t.targetHandle && !e.targetHandle)), Fl = (e, t, n = {}) => {
	if (!e.source || !e.target) return vc.error006(), t;
	let r = n.getEdgeId || Nl, i;
	return i = Ac(e) ? { ...e } : {
		...e,
		id: r(e)
	}, Pl(i, t) ? t : (i.sourceHandle === null && delete i.sourceHandle, i.targetHandle === null && delete i.targetHandle, t.concat(i));
};
function Il({ sourceX: e, sourceY: t, targetX: n, targetY: r }) {
	let [i, a, o, s] = Al({
		sourceX: e,
		sourceY: t,
		targetX: n,
		targetY: r
	});
	return [
		`M ${e},${t}L ${n},${r}`,
		i,
		a,
		o,
		s
	];
}
var X = {
	[Y.Left]: {
		x: -1,
		y: 0
	},
	[Y.Right]: {
		x: 1,
		y: 0
	},
	[Y.Top]: {
		x: 0,
		y: -1
	},
	[Y.Bottom]: {
		x: 0,
		y: 1
	}
}, Z = ({ source: e, sourcePosition: t = Y.Bottom, target: n }) => t === Y.Left || t === Y.Right ? e.x < n.x ? {
	x: 1,
	y: 0
} : {
	x: -1,
	y: 0
} : e.y < n.y ? {
	x: 0,
	y: 1
} : {
	x: 0,
	y: -1
}, Ll = (e, t) => Math.sqrt((t.x - e.x) ** 2 + (t.y - e.y) ** 2);
function Rl({ source: e, sourcePosition: t = Y.Bottom, target: n, targetPosition: r = Y.Top, center: i, offset: a, stepPosition: o }) {
	let s = X[t], c = X[r], l = {
		x: e.x + s.x * a,
		y: e.y + s.y * a
	}, u = {
		x: n.x + c.x * a,
		y: n.y + c.y * a
	}, d = Z({
		source: l,
		sourcePosition: t,
		target: u
	}), f = d.x === 0 ? "y" : "x", p = d[f], m = [], h, g, _ = {
		x: 0,
		y: 0
	}, v = {
		x: 0,
		y: 0
	}, [, , y, b] = Al({
		sourceX: e.x,
		sourceY: e.y,
		targetX: n.x,
		targetY: n.y
	});
	if (s[f] * c[f] === -1) {
		f === "x" ? (h = i.x ?? l.x + (u.x - l.x) * o, g = i.y ?? (l.y + u.y) / 2) : (h = i.x ?? (l.x + u.x) / 2, g = i.y ?? l.y + (u.y - l.y) * o);
		let e = [{
			x: h,
			y: l.y
		}, {
			x: h,
			y: u.y
		}], t = [{
			x: l.x,
			y: g
		}, {
			x: u.x,
			y: g
		}];
		m = s[f] === p ? f === "x" ? e : t : f === "x" ? t : e;
	} else {
		let i = [{
			x: l.x,
			y: u.y
		}], o = [{
			x: u.x,
			y: l.y
		}];
		if (m = f === "x" ? s.x === p ? o : i : s.y === p ? i : o, t === r) {
			let t = Math.abs(e[f] - n[f]);
			if (t <= a) {
				let r = Math.min(a - 1, a - t);
				s[f] === p ? _[f] = (l[f] > e[f] ? -1 : 1) * r : v[f] = (u[f] > n[f] ? -1 : 1) * r;
			}
		}
		if (t !== r) {
			let e = f === "x" ? "y" : "x", t = s[f] === c[e], n = l[e] > u[e], r = l[e] < u[e];
			(s[f] === 1 && (!t && n || t && r) || s[f] !== 1 && (!t && r || t && n)) && (m = f === "x" ? i : o);
		}
		let d = {
			x: l.x + _.x,
			y: l.y + _.y
		}, y = {
			x: u.x + v.x,
			y: u.y + v.y
		};
		Math.max(Math.abs(d.x - m[0].x), Math.abs(y.x - m[0].x)) >= Math.max(Math.abs(d.y - m[0].y), Math.abs(y.y - m[0].y)) ? (h = (d.x + y.x) / 2, g = m[0].y) : (h = m[0].x, g = (d.y + y.y) / 2);
	}
	let x = {
		x: l.x + _.x,
		y: l.y + _.y
	}, S = {
		x: u.x + v.x,
		y: u.y + v.y
	};
	return [
		[
			e,
			...x.x !== m[0].x || x.y !== m[0].y ? [x] : [],
			...m,
			...S.x !== m[m.length - 1].x || S.y !== m[m.length - 1].y ? [S] : [],
			n
		],
		h,
		g,
		y,
		b
	];
}
function zl(e, t, n, r) {
	let i = Math.min(Ll(e, t) / 2, Ll(t, n) / 2, r), { x: a, y: o } = t;
	if (e.x === a && a === n.x || e.y === o && o === n.y) return `L${a} ${o}`;
	if (e.y === o) {
		let t = e.x < n.x ? -1 : 1, r = e.y < n.y ? 1 : -1;
		return `L ${a + i * t},${o}Q ${a},${o} ${a},${o + i * r}`;
	}
	let s = e.x < n.x ? 1 : -1;
	return `L ${a},${o + i * (e.y < n.y ? -1 : 1)}Q ${a},${o} ${a + i * s},${o}`;
}
function Bl({ sourceX: e, sourceY: t, sourcePosition: n = Y.Bottom, targetX: r, targetY: i, targetPosition: a = Y.Top, borderRadius: o = 5, centerX: s, centerY: c, offset: l = 20, stepPosition: u = .5 }) {
	let [d, f, p, m, h] = Rl({
		source: {
			x: e,
			y: t
		},
		sourcePosition: n,
		target: {
			x: r,
			y: i
		},
		targetPosition: a,
		center: {
			x: s,
			y: c
		},
		offset: l,
		stepPosition: u
	}), g = `M${d[0].x} ${d[0].y}`;
	for (let e = 1; e < d.length - 1; e++) g += zl(d[e - 1], d[e], d[e + 1], o);
	return g += `L${d[d.length - 1].x} ${d[d.length - 1].y}`, [
		g,
		f,
		p,
		m,
		h
	];
}
function Vl(e) {
	return e && !!(e.internals.handleBounds || e.handles?.length) && !!(e.measured.width || e.width || e.initialWidth);
}
function Hl(e) {
	let { sourceNode: t, targetNode: n } = e;
	if (!Vl(t) || !Vl(n)) return null;
	let r = t.internals.handleBounds || Ul(t.handles), i = n.internals.handleBounds || Ul(n.handles), a = Gl(r?.source ?? [], e.sourceHandle), o = Gl(e.connectionMode === Sc.Strict ? i?.target ?? [] : (i?.target ?? []).concat(i?.source ?? []), e.targetHandle);
	if (!a || !o) return e.onError?.("008", vc.error008(a ? "target" : "source", {
		id: e.id,
		sourceHandle: e.sourceHandle,
		targetHandle: e.targetHandle
	})), null;
	let s = a?.position || Y.Bottom, c = o?.position || Y.Top, l = Wl(t, a, s), u = Wl(n, o, c);
	return {
		sourceX: l.x,
		sourceY: l.y,
		targetX: u.x,
		targetY: u.y,
		sourcePosition: s,
		targetPosition: c
	};
}
function Ul(e) {
	if (!e) return null;
	let t = [], n = [];
	for (let r of e) r.width = r.width ?? 1, r.height = r.height ?? 1, r.type === "source" ? t.push(r) : r.type === "target" && n.push(r);
	return {
		source: t,
		target: n
	};
}
function Wl(e, t, n = Y.Left, r = !1) {
	let i = (t?.x ?? 0) + e.internals.positionAbsolute.x, a = (t?.y ?? 0) + e.internals.positionAbsolute.y, { width: o, height: s } = t ?? fl(e);
	if (r) return {
		x: i + o / 2,
		y: a + s / 2
	};
	switch (t?.position ?? n) {
		case Y.Top: return {
			x: i + o / 2,
			y: a
		};
		case Y.Right: return {
			x: i + o,
			y: a + s / 2
		};
		case Y.Bottom: return {
			x: i + o / 2,
			y: a + s
		};
		case Y.Left: return {
			x: i,
			y: a + s / 2
		};
	}
}
function Gl(e, t) {
	return e && (t ? e.find((e) => e.id === t) : e[0]) || null;
}
function Kl(e, t) {
	return e ? typeof e == "string" ? e : `${t ? `${t}__` : ""}${Object.keys(e).sort().map((t) => `${t}=${e[t]}`).join("&")}` : "";
}
function ql(e, { id: t, defaultColor: n, defaultMarkerStart: r, defaultMarkerEnd: i }) {
	let a = /* @__PURE__ */ new Set();
	return e.reduce((e, o) => ([o.markerStart || r, o.markerEnd || i].forEach((r) => {
		if (r && typeof r == "object") {
			let i = Kl(r, t);
			a.has(i) || (e.push({
				id: i,
				color: r.color || n,
				...r
			}), a.add(i));
		}
	}), e), []).sort((e, t) => e.id.localeCompare(t.id));
}
var Jl = 1e3, Yl = 10, Xl = {
	nodeOrigin: [0, 0],
	nodeExtent: yc,
	elevateNodesOnSelect: !0,
	zIndexMode: "basic",
	defaults: {}
}, Zl = {
	...Xl,
	checkEquality: !0
};
function Ql(e, t) {
	let n = { ...e };
	for (let e in t) t[e] !== void 0 && (n[e] = t[e]);
	return n;
}
function $l(e, t, n) {
	let r = Ql(Xl, n);
	for (let n of e.values()) if (n.parentId) iu(n, e, t, r);
	else {
		let e = Uc(Nc(n, r.nodeOrigin), dl(n.extent) ? n.extent : r.nodeExtent, fl(n));
		n.internals.positionAbsolute = e;
	}
}
function eu(e, t) {
	if (!e.handles) return e.measured ? t?.internals.handleBounds : void 0;
	let n = [], r = [];
	for (let t of e.handles) {
		let i = {
			id: t.id,
			width: t.width ?? 1,
			height: t.height ?? 1,
			nodeId: e.id,
			x: t.x,
			y: t.y,
			position: t.position,
			type: t.type
		};
		t.type === "source" ? n.push(i) : t.type === "target" && r.push(i);
	}
	return {
		source: n,
		target: r
	};
}
function tu(e) {
	return e === "manual";
}
function nu(e, t, n, r = {}) {
	let i = Ql(Zl, r), a = { i: 0 }, o = new Map(t), s = i?.elevateNodesOnSelect && !tu(i.zIndexMode) ? Jl : 0, c = e.length > 0, l = !1;
	t.clear(), n.clear();
	for (let u of e) {
		let e = o.get(u.id);
		if (i.checkEquality && u === e?.internals.userNode) t.set(u.id, e);
		else {
			let n = Uc(Nc(u, i.nodeOrigin), dl(u.extent) ? u.extent : i.nodeExtent, fl(u));
			e = {
				...i.defaults,
				...u,
				measured: {
					width: u.measured?.width,
					height: u.measured?.height
				},
				internals: {
					positionAbsolute: n,
					handleBounds: eu(u, e),
					z: au(u, s, i.zIndexMode),
					userNode: u
				}
			}, t.set(u.id, e);
		}
		(e.measured === void 0 || e.measured.width === void 0 || e.measured.height === void 0) && !e.hidden && (c = !1), u.parentId && iu(e, t, n, r, a), l ||= u.selected ?? !1;
	}
	return {
		nodesInitialized: c,
		hasSelectedNodes: l
	};
}
function ru(e, t) {
	if (!e.parentId) return;
	let n = t.get(e.parentId);
	n ? n.set(e.id, e) : t.set(e.parentId, new Map([[e.id, e]]));
}
function iu(e, t, n, r, i) {
	let { elevateNodesOnSelect: a, nodeOrigin: o, nodeExtent: s, zIndexMode: c } = Ql(Xl, r), l = e.parentId, u = t.get(l);
	if (!u) {
		console.warn(`Parent node ${l} not found. Please make sure that parent nodes are in front of their child nodes in the nodes array.`);
		return;
	}
	ru(e, n), i && !u.parentId && u.internals.rootParentIndex === void 0 && c === "auto" && (u.internals.rootParentIndex = ++i.i, u.internals.z = u.internals.z + i.i * Yl), i && u.internals.rootParentIndex !== void 0 && (i.i = u.internals.rootParentIndex);
	let { x: d, y: f, z: p } = ou(e, u, o, s, a && !tu(c) ? Jl : 0, c), { positionAbsolute: m } = e.internals, h = d !== m.x || f !== m.y;
	(h || p !== e.internals.z) && t.set(e.id, {
		...e,
		internals: {
			...e.internals,
			positionAbsolute: h ? {
				x: d,
				y: f
			} : m,
			z: p
		}
	});
}
function au(e, t, n) {
	let r = tl(e.zIndex) ? e.zIndex : 0;
	return tu(n) ? r : r + (e.selected ? t : 0);
}
function ou(e, t, n, r, i, a) {
	let { x: o, y: s } = t.internals.positionAbsolute, c = fl(e), l = Nc(e, n), u = dl(e.extent) ? Uc(l, e.extent, c) : l, d = Uc({
		x: o + u.x,
		y: s + u.y
	}, r, c);
	e.extent === "parent" && (d = Wc(d, c, t));
	let f = au(e, i, a), p = t.internals.z ?? 0;
	return {
		x: d.x,
		y: d.y,
		z: p >= f ? p + 1 : f
	};
}
function su(e, t, n, r = [0, 0]) {
	let i = [], a = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = t.get(n.parentId);
		if (!e) continue;
		let r = Qc(a.get(n.parentId)?.expandedRect ?? Xc(e), n.rect);
		a.set(n.parentId, {
			expandedRect: r,
			parent: e
		});
	}
	return a.size > 0 && a.forEach(({ expandedRect: t, parent: a }, o) => {
		let s = a.internals.positionAbsolute, c = fl(a), l = a.origin ?? r, u = t.x < s.x ? Math.round(Math.abs(s.x - t.x)) : 0, d = t.y < s.y ? Math.round(Math.abs(s.y - t.y)) : 0, f = Math.max(c.width, Math.round(t.width)), p = Math.max(c.height, Math.round(t.height)), m = (f - c.width) * l[0], h = (p - c.height) * l[1];
		(u > 0 || d > 0 || m || h) && (i.push({
			id: o,
			type: "position",
			position: {
				x: a.position.x - u + m,
				y: a.position.y - d + h
			}
		}), n.get(o)?.forEach((t) => {
			e.some((e) => e.id === t.id) || i.push({
				id: t.id,
				type: "position",
				position: {
					x: t.position.x + u,
					y: t.position.y + d
				}
			});
		})), (c.width < t.width || c.height < t.height || u || d) && i.push({
			id: o,
			type: "dimensions",
			setAttributes: !0,
			dimensions: {
				width: f + (u ? l[0] * u - m : 0),
				height: p + (d ? l[1] * d - h : 0)
			}
		});
	}), i;
}
function cu(e, t, n, r, i, a, o) {
	let s = r?.querySelector(".xyflow__viewport"), c = !1;
	if (!s) return {
		changes: [],
		updatedInternals: c
	};
	let l = [], u = window.getComputedStyle(s), { m22: d } = new window.DOMMatrixReadOnly(u.transform), f = [];
	for (let r of e.values()) {
		let e = t.get(r.id);
		if (!e) continue;
		if (e.hidden) {
			t.set(e.id, {
				...e,
				internals: {
					...e.internals,
					handleBounds: void 0
				}
			}), c = !0;
			continue;
		}
		let s = yl(r.nodeElement), u = e.measured.width !== s.width || e.measured.height !== s.height;
		if (s.width && s.height && (u || !e.internals.handleBounds || r.force)) {
			let p = r.nodeElement.getBoundingClientRect(), m = dl(e.extent) ? e.extent : a, { positionAbsolute: h } = e.internals;
			e.parentId && e.extent === "parent" ? h = Wc(h, s, t.get(e.parentId)) : m && (h = Uc(h, m, s));
			let g = {
				...e,
				measured: s,
				internals: {
					...e.internals,
					positionAbsolute: h,
					handleBounds: {
						source: Tl("source", r.nodeElement, p, d, e.id),
						target: Tl("target", r.nodeElement, p, d, e.id)
					}
				}
			};
			t.set(e.id, g), e.parentId && iu(g, t, n, {
				nodeOrigin: i,
				zIndexMode: o
			}), c = !0, u && (l.push({
				id: e.id,
				type: "dimensions",
				dimensions: s
			}), e.expandParent && e.parentId && f.push({
				id: e.id,
				parentId: e.parentId,
				rect: Xc(g, i)
			}));
		}
	}
	if (f.length > 0) {
		let e = su(f, t, n, i);
		l.push(...e);
	}
	return {
		changes: l,
		updatedInternals: c
	};
}
async function lu({ delta: e, panZoom: t, transform: n, translateExtent: r, width: i, height: a }) {
	if (!t || !e.x && !e.y) return Promise.resolve(!1);
	let o = await t.setViewportConstrained({
		x: n[0] + e.x,
		y: n[1] + e.y,
		zoom: n[2]
	}, [[0, 0], [i, a]], r), s = !!o && (o.x !== n[0] || o.y !== n[1] || o.k !== n[2]);
	return Promise.resolve(s);
}
function uu(e, t, n, r, i, a) {
	let o = i, s = r.get(o) || /* @__PURE__ */ new Map();
	r.set(o, s.set(n, t)), o = `${i}-${e}`;
	let c = r.get(o) || /* @__PURE__ */ new Map();
	if (r.set(o, c.set(n, t)), a) {
		o = `${i}-${e}-${a}`;
		let s = r.get(o) || /* @__PURE__ */ new Map();
		r.set(o, s.set(n, t));
	}
}
function du(e, t, n) {
	e.clear(), t.clear();
	for (let r of n) {
		let { source: n, target: i, sourceHandle: a = null, targetHandle: o = null } = r, s = {
			edgeId: r.id,
			source: n,
			target: i,
			sourceHandle: a,
			targetHandle: o
		}, c = `${n}-${a}--${i}-${o}`;
		uu("source", s, `${i}-${o}--${n}-${a}`, e, n, a), uu("target", s, c, e, i, o), t.set(r.id, r);
	}
}
function fu(e, t) {
	if (!e.parentId) return !1;
	let n = t.get(e.parentId);
	return n ? n.selected ? !0 : fu(n, t) : !1;
}
function pu(e, t, n) {
	let r = e;
	do {
		if (r?.matches?.(t)) return !0;
		if (r === n) return !1;
		r = r?.parentElement;
	} while (r);
	return !1;
}
function mu(e, t, n, r) {
	let i = /* @__PURE__ */ new Map();
	for (let [a, o] of e) if ((o.selected || o.id === r) && (!o.parentId || !fu(o, e)) && (o.draggable || t && o.draggable === void 0)) {
		let t = e.get(a);
		t && i.set(a, {
			id: a,
			position: t.position || {
				x: 0,
				y: 0
			},
			distance: {
				x: n.x - t.internals.positionAbsolute.x,
				y: n.y - t.internals.positionAbsolute.y
			},
			extent: t.extent,
			parentId: t.parentId,
			origin: t.origin,
			expandParent: t.expandParent,
			internals: { positionAbsolute: t.internals.positionAbsolute || {
				x: 0,
				y: 0
			} },
			measured: {
				width: t.measured.width ?? 0,
				height: t.measured.height ?? 0
			}
		});
	}
	return i;
}
function hu({ nodeId: e, dragItems: t, nodeLookup: n, dragging: r = !0 }) {
	let i = [];
	for (let [e, a] of t) {
		let t = n.get(e)?.internals.userNode;
		t && i.push({
			...t,
			position: a.position,
			dragging: r
		});
	}
	if (!e) return [i[0], i];
	let a = n.get(e)?.internals.userNode;
	return [a ? {
		...a,
		position: t.get(e)?.position || a.position,
		dragging: r
	} : i[0], i];
}
function gu({ dragItems: e, snapGrid: t, x: n, y: r }) {
	let i = e.values().next().value;
	if (!i) return null;
	let a = {
		x: n - i.distance.x,
		y: r - i.distance.y
	}, o = rl(a, t);
	return {
		x: o.x - a.x,
		y: o.y - a.y
	};
}
function _u({ onNodeMouseDown: e, getStoreItems: t, onDragStart: n, onDrag: r, onDragStop: i }) {
	let a = {
		x: null,
		y: null
	}, o = 0, s = /* @__PURE__ */ new Map(), c = !1, l = {
		x: 0,
		y: 0
	}, u = null, d = !1, f = null, p = !1, m = !1, h = null;
	function g({ noDragClassName: g, handleSelector: _, domNode: v, isSelectable: y, nodeId: b, nodeClickDistance: x = 0 }) {
		f = zi(v);
		function S({ x: e, y: n }) {
			let { nodeLookup: i, nodeExtent: o, snapGrid: c, snapToGrid: l, nodeOrigin: u, onNodeDrag: d, onSelectionDrag: f, onError: p, updateNodePositions: g } = t();
			a = {
				x: e,
				y: n
			};
			let _ = !1, v = s.size > 1, y = v && o ? Jc(Fc(s)) : null, x = v && l ? gu({
				dragItems: s,
				snapGrid: c,
				x: e,
				y: n
			}) : null;
			for (let [t, r] of s) {
				if (!i.has(t)) continue;
				let a = {
					x: e - r.distance.x,
					y: n - r.distance.y
				};
				l && (a = x ? {
					x: Math.round(a.x + x.x),
					y: Math.round(a.y + x.y)
				} : rl(a, c));
				let s = null;
				if (v && o && !r.extent && y) {
					let { positionAbsolute: e } = r.internals, t = e.x - y.x + o[0][0], n = e.x + r.measured.width - y.x2 + o[1][0], i = e.y - y.y + o[0][1], a = e.y + r.measured.height - y.y2 + o[1][1];
					s = [[t, i], [n, a]];
				}
				let { position: d, positionAbsolute: f } = Bc({
					nodeId: t,
					nextPosition: a,
					nodeLookup: i,
					nodeExtent: s || o,
					nodeOrigin: u,
					onError: p
				});
				_ = _ || r.position.x !== d.x || r.position.y !== d.y, r.position = d, r.internals.positionAbsolute = f;
			}
			if (m ||= _, _ && (g(s, !0), h && (r || d || !b && f))) {
				let [e, t] = hu({
					nodeId: b,
					dragItems: s,
					nodeLookup: i
				});
				r?.(h, s, e, t), d?.(h, e, t), b || f?.(h, t);
			}
		}
		async function C() {
			if (!u) return;
			let { transform: e, panBy: n, autoPanSpeed: r, autoPanOnNodeDrag: i } = t();
			if (!i) {
				c = !1, cancelAnimationFrame(o);
				return;
			}
			let [s, d] = Kc(l, u, r);
			(s !== 0 || d !== 0) && (a.x = (a.x ?? 0) - s / e[2], a.y = (a.y ?? 0) - d / e[2], await n({
				x: s,
				y: d
			}) && S(a)), o = requestAnimationFrame(C);
		}
		function w(r) {
			let { nodeLookup: i, multiSelectionActive: o, nodesDraggable: c, transform: l, snapGrid: f, snapToGrid: p, selectNodesOnDrag: m, onNodeDragStart: h, onSelectionDragStart: g, unselectNodesAndEdges: _ } = t();
			d = !0, (!m || !y) && !o && b && (i.get(b)?.selected || _()), y && m && b && e?.(b);
			let v = vl(r.sourceEvent, {
				transform: l,
				snapGrid: f,
				snapToGrid: p,
				containerBounds: u
			});
			if (a = v, s = mu(i, c, v, b), s.size > 0 && (n || h || !b && g)) {
				let [e, t] = hu({
					nodeId: b,
					dragItems: s,
					nodeLookup: i
				});
				n?.(r.sourceEvent, s, e, t), h?.(r.sourceEvent, e, t), b || g?.(r.sourceEvent, t);
			}
		}
		let T = ea().clickDistance(x).on("start", (e) => {
			let { domNode: n, nodeDragThreshold: r, transform: i, snapGrid: o, snapToGrid: s } = t();
			u = n?.getBoundingClientRect() || null, p = !1, m = !1, h = e.sourceEvent, r === 0 && w(e), a = vl(e.sourceEvent, {
				transform: i,
				snapGrid: o,
				snapToGrid: s,
				containerBounds: u
			}), l = wl(e.sourceEvent, u);
		}).on("drag", (e) => {
			let { autoPanOnNodeDrag: n, transform: r, snapGrid: i, snapToGrid: o, nodeDragThreshold: f, nodeLookup: m } = t(), g = vl(e.sourceEvent, {
				transform: r,
				snapGrid: i,
				snapToGrid: o,
				containerBounds: u
			});
			if (h = e.sourceEvent, (e.sourceEvent.type === "touchmove" && e.sourceEvent.touches.length > 1 || b && !m.has(b)) && (p = !0), !p) {
				if (!c && n && d && (c = !0, C()), !d) {
					let t = wl(e.sourceEvent, u), n = t.x - l.x, r = t.y - l.y;
					Math.sqrt(n * n + r * r) > f && w(e);
				}
				(a.x !== g.xSnapped || a.y !== g.ySnapped) && s && d && (l = wl(e.sourceEvent, u), S(g));
			}
		}).on("end", (e) => {
			if (!(!d || p) && (c = !1, d = !1, cancelAnimationFrame(o), s.size > 0)) {
				let { nodeLookup: n, updateNodePositions: r, onNodeDragStop: a, onSelectionDragStop: o } = t();
				if (m &&= (r(s, !1), !1), i || a || !b && o) {
					let [t, r] = hu({
						nodeId: b,
						dragItems: s,
						nodeLookup: n,
						dragging: !1
					});
					i?.(e.sourceEvent, s, t, r), a?.(e.sourceEvent, t, r), b || o?.(e.sourceEvent, r);
				}
			}
		}).filter((e) => {
			let t = e.target;
			return !e.button && (!g || !pu(t, `.${g}`, v)) && (!_ || pu(t, _, v));
		});
		f.call(T);
	}
	function _() {
		f?.on(".drag", null);
	}
	return {
		update: g,
		destroy: _
	};
}
function vu(e, t, n) {
	let r = [], i = {
		x: e.x - n,
		y: e.y - n,
		width: n * 2,
		height: n * 2
	};
	for (let e of t.values()) $c(i, Xc(e)) > 0 && r.push(e);
	return r;
}
var yu = 250;
function bu(e, t, n, r) {
	let i = [], a = Infinity, o = vu(e, n, t + yu);
	for (let n of o) {
		let o = [...n.internals.handleBounds?.source ?? [], ...n.internals.handleBounds?.target ?? []];
		for (let s of o) {
			if (r.nodeId === s.nodeId && r.type === s.type && r.id === s.id) continue;
			let { x: o, y: c } = Wl(n, s, s.position, !0), l = Math.sqrt((o - e.x) ** 2 + (c - e.y) ** 2);
			l > t || (l < a ? (i = [{
				...s,
				x: o,
				y: c
			}], a = l) : l === a && i.push({
				...s,
				x: o,
				y: c
			}));
		}
	}
	if (!i.length) return null;
	if (i.length > 1) {
		let e = r.type === "source" ? "target" : "source";
		return i.find((t) => t.type === e) ?? i[0];
	}
	return i[0];
}
function xu(e, t, n, r, i, a = !1) {
	let o = r.get(e);
	if (!o) return null;
	let s = i === "strict" ? o.internals.handleBounds?.[t] : [...o.internals.handleBounds?.source ?? [], ...o.internals.handleBounds?.target ?? []], c = (n ? s?.find((e) => e.id === n) : s?.[0]) ?? null;
	return c && a ? {
		...c,
		...Wl(o, c, c.position, !0)
	} : c;
}
function Su(e, t) {
	return e || (t?.classList.contains("target") ? "target" : t?.classList.contains("source") ? "source" : null);
}
function Cu(e, t) {
	let n = null;
	return t ? n = !0 : e && !t && (n = !1), n;
}
var wu = () => !0;
function Tu(e, { connectionMode: t, connectionRadius: n, handleId: r, nodeId: i, edgeUpdaterType: a, isTarget: o, domNode: s, nodeLookup: c, lib: l, autoPanOnConnect: u, flowId: d, panBy: f, cancelConnection: p, onConnectStart: m, onConnect: h, onConnectEnd: g, isValidConnection: _ = wu, onReconnectEnd: v, updateConnection: y, getTransform: b, getFromHandle: x, autoPanSpeed: S, dragThreshold: C = 1, handleDomNode: w }) {
	let T = bl(e.target), E = 0, D, { x: O, y: k } = wl(e), A = Su(a, w), j = s?.getBoundingClientRect(), M = !1;
	if (!j || !A) return;
	let N = xu(i, A, r, c, t);
	if (!N) return;
	let P = wl(e, j), F = !1, I = null, L = !1, R = null;
	function ee() {
		if (!u || !j) return;
		let [e, t] = Kc(P, j, S);
		f({
			x: e,
			y: t
		}), E = requestAnimationFrame(ee);
	}
	let te = {
		...N,
		nodeId: i,
		type: A,
		position: N.position
	}, z = c.get(i), B = {
		inProgress: !0,
		isValid: null,
		from: Wl(z, te, Y.Left, !0),
		fromHandle: te,
		fromPosition: te.position,
		fromNode: z,
		to: P,
		toHandle: null,
		toPosition: Oc[te.position],
		toNode: null,
		pointer: P
	};
	function V() {
		M = !0, y(B), m?.(e, {
			nodeId: i,
			handleId: r,
			handleType: A
		});
	}
	C === 0 && V();
	function ne(e) {
		if (!M) {
			let { x: t, y: n } = wl(e), r = t - O, i = n - k;
			if (!(r * r + i * i > C * C)) return;
			V();
		}
		if (!x() || !te) {
			H(e);
			return;
		}
		let a = b();
		P = wl(e, j), D = bu(il(P, a, !1, [1, 1]), n, c, te), F ||= (ee(), !0);
		let s = Eu(e, {
			handle: D,
			connectionMode: t,
			fromNodeId: i,
			fromHandleId: r,
			fromType: o ? "target" : "source",
			isValidConnection: _,
			doc: T,
			lib: l,
			flowId: d,
			nodeLookup: c
		});
		R = s.handleDomNode, I = s.connection, L = Cu(!!D, s.isValid);
		let u = c.get(i), f = u ? Wl(u, te, Y.Left, !0) : B.from, p = {
			...B,
			from: f,
			isValid: L,
			to: s.toHandle && L ? al({
				x: s.toHandle.x,
				y: s.toHandle.y
			}, a) : P,
			toHandle: s.toHandle,
			toPosition: L && s.toHandle ? s.toHandle.position : Oc[te.position],
			toNode: s.toHandle ? c.get(s.toHandle.nodeId) : null,
			pointer: P
		};
		y(p), B = p;
	}
	function H(e) {
		if (!("touches" in e && e.touches.length > 0)) {
			if (M) {
				(D || R) && I && L && h?.(I);
				let { inProgress: t, ...n } = B, r = {
					...n,
					toPosition: B.toHandle ? B.toPosition : null
				};
				g?.(e, r), a && v?.(e, r);
			}
			p(), cancelAnimationFrame(E), F = !1, L = !1, I = null, R = null, T.removeEventListener("mousemove", ne), T.removeEventListener("mouseup", H), T.removeEventListener("touchmove", ne), T.removeEventListener("touchend", H);
		}
	}
	T.addEventListener("mousemove", ne), T.addEventListener("mouseup", H), T.addEventListener("touchmove", ne), T.addEventListener("touchend", H);
}
function Eu(e, { handle: t, connectionMode: n, fromNodeId: r, fromHandleId: i, fromType: a, doc: o, lib: s, flowId: c, isValidConnection: l = wu, nodeLookup: u }) {
	let d = a === "target", f = t ? o.querySelector(`.${s}-flow__handle[data-id="${c}-${t?.nodeId}-${t?.id}-${t?.type}"]`) : null, { x: p, y: m } = wl(e), h = o.elementFromPoint(p, m), g = h?.classList.contains(`${s}-flow__handle`) ? h : f, _ = {
		handleDomNode: g,
		isValid: !1,
		connection: null,
		toHandle: null
	};
	if (g) {
		let e = Su(void 0, g), t = g.getAttribute("data-nodeid"), a = g.getAttribute("data-handleid"), o = g.classList.contains("connectable"), s = g.classList.contains("connectableend");
		if (!t || !e) return _;
		let c = {
			source: d ? t : r,
			sourceHandle: d ? a : i,
			target: d ? r : t,
			targetHandle: d ? i : a
		};
		_.connection = c, _.isValid = o && s && (n === Sc.Strict ? d && e === "source" || !d && e === "target" : t !== r || a !== i) && l(c), _.toHandle = xu(t, e, a, u, n, !0);
	}
	return _;
}
var Du = {
	onPointerDown: Tu,
	isValid: Eu
};
function Ou({ domNode: e, panZoom: t, getTransform: n, getViewScale: r }) {
	let i = zi(e);
	function a({ translateExtent: e, width: a, height: o, zoomStep: s = 1, pannable: c = !0, zoomable: l = !0, inversePan: u = !1 }) {
		let d = (e) => {
			if (e.sourceEvent.type !== "wheel" || !t) return;
			let r = n(), i = e.sourceEvent.ctrlKey && ul() ? 10 : 1, a = -e.sourceEvent.deltaY * (e.sourceEvent.deltaMode === 1 ? .05 : e.sourceEvent.deltaMode ? 1 : .002) * s, o = r[2] * 2 ** (a * i);
			t.scaleTo(o);
		}, f = [0, 0], p = _c().on("start", (e) => {
			(e.sourceEvent.type === "mousedown" || e.sourceEvent.type === "touchstart") && (f = [e.sourceEvent.clientX ?? e.sourceEvent.touches[0].clientX, e.sourceEvent.clientY ?? e.sourceEvent.touches[0].clientY]);
		}).on("zoom", c ? (i) => {
			let s = n();
			if (i.sourceEvent.type !== "mousemove" && i.sourceEvent.type !== "touchmove" || !t) return;
			let c = [i.sourceEvent.clientX ?? i.sourceEvent.touches[0].clientX, i.sourceEvent.clientY ?? i.sourceEvent.touches[0].clientY], l = [c[0] - f[0], c[1] - f[1]];
			f = c;
			let d = r() * Math.max(s[2], Math.log(s[2])) * (u ? -1 : 1), p = {
				x: s[0] - l[0] * d,
				y: s[1] - l[1] * d
			}, m = [[0, 0], [a, o]];
			t.setViewportConstrained({
				x: p.x,
				y: p.y,
				zoom: s[2]
			}, m, e);
		} : null).on("zoom.wheel", l ? d : null);
		i.call(p, {});
	}
	function o() {
		i.on("zoom", null);
	}
	return {
		update: a,
		destroy: o,
		pointer: Vi
	};
}
var ku = (e) => ({
	x: e.x,
	y: e.y,
	zoom: e.k
}), Au = ({ x: e, y: t, zoom: n }) => sc.translate(e, t).scale(n), ju = (e, t) => e.target.closest(`.${t}`), Mu = (e, t) => t === 2 && Array.isArray(e) && e.includes(2), Nu = (e) => ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2, Pu = (e, t = 0, n = Nu, r = () => {}) => {
	let i = typeof t == "number" && t > 0;
	return i || r(), i ? e.transition().duration(t).ease(n).on("end", r) : e;
}, Fu = (e) => {
	let t = e.ctrlKey && ul() ? 10 : 1;
	return -e.deltaY * (e.deltaMode === 1 ? .05 : e.deltaMode ? 1 : .002) * t;
};
function Iu({ zoomPanValues: e, noWheelClassName: t, d3Selection: n, d3Zoom: r, panOnScrollMode: i, panOnScrollSpeed: a, zoomOnPinch: o, onPanZoomStart: s, onPanZoom: c, onPanZoomEnd: l }) {
	return (u) => {
		if (ju(u, t)) return u.ctrlKey && u.preventDefault(), !1;
		u.preventDefault(), u.stopImmediatePropagation();
		let d = n.property("__zoom").k || 1;
		if (u.ctrlKey && o) {
			let e = Vi(u), t = d * 2 ** Fu(u);
			r.scaleTo(n, t, e, u);
			return;
		}
		let f = u.deltaMode === 1 ? 20 : 1, p = i === Cc.Vertical ? 0 : u.deltaX * f, m = i === Cc.Horizontal ? 0 : u.deltaY * f;
		!ul() && u.shiftKey && i !== Cc.Vertical && (p = u.deltaY * f, m = 0), r.translateBy(n, -(p / d) * a, -(m / d) * a, { internal: !0 });
		let h = ku(n.property("__zoom"));
		clearTimeout(e.panScrollTimeout), e.isPanScrolling ? (c?.(u, h), e.panScrollTimeout = setTimeout(() => {
			l?.(u, h), e.isPanScrolling = !1;
		}, 150)) : (e.isPanScrolling = !0, s?.(u, h));
	};
}
function Lu({ noWheelClassName: e, preventScrolling: t, d3ZoomHandler: n }) {
	return function(r, i) {
		let a = r.type === "wheel", o = !t && a && !r.ctrlKey, s = ju(r, e);
		if (r.ctrlKey && a && s && r.preventDefault(), o || s) return null;
		r.preventDefault(), n.call(this, r, i);
	};
}
function Ru({ zoomPanValues: e, onDraggingChange: t, onPanZoomStart: n }) {
	return (r) => {
		if (r.sourceEvent?.internal) return;
		let i = ku(r.transform);
		e.mouseButton = r.sourceEvent?.button || 0, e.isZoomingOrPanning = !0, e.prevViewport = i, r.sourceEvent?.type === "mousedown" && t(!0), n && n?.(r.sourceEvent, i);
	};
}
function zu({ zoomPanValues: e, panOnDrag: t, onPaneContextMenu: n, onTransformChange: r, onPanZoom: i }) {
	return (a) => {
		e.usedRightMouseButton = !!(n && Mu(t, e.mouseButton ?? 0)), a.sourceEvent?.sync || r([
			a.transform.x,
			a.transform.y,
			a.transform.k
		]), i && !a.sourceEvent?.internal && i?.(a.sourceEvent, ku(a.transform));
	};
}
function Bu({ zoomPanValues: e, panOnDrag: t, panOnScroll: n, onDraggingChange: r, onPanZoomEnd: i, onPaneContextMenu: a }) {
	return (o) => {
		if (!o.sourceEvent?.internal && (e.isZoomingOrPanning = !1, a && Mu(t, e.mouseButton ?? 0) && !e.usedRightMouseButton && o.sourceEvent && a(o.sourceEvent), e.usedRightMouseButton = !1, r(!1), i)) {
			let t = ku(o.transform);
			e.prevViewport = t, clearTimeout(e.timerId), e.timerId = setTimeout(() => {
				i?.(o.sourceEvent, t);
			}, n ? 150 : 0);
		}
	};
}
function Vu({ zoomActivationKeyPressed: e, zoomOnScroll: t, zoomOnPinch: n, panOnDrag: r, panOnScroll: i, zoomOnDoubleClick: a, userSelectionActive: o, noWheelClassName: s, noPanClassName: c, lib: l, connectionInProgress: u }) {
	return (d) => {
		let f = e || t, p = n && d.ctrlKey, m = d.type === "wheel";
		if (d.button === 1 && d.type === "mousedown" && (ju(d, `${l}-flow__node`) || ju(d, `${l}-flow__edge`))) return !0;
		if (!r && !f && !i && !a && !n || o || u && !m || ju(d, s) && m || ju(d, c) && (!m || i && m && !e) || !n && d.ctrlKey && m) return !1;
		if (!n && d.type === "touchstart" && d.touches?.length > 1) return d.preventDefault(), !1;
		if (!f && !i && !p && m || !r && (d.type === "mousedown" || d.type === "touchstart") || Array.isArray(r) && !r.includes(d.button) && d.type === "mousedown") return !1;
		let h = Array.isArray(r) && r.includes(d.button) || !d.button || d.button <= 1;
		return (!d.ctrlKey || m) && h;
	};
}
function Hu({ domNode: e, minZoom: t, maxZoom: n, translateExtent: r, viewport: i, onPanZoom: a, onPanZoomStart: o, onPanZoomEnd: s, onDraggingChange: c }) {
	let l = {
		isZoomingOrPanning: !1,
		usedRightMouseButton: !1,
		prevViewport: {
			x: 0,
			y: 0,
			zoom: 0
		},
		mouseButton: 0,
		timerId: void 0,
		panScrollTimeout: void 0,
		isPanScrolling: !1
	}, u = e.getBoundingClientRect(), d = _c().scaleExtent([t, n]).translateExtent(r), f = zi(e).call(d);
	v({
		x: i.x,
		y: i.y,
		zoom: Hc(i.zoom, t, n)
	}, [[0, 0], [u.width, u.height]], r);
	let p = f.on("wheel.zoom"), m = f.on("dblclick.zoom");
	d.wheelDelta(Fu);
	function h(e, t) {
		return f ? new Promise((n) => {
			d?.interpolate(t?.interpolate === "linear" ? ro : _o).transform(Pu(f, t?.duration, t?.ease, () => n(!0)), e);
		}) : Promise.resolve(!1);
	}
	function g({ noWheelClassName: e, noPanClassName: t, onPaneContextMenu: n, userSelectionActive: r, panOnScroll: i, panOnDrag: u, panOnScrollMode: h, panOnScrollSpeed: g, preventScrolling: v, zoomOnPinch: y, zoomOnScroll: b, zoomOnDoubleClick: x, zoomActivationKeyPressed: S, lib: C, onTransformChange: w, connectionInProgress: T, paneClickDistance: E, selectionOnDrag: D }) {
		r && !l.isZoomingOrPanning && _();
		let O = i && !S && !r;
		d.clickDistance(D ? Infinity : !tl(E) || E < 0 ? 0 : E);
		let k = O ? Iu({
			zoomPanValues: l,
			noWheelClassName: e,
			d3Selection: f,
			d3Zoom: d,
			panOnScrollMode: h,
			panOnScrollSpeed: g,
			zoomOnPinch: y,
			onPanZoomStart: o,
			onPanZoom: a,
			onPanZoomEnd: s
		}) : Lu({
			noWheelClassName: e,
			preventScrolling: v,
			d3ZoomHandler: p
		});
		if (f.on("wheel.zoom", k, { passive: !1 }), !r) {
			let e = Ru({
				zoomPanValues: l,
				onDraggingChange: c,
				onPanZoomStart: o
			});
			d.on("start", e);
			let t = zu({
				zoomPanValues: l,
				panOnDrag: u,
				onPaneContextMenu: !!n,
				onPanZoom: a,
				onTransformChange: w
			});
			d.on("zoom", t);
			let r = Bu({
				zoomPanValues: l,
				panOnDrag: u,
				panOnScroll: i,
				onPaneContextMenu: n,
				onPanZoomEnd: s,
				onDraggingChange: c
			});
			d.on("end", r);
		}
		let A = Vu({
			zoomActivationKeyPressed: S,
			panOnDrag: u,
			zoomOnScroll: b,
			panOnScroll: i,
			zoomOnDoubleClick: x,
			zoomOnPinch: y,
			userSelectionActive: r,
			noPanClassName: t,
			noWheelClassName: e,
			lib: C,
			connectionInProgress: T
		});
		d.filter(A), x ? f.on("dblclick.zoom", m) : f.on("dblclick.zoom", null);
	}
	function _() {
		d.on("zoom", null);
	}
	async function v(e, t, n) {
		let r = Au(e), i = d?.constrain()(r, t, n);
		return i && await h(i), new Promise((e) => e(i));
	}
	async function y(e, t) {
		let n = Au(e);
		return await h(n, t), new Promise((e) => e(n));
	}
	function b(e) {
		if (f) {
			let t = Au(e), n = f.property("__zoom");
			(n.k !== e.zoom || n.x !== e.x || n.y !== e.y) && d?.transform(f, t, null, { sync: !0 });
		}
	}
	function x() {
		let e = f ? cc(f.node()) : {
			x: 0,
			y: 0,
			k: 1
		};
		return {
			x: e.x,
			y: e.y,
			zoom: e.k
		};
	}
	function S(e, t) {
		return f ? new Promise((n) => {
			d?.interpolate(t?.interpolate === "linear" ? ro : _o).scaleTo(Pu(f, t?.duration, t?.ease, () => n(!0)), e);
		}) : Promise.resolve(!1);
	}
	function C(e, t) {
		return f ? new Promise((n) => {
			d?.interpolate(t?.interpolate === "linear" ? ro : _o).scaleBy(Pu(f, t?.duration, t?.ease, () => n(!0)), e);
		}) : Promise.resolve(!1);
	}
	function w(e) {
		d?.scaleExtent(e);
	}
	function T(e) {
		d?.translateExtent(e);
	}
	function E(e) {
		let t = !tl(e) || e < 0 ? 0 : e;
		d?.clickDistance(t);
	}
	return {
		update: g,
		destroy: _,
		setViewport: y,
		setViewportConstrained: v,
		getViewport: x,
		scaleTo: S,
		scaleBy: C,
		setScaleExtent: w,
		setTranslateExtent: T,
		syncViewport: b,
		setClickDistance: E
	};
}
var Uu;
(function(e) {
	e.Line = "line", e.Handle = "handle";
})(Uu ||= {});
function Wu({ width: e, prevWidth: t, height: n, prevHeight: r, affectsX: i, affectsY: a }) {
	let o = e - t, s = n - r, c = [o > 0 ? 1 : o < 0 ? -1 : 0, s > 0 ? 1 : s < 0 ? -1 : 0];
	return o && i && (c[0] *= -1), s && a && (c[1] *= -1), c;
}
function Gu(e) {
	return {
		isHorizontal: e.includes("right") || e.includes("left"),
		isVertical: e.includes("bottom") || e.includes("top"),
		affectsX: e.includes("left"),
		affectsY: e.includes("top")
	};
}
function Ku(e, t) {
	return Math.max(0, t - e);
}
function qu(e, t) {
	return Math.max(0, e - t);
}
function Ju(e, t, n) {
	return Math.max(0, t - e, e - n);
}
function Yu(e, t) {
	return e ? !t : t;
}
function Xu(e, t, n, r, i, a, o, s) {
	let { affectsX: c, affectsY: l } = t, { isHorizontal: u, isVertical: d } = t, f = u && d, { xSnapped: p, ySnapped: m } = n, { minWidth: h, maxWidth: g, minHeight: _, maxHeight: v } = r, { x: y, y: b, width: x, height: S, aspectRatio: C } = e, w = Math.floor(u ? p - e.pointerX : 0), T = Math.floor(d ? m - e.pointerY : 0), E = x + (c ? -w : w), D = S + (l ? -T : T), O = -a[0] * x, k = -a[1] * S, A = Ju(E, h, g), j = Ju(D, _, v);
	if (o) {
		let e = 0, t = 0;
		c && w < 0 ? e = Ku(y + w + O, o[0][0]) : !c && w > 0 && (e = qu(y + E + O, o[1][0])), l && T < 0 ? t = Ku(b + T + k, o[0][1]) : !l && T > 0 && (t = qu(b + D + k, o[1][1])), A = Math.max(A, e), j = Math.max(j, t);
	}
	if (s) {
		let e = 0, t = 0;
		c && w > 0 ? e = qu(y + w, s[0][0]) : !c && w < 0 && (e = Ku(y + E, s[1][0])), l && T > 0 ? t = qu(b + T, s[0][1]) : !l && T < 0 && (t = Ku(b + D, s[1][1])), A = Math.max(A, e), j = Math.max(j, t);
	}
	if (i) {
		if (u) {
			let e = Ju(E / C, _, v) * C;
			if (A = Math.max(A, e), o) {
				let e = 0;
				e = !c && !l || c && !l && f ? qu(b + k + E / C, o[1][1]) * C : Ku(b + k + (c ? w : -w) / C, o[0][1]) * C, A = Math.max(A, e);
			}
			if (s) {
				let e = 0;
				e = !c && !l || c && !l && f ? Ku(b + E / C, s[1][1]) * C : qu(b + (c ? w : -w) / C, s[0][1]) * C, A = Math.max(A, e);
			}
		}
		if (d) {
			let e = Ju(D * C, h, g) / C;
			if (j = Math.max(j, e), o) {
				let e = 0;
				e = !c && !l || l && !c && f ? qu(y + D * C + O, o[1][0]) / C : Ku(y + (l ? T : -T) * C + O, o[0][0]) / C, j = Math.max(j, e);
			}
			if (s) {
				let e = 0;
				e = !c && !l || l && !c && f ? Ku(y + D * C, s[1][0]) / C : qu(y + (l ? T : -T) * C, s[0][0]) / C, j = Math.max(j, e);
			}
		}
	}
	T += T < 0 ? j : -j, w += w < 0 ? A : -A, i && (f ? E > D * C ? T = (Yu(c, l) ? -w : w) / C : w = (Yu(c, l) ? -T : T) * C : u ? (T = w / C, l = c) : (w = T * C, c = l));
	let M = c ? y + w : y, N = l ? b + T : b;
	return {
		width: x + (c ? -w : w),
		height: S + (l ? -T : T),
		x: a[0] * w * (c ? -1 : 1) + M,
		y: a[1] * T * (l ? -1 : 1) + N
	};
}
var Zu = {
	width: 0,
	height: 0,
	x: 0,
	y: 0
}, Qu = {
	...Zu,
	pointerX: 0,
	pointerY: 0,
	aspectRatio: 1
};
function $u(e) {
	return [[0, 0], [e.measured.width, e.measured.height]];
}
function ed(e, t, n) {
	let r = t.position.x + e.position.x, i = t.position.y + e.position.y, a = e.measured.width ?? 0, o = e.measured.height ?? 0, s = n[0] * a, c = n[1] * o;
	return [[r - s, i - c], [r + a - s, i + o - c]];
}
function td({ domNode: e, nodeId: t, getStoreItems: n, onChange: r, onEnd: i }) {
	let a = zi(e), o = {
		controlDirection: Gu("bottom-right"),
		boundaries: {
			minWidth: 0,
			minHeight: 0,
			maxWidth: Number.MAX_VALUE,
			maxHeight: Number.MAX_VALUE
		},
		resizeDirection: void 0,
		keepAspectRatio: !1
	};
	function s({ controlPosition: e, boundaries: s, keepAspectRatio: c, resizeDirection: l, onResizeStart: u, onResize: d, onResizeEnd: f, shouldResize: p }) {
		let m = { ...Zu }, h = { ...Qu };
		o = {
			boundaries: s,
			resizeDirection: l,
			keepAspectRatio: c,
			controlDirection: Gu(e)
		};
		let g, _ = null, v = [], y, b, x, S = !1, C = ea().on("start", (e) => {
			let { nodeLookup: r, transform: i, snapGrid: a, snapToGrid: o, nodeOrigin: s, paneDomNode: c } = n();
			if (g = r.get(t), !g) return;
			_ = c?.getBoundingClientRect() ?? null;
			let { xSnapped: l, ySnapped: d } = vl(e.sourceEvent, {
				transform: i,
				snapGrid: a,
				snapToGrid: o,
				containerBounds: _
			});
			m = {
				width: g.measured.width ?? 0,
				height: g.measured.height ?? 0,
				x: g.position.x ?? 0,
				y: g.position.y ?? 0
			}, h = {
				...m,
				pointerX: l,
				pointerY: d,
				aspectRatio: m.width / m.height
			}, y = void 0, g.parentId && (g.extent === "parent" || g.expandParent) && (y = r.get(g.parentId), b = y && g.extent === "parent" ? $u(y) : void 0), v = [], x = void 0;
			for (let [e, n] of r) if (n.parentId === t && (v.push({
				id: e,
				position: { ...n.position },
				extent: n.extent
			}), n.extent === "parent" || n.expandParent)) {
				let e = ed(n, g, n.origin ?? s);
				x = x ? [[Math.min(e[0][0], x[0][0]), Math.min(e[0][1], x[0][1])], [Math.max(e[1][0], x[1][0]), Math.max(e[1][1], x[1][1])]] : e;
			}
			u?.(e, { ...m });
		}).on("drag", (e) => {
			let { transform: t, snapGrid: i, snapToGrid: a, nodeOrigin: s } = n(), c = vl(e.sourceEvent, {
				transform: t,
				snapGrid: i,
				snapToGrid: a,
				containerBounds: _
			}), l = [];
			if (!g) return;
			let { x: u, y: f, width: C, height: w } = m, T = {}, E = g.origin ?? s, { width: D, height: O, x: k, y: A } = Xu(h, o.controlDirection, c, o.boundaries, o.keepAspectRatio, E, b, x), j = D !== C, M = O !== w, N = k !== u && j, P = A !== f && M;
			if (!N && !P && !j && !M) return;
			if ((N || P || E[0] === 1 || E[1] === 1) && (T.x = N ? k : m.x, T.y = P ? A : m.y, m.x = T.x, m.y = T.y, v.length > 0)) {
				let e = k - u, t = A - f;
				for (let n of v) n.position = {
					x: n.position.x - e + E[0] * (D - C),
					y: n.position.y - t + E[1] * (O - w)
				}, l.push(n);
			}
			if ((j || M) && (T.width = j && (!o.resizeDirection || o.resizeDirection === "horizontal") ? D : m.width, T.height = M && (!o.resizeDirection || o.resizeDirection === "vertical") ? O : m.height, m.width = T.width, m.height = T.height), y && g.expandParent) {
				let e = E[0] * (T.width ?? 0);
				T.x && T.x < e && (m.x = e, h.x -= T.x - e);
				let t = E[1] * (T.height ?? 0);
				T.y && T.y < t && (m.y = t, h.y -= T.y - t);
			}
			let F = Wu({
				width: m.width,
				prevWidth: C,
				height: m.height,
				prevHeight: w,
				affectsX: o.controlDirection.affectsX,
				affectsY: o.controlDirection.affectsY
			}), I = {
				...m,
				direction: F
			};
			p?.(e, I) !== !1 && (S = !0, d?.(e, I), r(T, l));
		}).on("end", (e) => {
			S &&= (f?.(e, { ...m }), i?.({ ...m }), !1);
		});
		a.call(C);
	}
	function c() {
		a.on(".drag", null);
	}
	return {
		update: s,
		destroy: c
	};
}
//#endregion
//#region node_modules/.pnpm/use-sync-external-store@1.6.0_react@19.2.6/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.production.js
var nd = /* @__PURE__ */ o(((e) => {
	var t = u();
	function n(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var r = typeof Object.is == "function" ? Object.is : n, i = t.useState, a = t.useEffect, o = t.useLayoutEffect, s = t.useDebugValue;
	function c(e, t) {
		var n = t(), r = i({ inst: {
			value: n,
			getSnapshot: t
		} }), c = r[0].inst, u = r[1];
		return o(function() {
			c.value = n, c.getSnapshot = t, l(c) && u({ inst: c });
		}, [
			e,
			n,
			t
		]), a(function() {
			return l(c) && u({ inst: c }), e(function() {
				l(c) && u({ inst: c });
			});
		}, [e]), s(n), n;
	}
	function l(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !r(e, n);
		} catch {
			return !0;
		}
	}
	function d(e, t) {
		return t();
	}
	var f = typeof window > "u" || window.document === void 0 || window.document.createElement === void 0 ? d : c;
	e.useSyncExternalStore = t.useSyncExternalStore === void 0 ? f : t.useSyncExternalStore;
})), rd = /* @__PURE__ */ o(((e, t) => {
	t.exports = nd();
})), id = /* @__PURE__ */ o(((e) => {
	var t = u(), n = rd();
	function r(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var i = typeof Object.is == "function" ? Object.is : r, a = n.useSyncExternalStore, o = t.useRef, s = t.useEffect, c = t.useMemo, l = t.useDebugValue;
	e.useSyncExternalStoreWithSelector = function(e, t, n, r, u) {
		var d = o(null);
		if (d.current === null) {
			var f = {
				hasValue: !1,
				value: null
			};
			d.current = f;
		} else f = d.current;
		d = c(function() {
			function e(e) {
				if (!a) {
					if (a = !0, o = e, e = r(e), u !== void 0 && f.hasValue) {
						var t = f.value;
						if (u(t, e)) return s = t;
					}
					return s = e;
				}
				if (t = s, i(o, e)) return t;
				var n = r(e);
				return u !== void 0 && u(t, n) ? (o = e, t) : (o = e, s = n);
			}
			var a = !1, o, s, c = n === void 0 ? null : n;
			return [function() {
				return e(t());
			}, c === null ? void 0 : function() {
				return e(c());
			}];
		}, [
			t,
			n,
			r,
			u
		]);
		var p = a(e, d[0], d[1]);
		return s(function() {
			f.hasValue = !0, f.value = p;
		}, [p]), l(p), p;
	};
})), ad = /* @__PURE__ */ c((/* @__PURE__ */ o(((e, t) => {
	t.exports = id();
})))(), 1), od = (e) => {
	let t, n = /* @__PURE__ */ new Set(), r = (e, r) => {
		let i = typeof e == "function" ? e(t) : e;
		if (!Object.is(i, t)) {
			let e = t;
			t = r ?? (typeof i != "object" || !i) ? i : Object.assign({}, t, i), n.forEach((n) => n(t, e));
		}
	}, i = () => t, a = {
		setState: r,
		getState: i,
		getInitialState: () => o,
		subscribe: (e) => (n.add(e), () => n.delete(e)),
		destroy: () => {
			n.clear();
		}
	}, o = t = e(r, i, a);
	return a;
}, sd = (e) => e ? od(e) : od, { useDebugValue: cd } = _.default, { useSyncExternalStoreWithSelector: ld } = ad.default, ud = (e) => e;
function dd(e, t = ud, n) {
	let r = ld(e.subscribe, e.getState, e.getServerState || e.getInitialState, t, n);
	return cd(r), r;
}
var fd = (e, t) => {
	let n = sd(e), r = (e, r = t) => dd(n, e, r);
	return Object.assign(r, n), r;
}, pd = (e, t) => e ? fd(e, t) : fd;
//#endregion
//#region node_modules/.pnpm/zustand@4.5.7_@types+react@19.2.15_react@19.2.6/node_modules/zustand/esm/shallow.mjs
function md(e, t) {
	if (Object.is(e, t)) return !0;
	if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
	if (e instanceof Map && t instanceof Map) {
		if (e.size !== t.size) return !1;
		for (let [n, r] of e) if (!Object.is(r, t.get(n))) return !1;
		return !0;
	}
	if (e instanceof Set && t instanceof Set) {
		if (e.size !== t.size) return !1;
		for (let n of e) if (!t.has(n)) return !1;
		return !0;
	}
	let n = Object.keys(e);
	if (n.length !== Object.keys(t).length) return !1;
	for (let r of n) if (!Object.prototype.hasOwnProperty.call(t, r) || !Object.is(e[r], t[r])) return !1;
	return !0;
}
//#endregion
//#region node_modules/.pnpm/@xyflow+react@12.10.2_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@xyflow/react/dist/esm/index.js
var hd = /* @__PURE__ */ c(m()), gd = (0, _.createContext)(null), _d = gd.Provider, vd = vc.error001();
function Q(e, t) {
	let n = (0, _.useContext)(gd);
	if (n === null) throw Error(vd);
	return dd(n, e, t);
}
function $() {
	let e = (0, _.useContext)(gd);
	if (e === null) throw Error(vd);
	return (0, _.useMemo)(() => ({
		getState: e.getState,
		setState: e.setState,
		subscribe: e.subscribe
	}), [e]);
}
var yd = { display: "none" }, bd = {
	position: "absolute",
	width: 1,
	height: 1,
	margin: -1,
	border: 0,
	padding: 0,
	overflow: "hidden",
	clip: "rect(0px, 0px, 0px, 0px)",
	clipPath: "inset(100%)"
}, xd = "react-flow__node-desc", Sd = "react-flow__edge-desc", Cd = "react-flow__aria-live", wd = (e) => e.ariaLiveMessage, Td = (e) => e.ariaLabelConfig;
function Ed({ rfId: e }) {
	let t = Q(wd);
	return (0, q.jsx)("div", {
		id: `${Cd}-${e}`,
		"aria-live": "assertive",
		"aria-atomic": "true",
		style: bd,
		children: t
	});
}
function Dd({ rfId: e, disableKeyboardA11y: t }) {
	let n = Q(Td);
	return (0, q.jsxs)(q.Fragment, { children: [
		(0, q.jsx)("div", {
			id: `${xd}-${e}`,
			style: yd,
			children: t ? n["node.a11yDescription.default"] : n["node.a11yDescription.keyboardDisabled"]
		}),
		(0, q.jsx)("div", {
			id: `${Sd}-${e}`,
			style: yd,
			children: n["edge.a11yDescription.default"]
		}),
		!t && (0, q.jsx)(Ed, { rfId: e })
	] });
}
var Od = (0, _.forwardRef)(({ position: e = "top-left", children: t, className: n, style: r, ...i }, a) => (0, q.jsx)("div", {
	className: Pn([
		"react-flow__panel",
		n,
		...`${e}`.split("-")
	]),
	style: r,
	ref: a,
	...i,
	children: t
}));
Od.displayName = "Panel";
function kd({ proOptions: e, position: t = "bottom-right" }) {
	return e?.hideAttribution ? null : (0, q.jsx)(Od, {
		position: t,
		className: "react-flow__attribution",
		"data-message": "Please only hide this attribution when you are subscribed to React Flow Pro: https://pro.reactflow.dev",
		children: (0, q.jsx)("a", {
			href: "https://reactflow.dev",
			target: "_blank",
			rel: "noopener noreferrer",
			"aria-label": "React Flow attribution",
			children: "React Flow"
		})
	});
}
var Ad = (e) => {
	let t = [], n = [];
	for (let [, n] of e.nodeLookup) n.selected && t.push(n.internals.userNode);
	for (let [, t] of e.edgeLookup) t.selected && n.push(t);
	return {
		selectedNodes: t,
		selectedEdges: n
	};
}, jd = (e) => e.id;
function Md(e, t) {
	return md(e.selectedNodes.map(jd), t.selectedNodes.map(jd)) && md(e.selectedEdges.map(jd), t.selectedEdges.map(jd));
}
function Nd({ onSelectionChange: e }) {
	let t = $(), { selectedNodes: n, selectedEdges: r } = Q(Ad, Md);
	return (0, _.useEffect)(() => {
		let i = {
			nodes: n,
			edges: r
		};
		e?.(i), t.getState().onSelectionChangeHandlers.forEach((e) => e(i));
	}, [
		n,
		r,
		e
	]), null;
}
var Pd = (e) => !!e.onSelectionChangeHandlers;
function Fd({ onSelectionChange: e }) {
	let t = Q(Pd);
	return e || t ? (0, q.jsx)(Nd, { onSelectionChange: e }) : null;
}
var Id = typeof window < "u" ? _.useLayoutEffect : _.useEffect, Ld = [0, 0], Rd = {
	x: 0,
	y: 0,
	zoom: 1
}, zd = [.../* @__PURE__ */ "nodes.edges.defaultNodes.defaultEdges.onConnect.onConnectStart.onConnectEnd.onClickConnectStart.onClickConnectEnd.nodesDraggable.autoPanOnNodeFocus.nodesConnectable.nodesFocusable.edgesFocusable.edgesReconnectable.elevateNodesOnSelect.elevateEdgesOnSelect.minZoom.maxZoom.nodeExtent.onNodesChange.onEdgesChange.elementsSelectable.connectionMode.snapGrid.snapToGrid.translateExtent.connectOnClick.defaultEdgeOptions.fitView.fitViewOptions.onNodesDelete.onEdgesDelete.onDelete.onNodeDrag.onNodeDragStart.onNodeDragStop.onSelectionDrag.onSelectionDragStart.onSelectionDragStop.onMoveStart.onMove.onMoveEnd.noPanClassName.nodeOrigin.autoPanOnConnect.autoPanOnNodeDrag.onError.connectionRadius.isValidConnection.selectNodesOnDrag.nodeDragThreshold.connectionDragThreshold.onBeforeDelete.debug.autoPanSpeed.ariaLabelConfig.zIndexMode".split("."), "rfId"], Bd = (e) => ({
	setNodes: e.setNodes,
	setEdges: e.setEdges,
	setMinZoom: e.setMinZoom,
	setMaxZoom: e.setMaxZoom,
	setTranslateExtent: e.setTranslateExtent,
	setNodeExtent: e.setNodeExtent,
	reset: e.reset,
	setDefaultNodesAndEdges: e.setDefaultNodesAndEdges
}), Vd = {
	translateExtent: yc,
	nodeOrigin: Ld,
	minZoom: .5,
	maxZoom: 2,
	elementsSelectable: !0,
	noPanClassName: "nopan",
	rfId: "1"
};
function Hd(e) {
	let { setNodes: t, setEdges: n, setMinZoom: r, setMaxZoom: i, setTranslateExtent: a, setNodeExtent: o, reset: s, setDefaultNodesAndEdges: c } = Q(Bd, md), l = $();
	Id(() => (c(e.defaultNodes, e.defaultEdges), () => {
		u.current = Vd, s();
	}), []);
	let u = (0, _.useRef)(Vd);
	return Id(() => {
		for (let s of zd) {
			let c = e[s];
			c !== u.current[s] && e[s] !== void 0 && (s === "nodes" ? t(c) : s === "edges" ? n(c) : s === "minZoom" ? r(c) : s === "maxZoom" ? i(c) : s === "translateExtent" ? a(c) : s === "nodeExtent" ? o(c) : s === "ariaLabelConfig" ? l.setState({ ariaLabelConfig: _l(c) }) : s === "fitView" ? l.setState({ fitViewQueued: c }) : s === "fitViewOptions" ? l.setState({ fitViewOptions: c }) : l.setState({ [s]: c }));
		}
		u.current = e;
	}, zd.map((t) => e[t])), null;
}
function Ud() {
	return typeof window > "u" || !window.matchMedia ? null : window.matchMedia("(prefers-color-scheme: dark)");
}
function Wd(e) {
	let [t, n] = (0, _.useState)(e === "system" ? null : e);
	return (0, _.useEffect)(() => {
		if (e !== "system") {
			n(e);
			return;
		}
		let t = Ud(), r = () => n(t?.matches ? "dark" : "light");
		return r(), t?.addEventListener("change", r), () => {
			t?.removeEventListener("change", r);
		};
	}, [e]), t === null ? Ud()?.matches ? "dark" : "light" : t;
}
var Gd = typeof document < "u" ? document : null;
function Kd(e = null, t = {
	target: Gd,
	actInsideInputWithModifier: !0
}) {
	let [n, r] = (0, _.useState)(!1), i = (0, _.useRef)(!1), a = (0, _.useRef)(/* @__PURE__ */ new Set([])), [o, s] = (0, _.useMemo)(() => {
		if (e !== null) {
			let t = (Array.isArray(e) ? e : [e]).filter((e) => typeof e == "string").map((e) => e.replace("+", "\n").replace("\n\n", "\n+").split("\n"));
			return [t, t.reduce((e, t) => e.concat(...t), [])];
		}
		return [[], []];
	}, [e]);
	return (0, _.useEffect)(() => {
		let n = t?.target ?? Gd, c = t?.actInsideInputWithModifier ?? !0;
		if (e !== null) {
			let e = (e) => {
				if (i.current = e.ctrlKey || e.metaKey || e.shiftKey || e.altKey, (!i.current || i.current && !c) && Sl(e)) return !1;
				let n = Jd(e.code, s);
				if (a.current.add(e[n]), qd(o, a.current, !1)) {
					let n = e.composedPath?.()?.[0] || e.target, a = n?.nodeName === "BUTTON" || n?.nodeName === "A";
					t.preventDefault !== !1 && (i.current || !a) && e.preventDefault(), r(!0);
				}
			}, l = (e) => {
				let t = Jd(e.code, s);
				qd(o, a.current, !0) ? (r(!1), a.current.clear()) : a.current.delete(e[t]), e.key === "Meta" && a.current.clear(), i.current = !1;
			}, u = () => {
				a.current.clear(), r(!1);
			};
			return n?.addEventListener("keydown", e), n?.addEventListener("keyup", l), window.addEventListener("blur", u), window.addEventListener("contextmenu", u), () => {
				n?.removeEventListener("keydown", e), n?.removeEventListener("keyup", l), window.removeEventListener("blur", u), window.removeEventListener("contextmenu", u);
			};
		}
	}, [e, r]), n;
}
function qd(e, t, n) {
	return e.filter((e) => n || e.length === t.size).some((e) => e.every((e) => t.has(e)));
}
function Jd(e, t) {
	return t.includes(e) ? "code" : "key";
}
var Yd = () => {
	let e = $();
	return (0, _.useMemo)(() => ({
		zoomIn: (t) => {
			let { panZoom: n } = e.getState();
			return n ? n.scaleBy(1.2, t) : Promise.resolve(!1);
		},
		zoomOut: (t) => {
			let { panZoom: n } = e.getState();
			return n ? n.scaleBy(1 / 1.2, t) : Promise.resolve(!1);
		},
		zoomTo: (t, n) => {
			let { panZoom: r } = e.getState();
			return r ? r.scaleTo(t, n) : Promise.resolve(!1);
		},
		getZoom: () => e.getState().transform[2],
		setViewport: async (t, n) => {
			let { transform: [r, i, a], panZoom: o } = e.getState();
			return o ? (await o.setViewport({
				x: t.x ?? r,
				y: t.y ?? i,
				zoom: t.zoom ?? a
			}, n), Promise.resolve(!0)) : Promise.resolve(!1);
		},
		getViewport: () => {
			let [t, n, r] = e.getState().transform;
			return {
				x: t,
				y: n,
				zoom: r
			};
		},
		setCenter: async (t, n, r) => e.getState().setCenter(t, n, r),
		fitBounds: async (t, n) => {
			let { width: r, height: i, minZoom: a, maxZoom: o, panZoom: s } = e.getState(), c = ll(t, r, i, a, o, n?.padding ?? .1);
			return s ? (await s.setViewport(c, {
				duration: n?.duration,
				ease: n?.ease,
				interpolate: n?.interpolate
			}), Promise.resolve(!0)) : Promise.resolve(!1);
		},
		screenToFlowPosition: (t, n = {}) => {
			let { transform: r, snapGrid: i, snapToGrid: a, domNode: o } = e.getState();
			if (!o) return t;
			let { x: s, y: c } = o.getBoundingClientRect(), l = {
				x: t.x - s,
				y: t.y - c
			}, u = n.snapGrid ?? i;
			return il(l, r, n.snapToGrid ?? a, u);
		},
		flowToScreenPosition: (t) => {
			let { transform: n, domNode: r } = e.getState();
			if (!r) return t;
			let { x: i, y: a } = r.getBoundingClientRect(), o = al(t, n);
			return {
				x: o.x + i,
				y: o.y + a
			};
		}
	}), []);
};
function Xd(e, t) {
	let n = [], r = /* @__PURE__ */ new Map(), i = [];
	for (let t of e) if (t.type === "add") {
		i.push(t);
		continue;
	} else if (t.type === "remove" || t.type === "replace") r.set(t.id, [t]);
	else {
		let e = r.get(t.id);
		e ? e.push(t) : r.set(t.id, [t]);
	}
	for (let e of t) {
		let t = r.get(e.id);
		if (!t) {
			n.push(e);
			continue;
		}
		if (t[0].type === "remove") continue;
		if (t[0].type === "replace") {
			n.push({ ...t[0].item });
			continue;
		}
		let i = { ...e };
		for (let e of t) Zd(e, i);
		n.push(i);
	}
	return i.length && i.forEach((e) => {
		e.index === void 0 ? n.push({ ...e.item }) : n.splice(e.index, 0, { ...e.item });
	}), n;
}
function Zd(e, t) {
	switch (e.type) {
		case "select":
			t.selected = e.selected;
			break;
		case "position":
			e.position !== void 0 && (t.position = e.position), e.dragging !== void 0 && (t.dragging = e.dragging);
			break;
		case "dimensions":
			e.dimensions !== void 0 && (t.measured = { ...e.dimensions }, e.setAttributes && ((e.setAttributes === !0 || e.setAttributes === "width") && (t.width = e.dimensions.width), (e.setAttributes === !0 || e.setAttributes === "height") && (t.height = e.dimensions.height))), typeof e.resizing == "boolean" && (t.resizing = e.resizing);
			break;
	}
}
function Qd(e, t) {
	return Xd(e, t);
}
function $d(e, t) {
	return Xd(e, t);
}
function ef(e, t) {
	return {
		id: e,
		type: "select",
		selected: t
	};
}
function tf(e, t = /* @__PURE__ */ new Set(), n = !1) {
	let r = [];
	for (let [i, a] of e) {
		let e = t.has(i);
		!(a.selected === void 0 && !e) && a.selected !== e && (n && (a.selected = e), r.push(ef(a.id, e)));
	}
	return r;
}
function nf({ items: e = [], lookup: t }) {
	let n = [], r = new Map(e.map((e) => [e.id, e]));
	for (let [r, i] of e.entries()) {
		let e = t.get(i.id), a = e?.internals?.userNode ?? e;
		a !== void 0 && a !== i && n.push({
			id: i.id,
			item: i,
			type: "replace"
		}), a === void 0 && n.push({
			item: i,
			type: "add",
			index: r
		});
	}
	for (let [e] of t) r.get(e) === void 0 && n.push({
		id: e,
		type: "remove"
	});
	return n;
}
function rf(e) {
	return {
		id: e.id,
		type: "remove"
	};
}
var af = (e) => jc(e), of = (e) => Ac(e);
function sf(e) {
	return (0, _.forwardRef)(e);
}
function cf(e) {
	let [t, n] = (0, _.useState)(BigInt(0)), [r] = (0, _.useState)(() => lf(() => n((e) => e + BigInt(1))));
	return Id(() => {
		let t = r.get();
		t.length && (e(t), r.reset());
	}, [t]), r;
}
function lf(e) {
	let t = [];
	return {
		get: () => t,
		reset: () => {
			t = [];
		},
		push: (n) => {
			t.push(n), e();
		}
	};
}
var uf = (0, _.createContext)(null);
function df({ children: e }) {
	let t = $(), n = cf((0, _.useCallback)((e) => {
		let { nodes: n = [], setNodes: r, hasDefaultNodes: i, onNodesChange: a, nodeLookup: o, fitViewQueued: s, onNodesChangeMiddlewareMap: c } = t.getState(), l = n;
		for (let t of e) l = typeof t == "function" ? t(l) : t;
		let u = nf({
			items: l,
			lookup: o
		});
		for (let e of c.values()) u = e(u);
		i && r(l), u.length > 0 ? a?.(u) : s && window.requestAnimationFrame(() => {
			let { fitViewQueued: e, nodes: n, setNodes: r } = t.getState();
			e && r(n);
		});
	}, [])), r = cf((0, _.useCallback)((e) => {
		let { edges: n = [], setEdges: r, hasDefaultEdges: i, onEdgesChange: a, edgeLookup: o } = t.getState(), s = n;
		for (let t of e) s = typeof t == "function" ? t(s) : t;
		i ? r(s) : a && a(nf({
			items: s,
			lookup: o
		}));
	}, [])), i = (0, _.useMemo)(() => ({
		nodeQueue: n,
		edgeQueue: r
	}), []);
	return (0, q.jsx)(uf.Provider, {
		value: i,
		children: e
	});
}
function ff() {
	let e = (0, _.useContext)(uf);
	if (!e) throw Error("useBatchContext must be used within a BatchProvider");
	return e;
}
var pf = (e) => !!e.panZoom;
function mf() {
	let e = Yd(), t = $(), n = ff(), r = Q(pf), i = (0, _.useMemo)(() => {
		let e = (e) => t.getState().nodeLookup.get(e), r = (e) => {
			n.nodeQueue.push(e);
		}, i = (e) => {
			n.edgeQueue.push(e);
		}, a = (e) => {
			let { nodeLookup: n, nodeOrigin: r } = t.getState(), i = af(e) ? e : n.get(e.id), a = i.parentId ? ml(i.position, i.measured, i.parentId, n, r) : i.position;
			return Xc({
				...i,
				position: a,
				width: i.measured?.width ?? i.width,
				height: i.measured?.height ?? i.height
			});
		}, o = (e, t, n = { replace: !1 }) => {
			r((r) => r.map((r) => {
				if (r.id === e) {
					let e = typeof t == "function" ? t(r) : t;
					return n.replace && af(e) ? e : {
						...r,
						...e
					};
				}
				return r;
			}));
		}, s = (e, t, n = { replace: !1 }) => {
			i((r) => r.map((r) => {
				if (r.id === e) {
					let e = typeof t == "function" ? t(r) : t;
					return n.replace && of(e) ? e : {
						...r,
						...e
					};
				}
				return r;
			}));
		};
		return {
			getNodes: () => t.getState().nodes.map((e) => ({ ...e })),
			getNode: (t) => e(t)?.internals.userNode,
			getInternalNode: e,
			getEdges: () => {
				let { edges: e = [] } = t.getState();
				return e.map((e) => ({ ...e }));
			},
			getEdge: (e) => t.getState().edgeLookup.get(e),
			setNodes: r,
			setEdges: i,
			addNodes: (e) => {
				let t = Array.isArray(e) ? e : [e];
				n.nodeQueue.push((e) => [...e, ...t]);
			},
			addEdges: (e) => {
				let t = Array.isArray(e) ? e : [e];
				n.edgeQueue.push((e) => [...e, ...t]);
			},
			toObject: () => {
				let { nodes: e = [], edges: n = [], transform: r } = t.getState(), [i, a, o] = r;
				return {
					nodes: e.map((e) => ({ ...e })),
					edges: n.map((e) => ({ ...e })),
					viewport: {
						x: i,
						y: a,
						zoom: o
					}
				};
			},
			deleteElements: async ({ nodes: e = [], edges: n = [] }) => {
				let { nodes: r, edges: i, onNodesDelete: a, onEdgesDelete: o, triggerNodeChanges: s, triggerEdgeChanges: c, onDelete: l, onBeforeDelete: u } = t.getState(), { nodes: d, edges: f } = await Vc({
					nodesToRemove: e,
					edgesToRemove: n,
					nodes: r,
					edges: i,
					onBeforeDelete: u
				}), p = f.length > 0, m = d.length > 0;
				if (p) {
					let e = f.map(rf);
					o?.(f), c(e);
				}
				if (m) {
					let e = d.map(rf);
					a?.(d), s(e);
				}
				return (m || p) && l?.({
					nodes: d,
					edges: f
				}), {
					deletedNodes: d,
					deletedEdges: f
				};
			},
			getIntersectingNodes: (e, n = !0, r) => {
				let i = el(e), o = i ? e : a(e), s = r !== void 0;
				return o ? (r || t.getState().nodes).filter((r) => {
					let a = t.getState().nodeLookup.get(r.id);
					if (a && !i && (r.id === e.id || !a.internals.positionAbsolute)) return !1;
					let c = Xc(s ? r : a), l = $c(c, o);
					return n && l > 0 || l >= c.width * c.height || l >= o.width * o.height;
				}) : [];
			},
			isNodeIntersecting: (e, t, n = !0) => {
				let r = el(e) ? e : a(e);
				if (!r) return !1;
				let i = $c(r, t);
				return n && i > 0 || i >= t.width * t.height || i >= r.width * r.height;
			},
			updateNode: o,
			updateNodeData: (e, t, n = { replace: !1 }) => {
				o(e, (e) => {
					let r = typeof t == "function" ? t(e) : t;
					return n.replace ? {
						...e,
						data: r
					} : {
						...e,
						data: {
							...e.data,
							...r
						}
					};
				}, n);
			},
			updateEdge: s,
			updateEdgeData: (e, t, n = { replace: !1 }) => {
				s(e, (e) => {
					let r = typeof t == "function" ? t(e) : t;
					return n.replace ? {
						...e,
						data: r
					} : {
						...e,
						data: {
							...e.data,
							...r
						}
					};
				}, n);
			},
			getNodesBounds: (e) => {
				let { nodeLookup: n, nodeOrigin: r } = t.getState();
				return Pc(e, {
					nodeLookup: n,
					nodeOrigin: r
				});
			},
			getHandleConnections: ({ type: e, id: n, nodeId: r }) => Array.from(t.getState().connectionLookup.get(`${r}-${e}${n ? `-${n}` : ""}`)?.values() ?? []),
			getNodeConnections: ({ type: e, handleId: n, nodeId: r }) => Array.from(t.getState().connectionLookup.get(`${r}${e ? n ? `-${e}-${n}` : `-${e}` : ""}`)?.values() ?? []),
			fitView: async (e) => {
				let r = t.getState().fitViewResolver ?? gl();
				return t.setState({
					fitViewQueued: !0,
					fitViewOptions: e,
					fitViewResolver: r
				}), n.nodeQueue.push((e) => [...e]), r.promise;
			}
		};
	}, []);
	return (0, _.useMemo)(() => ({
		...i,
		...e,
		viewportInitialized: r
	}), [r]);
}
var hf = (e) => e.selected, gf = typeof window < "u" ? window : void 0;
function _f({ deleteKeyCode: e, multiSelectionKeyCode: t }) {
	let n = $(), { deleteElements: r } = mf(), i = Kd(e, { actInsideInputWithModifier: !1 }), a = Kd(t, { target: gf });
	(0, _.useEffect)(() => {
		if (i) {
			let { edges: e, nodes: t } = n.getState();
			r({
				nodes: t.filter(hf),
				edges: e.filter(hf)
			}), n.setState({ nodesSelectionActive: !1 });
		}
	}, [i]), (0, _.useEffect)(() => {
		n.setState({ multiSelectionActive: a });
	}, [a]);
}
function vf(e) {
	let t = $();
	(0, _.useEffect)(() => {
		let n = () => {
			if (!e.current || !(e.current.checkVisibility?.() ?? !0)) return !1;
			let n = yl(e.current);
			(n.height === 0 || n.width === 0) && t.getState().onError?.("004", vc.error004()), t.setState({
				width: n.width || 500,
				height: n.height || 500
			});
		};
		if (e.current) {
			n(), window.addEventListener("resize", n);
			let t = new ResizeObserver(() => n());
			return t.observe(e.current), () => {
				window.removeEventListener("resize", n), t && e.current && t.unobserve(e.current);
			};
		}
	}, []);
}
var yf = {
	position: "absolute",
	width: "100%",
	height: "100%",
	top: 0,
	left: 0
}, bf = (e) => ({
	userSelectionActive: e.userSelectionActive,
	lib: e.lib,
	connectionInProgress: e.connection.inProgress
});
function xf({ onPaneContextMenu: e, zoomOnScroll: t = !0, zoomOnPinch: n = !0, panOnScroll: r = !1, panOnScrollSpeed: i = .5, panOnScrollMode: a = Cc.Free, zoomOnDoubleClick: o = !0, panOnDrag: s = !0, defaultViewport: c, translateExtent: l, minZoom: u, maxZoom: d, zoomActivationKeyCode: f, preventScrolling: p = !0, children: m, noWheelClassName: h, noPanClassName: g, onViewportChange: v, isControlledViewport: y, paneClickDistance: b, selectionOnDrag: x }) {
	let S = $(), C = (0, _.useRef)(null), { userSelectionActive: w, lib: T, connectionInProgress: E } = Q(bf, md), D = Kd(f), O = (0, _.useRef)();
	vf(C);
	let k = (0, _.useCallback)((e) => {
		v?.({
			x: e[0],
			y: e[1],
			zoom: e[2]
		}), y || S.setState({ transform: e });
	}, [v, y]);
	return (0, _.useEffect)(() => {
		if (C.current) {
			O.current = Hu({
				domNode: C.current,
				minZoom: u,
				maxZoom: d,
				translateExtent: l,
				viewport: c,
				onDraggingChange: (e) => S.setState((t) => t.paneDragging === e ? t : { paneDragging: e }),
				onPanZoomStart: (e, t) => {
					let { onViewportChangeStart: n, onMoveStart: r } = S.getState();
					r?.(e, t), n?.(t);
				},
				onPanZoom: (e, t) => {
					let { onViewportChange: n, onMove: r } = S.getState();
					r?.(e, t), n?.(t);
				},
				onPanZoomEnd: (e, t) => {
					let { onViewportChangeEnd: n, onMoveEnd: r } = S.getState();
					r?.(e, t), n?.(t);
				}
			});
			let { x: e, y: t, zoom: n } = O.current.getViewport();
			return S.setState({
				panZoom: O.current,
				transform: [
					e,
					t,
					n
				],
				domNode: C.current.closest(".react-flow")
			}), () => {
				O.current?.destroy();
			};
		}
	}, []), (0, _.useEffect)(() => {
		O.current?.update({
			onPaneContextMenu: e,
			zoomOnScroll: t,
			zoomOnPinch: n,
			panOnScroll: r,
			panOnScrollSpeed: i,
			panOnScrollMode: a,
			zoomOnDoubleClick: o,
			panOnDrag: s,
			zoomActivationKeyPressed: D,
			preventScrolling: p,
			noPanClassName: g,
			userSelectionActive: w,
			noWheelClassName: h,
			lib: T,
			onTransformChange: k,
			connectionInProgress: E,
			selectionOnDrag: x,
			paneClickDistance: b
		});
	}, [
		e,
		t,
		n,
		r,
		i,
		a,
		o,
		s,
		D,
		p,
		g,
		w,
		h,
		T,
		k,
		E,
		x,
		b
	]), (0, q.jsx)("div", {
		className: "react-flow__renderer",
		ref: C,
		style: yf,
		children: m
	});
}
var Sf = (e) => ({
	userSelectionActive: e.userSelectionActive,
	userSelectionRect: e.userSelectionRect
});
function Cf() {
	let { userSelectionActive: e, userSelectionRect: t } = Q(Sf, md);
	return e && t ? (0, q.jsx)("div", {
		className: "react-flow__selection react-flow__container",
		style: {
			width: t.width,
			height: t.height,
			transform: `translate(${t.x}px, ${t.y}px)`
		}
	}) : null;
}
var wf = (e, t) => (n) => {
	n.target === t.current && e?.(n);
}, Tf = (e) => ({
	userSelectionActive: e.userSelectionActive,
	elementsSelectable: e.elementsSelectable,
	connectionInProgress: e.connection.inProgress,
	dragging: e.paneDragging
});
function Ef({ isSelecting: e, selectionKeyPressed: t, selectionMode: n = wc.Full, panOnDrag: r, paneClickDistance: i, selectionOnDrag: a, onSelectionStart: o, onSelectionEnd: s, onPaneClick: c, onPaneContextMenu: l, onPaneScroll: u, onPaneMouseEnter: d, onPaneMouseMove: f, onPaneMouseLeave: p, children: m }) {
	let h = $(), { userSelectionActive: g, elementsSelectable: v, dragging: y, connectionInProgress: b } = Q(Tf, md), x = v && (e || g), S = (0, _.useRef)(null), C = (0, _.useRef)(), w = (0, _.useRef)(/* @__PURE__ */ new Set()), T = (0, _.useRef)(/* @__PURE__ */ new Set()), E = (0, _.useRef)(!1), D = (e) => {
		if (E.current || b) {
			E.current = !1;
			return;
		}
		c?.(e), h.getState().resetSelectedElements(), h.setState({ nodesSelectionActive: !1 });
	}, O = (e) => {
		if (Array.isArray(r) && r?.includes(2)) {
			e.preventDefault();
			return;
		}
		l?.(e);
	}, k = u ? (e) => u(e) : void 0;
	return (0, q.jsxs)("div", {
		className: Pn(["react-flow__pane", {
			draggable: r === !0 || Array.isArray(r) && r.includes(0),
			dragging: y,
			selection: e
		}]),
		onClick: x ? void 0 : wf(D, S),
		onContextMenu: wf(O, S),
		onWheel: wf(k, S),
		onPointerEnter: x ? void 0 : d,
		onPointerMove: x ? (e) => {
			let { userSelectionRect: r, transform: a, nodeLookup: s, edgeLookup: c, connectionLookup: l, triggerNodeChanges: u, triggerEdgeChanges: d, defaultEdgeOptions: f, resetSelectedElements: p } = h.getState();
			if (!C.current || !r) return;
			let { x: m, y: g } = wl(e.nativeEvent, C.current), { startX: _, startY: v } = r;
			if (!E.current) {
				let n = t ? 0 : i;
				if (Math.hypot(m - _, g - v) <= n) return;
				p(), o?.(e);
			}
			E.current = !0;
			let y = {
				startX: _,
				startY: v,
				x: m < _ ? m : _,
				y: g < v ? g : v,
				width: Math.abs(m - _),
				height: Math.abs(g - v)
			}, b = w.current, x = T.current;
			w.current = new Set(Ic(s, y, a, n === wc.Partial, !0).map((e) => e.id)), T.current = /* @__PURE__ */ new Set();
			let S = f?.selectable ?? !0;
			for (let e of w.current) {
				let t = l.get(e);
				if (t) for (let { edgeId: e } of t.values()) {
					let t = c.get(e);
					t && (t.selectable ?? S) && T.current.add(e);
				}
			}
			hl(b, w.current) || u(tf(s, w.current, !0)), hl(x, T.current) || d(tf(c, T.current)), h.setState({
				userSelectionRect: y,
				userSelectionActive: !0,
				nodesSelectionActive: !1
			});
		} : f,
		onPointerUp: x ? (e) => {
			e.button === 0 && (e.target?.releasePointerCapture?.(e.pointerId), !g && e.target === S.current && h.getState().userSelectionRect && D?.(e), h.setState({
				userSelectionActive: !1,
				userSelectionRect: null
			}), E.current && (s?.(e), h.setState({ nodesSelectionActive: w.current.size > 0 })));
		} : void 0,
		onPointerDownCapture: x ? (n) => {
			let { domNode: r } = h.getState();
			if (C.current = r?.getBoundingClientRect(), !C.current) return;
			let i = n.target === S.current;
			if (!i && n.target.closest(".nokey") || !e || !(a && i || t) || n.button !== 0 || !n.isPrimary) return;
			n.target?.setPointerCapture?.(n.pointerId), E.current = !1;
			let { x: o, y: s } = wl(n.nativeEvent, C.current);
			h.setState({ userSelectionRect: {
				width: 0,
				height: 0,
				startX: o,
				startY: s,
				x: o,
				y: s
			} }), i || (n.stopPropagation(), n.preventDefault());
		} : void 0,
		onClickCapture: x ? (e) => {
			E.current &&= (e.stopPropagation(), !1);
		} : void 0,
		onPointerLeave: p,
		ref: S,
		style: yf,
		children: [m, (0, q.jsx)(Cf, {})]
	});
}
function Df({ id: e, store: t, unselect: n = !1, nodeRef: r }) {
	let { addSelectedNodes: i, unselectNodesAndEdges: a, multiSelectionActive: o, nodeLookup: s, onError: c } = t.getState(), l = s.get(e);
	if (!l) {
		c?.("012", vc.error012(e));
		return;
	}
	t.setState({ nodesSelectionActive: !1 }), l.selected ? (n || l.selected && o) && (a({
		nodes: [l],
		edges: []
	}), requestAnimationFrame(() => r?.current?.blur())) : i([e]);
}
function Of({ nodeRef: e, disabled: t = !1, noDragClassName: n, handleSelector: r, nodeId: i, isSelectable: a, nodeClickDistance: o }) {
	let s = $(), [c, l] = (0, _.useState)(!1), u = (0, _.useRef)();
	return (0, _.useEffect)(() => {
		u.current = _u({
			getStoreItems: () => s.getState(),
			onNodeMouseDown: (t) => {
				Df({
					id: t,
					store: s,
					nodeRef: e
				});
			},
			onDragStart: () => {
				l(!0);
			},
			onDragStop: () => {
				l(!1);
			}
		});
	}, []), (0, _.useEffect)(() => {
		if (!(t || !e.current || !u.current)) return u.current.update({
			noDragClassName: n,
			handleSelector: r,
			domNode: e.current,
			isSelectable: a,
			nodeId: i,
			nodeClickDistance: o
		}), () => {
			u.current?.destroy();
		};
	}, [
		n,
		r,
		t,
		a,
		e,
		i,
		o
	]), c;
}
var kf = (e) => (t) => t.selected && (t.draggable || e && t.draggable === void 0);
function Af() {
	let e = $();
	return (0, _.useCallback)((t) => {
		let { nodeExtent: n, snapToGrid: r, snapGrid: i, nodesDraggable: a, onError: o, updateNodePositions: s, nodeLookup: c, nodeOrigin: l } = e.getState(), u = /* @__PURE__ */ new Map(), d = kf(a), f = r ? i[0] : 5, p = r ? i[1] : 5, m = t.direction.x * f * t.factor, h = t.direction.y * p * t.factor;
		for (let [, e] of c) {
			if (!d(e)) continue;
			let t = {
				x: e.internals.positionAbsolute.x + m,
				y: e.internals.positionAbsolute.y + h
			};
			r && (t = rl(t, i));
			let { position: a, positionAbsolute: s } = Bc({
				nodeId: e.id,
				nextPosition: t,
				nodeLookup: c,
				nodeExtent: n,
				nodeOrigin: l,
				onError: o
			});
			e.position = a, e.internals.positionAbsolute = s, u.set(e.id, e);
		}
		s(u);
	}, []);
}
var jf = (0, _.createContext)(null), Mf = jf.Provider;
jf.Consumer;
var Nf = () => (0, _.useContext)(jf), Pf = (e) => ({
	connectOnClick: e.connectOnClick,
	noPanClassName: e.noPanClassName,
	rfId: e.rfId
}), Ff = (e, t, n) => (r) => {
	let { connectionClickStartHandle: i, connectionMode: a, connection: o } = r, { fromHandle: s, toHandle: c, isValid: l } = o, u = c?.nodeId === e && c?.id === t && c?.type === n;
	return {
		connectingFrom: s?.nodeId === e && s?.id === t && s?.type === n,
		connectingTo: u,
		clickConnecting: i?.nodeId === e && i?.id === t && i?.type === n,
		isPossibleEndHandle: a === Sc.Strict ? s?.type !== n : e !== s?.nodeId || t !== s?.id,
		connectionInProcess: !!s,
		clickConnectionInProcess: !!i,
		valid: u && l
	};
};
function If({ type: e = "source", position: t = Y.Top, isValidConnection: n, isConnectable: r = !0, isConnectableStart: i = !0, isConnectableEnd: a = !0, id: o, onConnect: s, children: c, className: l, onMouseDown: u, onTouchStart: d, ...f }, p) {
	let m = o || null, h = e === "target", g = $(), _ = Nf(), { connectOnClick: v, noPanClassName: y, rfId: b } = Q(Pf, md), { connectingFrom: x, connectingTo: S, clickConnecting: C, isPossibleEndHandle: w, connectionInProcess: T, clickConnectionInProcess: E, valid: D } = Q(Ff(_, m, e), md);
	_ || g.getState().onError?.("010", vc.error010());
	let O = (e) => {
		let { defaultEdgeOptions: t, onConnect: n, hasDefaultEdges: r } = g.getState(), i = {
			...t,
			...e
		};
		if (r) {
			let { edges: e, setEdges: t } = g.getState();
			t(Fl(i, e));
		}
		n?.(i), s?.(i);
	}, k = (e) => {
		if (!_) return;
		let t = Cl(e.nativeEvent);
		if (i && (t && e.button === 0 || !t)) {
			let t = g.getState();
			Du.onPointerDown(e.nativeEvent, {
				handleDomNode: e.currentTarget,
				autoPanOnConnect: t.autoPanOnConnect,
				connectionMode: t.connectionMode,
				connectionRadius: t.connectionRadius,
				domNode: t.domNode,
				nodeLookup: t.nodeLookup,
				lib: t.lib,
				isTarget: h,
				handleId: m,
				nodeId: _,
				flowId: t.rfId,
				panBy: t.panBy,
				cancelConnection: t.cancelConnection,
				onConnectStart: t.onConnectStart,
				onConnectEnd: (...e) => g.getState().onConnectEnd?.(...e),
				updateConnection: t.updateConnection,
				onConnect: O,
				isValidConnection: n || ((...e) => g.getState().isValidConnection?.(...e) ?? !0),
				getTransform: () => g.getState().transform,
				getFromHandle: () => g.getState().connection.fromHandle,
				autoPanSpeed: t.autoPanSpeed,
				dragThreshold: t.connectionDragThreshold
			});
		}
		t ? u?.(e) : d?.(e);
	};
	return (0, q.jsx)("div", {
		"data-handleid": m,
		"data-nodeid": _,
		"data-handlepos": t,
		"data-id": `${b}-${_}-${m}-${e}`,
		className: Pn([
			"react-flow__handle",
			`react-flow__handle-${t}`,
			"nodrag",
			y,
			l,
			{
				source: !h,
				target: h,
				connectable: r,
				connectablestart: i,
				connectableend: a,
				clickconnecting: C,
				connectingfrom: x,
				connectingto: S,
				valid: D,
				connectionindicator: r && (!T || w) && (T || E ? a : i)
			}
		]),
		onMouseDown: k,
		onTouchStart: k,
		onClick: v ? (t) => {
			let { onClickConnectStart: r, onClickConnectEnd: a, connectionClickStartHandle: o, connectionMode: s, isValidConnection: c, lib: l, rfId: u, nodeLookup: d, connection: f } = g.getState();
			if (!_ || !o && !i) return;
			if (!o) {
				r?.(t.nativeEvent, {
					nodeId: _,
					handleId: m,
					handleType: e
				}), g.setState({ connectionClickStartHandle: {
					nodeId: _,
					type: e,
					id: m
				} });
				return;
			}
			let p = bl(t.target), h = n || c, { connection: v, isValid: y } = Du.isValid(t.nativeEvent, {
				handle: {
					nodeId: _,
					id: m,
					type: e
				},
				connectionMode: s,
				fromNodeId: o.nodeId,
				fromHandleId: o.id || null,
				fromType: o.type,
				isValidConnection: h,
				flowId: u,
				doc: p,
				lib: l,
				nodeLookup: d
			});
			y && v && O(v);
			let b = structuredClone(f);
			delete b.inProgress, b.toPosition = b.toHandle ? b.toHandle.position : null, a?.(t, b), g.setState({ connectionClickStartHandle: null });
		} : void 0,
		ref: p,
		...f,
		children: c
	});
}
var Lf = (0, _.memo)(sf(If));
function Rf({ data: e, isConnectable: t, sourcePosition: n = Y.Bottom }) {
	return (0, q.jsxs)(q.Fragment, { children: [e?.label, (0, q.jsx)(Lf, {
		type: "source",
		position: n,
		isConnectable: t
	})] });
}
function zf({ data: e, isConnectable: t, targetPosition: n = Y.Top, sourcePosition: r = Y.Bottom }) {
	return (0, q.jsxs)(q.Fragment, { children: [
		(0, q.jsx)(Lf, {
			type: "target",
			position: n,
			isConnectable: t
		}),
		e?.label,
		(0, q.jsx)(Lf, {
			type: "source",
			position: r,
			isConnectable: t
		})
	] });
}
function Bf() {
	return null;
}
function Vf({ data: e, isConnectable: t, targetPosition: n = Y.Top }) {
	return (0, q.jsxs)(q.Fragment, { children: [(0, q.jsx)(Lf, {
		type: "target",
		position: n,
		isConnectable: t
	}), e?.label] });
}
var Hf = {
	ArrowUp: {
		x: 0,
		y: -1
	},
	ArrowDown: {
		x: 0,
		y: 1
	},
	ArrowLeft: {
		x: -1,
		y: 0
	},
	ArrowRight: {
		x: 1,
		y: 0
	}
}, Uf = {
	input: Rf,
	default: zf,
	output: Vf,
	group: Bf
};
function Wf(e) {
	return e.internals.handleBounds === void 0 ? {
		width: e.width ?? e.initialWidth ?? e.style?.width,
		height: e.height ?? e.initialHeight ?? e.style?.height
	} : {
		width: e.width ?? e.style?.width,
		height: e.height ?? e.style?.height
	};
}
var Gf = (e) => {
	let { width: t, height: n, x: r, y: i } = Fc(e.nodeLookup, { filter: (e) => !!e.selected });
	return {
		width: tl(t) ? t : null,
		height: tl(n) ? n : null,
		userSelectionActive: e.userSelectionActive,
		transformString: `translate(${e.transform[0]}px,${e.transform[1]}px) scale(${e.transform[2]}) translate(${r}px,${i}px)`
	};
};
function Kf({ onSelectionContextMenu: e, noPanClassName: t, disableKeyboardA11y: n }) {
	let r = $(), { width: i, height: a, transformString: o, userSelectionActive: s } = Q(Gf, md), c = Af(), l = (0, _.useRef)(null);
	(0, _.useEffect)(() => {
		n || l.current?.focus({ preventScroll: !0 });
	}, [n]);
	let u = !s && i !== null && a !== null;
	if (Of({
		nodeRef: l,
		disabled: !u
	}), !u) return null;
	let d = e ? (t) => {
		e(t, r.getState().nodes.filter((e) => e.selected));
	} : void 0;
	return (0, q.jsx)("div", {
		className: Pn([
			"react-flow__nodesselection",
			"react-flow__container",
			t
		]),
		style: { transform: o },
		children: (0, q.jsx)("div", {
			ref: l,
			className: "react-flow__nodesselection-rect",
			onContextMenu: d,
			tabIndex: n ? void 0 : -1,
			onKeyDown: n ? void 0 : (e) => {
				Object.prototype.hasOwnProperty.call(Hf, e.key) && (e.preventDefault(), c({
					direction: Hf[e.key],
					factor: e.shiftKey ? 4 : 1
				}));
			},
			style: {
				width: i,
				height: a
			}
		})
	});
}
var qf = typeof window < "u" ? window : void 0, Jf = (e) => ({
	nodesSelectionActive: e.nodesSelectionActive,
	userSelectionActive: e.userSelectionActive
});
function Yf({ children: e, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: r, onPaneMouseLeave: i, onPaneContextMenu: a, onPaneScroll: o, paneClickDistance: s, deleteKeyCode: c, selectionKeyCode: l, selectionOnDrag: u, selectionMode: d, onSelectionStart: f, onSelectionEnd: p, multiSelectionKeyCode: m, panActivationKeyCode: h, zoomActivationKeyCode: g, elementsSelectable: _, zoomOnScroll: v, zoomOnPinch: y, panOnScroll: b, panOnScrollSpeed: x, panOnScrollMode: S, zoomOnDoubleClick: C, panOnDrag: w, defaultViewport: T, translateExtent: E, minZoom: D, maxZoom: O, preventScrolling: k, onSelectionContextMenu: A, noWheelClassName: j, noPanClassName: M, disableKeyboardA11y: N, onViewportChange: P, isControlledViewport: F }) {
	let { nodesSelectionActive: I, userSelectionActive: L } = Q(Jf, md), R = Kd(l, { target: qf }), ee = Kd(h, { target: qf }), te = ee || w, z = ee || b, B = u && te !== !0, V = R || L || B;
	return _f({
		deleteKeyCode: c,
		multiSelectionKeyCode: m
	}), (0, q.jsx)(xf, {
		onPaneContextMenu: a,
		elementsSelectable: _,
		zoomOnScroll: v,
		zoomOnPinch: y,
		panOnScroll: z,
		panOnScrollSpeed: x,
		panOnScrollMode: S,
		zoomOnDoubleClick: C,
		panOnDrag: !R && te,
		defaultViewport: T,
		translateExtent: E,
		minZoom: D,
		maxZoom: O,
		zoomActivationKeyCode: g,
		preventScrolling: k,
		noWheelClassName: j,
		noPanClassName: M,
		onViewportChange: P,
		isControlledViewport: F,
		paneClickDistance: s,
		selectionOnDrag: B,
		children: (0, q.jsxs)(Ef, {
			onSelectionStart: f,
			onSelectionEnd: p,
			onPaneClick: t,
			onPaneMouseEnter: n,
			onPaneMouseMove: r,
			onPaneMouseLeave: i,
			onPaneContextMenu: a,
			onPaneScroll: o,
			panOnDrag: te,
			isSelecting: !!V,
			selectionMode: d,
			selectionKeyPressed: R,
			paneClickDistance: s,
			selectionOnDrag: B,
			children: [e, I && (0, q.jsx)(Kf, {
				onSelectionContextMenu: A,
				noPanClassName: M,
				disableKeyboardA11y: N
			})]
		})
	});
}
Yf.displayName = "FlowRenderer";
var Xf = (0, _.memo)(Yf), Zf = (e) => (t) => e ? Ic(t.nodeLookup, {
	x: 0,
	y: 0,
	width: t.width,
	height: t.height
}, t.transform, !0).map((e) => e.id) : Array.from(t.nodeLookup.keys());
function Qf(e) {
	return Q((0, _.useCallback)(Zf(e), [e]), md);
}
var $f = (e) => e.updateNodeInternals;
function ep() {
	let e = Q($f), [t] = (0, _.useState)(() => typeof ResizeObserver > "u" ? null : new ResizeObserver((t) => {
		let n = /* @__PURE__ */ new Map();
		t.forEach((e) => {
			let t = e.target.getAttribute("data-id");
			n.set(t, {
				id: t,
				nodeElement: e.target,
				force: !0
			});
		}), e(n);
	}));
	return (0, _.useEffect)(() => () => {
		t?.disconnect();
	}, [t]), t;
}
function tp({ node: e, nodeType: t, hasDimensions: n, resizeObserver: r }) {
	let i = $(), a = (0, _.useRef)(null), o = (0, _.useRef)(null), s = (0, _.useRef)(e.sourcePosition), c = (0, _.useRef)(e.targetPosition), l = (0, _.useRef)(t), u = n && !!e.internals.handleBounds;
	return (0, _.useEffect)(() => {
		a.current && !e.hidden && (!u || o.current !== a.current) && (o.current && r?.unobserve(o.current), r?.observe(a.current), o.current = a.current);
	}, [u, e.hidden]), (0, _.useEffect)(() => () => {
		o.current &&= (r?.unobserve(o.current), null);
	}, []), (0, _.useEffect)(() => {
		if (a.current) {
			let n = l.current !== t, r = s.current !== e.sourcePosition, o = c.current !== e.targetPosition;
			(n || r || o) && (l.current = t, s.current = e.sourcePosition, c.current = e.targetPosition, i.getState().updateNodeInternals(new Map([[e.id, {
				id: e.id,
				nodeElement: a.current,
				force: !0
			}]])));
		}
	}, [
		e.id,
		t,
		e.sourcePosition,
		e.targetPosition
	]), a;
}
function np({ id: e, onClick: t, onMouseEnter: n, onMouseMove: r, onMouseLeave: i, onContextMenu: a, onDoubleClick: o, nodesDraggable: s, elementsSelectable: c, nodesConnectable: l, nodesFocusable: u, resizeObserver: d, noDragClassName: f, noPanClassName: p, disableKeyboardA11y: m, rfId: h, nodeTypes: g, nodeClickDistance: _, onError: v }) {
	let { node: y, internals: b, isParent: x } = Q((t) => {
		let n = t.nodeLookup.get(e), r = t.parentLookup.has(e);
		return {
			node: n,
			internals: n.internals,
			isParent: r
		};
	}, md), S = y.type || "default", C = g?.[S] || Uf[S];
	C === void 0 && (v?.("003", vc.error003(S)), S = "default", C = g?.default || Uf.default);
	let w = !!(y.draggable || s && y.draggable === void 0), T = !!(y.selectable || c && y.selectable === void 0), E = !!(y.connectable || l && y.connectable === void 0), D = !!(y.focusable || u && y.focusable === void 0), O = $(), k = pl(y), A = tp({
		node: y,
		nodeType: S,
		hasDimensions: k,
		resizeObserver: d
	}), j = Of({
		nodeRef: A,
		disabled: y.hidden || !w,
		noDragClassName: f,
		handleSelector: y.dragHandle,
		nodeId: e,
		isSelectable: T,
		nodeClickDistance: _
	}), M = Af();
	if (y.hidden) return null;
	let N = fl(y), P = Wf(y), F = T || w || t || n || r || i, I = n ? (e) => n(e, { ...b.userNode }) : void 0, L = r ? (e) => r(e, { ...b.userNode }) : void 0, R = i ? (e) => i(e, { ...b.userNode }) : void 0, ee = a ? (e) => a(e, { ...b.userNode }) : void 0, te = o ? (e) => o(e, { ...b.userNode }) : void 0, z = (n) => {
		let { selectNodesOnDrag: r, nodeDragThreshold: i } = O.getState();
		T && (!r || !w || i > 0) && Df({
			id: e,
			store: O,
			nodeRef: A
		}), t && t(n, { ...b.userNode });
	}, B = (t) => {
		if (!(Sl(t.nativeEvent) || m)) {
			if (bc.includes(t.key) && T) Df({
				id: e,
				store: O,
				unselect: t.key === "Escape",
				nodeRef: A
			});
			else if (w && y.selected && Object.prototype.hasOwnProperty.call(Hf, t.key)) {
				t.preventDefault();
				let { ariaLabelConfig: e } = O.getState();
				O.setState({ ariaLiveMessage: e["node.a11yDescription.ariaLiveMessage"]({
					direction: t.key.replace("Arrow", "").toLowerCase(),
					x: ~~b.positionAbsolute.x,
					y: ~~b.positionAbsolute.y
				}) }), M({
					direction: Hf[t.key],
					factor: t.shiftKey ? 4 : 1
				});
			}
		}
	}, V = () => {
		if (m || !A.current?.matches(":focus-visible")) return;
		let { transform: t, width: n, height: r, autoPanOnNodeFocus: i, setCenter: a } = O.getState();
		i && (Ic(new Map([[e, y]]), {
			x: 0,
			y: 0,
			width: n,
			height: r
		}, t, !0).length > 0 || a(y.position.x + N.width / 2, y.position.y + N.height / 2, { zoom: t[2] }));
	};
	return (0, q.jsx)("div", {
		className: Pn([
			"react-flow__node",
			`react-flow__node-${S}`,
			{ [p]: w },
			y.className,
			{
				selected: y.selected,
				selectable: T,
				parent: x,
				draggable: w,
				dragging: j
			}
		]),
		ref: A,
		style: {
			zIndex: b.z,
			transform: `translate(${b.positionAbsolute.x}px,${b.positionAbsolute.y}px)`,
			pointerEvents: F ? "all" : "none",
			visibility: k ? "visible" : "hidden",
			...y.style,
			...P
		},
		"data-id": e,
		"data-testid": `rf__node-${e}`,
		onMouseEnter: I,
		onMouseMove: L,
		onMouseLeave: R,
		onContextMenu: ee,
		onClick: z,
		onDoubleClick: te,
		onKeyDown: D ? B : void 0,
		tabIndex: D ? 0 : void 0,
		onFocus: D ? V : void 0,
		role: y.ariaRole ?? (D ? "group" : void 0),
		"aria-roledescription": "node",
		"aria-describedby": m ? void 0 : `${xd}-${h}`,
		"aria-label": y.ariaLabel,
		...y.domAttributes,
		children: (0, q.jsx)(Mf, {
			value: e,
			children: (0, q.jsx)(C, {
				id: e,
				data: y.data,
				type: S,
				positionAbsoluteX: b.positionAbsolute.x,
				positionAbsoluteY: b.positionAbsolute.y,
				selected: y.selected ?? !1,
				selectable: T,
				draggable: w,
				deletable: y.deletable ?? !0,
				isConnectable: E,
				sourcePosition: y.sourcePosition,
				targetPosition: y.targetPosition,
				dragging: j,
				dragHandle: y.dragHandle,
				zIndex: b.z,
				parentId: y.parentId,
				...N
			})
		})
	});
}
var rp = (0, _.memo)(np), ip = (e) => ({
	nodesDraggable: e.nodesDraggable,
	nodesConnectable: e.nodesConnectable,
	nodesFocusable: e.nodesFocusable,
	elementsSelectable: e.elementsSelectable,
	onError: e.onError
});
function ap(e) {
	let { nodesDraggable: t, nodesConnectable: n, nodesFocusable: r, elementsSelectable: i, onError: a } = Q(ip, md), o = Qf(e.onlyRenderVisibleElements), s = ep();
	return (0, q.jsx)("div", {
		className: "react-flow__nodes",
		style: yf,
		children: o.map((o) => (0, q.jsx)(rp, {
			id: o,
			nodeTypes: e.nodeTypes,
			nodeExtent: e.nodeExtent,
			onClick: e.onNodeClick,
			onMouseEnter: e.onNodeMouseEnter,
			onMouseMove: e.onNodeMouseMove,
			onMouseLeave: e.onNodeMouseLeave,
			onContextMenu: e.onNodeContextMenu,
			onDoubleClick: e.onNodeDoubleClick,
			noDragClassName: e.noDragClassName,
			noPanClassName: e.noPanClassName,
			rfId: e.rfId,
			disableKeyboardA11y: e.disableKeyboardA11y,
			resizeObserver: s,
			nodesDraggable: t,
			nodesConnectable: n,
			nodesFocusable: r,
			elementsSelectable: i,
			nodeClickDistance: e.nodeClickDistance,
			onError: a
		}, o))
	});
}
ap.displayName = "NodeRenderer";
var op = (0, _.memo)(ap);
function sp(e) {
	return Q((0, _.useCallback)((t) => {
		if (!e) return t.edges.map((e) => e.id);
		let n = [];
		if (t.width && t.height) for (let e of t.edges) {
			let r = t.nodeLookup.get(e.source), i = t.nodeLookup.get(e.target);
			r && i && Ml({
				sourceNode: r,
				targetNode: i,
				width: t.width,
				height: t.height,
				transform: t.transform
			}) && n.push(e.id);
		}
		return n;
	}, [e]), md);
}
var cp = ({ color: e = "none", strokeWidth: t = 1 }) => (0, q.jsx)("polyline", {
	className: "arrow",
	style: {
		strokeWidth: t,
		...e && { stroke: e }
	},
	strokeLinecap: "round",
	fill: "none",
	strokeLinejoin: "round",
	points: "-5,-4 0,0 -5,4"
}), lp = ({ color: e = "none", strokeWidth: t = 1 }) => (0, q.jsx)("polyline", {
	className: "arrowclosed",
	style: {
		strokeWidth: t,
		...e && {
			stroke: e,
			fill: e
		}
	},
	strokeLinecap: "round",
	strokeLinejoin: "round",
	points: "-5,-4 0,0 -5,4 -5,-4"
}), up = {
	[Dc.Arrow]: cp,
	[Dc.ArrowClosed]: lp
};
function dp(e) {
	let t = $();
	return (0, _.useMemo)(() => Object.prototype.hasOwnProperty.call(up, e) ? up[e] : (t.getState().onError?.("009", vc.error009(e)), null), [e]);
}
var fp = ({ id: e, type: t, color: n, width: r = 12.5, height: i = 12.5, markerUnits: a = "strokeWidth", strokeWidth: o, orient: s = "auto-start-reverse" }) => {
	let c = dp(t);
	return c ? (0, q.jsx)("marker", {
		className: "react-flow__arrowhead",
		id: e,
		markerWidth: `${r}`,
		markerHeight: `${i}`,
		viewBox: "-10 -10 20 20",
		markerUnits: a,
		orient: s,
		refX: "0",
		refY: "0",
		children: (0, q.jsx)(c, {
			color: n,
			strokeWidth: o
		})
	}) : null;
}, pp = ({ defaultColor: e, rfId: t }) => {
	let n = Q((e) => e.edges), r = Q((e) => e.defaultEdgeOptions), i = (0, _.useMemo)(() => ql(n, {
		id: t,
		defaultColor: e,
		defaultMarkerStart: r?.markerStart,
		defaultMarkerEnd: r?.markerEnd
	}), [
		n,
		r,
		t,
		e
	]);
	return i.length ? (0, q.jsx)("svg", {
		className: "react-flow__marker",
		"aria-hidden": "true",
		children: (0, q.jsx)("defs", { children: i.map((e) => (0, q.jsx)(fp, {
			id: e.id,
			type: e.type,
			color: e.color,
			width: e.width,
			height: e.height,
			markerUnits: e.markerUnits,
			strokeWidth: e.strokeWidth,
			orient: e.orient
		}, e.id)) })
	}) : null;
};
pp.displayName = "MarkerDefinitions";
var mp = (0, _.memo)(pp);
function hp({ x: e, y: t, label: n, labelStyle: r, labelShowBg: i = !0, labelBgStyle: a, labelBgPadding: o = [2, 4], labelBgBorderRadius: s = 2, children: c, className: l, ...u }) {
	let [d, f] = (0, _.useState)({
		x: 1,
		y: 0,
		width: 0,
		height: 0
	}), p = Pn(["react-flow__edge-textwrapper", l]), m = (0, _.useRef)(null);
	return (0, _.useEffect)(() => {
		if (m.current) {
			let e = m.current.getBBox();
			f({
				x: e.x,
				y: e.y,
				width: e.width,
				height: e.height
			});
		}
	}, [n]), n ? (0, q.jsxs)("g", {
		transform: `translate(${e - d.width / 2} ${t - d.height / 2})`,
		className: p,
		visibility: d.width ? "visible" : "hidden",
		...u,
		children: [
			i && (0, q.jsx)("rect", {
				width: d.width + 2 * o[0],
				x: -o[0],
				y: -o[1],
				height: d.height + 2 * o[1],
				className: "react-flow__edge-textbg",
				style: a,
				rx: s,
				ry: s
			}),
			(0, q.jsx)("text", {
				className: "react-flow__edge-text",
				y: d.height / 2,
				dy: "0.3em",
				ref: m,
				style: r,
				children: n
			}),
			c
		]
	}) : null;
}
hp.displayName = "EdgeText";
var gp = (0, _.memo)(hp);
function _p({ path: e, labelX: t, labelY: n, label: r, labelStyle: i, labelShowBg: a, labelBgStyle: o, labelBgPadding: s, labelBgBorderRadius: c, interactionWidth: l = 20, ...u }) {
	return (0, q.jsxs)(q.Fragment, { children: [
		(0, q.jsx)("path", {
			...u,
			d: e,
			fill: "none",
			className: Pn(["react-flow__edge-path", u.className])
		}),
		l ? (0, q.jsx)("path", {
			d: e,
			fill: "none",
			strokeOpacity: 0,
			strokeWidth: l,
			className: "react-flow__edge-interaction"
		}) : null,
		r && tl(t) && tl(n) ? (0, q.jsx)(gp, {
			x: t,
			y: n,
			label: r,
			labelStyle: i,
			labelShowBg: a,
			labelBgStyle: o,
			labelBgPadding: s,
			labelBgBorderRadius: c
		}) : null
	] });
}
function vp({ pos: e, x1: t, y1: n, x2: r, y2: i }) {
	return e === Y.Left || e === Y.Right ? [.5 * (t + r), n] : [t, .5 * (n + i)];
}
function yp({ sourceX: e, sourceY: t, sourcePosition: n = Y.Bottom, targetX: r, targetY: i, targetPosition: a = Y.Top }) {
	let [o, s] = vp({
		pos: n,
		x1: e,
		y1: t,
		x2: r,
		y2: i
	}), [c, l] = vp({
		pos: a,
		x1: r,
		y1: i,
		x2: e,
		y2: t
	}), [u, d, f, p] = El({
		sourceX: e,
		sourceY: t,
		targetX: r,
		targetY: i,
		sourceControlX: o,
		sourceControlY: s,
		targetControlX: c,
		targetControlY: l
	});
	return [
		`M${e},${t} C${o},${s} ${c},${l} ${r},${i}`,
		u,
		d,
		f,
		p
	];
}
function bp(e) {
	return (0, _.memo)(({ id: t, sourceX: n, sourceY: r, targetX: i, targetY: a, sourcePosition: o, targetPosition: s, label: c, labelStyle: l, labelShowBg: u, labelBgStyle: d, labelBgPadding: f, labelBgBorderRadius: p, style: m, markerEnd: h, markerStart: g, interactionWidth: _ }) => {
		let [v, y, b] = yp({
			sourceX: n,
			sourceY: r,
			sourcePosition: o,
			targetX: i,
			targetY: a,
			targetPosition: s
		});
		return (0, q.jsx)(_p, {
			id: e.isInternal ? void 0 : t,
			path: v,
			labelX: y,
			labelY: b,
			label: c,
			labelStyle: l,
			labelShowBg: u,
			labelBgStyle: d,
			labelBgPadding: f,
			labelBgBorderRadius: p,
			style: m,
			markerEnd: h,
			markerStart: g,
			interactionWidth: _
		});
	});
}
var xp = bp({ isInternal: !1 }), Sp = bp({ isInternal: !0 });
xp.displayName = "SimpleBezierEdge", Sp.displayName = "SimpleBezierEdgeInternal";
function Cp(e) {
	return (0, _.memo)(({ id: t, sourceX: n, sourceY: r, targetX: i, targetY: a, label: o, labelStyle: s, labelShowBg: c, labelBgStyle: l, labelBgPadding: u, labelBgBorderRadius: d, style: f, sourcePosition: p = Y.Bottom, targetPosition: m = Y.Top, markerEnd: h, markerStart: g, pathOptions: _, interactionWidth: v }) => {
		let [y, b, x] = Bl({
			sourceX: n,
			sourceY: r,
			sourcePosition: p,
			targetX: i,
			targetY: a,
			targetPosition: m,
			borderRadius: _?.borderRadius,
			offset: _?.offset,
			stepPosition: _?.stepPosition
		});
		return (0, q.jsx)(_p, {
			id: e.isInternal ? void 0 : t,
			path: y,
			labelX: b,
			labelY: x,
			label: o,
			labelStyle: s,
			labelShowBg: c,
			labelBgStyle: l,
			labelBgPadding: u,
			labelBgBorderRadius: d,
			style: f,
			markerEnd: h,
			markerStart: g,
			interactionWidth: v
		});
	});
}
var wp = Cp({ isInternal: !1 }), Tp = Cp({ isInternal: !0 });
wp.displayName = "SmoothStepEdge", Tp.displayName = "SmoothStepEdgeInternal";
function Ep(e) {
	return (0, _.memo)(({ id: t, ...n }) => {
		let r = e.isInternal ? void 0 : t;
		return (0, q.jsx)(wp, {
			...n,
			id: r,
			pathOptions: (0, _.useMemo)(() => ({
				borderRadius: 0,
				offset: n.pathOptions?.offset
			}), [n.pathOptions?.offset])
		});
	});
}
var Dp = Ep({ isInternal: !1 }), Op = Ep({ isInternal: !0 });
Dp.displayName = "StepEdge", Op.displayName = "StepEdgeInternal";
function kp(e) {
	return (0, _.memo)(({ id: t, sourceX: n, sourceY: r, targetX: i, targetY: a, label: o, labelStyle: s, labelShowBg: c, labelBgStyle: l, labelBgPadding: u, labelBgBorderRadius: d, style: f, markerEnd: p, markerStart: m, interactionWidth: h }) => {
		let [g, _, v] = Il({
			sourceX: n,
			sourceY: r,
			targetX: i,
			targetY: a
		});
		return (0, q.jsx)(_p, {
			id: e.isInternal ? void 0 : t,
			path: g,
			labelX: _,
			labelY: v,
			label: o,
			labelStyle: s,
			labelShowBg: c,
			labelBgStyle: l,
			labelBgPadding: u,
			labelBgBorderRadius: d,
			style: f,
			markerEnd: p,
			markerStart: m,
			interactionWidth: h
		});
	});
}
var Ap = kp({ isInternal: !1 }), jp = kp({ isInternal: !0 });
Ap.displayName = "StraightEdge", jp.displayName = "StraightEdgeInternal";
function Mp(e) {
	return (0, _.memo)(({ id: t, sourceX: n, sourceY: r, targetX: i, targetY: a, sourcePosition: o = Y.Bottom, targetPosition: s = Y.Top, label: c, labelStyle: l, labelShowBg: u, labelBgStyle: d, labelBgPadding: f, labelBgBorderRadius: p, style: m, markerEnd: h, markerStart: g, pathOptions: _, interactionWidth: v }) => {
		let [y, b, x] = kl({
			sourceX: n,
			sourceY: r,
			sourcePosition: o,
			targetX: i,
			targetY: a,
			targetPosition: s,
			curvature: _?.curvature
		});
		return (0, q.jsx)(_p, {
			id: e.isInternal ? void 0 : t,
			path: y,
			labelX: b,
			labelY: x,
			label: c,
			labelStyle: l,
			labelShowBg: u,
			labelBgStyle: d,
			labelBgPadding: f,
			labelBgBorderRadius: p,
			style: m,
			markerEnd: h,
			markerStart: g,
			interactionWidth: v
		});
	});
}
var Np = Mp({ isInternal: !1 }), Pp = Mp({ isInternal: !0 });
Np.displayName = "BezierEdge", Pp.displayName = "BezierEdgeInternal";
var Fp = {
	default: Pp,
	straight: jp,
	step: Op,
	smoothstep: Tp,
	simplebezier: Sp
}, Ip = {
	sourceX: null,
	sourceY: null,
	targetX: null,
	targetY: null,
	sourcePosition: null,
	targetPosition: null
}, Lp = (e, t, n) => n === Y.Left ? e - t : n === Y.Right ? e + t : e, Rp = (e, t, n) => n === Y.Top ? e - t : n === Y.Bottom ? e + t : e, zp = "react-flow__edgeupdater";
function Bp({ position: e, centerX: t, centerY: n, radius: r = 10, onMouseDown: i, onMouseEnter: a, onMouseOut: o, type: s }) {
	return (0, q.jsx)("circle", {
		onMouseDown: i,
		onMouseEnter: a,
		onMouseOut: o,
		className: Pn([zp, `${zp}-${s}`]),
		cx: Lp(t, r, e),
		cy: Rp(n, r, e),
		r,
		stroke: "transparent",
		fill: "transparent"
	});
}
function Vp({ isReconnectable: e, reconnectRadius: t, edge: n, sourceX: r, sourceY: i, targetX: a, targetY: o, sourcePosition: s, targetPosition: c, onReconnect: l, onReconnectStart: u, onReconnectEnd: d, setReconnecting: f, setUpdateHover: p }) {
	let m = $(), h = (e, t) => {
		if (e.button !== 0) return;
		let { autoPanOnConnect: r, domNode: i, connectionMode: a, connectionRadius: o, lib: s, onConnectStart: c, cancelConnection: p, nodeLookup: h, rfId: g, panBy: _, updateConnection: v } = m.getState(), y = t.type === "target";
		Du.onPointerDown(e.nativeEvent, {
			autoPanOnConnect: r,
			connectionMode: a,
			connectionRadius: o,
			domNode: i,
			handleId: t.id,
			nodeId: t.nodeId,
			nodeLookup: h,
			isTarget: y,
			edgeUpdaterType: t.type,
			lib: s,
			flowId: g,
			cancelConnection: p,
			panBy: _,
			isValidConnection: (...e) => m.getState().isValidConnection?.(...e) ?? !0,
			onConnect: (e) => l?.(n, e),
			onConnectStart: (r, i) => {
				f(!0), u?.(e, n, t.type), c?.(r, i);
			},
			onConnectEnd: (...e) => m.getState().onConnectEnd?.(...e),
			onReconnectEnd: (e, r) => {
				f(!1), d?.(e, n, t.type, r);
			},
			updateConnection: v,
			getTransform: () => m.getState().transform,
			getFromHandle: () => m.getState().connection.fromHandle,
			dragThreshold: m.getState().connectionDragThreshold,
			handleDomNode: e.currentTarget
		});
	}, g = (e) => h(e, {
		nodeId: n.target,
		id: n.targetHandle ?? null,
		type: "target"
	}), _ = (e) => h(e, {
		nodeId: n.source,
		id: n.sourceHandle ?? null,
		type: "source"
	}), v = () => p(!0), y = () => p(!1);
	return (0, q.jsxs)(q.Fragment, { children: [(e === !0 || e === "source") && (0, q.jsx)(Bp, {
		position: s,
		centerX: r,
		centerY: i,
		radius: t,
		onMouseDown: g,
		onMouseEnter: v,
		onMouseOut: y,
		type: "source"
	}), (e === !0 || e === "target") && (0, q.jsx)(Bp, {
		position: c,
		centerX: a,
		centerY: o,
		radius: t,
		onMouseDown: _,
		onMouseEnter: v,
		onMouseOut: y,
		type: "target"
	})] });
}
function Hp({ id: e, edgesFocusable: t, edgesReconnectable: n, elementsSelectable: r, onClick: i, onDoubleClick: a, onContextMenu: o, onMouseEnter: s, onMouseMove: c, onMouseLeave: l, reconnectRadius: u, onReconnect: d, onReconnectStart: f, onReconnectEnd: p, rfId: m, edgeTypes: h, noPanClassName: g, onError: v, disableKeyboardA11y: y }) {
	let b = Q((t) => t.edgeLookup.get(e)), x = Q((e) => e.defaultEdgeOptions);
	b = x ? {
		...x,
		...b
	} : b;
	let S = b.type || "default", C = h?.[S] || Fp[S];
	C === void 0 && (v?.("011", vc.error011(S)), S = "default", C = h?.default || Fp.default);
	let w = !!(b.focusable || t && b.focusable === void 0), T = d !== void 0 && (b.reconnectable || n && b.reconnectable === void 0), E = !!(b.selectable || r && b.selectable === void 0), D = (0, _.useRef)(null), [O, k] = (0, _.useState)(!1), [A, j] = (0, _.useState)(!1), M = $(), { zIndex: N, sourceX: P, sourceY: F, targetX: I, targetY: L, sourcePosition: R, targetPosition: ee } = Q((0, _.useCallback)((t) => {
		let n = t.nodeLookup.get(b.source), r = t.nodeLookup.get(b.target);
		if (!n || !r) return {
			zIndex: b.zIndex,
			...Ip
		};
		let i = Hl({
			id: e,
			sourceNode: n,
			targetNode: r,
			sourceHandle: b.sourceHandle || null,
			targetHandle: b.targetHandle || null,
			connectionMode: t.connectionMode,
			onError: v
		});
		return {
			zIndex: jl({
				selected: b.selected,
				zIndex: b.zIndex,
				sourceNode: n,
				targetNode: r,
				elevateOnSelect: t.elevateEdgesOnSelect,
				zIndexMode: t.zIndexMode
			}),
			...i || Ip
		};
	}, [
		b.source,
		b.target,
		b.sourceHandle,
		b.targetHandle,
		b.selected,
		b.zIndex
	]), md), te = (0, _.useMemo)(() => b.markerStart ? `url('#${Kl(b.markerStart, m)}')` : void 0, [b.markerStart, m]), z = (0, _.useMemo)(() => b.markerEnd ? `url('#${Kl(b.markerEnd, m)}')` : void 0, [b.markerEnd, m]);
	if (b.hidden || P === null || F === null || I === null || L === null) return null;
	let B = (t) => {
		let { addSelectedEdges: n, unselectNodesAndEdges: r, multiSelectionActive: a } = M.getState();
		E && (M.setState({ nodesSelectionActive: !1 }), b.selected && a ? (r({
			nodes: [],
			edges: [b]
		}), D.current?.blur()) : n([e])), i && i(t, b);
	}, V = a ? (e) => {
		a(e, { ...b });
	} : void 0, ne = o ? (e) => {
		o(e, { ...b });
	} : void 0, H = s ? (e) => {
		s(e, { ...b });
	} : void 0, U = c ? (e) => {
		c(e, { ...b });
	} : void 0, re = l ? (e) => {
		l(e, { ...b });
	} : void 0;
	return (0, q.jsx)("svg", {
		style: { zIndex: N },
		children: (0, q.jsxs)("g", {
			className: Pn([
				"react-flow__edge",
				`react-flow__edge-${S}`,
				b.className,
				g,
				{
					selected: b.selected,
					animated: b.animated,
					inactive: !E && !i,
					updating: O,
					selectable: E
				}
			]),
			onClick: B,
			onDoubleClick: V,
			onContextMenu: ne,
			onMouseEnter: H,
			onMouseMove: U,
			onMouseLeave: re,
			onKeyDown: w ? (t) => {
				if (!y && bc.includes(t.key) && E) {
					let { unselectNodesAndEdges: n, addSelectedEdges: r } = M.getState();
					t.key === "Escape" ? (D.current?.blur(), n({ edges: [b] })) : r([e]);
				}
			} : void 0,
			tabIndex: w ? 0 : void 0,
			role: b.ariaRole ?? (w ? "group" : "img"),
			"aria-roledescription": "edge",
			"data-id": e,
			"data-testid": `rf__edge-${e}`,
			"aria-label": b.ariaLabel === null ? void 0 : b.ariaLabel || `Edge from ${b.source} to ${b.target}`,
			"aria-describedby": w ? `${Sd}-${m}` : void 0,
			ref: D,
			...b.domAttributes,
			children: [!A && (0, q.jsx)(C, {
				id: e,
				source: b.source,
				target: b.target,
				type: b.type,
				selected: b.selected,
				animated: b.animated,
				selectable: E,
				deletable: b.deletable ?? !0,
				label: b.label,
				labelStyle: b.labelStyle,
				labelShowBg: b.labelShowBg,
				labelBgStyle: b.labelBgStyle,
				labelBgPadding: b.labelBgPadding,
				labelBgBorderRadius: b.labelBgBorderRadius,
				sourceX: P,
				sourceY: F,
				targetX: I,
				targetY: L,
				sourcePosition: R,
				targetPosition: ee,
				data: b.data,
				style: b.style,
				sourceHandleId: b.sourceHandle,
				targetHandleId: b.targetHandle,
				markerStart: te,
				markerEnd: z,
				pathOptions: "pathOptions" in b ? b.pathOptions : void 0,
				interactionWidth: b.interactionWidth
			}), T && (0, q.jsx)(Vp, {
				edge: b,
				isReconnectable: T,
				reconnectRadius: u,
				onReconnect: d,
				onReconnectStart: f,
				onReconnectEnd: p,
				sourceX: P,
				sourceY: F,
				targetX: I,
				targetY: L,
				sourcePosition: R,
				targetPosition: ee,
				setUpdateHover: k,
				setReconnecting: j
			})]
		})
	});
}
var Up = (0, _.memo)(Hp), Wp = (e) => ({
	edgesFocusable: e.edgesFocusable,
	edgesReconnectable: e.edgesReconnectable,
	elementsSelectable: e.elementsSelectable,
	connectionMode: e.connectionMode,
	onError: e.onError
});
function Gp({ defaultMarkerColor: e, onlyRenderVisibleElements: t, rfId: n, edgeTypes: r, noPanClassName: i, onReconnect: a, onEdgeContextMenu: o, onEdgeMouseEnter: s, onEdgeMouseMove: c, onEdgeMouseLeave: l, onEdgeClick: u, reconnectRadius: d, onEdgeDoubleClick: f, onReconnectStart: p, onReconnectEnd: m, disableKeyboardA11y: h }) {
	let { edgesFocusable: g, edgesReconnectable: _, elementsSelectable: v, onError: y } = Q(Wp, md), b = sp(t);
	return (0, q.jsxs)("div", {
		className: "react-flow__edges",
		children: [(0, q.jsx)(mp, {
			defaultColor: e,
			rfId: n
		}), b.map((e) => (0, q.jsx)(Up, {
			id: e,
			edgesFocusable: g,
			edgesReconnectable: _,
			elementsSelectable: v,
			noPanClassName: i,
			onReconnect: a,
			onContextMenu: o,
			onMouseEnter: s,
			onMouseMove: c,
			onMouseLeave: l,
			onClick: u,
			reconnectRadius: d,
			onDoubleClick: f,
			onReconnectStart: p,
			onReconnectEnd: m,
			rfId: n,
			onError: y,
			edgeTypes: r,
			disableKeyboardA11y: h
		}, e))]
	});
}
Gp.displayName = "EdgeRenderer";
var Kp = (0, _.memo)(Gp), qp = (e) => `translate(${e.transform[0]}px,${e.transform[1]}px) scale(${e.transform[2]})`;
function Jp({ children: e }) {
	return (0, q.jsx)("div", {
		className: "react-flow__viewport xyflow__viewport react-flow__container",
		style: { transform: Q(qp) },
		children: e
	});
}
function Yp(e) {
	let t = mf(), n = (0, _.useRef)(!1);
	(0, _.useEffect)(() => {
		!n.current && t.viewportInitialized && e && (setTimeout(() => e(t), 1), n.current = !0);
	}, [e, t.viewportInitialized]);
}
var Xp = (e) => e.panZoom?.syncViewport;
function Zp(e) {
	let t = Q(Xp), n = $();
	return (0, _.useEffect)(() => {
		e && (t?.(e), n.setState({ transform: [
			e.x,
			e.y,
			e.zoom
		] }));
	}, [e, t]), null;
}
function Qp(e) {
	return e.connection.inProgress ? {
		...e.connection,
		to: il(e.connection.to, e.transform)
	} : { ...e.connection };
}
function $p(e) {
	return e ? (t) => e(Qp(t)) : Qp;
}
function em(e) {
	return Q($p(e), md);
}
var tm = (e) => ({
	nodesConnectable: e.nodesConnectable,
	isValid: e.connection.isValid,
	inProgress: e.connection.inProgress,
	width: e.width,
	height: e.height
});
function nm({ containerStyle: e, style: t, type: n, component: r }) {
	let { nodesConnectable: i, width: a, height: o, isValid: s, inProgress: c } = Q(tm, md);
	return a && i && c ? (0, q.jsx)("svg", {
		style: e,
		width: a,
		height: o,
		className: "react-flow__connectionline react-flow__container",
		children: (0, q.jsx)("g", {
			className: Pn(["react-flow__connection", kc(s)]),
			children: (0, q.jsx)(rm, {
				style: t,
				type: n,
				CustomComponent: r,
				isValid: s
			})
		})
	}) : null;
}
var rm = ({ style: e, type: t = Ec.Bezier, CustomComponent: n, isValid: r }) => {
	let { inProgress: i, from: a, fromNode: o, fromHandle: s, fromPosition: c, to: l, toNode: u, toHandle: d, toPosition: f, pointer: p } = em();
	if (!i) return;
	if (n) return (0, q.jsx)(n, {
		connectionLineType: t,
		connectionLineStyle: e,
		fromNode: o,
		fromHandle: s,
		fromX: a.x,
		fromY: a.y,
		toX: l.x,
		toY: l.y,
		fromPosition: c,
		toPosition: f,
		connectionStatus: kc(r),
		toNode: u,
		toHandle: d,
		pointer: p
	});
	let m = "", h = {
		sourceX: a.x,
		sourceY: a.y,
		sourcePosition: c,
		targetX: l.x,
		targetY: l.y,
		targetPosition: f
	};
	switch (t) {
		case Ec.Bezier:
			[m] = kl(h);
			break;
		case Ec.SimpleBezier:
			[m] = yp(h);
			break;
		case Ec.Step:
			[m] = Bl({
				...h,
				borderRadius: 0
			});
			break;
		case Ec.SmoothStep:
			[m] = Bl(h);
			break;
		default: [m] = Il(h);
	}
	return (0, q.jsx)("path", {
		d: m,
		fill: "none",
		className: "react-flow__connection-path",
		style: e
	});
};
rm.displayName = "ConnectionLine";
var im = {};
function am(e = im) {
	(0, _.useRef)(e), $(), (0, _.useEffect)(() => {}, [e]);
}
function om() {
	$(), (0, _.useRef)(!1), (0, _.useEffect)(() => {}, []);
}
function sm({ nodeTypes: e, edgeTypes: t, onInit: n, onNodeClick: r, onEdgeClick: i, onNodeDoubleClick: a, onEdgeDoubleClick: o, onNodeMouseEnter: s, onNodeMouseMove: c, onNodeMouseLeave: l, onNodeContextMenu: u, onSelectionContextMenu: d, onSelectionStart: f, onSelectionEnd: p, connectionLineType: m, connectionLineStyle: h, connectionLineComponent: g, connectionLineContainerStyle: _, selectionKeyCode: v, selectionOnDrag: y, selectionMode: b, multiSelectionKeyCode: x, panActivationKeyCode: S, zoomActivationKeyCode: C, deleteKeyCode: w, onlyRenderVisibleElements: T, elementsSelectable: E, defaultViewport: D, translateExtent: O, minZoom: k, maxZoom: A, preventScrolling: j, defaultMarkerColor: M, zoomOnScroll: N, zoomOnPinch: P, panOnScroll: F, panOnScrollSpeed: I, panOnScrollMode: L, zoomOnDoubleClick: R, panOnDrag: ee, onPaneClick: te, onPaneMouseEnter: z, onPaneMouseMove: B, onPaneMouseLeave: V, onPaneScroll: ne, onPaneContextMenu: H, paneClickDistance: U, nodeClickDistance: re, onEdgeContextMenu: ie, onEdgeMouseEnter: ae, onEdgeMouseMove: oe, onEdgeMouseLeave: se, reconnectRadius: ce, onReconnect: le, onReconnectStart: ue, onReconnectEnd: de, noDragClassName: fe, noWheelClassName: pe, noPanClassName: me, disableKeyboardA11y: he, nodeExtent: ge, rfId: _e, viewport: ve, onViewportChange: ye }) {
	return am(e), am(t), om(), Yp(n), Zp(ve), (0, q.jsx)(Xf, {
		onPaneClick: te,
		onPaneMouseEnter: z,
		onPaneMouseMove: B,
		onPaneMouseLeave: V,
		onPaneContextMenu: H,
		onPaneScroll: ne,
		paneClickDistance: U,
		deleteKeyCode: w,
		selectionKeyCode: v,
		selectionOnDrag: y,
		selectionMode: b,
		onSelectionStart: f,
		onSelectionEnd: p,
		multiSelectionKeyCode: x,
		panActivationKeyCode: S,
		zoomActivationKeyCode: C,
		elementsSelectable: E,
		zoomOnScroll: N,
		zoomOnPinch: P,
		zoomOnDoubleClick: R,
		panOnScroll: F,
		panOnScrollSpeed: I,
		panOnScrollMode: L,
		panOnDrag: ee,
		defaultViewport: D,
		translateExtent: O,
		minZoom: k,
		maxZoom: A,
		onSelectionContextMenu: d,
		preventScrolling: j,
		noDragClassName: fe,
		noWheelClassName: pe,
		noPanClassName: me,
		disableKeyboardA11y: he,
		onViewportChange: ye,
		isControlledViewport: !!ve,
		children: (0, q.jsxs)(Jp, { children: [
			(0, q.jsx)(Kp, {
				edgeTypes: t,
				onEdgeClick: i,
				onEdgeDoubleClick: o,
				onReconnect: le,
				onReconnectStart: ue,
				onReconnectEnd: de,
				onlyRenderVisibleElements: T,
				onEdgeContextMenu: ie,
				onEdgeMouseEnter: ae,
				onEdgeMouseMove: oe,
				onEdgeMouseLeave: se,
				reconnectRadius: ce,
				defaultMarkerColor: M,
				noPanClassName: me,
				disableKeyboardA11y: he,
				rfId: _e
			}),
			(0, q.jsx)(nm, {
				style: h,
				type: m,
				component: g,
				containerStyle: _
			}),
			(0, q.jsx)("div", { className: "react-flow__edgelabel-renderer" }),
			(0, q.jsx)(op, {
				nodeTypes: e,
				onNodeClick: r,
				onNodeDoubleClick: a,
				onNodeMouseEnter: s,
				onNodeMouseMove: c,
				onNodeMouseLeave: l,
				onNodeContextMenu: u,
				nodeClickDistance: re,
				onlyRenderVisibleElements: T,
				noPanClassName: me,
				noDragClassName: fe,
				disableKeyboardA11y: he,
				nodeExtent: ge,
				rfId: _e
			}),
			(0, q.jsx)("div", { className: "react-flow__viewport-portal" })
		] })
	});
}
sm.displayName = "GraphView";
var cm = (0, _.memo)(sm), lm = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, width: i, height: a, fitView: o, fitViewOptions: s, minZoom: c = .5, maxZoom: l = 2, nodeOrigin: u, nodeExtent: d, zIndexMode: f = "basic" } = {}) => {
	let p = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), _ = r ?? t ?? [], v = n ?? e ?? [], y = u ?? [0, 0], b = d ?? yc;
	du(h, g, _);
	let { nodesInitialized: x } = nu(v, p, m, {
		nodeOrigin: y,
		nodeExtent: b,
		zIndexMode: f
	}), S = [
		0,
		0,
		1
	];
	if (o && i && a) {
		let { x: e, y: t, zoom: n } = ll(Fc(p, { filter: (e) => !!((e.width || e.initialWidth) && (e.height || e.initialHeight)) }), i, a, c, l, s?.padding ?? .1);
		S = [
			e,
			t,
			n
		];
	}
	return {
		rfId: "1",
		width: i ?? 0,
		height: a ?? 0,
		transform: S,
		nodes: v,
		nodesInitialized: x,
		nodeLookup: p,
		parentLookup: m,
		edges: _,
		edgeLookup: g,
		connectionLookup: h,
		onNodesChange: null,
		onEdgesChange: null,
		hasDefaultNodes: n !== void 0,
		hasDefaultEdges: r !== void 0,
		panZoom: null,
		minZoom: c,
		maxZoom: l,
		translateExtent: yc,
		nodeExtent: b,
		nodesSelectionActive: !1,
		userSelectionActive: !1,
		userSelectionRect: null,
		connectionMode: Sc.Strict,
		domNode: null,
		paneDragging: !1,
		noPanClassName: "nopan",
		nodeOrigin: y,
		nodeDragThreshold: 1,
		connectionDragThreshold: 1,
		snapGrid: [15, 15],
		snapToGrid: !1,
		nodesDraggable: !0,
		nodesConnectable: !0,
		nodesFocusable: !0,
		edgesFocusable: !0,
		edgesReconnectable: !0,
		elementsSelectable: !0,
		elevateNodesOnSelect: !0,
		elevateEdgesOnSelect: !0,
		selectNodesOnDrag: !0,
		multiSelectionActive: !1,
		fitViewQueued: o ?? !1,
		fitViewOptions: s,
		fitViewResolver: null,
		connection: { ...Tc },
		connectionClickStartHandle: null,
		connectOnClick: !0,
		ariaLiveMessage: "",
		autoPanOnConnect: !0,
		autoPanOnNodeDrag: !0,
		autoPanOnNodeFocus: !0,
		autoPanSpeed: 15,
		connectionRadius: 20,
		onError: nl,
		isValidConnection: void 0,
		onSelectionChangeHandlers: [],
		lib: "react",
		debug: !1,
		ariaLabelConfig: xc,
		zIndexMode: f,
		onNodesChangeMiddlewareMap: /* @__PURE__ */ new Map(),
		onEdgesChangeMiddlewareMap: /* @__PURE__ */ new Map()
	};
}, um = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, width: i, height: a, fitView: o, fitViewOptions: s, minZoom: c, maxZoom: l, nodeOrigin: u, nodeExtent: d, zIndexMode: f }) => pd((p, m) => {
	async function h() {
		let { nodeLookup: e, panZoom: t, fitViewOptions: n, fitViewResolver: r, width: i, height: a, minZoom: o, maxZoom: s } = m();
		t && (await zc({
			nodes: e,
			width: i,
			height: a,
			panZoom: t,
			minZoom: o,
			maxZoom: s
		}, n), r?.resolve(!0), p({ fitViewResolver: null }));
	}
	return {
		...lm({
			nodes: e,
			edges: t,
			width: i,
			height: a,
			fitView: o,
			fitViewOptions: s,
			minZoom: c,
			maxZoom: l,
			nodeOrigin: u,
			nodeExtent: d,
			defaultNodes: n,
			defaultEdges: r,
			zIndexMode: f
		}),
		setNodes: (e) => {
			let { nodeLookup: t, parentLookup: n, nodeOrigin: r, elevateNodesOnSelect: i, fitViewQueued: a, zIndexMode: o, nodesSelectionActive: s } = m(), { nodesInitialized: c, hasSelectedNodes: l } = nu(e, t, n, {
				nodeOrigin: r,
				nodeExtent: d,
				elevateNodesOnSelect: i,
				checkEquality: !0,
				zIndexMode: o
			}), u = s && l;
			a && c ? (h(), p({
				nodes: e,
				nodesInitialized: c,
				fitViewQueued: !1,
				fitViewOptions: void 0,
				nodesSelectionActive: u
			})) : p({
				nodes: e,
				nodesInitialized: c,
				nodesSelectionActive: u
			});
		},
		setEdges: (e) => {
			let { connectionLookup: t, edgeLookup: n } = m();
			du(t, n, e), p({ edges: e });
		},
		setDefaultNodesAndEdges: (e, t) => {
			if (e) {
				let { setNodes: t } = m();
				t(e), p({ hasDefaultNodes: !0 });
			}
			if (t) {
				let { setEdges: e } = m();
				e(t), p({ hasDefaultEdges: !0 });
			}
		},
		updateNodeInternals: (e) => {
			let { triggerNodeChanges: t, nodeLookup: n, parentLookup: r, domNode: i, nodeOrigin: a, nodeExtent: o, debug: s, fitViewQueued: c, zIndexMode: l } = m(), { changes: u, updatedInternals: d } = cu(e, n, r, i, a, o, l);
			d && ($l(n, r, {
				nodeOrigin: a,
				nodeExtent: o,
				zIndexMode: l
			}), c ? (h(), p({
				fitViewQueued: !1,
				fitViewOptions: void 0
			})) : p({}), u?.length > 0 && (s && console.log("React Flow: trigger node changes", u), t?.(u)));
		},
		updateNodePositions: (e, t = !1) => {
			let n = [], r = [], { nodeLookup: i, triggerNodeChanges: a, connection: o, updateConnection: s, onNodesChangeMiddlewareMap: c } = m();
			for (let [a, c] of e) {
				let e = i.get(a), l = !!(e?.expandParent && e?.parentId && c?.position), u = {
					id: a,
					type: "position",
					position: l ? {
						x: Math.max(0, c.position.x),
						y: Math.max(0, c.position.y)
					} : c.position,
					dragging: t
				};
				if (e && o.inProgress && o.fromNode.id === e.id) {
					let t = Wl(e, o.fromHandle, Y.Left, !0);
					s({
						...o,
						from: t
					});
				}
				l && e.parentId && n.push({
					id: a,
					parentId: e.parentId,
					rect: {
						...c.internals.positionAbsolute,
						width: c.measured.width ?? 0,
						height: c.measured.height ?? 0
					}
				}), r.push(u);
			}
			if (n.length > 0) {
				let { parentLookup: e, nodeOrigin: t } = m(), a = su(n, i, e, t);
				r.push(...a);
			}
			for (let e of c.values()) r = e(r);
			a(r);
		},
		triggerNodeChanges: (e) => {
			let { onNodesChange: t, setNodes: n, nodes: r, hasDefaultNodes: i, debug: a } = m();
			e?.length && (i && n(Qd(e, r)), a && console.log("React Flow: trigger node changes", e), t?.(e));
		},
		triggerEdgeChanges: (e) => {
			let { onEdgesChange: t, setEdges: n, edges: r, hasDefaultEdges: i, debug: a } = m();
			e?.length && (i && n($d(e, r)), a && console.log("React Flow: trigger edge changes", e), t?.(e));
		},
		addSelectedNodes: (e) => {
			let { multiSelectionActive: t, edgeLookup: n, nodeLookup: r, triggerNodeChanges: i, triggerEdgeChanges: a } = m();
			if (t) {
				i(e.map((e) => ef(e, !0)));
				return;
			}
			i(tf(r, new Set([...e]), !0)), a(tf(n));
		},
		addSelectedEdges: (e) => {
			let { multiSelectionActive: t, edgeLookup: n, nodeLookup: r, triggerNodeChanges: i, triggerEdgeChanges: a } = m();
			if (t) {
				a(e.map((e) => ef(e, !0)));
				return;
			}
			a(tf(n, new Set([...e]))), i(tf(r, /* @__PURE__ */ new Set(), !0));
		},
		unselectNodesAndEdges: ({ nodes: e, edges: t } = {}) => {
			let { edges: n, nodes: r, nodeLookup: i, triggerNodeChanges: a, triggerEdgeChanges: o } = m(), s = e || r, c = t || n, l = [];
			for (let e of s) {
				if (!e.selected) continue;
				let t = i.get(e.id);
				t && (t.selected = !1), l.push(ef(e.id, !1));
			}
			let u = [];
			for (let e of c) e.selected && u.push(ef(e.id, !1));
			a(l), o(u);
		},
		setMinZoom: (e) => {
			let { panZoom: t, maxZoom: n } = m();
			t?.setScaleExtent([e, n]), p({ minZoom: e });
		},
		setMaxZoom: (e) => {
			let { panZoom: t, minZoom: n } = m();
			t?.setScaleExtent([n, e]), p({ maxZoom: e });
		},
		setTranslateExtent: (e) => {
			m().panZoom?.setTranslateExtent(e), p({ translateExtent: e });
		},
		resetSelectedElements: () => {
			let { edges: e, nodes: t, triggerNodeChanges: n, triggerEdgeChanges: r, elementsSelectable: i } = m();
			if (!i) return;
			let a = t.reduce((e, t) => t.selected ? [...e, ef(t.id, !1)] : e, []), o = e.reduce((e, t) => t.selected ? [...e, ef(t.id, !1)] : e, []);
			n(a), r(o);
		},
		setNodeExtent: (e) => {
			let { nodes: t, nodeLookup: n, parentLookup: r, nodeOrigin: i, elevateNodesOnSelect: a, nodeExtent: o, zIndexMode: s } = m();
			e[0][0] === o[0][0] && e[0][1] === o[0][1] && e[1][0] === o[1][0] && e[1][1] === o[1][1] || (nu(t, n, r, {
				nodeOrigin: i,
				nodeExtent: e,
				elevateNodesOnSelect: a,
				checkEquality: !1,
				zIndexMode: s
			}), p({ nodeExtent: e }));
		},
		panBy: (e) => {
			let { transform: t, width: n, height: r, panZoom: i, translateExtent: a } = m();
			return lu({
				delta: e,
				panZoom: i,
				transform: t,
				translateExtent: a,
				width: n,
				height: r
			});
		},
		setCenter: async (e, t, n) => {
			let { width: r, height: i, maxZoom: a, panZoom: o } = m();
			if (!o) return Promise.resolve(!1);
			let s = n?.zoom === void 0 ? a : n.zoom;
			return await o.setViewport({
				x: r / 2 - e * s,
				y: i / 2 - t * s,
				zoom: s
			}, {
				duration: n?.duration,
				ease: n?.ease,
				interpolate: n?.interpolate
			}), Promise.resolve(!0);
		},
		cancelConnection: () => {
			p({ connection: { ...Tc } });
		},
		updateConnection: (e) => {
			p({ connection: e });
		},
		reset: () => p({ ...lm() })
	};
}, Object.is);
function dm({ initialNodes: e, initialEdges: t, defaultNodes: n, defaultEdges: r, initialWidth: i, initialHeight: a, initialMinZoom: o, initialMaxZoom: s, initialFitViewOptions: c, fitView: l, nodeOrigin: u, nodeExtent: d, zIndexMode: f, children: p }) {
	let [m] = (0, _.useState)(() => um({
		nodes: e,
		edges: t,
		defaultNodes: n,
		defaultEdges: r,
		width: i,
		height: a,
		fitView: l,
		minZoom: o,
		maxZoom: s,
		fitViewOptions: c,
		nodeOrigin: u,
		nodeExtent: d,
		zIndexMode: f
	}));
	return (0, q.jsx)(_d, {
		value: m,
		children: (0, q.jsx)(df, { children: p })
	});
}
function fm({ children: e, nodes: t, edges: n, defaultNodes: r, defaultEdges: i, width: a, height: o, fitView: s, fitViewOptions: c, minZoom: l, maxZoom: u, nodeOrigin: d, nodeExtent: f, zIndexMode: p }) {
	return (0, _.useContext)(gd) ? (0, q.jsx)(q.Fragment, { children: e }) : (0, q.jsx)(dm, {
		initialNodes: t,
		initialEdges: n,
		defaultNodes: r,
		defaultEdges: i,
		initialWidth: a,
		initialHeight: o,
		fitView: s,
		initialFitViewOptions: c,
		initialMinZoom: l,
		initialMaxZoom: u,
		nodeOrigin: d,
		nodeExtent: f,
		zIndexMode: p,
		children: e
	});
}
var pm = {
	width: "100%",
	height: "100%",
	overflow: "hidden",
	position: "relative",
	zIndex: 0
};
function mm({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, className: i, nodeTypes: a, edgeTypes: o, onNodeClick: s, onEdgeClick: c, onInit: l, onMove: u, onMoveStart: d, onMoveEnd: f, onConnect: p, onConnectStart: m, onConnectEnd: h, onClickConnectStart: g, onClickConnectEnd: v, onNodeMouseEnter: y, onNodeMouseMove: b, onNodeMouseLeave: x, onNodeContextMenu: S, onNodeDoubleClick: C, onNodeDragStart: w, onNodeDrag: T, onNodeDragStop: E, onNodesDelete: D, onEdgesDelete: O, onDelete: k, onSelectionChange: A, onSelectionDragStart: j, onSelectionDrag: M, onSelectionDragStop: N, onSelectionContextMenu: P, onSelectionStart: F, onSelectionEnd: I, onBeforeDelete: L, connectionMode: R, connectionLineType: ee = Ec.Bezier, connectionLineStyle: te, connectionLineComponent: z, connectionLineContainerStyle: B, deleteKeyCode: V = "Backspace", selectionKeyCode: ne = "Shift", selectionOnDrag: H = !1, selectionMode: U = wc.Full, panActivationKeyCode: re = "Space", multiSelectionKeyCode: ie = ul() ? "Meta" : "Control", zoomActivationKeyCode: ae = ul() ? "Meta" : "Control", snapToGrid: oe, snapGrid: se, onlyRenderVisibleElements: ce = !1, selectNodesOnDrag: le, nodesDraggable: ue, autoPanOnNodeFocus: de, nodesConnectable: fe, nodesFocusable: pe, nodeOrigin: me = Ld, edgesFocusable: he, edgesReconnectable: ge, elementsSelectable: _e = !0, defaultViewport: ve = Rd, minZoom: ye = .5, maxZoom: be = 2, translateExtent: xe = yc, preventScrolling: Se = !0, nodeExtent: Ce, defaultMarkerColor: we = "#b1b1b7", zoomOnScroll: Te = !0, zoomOnPinch: Ee = !0, panOnScroll: De = !1, panOnScrollSpeed: Oe = .5, panOnScrollMode: ke = Cc.Free, zoomOnDoubleClick: Ae = !0, panOnDrag: je = !0, onPaneClick: Me, onPaneMouseEnter: Ne, onPaneMouseMove: Pe, onPaneMouseLeave: Fe, onPaneScroll: Ie, onPaneContextMenu: Le, paneClickDistance: Re = 1, nodeClickDistance: ze = 0, children: Be, onReconnect: Ve, onReconnectStart: He, onReconnectEnd: Ue, onEdgeContextMenu: We, onEdgeDoubleClick: Ge, onEdgeMouseEnter: Ke, onEdgeMouseMove: qe, onEdgeMouseLeave: Je, reconnectRadius: Ye = 10, onNodesChange: Xe, onEdgesChange: Ze, noDragClassName: Qe = "nodrag", noWheelClassName: $e = "nowheel", noPanClassName: et = "nopan", fitView: tt, fitViewOptions: nt, connectOnClick: rt, attributionPosition: it, proOptions: at, defaultEdgeOptions: ot, elevateNodesOnSelect: st = !0, elevateEdgesOnSelect: ct = !1, disableKeyboardA11y: lt = !1, autoPanOnConnect: W, autoPanOnNodeDrag: ut, autoPanSpeed: dt, connectionRadius: ft, isValidConnection: pt, onError: mt, style: ht, id: gt, nodeDragThreshold: _t, connectionDragThreshold: vt, viewport: yt, onViewportChange: bt, width: G, height: xt, colorMode: St = "light", debug: Ct, onScroll: wt, ariaLabelConfig: Tt, zIndexMode: Et = "basic", ...Dt }, K) {
	let Ot = gt || "1", kt = Wd(St), At = (0, _.useCallback)((e) => {
		e.currentTarget.scrollTo({
			top: 0,
			left: 0,
			behavior: "instant"
		}), wt?.(e);
	}, [wt]);
	return (0, q.jsx)("div", {
		"data-testid": "rf__wrapper",
		...Dt,
		onScroll: At,
		style: {
			...ht,
			...pm
		},
		ref: K,
		className: Pn([
			"react-flow",
			i,
			kt
		]),
		id: gt,
		role: "application",
		children: (0, q.jsxs)(fm, {
			nodes: e,
			edges: t,
			width: G,
			height: xt,
			fitView: tt,
			fitViewOptions: nt,
			minZoom: ye,
			maxZoom: be,
			nodeOrigin: me,
			nodeExtent: Ce,
			zIndexMode: Et,
			children: [
				(0, q.jsx)(Hd, {
					nodes: e,
					edges: t,
					defaultNodes: n,
					defaultEdges: r,
					onConnect: p,
					onConnectStart: m,
					onConnectEnd: h,
					onClickConnectStart: g,
					onClickConnectEnd: v,
					nodesDraggable: ue,
					autoPanOnNodeFocus: de,
					nodesConnectable: fe,
					nodesFocusable: pe,
					edgesFocusable: he,
					edgesReconnectable: ge,
					elementsSelectable: _e,
					elevateNodesOnSelect: st,
					elevateEdgesOnSelect: ct,
					minZoom: ye,
					maxZoom: be,
					nodeExtent: Ce,
					onNodesChange: Xe,
					onEdgesChange: Ze,
					snapToGrid: oe,
					snapGrid: se,
					connectionMode: R,
					translateExtent: xe,
					connectOnClick: rt,
					defaultEdgeOptions: ot,
					fitView: tt,
					fitViewOptions: nt,
					onNodesDelete: D,
					onEdgesDelete: O,
					onDelete: k,
					onNodeDragStart: w,
					onNodeDrag: T,
					onNodeDragStop: E,
					onSelectionDrag: M,
					onSelectionDragStart: j,
					onSelectionDragStop: N,
					onMove: u,
					onMoveStart: d,
					onMoveEnd: f,
					noPanClassName: et,
					nodeOrigin: me,
					rfId: Ot,
					autoPanOnConnect: W,
					autoPanOnNodeDrag: ut,
					autoPanSpeed: dt,
					onError: mt,
					connectionRadius: ft,
					isValidConnection: pt,
					selectNodesOnDrag: le,
					nodeDragThreshold: _t,
					connectionDragThreshold: vt,
					onBeforeDelete: L,
					debug: Ct,
					ariaLabelConfig: Tt,
					zIndexMode: Et
				}),
				(0, q.jsx)(cm, {
					onInit: l,
					onNodeClick: s,
					onEdgeClick: c,
					onNodeMouseEnter: y,
					onNodeMouseMove: b,
					onNodeMouseLeave: x,
					onNodeContextMenu: S,
					onNodeDoubleClick: C,
					nodeTypes: a,
					edgeTypes: o,
					connectionLineType: ee,
					connectionLineStyle: te,
					connectionLineComponent: z,
					connectionLineContainerStyle: B,
					selectionKeyCode: ne,
					selectionOnDrag: H,
					selectionMode: U,
					deleteKeyCode: V,
					multiSelectionKeyCode: ie,
					panActivationKeyCode: re,
					zoomActivationKeyCode: ae,
					onlyRenderVisibleElements: ce,
					defaultViewport: ve,
					translateExtent: xe,
					minZoom: ye,
					maxZoom: be,
					preventScrolling: Se,
					zoomOnScroll: Te,
					zoomOnPinch: Ee,
					zoomOnDoubleClick: Ae,
					panOnScroll: De,
					panOnScrollSpeed: Oe,
					panOnScrollMode: ke,
					panOnDrag: je,
					onPaneClick: Me,
					onPaneMouseEnter: Ne,
					onPaneMouseMove: Pe,
					onPaneMouseLeave: Fe,
					onPaneScroll: Ie,
					onPaneContextMenu: Le,
					paneClickDistance: Re,
					nodeClickDistance: ze,
					onSelectionContextMenu: P,
					onSelectionStart: F,
					onSelectionEnd: I,
					onReconnect: Ve,
					onReconnectStart: He,
					onReconnectEnd: Ue,
					onEdgeContextMenu: We,
					onEdgeDoubleClick: Ge,
					onEdgeMouseEnter: Ke,
					onEdgeMouseMove: qe,
					onEdgeMouseLeave: Je,
					reconnectRadius: Ye,
					defaultMarkerColor: we,
					noDragClassName: Qe,
					noWheelClassName: $e,
					noPanClassName: et,
					rfId: Ot,
					disableKeyboardA11y: lt,
					nodeExtent: Ce,
					viewport: yt,
					onViewportChange: bt
				}),
				(0, q.jsx)(Fd, { onSelectionChange: A }),
				Be,
				(0, q.jsx)(kd, {
					proOptions: at,
					position: it
				}),
				(0, q.jsx)(Dd, {
					rfId: Ot,
					disableKeyboardA11y: lt
				})
			]
		})
	});
}
var hm = sf(mm);
vc.error014();
function gm({ dimensions: e, lineWidth: t, variant: n, className: r }) {
	return (0, q.jsx)("path", {
		strokeWidth: t,
		d: `M${e[0] / 2} 0 V${e[1]} M0 ${e[1] / 2} H${e[0]}`,
		className: Pn([
			"react-flow__background-pattern",
			n,
			r
		])
	});
}
function _m({ radius: e, className: t }) {
	return (0, q.jsx)("circle", {
		cx: e,
		cy: e,
		r: e,
		className: Pn([
			"react-flow__background-pattern",
			"dots",
			t
		])
	});
}
var vm;
(function(e) {
	e.Lines = "lines", e.Dots = "dots", e.Cross = "cross";
})(vm ||= {});
var ym = {
	[vm.Dots]: 1,
	[vm.Lines]: 1,
	[vm.Cross]: 6
}, bm = (e) => ({
	transform: e.transform,
	patternId: `pattern-${e.rfId}`
});
function xm({ id: e, variant: t = vm.Dots, gap: n = 20, size: r, lineWidth: i = 1, offset: a = 0, color: o, bgColor: s, style: c, className: l, patternClassName: u }) {
	let d = (0, _.useRef)(null), { transform: f, patternId: p } = Q(bm, md), m = r || ym[t], h = t === vm.Dots, g = t === vm.Cross, v = Array.isArray(n) ? n : [n, n], y = [v[0] * f[2] || 1, v[1] * f[2] || 1], b = m * f[2], x = Array.isArray(a) ? a : [a, a], S = g ? [b, b] : y, C = [x[0] * f[2] || 1 + S[0] / 2, x[1] * f[2] || 1 + S[1] / 2], w = `${p}${e || ""}`;
	return (0, q.jsxs)("svg", {
		className: Pn(["react-flow__background", l]),
		style: {
			...c,
			...yf,
			"--xy-background-color-props": s,
			"--xy-background-pattern-color-props": o
		},
		ref: d,
		"data-testid": "rf__background",
		children: [(0, q.jsx)("pattern", {
			id: w,
			x: f[0] % y[0],
			y: f[1] % y[1],
			width: y[0],
			height: y[1],
			patternUnits: "userSpaceOnUse",
			patternTransform: `translate(-${C[0]},-${C[1]})`,
			children: h ? (0, q.jsx)(_m, {
				radius: b / 2,
				className: u
			}) : (0, q.jsx)(gm, {
				dimensions: S,
				lineWidth: i,
				variant: t,
				className: u
			})
		}), (0, q.jsx)("rect", {
			x: "0",
			y: "0",
			width: "100%",
			height: "100%",
			fill: `url(#${w})`
		})]
	});
}
xm.displayName = "Background";
var Sm = (0, _.memo)(xm);
function Cm() {
	return (0, q.jsx)("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		viewBox: "0 0 32 32",
		children: (0, q.jsx)("path", { d: "M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z" })
	});
}
function wm() {
	return (0, q.jsx)("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		viewBox: "0 0 32 5",
		children: (0, q.jsx)("path", { d: "M0 0h32v4.2H0z" })
	});
}
function Tm() {
	return (0, q.jsx)("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		viewBox: "0 0 32 30",
		children: (0, q.jsx)("path", { d: "M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0027.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94c-.531 0-.939-.4-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z" })
	});
}
function Em() {
	return (0, q.jsx)("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		viewBox: "0 0 25 32",
		children: (0, q.jsx)("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z" })
	});
}
function Dm() {
	return (0, q.jsx)("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		viewBox: "0 0 25 32",
		children: (0, q.jsx)("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047z" })
	});
}
function Om({ children: e, className: t, ...n }) {
	return (0, q.jsx)("button", {
		type: "button",
		className: Pn(["react-flow__controls-button", t]),
		...n,
		children: e
	});
}
var km = (e) => ({
	isInteractive: e.nodesDraggable || e.nodesConnectable || e.elementsSelectable,
	minZoomReached: e.transform[2] <= e.minZoom,
	maxZoomReached: e.transform[2] >= e.maxZoom,
	ariaLabelConfig: e.ariaLabelConfig
});
function Am({ style: e, showZoom: t = !0, showFitView: n = !0, showInteractive: r = !0, fitViewOptions: i, onZoomIn: a, onZoomOut: o, onFitView: s, onInteractiveChange: c, className: l, children: u, position: d = "bottom-left", orientation: f = "vertical", "aria-label": p }) {
	let m = $(), { isInteractive: h, minZoomReached: g, maxZoomReached: _, ariaLabelConfig: v } = Q(km, md), { zoomIn: y, zoomOut: b, fitView: x } = mf();
	return (0, q.jsxs)(Od, {
		className: Pn([
			"react-flow__controls",
			f === "horizontal" ? "horizontal" : "vertical",
			l
		]),
		position: d,
		style: e,
		"data-testid": "rf__controls",
		"aria-label": p ?? v["controls.ariaLabel"],
		children: [
			t && (0, q.jsxs)(q.Fragment, { children: [(0, q.jsx)(Om, {
				onClick: () => {
					y(), a?.();
				},
				className: "react-flow__controls-zoomin",
				title: v["controls.zoomIn.ariaLabel"],
				"aria-label": v["controls.zoomIn.ariaLabel"],
				disabled: _,
				children: (0, q.jsx)(Cm, {})
			}), (0, q.jsx)(Om, {
				onClick: () => {
					b(), o?.();
				},
				className: "react-flow__controls-zoomout",
				title: v["controls.zoomOut.ariaLabel"],
				"aria-label": v["controls.zoomOut.ariaLabel"],
				disabled: g,
				children: (0, q.jsx)(wm, {})
			})] }),
			n && (0, q.jsx)(Om, {
				className: "react-flow__controls-fitview",
				onClick: () => {
					x(i), s?.();
				},
				title: v["controls.fitView.ariaLabel"],
				"aria-label": v["controls.fitView.ariaLabel"],
				children: (0, q.jsx)(Tm, {})
			}),
			r && (0, q.jsx)(Om, {
				className: "react-flow__controls-interactive",
				onClick: () => {
					m.setState({
						nodesDraggable: !h,
						nodesConnectable: !h,
						elementsSelectable: !h
					}), c?.(!h);
				},
				title: v["controls.interactive.ariaLabel"],
				"aria-label": v["controls.interactive.ariaLabel"],
				children: h ? (0, q.jsx)(Dm, {}) : (0, q.jsx)(Em, {})
			}),
			u
		]
	});
}
Am.displayName = "Controls";
var jm = (0, _.memo)(Am);
function Mm({ id: e, x: t, y: n, width: r, height: i, style: a, color: o, strokeColor: s, strokeWidth: c, className: l, borderRadius: u, shapeRendering: d, selected: f, onClick: p }) {
	let { background: m, backgroundColor: h } = a || {}, g = o || m || h;
	return (0, q.jsx)("rect", {
		className: Pn([
			"react-flow__minimap-node",
			{ selected: f },
			l
		]),
		x: t,
		y: n,
		rx: u,
		ry: u,
		width: r,
		height: i,
		style: {
			fill: g,
			stroke: s,
			strokeWidth: c
		},
		shapeRendering: d,
		onClick: p ? (t) => p(t, e) : void 0
	});
}
var Nm = (0, _.memo)(Mm), Pm = (e) => e.nodes.map((e) => e.id), Fm = (e) => e instanceof Function ? e : () => e;
function Im({ nodeStrokeColor: e, nodeColor: t, nodeClassName: n = "", nodeBorderRadius: r = 5, nodeStrokeWidth: i, nodeComponent: a = Nm, onClick: o }) {
	let s = Q(Pm, md), c = Fm(t), l = Fm(e), u = Fm(n), d = typeof window > "u" || window.chrome ? "crispEdges" : "geometricPrecision";
	return (0, q.jsx)(q.Fragment, { children: s.map((e) => (0, q.jsx)(Rm, {
		id: e,
		nodeColorFunc: c,
		nodeStrokeColorFunc: l,
		nodeClassNameFunc: u,
		nodeBorderRadius: r,
		nodeStrokeWidth: i,
		NodeComponent: a,
		onClick: o,
		shapeRendering: d
	}, e)) });
}
function Lm({ id: e, nodeColorFunc: t, nodeStrokeColorFunc: n, nodeClassNameFunc: r, nodeBorderRadius: i, nodeStrokeWidth: a, shapeRendering: o, NodeComponent: s, onClick: c }) {
	let { node: l, x: u, y: d, width: f, height: p } = Q((t) => {
		let n = t.nodeLookup.get(e);
		if (!n) return {
			node: void 0,
			x: 0,
			y: 0,
			width: 0,
			height: 0
		};
		let r = n.internals.userNode, { x: i, y: a } = n.internals.positionAbsolute, { width: o, height: s } = fl(r);
		return {
			node: r,
			x: i,
			y: a,
			width: o,
			height: s
		};
	}, md);
	return !l || l.hidden || !pl(l) ? null : (0, q.jsx)(s, {
		x: u,
		y: d,
		width: f,
		height: p,
		style: l.style,
		selected: !!l.selected,
		className: r(l),
		color: t(l),
		borderRadius: i,
		strokeColor: n(l),
		strokeWidth: a,
		shapeRendering: o,
		onClick: c,
		id: l.id
	});
}
var Rm = (0, _.memo)(Lm), zm = (0, _.memo)(Im), Bm = 200, Vm = 150, Hm = (e) => !e.hidden, Um = (e) => {
	let t = {
		x: -e.transform[0] / e.transform[2],
		y: -e.transform[1] / e.transform[2],
		width: e.width / e.transform[2],
		height: e.height / e.transform[2]
	};
	return {
		viewBB: t,
		boundingRect: e.nodeLookup.size > 0 ? Qc(Fc(e.nodeLookup, { filter: Hm }), t) : t,
		rfId: e.rfId,
		panZoom: e.panZoom,
		translateExtent: e.translateExtent,
		flowWidth: e.width,
		flowHeight: e.height,
		ariaLabelConfig: e.ariaLabelConfig
	};
}, Wm = "react-flow__minimap-desc";
function Gm({ style: e, className: t, nodeStrokeColor: n, nodeColor: r, nodeClassName: i = "", nodeBorderRadius: a = 5, nodeStrokeWidth: o, nodeComponent: s, bgColor: c, maskColor: l, maskStrokeColor: u, maskStrokeWidth: d, position: f = "bottom-right", onClick: p, onNodeClick: m, pannable: h = !1, zoomable: g = !1, ariaLabel: v, inversePan: y, zoomStep: b = 1, offsetScale: x = 5 }) {
	let S = $(), C = (0, _.useRef)(null), { boundingRect: w, viewBB: T, rfId: E, panZoom: D, translateExtent: O, flowWidth: k, flowHeight: A, ariaLabelConfig: j } = Q(Um, md), M = e?.width ?? Bm, N = e?.height ?? Vm, P = w.width / M, F = w.height / N, I = Math.max(P, F), L = I * M, R = I * N, ee = x * I, te = w.x - (L - w.width) / 2 - ee, z = w.y - (R - w.height) / 2 - ee, B = L + ee * 2, V = R + ee * 2, ne = `${Wm}-${E}`, H = (0, _.useRef)(0), U = (0, _.useRef)();
	H.current = I, (0, _.useEffect)(() => {
		if (C.current && D) return U.current = Ou({
			domNode: C.current,
			panZoom: D,
			getTransform: () => S.getState().transform,
			getViewScale: () => H.current
		}), () => {
			U.current?.destroy();
		};
	}, [D]), (0, _.useEffect)(() => {
		U.current?.update({
			translateExtent: O,
			width: k,
			height: A,
			inversePan: y,
			pannable: h,
			zoomStep: b,
			zoomable: g
		});
	}, [
		h,
		g,
		y,
		b,
		O,
		k,
		A
	]);
	let re = p ? (e) => {
		let [t, n] = U.current?.pointer(e) || [0, 0];
		p(e, {
			x: t,
			y: n
		});
	} : void 0, ie = m ? (0, _.useCallback)((e, t) => {
		let n = S.getState().nodeLookup.get(t).internals.userNode;
		m(e, n);
	}, []) : void 0, ae = v ?? j["minimap.ariaLabel"];
	return (0, q.jsx)(Od, {
		position: f,
		style: {
			...e,
			"--xy-minimap-background-color-props": typeof c == "string" ? c : void 0,
			"--xy-minimap-mask-background-color-props": typeof l == "string" ? l : void 0,
			"--xy-minimap-mask-stroke-color-props": typeof u == "string" ? u : void 0,
			"--xy-minimap-mask-stroke-width-props": typeof d == "number" ? d * I : void 0,
			"--xy-minimap-node-background-color-props": typeof r == "string" ? r : void 0,
			"--xy-minimap-node-stroke-color-props": typeof n == "string" ? n : void 0,
			"--xy-minimap-node-stroke-width-props": typeof o == "number" ? o : void 0
		},
		className: Pn(["react-flow__minimap", t]),
		"data-testid": "rf__minimap",
		children: (0, q.jsxs)("svg", {
			width: M,
			height: N,
			viewBox: `${te} ${z} ${B} ${V}`,
			className: "react-flow__minimap-svg",
			role: "img",
			"aria-labelledby": ne,
			ref: C,
			onClick: re,
			children: [
				ae && (0, q.jsx)("title", {
					id: ne,
					children: ae
				}),
				(0, q.jsx)(zm, {
					onClick: ie,
					nodeColor: r,
					nodeStrokeColor: n,
					nodeBorderRadius: a,
					nodeClassName: i,
					nodeStrokeWidth: o,
					nodeComponent: s
				}),
				(0, q.jsx)("path", {
					className: "react-flow__minimap-mask",
					d: `M${te - ee},${z - ee}h${B + ee * 2}v${V + ee * 2}h${-B - ee * 2}z
        M${T.x},${T.y}h${T.width}v${T.height}h${-T.width}z`,
					fillRule: "evenodd",
					pointerEvents: "none"
				})
			]
		})
	});
}
Gm.displayName = "MiniMap", (0, _.memo)(Gm);
var Km = (e) => (t) => e ? `${Math.max(1 / t.transform[2], 1)}` : void 0, qm = {
	[Uu.Line]: "right",
	[Uu.Handle]: "bottom-right"
};
function Jm({ nodeId: e, position: t, variant: n = Uu.Handle, className: r, style: i = void 0, children: a, color: o, minWidth: s = 10, minHeight: c = 10, maxWidth: l = Number.MAX_VALUE, maxHeight: u = Number.MAX_VALUE, keepAspectRatio: d = !1, resizeDirection: f, autoScale: p = !0, shouldResize: m, onResizeStart: h, onResize: g, onResizeEnd: v }) {
	let y = Nf(), b = typeof e == "string" ? e : y, x = $(), S = (0, _.useRef)(null), C = n === Uu.Handle, w = Q((0, _.useCallback)(Km(C && p), [C, p]), md), T = (0, _.useRef)(null), E = t ?? qm[n];
	return (0, _.useEffect)(() => {
		if (!(!S.current || !b)) return T.current ||= td({
			domNode: S.current,
			nodeId: b,
			getStoreItems: () => {
				let { nodeLookup: e, transform: t, snapGrid: n, snapToGrid: r, nodeOrigin: i, domNode: a } = x.getState();
				return {
					nodeLookup: e,
					transform: t,
					snapGrid: n,
					snapToGrid: r,
					nodeOrigin: i,
					paneDomNode: a
				};
			},
			onChange: (e, t) => {
				let { triggerNodeChanges: n, nodeLookup: r, parentLookup: i, nodeOrigin: a } = x.getState(), o = [], s = {
					x: e.x,
					y: e.y
				}, c = r.get(b);
				if (c && c.expandParent && c.parentId) {
					let t = c.origin ?? a, n = e.width ?? c.measured.width ?? 0, l = e.height ?? c.measured.height ?? 0, u = su([{
						id: c.id,
						parentId: c.parentId,
						rect: {
							width: n,
							height: l,
							...ml({
								x: e.x ?? c.position.x,
								y: e.y ?? c.position.y
							}, {
								width: n,
								height: l
							}, c.parentId, r, t)
						}
					}], r, i, a);
					o.push(...u), s.x = e.x ? Math.max(t[0] * n, e.x) : void 0, s.y = e.y ? Math.max(t[1] * l, e.y) : void 0;
				}
				if (s.x !== void 0 && s.y !== void 0) {
					let e = {
						id: b,
						type: "position",
						position: { ...s }
					};
					o.push(e);
				}
				if (e.width !== void 0 && e.height !== void 0) {
					let t = {
						id: b,
						type: "dimensions",
						resizing: !0,
						setAttributes: f ? f === "horizontal" ? "width" : "height" : !0,
						dimensions: {
							width: e.width,
							height: e.height
						}
					};
					o.push(t);
				}
				for (let e of t) {
					let t = {
						...e,
						type: "position"
					};
					o.push(t);
				}
				n(o);
			},
			onEnd: ({ width: e, height: t }) => {
				let n = {
					id: b,
					type: "dimensions",
					resizing: !1,
					dimensions: {
						width: e,
						height: t
					}
				};
				x.getState().triggerNodeChanges([n]);
			}
		}), T.current.update({
			controlPosition: E,
			boundaries: {
				minWidth: s,
				minHeight: c,
				maxWidth: l,
				maxHeight: u
			},
			keepAspectRatio: d,
			resizeDirection: f,
			onResizeStart: h,
			onResize: g,
			onResizeEnd: v,
			shouldResize: m
		}), () => {
			T.current?.destroy();
		};
	}, [
		E,
		s,
		c,
		l,
		u,
		d,
		h,
		g,
		v,
		m
	]), (0, q.jsx)("div", {
		className: Pn([
			"react-flow__resize-control",
			"nodrag",
			...E.split("-"),
			n,
			r
		]),
		ref: S,
		style: {
			...i,
			scale: w,
			...o && { [C ? "backgroundColor" : "borderColor"]: o }
		},
		children: a
	});
}
(0, _.memo)(Jm);
//#endregion
//#region src/components/nodes/AutomationNode.tsx
var Ym = {
	mb: "border-l-teal-500",
	lr: "border-l-amber-500",
	abi: "border-l-violet-500",
	common: "border-l-slate-500",
	system: "border-l-slate-500"
};
function Xm({ data: e }) {
	let t = gn(e.autoId), n = Ym[e.area], r = e.direction === "TB", i = r ? Y.Top : Y.Left, a = r ? Y.Bottom : Y.Right;
	return /* @__PURE__ */ (0, q.jsxs)("div", {
		className: `flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-card-foreground shadow-sm border-l-4 ${n} cursor-pointer hover:bg-accent`,
		onClick: () => Nn({
			name: "auto",
			id: e.autoId
		}),
		children: [
			/* @__PURE__ */ (0, q.jsx)(Lf, {
				type: "target",
				position: i
			}),
			/* @__PURE__ */ (0, q.jsx)("span", {
				className: "text-sm font-medium",
				children: e.label
			}),
			/* @__PURE__ */ (0, q.jsx)(Jt, {
				variant: t ? "default" : "secondary",
				className: "text-[10px]",
				children: t ? "on" : "off"
			}),
			e.mode !== "single" && /* @__PURE__ */ (0, q.jsx)(Jt, {
				variant: "outline",
				className: "text-[10px]",
				children: e.mode
			}),
			/* @__PURE__ */ (0, q.jsx)(Lf, {
				type: "source",
				position: a
			})
		]
	});
}
//#endregion
//#region src/components/nodes/EntityNode.tsx
var Zm = {
	mb: "border-l-teal-500",
	lr: "border-l-amber-500",
	abi: "border-l-violet-500",
	common: "border-l-slate-500",
	system: "border-l-slate-500"
};
function Qm({ data: e }) {
	let t = hn(e.entityId), n = e.direction === "TB", r = n ? Y.Top : Y.Left, i = n ? Y.Bottom : Y.Right;
	return /* @__PURE__ */ (0, q.jsxs)("div", {
		className: `flex items-center gap-2 rounded-md border bg-muted px-2 py-1 text-xs border-l-4 ${Zm[e.area]}`,
		children: [
			/* @__PURE__ */ (0, q.jsx)(Lf, {
				type: "target",
				position: r
			}),
			/* @__PURE__ */ (0, q.jsx)("span", {
				className: "font-mono",
				children: e.entityId
			}),
			t && /* @__PURE__ */ (0, q.jsx)(Jt, {
				variant: "secondary",
				className: "font-mono text-[10px]",
				children: t
			}),
			/* @__PURE__ */ (0, q.jsx)(Lf, {
				type: "source",
				position: i
			})
		]
	});
}
//#endregion
//#region node_modules/.pnpm/lucide-react@1.17.0_react@19.2.6/node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs
var $m = (...e) => e.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim(), eh = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), th = (e) => e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, n) => n ? n.toUpperCase() : t.toLowerCase()), nh = (e) => {
	let t = th(e);
	return t.charAt(0).toUpperCase() + t.slice(1);
}, rh = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 2,
	strokeLinecap: "round",
	strokeLinejoin: "round"
}, ih = (e) => {
	for (let t in e) if (t.startsWith("aria-") || t === "role" || t === "title") return !0;
	return !1;
}, ah = (0, _.createContext)({}), oh = () => (0, _.useContext)(ah), sh = (0, _.forwardRef)(({ color: e, size: t, strokeWidth: n, absoluteStrokeWidth: r, className: i = "", children: a, iconNode: o, ...s }, c) => {
	let { size: l = 24, strokeWidth: u = 2, absoluteStrokeWidth: d = !1, color: f = "currentColor", className: p = "" } = oh() ?? {}, m = r ?? d ? Number(n ?? u) * 24 / Number(t ?? l) : n ?? u;
	return (0, _.createElement)("svg", {
		ref: c,
		...rh,
		width: t ?? l ?? rh.width,
		height: t ?? l ?? rh.height,
		stroke: e ?? f,
		strokeWidth: m,
		className: $m("lucide", p, i),
		...!a && !ih(s) && { "aria-hidden": "true" },
		...s
	}, [...o.map(([e, t]) => (0, _.createElement)(e, t)), ...Array.isArray(a) ? a : [a]]);
}), ch = (e, t) => {
	let n = (0, _.forwardRef)(({ className: n, ...r }, i) => (0, _.createElement)(sh, {
		ref: i,
		iconNode: t,
		className: $m(`lucide-${eh(nh(e))}`, `lucide-${e}`, n),
		...r
	}));
	return n.displayName = nh(e), n;
}, lh = ch("scroll-text", [
	["path", {
		d: "M15 12h-5",
		key: "r7krc0"
	}],
	["path", {
		d: "M15 8h-5",
		key: "1khuty"
	}],
	["path", {
		d: "M19 17V5a2 2 0 0 0-2-2H4",
		key: "zz82l3"
	}],
	["path", {
		d: "M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3",
		key: "1ph1d7"
	}]
]), uh = ch("sparkles", [
	["path", {
		d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
		key: "1s2grr"
	}],
	["path", {
		d: "M20 2v4",
		key: "1rf3ol"
	}],
	["path", {
		d: "M22 4h-4",
		key: "gwowj6"
	}],
	["circle", {
		cx: "4",
		cy: "20",
		r: "2",
		key: "6kqj1y"
	}]
]), dh = ch("x", [["path", {
	d: "M18 6 6 18",
	key: "1bl5f8"
}], ["path", {
	d: "m6 6 12 12",
	key: "d8bk6v"
}]]);
//#endregion
//#region src/components/nodes/ScriptNode.tsx
function fh({ data: e }) {
	let t = e.direction === "TB", n = t ? Y.Top : Y.Left, r = t ? Y.Bottom : Y.Right;
	return /* @__PURE__ */ (0, q.jsxs)("div", {
		className: "flex items-center gap-2 rounded-md border border-dashed bg-card px-3 py-2 text-sm",
		children: [
			/* @__PURE__ */ (0, q.jsx)(Lf, {
				type: "target",
				position: n
			}),
			/* @__PURE__ */ (0, q.jsx)(lh, { className: "size-4" }),
			/* @__PURE__ */ (0, q.jsx)("span", { children: e.label }),
			/* @__PURE__ */ (0, q.jsx)(Lf, {
				type: "source",
				position: r
			})
		]
	});
}
//#endregion
//#region src/components/nodes/SceneNode.tsx
function ph({ data: e }) {
	let t = e.direction === "TB", n = t ? Y.Top : Y.Left, r = t ? Y.Bottom : Y.Right;
	return /* @__PURE__ */ (0, q.jsxs)("div", {
		className: "flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm",
		children: [
			/* @__PURE__ */ (0, q.jsx)(Lf, {
				type: "target",
				position: n
			}),
			/* @__PURE__ */ (0, q.jsx)(uh, { className: "size-4" }),
			/* @__PURE__ */ (0, q.jsx)("span", { children: e.label }),
			/* @__PURE__ */ (0, q.jsx)(Lf, {
				type: "source",
				position: r
			})
		]
	});
}
//#endregion
//#region src/components/nodes/index.ts
var mh = {
	automation: Xm,
	entity: Qm,
	script: fh,
	scene: ph,
	template: Qm
}, hh = {
	trigger: { stroke: "var(--color-emerald-500)" },
	condition: {
		stroke: "var(--color-amber-500)",
		strokeDasharray: "4 4"
	},
	action: { stroke: "var(--color-sky-500)" },
	script_call: { stroke: "var(--color-fuchsia-500)" },
	scene_call: { stroke: "var(--color-pink-500)" },
	template: {
		stroke: "var(--color-zinc-500)",
		strokeDasharray: "2 2"
	}
};
function gh({ manifest: e, onSelect: t }) {
	let n = (0, _.useMemo)(() => e.nodes.map((t) => {
		let n = t.kind === "automation" ? {
			autoId: t.id.replace(/^auto:/, ""),
			label: t.label,
			area: t.area,
			mode: e.automations[t.id.replace(/^auto:/, "")]?.mode ?? "single"
		} : t.kind === "entity" || t.kind === "template" ? {
			entityId: t.id,
			label: t.label,
			area: t.area
		} : {
			label: t.label,
			area: t.area
		};
		return {
			id: t.id,
			type: t.kind,
			position: t.position,
			data: n
		};
	}), [e]), r = (0, _.useMemo)(() => e.edges.map((e) => ({
		id: e.id,
		source: e.source,
		target: e.target,
		style: hh[e.kind],
		animated: !1
	})), [e]), i = (0, _.useMemo)(() => {
		let t = /* @__PURE__ */ new Map();
		for (let n of e.nodes) t.set(n.id, n);
		return t;
	}, [e]);
	return /* @__PURE__ */ (0, q.jsx)("div", {
		className: "h-[calc(100svh-4rem)] w-full",
		children: /* @__PURE__ */ (0, q.jsxs)(hm, {
			nodes: n,
			edges: r,
			nodeTypes: mh,
			onNodeClick: (0, _.useCallback)((e, n) => {
				let r = i.get(n.id);
				r && r.kind !== "automation" && t(r);
			}, [i, t]),
			fitView: !0,
			proOptions: { hideAttribution: !0 },
			children: [/* @__PURE__ */ (0, q.jsx)(Sm, {}), /* @__PURE__ */ (0, q.jsx)(jm, {})]
		})
	});
}
//#endregion
//#region node_modules/.pnpm/@floating-ui+utils@0.2.11/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
function _h() {
	return typeof window < "u";
}
function vh(e) {
	return xh(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function yh(e) {
	var t;
	return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function bh(e) {
	return ((xh(e) ? e.ownerDocument : e.document) || window.document)?.documentElement;
}
function xh(e) {
	return _h() ? e instanceof Node || e instanceof yh(e).Node : !1;
}
function Sh(e) {
	return _h() ? e instanceof Element || e instanceof yh(e).Element : !1;
}
function Ch(e) {
	return _h() ? e instanceof HTMLElement || e instanceof yh(e).HTMLElement : !1;
}
function wh(e) {
	return !_h() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof yh(e).ShadowRoot;
}
function Th(e) {
	let { overflow: t, overflowX: n, overflowY: r, display: i } = kh(e);
	return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && i !== "inline" && i !== "contents";
}
var Eh;
function Dh() {
	return Eh ??= typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none"), Eh;
}
function Oh(e) {
	return /^(html|body|#document)$/.test(vh(e));
}
function kh(e) {
	return yh(e).getComputedStyle(e);
}
function Ah(e) {
	if (vh(e) === "html") return e;
	let t = e.assignedSlot || e.parentNode || wh(e) && e.host || bh(e);
	return wh(t) ? t.host : t;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.2.9_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/utils/esm/safeReact.js
var jh = { ..._ }, Mh = jh.useInsertionEffect, Nh = Mh && Mh !== jh.useLayoutEffect ? Mh : (e) => e();
function Ph(e) {
	let t = R(Fh).current;
	return t.next = e, Nh(t.effect), t.trampoline;
}
function Fh() {
	let e = {
		next: void 0,
		callback: Ih,
		trampoline: (...t) => e.callback?.(...t),
		effect: () => {
			e.callback = e.next;
		}
	};
	return e;
}
function Ih() {}
var Lh = typeof document < "u" ? _.useLayoutEffect : () => {}, Rh = /* @__PURE__ */ _.createContext(void 0);
function zh(e = !1) {
	let t = _.useContext(Rh);
	if (t === void 0 && !e) throw Error(I(16));
	return t;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/utils/useFocusableWhenDisabled.js
function Bh(e) {
	let { focusableWhenDisabled: t, disabled: n, composite: r = !1, tabIndex: i = 0, isNativeButton: a } = e, o = r && t !== !1, s = r && t === !1;
	return { props: _.useMemo(() => {
		let e = { onKeyDown(e) {
			n && t && e.key !== "Tab" && e.preventDefault();
		} };
		return r || (e.tabIndex = i, !a && n && (e.tabIndex = t ? i : -1)), (a && (t || o) || !a && n) && (e["aria-disabled"] = n), a && (!t || s) && (e.disabled = n), e;
	}, [
		r,
		n,
		t,
		o,
		s,
		a,
		i
	]) };
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/internals/use-button/useButton.js
function Vh(e = {}) {
	let { disabled: t = !1, focusableWhenDisabled: n, tabIndex: r = 0, native: i = !0, composite: a } = e, o = _.useRef(null), s = zh(!0), c = a ?? s !== void 0, { props: l } = Bh({
		focusableWhenDisabled: n,
		disabled: t,
		composite: c,
		tabIndex: r,
		isNativeButton: i
	}), u = _.useCallback(() => {
		let e = o.current;
		Hh(e) && c && t && l.disabled === void 0 && e.disabled && (e.disabled = !1);
	}, [
		t,
		l.disabled,
		c
	]);
	return Lh(u, [u]), {
		getButtonProps: _.useCallback((e = {}) => {
			let { onClick: n, onMouseDown: r, onKeyUp: a, onKeyDown: o, onPointerDown: s, ...u } = e;
			return x({
				onClick(e) {
					if (t) {
						e.preventDefault();
						return;
					}
					n?.(e);
				},
				onMouseDown(e) {
					t || r?.(e);
				},
				onKeyDown(e) {
					if (t || (M(e), o?.(e), e.baseUIHandlerPrevented)) return;
					let r = e.target === e.currentTarget, a = e.currentTarget, s = Hh(a), l = !i && Uh(a), u = r && (i ? s : !l), d = e.key === "Enter", f = e.key === " ", p = a.getAttribute("role"), m = p?.startsWith("menuitem") || p === "option" || p === "gridcell";
					if (r && c && f) {
						if (e.defaultPrevented && m) return;
						e.preventDefault(), l || i && s ? (a.click(), e.preventBaseUIHandler()) : u && (n?.(e), e.preventBaseUIHandler());
						return;
					}
					u && (!i && (f || d) && e.preventDefault(), !i && d && n?.(e));
				},
				onKeyUp(e) {
					if (!t) {
						if (M(e), a?.(e), e.target === e.currentTarget && i && c && Hh(e.currentTarget) && e.key === " ") {
							e.preventDefault();
							return;
						}
						e.baseUIHandlerPrevented || e.target === e.currentTarget && !i && !c && e.key === " " && n?.(e);
					}
				},
				onPointerDown(e) {
					if (t) {
						e.preventDefault();
						return;
					}
					s?.(e);
				}
			}, i ? { type: "button" } : { role: "button" }, l, u);
		}, [
			t,
			l,
			c,
			i
		]),
		buttonRef: Ph((e) => {
			o.current = e, u();
		})
	};
}
function Hh(e) {
	return Ch(e) && e.tagName === "BUTTON";
}
function Uh(e) {
	return !!(e?.tagName === "A" && e?.href);
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/button/Button.js
var Wh = /* @__PURE__ */ _.forwardRef(function(e, t) {
	let { render: n, className: r, disabled: i = !1, focusableWhenDisabled: a = !1, nativeButton: o = !0, style: s, ...c } = e, { getButtonProps: l, buttonRef: u } = Vh({
		disabled: i,
		focusableWhenDisabled: a,
		native: o
	});
	return le("button", e, {
		state: { disabled: i },
		ref: [t, u],
		props: [c, l]
	});
}), Gh = be("group/button inline-flex shrink-0 items-center justify-center rounded-none border border-transparent bg-clip-padding text-xs font-semibold tracking-widest whitespace-nowrap uppercase transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/80",
			outline: "border-border bg-transparent hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-input/30",
			secondary: "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
			ghost: "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
			destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
			link: "text-primary underline underline-offset-4 hover:underline"
		},
		size: {
			default: "h-10 gap-1.5 px-6 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
			xs: "h-7 gap-1 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
			sm: "h-9 gap-1 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
			lg: "h-11 gap-1.5 px-8 has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
			icon: "size-10",
			"icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3",
			"icon-sm": "size-9",
			"icon-lg": "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Kh({ className: e, variant: t = "default", size: n = "default", ...r }) {
	return /* @__PURE__ */ (0, q.jsx)(Wh, {
		"data-slot": "button",
		className: Kt(Gh({
			variant: t,
			size: n,
			className: e
		})),
		...r
	});
}
//#endregion
//#region src/components/ui/card.tsx
function qh({ className: e, size: t = "default", ...n }) {
	return /* @__PURE__ */ (0, q.jsx)("div", {
		"data-slot": "card",
		"data-size": t,
		className: Kt("group/card flex flex-col gap-8 overflow-hidden bg-card py-8 text-sm text-card-foreground shadow-sm ring-1 ring-foreground/5 has-[>img:first-child]:pt-0 data-[size=sm]:gap-5 data-[size=sm]:py-5 *:[img:first-child]:rounded-none *:[img:last-child]:rounded-none", e),
		...n
	});
}
function Jh({ className: e, ...t }) {
	return /* @__PURE__ */ (0, q.jsx)("div", {
		"data-slot": "card-header",
		className: Kt("group/card-header @container/card-header grid auto-rows-min items-start gap-1.5 rounded-none px-8 group-data-[size=sm]/card:px-5 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-8 group-data-[size=sm]/card:[.border-b]:pb-5", e),
		...t
	});
}
function Yh({ className: e, ...t }) {
	return /* @__PURE__ */ (0, q.jsx)("div", {
		"data-slot": "card-title",
		className: Kt("font-heading text-lg font-semibold tracking-wider uppercase", e),
		...t
	});
}
function Xh({ className: e, ...t }) {
	return /* @__PURE__ */ (0, q.jsx)("div", {
		"data-slot": "card-content",
		className: Kt("px-8 group-data-[size=sm]/card:px-5", e),
		...t
	});
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.2.9_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/utils/esm/useOnMount.js
var Zh = [];
function Qh(e) {
	_.useEffect(e, Zh);
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.2.9_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/utils/esm/useTimeout.js
var $h = 0, eg = class e {
	static create() {
		return new e();
	}
	currentId = $h;
	start(e, t) {
		this.clear(), this.currentId = setTimeout(() => {
			this.currentId = $h, t();
		}, e);
	}
	isStarted() {
		return this.currentId !== $h;
	}
	clear = () => {
		this.currentId !== $h && (clearTimeout(this.currentId), this.currentId = $h);
	};
	disposeEffect = () => this.clear;
};
function tg() {
	let e = R(eg.create).current;
	return Qh(e.disposeEffect), e;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/scroll-area/root/ScrollAreaRootContext.js
var ng = /* @__PURE__ */ _.createContext(void 0);
function rg() {
	let e = _.useContext(ng);
	if (e === void 0) throw Error(I(53));
	return e;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/scroll-area/root/ScrollAreaRootCssVars.js
var ig = /* @__PURE__ */ function(e) {
	return e.scrollAreaCornerHeight = "--scroll-area-corner-height", e.scrollAreaCornerWidth = "--scroll-area-corner-width", e;
}({});
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/scroll-area/utils/getOffset.js
function ag(e, t, n) {
	if (!e) return 0;
	let r = getComputedStyle(e), i = n === "x" ? "Inline" : "Block";
	return n === "x" && t === "margin" ? parseFloat(r[`${t}InlineStart`]) * 2 : parseFloat(r[`${t}${i}Start`]) + parseFloat(r[`${t}${i}End`]);
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/scroll-area/scrollbar/ScrollAreaScrollbarDataAttributes.js
var og = /* @__PURE__ */ function(e) {
	return e.orientation = "data-orientation", e.hovering = "data-hovering", e.scrolling = "data-scrolling", e.hasOverflowX = "data-has-overflow-x", e.hasOverflowY = "data-has-overflow-y", e.overflowXStart = "data-overflow-x-start", e.overflowXEnd = "data-overflow-x-end", e.overflowYStart = "data-overflow-y-start", e.overflowYEnd = "data-overflow-y-end", e;
}({}), sg = "base-ui-disable-scrollbar", cg = {
	className: sg,
	getElement(e) {
		return /* @__PURE__ */ (0, q.jsx)("style", {
			nonce: e,
			href: sg,
			precedence: "base-ui:low",
			children: `.${sg}{scrollbar-width:none}.${sg}::-webkit-scrollbar{display:none}`
		});
	}
}, lg = 0;
function ug(e, t = "mui") {
	let [n, r] = _.useState(e), i = e || n;
	return _.useEffect(() => {
		n ?? (lg += 1, r(`${t}-${lg}`));
	}, [n, t]), i;
}
var dg = jh.useId;
function fg(e, t) {
	if (dg !== void 0) {
		let n = dg();
		return e ?? (t ? `${t}-${n}` : n);
	}
	return ug(e, t);
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/internals/useBaseUiId.js
function pg(e) {
	return fg(e, "base-ui");
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/scroll-area/root/ScrollAreaRootDataAttributes.js
var mg = /* @__PURE__ */ function(e) {
	return e.scrolling = "data-scrolling", e.hasOverflowX = "data-has-overflow-x", e.hasOverflowY = "data-has-overflow-y", e.overflowXStart = "data-overflow-x-start", e.overflowXEnd = "data-overflow-x-end", e.overflowYStart = "data-overflow-y-start", e.overflowYEnd = "data-overflow-y-end", e;
}({}), hg = {
	hasOverflowX: (e) => e ? { [mg.hasOverflowX]: "" } : null,
	hasOverflowY: (e) => e ? { [mg.hasOverflowY]: "" } : null,
	overflowXStart: (e) => e ? { [mg.overflowXStart]: "" } : null,
	overflowXEnd: (e) => e ? { [mg.overflowXEnd]: "" } : null,
	overflowYStart: (e) => e ? { [mg.overflowYStart]: "" } : null,
	overflowYEnd: (e) => e ? { [mg.overflowYEnd]: "" } : null,
	cornerHidden: () => null
}, gg = typeof navigator < "u", _g = Tg(), vg = Dg(), yg = Eg(), bg = typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter:none"), xg = _g.platform === "MacIntel" && _g.maxTouchPoints > 1 ? !0 : /iP(hone|ad|od)|iOS/.test(_g.platform);
gg && /firefox/i.test(yg);
var Sg = gg && /apple/i.test(navigator.vendor);
gg && /Edg/i.test(yg);
var Cg = gg && /android/i.test(vg) || /android/i.test(yg);
gg && vg.toLowerCase().startsWith("mac") && navigator.maxTouchPoints;
var wg = yg.includes("jsdom/");
function Tg() {
	if (!gg) return {
		platform: "",
		maxTouchPoints: -1
	};
	let e = navigator.userAgentData;
	return e?.platform ? {
		platform: e.platform,
		maxTouchPoints: navigator.maxTouchPoints
	} : {
		platform: navigator.platform ?? "",
		maxTouchPoints: navigator.maxTouchPoints ?? -1
	};
}
function Eg() {
	if (!gg) return "";
	let e = navigator.userAgentData;
	return e && Array.isArray(e.brands) ? e.brands.map(({ brand: e, version: t }) => `${e}/${t}`).join(" ") : navigator.userAgent;
}
function Dg() {
	if (!gg) return "";
	let e = navigator.userAgentData;
	return e?.platform ? e.platform : navigator.platform ?? "";
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/floating-ui-react/utils/constants.js
var Og = "data-base-ui-focusable";
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/internals/shadowDom.js
function kg(e) {
	let t = e.activeElement;
	for (; t?.shadowRoot?.activeElement != null;) t = t.shadowRoot.activeElement;
	return t;
}
function Ag(e, t) {
	if (!e || !t) return !1;
	let n = t.getRootNode?.();
	if (e.contains(t)) return !0;
	if (n && wh(n)) {
		let n = t;
		for (; n;) {
			if (e === n) return !0;
			n = n.parentNode || n.host;
		}
	}
	return !1;
}
function jg(e) {
	return "composedPath" in e ? e.composedPath()[0] : e.target;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/floating-ui-react/utils/element.js
function Mg(e, t) {
	if (t == null) return !1;
	if ("composedPath" in e) return e.composedPath().includes(t);
	let n = e;
	return n.target != null && t.contains(n.target);
}
function Ng(e) {
	return e.matches("html,body");
}
function Pg(e) {
	return Ch(e) && e.matches("input:not([type='hidden']):not([disabled]),[contenteditable]:not([contenteditable='false']),textarea:not([disabled])");
}
function Fg(e) {
	return e ? e.getAttribute("role") === "combobox" && Pg(e) : !1;
}
function Ig(e) {
	return e ? e.hasAttribute("data-base-ui-focusable") ? e : e.querySelector("[data-base-ui-focusable]") || e : null;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/floating-ui-react/utils/nodes.js
function Lg(e, t, n = !0) {
	return e.filter((e) => e.parentId === t).flatMap((t) => [...!n || t.context?.open ? [t] : [], ...Lg(e, t.id, n)]);
}
function Rg(e, t) {
	let n = [], r = e.find((e) => e.id === t)?.parentId;
	for (; r;) {
		let t = e.find((e) => e.id === r);
		r = t?.parentId, t && (n = n.concat(t));
	}
	return n;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/floating-ui-react/utils/event.js
function zg(e) {
	e.preventDefault(), e.stopPropagation();
}
function Bg(e) {
	return "nativeEvent" in e;
}
function Vg(e) {
	return e.pointerType === "" && e.isTrusted ? !0 : Cg && e.pointerType ? e.type === "click" && e.buttons === 1 : e.detail === 0 && !e.pointerType;
}
function Hg(e) {
	return wg ? !1 : !Cg && e.width === 0 && e.height === 0 || Cg && e.width === 1 && e.height === 1 && e.pressure === 0 && e.detail === 0 && e.pointerType === "mouse" || e.width < 1 && e.height < 1 && e.pressure === 0 && e.detail === 0 && e.pointerType === "touch";
}
function Ug(e) {
	let t = e.type;
	return t === "click" || t === "mousedown" || t === "keydown" || t === "keyup";
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/floating-ui-react/utils/composite.js
function Wg(e) {
	return e.visibility === "hidden" || e.visibility === "collapse";
}
function Gg(e, t = e ? kh(e) : null) {
	return !e || !e.isConnected || !t || Wg(t) ? !1 : typeof e.checkVisibility == "function" ? e.checkVisibility() : t.display !== "none" && t.display !== "contents";
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.2.9_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/utils/esm/owner.js
function Kg(e) {
	return e?.ownerDocument || document;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/floating-ui-react/utils/tabbable.js
var qg = "a[href],button,input,select,textarea,summary,details,iframe,object,embed,[tabindex],[contenteditable]:not([contenteditable=\"false\"]),audio[controls],video[controls]";
function Jg(e) {
	let t = e.assignedSlot;
	if (t) return t;
	if (e.parentElement) return e.parentElement;
	let n = e.getRootNode();
	return wh(n) ? n.host : null;
}
function Yg(e) {
	for (let t of Array.from(e.children)) if (vh(t) === "summary") return t;
	return null;
}
function Xg(e, t) {
	let n = Yg(t);
	return !!n && (e === n || Ag(n, e));
}
function Zg(e) {
	let t = e ? vh(e) : "";
	return e != null && e.matches(qg) && (t !== "summary" || e.parentElement != null && vh(e.parentElement) === "details" && Yg(e.parentElement) === e) && (t !== "details" || Yg(e) == null) && (t !== "input" || e.type !== "hidden");
}
function Qg(e) {
	if (!Zg(e) || !e.isConnected || e.matches(":disabled")) return !1;
	for (let t = e; t; t = Jg(t)) {
		let n = t !== e, r = vh(t) === "slot";
		if (t.hasAttribute("inert") || n && vh(t) === "details" && !t.open && !Xg(e, t) || t.hasAttribute("hidden") || !r && !$g(t, n)) return !1;
	}
	return !0;
}
function $g(e, t) {
	let n = kh(e);
	return t ? n.display !== "none" : Gg(e, n);
}
function e_(e) {
	let t = e.tabIndex;
	if (t < 0) {
		let t = vh(e);
		if (t === "details" || t === "audio" || t === "video" || Ch(e) && e.isContentEditable) return 0;
	}
	return t;
}
function t_(e) {
	if (vh(e) !== "input") return null;
	let t = e;
	return t.type === "radio" && t.name !== "" ? t : null;
}
function n_(e, t) {
	let n = t_(e);
	if (!n) return !0;
	let r = t.find((e) => {
		let t = t_(e);
		return t?.name === n.name && t.form === n.form && t.checked;
	});
	return r ? r === n : t.find((e) => {
		let t = t_(e);
		return t?.name === n.name && t.form === n.form;
	}) === n;
}
function r_(e) {
	if (Ch(e) && vh(e) === "slot") {
		let t = e.assignedElements({ flatten: !0 });
		if (t.length > 0) return t;
	}
	return Ch(e) && e.shadowRoot ? Array.from(e.shadowRoot.children) : Array.from(e.children);
}
function i_(e, t) {
	r_(e).forEach((e) => {
		Zg(e) && t.push(e), i_(e, t);
	});
}
function a_(e, t, n) {
	r_(e).forEach((e) => {
		Ch(e) && e.matches(t) && n.push(e), a_(e, t, n);
	});
}
function o_(e) {
	return Qg(e) && e_(e) >= 0;
}
function s_(e) {
	let t = [];
	return i_(e, t), t.filter(Qg);
}
function c_(e) {
	let t = s_(e);
	return t.filter((e) => e_(e) >= 0 && n_(e, t));
}
function l_(e, t) {
	let n = c_(e), r = n.length;
	if (r === 0) return;
	let i = kg(Kg(e)), a = n.indexOf(i);
	return n[a === -1 ? t === 1 ? 0 : r - 1 : a + t];
}
function u_(e) {
	return l_(Kg(e).body, 1) || e;
}
function d_(e) {
	return l_(Kg(e).body, -1) || e;
}
function f_(e, t) {
	let n = t || e.currentTarget, r = e.relatedTarget;
	return !r || !Ag(n, r);
}
function p_(e) {
	c_(e).forEach((e) => {
		e.dataset.tabindex = e.getAttribute("tabindex") || "", e.setAttribute("tabindex", "-1");
	});
}
function m_(e) {
	let t = [];
	a_(e, "[data-tabindex]", t), t.forEach((e) => {
		let t = e.dataset.tabindex;
		delete e.dataset.tabindex, t ? e.setAttribute("tabindex", t) : e.removeAttribute("tabindex");
	});
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/internals/csp-context/CSPContext.js
var h_ = /* @__PURE__ */ _.createContext(void 0), g_ = { disableStyleElements: !1 };
function __() {
	return _.useContext(h_) ?? g_;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/scroll-area/root/ScrollAreaRoot.js
var v_ = {
	x: 0,
	y: 0
}, y_ = {
	width: 0,
	height: 0
}, b_ = {
	xStart: !1,
	xEnd: !1,
	yStart: !1,
	yEnd: !1
}, x_ = {
	x: !0,
	y: !0,
	corner: !0
}, S_ = /* @__PURE__ */ _.forwardRef(function(e, t) {
	let { render: n, className: r, overflowEdgeThreshold: i, style: a, ...o } = e, s = C_(i), c = pg(), l = tg(), u = tg(), { nonce: d, disableStyleElements: f } = __(), [p, m] = _.useState(!1), [h, g] = _.useState(!1), [v, y] = _.useState(!1), [b, x] = _.useState(!1), [S, C] = _.useState(!1), [w, T] = _.useState(y_), [E, D] = _.useState(y_), [O, k] = _.useState(b_), [A, j] = _.useState(x_), M = _.useRef(null), N = _.useRef(null), P = _.useRef(null), F = _.useRef(null), I = _.useRef(null), L = _.useRef(null), R = _.useRef(null), ee = _.useRef(!1), te = _.useRef(0), z = _.useRef(0), B = _.useRef(0), V = _.useRef(0), ne = _.useRef("vertical"), H = _.useRef(v_), U = Ph((e) => {
		let t = e.x - H.current.x, n = e.y - H.current.y;
		H.current = e, n !== 0 && (y(!0), l.start(500, () => {
			y(!1);
		})), t !== 0 && (g(!0), u.start(500, () => {
			g(!1);
		}));
	}), re = Ph((e) => {
		e.button === 0 && (ee.current = !0, te.current = e.clientY, z.current = e.clientX, ne.current = e.currentTarget.getAttribute(og.orientation), N.current && (B.current = N.current.scrollTop, V.current = N.current.scrollLeft), I.current && ne.current === "vertical" && I.current.setPointerCapture(e.pointerId), L.current && ne.current === "horizontal" && L.current.setPointerCapture(e.pointerId));
	}), ie = Ph((e) => {
		if (!ee.current) return;
		let t = e.clientY - te.current, n = e.clientX - z.current;
		if (N.current) {
			let r = N.current.scrollHeight, i = N.current.clientHeight, a = N.current.scrollWidth, o = N.current.clientWidth;
			if (I.current && P.current && ne.current === "vertical") {
				let n = ag(P.current, "padding", "y"), a = ag(I.current, "margin", "y"), o = I.current.offsetHeight, s = t / (P.current.offsetHeight - o - n - a);
				N.current.scrollTop = B.current + s * (r - i), e.preventDefault(), y(!0), l.start(500, () => {
					y(!1);
				});
			}
			if (L.current && F.current && ne.current === "horizontal") {
				let t = ag(F.current, "padding", "x"), r = ag(L.current, "margin", "x"), i = L.current.offsetWidth, s = n / (F.current.offsetWidth - i - t - r);
				N.current.scrollLeft = V.current + s * (a - o), e.preventDefault(), g(!0), u.start(500, () => {
					g(!1);
				});
			}
		}
	}), ae = Ph((e) => {
		ee.current = !1, I.current && ne.current === "vertical" && I.current.releasePointerCapture(e.pointerId), L.current && ne.current === "horizontal" && L.current.releasePointerCapture(e.pointerId);
	});
	function oe(e) {
		x(e.pointerType === "touch");
	}
	function se(e) {
		oe(e), e.pointerType !== "touch" && m(Ag(M.current, e.target));
	}
	let ce = _.useMemo(() => ({
		scrolling: h || v,
		hasOverflowX: !A.x,
		hasOverflowY: !A.y,
		overflowXStart: O.xStart,
		overflowXEnd: O.xEnd,
		overflowYStart: O.yStart,
		overflowYEnd: O.yEnd,
		cornerHidden: A.corner
	}), [
		h,
		v,
		A.x,
		A.y,
		A.corner,
		O
	]), ue = {
		role: "presentation",
		onPointerEnter: se,
		onPointerMove: se,
		onPointerDown: oe,
		onPointerLeave() {
			m(!1);
		},
		style: {
			position: "relative",
			[ig.scrollAreaCornerHeight]: `${w.height}px`,
			[ig.scrollAreaCornerWidth]: `${w.width}px`
		}
	}, de = le("div", e, {
		state: ce,
		ref: [t, M],
		props: [ue, o],
		stateAttributesMapping: hg
	}), fe = _.useMemo(() => ({
		handlePointerDown: re,
		handlePointerMove: ie,
		handlePointerUp: ae,
		handleScroll: U,
		cornerSize: w,
		setCornerSize: T,
		thumbSize: E,
		setThumbSize: D,
		hasMeasuredScrollbar: S,
		setHasMeasuredScrollbar: C,
		touchModality: b,
		cornerRef: R,
		scrollingX: h,
		setScrollingX: g,
		scrollingY: v,
		setScrollingY: y,
		hovering: p,
		setHovering: m,
		viewportRef: N,
		rootRef: M,
		scrollbarYRef: P,
		scrollbarXRef: F,
		thumbYRef: I,
		thumbXRef: L,
		rootId: c,
		hiddenState: A,
		setHiddenState: j,
		overflowEdges: O,
		setOverflowEdges: k,
		viewportState: ce,
		overflowEdgeThreshold: s
	}), [
		re,
		ie,
		ae,
		U,
		w,
		E,
		S,
		b,
		h,
		g,
		v,
		y,
		p,
		m,
		c,
		A,
		O,
		ce,
		s
	]);
	return /* @__PURE__ */ (0, q.jsxs)(ng.Provider, {
		value: fe,
		children: [!f && cg.getElement(d), de]
	});
});
function C_(e) {
	if (typeof e == "number") {
		let t = Math.max(0, e);
		return {
			xStart: t,
			xEnd: t,
			yStart: t,
			yEnd: t
		};
	}
	return {
		xStart: Math.max(0, e?.xStart || 0),
		xEnd: Math.max(0, e?.xEnd || 0),
		yStart: Math.max(0, e?.yStart || 0),
		yEnd: Math.max(0, e?.yEnd || 0)
	};
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/scroll-area/viewport/ScrollAreaViewportContext.js
var w_ = /* @__PURE__ */ _.createContext(void 0), T_ = /* @__PURE__ */ _.createContext(void 0);
function E_() {
	return _.useContext(T_)?.direction ?? "ltr";
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/internals/clamp.js
function D_(e, t = -(2 ** 53 - 1), n = 2 ** 53 - 1) {
	return Math.max(t, Math.min(e, n));
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/scroll-area/viewport/ScrollAreaViewportCssVars.js
var O_ = /* @__PURE__ */ function(e) {
	return e.scrollAreaOverflowXStart = "--scroll-area-overflow-x-start", e.scrollAreaOverflowXEnd = "--scroll-area-overflow-x-end", e.scrollAreaOverflowYStart = "--scroll-area-overflow-y-start", e.scrollAreaOverflowYEnd = "--scroll-area-overflow-y-end", e;
}({});
function k_(e, t) {
	if (t <= 0) return 0;
	let n = D_(e, 0, t), r = n, i = t - n, a = r <= 1, o = i <= 1;
	return a && o ? r <= i ? 0 : t : a ? 0 : o ? t : n;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/scroll-area/viewport/ScrollAreaViewport.js
var A_ = !1;
function j_() {
	A_ || bg || (typeof CSS < "u" && "registerProperty" in CSS && [
		O_.scrollAreaOverflowXStart,
		O_.scrollAreaOverflowXEnd,
		O_.scrollAreaOverflowYStart,
		O_.scrollAreaOverflowYEnd
	].forEach((e) => {
		try {
			CSS.registerProperty({
				name: e,
				syntax: "<length>",
				inherits: !1,
				initialValue: "0px"
			});
		} catch {}
	}), A_ = !0);
}
var M_ = /* @__PURE__ */ _.forwardRef(function(e, t) {
	let { render: n, className: r, style: i, ...a } = e, { viewportRef: o, scrollbarYRef: s, scrollbarXRef: c, thumbYRef: l, thumbXRef: u, cornerRef: d, cornerSize: f, setCornerSize: p, setThumbSize: m, rootId: h, setHiddenState: g, hiddenState: v, setHasMeasuredScrollbar: y, handleScroll: b, setHovering: x, setOverflowEdges: S, overflowEdges: C, overflowEdgeThreshold: w, scrollingX: T, scrollingY: E } = rg(), D = E_(), O = _.useRef(!0), k = _.useRef([
		NaN,
		NaN,
		NaN,
		NaN
	]), A = tg(), j = tg(), M = Ph(() => {
		let e = o.current, t = s.current, n = c.current, r = l.current, i = u.current, a = d.current;
		if (!e) return;
		let h = e.scrollHeight, _ = e.scrollWidth, v = e.clientHeight, b = e.clientWidth, x = e.scrollTop, C = e.scrollLeft, T = k.current, E = Number.isNaN(T[0]);
		if (T[0] = v, T[1] = h, T[2] = b, T[3] = _, E && y(!0), h === 0 || _ === 0) return;
		let O = N_(e), A = O.y, j = O.x, M = b / _, N = v / h, P = Math.max(0, _ - b), F = Math.max(0, h - v), I = 0, L = 0;
		if (!j) {
			let e = 0;
			e = D_(D === "rtl" ? -C : C, 0, P), I = k_(e, P), L = P - I;
		}
		let R = A ? 0 : D_(x, 0, F), ee = A ? 0 : k_(R, F), te = A ? 0 : F - ee, z = j ? 0 : b, B = A ? 0 : v, V = 0, ne = 0;
		!j && !A && (V = t?.offsetWidth || 0, ne = n?.offsetHeight || 0);
		let H = f.width === 0 && f.height === 0, U = H ? V : 0, re = H ? ne : 0, ie = ag(n, "padding", "x"), ae = ag(t, "padding", "y"), oe = ag(i, "margin", "x"), se = ag(r, "margin", "y"), ce = z - ie - oe, le = B - ae - se, ue = n ? Math.min(n.offsetWidth - U, ce) : ce, de = t ? Math.min(t.offsetHeight - re, le) : le, fe = Math.max(16, ue * M), pe = Math.max(16, de * N);
		if (m((e) => e.height === pe && e.width === fe ? e : {
			width: fe,
			height: pe
		}), t && r) {
			let e = t.offsetHeight - pe - ae - se, n = h - v, i = n === 0 ? 0 : x / n, a = Math.min(e, Math.max(0, i * e));
			r.style.transform = `translate3d(0,${a}px,0)`;
		}
		if (n && i) {
			let e = n.offsetWidth - fe - ie - oe, t = _ - b, r = t === 0 ? 0 : C / t, a = D === "rtl" ? D_(r * e, -e, 0) : D_(r * e, 0, e);
			i.style.transform = `translate3d(${a}px,0,0)`;
		}
		let me = [
			[O_.scrollAreaOverflowXStart, I],
			[O_.scrollAreaOverflowXEnd, L],
			[O_.scrollAreaOverflowYStart, ee],
			[O_.scrollAreaOverflowYEnd, te]
		];
		for (let [t, n] of me) e.style.setProperty(t, `${n}px`);
		a && (j || A ? p({
			width: 0,
			height: 0
		}) : !j && !A && p({
			width: V,
			height: ne
		})), g((e) => P_(e, O));
		let he = {
			xStart: !j && I > w.xStart,
			xEnd: !j && L > w.xEnd,
			yStart: !A && ee > w.yStart,
			yEnd: !A && te > w.yEnd
		};
		S((e) => e.xStart === he.xStart && e.xEnd === he.xEnd && e.yStart === he.yStart && e.yEnd === he.yEnd ? e : he);
	});
	Lh(() => {
		o.current && j_();
	}, [o]), Lh(() => {
		queueMicrotask(M);
	}, [
		M,
		v,
		D
	]), Lh(() => {
		o.current?.matches(":hover") && x(!0);
	}, [o, x]), _.useEffect(() => {
		let e = o.current;
		if (typeof ResizeObserver > "u" || !e) return;
		let t = !1, n = new ResizeObserver(() => {
			if (!t) {
				t = !0;
				let n = k.current;
				if (n[0] === e.clientHeight && n[1] === e.scrollHeight && n[2] === e.clientWidth && n[3] === e.scrollWidth) return;
			}
			M();
		});
		return n.observe(e), j.start(0, () => {
			let t = e.getAnimations({ subtree: !0 });
			t.length !== 0 && Promise.allSettled(t.map((e) => e.finished)).then(M).catch(() => {});
		}), () => {
			n.disconnect(), j.clear();
		};
	}, [
		M,
		o,
		j
	]);
	function N() {
		O.current = !1;
	}
	let P = {
		role: "presentation",
		...h && { "data-id": `${h}-viewport` },
		tabIndex: v.x && v.y ? -1 : 0,
		className: cg.className,
		style: { overflow: "scroll" },
		onScroll() {
			o.current && (M(), O.current || b({
				x: o.current.scrollLeft,
				y: o.current.scrollTop
			}), A.start(100, () => {
				O.current = !0;
			}));
		},
		onWheel: N,
		onTouchMove: N,
		onPointerMove: N,
		onPointerEnter: N,
		onKeyDown: N
	}, F = _.useMemo(() => ({
		scrolling: T || E,
		hasOverflowX: !v.x,
		hasOverflowY: !v.y,
		overflowXStart: C.xStart,
		overflowXEnd: C.xEnd,
		overflowYStart: C.yStart,
		overflowYEnd: C.yEnd,
		cornerHidden: v.corner
	}), [
		T,
		E,
		v.x,
		v.y,
		v.corner,
		C
	]), I = le("div", e, {
		ref: [t, o],
		state: F,
		props: [P, a],
		stateAttributesMapping: hg
	}), L = _.useMemo(() => ({ computeThumbPosition: M }), [M]);
	return /* @__PURE__ */ (0, q.jsx)(w_.Provider, {
		value: L,
		children: I
	});
});
function N_(e) {
	let t = e.clientHeight >= e.scrollHeight, n = e.clientWidth >= e.scrollWidth;
	return {
		y: t,
		x: n,
		corner: t || n
	};
}
function P_(e, t) {
	return e.y === t.y && e.x === t.x && e.corner === t.corner ? e : t;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.2.9_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/utils/esm/addEventListener.js
function F_(e, t, n, r) {
	return e.addEventListener(t, n, r), () => {
		e.removeEventListener(t, n, r);
	};
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/scroll-area/scrollbar/ScrollAreaScrollbarContext.js
var I_ = /* @__PURE__ */ _.createContext(void 0);
function L_() {
	let e = _.useContext(I_);
	if (e === void 0) throw Error(I(54));
	return e;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/scroll-area/scrollbar/ScrollAreaScrollbarCssVars.js
var R_ = /* @__PURE__ */ function(e) {
	return e.scrollAreaThumbHeight = "--scroll-area-thumb-height", e.scrollAreaThumbWidth = "--scroll-area-thumb-width", e;
}({}), z_ = /* @__PURE__ */ _.forwardRef(function(e, t) {
	let { render: n, className: r, orientation: i = "vertical", keepMounted: a = !1, style: o, ...s } = e, { hovering: c, scrollingX: l, scrollingY: u, hiddenState: d, overflowEdges: f, scrollbarYRef: p, scrollbarXRef: m, viewportRef: h, thumbYRef: g, thumbXRef: v, handlePointerDown: y, handlePointerUp: b, rootId: x, thumbSize: S, hasMeasuredScrollbar: C } = rg(), w = {
		hovering: c,
		scrolling: {
			horizontal: l,
			vertical: u
		}[i],
		orientation: i,
		hasOverflowX: !d.x,
		hasOverflowY: !d.y,
		overflowXStart: f.xStart,
		overflowXEnd: f.xEnd,
		overflowYStart: f.yStart,
		overflowYEnd: f.yEnd,
		cornerHidden: d.corner
	}, T = E_(), E = !C && !a, D = i === "vertical" ? d.y : d.x, O = a || !D;
	_.useEffect(() => {
		if (!O) return;
		let e = h.current, t = i === "vertical" ? p.current : m.current;
		if (!t) return;
		function n(n) {
			if (!e || !t || n.ctrlKey) return;
			n.preventDefault();
			let r = i === "horizontal", a = r ? "scrollLeft" : "scrollTop", o = r ? n.deltaX : n.deltaY, s = r ? e.scrollWidth - e.clientWidth : e.scrollHeight - e.clientHeight, c = r && T === "rtl" ? -s : 0, l = r && T === "rtl" ? 0 : s, u = e[a];
			u <= c && o < 0 || u >= l && o > 0 || (e[a] = Math.min(l, Math.max(c, u + o)));
		}
		return F_(t, "wheel", n, { passive: !1 });
	}, [
		T,
		i,
		m,
		p,
		O,
		h
	]);
	let k = {
		...x && { "data-id": `${x}-scrollbar` },
		onPointerDown(e) {
			if (e.button !== 0) return;
			let t = jg(e.nativeEvent), n = i === "vertical" ? g.current : v.current;
			if (!(n && Ag(n, t)) && h.current) {
				if (g.current && p.current && i === "vertical") {
					let t = ag(g.current, "margin", "y"), n = ag(p.current, "padding", "y"), r = g.current.offsetHeight, i = p.current.getBoundingClientRect(), a = e.clientY - i.top - r / 2 - n + t / 2, o = h.current.scrollHeight, s = h.current.clientHeight, c = a / (p.current.offsetHeight - r - n - t) * (o - s);
					h.current.scrollTop = c;
				}
				if (v.current && m.current && i === "horizontal") {
					let t = ag(v.current, "margin", "x"), n = ag(m.current, "padding", "x"), r = v.current.offsetWidth, i = m.current.getBoundingClientRect(), a = e.clientX - i.left - r / 2 - n + t / 2, o = h.current.scrollWidth, s = h.current.clientWidth, c = a / (m.current.offsetWidth - r - n - t), l;
					T === "rtl" ? (l = (1 - c) * (o - s), h.current.scrollLeft <= 0 && (l = -l)) : l = c * (o - s), h.current.scrollLeft = l;
				}
				y(e);
			}
		},
		onPointerUp: b,
		style: {
			position: "absolute",
			touchAction: "none",
			WebkitUserSelect: "none",
			userSelect: "none",
			visibility: E ? "hidden" : void 0,
			...i === "vertical" && {
				top: 0,
				bottom: `var(${ig.scrollAreaCornerHeight})`,
				insetInlineEnd: 0,
				[R_.scrollAreaThumbHeight]: `${S.height}px`
			},
			...i === "horizontal" && {
				insetInlineStart: 0,
				insetInlineEnd: `var(${ig.scrollAreaCornerWidth})`,
				bottom: 0,
				[R_.scrollAreaThumbWidth]: `${S.width}px`
			}
		}
	}, A = le("div", e, {
		ref: [t, i === "vertical" ? p : m],
		state: w,
		props: [k, s],
		stateAttributesMapping: hg
	}), j = _.useMemo(() => ({ orientation: i }), [i]);
	return O ? /* @__PURE__ */ (0, q.jsx)(I_.Provider, {
		value: j,
		children: A
	}) : null;
}), B_ = /* @__PURE__ */ _.forwardRef(function(e, t) {
	let { render: n, className: r, style: i, ...a } = e, { thumbYRef: o, thumbXRef: s, handlePointerDown: c, handlePointerMove: l, handlePointerUp: u, setScrollingX: d, setScrollingY: f, hasMeasuredScrollbar: p } = rg(), { orientation: m } = L_();
	return le("div", e, {
		ref: [t, m === "vertical" ? o : s],
		state: { orientation: m },
		props: [{
			onPointerDown: c,
			onPointerMove: l,
			onPointerUp(e) {
				m === "vertical" && f(!1), m === "horizontal" && d(!1), u(e);
			},
			style: {
				visibility: p ? void 0 : "hidden",
				...m === "vertical" && { height: `var(${R_.scrollAreaThumbHeight})` },
				...m === "horizontal" && { width: `var(${R_.scrollAreaThumbWidth})` }
			}
		}, a]
	});
}), V_ = /* @__PURE__ */ _.forwardRef(function(e, t) {
	let { render: n, className: r, style: i, ...a } = e, { cornerRef: o, cornerSize: s, hiddenState: c } = rg(), l = le("div", e, {
		ref: [t, o],
		props: [{ style: {
			position: "absolute",
			bottom: 0,
			insetInlineEnd: 0,
			width: s.width,
			height: s.height
		} }, a]
	});
	return c.corner ? null : l;
});
//#endregion
//#region src/components/ui/scroll-area.tsx
function H_({ className: e, children: t, ...n }) {
	return /* @__PURE__ */ (0, q.jsxs)(S_, {
		"data-slot": "scroll-area",
		className: Kt("relative", e),
		...n,
		children: [
			/* @__PURE__ */ (0, q.jsx)(M_, {
				"data-slot": "scroll-area-viewport",
				className: "size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1",
				children: t
			}),
			/* @__PURE__ */ (0, q.jsx)(U_, {}),
			/* @__PURE__ */ (0, q.jsx)(V_, {})
		]
	});
}
function U_({ className: e, orientation: t = "vertical", ...n }) {
	return /* @__PURE__ */ (0, q.jsx)(z_, {
		"data-slot": "scroll-area-scrollbar",
		"data-orientation": t,
		orientation: t,
		className: Kt("flex touch-none p-px transition-colors select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent", e),
		...n,
		children: /* @__PURE__ */ (0, q.jsx)(B_, {
			"data-slot": "scroll-area-thumb",
			className: "relative flex-1 rounded-none bg-border"
		})
	});
}
//#endregion
//#region src/components/EmptyState.tsx
function W_({ title: e, body: t }) {
	return /* @__PURE__ */ (0, q.jsxs)(qh, {
		className: "m-6 max-w-xl",
		children: [/* @__PURE__ */ (0, q.jsx)(Jh, { children: /* @__PURE__ */ (0, q.jsx)(Yh, { children: e }) }), /* @__PURE__ */ (0, q.jsx)(Xh, {
			className: "text-sm text-muted-foreground",
			children: t
		})]
	});
}
//#endregion
//#region src/routes/AutomationView.tsx
function G_({ manifest: e, autoId: t }) {
	let n = e.automations[t], r = (0, _.useMemo)(() => n ? n.flowNodes.map((e) => ({
		id: e.id,
		type: e.kind === "automation" ? "automation" : e.kind === "template" ? "template" : "entity",
		position: e.position,
		data: e.kind === "automation" ? {
			autoId: t,
			label: e.label,
			area: e.area,
			mode: n.mode,
			direction: "TB"
		} : {
			entityId: e.label,
			label: e.label,
			area: e.area,
			direction: "TB"
		}
	})) : [], [n, t]), i = (0, _.useMemo)(() => n?.flowEdges.map((e) => ({
		id: e.id,
		source: e.source,
		target: e.target
	})) ?? [], [n]);
	return n ? /* @__PURE__ */ (0, q.jsxs)("div", {
		className: "flex h-[calc(100svh-4rem)] w-full",
		children: [/* @__PURE__ */ (0, q.jsx)("div", {
			className: "flex-1",
			children: /* @__PURE__ */ (0, q.jsxs)(hm, {
				nodes: r,
				edges: i,
				nodeTypes: mh,
				fitView: !0,
				proOptions: { hideAttribution: !0 },
				children: [/* @__PURE__ */ (0, q.jsx)(Sm, {}), /* @__PURE__ */ (0, q.jsx)(jm, {})]
			})
		}), /* @__PURE__ */ (0, q.jsxs)("aside", {
			className: "flex w-96 flex-col border-l",
			children: [/* @__PURE__ */ (0, q.jsxs)("div", {
				className: "flex items-center justify-between border-b p-3",
				children: [/* @__PURE__ */ (0, q.jsxs)("div", { children: [/* @__PURE__ */ (0, q.jsx)("div", {
					className: "text-sm font-medium",
					children: n.alias
				}), /* @__PURE__ */ (0, q.jsxs)("div", {
					className: "text-xs text-muted-foreground",
					children: ["mode: ", n.mode]
				})] }), /* @__PURE__ */ (0, q.jsx)(Kh, {
					variant: "ghost",
					size: "sm",
					onClick: () => Nn({ name: "map" }),
					children: "Back"
				})]
			}), /* @__PURE__ */ (0, q.jsxs)(H_, {
				className: "flex-1",
				children: [
					/* @__PURE__ */ (0, q.jsxs)(qh, {
						className: "m-3",
						children: [/* @__PURE__ */ (0, q.jsx)(Jh, { children: /* @__PURE__ */ (0, q.jsx)(Yh, {
							className: "text-sm",
							children: "Triggers"
						}) }), /* @__PURE__ */ (0, q.jsx)(Xh, { children: /* @__PURE__ */ (0, q.jsx)("pre", {
							className: "overflow-x-auto text-xs",
							children: JSON.stringify(n.triggers, null, 2)
						}) })]
					}),
					/* @__PURE__ */ (0, q.jsxs)(qh, {
						className: "m-3",
						children: [/* @__PURE__ */ (0, q.jsx)(Jh, { children: /* @__PURE__ */ (0, q.jsx)(Yh, {
							className: "text-sm",
							children: "Conditions"
						}) }), /* @__PURE__ */ (0, q.jsx)(Xh, { children: /* @__PURE__ */ (0, q.jsx)("pre", {
							className: "overflow-x-auto text-xs",
							children: JSON.stringify(n.conditions, null, 2)
						}) })]
					}),
					/* @__PURE__ */ (0, q.jsxs)(qh, {
						className: "m-3",
						children: [/* @__PURE__ */ (0, q.jsx)(Jh, { children: /* @__PURE__ */ (0, q.jsx)(Yh, {
							className: "text-sm",
							children: "Actions"
						}) }), /* @__PURE__ */ (0, q.jsx)(Xh, { children: /* @__PURE__ */ (0, q.jsx)("pre", {
							className: "overflow-x-auto text-xs",
							children: JSON.stringify(n.actions, null, 2)
						}) })]
					})
				]
			})]
		})]
	}) : /* @__PURE__ */ (0, q.jsx)(W_, {
		title: `Unknown automation: ${t}`,
		body: "The manifest does not include this automation. Rebuild the panel and re-deploy."
	});
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/dialog/root/DialogRootContext.js
var K_ = /* @__PURE__ */ _.createContext(!1), q_ = /* @__PURE__ */ _.createContext(void 0);
function J_(e) {
	let t = _.useContext(q_);
	if (e === !1 && t === void 0) throw Error(I(27));
	return t;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/internals/stateAttributesMapping.js
var Y_ = /* @__PURE__ */ function(e) {
	return e.startingStyle = "data-starting-style", e.endingStyle = "data-ending-style", e;
}({}), X_ = { [Y_.startingStyle]: "" }, Z_ = { [Y_.endingStyle]: "" }, Q_ = { transitionStatus(e) {
	return e === "starting" ? X_ : e === "ending" ? Z_ : null;
} }, $_ = function(e) {
	return e.open = "data-open", e.closed = "data-closed", e[e.startingStyle = Y_.startingStyle] = "startingStyle", e[e.endingStyle = Y_.endingStyle] = "endingStyle", e.anchorHidden = "data-anchor-hidden", e.side = "data-side", e.align = "data-align", e;
}({}), ev = /* @__PURE__ */ function(e) {
	return e.popupOpen = "data-popup-open", e.pressed = "data-pressed", e;
}({});
ev.popupOpen, ev.popupOpen, ev.pressed;
var tv = { [$_.open]: "" }, nv = { [$_.closed]: "" }, rv = { [$_.anchorHidden]: "" }, iv = {
	open(e) {
		return e ? tv : nv;
	},
	anchorHidden(e) {
		return e ? rv : null;
	}
}, av = {
	...iv,
	...Q_
}, ov = /* @__PURE__ */ _.forwardRef(function(e, t) {
	let { render: n, className: r, style: i, forceRender: a = !1, ...o } = e, { store: s } = J_(), c = s.useState("open"), l = s.useState("nested"), u = s.useState("mounted");
	return le("div", e, {
		state: {
			open: c,
			transitionStatus: s.useState("transitionStatus")
		},
		ref: [s.context.backdropRef, t],
		stateAttributesMapping: av,
		props: [{
			role: "presentation",
			hidden: !u,
			style: {
				userSelect: "none",
				WebkitUserSelect: "none"
			}
		}, o],
		enabled: a || !l
	});
}), sv = "trigger-press", cv = "outside-press", lv = "close-press", uv = "focus-out", dv = "escape-key", fv = "imperative-action";
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/internals/createBaseUIEventDetails.js
function pv(e, t, n, r) {
	let i = !1, a = !1, o = r ?? ae;
	return {
		reason: e,
		event: t ?? new Event("base-ui"),
		cancel() {
			i = !0;
		},
		allowPropagation() {
			a = !0;
		},
		get isCanceled() {
			return i;
		},
		get isPropagationAllowed() {
			return a;
		},
		trigger: n,
		...o
	};
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/dialog/close/DialogClose.js
var mv = /* @__PURE__ */ _.forwardRef(function(e, t) {
	let { render: n, className: r, style: i, disabled: a = !1, nativeButton: o = !0, ...s } = e, { store: c } = J_(), l = c.useState("open"), { getButtonProps: u, buttonRef: d } = Vh({
		disabled: a,
		native: o
	}), f = { disabled: a };
	function p(e) {
		l && c.setOpen(!1, pv(lv, e.nativeEvent));
	}
	return le("button", e, {
		state: f,
		ref: [t, d],
		props: [
			{ onClick: p },
			s,
			u
		]
	});
}), hv = /* @__PURE__ */ _.forwardRef(function(e, t) {
	let { render: n, className: r, style: i, id: a, ...o } = e, { store: s } = J_(), c = pg(a);
	return s.useSyncedValueWithCleanup("descriptionElementId", c), le("p", e, {
		ref: t,
		props: [{ id: c }, o]
	});
});
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.2.9_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/utils/esm/mergeCleanups.js
function gv(...e) {
	return () => {
		for (let t = 0; t < e.length; t += 1) {
			let n = e[t];
			n && n();
		}
	};
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.2.9_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/utils/esm/useValueAsRef.js
function _v(e) {
	let t = R(vv, e).current;
	return t.next = e, Lh(t.effect), t;
}
function vv(e) {
	let t = {
		current: e,
		next: e,
		effect: () => {
			t.current = t.next;
		}
	};
	return t;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.2.9_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/utils/esm/useAnimationFrame.js
var yv = null;
globalThis.requestAnimationFrame;
var bv = new class {
	callbacks = [];
	callbacksCount = 0;
	nextId = 1;
	startId = 1;
	isScheduled = !1;
	tick = (e) => {
		this.isScheduled = !1;
		let t = this.callbacks, n = this.callbacksCount;
		if (this.callbacks = [], this.callbacksCount = 0, this.startId = this.nextId, n > 0) for (let n = 0; n < t.length; n += 1) t[n]?.(e);
	};
	request(e) {
		let t = this.nextId;
		return this.nextId += 1, this.callbacks.push(e), this.callbacksCount += 1, this.isScheduled ||= (requestAnimationFrame(this.tick), !0), t;
	}
	cancel(e) {
		let t = e - this.startId;
		t < 0 || t >= this.callbacks.length || (this.callbacks[t] = null, --this.callbacksCount);
	}
}(), xv = class e {
	static create() {
		return new e();
	}
	static request(e) {
		return bv.request(e);
	}
	static cancel(e) {
		return bv.cancel(e);
	}
	currentId = yv;
	request(e) {
		this.cancel(), this.currentId = bv.request(() => {
			this.currentId = yv, e();
		});
	}
	cancel = () => {
		this.currentId !== yv && (bv.cancel(this.currentId), this.currentId = yv);
	};
	disposeEffect = () => this.cancel;
};
function Sv() {
	let e = R(xv.create).current;
	return Qh(e.disposeEffect), e;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.2.9_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/utils/esm/visuallyHidden.js
var Cv = {
	clipPath: "inset(50%)",
	overflow: "hidden",
	whiteSpace: "nowrap",
	border: 0,
	padding: 0,
	width: 1,
	height: 1,
	margin: -1
}, wv = {
	...Cv,
	position: "fixed",
	top: 0,
	left: 0
};
({ ...Cv });
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/utils/FocusGuard.js
var Tv = /* @__PURE__ */ _.forwardRef(function(e, t) {
	let [n, r] = _.useState();
	Lh(() => {
		Sg && r("button");
	}, []);
	let i = {
		tabIndex: 0,
		role: n
	};
	return /* @__PURE__ */ (0, q.jsx)("span", {
		...e,
		ref: t,
		style: wv,
		"aria-hidden": n ? void 0 : !0,
		...i,
		"data-base-ui-focus-guard": ""
	});
});
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/floating-ui-react/utils/createAttribute.js
function Ev(e) {
	return `data-base-ui-${e}`;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/floating-ui-react/utils/enqueueFocus.js
var Dv = 0;
function Ov(e, t = {}) {
	let { preventScroll: n = !1, sync: r = !1, shouldFocus: i } = t;
	cancelAnimationFrame(Dv);
	function a() {
		i && !i() || e?.focus({ preventScroll: n });
	}
	if (r) return a(), ie;
	let o = requestAnimationFrame(a);
	return Dv = o, () => {
		Dv === o && (cancelAnimationFrame(o), Dv = 0);
	};
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/floating-ui-react/utils/markOthers.js
var kv = {
	inert: /* @__PURE__ */ new WeakMap(),
	"aria-hidden": /* @__PURE__ */ new WeakMap()
}, Av = "data-base-ui-inert", jv = {
	inert: /* @__PURE__ */ new WeakSet(),
	"aria-hidden": /* @__PURE__ */ new WeakSet()
}, Mv = /* @__PURE__ */ new WeakMap(), Nv = 0;
function Pv(e) {
	return jv[e];
}
function Fv(e) {
	return e ? wh(e) ? e.host : Fv(e.parentNode) : null;
}
var Iv = (e, t) => t.map((t) => {
	if (e.contains(t)) return t;
	let n = Fv(t);
	return e.contains(n) ? n : null;
}).filter((e) => e != null), Lv = (e) => {
	let t = /* @__PURE__ */ new Set();
	return e.forEach((e) => {
		let n = e;
		for (; n && !t.has(n);) t.add(n), n = n.parentNode;
	}), t;
}, Rv = (e, t, n) => {
	let r = [], i = (e) => {
		!e || n.has(e) || Array.from(e.children).forEach((e) => {
			vh(e) !== "script" && (t.has(e) ? i(e) : r.push(e));
		});
	};
	return i(e), r;
};
function zv(e, t, n, r, { mark: i = !0, markerIgnoreElements: a = [] }) {
	let o = r ? "inert" : n ? "aria-hidden" : null, s = null, c = null, l = Iv(t, e), u = i ? Iv(t, a) : [], d = new Set(u), f = i ? Rv(t, Lv(l), new Set(l)).filter((e) => !d.has(e)) : [], p = [], m = [];
	if (o) {
		let e = kv[o], n = Pv(o);
		c = n, s = e;
		let r = Iv(t, Array.from(t.querySelectorAll("[aria-live]"))), i = l.concat(r);
		Rv(t, Lv(i), new Set(i)).forEach((t) => {
			let r = t.getAttribute(o), i = r !== null && r !== "false", a = (e.get(t) || 0) + 1;
			e.set(t, a), p.push(t), a === 1 && i && n.add(t), i || t.setAttribute(o, o === "inert" ? "" : "true");
		});
	}
	return i && f.forEach((e) => {
		let t = (Mv.get(e) || 0) + 1;
		Mv.set(e, t), m.push(e), t === 1 && e.setAttribute(Av, "");
	}), Nv += 1, () => {
		s && p.forEach((e) => {
			let t = (s.get(e) || 0) - 1;
			s.set(e, t), t || (!c?.has(e) && o && e.removeAttribute(o), c?.delete(e));
		}), i && m.forEach((e) => {
			let t = (Mv.get(e) || 0) - 1;
			Mv.set(e, t), t || e.removeAttribute(Av);
		}), --Nv, Nv || (kv.inert = /* @__PURE__ */ new WeakMap(), kv["aria-hidden"] = /* @__PURE__ */ new WeakMap(), jv.inert = /* @__PURE__ */ new WeakSet(), jv["aria-hidden"] = /* @__PURE__ */ new WeakSet(), Mv = /* @__PURE__ */ new WeakMap());
	};
}
function Bv(e, t = {}) {
	let { ariaHidden: n = !1, inert: r = !1, mark: i = !0, markerIgnoreElements: a = [] } = t, o = Kg(e[0]).body;
	return zv(e, o, n, r, {
		mark: i,
		markerIgnoreElements: a
	});
}
var Vv = {
	clipPath: "inset(50%)",
	position: "fixed",
	top: 0,
	left: 0
}, Hv = /* @__PURE__ */ _.createContext(null), Uv = () => _.useContext(Hv), Wv = Ev("portal");
function Gv(e = {}) {
	let { ref: t, container: n, componentProps: r = ae, elementProps: i } = e, a = fg(), o = Uv()?.portalNode, [s, c] = _.useState(null), [l, u] = _.useState(null), d = Ph((e) => {
		e !== null && u(e);
	}), f = _.useRef(null);
	Lh(() => {
		if (n === null) {
			f.current && (f.current = null, u(null), c(null));
			return;
		}
		if (a == null) return;
		let e = (n && (xh(n) ? n : n.current)) ?? o ?? document.body;
		if (e == null) {
			f.current && (f.current = null, u(null), c(null));
			return;
		}
		f.current !== e && (f.current = e, u(null), c(e));
	}, [
		n,
		o,
		a
	]);
	let p = le("div", r, {
		ref: [t, d],
		props: [{
			id: a,
			[Wv]: ""
		}, i]
	});
	return {
		portalNode: l,
		portalSubtree: s && p ? /* @__PURE__ */ hd.createPortal(p, s) : null
	};
}
var Kv = /* @__PURE__ */ _.forwardRef(function(e, t) {
	let { render: n, className: r, style: i, children: a, container: o, renderGuards: s, ...c } = e, { portalNode: l, portalSubtree: u } = Gv({
		container: o,
		ref: t,
		componentProps: e,
		elementProps: c
	}), d = _.useRef(null), f = _.useRef(null), p = _.useRef(null), m = _.useRef(null), [h, g] = _.useState(null), v = _.useRef(!1), y = h?.modal, b = h?.open, x = typeof s == "boolean" ? s : !!h && !h.modal && h.open && !!l;
	_.useEffect(() => {
		if (!l || y) return;
		function e(e) {
			l && e.relatedTarget && f_(e) && (e.type === "focusin" ? v.current &&= (m_(l), !1) : (p_(l), v.current = !0));
		}
		return gv(F_(l, "focusin", e, !0), F_(l, "focusout", e, !0));
	}, [l, y]), _.useEffect(() => {
		!l || b !== !1 || (m_(l), v.current = !1);
	}, [b, l]);
	let S = _.useMemo(() => ({
		beforeOutsideRef: d,
		afterOutsideRef: f,
		beforeInsideRef: p,
		afterInsideRef: m,
		portalNode: l,
		setFocusManagerState: g
	}), [l]);
	return /* @__PURE__ */ (0, q.jsxs)(_.Fragment, { children: [u, /* @__PURE__ */ (0, q.jsxs)(Hv.Provider, {
		value: S,
		children: [
			x && l && /* @__PURE__ */ (0, q.jsx)(Tv, {
				"data-type": "outside",
				ref: d,
				onFocus: (e) => {
					f_(e, l) ? p.current?.focus() : d_(h ? h.domReference : null)?.focus();
				}
			}),
			x && l && /* @__PURE__ */ (0, q.jsx)("span", {
				"aria-owns": l.id,
				style: Vv
			}),
			l && /* @__PURE__ */ hd.createPortal(a, l),
			x && l && /* @__PURE__ */ (0, q.jsx)(Tv, {
				"data-type": "outside",
				ref: f,
				onFocus: (e) => {
					f_(e, l) ? m.current?.focus() : (u_(h ? h.domReference : null)?.focus(), h?.closeOnFocusOut && h?.onOpenChange(!1, pv("focus-out", e.nativeEvent)));
				}
			})
		]
	})] });
});
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/floating-ui-react/utils/createEventEmitter.js
function qv() {
	let e = /* @__PURE__ */ new Map();
	return {
		emit(t, n) {
			e.get(t)?.forEach((e) => e(n));
		},
		on(t, n) {
			e.has(t) || e.set(t, /* @__PURE__ */ new Set()), e.get(t).add(n);
		},
		off(t, n) {
			e.get(t)?.delete(n);
		}
	};
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/floating-ui-react/components/FloatingTree.js
var Jv = /* @__PURE__ */ _.createContext(null), Yv = /* @__PURE__ */ _.createContext(null), Xv = () => _.useContext(Jv)?.id || null, Zv = (e) => {
	let t = _.useContext(Yv);
	return e ?? t;
};
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/utils/resolveRef.js
function Qv(e) {
	return e == null ? e : "current" in e ? e.current : e;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/floating-ui-react/components/FloatingFocusManager.js
function $v(e, t) {
	let n = yh(jg(e));
	return e instanceof n.KeyboardEvent ? "keyboard" : e instanceof n.FocusEvent ? t || "keyboard" : "pointerType" in e ? e.pointerType || "keyboard" : "touches" in e ? "touch" : e instanceof n.MouseEvent ? t || (e.detail === 0 ? "keyboard" : "mouse") : "";
}
var ey = 20, ty = [];
function ny() {
	ty = ty.filter((e) => e.deref()?.isConnected);
}
function ry(e) {
	ny(), e && vh(e) !== "body" && (ty.push(new WeakRef(e)), ty.length > ey && (ty = ty.slice(-20)));
}
function iy() {
	return ny(), ty[ty.length - 1]?.deref();
}
function ay(e) {
	return e ? o_(e) ? e : c_(e)[0] || e : null;
}
function oy(e, t) {
	if (e.hasAttribute("tabindex") && !e.hasAttribute("data-tabindex") || !t.current.includes("floating") && !e.getAttribute("role")?.includes("dialog")) return;
	let n = s_(e).filter((e) => {
		let t = e.getAttribute("data-tabindex") || "";
		return o_(e) || e.hasAttribute("data-tabindex") && !t.startsWith("-");
	}), r = e.getAttribute("tabindex");
	t.current.includes("floating") || n.length === 0 ? r !== "0" && e.setAttribute("tabindex", "0") : (r !== "-1" || e.hasAttribute("data-tabindex") && e.getAttribute("data-tabindex") !== "-1") && (e.setAttribute("tabindex", "-1"), e.setAttribute("data-tabindex", "-1"));
}
function sy(e) {
	let { context: t, children: n, disabled: r = !1, initialFocus: i = !0, returnFocus: a = !0, restoreFocus: o = !1, modal: s = !0, closeOnFocusOut: c = !0, openInteractionType: l = "", nextFocusableElement: u, previousFocusableElement: d, beforeContentFocusGuardRef: f, externalTree: p, getInsideElements: m } = e, h = "rootStore" in t ? t.rootStore : t, g = h.useState("open"), v = h.useState("domReferenceElement"), y = h.useState("floatingElement"), { events: b, dataRef: x } = h.context, S = Ph(() => x.current.floatingContext?.nodeId), C = i === !1, w = Fg(v) && C, T = _.useRef(["content"]), E = _v(i), D = _v(a), O = _v(l), k = Zv(p), A = Uv(), j = _.useRef(!1), M = _.useRef(!1), N = _.useRef(!1), P = _.useRef(null), F = _.useRef(""), I = _.useRef(""), L = _.useRef(null), R = _.useRef(null), te = ee(L, f, A?.beforeInsideRef), z = ee(R, A?.afterInsideRef), B = tg(), V = tg(), ne = Sv(), H = A != null, U = Ig(y), re = Ph((e = U) => e ? c_(e) : []), ie = Ph(() => m?.().filter((e) => e != null) ?? []);
	_.useEffect(() => {
		if (r || !s) return;
		function e(e) {
			e.key === "Tab" && Ag(U, kg(Kg(U))) && re().length === 0 && !w && zg(e);
		}
		return F_(Kg(U), "keydown", e);
	}, [
		r,
		U,
		s,
		w,
		re
	]), _.useEffect(() => {
		if (r || !g) return;
		let e = Kg(U);
		function t() {
			N.current = !1;
		}
		function n(e) {
			let t = jg(e), n = ie();
			N.current = !(Ag(y, t) || Ag(v, t) || Ag(A?.portalNode, t) || n.some((e) => e === t || Ag(e, t))), I.current = e.pointerType || "keyboard", t?.closest("[data-base-ui-click-trigger]") && (M.current = !0);
		}
		function i() {
			I.current = "keyboard";
		}
		return gv(F_(e, "pointerdown", n, !0), F_(e, "pointerup", t, !0), F_(e, "pointercancel", t, !0), F_(e, "keydown", i, !0));
	}, [
		r,
		y,
		v,
		U,
		g,
		A,
		ie
	]), _.useEffect(() => {
		if (r || !c) return;
		let e = Kg(U);
		function t() {
			M.current = !0, V.start(0, () => {
				M.current = !1;
			});
		}
		function n(e) {
			let t = jg(e);
			o_(t) && (P.current = t);
		}
		function i(t) {
			let n = t.relatedTarget, r = t.currentTarget, i = jg(t);
			queueMicrotask(() => {
				let a = S(), c = h.context.triggerElements, l = ie(), f = n?.hasAttribute(Ev("focus-guard")) && [
					L.current,
					R.current,
					A?.beforeInsideRef.current,
					A?.afterInsideRef.current,
					A?.beforeOutsideRef.current,
					A?.afterOutsideRef.current,
					Qv(d),
					Qv(u)
				].includes(n), p = !(Ag(v, n) || Ag(y, n) || Ag(n, y) || Ag(A?.portalNode, n) || l.some((e) => e === n || Ag(e, n)) || n != null && c.hasElement(n) || c.hasMatchingElement((e) => Ag(e, n)) || f || k && (Lg(k.nodesRef.current, a).find((e) => Ag(e.context?.elements.floating, n) || Ag(e.context?.elements.domReference, n)) || Rg(k.nodesRef.current, a).find((e) => [e.context?.elements.floating, Ig(e.context?.elements.floating)].includes(n) || e.context?.elements.domReference === n)));
				if (r === v && U && oy(U, T), o && r !== v && !Gg(i) && kg(e) === e.body) {
					if (Ch(U) && (U.focus(), o === "popup")) {
						ne.request(() => {
							U.focus();
						});
						return;
					}
					let e = re(), t = P.current, n = (t && e.includes(t) ? t : null) || e[e.length - 1] || U;
					Ch(n) && n.focus();
				}
				if (x.current.insideReactTree) {
					x.current.insideReactTree = !1;
					return;
				}
				(w || !s) && n && p && !M.current && (w || n !== iy()) && (j.current = !0, h.setOpen(!1, pv(uv, t)));
			});
		}
		function a() {
			N.current || (x.current.insideReactTree = !0, B.start(0, () => {
				x.current.insideReactTree = !1;
			}));
		}
		let l = Ch(v) ? v : null;
		if (!(!y && !l)) return gv(l && F_(l, "focusout", i), l && F_(l, "pointerdown", t), y && F_(y, "focusin", n), y && F_(y, "focusout", i), y && A && F_(y, "focusout", a, !0));
	}, [
		r,
		v,
		y,
		U,
		s,
		k,
		A,
		h,
		c,
		o,
		re,
		w,
		S,
		T,
		x,
		B,
		V,
		ne,
		u,
		d,
		ie
	]), _.useEffect(() => {
		if (r || !y || !g) return;
		let e = Array.from(A?.portalNode?.querySelectorAll(`[${Ev("portal")}]`) || []), t = (k ? Rg(k.nodesRef.current, S()) : []).find((e) => Fg(e.context?.elements.domReference || null))?.context?.elements.domReference, n = Bv([
			y,
			...e,
			L.current,
			R.current,
			A?.beforeOutsideRef.current,
			A?.afterOutsideRef.current,
			...ie(),
			t,
			Qv(d),
			Qv(u),
			w ? v : null
		].filter((e) => e != null), {
			ariaHidden: s || w,
			mark: !1
		}), i = Bv([y, ...e].filter((e) => e != null));
		return () => {
			i(), n();
		};
	}, [
		g,
		r,
		v,
		y,
		s,
		A,
		w,
		k,
		S,
		u,
		d,
		ie
	]), Lh(() => {
		if (!g || r || !Ch(U)) return;
		let e = Kg(U), t = kg(e);
		queueMicrotask(() => {
			let n = E.current, r = typeof n == "function" ? n(O.current || "") : n;
			if (r === void 0 || r === !1 || Ag(U, t)) return;
			let i = null, a = () => (i ??= re(U), i[0] || U), o;
			o = r === !0 || r === null ? a() : Qv(r), o ||= a();
			let s = Ag(U, kg(e));
			Ov(o, {
				preventScroll: o === U,
				shouldFocus() {
					if (s) return !0;
					let t = kg(e);
					return !(t !== o && Ag(U, t));
				}
			});
		});
	}, [
		r,
		g,
		U,
		re,
		E,
		O
	]), Lh(() => {
		if (r || !U) return;
		let e = Kg(U);
		ry(kg(e));
		function t(e) {
			if (e.open || (F.current = $v(e.nativeEvent, I.current)), e.reason === "trigger-hover" && e.nativeEvent.type === "mouseleave" && (j.current = !0), e.reason === "outside-press") if (e.nested) j.current = !1;
			else if (Vg(e.nativeEvent) || Hg(e.nativeEvent)) j.current = !1;
			else {
				let e = !1;
				Kg(U).createElement("div").focus({ get preventScroll() {
					return e = !0, !1;
				} }), e ? j.current = !1 : j.current = !0;
			}
		}
		b.on("openchange", t);
		function n() {
			let e = D.current, t = typeof e == "function" ? e(F.current) : e;
			if (t === void 0 || t === !1) return null;
			if (t === null && (t = !0), typeof t == "boolean") return v?.isConnected ? v : iy() || null;
			let n = v?.isConnected ? v : iy();
			return Qv(t) || n || null;
		}
		return () => {
			b.off("openchange", t);
			let r = kg(e), i = ie(), a = Ag(y, r) || i.some((e) => e === r || Ag(e, r)) || k && Lg(k.nodesRef.current, S(), !1).some((e) => Ag(e.context?.elements.floating, r)), o = D.current, s = n();
			queueMicrotask(() => {
				let t = ay(s), n = typeof o != "boolean";
				o && !j.current && Ch(t) && (!(!n && t !== r && r !== e.body) || a) && t.focus({ preventScroll: !0 }), j.current = !1;
			});
		};
	}, [
		r,
		y,
		U,
		D,
		b,
		k,
		v,
		S,
		ie
	]), Lh(() => {
		if (!bg || g || !y) return;
		let e = kg(Kg(y));
		!Ch(e) || !Pg(e) || Ag(y, e) && e.blur();
	}, [g, y]), Lh(() => {
		if (!(r || !A)) return A.setFocusManagerState({
			modal: s,
			closeOnFocusOut: c,
			open: g,
			onOpenChange: h.setOpen,
			domReference: v
		}), () => {
			A.setFocusManagerState(null);
		};
	}, [
		r,
		A,
		s,
		g,
		h,
		c,
		v
	]), Lh(() => {
		if (!(r || !U)) return oy(U, T), () => {
			queueMicrotask(ny);
		};
	}, [
		r,
		U,
		T
	]);
	let ae = !r && (s ? !w : !0) && (H || s);
	return /* @__PURE__ */ (0, q.jsxs)(_.Fragment, { children: [
		ae && /* @__PURE__ */ (0, q.jsx)(Tv, {
			"data-type": "inside",
			ref: te,
			onFocus: (e) => {
				if (s) {
					let e = re();
					Ov(e[e.length - 1]);
				} else A?.portalNode && (j.current = !1, f_(e, A.portalNode) ? u_(v)?.focus() : Qv(d ?? A.beforeOutsideRef)?.focus());
			}
		}),
		n,
		ae && /* @__PURE__ */ (0, q.jsx)(Tv, {
			"data-type": "inside",
			ref: z,
			onFocus: (e) => {
				s ? Ov(re()[0]) : A?.portalNode && (c && (j.current = !0), f_(e, A.portalNode) ? d_(v)?.focus() : Qv(u ?? A.afterOutsideRef)?.focus());
			}
		})
	] });
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/floating-ui-react/hooks/useDismiss.js
var cy = {
	intentional: "onClick",
	sloppy: "onPointerDown"
};
function ly() {
	return !1;
}
function uy(e) {
	return {
		escapeKey: typeof e == "boolean" ? e : e?.escapeKey ?? !1,
		outsidePress: typeof e == "boolean" ? e : e?.outsidePress ?? !0
	};
}
function dy(e, t = {}) {
	let { enabled: n = !0, escapeKey: r = !0, outsidePress: i = !0, outsidePressEvent: a = "sloppy", referencePress: o = ly, referencePressEvent: s = "sloppy", bubbles: c, externalTree: l } = t, u = "rootStore" in e ? e.rootStore : e, d = u.useState("open"), f = u.useState("floatingElement"), { dataRef: p } = u.context, m = Zv(l), h = Ph(typeof i == "function" ? i : () => !1), g = typeof i == "function" ? h : i, v = g !== !1, y = Ph(() => a), { escapeKey: b, outsidePress: x } = uy(c), S = _.useRef(!1), C = _.useRef(!1), w = _.useRef(!1), T = _.useRef(!1), E = _.useRef(""), D = _.useRef(null), O = tg(), k = tg(), A = Ph(() => {
		k.clear(), p.current.insideReactTree = !1;
	}), j = Ph((e) => {
		let t = p.current.floatingContext?.nodeId;
		return (m ? Lg(m.nodesRef.current, t) : []).some((t) => t.context?.open && !t.context.dataRef.current[e]);
	}), M = Ph((e) => Mg(e, u.select("floatingElement")) || Mg(e, u.select("domReferenceElement"))), N = Ph((e) => {
		o() && u.setOpen(!1, pv(sv, e.nativeEvent));
	}), P = Ph((e) => {
		if (!d || !n || !r || e.key !== "Escape" || T.current || !b && j("__escapeKeyBubbles")) return;
		let t = pv(dv, Bg(e) ? e.nativeEvent : e);
		u.setOpen(!1, t), t.isCanceled || e.preventDefault(), !b && !t.isPropagationAllowed && e.stopPropagation();
	}), F = Ph(() => {
		p.current.insideReactTree = !0, k.start(0, A);
	}), I = Ph((e) => {
		if (!d || !n || e.button !== 0) return;
		let t = jg(e.nativeEvent);
		Ag(u.select("floatingElement"), t) && (S.current || (S.current = !0, C.current = !1));
	}), L = Ph((e) => {
		!d || !n || (e.defaultPrevented || e.nativeEvent.defaultPrevented) && S.current && (C.current = !0);
	});
	_.useEffect(() => {
		if (!d || !n) return;
		p.current.__escapeKeyBubbles = b, p.current.__outsidePressBubbles = x;
		let e = new eg(), t = new eg();
		function i() {
			e.clear(), T.current = !0;
		}
		function a() {
			e.start(Dh() ? 5 : 0, () => {
				T.current = !1;
			});
		}
		function o() {
			w.current = !0, t.start(0, () => {
				w.current = !1;
			});
		}
		function s() {
			S.current = !1, C.current = !1;
		}
		function c() {
			let e = E.current, t = e === "pen" || !e ? "mouse" : e, n = y(), r = typeof n == "function" ? n() : n;
			return typeof r == "string" ? r : r[t];
		}
		function l(e) {
			let t = c();
			return t === "intentional" && e.type !== "click" || t === "sloppy" && e.type === "click";
		}
		function h(e) {
			let t = p.current.floatingContext?.nodeId, n = m && Lg(m.nodesRef.current, t).some((t) => Mg(e, t.context?.elements.floating));
			return M(e) || n;
		}
		function _(e) {
			if (l(e)) {
				e.type !== "click" && !M(e) && (t.clear(), w.current = !1), A();
				return;
			}
			if (p.current.insideReactTree) {
				A();
				return;
			}
			let n = jg(e), r = `[${Ev("inert")}]`, i = Sh(n) ? n.getRootNode() : null, a = Array.from((wh(i) ? i : Kg(u.select("floatingElement"))).querySelectorAll(r)), o = u.context.triggerElements;
			if (n && (o.hasElement(n) || o.hasMatchingElement((e) => Ag(e, n)))) return;
			let s = Sh(n) ? n : null;
			for (; s && !Oh(s);) {
				let e = Ah(s);
				if (Oh(e) || !Sh(e)) break;
				s = e;
			}
			if (!(a.length && Sh(n) && !Ng(n) && !Ag(n, u.select("floatingElement")) && a.every((e) => !Ag(s, e)))) {
				if (Ch(n) && !("touches" in e)) {
					let t = Oh(n), r = kh(n), i = /auto|scroll/, a = t || i.test(r.overflowX), o = t || i.test(r.overflowY), s = a && n.clientWidth > 0 && n.scrollWidth > n.clientWidth, c = o && n.clientHeight > 0 && n.scrollHeight > n.clientHeight, l = r.direction === "rtl", u = c && (l ? e.offsetX <= n.offsetWidth - n.clientWidth : e.offsetX > n.clientWidth), d = s && e.offsetY > n.clientHeight;
					if (u || d) return;
				}
				if (!h(e)) {
					if (c() === "intentional" && w.current) {
						t.clear(), w.current = !1;
						return;
					}
					typeof g == "function" && !g(e) || j("__outsidePressBubbles") || (u.setOpen(!1, pv(cv, e)), A());
				}
			}
		}
		function k(e) {
			c() !== "sloppy" || e.pointerType === "touch" || !u.select("open") || !n || M(e) || _(e);
		}
		function N(e) {
			if (c() !== "sloppy" || !u.select("open") || !n || M(e)) return;
			let t = e.touches[0];
			t && (D.current = {
				startTime: Date.now(),
				startX: t.clientX,
				startY: t.clientY,
				dismissOnTouchEnd: !1,
				dismissOnMouseDown: !0
			}, O.start(1e3, () => {
				D.current && (D.current.dismissOnTouchEnd = !1, D.current.dismissOnMouseDown = !1);
			}));
		}
		function F(e, t) {
			let n = jg(e);
			if (!n) return;
			let r = F_(n, e.type, () => {
				t(e), r();
			});
		}
		function I(e) {
			E.current = "touch", F(e, N);
		}
		function L(e) {
			O.clear(), e.type === "pointerdown" && (E.current = e.pointerType), !(e.type === "mousedown" && D.current && !D.current.dismissOnMouseDown) && F(e, (e) => {
				e.type === "pointerdown" ? k(e) : _(e);
			});
		}
		function R(e) {
			if (!S.current) return;
			let n = C.current;
			if (s(), c() === "intentional") {
				if (e.type === "pointercancel") {
					n && o();
					return;
				}
				if (!h(e)) {
					if (n) {
						o();
						return;
					}
					typeof g == "function" && !g(e) || (t.clear(), w.current = !0, A());
				}
			}
		}
		function ee(e) {
			if (c() !== "sloppy" || !D.current || M(e)) return;
			let t = e.touches[0];
			if (!t) return;
			let n = Math.abs(t.clientX - D.current.startX), r = Math.abs(t.clientY - D.current.startY), i = Math.sqrt(n * n + r * r);
			i > 5 && (D.current.dismissOnTouchEnd = !0), i > 10 && (_(e), O.clear(), D.current = null);
		}
		function te(e) {
			F(e, ee);
		}
		function z(e) {
			c() !== "sloppy" || !D.current || M(e) || (D.current.dismissOnTouchEnd && _(e), O.clear(), D.current = null);
		}
		function B(e) {
			F(e, z);
		}
		let V = Kg(f), ne = gv(r && gv(F_(V, "keydown", P), F_(V, "compositionstart", i), F_(V, "compositionend", a)), v && gv(F_(V, "click", L, !0), F_(V, "pointerdown", L, !0), F_(V, "pointerup", R, !0), F_(V, "pointercancel", R, !0), F_(V, "mousedown", L, !0), F_(V, "mouseup", R, !0), F_(V, "touchstart", I, !0), F_(V, "touchmove", te, !0), F_(V, "touchend", B, !0)));
		return () => {
			ne(), e.clear(), t.clear(), s(), w.current = !1;
		};
	}, [
		p,
		f,
		r,
		v,
		g,
		d,
		n,
		b,
		x,
		P,
		A,
		y,
		j,
		M,
		m,
		u,
		O
	]), _.useEffect(A, [g, A]);
	let R = _.useMemo(() => ({
		onKeyDown: P,
		[cy[s]]: N,
		...s !== "intentional" && { onClick: N }
	}), [
		P,
		N,
		s
	]), ee = _.useMemo(() => ({
		onKeyDown: P,
		onPointerDown: L,
		onMouseDown: L,
		onClickCapture: F,
		onMouseDownCapture(e) {
			F(), I(e);
		},
		onPointerDownCapture(e) {
			F(), I(e);
		},
		onMouseUpCapture: F,
		onTouchEndCapture: F,
		onTouchMoveCapture: F
	}), [
		P,
		F,
		I,
		L
	]);
	return _.useMemo(() => n ? {
		reference: R,
		floating: ee,
		trigger: R
	} : {}, [
		n,
		R,
		ee
	]);
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.2.9_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/utils/esm/store/createSelector.js
var fy = (e, t, n, r, i, a, ...o) => {
	if (o.length > 0) throw Error(I(1));
	let s;
	if (e && t && n && r && i && a) s = (o, s, c, l) => a(e(o, s, c, l), t(o, s, c, l), n(o, s, c, l), r(o, s, c, l), i(o, s, c, l), s, c, l);
	else if (e && t && n && r && i) s = (a, o, s, c) => i(e(a, o, s, c), t(a, o, s, c), n(a, o, s, c), r(a, o, s, c), o, s, c);
	else if (e && t && n && r) s = (i, a, o, s) => r(e(i, a, o, s), t(i, a, o, s), n(i, a, o, s), a, o, s);
	else if (e && t && n) s = (r, i, a, o) => n(e(r, i, a, o), t(r, i, a, o), i, a, o);
	else if (e && t) s = (n, r, i, a) => t(e(n, r, i, a), r, i, a);
	else if (e) s = e;
	else throw Error("Missing arguments");
	return s;
}, py = [], my = void 0;
function hy() {
	return my;
}
function gy(e) {
	py.push(e);
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.2.9_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/utils/esm/store/useStore.js
var _y = rd(), vy = U(19) ? xy : Sy;
function yy(e, t, n, r, i) {
	return vy(e, t, n, r, i);
}
function by(e, t, n, r, i) {
	let a = _.useCallback(() => t(e.getSnapshot(), n, r, i), [
		e,
		t,
		n,
		r,
		i
	]);
	return (0, _y.useSyncExternalStore)(e.subscribe, a, a);
}
gy({
	before(e) {
		e.syncIndex = 0, e.didInitialize || (e.syncTick = 1, e.syncHooks = [], e.didChangeStore = !0, e.getSnapshot = () => {
			let t = !1;
			for (let n = 0; n < e.syncHooks.length; n += 1) {
				let r = e.syncHooks[n], i = r.selector(r.store.state, r.a1, r.a2, r.a3);
				(r.didChange || !Object.is(r.value, i)) && (t = !0, r.value = i, r.didChange = !1);
			}
			return t && (e.syncTick += 1), e.syncTick;
		});
	},
	after(e) {
		e.syncHooks.length > 0 && (e.didChangeStore && (e.didChangeStore = !1, e.subscribe = (t) => {
			let n = /* @__PURE__ */ new Set();
			for (let t of e.syncHooks) n.add(t.store);
			let r = [];
			for (let e of n) r.push(e.subscribe(t));
			return () => {
				for (let e of r) e();
			};
		}), (0, _y.useSyncExternalStore)(e.subscribe, e.getSnapshot, e.getSnapshot));
	}
});
function xy(e, t, n, r, i) {
	let a = hy();
	if (!a) return by(e, t, n, r, i);
	let o = a.syncIndex;
	a.syncIndex += 1;
	let s;
	return a.didInitialize ? (s = a.syncHooks[o], (s.store !== e || s.selector !== t || !Object.is(s.a1, n) || !Object.is(s.a2, r) || !Object.is(s.a3, i)) && (s.store !== e && (a.didChangeStore = !0), s.store = e, s.selector = t, s.a1 = n, s.a2 = r, s.a3 = i, s.didChange = !0)) : (s = {
		store: e,
		selector: t,
		a1: n,
		a2: r,
		a3: i,
		value: t(e.getSnapshot(), n, r, i),
		didChange: !1
	}, a.syncHooks.push(s)), s.value;
}
function Sy(e, t, n, r, i) {
	return (0, ad.useSyncExternalStoreWithSelector)(e.subscribe, e.getSnapshot, e.getSnapshot, (e) => t(e, n, r, i));
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.2.9_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/utils/esm/store/Store.js
var Cy = class {
	constructor(e) {
		this.state = e, this.listeners = /* @__PURE__ */ new Set(), this.updateTick = 0;
	}
	subscribe = (e) => (this.listeners.add(e), () => {
		this.listeners.delete(e);
	});
	getSnapshot = () => this.state;
	setState(e) {
		if (this.state === e) return;
		this.state = e, this.updateTick += 1;
		let t = this.updateTick;
		for (let n of this.listeners) {
			if (t !== this.updateTick) return;
			n(e);
		}
	}
	update(e) {
		for (let t in e) if (!Object.is(this.state[t], e[t])) {
			this.setState({
				...this.state,
				...e
			});
			return;
		}
	}
	set(e, t) {
		Object.is(this.state[e], t) || this.setState({
			...this.state,
			[e]: t
		});
	}
	notifyAll() {
		let e = { ...this.state };
		this.setState(e);
	}
	use(e, t, n, r) {
		return yy(this, e, t, n, r);
	}
}, wy = class extends Cy {
	constructor(e, t = {}, n) {
		super(e), this.context = t, this.selectors = n;
	}
	useSyncedValue(e, t) {
		_.useDebugValue(e);
		let n = this;
		Lh(() => {
			n.state[e] !== t && n.set(e, t);
		}, [
			n,
			e,
			t
		]);
	}
	useSyncedValueWithCleanup(e, t) {
		let n = this;
		Lh(() => (n.state[e] !== t && n.set(e, t), () => {
			n.set(e, void 0);
		}), [
			n,
			e,
			t
		]);
	}
	useSyncedValues(e) {
		let t = this;
		Lh(() => {
			t.update(e);
		}, [t, ...Object.values(e)]);
	}
	useControlledProp(e, t) {
		_.useDebugValue(e);
		let n = this, r = t !== void 0;
		Lh(() => {
			r && !Object.is(n.state[e], t) && n.setState({
				...n.state,
				[e]: t
			});
		}, [
			n,
			e,
			t,
			r
		]);
	}
	select(e, t, n, r) {
		let i = this.selectors[e];
		return i(this.state, t, n, r);
	}
	useState(e, t, n, r) {
		return _.useDebugValue(e), yy(this, this.selectors[e], t, n, r);
	}
	useContextCallback(e, t) {
		_.useDebugValue(e);
		let n = Ph(t ?? ie);
		this.context[e] = n;
	}
	useStateSetter(e) {
		let t = _.useRef(void 0);
		return t.current === void 0 && (t.current = (t) => {
			this.set(e, t);
		}), t.current;
	}
	observe(e, t) {
		let n;
		n = typeof e == "function" ? e : this.selectors[e];
		let r = n(this.state);
		return t(r, r, this), this.subscribe((e) => {
			let i = n(e);
			if (!Object.is(r, i)) {
				let e = r;
				r = i, t(i, e, this);
			}
		});
	}
}, Ty = {
	open: fy((e) => e.open),
	transitionStatus: fy((e) => e.transitionStatus),
	domReferenceElement: fy((e) => e.domReferenceElement),
	referenceElement: fy((e) => e.positionReference ?? e.referenceElement),
	floatingElement: fy((e) => e.floatingElement),
	floatingId: fy((e) => e.floatingId)
}, Ey = class extends wy {
	constructor(e) {
		let { syncOnly: t, nested: n, onOpenChange: r, triggerElements: i, ...a } = e;
		super({
			...a,
			positionReference: a.referenceElement,
			domReferenceElement: a.referenceElement
		}, {
			onOpenChange: r,
			dataRef: { current: {} },
			events: qv(),
			nested: n,
			triggerElements: i
		}, Ty), this.syncOnly = t;
	}
	syncOpenEvent = (e, t) => {
		(!e || !this.state.open || t != null && Ug(t)) && (this.context.dataRef.current.openEvent = e ? t : void 0);
	};
	dispatchOpenChange = (e, t) => {
		this.syncOpenEvent(e, t.event);
		let n = {
			open: e,
			reason: t.reason,
			nativeEvent: t.event,
			nested: this.context.nested,
			triggerElement: t.trigger
		};
		this.context.events.emit("openchange", n);
	};
	setOpen = (e, t) => {
		if (this.syncOnly) {
			this.context.onOpenChange?.(e, t);
			return;
		}
		this.dispatchOpenChange(e, t), this.context.onOpenChange?.(e, t);
	};
};
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/floating-ui-react/hooks/useSyncedFloatingRootContext.js
function Dy(e) {
	let { popupStore: t, treatPopupAsFloatingElement: n = !1, floatingRootContext: r, floatingId: i, nested: a, onOpenChange: o } = e, s = t.useState("open"), c = t.useState("activeTriggerElement"), l = t.useState(n ? "popupElement" : "positionerElement"), u = t.context.triggerElements, d = o, f = _.useRef(null);
	r === void 0 && f.current === null && (f.current = new Ey({
		open: s,
		transitionStatus: void 0,
		referenceElement: c,
		floatingElement: l,
		triggerElements: u,
		onOpenChange: d,
		floatingId: i,
		syncOnly: !0,
		nested: a
	}));
	let p = r ?? f.current;
	return t.useSyncedValue("floatingId", i), Lh(() => {
		let e = {
			open: s,
			floatingId: i,
			referenceElement: c,
			floatingElement: l
		};
		Sh(c) && (e.domReferenceElement = c), p.state.positionReference === p.state.referenceElement && (e.positionReference = c), p.update(e);
	}, [
		s,
		i,
		c,
		l,
		p
	]), p.context.onOpenChange = d, p.context.nested = a, p;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/internals/useTransitionStatus.js
function Oy(e, t = !1, n = !1) {
	let [r, i] = _.useState(e && t ? "idle" : void 0), [a, o] = _.useState(e);
	return e && !a && (o(!0), i("starting")), !e && a && r !== "ending" && !n && i("ending"), !e && !a && r === "ending" && i(void 0), Lh(() => {
		if (!e && a && r !== "ending" && n) {
			let e = xv.request(() => {
				i("ending");
			});
			return () => {
				xv.cancel(e);
			};
		}
	}, [
		e,
		a,
		r,
		n
	]), Lh(() => {
		if (!e || t) return;
		let n = xv.request(() => {
			i(void 0);
		});
		return () => {
			xv.cancel(n);
		};
	}, [t, e]), Lh(() => {
		if (!e || !t) return;
		e && a && r !== "idle" && i("starting");
		let n = xv.request(() => {
			i("idle");
		});
		return () => {
			xv.cancel(n);
		};
	}, [
		t,
		e,
		a,
		r
	]), {
		mounted: a,
		setMounted: o,
		transitionStatus: r
	};
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/internals/useAnimationsFinished.js
function ky(e, t = !1, n = !0) {
	let r = Sv();
	return Ph((i, a = null) => {
		r.cancel();
		let o = Qv(e);
		if (o == null) return;
		let s = o, c = () => {
			hd.flushSync(i);
		};
		if (typeof s.getAnimations != "function" || globalThis.BASE_UI_ANIMATIONS_DISABLED) {
			i();
			return;
		}
		function l() {
			Promise.all(s.getAnimations().map((e) => e.finished)).then(() => {
				a?.aborted || c();
			}).catch(() => {
				if (n) {
					a?.aborted || c();
					return;
				}
				let e = s.getAnimations();
				!a?.aborted && e.length > 0 && e.some((e) => e.pending || e.playState !== "finished") && l();
			});
		}
		if (t) {
			let e = Y_.startingStyle;
			if (!s.hasAttribute(e)) {
				r.request(l);
				return;
			}
			let t = new MutationObserver(() => {
				s.hasAttribute(e) || (t.disconnect(), l());
			});
			t.observe(s, {
				attributes: !0,
				attributeFilter: [e]
			}), a?.addEventListener("abort", () => t.disconnect(), { once: !0 });
			return;
		}
		r.request(l);
	});
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/internals/useOpenChangeComplete.js
function Ay(e) {
	let { enabled: t = !0, open: n, ref: r, onComplete: i } = e, a = Ph(i), o = ky(r, n, !1);
	_.useEffect(() => {
		if (!t) return;
		let e = new AbortController();
		return o(a, e.signal), () => {
			e.abort();
		};
	}, [
		t,
		n,
		a,
		o
	]);
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/utils/popups/popupStoreUtils.js
var jy = {
	tabIndex: -1,
	[Og]: ""
};
function My(e, t, n = !1) {
	let r = fg(), i = Xv() != null, a = _.useRef(null);
	e === void 0 && a.current === null && (a.current = t(r, i));
	let o = e ?? a.current;
	return Dy({
		popupStore: o,
		treatPopupAsFloatingElement: n,
		floatingRootContext: o.state.floatingRootContext,
		floatingId: r,
		nested: i,
		onOpenChange: o.setOpen
	}), {
		store: o,
		internalStore: a.current
	};
}
function Ny(e, t, n) {
	let r = n?.id ?? null;
	(r || t) && (e.activeTriggerId = r, e.activeTriggerElement = n ?? null);
}
function Py(e) {
	let t = e.useState("open");
	Lh(() => {
		if (!t) {
			e.state.triggerCount !== 0 && e.set("triggerCount", 0);
			return;
		}
		let n = e.context.triggerElements.size, r = {};
		if (e.state.triggerCount !== n && (r.triggerCount = n), !e.select("activeTriggerId") && n === 1) {
			let t = e.context.triggerElements.entries().next();
			if (!t.done) {
				let [e, n] = t.value;
				r.activeTriggerId = e, r.activeTriggerElement = n;
			}
		}
		(r.triggerCount !== void 0 || r.activeTriggerId !== void 0) && e.update(r);
	}, [
		t,
		e,
		e.useState("triggerCount")
	]);
}
function Fy(e, t, n) {
	let { mounted: r, setMounted: i, transitionStatus: a } = Oy(e);
	t.useSyncedValues({
		mounted: r,
		transitionStatus: a
	});
	let o = Ph(() => {
		i(!1), t.update({
			activeTriggerId: null,
			activeTriggerElement: null,
			mounted: !1,
			preventUnmountingOnClose: !1
		}), n?.(), t.context.onOpenChangeComplete?.(!1);
	}), s = t.useState("preventUnmountingOnClose");
	return Ay({
		enabled: r && !e && !s,
		open: e,
		ref: t.context.popupRef,
		onComplete() {
			e || o();
		}
	}), {
		forceUnmount: o,
		transitionStatus: a
	};
}
function Iy(e, t) {
	e.useSyncedValues(t), Lh(() => () => {
		e.update({
			activeTriggerProps: ae,
			inactiveTriggerProps: ae,
			popupProps: ae
		});
	}, [e]);
}
function Ly(e, t) {
	Lh(() => {
		!t && e.state.openMethod !== null && e.set("openMethod", null);
	}, [t, e]), Lh(() => () => {
		e.state.openMethod !== null && e.set("openMethod", null);
	}, [e]);
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/utils/popups/popupTriggerMap.js
var Ry = class {
	constructor() {
		this.elementsSet = /* @__PURE__ */ new Set(), this.idMap = /* @__PURE__ */ new Map();
	}
	add(e, t) {
		let n = this.idMap.get(e);
		n !== t && (n !== void 0 && this.elementsSet.delete(n), this.elementsSet.add(t), this.idMap.set(e, t));
	}
	delete(e) {
		let t = this.idMap.get(e);
		t && (this.elementsSet.delete(t), this.idMap.delete(e));
	}
	hasElement(e) {
		return this.elementsSet.has(e);
	}
	hasMatchingElement(e) {
		for (let t of this.elementsSet) if (e(t)) return !0;
		return !1;
	}
	getById(e) {
		return this.idMap.get(e);
	}
	entries() {
		return this.idMap.entries();
	}
	elements() {
		return this.elementsSet.values();
	}
	get size() {
		return this.idMap.size;
	}
};
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/floating-ui-react/utils/getEmptyRootContext.js
function zy() {
	return new Ey({
		open: !1,
		transitionStatus: void 0,
		floatingElement: null,
		referenceElement: null,
		triggerElements: new Ry(),
		floatingId: void 0,
		syncOnly: !1,
		nested: !1,
		onOpenChange: void 0
	});
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/utils/popups/store.js
function By() {
	return {
		open: !1,
		openProp: void 0,
		mounted: !1,
		transitionStatus: void 0,
		floatingRootContext: zy(),
		floatingId: void 0,
		triggerCount: 0,
		preventUnmountingOnClose: !1,
		payload: void 0,
		activeTriggerId: null,
		activeTriggerElement: null,
		triggerIdProp: void 0,
		popupElement: null,
		positionerElement: null,
		activeTriggerProps: ae,
		inactiveTriggerProps: ae,
		popupProps: ae
	};
}
function Vy(e, t, n = !1) {
	return new Ey({
		open: !1,
		transitionStatus: void 0,
		floatingElement: null,
		referenceElement: null,
		triggerElements: e,
		floatingId: t,
		syncOnly: !0,
		nested: n,
		onOpenChange: void 0
	});
}
var Hy = fy((e) => e.triggerIdProp ?? e.activeTriggerId), Uy = fy((e) => e.openProp ?? e.open), Wy = fy((e) => (e.popupElement?.id ?? e.floatingId) || void 0);
function Gy(e, t) {
	return t !== void 0 && Uy(e) && Hy(e) === t;
}
function Ky(e, t) {
	return Gy(e, t) ? !0 : t !== void 0 && Uy(e) && Hy(e) == null && e.triggerCount === 1;
}
var qy = {
	open: Uy,
	mounted: fy((e) => e.mounted),
	transitionStatus: fy((e) => e.transitionStatus),
	floatingRootContext: fy((e) => e.floatingRootContext),
	triggerCount: fy((e) => e.triggerCount),
	preventUnmountingOnClose: fy((e) => e.preventUnmountingOnClose),
	payload: fy((e) => e.payload),
	activeTriggerId: Hy,
	activeTriggerElement: fy((e) => e.mounted ? e.activeTriggerElement : null),
	popupId: Wy,
	isTriggerActive: fy((e, t) => t !== void 0 && Hy(e) === t),
	isOpenedByTrigger: fy((e, t) => Gy(e, t)),
	isMountedByTrigger: fy((e, t) => t !== void 0 && Hy(e) === t && e.mounted),
	triggerProps: fy((e, t) => t ? e.activeTriggerProps : e.inactiveTriggerProps),
	triggerPopupId: fy((e, t) => Ky(e, t) ? Wy(e) : void 0),
	popupProps: fy((e) => e.popupProps),
	popupElement: fy((e) => e.popupElement),
	positionerElement: fy((e) => e.positionerElement)
}, Jy = /* @__PURE__ */ function(e) {
	return e.nestedDialogs = "--nested-dialogs", e;
}({}), Yy = function(e) {
	return e[e.open = $_.open] = "open", e[e.closed = $_.closed] = "closed", e[e.startingStyle = $_.startingStyle] = "startingStyle", e[e.endingStyle = $_.endingStyle] = "endingStyle", e.nested = "data-nested", e.nestedDialogOpen = "data-nested-dialog-open", e;
}({}), Xy = /* @__PURE__ */ _.createContext(void 0);
function Zy() {
	let e = _.useContext(Xy);
	if (e === void 0) throw Error(I(26));
	return e;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/internals/composite/composite.js
var Qy = "ArrowUp", $y = "ArrowDown", eb = "ArrowLeft", tb = "ArrowRight", nb = "Home", rb = new Set([eb, tb]), ib = new Set([Qy, $y]), ab = new Set([...rb, ...ib]), ob = new Set([
	...ab,
	nb,
	"End"
]), sb = {
	...iv,
	...Q_,
	nestedDialogOpen(e) {
		return e ? { [Yy.nestedDialogOpen]: "" } : null;
	}
}, cb = /* @__PURE__ */ _.forwardRef(function(e, t) {
	let { render: n, className: r, style: i, finalFocus: a, initialFocus: o, ...s } = e, { store: c } = J_(), l = c.useState("descriptionElementId"), u = c.useState("disablePointerDismissal"), d = c.useState("floatingRootContext"), f = c.useState("popupProps"), p = c.useState("modal"), m = c.useState("mounted"), h = c.useState("nested"), g = c.useState("nestedOpenDialogCount"), _ = c.useState("open"), v = c.useState("openMethod"), y = c.useState("titleElementId"), b = c.useState("transitionStatus"), x = c.useState("role"), S = d.useState("floatingId"), C = s.id ?? S;
	Zy(), Ay({
		open: _,
		ref: c.context.popupRef,
		onComplete() {
			_ && c.context.onOpenChangeComplete?.(!0);
		}
	});
	function w(e) {
		return e === "touch" ? c.context.popupRef.current : !0;
	}
	let T = o === void 0 ? w : o, E = g > 0, D = c.useStateSetter("popupElement"), O = le("div", e, {
		state: {
			open: _,
			nested: h,
			transitionStatus: b,
			nestedDialogOpen: E
		},
		props: [
			f,
			{
				id: C,
				"aria-labelledby": y ?? void 0,
				"aria-describedby": l ?? void 0,
				role: x,
				...jy,
				hidden: !m,
				onKeyDown(e) {
					ob.has(e.key) && e.stopPropagation();
				},
				style: { [Jy.nestedDialogs]: g }
			},
			s
		],
		ref: [
			t,
			c.context.popupRef,
			D
		],
		stateAttributesMapping: sb
	});
	return /* @__PURE__ */ (0, q.jsx)(sy, {
		context: d,
		openInteractionType: v,
		disabled: !m,
		closeOnFocusOut: !u,
		initialFocus: T,
		returnFocus: a,
		modal: p !== !1,
		restoreFocus: "popup",
		children: O
	});
});
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.2.9_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/utils/esm/inertValue.js
function lb(e) {
	return U(19) ? e : e ? "true" : void 0;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/utils/InternalBackdrop.js
var ub = /* @__PURE__ */ _.forwardRef(function(e, t) {
	let { cutout: n, ...r } = e, i;
	if (n) {
		let e = n.getBoundingClientRect();
		i = `polygon(0% 0%,100% 0%,100% 100%,0% 100%,0% 0%,${e.left}px ${e.top}px,${e.left}px ${e.bottom}px,${e.right}px ${e.bottom}px,${e.right}px ${e.top}px,${e.left}px ${e.top}px)`;
	}
	return /* @__PURE__ */ (0, q.jsx)("div", {
		ref: t,
		role: "presentation",
		"data-base-ui-inert": "",
		...r,
		style: {
			position: "fixed",
			inset: 0,
			userSelect: "none",
			WebkitUserSelect: "none",
			clipPath: i
		}
	});
}), db = /* @__PURE__ */ _.forwardRef(function(e, t) {
	let { keepMounted: n = !1, ...r } = e, { store: i } = J_(), a = i.useState("mounted"), o = i.useState("modal"), s = i.useState("open");
	return a || n ? /* @__PURE__ */ (0, q.jsx)(Xy.Provider, {
		value: n,
		children: /* @__PURE__ */ (0, q.jsxs)(Kv, {
			ref: t,
			...r,
			children: [a && o === !0 && /* @__PURE__ */ (0, q.jsx)(ub, {
				ref: i.context.internalBackdropRef,
				inert: lb(!s)
			}), e.children]
		})
	}) : null;
});
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.2.9_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/utils/esm/useOnFirstRender.js
function fb(e) {
	let t = _.useRef(!0);
	t.current && (t.current = !1, e());
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.2.9_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/utils/esm/useScrollLock.js
var pb = {}, mb = {}, hb = "";
function gb(e) {
	if (typeof document > "u") return !1;
	let t = Kg(e);
	return yh(t).innerWidth - t.documentElement.clientWidth > 0;
}
function _b(e) {
	if (!(typeof CSS < "u" && CSS.supports && CSS.supports("scrollbar-gutter", "stable")) || typeof document > "u") return !1;
	let t = Kg(e), n = t.documentElement, r = t.body, i = Th(n) ? n : r, a = i.style.overflowY, o = n.style.scrollbarGutter;
	n.style.scrollbarGutter = "stable", i.style.overflowY = "scroll";
	let s = i.offsetWidth;
	i.style.overflowY = "hidden";
	let c = i.offsetWidth;
	return i.style.overflowY = a, n.style.scrollbarGutter = o, s === c;
}
function vb(e) {
	let t = Kg(e), n = t.documentElement, r = t.body, i = Th(n) ? n : r, a = {
		overflowY: i.style.overflowY,
		overflowX: i.style.overflowX
	};
	return Object.assign(i.style, {
		overflowY: "hidden",
		overflowX: "hidden"
	}), () => {
		Object.assign(i.style, a);
	};
}
function yb(e) {
	let t = Kg(e), n = t.documentElement, r = t.body, i = yh(n), a = 0, o = 0, s = !1, c = xv.create();
	if (bg && (i.visualViewport?.scale ?? 1) !== 1) return () => {};
	function l() {
		let t = i.getComputedStyle(n), c = i.getComputedStyle(r), l = (t.scrollbarGutter || "").includes("both-edges") ? "stable both-edges" : "stable";
		a = n.scrollTop, o = n.scrollLeft, pb = {
			scrollbarGutter: n.style.scrollbarGutter,
			overflowY: n.style.overflowY,
			overflowX: n.style.overflowX
		}, hb = n.style.scrollBehavior, mb = {
			position: r.style.position,
			height: r.style.height,
			width: r.style.width,
			boxSizing: r.style.boxSizing,
			overflowY: r.style.overflowY,
			overflowX: r.style.overflowX,
			scrollBehavior: r.style.scrollBehavior
		};
		let u = n.scrollHeight > n.clientHeight, d = n.scrollWidth > n.clientWidth, f = t.overflowY === "scroll" || c.overflowY === "scroll", p = t.overflowX === "scroll" || c.overflowX === "scroll", m = Math.max(0, i.innerWidth - r.clientWidth), h = Math.max(0, i.innerHeight - r.clientHeight), g = parseFloat(c.marginTop) + parseFloat(c.marginBottom), _ = parseFloat(c.marginLeft) + parseFloat(c.marginRight), v = Th(n) ? n : r;
		if (s = _b(e), s) {
			n.style.scrollbarGutter = l, v.style.overflowY = "hidden", v.style.overflowX = "hidden";
			return;
		}
		Object.assign(n.style, {
			scrollbarGutter: l,
			overflowY: "hidden",
			overflowX: "hidden"
		}), (u || f) && (n.style.overflowY = "scroll"), (d || p) && (n.style.overflowX = "scroll"), Object.assign(r.style, {
			position: "relative",
			height: g || h ? `calc(100dvh - ${g + h}px)` : "100dvh",
			width: _ || m ? `calc(100vw - ${_ + m}px)` : "100vw",
			boxSizing: "border-box",
			overflow: "hidden",
			scrollBehavior: "unset"
		}), r.scrollTop = a, r.scrollLeft = o, n.setAttribute("data-base-ui-scroll-locked", ""), n.style.scrollBehavior = "unset";
	}
	function u() {
		Object.assign(n.style, pb), Object.assign(r.style, mb), s || (n.scrollTop = a, n.scrollLeft = o, n.removeAttribute("data-base-ui-scroll-locked"), n.style.scrollBehavior = hb);
	}
	function d() {
		u(), c.request(l);
	}
	l();
	let f = F_(i, "resize", d);
	return () => {
		c.cancel(), u(), typeof i.removeEventListener == "function" && f();
	};
}
var bb = new class {
	lockCount = 0;
	restore = null;
	timeoutLock = eg.create();
	timeoutUnlock = eg.create();
	acquire(e) {
		return this.lockCount += 1, this.lockCount === 1 && this.restore === null && this.timeoutLock.start(0, () => this.lock(e)), this.release;
	}
	release = () => {
		--this.lockCount, this.lockCount === 0 && this.restore && this.timeoutUnlock.start(0, this.unlock);
	};
	unlock = () => {
		this.lockCount === 0 && this.restore && (this.restore?.(), this.restore = null);
	};
	lock(e) {
		if (this.lockCount === 0 || this.restore !== null) return;
		let t = Kg(e).documentElement, n = yh(t).getComputedStyle(t).overflowY;
		if (n === "hidden" || n === "clip") {
			this.restore = ie;
			return;
		}
		let r = xg || !gb(e);
		this.restore = r ? vb(e) : yb(e);
	}
}();
function xb(e = !0, t = null) {
	Lh(() => {
		if (e) return bb.acquire(t);
	}, [e, t]);
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/dialog/root/useDialogRoot.js
function Sb(e) {
	let { store: t, parentContext: n, actionsRef: r, isDrawer: i } = e, a = t.useState("open");
	Ly(t, a), Py(t);
	let { forceUnmount: o } = Fy(a, t), s = _.useCallback(() => {
		t.setOpen(!1, pv(fv));
	}, [t]);
	return _.useImperativeHandle(r, () => ({
		unmount: o,
		close: s
	}), [o, s]), {
		parentContext: n,
		isDrawer: i
	};
}
function Cb({ store: e, dialogRoot: t }) {
	let { parentContext: n, isDrawer: r } = t, i = e.useState("open"), a = e.useState("disablePointerDismissal"), o = e.useState("modal"), s = e.useState("popupElement"), c = e.useState("floatingRootContext"), [l, u] = _.useState(0), [d, f] = _.useState(0), p = l === 0, m = dy(c, {
		outsidePressEvent() {
			return e.context.internalBackdropRef.current || e.context.backdropRef.current ? "intentional" : {
				mouse: o === "trap-focus" ? "sloppy" : "intentional",
				touch: "sloppy"
			};
		},
		outsidePress(t) {
			if (!e.context.outsidePressEnabledRef.current || "button" in t && t.button !== 0 || "touches" in t && t.touches.length !== 1) return !1;
			let n = jg(t);
			if (p && !a) {
				let t = n;
				return o && (e.context.internalBackdropRef.current || e.context.backdropRef.current) ? e.context.internalBackdropRef.current === t || e.context.backdropRef.current === t || Ag(t, s) && !t?.hasAttribute("data-base-ui-portal") : !0;
			}
			return !1;
		},
		escapeKey: p
	});
	return xb(i && o === !0, s), e.useContextCallback("onNestedDialogOpen", (e, t) => {
		u(e), f(t);
	}), e.useContextCallback("onNestedDialogClose", () => {
		u(0), f(0);
	}), _.useEffect(() => (n?.onNestedDialogOpen && i && n.onNestedDialogOpen(l + 1, d + +!!r), n?.onNestedDialogClose && !i && n.onNestedDialogClose(), () => {
		n?.onNestedDialogClose && i && n.onNestedDialogClose();
	}), [
		r,
		i,
		l,
		d,
		n
	]), Iy(e, {
		activeTriggerProps: m.reference ?? ae,
		inactiveTriggerProps: m.trigger ?? ae,
		popupProps: _.useMemo(() => x(jy, m.floating), [m.floating]),
		nestedOpenDialogCount: l,
		nestedOpenDrawerCount: d
	}), null;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/dialog/store/DialogStore.js
var wb = {
	...qy,
	modal: fy((e) => e.modal),
	nested: fy((e) => e.nested),
	nestedOpenDialogCount: fy((e) => e.nestedOpenDialogCount),
	nestedOpenDrawerCount: fy((e) => e.nestedOpenDrawerCount),
	disablePointerDismissal: fy((e) => e.disablePointerDismissal),
	openMethod: fy((e) => e.openMethod),
	descriptionElementId: fy((e) => e.descriptionElementId),
	titleElementId: fy((e) => e.titleElementId),
	viewportElement: fy((e) => e.viewportElement),
	role: fy((e) => e.role)
}, Tb = class e extends wy {
	constructor(e, t, n = !1) {
		let r = new Ry(), i = Eb(e);
		i.floatingRootContext = Vy(r, t, n), super(i, {
			popupRef: /* @__PURE__ */ _.createRef(),
			backdropRef: /* @__PURE__ */ _.createRef(),
			internalBackdropRef: /* @__PURE__ */ _.createRef(),
			outsidePressEnabledRef: { current: !0 },
			triggerElements: r,
			onOpenChange: void 0,
			onOpenChangeComplete: void 0
		}, wb);
	}
	setOpen = (e, t) => {
		if (t.preventUnmountOnClose = () => {
			this.set("preventUnmountingOnClose", !0);
		}, !e && t.trigger == null && this.state.activeTriggerId != null && (t.trigger = this.state.activeTriggerElement ?? void 0), this.context.onOpenChange?.(e, t), t.isCanceled) return;
		this.state.floatingRootContext.dispatchOpenChange(e, t);
		let n = { open: e };
		Ny(n, e, t.trigger), this.update(n);
	};
	static useStore(t, n) {
		return My(t, (t, r) => new e(n, t, r), !0).store;
	}
};
function Eb(e = {}) {
	return {
		...By(),
		modal: !0,
		disablePointerDismissal: !1,
		popupElement: null,
		viewportElement: null,
		descriptionElementId: void 0,
		titleElementId: void 0,
		openMethod: null,
		nested: !1,
		nestedOpenDialogCount: 0,
		nestedOpenDrawerCount: 0,
		role: "dialog",
		...e
	};
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/dialog/root/useRenderDialogRoot.js
function Db(e, t = "dialog") {
	let { children: n, open: r, defaultOpen: i = !1, onOpenChange: a, onOpenChangeComplete: o, disablePointerDismissal: s = !1, modal: c = !0, actionsRef: l, handle: u, triggerId: d, defaultTriggerId: f = null } = e, p = t === "drawer", m = t === "alert-dialog", h = m ? !0 : c, g = m || s, v = m ? "alertdialog" : "dialog", y = J_(!0), b = {
		modal: h,
		disablePointerDismissal: g,
		nested: !!y,
		role: v
	}, x = Tb.useStore(u?.store, {
		open: i,
		openProp: r,
		activeTriggerId: f,
		triggerIdProp: d,
		...b
	});
	fb(() => {
		let e = r === void 0 && x.state.open === !1 && i === !0 ? {
			open: !0,
			activeTriggerId: f
		} : null;
		m ? x.update(e ? {
			...b,
			...e
		} : b) : e && x.update(e);
	}), x.useControlledProp("openProp", r), x.useControlledProp("triggerIdProp", d), x.useSyncedValues(b), x.useContextCallback("onOpenChange", a), x.useContextCallback("onOpenChangeComplete", o);
	let S = x.useState("open"), C = x.useState("mounted"), w = x.useState("payload"), T = Sb({
		store: x,
		actionsRef: l,
		parentContext: y?.store.context,
		isDrawer: p
	}), E = S || C, D = _.useMemo(() => ({ store: x }), [x]);
	return /* @__PURE__ */ (0, q.jsx)(K_.Provider, {
		value: !1,
		children: /* @__PURE__ */ (0, q.jsxs)(q_.Provider, {
			value: D,
			children: [E && /* @__PURE__ */ (0, q.jsx)(Cb, {
				store: x,
				dialogRoot: T
			}), typeof n == "function" ? n({ payload: w }) : n]
		})
	});
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/dialog/root/DialogRoot.js
function Ob(e) {
	return Db(e, _.useContext(K_) ? "drawer" : "dialog");
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/dialog/title/DialogTitle.js
var kb = /* @__PURE__ */ _.forwardRef(function(e, t) {
	let { render: n, className: r, style: i, id: a, ...o } = e, { store: s } = J_(), c = pg(a);
	return s.useSyncedValueWithCleanup("titleElementId", c), le("h2", e, {
		ref: t,
		props: [{ id: c }, o]
	});
}), Ab = (0, _.createContext)(null);
function jb({ container: e, children: t }) {
	return /* @__PURE__ */ (0, q.jsx)(Ab.Provider, {
		value: e,
		children: t
	});
}
function Mb() {
	return (0, _.useContext)(Ab);
}
//#endregion
//#region src/components/ui/sheet.tsx
function Nb({ ...e }) {
	return /* @__PURE__ */ (0, q.jsx)(Ob, {
		"data-slot": "sheet",
		...e
	});
}
function Pb({ container: e, ...t }) {
	let n = Mb();
	return /* @__PURE__ */ (0, q.jsx)(db, {
		"data-slot": "sheet-portal",
		container: e ?? n ?? void 0,
		...t
	});
}
function Fb({ className: e, ...t }) {
	return /* @__PURE__ */ (0, q.jsx)(ov, {
		"data-slot": "sheet-overlay",
		className: Kt("fixed inset-0 z-50 bg-black/20 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-sm", e),
		...t
	});
}
function Ib({ className: e, children: t, side: n = "right", showCloseButton: r = !0, ...i }) {
	return /* @__PURE__ */ (0, q.jsxs)(Pb, { children: [/* @__PURE__ */ (0, q.jsx)(Fb, {}), /* @__PURE__ */ (0, q.jsxs)(cb, {
		"data-slot": "sheet-content",
		"data-side": n,
		className: Kt("fixed z-50 flex flex-col bg-popover bg-clip-padding text-sm text-popover-foreground shadow-md transition duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem] data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem] data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm", e),
		...i,
		children: [t, r && /* @__PURE__ */ (0, q.jsxs)(mv, {
			"data-slot": "sheet-close",
			render: /* @__PURE__ */ (0, q.jsx)(Kh, {
				variant: "ghost",
				className: "absolute top-4 right-4 bg-secondary",
				size: "icon-sm"
			}),
			children: [/* @__PURE__ */ (0, q.jsx)(dh, {}), /* @__PURE__ */ (0, q.jsx)("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function Lb({ className: e, ...t }) {
	return /* @__PURE__ */ (0, q.jsx)("div", {
		"data-slot": "sheet-header",
		className: Kt("flex flex-col gap-1.5 p-8", e),
		...t
	});
}
function Rb({ className: e, ...t }) {
	return /* @__PURE__ */ (0, q.jsx)(kb, {
		"data-slot": "sheet-title",
		className: Kt("font-heading text-lg font-semibold tracking-wider text-foreground uppercase", e),
		...t
	});
}
function zb({ className: e, ...t }) {
	return /* @__PURE__ */ (0, q.jsx)(hv, {
		"data-slot": "sheet-description",
		className: Kt("mt-0.5 text-sm leading-relaxed text-muted-foreground", e),
		...t
	});
}
//#endregion
//#region src/components/NodeDetailSheet.tsx
function Bb(e) {
	let t = window.location.origin, n = e.id.split(".")[1] ?? e.id;
	switch (e.kind) {
		case "script": return `${t}/config/script/edit/${n}`;
		case "scene": return `${t}/config/scene/edit/${n}`;
		default: return `${t}/config/entities/entity/${e.id}`;
	}
}
function Vb({ title: e, children: t }) {
	return /* @__PURE__ */ (0, q.jsxs)("div", {
		className: "space-y-1",
		children: [/* @__PURE__ */ (0, q.jsx)("div", {
			className: "text-[10px] uppercase tracking-wide text-muted-foreground",
			children: e
		}), /* @__PURE__ */ (0, q.jsx)("div", {
			className: "text-sm",
			children: t
		})]
	});
}
function Hb({ open: e, onOpenChange: t, node: n }) {
	let r = xn(), i = Sn(), a = Cn(), o = wn(n && (n.kind === "entity" || n.kind === "template" || n.kind === "scene" || n.kind === "script") ? n.id : void 0), s = hn(n?.id);
	if (!n) return null;
	let c = o?.labels ?? [], l = o?.exposure ?? {}, u = Object.keys(l);
	return /* @__PURE__ */ (0, q.jsx)(Nb, {
		open: e,
		onOpenChange: t,
		children: /* @__PURE__ */ (0, q.jsxs)(Ib, {
			side: "right",
			className: "w-[360px] sm:w-[400px] overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, q.jsxs)(Lb, { children: [/* @__PURE__ */ (0, q.jsx)(Rb, {
					className: "font-mono text-sm",
					children: n.id
				}), /* @__PURE__ */ (0, q.jsxs)(zb, {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, q.jsx)(Jt, {
						variant: "outline",
						children: n.kind
					}), s && /* @__PURE__ */ (0, q.jsx)(Jt, {
						variant: "secondary",
						className: "font-mono text-[10px]",
						children: s
					})]
				})] }),
				r === "error" && /* @__PURE__ */ (0, q.jsxs)("div", {
					className: "my-3 rounded border border-destructive/40 bg-destructive/10 p-2 text-xs",
					children: [
						/* @__PURE__ */ (0, q.jsx)("div", { children: "Registry unavailable." }),
						i && /* @__PURE__ */ (0, q.jsx)("div", {
							className: "font-mono opacity-70",
							children: i
						}),
						/* @__PURE__ */ (0, q.jsx)(Kh, {
							size: "sm",
							variant: "outline",
							className: "mt-1",
							onClick: a,
							children: "Retry"
						})
					]
				}),
				/* @__PURE__ */ (0, q.jsxs)("div", {
					className: "mt-4 space-y-4",
					children: [
						/* @__PURE__ */ (0, q.jsx)(Vb, {
							title: "Area",
							children: o?.areaName ?? "—"
						}),
						/* @__PURE__ */ (0, q.jsx)(Vb, {
							title: "Status",
							children: /* @__PURE__ */ (0, q.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, q.jsx)(Jt, {
									variant: o?.enabled ? "default" : "destructive",
									children: o?.enabled ? "Enabled" : "Disabled"
								}), /* @__PURE__ */ (0, q.jsx)(Jt, {
									variant: o?.visible ? "default" : "secondary",
									children: o?.visible ? "Visible" : "Hidden"
								})]
							})
						}),
						/* @__PURE__ */ (0, q.jsx)(Vb, {
							title: "Labels",
							children: c.length === 0 ? "—" : /* @__PURE__ */ (0, q.jsx)("div", {
								className: "flex flex-wrap gap-1",
								children: c.map((e) => /* @__PURE__ */ (0, q.jsx)(Jt, {
									variant: "outline",
									children: e
								}, e))
							})
						}),
						/* @__PURE__ */ (0, q.jsx)(Vb, {
							title: "Voice exposure",
							children: u.length === 0 ? "No voice assistant exposure." : /* @__PURE__ */ (0, q.jsx)("ul", {
								className: "space-y-0.5",
								children: u.map((e) => /* @__PURE__ */ (0, q.jsxs)("li", {
									className: "flex justify-between font-mono text-xs",
									children: [/* @__PURE__ */ (0, q.jsx)("span", { children: e }), /* @__PURE__ */ (0, q.jsx)("span", { children: l[e] ? "exposed" : "—" })]
								}, e))
							})
						}),
						/* @__PURE__ */ (0, q.jsx)(Vb, {
							title: "Source",
							children: /* @__PURE__ */ (0, q.jsxs)("span", {
								className: "font-mono text-xs",
								children: [
									n.source.file,
									":",
									n.source.line
								]
							})
						}),
						/* @__PURE__ */ (0, q.jsx)("a", {
							href: Bb(n),
							target: "_top",
							rel: "noreferrer",
							className: "inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90",
							children: "Open in Home Assistant"
						})
					]
				})
			]
		})
	});
}
//#endregion
//#region src/App.tsx
var Ub = 7, Wb = Date.now();
function Gb() {
	let { status: e } = mn();
	return /* @__PURE__ */ (0, q.jsx)(Jt, {
		variant: e === "connected" ? "default" : e === "error" ? "destructive" : "secondary",
		children: e === "connecting" ? "Connecting…" : e === "connected" ? "Connected" : "Error"
	});
}
function Kb({ generatedAt: e }) {
	let t = Math.floor((Wb - Date.parse(e)) / (1e3 * 60 * 60 * 24));
	return t < Ub ? null : /* @__PURE__ */ (0, q.jsxs)("div", {
		className: "border-b bg-amber-100 px-4 py-2 text-xs text-amber-900 dark:bg-amber-950 dark:text-amber-200",
		children: [
			"Manifest is ",
			t,
			" days old — run ",
			/* @__PURE__ */ (0, q.jsx)("code", { children: "bin/deploy-ssh.sh" }),
			" to refresh."
		]
	});
}
function qb() {
	let [e, t] = (0, _.useState)(null), [n, r] = (0, _.useState)(null), [i, a] = (0, _.useState)(null), [o, s] = (0, _.useState)(!1), c = Mn();
	return (0, _.useEffect)(() => {
		En().then(t).catch((e) => r(e instanceof Error ? e.message : String(e)));
	}, []), n ? /* @__PURE__ */ (0, q.jsx)(W_, {
		title: "Graph manifest missing",
		body: "Run `pnpm build` in terminus/ to generate `www/terminus/graph.json`."
	}) : e ? /* @__PURE__ */ (0, q.jsxs)("div", {
		className: "flex h-svh flex-col",
		children: [
			/* @__PURE__ */ (0, q.jsx)(Kb, { generatedAt: e.generatedAt }),
			/* @__PURE__ */ (0, q.jsxs)("header", {
				className: "flex h-16 items-center justify-between border-b px-4",
				children: [/* @__PURE__ */ (0, q.jsx)("h1", {
					className: "text-base font-semibold",
					children: "Terminus"
				}), /* @__PURE__ */ (0, q.jsx)(Gb, {})]
			}),
			/* @__PURE__ */ (0, q.jsx)("main", {
				className: "flex-1",
				children: c.name === "map" ? /* @__PURE__ */ (0, q.jsx)(gh, {
					manifest: e,
					onSelect: (e) => {
						a(e), s(!0);
					}
				}) : /* @__PURE__ */ (0, q.jsx)(G_, {
					manifest: e,
					autoId: c.id
				})
			}),
			/* @__PURE__ */ (0, q.jsx)(Hb, {
				open: o,
				onOpenChange: s,
				node: i
			})
		]
	}) : null;
}
function Jb() {
	return /* @__PURE__ */ (0, q.jsx)(pn, { children: /* @__PURE__ */ (0, q.jsx)(yn, { children: /* @__PURE__ */ (0, q.jsx)(qb, {}) }) });
}
//#endregion
//#region src/components/theme-provider.tsx
var Yb = "(prefers-color-scheme: dark)", Xb = [
	"dark",
	"light",
	"system"
], Zb = _.createContext(void 0);
function Qb(e) {
	return e === null ? !1 : Xb.includes(e);
}
function $b() {
	return window.matchMedia(Yb).matches ? "dark" : "light";
}
function ex() {
	let e = document.createElement("style");
	return e.appendChild(document.createTextNode("*,*::before,*::after{-webkit-transition:none!important;transition:none!important}")), document.head.appendChild(e), () => {
		window.getComputedStyle(document.body), requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				e.remove();
			});
		});
	};
}
function tx(e) {
	return e instanceof HTMLElement ? !!(e.isContentEditable || e.closest("input, textarea, select, [contenteditable='true']")) : !1;
}
function nx({ children: e, defaultTheme: t = "system", storageKey: n = "theme", disableTransitionOnChange: r = !0, ...i }) {
	let [a, o] = _.useState(() => {
		let e = localStorage.getItem(n);
		return Qb(e) ? e : t;
	}), s = _.useCallback((e) => {
		localStorage.setItem(n, e), o(e);
	}, [n]), c = _.useRef(null), l = _.useCallback((e) => {
		let t = e === "system" ? $b() : e, n = r ? ex() : null, i = [];
		c.current && i.push(c.current), i.push(document.documentElement);
		for (let e of i) e.classList.remove("light", "dark"), e.classList.add(t);
		n && n();
	}, [r]);
	_.useEffect(() => {
		if (l(a), a !== "system") return;
		let e = window.matchMedia(Yb), t = () => {
			l("system");
		};
		return e.addEventListener("change", t), () => {
			e.removeEventListener("change", t);
		};
	}, [a, l]), _.useEffect(() => {
		let e = (e) => {
			e.repeat || e.metaKey || e.ctrlKey || e.altKey || tx(e.target) || e.key.toLowerCase() === "d" && o((e) => {
				let t = e === "dark" ? "light" : e === "light" ? "dark" : $b() === "dark" ? "light" : "dark";
				return localStorage.setItem(n, t), t;
			});
		};
		return window.addEventListener("keydown", e), () => {
			window.removeEventListener("keydown", e);
		};
	}, [n]), _.useEffect(() => {
		let e = (e) => {
			if (e.storageArea === localStorage && e.key === n) {
				if (Qb(e.newValue)) {
					o(e.newValue);
					return;
				}
				o(t);
			}
		};
		return window.addEventListener("storage", e), () => {
			window.removeEventListener("storage", e);
		};
	}, [t, n]);
	let u = _.useMemo(() => ({
		theme: a,
		setTheme: s
	}), [a, s]);
	return /* @__PURE__ */ (0, q.jsx)(Zb.Provider, {
		...i,
		value: u,
		children: /* @__PURE__ */ (0, q.jsx)("div", {
			ref: (e) => {
				if (!e) {
					c.current = null;
					return;
				}
				let t = e.getRootNode();
				c.current = t instanceof ShadowRoot ? t.host : e, l(a);
			},
			style: { display: "contents" },
			children: e
		})
	});
}
//#endregion
//#region src/main.tsx
function rx(e, t = e) {
	let n = (0, v.createRoot)(e);
	return n.render(/* @__PURE__ */ (0, q.jsx)(_.StrictMode, { children: /* @__PURE__ */ (0, q.jsx)(nx, { children: /* @__PURE__ */ (0, q.jsx)(jb, {
		container: t,
		children: /* @__PURE__ */ (0, q.jsx)(Jb, {})
	}) }) })), n;
}
var ix = class extends HTMLElement {
	root;
	connectedCallback() {
		let e = this.shadowRoot ?? this.attachShadow({ mode: "open" });
		if (!e.querySelector("link[data-terminus-css]")) {
			let t = document.createElement("link");
			t.rel = "stylesheet", t.href = "/local/terminus/style.css", t.dataset.terminusCss = "true", e.appendChild(t);
		}
		let t = e.querySelector("div[data-terminus-mount]");
		t || (t = document.createElement("div"), t.dataset.terminusMount = "true", t.style.height = "100%", t.style.width = "100%", e.appendChild(t));
		let n = e.querySelector("div[data-terminus-portals]");
		n || (n = document.createElement("div"), n.dataset.terminusPortals = "true", e.appendChild(n)), this.style.display = "block", this.style.height = "100%", this.style.width = "100%", this.root = rx(t, n);
	}
	disconnectedCallback() {
		this.root?.unmount(), this.root = void 0;
	}
};
customElements.get("terminus-panel") || customElements.define("terminus-panel", ix);
var ax = document.getElementById("root");
ax && rx(ax);
//#endregion
