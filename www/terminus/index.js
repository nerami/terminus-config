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
	var ee = Array.isArray;
	function te() {}
	var S = {
		H: null,
		A: null,
		T: null,
		S: null
	}, C = Object.prototype.hasOwnProperty;
	function ne(e, n, r) {
		var i = r.ref;
		return {
			$$typeof: t,
			type: e,
			key: n,
			ref: i === void 0 ? null : i,
			props: r
		};
	}
	function re(e, t) {
		return ne(e.type, t, e.props);
	}
	function w(e) {
		return typeof e == "object" && !!e && e.$$typeof === t;
	}
	function ie(e) {
		var t = {
			"=": "=0",
			":": "=2"
		};
		return "$" + e.replace(/[=:]/g, function(e) {
			return t[e];
		});
	}
	var T = /\/+/g;
	function E(e, t) {
		return typeof e == "object" && e && e.key != null ? ie("" + e.key) : t.toString(36);
	}
	function D(e) {
		switch (e.status) {
			case "fulfilled": return e.value;
			case "rejected": throw e.reason;
			default: switch (typeof e.status == "string" ? e.then(te, te) : (e.status = "pending", e.then(function(t) {
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
	function O(e, r, i, a, o) {
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
				case d: return c = e._init, O(c(e._payload), r, i, a, o);
			}
		}
		if (c) return o = o(e), c = a === "" ? "." + E(e, 0) : a, ee(o) ? (i = "", c != null && (i = c.replace(T, "$&/") + "/"), O(o, r, i, "", function(e) {
			return e;
		})) : o != null && (w(o) && (o = re(o, i + (o.key == null || e && e.key === o.key ? "" : ("" + o.key).replace(T, "$&/") + "/") + c)), r.push(o)), 1;
		c = 0;
		var l = a === "" ? "." : a + ":";
		if (ee(e)) for (var u = 0; u < e.length; u++) a = e[u], s = l + E(a, u), c += O(a, r, i, s, o);
		else if (u = m(e), typeof u == "function") for (e = u.call(e), u = 0; !(a = e.next()).done;) a = a.value, s = l + E(a, u++), c += O(a, r, i, s, o);
		else if (s === "object") {
			if (typeof e.then == "function") return O(D(e), r, i, a, o);
			throw r = String(e), Error("Objects are not valid as a React child (found: " + (r === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : r) + "). If you meant to render a collection of children, use an array instead.");
		}
		return c;
	}
	function ae(e, t, n) {
		if (e == null) return e;
		var r = [], i = 0;
		return O(e, r, "", "", function(e) {
			return t.call(n, e, i++);
		}), r;
	}
	function oe(e) {
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
	var k = typeof reportError == "function" ? reportError : function(e) {
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
	}, A = {
		map: ae,
		forEach: function(e, t, n) {
			ae(e, function() {
				t.apply(this, arguments);
			}, n);
		},
		count: function(e) {
			var t = 0;
			return ae(e, function() {
				t++;
			}), t;
		},
		toArray: function(e) {
			return ae(e, function(e) {
				return e;
			}) || [];
		},
		only: function(e) {
			if (!w(e)) throw Error("React.Children.only expected to receive a single React element child.");
			return e;
		}
	};
	e.Activity = f, e.Children = A, e.Component = v, e.Fragment = r, e.Profiler = a, e.PureComponent = b, e.StrictMode = i, e.Suspense = l, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = S, e.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(e) {
			return S.H.useMemoCache(e);
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
		if (t != null) for (a in t.key !== void 0 && (i = "" + t.key), t) !C.call(t, a) || a === "key" || a === "__self" || a === "__source" || a === "ref" && t.ref === void 0 || (r[a] = t[a]);
		var a = arguments.length - 2;
		if (a === 1) r.children = n;
		else if (1 < a) {
			for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
			r.children = o;
		}
		return ne(e.type, i, r);
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
		if (t != null) for (r in t.key !== void 0 && (a = "" + t.key), t) C.call(t, r) && r !== "key" && r !== "__self" && r !== "__source" && (i[r] = t[r]);
		var o = arguments.length - 2;
		if (o === 1) i.children = n;
		else if (1 < o) {
			for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
			i.children = s;
		}
		if (e && e.defaultProps) for (r in o = e.defaultProps, o) i[r] === void 0 && (i[r] = o[r]);
		return ne(e, a, i);
	}, e.createRef = function() {
		return { current: null };
	}, e.forwardRef = function(e) {
		return {
			$$typeof: c,
			render: e
		};
	}, e.isValidElement = w, e.lazy = function(e) {
		return {
			$$typeof: d,
			_payload: {
				_status: -1,
				_result: e
			},
			_init: oe
		};
	}, e.memo = function(e, t) {
		return {
			$$typeof: u,
			type: e,
			compare: t === void 0 ? null : t
		};
	}, e.startTransition = function(e) {
		var t = S.T, n = {};
		S.T = n;
		try {
			var r = e(), i = S.S;
			i !== null && i(n, r), typeof r == "object" && r && typeof r.then == "function" && r.then(te, k);
		} catch (e) {
			k(e);
		} finally {
			t !== null && n.types !== null && (t.types = n.types), S.T = t;
		}
	}, e.unstable_useCacheRefresh = function() {
		return S.H.useCacheRefresh();
	}, e.use = function(e) {
		return S.H.use(e);
	}, e.useActionState = function(e, t, n) {
		return S.H.useActionState(e, t, n);
	}, e.useCallback = function(e, t) {
		return S.H.useCallback(e, t);
	}, e.useContext = function(e) {
		return S.H.useContext(e);
	}, e.useDebugValue = function() {}, e.useDeferredValue = function(e, t) {
		return S.H.useDeferredValue(e, t);
	}, e.useEffect = function(e, t) {
		return S.H.useEffect(e, t);
	}, e.useEffectEvent = function(e) {
		return S.H.useEffectEvent(e);
	}, e.useId = function() {
		return S.H.useId();
	}, e.useImperativeHandle = function(e, t, n) {
		return S.H.useImperativeHandle(e, t, n);
	}, e.useInsertionEffect = function(e, t) {
		return S.H.useInsertionEffect(e, t);
	}, e.useLayoutEffect = function(e, t) {
		return S.H.useLayoutEffect(e, t);
	}, e.useMemo = function(e, t) {
		return S.H.useMemo(e, t);
	}, e.useOptimistic = function(e, t) {
		return S.H.useOptimistic(e, t);
	}, e.useReducer = function(e, t, n) {
		return S.H.useReducer(e, t, n);
	}, e.useRef = function(e) {
		return S.H.useRef(e);
	}, e.useState = function(e) {
		return S.H.useState(e);
	}, e.useSyncExternalStore = function(e, t, n) {
		return S.H.useSyncExternalStore(e, t, n);
	}, e.useTransition = function() {
		return S.H.useTransition();
	}, e.version = "19.2.6";
})), u = /* @__PURE__ */ o(((e, t) => {
	process.env.NODE_ENV !== "production" && (function() {
		function n(e, t) {
			Object.defineProperty(a.prototype, e, { get: function() {
				console.warn("%s(...) is deprecated in plain JavaScript React classes. %s", t[0], t[1]);
			} });
		}
		function r(e) {
			return typeof e != "object" || !e ? null : (e = he && e[he] || e["@@iterator"], typeof e == "function" ? e : null);
		}
		function i(e, t) {
			e = (e = e.constructor) && (e.displayName || e.name) || "ReactClass";
			var n = e + "." + t;
			ge[n] || (console.error("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", t, e), ge[n] = !0);
		}
		function a(e, t, n) {
			this.props = e, this.context = t, this.refs = ve, this.updater = n || _e;
		}
		function o() {}
		function s(e, t, n) {
			this.props = e, this.context = t, this.refs = ve, this.updater = n || _e;
		}
		function c() {}
		function l(e) {
			return "" + e;
		}
		function u(e) {
			try {
				l(e);
				var t = !1;
			} catch {
				t = !0;
			}
			if (t) {
				t = console;
				var n = t.error, r = typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
				return n.call(t, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", r), l(e);
			}
		}
		function d(e) {
			if (e == null) return null;
			if (typeof e == "function") return e.$$typeof === xe ? null : e.displayName || e.name || null;
			if (typeof e == "string") return e;
			switch (e) {
				case A: return "Fragment";
				case ce: return "Profiler";
				case se: return "StrictMode";
				case M: return "Suspense";
				case de: return "SuspenseList";
				case me: return "Activity";
			}
			if (typeof e == "object") switch (typeof e.tag == "number" && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), e.$$typeof) {
				case k: return "Portal";
				case ue: return e.displayName || "Context";
				case le: return (e._context.displayName || "Context") + ".Consumer";
				case j:
					var t = e.render;
					return e = e.displayName, e ||= (e = t.displayName || t.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
				case fe: return t = e.displayName || null, t === null ? d(e.type) || "Memo" : t;
				case pe:
					t = e._payload, e = e._init;
					try {
						return d(e(t));
					} catch {}
			}
			return null;
		}
		function f(e) {
			if (e === A) return "<>";
			if (typeof e == "object" && e && e.$$typeof === pe) return "<...>";
			try {
				var t = d(e);
				return t ? "<" + t + ">" : "<...>";
			} catch {
				return "<...>";
			}
		}
		function p() {
			var e = P.A;
			return e === null ? null : e.getOwner();
		}
		function m() {
			return Error("react-stack-top-frame");
		}
		function h(e) {
			if (Se.call(e, "key")) {
				var t = Object.getOwnPropertyDescriptor(e, "key").get;
				if (t && t.isReactWarning) return !1;
			}
			return e.key !== void 0;
		}
		function g(e, t) {
			function n() {
				we || (we = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", t));
			}
			n.isReactWarning = !0, Object.defineProperty(e, "key", {
				get: n,
				configurable: !0
			});
		}
		function _() {
			var e = d(this.type);
			return Ee[e] || (Ee[e] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release.")), e = this.props.ref, e === void 0 ? null : e;
		}
		function v(e, t, n, r, i, a) {
			var o = n.ref;
			return e = {
				$$typeof: oe,
				type: e,
				key: t,
				props: n,
				_owner: r
			}, (o === void 0 ? null : o) === null ? Object.defineProperty(e, "ref", {
				enumerable: !1,
				value: null
			}) : Object.defineProperty(e, "ref", {
				enumerable: !1,
				get: _
			}), e._store = {}, Object.defineProperty(e._store, "validated", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: 0
			}), Object.defineProperty(e, "_debugInfo", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: null
			}), Object.defineProperty(e, "_debugStack", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: i
			}), Object.defineProperty(e, "_debugTask", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: a
			}), Object.freeze && (Object.freeze(e.props), Object.freeze(e)), e;
		}
		function y(e, t) {
			return t = v(e.type, t, e.props, e._owner, e._debugStack, e._debugTask), e._store && (t._store.validated = e._store.validated), t;
		}
		function b(e) {
			x(e) ? e._store && (e._store.validated = 1) : typeof e == "object" && e && e.$$typeof === pe && (e._payload.status === "fulfilled" ? x(e._payload.value) && e._payload.value._store && (e._payload.value._store.validated = 1) : e._store && (e._store.validated = 1));
		}
		function x(e) {
			return typeof e == "object" && !!e && e.$$typeof === oe;
		}
		function ee(e) {
			var t = {
				"=": "=0",
				":": "=2"
			};
			return "$" + e.replace(/[=:]/g, function(e) {
				return t[e];
			});
		}
		function te(e, t) {
			return typeof e == "object" && e && e.key != null ? (u(e.key), ee("" + e.key)) : t.toString(36);
		}
		function S(e) {
			switch (e.status) {
				case "fulfilled": return e.value;
				case "rejected": throw e.reason;
				default: switch (typeof e.status == "string" ? e.then(c, c) : (e.status = "pending", e.then(function(t) {
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
		function C(e, t, n, i, a) {
			var o = typeof e;
			(o === "undefined" || o === "boolean") && (e = null);
			var s = !1;
			if (e === null) s = !0;
			else switch (o) {
				case "bigint":
				case "string":
				case "number":
					s = !0;
					break;
				case "object": switch (e.$$typeof) {
					case oe:
					case k:
						s = !0;
						break;
					case pe: return s = e._init, C(s(e._payload), t, n, i, a);
				}
			}
			if (s) {
				s = e, a = a(s);
				var c = i === "" ? "." + te(s, 0) : i;
				return be(a) ? (n = "", c != null && (n = c.replace(Ae, "$&/") + "/"), C(a, t, n, "", function(e) {
					return e;
				})) : a != null && (x(a) && (a.key != null && (s && s.key === a.key || u(a.key)), n = y(a, n + (a.key == null || s && s.key === a.key ? "" : ("" + a.key).replace(Ae, "$&/") + "/") + c), i !== "" && s != null && x(s) && s.key == null && s._store && !s._store.validated && (n._store.validated = 2), a = n), t.push(a)), 1;
			}
			if (s = 0, c = i === "" ? "." : i + ":", be(e)) for (var l = 0; l < e.length; l++) i = e[l], o = c + te(i, l), s += C(i, t, n, o, a);
			else if (l = r(e), typeof l == "function") for (l === e.entries && (ke || console.warn("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), ke = !0), e = l.call(e), l = 0; !(i = e.next()).done;) i = i.value, o = c + te(i, l++), s += C(i, t, n, o, a);
			else if (o === "object") {
				if (typeof e.then == "function") return C(S(e), t, n, i, a);
				throw t = String(e), Error("Objects are not valid as a React child (found: " + (t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t) + "). If you meant to render a collection of children, use an array instead.");
			}
			return s;
		}
		function ne(e, t, n) {
			if (e == null) return e;
			var r = [], i = 0;
			return C(e, r, "", "", function(e) {
				return t.call(n, e, i++);
			}), r;
		}
		function re(e) {
			if (e._status === -1) {
				var t = e._ioInfo;
				t != null && (t.start = t.end = performance.now()), t = e._result;
				var n = t();
				if (n.then(function(t) {
					if (e._status === 0 || e._status === -1) {
						e._status = 1, e._result = t;
						var r = e._ioInfo;
						r != null && (r.end = performance.now()), n.status === void 0 && (n.status = "fulfilled", n.value = t);
					}
				}, function(t) {
					if (e._status === 0 || e._status === -1) {
						e._status = 2, e._result = t;
						var r = e._ioInfo;
						r != null && (r.end = performance.now()), n.status === void 0 && (n.status = "rejected", n.reason = t);
					}
				}), t = e._ioInfo, t != null) {
					t.value = n;
					var r = n.displayName;
					typeof r == "string" && (t.name = r);
				}
				e._status === -1 && (e._status = 0, e._result = n);
			}
			if (e._status === 1) return t = e._result, t === void 0 && console.error("lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?", t), "default" in t || console.error("lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))", t), t.default;
			throw e._result;
		}
		function w() {
			var e = P.H;
			return e === null && console.error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."), e;
		}
		function ie() {
			P.asyncTransitions--;
		}
		function T(e) {
			if (Ne === null) try {
				var n = ("require" + Math.random()).slice(0, 7);
				Ne = (t && t[n]).call(t, "timers").setImmediate;
			} catch {
				Ne = function(e) {
					!1 === Me && (Me = !0, typeof MessageChannel > "u" && console.error("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."));
					var t = new MessageChannel();
					t.port1.onmessage = e, t.port2.postMessage(void 0);
				};
			}
			return Ne(e);
		}
		function E(e) {
			return 1 < e.length && typeof AggregateError == "function" ? AggregateError(e) : e[0];
		}
		function D(e, t) {
			t !== Pe - 1 && console.error("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "), Pe = t;
		}
		function O(e, t, n) {
			var r = P.actQueue;
			if (r !== null) if (r.length !== 0) try {
				ae(r), T(function() {
					return O(e, t, n);
				});
				return;
			} catch (e) {
				P.thrownErrors.push(e);
			}
			else P.actQueue = null;
			0 < P.thrownErrors.length ? (r = E(P.thrownErrors), P.thrownErrors.length = 0, n(r)) : t(e);
		}
		function ae(e) {
			if (!Ie) {
				Ie = !0;
				var t = 0;
				try {
					for (; t < e.length; t++) {
						var n = e[t];
						do {
							P.didUsePromise = !1;
							var r = n(!1);
							if (r !== null) {
								if (P.didUsePromise) {
									e[t] = n, e.splice(0, t);
									return;
								}
								n = r;
							} else break;
						} while (1);
					}
					e.length = 0;
				} catch (n) {
					e.splice(0, t + 1), P.thrownErrors.push(n);
				} finally {
					Ie = !1;
				}
			}
		}
		typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
		var oe = Symbol.for("react.transitional.element"), k = Symbol.for("react.portal"), A = Symbol.for("react.fragment"), se = Symbol.for("react.strict_mode"), ce = Symbol.for("react.profiler"), le = Symbol.for("react.consumer"), ue = Symbol.for("react.context"), j = Symbol.for("react.forward_ref"), M = Symbol.for("react.suspense"), de = Symbol.for("react.suspense_list"), fe = Symbol.for("react.memo"), pe = Symbol.for("react.lazy"), me = Symbol.for("react.activity"), he = Symbol.iterator, ge = {}, _e = {
			isMounted: function() {
				return !1;
			},
			enqueueForceUpdate: function(e) {
				i(e, "forceUpdate");
			},
			enqueueReplaceState: function(e) {
				i(e, "replaceState");
			},
			enqueueSetState: function(e) {
				i(e, "setState");
			}
		}, N = Object.assign, ve = {};
		Object.freeze(ve), a.prototype.isReactComponent = {}, a.prototype.setState = function(e, t) {
			if (typeof e != "object" && typeof e != "function" && e != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
			this.updater.enqueueSetState(this, e, t, "setState");
		}, a.prototype.forceUpdate = function(e) {
			this.updater.enqueueForceUpdate(this, e, "forceUpdate");
		};
		var ye = {
			isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
			replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
		};
		for (Re in ye) ye.hasOwnProperty(Re) && n(Re, ye[Re]);
		o.prototype = a.prototype, ye = s.prototype = new o(), ye.constructor = s, N(ye, a.prototype), ye.isPureReactComponent = !0;
		var be = Array.isArray, xe = Symbol.for("react.client.reference"), P = {
			H: null,
			A: null,
			T: null,
			S: null,
			actQueue: null,
			asyncTransitions: 0,
			isBatchingLegacy: !1,
			didScheduleLegacyUpdate: !1,
			didUsePromise: !1,
			thrownErrors: [],
			getCurrentStack: null,
			recentlyCreatedOwnerStacks: 0
		}, Se = Object.prototype.hasOwnProperty, Ce = console.createTask ? console.createTask : function() {
			return null;
		};
		ye = { react_stack_bottom_frame: function(e) {
			return e();
		} };
		var we, Te, Ee = {}, De = ye.react_stack_bottom_frame.bind(ye, m)(), Oe = Ce(f(m)), ke = !1, Ae = /\/+/g, je = typeof reportError == "function" ? reportError : function(e) {
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
		}, Me = !1, Ne = null, Pe = 0, Fe = !1, Ie = !1, Le = typeof queueMicrotask == "function" ? function(e) {
			queueMicrotask(function() {
				return queueMicrotask(e);
			});
		} : T;
		ye = Object.freeze({
			__proto__: null,
			c: function(e) {
				return w().useMemoCache(e);
			}
		});
		var Re = {
			map: ne,
			forEach: function(e, t, n) {
				ne(e, function() {
					t.apply(this, arguments);
				}, n);
			},
			count: function(e) {
				var t = 0;
				return ne(e, function() {
					t++;
				}), t;
			},
			toArray: function(e) {
				return ne(e, function(e) {
					return e;
				}) || [];
			},
			only: function(e) {
				if (!x(e)) throw Error("React.Children.only expected to receive a single React element child.");
				return e;
			}
		};
		e.Activity = me, e.Children = Re, e.Component = a, e.Fragment = A, e.Profiler = ce, e.PureComponent = s, e.StrictMode = se, e.Suspense = M, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = P, e.__COMPILER_RUNTIME = ye, e.act = function(e) {
			var t = P.actQueue, n = Pe;
			Pe++;
			var r = P.actQueue = t === null ? [] : t, i = !1;
			try {
				var a = e();
			} catch (e) {
				P.thrownErrors.push(e);
			}
			if (0 < P.thrownErrors.length) throw D(t, n), e = E(P.thrownErrors), P.thrownErrors.length = 0, e;
			if (typeof a == "object" && a && typeof a.then == "function") {
				var o = a;
				return Le(function() {
					i || Fe || (Fe = !0, console.error("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"));
				}), { then: function(e, a) {
					i = !0, o.then(function(i) {
						if (D(t, n), n === 0) {
							try {
								ae(r), T(function() {
									return O(i, e, a);
								});
							} catch (e) {
								P.thrownErrors.push(e);
							}
							if (0 < P.thrownErrors.length) {
								var o = E(P.thrownErrors);
								P.thrownErrors.length = 0, a(o);
							}
						} else e(i);
					}, function(e) {
						D(t, n), 0 < P.thrownErrors.length ? (e = E(P.thrownErrors), P.thrownErrors.length = 0, a(e)) : a(e);
					});
				} };
			}
			var s = a;
			if (D(t, n), n === 0 && (ae(r), r.length !== 0 && Le(function() {
				i || Fe || (Fe = !0, console.error("A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)"));
			}), P.actQueue = null), 0 < P.thrownErrors.length) throw e = E(P.thrownErrors), P.thrownErrors.length = 0, e;
			return { then: function(e, t) {
				i = !0, n === 0 ? (P.actQueue = r, T(function() {
					return O(s, e, t);
				})) : e(s);
			} };
		}, e.cache = function(e) {
			return function() {
				return e.apply(null, arguments);
			};
		}, e.cacheSignal = function() {
			return null;
		}, e.captureOwnerStack = function() {
			var e = P.getCurrentStack;
			return e === null ? null : e();
		}, e.cloneElement = function(e, t, n) {
			if (e == null) throw Error("The argument must be a React element, but you passed " + e + ".");
			var r = N({}, e.props), i = e.key, a = e._owner;
			if (t != null) {
				var o;
				a: {
					if (Se.call(t, "ref") && (o = Object.getOwnPropertyDescriptor(t, "ref").get) && o.isReactWarning) {
						o = !1;
						break a;
					}
					o = t.ref !== void 0;
				}
				for (s in o && (a = p()), h(t) && (u(t.key), i = "" + t.key), t) !Se.call(t, s) || s === "key" || s === "__self" || s === "__source" || s === "ref" && t.ref === void 0 || (r[s] = t[s]);
			}
			var s = arguments.length - 2;
			if (s === 1) r.children = n;
			else if (1 < s) {
				o = Array(s);
				for (var c = 0; c < s; c++) o[c] = arguments[c + 2];
				r.children = o;
			}
			for (r = v(e.type, i, r, a, e._debugStack, e._debugTask), i = 2; i < arguments.length; i++) b(arguments[i]);
			return r;
		}, e.createContext = function(e) {
			return e = {
				$$typeof: ue,
				_currentValue: e,
				_currentValue2: e,
				_threadCount: 0,
				Provider: null,
				Consumer: null
			}, e.Provider = e, e.Consumer = {
				$$typeof: le,
				_context: e
			}, e._currentRenderer = null, e._currentRenderer2 = null, e;
		}, e.createElement = function(e, t, n) {
			for (var r = 2; r < arguments.length; r++) b(arguments[r]);
			r = {};
			var i = null;
			if (t != null) for (c in Te || !("__self" in t) || "key" in t || (Te = !0, console.warn("Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform")), h(t) && (u(t.key), i = "" + t.key), t) Se.call(t, c) && c !== "key" && c !== "__self" && c !== "__source" && (r[c] = t[c]);
			var a = arguments.length - 2;
			if (a === 1) r.children = n;
			else if (1 < a) {
				for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
				Object.freeze && Object.freeze(o), r.children = o;
			}
			if (e && e.defaultProps) for (c in a = e.defaultProps, a) r[c] === void 0 && (r[c] = a[c]);
			i && g(r, typeof e == "function" ? e.displayName || e.name || "Unknown" : e);
			var c = 1e4 > P.recentlyCreatedOwnerStacks++;
			return v(e, i, r, p(), c ? Error("react-stack-top-frame") : De, c ? Ce(f(e)) : Oe);
		}, e.createRef = function() {
			var e = { current: null };
			return Object.seal(e), e;
		}, e.forwardRef = function(e) {
			e != null && e.$$typeof === fe ? console.error("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : typeof e == "function" ? e.length !== 0 && e.length !== 2 && console.error("forwardRef render functions accept exactly two parameters: props and ref. %s", e.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined.") : console.error("forwardRef requires a render function but was given %s.", e === null ? "null" : typeof e), e != null && e.defaultProps != null && console.error("forwardRef render functions do not support defaultProps. Did you accidentally pass a React component?");
			var t = {
				$$typeof: j,
				render: e
			}, n;
			return Object.defineProperty(t, "displayName", {
				enumerable: !1,
				configurable: !0,
				get: function() {
					return n;
				},
				set: function(t) {
					n = t, e.name || e.displayName || (Object.defineProperty(e, "name", { value: t }), e.displayName = t);
				}
			}), t;
		}, e.isValidElement = x, e.lazy = function(e) {
			e = {
				_status: -1,
				_result: e
			};
			var t = {
				$$typeof: pe,
				_payload: e,
				_init: re
			}, n = {
				name: "lazy",
				start: -1,
				end: -1,
				value: null,
				owner: null,
				debugStack: Error("react-stack-top-frame"),
				debugTask: console.createTask ? console.createTask("lazy()") : null
			};
			return e._ioInfo = n, t._debugInfo = [{ awaited: n }], t;
		}, e.memo = function(e, t) {
			e ?? console.error("memo: The first argument must be a component. Instead received: %s", e === null ? "null" : typeof e), t = {
				$$typeof: fe,
				type: e,
				compare: t === void 0 ? null : t
			};
			var n;
			return Object.defineProperty(t, "displayName", {
				enumerable: !1,
				configurable: !0,
				get: function() {
					return n;
				},
				set: function(t) {
					n = t, e.name || e.displayName || (Object.defineProperty(e, "name", { value: t }), e.displayName = t);
				}
			}), t;
		}, e.startTransition = function(e) {
			var t = P.T, n = {};
			n._updatedFibers = /* @__PURE__ */ new Set(), P.T = n;
			try {
				var r = e(), i = P.S;
				i !== null && i(n, r), typeof r == "object" && r && typeof r.then == "function" && (P.asyncTransitions++, r.then(ie, ie), r.then(c, je));
			} catch (e) {
				je(e);
			} finally {
				t === null && n._updatedFibers && (e = n._updatedFibers.size, n._updatedFibers.clear(), 10 < e && console.warn("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table.")), t !== null && n.types !== null && (t.types !== null && t.types !== n.types && console.error("We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."), t.types = n.types), P.T = t;
			}
		}, e.unstable_useCacheRefresh = function() {
			return w().useCacheRefresh();
		}, e.use = function(e) {
			return w().use(e);
		}, e.useActionState = function(e, t, n) {
			return w().useActionState(e, t, n);
		}, e.useCallback = function(e, t) {
			return w().useCallback(e, t);
		}, e.useContext = function(e) {
			var t = w();
			return e.$$typeof === le && console.error("Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?"), t.useContext(e);
		}, e.useDebugValue = function(e, t) {
			return w().useDebugValue(e, t);
		}, e.useDeferredValue = function(e, t) {
			return w().useDeferredValue(e, t);
		}, e.useEffect = function(e, t) {
			return e ?? console.warn("React Hook useEffect requires an effect callback. Did you forget to pass a callback to the hook?"), w().useEffect(e, t);
		}, e.useEffectEvent = function(e) {
			return w().useEffectEvent(e);
		}, e.useId = function() {
			return w().useId();
		}, e.useImperativeHandle = function(e, t, n) {
			return w().useImperativeHandle(e, t, n);
		}, e.useInsertionEffect = function(e, t) {
			return e ?? console.warn("React Hook useInsertionEffect requires an effect callback. Did you forget to pass a callback to the hook?"), w().useInsertionEffect(e, t);
		}, e.useLayoutEffect = function(e, t) {
			return e ?? console.warn("React Hook useLayoutEffect requires an effect callback. Did you forget to pass a callback to the hook?"), w().useLayoutEffect(e, t);
		}, e.useMemo = function(e, t) {
			return w().useMemo(e, t);
		}, e.useOptimistic = function(e, t) {
			return w().useOptimistic(e, t);
		}, e.useReducer = function(e, t, n) {
			return w().useReducer(e, t, n);
		}, e.useRef = function(e) {
			return w().useRef(e);
		}, e.useState = function(e) {
			return w().useState(e);
		}, e.useSyncExternalStore = function(e, t, n) {
			return w().useSyncExternalStore(e, t, n);
		}, e.useTransition = function() {
			return w().useTransition();
		}, e.version = "19.2.6", typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
	})();
})), d = /* @__PURE__ */ o(((e, t) => {
	process.env.NODE_ENV === "production" ? t.exports = l() : t.exports = u();
})), f = /* @__PURE__ */ o(((e) => {
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
		if (h = !1, b(e), !m) if (n(c) !== null) m = !0, ee || (ee = !0, w());
		else {
			var t = n(l);
			t !== null && E(x, t.startTime - e);
		}
	}
	var ee = !1, te = -1, S = 5, C = -1;
	function ne() {
		return g ? !0 : !(e.unstable_now() - C < S);
	}
	function re() {
		if (g = !1, ee) {
			var t = e.unstable_now();
			C = t;
			var i = !0;
			try {
				a: {
					m = !1, h && (h = !1, v(te), te = -1), p = !0;
					var a = f;
					try {
						b: {
							for (b(t), d = n(c); d !== null && !(d.expirationTime > t && ne());) {
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
								u !== null && E(x, u.startTime - t), i = !1;
							}
						}
						break a;
					} finally {
						d = null, f = a, p = !1;
					}
					i = void 0;
				}
			} finally {
				i ? w() : ee = !1;
			}
		}
	}
	var w;
	if (typeof y == "function") w = function() {
		y(re);
	};
	else if (typeof MessageChannel < "u") {
		var ie = new MessageChannel(), T = ie.port2;
		ie.port1.onmessage = re, w = function() {
			T.postMessage(null);
		};
	} else w = function() {
		_(re, 0);
	};
	function E(t, n) {
		te = _(function() {
			t(e.unstable_now());
		}, n);
	}
	e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(e) {
		e.callback = null;
	}, e.unstable_forceFrameRate = function(e) {
		0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : S = 0 < e ? Math.floor(1e3 / e) : 5;
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
		}, a > o ? (r.sortIndex = a, t(l, r), n(c) === null && r === n(l) && (h ? (v(te), te = -1) : h = !0, E(x, a - o))) : (r.sortIndex = s, t(c, r), m || p || (m = !0, ee || (ee = !0, w()))), r;
	}, e.unstable_shouldYield = ne, e.unstable_wrapCallback = function(e) {
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
})), p = /* @__PURE__ */ o(((e) => {
	process.env.NODE_ENV !== "production" && (function() {
		function t() {
			if (x = !1, C) {
				var t = e.unstable_now();
				w = t;
				var n = !0;
				try {
					a: {
						y = !1, b && (b = !1, te(ne), ne = -1), v = !0;
						var a = _;
						try {
							b: {
								for (o(t), g = r(p); g !== null && !(g.expirationTime > t && c());) {
									var u = g.callback;
									if (typeof u == "function") {
										g.callback = null, _ = g.priorityLevel;
										var d = u(g.expirationTime <= t);
										if (t = e.unstable_now(), typeof d == "function") {
											g.callback = d, o(t), n = !0;
											break b;
										}
										g === r(p) && i(p), o(t);
									} else i(p);
									g = r(p);
								}
								if (g !== null) n = !0;
								else {
									var f = r(m);
									f !== null && l(s, f.startTime - t), n = !1;
								}
							}
							break a;
						} finally {
							g = null, _ = a, v = !1;
						}
						n = void 0;
					}
				} finally {
					n ? ie() : C = !1;
				}
			}
		}
		function n(e, t) {
			var n = e.length;
			e.push(t);
			a: for (; 0 < n;) {
				var r = n - 1 >>> 1, i = e[r];
				if (0 < a(i, t)) e[r] = t, e[n] = i, n = r;
				else break a;
			}
		}
		function r(e) {
			return e.length === 0 ? null : e[0];
		}
		function i(e) {
			if (e.length === 0) return null;
			var t = e[0], n = e.pop();
			if (n !== t) {
				e[0] = n;
				a: for (var r = 0, i = e.length, o = i >>> 1; r < o;) {
					var s = 2 * (r + 1) - 1, c = e[s], l = s + 1, u = e[l];
					if (0 > a(c, n)) l < i && 0 > a(u, c) ? (e[r] = u, e[l] = n, r = l) : (e[r] = c, e[s] = n, r = s);
					else if (l < i && 0 > a(u, n)) e[r] = u, e[l] = n, r = l;
					else break a;
				}
			}
			return t;
		}
		function a(e, t) {
			var n = e.sortIndex - t.sortIndex;
			return n === 0 ? e.id - t.id : n;
		}
		function o(e) {
			for (var t = r(m); t !== null;) {
				if (t.callback === null) i(m);
				else if (t.startTime <= e) i(m), t.sortIndex = t.expirationTime, n(p, t);
				else break;
				t = r(m);
			}
		}
		function s(e) {
			if (b = !1, o(e), !y) if (r(p) !== null) y = !0, C || (C = !0, ie());
			else {
				var t = r(m);
				t !== null && l(s, t.startTime - e);
			}
		}
		function c() {
			return x ? !0 : !(e.unstable_now() - w < re);
		}
		function l(t, n) {
			ne = ee(function() {
				t(e.unstable_now());
			}, n);
		}
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error()), e.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
			var u = performance;
			e.unstable_now = function() {
				return u.now();
			};
		} else {
			var d = Date, f = d.now();
			e.unstable_now = function() {
				return d.now() - f;
			};
		}
		var p = [], m = [], h = 1, g = null, _ = 3, v = !1, y = !1, b = !1, x = !1, ee = typeof setTimeout == "function" ? setTimeout : null, te = typeof clearTimeout == "function" ? clearTimeout : null, S = typeof setImmediate < "u" ? setImmediate : null, C = !1, ne = -1, re = 5, w = -1;
		if (typeof S == "function") var ie = function() {
			S(t);
		};
		else if (typeof MessageChannel < "u") {
			var T = new MessageChannel(), E = T.port2;
			T.port1.onmessage = t, ie = function() {
				E.postMessage(null);
			};
		} else ie = function() {
			ee(t, 0);
		};
		e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(e) {
			e.callback = null;
		}, e.unstable_forceFrameRate = function(e) {
			0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : re = 0 < e ? Math.floor(1e3 / e) : 5;
		}, e.unstable_getCurrentPriorityLevel = function() {
			return _;
		}, e.unstable_next = function(e) {
			switch (_) {
				case 1:
				case 2:
				case 3:
					var t = 3;
					break;
				default: t = _;
			}
			var n = _;
			_ = t;
			try {
				return e();
			} finally {
				_ = n;
			}
		}, e.unstable_requestPaint = function() {
			x = !0;
		}, e.unstable_runWithPriority = function(e, t) {
			switch (e) {
				case 1:
				case 2:
				case 3:
				case 4:
				case 5: break;
				default: e = 3;
			}
			var n = _;
			_ = e;
			try {
				return t();
			} finally {
				_ = n;
			}
		}, e.unstable_scheduleCallback = function(t, i, a) {
			var o = e.unstable_now();
			switch (typeof a == "object" && a ? (a = a.delay, a = typeof a == "number" && 0 < a ? o + a : o) : a = o, t) {
				case 1:
					var c = -1;
					break;
				case 2:
					c = 250;
					break;
				case 5:
					c = 1073741823;
					break;
				case 4:
					c = 1e4;
					break;
				default: c = 5e3;
			}
			return c = a + c, t = {
				id: h++,
				callback: i,
				priorityLevel: t,
				startTime: a,
				expirationTime: c,
				sortIndex: -1
			}, a > o ? (t.sortIndex = a, n(m, t), r(p) === null && t === r(m) && (b ? (te(ne), ne = -1) : b = !0, l(s, a - o))) : (t.sortIndex = c, n(p, t), y || v || (y = !0, C || (C = !0, ie()))), t;
		}, e.unstable_shouldYield = c, e.unstable_wrapCallback = function(e) {
			var t = _;
			return function() {
				var n = _;
				_ = t;
				try {
					return e.apply(this, arguments);
				} finally {
					_ = n;
				}
			};
		}, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
	})();
})), m = /* @__PURE__ */ o(((e, t) => {
	process.env.NODE_ENV === "production" ? t.exports = f() : t.exports = p();
})), h = /* @__PURE__ */ o(((e) => {
	var t = d();
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
})), g = /* @__PURE__ */ o(((e) => {
	process.env.NODE_ENV !== "production" && (function() {
		function t() {}
		function n(e) {
			return "" + e;
		}
		function r(e, t, r) {
			var i = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
			try {
				n(i);
				var a = !1;
			} catch {
				a = !0;
			}
			return a && (console.error("The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", typeof Symbol == "function" && Symbol.toStringTag && i[Symbol.toStringTag] || i.constructor.name || "Object"), n(i)), {
				$$typeof: u,
				key: i == null ? null : "" + i,
				children: e,
				containerInfo: t,
				implementation: r
			};
		}
		function i(e, t) {
			if (e === "font") return "";
			if (typeof t == "string") return t === "use-credentials" ? t : "";
		}
		function a(e) {
			return e === null ? "`null`" : e === void 0 ? "`undefined`" : e === "" ? "an empty string" : "something with type \"" + typeof e + "\"";
		}
		function o(e) {
			return e === null ? "`null`" : e === void 0 ? "`undefined`" : e === "" ? "an empty string" : typeof e == "string" ? JSON.stringify(e) : typeof e == "number" ? "`" + e + "`" : "something with type \"" + typeof e + "\"";
		}
		function s() {
			var e = f.H;
			return e === null && console.error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."), e;
		}
		typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
		var c = d(), l = {
			d: {
				f: t,
				r: function() {
					throw Error("Invalid form element. requestFormReset must be passed a form that was rendered by React.");
				},
				D: t,
				C: t,
				L: t,
				m: t,
				X: t,
				S: t,
				M: t
			},
			p: 0,
			findDOMNode: null
		}, u = Symbol.for("react.portal"), f = c.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
		typeof Map == "function" && Map.prototype != null && typeof Map.prototype.forEach == "function" && typeof Set == "function" && Set.prototype != null && typeof Set.prototype.clear == "function" && typeof Set.prototype.forEach == "function" || console.error("React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"), e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = l, e.createPortal = function(e, t) {
			var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
			if (!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11) throw Error("Target container is not a DOM element.");
			return r(e, t, null, n);
		}, e.flushSync = function(e) {
			var t = f.T, n = l.p;
			try {
				if (f.T = null, l.p = 2, e) return e();
			} finally {
				f.T = t, l.p = n, l.d.f() && console.error("flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task.");
			}
		}, e.preconnect = function(e, t) {
			typeof e == "string" && e ? t != null && typeof t != "object" ? console.error("ReactDOM.preconnect(): Expected the `options` argument (second) to be an object but encountered %s instead. The only supported option at this time is `crossOrigin` which accepts a string.", o(t)) : t != null && typeof t.crossOrigin != "string" && console.error("ReactDOM.preconnect(): Expected the `crossOrigin` option (second argument) to be a string but encountered %s instead. Try removing this option or passing a string value instead.", a(t.crossOrigin)) : console.error("ReactDOM.preconnect(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.", a(e)), typeof e == "string" && (t ? (t = t.crossOrigin, t = typeof t == "string" ? t === "use-credentials" ? t : "" : void 0) : t = null, l.d.C(e, t));
		}, e.prefetchDNS = function(e) {
			if (typeof e != "string" || !e) console.error("ReactDOM.prefetchDNS(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.", a(e));
			else if (1 < arguments.length) {
				var t = arguments[1];
				typeof t == "object" && t.hasOwnProperty("crossOrigin") ? console.error("ReactDOM.prefetchDNS(): Expected only one argument, `href`, but encountered %s as a second argument instead. This argument is reserved for future options and is currently disallowed. It looks like the you are attempting to set a crossOrigin property for this DNS lookup hint. Browsers do not perform DNS queries using CORS and setting this attribute on the resource hint has no effect. Try calling ReactDOM.prefetchDNS() with just a single string argument, `href`.", o(t)) : console.error("ReactDOM.prefetchDNS(): Expected only one argument, `href`, but encountered %s as a second argument instead. This argument is reserved for future options and is currently disallowed. Try calling ReactDOM.prefetchDNS() with just a single string argument, `href`.", o(t));
			}
			typeof e == "string" && l.d.D(e);
		}, e.preinit = function(e, t) {
			if (typeof e == "string" && e ? typeof t != "object" || !t ? console.error("ReactDOM.preinit(): Expected the `options` argument (second) to be an object with an `as` property describing the type of resource to be preinitialized but encountered %s instead.", o(t)) : t.as !== "style" && t.as !== "script" && console.error("ReactDOM.preinit(): Expected the `as` property in the `options` argument (second) to contain a valid value describing the type of resource to be preinitialized but encountered %s instead. Valid values for `as` are \"style\" and \"script\".", o(t.as)) : console.error("ReactDOM.preinit(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.", a(e)), typeof e == "string" && t && typeof t.as == "string") {
				var n = t.as, r = i(n, t.crossOrigin), s = typeof t.integrity == "string" ? t.integrity : void 0, c = typeof t.fetchPriority == "string" ? t.fetchPriority : void 0;
				n === "style" ? l.d.S(e, typeof t.precedence == "string" ? t.precedence : void 0, {
					crossOrigin: r,
					integrity: s,
					fetchPriority: c
				}) : n === "script" && l.d.X(e, {
					crossOrigin: r,
					integrity: s,
					fetchPriority: c,
					nonce: typeof t.nonce == "string" ? t.nonce : void 0
				});
			}
		}, e.preinitModule = function(e, t) {
			var n = "";
			if (typeof e == "string" && e || (n += " The `href` argument encountered was " + a(e) + "."), t !== void 0 && typeof t != "object" ? n += " The `options` argument encountered was " + a(t) + "." : t && "as" in t && t.as !== "script" && (n += " The `as` option encountered was " + o(t.as) + "."), n) console.error("ReactDOM.preinitModule(): Expected up to two arguments, a non-empty `href` string and, optionally, an `options` object with a valid `as` property.%s", n);
			else switch (n = t && typeof t.as == "string" ? t.as : "script", n) {
				case "script": break;
				default: n = o(n), console.error("ReactDOM.preinitModule(): Currently the only supported \"as\" type for this function is \"script\" but received \"%s\" instead. This warning was generated for `href` \"%s\". In the future other module types will be supported, aligning with the import-attributes proposal. Learn more here: (https://github.com/tc39/proposal-import-attributes)", n, e);
			}
			typeof e == "string" && (typeof t == "object" && t ? (t.as == null || t.as === "script") && (n = i(t.as, t.crossOrigin), l.d.M(e, {
				crossOrigin: n,
				integrity: typeof t.integrity == "string" ? t.integrity : void 0,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0
			})) : t ?? l.d.M(e));
		}, e.preload = function(e, t) {
			var n = "";
			if (typeof e == "string" && e || (n += " The `href` argument encountered was " + a(e) + "."), typeof t != "object" || !t ? n += " The `options` argument encountered was " + a(t) + "." : typeof t.as == "string" && t.as || (n += " The `as` option encountered was " + a(t.as) + "."), n && console.error("ReactDOM.preload(): Expected two arguments, a non-empty `href` string and an `options` object with an `as` property valid for a `<link rel=\"preload\" as=\"...\" />` tag.%s", n), typeof e == "string" && typeof t == "object" && t && typeof t.as == "string") {
				n = t.as;
				var r = i(n, t.crossOrigin);
				l.d.L(e, n, {
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
			var n = "";
			typeof e == "string" && e || (n += " The `href` argument encountered was " + a(e) + "."), t !== void 0 && typeof t != "object" ? n += " The `options` argument encountered was " + a(t) + "." : t && "as" in t && typeof t.as != "string" && (n += " The `as` option encountered was " + a(t.as) + "."), n && console.error("ReactDOM.preloadModule(): Expected two arguments, a non-empty `href` string and, optionally, an `options` object with an `as` property valid for a `<link rel=\"modulepreload\" as=\"...\" />` tag.%s", n), typeof e == "string" && (t ? (n = i(t.as, t.crossOrigin), l.d.m(e, {
				as: typeof t.as == "string" && t.as !== "script" ? t.as : void 0,
				crossOrigin: n,
				integrity: typeof t.integrity == "string" ? t.integrity : void 0
			})) : l.d.m(e));
		}, e.requestFormReset = function(e) {
			l.d.r(e);
		}, e.unstable_batchedUpdates = function(e, t) {
			return e(t);
		}, e.useFormState = function(e, t, n) {
			return s().useFormState(e, t, n);
		}, e.useFormStatus = function() {
			return s().useHostTransitionStatus();
		}, e.version = "19.2.6", typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
	})();
})), _ = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
			if (process.env.NODE_ENV !== "production") throw Error("^_^");
			try {
				__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
			} catch (e) {
				console.error(e);
			}
		}
	}
	process.env.NODE_ENV === "production" ? (n(), t.exports = h()) : t.exports = g();
})), v = /* @__PURE__ */ o(((e) => {
	var t = m(), n = d(), r = _();
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
	function u(e) {
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
	function f(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e;
		for (e = e.child; e !== null;) {
			if (t = f(e), t !== null) return t;
			e = e.sibling;
		}
		return null;
	}
	var p = Object.assign, h = Symbol.for("react.element"), g = Symbol.for("react.transitional.element"), v = Symbol.for("react.portal"), y = Symbol.for("react.fragment"), b = Symbol.for("react.strict_mode"), x = Symbol.for("react.profiler"), ee = Symbol.for("react.consumer"), te = Symbol.for("react.context"), S = Symbol.for("react.forward_ref"), C = Symbol.for("react.suspense"), ne = Symbol.for("react.suspense_list"), re = Symbol.for("react.memo"), w = Symbol.for("react.lazy"), ie = Symbol.for("react.activity"), T = Symbol.for("react.memo_cache_sentinel"), E = Symbol.iterator;
	function D(e) {
		return typeof e != "object" || !e ? null : (e = E && e[E] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var O = Symbol.for("react.client.reference");
	function ae(e) {
		if (e == null) return null;
		if (typeof e == "function") return e.$$typeof === O ? null : e.displayName || e.name || null;
		if (typeof e == "string") return e;
		switch (e) {
			case y: return "Fragment";
			case x: return "Profiler";
			case b: return "StrictMode";
			case C: return "Suspense";
			case ne: return "SuspenseList";
			case ie: return "Activity";
		}
		if (typeof e == "object") switch (e.$$typeof) {
			case v: return "Portal";
			case te: return e.displayName || "Context";
			case ee: return (e._context.displayName || "Context") + ".Consumer";
			case S:
				var t = e.render;
				return e = e.displayName, e ||= (e = t.displayName || t.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
			case re: return t = e.displayName || null, t === null ? ae(e.type) || "Memo" : t;
			case w:
				t = e._payload, e = e._init;
				try {
					return ae(e(t));
				} catch {}
		}
		return null;
	}
	var oe = Array.isArray, k = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, A = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, se = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, ce = [], le = -1;
	function ue(e) {
		return { current: e };
	}
	function j(e) {
		0 > le || (e.current = ce[le], ce[le] = null, le--);
	}
	function M(e, t) {
		le++, ce[le] = e.current, e.current = t;
	}
	var de = ue(null), fe = ue(null), pe = ue(null), me = ue(null);
	function he(e, t) {
		switch (M(pe, t), M(fe, e), M(de, null), t.nodeType) {
			case 9:
			case 11:
				e = (e = t.documentElement) && (e = e.namespaceURI) ? Zd(e) : 0;
				break;
			default: if (e = t.tagName, t = t.namespaceURI) t = Zd(t), e = Qd(t, e);
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
		j(de), M(de, e);
	}
	function ge() {
		j(de), j(fe), j(pe);
	}
	function _e(e) {
		e.memoizedState !== null && M(me, e);
		var t = de.current, n = Qd(t, e.type);
		t !== n && (M(fe, e), M(de, n));
	}
	function N(e) {
		fe.current === e && (j(de), j(fe)), me.current === e && (j(me), op._currentValue = se);
	}
	var ve, ye;
	function be(e) {
		if (ve === void 0) try {
			throw Error();
		} catch (e) {
			var t = e.stack.trim().match(/\n( *(at )?)/);
			ve = t && t[1] || "", ye = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + ve + e + ye;
	}
	var xe = !1;
	function P(e, t) {
		if (!e || xe) return "";
		xe = !0;
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
			xe = !1, Error.prepareStackTrace = n;
		}
		return (n = e ? e.displayName || e.name : "") ? be(n) : "";
	}
	function Se(e, t) {
		switch (e.tag) {
			case 26:
			case 27:
			case 5: return be(e.type);
			case 16: return be("Lazy");
			case 13: return e.child !== t && t !== null ? be("Suspense Fallback") : be("Suspense");
			case 19: return be("SuspenseList");
			case 0:
			case 15: return P(e.type, !1);
			case 11: return P(e.type.render, !1);
			case 1: return P(e.type, !0);
			case 31: return be("Activity");
			default: return "";
		}
	}
	function Ce(e) {
		try {
			var t = "", n = null;
			do
				t += Se(e, n), n = e, e = e.return;
			while (e);
			return t;
		} catch (e) {
			return "\nError generating stack: " + e.message + "\n" + e.stack;
		}
	}
	var we = Object.prototype.hasOwnProperty, Te = t.unstable_scheduleCallback, Ee = t.unstable_cancelCallback, De = t.unstable_shouldYield, Oe = t.unstable_requestPaint, ke = t.unstable_now, Ae = t.unstable_getCurrentPriorityLevel, je = t.unstable_ImmediatePriority, Me = t.unstable_UserBlockingPriority, Ne = t.unstable_NormalPriority, Pe = t.unstable_LowPriority, Fe = t.unstable_IdlePriority, Ie = t.log, Le = t.unstable_setDisableYieldValue, Re = null, ze = null;
	function Be(e) {
		if (typeof Ie == "function" && Le(e), ze && typeof ze.setStrictMode == "function") try {
			ze.setStrictMode(Re, e);
		} catch {}
	}
	var Ve = Math.clz32 ? Math.clz32 : We, He = Math.log, Ue = Math.LN2;
	function We(e) {
		return e >>>= 0, e === 0 ? 32 : 31 - (He(e) / Ue | 0) | 0;
	}
	var Ge = 256, Ke = 262144, qe = 4194304;
	function Je(e) {
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
	function Ye(e, t, n) {
		var r = e.pendingLanes;
		if (r === 0) return 0;
		var i = 0, a = e.suspendedLanes, o = e.pingedLanes;
		e = e.warmLanes;
		var s = r & 134217727;
		return s === 0 ? (s = r & ~a, s === 0 ? o === 0 ? n || (n = r & ~e, n !== 0 && (i = Je(n))) : i = Je(o) : i = Je(s)) : (r = s & ~a, r === 0 ? (o &= s, o === 0 ? n || (n = s & ~e, n !== 0 && (i = Je(n))) : i = Je(o)) : i = Je(r)), i === 0 ? 0 : t !== 0 && t !== i && (t & a) === 0 && (a = i & -i, n = t & -t, a >= n || a === 32 && n & 4194048) ? t : i;
	}
	function Xe(e, t) {
		return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
	}
	function Ze(e, t) {
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
	function Qe() {
		var e = qe;
		return qe <<= 1, !(qe & 62914560) && (qe = 4194304), e;
	}
	function $e(e) {
		for (var t = [], n = 0; 31 > n; n++) t.push(e);
		return t;
	}
	function et(e, t) {
		e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
	}
	function tt(e, t, n, r, i, a) {
		var o = e.pendingLanes;
		e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
		var s = e.entanglements, c = e.expirationTimes, l = e.hiddenUpdates;
		for (n = o & ~n; 0 < n;) {
			var u = 31 - Ve(n), d = 1 << u;
			s[u] = 0, c[u] = -1;
			var f = l[u];
			if (f !== null) for (l[u] = null, u = 0; u < f.length; u++) {
				var p = f[u];
				p !== null && (p.lane &= -536870913);
			}
			n &= ~d;
		}
		r !== 0 && nt(e, r, 0), a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
	}
	function nt(e, t, n) {
		e.pendingLanes |= t, e.suspendedLanes &= ~t;
		var r = 31 - Ve(t);
		e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 1073741824 | n & 261930;
	}
	function rt(e, t) {
		var n = e.entangledLanes |= t;
		for (e = e.entanglements; n;) {
			var r = 31 - Ve(n), i = 1 << r;
			i & t | e[r] & t && (e[r] |= t), n &= ~i;
		}
	}
	function it(e, t) {
		var n = t & -t;
		return n = n & 42 ? 1 : at(n), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
	}
	function at(e) {
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
	function ot(e) {
		return e &= -e, 2 < e ? 8 < e ? e & 134217727 ? 32 : 268435456 : 8 : 2;
	}
	function st() {
		var e = A.p;
		return e === 0 ? (e = window.event, e === void 0 ? 32 : Sp(e.type)) : e;
	}
	function ct(e, t) {
		var n = A.p;
		try {
			return A.p = e, t();
		} finally {
			A.p = n;
		}
	}
	var lt = Math.random().toString(36).slice(2), ut = "__reactFiber$" + lt, dt = "__reactProps$" + lt, ft = "__reactContainer$" + lt, pt = "__reactEvents$" + lt, mt = "__reactListeners$" + lt, ht = "__reactHandles$" + lt, gt = "__reactResources$" + lt, _t = "__reactMarker$" + lt;
	function vt(e) {
		delete e[ut], delete e[dt], delete e[pt], delete e[mt], delete e[ht];
	}
	function yt(e) {
		var t = e[ut];
		if (t) return t;
		for (var n = e.parentNode; n;) {
			if (t = n[ft] || n[ut]) {
				if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = xf(e); e !== null;) {
					if (n = e[ut]) return n;
					e = xf(e);
				}
				return t;
			}
			e = n, n = e.parentNode;
		}
		return null;
	}
	function bt(e) {
		if (e = e[ut] || e[ft]) {
			var t = e.tag;
			if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
		}
		return null;
	}
	function xt(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
		throw Error(i(33));
	}
	function St(e) {
		var t = e[gt];
		return t ||= e[gt] = {
			hoistableStyles: /* @__PURE__ */ new Map(),
			hoistableScripts: /* @__PURE__ */ new Map()
		}, t;
	}
	function Ct(e) {
		e[_t] = !0;
	}
	var wt = /* @__PURE__ */ new Set(), Tt = {};
	function Et(e, t) {
		Dt(e, t), Dt(e + "Capture", t);
	}
	function Dt(e, t) {
		for (Tt[e] = t, e = 0; e < t.length; e++) wt.add(t[e]);
	}
	var Ot = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), kt = {}, At = {};
	function jt(e) {
		return we.call(At, e) ? !0 : we.call(kt, e) ? !1 : Ot.test(e) ? At[e] = !0 : (kt[e] = !0, !1);
	}
	function Mt(e, t, n) {
		if (jt(t)) if (n === null) e.removeAttribute(t);
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
	function Nt(e, t, n) {
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
	function Pt(e, t, n, r) {
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
	function Ft(e) {
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
	function It(e) {
		var t = e.type;
		return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
	}
	function Lt(e, t, n) {
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
	function Rt(e) {
		if (!e._valueTracker) {
			var t = It(e) ? "checked" : "value";
			e._valueTracker = Lt(e, t, "" + e[t]);
		}
	}
	function zt(e) {
		if (!e) return !1;
		var t = e._valueTracker;
		if (!t) return !0;
		var n = t.getValue(), r = "";
		return e && (r = It(e) ? e.checked ? "true" : "false" : e.value), e = r, e === n ? !1 : (t.setValue(e), !0);
	}
	function Bt(e) {
		if (e ||= typeof document < "u" ? document : void 0, e === void 0) return null;
		try {
			return e.activeElement || e.body;
		} catch {
			return e.body;
		}
	}
	var Vt = /[\n"\\]/g;
	function F(e) {
		return e.replace(Vt, function(e) {
			return "\\" + e.charCodeAt(0).toString(16) + " ";
		});
	}
	function Ht(e, t, n, r, i, a, o, s) {
		e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Ft(t)) : e.value !== "" + Ft(t) && (e.value = "" + Ft(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : Wt(e, o, Ft(n)) : Wt(e, o, Ft(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + Ft(s) : e.removeAttribute("name");
	}
	function Ut(e, t, n, r, i, a, o, s) {
		if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (e.type = a), t != null || n != null) {
			if (!(a !== "submit" && a !== "reset" || t != null)) {
				Rt(e);
				return;
			}
			n = n == null ? "" : "" + Ft(n), t = t == null ? n : "" + Ft(t), s || t === e.value || (e.value = t), e.defaultValue = t;
		}
		r ??= i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), Rt(e);
	}
	function Wt(e, t, n) {
		t === "number" && Bt(e.ownerDocument) === e || e.defaultValue === "" + n || (e.defaultValue = "" + n);
	}
	function Gt(e, t, n, r) {
		if (e = e.options, t) {
			t = {};
			for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
			for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
		} else {
			for (n = "" + Ft(n), t = null, i = 0; i < e.length; i++) {
				if (e[i].value === n) {
					e[i].selected = !0, r && (e[i].defaultSelected = !0);
					return;
				}
				t !== null || e[i].disabled || (t = e[i]);
			}
			t !== null && (t.selected = !0);
		}
	}
	function Kt(e, t, n) {
		if (t != null && (t = "" + Ft(t), t !== e.value && (e.value = t), n == null)) {
			e.defaultValue !== t && (e.defaultValue = t);
			return;
		}
		e.defaultValue = n == null ? "" : "" + Ft(n);
	}
	function qt(e, t, n, r) {
		if (t == null) {
			if (r != null) {
				if (n != null) throw Error(i(92));
				if (oe(r)) {
					if (1 < r.length) throw Error(i(93));
					r = r[0];
				}
				n = r;
			}
			n ??= "", t = n;
		}
		n = Ft(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), Rt(e);
	}
	function Jt(e, t) {
		if (t) {
			var n = e.firstChild;
			if (n && n === e.lastChild && n.nodeType === 3) {
				n.nodeValue = t;
				return;
			}
		}
		e.textContent = t;
	}
	var Yt = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function Xt(e, t, n) {
		var r = t.indexOf("--") === 0;
		n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || Yt.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
	}
	function Zt(e, t, n) {
		if (t != null && typeof t != "object") throw Error(i(62));
		if (e = e.style, n != null) {
			for (var r in n) !n.hasOwnProperty(r) || t != null && t.hasOwnProperty(r) || (r.indexOf("--") === 0 ? e.setProperty(r, "") : r === "float" ? e.cssFloat = "" : e[r] = "");
			for (var a in t) r = t[a], t.hasOwnProperty(a) && n[a] !== r && Xt(e, a, r);
		} else for (var o in t) t.hasOwnProperty(o) && Xt(e, o, t[o]);
	}
	function Qt(e) {
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
	var I = new Map([
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
	]), $t = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function en(e) {
		return $t.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
	}
	function tn() {}
	var nn = null;
	function rn(e) {
		return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
	}
	var an = null, on = null;
	function L(e) {
		var t = bt(e);
		if (t && (e = t.stateNode)) {
			var n = e[dt] || null;
			a: switch (e = t.stateNode, t.type) {
				case "input":
					if (Ht(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
						for (n = e; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll("input[name=\"" + F("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
							var r = n[t];
							if (r !== e && r.form === e.form) {
								var a = r[dt] || null;
								if (!a) throw Error(i(90));
								Ht(r, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name);
							}
						}
						for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && zt(r);
					}
					break a;
				case "textarea":
					Kt(e, n.value, n.defaultValue);
					break a;
				case "select": t = n.value, t != null && Gt(e, !!n.multiple, t, !1);
			}
		}
	}
	var sn = !1;
	function cn(e, t, n) {
		if (sn) return e(t, n);
		sn = !0;
		try {
			return e(t);
		} finally {
			if (sn = !1, (an !== null || on !== null) && (Ou(), an && (t = an, e = on, on = an = null, L(t), e))) for (t = 0; t < e.length; t++) L(e[t]);
		}
	}
	function ln(e, t) {
		var n = e.stateNode;
		if (n === null) return null;
		var r = n[dt] || null;
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
	var un = !(typeof window > "u" || window.document === void 0 || window.document.createElement === void 0), dn = !1;
	if (un) try {
		var fn = {};
		Object.defineProperty(fn, "passive", { get: function() {
			dn = !0;
		} }), window.addEventListener("test", fn, fn), window.removeEventListener("test", fn, fn);
	} catch {
		dn = !1;
	}
	var pn = null, mn = null, hn = null;
	function gn() {
		if (hn) return hn;
		var e, t = mn, n = t.length, r, i = "value" in pn ? pn.value : pn.textContent, a = i.length;
		for (e = 0; e < n && t[e] === i[e]; e++);
		var o = n - e;
		for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
		return hn = i.slice(e, 1 < r ? 1 - r : void 0);
	}
	function _n(e) {
		var t = e.keyCode;
		return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
	}
	function vn() {
		return !0;
	}
	function yn() {
		return !1;
	}
	function bn(e) {
		function t(t, n, r, i, a) {
			for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
			return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? vn : yn, this.isPropagationStopped = yn, this;
		}
		return p(t.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var e = this.nativeEvent;
				e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = vn);
			},
			stopPropagation: function() {
				var e = this.nativeEvent;
				e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = vn);
			},
			persist: function() {},
			isPersistent: vn
		}), t;
	}
	var xn = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(e) {
			return e.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, Sn = bn(xn), Cn = p({}, xn, {
		view: 0,
		detail: 0
	}), wn = bn(Cn), Tn, En, Dn, On = p({}, Cn, {
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
		getModifierState: zn,
		button: 0,
		buttons: 0,
		relatedTarget: function(e) {
			return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
		},
		movementX: function(e) {
			return "movementX" in e ? e.movementX : (e !== Dn && (Dn && e.type === "mousemove" ? (Tn = e.screenX - Dn.screenX, En = e.screenY - Dn.screenY) : En = Tn = 0, Dn = e), Tn);
		},
		movementY: function(e) {
			return "movementY" in e ? e.movementY : En;
		}
	}), kn = bn(On), An = bn(p({}, On, { dataTransfer: 0 })), jn = bn(p({}, Cn, { relatedTarget: 0 })), Mn = bn(p({}, xn, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Nn = bn(p({}, xn, { clipboardData: function(e) {
		return "clipboardData" in e ? e.clipboardData : window.clipboardData;
	} })), Pn = bn(p({}, xn, { data: 0 })), Fn = {
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
	}, In = {
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
	}, Ln = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function Rn(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = Ln[e]) ? !!t[e] : !1;
	}
	function zn() {
		return Rn;
	}
	var Bn = bn(p({}, Cn, {
		key: function(e) {
			if (e.key) {
				var t = Fn[e.key] || e.key;
				if (t !== "Unidentified") return t;
			}
			return e.type === "keypress" ? (e = _n(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? In[e.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: zn,
		charCode: function(e) {
			return e.type === "keypress" ? _n(e) : 0;
		},
		keyCode: function(e) {
			return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		},
		which: function(e) {
			return e.type === "keypress" ? _n(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		}
	})), Vn = bn(p({}, On, {
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
	})), Hn = bn(p({}, Cn, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: zn
	})), Un = bn(p({}, xn, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Wn = bn(p({}, On, {
		deltaX: function(e) {
			return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
		},
		deltaY: function(e) {
			return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), Gn = bn(p({}, xn, {
		newState: 0,
		oldState: 0
	})), Kn = [
		9,
		13,
		27,
		32
	], qn = un && "CompositionEvent" in window, Jn = null;
	un && "documentMode" in document && (Jn = document.documentMode);
	var Yn = un && "TextEvent" in window && !Jn, Xn = un && (!qn || Jn && 8 < Jn && 11 >= Jn), Zn = " ", Qn = !1;
	function $n(e, t) {
		switch (e) {
			case "keyup": return Kn.indexOf(t.keyCode) !== -1;
			case "keydown": return t.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function er(e) {
		return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
	}
	var tr = !1;
	function nr(e, t) {
		switch (e) {
			case "compositionend": return er(t);
			case "keypress": return t.which === 32 ? (Qn = !0, Zn) : null;
			case "textInput": return e = t.data, e === Zn && Qn ? null : e;
			default: return null;
		}
	}
	function rr(e, t) {
		if (tr) return e === "compositionend" || !qn && $n(e, t) ? (e = gn(), hn = mn = pn = null, tr = !1, e) : null;
		switch (e) {
			case "paste": return null;
			case "keypress":
				if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
					if (t.char && 1 < t.char.length) return t.char;
					if (t.which) return String.fromCharCode(t.which);
				}
				return null;
			case "compositionend": return Xn && t.locale !== "ko" ? null : t.data;
			default: return null;
		}
	}
	var ir = {
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
	function ar(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t === "input" ? !!ir[e.type] : t === "textarea";
	}
	function or(e, t, n, r) {
		an ? on ? on.push(r) : on = [r] : an = r, t = Fd(t, "onChange"), 0 < t.length && (n = new Sn("onChange", "change", null, n, r), e.push({
			event: n,
			listeners: t
		}));
	}
	var sr = null, cr = null;
	function lr(e) {
		Od(e, 0);
	}
	function ur(e) {
		if (zt(xt(e))) return e;
	}
	function dr(e, t) {
		if (e === "change") return t;
	}
	var fr = !1;
	if (un) {
		var pr;
		if (un) {
			var mr = "oninput" in document;
			if (!mr) {
				var hr = document.createElement("div");
				hr.setAttribute("oninput", "return;"), mr = typeof hr.oninput == "function";
			}
			pr = mr;
		} else pr = !1;
		fr = pr && (!document.documentMode || 9 < document.documentMode);
	}
	function gr() {
		sr && (sr.detachEvent("onpropertychange", _r), cr = sr = null);
	}
	function _r(e) {
		if (e.propertyName === "value" && ur(cr)) {
			var t = [];
			or(t, cr, e, rn(e)), cn(lr, t);
		}
	}
	function vr(e, t, n) {
		e === "focusin" ? (gr(), sr = t, cr = n, sr.attachEvent("onpropertychange", _r)) : e === "focusout" && gr();
	}
	function yr(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return ur(cr);
	}
	function br(e, t) {
		if (e === "click") return ur(t);
	}
	function xr(e, t) {
		if (e === "input" || e === "change") return ur(t);
	}
	function Sr(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var Cr = typeof Object.is == "function" ? Object.is : Sr;
	function wr(e, t) {
		if (Cr(e, t)) return !0;
		if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
		var n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (r = 0; r < n.length; r++) {
			var i = n[r];
			if (!we.call(t, i) || !Cr(e[i], t[i])) return !1;
		}
		return !0;
	}
	function Tr(e) {
		for (; e && e.firstChild;) e = e.firstChild;
		return e;
	}
	function Er(e, t) {
		var n = Tr(e);
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
			n = Tr(n);
		}
	}
	function Dr(e, t) {
		return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Dr(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
	}
	function Or(e) {
		e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
		for (var t = Bt(e.document); t instanceof e.HTMLIFrameElement;) {
			try {
				var n = typeof t.contentWindow.location.href == "string";
			} catch {
				n = !1;
			}
			if (n) e = t.contentWindow;
			else break;
			t = Bt(e.document);
		}
		return t;
	}
	function kr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
	}
	var Ar = un && "documentMode" in document && 11 >= document.documentMode, jr = null, Mr = null, Nr = null, Pr = !1;
	function Fr(e, t, n) {
		var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		Pr || jr == null || jr !== Bt(r) || (r = jr, "selectionStart" in r && kr(r) ? r = {
			start: r.selectionStart,
			end: r.selectionEnd
		} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
			anchorNode: r.anchorNode,
			anchorOffset: r.anchorOffset,
			focusNode: r.focusNode,
			focusOffset: r.focusOffset
		}), Nr && wr(Nr, r) || (Nr = r, r = Fd(Mr, "onSelect"), 0 < r.length && (t = new Sn("onSelect", "select", null, t, n), e.push({
			event: t,
			listeners: r
		}), t.target = jr)));
	}
	function Ir(e, t) {
		var n = {};
		return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
	}
	var Lr = {
		animationend: Ir("Animation", "AnimationEnd"),
		animationiteration: Ir("Animation", "AnimationIteration"),
		animationstart: Ir("Animation", "AnimationStart"),
		transitionrun: Ir("Transition", "TransitionRun"),
		transitionstart: Ir("Transition", "TransitionStart"),
		transitioncancel: Ir("Transition", "TransitionCancel"),
		transitionend: Ir("Transition", "TransitionEnd")
	}, Rr = {}, zr = {};
	un && (zr = document.createElement("div").style, "AnimationEvent" in window || (delete Lr.animationend.animation, delete Lr.animationiteration.animation, delete Lr.animationstart.animation), "TransitionEvent" in window || delete Lr.transitionend.transition);
	function Br(e) {
		if (Rr[e]) return Rr[e];
		if (!Lr[e]) return e;
		var t = Lr[e], n;
		for (n in t) if (t.hasOwnProperty(n) && n in zr) return Rr[e] = t[n];
		return e;
	}
	var Vr = Br("animationend"), Hr = Br("animationiteration"), Ur = Br("animationstart"), Wr = Br("transitionrun"), Gr = Br("transitionstart"), Kr = Br("transitioncancel"), qr = Br("transitionend"), Jr = /* @__PURE__ */ new Map(), Yr = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	Yr.push("scrollEnd");
	function Xr(e, t) {
		Jr.set(e, t), Et(t, [e]);
	}
	var Zr = typeof reportError == "function" ? reportError : function(e) {
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
	}, Qr = [], $r = 0, ei = 0;
	function ti() {
		for (var e = $r, t = ei = $r = 0; t < e;) {
			var n = Qr[t];
			Qr[t++] = null;
			var r = Qr[t];
			Qr[t++] = null;
			var i = Qr[t];
			Qr[t++] = null;
			var a = Qr[t];
			if (Qr[t++] = null, r !== null && i !== null) {
				var o = r.pending;
				o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
			}
			a !== 0 && ai(n, i, a);
		}
	}
	function ni(e, t, n, r) {
		Qr[$r++] = e, Qr[$r++] = t, Qr[$r++] = n, Qr[$r++] = r, ei |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
	}
	function ri(e, t, n, r) {
		return ni(e, t, n, r), oi(e);
	}
	function ii(e, t) {
		return ni(e, null, null, t), oi(e);
	}
	function ai(e, t, n) {
		e.lanes |= n;
		var r = e.alternate;
		r !== null && (r.lanes |= n);
		for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & 1 || (i = !0)), e = a, a = a.return;
		return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - Ve(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
	}
	function oi(e) {
		if (50 < yu) throw yu = 0, bu = null, Error(i(185));
		for (var t = e.return; t !== null;) e = t, t = e.return;
		return e.tag === 3 ? e.stateNode : null;
	}
	var si = {};
	function ci(e, t, n, r) {
		this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
	}
	function li(e, t, n, r) {
		return new ci(e, t, n, r);
	}
	function ui(e) {
		return e = e.prototype, !(!e || !e.isReactComponent);
	}
	function di(e, t) {
		var n = e.alternate;
		return n === null ? (n = li(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 65011712, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
	}
	function fi(e, t) {
		e.flags &= 65011714;
		var n = e.alternate;
		return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}), e;
	}
	function pi(e, t, n, r, a, o) {
		var s = 0;
		if (r = e, typeof e == "function") ui(e) && (s = 1);
		else if (typeof e == "string") s = Zf(e, n, de.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else a: switch (e) {
			case ie: return e = li(31, n, t, a), e.elementType = ie, e.lanes = o, e;
			case y: return mi(n.children, a, o, t);
			case b:
				s = 8, a |= 24;
				break;
			case x: return e = li(12, n, t, a | 2), e.elementType = x, e.lanes = o, e;
			case C: return e = li(13, n, t, a), e.elementType = C, e.lanes = o, e;
			case ne: return e = li(19, n, t, a), e.elementType = ne, e.lanes = o, e;
			default:
				if (typeof e == "object" && e) switch (e.$$typeof) {
					case te:
						s = 10;
						break a;
					case ee:
						s = 9;
						break a;
					case S:
						s = 11;
						break a;
					case re:
						s = 14;
						break a;
					case w:
						s = 16, r = null;
						break a;
				}
				s = 29, n = Error(i(130, e === null ? "null" : typeof e, "")), r = null;
		}
		return t = li(s, n, t, a), t.elementType = e, t.type = r, t.lanes = o, t;
	}
	function mi(e, t, n, r) {
		return e = li(7, e, r, t), e.lanes = n, e;
	}
	function hi(e, t, n) {
		return e = li(6, e, null, t), e.lanes = n, e;
	}
	function gi(e) {
		var t = li(18, null, null, 0);
		return t.stateNode = e, t;
	}
	function _i(e, t, n) {
		return t = li(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
			containerInfo: e.containerInfo,
			pendingChildren: null,
			implementation: e.implementation
		}, t;
	}
	var vi = /* @__PURE__ */ new WeakMap();
	function yi(e, t) {
		if (typeof e == "object" && e) {
			var n = vi.get(e);
			return n === void 0 ? (t = {
				value: e,
				source: t,
				stack: Ce(t)
			}, vi.set(e, t), t) : n;
		}
		return {
			value: e,
			source: t,
			stack: Ce(t)
		};
	}
	var bi = [], xi = 0, Si = null, Ci = 0, wi = [], Ti = 0, Ei = null, Di = 1, Oi = "";
	function ki(e, t) {
		bi[xi++] = Ci, bi[xi++] = Si, Si = e, Ci = t;
	}
	function Ai(e, t, n) {
		wi[Ti++] = Di, wi[Ti++] = Oi, wi[Ti++] = Ei, Ei = e;
		var r = Di;
		e = Oi;
		var i = 32 - Ve(r) - 1;
		r &= ~(1 << i), n += 1;
		var a = 32 - Ve(t) + i;
		if (30 < a) {
			var o = i - i % 5;
			a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, Di = 1 << 32 - Ve(t) + i | n << i | r, Oi = a + e;
		} else Di = 1 << a | n << i | r, Oi = e;
	}
	function ji(e) {
		e.return !== null && (ki(e, 1), Ai(e, 1, 0));
	}
	function Mi(e) {
		for (; e === Si;) Si = bi[--xi], bi[xi] = null, Ci = bi[--xi], bi[xi] = null;
		for (; e === Ei;) Ei = wi[--Ti], wi[Ti] = null, Oi = wi[--Ti], wi[Ti] = null, Di = wi[--Ti], wi[Ti] = null;
	}
	function Ni(e, t) {
		wi[Ti++] = Di, wi[Ti++] = Oi, wi[Ti++] = Ei, Di = t.id, Oi = t.overflow, Ei = e;
	}
	var Pi = null, Fi = null, Ii = !1, Li = null, Ri = !1, zi = Error(i(519));
	function Bi(e) {
		throw Ki(yi(Error(i(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", "")), e)), zi;
	}
	function Vi(e) {
		var t = e.stateNode, n = e.type, r = e.memoizedProps;
		switch (t[ut] = e, t[dt] = r, n) {
			case "dialog":
				U("cancel", t), U("close", t);
				break;
			case "iframe":
			case "object":
			case "embed":
				U("load", t);
				break;
			case "video":
			case "audio":
				for (n = 0; n < Ed.length; n++) U(Ed[n], t);
				break;
			case "source":
				U("error", t);
				break;
			case "img":
			case "image":
			case "link":
				U("error", t), U("load", t);
				break;
			case "details":
				U("toggle", t);
				break;
			case "input":
				U("invalid", t), Ut(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
				break;
			case "select":
				U("invalid", t);
				break;
			case "textarea": U("invalid", t), qt(t, r.value, r.defaultValue, r.children);
		}
		n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || Vd(t.textContent, n) ? (r.popover != null && (U("beforetoggle", t), U("toggle", t)), r.onScroll != null && U("scroll", t), r.onScrollEnd != null && U("scrollend", t), r.onClick != null && (t.onclick = tn), t = !0) : t = !1, t || Bi(e, !0);
	}
	function Hi(e) {
		for (Pi = e.return; Pi;) switch (Pi.tag) {
			case 5:
			case 31:
			case 13:
				Ri = !1;
				return;
			case 27:
			case 3:
				Ri = !0;
				return;
			default: Pi = Pi.return;
		}
	}
	function Ui(e) {
		if (e !== Pi) return !1;
		if (!Ii) return Hi(e), Ii = !0, !1;
		var t = e.tag, n;
		if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = !(n !== "form" && n !== "button") || $d(e.type, e.memoizedProps)), n = !n), n && Fi && Bi(e), Hi(e), t === 13) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			Fi = bf(e);
		} else if (t === 31) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			Fi = bf(e);
		} else t === 27 ? (t = Fi, cf(e.type) ? (e = yf, yf = null, Fi = e) : Fi = t) : Fi = Pi ? vf(e.stateNode.nextSibling) : null;
		return !0;
	}
	function Wi() {
		Fi = Pi = null, Ii = !1;
	}
	function Gi() {
		var e = Li;
		return e !== null && (au === null ? au = e : au.push.apply(au, e), Li = null), e;
	}
	function Ki(e) {
		Li === null ? Li = [e] : Li.push(e);
	}
	var qi = ue(null), Ji = null, Yi = null;
	function Xi(e, t, n) {
		M(qi, t._currentValue), t._currentValue = n;
	}
	function Zi(e) {
		e._currentValue = qi.current, j(qi);
	}
	function Qi(e, t, n) {
		for (; e !== null;) {
			var r = e.alternate;
			if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
			e = e.return;
		}
	}
	function $i(e, t, n, r) {
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
						o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), Qi(o.return, n, e), r || (s = null);
						break a;
					}
					o = c.next;
				}
			} else if (a.tag === 18) {
				if (s = a.return, s === null) throw Error(i(341));
				s.lanes |= n, o = s.alternate, o !== null && (o.lanes |= n), Qi(s, n, e), s = null;
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
	function ea(e, t, n, r) {
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
					Cr(a.pendingProps.value, s.value) || (e === null ? e = [c] : e.push(c));
				}
			} else if (a === me.current) {
				if (s = a.alternate, s === null) throw Error(i(387));
				s.memoizedState.memoizedState !== a.memoizedState.memoizedState && (e === null ? e = [op] : e.push(op));
			}
			a = a.return;
		}
		e !== null && $i(t, e, n, r), t.flags |= 262144;
	}
	function ta(e) {
		for (e = e.firstContext; e !== null;) {
			if (!Cr(e.context._currentValue, e.memoizedValue)) return !0;
			e = e.next;
		}
		return !1;
	}
	function na(e) {
		Ji = e, Yi = null, e = e.dependencies, e !== null && (e.firstContext = null);
	}
	function ra(e) {
		return aa(Ji, e);
	}
	function ia(e, t) {
		return Ji === null && na(e), aa(e, t);
	}
	function aa(e, t) {
		var n = t._currentValue;
		if (t = {
			context: t,
			memoizedValue: n,
			next: null
		}, Yi === null) {
			if (e === null) throw Error(i(308));
			Yi = t, e.dependencies = {
				lanes: 0,
				firstContext: t
			}, e.flags |= 524288;
		} else Yi = Yi.next = t;
		return n;
	}
	var oa = typeof AbortController < "u" ? AbortController : function() {
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
	}, sa = t.unstable_scheduleCallback, ca = t.unstable_NormalPriority, la = {
		$$typeof: te,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function ua() {
		return {
			controller: new oa(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function da(e) {
		e.refCount--, e.refCount === 0 && sa(ca, function() {
			e.controller.abort();
		});
	}
	var fa = null, R = 0, z = 0, pa = null;
	function ma(e, t) {
		if (fa === null) {
			var n = fa = [];
			R = 0, z = bd(), pa = {
				status: "pending",
				value: void 0,
				then: function(e) {
					n.push(e);
				}
			};
		}
		return R++, t.then(ha, ha), t;
	}
	function ha() {
		if (--R === 0 && fa !== null) {
			pa !== null && (pa.status = "fulfilled");
			var e = fa;
			fa = null, z = 0, pa = null;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
	}
	function ga(e, t) {
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
	var _a = k.S;
	k.S = function(e, t) {
		cu = ke(), typeof t == "object" && t && typeof t.then == "function" && ma(e, t), _a !== null && _a(e, t);
	};
	var va = ue(null);
	function ya() {
		var e = va.current;
		return e === null ? Gl.pooledCache : e;
	}
	function ba(e, t) {
		t === null ? M(va, va.current) : M(va, t.pool);
	}
	function xa() {
		var e = ya();
		return e === null ? null : {
			parent: la._currentValue,
			pool: e
		};
	}
	var Sa = Error(i(460)), Ca = Error(i(474)), wa = Error(i(542)), Ta = { then: function() {} };
	function Ea(e) {
		return e = e.status, e === "fulfilled" || e === "rejected";
	}
	function Da(e, t, n) {
		switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(tn, tn), t = n), t.status) {
			case "fulfilled": return t.value;
			case "rejected": throw e = t.reason, ja(e), e;
			default:
				if (typeof t.status == "string") t.then(tn, tn);
				else {
					if (e = Gl, e !== null && 100 < e.shellSuspendCounter) throw Error(i(482));
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
					case "rejected": throw e = t.reason, ja(e), e;
				}
				throw ka = t, Sa;
		}
	}
	function Oa(e) {
		try {
			var t = e._init;
			return t(e._payload);
		} catch (e) {
			throw typeof e == "object" && e && typeof e.then == "function" ? (ka = e, Sa) : e;
		}
	}
	var ka = null;
	function Aa() {
		if (ka === null) throw Error(i(459));
		var e = ka;
		return ka = null, e;
	}
	function ja(e) {
		if (e === Sa || e === wa) throw Error(i(483));
	}
	var Ma = null, Na = 0;
	function Pa(e) {
		var t = Na;
		return Na += 1, Ma === null && (Ma = []), Da(Ma, e, t);
	}
	function Fa(e, t) {
		t = t.props.ref, e.ref = t === void 0 ? null : t;
	}
	function Ia(e, t) {
		throw t.$$typeof === h ? Error(i(525)) : (e = Object.prototype.toString.call(t), Error(i(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
	}
	function La(e) {
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
			return e = di(e, t), e.index = 0, e.sibling = null, e;
		}
		function o(t, n, r) {
			return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 67108866, n) : (r = r.index, r < n ? (t.flags |= 67108866, n) : r)) : (t.flags |= 1048576, n);
		}
		function s(t) {
			return e && t.alternate === null && (t.flags |= 67108866), t;
		}
		function c(e, t, n, r) {
			return t === null || t.tag !== 6 ? (t = hi(n, e.mode, r), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function l(e, t, n, r) {
			var i = n.type;
			return i === y ? d(e, t, n.props.children, r, n.key) : t !== null && (t.elementType === i || typeof i == "object" && i && i.$$typeof === w && Oa(i) === t.type) ? (t = a(t, n.props), Fa(t, n), t.return = e, t) : (t = pi(n.type, n.key, n.props, null, e.mode, r), Fa(t, n), t.return = e, t);
		}
		function u(e, t, n, r) {
			return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = _i(n, e.mode, r), t.return = e, t) : (t = a(t, n.children || []), t.return = e, t);
		}
		function d(e, t, n, r, i) {
			return t === null || t.tag !== 7 ? (t = mi(n, e.mode, r, i), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function f(e, t, n) {
			if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = hi("" + t, e.mode, n), t.return = e, t;
			if (typeof t == "object" && t) {
				switch (t.$$typeof) {
					case g: return n = pi(t.type, t.key, t.props, null, e.mode, n), Fa(n, t), n.return = e, n;
					case v: return t = _i(t, e.mode, n), t.return = e, t;
					case w: return t = Oa(t), f(e, t, n);
				}
				if (oe(t) || D(t)) return t = mi(t, e.mode, n, null), t.return = e, t;
				if (typeof t.then == "function") return f(e, Pa(t), n);
				if (t.$$typeof === te) return f(e, ia(e, t), n);
				Ia(e, t);
			}
			return null;
		}
		function p(e, t, n, r) {
			var i = t === null ? null : t.key;
			if (typeof n == "string" && n !== "" || typeof n == "number" || typeof n == "bigint") return i === null ? c(e, t, "" + n, r) : null;
			if (typeof n == "object" && n) {
				switch (n.$$typeof) {
					case g: return n.key === i ? l(e, t, n, r) : null;
					case v: return n.key === i ? u(e, t, n, r) : null;
					case w: return n = Oa(n), p(e, t, n, r);
				}
				if (oe(n) || D(n)) return i === null ? d(e, t, n, r, null) : null;
				if (typeof n.then == "function") return p(e, t, Pa(n), r);
				if (n.$$typeof === te) return p(e, t, ia(e, n), r);
				Ia(e, n);
			}
			return null;
		}
		function m(e, t, n, r, i) {
			if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, c(t, e, "" + r, i);
			if (typeof r == "object" && r) {
				switch (r.$$typeof) {
					case g: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
					case v: return e = e.get(r.key === null ? n : r.key) || null, u(t, e, r, i);
					case w: return r = Oa(r), m(e, t, n, r, i);
				}
				if (oe(r) || D(r)) return e = e.get(n) || null, d(t, e, r, i, null);
				if (typeof r.then == "function") return m(e, t, n, Pa(r), i);
				if (r.$$typeof === te) return m(e, t, n, ia(t, r), i);
				Ia(t, r);
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
			if (h === s.length) return n(i, d), Ii && ki(i, h), l;
			if (d === null) {
				for (; h < s.length; h++) d = f(i, s[h], c), d !== null && (a = o(d, a, h), u === null ? l = d : u.sibling = d, u = d);
				return Ii && ki(i, h), l;
			}
			for (d = r(d); h < s.length; h++) g = m(d, i, h, s[h], c), g !== null && (e && g.alternate !== null && d.delete(g.key === null ? h : g.key), a = o(g, a, h), u === null ? l = g : u.sibling = g, u = g);
			return e && d.forEach(function(e) {
				return t(i, e);
			}), Ii && ki(i, h), l;
		}
		function _(a, s, c, l) {
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
			if (v.done) return n(a, h), Ii && ki(a, g), u;
			if (h === null) {
				for (; !v.done; g++, v = c.next()) v = f(a, v.value, l), v !== null && (s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
				return Ii && ki(a, g), u;
			}
			for (h = r(h); !v.done; g++, v = c.next()) v = m(h, a, g, v.value, l), v !== null && (e && v.alternate !== null && h.delete(v.key === null ? g : v.key), s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
			return e && h.forEach(function(e) {
				return t(a, e);
			}), Ii && ki(a, g), u;
		}
		function b(e, r, o, c) {
			if (typeof o == "object" && o && o.type === y && o.key === null && (o = o.props.children), typeof o == "object" && o) {
				switch (o.$$typeof) {
					case g:
						a: {
							for (var l = o.key; r !== null;) {
								if (r.key === l) {
									if (l = o.type, l === y) {
										if (r.tag === 7) {
											n(e, r.sibling), c = a(r, o.props.children), c.return = e, e = c;
											break a;
										}
									} else if (r.elementType === l || typeof l == "object" && l && l.$$typeof === w && Oa(l) === r.type) {
										n(e, r.sibling), c = a(r, o.props), Fa(c, o), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								} else t(e, r);
								r = r.sibling;
							}
							o.type === y ? (c = mi(o.props.children, e.mode, c, o.key), c.return = e, e = c) : (c = pi(o.type, o.key, o.props, null, e.mode, c), Fa(c, o), c.return = e, e = c);
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
							c = _i(o, e.mode, c), c.return = e, e = c;
						}
						return s(e);
					case w: return o = Oa(o), b(e, r, o, c);
				}
				if (oe(o)) return h(e, r, o, c);
				if (D(o)) {
					if (l = D(o), typeof l != "function") throw Error(i(150));
					return o = l.call(o), _(e, r, o, c);
				}
				if (typeof o.then == "function") return b(e, r, Pa(o), c);
				if (o.$$typeof === te) return b(e, r, ia(e, o), c);
				Ia(e, o);
			}
			return typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint" ? (o = "" + o, r !== null && r.tag === 6 ? (n(e, r.sibling), c = a(r, o), c.return = e, e = c) : (n(e, r), c = hi(o, e.mode, c), c.return = e, e = c), s(e)) : n(e, r);
		}
		return function(e, t, n, r) {
			try {
				Na = 0;
				var i = b(e, t, n, r);
				return Ma = null, i;
			} catch (t) {
				if (t === Sa || t === wa) throw t;
				var a = li(29, t, null, e.mode);
				return a.lanes = r, a.return = e, a;
			}
		};
	}
	var Ra = La(!0), za = La(!1), Ba = !1;
	function Va(e) {
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
	function Ha(e, t) {
		e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
			baseState: e.baseState,
			firstBaseUpdate: e.firstBaseUpdate,
			lastBaseUpdate: e.lastBaseUpdate,
			shared: e.shared,
			callbacks: null
		});
	}
	function Ua(e) {
		return {
			lane: e,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function Wa(e, t, n) {
		var r = e.updateQueue;
		if (r === null) return null;
		if (r = r.shared, Wl & 2) {
			var i = r.pending;
			return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = oi(e), ai(e, null, n), t;
		}
		return ni(e, r, t, n), oi(e);
	}
	function Ga(e, t, n) {
		if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, rt(e, n);
		}
	}
	function Ka(e, t) {
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
	var qa = !1;
	function Ja() {
		if (qa) {
			var e = pa;
			if (e !== null) throw e;
		}
	}
	function Ya(e, t, n, r) {
		qa = !1;
		var i = e.updateQueue;
		Ba = !1;
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
				var f = s.lane & -536870913, m = f !== s.lane;
				if (m ? (Kl & f) === f : (r & f) === f) {
					f !== 0 && f === z && (qa = !0), u !== null && (u = u.next = {
						lane: 0,
						tag: s.tag,
						payload: s.payload,
						callback: null,
						next: null
					});
					a: {
						var h = e, g = s;
						f = t;
						var _ = n;
						switch (g.tag) {
							case 1:
								if (h = g.payload, typeof h == "function") {
									d = h.call(_, d, f);
									break a;
								}
								d = h;
								break a;
							case 3: h.flags = h.flags & -65537 | 128;
							case 0:
								if (h = g.payload, f = typeof h == "function" ? h.call(_, d, f) : h, f == null) break a;
								d = p({}, d, f);
								break a;
							case 2: Ba = !0;
						}
					}
					f = s.callback, f !== null && (e.flags |= 64, m && (e.flags |= 8192), m = i.callbacks, m === null ? i.callbacks = [f] : m.push(f));
				} else m = {
					lane: f,
					tag: s.tag,
					payload: s.payload,
					callback: s.callback,
					next: null
				}, u === null ? (l = u = m, c = d) : u = u.next = m, o |= f;
				if (s = s.next, s === null) {
					if (s = i.shared.pending, s === null) break;
					m = s, s = m.next, m.next = null, i.lastBaseUpdate = m, i.shared.pending = null;
				}
			} while (1);
			u === null && (c = d), i.baseState = c, i.firstBaseUpdate = l, i.lastBaseUpdate = u, a === null && (i.shared.lanes = 0), eu |= o, e.lanes = o, e.memoizedState = d;
		}
	}
	function Xa(e, t) {
		if (typeof e != "function") throw Error(i(191, e));
		e.call(t);
	}
	function Za(e, t) {
		var n = e.callbacks;
		if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) Xa(n[e], t);
	}
	var Qa = ue(null), $a = ue(0);
	function eo(e, t) {
		e = Ql, M($a, e), M(Qa, t), Ql = e | t.baseLanes;
	}
	function to() {
		M($a, Ql), M(Qa, Qa.current);
	}
	function no() {
		Ql = $a.current, j(Qa), j($a);
	}
	var ro = ue(null), io = null;
	function ao(e) {
		var t = e.alternate;
		M(uo, uo.current & 1), M(ro, e), io === null && (t === null || Qa.current !== null || t.memoizedState !== null) && (io = e);
	}
	function oo(e) {
		M(uo, uo.current), M(ro, e), io === null && (io = e);
	}
	function so(e) {
		e.tag === 22 ? (M(uo, uo.current), M(ro, e), io === null && (io = e)) : co(e);
	}
	function co() {
		M(uo, uo.current), M(ro, ro.current);
	}
	function lo(e) {
		j(ro), io === e && (io = null), j(uo);
	}
	var uo = ue(0);
	function fo(e) {
		for (var t = e; t !== null;) {
			if (t.tag === 13) {
				var n = t.memoizedState;
				if (n !== null && (n = n.dehydrated, n === null || hf(n) || gf(n))) return t;
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
	var po = 0, B = null, mo = null, ho = null, go = !1, _o = !1, vo = !1, yo = 0, bo = 0, xo = null, So = 0;
	function Co() {
		throw Error(i(321));
	}
	function wo(e, t) {
		if (t === null) return !1;
		for (var n = 0; n < t.length && n < e.length; n++) if (!Cr(e[n], t[n])) return !1;
		return !0;
	}
	function To(e, t, n, r, i, a) {
		return po = a, B = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, k.H = e === null || e.memoizedState === null ? Hs : Us, vo = !1, a = n(r, i), vo = !1, _o && (a = Do(t, n, r, i)), Eo(e), a;
	}
	function Eo(e) {
		k.H = Vs;
		var t = mo !== null && mo.next !== null;
		if (po = 0, ho = mo = B = null, go = !1, bo = 0, xo = null, t) throw Error(i(300));
		e === null || oc || (e = e.dependencies, e !== null && ta(e) && (oc = !0));
	}
	function Do(e, t, n, r) {
		B = e;
		var a = 0;
		do {
			if (_o && (xo = null), bo = 0, _o = !1, 25 <= a) throw Error(i(301));
			if (a += 1, ho = mo = null, e.updateQueue != null) {
				var o = e.updateQueue;
				o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
			}
			k.H = Ws, o = t(n, r);
		} while (_o);
		return o;
	}
	function Oo() {
		var e = k.H, t = e.useState()[0];
		return t = typeof t.then == "function" ? Fo(t) : t, e = e.useState()[0], (mo === null ? null : mo.memoizedState) !== e && (B.flags |= 1024), t;
	}
	function ko() {
		var e = yo !== 0;
		return yo = 0, e;
	}
	function Ao(e, t, n) {
		t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
	}
	function jo(e) {
		if (go) {
			for (e = e.memoizedState; e !== null;) {
				var t = e.queue;
				t !== null && (t.pending = null), e = e.next;
			}
			go = !1;
		}
		po = 0, ho = mo = B = null, _o = !1, bo = yo = 0, xo = null;
	}
	function Mo() {
		var e = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return ho === null ? B.memoizedState = ho = e : ho = ho.next = e, ho;
	}
	function No() {
		if (mo === null) {
			var e = B.alternate;
			e = e === null ? null : e.memoizedState;
		} else e = mo.next;
		var t = ho === null ? B.memoizedState : ho.next;
		if (t !== null) ho = t, mo = e;
		else {
			if (e === null) throw B.alternate === null ? Error(i(467)) : Error(i(310));
			mo = e, e = {
				memoizedState: mo.memoizedState,
				baseState: mo.baseState,
				baseQueue: mo.baseQueue,
				queue: mo.queue,
				next: null
			}, ho === null ? B.memoizedState = ho = e : ho = ho.next = e;
		}
		return ho;
	}
	function Po() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function Fo(e) {
		var t = bo;
		return bo += 1, xo === null && (xo = []), e = Da(xo, e, t), t = B, (ho === null ? t.memoizedState : ho.next) === null && (t = t.alternate, k.H = t === null || t.memoizedState === null ? Hs : Us), e;
	}
	function Io(e) {
		if (typeof e == "object" && e) {
			if (typeof e.then == "function") return Fo(e);
			if (e.$$typeof === te) return ra(e);
		}
		throw Error(i(438, String(e)));
	}
	function Lo(e) {
		var t = null, n = B.updateQueue;
		if (n !== null && (t = n.memoCache), t == null) {
			var r = B.alternate;
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
		}, n === null && (n = Po(), B.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = T;
		return t.index++, n;
	}
	function Ro(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function zo(e) {
		return Bo(No(), mo, e);
	}
	function Bo(e, t, n) {
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
				if (f === u.lane ? (po & f) === f : (Kl & f) === f) {
					var p = u.revertLane;
					if (p === 0) l !== null && (l = l.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}), f === z && (d = !0);
					else if ((po & p) === p) {
						u = u.next, p === z && (d = !0);
						continue;
					} else f = {
						lane: 0,
						revertLane: u.revertLane,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}, l === null ? (c = l = f, s = o) : l = l.next = f, B.lanes |= p, eu |= p;
					f = u.action, vo && n(o, f), o = u.hasEagerState ? u.eagerState : n(o, f);
				} else p = {
					lane: f,
					revertLane: u.revertLane,
					gesture: u.gesture,
					action: u.action,
					hasEagerState: u.hasEagerState,
					eagerState: u.eagerState,
					next: null
				}, l === null ? (c = l = p, s = o) : l = l.next = p, B.lanes |= f, eu |= f;
				u = u.next;
			} while (u !== null && u !== t);
			if (l === null ? s = o : l.next = c, !Cr(o, e.memoizedState) && (oc = !0, d && (n = pa, n !== null))) throw n;
			e.memoizedState = o, e.baseState = s, e.baseQueue = l, r.lastRenderedState = o;
		}
		return a === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
	}
	function Vo(e) {
		var t = No(), n = t.queue;
		if (n === null) throw Error(i(311));
		n.lastRenderedReducer = e;
		var r = n.dispatch, a = n.pending, o = t.memoizedState;
		if (a !== null) {
			n.pending = null;
			var s = a = a.next;
			do
				o = e(o, s.action), s = s.next;
			while (s !== a);
			Cr(o, t.memoizedState) || (oc = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
		}
		return [o, r];
	}
	function Ho(e, t, n) {
		var r = B, a = No(), o = Ii;
		if (o) {
			if (n === void 0) throw Error(i(407));
			n = n();
		} else n = t();
		var s = !Cr((mo || a).memoizedState, n);
		if (s && (a.memoizedState = n, oc = !0), a = a.queue, ps(Go.bind(null, r, a, e), [e]), a.getSnapshot !== t || s || ho !== null && ho.memoizedState.tag & 1) {
			if (r.flags |= 2048, cs(9, { destroy: void 0 }, Wo.bind(null, r, a, n, t), null), Gl === null) throw Error(i(349));
			o || po & 127 || Uo(r, t, n);
		}
		return n;
	}
	function Uo(e, t, n) {
		e.flags |= 16384, e = {
			getSnapshot: t,
			value: n
		}, t = B.updateQueue, t === null ? (t = Po(), B.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
	}
	function Wo(e, t, n, r) {
		t.value = n, t.getSnapshot = r, Ko(t) && qo(e);
	}
	function Go(e, t, n) {
		return n(function() {
			Ko(t) && qo(e);
		});
	}
	function Ko(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !Cr(e, n);
		} catch {
			return !0;
		}
	}
	function qo(e) {
		var t = ii(e, 2);
		t !== null && Cu(t, e, 2);
	}
	function Jo(e) {
		var t = Mo();
		if (typeof e == "function") {
			var n = e;
			if (e = n(), vo) {
				Be(!0);
				try {
					n();
				} finally {
					Be(!1);
				}
			}
		}
		return t.memoizedState = t.baseState = e, t.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: Ro,
			lastRenderedState: e
		}, t;
	}
	function Yo(e, t, n, r) {
		return e.baseState = n, Bo(e, mo, typeof r == "function" ? r : Ro);
	}
	function Xo(e, t, n, r, a) {
		if (Rs(e)) throw Error(i(485));
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
			k.T === null ? o.isTransition = !1 : n(!0), r(o), n = t.pending, n === null ? (o.next = t.pending = o, Zo(t, o)) : (o.next = n.next, t.pending = n.next = o);
		}
	}
	function Zo(e, t) {
		var n = t.action, r = t.payload, i = e.state;
		if (t.isTransition) {
			var a = k.T, o = {};
			k.T = o;
			try {
				var s = n(i, r), c = k.S;
				c !== null && c(o, s), Qo(e, t, s);
			} catch (n) {
				es(e, t, n);
			} finally {
				a !== null && o.types !== null && (a.types = o.types), k.T = a;
			}
		} else try {
			a = n(i, r), Qo(e, t, a);
		} catch (n) {
			es(e, t, n);
		}
	}
	function Qo(e, t, n) {
		typeof n == "object" && n && typeof n.then == "function" ? n.then(function(n) {
			$o(e, t, n);
		}, function(n) {
			return es(e, t, n);
		}) : $o(e, t, n);
	}
	function $o(e, t, n) {
		t.status = "fulfilled", t.value = n, ts(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, Zo(e, n)));
	}
	function es(e, t, n) {
		var r = e.pending;
		if (e.pending = null, r !== null) {
			r = r.next;
			do
				t.status = "rejected", t.reason = n, ts(t), t = t.next;
			while (t !== r);
		}
		e.action = null;
	}
	function ts(e) {
		e = e.listeners;
		for (var t = 0; t < e.length; t++) (0, e[t])();
	}
	function ns(e, t) {
		return t;
	}
	function rs(e, t) {
		if (Ii) {
			var n = Gl.formState;
			if (n !== null) {
				a: {
					var r = B;
					if (Ii) {
						if (Fi) {
							b: {
								for (var i = Fi, a = Ri; i.nodeType !== 8;) {
									if (!a) {
										i = null;
										break b;
									}
									if (i = vf(i.nextSibling), i === null) {
										i = null;
										break b;
									}
								}
								a = i.data, i = a === "F!" || a === "F" ? i : null;
							}
							if (i) {
								Fi = vf(i.nextSibling), r = i.data === "F!";
								break a;
							}
						}
						Bi(r);
					}
					r = !1;
				}
				r && (t = n[0]);
			}
		}
		return n = Mo(), n.memoizedState = n.baseState = t, r = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: ns,
			lastRenderedState: t
		}, n.queue = r, n = Fs.bind(null, B, r), r.dispatch = n, r = Jo(!1), a = Ls.bind(null, B, !1, r.queue), r = Mo(), i = {
			state: t,
			dispatch: null,
			action: e,
			pending: null
		}, r.queue = i, n = Xo.bind(null, B, i, a, n), i.dispatch = n, r.memoizedState = e, [
			t,
			n,
			!1
		];
	}
	function is(e) {
		return as(No(), mo, e);
	}
	function as(e, t, n) {
		if (t = Bo(e, t, ns)[0], e = zo(Ro)[0], typeof t == "object" && t && typeof t.then == "function") try {
			var r = Fo(t);
		} catch (e) {
			throw e === Sa ? wa : e;
		}
		else r = t;
		t = No();
		var i = t.queue, a = i.dispatch;
		return n !== t.memoizedState && (B.flags |= 2048, cs(9, { destroy: void 0 }, os.bind(null, i, n), null)), [
			r,
			a,
			e
		];
	}
	function os(e, t) {
		e.action = t;
	}
	function ss(e) {
		var t = No(), n = mo;
		if (n !== null) return as(t, n, e);
		No(), t = t.memoizedState, n = No();
		var r = n.queue.dispatch;
		return n.memoizedState = e, [
			t,
			r,
			!1
		];
	}
	function cs(e, t, n, r) {
		return e = {
			tag: e,
			create: n,
			deps: r,
			inst: t,
			next: null
		}, t = B.updateQueue, t === null && (t = Po(), B.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
	}
	function ls() {
		return No().memoizedState;
	}
	function us(e, t, n, r) {
		var i = Mo();
		B.flags |= e, i.memoizedState = cs(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r);
	}
	function ds(e, t, n, r) {
		var i = No();
		r = r === void 0 ? null : r;
		var a = i.memoizedState.inst;
		mo !== null && r !== null && wo(r, mo.memoizedState.deps) ? i.memoizedState = cs(t, a, n, r) : (B.flags |= e, i.memoizedState = cs(1 | t, a, n, r));
	}
	function fs(e, t) {
		us(8390656, 8, e, t);
	}
	function ps(e, t) {
		ds(2048, 8, e, t);
	}
	function ms(e) {
		B.flags |= 4;
		var t = B.updateQueue;
		if (t === null) t = Po(), B.updateQueue = t, t.events = [e];
		else {
			var n = t.events;
			n === null ? t.events = [e] : n.push(e);
		}
	}
	function hs(e) {
		var t = No().memoizedState;
		return ms({
			ref: t,
			nextImpl: e
		}), function() {
			if (Wl & 2) throw Error(i(440));
			return t.impl.apply(void 0, arguments);
		};
	}
	function gs(e, t) {
		return ds(4, 2, e, t);
	}
	function _s(e, t) {
		return ds(4, 4, e, t);
	}
	function vs(e, t) {
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
	function ys(e, t, n) {
		n = n == null ? null : n.concat([e]), ds(4, 4, vs.bind(null, t, e), n);
	}
	function bs() {}
	function xs(e, t) {
		var n = No();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		return t !== null && wo(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
	}
	function Ss(e, t) {
		var n = No();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		if (t !== null && wo(t, r[1])) return r[0];
		if (r = e(), vo) {
			Be(!0);
			try {
				e();
			} finally {
				Be(!1);
			}
		}
		return n.memoizedState = [r, t], r;
	}
	function Cs(e, t, n) {
		return n === void 0 || po & 1073741824 && !(Kl & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = Su(), B.lanes |= e, eu |= e, n);
	}
	function ws(e, t, n, r) {
		return Cr(n, t) ? n : Qa.current === null ? !(po & 42) || po & 1073741824 && !(Kl & 261930) ? (oc = !0, e.memoizedState = n) : (e = Su(), B.lanes |= e, eu |= e, t) : (e = Cs(e, n, r), Cr(e, t) || (oc = !0), e);
	}
	function Ts(e, t, n, r, i) {
		var a = A.p;
		A.p = a !== 0 && 8 > a ? a : 8;
		var o = k.T, s = {};
		k.T = s, Ls(e, !1, t, n);
		try {
			var c = i(), l = k.S;
			l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function" ? Is(e, t, ga(c, r), xu(e)) : Is(e, t, r, xu(e));
		} catch (n) {
			Is(e, t, {
				then: function() {},
				status: "rejected",
				reason: n
			}, xu());
		} finally {
			A.p = a, o !== null && s.types !== null && (o.types = s.types), k.T = o;
		}
	}
	function Es() {}
	function Ds(e, t, n, r) {
		if (e.tag !== 5) throw Error(i(476));
		var a = Os(e).queue;
		Ts(e, a, t, se, n === null ? Es : function() {
			return ks(e), n(r);
		});
	}
	function Os(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: se,
			baseState: se,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: Ro,
				lastRenderedState: se
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
				lastRenderedReducer: Ro,
				lastRenderedState: n
			},
			next: null
		}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
	}
	function ks(e) {
		var t = Os(e);
		t.next === null && (t = e.alternate.memoizedState), Is(e, t.next.queue, {}, xu());
	}
	function As() {
		return ra(op);
	}
	function js() {
		return No().memoizedState;
	}
	function Ms() {
		return No().memoizedState;
	}
	function Ns(e) {
		for (var t = e.return; t !== null;) {
			switch (t.tag) {
				case 24:
				case 3:
					var n = xu();
					e = Ua(n);
					var r = Wa(t, e, n);
					r !== null && (Cu(r, t, n), Ga(r, t, n)), t = { cache: ua() }, e.payload = t;
					return;
			}
			t = t.return;
		}
	}
	function Ps(e, t, n) {
		var r = xu();
		n = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, Rs(e) ? zs(t, n) : (n = ri(e, t, n, r), n !== null && (Cu(n, e, r), Bs(n, t, r)));
	}
	function Fs(e, t, n) {
		Is(e, t, n, xu());
	}
	function Is(e, t, n, r) {
		var i = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (Rs(e)) zs(t, i);
		else {
			var a = e.alternate;
			if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
				var o = t.lastRenderedState, s = a(o, n);
				if (i.hasEagerState = !0, i.eagerState = s, Cr(s, o)) return ni(e, t, i, 0), Gl === null && ti(), !1;
			} catch {}
			if (n = ri(e, t, i, r), n !== null) return Cu(n, e, r), Bs(n, t, r), !0;
		}
		return !1;
	}
	function Ls(e, t, n, r) {
		if (r = {
			lane: 2,
			revertLane: bd(),
			gesture: null,
			action: r,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, Rs(e)) {
			if (t) throw Error(i(479));
		} else t = ri(e, n, r, 2), t !== null && Cu(t, e, 2);
	}
	function Rs(e) {
		var t = e.alternate;
		return e === B || t !== null && t === B;
	}
	function zs(e, t) {
		_o = go = !0;
		var n = e.pending;
		n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
	}
	function Bs(e, t, n) {
		if (n & 4194048) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, rt(e, n);
		}
	}
	var Vs = {
		readContext: ra,
		use: Io,
		useCallback: Co,
		useContext: Co,
		useEffect: Co,
		useImperativeHandle: Co,
		useLayoutEffect: Co,
		useInsertionEffect: Co,
		useMemo: Co,
		useReducer: Co,
		useRef: Co,
		useState: Co,
		useDebugValue: Co,
		useDeferredValue: Co,
		useTransition: Co,
		useSyncExternalStore: Co,
		useId: Co,
		useHostTransitionStatus: Co,
		useFormState: Co,
		useActionState: Co,
		useOptimistic: Co,
		useMemoCache: Co,
		useCacheRefresh: Co
	};
	Vs.useEffectEvent = Co;
	var Hs = {
		readContext: ra,
		use: Io,
		useCallback: function(e, t) {
			return Mo().memoizedState = [e, t === void 0 ? null : t], e;
		},
		useContext: ra,
		useEffect: fs,
		useImperativeHandle: function(e, t, n) {
			n = n == null ? null : n.concat([e]), us(4194308, 4, vs.bind(null, t, e), n);
		},
		useLayoutEffect: function(e, t) {
			return us(4194308, 4, e, t);
		},
		useInsertionEffect: function(e, t) {
			us(4, 2, e, t);
		},
		useMemo: function(e, t) {
			var n = Mo();
			t = t === void 0 ? null : t;
			var r = e();
			if (vo) {
				Be(!0);
				try {
					e();
				} finally {
					Be(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		},
		useReducer: function(e, t, n) {
			var r = Mo();
			if (n !== void 0) {
				var i = n(t);
				if (vo) {
					Be(!0);
					try {
						n(t);
					} finally {
						Be(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = Ps.bind(null, B, e), [r.memoizedState, e];
		},
		useRef: function(e) {
			var t = Mo();
			return e = { current: e }, t.memoizedState = e;
		},
		useState: function(e) {
			e = Jo(e);
			var t = e.queue, n = Fs.bind(null, B, t);
			return t.dispatch = n, [e.memoizedState, n];
		},
		useDebugValue: bs,
		useDeferredValue: function(e, t) {
			return Cs(Mo(), e, t);
		},
		useTransition: function() {
			var e = Jo(!1);
			return e = Ts.bind(null, B, e.queue, !0, !1), Mo().memoizedState = e, [!1, e];
		},
		useSyncExternalStore: function(e, t, n) {
			var r = B, a = Mo();
			if (Ii) {
				if (n === void 0) throw Error(i(407));
				n = n();
			} else {
				if (n = t(), Gl === null) throw Error(i(349));
				Kl & 127 || Uo(r, t, n);
			}
			a.memoizedState = n;
			var o = {
				value: n,
				getSnapshot: t
			};
			return a.queue = o, fs(Go.bind(null, r, o, e), [e]), r.flags |= 2048, cs(9, { destroy: void 0 }, Wo.bind(null, r, o, n, t), null), n;
		},
		useId: function() {
			var e = Mo(), t = Gl.identifierPrefix;
			if (Ii) {
				var n = Oi, r = Di;
				n = (r & ~(1 << 32 - Ve(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = yo++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = So++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		},
		useHostTransitionStatus: As,
		useFormState: rs,
		useActionState: rs,
		useOptimistic: function(e) {
			var t = Mo();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = Ls.bind(null, B, !0, n), n.dispatch = t, [e, t];
		},
		useMemoCache: Lo,
		useCacheRefresh: function() {
			return Mo().memoizedState = Ns.bind(null, B);
		},
		useEffectEvent: function(e) {
			var t = Mo(), n = { impl: e };
			return t.memoizedState = n, function() {
				if (Wl & 2) throw Error(i(440));
				return n.impl.apply(void 0, arguments);
			};
		}
	}, Us = {
		readContext: ra,
		use: Io,
		useCallback: xs,
		useContext: ra,
		useEffect: ps,
		useImperativeHandle: ys,
		useInsertionEffect: gs,
		useLayoutEffect: _s,
		useMemo: Ss,
		useReducer: zo,
		useRef: ls,
		useState: function() {
			return zo(Ro);
		},
		useDebugValue: bs,
		useDeferredValue: function(e, t) {
			return ws(No(), mo.memoizedState, e, t);
		},
		useTransition: function() {
			var e = zo(Ro)[0], t = No().memoizedState;
			return [typeof e == "boolean" ? e : Fo(e), t];
		},
		useSyncExternalStore: Ho,
		useId: js,
		useHostTransitionStatus: As,
		useFormState: is,
		useActionState: is,
		useOptimistic: function(e, t) {
			return Yo(No(), mo, e, t);
		},
		useMemoCache: Lo,
		useCacheRefresh: Ms
	};
	Us.useEffectEvent = hs;
	var Ws = {
		readContext: ra,
		use: Io,
		useCallback: xs,
		useContext: ra,
		useEffect: ps,
		useImperativeHandle: ys,
		useInsertionEffect: gs,
		useLayoutEffect: _s,
		useMemo: Ss,
		useReducer: Vo,
		useRef: ls,
		useState: function() {
			return Vo(Ro);
		},
		useDebugValue: bs,
		useDeferredValue: function(e, t) {
			var n = No();
			return mo === null ? Cs(n, e, t) : ws(n, mo.memoizedState, e, t);
		},
		useTransition: function() {
			var e = Vo(Ro)[0], t = No().memoizedState;
			return [typeof e == "boolean" ? e : Fo(e), t];
		},
		useSyncExternalStore: Ho,
		useId: js,
		useHostTransitionStatus: As,
		useFormState: ss,
		useActionState: ss,
		useOptimistic: function(e, t) {
			var n = No();
			return mo === null ? (n.baseState = e, [e, n.queue.dispatch]) : Yo(n, mo, e, t);
		},
		useMemoCache: Lo,
		useCacheRefresh: Ms
	};
	Ws.useEffectEvent = hs;
	function Gs(e, t, n, r) {
		t = e.memoizedState, n = n(r, t), n = n == null ? t : p({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
	}
	var Ks = {
		enqueueSetState: function(e, t, n) {
			e = e._reactInternals;
			var r = xu(), i = Ua(r);
			i.payload = t, n != null && (i.callback = n), t = Wa(e, i, r), t !== null && (Cu(t, e, r), Ga(t, e, r));
		},
		enqueueReplaceState: function(e, t, n) {
			e = e._reactInternals;
			var r = xu(), i = Ua(r);
			i.tag = 1, i.payload = t, n != null && (i.callback = n), t = Wa(e, i, r), t !== null && (Cu(t, e, r), Ga(t, e, r));
		},
		enqueueForceUpdate: function(e, t) {
			e = e._reactInternals;
			var n = xu(), r = Ua(n);
			r.tag = 2, t != null && (r.callback = t), t = Wa(e, r, n), t !== null && (Cu(t, e, n), Ga(t, e, n));
		}
	};
	function qs(e, t, n, r, i, a, o) {
		return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !wr(n, r) || !wr(i, a) : !0;
	}
	function Js(e, t, n, r) {
		e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && Ks.enqueueReplaceState(t, t.state, null);
	}
	function Ys(e, t) {
		var n = t;
		if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
		if (e = e.defaultProps) for (var i in n === t && (n = p({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
		return n;
	}
	function Xs(e) {
		Zr(e);
	}
	function Zs(e) {
		console.error(e);
	}
	function Qs(e) {
		Zr(e);
	}
	function $s(e, t) {
		try {
			var n = e.onUncaughtError;
			n(t.value, { componentStack: t.stack });
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function ec(e, t, n) {
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
	function tc(e, t, n) {
		return n = Ua(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
			$s(e, t);
		}, n;
	}
	function nc(e) {
		return e = Ua(e), e.tag = 3, e;
	}
	function rc(e, t, n, r) {
		var i = n.type.getDerivedStateFromError;
		if (typeof i == "function") {
			var a = r.value;
			e.payload = function() {
				return i(a);
			}, e.callback = function() {
				ec(t, n, r);
			};
		}
		var o = n.stateNode;
		o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
			ec(t, n, r), typeof i != "function" && (du === null ? du = new Set([this]) : du.add(this));
			var e = r.stack;
			this.componentDidCatch(r.value, { componentStack: e === null ? "" : e });
		});
	}
	function ic(e, t, n, r, a) {
		if (n.flags |= 32768, typeof r == "object" && r && typeof r.then == "function") {
			if (t = n.alternate, t !== null && ea(t, n, a, !0), n = ro.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13: return io === null ? Fu() : n.alternate === null && $l === 0 && ($l = 3), n.flags &= -257, n.flags |= 65536, n.lanes = a, r === Ta ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = new Set([r]) : t.add(r), ed(e, r, a)), !1;
					case 22: return n.flags |= 65536, r === Ta ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
						transitions: null,
						markerInstances: null,
						retryQueue: new Set([r])
					}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = new Set([r]) : n.add(r)), ed(e, r, a)), !1;
				}
				throw Error(i(435, n.tag));
			}
			return ed(e, r, a), Fu(), !1;
		}
		if (Ii) return t = ro.current, t === null ? (r !== zi && (t = Error(i(423), { cause: r }), Ki(yi(t, n))), e = e.current.alternate, e.flags |= 65536, a &= -a, e.lanes |= a, r = yi(r, n), a = tc(e.stateNode, r, a), Ka(e, a), $l !== 4 && ($l = 2)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = a, r !== zi && (e = Error(i(422), { cause: r }), Ki(yi(e, n)))), !1;
		var o = Error(i(520), { cause: r });
		if (o = yi(o, n), H === null ? H = [o] : H.push(o), $l !== 4 && ($l = 2), t === null) return !0;
		r = yi(r, n), n = t;
		do {
			switch (n.tag) {
				case 3: return n.flags |= 65536, e = a & -a, n.lanes |= e, e = tc(n.stateNode, r, e), Ka(n, e), !1;
				case 1: if (t = n.type, o = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (du === null || !du.has(o)))) return n.flags |= 65536, a &= -a, n.lanes |= a, a = nc(a), rc(a, e, n, r), Ka(n, a), !1;
			}
			n = n.return;
		} while (n !== null);
		return !1;
	}
	var ac = Error(i(461)), oc = !1;
	function sc(e, t, n, r) {
		t.child = e === null ? za(t, null, n, r) : Ra(t, e.child, n, r);
	}
	function cc(e, t, n, r, i) {
		n = n.render;
		var a = t.ref;
		if ("ref" in r) {
			var o = {};
			for (var s in r) s !== "ref" && (o[s] = r[s]);
		} else o = r;
		return na(t), r = To(e, t, n, o, a, i), s = ko(), e !== null && !oc ? (Ao(e, t, i), Mc(e, t, i)) : (Ii && s && ji(t), t.flags |= 1, sc(e, t, r, i), t.child);
	}
	function lc(e, t, n, r, i) {
		if (e === null) {
			var a = n.type;
			return typeof a == "function" && !ui(a) && a.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = a, uc(e, t, a, r, i)) : (e = pi(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
		}
		if (a = e.child, !Nc(e, i)) {
			var o = a.memoizedProps;
			if (n = n.compare, n = n === null ? wr : n, n(o, r) && e.ref === t.ref) return Mc(e, t, i);
		}
		return t.flags |= 1, e = di(a, r), e.ref = t.ref, e.return = t, t.child = e;
	}
	function uc(e, t, n, r, i) {
		if (e !== null) {
			var a = e.memoizedProps;
			if (wr(a, r) && e.ref === t.ref) if (oc = !1, t.pendingProps = r = a, Nc(e, i)) e.flags & 131072 && (oc = !0);
			else return t.lanes = e.lanes, Mc(e, t, i);
		}
		return vc(e, t, n, r, i);
	}
	function dc(e, t, n, r) {
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
				return pc(e, t, a, n, r);
			}
			if (n & 536870912) t.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, e !== null && ba(t, a === null ? null : a.cachePool), a === null ? to() : eo(t, a), so(t);
			else return r = t.lanes = 536870912, pc(e, t, a === null ? n : a.baseLanes | n, n, r);
		} else a === null ? (e !== null && ba(t, null), to(), co(t)) : (ba(t, a.cachePool), eo(t, a), co(t), t.memoizedState = null);
		return sc(e, t, i, n), t.child;
	}
	function fc(e, t) {
		return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), t.sibling;
	}
	function pc(e, t, n, r, i) {
		var a = ya();
		return a = a === null ? null : {
			parent: la._currentValue,
			pool: a
		}, t.memoizedState = {
			baseLanes: n,
			cachePool: a
		}, e !== null && ba(t, null), to(), so(t), e !== null && ea(e, t, r, !0), t.childLanes = i, null;
	}
	function mc(e, t) {
		return t = Dc({
			mode: t.mode,
			children: t.children
		}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
	}
	function hc(e, t, n) {
		return Ra(t, e.child, null, n), e = mc(t, t.pendingProps), e.flags |= 2, lo(t), t.memoizedState = null, e;
	}
	function gc(e, t, n) {
		var r = t.pendingProps, a = (t.flags & 128) != 0;
		if (t.flags &= -129, e === null) {
			if (Ii) {
				if (r.mode === "hidden") return e = mc(t, r), t.lanes = 536870912, fc(null, e);
				if (oo(t), (e = Fi) ? (e = mf(e, Ri), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Ei === null ? null : {
						id: Di,
						overflow: Oi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = gi(e), n.return = t, t.child = n, Pi = t, Fi = null)) : e = null, e === null) throw Bi(t);
				return t.lanes = 536870912, null;
			}
			return mc(t, r);
		}
		var o = e.memoizedState;
		if (o !== null) {
			var s = o.dehydrated;
			if (oo(t), a) if (t.flags & 256) t.flags &= -257, t = hc(e, t, n);
			else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
			else throw Error(i(558));
			else if (oc || ea(e, t, n, !1), a = (n & e.childLanes) !== 0, oc || a) {
				if (r = Gl, r !== null && (s = it(r, n), s !== 0 && s !== o.retryLane)) throw o.retryLane = s, ii(e, s), Cu(r, e, s), ac;
				Fu(), t = hc(e, t, n);
			} else e = o.treeContext, Fi = vf(s.nextSibling), Pi = t, Ii = !0, Li = null, Ri = !1, e !== null && Ni(t, e), t = mc(t, r), t.flags |= 4096;
			return t;
		}
		return e = di(e.child, {
			mode: r.mode,
			children: r.children
		}), e.ref = t.ref, t.child = e, e.return = t, e;
	}
	function _c(e, t) {
		var n = t.ref;
		if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
		else {
			if (typeof n != "function" && typeof n != "object") throw Error(i(284));
			(e === null || e.ref !== n) && (t.flags |= 4194816);
		}
	}
	function vc(e, t, n, r, i) {
		return na(t), n = To(e, t, n, r, void 0, i), r = ko(), e !== null && !oc ? (Ao(e, t, i), Mc(e, t, i)) : (Ii && r && ji(t), t.flags |= 1, sc(e, t, n, i), t.child);
	}
	function yc(e, t, n, r, i, a) {
		return na(t), t.updateQueue = null, n = Do(t, r, n, i), Eo(e), r = ko(), e !== null && !oc ? (Ao(e, t, a), Mc(e, t, a)) : (Ii && r && ji(t), t.flags |= 1, sc(e, t, n, a), t.child);
	}
	function bc(e, t, n, r, i) {
		if (na(t), t.stateNode === null) {
			var a = si, o = n.contextType;
			typeof o == "object" && o && (a = ra(o)), a = new n(r, a), t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = Ks, t.stateNode = a, a._reactInternals = t, a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, Va(t), o = n.contextType, a.context = typeof o == "object" && o ? ra(o) : si, a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (Gs(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && Ks.enqueueReplaceState(a, a.state, null), Ya(t, r, a, i), Ja(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
		} else if (e === null) {
			a = t.stateNode;
			var s = t.memoizedProps, c = Ys(n, s);
			a.props = c;
			var l = a.context, u = n.contextType;
			o = si, typeof u == "object" && u && (o = ra(u));
			var d = n.getDerivedStateFromProps;
			u = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, u || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (s || l !== o) && Js(t, a, r, o), Ba = !1;
			var f = t.memoizedState;
			a.state = f, Ya(t, r, a, i), Ja(), l = t.memoizedState, s || f !== l || Ba ? (typeof d == "function" && (Gs(t, n, d, r), l = t.memoizedState), (c = Ba || qs(t, n, c, r, f, l, o)) ? (u || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = o, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
		} else {
			a = t.stateNode, Ha(e, t), o = t.memoizedProps, u = Ys(n, o), a.props = u, d = t.pendingProps, f = a.context, l = n.contextType, c = si, typeof l == "object" && l && (c = ra(l)), s = n.getDerivedStateFromProps, (l = typeof s == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== d || f !== c) && Js(t, a, r, c), Ba = !1, f = t.memoizedState, a.state = f, Ya(t, r, a, i), Ja();
			var p = t.memoizedState;
			o !== d || f !== p || Ba || e !== null && e.dependencies !== null && ta(e.dependencies) ? (typeof s == "function" && (Gs(t, n, s, r), p = t.memoizedState), (u = Ba || qs(t, n, u, r, f, p, c) || e !== null && e.dependencies !== null && ta(e.dependencies)) ? (l || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, p, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, p, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = c, r = u) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), r = !1);
		}
		return a = r, _c(e, t), r = (t.flags & 128) != 0, a || r ? (a = t.stateNode, n = r && typeof n.getDerivedStateFromError != "function" ? null : a.render(), t.flags |= 1, e !== null && r ? (t.child = Ra(t, e.child, null, i), t.child = Ra(t, null, n, i)) : sc(e, t, n, i), t.memoizedState = a.state, e = t.child) : e = Mc(e, t, i), e;
	}
	function xc(e, t, n, r) {
		return Wi(), t.flags |= 256, sc(e, t, n, r), t.child;
	}
	var Sc = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function Cc(e) {
		return {
			baseLanes: e,
			cachePool: xa()
		};
	}
	function wc(e, t, n) {
		return e = e === null ? 0 : e.childLanes & ~n, t && (e |= ru), e;
	}
	function Tc(e, t, n) {
		var r = t.pendingProps, a = !1, o = (t.flags & 128) != 0, s;
		if ((s = o) || (s = e !== null && e.memoizedState === null ? !1 : (uo.current & 2) != 0), s && (a = !0, t.flags &= -129), s = (t.flags & 32) != 0, t.flags &= -33, e === null) {
			if (Ii) {
				if (a ? ao(t) : co(t), (e = Fi) ? (e = mf(e, Ri), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Ei === null ? null : {
						id: Di,
						overflow: Oi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = gi(e), n.return = t, t.child = n, Pi = t, Fi = null)) : e = null, e === null) throw Bi(t);
				return gf(e) ? t.lanes = 32 : t.lanes = 536870912, null;
			}
			var c = r.children;
			return r = r.fallback, a ? (co(t), a = t.mode, c = Dc({
				mode: "hidden",
				children: c
			}, a), r = mi(r, a, n, null), c.return = t, r.return = t, c.sibling = r, t.child = c, r = t.child, r.memoizedState = Cc(n), r.childLanes = wc(e, s, n), t.memoizedState = Sc, fc(null, r)) : (ao(t), Ec(t, c));
		}
		var l = e.memoizedState;
		if (l !== null && (c = l.dehydrated, c !== null)) {
			if (o) t.flags & 256 ? (ao(t), t.flags &= -257, t = Oc(e, t, n)) : t.memoizedState === null ? (co(t), c = r.fallback, a = t.mode, r = Dc({
				mode: "visible",
				children: r.children
			}, a), c = mi(c, a, n, null), c.flags |= 2, r.return = t, c.return = t, r.sibling = c, t.child = r, Ra(t, e.child, null, n), r = t.child, r.memoizedState = Cc(n), r.childLanes = wc(e, s, n), t.memoizedState = Sc, t = fc(null, r)) : (co(t), t.child = e.child, t.flags |= 128, t = null);
			else if (ao(t), gf(c)) {
				if (s = c.nextSibling && c.nextSibling.dataset, s) var u = s.dgst;
				s = u, r = Error(i(419)), r.stack = "", r.digest = s, Ki({
					value: r,
					source: null,
					stack: null
				}), t = Oc(e, t, n);
			} else if (oc || ea(e, t, n, !1), s = (n & e.childLanes) !== 0, oc || s) {
				if (s = Gl, s !== null && (r = it(s, n), r !== 0 && r !== l.retryLane)) throw l.retryLane = r, ii(e, r), Cu(s, e, r), ac;
				hf(c) || Fu(), t = Oc(e, t, n);
			} else hf(c) ? (t.flags |= 192, t.child = e.child, t = null) : (e = l.treeContext, Fi = vf(c.nextSibling), Pi = t, Ii = !0, Li = null, Ri = !1, e !== null && Ni(t, e), t = Ec(t, r.children), t.flags |= 4096);
			return t;
		}
		return a ? (co(t), c = r.fallback, a = t.mode, l = e.child, u = l.sibling, r = di(l, {
			mode: "hidden",
			children: r.children
		}), r.subtreeFlags = l.subtreeFlags & 65011712, u === null ? (c = mi(c, a, n, null), c.flags |= 2) : c = di(u, c), c.return = t, r.return = t, r.sibling = c, t.child = r, fc(null, r), r = t.child, c = e.child.memoizedState, c === null ? c = Cc(n) : (a = c.cachePool, a === null ? a = xa() : (l = la._currentValue, a = a.parent === l ? a : {
			parent: l,
			pool: l
		}), c = {
			baseLanes: c.baseLanes | n,
			cachePool: a
		}), r.memoizedState = c, r.childLanes = wc(e, s, n), t.memoizedState = Sc, fc(e.child, r)) : (ao(t), n = e.child, e = n.sibling, n = di(n, {
			mode: "visible",
			children: r.children
		}), n.return = t, n.sibling = null, e !== null && (s = t.deletions, s === null ? (t.deletions = [e], t.flags |= 16) : s.push(e)), t.child = n, t.memoizedState = null, n);
	}
	function Ec(e, t) {
		return t = Dc({
			mode: "visible",
			children: t
		}, e.mode), t.return = e, e.child = t;
	}
	function Dc(e, t) {
		return e = li(22, e, null, t), e.lanes = 0, e;
	}
	function Oc(e, t, n) {
		return Ra(t, e.child, null, n), e = Ec(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
	}
	function kc(e, t, n) {
		e.lanes |= t;
		var r = e.alternate;
		r !== null && (r.lanes |= t), Qi(e.return, t, n);
	}
	function Ac(e, t, n, r, i, a) {
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
	function jc(e, t, n) {
		var r = t.pendingProps, i = r.revealOrder, a = r.tail;
		r = r.children;
		var o = uo.current, s = (o & 2) != 0;
		if (s ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, M(uo, o), sc(e, t, r, n), r = Ii ? Ci : 0, !s && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
			if (e.tag === 13) e.memoizedState !== null && kc(e, n, t);
			else if (e.tag === 19) kc(e, n, t);
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
				for (n = t.child, i = null; n !== null;) e = n.alternate, e !== null && fo(e) === null && (i = n), n = n.sibling;
				n = i, n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), Ac(t, !1, i, n, a, r);
				break;
			case "backwards":
			case "unstable_legacy-backwards":
				for (n = null, i = t.child, t.child = null; i !== null;) {
					if (e = i.alternate, e !== null && fo(e) === null) {
						t.child = i;
						break;
					}
					e = i.sibling, i.sibling = n, n = i, i = e;
				}
				Ac(t, !0, n, null, a, r);
				break;
			case "together":
				Ac(t, !1, null, null, void 0, r);
				break;
			default: t.memoizedState = null;
		}
		return t.child;
	}
	function Mc(e, t, n) {
		if (e !== null && (t.dependencies = e.dependencies), eu |= t.lanes, (n & t.childLanes) === 0) if (e !== null) {
			if (ea(e, t, n, !1), (n & t.childLanes) === 0) return null;
		} else return null;
		if (e !== null && t.child !== e.child) throw Error(i(153));
		if (t.child !== null) {
			for (e = t.child, n = di(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = di(e, e.pendingProps), n.return = t;
			n.sibling = null;
		}
		return t.child;
	}
	function Nc(e, t) {
		return (e.lanes & t) === 0 ? (e = e.dependencies, !!(e !== null && ta(e))) : !0;
	}
	function Pc(e, t, n) {
		switch (t.tag) {
			case 3:
				he(t, t.stateNode.containerInfo), Xi(t, la, e.memoizedState.cache), Wi();
				break;
			case 27:
			case 5:
				_e(t);
				break;
			case 4:
				he(t, t.stateNode.containerInfo);
				break;
			case 10:
				Xi(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return t.flags |= 128, oo(t), null;
				break;
			case 13:
				var r = t.memoizedState;
				if (r !== null) return r.dehydrated === null ? (n & t.child.childLanes) === 0 ? (ao(t), e = Mc(e, t, n), e === null ? null : e.sibling) : Tc(e, t, n) : (ao(t), t.flags |= 128, null);
				ao(t);
				break;
			case 19:
				var i = (e.flags & 128) != 0;
				if (r = (n & t.childLanes) !== 0, r ||= (ea(e, t, n, !1), (n & t.childLanes) !== 0), i) {
					if (r) return jc(e, t, n);
					t.flags |= 128;
				}
				if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), M(uo, uo.current), r) break;
				return null;
			case 22: return t.lanes = 0, dc(e, t, n, t.pendingProps);
			case 24: Xi(t, la, e.memoizedState.cache);
		}
		return Mc(e, t, n);
	}
	function Fc(e, t, n) {
		if (e !== null) if (e.memoizedProps !== t.pendingProps) oc = !0;
		else {
			if (!Nc(e, n) && !(t.flags & 128)) return oc = !1, Pc(e, t, n);
			oc = !!(e.flags & 131072);
		}
		else oc = !1, Ii && t.flags & 1048576 && Ai(t, Ci, t.index);
		switch (t.lanes = 0, t.tag) {
			case 16:
				a: {
					var r = t.pendingProps;
					if (e = Oa(t.elementType), t.type = e, typeof e == "function") ui(e) ? (r = Ys(e, r), t.tag = 1, t = bc(null, t, e, r, n)) : (t.tag = 0, t = vc(null, t, e, r, n));
					else {
						if (e != null) {
							var a = e.$$typeof;
							if (a === S) {
								t.tag = 11, t = cc(null, t, e, r, n);
								break a;
							} else if (a === re) {
								t.tag = 14, t = lc(null, t, e, r, n);
								break a;
							}
						}
						throw t = ae(e) || e, Error(i(306, t, ""));
					}
				}
				return t;
			case 0: return vc(e, t, t.type, t.pendingProps, n);
			case 1: return r = t.type, a = Ys(r, t.pendingProps), bc(e, t, r, a, n);
			case 3:
				a: {
					if (he(t, t.stateNode.containerInfo), e === null) throw Error(i(387));
					r = t.pendingProps;
					var o = t.memoizedState;
					a = o.element, Ha(e, t), Ya(t, r, null, n);
					var s = t.memoizedState;
					if (r = s.cache, Xi(t, la, r), r !== o.cache && $i(t, [la], n, !0), Ja(), r = s.element, o.isDehydrated) if (o = {
						element: r,
						isDehydrated: !1,
						cache: s.cache
					}, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
						t = xc(e, t, r, n);
						break a;
					} else if (r !== a) {
						a = yi(Error(i(424)), t), Ki(a), t = xc(e, t, r, n);
						break a;
					} else {
						switch (e = t.stateNode.containerInfo, e.nodeType) {
							case 9:
								e = e.body;
								break;
							default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
						}
						for (Fi = vf(e.firstChild), Pi = t, Ii = !0, Li = null, Ri = !0, n = za(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 4096, n = n.sibling;
					}
					else {
						if (Wi(), r === a) {
							t = Mc(e, t, n);
							break a;
						}
						sc(e, t, r, n);
					}
					t = t.child;
				}
				return t;
			case 26: return _c(e, t), e === null ? (n = Rf(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : Ii || (n = t.type, e = t.pendingProps, r = Xd(pe.current).createElement(n), r[ut] = t, r[dt] = e, Wd(r, n, e), Ct(r), t.stateNode = r) : t.memoizedState = Rf(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
			case 27: return _e(t), e === null && Ii && (r = t.stateNode = Sf(t.type, t.pendingProps, pe.current), Pi = t, Ri = !0, a = Fi, cf(t.type) ? (yf = a, Fi = vf(r.firstChild)) : Fi = a), sc(e, t, t.pendingProps.children, n), _c(e, t), e === null && (t.flags |= 4194304), t.child;
			case 5: return e === null && Ii && ((a = r = Fi) && (r = ff(r, t.type, t.pendingProps, Ri), r === null ? a = !1 : (t.stateNode = r, Pi = t, Fi = vf(r.firstChild), Ri = !1, a = !0)), a || Bi(t)), _e(t), a = t.type, o = t.pendingProps, s = e === null ? null : e.memoizedProps, r = o.children, $d(a, o) ? r = null : s !== null && $d(a, s) && (t.flags |= 32), t.memoizedState !== null && (a = To(e, t, Oo, null, null, n), op._currentValue = a), _c(e, t), sc(e, t, r, n), t.child;
			case 6: return e === null && Ii && ((e = n = Fi) && (n = pf(n, t.pendingProps, Ri), n === null ? e = !1 : (t.stateNode = n, Pi = t, Fi = null, e = !0)), e || Bi(t)), null;
			case 13: return Tc(e, t, n);
			case 4: return he(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = Ra(t, null, r, n) : sc(e, t, r, n), t.child;
			case 11: return cc(e, t, t.type, t.pendingProps, n);
			case 7: return sc(e, t, t.pendingProps, n), t.child;
			case 8: return sc(e, t, t.pendingProps.children, n), t.child;
			case 12: return sc(e, t, t.pendingProps.children, n), t.child;
			case 10: return r = t.pendingProps, Xi(t, t.type, r.value), sc(e, t, r.children, n), t.child;
			case 9: return a = t.type._context, r = t.pendingProps.children, na(t), a = ra(a), r = r(a), t.flags |= 1, sc(e, t, r, n), t.child;
			case 14: return lc(e, t, t.type, t.pendingProps, n);
			case 15: return uc(e, t, t.type, t.pendingProps, n);
			case 19: return jc(e, t, n);
			case 31: return gc(e, t, n);
			case 22: return dc(e, t, n, t.pendingProps);
			case 24: return na(t), r = ra(la), e === null ? (a = ya(), a === null && (a = Gl, o = ua(), a.pooledCache = o, o.refCount++, o !== null && (a.pooledCacheLanes |= n), a = o), t.memoizedState = {
				parent: r,
				cache: a
			}, Va(t), Xi(t, la, a)) : ((e.lanes & n) !== 0 && (Ha(e, t), Ya(t, null, null, n), Ja()), a = e.memoizedState, o = t.memoizedState, a.parent === r ? (r = o.cache, Xi(t, la, r), r !== a.cache && $i(t, [la], n, !0)) : (a = {
				parent: r,
				cache: r
			}, t.memoizedState = a, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = a), Xi(t, la, r))), sc(e, t, t.pendingProps.children, n), t.child;
			case 29: throw t.pendingProps;
		}
		throw Error(i(156, t.tag));
	}
	function Ic(e) {
		e.flags |= 4;
	}
	function Lc(e, t, n, r, i) {
		if ((t = (e.mode & 32) != 0) && (t = !1), t) {
			if (e.flags |= 16777216, (i & 335544128) === i) if (e.stateNode.complete) e.flags |= 8192;
			else if (Mu()) e.flags |= 8192;
			else throw ka = Ta, Ca;
		} else e.flags &= -16777217;
	}
	function Rc(e, t) {
		if (t.type !== "stylesheet" || t.state.loading & 4) e.flags &= -16777217;
		else if (e.flags |= 16777216, !Qf(t)) if (Mu()) e.flags |= 8192;
		else throw ka = Ta, Ca;
	}
	function zc(e, t) {
		t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : Qe(), e.lanes |= t, iu |= t);
	}
	function Bc(e, t) {
		if (!Ii) switch (e.tailMode) {
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
	function Vc(e) {
		var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
		if (t) for (var i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 65011712, r |= i.flags & 65011712, i.return = e, i = i.sibling;
		else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
		return e.subtreeFlags |= r, e.childLanes = n, t;
	}
	function Hc(e, t, n) {
		var r = t.pendingProps;
		switch (Mi(t), t.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return Vc(t), null;
			case 1: return Vc(t), null;
			case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), Zi(la), ge(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (Ui(t) ? Ic(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, Gi())), Vc(t), null;
			case 26:
				var a = t.type, o = t.memoizedState;
				return e === null ? (Ic(t), o === null ? (Vc(t), Lc(t, a, null, r, n)) : (Vc(t), Rc(t, o))) : o ? o === e.memoizedState ? (Vc(t), t.flags &= -16777217) : (Ic(t), Vc(t), Rc(t, o)) : (e = e.memoizedProps, e !== r && Ic(t), Vc(t), Lc(t, a, e, r, n)), null;
			case 27:
				if (N(t), n = pe.current, a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && Ic(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return Vc(t), null;
					}
					e = de.current, Ui(t) ? Vi(t, e) : (e = Sf(a, r, n), t.stateNode = e, Ic(t));
				}
				return Vc(t), null;
			case 5:
				if (N(t), a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && Ic(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return Vc(t), null;
					}
					if (o = de.current, Ui(t)) Vi(t, o);
					else {
						var s = Xd(pe.current);
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
						o[ut] = t, o[dt] = r;
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
						a: switch (Wd(o, a, r), a) {
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
						r && Ic(t);
					}
				}
				return Vc(t), Lc(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== r && Ic(t);
				else {
					if (typeof r != "string" && t.stateNode === null) throw Error(i(166));
					if (e = pe.current, Ui(t)) {
						if (e = t.stateNode, n = t.memoizedProps, r = null, a = Pi, a !== null) switch (a.tag) {
							case 27:
							case 5: r = a.memoizedProps;
						}
						e[ut] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || Vd(e.nodeValue, n)), e || Bi(t, !0);
					} else e = Xd(e).createTextNode(r), e[ut] = t, t.stateNode = e;
				}
				return Vc(t), null;
			case 31:
				if (n = t.memoizedState, e === null || e.memoizedState !== null) {
					if (r = Ui(t), n !== null) {
						if (e === null) {
							if (!r) throw Error(i(318));
							if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(557));
							e[ut] = t;
						} else Wi(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						Vc(t), e = !1;
					} else n = Gi(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
					if (!e) return t.flags & 256 ? (lo(t), t) : (lo(t), null);
					if (t.flags & 128) throw Error(i(558));
				}
				return Vc(t), null;
			case 13:
				if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
					if (a = Ui(t), r !== null && r.dehydrated !== null) {
						if (e === null) {
							if (!a) throw Error(i(318));
							if (a = t.memoizedState, a = a === null ? null : a.dehydrated, !a) throw Error(i(317));
							a[ut] = t;
						} else Wi(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						Vc(t), a = !1;
					} else a = Gi(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), a = !0;
					if (!a) return t.flags & 256 ? (lo(t), t) : (lo(t), null);
				}
				return lo(t), t.flags & 128 ? (t.lanes = n, t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, a = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (a = r.alternate.memoizedState.cachePool.pool), o = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (o = r.memoizedState.cachePool.pool), o !== a && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), zc(t, t.updateQueue), Vc(t), null);
			case 4: return ge(), e === null && jd(t.stateNode.containerInfo), Vc(t), null;
			case 10: return Zi(t.type), Vc(t), null;
			case 19:
				if (j(uo), r = t.memoizedState, r === null) return Vc(t), null;
				if (a = (t.flags & 128) != 0, o = r.rendering, o === null) if (a) Bc(r, !1);
				else {
					if ($l !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
						if (o = fo(e), o !== null) {
							for (t.flags |= 128, Bc(r, !1), e = o.updateQueue, t.updateQueue = e, zc(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) fi(n, e), n = n.sibling;
							return M(uo, uo.current & 1 | 2), Ii && ki(t, r.treeForkCount), t.child;
						}
						e = e.sibling;
					}
					r.tail !== null && ke() > lu && (t.flags |= 128, a = !0, Bc(r, !1), t.lanes = 4194304);
				}
				else {
					if (!a) if (e = fo(o), e !== null) {
						if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, zc(t, e), Bc(r, !0), r.tail === null && r.tailMode === "hidden" && !o.alternate && !Ii) return Vc(t), null;
					} else 2 * ke() - r.renderingStartTime > lu && n !== 536870912 && (t.flags |= 128, a = !0, Bc(r, !1), t.lanes = 4194304);
					r.isBackwards ? (o.sibling = t.child, t.child = o) : (e = r.last, e === null ? t.child = o : e.sibling = o, r.last = o);
				}
				return r.tail === null ? (Vc(t), null) : (e = r.tail, r.rendering = e, r.tail = e.sibling, r.renderingStartTime = ke(), e.sibling = null, n = uo.current, M(uo, a ? n & 1 | 2 : n & 1), Ii && ki(t, r.treeForkCount), e);
			case 22:
			case 23: return lo(t), no(), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (Vc(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Vc(t), n = t.updateQueue, n !== null && zc(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && j(va), null;
			case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), Zi(la), Vc(t), null;
			case 25: return null;
			case 30: return null;
		}
		throw Error(i(156, t.tag));
	}
	function Uc(e, t) {
		switch (Mi(t), t.tag) {
			case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 3: return Zi(la), ge(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
			case 26:
			case 27:
			case 5: return N(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if (lo(t), t.alternate === null) throw Error(i(340));
					Wi();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 13:
				if (lo(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
					if (t.alternate === null) throw Error(i(340));
					Wi();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 19: return j(uo), null;
			case 4: return ge(), null;
			case 10: return Zi(t.type), null;
			case 22:
			case 23: return lo(t), no(), e !== null && j(va), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 24: return Zi(la), null;
			case 25: return null;
			default: return null;
		}
	}
	function Wc(e, t) {
		switch (Mi(t), t.tag) {
			case 3:
				Zi(la), ge();
				break;
			case 26:
			case 27:
			case 5:
				N(t);
				break;
			case 4:
				ge();
				break;
			case 31:
				t.memoizedState !== null && lo(t);
				break;
			case 13:
				lo(t);
				break;
			case 19:
				j(uo);
				break;
			case 10:
				Zi(t.type);
				break;
			case 22:
			case 23:
				lo(t), no(), e !== null && j(va);
				break;
			case 24: Zi(la);
		}
	}
	function Gc(e, t) {
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
			$u(t, t.return, e);
		}
	}
	function Kc(e, t, n) {
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
								$u(i, c, e);
							}
						}
					}
					r = r.next;
				} while (r !== a);
			}
		} catch (e) {
			$u(t, t.return, e);
		}
	}
	function qc(e) {
		var t = e.updateQueue;
		if (t !== null) {
			var n = e.stateNode;
			try {
				Za(t, n);
			} catch (t) {
				$u(e, e.return, t);
			}
		}
	}
	function Jc(e, t, n) {
		n.props = Ys(e.type, e.memoizedProps), n.state = e.memoizedState;
		try {
			n.componentWillUnmount();
		} catch (n) {
			$u(e, t, n);
		}
	}
	function Yc(e, t) {
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
			$u(e, t, n);
		}
	}
	function Xc(e, t) {
		var n = e.ref, r = e.refCleanup;
		if (n !== null) if (typeof r == "function") try {
			r();
		} catch (n) {
			$u(e, t, n);
		} finally {
			e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
		}
		else if (typeof n == "function") try {
			n(null);
		} catch (n) {
			$u(e, t, n);
		}
		else n.current = null;
	}
	function Zc(e) {
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
			$u(e, e.return, t);
		}
	}
	function Qc(e, t, n) {
		try {
			var r = e.stateNode;
			Gd(r, e.type, n, t), r[dt] = t;
		} catch (t) {
			$u(e, e.return, t);
		}
	}
	function $c(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && cf(e.type) || e.tag === 4;
	}
	function el(e) {
		a: for (;;) {
			for (; e.sibling === null;) {
				if (e.return === null || $c(e.return)) return null;
				e = e.return;
			}
			for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
				if (e.tag === 27 && cf(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue a;
				e.child.return = e, e = e.child;
			}
			if (!(e.flags & 2)) return e.stateNode;
		}
	}
	function tl(e, t, n) {
		var r = e.tag;
		if (r === 5 || r === 6) e = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(e, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(e), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = tn));
		else if (r !== 4 && (r === 27 && cf(e.type) && (n = e.stateNode, t = null), e = e.child, e !== null)) for (tl(e, t, n), e = e.sibling; e !== null;) tl(e, t, n), e = e.sibling;
	}
	function nl(e, t, n) {
		var r = e.tag;
		if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
		else if (r !== 4 && (r === 27 && cf(e.type) && (n = e.stateNode), e = e.child, e !== null)) for (nl(e, t, n), e = e.sibling; e !== null;) nl(e, t, n), e = e.sibling;
	}
	function rl(e) {
		var t = e.stateNode, n = e.memoizedProps;
		try {
			for (var r = e.type, i = t.attributes; i.length;) t.removeAttributeNode(i[0]);
			Wd(t, r, n), t[ut] = e, t[dt] = n;
		} catch (t) {
			$u(e, e.return, t);
		}
	}
	var il = !1, al = !1, ol = !1, sl = typeof WeakSet == "function" ? WeakSet : Set, cl = null;
	function ll(e, t) {
		if (e = e.containerInfo, Jd = hp, e = Or(e), kr(e)) {
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
		for (Yd = {
			focusedElem: e,
			selectionRange: n
		}, hp = !1, cl = t; cl !== null;) if (t = cl, e = t.child, t.subtreeFlags & 1028 && e !== null) e.return = t, cl = e;
		else for (; cl !== null;) {
			switch (t = cl, o = t.alternate, e = t.flags, t.tag) {
				case 0:
					if (e & 4 && (e = t.updateQueue, e = e === null ? null : e.events, e !== null)) for (n = 0; n < e.length; n++) a = e[n], a.ref.impl = a.nextImpl;
					break;
				case 11:
				case 15: break;
				case 1:
					if (e & 1024 && o !== null) {
						e = void 0, n = t, a = o.memoizedProps, o = o.memoizedState, r = n.stateNode;
						try {
							var h = Ys(n.type, a);
							e = r.getSnapshotBeforeUpdate(h, o), r.__reactInternalSnapshotBeforeUpdate = e;
						} catch (e) {
							$u(n, n.return, e);
						}
					}
					break;
				case 3:
					if (e & 1024) {
						if (e = t.stateNode.containerInfo, n = e.nodeType, n === 9) df(e);
						else if (n === 1) switch (e.nodeName) {
							case "HEAD":
							case "HTML":
							case "BODY":
								df(e);
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
				e.return = t.return, cl = e;
				break;
			}
			cl = t.return;
		}
	}
	function ul(e, t, n) {
		var r = n.flags;
		switch (n.tag) {
			case 0:
			case 11:
			case 15:
				Tl(e, n), r & 4 && Gc(5, n);
				break;
			case 1:
				if (Tl(e, n), r & 4) if (e = n.stateNode, t === null) try {
					e.componentDidMount();
				} catch (e) {
					$u(n, n.return, e);
				}
				else {
					var i = Ys(n.type, t.memoizedProps);
					t = t.memoizedState;
					try {
						e.componentDidUpdate(i, t, e.__reactInternalSnapshotBeforeUpdate);
					} catch (e) {
						$u(n, n.return, e);
					}
				}
				r & 64 && qc(n), r & 512 && Yc(n, n.return);
				break;
			case 3:
				if (Tl(e, n), r & 64 && (e = n.updateQueue, e !== null)) {
					if (t = null, n.child !== null) switch (n.child.tag) {
						case 27:
						case 5:
							t = n.child.stateNode;
							break;
						case 1: t = n.child.stateNode;
					}
					try {
						Za(e, t);
					} catch (e) {
						$u(n, n.return, e);
					}
				}
				break;
			case 27: t === null && r & 4 && rl(n);
			case 26:
			case 5:
				Tl(e, n), t === null && r & 4 && Zc(n), r & 512 && Yc(n, n.return);
				break;
			case 12:
				Tl(e, n);
				break;
			case 31:
				Tl(e, n), r & 4 && gl(e, n);
				break;
			case 13:
				Tl(e, n), r & 4 && _l(e, n), r & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = rd.bind(null, n), _f(e, n))));
				break;
			case 22:
				if (r = n.memoizedState !== null || il, !r) {
					t = t !== null && t.memoizedState !== null || al, i = il;
					var a = al;
					il = r, (al = t) && !a ? Dl(e, n, (n.subtreeFlags & 8772) != 0) : Tl(e, n), il = i, al = a;
				}
				break;
			case 30: break;
			default: Tl(e, n);
		}
	}
	function dl(e) {
		var t = e.alternate;
		t !== null && (e.alternate = null, dl(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && vt(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
	}
	var fl = null, pl = !1;
	function ml(e, t, n) {
		for (n = n.child; n !== null;) hl(e, t, n), n = n.sibling;
	}
	function hl(e, t, n) {
		if (ze && typeof ze.onCommitFiberUnmount == "function") try {
			ze.onCommitFiberUnmount(Re, n);
		} catch {}
		switch (n.tag) {
			case 26:
				al || Xc(n, t), ml(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && (n = n.stateNode, n.parentNode.removeChild(n));
				break;
			case 27:
				al || Xc(n, t);
				var r = fl, i = pl;
				cf(n.type) && (fl = n.stateNode, pl = !1), ml(e, t, n), Cf(n.stateNode), fl = r, pl = i;
				break;
			case 5: al || Xc(n, t);
			case 6:
				if (r = fl, i = pl, fl = null, ml(e, t, n), fl = r, pl = i, fl !== null) if (pl) try {
					(fl.nodeType === 9 ? fl.body : fl.nodeName === "HTML" ? fl.ownerDocument.body : fl).removeChild(n.stateNode);
				} catch (e) {
					$u(n, t, e);
				}
				else try {
					fl.removeChild(n.stateNode);
				} catch (e) {
					$u(n, t, e);
				}
				break;
			case 18:
				fl !== null && (pl ? (e = fl, lf(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), Vp(e)) : lf(fl, n.stateNode));
				break;
			case 4:
				r = fl, i = pl, fl = n.stateNode.containerInfo, pl = !0, ml(e, t, n), fl = r, pl = i;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				Kc(2, n, t), al || Kc(4, n, t), ml(e, t, n);
				break;
			case 1:
				al || (Xc(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function" && Jc(n, t, r)), ml(e, t, n);
				break;
			case 21:
				ml(e, t, n);
				break;
			case 22:
				al = (r = al) || n.memoizedState !== null, ml(e, t, n), al = r;
				break;
			default: ml(e, t, n);
		}
	}
	function gl(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
			e = e.dehydrated;
			try {
				Vp(e);
			} catch (e) {
				$u(t, t.return, e);
			}
		}
	}
	function _l(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
			Vp(e);
		} catch (e) {
			$u(t, t.return, e);
		}
	}
	function vl(e) {
		switch (e.tag) {
			case 31:
			case 13:
			case 19:
				var t = e.stateNode;
				return t === null && (t = e.stateNode = new sl()), t;
			case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new sl()), t;
			default: throw Error(i(435, e.tag));
		}
	}
	function yl(e, t) {
		var n = vl(e);
		t.forEach(function(t) {
			if (!n.has(t)) {
				n.add(t);
				var r = id.bind(null, e, t);
				t.then(r, r);
			}
		});
	}
	function bl(e, t) {
		var n = t.deletions;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var a = n[r], o = e, s = t, c = s;
			a: for (; c !== null;) {
				switch (c.tag) {
					case 27:
						if (cf(c.type)) {
							fl = c.stateNode, pl = !1;
							break a;
						}
						break;
					case 5:
						fl = c.stateNode, pl = !1;
						break a;
					case 3:
					case 4:
						fl = c.stateNode.containerInfo, pl = !0;
						break a;
				}
				c = c.return;
			}
			if (fl === null) throw Error(i(160));
			hl(o, s, a), fl = null, pl = !1, o = a.alternate, o !== null && (o.return = null), a.return = null;
		}
		if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) Sl(t, e), t = t.sibling;
	}
	var xl = null;
	function Sl(e, t) {
		var n = e.alternate, r = e.flags;
		switch (e.tag) {
			case 0:
			case 11:
			case 14:
			case 15:
				bl(t, e), Cl(e), r & 4 && (Kc(3, e, e.return), Gc(3, e), Kc(5, e, e.return));
				break;
			case 1:
				bl(t, e), Cl(e), r & 512 && (al || n === null || Xc(n, n.return)), r & 64 && il && (e = e.updateQueue, e !== null && (r = e.callbacks, r !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? r : n.concat(r))));
				break;
			case 26:
				var a = xl;
				if (bl(t, e), Cl(e), r & 512 && (al || n === null || Xc(n, n.return)), r & 4) {
					var o = n === null ? null : n.memoizedState;
					if (r = e.memoizedState, n === null) if (r === null) if (e.stateNode === null) {
						a: {
							r = e.type, n = e.memoizedProps, a = a.ownerDocument || a;
							b: switch (r) {
								case "title":
									o = a.getElementsByTagName("title")[0], (!o || o[_t] || o[ut] || o.namespaceURI === "http://www.w3.org/2000/svg" || o.hasAttribute("itemprop")) && (o = a.createElement(r), a.head.insertBefore(o, a.querySelector("head > title"))), Wd(o, r, n), o[ut] = e, Ct(o), r = o;
									break a;
								case "link":
									var s = Yf("link", "href", a).get(r + (n.href || ""));
									if (s) {
										for (var c = 0; c < s.length; c++) if (o = s[c], o.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && o.getAttribute("rel") === (n.rel == null ? null : n.rel) && o.getAttribute("title") === (n.title == null ? null : n.title) && o.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
											s.splice(c, 1);
											break b;
										}
									}
									o = a.createElement(r), Wd(o, r, n), a.head.appendChild(o);
									break;
								case "meta":
									if (s = Yf("meta", "content", a).get(r + (n.content || ""))) {
										for (c = 0; c < s.length; c++) if (o = s[c], o.getAttribute("content") === (n.content == null ? null : "" + n.content) && o.getAttribute("name") === (n.name == null ? null : n.name) && o.getAttribute("property") === (n.property == null ? null : n.property) && o.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && o.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
											s.splice(c, 1);
											break b;
										}
									}
									o = a.createElement(r), Wd(o, r, n), a.head.appendChild(o);
									break;
								default: throw Error(i(468, r));
							}
							o[ut] = e, Ct(o), r = o;
						}
						e.stateNode = r;
					} else Xf(a, e.type, e.stateNode);
					else e.stateNode = Wf(a, r, e.memoizedProps);
					else o === r ? r === null && e.stateNode !== null && Qc(e, e.memoizedProps, n.memoizedProps) : (o === null ? n.stateNode !== null && (n = n.stateNode, n.parentNode.removeChild(n)) : o.count--, r === null ? Xf(a, e.type, e.stateNode) : Wf(a, r, e.memoizedProps));
				}
				break;
			case 27:
				bl(t, e), Cl(e), r & 512 && (al || n === null || Xc(n, n.return)), n !== null && r & 4 && Qc(e, e.memoizedProps, n.memoizedProps);
				break;
			case 5:
				if (bl(t, e), Cl(e), r & 512 && (al || n === null || Xc(n, n.return)), e.flags & 32) {
					a = e.stateNode;
					try {
						Jt(a, "");
					} catch (t) {
						$u(e, e.return, t);
					}
				}
				r & 4 && e.stateNode != null && (a = e.memoizedProps, Qc(e, a, n === null ? a : n.memoizedProps)), r & 1024 && (ol = !0);
				break;
			case 6:
				if (bl(t, e), Cl(e), r & 4) {
					if (e.stateNode === null) throw Error(i(162));
					r = e.memoizedProps, n = e.stateNode;
					try {
						n.nodeValue = r;
					} catch (t) {
						$u(e, e.return, t);
					}
				}
				break;
			case 3:
				if (Jf = null, a = xl, xl = W(t.containerInfo), bl(t, e), xl = a, Cl(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
					Vp(t.containerInfo);
				} catch (t) {
					$u(e, e.return, t);
				}
				ol && (ol = !1, wl(e));
				break;
			case 4:
				r = xl, xl = W(e.stateNode.containerInfo), bl(t, e), Cl(e), xl = r;
				break;
			case 12:
				bl(t, e), Cl(e);
				break;
			case 31:
				bl(t, e), Cl(e), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, yl(e, r)));
				break;
			case 13:
				bl(t, e), Cl(e), e.child.flags & 8192 && e.memoizedState !== null != (n !== null && n.memoizedState !== null) && (su = ke()), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, yl(e, r)));
				break;
			case 22:
				a = e.memoizedState !== null;
				var l = n !== null && n.memoizedState !== null, u = il, d = al;
				if (il = u || a, al = d || l, bl(t, e), al = d, il = u, Cl(e), r & 8192) a: for (t = e.stateNode, t._visibility = a ? t._visibility & -2 : t._visibility | 1, a && (n === null || l || il || al || El(e)), n = null, t = e;;) {
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
								$u(l, l.return, e);
							}
						}
					} else if (t.tag === 6) {
						if (n === null) {
							l = t;
							try {
								l.stateNode.nodeValue = a ? "" : l.memoizedProps;
							} catch (e) {
								$u(l, l.return, e);
							}
						}
					} else if (t.tag === 18) {
						if (n === null) {
							l = t;
							try {
								var m = l.stateNode;
								a ? uf(m, !0) : uf(l.stateNode, !1);
							} catch (e) {
								$u(l, l.return, e);
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
				r & 4 && (r = e.updateQueue, r !== null && (n = r.retryQueue, n !== null && (r.retryQueue = null, yl(e, n))));
				break;
			case 19:
				bl(t, e), Cl(e), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, yl(e, r)));
				break;
			case 30: break;
			case 21: break;
			default: bl(t, e), Cl(e);
		}
	}
	function Cl(e) {
		var t = e.flags;
		if (t & 2) {
			try {
				for (var n, r = e.return; r !== null;) {
					if ($c(r)) {
						n = r;
						break;
					}
					r = r.return;
				}
				if (n == null) throw Error(i(160));
				switch (n.tag) {
					case 27:
						var a = n.stateNode;
						nl(e, el(e), a);
						break;
					case 5:
						var o = n.stateNode;
						n.flags & 32 && (Jt(o, ""), n.flags &= -33), nl(e, el(e), o);
						break;
					case 3:
					case 4:
						var s = n.stateNode.containerInfo;
						tl(e, el(e), s);
						break;
					default: throw Error(i(161));
				}
			} catch (t) {
				$u(e, e.return, t);
			}
			e.flags &= -3;
		}
		t & 4096 && (e.flags &= -4097);
	}
	function wl(e) {
		if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
			var t = e;
			wl(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
		}
	}
	function Tl(e, t) {
		if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) ul(e, t.alternate, t), t = t.sibling;
	}
	function El(e) {
		for (e = e.child; e !== null;) {
			var t = e;
			switch (t.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					Kc(4, t, t.return), El(t);
					break;
				case 1:
					Xc(t, t.return);
					var n = t.stateNode;
					typeof n.componentWillUnmount == "function" && Jc(t, t.return, n), El(t);
					break;
				case 27: Cf(t.stateNode);
				case 26:
				case 5:
					Xc(t, t.return), El(t);
					break;
				case 22:
					t.memoizedState === null && El(t);
					break;
				case 30:
					El(t);
					break;
				default: El(t);
			}
			e = e.sibling;
		}
	}
	function Dl(e, t, n) {
		for (n &&= (t.subtreeFlags & 8772) != 0, t = t.child; t !== null;) {
			var r = t.alternate, i = e, a = t, o = a.flags;
			switch (a.tag) {
				case 0:
				case 11:
				case 15:
					Dl(i, a, n), Gc(4, a);
					break;
				case 1:
					if (Dl(i, a, n), r = a, i = r.stateNode, typeof i.componentDidMount == "function") try {
						i.componentDidMount();
					} catch (e) {
						$u(r, r.return, e);
					}
					if (r = a, i = r.updateQueue, i !== null) {
						var s = r.stateNode;
						try {
							var c = i.shared.hiddenCallbacks;
							if (c !== null) for (i.shared.hiddenCallbacks = null, i = 0; i < c.length; i++) Xa(c[i], s);
						} catch (e) {
							$u(r, r.return, e);
						}
					}
					n && o & 64 && qc(a), Yc(a, a.return);
					break;
				case 27: rl(a);
				case 26:
				case 5:
					Dl(i, a, n), n && r === null && o & 4 && Zc(a), Yc(a, a.return);
					break;
				case 12:
					Dl(i, a, n);
					break;
				case 31:
					Dl(i, a, n), n && o & 4 && gl(i, a);
					break;
				case 13:
					Dl(i, a, n), n && o & 4 && _l(i, a);
					break;
				case 22:
					a.memoizedState === null && Dl(i, a, n), Yc(a, a.return);
					break;
				case 30: break;
				default: Dl(i, a, n);
			}
			t = t.sibling;
		}
	}
	function Ol(e, t) {
		var n = null;
		e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && da(n));
	}
	function kl(e, t) {
		e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && da(e));
	}
	function Al(e, t, n, r) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) jl(e, t, n, r), t = t.sibling;
	}
	function jl(e, t, n, r) {
		var i = t.flags;
		switch (t.tag) {
			case 0:
			case 11:
			case 15:
				Al(e, t, n, r), i & 2048 && Gc(9, t);
				break;
			case 1:
				Al(e, t, n, r);
				break;
			case 3:
				Al(e, t, n, r), i & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && da(e)));
				break;
			case 12:
				if (i & 2048) {
					Al(e, t, n, r), e = t.stateNode;
					try {
						var a = t.memoizedProps, o = a.id, s = a.onPostCommit;
						typeof s == "function" && s(o, t.alternate === null ? "mount" : "update", e.passiveEffectDuration, -0);
					} catch (e) {
						$u(t, t.return, e);
					}
				} else Al(e, t, n, r);
				break;
			case 31:
				Al(e, t, n, r);
				break;
			case 13:
				Al(e, t, n, r);
				break;
			case 23: break;
			case 22:
				a = t.stateNode, o = t.alternate, t.memoizedState === null ? a._visibility & 2 ? Al(e, t, n, r) : (a._visibility |= 2, Ml(e, t, n, r, (t.subtreeFlags & 10256) != 0 || !1)) : a._visibility & 2 ? Al(e, t, n, r) : Nl(e, t), i & 2048 && Ol(o, t);
				break;
			case 24:
				Al(e, t, n, r), i & 2048 && kl(t.alternate, t);
				break;
			default: Al(e, t, n, r);
		}
	}
	function Ml(e, t, n, r, i) {
		for (i &&= (t.subtreeFlags & 10256) != 0 || !1, t = t.child; t !== null;) {
			var a = e, o = t, s = n, c = r, l = o.flags;
			switch (o.tag) {
				case 0:
				case 11:
				case 15:
					Ml(a, o, s, c, i), Gc(8, o);
					break;
				case 23: break;
				case 22:
					var u = o.stateNode;
					o.memoizedState === null ? (u._visibility |= 2, Ml(a, o, s, c, i)) : u._visibility & 2 ? Ml(a, o, s, c, i) : Nl(a, o), i && l & 2048 && Ol(o.alternate, o);
					break;
				case 24:
					Ml(a, o, s, c, i), i && l & 2048 && kl(o.alternate, o);
					break;
				default: Ml(a, o, s, c, i);
			}
			t = t.sibling;
		}
	}
	function Nl(e, t) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) {
			var n = e, r = t, i = r.flags;
			switch (r.tag) {
				case 22:
					Nl(n, r), i & 2048 && Ol(r.alternate, r);
					break;
				case 24:
					Nl(n, r), i & 2048 && kl(r.alternate, r);
					break;
				default: Nl(n, r);
			}
			t = t.sibling;
		}
	}
	var Pl = 8192;
	function Fl(e, t, n) {
		if (e.subtreeFlags & Pl) for (e = e.child; e !== null;) Il(e, t, n), e = e.sibling;
	}
	function Il(e, t, n) {
		switch (e.tag) {
			case 26:
				Fl(e, t, n), e.flags & Pl && e.memoizedState !== null && $f(n, xl, e.memoizedState, e.memoizedProps);
				break;
			case 5:
				Fl(e, t, n);
				break;
			case 3:
			case 4:
				var r = xl;
				xl = W(e.stateNode.containerInfo), Fl(e, t, n), xl = r;
				break;
			case 22:
				e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = Pl, Pl = 16777216, Fl(e, t, n), Pl = r) : Fl(e, t, n));
				break;
			default: Fl(e, t, n);
		}
	}
	function Ll(e) {
		var t = e.alternate;
		if (t !== null && (e = t.child, e !== null)) {
			t.child = null;
			do
				t = e.sibling, e.sibling = null, e = t;
			while (e !== null);
		}
	}
	function Rl(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				cl = r, Vl(r, e);
			}
			Ll(e);
		}
		if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) zl(e), e = e.sibling;
	}
	function zl(e) {
		switch (e.tag) {
			case 0:
			case 11:
			case 15:
				Rl(e), e.flags & 2048 && Kc(9, e, e.return);
				break;
			case 3:
				Rl(e);
				break;
			case 12:
				Rl(e);
				break;
			case 22:
				var t = e.stateNode;
				e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Bl(e)) : Rl(e);
				break;
			default: Rl(e);
		}
	}
	function Bl(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				cl = r, Vl(r, e);
			}
			Ll(e);
		}
		for (e = e.child; e !== null;) {
			switch (t = e, t.tag) {
				case 0:
				case 11:
				case 15:
					Kc(8, t, t.return), Bl(t);
					break;
				case 22:
					n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, Bl(t));
					break;
				default: Bl(t);
			}
			e = e.sibling;
		}
	}
	function Vl(e, t) {
		for (; cl !== null;) {
			var n = cl;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					Kc(8, n, t);
					break;
				case 23:
				case 22:
					if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
						var r = n.memoizedState.cachePool.pool;
						r != null && r.refCount++;
					}
					break;
				case 24: da(n.memoizedState.cache);
			}
			if (r = n.child, r !== null) r.return = n, cl = r;
			else a: for (n = e; cl !== null;) {
				r = cl;
				var i = r.sibling, a = r.return;
				if (dl(r), r === n) {
					cl = null;
					break a;
				}
				if (i !== null) {
					i.return = a, cl = i;
					break a;
				}
				cl = a;
			}
		}
	}
	var Hl = {
		getCacheForType: function(e) {
			var t = ra(la), n = t.data.get(e);
			return n === void 0 && (n = e(), t.data.set(e, n)), n;
		},
		cacheSignal: function() {
			return ra(la).controller.signal;
		}
	}, Ul = typeof WeakMap == "function" ? WeakMap : Map, Wl = 0, Gl = null, V = null, Kl = 0, ql = 0, Jl = null, Yl = !1, Xl = !1, Zl = !1, Ql = 0, $l = 0, eu = 0, tu = 0, nu = 0, ru = 0, iu = 0, H = null, au = null, ou = !1, su = 0, cu = 0, lu = Infinity, uu = null, du = null, fu = 0, pu = null, mu = null, hu = 0, gu = 0, _u = null, vu = null, yu = 0, bu = null;
	function xu() {
		return Wl & 2 && Kl !== 0 ? Kl & -Kl : k.T === null ? st() : bd();
	}
	function Su() {
		if (ru === 0) if (!(Kl & 536870912) || Ii) {
			var e = Ke;
			Ke <<= 1, !(Ke & 3932160) && (Ke = 262144), ru = e;
		} else ru = 536870912;
		return e = ro.current, e !== null && (e.flags |= 32), ru;
	}
	function Cu(e, t, n) {
		(e === Gl && (ql === 2 || ql === 9) || e.cancelPendingCommit !== null) && (Au(e, 0), Du(e, Kl, ru, !1)), et(e, n), (!(Wl & 2) || e !== Gl) && (e === Gl && (!(Wl & 2) && (tu |= n), $l === 4 && Du(e, Kl, ru, !1)), fd(e));
	}
	function wu(e, t, n) {
		if (Wl & 6) throw Error(i(327));
		var r = !n && (t & 127) == 0 && (t & e.expiredLanes) === 0 || Xe(e, t), a = r ? Ru(e, t) : Iu(e, t, !0), o = r;
		do {
			if (a === 0) {
				Xl && !r && Du(e, t, 0, !1);
				break;
			} else {
				if (n = e.current.alternate, o && !Eu(n)) {
					a = Iu(e, t, !1), o = !1;
					continue;
				}
				if (a === 2) {
					if (o = t, e.errorRecoveryDisabledLanes & o) var s = 0;
					else s = e.pendingLanes & -536870913, s = s === 0 ? s & 536870912 ? 536870912 : 0 : s;
					if (s !== 0) {
						t = s;
						a: {
							var c = e;
							a = H;
							var l = c.current.memoizedState.isDehydrated;
							if (l && (Au(c, s).flags |= 256), s = Iu(c, s, !1), s !== 2) {
								if (Zl && !l) {
									c.errorRecoveryDisabledLanes |= o, tu |= o, a = 4;
									break a;
								}
								o = au, au = a, o !== null && (au === null ? au = o : au.push.apply(au, o));
							}
							a = s;
						}
						if (o = !1, a !== 2) continue;
					}
				}
				if (a === 1) {
					Au(e, 0), Du(e, t, 0, !0);
					break;
				}
				a: {
					switch (r = e, o = a, o) {
						case 0:
						case 1: throw Error(i(345));
						case 4: if ((t & 4194048) !== t) break;
						case 6:
							Du(r, t, ru, !Yl);
							break a;
						case 2:
							au = null;
							break;
						case 3:
						case 5: break;
						default: throw Error(i(329));
					}
					if ((t & 62914560) === t && (a = su + 300 - ke(), 10 < a)) {
						if (Du(r, t, ru, !Yl), Ye(r, 0, !0) !== 0) break a;
						hu = t, r.timeoutHandle = nf(Tu.bind(null, r, n, au, uu, ou, t, ru, tu, iu, Yl, o, "Throttled", -0, 0), a);
						break a;
					}
					Tu(r, n, au, uu, ou, t, ru, tu, iu, Yl, o, null, -0, 0);
				}
			}
			break;
		} while (1);
		fd(e);
	}
	function Tu(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
		if (e.timeoutHandle = -1, d = t.subtreeFlags, d & 8192 || (d & 16785408) == 16785408) {
			d = {
				stylesheets: null,
				count: 0,
				imgCount: 0,
				imgBytes: 0,
				suspenseyImages: [],
				waitingForImages: !0,
				waitingForViewTransition: !1,
				unsuspend: tn
			}, Il(t, a, d);
			var m = (a & 62914560) === a ? su - ke() : (a & 4194048) === a ? cu - ke() : 0;
			if (m = tp(d, m), m !== null) {
				hu = a, e.cancelPendingCommit = m(Gu.bind(null, e, t, a, n, r, i, o, s, c, u, d, null, f, p)), Du(e, a, o, !l);
				return;
			}
		}
		Gu(e, t, a, n, r, i, o, s, c);
	}
	function Eu(e) {
		for (var t = e;;) {
			var n = t.tag;
			if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null))) for (var r = 0; r < n.length; r++) {
				var i = n[r], a = i.getSnapshot;
				i = i.value;
				try {
					if (!Cr(a(), i)) return !1;
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
	function Du(e, t, n, r) {
		t &= ~nu, t &= ~tu, e.suspendedLanes |= t, e.pingedLanes &= ~t, r && (e.warmLanes |= t), r = e.expirationTimes;
		for (var i = t; 0 < i;) {
			var a = 31 - Ve(i), o = 1 << a;
			r[a] = -1, i &= ~o;
		}
		n !== 0 && nt(e, n, t);
	}
	function Ou() {
		return Wl & 6 ? !0 : (pd(0, !1), !1);
	}
	function ku() {
		if (V !== null) {
			if (ql === 0) var e = V.return;
			else e = V, Yi = Ji = null, jo(e), Ma = null, Na = 0, e = V;
			for (; e !== null;) Wc(e.alternate, e), e = e.return;
			V = null;
		}
	}
	function Au(e, t) {
		var n = e.timeoutHandle;
		n !== -1 && (e.timeoutHandle = -1, rf(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), hu = 0, ku(), Gl = e, V = n = di(e.current, null), Kl = t, ql = 0, Jl = null, Yl = !1, Xl = Xe(e, t), Zl = !1, iu = ru = nu = tu = eu = $l = 0, au = H = null, ou = !1, t & 8 && (t |= t & 32);
		var r = e.entangledLanes;
		if (r !== 0) for (e = e.entanglements, r &= t; 0 < r;) {
			var i = 31 - Ve(r), a = 1 << i;
			t |= e[i], r &= ~a;
		}
		return Ql = t, ti(), n;
	}
	function ju(e, t) {
		B = null, k.H = Vs, t === Sa || t === wa ? (t = Aa(), ql = 3) : t === Ca ? (t = Aa(), ql = 4) : ql = t === ac ? 8 : typeof t == "object" && t && typeof t.then == "function" ? 6 : 1, Jl = t, V === null && ($l = 1, $s(e, yi(t, e.current)));
	}
	function Mu() {
		var e = ro.current;
		return e === null ? !0 : (Kl & 4194048) === Kl ? io === null : (Kl & 62914560) === Kl || Kl & 536870912 ? e === io : !1;
	}
	function Nu() {
		var e = k.H;
		return k.H = Vs, e === null ? Vs : e;
	}
	function Pu() {
		var e = k.A;
		return k.A = Hl, e;
	}
	function Fu() {
		$l = 4, Yl || (Kl & 4194048) !== Kl && ro.current !== null || (Xl = !0), !(eu & 134217727) && !(tu & 134217727) || Gl === null || Du(Gl, Kl, ru, !1);
	}
	function Iu(e, t, n) {
		var r = Wl;
		Wl |= 2;
		var i = Nu(), a = Pu();
		(Gl !== e || Kl !== t) && (uu = null, Au(e, t)), t = !1;
		var o = $l;
		a: do
			try {
				if (ql !== 0 && V !== null) {
					var s = V, c = Jl;
					switch (ql) {
						case 8:
							ku(), o = 6;
							break a;
						case 3:
						case 2:
						case 9:
						case 6:
							ro.current === null && (t = !0);
							var l = ql;
							if (ql = 0, Jl = null, Hu(e, s, c, l), n && Xl) {
								o = 0;
								break a;
							}
							break;
						default: l = ql, ql = 0, Jl = null, Hu(e, s, c, l);
					}
				}
				Lu(), o = $l;
				break;
			} catch (t) {
				ju(e, t);
			}
		while (1);
		return t && e.shellSuspendCounter++, Yi = Ji = null, Wl = r, k.H = i, k.A = a, V === null && (Gl = null, Kl = 0, ti()), o;
	}
	function Lu() {
		for (; V !== null;) Bu(V);
	}
	function Ru(e, t) {
		var n = Wl;
		Wl |= 2;
		var r = Nu(), a = Pu();
		Gl !== e || Kl !== t ? (uu = null, lu = ke() + 500, Au(e, t)) : Xl = Xe(e, t);
		a: do
			try {
				if (ql !== 0 && V !== null) {
					t = V;
					var o = Jl;
					b: switch (ql) {
						case 1:
							ql = 0, Jl = null, Hu(e, t, o, 1);
							break;
						case 2:
						case 9:
							if (Ea(o)) {
								ql = 0, Jl = null, Vu(t);
								break;
							}
							t = function() {
								ql !== 2 && ql !== 9 || Gl !== e || (ql = 7), fd(e);
							}, o.then(t, t);
							break a;
						case 3:
							ql = 7;
							break a;
						case 4:
							ql = 5;
							break a;
						case 7:
							Ea(o) ? (ql = 0, Jl = null, Vu(t)) : (ql = 0, Jl = null, Hu(e, t, o, 7));
							break;
						case 5:
							var s = null;
							switch (V.tag) {
								case 26: s = V.memoizedState;
								case 5:
								case 27:
									var c = V;
									if (s ? Qf(s) : c.stateNode.complete) {
										ql = 0, Jl = null;
										var l = c.sibling;
										if (l !== null) V = l;
										else {
											var u = c.return;
											u === null ? V = null : (V = u, Uu(u));
										}
										break b;
									}
							}
							ql = 0, Jl = null, Hu(e, t, o, 5);
							break;
						case 6:
							ql = 0, Jl = null, Hu(e, t, o, 6);
							break;
						case 8:
							ku(), $l = 6;
							break a;
						default: throw Error(i(462));
					}
				}
				zu();
				break;
			} catch (t) {
				ju(e, t);
			}
		while (1);
		return Yi = Ji = null, k.H = r, k.A = a, Wl = n, V === null ? (Gl = null, Kl = 0, ti(), $l) : 0;
	}
	function zu() {
		for (; V !== null && !De();) Bu(V);
	}
	function Bu(e) {
		var t = Fc(e.alternate, e, Ql);
		e.memoizedProps = e.pendingProps, t === null ? Uu(e) : V = t;
	}
	function Vu(e) {
		var t = e, n = t.alternate;
		switch (t.tag) {
			case 15:
			case 0:
				t = yc(n, t, t.pendingProps, t.type, void 0, Kl);
				break;
			case 11:
				t = yc(n, t, t.pendingProps, t.type.render, t.ref, Kl);
				break;
			case 5: jo(t);
			default: Wc(n, t), t = V = fi(t, Ql), t = Fc(n, t, Ql);
		}
		e.memoizedProps = e.pendingProps, t === null ? Uu(e) : V = t;
	}
	function Hu(e, t, n, r) {
		Yi = Ji = null, jo(t), Ma = null, Na = 0;
		var i = t.return;
		try {
			if (ic(e, i, t, n, Kl)) {
				$l = 1, $s(e, yi(n, e.current)), V = null;
				return;
			}
		} catch (t) {
			if (i !== null) throw V = i, t;
			$l = 1, $s(e, yi(n, e.current)), V = null;
			return;
		}
		t.flags & 32768 ? (Ii || r === 1 ? e = !0 : Xl || Kl & 536870912 ? e = !1 : (Yl = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = ro.current, r !== null && r.tag === 13 && (r.flags |= 16384))), Wu(t, e)) : Uu(t);
	}
	function Uu(e) {
		var t = e;
		do {
			if (t.flags & 32768) {
				Wu(t, Yl);
				return;
			}
			e = t.return;
			var n = Hc(t.alternate, t, Ql);
			if (n !== null) {
				V = n;
				return;
			}
			if (t = t.sibling, t !== null) {
				V = t;
				return;
			}
			V = t = e;
		} while (t !== null);
		$l === 0 && ($l = 5);
	}
	function Wu(e, t) {
		do {
			var n = Uc(e.alternate, e);
			if (n !== null) {
				n.flags &= 32767, V = n;
				return;
			}
			if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
				V = e;
				return;
			}
			V = e = n;
		} while (e !== null);
		$l = 6, V = null;
	}
	function Gu(e, t, n, r, a, o, s, c, l) {
		e.cancelPendingCommit = null;
		do
			Xu();
		while (fu !== 0);
		if (Wl & 6) throw Error(i(327));
		if (t !== null) {
			if (t === e.current) throw Error(i(177));
			if (o = t.lanes | t.childLanes, o |= ei, tt(e, n, o, s, c, l), e === Gl && (V = Gl = null, Kl = 0), mu = t, pu = e, hu = n, gu = o, _u = a, vu = r, t.subtreeFlags & 10256 || t.flags & 10256 ? (e.callbackNode = null, e.callbackPriority = 0, ad(Ne, function() {
				return Zu(), null;
			})) : (e.callbackNode = null, e.callbackPriority = 0), r = (t.flags & 13878) != 0, t.subtreeFlags & 13878 || r) {
				r = k.T, k.T = null, a = A.p, A.p = 2, s = Wl, Wl |= 4;
				try {
					ll(e, t, n);
				} finally {
					Wl = s, A.p = a, k.T = r;
				}
			}
			fu = 1, Ku(), qu(), Ju();
		}
	}
	function Ku() {
		if (fu === 1) {
			fu = 0;
			var e = pu, t = mu, n = (t.flags & 13878) != 0;
			if (t.subtreeFlags & 13878 || n) {
				n = k.T, k.T = null;
				var r = A.p;
				A.p = 2;
				var i = Wl;
				Wl |= 4;
				try {
					Sl(t, e);
					var a = Yd, o = Or(e.containerInfo), s = a.focusedElem, c = a.selectionRange;
					if (o !== s && s && s.ownerDocument && Dr(s.ownerDocument.documentElement, s)) {
						if (c !== null && kr(s)) {
							var l = c.start, u = c.end;
							if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
							else {
								var d = s.ownerDocument || document, f = d && d.defaultView || window;
								if (f.getSelection) {
									var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
									!p.extend && h > g && (o = g, g = h, h = o);
									var _ = Er(s, h), v = Er(s, g);
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
					hp = !!Jd, Yd = Jd = null;
				} finally {
					Wl = i, A.p = r, k.T = n;
				}
			}
			e.current = t, fu = 2;
		}
	}
	function qu() {
		if (fu === 2) {
			fu = 0;
			var e = pu, t = mu, n = (t.flags & 8772) != 0;
			if (t.subtreeFlags & 8772 || n) {
				n = k.T, k.T = null;
				var r = A.p;
				A.p = 2;
				var i = Wl;
				Wl |= 4;
				try {
					ul(e, t.alternate, t);
				} finally {
					Wl = i, A.p = r, k.T = n;
				}
			}
			fu = 3;
		}
	}
	function Ju() {
		if (fu === 4 || fu === 3) {
			fu = 0, Oe();
			var e = pu, t = mu, n = hu, r = vu;
			t.subtreeFlags & 10256 || t.flags & 10256 ? fu = 5 : (fu = 0, mu = pu = null, Yu(e, e.pendingLanes));
			var i = e.pendingLanes;
			if (i === 0 && (du = null), ot(n), t = t.stateNode, ze && typeof ze.onCommitFiberRoot == "function") try {
				ze.onCommitFiberRoot(Re, t, void 0, (t.current.flags & 128) == 128);
			} catch {}
			if (r !== null) {
				t = k.T, i = A.p, A.p = 2, k.T = null;
				try {
					for (var a = e.onRecoverableError, o = 0; o < r.length; o++) {
						var s = r[o];
						a(s.value, { componentStack: s.stack });
					}
				} finally {
					k.T = t, A.p = i;
				}
			}
			hu & 3 && Xu(), fd(e), i = e.pendingLanes, n & 261930 && i & 42 ? e === bu ? yu++ : (yu = 0, bu = e) : yu = 0, pd(0, !1);
		}
	}
	function Yu(e, t) {
		(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, da(t)));
	}
	function Xu() {
		return Ku(), qu(), Ju(), Zu();
	}
	function Zu() {
		if (fu !== 5) return !1;
		var e = pu, t = gu;
		gu = 0;
		var n = ot(hu), r = k.T, a = A.p;
		try {
			A.p = 32 > n ? 32 : n, k.T = null, n = _u, _u = null;
			var o = pu, s = hu;
			if (fu = 0, mu = pu = null, hu = 0, Wl & 6) throw Error(i(331));
			var c = Wl;
			if (Wl |= 4, zl(o.current), jl(o, o.current, s, n), Wl = c, pd(0, !1), ze && typeof ze.onPostCommitFiberRoot == "function") try {
				ze.onPostCommitFiberRoot(Re, o);
			} catch {}
			return !0;
		} finally {
			A.p = a, k.T = r, Yu(e, t);
		}
	}
	function Qu(e, t, n) {
		t = yi(n, t), t = tc(e.stateNode, t, 2), e = Wa(e, t, 2), e !== null && (et(e, 2), fd(e));
	}
	function $u(e, t, n) {
		if (e.tag === 3) Qu(e, e, n);
		else for (; t !== null;) {
			if (t.tag === 3) {
				Qu(t, e, n);
				break;
			} else if (t.tag === 1) {
				var r = t.stateNode;
				if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (du === null || !du.has(r))) {
					e = yi(n, e), n = nc(2), r = Wa(t, n, 2), r !== null && (rc(n, r, t, e), et(r, 2), fd(r));
					break;
				}
			}
			t = t.return;
		}
	}
	function ed(e, t, n) {
		var r = e.pingCache;
		if (r === null) {
			r = e.pingCache = new Ul();
			var i = /* @__PURE__ */ new Set();
			r.set(t, i);
		} else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
		i.has(n) || (Zl = !0, i.add(n), e = td.bind(null, e, t, n), t.then(e, e));
	}
	function td(e, t, n) {
		var r = e.pingCache;
		r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, Gl === e && (Kl & n) === n && ($l === 4 || $l === 3 && (Kl & 62914560) === Kl && 300 > ke() - su ? !(Wl & 2) && Au(e, 0) : nu |= n, iu === Kl && (iu = 0)), fd(e);
	}
	function nd(e, t) {
		t === 0 && (t = Qe()), e = ii(e, t), e !== null && (et(e, t), fd(e));
	}
	function rd(e) {
		var t = e.memoizedState, n = 0;
		t !== null && (n = t.retryLane), nd(e, n);
	}
	function id(e, t) {
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
		r !== null && r.delete(t), nd(e, n);
	}
	function ad(e, t) {
		return Te(e, t);
	}
	var od = null, sd = null, cd = !1, ld = !1, ud = !1, dd = 0;
	function fd(e) {
		e !== sd && e.next === null && (sd === null ? od = sd = e : sd = sd.next = e), ld = !0, cd || (cd = !0, yd());
	}
	function pd(e, t) {
		if (!ud && ld) {
			ud = !0;
			do
				for (var n = !1, r = od; r !== null;) {
					if (!t) if (e !== 0) {
						var i = r.pendingLanes;
						if (i === 0) var a = 0;
						else {
							var o = r.suspendedLanes, s = r.pingedLanes;
							a = (1 << 31 - Ve(42 | e) + 1) - 1, a &= i & ~(o & ~s), a = a & 201326741 ? a & 201326741 | 1 : a ? a | 2 : 0;
						}
						a !== 0 && (n = !0, vd(r, a));
					} else a = Kl, a = Ye(r, r === Gl ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1), !(a & 3) || Xe(r, a) || (n = !0, vd(r, a));
					r = r.next;
				}
			while (n);
			ud = !1;
		}
	}
	function md() {
		hd();
	}
	function hd() {
		ld = cd = !1;
		var e = 0;
		dd !== 0 && tf() && (e = dd);
		for (var t = ke(), n = null, r = od; r !== null;) {
			var i = r.next, a = gd(r, t);
			a === 0 ? (r.next = null, n === null ? od = i : n.next = i, i === null && (sd = n)) : (n = r, (e !== 0 || a & 3) && (ld = !0)), r = i;
		}
		fu !== 0 && fu !== 5 || pd(e, !1), dd !== 0 && (dd = 0);
	}
	function gd(e, t) {
		for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
			var o = 31 - Ve(a), s = 1 << o, c = i[o];
			c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = Ze(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
		}
		if (t = Gl, n = Kl, n = Ye(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r = e.callbackNode, n === 0 || e === t && (ql === 2 || ql === 9) || e.cancelPendingCommit !== null) return r !== null && r !== null && Ee(r), e.callbackNode = null, e.callbackPriority = 0;
		if (!(n & 3) || Xe(e, n)) {
			if (t = n & -n, t === e.callbackPriority) return t;
			switch (r !== null && Ee(r), ot(n)) {
				case 2:
				case 8:
					n = Me;
					break;
				case 32:
					n = Ne;
					break;
				case 268435456:
					n = Fe;
					break;
				default: n = Ne;
			}
			return r = _d.bind(null, e), n = Te(n, r), e.callbackPriority = t, e.callbackNode = n, t;
		}
		return r !== null && r !== null && Ee(r), e.callbackPriority = 2, e.callbackNode = null, 2;
	}
	function _d(e, t) {
		if (fu !== 0 && fu !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
		var n = e.callbackNode;
		if (Xu() && e.callbackNode !== n) return null;
		var r = Kl;
		return r = Ye(e, e === Gl ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r === 0 ? null : (wu(e, r, t), gd(e, ke()), e.callbackNode != null && e.callbackNode === n ? _d.bind(null, e) : null);
	}
	function vd(e, t) {
		if (Xu()) return null;
		wu(e, t, !0);
	}
	function yd() {
		of(function() {
			Wl & 6 ? Te(je, md) : hd();
		});
	}
	function bd() {
		if (dd === 0) {
			var e = z;
			e === 0 && (e = Ge, Ge <<= 1, !(Ge & 261888) && (Ge = 256)), dd = e;
		}
		return dd;
	}
	function xd(e) {
		return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : en("" + e);
	}
	function Sd(e, t) {
		var n = t.ownerDocument.createElement("input");
		return n.name = t.name, n.value = t.value, e.id && n.setAttribute("form", e.id), t.parentNode.insertBefore(n, t), e = new FormData(e), n.parentNode.removeChild(n), e;
	}
	function Cd(e, t, n, r, i) {
		if (t === "submit" && n && n.stateNode === i) {
			var a = xd((i[dt] || null).action), o = r.submitter;
			o && (t = (t = o[dt] || null) ? xd(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
			var s = new Sn("action", "action", null, r, i);
			e.push({
				event: s,
				listeners: [{
					instance: null,
					listener: function() {
						if (r.defaultPrevented) {
							if (dd !== 0) {
								var e = o ? Sd(i, o) : new FormData(i);
								Ds(n, {
									pending: !0,
									data: e,
									method: i.method,
									action: a
								}, null, e);
							}
						} else typeof a == "function" && (s.preventDefault(), e = o ? Sd(i, o) : new FormData(i), Ds(n, {
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
	for (var wd = 0; wd < Yr.length; wd++) {
		var Td = Yr[wd];
		Xr(Td.toLowerCase(), "on" + (Td[0].toUpperCase() + Td.slice(1)));
	}
	Xr(Vr, "onAnimationEnd"), Xr(Hr, "onAnimationIteration"), Xr(Ur, "onAnimationStart"), Xr("dblclick", "onDoubleClick"), Xr("focusin", "onFocus"), Xr("focusout", "onBlur"), Xr(Wr, "onTransitionRun"), Xr(Gr, "onTransitionStart"), Xr(Kr, "onTransitionCancel"), Xr(qr, "onTransitionEnd"), Dt("onMouseEnter", ["mouseout", "mouseover"]), Dt("onMouseLeave", ["mouseout", "mouseover"]), Dt("onPointerEnter", ["pointerout", "pointerover"]), Dt("onPointerLeave", ["pointerout", "pointerover"]), Et("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), Et("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), Et("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]), Et("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), Et("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), Et("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
	var Ed = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Dd = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Ed));
	function Od(e, t) {
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
						Zr(e);
					}
					i.currentTarget = null, a = c;
				}
				else for (o = 0; o < r.length; o++) {
					if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						Zr(e);
					}
					i.currentTarget = null, a = c;
				}
			}
		}
	}
	function U(e, t) {
		var n = t[pt];
		n === void 0 && (n = t[pt] = /* @__PURE__ */ new Set());
		var r = e + "__bubble";
		n.has(r) || (Md(t, e, 2, !1), n.add(r));
	}
	function kd(e, t, n) {
		var r = 0;
		t && (r |= 4), Md(n, e, r, t);
	}
	var Ad = "_reactListening" + Math.random().toString(36).slice(2);
	function jd(e) {
		if (!e[Ad]) {
			e[Ad] = !0, wt.forEach(function(t) {
				t !== "selectionchange" && (Dd.has(t) || kd(t, !1, e), kd(t, !0, e));
			});
			var t = e.nodeType === 9 ? e : e.ownerDocument;
			t === null || t[Ad] || (t[Ad] = !0, kd("selectionchange", !1, t));
		}
	}
	function Md(e, t, n, r) {
		switch (Sp(t)) {
			case 2:
				var i = gp;
				break;
			case 8:
				i = _p;
				break;
			default: i = vp;
		}
		n = i.bind(null, t, n, e), i = void 0, !dn || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
			capture: !0,
			passive: i
		}) : i === void 0 ? e.addEventListener(t, n, !1) : e.addEventListener(t, n, { passive: i });
	}
	function Nd(e, t, n, r, i) {
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
					if (s = yt(c), s === null) return;
					if (l = s.tag, l === 5 || l === 6 || l === 26 || l === 27) {
						r = a = s;
						continue a;
					}
					c = c.parentNode;
				}
			}
			r = r.return;
		}
		cn(function() {
			var r = a, i = rn(n), s = [];
			a: {
				var c = Jr.get(e);
				if (c !== void 0) {
					var l = Sn, u = e;
					switch (e) {
						case "keypress": if (_n(n) === 0) break a;
						case "keydown":
						case "keyup":
							l = Bn;
							break;
						case "focusin":
							u = "focus", l = jn;
							break;
						case "focusout":
							u = "blur", l = jn;
							break;
						case "beforeblur":
						case "afterblur":
							l = jn;
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
							l = kn;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							l = An;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							l = Hn;
							break;
						case Vr:
						case Hr:
						case Ur:
							l = Mn;
							break;
						case qr:
							l = Un;
							break;
						case "scroll":
						case "scrollend":
							l = wn;
							break;
						case "wheel":
							l = Wn;
							break;
						case "copy":
						case "cut":
						case "paste":
							l = Nn;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							l = Vn;
							break;
						case "toggle":
						case "beforetoggle": l = Gn;
					}
					var d = (t & 4) != 0, f = !d && (e === "scroll" || e === "scrollend"), p = d ? c === null ? null : c + "Capture" : c;
					d = [];
					for (var m = r, h; m !== null;) {
						var g = m;
						if (h = g.stateNode, g = g.tag, g !== 5 && g !== 26 && g !== 27 || h === null || p === null || (g = ln(m, p), g != null && d.push(Pd(m, g, h))), f) break;
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
					if (c = e === "mouseover" || e === "pointerover", l = e === "mouseout" || e === "pointerout", c && n !== nn && (u = n.relatedTarget || n.fromElement) && (yt(u) || u[ft])) break a;
					if ((l || c) && (c = i.window === i ? i : (c = i.ownerDocument) ? c.defaultView || c.parentWindow : window, l ? (u = n.relatedTarget || n.toElement, l = r, u = u ? yt(u) : null, u !== null && (f = o(u), d = u.tag, u !== f || d !== 5 && d !== 27 && d !== 6) && (u = null)) : (l = null, u = r), l !== u)) {
						if (d = kn, g = "onMouseLeave", p = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (d = Vn, g = "onPointerLeave", p = "onPointerEnter", m = "pointer"), f = l == null ? c : xt(l), h = u == null ? c : xt(u), c = new d(g, m + "leave", l, n, i), c.target = f, c.relatedTarget = h, g = null, yt(i) === r && (d = new d(p, m + "enter", u, n, i), d.target = h, d.relatedTarget = f, g = d), f = g, l && u) b: {
							for (d = Id, p = l, m = u, h = 0, g = p; g; g = d(g)) h++;
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
						l !== null && Ld(s, c, l, d, !1), u !== null && f !== null && Ld(s, f, u, d, !0);
					}
				}
				a: {
					if (c = r ? xt(r) : window, l = c.nodeName && c.nodeName.toLowerCase(), l === "select" || l === "input" && c.type === "file") var v = dr;
					else if (ar(c)) if (fr) v = xr;
					else {
						v = yr;
						var y = vr;
					}
					else l = c.nodeName, !l || l.toLowerCase() !== "input" || c.type !== "checkbox" && c.type !== "radio" ? r && Qt(r.elementType) && (v = dr) : v = br;
					if (v &&= v(e, r)) {
						or(s, v, n, i);
						break a;
					}
					y && y(e, c, r), e === "focusout" && r && c.type === "number" && r.memoizedProps.value != null && Wt(c, "number", c.value);
				}
				switch (y = r ? xt(r) : window, e) {
					case "focusin":
						(ar(y) || y.contentEditable === "true") && (jr = y, Mr = r, Nr = null);
						break;
					case "focusout":
						Nr = Mr = jr = null;
						break;
					case "mousedown":
						Pr = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						Pr = !1, Fr(s, n, i);
						break;
					case "selectionchange": if (Ar) break;
					case "keydown":
					case "keyup": Fr(s, n, i);
				}
				var b;
				if (qn) b: {
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
				else tr ? $n(e, n) && (x = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (x = "onCompositionStart");
				x && (Xn && n.locale !== "ko" && (tr || x !== "onCompositionStart" ? x === "onCompositionEnd" && tr && (b = gn()) : (pn = i, mn = "value" in pn ? pn.value : pn.textContent, tr = !0)), y = Fd(r, x), 0 < y.length && (x = new Pn(x, e, null, n, i), s.push({
					event: x,
					listeners: y
				}), b ? x.data = b : (b = er(n), b !== null && (x.data = b)))), (b = Yn ? nr(e, n) : rr(e, n)) && (x = Fd(r, "onBeforeInput"), 0 < x.length && (y = new Pn("onBeforeInput", "beforeinput", null, n, i), s.push({
					event: y,
					listeners: x
				}), y.data = b)), Cd(s, e, r, n, i);
			}
			Od(s, t);
		});
	}
	function Pd(e, t, n) {
		return {
			instance: e,
			listener: t,
			currentTarget: n
		};
	}
	function Fd(e, t) {
		for (var n = t + "Capture", r = []; e !== null;) {
			var i = e, a = i.stateNode;
			if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = ln(e, n), i != null && r.unshift(Pd(e, i, a)), i = ln(e, t), i != null && r.push(Pd(e, i, a))), e.tag === 3) return r;
			e = e.return;
		}
		return [];
	}
	function Id(e) {
		if (e === null) return null;
		do
			e = e.return;
		while (e && e.tag !== 5 && e.tag !== 27);
		return e || null;
	}
	function Ld(e, t, n, r, i) {
		for (var a = t._reactName, o = []; n !== null && n !== r;) {
			var s = n, c = s.alternate, l = s.stateNode;
			if (s = s.tag, c !== null && c === r) break;
			s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = ln(n, a), l != null && o.unshift(Pd(n, l, c))) : i || (l = ln(n, a), l != null && o.push(Pd(n, l, c)))), n = n.return;
		}
		o.length !== 0 && e.push({
			event: t,
			listeners: o
		});
	}
	var Rd = /\r\n?/g, zd = /\u0000|\uFFFD/g;
	function Bd(e) {
		return (typeof e == "string" ? e : "" + e).replace(Rd, "\n").replace(zd, "");
	}
	function Vd(e, t) {
		return t = Bd(t), Bd(e) === t;
	}
	function Hd(e, t, n, r, a, o) {
		switch (n) {
			case "children":
				typeof r == "string" ? t === "body" || t === "textarea" && r === "" || Jt(e, r) : (typeof r == "number" || typeof r == "bigint") && t !== "body" && Jt(e, "" + r);
				break;
			case "className":
				Nt(e, "class", r);
				break;
			case "tabIndex":
				Nt(e, "tabindex", r);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				Nt(e, n, r);
				break;
			case "style":
				Zt(e, r, o);
				break;
			case "data": if (t !== "object") {
				Nt(e, "data", r);
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
				r = en("" + r), e.setAttribute(n, r);
				break;
			case "action":
			case "formAction":
				if (typeof r == "function") {
					e.setAttribute(n, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
					break;
				} else typeof o == "function" && (n === "formAction" ? (t !== "input" && Hd(e, t, "name", a.name, a, null), Hd(e, t, "formEncType", a.formEncType, a, null), Hd(e, t, "formMethod", a.formMethod, a, null), Hd(e, t, "formTarget", a.formTarget, a, null)) : (Hd(e, t, "encType", a.encType, a, null), Hd(e, t, "method", a.method, a, null), Hd(e, t, "target", a.target, a, null)));
				if (r == null || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = en("" + r), e.setAttribute(n, r);
				break;
			case "onClick":
				r != null && (e.onclick = tn);
				break;
			case "onScroll":
				r != null && U("scroll", e);
				break;
			case "onScrollEnd":
				r != null && U("scrollend", e);
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
				n = en("" + r), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
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
				U("beforetoggle", e), U("toggle", e), Mt(e, "popover", r);
				break;
			case "xlinkActuate":
				Pt(e, "http://www.w3.org/1999/xlink", "xlink:actuate", r);
				break;
			case "xlinkArcrole":
				Pt(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", r);
				break;
			case "xlinkRole":
				Pt(e, "http://www.w3.org/1999/xlink", "xlink:role", r);
				break;
			case "xlinkShow":
				Pt(e, "http://www.w3.org/1999/xlink", "xlink:show", r);
				break;
			case "xlinkTitle":
				Pt(e, "http://www.w3.org/1999/xlink", "xlink:title", r);
				break;
			case "xlinkType":
				Pt(e, "http://www.w3.org/1999/xlink", "xlink:type", r);
				break;
			case "xmlBase":
				Pt(e, "http://www.w3.org/XML/1998/namespace", "xml:base", r);
				break;
			case "xmlLang":
				Pt(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", r);
				break;
			case "xmlSpace":
				Pt(e, "http://www.w3.org/XML/1998/namespace", "xml:space", r);
				break;
			case "is":
				Mt(e, "is", r);
				break;
			case "innerText":
			case "textContent": break;
			default: (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") && (n = I.get(n) || n, Mt(e, n, r));
		}
	}
	function Ud(e, t, n, r, a, o) {
		switch (n) {
			case "style":
				Zt(e, r, o);
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
				typeof r == "string" ? Jt(e, r) : (typeof r == "number" || typeof r == "bigint") && Jt(e, "" + r);
				break;
			case "onScroll":
				r != null && U("scroll", e);
				break;
			case "onScrollEnd":
				r != null && U("scrollend", e);
				break;
			case "onClick":
				r != null && (e.onclick = tn);
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref": break;
			case "innerText":
			case "textContent": break;
			default: if (!Tt.hasOwnProperty(n)) a: {
				if (n[0] === "o" && n[1] === "n" && (a = n.endsWith("Capture"), t = n.slice(2, a ? n.length - 7 : void 0), o = e[dt] || null, o = o == null ? null : o[n], typeof o == "function" && e.removeEventListener(t, o, a), typeof r == "function")) {
					typeof o != "function" && o !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(t, r, a);
					break a;
				}
				n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : Mt(e, n, r);
			}
		}
	}
	function Wd(e, t, n) {
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
				U("error", e), U("load", e);
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
						default: Hd(e, t, o, s, n, null);
					}
				}
				a && Hd(e, t, "srcSet", n.srcSet, n, null), r && Hd(e, t, "src", n.src, n, null);
				return;
			case "input":
				U("invalid", e);
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
						default: Hd(e, t, r, d, n, null);
					}
				}
				Ut(e, o, c, l, u, s, a, !1);
				return;
			case "select":
				for (a in U("invalid", e), r = s = o = null, n) if (n.hasOwnProperty(a) && (c = n[a], c != null)) switch (a) {
					case "value":
						o = c;
						break;
					case "defaultValue":
						s = c;
						break;
					case "multiple": r = c;
					default: Hd(e, t, a, c, n, null);
				}
				t = o, n = s, e.multiple = !!r, t == null ? n != null && Gt(e, !!r, n, !0) : Gt(e, !!r, t, !1);
				return;
			case "textarea":
				for (s in U("invalid", e), o = a = r = null, n) if (n.hasOwnProperty(s) && (c = n[s], c != null)) switch (s) {
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
					default: Hd(e, t, s, c, n, null);
				}
				qt(e, r, a, o);
				return;
			case "option":
				for (l in n) if (n.hasOwnProperty(l) && (r = n[l], r != null)) switch (l) {
					case "selected":
						e.selected = r && typeof r != "function" && typeof r != "symbol";
						break;
					default: Hd(e, t, l, r, n, null);
				}
				return;
			case "dialog":
				U("beforetoggle", e), U("toggle", e), U("cancel", e), U("close", e);
				break;
			case "iframe":
			case "object":
				U("load", e);
				break;
			case "video":
			case "audio":
				for (r = 0; r < Ed.length; r++) U(Ed[r], e);
				break;
			case "image":
				U("error", e), U("load", e);
				break;
			case "details":
				U("toggle", e);
				break;
			case "embed":
			case "source":
			case "link": U("error", e), U("load", e);
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
					default: Hd(e, t, u, r, n, null);
				}
				return;
			default: if (Qt(t)) {
				for (d in n) n.hasOwnProperty(d) && (r = n[d], r !== void 0 && Ud(e, t, d, r, n, void 0));
				return;
			}
		}
		for (c in n) n.hasOwnProperty(c) && (r = n[c], r != null && Hd(e, t, c, r, n, null));
	}
	function Gd(e, t, n, r) {
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
						default: r.hasOwnProperty(m) || Hd(e, t, m, null, r, f);
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
						default: m !== f && Hd(e, t, p, m, r, f);
					}
				}
				Ht(e, s, c, l, u, d, o, a);
				return;
			case "select":
				for (o in m = s = c = p = null, n) if (l = n[o], n.hasOwnProperty(o) && l != null) switch (o) {
					case "value": break;
					case "multiple": m = l;
					default: r.hasOwnProperty(o) || Hd(e, t, o, null, r, l);
				}
				for (a in r) if (o = r[a], l = n[a], r.hasOwnProperty(a) && (o != null || l != null)) switch (a) {
					case "value":
						p = o;
						break;
					case "defaultValue":
						c = o;
						break;
					case "multiple": s = o;
					default: o !== l && Hd(e, t, a, o, r, l);
				}
				t = c, n = s, r = m, p == null ? !!r != !!n && (t == null ? Gt(e, !!n, n ? [] : "", !1) : Gt(e, !!n, t, !0)) : Gt(e, !!n, p, !1);
				return;
			case "textarea":
				for (c in m = p = null, n) if (a = n[c], n.hasOwnProperty(c) && a != null && !r.hasOwnProperty(c)) switch (c) {
					case "value": break;
					case "children": break;
					default: Hd(e, t, c, null, r, a);
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
					default: a !== o && Hd(e, t, s, a, r, o);
				}
				Kt(e, p, m);
				return;
			case "option":
				for (var h in n) if (p = n[h], n.hasOwnProperty(h) && p != null && !r.hasOwnProperty(h)) switch (h) {
					case "selected":
						e.selected = !1;
						break;
					default: Hd(e, t, h, null, r, p);
				}
				for (l in r) if (p = r[l], m = n[l], r.hasOwnProperty(l) && p !== m && (p != null || m != null)) switch (l) {
					case "selected":
						e.selected = p && typeof p != "function" && typeof p != "symbol";
						break;
					default: Hd(e, t, l, p, r, m);
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
				for (var g in n) p = n[g], n.hasOwnProperty(g) && p != null && !r.hasOwnProperty(g) && Hd(e, t, g, null, r, p);
				for (u in r) if (p = r[u], m = n[u], r.hasOwnProperty(u) && p !== m && (p != null || m != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML":
						if (p != null) throw Error(i(137, t));
						break;
					default: Hd(e, t, u, p, r, m);
				}
				return;
			default: if (Qt(t)) {
				for (var _ in n) p = n[_], n.hasOwnProperty(_) && p !== void 0 && !r.hasOwnProperty(_) && Ud(e, t, _, void 0, r, p);
				for (d in r) p = r[d], m = n[d], !r.hasOwnProperty(d) || p === m || p === void 0 && m === void 0 || Ud(e, t, d, p, r, m);
				return;
			}
		}
		for (var v in n) p = n[v], n.hasOwnProperty(v) && p != null && !r.hasOwnProperty(v) && Hd(e, t, v, null, r, p);
		for (f in r) p = r[f], m = n[f], !r.hasOwnProperty(f) || p === m || p == null && m == null || Hd(e, t, f, p, r, m);
	}
	function Kd(e) {
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
	function qd() {
		if (typeof performance.getEntriesByType == "function") {
			for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), r = 0; r < n.length; r++) {
				var i = n[r], a = i.transferSize, o = i.initiatorType, s = i.duration;
				if (a && s && Kd(o)) {
					for (o = 0, s = i.responseEnd, r += 1; r < n.length; r++) {
						var c = n[r], l = c.startTime;
						if (l > s) break;
						var u = c.transferSize, d = c.initiatorType;
						u && Kd(d) && (c = c.responseEnd, o += u * (c < s ? 1 : (s - l) / (c - l)));
					}
					if (--r, t += 8 * (a + o) / (i.duration / 1e3), e++, 10 < e) break;
				}
			}
			if (0 < e) return t / e / 1e6;
		}
		return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
	}
	var Jd = null, Yd = null;
	function Xd(e) {
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	function Zd(e) {
		switch (e) {
			case "http://www.w3.org/2000/svg": return 1;
			case "http://www.w3.org/1998/Math/MathML": return 2;
			default: return 0;
		}
	}
	function Qd(e, t) {
		if (e === 0) switch (t) {
			case "svg": return 1;
			case "math": return 2;
			default: return 0;
		}
		return e === 1 && t === "foreignObject" ? 0 : e;
	}
	function $d(e, t) {
		return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
	}
	var ef = null;
	function tf() {
		var e = window.event;
		return e && e.type === "popstate" ? e === ef ? !1 : (ef = e, !0) : (ef = null, !1);
	}
	var nf = typeof setTimeout == "function" ? setTimeout : void 0, rf = typeof clearTimeout == "function" ? clearTimeout : void 0, af = typeof Promise == "function" ? Promise : void 0, of = typeof queueMicrotask == "function" ? queueMicrotask : af === void 0 ? nf : function(e) {
		return af.resolve(null).then(e).catch(sf);
	};
	function sf(e) {
		setTimeout(function() {
			throw e;
		});
	}
	function cf(e) {
		return e === "head";
	}
	function lf(e, t) {
		var n = t, r = 0;
		do {
			var i = n.nextSibling;
			if (e.removeChild(n), i && i.nodeType === 8) if (n = i.data, n === "/$" || n === "/&") {
				if (r === 0) {
					e.removeChild(i), Vp(t);
					return;
				}
				r--;
			} else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&") r++;
			else if (n === "html") Cf(e.ownerDocument.documentElement);
			else if (n === "head") {
				n = e.ownerDocument.head, Cf(n);
				for (var a = n.firstChild; a;) {
					var o = a.nextSibling, s = a.nodeName;
					a[_t] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && a.rel.toLowerCase() === "stylesheet" || n.removeChild(a), a = o;
				}
			} else n === "body" && Cf(e.ownerDocument.body);
			n = i;
		} while (n);
		Vp(t);
	}
	function uf(e, t) {
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
	function df(e) {
		var t = e.firstChild;
		for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
			var n = t;
			switch (t = t.nextSibling, n.nodeName) {
				case "HTML":
				case "HEAD":
				case "BODY":
					df(n), vt(n);
					continue;
				case "SCRIPT":
				case "STYLE": continue;
				case "LINK": if (n.rel.toLowerCase() === "stylesheet") continue;
			}
			e.removeChild(n);
		}
	}
	function ff(e, t, n, r) {
		for (; e.nodeType === 1;) {
			var i = n;
			if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
				if (!r && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
			} else if (!r) if (t === "input" && e.type === "hidden") {
				var a = i.name == null ? null : "" + i.name;
				if (i.type === "hidden" && e.getAttribute("name") === a) return e;
			} else return e;
			else if (!e[_t]) switch (t) {
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
			if (e = vf(e.nextSibling), e === null) break;
		}
		return null;
	}
	function pf(e, t, n) {
		if (t === "") return null;
		for (; e.nodeType !== 3;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = vf(e.nextSibling), e === null)) return null;
		return e;
	}
	function mf(e, t) {
		for (; e.nodeType !== 8;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = vf(e.nextSibling), e === null)) return null;
		return e;
	}
	function hf(e) {
		return e.data === "$?" || e.data === "$~";
	}
	function gf(e) {
		return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
	}
	function _f(e, t) {
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
	function vf(e) {
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
	var yf = null;
	function bf(e) {
		e = e.nextSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "/$" || n === "/&") {
					if (t === 0) return vf(e.nextSibling);
					t--;
				} else n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || t++;
			}
			e = e.nextSibling;
		}
		return null;
	}
	function xf(e) {
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
	function Sf(e, t, n) {
		switch (t = Xd(n), e) {
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
	function Cf(e) {
		for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
		vt(e);
	}
	var wf = /* @__PURE__ */ new Map(), Tf = /* @__PURE__ */ new Set();
	function W(e) {
		return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
	}
	var Ef = A.d;
	A.d = {
		f: Df,
		r: Of,
		D: jf,
		C: Mf,
		L: Nf,
		m: Pf,
		X: If,
		S: Ff,
		M: Lf
	};
	function Df() {
		var e = Ef.f(), t = Ou();
		return e || t;
	}
	function Of(e) {
		var t = bt(e);
		t !== null && t.tag === 5 && t.type === "form" ? ks(t) : Ef.r(e);
	}
	var kf = typeof document > "u" ? null : document;
	function Af(e, t, n) {
		var r = kf;
		if (r && typeof t == "string" && t) {
			var i = F(t);
			i = "link[rel=\"" + e + "\"][href=\"" + i + "\"]", typeof n == "string" && (i += "[crossorigin=\"" + n + "\"]"), Tf.has(i) || (Tf.add(i), e = {
				rel: e,
				crossOrigin: n,
				href: t
			}, r.querySelector(i) === null && (t = r.createElement("link"), Wd(t, "link", e), Ct(t), r.head.appendChild(t)));
		}
	}
	function jf(e) {
		Ef.D(e), Af("dns-prefetch", e, null);
	}
	function Mf(e, t) {
		Ef.C(e, t), Af("preconnect", e, t);
	}
	function Nf(e, t, n) {
		Ef.L(e, t, n);
		var r = kf;
		if (r && e && t) {
			var i = "link[rel=\"preload\"][as=\"" + F(t) + "\"]";
			t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + F(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + F(n.imageSizes) + "\"]")) : i += "[href=\"" + F(e) + "\"]";
			var a = i;
			switch (t) {
				case "style":
					a = zf(e);
					break;
				case "script": a = Uf(e);
			}
			wf.has(a) || (e = p({
				rel: "preload",
				href: t === "image" && n && n.imageSrcSet ? void 0 : e,
				as: t
			}, n), wf.set(a, e), r.querySelector(i) !== null || t === "style" && r.querySelector(Bf(a)) || t === "script" && r.querySelector(G(a)) || (t = r.createElement("link"), Wd(t, "link", e), Ct(t), r.head.appendChild(t)));
		}
	}
	function Pf(e, t) {
		Ef.m(e, t);
		var n = kf;
		if (n && e) {
			var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + F(r) + "\"][href=\"" + F(e) + "\"]", a = i;
			switch (r) {
				case "audioworklet":
				case "paintworklet":
				case "serviceworker":
				case "sharedworker":
				case "worker":
				case "script": a = Uf(e);
			}
			if (!wf.has(a) && (e = p({
				rel: "modulepreload",
				href: e
			}, t), wf.set(a, e), n.querySelector(i) === null)) {
				switch (r) {
					case "audioworklet":
					case "paintworklet":
					case "serviceworker":
					case "sharedworker":
					case "worker":
					case "script": if (n.querySelector(G(a))) return;
				}
				r = n.createElement("link"), Wd(r, "link", e), Ct(r), n.head.appendChild(r);
			}
		}
	}
	function Ff(e, t, n) {
		Ef.S(e, t, n);
		var r = kf;
		if (r && e) {
			var i = St(r).hoistableStyles, a = zf(e);
			t ||= "default";
			var o = i.get(a);
			if (!o) {
				var s = {
					loading: 0,
					preload: null
				};
				if (o = r.querySelector(Bf(a))) s.loading = 5;
				else {
					e = p({
						rel: "stylesheet",
						href: e,
						"data-precedence": t
					}, n), (n = wf.get(a)) && Kf(e, n);
					var c = o = r.createElement("link");
					Ct(c), Wd(c, "link", e), c._p = new Promise(function(e, t) {
						c.onload = e, c.onerror = t;
					}), c.addEventListener("load", function() {
						s.loading |= 1;
					}), c.addEventListener("error", function() {
						s.loading |= 2;
					}), s.loading |= 4, Gf(o, t, r);
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
	function If(e, t) {
		Ef.X(e, t);
		var n = kf;
		if (n && e) {
			var r = St(n).hoistableScripts, i = Uf(e), a = r.get(i);
			a || (a = n.querySelector(G(i)), a || (e = p({
				src: e,
				async: !0
			}, t), (t = wf.get(i)) && qf(e, t), a = n.createElement("script"), Ct(a), Wd(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Lf(e, t) {
		Ef.M(e, t);
		var n = kf;
		if (n && e) {
			var r = St(n).hoistableScripts, i = Uf(e), a = r.get(i);
			a || (a = n.querySelector(G(i)), a || (e = p({
				src: e,
				async: !0,
				type: "module"
			}, t), (t = wf.get(i)) && qf(e, t), a = n.createElement("script"), Ct(a), Wd(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Rf(e, t, n, r) {
		var a = (a = pe.current) ? W(a) : null;
		if (!a) throw Error(i(446));
		switch (e) {
			case "meta":
			case "title": return null;
			case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (t = zf(n.href), n = St(a).hoistableStyles, r = n.get(t), r || (r = {
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
					e = zf(n.href);
					var o = St(a).hoistableStyles, s = o.get(e);
					if (s || (a = a.ownerDocument || a, s = {
						type: "stylesheet",
						instance: null,
						count: 0,
						state: {
							loading: 0,
							preload: null
						}
					}, o.set(e, s), (o = a.querySelector(Bf(e))) && !o._p && (s.instance = o, s.state.loading = 5), wf.has(e) || (n = {
						rel: "preload",
						as: "style",
						href: n.href,
						crossOrigin: n.crossOrigin,
						integrity: n.integrity,
						media: n.media,
						hrefLang: n.hrefLang,
						referrerPolicy: n.referrerPolicy
					}, wf.set(e, n), o || Hf(a, e, n, s.state))), t && r === null) throw Error(i(528, ""));
					return s;
				}
				if (t && r !== null) throw Error(i(529, ""));
				return null;
			case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = Uf(n), n = St(a).hoistableScripts, r = n.get(t), r || (r = {
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
	function zf(e) {
		return "href=\"" + F(e) + "\"";
	}
	function Bf(e) {
		return "link[rel=\"stylesheet\"][" + e + "]";
	}
	function Vf(e) {
		return p({}, e, {
			"data-precedence": e.precedence,
			precedence: null
		});
	}
	function Hf(e, t, n, r) {
		e.querySelector("link[rel=\"preload\"][as=\"style\"][" + t + "]") ? r.loading = 1 : (t = e.createElement("link"), r.preload = t, t.addEventListener("load", function() {
			return r.loading |= 1;
		}), t.addEventListener("error", function() {
			return r.loading |= 2;
		}), Wd(t, "link", n), Ct(t), e.head.appendChild(t));
	}
	function Uf(e) {
		return "[src=\"" + F(e) + "\"]";
	}
	function G(e) {
		return "script[async]" + e;
	}
	function Wf(e, t, n) {
		if (t.count++, t.instance === null) switch (t.type) {
			case "style":
				var r = e.querySelector("style[data-href~=\"" + F(n.href) + "\"]");
				if (r) return t.instance = r, Ct(r), r;
				var a = p({}, n, {
					"data-href": n.href,
					"data-precedence": n.precedence,
					href: null,
					precedence: null
				});
				return r = (e.ownerDocument || e).createElement("style"), Ct(r), Wd(r, "style", a), Gf(r, n.precedence, e), t.instance = r;
			case "stylesheet":
				a = zf(n.href);
				var o = e.querySelector(Bf(a));
				if (o) return t.state.loading |= 4, t.instance = o, Ct(o), o;
				r = Vf(n), (a = wf.get(a)) && Kf(r, a), o = (e.ownerDocument || e).createElement("link"), Ct(o);
				var s = o;
				return s._p = new Promise(function(e, t) {
					s.onload = e, s.onerror = t;
				}), Wd(o, "link", r), t.state.loading |= 4, Gf(o, n.precedence, e), t.instance = o;
			case "script": return o = Uf(n.src), (a = e.querySelector(G(o))) ? (t.instance = a, Ct(a), a) : (r = n, (a = wf.get(o)) && (r = p({}, n), qf(r, a)), e = e.ownerDocument || e, a = e.createElement("script"), Ct(a), Wd(a, "link", r), e.head.appendChild(a), t.instance = a);
			case "void": return null;
			default: throw Error(i(443, t.type));
		}
		else t.type === "stylesheet" && !(t.state.loading & 4) && (r = t.instance, t.state.loading |= 4, Gf(r, n.precedence, e));
		return t.instance;
	}
	function Gf(e, t, n) {
		for (var r = n.querySelectorAll("link[rel=\"stylesheet\"][data-precedence],style[data-precedence]"), i = r.length ? r[r.length - 1] : null, a = i, o = 0; o < r.length; o++) {
			var s = r[o];
			if (s.dataset.precedence === t) a = s;
			else if (a !== i) break;
		}
		a ? a.parentNode.insertBefore(e, a.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
	}
	function Kf(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.title ??= t.title;
	}
	function qf(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.integrity ??= t.integrity;
	}
	var Jf = null;
	function Yf(e, t, n) {
		if (Jf === null) {
			var r = /* @__PURE__ */ new Map(), i = Jf = /* @__PURE__ */ new Map();
			i.set(n, r);
		} else i = Jf, r = i.get(n), r || (r = /* @__PURE__ */ new Map(), i.set(n, r));
		if (r.has(e)) return r;
		for (r.set(e, null), n = n.getElementsByTagName(e), i = 0; i < n.length; i++) {
			var a = n[i];
			if (!(a[_t] || a[ut] || e === "link" && a.getAttribute("rel") === "stylesheet") && a.namespaceURI !== "http://www.w3.org/2000/svg") {
				var o = a.getAttribute(t) || "";
				o = e + o;
				var s = r.get(o);
				s ? s.push(a) : r.set(o, [a]);
			}
		}
		return r;
	}
	function Xf(e, t, n) {
		e = e.ownerDocument || e, e.head.insertBefore(n, t === "title" ? e.querySelector("head > title") : null);
	}
	function Zf(e, t, n) {
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
	function Qf(e) {
		return !(e.type === "stylesheet" && !(e.state.loading & 3));
	}
	function $f(e, t, n, r) {
		if (n.type === "stylesheet" && (typeof r.media != "string" || !1 !== matchMedia(r.media).matches) && !(n.state.loading & 4)) {
			if (n.instance === null) {
				var i = zf(r.href), a = t.querySelector(Bf(i));
				if (a) {
					t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = np.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = a, Ct(a);
					return;
				}
				a = t.ownerDocument || t, r = Vf(r), (i = wf.get(i)) && Kf(r, i), a = a.createElement("link"), Ct(a);
				var o = a;
				o._p = new Promise(function(e, t) {
					o.onload = e, o.onerror = t;
				}), Wd(a, "link", r), n.instance = a;
			}
			e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && !(n.state.loading & 3) && (e.count++, n = np.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
		}
	}
	var ep = 0;
	function tp(e, t) {
		return e.stylesheets && e.count === 0 && ip(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
			var r = setTimeout(function() {
				if (e.stylesheets && ip(e, e.stylesheets), e.unsuspend) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, 6e4 + t);
			0 < e.imgBytes && ep === 0 && (ep = 62500 * qd());
			var i = setTimeout(function() {
				if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && ip(e, e.stylesheets), e.unsuspend)) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, (e.imgBytes > ep ? 50 : 800) + t);
			return e.unsuspend = n, function() {
				e.unsuspend = null, clearTimeout(r), clearTimeout(i);
			};
		} : null;
	}
	function np() {
		if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
			if (this.stylesheets) ip(this, this.stylesheets);
			else if (this.unsuspend) {
				var e = this.unsuspend;
				this.unsuspend = null, e();
			}
		}
	}
	var rp = null;
	function ip(e, t) {
		e.stylesheets = null, e.unsuspend !== null && (e.count++, rp = /* @__PURE__ */ new Map(), t.forEach(ap, e), rp = null, np.call(e));
	}
	function ap(e, t) {
		if (!(t.state.loading & 4)) {
			var n = rp.get(e);
			if (n) var r = n.get(null);
			else {
				n = /* @__PURE__ */ new Map(), rp.set(e, n);
				for (var i = e.querySelectorAll("link[data-precedence],style[data-precedence]"), a = 0; a < i.length; a++) {
					var o = i[a];
					(o.nodeName === "LINK" || o.getAttribute("media") !== "not all") && (n.set(o.dataset.precedence, o), r = o);
				}
				r && n.set(null, r);
			}
			i = t.instance, o = i.getAttribute("data-precedence"), a = n.get(o) || r, a === r && n.set(null, i), n.set(o, i), this.count++, r = np.bind(this), i.addEventListener("load", r), i.addEventListener("error", r), a ? a.parentNode.insertBefore(i, a.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(i, e.firstChild)), t.state.loading |= 4;
		}
	}
	var op = {
		$$typeof: te,
		Provider: null,
		Consumer: null,
		_currentValue: se,
		_currentValue2: se,
		_threadCount: 0
	};
	function sp(e, t, n, r, i, a, o, s, c) {
		this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = $e(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = $e(0), this.hiddenUpdates = $e(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function cp(e, t, n, r, i, a, o, s, c, l, u, d) {
		return e = new sp(e, t, n, o, c, l, u, d, s), t = 1, !0 === a && (t |= 24), a = li(3, null, null, t), e.current = a, a.stateNode = e, t = ua(), t.refCount++, e.pooledCache = t, t.refCount++, a.memoizedState = {
			element: r,
			isDehydrated: n,
			cache: t
		}, Va(a), e;
	}
	function lp(e) {
		return e ? (e = si, e) : si;
	}
	function up(e, t, n, r, i, a) {
		i = lp(i), r.context === null ? r.context = i : r.pendingContext = i, r = Ua(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (r.callback = a), n = Wa(e, r, t), n !== null && (Cu(n, e, t), Ga(n, e, t));
	}
	function dp(e, t) {
		if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
			var n = e.retryLane;
			e.retryLane = n !== 0 && n < t ? n : t;
		}
	}
	function fp(e, t) {
		dp(e, t), (e = e.alternate) && dp(e, t);
	}
	function pp(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = ii(e, 67108864);
			t !== null && Cu(t, e, 67108864), fp(e, 67108864);
		}
	}
	function mp(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = xu();
			t = at(t);
			var n = ii(e, t);
			n !== null && Cu(n, e, t), fp(e, t);
		}
	}
	var hp = !0;
	function gp(e, t, n, r) {
		var i = k.T;
		k.T = null;
		var a = A.p;
		try {
			A.p = 2, vp(e, t, n, r);
		} finally {
			A.p = a, k.T = i;
		}
	}
	function _p(e, t, n, r) {
		var i = k.T;
		k.T = null;
		var a = A.p;
		try {
			A.p = 8, vp(e, t, n, r);
		} finally {
			A.p = a, k.T = i;
		}
	}
	function vp(e, t, n, r) {
		if (hp) {
			var i = yp(r);
			if (i === null) Nd(e, t, r, bp, n), jp(e, r);
			else if (Np(i, e, t, n, r)) r.stopPropagation();
			else if (jp(e, r), t & 4 && -1 < Ap.indexOf(e)) {
				for (; i !== null;) {
					var a = bt(i);
					if (a !== null) switch (a.tag) {
						case 3:
							if (a = a.stateNode, a.current.memoizedState.isDehydrated) {
								var o = Je(a.pendingLanes);
								if (o !== 0) {
									var s = a;
									for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
										var c = 1 << 31 - Ve(o);
										s.entanglements[1] |= c, o &= ~c;
									}
									fd(a), !(Wl & 6) && (lu = ke() + 500, pd(0, !1));
								}
							}
							break;
						case 31:
						case 13: s = ii(a, 2), s !== null && Cu(s, a, 2), Ou(), fp(a, 2);
					}
					if (a = yp(r), a === null && Nd(e, t, r, bp, n), a === i) break;
					i = a;
				}
				i !== null && r.stopPropagation();
			} else Nd(e, t, r, null, n);
		}
	}
	function yp(e) {
		return e = rn(e), xp(e);
	}
	var bp = null;
	function xp(e) {
		if (bp = null, e = yt(e), e !== null) {
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
		return bp = e, null;
	}
	function Sp(e) {
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
			case "message": switch (Ae()) {
				case je: return 2;
				case Me: return 8;
				case Ne:
				case Pe: return 32;
				case Fe: return 268435456;
				default: return 32;
			}
			default: return 32;
		}
	}
	var Cp = !1, wp = null, Tp = null, Ep = null, Dp = /* @__PURE__ */ new Map(), Op = /* @__PURE__ */ new Map(), kp = [], Ap = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
	function jp(e, t) {
		switch (e) {
			case "focusin":
			case "focusout":
				wp = null;
				break;
			case "dragenter":
			case "dragleave":
				Tp = null;
				break;
			case "mouseover":
			case "mouseout":
				Ep = null;
				break;
			case "pointerover":
			case "pointerout":
				Dp.delete(t.pointerId);
				break;
			case "gotpointercapture":
			case "lostpointercapture": Op.delete(t.pointerId);
		}
	}
	function Mp(e, t, n, r, i, a) {
		return e === null || e.nativeEvent !== a ? (e = {
			blockedOn: t,
			domEventName: n,
			eventSystemFlags: r,
			nativeEvent: a,
			targetContainers: [i]
		}, t !== null && (t = bt(t), t !== null && pp(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
	}
	function Np(e, t, n, r, i) {
		switch (t) {
			case "focusin": return wp = Mp(wp, e, t, n, r, i), !0;
			case "dragenter": return Tp = Mp(Tp, e, t, n, r, i), !0;
			case "mouseover": return Ep = Mp(Ep, e, t, n, r, i), !0;
			case "pointerover":
				var a = i.pointerId;
				return Dp.set(a, Mp(Dp.get(a) || null, e, t, n, r, i)), !0;
			case "gotpointercapture": return a = i.pointerId, Op.set(a, Mp(Op.get(a) || null, e, t, n, r, i)), !0;
		}
		return !1;
	}
	function Pp(e) {
		var t = yt(e.target);
		if (t !== null) {
			var n = o(t);
			if (n !== null) {
				if (t = n.tag, t === 13) {
					if (t = s(n), t !== null) {
						e.blockedOn = t, ct(e.priority, function() {
							mp(n);
						});
						return;
					}
				} else if (t === 31) {
					if (t = c(n), t !== null) {
						e.blockedOn = t, ct(e.priority, function() {
							mp(n);
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
	function Fp(e) {
		if (e.blockedOn !== null) return !1;
		for (var t = e.targetContainers; 0 < t.length;) {
			var n = yp(e.nativeEvent);
			if (n === null) {
				n = e.nativeEvent;
				var r = new n.constructor(n.type, n);
				nn = r, n.target.dispatchEvent(r), nn = null;
			} else return t = bt(n), t !== null && pp(t), e.blockedOn = n, !1;
			t.shift();
		}
		return !0;
	}
	function Ip(e, t, n) {
		Fp(e) && n.delete(t);
	}
	function Lp() {
		Cp = !1, wp !== null && Fp(wp) && (wp = null), Tp !== null && Fp(Tp) && (Tp = null), Ep !== null && Fp(Ep) && (Ep = null), Dp.forEach(Ip), Op.forEach(Ip);
	}
	function Rp(e, n) {
		e.blockedOn === n && (e.blockedOn = null, Cp || (Cp = !0, t.unstable_scheduleCallback(t.unstable_NormalPriority, Lp)));
	}
	var zp = null;
	function Bp(e) {
		zp !== e && (zp = e, t.unstable_scheduleCallback(t.unstable_NormalPriority, function() {
			zp === e && (zp = null);
			for (var t = 0; t < e.length; t += 3) {
				var n = e[t], r = e[t + 1], i = e[t + 2];
				if (typeof r != "function") {
					if (xp(r || n) === null) continue;
					break;
				}
				var a = bt(n);
				a !== null && (e.splice(t, 3), t -= 3, Ds(a, {
					pending: !0,
					data: i,
					method: n.method,
					action: r
				}, r, i));
			}
		}));
	}
	function Vp(e) {
		function t(t) {
			return Rp(t, e);
		}
		wp !== null && Rp(wp, e), Tp !== null && Rp(Tp, e), Ep !== null && Rp(Ep, e), Dp.forEach(t), Op.forEach(t);
		for (var n = 0; n < kp.length; n++) {
			var r = kp[n];
			r.blockedOn === e && (r.blockedOn = null);
		}
		for (; 0 < kp.length && (n = kp[0], n.blockedOn === null);) Pp(n), n.blockedOn === null && kp.shift();
		if (n = (e.ownerDocument || e).$$reactFormReplay, n != null) for (r = 0; r < n.length; r += 3) {
			var i = n[r], a = n[r + 1], o = i[dt] || null;
			if (typeof a == "function") o || Bp(n);
			else if (o) {
				var s = null;
				if (a && a.hasAttribute("formAction")) {
					if (i = a, o = a[dt] || null) s = o.formAction;
					else if (xp(i) !== null) continue;
				} else s = o.action;
				typeof s == "function" ? n[r + 1] = s : (n.splice(r, 3), r -= 3), Bp(n);
			}
		}
	}
	function Hp() {
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
	function Up(e) {
		this._internalRoot = e;
	}
	Wp.prototype.render = Up.prototype.render = function(e) {
		var t = this._internalRoot;
		if (t === null) throw Error(i(409));
		var n = t.current;
		up(n, xu(), e, t, null, null);
	}, Wp.prototype.unmount = Up.prototype.unmount = function() {
		var e = this._internalRoot;
		if (e !== null) {
			this._internalRoot = null;
			var t = e.containerInfo;
			up(e.current, 2, null, e, null, null), Ou(), t[ft] = null;
		}
	};
	function Wp(e) {
		this._internalRoot = e;
	}
	Wp.prototype.unstable_scheduleHydration = function(e) {
		if (e) {
			var t = st();
			e = {
				blockedOn: null,
				target: e,
				priority: t
			};
			for (var n = 0; n < kp.length && t !== 0 && t < kp[n].priority; n++);
			kp.splice(n, 0, e), n === 0 && Pp(e);
		}
	};
	var Gp = n.version;
	if (Gp !== "19.2.6") throw Error(i(527, Gp, "19.2.6"));
	A.findDOMNode = function(e) {
		var t = e._reactInternals;
		if (t === void 0) throw typeof e.render == "function" ? Error(i(188)) : (e = Object.keys(e).join(","), Error(i(268, e)));
		return e = u(t), e = e === null ? null : f(e), e = e === null ? null : e.stateNode, e;
	};
	var Kp = {
		bundleType: 0,
		version: "19.2.6",
		rendererPackageName: "react-dom",
		currentDispatcherRef: k,
		reconcilerVersion: "19.2.6"
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var qp = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!qp.isDisabled && qp.supportsFiber) try {
			Re = qp.inject(Kp), ze = qp;
		} catch {}
	}
	e.createRoot = function(e, t) {
		if (!a(e)) throw Error(i(299));
		var n = !1, r = "", o = Xs, s = Zs, c = Qs;
		return t != null && (!0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (o = t.onUncaughtError), t.onCaughtError !== void 0 && (s = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = cp(e, 1, !1, null, null, n, r, null, o, s, c, Hp), e[ft] = t.current, jd(e), new Up(t);
	}, e.hydrateRoot = function(e, t, n) {
		if (!a(e)) throw Error(i(299));
		var r = !1, o = "", s = Xs, c = Zs, l = Qs, u = null;
		return n != null && (!0 === n.unstable_strictMode && (r = !0), n.identifierPrefix !== void 0 && (o = n.identifierPrefix), n.onUncaughtError !== void 0 && (s = n.onUncaughtError), n.onCaughtError !== void 0 && (c = n.onCaughtError), n.onRecoverableError !== void 0 && (l = n.onRecoverableError), n.formState !== void 0 && (u = n.formState)), t = cp(e, 1, !0, t, n ?? null, r, o, u, s, c, l, Hp), t.context = lp(null), n = t.current, r = xu(), r = at(r), o = Ua(r), o.callback = null, Wa(n, o, r), n = r, t.current.lanes = n, et(t, n), fd(t), e[ft] = t.current, jd(e), new Wp(t);
	}, e.version = "19.2.6";
})), y = /* @__PURE__ */ o(((e) => {
	process.env.NODE_ENV !== "production" && (function() {
		function t(e, t) {
			for (e = e.memoizedState; e !== null && 0 < t;) e = e.next, t--;
			return e;
		}
		function n(e, t, r, i) {
			if (r >= t.length) return i;
			var a = t[r], o = Uf(e) ? e.slice() : W({}, e);
			return o[a] = n(e[a], t, r + 1, i), o;
		}
		function r(e, t, n) {
			if (t.length !== n.length) console.warn("copyWithRename() expects paths of the same length");
			else {
				for (var r = 0; r < n.length - 1; r++) if (t[r] !== n[r]) {
					console.warn("copyWithRename() expects paths to be the same except for the deepest key");
					return;
				}
				return i(e, t, n, 0);
			}
		}
		function i(e, t, n, r) {
			var a = t[r], o = Uf(e) ? e.slice() : W({}, e);
			return r + 1 === t.length ? (o[n[r]] = o[a], Uf(o) ? o.splice(a, 1) : delete o[a]) : o[a] = i(e[a], t, n, r + 1), o;
		}
		function a(e, t, n) {
			var r = t[n], i = Uf(e) ? e.slice() : W({}, e);
			return n + 1 === t.length ? (Uf(i) ? i.splice(r, 1) : delete i[r], i) : (i[r] = a(e[r], t, n + 1), i);
		}
		function o() {
			return !1;
		}
		function s() {
			return null;
		}
		function c() {
			console.error("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://react.dev/link/rules-of-hooks");
		}
		function l() {
			console.error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
		}
		function u() {}
		function f() {}
		function p(e) {
			var t = [];
			return e.forEach(function(e) {
				t.push(e);
			}), t.sort().join(", ");
		}
		function h(e, t, n, r) {
			return new mr(e, t, n, r);
		}
		function g(e, t) {
			e.context === Mg && (Xd(e.current, 2, t, e, null, null), rl());
		}
		function v(e, t) {
			if (Ng !== null) {
				var n = t.staleFamilies;
				t = t.updatedFamilies, kl(), pr(e.current, t, n), rl();
			}
		}
		function y(e) {
			Ng = e;
		}
		function b(e) {
			return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
		}
		function x(e) {
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
		function ee(e) {
			if (e.tag === 13) {
				var t = e.memoizedState;
				if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
			}
			return null;
		}
		function te(e) {
			if (e.tag === 31) {
				var t = e.memoizedState;
				if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
			}
			return null;
		}
		function S(e) {
			if (x(e) !== e) throw Error("Unable to find node on an unmounted component.");
		}
		function C(e) {
			var t = e.alternate;
			if (!t) {
				if (t = x(e), t === null) throw Error("Unable to find node on an unmounted component.");
				return t === e ? e : null;
			}
			for (var n = e, r = t;;) {
				var i = n.return;
				if (i === null) break;
				var a = i.alternate;
				if (a === null) {
					if (r = i.return, r !== null) {
						n = r;
						continue;
					}
					break;
				}
				if (i.child === a.child) {
					for (a = i.child; a;) {
						if (a === n) return S(i), e;
						if (a === r) return S(i), t;
						a = a.sibling;
					}
					throw Error("Unable to find node on an unmounted component.");
				}
				if (n.return !== r.return) n = i, r = a;
				else {
					for (var o = !1, s = i.child; s;) {
						if (s === n) {
							o = !0, n = i, r = a;
							break;
						}
						if (s === r) {
							o = !0, r = i, n = a;
							break;
						}
						s = s.sibling;
					}
					if (!o) {
						for (s = a.child; s;) {
							if (s === n) {
								o = !0, n = a, r = i;
								break;
							}
							if (s === r) {
								o = !0, r = a, n = i;
								break;
							}
							s = s.sibling;
						}
						if (!o) throw Error("Child was not found in either parent set. This indicates a bug in React related to the return pointer. Please file an issue.");
					}
				}
				if (n.alternate !== r) throw Error("Return fibers should always be each others' alternates. This error is likely caused by a bug in React. Please file an issue.");
			}
			if (n.tag !== 3) throw Error("Unable to find node on an unmounted component.");
			return n.stateNode.current === n ? e : t;
		}
		function ne(e) {
			var t = e.tag;
			if (t === 5 || t === 26 || t === 27 || t === 6) return e;
			for (e = e.child; e !== null;) {
				if (t = ne(e), t !== null) return t;
				e = e.sibling;
			}
			return null;
		}
		function re(e) {
			return typeof e != "object" || !e ? null : (e = Vf && e[Vf] || e["@@iterator"], typeof e == "function" ? e : null);
		}
		function w(e) {
			if (e == null) return null;
			if (typeof e == "function") return e.$$typeof === Hf ? null : e.displayName || e.name || null;
			if (typeof e == "string") return e;
			switch (e) {
				case kf: return "Fragment";
				case jf: return "Profiler";
				case Af: return "StrictMode";
				case Ff: return "Suspense";
				case If: return "SuspenseList";
				case zf: return "Activity";
			}
			if (typeof e == "object") switch (typeof e.tag == "number" && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), e.$$typeof) {
				case Of: return "Portal";
				case Nf: return e.displayName || "Context";
				case Mf: return (e._context.displayName || "Context") + ".Consumer";
				case Pf:
					var t = e.render;
					return e = e.displayName, e ||= (e = t.displayName || t.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
				case Lf: return t = e.displayName || null, t === null ? w(e.type) || "Memo" : t;
				case Rf:
					t = e._payload, e = e._init;
					try {
						return w(e(t));
					} catch {}
			}
			return null;
		}
		function ie(e) {
			return typeof e.tag == "number" ? T(e) : typeof e.name == "string" ? e.name : null;
		}
		function T(e) {
			var t = e.type;
			switch (e.tag) {
				case 31: return "Activity";
				case 24: return "Cache";
				case 9: return (t._context.displayName || "Context") + ".Consumer";
				case 10: return t.displayName || "Context";
				case 18: return "DehydratedFragment";
				case 11: return e = t.render, e = e.displayName || e.name || "", t.displayName || (e === "" ? "ForwardRef" : "ForwardRef(" + e + ")");
				case 7: return "Fragment";
				case 26:
				case 27:
				case 5: return t;
				case 4: return "Portal";
				case 3: return "Root";
				case 6: return "Text";
				case 16: return w(t);
				case 8: return t === Af ? "StrictMode" : "Mode";
				case 22: return "Offscreen";
				case 12: return "Profiler";
				case 21: return "Scope";
				case 13: return "Suspense";
				case 19: return "SuspenseList";
				case 25: return "TracingMarker";
				case 1:
				case 0:
				case 14:
				case 15:
					if (typeof t == "function") return t.displayName || t.name || null;
					if (typeof t == "string") return t;
					break;
				case 29:
					if (t = e._debugInfo, t != null) {
						for (var n = t.length - 1; 0 <= n; n--) if (typeof t[n].name == "string") return t[n].name;
					}
					if (e.return !== null) return T(e.return);
			}
			return null;
		}
		function E(e) {
			return { current: e };
		}
		function D(e, t) {
			0 > Jf ? console.error("Unexpected pop.") : (t !== qf[Jf] && console.error("Unexpected Fiber popped."), e.current = Kf[Jf], Kf[Jf] = null, qf[Jf] = null, Jf--);
		}
		function O(e, t, n) {
			Jf++, Kf[Jf] = e.current, qf[Jf] = n, e.current = t;
		}
		function ae(e) {
			return e === null && console.error("Expected host context to exist. This error is likely caused by a bug in React. Please file an issue."), e;
		}
		function oe(e, t) {
			O(Zf, t, e), O(Xf, e, e), O(Yf, null, e);
			var n = t.nodeType;
			switch (n) {
				case 9:
				case 11:
					n = n === 9 ? "#document" : "#fragment", t = (t = t.documentElement) && (t = t.namespaceURI) ? Lu(t) : WS;
					break;
				default: if (n = t.tagName, t = t.namespaceURI) t = Lu(t), t = Ru(t, n);
				else switch (n) {
					case "svg":
						t = GS;
						break;
					case "math":
						t = KS;
						break;
					default: t = WS;
				}
			}
			n = n.toLowerCase(), n = zt(null, n), n = {
				context: t,
				ancestorInfo: n
			}, D(Yf, e), O(Yf, n, e);
		}
		function k(e) {
			D(Yf, e), D(Xf, e), D(Zf, e);
		}
		function A() {
			return ae(Yf.current);
		}
		function se(e) {
			e.memoizedState !== null && O(Qf, e, e);
			var t = ae(Yf.current), n = e.type, r = Ru(t.context, n);
			n = zt(t.ancestorInfo, n), r = {
				context: r,
				ancestorInfo: n
			}, t !== r && (O(Xf, e, e), O(Yf, r, e));
		}
		function ce(e) {
			Xf.current === e && (D(Yf, e), D(Xf, e)), Qf.current === e && (D(Qf, e), xC._currentValue = bC);
		}
		function le() {}
		function ue() {
			if ($f === 0) {
				ep = console.log, tp = console.info, np = console.warn, rp = console.error, ip = console.group, ap = console.groupCollapsed, op = console.groupEnd;
				var e = {
					configurable: !0,
					enumerable: !0,
					value: le,
					writable: !0
				};
				Object.defineProperties(console, {
					info: e,
					log: e,
					warn: e,
					error: e,
					group: e,
					groupCollapsed: e,
					groupEnd: e
				});
			}
			$f++;
		}
		function j() {
			if ($f--, $f === 0) {
				var e = {
					configurable: !0,
					enumerable: !0,
					writable: !0
				};
				Object.defineProperties(console, {
					log: W({}, e, { value: ep }),
					info: W({}, e, { value: tp }),
					warn: W({}, e, { value: np }),
					error: W({}, e, { value: rp }),
					group: W({}, e, { value: ip }),
					groupCollapsed: W({}, e, { value: ap }),
					groupEnd: W({}, e, { value: op })
				});
			}
			0 > $f && console.error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
		}
		function M(e) {
			var t = Error.prepareStackTrace;
			if (Error.prepareStackTrace = void 0, e = e.stack, Error.prepareStackTrace = t, e.startsWith("Error: react-stack-top-frame\n") && (e = e.slice(29)), t = e.indexOf("\n"), t !== -1 && (e = e.slice(t + 1)), t = e.indexOf("react_stack_bottom_frame"), t !== -1 && (t = e.lastIndexOf("\n", t)), t !== -1) e = e.slice(0, t);
			else return "";
			return e;
		}
		function de(e) {
			if (sp === void 0) try {
				throw Error();
			} catch (e) {
				var t = e.stack.trim().match(/\n( *(at )?)/);
				sp = t && t[1] || "", cp = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
			}
			return "\n" + sp + e + cp;
		}
		function fe(e, t) {
			if (!e || lp) return "";
			var n = up.get(e);
			if (n !== void 0) return n;
			lp = !0, n = Error.prepareStackTrace, Error.prepareStackTrace = void 0;
			var r = null;
			r = G.H, G.H = null, ue();
			try {
				var i = { DetermineComponentFrameRoot: function() {
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
				i.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
				var a = Object.getOwnPropertyDescriptor(i.DetermineComponentFrameRoot, "name");
				a && a.configurable && Object.defineProperty(i.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
				var o = i.DetermineComponentFrameRoot(), s = o[0], c = o[1];
				if (s && c) {
					var l = s.split("\n"), u = c.split("\n");
					for (o = a = 0; a < l.length && !l[a].includes("DetermineComponentFrameRoot");) a++;
					for (; o < u.length && !u[o].includes("DetermineComponentFrameRoot");) o++;
					if (a === l.length || o === u.length) for (a = l.length - 1, o = u.length - 1; 1 <= a && 0 <= o && l[a] !== u[o];) o--;
					for (; 1 <= a && 0 <= o; a--, o--) if (l[a] !== u[o]) {
						if (a !== 1 || o !== 1) do
							if (a--, o--, 0 > o || l[a] !== u[o]) {
								var d = "\n" + l[a].replace(" at new ", " at ");
								return e.displayName && d.includes("<anonymous>") && (d = d.replace("<anonymous>", e.displayName)), typeof e == "function" && up.set(e, d), d;
							}
						while (1 <= a && 0 <= o);
						break;
					}
				}
			} finally {
				lp = !1, G.H = r, j(), Error.prepareStackTrace = n;
			}
			return l = (l = e ? e.displayName || e.name : "") ? de(l) : "", typeof e == "function" && up.set(e, l), l;
		}
		function pe(e, t) {
			switch (e.tag) {
				case 26:
				case 27:
				case 5: return de(e.type);
				case 16: return de("Lazy");
				case 13: return e.child !== t && t !== null ? de("Suspense Fallback") : de("Suspense");
				case 19: return de("SuspenseList");
				case 0:
				case 15: return fe(e.type, !1);
				case 11: return fe(e.type.render, !1);
				case 1: return fe(e.type, !0);
				case 31: return de("Activity");
				default: return "";
			}
		}
		function me(e) {
			try {
				var t = "", n = null;
				do {
					t += pe(e, n);
					var r = e._debugInfo;
					if (r) for (var i = r.length - 1; 0 <= i; i--) {
						var a = r[i];
						if (typeof a.name == "string") {
							var o = t;
							a: {
								var s = a.name, c = a.env, l = a.debugLocation;
								if (l != null) {
									var u = M(l), d = u.lastIndexOf("\n"), f = d === -1 ? u : u.slice(d + 1);
									if (f.indexOf(s) !== -1) {
										var p = "\n" + f;
										break a;
									}
								}
								p = de(s + (c ? " [" + c + "]" : ""));
							}
							t = o + p;
						}
					}
					n = e, e = e.return;
				} while (e);
				return t;
			} catch (e) {
				return "\nError generating stack: " + e.message + "\n" + e.stack;
			}
		}
		function he(e) {
			return (e = e ? e.displayName || e.name : "") ? de(e) : "";
		}
		function ge() {
			if (dp === null) return null;
			var e = dp._debugOwner;
			return e == null ? null : ie(e);
		}
		function _e() {
			if (dp === null) return "";
			var e = dp;
			try {
				var t = "";
				switch (e.tag === 6 && (e = e.return), e.tag) {
					case 26:
					case 27:
					case 5:
						t += de(e.type);
						break;
					case 13:
						t += de("Suspense");
						break;
					case 19:
						t += de("SuspenseList");
						break;
					case 31:
						t += de("Activity");
						break;
					case 30:
					case 0:
					case 15:
					case 1:
						e._debugOwner || t !== "" || (t += he(e.type));
						break;
					case 11: e._debugOwner || t !== "" || (t += he(e.type.render));
				}
				for (; e;) if (typeof e.tag == "number") {
					var n = e;
					e = n._debugOwner;
					var r = n._debugStack;
					if (e && r) {
						var i = M(r);
						i !== "" && (t += "\n" + i);
					}
				} else if (e.debugStack != null) {
					var a = e.debugStack;
					(e = e.owner) && a && (t += "\n" + M(a));
				} else break;
				var o = t;
			} catch (e) {
				o = "\nError generating stack: " + e.message + "\n" + e.stack;
			}
			return o;
		}
		function N(e, t, n, r, i, a, o) {
			var s = dp;
			ve(e);
			try {
				return e !== null && e._debugTask ? e._debugTask.run(t.bind(null, n, r, i, a, o)) : t(n, r, i, a, o);
			} finally {
				ve(s);
			}
			throw Error("runWithFiberInDEV should never be called in production. This is a bug in React.");
		}
		function ve(e) {
			G.getCurrentStack = e === null ? null : _e, fp = !1, dp = e;
		}
		function ye(e) {
			return typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
		}
		function be(e) {
			try {
				return xe(e), !1;
			} catch {
				return !0;
			}
		}
		function xe(e) {
			return "" + e;
		}
		function P(e, t) {
			if (be(e)) return console.error("The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before using it here.", t, ye(e)), xe(e);
		}
		function Se(e, t) {
			if (be(e)) return console.error("The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before using it here.", t, ye(e)), xe(e);
		}
		function Ce(e) {
			if (be(e)) return console.error("Form field values (value, checked, defaultValue, or defaultChecked props) must be strings, not %s. This value must be coerced to a string before using it here.", ye(e)), xe(e);
		}
		function we(e) {
			if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u") return !1;
			var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
			if (t.isDisabled) return !0;
			if (!t.supportsFiber) return console.error("The installed version of React DevTools is too old and will not work with the current version of React. Please update React DevTools. https://react.dev/link/react-devtools"), !0;
			try {
				Dp = t.inject(e), Op = t;
			} catch (e) {
				console.error("React instrumentation encountered an error: %o.", e);
			}
			return !!t.checkDCE;
		}
		function Te(e) {
			if (typeof Tp == "function" && Ep(e), Op && typeof Op.setStrictMode == "function") try {
				Op.setStrictMode(Dp, e);
			} catch (e) {
				kp || (kp = !0, console.error("React instrumentation encountered an error: %o", e));
			}
		}
		function Ee(e) {
			return e >>>= 0, e === 0 ? 32 : 31 - (Mp(e) / Np | 0) | 0;
		}
		function De(e) {
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
				default: return console.error("Should have found matching lanes. This is a bug in React."), e;
			}
		}
		function Oe(e, t, n) {
			var r = e.pendingLanes;
			if (r === 0) return 0;
			var i = 0, a = e.suspendedLanes, o = e.pingedLanes;
			e = e.warmLanes;
			var s = r & 134217727;
			return s === 0 ? (s = r & ~a, s === 0 ? o === 0 ? n || (n = r & ~e, n !== 0 && (i = De(n))) : i = De(o) : i = De(s)) : (r = s & ~a, r === 0 ? (o &= s, o === 0 ? n || (n = s & ~e, n !== 0 && (i = De(n))) : i = De(o)) : i = De(r)), i === 0 ? 0 : t !== 0 && t !== i && (t & a) === 0 && (a = i & -i, n = t & -t, a >= n || a === 32 && n & 4194048) ? t : i;
		}
		function ke(e, t) {
			return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
		}
		function Ae(e, t) {
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
				default: return console.error("Should have found matching lanes. This is a bug in React."), -1;
			}
		}
		function je() {
			var e = Ip;
			return Ip <<= 1, !(Ip & 62914560) && (Ip = 4194304), e;
		}
		function Me(e) {
			for (var t = [], n = 0; 31 > n; n++) t.push(e);
			return t;
		}
		function Ne(e, t) {
			e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
		}
		function Pe(e, t, n, r, i, a) {
			var o = e.pendingLanes;
			e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
			var s = e.entanglements, c = e.expirationTimes, l = e.hiddenUpdates;
			for (n = o & ~n; 0 < n;) {
				var u = 31 - jp(n), d = 1 << u;
				s[u] = 0, c[u] = -1;
				var f = l[u];
				if (f !== null) for (l[u] = null, u = 0; u < f.length; u++) {
					var p = f[u];
					p !== null && (p.lane &= -536870913);
				}
				n &= ~d;
			}
			r !== 0 && Fe(e, r, 0), a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
		}
		function Fe(e, t, n) {
			e.pendingLanes |= t, e.suspendedLanes &= ~t;
			var r = 31 - jp(t);
			e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 1073741824 | n & 261930;
		}
		function Ie(e, t) {
			var n = e.entangledLanes |= t;
			for (e = e.entanglements; n;) {
				var r = 31 - jp(n), i = 1 << r;
				i & t | e[r] & t && (e[r] |= t), n &= ~i;
			}
		}
		function Le(e, t) {
			var n = t & -t;
			return n = n & 42 ? 1 : Re(n), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
		}
		function Re(e) {
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
		function ze(e, t, n) {
			if (Ap) for (e = e.pendingUpdatersLaneMap; 0 < n;) {
				var r = 31 - jp(n), i = 1 << r;
				e[r].add(t), n &= ~i;
			}
		}
		function Be(e, t) {
			if (Ap) for (var n = e.pendingUpdatersLaneMap, r = e.memoizedUpdaters; 0 < t;) {
				var i = 31 - jp(t);
				e = 1 << i, i = n[i], 0 < i.size && (i.forEach(function(e) {
					var t = e.alternate;
					t !== null && r.has(t) || r.add(e);
				}), i.clear()), t &= ~e;
			}
		}
		function Ve(e) {
			return e &= -e, Lp !== 0 && Lp < e ? Rp !== 0 && Rp < e ? e & 134217727 ? zp : Bp : Rp : Lp;
		}
		function He() {
			var e = Wf.p;
			return e === 0 ? (e = window.event, e === void 0 ? zp : cf(e.type)) : e;
		}
		function Ue(e, t) {
			var n = Wf.p;
			try {
				return Wf.p = e, t();
			} finally {
				Wf.p = n;
			}
		}
		function We(e) {
			delete e[Hp], delete e[Up], delete e[Gp], delete e[Kp], delete e[qp];
		}
		function Ge(e) {
			var t = e[Hp];
			if (t) return t;
			for (var n = e.parentNode; n;) {
				if (t = n[Wp] || n[Hp]) {
					if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = vd(e); e !== null;) {
						if (n = e[Hp]) return n;
						e = vd(e);
					}
					return t;
				}
				e = n, n = e.parentNode;
			}
			return null;
		}
		function Ke(e) {
			if (e = e[Hp] || e[Wp]) {
				var t = e.tag;
				if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
			}
			return null;
		}
		function qe(e) {
			var t = e.tag;
			if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
			throw Error("getNodeFromInstance: Invalid argument.");
		}
		function Je(e) {
			var t = e[Jp];
			return t ||= e[Jp] = {
				hoistableStyles: /* @__PURE__ */ new Map(),
				hoistableScripts: /* @__PURE__ */ new Map()
			}, t;
		}
		function Ye(e) {
			e[Yp] = !0;
		}
		function Xe(e, t) {
			Ze(e, t), Ze(e + "Capture", t);
		}
		function Ze(e, t) {
			Zp[e] && console.error("EventRegistry: More than one plugin attempted to publish the same registration name, `%s`.", e), Zp[e] = t;
			var n = e.toLowerCase();
			for (Qp[n] = e, e === "onDoubleClick" && (Qp.ondblclick = e), e = 0; e < t.length; e++) Xp.add(t[e]);
		}
		function Qe(e, t) {
			$p[t.type] || t.onChange || t.onInput || t.readOnly || t.disabled || t.value == null || console.error(e === "select" ? "You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set `onChange`." : "You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."), t.onChange || t.readOnly || t.disabled || t.checked == null || console.error("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
		}
		function $e(e) {
			return pp.call(nm, e) ? !0 : pp.call(tm, e) ? !1 : em.test(e) ? nm[e] = !0 : (tm[e] = !0, console.error("Invalid attribute name: `%s`", e), !1);
		}
		function et(e, t, n) {
			if ($e(t)) {
				if (!e.hasAttribute(t)) {
					switch (typeof n) {
						case "symbol":
						case "object": return n;
						case "function": return n;
						case "boolean": if (!1 === n) return n;
					}
					return n === void 0 ? void 0 : null;
				}
				return e = e.getAttribute(t), e === "" && !0 === n ? !0 : (P(n, t), e === "" + n ? n : e);
			}
		}
		function tt(e, t, n) {
			if ($e(t)) if (n === null) e.removeAttribute(t);
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
				P(n, t), e.setAttribute(t, "" + n);
			}
		}
		function nt(e, t, n) {
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
				P(n, t), e.setAttribute(t, "" + n);
			}
		}
		function rt(e, t, n, r) {
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
				P(r, n), e.setAttributeNS(t, n, "" + r);
			}
		}
		function it(e) {
			switch (typeof e) {
				case "bigint":
				case "boolean":
				case "number":
				case "string":
				case "undefined": return e;
				case "object": return Ce(e), e;
				default: return "";
			}
		}
		function at(e) {
			var t = e.type;
			return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
		}
		function ot(e, t, n) {
			var r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
			if (!e.hasOwnProperty(t) && r !== void 0 && typeof r.get == "function" && typeof r.set == "function") {
				var i = r.get, a = r.set;
				return Object.defineProperty(e, t, {
					configurable: !0,
					get: function() {
						return i.call(this);
					},
					set: function(e) {
						Ce(e), n = "" + e, a.call(this, e);
					}
				}), Object.defineProperty(e, t, { enumerable: r.enumerable }), {
					getValue: function() {
						return n;
					},
					setValue: function(e) {
						Ce(e), n = "" + e;
					},
					stopTracking: function() {
						e._valueTracker = null, delete e[t];
					}
				};
			}
		}
		function st(e) {
			if (!e._valueTracker) {
				var t = at(e) ? "checked" : "value";
				e._valueTracker = ot(e, t, "" + e[t]);
			}
		}
		function ct(e) {
			if (!e) return !1;
			var t = e._valueTracker;
			if (!t) return !0;
			var n = t.getValue(), r = "";
			return e && (r = at(e) ? e.checked ? "true" : "false" : e.value), e = r, e === n ? !1 : (t.setValue(e), !0);
		}
		function lt(e) {
			if (e ||= typeof document < "u" ? document : void 0, e === void 0) return null;
			try {
				return e.activeElement || e.body;
			} catch {
				return e.body;
			}
		}
		function ut(e) {
			return e.replace(rm, function(e) {
				return "\\" + e.charCodeAt(0).toString(16) + " ";
			});
		}
		function dt(e, t) {
			t.checked === void 0 || t.defaultChecked === void 0 || am || (console.error("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://react.dev/link/controlled-components", ge() || "A component", t.type), am = !0), t.value === void 0 || t.defaultValue === void 0 || im || (console.error("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://react.dev/link/controlled-components", ge() || "A component", t.type), im = !0);
		}
		function ft(e, t, n, r, i, a, o, s) {
			e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? (P(o, "type"), e.type = o) : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + it(t)) : e.value !== "" + it(t) && (e.value = "" + it(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : mt(e, o, it(n)) : mt(e, o, it(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? (P(s, "name"), e.name = "" + it(s)) : e.removeAttribute("name");
		}
		function pt(e, t, n, r, i, a, o, s) {
			if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (P(a, "type"), e.type = a), t != null || n != null) {
				if (!(a !== "submit" && a !== "reset" || t != null)) {
					st(e);
					return;
				}
				n = n == null ? "" : "" + it(n), t = t == null ? n : "" + it(t), s || t === e.value || (e.value = t), e.defaultValue = t;
			}
			r ??= i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (P(o, "name"), e.name = o), st(e);
		}
		function mt(e, t, n) {
			t === "number" && lt(e.ownerDocument) === e || e.defaultValue === "" + n || (e.defaultValue = "" + n);
		}
		function ht(e, t) {
			t.value ?? (typeof t.children == "object" && t.children !== null ? wf.Children.forEach(t.children, function(e) {
				e == null || typeof e == "string" || typeof e == "number" || typeof e == "bigint" || sm || (sm = !0, console.error("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>."));
			}) : t.dangerouslySetInnerHTML == null || cm || (cm = !0, console.error("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected."))), t.selected == null || om || (console.error("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>."), om = !0);
		}
		function gt() {
			var e = ge();
			return e ? "\n\nCheck the render method of `" + e + "`." : "";
		}
		function _t(e, t, n, r) {
			if (e = e.options, t) {
				t = {};
				for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
				for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
			} else {
				for (n = "" + it(n), t = null, i = 0; i < e.length; i++) {
					if (e[i].value === n) {
						e[i].selected = !0, r && (e[i].defaultSelected = !0);
						return;
					}
					t !== null || e[i].disabled || (t = e[i]);
				}
				t !== null && (t.selected = !0);
			}
		}
		function vt(e, t) {
			for (e = 0; e < um.length; e++) {
				var n = um[e];
				if (t[n] != null) {
					var r = Uf(t[n]);
					t.multiple && !r ? console.error("The `%s` prop supplied to <select> must be an array if `multiple` is true.%s", n, gt()) : !t.multiple && r && console.error("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.%s", n, gt());
				}
			}
			t.value === void 0 || t.defaultValue === void 0 || lm || (console.error("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://react.dev/link/controlled-components"), lm = !0);
		}
		function yt(e, t) {
			t.value === void 0 || t.defaultValue === void 0 || dm || (console.error("%s contains a textarea with both value and defaultValue props. Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://react.dev/link/controlled-components", ge() || "A component"), dm = !0), t.children != null && t.value == null && console.error("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
		}
		function bt(e, t, n) {
			if (t != null && (t = "" + it(t), t !== e.value && (e.value = t), n == null)) {
				e.defaultValue !== t && (e.defaultValue = t);
				return;
			}
			e.defaultValue = n == null ? "" : "" + it(n);
		}
		function xt(e, t, n, r) {
			if (t == null) {
				if (r != null) {
					if (n != null) throw Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
					if (Uf(r)) {
						if (1 < r.length) throw Error("<textarea> can only have at most one child.");
						r = r[0];
					}
					n = r;
				}
				n ??= "", t = n;
			}
			n = it(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), st(e);
		}
		function St(e, t) {
			return e.serverProps === void 0 && e.serverTail.length === 0 && e.children.length === 1 && 3 < e.distanceFromLeaf && e.distanceFromLeaf > 15 - t ? St(e.children[0], t) : e;
		}
		function Ct(e) {
			return "  " + "  ".repeat(e);
		}
		function wt(e) {
			return "+ " + "  ".repeat(e);
		}
		function Tt(e) {
			return "- " + "  ".repeat(e);
		}
		function Et(e) {
			switch (e.tag) {
				case 26:
				case 27:
				case 5: return e.type;
				case 16: return "Lazy";
				case 31: return "Activity";
				case 13: return "Suspense";
				case 19: return "SuspenseList";
				case 0:
				case 15: return e = e.type, e.displayName || e.name || null;
				case 11: return e = e.type.render, e.displayName || e.name || null;
				case 1: return e = e.type, e.displayName || e.name || null;
				default: return null;
			}
		}
		function Dt(e, t) {
			return fm.test(e) ? (e = JSON.stringify(e), e.length > t - 2 ? 8 > t ? "{\"...\"}" : "{" + e.slice(0, t - 7) + "...\"}" : "{" + e + "}") : e.length > t ? 5 > t ? "{\"...\"}" : e.slice(0, t - 3) + "..." : e;
		}
		function Ot(e, t, n) {
			var r = 120 - 2 * n;
			if (t === null) return wt(n) + Dt(e, r) + "\n";
			if (typeof t == "string") {
				for (var i = 0; i < t.length && i < e.length && t.charCodeAt(i) === e.charCodeAt(i); i++);
				return i > r - 8 && 10 < i && (e = "..." + e.slice(i - 8), t = "..." + t.slice(i - 8)), wt(n) + Dt(e, r) + "\n" + Tt(n) + Dt(t, r) + "\n";
			}
			return Ct(n) + Dt(e, r) + "\n";
		}
		function kt(e) {
			return Object.prototype.toString.call(e).replace(/^\[object (.*)\]$/, function(e, t) {
				return t;
			});
		}
		function At(e, t) {
			switch (typeof e) {
				case "string": return e = JSON.stringify(e), e.length > t ? 5 > t ? "\"...\"" : e.slice(0, t - 4) + "...\"" : e;
				case "object":
					if (e === null) return "null";
					if (Uf(e)) return "[...]";
					if (e.$$typeof === Df) return (t = w(e.type)) ? "<" + t + ">" : "<...>";
					var n = kt(e);
					if (n === "Object") {
						for (var r in n = "", t -= 2, e) if (e.hasOwnProperty(r)) {
							var i = JSON.stringify(r);
							if (i !== "\"" + r + "\"" && (r = i), t -= r.length - 2, i = At(e[r], 15 > t ? t : 15), t -= i.length, 0 > t) {
								n += n === "" ? "..." : ", ...";
								break;
							}
							n += (n === "" ? "" : ",") + r + ":" + i;
						}
						return "{" + n + "}";
					}
					return n;
				case "function": return (t = e.displayName || e.name) ? "function " + t : "function";
				default: return String(e);
			}
		}
		function jt(e, t) {
			return typeof e != "string" || fm.test(e) ? "{" + At(e, t - 2) + "}" : e.length > t - 2 ? 5 > t ? "\"...\"" : "\"" + e.slice(0, t - 5) + "...\"" : "\"" + e + "\"";
		}
		function Mt(e, t, n) {
			var r = 120 - n.length - e.length, i = [], a;
			for (a in t) if (t.hasOwnProperty(a) && a !== "children") {
				var o = jt(t[a], 120 - n.length - a.length - 1);
				r -= a.length + o.length + 2, i.push(a + "=" + o);
			}
			return i.length === 0 ? n + "<" + e + ">\n" : 0 < r ? n + "<" + e + " " + i.join(" ") + ">\n" : n + "<" + e + "\n" + n + "  " + i.join("\n" + n + "  ") + "\n" + n + ">\n";
		}
		function Nt(e, t, n) {
			var r = "", i = W({}, t), a;
			for (a in e) if (e.hasOwnProperty(a)) {
				delete i[a];
				var o = 120 - 2 * n - a.length - 2, s = At(e[a], o);
				t.hasOwnProperty(a) ? (o = At(t[a], o), r += wt(n) + a + ": " + s + "\n", r += Tt(n) + a + ": " + o + "\n") : r += wt(n) + a + ": " + s + "\n";
			}
			for (var c in i) i.hasOwnProperty(c) && (e = At(i[c], 120 - 2 * n - c.length - 2), r += Tt(n) + c + ": " + e + "\n");
			return r;
		}
		function Pt(e, t, n, r) {
			var i = "", a = /* @__PURE__ */ new Map();
			for (l in n) n.hasOwnProperty(l) && a.set(l.toLowerCase(), l);
			if (a.size === 1 && a.has("children")) i += Mt(e, t, Ct(r));
			else {
				for (var o in t) if (t.hasOwnProperty(o) && o !== "children") {
					var s = 120 - 2 * (r + 1) - o.length - 1, c = a.get(o.toLowerCase());
					if (c !== void 0) {
						a.delete(o.toLowerCase());
						var l = t[o];
						c = n[c];
						var u = jt(l, s);
						s = jt(c, s), typeof l == "object" && l && typeof c == "object" && c && kt(l) === "Object" && kt(c) === "Object" && (2 < Object.keys(l).length || 2 < Object.keys(c).length || -1 < u.indexOf("...") || -1 < s.indexOf("...")) ? i += Ct(r + 1) + o + "={{\n" + Nt(l, c, r + 2) + Ct(r + 1) + "}}\n" : (i += wt(r + 1) + o + "=" + u + "\n", i += Tt(r + 1) + o + "=" + s + "\n");
					} else i += Ct(r + 1) + o + "=" + jt(t[o], s) + "\n";
				}
				a.forEach(function(e) {
					if (e !== "children") {
						var t = 120 - 2 * (r + 1) - e.length - 1;
						i += Tt(r + 1) + e + "=" + jt(n[e], t) + "\n";
					}
				}), i = i === "" ? Ct(r) + "<" + e + ">\n" : Ct(r) + "<" + e + "\n" + i + Ct(r) + ">\n";
			}
			return e = n.children, t = t.children, typeof e == "string" || typeof e == "number" || typeof e == "bigint" ? (a = "", (typeof t == "string" || typeof t == "number" || typeof t == "bigint") && (a = "" + t), i += Ot(a, "" + e, r + 1)) : (typeof t == "string" || typeof t == "number" || typeof t == "bigint") && (i = e == null ? i + Ot("" + t, null, r + 1) : i + Ot("" + t, void 0, r + 1)), i;
		}
		function Ft(e, t) {
			var n = Et(e);
			if (n === null) {
				for (n = "", e = e.child; e;) n += Ft(e, t), e = e.sibling;
				return n;
			}
			return Ct(t) + "<" + n + ">\n";
		}
		function It(e, t) {
			var n = St(e, t);
			if (n !== e && (e.children.length !== 1 || e.children[0] !== n)) return Ct(t) + "...\n" + It(n, t + 1);
			n = "";
			var r = e.fiber._debugInfo;
			if (r) for (var i = 0; i < r.length; i++) {
				var a = r[i].name;
				typeof a == "string" && (n += Ct(t) + "<" + a + ">\n", t++);
			}
			if (r = "", i = e.fiber.pendingProps, e.fiber.tag === 6) r = Ot(i, e.serverProps, t), t++;
			else if (a = Et(e.fiber), a !== null) if (e.serverProps === void 0) {
				r = t;
				var o = 120 - 2 * r - a.length - 2, s = "";
				for (l in i) if (i.hasOwnProperty(l) && l !== "children") {
					var c = jt(i[l], 15);
					if (o -= l.length + c.length + 2, 0 > o) {
						s += " ...";
						break;
					}
					s += " " + l + "=" + c;
				}
				r = Ct(r) + "<" + a + s + ">\n", t++;
			} else e.serverProps === null ? (r = Mt(a, i, wt(t)), t++) : typeof e.serverProps == "string" ? console.error("Should not have matched a non HostText fiber to a Text node. This is a bug in React.") : (r = Pt(a, i, e.serverProps, t), t++);
			var l = "";
			for (i = e.fiber.child, a = 0; i && a < e.children.length;) o = e.children[a], o.fiber === i ? (l += It(o, t), a++) : l += Ft(i, t), i = i.sibling;
			for (i && 0 < e.children.length && (l += Ct(t) + "...\n"), i = e.serverTail, e.serverProps === null && t--, e = 0; e < i.length; e++) a = i[e], l = typeof a == "string" ? l + (Tt(t) + Dt(a, 120 - 2 * t) + "\n") : l + Mt(a.type, a.props, Tt(t));
			return n + r + l;
		}
		function Lt(e) {
			try {
				return "\n\n" + It(e, 0);
			} catch {
				return "";
			}
		}
		function Rt(e, t, n) {
			for (var r = t, i = null, a = 0; r;) r === e && (a = 0), i = {
				fiber: r,
				children: i === null ? [] : [i],
				serverProps: r === t ? n : r === e ? null : void 0,
				serverTail: [],
				distanceFromLeaf: a
			}, a++, r = r.return;
			return i === null ? "" : Lt(i).replaceAll(/^[+-]/gm, ">");
		}
		function zt(e, t) {
			var n = W({}, e || _m), r = { tag: t };
			return mm.indexOf(t) !== -1 && (n.aTagInScope = null, n.buttonTagInScope = null, n.nobrTagInScope = null), hm.indexOf(t) !== -1 && (n.pTagInButtonScope = null), pm.indexOf(t) !== -1 && t !== "address" && t !== "div" && t !== "p" && (n.listItemTagAutoclosing = null, n.dlItemTagAutoclosing = null), n.current = r, t === "form" && (n.formTag = r), t === "a" && (n.aTagInScope = r), t === "button" && (n.buttonTagInScope = r), t === "nobr" && (n.nobrTagInScope = r), t === "p" && (n.pTagInButtonScope = r), t === "li" && (n.listItemTagAutoclosing = r), (t === "dd" || t === "dt") && (n.dlItemTagAutoclosing = r), t === "#document" || t === "html" ? n.containerTagInScope = null : n.containerTagInScope ||= r, e !== null || t !== "#document" && t !== "html" && t !== "body" ? !0 === n.implicitRootScope && (n.implicitRootScope = !1) : n.implicitRootScope = !0, n;
		}
		function Bt(e, t, n) {
			switch (t) {
				case "select": return e === "hr" || e === "option" || e === "optgroup" || e === "script" || e === "template" || e === "#text";
				case "optgroup": return e === "option" || e === "#text";
				case "option": return e === "#text";
				case "tr": return e === "th" || e === "td" || e === "style" || e === "script" || e === "template";
				case "tbody":
				case "thead":
				case "tfoot": return e === "tr" || e === "style" || e === "script" || e === "template";
				case "colgroup": return e === "col" || e === "template";
				case "table": return e === "caption" || e === "colgroup" || e === "tbody" || e === "tfoot" || e === "thead" || e === "style" || e === "script" || e === "template";
				case "head": return e === "base" || e === "basefont" || e === "bgsound" || e === "link" || e === "meta" || e === "title" || e === "noscript" || e === "noframes" || e === "style" || e === "script" || e === "template";
				case "html":
					if (n) break;
					return e === "head" || e === "body" || e === "frameset";
				case "frameset": return e === "frame";
				case "#document": if (!n) return e === "html";
			}
			switch (e) {
				case "h1":
				case "h2":
				case "h3":
				case "h4":
				case "h5":
				case "h6": return t !== "h1" && t !== "h2" && t !== "h3" && t !== "h4" && t !== "h5" && t !== "h6";
				case "rp":
				case "rt": return gm.indexOf(t) === -1;
				case "caption":
				case "col":
				case "colgroup":
				case "frameset":
				case "frame":
				case "tbody":
				case "td":
				case "tfoot":
				case "th":
				case "thead":
				case "tr": return t == null;
				case "head": return n || t === null;
				case "html": return n && t === "#document" || t === null;
				case "body": return n && (t === "#document" || t === "html") || t === null;
			}
			return !0;
		}
		function Vt(e, t) {
			switch (e) {
				case "address":
				case "article":
				case "aside":
				case "blockquote":
				case "center":
				case "details":
				case "dialog":
				case "dir":
				case "div":
				case "dl":
				case "fieldset":
				case "figcaption":
				case "figure":
				case "footer":
				case "header":
				case "hgroup":
				case "main":
				case "menu":
				case "nav":
				case "ol":
				case "p":
				case "section":
				case "summary":
				case "ul":
				case "pre":
				case "listing":
				case "table":
				case "hr":
				case "xmp":
				case "h1":
				case "h2":
				case "h3":
				case "h4":
				case "h5":
				case "h6": return t.pTagInButtonScope;
				case "form": return t.formTag || t.pTagInButtonScope;
				case "li": return t.listItemTagAutoclosing;
				case "dd":
				case "dt": return t.dlItemTagAutoclosing;
				case "button": return t.buttonTagInScope;
				case "a": return t.aTagInScope;
				case "nobr": return t.nobrTagInScope;
			}
			return null;
		}
		function F(e, t) {
			for (; e;) {
				switch (e.tag) {
					case 5:
					case 26:
					case 27: if (e.type === t) return e;
				}
				e = e.return;
			}
			return null;
		}
		function Ht(e, t) {
			t ||= _m;
			var n = t.current;
			if (t = (n = Bt(e, n && n.tag, t.implicitRootScope) ? null : n) ? null : Vt(e, t), t = n || t, !t) return !0;
			var r = t.tag;
			if (t = String(!!n) + "|" + e + "|" + r, vm[t]) return !1;
			vm[t] = !0;
			var i = (t = dp) ? F(t.return, r) : null, a = t !== null && i !== null ? Rt(i, t, null) : "", o = "<" + e + ">";
			return n ? (n = "", r === "table" && e === "tr" && (n += " Add a <tbody>, <thead> or <tfoot> to your code to match the DOM tree generated by the browser."), console.error("In HTML, %s cannot be a child of <%s>.%s\nThis will cause a hydration error.%s", o, r, n, a)) : console.error("In HTML, %s cannot be a descendant of <%s>.\nThis will cause a hydration error.%s", o, r, a), t && (e = t.return, i === null || e === null || i === e && e._debugOwner === t._debugOwner || N(i, function() {
				console.error("<%s> cannot contain a nested %s.\nSee this log for the ancestor stack trace.", r, o);
			})), !1;
		}
		function Ut(e, t, n) {
			if (n || Bt("#text", t, !1)) return !0;
			if (n = "#text|" + t, vm[n]) return !1;
			vm[n] = !0;
			var r = (n = dp) ? F(n, t) : null;
			return n = n !== null && r !== null ? Rt(r, n, n.tag === 6 ? null : { children: null }) : "", /\S/.test(e) ? console.error("In HTML, text nodes cannot be a child of <%s>.\nThis will cause a hydration error.%s", t, n) : console.error("In HTML, whitespace text nodes cannot be a child of <%s>. Make sure you don't have any extra whitespace between tags on each line of your source code.\nThis will cause a hydration error.%s", t, n), !1;
		}
		function Wt(e, t) {
			if (t) {
				var n = e.firstChild;
				if (n && n === e.lastChild && n.nodeType === 3) {
					n.nodeValue = t;
					return;
				}
			}
			e.textContent = t;
		}
		function Gt(e) {
			return e.replace(wm, function(e, t) {
				return t.toUpperCase();
			});
		}
		function Kt(e, t, n) {
			var r = t.indexOf("--") === 0;
			r || (-1 < t.indexOf("-") ? Em.hasOwnProperty(t) && Em[t] || (Em[t] = !0, console.error("Unsupported style property %s. Did you mean %s?", t, Gt(t.replace(Cm, "ms-")))) : Sm.test(t) ? Em.hasOwnProperty(t) && Em[t] || (Em[t] = !0, console.error("Unsupported vendor-prefixed style property %s. Did you mean %s?", t, t.charAt(0).toUpperCase() + t.slice(1))) : !Tm.test(n) || Dm.hasOwnProperty(n) && Dm[n] || (Dm[n] = !0, console.error("Style property values shouldn't contain a semicolon. Try \"%s: %s\" instead.", t, n.replace(Tm, ""))), typeof n == "number" && (isNaN(n) ? Om || (Om = !0, console.error("`NaN` is an invalid value for the `%s` css style property.", t)) : isFinite(n) || km || (km = !0, console.error("`Infinity` is an invalid value for the `%s` css style property.", t)))), n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || Am.has(t) ? t === "float" ? e.cssFloat = n : (Se(n, t), e[t] = ("" + n).trim()) : e[t] = n + "px";
		}
		function qt(e, t, n) {
			if (t != null && typeof t != "object") throw Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
			if (t && Object.freeze(t), e = e.style, n != null) {
				if (t) {
					var r = {};
					if (n) {
						for (var i in n) if (n.hasOwnProperty(i) && !t.hasOwnProperty(i)) for (var a = ym[i] || [i], o = 0; o < a.length; o++) r[a[o]] = i;
					}
					for (var s in t) if (t.hasOwnProperty(s) && (!n || n[s] !== t[s])) for (i = ym[s] || [s], a = 0; a < i.length; a++) r[i[a]] = s;
					for (var c in s = {}, t) for (i = ym[c] || [c], a = 0; a < i.length; a++) s[i[a]] = c;
					for (var l in c = {}, r) if (i = r[l], (a = s[l]) && i !== a && (o = i + "," + a, !c[o])) {
						c[o] = !0, o = console;
						var u = t[i];
						o.error.call(o, "%s a style property during rerender (%s) when a conflicting property is set (%s) can lead to styling bugs. To avoid this, don't mix shorthand and non-shorthand properties for the same value; instead, replace the shorthand with separate values.", u == null || typeof u == "boolean" || u === "" ? "Removing" : "Updating", i, a);
					}
				}
				for (var d in n) !n.hasOwnProperty(d) || t != null && t.hasOwnProperty(d) || (d.indexOf("--") === 0 ? e.setProperty(d, "") : d === "float" ? e.cssFloat = "" : e[d] = "");
				for (var f in t) l = t[f], t.hasOwnProperty(f) && n[f] !== l && Kt(e, f, l);
			} else for (r in t) t.hasOwnProperty(r) && Kt(e, r, t[r]);
		}
		function Jt(e) {
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
		function Yt(e) {
			return Nm.get(e) || e;
		}
		function Xt(e, t) {
			if (pp.call(Im, t) && Im[t]) return !0;
			if (Rm.test(t)) {
				if (e = "aria-" + t.slice(4).toLowerCase(), e = Fm.hasOwnProperty(e) ? e : null, e == null) return console.error("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", t), Im[t] = !0;
				if (t !== e) return console.error("Invalid ARIA attribute `%s`. Did you mean `%s`?", t, e), Im[t] = !0;
			}
			if (Lm.test(t)) {
				if (e = t.toLowerCase(), e = Fm.hasOwnProperty(e) ? e : null, e == null) return Im[t] = !0, !1;
				t !== e && (console.error("Unknown ARIA attribute `%s`. Did you mean `%s`?", t, e), Im[t] = !0);
			}
			return !0;
		}
		function Zt(e, t) {
			var n = [], r;
			for (r in t) Xt(e, r) || n.push(r);
			t = n.map(function(e) {
				return "`" + e + "`";
			}).join(", "), n.length === 1 ? console.error("Invalid aria prop %s on <%s> tag. For details, see https://react.dev/link/invalid-aria-props", t, e) : 1 < n.length && console.error("Invalid aria props %s on <%s> tag. For details, see https://react.dev/link/invalid-aria-props", t, e);
		}
		function Qt(e, t, n, r) {
			if (pp.call(Bm, t) && Bm[t]) return !0;
			var i = t.toLowerCase();
			if (i === "onfocusin" || i === "onfocusout") return console.error("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React."), Bm[t] = !0;
			if (typeof n == "function" && (e === "form" && t === "action" || e === "input" && t === "formAction" || e === "button" && t === "formAction")) return !0;
			if (r != null) {
				if (e = r.possibleRegistrationNames, r.registrationNameDependencies.hasOwnProperty(t)) return !0;
				if (r = e.hasOwnProperty(i) ? e[i] : null, r != null) return console.error("Invalid event handler property `%s`. Did you mean `%s`?", t, r), Bm[t] = !0;
				if (Vm.test(t)) return console.error("Unknown event handler property `%s`. It will be ignored.", t), Bm[t] = !0;
			} else if (Vm.test(t)) return Hm.test(t) && console.error("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", t), Bm[t] = !0;
			if (Um.test(t) || Wm.test(t)) return !0;
			if (i === "innerhtml") return console.error("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`."), Bm[t] = !0;
			if (i === "aria") return console.error("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead."), Bm[t] = !0;
			if (i === "is" && n != null && typeof n != "string") return console.error("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof n), Bm[t] = !0;
			if (typeof n == "number" && isNaN(n)) return console.error("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", t), Bm[t] = !0;
			if (Pm.hasOwnProperty(i)) {
				if (i = Pm[i], i !== t) return console.error("Invalid DOM property `%s`. Did you mean `%s`?", t, i), Bm[t] = !0;
			} else if (t !== i) return console.error("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", t, i), Bm[t] = !0;
			switch (t) {
				case "dangerouslySetInnerHTML":
				case "children":
				case "style":
				case "suppressContentEditableWarning":
				case "suppressHydrationWarning":
				case "defaultValue":
				case "defaultChecked":
				case "innerHTML":
				case "ref": return !0;
				case "innerText":
				case "textContent": return !0;
			}
			switch (typeof n) {
				case "boolean": switch (t) {
					case "autoFocus":
					case "checked":
					case "multiple":
					case "muted":
					case "selected":
					case "contentEditable":
					case "spellCheck":
					case "draggable":
					case "value":
					case "autoReverse":
					case "externalResourcesRequired":
					case "focusable":
					case "preserveAlpha":
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
					case "capture":
					case "download":
					case "inert": return !0;
					default: return i = t.toLowerCase().slice(0, 5), i === "data-" || i === "aria-" ? !0 : (n ? console.error("Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s=\"%s\" or %s={value.toString()}.", n, t, t, n, t) : console.error("Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s=\"%s\" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.", n, t, t, n, t, t, t), Bm[t] = !0);
				}
				case "function":
				case "symbol": return Bm[t] = !0, !1;
				case "string": if (n === "false" || n === "true") {
					switch (t) {
						case "checked":
						case "selected":
						case "multiple":
						case "muted":
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
						case "inert": break;
						default: return !0;
					}
					console.error("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", n, t, n === "false" ? "The browser will interpret it as a truthy value." : "Although this works, it will not work as expected if you pass the string \"false\".", t, n), Bm[t] = !0;
				}
			}
			return !0;
		}
		function I(e, t, n) {
			var r = [], i;
			for (i in t) Qt(e, i, t[i], n) || r.push(i);
			t = r.map(function(e) {
				return "`" + e + "`";
			}).join(", "), r.length === 1 ? console.error("Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://react.dev/link/attribute-behavior ", t, e) : 1 < r.length && console.error("Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://react.dev/link/attribute-behavior ", t, e);
		}
		function $t(e) {
			return Gm.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
		}
		function en() {}
		function tn(e) {
			return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
		}
		function nn(e) {
			var t = Ke(e);
			if (t && (e = t.stateNode)) {
				var n = e[Up] || null;
				a: switch (e = t.stateNode, t.type) {
					case "input":
						if (ft(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
							for (n = e; n.parentNode;) n = n.parentNode;
							for (P(t, "name"), n = n.querySelectorAll("input[name=\"" + ut("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
								var r = n[t];
								if (r !== e && r.form === e.form) {
									var i = r[Up] || null;
									if (!i) throw Error("ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported.");
									ft(r, i.value, i.defaultValue, i.defaultValue, i.checked, i.defaultChecked, i.type, i.name);
								}
							}
							for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && ct(r);
						}
						break a;
					case "textarea":
						bt(e, n.value, n.defaultValue);
						break a;
					case "select": t = n.value, t != null && _t(e, !!n.multiple, t, !1);
				}
			}
		}
		function rn(e, t, n) {
			if (Ym) return e(t, n);
			Ym = !0;
			try {
				return e(t);
			} finally {
				if (Ym = !1, (qm !== null || Jm !== null) && (rl(), qm && (t = qm, e = Jm, Jm = qm = null, nn(t), e))) for (t = 0; t < e.length; t++) nn(e[t]);
			}
		}
		function an(e, t) {
			var n = e.stateNode;
			if (n === null) return null;
			var r = n[Up] || null;
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
			if (n && typeof n != "function") throw Error("Expected `" + t + "` listener to be a function, instead got a value of `" + typeof n + "` type.");
			return n;
		}
		function on() {
			if (th) return th;
			var e, t = eh, n = t.length, r, i = "value" in $m ? $m.value : $m.textContent, a = i.length;
			for (e = 0; e < n && t[e] === i[e]; e++);
			var o = n - e;
			for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
			return th = i.slice(e, 1 < r ? 1 - r : void 0);
		}
		function L(e) {
			var t = e.keyCode;
			return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
		}
		function sn() {
			return !0;
		}
		function cn() {
			return !1;
		}
		function ln(e) {
			function t(t, n, r, i, a) {
				for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
				return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? sn : cn, this.isPropagationStopped = cn, this;
			}
			return W(t.prototype, {
				preventDefault: function() {
					this.defaultPrevented = !0;
					var e = this.nativeEvent;
					e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = sn);
				},
				stopPropagation: function() {
					var e = this.nativeEvent;
					e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = sn);
				},
				persist: function() {},
				isPersistent: sn
			}), t;
		}
		function un(e) {
			var t = this.nativeEvent;
			return t.getModifierState ? t.getModifierState(e) : (e = yh[e]) ? !!t[e] : !1;
		}
		function dn() {
			return un;
		}
		function fn(e, t) {
			switch (e) {
				case "keyup": return Eh.indexOf(t.keyCode) !== -1;
				case "keydown": return t.keyCode !== Dh;
				case "keypress":
				case "mousedown":
				case "focusout": return !0;
				default: return !1;
			}
		}
		function pn(e) {
			return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
		}
		function mn(e, t) {
			switch (e) {
				case "compositionend": return pn(t);
				case "keypress": return t.which === Mh ? (Ph = !0, Nh) : null;
				case "textInput": return e = t.data, e === Nh && Ph ? null : e;
				default: return null;
			}
		}
		function hn(e, t) {
			if (Fh) return e === "compositionend" || !Oh && fn(e, t) ? (e = on(), th = eh = $m = null, Fh = !1, e) : null;
			switch (e) {
				case "paste": return null;
				case "keypress":
					if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
						if (t.char && 1 < t.char.length) return t.char;
						if (t.which) return String.fromCharCode(t.which);
					}
					return null;
				case "compositionend": return jh && t.locale !== "ko" ? null : t.data;
				default: return null;
			}
		}
		function gn(e) {
			var t = e && e.nodeName && e.nodeName.toLowerCase();
			return t === "input" ? !!Ih[e.type] : t === "textarea";
		}
		function _n(e) {
			if (!Xm) return !1;
			e = "on" + e;
			var t = e in document;
			return t ||= (t = document.createElement("div"), t.setAttribute(e, "return;"), typeof t[e] == "function"), t;
		}
		function vn(e, t, n, r) {
			qm ? Jm ? Jm.push(r) : Jm = [r] : qm = r, t = uu(t, "onChange"), 0 < t.length && (n = new rh("onChange", "change", null, n, r), e.push({
				event: n,
				listeners: t
			}));
		}
		function yn(e) {
			iu(e, 0);
		}
		function bn(e) {
			if (ct(qe(e))) return e;
		}
		function xn(e, t) {
			if (e === "change") return t;
		}
		function Sn() {
			Lh && (Lh.detachEvent("onpropertychange", Cn), Rh = Lh = null);
		}
		function Cn(e) {
			if (e.propertyName === "value" && bn(Rh)) {
				var t = [];
				vn(t, Rh, e, tn(e)), rn(yn, t);
			}
		}
		function wn(e, t, n) {
			e === "focusin" ? (Sn(), Lh = t, Rh = n, Lh.attachEvent("onpropertychange", Cn)) : e === "focusout" && Sn();
		}
		function Tn(e) {
			if (e === "selectionchange" || e === "keyup" || e === "keydown") return bn(Rh);
		}
		function En(e, t) {
			if (e === "click") return bn(t);
		}
		function Dn(e, t) {
			if (e === "input" || e === "change") return bn(t);
		}
		function On(e, t) {
			return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
		}
		function kn(e, t) {
			if (Bh(e, t)) return !0;
			if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
			var n = Object.keys(e), r = Object.keys(t);
			if (n.length !== r.length) return !1;
			for (r = 0; r < n.length; r++) {
				var i = n[r];
				if (!pp.call(t, i) || !Bh(e[i], t[i])) return !1;
			}
			return !0;
		}
		function An(e) {
			for (; e && e.firstChild;) e = e.firstChild;
			return e;
		}
		function jn(e, t) {
			var n = An(e);
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
				n = An(n);
			}
		}
		function Mn(e, t) {
			return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Mn(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
		}
		function Nn(e) {
			e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
			for (var t = lt(e.document); t instanceof e.HTMLIFrameElement;) {
				try {
					var n = typeof t.contentWindow.location.href == "string";
				} catch {
					n = !1;
				}
				if (n) e = t.contentWindow;
				else break;
				t = lt(e.document);
			}
			return t;
		}
		function Pn(e) {
			var t = e && e.nodeName && e.nodeName.toLowerCase();
			return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
		}
		function Fn(e, t, n) {
			var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
			Gh || Hh == null || Hh !== lt(r) || (r = Hh, "selectionStart" in r && Pn(r) ? r = {
				start: r.selectionStart,
				end: r.selectionEnd
			} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
				anchorNode: r.anchorNode,
				anchorOffset: r.anchorOffset,
				focusNode: r.focusNode,
				focusOffset: r.focusOffset
			}), Wh && kn(Wh, r) || (Wh = r, r = uu(Uh, "onSelect"), 0 < r.length && (t = new rh("onSelect", "select", null, t, n), e.push({
				event: t,
				listeners: r
			}), t.target = Hh)));
		}
		function In(e, t) {
			var n = {};
			return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
		}
		function Ln(e) {
			if (qh[e]) return qh[e];
			if (!Kh[e]) return e;
			var t = Kh[e], n;
			for (n in t) if (t.hasOwnProperty(n) && n in Jh) return qh[e] = t[n];
			return e;
		}
		function Rn(e, t) {
			ng.set(e, t), Xe(t, [e]);
		}
		function zn(e) {
			for (var t = ug, n = 0; n < e.length; n++) {
				var r = e[n];
				if (typeof r == "object" && r) if (Uf(r) && r.length === 2 && typeof r[0] == "string") {
					if (t !== ug && t !== pg) return dg;
					t = pg;
				} else return dg;
				else {
					if (typeof r == "function" || typeof r == "string" && 50 < r.length || t !== ug && t !== fg) return dg;
					t = fg;
				}
			}
			return t;
		}
		function Bn(e, t, n, r) {
			for (var i in e) pp.call(e, i) && i[0] !== "_" && Vn(i, e[i], t, n, r);
		}
		function Vn(e, t, n, r, i) {
			switch (typeof t) {
				case "object": if (t === null) {
					t = "null";
					break;
				} else {
					if (t.$$typeof === Df) {
						var a = w(t.type) || "…", o = t.key;
						t = t.props;
						var s = Object.keys(t), c = s.length;
						if (o == null && c === 0) {
							t = "<" + a + " />";
							break;
						}
						if (3 > r || c === 1 && s[0] === "children" && o == null) {
							t = "<" + a + " … />";
							break;
						}
						for (var l in n.push([i + "\xA0\xA0".repeat(r) + e, "<" + a]), o !== null && Vn("key", o, n, r + 1, i), e = !1, t) l === "children" ? t.children != null && (!Uf(t.children) || 0 < t.children.length) && (e = !0) : pp.call(t, l) && l[0] !== "_" && Vn(l, t[l], n, r + 1, i);
						n.push(["", e ? ">…</" + a + ">" : "/>"]);
						return;
					}
					if (a = Object.prototype.toString.call(t), a = a.slice(8, a.length - 1), a === "Array") {
						if (l = zn(t), l === fg || l === ug) {
							t = JSON.stringify(t);
							break;
						} else if (l === pg) {
							for (n.push([i + "\xA0\xA0".repeat(r) + e, ""]), e = 0; e < t.length; e++) a = t[e], Vn(a[0], a[1], n, r + 1, i);
							return;
						}
					}
					if (a === "Promise") {
						if (t.status === "fulfilled") {
							if (a = n.length, Vn(e, t.value, n, r, i), n.length > a) {
								n = n[a], n[1] = "Promise<" + (n[1] || "Object") + ">";
								return;
							}
						} else if (t.status === "rejected" && (a = n.length, Vn(e, t.reason, n, r, i), n.length > a)) {
							n = n[a], n[1] = "Rejected Promise<" + n[1] + ">";
							return;
						}
						n.push(["\xA0\xA0".repeat(r) + e, "Promise"]);
						return;
					}
					a === "Object" && (l = Object.getPrototypeOf(t)) && typeof l.constructor == "function" && (a = l.constructor.name), n.push([i + "\xA0\xA0".repeat(r) + e, a === "Object" ? 3 > r ? "" : "…" : a]), 3 > r && Bn(t, n, r + 1, i);
					return;
				}
				case "function":
					t = t.name === "" ? "() => {}" : t.name + "() {}";
					break;
				case "string":
					t = t === lg ? "…" : JSON.stringify(t);
					break;
				case "undefined":
					t = "undefined";
					break;
				case "boolean":
					t = t ? "true" : "false";
					break;
				default: t = String(t);
			}
			n.push([i + "\xA0\xA0".repeat(r) + e, t]);
		}
		function Hn(e, t, n, r) {
			var i = !0;
			for (o in e) o in t || (n.push([mg + "\xA0\xA0".repeat(r) + o, "…"]), i = !1);
			for (var a in t) if (a in e) {
				var o = e[a], s = t[a];
				if (o !== s) {
					if (r === 0 && a === "children") i = "\xA0\xA0".repeat(r) + a, n.push([mg + i, "…"], [hg + i, "…"]);
					else {
						if (!(3 <= r)) {
							if (typeof o == "object" && typeof s == "object" && o !== null && s !== null && o.$$typeof === s.$$typeof) if (s.$$typeof === Df) {
								if (o.type === s.type && o.key === s.key) {
									o = w(s.type) || "…", i = "\xA0\xA0".repeat(r) + a, o = "<" + o + " … />", n.push([mg + i, o], [hg + i, o]), i = !1;
									continue;
								}
							} else {
								var c = Object.prototype.toString.call(o), l = Object.prototype.toString.call(s);
								if (c === l && (l === "[object Object]" || l === "[object Array]")) {
									c = [gg + "\xA0\xA0".repeat(r) + a, l === "[object Array]" ? "Array" : ""], n.push(c), l = n.length, Hn(o, s, n, r + 1) ? l === n.length && (c[1] = "Referentially unequal but deeply equal objects. Consider memoization.") : i = !1;
									continue;
								}
							}
							else if (typeof o == "function" && typeof s == "function" && o.name === s.name && o.length === s.length && (c = Function.prototype.toString.call(o), l = Function.prototype.toString.call(s), c === l)) {
								o = s.name === "" ? "() => {}" : s.name + "() {}", n.push([gg + "\xA0\xA0".repeat(r) + a, o + " Referentially unequal function closure. Consider memoization."]);
								continue;
							}
						}
						Vn(a, o, n, r, mg), Vn(a, s, n, r, hg);
					}
					i = !1;
				}
			} else n.push([hg + "\xA0\xA0".repeat(r) + a, "…"]), i = !1;
			return i;
		}
		function Un(e) {
			bg = e & 63 ? "Blocking" : e & 64 ? "Gesture" : e & 4194176 ? "Transition" : e & 62914560 ? "Suspense" : e & 2080374784 ? "Idle" : "Other";
		}
		function Wn(e, t, n, r) {
			_g && (Cg.start = t, Cg.end = n, Sg.color = "warning", Sg.tooltipText = r, Sg.properties = null, (e = e._debugTask) ? e.run(performance.measure.bind(performance, r, Cg)) : performance.measure(r, Cg));
		}
		function Gn(e, t, n) {
			Wn(e, t, n, "Reconnect");
		}
		function Kn(e, t, n, r, i) {
			var a = T(e);
			if (a !== null && _g) {
				var o = e.alternate, s = e.actualDuration;
				if (o === null || o.child !== e.child) for (var c = e.child; c !== null; c = c.sibling) s -= c.actualDuration;
				r = .5 > s ? r ? "tertiary-light" : "primary-light" : 10 > s ? r ? "tertiary" : "primary" : 100 > s ? r ? "tertiary-dark" : "primary-dark" : "error";
				var l = e.memoizedProps;
				s = e._debugTask, l !== null && o !== null && o.memoizedProps !== l ? (c = [wg], l = Hn(o.memoizedProps, l, c, 0), 1 < c.length && (l && !xg && (o.lanes & i) === 0 && 100 < e.actualDuration ? (xg = !0, c[0] = Eg, Sg.color = "warning", Sg.tooltipText = Tg) : (Sg.color = r, Sg.tooltipText = a), Sg.properties = c, Cg.start = t, Cg.end = n, s == null ? performance.measure("​" + a, Cg) : s.run(performance.measure.bind(performance, "​" + a, Cg)))) : s == null ? console.timeStamp(a, t, n, vg, void 0, r) : s.run(console.timeStamp.bind(console, a, t, n, vg, void 0, r));
			}
		}
		function qn(e, t, n, r) {
			if (_g) {
				var i = T(e);
				if (i !== null) {
					for (var a = null, o = [], s = 0; s < r.length; s++) {
						var c = r[s];
						a == null && c.source !== null && (a = c.source._debugTask), c = c.value, o.push(["Error", typeof c == "object" && c && typeof c.message == "string" ? String(c.message) : String(c)]);
					}
					e.key !== null && Vn("key", e.key, o, 0, ""), e.memoizedProps !== null && Bn(e.memoizedProps, o, 0, ""), a ??= e._debugTask, e = {
						start: t,
						end: n,
						detail: { devtools: {
							color: "error",
							track: vg,
							tooltipText: e.tag === 13 ? "Hydration failed" : "Error boundary caught an error",
							properties: o
						} }
					}, a ? a.run(performance.measure.bind(performance, "​" + i, e)) : performance.measure("​" + i, e);
				}
			}
		}
		function Jn(e, t, n, r, i) {
			if (i !== null) {
				if (_g) {
					var a = T(e);
					if (a !== null) {
						r = [];
						for (var o = 0; o < i.length; o++) {
							var s = i[o].value;
							r.push(["Error", typeof s == "object" && s && typeof s.message == "string" ? String(s.message) : String(s)]);
						}
						e.key !== null && Vn("key", e.key, r, 0, ""), e.memoizedProps !== null && Bn(e.memoizedProps, r, 0, ""), t = {
							start: t,
							end: n,
							detail: { devtools: {
								color: "error",
								track: vg,
								tooltipText: "A lifecycle or effect errored",
								properties: r
							} }
						}, (e = e._debugTask) ? e.run(performance.measure.bind(performance, "​" + a, t)) : performance.measure("​" + a, t);
					}
				}
			} else a = T(e), a !== null && _g && (i = 1 > r ? "secondary-light" : 100 > r ? "secondary" : 500 > r ? "secondary-dark" : "error", (e = e._debugTask) ? e.run(console.timeStamp.bind(console, a, t, n, vg, void 0, i)) : console.timeStamp(a, t, n, vg, void 0, i));
		}
		function Yn(e, t, n, r) {
			if (_g && !(t <= e)) {
				var i = (n & 738197653) === n ? "tertiary-dark" : "primary-dark";
				n = (n & 536870912) === n ? "Prepared" : (n & 201326741) === n ? "Hydrated" : "Render", r ? r.run(console.timeStamp.bind(console, n, e, t, bg, yg, i)) : console.timeStamp(n, e, t, bg, yg, i);
			}
		}
		function Xn(e, t, n, r) {
			!_g || t <= e || (n = (n & 738197653) === n ? "tertiary-dark" : "primary-dark", r ? r.run(console.timeStamp.bind(console, "Prewarm", e, t, bg, yg, n)) : console.timeStamp("Prewarm", e, t, bg, yg, n));
		}
		function Zn(e, t, n, r) {
			!_g || t <= e || (n = (n & 738197653) === n ? "tertiary-dark" : "primary-dark", r ? r.run(console.timeStamp.bind(console, "Suspended", e, t, bg, yg, n)) : console.timeStamp("Suspended", e, t, bg, yg, n));
		}
		function Qn(e, t, n, r, i, a) {
			if (_g && !(t <= e)) {
				n = [];
				for (var o = 0; o < r.length; o++) {
					var s = r[o].value;
					n.push(["Recoverable Error", typeof s == "object" && s && typeof s.message == "string" ? String(s.message) : String(s)]);
				}
				e = {
					start: e,
					end: t,
					detail: { devtools: {
						color: "primary-dark",
						track: bg,
						trackGroup: yg,
						tooltipText: i ? "Hydration Failed" : "Recovered after Error",
						properties: n
					} }
				}, a ? a.run(performance.measure.bind(performance, "Recovered", e)) : performance.measure("Recovered", e);
			}
		}
		function $n(e, t, n, r) {
			!_g || t <= e || (r ? r.run(console.timeStamp.bind(console, "Errored", e, t, bg, yg, "error")) : console.timeStamp("Errored", e, t, bg, yg, "error"));
		}
		function er(e, t, n, r) {
			!_g || t <= e || (r ? r.run(console.timeStamp.bind(console, n, e, t, bg, yg, "secondary-light")) : console.timeStamp(n, e, t, bg, yg, "secondary-light"));
		}
		function tr(e, t, n, r, i) {
			if (_g && !(t <= e)) {
				for (var a = [], o = 0; o < n.length; o++) {
					var s = n[o].value;
					a.push(["Error", typeof s == "object" && s && typeof s.message == "string" ? String(s.message) : String(s)]);
				}
				e = {
					start: e,
					end: t,
					detail: { devtools: {
						color: "error",
						track: bg,
						trackGroup: yg,
						tooltipText: r ? "Remaining Effects Errored" : "Commit Errored",
						properties: a
					} }
				}, i ? i.run(performance.measure.bind(performance, "Errored", e)) : performance.measure("Errored", e);
			}
		}
		function nr(e, t, n) {
			!_g || t <= e || (n ? n.run(console.timeStamp.bind(console, "Animating", e, t, bg, yg, "secondary-dark")) : console.timeStamp("Animating", e, t, bg, yg, "secondary-dark"));
		}
		function rr() {
			for (var e = Ag, t = jg = Ag = 0; t < e;) {
				var n = kg[t];
				kg[t++] = null;
				var r = kg[t];
				kg[t++] = null;
				var i = kg[t];
				kg[t++] = null;
				var a = kg[t];
				if (kg[t++] = null, r !== null && i !== null) {
					var o = r.pending;
					o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
				}
				a !== 0 && sr(n, i, a);
			}
		}
		function ir(e, t, n, r) {
			kg[Ag++] = e, kg[Ag++] = t, kg[Ag++] = n, kg[Ag++] = r, jg |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
		}
		function ar(e, t, n, r) {
			return ir(e, t, n, r), cr(e);
		}
		function or(e, t) {
			return ir(e, null, null, t), cr(e);
		}
		function sr(e, t, n) {
			e.lanes |= n;
			var r = e.alternate;
			r !== null && (r.lanes |= n);
			for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & Dg || (i = !0)), e = a, a = a.return;
			return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - jp(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
		}
		function cr(e) {
			if (qx > Kx) throw Qx = qx = 0, $x = Jx = null, Error("Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.");
			Qx > Zx && (Qx = 0, $x = null, console.error("Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.")), e.alternate === null && e.flags & 4098 && Vl(e);
			for (var t = e, n = t.return; n !== null;) t.alternate === null && t.flags & 4098 && Vl(e), t = n, n = t.return;
			return t.tag === 3 ? t.stateNode : null;
		}
		function lr(e) {
			if (Ng === null) return e;
			var t = Ng(e);
			return t === void 0 ? e : t.current;
		}
		function ur(e) {
			if (Ng === null) return e;
			var t = Ng(e);
			return t === void 0 ? e != null && typeof e.render == "function" && (t = lr(e.render), e.render !== t) ? (t = {
				$$typeof: Pf,
				render: t
			}, e.displayName !== void 0 && (t.displayName = e.displayName), t) : e : t.current;
		}
		function dr(e, t) {
			if (Ng === null) return !1;
			var n = e.elementType;
			t = t.type;
			var r = !1, i = typeof t == "object" && t ? t.$$typeof : null;
			switch (e.tag) {
				case 1:
					typeof t == "function" && (r = !0);
					break;
				case 0:
					(typeof t == "function" || i === Rf) && (r = !0);
					break;
				case 11:
					(i === Pf || i === Rf) && (r = !0);
					break;
				case 14:
				case 15:
					(i === Lf || i === Rf) && (r = !0);
					break;
				default: return !1;
			}
			return !!(r && (e = Ng(n), e !== void 0 && e === Ng(t)));
		}
		function fr(e) {
			Ng !== null && typeof WeakSet == "function" && (Pg === null && (Pg = /* @__PURE__ */ new WeakSet()), Pg.add(e));
		}
		function pr(e, t, n) {
			do {
				var r = e, i = r.alternate, a = r.child, o = r.sibling, s = r.tag;
				r = r.type;
				var c = null;
				switch (s) {
					case 0:
					case 15:
					case 1:
						c = r;
						break;
					case 11: c = r.render;
				}
				if (Ng === null) throw Error("Expected resolveFamily to be set during hot reload.");
				var l = !1;
				if (r = !1, c !== null && (c = Ng(c), c !== void 0 && (n.has(c) ? r = !0 : t.has(c) && (s === 1 ? r = !0 : l = !0))), Pg !== null && (Pg.has(e) || i !== null && Pg.has(i)) && (r = !0), r && (e._debugNeedsRemount = !0), (r || l) && (i = or(e, 2), i !== null && Qc(i, e, 2)), a === null || r || pr(a, t, n), o === null) break;
				e = o;
			} while (1);
		}
		function mr(e, t, n, r) {
			this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null, this.actualDuration = -0, this.actualStartTime = -1.1, this.treeBaseDuration = this.selfBaseDuration = -0, this._debugTask = this._debugStack = this._debugOwner = this._debugInfo = null, this._debugNeedsRemount = !1, this._debugHookTypes = null, zg || typeof Object.preventExtensions != "function" || Object.preventExtensions(this);
		}
		function hr(e) {
			return e = e.prototype, !(!e || !e.isReactComponent);
		}
		function gr(e, t) {
			var n = e.alternate;
			switch (n === null ? (n = h(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n._debugOwner = e._debugOwner, n._debugStack = e._debugStack, n._debugTask = e._debugTask, n._debugHookTypes = e._debugHookTypes, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null, n.actualDuration = -0, n.actualStartTime = -1.1), n.flags = e.flags & 65011712, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
				lanes: t.lanes,
				firstContext: t.firstContext,
				_debugThenableState: t._debugThenableState
			}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n.selfBaseDuration = e.selfBaseDuration, n.treeBaseDuration = e.treeBaseDuration, n._debugInfo = e._debugInfo, n._debugNeedsRemount = e._debugNeedsRemount, n.tag) {
				case 0:
				case 15:
					n.type = lr(e.type);
					break;
				case 1:
					n.type = lr(e.type);
					break;
				case 11: n.type = ur(e.type);
			}
			return n;
		}
		function _r(e, t) {
			e.flags &= 65011714;
			var n = e.alternate;
			return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null, e.selfBaseDuration = 0, e.treeBaseDuration = 0) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
				lanes: t.lanes,
				firstContext: t.firstContext,
				_debugThenableState: t._debugThenableState
			}, e.selfBaseDuration = n.selfBaseDuration, e.treeBaseDuration = n.treeBaseDuration), e;
		}
		function vr(e, t, n, r, i, a) {
			var o = 0, s = e;
			if (typeof e == "function") hr(e) && (o = 1), s = lr(s);
			else if (typeof e == "string") o = A(), o = Bd(e, n, o) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
			else a: switch (e) {
				case zf: return t = h(31, n, t, i), t.elementType = zf, t.lanes = a, t;
				case kf: return br(n.children, i, a, t);
				case Af:
					o = 8, i |= Ig, i |= Lg;
					break;
				case jf: return e = n, r = i, typeof e.id != "string" && console.error("Profiler must specify an \"id\" of type `string` as a prop. Received the type `%s` instead.", typeof e.id), t = h(12, e, t, r | q), t.elementType = jf, t.lanes = a, t.stateNode = {
					effectDuration: 0,
					passiveEffectDuration: 0
				}, t;
				case Ff: return t = h(13, n, t, i), t.elementType = Ff, t.lanes = a, t;
				case If: return t = h(19, n, t, i), t.elementType = If, t.lanes = a, t;
				default:
					if (typeof e == "object" && e) switch (e.$$typeof) {
						case Nf:
							o = 10;
							break a;
						case Mf:
							o = 9;
							break a;
						case Pf:
							o = 11, s = ur(s);
							break a;
						case Lf:
							o = 14;
							break a;
						case Rf:
							o = 16, s = null;
							break a;
					}
					s = "", (e === void 0 || typeof e == "object" && e && Object.keys(e).length === 0) && (s += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports."), e === null ? n = "null" : Uf(e) ? n = "array" : e !== void 0 && e.$$typeof === Df ? (n = "<" + (w(e.type) || "Unknown") + " />", s = " Did you accidentally export a JSX literal instead of a component?") : n = typeof e, (o = r ? ie(r) : null) && (s += "\n\nCheck the render method of `" + o + "`."), o = 29, n = Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: " + (n + "." + s)), s = null;
			}
			return t = h(o, n, t, i), t.elementType = e, t.type = s, t.lanes = a, t._debugOwner = r, t;
		}
		function yr(e, t, n) {
			return t = vr(e.type, e.key, e.props, e._owner, t, n), t._debugOwner = e._owner, t._debugStack = e._debugStack, t._debugTask = e._debugTask, t;
		}
		function br(e, t, n, r) {
			return e = h(7, e, r, t), e.lanes = n, e;
		}
		function xr(e, t, n) {
			return e = h(6, e, null, t), e.lanes = n, e;
		}
		function Sr(e) {
			var t = h(18, null, null, K);
			return t.stateNode = e, t;
		}
		function Cr(e, t, n) {
			return t = h(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
				containerInfo: e.containerInfo,
				pendingChildren: null,
				implementation: e.implementation
			}, t;
		}
		function wr(e, t) {
			if (typeof e == "object" && e) {
				var n = Vg.get(e);
				return n === void 0 ? (t = {
					value: e,
					source: t,
					stack: me(t)
				}, Vg.set(e, t), t) : n;
			}
			return {
				value: e,
				source: t,
				stack: me(t)
			};
		}
		function Tr(e, t) {
			jr(), Hg[Ug++] = Gg, Hg[Ug++] = Wg, Wg = e, Gg = t;
		}
		function Er(e, t, n) {
			jr(), Kg[qg++] = Yg, Kg[qg++] = Xg, Kg[qg++] = Jg, Jg = e;
			var r = Yg;
			e = Xg;
			var i = 32 - jp(r) - 1;
			r &= ~(1 << i), n += 1;
			var a = 32 - jp(t) + i;
			if (30 < a) {
				var o = i - i % 5;
				a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, Yg = 1 << 32 - jp(t) + i | n << i | r, Xg = a + e;
			} else Yg = 1 << a | n << i | r, Xg = e;
		}
		function Dr(e) {
			jr(), e.return !== null && (Tr(e, 1), Er(e, 1, 0));
		}
		function Or(e) {
			for (; e === Wg;) Wg = Hg[--Ug], Hg[Ug] = null, Gg = Hg[--Ug], Hg[Ug] = null;
			for (; e === Jg;) Jg = Kg[--qg], Kg[qg] = null, Xg = Kg[--qg], Kg[qg] = null, Yg = Kg[--qg], Kg[qg] = null;
		}
		function kr() {
			return jr(), Jg === null ? null : {
				id: Yg,
				overflow: Xg
			};
		}
		function Ar(e, t) {
			jr(), Kg[qg++] = Yg, Kg[qg++] = Xg, Kg[qg++] = Jg, Yg = t.id, Xg = t.overflow, Jg = e;
		}
		function jr() {
			$g || console.error("Expected to be hydrating. This is a bug in React. Please file an issue.");
		}
		function Mr(e, t) {
			if (e.return === null) {
				if (t_ === null) t_ = {
					fiber: e,
					children: [],
					serverProps: void 0,
					serverTail: [],
					distanceFromLeaf: t
				};
				else {
					if (t_.fiber !== e) throw Error("Saw multiple hydration diff roots in a pass. This is a bug in React.");
					t_.distanceFromLeaf > t && (t_.distanceFromLeaf = t);
				}
				return t_;
			}
			var n = Mr(e.return, t + 1).children;
			return 0 < n.length && n[n.length - 1].fiber === e ? (n = n[n.length - 1], n.distanceFromLeaf > t && (n.distanceFromLeaf = t), n) : (t = {
				fiber: e,
				children: [],
				serverProps: void 0,
				serverTail: [],
				distanceFromLeaf: t
			}, n.push(t), t);
		}
		function Nr() {
			$g && console.error("We should not be hydrating here. This is a bug in React. Please file a bug.");
		}
		function Pr(e, t) {
			e_ || (e = Mr(e, 0), e.serverProps = null, t !== null && (t = hd(t), e.serverTail.push(t)));
		}
		function Fr(e) {
			var t = 1 < arguments.length && arguments[1] !== void 0 ? arguments[1] : !1, n = "", r = t_;
			throw r !== null && (t_ = null, n = Lt(r)), Vr(wr(Error("Hydration failed because the server rendered " + (t ? "text" : "HTML") + " didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:\n\n- A server/client branch `if (typeof window !== 'undefined')`.\n- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.\n- Date formatting in a user's locale which doesn't match the server.\n- External changing data without sending a snapshot of it along with the HTML.\n- Invalid HTML tag nesting.\n\nIt can also happen if the client has a browser extension installed which messes with the HTML before React loaded.\n\nhttps://react.dev/link/hydration-mismatch" + n), e)), i_;
		}
		function Ir(e) {
			var t = e.stateNode, n = e.type, r = e.memoizedProps;
			switch (t[Hp] = e, t[Up] = r, pu(n, r), n) {
				case "dialog":
					H("cancel", t), H("close", t);
					break;
				case "iframe":
				case "object":
				case "embed":
					H("load", t);
					break;
				case "video":
				case "audio":
					for (n = 0; n < pS.length; n++) H(pS[n], t);
					break;
				case "source":
					H("error", t);
					break;
				case "img":
				case "image":
				case "link":
					H("error", t), H("load", t);
					break;
				case "details":
					H("toggle", t);
					break;
				case "input":
					Qe("input", r), H("invalid", t), dt(t, r), pt(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
					break;
				case "option":
					ht(t, r);
					break;
				case "select":
					Qe("select", r), H("invalid", t), vt(t, r);
					break;
				case "textarea": Qe("textarea", r), H("invalid", t), yt(t, r), xt(t, r.value, r.defaultValue, r.children);
			}
			n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || yu(t.textContent, n) ? (r.popover != null && (H("beforetoggle", t), H("toggle", t)), r.onScroll != null && H("scroll", t), r.onScrollEnd != null && H("scrollend", t), r.onClick != null && (t.onclick = en), t = !0) : t = !1, t || Fr(e, !0);
		}
		function Lr(e) {
			for (Zg = e.return; Zg;) switch (Zg.tag) {
				case 5:
				case 31:
				case 13:
					r_ = !1;
					return;
				case 27:
				case 3:
					r_ = !0;
					return;
				default: Zg = Zg.return;
			}
		}
		function Rr(e) {
			if (e !== Zg) return !1;
			if (!$g) return Lr(e), $g = !0, !1;
			var t = e.tag, n;
			if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = !(n !== "form" && n !== "button") || zu(e.type, e.memoizedProps)), n = !n), n && Qg) {
				for (n = Qg; n;) {
					var r = Mr(e, 0), i = hd(n);
					r.serverTail.push(i), n = i.type === "Suspense" ? _d(n) : md(n.nextSibling);
				}
				Fr(e);
			}
			if (Lr(e), t === 13) {
				if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
				Qg = _d(e);
			} else if (t === 31) {
				if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
				Qg = _d(e);
			} else t === 27 ? (t = Qg, Xu(e.type) ? (e = rC, rC = null, Qg = e) : Qg = t) : Qg = Zg ? md(e.stateNode.nextSibling) : null;
			return !0;
		}
		function zr() {
			Qg = Zg = null, e_ = $g = !1;
		}
		function Br() {
			var e = n_;
			return e !== null && (hx === null ? hx = e : hx.push.apply(hx, e), n_ = null), e;
		}
		function Vr(e) {
			n_ === null ? n_ = [e] : n_.push(e);
		}
		function Hr() {
			var e = t_;
			if (e !== null) {
				t_ = null;
				for (var t = Lt(e); 0 < e.children.length;) e = e.children[0];
				N(e.fiber, function() {
					console.error("A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:\n\n- A server/client branch `if (typeof window !== 'undefined')`.\n- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.\n- Date formatting in a user's locale which doesn't match the server.\n- External changing data without sending a snapshot of it along with the HTML.\n- Invalid HTML tag nesting.\n\nIt can also happen if the client has a browser extension installed which messes with the HTML before React loaded.\n\n%s%s", "https://react.dev/link/hydration-mismatch", t);
				});
			}
		}
		function Ur() {
			l_ = c_ = null, u_ = !1;
		}
		function Wr(e, t, n) {
			O(a_, t._currentValue, e), t._currentValue = n, O(o_, t._currentRenderer, e), t._currentRenderer !== void 0 && t._currentRenderer !== null && t._currentRenderer !== s_ && console.error("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."), t._currentRenderer = s_;
		}
		function Gr(e, t) {
			e._currentValue = a_.current;
			var n = o_.current;
			D(o_, t), e._currentRenderer = n, D(a_, t);
		}
		function Kr(e, t, n) {
			for (; e !== null;) {
				var r = e.alternate;
				if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
				e = e.return;
			}
			e !== n && console.error("Expected to find the propagation root when scheduling context work. This error is likely caused by a bug in React. Please file an issue.");
		}
		function qr(e, t, n, r) {
			var i = e.child;
			for (i !== null && (i.return = e); i !== null;) {
				var a = i.dependencies;
				if (a !== null) {
					var o = i.child;
					a = a.firstContext;
					a: for (; a !== null;) {
						var s = a;
						a = i;
						for (var c = 0; c < t.length; c++) if (s.context === t[c]) {
							a.lanes |= n, s = a.alternate, s !== null && (s.lanes |= n), Kr(a.return, n, e), r || (o = null);
							break a;
						}
						a = s.next;
					}
				} else if (i.tag === 18) {
					if (o = i.return, o === null) throw Error("We just came from a parent so we must have had a parent. This is a bug in React.");
					o.lanes |= n, a = o.alternate, a !== null && (a.lanes |= n), Kr(o, n, e), o = null;
				} else o = i.child;
				if (o !== null) o.return = i;
				else for (o = i; o !== null;) {
					if (o === e) {
						o = null;
						break;
					}
					if (i = o.sibling, i !== null) {
						i.return = o.return, o = i;
						break;
					}
					o = o.return;
				}
				i = o;
			}
		}
		function Jr(e, t, n, r) {
			e = null;
			for (var i = t, a = !1; i !== null;) {
				if (!a) {
					if (i.flags & 524288) a = !0;
					else if (i.flags & 262144) break;
				}
				if (i.tag === 10) {
					var o = i.alternate;
					if (o === null) throw Error("Should have a current fiber. This is a bug in React.");
					if (o = o.memoizedProps, o !== null) {
						var s = i.type;
						Bh(i.pendingProps.value, o.value) || (e === null ? e = [s] : e.push(s));
					}
				} else if (i === Qf.current) {
					if (o = i.alternate, o === null) throw Error("Should have a current fiber. This is a bug in React.");
					o.memoizedState.memoizedState !== i.memoizedState.memoizedState && (e === null ? e = [xC] : e.push(xC));
				}
				i = i.return;
			}
			e !== null && qr(t, e, n, r), t.flags |= 262144;
		}
		function Yr(e) {
			for (e = e.firstContext; e !== null;) {
				if (!Bh(e.context._currentValue, e.memoizedValue)) return !0;
				e = e.next;
			}
			return !1;
		}
		function Xr(e) {
			c_ = e, l_ = null, e = e.dependencies, e !== null && (e.firstContext = null);
		}
		function Zr(e) {
			return u_ && console.error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo()."), $r(c_, e);
		}
		function Qr(e, t) {
			return c_ === null && Xr(e), $r(e, t);
		}
		function $r(e, t) {
			var n = t._currentValue;
			if (t = {
				context: t,
				memoizedValue: n,
				next: null
			}, l_ === null) {
				if (e === null) throw Error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
				l_ = t, e.dependencies = {
					lanes: 0,
					firstContext: t,
					_debugThenableState: null
				}, e.flags |= 524288;
			} else l_ = l_.next = t;
			return n;
		}
		function ei() {
			return {
				controller: new d_(),
				data: /* @__PURE__ */ new Map(),
				refCount: 0
			};
		}
		function ti(e) {
			e.controller.signal.aborted && console.warn("A cache instance was retained after it was already freed. This likely indicates a bug in React."), e.refCount++;
		}
		function ni(e) {
			e.refCount--, 0 > e.refCount && console.warn("A cache instance was released after it was already freed. This likely indicates a bug in React."), e.refCount === 0 && f_(p_, function() {
				e.controller.abort();
			});
		}
		function ri(e, t, n) {
			e & 127 ? 0 > k_ && (k_ = h_(), A_ = g_(t), M_ = t, n != null && (N_ = T(n)), (Ub & (Pb | Fb)) !== Nb && (D_ = !0, j_ = __), e = Hu(), t = Vu(), e !== I_ || t !== F_ ? I_ = -1.1 : t !== null && (j_ = __), P_ = e, F_ = t) : e & 4194048 && 0 > B_ && (B_ = h_(), H_ = g_(t), U_ = t, n != null && (W_ = T(n)), 0 > z_) && (e = Hu(), t = Vu(), (e !== q_ || t !== K_) && (q_ = -1.1), G_ = e, K_ = t);
		}
		function ii(e) {
			if (0 > k_) {
				k_ = h_(), A_ = e._debugTask == null ? null : e._debugTask, (Ub & (Pb | Fb)) !== Nb && (j_ = __);
				var t = Hu(), n = Vu();
				t !== I_ || n !== F_ ? I_ = -1.1 : n !== null && (j_ = __), P_ = t, F_ = n;
			}
			0 > B_ && (B_ = h_(), H_ = e._debugTask == null ? null : e._debugTask, 0 > z_) && (e = Hu(), t = Vu(), (e !== q_ || t !== K_) && (q_ = -1.1), G_ = e, K_ = t);
		}
		function ai() {
			var e = w_;
			return w_ = 0, e;
		}
		function oi(e) {
			var t = w_;
			return w_ = e, t;
		}
		function si(e) {
			var t = w_;
			return w_ += e, t;
		}
		function ci() {
			Y = J = -1.1;
		}
		function li() {
			var e = J;
			return J = -1.1, e;
		}
		function ui(e) {
			0 <= e && (J = e);
		}
		function di() {
			var e = T_;
			return T_ = -0, e;
		}
		function fi(e) {
			0 <= e && (T_ = e);
		}
		function pi() {
			var e = E_;
			return E_ = null, e;
		}
		function mi() {
			var e = D_;
			return D_ = !1, e;
		}
		function hi(e) {
			C_ = h_(), 0 > e.actualStartTime && (e.actualStartTime = C_);
		}
		function gi(e) {
			if (0 <= C_) {
				var t = h_() - C_;
				e.actualDuration += t, e.selfBaseDuration = t, C_ = -1;
			}
		}
		function _i(e) {
			if (0 <= C_) {
				var t = h_() - C_;
				e.actualDuration += t, C_ = -1;
			}
		}
		function vi() {
			if (0 <= C_) {
				var e = h_(), t = e - C_;
				C_ = -1, w_ += t, T_ += t, Y = e;
			}
		}
		function yi(e) {
			E_ === null && (E_ = []), E_.push(e), S_ === null && (S_ = []), S_.push(e);
		}
		function bi() {
			C_ = h_(), 0 > J && (J = C_);
		}
		function xi(e) {
			for (var t = e.child; t;) e.actualDuration += t.actualDuration, t = t.sibling;
		}
		function Si(e, t) {
			if (rv === null) {
				var n = rv = [];
				iv = 0, av = $l(), ov = {
					status: "pending",
					value: void 0,
					then: function(e) {
						n.push(e);
					}
				};
			}
			return iv++, t.then(Ci, Ci), t;
		}
		function Ci() {
			if (--iv === 0 && (-1 < B_ || (z_ = -1.1), rv !== null)) {
				ov !== null && (ov.status = "fulfilled");
				var e = rv;
				rv = null, av = 0, ov = null;
				for (var t = 0; t < e.length; t++) (0, e[t])();
			}
		}
		function wi(e, t) {
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
		function Ti() {
			var e = cv.current;
			return e === null ? Wb.pooledCache : e;
		}
		function Ei(e, t) {
			t === null ? O(cv, cv.current, e) : O(cv, t.pool, e);
		}
		function Di() {
			var e = Ti();
			return e === null ? null : {
				parent: m_._currentValue,
				pool: e
			};
		}
		function Oi() {
			return {
				didWarnAboutUncachedPromise: !1,
				thenables: []
			};
		}
		function ki(e) {
			return e = e.status, e === "fulfilled" || e === "rejected";
		}
		function Ai(e, t, n) {
			G.actQueue !== null && (G.didUsePromise = !0);
			var r = e.thenables;
			if (n = r[n], n === void 0 ? r.push(t) : n !== t && (e.didWarnAboutUncachedPromise || (e.didWarnAboutUncachedPromise = !0, console.error("A component was suspended by an uncached promise. Creating promises inside a Client Component or hook is not yet supported, except via a Suspense-compatible library or framework.")), t.then(en, en), t = n), t._debugInfo === void 0) {
				e = performance.now(), r = t.displayName;
				var i = {
					name: typeof r == "string" ? r : "Promise",
					start: e,
					end: e,
					value: t
				};
				t._debugInfo = [{ awaited: i }], t.status !== "fulfilled" && t.status !== "rejected" && (e = function() {
					i.end = performance.now();
				}, t.then(e, e));
			}
			switch (t.status) {
				case "fulfilled": return t.value;
				case "rejected": throw e = t.reason, Ni(e), e;
				default:
					if (typeof t.status == "string") t.then(en, en);
					else {
						if (e = Wb, e !== null && 100 < e.shellSuspendCounter) throw Error("An unknown Component is an async Client Component. Only Server Components can be async at the moment. This error is often caused by accidentally adding `'use client'` to a module that was originally written for the server.");
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
						case "rejected": throw e = t.reason, Ni(e), e;
					}
					throw Vv = t, Hv = !0, Lv;
			}
		}
		function ji(e) {
			try {
				return Iv(e);
			} catch (e) {
				throw typeof e == "object" && e && typeof e.then == "function" ? (Vv = e, Hv = !0, Lv) : e;
			}
		}
		function Mi() {
			if (Vv === null) throw Error("Expected a suspended thenable. This is a bug in React. Please file an issue.");
			var e = Vv;
			return Vv = null, Hv = !1, e;
		}
		function Ni(e) {
			if (e === Lv || e === zv) throw Error("Hooks are not supported inside an async component. This error is often caused by accidentally adding `'use client'` to a module that was originally written for the server.");
		}
		function Pi(e) {
			var t = X;
			return e != null && (X = t === null ? e : t.concat(e)), t;
		}
		function Fi() {
			var e = X;
			if (e != null) {
				for (var t = e.length - 1; 0 <= t; t--) if (e[t].name != null) {
					var n = e[t].debugTask;
					if (n != null) return n;
				}
			}
			return null;
		}
		function Ii(e, t, n) {
			for (var r = Object.keys(e.props), i = 0; i < r.length; i++) {
				var a = r[i];
				if (a !== "children" && a !== "key") {
					t === null && (t = yr(e, n.mode, 0), t._debugInfo = X, t.return = n), N(t, function(e) {
						console.error("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", e);
					}, a);
					break;
				}
			}
		}
		function Li(e) {
			var t = Wv;
			return Wv += 1, Uv === null && (Uv = Oi()), Ai(Uv, e, t);
		}
		function Ri(e, t) {
			t = t.props.ref, e.ref = t === void 0 ? null : t;
		}
		function zi(e, t) {
			throw t.$$typeof === Ef ? Error("A React Element from an older version of React was rendered. This is not supported. It can happen if:\n- Multiple copies of the \"react\" package is used.\n- A library pre-bundled an old copy of \"react\" or \"react/jsx-runtime\".\n- A compiler tries to \"inline\" JSX instead of using the runtime.") : (e = Object.prototype.toString.call(t), Error("Objects are not valid as a React child (found: " + (e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e) + "). If you meant to render a collection of children, use an array instead."));
		}
		function Bi(e, t) {
			var n = Fi();
			n === null ? zi(e, t) : n.run(zi.bind(null, e, t));
		}
		function Vi(e, t) {
			var n = T(e) || "Component";
			Jv[n] || (Jv[n] = !0, t = t.displayName || t.name || "Component", e.tag === 3 ? console.error("Functions are not valid as a React child. This may happen if you return %s instead of <%s /> from render. Or maybe you meant to call this function rather than return it.\n  root.render(%s)", t, t, t) : console.error("Functions are not valid as a React child. This may happen if you return %s instead of <%s /> from render. Or maybe you meant to call this function rather than return it.\n  <%s>{%s}</%s>", t, t, n, t, n));
		}
		function Hi(e, t) {
			var n = Fi();
			n === null ? Vi(e, t) : n.run(Vi.bind(null, e, t));
		}
		function Ui(e, t) {
			var n = T(e) || "Component";
			Yv[n] || (Yv[n] = !0, t = String(t), e.tag === 3 ? console.error("Symbols are not valid as a React child.\n  root.render(%s)", t) : console.error("Symbols are not valid as a React child.\n  <%s>%s</%s>", n, t, n));
		}
		function Wi(e, t) {
			var n = Fi();
			n === null ? Ui(e, t) : n.run(Ui.bind(null, e, t));
		}
		function Gi(e) {
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
			function i(e, t) {
				return e = gr(e, t), e.index = 0, e.sibling = null, e;
			}
			function a(t, n, r) {
				return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 67108866, n) : (r = r.index, r < n ? (t.flags |= 67108866, n) : r)) : (t.flags |= 1048576, n);
			}
			function o(t) {
				return e && t.alternate === null && (t.flags |= 67108866), t;
			}
			function s(e, t, n, r) {
				return t === null || t.tag !== 6 ? (t = xr(n, e.mode, r), t.return = e, t._debugOwner = e, t._debugTask = e._debugTask, t._debugInfo = X, t) : (t = i(t, n), t.return = e, t._debugInfo = X, t);
			}
			function c(e, t, n, r) {
				var a = n.type;
				return a === kf ? (t = u(e, t, n.props.children, r, n.key), Ii(n, t, e), t) : t !== null && (t.elementType === a || dr(t, n) || typeof a == "object" && a && a.$$typeof === Rf && ji(a) === t.type) ? (t = i(t, n.props), Ri(t, n), t.return = e, t._debugOwner = n._owner, t._debugInfo = X, t) : (t = yr(n, e.mode, r), Ri(t, n), t.return = e, t._debugInfo = X, t);
			}
			function l(e, t, n, r) {
				return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = Cr(n, e.mode, r), t.return = e, t._debugInfo = X, t) : (t = i(t, n.children || []), t.return = e, t._debugInfo = X, t);
			}
			function u(e, t, n, r, a) {
				return t === null || t.tag !== 7 ? (t = br(n, e.mode, r, a), t.return = e, t._debugOwner = e, t._debugTask = e._debugTask, t._debugInfo = X, t) : (t = i(t, n), t.return = e, t._debugInfo = X, t);
			}
			function d(e, t, n) {
				if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = xr("" + t, e.mode, n), t.return = e, t._debugOwner = e, t._debugTask = e._debugTask, t._debugInfo = X, t;
				if (typeof t == "object" && t) {
					switch (t.$$typeof) {
						case Df: return n = yr(t, e.mode, n), Ri(n, t), n.return = e, e = Pi(t._debugInfo), n._debugInfo = X, X = e, n;
						case Of: return t = Cr(t, e.mode, n), t.return = e, t._debugInfo = X, t;
						case Rf:
							var r = Pi(t._debugInfo);
							return t = ji(t), e = d(e, t, n), X = r, e;
					}
					if (Uf(t) || re(t)) return n = br(t, e.mode, n, null), n.return = e, n._debugOwner = e, n._debugTask = e._debugTask, e = Pi(t._debugInfo), n._debugInfo = X, X = e, n;
					if (typeof t.then == "function") return r = Pi(t._debugInfo), e = d(e, Li(t), n), X = r, e;
					if (t.$$typeof === Nf) return d(e, Qr(e, t), n);
					Bi(e, t);
				}
				return typeof t == "function" && Hi(e, t), typeof t == "symbol" && Wi(e, t), null;
			}
			function p(e, t, n, r) {
				var i = t === null ? null : t.key;
				if (typeof n == "string" && n !== "" || typeof n == "number" || typeof n == "bigint") return i === null ? s(e, t, "" + n, r) : null;
				if (typeof n == "object" && n) {
					switch (n.$$typeof) {
						case Df: return n.key === i ? (i = Pi(n._debugInfo), e = c(e, t, n, r), X = i, e) : null;
						case Of: return n.key === i ? l(e, t, n, r) : null;
						case Rf: return i = Pi(n._debugInfo), n = ji(n), e = p(e, t, n, r), X = i, e;
					}
					if (Uf(n) || re(n)) return i === null ? (i = Pi(n._debugInfo), e = u(e, t, n, r, null), X = i, e) : null;
					if (typeof n.then == "function") return i = Pi(n._debugInfo), e = p(e, t, Li(n), r), X = i, e;
					if (n.$$typeof === Nf) return p(e, t, Qr(e, n), r);
					Bi(e, n);
				}
				return typeof n == "function" && Hi(e, n), typeof n == "symbol" && Wi(e, n), null;
			}
			function m(e, t, n, r, i) {
				if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, s(t, e, "" + r, i);
				if (typeof r == "object" && r) {
					switch (r.$$typeof) {
						case Df: return n = e.get(r.key === null ? n : r.key) || null, e = Pi(r._debugInfo), t = c(t, n, r, i), X = e, t;
						case Of: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
						case Rf:
							var a = Pi(r._debugInfo);
							return r = ji(r), t = m(e, t, n, r, i), X = a, t;
					}
					if (Uf(r) || re(r)) return n = e.get(n) || null, e = Pi(r._debugInfo), t = u(t, n, r, i, null), X = e, t;
					if (typeof r.then == "function") return a = Pi(r._debugInfo), t = m(e, t, n, Li(r), i), X = a, t;
					if (r.$$typeof === Nf) return m(e, t, n, Qr(t, r), i);
					Bi(t, r);
				}
				return typeof r == "function" && Hi(t, r), typeof r == "symbol" && Wi(t, r), null;
			}
			function g(e, t, n, r) {
				if (typeof n != "object" || !n) return r;
				switch (n.$$typeof) {
					case Df:
					case Of:
						f(e, t, n);
						var i = n.key;
						if (typeof i != "string") break;
						if (r === null) {
							r = /* @__PURE__ */ new Set(), r.add(i);
							break;
						}
						if (!r.has(i)) {
							r.add(i);
							break;
						}
						N(t, function() {
							console.error("Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.", i);
						});
						break;
					case Rf: n = ji(n), g(e, t, n, r);
				}
				return r;
			}
			function _(i, o, s, c) {
				for (var l = null, u = null, f = null, h = o, _ = o = 0, v = null; h !== null && _ < s.length; _++) {
					h.index > _ ? (v = h, h = null) : v = h.sibling;
					var y = p(i, h, s[_], c);
					if (y === null) {
						h === null && (h = v);
						break;
					}
					l = g(i, y, s[_], l), e && h && y.alternate === null && t(i, h), o = a(y, o, _), f === null ? u = y : f.sibling = y, f = y, h = v;
				}
				if (_ === s.length) return n(i, h), $g && Tr(i, _), u;
				if (h === null) {
					for (; _ < s.length; _++) h = d(i, s[_], c), h !== null && (l = g(i, h, s[_], l), o = a(h, o, _), f === null ? u = h : f.sibling = h, f = h);
					return $g && Tr(i, _), u;
				}
				for (h = r(h); _ < s.length; _++) v = m(h, i, _, s[_], c), v !== null && (l = g(i, v, s[_], l), e && v.alternate !== null && h.delete(v.key === null ? _ : v.key), o = a(v, o, _), f === null ? u = v : f.sibling = v, f = v);
				return e && h.forEach(function(e) {
					return t(i, e);
				}), $g && Tr(i, _), u;
			}
			function v(i, o, s, c) {
				if (s == null) throw Error("An iterable object provided no iterator.");
				for (var l = null, u = null, f = o, h = o = 0, _ = null, v = null, y = s.next(); f !== null && !y.done; h++, y = s.next()) {
					f.index > h ? (_ = f, f = null) : _ = f.sibling;
					var b = p(i, f, y.value, c);
					if (b === null) {
						f === null && (f = _);
						break;
					}
					v = g(i, b, y.value, v), e && f && b.alternate === null && t(i, f), o = a(b, o, h), u === null ? l = b : u.sibling = b, u = b, f = _;
				}
				if (y.done) return n(i, f), $g && Tr(i, h), l;
				if (f === null) {
					for (; !y.done; h++, y = s.next()) f = d(i, y.value, c), f !== null && (v = g(i, f, y.value, v), o = a(f, o, h), u === null ? l = f : u.sibling = f, u = f);
					return $g && Tr(i, h), l;
				}
				for (f = r(f); !y.done; h++, y = s.next()) _ = m(f, i, h, y.value, c), _ !== null && (v = g(i, _, y.value, v), e && _.alternate !== null && f.delete(_.key === null ? h : _.key), o = a(_, o, h), u === null ? l = _ : u.sibling = _, u = _);
				return e && f.forEach(function(e) {
					return t(i, e);
				}), $g && Tr(i, h), l;
			}
			function y(e, r, a, s) {
				if (typeof a == "object" && a && a.type === kf && a.key === null && (Ii(a, null, e), a = a.props.children), typeof a == "object" && a) {
					switch (a.$$typeof) {
						case Df:
							var c = Pi(a._debugInfo);
							a: {
								for (var l = a.key; r !== null;) {
									if (r.key === l) {
										if (l = a.type, l === kf) {
											if (r.tag === 7) {
												n(e, r.sibling), s = i(r, a.props.children), s.return = e, s._debugOwner = a._owner, s._debugInfo = X, Ii(a, s, e), e = s;
												break a;
											}
										} else if (r.elementType === l || dr(r, a) || typeof l == "object" && l && l.$$typeof === Rf && ji(l) === r.type) {
											n(e, r.sibling), s = i(r, a.props), Ri(s, a), s.return = e, s._debugOwner = a._owner, s._debugInfo = X, e = s;
											break a;
										}
										n(e, r);
										break;
									} else t(e, r);
									r = r.sibling;
								}
								a.type === kf ? (s = br(a.props.children, e.mode, s, a.key), s.return = e, s._debugOwner = e, s._debugTask = e._debugTask, s._debugInfo = X, Ii(a, s, e), e = s) : (s = yr(a, e.mode, s), Ri(s, a), s.return = e, s._debugInfo = X, e = s);
							}
							return e = o(e), X = c, e;
						case Of:
							a: {
								for (c = a, a = c.key; r !== null;) {
									if (r.key === a) if (r.tag === 4 && r.stateNode.containerInfo === c.containerInfo && r.stateNode.implementation === c.implementation) {
										n(e, r.sibling), s = i(r, c.children || []), s.return = e, e = s;
										break a;
									} else {
										n(e, r);
										break;
									}
									else t(e, r);
									r = r.sibling;
								}
								s = Cr(c, e.mode, s), s.return = e, e = s;
							}
							return o(e);
						case Rf: return c = Pi(a._debugInfo), a = ji(a), e = y(e, r, a, s), X = c, e;
					}
					if (Uf(a)) return c = Pi(a._debugInfo), e = _(e, r, a, s), X = c, e;
					if (re(a)) {
						if (c = Pi(a._debugInfo), l = re(a), typeof l != "function") throw Error("An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.");
						var u = l.call(a);
						return u === a ? (e.tag !== 0 || Object.prototype.toString.call(e.type) !== "[object GeneratorFunction]" || Object.prototype.toString.call(u) !== "[object Generator]") && (Kv || console.error("Using Iterators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. You can also use an Iterable that can iterate multiple times over the same items."), Kv = !0) : a.entries !== l || Gv || (console.error("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), Gv = !0), e = v(e, r, u, s), X = c, e;
					}
					if (typeof a.then == "function") return c = Pi(a._debugInfo), e = y(e, r, Li(a), s), X = c, e;
					if (a.$$typeof === Nf) return y(e, r, Qr(e, a), s);
					Bi(e, a);
				}
				return typeof a == "string" && a !== "" || typeof a == "number" || typeof a == "bigint" ? (c = "" + a, r !== null && r.tag === 6 ? (n(e, r.sibling), s = i(r, c), s.return = e, e = s) : (n(e, r), s = xr(c, e.mode, s), s.return = e, s._debugOwner = e, s._debugTask = e._debugTask, s._debugInfo = X, e = s), o(e)) : (typeof a == "function" && Hi(e, a), typeof a == "symbol" && Wi(e, a), n(e, r));
			}
			return function(e, t, n, r) {
				var i = X;
				X = null;
				try {
					Wv = 0;
					var a = y(e, t, n, r);
					return Uv = null, a;
				} catch (t) {
					if (t === Lv || t === zv) throw t;
					var o = h(29, t, null, e.mode);
					o.lanes = r, o.return = e;
					var s = o._debugInfo = X;
					if (o._debugOwner = e._debugOwner, o._debugTask = e._debugTask, s != null) {
						for (var c = s.length - 1; 0 <= c; c--) if (typeof s[c].stack == "string") {
							o._debugOwner = s[c], o._debugTask = s[c].debugTask;
							break;
						}
					}
					return o;
				} finally {
					X = i;
				}
			};
		}
		function Ki(e, t) {
			var n = Uf(e);
			return e = !n && typeof re(e) == "function", n || e ? (n = n ? "array" : "iterable", console.error("A nested %s was passed to row #%s in <SuspenseList />. Wrap it in an additional SuspenseList to configure its revealOrder: <SuspenseList revealOrder=...> ... <SuspenseList revealOrder=...>{%s}</SuspenseList> ... </SuspenseList>", n, t, n), !1) : !0;
		}
		function qi(e) {
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
		function Ji(e, t) {
			e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
				baseState: e.baseState,
				firstBaseUpdate: e.firstBaseUpdate,
				lastBaseUpdate: e.lastBaseUpdate,
				shared: e.shared,
				callbacks: null
			});
		}
		function Yi(e) {
			return {
				lane: e,
				tag: Qv,
				payload: null,
				callback: null,
				next: null
			};
		}
		function Xi(e, t, n) {
			var r = e.updateQueue;
			if (r === null) return null;
			if (r = r.shared, iy === r && !ry) {
				var i = T(e);
				console.error("An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback.\n\nPlease update the following component: %s", i), ry = !0;
			}
			return (Ub & Pb) === Nb ? (ir(e, r, t, n), cr(e)) : (i = r.pending, i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = cr(e), sr(e, null, n), t);
		}
		function Zi(e, t, n) {
			if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
				var r = t.lanes;
				r &= e.pendingLanes, n |= r, t.lanes = n, Ie(e, n);
			}
		}
		function Qi(e, t) {
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
		function $i() {
			if (ay) {
				var e = ov;
				if (e !== null) throw e;
			}
		}
		function ea(e, t, n, r) {
			ay = !1;
			var i = e.updateQueue;
			ny = !1, iy = i.shared;
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
					if (p ? ($ & f) === f : (r & f) === f) {
						f !== 0 && f === av && (ay = !0), u !== null && (u = u.next = {
							lane: 0,
							tag: s.tag,
							payload: s.payload,
							callback: null,
							next: null
						});
						a: {
							f = e;
							var m = s, h = t, g = n;
							switch (m.tag) {
								case $v:
									if (m = m.payload, typeof m == "function") {
										u_ = !0;
										var _ = m.call(g, d, h);
										if (f.mode & Ig) {
											Te(!0);
											try {
												m.call(g, d, h);
											} finally {
												Te(!1);
											}
										}
										u_ = !1, d = _;
										break a;
									}
									d = m;
									break a;
								case ty: f.flags = f.flags & -65537 | 128;
								case Qv:
									if (_ = m.payload, typeof _ == "function") {
										if (u_ = !0, m = _.call(g, d, h), f.mode & Ig) {
											Te(!0);
											try {
												_.call(g, d, h);
											} finally {
												Te(!1);
											}
										}
										u_ = !1;
									} else m = _;
									if (m == null) break a;
									d = W({}, d, m);
									break a;
								case ey: ny = !0;
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
				u === null && (c = d), i.baseState = c, i.firstBaseUpdate = l, i.lastBaseUpdate = u, a === null && (i.shared.lanes = 0), lx |= o, e.lanes = o, e.memoizedState = d;
			}
			iy = null;
		}
		function ta(e, t) {
			if (typeof e != "function") throw Error("Invalid argument passed as callback. Expected a function. Instead received: " + e);
			e.call(t);
		}
		function na(e, t) {
			var n = e.shared.hiddenCallbacks;
			if (n !== null) for (e.shared.hiddenCallbacks = null, e = 0; e < n.length; e++) ta(n[e], t);
		}
		function ra(e, t) {
			var n = e.callbacks;
			if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) ta(n[e], t);
		}
		function ia(e, t) {
			var n = sx;
			O(sy, n, e), O(oy, t, e), sx = n | t.baseLanes;
		}
		function aa(e) {
			O(sy, sx, e), O(oy, oy.current, e);
		}
		function oa(e) {
			sx = sy.current, D(oy, e), D(sy, e);
		}
		function sa(e) {
			var t = e.alternate;
			O(fy, fy.current & uy, e), O(cy, e, e), ly === null && (t === null || oy.current !== null || t.memoizedState !== null) && (ly = e);
		}
		function ca(e) {
			O(fy, fy.current, e), O(cy, e, e), ly === null && (ly = e);
		}
		function la(e) {
			e.tag === 22 ? (O(fy, fy.current, e), O(cy, e, e), ly === null && (ly = e)) : ua(e);
		}
		function ua(e) {
			O(fy, fy.current, e), O(cy, cy.current, e);
		}
		function da(e) {
			D(cy, e), ly === e && (ly = null), D(fy, e);
		}
		function fa(e) {
			for (var t = e; t !== null;) {
				if (t.tag === 13) {
					var n = t.memoizedState;
					if (n !== null && (n = n.dehydrated, n === null || dd(n) || fd(n))) return t;
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
		function R() {
			var e = Q;
			Py === null ? Py = [e] : Py.push(e);
		}
		function z() {
			var e = Q;
			if (Py !== null && (Fy++, Py[Fy] !== e)) {
				var t = T(Z);
				if (!yy.has(t) && (yy.add(t), Py !== null)) {
					for (var n = "", r = 0; r <= Fy; r++) {
						var i = Py[r], a = r === Fy ? e : i;
						for (i = r + 1 + ". " + i; 30 > i.length;) i += " ";
						i += a + "\n", n += i;
					}
					console.error("React has detected a change in the order of Hooks called by %s. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://react.dev/link/rules-of-hooks\n\n   Previous render            Next render\n   ------------------------------------------------------\n%s   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n", t, n);
				}
			}
		}
		function pa(e) {
			e == null || Uf(e) || console.error("%s received a final argument that is not an array (instead, received `%s`). When specified, the final argument must be an array.", Q, typeof e);
		}
		function ma() {
			var e = T(Z);
			Sy.has(e) || (Sy.add(e), console.error("ReactDOM.useFormState has been renamed to React.useActionState. Please update %s to use React.useActionState.", e));
		}
		function ha() {
			throw Error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.");
		}
		function ga(e, t) {
			if (Iy) return !1;
			if (t === null) return console.error("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", Q), !1;
			e.length !== t.length && console.error("The final argument passed to %s changed size between renders. The order and size of this array must remain constant.\n\nPrevious: %s\nIncoming: %s", Q, "[" + t.join(", ") + "]", "[" + e.join(", ") + "]");
			for (var n = 0; n < t.length && n < e.length; n++) if (!Bh(e[n], t[n])) return !1;
			return !0;
		}
		function _a(e, t, n, r, i, a) {
			Cy = a, Z = t, Py = e === null ? null : e._debugHookTypes, Fy = -1, Iy = e !== null && e.type !== t.type, (Object.prototype.toString.call(n) === "[object AsyncFunction]" || Object.prototype.toString.call(n) === "[object AsyncGeneratorFunction]") && (a = T(Z), xy.has(a) || (xy.add(a), console.error("%s is an async Client Component. Only Server Components can be async at the moment. This error is often caused by accidentally adding `'use client'` to a module that was originally written for the server.", a === null ? "An unknown Component" : "<" + a + ">"))), t.memoizedState = null, t.updateQueue = null, t.lanes = 0, G.H = e !== null && e.memoizedState !== null ? By : Py === null ? Ry : zy, Oy = a = (t.mode & Ig) !== K;
			var o = bv(n, r, i);
			if (Oy = !1, Dy && (o = ya(t, n, r, i)), a) {
				Te(!0);
				try {
					o = ya(t, n, r, i);
				} finally {
					Te(!1);
				}
			}
			return va(e, t), o;
		}
		function va(e, t) {
			t._debugHookTypes = Py, t.dependencies === null ? jy !== null && (t.dependencies = {
				lanes: 0,
				firstContext: null,
				_debugThenableState: jy
			}) : t.dependencies._debugThenableState = jy, G.H = Ly;
			var n = wy !== null && wy.next !== null;
			if (Cy = 0, Py = Q = Ty = wy = Z = null, Fy = -1, e !== null && (e.flags & 65011712) != (t.flags & 65011712) && console.error("Internal React error: Expected static flag was missing. Please notify the React team."), Ey = !1, Ay = 0, jy = null, n) throw Error("Rendered fewer hooks than expected. This may be caused by an accidental early return statement.");
			e === null || ob || (e = e.dependencies, e !== null && Yr(e) && (ob = !0)), Hv ? (Hv = !1, e = !0) : e = !1, e && (t = T(t) || "Unknown", by.has(t) || xy.has(t) || (by.add(t), console.error("`use` was called from inside a try/catch block. This is not allowed and can lead to unexpected behavior. To handle errors triggered by `use`, wrap your component in a error boundary.")));
		}
		function ya(e, t, n, r) {
			Z = e;
			var i = 0;
			do {
				if (Dy && (jy = null), Ay = 0, Dy = !1, i >= Ny) throw Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
				if (i += 1, Iy = !1, Ty = wy = null, e.updateQueue != null) {
					var a = e.updateQueue;
					a.lastEffect = null, a.events = null, a.stores = null, a.memoCache != null && (a.memoCache.index = 0);
				}
				Fy = -1, G.H = Vy, a = bv(t, n, r);
			} while (Dy);
			return a;
		}
		function ba() {
			var e = G.H, t = e.useState()[0];
			return t = typeof t.then == "function" ? Da(t) : t, e = e.useState()[0], (wy === null ? null : wy.memoizedState) !== e && (Z.flags |= 1024), t;
		}
		function xa() {
			var e = ky !== 0;
			return ky = 0, e;
		}
		function Sa(e, t, n) {
			t.updateQueue = e.updateQueue, t.flags = (t.mode & Lg) === K ? t.flags & -2053 : t.flags & -402655237, e.lanes &= ~n;
		}
		function Ca(e) {
			if (Ey) {
				for (e = e.memoizedState; e !== null;) {
					var t = e.queue;
					t !== null && (t.pending = null), e = e.next;
				}
				Ey = !1;
			}
			Cy = 0, Py = Ty = wy = Z = null, Fy = -1, Q = null, Dy = !1, Ay = ky = 0, jy = null;
		}
		function wa() {
			var e = {
				memoizedState: null,
				baseState: null,
				baseQueue: null,
				queue: null,
				next: null
			};
			return Ty === null ? Z.memoizedState = Ty = e : Ty = Ty.next = e, Ty;
		}
		function Ta() {
			if (wy === null) {
				var e = Z.alternate;
				e = e === null ? null : e.memoizedState;
			} else e = wy.next;
			var t = Ty === null ? Z.memoizedState : Ty.next;
			if (t !== null) Ty = t, wy = e;
			else {
				if (e === null) throw Z.alternate === null ? Error("Update hook called on initial render. This is likely a bug in React. Please file an issue.") : Error("Rendered more hooks than during the previous render.");
				wy = e, e = {
					memoizedState: wy.memoizedState,
					baseState: wy.baseState,
					baseQueue: wy.baseQueue,
					queue: wy.queue,
					next: null
				}, Ty === null ? Z.memoizedState = Ty = e : Ty = Ty.next = e;
			}
			return Ty;
		}
		function Ea() {
			return {
				lastEffect: null,
				events: null,
				stores: null,
				memoCache: null
			};
		}
		function Da(e) {
			var t = Ay;
			return Ay += 1, jy === null && (jy = Oi()), e = Ai(jy, e, t), t = Z, (Ty === null ? t.memoizedState : Ty.next) === null && (t = t.alternate, G.H = t !== null && t.memoizedState !== null ? By : Ry), e;
		}
		function Oa(e) {
			if (typeof e == "object" && e) {
				if (typeof e.then == "function") return Da(e);
				if (e.$$typeof === Nf) return Zr(e);
			}
			throw Error("An unsupported type was passed to use(): " + String(e));
		}
		function ka(e) {
			var t = null, n = Z.updateQueue;
			if (n !== null && (t = n.memoCache), t == null) {
				var r = Z.alternate;
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
			}, n === null && (n = Ea(), Z.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0 || Iy) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = Bf;
			else n.length !== e && console.error("Expected a constant size argument for each invocation of useMemoCache. The previous cache was allocated with size %s but size %s was requested.", n.length, e);
			return t.index++, n;
		}
		function Aa(e, t) {
			return typeof t == "function" ? t(e) : t;
		}
		function ja(e, t, n) {
			var r = wa();
			if (n !== void 0) {
				var i = n(t);
				if (Oy) {
					Te(!0);
					try {
						n(t);
					} finally {
						Te(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = zo.bind(null, Z, e), [r.memoizedState, e];
		}
		function Ma(e) {
			return Na(Ta(), wy, e);
		}
		function Na(e, t, n) {
			var r = e.queue;
			if (r === null) throw Error("Should have a queue. You are likely calling Hooks conditionally, which is not allowed. (https://react.dev/link/invalid-hook-call)");
			r.lastRenderedReducer = n;
			var i = e.baseQueue, a = r.pending;
			if (a !== null) {
				if (i !== null) {
					var o = i.next;
					i.next = a.next, a.next = o;
				}
				t.baseQueue !== i && console.error("Internal error: Expected work-in-progress queue to be a clone. This is a bug in React."), t.baseQueue = i = a, r.pending = null;
			}
			if (a = e.baseState, i === null) e.memoizedState = a;
			else {
				t = i.next;
				var s = o = null, c = null, l = t, u = !1;
				do {
					var d = l.lane & -536870913;
					if (d === l.lane ? (Cy & d) === d : ($ & d) === d) {
						var f = l.revertLane;
						if (f === 0) c !== null && (c = c.next = {
							lane: 0,
							revertLane: 0,
							gesture: null,
							action: l.action,
							hasEagerState: l.hasEagerState,
							eagerState: l.eagerState,
							next: null
						}), d === av && (u = !0);
						else if ((Cy & f) === f) {
							l = l.next, f === av && (u = !0);
							continue;
						} else d = {
							lane: 0,
							revertLane: l.revertLane,
							gesture: null,
							action: l.action,
							hasEagerState: l.hasEagerState,
							eagerState: l.eagerState,
							next: null
						}, c === null ? (s = c = d, o = a) : c = c.next = d, Z.lanes |= f, lx |= f;
						d = l.action, Oy && n(a, d), a = l.hasEagerState ? l.eagerState : n(a, d);
					} else f = {
						lane: d,
						revertLane: l.revertLane,
						gesture: l.gesture,
						action: l.action,
						hasEagerState: l.hasEagerState,
						eagerState: l.eagerState,
						next: null
					}, c === null ? (s = c = f, o = a) : c = c.next = f, Z.lanes |= d, lx |= d;
					l = l.next;
				} while (l !== null && l !== t);
				if (c === null ? o = a : c.next = s, !Bh(a, e.memoizedState) && (ob = !0, u && (n = ov, n !== null))) throw n;
				e.memoizedState = a, e.baseState = o, e.baseQueue = c, r.lastRenderedState = a;
			}
			return i === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
		}
		function Pa(e) {
			var t = Ta(), n = t.queue;
			if (n === null) throw Error("Should have a queue. You are likely calling Hooks conditionally, which is not allowed. (https://react.dev/link/invalid-hook-call)");
			n.lastRenderedReducer = e;
			var r = n.dispatch, i = n.pending, a = t.memoizedState;
			if (i !== null) {
				n.pending = null;
				var o = i = i.next;
				do
					a = e(a, o.action), o = o.next;
				while (o !== i);
				Bh(a, t.memoizedState) || (ob = !0), t.memoizedState = a, t.baseQueue === null && (t.baseState = a), n.lastRenderedState = a;
			}
			return [a, r];
		}
		function Fa(e, t, n) {
			var r = Z, i = wa();
			if ($g) {
				if (n === void 0) throw Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
				var a = n();
				vy || a === n() || (console.error("The result of getServerSnapshot should be cached to avoid an infinite loop"), vy = !0);
			} else {
				if (a = t(), vy || (n = t(), Bh(a, n) || (console.error("The result of getSnapshot should be cached to avoid an infinite loop"), vy = !0)), Wb === null) throw Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
				$ & 127 || La(r, t, a);
			}
			return i.memoizedState = a, n = {
				value: a,
				getSnapshot: t
			}, i.queue = n, uo(za.bind(null, r, n, e), [e]), r.flags |= 2048, oo(my | _y, { destroy: void 0 }, Ra.bind(null, r, n, a, t), null), a;
		}
		function Ia(e, t, n) {
			var r = Z, i = Ta(), a = $g;
			if (a) {
				if (n === void 0) throw Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
				n = n();
			} else if (n = t(), !vy) {
				var o = t();
				Bh(n, o) || (console.error("The result of getSnapshot should be cached to avoid an infinite loop"), vy = !0);
			}
			if ((o = !Bh((wy || i).memoizedState, n)) && (i.memoizedState = n, ob = !0), i = i.queue, lo(2048, _y, za.bind(null, r, i, e), [e]), i.getSnapshot !== t || o || Ty !== null && Ty.memoizedState.tag & my) {
				if (r.flags |= 2048, oo(my | _y, { destroy: void 0 }, Ra.bind(null, r, i, n, t), null), Wb === null) throw Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
				a || Cy & 127 || La(r, t, n);
			}
			return n;
		}
		function La(e, t, n) {
			e.flags |= 16384, e = {
				getSnapshot: t,
				value: n
			}, t = Z.updateQueue, t === null ? (t = Ea(), Z.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
		}
		function Ra(e, t, n, r) {
			t.value = n, t.getSnapshot = r, Ba(t) && Va(e);
		}
		function za(e, t, n) {
			return n(function() {
				Ba(t) && (ri(2, "updateSyncExternalStore()", e), Va(e));
			});
		}
		function Ba(e) {
			var t = e.getSnapshot;
			e = e.value;
			try {
				var n = t();
				return !Bh(e, n);
			} catch {
				return !0;
			}
		}
		function Va(e) {
			var t = or(e, 2);
			t !== null && Qc(t, e, 2);
		}
		function Ha(e) {
			var t = wa();
			if (typeof e == "function") {
				var n = e;
				if (e = n(), Oy) {
					Te(!0);
					try {
						n();
					} finally {
						Te(!1);
					}
				}
			}
			return t.memoizedState = t.baseState = e, t.queue = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: Aa,
				lastRenderedState: e
			}, t;
		}
		function Ua(e) {
			e = Ha(e);
			var t = e.queue, n = Bo.bind(null, Z, t);
			return t.dispatch = n, [e.memoizedState, n];
		}
		function Wa(e) {
			var t = wa();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = Ho.bind(null, Z, !0, n), n.dispatch = t, [e, t];
		}
		function Ga(e, t) {
			return Ka(Ta(), wy, e, t);
		}
		function Ka(e, t, n, r) {
			return e.baseState = n, Na(e, wy, typeof r == "function" ? r : Aa);
		}
		function qa(e, t) {
			var n = Ta();
			return wy === null ? (n.baseState = e, [e, n.queue.dispatch]) : Ka(n, wy, e, t);
		}
		function Ja(e, t, n, r, i) {
			if (Uo(e)) throw Error("Cannot update form state while rendering.");
			if (e = t.action, e !== null) {
				var a = {
					payload: i,
					action: e,
					next: null,
					isTransition: !0,
					status: "pending",
					value: null,
					reason: null,
					listeners: [],
					then: function(e) {
						a.listeners.push(e);
					}
				};
				G.T === null ? a.isTransition = !1 : n(!0), r(a), n = t.pending, n === null ? (a.next = t.pending = a, Ya(t, a)) : (a.next = n.next, t.pending = n.next = a);
			}
		}
		function Ya(e, t) {
			var n = t.action, r = t.payload, i = e.state;
			if (t.isTransition) {
				var a = G.T, o = {};
				o._updatedFibers = /* @__PURE__ */ new Set(), G.T = o;
				try {
					var s = n(i, r), c = G.S;
					c !== null && c(o, s), Xa(e, t, s);
				} catch (n) {
					Qa(e, t, n);
				} finally {
					a !== null && o.types !== null && (a.types !== null && a.types !== o.types && console.error("We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."), a.types = o.types), G.T = a, a === null && o._updatedFibers && (e = o._updatedFibers.size, o._updatedFibers.clear(), 10 < e && console.warn("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."));
				}
			} else try {
				o = n(i, r), Xa(e, t, o);
			} catch (n) {
				Qa(e, t, n);
			}
		}
		function Xa(e, t, n) {
			typeof n == "object" && n && typeof n.then == "function" ? (G.asyncTransitions++, n.then(Do, Do), n.then(function(n) {
				Za(e, t, n);
			}, function(n) {
				return Qa(e, t, n);
			}), t.isTransition || console.error("An async function with useActionState was called outside of a transition. This is likely not what you intended (for example, isPending will not update correctly). Either call the returned function inside startTransition, or pass it to an `action` or `formAction` prop.")) : Za(e, t, n);
		}
		function Za(e, t, n) {
			t.status = "fulfilled", t.value = n, $a(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, Ya(e, n)));
		}
		function Qa(e, t, n) {
			var r = e.pending;
			if (e.pending = null, r !== null) {
				r = r.next;
				do
					t.status = "rejected", t.reason = n, $a(t), t = t.next;
				while (t !== r);
			}
			e.action = null;
		}
		function $a(e) {
			e = e.listeners;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
		function eo(e, t) {
			return t;
		}
		function to(e, t) {
			if ($g) {
				var n = Wb.formState;
				if (n !== null) {
					a: {
						var r = Z;
						if ($g) {
							if (Qg) {
								b: {
									for (var i = Qg, a = r_; i.nodeType !== 8;) {
										if (!a) {
											i = null;
											break b;
										}
										if (i = md(i.nextSibling), i === null) {
											i = null;
											break b;
										}
									}
									a = i.data, i = a === BS || a === VS ? i : null;
								}
								if (i) {
									Qg = md(i.nextSibling), r = i.data === BS;
									break a;
								}
							}
							Fr(r);
						}
						r = !1;
					}
					r && (t = n[0]);
				}
			}
			return n = wa(), n.memoizedState = n.baseState = t, r = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: eo,
				lastRenderedState: t
			}, n.queue = r, n = Bo.bind(null, Z, r), r.dispatch = n, r = Ha(!1), a = Ho.bind(null, Z, !1, r.queue), r = wa(), i = {
				state: t,
				dispatch: null,
				action: e,
				pending: null
			}, r.queue = i, n = Ja.bind(null, Z, i, a, n), i.dispatch = n, r.memoizedState = e, [
				t,
				n,
				!1
			];
		}
		function no(e) {
			return ro(Ta(), wy, e);
		}
		function ro(e, t, n) {
			if (t = Na(e, t, eo)[0], e = Ma(Aa)[0], typeof t == "object" && t && typeof t.then == "function") try {
				var r = Da(t);
			} catch (e) {
				throw e === Lv ? zv : e;
			}
			else r = t;
			t = Ta();
			var i = t.queue, a = i.dispatch;
			return n !== t.memoizedState && (Z.flags |= 2048, oo(my | _y, { destroy: void 0 }, io.bind(null, i, n), null)), [
				r,
				a,
				e
			];
		}
		function io(e, t) {
			e.action = t;
		}
		function ao(e) {
			var t = Ta(), n = wy;
			if (n !== null) return ro(t, n, e);
			Ta(), t = t.memoizedState, n = Ta();
			var r = n.queue.dispatch;
			return n.memoizedState = e, [
				t,
				r,
				!1
			];
		}
		function oo(e, t, n, r) {
			return e = {
				tag: e,
				create: n,
				deps: r,
				inst: t,
				next: null
			}, t = Z.updateQueue, t === null && (t = Ea(), Z.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
		}
		function so(e) {
			var t = wa();
			return e = { current: e }, t.memoizedState = e;
		}
		function co(e, t, n, r) {
			var i = wa();
			Z.flags |= e, i.memoizedState = oo(my | t, { destroy: void 0 }, n, r === void 0 ? null : r);
		}
		function lo(e, t, n, r) {
			var i = Ta();
			r = r === void 0 ? null : r;
			var a = i.memoizedState.inst;
			wy !== null && r !== null && ga(r, wy.memoizedState.deps) ? i.memoizedState = oo(t, a, n, r) : (Z.flags |= e, i.memoizedState = oo(my | t, a, n, r));
		}
		function uo(e, t) {
			(Z.mode & Lg) === K ? co(8390656, _y, e, t) : co(276826112, _y, e, t);
		}
		function fo(e) {
			Z.flags |= 4;
			var t = Z.updateQueue;
			if (t === null) t = Ea(), Z.updateQueue = t, t.events = [e];
			else {
				var n = t.events;
				n === null ? t.events = [e] : n.push(e);
			}
		}
		function po(e) {
			var t = wa(), n = { impl: e };
			return t.memoizedState = n, function() {
				if ((Ub & Pb) !== Nb) throw Error("A function wrapped in useEffectEvent can't be called during rendering.");
				return n.impl.apply(void 0, arguments);
			};
		}
		function B(e) {
			var t = Ta().memoizedState;
			return fo({
				ref: t,
				nextImpl: e
			}), function() {
				if ((Ub & Pb) !== Nb) throw Error("A function wrapped in useEffectEvent can't be called during rendering.");
				return t.impl.apply(void 0, arguments);
			};
		}
		function mo(e, t) {
			var n = 4194308;
			return (Z.mode & Lg) !== K && (n |= 134217728), co(n, gy, e, t);
		}
		function ho(e, t) {
			if (typeof t == "function") {
				e = e();
				var n = t(e);
				return function() {
					typeof n == "function" ? n() : t(null);
				};
			}
			if (t != null) return t.hasOwnProperty("current") || console.error("Expected useImperativeHandle() first argument to either be a ref callback or React.createRef() object. Instead received: %s.", "an object with keys {" + Object.keys(t).join(", ") + "}"), e = e(), t.current = e, function() {
				t.current = null;
			};
		}
		function go(e, t, n) {
			typeof t != "function" && console.error("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t === null ? "null" : typeof t), n = n == null ? null : n.concat([e]);
			var r = 4194308;
			(Z.mode & Lg) !== K && (r |= 134217728), co(r, gy, ho.bind(null, t, e), n);
		}
		function _o(e, t, n) {
			typeof t != "function" && console.error("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t === null ? "null" : typeof t), n = n == null ? null : n.concat([e]), lo(4, gy, ho.bind(null, t, e), n);
		}
		function vo(e, t) {
			return wa().memoizedState = [e, t === void 0 ? null : t], e;
		}
		function yo(e, t) {
			var n = Ta();
			t = t === void 0 ? null : t;
			var r = n.memoizedState;
			return t !== null && ga(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
		}
		function bo(e, t) {
			var n = wa();
			t = t === void 0 ? null : t;
			var r = e();
			if (Oy) {
				Te(!0);
				try {
					e();
				} finally {
					Te(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		}
		function xo(e, t) {
			var n = Ta();
			t = t === void 0 ? null : t;
			var r = n.memoizedState;
			if (t !== null && ga(t, r[1])) return r[0];
			if (r = e(), Oy) {
				Te(!0);
				try {
					e();
				} finally {
					Te(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		}
		function So(e, t) {
			return To(wa(), e, t);
		}
		function Co(e, t) {
			return Eo(Ta(), wy.memoizedState, e, t);
		}
		function wo(e, t) {
			var n = Ta();
			return wy === null ? To(n, e, t) : Eo(n, wy.memoizedState, e, t);
		}
		function To(e, t, n) {
			return n === void 0 || Cy & 1073741824 && !($ & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = Zc(), Z.lanes |= e, lx |= e, n);
		}
		function Eo(e, t, n, r) {
			return Bh(n, t) ? n : oy.current === null ? !(Cy & 42) || Cy & 1073741824 && !($ & 261930) ? (ob = !0, e.memoizedState = n) : (e = Zc(), Z.lanes |= e, lx |= e, t) : (e = To(e, n, r), Bh(e, t) || (ob = !0), e);
		}
		function Do() {
			G.asyncTransitions--;
		}
		function Oo(e, t, n, r, i) {
			var a = Wf.p;
			Wf.p = a !== 0 && a < Rp ? a : Rp;
			var o = G.T, s = {};
			s._updatedFibers = /* @__PURE__ */ new Set(), G.T = s, Ho(e, !1, t, n);
			try {
				var c = i(), l = G.S;
				if (l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function") {
					G.asyncTransitions++, c.then(Do, Do);
					var u = wi(c, r);
					Vo(e, t, u, Xc(e));
				} else Vo(e, t, r, Xc(e));
			} catch (n) {
				Vo(e, t, {
					then: function() {},
					status: "rejected",
					reason: n
				}, Xc(e));
			} finally {
				Wf.p = a, o !== null && s.types !== null && (o.types !== null && o.types !== s.types && console.error("We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."), o.types = s.types), G.T = o, o === null && s._updatedFibers && (e = s._updatedFibers.size, s._updatedFibers.clear(), 10 < e && console.warn("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."));
			}
		}
		function ko(e, t, n, r) {
			if (e.tag !== 5) throw Error("Expected the form instance to be a HostComponent. This is a bug in React.");
			var i = Ao(e).queue;
			ii(e), Oo(e, i, t, bC, n === null ? u : function() {
				return jo(e), n(r);
			});
		}
		function Ao(e) {
			var t = e.memoizedState;
			if (t !== null) return t;
			t = {
				memoizedState: bC,
				baseState: bC,
				baseQueue: null,
				queue: {
					pending: null,
					lanes: 0,
					dispatch: null,
					lastRenderedReducer: Aa,
					lastRenderedState: bC
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
					lastRenderedReducer: Aa,
					lastRenderedState: n
				},
				next: null
			}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
		}
		function jo(e) {
			G.T === null && console.error("requestFormReset was called outside a transition or action. To fix, move to an action, or wrap with startTransition.");
			var t = Ao(e);
			t.next === null && (t = e.alternate.memoizedState), Vo(e, t.next.queue, {}, Xc(e));
		}
		function Mo() {
			var e = Ha(!1);
			return e = Oo.bind(null, Z, e.queue, !0, !1), wa().memoizedState = e, [!1, e];
		}
		function No() {
			var e = Ma(Aa)[0], t = Ta().memoizedState;
			return [typeof e == "boolean" ? e : Da(e), t];
		}
		function Po() {
			var e = Pa(Aa)[0], t = Ta().memoizedState;
			return [typeof e == "boolean" ? e : Da(e), t];
		}
		function Fo() {
			return Zr(xC);
		}
		function Io() {
			var e = wa(), t = Wb.identifierPrefix;
			if ($g) {
				var n = Xg, r = Yg;
				n = (r & ~(1 << 32 - jp(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = ky++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = My++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		}
		function Lo() {
			return wa().memoizedState = Ro.bind(null, Z);
		}
		function Ro(e, t) {
			for (var n = e.return; n !== null;) {
				switch (n.tag) {
					case 24:
					case 3:
						var r = Xc(n), i = Yi(r), a = Xi(n, i, r);
						a !== null && (ri(r, "refresh()", e), Qc(a, n, r), Zi(a, n, r)), e = ei(), t != null && a !== null && console.error("The seed argument is not enabled outside experimental channels."), i.payload = { cache: e };
						return;
				}
				n = n.return;
			}
		}
		function zo(e, t, n) {
			var r = arguments;
			typeof r[3] == "function" && console.error("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect()."), r = Xc(e);
			var i = {
				lane: r,
				revertLane: 0,
				gesture: null,
				action: n,
				hasEagerState: !1,
				eagerState: null,
				next: null
			};
			Uo(e) ? Wo(t, i) : (i = ar(e, t, i, r), i !== null && (ri(r, "dispatch()", e), Qc(i, e, r), Go(i, t, r)));
		}
		function Bo(e, t, n) {
			var r = arguments;
			typeof r[3] == "function" && console.error("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect()."), r = Xc(e), Vo(e, t, n, r) && ri(r, "setState()", e);
		}
		function Vo(e, t, n, r) {
			var i = {
				lane: r,
				revertLane: 0,
				gesture: null,
				action: n,
				hasEagerState: !1,
				eagerState: null,
				next: null
			};
			if (Uo(e)) Wo(t, i);
			else {
				var a = e.alternate;
				if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) {
					var o = G.H;
					G.H = Uy;
					try {
						var s = t.lastRenderedState, c = a(s, n);
						if (i.hasEagerState = !0, i.eagerState = c, Bh(c, s)) return ir(e, t, i, 0), Wb === null && rr(), !1;
					} catch {} finally {
						G.H = o;
					}
				}
				if (n = ar(e, t, i, r), n !== null) return Qc(n, e, r), Go(n, t, r), !0;
			}
			return !1;
		}
		function Ho(e, t, n, r) {
			if (G.T === null && av === 0 && console.error("An optimistic state update occurred outside a transition or action. To fix, move the update to an action, or wrap with startTransition."), r = {
				lane: 2,
				revertLane: $l(),
				gesture: null,
				action: r,
				hasEagerState: !1,
				eagerState: null,
				next: null
			}, Uo(e)) {
				if (t) throw Error("Cannot update optimistic state while rendering.");
				console.error("Cannot call startTransition while rendering.");
			} else t = ar(e, n, r, 2), t !== null && (ri(2, "setOptimistic()", e), Qc(t, e, 2));
		}
		function Uo(e) {
			var t = e.alternate;
			return e === Z || t !== null && t === Z;
		}
		function Wo(e, t) {
			Dy = Ey = !0;
			var n = e.pending;
			n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
		}
		function Go(e, t, n) {
			if (n & 4194048) {
				var r = t.lanes;
				r &= e.pendingLanes, n |= r, t.lanes = n, Ie(e, n);
			}
		}
		function Ko(e) {
			if (e !== null && typeof e != "function") {
				var t = String(e);
				tb.has(t) || (tb.add(t), console.error("Expected the last optional `callback` argument to be a function. Instead received: %s.", e));
			}
		}
		function qo(e, t, n, r) {
			var i = e.memoizedState, a = n(r, i);
			if (e.mode & Ig) {
				Te(!0);
				try {
					a = n(r, i);
				} finally {
					Te(!1);
				}
			}
			a === void 0 && (t = w(t) || "Component", Zy.has(t) || (Zy.add(t), console.error("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", t))), i = a == null ? i : W({}, i, a), e.memoizedState = i, e.lanes === 0 && (e.updateQueue.baseState = i);
		}
		function Jo(e, t, n, r, i, a, o) {
			var s = e.stateNode;
			if (typeof s.shouldComponentUpdate == "function") {
				if (n = s.shouldComponentUpdate(r, a, o), e.mode & Ig) {
					Te(!0);
					try {
						n = s.shouldComponentUpdate(r, a, o);
					} finally {
						Te(!1);
					}
				}
				return n === void 0 && console.error("%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.", w(t) || "Component"), n;
			}
			return t.prototype && t.prototype.isPureReactComponent ? !kn(n, r) || !kn(i, a) : !0;
		}
		function Yo(e, t, n, r) {
			var i = t.state;
			typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== i && (e = T(e) || "Component", Ky.has(e) || (Ky.add(e), console.error("%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", e)), nb.enqueueReplaceState(t, t.state, null));
		}
		function Xo(e, t) {
			var n = t;
			if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
			if (e = e.defaultProps) for (var i in n === t && (n = W({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
			return n;
		}
		function Zo(e) {
			cg(e), console.warn("%s\n\n%s\n", rb ? "An error occurred in the <" + rb + "> component." : "An error occurred in one of your React components.", "Consider adding an error boundary to your tree to customize error handling behavior.\nVisit https://react.dev/link/error-boundaries to learn more about error boundaries.");
		}
		function Qo(e) {
			var t = rb ? "The above error occurred in the <" + rb + "> component." : "The above error occurred in one of your React components.", n = "React will try to recreate this component tree from scratch using the error boundary you provided, " + ((ib || "Anonymous") + ".");
			if (typeof e == "object" && e && typeof e.environmentName == "string") {
				var r = e.environmentName;
				e = [
					"%o\n\n%s\n\n%s\n",
					e,
					t,
					n
				].slice(0), typeof e[0] == "string" ? e.splice(0, 1, SC + " " + e[0], CC, TC + r + TC, wC) : e.splice(0, 0, SC, CC, TC + r + TC, wC), e.unshift(console), r = EC.apply(console.error, e), r();
			} else console.error("%o\n\n%s\n\n%s\n", e, t, n);
		}
		function $o(e) {
			cg(e);
		}
		function es(e, t) {
			try {
				rb = t.source ? T(t.source) : null, ib = null;
				var n = t.value;
				if (G.actQueue !== null) G.thrownErrors.push(n);
				else {
					var r = e.onUncaughtError;
					r(n, { componentStack: t.stack });
				}
			} catch (e) {
				setTimeout(function() {
					throw e;
				});
			}
		}
		function ts(e, t, n) {
			try {
				rb = n.source ? T(n.source) : null, ib = T(t);
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
		function ns(e, t, n) {
			return n = Yi(n), n.tag = ty, n.payload = { element: null }, n.callback = function() {
				N(t.source, es, e, t);
			}, n;
		}
		function rs(e) {
			return e = Yi(e), e.tag = ty, e;
		}
		function is(e, t, n, r) {
			var i = n.type.getDerivedStateFromError;
			if (typeof i == "function") {
				var a = r.value;
				e.payload = function() {
					return i(a);
				}, e.callback = function() {
					fr(n), N(r.source, ts, t, n, r);
				};
			}
			var o = n.stateNode;
			o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
				fr(n), N(r.source, ts, t, n, r), typeof i != "function" && (wx === null ? wx = new Set([this]) : wx.add(this)), Ov(this, r), typeof i == "function" || !(n.lanes & 2) && console.error("%s: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.", T(n) || "Unknown");
			});
		}
		function as(e, t, n, r, i) {
			if (n.flags |= 32768, Ap && Hl(e, i), typeof r == "object" && r && typeof r.then == "function") {
				if (t = n.alternate, t !== null && Jr(t, n, i, !0), $g && (e_ = !0), n = cy.current, n !== null) {
					switch (n.tag) {
						case 31:
						case 13: return ly === null ? fl() : n.alternate === null && cx === Ib && (cx = zb), n.flags &= -257, n.flags |= 65536, n.lanes = i, r === Bv ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = new Set([r]) : t.add(r), Nl(e, r, i)), !1;
						case 22: return n.flags |= 65536, r === Bv ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
							transitions: null,
							markerInstances: null,
							retryQueue: new Set([r])
						}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = new Set([r]) : n.add(r)), Nl(e, r, i)), !1;
					}
					throw Error("Unexpected Suspense handler tag (" + n.tag + "). This is a bug in React.");
				}
				return Nl(e, r, i), fl(), !1;
			}
			if ($g) return e_ = !0, t = cy.current, t === null ? (r !== i_ && Vr(wr(Error("There was an error while hydrating but React was able to recover by instead client rendering the entire root.", { cause: r }), n)), e = e.current.alternate, e.flags |= 65536, i &= -i, e.lanes |= i, r = wr(r, n), i = ns(e.stateNode, r, i), Qi(e, i), cx !== Bb && (cx = Rb)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = i, r !== i_ && Vr(wr(Error("There was an error while hydrating but React was able to recover by instead client rendering from the nearest Suspense boundary.", { cause: r }), n))), !1;
			var a = wr(Error("There was an error during concurrent rendering but React was able to recover by instead synchronously rendering the entire root.", { cause: r }), n);
			if (mx === null ? mx = [a] : mx.push(a), cx !== Bb && (cx = Rb), t === null) return !0;
			r = wr(r, n), n = t;
			do {
				switch (n.tag) {
					case 3: return n.flags |= 65536, e = i & -i, n.lanes |= e, e = ns(n.stateNode, r, e), Qi(n, e), !1;
					case 1: if (t = n.type, a = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || a !== null && typeof a.componentDidCatch == "function" && (wx === null || !wx.has(a)))) return n.flags |= 65536, i &= -i, n.lanes |= i, i = rs(i), is(i, e, n, r), Qi(n, i), !1;
				}
				n = n.return;
			} while (n !== null);
			return !1;
		}
		function os(e, t, n, r) {
			t.child = e === null ? Zv(t, null, n, r) : Xv(t, e.child, n, r);
		}
		function ss(e, t, n, r, i) {
			n = n.render;
			var a = t.ref;
			if ("ref" in r) {
				var o = {};
				for (var s in r) s !== "ref" && (o[s] = r[s]);
			} else o = r;
			return Xr(t), r = _a(e, t, n, o, a, i), s = xa(), e !== null && !ob ? (Sa(e, t, i), js(e, t, i)) : ($g && s && Dr(t), t.flags |= 1, os(e, t, r, i), t.child);
		}
		function cs(e, t, n, r, i) {
			if (e === null) {
				var a = n.type;
				return typeof a == "function" && !hr(a) && a.defaultProps === void 0 && n.compare === null ? (n = lr(a), t.tag = 15, t.type = n, xs(t, a), ls(e, t, n, r, i)) : (e = vr(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
			}
			if (a = e.child, !Ms(e, i)) {
				var o = a.memoizedProps;
				if (n = n.compare, n = n === null ? kn : n, n(o, r) && e.ref === t.ref) return js(e, t, i);
			}
			return t.flags |= 1, e = gr(a, r), e.ref = t.ref, e.return = t, t.child = e;
		}
		function ls(e, t, n, r, i) {
			if (e !== null) {
				var a = e.memoizedProps;
				if (kn(a, r) && e.ref === t.ref && t.type === e.type) if (ob = !1, t.pendingProps = r = a, Ms(e, i)) e.flags & 131072 && (ob = !0);
				else return t.lanes = e.lanes, js(e, t, i);
			}
			return _s(e, t, n, r, i);
		}
		function us(e, t, n, r) {
			var i = r.children, a = e === null ? null : e.memoizedState;
			if (e === null && t.stateNode === null && (t.stateNode = {
				_visibility: Dg,
				_pendingMarkers: null,
				_retryCache: null,
				_transitions: null
			}), r.mode === "hidden") {
				if (t.flags & 128) {
					if (a = a === null ? n : a.baseLanes | n, e !== null) {
						for (r = t.child = e.child, i = 0; r !== null;) i = i | r.lanes | r.childLanes, r = r.sibling;
						r = i & ~a;
					} else r = 0, t.child = null;
					return fs(e, t, a, n, r);
				}
				if (n & 536870912) t.memoizedState = {
					baseLanes: 0,
					cachePool: null
				}, e !== null && Ei(t, a === null ? null : a.cachePool), a === null ? aa(t) : ia(t, a), la(t);
				else return r = t.lanes = 536870912, fs(e, t, a === null ? n : a.baseLanes | n, n, r);
			} else a === null ? (e !== null && Ei(t, null), aa(t), ua(t)) : (Ei(t, a.cachePool), ia(t, a), ua(t), t.memoizedState = null);
			return os(e, t, i, n), t.child;
		}
		function ds(e, t) {
			return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
				_visibility: Dg,
				_pendingMarkers: null,
				_retryCache: null,
				_transitions: null
			}), t.sibling;
		}
		function fs(e, t, n, r, i) {
			var a = Ti();
			return a = a === null ? null : {
				parent: m_._currentValue,
				pool: a
			}, t.memoizedState = {
				baseLanes: n,
				cachePool: a
			}, e !== null && Ei(t, null), aa(t), la(t), e !== null && Jr(e, t, r, !0), t.childLanes = i, null;
		}
		function ps(e, t) {
			var n = t.hidden;
			return n !== void 0 && console.error("<Activity> doesn't accept a hidden prop. Use mode=\"hidden\" instead.\n- <Activity %s>\n+ <Activity %s>", !0 === n ? "hidden" : !1 === n ? "hidden={false}" : "hidden={...}", n ? "mode=\"hidden\"" : "mode=\"visible\""), t = Es({
				mode: t.mode,
				children: t.children
			}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
		}
		function ms(e, t, n) {
			return Xv(t, e.child, null, n), e = ps(t, t.pendingProps), e.flags |= 2, da(t), t.memoizedState = null, e;
		}
		function hs(e, t, n) {
			var r = t.pendingProps, i = (t.flags & 128) != 0;
			if (t.flags &= -129, e === null) {
				if ($g) {
					if (r.mode === "hidden") return e = ps(t, r), t.lanes = 536870912, ds(null, e);
					if (ca(t), (e = Qg) ? (n = ud(e, r_), n = n !== null && n.data === AS ? n : null, n !== null && (r = {
						dehydrated: n,
						treeContext: kr(),
						retryLane: 536870912,
						hydrationErrors: null
					}, t.memoizedState = r, r = Sr(n), r.return = t, t.child = r, Zg = t, Qg = null)) : n = null, n === null) throw Pr(t, e), Fr(t);
					return t.lanes = 536870912, null;
				}
				return ps(t, r);
			}
			var a = e.memoizedState;
			if (a !== null) {
				var o = a.dehydrated;
				if (ca(t), i) if (t.flags & 256) t.flags &= -257, t = ms(e, t, n);
				else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
				else throw Error("Client rendering an Activity suspended it again. This is a bug in React.");
				else if (Nr(), n & 536870912 && dl(t), ob || Jr(e, t, n, !1), i = (n & e.childLanes) !== 0, ob || i) {
					if (r = Wb, r !== null && (o = Le(r, n), o !== 0 && o !== a.retryLane)) throw a.retryLane = o, or(e, o), Qc(r, e, o), ab;
					fl(), t = ms(e, t, n);
				} else e = a.treeContext, Qg = md(o.nextSibling), Zg = t, $g = !0, n_ = null, e_ = !1, t_ = null, r_ = !1, e !== null && Ar(t, e), t = ps(t, r), t.flags |= 4096;
				return t;
			}
			return a = e.child, r = {
				mode: r.mode,
				children: r.children
			}, n & 536870912 && (n & e.lanes) !== 0 && dl(t), e = gr(a, r), e.ref = t.ref, t.child = e, e.return = t, e;
		}
		function gs(e, t) {
			var n = t.ref;
			if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
			else {
				if (typeof n != "function" && typeof n != "object") throw Error("Expected ref to be a function, an object returned by React.createRef(), or undefined/null.");
				(e === null || e.ref !== n) && (t.flags |= 4194816);
			}
		}
		function _s(e, t, n, r, i) {
			if (n.prototype && typeof n.prototype.render == "function") {
				var a = w(n) || "Unknown";
				sb[a] || (console.error("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", a, a), sb[a] = !0);
			}
			return t.mode & Ig && lv.recordLegacyContextWarning(t, null), e === null && (xs(t, t.type), n.contextTypes && (a = w(n) || "Unknown", lb[a] || (lb[a] = !0, console.error("%s uses the legacy contextTypes API which was removed in React 19. Use React.createContext() with React.useContext() instead. (https://react.dev/link/legacy-context)", a)))), Xr(t), n = _a(e, t, n, r, void 0, i), r = xa(), e !== null && !ob ? (Sa(e, t, i), js(e, t, i)) : ($g && r && Dr(t), t.flags |= 1, os(e, t, n, i), t.child);
		}
		function vs(e, t, n, r, i, a) {
			return Xr(t), Fy = -1, Iy = e !== null && e.type !== t.type, t.updateQueue = null, n = ya(t, r, n, i), va(e, t), r = xa(), e !== null && !ob ? (Sa(e, t, a), js(e, t, a)) : ($g && r && Dr(t), t.flags |= 1, os(e, t, n, a), t.child);
		}
		function ys(e, t, n, r, i) {
			switch (s(t)) {
				case !1:
					var a = t.stateNode, o = new t.type(t.memoizedProps, a.context).state;
					a.updater.enqueueSetState(a, o, null);
					break;
				case !0:
					t.flags |= 128, t.flags |= 65536, a = Error("Simulated error coming from DevTools");
					var c = i & -i;
					if (t.lanes |= c, o = Wb, o === null) throw Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
					c = rs(c), is(c, o, t, wr(a, t)), Qi(t, c);
			}
			if (Xr(t), t.stateNode === null) {
				if (o = Mg, a = n.contextType, "contextType" in n && a !== null && (a === void 0 || a.$$typeof !== Nf) && !eb.has(n) && (eb.add(n), c = a === void 0 ? " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file." : typeof a == "object" ? a.$$typeof === Mf ? " Did you accidentally pass the Context.Consumer instead?" : " However, it is set to an object with keys {" + Object.keys(a).join(", ") + "}." : " However, it is set to a " + typeof a + ".", console.error("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", w(n) || "Component", c)), typeof a == "object" && a && (o = Zr(a)), a = new n(r, o), t.mode & Ig) {
					Te(!0);
					try {
						a = new n(r, o);
					} finally {
						Te(!1);
					}
				}
				if (o = t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = nb, t.stateNode = a, a._reactInternals = t, a._reactInternalInstance = Gy, typeof n.getDerivedStateFromProps == "function" && o === null && (o = w(n) || "Component", qy.has(o) || (qy.add(o), console.error("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", o, a.state === null ? "null" : "undefined", o))), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function") {
					var l = c = o = null;
					if (typeof a.componentWillMount == "function" && !0 !== a.componentWillMount.__suppressDeprecationWarning ? o = "componentWillMount" : typeof a.UNSAFE_componentWillMount == "function" && (o = "UNSAFE_componentWillMount"), typeof a.componentWillReceiveProps == "function" && !0 !== a.componentWillReceiveProps.__suppressDeprecationWarning ? c = "componentWillReceiveProps" : typeof a.UNSAFE_componentWillReceiveProps == "function" && (c = "UNSAFE_componentWillReceiveProps"), typeof a.componentWillUpdate == "function" && !0 !== a.componentWillUpdate.__suppressDeprecationWarning ? l = "componentWillUpdate" : typeof a.UNSAFE_componentWillUpdate == "function" && (l = "UNSAFE_componentWillUpdate"), o !== null || c !== null || l !== null) {
						a = w(n) || "Component";
						var u = typeof n.getDerivedStateFromProps == "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
						Yy.has(a) || (Yy.add(a), console.error("Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n%s uses %s but also contains the following legacy lifecycles:%s%s%s\n\nThe above lifecycles should be removed. Learn more about this warning here:\nhttps://react.dev/link/unsafe-component-lifecycles", a, u, o === null ? "" : "\n  " + o, c === null ? "" : "\n  " + c, l === null ? "" : "\n  " + l));
					}
				}
				a = t.stateNode, o = w(n) || "Component", a.render || (n.prototype && typeof n.prototype.render == "function" ? console.error("No `render` method found on the %s instance: did you accidentally return an object from the constructor?", o) : console.error("No `render` method found on the %s instance: you may have forgotten to define `render`.", o)), !a.getInitialState || a.getInitialState.isReactClassApproved || a.state || console.error("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", o), a.getDefaultProps && !a.getDefaultProps.isReactClassApproved && console.error("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", o), a.contextType && console.error("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", o), n.childContextTypes && !$y.has(n) && ($y.add(n), console.error("%s uses the legacy childContextTypes API which was removed in React 19. Use React.createContext() instead. (https://react.dev/link/legacy-context)", o)), n.contextTypes && !Qy.has(n) && (Qy.add(n), console.error("%s uses the legacy contextTypes API which was removed in React 19. Use React.createContext() with static contextType instead. (https://react.dev/link/legacy-context)", o)), typeof a.componentShouldUpdate == "function" && console.error("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", o), n.prototype && n.prototype.isPureReactComponent && a.shouldComponentUpdate !== void 0 && console.error("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", w(n) || "A pure component"), typeof a.componentDidUnmount == "function" && console.error("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", o), typeof a.componentDidReceiveProps == "function" && console.error("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", o), typeof a.componentWillRecieveProps == "function" && console.error("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", o), typeof a.UNSAFE_componentWillRecieveProps == "function" && console.error("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", o), c = a.props !== r, a.props !== void 0 && c && console.error("When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", o), a.defaultProps && console.error("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", o, o), typeof a.getSnapshotBeforeUpdate != "function" || typeof a.componentDidUpdate == "function" || Jy.has(n) || (Jy.add(n), console.error("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", w(n))), typeof a.getDerivedStateFromProps == "function" && console.error("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", o), typeof a.getDerivedStateFromError == "function" && console.error("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", o), typeof n.getSnapshotBeforeUpdate == "function" && console.error("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", o), (c = a.state) && (typeof c != "object" || Uf(c)) && console.error("%s.state: must be set to an object or null", o), typeof a.getChildContext == "function" && typeof n.childContextTypes != "object" && console.error("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", o), a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, qi(t), o = n.contextType, a.context = typeof o == "object" && o ? Zr(o) : Mg, a.state === r && (o = w(n) || "Component", Xy.has(o) || (Xy.add(o), console.error("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", o))), t.mode & Ig && lv.recordLegacyContextWarning(t, a), lv.recordUnsafeLifecycleWarnings(t, a), a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (qo(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && (console.error("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", T(t) || "Component"), nb.enqueueReplaceState(a, a.state, null)), ea(t, r, a, i), $i(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), (t.mode & Lg) !== K && (t.flags |= 134217728), a = !0;
			} else if (e === null) {
				a = t.stateNode;
				var d = t.memoizedProps;
				c = Xo(n, d), a.props = c;
				var f = a.context;
				l = n.contextType, o = Mg, typeof l == "object" && l && (o = Zr(l)), u = n.getDerivedStateFromProps, l = typeof u == "function" || typeof a.getSnapshotBeforeUpdate == "function", d = t.pendingProps !== d, l || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (d || f !== o) && Yo(t, a, r, o), ny = !1;
				var p = t.memoizedState;
				a.state = p, ea(t, r, a, i), $i(), f = t.memoizedState, d || p !== f || ny ? (typeof u == "function" && (qo(t, n, u, r), f = t.memoizedState), (c = ny || Jo(t, n, c, r, p, f, o)) ? (l || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308), (t.mode & Lg) !== K && (t.flags |= 134217728)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), (t.mode & Lg) !== K && (t.flags |= 134217728), t.memoizedProps = r, t.memoizedState = f), a.props = r, a.state = f, a.context = o, a = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), (t.mode & Lg) !== K && (t.flags |= 134217728), a = !1);
			} else {
				a = t.stateNode, Ji(e, t), o = t.memoizedProps, l = Xo(n, o), a.props = l, u = t.pendingProps, p = a.context, f = n.contextType, c = Mg, typeof f == "object" && f && (c = Zr(f)), d = n.getDerivedStateFromProps, (f = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== u || p !== c) && Yo(t, a, r, c), ny = !1, p = t.memoizedState, a.state = p, ea(t, r, a, i), $i();
				var m = t.memoizedState;
				o !== u || p !== m || ny || e !== null && e.dependencies !== null && Yr(e.dependencies) ? (typeof d == "function" && (qo(t, n, d, r), m = t.memoizedState), (l = ny || Jo(t, n, l, r, p, m, c) || e !== null && e.dependencies !== null && Yr(e.dependencies)) ? (f || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, m, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, m, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && p === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && p === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = m), a.props = r, a.state = m, a.context = c, a = l) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && p === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && p === e.memoizedState || (t.flags |= 1024), a = !1);
			}
			if (c = a, gs(e, t), o = (t.flags & 128) != 0, c || o) {
				if (c = t.stateNode, ve(t), o && typeof n.getDerivedStateFromError != "function") n = null, C_ = -1;
				else if (n = Sv(c), t.mode & Ig) {
					Te(!0);
					try {
						Sv(c);
					} finally {
						Te(!1);
					}
				}
				t.flags |= 1, e !== null && o ? (t.child = Xv(t, e.child, null, i), t.child = Xv(t, null, n, i)) : os(e, t, n, i), t.memoizedState = c.state, e = t.child;
			} else e = js(e, t, i);
			return i = t.stateNode, a && i.props !== r && (db || console.error("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", T(t) || "a component"), db = !0), e;
		}
		function bs(e, t, n, r) {
			return zr(), t.flags |= 256, os(e, t, n, r), t.child;
		}
		function xs(e, t) {
			t && t.childContextTypes && console.error("childContextTypes cannot be defined on a function component.\n  %s.childContextTypes = ...", t.displayName || t.name || "Component"), typeof t.getDerivedStateFromProps == "function" && (e = w(t) || "Unknown", ub[e] || (console.error("%s: Function components do not support getDerivedStateFromProps.", e), ub[e] = !0)), typeof t.contextType == "object" && t.contextType !== null && (t = w(t) || "Unknown", cb[t] || (console.error("%s: Function components do not support contextType.", t), cb[t] = !0));
		}
		function Ss(e) {
			return {
				baseLanes: e,
				cachePool: Di()
			};
		}
		function Cs(e, t, n) {
			return e = e === null ? 0 : e.childLanes & ~n, t && (e |= fx), e;
		}
		function ws(e, t, n) {
			var r, i = t.pendingProps;
			o(t) && (t.flags |= 128);
			var a = !1, s = (t.flags & 128) != 0;
			if ((r = s) || (r = e !== null && e.memoizedState === null ? !1 : (fy.current & dy) !== 0), r && (a = !0, t.flags &= -129), r = (t.flags & 32) != 0, t.flags &= -33, e === null) {
				if ($g) {
					if (a ? sa(t) : ua(t), (e = Qg) ? (n = ud(e, r_), n = n !== null && n.data !== AS ? n : null, n !== null && (r = {
						dehydrated: n,
						treeContext: kr(),
						retryLane: 536870912,
						hydrationErrors: null
					}, t.memoizedState = r, r = Sr(n), r.return = t, t.child = r, Zg = t, Qg = null)) : n = null, n === null) throw Pr(t, e), Fr(t);
					return fd(n) ? t.lanes = 32 : t.lanes = 536870912, null;
				}
				var c = i.children;
				if (i = i.fallback, a) {
					ua(t);
					var l = t.mode;
					return c = Es({
						mode: "hidden",
						children: c
					}, l), i = br(i, l, n, null), c.return = t, i.return = t, c.sibling = i, t.child = c, i = t.child, i.memoizedState = Ss(n), i.childLanes = Cs(e, r, n), t.memoizedState = mb, ds(null, i);
				}
				return sa(t), Ts(t, c);
			}
			var u = e.memoizedState;
			if (u !== null) {
				var d = u.dehydrated;
				if (d !== null) {
					if (s) t.flags & 256 ? (sa(t), t.flags &= -257, t = Ds(e, t, n)) : t.memoizedState === null ? (ua(t), c = i.fallback, l = t.mode, i = Es({
						mode: "visible",
						children: i.children
					}, l), c = br(c, l, n, null), c.flags |= 2, i.return = t, c.return = t, i.sibling = c, t.child = i, Xv(t, e.child, null, n), i = t.child, i.memoizedState = Ss(n), i.childLanes = Cs(e, r, n), t.memoizedState = mb, t = ds(null, i)) : (ua(t), t.child = e.child, t.flags |= 128, t = null);
					else if (sa(t), Nr(), n & 536870912 && dl(t), fd(d)) {
						if (r = d.nextSibling && d.nextSibling.dataset, r) {
							c = r.dgst;
							var f = r.msg;
							l = r.stck;
							var p = r.cstck;
						}
						a = f, r = c, i = l, d = p, c = a, l = d, c = Error(c || "The server could not finish this Suspense boundary, likely due to an error during server rendering. Switched to client rendering."), c.stack = i || "", c.digest = r, r = l === void 0 ? null : l, i = {
							value: c,
							source: null,
							stack: r
						}, typeof r == "string" && Vg.set(c, i), Vr(i), t = Ds(e, t, n);
					} else if (ob || Jr(e, t, n, !1), r = (n & e.childLanes) !== 0, ob || r) {
						if (r = Wb, r !== null && (i = Le(r, n), i !== 0 && i !== u.retryLane)) throw u.retryLane = i, or(e, i), Qc(r, e, i), ab;
						dd(d) || fl(), t = Ds(e, t, n);
					} else dd(d) ? (t.flags |= 192, t.child = e.child, t = null) : (e = u.treeContext, Qg = md(d.nextSibling), Zg = t, $g = !0, n_ = null, e_ = !1, t_ = null, r_ = !1, e !== null && Ar(t, e), t = Ts(t, i.children), t.flags |= 4096);
					return t;
				}
			}
			return a ? (ua(t), c = i.fallback, l = t.mode, p = e.child, d = p.sibling, i = gr(p, {
				mode: "hidden",
				children: i.children
			}), i.subtreeFlags = p.subtreeFlags & 65011712, d === null ? (c = br(c, l, n, null), c.flags |= 2) : c = gr(d, c), c.return = t, i.return = t, i.sibling = c, t.child = i, ds(null, i), i = t.child, c = e.child.memoizedState, c === null ? c = Ss(n) : (l = c.cachePool, l === null ? l = Di() : (p = m_._currentValue, l = l.parent === p ? l : {
				parent: p,
				pool: p
			}), c = {
				baseLanes: c.baseLanes | n,
				cachePool: l
			}), i.memoizedState = c, i.childLanes = Cs(e, r, n), t.memoizedState = mb, ds(e.child, i)) : (u !== null && (n & 62914560) === n && (n & e.lanes) !== 0 && dl(t), sa(t), n = e.child, e = n.sibling, n = gr(n, {
				mode: "visible",
				children: i.children
			}), n.return = t, n.sibling = null, e !== null && (r = t.deletions, r === null ? (t.deletions = [e], t.flags |= 16) : r.push(e)), t.child = n, t.memoizedState = null, n);
		}
		function Ts(e, t) {
			return t = Es({
				mode: "visible",
				children: t
			}, e.mode), t.return = e, e.child = t;
		}
		function Es(e, t) {
			return e = h(22, e, null, t), e.lanes = 0, e;
		}
		function Ds(e, t, n) {
			return Xv(t, e.child, null, n), e = Ts(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
		}
		function Os(e, t, n) {
			e.lanes |= t;
			var r = e.alternate;
			r !== null && (r.lanes |= t), Kr(e.return, t, n);
		}
		function ks(e, t, n, r, i, a) {
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
		function As(e, t, n) {
			var r = t.pendingProps, i = r.revealOrder, a = r.tail, o = r.children, s = fy.current;
			if ((r = (s & dy) !== 0) ? (s = s & uy | dy, t.flags |= 128) : s &= uy, O(fy, s, t), s = i ?? "null", i !== "forwards" && i !== "unstable_legacy-backwards" && i !== "together" && i !== "independent" && !fb[s]) if (fb[s] = !0, i == null) console.error("The default for the <SuspenseList revealOrder=\"...\"> prop is changing. To be future compatible you must explictly specify either \"independent\" (the current default), \"together\", \"forwards\" or \"legacy_unstable-backwards\".");
			else if (i === "backwards") console.error("The rendering order of <SuspenseList revealOrder=\"backwards\"> is changing. To be future compatible you must specify revealOrder=\"legacy_unstable-backwards\" instead.");
			else if (typeof i == "string") switch (i.toLowerCase()) {
				case "together":
				case "forwards":
				case "backwards":
				case "independent":
					console.error("\"%s\" is not a valid value for revealOrder on <SuspenseList />. Use lowercase \"%s\" instead.", i, i.toLowerCase());
					break;
				case "forward":
				case "backward":
					console.error("\"%s\" is not a valid value for revealOrder on <SuspenseList />. React uses the -s suffix in the spelling. Use \"%ss\" instead.", i, i.toLowerCase());
					break;
				default: console.error("\"%s\" is not a supported revealOrder on <SuspenseList />. Did you mean \"independent\", \"together\", \"forwards\" or \"backwards\"?", i);
			}
			else console.error("%s is not a supported value for revealOrder on <SuspenseList />. Did you mean \"independent\", \"together\", \"forwards\" or \"backwards\"?", i);
			s = a ?? "null", pb[s] || (a == null ? (i === "forwards" || i === "backwards" || i === "unstable_legacy-backwards") && (pb[s] = !0, console.error("The default for the <SuspenseList tail=\"...\"> prop is changing. To be future compatible you must explictly specify either \"visible\" (the current default), \"collapsed\" or \"hidden\".")) : a !== "visible" && a !== "collapsed" && a !== "hidden" ? (pb[s] = !0, console.error("\"%s\" is not a supported value for tail on <SuspenseList />. Did you mean \"visible\", \"collapsed\" or \"hidden\"?", a)) : i !== "forwards" && i !== "backwards" && i !== "unstable_legacy-backwards" && (pb[s] = !0, console.error("<SuspenseList tail=\"%s\" /> is only valid if revealOrder is \"forwards\" or \"backwards\". Did you mean to specify revealOrder=\"forwards\"?", a)));
			a: if ((i === "forwards" || i === "backwards" || i === "unstable_legacy-backwards") && o != null && !1 !== o) if (Uf(o)) {
				for (s = 0; s < o.length; s++) if (!Ki(o[s], s)) break a;
			} else if (s = re(o), typeof s == "function") {
				if (s = s.call(o)) for (var c = s.next(), l = 0; !c.done; c = s.next()) {
					if (!Ki(c.value, l)) break a;
					l++;
				}
			} else console.error("A single row was passed to a <SuspenseList revealOrder=\"%s\" />. This is not useful since it needs multiple rows. Did you mean to pass multiple children or an array?", i);
			if (os(e, t, o, n), $g ? (jr(), o = Gg) : o = 0, !r && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
				if (e.tag === 13) e.memoizedState !== null && Os(e, n, t);
				else if (e.tag === 19) Os(e, n, t);
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
					for (n = t.child, i = null; n !== null;) e = n.alternate, e !== null && fa(e) === null && (i = n), n = n.sibling;
					n = i, n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), ks(t, !1, i, n, a, o);
					break;
				case "backwards":
				case "unstable_legacy-backwards":
					for (n = null, i = t.child, t.child = null; i !== null;) {
						if (e = i.alternate, e !== null && fa(e) === null) {
							t.child = i;
							break;
						}
						e = i.sibling, i.sibling = n, n = i, i = e;
					}
					ks(t, !0, n, null, a, o);
					break;
				case "together":
					ks(t, !1, null, null, void 0, o);
					break;
				default: t.memoizedState = null;
			}
			return t.child;
		}
		function js(e, t, n) {
			if (e !== null && (t.dependencies = e.dependencies), C_ = -1, lx |= t.lanes, (n & t.childLanes) === 0) if (e !== null) {
				if (Jr(e, t, n, !1), (n & t.childLanes) === 0) return null;
			} else return null;
			if (e !== null && t.child !== e.child) throw Error("Resuming work not yet implemented.");
			if (t.child !== null) {
				for (e = t.child, n = gr(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = gr(e, e.pendingProps), n.return = t;
				n.sibling = null;
			}
			return t.child;
		}
		function Ms(e, t) {
			return (e.lanes & t) === 0 ? (e = e.dependencies, !!(e !== null && Yr(e))) : !0;
		}
		function Ns(e, t, n) {
			switch (t.tag) {
				case 3:
					oe(t, t.stateNode.containerInfo), Wr(t, m_, e.memoizedState.cache), zr();
					break;
				case 27:
				case 5:
					se(t);
					break;
				case 4:
					oe(t, t.stateNode.containerInfo);
					break;
				case 10:
					Wr(t, t.type, t.memoizedProps.value);
					break;
				case 12:
					(n & t.childLanes) !== 0 && (t.flags |= 4), t.flags |= 2048;
					var r = t.stateNode;
					r.effectDuration = -0, r.passiveEffectDuration = -0;
					break;
				case 31:
					if (t.memoizedState !== null) return t.flags |= 128, ca(t), null;
					break;
				case 13:
					if (r = t.memoizedState, r !== null) return r.dehydrated === null ? (n & t.child.childLanes) === 0 ? (sa(t), e = js(e, t, n), e === null ? null : e.sibling) : ws(e, t, n) : (sa(t), t.flags |= 128, null);
					sa(t);
					break;
				case 19:
					var i = (e.flags & 128) != 0;
					if (r = (n & t.childLanes) !== 0, r ||= (Jr(e, t, n, !1), (n & t.childLanes) !== 0), i) {
						if (r) return As(e, t, n);
						t.flags |= 128;
					}
					if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), O(fy, fy.current, t), r) break;
					return null;
				case 22: return t.lanes = 0, us(e, t, n, t.pendingProps);
				case 24: Wr(t, m_, e.memoizedState.cache);
			}
			return js(e, t, n);
		}
		function Ps(e, t, n) {
			if (t._debugNeedsRemount && e !== null) {
				n = vr(t.type, t.key, t.pendingProps, t._debugOwner || null, t.mode, t.lanes), n._debugStack = t._debugStack, n._debugTask = t._debugTask;
				var r = t.return;
				if (r === null) throw Error("Cannot swap the root fiber.");
				if (e.alternate = null, t.alternate = null, n.index = t.index, n.sibling = t.sibling, n.return = t.return, n.ref = t.ref, n._debugInfo = t._debugInfo, t === r.child) r.child = n;
				else {
					var i = r.child;
					if (i === null) throw Error("Expected parent to have a child.");
					for (; i.sibling !== t;) if (i = i.sibling, i === null) throw Error("Expected to find the previous sibling.");
					i.sibling = n;
				}
				return t = r.deletions, t === null ? (r.deletions = [e], r.flags |= 16) : t.push(e), n.flags |= 2, n;
			}
			if (e !== null) if (e.memoizedProps !== t.pendingProps || t.type !== e.type) ob = !0;
			else {
				if (!Ms(e, n) && !(t.flags & 128)) return ob = !1, Ns(e, t, n);
				ob = !!(e.flags & 131072);
			}
			else ob = !1, (r = $g) && (jr(), r = (t.flags & 1048576) != 0), r && (r = t.index, jr(), Er(t, Gg, r));
			switch (t.lanes = 0, t.tag) {
				case 16:
					a: if (r = t.pendingProps, e = ji(t.elementType), t.type = e, typeof e == "function") hr(e) ? (r = Xo(e, r), t.tag = 1, t.type = e = lr(e), t = ys(null, t, e, r, n)) : (t.tag = 0, xs(t, e), t.type = e = lr(e), t = _s(null, t, e, r, n));
					else {
						if (e != null) {
							if (i = e.$$typeof, i === Pf) {
								t.tag = 11, t.type = e = ur(e), t = ss(null, t, e, r, n);
								break a;
							} else if (i === Lf) {
								t.tag = 14, t = cs(null, t, e, r, n);
								break a;
							}
						}
						throw t = "", typeof e == "object" && e && e.$$typeof === Rf && (t = " Did you wrap a component in React.lazy() more than once?"), n = w(e) || e, Error("Element type is invalid. Received a promise that resolves to: " + n + ". Lazy element type must resolve to a class or function." + t);
					}
					return t;
				case 0: return _s(e, t, t.type, t.pendingProps, n);
				case 1: return r = t.type, i = Xo(r, t.pendingProps), ys(e, t, r, i, n);
				case 3:
					a: {
						if (oe(t, t.stateNode.containerInfo), e === null) throw Error("Should have a current fiber. This is a bug in React.");
						r = t.pendingProps;
						var a = t.memoizedState;
						i = a.element, Ji(e, t), ea(t, r, null, n);
						var o = t.memoizedState;
						if (r = o.cache, Wr(t, m_, r), r !== a.cache && qr(t, [m_], n, !0), $i(), r = o.element, a.isDehydrated) if (a = {
							element: r,
							isDehydrated: !1,
							cache: o.cache
						}, t.updateQueue.baseState = a, t.memoizedState = a, t.flags & 256) {
							t = bs(e, t, r, n);
							break a;
						} else if (r !== i) {
							i = wr(Error("This root received an early update, before anything was able hydrate. Switched the entire root to client rendering."), t), Vr(i), t = bs(e, t, r, n);
							break a;
						} else {
							switch (e = t.stateNode.containerInfo, e.nodeType) {
								case 9:
									e = e.body;
									break;
								default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
							}
							for (Qg = md(e.firstChild), Zg = t, $g = !0, n_ = null, e_ = !1, t_ = null, r_ = !0, n = Zv(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 4096, n = n.sibling;
						}
						else {
							if (zr(), r === i) {
								t = js(e, t, n);
								break a;
							}
							os(e, t, r, n);
						}
						t = t.child;
					}
					return t;
				case 26: return gs(e, t), e === null ? (n = Dd(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : $g || (n = t.type, e = t.pendingProps, r = ae(Zf.current), r = Iu(r).createElement(n), r[Hp] = t, r[Up] = e, Su(r, n, e), Ye(r), t.stateNode = r) : t.memoizedState = Dd(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
				case 27: return se(t), e === null && $g && (r = ae(Zf.current), i = A(), r = t.stateNode = Sd(t.type, t.pendingProps, r, i, !1), e_ || (i = Mu(r, t.type, t.pendingProps, i), i !== null && (Mr(t, 0).serverProps = i)), Zg = t, r_ = !0, i = Qg, Xu(t.type) ? (rC = i, Qg = md(r.firstChild)) : Qg = i), os(e, t, t.pendingProps.children, n), gs(e, t), e === null && (t.flags |= 4194304), t.child;
				case 5: return e === null && $g && (a = A(), r = Ht(t.type, a.ancestorInfo), i = Qg, (o = !i) || (o = cd(i, t.type, t.pendingProps, r_), o === null ? a = !1 : (t.stateNode = o, e_ || (a = Mu(o, t.type, t.pendingProps, a), a !== null && (Mr(t, 0).serverProps = a)), Zg = t, Qg = md(o.firstChild), r_ = !1, a = !0), o = !a), o && (r && Pr(t, i), Fr(t))), se(t), i = t.type, a = t.pendingProps, o = e === null ? null : e.memoizedProps, r = a.children, zu(i, a) ? r = null : o !== null && zu(i, o) && (t.flags |= 32), t.memoizedState !== null && (i = _a(e, t, ba, null, null, n), xC._currentValue = i), gs(e, t), os(e, t, r, n), t.child;
				case 6: return e === null && $g && (n = t.pendingProps, e = A(), r = e.ancestorInfo.current, n = r == null ? !0 : Ut(n, r.tag, e.ancestorInfo.implicitRootScope), e = Qg, (r = !e) || (r = ld(e, t.pendingProps, r_), r === null ? r = !1 : (t.stateNode = r, Zg = t, Qg = null, r = !0), r = !r), r && (n && Pr(t, e), Fr(t))), null;
				case 13: return ws(e, t, n);
				case 4: return oe(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = Xv(t, null, r, n) : os(e, t, r, n), t.child;
				case 11: return ss(e, t, t.type, t.pendingProps, n);
				case 7: return os(e, t, t.pendingProps, n), t.child;
				case 8: return os(e, t, t.pendingProps.children, n), t.child;
				case 12: return t.flags |= 4, t.flags |= 2048, r = t.stateNode, r.effectDuration = -0, r.passiveEffectDuration = -0, os(e, t, t.pendingProps.children, n), t.child;
				case 10: return r = t.type, i = t.pendingProps, a = i.value, "value" in i || hb || (hb = !0, console.error("The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?")), Wr(t, r, a), os(e, t, i.children, n), t.child;
				case 9: return i = t.type._context, r = t.pendingProps.children, typeof r != "function" && console.error("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it."), Xr(t), i = Zr(i), r = bv(r, i, void 0), t.flags |= 1, os(e, t, r, n), t.child;
				case 14: return cs(e, t, t.type, t.pendingProps, n);
				case 15: return ls(e, t, t.type, t.pendingProps, n);
				case 19: return As(e, t, n);
				case 31: return hs(e, t, n);
				case 22: return us(e, t, n, t.pendingProps);
				case 24: return Xr(t), r = Zr(m_), e === null ? (i = Ti(), i === null && (i = Wb, a = ei(), i.pooledCache = a, ti(a), a !== null && (i.pooledCacheLanes |= n), i = a), t.memoizedState = {
					parent: r,
					cache: i
				}, qi(t), Wr(t, m_, i)) : ((e.lanes & n) !== 0 && (Ji(e, t), ea(t, null, null, n), $i()), i = e.memoizedState, a = t.memoizedState, i.parent === r ? (r = a.cache, Wr(t, m_, r), r !== i.cache && qr(t, [m_], n, !0)) : (i = {
					parent: r,
					cache: r
				}, t.memoizedState = i, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = i), Wr(t, m_, r))), os(e, t, t.pendingProps.children, n), t.child;
				case 29: throw t.pendingProps;
			}
			throw Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
		}
		function Fs(e) {
			e.flags |= 4;
		}
		function Is(e, t, n, r, i) {
			if ((t = (e.mode & Rg) !== K) && (t = !1), t) {
				if (e.flags |= 16777216, (i & 335544128) === i) if (e.stateNode.complete) e.flags |= 8192;
				else if (cl()) e.flags |= 8192;
				else throw Vv = Bv, Rv;
			} else e.flags &= -16777217;
		}
		function Ls(e, t) {
			if (t.type !== "stylesheet" || (t.state.loading & cC) !== iC) e.flags &= -16777217;
			else if (e.flags |= 16777216, !Vd(t)) if (cl()) e.flags |= 8192;
			else throw Vv = Bv, Rv;
		}
		function Rs(e, t) {
			t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : je(), e.lanes |= t, px |= t);
		}
		function zs(e, t) {
			if (!$g) switch (e.tailMode) {
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
		function Bs(e) {
			var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
			if (t) if ((e.mode & q) !== K) {
				for (var i = e.selfBaseDuration, a = e.child; a !== null;) n |= a.lanes | a.childLanes, r |= a.subtreeFlags & 65011712, r |= a.flags & 65011712, i += a.treeBaseDuration, a = a.sibling;
				e.treeBaseDuration = i;
			} else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 65011712, r |= i.flags & 65011712, i.return = e, i = i.sibling;
			else if ((e.mode & q) !== K) {
				i = e.actualDuration, a = e.selfBaseDuration;
				for (var o = e.child; o !== null;) n |= o.lanes | o.childLanes, r |= o.subtreeFlags, r |= o.flags, i += o.actualDuration, a += o.treeBaseDuration, o = o.sibling;
				e.actualDuration = i, e.treeBaseDuration = a;
			} else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
			return e.subtreeFlags |= r, e.childLanes = n, t;
		}
		function Vs(e, t, n) {
			var r = t.pendingProps;
			switch (Or(t), t.tag) {
				case 16:
				case 15:
				case 0:
				case 11:
				case 7:
				case 8:
				case 12:
				case 9:
				case 14: return Bs(t), null;
				case 1: return Bs(t), null;
				case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), Gr(m_, t), k(t), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (Rr(t) ? (Hr(), Fs(t)) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, Br())), Bs(t), null;
				case 26:
					var i = t.type, a = t.memoizedState;
					return e === null ? (Fs(t), a === null ? (Bs(t), Is(t, i, null, r, n)) : (Bs(t), Ls(t, a))) : a ? a === e.memoizedState ? (Bs(t), t.flags &= -16777217) : (Fs(t), Bs(t), Ls(t, a)) : (e = e.memoizedProps, e !== r && Fs(t), Bs(t), Is(t, i, e, r, n)), null;
				case 27:
					if (ce(t), n = ae(Zf.current), i = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && Fs(t);
					else {
						if (!r) {
							if (t.stateNode === null) throw Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
							return Bs(t), null;
						}
						e = A(), Rr(t) ? Ir(t, e) : (e = Sd(i, r, n, e, !0), t.stateNode = e, Fs(t));
					}
					return Bs(t), null;
				case 5:
					if (ce(t), i = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && Fs(t);
					else {
						if (!r) {
							if (t.stateNode === null) throw Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
							return Bs(t), null;
						}
						var o = A();
						if (Rr(t)) Ir(t, o);
						else {
							switch (a = ae(Zf.current), Ht(i, o.ancestorInfo), o = o.context, a = Iu(a), o) {
								case GS:
									a = a.createElementNS(Mm, i);
									break;
								case KS:
									a = a.createElementNS(jm, i);
									break;
								default: switch (i) {
									case "svg":
										a = a.createElementNS(Mm, i);
										break;
									case "math":
										a = a.createElementNS(jm, i);
										break;
									case "script":
										a = a.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild);
										break;
									case "select":
										a = typeof r.is == "string" ? a.createElement("select", { is: r.is }) : a.createElement("select"), r.multiple ? a.multiple = !0 : r.size && (a.size = r.size);
										break;
									default: a = typeof r.is == "string" ? a.createElement(i, { is: r.is }) : a.createElement(i), i.indexOf("-") === -1 && (i !== i.toLowerCase() && console.error("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", i), Object.prototype.toString.call(a) !== "[object HTMLUnknownElement]" || pp.call(YS, i) || (YS[i] = !0, console.error("The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.", i)));
								}
							}
							a[Hp] = t, a[Up] = r;
							a: for (o = t.child; o !== null;) {
								if (o.tag === 5 || o.tag === 6) a.appendChild(o.stateNode);
								else if (o.tag !== 4 && o.tag !== 27 && o.child !== null) {
									o.child.return = o, o = o.child;
									continue;
								}
								if (o === t) break a;
								for (; o.sibling === null;) {
									if (o.return === null || o.return === t) break a;
									o = o.return;
								}
								o.sibling.return = o.return, o = o.sibling;
							}
							t.stateNode = a;
							a: switch (Su(a, i, r), i) {
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
							r && Fs(t);
						}
					}
					return Bs(t), Is(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
				case 6:
					if (e && t.stateNode != null) e.memoizedProps !== r && Fs(t);
					else {
						if (typeof r != "string" && t.stateNode === null) throw Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
						if (e = ae(Zf.current), n = A(), Rr(t)) {
							if (e = t.stateNode, n = t.memoizedProps, i = !e_, r = null, a = Zg, a !== null) switch (a.tag) {
								case 3:
									i && (i = gd(e, n, r), i !== null && (Mr(t, 0).serverProps = i));
									break;
								case 27:
								case 5: r = a.memoizedProps, i && (i = gd(e, n, r), i !== null && (Mr(t, 0).serverProps = i));
							}
							e[Hp] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || yu(e.nodeValue, n)), e || Fr(t, !0);
						} else i = n.ancestorInfo.current, i != null && Ut(r, i.tag, n.ancestorInfo.implicitRootScope), e = Iu(e).createTextNode(r), e[Hp] = t, t.stateNode = e;
					}
					return Bs(t), null;
				case 31:
					if (n = t.memoizedState, e === null || e.memoizedState !== null) {
						if (r = Rr(t), n !== null) {
							if (e === null) {
								if (!r) throw Error("A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.");
								if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error("Expected to have a hydrated activity instance. This error is likely caused by a bug in React. Please file an issue.");
								e[Hp] = t, Bs(t), (t.mode & q) !== K && n !== null && (e = t.child, e !== null && (t.treeBaseDuration -= e.treeBaseDuration));
							} else Hr(), zr(), !(t.flags & 128) && (n = t.memoizedState = null), t.flags |= 4, Bs(t), (t.mode & q) !== K && n !== null && (e = t.child, e !== null && (t.treeBaseDuration -= e.treeBaseDuration));
							e = !1;
						} else n = Br(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
						if (!e) return t.flags & 256 ? (da(t), t) : (da(t), null);
						if (t.flags & 128) throw Error("Client rendering an Activity suspended it again. This is a bug in React.");
					}
					return Bs(t), null;
				case 13:
					if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
						if (i = r, a = Rr(t), i !== null && i.dehydrated !== null) {
							if (e === null) {
								if (!a) throw Error("A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.");
								if (a = t.memoizedState, a = a === null ? null : a.dehydrated, !a) throw Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
								a[Hp] = t, Bs(t), (t.mode & q) !== K && i !== null && (i = t.child, i !== null && (t.treeBaseDuration -= i.treeBaseDuration));
							} else Hr(), zr(), !(t.flags & 128) && (i = t.memoizedState = null), t.flags |= 4, Bs(t), (t.mode & q) !== K && i !== null && (i = t.child, i !== null && (t.treeBaseDuration -= i.treeBaseDuration));
							i = !1;
						} else i = Br(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = i), i = !0;
						if (!i) return t.flags & 256 ? (da(t), t) : (da(t), null);
					}
					return da(t), t.flags & 128 ? (t.lanes = n, (t.mode & q) !== K && xi(t), t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, i = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (i = r.alternate.memoizedState.cachePool.pool), a = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (a = r.memoizedState.cachePool.pool), a !== i && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), Rs(t, t.updateQueue), Bs(t), (t.mode & q) !== K && n && (e = t.child, e !== null && (t.treeBaseDuration -= e.treeBaseDuration)), null);
				case 4: return k(t), e === null && ou(t.stateNode.containerInfo), Bs(t), null;
				case 10: return Gr(t.type, t), Bs(t), null;
				case 19:
					if (D(fy, t), r = t.memoizedState, r === null) return Bs(t), null;
					if (i = (t.flags & 128) != 0, a = r.rendering, a === null) if (i) zs(r, !1);
					else {
						if (cx !== Ib || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
							if (a = fa(e), a !== null) {
								for (t.flags |= 128, zs(r, !1), e = a.updateQueue, t.updateQueue = e, Rs(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) _r(n, e), n = n.sibling;
								return O(fy, fy.current & uy | dy, t), $g && Tr(t, r.treeForkCount), t.child;
							}
							e = e.sibling;
						}
						r.tail !== null && vp() > bx && (t.flags |= 128, i = !0, zs(r, !1), t.lanes = 4194304);
					}
					else {
						if (!i) if (e = fa(a), e !== null) {
							if (t.flags |= 128, i = !0, e = e.updateQueue, t.updateQueue = e, Rs(t, e), zs(r, !0), r.tail === null && r.tailMode === "hidden" && !a.alternate && !$g) return Bs(t), null;
						} else 2 * vp() - r.renderingStartTime > bx && n !== 536870912 && (t.flags |= 128, i = !0, zs(r, !1), t.lanes = 4194304);
						r.isBackwards ? (a.sibling = t.child, t.child = a) : (e = r.last, e === null ? t.child = a : e.sibling = a, r.last = a);
					}
					return r.tail === null ? (Bs(t), null) : (e = r.tail, r.rendering = e, r.tail = e.sibling, r.renderingStartTime = vp(), e.sibling = null, n = fy.current, n = i ? n & uy | dy : n & uy, O(fy, n, t), $g && Tr(t, r.treeForkCount), e);
				case 22:
				case 23: return da(t), oa(t), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (Bs(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Bs(t), n = t.updateQueue, n !== null && Rs(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && D(cv, t), null;
				case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), Gr(m_, t), Bs(t), null;
				case 25: return null;
				case 30: return null;
			}
			throw Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
		}
		function Hs(e, t) {
			switch (Or(t), t.tag) {
				case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, (t.mode & q) !== K && xi(t), t) : null;
				case 3: return Gr(m_, t), k(t), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
				case 26:
				case 27:
				case 5: return ce(t), null;
				case 31:
					if (t.memoizedState !== null) {
						if (da(t), t.alternate === null) throw Error("Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue.");
						zr();
					}
					return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, (t.mode & q) !== K && xi(t), t) : null;
				case 13:
					if (da(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
						if (t.alternate === null) throw Error("Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue.");
						zr();
					}
					return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, (t.mode & q) !== K && xi(t), t) : null;
				case 19: return D(fy, t), null;
				case 4: return k(t), null;
				case 10: return Gr(t.type, t), null;
				case 22:
				case 23: return da(t), oa(t), e !== null && D(cv, t), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, (t.mode & q) !== K && xi(t), t) : null;
				case 24: return Gr(m_, t), null;
				case 25: return null;
				default: return null;
			}
		}
		function Us(e, t) {
			switch (Or(t), t.tag) {
				case 3:
					Gr(m_, t), k(t);
					break;
				case 26:
				case 27:
				case 5:
					ce(t);
					break;
				case 4:
					k(t);
					break;
				case 31:
					t.memoizedState !== null && da(t);
					break;
				case 13:
					da(t);
					break;
				case 19:
					D(fy, t);
					break;
				case 10:
					Gr(t.type, t);
					break;
				case 22:
				case 23:
					da(t), oa(t), e !== null && D(cv, t);
					break;
				case 24: Gr(m_, t);
			}
		}
		function Ws(e) {
			return (e.mode & q) !== K;
		}
		function Gs(e, t) {
			Ws(e) ? (bi(), qs(t, e), vi()) : qs(t, e);
		}
		function Ks(e, t, n) {
			Ws(e) ? (bi(), Js(n, e, t), vi()) : Js(n, e, t);
		}
		function qs(e, t) {
			try {
				var n = t.updateQueue, r = n === null ? null : n.lastEffect;
				if (r !== null) {
					var i = r.next;
					n = i;
					do {
						if ((n.tag & e) === e && (r = void 0, (e & hy) !== py && (eS = !0), r = N(t, Mv, n), (e & hy) !== py && (eS = !1), r !== void 0 && typeof r != "function")) {
							var a = void 0;
							a = (n.tag & gy) === 0 ? (n.tag & hy) === 0 ? "useEffect" : "useInsertionEffect" : "useLayoutEffect";
							var o = void 0;
							o = r === null ? " You returned null. If your effect does not require clean up, return undefined (or nothing)." : typeof r.then == "function" ? "\n\nIt looks like you wrote " + a + "(async () => ...) or returned a Promise. Instead, write the async function inside your effect and call it immediately:\n\n" + a + "(() => {\n  async function fetchData() {\n    // You can await here\n    const response = await MyAPI.getData(someId);\n    // ...\n  }\n  fetchData();\n}, [someId]); // Or [] if effect doesn't need props or state\n\nLearn more about data fetching with Hooks: https://react.dev/link/hooks-data-fetching" : " You returned: " + r, N(t, function(e, t) {
								console.error("%s must not return anything besides a function, which is used for clean-up.%s", e, t);
							}, a, o);
						}
						n = n.next;
					} while (n !== i);
				}
			} catch (e) {
				Ml(t, t.return, e);
			}
		}
		function Js(e, t, n) {
			try {
				var r = t.updateQueue, i = r === null ? null : r.lastEffect;
				if (i !== null) {
					var a = i.next;
					r = a;
					do {
						if ((r.tag & e) === e) {
							var o = r.inst, s = o.destroy;
							s !== void 0 && (o.destroy = void 0, (e & hy) !== py && (eS = !0), i = t, N(i, Pv, i, n, s), (e & hy) !== py && (eS = !1));
						}
						r = r.next;
					} while (r !== a);
				}
			} catch (e) {
				Ml(t, t.return, e);
			}
		}
		function Ys(e, t) {
			Ws(e) ? (bi(), qs(t, e), vi()) : qs(t, e);
		}
		function Xs(e, t, n) {
			Ws(e) ? (bi(), Js(n, e, t), vi()) : Js(n, e, t);
		}
		function Zs(e) {
			var t = e.updateQueue;
			if (t !== null) {
				var n = e.stateNode;
				e.type.defaultProps || "ref" in e.memoizedProps || db || (n.props !== e.memoizedProps && console.error("Expected %s props to match memoized props before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", T(e) || "instance"), n.state !== e.memoizedState && console.error("Expected %s state to match memoized state before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", T(e) || "instance"));
				try {
					N(e, ra, t, n);
				} catch (t) {
					Ml(e, e.return, t);
				}
			}
		}
		function Qs(e, t, n) {
			return e.getSnapshotBeforeUpdate(t, n);
		}
		function $s(e, t) {
			var n = t.memoizedProps, r = t.memoizedState;
			t = e.stateNode, e.type.defaultProps || "ref" in e.memoizedProps || db || (t.props !== e.memoizedProps && console.error("Expected %s props to match memoized props before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", T(e) || "instance"), t.state !== e.memoizedState && console.error("Expected %s state to match memoized state before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", T(e) || "instance"));
			try {
				var i = Xo(e.type, n), a = N(e, Qs, t, i, r);
				n = gb, a !== void 0 || n.has(e.type) || (n.add(e.type), N(e, function() {
					console.error("%s.getSnapshotBeforeUpdate(): A snapshot value (or null) must be returned. You have returned undefined.", T(e));
				})), t.__reactInternalSnapshotBeforeUpdate = a;
			} catch (t) {
				Ml(e, e.return, t);
			}
		}
		function ec(e, t, n) {
			n.props = Xo(e.type, e.memoizedProps), n.state = e.memoizedState, Ws(e) ? (bi(), N(e, Av, e, t, n), vi()) : N(e, Av, e, t, n);
		}
		function tc(e) {
			var t = e.ref;
			if (t !== null) {
				switch (e.tag) {
					case 26:
					case 27:
					case 5:
						var n = e.stateNode;
						break;
					case 30:
						n = e.stateNode;
						break;
					default: n = e.stateNode;
				}
				if (typeof t == "function") if (Ws(e)) try {
					bi(), e.refCleanup = t(n);
				} finally {
					vi();
				}
				else e.refCleanup = t(n);
				else typeof t == "string" ? console.error("String refs are no longer supported.") : t.hasOwnProperty("current") || console.error("Unexpected ref object provided for %s. Use either a ref-setter function or React.createRef().", T(e)), t.current = n;
			}
		}
		function nc(e, t) {
			try {
				N(e, tc, e);
			} catch (n) {
				Ml(e, t, n);
			}
		}
		function rc(e, t) {
			var n = e.ref, r = e.refCleanup;
			if (n !== null) if (typeof r == "function") try {
				if (Ws(e)) try {
					bi(), N(e, r);
				} finally {
					vi(e);
				}
				else N(e, r);
			} catch (n) {
				Ml(e, t, n);
			} finally {
				e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
			}
			else if (typeof n == "function") try {
				if (Ws(e)) try {
					bi(), N(e, n, null);
				} finally {
					vi(e);
				}
				else N(e, n, null);
			} catch (n) {
				Ml(e, t, n);
			}
			else n.current = null;
		}
		function ic(e, t, n, r) {
			var i = e.memoizedProps, a = i.id, o = i.onCommit;
			i = i.onRender, t = t === null ? "mount" : "update", tv && (t = "nested-update"), typeof i == "function" && i(a, t, e.actualDuration, e.treeBaseDuration, e.actualStartTime, n), typeof o == "function" && o(a, t, r, n);
		}
		function ac(e, t, n, r) {
			var i = e.memoizedProps;
			e = i.id, i = i.onPostCommit, t = t === null ? "mount" : "update", tv && (t = "nested-update"), typeof i == "function" && i(e, t, r, n);
		}
		function oc(e) {
			var t = e.type, n = e.memoizedProps, r = e.stateNode;
			try {
				N(e, Wu, r, t, n, e);
			} catch (t) {
				Ml(e, e.return, t);
			}
		}
		function sc(e, t, n) {
			try {
				N(e, Ku, e.stateNode, e.type, n, t, e);
			} catch (t) {
				Ml(e, e.return, t);
			}
		}
		function cc(e) {
			return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Xu(e.type) || e.tag === 4;
		}
		function lc(e) {
			a: for (;;) {
				for (; e.sibling === null;) {
					if (e.return === null || cc(e.return)) return null;
					e = e.return;
				}
				for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
					if (e.tag === 27 && Xu(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue a;
					e.child.return = e, e = e.child;
				}
				if (!(e.flags & 2)) return e.stateNode;
			}
		}
		function uc(e, t, n) {
			var r = e.tag;
			if (r === 5 || r === 6) e = e.stateNode, t ? (Yu(n), (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(e, t)) : (Yu(n), t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(e), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = en));
			else if (r !== 4 && (r === 27 && Xu(e.type) && (n = e.stateNode, t = null), e = e.child, e !== null)) for (uc(e, t, n), e = e.sibling; e !== null;) uc(e, t, n), e = e.sibling;
		}
		function dc(e, t, n) {
			var r = e.tag;
			if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
			else if (r !== 4 && (r === 27 && Xu(e.type) && (n = e.stateNode), e = e.child, e !== null)) for (dc(e, t, n), e = e.sibling; e !== null;) dc(e, t, n), e = e.sibling;
		}
		function fc(e) {
			for (var t, n = e.return; n !== null;) {
				if (cc(n)) {
					t = n;
					break;
				}
				n = n.return;
			}
			if (t == null) throw Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
			switch (t.tag) {
				case 27:
					t = t.stateNode, n = lc(e), dc(e, n, t);
					break;
				case 5:
					n = t.stateNode, t.flags & 32 && (qu(n), t.flags &= -33), t = lc(e), dc(e, t, n);
					break;
				case 3:
				case 4:
					t = t.stateNode.containerInfo, n = lc(e), uc(e, n, t);
					break;
				default: throw Error("Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue.");
			}
		}
		function pc(e) {
			var t = e.stateNode, n = e.memoizedProps;
			try {
				N(e, Cd, e.type, n, t, e);
			} catch (t) {
				Ml(e, e.return, t);
			}
		}
		function mc(e, t) {
			return t.tag === 31 ? (t = t.memoizedState, e.memoizedState !== null && t === null) : t.tag === 13 ? (e = e.memoizedState, t = t.memoizedState, e !== null && e.dehydrated !== null && (t === null || t.dehydrated === null)) : t.tag === 3 ? e.memoizedState.isDehydrated && (t.flags & 256) == 0 : !1;
		}
		function hc(e, t) {
			if (e = e.containerInfo, qS = RC, e = Nn(e), Pn(e)) {
				if ("selectionStart" in e) var n = {
					start: e.selectionStart,
					end: e.selectionEnd
				};
				else a: {
					n = (n = e.ownerDocument) && n.defaultView || window;
					var r = n.getSelection && n.getSelection();
					if (r && r.rangeCount !== 0) {
						n = r.anchorNode;
						var i = r.anchorOffset, a = r.focusNode;
						r = r.focusOffset;
						try {
							n.nodeType, a.nodeType;
						} catch {
							n = null;
							break a;
						}
						var o = 0, s = -1, c = -1, l = 0, u = 0, d = e, f = null;
						b: for (;;) {
							for (var p; d !== n || i !== 0 && d.nodeType !== 3 || (s = o + i), d !== a || r !== 0 && d.nodeType !== 3 || (c = o + r), d.nodeType === 3 && (o += d.nodeValue.length), (p = d.firstChild) !== null;) f = d, d = p;
							for (;;) {
								if (d === e) break b;
								if (f === n && ++l === i && (s = o), f === a && ++u === r && (c = o), (p = d.nextSibling) !== null) break;
								d = f, f = d.parentNode;
							}
							d = p;
						}
						n = s === -1 || c === -1 ? null : {
							start: s,
							end: c
						};
					} else n = null;
				}
				n ||= {
					start: 0,
					end: 0
				};
			} else n = null;
			for (JS = {
				focusedElem: e,
				selectionRange: n
			}, RC = !1, xb = t; xb !== null;) if (t = xb, e = t.child, t.subtreeFlags & 1028 && e !== null) e.return = t, xb = e;
			else for (; xb !== null;) {
				switch (e = t = xb, n = e.alternate, i = e.flags, e.tag) {
					case 0:
						if (i & 4 && (e = e.updateQueue, e = e === null ? null : e.events, e !== null)) for (n = 0; n < e.length; n++) i = e[n], i.ref.impl = i.nextImpl;
						break;
					case 11:
					case 15: break;
					case 1:
						i & 1024 && n !== null && $s(e, n);
						break;
					case 3:
						if (i & 1024) {
							if (e = e.stateNode.containerInfo, n = e.nodeType, n === 9) sd(e);
							else if (n === 1) switch (e.nodeName) {
								case "HEAD":
								case "HTML":
								case "BODY":
									sd(e);
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
					default: if (i & 1024) throw Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
				}
				if (e = t.sibling, e !== null) {
					e.return = t.return, xb = e;
					break;
				}
				xb = t.return;
			}
		}
		function gc(e, t, n) {
			var r = li(), i = di(), a = pi(), o = mi(), s = n.flags;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					Oc(e, n), s & 4 && Gs(n, gy | my);
					break;
				case 1:
					if (Oc(e, n), s & 4) if (e = n.stateNode, t === null) n.type.defaultProps || "ref" in n.memoizedProps || db || (e.props !== n.memoizedProps && console.error("Expected %s props to match memoized props before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", T(n) || "instance"), e.state !== n.memoizedState && console.error("Expected %s state to match memoized state before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", T(n) || "instance")), Ws(n) ? (bi(), N(n, wv, n, e), vi()) : N(n, wv, n, e);
					else {
						var c = Xo(n.type, t.memoizedProps);
						t = t.memoizedState, n.type.defaultProps || "ref" in n.memoizedProps || db || (e.props !== n.memoizedProps && console.error("Expected %s props to match memoized props before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", T(n) || "instance"), e.state !== n.memoizedState && console.error("Expected %s state to match memoized state before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", T(n) || "instance")), Ws(n) ? (bi(), N(n, Ev, n, e, c, t, e.__reactInternalSnapshotBeforeUpdate), vi()) : N(n, Ev, n, e, c, t, e.__reactInternalSnapshotBeforeUpdate);
					}
					s & 64 && Zs(n), s & 512 && nc(n, n.return);
					break;
				case 3:
					if (t = ai(), Oc(e, n), s & 64 && (s = n.updateQueue, s !== null)) {
						if (c = null, n.child !== null) switch (n.child.tag) {
							case 27:
							case 5:
								c = n.child.stateNode;
								break;
							case 1: c = n.child.stateNode;
						}
						try {
							N(n, ra, s, c);
						} catch (e) {
							Ml(n, n.return, e);
						}
					}
					e.effectDuration += oi(t);
					break;
				case 27: t === null && s & 4 && pc(n);
				case 26:
				case 5:
					if (Oc(e, n), t === null) {
						if (s & 4) oc(n);
						else if (s & 64) {
							e = n.type, t = n.memoizedProps, c = n.stateNode;
							try {
								N(n, Gu, c, e, t, n);
							} catch (e) {
								Ml(n, n.return, e);
							}
						}
					}
					s & 512 && nc(n, n.return);
					break;
				case 12:
					if (s & 4) {
						s = ai(), Oc(e, n), e = n.stateNode, e.effectDuration += si(s);
						try {
							N(n, ic, n, t, b_, e.effectDuration);
						} catch (e) {
							Ml(n, n.return, e);
						}
					} else Oc(e, n);
					break;
				case 31:
					Oc(e, n), s & 4 && bc(e, n);
					break;
				case 13:
					Oc(e, n), s & 4 && xc(e, n), s & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (s = Il.bind(null, n), pd(e, s))));
					break;
				case 22:
					if (s = n.memoizedState !== null || _b, !s) {
						t = t !== null && t.memoizedState !== null || vb, c = _b;
						var l = vb;
						_b = s, (vb = t) && !l ? (Mc(e, n, (n.subtreeFlags & 8772) != 0), (n.mode & q) !== K && 0 <= J && 0 <= Y && .05 < Y - J && Gn(n, J, Y)) : Oc(e, n), _b = c, vb = l;
					}
					break;
				case 30: break;
				default: Oc(e, n);
			}
			(n.mode & q) !== K && 0 <= J && 0 <= Y && ((D_ || .05 < T_) && Jn(n, J, Y, T_, E_), n.alternate === null && n.return !== null && n.return.alternate !== null && .05 < Y - J && (mc(n.return.alternate, n.return) || Wn(n, J, Y, "Mount"))), ui(r), fi(i), E_ = a, D_ = o;
		}
		function _c(e) {
			var t = e.alternate;
			t !== null && (e.alternate = null, _c(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && We(t)), e.stateNode = null, e._debugOwner = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
		}
		function vc(e, t, n) {
			for (n = n.child; n !== null;) yc(e, t, n), n = n.sibling;
		}
		function yc(e, t, n) {
			if (Op && typeof Op.onCommitFiberUnmount == "function") try {
				Op.onCommitFiberUnmount(Dp, n);
			} catch (e) {
				kp || (kp = !0, console.error("React instrumentation encountered an error: %o", e));
			}
			var r = li(), i = di(), a = pi(), o = mi();
			switch (n.tag) {
				case 26:
					vb || rc(n, t), vc(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && (e = n.stateNode, e.parentNode.removeChild(e));
					break;
				case 27:
					vb || rc(n, t);
					var s = wb, c = Tb;
					Xu(n.type) && (wb = n.stateNode, Tb = !1), vc(e, t, n), N(n, wd, n.stateNode), wb = s, Tb = c;
					break;
				case 5: vb || rc(n, t);
				case 6:
					if (s = wb, c = Tb, wb = null, vc(e, t, n), wb = s, Tb = c, wb !== null) if (Tb) try {
						N(n, Qu, wb, n.stateNode);
					} catch (e) {
						Ml(n, t, e);
					}
					else try {
						N(n, Zu, wb, n.stateNode);
					} catch (e) {
						Ml(n, t, e);
					}
					break;
				case 18:
					wb !== null && (Tb ? (e = wb, $u(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), vf(e)) : $u(wb, n.stateNode));
					break;
				case 4:
					s = wb, c = Tb, wb = n.stateNode.containerInfo, Tb = !0, vc(e, t, n), wb = s, Tb = c;
					break;
				case 0:
				case 11:
				case 14:
				case 15:
					Js(hy, n, t), vb || Ks(n, t, gy), vc(e, t, n);
					break;
				case 1:
					vb || (rc(n, t), s = n.stateNode, typeof s.componentWillUnmount == "function" && ec(n, t, s)), vc(e, t, n);
					break;
				case 21:
					vc(e, t, n);
					break;
				case 22:
					vb = (s = vb) || n.memoizedState !== null, vc(e, t, n), vb = s;
					break;
				default: vc(e, t, n);
			}
			(n.mode & q) !== K && 0 <= J && 0 <= Y && (D_ || .05 < T_) && Jn(n, J, Y, T_, E_), ui(r), fi(i), E_ = a, D_ = o;
		}
		function bc(e, t) {
			if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
				e = e.dehydrated;
				try {
					N(t, bd, e);
				} catch (e) {
					Ml(t, t.return, e);
				}
			}
		}
		function xc(e, t) {
			if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
				N(t, xd, e);
			} catch (e) {
				Ml(t, t.return, e);
			}
		}
		function Sc(e) {
			switch (e.tag) {
				case 31:
				case 13:
				case 19:
					var t = e.stateNode;
					return t === null && (t = e.stateNode = new bb()), t;
				case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new bb()), t;
				default: throw Error("Unexpected Suspense handler tag (" + e.tag + "). This is a bug in React.");
			}
		}
		function Cc(e, t) {
			var n = Sc(e);
			t.forEach(function(t) {
				if (!n.has(t)) {
					if (n.add(t), Ap) if (Sb !== null && Cb !== null) Hl(Cb, Sb);
					else throw Error("Expected finished root and lanes to be set. This is a bug in React.");
					var r = Ll.bind(null, e, t);
					t.then(r, r);
				}
			});
		}
		function wc(e, t) {
			var n = t.deletions;
			if (n !== null) for (var r = 0; r < n.length; r++) {
				var i = e, a = t, o = n[r], s = li(), c = a;
				a: for (; c !== null;) {
					switch (c.tag) {
						case 27:
							if (Xu(c.type)) {
								wb = c.stateNode, Tb = !1;
								break a;
							}
							break;
						case 5:
							wb = c.stateNode, Tb = !1;
							break a;
						case 3:
						case 4:
							wb = c.stateNode.containerInfo, Tb = !0;
							break a;
					}
					c = c.return;
				}
				if (wb === null) throw Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
				yc(i, a, o), wb = null, Tb = !1, (o.mode & q) !== K && 0 <= J && 0 <= Y && .05 < Y - J && Wn(o, J, Y, "Unmount"), ui(s), i = o, a = i.alternate, a !== null && (a.return = null), i.return = null;
			}
			if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) Tc(t, e), t = t.sibling;
		}
		function Tc(e, t) {
			var n = li(), r = di(), i = pi(), a = mi(), o = e.alternate, s = e.flags;
			switch (e.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					wc(t, e), Ec(e), s & 4 && (Js(hy | my, e, e.return), qs(hy | my, e), Ks(e, e.return, gy | my));
					break;
				case 1:
					if (wc(t, e), Ec(e), s & 512 && (vb || o === null || rc(o, o.return)), s & 64 && _b && (s = e.updateQueue, s !== null && (o = s.callbacks, o !== null))) {
						var c = s.shared.hiddenCallbacks;
						s.shared.hiddenCallbacks = c === null ? o : c.concat(o);
					}
					break;
				case 26:
					if (c = Eb, wc(t, e), Ec(e), s & 512 && (vb || o === null || rc(o, o.return)), s & 4) {
						var l = o === null ? null : o.memoizedState;
						if (s = e.memoizedState, o === null) if (s === null) if (e.stateNode === null) {
							a: {
								s = e.type, o = e.memoizedProps, c = c.ownerDocument || c;
								b: switch (s) {
									case "title":
										l = c.getElementsByTagName("title")[0], (!l || l[Yp] || l[Hp] || l.namespaceURI === Mm || l.hasAttribute("itemprop")) && (l = c.createElement(s), c.head.insertBefore(l, c.querySelector("head > title"))), Su(l, s, o), l[Hp] = e, Ye(l), s = l;
										break a;
									case "link":
										var u = Rd("link", "href", c).get(s + (o.href || ""));
										if (u) {
											for (var d = 0; d < u.length; d++) if (l = u[d], l.getAttribute("href") === (o.href == null || o.href === "" ? null : o.href) && l.getAttribute("rel") === (o.rel == null ? null : o.rel) && l.getAttribute("title") === (o.title == null ? null : o.title) && l.getAttribute("crossorigin") === (o.crossOrigin == null ? null : o.crossOrigin)) {
												u.splice(d, 1);
												break b;
											}
										}
										l = c.createElement(s), Su(l, s, o), c.head.appendChild(l);
										break;
									case "meta":
										if (u = Rd("meta", "content", c).get(s + (o.content || ""))) {
											for (d = 0; d < u.length; d++) if (l = u[d], P(o.content, "content"), l.getAttribute("content") === (o.content == null ? null : "" + o.content) && l.getAttribute("name") === (o.name == null ? null : o.name) && l.getAttribute("property") === (o.property == null ? null : o.property) && l.getAttribute("http-equiv") === (o.httpEquiv == null ? null : o.httpEquiv) && l.getAttribute("charset") === (o.charSet == null ? null : o.charSet)) {
												u.splice(d, 1);
												break b;
											}
										}
										l = c.createElement(s), Su(l, s, o), c.head.appendChild(l);
										break;
									default: throw Error("getNodesForType encountered a type it did not expect: \"" + s + "\". This is a bug in React.");
								}
								l[Hp] = e, Ye(l), s = l;
							}
							e.stateNode = s;
						} else zd(c, e.type, e.stateNode);
						else e.stateNode = Pd(c, s, e.memoizedProps);
						else l === s ? s === null && e.stateNode !== null && sc(e, e.memoizedProps, o.memoizedProps) : (l === null ? o.stateNode !== null && (o = o.stateNode, o.parentNode.removeChild(o)) : l.count--, s === null ? zd(c, e.type, e.stateNode) : Pd(c, s, e.memoizedProps));
					}
					break;
				case 27:
					wc(t, e), Ec(e), s & 512 && (vb || o === null || rc(o, o.return)), o !== null && s & 4 && sc(e, e.memoizedProps, o.memoizedProps);
					break;
				case 5:
					if (wc(t, e), Ec(e), s & 512 && (vb || o === null || rc(o, o.return)), e.flags & 32) {
						c = e.stateNode;
						try {
							N(e, qu, c);
						} catch (t) {
							Ml(e, e.return, t);
						}
					}
					s & 4 && e.stateNode != null && (c = e.memoizedProps, sc(e, c, o === null ? c : o.memoizedProps)), s & 1024 && (yb = !0, e.type !== "form" && console.error("Unexpected host component type. Expected a form. This is a bug in React."));
					break;
				case 6:
					if (wc(t, e), Ec(e), s & 4) {
						if (e.stateNode === null) throw Error("This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.");
						s = e.memoizedProps, o = o === null ? s : o.memoizedProps, c = e.stateNode;
						try {
							N(e, Ju, c, o, s);
						} catch (t) {
							Ml(e, e.return, t);
						}
					}
					break;
				case 3:
					if (c = ai(), pC = null, l = Eb, Eb = Td(t.containerInfo), wc(t, e), Eb = l, Ec(e), s & 4 && o !== null && o.memoizedState.isDehydrated) try {
						N(e, yd, t.containerInfo);
					} catch (t) {
						Ml(e, e.return, t);
					}
					yb && (yb = !1, Dc(e)), t.effectDuration += oi(c);
					break;
				case 4:
					s = Eb, Eb = Td(e.stateNode.containerInfo), wc(t, e), Ec(e), Eb = s;
					break;
				case 12:
					s = ai(), wc(t, e), Ec(e), e.stateNode.effectDuration += si(s);
					break;
				case 31:
					wc(t, e), Ec(e), s & 4 && (s = e.updateQueue, s !== null && (e.updateQueue = null, Cc(e, s)));
					break;
				case 13:
					wc(t, e), Ec(e), e.child.flags & 8192 && e.memoizedState !== null != (o !== null && o.memoizedState !== null) && (_x = vp()), s & 4 && (s = e.updateQueue, s !== null && (e.updateQueue = null, Cc(e, s)));
					break;
				case 22:
					c = e.memoizedState !== null;
					var f = o !== null && o.memoizedState !== null, p = _b, m = vb;
					if (_b = p || c, vb = m || f, wc(t, e), vb = m, _b = p, f && !c && !p && !m && (e.mode & q) !== K && 0 <= J && 0 <= Y && .05 < Y - J && Gn(e, J, Y), Ec(e), s & 8192) a: for (t = e.stateNode, t._visibility = c ? t._visibility & ~Dg : t._visibility | Dg, !c || o === null || f || _b || vb || (Ac(e), (e.mode & q) !== K && 0 <= J && 0 <= Y && .05 < Y - J && Wn(e, J, Y, "Disconnect")), o = null, t = e;;) {
						if (t.tag === 5 || t.tag === 26) {
							if (o === null) {
								f = o = t;
								try {
									l = f.stateNode, c ? N(f, nd, l) : N(f, ad, f.stateNode, f.memoizedProps);
								} catch (e) {
									Ml(f, f.return, e);
								}
							}
						} else if (t.tag === 6) {
							if (o === null) {
								f = t;
								try {
									u = f.stateNode, c ? N(f, rd, u) : N(f, od, u, f.memoizedProps);
								} catch (e) {
									Ml(f, f.return, e);
								}
							}
						} else if (t.tag === 18) {
							if (o === null) {
								f = t;
								try {
									d = f.stateNode, c ? N(f, td, d) : N(f, id, f.stateNode);
								} catch (e) {
									Ml(f, f.return, e);
								}
							}
						} else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === e) && t.child !== null) {
							t.child.return = t, t = t.child;
							continue;
						}
						if (t === e) break a;
						for (; t.sibling === null;) {
							if (t.return === null || t.return === e) break a;
							o === t && (o = null), t = t.return;
						}
						o === t && (o = null), t.sibling.return = t.return, t = t.sibling;
					}
					s & 4 && (s = e.updateQueue, s !== null && (o = s.retryQueue, o !== null && (s.retryQueue = null, Cc(e, o))));
					break;
				case 19:
					wc(t, e), Ec(e), s & 4 && (s = e.updateQueue, s !== null && (e.updateQueue = null, Cc(e, s)));
					break;
				case 30: break;
				case 21: break;
				default: wc(t, e), Ec(e);
			}
			(e.mode & q) !== K && 0 <= J && 0 <= Y && ((D_ || .05 < T_) && Jn(e, J, Y, T_, E_), e.alternate === null && e.return !== null && e.return.alternate !== null && .05 < Y - J && (mc(e.return.alternate, e.return) || Wn(e, J, Y, "Mount"))), ui(n), fi(r), E_ = i, D_ = a;
		}
		function Ec(e) {
			var t = e.flags;
			if (t & 2) {
				try {
					N(e, fc, e);
				} catch (t) {
					Ml(e, e.return, t);
				}
				e.flags &= -3;
			}
			t & 4096 && (e.flags &= -4097);
		}
		function Dc(e) {
			if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
				var t = e;
				Dc(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
			}
		}
		function Oc(e, t) {
			if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) gc(e, t.alternate, t), t = t.sibling;
		}
		function kc(e) {
			var t = li(), n = di(), r = pi(), i = mi();
			switch (e.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					Ks(e, e.return, gy), Ac(e);
					break;
				case 1:
					rc(e, e.return);
					var a = e.stateNode;
					typeof a.componentWillUnmount == "function" && ec(e, e.return, a), Ac(e);
					break;
				case 27: N(e, wd, e.stateNode);
				case 26:
				case 5:
					rc(e, e.return), Ac(e);
					break;
				case 22:
					e.memoizedState === null && Ac(e);
					break;
				case 30:
					Ac(e);
					break;
				default: Ac(e);
			}
			(e.mode & q) !== K && 0 <= J && 0 <= Y && (D_ || .05 < T_) && Jn(e, J, Y, T_, E_), ui(t), fi(n), E_ = r, D_ = i;
		}
		function Ac(e) {
			for (e = e.child; e !== null;) kc(e), e = e.sibling;
		}
		function jc(e, t, n, r) {
			var i = li(), a = di(), o = pi(), s = mi(), c = n.flags;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					Mc(e, n, r), Gs(n, gy);
					break;
				case 1:
					if (Mc(e, n, r), t = n.stateNode, typeof t.componentDidMount == "function" && N(n, wv, n, t), t = n.updateQueue, t !== null) {
						e = n.stateNode;
						try {
							N(n, na, t, e);
						} catch (e) {
							Ml(n, n.return, e);
						}
					}
					r && c & 64 && Zs(n), nc(n, n.return);
					break;
				case 27: pc(n);
				case 26:
				case 5:
					Mc(e, n, r), r && t === null && c & 4 && oc(n), nc(n, n.return);
					break;
				case 12:
					if (r && c & 4) {
						c = ai(), Mc(e, n, r), r = n.stateNode, r.effectDuration += si(c);
						try {
							N(n, ic, n, t, b_, r.effectDuration);
						} catch (e) {
							Ml(n, n.return, e);
						}
					} else Mc(e, n, r);
					break;
				case 31:
					Mc(e, n, r), r && c & 4 && bc(e, n);
					break;
				case 13:
					Mc(e, n, r), r && c & 4 && xc(e, n);
					break;
				case 22:
					n.memoizedState === null && Mc(e, n, r), nc(n, n.return);
					break;
				case 30: break;
				default: Mc(e, n, r);
			}
			(n.mode & q) !== K && 0 <= J && 0 <= Y && (D_ || .05 < T_) && Jn(n, J, Y, T_, E_), ui(i), fi(a), E_ = o, D_ = s;
		}
		function Mc(e, t, n) {
			for (n &&= (t.subtreeFlags & 8772) != 0, t = t.child; t !== null;) jc(e, t.alternate, t, n), t = t.sibling;
		}
		function Nc(e, t) {
			var n = null;
			e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && ti(e), n != null && ni(n));
		}
		function Pc(e, t) {
			e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (ti(t), e != null && ni(e));
		}
		function Fc(e, t, n, r, i) {
			if (t.subtreeFlags & 10256 || t.actualDuration !== 0 && (t.alternate === null || t.alternate.child !== t.child)) for (t = t.child; t !== null;) {
				var a = t.sibling;
				Ic(e, t, n, r, a === null ? i : a.actualStartTime), t = a;
			}
		}
		function Ic(e, t, n, r, i) {
			var a = li(), o = di(), s = pi(), c = mi(), l = xg, u = t.flags;
			switch (t.tag) {
				case 0:
				case 11:
				case 15:
					(t.mode & q) !== K && 0 < t.actualStartTime && t.flags & 1 && Kn(t, t.actualStartTime, i, Db, n), Fc(e, t, n, r, i), u & 2048 && Ys(t, _y | my);
					break;
				case 1:
					(t.mode & q) !== K && 0 < t.actualStartTime && (t.flags & 128 ? qn(t, t.actualStartTime, i, []) : t.flags & 1 && Kn(t, t.actualStartTime, i, Db, n)), Fc(e, t, n, r, i);
					break;
				case 3:
					var d = ai(), f = Db;
					Db = t.alternate !== null && t.alternate.memoizedState.isDehydrated && (t.flags & 256) == 0, Fc(e, t, n, r, i), Db = f, u & 2048 && (n = null, t.alternate !== null && (n = t.alternate.memoizedState.cache), r = t.memoizedState.cache, r !== n && (ti(r), n != null && ni(n))), e.passiveEffectDuration += oi(d);
					break;
				case 12:
					if (u & 2048) {
						u = ai(), Fc(e, t, n, r, i), e = t.stateNode, e.passiveEffectDuration += si(u);
						try {
							N(t, ac, t, t.alternate, b_, e.passiveEffectDuration);
						} catch (e) {
							Ml(t, t.return, e);
						}
					} else Fc(e, t, n, r, i);
					break;
				case 31:
					u = Db, d = t.alternate === null ? null : t.alternate.memoizedState, f = t.memoizedState, d !== null && f === null ? (f = t.deletions, f !== null && 0 < f.length && f[0].tag === 18 ? (Db = !1, d = d.hydrationErrors, d !== null && qn(t, t.actualStartTime, i, d)) : Db = !0) : Db = !1, Fc(e, t, n, r, i), Db = u;
					break;
				case 13:
					u = Db, d = t.alternate === null ? null : t.alternate.memoizedState, f = t.memoizedState, d === null || d.dehydrated === null || f !== null && f.dehydrated !== null ? Db = !1 : (f = t.deletions, f !== null && 0 < f.length && f[0].tag === 18 ? (Db = !1, d = d.hydrationErrors, d !== null && qn(t, t.actualStartTime, i, d)) : Db = !0), Fc(e, t, n, r, i), Db = u;
					break;
				case 23: break;
				case 22:
					f = t.stateNode, d = t.alternate, t.memoizedState === null ? f._visibility & Og ? Fc(e, t, n, r, i) : (f._visibility |= Og, Lc(e, t, n, r, (t.subtreeFlags & 10256) != 0 || t.actualDuration !== 0 && (t.alternate === null || t.alternate.child !== t.child), i), (t.mode & q) === K || Db || (e = t.actualStartTime, 0 <= e && .05 < i - e && Gn(t, e, i), 0 <= J && 0 <= Y && .05 < Y - J && Gn(t, J, Y))) : f._visibility & Og ? Fc(e, t, n, r, i) : zc(e, t, n, r, i), u & 2048 && Nc(d, t);
					break;
				case 24:
					Fc(e, t, n, r, i), u & 2048 && Pc(t.alternate, t);
					break;
				default: Fc(e, t, n, r, i);
			}
			(t.mode & q) !== K && ((e = !Db && t.alternate === null && t.return !== null && t.return.alternate !== null) && (n = t.actualStartTime, 0 <= n && .05 < i - n && Wn(t, n, i, "Mount")), 0 <= J && 0 <= Y && ((D_ || .05 < T_) && Jn(t, J, Y, T_, E_), e && .05 < Y - J && Wn(t, J, Y, "Mount"))), ui(a), fi(o), E_ = s, D_ = c, xg = l;
		}
		function Lc(e, t, n, r, i, a) {
			for (i &&= (t.subtreeFlags & 10256) != 0 || t.actualDuration !== 0 && (t.alternate === null || t.alternate.child !== t.child), t = t.child; t !== null;) {
				var o = t.sibling;
				Rc(e, t, n, r, i, o === null ? a : o.actualStartTime), t = o;
			}
		}
		function Rc(e, t, n, r, i, a) {
			var o = li(), s = di(), c = pi(), l = mi(), u = xg;
			i && (t.mode & q) !== K && 0 < t.actualStartTime && t.flags & 1 && Kn(t, t.actualStartTime, a, Db, n);
			var d = t.flags;
			switch (t.tag) {
				case 0:
				case 11:
				case 15:
					Lc(e, t, n, r, i, a), Ys(t, _y);
					break;
				case 23: break;
				case 22:
					var f = t.stateNode;
					t.memoizedState === null ? (f._visibility |= Og, Lc(e, t, n, r, i, a)) : f._visibility & Og ? Lc(e, t, n, r, i, a) : zc(e, t, n, r, a), i && d & 2048 && Nc(t.alternate, t);
					break;
				case 24:
					Lc(e, t, n, r, i, a), i && d & 2048 && Pc(t.alternate, t);
					break;
				default: Lc(e, t, n, r, i, a);
			}
			(t.mode & q) !== K && 0 <= J && 0 <= Y && (D_ || .05 < T_) && Jn(t, J, Y, T_, E_), ui(o), fi(s), E_ = c, D_ = l, xg = u;
		}
		function zc(e, t, n, r, i) {
			if (t.subtreeFlags & 10256 || t.actualDuration !== 0 && (t.alternate === null || t.alternate.child !== t.child)) for (var a = t.child; a !== null;) {
				t = a.sibling;
				var o = e, s = n, c = r, l = t === null ? i : t.actualStartTime, u = xg;
				(a.mode & q) !== K && 0 < a.actualStartTime && a.flags & 1 && Kn(a, a.actualStartTime, l, Db, s);
				var d = a.flags;
				switch (a.tag) {
					case 22:
						zc(o, a, s, c, l), d & 2048 && Nc(a.alternate, a);
						break;
					case 24:
						zc(o, a, s, c, l), d & 2048 && Pc(a.alternate, a);
						break;
					default: zc(o, a, s, c, l);
				}
				xg = u, a = t;
			}
		}
		function Bc(e, t, n) {
			if (e.subtreeFlags & Ob) for (e = e.child; e !== null;) Vc(e, t, n), e = e.sibling;
		}
		function Vc(e, t, n) {
			switch (e.tag) {
				case 26:
					Bc(e, t, n), e.flags & Ob && e.memoizedState !== null && Hd(n, Eb, e.memoizedState, e.memoizedProps);
					break;
				case 5:
					Bc(e, t, n);
					break;
				case 3:
				case 4:
					var r = Eb;
					Eb = Td(e.stateNode.containerInfo), Bc(e, t, n), Eb = r;
					break;
				case 22:
					e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = Ob, Ob = 16777216, Bc(e, t, n), Ob = r) : Bc(e, t, n));
					break;
				default: Bc(e, t, n);
			}
		}
		function Hc(e) {
			var t = e.alternate;
			if (t !== null && (e = t.child, e !== null)) {
				t.child = null;
				do
					t = e.sibling, e.sibling = null, e = t;
				while (e !== null);
			}
		}
		function Uc(e) {
			var t = e.deletions;
			if (e.flags & 16) {
				if (t !== null) for (var n = 0; n < t.length; n++) {
					var r = t[n], i = li();
					xb = r, qc(r, e), (r.mode & q) !== K && 0 <= J && 0 <= Y && .05 < Y - J && Wn(r, J, Y, "Unmount"), ui(i);
				}
				Hc(e);
			}
			if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) Wc(e), e = e.sibling;
		}
		function Wc(e) {
			var t = li(), n = di(), r = pi(), i = mi();
			switch (e.tag) {
				case 0:
				case 11:
				case 15:
					Uc(e), e.flags & 2048 && Xs(e, e.return, _y | my);
					break;
				case 3:
					var a = ai();
					Uc(e), e.stateNode.passiveEffectDuration += oi(a);
					break;
				case 12:
					a = ai(), Uc(e), e.stateNode.passiveEffectDuration += si(a);
					break;
				case 22:
					a = e.stateNode, e.memoizedState !== null && a._visibility & Og && (e.return === null || e.return.tag !== 13) ? (a._visibility &= ~Og, Gc(e), (e.mode & q) !== K && 0 <= J && 0 <= Y && .05 < Y - J && Wn(e, J, Y, "Disconnect")) : Uc(e);
					break;
				default: Uc(e);
			}
			(e.mode & q) !== K && 0 <= J && 0 <= Y && (D_ || .05 < T_) && Jn(e, J, Y, T_, E_), ui(t), fi(n), D_ = i, E_ = r;
		}
		function Gc(e) {
			var t = e.deletions;
			if (e.flags & 16) {
				if (t !== null) for (var n = 0; n < t.length; n++) {
					var r = t[n], i = li();
					xb = r, qc(r, e), (r.mode & q) !== K && 0 <= J && 0 <= Y && .05 < Y - J && Wn(r, J, Y, "Unmount"), ui(i);
				}
				Hc(e);
			}
			for (e = e.child; e !== null;) Kc(e), e = e.sibling;
		}
		function Kc(e) {
			var t = li(), n = di(), r = pi(), i = mi();
			switch (e.tag) {
				case 0:
				case 11:
				case 15:
					Xs(e, e.return, _y), Gc(e);
					break;
				case 22:
					var a = e.stateNode;
					a._visibility & Og && (a._visibility &= ~Og, Gc(e));
					break;
				default: Gc(e);
			}
			(e.mode & q) !== K && 0 <= J && 0 <= Y && (D_ || .05 < T_) && Jn(e, J, Y, T_, E_), ui(t), fi(n), D_ = i, E_ = r;
		}
		function qc(e, t) {
			for (; xb !== null;) {
				var n = xb, r = n, i = t, a = li(), o = di(), s = pi(), c = mi();
				switch (r.tag) {
					case 0:
					case 11:
					case 15:
						Xs(r, i, _y);
						break;
					case 23:
					case 22:
						r.memoizedState !== null && r.memoizedState.cachePool !== null && (i = r.memoizedState.cachePool.pool, i != null && ti(i));
						break;
					case 24: ni(r.memoizedState.cache);
				}
				if ((r.mode & q) !== K && 0 <= J && 0 <= Y && (D_ || .05 < T_) && Jn(r, J, Y, T_, E_), ui(a), fi(o), D_ = c, E_ = s, r = n.child, r !== null) r.return = n, xb = r;
				else a: for (n = e; xb !== null;) {
					if (r = xb, a = r.sibling, o = r.return, _c(r), r === n) {
						xb = null;
						break a;
					}
					if (a !== null) {
						a.return = o, xb = a;
						break a;
					}
					xb = o;
				}
			}
		}
		function Jc() {
			jb.forEach(function(e) {
				return e();
			});
		}
		function Yc() {
			var e = typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0;
			return e || G.actQueue === null || console.error("The current testing environment is not configured to support act(...)"), e;
		}
		function Xc(e) {
			if ((Ub & Pb) !== Nb && $ !== 0) return $ & -$;
			var t = G.T;
			return t === null ? He() : (t._updatedFibers ||= /* @__PURE__ */ new Set(), t._updatedFibers.add(e), $l());
		}
		function Zc() {
			if (fx === 0) if (!($ & 536870912) || $g) {
				var e = Fp;
				Fp <<= 1, !(Fp & 3932160) && (Fp = 262144), fx = e;
			} else fx = 536870912;
			return e = cy.current, e !== null && (e.flags |= 32), fx;
		}
		function Qc(e, t, n) {
			if (eS && console.error("useInsertionEffect must not schedule updates."), Yx && (Xx = !0), (e === Wb && (nx === Jb || nx === tx) || e.cancelPendingCommit !== null) && (ol(e, 0), nl(e, $, fx, !1)), Ne(e, n), (Ub & Pb) !== Nb && e === Wb) {
				if (fp) switch (t.tag) {
					case 0:
					case 11:
					case 15:
						e = Gb && T(Gb) || "Unknown", rS.has(e) || (rS.add(e), t = T(t) || "Unknown", console.error("Cannot update a component (`%s`) while rendering a different component (`%s`). To locate the bad setState() call inside `%s`, follow the stack trace as described in https://react.dev/link/setstate-in-render", t, e, e));
						break;
					case 1: nS ||= (console.error("Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state."), !0);
				}
			} else Ap && ze(e, t, n), Wl(t), e === Wb && ((Ub & Pb) === Nb && (ux |= n), cx === Bb && nl(e, $, fx, !1)), Gl(e);
		}
		function $c(e, t, n) {
			if ((Ub & (Pb | Fb)) !== Nb) throw Error("Should not already be working.");
			if ($ !== 0 && Gb !== null) {
				var r = Gb, i = vp();
				switch ($_) {
					case Yb:
					case Jb:
						var a = ev;
						_g && ((r = r._debugTask) ? r.run(console.timeStamp.bind(console, "Suspended", a, i, vg, void 0, "primary-light")) : console.timeStamp("Suspended", a, i, vg, void 0, "primary-light"));
						break;
					case tx:
						a = ev, _g && ((r = r._debugTask) ? r.run(console.timeStamp.bind(console, "Action", a, i, vg, void 0, "primary-light")) : console.timeStamp("Action", a, i, vg, void 0, "primary-light"));
						break;
					default: _g && (r = i - ev, 3 > r || console.timeStamp("Blocked", ev, i, vg, void 0, 5 > r ? "primary-light" : 10 > r ? "primary" : 100 > r ? "primary-dark" : "error"));
				}
			}
			a = (n = !n && (t & 127) == 0 && (t & e.expiredLanes) === 0 || ke(e, t)) ? hl(e, t) : pl(e, t, !0);
			var o = n;
			do {
				if (a === Ib) {
					ax && !n && nl(e, t, 0, !1), t = nx, ev = h_(), $_ = t;
					break;
				} else {
					if (r = vp(), i = e.current.alternate, o && !tl(i)) {
						Un(t), i = y_, a = r, !_g || a <= i || (Cx ? Cx.run(console.timeStamp.bind(console, "Teared Render", i, a, bg, yg, "error")) : console.timeStamp("Teared Render", i, a, bg, yg, "error")), al(t, r), a = pl(e, t, !1), o = !1;
						continue;
					}
					if (a === Rb) {
						if (o = t, e.errorRecoveryDisabledLanes & o) var s = 0;
						else s = e.pendingLanes & -536870913, s = s === 0 ? s & 536870912 ? 536870912 : 0 : s;
						if (s !== 0) {
							Un(t), $n(y_, r, t, Cx), al(t, r), t = s;
							a: {
								r = e, a = o, o = mx;
								var c = r.current.memoizedState.isDehydrated;
								if (c && (ol(r, s).flags |= 256), s = pl(r, s, !1), s !== Rb) {
									if (ox && !c) {
										r.errorRecoveryDisabledLanes |= a, ux |= a, a = Bb;
										break a;
									}
									r = hx, hx = o, r !== null && (hx === null ? hx = r : hx.push.apply(hx, r));
								}
								a = s;
							}
							if (o = !1, a !== Rb) continue;
							r = vp();
						}
					}
					if (a === Lb) {
						Un(t), $n(y_, r, t, Cx), al(t, r), ol(e, 0), nl(e, t, 0, !0);
						break;
					}
					a: {
						switch (n = e, a) {
							case Ib:
							case Lb: throw Error("Root did not complete. This is a bug in React.");
							case Bb: if ((t & 4194048) !== t) break;
							case Vb:
								Un(t), Xn(y_, r, t, Cx), al(t, r), i = t, i & 127 ? L_ = r : i & 4194048 && (J_ = r), nl(n, t, fx, !ix);
								break a;
							case Rb:
								hx = null;
								break;
							case zb:
							case Hb: break;
							default: throw Error("Unknown root exit status.");
						}
						if (G.actQueue !== null) Cl(n, i, t, hx, Sx, gx, fx, ux, px, a, null, null, y_, r);
						else {
							if ((t & 62914560) === t && (o = _x + yx - vp(), 10 < o)) {
								if (nl(n, t, fx, !ix), Oe(n, 0, !0) !== 0) break a;
								Rx = t, n.timeoutHandle = QS(el.bind(null, n, i, hx, Sx, gx, t, fx, ux, px, ix, a, "Throttled", y_, r), o);
								break a;
							}
							el(n, i, hx, Sx, gx, t, fx, ux, px, ix, a, null, y_, r);
						}
					}
				}
				break;
			} while (1);
			Gl(e);
		}
		function el(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
			e.timeoutHandle = eC;
			var m = t.subtreeFlags, h = null;
			if ((m & 8192 || (m & 16785408) == 16785408) && (h = {
				stylesheets: null,
				count: 0,
				imgCount: 0,
				imgBytes: 0,
				suspenseyImages: [],
				waitingForImages: !0,
				waitingForViewTransition: !1,
				unsuspend: en
			}, Vc(t, a, h), m = (a & 62914560) === a ? _x - vp() : (a & 4194048) === a ? vx - vp() : 0, m = Ud(h, m), m !== null)) {
				Rx = a, e.cancelPendingCommit = m(Cl.bind(null, e, t, a, n, r, i, o, s, c, u, h, h.waitingForViewTransition ? "Waiting for the previous Animation" : 0 < h.count ? 0 < h.imgCount ? "Suspended on CSS and Images" : "Suspended on CSS" : h.imgCount === 1 ? "Suspended on an Image" : 0 < h.imgCount ? "Suspended on Images" : null, f, p)), nl(e, a, o, !l);
				return;
			}
			Cl(e, t, a, n, r, i, o, s, c, u, h, d, f, p);
		}
		function tl(e) {
			for (var t = e;;) {
				var n = t.tag;
				if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null))) for (var r = 0; r < n.length; r++) {
					var i = n[r], a = i.getSnapshot;
					i = i.value;
					try {
						if (!Bh(a(), i)) return !1;
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
		function nl(e, t, n, r) {
			t &= ~dx, t &= ~ux, e.suspendedLanes |= t, e.pingedLanes &= ~t, r && (e.warmLanes |= t), r = e.expirationTimes;
			for (var i = t; 0 < i;) {
				var a = 31 - jp(i), o = 1 << a;
				r[a] = -1, i &= ~o;
			}
			n !== 0 && Fe(e, n, t);
		}
		function rl() {
			return (Ub & (Pb | Fb)) === Nb ? (V(0, !1), !1) : !0;
		}
		function il() {
			if (Gb !== null) {
				if (nx === Kb) var e = Gb.return;
				else e = Gb, Ur(), Ca(e), Uv = null, Wv = 0, e = Gb;
				for (; e !== null;) Us(e.alternate, e), e = e.return;
				Gb = null;
			}
		}
		function al(e, t) {
			e & 127 && (O_ = t), e & 4194048 && (R_ = t), e & 62914560 && (Y_ = t), e & 2080374784 && (X_ = t);
		}
		function ol(e, t) {
			_g && (console.timeStamp("Blocking Track", .003, .003, "Blocking", yg, "primary-light"), console.timeStamp("Transition Track", .003, .003, "Transition", yg, "primary-light"), console.timeStamp("Suspense Track", .003, .003, "Suspense", yg, "primary-light"), console.timeStamp("Idle Track", .003, .003, "Idle", yg, "primary-light"));
			var n = y_;
			if (y_ = h_(), $ !== 0 && 0 < n) {
				if (Un($), cx === zb || cx === Bb) Xn(n, y_, t, Cx);
				else {
					var r = y_, i = Cx;
					if (_g && !(r <= n)) {
						var a = (t & 738197653) === t ? "tertiary-dark" : "primary-dark", o = (t & 536870912) === t ? "Prewarm" : (t & 201326741) === t ? "Interrupted Hydration" : "Interrupted Render";
						i ? i.run(console.timeStamp.bind(console, o, n, r, bg, yg, a)) : console.timeStamp(o, n, r, bg, yg, a);
					}
				}
				al($, y_);
			}
			if (n = Cx, Cx = null, t & 127) {
				Cx = A_, i = 0 <= k_ && k_ < O_ ? O_ : k_, r = 0 <= P_ && P_ < O_ ? O_ : P_, a = 0 <= r ? r : 0 <= i ? i : y_, 0 <= L_ ? (Un(2), Zn(L_, a, t, n)) : Z_ & 127 && (Un(2), nr(O_, a, Q_)), n = i;
				var s = r, c = F_, l = 0 < I_, u = j_ === __, d = j_ === v_;
				if (i = y_, r = A_, a = M_, o = N_, _g) {
					if (bg = "Blocking", 0 < n ? n > i && (n = i) : n = i, 0 < s ? s > n && (s = n) : s = n, c !== null && n > s) {
						var f = l ? "secondary-light" : "warning";
						r ? r.run(console.timeStamp.bind(console, l ? "Consecutive" : "Event: " + c, s, n, bg, yg, f)) : console.timeStamp(l ? "Consecutive" : "Event: " + c, s, n, bg, yg, f);
					}
					i > n && (s = u ? "error" : (t & 738197653) === t ? "tertiary-light" : "primary-light", u = d ? "Promise Resolved" : u ? "Cascading Update" : 5 < i - n ? "Update Blocked" : "Update", d = [], o != null && d.push(["Component name", o]), a != null && d.push(["Method name", a]), n = {
						start: n,
						end: i,
						detail: { devtools: {
							properties: d,
							track: bg,
							trackGroup: yg,
							color: s
						} }
					}, r ? r.run(performance.measure.bind(performance, u, n)) : performance.measure(u, n));
				}
				k_ = -1.1, j_ = 0, N_ = M_ = null, L_ = -1.1, I_ = P_, P_ = -1.1, O_ = h_();
			}
			if (t & 4194048 && (Cx = H_, i = 0 <= z_ && z_ < R_ ? R_ : z_, n = 0 <= B_ && B_ < R_ ? R_ : B_, r = 0 <= G_ && G_ < R_ ? R_ : G_, a = 0 <= r ? r : 0 <= n ? n : y_, 0 <= J_ ? (Un(256), Zn(J_, a, t, Cx)) : Z_ & 4194048 && (Un(256), nr(R_, a, Q_)), d = r, s = K_, c = 0 < q_, l = V_ === v_, a = y_, r = H_, o = U_, u = W_, _g && (bg = "Transition", 0 < n ? n > a && (n = a) : n = a, 0 < i ? i > n && (i = n) : i = n, 0 < d ? d > i && (d = i) : d = i, i > d && s !== null && (f = c ? "secondary-light" : "warning", r ? r.run(console.timeStamp.bind(console, c ? "Consecutive" : "Event: " + s, d, i, bg, yg, f)) : console.timeStamp(c ? "Consecutive" : "Event: " + s, d, i, bg, yg, f)), n > i && (r ? r.run(console.timeStamp.bind(console, "Action", i, n, bg, yg, "primary-dark")) : console.timeStamp("Action", i, n, bg, yg, "primary-dark")), a > n && (i = l ? "Promise Resolved" : 5 < a - n ? "Update Blocked" : "Update", d = [], u != null && d.push(["Component name", u]), o != null && d.push(["Method name", o]), n = {
				start: n,
				end: a,
				detail: { devtools: {
					properties: d,
					track: bg,
					trackGroup: yg,
					color: "primary-light"
				} }
			}, r ? r.run(performance.measure.bind(performance, i, n)) : performance.measure(i, n))), B_ = z_ = -1.1, V_ = 0, J_ = -1.1, q_ = G_, G_ = -1.1, R_ = h_()), t & 62914560 && Z_ & 62914560 && (Un(4194304), nr(Y_, y_, Q_)), t & 2080374784 && Z_ & 2080374784 && (Un(268435456), nr(X_, y_, Q_)), n = e.timeoutHandle, n !== eC && (e.timeoutHandle = eC, $S(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), Rx = 0, il(), Wb = e, Gb = n = gr(e.current, null), $ = t, nx = Kb, rx = null, ix = !1, ax = ke(e, t), ox = !1, cx = Ib, px = fx = dx = ux = lx = 0, hx = mx = null, gx = !1, t & 8 && (t |= t & 32), r = e.entangledLanes, r !== 0) for (e = e.entanglements, r &= t; 0 < r;) i = 31 - jp(r), a = 1 << i, t |= e[i], r &= ~a;
			return sx = t, rr(), e = og(), 1e3 < e - ig && (G.recentlyCreatedOwnerStacks = 0, ig = e), lv.discardPendingWarnings(), n;
		}
		function sl(e, t) {
			Z = null, G.H = Ly, G.getCurrentStack = null, fp = !1, dp = null, t === Lv || t === zv ? (t = Mi(), nx = Yb) : t === Rv ? (t = Mi(), nx = Xb) : nx = t === ab ? ex : typeof t == "object" && t && typeof t.then == "function" ? Qb : qb, rx = t;
			var n = Gb;
			n === null ? (cx = Lb, es(e, wr(t, e.current))) : n.mode & q && gi(n);
		}
		function cl() {
			var e = cy.current;
			return e === null ? !0 : ($ & 4194048) === $ ? ly === null : ($ & 62914560) === $ || $ & 536870912 ? e === ly : !1;
		}
		function ll() {
			var e = G.H;
			return G.H = Ly, e === null ? Ly : e;
		}
		function ul() {
			var e = G.A;
			return G.A = kb, e;
		}
		function dl(e) {
			Cx === null && (Cx = e._debugTask == null ? null : e._debugTask);
		}
		function fl() {
			cx = Bb, ix || ($ & 4194048) !== $ && cy.current !== null || (ax = !0), !(lx & 134217727) && !(ux & 134217727) || Wb === null || nl(Wb, $, fx, !1);
		}
		function pl(e, t, n) {
			var r = Ub;
			Ub |= Pb;
			var i = ll(), a = ul();
			if (Wb !== e || $ !== t) {
				if (Ap) {
					var o = e.memoizedUpdaters;
					0 < o.size && (Hl(e, $), o.clear()), Be(e, t);
				}
				Sx = null, ol(e, t);
			}
			t = !1, o = cx;
			a: do
				try {
					if (nx !== Kb && Gb !== null) {
						var s = Gb, c = rx;
						switch (nx) {
							case ex:
								il(), o = Vb;
								break a;
							case Yb:
							case Jb:
							case tx:
							case Qb:
								cy.current === null && (t = !0);
								var l = nx;
								if (nx = Kb, rx = null, bl(e, s, c, l), n && ax) {
									o = Ib;
									break a;
								}
								break;
							default: l = nx, nx = Kb, rx = null, bl(e, s, c, l);
						}
					}
					ml(), o = cx;
					break;
				} catch (t) {
					sl(e, t);
				}
			while (1);
			return t && e.shellSuspendCounter++, Ur(), Ub = r, G.H = i, G.A = a, Gb === null && (Wb = null, $ = 0, rr()), o;
		}
		function ml() {
			for (; Gb !== null;) _l(Gb);
		}
		function hl(e, t) {
			var n = Ub;
			Ub |= Pb;
			var r = ll(), i = ul();
			if (Wb !== e || $ !== t) {
				if (Ap) {
					var a = e.memoizedUpdaters;
					0 < a.size && (Hl(e, $), a.clear()), Be(e, t);
				}
				Sx = null, bx = vp() + xx, ol(e, t);
			} else ax = ke(e, t);
			a: do
				try {
					if (nx !== Kb && Gb !== null) b: switch (t = Gb, a = rx, nx) {
						case qb:
							nx = Kb, rx = null, bl(e, t, a, qb);
							break;
						case Jb:
						case tx:
							if (ki(a)) {
								nx = Kb, rx = null, vl(t);
								break;
							}
							t = function() {
								nx !== Jb && nx !== tx || Wb !== e || (nx = $b), Gl(e);
							}, a.then(t, t);
							break a;
						case Yb:
							nx = $b;
							break a;
						case Xb:
							nx = Zb;
							break a;
						case $b:
							ki(a) ? (nx = Kb, rx = null, vl(t)) : (nx = Kb, rx = null, bl(e, t, a, $b));
							break;
						case Zb:
							var o = null;
							switch (Gb.tag) {
								case 26: o = Gb.memoizedState;
								case 5:
								case 27:
									var s = Gb;
									if (o ? Vd(o) : s.stateNode.complete) {
										nx = Kb, rx = null;
										var c = s.sibling;
										if (c !== null) Gb = c;
										else {
											var l = s.return;
											l === null ? Gb = null : (Gb = l, xl(l));
										}
										break b;
									}
									break;
								default: console.error("Unexpected type of fiber triggered a suspensey commit. This is a bug in React.");
							}
							nx = Kb, rx = null, bl(e, t, a, Zb);
							break;
						case Qb:
							nx = Kb, rx = null, bl(e, t, a, Qb);
							break;
						case ex:
							il(), cx = Vb;
							break a;
						default: throw Error("Unexpected SuspendedReason. This is a bug in React.");
					}
					G.actQueue === null ? gl() : ml();
					break;
				} catch (t) {
					sl(e, t);
				}
			while (1);
			return Ur(), G.H = r, G.A = i, Ub = n, Gb === null ? (Wb = null, $ = 0, rr(), cx) : Ib;
		}
		function gl() {
			for (; Gb !== null && !gp();) _l(Gb);
		}
		function _l(e) {
			var t = e.alternate;
			(e.mode & q) === K ? t = N(e, Ps, t, e, sx) : (hi(e), t = N(e, Ps, t, e, sx), gi(e)), e.memoizedProps = e.pendingProps, t === null ? xl(e) : Gb = t;
		}
		function vl(e) {
			var t = N(e, yl, e);
			e.memoizedProps = e.pendingProps, t === null ? xl(e) : Gb = t;
		}
		function yl(e) {
			var t = e.alternate, n = (e.mode & q) !== K;
			switch (n && hi(e), e.tag) {
				case 15:
				case 0:
					t = vs(t, e, e.pendingProps, e.type, void 0, $);
					break;
				case 11:
					t = vs(t, e, e.pendingProps, e.type.render, e.ref, $);
					break;
				case 5: Ca(e);
				default: Us(t, e), e = Gb = _r(e, sx), t = Ps(t, e, sx);
			}
			return n && gi(e), t;
		}
		function bl(e, t, n, r) {
			Ur(), Ca(t), Uv = null, Wv = 0;
			var i = t.return;
			try {
				if (as(e, i, t, n, $)) {
					cx = Lb, es(e, wr(n, e.current)), Gb = null;
					return;
				}
			} catch (t) {
				if (i !== null) throw Gb = i, t;
				cx = Lb, es(e, wr(n, e.current)), Gb = null;
				return;
			}
			t.flags & 32768 ? ($g || r === qb ? e = !0 : ax || $ & 536870912 ? e = !1 : (ix = e = !0, (r === Jb || r === tx || r === Yb || r === Qb) && (r = cy.current, r !== null && r.tag === 13 && (r.flags |= 16384))), Sl(t, e)) : xl(t);
		}
		function xl(e) {
			var t = e;
			do {
				if (t.flags & 32768) {
					Sl(t, ix);
					return;
				}
				var n = t.alternate;
				if (e = t.return, hi(t), n = N(t, Vs, n, t, sx), (t.mode & q) !== K && _i(t), n !== null) {
					Gb = n;
					return;
				}
				if (t = t.sibling, t !== null) {
					Gb = t;
					return;
				}
				Gb = t = e;
			} while (t !== null);
			cx === Ib && (cx = Hb);
		}
		function Sl(e, t) {
			do {
				var n = Hs(e.alternate, e);
				if (n !== null) {
					n.flags &= 32767, Gb = n;
					return;
				}
				if ((e.mode & q) !== K) {
					_i(e), n = e.actualDuration;
					for (var r = e.child; r !== null;) n += r.actualDuration, r = r.sibling;
					e.actualDuration = n;
				}
				if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
					Gb = e;
					return;
				}
				Gb = e = n;
			} while (e !== null);
			cx = Vb, Gb = null;
		}
		function Cl(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
			e.cancelPendingCommit = null;
			do
				kl();
			while (Fx !== kx);
			if (lv.flushLegacyContextWarning(), lv.flushPendingUnsafeLifecycleWarnings(), (Ub & (Pb | Fb)) !== Nb) throw Error("Should not already be working.");
			if (Un(n), l === Rb ? $n(f, p, n, Cx) : r === null ? Yn(f, p, n, Cx) : Qn(f, p, n, r, t !== null && t.alternate !== null && t.alternate.memoizedState.isDehydrated && (t.flags & 256) != 0, Cx), t !== null) {
				if (n === 0 && console.error("finishedLanes should not be empty during a commit. This is a bug in React."), t === e.current) throw Error("Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue.");
				if (a = t.lanes | t.childLanes, a |= jg, Pe(e, n, a, o, s, c), e === Wb && (Gb = Wb = null, $ = 0), Lx = t, Ix = e, Rx = n, zx = a, Vx = i, Hx = r, Bx = p, Ux = d, Wx = Tx, Gx = null, t.actualDuration !== 0 || t.subtreeFlags & 10256 || t.flags & 10256 ? (e.callbackNode = null, e.callbackPriority = 0, Ul(Sp, function() {
					return ZS = window.event, Wx === Tx && (Wx = Dx), Al(), null;
				})) : (e.callbackNode = null, e.callbackPriority = 0), S_ = null, b_ = h_(), d !== null && er(p, b_, d, Cx), r = (t.flags & 13878) != 0, t.subtreeFlags & 13878 || r) {
					r = G.T, G.T = null, i = Wf.p, Wf.p = Lp, o = Ub, Ub |= Fb;
					try {
						hc(e, t, n);
					} finally {
						Ub = o, Wf.p = i, G.T = r;
					}
				}
				Fx = Ax, wl(), Tl(), El();
			}
		}
		function wl() {
			if (Fx === Ax) {
				Fx = kx;
				var e = Ix, t = Lx, n = Rx, r = (t.flags & 13878) != 0;
				if (t.subtreeFlags & 13878 || r) {
					r = G.T, G.T = null;
					var i = Wf.p;
					Wf.p = Lp;
					var a = Ub;
					Ub |= Fb;
					try {
						Sb = n, Cb = e, ci(), Tc(t, e), Cb = Sb = null, n = JS;
						var o = Nn(e.containerInfo), s = n.focusedElem, c = n.selectionRange;
						if (o !== s && s && s.ownerDocument && Mn(s.ownerDocument.documentElement, s)) {
							if (c !== null && Pn(s)) {
								var l = c.start, u = c.end;
								if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
								else {
									var d = s.ownerDocument || document, f = d && d.defaultView || window;
									if (f.getSelection) {
										var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
										!p.extend && h > g && (o = g, g = h, h = o);
										var _ = jn(s, h), v = jn(s, g);
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
						RC = !!qS, JS = qS = null;
					} finally {
						Ub = a, Wf.p = i, G.T = r;
					}
				}
				e.current = t, Fx = jx;
			}
		}
		function Tl() {
			if (Fx === jx) {
				Fx = kx;
				var e = Gx;
				if (e !== null) {
					b_ = h_();
					var t = x_, n = b_;
					!_g || n <= t || (Q_ ? Q_.run(console.timeStamp.bind(console, e, t, n, bg, yg, "secondary-light")) : console.timeStamp(e, t, n, bg, yg, "secondary-light"));
				}
				e = Ix, t = Lx, n = Rx;
				var r = (t.flags & 8772) != 0;
				if (t.subtreeFlags & 8772 || r) {
					r = G.T, G.T = null;
					var i = Wf.p;
					Wf.p = Lp;
					var a = Ub;
					Ub |= Fb;
					try {
						Sb = n, Cb = e, ci(), gc(e, t.alternate, t), Cb = Sb = null;
					} finally {
						Ub = a, Wf.p = i, G.T = r;
					}
				}
				e = Bx, t = Ux, x_ = h_(), e = t === null ? e : b_, t = x_, n = Wx === Ex, r = Cx, S_ === null ? !_g || t <= e || (r ? r.run(console.timeStamp.bind(console, n ? "Commit Interrupted View Transition" : "Commit", e, t, bg, yg, n ? "error" : "secondary-dark")) : console.timeStamp(n ? "Commit Interrupted View Transition" : "Commit", e, t, bg, yg, n ? "error" : "secondary-dark")) : tr(e, t, S_, !1, r), Fx = Mx;
			}
		}
		function El() {
			if (Fx === Nx || Fx === Mx) {
				if (Fx === Nx) {
					var e = x_;
					x_ = h_();
					var t = x_, n = Wx === Ex;
					!_g || t <= e || (Q_ ? Q_.run(console.timeStamp.bind(console, n ? "Interrupted View Transition" : "Starting Animation", e, t, bg, yg, n ? "error" : "secondary-light")) : console.timeStamp(n ? "Interrupted View Transition" : "Starting Animation", e, t, bg, yg, n ? " error" : "secondary-light")), Wx !== Ex && (Wx = Ox);
				}
				Fx = kx, _p(), e = Ix;
				var r = Lx;
				t = Rx, n = Hx;
				var i = r.actualDuration !== 0 || (r.subtreeFlags & 10256) != 0 || (r.flags & 10256) != 0;
				i ? Fx = Px : (Fx = kx, Lx = Ix = null, Ol(e, e.pendingLanes), Qx = 0, $x = null);
				var a = e.pendingLanes;
				if (a === 0 && (wx = null), i || Bl(e), a = Ve(t), r = r.stateNode, Op && typeof Op.onCommitFiberRoot == "function") try {
					var o = (r.current.flags & 128) == 128;
					switch (a) {
						case Lp:
							var s = bp;
							break;
						case Rp:
							s = xp;
							break;
						case zp:
							s = Sp;
							break;
						case Bp:
							s = wp;
							break;
						default: s = Sp;
					}
					Op.onCommitFiberRoot(Dp, r, s, o);
				} catch (e) {
					kp || (kp = !0, console.error("React instrumentation encountered an error: %o", e));
				}
				if (Ap && e.memoizedUpdaters.clear(), Jc(), n !== null) {
					o = G.T, s = Wf.p, Wf.p = Lp, G.T = null;
					try {
						var c = e.onRecoverableError;
						for (r = 0; r < n.length; r++) {
							var l = n[r], u = Dl(l.stack);
							N(l.source, c, l.value, u);
						}
					} finally {
						G.T = o, Wf.p = s;
					}
				}
				Rx & 3 && kl(), Gl(e), a = e.pendingLanes, t & 261930 && a & 42 ? (nv = !0, e === Jx ? qx++ : (qx = 0, Jx = e)) : qx = 0, i || al(t, x_), V(0, !1);
			}
		}
		function Dl(e) {
			return e = { componentStack: e }, Object.defineProperty(e, "digest", { get: function() {
				console.error("You are accessing \"digest\" from the errorInfo object passed to onRecoverableError. This property is no longer provided as part of errorInfo but can be accessed as a property of the Error instance itself.");
			} }), e;
		}
		function Ol(e, t) {
			(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, ni(t)));
		}
		function kl() {
			return wl(), Tl(), El(), Al();
		}
		function Al() {
			if (Fx !== Px) return !1;
			var e = Ix, t = zx;
			zx = 0;
			var n = Ve(Rx), r = zp === 0 || zp > n ? zp : n;
			n = G.T;
			var i = Wf.p;
			try {
				Wf.p = r, G.T = null;
				var a = Vx;
				Vx = null, r = Ix;
				var o = Rx;
				if (Fx = kx, Lx = Ix = null, Rx = 0, (Ub & (Pb | Fb)) !== Nb) throw Error("Cannot flush passive effects while already rendering.");
				Un(o), Yx = !0, Xx = !1;
				var s = 0;
				if (S_ = null, s = vp(), Wx === Ox) nr(x_, s, Q_);
				else {
					var c = x_, l = s, u = Wx === Dx;
					!_g || l <= c || (Cx ? Cx.run(console.timeStamp.bind(console, u ? "Waiting for Paint" : "Waiting", c, l, bg, yg, "secondary-light")) : console.timeStamp(u ? "Waiting for Paint" : "Waiting", c, l, bg, yg, "secondary-light"));
				}
				c = Ub, Ub |= Fb;
				var d = r.current;
				ci(), Wc(d);
				var f = r.current;
				d = Bx, ci(), Ic(r, f, o, a, d), Bl(r), Ub = c;
				var p = vp();
				if (f = s, d = Cx, S_ === null ? !_g || p <= f || (d ? d.run(console.timeStamp.bind(console, "Remaining Effects", f, p, bg, yg, "secondary-dark")) : console.timeStamp("Remaining Effects", f, p, bg, yg, "secondary-dark")) : tr(f, p, S_, !0, d), al(o, p), V(0, !1), Xx ? r === $x ? Qx++ : (Qx = 0, $x = r) : Qx = 0, Xx = Yx = !1, Op && typeof Op.onPostCommitFiberRoot == "function") try {
					Op.onPostCommitFiberRoot(Dp, r);
				} catch (e) {
					kp || (kp = !0, console.error("React instrumentation encountered an error: %o", e));
				}
				var m = r.current.stateNode;
				return m.effectDuration = 0, m.passiveEffectDuration = 0, !0;
			} finally {
				Wf.p = i, G.T = n, Ol(e, t);
			}
		}
		function jl(e, t, n) {
			t = wr(n, t), yi(t), t = ns(e.stateNode, t, 2), e = Xi(e, t, 2), e !== null && (Ne(e, 2), Gl(e));
		}
		function Ml(e, t, n) {
			if (eS = !1, e.tag === 3) jl(e, e, n);
			else {
				for (; t !== null;) {
					if (t.tag === 3) {
						jl(t, e, n);
						return;
					}
					if (t.tag === 1) {
						var r = t.stateNode;
						if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (wx === null || !wx.has(r))) {
							e = wr(n, e), yi(e), n = rs(2), r = Xi(t, n, 2), r !== null && (is(n, r, t, e), Ne(r, 2), Gl(r));
							return;
						}
					}
					t = t.return;
				}
				console.error("Internal React error: Attempted to capture a commit phase error inside a detached tree. This indicates a bug in React. Potential causes include deleting the same fiber more than once, committing an already-finished tree, or an inconsistent return pointer.\n\nError message:\n\n%s", n);
			}
		}
		function Nl(e, t, n) {
			var r = e.pingCache;
			if (r === null) {
				r = e.pingCache = new Mb();
				var i = /* @__PURE__ */ new Set();
				r.set(t, i);
			} else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
			i.has(n) || (ox = !0, i.add(n), r = Pl.bind(null, e, t, n), Ap && Hl(e, n), t.then(r, r));
		}
		function Pl(e, t, n) {
			var r = e.pingCache;
			r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, n & 127 ? 0 > k_ && (O_ = k_ = h_(), A_ = g_("Promise Resolved"), j_ = v_) : n & 4194048 && 0 > B_ && (R_ = B_ = h_(), H_ = g_("Promise Resolved"), V_ = v_), Yc() && G.actQueue === null && console.error("A suspended resource finished loading inside a test, but the event was not wrapped in act(...).\n\nWhen testing, code that resolves suspended data should be wrapped into act(...):\n\nact(() => {\n  /* finish loading suspended data */\n});\n/* assert on the output */\n\nThis ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act"), Wb === e && ($ & n) === n && (cx === Bb || cx === zb && ($ & 62914560) === $ && vp() - _x < yx ? (Ub & Pb) === Nb && ol(e, 0) : dx |= n, px === $ && (px = 0)), Gl(e);
		}
		function Fl(e, t) {
			t === 0 && (t = je()), e = or(e, t), e !== null && (Ne(e, t), Gl(e));
		}
		function Il(e) {
			var t = e.memoizedState, n = 0;
			t !== null && (n = t.retryLane), Fl(e, n);
		}
		function Ll(e, t) {
			var n = 0;
			switch (e.tag) {
				case 31:
				case 13:
					var r = e.stateNode, i = e.memoizedState;
					i !== null && (n = i.retryLane);
					break;
				case 19:
					r = e.stateNode;
					break;
				case 22:
					r = e.stateNode._retryCache;
					break;
				default: throw Error("Pinged unknown suspense boundary type. This is probably a bug in React.");
			}
			r !== null && r.delete(t), Fl(e, n);
		}
		function Rl(e, t, n) {
			if (t.subtreeFlags & 67117056) for (t = t.child; t !== null;) {
				var r = e, i = t, a = i.type === Af;
				a = n || a, i.tag === 22 ? i.memoizedState === null && (a && i.flags & 8192 ? N(i, zl, r, i) : i.subtreeFlags & 67108864 && N(i, Rl, r, i, a)) : i.flags & 67108864 ? a && N(i, zl, r, i) : Rl(r, i, a), t = t.sibling;
			}
		}
		function zl(e, t) {
			Te(!0);
			try {
				kc(t), Kc(t), jc(e, t.alternate, t, !1), Rc(e, t, 0, null, !1, 0);
			} finally {
				Te(!1);
			}
		}
		function Bl(e) {
			var t = !0;
			e.current.mode & (Ig | Lg) || (t = !1), Rl(e, e.current, t);
		}
		function Vl(e) {
			if ((Ub & Pb) === Nb) {
				var t = e.tag;
				if (t === 3 || t === 1 || t === 0 || t === 11 || t === 14 || t === 15) {
					if (t = T(e) || "ReactComponent", tS !== null) {
						if (tS.has(t)) return;
						tS.add(t);
					} else tS = new Set([t]);
					N(e, function() {
						console.error("Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously tries to update the component. Move this work to useEffect instead.");
					});
				}
			}
		}
		function Hl(e, t) {
			Ap && e.memoizedUpdaters.forEach(function(n) {
				ze(e, n, t);
			});
		}
		function Ul(e, t) {
			var n = G.actQueue;
			return n === null ? mp(e, t) : (n.push(t), iS);
		}
		function Wl(e) {
			Yc() && G.actQueue === null && N(e, function() {
				console.error("An update to %s inside a test was not wrapped in act(...).\n\nWhen testing, code that causes React state updates should be wrapped into act(...):\n\nact(() => {\n  /* fire events that update state */\n});\n/* assert on the output */\n\nThis ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act", T(e));
			});
		}
		function Gl(e) {
			e !== oS && e.next === null && (oS === null ? aS = oS = e : oS = oS.next = e), lS = !0, G.actQueue === null ? sS || (sS = !0, Ql()) : cS || (cS = !0, Ql());
		}
		function V(e, t) {
			if (!uS && lS) {
				uS = !0;
				do
					for (var n = !1, r = aS; r !== null;) {
						if (!t) if (e !== 0) {
							var i = r.pendingLanes;
							if (i === 0) var a = 0;
							else {
								var o = r.suspendedLanes, s = r.pingedLanes;
								a = (1 << 31 - jp(42 | e) + 1) - 1, a &= i & ~(o & ~s), a = a & 201326741 ? a & 201326741 | 1 : a ? a | 2 : 0;
							}
							a !== 0 && (n = !0, Xl(r, a));
						} else a = $, a = Oe(r, r === Wb ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== eC), !(a & 3) || ke(r, a) || (n = !0, Xl(r, a));
						r = r.next;
					}
				while (n);
				uS = !1;
			}
		}
		function Kl() {
			ZS = window.event, ql();
		}
		function ql() {
			lS = cS = sS = !1;
			var e = 0;
			dS !== 0 && Bu() && (e = dS);
			for (var t = vp(), n = null, r = aS; r !== null;) {
				var i = r.next, a = Jl(r, t);
				a === 0 ? (r.next = null, n === null ? aS = i : n.next = i, i === null && (oS = n)) : (n = r, (e !== 0 || a & 3) && (lS = !0)), r = i;
			}
			Fx !== kx && Fx !== Px || V(e, !1), dS !== 0 && (dS = 0);
		}
		function Jl(e, t) {
			for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
				var o = 31 - jp(a), s = 1 << o, c = i[o];
				c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = Ae(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
			}
			if (t = Wb, n = $, n = Oe(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== eC), r = e.callbackNode, n === 0 || e === t && (nx === Jb || nx === tx) || e.cancelPendingCommit !== null) return r !== null && Zl(r), e.callbackNode = null, e.callbackPriority = 0;
			if (!(n & 3) || ke(e, n)) {
				if (t = n & -n, t !== e.callbackPriority || G.actQueue !== null && r !== fS) Zl(r);
				else return t;
				switch (Ve(n)) {
					case Lp:
					case Rp:
						n = xp;
						break;
					case zp:
						n = Sp;
						break;
					case Bp:
						n = wp;
						break;
					default: n = Sp;
				}
				return r = Yl.bind(null, e), G.actQueue === null ? n = mp(n, r) : (G.actQueue.push(r), n = fS), e.callbackPriority = t, e.callbackNode = n, t;
			}
			return r !== null && Zl(r), e.callbackPriority = 2, e.callbackNode = null, 2;
		}
		function Yl(e, t) {
			if (nv = tv = !1, ZS = window.event, Fx !== kx && Fx !== Px) return e.callbackNode = null, e.callbackPriority = 0, null;
			var n = e.callbackNode;
			if (Wx === Tx && (Wx = Dx), kl() && e.callbackNode !== n) return null;
			var r = $;
			return r = Oe(e, e === Wb ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== eC), r === 0 ? null : ($c(e, r, t), Jl(e, vp()), e.callbackNode != null && e.callbackNode === n ? Yl.bind(null, e) : null);
		}
		function Xl(e, t) {
			if (kl()) return null;
			tv = nv, nv = !1, $c(e, t, !0);
		}
		function Zl(e) {
			e !== fS && e !== null && hp(e);
		}
		function Ql() {
			G.actQueue !== null && G.actQueue.push(function() {
				return ql(), null;
			}), nC(function() {
				(Ub & (Pb | Fb)) === Nb ? ql() : mp(bp, Kl);
			});
		}
		function $l() {
			if (dS === 0) {
				var e = av;
				e === 0 && (e = Pp, Pp <<= 1, !(Pp & 261888) && (Pp = 256)), dS = e;
			}
			return dS;
		}
		function eu(e) {
			return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : (P(e, "action"), $t("" + e));
		}
		function tu(e, t) {
			var n = t.ownerDocument.createElement("input");
			return n.name = t.name, n.value = t.value, e.id && n.setAttribute("form", e.id), t.parentNode.insertBefore(n, t), e = new FormData(e), n.parentNode.removeChild(n), e;
		}
		function nu(e, t, n, r, i) {
			if (t === "submit" && n && n.stateNode === i) {
				var a = eu((i[Up] || null).action), o = r.submitter;
				o && (t = (t = o[Up] || null) ? eu(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
				var s = new rh("action", "action", null, r, i);
				e.push({
					event: s,
					listeners: [{
						instance: null,
						listener: function() {
							if (r.defaultPrevented) {
								if (dS !== 0) {
									var e = o ? tu(i, o) : new FormData(i), t = {
										pending: !0,
										data: e,
										method: i.method,
										action: a
									};
									Object.freeze(t), ko(n, t, null, e);
								}
							} else typeof a == "function" && (s.preventDefault(), e = o ? tu(i, o) : new FormData(i), t = {
								pending: !0,
								data: e,
								method: i.method,
								action: a
							}, Object.freeze(t), ko(n, t, a, e));
						},
						currentTarget: i
					}]
				});
			}
		}
		function ru(e, t, n) {
			e.currentTarget = n;
			try {
				t(e);
			} catch (e) {
				cg(e);
			}
			e.currentTarget = null;
		}
		function iu(e, t) {
			t = (t & 4) != 0;
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				a: {
					var i = void 0, a = r.event;
					if (r = r.listeners, t) for (var o = r.length - 1; 0 <= o; o--) {
						var s = r[o], c = s.instance, l = s.currentTarget;
						if (s = s.listener, c !== i && a.isPropagationStopped()) break a;
						c === null ? ru(a, s, l) : N(c, ru, a, s, l), i = c;
					}
					else for (o = 0; o < r.length; o++) {
						if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== i && a.isPropagationStopped()) break a;
						c === null ? ru(a, s, l) : N(c, ru, a, s, l), i = c;
					}
				}
			}
		}
		function H(e, t) {
			mS.has(e) || console.error("Did not expect a listenToNonDelegatedEvent() call for \"%s\". This is a bug in React. Please file an issue.", e);
			var n = t[Gp];
			n === void 0 && (n = t[Gp] = /* @__PURE__ */ new Set());
			var r = e + "__bubble";
			n.has(r) || (su(t, e, 2, !1), n.add(r));
		}
		function au(e, t, n) {
			mS.has(e) && !t && console.error("Did not expect a listenToNativeEvent() call for \"%s\" in the bubble phase. This is a bug in React. Please file an issue.", e);
			var r = 0;
			t && (r |= 4), su(n, e, r, t);
		}
		function ou(e) {
			if (!e[hS]) {
				e[hS] = !0, Xp.forEach(function(t) {
					t !== "selectionchange" && (mS.has(t) || au(t, !1, e), au(t, !0, e));
				});
				var t = e.nodeType === 9 ? e : e.ownerDocument;
				t === null || t[hS] || (t[hS] = !0, au("selectionchange", !1, t));
			}
		}
		function su(e, t, n, r) {
			switch (cf(t)) {
				case Lp:
					var i = nf;
					break;
				case Rp:
					i = rf;
					break;
				default: i = af;
			}
			n = i.bind(null, t, n, e), i = void 0, !Zm || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
				capture: !0,
				passive: i
			}) : i === void 0 ? e.addEventListener(t, n, !1) : e.addEventListener(t, n, { passive: i });
		}
		function cu(e, t, n, r, i) {
			var a = r;
			if (!(t & 1) && !(t & 2) && r !== null) a: for (;;) {
				if (r === null) return;
				var o = r.tag;
				if (o === 3 || o === 4) {
					var s = r.stateNode.containerInfo;
					if (s === i) break;
					if (o === 4) for (o = r.return; o !== null;) {
						var c = o.tag;
						if ((c === 3 || c === 4) && o.stateNode.containerInfo === i) return;
						o = o.return;
					}
					for (; s !== null;) {
						if (o = Ge(s), o === null) return;
						if (c = o.tag, c === 5 || c === 6 || c === 26 || c === 27) {
							r = a = o;
							continue a;
						}
						s = s.parentNode;
					}
				}
				r = r.return;
			}
			rn(function() {
				var r = a, i = tn(n), o = [];
				a: {
					var s = ng.get(e);
					if (s !== void 0) {
						var c = rh, l = e;
						switch (e) {
							case "keypress": if (L(n) === 0) break a;
							case "keydown":
							case "keyup":
								c = bh;
								break;
							case "focusin":
								l = "focus", c = fh;
								break;
							case "focusout":
								l = "blur", c = fh;
								break;
							case "beforeblur":
							case "afterblur":
								c = fh;
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
								c = uh;
								break;
							case "drag":
							case "dragend":
							case "dragenter":
							case "dragexit":
							case "dragleave":
							case "dragover":
							case "dragstart":
							case "drop":
								c = dh;
								break;
							case "touchcancel":
							case "touchend":
							case "touchmove":
							case "touchstart":
								c = Sh;
								break;
							case Yh:
							case Xh:
							case Zh:
								c = ph;
								break;
							case tg:
								c = Ch;
								break;
							case "scroll":
							case "scrollend":
								c = ah;
								break;
							case "wheel":
								c = wh;
								break;
							case "copy":
							case "cut":
							case "paste":
								c = mh;
								break;
							case "gotpointercapture":
							case "lostpointercapture":
							case "pointercancel":
							case "pointerdown":
							case "pointermove":
							case "pointerout":
							case "pointerover":
							case "pointerup":
								c = xh;
								break;
							case "toggle":
							case "beforetoggle": c = Th;
						}
						var u = (t & 4) != 0, d = !u && (e === "scroll" || e === "scrollend"), f = u ? s === null ? null : s + "Capture" : s;
						u = [];
						for (var p = r, m; p !== null;) {
							var h = p;
							if (m = h.stateNode, h = h.tag, h !== 5 && h !== 26 && h !== 27 || m === null || f === null || (h = an(p, f), h != null && u.push(lu(p, h, m))), d) break;
							p = p.return;
						}
						0 < u.length && (s = new c(s, l, null, n, i), o.push({
							event: s,
							listeners: u
						}));
					}
				}
				if (!(t & 7)) {
					a: {
						if (s = e === "mouseover" || e === "pointerover", c = e === "mouseout" || e === "pointerout", s && n !== Km && (l = n.relatedTarget || n.fromElement) && (Ge(l) || l[Wp])) break a;
						if ((c || s) && (s = i.window === i ? i : (s = i.ownerDocument) ? s.defaultView || s.parentWindow : window, c ? (l = n.relatedTarget || n.toElement, c = r, l = l ? Ge(l) : null, l !== null && (d = x(l), u = l.tag, l !== d || u !== 5 && u !== 27 && u !== 6) && (l = null)) : (c = null, l = r), c !== l)) {
							if (u = uh, h = "onMouseLeave", f = "onMouseEnter", p = "mouse", (e === "pointerout" || e === "pointerover") && (u = xh, h = "onPointerLeave", f = "onPointerEnter", p = "pointer"), d = c == null ? s : qe(c), m = l == null ? s : qe(l), s = new u(h, p + "leave", c, n, i), s.target = d, s.relatedTarget = m, h = null, Ge(i) === r && (u = new u(f, p + "enter", l, n, i), u.target = m, u.relatedTarget = d, h = u), d = h, c && l) b: {
								for (u = du, f = c, p = l, m = 0, h = f; h; h = u(h)) m++;
								h = 0;
								for (var g = p; g; g = u(g)) h++;
								for (; 0 < m - h;) f = u(f), m--;
								for (; 0 < h - m;) p = u(p), h--;
								for (; m--;) {
									if (f === p || p !== null && f === p.alternate) {
										u = f;
										break b;
									}
									f = u(f), p = u(p);
								}
								u = null;
							}
							else u = null;
							c !== null && fu(o, s, c, u, !1), l !== null && d !== null && fu(o, d, l, u, !0);
						}
					}
					a: {
						if (s = r ? qe(r) : window, c = s.nodeName && s.nodeName.toLowerCase(), c === "select" || c === "input" && s.type === "file") var _ = xn;
						else if (gn(s)) if (zh) _ = Dn;
						else {
							_ = Tn;
							var v = wn;
						}
						else c = s.nodeName, !c || c.toLowerCase() !== "input" || s.type !== "checkbox" && s.type !== "radio" ? r && Jt(r.elementType) && (_ = xn) : _ = En;
						if (_ &&= _(e, r)) {
							vn(o, _, n, i);
							break a;
						}
						v && v(e, s, r), e === "focusout" && r && s.type === "number" && r.memoizedProps.value != null && mt(s, "number", s.value);
					}
					switch (v = r ? qe(r) : window, e) {
						case "focusin":
							(gn(v) || v.contentEditable === "true") && (Hh = v, Uh = r, Wh = null);
							break;
						case "focusout":
							Wh = Uh = Hh = null;
							break;
						case "mousedown":
							Gh = !0;
							break;
						case "contextmenu":
						case "mouseup":
						case "dragend":
							Gh = !1, Fn(o, n, i);
							break;
						case "selectionchange": if (Vh) break;
						case "keydown":
						case "keyup": Fn(o, n, i);
					}
					var y;
					if (Oh) b: {
						switch (e) {
							case "compositionstart":
								var b = "onCompositionStart";
								break b;
							case "compositionend":
								b = "onCompositionEnd";
								break b;
							case "compositionupdate":
								b = "onCompositionUpdate";
								break b;
						}
						b = void 0;
					}
					else Fh ? fn(e, n) && (b = "onCompositionEnd") : e === "keydown" && n.keyCode === Dh && (b = "onCompositionStart");
					b && (jh && n.locale !== "ko" && (Fh || b !== "onCompositionStart" ? b === "onCompositionEnd" && Fh && (y = on()) : ($m = i, eh = "value" in $m ? $m.value : $m.textContent, Fh = !0)), v = uu(r, b), 0 < v.length && (b = new hh(b, e, null, n, i), o.push({
						event: b,
						listeners: v
					}), y ? b.data = y : (y = pn(n), y !== null && (b.data = y)))), (y = Ah ? mn(e, n) : hn(e, n)) && (b = uu(r, "onBeforeInput"), 0 < b.length && (v = new gh("onBeforeInput", "beforeinput", null, n, i), o.push({
						event: v,
						listeners: b
					}), v.data = y)), nu(o, e, r, n, i);
				}
				iu(o, t);
			});
		}
		function lu(e, t, n) {
			return {
				instance: e,
				listener: t,
				currentTarget: n
			};
		}
		function uu(e, t) {
			for (var n = t + "Capture", r = []; e !== null;) {
				var i = e, a = i.stateNode;
				if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = an(e, n), i != null && r.unshift(lu(e, i, a)), i = an(e, t), i != null && r.push(lu(e, i, a))), e.tag === 3) return r;
				e = e.return;
			}
			return [];
		}
		function du(e) {
			if (e === null) return null;
			do
				e = e.return;
			while (e && e.tag !== 5 && e.tag !== 27);
			return e || null;
		}
		function fu(e, t, n, r, i) {
			for (var a = t._reactName, o = []; n !== null && n !== r;) {
				var s = n, c = s.alternate, l = s.stateNode;
				if (s = s.tag, c !== null && c === r) break;
				s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = an(n, a), l != null && o.unshift(lu(n, l, c))) : i || (l = an(n, a), l != null && o.push(lu(n, l, c)))), n = n.return;
			}
			o.length !== 0 && e.push({
				event: t,
				listeners: o
			});
		}
		function pu(e, t) {
			Zt(e, t), e !== "input" && e !== "textarea" && e !== "select" || t == null || t.value !== null || zm || (zm = !0, e === "select" && t.multiple ? console.error("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", e) : console.error("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", e));
			var n = {
				registrationNameDependencies: Zp,
				possibleRegistrationNames: Qp
			};
			Jt(e) || typeof t.is == "string" || I(e, t, n), t.contentEditable && !t.suppressContentEditableWarning && t.children != null && console.error("A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional.");
		}
		function mu(e, t, n, r) {
			t !== n && (n = vu(n), vu(t) !== n && (r[e] = t));
		}
		function hu(e, t, n) {
			t.forEach(function(t) {
				n[wu(t)] = t === "style" ? Tu(e) : e.getAttribute(t);
			});
		}
		function gu(e, t) {
			!1 === t ? console.error("Expected `%s` listener to be a function, instead got `false`.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.", e, e, e) : console.error("Expected `%s` listener to be a function, instead got a value of `%s` type.", e, typeof t);
		}
		function _u(e, t) {
			return e = e.namespaceURI === jm || e.namespaceURI === Mm ? e.ownerDocument.createElementNS(e.namespaceURI, e.tagName) : e.ownerDocument.createElement(e.tagName), e.innerHTML = t, e.innerHTML;
		}
		function vu(e) {
			return be(e) && (console.error("The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before using it here.", ye(e)), xe(e)), (typeof e == "string" ? e : "" + e).replace(wS, "\n").replace(TS, "");
		}
		function yu(e, t) {
			return t = vu(t), vu(e) === t;
		}
		function bu(e, t, n, r, i, a) {
			switch (n) {
				case "children":
					typeof r == "string" ? (Ut(r, t, !1), t === "body" || t === "textarea" && r === "" || Wt(e, r)) : (typeof r == "number" || typeof r == "bigint") && (Ut("" + r, t, !1), t !== "body" && Wt(e, "" + r));
					break;
				case "className":
					nt(e, "class", r);
					break;
				case "tabIndex":
					nt(e, "tabindex", r);
					break;
				case "dir":
				case "role":
				case "viewBox":
				case "width":
				case "height":
					nt(e, n, r);
					break;
				case "style":
					qt(e, r, a);
					break;
				case "data": if (t !== "object") {
					nt(e, "data", r);
					break;
				}
				case "src":
				case "href":
					if (r === "" && (t !== "a" || n !== "href")) {
						console.error(n === "src" ? "An empty string (\"\") was passed to the %s attribute. This may cause the browser to download the whole page again over the network. To fix this, either do not render the element at all or pass null to %s instead of an empty string." : "An empty string (\"\") was passed to the %s attribute. To fix this, either do not render the element at all or pass null to %s instead of an empty string.", n, n), e.removeAttribute(n);
						break;
					}
					if (r == null || typeof r == "function" || typeof r == "symbol" || typeof r == "boolean") {
						e.removeAttribute(n);
						break;
					}
					P(r, n), r = $t("" + r), e.setAttribute(n, r);
					break;
				case "action":
				case "formAction":
					if (r != null && (t === "form" ? n === "formAction" ? console.error("You can only pass the formAction prop to <input> or <button>. Use the action prop on <form>.") : typeof r == "function" && (i.encType == null && i.method == null || xS || (xS = !0, console.error("Cannot specify a encType or method for a form that specifies a function as the action. React provides those automatically. They will get overridden.")), i.target == null || bS || (bS = !0, console.error("Cannot specify a target for a form that specifies a function as the action. The function will always be executed in the same window."))) : t === "input" || t === "button" ? n === "action" ? console.error("You can only pass the action prop to <form>. Use the formAction prop on <input> or <button>.") : t !== "input" || i.type === "submit" || i.type === "image" || vS ? t !== "button" || i.type == null || i.type === "submit" || vS ? typeof r == "function" && (i.name == null || yS || (yS = !0, console.error("Cannot specify a \"name\" prop for a button that specifies a function as a formAction. React needs it to encode which action should be invoked. It will get overridden.")), i.formEncType == null && i.formMethod == null || xS || (xS = !0, console.error("Cannot specify a formEncType or formMethod for a button that specifies a function as a formAction. React provides those automatically. They will get overridden.")), i.formTarget == null || bS || (bS = !0, console.error("Cannot specify a formTarget for a button that specifies a function as a formAction. The function will always be executed in the same window."))) : (vS = !0, console.error("A button can only specify a formAction along with type=\"submit\" or no type.")) : (vS = !0, console.error("An input can only specify a formAction along with type=\"submit\" or type=\"image\".")) : console.error(n === "action" ? "You can only pass the action prop to <form>." : "You can only pass the formAction prop to <input> or <button>.")), typeof r == "function") {
						e.setAttribute(n, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
						break;
					} else typeof a == "function" && (n === "formAction" ? (t !== "input" && bu(e, t, "name", i.name, i, null), bu(e, t, "formEncType", i.formEncType, i, null), bu(e, t, "formMethod", i.formMethod, i, null), bu(e, t, "formTarget", i.formTarget, i, null)) : (bu(e, t, "encType", i.encType, i, null), bu(e, t, "method", i.method, i, null), bu(e, t, "target", i.target, i, null)));
					if (r == null || typeof r == "symbol" || typeof r == "boolean") {
						e.removeAttribute(n);
						break;
					}
					P(r, n), r = $t("" + r), e.setAttribute(n, r);
					break;
				case "onClick":
					r != null && (typeof r != "function" && gu(n, r), e.onclick = en);
					break;
				case "onScroll":
					r != null && (typeof r != "function" && gu(n, r), H("scroll", e));
					break;
				case "onScrollEnd":
					r != null && (typeof r != "function" && gu(n, r), H("scrollend", e));
					break;
				case "dangerouslySetInnerHTML":
					if (r != null) {
						if (typeof r != "object" || !("__html" in r)) throw Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://react.dev/link/dangerously-set-inner-html for more information.");
						if (n = r.__html, n != null) {
							if (i.children != null) throw Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
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
					P(r, n), n = $t("" + r), e.setAttributeNS(ES, "xlink:href", n);
					break;
				case "contentEditable":
				case "spellCheck":
				case "draggable":
				case "value":
				case "autoReverse":
				case "externalResourcesRequired":
				case "focusable":
				case "preserveAlpha":
					r != null && typeof r != "function" && typeof r != "symbol" ? (P(r, n), e.setAttribute(n, "" + r)) : e.removeAttribute(n);
					break;
				case "inert": r !== "" || CS[n] || (CS[n] = !0, console.error("Received an empty string for a boolean attribute `%s`. This will treat the attribute as if it were false. Either pass `false` to silence this warning, or pass `true` if you used an empty string in earlier versions of React to indicate this attribute is true.", n));
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
					!0 === r ? e.setAttribute(n, "") : !1 !== r && r != null && typeof r != "function" && typeof r != "symbol" ? (P(r, n), e.setAttribute(n, r)) : e.removeAttribute(n);
					break;
				case "cols":
				case "rows":
				case "size":
				case "span":
					r != null && typeof r != "function" && typeof r != "symbol" && !isNaN(r) && 1 <= r ? (P(r, n), e.setAttribute(n, r)) : e.removeAttribute(n);
					break;
				case "rowSpan":
				case "start":
					r == null || typeof r == "function" || typeof r == "symbol" || isNaN(r) ? e.removeAttribute(n) : (P(r, n), e.setAttribute(n, r));
					break;
				case "popover":
					H("beforetoggle", e), H("toggle", e), tt(e, "popover", r);
					break;
				case "xlinkActuate":
					rt(e, ES, "xlink:actuate", r);
					break;
				case "xlinkArcrole":
					rt(e, ES, "xlink:arcrole", r);
					break;
				case "xlinkRole":
					rt(e, ES, "xlink:role", r);
					break;
				case "xlinkShow":
					rt(e, ES, "xlink:show", r);
					break;
				case "xlinkTitle":
					rt(e, ES, "xlink:title", r);
					break;
				case "xlinkType":
					rt(e, ES, "xlink:type", r);
					break;
				case "xmlBase":
					rt(e, DS, "xml:base", r);
					break;
				case "xmlLang":
					rt(e, DS, "xml:lang", r);
					break;
				case "xmlSpace":
					rt(e, DS, "xml:space", r);
					break;
				case "is":
					a != null && console.error("Cannot update the \"is\" prop after it has been initialized."), tt(e, "is", r);
					break;
				case "innerText":
				case "textContent": break;
				case "popoverTarget": SS || typeof r != "object" || !r || (SS = !0, console.error("The `popoverTarget` prop expects the ID of an Element as a string. Received %s instead.", r));
				default: !(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N" ? (n = Yt(n), tt(e, n, r)) : Zp.hasOwnProperty(n) && r != null && typeof r != "function" && gu(n, r);
			}
		}
		function xu(e, t, n, r, i, a) {
			switch (n) {
				case "style":
					qt(e, r, a);
					break;
				case "dangerouslySetInnerHTML":
					if (r != null) {
						if (typeof r != "object" || !("__html" in r)) throw Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://react.dev/link/dangerously-set-inner-html for more information.");
						if (n = r.__html, n != null) {
							if (i.children != null) throw Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
							e.innerHTML = n;
						}
					}
					break;
				case "children":
					typeof r == "string" ? Wt(e, r) : (typeof r == "number" || typeof r == "bigint") && Wt(e, "" + r);
					break;
				case "onScroll":
					r != null && (typeof r != "function" && gu(n, r), H("scroll", e));
					break;
				case "onScrollEnd":
					r != null && (typeof r != "function" && gu(n, r), H("scrollend", e));
					break;
				case "onClick":
					r != null && (typeof r != "function" && gu(n, r), e.onclick = en);
					break;
				case "suppressContentEditableWarning":
				case "suppressHydrationWarning":
				case "innerHTML":
				case "ref": break;
				case "innerText":
				case "textContent": break;
				default: if (Zp.hasOwnProperty(n)) r != null && typeof r != "function" && gu(n, r);
				else a: {
					if (n[0] === "o" && n[1] === "n" && (i = n.endsWith("Capture"), t = n.slice(2, i ? n.length - 7 : void 0), a = e[Up] || null, a = a == null ? null : a[n], typeof a == "function" && e.removeEventListener(t, a, i), typeof r == "function")) {
						typeof a != "function" && a !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(t, r, i);
						break a;
					}
					n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : tt(e, n, r);
				}
			}
		}
		function Su(e, t, n) {
			switch (pu(t, n), t) {
				case "div":
				case "span":
				case "svg":
				case "path":
				case "a":
				case "g":
				case "p":
				case "li": break;
				case "img":
					H("error", e), H("load", e);
					var r = !1, i = !1, a;
					for (a in n) if (n.hasOwnProperty(a)) {
						var o = n[a];
						if (o != null) switch (a) {
							case "src":
								r = !0;
								break;
							case "srcSet":
								i = !0;
								break;
							case "children":
							case "dangerouslySetInnerHTML": throw Error(t + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
							default: bu(e, t, a, o, n, null);
						}
					}
					i && bu(e, t, "srcSet", n.srcSet, n, null), r && bu(e, t, "src", n.src, n, null);
					return;
				case "input":
					Qe("input", n), H("invalid", e);
					var s = a = o = i = null, c = null, l = null;
					for (r in n) if (n.hasOwnProperty(r)) {
						var u = n[r];
						if (u != null) switch (r) {
							case "name":
								i = u;
								break;
							case "type":
								o = u;
								break;
							case "checked":
								c = u;
								break;
							case "defaultChecked":
								l = u;
								break;
							case "value":
								a = u;
								break;
							case "defaultValue":
								s = u;
								break;
							case "children":
							case "dangerouslySetInnerHTML":
								if (u != null) throw Error(t + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
								break;
							default: bu(e, t, r, u, n, null);
						}
					}
					dt(e, n), pt(e, a, s, c, l, o, i, !1);
					return;
				case "select":
					for (i in Qe("select", n), H("invalid", e), r = o = a = null, n) if (n.hasOwnProperty(i) && (s = n[i], s != null)) switch (i) {
						case "value":
							a = s;
							break;
						case "defaultValue":
							o = s;
							break;
						case "multiple": r = s;
						default: bu(e, t, i, s, n, null);
					}
					vt(e, n), t = a, n = o, e.multiple = !!r, t == null ? n != null && _t(e, !!r, n, !0) : _t(e, !!r, t, !1);
					return;
				case "textarea":
					for (o in Qe("textarea", n), H("invalid", e), a = i = r = null, n) if (n.hasOwnProperty(o) && (s = n[o], s != null)) switch (o) {
						case "value":
							r = s;
							break;
						case "defaultValue":
							i = s;
							break;
						case "children":
							a = s;
							break;
						case "dangerouslySetInnerHTML":
							if (s != null) throw Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
							break;
						default: bu(e, t, o, s, n, null);
					}
					yt(e, n), xt(e, r, i, a);
					return;
				case "option":
					for (c in ht(e, n), n) if (n.hasOwnProperty(c) && (r = n[c], r != null)) switch (c) {
						case "selected":
							e.selected = r && typeof r != "function" && typeof r != "symbol";
							break;
						default: bu(e, t, c, r, n, null);
					}
					return;
				case "dialog":
					H("beforetoggle", e), H("toggle", e), H("cancel", e), H("close", e);
					break;
				case "iframe":
				case "object":
					H("load", e);
					break;
				case "video":
				case "audio":
					for (r = 0; r < pS.length; r++) H(pS[r], e);
					break;
				case "image":
					H("error", e), H("load", e);
					break;
				case "details":
					H("toggle", e);
					break;
				case "embed":
				case "source":
				case "link": H("error", e), H("load", e);
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
					for (l in n) if (n.hasOwnProperty(l) && (r = n[l], r != null)) switch (l) {
						case "children":
						case "dangerouslySetInnerHTML": throw Error(t + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
						default: bu(e, t, l, r, n, null);
					}
					return;
				default: if (Jt(t)) {
					for (u in n) n.hasOwnProperty(u) && (r = n[u], r !== void 0 && xu(e, t, u, r, n, void 0));
					return;
				}
			}
			for (s in n) n.hasOwnProperty(s) && (r = n[s], r != null && bu(e, t, s, r, n, null));
		}
		function Cu(e, t, n, r) {
			switch (pu(t, r), t) {
				case "div":
				case "span":
				case "svg":
				case "path":
				case "a":
				case "g":
				case "p":
				case "li": break;
				case "input":
					var i = null, a = null, o = null, s = null, c = null, l = null, u = null;
					for (p in n) {
						var d = n[p];
						if (n.hasOwnProperty(p) && d != null) switch (p) {
							case "checked": break;
							case "value": break;
							case "defaultValue": c = d;
							default: r.hasOwnProperty(p) || bu(e, t, p, null, r, d);
						}
					}
					for (var f in r) {
						var p = r[f];
						if (d = n[f], r.hasOwnProperty(f) && (p != null || d != null)) switch (f) {
							case "type":
								a = p;
								break;
							case "name":
								i = p;
								break;
							case "checked":
								l = p;
								break;
							case "defaultChecked":
								u = p;
								break;
							case "value":
								o = p;
								break;
							case "defaultValue":
								s = p;
								break;
							case "children":
							case "dangerouslySetInnerHTML":
								if (p != null) throw Error(t + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
								break;
							default: p !== d && bu(e, t, f, p, r, d);
						}
					}
					t = n.type === "checkbox" || n.type === "radio" ? n.checked != null : n.value != null, r = r.type === "checkbox" || r.type === "radio" ? r.checked != null : r.value != null, t || !r || _S || (console.error("A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://react.dev/link/controlled-components"), _S = !0), !t || r || gS || (console.error("A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://react.dev/link/controlled-components"), gS = !0), ft(e, o, s, c, l, u, a, i);
					return;
				case "select":
					for (a in p = o = s = f = null, n) if (c = n[a], n.hasOwnProperty(a) && c != null) switch (a) {
						case "value": break;
						case "multiple": p = c;
						default: r.hasOwnProperty(a) || bu(e, t, a, null, r, c);
					}
					for (i in r) if (a = r[i], c = n[i], r.hasOwnProperty(i) && (a != null || c != null)) switch (i) {
						case "value":
							f = a;
							break;
						case "defaultValue":
							s = a;
							break;
						case "multiple": o = a;
						default: a !== c && bu(e, t, i, a, r, c);
					}
					r = s, t = o, n = p, f == null ? !!n != !!t && (r == null ? _t(e, !!t, t ? [] : "", !1) : _t(e, !!t, r, !0)) : _t(e, !!t, f, !1);
					return;
				case "textarea":
					for (s in p = f = null, n) if (i = n[s], n.hasOwnProperty(s) && i != null && !r.hasOwnProperty(s)) switch (s) {
						case "value": break;
						case "children": break;
						default: bu(e, t, s, null, r, i);
					}
					for (o in r) if (i = r[o], a = n[o], r.hasOwnProperty(o) && (i != null || a != null)) switch (o) {
						case "value":
							f = i;
							break;
						case "defaultValue":
							p = i;
							break;
						case "children": break;
						case "dangerouslySetInnerHTML":
							if (i != null) throw Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
							break;
						default: i !== a && bu(e, t, o, i, r, a);
					}
					bt(e, f, p);
					return;
				case "option":
					for (var m in n) if (f = n[m], n.hasOwnProperty(m) && f != null && !r.hasOwnProperty(m)) switch (m) {
						case "selected":
							e.selected = !1;
							break;
						default: bu(e, t, m, null, r, f);
					}
					for (c in r) if (f = r[c], p = n[c], r.hasOwnProperty(c) && f !== p && (f != null || p != null)) switch (c) {
						case "selected":
							e.selected = f && typeof f != "function" && typeof f != "symbol";
							break;
						default: bu(e, t, c, f, r, p);
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
					for (var h in n) f = n[h], n.hasOwnProperty(h) && f != null && !r.hasOwnProperty(h) && bu(e, t, h, null, r, f);
					for (l in r) if (f = r[l], p = n[l], r.hasOwnProperty(l) && f !== p && (f != null || p != null)) switch (l) {
						case "children":
						case "dangerouslySetInnerHTML":
							if (f != null) throw Error(t + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
							break;
						default: bu(e, t, l, f, r, p);
					}
					return;
				default: if (Jt(t)) {
					for (var g in n) f = n[g], n.hasOwnProperty(g) && f !== void 0 && !r.hasOwnProperty(g) && xu(e, t, g, void 0, r, f);
					for (u in r) f = r[u], p = n[u], !r.hasOwnProperty(u) || f === p || f === void 0 && p === void 0 || xu(e, t, u, f, r, p);
					return;
				}
			}
			for (var _ in n) f = n[_], n.hasOwnProperty(_) && f != null && !r.hasOwnProperty(_) && bu(e, t, _, null, r, f);
			for (d in r) f = r[d], p = n[d], !r.hasOwnProperty(d) || f === p || f == null && p == null || bu(e, t, d, f, r, p);
		}
		function wu(e) {
			switch (e) {
				case "class": return "className";
				case "for": return "htmlFor";
				default: return e;
			}
		}
		function Tu(e) {
			var t = {};
			e = e.style;
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				t[r] = e.getPropertyValue(r);
			}
			return t;
		}
		function Eu(e, t, n) {
			if (t != null && typeof t != "object") console.error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
			else {
				var r, i = r = "", a;
				for (a in t) if (t.hasOwnProperty(a)) {
					var o = t[a];
					o != null && typeof o != "boolean" && o !== "" && (a.indexOf("--") === 0 ? (Se(o, a), r += i + a + ":" + ("" + o).trim()) : typeof o != "number" || o === 0 || Am.has(a) ? (Se(o, a), r += i + a.replace(bm, "-$1").toLowerCase().replace(xm, "-ms-") + ":" + ("" + o).trim()) : r += i + a.replace(bm, "-$1").toLowerCase().replace(xm, "-ms-") + ":" + o + "px", i = ";");
				}
				r ||= null, t = e.getAttribute("style"), t !== r && (r = vu(r), vu(t) !== r && (n.style = Tu(e)));
			}
		}
		function Du(e, t, n, r, i, a) {
			if (i.delete(n), e = e.getAttribute(n), e === null) switch (typeof r) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean": return;
			}
			else if (r != null) switch (typeof r) {
				case "function":
				case "symbol":
				case "boolean": break;
				default: if (P(r, t), e === "" + r) return;
			}
			mu(t, e, r, a);
		}
		function Ou(e, t, n, r, i, a) {
			if (i.delete(n), e = e.getAttribute(n), e === null) {
				switch (typeof r) {
					case "function":
					case "symbol": return;
				}
				if (!r) return;
			} else switch (typeof r) {
				case "function":
				case "symbol": break;
				default: if (r) return;
			}
			mu(t, e, r, a);
		}
		function ku(e, t, n, r, i, a) {
			if (i.delete(n), e = e.getAttribute(n), e === null) switch (typeof r) {
				case "undefined":
				case "function":
				case "symbol": return;
			}
			else if (r != null) switch (typeof r) {
				case "function":
				case "symbol": break;
				default: if (P(r, n), e === "" + r) return;
			}
			mu(t, e, r, a);
		}
		function Au(e, t, n, r, i, a) {
			if (i.delete(n), e = e.getAttribute(n), e === null) switch (typeof r) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean": return;
				default: if (isNaN(r)) return;
			}
			else if (r != null) switch (typeof r) {
				case "function":
				case "symbol":
				case "boolean": break;
				default: if (!isNaN(r) && (P(r, t), e === "" + r)) return;
			}
			mu(t, e, r, a);
		}
		function ju(e, t, n, r, i, a) {
			if (i.delete(n), e = e.getAttribute(n), e === null) switch (typeof r) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean": return;
			}
			else if (r != null) switch (typeof r) {
				case "function":
				case "symbol":
				case "boolean": break;
				default: if (P(r, t), n = $t("" + r), e === n) return;
			}
			mu(t, e, r, a);
		}
		function Mu(e, t, n, r) {
			for (var i = {}, a = /* @__PURE__ */ new Set(), o = e.attributes, s = 0; s < o.length; s++) switch (o[s].name.toLowerCase()) {
				case "value": break;
				case "checked": break;
				case "selected": break;
				default: a.add(o[s].name);
			}
			if (Jt(t)) {
				for (var c in n) if (n.hasOwnProperty(c)) {
					var l = n[c];
					if (l != null) {
						if (Zp.hasOwnProperty(c)) typeof l != "function" && gu(c, l);
						else if (!0 !== n.suppressHydrationWarning) switch (c) {
							case "children":
								typeof l != "string" && typeof l != "number" || mu("children", e.textContent, l, i);
								continue;
							case "suppressContentEditableWarning":
							case "suppressHydrationWarning":
							case "defaultValue":
							case "defaultChecked":
							case "innerHTML":
							case "ref": continue;
							case "dangerouslySetInnerHTML":
								o = e.innerHTML, l = l ? l.__html : void 0, l != null && (l = _u(e, l), mu(c, o, l, i));
								continue;
							case "style":
								a.delete(c), Eu(e, l, i);
								continue;
							case "offsetParent":
							case "offsetTop":
							case "offsetLeft":
							case "offsetWidth":
							case "offsetHeight":
							case "isContentEditable":
							case "outerText":
							case "outerHTML":
								a.delete(c.toLowerCase()), console.error("Assignment to read-only property will result in a no-op: `%s`", c);
								continue;
							case "className":
								a.delete("class"), o = et(e, "class", l), mu("className", o, l, i);
								continue;
							default: r.context === WS && t !== "svg" && t !== "math" ? a.delete(c.toLowerCase()) : a.delete(c), o = et(e, c, l), mu(c, o, l, i);
						}
					}
				}
			} else for (l in n) if (n.hasOwnProperty(l) && (c = n[l], c != null)) {
				if (Zp.hasOwnProperty(l)) typeof c != "function" && gu(l, c);
				else if (!0 !== n.suppressHydrationWarning) switch (l) {
					case "children":
						typeof c != "string" && typeof c != "number" || mu("children", e.textContent, c, i);
						continue;
					case "suppressContentEditableWarning":
					case "suppressHydrationWarning":
					case "value":
					case "checked":
					case "selected":
					case "defaultValue":
					case "defaultChecked":
					case "innerHTML":
					case "ref": continue;
					case "dangerouslySetInnerHTML":
						o = e.innerHTML, c = c ? c.__html : void 0, c != null && (c = _u(e, c), o !== c && (i[l] = { __html: o }));
						continue;
					case "className":
						Du(e, l, "class", c, a, i);
						continue;
					case "tabIndex":
						Du(e, l, "tabindex", c, a, i);
						continue;
					case "style":
						a.delete(l), Eu(e, c, i);
						continue;
					case "multiple":
						a.delete(l), mu(l, e.multiple, c, i);
						continue;
					case "muted":
						a.delete(l), mu(l, e.muted, c, i);
						continue;
					case "autoFocus":
						a.delete("autofocus"), mu(l, e.autofocus, c, i);
						continue;
					case "data": if (t !== "object") {
						a.delete(l), o = e.getAttribute("data"), mu(l, o, c, i);
						continue;
					}
					case "src":
					case "href":
						if (!(c !== "" || t === "a" && l === "href" || t === "object" && l === "data")) {
							console.error(l === "src" ? "An empty string (\"\") was passed to the %s attribute. This may cause the browser to download the whole page again over the network. To fix this, either do not render the element at all or pass null to %s instead of an empty string." : "An empty string (\"\") was passed to the %s attribute. To fix this, either do not render the element at all or pass null to %s instead of an empty string.", l, l);
							continue;
						}
						ju(e, l, l, c, a, i);
						continue;
					case "action":
					case "formAction":
						if (o = e.getAttribute(l), typeof c == "function") {
							a.delete(l.toLowerCase()), l === "formAction" ? (a.delete("name"), a.delete("formenctype"), a.delete("formmethod"), a.delete("formtarget")) : (a.delete("enctype"), a.delete("method"), a.delete("target"));
							continue;
						} else if (o === OS) {
							a.delete(l.toLowerCase()), mu(l, "function", c, i);
							continue;
						}
						ju(e, l, l.toLowerCase(), c, a, i);
						continue;
					case "xlinkHref":
						ju(e, l, "xlink:href", c, a, i);
						continue;
					case "contentEditable":
						ku(e, l, "contenteditable", c, a, i);
						continue;
					case "spellCheck":
						ku(e, l, "spellcheck", c, a, i);
						continue;
					case "draggable":
					case "autoReverse":
					case "externalResourcesRequired":
					case "focusable":
					case "preserveAlpha":
						ku(e, l, l, c, a, i);
						continue;
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
						Ou(e, l, l.toLowerCase(), c, a, i);
						continue;
					case "capture":
					case "download":
						a: {
							s = e;
							var u = o = l, d = i;
							if (a.delete(u), s = s.getAttribute(u), s === null) switch (typeof c) {
								case "undefined":
								case "function":
								case "symbol": break a;
								default: if (!1 === c) break a;
							}
							else if (c != null) switch (typeof c) {
								case "function":
								case "symbol": break;
								case "boolean":
									if (!0 === c && s === "") break a;
									break;
								default: if (P(c, o), s === "" + c) break a;
							}
							mu(o, s, c, d);
						}
						continue;
					case "cols":
					case "rows":
					case "size":
					case "span":
						a: {
							if (s = e, u = o = l, d = i, a.delete(u), s = s.getAttribute(u), s === null) switch (typeof c) {
								case "undefined":
								case "function":
								case "symbol":
								case "boolean": break a;
								default: if (isNaN(c) || 1 > c) break a;
							}
							else if (c != null) switch (typeof c) {
								case "function":
								case "symbol":
								case "boolean": break;
								default: if (!(isNaN(c) || 1 > c) && (P(c, o), s === "" + c)) break a;
							}
							mu(o, s, c, d);
						}
						continue;
					case "rowSpan":
						Au(e, l, "rowspan", c, a, i);
						continue;
					case "start":
						Au(e, l, l, c, a, i);
						continue;
					case "xHeight":
						Du(e, l, "x-height", c, a, i);
						continue;
					case "xlinkActuate":
						Du(e, l, "xlink:actuate", c, a, i);
						continue;
					case "xlinkArcrole":
						Du(e, l, "xlink:arcrole", c, a, i);
						continue;
					case "xlinkRole":
						Du(e, l, "xlink:role", c, a, i);
						continue;
					case "xlinkShow":
						Du(e, l, "xlink:show", c, a, i);
						continue;
					case "xlinkTitle":
						Du(e, l, "xlink:title", c, a, i);
						continue;
					case "xlinkType":
						Du(e, l, "xlink:type", c, a, i);
						continue;
					case "xmlBase":
						Du(e, l, "xml:base", c, a, i);
						continue;
					case "xmlLang":
						Du(e, l, "xml:lang", c, a, i);
						continue;
					case "xmlSpace":
						Du(e, l, "xml:space", c, a, i);
						continue;
					case "inert":
						c !== "" || CS[l] || (CS[l] = !0, console.error("Received an empty string for a boolean attribute `%s`. This will treat the attribute as if it were false. Either pass `false` to silence this warning, or pass `true` if you used an empty string in earlier versions of React to indicate this attribute is true.", l)), Ou(e, l, l, c, a, i);
						continue;
					default: if (!(2 < l.length) || l[0] !== "o" && l[0] !== "O" || l[1] !== "n" && l[1] !== "N") {
						s = Yt(l), o = !1, r.context === WS && t !== "svg" && t !== "math" ? a.delete(s.toLowerCase()) : (u = l.toLowerCase(), u = Pm.hasOwnProperty(u) && Pm[u] || null, u !== null && u !== l && (o = !0, a.delete(u)), a.delete(s));
						a: if (u = e, d = s, s = c, $e(d)) if (u.hasAttribute(d)) u = u.getAttribute(d), P(s, d), s = u === "" + s ? s : u;
						else {
							switch (typeof s) {
								case "function":
								case "symbol": break a;
								case "boolean": if (u = d.toLowerCase().slice(0, 5), u !== "data-" && u !== "aria-") break a;
							}
							s = s === void 0 ? void 0 : null;
						}
						else s = void 0;
						o || mu(l, s, c, i);
					}
				}
			}
			return 0 < a.size && !0 !== n.suppressHydrationWarning && hu(e, a, i), Object.keys(i).length === 0 ? null : i;
		}
		function Nu(e, t) {
			switch (e.length) {
				case 0: return "";
				case 1: return e[0];
				case 2: return e[0] + " " + t + " " + e[1];
				default: return e.slice(0, -1).join(", ") + ", " + t + " " + e[e.length - 1];
			}
		}
		function Pu(e) {
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
		function Fu() {
			if (typeof performance.getEntriesByType == "function") {
				for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), r = 0; r < n.length; r++) {
					var i = n[r], a = i.transferSize, o = i.initiatorType, s = i.duration;
					if (a && s && Pu(o)) {
						for (o = 0, s = i.responseEnd, r += 1; r < n.length; r++) {
							var c = n[r], l = c.startTime;
							if (l > s) break;
							var u = c.transferSize, d = c.initiatorType;
							u && Pu(d) && (c = c.responseEnd, o += u * (c < s ? 1 : (s - l) / (c - l)));
						}
						if (--r, t += 8 * (a + o) / (i.duration / 1e3), e++, 10 < e) break;
					}
				}
				if (0 < e) return t / e / 1e6;
			}
			return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
		}
		function Iu(e) {
			return e.nodeType === 9 ? e : e.ownerDocument;
		}
		function Lu(e) {
			switch (e) {
				case Mm: return GS;
				case jm: return KS;
				default: return WS;
			}
		}
		function Ru(e, t) {
			if (e === WS) switch (t) {
				case "svg": return GS;
				case "math": return KS;
				default: return WS;
			}
			return e === GS && t === "foreignObject" ? WS : e;
		}
		function zu(e, t) {
			return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
		}
		function Bu() {
			var e = window.event;
			return e && e.type === "popstate" ? e === XS ? !1 : (XS = e, !0) : (XS = null, !1);
		}
		function Vu() {
			var e = window.event;
			return e && e !== ZS ? e.type : null;
		}
		function Hu() {
			var e = window.event;
			return e && e !== ZS ? e.timeStamp : -1.1;
		}
		function Uu(e) {
			setTimeout(function() {
				throw e;
			});
		}
		function Wu(e, t, n) {
			switch (t) {
				case "button":
				case "input":
				case "select":
				case "textarea":
					n.autoFocus && e.focus();
					break;
				case "img": n.src ? e.src = n.src : n.srcSet && (e.srcset = n.srcSet);
			}
		}
		function Gu() {}
		function Ku(e, t, n, r) {
			Cu(e, t, n, r), e[Up] = r;
		}
		function qu(e) {
			Wt(e, "");
		}
		function Ju(e, t, n) {
			e.nodeValue = n;
		}
		function Yu(e) {
			if (!e.__reactWarnedAboutChildrenConflict) {
				var t = e[Up] || null;
				if (t !== null) {
					var n = Ke(e);
					n !== null && (typeof t.children == "string" || typeof t.children == "number" ? (e.__reactWarnedAboutChildrenConflict = !0, N(n, function() {
						console.error("Cannot use a ref on a React element as a container to `createRoot` or `createPortal` if that element also sets \"children\" text content using React. It should be a leaf with no children. Otherwise it's ambiguous which children should be used.");
					})) : t.dangerouslySetInnerHTML != null && (e.__reactWarnedAboutChildrenConflict = !0, N(n, function() {
						console.error("Cannot use a ref on a React element as a container to `createRoot` or `createPortal` if that element also sets \"dangerouslySetInnerHTML\" using React. It should be a leaf with no children. Otherwise it's ambiguous which children should be used.");
					})));
				}
			}
		}
		function Xu(e) {
			return e === "head";
		}
		function Zu(e, t) {
			e.removeChild(t);
		}
		function Qu(e, t) {
			(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e).removeChild(t);
		}
		function $u(e, t) {
			var n = t, r = 0;
			do {
				var i = n.nextSibling;
				if (e.removeChild(n), i && i.nodeType === 8) if (n = i.data, n === NS || n === jS) {
					if (r === 0) {
						e.removeChild(i), vf(t);
						return;
					}
					r--;
				} else if (n === MS || n === PS || n === FS || n === IS || n === AS) r++;
				else if (n === LS) wd(e.ownerDocument.documentElement);
				else if (n === zS) {
					n = e.ownerDocument.head, wd(n);
					for (var a = n.firstChild; a;) {
						var o = a.nextSibling, s = a.nodeName;
						a[Yp] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && a.rel.toLowerCase() === "stylesheet" || n.removeChild(a), a = o;
					}
				} else n === RS && wd(e.ownerDocument.body);
				n = i;
			} while (n);
			vf(t);
		}
		function ed(e, t) {
			var n = e;
			e = 0;
			do {
				var r = n.nextSibling;
				if (n.nodeType === 1 ? t ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (t ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), r && r.nodeType === 8) if (n = r.data, n === NS) {
					if (e === 0) break;
					e--;
				} else n !== MS && n !== PS && n !== FS && n !== IS || e++;
				n = r;
			} while (n);
		}
		function td(e) {
			ed(e, !0);
		}
		function nd(e) {
			e = e.style, typeof e.setProperty == "function" ? e.setProperty("display", "none", "important") : e.display = "none";
		}
		function rd(e) {
			e.nodeValue = "";
		}
		function id(e) {
			ed(e, !1);
		}
		function ad(e, t) {
			t = t[US], t = t != null && t.hasOwnProperty("display") ? t.display : null, e.style.display = t == null || typeof t == "boolean" ? "" : ("" + t).trim();
		}
		function od(e, t) {
			e.nodeValue = t;
		}
		function sd(e) {
			var t = e.firstChild;
			for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
				var n = t;
				switch (t = t.nextSibling, n.nodeName) {
					case "HTML":
					case "HEAD":
					case "BODY":
						sd(n), We(n);
						continue;
					case "SCRIPT":
					case "STYLE": continue;
					case "LINK": if (n.rel.toLowerCase() === "stylesheet") continue;
				}
				e.removeChild(n);
			}
		}
		function cd(e, t, n, r) {
			for (; e.nodeType === 1;) {
				var i = n;
				if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
					if (!r && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
				} else if (!r) if (t === "input" && e.type === "hidden") {
					P(i.name, "name");
					var a = i.name == null ? null : "" + i.name;
					if (i.type === "hidden" && e.getAttribute("name") === a) return e;
				} else return e;
				else if (!e[Yp]) switch (t) {
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
				if (e = md(e.nextSibling), e === null) break;
			}
			return null;
		}
		function ld(e, t, n) {
			if (t === "") return null;
			for (; e.nodeType !== 3;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = md(e.nextSibling), e === null)) return null;
			return e;
		}
		function ud(e, t) {
			for (; e.nodeType !== 8;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = md(e.nextSibling), e === null)) return null;
			return e;
		}
		function dd(e) {
			return e.data === PS || e.data === FS;
		}
		function fd(e) {
			return e.data === IS || e.data === PS && e.ownerDocument.readyState !== HS;
		}
		function pd(e, t) {
			var n = e.ownerDocument;
			if (e.data === FS) e._reactRetry = t;
			else if (e.data !== PS || n.readyState !== HS) t();
			else {
				var r = function() {
					t(), n.removeEventListener("DOMContentLoaded", r);
				};
				n.addEventListener("DOMContentLoaded", r), e._reactRetry = r;
			}
		}
		function md(e) {
			for (; e != null; e = e.nextSibling) {
				var t = e.nodeType;
				if (t === 1 || t === 3) break;
				if (t === 8) {
					if (t = e.data, t === MS || t === IS || t === PS || t === FS || t === AS || t === BS || t === VS) break;
					if (t === NS || t === jS) return null;
				}
			}
			return e;
		}
		function hd(e) {
			if (e.nodeType === 1) {
				for (var t = e.nodeName.toLowerCase(), n = {}, r = e.attributes, i = 0; i < r.length; i++) {
					var a = r[i];
					n[wu(a.name)] = a.name.toLowerCase() === "style" ? Tu(e) : a.value;
				}
				return {
					type: t,
					props: n
				};
			}
			return e.nodeType === 8 ? e.data === AS ? {
				type: "Activity",
				props: {}
			} : {
				type: "Suspense",
				props: {}
			} : e.nodeValue;
		}
		function gd(e, t, n) {
			return n === null || !0 !== n[kS] ? (e.nodeValue === t ? e = null : (t = vu(t), e = vu(e.nodeValue) === t ? null : e.nodeValue), e) : null;
		}
		function _d(e) {
			e = e.nextSibling;
			for (var t = 0; e;) {
				if (e.nodeType === 8) {
					var n = e.data;
					if (n === NS || n === jS) {
						if (t === 0) return md(e.nextSibling);
						t--;
					} else n !== MS && n !== IS && n !== PS && n !== FS && n !== AS || t++;
				}
				e = e.nextSibling;
			}
			return null;
		}
		function vd(e) {
			e = e.previousSibling;
			for (var t = 0; e;) {
				if (e.nodeType === 8) {
					var n = e.data;
					if (n === MS || n === IS || n === PS || n === FS || n === AS) {
						if (t === 0) return e;
						t--;
					} else n !== NS && n !== jS || t++;
				}
				e = e.previousSibling;
			}
			return null;
		}
		function yd(e) {
			vf(e);
		}
		function bd(e) {
			vf(e);
		}
		function xd(e) {
			vf(e);
		}
		function Sd(e, t, n, r, i) {
			switch (i && Ht(e, r.ancestorInfo), t = Iu(n), e) {
				case "html":
					if (e = t.documentElement, !e) throw Error("React expected an <html> element (document.documentElement) to exist in the Document but one was not found. React never removes the documentElement for any Document it renders into so the cause is likely in some other script running on this page.");
					return e;
				case "head":
					if (e = t.head, !e) throw Error("React expected a <head> element (document.head) to exist in the Document but one was not found. React never removes the head for any Document it renders into so the cause is likely in some other script running on this page.");
					return e;
				case "body":
					if (e = t.body, !e) throw Error("React expected a <body> element (document.body) to exist in the Document but one was not found. React never removes the body for any Document it renders into so the cause is likely in some other script running on this page.");
					return e;
				default: throw Error("resolveSingletonInstance was called with an element type that is not supported. This is a bug in React.");
			}
		}
		function Cd(e, t, n, r) {
			if (!n[Wp] && Ke(n)) {
				var i = n.tagName.toLowerCase();
				console.error("You are mounting a new %s component when a previous one has not first unmounted. It is an error to render more than one %s component at a time and attributes and children of these components will likely fail in unpredictable ways. Please only render a single instance of <%s> and if you need to mount a new one, ensure any previous ones have unmounted first.", i, i, i);
			}
			switch (e) {
				case "html":
				case "head":
				case "body": break;
				default: console.error("acquireSingletonInstance was called with an element type that is not supported. This is a bug in React.");
			}
			for (i = n.attributes; i.length;) n.removeAttributeNode(i[0]);
			Su(n, e, t), n[Hp] = r, n[Up] = t;
		}
		function wd(e) {
			for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
			We(e);
		}
		function Td(e) {
			return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
		}
		function Ed(e, t, n) {
			var r = fC;
			if (r && typeof t == "string" && t) {
				var i = ut(t);
				i = "link[rel=\"" + e + "\"][href=\"" + i + "\"]", typeof n == "string" && (i += "[crossorigin=\"" + n + "\"]"), uC.has(i) || (uC.add(i), e = {
					rel: e,
					crossOrigin: n,
					href: t
				}, r.querySelector(i) === null && (t = r.createElement("link"), Su(t, "link", e), Ye(t), r.head.appendChild(t)));
			}
		}
		function Dd(e, t, n, r) {
			var i = (i = Zf.current) ? Td(i) : null;
			if (!i) throw Error("\"resourceRoot\" was expected to exist. This is a bug in React.");
			switch (e) {
				case "meta":
				case "title": return null;
				case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (n = U(n.href), t = Je(i).hoistableStyles, r = t.get(n), r || (r = {
					type: "style",
					instance: null,
					count: 0,
					state: null
				}, t.set(n, r)), r) : {
					type: "void",
					instance: null,
					count: 0,
					state: null
				};
				case "link":
					if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
						e = U(n.href);
						var a = Je(i).hoistableStyles, o = a.get(e);
						if (!o && (i = i.ownerDocument || i, o = {
							type: "stylesheet",
							instance: null,
							count: 0,
							state: {
								loading: iC,
								preload: null
							}
						}, a.set(e, o), (a = i.querySelector(kd(e))) && !a._p && (o.instance = a, o.state.loading = aC | cC), !lC.has(e))) {
							var s = {
								rel: "preload",
								as: "style",
								href: n.href,
								crossOrigin: n.crossOrigin,
								integrity: n.integrity,
								media: n.media,
								hrefLang: n.hrefLang,
								referrerPolicy: n.referrerPolicy
							};
							lC.set(e, s), a || jd(i, e, s, o.state);
						}
						if (t && r === null) throw n = "\n\n  - " + Od(t) + "\n  + " + Od(n), Error("Expected <link> not to update to be updated to a stylesheet with precedence. Check the `rel`, `href`, and `precedence` props of this component. Alternatively, check whether two different <link> components render in the same slot or share the same key." + n);
						return o;
					}
					if (t && r !== null) throw n = "\n\n  - " + Od(t) + "\n  + " + Od(n), Error("Expected stylesheet with precedence to not be updated to a different kind of <link>. Check the `rel`, `href`, and `precedence` props of this component. Alternatively, check whether two different <link> components render in the same slot or share the same key." + n);
					return null;
				case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (n = Md(n), t = Je(i).hoistableScripts, r = t.get(n), r || (r = {
					type: "script",
					instance: null,
					count: 0,
					state: null
				}, t.set(n, r)), r) : {
					type: "void",
					instance: null,
					count: 0,
					state: null
				};
				default: throw Error("getResource encountered a type it did not expect: \"" + e + "\". this is a bug in React.");
			}
		}
		function Od(e) {
			var t = 0, n = "<link";
			return typeof e.rel == "string" ? (t++, n += " rel=\"" + e.rel + "\"") : pp.call(e, "rel") && (t++, n += " rel=\"" + (e.rel === null ? "null" : "invalid type " + typeof e.rel) + "\""), typeof e.href == "string" ? (t++, n += " href=\"" + e.href + "\"") : pp.call(e, "href") && (t++, n += " href=\"" + (e.href === null ? "null" : "invalid type " + typeof e.href) + "\""), typeof e.precedence == "string" ? (t++, n += " precedence=\"" + e.precedence + "\"") : pp.call(e, "precedence") && (t++, n += " precedence={" + (e.precedence === null ? "null" : "invalid type " + typeof e.precedence) + "}"), Object.getOwnPropertyNames(e).length > t && (n += " ..."), n + " />";
		}
		function U(e) {
			return "href=\"" + ut(e) + "\"";
		}
		function kd(e) {
			return "link[rel=\"stylesheet\"][" + e + "]";
		}
		function Ad(e) {
			return W({}, e, {
				"data-precedence": e.precedence,
				precedence: null
			});
		}
		function jd(e, t, n, r) {
			e.querySelector("link[rel=\"preload\"][as=\"style\"][" + t + "]") ? r.loading = aC : (t = e.createElement("link"), r.preload = t, t.addEventListener("load", function() {
				return r.loading |= aC;
			}), t.addEventListener("error", function() {
				return r.loading |= oC;
			}), Su(t, "link", n), Ye(t), e.head.appendChild(t));
		}
		function Md(e) {
			return "[src=\"" + ut(e) + "\"]";
		}
		function Nd(e) {
			return "script[async]" + e;
		}
		function Pd(e, t, n) {
			if (t.count++, t.instance === null) switch (t.type) {
				case "style":
					var r = e.querySelector("style[data-href~=\"" + ut(n.href) + "\"]");
					if (r) return t.instance = r, Ye(r), r;
					var i = W({}, n, {
						"data-href": n.href,
						"data-precedence": n.precedence,
						href: null,
						precedence: null
					});
					return r = (e.ownerDocument || e).createElement("style"), Ye(r), Su(r, "style", i), Fd(r, n.precedence, e), t.instance = r;
				case "stylesheet":
					i = U(n.href);
					var a = e.querySelector(kd(i));
					if (a) return t.state.loading |= cC, t.instance = a, Ye(a), a;
					r = Ad(n), (i = lC.get(i)) && Id(r, i), a = (e.ownerDocument || e).createElement("link"), Ye(a);
					var o = a;
					return o._p = new Promise(function(e, t) {
						o.onload = e, o.onerror = t;
					}), Su(a, "link", r), t.state.loading |= cC, Fd(a, n.precedence, e), t.instance = a;
				case "script": return a = Md(n.src), (i = e.querySelector(Nd(a))) ? (t.instance = i, Ye(i), i) : (r = n, (i = lC.get(a)) && (r = W({}, n), Ld(r, i)), e = e.ownerDocument || e, i = e.createElement("script"), Ye(i), Su(i, "link", r), e.head.appendChild(i), t.instance = i);
				case "void": return null;
				default: throw Error("acquireResource encountered a resource type it did not expect: \"" + t.type + "\". this is a bug in React.");
			}
			else t.type === "stylesheet" && (t.state.loading & cC) === iC && (r = t.instance, t.state.loading |= cC, Fd(r, n.precedence, e));
			return t.instance;
		}
		function Fd(e, t, n) {
			for (var r = n.querySelectorAll("link[rel=\"stylesheet\"][data-precedence],style[data-precedence]"), i = r.length ? r[r.length - 1] : null, a = i, o = 0; o < r.length; o++) {
				var s = r[o];
				if (s.dataset.precedence === t) a = s;
				else if (a !== i) break;
			}
			a ? a.parentNode.insertBefore(e, a.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
		}
		function Id(e, t) {
			e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.title ??= t.title;
		}
		function Ld(e, t) {
			e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.integrity ??= t.integrity;
		}
		function Rd(e, t, n) {
			if (pC === null) {
				var r = /* @__PURE__ */ new Map(), i = pC = /* @__PURE__ */ new Map();
				i.set(n, r);
			} else i = pC, r = i.get(n), r || (r = /* @__PURE__ */ new Map(), i.set(n, r));
			if (r.has(e)) return r;
			for (r.set(e, null), n = n.getElementsByTagName(e), i = 0; i < n.length; i++) {
				var a = n[i];
				if (!(a[Yp] || a[Hp] || e === "link" && a.getAttribute("rel") === "stylesheet") && a.namespaceURI !== Mm) {
					var o = a.getAttribute(t) || "";
					o = e + o;
					var s = r.get(o);
					s ? s.push(a) : r.set(o, [a]);
				}
			}
			return r;
		}
		function zd(e, t, n) {
			e = e.ownerDocument || e, e.head.insertBefore(n, t === "title" ? e.querySelector("head > title") : null);
		}
		function Bd(e, t, n) {
			var r = !n.ancestorInfo.containerTagInScope;
			if (n.context === GS || t.itemProp != null) return !r || t.itemProp == null || e !== "meta" && e !== "title" && e !== "style" && e !== "link" && e !== "script" || console.error("Cannot render a <%s> outside the main document if it has an `itemProp` prop. `itemProp` suggests the tag belongs to an `itemScope` which can appear anywhere in the DOM. If you were intending for React to hoist this <%s> remove the `itemProp` prop. Otherwise, try moving this tag into the <head> or <body> of the Document.", e, e), !1;
			switch (e) {
				case "meta":
				case "title": return !0;
				case "style":
					if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "") {
						r && console.error("Cannot render a <style> outside the main document without knowing its precedence and a unique href key. React can hoist and deduplicate <style> tags if you provide a `precedence` prop along with an `href` prop that does not conflict with the `href` values used in any other hoisted <style> or <link rel=\"stylesheet\" ...> tags.  Note that hoisting <style> tags is considered an advanced feature that most will not use directly. Consider moving the <style> tag to the <head> or consider adding a `precedence=\"default\"` and `href=\"some unique resource identifier\"`.");
						break;
					}
					return !0;
				case "link":
					if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError) {
						if (t.rel === "stylesheet" && typeof t.precedence == "string") {
							e = t.href;
							var i = t.onError, a = t.disabled;
							n = [], t.onLoad && n.push("`onLoad`"), i && n.push("`onError`"), a != null && n.push("`disabled`"), i = Nu(n, "and"), i += n.length === 1 ? " prop" : " props", a = n.length === 1 ? "an " + i : "the " + i, n.length && console.error("React encountered a <link rel=\"stylesheet\" href=\"%s\" ... /> with a `precedence` prop that also included %s. The presence of loading and error handlers indicates an intent to manage the stylesheet loading state from your from your Component code and React will not hoist or deduplicate this stylesheet. If your intent was to have React hoist and deduplciate this stylesheet using the `precedence` prop remove the %s, otherwise remove the `precedence` prop.", e, a, i);
						}
						r && (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" ? console.error("Cannot render a <link> outside the main document without a `rel` and `href` prop. Try adding a `rel` and/or `href` prop to this <link> or moving the link into the <head> tag") : (t.onError || t.onLoad) && console.error("Cannot render a <link> with onLoad or onError listeners outside the main document. Try removing onLoad={...} and onError={...} or moving it into the root <head> tag or somewhere in the <body>."));
						break;
					}
					switch (t.rel) {
						case "stylesheet": return e = t.precedence, t = t.disabled, typeof e != "string" && r && console.error("Cannot render a <link rel=\"stylesheet\" /> outside the main document without knowing its precedence. Consider adding precedence=\"default\" or moving it into the root <head> tag."), typeof e == "string" && t == null;
						default: return !0;
					}
				case "script":
					if (e = t.async && typeof t.async != "function" && typeof t.async != "symbol", !e || t.onLoad || t.onError || !t.src || typeof t.src != "string") {
						r && (e ? t.onLoad || t.onError ? console.error("Cannot render a <script> with onLoad or onError listeners outside the main document. Try removing onLoad={...} and onError={...} or moving it into the root <head> tag or somewhere in the <body>.") : console.error("Cannot render a <script> outside the main document without `async={true}` and a non-empty `src` prop. Ensure there is a valid `src` and either make the script async or move it into the root <head> tag or somewhere in the <body>.") : console.error("Cannot render a sync or defer <script> outside the main document without knowing its order. Try adding async=\"\" or moving it into the root <head> tag."));
						break;
					}
					return !0;
				case "noscript":
				case "template": r && console.error("Cannot render <%s> outside the main document. Try moving it into the root <head> tag.", e);
			}
			return !1;
		}
		function Vd(e) {
			return !(e.type === "stylesheet" && (e.state.loading & sC) === iC);
		}
		function Hd(e, t, n, r) {
			if (n.type === "stylesheet" && (typeof r.media != "string" || !1 !== matchMedia(r.media).matches) && (n.state.loading & cC) === iC) {
				if (n.instance === null) {
					var i = U(r.href), a = t.querySelector(kd(i));
					if (a) {
						t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = Wd.bind(e), t.then(e, e)), n.state.loading |= cC, n.instance = a, Ye(a);
						return;
					}
					a = t.ownerDocument || t, r = Ad(r), (i = lC.get(i)) && Id(r, i), a = a.createElement("link"), Ye(a);
					var o = a;
					o._p = new Promise(function(e, t) {
						o.onload = e, o.onerror = t;
					}), Su(a, "link", r), n.instance = a;
				}
				e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && (n.state.loading & sC) === iC && (e.count++, n = Wd.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
			}
		}
		function Ud(e, t) {
			return e.stylesheets && e.count === 0 && Gd(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
				var r = setTimeout(function() {
					if (e.stylesheets && Gd(e, e.stylesheets), e.unsuspend) {
						var t = e.unsuspend;
						e.unsuspend = null, t();
					}
				}, mC + t);
				0 < e.imgBytes && _C === 0 && (_C = 125 * Fu() * gC);
				var i = setTimeout(function() {
					if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && Gd(e, e.stylesheets), e.unsuspend)) {
						var t = e.unsuspend;
						e.unsuspend = null, t();
					}
				}, (e.imgBytes > _C ? 50 : hC) + t);
				return e.unsuspend = n, function() {
					e.unsuspend = null, clearTimeout(r), clearTimeout(i);
				};
			} : null;
		}
		function Wd() {
			if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
				if (this.stylesheets) Gd(this, this.stylesheets);
				else if (this.unsuspend) {
					var e = this.unsuspend;
					this.unsuspend = null, e();
				}
			}
		}
		function Gd(e, t) {
			e.stylesheets = null, e.unsuspend !== null && (e.count++, yC = /* @__PURE__ */ new Map(), t.forEach(Kd, e), yC = null, Wd.call(e));
		}
		function Kd(e, t) {
			if (!(t.state.loading & cC)) {
				var n = yC.get(e);
				if (n) var r = n.get(vC);
				else {
					n = /* @__PURE__ */ new Map(), yC.set(e, n);
					for (var i = e.querySelectorAll("link[data-precedence],style[data-precedence]"), a = 0; a < i.length; a++) {
						var o = i[a];
						(o.nodeName === "LINK" || o.getAttribute("media") !== "not all") && (n.set(o.dataset.precedence, o), r = o);
					}
					r && n.set(vC, r);
				}
				i = t.instance, o = i.getAttribute("data-precedence"), a = n.get(o) || r, a === r && n.set(vC, i), n.set(o, i), this.count++, r = Wd.bind(this), i.addEventListener("load", r), i.addEventListener("error", r), a ? a.parentNode.insertBefore(i, a.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(i, e.firstChild)), t.state.loading |= cC;
			}
		}
		function qd(e, t, n, r, i, a, o, s, c) {
			for (this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = eC, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = Me(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Me(0), this.hiddenUpdates = Me(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.incompleteTransitions = /* @__PURE__ */ new Map(), this.passiveEffectDuration = this.effectDuration = -0, this.memoizedUpdaters = /* @__PURE__ */ new Set(), e = this.pendingUpdatersLaneMap = [], t = 0; 31 > t; t++) e.push(/* @__PURE__ */ new Set());
			this._debugRootType = n ? "hydrateRoot()" : "createRoot()";
		}
		function Jd(e, t, n, r, i, a, o, s, c, l, u, d) {
			return e = new qd(e, t, n, o, c, l, u, d, s), t = Fg, !0 === a && (t |= Ig | Lg), t |= q, a = h(3, null, null, t), e.current = a, a.stateNode = e, t = ei(), ti(t), e.pooledCache = t, ti(t), a.memoizedState = {
				element: r,
				isDehydrated: n,
				cache: t
			}, qi(a), e;
		}
		function Yd(e) {
			return e ? (e = Mg, e) : Mg;
		}
		function Xd(e, t, n, r, i, a) {
			if (Op && typeof Op.onScheduleFiberRoot == "function") try {
				Op.onScheduleFiberRoot(Dp, r, n);
			} catch (e) {
				kp || (kp = !0, console.error("React instrumentation encountered an error: %o", e));
			}
			i = Yd(i), r.context === null ? r.context = i : r.pendingContext = i, fp && dp !== null && !DC && (DC = !0, console.error("Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.\n\nCheck the render method of %s.", T(dp) || "Unknown")), r = Yi(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (typeof a != "function" && console.error("Expected the last optional `callback` argument to be a function. Instead received: %s.", a), r.callback = a), n = Xi(e, r, t), n !== null && (ri(t, "root.render()", null), Qc(n, e, t), Zi(n, e, t));
		}
		function Zd(e, t) {
			if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
				var n = e.retryLane;
				e.retryLane = n !== 0 && n < t ? n : t;
			}
		}
		function Qd(e, t) {
			Zd(e, t), (e = e.alternate) && Zd(e, t);
		}
		function $d(e) {
			if (e.tag === 13 || e.tag === 31) {
				var t = or(e, 67108864);
				t !== null && Qc(t, e, 67108864), Qd(e, 67108864);
			}
		}
		function ef(e) {
			if (e.tag === 13 || e.tag === 31) {
				var t = Xc(e);
				t = Re(t);
				var n = or(e, t);
				n !== null && Qc(n, e, t), Qd(e, t);
			}
		}
		function tf() {
			return dp;
		}
		function nf(e, t, n, r) {
			var i = G.T;
			G.T = null;
			var a = Wf.p;
			try {
				Wf.p = Lp, af(e, t, n, r);
			} finally {
				Wf.p = a, G.T = i;
			}
		}
		function rf(e, t, n, r) {
			var i = G.T;
			G.T = null;
			var a = Wf.p;
			try {
				Wf.p = Rp, af(e, t, n, r);
			} finally {
				Wf.p = a, G.T = i;
			}
		}
		function af(e, t, n, r) {
			if (RC) {
				var i = of(r);
				if (i === null) cu(e, t, r, zC, n), lf(e, r);
				else if (df(i, e, t, n, r)) r.stopPropagation();
				else if (lf(e, r), t & 4 && -1 < qC.indexOf(e)) {
					for (; i !== null;) {
						var a = Ke(i);
						if (a !== null) switch (a.tag) {
							case 3:
								if (a = a.stateNode, a.current.memoizedState.isDehydrated) {
									var o = De(a.pendingLanes);
									if (o !== 0) {
										var s = a;
										for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
											var c = 1 << 31 - jp(o);
											s.entanglements[1] |= c, o &= ~c;
										}
										Gl(a), (Ub & (Pb | Fb)) === Nb && (bx = vp() + xx, V(0, !1));
									}
								}
								break;
							case 31:
							case 13: s = or(a, 2), s !== null && Qc(s, a, 2), rl(), Qd(a, 2);
						}
						if (a = of(r), a === null && cu(e, t, r, zC, n), a === i) break;
						i = a;
					}
					i !== null && r.stopPropagation();
				} else cu(e, t, r, null, n);
			}
		}
		function of(e) {
			return e = tn(e), sf(e);
		}
		function sf(e) {
			if (zC = null, e = Ge(e), e !== null) {
				var t = x(e);
				if (t === null) e = null;
				else {
					var n = t.tag;
					if (n === 13) {
						if (e = ee(t), e !== null) return e;
						e = null;
					} else if (n === 31) {
						if (e = te(t), e !== null) return e;
						e = null;
					} else if (n === 3) {
						if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
						e = null;
					} else t !== e && (e = null);
				}
			}
			return zC = e, null;
		}
		function cf(e) {
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
				case "selectstart": return Lp;
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
				case "pointerleave": return Rp;
				case "message": switch (yp()) {
					case bp: return Lp;
					case xp: return Rp;
					case Sp:
					case Cp: return zp;
					case wp: return Bp;
					default: return zp;
				}
				default: return zp;
			}
		}
		function lf(e, t) {
			switch (e) {
				case "focusin":
				case "focusout":
					VC = null;
					break;
				case "dragenter":
				case "dragleave":
					HC = null;
					break;
				case "mouseover":
				case "mouseout":
					UC = null;
					break;
				case "pointerover":
				case "pointerout":
					WC.delete(t.pointerId);
					break;
				case "gotpointercapture":
				case "lostpointercapture": GC.delete(t.pointerId);
			}
		}
		function uf(e, t, n, r, i, a) {
			return e === null || e.nativeEvent !== a ? (e = {
				blockedOn: t,
				domEventName: n,
				eventSystemFlags: r,
				nativeEvent: a,
				targetContainers: [i]
			}, t !== null && (t = Ke(t), t !== null && $d(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
		}
		function df(e, t, n, r, i) {
			switch (t) {
				case "focusin": return VC = uf(VC, e, t, n, r, i), !0;
				case "dragenter": return HC = uf(HC, e, t, n, r, i), !0;
				case "mouseover": return UC = uf(UC, e, t, n, r, i), !0;
				case "pointerover":
					var a = i.pointerId;
					return WC.set(a, uf(WC.get(a) || null, e, t, n, r, i)), !0;
				case "gotpointercapture": return a = i.pointerId, GC.set(a, uf(GC.get(a) || null, e, t, n, r, i)), !0;
			}
			return !1;
		}
		function ff(e) {
			var t = Ge(e.target);
			if (t !== null) {
				var n = x(t);
				if (n !== null) {
					if (t = n.tag, t === 13) {
						if (t = ee(n), t !== null) {
							e.blockedOn = t, Ue(e.priority, function() {
								ef(n);
							});
							return;
						}
					} else if (t === 31) {
						if (t = te(n), t !== null) {
							e.blockedOn = t, Ue(e.priority, function() {
								ef(n);
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
		function pf(e) {
			if (e.blockedOn !== null) return !1;
			for (var t = e.targetContainers; 0 < t.length;) {
				var n = of(e.nativeEvent);
				if (n === null) {
					n = e.nativeEvent;
					var r = new n.constructor(n.type, n), i = r;
					Km !== null && console.error("Expected currently replaying event to be null. This error is likely caused by a bug in React. Please file an issue."), Km = i, n.target.dispatchEvent(r), Km === null && console.error("Expected currently replaying event to not be null. This error is likely caused by a bug in React. Please file an issue."), Km = null;
				} else return t = Ke(n), t !== null && $d(t), e.blockedOn = n, !1;
				t.shift();
			}
			return !0;
		}
		function mf(e, t, n) {
			pf(e) && n.delete(t);
		}
		function hf() {
			BC = !1, VC !== null && pf(VC) && (VC = null), HC !== null && pf(HC) && (HC = null), UC !== null && pf(UC) && (UC = null), WC.forEach(mf), GC.forEach(mf);
		}
		function gf(e, t) {
			e.blockedOn === t && (e.blockedOn = null, BC || (BC = !0, Cf.unstable_scheduleCallback(Cf.unstable_NormalPriority, hf)));
		}
		function _f(e) {
			JC !== e && (JC = e, Cf.unstable_scheduleCallback(Cf.unstable_NormalPriority, function() {
				JC === e && (JC = null);
				for (var t = 0; t < e.length; t += 3) {
					var n = e[t], r = e[t + 1], i = e[t + 2];
					if (typeof r != "function") {
						if (sf(r || n) === null) continue;
						break;
					}
					var a = Ke(n);
					a !== null && (e.splice(t, 3), t -= 3, n = {
						pending: !0,
						data: i,
						method: n.method,
						action: r
					}, Object.freeze(n), ko(a, n, r, i));
				}
			}));
		}
		function vf(e) {
			function t(t) {
				return gf(t, e);
			}
			VC !== null && gf(VC, e), HC !== null && gf(HC, e), UC !== null && gf(UC, e), WC.forEach(t), GC.forEach(t);
			for (var n = 0; n < KC.length; n++) {
				var r = KC[n];
				r.blockedOn === e && (r.blockedOn = null);
			}
			for (; 0 < KC.length && (n = KC[0], n.blockedOn === null);) ff(n), n.blockedOn === null && KC.shift();
			if (n = (e.ownerDocument || e).$$reactFormReplay, n != null) for (r = 0; r < n.length; r += 3) {
				var i = n[r], a = n[r + 1], o = i[Up] || null;
				if (typeof a == "function") o || _f(n);
				else if (o) {
					var s = null;
					if (a && a.hasAttribute("formAction")) {
						if (i = a, o = a[Up] || null) s = o.formAction;
						else if (sf(i) !== null) continue;
					} else s = o.action;
					typeof s == "function" ? n[r + 1] = s : (n.splice(r, 3), r -= 3), _f(n);
				}
			}
		}
		function yf() {
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
		function bf(e) {
			this._internalRoot = e;
		}
		function xf(e) {
			this._internalRoot = e;
		}
		function Sf(e) {
			e[Wp] && (e._reactRootContainer ? console.error("You are calling ReactDOMClient.createRoot() on a container that was previously passed to ReactDOM.render(). This is not supported.") : console.error("You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before. Instead, call root.render() on the existing root instead if you want to update it."));
		}
		typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
		var Cf = m(), wf = d(), Tf = _(), W = Object.assign, Ef = Symbol.for("react.element"), Df = Symbol.for("react.transitional.element"), Of = Symbol.for("react.portal"), kf = Symbol.for("react.fragment"), Af = Symbol.for("react.strict_mode"), jf = Symbol.for("react.profiler"), Mf = Symbol.for("react.consumer"), Nf = Symbol.for("react.context"), Pf = Symbol.for("react.forward_ref"), Ff = Symbol.for("react.suspense"), If = Symbol.for("react.suspense_list"), Lf = Symbol.for("react.memo"), Rf = Symbol.for("react.lazy"), zf = Symbol.for("react.activity"), Bf = Symbol.for("react.memo_cache_sentinel"), Vf = Symbol.iterator, Hf = Symbol.for("react.client.reference"), Uf = Array.isArray, G = wf.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Wf = Tf.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Gf = Object.freeze({
			pending: !1,
			data: null,
			method: null,
			action: null
		}), Kf = [], qf = [], Jf = -1, Yf = E(null), Xf = E(null), Zf = E(null), Qf = E(null), $f = 0, ep, tp, np, rp, ip, ap, op;
		le.__reactDisabledLog = !0;
		var sp, cp, lp = !1, up = new (typeof WeakMap == "function" ? WeakMap : Map)(), dp = null, fp = !1, pp = Object.prototype.hasOwnProperty, mp = Cf.unstable_scheduleCallback, hp = Cf.unstable_cancelCallback, gp = Cf.unstable_shouldYield, _p = Cf.unstable_requestPaint, vp = Cf.unstable_now, yp = Cf.unstable_getCurrentPriorityLevel, bp = Cf.unstable_ImmediatePriority, xp = Cf.unstable_UserBlockingPriority, Sp = Cf.unstable_NormalPriority, Cp = Cf.unstable_LowPriority, wp = Cf.unstable_IdlePriority, Tp = Cf.log, Ep = Cf.unstable_setDisableYieldValue, Dp = null, Op = null, kp = !1, Ap = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u", jp = Math.clz32 ? Math.clz32 : Ee, Mp = Math.log, Np = Math.LN2, Pp = 256, Fp = 262144, Ip = 4194304, Lp = 2, Rp = 8, zp = 32, Bp = 268435456, Vp = Math.random().toString(36).slice(2), Hp = "__reactFiber$" + Vp, Up = "__reactProps$" + Vp, Wp = "__reactContainer$" + Vp, Gp = "__reactEvents$" + Vp, Kp = "__reactListeners$" + Vp, qp = "__reactHandles$" + Vp, Jp = "__reactResources$" + Vp, Yp = "__reactMarker$" + Vp, Xp = /* @__PURE__ */ new Set(), Zp = {}, Qp = {}, $p = {
			button: !0,
			checkbox: !0,
			image: !0,
			hidden: !0,
			radio: !0,
			reset: !0,
			submit: !0
		}, em = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), tm = {}, nm = {}, rm = /[\n"\\]/g, im = !1, am = !1, om = !1, sm = !1, cm = !1, lm = !1, um = ["value", "defaultValue"], dm = !1, fm = /["'&<>\n\t]|^\s|\s$/, pm = "address applet area article aside base basefont bgsound blockquote body br button caption center col colgroup dd details dir div dl dt embed fieldset figcaption figure footer form frame frameset h1 h2 h3 h4 h5 h6 head header hgroup hr html iframe img input isindex li link listing main marquee menu menuitem meta nav noembed noframes noscript object ol p param plaintext pre script section select source style summary table tbody td template textarea tfoot th thead title tr track ul wbr xmp".split(" "), mm = "applet caption html table td th marquee object template foreignObject desc title".split(" "), hm = mm.concat(["button"]), gm = "dd dt li option optgroup p rp rt".split(" "), _m = {
			current: null,
			formTag: null,
			aTagInScope: null,
			buttonTagInScope: null,
			nobrTagInScope: null,
			pTagInButtonScope: null,
			listItemTagAutoclosing: null,
			dlItemTagAutoclosing: null,
			containerTagInScope: null,
			implicitRootScope: !1
		}, vm = {}, ym = {
			animation: "animationDelay animationDirection animationDuration animationFillMode animationIterationCount animationName animationPlayState animationTimingFunction".split(" "),
			background: "backgroundAttachment backgroundClip backgroundColor backgroundImage backgroundOrigin backgroundPositionX backgroundPositionY backgroundRepeat backgroundSize".split(" "),
			backgroundPosition: ["backgroundPositionX", "backgroundPositionY"],
			border: "borderBottomColor borderBottomStyle borderBottomWidth borderImageOutset borderImageRepeat borderImageSlice borderImageSource borderImageWidth borderLeftColor borderLeftStyle borderLeftWidth borderRightColor borderRightStyle borderRightWidth borderTopColor borderTopStyle borderTopWidth".split(" "),
			borderBlockEnd: [
				"borderBlockEndColor",
				"borderBlockEndStyle",
				"borderBlockEndWidth"
			],
			borderBlockStart: [
				"borderBlockStartColor",
				"borderBlockStartStyle",
				"borderBlockStartWidth"
			],
			borderBottom: [
				"borderBottomColor",
				"borderBottomStyle",
				"borderBottomWidth"
			],
			borderColor: [
				"borderBottomColor",
				"borderLeftColor",
				"borderRightColor",
				"borderTopColor"
			],
			borderImage: [
				"borderImageOutset",
				"borderImageRepeat",
				"borderImageSlice",
				"borderImageSource",
				"borderImageWidth"
			],
			borderInlineEnd: [
				"borderInlineEndColor",
				"borderInlineEndStyle",
				"borderInlineEndWidth"
			],
			borderInlineStart: [
				"borderInlineStartColor",
				"borderInlineStartStyle",
				"borderInlineStartWidth"
			],
			borderLeft: [
				"borderLeftColor",
				"borderLeftStyle",
				"borderLeftWidth"
			],
			borderRadius: [
				"borderBottomLeftRadius",
				"borderBottomRightRadius",
				"borderTopLeftRadius",
				"borderTopRightRadius"
			],
			borderRight: [
				"borderRightColor",
				"borderRightStyle",
				"borderRightWidth"
			],
			borderStyle: [
				"borderBottomStyle",
				"borderLeftStyle",
				"borderRightStyle",
				"borderTopStyle"
			],
			borderTop: [
				"borderTopColor",
				"borderTopStyle",
				"borderTopWidth"
			],
			borderWidth: [
				"borderBottomWidth",
				"borderLeftWidth",
				"borderRightWidth",
				"borderTopWidth"
			],
			columnRule: [
				"columnRuleColor",
				"columnRuleStyle",
				"columnRuleWidth"
			],
			columns: ["columnCount", "columnWidth"],
			flex: [
				"flexBasis",
				"flexGrow",
				"flexShrink"
			],
			flexFlow: ["flexDirection", "flexWrap"],
			font: "fontFamily fontFeatureSettings fontKerning fontLanguageOverride fontSize fontSizeAdjust fontStretch fontStyle fontVariant fontVariantAlternates fontVariantCaps fontVariantEastAsian fontVariantLigatures fontVariantNumeric fontVariantPosition fontWeight lineHeight".split(" "),
			fontVariant: "fontVariantAlternates fontVariantCaps fontVariantEastAsian fontVariantLigatures fontVariantNumeric fontVariantPosition".split(" "),
			gap: ["columnGap", "rowGap"],
			grid: "gridAutoColumns gridAutoFlow gridAutoRows gridTemplateAreas gridTemplateColumns gridTemplateRows".split(" "),
			gridArea: [
				"gridColumnEnd",
				"gridColumnStart",
				"gridRowEnd",
				"gridRowStart"
			],
			gridColumn: ["gridColumnEnd", "gridColumnStart"],
			gridColumnGap: ["columnGap"],
			gridGap: ["columnGap", "rowGap"],
			gridRow: ["gridRowEnd", "gridRowStart"],
			gridRowGap: ["rowGap"],
			gridTemplate: [
				"gridTemplateAreas",
				"gridTemplateColumns",
				"gridTemplateRows"
			],
			listStyle: [
				"listStyleImage",
				"listStylePosition",
				"listStyleType"
			],
			margin: [
				"marginBottom",
				"marginLeft",
				"marginRight",
				"marginTop"
			],
			marker: [
				"markerEnd",
				"markerMid",
				"markerStart"
			],
			mask: "maskClip maskComposite maskImage maskMode maskOrigin maskPositionX maskPositionY maskRepeat maskSize".split(" "),
			maskPosition: ["maskPositionX", "maskPositionY"],
			outline: [
				"outlineColor",
				"outlineStyle",
				"outlineWidth"
			],
			overflow: ["overflowX", "overflowY"],
			padding: [
				"paddingBottom",
				"paddingLeft",
				"paddingRight",
				"paddingTop"
			],
			placeContent: ["alignContent", "justifyContent"],
			placeItems: ["alignItems", "justifyItems"],
			placeSelf: ["alignSelf", "justifySelf"],
			textDecoration: [
				"textDecorationColor",
				"textDecorationLine",
				"textDecorationStyle"
			],
			textEmphasis: ["textEmphasisColor", "textEmphasisStyle"],
			transition: [
				"transitionDelay",
				"transitionDuration",
				"transitionProperty",
				"transitionTimingFunction"
			],
			wordWrap: ["overflowWrap"]
		}, bm = /([A-Z])/g, xm = /^ms-/, Sm = /^(?:webkit|moz|o)[A-Z]/, Cm = /^-ms-/, wm = /-(.)/g, Tm = /;\s*$/, Em = {}, Dm = {}, Om = !1, km = !1, Am = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" ")), jm = "http://www.w3.org/1998/Math/MathML", Mm = "http://www.w3.org/2000/svg", Nm = new Map([
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
		]), Pm = {
			accept: "accept",
			acceptcharset: "acceptCharset",
			"accept-charset": "acceptCharset",
			accesskey: "accessKey",
			action: "action",
			allowfullscreen: "allowFullScreen",
			alt: "alt",
			as: "as",
			async: "async",
			autocapitalize: "autoCapitalize",
			autocomplete: "autoComplete",
			autocorrect: "autoCorrect",
			autofocus: "autoFocus",
			autoplay: "autoPlay",
			autosave: "autoSave",
			capture: "capture",
			cellpadding: "cellPadding",
			cellspacing: "cellSpacing",
			challenge: "challenge",
			charset: "charSet",
			checked: "checked",
			children: "children",
			cite: "cite",
			class: "className",
			classid: "classID",
			classname: "className",
			cols: "cols",
			colspan: "colSpan",
			content: "content",
			contenteditable: "contentEditable",
			contextmenu: "contextMenu",
			controls: "controls",
			controlslist: "controlsList",
			coords: "coords",
			crossorigin: "crossOrigin",
			dangerouslysetinnerhtml: "dangerouslySetInnerHTML",
			data: "data",
			datetime: "dateTime",
			default: "default",
			defaultchecked: "defaultChecked",
			defaultvalue: "defaultValue",
			defer: "defer",
			dir: "dir",
			disabled: "disabled",
			disablepictureinpicture: "disablePictureInPicture",
			disableremoteplayback: "disableRemotePlayback",
			download: "download",
			draggable: "draggable",
			enctype: "encType",
			enterkeyhint: "enterKeyHint",
			fetchpriority: "fetchPriority",
			for: "htmlFor",
			form: "form",
			formmethod: "formMethod",
			formaction: "formAction",
			formenctype: "formEncType",
			formnovalidate: "formNoValidate",
			formtarget: "formTarget",
			frameborder: "frameBorder",
			headers: "headers",
			height: "height",
			hidden: "hidden",
			high: "high",
			href: "href",
			hreflang: "hrefLang",
			htmlfor: "htmlFor",
			httpequiv: "httpEquiv",
			"http-equiv": "httpEquiv",
			icon: "icon",
			id: "id",
			imagesizes: "imageSizes",
			imagesrcset: "imageSrcSet",
			inert: "inert",
			innerhtml: "innerHTML",
			inputmode: "inputMode",
			integrity: "integrity",
			is: "is",
			itemid: "itemID",
			itemprop: "itemProp",
			itemref: "itemRef",
			itemscope: "itemScope",
			itemtype: "itemType",
			keyparams: "keyParams",
			keytype: "keyType",
			kind: "kind",
			label: "label",
			lang: "lang",
			list: "list",
			loop: "loop",
			low: "low",
			manifest: "manifest",
			marginwidth: "marginWidth",
			marginheight: "marginHeight",
			max: "max",
			maxlength: "maxLength",
			media: "media",
			mediagroup: "mediaGroup",
			method: "method",
			min: "min",
			minlength: "minLength",
			multiple: "multiple",
			muted: "muted",
			name: "name",
			nomodule: "noModule",
			nonce: "nonce",
			novalidate: "noValidate",
			open: "open",
			optimum: "optimum",
			pattern: "pattern",
			placeholder: "placeholder",
			playsinline: "playsInline",
			poster: "poster",
			preload: "preload",
			profile: "profile",
			radiogroup: "radioGroup",
			readonly: "readOnly",
			referrerpolicy: "referrerPolicy",
			rel: "rel",
			required: "required",
			reversed: "reversed",
			role: "role",
			rows: "rows",
			rowspan: "rowSpan",
			sandbox: "sandbox",
			scope: "scope",
			scoped: "scoped",
			scrolling: "scrolling",
			seamless: "seamless",
			selected: "selected",
			shape: "shape",
			size: "size",
			sizes: "sizes",
			span: "span",
			spellcheck: "spellCheck",
			src: "src",
			srcdoc: "srcDoc",
			srclang: "srcLang",
			srcset: "srcSet",
			start: "start",
			step: "step",
			style: "style",
			summary: "summary",
			tabindex: "tabIndex",
			target: "target",
			title: "title",
			type: "type",
			usemap: "useMap",
			value: "value",
			width: "width",
			wmode: "wmode",
			wrap: "wrap",
			about: "about",
			accentheight: "accentHeight",
			"accent-height": "accentHeight",
			accumulate: "accumulate",
			additive: "additive",
			alignmentbaseline: "alignmentBaseline",
			"alignment-baseline": "alignmentBaseline",
			allowreorder: "allowReorder",
			alphabetic: "alphabetic",
			amplitude: "amplitude",
			arabicform: "arabicForm",
			"arabic-form": "arabicForm",
			ascent: "ascent",
			attributename: "attributeName",
			attributetype: "attributeType",
			autoreverse: "autoReverse",
			azimuth: "azimuth",
			basefrequency: "baseFrequency",
			baselineshift: "baselineShift",
			"baseline-shift": "baselineShift",
			baseprofile: "baseProfile",
			bbox: "bbox",
			begin: "begin",
			bias: "bias",
			by: "by",
			calcmode: "calcMode",
			capheight: "capHeight",
			"cap-height": "capHeight",
			clip: "clip",
			clippath: "clipPath",
			"clip-path": "clipPath",
			clippathunits: "clipPathUnits",
			cliprule: "clipRule",
			"clip-rule": "clipRule",
			color: "color",
			colorinterpolation: "colorInterpolation",
			"color-interpolation": "colorInterpolation",
			colorinterpolationfilters: "colorInterpolationFilters",
			"color-interpolation-filters": "colorInterpolationFilters",
			colorprofile: "colorProfile",
			"color-profile": "colorProfile",
			colorrendering: "colorRendering",
			"color-rendering": "colorRendering",
			contentscripttype: "contentScriptType",
			contentstyletype: "contentStyleType",
			cursor: "cursor",
			cx: "cx",
			cy: "cy",
			d: "d",
			datatype: "datatype",
			decelerate: "decelerate",
			descent: "descent",
			diffuseconstant: "diffuseConstant",
			direction: "direction",
			display: "display",
			divisor: "divisor",
			dominantbaseline: "dominantBaseline",
			"dominant-baseline": "dominantBaseline",
			dur: "dur",
			dx: "dx",
			dy: "dy",
			edgemode: "edgeMode",
			elevation: "elevation",
			enablebackground: "enableBackground",
			"enable-background": "enableBackground",
			end: "end",
			exponent: "exponent",
			externalresourcesrequired: "externalResourcesRequired",
			fill: "fill",
			fillopacity: "fillOpacity",
			"fill-opacity": "fillOpacity",
			fillrule: "fillRule",
			"fill-rule": "fillRule",
			filter: "filter",
			filterres: "filterRes",
			filterunits: "filterUnits",
			floodopacity: "floodOpacity",
			"flood-opacity": "floodOpacity",
			floodcolor: "floodColor",
			"flood-color": "floodColor",
			focusable: "focusable",
			fontfamily: "fontFamily",
			"font-family": "fontFamily",
			fontsize: "fontSize",
			"font-size": "fontSize",
			fontsizeadjust: "fontSizeAdjust",
			"font-size-adjust": "fontSizeAdjust",
			fontstretch: "fontStretch",
			"font-stretch": "fontStretch",
			fontstyle: "fontStyle",
			"font-style": "fontStyle",
			fontvariant: "fontVariant",
			"font-variant": "fontVariant",
			fontweight: "fontWeight",
			"font-weight": "fontWeight",
			format: "format",
			from: "from",
			fx: "fx",
			fy: "fy",
			g1: "g1",
			g2: "g2",
			glyphname: "glyphName",
			"glyph-name": "glyphName",
			glyphorientationhorizontal: "glyphOrientationHorizontal",
			"glyph-orientation-horizontal": "glyphOrientationHorizontal",
			glyphorientationvertical: "glyphOrientationVertical",
			"glyph-orientation-vertical": "glyphOrientationVertical",
			glyphref: "glyphRef",
			gradienttransform: "gradientTransform",
			gradientunits: "gradientUnits",
			hanging: "hanging",
			horizadvx: "horizAdvX",
			"horiz-adv-x": "horizAdvX",
			horizoriginx: "horizOriginX",
			"horiz-origin-x": "horizOriginX",
			ideographic: "ideographic",
			imagerendering: "imageRendering",
			"image-rendering": "imageRendering",
			in2: "in2",
			in: "in",
			inlist: "inlist",
			intercept: "intercept",
			k1: "k1",
			k2: "k2",
			k3: "k3",
			k4: "k4",
			k: "k",
			kernelmatrix: "kernelMatrix",
			kernelunitlength: "kernelUnitLength",
			kerning: "kerning",
			keypoints: "keyPoints",
			keysplines: "keySplines",
			keytimes: "keyTimes",
			lengthadjust: "lengthAdjust",
			letterspacing: "letterSpacing",
			"letter-spacing": "letterSpacing",
			lightingcolor: "lightingColor",
			"lighting-color": "lightingColor",
			limitingconeangle: "limitingConeAngle",
			local: "local",
			markerend: "markerEnd",
			"marker-end": "markerEnd",
			markerheight: "markerHeight",
			markermid: "markerMid",
			"marker-mid": "markerMid",
			markerstart: "markerStart",
			"marker-start": "markerStart",
			markerunits: "markerUnits",
			markerwidth: "markerWidth",
			mask: "mask",
			maskcontentunits: "maskContentUnits",
			maskunits: "maskUnits",
			mathematical: "mathematical",
			mode: "mode",
			numoctaves: "numOctaves",
			offset: "offset",
			opacity: "opacity",
			operator: "operator",
			order: "order",
			orient: "orient",
			orientation: "orientation",
			origin: "origin",
			overflow: "overflow",
			overlineposition: "overlinePosition",
			"overline-position": "overlinePosition",
			overlinethickness: "overlineThickness",
			"overline-thickness": "overlineThickness",
			paintorder: "paintOrder",
			"paint-order": "paintOrder",
			panose1: "panose1",
			"panose-1": "panose1",
			pathlength: "pathLength",
			patterncontentunits: "patternContentUnits",
			patterntransform: "patternTransform",
			patternunits: "patternUnits",
			pointerevents: "pointerEvents",
			"pointer-events": "pointerEvents",
			points: "points",
			pointsatx: "pointsAtX",
			pointsaty: "pointsAtY",
			pointsatz: "pointsAtZ",
			popover: "popover",
			popovertarget: "popoverTarget",
			popovertargetaction: "popoverTargetAction",
			prefix: "prefix",
			preservealpha: "preserveAlpha",
			preserveaspectratio: "preserveAspectRatio",
			primitiveunits: "primitiveUnits",
			property: "property",
			r: "r",
			radius: "radius",
			refx: "refX",
			refy: "refY",
			renderingintent: "renderingIntent",
			"rendering-intent": "renderingIntent",
			repeatcount: "repeatCount",
			repeatdur: "repeatDur",
			requiredextensions: "requiredExtensions",
			requiredfeatures: "requiredFeatures",
			resource: "resource",
			restart: "restart",
			result: "result",
			results: "results",
			rotate: "rotate",
			rx: "rx",
			ry: "ry",
			scale: "scale",
			security: "security",
			seed: "seed",
			shaperendering: "shapeRendering",
			"shape-rendering": "shapeRendering",
			slope: "slope",
			spacing: "spacing",
			specularconstant: "specularConstant",
			specularexponent: "specularExponent",
			speed: "speed",
			spreadmethod: "spreadMethod",
			startoffset: "startOffset",
			stddeviation: "stdDeviation",
			stemh: "stemh",
			stemv: "stemv",
			stitchtiles: "stitchTiles",
			stopcolor: "stopColor",
			"stop-color": "stopColor",
			stopopacity: "stopOpacity",
			"stop-opacity": "stopOpacity",
			strikethroughposition: "strikethroughPosition",
			"strikethrough-position": "strikethroughPosition",
			strikethroughthickness: "strikethroughThickness",
			"strikethrough-thickness": "strikethroughThickness",
			string: "string",
			stroke: "stroke",
			strokedasharray: "strokeDasharray",
			"stroke-dasharray": "strokeDasharray",
			strokedashoffset: "strokeDashoffset",
			"stroke-dashoffset": "strokeDashoffset",
			strokelinecap: "strokeLinecap",
			"stroke-linecap": "strokeLinecap",
			strokelinejoin: "strokeLinejoin",
			"stroke-linejoin": "strokeLinejoin",
			strokemiterlimit: "strokeMiterlimit",
			"stroke-miterlimit": "strokeMiterlimit",
			strokewidth: "strokeWidth",
			"stroke-width": "strokeWidth",
			strokeopacity: "strokeOpacity",
			"stroke-opacity": "strokeOpacity",
			suppresscontenteditablewarning: "suppressContentEditableWarning",
			suppresshydrationwarning: "suppressHydrationWarning",
			surfacescale: "surfaceScale",
			systemlanguage: "systemLanguage",
			tablevalues: "tableValues",
			targetx: "targetX",
			targety: "targetY",
			textanchor: "textAnchor",
			"text-anchor": "textAnchor",
			textdecoration: "textDecoration",
			"text-decoration": "textDecoration",
			textlength: "textLength",
			textrendering: "textRendering",
			"text-rendering": "textRendering",
			to: "to",
			transform: "transform",
			transformorigin: "transformOrigin",
			"transform-origin": "transformOrigin",
			typeof: "typeof",
			u1: "u1",
			u2: "u2",
			underlineposition: "underlinePosition",
			"underline-position": "underlinePosition",
			underlinethickness: "underlineThickness",
			"underline-thickness": "underlineThickness",
			unicode: "unicode",
			unicodebidi: "unicodeBidi",
			"unicode-bidi": "unicodeBidi",
			unicoderange: "unicodeRange",
			"unicode-range": "unicodeRange",
			unitsperem: "unitsPerEm",
			"units-per-em": "unitsPerEm",
			unselectable: "unselectable",
			valphabetic: "vAlphabetic",
			"v-alphabetic": "vAlphabetic",
			values: "values",
			vectoreffect: "vectorEffect",
			"vector-effect": "vectorEffect",
			version: "version",
			vertadvy: "vertAdvY",
			"vert-adv-y": "vertAdvY",
			vertoriginx: "vertOriginX",
			"vert-origin-x": "vertOriginX",
			vertoriginy: "vertOriginY",
			"vert-origin-y": "vertOriginY",
			vhanging: "vHanging",
			"v-hanging": "vHanging",
			videographic: "vIdeographic",
			"v-ideographic": "vIdeographic",
			viewbox: "viewBox",
			viewtarget: "viewTarget",
			visibility: "visibility",
			vmathematical: "vMathematical",
			"v-mathematical": "vMathematical",
			vocab: "vocab",
			widths: "widths",
			wordspacing: "wordSpacing",
			"word-spacing": "wordSpacing",
			writingmode: "writingMode",
			"writing-mode": "writingMode",
			x1: "x1",
			x2: "x2",
			x: "x",
			xchannelselector: "xChannelSelector",
			xheight: "xHeight",
			"x-height": "xHeight",
			xlinkactuate: "xlinkActuate",
			"xlink:actuate": "xlinkActuate",
			xlinkarcrole: "xlinkArcrole",
			"xlink:arcrole": "xlinkArcrole",
			xlinkhref: "xlinkHref",
			"xlink:href": "xlinkHref",
			xlinkrole: "xlinkRole",
			"xlink:role": "xlinkRole",
			xlinkshow: "xlinkShow",
			"xlink:show": "xlinkShow",
			xlinktitle: "xlinkTitle",
			"xlink:title": "xlinkTitle",
			xlinktype: "xlinkType",
			"xlink:type": "xlinkType",
			xmlbase: "xmlBase",
			"xml:base": "xmlBase",
			xmllang: "xmlLang",
			"xml:lang": "xmlLang",
			xmlns: "xmlns",
			"xml:space": "xmlSpace",
			xmlnsxlink: "xmlnsXlink",
			"xmlns:xlink": "xmlnsXlink",
			xmlspace: "xmlSpace",
			y1: "y1",
			y2: "y2",
			y: "y",
			ychannelselector: "yChannelSelector",
			z: "z",
			zoomandpan: "zoomAndPan"
		}, Fm = {
			"aria-current": 0,
			"aria-description": 0,
			"aria-details": 0,
			"aria-disabled": 0,
			"aria-hidden": 0,
			"aria-invalid": 0,
			"aria-keyshortcuts": 0,
			"aria-label": 0,
			"aria-roledescription": 0,
			"aria-autocomplete": 0,
			"aria-checked": 0,
			"aria-expanded": 0,
			"aria-haspopup": 0,
			"aria-level": 0,
			"aria-modal": 0,
			"aria-multiline": 0,
			"aria-multiselectable": 0,
			"aria-orientation": 0,
			"aria-placeholder": 0,
			"aria-pressed": 0,
			"aria-readonly": 0,
			"aria-required": 0,
			"aria-selected": 0,
			"aria-sort": 0,
			"aria-valuemax": 0,
			"aria-valuemin": 0,
			"aria-valuenow": 0,
			"aria-valuetext": 0,
			"aria-atomic": 0,
			"aria-busy": 0,
			"aria-live": 0,
			"aria-relevant": 0,
			"aria-dropeffect": 0,
			"aria-grabbed": 0,
			"aria-activedescendant": 0,
			"aria-colcount": 0,
			"aria-colindex": 0,
			"aria-colspan": 0,
			"aria-controls": 0,
			"aria-describedby": 0,
			"aria-errormessage": 0,
			"aria-flowto": 0,
			"aria-labelledby": 0,
			"aria-owns": 0,
			"aria-posinset": 0,
			"aria-rowcount": 0,
			"aria-rowindex": 0,
			"aria-rowspan": 0,
			"aria-setsize": 0,
			"aria-braillelabel": 0,
			"aria-brailleroledescription": 0,
			"aria-colindextext": 0,
			"aria-rowindextext": 0
		}, Im = {}, Lm = RegExp("^(aria)-[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Rm = RegExp("^(aria)[A-Z][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), zm = !1, Bm = {}, Vm = /^on./, Hm = /^on[^A-Z]/, Um = RegExp("^(aria)-[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Wm = RegExp("^(aria)[A-Z][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Gm = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i, Km = null, qm = null, Jm = null, Ym = !1, Xm = !(typeof window > "u" || window.document === void 0 || window.document.createElement === void 0), Zm = !1;
		if (Xm) try {
			var Qm = {};
			Object.defineProperty(Qm, "passive", { get: function() {
				Zm = !0;
			} }), window.addEventListener("test", Qm, Qm), window.removeEventListener("test", Qm, Qm);
		} catch {
			Zm = !1;
		}
		var $m = null, eh = null, th = null, nh = {
			eventPhase: 0,
			bubbles: 0,
			cancelable: 0,
			timeStamp: function(e) {
				return e.timeStamp || Date.now();
			},
			defaultPrevented: 0,
			isTrusted: 0
		}, rh = ln(nh), ih = W({}, nh, {
			view: 0,
			detail: 0
		}), ah = ln(ih), oh, sh, ch, lh = W({}, ih, {
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
			getModifierState: dn,
			button: 0,
			buttons: 0,
			relatedTarget: function(e) {
				return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
			},
			movementX: function(e) {
				return "movementX" in e ? e.movementX : (e !== ch && (ch && e.type === "mousemove" ? (oh = e.screenX - ch.screenX, sh = e.screenY - ch.screenY) : sh = oh = 0, ch = e), oh);
			},
			movementY: function(e) {
				return "movementY" in e ? e.movementY : sh;
			}
		}), uh = ln(lh), dh = ln(W({}, lh, { dataTransfer: 0 })), fh = ln(W({}, ih, { relatedTarget: 0 })), ph = ln(W({}, nh, {
			animationName: 0,
			elapsedTime: 0,
			pseudoElement: 0
		})), mh = ln(W({}, nh, { clipboardData: function(e) {
			return "clipboardData" in e ? e.clipboardData : window.clipboardData;
		} })), hh = ln(W({}, nh, { data: 0 })), gh = hh, _h = {
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
		}, vh = {
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
		}, yh = {
			Alt: "altKey",
			Control: "ctrlKey",
			Meta: "metaKey",
			Shift: "shiftKey"
		}, bh = ln(W({}, ih, {
			key: function(e) {
				if (e.key) {
					var t = _h[e.key] || e.key;
					if (t !== "Unidentified") return t;
				}
				return e.type === "keypress" ? (e = L(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? vh[e.keyCode] || "Unidentified" : "";
			},
			code: 0,
			location: 0,
			ctrlKey: 0,
			shiftKey: 0,
			altKey: 0,
			metaKey: 0,
			repeat: 0,
			locale: 0,
			getModifierState: dn,
			charCode: function(e) {
				return e.type === "keypress" ? L(e) : 0;
			},
			keyCode: function(e) {
				return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
			},
			which: function(e) {
				return e.type === "keypress" ? L(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
			}
		})), xh = ln(W({}, lh, {
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
		})), Sh = ln(W({}, ih, {
			touches: 0,
			targetTouches: 0,
			changedTouches: 0,
			altKey: 0,
			metaKey: 0,
			ctrlKey: 0,
			shiftKey: 0,
			getModifierState: dn
		})), Ch = ln(W({}, nh, {
			propertyName: 0,
			elapsedTime: 0,
			pseudoElement: 0
		})), wh = ln(W({}, lh, {
			deltaX: function(e) {
				return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
			},
			deltaY: function(e) {
				return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
			},
			deltaZ: 0,
			deltaMode: 0
		})), Th = ln(W({}, nh, {
			newState: 0,
			oldState: 0
		})), Eh = [
			9,
			13,
			27,
			32
		], Dh = 229, Oh = Xm && "CompositionEvent" in window, kh = null;
		Xm && "documentMode" in document && (kh = document.documentMode);
		var Ah = Xm && "TextEvent" in window && !kh, jh = Xm && (!Oh || kh && 8 < kh && 11 >= kh), Mh = 32, Nh = String.fromCharCode(Mh), Ph = !1, Fh = !1, Ih = {
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
		}, Lh = null, Rh = null, zh = !1;
		Xm && (zh = _n("input") && (!document.documentMode || 9 < document.documentMode));
		var Bh = typeof Object.is == "function" ? Object.is : On, Vh = Xm && "documentMode" in document && 11 >= document.documentMode, Hh = null, Uh = null, Wh = null, Gh = !1, Kh = {
			animationend: In("Animation", "AnimationEnd"),
			animationiteration: In("Animation", "AnimationIteration"),
			animationstart: In("Animation", "AnimationStart"),
			transitionrun: In("Transition", "TransitionRun"),
			transitionstart: In("Transition", "TransitionStart"),
			transitioncancel: In("Transition", "TransitionCancel"),
			transitionend: In("Transition", "TransitionEnd")
		}, qh = {}, Jh = {};
		Xm && (Jh = document.createElement("div").style, "AnimationEvent" in window || (delete Kh.animationend.animation, delete Kh.animationiteration.animation, delete Kh.animationstart.animation), "TransitionEvent" in window || delete Kh.transitionend.transition);
		var Yh = Ln("animationend"), Xh = Ln("animationiteration"), Zh = Ln("animationstart"), Qh = Ln("transitionrun"), $h = Ln("transitionstart"), eg = Ln("transitioncancel"), tg = Ln("transitionend"), ng = /* @__PURE__ */ new Map(), rg = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
		rg.push("scrollEnd");
		var ig = 0;
		if (typeof performance == "object" && typeof performance.now == "function") var ag = performance, og = function() {
			return ag.now();
		};
		else {
			var sg = Date;
			og = function() {
				return sg.now();
			};
		}
		var cg = typeof reportError == "function" ? reportError : function(e) {
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
		}, lg = "This object has been omitted by React in the console log to avoid sending too much data from the server. Try logging smaller or more specific objects.", ug = 0, dg = 1, fg = 2, pg = 3, mg = "–\xA0", hg = "+\xA0", gg = " \xA0", _g = typeof console < "u" && typeof console.timeStamp == "function" && typeof performance < "u" && typeof performance.measure == "function", vg = "Components ⚛", yg = "Scheduler ⚛", bg = "Blocking", xg = !1, Sg = {
			color: "primary",
			properties: null,
			tooltipText: "",
			track: vg
		}, Cg = {
			start: -0,
			end: -0,
			detail: { devtools: Sg }
		}, wg = ["Changed Props", ""], Tg = "This component received deeply equal props. It might benefit from useMemo or the React Compiler in its owner.", Eg = ["Changed Props", Tg], Dg = 1, Og = 2, kg = [], Ag = 0, jg = 0, Mg = {};
		Object.freeze(Mg);
		var Ng = null, Pg = null, K = 0, Fg = 1, q = 2, Ig = 8, Lg = 16, Rg = 32, zg = !1;
		try {
			var Bg = Object.preventExtensions({});
			new Map([[Bg, null]]), new Set([Bg]);
		} catch {
			zg = !0;
		}
		var Vg = /* @__PURE__ */ new WeakMap(), Hg = [], Ug = 0, Wg = null, Gg = 0, Kg = [], qg = 0, Jg = null, Yg = 1, Xg = "", Zg = null, Qg = null, $g = !1, e_ = !1, t_ = null, n_ = null, r_ = !1, i_ = Error("Hydration Mismatch Exception: This is not a real error, and should not leak into userspace. If you're seeing this, it's likely a bug in React."), a_ = E(null), o_ = E(null), s_ = {}, c_ = null, l_ = null, u_ = !1, d_ = typeof AbortController < "u" ? AbortController : function() {
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
		}, f_ = Cf.unstable_scheduleCallback, p_ = Cf.unstable_NormalPriority, m_ = {
			$$typeof: Nf,
			Consumer: null,
			Provider: null,
			_currentValue: null,
			_currentValue2: null,
			_threadCount: 0,
			_currentRenderer: null,
			_currentRenderer2: null
		}, h_ = Cf.unstable_now, g_ = console.createTask ? console.createTask : function() {
			return null;
		}, __ = 1, v_ = 2, y_ = -0, b_ = -0, x_ = -0, S_ = null, C_ = -1.1, w_ = -0, T_ = -0, J = -1.1, Y = -1.1, E_ = null, D_ = !1, O_ = -0, k_ = -1.1, A_ = null, j_ = 0, M_ = null, N_ = null, P_ = -1.1, F_ = null, I_ = -1.1, L_ = -1.1, R_ = -0, z_ = -1.1, B_ = -1.1, V_ = 0, H_ = null, U_ = null, W_ = null, G_ = -1.1, K_ = null, q_ = -1.1, J_ = -1.1, Y_ = -0, X_ = -0, Z_ = 0, Q_ = null, $_ = 0, ev = -1.1, tv = !1, nv = !1, rv = null, iv = 0, av = 0, ov = null, sv = G.S;
		G.S = function(e, t) {
			if (vx = vp(), typeof t == "object" && t && typeof t.then == "function") {
				if (0 > z_ && 0 > B_) {
					z_ = h_();
					var n = Hu(), r = Vu();
					(n !== q_ || r !== K_) && (q_ = -1.1), G_ = n, K_ = r;
				}
				Si(e, t);
			}
			sv !== null && sv(e, t);
		};
		var cv = E(null), lv = {
			recordUnsafeLifecycleWarnings: function() {},
			flushPendingUnsafeLifecycleWarnings: function() {},
			recordLegacyContextWarning: function() {},
			flushLegacyContextWarning: function() {},
			discardPendingWarnings: function() {}
		}, uv = [], dv = [], fv = [], pv = [], mv = [], hv = [], gv = /* @__PURE__ */ new Set();
		lv.recordUnsafeLifecycleWarnings = function(e, t) {
			gv.has(e.type) || (typeof t.componentWillMount == "function" && !0 !== t.componentWillMount.__suppressDeprecationWarning && uv.push(e), e.mode & Ig && typeof t.UNSAFE_componentWillMount == "function" && dv.push(e), typeof t.componentWillReceiveProps == "function" && !0 !== t.componentWillReceiveProps.__suppressDeprecationWarning && fv.push(e), e.mode & Ig && typeof t.UNSAFE_componentWillReceiveProps == "function" && pv.push(e), typeof t.componentWillUpdate == "function" && !0 !== t.componentWillUpdate.__suppressDeprecationWarning && mv.push(e), e.mode & Ig && typeof t.UNSAFE_componentWillUpdate == "function" && hv.push(e));
		}, lv.flushPendingUnsafeLifecycleWarnings = function() {
			var e = /* @__PURE__ */ new Set();
			0 < uv.length && (uv.forEach(function(t) {
				e.add(T(t) || "Component"), gv.add(t.type);
			}), uv = []);
			var t = /* @__PURE__ */ new Set();
			0 < dv.length && (dv.forEach(function(e) {
				t.add(T(e) || "Component"), gv.add(e.type);
			}), dv = []);
			var n = /* @__PURE__ */ new Set();
			0 < fv.length && (fv.forEach(function(e) {
				n.add(T(e) || "Component"), gv.add(e.type);
			}), fv = []);
			var r = /* @__PURE__ */ new Set();
			0 < pv.length && (pv.forEach(function(e) {
				r.add(T(e) || "Component"), gv.add(e.type);
			}), pv = []);
			var i = /* @__PURE__ */ new Set();
			0 < mv.length && (mv.forEach(function(e) {
				i.add(T(e) || "Component"), gv.add(e.type);
			}), mv = []);
			var a = /* @__PURE__ */ new Set();
			if (0 < hv.length && (hv.forEach(function(e) {
				a.add(T(e) || "Component"), gv.add(e.type);
			}), hv = []), 0 < t.size) {
				var o = p(t);
				console.error("Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. See https://react.dev/link/unsafe-component-lifecycles for details.\n\n* Move code with side effects to componentDidMount, and set initial state in the constructor.\n\nPlease update the following components: %s", o);
			}
			0 < r.size && (o = p(r), console.error("Using UNSAFE_componentWillReceiveProps in strict mode is not recommended and may indicate bugs in your code. See https://react.dev/link/unsafe-component-lifecycles for details.\n\n* Move data fetching code or side effects to componentDidUpdate.\n* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://react.dev/link/derived-state\n\nPlease update the following components: %s", o)), 0 < a.size && (o = p(a), console.error("Using UNSAFE_componentWillUpdate in strict mode is not recommended and may indicate bugs in your code. See https://react.dev/link/unsafe-component-lifecycles for details.\n\n* Move data fetching code or side effects to componentDidUpdate.\n\nPlease update the following components: %s", o)), 0 < e.size && (o = p(e), console.warn("componentWillMount has been renamed, and is not recommended for use. See https://react.dev/link/unsafe-component-lifecycles for details.\n\n* Move code with side effects to componentDidMount, and set initial state in the constructor.\n* Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run `npx react-codemod rename-unsafe-lifecycles` in your project source folder.\n\nPlease update the following components: %s", o)), 0 < n.size && (o = p(n), console.warn("componentWillReceiveProps has been renamed, and is not recommended for use. See https://react.dev/link/unsafe-component-lifecycles for details.\n\n* Move data fetching code or side effects to componentDidUpdate.\n* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://react.dev/link/derived-state\n* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run `npx react-codemod rename-unsafe-lifecycles` in your project source folder.\n\nPlease update the following components: %s", o)), 0 < i.size && (o = p(i), console.warn("componentWillUpdate has been renamed, and is not recommended for use. See https://react.dev/link/unsafe-component-lifecycles for details.\n\n* Move data fetching code or side effects to componentDidUpdate.\n* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run `npx react-codemod rename-unsafe-lifecycles` in your project source folder.\n\nPlease update the following components: %s", o));
		};
		var _v = /* @__PURE__ */ new Map(), vv = /* @__PURE__ */ new Set();
		lv.recordLegacyContextWarning = function(e, t) {
			for (var n = null, r = e; r !== null;) r.mode & Ig && (n = r), r = r.return;
			n === null ? console.error("Expected to find a StrictMode component in a strict mode tree. This error is likely caused by a bug in React. Please file an issue.") : !vv.has(e.type) && (r = _v.get(n), e.type.contextTypes != null || e.type.childContextTypes != null || t !== null && typeof t.getChildContext == "function") && (r === void 0 && (r = [], _v.set(n, r)), r.push(e));
		}, lv.flushLegacyContextWarning = function() {
			_v.forEach(function(e) {
				if (e.length !== 0) {
					var t = e[0], n = /* @__PURE__ */ new Set();
					e.forEach(function(e) {
						n.add(T(e) || "Component"), vv.add(e.type);
					});
					var r = p(n);
					N(t, function() {
						console.error("Legacy context API has been detected within a strict-mode tree.\n\nThe old API will be supported in all 16.x releases, but applications using it should migrate to the new version.\n\nPlease update the following components: %s\n\nLearn more about this warning here: https://react.dev/link/legacy-context", r);
					});
				}
			});
		}, lv.discardPendingWarnings = function() {
			uv = [], dv = [], fv = [], pv = [], mv = [], hv = [], _v = /* @__PURE__ */ new Map();
		};
		var yv = { react_stack_bottom_frame: function(e, t, n) {
			var r = fp;
			fp = !0;
			try {
				return e(t, n);
			} finally {
				fp = r;
			}
		} }, bv = yv.react_stack_bottom_frame.bind(yv), xv = { react_stack_bottom_frame: function(e) {
			var t = fp;
			fp = !0;
			try {
				return e.render();
			} finally {
				fp = t;
			}
		} }, Sv = xv.react_stack_bottom_frame.bind(xv), Cv = { react_stack_bottom_frame: function(e, t) {
			try {
				t.componentDidMount();
			} catch (t) {
				Ml(e, e.return, t);
			}
		} }, wv = Cv.react_stack_bottom_frame.bind(Cv), Tv = { react_stack_bottom_frame: function(e, t, n, r, i) {
			try {
				t.componentDidUpdate(n, r, i);
			} catch (t) {
				Ml(e, e.return, t);
			}
		} }, Ev = Tv.react_stack_bottom_frame.bind(Tv), Dv = { react_stack_bottom_frame: function(e, t) {
			var n = t.stack;
			e.componentDidCatch(t.value, { componentStack: n === null ? "" : n });
		} }, Ov = Dv.react_stack_bottom_frame.bind(Dv), kv = { react_stack_bottom_frame: function(e, t, n) {
			try {
				n.componentWillUnmount();
			} catch (n) {
				Ml(e, t, n);
			}
		} }, Av = kv.react_stack_bottom_frame.bind(kv), jv = { react_stack_bottom_frame: function(e) {
			var t = e.create;
			return e = e.inst, t = t(), e.destroy = t;
		} }, Mv = jv.react_stack_bottom_frame.bind(jv), Nv = { react_stack_bottom_frame: function(e, t, n) {
			try {
				n();
			} catch (n) {
				Ml(e, t, n);
			}
		} }, Pv = Nv.react_stack_bottom_frame.bind(Nv), Fv = { react_stack_bottom_frame: function(e) {
			var t = e._init;
			return t(e._payload);
		} }, Iv = Fv.react_stack_bottom_frame.bind(Fv), Lv = Error("Suspense Exception: This is not a real error! It's an implementation detail of `use` to interrupt the current render. You must either rethrow it immediately, or move the `use` call outside of the `try/catch` block. Capturing without rethrowing will lead to unexpected behavior.\n\nTo handle async errors, wrap your component in an error boundary, or call the promise's `.catch` method and pass the result to `use`."), Rv = Error("Suspense Exception: This is not a real error, and should not leak into userspace. If you're seeing this, it's likely a bug in React."), zv = Error("Suspense Exception: This is not a real error! It's an implementation detail of `useActionState` to interrupt the current render. You must either rethrow it immediately, or move the `useActionState` call outside of the `try/catch` block. Capturing without rethrowing will lead to unexpected behavior.\n\nTo handle async errors, wrap your component in an error boundary."), Bv = { then: function() {
			console.error("Internal React error: A listener was unexpectedly attached to a \"noop\" thenable. This is a bug in React. Please file an issue.");
		} }, Vv = null, Hv = !1, Uv = null, Wv = 0, X = null, Gv, Kv = Gv = !1, qv = {}, Jv = {}, Yv = {};
		f = function(e, t, n) {
			if (typeof n == "object" && n && n._store && (!n._store.validated && n.key == null || n._store.validated === 2)) {
				if (typeof n._store != "object") throw Error("React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.");
				n._store.validated = 1;
				var r = T(e), i = r || "null";
				if (!qv[i]) {
					qv[i] = !0, n = n._owner, e = e._debugOwner;
					var a = "";
					e && typeof e.tag == "number" && (i = T(e)) && (a = "\n\nCheck the render method of `" + i + "`."), a || r && (a = "\n\nCheck the top-level render call using <" + r + ">.");
					var o = "";
					n != null && e !== n && (r = null, typeof n.tag == "number" ? r = T(n) : typeof n.name == "string" && (r = n.name), r && (o = " It was passed a child from " + r + ".")), N(t, function() {
						console.error("Each child in a list should have a unique \"key\" prop.%s%s See https://react.dev/link/warning-keys for more information.", a, o);
					});
				}
			}
		};
		var Xv = Gi(!0), Zv = Gi(!1), Qv = 0, $v = 1, ey = 2, ty = 3, ny = !1, ry = !1, iy = null, ay = !1, oy = E(null), sy = E(0), cy = E(null), ly = null, uy = 1, dy = 2, fy = E(0), py = 0, my = 1, hy = 2, gy = 4, _y = 8, vy, yy = /* @__PURE__ */ new Set(), by = /* @__PURE__ */ new Set(), xy = /* @__PURE__ */ new Set(), Sy = /* @__PURE__ */ new Set(), Cy = 0, Z = null, wy = null, Ty = null, Ey = !1, Dy = !1, Oy = !1, ky = 0, Ay = 0, jy = null, My = 0, Ny = 25, Q = null, Py = null, Fy = -1, Iy = !1, Ly = {
			readContext: Zr,
			use: Oa,
			useCallback: ha,
			useContext: ha,
			useEffect: ha,
			useImperativeHandle: ha,
			useLayoutEffect: ha,
			useInsertionEffect: ha,
			useMemo: ha,
			useReducer: ha,
			useRef: ha,
			useState: ha,
			useDebugValue: ha,
			useDeferredValue: ha,
			useTransition: ha,
			useSyncExternalStore: ha,
			useId: ha,
			useHostTransitionStatus: ha,
			useFormState: ha,
			useActionState: ha,
			useOptimistic: ha,
			useMemoCache: ha,
			useCacheRefresh: ha
		};
		Ly.useEffectEvent = ha;
		var Ry = null, zy = null, By = null, Vy = null, Hy = null, Uy = null, Wy = null;
		Ry = {
			readContext: function(e) {
				return Zr(e);
			},
			use: Oa,
			useCallback: function(e, t) {
				return Q = "useCallback", R(), pa(t), vo(e, t);
			},
			useContext: function(e) {
				return Q = "useContext", R(), Zr(e);
			},
			useEffect: function(e, t) {
				return Q = "useEffect", R(), pa(t), uo(e, t);
			},
			useImperativeHandle: function(e, t, n) {
				return Q = "useImperativeHandle", R(), pa(n), go(e, t, n);
			},
			useInsertionEffect: function(e, t) {
				Q = "useInsertionEffect", R(), pa(t), co(4, hy, e, t);
			},
			useLayoutEffect: function(e, t) {
				return Q = "useLayoutEffect", R(), pa(t), mo(e, t);
			},
			useMemo: function(e, t) {
				Q = "useMemo", R(), pa(t);
				var n = G.H;
				G.H = Hy;
				try {
					return bo(e, t);
				} finally {
					G.H = n;
				}
			},
			useReducer: function(e, t, n) {
				Q = "useReducer", R();
				var r = G.H;
				G.H = Hy;
				try {
					return ja(e, t, n);
				} finally {
					G.H = r;
				}
			},
			useRef: function(e) {
				return Q = "useRef", R(), so(e);
			},
			useState: function(e) {
				Q = "useState", R();
				var t = G.H;
				G.H = Hy;
				try {
					return Ua(e);
				} finally {
					G.H = t;
				}
			},
			useDebugValue: function() {
				Q = "useDebugValue", R();
			},
			useDeferredValue: function(e, t) {
				return Q = "useDeferredValue", R(), So(e, t);
			},
			useTransition: function() {
				return Q = "useTransition", R(), Mo();
			},
			useSyncExternalStore: function(e, t, n) {
				return Q = "useSyncExternalStore", R(), Fa(e, t, n);
			},
			useId: function() {
				return Q = "useId", R(), Io();
			},
			useFormState: function(e, t) {
				return Q = "useFormState", R(), ma(), to(e, t);
			},
			useActionState: function(e, t) {
				return Q = "useActionState", R(), to(e, t);
			},
			useOptimistic: function(e) {
				return Q = "useOptimistic", R(), Wa(e);
			},
			useHostTransitionStatus: Fo,
			useMemoCache: ka,
			useCacheRefresh: function() {
				return Q = "useCacheRefresh", R(), Lo();
			},
			useEffectEvent: function(e) {
				return Q = "useEffectEvent", R(), po(e);
			}
		}, zy = {
			readContext: function(e) {
				return Zr(e);
			},
			use: Oa,
			useCallback: function(e, t) {
				return Q = "useCallback", z(), vo(e, t);
			},
			useContext: function(e) {
				return Q = "useContext", z(), Zr(e);
			},
			useEffect: function(e, t) {
				return Q = "useEffect", z(), uo(e, t);
			},
			useImperativeHandle: function(e, t, n) {
				return Q = "useImperativeHandle", z(), go(e, t, n);
			},
			useInsertionEffect: function(e, t) {
				Q = "useInsertionEffect", z(), co(4, hy, e, t);
			},
			useLayoutEffect: function(e, t) {
				return Q = "useLayoutEffect", z(), mo(e, t);
			},
			useMemo: function(e, t) {
				Q = "useMemo", z();
				var n = G.H;
				G.H = Hy;
				try {
					return bo(e, t);
				} finally {
					G.H = n;
				}
			},
			useReducer: function(e, t, n) {
				Q = "useReducer", z();
				var r = G.H;
				G.H = Hy;
				try {
					return ja(e, t, n);
				} finally {
					G.H = r;
				}
			},
			useRef: function(e) {
				return Q = "useRef", z(), so(e);
			},
			useState: function(e) {
				Q = "useState", z();
				var t = G.H;
				G.H = Hy;
				try {
					return Ua(e);
				} finally {
					G.H = t;
				}
			},
			useDebugValue: function() {
				Q = "useDebugValue", z();
			},
			useDeferredValue: function(e, t) {
				return Q = "useDeferredValue", z(), So(e, t);
			},
			useTransition: function() {
				return Q = "useTransition", z(), Mo();
			},
			useSyncExternalStore: function(e, t, n) {
				return Q = "useSyncExternalStore", z(), Fa(e, t, n);
			},
			useId: function() {
				return Q = "useId", z(), Io();
			},
			useActionState: function(e, t) {
				return Q = "useActionState", z(), to(e, t);
			},
			useFormState: function(e, t) {
				return Q = "useFormState", z(), ma(), to(e, t);
			},
			useOptimistic: function(e) {
				return Q = "useOptimistic", z(), Wa(e);
			},
			useHostTransitionStatus: Fo,
			useMemoCache: ka,
			useCacheRefresh: function() {
				return Q = "useCacheRefresh", z(), Lo();
			},
			useEffectEvent: function(e) {
				return Q = "useEffectEvent", z(), po(e);
			}
		}, By = {
			readContext: function(e) {
				return Zr(e);
			},
			use: Oa,
			useCallback: function(e, t) {
				return Q = "useCallback", z(), yo(e, t);
			},
			useContext: function(e) {
				return Q = "useContext", z(), Zr(e);
			},
			useEffect: function(e, t) {
				Q = "useEffect", z(), lo(2048, _y, e, t);
			},
			useImperativeHandle: function(e, t, n) {
				return Q = "useImperativeHandle", z(), _o(e, t, n);
			},
			useInsertionEffect: function(e, t) {
				return Q = "useInsertionEffect", z(), lo(4, hy, e, t);
			},
			useLayoutEffect: function(e, t) {
				return Q = "useLayoutEffect", z(), lo(4, gy, e, t);
			},
			useMemo: function(e, t) {
				Q = "useMemo", z();
				var n = G.H;
				G.H = Uy;
				try {
					return xo(e, t);
				} finally {
					G.H = n;
				}
			},
			useReducer: function(e, t, n) {
				Q = "useReducer", z();
				var r = G.H;
				G.H = Uy;
				try {
					return Ma(e, t, n);
				} finally {
					G.H = r;
				}
			},
			useRef: function() {
				return Q = "useRef", z(), Ta().memoizedState;
			},
			useState: function() {
				Q = "useState", z();
				var e = G.H;
				G.H = Uy;
				try {
					return Ma(Aa);
				} finally {
					G.H = e;
				}
			},
			useDebugValue: function() {
				Q = "useDebugValue", z();
			},
			useDeferredValue: function(e, t) {
				return Q = "useDeferredValue", z(), Co(e, t);
			},
			useTransition: function() {
				return Q = "useTransition", z(), No();
			},
			useSyncExternalStore: function(e, t, n) {
				return Q = "useSyncExternalStore", z(), Ia(e, t, n);
			},
			useId: function() {
				return Q = "useId", z(), Ta().memoizedState;
			},
			useFormState: function(e) {
				return Q = "useFormState", z(), ma(), no(e);
			},
			useActionState: function(e) {
				return Q = "useActionState", z(), no(e);
			},
			useOptimistic: function(e, t) {
				return Q = "useOptimistic", z(), Ga(e, t);
			},
			useHostTransitionStatus: Fo,
			useMemoCache: ka,
			useCacheRefresh: function() {
				return Q = "useCacheRefresh", z(), Ta().memoizedState;
			},
			useEffectEvent: function(e) {
				return Q = "useEffectEvent", z(), B(e);
			}
		}, Vy = {
			readContext: function(e) {
				return Zr(e);
			},
			use: Oa,
			useCallback: function(e, t) {
				return Q = "useCallback", z(), yo(e, t);
			},
			useContext: function(e) {
				return Q = "useContext", z(), Zr(e);
			},
			useEffect: function(e, t) {
				Q = "useEffect", z(), lo(2048, _y, e, t);
			},
			useImperativeHandle: function(e, t, n) {
				return Q = "useImperativeHandle", z(), _o(e, t, n);
			},
			useInsertionEffect: function(e, t) {
				return Q = "useInsertionEffect", z(), lo(4, hy, e, t);
			},
			useLayoutEffect: function(e, t) {
				return Q = "useLayoutEffect", z(), lo(4, gy, e, t);
			},
			useMemo: function(e, t) {
				Q = "useMemo", z();
				var n = G.H;
				G.H = Wy;
				try {
					return xo(e, t);
				} finally {
					G.H = n;
				}
			},
			useReducer: function(e, t, n) {
				Q = "useReducer", z();
				var r = G.H;
				G.H = Wy;
				try {
					return Pa(e, t, n);
				} finally {
					G.H = r;
				}
			},
			useRef: function() {
				return Q = "useRef", z(), Ta().memoizedState;
			},
			useState: function() {
				Q = "useState", z();
				var e = G.H;
				G.H = Wy;
				try {
					return Pa(Aa);
				} finally {
					G.H = e;
				}
			},
			useDebugValue: function() {
				Q = "useDebugValue", z();
			},
			useDeferredValue: function(e, t) {
				return Q = "useDeferredValue", z(), wo(e, t);
			},
			useTransition: function() {
				return Q = "useTransition", z(), Po();
			},
			useSyncExternalStore: function(e, t, n) {
				return Q = "useSyncExternalStore", z(), Ia(e, t, n);
			},
			useId: function() {
				return Q = "useId", z(), Ta().memoizedState;
			},
			useFormState: function(e) {
				return Q = "useFormState", z(), ma(), ao(e);
			},
			useActionState: function(e) {
				return Q = "useActionState", z(), ao(e);
			},
			useOptimistic: function(e, t) {
				return Q = "useOptimistic", z(), qa(e, t);
			},
			useHostTransitionStatus: Fo,
			useMemoCache: ka,
			useCacheRefresh: function() {
				return Q = "useCacheRefresh", z(), Ta().memoizedState;
			},
			useEffectEvent: function(e) {
				return Q = "useEffectEvent", z(), B(e);
			}
		}, Hy = {
			readContext: function(e) {
				return l(), Zr(e);
			},
			use: function(e) {
				return c(), Oa(e);
			},
			useCallback: function(e, t) {
				return Q = "useCallback", c(), R(), vo(e, t);
			},
			useContext: function(e) {
				return Q = "useContext", c(), R(), Zr(e);
			},
			useEffect: function(e, t) {
				return Q = "useEffect", c(), R(), uo(e, t);
			},
			useImperativeHandle: function(e, t, n) {
				return Q = "useImperativeHandle", c(), R(), go(e, t, n);
			},
			useInsertionEffect: function(e, t) {
				Q = "useInsertionEffect", c(), R(), co(4, hy, e, t);
			},
			useLayoutEffect: function(e, t) {
				return Q = "useLayoutEffect", c(), R(), mo(e, t);
			},
			useMemo: function(e, t) {
				Q = "useMemo", c(), R();
				var n = G.H;
				G.H = Hy;
				try {
					return bo(e, t);
				} finally {
					G.H = n;
				}
			},
			useReducer: function(e, t, n) {
				Q = "useReducer", c(), R();
				var r = G.H;
				G.H = Hy;
				try {
					return ja(e, t, n);
				} finally {
					G.H = r;
				}
			},
			useRef: function(e) {
				return Q = "useRef", c(), R(), so(e);
			},
			useState: function(e) {
				Q = "useState", c(), R();
				var t = G.H;
				G.H = Hy;
				try {
					return Ua(e);
				} finally {
					G.H = t;
				}
			},
			useDebugValue: function() {
				Q = "useDebugValue", c(), R();
			},
			useDeferredValue: function(e, t) {
				return Q = "useDeferredValue", c(), R(), So(e, t);
			},
			useTransition: function() {
				return Q = "useTransition", c(), R(), Mo();
			},
			useSyncExternalStore: function(e, t, n) {
				return Q = "useSyncExternalStore", c(), R(), Fa(e, t, n);
			},
			useId: function() {
				return Q = "useId", c(), R(), Io();
			},
			useFormState: function(e, t) {
				return Q = "useFormState", c(), R(), to(e, t);
			},
			useActionState: function(e, t) {
				return Q = "useActionState", c(), R(), to(e, t);
			},
			useOptimistic: function(e) {
				return Q = "useOptimistic", c(), R(), Wa(e);
			},
			useMemoCache: function(e) {
				return c(), ka(e);
			},
			useHostTransitionStatus: Fo,
			useCacheRefresh: function() {
				return Q = "useCacheRefresh", R(), Lo();
			},
			useEffectEvent: function(e) {
				return Q = "useEffectEvent", c(), R(), po(e);
			}
		}, Uy = {
			readContext: function(e) {
				return l(), Zr(e);
			},
			use: function(e) {
				return c(), Oa(e);
			},
			useCallback: function(e, t) {
				return Q = "useCallback", c(), z(), yo(e, t);
			},
			useContext: function(e) {
				return Q = "useContext", c(), z(), Zr(e);
			},
			useEffect: function(e, t) {
				Q = "useEffect", c(), z(), lo(2048, _y, e, t);
			},
			useImperativeHandle: function(e, t, n) {
				return Q = "useImperativeHandle", c(), z(), _o(e, t, n);
			},
			useInsertionEffect: function(e, t) {
				return Q = "useInsertionEffect", c(), z(), lo(4, hy, e, t);
			},
			useLayoutEffect: function(e, t) {
				return Q = "useLayoutEffect", c(), z(), lo(4, gy, e, t);
			},
			useMemo: function(e, t) {
				Q = "useMemo", c(), z();
				var n = G.H;
				G.H = Uy;
				try {
					return xo(e, t);
				} finally {
					G.H = n;
				}
			},
			useReducer: function(e, t, n) {
				Q = "useReducer", c(), z();
				var r = G.H;
				G.H = Uy;
				try {
					return Ma(e, t, n);
				} finally {
					G.H = r;
				}
			},
			useRef: function() {
				return Q = "useRef", c(), z(), Ta().memoizedState;
			},
			useState: function() {
				Q = "useState", c(), z();
				var e = G.H;
				G.H = Uy;
				try {
					return Ma(Aa);
				} finally {
					G.H = e;
				}
			},
			useDebugValue: function() {
				Q = "useDebugValue", c(), z();
			},
			useDeferredValue: function(e, t) {
				return Q = "useDeferredValue", c(), z(), Co(e, t);
			},
			useTransition: function() {
				return Q = "useTransition", c(), z(), No();
			},
			useSyncExternalStore: function(e, t, n) {
				return Q = "useSyncExternalStore", c(), z(), Ia(e, t, n);
			},
			useId: function() {
				return Q = "useId", c(), z(), Ta().memoizedState;
			},
			useFormState: function(e) {
				return Q = "useFormState", c(), z(), no(e);
			},
			useActionState: function(e) {
				return Q = "useActionState", c(), z(), no(e);
			},
			useOptimistic: function(e, t) {
				return Q = "useOptimistic", c(), z(), Ga(e, t);
			},
			useMemoCache: function(e) {
				return c(), ka(e);
			},
			useHostTransitionStatus: Fo,
			useCacheRefresh: function() {
				return Q = "useCacheRefresh", z(), Ta().memoizedState;
			},
			useEffectEvent: function(e) {
				return Q = "useEffectEvent", c(), z(), B(e);
			}
		}, Wy = {
			readContext: function(e) {
				return l(), Zr(e);
			},
			use: function(e) {
				return c(), Oa(e);
			},
			useCallback: function(e, t) {
				return Q = "useCallback", c(), z(), yo(e, t);
			},
			useContext: function(e) {
				return Q = "useContext", c(), z(), Zr(e);
			},
			useEffect: function(e, t) {
				Q = "useEffect", c(), z(), lo(2048, _y, e, t);
			},
			useImperativeHandle: function(e, t, n) {
				return Q = "useImperativeHandle", c(), z(), _o(e, t, n);
			},
			useInsertionEffect: function(e, t) {
				return Q = "useInsertionEffect", c(), z(), lo(4, hy, e, t);
			},
			useLayoutEffect: function(e, t) {
				return Q = "useLayoutEffect", c(), z(), lo(4, gy, e, t);
			},
			useMemo: function(e, t) {
				Q = "useMemo", c(), z();
				var n = G.H;
				G.H = Uy;
				try {
					return xo(e, t);
				} finally {
					G.H = n;
				}
			},
			useReducer: function(e, t, n) {
				Q = "useReducer", c(), z();
				var r = G.H;
				G.H = Uy;
				try {
					return Pa(e, t, n);
				} finally {
					G.H = r;
				}
			},
			useRef: function() {
				return Q = "useRef", c(), z(), Ta().memoizedState;
			},
			useState: function() {
				Q = "useState", c(), z();
				var e = G.H;
				G.H = Uy;
				try {
					return Pa(Aa);
				} finally {
					G.H = e;
				}
			},
			useDebugValue: function() {
				Q = "useDebugValue", c(), z();
			},
			useDeferredValue: function(e, t) {
				return Q = "useDeferredValue", c(), z(), wo(e, t);
			},
			useTransition: function() {
				return Q = "useTransition", c(), z(), Po();
			},
			useSyncExternalStore: function(e, t, n) {
				return Q = "useSyncExternalStore", c(), z(), Ia(e, t, n);
			},
			useId: function() {
				return Q = "useId", c(), z(), Ta().memoizedState;
			},
			useFormState: function(e) {
				return Q = "useFormState", c(), z(), ao(e);
			},
			useActionState: function(e) {
				return Q = "useActionState", c(), z(), ao(e);
			},
			useOptimistic: function(e, t) {
				return Q = "useOptimistic", c(), z(), qa(e, t);
			},
			useMemoCache: function(e) {
				return c(), ka(e);
			},
			useHostTransitionStatus: Fo,
			useCacheRefresh: function() {
				return Q = "useCacheRefresh", z(), Ta().memoizedState;
			},
			useEffectEvent: function(e) {
				return Q = "useEffectEvent", c(), z(), B(e);
			}
		};
		var Gy = {}, Ky = /* @__PURE__ */ new Set(), qy = /* @__PURE__ */ new Set(), Jy = /* @__PURE__ */ new Set(), Yy = /* @__PURE__ */ new Set(), Xy = /* @__PURE__ */ new Set(), Zy = /* @__PURE__ */ new Set(), Qy = /* @__PURE__ */ new Set(), $y = /* @__PURE__ */ new Set(), eb = /* @__PURE__ */ new Set(), tb = /* @__PURE__ */ new Set();
		Object.freeze(Gy);
		var nb = {
			enqueueSetState: function(e, t, n) {
				e = e._reactInternals;
				var r = Xc(e), i = Yi(r);
				i.payload = t, n != null && (Ko(n), i.callback = n), t = Xi(e, i, r), t !== null && (ri(r, "this.setState()", e), Qc(t, e, r), Zi(t, e, r));
			},
			enqueueReplaceState: function(e, t, n) {
				e = e._reactInternals;
				var r = Xc(e), i = Yi(r);
				i.tag = $v, i.payload = t, n != null && (Ko(n), i.callback = n), t = Xi(e, i, r), t !== null && (ri(r, "this.replaceState()", e), Qc(t, e, r), Zi(t, e, r));
			},
			enqueueForceUpdate: function(e, t) {
				e = e._reactInternals;
				var n = Xc(e), r = Yi(n);
				r.tag = ey, t != null && (Ko(t), r.callback = t), t = Xi(e, r, n), t !== null && (ri(n, "this.forceUpdate()", e), Qc(t, e, n), Zi(t, e, n));
			}
		}, rb = null, ib = null, ab = Error("This is not a real error. It's an implementation detail of React's selective hydration feature. If this leaks into userspace, it's a bug in React. Please file an issue."), ob = !1, sb = {}, cb = {}, lb = {}, ub = {}, db = !1, fb = {}, pb = {}, mb = {
			dehydrated: null,
			treeContext: null,
			retryLane: 0,
			hydrationErrors: null
		}, hb = !1, gb = null;
		gb = /* @__PURE__ */ new Set();
		var _b = !1, vb = !1, yb = !1, bb = typeof WeakSet == "function" ? WeakSet : Set, xb = null, Sb = null, Cb = null, wb = null, Tb = !1, Eb = null, Db = !1, Ob = 8192, kb = {
			getCacheForType: function(e) {
				var t = Zr(m_), n = t.data.get(e);
				return n === void 0 && (n = e(), t.data.set(e, n)), n;
			},
			cacheSignal: function() {
				return Zr(m_).controller.signal;
			},
			getOwner: function() {
				return dp;
			}
		};
		if (typeof Symbol == "function" && Symbol.for) {
			var Ab = Symbol.for;
			Ab("selector.component"), Ab("selector.has_pseudo_class"), Ab("selector.role"), Ab("selector.test_id"), Ab("selector.text");
		}
		var jb = [], Mb = typeof WeakMap == "function" ? WeakMap : Map, Nb = 0, Pb = 2, Fb = 4, Ib = 0, Lb = 1, Rb = 2, zb = 3, Bb = 4, Vb = 6, Hb = 5, Ub = Nb, Wb = null, Gb = null, $ = 0, Kb = 0, qb = 1, Jb = 2, Yb = 3, Xb = 4, Zb = 5, Qb = 6, $b = 7, ex = 8, tx = 9, nx = Kb, rx = null, ix = !1, ax = !1, ox = !1, sx = 0, cx = Ib, lx = 0, ux = 0, dx = 0, fx = 0, px = 0, mx = null, hx = null, gx = !1, _x = 0, vx = 0, yx = 300, bx = Infinity, xx = 500, Sx = null, Cx = null, wx = null, Tx = 0, Ex = 1, Dx = 2, Ox = 3, kx = 0, Ax = 1, jx = 2, Mx = 3, Nx = 4, Px = 5, Fx = 0, Ix = null, Lx = null, Rx = 0, zx = 0, Bx = -0, Vx = null, Hx = null, Ux = null, Wx = Tx, Gx = null, Kx = 50, qx = 0, Jx = null, Yx = !1, Xx = !1, Zx = 50, Qx = 0, $x = null, eS = !1, tS = null, nS = !1, rS = /* @__PURE__ */ new Set(), iS = {}, aS = null, oS = null, sS = !1, cS = !1, lS = !1, uS = !1, dS = 0, fS = {};
		(function() {
			for (var e = 0; e < rg.length; e++) {
				var t = rg[e], n = t.toLowerCase();
				t = t[0].toUpperCase() + t.slice(1), Rn(n, "on" + t);
			}
			Rn(Yh, "onAnimationEnd"), Rn(Xh, "onAnimationIteration"), Rn(Zh, "onAnimationStart"), Rn("dblclick", "onDoubleClick"), Rn("focusin", "onFocus"), Rn("focusout", "onBlur"), Rn(Qh, "onTransitionRun"), Rn($h, "onTransitionStart"), Rn(eg, "onTransitionCancel"), Rn(tg, "onTransitionEnd");
		})(), Ze("onMouseEnter", ["mouseout", "mouseover"]), Ze("onMouseLeave", ["mouseout", "mouseover"]), Ze("onPointerEnter", ["pointerout", "pointerover"]), Ze("onPointerLeave", ["pointerout", "pointerover"]), Xe("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), Xe("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), Xe("onBeforeInput", [
			"compositionend",
			"keypress",
			"textInput",
			"paste"
		]), Xe("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), Xe("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), Xe("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
		var pS = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mS = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(pS)), hS = "_reactListening" + Math.random().toString(36).slice(2), gS = !1, _S = !1, vS = !1, yS = !1, bS = !1, xS = !1, SS = !1, CS = {}, wS = /\r\n?/g, TS = /\u0000|\uFFFD/g, ES = "http://www.w3.org/1999/xlink", DS = "http://www.w3.org/XML/1998/namespace", OS = "javascript:throw new Error('React form unexpectedly submitted.')", kS = "suppressHydrationWarning", AS = "&", jS = "/&", MS = "$", NS = "/$", PS = "$?", FS = "$~", IS = "$!", LS = "html", RS = "body", zS = "head", BS = "F!", VS = "F", HS = "loading", US = "style", WS = 0, GS = 1, KS = 2, qS = null, JS = null, YS = {
			dialog: !0,
			webview: !0
		}, XS = null, ZS = void 0, QS = typeof setTimeout == "function" ? setTimeout : void 0, $S = typeof clearTimeout == "function" ? clearTimeout : void 0, eC = -1, tC = typeof Promise == "function" ? Promise : void 0, nC = typeof queueMicrotask == "function" ? queueMicrotask : tC === void 0 ? QS : function(e) {
			return tC.resolve(null).then(e).catch(Uu);
		}, rC = null, iC = 0, aC = 1, oC = 2, sC = 3, cC = 4, lC = /* @__PURE__ */ new Map(), uC = /* @__PURE__ */ new Set(), dC = Wf.d;
		Wf.d = {
			f: function() {
				var e = dC.f(), t = rl();
				return e || t;
			},
			r: function(e) {
				var t = Ke(e);
				t !== null && t.tag === 5 && t.type === "form" ? jo(t) : dC.r(e);
			},
			D: function(e) {
				dC.D(e), Ed("dns-prefetch", e, null);
			},
			C: function(e, t) {
				dC.C(e, t), Ed("preconnect", e, t);
			},
			L: function(e, t, n) {
				dC.L(e, t, n);
				var r = fC;
				if (r && e && t) {
					var i = "link[rel=\"preload\"][as=\"" + ut(t) + "\"]";
					t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + ut(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + ut(n.imageSizes) + "\"]")) : i += "[href=\"" + ut(e) + "\"]";
					var a = i;
					switch (t) {
						case "style":
							a = U(e);
							break;
						case "script": a = Md(e);
					}
					lC.has(a) || (e = W({
						rel: "preload",
						href: t === "image" && n && n.imageSrcSet ? void 0 : e,
						as: t
					}, n), lC.set(a, e), r.querySelector(i) !== null || t === "style" && r.querySelector(kd(a)) || t === "script" && r.querySelector(Nd(a)) || (t = r.createElement("link"), Su(t, "link", e), Ye(t), r.head.appendChild(t)));
				}
			},
			m: function(e, t) {
				dC.m(e, t);
				var n = fC;
				if (n && e) {
					var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + ut(r) + "\"][href=\"" + ut(e) + "\"]", a = i;
					switch (r) {
						case "audioworklet":
						case "paintworklet":
						case "serviceworker":
						case "sharedworker":
						case "worker":
						case "script": a = Md(e);
					}
					if (!lC.has(a) && (e = W({
						rel: "modulepreload",
						href: e
					}, t), lC.set(a, e), n.querySelector(i) === null)) {
						switch (r) {
							case "audioworklet":
							case "paintworklet":
							case "serviceworker":
							case "sharedworker":
							case "worker":
							case "script": if (n.querySelector(Nd(a))) return;
						}
						r = n.createElement("link"), Su(r, "link", e), Ye(r), n.head.appendChild(r);
					}
				}
			},
			X: function(e, t) {
				dC.X(e, t);
				var n = fC;
				if (n && e) {
					var r = Je(n).hoistableScripts, i = Md(e), a = r.get(i);
					a || (a = n.querySelector(Nd(i)), a || (e = W({
						src: e,
						async: !0
					}, t), (t = lC.get(i)) && Ld(e, t), a = n.createElement("script"), Ye(a), Su(a, "link", e), n.head.appendChild(a)), a = {
						type: "script",
						instance: a,
						count: 1,
						state: null
					}, r.set(i, a));
				}
			},
			S: function(e, t, n) {
				dC.S(e, t, n);
				var r = fC;
				if (r && e) {
					var i = Je(r).hoistableStyles, a = U(e);
					t ||= "default";
					var o = i.get(a);
					if (!o) {
						var s = {
							loading: iC,
							preload: null
						};
						if (o = r.querySelector(kd(a))) s.loading = aC | cC;
						else {
							e = W({
								rel: "stylesheet",
								href: e,
								"data-precedence": t
							}, n), (n = lC.get(a)) && Id(e, n);
							var c = o = r.createElement("link");
							Ye(c), Su(c, "link", e), c._p = new Promise(function(e, t) {
								c.onload = e, c.onerror = t;
							}), c.addEventListener("load", function() {
								s.loading |= aC;
							}), c.addEventListener("error", function() {
								s.loading |= oC;
							}), s.loading |= cC, Fd(o, t, r);
						}
						o = {
							type: "stylesheet",
							instance: o,
							count: 1,
							state: s
						}, i.set(a, o);
					}
				}
			},
			M: function(e, t) {
				dC.M(e, t);
				var n = fC;
				if (n && e) {
					var r = Je(n).hoistableScripts, i = Md(e), a = r.get(i);
					a || (a = n.querySelector(Nd(i)), a || (e = W({
						src: e,
						async: !0,
						type: "module"
					}, t), (t = lC.get(i)) && Ld(e, t), a = n.createElement("script"), Ye(a), Su(a, "link", e), n.head.appendChild(a)), a = {
						type: "script",
						instance: a,
						count: 1,
						state: null
					}, r.set(i, a));
				}
			}
		};
		var fC = typeof document > "u" ? null : document, pC = null, mC = 6e4, hC = 800, gC = 500, _C = 0, vC = null, yC = null, bC = Gf, xC = {
			$$typeof: Nf,
			Provider: null,
			Consumer: null,
			_currentValue: bC,
			_currentValue2: bC,
			_threadCount: 0
		}, SC = "%c%s%c", CC = "background: #e6e6e6;background: light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.25));color: #000000;color: light-dark(#000000, #ffffff);border-radius: 2px", wC = "", TC = " ", EC = Function.prototype.bind, DC = !1, OC = null, kC = null, AC = null, jC = null, MC = null, NC = null, PC = null, FC = null, IC = null, LC = null;
		OC = function(e, r, i, a) {
			r = t(e, r), r !== null && (i = n(r.memoizedState, i, 0, a), r.memoizedState = i, r.baseState = i, e.memoizedProps = W({}, e.memoizedProps), i = or(e, 2), i !== null && Qc(i, e, 2));
		}, kC = function(e, n, r) {
			n = t(e, n), n !== null && (r = a(n.memoizedState, r, 0), n.memoizedState = r, n.baseState = r, e.memoizedProps = W({}, e.memoizedProps), r = or(e, 2), r !== null && Qc(r, e, 2));
		}, AC = function(e, n, i, a) {
			n = t(e, n), n !== null && (i = r(n.memoizedState, i, a), n.memoizedState = i, n.baseState = i, e.memoizedProps = W({}, e.memoizedProps), i = or(e, 2), i !== null && Qc(i, e, 2));
		}, jC = function(e, t, r) {
			e.pendingProps = n(e.memoizedProps, t, 0, r), e.alternate && (e.alternate.pendingProps = e.pendingProps), t = or(e, 2), t !== null && Qc(t, e, 2);
		}, MC = function(e, t) {
			e.pendingProps = a(e.memoizedProps, t, 0), e.alternate && (e.alternate.pendingProps = e.pendingProps), t = or(e, 2), t !== null && Qc(t, e, 2);
		}, NC = function(e, t, n) {
			e.pendingProps = r(e.memoizedProps, t, n), e.alternate && (e.alternate.pendingProps = e.pendingProps), t = or(e, 2), t !== null && Qc(t, e, 2);
		}, PC = function(e) {
			var t = or(e, 2);
			t !== null && Qc(t, e, 2);
		}, FC = function(e) {
			var t = je(), n = or(e, t);
			n !== null && Qc(n, e, t);
		}, IC = function(e) {
			s = e;
		}, LC = function(e) {
			o = e;
		};
		var RC = !0, zC = null, BC = !1, VC = null, HC = null, UC = null, WC = /* @__PURE__ */ new Map(), GC = /* @__PURE__ */ new Map(), KC = [], qC = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" "), JC = null;
		if (xf.prototype.render = bf.prototype.render = function(e) {
			var t = this._internalRoot;
			if (t === null) throw Error("Cannot update an unmounted root.");
			var n = arguments;
			typeof n[1] == "function" ? console.error("does not support the second callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().") : b(n[1]) ? console.error("You passed a container to the second argument of root.render(...). You don't need to pass it again since you already passed it to create the root.") : n[1] !== void 0 && console.error("You passed a second argument to root.render(...) but it only accepts one argument."), n = e;
			var r = t.current;
			Xd(r, Xc(r), n, t, null, null);
		}, xf.prototype.unmount = bf.prototype.unmount = function() {
			var e = arguments;
			if (typeof e[0] == "function" && console.error("does not support a callback argument. To execute a side effect after rendering, declare it in a component body with useEffect()."), e = this._internalRoot, e !== null) {
				this._internalRoot = null;
				var t = e.containerInfo;
				(Ub & (Pb | Fb)) !== Nb && console.error("Attempted to synchronously unmount a root while React was already rendering. React cannot finish unmounting the root until the current render has completed, which may lead to a race condition."), Xd(e.current, 2, null, e, null, null), rl(), t[Wp] = null;
			}
		}, xf.prototype.unstable_scheduleHydration = function(e) {
			if (e) {
				var t = He();
				e = {
					blockedOn: null,
					target: e,
					priority: t
				};
				for (var n = 0; n < KC.length && t !== 0 && t < KC[n].priority; n++);
				KC.splice(n, 0, e), n === 0 && ff(e);
			}
		}, (function() {
			var e = wf.version;
			if (e !== "19.2.6") throw Error("Incompatible React versions: The \"react\" and \"react-dom\" packages must have the exact same version. Instead got:\n  - react:      " + (e + "\n  - react-dom:  19.2.6\nLearn more: https://react.dev/warnings/version-mismatch"));
		})(), typeof Map == "function" && Map.prototype != null && typeof Map.prototype.forEach == "function" && typeof Set == "function" && Set.prototype != null && typeof Set.prototype.clear == "function" && typeof Set.prototype.forEach == "function" || console.error("React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://react.dev/link/react-polyfills"), Wf.findDOMNode = function(e) {
			var t = e._reactInternals;
			if (t === void 0) throw typeof e.render == "function" ? Error("Unable to find node on an unmounted component.") : (e = Object.keys(e).join(","), Error("Argument appears to not be a ReactComponent. Keys: " + e));
			return e = C(t), e = e === null ? null : ne(e), e = e === null ? null : e.stateNode, e;
		}, !(function() {
			var e = {
				bundleType: 1,
				version: "19.2.6",
				rendererPackageName: "react-dom",
				currentDispatcherRef: G,
				reconcilerVersion: "19.2.6"
			};
			return e.overrideHookState = OC, e.overrideHookStateDeletePath = kC, e.overrideHookStateRenamePath = AC, e.overrideProps = jC, e.overridePropsDeletePath = MC, e.overridePropsRenamePath = NC, e.scheduleUpdate = PC, e.scheduleRetry = FC, e.setErrorHandler = IC, e.setSuspenseHandler = LC, e.scheduleRefresh = v, e.scheduleRoot = g, e.setRefreshHandler = y, e.getCurrentFiber = tf, we(e);
		})() && Xm && window.top === window.self && (-1 < navigator.userAgent.indexOf("Chrome") && navigator.userAgent.indexOf("Edge") === -1 || -1 < navigator.userAgent.indexOf("Firefox"))) {
			var YC = window.location.protocol;
			/^(https?|file):$/.test(YC) && console.info("%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools" + (YC === "file:" ? "\nYou might need to use a local HTTP server (instead of file://): https://react.dev/link/react-devtools-faq" : ""), "font-weight:bold");
		}
		e.createRoot = function(e, t) {
			if (!b(e)) throw Error("Target container is not a DOM element.");
			Sf(e);
			var n = !1, r = "", i = Zo, a = Qo, o = $o;
			return t != null && (t.hydrate ? console.warn("hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead.") : typeof t == "object" && t && t.$$typeof === Df && console.error("You passed a JSX element to createRoot. You probably meant to call root.render instead. Example usage:\n\n  let root = createRoot(domContainer);\n  root.render(<App />);"), !0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (i = t.onUncaughtError), t.onCaughtError !== void 0 && (a = t.onCaughtError), t.onRecoverableError !== void 0 && (o = t.onRecoverableError)), t = Jd(e, 1, !1, null, null, n, r, null, i, a, o, yf), e[Wp] = t.current, ou(e), new bf(t);
		}, e.hydrateRoot = function(e, t, n) {
			if (!b(e)) throw Error("Target container is not a DOM element.");
			Sf(e), t === void 0 && console.error("Must provide initial children as second argument to hydrateRoot. Example usage: hydrateRoot(domContainer, <App />)");
			var r = !1, i = "", a = Zo, o = Qo, s = $o, c = null;
			return n != null && (!0 === n.unstable_strictMode && (r = !0), n.identifierPrefix !== void 0 && (i = n.identifierPrefix), n.onUncaughtError !== void 0 && (a = n.onUncaughtError), n.onCaughtError !== void 0 && (o = n.onCaughtError), n.onRecoverableError !== void 0 && (s = n.onRecoverableError), n.formState !== void 0 && (c = n.formState)), t = Jd(e, 1, !0, t, n ?? null, r, i, c, a, o, s, yf), t.context = Yd(null), n = t.current, r = Xc(n), r = Re(r), i = Yi(r), i.callback = null, Xi(n, i, r), ri(r, "hydrateRoot()", null), n = r, t.current.lanes = n, Ne(t, n), Gl(t), e[Wp] = t.current, ou(e), new xf(t);
		}, e.version = "19.2.6", typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
	})();
})), b = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
			if (process.env.NODE_ENV !== "production") throw Error("^_^");
			try {
				__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
			} catch (e) {
				console.error(e);
			}
		}
	}
	process.env.NODE_ENV === "production" ? (n(), t.exports = v()) : t.exports = y();
})), x = /* @__PURE__ */ c(d()), ee = b();
//#endregion
//#region node_modules/.pnpm/home-assistant-js-websocket@9.6.0/node_modules/home-assistant-js-websocket/dist/messages.js
function te() {
	return { type: "get_states" };
}
//#endregion
//#region node_modules/.pnpm/home-assistant-js-websocket@9.6.0/node_modules/home-assistant-js-websocket/dist/util.js
var S = (e, t, n, r) => {
	let [i, a, o] = e.split(".", 3);
	return Number(i) > t || Number(i) === t && (r === void 0 ? Number(a) >= n : Number(a) > n) || r !== void 0 && Number(i) === t && Number(a) === n && Number(o) >= r;
}, C = (e) => {
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
}, ne = 5e3, re = (e, t, n, r, i = { unsubGrace: !0 }) => {
	if (e[t]) return e[t];
	let a = 0, o, s, c = C(), l = () => {
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
		s = setTimeout(f, ne);
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
}, w = (e) => e.sendMessagePromise(te());
//#endregion
//#region node_modules/.pnpm/home-assistant-js-websocket@9.6.0/node_modules/home-assistant-js-websocket/dist/entities.js
function ie(e, t) {
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
var T = (e, t) => e.subscribeMessage((e) => ie(t, e), { type: "subscribe_entities" });
function E(e, t) {
	let n = e.state;
	if (n === void 0) return;
	let { entity_id: r, new_state: i } = t.data;
	if (i) e.setState({ [i.entity_id]: i });
	else {
		let t = Object.assign({}, n);
		delete t[r], e.setState(t, !0);
	}
}
async function D(e) {
	let t = await w(e), n = {};
	for (let e = 0; e < t.length; e++) {
		let r = t[e];
		n[r.entity_id] = r;
	}
	return n;
}
var O = (e, t) => e.subscribeEvents((e) => E(t, e), "state_changed"), ae = (e) => S(e.haVersion, 2022, 4, 0) ? re(e, "_ent", void 0, T) : re(e, "_ent", D, O), oe = (e, t) => ae(e).subscribe(t);
//#endregion
//#region src/lib/ha.ts
async function k() {
	if (window.hassConnection) {
		let { conn: e } = await window.hassConnection;
		return e;
	}
	throw Error("Not running inside HA and VITE_HA_URL / VITE_HA_TOKEN are unset. Copy .env.example to .env and add a long-lived access token.");
}
function A(e, t) {
	return oe(e, t);
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.2.9_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/utils/esm/mergeObjects.js
function se(e, t) {
	if (e && !t) return e;
	if (!e && t) return t;
	if (e || t) return {
		...e,
		...t
	};
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/merge-props/mergeProps.js
var ce = {};
function le(e, t, n, r, i) {
	if (!n && !r && !i && !e) return j(t);
	let a = j(e);
	return t && (a = M(a, t)), n && (a = M(a, n)), r && (a = M(a, r)), i && (a = M(a, i)), a;
}
function ue(e) {
	if (e.length === 0) return ce;
	if (e.length === 1) return j(e[0]);
	let t = j(e[0]);
	for (let n = 1; n < e.length; n += 1) t = M(t, e[n]);
	return t;
}
function j(e) {
	return me(e) ? { ...he(e, ce) } : de(e);
}
function M(e, t) {
	return me(t) ? he(t, e) : fe(e, t);
}
function de(e) {
	let t = { ...e };
	for (let e in t) {
		let n = t[e];
		pe(e, n) && (t[e] = _e(n));
	}
	return t;
}
function fe(e, t) {
	if (!t) return e;
	for (let n in t) {
		let r = t[n];
		switch (n) {
			case "style":
				e[n] = se(e.style, r);
				break;
			case "className":
				e[n] = ve(e.className, r);
				break;
			default: pe(n, r) ? e[n] = ge(e[n], r) : e[n] = r;
		}
	}
	return e;
}
function pe(e, t) {
	let n = e.charCodeAt(0), r = e.charCodeAt(1), i = e.charCodeAt(2);
	return n === 111 && r === 110 && i >= 65 && i <= 90 && (typeof t == "function" || t === void 0);
}
function me(e) {
	return typeof e == "function";
}
function he(e, t) {
	return me(e) ? e(t) : e ?? ce;
}
function ge(e, t) {
	return t ? e ? (...n) => {
		let r = n[0];
		if (ye(r)) {
			let i = r;
			N(i);
			let a = t(...n);
			return i.baseUIHandlerPrevented || e?.(...n), a;
		}
		let i = t(...n);
		return e?.(...n), i;
	} : _e(t) : e;
}
function _e(e) {
	return e && ((...t) => {
		let n = t[0];
		return ye(n) && N(n), e(...t);
	});
}
function N(e) {
	return e.preventBaseUIHandler = () => {
		e.baseUIHandlerPrevented = !0;
	}, e;
}
function ve(e, t) {
	return t ? e ? t + " " + e : t : e;
}
function ye(e) {
	return typeof e == "object" && !!e && "nativeEvent" in e;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.2.9_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/utils/esm/formatErrorMessage.js
function be(e, t) {
	return function(n, ...r) {
		let i = new URL(e);
		return i.searchParams.set("code", n.toString()), r.forEach((e) => i.searchParams.append("args[]", e)), `${t} error #${n}; visit ${i} for the full message.`;
	};
}
var xe = be("https://base-ui.com/production-error", "Base UI"), P = {};
function Se(e, t) {
	let n = x.useRef(P);
	return n.current === P && (n.current = e(t)), n;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.2.9_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/utils/esm/useMergedRefs.js
function Ce(e, t, n, r) {
	let i = Se(Te).current;
	return Ee(i, e, t, n, r) && Oe(i, [
		e,
		t,
		n,
		r
	]), i.callback;
}
function we(e) {
	let t = Se(Te).current;
	return De(t, e) && Oe(t, e), t.callback;
}
function Te() {
	return {
		callback: null,
		cleanup: null,
		refs: []
	};
}
function Ee(e, t, n, r, i) {
	return e.refs[0] !== t || e.refs[1] !== n || e.refs[2] !== r || e.refs[3] !== i;
}
function De(e, t) {
	return e.refs.length !== t.length || e.refs.some((e, n) => e !== t[n]);
}
function Oe(e, t) {
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
var ke = 19;
function Ae(e) {
	return ke >= e;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.2.9_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/utils/esm/getReactElementRef.js
function je(e) {
	if (!/* @__PURE__ */ x.isValidElement(e)) return null;
	let t = e, n = t.props;
	return (Ae(19) ? n?.ref : t.ref) ?? null;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.2.9_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/utils/esm/warn.js
var Me;
process.env.NODE_ENV !== "production" && (Me = /* @__PURE__ */ new Set());
function Ne(...e) {
	if (process.env.NODE_ENV !== "production") {
		let t = e.join(" ");
		Me.has(t) || (Me.add(t), console.warn(`Base UI: ${t}`));
	}
}
Object.freeze([]);
var Pe = Object.freeze({});
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/internals/getStateAttributesProps.js
function Fe(e, t) {
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
function Ie(e, t) {
	return typeof e == "function" ? e(t) : e;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/utils/resolveStyle.js
function Le(e, t) {
	return typeof e == "function" ? e(t) : e;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/internals/useRenderElement.js
function Re(e, t, n = {}) {
	let r = t.render, i = ze(t, n);
	return n.enabled === !1 ? null : We(e, r, i, n.state ?? Pe);
}
function ze(e, t = {}) {
	let { className: n, style: r, render: i } = e, { state: a = Pe, ref: o, props: s, stateAttributesMapping: c, enabled: l = !0 } = t, u = l ? Ie(n, a) : void 0, d = l ? Le(r, a) : void 0, f = l ? Fe(a, c) : Pe, p = l && s ? Be(s) : void 0, m = l ? se(f, p) ?? {} : Pe;
	return typeof document < "u" && (l ? Array.isArray(o) ? m.ref = we([
		m.ref,
		je(i),
		...o
	]) : m.ref = Ce(m.ref, je(i), o) : Ce(null, null)), l ? (u !== void 0 && (m.className = ve(m.className, u)), d !== void 0 && (m.style = se(m.style, d)), m) : Pe;
}
function Be(e) {
	return Array.isArray(e) ? ue(e) : le(void 0, e);
}
var Ve = Symbol.for("react.lazy"), He = /^[A-Z][A-Za-z0-9$]*$/, Ue = /[a-z]/;
function We(e, t, n, r) {
	if (t) {
		if (typeof t == "function") return process.env.NODE_ENV !== "production" && Ge(t), t(n, r);
		let e = le(n, t.props);
		e.ref = n.ref;
		let i = t;
		if (i?.$$typeof === Ve && (i = x.Children.toArray(t)[0]), process.env.NODE_ENV !== "production" && !/* @__PURE__ */ x.isValidElement(i)) throw Error([
			"Base UI: The `render` prop was provided an invalid React element as `React.isValidElement(render)` is `false`.",
			"A valid React element must be provided to the `render` prop because it is cloned with props to replace the default element.",
			"https://base-ui.com/r/invalid-render-prop"
		].join("\n"));
		return /* @__PURE__ */ x.cloneElement(i, e);
	}
	if (e && typeof e == "string") return Ke(e, n);
	throw Error(process.env.NODE_ENV === "production" ? xe(8) : "Base UI: Render element or function are not defined.");
}
function Ge(e) {
	let t = e.name;
	t.length !== 0 && He.test(t) && Ue.test(t) && Ne(`The \`render\` prop received a function named \`${t}\` that starts with an uppercase letter.`, "This usually means a React component was passed directly as `render={Component}`.", "Base UI calls `render` as a plain function, which can break the Rules of Hooks during reconciliation.", "If this is an intentional render callback, rename it to start with a lowercase letter.", "Use `render={<Component />}` or `render={(props) => <Component {...props} />}` instead.", "https://base-ui.com/r/invalid-render-prop");
}
function Ke(e, t) {
	return e === "button" ? /* @__PURE__ */ (0, x.createElement)("button", {
		type: "button",
		...t,
		key: t.key
	}) : e === "img" ? /* @__PURE__ */ (0, x.createElement)("img", {
		alt: "",
		...t,
		key: t.key
	}) : /* @__PURE__ */ x.createElement(e, t);
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/use-render/useRender.js
function qe(e) {
	return Re(e.defaultTagName ?? "div", e, e);
}
//#endregion
//#region node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs
function Je(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") if (Array.isArray(e)) {
		var i = e.length;
		for (t = 0; t < i; t++) e[t] && (n = Je(e[t])) && (r && (r += " "), r += n);
	} else for (n in e) e[n] && (r && (r += " "), r += n);
	return r;
}
function Ye() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = Je(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.mjs
var Xe = (e) => typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e, Ze = Ye, Qe = (e, t) => (n) => {
	if (t?.variants == null) return Ze(e, n?.class, n?.className);
	let { variants: r, defaultVariants: i } = t, a = Object.keys(r).map((e) => {
		let t = n?.[e], a = i?.[e];
		if (t === null) return null;
		let o = Xe(t) || Xe(a);
		return r[e][o];
	}), o = n && Object.entries(n).reduce((e, t) => {
		let [n, r] = t;
		return r === void 0 || (e[n] = r), e;
	}, {});
	return Ze(e, a, t?.compoundVariants?.reduce((e, t) => {
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
}, $e = (e, t) => {
	let n = Array(e.length + t.length);
	for (let t = 0; t < e.length; t++) n[t] = e[t];
	for (let r = 0; r < t.length; r++) n[e.length + r] = t[r];
	return n;
}, et = (e, t) => ({
	classGroupId: e,
	validator: t
}), tt = (e = /* @__PURE__ */ new Map(), t = null, n) => ({
	nextPart: e,
	validators: t,
	classGroupId: n
}), nt = "-", rt = [], it = "arbitrary..", at = (e) => {
	let t = ct(e), { conflictingClassGroups: n, conflictingClassGroupModifiers: r } = e;
	return {
		getClassGroupId: (e) => {
			if (e.startsWith("[") && e.endsWith("]")) return st(e);
			let n = e.split(nt);
			return ot(n, +(n[0] === "" && n.length > 1), t);
		},
		getConflictingClassGroupIds: (e, t) => {
			if (t) {
				let t = r[e], i = n[e];
				return t ? i ? $e(i, t) : t : i || rt;
			}
			return n[e] || rt;
		}
	};
}, ot = (e, t, n) => {
	if (e.length - t === 0) return n.classGroupId;
	let r = e[t], i = n.nextPart.get(r);
	if (i) {
		let n = ot(e, t + 1, i);
		if (n) return n;
	}
	let a = n.validators;
	if (a === null) return;
	let o = t === 0 ? e.join(nt) : e.slice(t).join(nt), s = a.length;
	for (let e = 0; e < s; e++) {
		let t = a[e];
		if (t.validator(o)) return t.classGroupId;
	}
}, st = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
	let t = e.slice(1, -1), n = t.indexOf(":"), r = t.slice(0, n);
	return r ? it + r : void 0;
})(), ct = (e) => {
	let { theme: t, classGroups: n } = e;
	return lt(n, t);
}, lt = (e, t) => {
	let n = tt();
	for (let r in e) {
		let i = e[r];
		ut(i, n, r, t);
	}
	return n;
}, ut = (e, t, n, r) => {
	let i = e.length;
	for (let a = 0; a < i; a++) {
		let i = e[a];
		dt(i, t, n, r);
	}
}, dt = (e, t, n, r) => {
	if (typeof e == "string") {
		ft(e, t, n);
		return;
	}
	if (typeof e == "function") {
		pt(e, t, n, r);
		return;
	}
	mt(e, t, n, r);
}, ft = (e, t, n) => {
	let r = e === "" ? t : ht(t, e);
	r.classGroupId = n;
}, pt = (e, t, n, r) => {
	if (gt(e)) {
		ut(e(r), t, n, r);
		return;
	}
	t.validators === null && (t.validators = []), t.validators.push(et(n, e));
}, mt = (e, t, n, r) => {
	let i = Object.entries(e), a = i.length;
	for (let e = 0; e < a; e++) {
		let [a, o] = i[e];
		ut(o, ht(t, a), n, r);
	}
}, ht = (e, t) => {
	let n = e, r = t.split(nt), i = r.length;
	for (let e = 0; e < i; e++) {
		let t = r[e], i = n.nextPart.get(t);
		i || (i = tt(), n.nextPart.set(t, i)), n = i;
	}
	return n;
}, gt = (e) => "isThemeGetter" in e && e.isThemeGetter === !0, _t = (e) => {
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
}, vt = "!", yt = ":", bt = [], xt = (e, t, n, r, i) => ({
	modifiers: e,
	hasImportantModifier: t,
	baseClassName: n,
	maybePostfixModifierPosition: r,
	isExternal: i
}), St = (e) => {
	let { prefix: t, experimentalParseClassName: n } = e, r = (e) => {
		let t = [], n = 0, r = 0, i = 0, a, o = e.length;
		for (let s = 0; s < o; s++) {
			let o = e[s];
			if (n === 0 && r === 0) {
				if (o === yt) {
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
		s.endsWith(vt) ? (c = s.slice(0, -1), l = !0) : s.startsWith(vt) && (c = s.slice(1), l = !0);
		let u = a && a > i ? a - i : void 0;
		return xt(t, l, c, u);
	};
	if (t) {
		let e = t + yt, n = r;
		r = (t) => t.startsWith(e) ? n(t.slice(e.length)) : xt(bt, !1, t, void 0, !0);
	}
	if (n) {
		let e = r;
		r = (t) => n({
			className: t,
			parseClassName: e
		});
	}
	return r;
}, Ct = (e) => {
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
}, wt = (e) => ({
	cache: _t(e.cacheSize),
	parseClassName: St(e),
	sortModifiers: Ct(e),
	postfixLookupClassGroupIds: Tt(e),
	...at(e)
}), Tt = (e) => {
	let t = Object.create(null), n = e.postfixLookupClassGroups;
	if (n) for (let e = 0; e < n.length; e++) t[n[e]] = !0;
	return t;
}, Et = /\s+/, Dt = (e, t) => {
	let { parseClassName: n, getClassGroupId: r, getConflictingClassGroupIds: i, sortModifiers: a, postfixLookupClassGroupIds: o } = t, s = [], c = e.trim().split(Et), l = "";
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
		let _ = d.length === 0 ? "" : d.length === 1 ? d[0] : a(d).join(":"), v = f ? _ + vt : _, y = v + g;
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
}, Ot = (...e) => {
	let t = 0, n, r, i = "";
	for (; t < e.length;) (n = e[t++]) && (r = kt(n)) && (i && (i += " "), i += r);
	return i;
}, kt = (e) => {
	if (typeof e == "string") return e;
	let t, n = "";
	for (let r = 0; r < e.length; r++) e[r] && (t = kt(e[r])) && (n && (n += " "), n += t);
	return n;
}, At = (e, ...t) => {
	let n, r, i, a, o = (o) => (n = wt(t.reduce((e, t) => t(e), e())), r = n.cache.get, i = n.cache.set, a = s, s(o)), s = (e) => {
		let t = r(e);
		if (t) return t;
		let a = Dt(e, n);
		return i(e, a), a;
	};
	return a = o, (...e) => a(Ot(...e));
}, jt = [], Mt = (e) => {
	let t = (t) => t[e] || jt;
	return t.isThemeGetter = !0, t;
}, Nt = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, Pt = /^\((?:(\w[\w-]*):)?(.+)\)$/i, Ft = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, It = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, Lt = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, Rt = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, zt = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Bt = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Vt = (e) => Ft.test(e), F = (e) => !!e && !Number.isNaN(Number(e)), Ht = (e) => !!e && Number.isInteger(Number(e)), Ut = (e) => e.endsWith("%") && F(e.slice(0, -1)), Wt = (e) => It.test(e), Gt = () => !0, Kt = (e) => Lt.test(e) && !Rt.test(e), qt = () => !1, Jt = (e) => zt.test(e), Yt = (e) => Bt.test(e), Xt = (e) => !I(e) && !L(e), Zt = (e) => e.startsWith("@container") && (e[10] === "/" && e[11] !== void 0 || e[11] === "s" && e[16] !== void 0 && e.startsWith("-size/", 10) || e[11] === "n" && e[18] !== void 0 && e.startsWith("-normal/", 10)), Qt = (e) => mn(e, vn, qt), I = (e) => Nt.test(e), $t = (e) => mn(e, yn, Kt), en = (e) => mn(e, bn, F), tn = (e) => mn(e, Sn, Gt), nn = (e) => mn(e, xn, qt), rn = (e) => mn(e, gn, qt), an = (e) => mn(e, _n, Yt), on = (e) => mn(e, Cn, Jt), L = (e) => Pt.test(e), sn = (e) => hn(e, yn), cn = (e) => hn(e, xn), ln = (e) => hn(e, gn), un = (e) => hn(e, vn), dn = (e) => hn(e, _n), fn = (e) => hn(e, Cn, !0), pn = (e) => hn(e, Sn, !0), mn = (e, t, n) => {
	let r = Nt.exec(e);
	return r ? r[1] ? t(r[1]) : n(r[2]) : !1;
}, hn = (e, t, n = !1) => {
	let r = Pt.exec(e);
	return r ? r[1] ? t(r[1]) : n : !1;
}, gn = (e) => e === "position" || e === "percentage", _n = (e) => e === "image" || e === "url", vn = (e) => e === "length" || e === "size" || e === "bg-size", yn = (e) => e === "length", bn = (e) => e === "number", xn = (e) => e === "family-name", Sn = (e) => e === "number" || e === "weight", Cn = (e) => e === "shadow", wn = /* @__PURE__ */ At(() => {
	let e = Mt("color"), t = Mt("font"), n = Mt("text"), r = Mt("font-weight"), i = Mt("tracking"), a = Mt("leading"), o = Mt("breakpoint"), s = Mt("container"), c = Mt("spacing"), l = Mt("radius"), u = Mt("shadow"), d = Mt("inset-shadow"), f = Mt("text-shadow"), p = Mt("drop-shadow"), m = Mt("blur"), h = Mt("perspective"), g = Mt("aspect"), _ = Mt("ease"), v = Mt("animate"), y = () => [
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
		L,
		I
	], ee = () => [
		"auto",
		"hidden",
		"clip",
		"visible",
		"scroll"
	], te = () => [
		"auto",
		"contain",
		"none"
	], S = () => [
		L,
		I,
		c
	], C = () => [
		Vt,
		"full",
		"auto",
		...S()
	], ne = () => [
		Ht,
		"none",
		"subgrid",
		L,
		I
	], re = () => [
		"auto",
		{ span: [
			"full",
			Ht,
			L,
			I
		] },
		Ht,
		L,
		I
	], w = () => [
		Ht,
		"auto",
		L,
		I
	], ie = () => [
		"auto",
		"min",
		"max",
		"fr",
		L,
		I
	], T = () => [
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
	], E = () => [
		"start",
		"end",
		"center",
		"stretch",
		"center-safe",
		"end-safe"
	], D = () => ["auto", ...S()], O = () => [
		Vt,
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
		...S()
	], ae = () => [
		Vt,
		"screen",
		"full",
		"dvw",
		"lvw",
		"svw",
		"min",
		"max",
		"fit",
		...S()
	], oe = () => [
		Vt,
		"screen",
		"full",
		"lh",
		"dvh",
		"lvh",
		"svh",
		"min",
		"max",
		"fit",
		...S()
	], k = () => [
		e,
		L,
		I
	], A = () => [
		...b(),
		ln,
		rn,
		{ position: [L, I] }
	], se = () => ["no-repeat", { repeat: [
		"",
		"x",
		"y",
		"space",
		"round"
	] }], ce = () => [
		"auto",
		"cover",
		"contain",
		un,
		Qt,
		{ size: [L, I] }
	], le = () => [
		Ut,
		sn,
		$t
	], ue = () => [
		"",
		"none",
		"full",
		l,
		L,
		I
	], j = () => [
		"",
		F,
		sn,
		$t
	], M = () => [
		"solid",
		"dashed",
		"dotted",
		"double"
	], de = () => [
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
	], fe = () => [
		F,
		Ut,
		ln,
		rn
	], pe = () => [
		"",
		"none",
		m,
		L,
		I
	], me = () => [
		"none",
		F,
		L,
		I
	], he = () => [
		"none",
		F,
		L,
		I
	], ge = () => [
		F,
		L,
		I
	], _e = () => [
		Vt,
		"full",
		...S()
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
			blur: [Wt],
			breakpoint: [Wt],
			color: [Gt],
			container: [Wt],
			"drop-shadow": [Wt],
			ease: [
				"in",
				"out",
				"in-out"
			],
			font: [Xt],
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
			"inset-shadow": [Wt],
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
			radius: [Wt],
			shadow: [Wt],
			spacing: ["px", F],
			text: [Wt],
			"text-shadow": [Wt],
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
				Vt,
				I,
				L,
				g
			] }],
			container: ["container"],
			"container-type": [{ "@container": [
				"",
				"normal",
				"size",
				L,
				I
			] }],
			"container-named": [Zt],
			columns: [{ columns: [
				F,
				I,
				L,
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
			overflow: [{ overflow: ee() }],
			"overflow-x": [{ "overflow-x": ee() }],
			"overflow-y": [{ "overflow-y": ee() }],
			overscroll: [{ overscroll: te() }],
			"overscroll-x": [{ "overscroll-x": te() }],
			"overscroll-y": [{ "overscroll-y": te() }],
			position: [
				"static",
				"fixed",
				"absolute",
				"relative",
				"sticky"
			],
			inset: [{ inset: C() }],
			"inset-x": [{ "inset-x": C() }],
			"inset-y": [{ "inset-y": C() }],
			start: [{
				"inset-s": C(),
				start: C()
			}],
			end: [{
				"inset-e": C(),
				end: C()
			}],
			"inset-bs": [{ "inset-bs": C() }],
			"inset-be": [{ "inset-be": C() }],
			top: [{ top: C() }],
			right: [{ right: C() }],
			bottom: [{ bottom: C() }],
			left: [{ left: C() }],
			visibility: [
				"visible",
				"invisible",
				"collapse"
			],
			z: [{ z: [
				Ht,
				"auto",
				L,
				I
			] }],
			basis: [{ basis: [
				Vt,
				"full",
				"auto",
				s,
				...S()
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
				F,
				Vt,
				"auto",
				"initial",
				"none",
				I
			] }],
			grow: [{ grow: [
				"",
				F,
				L,
				I
			] }],
			shrink: [{ shrink: [
				"",
				F,
				L,
				I
			] }],
			order: [{ order: [
				Ht,
				"first",
				"last",
				"none",
				L,
				I
			] }],
			"grid-cols": [{ "grid-cols": ne() }],
			"col-start-end": [{ col: re() }],
			"col-start": [{ "col-start": w() }],
			"col-end": [{ "col-end": w() }],
			"grid-rows": [{ "grid-rows": ne() }],
			"row-start-end": [{ row: re() }],
			"row-start": [{ "row-start": w() }],
			"row-end": [{ "row-end": w() }],
			"grid-flow": [{ "grid-flow": [
				"row",
				"col",
				"dense",
				"row-dense",
				"col-dense"
			] }],
			"auto-cols": [{ "auto-cols": ie() }],
			"auto-rows": [{ "auto-rows": ie() }],
			gap: [{ gap: S() }],
			"gap-x": [{ "gap-x": S() }],
			"gap-y": [{ "gap-y": S() }],
			"justify-content": [{ justify: [...T(), "normal"] }],
			"justify-items": [{ "justify-items": [...E(), "normal"] }],
			"justify-self": [{ "justify-self": ["auto", ...E()] }],
			"align-content": [{ content: ["normal", ...T()] }],
			"align-items": [{ items: [...E(), { baseline: ["", "last"] }] }],
			"align-self": [{ self: [
				"auto",
				...E(),
				{ baseline: ["", "last"] }
			] }],
			"place-content": [{ "place-content": T() }],
			"place-items": [{ "place-items": [...E(), "baseline"] }],
			"place-self": [{ "place-self": ["auto", ...E()] }],
			p: [{ p: S() }],
			px: [{ px: S() }],
			py: [{ py: S() }],
			ps: [{ ps: S() }],
			pe: [{ pe: S() }],
			pbs: [{ pbs: S() }],
			pbe: [{ pbe: S() }],
			pt: [{ pt: S() }],
			pr: [{ pr: S() }],
			pb: [{ pb: S() }],
			pl: [{ pl: S() }],
			m: [{ m: D() }],
			mx: [{ mx: D() }],
			my: [{ my: D() }],
			ms: [{ ms: D() }],
			me: [{ me: D() }],
			mbs: [{ mbs: D() }],
			mbe: [{ mbe: D() }],
			mt: [{ mt: D() }],
			mr: [{ mr: D() }],
			mb: [{ mb: D() }],
			ml: [{ ml: D() }],
			"space-x": [{ "space-x": S() }],
			"space-x-reverse": ["space-x-reverse"],
			"space-y": [{ "space-y": S() }],
			"space-y-reverse": ["space-y-reverse"],
			size: [{ size: O() }],
			"inline-size": [{ inline: ["auto", ...ae()] }],
			"min-inline-size": [{ "min-inline": ["auto", ...ae()] }],
			"max-inline-size": [{ "max-inline": ["none", ...ae()] }],
			"block-size": [{ block: ["auto", ...oe()] }],
			"min-block-size": [{ "min-block": ["auto", ...oe()] }],
			"max-block-size": [{ "max-block": ["none", ...oe()] }],
			w: [{ w: [
				s,
				"screen",
				...O()
			] }],
			"min-w": [{ "min-w": [
				s,
				"screen",
				"none",
				...O()
			] }],
			"max-w": [{ "max-w": [
				s,
				"screen",
				"none",
				"prose",
				{ screen: [o] },
				...O()
			] }],
			h: [{ h: [
				"screen",
				"lh",
				...O()
			] }],
			"min-h": [{ "min-h": [
				"screen",
				"lh",
				"none",
				...O()
			] }],
			"max-h": [{ "max-h": [
				"screen",
				"lh",
				...O()
			] }],
			"font-size": [{ text: [
				"base",
				n,
				sn,
				$t
			] }],
			"font-smoothing": ["antialiased", "subpixel-antialiased"],
			"font-style": ["italic", "not-italic"],
			"font-weight": [{ font: [
				r,
				pn,
				tn
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
				Ut,
				I
			] }],
			"font-family": [{ font: [
				cn,
				nn,
				t
			] }],
			"font-features": [{ "font-features": [I] }],
			"fvn-normal": ["normal-nums"],
			"fvn-ordinal": ["ordinal"],
			"fvn-slashed-zero": ["slashed-zero"],
			"fvn-figure": ["lining-nums", "oldstyle-nums"],
			"fvn-spacing": ["proportional-nums", "tabular-nums"],
			"fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
			tracking: [{ tracking: [
				i,
				L,
				I
			] }],
			"line-clamp": [{ "line-clamp": [
				F,
				"none",
				L,
				en
			] }],
			leading: [{ leading: [a, ...S()] }],
			"list-image": [{ "list-image": [
				"none",
				L,
				I
			] }],
			"list-style-position": [{ list: ["inside", "outside"] }],
			"list-style-type": [{ list: [
				"disc",
				"decimal",
				"none",
				L,
				I
			] }],
			"text-alignment": [{ text: [
				"left",
				"center",
				"right",
				"justify",
				"start",
				"end"
			] }],
			"placeholder-color": [{ placeholder: k() }],
			"text-color": [{ text: k() }],
			"text-decoration": [
				"underline",
				"overline",
				"line-through",
				"no-underline"
			],
			"text-decoration-style": [{ decoration: [...M(), "wavy"] }],
			"text-decoration-thickness": [{ decoration: [
				F,
				"from-font",
				"auto",
				L,
				$t
			] }],
			"text-decoration-color": [{ decoration: k() }],
			"underline-offset": [{ "underline-offset": [
				F,
				"auto",
				L,
				I
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
			indent: [{ indent: S() }],
			"tab-size": [{ tab: [
				Ht,
				L,
				I
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
				L,
				I
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
				L,
				I
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
			"bg-position": [{ bg: A() }],
			"bg-repeat": [{ bg: se() }],
			"bg-size": [{ bg: ce() }],
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
						Ht,
						L,
						I
					],
					radial: [
						"",
						L,
						I
					],
					conic: [
						Ht,
						L,
						I
					]
				},
				dn,
				an
			] }],
			"bg-color": [{ bg: k() }],
			"gradient-from-pos": [{ from: le() }],
			"gradient-via-pos": [{ via: le() }],
			"gradient-to-pos": [{ to: le() }],
			"gradient-from": [{ from: k() }],
			"gradient-via": [{ via: k() }],
			"gradient-to": [{ to: k() }],
			rounded: [{ rounded: ue() }],
			"rounded-s": [{ "rounded-s": ue() }],
			"rounded-e": [{ "rounded-e": ue() }],
			"rounded-t": [{ "rounded-t": ue() }],
			"rounded-r": [{ "rounded-r": ue() }],
			"rounded-b": [{ "rounded-b": ue() }],
			"rounded-l": [{ "rounded-l": ue() }],
			"rounded-ss": [{ "rounded-ss": ue() }],
			"rounded-se": [{ "rounded-se": ue() }],
			"rounded-ee": [{ "rounded-ee": ue() }],
			"rounded-es": [{ "rounded-es": ue() }],
			"rounded-tl": [{ "rounded-tl": ue() }],
			"rounded-tr": [{ "rounded-tr": ue() }],
			"rounded-br": [{ "rounded-br": ue() }],
			"rounded-bl": [{ "rounded-bl": ue() }],
			"border-w": [{ border: j() }],
			"border-w-x": [{ "border-x": j() }],
			"border-w-y": [{ "border-y": j() }],
			"border-w-s": [{ "border-s": j() }],
			"border-w-e": [{ "border-e": j() }],
			"border-w-bs": [{ "border-bs": j() }],
			"border-w-be": [{ "border-be": j() }],
			"border-w-t": [{ "border-t": j() }],
			"border-w-r": [{ "border-r": j() }],
			"border-w-b": [{ "border-b": j() }],
			"border-w-l": [{ "border-l": j() }],
			"divide-x": [{ "divide-x": j() }],
			"divide-x-reverse": ["divide-x-reverse"],
			"divide-y": [{ "divide-y": j() }],
			"divide-y-reverse": ["divide-y-reverse"],
			"border-style": [{ border: [
				...M(),
				"hidden",
				"none"
			] }],
			"divide-style": [{ divide: [
				...M(),
				"hidden",
				"none"
			] }],
			"border-color": [{ border: k() }],
			"border-color-x": [{ "border-x": k() }],
			"border-color-y": [{ "border-y": k() }],
			"border-color-s": [{ "border-s": k() }],
			"border-color-e": [{ "border-e": k() }],
			"border-color-bs": [{ "border-bs": k() }],
			"border-color-be": [{ "border-be": k() }],
			"border-color-t": [{ "border-t": k() }],
			"border-color-r": [{ "border-r": k() }],
			"border-color-b": [{ "border-b": k() }],
			"border-color-l": [{ "border-l": k() }],
			"divide-color": [{ divide: k() }],
			"outline-style": [{ outline: [
				...M(),
				"none",
				"hidden"
			] }],
			"outline-offset": [{ "outline-offset": [
				F,
				L,
				I
			] }],
			"outline-w": [{ outline: [
				"",
				F,
				sn,
				$t
			] }],
			"outline-color": [{ outline: k() }],
			shadow: [{ shadow: [
				"",
				"none",
				u,
				fn,
				on
			] }],
			"shadow-color": [{ shadow: k() }],
			"inset-shadow": [{ "inset-shadow": [
				"none",
				d,
				fn,
				on
			] }],
			"inset-shadow-color": [{ "inset-shadow": k() }],
			"ring-w": [{ ring: j() }],
			"ring-w-inset": ["ring-inset"],
			"ring-color": [{ ring: k() }],
			"ring-offset-w": [{ "ring-offset": [F, $t] }],
			"ring-offset-color": [{ "ring-offset": k() }],
			"inset-ring-w": [{ "inset-ring": j() }],
			"inset-ring-color": [{ "inset-ring": k() }],
			"text-shadow": [{ "text-shadow": [
				"none",
				f,
				fn,
				on
			] }],
			"text-shadow-color": [{ "text-shadow": k() }],
			opacity: [{ opacity: [
				F,
				L,
				I
			] }],
			"mix-blend": [{ "mix-blend": [
				...de(),
				"plus-darker",
				"plus-lighter"
			] }],
			"bg-blend": [{ "bg-blend": de() }],
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
			"mask-image-linear-pos": [{ "mask-linear": [F] }],
			"mask-image-linear-from-pos": [{ "mask-linear-from": fe() }],
			"mask-image-linear-to-pos": [{ "mask-linear-to": fe() }],
			"mask-image-linear-from-color": [{ "mask-linear-from": k() }],
			"mask-image-linear-to-color": [{ "mask-linear-to": k() }],
			"mask-image-t-from-pos": [{ "mask-t-from": fe() }],
			"mask-image-t-to-pos": [{ "mask-t-to": fe() }],
			"mask-image-t-from-color": [{ "mask-t-from": k() }],
			"mask-image-t-to-color": [{ "mask-t-to": k() }],
			"mask-image-r-from-pos": [{ "mask-r-from": fe() }],
			"mask-image-r-to-pos": [{ "mask-r-to": fe() }],
			"mask-image-r-from-color": [{ "mask-r-from": k() }],
			"mask-image-r-to-color": [{ "mask-r-to": k() }],
			"mask-image-b-from-pos": [{ "mask-b-from": fe() }],
			"mask-image-b-to-pos": [{ "mask-b-to": fe() }],
			"mask-image-b-from-color": [{ "mask-b-from": k() }],
			"mask-image-b-to-color": [{ "mask-b-to": k() }],
			"mask-image-l-from-pos": [{ "mask-l-from": fe() }],
			"mask-image-l-to-pos": [{ "mask-l-to": fe() }],
			"mask-image-l-from-color": [{ "mask-l-from": k() }],
			"mask-image-l-to-color": [{ "mask-l-to": k() }],
			"mask-image-x-from-pos": [{ "mask-x-from": fe() }],
			"mask-image-x-to-pos": [{ "mask-x-to": fe() }],
			"mask-image-x-from-color": [{ "mask-x-from": k() }],
			"mask-image-x-to-color": [{ "mask-x-to": k() }],
			"mask-image-y-from-pos": [{ "mask-y-from": fe() }],
			"mask-image-y-to-pos": [{ "mask-y-to": fe() }],
			"mask-image-y-from-color": [{ "mask-y-from": k() }],
			"mask-image-y-to-color": [{ "mask-y-to": k() }],
			"mask-image-radial": [{ "mask-radial": [L, I] }],
			"mask-image-radial-from-pos": [{ "mask-radial-from": fe() }],
			"mask-image-radial-to-pos": [{ "mask-radial-to": fe() }],
			"mask-image-radial-from-color": [{ "mask-radial-from": k() }],
			"mask-image-radial-to-color": [{ "mask-radial-to": k() }],
			"mask-image-radial-shape": [{ "mask-radial": ["circle", "ellipse"] }],
			"mask-image-radial-size": [{ "mask-radial": [{
				closest: ["side", "corner"],
				farthest: ["side", "corner"]
			}] }],
			"mask-image-radial-pos": [{ "mask-radial-at": b() }],
			"mask-image-conic-pos": [{ "mask-conic": [F] }],
			"mask-image-conic-from-pos": [{ "mask-conic-from": fe() }],
			"mask-image-conic-to-pos": [{ "mask-conic-to": fe() }],
			"mask-image-conic-from-color": [{ "mask-conic-from": k() }],
			"mask-image-conic-to-color": [{ "mask-conic-to": k() }],
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
			"mask-position": [{ mask: A() }],
			"mask-repeat": [{ mask: se() }],
			"mask-size": [{ mask: ce() }],
			"mask-type": [{ "mask-type": ["alpha", "luminance"] }],
			"mask-image": [{ mask: [
				"none",
				L,
				I
			] }],
			filter: [{ filter: [
				"",
				"none",
				L,
				I
			] }],
			blur: [{ blur: pe() }],
			brightness: [{ brightness: [
				F,
				L,
				I
			] }],
			contrast: [{ contrast: [
				F,
				L,
				I
			] }],
			"drop-shadow": [{ "drop-shadow": [
				"",
				"none",
				p,
				fn,
				on
			] }],
			"drop-shadow-color": [{ "drop-shadow": k() }],
			grayscale: [{ grayscale: [
				"",
				F,
				L,
				I
			] }],
			"hue-rotate": [{ "hue-rotate": [
				F,
				L,
				I
			] }],
			invert: [{ invert: [
				"",
				F,
				L,
				I
			] }],
			saturate: [{ saturate: [
				F,
				L,
				I
			] }],
			sepia: [{ sepia: [
				"",
				F,
				L,
				I
			] }],
			"backdrop-filter": [{ "backdrop-filter": [
				"",
				"none",
				L,
				I
			] }],
			"backdrop-blur": [{ "backdrop-blur": pe() }],
			"backdrop-brightness": [{ "backdrop-brightness": [
				F,
				L,
				I
			] }],
			"backdrop-contrast": [{ "backdrop-contrast": [
				F,
				L,
				I
			] }],
			"backdrop-grayscale": [{ "backdrop-grayscale": [
				"",
				F,
				L,
				I
			] }],
			"backdrop-hue-rotate": [{ "backdrop-hue-rotate": [
				F,
				L,
				I
			] }],
			"backdrop-invert": [{ "backdrop-invert": [
				"",
				F,
				L,
				I
			] }],
			"backdrop-opacity": [{ "backdrop-opacity": [
				F,
				L,
				I
			] }],
			"backdrop-saturate": [{ "backdrop-saturate": [
				F,
				L,
				I
			] }],
			"backdrop-sepia": [{ "backdrop-sepia": [
				"",
				F,
				L,
				I
			] }],
			"border-collapse": [{ border: ["collapse", "separate"] }],
			"border-spacing": [{ "border-spacing": S() }],
			"border-spacing-x": [{ "border-spacing-x": S() }],
			"border-spacing-y": [{ "border-spacing-y": S() }],
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
				L,
				I
			] }],
			"transition-behavior": [{ transition: ["normal", "discrete"] }],
			duration: [{ duration: [
				F,
				"initial",
				L,
				I
			] }],
			ease: [{ ease: [
				"linear",
				"initial",
				_,
				L,
				I
			] }],
			delay: [{ delay: [
				F,
				L,
				I
			] }],
			animate: [{ animate: [
				"none",
				v,
				L,
				I
			] }],
			backface: [{ backface: ["hidden", "visible"] }],
			perspective: [{ perspective: [
				h,
				L,
				I
			] }],
			"perspective-origin": [{ "perspective-origin": x() }],
			rotate: [{ rotate: me() }],
			"rotate-x": [{ "rotate-x": me() }],
			"rotate-y": [{ "rotate-y": me() }],
			"rotate-z": [{ "rotate-z": me() }],
			scale: [{ scale: he() }],
			"scale-x": [{ "scale-x": he() }],
			"scale-y": [{ "scale-y": he() }],
			"scale-z": [{ "scale-z": he() }],
			"scale-3d": ["scale-3d"],
			skew: [{ skew: ge() }],
			"skew-x": [{ "skew-x": ge() }],
			"skew-y": [{ "skew-y": ge() }],
			transform: [{ transform: [
				L,
				I,
				"",
				"none",
				"gpu",
				"cpu"
			] }],
			"transform-origin": [{ origin: x() }],
			"transform-style": [{ transform: ["3d", "flat"] }],
			translate: [{ translate: _e() }],
			"translate-x": [{ "translate-x": _e() }],
			"translate-y": [{ "translate-y": _e() }],
			"translate-z": [{ "translate-z": _e() }],
			"translate-none": ["translate-none"],
			zoom: [{ zoom: [
				Ht,
				L,
				I
			] }],
			accent: [{ accent: k() }],
			appearance: [{ appearance: ["none", "auto"] }],
			"caret-color": [{ caret: k() }],
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
				L,
				I
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
			"scrollbar-thumb-color": [{ "scrollbar-thumb": k() }],
			"scrollbar-track-color": [{ "scrollbar-track": k() }],
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
			"scroll-m": [{ "scroll-m": S() }],
			"scroll-mx": [{ "scroll-mx": S() }],
			"scroll-my": [{ "scroll-my": S() }],
			"scroll-ms": [{ "scroll-ms": S() }],
			"scroll-me": [{ "scroll-me": S() }],
			"scroll-mbs": [{ "scroll-mbs": S() }],
			"scroll-mbe": [{ "scroll-mbe": S() }],
			"scroll-mt": [{ "scroll-mt": S() }],
			"scroll-mr": [{ "scroll-mr": S() }],
			"scroll-mb": [{ "scroll-mb": S() }],
			"scroll-ml": [{ "scroll-ml": S() }],
			"scroll-p": [{ "scroll-p": S() }],
			"scroll-px": [{ "scroll-px": S() }],
			"scroll-py": [{ "scroll-py": S() }],
			"scroll-ps": [{ "scroll-ps": S() }],
			"scroll-pe": [{ "scroll-pe": S() }],
			"scroll-pbs": [{ "scroll-pbs": S() }],
			"scroll-pbe": [{ "scroll-pbe": S() }],
			"scroll-pt": [{ "scroll-pt": S() }],
			"scroll-pr": [{ "scroll-pr": S() }],
			"scroll-pb": [{ "scroll-pb": S() }],
			"scroll-pl": [{ "scroll-pl": S() }],
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
				L,
				I
			] }],
			fill: [{ fill: ["none", ...k()] }],
			"stroke-w": [{ stroke: [
				F,
				sn,
				$t,
				en
			] }],
			stroke: [{ stroke: ["none", ...k()] }],
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
function Tn(...e) {
	return wn(Ye(e));
}
//#endregion
//#region src/components/ui/badge.tsx
var En = Qe("group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-none border-0 bg-transparent px-0 py-0 text-[0.625rem] font-semibold tracking-widest whitespace-nowrap uppercase transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-0 has-data-[icon=inline-start]:pl-0 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!", {
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
function Dn({ className: e, variant: t = "default", render: n, ...r }) {
	return qe({
		defaultTagName: "span",
		props: le({ className: Tn(En({ variant: t }), e) }, r),
		render: n,
		state: {
			slot: "badge",
			variant: t
		}
	});
}
//#endregion
//#region node_modules/.pnpm/react@19.2.6/node_modules/react/cjs/react-jsx-runtime.production.js
var On = /* @__PURE__ */ o(((e) => {
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
})), kn = /* @__PURE__ */ o(((e) => {
	process.env.NODE_ENV !== "production" && (function() {
		function t(e) {
			if (e == null) return null;
			if (typeof e == "function") return e.$$typeof === ie ? null : e.displayName || e.name || null;
			if (typeof e == "string") return e;
			switch (e) {
				case v: return "Fragment";
				case b: return "Profiler";
				case y: return "StrictMode";
				case S: return "Suspense";
				case C: return "SuspenseList";
				case w: return "Activity";
			}
			if (typeof e == "object") switch (typeof e.tag == "number" && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), e.$$typeof) {
				case _: return "Portal";
				case ee: return e.displayName || "Context";
				case x: return (e._context.displayName || "Context") + ".Consumer";
				case te:
					var n = e.render;
					return e = e.displayName, e ||= (e = n.displayName || n.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
				case ne: return n = e.displayName || null, n === null ? t(e.type) || "Memo" : n;
				case re:
					n = e._payload, e = e._init;
					try {
						return t(e(n));
					} catch {}
			}
			return null;
		}
		function n(e) {
			return "" + e;
		}
		function r(e) {
			try {
				n(e);
				var t = !1;
			} catch {
				t = !0;
			}
			if (t) {
				t = console;
				var r = t.error, i = typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
				return r.call(t, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", i), n(e);
			}
		}
		function i(e) {
			if (e === v) return "<>";
			if (typeof e == "object" && e && e.$$typeof === re) return "<...>";
			try {
				var n = t(e);
				return n ? "<" + n + ">" : "<...>";
			} catch {
				return "<...>";
			}
		}
		function a() {
			var e = T.A;
			return e === null ? null : e.getOwner();
		}
		function o() {
			return Error("react-stack-top-frame");
		}
		function s(e) {
			if (E.call(e, "key")) {
				var t = Object.getOwnPropertyDescriptor(e, "key").get;
				if (t && t.isReactWarning) return !1;
			}
			return e.key !== void 0;
		}
		function c(e, t) {
			function n() {
				ae || (ae = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", t));
			}
			n.isReactWarning = !0, Object.defineProperty(e, "key", {
				get: n,
				configurable: !0
			});
		}
		function l() {
			var e = t(this.type);
			return oe[e] || (oe[e] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release.")), e = this.props.ref, e === void 0 ? null : e;
		}
		function u(e, t, n, r, i, a) {
			var o = n.ref;
			return e = {
				$$typeof: g,
				type: e,
				key: t,
				props: n,
				_owner: r
			}, (o === void 0 ? null : o) === null ? Object.defineProperty(e, "ref", {
				enumerable: !1,
				value: null
			}) : Object.defineProperty(e, "ref", {
				enumerable: !1,
				get: l
			}), e._store = {}, Object.defineProperty(e._store, "validated", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: 0
			}), Object.defineProperty(e, "_debugInfo", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: null
			}), Object.defineProperty(e, "_debugStack", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: i
			}), Object.defineProperty(e, "_debugTask", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: a
			}), Object.freeze && (Object.freeze(e.props), Object.freeze(e)), e;
		}
		function f(e, n, i, o, l, d) {
			var f = n.children;
			if (f !== void 0) if (o) if (D(f)) {
				for (o = 0; o < f.length; o++) p(f[o]);
				Object.freeze && Object.freeze(f);
			} else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
			else p(f);
			if (E.call(n, "key")) {
				f = t(e);
				var m = Object.keys(n).filter(function(e) {
					return e !== "key";
				});
				o = 0 < m.length ? "{key: someKey, " + m.join(": ..., ") + ": ...}" : "{key: someKey}", se[f + o] || (m = 0 < m.length ? "{" + m.join(": ..., ") + ": ...}" : "{}", console.error("A props object containing a \"key\" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />", o, f, m, f), se[f + o] = !0);
			}
			if (f = null, i !== void 0 && (r(i), f = "" + i), s(n) && (r(n.key), f = "" + n.key), "key" in n) for (var h in i = {}, n) h !== "key" && (i[h] = n[h]);
			else i = n;
			return f && c(i, typeof e == "function" ? e.displayName || e.name || "Unknown" : e), u(e, f, i, a(), l, d);
		}
		function p(e) {
			m(e) ? e._store && (e._store.validated = 1) : typeof e == "object" && e && e.$$typeof === re && (e._payload.status === "fulfilled" ? m(e._payload.value) && e._payload.value._store && (e._payload.value._store.validated = 1) : e._store && (e._store.validated = 1));
		}
		function m(e) {
			return typeof e == "object" && !!e && e.$$typeof === g;
		}
		var h = d(), g = Symbol.for("react.transitional.element"), _ = Symbol.for("react.portal"), v = Symbol.for("react.fragment"), y = Symbol.for("react.strict_mode"), b = Symbol.for("react.profiler"), x = Symbol.for("react.consumer"), ee = Symbol.for("react.context"), te = Symbol.for("react.forward_ref"), S = Symbol.for("react.suspense"), C = Symbol.for("react.suspense_list"), ne = Symbol.for("react.memo"), re = Symbol.for("react.lazy"), w = Symbol.for("react.activity"), ie = Symbol.for("react.client.reference"), T = h.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, E = Object.prototype.hasOwnProperty, D = Array.isArray, O = console.createTask ? console.createTask : function() {
			return null;
		};
		h = { react_stack_bottom_frame: function(e) {
			return e();
		} };
		var ae, oe = {}, k = h.react_stack_bottom_frame.bind(h, o)(), A = O(i(o)), se = {};
		e.Fragment = v, e.jsx = function(e, t, n) {
			var r = 1e4 > T.recentlyCreatedOwnerStacks++;
			return f(e, t, n, !1, r ? Error("react-stack-top-frame") : k, r ? O(i(e)) : A);
		}, e.jsxs = function(e, t, n) {
			var r = 1e4 > T.recentlyCreatedOwnerStacks++;
			return f(e, t, n, !0, r ? Error("react-stack-top-frame") : k, r ? O(i(e)) : A);
		};
	})();
})), An = (/* @__PURE__ */ o(((e, t) => {
	process.env.NODE_ENV === "production" ? t.exports = On() : t.exports = kn();
})))();
function jn({ className: e, size: t = "default", ...n }) {
	return /* @__PURE__ */ (0, An.jsx)("div", {
		"data-slot": "card",
		"data-size": t,
		className: Tn("group/card flex flex-col gap-8 overflow-hidden bg-card py-8 text-sm text-card-foreground shadow-sm ring-1 ring-foreground/5 has-[>img:first-child]:pt-0 data-[size=sm]:gap-5 data-[size=sm]:py-5 *:[img:first-child]:rounded-none *:[img:last-child]:rounded-none", e),
		...n
	});
}
function Mn({ className: e, ...t }) {
	return /* @__PURE__ */ (0, An.jsx)("div", {
		"data-slot": "card-header",
		className: Tn("group/card-header @container/card-header grid auto-rows-min items-start gap-1.5 rounded-none px-8 group-data-[size=sm]/card:px-5 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-8 group-data-[size=sm]/card:[.border-b]:pb-5", e),
		...t
	});
}
function Nn({ className: e, ...t }) {
	return /* @__PURE__ */ (0, An.jsx)("div", {
		"data-slot": "card-title",
		className: Tn("font-heading text-lg font-semibold tracking-wider uppercase", e),
		...t
	});
}
function Pn({ className: e, ...t }) {
	return /* @__PURE__ */ (0, An.jsx)("div", {
		"data-slot": "card-content",
		className: Tn("px-8 group-data-[size=sm]/card:px-5", e),
		...t
	});
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.2.9_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/utils/esm/safeReact.js
var Fn = { ...x }, In = Fn.useInsertionEffect, Ln = In && In !== Fn.useLayoutEffect ? In : (e) => e();
function Rn(e) {
	let t = Se(zn).current;
	return t.next = e, Ln(t.effect), t.trampoline;
}
function zn() {
	let e = {
		next: void 0,
		callback: Bn,
		trampoline: (...t) => e.callback?.(...t),
		effect: () => {
			e.callback = e.next;
		}
	};
	return e;
}
function Bn() {
	if (process.env.NODE_ENV !== "production") throw Error("Base UI: Cannot call an event handler while rendering.");
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.2.9_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/utils/esm/useOnMount.js
var Vn = [];
function Hn(e) {
	x.useEffect(e, Vn);
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.2.9_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/utils/esm/useTimeout.js
var Un = 0, Wn = class e {
	static create() {
		return new e();
	}
	currentId = Un;
	start(e, t) {
		this.clear(), this.currentId = setTimeout(() => {
			this.currentId = Un, t();
		}, e);
	}
	isStarted() {
		return this.currentId !== Un;
	}
	clear = () => {
		this.currentId !== Un && (clearTimeout(this.currentId), this.currentId = Un);
	};
	disposeEffect = () => this.clear;
};
function Gn() {
	let e = Se(Wn.create).current;
	return Hn(e.disposeEffect), e;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/scroll-area/root/ScrollAreaRootContext.js
var Kn = /* @__PURE__ */ x.createContext(void 0);
process.env.NODE_ENV !== "production" && (Kn.displayName = "ScrollAreaRootContext");
function qn() {
	let e = x.useContext(Kn);
	if (e === void 0) throw Error(process.env.NODE_ENV === "production" ? xe(53) : "Base UI: ScrollAreaRootContext is missing. ScrollArea parts must be placed within <ScrollArea.Root>.");
	return e;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/scroll-area/root/ScrollAreaRootCssVars.js
var Jn = /* @__PURE__ */ function(e) {
	return e.scrollAreaCornerHeight = "--scroll-area-corner-height", e.scrollAreaCornerWidth = "--scroll-area-corner-width", e;
}({});
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/scroll-area/utils/getOffset.js
function Yn(e, t, n) {
	if (!e) return 0;
	let r = getComputedStyle(e), i = n === "x" ? "Inline" : "Block";
	return n === "x" && t === "margin" ? parseFloat(r[`${t}InlineStart`]) * 2 : parseFloat(r[`${t}${i}Start`]) + parseFloat(r[`${t}${i}End`]);
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/scroll-area/scrollbar/ScrollAreaScrollbarDataAttributes.js
var Xn = /* @__PURE__ */ function(e) {
	return e.orientation = "data-orientation", e.hovering = "data-hovering", e.scrolling = "data-scrolling", e.hasOverflowX = "data-has-overflow-x", e.hasOverflowY = "data-has-overflow-y", e.overflowXStart = "data-overflow-x-start", e.overflowXEnd = "data-overflow-x-end", e.overflowYStart = "data-overflow-y-start", e.overflowYEnd = "data-overflow-y-end", e;
}({}), Zn = "base-ui-disable-scrollbar", Qn = {
	className: Zn,
	getElement(e) {
		return /* @__PURE__ */ (0, An.jsx)("style", {
			nonce: e,
			href: Zn,
			precedence: "base-ui:low",
			children: `.${Zn}{scrollbar-width:none}.${Zn}::-webkit-scrollbar{display:none}`
		});
	}
};
process.env.NODE_ENV !== "production" && (Qn.getElement.displayName = "styleDisableScrollbar.getElement");
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.2.9_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/utils/esm/useId.js
var $n = 0;
function er(e, t = "mui") {
	let [n, r] = x.useState(e), i = e || n;
	return x.useEffect(() => {
		n ?? ($n += 1, r(`${t}-${$n}`));
	}, [n, t]), i;
}
var tr = Fn.useId;
function nr(e, t) {
	if (tr !== void 0) {
		let n = tr();
		return e ?? (t ? `${t}-${n}` : n);
	}
	return er(e, t);
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/internals/useBaseUiId.js
function rr(e) {
	return nr(e, "base-ui");
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/scroll-area/root/ScrollAreaRootDataAttributes.js
var ir = /* @__PURE__ */ function(e) {
	return e.scrolling = "data-scrolling", e.hasOverflowX = "data-has-overflow-x", e.hasOverflowY = "data-has-overflow-y", e.overflowXStart = "data-overflow-x-start", e.overflowXEnd = "data-overflow-x-end", e.overflowYStart = "data-overflow-y-start", e.overflowYEnd = "data-overflow-y-end", e;
}({}), ar = {
	hasOverflowX: (e) => e ? { [ir.hasOverflowX]: "" } : null,
	hasOverflowY: (e) => e ? { [ir.hasOverflowY]: "" } : null,
	overflowXStart: (e) => e ? { [ir.overflowXStart]: "" } : null,
	overflowXEnd: (e) => e ? { [ir.overflowXEnd]: "" } : null,
	overflowYStart: (e) => e ? { [ir.overflowYStart]: "" } : null,
	overflowYEnd: (e) => e ? { [ir.overflowYEnd]: "" } : null,
	cornerHidden: () => null
};
//#endregion
//#region node_modules/.pnpm/@floating-ui+utils@0.2.11/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
function or() {
	return typeof window < "u";
}
function sr(e) {
	var t;
	return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function cr(e) {
	return !or() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof sr(e).ShadowRoot;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.2.9_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/utils/esm/detectBrowser.js
var lr = typeof navigator < "u", ur = mr(), dr = gr(), fr = hr(), pr = typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter:none");
ur.platform === "MacIntel" && ur.maxTouchPoints > 1 || /iP(hone|ad|od)|iOS/.test(ur.platform), lr && /firefox/i.test(fr), lr && /apple/i.test(navigator.vendor), lr && /Edg/i.test(fr), lr && /android/i.test(dr) || /android/i.test(fr), lr && dr.toLowerCase().startsWith("mac") && navigator.maxTouchPoints, fr.includes("jsdom/");
function mr() {
	if (!lr) return {
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
function hr() {
	if (!lr) return "";
	let e = navigator.userAgentData;
	return e && Array.isArray(e.brands) ? e.brands.map(({ brand: e, version: t }) => `${e}/${t}`).join(" ") : navigator.userAgent;
}
function gr() {
	if (!lr) return "";
	let e = navigator.userAgentData;
	return e?.platform ? e.platform : navigator.platform ?? "";
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/internals/shadowDom.js
function _r(e, t) {
	if (!e || !t) return !1;
	let n = t.getRootNode?.();
	if (e.contains(t)) return !0;
	if (n && cr(n)) {
		let n = t;
		for (; n;) {
			if (e === n) return !0;
			n = n.parentNode || n.host;
		}
	}
	return !1;
}
function vr(e) {
	return "composedPath" in e ? e.composedPath()[0] : e.target;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/internals/csp-context/CSPContext.js
var yr = /* @__PURE__ */ x.createContext(void 0);
process.env.NODE_ENV !== "production" && (yr.displayName = "CSPContext");
var br = { disableStyleElements: !1 };
function xr() {
	return x.useContext(yr) ?? br;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/scroll-area/root/ScrollAreaRoot.js
var Sr = {
	x: 0,
	y: 0
}, Cr = {
	width: 0,
	height: 0
}, wr = {
	xStart: !1,
	xEnd: !1,
	yStart: !1,
	yEnd: !1
}, Tr = {
	x: !0,
	y: !0,
	corner: !0
}, Er = /* @__PURE__ */ x.forwardRef(function(e, t) {
	let { render: n, className: r, overflowEdgeThreshold: i, style: a, ...o } = e, s = Dr(i), c = rr(), l = Gn(), u = Gn(), { nonce: d, disableStyleElements: f } = xr(), [p, m] = x.useState(!1), [h, g] = x.useState(!1), [_, v] = x.useState(!1), [y, b] = x.useState(!1), [ee, te] = x.useState(!1), [S, C] = x.useState(Cr), [ne, re] = x.useState(Cr), [w, ie] = x.useState(wr), [T, E] = x.useState(Tr), D = x.useRef(null), O = x.useRef(null), ae = x.useRef(null), oe = x.useRef(null), k = x.useRef(null), A = x.useRef(null), se = x.useRef(null), ce = x.useRef(!1), le = x.useRef(0), ue = x.useRef(0), j = x.useRef(0), M = x.useRef(0), de = x.useRef("vertical"), fe = x.useRef(Sr), pe = Rn((e) => {
		let t = e.x - fe.current.x, n = e.y - fe.current.y;
		fe.current = e, n !== 0 && (v(!0), l.start(500, () => {
			v(!1);
		})), t !== 0 && (g(!0), u.start(500, () => {
			g(!1);
		}));
	}), me = Rn((e) => {
		e.button === 0 && (ce.current = !0, le.current = e.clientY, ue.current = e.clientX, de.current = e.currentTarget.getAttribute(Xn.orientation), O.current && (j.current = O.current.scrollTop, M.current = O.current.scrollLeft), k.current && de.current === "vertical" && k.current.setPointerCapture(e.pointerId), A.current && de.current === "horizontal" && A.current.setPointerCapture(e.pointerId));
	}), he = Rn((e) => {
		if (!ce.current) return;
		let t = e.clientY - le.current, n = e.clientX - ue.current;
		if (O.current) {
			let r = O.current.scrollHeight, i = O.current.clientHeight, a = O.current.scrollWidth, o = O.current.clientWidth;
			if (k.current && ae.current && de.current === "vertical") {
				let n = Yn(ae.current, "padding", "y"), a = Yn(k.current, "margin", "y"), o = k.current.offsetHeight, s = t / (ae.current.offsetHeight - o - n - a);
				O.current.scrollTop = j.current + s * (r - i), e.preventDefault(), v(!0), l.start(500, () => {
					v(!1);
				});
			}
			if (A.current && oe.current && de.current === "horizontal") {
				let t = Yn(oe.current, "padding", "x"), r = Yn(A.current, "margin", "x"), i = A.current.offsetWidth, s = n / (oe.current.offsetWidth - i - t - r);
				O.current.scrollLeft = M.current + s * (a - o), e.preventDefault(), g(!0), u.start(500, () => {
					g(!1);
				});
			}
		}
	}), ge = Rn((e) => {
		ce.current = !1, k.current && de.current === "vertical" && k.current.releasePointerCapture(e.pointerId), A.current && de.current === "horizontal" && A.current.releasePointerCapture(e.pointerId);
	});
	function _e(e) {
		b(e.pointerType === "touch");
	}
	function N(e) {
		_e(e), e.pointerType !== "touch" && m(_r(D.current, e.target));
	}
	let ve = x.useMemo(() => ({
		scrolling: h || _,
		hasOverflowX: !T.x,
		hasOverflowY: !T.y,
		overflowXStart: w.xStart,
		overflowXEnd: w.xEnd,
		overflowYStart: w.yStart,
		overflowYEnd: w.yEnd,
		cornerHidden: T.corner
	}), [
		h,
		_,
		T.x,
		T.y,
		T.corner,
		w
	]), ye = {
		role: "presentation",
		onPointerEnter: N,
		onPointerMove: N,
		onPointerDown: _e,
		onPointerLeave() {
			m(!1);
		},
		style: {
			position: "relative",
			[Jn.scrollAreaCornerHeight]: `${S.height}px`,
			[Jn.scrollAreaCornerWidth]: `${S.width}px`
		}
	}, be = Re("div", e, {
		state: ve,
		ref: [t, D],
		props: [ye, o],
		stateAttributesMapping: ar
	}), xe = x.useMemo(() => ({
		handlePointerDown: me,
		handlePointerMove: he,
		handlePointerUp: ge,
		handleScroll: pe,
		cornerSize: S,
		setCornerSize: C,
		thumbSize: ne,
		setThumbSize: re,
		hasMeasuredScrollbar: ee,
		setHasMeasuredScrollbar: te,
		touchModality: y,
		cornerRef: se,
		scrollingX: h,
		setScrollingX: g,
		scrollingY: _,
		setScrollingY: v,
		hovering: p,
		setHovering: m,
		viewportRef: O,
		rootRef: D,
		scrollbarYRef: ae,
		scrollbarXRef: oe,
		thumbYRef: k,
		thumbXRef: A,
		rootId: c,
		hiddenState: T,
		setHiddenState: E,
		overflowEdges: w,
		setOverflowEdges: ie,
		viewportState: ve,
		overflowEdgeThreshold: s
	}), [
		me,
		he,
		ge,
		pe,
		S,
		ne,
		ee,
		y,
		h,
		g,
		_,
		v,
		p,
		m,
		c,
		T,
		w,
		ve,
		s
	]);
	return /* @__PURE__ */ (0, An.jsxs)(Kn.Provider, {
		value: xe,
		children: [!f && Qn.getElement(d), be]
	});
});
process.env.NODE_ENV !== "production" && (Er.displayName = "ScrollAreaRoot");
function Dr(e) {
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
var Or = typeof document < "u" ? x.useLayoutEffect : () => {}, kr = /* @__PURE__ */ x.createContext(void 0);
process.env.NODE_ENV !== "production" && (kr.displayName = "ScrollAreaViewportContext");
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/internals/direction-context/DirectionContext.js
var Ar = /* @__PURE__ */ x.createContext(void 0);
process.env.NODE_ENV !== "production" && (Ar.displayName = "DirectionContext");
function jr() {
	return x.useContext(Ar)?.direction ?? "ltr";
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/internals/clamp.js
function Mr(e, t = -(2 ** 53 - 1), n = 2 ** 53 - 1) {
	return Math.max(t, Math.min(e, n));
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/scroll-area/viewport/ScrollAreaViewportCssVars.js
var Nr = /* @__PURE__ */ function(e) {
	return e.scrollAreaOverflowXStart = "--scroll-area-overflow-x-start", e.scrollAreaOverflowXEnd = "--scroll-area-overflow-x-end", e.scrollAreaOverflowYStart = "--scroll-area-overflow-y-start", e.scrollAreaOverflowYEnd = "--scroll-area-overflow-y-end", e;
}({});
function Pr(e, t) {
	if (t <= 0) return 0;
	let n = Mr(e, 0, t), r = n, i = t - n, a = r <= 1, o = i <= 1;
	return a && o ? r <= i ? 0 : t : a ? 0 : o ? t : n;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/scroll-area/viewport/ScrollAreaViewport.js
var Fr = !1;
function Ir() {
	Fr || pr || (typeof CSS < "u" && "registerProperty" in CSS && [
		Nr.scrollAreaOverflowXStart,
		Nr.scrollAreaOverflowXEnd,
		Nr.scrollAreaOverflowYStart,
		Nr.scrollAreaOverflowYEnd
	].forEach((e) => {
		try {
			CSS.registerProperty({
				name: e,
				syntax: "<length>",
				inherits: !1,
				initialValue: "0px"
			});
		} catch {}
	}), Fr = !0);
}
var Lr = /* @__PURE__ */ x.forwardRef(function(e, t) {
	let { render: n, className: r, style: i, ...a } = e, { viewportRef: o, scrollbarYRef: s, scrollbarXRef: c, thumbYRef: l, thumbXRef: u, cornerRef: d, cornerSize: f, setCornerSize: p, setThumbSize: m, rootId: h, setHiddenState: g, hiddenState: _, setHasMeasuredScrollbar: v, handleScroll: y, setHovering: b, setOverflowEdges: ee, overflowEdges: te, overflowEdgeThreshold: S, scrollingX: C, scrollingY: ne } = qn(), re = jr(), w = x.useRef(!0), ie = x.useRef([
		NaN,
		NaN,
		NaN,
		NaN
	]), T = Gn(), E = Gn(), D = Rn(() => {
		let e = o.current, t = s.current, n = c.current, r = l.current, i = u.current, a = d.current;
		if (!e) return;
		let h = e.scrollHeight, _ = e.scrollWidth, y = e.clientHeight, b = e.clientWidth, x = e.scrollTop, te = e.scrollLeft, C = ie.current, ne = Number.isNaN(C[0]);
		if (C[0] = y, C[1] = h, C[2] = b, C[3] = _, ne && v(!0), h === 0 || _ === 0) return;
		let w = Rr(e), T = w.y, E = w.x, D = b / _, O = y / h, ae = Math.max(0, _ - b), oe = Math.max(0, h - y), k = 0, A = 0;
		if (!E) {
			let e = 0;
			e = Mr(re === "rtl" ? -te : te, 0, ae), k = Pr(e, ae), A = ae - k;
		}
		let se = T ? 0 : Mr(x, 0, oe), ce = T ? 0 : Pr(se, oe), le = T ? 0 : oe - ce, ue = E ? 0 : b, j = T ? 0 : y, M = 0, de = 0;
		!E && !T && (M = t?.offsetWidth || 0, de = n?.offsetHeight || 0);
		let fe = f.width === 0 && f.height === 0, pe = fe ? M : 0, me = fe ? de : 0, he = Yn(n, "padding", "x"), ge = Yn(t, "padding", "y"), _e = Yn(i, "margin", "x"), N = Yn(r, "margin", "y"), ve = ue - he - _e, ye = j - ge - N, be = n ? Math.min(n.offsetWidth - pe, ve) : ve, xe = t ? Math.min(t.offsetHeight - me, ye) : ye, P = Math.max(16, be * D), Se = Math.max(16, xe * O);
		if (m((e) => e.height === Se && e.width === P ? e : {
			width: P,
			height: Se
		}), t && r) {
			let e = t.offsetHeight - Se - ge - N, n = h - y, i = n === 0 ? 0 : x / n, a = Math.min(e, Math.max(0, i * e));
			r.style.transform = `translate3d(0,${a}px,0)`;
		}
		if (n && i) {
			let e = n.offsetWidth - P - he - _e, t = _ - b, r = t === 0 ? 0 : te / t, a = re === "rtl" ? Mr(r * e, -e, 0) : Mr(r * e, 0, e);
			i.style.transform = `translate3d(${a}px,0,0)`;
		}
		let Ce = [
			[Nr.scrollAreaOverflowXStart, k],
			[Nr.scrollAreaOverflowXEnd, A],
			[Nr.scrollAreaOverflowYStart, ce],
			[Nr.scrollAreaOverflowYEnd, le]
		];
		for (let [t, n] of Ce) e.style.setProperty(t, `${n}px`);
		a && (E || T ? p({
			width: 0,
			height: 0
		}) : !E && !T && p({
			width: M,
			height: de
		})), g((e) => zr(e, w));
		let we = {
			xStart: !E && k > S.xStart,
			xEnd: !E && A > S.xEnd,
			yStart: !T && ce > S.yStart,
			yEnd: !T && le > S.yEnd
		};
		ee((e) => e.xStart === we.xStart && e.xEnd === we.xEnd && e.yStart === we.yStart && e.yEnd === we.yEnd ? e : we);
	});
	Or(() => {
		o.current && Ir();
	}, [o]), Or(() => {
		queueMicrotask(D);
	}, [
		D,
		_,
		re
	]), Or(() => {
		o.current?.matches(":hover") && b(!0);
	}, [o, b]), x.useEffect(() => {
		let e = o.current;
		if (typeof ResizeObserver > "u" || !e) return;
		let t = !1, n = new ResizeObserver(() => {
			if (!t) {
				t = !0;
				let n = ie.current;
				if (n[0] === e.clientHeight && n[1] === e.scrollHeight && n[2] === e.clientWidth && n[3] === e.scrollWidth) return;
			}
			D();
		});
		return n.observe(e), E.start(0, () => {
			let t = e.getAnimations({ subtree: !0 });
			t.length !== 0 && Promise.allSettled(t.map((e) => e.finished)).then(D).catch(() => {});
		}), () => {
			n.disconnect(), E.clear();
		};
	}, [
		D,
		o,
		E
	]);
	function O() {
		w.current = !1;
	}
	let ae = {
		role: "presentation",
		...h && { "data-id": `${h}-viewport` },
		tabIndex: _.x && _.y ? -1 : 0,
		className: Qn.className,
		style: { overflow: "scroll" },
		onScroll() {
			o.current && (D(), w.current || y({
				x: o.current.scrollLeft,
				y: o.current.scrollTop
			}), T.start(100, () => {
				w.current = !0;
			}));
		},
		onWheel: O,
		onTouchMove: O,
		onPointerMove: O,
		onPointerEnter: O,
		onKeyDown: O
	}, oe = x.useMemo(() => ({
		scrolling: C || ne,
		hasOverflowX: !_.x,
		hasOverflowY: !_.y,
		overflowXStart: te.xStart,
		overflowXEnd: te.xEnd,
		overflowYStart: te.yStart,
		overflowYEnd: te.yEnd,
		cornerHidden: _.corner
	}), [
		C,
		ne,
		_.x,
		_.y,
		_.corner,
		te
	]), k = Re("div", e, {
		ref: [t, o],
		state: oe,
		props: [ae, a],
		stateAttributesMapping: ar
	}), A = x.useMemo(() => ({ computeThumbPosition: D }), [D]);
	return /* @__PURE__ */ (0, An.jsx)(kr.Provider, {
		value: A,
		children: k
	});
});
process.env.NODE_ENV !== "production" && (Lr.displayName = "ScrollAreaViewport");
function Rr(e) {
	let t = e.clientHeight >= e.scrollHeight, n = e.clientWidth >= e.scrollWidth;
	return {
		y: t,
		x: n,
		corner: t || n
	};
}
function zr(e, t) {
	return e.y === t.y && e.x === t.x && e.corner === t.corner ? e : t;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.2.9_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/utils/esm/addEventListener.js
function Br(e, t, n, r) {
	return e.addEventListener(t, n, r), () => {
		e.removeEventListener(t, n, r);
	};
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/scroll-area/scrollbar/ScrollAreaScrollbarContext.js
var Vr = /* @__PURE__ */ x.createContext(void 0);
process.env.NODE_ENV !== "production" && (Vr.displayName = "ScrollAreaScrollbarContext");
function Hr() {
	let e = x.useContext(Vr);
	if (e === void 0) throw Error(process.env.NODE_ENV === "production" ? xe(54) : "Base UI: ScrollAreaScrollbarContext is missing. ScrollAreaScrollbar parts must be placed within <ScrollArea.Scrollbar>.");
	return e;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/scroll-area/scrollbar/ScrollAreaScrollbarCssVars.js
var Ur = /* @__PURE__ */ function(e) {
	return e.scrollAreaThumbHeight = "--scroll-area-thumb-height", e.scrollAreaThumbWidth = "--scroll-area-thumb-width", e;
}({}), Wr = /* @__PURE__ */ x.forwardRef(function(e, t) {
	let { render: n, className: r, orientation: i = "vertical", keepMounted: a = !1, style: o, ...s } = e, { hovering: c, scrollingX: l, scrollingY: u, hiddenState: d, overflowEdges: f, scrollbarYRef: p, scrollbarXRef: m, viewportRef: h, thumbYRef: g, thumbXRef: _, handlePointerDown: v, handlePointerUp: y, rootId: b, thumbSize: ee, hasMeasuredScrollbar: te } = qn(), S = {
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
	}, C = jr(), ne = !te && !a, re = i === "vertical" ? d.y : d.x, w = a || !re;
	x.useEffect(() => {
		if (!w) return;
		let e = h.current, t = i === "vertical" ? p.current : m.current;
		if (!t) return;
		function n(n) {
			if (!e || !t || n.ctrlKey) return;
			n.preventDefault();
			let r = i === "horizontal", a = r ? "scrollLeft" : "scrollTop", o = r ? n.deltaX : n.deltaY, s = r ? e.scrollWidth - e.clientWidth : e.scrollHeight - e.clientHeight, c = r && C === "rtl" ? -s : 0, l = r && C === "rtl" ? 0 : s, u = e[a];
			u <= c && o < 0 || u >= l && o > 0 || (e[a] = Math.min(l, Math.max(c, u + o)));
		}
		return Br(t, "wheel", n, { passive: !1 });
	}, [
		C,
		i,
		m,
		p,
		w,
		h
	]);
	let ie = {
		...b && { "data-id": `${b}-scrollbar` },
		onPointerDown(e) {
			if (e.button !== 0) return;
			let t = vr(e.nativeEvent), n = i === "vertical" ? g.current : _.current;
			if (!(n && _r(n, t)) && h.current) {
				if (g.current && p.current && i === "vertical") {
					let t = Yn(g.current, "margin", "y"), n = Yn(p.current, "padding", "y"), r = g.current.offsetHeight, i = p.current.getBoundingClientRect(), a = e.clientY - i.top - r / 2 - n + t / 2, o = h.current.scrollHeight, s = h.current.clientHeight, c = a / (p.current.offsetHeight - r - n - t) * (o - s);
					h.current.scrollTop = c;
				}
				if (_.current && m.current && i === "horizontal") {
					let t = Yn(_.current, "margin", "x"), n = Yn(m.current, "padding", "x"), r = _.current.offsetWidth, i = m.current.getBoundingClientRect(), a = e.clientX - i.left - r / 2 - n + t / 2, o = h.current.scrollWidth, s = h.current.clientWidth, c = a / (m.current.offsetWidth - r - n - t), l;
					C === "rtl" ? (l = (1 - c) * (o - s), h.current.scrollLeft <= 0 && (l = -l)) : l = c * (o - s), h.current.scrollLeft = l;
				}
				v(e);
			}
		},
		onPointerUp: y,
		style: {
			position: "absolute",
			touchAction: "none",
			WebkitUserSelect: "none",
			userSelect: "none",
			visibility: ne ? "hidden" : void 0,
			...i === "vertical" && {
				top: 0,
				bottom: `var(${Jn.scrollAreaCornerHeight})`,
				insetInlineEnd: 0,
				[Ur.scrollAreaThumbHeight]: `${ee.height}px`
			},
			...i === "horizontal" && {
				insetInlineStart: 0,
				insetInlineEnd: `var(${Jn.scrollAreaCornerWidth})`,
				bottom: 0,
				[Ur.scrollAreaThumbWidth]: `${ee.width}px`
			}
		}
	}, T = Re("div", e, {
		ref: [t, i === "vertical" ? p : m],
		state: S,
		props: [ie, s],
		stateAttributesMapping: ar
	}), E = x.useMemo(() => ({ orientation: i }), [i]);
	return w ? /* @__PURE__ */ (0, An.jsx)(Vr.Provider, {
		value: E,
		children: T
	}) : null;
});
process.env.NODE_ENV !== "production" && (Wr.displayName = "ScrollAreaScrollbar");
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/scroll-area/thumb/ScrollAreaThumb.js
var Gr = /* @__PURE__ */ x.forwardRef(function(e, t) {
	let { render: n, className: r, style: i, ...a } = e, { thumbYRef: o, thumbXRef: s, handlePointerDown: c, handlePointerMove: l, handlePointerUp: u, setScrollingX: d, setScrollingY: f, hasMeasuredScrollbar: p } = qn(), { orientation: m } = Hr();
	return Re("div", e, {
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
				...m === "vertical" && { height: `var(${Ur.scrollAreaThumbHeight})` },
				...m === "horizontal" && { width: `var(${Ur.scrollAreaThumbWidth})` }
			}
		}, a]
	});
});
process.env.NODE_ENV !== "production" && (Gr.displayName = "ScrollAreaThumb");
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.5.0_@types+react@19.2.15_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/@base-ui/react/esm/scroll-area/corner/ScrollAreaCorner.js
var Kr = /* @__PURE__ */ x.forwardRef(function(e, t) {
	let { render: n, className: r, style: i, ...a } = e, { cornerRef: o, cornerSize: s, hiddenState: c } = qn(), l = Re("div", e, {
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
process.env.NODE_ENV !== "production" && (Kr.displayName = "ScrollAreaCorner");
//#endregion
//#region src/components/ui/scroll-area.tsx
function qr({ className: e, children: t, ...n }) {
	return /* @__PURE__ */ (0, An.jsxs)(Er, {
		"data-slot": "scroll-area",
		className: Tn("relative", e),
		...n,
		children: [
			/* @__PURE__ */ (0, An.jsx)(Lr, {
				"data-slot": "scroll-area-viewport",
				className: "size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1",
				children: t
			}),
			/* @__PURE__ */ (0, An.jsx)(Jr, {}),
			/* @__PURE__ */ (0, An.jsx)(Kr, {})
		]
	});
}
function Jr({ className: e, orientation: t = "vertical", ...n }) {
	return /* @__PURE__ */ (0, An.jsx)(Wr, {
		"data-slot": "scroll-area-scrollbar",
		"data-orientation": t,
		orientation: t,
		className: Tn("flex touch-none p-px transition-colors select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent", e),
		...n,
		children: /* @__PURE__ */ (0, An.jsx)(Gr, {
			"data-slot": "scroll-area-thumb",
			className: "relative flex-1 rounded-none bg-border"
		})
	});
}
//#endregion
//#region src/App.tsx
function Yr() {
	let [e, t] = (0, x.useState)("connecting"), [n, r] = (0, x.useState)(null), [i, a] = (0, x.useState)({});
	(0, x.useEffect)(() => {
		let e, n = !1;
		return k().then((r) => {
			if (n) {
				r.close();
				return;
			}
			t("connected"), e = A(r, (e) => a({ ...e }));
		}).catch((e) => {
			n || (t("error"), r(e instanceof Error ? e.message : String(e)));
		}), () => {
			n = !0, e?.();
		};
	}, []);
	let o = (0, x.useMemo)(() => Object.values(i).sort((e, t) => e.entity_id.localeCompare(t.entity_id)), [i]);
	return /* @__PURE__ */ (0, An.jsxs)("div", {
		className: "flex min-h-svh flex-col gap-4 p-6",
		children: [/* @__PURE__ */ (0, An.jsxs)("header", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, An.jsx)("h1", {
				className: "text-2xl font-semibold",
				children: "Home Assistant Dashboard"
			}), /* @__PURE__ */ (0, An.jsx)(Xr, { status: e })]
		}), e === "error" ? /* @__PURE__ */ (0, An.jsxs)(jn, {
			className: "border-destructive/50",
			children: [/* @__PURE__ */ (0, An.jsx)(Mn, { children: /* @__PURE__ */ (0, An.jsx)(Nn, { children: "Connection failed" }) }), /* @__PURE__ */ (0, An.jsx)(Pn, {
				className: "text-sm text-muted-foreground",
				children: n ?? "Unknown error connecting to Home Assistant."
			})]
		}) : /* @__PURE__ */ (0, An.jsxs)(jn, {
			className: "flex min-h-0 flex-1 flex-col",
			children: [/* @__PURE__ */ (0, An.jsx)(Mn, { children: /* @__PURE__ */ (0, An.jsxs)(Nn, { children: [
				"Entities",
				" ",
				/* @__PURE__ */ (0, An.jsxs)("span", {
					className: "text-sm font-normal text-muted-foreground",
					children: [
						"(",
						o.length,
						")"
					]
				})
			] }) }), /* @__PURE__ */ (0, An.jsx)(Pn, {
				className: "min-h-0 flex-1",
				children: /* @__PURE__ */ (0, An.jsx)(qr, {
					className: "h-[60vh] pr-4",
					children: /* @__PURE__ */ (0, An.jsxs)("ul", {
						className: "divide-y divide-border",
						children: [o.map((e) => /* @__PURE__ */ (0, An.jsxs)("li", {
							className: "flex items-center justify-between gap-4 py-2 text-sm",
							children: [/* @__PURE__ */ (0, An.jsx)("span", {
								className: "truncate font-mono",
								children: e.entity_id
							}), /* @__PURE__ */ (0, An.jsx)(Dn, {
								variant: "secondary",
								className: "shrink-0 font-mono",
								children: e.state
							})]
						}, e.entity_id)), o.length === 0 && e === "connected" && /* @__PURE__ */ (0, An.jsx)("li", {
							className: "py-4 text-sm text-muted-foreground",
							children: "No entities yet."
						})]
					})
				})
			})]
		})]
	});
}
function Xr({ status: e }) {
	return /* @__PURE__ */ (0, An.jsx)(Dn, {
		variant: e === "connected" ? "default" : e === "error" ? "destructive" : "secondary",
		children: e === "connecting" ? "Connecting…" : e === "connected" ? "Connected" : "Error"
	});
}
//#endregion
//#region src/components/theme-provider.tsx
var Zr = "(prefers-color-scheme: dark)", Qr = [
	"dark",
	"light",
	"system"
], $r = x.createContext(void 0);
function ei(e) {
	return e === null ? !1 : Qr.includes(e);
}
function ti() {
	return window.matchMedia(Zr).matches ? "dark" : "light";
}
function ni() {
	let e = document.createElement("style");
	return e.appendChild(document.createTextNode("*,*::before,*::after{-webkit-transition:none!important;transition:none!important}")), document.head.appendChild(e), () => {
		window.getComputedStyle(document.body), requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				e.remove();
			});
		});
	};
}
function ri(e) {
	return e instanceof HTMLElement ? !!(e.isContentEditable || e.closest("input, textarea, select, [contenteditable='true']")) : !1;
}
function ii({ children: e, defaultTheme: t = "system", storageKey: n = "theme", disableTransitionOnChange: r = !0, ...i }) {
	let [a, o] = x.useState(() => {
		let e = localStorage.getItem(n);
		return ei(e) ? e : t;
	}), s = x.useCallback((e) => {
		localStorage.setItem(n, e), o(e);
	}, [n]), c = x.useCallback((e) => {
		let t = document.documentElement, n = e === "system" ? ti() : e, i = r ? ni() : null;
		t.classList.remove("light", "dark"), t.classList.add(n), i && i();
	}, [r]);
	x.useEffect(() => {
		if (c(a), a !== "system") return;
		let e = window.matchMedia(Zr), t = () => {
			c("system");
		};
		return e.addEventListener("change", t), () => {
			e.removeEventListener("change", t);
		};
	}, [a, c]), x.useEffect(() => {
		let e = (e) => {
			e.repeat || e.metaKey || e.ctrlKey || e.altKey || ri(e.target) || e.key.toLowerCase() === "d" && o((e) => {
				let t = e === "dark" ? "light" : e === "light" ? "dark" : ti() === "dark" ? "light" : "dark";
				return localStorage.setItem(n, t), t;
			});
		};
		return window.addEventListener("keydown", e), () => {
			window.removeEventListener("keydown", e);
		};
	}, [n]), x.useEffect(() => {
		let e = (e) => {
			if (e.storageArea === localStorage && e.key === n) {
				if (ei(e.newValue)) {
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
	let l = x.useMemo(() => ({
		theme: a,
		setTheme: s
	}), [a, s]);
	return /* @__PURE__ */ (0, An.jsx)($r.Provider, {
		...i,
		value: l,
		children: e
	});
}
//#endregion
//#region src/main.tsx
function ai(e) {
	let t = (0, ee.createRoot)(e);
	return t.render(/* @__PURE__ */ (0, An.jsx)(x.StrictMode, { children: /* @__PURE__ */ (0, An.jsx)(ii, { children: /* @__PURE__ */ (0, An.jsx)(Yr, {}) }) })), t;
}
var oi = class extends HTMLElement {
	root;
	connectedCallback() {
		if (!document.head.querySelector("link[data-terminus-css]")) {
			let e = document.createElement("link");
			e.rel = "stylesheet", e.href = "/local/terminus/style.css", e.dataset.terminusCss = "true", document.head.appendChild(e);
		}
		this.root = ai(this);
	}
	disconnectedCallback() {
		this.root?.unmount(), this.root = void 0;
	}
};
customElements.get("terminus-panel") || customElements.define("terminus-panel", oi);
var si = document.getElementById("root");
si && ai(si);
//#endregion
