import { n as e, r as t, t as n } from "./chunk-Dqa2HsxW.js";
import { t as r } from "./katex-Bz_81i-Z.js";
import { n as i } from "./marked.esm-BLvhVM-p.js";
//#region node_modules/.pnpm/react@19.2.6/node_modules/react/cjs/react.production.js
var a = /* @__PURE__ */ n(((e) => {
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
	function S() {}
	var C = {
		H: null,
		A: null,
		T: null,
		S: null
	}, w = Object.prototype.hasOwnProperty;
	function T(e, n, r) {
		var i = r.ref;
		return {
			$$typeof: t,
			type: e,
			key: n,
			ref: i === void 0 ? null : i,
			props: r
		};
	}
	function te(e, t) {
		return T(e.type, t, e.props);
	}
	function E(e) {
		return typeof e == "object" && !!e && e.$$typeof === t;
	}
	function ne(e) {
		var t = {
			"=": "=0",
			":": "=2"
		};
		return "$" + e.replace(/[=:]/g, function(e) {
			return t[e];
		});
	}
	var re = /\/+/g;
	function ie(e, t) {
		return typeof e == "object" && e && e.key != null ? ne("" + e.key) : t.toString(36);
	}
	function D(e) {
		switch (e.status) {
			case "fulfilled": return e.value;
			case "rejected": throw e.reason;
			default: switch (typeof e.status == "string" ? e.then(S, S) : (e.status = "pending", e.then(function(t) {
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
		if (c) return o = o(e), c = a === "" ? "." + ie(e, 0) : a, ee(o) ? (i = "", c != null && (i = c.replace(re, "$&/") + "/"), O(o, r, i, "", function(e) {
			return e;
		})) : o != null && (E(o) && (o = te(o, i + (o.key == null || e && e.key === o.key ? "" : ("" + o.key).replace(re, "$&/") + "/") + c)), r.push(o)), 1;
		c = 0;
		var l = a === "" ? "." : a + ":";
		if (ee(e)) for (var u = 0; u < e.length; u++) a = e[u], s = l + ie(a, u), c += O(a, r, i, s, o);
		else if (u = m(e), typeof u == "function") for (e = u.call(e), u = 0; !(a = e.next()).done;) a = a.value, s = l + ie(a, u++), c += O(a, r, i, s, o);
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
	}, se = {
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
			if (!E(e)) throw Error("React.Children.only expected to receive a single React element child.");
			return e;
		}
	};
	e.Activity = f, e.Children = se, e.Component = v, e.Fragment = r, e.Profiler = a, e.PureComponent = b, e.StrictMode = i, e.Suspense = l, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = C, e.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(e) {
			return C.H.useMemoCache(e);
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
		if (t != null) for (a in t.key !== void 0 && (i = "" + t.key), t) !w.call(t, a) || a === "key" || a === "__self" || a === "__source" || a === "ref" && t.ref === void 0 || (r[a] = t[a]);
		var a = arguments.length - 2;
		if (a === 1) r.children = n;
		else if (1 < a) {
			for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
			r.children = o;
		}
		return T(e.type, i, r);
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
		if (t != null) for (r in t.key !== void 0 && (a = "" + t.key), t) w.call(t, r) && r !== "key" && r !== "__self" && r !== "__source" && (i[r] = t[r]);
		var o = arguments.length - 2;
		if (o === 1) i.children = n;
		else if (1 < o) {
			for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
			i.children = s;
		}
		if (e && e.defaultProps) for (r in o = e.defaultProps, o) i[r] === void 0 && (i[r] = o[r]);
		return T(e, a, i);
	}, e.createRef = function() {
		return { current: null };
	}, e.forwardRef = function(e) {
		return {
			$$typeof: c,
			render: e
		};
	}, e.isValidElement = E, e.lazy = function(e) {
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
		var t = C.T, n = {};
		C.T = n;
		try {
			var r = e(), i = C.S;
			i !== null && i(n, r), typeof r == "object" && r && typeof r.then == "function" && r.then(S, k);
		} catch (e) {
			k(e);
		} finally {
			t !== null && n.types !== null && (t.types = n.types), C.T = t;
		}
	}, e.unstable_useCacheRefresh = function() {
		return C.H.useCacheRefresh();
	}, e.use = function(e) {
		return C.H.use(e);
	}, e.useActionState = function(e, t, n) {
		return C.H.useActionState(e, t, n);
	}, e.useCallback = function(e, t) {
		return C.H.useCallback(e, t);
	}, e.useContext = function(e) {
		return C.H.useContext(e);
	}, e.useDebugValue = function() {}, e.useDeferredValue = function(e, t) {
		return C.H.useDeferredValue(e, t);
	}, e.useEffect = function(e, t) {
		return C.H.useEffect(e, t);
	}, e.useEffectEvent = function(e) {
		return C.H.useEffectEvent(e);
	}, e.useId = function() {
		return C.H.useId();
	}, e.useImperativeHandle = function(e, t, n) {
		return C.H.useImperativeHandle(e, t, n);
	}, e.useInsertionEffect = function(e, t) {
		return C.H.useInsertionEffect(e, t);
	}, e.useLayoutEffect = function(e, t) {
		return C.H.useLayoutEffect(e, t);
	}, e.useMemo = function(e, t) {
		return C.H.useMemo(e, t);
	}, e.useOptimistic = function(e, t) {
		return C.H.useOptimistic(e, t);
	}, e.useReducer = function(e, t, n) {
		return C.H.useReducer(e, t, n);
	}, e.useRef = function(e) {
		return C.H.useRef(e);
	}, e.useState = function(e) {
		return C.H.useState(e);
	}, e.useSyncExternalStore = function(e, t, n) {
		return C.H.useSyncExternalStore(e, t, n);
	}, e.useTransition = function() {
		return C.H.useTransition();
	}, e.version = "19.2.6";
})), o = /* @__PURE__ */ n(((e, t) => {
	t.exports = a();
})), s = /* @__PURE__ */ t(o()), c = (e, t) => {
	let n = Array(e.length + t.length);
	for (let t = 0; t < e.length; t++) n[t] = e[t];
	for (let r = 0; r < t.length; r++) n[e.length + r] = t[r];
	return n;
}, l = (e, t) => ({
	classGroupId: e,
	validator: t
}), u = (e = /* @__PURE__ */ new Map(), t = null, n) => ({
	nextPart: e,
	validators: t,
	classGroupId: n
}), d = "-", f = [], p = "arbitrary..", m = (e) => {
	let t = _(e), { conflictingClassGroups: n, conflictingClassGroupModifiers: r } = e;
	return {
		getClassGroupId: (e) => {
			if (e.startsWith("[") && e.endsWith("]")) return g(e);
			let n = e.split(d);
			return h(n, +(n[0] === "" && n.length > 1), t);
		},
		getConflictingClassGroupIds: (e, t) => {
			if (t) {
				let t = r[e], i = n[e];
				return t ? i ? c(i, t) : t : i || f;
			}
			return n[e] || f;
		}
	};
}, h = (e, t, n) => {
	if (e.length - t === 0) return n.classGroupId;
	let r = e[t], i = n.nextPart.get(r);
	if (i) {
		let n = h(e, t + 1, i);
		if (n) return n;
	}
	let a = n.validators;
	if (a === null) return;
	let o = t === 0 ? e.join(d) : e.slice(t).join(d), s = a.length;
	for (let e = 0; e < s; e++) {
		let t = a[e];
		if (t.validator(o)) return t.classGroupId;
	}
}, g = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
	let t = e.slice(1, -1), n = t.indexOf(":"), r = t.slice(0, n);
	return r ? p + r : void 0;
})(), _ = (e) => {
	let { theme: t, classGroups: n } = e;
	return v(n, t);
}, v = (e, t) => {
	let n = u();
	for (let r in e) {
		let i = e[r];
		y(i, n, r, t);
	}
	return n;
}, y = (e, t, n, r) => {
	let i = e.length;
	for (let a = 0; a < i; a++) {
		let i = e[a];
		b(i, t, n, r);
	}
}, b = (e, t, n, r) => {
	if (typeof e == "string") {
		x(e, t, n);
		return;
	}
	if (typeof e == "function") {
		ee(e, t, n, r);
		return;
	}
	S(e, t, n, r);
}, x = (e, t, n) => {
	let r = e === "" ? t : C(t, e);
	r.classGroupId = n;
}, ee = (e, t, n, r) => {
	if (w(e)) {
		y(e(r), t, n, r);
		return;
	}
	t.validators === null && (t.validators = []), t.validators.push(l(n, e));
}, S = (e, t, n, r) => {
	let i = Object.entries(e), a = i.length;
	for (let e = 0; e < a; e++) {
		let [a, o] = i[e];
		y(o, C(t, a), n, r);
	}
}, C = (e, t) => {
	let n = e, r = t.split(d), i = r.length;
	for (let e = 0; e < i; e++) {
		let t = r[e], i = n.nextPart.get(t);
		i || (i = u(), n.nextPart.set(t, i)), n = i;
	}
	return n;
}, w = (e) => "isThemeGetter" in e && e.isThemeGetter === !0, T = (e) => {
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
}, te = "!", E = ":", ne = [], re = (e, t, n, r, i) => ({
	modifiers: e,
	hasImportantModifier: t,
	baseClassName: n,
	maybePostfixModifierPosition: r,
	isExternal: i
}), ie = (e) => {
	let { prefix: t, experimentalParseClassName: n } = e, r = (e) => {
		let t = [], n = 0, r = 0, i = 0, a, o = e.length;
		for (let s = 0; s < o; s++) {
			let o = e[s];
			if (n === 0 && r === 0) {
				if (o === E) {
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
		s.endsWith(te) ? (c = s.slice(0, -1), l = !0) : s.startsWith(te) && (c = s.slice(1), l = !0);
		let u = a && a > i ? a - i : void 0;
		return re(t, l, c, u);
	};
	if (t) {
		let e = t + E, n = r;
		r = (t) => t.startsWith(e) ? n(t.slice(e.length)) : re(ne, !1, t, void 0, !0);
	}
	if (n) {
		let e = r;
		r = (t) => n({
			className: t,
			parseClassName: e
		});
	}
	return r;
}, D = (e) => {
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
}, O = (e) => ({
	cache: T(e.cacheSize),
	parseClassName: ie(e),
	sortModifiers: D(e),
	postfixLookupClassGroupIds: ae(e),
	...m(e)
}), ae = (e) => {
	let t = Object.create(null), n = e.postfixLookupClassGroups;
	if (n) for (let e = 0; e < n.length; e++) t[n[e]] = !0;
	return t;
}, oe = /\s+/, k = (e, t) => {
	let { parseClassName: n, getClassGroupId: r, getConflictingClassGroupIds: i, sortModifiers: a, postfixLookupClassGroupIds: o } = t, s = [], c = e.trim().split(oe), l = "";
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
		let _ = d.length === 0 ? "" : d.length === 1 ? d[0] : a(d).join(":"), v = f ? _ + te : _, y = v + g;
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
}, se = (...e) => {
	let t = 0, n, r, i = "";
	for (; t < e.length;) (n = e[t++]) && (r = ce(n)) && (i && (i += " "), i += r);
	return i;
}, ce = (e) => {
	if (typeof e == "string") return e;
	let t, n = "";
	for (let r = 0; r < e.length; r++) e[r] && (t = ce(e[r])) && (n && (n += " "), n += t);
	return n;
}, le = (e, ...t) => {
	let n, r, i, a, o = (o) => (n = O(t.reduce((e, t) => t(e), e())), r = n.cache.get, i = n.cache.set, a = s, s(o)), s = (e) => {
		let t = r(e);
		if (t) return t;
		let a = k(e, n);
		return i(e, a), a;
	};
	return a = o, (...e) => a(se(...e));
}, ue = [], de = (e) => {
	let t = (t) => t[e] || ue;
	return t.isThemeGetter = !0, t;
}, fe = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, pe = /^\((?:(\w[\w-]*):)?(.+)\)$/i, me = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, he = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, ge = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, _e = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, ve = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, ye = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, be = (e) => me.test(e), A = (e) => !!e && !Number.isNaN(Number(e)), xe = (e) => !!e && Number.isInteger(Number(e)), Se = (e) => e.endsWith("%") && A(e.slice(0, -1)), Ce = (e) => he.test(e), we = () => !0, Te = (e) => ge.test(e) && !_e.test(e), Ee = () => !1, De = (e) => ve.test(e), Oe = (e) => ye.test(e), ke = (e) => !j(e) && !M(e), Ae = (e) => e.startsWith("@container") && (e[10] === "/" && e[11] !== void 0 || e[11] === "s" && e[16] !== void 0 && e.startsWith("-size/", 10) || e[11] === "n" && e[18] !== void 0 && e.startsWith("-normal/", 10)), je = (e) => Ke(e, Xe, Ee), j = (e) => fe.test(e), Me = (e) => Ke(e, Ze, Te), Ne = (e) => Ke(e, Qe, A), Pe = (e) => Ke(e, et, we), Fe = (e) => Ke(e, $e, Ee), Ie = (e) => Ke(e, Je, Ee), Le = (e) => Ke(e, Ye, Oe), Re = (e) => Ke(e, tt, De), M = (e) => pe.test(e), ze = (e) => qe(e, Ze), Be = (e) => qe(e, $e), Ve = (e) => qe(e, Je), He = (e) => qe(e, Xe), Ue = (e) => qe(e, Ye), We = (e) => qe(e, tt, !0), Ge = (e) => qe(e, et, !0), Ke = (e, t, n) => {
	let r = fe.exec(e);
	return r ? r[1] ? t(r[1]) : n(r[2]) : !1;
}, qe = (e, t, n = !1) => {
	let r = pe.exec(e);
	return r ? r[1] ? t(r[1]) : n : !1;
}, Je = (e) => e === "position" || e === "percentage", Ye = (e) => e === "image" || e === "url", Xe = (e) => e === "length" || e === "size" || e === "bg-size", Ze = (e) => e === "length", Qe = (e) => e === "number", $e = (e) => e === "family-name", et = (e) => e === "number" || e === "weight", tt = (e) => e === "shadow", nt = () => {
	let e = de("color"), t = de("font"), n = de("text"), r = de("font-weight"), i = de("tracking"), a = de("leading"), o = de("breakpoint"), s = de("container"), c = de("spacing"), l = de("radius"), u = de("shadow"), d = de("inset-shadow"), f = de("text-shadow"), p = de("drop-shadow"), m = de("blur"), h = de("perspective"), g = de("aspect"), _ = de("ease"), v = de("animate"), y = () => [
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
		M,
		j
	], ee = () => [
		"auto",
		"hidden",
		"clip",
		"visible",
		"scroll"
	], S = () => [
		"auto",
		"contain",
		"none"
	], C = () => [
		M,
		j,
		c
	], w = () => [
		be,
		"full",
		"auto",
		...C()
	], T = () => [
		xe,
		"none",
		"subgrid",
		M,
		j
	], te = () => [
		"auto",
		{ span: [
			"full",
			xe,
			M,
			j
		] },
		xe,
		M,
		j
	], E = () => [
		xe,
		"auto",
		M,
		j
	], ne = () => [
		"auto",
		"min",
		"max",
		"fr",
		M,
		j
	], re = () => [
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
	], ie = () => [
		"start",
		"end",
		"center",
		"stretch",
		"center-safe",
		"end-safe"
	], D = () => ["auto", ...C()], O = () => [
		be,
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
		...C()
	], ae = () => [
		be,
		"screen",
		"full",
		"dvw",
		"lvw",
		"svw",
		"min",
		"max",
		"fit",
		...C()
	], oe = () => [
		be,
		"screen",
		"full",
		"lh",
		"dvh",
		"lvh",
		"svh",
		"min",
		"max",
		"fit",
		...C()
	], k = () => [
		e,
		M,
		j
	], se = () => [
		...b(),
		Ve,
		Ie,
		{ position: [M, j] }
	], ce = () => ["no-repeat", { repeat: [
		"",
		"x",
		"y",
		"space",
		"round"
	] }], le = () => [
		"auto",
		"cover",
		"contain",
		He,
		je,
		{ size: [M, j] }
	], ue = () => [
		Se,
		ze,
		Me
	], fe = () => [
		"",
		"none",
		"full",
		l,
		M,
		j
	], pe = () => [
		"",
		A,
		ze,
		Me
	], me = () => [
		"solid",
		"dashed",
		"dotted",
		"double"
	], he = () => [
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
	], ge = () => [
		A,
		Se,
		Ve,
		Ie
	], _e = () => [
		"",
		"none",
		m,
		M,
		j
	], ve = () => [
		"none",
		A,
		M,
		j
	], ye = () => [
		"none",
		A,
		M,
		j
	], Te = () => [
		A,
		M,
		j
	], Ee = () => [
		be,
		"full",
		...C()
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
			blur: [Ce],
			breakpoint: [Ce],
			color: [we],
			container: [Ce],
			"drop-shadow": [Ce],
			ease: [
				"in",
				"out",
				"in-out"
			],
			font: [ke],
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
			"inset-shadow": [Ce],
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
			radius: [Ce],
			shadow: [Ce],
			spacing: ["px", A],
			text: [Ce],
			"text-shadow": [Ce],
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
				be,
				j,
				M,
				g
			] }],
			container: ["container"],
			"container-type": [{ "@container": [
				"",
				"normal",
				"size",
				M,
				j
			] }],
			"container-named": [Ae],
			columns: [{ columns: [
				A,
				j,
				M,
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
			overscroll: [{ overscroll: S() }],
			"overscroll-x": [{ "overscroll-x": S() }],
			"overscroll-y": [{ "overscroll-y": S() }],
			position: [
				"static",
				"fixed",
				"absolute",
				"relative",
				"sticky"
			],
			inset: [{ inset: w() }],
			"inset-x": [{ "inset-x": w() }],
			"inset-y": [{ "inset-y": w() }],
			start: [{
				"inset-s": w(),
				start: w()
			}],
			end: [{
				"inset-e": w(),
				end: w()
			}],
			"inset-bs": [{ "inset-bs": w() }],
			"inset-be": [{ "inset-be": w() }],
			top: [{ top: w() }],
			right: [{ right: w() }],
			bottom: [{ bottom: w() }],
			left: [{ left: w() }],
			visibility: [
				"visible",
				"invisible",
				"collapse"
			],
			z: [{ z: [
				xe,
				"auto",
				M,
				j
			] }],
			basis: [{ basis: [
				be,
				"full",
				"auto",
				s,
				...C()
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
				A,
				be,
				"auto",
				"initial",
				"none",
				j
			] }],
			grow: [{ grow: [
				"",
				A,
				M,
				j
			] }],
			shrink: [{ shrink: [
				"",
				A,
				M,
				j
			] }],
			order: [{ order: [
				xe,
				"first",
				"last",
				"none",
				M,
				j
			] }],
			"grid-cols": [{ "grid-cols": T() }],
			"col-start-end": [{ col: te() }],
			"col-start": [{ "col-start": E() }],
			"col-end": [{ "col-end": E() }],
			"grid-rows": [{ "grid-rows": T() }],
			"row-start-end": [{ row: te() }],
			"row-start": [{ "row-start": E() }],
			"row-end": [{ "row-end": E() }],
			"grid-flow": [{ "grid-flow": [
				"row",
				"col",
				"dense",
				"row-dense",
				"col-dense"
			] }],
			"auto-cols": [{ "auto-cols": ne() }],
			"auto-rows": [{ "auto-rows": ne() }],
			gap: [{ gap: C() }],
			"gap-x": [{ "gap-x": C() }],
			"gap-y": [{ "gap-y": C() }],
			"justify-content": [{ justify: [...re(), "normal"] }],
			"justify-items": [{ "justify-items": [...ie(), "normal"] }],
			"justify-self": [{ "justify-self": ["auto", ...ie()] }],
			"align-content": [{ content: ["normal", ...re()] }],
			"align-items": [{ items: [...ie(), { baseline: ["", "last"] }] }],
			"align-self": [{ self: [
				"auto",
				...ie(),
				{ baseline: ["", "last"] }
			] }],
			"place-content": [{ "place-content": re() }],
			"place-items": [{ "place-items": [...ie(), "baseline"] }],
			"place-self": [{ "place-self": ["auto", ...ie()] }],
			p: [{ p: C() }],
			px: [{ px: C() }],
			py: [{ py: C() }],
			ps: [{ ps: C() }],
			pe: [{ pe: C() }],
			pbs: [{ pbs: C() }],
			pbe: [{ pbe: C() }],
			pt: [{ pt: C() }],
			pr: [{ pr: C() }],
			pb: [{ pb: C() }],
			pl: [{ pl: C() }],
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
			"space-x": [{ "space-x": C() }],
			"space-x-reverse": ["space-x-reverse"],
			"space-y": [{ "space-y": C() }],
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
				ze,
				Me
			] }],
			"font-smoothing": ["antialiased", "subpixel-antialiased"],
			"font-style": ["italic", "not-italic"],
			"font-weight": [{ font: [
				r,
				Ge,
				Pe
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
				Se,
				j
			] }],
			"font-family": [{ font: [
				Be,
				Fe,
				t
			] }],
			"font-features": [{ "font-features": [j] }],
			"fvn-normal": ["normal-nums"],
			"fvn-ordinal": ["ordinal"],
			"fvn-slashed-zero": ["slashed-zero"],
			"fvn-figure": ["lining-nums", "oldstyle-nums"],
			"fvn-spacing": ["proportional-nums", "tabular-nums"],
			"fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
			tracking: [{ tracking: [
				i,
				M,
				j
			] }],
			"line-clamp": [{ "line-clamp": [
				A,
				"none",
				M,
				Ne
			] }],
			leading: [{ leading: [a, ...C()] }],
			"list-image": [{ "list-image": [
				"none",
				M,
				j
			] }],
			"list-style-position": [{ list: ["inside", "outside"] }],
			"list-style-type": [{ list: [
				"disc",
				"decimal",
				"none",
				M,
				j
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
			"text-decoration-style": [{ decoration: [...me(), "wavy"] }],
			"text-decoration-thickness": [{ decoration: [
				A,
				"from-font",
				"auto",
				M,
				Me
			] }],
			"text-decoration-color": [{ decoration: k() }],
			"underline-offset": [{ "underline-offset": [
				A,
				"auto",
				M,
				j
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
			indent: [{ indent: C() }],
			"tab-size": [{ tab: [
				xe,
				M,
				j
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
				M,
				j
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
				M,
				j
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
			"bg-position": [{ bg: se() }],
			"bg-repeat": [{ bg: ce() }],
			"bg-size": [{ bg: le() }],
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
						xe,
						M,
						j
					],
					radial: [
						"",
						M,
						j
					],
					conic: [
						xe,
						M,
						j
					]
				},
				Ue,
				Le
			] }],
			"bg-color": [{ bg: k() }],
			"gradient-from-pos": [{ from: ue() }],
			"gradient-via-pos": [{ via: ue() }],
			"gradient-to-pos": [{ to: ue() }],
			"gradient-from": [{ from: k() }],
			"gradient-via": [{ via: k() }],
			"gradient-to": [{ to: k() }],
			rounded: [{ rounded: fe() }],
			"rounded-s": [{ "rounded-s": fe() }],
			"rounded-e": [{ "rounded-e": fe() }],
			"rounded-t": [{ "rounded-t": fe() }],
			"rounded-r": [{ "rounded-r": fe() }],
			"rounded-b": [{ "rounded-b": fe() }],
			"rounded-l": [{ "rounded-l": fe() }],
			"rounded-ss": [{ "rounded-ss": fe() }],
			"rounded-se": [{ "rounded-se": fe() }],
			"rounded-ee": [{ "rounded-ee": fe() }],
			"rounded-es": [{ "rounded-es": fe() }],
			"rounded-tl": [{ "rounded-tl": fe() }],
			"rounded-tr": [{ "rounded-tr": fe() }],
			"rounded-br": [{ "rounded-br": fe() }],
			"rounded-bl": [{ "rounded-bl": fe() }],
			"border-w": [{ border: pe() }],
			"border-w-x": [{ "border-x": pe() }],
			"border-w-y": [{ "border-y": pe() }],
			"border-w-s": [{ "border-s": pe() }],
			"border-w-e": [{ "border-e": pe() }],
			"border-w-bs": [{ "border-bs": pe() }],
			"border-w-be": [{ "border-be": pe() }],
			"border-w-t": [{ "border-t": pe() }],
			"border-w-r": [{ "border-r": pe() }],
			"border-w-b": [{ "border-b": pe() }],
			"border-w-l": [{ "border-l": pe() }],
			"divide-x": [{ "divide-x": pe() }],
			"divide-x-reverse": ["divide-x-reverse"],
			"divide-y": [{ "divide-y": pe() }],
			"divide-y-reverse": ["divide-y-reverse"],
			"border-style": [{ border: [
				...me(),
				"hidden",
				"none"
			] }],
			"divide-style": [{ divide: [
				...me(),
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
				...me(),
				"none",
				"hidden"
			] }],
			"outline-offset": [{ "outline-offset": [
				A,
				M,
				j
			] }],
			"outline-w": [{ outline: [
				"",
				A,
				ze,
				Me
			] }],
			"outline-color": [{ outline: k() }],
			shadow: [{ shadow: [
				"",
				"none",
				u,
				We,
				Re
			] }],
			"shadow-color": [{ shadow: k() }],
			"inset-shadow": [{ "inset-shadow": [
				"none",
				d,
				We,
				Re
			] }],
			"inset-shadow-color": [{ "inset-shadow": k() }],
			"ring-w": [{ ring: pe() }],
			"ring-w-inset": ["ring-inset"],
			"ring-color": [{ ring: k() }],
			"ring-offset-w": [{ "ring-offset": [A, Me] }],
			"ring-offset-color": [{ "ring-offset": k() }],
			"inset-ring-w": [{ "inset-ring": pe() }],
			"inset-ring-color": [{ "inset-ring": k() }],
			"text-shadow": [{ "text-shadow": [
				"none",
				f,
				We,
				Re
			] }],
			"text-shadow-color": [{ "text-shadow": k() }],
			opacity: [{ opacity: [
				A,
				M,
				j
			] }],
			"mix-blend": [{ "mix-blend": [
				...he(),
				"plus-darker",
				"plus-lighter"
			] }],
			"bg-blend": [{ "bg-blend": he() }],
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
			"mask-image-linear-pos": [{ "mask-linear": [A] }],
			"mask-image-linear-from-pos": [{ "mask-linear-from": ge() }],
			"mask-image-linear-to-pos": [{ "mask-linear-to": ge() }],
			"mask-image-linear-from-color": [{ "mask-linear-from": k() }],
			"mask-image-linear-to-color": [{ "mask-linear-to": k() }],
			"mask-image-t-from-pos": [{ "mask-t-from": ge() }],
			"mask-image-t-to-pos": [{ "mask-t-to": ge() }],
			"mask-image-t-from-color": [{ "mask-t-from": k() }],
			"mask-image-t-to-color": [{ "mask-t-to": k() }],
			"mask-image-r-from-pos": [{ "mask-r-from": ge() }],
			"mask-image-r-to-pos": [{ "mask-r-to": ge() }],
			"mask-image-r-from-color": [{ "mask-r-from": k() }],
			"mask-image-r-to-color": [{ "mask-r-to": k() }],
			"mask-image-b-from-pos": [{ "mask-b-from": ge() }],
			"mask-image-b-to-pos": [{ "mask-b-to": ge() }],
			"mask-image-b-from-color": [{ "mask-b-from": k() }],
			"mask-image-b-to-color": [{ "mask-b-to": k() }],
			"mask-image-l-from-pos": [{ "mask-l-from": ge() }],
			"mask-image-l-to-pos": [{ "mask-l-to": ge() }],
			"mask-image-l-from-color": [{ "mask-l-from": k() }],
			"mask-image-l-to-color": [{ "mask-l-to": k() }],
			"mask-image-x-from-pos": [{ "mask-x-from": ge() }],
			"mask-image-x-to-pos": [{ "mask-x-to": ge() }],
			"mask-image-x-from-color": [{ "mask-x-from": k() }],
			"mask-image-x-to-color": [{ "mask-x-to": k() }],
			"mask-image-y-from-pos": [{ "mask-y-from": ge() }],
			"mask-image-y-to-pos": [{ "mask-y-to": ge() }],
			"mask-image-y-from-color": [{ "mask-y-from": k() }],
			"mask-image-y-to-color": [{ "mask-y-to": k() }],
			"mask-image-radial": [{ "mask-radial": [M, j] }],
			"mask-image-radial-from-pos": [{ "mask-radial-from": ge() }],
			"mask-image-radial-to-pos": [{ "mask-radial-to": ge() }],
			"mask-image-radial-from-color": [{ "mask-radial-from": k() }],
			"mask-image-radial-to-color": [{ "mask-radial-to": k() }],
			"mask-image-radial-shape": [{ "mask-radial": ["circle", "ellipse"] }],
			"mask-image-radial-size": [{ "mask-radial": [{
				closest: ["side", "corner"],
				farthest: ["side", "corner"]
			}] }],
			"mask-image-radial-pos": [{ "mask-radial-at": b() }],
			"mask-image-conic-pos": [{ "mask-conic": [A] }],
			"mask-image-conic-from-pos": [{ "mask-conic-from": ge() }],
			"mask-image-conic-to-pos": [{ "mask-conic-to": ge() }],
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
			"mask-position": [{ mask: se() }],
			"mask-repeat": [{ mask: ce() }],
			"mask-size": [{ mask: le() }],
			"mask-type": [{ "mask-type": ["alpha", "luminance"] }],
			"mask-image": [{ mask: [
				"none",
				M,
				j
			] }],
			filter: [{ filter: [
				"",
				"none",
				M,
				j
			] }],
			blur: [{ blur: _e() }],
			brightness: [{ brightness: [
				A,
				M,
				j
			] }],
			contrast: [{ contrast: [
				A,
				M,
				j
			] }],
			"drop-shadow": [{ "drop-shadow": [
				"",
				"none",
				p,
				We,
				Re
			] }],
			"drop-shadow-color": [{ "drop-shadow": k() }],
			grayscale: [{ grayscale: [
				"",
				A,
				M,
				j
			] }],
			"hue-rotate": [{ "hue-rotate": [
				A,
				M,
				j
			] }],
			invert: [{ invert: [
				"",
				A,
				M,
				j
			] }],
			saturate: [{ saturate: [
				A,
				M,
				j
			] }],
			sepia: [{ sepia: [
				"",
				A,
				M,
				j
			] }],
			"backdrop-filter": [{ "backdrop-filter": [
				"",
				"none",
				M,
				j
			] }],
			"backdrop-blur": [{ "backdrop-blur": _e() }],
			"backdrop-brightness": [{ "backdrop-brightness": [
				A,
				M,
				j
			] }],
			"backdrop-contrast": [{ "backdrop-contrast": [
				A,
				M,
				j
			] }],
			"backdrop-grayscale": [{ "backdrop-grayscale": [
				"",
				A,
				M,
				j
			] }],
			"backdrop-hue-rotate": [{ "backdrop-hue-rotate": [
				A,
				M,
				j
			] }],
			"backdrop-invert": [{ "backdrop-invert": [
				"",
				A,
				M,
				j
			] }],
			"backdrop-opacity": [{ "backdrop-opacity": [
				A,
				M,
				j
			] }],
			"backdrop-saturate": [{ "backdrop-saturate": [
				A,
				M,
				j
			] }],
			"backdrop-sepia": [{ "backdrop-sepia": [
				"",
				A,
				M,
				j
			] }],
			"border-collapse": [{ border: ["collapse", "separate"] }],
			"border-spacing": [{ "border-spacing": C() }],
			"border-spacing-x": [{ "border-spacing-x": C() }],
			"border-spacing-y": [{ "border-spacing-y": C() }],
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
				M,
				j
			] }],
			"transition-behavior": [{ transition: ["normal", "discrete"] }],
			duration: [{ duration: [
				A,
				"initial",
				M,
				j
			] }],
			ease: [{ ease: [
				"linear",
				"initial",
				_,
				M,
				j
			] }],
			delay: [{ delay: [
				A,
				M,
				j
			] }],
			animate: [{ animate: [
				"none",
				v,
				M,
				j
			] }],
			backface: [{ backface: ["hidden", "visible"] }],
			perspective: [{ perspective: [
				h,
				M,
				j
			] }],
			"perspective-origin": [{ "perspective-origin": x() }],
			rotate: [{ rotate: ve() }],
			"rotate-x": [{ "rotate-x": ve() }],
			"rotate-y": [{ "rotate-y": ve() }],
			"rotate-z": [{ "rotate-z": ve() }],
			scale: [{ scale: ye() }],
			"scale-x": [{ "scale-x": ye() }],
			"scale-y": [{ "scale-y": ye() }],
			"scale-z": [{ "scale-z": ye() }],
			"scale-3d": ["scale-3d"],
			skew: [{ skew: Te() }],
			"skew-x": [{ "skew-x": Te() }],
			"skew-y": [{ "skew-y": Te() }],
			transform: [{ transform: [
				M,
				j,
				"",
				"none",
				"gpu",
				"cpu"
			] }],
			"transform-origin": [{ origin: x() }],
			"transform-style": [{ transform: ["3d", "flat"] }],
			translate: [{ translate: Ee() }],
			"translate-x": [{ "translate-x": Ee() }],
			"translate-y": [{ "translate-y": Ee() }],
			"translate-z": [{ "translate-z": Ee() }],
			"translate-none": ["translate-none"],
			zoom: [{ zoom: [
				xe,
				M,
				j
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
				M,
				j
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
			"scroll-m": [{ "scroll-m": C() }],
			"scroll-mx": [{ "scroll-mx": C() }],
			"scroll-my": [{ "scroll-my": C() }],
			"scroll-ms": [{ "scroll-ms": C() }],
			"scroll-me": [{ "scroll-me": C() }],
			"scroll-mbs": [{ "scroll-mbs": C() }],
			"scroll-mbe": [{ "scroll-mbe": C() }],
			"scroll-mt": [{ "scroll-mt": C() }],
			"scroll-mr": [{ "scroll-mr": C() }],
			"scroll-mb": [{ "scroll-mb": C() }],
			"scroll-ml": [{ "scroll-ml": C() }],
			"scroll-p": [{ "scroll-p": C() }],
			"scroll-px": [{ "scroll-px": C() }],
			"scroll-py": [{ "scroll-py": C() }],
			"scroll-ps": [{ "scroll-ps": C() }],
			"scroll-pe": [{ "scroll-pe": C() }],
			"scroll-pbs": [{ "scroll-pbs": C() }],
			"scroll-pbe": [{ "scroll-pbe": C() }],
			"scroll-pt": [{ "scroll-pt": C() }],
			"scroll-pr": [{ "scroll-pr": C() }],
			"scroll-pb": [{ "scroll-pb": C() }],
			"scroll-pl": [{ "scroll-pl": C() }],
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
				M,
				j
			] }],
			fill: [{ fill: ["none", ...k()] }],
			"stroke-w": [{ stroke: [
				A,
				ze,
				Me,
				Ne
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
}, rt = (e, { cacheSize: t, prefix: n, experimentalParseClassName: r, extend: i = {}, override: a = {} }) => (it(e, "cacheSize", t), it(e, "prefix", n), it(e, "experimentalParseClassName", r), at(e.theme, a.theme), at(e.classGroups, a.classGroups), at(e.conflictingClassGroups, a.conflictingClassGroups), at(e.conflictingClassGroupModifiers, a.conflictingClassGroupModifiers), it(e, "postfixLookupClassGroups", a.postfixLookupClassGroups), it(e, "orderSensitiveModifiers", a.orderSensitiveModifiers), ot(e.theme, i.theme), ot(e.classGroups, i.classGroups), ot(e.conflictingClassGroups, i.conflictingClassGroups), ot(e.conflictingClassGroupModifiers, i.conflictingClassGroupModifiers), st(e, i, "postfixLookupClassGroups"), st(e, i, "orderSensitiveModifiers"), e), it = (e, t, n) => {
	n !== void 0 && (e[t] = n);
}, at = (e, t) => {
	if (t) for (let n in t) it(e, n, t[n]);
}, ot = (e, t) => {
	if (t) for (let n in t) st(e, t, n);
}, st = (e, t, n) => {
	let r = t[n];
	r !== void 0 && (e[n] = e[n] ? e[n].concat(r) : r);
}, ct = (e, ...t) => typeof e == "function" ? le(nt, e, ...t) : le(() => rt(nt(), e), ...t), lt = /* @__PURE__ */ le(nt), ut = /* @__PURE__ */ n(((e) => {
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
})), dt = /* @__PURE__ */ n(((e, t) => {
	t.exports = ut();
}));
//#endregion
//#region node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs
function ft(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") if (Array.isArray(e)) {
		var i = e.length;
		for (t = 0; t < i; t++) e[t] && (n = ft(e[t])) && (r && (r += " "), r += n);
	} else for (n in e) e[n] && (r && (r += " "), r += n);
	return r;
}
function pt() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = ft(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/.pnpm/unist-util-is@6.0.1/node_modules/unist-util-is/lib/index.js
var mt = (function(e) {
	if (e == null) return yt;
	if (typeof e == "function") return vt(e);
	if (typeof e == "object") return Array.isArray(e) ? ht(e) : gt(e);
	if (typeof e == "string") return _t(e);
	throw Error("Expected function, string, or object as test");
});
function ht(e) {
	let t = [], n = -1;
	for (; ++n < e.length;) t[n] = mt(e[n]);
	return vt(r);
	function r(...e) {
		let n = -1;
		for (; ++n < t.length;) if (t[n].apply(this, e)) return !0;
		return !1;
	}
}
function gt(e) {
	let t = e;
	return vt(n);
	function n(n) {
		let r = n, i;
		for (i in e) if (r[i] !== t[i]) return !1;
		return !0;
	}
}
function _t(e) {
	return vt(t);
	function t(t) {
		return t && t.type === e;
	}
}
function vt(e) {
	return t;
	function t(t, n, r) {
		return !!(bt(t) && e.call(this, t, typeof n == "number" ? n : void 0, r || void 0));
	}
}
function yt() {
	return !0;
}
function bt(e) {
	return typeof e == "object" && !!e && "type" in e;
}
//#endregion
//#region node_modules/.pnpm/unist-util-visit-parents@6.0.2/node_modules/unist-util-visit-parents/lib/color.js
function xt(e) {
	return e;
}
//#endregion
//#region node_modules/.pnpm/unist-util-visit-parents@6.0.2/node_modules/unist-util-visit-parents/lib/index.js
var St = [], Ct = "skip";
function wt(e, t, n, r) {
	let i;
	typeof t == "function" && typeof n != "function" ? (r = n, n = t) : i = t;
	let a = mt(i), o = r ? -1 : 1;
	s(e, void 0, [])();
	function s(e, i, c) {
		let l = e && typeof e == "object" ? e : {};
		if (typeof l.type == "string") {
			let t = typeof l.tagName == "string" ? l.tagName : typeof l.name == "string" ? l.name : void 0;
			Object.defineProperty(u, "name", { value: "node (" + xt(e.type + (t ? "<" + t + ">" : "")) + ")" });
		}
		return u;
		function u() {
			let l = St, u, d, f;
			if ((!t || a(e, i, c[c.length - 1] || void 0)) && (l = Tt(n(e, c)), l[0] === !1)) return l;
			if ("children" in e && e.children) {
				let t = e;
				if (t.children && l[0] !== "skip") for (d = (r ? t.children.length : -1) + o, f = c.concat(t); d > -1 && d < t.children.length;) {
					let e = t.children[d];
					if (u = s(e, d, f)(), u[0] === !1) return u;
					d = typeof u[1] == "number" ? u[1] : d + o;
				}
			}
			return l;
		}
	}
}
function Tt(e) {
	return Array.isArray(e) ? e : typeof e == "number" ? [!0, e] : e == null ? St : [e];
}
//#endregion
//#region node_modules/.pnpm/unist-util-visit@5.1.0/node_modules/unist-util-visit/lib/index.js
function Et(e, t, n, r) {
	let i, a, o;
	typeof t == "function" && typeof n != "function" ? (a = void 0, o = t, i = n) : (a = t, o = n, i = r), wt(e, a, s, i);
	function s(e, t) {
		let n = t[t.length - 1], r = n ? n.children.indexOf(e) : void 0;
		return o(e, r, n);
	}
}
//#endregion
//#region node_modules/.pnpm/rehype-harden@1.1.8/node_modules/rehype-harden/dist/index.js
var Dt = {
	indicator: "indicator",
	textOnly: "text-only",
	remove: "remove"
};
function Ot({ defaultOrigin: e = "", allowedLinkPrefixes: t = [], allowedImagePrefixes: n = [], allowDataImages: r = !1, allowedProtocols: i = [], blockedImageClass: a = "inline-block bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-3 py-1 rounded text-sm", blockedLinkClass: o = "text-gray-500", linkBlockPolicy: s = Dt.indicator, imageBlockPolicy: c = Dt.indicator }) {
	let l = t.length && !t.every((e) => e === "*"), u = n.length && !n.every((e) => e === "*");
	if (!e && (l || u)) throw Error("defaultOrigin is required when allowedLinkPrefixes or allowedImagePrefixes are provided");
	return (l) => {
		let u = Rt(e, t, n, r, i, a, o, s, c);
		Pt(l), Et(l, u);
	};
}
function kt(e, t) {
	if (typeof e != "string") return null;
	try {
		return new URL(e);
	} catch {
		if (t) try {
			return new URL(e, t);
		} catch {
			return null;
		}
		if (e.startsWith("/") || e.startsWith("./") || e.startsWith("../")) try {
			return new URL(e, "http://example.com");
		} catch {
			return null;
		}
		return null;
	}
}
function At(e) {
	return typeof e == "string" ? e.startsWith("/") || e.startsWith("./") || e.startsWith("../") : !1;
}
var jt = new Set([
	"https:",
	"http:",
	"irc:",
	"ircs:",
	"mailto:",
	"xmpp:",
	"blob:"
]), Mt = new Set([
	"javascript:",
	"data:",
	"file:",
	"vbscript:"
]);
function Nt(e, t, n, r = !1, i = !1, a = []) {
	if (!e) return null;
	if (typeof e == "string" && e.startsWith("#") && !i) try {
		if (new URL(e, "http://example.com").hash === e) return e;
	} catch {}
	if (typeof e == "string" && e.startsWith("data:")) return i && r && e.startsWith("data:image/") ? e : null;
	if (typeof e == "string" && e.startsWith("blob:")) {
		try {
			if (new URL(e).protocol === "blob:" && e.length > 5) {
				let t = e.substring(5);
				if (t && t.length > 0 && t !== "invalid") return e;
			}
		} catch {
			return null;
		}
		return null;
	}
	let o = kt(e, n);
	if (!o || Mt.has(o.protocol) || !(jt.has(o.protocol) || a.includes(o.protocol) || a.includes("*"))) return null;
	if (o.protocol === "mailto:" || !o.protocol.match(/^https?:$/)) return o.href;
	let s = At(e);
	return o && t.some((e) => {
		let t = kt(e, n);
		return !t || t.origin !== o.origin ? !1 : o.href.startsWith(t.href);
	}) ? s ? o.pathname + o.search + o.hash : o.href : t.includes("*") ? o.protocol !== "https:" && o.protocol !== "http:" ? null : s ? o.pathname + o.search + o.hash : o.href : null;
}
function Pt(e) {
	if ("children" in e && Array.isArray(e.children)) {
		e.children = e.children.filter((e) => e != null);
		for (let t of e.children) Pt(t);
	}
}
var Ft = Symbol("node-seen");
function It(e, t, n) {
	return t === Dt.remove ? { type: "remove" } : t === Dt.textOnly ? {
		type: "replace",
		element: {
			type: "element",
			tagName: "span",
			properties: {},
			children: [...e.children]
		}
	} : {
		type: "replace",
		element: {
			type: "element",
			tagName: "span",
			properties: {
				title: "Blocked URL: " + String(e.properties.href),
				class: n
			},
			children: [...e.children, {
				type: "text",
				value: " [blocked]"
			}]
		}
	};
}
function Lt(e, t, n) {
	if (t === Dt.remove) return { type: "remove" };
	if (t === Dt.textOnly) {
		let t = String(e.properties.alt || "");
		return t ? {
			type: "replace",
			element: {
				type: "element",
				tagName: "span",
				properties: {},
				children: [{
					type: "text",
					value: t
				}]
			}
		} : { type: "remove" };
	}
	return {
		type: "replace",
		element: {
			type: "element",
			tagName: "span",
			properties: { class: n },
			children: [{
				type: "text",
				value: "[Image blocked: " + String(e.properties.alt || "No description") + "]"
			}]
		}
	};
}
var Rt = (e, t, n, r, i, a, o, s, c) => {
	let l = (u, d, f) => {
		if (u.type !== "element" || u[Ft]) return !0;
		if (u.tagName === "a") {
			let n = Nt(u.properties.href, t, e, !1, !1, i);
			if (n === null) {
				if (u[Ft] = !0, Et(u, l), f && typeof d == "number") {
					let e = It(u, s, o);
					if (e.type === "remove") return f.children.splice(d, 1), [Ct, d];
					f.children[d] = e.element;
				}
				return Ct;
			} else return u.properties.href = n, u.properties.target = "_blank", u.properties.rel = "noopener noreferrer", !0;
		}
		if (u.tagName === "img") {
			let t = Nt(u.properties.src, n, e, r, !0, i);
			if (t === null) {
				if (u[Ft] = !0, Et(u, l), f && typeof d == "number") {
					let e = Lt(u, c, a);
					if (e.type === "remove") return f.children.splice(d, 1), [Ct, d];
					f.children[d] = e.element;
				}
				return Ct;
			} else return u.properties.src = t, !0;
		}
		return !0;
	};
	return l;
}, zt = class {
	constructor(e, t, n) {
		this.normal = t, this.property = e, n && (this.space = n);
	}
};
zt.prototype.normal = {}, zt.prototype.property = {}, zt.prototype.space = void 0;
//#endregion
//#region node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/util/merge.js
function Bt(e, t) {
	let n = {}, r = {};
	for (let t of e) Object.assign(n, t.property), Object.assign(r, t.normal);
	return new zt(n, r, t);
}
//#endregion
//#region node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/normalize.js
function Vt(e) {
	return e.toLowerCase();
}
//#endregion
//#region node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/util/info.js
var Ht = class {
	constructor(e, t) {
		this.attribute = t, this.property = e;
	}
};
Ht.prototype.attribute = "", Ht.prototype.booleanish = !1, Ht.prototype.boolean = !1, Ht.prototype.commaOrSpaceSeparated = !1, Ht.prototype.commaSeparated = !1, Ht.prototype.defined = !1, Ht.prototype.mustUseProperty = !1, Ht.prototype.number = !1, Ht.prototype.overloadedBoolean = !1, Ht.prototype.property = "", Ht.prototype.spaceSeparated = !1, Ht.prototype.space = void 0;
//#endregion
//#region node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/util/types.js
var Ut = /* @__PURE__ */ e({
	boolean: () => N,
	booleanish: () => Gt,
	commaOrSpaceSeparated: () => Jt,
	commaSeparated: () => qt,
	number: () => P,
	overloadedBoolean: () => Kt,
	spaceSeparated: () => F
}), Wt = 0, N = Yt(), Gt = Yt(), Kt = Yt(), P = Yt(), F = Yt(), qt = Yt(), Jt = Yt();
function Yt() {
	return 2 ** ++Wt;
}
//#endregion
//#region node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/util/defined-info.js
var Xt = Object.keys(Ut), Zt = class extends Ht {
	constructor(e, t, n, r) {
		let i = -1;
		if (super(e, t), Qt(this, "space", r), typeof n == "number") for (; ++i < Xt.length;) {
			let e = Xt[i];
			Qt(this, Xt[i], (n & Ut[e]) === Ut[e]);
		}
	}
};
Zt.prototype.defined = !0;
function Qt(e, t, n) {
	n && (e[t] = n);
}
//#endregion
//#region node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/util/create.js
function $t(e) {
	let t = {}, n = {};
	for (let [r, i] of Object.entries(e.properties)) {
		let a = new Zt(r, e.transform(e.attributes || {}, r), i, e.space);
		e.mustUseProperty && e.mustUseProperty.includes(r) && (a.mustUseProperty = !0), t[r] = a, n[Vt(r)] = r, n[Vt(a.attribute)] = r;
	}
	return new zt(t, n, e.space);
}
//#endregion
//#region node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/aria.js
var en = $t({
	properties: {
		ariaActiveDescendant: null,
		ariaAtomic: Gt,
		ariaAutoComplete: null,
		ariaBusy: Gt,
		ariaChecked: Gt,
		ariaColCount: P,
		ariaColIndex: P,
		ariaColSpan: P,
		ariaControls: F,
		ariaCurrent: null,
		ariaDescribedBy: F,
		ariaDetails: null,
		ariaDisabled: Gt,
		ariaDropEffect: F,
		ariaErrorMessage: null,
		ariaExpanded: Gt,
		ariaFlowTo: F,
		ariaGrabbed: Gt,
		ariaHasPopup: null,
		ariaHidden: Gt,
		ariaInvalid: null,
		ariaKeyShortcuts: null,
		ariaLabel: null,
		ariaLabelledBy: F,
		ariaLevel: P,
		ariaLive: null,
		ariaModal: Gt,
		ariaMultiLine: Gt,
		ariaMultiSelectable: Gt,
		ariaOrientation: null,
		ariaOwns: F,
		ariaPlaceholder: null,
		ariaPosInSet: P,
		ariaPressed: Gt,
		ariaReadOnly: Gt,
		ariaRelevant: null,
		ariaRequired: Gt,
		ariaRoleDescription: F,
		ariaRowCount: P,
		ariaRowIndex: P,
		ariaRowSpan: P,
		ariaSelected: Gt,
		ariaSetSize: P,
		ariaSort: null,
		ariaValueMax: P,
		ariaValueMin: P,
		ariaValueNow: P,
		ariaValueText: null,
		role: null
	},
	transform(e, t) {
		return t === "role" ? t : "aria-" + t.slice(4).toLowerCase();
	}
});
//#endregion
//#region node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/util/case-sensitive-transform.js
function tn(e, t) {
	return t in e ? e[t] : t;
}
//#endregion
//#region node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/util/case-insensitive-transform.js
function nn(e, t) {
	return tn(e, t.toLowerCase());
}
//#endregion
//#region node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/html.js
var rn = $t({
	attributes: {
		acceptcharset: "accept-charset",
		classname: "class",
		htmlfor: "for",
		httpequiv: "http-equiv"
	},
	mustUseProperty: [
		"checked",
		"multiple",
		"muted",
		"selected"
	],
	properties: {
		abbr: null,
		accept: qt,
		acceptCharset: F,
		accessKey: F,
		action: null,
		allow: null,
		allowFullScreen: N,
		allowPaymentRequest: N,
		allowUserMedia: N,
		alt: null,
		as: null,
		async: N,
		autoCapitalize: null,
		autoComplete: F,
		autoFocus: N,
		autoPlay: N,
		blocking: F,
		capture: null,
		charSet: null,
		checked: N,
		cite: null,
		className: F,
		cols: P,
		colSpan: null,
		content: null,
		contentEditable: Gt,
		controls: N,
		controlsList: F,
		coords: P | qt,
		crossOrigin: null,
		data: null,
		dateTime: null,
		decoding: null,
		default: N,
		defer: N,
		dir: null,
		dirName: null,
		disabled: N,
		download: Kt,
		draggable: Gt,
		encType: null,
		enterKeyHint: null,
		fetchPriority: null,
		form: null,
		formAction: null,
		formEncType: null,
		formMethod: null,
		formNoValidate: N,
		formTarget: null,
		headers: F,
		height: P,
		hidden: Kt,
		high: P,
		href: null,
		hrefLang: null,
		htmlFor: F,
		httpEquiv: F,
		id: null,
		imageSizes: null,
		imageSrcSet: null,
		inert: N,
		inputMode: null,
		integrity: null,
		is: null,
		isMap: N,
		itemId: null,
		itemProp: F,
		itemRef: F,
		itemScope: N,
		itemType: F,
		kind: null,
		label: null,
		lang: null,
		language: null,
		list: null,
		loading: null,
		loop: N,
		low: P,
		manifest: null,
		max: null,
		maxLength: P,
		media: null,
		method: null,
		min: null,
		minLength: P,
		multiple: N,
		muted: N,
		name: null,
		nonce: null,
		noModule: N,
		noValidate: N,
		onAbort: null,
		onAfterPrint: null,
		onAuxClick: null,
		onBeforeMatch: null,
		onBeforePrint: null,
		onBeforeToggle: null,
		onBeforeUnload: null,
		onBlur: null,
		onCancel: null,
		onCanPlay: null,
		onCanPlayThrough: null,
		onChange: null,
		onClick: null,
		onClose: null,
		onContextLost: null,
		onContextMenu: null,
		onContextRestored: null,
		onCopy: null,
		onCueChange: null,
		onCut: null,
		onDblClick: null,
		onDrag: null,
		onDragEnd: null,
		onDragEnter: null,
		onDragExit: null,
		onDragLeave: null,
		onDragOver: null,
		onDragStart: null,
		onDrop: null,
		onDurationChange: null,
		onEmptied: null,
		onEnded: null,
		onError: null,
		onFocus: null,
		onFormData: null,
		onHashChange: null,
		onInput: null,
		onInvalid: null,
		onKeyDown: null,
		onKeyPress: null,
		onKeyUp: null,
		onLanguageChange: null,
		onLoad: null,
		onLoadedData: null,
		onLoadedMetadata: null,
		onLoadEnd: null,
		onLoadStart: null,
		onMessage: null,
		onMessageError: null,
		onMouseDown: null,
		onMouseEnter: null,
		onMouseLeave: null,
		onMouseMove: null,
		onMouseOut: null,
		onMouseOver: null,
		onMouseUp: null,
		onOffline: null,
		onOnline: null,
		onPageHide: null,
		onPageShow: null,
		onPaste: null,
		onPause: null,
		onPlay: null,
		onPlaying: null,
		onPopState: null,
		onProgress: null,
		onRateChange: null,
		onRejectionHandled: null,
		onReset: null,
		onResize: null,
		onScroll: null,
		onScrollEnd: null,
		onSecurityPolicyViolation: null,
		onSeeked: null,
		onSeeking: null,
		onSelect: null,
		onSlotChange: null,
		onStalled: null,
		onStorage: null,
		onSubmit: null,
		onSuspend: null,
		onTimeUpdate: null,
		onToggle: null,
		onUnhandledRejection: null,
		onUnload: null,
		onVolumeChange: null,
		onWaiting: null,
		onWheel: null,
		open: N,
		optimum: P,
		pattern: null,
		ping: F,
		placeholder: null,
		playsInline: N,
		popover: null,
		popoverTarget: null,
		popoverTargetAction: null,
		poster: null,
		preload: null,
		readOnly: N,
		referrerPolicy: null,
		rel: F,
		required: N,
		reversed: N,
		rows: P,
		rowSpan: P,
		sandbox: F,
		scope: null,
		scoped: N,
		seamless: N,
		selected: N,
		shadowRootClonable: N,
		shadowRootDelegatesFocus: N,
		shadowRootMode: null,
		shape: null,
		size: P,
		sizes: null,
		slot: null,
		span: P,
		spellCheck: Gt,
		src: null,
		srcDoc: null,
		srcLang: null,
		srcSet: null,
		start: P,
		step: null,
		style: null,
		tabIndex: P,
		target: null,
		title: null,
		translate: null,
		type: null,
		typeMustMatch: N,
		useMap: null,
		value: Gt,
		width: P,
		wrap: null,
		writingSuggestions: null,
		align: null,
		aLink: null,
		archive: F,
		axis: null,
		background: null,
		bgColor: null,
		border: P,
		borderColor: null,
		bottomMargin: P,
		cellPadding: null,
		cellSpacing: null,
		char: null,
		charOff: null,
		classId: null,
		clear: null,
		code: null,
		codeBase: null,
		codeType: null,
		color: null,
		compact: N,
		declare: N,
		event: null,
		face: null,
		frame: null,
		frameBorder: null,
		hSpace: P,
		leftMargin: P,
		link: null,
		longDesc: null,
		lowSrc: null,
		marginHeight: P,
		marginWidth: P,
		noResize: N,
		noHref: N,
		noShade: N,
		noWrap: N,
		object: null,
		profile: null,
		prompt: null,
		rev: null,
		rightMargin: P,
		rules: null,
		scheme: null,
		scrolling: Gt,
		standby: null,
		summary: null,
		text: null,
		topMargin: P,
		valueType: null,
		version: null,
		vAlign: null,
		vLink: null,
		vSpace: P,
		allowTransparency: null,
		autoCorrect: null,
		autoSave: null,
		disablePictureInPicture: N,
		disableRemotePlayback: N,
		prefix: null,
		property: null,
		results: P,
		security: null,
		unselectable: null
	},
	space: "html",
	transform: nn
}), an = $t({
	attributes: {
		accentHeight: "accent-height",
		alignmentBaseline: "alignment-baseline",
		arabicForm: "arabic-form",
		baselineShift: "baseline-shift",
		capHeight: "cap-height",
		className: "class",
		clipPath: "clip-path",
		clipRule: "clip-rule",
		colorInterpolation: "color-interpolation",
		colorInterpolationFilters: "color-interpolation-filters",
		colorProfile: "color-profile",
		colorRendering: "color-rendering",
		crossOrigin: "crossorigin",
		dataType: "datatype",
		dominantBaseline: "dominant-baseline",
		enableBackground: "enable-background",
		fillOpacity: "fill-opacity",
		fillRule: "fill-rule",
		floodColor: "flood-color",
		floodOpacity: "flood-opacity",
		fontFamily: "font-family",
		fontSize: "font-size",
		fontSizeAdjust: "font-size-adjust",
		fontStretch: "font-stretch",
		fontStyle: "font-style",
		fontVariant: "font-variant",
		fontWeight: "font-weight",
		glyphName: "glyph-name",
		glyphOrientationHorizontal: "glyph-orientation-horizontal",
		glyphOrientationVertical: "glyph-orientation-vertical",
		hrefLang: "hreflang",
		horizAdvX: "horiz-adv-x",
		horizOriginX: "horiz-origin-x",
		horizOriginY: "horiz-origin-y",
		imageRendering: "image-rendering",
		letterSpacing: "letter-spacing",
		lightingColor: "lighting-color",
		markerEnd: "marker-end",
		markerMid: "marker-mid",
		markerStart: "marker-start",
		navDown: "nav-down",
		navDownLeft: "nav-down-left",
		navDownRight: "nav-down-right",
		navLeft: "nav-left",
		navNext: "nav-next",
		navPrev: "nav-prev",
		navRight: "nav-right",
		navUp: "nav-up",
		navUpLeft: "nav-up-left",
		navUpRight: "nav-up-right",
		onAbort: "onabort",
		onActivate: "onactivate",
		onAfterPrint: "onafterprint",
		onBeforePrint: "onbeforeprint",
		onBegin: "onbegin",
		onCancel: "oncancel",
		onCanPlay: "oncanplay",
		onCanPlayThrough: "oncanplaythrough",
		onChange: "onchange",
		onClick: "onclick",
		onClose: "onclose",
		onCopy: "oncopy",
		onCueChange: "oncuechange",
		onCut: "oncut",
		onDblClick: "ondblclick",
		onDrag: "ondrag",
		onDragEnd: "ondragend",
		onDragEnter: "ondragenter",
		onDragExit: "ondragexit",
		onDragLeave: "ondragleave",
		onDragOver: "ondragover",
		onDragStart: "ondragstart",
		onDrop: "ondrop",
		onDurationChange: "ondurationchange",
		onEmptied: "onemptied",
		onEnd: "onend",
		onEnded: "onended",
		onError: "onerror",
		onFocus: "onfocus",
		onFocusIn: "onfocusin",
		onFocusOut: "onfocusout",
		onHashChange: "onhashchange",
		onInput: "oninput",
		onInvalid: "oninvalid",
		onKeyDown: "onkeydown",
		onKeyPress: "onkeypress",
		onKeyUp: "onkeyup",
		onLoad: "onload",
		onLoadedData: "onloadeddata",
		onLoadedMetadata: "onloadedmetadata",
		onLoadStart: "onloadstart",
		onMessage: "onmessage",
		onMouseDown: "onmousedown",
		onMouseEnter: "onmouseenter",
		onMouseLeave: "onmouseleave",
		onMouseMove: "onmousemove",
		onMouseOut: "onmouseout",
		onMouseOver: "onmouseover",
		onMouseUp: "onmouseup",
		onMouseWheel: "onmousewheel",
		onOffline: "onoffline",
		onOnline: "ononline",
		onPageHide: "onpagehide",
		onPageShow: "onpageshow",
		onPaste: "onpaste",
		onPause: "onpause",
		onPlay: "onplay",
		onPlaying: "onplaying",
		onPopState: "onpopstate",
		onProgress: "onprogress",
		onRateChange: "onratechange",
		onRepeat: "onrepeat",
		onReset: "onreset",
		onResize: "onresize",
		onScroll: "onscroll",
		onSeeked: "onseeked",
		onSeeking: "onseeking",
		onSelect: "onselect",
		onShow: "onshow",
		onStalled: "onstalled",
		onStorage: "onstorage",
		onSubmit: "onsubmit",
		onSuspend: "onsuspend",
		onTimeUpdate: "ontimeupdate",
		onToggle: "ontoggle",
		onUnload: "onunload",
		onVolumeChange: "onvolumechange",
		onWaiting: "onwaiting",
		onZoom: "onzoom",
		overlinePosition: "overline-position",
		overlineThickness: "overline-thickness",
		paintOrder: "paint-order",
		panose1: "panose-1",
		pointerEvents: "pointer-events",
		referrerPolicy: "referrerpolicy",
		renderingIntent: "rendering-intent",
		shapeRendering: "shape-rendering",
		stopColor: "stop-color",
		stopOpacity: "stop-opacity",
		strikethroughPosition: "strikethrough-position",
		strikethroughThickness: "strikethrough-thickness",
		strokeDashArray: "stroke-dasharray",
		strokeDashOffset: "stroke-dashoffset",
		strokeLineCap: "stroke-linecap",
		strokeLineJoin: "stroke-linejoin",
		strokeMiterLimit: "stroke-miterlimit",
		strokeOpacity: "stroke-opacity",
		strokeWidth: "stroke-width",
		tabIndex: "tabindex",
		textAnchor: "text-anchor",
		textDecoration: "text-decoration",
		textRendering: "text-rendering",
		transformOrigin: "transform-origin",
		typeOf: "typeof",
		underlinePosition: "underline-position",
		underlineThickness: "underline-thickness",
		unicodeBidi: "unicode-bidi",
		unicodeRange: "unicode-range",
		unitsPerEm: "units-per-em",
		vAlphabetic: "v-alphabetic",
		vHanging: "v-hanging",
		vIdeographic: "v-ideographic",
		vMathematical: "v-mathematical",
		vectorEffect: "vector-effect",
		vertAdvY: "vert-adv-y",
		vertOriginX: "vert-origin-x",
		vertOriginY: "vert-origin-y",
		wordSpacing: "word-spacing",
		writingMode: "writing-mode",
		xHeight: "x-height",
		playbackOrder: "playbackorder",
		timelineBegin: "timelinebegin"
	},
	properties: {
		about: Jt,
		accentHeight: P,
		accumulate: null,
		additive: null,
		alignmentBaseline: null,
		alphabetic: P,
		amplitude: P,
		arabicForm: null,
		ascent: P,
		attributeName: null,
		attributeType: null,
		azimuth: P,
		bandwidth: null,
		baselineShift: null,
		baseFrequency: null,
		baseProfile: null,
		bbox: null,
		begin: null,
		bias: P,
		by: null,
		calcMode: null,
		capHeight: P,
		className: F,
		clip: null,
		clipPath: null,
		clipPathUnits: null,
		clipRule: null,
		color: null,
		colorInterpolation: null,
		colorInterpolationFilters: null,
		colorProfile: null,
		colorRendering: null,
		content: null,
		contentScriptType: null,
		contentStyleType: null,
		crossOrigin: null,
		cursor: null,
		cx: null,
		cy: null,
		d: null,
		dataType: null,
		defaultAction: null,
		descent: P,
		diffuseConstant: P,
		direction: null,
		display: null,
		dur: null,
		divisor: P,
		dominantBaseline: null,
		download: N,
		dx: null,
		dy: null,
		edgeMode: null,
		editable: null,
		elevation: P,
		enableBackground: null,
		end: null,
		event: null,
		exponent: P,
		externalResourcesRequired: null,
		fill: null,
		fillOpacity: P,
		fillRule: null,
		filter: null,
		filterRes: null,
		filterUnits: null,
		floodColor: null,
		floodOpacity: null,
		focusable: null,
		focusHighlight: null,
		fontFamily: null,
		fontSize: null,
		fontSizeAdjust: null,
		fontStretch: null,
		fontStyle: null,
		fontVariant: null,
		fontWeight: null,
		format: null,
		fr: null,
		from: null,
		fx: null,
		fy: null,
		g1: qt,
		g2: qt,
		glyphName: qt,
		glyphOrientationHorizontal: null,
		glyphOrientationVertical: null,
		glyphRef: null,
		gradientTransform: null,
		gradientUnits: null,
		handler: null,
		hanging: P,
		hatchContentUnits: null,
		hatchUnits: null,
		height: null,
		href: null,
		hrefLang: null,
		horizAdvX: P,
		horizOriginX: P,
		horizOriginY: P,
		id: null,
		ideographic: P,
		imageRendering: null,
		initialVisibility: null,
		in: null,
		in2: null,
		intercept: P,
		k: P,
		k1: P,
		k2: P,
		k3: P,
		k4: P,
		kernelMatrix: Jt,
		kernelUnitLength: null,
		keyPoints: null,
		keySplines: null,
		keyTimes: null,
		kerning: null,
		lang: null,
		lengthAdjust: null,
		letterSpacing: null,
		lightingColor: null,
		limitingConeAngle: P,
		local: null,
		markerEnd: null,
		markerMid: null,
		markerStart: null,
		markerHeight: null,
		markerUnits: null,
		markerWidth: null,
		mask: null,
		maskContentUnits: null,
		maskUnits: null,
		mathematical: null,
		max: null,
		media: null,
		mediaCharacterEncoding: null,
		mediaContentEncodings: null,
		mediaSize: P,
		mediaTime: null,
		method: null,
		min: null,
		mode: null,
		name: null,
		navDown: null,
		navDownLeft: null,
		navDownRight: null,
		navLeft: null,
		navNext: null,
		navPrev: null,
		navRight: null,
		navUp: null,
		navUpLeft: null,
		navUpRight: null,
		numOctaves: null,
		observer: null,
		offset: null,
		onAbort: null,
		onActivate: null,
		onAfterPrint: null,
		onBeforePrint: null,
		onBegin: null,
		onCancel: null,
		onCanPlay: null,
		onCanPlayThrough: null,
		onChange: null,
		onClick: null,
		onClose: null,
		onCopy: null,
		onCueChange: null,
		onCut: null,
		onDblClick: null,
		onDrag: null,
		onDragEnd: null,
		onDragEnter: null,
		onDragExit: null,
		onDragLeave: null,
		onDragOver: null,
		onDragStart: null,
		onDrop: null,
		onDurationChange: null,
		onEmptied: null,
		onEnd: null,
		onEnded: null,
		onError: null,
		onFocus: null,
		onFocusIn: null,
		onFocusOut: null,
		onHashChange: null,
		onInput: null,
		onInvalid: null,
		onKeyDown: null,
		onKeyPress: null,
		onKeyUp: null,
		onLoad: null,
		onLoadedData: null,
		onLoadedMetadata: null,
		onLoadStart: null,
		onMessage: null,
		onMouseDown: null,
		onMouseEnter: null,
		onMouseLeave: null,
		onMouseMove: null,
		onMouseOut: null,
		onMouseOver: null,
		onMouseUp: null,
		onMouseWheel: null,
		onOffline: null,
		onOnline: null,
		onPageHide: null,
		onPageShow: null,
		onPaste: null,
		onPause: null,
		onPlay: null,
		onPlaying: null,
		onPopState: null,
		onProgress: null,
		onRateChange: null,
		onRepeat: null,
		onReset: null,
		onResize: null,
		onScroll: null,
		onSeeked: null,
		onSeeking: null,
		onSelect: null,
		onShow: null,
		onStalled: null,
		onStorage: null,
		onSubmit: null,
		onSuspend: null,
		onTimeUpdate: null,
		onToggle: null,
		onUnload: null,
		onVolumeChange: null,
		onWaiting: null,
		onZoom: null,
		opacity: null,
		operator: null,
		order: null,
		orient: null,
		orientation: null,
		origin: null,
		overflow: null,
		overlay: null,
		overlinePosition: P,
		overlineThickness: P,
		paintOrder: null,
		panose1: null,
		path: null,
		pathLength: P,
		patternContentUnits: null,
		patternTransform: null,
		patternUnits: null,
		phase: null,
		ping: F,
		pitch: null,
		playbackOrder: null,
		pointerEvents: null,
		points: null,
		pointsAtX: P,
		pointsAtY: P,
		pointsAtZ: P,
		preserveAlpha: null,
		preserveAspectRatio: null,
		primitiveUnits: null,
		propagate: null,
		property: Jt,
		r: null,
		radius: null,
		referrerPolicy: null,
		refX: null,
		refY: null,
		rel: Jt,
		rev: Jt,
		renderingIntent: null,
		repeatCount: null,
		repeatDur: null,
		requiredExtensions: Jt,
		requiredFeatures: Jt,
		requiredFonts: Jt,
		requiredFormats: Jt,
		resource: null,
		restart: null,
		result: null,
		rotate: null,
		rx: null,
		ry: null,
		scale: null,
		seed: null,
		shapeRendering: null,
		side: null,
		slope: null,
		snapshotTime: null,
		specularConstant: P,
		specularExponent: P,
		spreadMethod: null,
		spacing: null,
		startOffset: null,
		stdDeviation: null,
		stemh: null,
		stemv: null,
		stitchTiles: null,
		stopColor: null,
		stopOpacity: null,
		strikethroughPosition: P,
		strikethroughThickness: P,
		string: null,
		stroke: null,
		strokeDashArray: Jt,
		strokeDashOffset: null,
		strokeLineCap: null,
		strokeLineJoin: null,
		strokeMiterLimit: P,
		strokeOpacity: P,
		strokeWidth: null,
		style: null,
		surfaceScale: P,
		syncBehavior: null,
		syncBehaviorDefault: null,
		syncMaster: null,
		syncTolerance: null,
		syncToleranceDefault: null,
		systemLanguage: Jt,
		tabIndex: P,
		tableValues: null,
		target: null,
		targetX: P,
		targetY: P,
		textAnchor: null,
		textDecoration: null,
		textRendering: null,
		textLength: null,
		timelineBegin: null,
		title: null,
		transformBehavior: null,
		type: null,
		typeOf: Jt,
		to: null,
		transform: null,
		transformOrigin: null,
		u1: null,
		u2: null,
		underlinePosition: P,
		underlineThickness: P,
		unicode: null,
		unicodeBidi: null,
		unicodeRange: null,
		unitsPerEm: P,
		values: null,
		vAlphabetic: P,
		vMathematical: P,
		vectorEffect: null,
		vHanging: P,
		vIdeographic: P,
		version: null,
		vertAdvY: P,
		vertOriginX: P,
		vertOriginY: P,
		viewBox: null,
		viewTarget: null,
		visibility: null,
		width: null,
		widths: null,
		wordSpacing: null,
		writingMode: null,
		x: null,
		x1: null,
		x2: null,
		xChannelSelector: null,
		xHeight: P,
		y: null,
		y1: null,
		y2: null,
		yChannelSelector: null,
		z: null,
		zoomAndPan: null
	},
	space: "svg",
	transform: tn
}), on = $t({
	properties: {
		xLinkActuate: null,
		xLinkArcRole: null,
		xLinkHref: null,
		xLinkRole: null,
		xLinkShow: null,
		xLinkTitle: null,
		xLinkType: null
	},
	space: "xlink",
	transform(e, t) {
		return "xlink:" + t.slice(5).toLowerCase();
	}
}), sn = $t({
	attributes: { xmlnsxlink: "xmlns:xlink" },
	properties: {
		xmlnsXLink: null,
		xmlns: null
	},
	space: "xmlns",
	transform: nn
}), cn = $t({
	properties: {
		xmlBase: null,
		xmlLang: null,
		xmlSpace: null
	},
	space: "xml",
	transform(e, t) {
		return "xml:" + t.slice(3).toLowerCase();
	}
}), ln = /[A-Z]/g, un = /-[a-z]/g, dn = /^data[-\w.:]+$/i;
function fn(e, t) {
	let n = Vt(t), r = t, i = Ht;
	if (n in e.normal) return e.property[e.normal[n]];
	if (n.length > 4 && n.slice(0, 4) === "data" && dn.test(t)) {
		if (t.charAt(4) === "-") {
			let e = t.slice(5).replace(un, mn);
			r = "data" + e.charAt(0).toUpperCase() + e.slice(1);
		} else {
			let e = t.slice(4);
			if (!un.test(e)) {
				let n = e.replace(ln, pn);
				n.charAt(0) !== "-" && (n = "-" + n), t = "data" + n;
			}
		}
		i = Zt;
	}
	return new i(r, t);
}
function pn(e) {
	return "-" + e.toLowerCase();
}
function mn(e) {
	return e.charAt(1).toUpperCase();
}
//#endregion
//#region node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/index.js
var hn = Bt([
	en,
	rn,
	on,
	sn,
	cn
], "html"), gn = Bt([
	en,
	an,
	on,
	sn,
	cn
], "svg");
//#endregion
//#region node_modules/.pnpm/comma-separated-tokens@2.0.3/node_modules/comma-separated-tokens/index.js
function _n(e) {
	let t = [], n = String(e || ""), r = n.indexOf(","), i = 0, a = !1;
	for (; !a;) {
		r === -1 && (r = n.length, a = !0);
		let e = n.slice(i, r).trim();
		(e || !a) && t.push(e), i = r + 1, r = n.indexOf(",", i);
	}
	return t;
}
function vn(e, t) {
	let n = t || {};
	return (e[e.length - 1] === "" ? [...e, ""] : e).join((n.padRight ? " " : "") + "," + (n.padLeft === !1 ? "" : " ")).trim();
}
//#endregion
//#region node_modules/.pnpm/hast-util-parse-selector@4.0.0/node_modules/hast-util-parse-selector/lib/index.js
var yn = /[#.]/g;
function bn(e, t) {
	let n = e || "", r = {}, i = 0, a, o;
	for (; i < n.length;) {
		yn.lastIndex = i;
		let e = yn.exec(n), t = n.slice(i, e ? e.index : n.length);
		t && (a ? a === "#" ? r.id = t : Array.isArray(r.className) ? r.className.push(t) : r.className = [t] : o = t, i += t.length), e && (a = e[0], i++);
	}
	return {
		type: "element",
		tagName: o || t || "div",
		properties: r,
		children: []
	};
}
//#endregion
//#region node_modules/.pnpm/space-separated-tokens@2.0.2/node_modules/space-separated-tokens/index.js
function xn(e) {
	let t = String(e || "").trim();
	return t ? t.split(/[ \t\n\r\f]+/g) : [];
}
function Sn(e) {
	return e.join(" ").trim();
}
//#endregion
//#region node_modules/.pnpm/hastscript@9.0.1/node_modules/hastscript/lib/create-h.js
function Cn(e, t, n) {
	let r = n ? kn(n) : void 0;
	function i(n, i, ...a) {
		let o;
		if (n == null) {
			o = {
				type: "root",
				children: []
			};
			let e = i;
			a.unshift(e);
		} else {
			o = bn(n, t);
			let s = o.tagName.toLowerCase(), c = r ? r.get(s) : void 0;
			if (o.tagName = c || s, wn(i)) a.unshift(i);
			else for (let [t, n] of Object.entries(i)) Tn(e, o.properties, t, n);
		}
		for (let e of a) En(o.children, e);
		return o.type === "element" && o.tagName === "template" && (o.content = {
			type: "root",
			children: o.children
		}, o.children = []), o;
	}
	return i;
}
function wn(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !0;
	if (typeof e.type != "string") return !1;
	let t = e, n = Object.keys(e);
	for (let e of n) {
		let n = t[e];
		if (n && typeof n == "object") {
			if (!Array.isArray(n)) return !0;
			let e = n;
			for (let t of e) if (typeof t != "number" && typeof t != "string") return !0;
		}
	}
	return !!("children" in e && Array.isArray(e.children));
}
function Tn(e, t, n, r) {
	let i = fn(e, n), a;
	if (r != null) {
		if (typeof r == "number") {
			if (Number.isNaN(r)) return;
			a = r;
		} else a = typeof r == "boolean" ? r : typeof r == "string" ? i.spaceSeparated ? xn(r) : i.commaSeparated ? _n(r) : i.commaOrSpaceSeparated ? xn(_n(r).join(" ")) : Dn(i, i.property, r) : Array.isArray(r) ? [...r] : i.property === "style" ? On(r) : String(r);
		if (Array.isArray(a)) {
			let e = [];
			for (let t of a) e.push(Dn(i, i.property, t));
			a = e;
		}
		i.property === "className" && Array.isArray(t.className) && (a = t.className.concat(a)), t[i.property] = a;
	}
}
function En(e, t) {
	if (t != null) if (typeof t == "number" || typeof t == "string") e.push({
		type: "text",
		value: String(t)
	});
	else if (Array.isArray(t)) for (let n of t) En(e, n);
	else if (typeof t == "object" && "type" in t) t.type === "root" ? En(e, t.children) : e.push(t);
	else throw Error("Expected node, nodes, or string, got `" + t + "`");
}
function Dn(e, t, n) {
	if (typeof n == "string") {
		if (e.number && n && !Number.isNaN(Number(n))) return Number(n);
		if ((e.boolean || e.overloadedBoolean) && (n === "" || Vt(n) === Vt(t))) return !0;
	}
	return n;
}
function On(e) {
	let t = [];
	for (let [n, r] of Object.entries(e)) t.push([n, r].join(": "));
	return t.join("; ");
}
function kn(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) t.set(n.toLowerCase(), n);
	return t;
}
//#endregion
//#region node_modules/.pnpm/hastscript@9.0.1/node_modules/hastscript/lib/svg-case-sensitive-tag-names.js
var An = /* @__PURE__ */ "altGlyph.altGlyphDef.altGlyphItem.animateColor.animateMotion.animateTransform.clipPath.feBlend.feColorMatrix.feComponentTransfer.feComposite.feConvolveMatrix.feDiffuseLighting.feDisplacementMap.feDistantLight.feDropShadow.feFlood.feFuncA.feFuncB.feFuncG.feFuncR.feGaussianBlur.feImage.feMerge.feMergeNode.feMorphology.feOffset.fePointLight.feSpecularLighting.feSpotLight.feTile.feTurbulence.foreignObject.glyphRef.linearGradient.radialGradient.solidColor.textArea.textPath".split("."), jn = Cn(hn, "div"), Mn = Cn(gn, "g", An), Nn = {
	html: "http://www.w3.org/1999/xhtml",
	mathml: "http://www.w3.org/1998/Math/MathML",
	svg: "http://www.w3.org/2000/svg",
	xlink: "http://www.w3.org/1999/xlink",
	xml: "http://www.w3.org/XML/1998/namespace",
	xmlns: "http://www.w3.org/2000/xmlns/"
};
//#endregion
//#region node_modules/.pnpm/hast-util-from-dom@5.0.1/node_modules/hast-util-from-dom/lib/index.js
function Pn(e, t) {
	return Fn(e, t || {}) || {
		type: "root",
		children: []
	};
}
function Fn(e, t) {
	let n = In(e, t);
	return n && t.afterTransform && t.afterTransform(e, n), n;
}
function In(e, t) {
	switch (e.nodeType) {
		case 1: return Vn(e, t);
		case 3: return zn(e);
		case 8: return Bn(e);
		case 9: return Ln(e, t);
		case 10: return Rn();
		case 11: return Ln(e, t);
		default: return;
	}
}
function Ln(e, t) {
	return {
		type: "root",
		children: Hn(e, t)
	};
}
function Rn() {
	return { type: "doctype" };
}
function zn(e) {
	return {
		type: "text",
		value: e.nodeValue || ""
	};
}
function Bn(e) {
	return {
		type: "comment",
		value: e.nodeValue || ""
	};
}
function Vn(e, t) {
	let n = e.namespaceURI, r = n === Nn.svg ? Mn : jn, i = n === Nn.html ? e.tagName.toLowerCase() : e.tagName, a = n === Nn.html && i === "template" ? e.content : e, o = e.getAttributeNames(), s = {}, c = -1;
	for (; ++c < o.length;) s[o[c]] = e.getAttribute(o[c]) || "";
	return r(i, s, Hn(a, t));
}
function Hn(e, t) {
	let n = e.childNodes, r = [], i = -1;
	for (; ++i < n.length;) {
		let e = Fn(n[i], t);
		e !== void 0 && r.push(e);
	}
	return r;
}
//#endregion
//#region node_modules/.pnpm/hast-util-from-html-isomorphic@2.0.0/node_modules/hast-util-from-html-isomorphic/lib/browser.js
var Un = new DOMParser();
function Wn(e, t) {
	return Pn(t?.fragment ? Gn(e) : Un.parseFromString(e, "text/html"));
}
function Gn(e) {
	let t = document.createElement("template");
	return t.innerHTML = e, t.content;
}
//#endregion
//#region node_modules/.pnpm/unist-util-find-after@5.0.0/node_modules/unist-util-find-after/lib/index.js
var Kn = (function(e, t, n) {
	let r = mt(n);
	if (!e || !e.type || !e.children) throw Error("Expected parent node");
	if (typeof t == "number") {
		if (t < 0 || t === Infinity) throw Error("Expected positive finite number as index");
	} else if (t = e.children.indexOf(t), t < 0) throw Error("Expected child node or index");
	for (; ++t < e.children.length;) if (r(e.children[t], t, e)) return e.children[t];
}), qn = (function(e) {
	if (e == null) return Zn;
	if (typeof e == "string") return Yn(e);
	if (typeof e == "object") return Jn(e);
	if (typeof e == "function") return Xn(e);
	throw Error("Expected function, string, or array as `test`");
});
function Jn(e) {
	let t = [], n = -1;
	for (; ++n < e.length;) t[n] = qn(e[n]);
	return Xn(r);
	function r(...e) {
		let n = -1;
		for (; ++n < t.length;) if (t[n].apply(this, e)) return !0;
		return !1;
	}
}
function Yn(e) {
	return Xn(t);
	function t(t) {
		return t.tagName === e;
	}
}
function Xn(e) {
	return t;
	function t(t, n, r) {
		return !!(Qn(t) && e.call(this, t, typeof n == "number" ? n : void 0, r || void 0));
	}
}
function Zn(e) {
	return !!(e && typeof e == "object" && "type" in e && e.type === "element" && "tagName" in e && typeof e.tagName == "string");
}
function Qn(e) {
	return typeof e == "object" && !!e && "type" in e && "tagName" in e;
}
//#endregion
//#region node_modules/.pnpm/hast-util-to-text@4.0.2/node_modules/hast-util-to-text/lib/index.js
var $n = /\n/g, er = /[\t ]+/g, tr = qn("br"), nr = qn(hr), rr = qn("p"), ir = qn("tr"), ar = qn([
	"datalist",
	"head",
	"noembed",
	"noframes",
	"noscript",
	"rp",
	"script",
	"style",
	"template",
	"title",
	mr,
	gr
]), or = qn(/* @__PURE__ */ "address.article.aside.blockquote.body.caption.center.dd.dialog.dir.dl.dt.div.figure.figcaption.footer.form,.h1.h2.h3.h4.h5.h6.header.hgroup.hr.html.legend.li.listing.main.menu.nav.ol.p.plaintext.pre.section.ul.xmp".split("."));
function sr(e, t) {
	let n = t || {}, r = "children" in e ? e.children : [], i = or(e), a = pr(e, {
		whitespace: n.whitespace || "normal",
		breakBefore: !1,
		breakAfter: !1
	}), o = [];
	(e.type === "text" || e.type === "comment") && o.push(...ur(e, {
		whitespace: a,
		breakBefore: !0,
		breakAfter: !0
	}));
	let s = -1;
	for (; ++s < r.length;) o.push(...cr(r[s], e, {
		whitespace: a,
		breakBefore: s ? void 0 : i,
		breakAfter: s < r.length - 1 ? tr(r[s + 1]) : i
	}));
	let c = [], l;
	for (s = -1; ++s < o.length;) {
		let e = o[s];
		typeof e == "number" ? l !== void 0 && e > l && (l = e) : e && (l !== void 0 && l > -1 && c.push("\n".repeat(l) || " "), l = -1, c.push(e));
	}
	return c.join("");
}
function cr(e, t, n) {
	return e.type === "element" ? lr(e, t, n) : e.type === "text" ? n.whitespace === "normal" ? ur(e, n) : dr(e) : [];
}
function lr(e, t, n) {
	let r = pr(e, n), i = e.children || [], a = -1, o = [];
	if (ar(e)) return o;
	let s, c;
	for (tr(e) || ir(e) && Kn(t, e, ir) ? c = "\n" : rr(e) ? (s = 2, c = 2) : or(e) && (s = 1, c = 1); ++a < i.length;) o = o.concat(cr(i[a], e, {
		whitespace: r,
		breakBefore: a ? void 0 : s,
		breakAfter: a < i.length - 1 ? tr(i[a + 1]) : c
	}));
	return nr(e) && Kn(t, e, nr) && o.push("	"), s && o.unshift(s), c && o.push(c), o;
}
function ur(e, t) {
	let n = String(e.value), r = [], i = [], a = 0;
	for (; a <= n.length;) {
		$n.lastIndex = a;
		let e = $n.exec(n), i = e && "index" in e ? e.index : n.length;
		r.push(fr(n.slice(a, i).replace(/[\u061C\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, ""), a === 0 ? t.breakBefore : !0, i === n.length ? t.breakAfter : !0)), a = i + 1;
	}
	let o = -1, s;
	for (; ++o < r.length;) r[o].charCodeAt(r[o].length - 1) === 8203 || o < r.length - 1 && r[o + 1].charCodeAt(0) === 8203 ? (i.push(r[o]), s = void 0) : r[o] ? (typeof s == "number" && i.push(s), i.push(r[o]), s = 0) : (o === 0 || o === r.length - 1) && i.push(0);
	return i;
}
function dr(e) {
	return [String(e.value)];
}
function fr(e, t, n) {
	let r = [], i = 0, a;
	for (; i < e.length;) {
		er.lastIndex = i;
		let n = er.exec(e);
		a = n ? n.index : e.length, !i && !a && n && !t && r.push(""), i !== a && r.push(e.slice(i, a)), i = n ? a + n[0].length : a;
	}
	return i !== a && !n && r.push(""), r.join(" ");
}
function pr(e, t) {
	if (e.type === "element") {
		let n = e.properties || {};
		switch (e.tagName) {
			case "listing":
			case "plaintext":
			case "xmp": return "pre";
			case "nobr": return "nowrap";
			case "pre": return n.wrap ? "pre-wrap" : "pre";
			case "td":
			case "th": return n.noWrap ? "nowrap" : t.whitespace;
			case "textarea": return "pre-wrap";
			default:
		}
	}
	return t.whitespace;
}
function mr(e) {
	return !!(e.properties || {}).hidden;
}
function hr(e) {
	return e.tagName === "td" || e.tagName === "th";
}
function gr(e) {
	return e.tagName === "dialog" && !(e.properties || {}).open;
}
//#endregion
//#region node_modules/.pnpm/rehype-katex@7.0.1/node_modules/rehype-katex/lib/index.js
var _r = {}, vr = [];
function yr(e) {
	let t = e || _r;
	return function(e, n) {
		wt(e, "element", function(e, i) {
			let a = Array.isArray(e.properties.className) ? e.properties.className : vr, o = a.includes("language-math"), s = a.includes("math-display"), c = a.includes("math-inline"), l = s;
			if (!o && !s && !c) return;
			let u = i[i.length - 1], d = e;
			/* c8 ignore next -- verbose to test. */
			if (e.tagName === "code" && o && u && u.type === "element" && u.tagName === "pre" && (d = u, u = i[i.length - 2], l = !0), !u) return;
			let f = sr(d, { whitespace: "pre" }), p;
			try {
				p = r.renderToString(f, {
					...t,
					displayMode: l,
					throwOnError: !0
				});
			} catch (a) {
				let o = a, s = o.name.toLowerCase();
				n.message("Could not render math with KaTeX", {
					ancestors: [...i, e],
					cause: o,
					place: e.position,
					ruleId: s,
					source: "rehype-katex"
				});
				try {
					p = r.renderToString(f, {
						...t,
						displayMode: l,
						strict: "ignore",
						throwOnError: !1
					});
				} catch {
					p = [{
						type: "element",
						tagName: "span",
						properties: {
							className: ["katex-error"],
							style: "color:" + (t.errorColor || "#cc0000"),
							title: String(a)
						},
						children: [{
							type: "text",
							value: f
						}]
					}];
				}
			}
			typeof p == "string" && (p = Wn(p, { fragment: !0 }).children);
			let m = u.children.indexOf(d);
			return u.children.splice(m, 1, ...p), Ct;
		});
	};
}
//#endregion
//#region node_modules/.pnpm/@ungap+structured-clone@1.3.1/node_modules/@ungap/structured-clone/esm/deserialize.js
var br = typeof self == "object" ? self : globalThis, xr = (e, t) => {
	switch (e) {
		case "Function":
		case "SharedWorker":
		case "Worker":
		case "eval":
		case "setInterval":
		case "setTimeout": throw TypeError("unable to deserialize " + e);
	}
	return new br[e](t);
}, Sr = (e, t) => {
	let n = (t, n) => (e.set(n, t), t), r = (i) => {
		if (e.has(i)) return e.get(i);
		let [a, o] = t[i];
		switch (a) {
			case 0:
			case -1: return n(o, i);
			case 1: {
				let e = n([], i);
				for (let t of o) e.push(r(t));
				return e;
			}
			case 2: {
				let e = n({}, i);
				for (let [t, n] of o) e[r(t)] = r(n);
				return e;
			}
			case 3: return n(new Date(o), i);
			case 4: {
				let { source: e, flags: t } = o;
				return n(new RegExp(e, t), i);
			}
			case 5: {
				let e = n(/* @__PURE__ */ new Map(), i);
				for (let [t, n] of o) e.set(r(t), r(n));
				return e;
			}
			case 6: {
				let e = n(/* @__PURE__ */ new Set(), i);
				for (let t of o) e.add(r(t));
				return e;
			}
			case 7: {
				let { name: e, message: t } = o;
				return n(xr(e, t), i);
			}
			case 8: return n(BigInt(o), i);
			case "BigInt": return n(Object(BigInt(o)), i);
			case "ArrayBuffer": return n(new Uint8Array(o).buffer, o);
			case "DataView": {
				let { buffer: e } = new Uint8Array(o);
				return n(new DataView(e), o);
			}
		}
		return n(xr(a, o), i);
	};
	return r;
}, Cr = (e) => Sr(/* @__PURE__ */ new Map(), e)(0), wr = "", { toString: Tr } = {}, { keys: Er } = Object, Dr = (e) => {
	let t = typeof e;
	if (t !== "object" || !e) return [0, t];
	let n = Tr.call(e).slice(8, -1);
	switch (n) {
		case "Array": return [1, wr];
		case "Object": return [2, wr];
		case "Date": return [3, wr];
		case "RegExp": return [4, wr];
		case "Map": return [5, wr];
		case "Set": return [6, wr];
		case "DataView": return [1, n];
	}
	return n.includes("Array") ? [1, n] : n.includes("Error") ? [7, n] : [2, n];
}, Or = ([e, t]) => e === 0 && (t === "function" || t === "symbol"), kr = (e, t, n, r) => {
	let i = (e, t) => {
		let i = r.push(e) - 1;
		return n.set(t, i), i;
	}, a = (r) => {
		if (n.has(r)) return n.get(r);
		let [o, s] = Dr(r);
		switch (o) {
			case 0: {
				let t = r;
				switch (s) {
					case "bigint":
						o = 8, t = r.toString();
						break;
					case "function":
					case "symbol":
						if (e) throw TypeError("unable to serialize " + s);
						t = null;
						break;
					case "undefined": return i([-1], r);
				}
				return i([o, t], r);
			}
			case 1: {
				if (s) {
					let e = r;
					return s === "DataView" ? e = new Uint8Array(r.buffer) : s === "ArrayBuffer" && (e = new Uint8Array(r)), i([s, [...e]], r);
				}
				let e = [], t = i([o, e], r);
				for (let t of r) e.push(a(t));
				return t;
			}
			case 2: {
				if (s) switch (s) {
					case "BigInt": return i([s, r.toString()], r);
					case "Boolean":
					case "Number":
					case "String": return i([s, r.valueOf()], r);
				}
				if (t && "toJSON" in r) return a(r.toJSON());
				let n = [], c = i([o, n], r);
				for (let t of Er(r)) (e || !Or(Dr(r[t]))) && n.push([a(t), a(r[t])]);
				return c;
			}
			case 3: return i([o, r.toISOString()], r);
			case 4: {
				let { source: e, flags: t } = r;
				return i([o, {
					source: e,
					flags: t
				}], r);
			}
			case 5: {
				let t = [], n = i([o, t], r);
				for (let [n, i] of r) (e || !(Or(Dr(n)) || Or(Dr(i)))) && t.push([a(n), a(i)]);
				return n;
			}
			case 6: {
				let t = [], n = i([o, t], r);
				for (let n of r) (e || !Or(Dr(n))) && t.push(a(n));
				return n;
			}
		}
		let { message: c } = r;
		return i([o, {
			name: s,
			message: c
		}], r);
	};
	return a;
}, Ar = (e, { json: t, lossy: n } = {}) => {
	let r = [];
	return kr(!(t || n), !!t, /* @__PURE__ */ new Map(), r)(e), r;
}, jr = typeof structuredClone == "function" ? (e, t) => t && ("json" in t || "lossy" in t) ? Cr(Ar(e, t)) : structuredClone(e) : (e, t) => Cr(Ar(e, t));
//#endregion
//#region node_modules/.pnpm/vfile-location@5.0.3/node_modules/vfile-location/lib/index.js
function Mr(e) {
	let t = String(e), n = [];
	return {
		toOffset: i,
		toPoint: r
	};
	function r(e) {
		if (typeof e == "number" && e > -1 && e <= t.length) {
			let r = 0;
			for (;;) {
				let i = n[r];
				if (i === void 0) {
					let e = Nr(t, n[r - 1]);
					i = e === -1 ? t.length + 1 : e + 1, n[r] = i;
				}
				if (i > e) return {
					line: r + 1,
					column: e - (r > 0 ? n[r - 1] : 0) + 1,
					offset: e
				};
				r++;
			}
		}
	}
	function i(e) {
		if (e && typeof e.line == "number" && typeof e.column == "number" && !Number.isNaN(e.line) && !Number.isNaN(e.column)) {
			for (; n.length < e.line;) {
				let e = n[n.length - 1], r = Nr(t, e), i = r === -1 ? t.length + 1 : r + 1;
				if (e === i) break;
				n.push(i);
			}
			let r = (e.line > 1 ? n[e.line - 2] : 0) + e.column - 1;
			if (r < n[e.line - 1]) return r;
		}
	}
}
function Nr(e, t) {
	let n = e.indexOf("\r", t), r = e.indexOf("\n", t);
	return r === -1 ? n : n === -1 || n + 1 === r ? r : n < r ? n : r;
}
//#endregion
//#region node_modules/.pnpm/hast-util-from-parse5@8.0.3/node_modules/hast-util-from-parse5/lib/index.js
var Pr = {}.hasOwnProperty, Fr = Object.prototype;
function Ir(e, t) {
	let n = t || {};
	return Lr({
		file: n.file || void 0,
		location: !1,
		schema: n.space === "svg" ? gn : hn,
		verbose: n.verbose || !1
	}, e);
}
function Lr(e, t) {
	let n;
	switch (t.nodeName) {
		case "#comment": {
			let r = t;
			return n = {
				type: "comment",
				value: r.data
			}, Br(e, r, n), n;
		}
		case "#document":
		case "#document-fragment": {
			let r = t, i = "mode" in r ? r.mode === "quirks" || r.mode === "limited-quirks" : !1;
			if (n = {
				type: "root",
				children: Rr(e, t.childNodes),
				data: { quirksMode: i }
			}, e.file && e.location) {
				let t = String(e.file), r = Mr(t), i = r.toPoint(0), a = r.toPoint(t.length);
				n.position = {
					start: i,
					end: a
				};
			}
			return n;
		}
		case "#documentType": {
			let r = t;
			return n = { type: "doctype" }, Br(e, r, n), n;
		}
		case "#text": {
			let r = t;
			return n = {
				type: "text",
				value: r.value
			}, Br(e, r, n), n;
		}
		default: return n = zr(e, t), n;
	}
}
function Rr(e, t) {
	let n = -1, r = [];
	for (; ++n < t.length;) {
		let i = Lr(e, t[n]);
		r.push(i);
	}
	return r;
}
function zr(e, t) {
	let n = e.schema;
	e.schema = t.namespaceURI === Nn.svg ? gn : hn;
	let r = -1, i = {};
	for (; ++r < t.attrs.length;) {
		let e = t.attrs[r], n = (e.prefix ? e.prefix + ":" : "") + e.name;
		Pr.call(Fr, n) || (i[n] = e.value);
	}
	let a = (e.schema.space === "svg" ? Mn : jn)(t.tagName, i, Rr(e, t.childNodes));
	if (Br(e, t, a), a.tagName === "template") {
		let n = t, r = n.sourceCodeLocation, i = r && r.startTag && Hr(r.startTag), o = r && r.endTag && Hr(r.endTag), s = Lr(e, n.content);
		i && o && e.file && (s.position = {
			start: i.end,
			end: o.start
		}), a.content = s;
	}
	return e.schema = n, a;
}
function Br(e, t, n) {
	if ("sourceCodeLocation" in t && t.sourceCodeLocation && e.file) {
		let r = Vr(e, n, t.sourceCodeLocation);
		r && (e.location = !0, n.position = r);
	}
}
function Vr(e, t, n) {
	let r = Hr(n);
	if (t.type === "element") {
		let i = t.children[t.children.length - 1];
		if (r && !n.endTag && i && i.position && i.position.end && (r.end = Object.assign({}, i.position.end)), e.verbose) {
			let r = {}, i;
			if (n.attrs) for (i in n.attrs) Pr.call(n.attrs, i) && (r[fn(e.schema, i).property] = Hr(n.attrs[i]));
			n.startTag;
			let a = Hr(n.startTag), o = n.endTag ? Hr(n.endTag) : void 0, s = { opening: a };
			o && (s.closing = o), s.properties = r, t.data = { position: s };
		}
	}
	return r;
}
function Hr(e) {
	let t = Ur({
		line: e.startLine,
		column: e.startCol,
		offset: e.startOffset
	}), n = Ur({
		line: e.endLine,
		column: e.endCol,
		offset: e.endOffset
	});
	return t || n ? {
		start: t,
		end: n
	} : void 0;
}
function Ur(e) {
	return e.line && e.column ? e : void 0;
}
//#endregion
//#region node_modules/.pnpm/zwitch@2.0.4/node_modules/zwitch/index.js
var Wr = {}.hasOwnProperty;
function Gr(e, t) {
	let n = t || {};
	function r(t, ...n) {
		let i = r.invalid, a = r.handlers;
		if (t && Wr.call(t, e)) {
			let n = String(t[e]);
			i = Wr.call(a, n) ? a[n] : r.unknown;
		}
		if (i) return i.call(this, t, ...n);
	}
	return r.handlers = n.handlers || {}, r.invalid = n.invalid, r.unknown = n.unknown, r;
}
//#endregion
//#region node_modules/.pnpm/hast-util-to-parse5@8.0.1/node_modules/hast-util-to-parse5/lib/index.js
var Kr = {}, qr = {}.hasOwnProperty, Jr = Gr("type", { handlers: {
	root: Xr,
	element: ti,
	text: $r,
	comment: ei,
	doctype: Qr
} });
function Yr(e, t) {
	let n = (t || Kr).space;
	return Jr(e, n === "svg" ? gn : hn);
}
function Xr(e, t) {
	let n = {
		nodeName: "#document",
		mode: (e.data || {}).quirksMode ? "quirks" : "no-quirks",
		childNodes: []
	};
	return n.childNodes = ri(e.children, n, t), ii(e, n), n;
}
function Zr(e, t) {
	let n = {
		nodeName: "#document-fragment",
		childNodes: []
	};
	return n.childNodes = ri(e.children, n, t), ii(e, n), n;
}
function Qr(e) {
	let t = {
		nodeName: "#documentType",
		name: "html",
		publicId: "",
		systemId: "",
		parentNode: null
	};
	return ii(e, t), t;
}
function $r(e) {
	let t = {
		nodeName: "#text",
		value: e.value,
		parentNode: null
	};
	return ii(e, t), t;
}
function ei(e) {
	let t = {
		nodeName: "#comment",
		data: e.value,
		parentNode: null
	};
	return ii(e, t), t;
}
function ti(e, t) {
	let n = t, r = n;
	e.type === "element" && e.tagName.toLowerCase() === "svg" && n.space === "html" && (r = gn);
	let i = [], a;
	if (e.properties) {
		for (a in e.properties) if (a !== "children" && qr.call(e.properties, a)) {
			let t = ni(r, a, e.properties[a]);
			t && i.push(t);
		}
	}
	let o = r.space, s = {
		nodeName: e.tagName,
		tagName: e.tagName,
		attrs: i,
		namespaceURI: Nn[o],
		childNodes: [],
		parentNode: null
	};
	return s.childNodes = ri(e.children, s, r), ii(e, s), e.tagName === "template" && e.content && (s.content = Zr(e.content, r)), s;
}
function ni(e, t, n) {
	let r = fn(e, t);
	if (n === !1 || n == null || typeof n == "number" && Number.isNaN(n) || !n && r.boolean) return;
	Array.isArray(n) && (n = r.commaSeparated ? vn(n) : Sn(n));
	let i = {
		name: r.attribute,
		value: n === !0 ? "" : String(n)
	};
	if (r.space && r.space !== "html" && r.space !== "svg") {
		let e = i.name.indexOf(":");
		e < 0 ? i.prefix = "" : (i.name = i.name.slice(e + 1), i.prefix = r.attribute.slice(0, e)), i.namespace = Nn[r.space];
	}
	return i;
}
function ri(e, t, n) {
	let r = -1, i = [];
	if (e) for (; ++r < e.length;) {
		let a = Jr(e[r], n);
		a.parentNode = t, i.push(a);
	}
	return i;
}
function ii(e, t) {
	let n = e.position;
	n && n.start && n.end && (n.start.offset, n.end.offset, t.sourceCodeLocation = {
		startLine: n.start.line,
		startCol: n.start.column,
		startOffset: n.start.offset,
		endLine: n.end.line,
		endCol: n.end.column,
		endOffset: n.end.offset
	});
}
//#endregion
//#region node_modules/.pnpm/html-void-elements@3.0.0/node_modules/html-void-elements/index.js
var ai = [
	"area",
	"base",
	"basefont",
	"bgsound",
	"br",
	"col",
	"command",
	"embed",
	"frame",
	"hr",
	"image",
	"img",
	"input",
	"keygen",
	"link",
	"meta",
	"param",
	"source",
	"track",
	"wbr"
], oi = new Set([
	65534,
	65535,
	131070,
	131071,
	196606,
	196607,
	262142,
	262143,
	327678,
	327679,
	393214,
	393215,
	458750,
	458751,
	524286,
	524287,
	589822,
	589823,
	655358,
	655359,
	720894,
	720895,
	786430,
	786431,
	851966,
	851967,
	917502,
	917503,
	983038,
	983039,
	1048574,
	1048575,
	1114110,
	1114111
]), I;
(function(e) {
	e[e.EOF = -1] = "EOF", e[e.NULL = 0] = "NULL", e[e.TABULATION = 9] = "TABULATION", e[e.CARRIAGE_RETURN = 13] = "CARRIAGE_RETURN", e[e.LINE_FEED = 10] = "LINE_FEED", e[e.FORM_FEED = 12] = "FORM_FEED", e[e.SPACE = 32] = "SPACE", e[e.EXCLAMATION_MARK = 33] = "EXCLAMATION_MARK", e[e.QUOTATION_MARK = 34] = "QUOTATION_MARK", e[e.AMPERSAND = 38] = "AMPERSAND", e[e.APOSTROPHE = 39] = "APOSTROPHE", e[e.HYPHEN_MINUS = 45] = "HYPHEN_MINUS", e[e.SOLIDUS = 47] = "SOLIDUS", e[e.DIGIT_0 = 48] = "DIGIT_0", e[e.DIGIT_9 = 57] = "DIGIT_9", e[e.SEMICOLON = 59] = "SEMICOLON", e[e.LESS_THAN_SIGN = 60] = "LESS_THAN_SIGN", e[e.EQUALS_SIGN = 61] = "EQUALS_SIGN", e[e.GREATER_THAN_SIGN = 62] = "GREATER_THAN_SIGN", e[e.QUESTION_MARK = 63] = "QUESTION_MARK", e[e.LATIN_CAPITAL_A = 65] = "LATIN_CAPITAL_A", e[e.LATIN_CAPITAL_Z = 90] = "LATIN_CAPITAL_Z", e[e.RIGHT_SQUARE_BRACKET = 93] = "RIGHT_SQUARE_BRACKET", e[e.GRAVE_ACCENT = 96] = "GRAVE_ACCENT", e[e.LATIN_SMALL_A = 97] = "LATIN_SMALL_A", e[e.LATIN_SMALL_Z = 122] = "LATIN_SMALL_Z";
})(I ||= {});
var si = {
	DASH_DASH: "--",
	CDATA_START: "[CDATA[",
	DOCTYPE: "doctype",
	SCRIPT: "script",
	PUBLIC: "public",
	SYSTEM: "system"
};
function ci(e) {
	return e >= 55296 && e <= 57343;
}
function li(e) {
	return e >= 56320 && e <= 57343;
}
function ui(e, t) {
	return (e - 55296) * 1024 + 9216 + t;
}
function di(e) {
	return e !== 32 && e !== 10 && e !== 13 && e !== 9 && e !== 12 && e >= 1 && e <= 31 || e >= 127 && e <= 159;
}
function fi(e) {
	return e >= 64976 && e <= 65007 || oi.has(e);
}
//#endregion
//#region node_modules/.pnpm/parse5@7.3.0/node_modules/parse5/dist/common/error-codes.js
var L;
(function(e) {
	e.controlCharacterInInputStream = "control-character-in-input-stream", e.noncharacterInInputStream = "noncharacter-in-input-stream", e.surrogateInInputStream = "surrogate-in-input-stream", e.nonVoidHtmlElementStartTagWithTrailingSolidus = "non-void-html-element-start-tag-with-trailing-solidus", e.endTagWithAttributes = "end-tag-with-attributes", e.endTagWithTrailingSolidus = "end-tag-with-trailing-solidus", e.unexpectedSolidusInTag = "unexpected-solidus-in-tag", e.unexpectedNullCharacter = "unexpected-null-character", e.unexpectedQuestionMarkInsteadOfTagName = "unexpected-question-mark-instead-of-tag-name", e.invalidFirstCharacterOfTagName = "invalid-first-character-of-tag-name", e.unexpectedEqualsSignBeforeAttributeName = "unexpected-equals-sign-before-attribute-name", e.missingEndTagName = "missing-end-tag-name", e.unexpectedCharacterInAttributeName = "unexpected-character-in-attribute-name", e.unknownNamedCharacterReference = "unknown-named-character-reference", e.missingSemicolonAfterCharacterReference = "missing-semicolon-after-character-reference", e.unexpectedCharacterAfterDoctypeSystemIdentifier = "unexpected-character-after-doctype-system-identifier", e.unexpectedCharacterInUnquotedAttributeValue = "unexpected-character-in-unquoted-attribute-value", e.eofBeforeTagName = "eof-before-tag-name", e.eofInTag = "eof-in-tag", e.missingAttributeValue = "missing-attribute-value", e.missingWhitespaceBetweenAttributes = "missing-whitespace-between-attributes", e.missingWhitespaceAfterDoctypePublicKeyword = "missing-whitespace-after-doctype-public-keyword", e.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers = "missing-whitespace-between-doctype-public-and-system-identifiers", e.missingWhitespaceAfterDoctypeSystemKeyword = "missing-whitespace-after-doctype-system-keyword", e.missingQuoteBeforeDoctypePublicIdentifier = "missing-quote-before-doctype-public-identifier", e.missingQuoteBeforeDoctypeSystemIdentifier = "missing-quote-before-doctype-system-identifier", e.missingDoctypePublicIdentifier = "missing-doctype-public-identifier", e.missingDoctypeSystemIdentifier = "missing-doctype-system-identifier", e.abruptDoctypePublicIdentifier = "abrupt-doctype-public-identifier", e.abruptDoctypeSystemIdentifier = "abrupt-doctype-system-identifier", e.cdataInHtmlContent = "cdata-in-html-content", e.incorrectlyOpenedComment = "incorrectly-opened-comment", e.eofInScriptHtmlCommentLikeText = "eof-in-script-html-comment-like-text", e.eofInDoctype = "eof-in-doctype", e.nestedComment = "nested-comment", e.abruptClosingOfEmptyComment = "abrupt-closing-of-empty-comment", e.eofInComment = "eof-in-comment", e.incorrectlyClosedComment = "incorrectly-closed-comment", e.eofInCdata = "eof-in-cdata", e.absenceOfDigitsInNumericCharacterReference = "absence-of-digits-in-numeric-character-reference", e.nullCharacterReference = "null-character-reference", e.surrogateCharacterReference = "surrogate-character-reference", e.characterReferenceOutsideUnicodeRange = "character-reference-outside-unicode-range", e.controlCharacterReference = "control-character-reference", e.noncharacterCharacterReference = "noncharacter-character-reference", e.missingWhitespaceBeforeDoctypeName = "missing-whitespace-before-doctype-name", e.missingDoctypeName = "missing-doctype-name", e.invalidCharacterSequenceAfterDoctypeName = "invalid-character-sequence-after-doctype-name", e.duplicateAttribute = "duplicate-attribute", e.nonConformingDoctype = "non-conforming-doctype", e.missingDoctype = "missing-doctype", e.misplacedDoctype = "misplaced-doctype", e.endTagWithoutMatchingOpenElement = "end-tag-without-matching-open-element", e.closingOfElementWithOpenChildElements = "closing-of-element-with-open-child-elements", e.disallowedContentInNoscriptInHead = "disallowed-content-in-noscript-in-head", e.openElementsLeftAfterEof = "open-elements-left-after-eof", e.abandonedHeadElementChild = "abandoned-head-element-child", e.misplacedStartTagForHeadElement = "misplaced-start-tag-for-head-element", e.nestedNoscriptInHead = "nested-noscript-in-head", e.eofInElementThatCanContainOnlyText = "eof-in-element-that-can-contain-only-text";
})(L ||= {});
//#endregion
//#region node_modules/.pnpm/parse5@7.3.0/node_modules/parse5/dist/tokenizer/preprocessor.js
var pi = 65536, mi = class {
	constructor(e) {
		this.handler = e, this.html = "", this.pos = -1, this.lastGapPos = -2, this.gapStack = [], this.skipNextNewLine = !1, this.lastChunkWritten = !1, this.endOfChunkHit = !1, this.bufferWaterline = pi, this.isEol = !1, this.lineStartPos = 0, this.droppedBufferSize = 0, this.line = 1, this.lastErrOffset = -1;
	}
	get col() {
		return this.pos - this.lineStartPos + Number(this.lastGapPos !== this.pos);
	}
	get offset() {
		return this.droppedBufferSize + this.pos;
	}
	getError(e, t) {
		let { line: n, col: r, offset: i } = this, a = r + t, o = i + t;
		return {
			code: e,
			startLine: n,
			endLine: n,
			startCol: a,
			endCol: a,
			startOffset: o,
			endOffset: o
		};
	}
	_err(e) {
		this.handler.onParseError && this.lastErrOffset !== this.offset && (this.lastErrOffset = this.offset, this.handler.onParseError(this.getError(e, 0)));
	}
	_addGap() {
		this.gapStack.push(this.lastGapPos), this.lastGapPos = this.pos;
	}
	_processSurrogate(e) {
		if (this.pos !== this.html.length - 1) {
			let t = this.html.charCodeAt(this.pos + 1);
			if (li(t)) return this.pos++, this._addGap(), ui(e, t);
		} else if (!this.lastChunkWritten) return this.endOfChunkHit = !0, I.EOF;
		return this._err(L.surrogateInInputStream), e;
	}
	willDropParsedChunk() {
		return this.pos > this.bufferWaterline;
	}
	dropParsedChunk() {
		this.willDropParsedChunk() && (this.html = this.html.substring(this.pos), this.lineStartPos -= this.pos, this.droppedBufferSize += this.pos, this.pos = 0, this.lastGapPos = -2, this.gapStack.length = 0);
	}
	write(e, t) {
		this.html.length > 0 ? this.html += e : this.html = e, this.endOfChunkHit = !1, this.lastChunkWritten = t;
	}
	insertHtmlAtCurrentPos(e) {
		this.html = this.html.substring(0, this.pos + 1) + e + this.html.substring(this.pos + 1), this.endOfChunkHit = !1;
	}
	startsWith(e, t) {
		if (this.pos + e.length > this.html.length) return this.endOfChunkHit = !this.lastChunkWritten, !1;
		if (t) return this.html.startsWith(e, this.pos);
		for (let t = 0; t < e.length; t++) if ((this.html.charCodeAt(this.pos + t) | 32) !== e.charCodeAt(t)) return !1;
		return !0;
	}
	peek(e) {
		let t = this.pos + e;
		if (t >= this.html.length) return this.endOfChunkHit = !this.lastChunkWritten, I.EOF;
		let n = this.html.charCodeAt(t);
		return n === I.CARRIAGE_RETURN ? I.LINE_FEED : n;
	}
	advance() {
		if (this.pos++, this.isEol && (this.isEol = !1, this.line++, this.lineStartPos = this.pos), this.pos >= this.html.length) return this.endOfChunkHit = !this.lastChunkWritten, I.EOF;
		let e = this.html.charCodeAt(this.pos);
		return e === I.CARRIAGE_RETURN ? (this.isEol = !0, this.skipNextNewLine = !0, I.LINE_FEED) : e === I.LINE_FEED && (this.isEol = !0, this.skipNextNewLine) ? (this.line--, this.skipNextNewLine = !1, this._addGap(), this.advance()) : (this.skipNextNewLine = !1, ci(e) && (e = this._processSurrogate(e)), this.handler.onParseError === null || e > 31 && e < 127 || e === I.LINE_FEED || e === I.CARRIAGE_RETURN || e > 159 && e < 64976 || this._checkForProblematicCharacters(e), e);
	}
	_checkForProblematicCharacters(e) {
		di(e) ? this._err(L.controlCharacterInInputStream) : fi(e) && this._err(L.noncharacterInInputStream);
	}
	retreat(e) {
		for (this.pos -= e; this.pos < this.lastGapPos;) this.lastGapPos = this.gapStack.pop(), this.pos--;
		this.isEol = !1;
	}
}, R;
(function(e) {
	e[e.CHARACTER = 0] = "CHARACTER", e[e.NULL_CHARACTER = 1] = "NULL_CHARACTER", e[e.WHITESPACE_CHARACTER = 2] = "WHITESPACE_CHARACTER", e[e.START_TAG = 3] = "START_TAG", e[e.END_TAG = 4] = "END_TAG", e[e.COMMENT = 5] = "COMMENT", e[e.DOCTYPE = 6] = "DOCTYPE", e[e.EOF = 7] = "EOF", e[e.HIBERNATION = 8] = "HIBERNATION";
})(R ||= {});
function hi(e, t) {
	for (let n = e.attrs.length - 1; n >= 0; n--) if (e.attrs[n].name === t) return e.attrs[n].value;
	return null;
}
//#endregion
//#region node_modules/.pnpm/entities@6.0.1/node_modules/entities/dist/esm/generated/decode-data-html.js
var gi = /* @__PURE__ */ new Uint16Array(/* @__PURE__ */ "ᵁ<Õıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms¦³¹ÈÏlig耻Æ䃆P耻&䀦cute耻Á䃁reve;䄂Āiyx}rc耻Â䃂;䐐r;쀀𝔄rave耻À䃀pha;䎑acr;䄀d;橓Āgp¡on;䄄f;쀀𝔸plyFunction;恡ing耻Å䃅Ācs¾Ãr;쀀𝒜ign;扔ilde耻Ã䃃ml耻Ä䃄ЀaceforsuåûþėĜĢħĪĀcrêòkslash;或Ŷöø;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀𝔅pf;쀀𝔹eve;䋘còēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻©䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻Ç䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷òſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀𝒞pĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀𝔇Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀𝔻ƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegraìȹoɴ͹\0\0ͻ»͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔eåˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀𝒟rok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻Ð䃐cute耻É䃉ƀaiyӒӗӜron;䄚rc耻Ê䃊;䐭ot;䄖r;쀀𝔈rave耻È䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀𝔼silon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻Ë䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀𝔉lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀𝔽All;戀riertrf;愱cò׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀𝔊;拙pf;쀀𝔾eater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀𝒢;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅòکrok;䄦mpńېۘownHumðįqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻Í䃍Āiyܓܘrc耻Î䃎;䐘ot;䄰r;愑rave耻Ì䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lieóϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀𝕀a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻Ï䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀𝔍pf;쀀𝕁ǣ߇\0ߌr;쀀𝒥rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀𝔎pf;쀀𝕂cr;쀀𝒦րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ightáΜs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀𝔏Ā;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊightáοightáϊf;쀀𝕃erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂòࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀𝔐nusPlus;戓pf;쀀𝕄cò੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘ë૙eryThiî૙tedĀGL૸ଆreaterGreateòٳessLesóੈLine;䀊r;쀀𝔑ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀𝒩ilde耻Ñ䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻Ó䃓Āiy෎ීrc耻Ô䃔;䐞blac;䅐r;쀀𝔒rave耻Ò䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀𝕆enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀𝒪ash耻Ø䃘iŬื฼de耻Õ䃕es;樷ml耻Ö䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀𝔓i;䎦;䎠usMinus;䂱Āipຢອncareplanåڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀𝒫;䎨ȀUfos༑༖༛༟OT耻\"䀢r;쀀𝔔pf;愚cr;쀀𝒬؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻®䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r»ཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀𝔖ortȀDLRUᄪᄴᄾᅉownArrow»ОeftArrow»࢚ightArrow»࿝pArrow;憑gma;䎣allCircle;战pf;쀀𝕊ɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀𝒮ar;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Tháྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et»ሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻Þ䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀𝔗Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀𝕋ipleDot;惛Āctዖዛr;쀀𝒯rok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻Ú䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻Û䃛;䐣blac;䅰r;쀀𝔘rave耻Ù䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀𝕌ЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥ownáϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀𝒰ilde;䅨ml耻Ü䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀𝔙pf;쀀𝕍cr;쀀𝒱dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀𝔚pf;쀀𝕎cr;쀀𝒲Ȁfiosᓋᓐᓒᓘr;쀀𝔛;䎞pf;쀀𝕏cr;쀀𝒳ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻Ý䃝Āiyᔉᔍrc;䅶;䐫r;쀀𝔜pf;쀀𝕐cr;쀀𝒴ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidtè૙a;䎖r;愨pf;愤cr;쀀𝒵௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻á䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻â䃢te肻´̆;䐰lig耻æ䃦Ā;r²ᖺ;쀀𝔞rave耻à䃠ĀepᗊᗖĀfpᗏᗔsym;愵èᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e»ᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢»¹arr;捼Āgpᙣᙧon;䄅f;쀀𝕒΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒñᚃing耻å䃥ƀctyᚡᚦᚨr;쀀𝒶;䀪mpĀ;e዁ᚯñʈilde耻ã䃣ml耻ä䃤Āciᛂᛈoninôɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e»ᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰séᜌnoõēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀𝔟g΀costuvwឍឝឳេ៕៛៞ƀaiuបពរðݠrc;旯p»፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄eåᑄåᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀𝕓Ā;tᏋᡣom»Ꮜtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻¦䂦Ȁceioᥑᥖᥚᥠr;쀀𝒷mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t»᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁îړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻ç䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻¸ƭptyv;榲t脀¢;eᨭᨮ䂢räƲr;쀀𝔠ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark»ᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟»ཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it»᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;qÇÆɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁îᅠeĀmx᫱᫶ent»᫩eóɍǧ᫾\0ᬇĀ;dኻᬂot;橭nôɆƀfryᬐᬔᬗ;쀀𝕔oäɔ脀©;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀𝒸Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒreã᭳uã᭵ee;拎edge;拏en耻¤䂤earrowĀlrᯮ᯳eft»ᮀight»ᮽeäᯝĀciᰁᰇoninôǷnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍rò΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸òᄳhĀ;vᱚᱛ怐»ऊūᱡᱧarow;椏aã̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻°䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀𝔡arĀlrᲳᲵ»ࣜ»သʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀÷;o᳧ᳰntimes;拇nø᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀𝕕ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedgåúnƀadhᄮᵝᵧownarrowóᲃarpoonĀlrᵲᵶefôᲴighôᲶŢᵿᶅkaro÷གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀𝒹;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃ròЩaòྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴoôᲉĀcsḎḔute耻é䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻ê䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀𝔢ƀ;rsṐṑṗ檚ave耻è䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et»ẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀𝕖ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on»ớ;䏵ȀcsuvỪỳἋἣĀioữḱrc»Ḯɩỹ\0\0ỻíՈantĀglἂἆtr»ṝess»Ṻƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯oô͒ĀahὉὋ;䎷耻ð䃰Āmrὓὗl耻ë䃫o;悬ƀcipὡὤὧl;䀡sôծĀeoὬὴctatioîՙnentialåչৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotseñṄy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀𝔣lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀𝕗ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻½䂽;慓耻¼䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻¾䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀𝒻ࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lanô٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀𝔤Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox»ℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀𝕘Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎proø₞r;楸qĀlqؿ↖lesó₈ií٫Āen↣↭rtneqq;쀀≩︀Å↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽ròΠȀilmr⇐⇔⇗⇛rsðᒄf»․ilôکĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it»∊lip;怦con;抹r;쀀𝔥sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀𝕙bar;怕ƀclt≯≴≸r;쀀𝒽asè⇴rok;䄧Ābp⊂⊇ull;恃hen»ᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻í䃭ƀ;iyݱ⊰⊵rc耻î䃮;䐸Ācx⊼⊿y;䐵cl耻¡䂡ĀfrΟ⋉;쀀𝔦rave耻ì䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓inåގarôܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝doô⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙eróᕣã⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀𝕚a;䎹uest耻¿䂿Āci⎊⎏r;쀀𝒾nʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻ï䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀𝔧ath;䈷pf;쀀𝕛ǣ⏬\0⏱r;쀀𝒿rcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀𝔨reen;䄸cy;䑅cy;䑜pf;쀀𝕜cr;쀀𝓀஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼rò৆òΕail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴raîࡌbda;䎻gƀ;dlࢎⓁⓃ;榑åࢎ;檅uo耻«䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝ë≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼ìࢰâ┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□aé⓶arpoonĀdu▯▴own»њp»०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoonó྘quigarro÷⇰hreetimes;拋ƀ;qs▋ও◺lanôবʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋pproøⓆot;拖qĀgq♃♅ôউgtò⒌ôছiíলƀilr♕࣡♚sht;楼;쀀𝔩Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖rò◁orneòᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che»⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox»⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽rëࣁgƀlmr⛿✍✔eftĀar০✇ightá৲apsto;柼ightá৽parrowĀlr✥✩efô⓭ight;憬ƀafl✶✹✽r;榅;쀀𝕝us;樭imes;樴š❋❏st;戗áፎƀ;ef❗❘᠀旊nge»❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇ròࢨorneòᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀𝓁mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹reå◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀Å⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻¯䂯Āet⡗⡙;時Ā;e⡞⡟朠se»⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻owîҌefôएðᏑker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle»ᘦr;쀀𝔪o;愧ƀcdn⢯⢴⣉ro耻µ䂵Ȁ;acdᑤ⢽⣀⣄sôᚧir;櫰ot肻·Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛ò−ðઁĀdp⣩⣮els;抧f;쀀𝕞Āct⣸⣽r;쀀𝓂pos»ᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la»˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉roø඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻\xA0ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸uiöୣĀei⩊⩎ar;椨í஘istĀ;s஠டr;쀀𝔫ȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lanô௢ií௪Ā;rஶ⪁»ஷƀAap⪊⪍⪑rò⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹rò⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro÷⫁ightarro÷⪐ƀ;qs఻⪺⫪lanôౕĀ;sౕ⫴»శiíౝĀ;rవ⫾iĀ;eచథiäඐĀpt⬌⬑f;쀀𝕟膀¬;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lleì୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳uåಥĀ;cಘ⭸Ā;eಒ⭽ñಘȀAait⮈⮋⮝⮧rò⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow»⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉uå൅;쀀𝓃ortɭ⬅\0\0⯖ará⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭å೸åഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗñസȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇìௗlde耻ñ䃱çృiangleĀlrⱒⱜeftĀ;eచⱚñదightĀ;eೋⱥñ೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻ó䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻ô䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀𝔬ͯ⵹\0\0⵼\0ⶂn;䋛ave耻ò䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨrò᪀Āir⶝ⶠr;榾oss;榻nå๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀𝕠ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨rò᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f»ⷿ耻ª䂪耻º䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧ò⸁ash耻ø䃸l;折iŬⸯ⸴de耻õ䃵esĀ;aǛ⸺s;樶ml耻ö䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀¶;l⹭⹮䂶leìЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀𝔭ƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕maô੶ne;明ƀ;tv⺿⻀⻈䏀chfork»´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎ö⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻±ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀𝕡nd耻£䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷uå໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾pproø⽃urlyeñ໙ñ໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨iíໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺ð⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴ï໻rel;抰Āci⿀⿅r;쀀𝓅;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀𝔮pf;쀀𝕢rime;恗cr;쀀𝓆ƀaeo⿸〉〓tĀei⿾々rnionóڰnt;樖stĀ;e【】䀿ñἙô༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがròႳòϝail;検aròᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕iãᅮmptyv;榳gȀ;del࿑らるろ;榒;榥å࿑uo耻»䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞ë≝ð✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶aló༞ƀabrョリヮrò៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗ì࿲âヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜnåႻarôྩt;断ƀilrㅩဣㅮsht;楽;쀀𝔯ĀaoㅷㆆrĀduㅽㅿ»ѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭaéトarpoonĀduㆻㆿowîㅾp»႒eftĀah㇊㇐rrowó࿪arpoonóՑightarrows;應quigarro÷ニhreetimes;拌g;䋚ingdotseñἲƀahm㈍㈐㈓rò࿪aòՑ;怏oustĀ;a㈞㈟掱che»㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾rëဃƀafl㉇㉊㉎r;榆;쀀𝕣us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒arò㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀𝓇Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠reåㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛quï➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡uåᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓iíሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒ë∨Ā;oਸ਼਴t耻§䂧i;䀻war;椩mĀin㍩ðnuóñt;朶rĀ;o㍶⁕쀀𝔰Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜iäᑤaraì⹯耻­䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲aròᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetmé㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀𝕤aĀdr㑍ЂesĀ;u㑔㑕晠it»㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍ñᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝ñᆮƀ;afᅻ㒦ְrť㒫ֱ»ᅼaròᅈȀcemt㒹㒾㓂㓅r;쀀𝓈tmîñiì㐕aræᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psiloîỠhé⺯s»⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦pproø㋺urlyeñᇾñᇳƀaes㖂㖈㌛pproø㌚qñ㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻¹䂹耻²䂲耻³䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨ë∮Ā;oਫ਩war;椪lig耻ß䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄rë๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀𝔱Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮pproø዁im»ኬsðኞĀas㚺㚮ð዁rn耻þ䃾Ǭ̟㛆⋧es膀×;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀á⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀𝕥rk;櫚á㍢rime;怴ƀaip㜏㜒㝤dåቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own»ᶻeftĀ;e⠀㜾ñम;扜ightĀ;e㊪㝋ñၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀𝓉;䑆cy;䑛rok;䅧Āio㞋㞎xô᝷headĀlr㞗㞠eftarro÷ࡏightarrow»ཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶ròϭar;楣Ācr㟜㟢ute耻ú䃺òᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻û䃻;䑃ƀabh㠃㠆㠋ròᎭlac;䅱aòᏃĀir㠓㠘sht;楾;쀀𝔲rave耻ù䃹š㠧㠱rĀlr㠬㠮»ॗ»ႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r»㡆op;挏ri;旸Āal㡖㡚cr;䅫肻¨͉Āgp㡢㡦on;䅳f;쀀𝕦̀adhlsuᅋ㡸㡽፲㢑㢠ownáᎳarpoonĀlr㢈㢌efô㠭ighô㠯iƀ;hl㢙㢚㢜䏅»ᏺon»㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r»㢽op;挎ng;䅯ri;旹cr;쀀𝓊ƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨»᠓Āam㣯㣲rò㢨l耻ü䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠ròϷarĀ;v㤦㤧櫨;櫩asèϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖appá␕othinçẖƀhir㓫⻈㥙opô⾵Ā;hᎷ㥢ïㆍĀiu㥩㥭gmá㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟etá㚜iangleĀlr㦪㦯eft»थight»ၑy;䐲ash»ံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨaòᑩr;쀀𝔳tré㦮suĀbp㧯㧱»ജ»൙pf;쀀𝕧roð໻tré㦴Ācu㨆㨋r;쀀𝓋Ābp㨐㨘nĀEe㦀㨖»㥾nĀEe㦒㨞»㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀𝔴pf;쀀𝕨Ā;eᑹ㩦atèᑹcr;쀀𝓌ૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tré៑r;쀀𝔵ĀAa㪔㪗ròσrò৶;䎾ĀAa㪡㪤ròθrò৫að✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀𝕩imåឲĀAa㫇㫊ròώròਁĀcq㫒ីr;쀀𝓍Āpt៖㫜ré។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻ý䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻¥䂥r;쀀𝔶cy;䑗pf;쀀𝕪cr;쀀𝓎Ācm㬦㬩y;䑎l耻ÿ䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡træᕟa;䎶r;쀀𝔷cy;䐶grarr;懝pf;쀀𝕫cr;쀀𝓏Ājn㮅㮇;怍j;怌".split("").map((e) => e.charCodeAt(0))), _i = new Map([
	[0, 65533],
	[128, 8364],
	[130, 8218],
	[131, 402],
	[132, 8222],
	[133, 8230],
	[134, 8224],
	[135, 8225],
	[136, 710],
	[137, 8240],
	[138, 352],
	[139, 8249],
	[140, 338],
	[142, 381],
	[145, 8216],
	[146, 8217],
	[147, 8220],
	[148, 8221],
	[149, 8226],
	[150, 8211],
	[151, 8212],
	[152, 732],
	[153, 8482],
	[154, 353],
	[155, 8250],
	[156, 339],
	[158, 382],
	[159, 376]
]);
String.fromCodePoint;
function vi(e) {
	return e >= 55296 && e <= 57343 || e > 1114111 ? 65533 : _i.get(e) ?? e;
}
//#endregion
//#region node_modules/.pnpm/entities@6.0.1/node_modules/entities/dist/esm/decode.js
var yi;
(function(e) {
	e[e.NUM = 35] = "NUM", e[e.SEMI = 59] = "SEMI", e[e.EQUALS = 61] = "EQUALS", e[e.ZERO = 48] = "ZERO", e[e.NINE = 57] = "NINE", e[e.LOWER_A = 97] = "LOWER_A", e[e.LOWER_F = 102] = "LOWER_F", e[e.LOWER_X = 120] = "LOWER_X", e[e.LOWER_Z = 122] = "LOWER_Z", e[e.UPPER_A = 65] = "UPPER_A", e[e.UPPER_F = 70] = "UPPER_F", e[e.UPPER_Z = 90] = "UPPER_Z";
})(yi ||= {});
var bi = 32, xi;
(function(e) {
	e[e.VALUE_LENGTH = 49152] = "VALUE_LENGTH", e[e.BRANCH_LENGTH = 16256] = "BRANCH_LENGTH", e[e.JUMP_TABLE = 127] = "JUMP_TABLE";
})(xi ||= {});
function Si(e) {
	return e >= yi.ZERO && e <= yi.NINE;
}
function Ci(e) {
	return e >= yi.UPPER_A && e <= yi.UPPER_F || e >= yi.LOWER_A && e <= yi.LOWER_F;
}
function wi(e) {
	return e >= yi.UPPER_A && e <= yi.UPPER_Z || e >= yi.LOWER_A && e <= yi.LOWER_Z || Si(e);
}
function Ti(e) {
	return e === yi.EQUALS || wi(e);
}
var Ei;
(function(e) {
	e[e.EntityStart = 0] = "EntityStart", e[e.NumericStart = 1] = "NumericStart", e[e.NumericDecimal = 2] = "NumericDecimal", e[e.NumericHex = 3] = "NumericHex", e[e.NamedEntity = 4] = "NamedEntity";
})(Ei ||= {});
var Di;
(function(e) {
	e[e.Legacy = 0] = "Legacy", e[e.Strict = 1] = "Strict", e[e.Attribute = 2] = "Attribute";
})(Di ||= {});
var Oi = class {
	constructor(e, t, n) {
		this.decodeTree = e, this.emitCodePoint = t, this.errors = n, this.state = Ei.EntityStart, this.consumed = 1, this.result = 0, this.treeIndex = 0, this.excess = 1, this.decodeMode = Di.Strict;
	}
	startEntity(e) {
		this.decodeMode = e, this.state = Ei.EntityStart, this.result = 0, this.treeIndex = 0, this.excess = 1, this.consumed = 1;
	}
	write(e, t) {
		switch (this.state) {
			case Ei.EntityStart: return e.charCodeAt(t) === yi.NUM ? (this.state = Ei.NumericStart, this.consumed += 1, this.stateNumericStart(e, t + 1)) : (this.state = Ei.NamedEntity, this.stateNamedEntity(e, t));
			case Ei.NumericStart: return this.stateNumericStart(e, t);
			case Ei.NumericDecimal: return this.stateNumericDecimal(e, t);
			case Ei.NumericHex: return this.stateNumericHex(e, t);
			case Ei.NamedEntity: return this.stateNamedEntity(e, t);
		}
	}
	stateNumericStart(e, t) {
		return t >= e.length ? -1 : (e.charCodeAt(t) | bi) === yi.LOWER_X ? (this.state = Ei.NumericHex, this.consumed += 1, this.stateNumericHex(e, t + 1)) : (this.state = Ei.NumericDecimal, this.stateNumericDecimal(e, t));
	}
	addToNumericResult(e, t, n, r) {
		if (t !== n) {
			let i = n - t;
			this.result = this.result * r ** +i + Number.parseInt(e.substr(t, i), r), this.consumed += i;
		}
	}
	stateNumericHex(e, t) {
		let n = t;
		for (; t < e.length;) {
			let r = e.charCodeAt(t);
			if (Si(r) || Ci(r)) t += 1;
			else return this.addToNumericResult(e, n, t, 16), this.emitNumericEntity(r, 3);
		}
		return this.addToNumericResult(e, n, t, 16), -1;
	}
	stateNumericDecimal(e, t) {
		let n = t;
		for (; t < e.length;) {
			let r = e.charCodeAt(t);
			if (Si(r)) t += 1;
			else return this.addToNumericResult(e, n, t, 10), this.emitNumericEntity(r, 2);
		}
		return this.addToNumericResult(e, n, t, 10), -1;
	}
	emitNumericEntity(e, t) {
		var n;
		if (this.consumed <= t) return (n = this.errors) == null || n.absenceOfDigitsInNumericCharacterReference(this.consumed), 0;
		if (e === yi.SEMI) this.consumed += 1;
		else if (this.decodeMode === Di.Strict) return 0;
		return this.emitCodePoint(vi(this.result), this.consumed), this.errors && (e !== yi.SEMI && this.errors.missingSemicolonAfterCharacterReference(), this.errors.validateNumericCharacterReference(this.result)), this.consumed;
	}
	stateNamedEntity(e, t) {
		let { decodeTree: n } = this, r = n[this.treeIndex], i = (r & xi.VALUE_LENGTH) >> 14;
		for (; t < e.length; t++, this.excess++) {
			let a = e.charCodeAt(t);
			if (this.treeIndex = ki(n, r, this.treeIndex + Math.max(1, i), a), this.treeIndex < 0) return this.result === 0 || this.decodeMode === Di.Attribute && (i === 0 || Ti(a)) ? 0 : this.emitNotTerminatedNamedEntity();
			if (r = n[this.treeIndex], i = (r & xi.VALUE_LENGTH) >> 14, i !== 0) {
				if (a === yi.SEMI) return this.emitNamedEntityData(this.treeIndex, i, this.consumed + this.excess);
				this.decodeMode !== Di.Strict && (this.result = this.treeIndex, this.consumed += this.excess, this.excess = 0);
			}
		}
		return -1;
	}
	emitNotTerminatedNamedEntity() {
		var e;
		let { result: t, decodeTree: n } = this, r = (n[t] & xi.VALUE_LENGTH) >> 14;
		return this.emitNamedEntityData(t, r, this.consumed), (e = this.errors) == null || e.missingSemicolonAfterCharacterReference(), this.consumed;
	}
	emitNamedEntityData(e, t, n) {
		let { decodeTree: r } = this;
		return this.emitCodePoint(t === 1 ? r[e] & ~xi.VALUE_LENGTH : r[e + 1], n), t === 3 && this.emitCodePoint(r[e + 2], n), n;
	}
	end() {
		var e;
		switch (this.state) {
			case Ei.NamedEntity: return this.result !== 0 && (this.decodeMode !== Di.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
			case Ei.NumericDecimal: return this.emitNumericEntity(0, 2);
			case Ei.NumericHex: return this.emitNumericEntity(0, 3);
			case Ei.NumericStart: return (e = this.errors) == null || e.absenceOfDigitsInNumericCharacterReference(this.consumed), 0;
			case Ei.EntityStart: return 0;
		}
	}
};
function ki(e, t, n, r) {
	let i = (t & xi.BRANCH_LENGTH) >> 7, a = t & xi.JUMP_TABLE;
	if (i === 0) return a !== 0 && r === a ? n : -1;
	if (a) {
		let t = r - a;
		return t < 0 || t >= i ? -1 : e[n + t] - 1;
	}
	let o = n, s = o + i - 1;
	for (; o <= s;) {
		let t = o + s >>> 1, n = e[t];
		if (n < r) o = t + 1;
		else if (n > r) s = t - 1;
		else return e[t + i];
	}
	return -1;
}
//#endregion
//#region node_modules/.pnpm/parse5@7.3.0/node_modules/parse5/dist/common/html.js
var z;
(function(e) {
	e.HTML = "http://www.w3.org/1999/xhtml", e.MATHML = "http://www.w3.org/1998/Math/MathML", e.SVG = "http://www.w3.org/2000/svg", e.XLINK = "http://www.w3.org/1999/xlink", e.XML = "http://www.w3.org/XML/1998/namespace", e.XMLNS = "http://www.w3.org/2000/xmlns/";
})(z ||= {});
var Ai;
(function(e) {
	e.TYPE = "type", e.ACTION = "action", e.ENCODING = "encoding", e.PROMPT = "prompt", e.NAME = "name", e.COLOR = "color", e.FACE = "face", e.SIZE = "size";
})(Ai ||= {});
var ji;
(function(e) {
	e.NO_QUIRKS = "no-quirks", e.QUIRKS = "quirks", e.LIMITED_QUIRKS = "limited-quirks";
})(ji ||= {});
var B;
(function(e) {
	e.A = "a", e.ADDRESS = "address", e.ANNOTATION_XML = "annotation-xml", e.APPLET = "applet", e.AREA = "area", e.ARTICLE = "article", e.ASIDE = "aside", e.B = "b", e.BASE = "base", e.BASEFONT = "basefont", e.BGSOUND = "bgsound", e.BIG = "big", e.BLOCKQUOTE = "blockquote", e.BODY = "body", e.BR = "br", e.BUTTON = "button", e.CAPTION = "caption", e.CENTER = "center", e.CODE = "code", e.COL = "col", e.COLGROUP = "colgroup", e.DD = "dd", e.DESC = "desc", e.DETAILS = "details", e.DIALOG = "dialog", e.DIR = "dir", e.DIV = "div", e.DL = "dl", e.DT = "dt", e.EM = "em", e.EMBED = "embed", e.FIELDSET = "fieldset", e.FIGCAPTION = "figcaption", e.FIGURE = "figure", e.FONT = "font", e.FOOTER = "footer", e.FOREIGN_OBJECT = "foreignObject", e.FORM = "form", e.FRAME = "frame", e.FRAMESET = "frameset", e.H1 = "h1", e.H2 = "h2", e.H3 = "h3", e.H4 = "h4", e.H5 = "h5", e.H6 = "h6", e.HEAD = "head", e.HEADER = "header", e.HGROUP = "hgroup", e.HR = "hr", e.HTML = "html", e.I = "i", e.IMG = "img", e.IMAGE = "image", e.INPUT = "input", e.IFRAME = "iframe", e.KEYGEN = "keygen", e.LABEL = "label", e.LI = "li", e.LINK = "link", e.LISTING = "listing", e.MAIN = "main", e.MALIGNMARK = "malignmark", e.MARQUEE = "marquee", e.MATH = "math", e.MENU = "menu", e.META = "meta", e.MGLYPH = "mglyph", e.MI = "mi", e.MO = "mo", e.MN = "mn", e.MS = "ms", e.MTEXT = "mtext", e.NAV = "nav", e.NOBR = "nobr", e.NOFRAMES = "noframes", e.NOEMBED = "noembed", e.NOSCRIPT = "noscript", e.OBJECT = "object", e.OL = "ol", e.OPTGROUP = "optgroup", e.OPTION = "option", e.P = "p", e.PARAM = "param", e.PLAINTEXT = "plaintext", e.PRE = "pre", e.RB = "rb", e.RP = "rp", e.RT = "rt", e.RTC = "rtc", e.RUBY = "ruby", e.S = "s", e.SCRIPT = "script", e.SEARCH = "search", e.SECTION = "section", e.SELECT = "select", e.SOURCE = "source", e.SMALL = "small", e.SPAN = "span", e.STRIKE = "strike", e.STRONG = "strong", e.STYLE = "style", e.SUB = "sub", e.SUMMARY = "summary", e.SUP = "sup", e.TABLE = "table", e.TBODY = "tbody", e.TEMPLATE = "template", e.TEXTAREA = "textarea", e.TFOOT = "tfoot", e.TD = "td", e.TH = "th", e.THEAD = "thead", e.TITLE = "title", e.TR = "tr", e.TRACK = "track", e.TT = "tt", e.U = "u", e.UL = "ul", e.SVG = "svg", e.VAR = "var", e.WBR = "wbr", e.XMP = "xmp";
})(B ||= {});
var V;
(function(e) {
	e[e.UNKNOWN = 0] = "UNKNOWN", e[e.A = 1] = "A", e[e.ADDRESS = 2] = "ADDRESS", e[e.ANNOTATION_XML = 3] = "ANNOTATION_XML", e[e.APPLET = 4] = "APPLET", e[e.AREA = 5] = "AREA", e[e.ARTICLE = 6] = "ARTICLE", e[e.ASIDE = 7] = "ASIDE", e[e.B = 8] = "B", e[e.BASE = 9] = "BASE", e[e.BASEFONT = 10] = "BASEFONT", e[e.BGSOUND = 11] = "BGSOUND", e[e.BIG = 12] = "BIG", e[e.BLOCKQUOTE = 13] = "BLOCKQUOTE", e[e.BODY = 14] = "BODY", e[e.BR = 15] = "BR", e[e.BUTTON = 16] = "BUTTON", e[e.CAPTION = 17] = "CAPTION", e[e.CENTER = 18] = "CENTER", e[e.CODE = 19] = "CODE", e[e.COL = 20] = "COL", e[e.COLGROUP = 21] = "COLGROUP", e[e.DD = 22] = "DD", e[e.DESC = 23] = "DESC", e[e.DETAILS = 24] = "DETAILS", e[e.DIALOG = 25] = "DIALOG", e[e.DIR = 26] = "DIR", e[e.DIV = 27] = "DIV", e[e.DL = 28] = "DL", e[e.DT = 29] = "DT", e[e.EM = 30] = "EM", e[e.EMBED = 31] = "EMBED", e[e.FIELDSET = 32] = "FIELDSET", e[e.FIGCAPTION = 33] = "FIGCAPTION", e[e.FIGURE = 34] = "FIGURE", e[e.FONT = 35] = "FONT", e[e.FOOTER = 36] = "FOOTER", e[e.FOREIGN_OBJECT = 37] = "FOREIGN_OBJECT", e[e.FORM = 38] = "FORM", e[e.FRAME = 39] = "FRAME", e[e.FRAMESET = 40] = "FRAMESET", e[e.H1 = 41] = "H1", e[e.H2 = 42] = "H2", e[e.H3 = 43] = "H3", e[e.H4 = 44] = "H4", e[e.H5 = 45] = "H5", e[e.H6 = 46] = "H6", e[e.HEAD = 47] = "HEAD", e[e.HEADER = 48] = "HEADER", e[e.HGROUP = 49] = "HGROUP", e[e.HR = 50] = "HR", e[e.HTML = 51] = "HTML", e[e.I = 52] = "I", e[e.IMG = 53] = "IMG", e[e.IMAGE = 54] = "IMAGE", e[e.INPUT = 55] = "INPUT", e[e.IFRAME = 56] = "IFRAME", e[e.KEYGEN = 57] = "KEYGEN", e[e.LABEL = 58] = "LABEL", e[e.LI = 59] = "LI", e[e.LINK = 60] = "LINK", e[e.LISTING = 61] = "LISTING", e[e.MAIN = 62] = "MAIN", e[e.MALIGNMARK = 63] = "MALIGNMARK", e[e.MARQUEE = 64] = "MARQUEE", e[e.MATH = 65] = "MATH", e[e.MENU = 66] = "MENU", e[e.META = 67] = "META", e[e.MGLYPH = 68] = "MGLYPH", e[e.MI = 69] = "MI", e[e.MO = 70] = "MO", e[e.MN = 71] = "MN", e[e.MS = 72] = "MS", e[e.MTEXT = 73] = "MTEXT", e[e.NAV = 74] = "NAV", e[e.NOBR = 75] = "NOBR", e[e.NOFRAMES = 76] = "NOFRAMES", e[e.NOEMBED = 77] = "NOEMBED", e[e.NOSCRIPT = 78] = "NOSCRIPT", e[e.OBJECT = 79] = "OBJECT", e[e.OL = 80] = "OL", e[e.OPTGROUP = 81] = "OPTGROUP", e[e.OPTION = 82] = "OPTION", e[e.P = 83] = "P", e[e.PARAM = 84] = "PARAM", e[e.PLAINTEXT = 85] = "PLAINTEXT", e[e.PRE = 86] = "PRE", e[e.RB = 87] = "RB", e[e.RP = 88] = "RP", e[e.RT = 89] = "RT", e[e.RTC = 90] = "RTC", e[e.RUBY = 91] = "RUBY", e[e.S = 92] = "S", e[e.SCRIPT = 93] = "SCRIPT", e[e.SEARCH = 94] = "SEARCH", e[e.SECTION = 95] = "SECTION", e[e.SELECT = 96] = "SELECT", e[e.SOURCE = 97] = "SOURCE", e[e.SMALL = 98] = "SMALL", e[e.SPAN = 99] = "SPAN", e[e.STRIKE = 100] = "STRIKE", e[e.STRONG = 101] = "STRONG", e[e.STYLE = 102] = "STYLE", e[e.SUB = 103] = "SUB", e[e.SUMMARY = 104] = "SUMMARY", e[e.SUP = 105] = "SUP", e[e.TABLE = 106] = "TABLE", e[e.TBODY = 107] = "TBODY", e[e.TEMPLATE = 108] = "TEMPLATE", e[e.TEXTAREA = 109] = "TEXTAREA", e[e.TFOOT = 110] = "TFOOT", e[e.TD = 111] = "TD", e[e.TH = 112] = "TH", e[e.THEAD = 113] = "THEAD", e[e.TITLE = 114] = "TITLE", e[e.TR = 115] = "TR", e[e.TRACK = 116] = "TRACK", e[e.TT = 117] = "TT", e[e.U = 118] = "U", e[e.UL = 119] = "UL", e[e.SVG = 120] = "SVG", e[e.VAR = 121] = "VAR", e[e.WBR = 122] = "WBR", e[e.XMP = 123] = "XMP";
})(V ||= {});
var Mi = new Map([
	[B.A, V.A],
	[B.ADDRESS, V.ADDRESS],
	[B.ANNOTATION_XML, V.ANNOTATION_XML],
	[B.APPLET, V.APPLET],
	[B.AREA, V.AREA],
	[B.ARTICLE, V.ARTICLE],
	[B.ASIDE, V.ASIDE],
	[B.B, V.B],
	[B.BASE, V.BASE],
	[B.BASEFONT, V.BASEFONT],
	[B.BGSOUND, V.BGSOUND],
	[B.BIG, V.BIG],
	[B.BLOCKQUOTE, V.BLOCKQUOTE],
	[B.BODY, V.BODY],
	[B.BR, V.BR],
	[B.BUTTON, V.BUTTON],
	[B.CAPTION, V.CAPTION],
	[B.CENTER, V.CENTER],
	[B.CODE, V.CODE],
	[B.COL, V.COL],
	[B.COLGROUP, V.COLGROUP],
	[B.DD, V.DD],
	[B.DESC, V.DESC],
	[B.DETAILS, V.DETAILS],
	[B.DIALOG, V.DIALOG],
	[B.DIR, V.DIR],
	[B.DIV, V.DIV],
	[B.DL, V.DL],
	[B.DT, V.DT],
	[B.EM, V.EM],
	[B.EMBED, V.EMBED],
	[B.FIELDSET, V.FIELDSET],
	[B.FIGCAPTION, V.FIGCAPTION],
	[B.FIGURE, V.FIGURE],
	[B.FONT, V.FONT],
	[B.FOOTER, V.FOOTER],
	[B.FOREIGN_OBJECT, V.FOREIGN_OBJECT],
	[B.FORM, V.FORM],
	[B.FRAME, V.FRAME],
	[B.FRAMESET, V.FRAMESET],
	[B.H1, V.H1],
	[B.H2, V.H2],
	[B.H3, V.H3],
	[B.H4, V.H4],
	[B.H5, V.H5],
	[B.H6, V.H6],
	[B.HEAD, V.HEAD],
	[B.HEADER, V.HEADER],
	[B.HGROUP, V.HGROUP],
	[B.HR, V.HR],
	[B.HTML, V.HTML],
	[B.I, V.I],
	[B.IMG, V.IMG],
	[B.IMAGE, V.IMAGE],
	[B.INPUT, V.INPUT],
	[B.IFRAME, V.IFRAME],
	[B.KEYGEN, V.KEYGEN],
	[B.LABEL, V.LABEL],
	[B.LI, V.LI],
	[B.LINK, V.LINK],
	[B.LISTING, V.LISTING],
	[B.MAIN, V.MAIN],
	[B.MALIGNMARK, V.MALIGNMARK],
	[B.MARQUEE, V.MARQUEE],
	[B.MATH, V.MATH],
	[B.MENU, V.MENU],
	[B.META, V.META],
	[B.MGLYPH, V.MGLYPH],
	[B.MI, V.MI],
	[B.MO, V.MO],
	[B.MN, V.MN],
	[B.MS, V.MS],
	[B.MTEXT, V.MTEXT],
	[B.NAV, V.NAV],
	[B.NOBR, V.NOBR],
	[B.NOFRAMES, V.NOFRAMES],
	[B.NOEMBED, V.NOEMBED],
	[B.NOSCRIPT, V.NOSCRIPT],
	[B.OBJECT, V.OBJECT],
	[B.OL, V.OL],
	[B.OPTGROUP, V.OPTGROUP],
	[B.OPTION, V.OPTION],
	[B.P, V.P],
	[B.PARAM, V.PARAM],
	[B.PLAINTEXT, V.PLAINTEXT],
	[B.PRE, V.PRE],
	[B.RB, V.RB],
	[B.RP, V.RP],
	[B.RT, V.RT],
	[B.RTC, V.RTC],
	[B.RUBY, V.RUBY],
	[B.S, V.S],
	[B.SCRIPT, V.SCRIPT],
	[B.SEARCH, V.SEARCH],
	[B.SECTION, V.SECTION],
	[B.SELECT, V.SELECT],
	[B.SOURCE, V.SOURCE],
	[B.SMALL, V.SMALL],
	[B.SPAN, V.SPAN],
	[B.STRIKE, V.STRIKE],
	[B.STRONG, V.STRONG],
	[B.STYLE, V.STYLE],
	[B.SUB, V.SUB],
	[B.SUMMARY, V.SUMMARY],
	[B.SUP, V.SUP],
	[B.TABLE, V.TABLE],
	[B.TBODY, V.TBODY],
	[B.TEMPLATE, V.TEMPLATE],
	[B.TEXTAREA, V.TEXTAREA],
	[B.TFOOT, V.TFOOT],
	[B.TD, V.TD],
	[B.TH, V.TH],
	[B.THEAD, V.THEAD],
	[B.TITLE, V.TITLE],
	[B.TR, V.TR],
	[B.TRACK, V.TRACK],
	[B.TT, V.TT],
	[B.U, V.U],
	[B.UL, V.UL],
	[B.SVG, V.SVG],
	[B.VAR, V.VAR],
	[B.WBR, V.WBR],
	[B.XMP, V.XMP]
]);
function Ni(e) {
	return Mi.get(e) ?? V.UNKNOWN;
}
var H = V, Pi = {
	[z.HTML]: new Set([
		H.ADDRESS,
		H.APPLET,
		H.AREA,
		H.ARTICLE,
		H.ASIDE,
		H.BASE,
		H.BASEFONT,
		H.BGSOUND,
		H.BLOCKQUOTE,
		H.BODY,
		H.BR,
		H.BUTTON,
		H.CAPTION,
		H.CENTER,
		H.COL,
		H.COLGROUP,
		H.DD,
		H.DETAILS,
		H.DIR,
		H.DIV,
		H.DL,
		H.DT,
		H.EMBED,
		H.FIELDSET,
		H.FIGCAPTION,
		H.FIGURE,
		H.FOOTER,
		H.FORM,
		H.FRAME,
		H.FRAMESET,
		H.H1,
		H.H2,
		H.H3,
		H.H4,
		H.H5,
		H.H6,
		H.HEAD,
		H.HEADER,
		H.HGROUP,
		H.HR,
		H.HTML,
		H.IFRAME,
		H.IMG,
		H.INPUT,
		H.LI,
		H.LINK,
		H.LISTING,
		H.MAIN,
		H.MARQUEE,
		H.MENU,
		H.META,
		H.NAV,
		H.NOEMBED,
		H.NOFRAMES,
		H.NOSCRIPT,
		H.OBJECT,
		H.OL,
		H.P,
		H.PARAM,
		H.PLAINTEXT,
		H.PRE,
		H.SCRIPT,
		H.SECTION,
		H.SELECT,
		H.SOURCE,
		H.STYLE,
		H.SUMMARY,
		H.TABLE,
		H.TBODY,
		H.TD,
		H.TEMPLATE,
		H.TEXTAREA,
		H.TFOOT,
		H.TH,
		H.THEAD,
		H.TITLE,
		H.TR,
		H.TRACK,
		H.UL,
		H.WBR,
		H.XMP
	]),
	[z.MATHML]: new Set([
		H.MI,
		H.MO,
		H.MN,
		H.MS,
		H.MTEXT,
		H.ANNOTATION_XML
	]),
	[z.SVG]: new Set([
		H.TITLE,
		H.FOREIGN_OBJECT,
		H.DESC
	]),
	[z.XLINK]: /* @__PURE__ */ new Set(),
	[z.XML]: /* @__PURE__ */ new Set(),
	[z.XMLNS]: /* @__PURE__ */ new Set()
}, Fi = new Set([
	H.H1,
	H.H2,
	H.H3,
	H.H4,
	H.H5,
	H.H6
]);
new Set([
	B.STYLE,
	B.SCRIPT,
	B.XMP,
	B.IFRAME,
	B.NOEMBED,
	B.NOFRAMES,
	B.PLAINTEXT
]);
//#endregion
//#region node_modules/.pnpm/parse5@7.3.0/node_modules/parse5/dist/tokenizer/index.js
var U;
(function(e) {
	e[e.DATA = 0] = "DATA", e[e.RCDATA = 1] = "RCDATA", e[e.RAWTEXT = 2] = "RAWTEXT", e[e.SCRIPT_DATA = 3] = "SCRIPT_DATA", e[e.PLAINTEXT = 4] = "PLAINTEXT", e[e.TAG_OPEN = 5] = "TAG_OPEN", e[e.END_TAG_OPEN = 6] = "END_TAG_OPEN", e[e.TAG_NAME = 7] = "TAG_NAME", e[e.RCDATA_LESS_THAN_SIGN = 8] = "RCDATA_LESS_THAN_SIGN", e[e.RCDATA_END_TAG_OPEN = 9] = "RCDATA_END_TAG_OPEN", e[e.RCDATA_END_TAG_NAME = 10] = "RCDATA_END_TAG_NAME", e[e.RAWTEXT_LESS_THAN_SIGN = 11] = "RAWTEXT_LESS_THAN_SIGN", e[e.RAWTEXT_END_TAG_OPEN = 12] = "RAWTEXT_END_TAG_OPEN", e[e.RAWTEXT_END_TAG_NAME = 13] = "RAWTEXT_END_TAG_NAME", e[e.SCRIPT_DATA_LESS_THAN_SIGN = 14] = "SCRIPT_DATA_LESS_THAN_SIGN", e[e.SCRIPT_DATA_END_TAG_OPEN = 15] = "SCRIPT_DATA_END_TAG_OPEN", e[e.SCRIPT_DATA_END_TAG_NAME = 16] = "SCRIPT_DATA_END_TAG_NAME", e[e.SCRIPT_DATA_ESCAPE_START = 17] = "SCRIPT_DATA_ESCAPE_START", e[e.SCRIPT_DATA_ESCAPE_START_DASH = 18] = "SCRIPT_DATA_ESCAPE_START_DASH", e[e.SCRIPT_DATA_ESCAPED = 19] = "SCRIPT_DATA_ESCAPED", e[e.SCRIPT_DATA_ESCAPED_DASH = 20] = "SCRIPT_DATA_ESCAPED_DASH", e[e.SCRIPT_DATA_ESCAPED_DASH_DASH = 21] = "SCRIPT_DATA_ESCAPED_DASH_DASH", e[e.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN = 22] = "SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN", e[e.SCRIPT_DATA_ESCAPED_END_TAG_OPEN = 23] = "SCRIPT_DATA_ESCAPED_END_TAG_OPEN", e[e.SCRIPT_DATA_ESCAPED_END_TAG_NAME = 24] = "SCRIPT_DATA_ESCAPED_END_TAG_NAME", e[e.SCRIPT_DATA_DOUBLE_ESCAPE_START = 25] = "SCRIPT_DATA_DOUBLE_ESCAPE_START", e[e.SCRIPT_DATA_DOUBLE_ESCAPED = 26] = "SCRIPT_DATA_DOUBLE_ESCAPED", e[e.SCRIPT_DATA_DOUBLE_ESCAPED_DASH = 27] = "SCRIPT_DATA_DOUBLE_ESCAPED_DASH", e[e.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH = 28] = "SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH", e[e.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN = 29] = "SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN", e[e.SCRIPT_DATA_DOUBLE_ESCAPE_END = 30] = "SCRIPT_DATA_DOUBLE_ESCAPE_END", e[e.BEFORE_ATTRIBUTE_NAME = 31] = "BEFORE_ATTRIBUTE_NAME", e[e.ATTRIBUTE_NAME = 32] = "ATTRIBUTE_NAME", e[e.AFTER_ATTRIBUTE_NAME = 33] = "AFTER_ATTRIBUTE_NAME", e[e.BEFORE_ATTRIBUTE_VALUE = 34] = "BEFORE_ATTRIBUTE_VALUE", e[e.ATTRIBUTE_VALUE_DOUBLE_QUOTED = 35] = "ATTRIBUTE_VALUE_DOUBLE_QUOTED", e[e.ATTRIBUTE_VALUE_SINGLE_QUOTED = 36] = "ATTRIBUTE_VALUE_SINGLE_QUOTED", e[e.ATTRIBUTE_VALUE_UNQUOTED = 37] = "ATTRIBUTE_VALUE_UNQUOTED", e[e.AFTER_ATTRIBUTE_VALUE_QUOTED = 38] = "AFTER_ATTRIBUTE_VALUE_QUOTED", e[e.SELF_CLOSING_START_TAG = 39] = "SELF_CLOSING_START_TAG", e[e.BOGUS_COMMENT = 40] = "BOGUS_COMMENT", e[e.MARKUP_DECLARATION_OPEN = 41] = "MARKUP_DECLARATION_OPEN", e[e.COMMENT_START = 42] = "COMMENT_START", e[e.COMMENT_START_DASH = 43] = "COMMENT_START_DASH", e[e.COMMENT = 44] = "COMMENT", e[e.COMMENT_LESS_THAN_SIGN = 45] = "COMMENT_LESS_THAN_SIGN", e[e.COMMENT_LESS_THAN_SIGN_BANG = 46] = "COMMENT_LESS_THAN_SIGN_BANG", e[e.COMMENT_LESS_THAN_SIGN_BANG_DASH = 47] = "COMMENT_LESS_THAN_SIGN_BANG_DASH", e[e.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH = 48] = "COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH", e[e.COMMENT_END_DASH = 49] = "COMMENT_END_DASH", e[e.COMMENT_END = 50] = "COMMENT_END", e[e.COMMENT_END_BANG = 51] = "COMMENT_END_BANG", e[e.DOCTYPE = 52] = "DOCTYPE", e[e.BEFORE_DOCTYPE_NAME = 53] = "BEFORE_DOCTYPE_NAME", e[e.DOCTYPE_NAME = 54] = "DOCTYPE_NAME", e[e.AFTER_DOCTYPE_NAME = 55] = "AFTER_DOCTYPE_NAME", e[e.AFTER_DOCTYPE_PUBLIC_KEYWORD = 56] = "AFTER_DOCTYPE_PUBLIC_KEYWORD", e[e.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER = 57] = "BEFORE_DOCTYPE_PUBLIC_IDENTIFIER", e[e.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED = 58] = "DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED", e[e.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED = 59] = "DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED", e[e.AFTER_DOCTYPE_PUBLIC_IDENTIFIER = 60] = "AFTER_DOCTYPE_PUBLIC_IDENTIFIER", e[e.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS = 61] = "BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS", e[e.AFTER_DOCTYPE_SYSTEM_KEYWORD = 62] = "AFTER_DOCTYPE_SYSTEM_KEYWORD", e[e.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER = 63] = "BEFORE_DOCTYPE_SYSTEM_IDENTIFIER", e[e.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED = 64] = "DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED", e[e.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED = 65] = "DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED", e[e.AFTER_DOCTYPE_SYSTEM_IDENTIFIER = 66] = "AFTER_DOCTYPE_SYSTEM_IDENTIFIER", e[e.BOGUS_DOCTYPE = 67] = "BOGUS_DOCTYPE", e[e.CDATA_SECTION = 68] = "CDATA_SECTION", e[e.CDATA_SECTION_BRACKET = 69] = "CDATA_SECTION_BRACKET", e[e.CDATA_SECTION_END = 70] = "CDATA_SECTION_END", e[e.CHARACTER_REFERENCE = 71] = "CHARACTER_REFERENCE", e[e.AMBIGUOUS_AMPERSAND = 72] = "AMBIGUOUS_AMPERSAND";
})(U ||= {});
var Ii = {
	DATA: U.DATA,
	RCDATA: U.RCDATA,
	RAWTEXT: U.RAWTEXT,
	SCRIPT_DATA: U.SCRIPT_DATA,
	PLAINTEXT: U.PLAINTEXT,
	CDATA_SECTION: U.CDATA_SECTION
};
function Li(e) {
	return e >= I.DIGIT_0 && e <= I.DIGIT_9;
}
function Ri(e) {
	return e >= I.LATIN_CAPITAL_A && e <= I.LATIN_CAPITAL_Z;
}
function zi(e) {
	return e >= I.LATIN_SMALL_A && e <= I.LATIN_SMALL_Z;
}
function Bi(e) {
	return zi(e) || Ri(e);
}
function Vi(e) {
	return Bi(e) || Li(e);
}
function Hi(e) {
	return e + 32;
}
function Ui(e) {
	return e === I.SPACE || e === I.LINE_FEED || e === I.TABULATION || e === I.FORM_FEED;
}
function Wi(e) {
	return Ui(e) || e === I.SOLIDUS || e === I.GREATER_THAN_SIGN;
}
function Gi(e) {
	return e === I.NULL ? L.nullCharacterReference : e > 1114111 ? L.characterReferenceOutsideUnicodeRange : ci(e) ? L.surrogateCharacterReference : fi(e) ? L.noncharacterCharacterReference : di(e) || e === I.CARRIAGE_RETURN ? L.controlCharacterReference : null;
}
var Ki = class {
	constructor(e, t) {
		this.options = e, this.handler = t, this.paused = !1, this.inLoop = !1, this.inForeignNode = !1, this.lastStartTagName = "", this.active = !1, this.state = U.DATA, this.returnState = U.DATA, this.entityStartPos = 0, this.consumedAfterSnapshot = -1, this.currentCharacterToken = null, this.currentToken = null, this.currentAttr = {
			name: "",
			value: ""
		}, this.preprocessor = new mi(t), this.currentLocation = this.getCurrentLocation(-1), this.entityDecoder = new Oi(gi, (e, t) => {
			this.preprocessor.pos = this.entityStartPos + t - 1, this._flushCodePointConsumedAsCharacterReference(e);
		}, t.onParseError ? {
			missingSemicolonAfterCharacterReference: () => {
				this._err(L.missingSemicolonAfterCharacterReference, 1);
			},
			absenceOfDigitsInNumericCharacterReference: (e) => {
				this._err(L.absenceOfDigitsInNumericCharacterReference, this.entityStartPos - this.preprocessor.pos + e);
			},
			validateNumericCharacterReference: (e) => {
				let t = Gi(e);
				t && this._err(t, 1);
			}
		} : void 0);
	}
	_err(e, t = 0) {
		var n, r;
		(r = (n = this.handler).onParseError) == null || r.call(n, this.preprocessor.getError(e, t));
	}
	getCurrentLocation(e) {
		return this.options.sourceCodeLocationInfo ? {
			startLine: this.preprocessor.line,
			startCol: this.preprocessor.col - e,
			startOffset: this.preprocessor.offset - e,
			endLine: -1,
			endCol: -1,
			endOffset: -1
		} : null;
	}
	_runParsingLoop() {
		if (!this.inLoop) {
			for (this.inLoop = !0; this.active && !this.paused;) {
				this.consumedAfterSnapshot = 0;
				let e = this._consume();
				this._ensureHibernation() || this._callState(e);
			}
			this.inLoop = !1;
		}
	}
	pause() {
		this.paused = !0;
	}
	resume(e) {
		if (!this.paused) throw Error("Parser was already resumed");
		this.paused = !1, !this.inLoop && (this._runParsingLoop(), this.paused || e?.());
	}
	write(e, t, n) {
		this.active = !0, this.preprocessor.write(e, t), this._runParsingLoop(), this.paused || n?.();
	}
	insertHtmlAtCurrentPos(e) {
		this.active = !0, this.preprocessor.insertHtmlAtCurrentPos(e), this._runParsingLoop();
	}
	_ensureHibernation() {
		return this.preprocessor.endOfChunkHit ? (this.preprocessor.retreat(this.consumedAfterSnapshot), this.consumedAfterSnapshot = 0, this.active = !1, !0) : !1;
	}
	_consume() {
		return this.consumedAfterSnapshot++, this.preprocessor.advance();
	}
	_advanceBy(e) {
		this.consumedAfterSnapshot += e;
		for (let t = 0; t < e; t++) this.preprocessor.advance();
	}
	_consumeSequenceIfMatch(e, t) {
		return this.preprocessor.startsWith(e, t) ? (this._advanceBy(e.length - 1), !0) : !1;
	}
	_createStartTagToken() {
		this.currentToken = {
			type: R.START_TAG,
			tagName: "",
			tagID: V.UNKNOWN,
			selfClosing: !1,
			ackSelfClosing: !1,
			attrs: [],
			location: this.getCurrentLocation(1)
		};
	}
	_createEndTagToken() {
		this.currentToken = {
			type: R.END_TAG,
			tagName: "",
			tagID: V.UNKNOWN,
			selfClosing: !1,
			ackSelfClosing: !1,
			attrs: [],
			location: this.getCurrentLocation(2)
		};
	}
	_createCommentToken(e) {
		this.currentToken = {
			type: R.COMMENT,
			data: "",
			location: this.getCurrentLocation(e)
		};
	}
	_createDoctypeToken(e) {
		this.currentToken = {
			type: R.DOCTYPE,
			name: e,
			forceQuirks: !1,
			publicId: null,
			systemId: null,
			location: this.currentLocation
		};
	}
	_createCharacterToken(e, t) {
		this.currentCharacterToken = {
			type: e,
			chars: t,
			location: this.currentLocation
		};
	}
	_createAttr(e) {
		this.currentAttr = {
			name: e,
			value: ""
		}, this.currentLocation = this.getCurrentLocation(0);
	}
	_leaveAttrName() {
		var e;
		let t = this.currentToken;
		if (hi(t, this.currentAttr.name) === null) {
			if (t.attrs.push(this.currentAttr), t.location && this.currentLocation) {
				let n = (e = t.location).attrs ?? (e.attrs = Object.create(null));
				n[this.currentAttr.name] = this.currentLocation, this._leaveAttrValue();
			}
		} else this._err(L.duplicateAttribute);
	}
	_leaveAttrValue() {
		this.currentLocation && (this.currentLocation.endLine = this.preprocessor.line, this.currentLocation.endCol = this.preprocessor.col, this.currentLocation.endOffset = this.preprocessor.offset);
	}
	prepareToken(e) {
		this._emitCurrentCharacterToken(e.location), this.currentToken = null, e.location && (e.location.endLine = this.preprocessor.line, e.location.endCol = this.preprocessor.col + 1, e.location.endOffset = this.preprocessor.offset + 1), this.currentLocation = this.getCurrentLocation(-1);
	}
	emitCurrentTagToken() {
		let e = this.currentToken;
		this.prepareToken(e), e.tagID = Ni(e.tagName), e.type === R.START_TAG ? (this.lastStartTagName = e.tagName, this.handler.onStartTag(e)) : (e.attrs.length > 0 && this._err(L.endTagWithAttributes), e.selfClosing && this._err(L.endTagWithTrailingSolidus), this.handler.onEndTag(e)), this.preprocessor.dropParsedChunk();
	}
	emitCurrentComment(e) {
		this.prepareToken(e), this.handler.onComment(e), this.preprocessor.dropParsedChunk();
	}
	emitCurrentDoctype(e) {
		this.prepareToken(e), this.handler.onDoctype(e), this.preprocessor.dropParsedChunk();
	}
	_emitCurrentCharacterToken(e) {
		if (this.currentCharacterToken) {
			switch (e && this.currentCharacterToken.location && (this.currentCharacterToken.location.endLine = e.startLine, this.currentCharacterToken.location.endCol = e.startCol, this.currentCharacterToken.location.endOffset = e.startOffset), this.currentCharacterToken.type) {
				case R.CHARACTER:
					this.handler.onCharacter(this.currentCharacterToken);
					break;
				case R.NULL_CHARACTER:
					this.handler.onNullCharacter(this.currentCharacterToken);
					break;
				case R.WHITESPACE_CHARACTER:
					this.handler.onWhitespaceCharacter(this.currentCharacterToken);
					break;
			}
			this.currentCharacterToken = null;
		}
	}
	_emitEOFToken() {
		let e = this.getCurrentLocation(0);
		e && (e.endLine = e.startLine, e.endCol = e.startCol, e.endOffset = e.startOffset), this._emitCurrentCharacterToken(e), this.handler.onEof({
			type: R.EOF,
			location: e
		}), this.active = !1;
	}
	_appendCharToCurrentCharacterToken(e, t) {
		if (this.currentCharacterToken) if (this.currentCharacterToken.type === e) {
			this.currentCharacterToken.chars += t;
			return;
		} else this.currentLocation = this.getCurrentLocation(0), this._emitCurrentCharacterToken(this.currentLocation), this.preprocessor.dropParsedChunk();
		this._createCharacterToken(e, t);
	}
	_emitCodePoint(e) {
		let t = Ui(e) ? R.WHITESPACE_CHARACTER : e === I.NULL ? R.NULL_CHARACTER : R.CHARACTER;
		this._appendCharToCurrentCharacterToken(t, String.fromCodePoint(e));
	}
	_emitChars(e) {
		this._appendCharToCurrentCharacterToken(R.CHARACTER, e);
	}
	_startCharacterReference() {
		this.returnState = this.state, this.state = U.CHARACTER_REFERENCE, this.entityStartPos = this.preprocessor.pos, this.entityDecoder.startEntity(this._isCharacterReferenceInAttribute() ? Di.Attribute : Di.Legacy);
	}
	_isCharacterReferenceInAttribute() {
		return this.returnState === U.ATTRIBUTE_VALUE_DOUBLE_QUOTED || this.returnState === U.ATTRIBUTE_VALUE_SINGLE_QUOTED || this.returnState === U.ATTRIBUTE_VALUE_UNQUOTED;
	}
	_flushCodePointConsumedAsCharacterReference(e) {
		this._isCharacterReferenceInAttribute() ? this.currentAttr.value += String.fromCodePoint(e) : this._emitCodePoint(e);
	}
	_callState(e) {
		switch (this.state) {
			case U.DATA:
				this._stateData(e);
				break;
			case U.RCDATA:
				this._stateRcdata(e);
				break;
			case U.RAWTEXT:
				this._stateRawtext(e);
				break;
			case U.SCRIPT_DATA:
				this._stateScriptData(e);
				break;
			case U.PLAINTEXT:
				this._statePlaintext(e);
				break;
			case U.TAG_OPEN:
				this._stateTagOpen(e);
				break;
			case U.END_TAG_OPEN:
				this._stateEndTagOpen(e);
				break;
			case U.TAG_NAME:
				this._stateTagName(e);
				break;
			case U.RCDATA_LESS_THAN_SIGN:
				this._stateRcdataLessThanSign(e);
				break;
			case U.RCDATA_END_TAG_OPEN:
				this._stateRcdataEndTagOpen(e);
				break;
			case U.RCDATA_END_TAG_NAME:
				this._stateRcdataEndTagName(e);
				break;
			case U.RAWTEXT_LESS_THAN_SIGN:
				this._stateRawtextLessThanSign(e);
				break;
			case U.RAWTEXT_END_TAG_OPEN:
				this._stateRawtextEndTagOpen(e);
				break;
			case U.RAWTEXT_END_TAG_NAME:
				this._stateRawtextEndTagName(e);
				break;
			case U.SCRIPT_DATA_LESS_THAN_SIGN:
				this._stateScriptDataLessThanSign(e);
				break;
			case U.SCRIPT_DATA_END_TAG_OPEN:
				this._stateScriptDataEndTagOpen(e);
				break;
			case U.SCRIPT_DATA_END_TAG_NAME:
				this._stateScriptDataEndTagName(e);
				break;
			case U.SCRIPT_DATA_ESCAPE_START:
				this._stateScriptDataEscapeStart(e);
				break;
			case U.SCRIPT_DATA_ESCAPE_START_DASH:
				this._stateScriptDataEscapeStartDash(e);
				break;
			case U.SCRIPT_DATA_ESCAPED:
				this._stateScriptDataEscaped(e);
				break;
			case U.SCRIPT_DATA_ESCAPED_DASH:
				this._stateScriptDataEscapedDash(e);
				break;
			case U.SCRIPT_DATA_ESCAPED_DASH_DASH:
				this._stateScriptDataEscapedDashDash(e);
				break;
			case U.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN:
				this._stateScriptDataEscapedLessThanSign(e);
				break;
			case U.SCRIPT_DATA_ESCAPED_END_TAG_OPEN:
				this._stateScriptDataEscapedEndTagOpen(e);
				break;
			case U.SCRIPT_DATA_ESCAPED_END_TAG_NAME:
				this._stateScriptDataEscapedEndTagName(e);
				break;
			case U.SCRIPT_DATA_DOUBLE_ESCAPE_START:
				this._stateScriptDataDoubleEscapeStart(e);
				break;
			case U.SCRIPT_DATA_DOUBLE_ESCAPED:
				this._stateScriptDataDoubleEscaped(e);
				break;
			case U.SCRIPT_DATA_DOUBLE_ESCAPED_DASH:
				this._stateScriptDataDoubleEscapedDash(e);
				break;
			case U.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH:
				this._stateScriptDataDoubleEscapedDashDash(e);
				break;
			case U.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN:
				this._stateScriptDataDoubleEscapedLessThanSign(e);
				break;
			case U.SCRIPT_DATA_DOUBLE_ESCAPE_END:
				this._stateScriptDataDoubleEscapeEnd(e);
				break;
			case U.BEFORE_ATTRIBUTE_NAME:
				this._stateBeforeAttributeName(e);
				break;
			case U.ATTRIBUTE_NAME:
				this._stateAttributeName(e);
				break;
			case U.AFTER_ATTRIBUTE_NAME:
				this._stateAfterAttributeName(e);
				break;
			case U.BEFORE_ATTRIBUTE_VALUE:
				this._stateBeforeAttributeValue(e);
				break;
			case U.ATTRIBUTE_VALUE_DOUBLE_QUOTED:
				this._stateAttributeValueDoubleQuoted(e);
				break;
			case U.ATTRIBUTE_VALUE_SINGLE_QUOTED:
				this._stateAttributeValueSingleQuoted(e);
				break;
			case U.ATTRIBUTE_VALUE_UNQUOTED:
				this._stateAttributeValueUnquoted(e);
				break;
			case U.AFTER_ATTRIBUTE_VALUE_QUOTED:
				this._stateAfterAttributeValueQuoted(e);
				break;
			case U.SELF_CLOSING_START_TAG:
				this._stateSelfClosingStartTag(e);
				break;
			case U.BOGUS_COMMENT:
				this._stateBogusComment(e);
				break;
			case U.MARKUP_DECLARATION_OPEN:
				this._stateMarkupDeclarationOpen(e);
				break;
			case U.COMMENT_START:
				this._stateCommentStart(e);
				break;
			case U.COMMENT_START_DASH:
				this._stateCommentStartDash(e);
				break;
			case U.COMMENT:
				this._stateComment(e);
				break;
			case U.COMMENT_LESS_THAN_SIGN:
				this._stateCommentLessThanSign(e);
				break;
			case U.COMMENT_LESS_THAN_SIGN_BANG:
				this._stateCommentLessThanSignBang(e);
				break;
			case U.COMMENT_LESS_THAN_SIGN_BANG_DASH:
				this._stateCommentLessThanSignBangDash(e);
				break;
			case U.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH:
				this._stateCommentLessThanSignBangDashDash(e);
				break;
			case U.COMMENT_END_DASH:
				this._stateCommentEndDash(e);
				break;
			case U.COMMENT_END:
				this._stateCommentEnd(e);
				break;
			case U.COMMENT_END_BANG:
				this._stateCommentEndBang(e);
				break;
			case U.DOCTYPE:
				this._stateDoctype(e);
				break;
			case U.BEFORE_DOCTYPE_NAME:
				this._stateBeforeDoctypeName(e);
				break;
			case U.DOCTYPE_NAME:
				this._stateDoctypeName(e);
				break;
			case U.AFTER_DOCTYPE_NAME:
				this._stateAfterDoctypeName(e);
				break;
			case U.AFTER_DOCTYPE_PUBLIC_KEYWORD:
				this._stateAfterDoctypePublicKeyword(e);
				break;
			case U.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER:
				this._stateBeforeDoctypePublicIdentifier(e);
				break;
			case U.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED:
				this._stateDoctypePublicIdentifierDoubleQuoted(e);
				break;
			case U.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED:
				this._stateDoctypePublicIdentifierSingleQuoted(e);
				break;
			case U.AFTER_DOCTYPE_PUBLIC_IDENTIFIER:
				this._stateAfterDoctypePublicIdentifier(e);
				break;
			case U.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS:
				this._stateBetweenDoctypePublicAndSystemIdentifiers(e);
				break;
			case U.AFTER_DOCTYPE_SYSTEM_KEYWORD:
				this._stateAfterDoctypeSystemKeyword(e);
				break;
			case U.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER:
				this._stateBeforeDoctypeSystemIdentifier(e);
				break;
			case U.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED:
				this._stateDoctypeSystemIdentifierDoubleQuoted(e);
				break;
			case U.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED:
				this._stateDoctypeSystemIdentifierSingleQuoted(e);
				break;
			case U.AFTER_DOCTYPE_SYSTEM_IDENTIFIER:
				this._stateAfterDoctypeSystemIdentifier(e);
				break;
			case U.BOGUS_DOCTYPE:
				this._stateBogusDoctype(e);
				break;
			case U.CDATA_SECTION:
				this._stateCdataSection(e);
				break;
			case U.CDATA_SECTION_BRACKET:
				this._stateCdataSectionBracket(e);
				break;
			case U.CDATA_SECTION_END:
				this._stateCdataSectionEnd(e);
				break;
			case U.CHARACTER_REFERENCE:
				this._stateCharacterReference();
				break;
			case U.AMBIGUOUS_AMPERSAND:
				this._stateAmbiguousAmpersand(e);
				break;
			default: throw Error("Unknown state");
		}
	}
	_stateData(e) {
		switch (e) {
			case I.LESS_THAN_SIGN:
				this.state = U.TAG_OPEN;
				break;
			case I.AMPERSAND:
				this._startCharacterReference();
				break;
			case I.NULL:
				this._err(L.unexpectedNullCharacter), this._emitCodePoint(e);
				break;
			case I.EOF:
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(e);
		}
	}
	_stateRcdata(e) {
		switch (e) {
			case I.AMPERSAND:
				this._startCharacterReference();
				break;
			case I.LESS_THAN_SIGN:
				this.state = U.RCDATA_LESS_THAN_SIGN;
				break;
			case I.NULL:
				this._err(L.unexpectedNullCharacter), this._emitChars("�");
				break;
			case I.EOF:
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(e);
		}
	}
	_stateRawtext(e) {
		switch (e) {
			case I.LESS_THAN_SIGN:
				this.state = U.RAWTEXT_LESS_THAN_SIGN;
				break;
			case I.NULL:
				this._err(L.unexpectedNullCharacter), this._emitChars("�");
				break;
			case I.EOF:
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(e);
		}
	}
	_stateScriptData(e) {
		switch (e) {
			case I.LESS_THAN_SIGN:
				this.state = U.SCRIPT_DATA_LESS_THAN_SIGN;
				break;
			case I.NULL:
				this._err(L.unexpectedNullCharacter), this._emitChars("�");
				break;
			case I.EOF:
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(e);
		}
	}
	_statePlaintext(e) {
		switch (e) {
			case I.NULL:
				this._err(L.unexpectedNullCharacter), this._emitChars("�");
				break;
			case I.EOF:
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(e);
		}
	}
	_stateTagOpen(e) {
		if (Bi(e)) this._createStartTagToken(), this.state = U.TAG_NAME, this._stateTagName(e);
		else switch (e) {
			case I.EXCLAMATION_MARK:
				this.state = U.MARKUP_DECLARATION_OPEN;
				break;
			case I.SOLIDUS:
				this.state = U.END_TAG_OPEN;
				break;
			case I.QUESTION_MARK:
				this._err(L.unexpectedQuestionMarkInsteadOfTagName), this._createCommentToken(1), this.state = U.BOGUS_COMMENT, this._stateBogusComment(e);
				break;
			case I.EOF:
				this._err(L.eofBeforeTagName), this._emitChars("<"), this._emitEOFToken();
				break;
			default: this._err(L.invalidFirstCharacterOfTagName), this._emitChars("<"), this.state = U.DATA, this._stateData(e);
		}
	}
	_stateEndTagOpen(e) {
		if (Bi(e)) this._createEndTagToken(), this.state = U.TAG_NAME, this._stateTagName(e);
		else switch (e) {
			case I.GREATER_THAN_SIGN:
				this._err(L.missingEndTagName), this.state = U.DATA;
				break;
			case I.EOF:
				this._err(L.eofBeforeTagName), this._emitChars("</"), this._emitEOFToken();
				break;
			default: this._err(L.invalidFirstCharacterOfTagName), this._createCommentToken(2), this.state = U.BOGUS_COMMENT, this._stateBogusComment(e);
		}
	}
	_stateTagName(e) {
		let t = this.currentToken;
		switch (e) {
			case I.SPACE:
			case I.LINE_FEED:
			case I.TABULATION:
			case I.FORM_FEED:
				this.state = U.BEFORE_ATTRIBUTE_NAME;
				break;
			case I.SOLIDUS:
				this.state = U.SELF_CLOSING_START_TAG;
				break;
			case I.GREATER_THAN_SIGN:
				this.state = U.DATA, this.emitCurrentTagToken();
				break;
			case I.NULL:
				this._err(L.unexpectedNullCharacter), t.tagName += "�";
				break;
			case I.EOF:
				this._err(L.eofInTag), this._emitEOFToken();
				break;
			default: t.tagName += String.fromCodePoint(Ri(e) ? Hi(e) : e);
		}
	}
	_stateRcdataLessThanSign(e) {
		e === I.SOLIDUS ? this.state = U.RCDATA_END_TAG_OPEN : (this._emitChars("<"), this.state = U.RCDATA, this._stateRcdata(e));
	}
	_stateRcdataEndTagOpen(e) {
		Bi(e) ? (this.state = U.RCDATA_END_TAG_NAME, this._stateRcdataEndTagName(e)) : (this._emitChars("</"), this.state = U.RCDATA, this._stateRcdata(e));
	}
	handleSpecialEndTag(e) {
		if (!this.preprocessor.startsWith(this.lastStartTagName, !1)) return !this._ensureHibernation();
		this._createEndTagToken();
		let t = this.currentToken;
		switch (t.tagName = this.lastStartTagName, this.preprocessor.peek(this.lastStartTagName.length)) {
			case I.SPACE:
			case I.LINE_FEED:
			case I.TABULATION:
			case I.FORM_FEED: return this._advanceBy(this.lastStartTagName.length), this.state = U.BEFORE_ATTRIBUTE_NAME, !1;
			case I.SOLIDUS: return this._advanceBy(this.lastStartTagName.length), this.state = U.SELF_CLOSING_START_TAG, !1;
			case I.GREATER_THAN_SIGN: return this._advanceBy(this.lastStartTagName.length), this.emitCurrentTagToken(), this.state = U.DATA, !1;
			default: return !this._ensureHibernation();
		}
	}
	_stateRcdataEndTagName(e) {
		this.handleSpecialEndTag(e) && (this._emitChars("</"), this.state = U.RCDATA, this._stateRcdata(e));
	}
	_stateRawtextLessThanSign(e) {
		e === I.SOLIDUS ? this.state = U.RAWTEXT_END_TAG_OPEN : (this._emitChars("<"), this.state = U.RAWTEXT, this._stateRawtext(e));
	}
	_stateRawtextEndTagOpen(e) {
		Bi(e) ? (this.state = U.RAWTEXT_END_TAG_NAME, this._stateRawtextEndTagName(e)) : (this._emitChars("</"), this.state = U.RAWTEXT, this._stateRawtext(e));
	}
	_stateRawtextEndTagName(e) {
		this.handleSpecialEndTag(e) && (this._emitChars("</"), this.state = U.RAWTEXT, this._stateRawtext(e));
	}
	_stateScriptDataLessThanSign(e) {
		switch (e) {
			case I.SOLIDUS:
				this.state = U.SCRIPT_DATA_END_TAG_OPEN;
				break;
			case I.EXCLAMATION_MARK:
				this.state = U.SCRIPT_DATA_ESCAPE_START, this._emitChars("<!");
				break;
			default: this._emitChars("<"), this.state = U.SCRIPT_DATA, this._stateScriptData(e);
		}
	}
	_stateScriptDataEndTagOpen(e) {
		Bi(e) ? (this.state = U.SCRIPT_DATA_END_TAG_NAME, this._stateScriptDataEndTagName(e)) : (this._emitChars("</"), this.state = U.SCRIPT_DATA, this._stateScriptData(e));
	}
	_stateScriptDataEndTagName(e) {
		this.handleSpecialEndTag(e) && (this._emitChars("</"), this.state = U.SCRIPT_DATA, this._stateScriptData(e));
	}
	_stateScriptDataEscapeStart(e) {
		e === I.HYPHEN_MINUS ? (this.state = U.SCRIPT_DATA_ESCAPE_START_DASH, this._emitChars("-")) : (this.state = U.SCRIPT_DATA, this._stateScriptData(e));
	}
	_stateScriptDataEscapeStartDash(e) {
		e === I.HYPHEN_MINUS ? (this.state = U.SCRIPT_DATA_ESCAPED_DASH_DASH, this._emitChars("-")) : (this.state = U.SCRIPT_DATA, this._stateScriptData(e));
	}
	_stateScriptDataEscaped(e) {
		switch (e) {
			case I.HYPHEN_MINUS:
				this.state = U.SCRIPT_DATA_ESCAPED_DASH, this._emitChars("-");
				break;
			case I.LESS_THAN_SIGN:
				this.state = U.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;
				break;
			case I.NULL:
				this._err(L.unexpectedNullCharacter), this._emitChars("�");
				break;
			case I.EOF:
				this._err(L.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
				break;
			default: this._emitCodePoint(e);
		}
	}
	_stateScriptDataEscapedDash(e) {
		switch (e) {
			case I.HYPHEN_MINUS:
				this.state = U.SCRIPT_DATA_ESCAPED_DASH_DASH, this._emitChars("-");
				break;
			case I.LESS_THAN_SIGN:
				this.state = U.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;
				break;
			case I.NULL:
				this._err(L.unexpectedNullCharacter), this.state = U.SCRIPT_DATA_ESCAPED, this._emitChars("�");
				break;
			case I.EOF:
				this._err(L.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
				break;
			default: this.state = U.SCRIPT_DATA_ESCAPED, this._emitCodePoint(e);
		}
	}
	_stateScriptDataEscapedDashDash(e) {
		switch (e) {
			case I.HYPHEN_MINUS:
				this._emitChars("-");
				break;
			case I.LESS_THAN_SIGN:
				this.state = U.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;
				break;
			case I.GREATER_THAN_SIGN:
				this.state = U.SCRIPT_DATA, this._emitChars(">");
				break;
			case I.NULL:
				this._err(L.unexpectedNullCharacter), this.state = U.SCRIPT_DATA_ESCAPED, this._emitChars("�");
				break;
			case I.EOF:
				this._err(L.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
				break;
			default: this.state = U.SCRIPT_DATA_ESCAPED, this._emitCodePoint(e);
		}
	}
	_stateScriptDataEscapedLessThanSign(e) {
		e === I.SOLIDUS ? this.state = U.SCRIPT_DATA_ESCAPED_END_TAG_OPEN : Bi(e) ? (this._emitChars("<"), this.state = U.SCRIPT_DATA_DOUBLE_ESCAPE_START, this._stateScriptDataDoubleEscapeStart(e)) : (this._emitChars("<"), this.state = U.SCRIPT_DATA_ESCAPED, this._stateScriptDataEscaped(e));
	}
	_stateScriptDataEscapedEndTagOpen(e) {
		Bi(e) ? (this.state = U.SCRIPT_DATA_ESCAPED_END_TAG_NAME, this._stateScriptDataEscapedEndTagName(e)) : (this._emitChars("</"), this.state = U.SCRIPT_DATA_ESCAPED, this._stateScriptDataEscaped(e));
	}
	_stateScriptDataEscapedEndTagName(e) {
		this.handleSpecialEndTag(e) && (this._emitChars("</"), this.state = U.SCRIPT_DATA_ESCAPED, this._stateScriptDataEscaped(e));
	}
	_stateScriptDataDoubleEscapeStart(e) {
		if (this.preprocessor.startsWith(si.SCRIPT, !1) && Wi(this.preprocessor.peek(si.SCRIPT.length))) {
			this._emitCodePoint(e);
			for (let e = 0; e < si.SCRIPT.length; e++) this._emitCodePoint(this._consume());
			this.state = U.SCRIPT_DATA_DOUBLE_ESCAPED;
		} else this._ensureHibernation() || (this.state = U.SCRIPT_DATA_ESCAPED, this._stateScriptDataEscaped(e));
	}
	_stateScriptDataDoubleEscaped(e) {
		switch (e) {
			case I.HYPHEN_MINUS:
				this.state = U.SCRIPT_DATA_DOUBLE_ESCAPED_DASH, this._emitChars("-");
				break;
			case I.LESS_THAN_SIGN:
				this.state = U.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN, this._emitChars("<");
				break;
			case I.NULL:
				this._err(L.unexpectedNullCharacter), this._emitChars("�");
				break;
			case I.EOF:
				this._err(L.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
				break;
			default: this._emitCodePoint(e);
		}
	}
	_stateScriptDataDoubleEscapedDash(e) {
		switch (e) {
			case I.HYPHEN_MINUS:
				this.state = U.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH, this._emitChars("-");
				break;
			case I.LESS_THAN_SIGN:
				this.state = U.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN, this._emitChars("<");
				break;
			case I.NULL:
				this._err(L.unexpectedNullCharacter), this.state = U.SCRIPT_DATA_DOUBLE_ESCAPED, this._emitChars("�");
				break;
			case I.EOF:
				this._err(L.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
				break;
			default: this.state = U.SCRIPT_DATA_DOUBLE_ESCAPED, this._emitCodePoint(e);
		}
	}
	_stateScriptDataDoubleEscapedDashDash(e) {
		switch (e) {
			case I.HYPHEN_MINUS:
				this._emitChars("-");
				break;
			case I.LESS_THAN_SIGN:
				this.state = U.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN, this._emitChars("<");
				break;
			case I.GREATER_THAN_SIGN:
				this.state = U.SCRIPT_DATA, this._emitChars(">");
				break;
			case I.NULL:
				this._err(L.unexpectedNullCharacter), this.state = U.SCRIPT_DATA_DOUBLE_ESCAPED, this._emitChars("�");
				break;
			case I.EOF:
				this._err(L.eofInScriptHtmlCommentLikeText), this._emitEOFToken();
				break;
			default: this.state = U.SCRIPT_DATA_DOUBLE_ESCAPED, this._emitCodePoint(e);
		}
	}
	_stateScriptDataDoubleEscapedLessThanSign(e) {
		e === I.SOLIDUS ? (this.state = U.SCRIPT_DATA_DOUBLE_ESCAPE_END, this._emitChars("/")) : (this.state = U.SCRIPT_DATA_DOUBLE_ESCAPED, this._stateScriptDataDoubleEscaped(e));
	}
	_stateScriptDataDoubleEscapeEnd(e) {
		if (this.preprocessor.startsWith(si.SCRIPT, !1) && Wi(this.preprocessor.peek(si.SCRIPT.length))) {
			this._emitCodePoint(e);
			for (let e = 0; e < si.SCRIPT.length; e++) this._emitCodePoint(this._consume());
			this.state = U.SCRIPT_DATA_ESCAPED;
		} else this._ensureHibernation() || (this.state = U.SCRIPT_DATA_DOUBLE_ESCAPED, this._stateScriptDataDoubleEscaped(e));
	}
	_stateBeforeAttributeName(e) {
		switch (e) {
			case I.SPACE:
			case I.LINE_FEED:
			case I.TABULATION:
			case I.FORM_FEED: break;
			case I.SOLIDUS:
			case I.GREATER_THAN_SIGN:
			case I.EOF:
				this.state = U.AFTER_ATTRIBUTE_NAME, this._stateAfterAttributeName(e);
				break;
			case I.EQUALS_SIGN:
				this._err(L.unexpectedEqualsSignBeforeAttributeName), this._createAttr("="), this.state = U.ATTRIBUTE_NAME;
				break;
			default: this._createAttr(""), this.state = U.ATTRIBUTE_NAME, this._stateAttributeName(e);
		}
	}
	_stateAttributeName(e) {
		switch (e) {
			case I.SPACE:
			case I.LINE_FEED:
			case I.TABULATION:
			case I.FORM_FEED:
			case I.SOLIDUS:
			case I.GREATER_THAN_SIGN:
			case I.EOF:
				this._leaveAttrName(), this.state = U.AFTER_ATTRIBUTE_NAME, this._stateAfterAttributeName(e);
				break;
			case I.EQUALS_SIGN:
				this._leaveAttrName(), this.state = U.BEFORE_ATTRIBUTE_VALUE;
				break;
			case I.QUOTATION_MARK:
			case I.APOSTROPHE:
			case I.LESS_THAN_SIGN:
				this._err(L.unexpectedCharacterInAttributeName), this.currentAttr.name += String.fromCodePoint(e);
				break;
			case I.NULL:
				this._err(L.unexpectedNullCharacter), this.currentAttr.name += "�";
				break;
			default: this.currentAttr.name += String.fromCodePoint(Ri(e) ? Hi(e) : e);
		}
	}
	_stateAfterAttributeName(e) {
		switch (e) {
			case I.SPACE:
			case I.LINE_FEED:
			case I.TABULATION:
			case I.FORM_FEED: break;
			case I.SOLIDUS:
				this.state = U.SELF_CLOSING_START_TAG;
				break;
			case I.EQUALS_SIGN:
				this.state = U.BEFORE_ATTRIBUTE_VALUE;
				break;
			case I.GREATER_THAN_SIGN:
				this.state = U.DATA, this.emitCurrentTagToken();
				break;
			case I.EOF:
				this._err(L.eofInTag), this._emitEOFToken();
				break;
			default: this._createAttr(""), this.state = U.ATTRIBUTE_NAME, this._stateAttributeName(e);
		}
	}
	_stateBeforeAttributeValue(e) {
		switch (e) {
			case I.SPACE:
			case I.LINE_FEED:
			case I.TABULATION:
			case I.FORM_FEED: break;
			case I.QUOTATION_MARK:
				this.state = U.ATTRIBUTE_VALUE_DOUBLE_QUOTED;
				break;
			case I.APOSTROPHE:
				this.state = U.ATTRIBUTE_VALUE_SINGLE_QUOTED;
				break;
			case I.GREATER_THAN_SIGN:
				this._err(L.missingAttributeValue), this.state = U.DATA, this.emitCurrentTagToken();
				break;
			default: this.state = U.ATTRIBUTE_VALUE_UNQUOTED, this._stateAttributeValueUnquoted(e);
		}
	}
	_stateAttributeValueDoubleQuoted(e) {
		switch (e) {
			case I.QUOTATION_MARK:
				this.state = U.AFTER_ATTRIBUTE_VALUE_QUOTED;
				break;
			case I.AMPERSAND:
				this._startCharacterReference();
				break;
			case I.NULL:
				this._err(L.unexpectedNullCharacter), this.currentAttr.value += "�";
				break;
			case I.EOF:
				this._err(L.eofInTag), this._emitEOFToken();
				break;
			default: this.currentAttr.value += String.fromCodePoint(e);
		}
	}
	_stateAttributeValueSingleQuoted(e) {
		switch (e) {
			case I.APOSTROPHE:
				this.state = U.AFTER_ATTRIBUTE_VALUE_QUOTED;
				break;
			case I.AMPERSAND:
				this._startCharacterReference();
				break;
			case I.NULL:
				this._err(L.unexpectedNullCharacter), this.currentAttr.value += "�";
				break;
			case I.EOF:
				this._err(L.eofInTag), this._emitEOFToken();
				break;
			default: this.currentAttr.value += String.fromCodePoint(e);
		}
	}
	_stateAttributeValueUnquoted(e) {
		switch (e) {
			case I.SPACE:
			case I.LINE_FEED:
			case I.TABULATION:
			case I.FORM_FEED:
				this._leaveAttrValue(), this.state = U.BEFORE_ATTRIBUTE_NAME;
				break;
			case I.AMPERSAND:
				this._startCharacterReference();
				break;
			case I.GREATER_THAN_SIGN:
				this._leaveAttrValue(), this.state = U.DATA, this.emitCurrentTagToken();
				break;
			case I.NULL:
				this._err(L.unexpectedNullCharacter), this.currentAttr.value += "�";
				break;
			case I.QUOTATION_MARK:
			case I.APOSTROPHE:
			case I.LESS_THAN_SIGN:
			case I.EQUALS_SIGN:
			case I.GRAVE_ACCENT:
				this._err(L.unexpectedCharacterInUnquotedAttributeValue), this.currentAttr.value += String.fromCodePoint(e);
				break;
			case I.EOF:
				this._err(L.eofInTag), this._emitEOFToken();
				break;
			default: this.currentAttr.value += String.fromCodePoint(e);
		}
	}
	_stateAfterAttributeValueQuoted(e) {
		switch (e) {
			case I.SPACE:
			case I.LINE_FEED:
			case I.TABULATION:
			case I.FORM_FEED:
				this._leaveAttrValue(), this.state = U.BEFORE_ATTRIBUTE_NAME;
				break;
			case I.SOLIDUS:
				this._leaveAttrValue(), this.state = U.SELF_CLOSING_START_TAG;
				break;
			case I.GREATER_THAN_SIGN:
				this._leaveAttrValue(), this.state = U.DATA, this.emitCurrentTagToken();
				break;
			case I.EOF:
				this._err(L.eofInTag), this._emitEOFToken();
				break;
			default: this._err(L.missingWhitespaceBetweenAttributes), this.state = U.BEFORE_ATTRIBUTE_NAME, this._stateBeforeAttributeName(e);
		}
	}
	_stateSelfClosingStartTag(e) {
		switch (e) {
			case I.GREATER_THAN_SIGN: {
				let e = this.currentToken;
				e.selfClosing = !0, this.state = U.DATA, this.emitCurrentTagToken();
				break;
			}
			case I.EOF:
				this._err(L.eofInTag), this._emitEOFToken();
				break;
			default: this._err(L.unexpectedSolidusInTag), this.state = U.BEFORE_ATTRIBUTE_NAME, this._stateBeforeAttributeName(e);
		}
	}
	_stateBogusComment(e) {
		let t = this.currentToken;
		switch (e) {
			case I.GREATER_THAN_SIGN:
				this.state = U.DATA, this.emitCurrentComment(t);
				break;
			case I.EOF:
				this.emitCurrentComment(t), this._emitEOFToken();
				break;
			case I.NULL:
				this._err(L.unexpectedNullCharacter), t.data += "�";
				break;
			default: t.data += String.fromCodePoint(e);
		}
	}
	_stateMarkupDeclarationOpen(e) {
		this._consumeSequenceIfMatch(si.DASH_DASH, !0) ? (this._createCommentToken(si.DASH_DASH.length + 1), this.state = U.COMMENT_START) : this._consumeSequenceIfMatch(si.DOCTYPE, !1) ? (this.currentLocation = this.getCurrentLocation(si.DOCTYPE.length + 1), this.state = U.DOCTYPE) : this._consumeSequenceIfMatch(si.CDATA_START, !0) ? this.inForeignNode ? this.state = U.CDATA_SECTION : (this._err(L.cdataInHtmlContent), this._createCommentToken(si.CDATA_START.length + 1), this.currentToken.data = "[CDATA[", this.state = U.BOGUS_COMMENT) : this._ensureHibernation() || (this._err(L.incorrectlyOpenedComment), this._createCommentToken(2), this.state = U.BOGUS_COMMENT, this._stateBogusComment(e));
	}
	_stateCommentStart(e) {
		switch (e) {
			case I.HYPHEN_MINUS:
				this.state = U.COMMENT_START_DASH;
				break;
			case I.GREATER_THAN_SIGN: {
				this._err(L.abruptClosingOfEmptyComment), this.state = U.DATA;
				let e = this.currentToken;
				this.emitCurrentComment(e);
				break;
			}
			default: this.state = U.COMMENT, this._stateComment(e);
		}
	}
	_stateCommentStartDash(e) {
		let t = this.currentToken;
		switch (e) {
			case I.HYPHEN_MINUS:
				this.state = U.COMMENT_END;
				break;
			case I.GREATER_THAN_SIGN:
				this._err(L.abruptClosingOfEmptyComment), this.state = U.DATA, this.emitCurrentComment(t);
				break;
			case I.EOF:
				this._err(L.eofInComment), this.emitCurrentComment(t), this._emitEOFToken();
				break;
			default: t.data += "-", this.state = U.COMMENT, this._stateComment(e);
		}
	}
	_stateComment(e) {
		let t = this.currentToken;
		switch (e) {
			case I.HYPHEN_MINUS:
				this.state = U.COMMENT_END_DASH;
				break;
			case I.LESS_THAN_SIGN:
				t.data += "<", this.state = U.COMMENT_LESS_THAN_SIGN;
				break;
			case I.NULL:
				this._err(L.unexpectedNullCharacter), t.data += "�";
				break;
			case I.EOF:
				this._err(L.eofInComment), this.emitCurrentComment(t), this._emitEOFToken();
				break;
			default: t.data += String.fromCodePoint(e);
		}
	}
	_stateCommentLessThanSign(e) {
		let t = this.currentToken;
		switch (e) {
			case I.EXCLAMATION_MARK:
				t.data += "!", this.state = U.COMMENT_LESS_THAN_SIGN_BANG;
				break;
			case I.LESS_THAN_SIGN:
				t.data += "<";
				break;
			default: this.state = U.COMMENT, this._stateComment(e);
		}
	}
	_stateCommentLessThanSignBang(e) {
		e === I.HYPHEN_MINUS ? this.state = U.COMMENT_LESS_THAN_SIGN_BANG_DASH : (this.state = U.COMMENT, this._stateComment(e));
	}
	_stateCommentLessThanSignBangDash(e) {
		e === I.HYPHEN_MINUS ? this.state = U.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH : (this.state = U.COMMENT_END_DASH, this._stateCommentEndDash(e));
	}
	_stateCommentLessThanSignBangDashDash(e) {
		e !== I.GREATER_THAN_SIGN && e !== I.EOF && this._err(L.nestedComment), this.state = U.COMMENT_END, this._stateCommentEnd(e);
	}
	_stateCommentEndDash(e) {
		let t = this.currentToken;
		switch (e) {
			case I.HYPHEN_MINUS:
				this.state = U.COMMENT_END;
				break;
			case I.EOF:
				this._err(L.eofInComment), this.emitCurrentComment(t), this._emitEOFToken();
				break;
			default: t.data += "-", this.state = U.COMMENT, this._stateComment(e);
		}
	}
	_stateCommentEnd(e) {
		let t = this.currentToken;
		switch (e) {
			case I.GREATER_THAN_SIGN:
				this.state = U.DATA, this.emitCurrentComment(t);
				break;
			case I.EXCLAMATION_MARK:
				this.state = U.COMMENT_END_BANG;
				break;
			case I.HYPHEN_MINUS:
				t.data += "-";
				break;
			case I.EOF:
				this._err(L.eofInComment), this.emitCurrentComment(t), this._emitEOFToken();
				break;
			default: t.data += "--", this.state = U.COMMENT, this._stateComment(e);
		}
	}
	_stateCommentEndBang(e) {
		let t = this.currentToken;
		switch (e) {
			case I.HYPHEN_MINUS:
				t.data += "--!", this.state = U.COMMENT_END_DASH;
				break;
			case I.GREATER_THAN_SIGN:
				this._err(L.incorrectlyClosedComment), this.state = U.DATA, this.emitCurrentComment(t);
				break;
			case I.EOF:
				this._err(L.eofInComment), this.emitCurrentComment(t), this._emitEOFToken();
				break;
			default: t.data += "--!", this.state = U.COMMENT, this._stateComment(e);
		}
	}
	_stateDoctype(e) {
		switch (e) {
			case I.SPACE:
			case I.LINE_FEED:
			case I.TABULATION:
			case I.FORM_FEED:
				this.state = U.BEFORE_DOCTYPE_NAME;
				break;
			case I.GREATER_THAN_SIGN:
				this.state = U.BEFORE_DOCTYPE_NAME, this._stateBeforeDoctypeName(e);
				break;
			case I.EOF: {
				this._err(L.eofInDoctype), this._createDoctypeToken(null);
				let e = this.currentToken;
				e.forceQuirks = !0, this.emitCurrentDoctype(e), this._emitEOFToken();
				break;
			}
			default: this._err(L.missingWhitespaceBeforeDoctypeName), this.state = U.BEFORE_DOCTYPE_NAME, this._stateBeforeDoctypeName(e);
		}
	}
	_stateBeforeDoctypeName(e) {
		if (Ri(e)) this._createDoctypeToken(String.fromCharCode(Hi(e))), this.state = U.DOCTYPE_NAME;
		else switch (e) {
			case I.SPACE:
			case I.LINE_FEED:
			case I.TABULATION:
			case I.FORM_FEED: break;
			case I.NULL:
				this._err(L.unexpectedNullCharacter), this._createDoctypeToken("�"), this.state = U.DOCTYPE_NAME;
				break;
			case I.GREATER_THAN_SIGN: {
				this._err(L.missingDoctypeName), this._createDoctypeToken(null);
				let e = this.currentToken;
				e.forceQuirks = !0, this.emitCurrentDoctype(e), this.state = U.DATA;
				break;
			}
			case I.EOF: {
				this._err(L.eofInDoctype), this._createDoctypeToken(null);
				let e = this.currentToken;
				e.forceQuirks = !0, this.emitCurrentDoctype(e), this._emitEOFToken();
				break;
			}
			default: this._createDoctypeToken(String.fromCodePoint(e)), this.state = U.DOCTYPE_NAME;
		}
	}
	_stateDoctypeName(e) {
		let t = this.currentToken;
		switch (e) {
			case I.SPACE:
			case I.LINE_FEED:
			case I.TABULATION:
			case I.FORM_FEED:
				this.state = U.AFTER_DOCTYPE_NAME;
				break;
			case I.GREATER_THAN_SIGN:
				this.state = U.DATA, this.emitCurrentDoctype(t);
				break;
			case I.NULL:
				this._err(L.unexpectedNullCharacter), t.name += "�";
				break;
			case I.EOF:
				this._err(L.eofInDoctype), t.forceQuirks = !0, this.emitCurrentDoctype(t), this._emitEOFToken();
				break;
			default: t.name += String.fromCodePoint(Ri(e) ? Hi(e) : e);
		}
	}
	_stateAfterDoctypeName(e) {
		let t = this.currentToken;
		switch (e) {
			case I.SPACE:
			case I.LINE_FEED:
			case I.TABULATION:
			case I.FORM_FEED: break;
			case I.GREATER_THAN_SIGN:
				this.state = U.DATA, this.emitCurrentDoctype(t);
				break;
			case I.EOF:
				this._err(L.eofInDoctype), t.forceQuirks = !0, this.emitCurrentDoctype(t), this._emitEOFToken();
				break;
			default: this._consumeSequenceIfMatch(si.PUBLIC, !1) ? this.state = U.AFTER_DOCTYPE_PUBLIC_KEYWORD : this._consumeSequenceIfMatch(si.SYSTEM, !1) ? this.state = U.AFTER_DOCTYPE_SYSTEM_KEYWORD : this._ensureHibernation() || (this._err(L.invalidCharacterSequenceAfterDoctypeName), t.forceQuirks = !0, this.state = U.BOGUS_DOCTYPE, this._stateBogusDoctype(e));
		}
	}
	_stateAfterDoctypePublicKeyword(e) {
		let t = this.currentToken;
		switch (e) {
			case I.SPACE:
			case I.LINE_FEED:
			case I.TABULATION:
			case I.FORM_FEED:
				this.state = U.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER;
				break;
			case I.QUOTATION_MARK:
				this._err(L.missingWhitespaceAfterDoctypePublicKeyword), t.publicId = "", this.state = U.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED;
				break;
			case I.APOSTROPHE:
				this._err(L.missingWhitespaceAfterDoctypePublicKeyword), t.publicId = "", this.state = U.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED;
				break;
			case I.GREATER_THAN_SIGN:
				this._err(L.missingDoctypePublicIdentifier), t.forceQuirks = !0, this.state = U.DATA, this.emitCurrentDoctype(t);
				break;
			case I.EOF:
				this._err(L.eofInDoctype), t.forceQuirks = !0, this.emitCurrentDoctype(t), this._emitEOFToken();
				break;
			default: this._err(L.missingQuoteBeforeDoctypePublicIdentifier), t.forceQuirks = !0, this.state = U.BOGUS_DOCTYPE, this._stateBogusDoctype(e);
		}
	}
	_stateBeforeDoctypePublicIdentifier(e) {
		let t = this.currentToken;
		switch (e) {
			case I.SPACE:
			case I.LINE_FEED:
			case I.TABULATION:
			case I.FORM_FEED: break;
			case I.QUOTATION_MARK:
				t.publicId = "", this.state = U.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED;
				break;
			case I.APOSTROPHE:
				t.publicId = "", this.state = U.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED;
				break;
			case I.GREATER_THAN_SIGN:
				this._err(L.missingDoctypePublicIdentifier), t.forceQuirks = !0, this.state = U.DATA, this.emitCurrentDoctype(t);
				break;
			case I.EOF:
				this._err(L.eofInDoctype), t.forceQuirks = !0, this.emitCurrentDoctype(t), this._emitEOFToken();
				break;
			default: this._err(L.missingQuoteBeforeDoctypePublicIdentifier), t.forceQuirks = !0, this.state = U.BOGUS_DOCTYPE, this._stateBogusDoctype(e);
		}
	}
	_stateDoctypePublicIdentifierDoubleQuoted(e) {
		let t = this.currentToken;
		switch (e) {
			case I.QUOTATION_MARK:
				this.state = U.AFTER_DOCTYPE_PUBLIC_IDENTIFIER;
				break;
			case I.NULL:
				this._err(L.unexpectedNullCharacter), t.publicId += "�";
				break;
			case I.GREATER_THAN_SIGN:
				this._err(L.abruptDoctypePublicIdentifier), t.forceQuirks = !0, this.emitCurrentDoctype(t), this.state = U.DATA;
				break;
			case I.EOF:
				this._err(L.eofInDoctype), t.forceQuirks = !0, this.emitCurrentDoctype(t), this._emitEOFToken();
				break;
			default: t.publicId += String.fromCodePoint(e);
		}
	}
	_stateDoctypePublicIdentifierSingleQuoted(e) {
		let t = this.currentToken;
		switch (e) {
			case I.APOSTROPHE:
				this.state = U.AFTER_DOCTYPE_PUBLIC_IDENTIFIER;
				break;
			case I.NULL:
				this._err(L.unexpectedNullCharacter), t.publicId += "�";
				break;
			case I.GREATER_THAN_SIGN:
				this._err(L.abruptDoctypePublicIdentifier), t.forceQuirks = !0, this.emitCurrentDoctype(t), this.state = U.DATA;
				break;
			case I.EOF:
				this._err(L.eofInDoctype), t.forceQuirks = !0, this.emitCurrentDoctype(t), this._emitEOFToken();
				break;
			default: t.publicId += String.fromCodePoint(e);
		}
	}
	_stateAfterDoctypePublicIdentifier(e) {
		let t = this.currentToken;
		switch (e) {
			case I.SPACE:
			case I.LINE_FEED:
			case I.TABULATION:
			case I.FORM_FEED:
				this.state = U.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS;
				break;
			case I.GREATER_THAN_SIGN:
				this.state = U.DATA, this.emitCurrentDoctype(t);
				break;
			case I.QUOTATION_MARK:
				this._err(L.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers), t.systemId = "", this.state = U.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
				break;
			case I.APOSTROPHE:
				this._err(L.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers), t.systemId = "", this.state = U.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
				break;
			case I.EOF:
				this._err(L.eofInDoctype), t.forceQuirks = !0, this.emitCurrentDoctype(t), this._emitEOFToken();
				break;
			default: this._err(L.missingQuoteBeforeDoctypeSystemIdentifier), t.forceQuirks = !0, this.state = U.BOGUS_DOCTYPE, this._stateBogusDoctype(e);
		}
	}
	_stateBetweenDoctypePublicAndSystemIdentifiers(e) {
		let t = this.currentToken;
		switch (e) {
			case I.SPACE:
			case I.LINE_FEED:
			case I.TABULATION:
			case I.FORM_FEED: break;
			case I.GREATER_THAN_SIGN:
				this.emitCurrentDoctype(t), this.state = U.DATA;
				break;
			case I.QUOTATION_MARK:
				t.systemId = "", this.state = U.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
				break;
			case I.APOSTROPHE:
				t.systemId = "", this.state = U.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
				break;
			case I.EOF:
				this._err(L.eofInDoctype), t.forceQuirks = !0, this.emitCurrentDoctype(t), this._emitEOFToken();
				break;
			default: this._err(L.missingQuoteBeforeDoctypeSystemIdentifier), t.forceQuirks = !0, this.state = U.BOGUS_DOCTYPE, this._stateBogusDoctype(e);
		}
	}
	_stateAfterDoctypeSystemKeyword(e) {
		let t = this.currentToken;
		switch (e) {
			case I.SPACE:
			case I.LINE_FEED:
			case I.TABULATION:
			case I.FORM_FEED:
				this.state = U.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER;
				break;
			case I.QUOTATION_MARK:
				this._err(L.missingWhitespaceAfterDoctypeSystemKeyword), t.systemId = "", this.state = U.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
				break;
			case I.APOSTROPHE:
				this._err(L.missingWhitespaceAfterDoctypeSystemKeyword), t.systemId = "", this.state = U.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
				break;
			case I.GREATER_THAN_SIGN:
				this._err(L.missingDoctypeSystemIdentifier), t.forceQuirks = !0, this.state = U.DATA, this.emitCurrentDoctype(t);
				break;
			case I.EOF:
				this._err(L.eofInDoctype), t.forceQuirks = !0, this.emitCurrentDoctype(t), this._emitEOFToken();
				break;
			default: this._err(L.missingQuoteBeforeDoctypeSystemIdentifier), t.forceQuirks = !0, this.state = U.BOGUS_DOCTYPE, this._stateBogusDoctype(e);
		}
	}
	_stateBeforeDoctypeSystemIdentifier(e) {
		let t = this.currentToken;
		switch (e) {
			case I.SPACE:
			case I.LINE_FEED:
			case I.TABULATION:
			case I.FORM_FEED: break;
			case I.QUOTATION_MARK:
				t.systemId = "", this.state = U.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
				break;
			case I.APOSTROPHE:
				t.systemId = "", this.state = U.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
				break;
			case I.GREATER_THAN_SIGN:
				this._err(L.missingDoctypeSystemIdentifier), t.forceQuirks = !0, this.state = U.DATA, this.emitCurrentDoctype(t);
				break;
			case I.EOF:
				this._err(L.eofInDoctype), t.forceQuirks = !0, this.emitCurrentDoctype(t), this._emitEOFToken();
				break;
			default: this._err(L.missingQuoteBeforeDoctypeSystemIdentifier), t.forceQuirks = !0, this.state = U.BOGUS_DOCTYPE, this._stateBogusDoctype(e);
		}
	}
	_stateDoctypeSystemIdentifierDoubleQuoted(e) {
		let t = this.currentToken;
		switch (e) {
			case I.QUOTATION_MARK:
				this.state = U.AFTER_DOCTYPE_SYSTEM_IDENTIFIER;
				break;
			case I.NULL:
				this._err(L.unexpectedNullCharacter), t.systemId += "�";
				break;
			case I.GREATER_THAN_SIGN:
				this._err(L.abruptDoctypeSystemIdentifier), t.forceQuirks = !0, this.emitCurrentDoctype(t), this.state = U.DATA;
				break;
			case I.EOF:
				this._err(L.eofInDoctype), t.forceQuirks = !0, this.emitCurrentDoctype(t), this._emitEOFToken();
				break;
			default: t.systemId += String.fromCodePoint(e);
		}
	}
	_stateDoctypeSystemIdentifierSingleQuoted(e) {
		let t = this.currentToken;
		switch (e) {
			case I.APOSTROPHE:
				this.state = U.AFTER_DOCTYPE_SYSTEM_IDENTIFIER;
				break;
			case I.NULL:
				this._err(L.unexpectedNullCharacter), t.systemId += "�";
				break;
			case I.GREATER_THAN_SIGN:
				this._err(L.abruptDoctypeSystemIdentifier), t.forceQuirks = !0, this.emitCurrentDoctype(t), this.state = U.DATA;
				break;
			case I.EOF:
				this._err(L.eofInDoctype), t.forceQuirks = !0, this.emitCurrentDoctype(t), this._emitEOFToken();
				break;
			default: t.systemId += String.fromCodePoint(e);
		}
	}
	_stateAfterDoctypeSystemIdentifier(e) {
		let t = this.currentToken;
		switch (e) {
			case I.SPACE:
			case I.LINE_FEED:
			case I.TABULATION:
			case I.FORM_FEED: break;
			case I.GREATER_THAN_SIGN:
				this.emitCurrentDoctype(t), this.state = U.DATA;
				break;
			case I.EOF:
				this._err(L.eofInDoctype), t.forceQuirks = !0, this.emitCurrentDoctype(t), this._emitEOFToken();
				break;
			default: this._err(L.unexpectedCharacterAfterDoctypeSystemIdentifier), this.state = U.BOGUS_DOCTYPE, this._stateBogusDoctype(e);
		}
	}
	_stateBogusDoctype(e) {
		let t = this.currentToken;
		switch (e) {
			case I.GREATER_THAN_SIGN:
				this.emitCurrentDoctype(t), this.state = U.DATA;
				break;
			case I.NULL:
				this._err(L.unexpectedNullCharacter);
				break;
			case I.EOF:
				this.emitCurrentDoctype(t), this._emitEOFToken();
				break;
			default:
		}
	}
	_stateCdataSection(e) {
		switch (e) {
			case I.RIGHT_SQUARE_BRACKET:
				this.state = U.CDATA_SECTION_BRACKET;
				break;
			case I.EOF:
				this._err(L.eofInCdata), this._emitEOFToken();
				break;
			default: this._emitCodePoint(e);
		}
	}
	_stateCdataSectionBracket(e) {
		e === I.RIGHT_SQUARE_BRACKET ? this.state = U.CDATA_SECTION_END : (this._emitChars("]"), this.state = U.CDATA_SECTION, this._stateCdataSection(e));
	}
	_stateCdataSectionEnd(e) {
		switch (e) {
			case I.GREATER_THAN_SIGN:
				this.state = U.DATA;
				break;
			case I.RIGHT_SQUARE_BRACKET:
				this._emitChars("]");
				break;
			default: this._emitChars("]]"), this.state = U.CDATA_SECTION, this._stateCdataSection(e);
		}
	}
	_stateCharacterReference() {
		let e = this.entityDecoder.write(this.preprocessor.html, this.preprocessor.pos);
		if (e < 0) if (this.preprocessor.lastChunkWritten) e = this.entityDecoder.end();
		else {
			this.active = !1, this.preprocessor.pos = this.preprocessor.html.length - 1, this.consumedAfterSnapshot = 0, this.preprocessor.endOfChunkHit = !0;
			return;
		}
		e === 0 ? (this.preprocessor.pos = this.entityStartPos, this._flushCodePointConsumedAsCharacterReference(I.AMPERSAND), this.state = !this._isCharacterReferenceInAttribute() && Vi(this.preprocessor.peek(1)) ? U.AMBIGUOUS_AMPERSAND : this.returnState) : this.state = this.returnState;
	}
	_stateAmbiguousAmpersand(e) {
		Vi(e) ? this._flushCodePointConsumedAsCharacterReference(e) : (e === I.SEMICOLON && this._err(L.unknownNamedCharacterReference), this.state = this.returnState, this._callState(e));
	}
}, qi = new Set([
	V.DD,
	V.DT,
	V.LI,
	V.OPTGROUP,
	V.OPTION,
	V.P,
	V.RB,
	V.RP,
	V.RT,
	V.RTC
]), Ji = new Set([
	...qi,
	V.CAPTION,
	V.COLGROUP,
	V.TBODY,
	V.TD,
	V.TFOOT,
	V.TH,
	V.THEAD,
	V.TR
]), Yi = new Set([
	V.APPLET,
	V.CAPTION,
	V.HTML,
	V.MARQUEE,
	V.OBJECT,
	V.TABLE,
	V.TD,
	V.TEMPLATE,
	V.TH
]), Xi = new Set([
	...Yi,
	V.OL,
	V.UL
]), Zi = new Set([...Yi, V.BUTTON]), Qi = new Set([
	V.ANNOTATION_XML,
	V.MI,
	V.MN,
	V.MO,
	V.MS,
	V.MTEXT
]), $i = new Set([
	V.DESC,
	V.FOREIGN_OBJECT,
	V.TITLE
]), ea = new Set([
	V.TR,
	V.TEMPLATE,
	V.HTML
]), ta = new Set([
	V.TBODY,
	V.TFOOT,
	V.THEAD,
	V.TEMPLATE,
	V.HTML
]), na = new Set([
	V.TABLE,
	V.TEMPLATE,
	V.HTML
]), ra = new Set([V.TD, V.TH]), ia = class {
	get currentTmplContentOrNode() {
		return this._isInTemplate() ? this.treeAdapter.getTemplateContent(this.current) : this.current;
	}
	constructor(e, t, n) {
		this.treeAdapter = t, this.handler = n, this.items = [], this.tagIDs = [], this.stackTop = -1, this.tmplCount = 0, this.currentTagId = V.UNKNOWN, this.current = e;
	}
	_indexOf(e) {
		return this.items.lastIndexOf(e, this.stackTop);
	}
	_isInTemplate() {
		return this.currentTagId === V.TEMPLATE && this.treeAdapter.getNamespaceURI(this.current) === z.HTML;
	}
	_updateCurrentElement() {
		this.current = this.items[this.stackTop], this.currentTagId = this.tagIDs[this.stackTop];
	}
	push(e, t) {
		this.stackTop++, this.items[this.stackTop] = e, this.current = e, this.tagIDs[this.stackTop] = t, this.currentTagId = t, this._isInTemplate() && this.tmplCount++, this.handler.onItemPush(e, t, !0);
	}
	pop() {
		let e = this.current;
		this.tmplCount > 0 && this._isInTemplate() && this.tmplCount--, this.stackTop--, this._updateCurrentElement(), this.handler.onItemPop(e, !0);
	}
	replace(e, t) {
		let n = this._indexOf(e);
		this.items[n] = t, n === this.stackTop && (this.current = t);
	}
	insertAfter(e, t, n) {
		let r = this._indexOf(e) + 1;
		this.items.splice(r, 0, t), this.tagIDs.splice(r, 0, n), this.stackTop++, r === this.stackTop && this._updateCurrentElement(), this.current && this.currentTagId !== void 0 && this.handler.onItemPush(this.current, this.currentTagId, r === this.stackTop);
	}
	popUntilTagNamePopped(e) {
		let t = this.stackTop + 1;
		do
			t = this.tagIDs.lastIndexOf(e, t - 1);
		while (t > 0 && this.treeAdapter.getNamespaceURI(this.items[t]) !== z.HTML);
		this.shortenToLength(Math.max(t, 0));
	}
	shortenToLength(e) {
		for (; this.stackTop >= e;) {
			let t = this.current;
			this.tmplCount > 0 && this._isInTemplate() && --this.tmplCount, this.stackTop--, this._updateCurrentElement(), this.handler.onItemPop(t, this.stackTop < e);
		}
	}
	popUntilElementPopped(e) {
		let t = this._indexOf(e);
		this.shortenToLength(Math.max(t, 0));
	}
	popUntilPopped(e, t) {
		let n = this._indexOfTagNames(e, t);
		this.shortenToLength(Math.max(n, 0));
	}
	popUntilNumberedHeaderPopped() {
		this.popUntilPopped(Fi, z.HTML);
	}
	popUntilTableCellPopped() {
		this.popUntilPopped(ra, z.HTML);
	}
	popAllUpToHtmlElement() {
		this.tmplCount = 0, this.shortenToLength(1);
	}
	_indexOfTagNames(e, t) {
		for (let n = this.stackTop; n >= 0; n--) if (e.has(this.tagIDs[n]) && this.treeAdapter.getNamespaceURI(this.items[n]) === t) return n;
		return -1;
	}
	clearBackTo(e, t) {
		let n = this._indexOfTagNames(e, t);
		this.shortenToLength(n + 1);
	}
	clearBackToTableContext() {
		this.clearBackTo(na, z.HTML);
	}
	clearBackToTableBodyContext() {
		this.clearBackTo(ta, z.HTML);
	}
	clearBackToTableRowContext() {
		this.clearBackTo(ea, z.HTML);
	}
	remove(e) {
		let t = this._indexOf(e);
		t >= 0 && (t === this.stackTop ? this.pop() : (this.items.splice(t, 1), this.tagIDs.splice(t, 1), this.stackTop--, this._updateCurrentElement(), this.handler.onItemPop(e, !1)));
	}
	tryPeekProperlyNestedBodyElement() {
		return this.stackTop >= 1 && this.tagIDs[1] === V.BODY ? this.items[1] : null;
	}
	contains(e) {
		return this._indexOf(e) > -1;
	}
	getCommonAncestor(e) {
		let t = this._indexOf(e) - 1;
		return t >= 0 ? this.items[t] : null;
	}
	isRootHtmlElementCurrent() {
		return this.stackTop === 0 && this.tagIDs[0] === V.HTML;
	}
	hasInDynamicScope(e, t) {
		for (let n = this.stackTop; n >= 0; n--) {
			let r = this.tagIDs[n];
			switch (this.treeAdapter.getNamespaceURI(this.items[n])) {
				case z.HTML:
					if (r === e) return !0;
					if (t.has(r)) return !1;
					break;
				case z.SVG:
					if ($i.has(r)) return !1;
					break;
				case z.MATHML:
					if (Qi.has(r)) return !1;
					break;
			}
		}
		return !0;
	}
	hasInScope(e) {
		return this.hasInDynamicScope(e, Yi);
	}
	hasInListItemScope(e) {
		return this.hasInDynamicScope(e, Xi);
	}
	hasInButtonScope(e) {
		return this.hasInDynamicScope(e, Zi);
	}
	hasNumberedHeaderInScope() {
		for (let e = this.stackTop; e >= 0; e--) {
			let t = this.tagIDs[e];
			switch (this.treeAdapter.getNamespaceURI(this.items[e])) {
				case z.HTML:
					if (Fi.has(t)) return !0;
					if (Yi.has(t)) return !1;
					break;
				case z.SVG:
					if ($i.has(t)) return !1;
					break;
				case z.MATHML:
					if (Qi.has(t)) return !1;
					break;
			}
		}
		return !0;
	}
	hasInTableScope(e) {
		for (let t = this.stackTop; t >= 0; t--) if (this.treeAdapter.getNamespaceURI(this.items[t]) === z.HTML) switch (this.tagIDs[t]) {
			case e: return !0;
			case V.TABLE:
			case V.HTML: return !1;
		}
		return !0;
	}
	hasTableBodyContextInTableScope() {
		for (let e = this.stackTop; e >= 0; e--) if (this.treeAdapter.getNamespaceURI(this.items[e]) === z.HTML) switch (this.tagIDs[e]) {
			case V.TBODY:
			case V.THEAD:
			case V.TFOOT: return !0;
			case V.TABLE:
			case V.HTML: return !1;
		}
		return !0;
	}
	hasInSelectScope(e) {
		for (let t = this.stackTop; t >= 0; t--) if (this.treeAdapter.getNamespaceURI(this.items[t]) === z.HTML) switch (this.tagIDs[t]) {
			case e: return !0;
			case V.OPTION:
			case V.OPTGROUP: break;
			default: return !1;
		}
		return !0;
	}
	generateImpliedEndTags() {
		for (; this.currentTagId !== void 0 && qi.has(this.currentTagId);) this.pop();
	}
	generateImpliedEndTagsThoroughly() {
		for (; this.currentTagId !== void 0 && Ji.has(this.currentTagId);) this.pop();
	}
	generateImpliedEndTagsWithExclusion(e) {
		for (; this.currentTagId !== void 0 && this.currentTagId !== e && Ji.has(this.currentTagId);) this.pop();
	}
}, aa = 3, oa;
(function(e) {
	e[e.Marker = 0] = "Marker", e[e.Element = 1] = "Element";
})(oa ||= {});
var sa = { type: oa.Marker }, ca = class {
	constructor(e) {
		this.treeAdapter = e, this.entries = [], this.bookmark = null;
	}
	_getNoahArkConditionCandidates(e, t) {
		let n = [], r = t.length, i = this.treeAdapter.getTagName(e), a = this.treeAdapter.getNamespaceURI(e);
		for (let e = 0; e < this.entries.length; e++) {
			let t = this.entries[e];
			if (t.type === oa.Marker) break;
			let { element: o } = t;
			if (this.treeAdapter.getTagName(o) === i && this.treeAdapter.getNamespaceURI(o) === a) {
				let t = this.treeAdapter.getAttrList(o);
				t.length === r && n.push({
					idx: e,
					attrs: t
				});
			}
		}
		return n;
	}
	_ensureNoahArkCondition(e) {
		if (this.entries.length < aa) return;
		let t = this.treeAdapter.getAttrList(e), n = this._getNoahArkConditionCandidates(e, t);
		if (n.length < aa) return;
		let r = new Map(t.map((e) => [e.name, e.value])), i = 0;
		for (let e = 0; e < n.length; e++) {
			let t = n[e];
			t.attrs.every((e) => r.get(e.name) === e.value) && (i += 1, i >= aa && this.entries.splice(t.idx, 1));
		}
	}
	insertMarker() {
		this.entries.unshift(sa);
	}
	pushElement(e, t) {
		this._ensureNoahArkCondition(e), this.entries.unshift({
			type: oa.Element,
			element: e,
			token: t
		});
	}
	insertElementAfterBookmark(e, t) {
		let n = this.entries.indexOf(this.bookmark);
		this.entries.splice(n, 0, {
			type: oa.Element,
			element: e,
			token: t
		});
	}
	removeEntry(e) {
		let t = this.entries.indexOf(e);
		t !== -1 && this.entries.splice(t, 1);
	}
	clearToLastMarker() {
		let e = this.entries.indexOf(sa);
		e === -1 ? this.entries.length = 0 : this.entries.splice(0, e + 1);
	}
	getElementEntryInScopeWithTagName(e) {
		let t = this.entries.find((t) => t.type === oa.Marker || this.treeAdapter.getTagName(t.element) === e);
		return t && t.type === oa.Element ? t : null;
	}
	getElementEntry(e) {
		return this.entries.find((t) => t.type === oa.Element && t.element === e);
	}
}, la = {
	createDocument() {
		return {
			nodeName: "#document",
			mode: ji.NO_QUIRKS,
			childNodes: []
		};
	},
	createDocumentFragment() {
		return {
			nodeName: "#document-fragment",
			childNodes: []
		};
	},
	createElement(e, t, n) {
		return {
			nodeName: e,
			tagName: e,
			attrs: n,
			namespaceURI: t,
			childNodes: [],
			parentNode: null
		};
	},
	createCommentNode(e) {
		return {
			nodeName: "#comment",
			data: e,
			parentNode: null
		};
	},
	createTextNode(e) {
		return {
			nodeName: "#text",
			value: e,
			parentNode: null
		};
	},
	appendChild(e, t) {
		e.childNodes.push(t), t.parentNode = e;
	},
	insertBefore(e, t, n) {
		let r = e.childNodes.indexOf(n);
		e.childNodes.splice(r, 0, t), t.parentNode = e;
	},
	setTemplateContent(e, t) {
		e.content = t;
	},
	getTemplateContent(e) {
		return e.content;
	},
	setDocumentType(e, t, n, r) {
		let i = e.childNodes.find((e) => e.nodeName === "#documentType");
		if (i) i.name = t, i.publicId = n, i.systemId = r;
		else {
			let i = {
				nodeName: "#documentType",
				name: t,
				publicId: n,
				systemId: r,
				parentNode: null
			};
			la.appendChild(e, i);
		}
	},
	setDocumentMode(e, t) {
		e.mode = t;
	},
	getDocumentMode(e) {
		return e.mode;
	},
	detachNode(e) {
		if (e.parentNode) {
			let t = e.parentNode.childNodes.indexOf(e);
			e.parentNode.childNodes.splice(t, 1), e.parentNode = null;
		}
	},
	insertText(e, t) {
		if (e.childNodes.length > 0) {
			let n = e.childNodes[e.childNodes.length - 1];
			if (la.isTextNode(n)) {
				n.value += t;
				return;
			}
		}
		la.appendChild(e, la.createTextNode(t));
	},
	insertTextBefore(e, t, n) {
		let r = e.childNodes[e.childNodes.indexOf(n) - 1];
		r && la.isTextNode(r) ? r.value += t : la.insertBefore(e, la.createTextNode(t), n);
	},
	adoptAttributes(e, t) {
		let n = new Set(e.attrs.map((e) => e.name));
		for (let r = 0; r < t.length; r++) n.has(t[r].name) || e.attrs.push(t[r]);
	},
	getFirstChild(e) {
		return e.childNodes[0];
	},
	getChildNodes(e) {
		return e.childNodes;
	},
	getParentNode(e) {
		return e.parentNode;
	},
	getAttrList(e) {
		return e.attrs;
	},
	getTagName(e) {
		return e.tagName;
	},
	getNamespaceURI(e) {
		return e.namespaceURI;
	},
	getTextNodeContent(e) {
		return e.value;
	},
	getCommentNodeContent(e) {
		return e.data;
	},
	getDocumentTypeNodeName(e) {
		return e.name;
	},
	getDocumentTypeNodePublicId(e) {
		return e.publicId;
	},
	getDocumentTypeNodeSystemId(e) {
		return e.systemId;
	},
	isTextNode(e) {
		return e.nodeName === "#text";
	},
	isCommentNode(e) {
		return e.nodeName === "#comment";
	},
	isDocumentTypeNode(e) {
		return e.nodeName === "#documentType";
	},
	isElementNode(e) {
		return Object.prototype.hasOwnProperty.call(e, "tagName");
	},
	setNodeSourceCodeLocation(e, t) {
		e.sourceCodeLocation = t;
	},
	getNodeSourceCodeLocation(e) {
		return e.sourceCodeLocation;
	},
	updateNodeSourceCodeLocation(e, t) {
		e.sourceCodeLocation = {
			...e.sourceCodeLocation,
			...t
		};
	}
}, ua = "html", da = "about:legacy-compat", fa = "http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd", pa = /* @__PURE__ */ "+//silmaril//dtd html pro v0r11 19970101//,-//as//dtd html 3.0 aswedit + extensions//,-//advasoft ltd//dtd html 3.0 aswedit + extensions//,-//ietf//dtd html 2.0 level 1//,-//ietf//dtd html 2.0 level 2//,-//ietf//dtd html 2.0 strict level 1//,-//ietf//dtd html 2.0 strict level 2//,-//ietf//dtd html 2.0 strict//,-//ietf//dtd html 2.0//,-//ietf//dtd html 2.1e//,-//ietf//dtd html 3.0//,-//ietf//dtd html 3.2 final//,-//ietf//dtd html 3.2//,-//ietf//dtd html 3//,-//ietf//dtd html level 0//,-//ietf//dtd html level 1//,-//ietf//dtd html level 2//,-//ietf//dtd html level 3//,-//ietf//dtd html strict level 0//,-//ietf//dtd html strict level 1//,-//ietf//dtd html strict level 2//,-//ietf//dtd html strict level 3//,-//ietf//dtd html strict//,-//ietf//dtd html//,-//metrius//dtd metrius presentational//,-//microsoft//dtd internet explorer 2.0 html strict//,-//microsoft//dtd internet explorer 2.0 html//,-//microsoft//dtd internet explorer 2.0 tables//,-//microsoft//dtd internet explorer 3.0 html strict//,-//microsoft//dtd internet explorer 3.0 html//,-//microsoft//dtd internet explorer 3.0 tables//,-//netscape comm. corp.//dtd html//,-//netscape comm. corp.//dtd strict html//,-//o'reilly and associates//dtd html 2.0//,-//o'reilly and associates//dtd html extended 1.0//,-//o'reilly and associates//dtd html extended relaxed 1.0//,-//sq//dtd html 2.0 hotmetal + extensions//,-//softquad software//dtd hotmetal pro 6.0::19990601::extensions to html 4.0//,-//softquad//dtd hotmetal pro 4.0::19971010::extensions to html 4.0//,-//spyglass//dtd html 2.0 extended//,-//sun microsystems corp.//dtd hotjava html//,-//sun microsystems corp.//dtd hotjava strict html//,-//w3c//dtd html 3 1995-03-24//,-//w3c//dtd html 3.2 draft//,-//w3c//dtd html 3.2 final//,-//w3c//dtd html 3.2//,-//w3c//dtd html 3.2s draft//,-//w3c//dtd html 4.0 frameset//,-//w3c//dtd html 4.0 transitional//,-//w3c//dtd html experimental 19960712//,-//w3c//dtd html experimental 970421//,-//w3c//dtd w3 html//,-//w3o//dtd w3 html 3.0//,-//webtechs//dtd mozilla html 2.0//,-//webtechs//dtd mozilla html//".split(","), ma = [
	...pa,
	"-//w3c//dtd html 4.01 frameset//",
	"-//w3c//dtd html 4.01 transitional//"
], ha = new Set([
	"-//w3o//dtd w3 html strict 3.0//en//",
	"-/w3c/dtd html 4.0 transitional/en",
	"html"
]), ga = ["-//w3c//dtd xhtml 1.0 frameset//", "-//w3c//dtd xhtml 1.0 transitional//"], _a = [
	...ga,
	"-//w3c//dtd html 4.01 frameset//",
	"-//w3c//dtd html 4.01 transitional//"
];
function va(e, t) {
	return t.some((t) => e.startsWith(t));
}
function ya(e) {
	return e.name === ua && e.publicId === null && (e.systemId === null || e.systemId === da);
}
function ba(e) {
	if (e.name !== ua) return ji.QUIRKS;
	let { systemId: t } = e;
	if (t && t.toLowerCase() === fa) return ji.QUIRKS;
	let { publicId: n } = e;
	if (n !== null) {
		if (n = n.toLowerCase(), ha.has(n)) return ji.QUIRKS;
		let e = t === null ? ma : pa;
		if (va(n, e)) return ji.QUIRKS;
		if (e = t === null ? ga : _a, va(n, e)) return ji.LIMITED_QUIRKS;
	}
	return ji.NO_QUIRKS;
}
//#endregion
//#region node_modules/.pnpm/parse5@7.3.0/node_modules/parse5/dist/common/foreign-content.js
var xa = {
	TEXT_HTML: "text/html",
	APPLICATION_XML: "application/xhtml+xml"
}, Sa = "definitionurl", Ca = "definitionURL", wa = new Map((/* @__PURE__ */ "attributeName.attributeType.baseFrequency.baseProfile.calcMode.clipPathUnits.diffuseConstant.edgeMode.filterUnits.glyphRef.gradientTransform.gradientUnits.kernelMatrix.kernelUnitLength.keyPoints.keySplines.keyTimes.lengthAdjust.limitingConeAngle.markerHeight.markerUnits.markerWidth.maskContentUnits.maskUnits.numOctaves.pathLength.patternContentUnits.patternTransform.patternUnits.pointsAtX.pointsAtY.pointsAtZ.preserveAlpha.preserveAspectRatio.primitiveUnits.refX.refY.repeatCount.repeatDur.requiredExtensions.requiredFeatures.specularConstant.specularExponent.spreadMethod.startOffset.stdDeviation.stitchTiles.surfaceScale.systemLanguage.tableValues.targetX.targetY.textLength.viewBox.viewTarget.xChannelSelector.yChannelSelector.zoomAndPan".split(".")).map((e) => [e.toLowerCase(), e])), Ta = new Map([
	["xlink:actuate", {
		prefix: "xlink",
		name: "actuate",
		namespace: z.XLINK
	}],
	["xlink:arcrole", {
		prefix: "xlink",
		name: "arcrole",
		namespace: z.XLINK
	}],
	["xlink:href", {
		prefix: "xlink",
		name: "href",
		namespace: z.XLINK
	}],
	["xlink:role", {
		prefix: "xlink",
		name: "role",
		namespace: z.XLINK
	}],
	["xlink:show", {
		prefix: "xlink",
		name: "show",
		namespace: z.XLINK
	}],
	["xlink:title", {
		prefix: "xlink",
		name: "title",
		namespace: z.XLINK
	}],
	["xlink:type", {
		prefix: "xlink",
		name: "type",
		namespace: z.XLINK
	}],
	["xml:lang", {
		prefix: "xml",
		name: "lang",
		namespace: z.XML
	}],
	["xml:space", {
		prefix: "xml",
		name: "space",
		namespace: z.XML
	}],
	["xmlns", {
		prefix: "",
		name: "xmlns",
		namespace: z.XMLNS
	}],
	["xmlns:xlink", {
		prefix: "xmlns",
		name: "xlink",
		namespace: z.XMLNS
	}]
]), Ea = new Map((/* @__PURE__ */ "altGlyph.altGlyphDef.altGlyphItem.animateColor.animateMotion.animateTransform.clipPath.feBlend.feColorMatrix.feComponentTransfer.feComposite.feConvolveMatrix.feDiffuseLighting.feDisplacementMap.feDistantLight.feFlood.feFuncA.feFuncB.feFuncG.feFuncR.feGaussianBlur.feImage.feMerge.feMergeNode.feMorphology.feOffset.fePointLight.feSpecularLighting.feSpotLight.feTile.feTurbulence.foreignObject.glyphRef.linearGradient.radialGradient.textPath".split(".")).map((e) => [e.toLowerCase(), e])), Da = new Set([
	V.B,
	V.BIG,
	V.BLOCKQUOTE,
	V.BODY,
	V.BR,
	V.CENTER,
	V.CODE,
	V.DD,
	V.DIV,
	V.DL,
	V.DT,
	V.EM,
	V.EMBED,
	V.H1,
	V.H2,
	V.H3,
	V.H4,
	V.H5,
	V.H6,
	V.HEAD,
	V.HR,
	V.I,
	V.IMG,
	V.LI,
	V.LISTING,
	V.MENU,
	V.META,
	V.NOBR,
	V.OL,
	V.P,
	V.PRE,
	V.RUBY,
	V.S,
	V.SMALL,
	V.SPAN,
	V.STRONG,
	V.STRIKE,
	V.SUB,
	V.SUP,
	V.TABLE,
	V.TT,
	V.U,
	V.UL,
	V.VAR
]);
function Oa(e) {
	let t = e.tagID;
	return t === V.FONT && e.attrs.some(({ name: e }) => e === Ai.COLOR || e === Ai.SIZE || e === Ai.FACE) || Da.has(t);
}
function ka(e) {
	for (let t = 0; t < e.attrs.length; t++) if (e.attrs[t].name === Sa) {
		e.attrs[t].name = Ca;
		break;
	}
}
function Aa(e) {
	for (let t = 0; t < e.attrs.length; t++) {
		let n = wa.get(e.attrs[t].name);
		n != null && (e.attrs[t].name = n);
	}
}
function ja(e) {
	for (let t = 0; t < e.attrs.length; t++) {
		let n = Ta.get(e.attrs[t].name);
		n && (e.attrs[t].prefix = n.prefix, e.attrs[t].name = n.name, e.attrs[t].namespace = n.namespace);
	}
}
function Ma(e) {
	let t = Ea.get(e.tagName);
	t != null && (e.tagName = t, e.tagID = Ni(e.tagName));
}
function Na(e, t) {
	return t === z.MATHML && (e === V.MI || e === V.MO || e === V.MN || e === V.MS || e === V.MTEXT);
}
function Pa(e, t, n) {
	if (t === z.MATHML && e === V.ANNOTATION_XML) {
		for (let e = 0; e < n.length; e++) if (n[e].name === Ai.ENCODING) {
			let t = n[e].value.toLowerCase();
			return t === xa.TEXT_HTML || t === xa.APPLICATION_XML;
		}
	}
	return t === z.SVG && (e === V.FOREIGN_OBJECT || e === V.DESC || e === V.TITLE);
}
function Fa(e, t, n, r) {
	return (!r || r === z.HTML) && Pa(e, t, n) || (!r || r === z.MATHML) && Na(e, t);
}
//#endregion
//#region node_modules/.pnpm/parse5@7.3.0/node_modules/parse5/dist/parser/index.js
var Ia = "hidden", La = 8, Ra = 3, W;
(function(e) {
	e[e.INITIAL = 0] = "INITIAL", e[e.BEFORE_HTML = 1] = "BEFORE_HTML", e[e.BEFORE_HEAD = 2] = "BEFORE_HEAD", e[e.IN_HEAD = 3] = "IN_HEAD", e[e.IN_HEAD_NO_SCRIPT = 4] = "IN_HEAD_NO_SCRIPT", e[e.AFTER_HEAD = 5] = "AFTER_HEAD", e[e.IN_BODY = 6] = "IN_BODY", e[e.TEXT = 7] = "TEXT", e[e.IN_TABLE = 8] = "IN_TABLE", e[e.IN_TABLE_TEXT = 9] = "IN_TABLE_TEXT", e[e.IN_CAPTION = 10] = "IN_CAPTION", e[e.IN_COLUMN_GROUP = 11] = "IN_COLUMN_GROUP", e[e.IN_TABLE_BODY = 12] = "IN_TABLE_BODY", e[e.IN_ROW = 13] = "IN_ROW", e[e.IN_CELL = 14] = "IN_CELL", e[e.IN_SELECT = 15] = "IN_SELECT", e[e.IN_SELECT_IN_TABLE = 16] = "IN_SELECT_IN_TABLE", e[e.IN_TEMPLATE = 17] = "IN_TEMPLATE", e[e.AFTER_BODY = 18] = "AFTER_BODY", e[e.IN_FRAMESET = 19] = "IN_FRAMESET", e[e.AFTER_FRAMESET = 20] = "AFTER_FRAMESET", e[e.AFTER_AFTER_BODY = 21] = "AFTER_AFTER_BODY", e[e.AFTER_AFTER_FRAMESET = 22] = "AFTER_AFTER_FRAMESET";
})(W ||= {});
var za = {
	startLine: -1,
	startCol: -1,
	startOffset: -1,
	endLine: -1,
	endCol: -1,
	endOffset: -1
}, Ba = new Set([
	V.TABLE,
	V.TBODY,
	V.TFOOT,
	V.THEAD,
	V.TR
]), Va = {
	scriptingEnabled: !0,
	sourceCodeLocationInfo: !1,
	treeAdapter: la,
	onParseError: null
}, Ha = class {
	constructor(e, t, n = null, r = null) {
		this.fragmentContext = n, this.scriptHandler = r, this.currentToken = null, this.stopped = !1, this.insertionMode = W.INITIAL, this.originalInsertionMode = W.INITIAL, this.headElement = null, this.formElement = null, this.currentNotInHTML = !1, this.tmplInsertionModeStack = [], this.pendingCharacterTokens = [], this.hasNonWhitespacePendingCharacterToken = !1, this.framesetOk = !0, this.skipNextNewLine = !1, this.fosterParentingEnabled = !1, this.options = {
			...Va,
			...e
		}, this.treeAdapter = this.options.treeAdapter, this.onParseError = this.options.onParseError, this.onParseError && (this.options.sourceCodeLocationInfo = !0), this.document = t ?? this.treeAdapter.createDocument(), this.tokenizer = new Ki(this.options, this), this.activeFormattingElements = new ca(this.treeAdapter), this.fragmentContextID = n ? Ni(this.treeAdapter.getTagName(n)) : V.UNKNOWN, this._setContextModes(n ?? this.document, this.fragmentContextID), this.openElements = new ia(this.document, this.treeAdapter, this);
	}
	static parse(e, t) {
		let n = new this(t);
		return n.tokenizer.write(e, !0), n.document;
	}
	static getFragmentParser(e, t) {
		let n = {
			...Va,
			...t
		};
		e ??= n.treeAdapter.createElement(B.TEMPLATE, z.HTML, []);
		let r = n.treeAdapter.createElement("documentmock", z.HTML, []), i = new this(n, r, e);
		return i.fragmentContextID === V.TEMPLATE && i.tmplInsertionModeStack.unshift(W.IN_TEMPLATE), i._initTokenizerForFragmentParsing(), i._insertFakeRootElement(), i._resetInsertionMode(), i._findFormInFragmentContext(), i;
	}
	getFragment() {
		let e = this.treeAdapter.getFirstChild(this.document), t = this.treeAdapter.createDocumentFragment();
		return this._adoptNodes(e, t), t;
	}
	_err(e, t, n) {
		if (!this.onParseError) return;
		let r = e.location ?? za, i = {
			code: t,
			startLine: r.startLine,
			startCol: r.startCol,
			startOffset: r.startOffset,
			endLine: n ? r.startLine : r.endLine,
			endCol: n ? r.startCol : r.endCol,
			endOffset: n ? r.startOffset : r.endOffset
		};
		this.onParseError(i);
	}
	onItemPush(e, t, n) {
		var r, i;
		(i = (r = this.treeAdapter).onItemPush) == null || i.call(r, e), n && this.openElements.stackTop > 0 && this._setContextModes(e, t);
	}
	onItemPop(e, t) {
		var n, r;
		if (this.options.sourceCodeLocationInfo && this._setEndLocation(e, this.currentToken), (r = (n = this.treeAdapter).onItemPop) == null || r.call(n, e, this.openElements.current), t) {
			let e, t;
			this.openElements.stackTop === 0 && this.fragmentContext ? (e = this.fragmentContext, t = this.fragmentContextID) : {current: e, currentTagId: t} = this.openElements, this._setContextModes(e, t);
		}
	}
	_setContextModes(e, t) {
		let n = e === this.document || e && this.treeAdapter.getNamespaceURI(e) === z.HTML;
		this.currentNotInHTML = !n, this.tokenizer.inForeignNode = !n && e !== void 0 && t !== void 0 && !this._isIntegrationPoint(t, e);
	}
	_switchToTextParsing(e, t) {
		this._insertElement(e, z.HTML), this.tokenizer.state = t, this.originalInsertionMode = this.insertionMode, this.insertionMode = W.TEXT;
	}
	switchToPlaintextParsing() {
		this.insertionMode = W.TEXT, this.originalInsertionMode = W.IN_BODY, this.tokenizer.state = Ii.PLAINTEXT;
	}
	_getAdjustedCurrentElement() {
		return this.openElements.stackTop === 0 && this.fragmentContext ? this.fragmentContext : this.openElements.current;
	}
	_findFormInFragmentContext() {
		let e = this.fragmentContext;
		for (; e;) {
			if (this.treeAdapter.getTagName(e) === B.FORM) {
				this.formElement = e;
				break;
			}
			e = this.treeAdapter.getParentNode(e);
		}
	}
	_initTokenizerForFragmentParsing() {
		if (!(!this.fragmentContext || this.treeAdapter.getNamespaceURI(this.fragmentContext) !== z.HTML)) switch (this.fragmentContextID) {
			case V.TITLE:
			case V.TEXTAREA:
				this.tokenizer.state = Ii.RCDATA;
				break;
			case V.STYLE:
			case V.XMP:
			case V.IFRAME:
			case V.NOEMBED:
			case V.NOFRAMES:
			case V.NOSCRIPT:
				this.tokenizer.state = Ii.RAWTEXT;
				break;
			case V.SCRIPT:
				this.tokenizer.state = Ii.SCRIPT_DATA;
				break;
			case V.PLAINTEXT:
				this.tokenizer.state = Ii.PLAINTEXT;
				break;
			default:
		}
	}
	_setDocumentType(e) {
		let t = e.name || "", n = e.publicId || "", r = e.systemId || "";
		if (this.treeAdapter.setDocumentType(this.document, t, n, r), e.location) {
			let t = this.treeAdapter.getChildNodes(this.document).find((e) => this.treeAdapter.isDocumentTypeNode(e));
			t && this.treeAdapter.setNodeSourceCodeLocation(t, e.location);
		}
	}
	_attachElementToTree(e, t) {
		if (this.options.sourceCodeLocationInfo) {
			let n = t && {
				...t,
				startTag: t
			};
			this.treeAdapter.setNodeSourceCodeLocation(e, n);
		}
		if (this._shouldFosterParentOnInsertion()) this._fosterParentElement(e);
		else {
			let t = this.openElements.currentTmplContentOrNode;
			this.treeAdapter.appendChild(t ?? this.document, e);
		}
	}
	_appendElement(e, t) {
		let n = this.treeAdapter.createElement(e.tagName, t, e.attrs);
		this._attachElementToTree(n, e.location);
	}
	_insertElement(e, t) {
		let n = this.treeAdapter.createElement(e.tagName, t, e.attrs);
		this._attachElementToTree(n, e.location), this.openElements.push(n, e.tagID);
	}
	_insertFakeElement(e, t) {
		let n = this.treeAdapter.createElement(e, z.HTML, []);
		this._attachElementToTree(n, null), this.openElements.push(n, t);
	}
	_insertTemplate(e) {
		let t = this.treeAdapter.createElement(e.tagName, z.HTML, e.attrs), n = this.treeAdapter.createDocumentFragment();
		this.treeAdapter.setTemplateContent(t, n), this._attachElementToTree(t, e.location), this.openElements.push(t, e.tagID), this.options.sourceCodeLocationInfo && this.treeAdapter.setNodeSourceCodeLocation(n, null);
	}
	_insertFakeRootElement() {
		let e = this.treeAdapter.createElement(B.HTML, z.HTML, []);
		this.options.sourceCodeLocationInfo && this.treeAdapter.setNodeSourceCodeLocation(e, null), this.treeAdapter.appendChild(this.openElements.current, e), this.openElements.push(e, V.HTML);
	}
	_appendCommentNode(e, t) {
		let n = this.treeAdapter.createCommentNode(e.data);
		this.treeAdapter.appendChild(t, n), this.options.sourceCodeLocationInfo && this.treeAdapter.setNodeSourceCodeLocation(n, e.location);
	}
	_insertCharacters(e) {
		let t, n;
		if (this._shouldFosterParentOnInsertion() ? ({parent: t, beforeElement: n} = this._findFosterParentingLocation(), n ? this.treeAdapter.insertTextBefore(t, e.chars, n) : this.treeAdapter.insertText(t, e.chars)) : (t = this.openElements.currentTmplContentOrNode, this.treeAdapter.insertText(t, e.chars)), !e.location) return;
		let r = this.treeAdapter.getChildNodes(t), i = r[(n ? r.lastIndexOf(n) : r.length) - 1];
		if (this.treeAdapter.getNodeSourceCodeLocation(i)) {
			let { endLine: t, endCol: n, endOffset: r } = e.location;
			this.treeAdapter.updateNodeSourceCodeLocation(i, {
				endLine: t,
				endCol: n,
				endOffset: r
			});
		} else this.options.sourceCodeLocationInfo && this.treeAdapter.setNodeSourceCodeLocation(i, e.location);
	}
	_adoptNodes(e, t) {
		for (let n = this.treeAdapter.getFirstChild(e); n; n = this.treeAdapter.getFirstChild(e)) this.treeAdapter.detachNode(n), this.treeAdapter.appendChild(t, n);
	}
	_setEndLocation(e, t) {
		if (this.treeAdapter.getNodeSourceCodeLocation(e) && t.location) {
			let n = t.location, r = this.treeAdapter.getTagName(e), i = t.type === R.END_TAG && r === t.tagName ? {
				endTag: { ...n },
				endLine: n.endLine,
				endCol: n.endCol,
				endOffset: n.endOffset
			} : {
				endLine: n.startLine,
				endCol: n.startCol,
				endOffset: n.startOffset
			};
			this.treeAdapter.updateNodeSourceCodeLocation(e, i);
		}
	}
	shouldProcessStartTagTokenInForeignContent(e) {
		if (!this.currentNotInHTML) return !1;
		let t, n;
		return this.openElements.stackTop === 0 && this.fragmentContext ? (t = this.fragmentContext, n = this.fragmentContextID) : {current: t, currentTagId: n} = this.openElements, e.tagID === V.SVG && this.treeAdapter.getTagName(t) === B.ANNOTATION_XML && this.treeAdapter.getNamespaceURI(t) === z.MATHML ? !1 : this.tokenizer.inForeignNode || (e.tagID === V.MGLYPH || e.tagID === V.MALIGNMARK) && n !== void 0 && !this._isIntegrationPoint(n, t, z.HTML);
	}
	_processToken(e) {
		switch (e.type) {
			case R.CHARACTER:
				this.onCharacter(e);
				break;
			case R.NULL_CHARACTER:
				this.onNullCharacter(e);
				break;
			case R.COMMENT:
				this.onComment(e);
				break;
			case R.DOCTYPE:
				this.onDoctype(e);
				break;
			case R.START_TAG:
				this._processStartTag(e);
				break;
			case R.END_TAG:
				this.onEndTag(e);
				break;
			case R.EOF:
				this.onEof(e);
				break;
			case R.WHITESPACE_CHARACTER:
				this.onWhitespaceCharacter(e);
				break;
		}
	}
	_isIntegrationPoint(e, t, n) {
		return Fa(e, this.treeAdapter.getNamespaceURI(t), this.treeAdapter.getAttrList(t), n);
	}
	_reconstructActiveFormattingElements() {
		let e = this.activeFormattingElements.entries.length;
		if (e) {
			let t = this.activeFormattingElements.entries.findIndex((e) => e.type === oa.Marker || this.openElements.contains(e.element)), n = t === -1 ? e - 1 : t - 1;
			for (let e = n; e >= 0; e--) {
				let t = this.activeFormattingElements.entries[e];
				this._insertElement(t.token, this.treeAdapter.getNamespaceURI(t.element)), t.element = this.openElements.current;
			}
		}
	}
	_closeTableCell() {
		this.openElements.generateImpliedEndTags(), this.openElements.popUntilTableCellPopped(), this.activeFormattingElements.clearToLastMarker(), this.insertionMode = W.IN_ROW;
	}
	_closePElement() {
		this.openElements.generateImpliedEndTagsWithExclusion(V.P), this.openElements.popUntilTagNamePopped(V.P);
	}
	_resetInsertionMode() {
		for (let e = this.openElements.stackTop; e >= 0; e--) switch (e === 0 && this.fragmentContext ? this.fragmentContextID : this.openElements.tagIDs[e]) {
			case V.TR:
				this.insertionMode = W.IN_ROW;
				return;
			case V.TBODY:
			case V.THEAD:
			case V.TFOOT:
				this.insertionMode = W.IN_TABLE_BODY;
				return;
			case V.CAPTION:
				this.insertionMode = W.IN_CAPTION;
				return;
			case V.COLGROUP:
				this.insertionMode = W.IN_COLUMN_GROUP;
				return;
			case V.TABLE:
				this.insertionMode = W.IN_TABLE;
				return;
			case V.BODY:
				this.insertionMode = W.IN_BODY;
				return;
			case V.FRAMESET:
				this.insertionMode = W.IN_FRAMESET;
				return;
			case V.SELECT:
				this._resetInsertionModeForSelect(e);
				return;
			case V.TEMPLATE:
				this.insertionMode = this.tmplInsertionModeStack[0];
				return;
			case V.HTML:
				this.insertionMode = this.headElement ? W.AFTER_HEAD : W.BEFORE_HEAD;
				return;
			case V.TD:
			case V.TH:
				if (e > 0) {
					this.insertionMode = W.IN_CELL;
					return;
				}
				break;
			case V.HEAD:
				if (e > 0) {
					this.insertionMode = W.IN_HEAD;
					return;
				}
				break;
		}
		this.insertionMode = W.IN_BODY;
	}
	_resetInsertionModeForSelect(e) {
		if (e > 0) for (let t = e - 1; t > 0; t--) {
			let e = this.openElements.tagIDs[t];
			if (e === V.TEMPLATE) break;
			if (e === V.TABLE) {
				this.insertionMode = W.IN_SELECT_IN_TABLE;
				return;
			}
		}
		this.insertionMode = W.IN_SELECT;
	}
	_isElementCausesFosterParenting(e) {
		return Ba.has(e);
	}
	_shouldFosterParentOnInsertion() {
		return this.fosterParentingEnabled && this.openElements.currentTagId !== void 0 && this._isElementCausesFosterParenting(this.openElements.currentTagId);
	}
	_findFosterParentingLocation() {
		for (let e = this.openElements.stackTop; e >= 0; e--) {
			let t = this.openElements.items[e];
			switch (this.openElements.tagIDs[e]) {
				case V.TEMPLATE:
					if (this.treeAdapter.getNamespaceURI(t) === z.HTML) return {
						parent: this.treeAdapter.getTemplateContent(t),
						beforeElement: null
					};
					break;
				case V.TABLE: {
					let n = this.treeAdapter.getParentNode(t);
					return n ? {
						parent: n,
						beforeElement: t
					} : {
						parent: this.openElements.items[e - 1],
						beforeElement: null
					};
				}
				default:
			}
		}
		return {
			parent: this.openElements.items[0],
			beforeElement: null
		};
	}
	_fosterParentElement(e) {
		let t = this._findFosterParentingLocation();
		t.beforeElement ? this.treeAdapter.insertBefore(t.parent, e, t.beforeElement) : this.treeAdapter.appendChild(t.parent, e);
	}
	_isSpecialElement(e, t) {
		return Pi[this.treeAdapter.getNamespaceURI(e)].has(t);
	}
	onCharacter(e) {
		if (this.skipNextNewLine = !1, this.tokenizer.inForeignNode) {
			sc(this, e);
			return;
		}
		switch (this.insertionMode) {
			case W.INITIAL:
				to(this, e);
				break;
			case W.BEFORE_HTML:
				io(this, e);
				break;
			case W.BEFORE_HEAD:
				so(this, e);
				break;
			case W.IN_HEAD:
				fo(this, e);
				break;
			case W.IN_HEAD_NO_SCRIPT:
				ho(this, e);
				break;
			case W.AFTER_HEAD:
				vo(this, e);
				break;
			case W.IN_BODY:
			case W.IN_CAPTION:
			case W.IN_CELL:
			case W.IN_TEMPLATE:
				xo(this, e);
				break;
			case W.TEXT:
			case W.IN_SELECT:
			case W.IN_SELECT_IN_TABLE:
				this._insertCharacters(e);
				break;
			case W.IN_TABLE:
			case W.IN_TABLE_BODY:
			case W.IN_ROW:
				gs(this, e);
				break;
			case W.IN_TABLE_TEXT:
				ks(this, e);
				break;
			case W.IN_COLUMN_GROUP:
				Is(this, e);
				break;
			case W.AFTER_BODY:
				Qs(this, e);
				break;
			case W.AFTER_AFTER_BODY:
				ic(this, e);
				break;
			default:
		}
	}
	onNullCharacter(e) {
		if (this.skipNextNewLine = !1, this.tokenizer.inForeignNode) {
			oc(this, e);
			return;
		}
		switch (this.insertionMode) {
			case W.INITIAL:
				to(this, e);
				break;
			case W.BEFORE_HTML:
				io(this, e);
				break;
			case W.BEFORE_HEAD:
				so(this, e);
				break;
			case W.IN_HEAD:
				fo(this, e);
				break;
			case W.IN_HEAD_NO_SCRIPT:
				ho(this, e);
				break;
			case W.AFTER_HEAD:
				vo(this, e);
				break;
			case W.TEXT:
				this._insertCharacters(e);
				break;
			case W.IN_TABLE:
			case W.IN_TABLE_BODY:
			case W.IN_ROW:
				gs(this, e);
				break;
			case W.IN_COLUMN_GROUP:
				Is(this, e);
				break;
			case W.AFTER_BODY:
				Qs(this, e);
				break;
			case W.AFTER_AFTER_BODY:
				ic(this, e);
				break;
			default:
		}
	}
	onComment(e) {
		if (this.skipNextNewLine = !1, this.currentNotInHTML) {
			Xa(this, e);
			return;
		}
		switch (this.insertionMode) {
			case W.INITIAL:
			case W.BEFORE_HTML:
			case W.BEFORE_HEAD:
			case W.IN_HEAD:
			case W.IN_HEAD_NO_SCRIPT:
			case W.AFTER_HEAD:
			case W.IN_BODY:
			case W.IN_TABLE:
			case W.IN_CAPTION:
			case W.IN_COLUMN_GROUP:
			case W.IN_TABLE_BODY:
			case W.IN_ROW:
			case W.IN_CELL:
			case W.IN_SELECT:
			case W.IN_SELECT_IN_TABLE:
			case W.IN_TEMPLATE:
			case W.IN_FRAMESET:
			case W.AFTER_FRAMESET:
				Xa(this, e);
				break;
			case W.IN_TABLE_TEXT:
				As(this, e);
				break;
			case W.AFTER_BODY:
				Za(this, e);
				break;
			case W.AFTER_AFTER_BODY:
			case W.AFTER_AFTER_FRAMESET:
				Qa(this, e);
				break;
			default:
		}
	}
	onDoctype(e) {
		switch (this.skipNextNewLine = !1, this.insertionMode) {
			case W.INITIAL:
				eo(this, e);
				break;
			case W.BEFORE_HEAD:
			case W.IN_HEAD:
			case W.IN_HEAD_NO_SCRIPT:
			case W.AFTER_HEAD:
				this._err(e, L.misplacedDoctype);
				break;
			case W.IN_TABLE_TEXT:
				As(this, e);
				break;
			default:
		}
	}
	onStartTag(e) {
		this.skipNextNewLine = !1, this.currentToken = e, this._processStartTag(e), e.selfClosing && !e.ackSelfClosing && this._err(e, L.nonVoidHtmlElementStartTagWithTrailingSolidus);
	}
	_processStartTag(e) {
		this.shouldProcessStartTagTokenInForeignContent(e) ? lc(this, e) : this._startTagOutsideForeignContent(e);
	}
	_startTagOutsideForeignContent(e) {
		switch (this.insertionMode) {
			case W.INITIAL:
				to(this, e);
				break;
			case W.BEFORE_HTML:
				no(this, e);
				break;
			case W.BEFORE_HEAD:
				ao(this, e);
				break;
			case W.IN_HEAD:
				co(this, e);
				break;
			case W.IN_HEAD_NO_SCRIPT:
				po(this, e);
				break;
			case W.AFTER_HEAD:
				go(this, e);
				break;
			case W.IN_BODY:
				es(this, e);
				break;
			case W.IN_TABLE:
				Ts(this, e);
				break;
			case W.IN_TABLE_TEXT:
				As(this, e);
				break;
			case W.IN_CAPTION:
				Ms(this, e);
				break;
			case W.IN_COLUMN_GROUP:
				Ps(this, e);
				break;
			case W.IN_TABLE_BODY:
				Ls(this, e);
				break;
			case W.IN_ROW:
				zs(this, e);
				break;
			case W.IN_CELL:
				Vs(this, e);
				break;
			case W.IN_SELECT:
				Us(this, e);
				break;
			case W.IN_SELECT_IN_TABLE:
				Gs(this, e);
				break;
			case W.IN_TEMPLATE:
				qs(this, e);
				break;
			case W.AFTER_BODY:
				Xs(this, e);
				break;
			case W.IN_FRAMESET:
				$s(this, e);
				break;
			case W.AFTER_FRAMESET:
				tc(this, e);
				break;
			case W.AFTER_AFTER_BODY:
				rc(this, e);
				break;
			case W.AFTER_AFTER_FRAMESET:
				ac(this, e);
				break;
			default:
		}
	}
	onEndTag(e) {
		this.skipNextNewLine = !1, this.currentToken = e, this.currentNotInHTML ? uc(this, e) : this._endTagOutsideForeignContent(e);
	}
	_endTagOutsideForeignContent(e) {
		switch (this.insertionMode) {
			case W.INITIAL:
				to(this, e);
				break;
			case W.BEFORE_HTML:
				ro(this, e);
				break;
			case W.BEFORE_HEAD:
				oo(this, e);
				break;
			case W.IN_HEAD:
				lo(this, e);
				break;
			case W.IN_HEAD_NO_SCRIPT:
				mo(this, e);
				break;
			case W.AFTER_HEAD:
				_o(this, e);
				break;
			case W.IN_BODY:
				fs(this, e);
				break;
			case W.TEXT:
				ms(this, e);
				break;
			case W.IN_TABLE:
				Es(this, e);
				break;
			case W.IN_TABLE_TEXT:
				As(this, e);
				break;
			case W.IN_CAPTION:
				Ns(this, e);
				break;
			case W.IN_COLUMN_GROUP:
				Fs(this, e);
				break;
			case W.IN_TABLE_BODY:
				Rs(this, e);
				break;
			case W.IN_ROW:
				Bs(this, e);
				break;
			case W.IN_CELL:
				Hs(this, e);
				break;
			case W.IN_SELECT:
				Ws(this, e);
				break;
			case W.IN_SELECT_IN_TABLE:
				Ks(this, e);
				break;
			case W.IN_TEMPLATE:
				Js(this, e);
				break;
			case W.AFTER_BODY:
				Zs(this, e);
				break;
			case W.IN_FRAMESET:
				ec(this, e);
				break;
			case W.AFTER_FRAMESET:
				nc(this, e);
				break;
			case W.AFTER_AFTER_BODY:
				ic(this, e);
				break;
			default:
		}
	}
	onEof(e) {
		switch (this.insertionMode) {
			case W.INITIAL:
				to(this, e);
				break;
			case W.BEFORE_HTML:
				io(this, e);
				break;
			case W.BEFORE_HEAD:
				so(this, e);
				break;
			case W.IN_HEAD:
				fo(this, e);
				break;
			case W.IN_HEAD_NO_SCRIPT:
				ho(this, e);
				break;
			case W.AFTER_HEAD:
				vo(this, e);
				break;
			case W.IN_BODY:
			case W.IN_TABLE:
			case W.IN_CAPTION:
			case W.IN_COLUMN_GROUP:
			case W.IN_TABLE_BODY:
			case W.IN_ROW:
			case W.IN_CELL:
			case W.IN_SELECT:
			case W.IN_SELECT_IN_TABLE:
				ps(this, e);
				break;
			case W.TEXT:
				hs(this, e);
				break;
			case W.IN_TABLE_TEXT:
				As(this, e);
				break;
			case W.IN_TEMPLATE:
				Ys(this, e);
				break;
			case W.AFTER_BODY:
			case W.IN_FRAMESET:
			case W.AFTER_FRAMESET:
			case W.AFTER_AFTER_BODY:
			case W.AFTER_AFTER_FRAMESET:
				$a(this, e);
				break;
			default:
		}
	}
	onWhitespaceCharacter(e) {
		if (this.skipNextNewLine && (this.skipNextNewLine = !1, e.chars.charCodeAt(0) === I.LINE_FEED)) {
			if (e.chars.length === 1) return;
			e.chars = e.chars.substr(1);
		}
		if (this.tokenizer.inForeignNode) {
			this._insertCharacters(e);
			return;
		}
		switch (this.insertionMode) {
			case W.IN_HEAD:
			case W.IN_HEAD_NO_SCRIPT:
			case W.AFTER_HEAD:
			case W.TEXT:
			case W.IN_COLUMN_GROUP:
			case W.IN_SELECT:
			case W.IN_SELECT_IN_TABLE:
			case W.IN_FRAMESET:
			case W.AFTER_FRAMESET:
				this._insertCharacters(e);
				break;
			case W.IN_BODY:
			case W.IN_CAPTION:
			case W.IN_CELL:
			case W.IN_TEMPLATE:
			case W.AFTER_BODY:
			case W.AFTER_AFTER_BODY:
			case W.AFTER_AFTER_FRAMESET:
				bo(this, e);
				break;
			case W.IN_TABLE:
			case W.IN_TABLE_BODY:
			case W.IN_ROW:
				gs(this, e);
				break;
			case W.IN_TABLE_TEXT:
				Os(this, e);
				break;
			default:
		}
	}
};
function Ua(e, t) {
	let n = e.activeFormattingElements.getElementEntryInScopeWithTagName(t.tagName);
	return n ? e.openElements.contains(n.element) ? e.openElements.hasInScope(t.tagID) || (n = null) : (e.activeFormattingElements.removeEntry(n), n = null) : ds(e, t), n;
}
function Wa(e, t) {
	let n = null, r = e.openElements.stackTop;
	for (; r >= 0; r--) {
		let i = e.openElements.items[r];
		if (i === t.element) break;
		e._isSpecialElement(i, e.openElements.tagIDs[r]) && (n = i);
	}
	return n || (e.openElements.shortenToLength(Math.max(r, 0)), e.activeFormattingElements.removeEntry(t)), n;
}
function Ga(e, t, n) {
	let r = t, i = e.openElements.getCommonAncestor(t);
	for (let a = 0, o = i; o !== n; a++, o = i) {
		i = e.openElements.getCommonAncestor(o);
		let n = e.activeFormattingElements.getElementEntry(o), s = n && a >= Ra;
		!n || s ? (s && e.activeFormattingElements.removeEntry(n), e.openElements.remove(o)) : (o = Ka(e, n), r === t && (e.activeFormattingElements.bookmark = n), e.treeAdapter.detachNode(r), e.treeAdapter.appendChild(o, r), r = o);
	}
	return r;
}
function Ka(e, t) {
	let n = e.treeAdapter.getNamespaceURI(t.element), r = e.treeAdapter.createElement(t.token.tagName, n, t.token.attrs);
	return e.openElements.replace(t.element, r), t.element = r, r;
}
function qa(e, t, n) {
	let r = Ni(e.treeAdapter.getTagName(t));
	if (e._isElementCausesFosterParenting(r)) e._fosterParentElement(n);
	else {
		let i = e.treeAdapter.getNamespaceURI(t);
		r === V.TEMPLATE && i === z.HTML && (t = e.treeAdapter.getTemplateContent(t)), e.treeAdapter.appendChild(t, n);
	}
}
function Ja(e, t, n) {
	let r = e.treeAdapter.getNamespaceURI(n.element), { token: i } = n, a = e.treeAdapter.createElement(i.tagName, r, i.attrs);
	e._adoptNodes(t, a), e.treeAdapter.appendChild(t, a), e.activeFormattingElements.insertElementAfterBookmark(a, i), e.activeFormattingElements.removeEntry(n), e.openElements.remove(n.element), e.openElements.insertAfter(t, a, i.tagID);
}
function Ya(e, t) {
	for (let n = 0; n < La; n++) {
		let n = Ua(e, t);
		if (!n) break;
		let r = Wa(e, n);
		if (!r) break;
		e.activeFormattingElements.bookmark = n;
		let i = Ga(e, r, n.element), a = e.openElements.getCommonAncestor(n.element);
		e.treeAdapter.detachNode(i), a && qa(e, a, i), Ja(e, r, n);
	}
}
function Xa(e, t) {
	e._appendCommentNode(t, e.openElements.currentTmplContentOrNode);
}
function Za(e, t) {
	e._appendCommentNode(t, e.openElements.items[0]);
}
function Qa(e, t) {
	e._appendCommentNode(t, e.document);
}
function $a(e, t) {
	if (e.stopped = !0, t.location) {
		let n = e.fragmentContext ? 0 : 2;
		for (let r = e.openElements.stackTop; r >= n; r--) e._setEndLocation(e.openElements.items[r], t);
		if (!e.fragmentContext && e.openElements.stackTop >= 0) {
			let n = e.openElements.items[0], r = e.treeAdapter.getNodeSourceCodeLocation(n);
			if (r && !r.endTag && (e._setEndLocation(n, t), e.openElements.stackTop >= 1)) {
				let n = e.openElements.items[1], r = e.treeAdapter.getNodeSourceCodeLocation(n);
				r && !r.endTag && e._setEndLocation(n, t);
			}
		}
	}
}
function eo(e, t) {
	e._setDocumentType(t);
	let n = t.forceQuirks ? ji.QUIRKS : ba(t);
	ya(t) || e._err(t, L.nonConformingDoctype), e.treeAdapter.setDocumentMode(e.document, n), e.insertionMode = W.BEFORE_HTML;
}
function to(e, t) {
	e._err(t, L.missingDoctype, !0), e.treeAdapter.setDocumentMode(e.document, ji.QUIRKS), e.insertionMode = W.BEFORE_HTML, e._processToken(t);
}
function no(e, t) {
	t.tagID === V.HTML ? (e._insertElement(t, z.HTML), e.insertionMode = W.BEFORE_HEAD) : io(e, t);
}
function ro(e, t) {
	let n = t.tagID;
	(n === V.HTML || n === V.HEAD || n === V.BODY || n === V.BR) && io(e, t);
}
function io(e, t) {
	e._insertFakeRootElement(), e.insertionMode = W.BEFORE_HEAD, e._processToken(t);
}
function ao(e, t) {
	switch (t.tagID) {
		case V.HTML:
			es(e, t);
			break;
		case V.HEAD:
			e._insertElement(t, z.HTML), e.headElement = e.openElements.current, e.insertionMode = W.IN_HEAD;
			break;
		default: so(e, t);
	}
}
function oo(e, t) {
	let n = t.tagID;
	n === V.HEAD || n === V.BODY || n === V.HTML || n === V.BR ? so(e, t) : e._err(t, L.endTagWithoutMatchingOpenElement);
}
function so(e, t) {
	e._insertFakeElement(B.HEAD, V.HEAD), e.headElement = e.openElements.current, e.insertionMode = W.IN_HEAD, e._processToken(t);
}
function co(e, t) {
	switch (t.tagID) {
		case V.HTML:
			es(e, t);
			break;
		case V.BASE:
		case V.BASEFONT:
		case V.BGSOUND:
		case V.LINK:
		case V.META:
			e._appendElement(t, z.HTML), t.ackSelfClosing = !0;
			break;
		case V.TITLE:
			e._switchToTextParsing(t, Ii.RCDATA);
			break;
		case V.NOSCRIPT:
			e.options.scriptingEnabled ? e._switchToTextParsing(t, Ii.RAWTEXT) : (e._insertElement(t, z.HTML), e.insertionMode = W.IN_HEAD_NO_SCRIPT);
			break;
		case V.NOFRAMES:
		case V.STYLE:
			e._switchToTextParsing(t, Ii.RAWTEXT);
			break;
		case V.SCRIPT:
			e._switchToTextParsing(t, Ii.SCRIPT_DATA);
			break;
		case V.TEMPLATE:
			e._insertTemplate(t), e.activeFormattingElements.insertMarker(), e.framesetOk = !1, e.insertionMode = W.IN_TEMPLATE, e.tmplInsertionModeStack.unshift(W.IN_TEMPLATE);
			break;
		case V.HEAD:
			e._err(t, L.misplacedStartTagForHeadElement);
			break;
		default: fo(e, t);
	}
}
function lo(e, t) {
	switch (t.tagID) {
		case V.HEAD:
			e.openElements.pop(), e.insertionMode = W.AFTER_HEAD;
			break;
		case V.BODY:
		case V.BR:
		case V.HTML:
			fo(e, t);
			break;
		case V.TEMPLATE:
			uo(e, t);
			break;
		default: e._err(t, L.endTagWithoutMatchingOpenElement);
	}
}
function uo(e, t) {
	e.openElements.tmplCount > 0 ? (e.openElements.generateImpliedEndTagsThoroughly(), e.openElements.currentTagId !== V.TEMPLATE && e._err(t, L.closingOfElementWithOpenChildElements), e.openElements.popUntilTagNamePopped(V.TEMPLATE), e.activeFormattingElements.clearToLastMarker(), e.tmplInsertionModeStack.shift(), e._resetInsertionMode()) : e._err(t, L.endTagWithoutMatchingOpenElement);
}
function fo(e, t) {
	e.openElements.pop(), e.insertionMode = W.AFTER_HEAD, e._processToken(t);
}
function po(e, t) {
	switch (t.tagID) {
		case V.HTML:
			es(e, t);
			break;
		case V.BASEFONT:
		case V.BGSOUND:
		case V.HEAD:
		case V.LINK:
		case V.META:
		case V.NOFRAMES:
		case V.STYLE:
			co(e, t);
			break;
		case V.NOSCRIPT:
			e._err(t, L.nestedNoscriptInHead);
			break;
		default: ho(e, t);
	}
}
function mo(e, t) {
	switch (t.tagID) {
		case V.NOSCRIPT:
			e.openElements.pop(), e.insertionMode = W.IN_HEAD;
			break;
		case V.BR:
			ho(e, t);
			break;
		default: e._err(t, L.endTagWithoutMatchingOpenElement);
	}
}
function ho(e, t) {
	let n = t.type === R.EOF ? L.openElementsLeftAfterEof : L.disallowedContentInNoscriptInHead;
	e._err(t, n), e.openElements.pop(), e.insertionMode = W.IN_HEAD, e._processToken(t);
}
function go(e, t) {
	switch (t.tagID) {
		case V.HTML:
			es(e, t);
			break;
		case V.BODY:
			e._insertElement(t, z.HTML), e.framesetOk = !1, e.insertionMode = W.IN_BODY;
			break;
		case V.FRAMESET:
			e._insertElement(t, z.HTML), e.insertionMode = W.IN_FRAMESET;
			break;
		case V.BASE:
		case V.BASEFONT:
		case V.BGSOUND:
		case V.LINK:
		case V.META:
		case V.NOFRAMES:
		case V.SCRIPT:
		case V.STYLE:
		case V.TEMPLATE:
		case V.TITLE:
			e._err(t, L.abandonedHeadElementChild), e.openElements.push(e.headElement, V.HEAD), co(e, t), e.openElements.remove(e.headElement);
			break;
		case V.HEAD:
			e._err(t, L.misplacedStartTagForHeadElement);
			break;
		default: vo(e, t);
	}
}
function _o(e, t) {
	switch (t.tagID) {
		case V.BODY:
		case V.HTML:
		case V.BR:
			vo(e, t);
			break;
		case V.TEMPLATE:
			uo(e, t);
			break;
		default: e._err(t, L.endTagWithoutMatchingOpenElement);
	}
}
function vo(e, t) {
	e._insertFakeElement(B.BODY, V.BODY), e.insertionMode = W.IN_BODY, yo(e, t);
}
function yo(e, t) {
	switch (t.type) {
		case R.CHARACTER:
			xo(e, t);
			break;
		case R.WHITESPACE_CHARACTER:
			bo(e, t);
			break;
		case R.COMMENT:
			Xa(e, t);
			break;
		case R.START_TAG:
			es(e, t);
			break;
		case R.END_TAG:
			fs(e, t);
			break;
		case R.EOF:
			ps(e, t);
			break;
		default:
	}
}
function bo(e, t) {
	e._reconstructActiveFormattingElements(), e._insertCharacters(t);
}
function xo(e, t) {
	e._reconstructActiveFormattingElements(), e._insertCharacters(t), e.framesetOk = !1;
}
function So(e, t) {
	e.openElements.tmplCount === 0 && e.treeAdapter.adoptAttributes(e.openElements.items[0], t.attrs);
}
function Co(e, t) {
	let n = e.openElements.tryPeekProperlyNestedBodyElement();
	n && e.openElements.tmplCount === 0 && (e.framesetOk = !1, e.treeAdapter.adoptAttributes(n, t.attrs));
}
function wo(e, t) {
	let n = e.openElements.tryPeekProperlyNestedBodyElement();
	e.framesetOk && n && (e.treeAdapter.detachNode(n), e.openElements.popAllUpToHtmlElement(), e._insertElement(t, z.HTML), e.insertionMode = W.IN_FRAMESET);
}
function To(e, t) {
	e.openElements.hasInButtonScope(V.P) && e._closePElement(), e._insertElement(t, z.HTML);
}
function Eo(e, t) {
	e.openElements.hasInButtonScope(V.P) && e._closePElement(), e.openElements.currentTagId !== void 0 && Fi.has(e.openElements.currentTagId) && e.openElements.pop(), e._insertElement(t, z.HTML);
}
function Do(e, t) {
	e.openElements.hasInButtonScope(V.P) && e._closePElement(), e._insertElement(t, z.HTML), e.skipNextNewLine = !0, e.framesetOk = !1;
}
function Oo(e, t) {
	let n = e.openElements.tmplCount > 0;
	(!e.formElement || n) && (e.openElements.hasInButtonScope(V.P) && e._closePElement(), e._insertElement(t, z.HTML), n || (e.formElement = e.openElements.current));
}
function ko(e, t) {
	e.framesetOk = !1;
	let n = t.tagID;
	for (let t = e.openElements.stackTop; t >= 0; t--) {
		let r = e.openElements.tagIDs[t];
		if (n === V.LI && r === V.LI || (n === V.DD || n === V.DT) && (r === V.DD || r === V.DT)) {
			e.openElements.generateImpliedEndTagsWithExclusion(r), e.openElements.popUntilTagNamePopped(r);
			break;
		}
		if (r !== V.ADDRESS && r !== V.DIV && r !== V.P && e._isSpecialElement(e.openElements.items[t], r)) break;
	}
	e.openElements.hasInButtonScope(V.P) && e._closePElement(), e._insertElement(t, z.HTML);
}
function Ao(e, t) {
	e.openElements.hasInButtonScope(V.P) && e._closePElement(), e._insertElement(t, z.HTML), e.tokenizer.state = Ii.PLAINTEXT;
}
function jo(e, t) {
	e.openElements.hasInScope(V.BUTTON) && (e.openElements.generateImpliedEndTags(), e.openElements.popUntilTagNamePopped(V.BUTTON)), e._reconstructActiveFormattingElements(), e._insertElement(t, z.HTML), e.framesetOk = !1;
}
function Mo(e, t) {
	let n = e.activeFormattingElements.getElementEntryInScopeWithTagName(B.A);
	n && (Ya(e, t), e.openElements.remove(n.element), e.activeFormattingElements.removeEntry(n)), e._reconstructActiveFormattingElements(), e._insertElement(t, z.HTML), e.activeFormattingElements.pushElement(e.openElements.current, t);
}
function No(e, t) {
	e._reconstructActiveFormattingElements(), e._insertElement(t, z.HTML), e.activeFormattingElements.pushElement(e.openElements.current, t);
}
function Po(e, t) {
	e._reconstructActiveFormattingElements(), e.openElements.hasInScope(V.NOBR) && (Ya(e, t), e._reconstructActiveFormattingElements()), e._insertElement(t, z.HTML), e.activeFormattingElements.pushElement(e.openElements.current, t);
}
function Fo(e, t) {
	e._reconstructActiveFormattingElements(), e._insertElement(t, z.HTML), e.activeFormattingElements.insertMarker(), e.framesetOk = !1;
}
function Io(e, t) {
	e.treeAdapter.getDocumentMode(e.document) !== ji.QUIRKS && e.openElements.hasInButtonScope(V.P) && e._closePElement(), e._insertElement(t, z.HTML), e.framesetOk = !1, e.insertionMode = W.IN_TABLE;
}
function Lo(e, t) {
	e._reconstructActiveFormattingElements(), e._appendElement(t, z.HTML), e.framesetOk = !1, t.ackSelfClosing = !0;
}
function Ro(e) {
	let t = hi(e, Ai.TYPE);
	return t != null && t.toLowerCase() === Ia;
}
function zo(e, t) {
	e._reconstructActiveFormattingElements(), e._appendElement(t, z.HTML), Ro(t) || (e.framesetOk = !1), t.ackSelfClosing = !0;
}
function Bo(e, t) {
	e._appendElement(t, z.HTML), t.ackSelfClosing = !0;
}
function Vo(e, t) {
	e.openElements.hasInButtonScope(V.P) && e._closePElement(), e._appendElement(t, z.HTML), e.framesetOk = !1, t.ackSelfClosing = !0;
}
function Ho(e, t) {
	t.tagName = B.IMG, t.tagID = V.IMG, Lo(e, t);
}
function Uo(e, t) {
	e._insertElement(t, z.HTML), e.skipNextNewLine = !0, e.tokenizer.state = Ii.RCDATA, e.originalInsertionMode = e.insertionMode, e.framesetOk = !1, e.insertionMode = W.TEXT;
}
function Wo(e, t) {
	e.openElements.hasInButtonScope(V.P) && e._closePElement(), e._reconstructActiveFormattingElements(), e.framesetOk = !1, e._switchToTextParsing(t, Ii.RAWTEXT);
}
function Go(e, t) {
	e.framesetOk = !1, e._switchToTextParsing(t, Ii.RAWTEXT);
}
function Ko(e, t) {
	e._switchToTextParsing(t, Ii.RAWTEXT);
}
function qo(e, t) {
	e._reconstructActiveFormattingElements(), e._insertElement(t, z.HTML), e.framesetOk = !1, e.insertionMode = e.insertionMode === W.IN_TABLE || e.insertionMode === W.IN_CAPTION || e.insertionMode === W.IN_TABLE_BODY || e.insertionMode === W.IN_ROW || e.insertionMode === W.IN_CELL ? W.IN_SELECT_IN_TABLE : W.IN_SELECT;
}
function Jo(e, t) {
	e.openElements.currentTagId === V.OPTION && e.openElements.pop(), e._reconstructActiveFormattingElements(), e._insertElement(t, z.HTML);
}
function Yo(e, t) {
	e.openElements.hasInScope(V.RUBY) && e.openElements.generateImpliedEndTags(), e._insertElement(t, z.HTML);
}
function Xo(e, t) {
	e.openElements.hasInScope(V.RUBY) && e.openElements.generateImpliedEndTagsWithExclusion(V.RTC), e._insertElement(t, z.HTML);
}
function Zo(e, t) {
	e._reconstructActiveFormattingElements(), ka(t), ja(t), t.selfClosing ? e._appendElement(t, z.MATHML) : e._insertElement(t, z.MATHML), t.ackSelfClosing = !0;
}
function Qo(e, t) {
	e._reconstructActiveFormattingElements(), Aa(t), ja(t), t.selfClosing ? e._appendElement(t, z.SVG) : e._insertElement(t, z.SVG), t.ackSelfClosing = !0;
}
function $o(e, t) {
	e._reconstructActiveFormattingElements(), e._insertElement(t, z.HTML);
}
function es(e, t) {
	switch (t.tagID) {
		case V.I:
		case V.S:
		case V.B:
		case V.U:
		case V.EM:
		case V.TT:
		case V.BIG:
		case V.CODE:
		case V.FONT:
		case V.SMALL:
		case V.STRIKE:
		case V.STRONG:
			No(e, t);
			break;
		case V.A:
			Mo(e, t);
			break;
		case V.H1:
		case V.H2:
		case V.H3:
		case V.H4:
		case V.H5:
		case V.H6:
			Eo(e, t);
			break;
		case V.P:
		case V.DL:
		case V.OL:
		case V.UL:
		case V.DIV:
		case V.DIR:
		case V.NAV:
		case V.MAIN:
		case V.MENU:
		case V.ASIDE:
		case V.CENTER:
		case V.FIGURE:
		case V.FOOTER:
		case V.HEADER:
		case V.HGROUP:
		case V.DIALOG:
		case V.DETAILS:
		case V.ADDRESS:
		case V.ARTICLE:
		case V.SEARCH:
		case V.SECTION:
		case V.SUMMARY:
		case V.FIELDSET:
		case V.BLOCKQUOTE:
		case V.FIGCAPTION:
			To(e, t);
			break;
		case V.LI:
		case V.DD:
		case V.DT:
			ko(e, t);
			break;
		case V.BR:
		case V.IMG:
		case V.WBR:
		case V.AREA:
		case V.EMBED:
		case V.KEYGEN:
			Lo(e, t);
			break;
		case V.HR:
			Vo(e, t);
			break;
		case V.RB:
		case V.RTC:
			Yo(e, t);
			break;
		case V.RT:
		case V.RP:
			Xo(e, t);
			break;
		case V.PRE:
		case V.LISTING:
			Do(e, t);
			break;
		case V.XMP:
			Wo(e, t);
			break;
		case V.SVG:
			Qo(e, t);
			break;
		case V.HTML:
			So(e, t);
			break;
		case V.BASE:
		case V.LINK:
		case V.META:
		case V.STYLE:
		case V.TITLE:
		case V.SCRIPT:
		case V.BGSOUND:
		case V.BASEFONT:
		case V.TEMPLATE:
			co(e, t);
			break;
		case V.BODY:
			Co(e, t);
			break;
		case V.FORM:
			Oo(e, t);
			break;
		case V.NOBR:
			Po(e, t);
			break;
		case V.MATH:
			Zo(e, t);
			break;
		case V.TABLE:
			Io(e, t);
			break;
		case V.INPUT:
			zo(e, t);
			break;
		case V.PARAM:
		case V.TRACK:
		case V.SOURCE:
			Bo(e, t);
			break;
		case V.IMAGE:
			Ho(e, t);
			break;
		case V.BUTTON:
			jo(e, t);
			break;
		case V.APPLET:
		case V.OBJECT:
		case V.MARQUEE:
			Fo(e, t);
			break;
		case V.IFRAME:
			Go(e, t);
			break;
		case V.SELECT:
			qo(e, t);
			break;
		case V.OPTION:
		case V.OPTGROUP:
			Jo(e, t);
			break;
		case V.NOEMBED:
		case V.NOFRAMES:
			Ko(e, t);
			break;
		case V.FRAMESET:
			wo(e, t);
			break;
		case V.TEXTAREA:
			Uo(e, t);
			break;
		case V.NOSCRIPT:
			e.options.scriptingEnabled ? Ko(e, t) : $o(e, t);
			break;
		case V.PLAINTEXT:
			Ao(e, t);
			break;
		case V.COL:
		case V.TH:
		case V.TD:
		case V.TR:
		case V.HEAD:
		case V.FRAME:
		case V.TBODY:
		case V.TFOOT:
		case V.THEAD:
		case V.CAPTION:
		case V.COLGROUP: break;
		default: $o(e, t);
	}
}
function ts(e, t) {
	if (e.openElements.hasInScope(V.BODY) && (e.insertionMode = W.AFTER_BODY, e.options.sourceCodeLocationInfo)) {
		let n = e.openElements.tryPeekProperlyNestedBodyElement();
		n && e._setEndLocation(n, t);
	}
}
function ns(e, t) {
	e.openElements.hasInScope(V.BODY) && (e.insertionMode = W.AFTER_BODY, Zs(e, t));
}
function rs(e, t) {
	let n = t.tagID;
	e.openElements.hasInScope(n) && (e.openElements.generateImpliedEndTags(), e.openElements.popUntilTagNamePopped(n));
}
function is(e) {
	let t = e.openElements.tmplCount > 0, { formElement: n } = e;
	t || (e.formElement = null), (n || t) && e.openElements.hasInScope(V.FORM) && (e.openElements.generateImpliedEndTags(), t ? e.openElements.popUntilTagNamePopped(V.FORM) : n && e.openElements.remove(n));
}
function as(e) {
	e.openElements.hasInButtonScope(V.P) || e._insertFakeElement(B.P, V.P), e._closePElement();
}
function os(e) {
	e.openElements.hasInListItemScope(V.LI) && (e.openElements.generateImpliedEndTagsWithExclusion(V.LI), e.openElements.popUntilTagNamePopped(V.LI));
}
function ss(e, t) {
	let n = t.tagID;
	e.openElements.hasInScope(n) && (e.openElements.generateImpliedEndTagsWithExclusion(n), e.openElements.popUntilTagNamePopped(n));
}
function cs(e) {
	e.openElements.hasNumberedHeaderInScope() && (e.openElements.generateImpliedEndTags(), e.openElements.popUntilNumberedHeaderPopped());
}
function ls(e, t) {
	let n = t.tagID;
	e.openElements.hasInScope(n) && (e.openElements.generateImpliedEndTags(), e.openElements.popUntilTagNamePopped(n), e.activeFormattingElements.clearToLastMarker());
}
function us(e) {
	e._reconstructActiveFormattingElements(), e._insertFakeElement(B.BR, V.BR), e.openElements.pop(), e.framesetOk = !1;
}
function ds(e, t) {
	let n = t.tagName, r = t.tagID;
	for (let t = e.openElements.stackTop; t > 0; t--) {
		let i = e.openElements.items[t], a = e.openElements.tagIDs[t];
		if (r === a && (r !== V.UNKNOWN || e.treeAdapter.getTagName(i) === n)) {
			e.openElements.generateImpliedEndTagsWithExclusion(r), e.openElements.stackTop >= t && e.openElements.shortenToLength(t);
			break;
		}
		if (e._isSpecialElement(i, a)) break;
	}
}
function fs(e, t) {
	switch (t.tagID) {
		case V.A:
		case V.B:
		case V.I:
		case V.S:
		case V.U:
		case V.EM:
		case V.TT:
		case V.BIG:
		case V.CODE:
		case V.FONT:
		case V.NOBR:
		case V.SMALL:
		case V.STRIKE:
		case V.STRONG:
			Ya(e, t);
			break;
		case V.P:
			as(e);
			break;
		case V.DL:
		case V.UL:
		case V.OL:
		case V.DIR:
		case V.DIV:
		case V.NAV:
		case V.PRE:
		case V.MAIN:
		case V.MENU:
		case V.ASIDE:
		case V.BUTTON:
		case V.CENTER:
		case V.FIGURE:
		case V.FOOTER:
		case V.HEADER:
		case V.HGROUP:
		case V.DIALOG:
		case V.ADDRESS:
		case V.ARTICLE:
		case V.DETAILS:
		case V.SEARCH:
		case V.SECTION:
		case V.SUMMARY:
		case V.LISTING:
		case V.FIELDSET:
		case V.BLOCKQUOTE:
		case V.FIGCAPTION:
			rs(e, t);
			break;
		case V.LI:
			os(e);
			break;
		case V.DD:
		case V.DT:
			ss(e, t);
			break;
		case V.H1:
		case V.H2:
		case V.H3:
		case V.H4:
		case V.H5:
		case V.H6:
			cs(e);
			break;
		case V.BR:
			us(e);
			break;
		case V.BODY:
			ts(e, t);
			break;
		case V.HTML:
			ns(e, t);
			break;
		case V.FORM:
			is(e);
			break;
		case V.APPLET:
		case V.OBJECT:
		case V.MARQUEE:
			ls(e, t);
			break;
		case V.TEMPLATE:
			uo(e, t);
			break;
		default: ds(e, t);
	}
}
function ps(e, t) {
	e.tmplInsertionModeStack.length > 0 ? Ys(e, t) : $a(e, t);
}
function ms(e, t) {
	var n;
	t.tagID === V.SCRIPT && ((n = e.scriptHandler) == null || n.call(e, e.openElements.current)), e.openElements.pop(), e.insertionMode = e.originalInsertionMode;
}
function hs(e, t) {
	e._err(t, L.eofInElementThatCanContainOnlyText), e.openElements.pop(), e.insertionMode = e.originalInsertionMode, e.onEof(t);
}
function gs(e, t) {
	if (e.openElements.currentTagId !== void 0 && Ba.has(e.openElements.currentTagId)) switch (e.pendingCharacterTokens.length = 0, e.hasNonWhitespacePendingCharacterToken = !1, e.originalInsertionMode = e.insertionMode, e.insertionMode = W.IN_TABLE_TEXT, t.type) {
		case R.CHARACTER:
			ks(e, t);
			break;
		case R.WHITESPACE_CHARACTER:
			Os(e, t);
			break;
	}
	else Ds(e, t);
}
function _s(e, t) {
	e.openElements.clearBackToTableContext(), e.activeFormattingElements.insertMarker(), e._insertElement(t, z.HTML), e.insertionMode = W.IN_CAPTION;
}
function vs(e, t) {
	e.openElements.clearBackToTableContext(), e._insertElement(t, z.HTML), e.insertionMode = W.IN_COLUMN_GROUP;
}
function ys(e, t) {
	e.openElements.clearBackToTableContext(), e._insertFakeElement(B.COLGROUP, V.COLGROUP), e.insertionMode = W.IN_COLUMN_GROUP, Ps(e, t);
}
function bs(e, t) {
	e.openElements.clearBackToTableContext(), e._insertElement(t, z.HTML), e.insertionMode = W.IN_TABLE_BODY;
}
function xs(e, t) {
	e.openElements.clearBackToTableContext(), e._insertFakeElement(B.TBODY, V.TBODY), e.insertionMode = W.IN_TABLE_BODY, Ls(e, t);
}
function Ss(e, t) {
	e.openElements.hasInTableScope(V.TABLE) && (e.openElements.popUntilTagNamePopped(V.TABLE), e._resetInsertionMode(), e._processStartTag(t));
}
function Cs(e, t) {
	Ro(t) ? e._appendElement(t, z.HTML) : Ds(e, t), t.ackSelfClosing = !0;
}
function ws(e, t) {
	!e.formElement && e.openElements.tmplCount === 0 && (e._insertElement(t, z.HTML), e.formElement = e.openElements.current, e.openElements.pop());
}
function Ts(e, t) {
	switch (t.tagID) {
		case V.TD:
		case V.TH:
		case V.TR:
			xs(e, t);
			break;
		case V.STYLE:
		case V.SCRIPT:
		case V.TEMPLATE:
			co(e, t);
			break;
		case V.COL:
			ys(e, t);
			break;
		case V.FORM:
			ws(e, t);
			break;
		case V.TABLE:
			Ss(e, t);
			break;
		case V.TBODY:
		case V.TFOOT:
		case V.THEAD:
			bs(e, t);
			break;
		case V.INPUT:
			Cs(e, t);
			break;
		case V.CAPTION:
			_s(e, t);
			break;
		case V.COLGROUP:
			vs(e, t);
			break;
		default: Ds(e, t);
	}
}
function Es(e, t) {
	switch (t.tagID) {
		case V.TABLE:
			e.openElements.hasInTableScope(V.TABLE) && (e.openElements.popUntilTagNamePopped(V.TABLE), e._resetInsertionMode());
			break;
		case V.TEMPLATE:
			uo(e, t);
			break;
		case V.BODY:
		case V.CAPTION:
		case V.COL:
		case V.COLGROUP:
		case V.HTML:
		case V.TBODY:
		case V.TD:
		case V.TFOOT:
		case V.TH:
		case V.THEAD:
		case V.TR: break;
		default: Ds(e, t);
	}
}
function Ds(e, t) {
	let n = e.fosterParentingEnabled;
	e.fosterParentingEnabled = !0, yo(e, t), e.fosterParentingEnabled = n;
}
function Os(e, t) {
	e.pendingCharacterTokens.push(t);
}
function ks(e, t) {
	e.pendingCharacterTokens.push(t), e.hasNonWhitespacePendingCharacterToken = !0;
}
function As(e, t) {
	let n = 0;
	if (e.hasNonWhitespacePendingCharacterToken) for (; n < e.pendingCharacterTokens.length; n++) Ds(e, e.pendingCharacterTokens[n]);
	else for (; n < e.pendingCharacterTokens.length; n++) e._insertCharacters(e.pendingCharacterTokens[n]);
	e.insertionMode = e.originalInsertionMode, e._processToken(t);
}
var js = new Set([
	V.CAPTION,
	V.COL,
	V.COLGROUP,
	V.TBODY,
	V.TD,
	V.TFOOT,
	V.TH,
	V.THEAD,
	V.TR
]);
function Ms(e, t) {
	let n = t.tagID;
	js.has(n) ? e.openElements.hasInTableScope(V.CAPTION) && (e.openElements.generateImpliedEndTags(), e.openElements.popUntilTagNamePopped(V.CAPTION), e.activeFormattingElements.clearToLastMarker(), e.insertionMode = W.IN_TABLE, Ts(e, t)) : es(e, t);
}
function Ns(e, t) {
	let n = t.tagID;
	switch (n) {
		case V.CAPTION:
		case V.TABLE:
			e.openElements.hasInTableScope(V.CAPTION) && (e.openElements.generateImpliedEndTags(), e.openElements.popUntilTagNamePopped(V.CAPTION), e.activeFormattingElements.clearToLastMarker(), e.insertionMode = W.IN_TABLE, n === V.TABLE && Es(e, t));
			break;
		case V.BODY:
		case V.COL:
		case V.COLGROUP:
		case V.HTML:
		case V.TBODY:
		case V.TD:
		case V.TFOOT:
		case V.TH:
		case V.THEAD:
		case V.TR: break;
		default: fs(e, t);
	}
}
function Ps(e, t) {
	switch (t.tagID) {
		case V.HTML:
			es(e, t);
			break;
		case V.COL:
			e._appendElement(t, z.HTML), t.ackSelfClosing = !0;
			break;
		case V.TEMPLATE:
			co(e, t);
			break;
		default: Is(e, t);
	}
}
function Fs(e, t) {
	switch (t.tagID) {
		case V.COLGROUP:
			e.openElements.currentTagId === V.COLGROUP && (e.openElements.pop(), e.insertionMode = W.IN_TABLE);
			break;
		case V.TEMPLATE:
			uo(e, t);
			break;
		case V.COL: break;
		default: Is(e, t);
	}
}
function Is(e, t) {
	e.openElements.currentTagId === V.COLGROUP && (e.openElements.pop(), e.insertionMode = W.IN_TABLE, e._processToken(t));
}
function Ls(e, t) {
	switch (t.tagID) {
		case V.TR:
			e.openElements.clearBackToTableBodyContext(), e._insertElement(t, z.HTML), e.insertionMode = W.IN_ROW;
			break;
		case V.TH:
		case V.TD:
			e.openElements.clearBackToTableBodyContext(), e._insertFakeElement(B.TR, V.TR), e.insertionMode = W.IN_ROW, zs(e, t);
			break;
		case V.CAPTION:
		case V.COL:
		case V.COLGROUP:
		case V.TBODY:
		case V.TFOOT:
		case V.THEAD:
			e.openElements.hasTableBodyContextInTableScope() && (e.openElements.clearBackToTableBodyContext(), e.openElements.pop(), e.insertionMode = W.IN_TABLE, Ts(e, t));
			break;
		default: Ts(e, t);
	}
}
function Rs(e, t) {
	let n = t.tagID;
	switch (t.tagID) {
		case V.TBODY:
		case V.TFOOT:
		case V.THEAD:
			e.openElements.hasInTableScope(n) && (e.openElements.clearBackToTableBodyContext(), e.openElements.pop(), e.insertionMode = W.IN_TABLE);
			break;
		case V.TABLE:
			e.openElements.hasTableBodyContextInTableScope() && (e.openElements.clearBackToTableBodyContext(), e.openElements.pop(), e.insertionMode = W.IN_TABLE, Es(e, t));
			break;
		case V.BODY:
		case V.CAPTION:
		case V.COL:
		case V.COLGROUP:
		case V.HTML:
		case V.TD:
		case V.TH:
		case V.TR: break;
		default: Es(e, t);
	}
}
function zs(e, t) {
	switch (t.tagID) {
		case V.TH:
		case V.TD:
			e.openElements.clearBackToTableRowContext(), e._insertElement(t, z.HTML), e.insertionMode = W.IN_CELL, e.activeFormattingElements.insertMarker();
			break;
		case V.CAPTION:
		case V.COL:
		case V.COLGROUP:
		case V.TBODY:
		case V.TFOOT:
		case V.THEAD:
		case V.TR:
			e.openElements.hasInTableScope(V.TR) && (e.openElements.clearBackToTableRowContext(), e.openElements.pop(), e.insertionMode = W.IN_TABLE_BODY, Ls(e, t));
			break;
		default: Ts(e, t);
	}
}
function Bs(e, t) {
	switch (t.tagID) {
		case V.TR:
			e.openElements.hasInTableScope(V.TR) && (e.openElements.clearBackToTableRowContext(), e.openElements.pop(), e.insertionMode = W.IN_TABLE_BODY);
			break;
		case V.TABLE:
			e.openElements.hasInTableScope(V.TR) && (e.openElements.clearBackToTableRowContext(), e.openElements.pop(), e.insertionMode = W.IN_TABLE_BODY, Rs(e, t));
			break;
		case V.TBODY:
		case V.TFOOT:
		case V.THEAD:
			(e.openElements.hasInTableScope(t.tagID) || e.openElements.hasInTableScope(V.TR)) && (e.openElements.clearBackToTableRowContext(), e.openElements.pop(), e.insertionMode = W.IN_TABLE_BODY, Rs(e, t));
			break;
		case V.BODY:
		case V.CAPTION:
		case V.COL:
		case V.COLGROUP:
		case V.HTML:
		case V.TD:
		case V.TH: break;
		default: Es(e, t);
	}
}
function Vs(e, t) {
	let n = t.tagID;
	js.has(n) ? (e.openElements.hasInTableScope(V.TD) || e.openElements.hasInTableScope(V.TH)) && (e._closeTableCell(), zs(e, t)) : es(e, t);
}
function Hs(e, t) {
	let n = t.tagID;
	switch (n) {
		case V.TD:
		case V.TH:
			e.openElements.hasInTableScope(n) && (e.openElements.generateImpliedEndTags(), e.openElements.popUntilTagNamePopped(n), e.activeFormattingElements.clearToLastMarker(), e.insertionMode = W.IN_ROW);
			break;
		case V.TABLE:
		case V.TBODY:
		case V.TFOOT:
		case V.THEAD:
		case V.TR:
			e.openElements.hasInTableScope(n) && (e._closeTableCell(), Bs(e, t));
			break;
		case V.BODY:
		case V.CAPTION:
		case V.COL:
		case V.COLGROUP:
		case V.HTML: break;
		default: fs(e, t);
	}
}
function Us(e, t) {
	switch (t.tagID) {
		case V.HTML:
			es(e, t);
			break;
		case V.OPTION:
			e.openElements.currentTagId === V.OPTION && e.openElements.pop(), e._insertElement(t, z.HTML);
			break;
		case V.OPTGROUP:
			e.openElements.currentTagId === V.OPTION && e.openElements.pop(), e.openElements.currentTagId === V.OPTGROUP && e.openElements.pop(), e._insertElement(t, z.HTML);
			break;
		case V.HR:
			e.openElements.currentTagId === V.OPTION && e.openElements.pop(), e.openElements.currentTagId === V.OPTGROUP && e.openElements.pop(), e._appendElement(t, z.HTML), t.ackSelfClosing = !0;
			break;
		case V.INPUT:
		case V.KEYGEN:
		case V.TEXTAREA:
		case V.SELECT:
			e.openElements.hasInSelectScope(V.SELECT) && (e.openElements.popUntilTagNamePopped(V.SELECT), e._resetInsertionMode(), t.tagID !== V.SELECT && e._processStartTag(t));
			break;
		case V.SCRIPT:
		case V.TEMPLATE:
			co(e, t);
			break;
		default:
	}
}
function Ws(e, t) {
	switch (t.tagID) {
		case V.OPTGROUP:
			e.openElements.stackTop > 0 && e.openElements.currentTagId === V.OPTION && e.openElements.tagIDs[e.openElements.stackTop - 1] === V.OPTGROUP && e.openElements.pop(), e.openElements.currentTagId === V.OPTGROUP && e.openElements.pop();
			break;
		case V.OPTION:
			e.openElements.currentTagId === V.OPTION && e.openElements.pop();
			break;
		case V.SELECT:
			e.openElements.hasInSelectScope(V.SELECT) && (e.openElements.popUntilTagNamePopped(V.SELECT), e._resetInsertionMode());
			break;
		case V.TEMPLATE:
			uo(e, t);
			break;
		default:
	}
}
function Gs(e, t) {
	let n = t.tagID;
	n === V.CAPTION || n === V.TABLE || n === V.TBODY || n === V.TFOOT || n === V.THEAD || n === V.TR || n === V.TD || n === V.TH ? (e.openElements.popUntilTagNamePopped(V.SELECT), e._resetInsertionMode(), e._processStartTag(t)) : Us(e, t);
}
function Ks(e, t) {
	let n = t.tagID;
	n === V.CAPTION || n === V.TABLE || n === V.TBODY || n === V.TFOOT || n === V.THEAD || n === V.TR || n === V.TD || n === V.TH ? e.openElements.hasInTableScope(n) && (e.openElements.popUntilTagNamePopped(V.SELECT), e._resetInsertionMode(), e.onEndTag(t)) : Ws(e, t);
}
function qs(e, t) {
	switch (t.tagID) {
		case V.BASE:
		case V.BASEFONT:
		case V.BGSOUND:
		case V.LINK:
		case V.META:
		case V.NOFRAMES:
		case V.SCRIPT:
		case V.STYLE:
		case V.TEMPLATE:
		case V.TITLE:
			co(e, t);
			break;
		case V.CAPTION:
		case V.COLGROUP:
		case V.TBODY:
		case V.TFOOT:
		case V.THEAD:
			e.tmplInsertionModeStack[0] = W.IN_TABLE, e.insertionMode = W.IN_TABLE, Ts(e, t);
			break;
		case V.COL:
			e.tmplInsertionModeStack[0] = W.IN_COLUMN_GROUP, e.insertionMode = W.IN_COLUMN_GROUP, Ps(e, t);
			break;
		case V.TR:
			e.tmplInsertionModeStack[0] = W.IN_TABLE_BODY, e.insertionMode = W.IN_TABLE_BODY, Ls(e, t);
			break;
		case V.TD:
		case V.TH:
			e.tmplInsertionModeStack[0] = W.IN_ROW, e.insertionMode = W.IN_ROW, zs(e, t);
			break;
		default: e.tmplInsertionModeStack[0] = W.IN_BODY, e.insertionMode = W.IN_BODY, es(e, t);
	}
}
function Js(e, t) {
	t.tagID === V.TEMPLATE && uo(e, t);
}
function Ys(e, t) {
	e.openElements.tmplCount > 0 ? (e.openElements.popUntilTagNamePopped(V.TEMPLATE), e.activeFormattingElements.clearToLastMarker(), e.tmplInsertionModeStack.shift(), e._resetInsertionMode(), e.onEof(t)) : $a(e, t);
}
function Xs(e, t) {
	t.tagID === V.HTML ? es(e, t) : Qs(e, t);
}
function Zs(e, t) {
	if (t.tagID === V.HTML) {
		if (e.fragmentContext || (e.insertionMode = W.AFTER_AFTER_BODY), e.options.sourceCodeLocationInfo && e.openElements.tagIDs[0] === V.HTML) {
			e._setEndLocation(e.openElements.items[0], t);
			let n = e.openElements.items[1];
			n && !e.treeAdapter.getNodeSourceCodeLocation(n)?.endTag && e._setEndLocation(n, t);
		}
	} else Qs(e, t);
}
function Qs(e, t) {
	e.insertionMode = W.IN_BODY, yo(e, t);
}
function $s(e, t) {
	switch (t.tagID) {
		case V.HTML:
			es(e, t);
			break;
		case V.FRAMESET:
			e._insertElement(t, z.HTML);
			break;
		case V.FRAME:
			e._appendElement(t, z.HTML), t.ackSelfClosing = !0;
			break;
		case V.NOFRAMES:
			co(e, t);
			break;
		default:
	}
}
function ec(e, t) {
	t.tagID === V.FRAMESET && !e.openElements.isRootHtmlElementCurrent() && (e.openElements.pop(), !e.fragmentContext && e.openElements.currentTagId !== V.FRAMESET && (e.insertionMode = W.AFTER_FRAMESET));
}
function tc(e, t) {
	switch (t.tagID) {
		case V.HTML:
			es(e, t);
			break;
		case V.NOFRAMES:
			co(e, t);
			break;
		default:
	}
}
function nc(e, t) {
	t.tagID === V.HTML && (e.insertionMode = W.AFTER_AFTER_FRAMESET);
}
function rc(e, t) {
	t.tagID === V.HTML ? es(e, t) : ic(e, t);
}
function ic(e, t) {
	e.insertionMode = W.IN_BODY, yo(e, t);
}
function ac(e, t) {
	switch (t.tagID) {
		case V.HTML:
			es(e, t);
			break;
		case V.NOFRAMES:
			co(e, t);
			break;
		default:
	}
}
function oc(e, t) {
	t.chars = "�", e._insertCharacters(t);
}
function sc(e, t) {
	e._insertCharacters(t), e.framesetOk = !1;
}
function cc(e) {
	for (; e.treeAdapter.getNamespaceURI(e.openElements.current) !== z.HTML && e.openElements.currentTagId !== void 0 && !e._isIntegrationPoint(e.openElements.currentTagId, e.openElements.current);) e.openElements.pop();
}
function lc(e, t) {
	if (Oa(t)) cc(e), e._startTagOutsideForeignContent(t);
	else {
		let n = e._getAdjustedCurrentElement(), r = e.treeAdapter.getNamespaceURI(n);
		r === z.MATHML ? ka(t) : r === z.SVG && (Ma(t), Aa(t)), ja(t), t.selfClosing ? e._appendElement(t, r) : e._insertElement(t, r), t.ackSelfClosing = !0;
	}
}
function uc(e, t) {
	if (t.tagID === V.P || t.tagID === V.BR) {
		cc(e), e._endTagOutsideForeignContent(t);
		return;
	}
	for (let n = e.openElements.stackTop; n > 0; n--) {
		let r = e.openElements.items[n];
		if (e.treeAdapter.getNamespaceURI(r) === z.HTML) {
			e._endTagOutsideForeignContent(t);
			break;
		}
		let i = e.treeAdapter.getTagName(r);
		if (i.toLowerCase() === t.tagName) {
			t.tagName = i, e.openElements.shortenToLength(n);
			break;
		}
	}
}
new Set([
	B.AREA,
	B.BASE,
	B.BASEFONT,
	B.BGSOUND,
	B.BR,
	B.COL,
	B.EMBED,
	B.FRAME,
	B.HR,
	B.IMG,
	B.INPUT,
	B.KEYGEN,
	B.LINK,
	B.META,
	B.PARAM,
	B.SOURCE,
	B.TRACK,
	B.WBR
]);
//#endregion
//#region node_modules/.pnpm/unist-util-position@5.0.0/node_modules/unist-util-position/lib/index.js
var dc = pc("end"), fc = pc("start");
function pc(e) {
	return t;
	function t(t) {
		let n = t && t.position && t.position[e] || {};
		if (typeof n.line == "number" && n.line > 0 && typeof n.column == "number" && n.column > 0) return {
			line: n.line,
			column: n.column,
			offset: typeof n.offset == "number" && n.offset > -1 ? n.offset : void 0
		};
	}
}
function mc(e) {
	let t = fc(e), n = dc(e);
	if (t && n) return {
		start: t,
		end: n
	};
}
//#endregion
//#region node_modules/.pnpm/hast-util-raw@9.1.0/node_modules/hast-util-raw/lib/index.js
var hc = /<(\/?)(iframe|noembed|noframes|plaintext|script|style|textarea|title|xmp)(?=[\t\n\f\r />])/gi, gc = new Set([
	"mdxFlowExpression",
	"mdxJsxFlowElement",
	"mdxJsxTextElement",
	"mdxTextExpression",
	"mdxjsEsm"
]), _c = {
	sourceCodeLocationInfo: !0,
	scriptingEnabled: !1
};
function vc(e, t) {
	let n = Mc(e), r = Gr("type", {
		handlers: {
			root: bc,
			element: xc,
			text: Sc,
			comment: Tc,
			doctype: Cc,
			raw: Ec
		},
		unknown: Dc
	}), i = {
		parser: n ? new Ha(_c) : Ha.getFragmentParser(void 0, _c),
		handle(e) {
			r(e, i);
		},
		stitches: !1,
		options: t || {}
	};
	r(e, i), Oc(i, fc());
	let a = Ir(n ? i.parser.document : i.parser.getFragment(), { file: i.options.file });
	return i.stitches && Et(a, "comment", function(e, t, n) {
		let r = e;
		if (r.value.stitch && n && t !== void 0) {
			let e = n.children;
			return e[t] = r.value.stitch, t;
		}
	}), a.type === "root" && a.children.length === 1 && a.children[0].type === e.type ? a.children[0] : a;
}
function yc(e, t) {
	let n = -1;
	/* istanbul ignore else - invalid nodes, see rehypejs/rehype-raw#7. */
	if (e) for (; ++n < e.length;) t.handle(e[n]);
}
function bc(e, t) {
	yc(e.children, t);
}
function xc(e, t) {
	Ac(e, t), yc(e.children, t), jc(e, t);
}
function Sc(e, t) {
	t.parser.tokenizer.state > 4 && (t.parser.tokenizer.state = 0);
	let n = {
		type: R.CHARACTER,
		chars: e.value,
		location: Nc(e)
	};
	Oc(t, fc(e)), t.parser.currentToken = n, t.parser._processToken(t.parser.currentToken);
}
function Cc(e, t) {
	let n = {
		type: R.DOCTYPE,
		name: "html",
		forceQuirks: !1,
		publicId: "",
		systemId: "",
		location: Nc(e)
	};
	Oc(t, fc(e)), t.parser.currentToken = n, t.parser._processToken(t.parser.currentToken);
}
function wc(e, t) {
	t.stitches = !0;
	let n = Pc(e);
	"children" in e && "children" in n && (n.children = vc({
		type: "root",
		children: e.children
	}, t.options).children), Tc({
		type: "comment",
		value: { stitch: n }
	}, t);
}
function Tc(e, t) {
	let n = e.value, r = {
		type: R.COMMENT,
		data: n,
		location: Nc(e)
	};
	Oc(t, fc(e)), t.parser.currentToken = r, t.parser._processToken(t.parser.currentToken);
}
function Ec(e, t) {
	/* c8 ignore next 12 -- removed in <https://github.com/inikulin/parse5/pull/897> */
	if (t.parser.tokenizer.preprocessor.html = "", t.parser.tokenizer.preprocessor.pos = -1, t.parser.tokenizer.preprocessor.lastGapPos = -2, t.parser.tokenizer.preprocessor.gapStack = [], t.parser.tokenizer.preprocessor.skipNextNewLine = !1, t.parser.tokenizer.preprocessor.lastChunkWritten = !1, t.parser.tokenizer.preprocessor.endOfChunkHit = !1, t.parser.tokenizer.preprocessor.isEol = !1, kc(t, fc(e)), t.parser.tokenizer.write(t.options.tagfilter ? e.value.replace(hc, "&lt;$1$2") : e.value, !1), t.parser.tokenizer._runParsingLoop(), t.parser.tokenizer.state === 72 || t.parser.tokenizer.state === 78) {
		t.parser.tokenizer.preprocessor.lastChunkWritten = !0;
		let e = t.parser.tokenizer._consume();
		t.parser.tokenizer._callState(e);
	}
}
function Dc(e, t) {
	let n = e;
	if (t.options.passThrough && t.options.passThrough.includes(n.type)) wc(n, t);
	else {
		let e = "";
		throw gc.has(n.type) && (e = ". It looks like you are using MDX nodes with `hast-util-raw` (or `rehype-raw`). If you use this because you are using remark or rehype plugins that inject `'html'` nodes, then please raise an issue with that plugin, as its a bad and slow idea. If you use this because you are using markdown syntax, then you have to configure this utility (or plugin) to pass through these nodes (see `passThrough` in docs), but you can also migrate to use the MDX syntax"), Error("Cannot compile `" + n.type + "` node" + e);
	}
}
function Oc(e, t) {
	kc(e, t);
	let n = e.parser.tokenizer.currentCharacterToken;
	n && n.location && (n.location.endLine = e.parser.tokenizer.preprocessor.line, n.location.endCol = e.parser.tokenizer.preprocessor.col + 1, n.location.endOffset = e.parser.tokenizer.preprocessor.offset + 1, e.parser.currentToken = n, e.parser._processToken(e.parser.currentToken)), e.parser.tokenizer.paused = !1, e.parser.tokenizer.inLoop = !1, e.parser.tokenizer.active = !1, e.parser.tokenizer.returnState = Ii.DATA, e.parser.tokenizer.charRefCode = -1, e.parser.tokenizer.consumedAfterSnapshot = -1, e.parser.tokenizer.currentLocation = null, e.parser.tokenizer.currentCharacterToken = null, e.parser.tokenizer.currentToken = null, e.parser.tokenizer.currentAttr = {
		name: "",
		value: ""
	};
}
function kc(e, t) {
	if (t && t.offset !== void 0) {
		let n = {
			startLine: t.line,
			startCol: t.column,
			startOffset: t.offset,
			endLine: -1,
			endCol: -1,
			endOffset: -1
		};
		e.parser.tokenizer.preprocessor.lineStartPos = -t.column + 1, e.parser.tokenizer.preprocessor.droppedBufferSize = t.offset, e.parser.tokenizer.preprocessor.line = t.line, e.parser.tokenizer.currentLocation = n;
	}
}
function Ac(e, t) {
	let n = e.tagName.toLowerCase();
	if (t.parser.tokenizer.state === Ii.PLAINTEXT) return;
	Oc(t, fc(e));
	let r = t.parser.openElements.current, i = "namespaceURI" in r ? r.namespaceURI : Nn.html;
	i === Nn.html && n === "svg" && (i = Nn.svg);
	let a = Yr({
		...e,
		children: []
	}, { space: i === Nn.svg ? "svg" : "html" }), o = {
		type: R.START_TAG,
		tagName: n,
		tagID: Ni(n),
		selfClosing: !1,
		ackSelfClosing: !1,
		/* c8 ignore next */
		attrs: "attrs" in a ? a.attrs : [],
		location: Nc(e)
	};
	t.parser.currentToken = o, t.parser._processToken(t.parser.currentToken), t.parser.tokenizer.lastStartTagName = n;
}
function jc(e, t) {
	let n = e.tagName.toLowerCase();
	if (!t.parser.tokenizer.inForeignNode && ai.includes(n) || t.parser.tokenizer.state === Ii.PLAINTEXT) return;
	Oc(t, dc(e));
	let r = {
		type: R.END_TAG,
		tagName: n,
		tagID: Ni(n),
		selfClosing: !1,
		ackSelfClosing: !1,
		attrs: [],
		location: Nc(e)
	};
	t.parser.currentToken = r, t.parser._processToken(t.parser.currentToken), n === t.parser.tokenizer.lastStartTagName && (t.parser.tokenizer.state === Ii.RCDATA || t.parser.tokenizer.state === Ii.RAWTEXT || t.parser.tokenizer.state === Ii.SCRIPT_DATA) && (t.parser.tokenizer.state = Ii.DATA);
}
function Mc(e) {
	let t = e.type === "root" ? e.children[0] : e;
	return !!(t && (t.type === "doctype" || t.type === "element" && t.tagName.toLowerCase() === "html"));
}
function Nc(e) {
	let t = fc(e) || {
		line: void 0,
		column: void 0,
		offset: void 0
	}, n = dc(e) || {
		line: void 0,
		column: void 0,
		offset: void 0
	};
	return {
		startLine: t.line,
		startCol: t.column,
		startOffset: t.offset,
		endLine: n.line,
		endCol: n.column,
		endOffset: n.offset
	};
}
function Pc(e) {
	return "children" in e ? jr({
		...e,
		children: []
	}) : jr(e);
}
//#endregion
//#region node_modules/.pnpm/rehype-raw@7.0.0/node_modules/rehype-raw/lib/index.js
function Fc(e) {
	return function(t, n) {
		return vc(t, {
			...e,
			file: n
		});
	};
}
//#endregion
//#region node_modules/.pnpm/hast-util-sanitize@5.0.2/node_modules/hast-util-sanitize/lib/schema.js
var Ic = [
	"ariaDescribedBy",
	"ariaLabel",
	"ariaLabelledBy"
], Lc = {
	ancestors: {
		tbody: ["table"],
		td: ["table"],
		th: ["table"],
		thead: ["table"],
		tfoot: ["table"],
		tr: ["table"]
	},
	attributes: {
		a: [
			...Ic,
			"dataFootnoteBackref",
			"dataFootnoteRef",
			["className", "data-footnote-backref"],
			"href"
		],
		blockquote: ["cite"],
		code: [["className", /^language-./]],
		del: ["cite"],
		div: ["itemScope", "itemType"],
		dl: [...Ic],
		h2: [["className", "sr-only"]],
		img: [
			...Ic,
			"longDesc",
			"src"
		],
		input: [["disabled", !0], ["type", "checkbox"]],
		ins: ["cite"],
		li: [["className", "task-list-item"]],
		ol: [...Ic, ["className", "contains-task-list"]],
		q: ["cite"],
		section: ["dataFootnotes", ["className", "footnotes"]],
		source: ["srcSet"],
		summary: [...Ic],
		table: [...Ic],
		ul: [...Ic, ["className", "contains-task-list"]],
		"*": /* @__PURE__ */ "abbr.accept.acceptCharset.accessKey.action.align.alt.axis.border.cellPadding.cellSpacing.char.charOff.charSet.checked.clear.colSpan.color.cols.compact.coords.dateTime.dir.encType.frame.hSpace.headers.height.hrefLang.htmlFor.id.isMap.itemProp.label.lang.maxLength.media.method.multiple.name.noHref.noShade.noWrap.open.prompt.readOnly.rev.rowSpan.rows.rules.scope.selected.shape.size.span.start.summary.tabIndex.title.useMap.vAlign.value.width".split(".")
	},
	clobber: [
		"ariaDescribedBy",
		"ariaLabelledBy",
		"id",
		"name"
	],
	clobberPrefix: "user-content-",
	protocols: {
		cite: ["http", "https"],
		href: [
			"http",
			"https",
			"irc",
			"ircs",
			"mailto",
			"xmpp"
		],
		longDesc: ["http", "https"],
		src: ["http", "https"]
	},
	required: { input: {
		disabled: !0,
		type: "checkbox"
	} },
	strip: ["script"],
	tagNames: /* @__PURE__ */ "a.b.blockquote.br.code.dd.del.details.div.dl.dt.em.h1.h2.h3.h4.h5.h6.hr.i.img.input.ins.kbd.li.ol.p.picture.pre.q.rp.rt.ruby.s.samp.section.source.span.strike.strong.sub.summary.sup.table.tbody.td.tfoot.th.thead.tr.tt.ul.var".split(".")
}, Rc = {}.hasOwnProperty;
function zc(e, t) {
	let n = {
		type: "root",
		children: []
	}, r = Bc({
		schema: t ? {
			...Lc,
			...t
		} : Lc,
		stack: []
	}, e);
	return r && (Array.isArray(r) ? r.length === 1 ? n = r[0] : n.children = r : n = r), n;
}
function Bc(e, t) {
	if (t && typeof t == "object") {
		let n = t;
		switch (typeof n.type == "string" ? n.type : "") {
			case "comment": return Vc(e, n);
			case "doctype": return Hc(e, n);
			case "element": return Uc(e, n);
			case "root": return Wc(e, n);
			case "text": return Gc(e, n);
			default:
		}
	}
}
function Vc(e, t) {
	if (e.schema.allowComments) {
		let e = typeof t.value == "string" ? t.value : "", n = e.indexOf("-->"), r = {
			type: "comment",
			value: n < 0 ? e : e.slice(0, n)
		};
		return Qc(r, t), r;
	}
}
function Hc(e, t) {
	if (e.schema.allowDoctypes) {
		let e = { type: "doctype" };
		return Qc(e, t), e;
	}
}
function Uc(e, t) {
	let n = typeof t.tagName == "string" ? t.tagName : "";
	e.stack.push(n);
	let r = Kc(e, t.children), i = qc(e, t.properties);
	e.stack.pop();
	let a = !1;
	if (n && n !== "*" && (!e.schema.tagNames || e.schema.tagNames.includes(n)) && (a = !0, e.schema.ancestors && Rc.call(e.schema.ancestors, n))) {
		let t = e.schema.ancestors[n], r = -1;
		for (a = !1; ++r < t.length;) e.stack.includes(t[r]) && (a = !0);
	}
	if (!a) return e.schema.strip && !e.schema.strip.includes(n) ? r : void 0;
	let o = {
		type: "element",
		tagName: n,
		properties: i,
		children: r
	};
	return Qc(o, t), o;
}
function Wc(e, t) {
	let n = {
		type: "root",
		children: Kc(e, t.children)
	};
	return Qc(n, t), n;
}
function Gc(e, t) {
	let n = {
		type: "text",
		value: typeof t.value == "string" ? t.value : ""
	};
	return Qc(n, t), n;
}
function Kc(e, t) {
	let n = [];
	if (Array.isArray(t)) {
		let r = t, i = -1;
		for (; ++i < r.length;) {
			let t = Bc(e, r[i]);
			t && (Array.isArray(t) ? n.push(...t) : n.push(t));
		}
	}
	return n;
}
function qc(e, t) {
	let n = e.stack[e.stack.length - 1], r = e.schema.attributes, i = e.schema.required, a = r && Rc.call(r, n) ? r[n] : void 0, o = r && Rc.call(r, "*") ? r["*"] : void 0, s = t && typeof t == "object" ? t : {}, c = {}, l;
	for (l in s) if (Rc.call(s, l)) {
		let t = s[l], n = Jc(e, $c(a, l), l, t);
		n ??= Jc(e, $c(o, l), l, t), n != null && (c[l] = n);
	}
	if (i && Rc.call(i, n)) {
		let e = i[n];
		for (l in e) Rc.call(e, l) && !Rc.call(c, l) && (c[l] = e[l]);
	}
	return c;
}
function Jc(e, t, n, r) {
	return t ? Array.isArray(r) ? Yc(e, t, n, r) : Xc(e, t, n, r) : void 0;
}
function Yc(e, t, n, r) {
	let i = -1, a = [];
	for (; ++i < r.length;) {
		let o = Xc(e, t, n, r[i]);
		(typeof o == "number" || typeof o == "string") && a.push(o);
	}
	return a;
}
function Xc(e, t, n, r) {
	if (!(typeof r != "boolean" && typeof r != "number" && typeof r != "string") && Zc(e, n, r)) {
		if (typeof t == "object" && t.length > 1) {
			let e = !1, n = 0;
			for (; ++n < t.length;) {
				let i = t[n];
				if (i && typeof i == "object" && "flags" in i) {
					if (i.test(String(r))) {
						e = !0;
						break;
					}
				} else if (i === r) {
					e = !0;
					break;
				}
			}
			if (!e) return;
		}
		return e.schema.clobber && e.schema.clobberPrefix && e.schema.clobber.includes(n) ? e.schema.clobberPrefix + r : r;
	}
}
function Zc(e, t, n) {
	let r = e.schema.protocols && Rc.call(e.schema.protocols, t) ? e.schema.protocols[t] : void 0;
	if (!r || r.length === 0) return !0;
	let i = String(n), a = i.indexOf(":"), o = i.indexOf("?"), s = i.indexOf("#"), c = i.indexOf("/");
	if (a < 0 || c > -1 && a > c || o > -1 && a > o || s > -1 && a > s) return !0;
	let l = -1;
	for (; ++l < r.length;) {
		let e = r[l];
		if (a === e.length && i.slice(0, e.length) === e) return !0;
	}
	return !1;
}
function Qc(e, t) {
	let n = mc(t);
	t.data && (e.data = jr(t.data)), n && (e.position = n);
}
function $c(e, t) {
	let n, r = -1;
	if (e) for (; ++r < e.length;) {
		let i = e[r], a = typeof i == "string" ? i : i[0];
		if (a === t) return i;
		a === "data*" && (n = i);
	}
	if (t.length > 4 && t.slice(0, 4).toLowerCase() === "data") return n;
}
//#endregion
//#region node_modules/.pnpm/rehype-sanitize@6.0.0/node_modules/rehype-sanitize/lib/index.js
function el(e) {
	return function(t) {
		return zc(t, e);
	};
}
//#endregion
//#region node_modules/.pnpm/micromark-util-symbol@2.0.1/node_modules/micromark-util-symbol/lib/codes.js
var tl = {
	carriageReturn: -5,
	lineFeed: -4,
	carriageReturnLineFeed: -3,
	horizontalTab: -2,
	virtualSpace: -1,
	eof: null,
	nul: 0,
	soh: 1,
	stx: 2,
	etx: 3,
	eot: 4,
	enq: 5,
	ack: 6,
	bel: 7,
	bs: 8,
	ht: 9,
	lf: 10,
	vt: 11,
	ff: 12,
	cr: 13,
	so: 14,
	si: 15,
	dle: 16,
	dc1: 17,
	dc2: 18,
	dc3: 19,
	dc4: 20,
	nak: 21,
	syn: 22,
	etb: 23,
	can: 24,
	em: 25,
	sub: 26,
	esc: 27,
	fs: 28,
	gs: 29,
	rs: 30,
	us: 31,
	space: 32,
	exclamationMark: 33,
	quotationMark: 34,
	numberSign: 35,
	dollarSign: 36,
	percentSign: 37,
	ampersand: 38,
	apostrophe: 39,
	leftParenthesis: 40,
	rightParenthesis: 41,
	asterisk: 42,
	plusSign: 43,
	comma: 44,
	dash: 45,
	dot: 46,
	slash: 47,
	digit0: 48,
	digit1: 49,
	digit2: 50,
	digit3: 51,
	digit4: 52,
	digit5: 53,
	digit6: 54,
	digit7: 55,
	digit8: 56,
	digit9: 57,
	colon: 58,
	semicolon: 59,
	lessThan: 60,
	equalsTo: 61,
	greaterThan: 62,
	questionMark: 63,
	atSign: 64,
	uppercaseA: 65,
	uppercaseB: 66,
	uppercaseC: 67,
	uppercaseD: 68,
	uppercaseE: 69,
	uppercaseF: 70,
	uppercaseG: 71,
	uppercaseH: 72,
	uppercaseI: 73,
	uppercaseJ: 74,
	uppercaseK: 75,
	uppercaseL: 76,
	uppercaseM: 77,
	uppercaseN: 78,
	uppercaseO: 79,
	uppercaseP: 80,
	uppercaseQ: 81,
	uppercaseR: 82,
	uppercaseS: 83,
	uppercaseT: 84,
	uppercaseU: 85,
	uppercaseV: 86,
	uppercaseW: 87,
	uppercaseX: 88,
	uppercaseY: 89,
	uppercaseZ: 90,
	leftSquareBracket: 91,
	backslash: 92,
	rightSquareBracket: 93,
	caret: 94,
	underscore: 95,
	graveAccent: 96,
	lowercaseA: 97,
	lowercaseB: 98,
	lowercaseC: 99,
	lowercaseD: 100,
	lowercaseE: 101,
	lowercaseF: 102,
	lowercaseG: 103,
	lowercaseH: 104,
	lowercaseI: 105,
	lowercaseJ: 106,
	lowercaseK: 107,
	lowercaseL: 108,
	lowercaseM: 109,
	lowercaseN: 110,
	lowercaseO: 111,
	lowercaseP: 112,
	lowercaseQ: 113,
	lowercaseR: 114,
	lowercaseS: 115,
	lowercaseT: 116,
	lowercaseU: 117,
	lowercaseV: 118,
	lowercaseW: 119,
	lowercaseX: 120,
	lowercaseY: 121,
	lowercaseZ: 122,
	leftCurlyBrace: 123,
	verticalBar: 124,
	rightCurlyBrace: 125,
	tilde: 126,
	del: 127,
	byteOrderMarker: 65279,
	replacementCharacter: 65533
}, nl = {
	attentionSideAfter: 2,
	attentionSideBefore: 1,
	atxHeadingOpeningFenceSizeMax: 6,
	autolinkDomainSizeMax: 63,
	autolinkSchemeSizeMax: 32,
	cdataOpeningString: "CDATA[",
	characterGroupPunctuation: 2,
	characterGroupWhitespace: 1,
	characterReferenceDecimalSizeMax: 7,
	characterReferenceHexadecimalSizeMax: 6,
	characterReferenceNamedSizeMax: 31,
	codeFencedSequenceSizeMin: 3,
	contentTypeContent: "content",
	contentTypeDocument: "document",
	contentTypeFlow: "flow",
	contentTypeString: "string",
	contentTypeText: "text",
	hardBreakPrefixSizeMin: 2,
	htmlBasic: 6,
	htmlCdata: 5,
	htmlComment: 2,
	htmlComplete: 7,
	htmlDeclaration: 4,
	htmlInstruction: 3,
	htmlRawSizeMax: 8,
	htmlRaw: 1,
	linkResourceDestinationBalanceMax: 32,
	linkReferenceSizeMax: 999,
	listItemValueSizeMax: 10,
	numericBaseDecimal: 10,
	numericBaseHexadecimal: 16,
	tabSize: 4,
	thematicBreakMarkerCountMin: 3,
	v8MaxSafeChunkSize: 1e4
}, rl = {
	data: "data",
	whitespace: "whitespace",
	lineEnding: "lineEnding",
	lineEndingBlank: "lineEndingBlank",
	linePrefix: "linePrefix",
	lineSuffix: "lineSuffix",
	atxHeading: "atxHeading",
	atxHeadingSequence: "atxHeadingSequence",
	atxHeadingText: "atxHeadingText",
	autolink: "autolink",
	autolinkEmail: "autolinkEmail",
	autolinkMarker: "autolinkMarker",
	autolinkProtocol: "autolinkProtocol",
	characterEscape: "characterEscape",
	characterEscapeValue: "characterEscapeValue",
	characterReference: "characterReference",
	characterReferenceMarker: "characterReferenceMarker",
	characterReferenceMarkerNumeric: "characterReferenceMarkerNumeric",
	characterReferenceMarkerHexadecimal: "characterReferenceMarkerHexadecimal",
	characterReferenceValue: "characterReferenceValue",
	codeFenced: "codeFenced",
	codeFencedFence: "codeFencedFence",
	codeFencedFenceSequence: "codeFencedFenceSequence",
	codeFencedFenceInfo: "codeFencedFenceInfo",
	codeFencedFenceMeta: "codeFencedFenceMeta",
	codeFlowValue: "codeFlowValue",
	codeIndented: "codeIndented",
	codeText: "codeText",
	codeTextData: "codeTextData",
	codeTextPadding: "codeTextPadding",
	codeTextSequence: "codeTextSequence",
	content: "content",
	definition: "definition",
	definitionDestination: "definitionDestination",
	definitionDestinationLiteral: "definitionDestinationLiteral",
	definitionDestinationLiteralMarker: "definitionDestinationLiteralMarker",
	definitionDestinationRaw: "definitionDestinationRaw",
	definitionDestinationString: "definitionDestinationString",
	definitionLabel: "definitionLabel",
	definitionLabelMarker: "definitionLabelMarker",
	definitionLabelString: "definitionLabelString",
	definitionMarker: "definitionMarker",
	definitionTitle: "definitionTitle",
	definitionTitleMarker: "definitionTitleMarker",
	definitionTitleString: "definitionTitleString",
	emphasis: "emphasis",
	emphasisSequence: "emphasisSequence",
	emphasisText: "emphasisText",
	escapeMarker: "escapeMarker",
	hardBreakEscape: "hardBreakEscape",
	hardBreakTrailing: "hardBreakTrailing",
	htmlFlow: "htmlFlow",
	htmlFlowData: "htmlFlowData",
	htmlText: "htmlText",
	htmlTextData: "htmlTextData",
	image: "image",
	label: "label",
	labelText: "labelText",
	labelLink: "labelLink",
	labelImage: "labelImage",
	labelMarker: "labelMarker",
	labelImageMarker: "labelImageMarker",
	labelEnd: "labelEnd",
	link: "link",
	paragraph: "paragraph",
	reference: "reference",
	referenceMarker: "referenceMarker",
	referenceString: "referenceString",
	resource: "resource",
	resourceDestination: "resourceDestination",
	resourceDestinationLiteral: "resourceDestinationLiteral",
	resourceDestinationLiteralMarker: "resourceDestinationLiteralMarker",
	resourceDestinationRaw: "resourceDestinationRaw",
	resourceDestinationString: "resourceDestinationString",
	resourceMarker: "resourceMarker",
	resourceTitle: "resourceTitle",
	resourceTitleMarker: "resourceTitleMarker",
	resourceTitleString: "resourceTitleString",
	setextHeading: "setextHeading",
	setextHeadingText: "setextHeadingText",
	setextHeadingLine: "setextHeadingLine",
	setextHeadingLineSequence: "setextHeadingLineSequence",
	strong: "strong",
	strongSequence: "strongSequence",
	strongText: "strongText",
	thematicBreak: "thematicBreak",
	thematicBreakSequence: "thematicBreakSequence",
	blockQuote: "blockQuote",
	blockQuotePrefix: "blockQuotePrefix",
	blockQuoteMarker: "blockQuoteMarker",
	blockQuotePrefixWhitespace: "blockQuotePrefixWhitespace",
	listOrdered: "listOrdered",
	listUnordered: "listUnordered",
	listItemIndent: "listItemIndent",
	listItemMarker: "listItemMarker",
	listItemPrefix: "listItemPrefix",
	listItemPrefixWhitespace: "listItemPrefixWhitespace",
	listItemValue: "listItemValue",
	chunkDocument: "chunkDocument",
	chunkContent: "chunkContent",
	chunkFlow: "chunkFlow",
	chunkText: "chunkText",
	chunkString: "chunkString"
}, il = pl(/[A-Za-z]/), al = pl(/[\dA-Za-z]/), ol = pl(/[#-'*+\--9=?A-Z^-~]/);
function sl(e) {
	return e !== null && (e < 32 || e === 127);
}
var cl = pl(/\d/), ll = pl(/[\dA-Fa-f]/), ul = pl(/[!-/:-@[-`{-~]/);
function G(e) {
	return e !== null && e < -2;
}
function K(e) {
	return e !== null && (e < 0 || e === 32);
}
function q(e) {
	return e === -2 || e === -1 || e === 32;
}
var dl = pl(/\p{P}|\p{S}/u), fl = pl(/\s/);
function pl(e) {
	return t;
	function t(t) {
		return t !== null && t > -1 && e.test(String.fromCharCode(t));
	}
}
var ml = [
	161,
	161,
	164,
	164,
	167,
	168,
	170,
	170,
	173,
	174,
	176,
	180,
	182,
	186,
	188,
	191,
	198,
	198,
	208,
	208,
	215,
	216,
	222,
	225,
	230,
	230,
	232,
	234,
	236,
	237,
	240,
	240,
	242,
	243,
	247,
	250,
	252,
	252,
	254,
	254,
	257,
	257,
	273,
	273,
	275,
	275,
	283,
	283,
	294,
	295,
	299,
	299,
	305,
	307,
	312,
	312,
	319,
	322,
	324,
	324,
	328,
	331,
	333,
	333,
	338,
	339,
	358,
	359,
	363,
	363,
	462,
	462,
	464,
	464,
	466,
	466,
	468,
	468,
	470,
	470,
	472,
	472,
	474,
	474,
	476,
	476,
	593,
	593,
	609,
	609,
	708,
	708,
	711,
	711,
	713,
	715,
	717,
	717,
	720,
	720,
	728,
	731,
	733,
	733,
	735,
	735,
	768,
	879,
	913,
	929,
	931,
	937,
	945,
	961,
	963,
	969,
	1025,
	1025,
	1040,
	1103,
	1105,
	1105,
	8208,
	8208,
	8211,
	8214,
	8216,
	8217,
	8220,
	8221,
	8224,
	8226,
	8228,
	8231,
	8240,
	8240,
	8242,
	8243,
	8245,
	8245,
	8251,
	8251,
	8254,
	8254,
	8308,
	8308,
	8319,
	8319,
	8321,
	8324,
	8364,
	8364,
	8451,
	8451,
	8453,
	8453,
	8457,
	8457,
	8467,
	8467,
	8470,
	8470,
	8481,
	8482,
	8486,
	8486,
	8491,
	8491,
	8531,
	8532,
	8539,
	8542,
	8544,
	8555,
	8560,
	8569,
	8585,
	8585,
	8592,
	8601,
	8632,
	8633,
	8658,
	8658,
	8660,
	8660,
	8679,
	8679,
	8704,
	8704,
	8706,
	8707,
	8711,
	8712,
	8715,
	8715,
	8719,
	8719,
	8721,
	8721,
	8725,
	8725,
	8730,
	8730,
	8733,
	8736,
	8739,
	8739,
	8741,
	8741,
	8743,
	8748,
	8750,
	8750,
	8756,
	8759,
	8764,
	8765,
	8776,
	8776,
	8780,
	8780,
	8786,
	8786,
	8800,
	8801,
	8804,
	8807,
	8810,
	8811,
	8814,
	8815,
	8834,
	8835,
	8838,
	8839,
	8853,
	8853,
	8857,
	8857,
	8869,
	8869,
	8895,
	8895,
	8978,
	8978,
	9312,
	9449,
	9451,
	9547,
	9552,
	9587,
	9600,
	9615,
	9618,
	9621,
	9632,
	9633,
	9635,
	9641,
	9650,
	9651,
	9654,
	9655,
	9660,
	9661,
	9664,
	9665,
	9670,
	9672,
	9675,
	9675,
	9678,
	9681,
	9698,
	9701,
	9711,
	9711,
	9733,
	9734,
	9737,
	9737,
	9742,
	9743,
	9756,
	9756,
	9758,
	9758,
	9792,
	9792,
	9794,
	9794,
	9824,
	9825,
	9827,
	9829,
	9831,
	9834,
	9836,
	9837,
	9839,
	9839,
	9886,
	9887,
	9919,
	9919,
	9926,
	9933,
	9935,
	9939,
	9941,
	9953,
	9955,
	9955,
	9960,
	9961,
	9963,
	9969,
	9972,
	9972,
	9974,
	9977,
	9979,
	9980,
	9982,
	9983,
	10045,
	10045,
	10102,
	10111,
	11094,
	11097,
	12872,
	12879,
	57344,
	63743,
	65024,
	65039,
	65533,
	65533,
	127232,
	127242,
	127248,
	127277,
	127280,
	127337,
	127344,
	127373,
	127375,
	127376,
	127387,
	127404,
	917760,
	917999,
	983040,
	1048573,
	1048576,
	1114109
], hl = [
	12288,
	12288,
	65281,
	65376,
	65504,
	65510
], gl = [
	8361,
	8361,
	65377,
	65470,
	65474,
	65479,
	65482,
	65487,
	65490,
	65495,
	65498,
	65500,
	65512,
	65518
], _l = [
	32,
	126,
	162,
	163,
	165,
	166,
	172,
	172,
	175,
	175,
	10214,
	10221,
	10629,
	10630
], vl = [
	4352,
	4447,
	8986,
	8987,
	9001,
	9002,
	9193,
	9196,
	9200,
	9200,
	9203,
	9203,
	9725,
	9726,
	9748,
	9749,
	9776,
	9783,
	9800,
	9811,
	9855,
	9855,
	9866,
	9871,
	9875,
	9875,
	9889,
	9889,
	9898,
	9899,
	9917,
	9918,
	9924,
	9925,
	9934,
	9934,
	9940,
	9940,
	9962,
	9962,
	9970,
	9971,
	9973,
	9973,
	9978,
	9978,
	9981,
	9981,
	9989,
	9989,
	9994,
	9995,
	10024,
	10024,
	10060,
	10060,
	10062,
	10062,
	10067,
	10069,
	10071,
	10071,
	10133,
	10135,
	10160,
	10160,
	10175,
	10175,
	11035,
	11036,
	11088,
	11088,
	11093,
	11093,
	11904,
	11929,
	11931,
	12019,
	12032,
	12245,
	12272,
	12287,
	12289,
	12350,
	12353,
	12438,
	12441,
	12543,
	12549,
	12591,
	12593,
	12686,
	12688,
	12773,
	12783,
	12830,
	12832,
	12871,
	12880,
	42124,
	42128,
	42182,
	43360,
	43388,
	44032,
	55203,
	63744,
	64255,
	65040,
	65049,
	65072,
	65106,
	65108,
	65126,
	65128,
	65131,
	94176,
	94180,
	94192,
	94198,
	94208,
	101589,
	101631,
	101662,
	101760,
	101874,
	110576,
	110579,
	110581,
	110587,
	110589,
	110590,
	110592,
	110882,
	110898,
	110898,
	110928,
	110930,
	110933,
	110933,
	110948,
	110951,
	110960,
	111355,
	119552,
	119638,
	119648,
	119670,
	126980,
	126980,
	127183,
	127183,
	127374,
	127374,
	127377,
	127386,
	127488,
	127490,
	127504,
	127547,
	127552,
	127560,
	127568,
	127569,
	127584,
	127589,
	127744,
	127776,
	127789,
	127797,
	127799,
	127868,
	127870,
	127891,
	127904,
	127946,
	127951,
	127955,
	127968,
	127984,
	127988,
	127988,
	127992,
	128062,
	128064,
	128064,
	128066,
	128252,
	128255,
	128317,
	128331,
	128334,
	128336,
	128359,
	128378,
	128378,
	128405,
	128406,
	128420,
	128420,
	128507,
	128591,
	128640,
	128709,
	128716,
	128716,
	128720,
	128722,
	128725,
	128728,
	128732,
	128735,
	128747,
	128748,
	128756,
	128764,
	128992,
	129003,
	129008,
	129008,
	129292,
	129338,
	129340,
	129349,
	129351,
	129535,
	129648,
	129660,
	129664,
	129674,
	129678,
	129734,
	129736,
	129736,
	129741,
	129756,
	129759,
	129770,
	129775,
	129784,
	131072,
	196605,
	196608,
	262141
], yl = (e, t) => {
	let n = 0, r = Math.floor(e.length / 2) - 1;
	for (; n <= r;) {
		let i = Math.floor((n + r) / 2), a = i * 2;
		if (t < e[a]) r = i - 1;
		else if (t > e[a + 1]) n = i + 1;
		else return !0;
	}
	return !1;
}, bl = 19968, [xl, Sl] = /* @__PURE__ */ Cl(vl);
function Cl(e) {
	let t = e[0], n = e[1];
	for (let r = 0; r < e.length; r += 2) {
		let i = e[r], a = e[r + 1];
		if (bl >= i && bl <= a) return [i, a];
		a - i > n - t && (t = i, n = a);
	}
	return [t, n];
}
var wl = (e) => e < 161 || e > 1114109 ? !1 : yl(ml, e), Tl = (e) => e < 12288 || e > 65510 ? !1 : yl(hl, e), El = (e) => e < 8361 || e > 65518 ? !1 : yl(gl, e), Dl = (e) => e < 32 || e > 10630 ? !1 : yl(_l, e), Ol = (e) => e >= xl && e <= Sl ? !0 : e < 4352 || e > 262141 ? !1 : yl(vl, e);
function kl(e) {
	return wl(e) ? "ambiguous" : Tl(e) ? "fullwidth" : El(e) ? "halfwidth" : Dl(e) ? "narrow" : Ol(e) ? "wide" : "neutral";
}
//#endregion
//#region node_modules/.pnpm/get-east-asian-width@1.6.0/node_modules/get-east-asian-width/index.js
function Al(e) {
	if (!Number.isSafeInteger(e)) throw TypeError(`Expected a code point, got \`${typeof e}\`.`);
}
function jl(e) {
	return Al(e), kl(e);
}
//#endregion
//#region node_modules/.pnpm/micromark-extension-cjk-friendly-util@2.1.1_micromark-util-types@2.0.2/node_modules/micromark-extension-cjk-friendly-util/dist/index.js
var Ml = Object.defineProperty, Nl = (e, t, n) => t in e ? Ml(e, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: n
}) : e[t] = n, Pl = (e, t, n) => Nl(e, typeof t == "symbol" ? t : t + "", n);
function Fl(e) {
	return /^\p{Emoji_Presentation}/u.test(String.fromCodePoint(e));
}
function Il(e) {
	if (!e || e < 4352) return !1;
	switch (jl(e)) {
		case "fullwidth":
		case "halfwidth": return !0;
		case "wide": return !Fl(e);
		case "narrow": return !1;
		case "ambiguous": return 917760 <= e && e <= 917999 ? null : !1;
		case "neutral": return /^\p{sc=Hangul}/u.test(String.fromCodePoint(e));
	}
}
function Ll(e, t) {
	return t !== 65025 || !e || e < 8216 ? !1 : e === 8216 || e === 8217 || e === 8220 || e === 8221;
}
function Rl(e) {
	return e !== null && e >= 65024 && e <= 65038;
}
var zl = Vl(/\p{P}|\p{S}/u), Bl = Vl(/\s/);
function Vl(e) {
	return t;
	function t(t) {
		return t !== null && t > -1 && e.test(String.fromCodePoint(t));
	}
}
var Hl;
((e) => {
	e.spaceOrPunctuation = 3, e.cjk = 4096, e.cjkPunctuation = 4098, e.ivs = 8192, e.cjkOrIvs = 12288, e.nonEmojiGeneralUseVS = 16384, e.variationSelector = 24576, e.ivsToCjkRightShift = 1;
})(Hl ||= {});
function Ul(e) {
	if (e === tl.eof || K(e) || Bl(e)) return nl.characterGroupWhitespace;
	let t = 0;
	if (e >= 4352) {
		if (Rl(e)) return Hl.nonEmojiGeneralUseVS;
		switch (Il(e)) {
			case null: return Hl.ivs;
			case !0:
				t |= Hl.cjk;
				break;
		}
	}
	return zl(e) && (t |= nl.characterGroupPunctuation), t;
}
function Wl(e, t, n) {
	if (!Zl(e)) return e;
	let r = t(), i = Ul(r);
	return !r || Kl(i) ? e : Ll(r, n) ? Hl.cjkPunctuation : Gl(i);
}
function Gl(e) {
	return e & ~Hl.ivs;
}
function Kl(e) {
	return !!(e & nl.characterGroupWhitespace);
}
function ql(e) {
	return (e & Hl.cjkPunctuation) === nl.characterGroupPunctuation;
}
function Jl(e) {
	return !!(e & Hl.cjk);
}
function Yl(e) {
	return e === Hl.ivs;
}
function Xl(e) {
	return !!(e & Hl.cjkOrIvs);
}
function Zl(e) {
	return e === Hl.nonEmojiGeneralUseVS;
}
function Ql(e) {
	return !!(e & Hl.spaceOrPunctuation);
}
function $l(e) {
	return !!(e && e >= 55296 && e <= 56319);
}
function eu(e) {
	return !!(e && e >= 56320 && e <= 57343);
}
function tu(e, t, n) {
	if (t._bufferIndex < 2) return e;
	let r = n({
		start: {
			...t,
			_bufferIndex: t._bufferIndex - 2
		},
		end: t
	}).codePointAt(0);
	return r && r >= 65536 ? r : e;
}
function nu(e, t, n) {
	let r = e >= 65536 ? 2 : 1;
	if (t._bufferIndex < 1 + r) return null;
	let i = t._bufferIndex - r - 2, a = n({
		start: {
			...t,
			_bufferIndex: i >= 0 ? i : 0
		},
		end: {
			...t,
			_bufferIndex: t._bufferIndex - r
		}
	}), o = a.charCodeAt(a.length - 1);
	if (Number.isNaN(o)) return null;
	if (a.length < 2 || o < 56320 || 57343 < o) return o;
	let s = a.codePointAt(0);
	return s && s >= 65536 ? s : o;
}
var ru = class {
	constructor(e, t, n) {
		this.previousCode = e, this.nowPoint = t, this.sliceSerialize = n, Pl(this, "cachedValue");
	}
	value() {
		return this.cachedValue === void 0 && (this.cachedValue = nu(this.previousCode, this.nowPoint, this.sliceSerialize)), this.cachedValue;
	}
};
function iu(e, t, n) {
	let r = n({
		start: t,
		end: {
			...t,
			_bufferIndex: t._bufferIndex + 2
		}
	}).codePointAt(0);
	return r && r >= 65536 ? r : e;
}
//#endregion
//#region node_modules/.pnpm/micromark-util-chunked@2.0.1/node_modules/micromark-util-chunked/index.js
function au(e, t, n, r) {
	let i = e.length, a = 0, o;
	if (t = t < 0 ? -t > i ? 0 : i + t : t > i ? i : t, n = n > 0 ? n : 0, r.length < 1e4) o = Array.from(r), o.unshift(t, n), e.splice(...o);
	else for (n && e.splice(t, n); a < r.length;) o = r.slice(a, a + 1e4), o.unshift(t, 0), e.splice(...o), a += 1e4, t += 1e4;
}
function ou(e, t) {
	return e.length > 0 ? (au(e, e.length, 0, t), e) : t;
}
//#endregion
//#region node_modules/.pnpm/micromark-util-resolve-all@2.0.1/node_modules/micromark-util-resolve-all/index.js
function su(e, t, n) {
	let r = [], i = -1;
	for (; ++i < e.length;) {
		let a = e[i].resolveAll;
		a && !r.includes(a) && (t = a(t, n), r.push(a));
	}
	return t;
}
//#endregion
//#region node_modules/.pnpm/micromark-extension-cjk-friendly@1.2.3_micromark-util-types@2.0.2_micromark@4.0.2/node_modules/micromark-extension-cjk-friendly/dist/index.js
var cu = {
	name: "attention",
	resolveAll: lu,
	tokenize: uu
};
function lu(e, t) {
	let n = -1, r, i, a, o, s, c, l, u;
	for (; ++n < e.length;) if (e[n][0] === "enter" && e[n][1].type === "attentionSequence" && e[n][1]._close) {
		for (r = n; r--;) if (e[r][0] === "exit" && e[r][1].type === "attentionSequence" && e[r][1]._open && t.sliceSerialize(e[r][1]).charCodeAt(0) === t.sliceSerialize(e[n][1]).charCodeAt(0)) {
			if ((e[r][1]._close || e[n][1]._open) && (e[n][1].end.offset - e[n][1].start.offset) % 3 && !((e[r][1].end.offset - e[r][1].start.offset + e[n][1].end.offset - e[n][1].start.offset) % 3)) continue;
			c = e[r][1].end.offset - e[r][1].start.offset > 1 && e[n][1].end.offset - e[n][1].start.offset > 1 ? 2 : 1;
			let d = { ...e[r][1].end }, f = { ...e[n][1].start };
			du(d, -c), du(f, c), o = {
				type: c > 1 ? rl.strongSequence : rl.emphasisSequence,
				start: d,
				end: { ...e[r][1].end }
			}, s = {
				type: c > 1 ? rl.strongSequence : rl.emphasisSequence,
				start: { ...e[n][1].start },
				end: f
			}, a = {
				type: c > 1 ? rl.strongText : rl.emphasisText,
				start: { ...e[r][1].end },
				end: { ...e[n][1].start }
			}, i = {
				type: c > 1 ? rl.strong : rl.emphasis,
				start: { ...o.start },
				end: { ...s.end }
			}, e[r][1].end = { ...o.start }, e[n][1].start = { ...s.end }, l = [], e[r][1].end.offset - e[r][1].start.offset && (l = ou(l, [[
				"enter",
				e[r][1],
				t
			], [
				"exit",
				e[r][1],
				t
			]])), l = ou(l, [
				[
					"enter",
					i,
					t
				],
				[
					"enter",
					o,
					t
				],
				[
					"exit",
					o,
					t
				],
				[
					"enter",
					a,
					t
				]
			]), t.parser.constructs.insideSpan.null, l = ou(l, su(t.parser.constructs.insideSpan.null, e.slice(r + 1, n), t)), l = ou(l, [
				[
					"exit",
					a,
					t
				],
				[
					"enter",
					s,
					t
				],
				[
					"exit",
					s,
					t
				],
				[
					"exit",
					i,
					t
				]
			]), e[n][1].end.offset - e[n][1].start.offset ? (u = 2, l = ou(l, [[
				"enter",
				e[n][1],
				t
			], [
				"exit",
				e[n][1],
				t
			]])) : u = 0, au(e, r - 1, n - r + 3, l), n = r + l.length - u - 2;
			break;
		}
	}
	for (n = -1; ++n < e.length;) e[n][1].type === "attentionSequence" && (e[n][1].type = "data");
	return e;
}
function uu(e, t) {
	let n = this.parser.constructs.attentionMarkers.null, { now: r, sliceSerialize: i, previous: a } = this, o = eu(a) ? tu(a, r(), i) : a, s = Ul(o), c = new ru(o, r(), i), l = Wl(s, c.value.bind(c), o), u;
	return d;
	function d(t) {
		return t === tl.asterisk || tl.underscore, u = t, e.enter("attentionSequence"), f(t);
	}
	function f(a) {
		if (a === u) return e.consume(a), f;
		let s = e.exit("attentionSequence"), c = Ul($l(a) ? iu(a, r(), i) : a), d = ql(l), p = d || Kl(l), m = ql(c), h = m || Kl(c), g = Xl(l), _ = !h || m && (p || g) || n.includes(a), v = !p || d && (h || Jl(c)) || n.includes(o);
		return s._open = !!(u === tl.asterisk ? _ : _ && (Ql(l) || !v)), s._close = !!(u === tl.asterisk ? v : v && (Ql(c) || !_)), t(a);
	}
}
function du(e, t) {
	e.column += t, e.offset += t, e._bufferIndex += t;
}
function fu() {
	return {
		text: {
			[tl.asterisk]: cu,
			[tl.underscore]: cu
		},
		insideSpan: { null: [cu] }
	};
}
//#endregion
//#region node_modules/.pnpm/remark-cjk-friendly@1.2.3_@types+mdast@4.0.4_micromark-util-types@2.0.2_micromark@4.0.2_unified@11.0.5/node_modules/remark-cjk-friendly/dist/index.js
function pu() {
	let e = this.data();
	(e.micromarkExtensions ||= []).push(fu());
}
//#endregion
//#region node_modules/.pnpm/micromark-extension-cjk-friendly-gfm-strikethrough@1.2.3_micromark-util-types@2.0.2_micromark@4.0.2/node_modules/micromark-extension-cjk-friendly-gfm-strikethrough/dist/index.js
function mu(e) {
	let t = (e || {}).singleTilde, n = {
		name: "strikethrough",
		tokenize: i,
		resolveAll: r
	};
	return t ??= !0, {
		text: { [tl.tilde]: n },
		insideSpan: { null: [n] },
		attentionMarkers: { null: [tl.tilde] }
	};
	function r(e, t) {
		let n = -1;
		for (; ++n < e.length;) if (e[n][0] === "enter" && e[n][1].type === "strikethroughSequenceTemporary" && e[n][1]._close) {
			let r = n;
			for (; r--;) if (e[r][0] === "exit" && e[r][1].type === "strikethroughSequenceTemporary" && e[r][1]._open && e[n][1].end.offset - e[n][1].start.offset === e[r][1].end.offset - e[r][1].start.offset) {
				e[n][1].type = "strikethroughSequence", e[r][1].type = "strikethroughSequence";
				let i = {
					type: "strikethrough",
					start: Object.assign({}, e[r][1].start),
					end: Object.assign({}, e[n][1].end)
				}, a = {
					type: "strikethroughText",
					start: Object.assign({}, e[r][1].end),
					end: Object.assign({}, e[n][1].start)
				}, o = [
					[
						"enter",
						i,
						t
					],
					[
						"enter",
						e[r][1],
						t
					],
					[
						"exit",
						e[r][1],
						t
					],
					[
						"enter",
						a,
						t
					]
				], s = t.parser.constructs.insideSpan.null;
				s && au(o, o.length, 0, su(s, e.slice(r + 1, n), t)), au(o, o.length, 0, [
					[
						"exit",
						a,
						t
					],
					[
						"enter",
						e[n][1],
						t
					],
					[
						"exit",
						e[n][1],
						t
					],
					[
						"exit",
						i,
						t
					]
				]), au(e, r - 1, n - r + 3, o), n = r + o.length - 2;
				break;
			}
		}
		for (n = -1; ++n < e.length;) e[n][1].type === "strikethroughSequenceTemporary" && (e[n][1].type = rl.data);
		return e;
	}
	function i(e, n, r) {
		let { now: i, sliceSerialize: a, previous: o } = this, s = eu(o) ? tu(o, i(), a) : o, c = Ul(s), l = new ru(s, i(), a), u = Wl(c, l.value.bind(l), s), d = this.events, f = 0;
		return p;
		function p(t) {
			return tl.tilde, s === tl.tilde && d[d.length - 1][1].type !== rl.characterEscape ? r(t) : (e.enter("strikethroughSequenceTemporary"), m(t));
		}
		function m(o) {
			let c = Ul(s);
			if (o === tl.tilde) return f > 1 ? r(o) : (e.consume(o), f++, m);
			if (f < 2 && !t) return r(o);
			let l = e.exit("strikethroughSequenceTemporary"), d = Ul($l(o) ? iu(o, i(), a) : o), p = ql(u) || Kl(u), h = ql(d) || Kl(d), g = Jl(u) || Yl(c);
			return l._open = !h || d === nl.attentionSideAfter && (p || g), l._close = !p || c === nl.attentionSideAfter && (h || Jl(d)), n(o);
		}
	}
}
//#endregion
//#region node_modules/.pnpm/remark-cjk-friendly-gfm-strikethrough@1.2.3_@types+mdast@4.0.4_micromark-util-types@2.0.2_micromark@4.0.2_unified@11.0.5/node_modules/remark-cjk-friendly-gfm-strikethrough/dist/index.js
function hu(e) {
	let t = this.data();
	(t.micromarkExtensions ||= []).push(mu(e));
}
//#endregion
//#region node_modules/.pnpm/ccount@2.0.1/node_modules/ccount/index.js
function gu(e, t) {
	let n = String(e);
	if (typeof t != "string") throw TypeError("Expected character");
	let r = 0, i = n.indexOf(t);
	for (; i !== -1;) r++, i = n.indexOf(t, i + t.length);
	return r;
}
//#endregion
//#region node_modules/.pnpm/escape-string-regexp@5.0.0/node_modules/escape-string-regexp/index.js
function _u(e) {
	if (typeof e != "string") throw TypeError("Expected a string");
	return e.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
//#endregion
//#region node_modules/.pnpm/mdast-util-find-and-replace@3.0.2/node_modules/mdast-util-find-and-replace/lib/index.js
function vu(e, t, n) {
	let r = mt((n || {}).ignore || []), i = yu(t), a = -1;
	for (; ++a < i.length;) wt(e, "text", o);
	function o(e, t) {
		let n = -1, i;
		for (; ++n < t.length;) {
			let e = t[n], a = i ? i.children : void 0;
			if (r(e, a ? a.indexOf(e) : void 0, i)) return;
			i = e;
		}
		if (i) return s(e, t);
	}
	function s(e, t) {
		let n = t[t.length - 1], r = i[a][0], o = i[a][1], s = 0, c = n.children.indexOf(e), l = !1, u = [];
		r.lastIndex = 0;
		let d = r.exec(e.value);
		for (; d;) {
			let n = d.index, i = {
				index: d.index,
				input: d.input,
				stack: [...t, e]
			}, a = o(...d, i);
			if (typeof a == "string" && (a = a.length > 0 ? {
				type: "text",
				value: a
			} : void 0), a === !1 ? r.lastIndex = n + 1 : (s !== n && u.push({
				type: "text",
				value: e.value.slice(s, n)
			}), Array.isArray(a) ? u.push(...a) : a && u.push(a), s = n + d[0].length, l = !0), !r.global) break;
			d = r.exec(e.value);
		}
		return l ? (s < e.value.length && u.push({
			type: "text",
			value: e.value.slice(s)
		}), n.children.splice(c, 1, ...u)) : u = [e], c + u.length;
	}
}
function yu(e) {
	let t = [];
	if (!Array.isArray(e)) throw TypeError("Expected find and replace tuple or list of tuples");
	let n = !e[0] || Array.isArray(e[0]) ? e : [e], r = -1;
	for (; ++r < n.length;) {
		let e = n[r];
		t.push([bu(e[0]), xu(e[1])]);
	}
	return t;
}
function bu(e) {
	return typeof e == "string" ? new RegExp(_u(e), "g") : e;
}
function xu(e) {
	return typeof e == "function" ? e : function() {
		return e;
	};
}
//#endregion
//#region node_modules/.pnpm/mdast-util-gfm-autolink-literal@2.0.1/node_modules/mdast-util-gfm-autolink-literal/lib/index.js
var Su = "phrasing", Cu = [
	"autolink",
	"link",
	"image",
	"label"
];
function wu() {
	return {
		transforms: [Mu],
		enter: {
			literalAutolink: Eu,
			literalAutolinkEmail: Du,
			literalAutolinkHttp: Du,
			literalAutolinkWww: Du
		},
		exit: {
			literalAutolink: ju,
			literalAutolinkEmail: Au,
			literalAutolinkHttp: Ou,
			literalAutolinkWww: ku
		}
	};
}
function Tu() {
	return { unsafe: [
		{
			character: "@",
			before: "[+\\-.\\w]",
			after: "[\\-.\\w]",
			inConstruct: Su,
			notInConstruct: Cu
		},
		{
			character: ".",
			before: "[Ww]",
			after: "[\\-.\\w]",
			inConstruct: Su,
			notInConstruct: Cu
		},
		{
			character: ":",
			before: "[ps]",
			after: "\\/",
			inConstruct: Su,
			notInConstruct: Cu
		}
	] };
}
function Eu(e) {
	this.enter({
		type: "link",
		title: null,
		url: "",
		children: []
	}, e);
}
function Du(e) {
	this.config.enter.autolinkProtocol.call(this, e);
}
function Ou(e) {
	this.config.exit.autolinkProtocol.call(this, e);
}
function ku(e) {
	this.config.exit.data.call(this, e);
	let t = this.stack[this.stack.length - 1];
	t.type, t.url = "http://" + this.sliceSerialize(e);
}
function Au(e) {
	this.config.exit.autolinkEmail.call(this, e);
}
function ju(e) {
	this.exit(e);
}
function Mu(e) {
	vu(e, [[/(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/gi, Nu], [/(?<=^|\s|\p{P}|\p{S})([-.\w+]+)@([-\w]+(?:\.[-\w]+)+)/gu, Pu]], { ignore: ["link", "linkReference"] });
}
function Nu(e, t, n, r, i) {
	let a = "";
	if (!Lu(i) || (/^w/i.test(t) && (n = t + n, t = "", a = "http://"), !Fu(n))) return !1;
	let o = Iu(n + r);
	if (!o[0]) return !1;
	let s = {
		type: "link",
		title: null,
		url: a + t + o[0],
		children: [{
			type: "text",
			value: t + o[0]
		}]
	};
	return o[1] ? [s, {
		type: "text",
		value: o[1]
	}] : s;
}
function Pu(e, t, n, r) {
	return !Lu(r, !0) || /[-\d_]$/.test(n) ? !1 : {
		type: "link",
		title: null,
		url: "mailto:" + t + "@" + n,
		children: [{
			type: "text",
			value: t + "@" + n
		}]
	};
}
function Fu(e) {
	let t = e.split(".");
	return !(t.length < 2 || t[t.length - 1] && (/_/.test(t[t.length - 1]) || !/[a-zA-Z\d]/.test(t[t.length - 1])) || t[t.length - 2] && (/_/.test(t[t.length - 2]) || !/[a-zA-Z\d]/.test(t[t.length - 2])));
}
function Iu(e) {
	let t = /[!"&'),.:;<>?\]}]+$/.exec(e);
	if (!t) return [e, void 0];
	e = e.slice(0, t.index);
	let n = t[0], r = n.indexOf(")"), i = gu(e, "("), a = gu(e, ")");
	for (; r !== -1 && i > a;) e += n.slice(0, r + 1), n = n.slice(r + 1), r = n.indexOf(")"), a++;
	return [e, n];
}
function Lu(e, t) {
	let n = e.input.charCodeAt(e.index - 1);
	return (e.index === 0 || fl(n) || dl(n)) && (!t || n !== 47);
}
//#endregion
//#region node_modules/.pnpm/micromark-util-normalize-identifier@2.0.1/node_modules/micromark-util-normalize-identifier/index.js
function Ru(e) {
	return e.replace(/[\t\n\r ]+/g, " ").replace(/^ | $/g, "").toLowerCase().toUpperCase();
}
//#endregion
//#region node_modules/.pnpm/mdast-util-gfm-footnote@2.1.0/node_modules/mdast-util-gfm-footnote/lib/index.js
Ju.peek = qu;
function zu() {
	this.buffer();
}
function Bu(e) {
	this.enter({
		type: "footnoteReference",
		identifier: "",
		label: ""
	}, e);
}
function Vu() {
	this.buffer();
}
function Hu(e) {
	this.enter({
		type: "footnoteDefinition",
		identifier: "",
		label: "",
		children: []
	}, e);
}
function Uu(e) {
	let t = this.resume(), n = this.stack[this.stack.length - 1];
	n.type, n.identifier = Ru(this.sliceSerialize(e)).toLowerCase(), n.label = t;
}
function Wu(e) {
	this.exit(e);
}
function Gu(e) {
	let t = this.resume(), n = this.stack[this.stack.length - 1];
	n.type, n.identifier = Ru(this.sliceSerialize(e)).toLowerCase(), n.label = t;
}
function Ku(e) {
	this.exit(e);
}
function qu() {
	return "[";
}
function Ju(e, t, n, r) {
	let i = n.createTracker(r), a = i.move("[^"), o = n.enter("footnoteReference"), s = n.enter("reference");
	return a += i.move(n.safe(n.associationId(e), {
		after: "]",
		before: a
	})), s(), o(), a += i.move("]"), a;
}
function Yu() {
	return {
		enter: {
			gfmFootnoteCallString: zu,
			gfmFootnoteCall: Bu,
			gfmFootnoteDefinitionLabelString: Vu,
			gfmFootnoteDefinition: Hu
		},
		exit: {
			gfmFootnoteCallString: Uu,
			gfmFootnoteCall: Wu,
			gfmFootnoteDefinitionLabelString: Gu,
			gfmFootnoteDefinition: Ku
		}
	};
}
function Xu(e) {
	let t = !1;
	return e && e.firstLineBlank && (t = !0), {
		handlers: {
			footnoteDefinition: n,
			footnoteReference: Ju
		},
		unsafe: [{
			character: "[",
			inConstruct: [
				"label",
				"phrasing",
				"reference"
			]
		}]
	};
	function n(e, n, r, i) {
		let a = r.createTracker(i), o = a.move("[^"), s = r.enter("footnoteDefinition"), c = r.enter("label");
		return o += a.move(r.safe(r.associationId(e), {
			before: o,
			after: "]"
		})), c(), o += a.move("]:"), e.children && e.children.length > 0 && (a.shift(4), o += a.move((t ? "\n" : " ") + r.indentLines(r.containerFlow(e, a.current()), t ? Qu : Zu))), s(), o;
	}
}
function Zu(e, t, n) {
	return t === 0 ? e : Qu(e, t, n);
}
function Qu(e, t, n) {
	return (n ? "" : "    ") + e;
}
//#endregion
//#region node_modules/.pnpm/mdast-util-gfm-strikethrough@2.0.0/node_modules/mdast-util-gfm-strikethrough/lib/index.js
var $u = [
	"autolink",
	"destinationLiteral",
	"destinationRaw",
	"reference",
	"titleQuote",
	"titleApostrophe"
];
id.peek = ad;
function ed() {
	return {
		canContainEols: ["delete"],
		enter: { strikethrough: nd },
		exit: { strikethrough: rd }
	};
}
function td() {
	return {
		unsafe: [{
			character: "~",
			inConstruct: "phrasing",
			notInConstruct: $u
		}],
		handlers: { delete: id }
	};
}
function nd(e) {
	this.enter({
		type: "delete",
		children: []
	}, e);
}
function rd(e) {
	this.exit(e);
}
function id(e, t, n, r) {
	let i = n.createTracker(r), a = n.enter("strikethrough"), o = i.move("~~");
	return o += n.containerPhrasing(e, {
		...i.current(),
		before: o,
		after: "~"
	}), o += i.move("~~"), a(), o;
}
function ad() {
	return "~";
}
//#endregion
//#region node_modules/.pnpm/markdown-table@3.0.4/node_modules/markdown-table/index.js
function od(e) {
	return e.length;
}
function sd(e, t) {
	let n = t || {}, r = (n.align || []).concat(), i = n.stringLength || od, a = [], o = [], s = [], c = [], l = 0, u = -1;
	for (; ++u < e.length;) {
		let t = [], r = [], a = -1;
		for (e[u].length > l && (l = e[u].length); ++a < e[u].length;) {
			let o = cd(e[u][a]);
			if (n.alignDelimiters !== !1) {
				let e = i(o);
				r[a] = e, (c[a] === void 0 || e > c[a]) && (c[a] = e);
			}
			t.push(o);
		}
		o[u] = t, s[u] = r;
	}
	let d = -1;
	if (typeof r == "object" && "length" in r) for (; ++d < l;) a[d] = ld(r[d]);
	else {
		let e = ld(r);
		for (; ++d < l;) a[d] = e;
	}
	d = -1;
	let f = [], p = [];
	for (; ++d < l;) {
		let e = a[d], t = "", r = "";
		e === 99 ? (t = ":", r = ":") : e === 108 ? t = ":" : e === 114 && (r = ":");
		let i = n.alignDelimiters === !1 ? 1 : Math.max(1, c[d] - t.length - r.length), o = t + "-".repeat(i) + r;
		n.alignDelimiters !== !1 && (i = t.length + i + r.length, i > c[d] && (c[d] = i), p[d] = i), f[d] = o;
	}
	o.splice(1, 0, f), s.splice(1, 0, p), u = -1;
	let m = [];
	for (; ++u < o.length;) {
		let e = o[u], t = s[u];
		d = -1;
		let r = [];
		for (; ++d < l;) {
			let i = e[d] || "", o = "", s = "";
			if (n.alignDelimiters !== !1) {
				let e = c[d] - (t[d] || 0), n = a[d];
				n === 114 ? o = " ".repeat(e) : n === 99 ? e % 2 ? (o = " ".repeat(e / 2 + .5), s = " ".repeat(e / 2 - .5)) : (o = " ".repeat(e / 2), s = o) : s = " ".repeat(e);
			}
			n.delimiterStart !== !1 && !d && r.push("|"), n.padding !== !1 && !(n.alignDelimiters === !1 && i === "") && (n.delimiterStart !== !1 || d) && r.push(" "), n.alignDelimiters !== !1 && r.push(o), r.push(i), n.alignDelimiters !== !1 && r.push(s), n.padding !== !1 && r.push(" "), (n.delimiterEnd !== !1 || d !== l - 1) && r.push("|");
		}
		m.push(n.delimiterEnd === !1 ? r.join("").replace(/ +$/, "") : r.join(""));
	}
	return m.join("\n");
}
function cd(e) {
	return e == null ? "" : String(e);
}
function ld(e) {
	let t = typeof e == "string" ? e.codePointAt(0) : 0;
	return t === 67 || t === 99 ? 99 : t === 76 || t === 108 ? 108 : t === 82 || t === 114 ? 114 : 0;
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/blockquote.js
function ud(e, t, n, r) {
	let i = n.enter("blockquote"), a = n.createTracker(r);
	a.move("> "), a.shift(2);
	let o = n.indentLines(n.containerFlow(e, a.current()), dd);
	return i(), o;
}
function dd(e, t, n) {
	return ">" + (n ? "" : " ") + e;
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/pattern-in-scope.js
function fd(e, t) {
	return pd(e, t.inConstruct, !0) && !pd(e, t.notInConstruct, !1);
}
function pd(e, t, n) {
	if (typeof t == "string" && (t = [t]), !t || t.length === 0) return n;
	let r = -1;
	for (; ++r < t.length;) if (e.includes(t[r])) return !0;
	return !1;
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/break.js
function md(e, t, n, r) {
	let i = -1;
	for (; ++i < n.unsafe.length;) if (n.unsafe[i].character === "\n" && fd(n.stack, n.unsafe[i])) return /[ \t]/.test(r.before) ? "" : " ";
	return "\\\n";
}
//#endregion
//#region node_modules/.pnpm/longest-streak@3.1.0/node_modules/longest-streak/index.js
function hd(e, t) {
	let n = String(e), r = n.indexOf(t), i = r, a = 0, o = 0;
	if (typeof t != "string") throw TypeError("Expected substring");
	for (; r !== -1;) r === i ? ++a > o && (o = a) : a = 1, i = r + t.length, r = n.indexOf(t, i);
	return o;
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/format-code-as-indented.js
function gd(e, t) {
	return !!(t.options.fences === !1 && e.value && !e.lang && /[^ \r\n]/.test(e.value) && !/^[\t ]*(?:[\r\n]|$)|(?:^|[\r\n])[\t ]*$/.test(e.value));
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-fence.js
function _d(e) {
	let t = e.options.fence || "`";
	if (t !== "`" && t !== "~") throw Error("Cannot serialize code with `" + t + "` for `options.fence`, expected `` ` `` or `~`");
	return t;
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/code.js
function vd(e, t, n, r) {
	let i = _d(n), a = e.value || "", o = i === "`" ? "GraveAccent" : "Tilde";
	if (gd(e, n)) {
		let e = n.enter("codeIndented"), t = n.indentLines(a, yd);
		return e(), t;
	}
	let s = n.createTracker(r), c = i.repeat(Math.max(hd(a, i) + 1, 3)), l = n.enter("codeFenced"), u = s.move(c);
	if (e.lang) {
		let t = n.enter(`codeFencedLang${o}`);
		u += s.move(n.safe(e.lang, {
			before: u,
			after: " ",
			encode: ["`"],
			...s.current()
		})), t();
	}
	if (e.lang && e.meta) {
		let t = n.enter(`codeFencedMeta${o}`);
		u += s.move(" "), u += s.move(n.safe(e.meta, {
			before: u,
			after: "\n",
			encode: ["`"],
			...s.current()
		})), t();
	}
	return u += s.move("\n"), a && (u += s.move(a + "\n")), u += s.move(c), l(), u;
}
function yd(e, t, n) {
	return (n ? "" : "    ") + e;
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-quote.js
function bd(e) {
	let t = e.options.quote || "\"";
	if (t !== "\"" && t !== "'") throw Error("Cannot serialize title with `" + t + "` for `options.quote`, expected `\"`, or `'`");
	return t;
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/definition.js
function xd(e, t, n, r) {
	let i = bd(n), a = i === "\"" ? "Quote" : "Apostrophe", o = n.enter("definition"), s = n.enter("label"), c = n.createTracker(r), l = c.move("[");
	return l += c.move(n.safe(n.associationId(e), {
		before: l,
		after: "]",
		...c.current()
	})), l += c.move("]: "), s(), !e.url || /[\0- \u007F]/.test(e.url) ? (s = n.enter("destinationLiteral"), l += c.move("<"), l += c.move(n.safe(e.url, {
		before: l,
		after: ">",
		...c.current()
	})), l += c.move(">")) : (s = n.enter("destinationRaw"), l += c.move(n.safe(e.url, {
		before: l,
		after: e.title ? " " : "\n",
		...c.current()
	}))), s(), e.title && (s = n.enter(`title${a}`), l += c.move(" " + i), l += c.move(n.safe(e.title, {
		before: l,
		after: i,
		...c.current()
	})), l += c.move(i), s()), o(), l;
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-emphasis.js
function Sd(e) {
	let t = e.options.emphasis || "*";
	if (t !== "*" && t !== "_") throw Error("Cannot serialize emphasis with `" + t + "` for `options.emphasis`, expected `*`, or `_`");
	return t;
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/encode-character-reference.js
function Cd(e) {
	return "&#x" + e.toString(16).toUpperCase() + ";";
}
//#endregion
//#region node_modules/.pnpm/micromark-util-classify-character@2.0.1/node_modules/micromark-util-classify-character/index.js
function wd(e) {
	if (e === null || K(e) || fl(e)) return 1;
	if (dl(e)) return 2;
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/encode-info.js
function Td(e, t, n) {
	let r = wd(e), i = wd(t);
	return r === void 0 ? i === void 0 ? n === "_" ? {
		inside: !0,
		outside: !0
	} : {
		inside: !1,
		outside: !1
	} : i === 1 ? {
		inside: !0,
		outside: !0
	} : {
		inside: !1,
		outside: !0
	} : r === 1 ? i === void 0 ? {
		inside: !1,
		outside: !1
	} : i === 1 ? {
		inside: !0,
		outside: !0
	} : {
		inside: !1,
		outside: !1
	} : i === void 0 ? {
		inside: !1,
		outside: !1
	} : i === 1 ? {
		inside: !0,
		outside: !1
	} : {
		inside: !1,
		outside: !1
	};
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/emphasis.js
Ed.peek = Dd;
function Ed(e, t, n, r) {
	let i = Sd(n), a = n.enter("emphasis"), o = n.createTracker(r), s = o.move(i), c = o.move(n.containerPhrasing(e, {
		after: i,
		before: s,
		...o.current()
	})), l = c.charCodeAt(0), u = Td(r.before.charCodeAt(r.before.length - 1), l, i);
	u.inside && (c = Cd(l) + c.slice(1));
	let d = c.charCodeAt(c.length - 1), f = Td(r.after.charCodeAt(0), d, i);
	f.inside && (c = c.slice(0, -1) + Cd(d));
	let p = o.move(i);
	return a(), n.attentionEncodeSurroundingInfo = {
		after: f.outside,
		before: u.outside
	}, s + c + p;
}
function Dd(e, t, n) {
	return n.options.emphasis || "*";
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-string@4.0.0/node_modules/mdast-util-to-string/lib/index.js
var Od = {};
function kd(e, t) {
	let n = t || Od;
	return Ad(e, typeof n.includeImageAlt == "boolean" ? n.includeImageAlt : !0, typeof n.includeHtml == "boolean" ? n.includeHtml : !0);
}
function Ad(e, t, n) {
	if (Md(e)) {
		if ("value" in e) return e.type === "html" && !n ? "" : e.value;
		if (t && "alt" in e && e.alt) return e.alt;
		if ("children" in e) return jd(e.children, t, n);
	}
	return Array.isArray(e) ? jd(e, t, n) : "";
}
function jd(e, t, n) {
	let r = [], i = -1;
	for (; ++i < e.length;) r[i] = Ad(e[i], t, n);
	return r.join("");
}
function Md(e) {
	return !!(e && typeof e == "object");
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/format-heading-as-setext.js
function Nd(e, t) {
	let n = !1;
	return Et(e, function(e) {
		if ("value" in e && /\r?\n|\r/.test(e.value) || e.type === "break") return n = !0, !1;
	}), !!((!e.depth || e.depth < 3) && kd(e) && (t.options.setext || n));
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/heading.js
function Pd(e, t, n, r) {
	let i = Math.max(Math.min(6, e.depth || 1), 1), a = n.createTracker(r);
	if (Nd(e, n)) {
		let t = n.enter("headingSetext"), r = n.enter("phrasing"), o = n.containerPhrasing(e, {
			...a.current(),
			before: "\n",
			after: "\n"
		});
		return r(), t(), o + "\n" + (i === 1 ? "=" : "-").repeat(o.length - (Math.max(o.lastIndexOf("\r"), o.lastIndexOf("\n")) + 1));
	}
	let o = "#".repeat(i), s = n.enter("headingAtx"), c = n.enter("phrasing");
	a.move(o + " ");
	let l = n.containerPhrasing(e, {
		before: "# ",
		after: "\n",
		...a.current()
	});
	return /^[\t ]/.test(l) && (l = Cd(l.charCodeAt(0)) + l.slice(1)), l = l ? o + " " + l : o, n.options.closeAtx && (l += " " + o), c(), s(), l;
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/html.js
Fd.peek = Id;
function Fd(e) {
	return e.value || "";
}
function Id() {
	return "<";
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/image.js
Ld.peek = Rd;
function Ld(e, t, n, r) {
	let i = bd(n), a = i === "\"" ? "Quote" : "Apostrophe", o = n.enter("image"), s = n.enter("label"), c = n.createTracker(r), l = c.move("![");
	return l += c.move(n.safe(e.alt, {
		before: l,
		after: "]",
		...c.current()
	})), l += c.move("]("), s(), !e.url && e.title || /[\0- \u007F]/.test(e.url) ? (s = n.enter("destinationLiteral"), l += c.move("<"), l += c.move(n.safe(e.url, {
		before: l,
		after: ">",
		...c.current()
	})), l += c.move(">")) : (s = n.enter("destinationRaw"), l += c.move(n.safe(e.url, {
		before: l,
		after: e.title ? " " : ")",
		...c.current()
	}))), s(), e.title && (s = n.enter(`title${a}`), l += c.move(" " + i), l += c.move(n.safe(e.title, {
		before: l,
		after: i,
		...c.current()
	})), l += c.move(i), s()), l += c.move(")"), o(), l;
}
function Rd() {
	return "!";
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/image-reference.js
zd.peek = Bd;
function zd(e, t, n, r) {
	let i = e.referenceType, a = n.enter("imageReference"), o = n.enter("label"), s = n.createTracker(r), c = s.move("!["), l = n.safe(e.alt, {
		before: c,
		after: "]",
		...s.current()
	});
	c += s.move(l + "]["), o();
	let u = n.stack;
	n.stack = [], o = n.enter("reference");
	let d = n.safe(n.associationId(e), {
		before: c,
		after: "]",
		...s.current()
	});
	return o(), n.stack = u, a(), i === "full" || !l || l !== d ? c += s.move(d + "]") : i === "shortcut" ? c = c.slice(0, -1) : c += s.move("]"), c;
}
function Bd() {
	return "!";
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/inline-code.js
Vd.peek = Hd;
function Vd(e, t, n) {
	let r = e.value || "", i = "`", a = -1;
	for (; RegExp("(^|[^`])" + i + "([^`]|$)").test(r);) i += "`";
	for (/[^ \r\n]/.test(r) && (/^[ \r\n]/.test(r) && /[ \r\n]$/.test(r) || /^`|`$/.test(r)) && (r = " " + r + " "); ++a < n.unsafe.length;) {
		let e = n.unsafe[a], t = n.compilePattern(e), i;
		if (e.atBreak) for (; i = t.exec(r);) {
			let e = i.index;
			r.charCodeAt(e) === 10 && r.charCodeAt(e - 1) === 13 && e--, r = r.slice(0, e) + " " + r.slice(i.index + 1);
		}
	}
	return i + r + i;
}
function Hd() {
	return "`";
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/format-link-as-autolink.js
function Ud(e, t) {
	let n = kd(e);
	return !!(!t.options.resourceLink && e.url && !e.title && e.children && e.children.length === 1 && e.children[0].type === "text" && (n === e.url || "mailto:" + n === e.url) && /^[a-z][a-z+.-]+:/i.test(e.url) && !/[\0- <>\u007F]/.test(e.url));
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/link.js
Wd.peek = Gd;
function Wd(e, t, n, r) {
	let i = bd(n), a = i === "\"" ? "Quote" : "Apostrophe", o = n.createTracker(r), s, c;
	if (Ud(e, n)) {
		let t = n.stack;
		n.stack = [], s = n.enter("autolink");
		let r = o.move("<");
		return r += o.move(n.containerPhrasing(e, {
			before: r,
			after: ">",
			...o.current()
		})), r += o.move(">"), s(), n.stack = t, r;
	}
	s = n.enter("link"), c = n.enter("label");
	let l = o.move("[");
	return l += o.move(n.containerPhrasing(e, {
		before: l,
		after: "](",
		...o.current()
	})), l += o.move("]("), c(), !e.url && e.title || /[\0- \u007F]/.test(e.url) ? (c = n.enter("destinationLiteral"), l += o.move("<"), l += o.move(n.safe(e.url, {
		before: l,
		after: ">",
		...o.current()
	})), l += o.move(">")) : (c = n.enter("destinationRaw"), l += o.move(n.safe(e.url, {
		before: l,
		after: e.title ? " " : ")",
		...o.current()
	}))), c(), e.title && (c = n.enter(`title${a}`), l += o.move(" " + i), l += o.move(n.safe(e.title, {
		before: l,
		after: i,
		...o.current()
	})), l += o.move(i), c()), l += o.move(")"), s(), l;
}
function Gd(e, t, n) {
	return Ud(e, n) ? "<" : "[";
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/link-reference.js
Kd.peek = qd;
function Kd(e, t, n, r) {
	let i = e.referenceType, a = n.enter("linkReference"), o = n.enter("label"), s = n.createTracker(r), c = s.move("["), l = n.containerPhrasing(e, {
		before: c,
		after: "]",
		...s.current()
	});
	c += s.move(l + "]["), o();
	let u = n.stack;
	n.stack = [], o = n.enter("reference");
	let d = n.safe(n.associationId(e), {
		before: c,
		after: "]",
		...s.current()
	});
	return o(), n.stack = u, a(), i === "full" || !l || l !== d ? c += s.move(d + "]") : i === "shortcut" ? c = c.slice(0, -1) : c += s.move("]"), c;
}
function qd() {
	return "[";
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-bullet.js
function Jd(e) {
	let t = e.options.bullet || "*";
	if (t !== "*" && t !== "+" && t !== "-") throw Error("Cannot serialize items with `" + t + "` for `options.bullet`, expected `*`, `+`, or `-`");
	return t;
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-bullet-other.js
function Yd(e) {
	let t = Jd(e), n = e.options.bulletOther;
	if (!n) return t === "*" ? "-" : "*";
	if (n !== "*" && n !== "+" && n !== "-") throw Error("Cannot serialize items with `" + n + "` for `options.bulletOther`, expected `*`, `+`, or `-`");
	if (n === t) throw Error("Expected `bullet` (`" + t + "`) and `bulletOther` (`" + n + "`) to be different");
	return n;
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-bullet-ordered.js
function Xd(e) {
	let t = e.options.bulletOrdered || ".";
	if (t !== "." && t !== ")") throw Error("Cannot serialize items with `" + t + "` for `options.bulletOrdered`, expected `.` or `)`");
	return t;
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-rule.js
function Zd(e) {
	let t = e.options.rule || "*";
	if (t !== "*" && t !== "-" && t !== "_") throw Error("Cannot serialize rules with `" + t + "` for `options.rule`, expected `*`, `-`, or `_`");
	return t;
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/list.js
function Qd(e, t, n, r) {
	let i = n.enter("list"), a = n.bulletCurrent, o = e.ordered ? Xd(n) : Jd(n), s = e.ordered ? o === "." ? ")" : "." : Yd(n), c = t && n.bulletLastUsed ? o === n.bulletLastUsed : !1;
	if (!e.ordered) {
		let t = e.children ? e.children[0] : void 0;
		if ((o === "*" || o === "-") && t && (!t.children || !t.children[0]) && n.stack[n.stack.length - 1] === "list" && n.stack[n.stack.length - 2] === "listItem" && n.stack[n.stack.length - 3] === "list" && n.stack[n.stack.length - 4] === "listItem" && n.indexStack[n.indexStack.length - 1] === 0 && n.indexStack[n.indexStack.length - 2] === 0 && n.indexStack[n.indexStack.length - 3] === 0 && (c = !0), Zd(n) === o && t) {
			let t = -1;
			for (; ++t < e.children.length;) {
				let n = e.children[t];
				if (n && n.type === "listItem" && n.children && n.children[0] && n.children[0].type === "thematicBreak") {
					c = !0;
					break;
				}
			}
		}
	}
	c && (o = s), n.bulletCurrent = o;
	let l = n.containerFlow(e, r);
	return n.bulletLastUsed = o, n.bulletCurrent = a, i(), l;
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-list-item-indent.js
function $d(e) {
	let t = e.options.listItemIndent || "one";
	if (t !== "tab" && t !== "one" && t !== "mixed") throw Error("Cannot serialize items with `" + t + "` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`");
	return t;
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/list-item.js
function ef(e, t, n, r) {
	let i = $d(n), a = n.bulletCurrent || Jd(n);
	t && t.type === "list" && t.ordered && (a = (typeof t.start == "number" && t.start > -1 ? t.start : 1) + (n.options.incrementListMarker === !1 ? 0 : t.children.indexOf(e)) + a);
	let o = a.length + 1;
	(i === "tab" || i === "mixed" && (t && t.type === "list" && t.spread || e.spread)) && (o = Math.ceil(o / 4) * 4);
	let s = n.createTracker(r);
	s.move(a + " ".repeat(o - a.length)), s.shift(o);
	let c = n.enter("listItem"), l = n.indentLines(n.containerFlow(e, s.current()), u);
	return c(), l;
	function u(e, t, n) {
		return t ? (n ? "" : " ".repeat(o)) + e : (n ? a : a + " ".repeat(o - a.length)) + e;
	}
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/paragraph.js
function tf(e, t, n, r) {
	let i = n.enter("paragraph"), a = n.enter("phrasing"), o = n.containerPhrasing(e, r);
	return a(), i(), o;
}
//#endregion
//#region node_modules/.pnpm/mdast-util-phrasing@4.1.0/node_modules/mdast-util-phrasing/lib/index.js
var nf = mt([
	"break",
	"delete",
	"emphasis",
	"footnote",
	"footnoteReference",
	"image",
	"imageReference",
	"inlineCode",
	"inlineMath",
	"link",
	"linkReference",
	"mdxJsxTextElement",
	"mdxTextExpression",
	"strong",
	"text",
	"textDirective"
]);
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/root.js
function rf(e, t, n, r) {
	return (e.children.some(function(e) {
		return nf(e);
	}) ? n.containerPhrasing : n.containerFlow).call(n, e, r);
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-strong.js
function af(e) {
	let t = e.options.strong || "*";
	if (t !== "*" && t !== "_") throw Error("Cannot serialize strong with `" + t + "` for `options.strong`, expected `*`, or `_`");
	return t;
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/strong.js
of.peek = sf;
function of(e, t, n, r) {
	let i = af(n), a = n.enter("strong"), o = n.createTracker(r), s = o.move(i + i), c = o.move(n.containerPhrasing(e, {
		after: i,
		before: s,
		...o.current()
	})), l = c.charCodeAt(0), u = Td(r.before.charCodeAt(r.before.length - 1), l, i);
	u.inside && (c = Cd(l) + c.slice(1));
	let d = c.charCodeAt(c.length - 1), f = Td(r.after.charCodeAt(0), d, i);
	f.inside && (c = c.slice(0, -1) + Cd(d));
	let p = o.move(i + i);
	return a(), n.attentionEncodeSurroundingInfo = {
		after: f.outside,
		before: u.outside
	}, s + c + p;
}
function sf(e, t, n) {
	return n.options.strong || "*";
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/text.js
function cf(e, t, n, r) {
	return n.safe(e.value, r);
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-rule-repetition.js
function lf(e) {
	let t = e.options.ruleRepetition || 3;
	if (t < 3) throw Error("Cannot serialize rules with repetition `" + t + "` for `options.ruleRepetition`, expected `3` or more");
	return t;
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/thematic-break.js
function uf(e, t, n) {
	let r = (Zd(n) + (n.options.ruleSpaces ? " " : "")).repeat(lf(n));
	return n.options.ruleSpaces ? r.slice(0, -1) : r;
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/index.js
var df = {
	blockquote: ud,
	break: md,
	code: vd,
	definition: xd,
	emphasis: Ed,
	hardBreak: md,
	heading: Pd,
	html: Fd,
	image: Ld,
	imageReference: zd,
	inlineCode: Vd,
	link: Wd,
	linkReference: Kd,
	list: Qd,
	listItem: ef,
	paragraph: tf,
	root: rf,
	strong: of,
	text: cf,
	thematicBreak: uf
}, ff = document.createElement("i");
function pf(e) {
	let t = "&" + e + ";";
	ff.innerHTML = t;
	let n = ff.textContent;
	return n.charCodeAt(n.length - 1) === 59 && e !== "semi" || n === t ? !1 : n;
}
//#endregion
//#region node_modules/.pnpm/micromark-util-decode-numeric-character-reference@2.0.2/node_modules/micromark-util-decode-numeric-character-reference/index.js
function mf(e, t) {
	let n = Number.parseInt(e, t);
	return n < 9 || n === 11 || n > 13 && n < 32 || n > 126 && n < 160 || n > 55295 && n < 57344 || n > 64975 && n < 65008 || (n & 65535) == 65535 || (n & 65535) == 65534 || n > 1114111 ? "�" : String.fromCodePoint(n);
}
//#endregion
//#region node_modules/.pnpm/micromark-util-decode-string@2.0.1/node_modules/micromark-util-decode-string/index.js
var hf = /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;
function gf(e) {
	return e.replace(hf, _f);
}
function _f(e, t, n) {
	if (t) return t;
	if (n.charCodeAt(0) === 35) {
		let e = n.charCodeAt(1), t = e === 120 || e === 88;
		return mf(n.slice(t ? 2 : 1), t ? 16 : 10);
	}
	return pf(n) || e;
}
//#endregion
//#region node_modules/.pnpm/mdast-util-gfm-table@2.0.0/node_modules/mdast-util-gfm-table/lib/index.js
function vf() {
	return {
		enter: {
			table: yf,
			tableData: Cf,
			tableHeader: Cf,
			tableRow: xf
		},
		exit: {
			codeText: wf,
			table: bf,
			tableData: Sf,
			tableHeader: Sf,
			tableRow: Sf
		}
	};
}
function yf(e) {
	let t = e._align;
	this.enter({
		type: "table",
		align: t.map(function(e) {
			return e === "none" ? null : e;
		}),
		children: []
	}, e), this.data.inTable = !0;
}
function bf(e) {
	this.exit(e), this.data.inTable = void 0;
}
function xf(e) {
	this.enter({
		type: "tableRow",
		children: []
	}, e);
}
function Sf(e) {
	this.exit(e);
}
function Cf(e) {
	this.enter({
		type: "tableCell",
		children: []
	}, e);
}
function wf(e) {
	let t = this.resume();
	this.data.inTable && (t = t.replace(/\\([\\|])/g, Tf));
	let n = this.stack[this.stack.length - 1];
	n.type, n.value = t, this.exit(e);
}
function Tf(e, t) {
	return t === "|" ? t : e;
}
function Ef(e) {
	let t = e || {}, n = t.tableCellPadding, r = t.tablePipeAlign, i = t.stringLength, a = n ? " " : "|";
	return {
		unsafe: [
			{
				character: "\r",
				inConstruct: "tableCell"
			},
			{
				character: "\n",
				inConstruct: "tableCell"
			},
			{
				atBreak: !0,
				character: "|",
				after: "[	 :-]"
			},
			{
				character: "|",
				inConstruct: "tableCell"
			},
			{
				atBreak: !0,
				character: ":",
				after: "-"
			},
			{
				atBreak: !0,
				character: "-",
				after: "[:|-]"
			}
		],
		handlers: {
			inlineCode: f,
			table: o,
			tableCell: c,
			tableRow: s
		}
	};
	function o(e, t, n, r) {
		return l(u(e, n, r), e.align);
	}
	function s(e, t, n, r) {
		let i = l([d(e, n, r)]);
		return i.slice(0, i.indexOf("\n"));
	}
	function c(e, t, n, r) {
		let i = n.enter("tableCell"), o = n.enter("phrasing"), s = n.containerPhrasing(e, {
			...r,
			before: a,
			after: a
		});
		return o(), i(), s;
	}
	function l(e, t) {
		return sd(e, {
			align: t,
			alignDelimiters: r,
			padding: n,
			stringLength: i
		});
	}
	function u(e, t, n) {
		let r = e.children, i = -1, a = [], o = t.enter("table");
		for (; ++i < r.length;) a[i] = d(r[i], t, n);
		return o(), a;
	}
	function d(e, t, n) {
		let r = e.children, i = -1, a = [], o = t.enter("tableRow");
		for (; ++i < r.length;) a[i] = c(r[i], e, t, n);
		return o(), a;
	}
	function f(e, t, n) {
		let r = df.inlineCode(e, t, n);
		return n.stack.includes("tableCell") && (r = r.replace(/\|/g, "\\$&")), r;
	}
}
//#endregion
//#region node_modules/.pnpm/mdast-util-gfm-task-list-item@2.0.0/node_modules/mdast-util-gfm-task-list-item/lib/index.js
function Df() {
	return { exit: {
		taskListCheckValueChecked: kf,
		taskListCheckValueUnchecked: kf,
		paragraph: Af
	} };
}
function Of() {
	return {
		unsafe: [{
			atBreak: !0,
			character: "-",
			after: "[:|-]"
		}],
		handlers: { listItem: jf }
	};
}
function kf(e) {
	let t = this.stack[this.stack.length - 2];
	t.type, t.checked = e.type === "taskListCheckValueChecked";
}
function Af(e) {
	let t = this.stack[this.stack.length - 2];
	if (t && t.type === "listItem" && typeof t.checked == "boolean") {
		let e = this.stack[this.stack.length - 1];
		e.type;
		let n = e.children[0];
		if (n && n.type === "text") {
			let r = t.children, i = -1, a;
			for (; ++i < r.length;) {
				let e = r[i];
				if (e.type === "paragraph") {
					a = e;
					break;
				}
			}
			a === e && (n.value = n.value.slice(1), n.value.length === 0 ? e.children.shift() : e.position && n.position && typeof n.position.start.offset == "number" && (n.position.start.column++, n.position.start.offset++, e.position.start = Object.assign({}, n.position.start)));
		}
	}
	this.exit(e);
}
function jf(e, t, n, r) {
	let i = e.children[0], a = typeof e.checked == "boolean" && i && i.type === "paragraph", o = "[" + (e.checked ? "x" : " ") + "] ", s = n.createTracker(r);
	a && s.move(o);
	let c = df.listItem(e, t, n, {
		...r,
		...s.current()
	});
	return a && (c = c.replace(/^(?:[*+-]|\d+\.)([\r\n]| {1,3})/, l)), c;
	function l(e) {
		return e + o;
	}
}
//#endregion
//#region node_modules/.pnpm/mdast-util-gfm@3.1.0/node_modules/mdast-util-gfm/lib/index.js
function Mf() {
	return [
		wu(),
		Yu(),
		ed(),
		vf(),
		Df()
	];
}
function Nf(e) {
	return { extensions: [
		Tu(),
		Xu(e),
		td(),
		Ef(e),
		Of()
	] };
}
//#endregion
//#region node_modules/.pnpm/micromark-util-combine-extensions@2.0.1/node_modules/micromark-util-combine-extensions/index.js
var Pf = {}.hasOwnProperty;
function Ff(e) {
	let t = {}, n = -1;
	for (; ++n < e.length;) If(t, e[n]);
	return t;
}
function If(e, t) {
	let n;
	for (n in t) {
		let r = (Pf.call(e, n) ? e[n] : void 0) || (e[n] = {}), i = t[n], a;
		if (i) for (a in i) {
			Pf.call(r, a) || (r[a] = []);
			let e = i[a];
			Lf(r[a], Array.isArray(e) ? e : e ? [e] : []);
		}
	}
}
function Lf(e, t) {
	let n = -1, r = [];
	for (; ++n < t.length;) (t[n].add === "after" ? e : r).push(t[n]);
	au(e, 0, 0, r);
}
//#endregion
//#region node_modules/.pnpm/micromark-extension-gfm-autolink-literal@2.1.0/node_modules/micromark-extension-gfm-autolink-literal/lib/syntax.js
var Rf = {
	tokenize: Qf,
	partial: !0
}, zf = {
	tokenize: $f,
	partial: !0
}, Bf = {
	tokenize: ep,
	partial: !0
}, Vf = {
	tokenize: tp,
	partial: !0
}, Hf = {
	tokenize: np,
	partial: !0
}, Uf = {
	name: "wwwAutolink",
	tokenize: Xf,
	previous: rp
}, Wf = {
	name: "protocolAutolink",
	tokenize: Zf,
	previous: ip
}, Gf = {
	name: "emailAutolink",
	tokenize: Yf,
	previous: ap
}, Kf = {};
function qf() {
	return { text: Kf };
}
for (var Jf = 48; Jf < 123;) Kf[Jf] = Gf, Jf++, Jf === 58 ? Jf = 65 : Jf === 91 && (Jf = 97);
Kf[43] = Gf, Kf[45] = Gf, Kf[46] = Gf, Kf[95] = Gf, Kf[72] = [Gf, Wf], Kf[104] = [Gf, Wf], Kf[87] = [Gf, Uf], Kf[119] = [Gf, Uf];
function Yf(e, t, n) {
	let r = this, i, a;
	return o;
	function o(t) {
		return !op(t) || !ap.call(r, r.previous) || sp(r.events) ? n(t) : (e.enter("literalAutolink"), e.enter("literalAutolinkEmail"), s(t));
	}
	function s(t) {
		return op(t) ? (e.consume(t), s) : t === 64 ? (e.consume(t), c) : n(t);
	}
	function c(t) {
		return t === 46 ? e.check(Hf, u, l)(t) : t === 45 || t === 95 || al(t) ? (a = !0, e.consume(t), c) : u(t);
	}
	function l(t) {
		return e.consume(t), i = !0, c;
	}
	function u(o) {
		return a && i && il(r.previous) ? (e.exit("literalAutolinkEmail"), e.exit("literalAutolink"), t(o)) : n(o);
	}
}
function Xf(e, t, n) {
	let r = this;
	return i;
	function i(t) {
		return t !== 87 && t !== 119 || !rp.call(r, r.previous) || sp(r.events) ? n(t) : (e.enter("literalAutolink"), e.enter("literalAutolinkWww"), e.check(Rf, e.attempt(zf, e.attempt(Bf, a), n), n)(t));
	}
	function a(n) {
		return e.exit("literalAutolinkWww"), e.exit("literalAutolink"), t(n);
	}
}
function Zf(e, t, n) {
	let r = this, i = "", a = !1;
	return o;
	function o(t) {
		return (t === 72 || t === 104) && ip.call(r, r.previous) && !sp(r.events) ? (e.enter("literalAutolink"), e.enter("literalAutolinkHttp"), i += String.fromCodePoint(t), e.consume(t), s) : n(t);
	}
	function s(t) {
		if (il(t) && i.length < 5) return i += String.fromCodePoint(t), e.consume(t), s;
		if (t === 58) {
			let n = i.toLowerCase();
			if (n === "http" || n === "https") return e.consume(t), c;
		}
		return n(t);
	}
	function c(t) {
		return t === 47 ? (e.consume(t), a ? l : (a = !0, c)) : n(t);
	}
	function l(t) {
		return t === null || sl(t) || K(t) || fl(t) || dl(t) ? n(t) : e.attempt(zf, e.attempt(Bf, u), n)(t);
	}
	function u(n) {
		return e.exit("literalAutolinkHttp"), e.exit("literalAutolink"), t(n);
	}
}
function Qf(e, t, n) {
	let r = 0;
	return i;
	function i(t) {
		return (t === 87 || t === 119) && r < 3 ? (r++, e.consume(t), i) : t === 46 && r === 3 ? (e.consume(t), a) : n(t);
	}
	function a(e) {
		return e === null ? n(e) : t(e);
	}
}
function $f(e, t, n) {
	let r, i, a;
	return o;
	function o(t) {
		return t === 46 || t === 95 ? e.check(Vf, c, s)(t) : t === null || K(t) || fl(t) || t !== 45 && dl(t) ? c(t) : (a = !0, e.consume(t), o);
	}
	function s(t) {
		return t === 95 ? r = !0 : (i = r, r = void 0), e.consume(t), o;
	}
	function c(e) {
		return i || r || !a ? n(e) : t(e);
	}
}
function ep(e, t) {
	let n = 0, r = 0;
	return i;
	function i(o) {
		return o === 40 ? (n++, e.consume(o), i) : o === 41 && r < n ? a(o) : o === 33 || o === 34 || o === 38 || o === 39 || o === 41 || o === 42 || o === 44 || o === 46 || o === 58 || o === 59 || o === 60 || o === 63 || o === 93 || o === 95 || o === 126 ? e.check(Vf, t, a)(o) : o === null || K(o) || fl(o) ? t(o) : (e.consume(o), i);
	}
	function a(t) {
		return t === 41 && r++, e.consume(t), i;
	}
}
function tp(e, t, n) {
	return r;
	function r(o) {
		return o === 33 || o === 34 || o === 39 || o === 41 || o === 42 || o === 44 || o === 46 || o === 58 || o === 59 || o === 63 || o === 95 || o === 126 ? (e.consume(o), r) : o === 38 ? (e.consume(o), a) : o === 93 ? (e.consume(o), i) : o === 60 || o === null || K(o) || fl(o) ? t(o) : n(o);
	}
	function i(e) {
		return e === null || e === 40 || e === 91 || K(e) || fl(e) ? t(e) : r(e);
	}
	function a(e) {
		return il(e) ? o(e) : n(e);
	}
	function o(t) {
		return t === 59 ? (e.consume(t), r) : il(t) ? (e.consume(t), o) : n(t);
	}
}
function np(e, t, n) {
	return r;
	function r(t) {
		return e.consume(t), i;
	}
	function i(e) {
		return al(e) ? n(e) : t(e);
	}
}
function rp(e) {
	return e === null || e === 40 || e === 42 || e === 95 || e === 91 || e === 93 || e === 126 || K(e);
}
function ip(e) {
	return !il(e);
}
function ap(e) {
	return !(e === 47 || op(e));
}
function op(e) {
	return e === 43 || e === 45 || e === 46 || e === 95 || al(e);
}
function sp(e) {
	let t = e.length, n = !1;
	for (; t--;) {
		let r = e[t][1];
		if ((r.type === "labelLink" || r.type === "labelImage") && !r._balanced) {
			n = !0;
			break;
		}
		if (r._gfmAutolinkLiteralWalkedInto) {
			n = !1;
			break;
		}
	}
	return e.length > 0 && !n && (e[e.length - 1][1]._gfmAutolinkLiteralWalkedInto = !0), n;
}
//#endregion
//#region node_modules/.pnpm/micromark-util-sanitize-uri@2.0.1/node_modules/micromark-util-sanitize-uri/index.js
function cp(e) {
	let t = [], n = -1, r = 0, i = 0;
	for (; ++n < e.length;) {
		let a = e.charCodeAt(n), o = "";
		if (a === 37 && al(e.charCodeAt(n + 1)) && al(e.charCodeAt(n + 2))) i = 2;
		else if (a < 128) /[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(a)) || (o = String.fromCharCode(a));
		else if (a > 55295 && a < 57344) {
			let t = e.charCodeAt(n + 1);
			a < 56320 && t > 56319 && t < 57344 ? (o = String.fromCharCode(a, t), i = 1) : o = "�";
		} else o = String.fromCharCode(a);
		o &&= (t.push(e.slice(r, n), encodeURIComponent(o)), r = n + i + 1, ""), i &&= (n += i, 0);
	}
	return t.join("") + e.slice(r);
}
//#endregion
//#region node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/attention.js
var lp = {
	name: "attention",
	resolveAll: up,
	tokenize: dp
};
function up(e, t) {
	let n = -1, r, i, a, o, s, c, l, u;
	for (; ++n < e.length;) if (e[n][0] === "enter" && e[n][1].type === "attentionSequence" && e[n][1]._close) {
		for (r = n; r--;) if (e[r][0] === "exit" && e[r][1].type === "attentionSequence" && e[r][1]._open && t.sliceSerialize(e[r][1]).charCodeAt(0) === t.sliceSerialize(e[n][1]).charCodeAt(0)) {
			if ((e[r][1]._close || e[n][1]._open) && (e[n][1].end.offset - e[n][1].start.offset) % 3 && !((e[r][1].end.offset - e[r][1].start.offset + e[n][1].end.offset - e[n][1].start.offset) % 3)) continue;
			c = e[r][1].end.offset - e[r][1].start.offset > 1 && e[n][1].end.offset - e[n][1].start.offset > 1 ? 2 : 1;
			let d = { ...e[r][1].end }, f = { ...e[n][1].start };
			fp(d, -c), fp(f, c), o = {
				type: c > 1 ? "strongSequence" : "emphasisSequence",
				start: d,
				end: { ...e[r][1].end }
			}, s = {
				type: c > 1 ? "strongSequence" : "emphasisSequence",
				start: { ...e[n][1].start },
				end: f
			}, a = {
				type: c > 1 ? "strongText" : "emphasisText",
				start: { ...e[r][1].end },
				end: { ...e[n][1].start }
			}, i = {
				type: c > 1 ? "strong" : "emphasis",
				start: { ...o.start },
				end: { ...s.end }
			}, e[r][1].end = { ...o.start }, e[n][1].start = { ...s.end }, l = [], e[r][1].end.offset - e[r][1].start.offset && (l = ou(l, [[
				"enter",
				e[r][1],
				t
			], [
				"exit",
				e[r][1],
				t
			]])), l = ou(l, [
				[
					"enter",
					i,
					t
				],
				[
					"enter",
					o,
					t
				],
				[
					"exit",
					o,
					t
				],
				[
					"enter",
					a,
					t
				]
			]), l = ou(l, su(t.parser.constructs.insideSpan.null, e.slice(r + 1, n), t)), l = ou(l, [
				[
					"exit",
					a,
					t
				],
				[
					"enter",
					s,
					t
				],
				[
					"exit",
					s,
					t
				],
				[
					"exit",
					i,
					t
				]
			]), e[n][1].end.offset - e[n][1].start.offset ? (u = 2, l = ou(l, [[
				"enter",
				e[n][1],
				t
			], [
				"exit",
				e[n][1],
				t
			]])) : u = 0, au(e, r - 1, n - r + 3, l), n = r + l.length - u - 2;
			break;
		}
	}
	for (n = -1; ++n < e.length;) e[n][1].type === "attentionSequence" && (e[n][1].type = "data");
	return e;
}
function dp(e, t) {
	let n = this.parser.constructs.attentionMarkers.null, r = this.previous, i = wd(r), a;
	return o;
	function o(t) {
		return a = t, e.enter("attentionSequence"), s(t);
	}
	function s(o) {
		if (o === a) return e.consume(o), s;
		let c = e.exit("attentionSequence"), l = wd(o), u = !l || l === 2 && i || n.includes(o), d = !i || i === 2 && l || n.includes(r);
		return c._open = !!(a === 42 ? u : u && (i || !d)), c._close = !!(a === 42 ? d : d && (l || !u)), t(o);
	}
}
function fp(e, t) {
	e.column += t, e.offset += t, e._bufferIndex += t;
}
//#endregion
//#region node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/autolink.js
var pp = {
	name: "autolink",
	tokenize: mp
};
function mp(e, t, n) {
	let r = 0;
	return i;
	function i(t) {
		return e.enter("autolink"), e.enter("autolinkMarker"), e.consume(t), e.exit("autolinkMarker"), e.enter("autolinkProtocol"), a;
	}
	function a(t) {
		return il(t) ? (e.consume(t), o) : t === 64 ? n(t) : l(t);
	}
	function o(e) {
		return e === 43 || e === 45 || e === 46 || al(e) ? (r = 1, s(e)) : l(e);
	}
	function s(t) {
		return t === 58 ? (e.consume(t), r = 0, c) : (t === 43 || t === 45 || t === 46 || al(t)) && r++ < 32 ? (e.consume(t), s) : (r = 0, l(t));
	}
	function c(r) {
		return r === 62 ? (e.exit("autolinkProtocol"), e.enter("autolinkMarker"), e.consume(r), e.exit("autolinkMarker"), e.exit("autolink"), t) : r === null || r === 32 || r === 60 || sl(r) ? n(r) : (e.consume(r), c);
	}
	function l(t) {
		return t === 64 ? (e.consume(t), u) : ol(t) ? (e.consume(t), l) : n(t);
	}
	function u(e) {
		return al(e) ? d(e) : n(e);
	}
	function d(n) {
		return n === 46 ? (e.consume(n), r = 0, u) : n === 62 ? (e.exit("autolinkProtocol").type = "autolinkEmail", e.enter("autolinkMarker"), e.consume(n), e.exit("autolinkMarker"), e.exit("autolink"), t) : f(n);
	}
	function f(t) {
		if ((t === 45 || al(t)) && r++ < 63) {
			let n = t === 45 ? f : d;
			return e.consume(t), n;
		}
		return n(t);
	}
}
//#endregion
//#region node_modules/.pnpm/micromark-factory-space@2.0.1/node_modules/micromark-factory-space/index.js
function J(e, t, n, r) {
	let i = r ? r - 1 : Infinity, a = 0;
	return o;
	function o(r) {
		return q(r) ? (e.enter(n), s(r)) : t(r);
	}
	function s(r) {
		return q(r) && a++ < i ? (e.consume(r), s) : (e.exit(n), t(r));
	}
}
//#endregion
//#region node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/blank-line.js
var hp = {
	partial: !0,
	tokenize: gp
};
function gp(e, t, n) {
	return r;
	function r(t) {
		return q(t) ? J(e, i, "linePrefix")(t) : i(t);
	}
	function i(e) {
		return e === null || G(e) ? t(e) : n(e);
	}
}
//#endregion
//#region node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/block-quote.js
var _p = {
	continuation: { tokenize: yp },
	exit: bp,
	name: "blockQuote",
	tokenize: vp
};
function vp(e, t, n) {
	let r = this;
	return i;
	function i(t) {
		if (t === 62) {
			let n = r.containerState;
			return n.open ||= (e.enter("blockQuote", { _container: !0 }), !0), e.enter("blockQuotePrefix"), e.enter("blockQuoteMarker"), e.consume(t), e.exit("blockQuoteMarker"), a;
		}
		return n(t);
	}
	function a(n) {
		return q(n) ? (e.enter("blockQuotePrefixWhitespace"), e.consume(n), e.exit("blockQuotePrefixWhitespace"), e.exit("blockQuotePrefix"), t) : (e.exit("blockQuotePrefix"), t(n));
	}
}
function yp(e, t, n) {
	let r = this;
	return i;
	function i(t) {
		return q(t) ? J(e, a, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(t) : a(t);
	}
	function a(r) {
		return e.attempt(_p, t, n)(r);
	}
}
function bp(e) {
	e.exit("blockQuote");
}
//#endregion
//#region node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/character-escape.js
var xp = {
	name: "characterEscape",
	tokenize: Sp
};
function Sp(e, t, n) {
	return r;
	function r(t) {
		return e.enter("characterEscape"), e.enter("escapeMarker"), e.consume(t), e.exit("escapeMarker"), i;
	}
	function i(r) {
		return ul(r) ? (e.enter("characterEscapeValue"), e.consume(r), e.exit("characterEscapeValue"), e.exit("characterEscape"), t) : n(r);
	}
}
//#endregion
//#region node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/character-reference.js
var Cp = {
	name: "characterReference",
	tokenize: wp
};
function wp(e, t, n) {
	let r = this, i = 0, a, o;
	return s;
	function s(t) {
		return e.enter("characterReference"), e.enter("characterReferenceMarker"), e.consume(t), e.exit("characterReferenceMarker"), c;
	}
	function c(t) {
		return t === 35 ? (e.enter("characterReferenceMarkerNumeric"), e.consume(t), e.exit("characterReferenceMarkerNumeric"), l) : (e.enter("characterReferenceValue"), a = 31, o = al, u(t));
	}
	function l(t) {
		return t === 88 || t === 120 ? (e.enter("characterReferenceMarkerHexadecimal"), e.consume(t), e.exit("characterReferenceMarkerHexadecimal"), e.enter("characterReferenceValue"), a = 6, o = ll, u) : (e.enter("characterReferenceValue"), a = 7, o = cl, u(t));
	}
	function u(s) {
		if (s === 59 && i) {
			let i = e.exit("characterReferenceValue");
			return o === al && !pf(r.sliceSerialize(i)) ? n(s) : (e.enter("characterReferenceMarker"), e.consume(s), e.exit("characterReferenceMarker"), e.exit("characterReference"), t);
		}
		return o(s) && i++ < a ? (e.consume(s), u) : n(s);
	}
}
//#endregion
//#region node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/code-fenced.js
var Tp = {
	partial: !0,
	tokenize: Op
}, Ep = {
	concrete: !0,
	name: "codeFenced",
	tokenize: Dp
};
function Dp(e, t, n) {
	let r = this, i = {
		partial: !0,
		tokenize: x
	}, a = 0, o = 0, s;
	return c;
	function c(e) {
		return l(e);
	}
	function l(t) {
		let n = r.events[r.events.length - 1];
		return a = n && n[1].type === "linePrefix" ? n[2].sliceSerialize(n[1], !0).length : 0, s = t, e.enter("codeFenced"), e.enter("codeFencedFence"), e.enter("codeFencedFenceSequence"), u(t);
	}
	function u(t) {
		return t === s ? (o++, e.consume(t), u) : o < 3 ? n(t) : (e.exit("codeFencedFenceSequence"), q(t) ? J(e, d, "whitespace")(t) : d(t));
	}
	function d(n) {
		return n === null || G(n) ? (e.exit("codeFencedFence"), r.interrupt ? t(n) : e.check(Tp, h, b)(n)) : (e.enter("codeFencedFenceInfo"), e.enter("chunkString", { contentType: "string" }), f(n));
	}
	function f(t) {
		return t === null || G(t) ? (e.exit("chunkString"), e.exit("codeFencedFenceInfo"), d(t)) : q(t) ? (e.exit("chunkString"), e.exit("codeFencedFenceInfo"), J(e, p, "whitespace")(t)) : t === 96 && t === s ? n(t) : (e.consume(t), f);
	}
	function p(t) {
		return t === null || G(t) ? d(t) : (e.enter("codeFencedFenceMeta"), e.enter("chunkString", { contentType: "string" }), m(t));
	}
	function m(t) {
		return t === null || G(t) ? (e.exit("chunkString"), e.exit("codeFencedFenceMeta"), d(t)) : t === 96 && t === s ? n(t) : (e.consume(t), m);
	}
	function h(t) {
		return e.attempt(i, b, g)(t);
	}
	function g(t) {
		return e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), _;
	}
	function _(t) {
		return a > 0 && q(t) ? J(e, v, "linePrefix", a + 1)(t) : v(t);
	}
	function v(t) {
		return t === null || G(t) ? e.check(Tp, h, b)(t) : (e.enter("codeFlowValue"), y(t));
	}
	function y(t) {
		return t === null || G(t) ? (e.exit("codeFlowValue"), v(t)) : (e.consume(t), y);
	}
	function b(n) {
		return e.exit("codeFenced"), t(n);
	}
	function x(e, t, n) {
		let i = 0;
		return a;
		function a(t) {
			return e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), c;
		}
		function c(t) {
			return e.enter("codeFencedFence"), q(t) ? J(e, l, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(t) : l(t);
		}
		function l(t) {
			return t === s ? (e.enter("codeFencedFenceSequence"), u(t)) : n(t);
		}
		function u(t) {
			return t === s ? (i++, e.consume(t), u) : i >= o ? (e.exit("codeFencedFenceSequence"), q(t) ? J(e, d, "whitespace")(t) : d(t)) : n(t);
		}
		function d(r) {
			return r === null || G(r) ? (e.exit("codeFencedFence"), t(r)) : n(r);
		}
	}
}
function Op(e, t, n) {
	let r = this;
	return i;
	function i(t) {
		return t === null ? n(t) : (e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), a);
	}
	function a(e) {
		return r.parser.lazy[r.now().line] ? n(e) : t(e);
	}
}
//#endregion
//#region node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/code-indented.js
var kp = {
	name: "codeIndented",
	tokenize: jp
}, Ap = {
	partial: !0,
	tokenize: Mp
};
function jp(e, t, n) {
	let r = this;
	return i;
	function i(t) {
		return e.enter("codeIndented"), J(e, a, "linePrefix", 5)(t);
	}
	function a(e) {
		let t = r.events[r.events.length - 1];
		return t && t[1].type === "linePrefix" && t[2].sliceSerialize(t[1], !0).length >= 4 ? o(e) : n(e);
	}
	function o(t) {
		return t === null ? c(t) : G(t) ? e.attempt(Ap, o, c)(t) : (e.enter("codeFlowValue"), s(t));
	}
	function s(t) {
		return t === null || G(t) ? (e.exit("codeFlowValue"), o(t)) : (e.consume(t), s);
	}
	function c(n) {
		return e.exit("codeIndented"), t(n);
	}
}
function Mp(e, t, n) {
	let r = this;
	return i;
	function i(t) {
		return r.parser.lazy[r.now().line] ? n(t) : G(t) ? (e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), i) : J(e, a, "linePrefix", 5)(t);
	}
	function a(e) {
		let a = r.events[r.events.length - 1];
		return a && a[1].type === "linePrefix" && a[2].sliceSerialize(a[1], !0).length >= 4 ? t(e) : G(e) ? i(e) : n(e);
	}
}
//#endregion
//#region node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/code-text.js
var Np = {
	name: "codeText",
	previous: Fp,
	resolve: Pp,
	tokenize: Ip
};
function Pp(e) {
	let t = e.length - 4, n = 3, r, i;
	if ((e[n][1].type === "lineEnding" || e[n][1].type === "space") && (e[t][1].type === "lineEnding" || e[t][1].type === "space")) {
		for (r = n; ++r < t;) if (e[r][1].type === "codeTextData") {
			e[n][1].type = "codeTextPadding", e[t][1].type = "codeTextPadding", n += 2, t -= 2;
			break;
		}
	}
	for (r = n - 1, t++; ++r <= t;) i === void 0 ? r !== t && e[r][1].type !== "lineEnding" && (i = r) : (r === t || e[r][1].type === "lineEnding") && (e[i][1].type = "codeTextData", r !== i + 2 && (e[i][1].end = e[r - 1][1].end, e.splice(i + 2, r - i - 2), t -= r - i - 2, r = i + 2), i = void 0);
	return e;
}
function Fp(e) {
	return e !== 96 || this.events[this.events.length - 1][1].type === "characterEscape";
}
function Ip(e, t, n) {
	let r = 0, i, a;
	return o;
	function o(t) {
		return e.enter("codeText"), e.enter("codeTextSequence"), s(t);
	}
	function s(t) {
		return t === 96 ? (e.consume(t), r++, s) : (e.exit("codeTextSequence"), c(t));
	}
	function c(t) {
		return t === null ? n(t) : t === 32 ? (e.enter("space"), e.consume(t), e.exit("space"), c) : t === 96 ? (a = e.enter("codeTextSequence"), i = 0, u(t)) : G(t) ? (e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), c) : (e.enter("codeTextData"), l(t));
	}
	function l(t) {
		return t === null || t === 32 || t === 96 || G(t) ? (e.exit("codeTextData"), c(t)) : (e.consume(t), l);
	}
	function u(n) {
		return n === 96 ? (e.consume(n), i++, u) : i === r ? (e.exit("codeTextSequence"), e.exit("codeText"), t(n)) : (a.type = "codeTextData", l(n));
	}
}
//#endregion
//#region node_modules/.pnpm/micromark-util-subtokenize@2.1.0/node_modules/micromark-util-subtokenize/lib/splice-buffer.js
var Lp = class {
	constructor(e) {
		this.left = e ? [...e] : [], this.right = [];
	}
	get(e) {
		if (e < 0 || e >= this.left.length + this.right.length) throw RangeError("Cannot access index `" + e + "` in a splice buffer of size `" + (this.left.length + this.right.length) + "`");
		return e < this.left.length ? this.left[e] : this.right[this.right.length - e + this.left.length - 1];
	}
	get length() {
		return this.left.length + this.right.length;
	}
	shift() {
		return this.setCursor(0), this.right.pop();
	}
	slice(e, t) {
		let n = t ?? Infinity;
		return n < this.left.length ? this.left.slice(e, n) : e > this.left.length ? this.right.slice(this.right.length - n + this.left.length, this.right.length - e + this.left.length).reverse() : this.left.slice(e).concat(this.right.slice(this.right.length - n + this.left.length).reverse());
	}
	splice(e, t, n) {
		let r = t || 0;
		this.setCursor(Math.trunc(e));
		let i = this.right.splice(this.right.length - r, Infinity);
		return n && Rp(this.left, n), i.reverse();
	}
	pop() {
		return this.setCursor(Infinity), this.left.pop();
	}
	push(e) {
		this.setCursor(Infinity), this.left.push(e);
	}
	pushMany(e) {
		this.setCursor(Infinity), Rp(this.left, e);
	}
	unshift(e) {
		this.setCursor(0), this.right.push(e);
	}
	unshiftMany(e) {
		this.setCursor(0), Rp(this.right, e.reverse());
	}
	setCursor(e) {
		if (!(e === this.left.length || e > this.left.length && this.right.length === 0 || e < 0 && this.left.length === 0)) if (e < this.left.length) {
			let t = this.left.splice(e, Infinity);
			Rp(this.right, t.reverse());
		} else {
			let t = this.right.splice(this.left.length + this.right.length - e, Infinity);
			Rp(this.left, t.reverse());
		}
	}
};
function Rp(e, t) {
	let n = 0;
	if (t.length < 1e4) e.push(...t);
	else for (; n < t.length;) e.push(...t.slice(n, n + 1e4)), n += 1e4;
}
//#endregion
//#region node_modules/.pnpm/micromark-util-subtokenize@2.1.0/node_modules/micromark-util-subtokenize/index.js
function zp(e) {
	let t = {}, n = -1, r, i, a, o, s, c, l, u = new Lp(e);
	for (; ++n < u.length;) {
		for (; n in t;) n = t[n];
		if (r = u.get(n), n && r[1].type === "chunkFlow" && u.get(n - 1)[1].type === "listItemPrefix" && (c = r[1]._tokenizer.events, a = 0, a < c.length && c[a][1].type === "lineEndingBlank" && (a += 2), a < c.length && c[a][1].type === "content")) for (; ++a < c.length && c[a][1].type !== "content";) c[a][1].type === "chunkText" && (c[a][1]._isInFirstContentOfListItem = !0, a++);
		if (r[0] === "enter") r[1].contentType && (Object.assign(t, Bp(u, n)), n = t[n], l = !0);
		else if (r[1]._container) {
			for (a = n, i = void 0; a--;) if (o = u.get(a), o[1].type === "lineEnding" || o[1].type === "lineEndingBlank") o[0] === "enter" && (i && (u.get(i)[1].type = "lineEndingBlank"), o[1].type = "lineEnding", i = a);
			else if (!(o[1].type === "linePrefix" || o[1].type === "listItemIndent")) break;
			i && (r[1].end = { ...u.get(i)[1].start }, s = u.slice(i, n), s.unshift(r), u.splice(i, n - i + 1, s));
		}
	}
	return au(e, 0, Infinity, u.slice(0)), !l;
}
function Bp(e, t) {
	let n = e.get(t)[1], r = e.get(t)[2], i = t - 1, a = [], o = n._tokenizer;
	o || (o = r.parser[n.contentType](n.start), n._contentTypeTextTrailing && (o._contentTypeTextTrailing = !0));
	let s = o.events, c = [], l = {}, u, d, f = -1, p = n, m = 0, h = 0, g = [h];
	for (; p;) {
		for (; e.get(++i)[1] !== p;);
		a.push(i), p._tokenizer || (u = r.sliceStream(p), p.next || u.push(null), d && o.defineSkip(p.start), p._isInFirstContentOfListItem && (o._gfmTasklistFirstContentOfListItem = !0), o.write(u), p._isInFirstContentOfListItem && (o._gfmTasklistFirstContentOfListItem = void 0)), d = p, p = p.next;
	}
	for (p = n; ++f < s.length;) s[f][0] === "exit" && s[f - 1][0] === "enter" && s[f][1].type === s[f - 1][1].type && s[f][1].start.line !== s[f][1].end.line && (h = f + 1, g.push(h), p._tokenizer = void 0, p.previous = void 0, p = p.next);
	for (o.events = [], p ? (p._tokenizer = void 0, p.previous = void 0) : g.pop(), f = g.length; f--;) {
		let t = s.slice(g[f], g[f + 1]), n = a.pop();
		c.push([n, n + t.length - 1]), e.splice(n, 2, t);
	}
	for (c.reverse(), f = -1; ++f < c.length;) l[m + c[f][0]] = m + c[f][1], m += c[f][1] - c[f][0] - 1;
	return l;
}
//#endregion
//#region node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/content.js
var Vp = {
	resolve: Up,
	tokenize: Wp
}, Hp = {
	partial: !0,
	tokenize: Gp
};
function Up(e) {
	return zp(e), e;
}
function Wp(e, t) {
	let n;
	return r;
	function r(t) {
		return e.enter("content"), n = e.enter("chunkContent", { contentType: "content" }), i(t);
	}
	function i(t) {
		return t === null ? a(t) : G(t) ? e.check(Hp, o, a)(t) : (e.consume(t), i);
	}
	function a(n) {
		return e.exit("chunkContent"), e.exit("content"), t(n);
	}
	function o(t) {
		return e.consume(t), e.exit("chunkContent"), n.next = e.enter("chunkContent", {
			contentType: "content",
			previous: n
		}), n = n.next, i;
	}
}
function Gp(e, t, n) {
	let r = this;
	return i;
	function i(t) {
		return e.exit("chunkContent"), e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), J(e, a, "linePrefix");
	}
	function a(i) {
		if (i === null || G(i)) return n(i);
		let a = r.events[r.events.length - 1];
		return !r.parser.constructs.disable.null.includes("codeIndented") && a && a[1].type === "linePrefix" && a[2].sliceSerialize(a[1], !0).length >= 4 ? t(i) : e.interrupt(r.parser.constructs.flow, n, t)(i);
	}
}
//#endregion
//#region node_modules/.pnpm/micromark-factory-destination@2.0.1/node_modules/micromark-factory-destination/index.js
function Kp(e, t, n, r, i, a, o, s, c) {
	let l = c || Infinity, u = 0;
	return d;
	function d(t) {
		return t === 60 ? (e.enter(r), e.enter(i), e.enter(a), e.consume(t), e.exit(a), f) : t === null || t === 32 || t === 41 || sl(t) ? n(t) : (e.enter(r), e.enter(o), e.enter(s), e.enter("chunkString", { contentType: "string" }), h(t));
	}
	function f(n) {
		return n === 62 ? (e.enter(a), e.consume(n), e.exit(a), e.exit(i), e.exit(r), t) : (e.enter(s), e.enter("chunkString", { contentType: "string" }), p(n));
	}
	function p(t) {
		return t === 62 ? (e.exit("chunkString"), e.exit(s), f(t)) : t === null || t === 60 || G(t) ? n(t) : (e.consume(t), t === 92 ? m : p);
	}
	function m(t) {
		return t === 60 || t === 62 || t === 92 ? (e.consume(t), p) : p(t);
	}
	function h(i) {
		return !u && (i === null || i === 41 || K(i)) ? (e.exit("chunkString"), e.exit(s), e.exit(o), e.exit(r), t(i)) : u < l && i === 40 ? (e.consume(i), u++, h) : i === 41 ? (e.consume(i), u--, h) : i === null || i === 32 || i === 40 || sl(i) ? n(i) : (e.consume(i), i === 92 ? g : h);
	}
	function g(t) {
		return t === 40 || t === 41 || t === 92 ? (e.consume(t), h) : h(t);
	}
}
//#endregion
//#region node_modules/.pnpm/micromark-factory-label@2.0.1/node_modules/micromark-factory-label/index.js
function qp(e, t, n, r, i, a) {
	let o = this, s = 0, c;
	return l;
	function l(t) {
		return e.enter(r), e.enter(i), e.consume(t), e.exit(i), e.enter(a), u;
	}
	function u(l) {
		return s > 999 || l === null || l === 91 || l === 93 && !c || l === 94 && !s && "_hiddenFootnoteSupport" in o.parser.constructs ? n(l) : l === 93 ? (e.exit(a), e.enter(i), e.consume(l), e.exit(i), e.exit(r), t) : G(l) ? (e.enter("lineEnding"), e.consume(l), e.exit("lineEnding"), u) : (e.enter("chunkString", { contentType: "string" }), d(l));
	}
	function d(t) {
		return t === null || t === 91 || t === 93 || G(t) || s++ > 999 ? (e.exit("chunkString"), u(t)) : (e.consume(t), c ||= !q(t), t === 92 ? f : d);
	}
	function f(t) {
		return t === 91 || t === 92 || t === 93 ? (e.consume(t), s++, d) : d(t);
	}
}
//#endregion
//#region node_modules/.pnpm/micromark-factory-title@2.0.1/node_modules/micromark-factory-title/index.js
function Jp(e, t, n, r, i, a) {
	let o;
	return s;
	function s(t) {
		return t === 34 || t === 39 || t === 40 ? (e.enter(r), e.enter(i), e.consume(t), e.exit(i), o = t === 40 ? 41 : t, c) : n(t);
	}
	function c(n) {
		return n === o ? (e.enter(i), e.consume(n), e.exit(i), e.exit(r), t) : (e.enter(a), l(n));
	}
	function l(t) {
		return t === o ? (e.exit(a), c(o)) : t === null ? n(t) : G(t) ? (e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), J(e, l, "linePrefix")) : (e.enter("chunkString", { contentType: "string" }), u(t));
	}
	function u(t) {
		return t === o || t === null || G(t) ? (e.exit("chunkString"), l(t)) : (e.consume(t), t === 92 ? d : u);
	}
	function d(t) {
		return t === o || t === 92 ? (e.consume(t), u) : u(t);
	}
}
//#endregion
//#region node_modules/.pnpm/micromark-factory-whitespace@2.0.1/node_modules/micromark-factory-whitespace/index.js
function Yp(e, t) {
	let n;
	return r;
	function r(i) {
		return G(i) ? (e.enter("lineEnding"), e.consume(i), e.exit("lineEnding"), n = !0, r) : q(i) ? J(e, r, n ? "linePrefix" : "lineSuffix")(i) : t(i);
	}
}
//#endregion
//#region node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/definition.js
var Xp = {
	name: "definition",
	tokenize: Qp
}, Zp = {
	partial: !0,
	tokenize: $p
};
function Qp(e, t, n) {
	let r = this, i;
	return a;
	function a(t) {
		return e.enter("definition"), o(t);
	}
	function o(t) {
		return qp.call(r, e, s, n, "definitionLabel", "definitionLabelMarker", "definitionLabelString")(t);
	}
	function s(t) {
		return i = Ru(r.sliceSerialize(r.events[r.events.length - 1][1]).slice(1, -1)), t === 58 ? (e.enter("definitionMarker"), e.consume(t), e.exit("definitionMarker"), c) : n(t);
	}
	function c(t) {
		return K(t) ? Yp(e, l)(t) : l(t);
	}
	function l(t) {
		return Kp(e, u, n, "definitionDestination", "definitionDestinationLiteral", "definitionDestinationLiteralMarker", "definitionDestinationRaw", "definitionDestinationString")(t);
	}
	function u(t) {
		return e.attempt(Zp, d, d)(t);
	}
	function d(t) {
		return q(t) ? J(e, f, "whitespace")(t) : f(t);
	}
	function f(a) {
		return a === null || G(a) ? (e.exit("definition"), r.parser.defined.push(i), t(a)) : n(a);
	}
}
function $p(e, t, n) {
	return r;
	function r(t) {
		return K(t) ? Yp(e, i)(t) : n(t);
	}
	function i(t) {
		return Jp(e, a, n, "definitionTitle", "definitionTitleMarker", "definitionTitleString")(t);
	}
	function a(t) {
		return q(t) ? J(e, o, "whitespace")(t) : o(t);
	}
	function o(e) {
		return e === null || G(e) ? t(e) : n(e);
	}
}
//#endregion
//#region node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/hard-break-escape.js
var em = {
	name: "hardBreakEscape",
	tokenize: tm
};
function tm(e, t, n) {
	return r;
	function r(t) {
		return e.enter("hardBreakEscape"), e.consume(t), i;
	}
	function i(r) {
		return G(r) ? (e.exit("hardBreakEscape"), t(r)) : n(r);
	}
}
//#endregion
//#region node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/heading-atx.js
var nm = {
	name: "headingAtx",
	resolve: rm,
	tokenize: im
};
function rm(e, t) {
	let n = e.length - 2, r = 3, i, a;
	return e[r][1].type === "whitespace" && (r += 2), n - 2 > r && e[n][1].type === "whitespace" && (n -= 2), e[n][1].type === "atxHeadingSequence" && (r === n - 1 || n - 4 > r && e[n - 2][1].type === "whitespace") && (n -= r + 1 === n ? 2 : 4), n > r && (i = {
		type: "atxHeadingText",
		start: e[r][1].start,
		end: e[n][1].end
	}, a = {
		type: "chunkText",
		start: e[r][1].start,
		end: e[n][1].end,
		contentType: "text"
	}, au(e, r, n - r + 1, [
		[
			"enter",
			i,
			t
		],
		[
			"enter",
			a,
			t
		],
		[
			"exit",
			a,
			t
		],
		[
			"exit",
			i,
			t
		]
	])), e;
}
function im(e, t, n) {
	let r = 0;
	return i;
	function i(t) {
		return e.enter("atxHeading"), a(t);
	}
	function a(t) {
		return e.enter("atxHeadingSequence"), o(t);
	}
	function o(t) {
		return t === 35 && r++ < 6 ? (e.consume(t), o) : t === null || K(t) ? (e.exit("atxHeadingSequence"), s(t)) : n(t);
	}
	function s(n) {
		return n === 35 ? (e.enter("atxHeadingSequence"), c(n)) : n === null || G(n) ? (e.exit("atxHeading"), t(n)) : q(n) ? J(e, s, "whitespace")(n) : (e.enter("atxHeadingText"), l(n));
	}
	function c(t) {
		return t === 35 ? (e.consume(t), c) : (e.exit("atxHeadingSequence"), s(t));
	}
	function l(t) {
		return t === null || t === 35 || K(t) ? (e.exit("atxHeadingText"), s(t)) : (e.consume(t), l);
	}
}
//#endregion
//#region node_modules/.pnpm/micromark-util-html-tag-name@2.0.1/node_modules/micromark-util-html-tag-name/index.js
var am = /* @__PURE__ */ "address.article.aside.base.basefont.blockquote.body.caption.center.col.colgroup.dd.details.dialog.dir.div.dl.dt.fieldset.figcaption.figure.footer.form.frame.frameset.h1.h2.h3.h4.h5.h6.head.header.hr.html.iframe.legend.li.link.main.menu.menuitem.nav.noframes.ol.optgroup.option.p.param.search.section.summary.table.tbody.td.tfoot.th.thead.title.tr.track.ul".split("."), om = [
	"pre",
	"script",
	"style",
	"textarea"
], sm = {
	concrete: !0,
	name: "htmlFlow",
	resolveTo: um,
	tokenize: dm
}, cm = {
	partial: !0,
	tokenize: pm
}, lm = {
	partial: !0,
	tokenize: fm
};
function um(e) {
	let t = e.length;
	for (; t-- && !(e[t][0] === "enter" && e[t][1].type === "htmlFlow"););
	return t > 1 && e[t - 2][1].type === "linePrefix" && (e[t][1].start = e[t - 2][1].start, e[t + 1][1].start = e[t - 2][1].start, e.splice(t - 2, 2)), e;
}
function dm(e, t, n) {
	let r = this, i, a, o, s, c;
	return l;
	function l(e) {
		return u(e);
	}
	function u(t) {
		return e.enter("htmlFlow"), e.enter("htmlFlowData"), e.consume(t), d;
	}
	function d(s) {
		return s === 33 ? (e.consume(s), f) : s === 47 ? (e.consume(s), a = !0, h) : s === 63 ? (e.consume(s), i = 3, r.interrupt ? t : k) : il(s) ? (e.consume(s), o = String.fromCharCode(s), g) : n(s);
	}
	function f(a) {
		return a === 45 ? (e.consume(a), i = 2, p) : a === 91 ? (e.consume(a), i = 5, s = 0, m) : il(a) ? (e.consume(a), i = 4, r.interrupt ? t : k) : n(a);
	}
	function p(i) {
		return i === 45 ? (e.consume(i), r.interrupt ? t : k) : n(i);
	}
	function m(i) {
		return i === "CDATA[".charCodeAt(s++) ? (e.consume(i), s === 6 ? r.interrupt ? t : E : m) : n(i);
	}
	function h(t) {
		return il(t) ? (e.consume(t), o = String.fromCharCode(t), g) : n(t);
	}
	function g(s) {
		if (s === null || s === 47 || s === 62 || K(s)) {
			let c = s === 47, l = o.toLowerCase();
			return !c && !a && om.includes(l) ? (i = 1, r.interrupt ? t(s) : E(s)) : am.includes(o.toLowerCase()) ? (i = 6, c ? (e.consume(s), _) : r.interrupt ? t(s) : E(s)) : (i = 7, r.interrupt && !r.parser.lazy[r.now().line] ? n(s) : a ? v(s) : y(s));
		}
		return s === 45 || al(s) ? (e.consume(s), o += String.fromCharCode(s), g) : n(s);
	}
	function _(i) {
		return i === 62 ? (e.consume(i), r.interrupt ? t : E) : n(i);
	}
	function v(t) {
		return q(t) ? (e.consume(t), v) : T(t);
	}
	function y(t) {
		return t === 47 ? (e.consume(t), T) : t === 58 || t === 95 || il(t) ? (e.consume(t), b) : q(t) ? (e.consume(t), y) : T(t);
	}
	function b(t) {
		return t === 45 || t === 46 || t === 58 || t === 95 || al(t) ? (e.consume(t), b) : x(t);
	}
	function x(t) {
		return t === 61 ? (e.consume(t), ee) : q(t) ? (e.consume(t), x) : y(t);
	}
	function ee(t) {
		return t === null || t === 60 || t === 61 || t === 62 || t === 96 ? n(t) : t === 34 || t === 39 ? (e.consume(t), c = t, S) : q(t) ? (e.consume(t), ee) : C(t);
	}
	function S(t) {
		return t === c ? (e.consume(t), c = null, w) : t === null || G(t) ? n(t) : (e.consume(t), S);
	}
	function C(t) {
		return t === null || t === 34 || t === 39 || t === 47 || t === 60 || t === 61 || t === 62 || t === 96 || K(t) ? x(t) : (e.consume(t), C);
	}
	function w(e) {
		return e === 47 || e === 62 || q(e) ? y(e) : n(e);
	}
	function T(t) {
		return t === 62 ? (e.consume(t), te) : n(t);
	}
	function te(t) {
		return t === null || G(t) ? E(t) : q(t) ? (e.consume(t), te) : n(t);
	}
	function E(t) {
		return t === 45 && i === 2 ? (e.consume(t), D) : t === 60 && i === 1 ? (e.consume(t), O) : t === 62 && i === 4 ? (e.consume(t), se) : t === 63 && i === 3 ? (e.consume(t), k) : t === 93 && i === 5 ? (e.consume(t), oe) : G(t) && (i === 6 || i === 7) ? (e.exit("htmlFlowData"), e.check(cm, ce, ne)(t)) : t === null || G(t) ? (e.exit("htmlFlowData"), ne(t)) : (e.consume(t), E);
	}
	function ne(t) {
		return e.check(lm, re, ce)(t);
	}
	function re(t) {
		return e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), ie;
	}
	function ie(t) {
		return t === null || G(t) ? ne(t) : (e.enter("htmlFlowData"), E(t));
	}
	function D(t) {
		return t === 45 ? (e.consume(t), k) : E(t);
	}
	function O(t) {
		return t === 47 ? (e.consume(t), o = "", ae) : E(t);
	}
	function ae(t) {
		if (t === 62) {
			let n = o.toLowerCase();
			return om.includes(n) ? (e.consume(t), se) : E(t);
		}
		return il(t) && o.length < 8 ? (e.consume(t), o += String.fromCharCode(t), ae) : E(t);
	}
	function oe(t) {
		return t === 93 ? (e.consume(t), k) : E(t);
	}
	function k(t) {
		return t === 62 ? (e.consume(t), se) : t === 45 && i === 2 ? (e.consume(t), k) : E(t);
	}
	function se(t) {
		return t === null || G(t) ? (e.exit("htmlFlowData"), ce(t)) : (e.consume(t), se);
	}
	function ce(n) {
		return e.exit("htmlFlow"), t(n);
	}
}
function fm(e, t, n) {
	let r = this;
	return i;
	function i(t) {
		return G(t) ? (e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), a) : n(t);
	}
	function a(e) {
		return r.parser.lazy[r.now().line] ? n(e) : t(e);
	}
}
function pm(e, t, n) {
	return r;
	function r(r) {
		return e.enter("lineEnding"), e.consume(r), e.exit("lineEnding"), e.attempt(hp, t, n);
	}
}
//#endregion
//#region node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/html-text.js
var mm = {
	name: "htmlText",
	tokenize: hm
};
function hm(e, t, n) {
	let r = this, i, a, o;
	return s;
	function s(t) {
		return e.enter("htmlText"), e.enter("htmlTextData"), e.consume(t), c;
	}
	function c(t) {
		return t === 33 ? (e.consume(t), l) : t === 47 ? (e.consume(t), x) : t === 63 ? (e.consume(t), y) : il(t) ? (e.consume(t), C) : n(t);
	}
	function l(t) {
		return t === 45 ? (e.consume(t), u) : t === 91 ? (e.consume(t), a = 0, m) : il(t) ? (e.consume(t), v) : n(t);
	}
	function u(t) {
		return t === 45 ? (e.consume(t), p) : n(t);
	}
	function d(t) {
		return t === null ? n(t) : t === 45 ? (e.consume(t), f) : G(t) ? (o = d, O(t)) : (e.consume(t), d);
	}
	function f(t) {
		return t === 45 ? (e.consume(t), p) : d(t);
	}
	function p(e) {
		return e === 62 ? D(e) : e === 45 ? f(e) : d(e);
	}
	function m(t) {
		return t === "CDATA[".charCodeAt(a++) ? (e.consume(t), a === 6 ? h : m) : n(t);
	}
	function h(t) {
		return t === null ? n(t) : t === 93 ? (e.consume(t), g) : G(t) ? (o = h, O(t)) : (e.consume(t), h);
	}
	function g(t) {
		return t === 93 ? (e.consume(t), _) : h(t);
	}
	function _(t) {
		return t === 62 ? D(t) : t === 93 ? (e.consume(t), _) : h(t);
	}
	function v(t) {
		return t === null || t === 62 ? D(t) : G(t) ? (o = v, O(t)) : (e.consume(t), v);
	}
	function y(t) {
		return t === null ? n(t) : t === 63 ? (e.consume(t), b) : G(t) ? (o = y, O(t)) : (e.consume(t), y);
	}
	function b(e) {
		return e === 62 ? D(e) : y(e);
	}
	function x(t) {
		return il(t) ? (e.consume(t), ee) : n(t);
	}
	function ee(t) {
		return t === 45 || al(t) ? (e.consume(t), ee) : S(t);
	}
	function S(t) {
		return G(t) ? (o = S, O(t)) : q(t) ? (e.consume(t), S) : D(t);
	}
	function C(t) {
		return t === 45 || al(t) ? (e.consume(t), C) : t === 47 || t === 62 || K(t) ? w(t) : n(t);
	}
	function w(t) {
		return t === 47 ? (e.consume(t), D) : t === 58 || t === 95 || il(t) ? (e.consume(t), T) : G(t) ? (o = w, O(t)) : q(t) ? (e.consume(t), w) : D(t);
	}
	function T(t) {
		return t === 45 || t === 46 || t === 58 || t === 95 || al(t) ? (e.consume(t), T) : te(t);
	}
	function te(t) {
		return t === 61 ? (e.consume(t), E) : G(t) ? (o = te, O(t)) : q(t) ? (e.consume(t), te) : w(t);
	}
	function E(t) {
		return t === null || t === 60 || t === 61 || t === 62 || t === 96 ? n(t) : t === 34 || t === 39 ? (e.consume(t), i = t, ne) : G(t) ? (o = E, O(t)) : q(t) ? (e.consume(t), E) : (e.consume(t), re);
	}
	function ne(t) {
		return t === i ? (e.consume(t), i = void 0, ie) : t === null ? n(t) : G(t) ? (o = ne, O(t)) : (e.consume(t), ne);
	}
	function re(t) {
		return t === null || t === 34 || t === 39 || t === 60 || t === 61 || t === 96 ? n(t) : t === 47 || t === 62 || K(t) ? w(t) : (e.consume(t), re);
	}
	function ie(e) {
		return e === 47 || e === 62 || K(e) ? w(e) : n(e);
	}
	function D(r) {
		return r === 62 ? (e.consume(r), e.exit("htmlTextData"), e.exit("htmlText"), t) : n(r);
	}
	function O(t) {
		return e.exit("htmlTextData"), e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), ae;
	}
	function ae(t) {
		return q(t) ? J(e, oe, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(t) : oe(t);
	}
	function oe(t) {
		return e.enter("htmlTextData"), o(t);
	}
}
//#endregion
//#region node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/label-end.js
var gm = {
	name: "labelEnd",
	resolveAll: bm,
	resolveTo: xm,
	tokenize: Sm
}, _m = { tokenize: Cm }, vm = { tokenize: wm }, ym = { tokenize: Tm };
function bm(e) {
	let t = -1, n = [];
	for (; ++t < e.length;) {
		let r = e[t][1];
		if (n.push(e[t]), r.type === "labelImage" || r.type === "labelLink" || r.type === "labelEnd") {
			let e = r.type === "labelImage" ? 4 : 2;
			r.type = "data", t += e;
		}
	}
	return e.length !== n.length && au(e, 0, e.length, n), e;
}
function xm(e, t) {
	let n = e.length, r = 0, i, a, o, s;
	for (; n--;) if (i = e[n][1], a) {
		if (i.type === "link" || i.type === "labelLink" && i._inactive) break;
		e[n][0] === "enter" && i.type === "labelLink" && (i._inactive = !0);
	} else if (o) {
		if (e[n][0] === "enter" && (i.type === "labelImage" || i.type === "labelLink") && !i._balanced && (a = n, i.type !== "labelLink")) {
			r = 2;
			break;
		}
	} else i.type === "labelEnd" && (o = n);
	let c = {
		type: e[a][1].type === "labelLink" ? "link" : "image",
		start: { ...e[a][1].start },
		end: { ...e[e.length - 1][1].end }
	}, l = {
		type: "label",
		start: { ...e[a][1].start },
		end: { ...e[o][1].end }
	}, u = {
		type: "labelText",
		start: { ...e[a + r + 2][1].end },
		end: { ...e[o - 2][1].start }
	};
	return s = [[
		"enter",
		c,
		t
	], [
		"enter",
		l,
		t
	]], s = ou(s, e.slice(a + 1, a + r + 3)), s = ou(s, [[
		"enter",
		u,
		t
	]]), s = ou(s, su(t.parser.constructs.insideSpan.null, e.slice(a + r + 4, o - 3), t)), s = ou(s, [
		[
			"exit",
			u,
			t
		],
		e[o - 2],
		e[o - 1],
		[
			"exit",
			l,
			t
		]
	]), s = ou(s, e.slice(o + 1)), s = ou(s, [[
		"exit",
		c,
		t
	]]), au(e, a, e.length, s), e;
}
function Sm(e, t, n) {
	let r = this, i = r.events.length, a, o;
	for (; i--;) if ((r.events[i][1].type === "labelImage" || r.events[i][1].type === "labelLink") && !r.events[i][1]._balanced) {
		a = r.events[i][1];
		break;
	}
	return s;
	function s(t) {
		return a ? a._inactive ? d(t) : (o = r.parser.defined.includes(Ru(r.sliceSerialize({
			start: a.end,
			end: r.now()
		}))), e.enter("labelEnd"), e.enter("labelMarker"), e.consume(t), e.exit("labelMarker"), e.exit("labelEnd"), c) : n(t);
	}
	function c(t) {
		return t === 40 ? e.attempt(_m, u, o ? u : d)(t) : t === 91 ? e.attempt(vm, u, o ? l : d)(t) : o ? u(t) : d(t);
	}
	function l(t) {
		return e.attempt(ym, u, d)(t);
	}
	function u(e) {
		return t(e);
	}
	function d(e) {
		return a._balanced = !0, n(e);
	}
}
function Cm(e, t, n) {
	return r;
	function r(t) {
		return e.enter("resource"), e.enter("resourceMarker"), e.consume(t), e.exit("resourceMarker"), i;
	}
	function i(t) {
		return K(t) ? Yp(e, a)(t) : a(t);
	}
	function a(t) {
		return t === 41 ? u(t) : Kp(e, o, s, "resourceDestination", "resourceDestinationLiteral", "resourceDestinationLiteralMarker", "resourceDestinationRaw", "resourceDestinationString", 32)(t);
	}
	function o(t) {
		return K(t) ? Yp(e, c)(t) : u(t);
	}
	function s(e) {
		return n(e);
	}
	function c(t) {
		return t === 34 || t === 39 || t === 40 ? Jp(e, l, n, "resourceTitle", "resourceTitleMarker", "resourceTitleString")(t) : u(t);
	}
	function l(t) {
		return K(t) ? Yp(e, u)(t) : u(t);
	}
	function u(r) {
		return r === 41 ? (e.enter("resourceMarker"), e.consume(r), e.exit("resourceMarker"), e.exit("resource"), t) : n(r);
	}
}
function wm(e, t, n) {
	let r = this;
	return i;
	function i(t) {
		return qp.call(r, e, a, o, "reference", "referenceMarker", "referenceString")(t);
	}
	function a(e) {
		return r.parser.defined.includes(Ru(r.sliceSerialize(r.events[r.events.length - 1][1]).slice(1, -1))) ? t(e) : n(e);
	}
	function o(e) {
		return n(e);
	}
}
function Tm(e, t, n) {
	return r;
	function r(t) {
		return e.enter("reference"), e.enter("referenceMarker"), e.consume(t), e.exit("referenceMarker"), i;
	}
	function i(r) {
		return r === 93 ? (e.enter("referenceMarker"), e.consume(r), e.exit("referenceMarker"), e.exit("reference"), t) : n(r);
	}
}
//#endregion
//#region node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/label-start-image.js
var Em = {
	name: "labelStartImage",
	resolveAll: gm.resolveAll,
	tokenize: Dm
};
function Dm(e, t, n) {
	let r = this;
	return i;
	function i(t) {
		return e.enter("labelImage"), e.enter("labelImageMarker"), e.consume(t), e.exit("labelImageMarker"), a;
	}
	function a(t) {
		return t === 91 ? (e.enter("labelMarker"), e.consume(t), e.exit("labelMarker"), e.exit("labelImage"), o) : n(t);
	}
	function o(e) {
		/* c8 ignore next 3 */
		return e === 94 && "_hiddenFootnoteSupport" in r.parser.constructs ? n(e) : t(e);
	}
}
//#endregion
//#region node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/label-start-link.js
var Om = {
	name: "labelStartLink",
	resolveAll: gm.resolveAll,
	tokenize: km
};
function km(e, t, n) {
	let r = this;
	return i;
	function i(t) {
		return e.enter("labelLink"), e.enter("labelMarker"), e.consume(t), e.exit("labelMarker"), e.exit("labelLink"), a;
	}
	function a(e) {
		/* c8 ignore next 3 */
		return e === 94 && "_hiddenFootnoteSupport" in r.parser.constructs ? n(e) : t(e);
	}
}
//#endregion
//#region node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/line-ending.js
var Am = {
	name: "lineEnding",
	tokenize: jm
};
function jm(e, t) {
	return n;
	function n(n) {
		return e.enter("lineEnding"), e.consume(n), e.exit("lineEnding"), J(e, t, "linePrefix");
	}
}
//#endregion
//#region node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/thematic-break.js
var Mm = {
	name: "thematicBreak",
	tokenize: Nm
};
function Nm(e, t, n) {
	let r = 0, i;
	return a;
	function a(t) {
		return e.enter("thematicBreak"), o(t);
	}
	function o(e) {
		return i = e, s(e);
	}
	function s(a) {
		return a === i ? (e.enter("thematicBreakSequence"), c(a)) : r >= 3 && (a === null || G(a)) ? (e.exit("thematicBreak"), t(a)) : n(a);
	}
	function c(t) {
		return t === i ? (e.consume(t), r++, c) : (e.exit("thematicBreakSequence"), q(t) ? J(e, s, "whitespace")(t) : s(t));
	}
}
//#endregion
//#region node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/list.js
var Pm = {
	continuation: { tokenize: Rm },
	exit: Bm,
	name: "list",
	tokenize: Lm
}, Fm = {
	partial: !0,
	tokenize: Vm
}, Im = {
	partial: !0,
	tokenize: zm
};
function Lm(e, t, n) {
	let r = this, i = r.events[r.events.length - 1], a = i && i[1].type === "linePrefix" ? i[2].sliceSerialize(i[1], !0).length : 0, o = 0;
	return s;
	function s(t) {
		let i = r.containerState.type || (t === 42 || t === 43 || t === 45 ? "listUnordered" : "listOrdered");
		if (i === "listUnordered" ? !r.containerState.marker || t === r.containerState.marker : cl(t)) {
			if (r.containerState.type || (r.containerState.type = i, e.enter(i, { _container: !0 })), i === "listUnordered") return e.enter("listItemPrefix"), t === 42 || t === 45 ? e.check(Mm, n, l)(t) : l(t);
			if (!r.interrupt || t === 49) return e.enter("listItemPrefix"), e.enter("listItemValue"), c(t);
		}
		return n(t);
	}
	function c(t) {
		return cl(t) && ++o < 10 ? (e.consume(t), c) : (!r.interrupt || o < 2) && (r.containerState.marker ? t === r.containerState.marker : t === 41 || t === 46) ? (e.exit("listItemValue"), l(t)) : n(t);
	}
	function l(t) {
		return e.enter("listItemMarker"), e.consume(t), e.exit("listItemMarker"), r.containerState.marker = r.containerState.marker || t, e.check(hp, r.interrupt ? n : u, e.attempt(Fm, f, d));
	}
	function u(e) {
		return r.containerState.initialBlankLine = !0, a++, f(e);
	}
	function d(t) {
		return q(t) ? (e.enter("listItemPrefixWhitespace"), e.consume(t), e.exit("listItemPrefixWhitespace"), f) : n(t);
	}
	function f(n) {
		return r.containerState.size = a + r.sliceSerialize(e.exit("listItemPrefix"), !0).length, t(n);
	}
}
function Rm(e, t, n) {
	let r = this;
	return r.containerState._closeFlow = void 0, e.check(hp, i, a);
	function i(n) {
		return r.containerState.furtherBlankLines = r.containerState.furtherBlankLines || r.containerState.initialBlankLine, J(e, t, "listItemIndent", r.containerState.size + 1)(n);
	}
	function a(n) {
		return r.containerState.furtherBlankLines || !q(n) ? (r.containerState.furtherBlankLines = void 0, r.containerState.initialBlankLine = void 0, o(n)) : (r.containerState.furtherBlankLines = void 0, r.containerState.initialBlankLine = void 0, e.attempt(Im, t, o)(n));
	}
	function o(i) {
		return r.containerState._closeFlow = !0, r.interrupt = void 0, J(e, e.attempt(Pm, t, n), "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(i);
	}
}
function zm(e, t, n) {
	let r = this;
	return J(e, i, "listItemIndent", r.containerState.size + 1);
	function i(e) {
		let i = r.events[r.events.length - 1];
		return i && i[1].type === "listItemIndent" && i[2].sliceSerialize(i[1], !0).length === r.containerState.size ? t(e) : n(e);
	}
}
function Bm(e) {
	e.exit(this.containerState.type);
}
function Vm(e, t, n) {
	let r = this;
	return J(e, i, "listItemPrefixWhitespace", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 5);
	function i(e) {
		let i = r.events[r.events.length - 1];
		return !q(e) && i && i[1].type === "listItemPrefixWhitespace" ? t(e) : n(e);
	}
}
//#endregion
//#region node_modules/.pnpm/micromark-core-commonmark@2.0.3/node_modules/micromark-core-commonmark/lib/setext-underline.js
var Hm = {
	name: "setextUnderline",
	resolveTo: Um,
	tokenize: Wm
};
function Um(e, t) {
	let n = e.length, r, i, a;
	for (; n--;) if (e[n][0] === "enter") {
		if (e[n][1].type === "content") {
			r = n;
			break;
		}
		e[n][1].type === "paragraph" && (i = n);
	} else e[n][1].type === "content" && e.splice(n, 1), !a && e[n][1].type === "definition" && (a = n);
	let o = {
		type: "setextHeading",
		start: { ...e[r][1].start },
		end: { ...e[e.length - 1][1].end }
	};
	return e[i][1].type = "setextHeadingText", a ? (e.splice(i, 0, [
		"enter",
		o,
		t
	]), e.splice(a + 1, 0, [
		"exit",
		e[r][1],
		t
	]), e[r][1].end = { ...e[a][1].end }) : e[r][1] = o, e.push([
		"exit",
		o,
		t
	]), e;
}
function Wm(e, t, n) {
	let r = this, i;
	return a;
	function a(t) {
		let a = r.events.length, s;
		for (; a--;) if (r.events[a][1].type !== "lineEnding" && r.events[a][1].type !== "linePrefix" && r.events[a][1].type !== "content") {
			s = r.events[a][1].type === "paragraph";
			break;
		}
		return !r.parser.lazy[r.now().line] && (r.interrupt || s) ? (e.enter("setextHeadingLine"), i = t, o(t)) : n(t);
	}
	function o(t) {
		return e.enter("setextHeadingLineSequence"), s(t);
	}
	function s(t) {
		return t === i ? (e.consume(t), s) : (e.exit("setextHeadingLineSequence"), q(t) ? J(e, c, "lineSuffix")(t) : c(t));
	}
	function c(r) {
		return r === null || G(r) ? (e.exit("setextHeadingLine"), t(r)) : n(r);
	}
}
//#endregion
//#region node_modules/.pnpm/micromark-extension-gfm-footnote@2.1.0/node_modules/micromark-extension-gfm-footnote/lib/syntax.js
var Gm = {
	tokenize: $m,
	partial: !0
};
function Km() {
	return {
		document: { 91: {
			name: "gfmFootnoteDefinition",
			tokenize: Xm,
			continuation: { tokenize: Zm },
			exit: Qm
		} },
		text: {
			91: {
				name: "gfmFootnoteCall",
				tokenize: Ym
			},
			93: {
				name: "gfmPotentialFootnoteCall",
				add: "after",
				tokenize: qm,
				resolveTo: Jm
			}
		}
	};
}
function qm(e, t, n) {
	let r = this, i = r.events.length, a = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []), o;
	for (; i--;) {
		let e = r.events[i][1];
		if (e.type === "labelImage") {
			o = e;
			break;
		}
		if (e.type === "gfmFootnoteCall" || e.type === "labelLink" || e.type === "label" || e.type === "image" || e.type === "link") break;
	}
	return s;
	function s(i) {
		if (!o || !o._balanced) return n(i);
		let s = Ru(r.sliceSerialize({
			start: o.end,
			end: r.now()
		}));
		return s.codePointAt(0) !== 94 || !a.includes(s.slice(1)) ? n(i) : (e.enter("gfmFootnoteCallLabelMarker"), e.consume(i), e.exit("gfmFootnoteCallLabelMarker"), t(i));
	}
}
function Jm(e, t) {
	let n = e.length;
	for (; n--;) if (e[n][1].type === "labelImage" && e[n][0] === "enter") {
		e[n][1];
		break;
	}
	e[n + 1][1].type = "data", e[n + 3][1].type = "gfmFootnoteCallLabelMarker";
	let r = {
		type: "gfmFootnoteCall",
		start: Object.assign({}, e[n + 3][1].start),
		end: Object.assign({}, e[e.length - 1][1].end)
	}, i = {
		type: "gfmFootnoteCallMarker",
		start: Object.assign({}, e[n + 3][1].end),
		end: Object.assign({}, e[n + 3][1].end)
	};
	i.end.column++, i.end.offset++, i.end._bufferIndex++;
	let a = {
		type: "gfmFootnoteCallString",
		start: Object.assign({}, i.end),
		end: Object.assign({}, e[e.length - 1][1].start)
	}, o = {
		type: "chunkString",
		contentType: "string",
		start: Object.assign({}, a.start),
		end: Object.assign({}, a.end)
	}, s = [
		e[n + 1],
		e[n + 2],
		[
			"enter",
			r,
			t
		],
		e[n + 3],
		e[n + 4],
		[
			"enter",
			i,
			t
		],
		[
			"exit",
			i,
			t
		],
		[
			"enter",
			a,
			t
		],
		[
			"enter",
			o,
			t
		],
		[
			"exit",
			o,
			t
		],
		[
			"exit",
			a,
			t
		],
		e[e.length - 2],
		e[e.length - 1],
		[
			"exit",
			r,
			t
		]
	];
	return e.splice(n, e.length - n + 1, ...s), e;
}
function Ym(e, t, n) {
	let r = this, i = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []), a = 0, o;
	return s;
	function s(t) {
		return e.enter("gfmFootnoteCall"), e.enter("gfmFootnoteCallLabelMarker"), e.consume(t), e.exit("gfmFootnoteCallLabelMarker"), c;
	}
	function c(t) {
		return t === 94 ? (e.enter("gfmFootnoteCallMarker"), e.consume(t), e.exit("gfmFootnoteCallMarker"), e.enter("gfmFootnoteCallString"), e.enter("chunkString").contentType = "string", l) : n(t);
	}
	function l(s) {
		if (a > 999 || s === 93 && !o || s === null || s === 91 || K(s)) return n(s);
		if (s === 93) {
			e.exit("chunkString");
			let a = e.exit("gfmFootnoteCallString");
			return i.includes(Ru(r.sliceSerialize(a))) ? (e.enter("gfmFootnoteCallLabelMarker"), e.consume(s), e.exit("gfmFootnoteCallLabelMarker"), e.exit("gfmFootnoteCall"), t) : n(s);
		}
		return K(s) || (o = !0), a++, e.consume(s), s === 92 ? u : l;
	}
	function u(t) {
		return t === 91 || t === 92 || t === 93 ? (e.consume(t), a++, l) : l(t);
	}
}
function Xm(e, t, n) {
	let r = this, i = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []), a, o = 0, s;
	return c;
	function c(t) {
		return e.enter("gfmFootnoteDefinition")._container = !0, e.enter("gfmFootnoteDefinitionLabel"), e.enter("gfmFootnoteDefinitionLabelMarker"), e.consume(t), e.exit("gfmFootnoteDefinitionLabelMarker"), l;
	}
	function l(t) {
		return t === 94 ? (e.enter("gfmFootnoteDefinitionMarker"), e.consume(t), e.exit("gfmFootnoteDefinitionMarker"), e.enter("gfmFootnoteDefinitionLabelString"), e.enter("chunkString").contentType = "string", u) : n(t);
	}
	function u(t) {
		if (o > 999 || t === 93 && !s || t === null || t === 91 || K(t)) return n(t);
		if (t === 93) {
			e.exit("chunkString");
			let n = e.exit("gfmFootnoteDefinitionLabelString");
			return a = Ru(r.sliceSerialize(n)), e.enter("gfmFootnoteDefinitionLabelMarker"), e.consume(t), e.exit("gfmFootnoteDefinitionLabelMarker"), e.exit("gfmFootnoteDefinitionLabel"), f;
		}
		return K(t) || (s = !0), o++, e.consume(t), t === 92 ? d : u;
	}
	function d(t) {
		return t === 91 || t === 92 || t === 93 ? (e.consume(t), o++, u) : u(t);
	}
	function f(t) {
		return t === 58 ? (e.enter("definitionMarker"), e.consume(t), e.exit("definitionMarker"), i.includes(a) || i.push(a), J(e, p, "gfmFootnoteDefinitionWhitespace")) : n(t);
	}
	function p(e) {
		return t(e);
	}
}
function Zm(e, t, n) {
	return e.check(hp, t, e.attempt(Gm, t, n));
}
function Qm(e) {
	e.exit("gfmFootnoteDefinition");
}
function $m(e, t, n) {
	let r = this;
	return J(e, i, "gfmFootnoteDefinitionIndent", 5);
	function i(e) {
		let i = r.events[r.events.length - 1];
		return i && i[1].type === "gfmFootnoteDefinitionIndent" && i[2].sliceSerialize(i[1], !0).length === 4 ? t(e) : n(e);
	}
}
//#endregion
//#region node_modules/.pnpm/micromark-extension-gfm-strikethrough@2.1.0/node_modules/micromark-extension-gfm-strikethrough/lib/syntax.js
function eh(e) {
	let t = (e || {}).singleTilde, n = {
		name: "strikethrough",
		tokenize: i,
		resolveAll: r
	};
	return t ??= !0, {
		text: { 126: n },
		insideSpan: { null: [n] },
		attentionMarkers: { null: [126] }
	};
	function r(e, t) {
		let n = -1;
		for (; ++n < e.length;) if (e[n][0] === "enter" && e[n][1].type === "strikethroughSequenceTemporary" && e[n][1]._close) {
			let r = n;
			for (; r--;) if (e[r][0] === "exit" && e[r][1].type === "strikethroughSequenceTemporary" && e[r][1]._open && e[n][1].end.offset - e[n][1].start.offset === e[r][1].end.offset - e[r][1].start.offset) {
				e[n][1].type = "strikethroughSequence", e[r][1].type = "strikethroughSequence";
				let i = {
					type: "strikethrough",
					start: Object.assign({}, e[r][1].start),
					end: Object.assign({}, e[n][1].end)
				}, a = {
					type: "strikethroughText",
					start: Object.assign({}, e[r][1].end),
					end: Object.assign({}, e[n][1].start)
				}, o = [
					[
						"enter",
						i,
						t
					],
					[
						"enter",
						e[r][1],
						t
					],
					[
						"exit",
						e[r][1],
						t
					],
					[
						"enter",
						a,
						t
					]
				], s = t.parser.constructs.insideSpan.null;
				s && au(o, o.length, 0, su(s, e.slice(r + 1, n), t)), au(o, o.length, 0, [
					[
						"exit",
						a,
						t
					],
					[
						"enter",
						e[n][1],
						t
					],
					[
						"exit",
						e[n][1],
						t
					],
					[
						"exit",
						i,
						t
					]
				]), au(e, r - 1, n - r + 3, o), n = r + o.length - 2;
				break;
			}
		}
		for (n = -1; ++n < e.length;) e[n][1].type === "strikethroughSequenceTemporary" && (e[n][1].type = "data");
		return e;
	}
	function i(e, n, r) {
		let i = this.previous, a = this.events, o = 0;
		return s;
		function s(t) {
			return i === 126 && a[a.length - 1][1].type !== "characterEscape" ? r(t) : (e.enter("strikethroughSequenceTemporary"), c(t));
		}
		function c(a) {
			let s = wd(i);
			if (a === 126) return o > 1 ? r(a) : (e.consume(a), o++, c);
			if (o < 2 && !t) return r(a);
			let l = e.exit("strikethroughSequenceTemporary"), u = wd(a);
			return l._open = !u || u === 2 && !!s, l._close = !s || s === 2 && !!u, n(a);
		}
	}
}
//#endregion
//#region node_modules/.pnpm/micromark-extension-gfm-table@2.1.1/node_modules/micromark-extension-gfm-table/lib/edit-map.js
var th = class {
	constructor() {
		this.map = [];
	}
	add(e, t, n) {
		nh(this, e, t, n);
	}
	consume(e) {
		/* c8 ignore next 3 -- `resolve` is never called without tables, so without edits. */
		if (this.map.sort(function(e, t) {
			return e[0] - t[0];
		}), this.map.length === 0) return;
		let t = this.map.length, n = [];
		for (; t > 0;) --t, n.push(e.slice(this.map[t][0] + this.map[t][1]), this.map[t][2]), e.length = this.map[t][0];
		n.push(e.slice()), e.length = 0;
		let r = n.pop();
		for (; r;) {
			for (let t of r) e.push(t);
			r = n.pop();
		}
		this.map.length = 0;
	}
};
function nh(e, t, n, r) {
	let i = 0;
	if (!(n === 0 && r.length === 0)) {
		for (; i < e.map.length;) {
			if (e.map[i][0] === t) {
				e.map[i][1] += n, e.map[i][2].push(...r);
				return;
			}
			i += 1;
		}
		e.map.push([
			t,
			n,
			r
		]);
	}
}
//#endregion
//#region node_modules/.pnpm/micromark-extension-gfm-table@2.1.1/node_modules/micromark-extension-gfm-table/lib/infer.js
function rh(e, t) {
	let n = !1, r = [];
	for (; t < e.length;) {
		let i = e[t];
		if (n) {
			if (i[0] === "enter") i[1].type === "tableContent" && r.push(e[t + 1][1].type === "tableDelimiterMarker" ? "left" : "none");
			else if (i[1].type === "tableContent") {
				if (e[t - 1][1].type === "tableDelimiterMarker") {
					let e = r.length - 1;
					r[e] = r[e] === "left" ? "center" : "right";
				}
			} else if (i[1].type === "tableDelimiterRow") break;
		} else i[0] === "enter" && i[1].type === "tableDelimiterRow" && (n = !0);
		t += 1;
	}
	return r;
}
//#endregion
//#region node_modules/.pnpm/micromark-extension-gfm-table@2.1.1/node_modules/micromark-extension-gfm-table/lib/syntax.js
function ih() {
	return { flow: { null: {
		name: "table",
		tokenize: ah,
		resolveAll: oh
	} } };
}
function ah(e, t, n) {
	let r = this, i = 0, a = 0, o;
	return s;
	function s(e) {
		let t = r.events.length - 1;
		for (; t > -1;) {
			let e = r.events[t][1].type;
			if (e === "lineEnding" || e === "linePrefix") t--;
			else break;
		}
		let i = t > -1 ? r.events[t][1].type : null, a = i === "tableHead" || i === "tableRow" ? ee : c;
		return a === ee && r.parser.lazy[r.now().line] ? n(e) : a(e);
	}
	function c(t) {
		return e.enter("tableHead"), e.enter("tableRow"), l(t);
	}
	function l(e) {
		return e === 124 ? u(e) : (o = !0, a += 1, u(e));
	}
	function u(t) {
		return t === null ? n(t) : G(t) ? a > 1 ? (a = 0, r.interrupt = !0, e.exit("tableRow"), e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), p) : n(t) : q(t) ? J(e, u, "whitespace")(t) : (a += 1, o && (o = !1, i += 1), t === 124 ? (e.enter("tableCellDivider"), e.consume(t), e.exit("tableCellDivider"), o = !0, u) : (e.enter("data"), d(t)));
	}
	function d(t) {
		return t === null || t === 124 || K(t) ? (e.exit("data"), u(t)) : (e.consume(t), t === 92 ? f : d);
	}
	function f(t) {
		return t === 92 || t === 124 ? (e.consume(t), d) : d(t);
	}
	function p(t) {
		return r.interrupt = !1, r.parser.lazy[r.now().line] ? n(t) : (e.enter("tableDelimiterRow"), o = !1, q(t) ? J(e, m, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(t) : m(t));
	}
	function m(t) {
		return t === 45 || t === 58 ? g(t) : t === 124 ? (o = !0, e.enter("tableCellDivider"), e.consume(t), e.exit("tableCellDivider"), h) : x(t);
	}
	function h(t) {
		return q(t) ? J(e, g, "whitespace")(t) : g(t);
	}
	function g(t) {
		return t === 58 ? (a += 1, o = !0, e.enter("tableDelimiterMarker"), e.consume(t), e.exit("tableDelimiterMarker"), _) : t === 45 ? (a += 1, _(t)) : t === null || G(t) ? b(t) : x(t);
	}
	function _(t) {
		return t === 45 ? (e.enter("tableDelimiterFiller"), v(t)) : x(t);
	}
	function v(t) {
		return t === 45 ? (e.consume(t), v) : t === 58 ? (o = !0, e.exit("tableDelimiterFiller"), e.enter("tableDelimiterMarker"), e.consume(t), e.exit("tableDelimiterMarker"), y) : (e.exit("tableDelimiterFiller"), y(t));
	}
	function y(t) {
		return q(t) ? J(e, b, "whitespace")(t) : b(t);
	}
	function b(n) {
		return n === 124 ? m(n) : n === null || G(n) ? !o || i !== a ? x(n) : (e.exit("tableDelimiterRow"), e.exit("tableHead"), t(n)) : x(n);
	}
	function x(e) {
		return n(e);
	}
	function ee(t) {
		return e.enter("tableRow"), S(t);
	}
	function S(n) {
		return n === 124 ? (e.enter("tableCellDivider"), e.consume(n), e.exit("tableCellDivider"), S) : n === null || G(n) ? (e.exit("tableRow"), t(n)) : q(n) ? J(e, S, "whitespace")(n) : (e.enter("data"), C(n));
	}
	function C(t) {
		return t === null || t === 124 || K(t) ? (e.exit("data"), S(t)) : (e.consume(t), t === 92 ? w : C);
	}
	function w(t) {
		return t === 92 || t === 124 ? (e.consume(t), C) : C(t);
	}
}
function oh(e, t) {
	let n = -1, r = !0, i = 0, a = [
		0,
		0,
		0,
		0
	], o = [
		0,
		0,
		0,
		0
	], s = !1, c = 0, l, u, d, f = new th();
	for (; ++n < e.length;) {
		let p = e[n], m = p[1];
		p[0] === "enter" ? m.type === "tableHead" ? (s = !1, c !== 0 && (ch(f, t, c, l, u), u = void 0, c = 0), l = {
			type: "table",
			start: Object.assign({}, m.start),
			end: Object.assign({}, m.end)
		}, f.add(n, 0, [[
			"enter",
			l,
			t
		]])) : m.type === "tableRow" || m.type === "tableDelimiterRow" ? (r = !0, d = void 0, a = [
			0,
			0,
			0,
			0
		], o = [
			0,
			n + 1,
			0,
			0
		], s && (s = !1, u = {
			type: "tableBody",
			start: Object.assign({}, m.start),
			end: Object.assign({}, m.end)
		}, f.add(n, 0, [[
			"enter",
			u,
			t
		]])), i = m.type === "tableDelimiterRow" ? 2 : u ? 3 : 1) : i && (m.type === "data" || m.type === "tableDelimiterMarker" || m.type === "tableDelimiterFiller") ? (r = !1, o[2] === 0 && (a[1] !== 0 && (o[0] = o[1], d = sh(f, t, a, i, void 0, d), a = [
			0,
			0,
			0,
			0
		]), o[2] = n)) : m.type === "tableCellDivider" && (r ? r = !1 : (a[1] !== 0 && (o[0] = o[1], d = sh(f, t, a, i, void 0, d)), a = o, o = [
			a[1],
			n,
			0,
			0
		])) : m.type === "tableHead" ? (s = !0, c = n) : m.type === "tableRow" || m.type === "tableDelimiterRow" ? (c = n, a[1] === 0 ? o[1] !== 0 && (d = sh(f, t, o, i, n, d)) : (o[0] = o[1], d = sh(f, t, a, i, n, d)), i = 0) : i && (m.type === "data" || m.type === "tableDelimiterMarker" || m.type === "tableDelimiterFiller") && (o[3] = n);
	}
	for (c !== 0 && ch(f, t, c, l, u), f.consume(t.events), n = -1; ++n < t.events.length;) {
		let e = t.events[n];
		e[0] === "enter" && e[1].type === "table" && (e[1]._align = rh(t.events, n));
	}
	return e;
}
function sh(e, t, n, r, i, a) {
	let o = r === 1 ? "tableHeader" : r === 2 ? "tableDelimiter" : "tableData";
	n[0] !== 0 && (a.end = Object.assign({}, lh(t.events, n[0])), e.add(n[0], 0, [[
		"exit",
		a,
		t
	]]));
	let s = lh(t.events, n[1]);
	if (a = {
		type: o,
		start: Object.assign({}, s),
		end: Object.assign({}, s)
	}, e.add(n[1], 0, [[
		"enter",
		a,
		t
	]]), n[2] !== 0) {
		let i = lh(t.events, n[2]), a = lh(t.events, n[3]), o = {
			type: "tableContent",
			start: Object.assign({}, i),
			end: Object.assign({}, a)
		};
		if (e.add(n[2], 0, [[
			"enter",
			o,
			t
		]]), r !== 2) {
			let r = t.events[n[2]], i = t.events[n[3]];
			if (r[1].end = Object.assign({}, i[1].end), r[1].type = "chunkText", r[1].contentType = "text", n[3] > n[2] + 1) {
				let t = n[2] + 1, r = n[3] - n[2] - 1;
				e.add(t, r, []);
			}
		}
		e.add(n[3] + 1, 0, [[
			"exit",
			o,
			t
		]]);
	}
	return i !== void 0 && (a.end = Object.assign({}, lh(t.events, i)), e.add(i, 0, [[
		"exit",
		a,
		t
	]]), a = void 0), a;
}
function ch(e, t, n, r, i) {
	let a = [], o = lh(t.events, n);
	i && (i.end = Object.assign({}, o), a.push([
		"exit",
		i,
		t
	])), r.end = Object.assign({}, o), a.push([
		"exit",
		r,
		t
	]), e.add(n + 1, 0, a);
}
function lh(e, t) {
	let n = e[t], r = n[0] === "enter" ? "start" : "end";
	return n[1][r];
}
//#endregion
//#region node_modules/.pnpm/micromark-extension-gfm-task-list-item@2.1.0/node_modules/micromark-extension-gfm-task-list-item/lib/syntax.js
var uh = {
	name: "tasklistCheck",
	tokenize: fh
};
function dh() {
	return { text: { 91: uh } };
}
function fh(e, t, n) {
	let r = this;
	return i;
	function i(t) {
		return r.previous !== null || !r._gfmTasklistFirstContentOfListItem ? n(t) : (e.enter("taskListCheck"), e.enter("taskListCheckMarker"), e.consume(t), e.exit("taskListCheckMarker"), a);
	}
	function a(t) {
		return K(t) ? (e.enter("taskListCheckValueUnchecked"), e.consume(t), e.exit("taskListCheckValueUnchecked"), o) : t === 88 || t === 120 ? (e.enter("taskListCheckValueChecked"), e.consume(t), e.exit("taskListCheckValueChecked"), o) : n(t);
	}
	function o(t) {
		return t === 93 ? (e.enter("taskListCheckMarker"), e.consume(t), e.exit("taskListCheckMarker"), e.exit("taskListCheck"), s) : n(t);
	}
	function s(r) {
		return G(r) ? t(r) : q(r) ? e.check({ tokenize: ph }, t, n)(r) : n(r);
	}
}
function ph(e, t, n) {
	return J(e, r, "whitespace");
	function r(e) {
		return e === null ? n(e) : t(e);
	}
}
//#endregion
//#region node_modules/.pnpm/micromark-extension-gfm@3.0.0/node_modules/micromark-extension-gfm/index.js
function mh(e) {
	return Ff([
		qf(),
		Km(),
		eh(e),
		ih(),
		dh()
	]);
}
//#endregion
//#region node_modules/.pnpm/remark-gfm@4.0.1/node_modules/remark-gfm/lib/index.js
var hh = {};
function gh(e) {
	let t = this, n = e || hh, r = t.data(), i = r.micromarkExtensions ||= [], a = r.fromMarkdownExtensions ||= [], o = r.toMarkdownExtensions ||= [];
	i.push(mh(n)), a.push(Mf()), o.push(Nf(n));
}
//#endregion
//#region node_modules/.pnpm/mdast-util-math@3.0.0/node_modules/mdast-util-math/lib/index.js
function _h() {
	return {
		enter: {
			mathFlow: e,
			mathFlowFenceMeta: t,
			mathText: a
		},
		exit: {
			mathFlow: i,
			mathFlowFence: r,
			mathFlowFenceMeta: n,
			mathFlowValue: s,
			mathText: o,
			mathTextData: s
		}
	};
	function e(e) {
		this.enter({
			type: "math",
			meta: null,
			value: "",
			data: {
				hName: "pre",
				hChildren: [{
					type: "element",
					tagName: "code",
					properties: { className: ["language-math", "math-display"] },
					children: []
				}]
			}
		}, e);
	}
	function t() {
		this.buffer();
	}
	function n() {
		let e = this.resume(), t = this.stack[this.stack.length - 1];
		t.type, t.meta = e;
	}
	function r() {
		this.data.mathFlowInside || (this.buffer(), this.data.mathFlowInside = !0);
	}
	function i(e) {
		let t = this.resume().replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, ""), n = this.stack[this.stack.length - 1];
		n.type, this.exit(e), n.value = t;
		let r = n.data.hChildren[0];
		r.type, r.tagName, r.children.push({
			type: "text",
			value: t
		}), this.data.mathFlowInside = void 0;
	}
	function a(e) {
		this.enter({
			type: "inlineMath",
			value: "",
			data: {
				hName: "code",
				hProperties: { className: ["language-math", "math-inline"] },
				hChildren: []
			}
		}, e), this.buffer();
	}
	function o(e) {
		let t = this.resume(), n = this.stack[this.stack.length - 1];
		n.type, this.exit(e), n.value = t, n.data.hChildren.push({
			type: "text",
			value: t
		});
	}
	function s(e) {
		this.config.enter.data.call(this, e), this.config.exit.data.call(this, e);
	}
}
function vh(e) {
	let t = (e || {}).singleDollarTextMath;
	return t ??= !0, r.peek = i, {
		unsafe: [
			{
				character: "\r",
				inConstruct: "mathFlowMeta"
			},
			{
				character: "\n",
				inConstruct: "mathFlowMeta"
			},
			{
				character: "$",
				after: t ? void 0 : "\\$",
				inConstruct: "phrasing"
			},
			{
				character: "$",
				inConstruct: "mathFlowMeta"
			},
			{
				atBreak: !0,
				character: "$",
				after: "\\$"
			}
		],
		handlers: {
			math: n,
			inlineMath: r
		}
	};
	function n(e, t, n, r) {
		let i = e.value || "", a = n.createTracker(r), o = "$".repeat(Math.max(hd(i, "$") + 1, 2)), s = n.enter("mathFlow"), c = a.move(o);
		if (e.meta) {
			let t = n.enter("mathFlowMeta");
			c += a.move(n.safe(e.meta, {
				after: "\n",
				before: c,
				encode: ["$"],
				...a.current()
			})), t();
		}
		return c += a.move("\n"), i && (c += a.move(i + "\n")), c += a.move(o), s(), c;
	}
	function r(e, n, r) {
		let i = e.value || "", a = 1;
		for (t || a++; RegExp("(^|[^$])" + "\\$".repeat(a) + "([^$]|$)").test(i);) a++;
		let o = "$".repeat(a);
		/[^ \r\n]/.test(i) && (/^[ \r\n]/.test(i) && /[ \r\n]$/.test(i) || /^\$|\$$/.test(i)) && (i = " " + i + " ");
		let s = -1;
		for (; ++s < r.unsafe.length;) {
			let e = r.unsafe[s];
			if (!e.atBreak) continue;
			let t = r.compilePattern(e), n;
			for (; n = t.exec(i);) {
				let e = n.index;
				i.codePointAt(e) === 10 && i.codePointAt(e - 1) === 13 && e--, i = i.slice(0, e) + " " + i.slice(n.index + 1);
			}
		}
		return o + i + o;
	}
	function i() {
		return "$";
	}
}
//#endregion
//#region node_modules/.pnpm/micromark-extension-math@3.1.0/node_modules/micromark-extension-math/lib/math-flow.js
var yh = {
	tokenize: xh,
	concrete: !0,
	name: "mathFlow"
}, bh = {
	tokenize: Sh,
	partial: !0
};
function xh(e, t, n) {
	let r = this, i = r.events[r.events.length - 1], a = i && i[1].type === "linePrefix" ? i[2].sliceSerialize(i[1], !0).length : 0, o = 0;
	return s;
	function s(t) {
		return e.enter("mathFlow"), e.enter("mathFlowFence"), e.enter("mathFlowFenceSequence"), c(t);
	}
	function c(t) {
		return t === 36 ? (e.consume(t), o++, c) : o < 2 ? n(t) : (e.exit("mathFlowFenceSequence"), J(e, l, "whitespace")(t));
	}
	function l(t) {
		return t === null || G(t) ? d(t) : (e.enter("mathFlowFenceMeta"), e.enter("chunkString", { contentType: "string" }), u(t));
	}
	function u(t) {
		return t === null || G(t) ? (e.exit("chunkString"), e.exit("mathFlowFenceMeta"), d(t)) : t === 36 ? n(t) : (e.consume(t), u);
	}
	function d(n) {
		return e.exit("mathFlowFence"), r.interrupt ? t(n) : e.attempt(bh, f, g)(n);
	}
	function f(t) {
		return e.attempt({
			tokenize: _,
			partial: !0
		}, g, p)(t);
	}
	function p(t) {
		return (a ? J(e, m, "linePrefix", a + 1) : m)(t);
	}
	function m(t) {
		return t === null ? g(t) : G(t) ? e.attempt(bh, f, g)(t) : (e.enter("mathFlowValue"), h(t));
	}
	function h(t) {
		return t === null || G(t) ? (e.exit("mathFlowValue"), m(t)) : (e.consume(t), h);
	}
	function g(n) {
		return e.exit("mathFlow"), t(n);
	}
	function _(e, t, n) {
		let i = 0;
		return J(e, a, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4);
		function a(t) {
			return e.enter("mathFlowFence"), e.enter("mathFlowFenceSequence"), s(t);
		}
		function s(t) {
			return t === 36 ? (i++, e.consume(t), s) : i < o ? n(t) : (e.exit("mathFlowFenceSequence"), J(e, c, "whitespace")(t));
		}
		function c(r) {
			return r === null || G(r) ? (e.exit("mathFlowFence"), t(r)) : n(r);
		}
	}
}
function Sh(e, t, n) {
	let r = this;
	return i;
	function i(n) {
		return n === null ? t(n) : (e.enter("lineEnding"), e.consume(n), e.exit("lineEnding"), a);
	}
	function a(e) {
		return r.parser.lazy[r.now().line] ? n(e) : t(e);
	}
}
//#endregion
//#region node_modules/.pnpm/micromark-extension-math@3.1.0/node_modules/micromark-extension-math/lib/math-text.js
function Ch(e) {
	let t = (e || {}).singleDollarTextMath;
	return t ??= !0, {
		tokenize: n,
		resolve: wh,
		previous: Th,
		name: "mathText"
	};
	function n(e, n, r) {
		let i = 0, a, o;
		return s;
		function s(t) {
			return e.enter("mathText"), e.enter("mathTextSequence"), c(t);
		}
		function c(n) {
			return n === 36 ? (e.consume(n), i++, c) : i < 2 && !t ? r(n) : (e.exit("mathTextSequence"), l(n));
		}
		function l(t) {
			return t === null ? r(t) : t === 36 ? (o = e.enter("mathTextSequence"), a = 0, d(t)) : t === 32 ? (e.enter("space"), e.consume(t), e.exit("space"), l) : G(t) ? (e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), l) : (e.enter("mathTextData"), u(t));
		}
		function u(t) {
			return t === null || t === 32 || t === 36 || G(t) ? (e.exit("mathTextData"), l(t)) : (e.consume(t), u);
		}
		function d(t) {
			return t === 36 ? (e.consume(t), a++, d) : a === i ? (e.exit("mathTextSequence"), e.exit("mathText"), n(t)) : (o.type = "mathTextData", u(t));
		}
	}
}
function wh(e) {
	let t = e.length - 4, n = 3, r, i;
	if ((e[n][1].type === "lineEnding" || e[n][1].type === "space") && (e[t][1].type === "lineEnding" || e[t][1].type === "space")) {
		for (r = n; ++r < t;) if (e[r][1].type === "mathTextData") {
			e[t][1].type = "mathTextPadding", e[n][1].type = "mathTextPadding", n += 2, t -= 2;
			break;
		}
	}
	for (r = n - 1, t++; ++r <= t;) i === void 0 ? r !== t && e[r][1].type !== "lineEnding" && (i = r) : (r === t || e[r][1].type === "lineEnding") && (e[i][1].type = "mathTextData", r !== i + 2 && (e[i][1].end = e[r - 1][1].end, e.splice(i + 2, r - i - 2), t -= r - i - 2, r = i + 2), i = void 0);
	return e;
}
function Th(e) {
	return e !== 36 || this.events[this.events.length - 1][1].type === "characterEscape";
}
//#endregion
//#region node_modules/.pnpm/micromark-extension-math@3.1.0/node_modules/micromark-extension-math/lib/syntax.js
function Eh(e) {
	return {
		flow: { 36: yh },
		text: { 36: Ch(e) }
	};
}
//#endregion
//#region node_modules/.pnpm/remark-math@6.0.0/node_modules/remark-math/lib/index.js
var Dh = {};
function Oh(e) {
	let t = this, n = e || Dh, r = t.data(), i = r.micromarkExtensions ||= [], a = r.fromMarkdownExtensions ||= [], o = r.toMarkdownExtensions ||= [];
	i.push(Eh(n)), a.push(_h()), o.push(vh(n));
}
//#endregion
//#region node_modules/.pnpm/remend@1.0.1/node_modules/remend/dist/index.js
var kh = /(\*\*)([^*]*?)$/, Ah = /(__)([^_]*?)$/, jh = /(\*\*\*)([^*]*?)$/, Mh = /(\*)([^*]*?)$/, Nh = /(_)([^_]*?)$/, Ph = /(`)([^`]*?)$/, Fh = /(~~)([^~]*?)$/, Ih = /^[\s_~*`]*$/, Lh = /^[\s]*[-*+][\s]+$/, Rh = /[\p{L}\p{N}_]/u, zh = /^```[^`\n]*```?$/, Bh = /^\*{4,}$/, Vh = (e) => {
	if (!e) return !1;
	let t = e.charCodeAt(0);
	return t >= 48 && t <= 57 || t >= 65 && t <= 90 || t >= 97 && t <= 122 || t === 95 ? !0 : Rh.test(e);
}, Hh = (e) => {
	let t = (e.match(/```/g) || []).length;
	return t > 0 && t % 2 == 0 && e.includes("\n");
}, Uh = (e, t) => {
	let n = 1;
	for (let r = t - 1; r >= 0; --r) if (e[r] === "]") n += 1;
	else if (e[r] === "[" && (--n, n === 0)) return r;
	return -1;
}, Wh = (e, t) => {
	let n = 1;
	for (let r = t + 1; r < e.length; r += 1) if (e[r] === "[") n += 1;
	else if (e[r] === "]" && (--n, n === 0)) return r;
	return -1;
}, Gh = (e, t) => {
	let n = !1, r = !1;
	for (let i = 0; i < e.length && i < t; i += 1) {
		if (e[i] === "\\" && e[i + 1] === "$") {
			i += 1;
			continue;
		}
		e[i] === "$" && (e[i + 1] === "$" ? (r = !r, i += 1, n = !1) : r || (n = !n));
	}
	return n || r;
}, Kh = (e, t, n) => {
	if (n !== " " && n !== "	") return !1;
	let r = 0;
	for (let n = t - 1; n >= 0; --n) if (e[n] === "\n") {
		r = n + 1;
		break;
	}
	for (let n = r; n < t; n += 1) if (e[n] !== " " && e[n] !== "	") return !1;
	return !0;
}, qh = (e, t, n, r) => !!(n === "\\" || n === "*" || r === "*" || n && r && Vh(n) && Vh(r) || Kh(e, t, r)), Jh = (e) => {
	let t = 0, n = e.length;
	for (let r = 0; r < n; r += 1) {
		if (e[r] !== "*") continue;
		let i = r > 0 ? e[r - 1] : "", a = r < n - 1 ? e[r + 1] : "";
		qh(e, r, i, a) || (t += 1);
	}
	return t;
}, Yh = (e, t, n, r) => !!(n === "\\" || e.includes("$") && Gh(e, t) || n === "_" || r === "_" || n && r && Vh(n) && Vh(r)), Xh = (e) => {
	let t = 0, n = e.length;
	for (let r = 0; r < n; r += 1) {
		if (e[r] !== "_") continue;
		let i = r > 0 ? e[r - 1] : "", a = r < n - 1 ? e[r + 1] : "";
		Yh(e, r, i, a) || (t += 1);
	}
	return t;
}, Zh = (e) => {
	let t = 0, n = 0;
	for (let r = 0; r < e.length; r += 1) e[r] === "*" ? n += 1 : (n >= 3 && (t += Math.floor(n / 3)), n = 0);
	return n >= 3 && (t += Math.floor(n / 3)), t;
}, Qh = (e) => {
	if (Hh(e)) return e;
	let t = e.match(kh);
	if (t) {
		let n = t[2];
		if (!n || Ih.test(n)) return e;
		let r = e.lastIndexOf(t[1]), i = e.substring(0, r).lastIndexOf("\n"), a = i === -1 ? 0 : i + 1, o = e.substring(a, r);
		if (Lh.test(o) && n.includes("\n")) return e;
		if ((e.match(/\*\*/g) || []).length % 2 == 1) return `${e}**`;
	}
	return e;
}, $h = (e) => {
	let t = e.match(Ah);
	if (t) {
		let n = t[2];
		if (!n || Ih.test(n)) return e;
		let r = e.lastIndexOf(t[1]), i = e.substring(0, r).lastIndexOf("\n"), a = i === -1 ? 0 : i + 1, o = e.substring(a, r);
		if (Lh.test(o) && n.includes("\n")) return e;
		if ((e.match(/__/g) || []).length % 2 == 1) return `${e}__`;
	}
	return e;
}, eg = (e) => {
	for (let t = 0; t < e.length; t += 1) if (e[t] === "*" && e[t - 1] !== "*" && e[t + 1] !== "*" && e[t - 1] !== "\\") {
		let n = t > 0 ? e[t - 1] : "", r = t < e.length - 1 ? e[t + 1] : "";
		if (n && r && Vh(n) && Vh(r)) continue;
		return t;
	}
	return -1;
}, tg = (e) => {
	if (Hh(e) || !e.match(Mh)) return e;
	let t = eg(e);
	if (t === -1) return e;
	let n = e.substring(t + 1);
	return !n || Ih.test(n) ? e : Jh(e) % 2 == 1 ? `${e}*` : e;
}, ng = (e) => {
	for (let t = 0; t < e.length; t += 1) if (e[t] === "_" && e[t - 1] !== "_" && e[t + 1] !== "_" && e[t - 1] !== "\\" && !Gh(e, t)) {
		let n = t > 0 ? e[t - 1] : "", r = t < e.length - 1 ? e[t + 1] : "";
		if (n && r && Vh(n) && Vh(r)) continue;
		return t;
	}
	return -1;
}, rg = (e) => {
	let t = e.length;
	for (; t > 0 && e[t - 1] === "\n";) --t;
	return t < e.length ? `${e.slice(0, t)}_${e.slice(t)}` : `${e}_`;
}, ig = (e) => {
	if (Hh(e) || !e.match(Nh)) return e;
	let t = ng(e);
	if (t === -1) return e;
	let n = e.substring(t + 1);
	return !n || Ih.test(n) ? e : Xh(e) % 2 == 1 ? rg(e) : e;
}, ag = (e) => {
	if (Hh(e) || Bh.test(e)) return e;
	let t = e.match(jh);
	if (t) {
		let n = t[2];
		if (!n || Ih.test(n)) return e;
		if (Zh(e) % 2 == 1) return `${e}***`;
	}
	return e;
}, og = (e, t) => {
	let n = !1, r = !1;
	for (let i = 0; i < t; i += 1) {
		if (e.substring(i, i + 3) === "```") {
			r = !r, i += 2;
			continue;
		}
		!r && e[i] === "`" && (n = !n);
	}
	return n || r;
}, sg = (e, t) => {
	let n = e.substring(t, t + 3) === "```", r = t > 0 && e.substring(t - 1, t + 2) === "```", i = t > 1 && e.substring(t - 2, t + 1) === "```";
	return n || r || i;
}, cg = (e) => {
	let t = 0;
	for (let n = 0; n < e.length; n += 1) e[n] === "`" && !sg(e, n) && (t += 1);
	return t;
}, lg = (e) => !e.match(zh) || e.includes("\n") ? null : e.endsWith("``") && !e.endsWith("```") ? `${e}\`` : e, ug = (e) => {
	let t = (e.match(/```/g) || []).length;
	return !!(t > 0 && t % 2 == 0 && e.includes("\n") || (e.endsWith("```\n") || e.endsWith("```")) && t % 2 == 0);
}, dg = (e) => (e.match(/```/g) || []).length % 2 == 1, fg = (e) => {
	let t = lg(e);
	if (t !== null) return t;
	if (ug(e)) return e;
	let n = e.match(Ph);
	if (n && !dg(e)) {
		let t = n[2];
		if (!t || Ih.test(t)) return e;
		if (cg(e) % 2 == 1) return `${e}\``;
	}
	return e;
}, pg = (e) => {
	if ((e.match(/\$\$/g) || []).length % 2 == 0) return e;
	let t = e.indexOf("$$");
	return t !== -1 && e.indexOf("\n", t) !== -1 && !e.endsWith("\n") ? `${e}
$$` : `${e}$$`;
}, mg = (e, t) => {
	if (e.substring(t + 2).includes(")")) return null;
	let n = Uh(e, t);
	if (n === -1 || og(e, n)) return null;
	let r = n > 0 && e[n - 1] === "!", i = r ? n - 1 : n, a = e.substring(0, i);
	return r ? a : `${a}[${e.substring(n + 1, t)}](streamdown:incomplete-link)`;
}, hg = (e, t) => {
	let n = t > 0 && e[t - 1] === "!", r = n ? t - 1 : t;
	if (!e.substring(t + 1).includes("]")) {
		let t = e.substring(0, r);
		return n ? t : `${e}](streamdown:incomplete-link)`;
	}
	if (Wh(e, t) === -1) {
		let t = e.substring(0, r);
		return n ? t : `${e}](streamdown:incomplete-link)`;
	}
	return null;
}, gg = (e) => {
	let t = e.lastIndexOf("](");
	if (t !== -1 && !og(e, t)) {
		let n = mg(e, t);
		if (n !== null) return n;
	}
	for (let t = e.length - 1; t >= 0; --t) if (e[t] === "[" && !og(e, t)) {
		let n = hg(e, t);
		if (n !== null) return n;
	}
	return e;
}, _g = (e) => {
	let t = e.match(Fh);
	if (t) {
		let n = t[2];
		if (!n || Ih.test(n)) return e;
		if ((e.match(/~~/g) || []).length % 2 == 1) return `${e}~~`;
	}
	return e;
}, vg = (e) => {
	if (!e || typeof e != "string") return e;
	let t = e, n = gg(t);
	return n.endsWith("](streamdown:incomplete-link)") ? n : (t = n, t = ag(t), t = Qh(t), t = $h(t), t = tg(t), t = ig(t), t = fg(t), t = _g(t), t = pg(t), t);
}, yg = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), bg = (e) => e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, n) => n ? n.toUpperCase() : t.toLowerCase()), xg = (e) => {
	let t = bg(e);
	return t.charAt(0).toUpperCase() + t.slice(1);
}, Sg = (...e) => e.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim(), Cg = (e) => {
	for (let t in e) if (t.startsWith("aria-") || t === "role" || t === "title") return !0;
}, wg = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 2,
	strokeLinecap: "round",
	strokeLinejoin: "round"
}, Tg = (0, s.forwardRef)(({ color: e = "currentColor", size: t = 24, strokeWidth: n = 2, absoluteStrokeWidth: r, className: i = "", children: a, iconNode: o, ...c }, l) => (0, s.createElement)("svg", {
	ref: l,
	...wg,
	width: t,
	height: t,
	stroke: e,
	strokeWidth: r ? Number(n) * 24 / Number(t) : n,
	className: Sg("lucide", i),
	...!a && !Cg(c) && { "aria-hidden": "true" },
	...c
}, [...o.map(([e, t]) => (0, s.createElement)(e, t)), ...Array.isArray(a) ? a : [a]])), Eg = (e, t) => {
	let n = (0, s.forwardRef)(({ className: n, ...r }, i) => (0, s.createElement)(Tg, {
		ref: i,
		iconNode: t,
		className: Sg(`lucide-${yg(xg(e))}`, `lucide-${e}`, n),
		...r
	}));
	return n.displayName = xg(e), n;
}, Dg = Eg("check", [["path", {
	d: "M20 6 9 17l-5-5",
	key: "1gmf2c"
}]]), Og = Eg("copy", [["rect", {
	width: "14",
	height: "14",
	x: "8",
	y: "8",
	rx: "2",
	ry: "2",
	key: "17jyea"
}], ["path", {
	d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
	key: "zix9uf"
}]]), kg = Eg("download", [
	["path", {
		d: "M12 15V3",
		key: "m9g1x1"
	}],
	["path", {
		d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
		key: "ih7n3h"
	}],
	["path", {
		d: "m7 10 5 5 5-5",
		key: "brsn70"
	}]
]), Ag = Eg("loader-circle", [["path", {
	d: "M21 12a9 9 0 1 1-6.219-8.56",
	key: "13zald"
}]]), jg = Eg("maximize-2", [
	["path", {
		d: "M15 3h6v6",
		key: "1q9fwt"
	}],
	["path", {
		d: "m21 3-7 7",
		key: "1l2asr"
	}],
	["path", {
		d: "m3 21 7-7",
		key: "tjx5ai"
	}],
	["path", {
		d: "M9 21H3v-6",
		key: "wtvkvv"
	}]
]), Mg = Eg("rotate-ccw", [["path", {
	d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
	key: "1357e3"
}], ["path", {
	d: "M3 3v5h5",
	key: "1xhq8a"
}]]), Ng = Eg("x", [["path", {
	d: "M18 6 6 18",
	key: "1bl5f8"
}], ["path", {
	d: "m6 6 12 12",
	key: "d8bk6v"
}]]), Pg = Eg("zoom-in", [
	["circle", {
		cx: "11",
		cy: "11",
		r: "8",
		key: "4ej97u"
	}],
	["line", {
		x1: "21",
		x2: "16.65",
		y1: "21",
		y2: "16.65",
		key: "13gj7c"
	}],
	["line", {
		x1: "11",
		x2: "11",
		y1: "8",
		y2: "14",
		key: "1vmskp"
	}],
	["line", {
		x1: "8",
		x2: "14",
		y1: "11",
		y2: "11",
		key: "durymu"
	}]
]), Fg = Eg("zoom-out", [
	["circle", {
		cx: "11",
		cy: "11",
		r: "8",
		key: "4ej97u"
	}],
	["line", {
		x1: "21",
		x2: "16.65",
		y1: "21",
		y2: "16.65",
		key: "13gj7c"
	}],
	["line", {
		x1: "8",
		x2: "14",
		y1: "11",
		y2: "11",
		key: "durymu"
	}]
]), Ig = /^[$_\p{ID_Start}][$_\u{200C}\u{200D}\p{ID_Continue}]*$/u, Lg = /^[$_\p{ID_Start}][-$_\u{200C}\u{200D}\p{ID_Continue}]*$/u, Rg = {};
function zg(e, t) {
	return ((t || Rg).jsx ? Lg : Ig).test(e);
}
//#endregion
//#region node_modules/.pnpm/hast-util-whitespace@3.0.0/node_modules/hast-util-whitespace/lib/index.js
var Bg = /[ \t\n\f\r]/g;
function Vg(e) {
	return typeof e == "object" ? e.type === "text" ? Hg(e.value) : !1 : Hg(e);
}
function Hg(e) {
	return e.replace(Bg, "") === "";
}
//#endregion
//#region node_modules/.pnpm/property-information@7.2.0/node_modules/property-information/lib/util/schema.js
var Ug = class {
	constructor(e, t, n) {
		this.normal = t, this.property = e, n && (this.space = n);
	}
};
Ug.prototype.normal = {}, Ug.prototype.property = {}, Ug.prototype.space = void 0;
//#endregion
//#region node_modules/.pnpm/property-information@7.2.0/node_modules/property-information/lib/util/merge.js
function Wg(e, t) {
	let n = {}, r = {};
	for (let t of e) Object.assign(n, t.property), Object.assign(r, t.normal);
	return new Ug(n, r, t);
}
//#endregion
//#region node_modules/.pnpm/property-information@7.2.0/node_modules/property-information/lib/normalize.js
function Gg(e) {
	return e.toLowerCase();
}
//#endregion
//#region node_modules/.pnpm/property-information@7.2.0/node_modules/property-information/lib/util/info.js
var Kg = class {
	constructor(e, t) {
		this.attribute = t, this.property = e;
	}
};
Kg.prototype.attribute = "", Kg.prototype.booleanish = !1, Kg.prototype.boolean = !1, Kg.prototype.commaOrSpaceSeparated = !1, Kg.prototype.commaSeparated = !1, Kg.prototype.defined = !1, Kg.prototype.mustUseProperty = !1, Kg.prototype.number = !1, Kg.prototype.overloadedBoolean = !1, Kg.prototype.property = "", Kg.prototype.spaceSeparated = !1, Kg.prototype.space = void 0;
//#endregion
//#region node_modules/.pnpm/property-information@7.2.0/node_modules/property-information/lib/util/types.js
var qg = /* @__PURE__ */ e({
	boolean: () => Y,
	booleanish: () => Yg,
	commaOrSpaceSeparated: () => Qg,
	commaSeparated: () => Zg,
	number: () => X,
	overloadedBoolean: () => Xg,
	spaceSeparated: () => Z
}), Jg = 0, Y = $g(), Yg = $g(), Xg = $g(), X = $g(), Z = $g(), Zg = $g(), Qg = $g();
function $g() {
	return 2 ** ++Jg;
}
//#endregion
//#region node_modules/.pnpm/property-information@7.2.0/node_modules/property-information/lib/util/defined-info.js
var e_ = Object.keys(qg), t_ = class extends Kg {
	constructor(e, t, n, r) {
		let i = -1;
		if (super(e, t), n_(this, "space", r), typeof n == "number") for (; ++i < e_.length;) {
			let e = e_[i];
			n_(this, e_[i], (n & qg[e]) === qg[e]);
		}
	}
};
t_.prototype.defined = !0;
function n_(e, t, n) {
	n && (e[t] = n);
}
//#endregion
//#region node_modules/.pnpm/property-information@7.2.0/node_modules/property-information/lib/util/create.js
function r_(e) {
	let t = {}, n = {};
	for (let [r, i] of Object.entries(e.properties)) {
		let a = new t_(r, e.transform(e.attributes || {}, r), i, e.space);
		e.mustUseProperty && e.mustUseProperty.includes(r) && (a.mustUseProperty = !0), t[r] = a, n[Gg(r)] = r, n[Gg(a.attribute)] = r;
	}
	return new Ug(t, n, e.space);
}
//#endregion
//#region node_modules/.pnpm/property-information@7.2.0/node_modules/property-information/lib/aria.js
var i_ = r_({
	properties: {
		ariaActiveDescendant: null,
		ariaAtomic: Yg,
		ariaAutoComplete: null,
		ariaBusy: Yg,
		ariaChecked: Yg,
		ariaColCount: X,
		ariaColIndex: X,
		ariaColSpan: X,
		ariaControls: Z,
		ariaCurrent: null,
		ariaDescribedBy: Z,
		ariaDetails: null,
		ariaDisabled: Yg,
		ariaDropEffect: Z,
		ariaErrorMessage: null,
		ariaExpanded: Yg,
		ariaFlowTo: Z,
		ariaGrabbed: Yg,
		ariaHasPopup: null,
		ariaHidden: Yg,
		ariaInvalid: null,
		ariaKeyShortcuts: null,
		ariaLabel: null,
		ariaLabelledBy: Z,
		ariaLevel: X,
		ariaLive: null,
		ariaModal: Yg,
		ariaMultiLine: Yg,
		ariaMultiSelectable: Yg,
		ariaOrientation: null,
		ariaOwns: Z,
		ariaPlaceholder: null,
		ariaPosInSet: X,
		ariaPressed: Yg,
		ariaReadOnly: Yg,
		ariaRelevant: null,
		ariaRequired: Yg,
		ariaRoleDescription: Z,
		ariaRowCount: X,
		ariaRowIndex: X,
		ariaRowSpan: X,
		ariaSelected: Yg,
		ariaSetSize: X,
		ariaSort: null,
		ariaValueMax: X,
		ariaValueMin: X,
		ariaValueNow: X,
		ariaValueText: null,
		role: null
	},
	transform(e, t) {
		return t === "role" ? t : "aria-" + t.slice(4).toLowerCase();
	}
});
//#endregion
//#region node_modules/.pnpm/property-information@7.2.0/node_modules/property-information/lib/util/case-sensitive-transform.js
function a_(e, t) {
	return t in e ? e[t] : t;
}
//#endregion
//#region node_modules/.pnpm/property-information@7.2.0/node_modules/property-information/lib/util/case-insensitive-transform.js
function o_(e, t) {
	return a_(e, t.toLowerCase());
}
//#endregion
//#region node_modules/.pnpm/property-information@7.2.0/node_modules/property-information/lib/html.js
var s_ = r_({
	attributes: {
		acceptcharset: "accept-charset",
		classname: "class",
		htmlfor: "for",
		httpequiv: "http-equiv"
	},
	mustUseProperty: [
		"checked",
		"multiple",
		"muted",
		"selected"
	],
	properties: {
		abbr: null,
		accept: Zg,
		acceptCharset: Z,
		accessKey: Z,
		action: null,
		allow: null,
		allowFullScreen: Y,
		allowPaymentRequest: Y,
		allowUserMedia: Y,
		alpha: Y,
		alt: null,
		as: null,
		async: Y,
		autoCapitalize: null,
		autoComplete: Z,
		autoFocus: Y,
		autoPlay: Y,
		blocking: Z,
		capture: null,
		charSet: null,
		checked: Y,
		cite: null,
		className: Z,
		closedBy: null,
		colorSpace: null,
		cols: X,
		colSpan: X,
		command: null,
		commandFor: null,
		content: null,
		contentEditable: Yg,
		controls: Y,
		controlsList: Z,
		coords: X | Zg,
		crossOrigin: null,
		data: null,
		dateTime: null,
		decoding: null,
		default: Y,
		defer: Y,
		dir: null,
		dirName: null,
		disabled: Y,
		download: Xg,
		draggable: Yg,
		encType: null,
		enterKeyHint: null,
		fetchPriority: null,
		form: null,
		formAction: null,
		formEncType: null,
		formMethod: null,
		formNoValidate: Y,
		formTarget: null,
		headers: Z,
		height: X,
		hidden: Xg,
		high: X,
		href: null,
		hrefLang: null,
		htmlFor: Z,
		httpEquiv: Z,
		id: null,
		imageSizes: null,
		imageSrcSet: null,
		inert: Y,
		inputMode: null,
		integrity: null,
		is: null,
		isMap: Y,
		itemId: null,
		itemProp: Z,
		itemRef: Z,
		itemScope: Y,
		itemType: Z,
		kind: null,
		label: null,
		lang: null,
		language: null,
		list: null,
		loading: null,
		loop: Y,
		low: X,
		manifest: null,
		max: null,
		maxLength: X,
		media: null,
		method: null,
		min: null,
		minLength: X,
		multiple: Y,
		muted: Y,
		name: null,
		nonce: null,
		noModule: Y,
		noValidate: Y,
		onAbort: null,
		onAfterPrint: null,
		onAuxClick: null,
		onBeforeMatch: null,
		onBeforePrint: null,
		onBeforeToggle: null,
		onBeforeUnload: null,
		onBlur: null,
		onCancel: null,
		onCanPlay: null,
		onCanPlayThrough: null,
		onChange: null,
		onClick: null,
		onClose: null,
		onContextLost: null,
		onContextMenu: null,
		onContextRestored: null,
		onCopy: null,
		onCueChange: null,
		onCut: null,
		onDblClick: null,
		onDrag: null,
		onDragEnd: null,
		onDragEnter: null,
		onDragExit: null,
		onDragLeave: null,
		onDragOver: null,
		onDragStart: null,
		onDrop: null,
		onDurationChange: null,
		onEmptied: null,
		onEnded: null,
		onError: null,
		onFocus: null,
		onFormData: null,
		onHashChange: null,
		onInput: null,
		onInvalid: null,
		onKeyDown: null,
		onKeyPress: null,
		onKeyUp: null,
		onLanguageChange: null,
		onLoad: null,
		onLoadedData: null,
		onLoadedMetadata: null,
		onLoadEnd: null,
		onLoadStart: null,
		onMessage: null,
		onMessageError: null,
		onMouseDown: null,
		onMouseEnter: null,
		onMouseLeave: null,
		onMouseMove: null,
		onMouseOut: null,
		onMouseOver: null,
		onMouseUp: null,
		onOffline: null,
		onOnline: null,
		onPageHide: null,
		onPageShow: null,
		onPaste: null,
		onPause: null,
		onPlay: null,
		onPlaying: null,
		onPopState: null,
		onProgress: null,
		onRateChange: null,
		onRejectionHandled: null,
		onReset: null,
		onResize: null,
		onScroll: null,
		onScrollEnd: null,
		onSecurityPolicyViolation: null,
		onSeeked: null,
		onSeeking: null,
		onSelect: null,
		onSlotChange: null,
		onStalled: null,
		onStorage: null,
		onSubmit: null,
		onSuspend: null,
		onTimeUpdate: null,
		onToggle: null,
		onUnhandledRejection: null,
		onUnload: null,
		onVolumeChange: null,
		onWaiting: null,
		onWheel: null,
		open: Y,
		optimum: X,
		pattern: null,
		ping: Z,
		placeholder: null,
		playsInline: Y,
		popover: null,
		popoverTarget: null,
		popoverTargetAction: null,
		poster: null,
		preload: null,
		readOnly: Y,
		referrerPolicy: null,
		rel: Z,
		required: Y,
		reversed: Y,
		rows: X,
		rowSpan: X,
		sandbox: Z,
		scope: null,
		scoped: Y,
		seamless: Y,
		selected: Y,
		shadowRootClonable: Y,
		shadowRootCustomElementRegistry: Y,
		shadowRootDelegatesFocus: Y,
		shadowRootMode: null,
		shadowRootSerializable: Y,
		shape: null,
		size: X,
		sizes: null,
		slot: null,
		span: X,
		spellCheck: Yg,
		src: null,
		srcDoc: null,
		srcLang: null,
		srcSet: null,
		start: X,
		step: null,
		style: null,
		tabIndex: X,
		target: null,
		title: null,
		translate: null,
		type: null,
		typeMustMatch: Y,
		useMap: null,
		value: Yg,
		width: X,
		wrap: null,
		writingSuggestions: null,
		align: null,
		aLink: null,
		archive: Z,
		axis: null,
		background: null,
		bgColor: null,
		border: X,
		borderColor: null,
		bottomMargin: X,
		cellPadding: null,
		cellSpacing: null,
		char: null,
		charOff: null,
		classId: null,
		clear: null,
		code: null,
		codeBase: null,
		codeType: null,
		color: null,
		compact: Y,
		declare: Y,
		event: null,
		face: null,
		frame: null,
		frameBorder: null,
		hSpace: X,
		leftMargin: X,
		link: null,
		longDesc: null,
		lowSrc: null,
		marginHeight: X,
		marginWidth: X,
		noResize: Y,
		noHref: Y,
		noShade: Y,
		noWrap: Y,
		object: null,
		profile: null,
		prompt: null,
		rev: null,
		rightMargin: X,
		rules: null,
		scheme: null,
		scrolling: Yg,
		standby: null,
		summary: null,
		text: null,
		topMargin: X,
		valueType: null,
		version: null,
		vAlign: null,
		vLink: null,
		vSpace: X,
		allowTransparency: null,
		autoCorrect: null,
		autoSave: null,
		credentialless: Y,
		disablePictureInPicture: Y,
		disableRemotePlayback: Y,
		exportParts: Zg,
		part: Z,
		prefix: null,
		property: null,
		results: X,
		security: null,
		unselectable: null
	},
	space: "html",
	transform: o_
}), c_ = r_({
	attributes: {
		accentHeight: "accent-height",
		alignmentBaseline: "alignment-baseline",
		arabicForm: "arabic-form",
		baselineShift: "baseline-shift",
		capHeight: "cap-height",
		className: "class",
		clipPath: "clip-path",
		clipRule: "clip-rule",
		colorInterpolation: "color-interpolation",
		colorInterpolationFilters: "color-interpolation-filters",
		colorProfile: "color-profile",
		colorRendering: "color-rendering",
		crossOrigin: "crossorigin",
		dataType: "datatype",
		dominantBaseline: "dominant-baseline",
		enableBackground: "enable-background",
		fillOpacity: "fill-opacity",
		fillRule: "fill-rule",
		floodColor: "flood-color",
		floodOpacity: "flood-opacity",
		fontFamily: "font-family",
		fontSize: "font-size",
		fontSizeAdjust: "font-size-adjust",
		fontStretch: "font-stretch",
		fontStyle: "font-style",
		fontVariant: "font-variant",
		fontWeight: "font-weight",
		glyphName: "glyph-name",
		glyphOrientationHorizontal: "glyph-orientation-horizontal",
		glyphOrientationVertical: "glyph-orientation-vertical",
		hrefLang: "hreflang",
		horizAdvX: "horiz-adv-x",
		horizOriginX: "horiz-origin-x",
		horizOriginY: "horiz-origin-y",
		imageRendering: "image-rendering",
		letterSpacing: "letter-spacing",
		lightingColor: "lighting-color",
		markerEnd: "marker-end",
		markerMid: "marker-mid",
		markerStart: "marker-start",
		maskType: "mask-type",
		navDown: "nav-down",
		navDownLeft: "nav-down-left",
		navDownRight: "nav-down-right",
		navLeft: "nav-left",
		navNext: "nav-next",
		navPrev: "nav-prev",
		navRight: "nav-right",
		navUp: "nav-up",
		navUpLeft: "nav-up-left",
		navUpRight: "nav-up-right",
		onAbort: "onabort",
		onActivate: "onactivate",
		onAfterPrint: "onafterprint",
		onBeforePrint: "onbeforeprint",
		onBegin: "onbegin",
		onCancel: "oncancel",
		onCanPlay: "oncanplay",
		onCanPlayThrough: "oncanplaythrough",
		onChange: "onchange",
		onClick: "onclick",
		onClose: "onclose",
		onCopy: "oncopy",
		onCueChange: "oncuechange",
		onCut: "oncut",
		onDblClick: "ondblclick",
		onDrag: "ondrag",
		onDragEnd: "ondragend",
		onDragEnter: "ondragenter",
		onDragExit: "ondragexit",
		onDragLeave: "ondragleave",
		onDragOver: "ondragover",
		onDragStart: "ondragstart",
		onDrop: "ondrop",
		onDurationChange: "ondurationchange",
		onEmptied: "onemptied",
		onEnd: "onend",
		onEnded: "onended",
		onError: "onerror",
		onFocus: "onfocus",
		onFocusIn: "onfocusin",
		onFocusOut: "onfocusout",
		onHashChange: "onhashchange",
		onInput: "oninput",
		onInvalid: "oninvalid",
		onKeyDown: "onkeydown",
		onKeyPress: "onkeypress",
		onKeyUp: "onkeyup",
		onLoad: "onload",
		onLoadedData: "onloadeddata",
		onLoadedMetadata: "onloadedmetadata",
		onLoadStart: "onloadstart",
		onMessage: "onmessage",
		onMouseDown: "onmousedown",
		onMouseEnter: "onmouseenter",
		onMouseLeave: "onmouseleave",
		onMouseMove: "onmousemove",
		onMouseOut: "onmouseout",
		onMouseOver: "onmouseover",
		onMouseUp: "onmouseup",
		onMouseWheel: "onmousewheel",
		onOffline: "onoffline",
		onOnline: "ononline",
		onPageHide: "onpagehide",
		onPageShow: "onpageshow",
		onPaste: "onpaste",
		onPause: "onpause",
		onPlay: "onplay",
		onPlaying: "onplaying",
		onPopState: "onpopstate",
		onProgress: "onprogress",
		onRateChange: "onratechange",
		onRepeat: "onrepeat",
		onReset: "onreset",
		onResize: "onresize",
		onScroll: "onscroll",
		onSeeked: "onseeked",
		onSeeking: "onseeking",
		onSelect: "onselect",
		onShow: "onshow",
		onStalled: "onstalled",
		onStorage: "onstorage",
		onSubmit: "onsubmit",
		onSuspend: "onsuspend",
		onTimeUpdate: "ontimeupdate",
		onToggle: "ontoggle",
		onUnload: "onunload",
		onVolumeChange: "onvolumechange",
		onWaiting: "onwaiting",
		onZoom: "onzoom",
		overlinePosition: "overline-position",
		overlineThickness: "overline-thickness",
		paintOrder: "paint-order",
		panose1: "panose-1",
		pointerEvents: "pointer-events",
		referrerPolicy: "referrerpolicy",
		renderingIntent: "rendering-intent",
		shapeRendering: "shape-rendering",
		stopColor: "stop-color",
		stopOpacity: "stop-opacity",
		strikethroughPosition: "strikethrough-position",
		strikethroughThickness: "strikethrough-thickness",
		strokeDashArray: "stroke-dasharray",
		strokeDashOffset: "stroke-dashoffset",
		strokeLineCap: "stroke-linecap",
		strokeLineJoin: "stroke-linejoin",
		strokeMiterLimit: "stroke-miterlimit",
		strokeOpacity: "stroke-opacity",
		strokeWidth: "stroke-width",
		tabIndex: "tabindex",
		textAnchor: "text-anchor",
		textDecoration: "text-decoration",
		textRendering: "text-rendering",
		transformOrigin: "transform-origin",
		typeOf: "typeof",
		underlinePosition: "underline-position",
		underlineThickness: "underline-thickness",
		unicodeBidi: "unicode-bidi",
		unicodeRange: "unicode-range",
		unitsPerEm: "units-per-em",
		vAlphabetic: "v-alphabetic",
		vHanging: "v-hanging",
		vIdeographic: "v-ideographic",
		vMathematical: "v-mathematical",
		vectorEffect: "vector-effect",
		vertAdvY: "vert-adv-y",
		vertOriginX: "vert-origin-x",
		vertOriginY: "vert-origin-y",
		wordSpacing: "word-spacing",
		writingMode: "writing-mode",
		xHeight: "x-height",
		playbackOrder: "playbackorder",
		timelineBegin: "timelinebegin"
	},
	properties: {
		about: Qg,
		accentHeight: X,
		accumulate: null,
		additive: null,
		alignmentBaseline: null,
		alphabetic: X,
		amplitude: X,
		arabicForm: null,
		ascent: X,
		attributeName: null,
		attributeType: null,
		azimuth: X,
		bandwidth: null,
		baselineShift: null,
		baseFrequency: null,
		baseProfile: null,
		bbox: null,
		begin: null,
		bias: X,
		by: null,
		calcMode: null,
		capHeight: X,
		className: Z,
		clip: null,
		clipPath: null,
		clipPathUnits: null,
		clipRule: null,
		color: null,
		colorInterpolation: null,
		colorInterpolationFilters: null,
		colorProfile: null,
		colorRendering: null,
		content: null,
		contentScriptType: null,
		contentStyleType: null,
		crossOrigin: null,
		cursor: null,
		cx: null,
		cy: null,
		d: null,
		dataType: null,
		defaultAction: null,
		descent: X,
		diffuseConstant: X,
		direction: null,
		display: null,
		dur: null,
		divisor: X,
		dominantBaseline: null,
		download: Y,
		dx: null,
		dy: null,
		edgeMode: null,
		editable: null,
		elevation: X,
		enableBackground: null,
		end: null,
		event: null,
		exponent: X,
		externalResourcesRequired: null,
		fill: null,
		fillOpacity: X,
		fillRule: null,
		filter: null,
		filterRes: null,
		filterUnits: null,
		floodColor: null,
		floodOpacity: null,
		focusable: null,
		focusHighlight: null,
		fontFamily: null,
		fontSize: null,
		fontSizeAdjust: null,
		fontStretch: null,
		fontStyle: null,
		fontVariant: null,
		fontWeight: null,
		format: null,
		fr: null,
		from: null,
		fx: null,
		fy: null,
		g1: Zg,
		g2: Zg,
		glyphName: Zg,
		glyphOrientationHorizontal: null,
		glyphOrientationVertical: null,
		glyphRef: null,
		gradientTransform: null,
		gradientUnits: null,
		handler: null,
		hanging: X,
		hatchContentUnits: null,
		hatchUnits: null,
		height: null,
		href: null,
		hrefLang: null,
		horizAdvX: X,
		horizOriginX: X,
		horizOriginY: X,
		id: null,
		ideographic: X,
		imageRendering: null,
		initialVisibility: null,
		in: null,
		in2: null,
		intercept: X,
		k: X,
		k1: X,
		k2: X,
		k3: X,
		k4: X,
		kernelMatrix: Qg,
		kernelUnitLength: null,
		keyPoints: null,
		keySplines: null,
		keyTimes: null,
		kerning: null,
		lang: null,
		lengthAdjust: null,
		letterSpacing: null,
		lightingColor: null,
		limitingConeAngle: X,
		local: null,
		markerEnd: null,
		markerMid: null,
		markerStart: null,
		markerHeight: null,
		markerUnits: null,
		markerWidth: null,
		mask: null,
		maskContentUnits: null,
		maskType: null,
		maskUnits: null,
		mathematical: null,
		max: null,
		media: null,
		mediaCharacterEncoding: null,
		mediaContentEncodings: null,
		mediaSize: X,
		mediaTime: null,
		method: null,
		min: null,
		mode: null,
		name: null,
		navDown: null,
		navDownLeft: null,
		navDownRight: null,
		navLeft: null,
		navNext: null,
		navPrev: null,
		navRight: null,
		navUp: null,
		navUpLeft: null,
		navUpRight: null,
		numOctaves: null,
		observer: null,
		offset: null,
		onAbort: null,
		onActivate: null,
		onAfterPrint: null,
		onBeforePrint: null,
		onBegin: null,
		onCancel: null,
		onCanPlay: null,
		onCanPlayThrough: null,
		onChange: null,
		onClick: null,
		onClose: null,
		onCopy: null,
		onCueChange: null,
		onCut: null,
		onDblClick: null,
		onDrag: null,
		onDragEnd: null,
		onDragEnter: null,
		onDragExit: null,
		onDragLeave: null,
		onDragOver: null,
		onDragStart: null,
		onDrop: null,
		onDurationChange: null,
		onEmptied: null,
		onEnd: null,
		onEnded: null,
		onError: null,
		onFocus: null,
		onFocusIn: null,
		onFocusOut: null,
		onHashChange: null,
		onInput: null,
		onInvalid: null,
		onKeyDown: null,
		onKeyPress: null,
		onKeyUp: null,
		onLoad: null,
		onLoadedData: null,
		onLoadedMetadata: null,
		onLoadStart: null,
		onMessage: null,
		onMouseDown: null,
		onMouseEnter: null,
		onMouseLeave: null,
		onMouseMove: null,
		onMouseOut: null,
		onMouseOver: null,
		onMouseUp: null,
		onMouseWheel: null,
		onOffline: null,
		onOnline: null,
		onPageHide: null,
		onPageShow: null,
		onPaste: null,
		onPause: null,
		onPlay: null,
		onPlaying: null,
		onPopState: null,
		onProgress: null,
		onRateChange: null,
		onRepeat: null,
		onReset: null,
		onResize: null,
		onScroll: null,
		onSeeked: null,
		onSeeking: null,
		onSelect: null,
		onShow: null,
		onStalled: null,
		onStorage: null,
		onSubmit: null,
		onSuspend: null,
		onTimeUpdate: null,
		onToggle: null,
		onUnload: null,
		onVolumeChange: null,
		onWaiting: null,
		onZoom: null,
		opacity: null,
		operator: null,
		order: null,
		orient: null,
		orientation: null,
		origin: null,
		overflow: null,
		overlay: null,
		overlinePosition: X,
		overlineThickness: X,
		paintOrder: null,
		panose1: null,
		path: null,
		pathLength: X,
		patternContentUnits: null,
		patternTransform: null,
		patternUnits: null,
		phase: null,
		ping: Z,
		pitch: null,
		playbackOrder: null,
		pointerEvents: null,
		points: null,
		pointsAtX: X,
		pointsAtY: X,
		pointsAtZ: X,
		preserveAlpha: null,
		preserveAspectRatio: null,
		primitiveUnits: null,
		propagate: null,
		property: Qg,
		r: null,
		radius: null,
		referrerPolicy: null,
		refX: null,
		refY: null,
		rel: Qg,
		rev: Qg,
		renderingIntent: null,
		repeatCount: null,
		repeatDur: null,
		requiredExtensions: Qg,
		requiredFeatures: Qg,
		requiredFonts: Qg,
		requiredFormats: Qg,
		resource: null,
		restart: null,
		result: null,
		rotate: null,
		rx: null,
		ry: null,
		scale: null,
		seed: null,
		shapeRendering: null,
		side: null,
		slope: null,
		snapshotTime: null,
		specularConstant: X,
		specularExponent: X,
		spreadMethod: null,
		spacing: null,
		startOffset: null,
		stdDeviation: null,
		stemh: null,
		stemv: null,
		stitchTiles: null,
		stopColor: null,
		stopOpacity: null,
		strikethroughPosition: X,
		strikethroughThickness: X,
		string: null,
		stroke: null,
		strokeDashArray: Qg,
		strokeDashOffset: null,
		strokeLineCap: null,
		strokeLineJoin: null,
		strokeMiterLimit: X,
		strokeOpacity: X,
		strokeWidth: null,
		style: null,
		surfaceScale: X,
		syncBehavior: null,
		syncBehaviorDefault: null,
		syncMaster: null,
		syncTolerance: null,
		syncToleranceDefault: null,
		systemLanguage: Qg,
		tabIndex: X,
		tableValues: null,
		target: null,
		targetX: X,
		targetY: X,
		textAnchor: null,
		textDecoration: null,
		textRendering: null,
		textLength: null,
		timelineBegin: null,
		title: null,
		transformBehavior: null,
		type: null,
		typeOf: Qg,
		to: null,
		transform: null,
		transformOrigin: null,
		u1: null,
		u2: null,
		underlinePosition: X,
		underlineThickness: X,
		unicode: null,
		unicodeBidi: null,
		unicodeRange: null,
		unitsPerEm: X,
		values: null,
		vAlphabetic: X,
		vMathematical: X,
		vectorEffect: null,
		vHanging: X,
		vIdeographic: X,
		version: null,
		vertAdvY: X,
		vertOriginX: X,
		vertOriginY: X,
		viewBox: null,
		viewTarget: null,
		visibility: null,
		width: null,
		widths: null,
		wordSpacing: null,
		writingMode: null,
		x: null,
		x1: null,
		x2: null,
		xChannelSelector: null,
		xHeight: X,
		y: null,
		y1: null,
		y2: null,
		yChannelSelector: null,
		z: null,
		zoomAndPan: null
	},
	space: "svg",
	transform: a_
}), l_ = r_({
	properties: {
		xLinkActuate: null,
		xLinkArcRole: null,
		xLinkHref: null,
		xLinkRole: null,
		xLinkShow: null,
		xLinkTitle: null,
		xLinkType: null
	},
	space: "xlink",
	transform(e, t) {
		return "xlink:" + t.slice(5).toLowerCase();
	}
}), u_ = r_({
	attributes: { xmlnsxlink: "xmlns:xlink" },
	properties: {
		xmlnsXLink: null,
		xmlns: null
	},
	space: "xmlns",
	transform: o_
}), d_ = r_({
	properties: {
		xmlBase: null,
		xmlLang: null,
		xmlSpace: null
	},
	space: "xml",
	transform(e, t) {
		return "xml:" + t.slice(3).toLowerCase();
	}
}), f_ = {
	classId: "classID",
	dataType: "datatype",
	itemId: "itemID",
	strokeDashArray: "strokeDasharray",
	strokeDashOffset: "strokeDashoffset",
	strokeLineCap: "strokeLinecap",
	strokeLineJoin: "strokeLinejoin",
	strokeMiterLimit: "strokeMiterlimit",
	typeOf: "typeof",
	xLinkActuate: "xlinkActuate",
	xLinkArcRole: "xlinkArcrole",
	xLinkHref: "xlinkHref",
	xLinkRole: "xlinkRole",
	xLinkShow: "xlinkShow",
	xLinkTitle: "xlinkTitle",
	xLinkType: "xlinkType",
	xmlnsXLink: "xmlnsXlink"
}, p_ = /[A-Z]/g, m_ = /-[a-z]/g, h_ = /^data[-\w.:]+$/i;
function g_(e, t) {
	let n = Gg(t), r = t, i = Kg;
	if (n in e.normal) return e.property[e.normal[n]];
	if (n.length > 4 && n.slice(0, 4) === "data" && h_.test(t)) {
		if (t.charAt(4) === "-") {
			let e = t.slice(5).replace(m_, v_);
			r = "data" + e.charAt(0).toUpperCase() + e.slice(1);
		} else {
			let e = t.slice(4);
			if (!m_.test(e)) {
				let n = e.replace(p_, __);
				n.charAt(0) !== "-" && (n = "-" + n), t = "data" + n;
			}
		}
		i = t_;
	}
	return new i(r, t);
}
function __(e) {
	return "-" + e.toLowerCase();
}
function v_(e) {
	return e.charAt(1).toUpperCase();
}
//#endregion
//#region node_modules/.pnpm/property-information@7.2.0/node_modules/property-information/index.js
var y_ = Wg([
	i_,
	s_,
	l_,
	u_,
	d_
], "html"), b_ = Wg([
	i_,
	c_,
	l_,
	u_,
	d_
], "svg"), x_ = /* @__PURE__ */ n(((e, t) => {
	var n = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, r = /\n/g, i = /^\s*/, a = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/, o = /^:\s*/, s = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/, c = /^[;\s]*/, l = /^\s+|\s+$/g, u = "\n", d = "/", f = "*", p = "", m = "comment", h = "declaration";
	function g(e, t) {
		if (typeof e != "string") throw TypeError("First argument must be a string");
		if (!e) return [];
		t ||= {};
		var l = 1, g = 1;
		function v(e) {
			var t = e.match(r);
			t && (l += t.length);
			var n = e.lastIndexOf(u);
			g = ~n ? e.length - n : g + e.length;
		}
		function y() {
			var e = {
				line: l,
				column: g
			};
			return function(t) {
				return t.position = new b(e), S(), t;
			};
		}
		function b(e) {
			this.start = e, this.end = {
				line: l,
				column: g
			}, this.source = t.source;
		}
		b.prototype.content = e;
		function x(n) {
			var r = /* @__PURE__ */ Error(t.source + ":" + l + ":" + g + ": " + n);
			if (r.reason = n, r.filename = t.source, r.line = l, r.column = g, r.source = e, !t.silent) throw r;
		}
		function ee(t) {
			var n = t.exec(e);
			if (n) {
				var r = n[0];
				return v(r), e = e.slice(r.length), n;
			}
		}
		function S() {
			ee(i);
		}
		function C(e) {
			var t;
			for (e ||= []; t = w();) t !== !1 && e.push(t);
			return e;
		}
		function w() {
			var t = y();
			if (!(d != e.charAt(0) || f != e.charAt(1))) {
				for (var n = 2; p != e.charAt(n) && (f != e.charAt(n) || d != e.charAt(n + 1));) ++n;
				if (n += 2, p === e.charAt(n - 1)) return x("End of comment missing");
				var r = e.slice(2, n - 2);
				return g += 2, v(r), e = e.slice(n), g += 2, t({
					type: m,
					comment: r
				});
			}
		}
		function T() {
			var e = y(), t = ee(a);
			if (t) {
				if (w(), !ee(o)) return x("property missing ':'");
				var r = ee(s), i = e({
					type: h,
					property: _(t[0].replace(n, p)),
					value: r ? _(r[0].replace(n, p)) : p
				});
				return ee(c), i;
			}
		}
		function te() {
			var e = [];
			C(e);
			for (var t; t = T();) t !== !1 && (e.push(t), C(e));
			return e;
		}
		return S(), te();
	}
	function _(e) {
		return e ? e.replace(l, p) : p;
	}
	t.exports = g;
})), S_ = /* @__PURE__ */ n(((e) => {
	var t = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.default = r;
	var n = t(x_());
	function r(e, t) {
		let r = null;
		if (!e || typeof e != "string") return r;
		let i = (0, n.default)(e), a = typeof t == "function";
		return i.forEach((e) => {
			if (e.type !== "declaration") return;
			let { property: n, value: i } = e;
			a ? t(n, i, e) : i && (r ||= {}, r[n] = i);
		}), r;
	}
})), C_ = /* @__PURE__ */ n(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.camelCase = void 0;
	var t = /^--[a-zA-Z0-9_-]+$/, n = /-([a-z])/g, r = /^[^-]+$/, i = /^-(webkit|moz|ms|o|khtml)-/, a = /^-(ms)-/, o = function(e) {
		return !e || r.test(e) || t.test(e);
	}, s = function(e, t) {
		return t.toUpperCase();
	}, c = function(e, t) {
		return `${t}-`;
	};
	e.camelCase = function(e, t) {
		return t === void 0 && (t = {}), o(e) ? e : (e = e.toLowerCase(), e = t.reactCompat ? e.replace(a, c) : e.replace(i, c), e.replace(n, s));
	};
})), w_ = /* @__PURE__ */ n(((e, t) => {
	var n = (e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	})(S_()), r = C_();
	function i(e, t) {
		var i = {};
		return !e || typeof e != "string" || (0, n.default)(e, function(e, n) {
			e && n && (i[(0, r.camelCase)(e, t)] = n);
		}), i;
	}
	i.default = i, t.exports = i;
}));
//#endregion
//#region node_modules/.pnpm/unist-util-stringify-position@4.0.0/node_modules/unist-util-stringify-position/lib/index.js
function T_(e) {
	return !e || typeof e != "object" ? "" : "position" in e || "type" in e ? D_(e.position) : "start" in e || "end" in e ? D_(e) : "line" in e || "column" in e ? E_(e) : "";
}
function E_(e) {
	return O_(e && e.line) + ":" + O_(e && e.column);
}
function D_(e) {
	return E_(e && e.start) + "-" + E_(e && e.end);
}
function O_(e) {
	return e && typeof e == "number" ? e : 1;
}
//#endregion
//#region node_modules/.pnpm/vfile-message@4.0.3/node_modules/vfile-message/lib/index.js
var k_ = class extends Error {
	constructor(e, t, n) {
		super(), typeof t == "string" && (n = t, t = void 0);
		let r = "", i = {}, a = !1;
		if (t && (i = "line" in t && "column" in t || "start" in t && "end" in t ? { place: t } : "type" in t ? {
			ancestors: [t],
			place: t.position
		} : { ...t }), typeof e == "string" ? r = e : !i.cause && e && (a = !0, r = e.message, i.cause = e), !i.ruleId && !i.source && typeof n == "string") {
			let e = n.indexOf(":");
			e === -1 ? i.ruleId = n : (i.source = n.slice(0, e), i.ruleId = n.slice(e + 1));
		}
		if (!i.place && i.ancestors && i.ancestors) {
			let e = i.ancestors[i.ancestors.length - 1];
			e && (i.place = e.position);
		}
		let o = i.place && "start" in i.place ? i.place.start : i.place;
		this.ancestors = i.ancestors || void 0, this.cause = i.cause || void 0, this.column = o ? o.column : void 0, this.fatal = void 0, this.file = "", this.message = r, this.line = o ? o.line : void 0, this.name = T_(i.place) || "1:1", this.place = i.place || void 0, this.reason = this.message, this.ruleId = i.ruleId || void 0, this.source = i.source || void 0, this.stack = a && i.cause && typeof i.cause.stack == "string" ? i.cause.stack : "", this.actual = void 0, this.expected = void 0, this.note = void 0, this.url = void 0;
	}
};
k_.prototype.file = "", k_.prototype.name = "", k_.prototype.reason = "", k_.prototype.message = "", k_.prototype.stack = "", k_.prototype.column = void 0, k_.prototype.line = void 0, k_.prototype.ancestors = void 0, k_.prototype.cause = void 0, k_.prototype.fatal = void 0, k_.prototype.place = void 0, k_.prototype.ruleId = void 0, k_.prototype.source = void 0;
//#endregion
//#region node_modules/.pnpm/hast-util-to-jsx-runtime@2.3.6/node_modules/hast-util-to-jsx-runtime/lib/index.js
var A_ = /* @__PURE__ */ t(w_(), 1), j_ = {}.hasOwnProperty, M_ = /* @__PURE__ */ new Map(), N_ = /[A-Z]/g, P_ = new Set([
	"table",
	"tbody",
	"thead",
	"tfoot",
	"tr"
]), F_ = new Set(["td", "th"]);
function I_(e, t) {
	if (!t || t.Fragment === void 0) throw TypeError("Expected `Fragment` in options");
	let n = t.filePath || void 0, r;
	if (t.development) {
		if (typeof t.jsxDEV != "function") throw TypeError("Expected `jsxDEV` in options when `development: true`");
		r = q_(n, t.jsxDEV);
	} else {
		if (typeof t.jsx != "function") throw TypeError("Expected `jsx` in production options");
		if (typeof t.jsxs != "function") throw TypeError("Expected `jsxs` in production options");
		r = K_(n, t.jsx, t.jsxs);
	}
	let i = {
		Fragment: t.Fragment,
		ancestors: [],
		components: t.components || {},
		create: r,
		elementAttributeNameCase: t.elementAttributeNameCase || "react",
		evaluater: t.createEvaluater ? t.createEvaluater() : void 0,
		filePath: n,
		ignoreInvalidStyle: t.ignoreInvalidStyle || !1,
		passKeys: t.passKeys !== !1,
		passNode: t.passNode || !1,
		schema: t.space === "svg" ? b_ : y_,
		stylePropertyNameCase: t.stylePropertyNameCase || "dom",
		tableCellAlignToStyle: t.tableCellAlignToStyle !== !1
	}, a = L_(i, e, void 0);
	return a && typeof a != "string" ? a : i.create(e, i.Fragment, { children: a || void 0 }, void 0);
}
function L_(e, t, n) {
	if (t.type === "element") return R_(e, t, n);
	if (t.type === "mdxFlowExpression" || t.type === "mdxTextExpression") return z_(e, t);
	if (t.type === "mdxJsxFlowElement" || t.type === "mdxJsxTextElement") return V_(e, t, n);
	if (t.type === "mdxjsEsm") return B_(e, t);
	if (t.type === "root") return H_(e, t, n);
	if (t.type === "text") return U_(e, t);
}
function R_(e, t, n) {
	let r = e.schema, i = r;
	t.tagName.toLowerCase() === "svg" && r.space === "html" && (i = b_, e.schema = i), e.ancestors.push(t);
	let a = $_(e, t.tagName, !1), o = J_(e, t), s = X_(e, t);
	return P_.has(t.tagName) && (s = s.filter(function(e) {
		return typeof e == "string" ? !Vg(e) : !0;
	})), W_(e, o, a, t), G_(o, s), e.ancestors.pop(), e.schema = r, e.create(t, a, o, n);
}
function z_(e, t) {
	if (t.data && t.data.estree && e.evaluater) {
		let n = t.data.estree.body[0];
		return n.type, e.evaluater.evaluateExpression(n.expression);
	}
	ev(e, t.position);
}
function B_(e, t) {
	if (t.data && t.data.estree && e.evaluater) return e.evaluater.evaluateProgram(t.data.estree);
	ev(e, t.position);
}
function V_(e, t, n) {
	let r = e.schema, i = r;
	t.name === "svg" && r.space === "html" && (i = b_, e.schema = i), e.ancestors.push(t);
	let a = t.name === null ? e.Fragment : $_(e, t.name, !0), o = Y_(e, t), s = X_(e, t);
	return W_(e, o, a, t), G_(o, s), e.ancestors.pop(), e.schema = r, e.create(t, a, o, n);
}
function H_(e, t, n) {
	let r = {};
	return G_(r, X_(e, t)), e.create(t, e.Fragment, r, n);
}
function U_(e, t) {
	return t.value;
}
function W_(e, t, n, r) {
	typeof n != "string" && n !== e.Fragment && e.passNode && (t.node = r);
}
function G_(e, t) {
	if (t.length > 0) {
		let n = t.length > 1 ? t : t[0];
		n && (e.children = n);
	}
}
function K_(e, t, n) {
	return r;
	function r(e, r, i, a) {
		let o = Array.isArray(i.children) ? n : t;
		return a ? o(r, i, a) : o(r, i);
	}
}
function q_(e, t) {
	return n;
	function n(n, r, i, a) {
		let o = Array.isArray(i.children), s = fc(n);
		return t(r, i, a, o, {
			columnNumber: s ? s.column - 1 : void 0,
			fileName: e,
			lineNumber: s ? s.line : void 0
		}, void 0);
	}
}
function J_(e, t) {
	let n = {}, r, i;
	for (i in t.properties) if (i !== "children" && j_.call(t.properties, i)) {
		let a = Z_(e, i, t.properties[i]);
		if (a) {
			let [i, o] = a;
			e.tableCellAlignToStyle && i === "align" && typeof o == "string" && F_.has(t.tagName) ? r = o : n[i] = o;
		}
	}
	if (r) {
		let t = n.style ||= {};
		t[e.stylePropertyNameCase === "css" ? "text-align" : "textAlign"] = r;
	}
	return n;
}
function Y_(e, t) {
	let n = {};
	for (let r of t.attributes) if (r.type === "mdxJsxExpressionAttribute") if (r.data && r.data.estree && e.evaluater) {
		let t = r.data.estree.body[0];
		t.type;
		let i = t.expression;
		i.type;
		let a = i.properties[0];
		a.type, Object.assign(n, e.evaluater.evaluateExpression(a.argument));
	} else ev(e, t.position);
	else {
		let i = r.name, a;
		if (r.value && typeof r.value == "object") if (r.value.data && r.value.data.estree && e.evaluater) {
			let t = r.value.data.estree.body[0];
			t.type, a = e.evaluater.evaluateExpression(t.expression);
		} else ev(e, t.position);
		else a = r.value === null ? !0 : r.value;
		n[i] = a;
	}
	return n;
}
function X_(e, t) {
	let n = [], r = -1, i = e.passKeys ? /* @__PURE__ */ new Map() : M_;
	for (; ++r < t.children.length;) {
		let a = t.children[r], o;
		if (e.passKeys) {
			let e = a.type === "element" ? a.tagName : a.type === "mdxJsxFlowElement" || a.type === "mdxJsxTextElement" ? a.name : void 0;
			if (e) {
				let t = i.get(e) || 0;
				o = e + "-" + t, i.set(e, t + 1);
			}
		}
		let s = L_(e, a, o);
		s !== void 0 && n.push(s);
	}
	return n;
}
function Z_(e, t, n) {
	let r = g_(e.schema, t);
	if (!(n == null || typeof n == "number" && Number.isNaN(n))) {
		if (Array.isArray(n) && (n = r.commaSeparated ? vn(n) : Sn(n)), r.property === "style") {
			let t = typeof n == "object" ? n : Q_(e, String(n));
			return e.stylePropertyNameCase === "css" && (t = tv(t)), ["style", t];
		}
		return [e.elementAttributeNameCase === "react" && r.space ? f_[r.property] || r.property : r.attribute, n];
	}
}
function Q_(e, t) {
	try {
		return (0, A_.default)(t, { reactCompat: !0 });
	} catch (t) {
		if (e.ignoreInvalidStyle) return {};
		let n = t, r = new k_("Cannot parse `style` attribute", {
			ancestors: e.ancestors,
			cause: n,
			ruleId: "style",
			source: "hast-util-to-jsx-runtime"
		});
		throw r.file = e.filePath || void 0, r.url = "https://github.com/syntax-tree/hast-util-to-jsx-runtime#cannot-parse-style-attribute", r;
	}
}
function $_(e, t, n) {
	let r;
	if (!n) r = {
		type: "Literal",
		value: t
	};
	else if (t.includes(".")) {
		let e = t.split("."), n = -1, i;
		for (; ++n < e.length;) {
			let t = zg(e[n]) ? {
				type: "Identifier",
				name: e[n]
			} : {
				type: "Literal",
				value: e[n]
			};
			i = i ? {
				type: "MemberExpression",
				object: i,
				property: t,
				computed: !!(n && t.type === "Literal"),
				optional: !1
			} : t;
		}
		r = i;
	} else r = zg(t) && !/^[a-z]/.test(t) ? {
		type: "Identifier",
		name: t
	} : {
		type: "Literal",
		value: t
	};
	if (r.type === "Literal") {
		let t = r.value;
		return j_.call(e.components, t) ? e.components[t] : t;
	}
	if (e.evaluater) return e.evaluater.evaluateExpression(r);
	ev(e);
}
function ev(e, t) {
	let n = new k_("Cannot handle MDX estrees without `createEvaluater`", {
		ancestors: e.ancestors,
		place: t,
		ruleId: "mdx-estree",
		source: "hast-util-to-jsx-runtime"
	});
	throw n.file = e.filePath || void 0, n.url = "https://github.com/syntax-tree/hast-util-to-jsx-runtime#cannot-handle-mdx-estrees-without-createevaluater", n;
}
function tv(e) {
	let t = {}, n;
	for (n in e) j_.call(e, n) && (t[nv(n)] = e[n]);
	return t;
}
function nv(e) {
	let t = e.replace(N_, rv);
	return t.slice(0, 3) === "ms-" && (t = "-" + t), t;
}
function rv(e) {
	return "-" + e.toLowerCase();
}
//#endregion
//#region node_modules/.pnpm/micromark@4.0.2/node_modules/micromark/lib/initialize/content.js
var iv = { tokenize: av };
function av(e) {
	let t = e.attempt(this.parser.constructs.contentInitial, r, i), n;
	return t;
	function r(n) {
		if (n === null) {
			e.consume(n);
			return;
		}
		return e.enter("lineEnding"), e.consume(n), e.exit("lineEnding"), J(e, t, "linePrefix");
	}
	function i(t) {
		return e.enter("paragraph"), a(t);
	}
	function a(t) {
		let r = e.enter("chunkText", {
			contentType: "text",
			previous: n
		});
		return n && (n.next = r), n = r, o(t);
	}
	function o(t) {
		if (t === null) {
			e.exit("chunkText"), e.exit("paragraph"), e.consume(t);
			return;
		}
		return G(t) ? (e.consume(t), e.exit("chunkText"), a) : (e.consume(t), o);
	}
}
//#endregion
//#region node_modules/.pnpm/micromark@4.0.2/node_modules/micromark/lib/initialize/document.js
var ov = { tokenize: cv }, sv = { tokenize: lv };
function cv(e) {
	let t = this, n = [], r = 0, i, a, o;
	return s;
	function s(i) {
		if (r < n.length) {
			let a = n[r];
			return t.containerState = a[1], e.attempt(a[0].continuation, c, l)(i);
		}
		return l(i);
	}
	function c(e) {
		if (r++, t.containerState._closeFlow) {
			t.containerState._closeFlow = void 0, i && v();
			let n = t.events.length, a = n, o;
			for (; a--;) if (t.events[a][0] === "exit" && t.events[a][1].type === "chunkFlow") {
				o = t.events[a][1].end;
				break;
			}
			_(r);
			let s = n;
			for (; s < t.events.length;) t.events[s][1].end = { ...o }, s++;
			return au(t.events, a + 1, 0, t.events.slice(n)), t.events.length = s, l(e);
		}
		return s(e);
	}
	function l(a) {
		if (r === n.length) {
			if (!i) return f(a);
			if (i.currentConstruct && i.currentConstruct.concrete) return m(a);
			t.interrupt = !!(i.currentConstruct && !i._gfmTableDynamicInterruptHack);
		}
		return t.containerState = {}, e.check(sv, u, d)(a);
	}
	function u(e) {
		return i && v(), _(r), f(e);
	}
	function d(e) {
		return t.parser.lazy[t.now().line] = r !== n.length, o = t.now().offset, m(e);
	}
	function f(n) {
		return t.containerState = {}, e.attempt(sv, p, m)(n);
	}
	function p(e) {
		return r++, n.push([t.currentConstruct, t.containerState]), f(e);
	}
	function m(n) {
		if (n === null) {
			i && v(), _(0), e.consume(n);
			return;
		}
		return i ||= t.parser.flow(t.now()), e.enter("chunkFlow", {
			_tokenizer: i,
			contentType: "flow",
			previous: a
		}), h(n);
	}
	function h(n) {
		if (n === null) {
			g(e.exit("chunkFlow"), !0), _(0), e.consume(n);
			return;
		}
		return G(n) ? (e.consume(n), g(e.exit("chunkFlow")), r = 0, t.interrupt = void 0, s) : (e.consume(n), h);
	}
	function g(e, n) {
		let s = t.sliceStream(e);
		if (n && s.push(null), e.previous = a, a && (a.next = e), a = e, i.defineSkip(e.start), i.write(s), t.parser.lazy[e.start.line]) {
			let e = i.events.length;
			for (; e--;) if (i.events[e][1].start.offset < o && (!i.events[e][1].end || i.events[e][1].end.offset > o)) return;
			let n = t.events.length, a = n, s, c;
			for (; a--;) if (t.events[a][0] === "exit" && t.events[a][1].type === "chunkFlow") {
				if (s) {
					c = t.events[a][1].end;
					break;
				}
				s = !0;
			}
			for (_(r), e = n; e < t.events.length;) t.events[e][1].end = { ...c }, e++;
			au(t.events, a + 1, 0, t.events.slice(n)), t.events.length = e;
		}
	}
	function _(r) {
		let i = n.length;
		for (; i-- > r;) {
			let r = n[i];
			t.containerState = r[1], r[0].exit.call(t, e);
		}
		n.length = r;
	}
	function v() {
		i.write([null]), a = void 0, i = void 0, t.containerState._closeFlow = void 0;
	}
}
function lv(e, t, n) {
	return J(e, e.attempt(this.parser.constructs.document, t, n), "linePrefix", this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4);
}
//#endregion
//#region node_modules/.pnpm/micromark@4.0.2/node_modules/micromark/lib/initialize/flow.js
var uv = { tokenize: dv };
function dv(e) {
	let t = this, n = e.attempt(hp, r, e.attempt(this.parser.constructs.flowInitial, i, J(e, e.attempt(this.parser.constructs.flow, i, e.attempt(Vp, i)), "linePrefix")));
	return n;
	function r(r) {
		if (r === null) {
			e.consume(r);
			return;
		}
		return e.enter("lineEndingBlank"), e.consume(r), e.exit("lineEndingBlank"), t.currentConstruct = void 0, n;
	}
	function i(r) {
		if (r === null) {
			e.consume(r);
			return;
		}
		return e.enter("lineEnding"), e.consume(r), e.exit("lineEnding"), t.currentConstruct = void 0, n;
	}
}
//#endregion
//#region node_modules/.pnpm/micromark@4.0.2/node_modules/micromark/lib/initialize/text.js
var fv = { resolveAll: gv() }, pv = hv("string"), mv = hv("text");
function hv(e) {
	return {
		resolveAll: gv(e === "text" ? _v : void 0),
		tokenize: t
	};
	function t(t) {
		let n = this, r = this.parser.constructs[e], i = t.attempt(r, a, o);
		return a;
		function a(e) {
			return c(e) ? i(e) : o(e);
		}
		function o(e) {
			if (e === null) {
				t.consume(e);
				return;
			}
			return t.enter("data"), t.consume(e), s;
		}
		function s(e) {
			return c(e) ? (t.exit("data"), i(e)) : (t.consume(e), s);
		}
		function c(e) {
			if (e === null) return !0;
			let t = r[e], i = -1;
			if (t) for (; ++i < t.length;) {
				let e = t[i];
				if (!e.previous || e.previous.call(n, n.previous)) return !0;
			}
			return !1;
		}
	}
}
function gv(e) {
	return t;
	function t(t, n) {
		let r = -1, i;
		for (; ++r <= t.length;) i === void 0 ? t[r] && t[r][1].type === "data" && (i = r, r++) : (!t[r] || t[r][1].type !== "data") && (r !== i + 2 && (t[i][1].end = t[r - 1][1].end, t.splice(i + 2, r - i - 2), r = i + 2), i = void 0);
		return e ? e(t, n) : t;
	}
}
function _v(e, t) {
	let n = 0;
	for (; ++n <= e.length;) if ((n === e.length || e[n][1].type === "lineEnding") && e[n - 1][1].type === "data") {
		let r = e[n - 1][1], i = t.sliceStream(r), a = i.length, o = -1, s = 0, c;
		for (; a--;) {
			let e = i[a];
			if (typeof e == "string") {
				for (o = e.length; e.charCodeAt(o - 1) === 32;) s++, o--;
				if (o) break;
				o = -1;
			} else if (e === -2) c = !0, s++;
			else if (e !== -1) {
				a++;
				break;
			}
		}
		if (t._contentTypeTextTrailing && n === e.length && (s = 0), s) {
			let i = {
				type: n === e.length || c || s < 2 ? "lineSuffix" : "hardBreakTrailing",
				start: {
					_bufferIndex: a ? o : r.start._bufferIndex + o,
					_index: r.start._index + a,
					line: r.end.line,
					column: r.end.column - s,
					offset: r.end.offset - s
				},
				end: { ...r.end }
			};
			r.end = { ...i.start }, r.start.offset === r.end.offset ? Object.assign(r, i) : (e.splice(n, 0, [
				"enter",
				i,
				t
			], [
				"exit",
				i,
				t
			]), n += 2);
		}
		n++;
	}
	return e;
}
//#endregion
//#region node_modules/.pnpm/micromark@4.0.2/node_modules/micromark/lib/constructs.js
var vv = /* @__PURE__ */ e({
	attentionMarkers: () => Ev,
	contentInitial: () => bv,
	disable: () => Dv,
	document: () => yv,
	flow: () => Sv,
	flowInitial: () => xv,
	insideSpan: () => Tv,
	string: () => Cv,
	text: () => wv
}), yv = {
	42: Pm,
	43: Pm,
	45: Pm,
	48: Pm,
	49: Pm,
	50: Pm,
	51: Pm,
	52: Pm,
	53: Pm,
	54: Pm,
	55: Pm,
	56: Pm,
	57: Pm,
	62: _p
}, bv = { 91: Xp }, xv = {
	[-2]: kp,
	[-1]: kp,
	32: kp
}, Sv = {
	35: nm,
	42: Mm,
	45: [Hm, Mm],
	60: sm,
	61: Hm,
	95: Mm,
	96: Ep,
	126: Ep
}, Cv = {
	38: Cp,
	92: xp
}, wv = {
	[-5]: Am,
	[-4]: Am,
	[-3]: Am,
	33: Em,
	38: Cp,
	42: lp,
	60: [pp, mm],
	91: Om,
	92: [em, xp],
	93: gm,
	95: lp,
	96: Np
}, Tv = { null: [lp, fv] }, Ev = { null: [42, 95] }, Dv = { null: [] };
//#endregion
//#region node_modules/.pnpm/micromark@4.0.2/node_modules/micromark/lib/create-tokenizer.js
function Ov(e, t, n) {
	let r = {
		_bufferIndex: -1,
		_index: 0,
		line: n && n.line || 1,
		column: n && n.column || 1,
		offset: n && n.offset || 0
	}, i = {}, a = [], o = [], s = [], c = {
		attempt: S(x),
		check: S(ee),
		consume: v,
		enter: y,
		exit: b,
		interrupt: S(ee, { interrupt: !0 })
	}, l = {
		code: null,
		containerState: {},
		defineSkip: h,
		events: [],
		now: m,
		parser: e,
		previous: null,
		sliceSerialize: f,
		sliceStream: p,
		write: d
	}, u = t.tokenize.call(l, c);
	return t.resolveAll && a.push(t), l;
	function d(e) {
		return o = ou(o, e), g(), o[o.length - 1] === null ? (C(t, 0), l.events = su(a, l.events, l), l.events) : [];
	}
	function f(e, t) {
		return Av(p(e), t);
	}
	function p(e) {
		return kv(o, e);
	}
	function m() {
		let { _bufferIndex: e, _index: t, line: n, column: i, offset: a } = r;
		return {
			_bufferIndex: e,
			_index: t,
			line: n,
			column: i,
			offset: a
		};
	}
	function h(e) {
		i[e.line] = e.column, T();
	}
	function g() {
		let e;
		for (; r._index < o.length;) {
			let t = o[r._index];
			if (typeof t == "string") for (e = r._index, r._bufferIndex < 0 && (r._bufferIndex = 0); r._index === e && r._bufferIndex < t.length;) _(t.charCodeAt(r._bufferIndex));
			else _(t);
		}
	}
	function _(e) {
		u = u(e);
	}
	function v(e) {
		G(e) ? (r.line++, r.column = 1, r.offset += e === -3 ? 2 : 1, T()) : e !== -1 && (r.column++, r.offset++), r._bufferIndex < 0 ? r._index++ : (r._bufferIndex++, r._bufferIndex === o[r._index].length && (r._bufferIndex = -1, r._index++)), l.previous = e;
	}
	function y(e, t) {
		let n = t || {};
		return n.type = e, n.start = m(), l.events.push([
			"enter",
			n,
			l
		]), s.push(n), n;
	}
	function b(e) {
		let t = s.pop();
		return t.end = m(), l.events.push([
			"exit",
			t,
			l
		]), t;
	}
	function x(e, t) {
		C(e, t.from);
	}
	function ee(e, t) {
		t.restore();
	}
	function S(e, t) {
		return n;
		function n(n, r, i) {
			let a, o, s, u;
			return Array.isArray(n) ? f(n) : "tokenize" in n ? f([n]) : d(n);
			function d(e) {
				return t;
				function t(t) {
					let n = t !== null && e[t], r = t !== null && e.null;
					return f([...Array.isArray(n) ? n : n ? [n] : [], ...Array.isArray(r) ? r : r ? [r] : []])(t);
				}
			}
			function f(e) {
				return a = e, o = 0, e.length === 0 ? i : p(e[o]);
			}
			function p(e) {
				return n;
				function n(n) {
					return u = w(), s = e, e.partial || (l.currentConstruct = e), e.name && l.parser.constructs.disable.null.includes(e.name) ? h(n) : e.tokenize.call(t ? Object.assign(Object.create(l), t) : l, c, m, h)(n);
				}
			}
			function m(t) {
				return e(s, u), r;
			}
			function h(e) {
				return u.restore(), ++o < a.length ? p(a[o]) : i;
			}
		}
	}
	function C(e, t) {
		e.resolveAll && !a.includes(e) && a.push(e), e.resolve && au(l.events, t, l.events.length - t, e.resolve(l.events.slice(t), l)), e.resolveTo && (l.events = e.resolveTo(l.events, l));
	}
	function w() {
		let e = m(), t = l.previous, n = l.currentConstruct, i = l.events.length, a = Array.from(s);
		return {
			from: i,
			restore: o
		};
		function o() {
			r = e, l.previous = t, l.currentConstruct = n, l.events.length = i, s = a, T();
		}
	}
	function T() {
		r.line in i && r.column < 2 && (r.column = i[r.line], r.offset += i[r.line] - 1);
	}
}
function kv(e, t) {
	let n = t.start._index, r = t.start._bufferIndex, i = t.end._index, a = t.end._bufferIndex, o;
	if (n === i) o = [e[n].slice(r, a)];
	else {
		if (o = e.slice(n, i), r > -1) {
			let e = o[0];
			typeof e == "string" ? o[0] = e.slice(r) : o.shift();
		}
		a > 0 && o.push(e[i].slice(0, a));
	}
	return o;
}
function Av(e, t) {
	let n = -1, r = [], i;
	for (; ++n < e.length;) {
		let a = e[n], o;
		if (typeof a == "string") o = a;
		else switch (a) {
			case -5:
				o = "\r";
				break;
			case -4:
				o = "\n";
				break;
			case -3:
				o = "\r\n";
				break;
			case -2:
				o = t ? " " : "	";
				break;
			case -1:
				if (!t && i) continue;
				o = " ";
				break;
			default: o = String.fromCharCode(a);
		}
		i = a === -2, r.push(o);
	}
	return r.join("");
}
//#endregion
//#region node_modules/.pnpm/micromark@4.0.2/node_modules/micromark/lib/parse.js
function jv(e) {
	let t = {
		constructs: Ff([vv, ...(e || {}).extensions || []]),
		content: n(iv),
		defined: [],
		document: n(ov),
		flow: n(uv),
		lazy: {},
		string: n(pv),
		text: n(mv)
	};
	return t;
	function n(e) {
		return n;
		function n(n) {
			return Ov(t, e, n);
		}
	}
}
//#endregion
//#region node_modules/.pnpm/micromark@4.0.2/node_modules/micromark/lib/postprocess.js
function Mv(e) {
	for (; !zp(e););
	return e;
}
//#endregion
//#region node_modules/.pnpm/micromark@4.0.2/node_modules/micromark/lib/preprocess.js
var Nv = /[\0\t\n\r]/g;
function Pv() {
	let e = 1, t = "", n = !0, r;
	return i;
	function i(i, a, o) {
		let s = [], c, l, u, d, f;
		for (i = t + (typeof i == "string" ? i.toString() : new TextDecoder(a || void 0).decode(i)), u = 0, t = "", n &&= (i.charCodeAt(0) === 65279 && u++, void 0); u < i.length;) {
			if (Nv.lastIndex = u, c = Nv.exec(i), d = c && c.index !== void 0 ? c.index : i.length, f = i.charCodeAt(d), !c) {
				t = i.slice(u);
				break;
			}
			if (f === 10 && u === d && r) s.push(-3), r = void 0;
			else switch (r &&= (s.push(-5), void 0), u < d && (s.push(i.slice(u, d)), e += d - u), f) {
				case 0:
					s.push(65533), e++;
					break;
				case 9:
					for (l = Math.ceil(e / 4) * 4, s.push(-2); e++ < l;) s.push(-1);
					break;
				case 10:
					s.push(-4), e = 1;
					break;
				default: r = !0, e = 1;
			}
			u = d + 1;
		}
		return o && (r && s.push(-5), t && s.push(t), s.push(null)), s;
	}
}
//#endregion
//#region node_modules/.pnpm/mdast-util-from-markdown@2.0.3/node_modules/mdast-util-from-markdown/lib/index.js
var Fv = {}.hasOwnProperty;
function Iv(e, t, n) {
	return t && typeof t == "object" && (n = t, t = void 0), Lv(n)(Mv(jv(n).document().write(Pv()(e, t, !0))));
}
function Lv(e) {
	let t = {
		transforms: [],
		canContainEols: [
			"emphasis",
			"fragment",
			"heading",
			"paragraph",
			"strong"
		],
		enter: {
			autolink: a(we),
			autolinkProtocol: w,
			autolinkEmail: w,
			atxHeading: a(A),
			blockQuote: a(ge),
			characterEscape: w,
			characterReference: w,
			codeFenced: a(_e),
			codeFencedFenceInfo: o,
			codeFencedFenceMeta: o,
			codeIndented: a(_e, o),
			codeText: a(ve, o),
			codeTextData: w,
			data: w,
			codeFlowValue: w,
			definition: a(ye),
			definitionDestinationString: o,
			definitionLabelString: o,
			definitionTitleString: o,
			emphasis: a(be),
			hardBreakEscape: a(xe),
			hardBreakTrailing: a(xe),
			htmlFlow: a(Se, o),
			htmlFlowData: w,
			htmlText: a(Se, o),
			htmlTextData: w,
			image: a(Ce),
			label: o,
			link: a(we),
			listItem: a(Ee),
			listItemValue: f,
			listOrdered: a(Te, d),
			listUnordered: a(Te),
			paragraph: a(De),
			reference: le,
			referenceString: o,
			resourceDestinationString: o,
			resourceTitleString: o,
			setextHeading: a(A),
			strong: a(Oe),
			thematicBreak: a(Ae)
		},
		exit: {
			atxHeading: c(),
			atxHeadingSequence: x,
			autolink: c(),
			autolinkEmail: he,
			autolinkProtocol: me,
			blockQuote: c(),
			characterEscapeValue: T,
			characterReferenceMarkerHexadecimal: de,
			characterReferenceMarkerNumeric: de,
			characterReferenceValue: fe,
			characterReference: pe,
			codeFenced: c(g),
			codeFencedFence: h,
			codeFencedFenceInfo: p,
			codeFencedFenceMeta: m,
			codeFlowValue: T,
			codeIndented: c(_),
			codeText: c(ie),
			codeTextData: T,
			data: T,
			definition: c(),
			definitionDestinationString: b,
			definitionLabelString: v,
			definitionTitleString: y,
			emphasis: c(),
			hardBreakEscape: c(E),
			hardBreakTrailing: c(E),
			htmlFlow: c(ne),
			htmlFlowData: T,
			htmlText: c(re),
			htmlTextData: T,
			image: c(O),
			label: oe,
			labelText: ae,
			lineEnding: te,
			link: c(D),
			listItem: c(),
			listOrdered: c(),
			listUnordered: c(),
			paragraph: c(),
			referenceString: ue,
			resourceDestinationString: k,
			resourceTitleString: se,
			resource: ce,
			setextHeading: c(C),
			setextHeadingLineSequence: S,
			setextHeadingText: ee,
			strong: c(),
			thematicBreak: c()
		}
	};
	zv(t, (e || {}).mdastExtensions || []);
	let n = {};
	return r;
	function r(e) {
		let r = {
			type: "root",
			children: []
		}, a = {
			stack: [r],
			tokenStack: [],
			config: t,
			enter: s,
			exit: l,
			buffer: o,
			resume: u,
			data: n
		}, c = [], d = -1;
		for (; ++d < e.length;) (e[d][1].type === "listOrdered" || e[d][1].type === "listUnordered") && (e[d][0] === "enter" ? c.push(d) : d = i(e, c.pop(), d));
		for (d = -1; ++d < e.length;) {
			let n = t[e[d][0]];
			Fv.call(n, e[d][1].type) && n[e[d][1].type].call(Object.assign({ sliceSerialize: e[d][2].sliceSerialize }, a), e[d][1]);
		}
		if (a.tokenStack.length > 0) {
			let e = a.tokenStack[a.tokenStack.length - 1];
			(e[1] || Vv).call(a, void 0, e[0]);
		}
		for (r.position = {
			start: Rv(e.length > 0 ? e[0][1].start : {
				line: 1,
				column: 1,
				offset: 0
			}),
			end: Rv(e.length > 0 ? e[e.length - 2][1].end : {
				line: 1,
				column: 1,
				offset: 0
			})
		}, d = -1; ++d < t.transforms.length;) r = t.transforms[d](r) || r;
		return r;
	}
	function i(e, t, n) {
		let r = t - 1, i = -1, a = !1, o, s, c, l;
		for (; ++r <= n;) {
			let t = e[r];
			switch (t[1].type) {
				case "listUnordered":
				case "listOrdered":
				case "blockQuote":
					t[0] === "enter" ? i++ : i--, l = void 0;
					break;
				case "lineEndingBlank":
					t[0] === "enter" && (o && !l && !i && !c && (c = r), l = void 0);
					break;
				case "linePrefix":
				case "listItemValue":
				case "listItemMarker":
				case "listItemPrefix":
				case "listItemPrefixWhitespace": break;
				default: l = void 0;
			}
			if (!i && t[0] === "enter" && t[1].type === "listItemPrefix" || i === -1 && t[0] === "exit" && (t[1].type === "listUnordered" || t[1].type === "listOrdered")) {
				if (o) {
					let i = r;
					for (s = void 0; i--;) {
						let t = e[i];
						if (t[1].type === "lineEnding" || t[1].type === "lineEndingBlank") {
							if (t[0] === "exit") continue;
							s && (e[s][1].type = "lineEndingBlank", a = !0), t[1].type = "lineEnding", s = i;
						} else if (!(t[1].type === "linePrefix" || t[1].type === "blockQuotePrefix" || t[1].type === "blockQuotePrefixWhitespace" || t[1].type === "blockQuoteMarker" || t[1].type === "listItemIndent")) break;
					}
					c && (!s || c < s) && (o._spread = !0), o.end = Object.assign({}, s ? e[s][1].start : t[1].end), e.splice(s || r, 0, [
						"exit",
						o,
						t[2]
					]), r++, n++;
				}
				if (t[1].type === "listItemPrefix") {
					let i = {
						type: "listItem",
						_spread: !1,
						start: Object.assign({}, t[1].start),
						end: void 0
					};
					o = i, e.splice(r, 0, [
						"enter",
						i,
						t[2]
					]), r++, n++, c = void 0, l = !0;
				}
			}
		}
		return e[t][1]._spread = a, n;
	}
	function a(e, t) {
		return n;
		function n(n) {
			s.call(this, e(n), n), t && t.call(this, n);
		}
	}
	function o() {
		this.stack.push({
			type: "fragment",
			children: []
		});
	}
	function s(e, t, n) {
		this.stack[this.stack.length - 1].children.push(e), this.stack.push(e), this.tokenStack.push([t, n || void 0]), e.position = {
			start: Rv(t.start),
			end: void 0
		};
	}
	function c(e) {
		return t;
		function t(t) {
			e && e.call(this, t), l.call(this, t);
		}
	}
	function l(e, t) {
		let n = this.stack.pop(), r = this.tokenStack.pop();
		if (r) r[0].type !== e.type && (t ? t.call(this, e, r[0]) : (r[1] || Vv).call(this, e, r[0]));
		else throw Error("Cannot close `" + e.type + "` (" + T_({
			start: e.start,
			end: e.end
		}) + "): it’s not open");
		n.position.end = Rv(e.end);
	}
	function u() {
		return kd(this.stack.pop());
	}
	function d() {
		this.data.expectingFirstListItemValue = !0;
	}
	function f(e) {
		if (this.data.expectingFirstListItemValue) {
			let t = this.stack[this.stack.length - 2];
			t.start = Number.parseInt(this.sliceSerialize(e), 10), this.data.expectingFirstListItemValue = void 0;
		}
	}
	function p() {
		let e = this.resume(), t = this.stack[this.stack.length - 1];
		t.lang = e;
	}
	function m() {
		let e = this.resume(), t = this.stack[this.stack.length - 1];
		t.meta = e;
	}
	function h() {
		this.data.flowCodeInside || (this.buffer(), this.data.flowCodeInside = !0);
	}
	function g() {
		let e = this.resume(), t = this.stack[this.stack.length - 1];
		t.value = e.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, ""), this.data.flowCodeInside = void 0;
	}
	function _() {
		let e = this.resume(), t = this.stack[this.stack.length - 1];
		t.value = e.replace(/(\r?\n|\r)$/g, "");
	}
	function v(e) {
		let t = this.resume(), n = this.stack[this.stack.length - 1];
		n.label = t, n.identifier = Ru(this.sliceSerialize(e)).toLowerCase();
	}
	function y() {
		let e = this.resume(), t = this.stack[this.stack.length - 1];
		t.title = e;
	}
	function b() {
		let e = this.resume(), t = this.stack[this.stack.length - 1];
		t.url = e;
	}
	function x(e) {
		let t = this.stack[this.stack.length - 1];
		t.depth ||= this.sliceSerialize(e).length;
	}
	function ee() {
		this.data.setextHeadingSlurpLineEnding = !0;
	}
	function S(e) {
		let t = this.stack[this.stack.length - 1];
		t.depth = this.sliceSerialize(e).codePointAt(0) === 61 ? 1 : 2;
	}
	function C() {
		this.data.setextHeadingSlurpLineEnding = void 0;
	}
	function w(e) {
		let t = this.stack[this.stack.length - 1].children, n = t[t.length - 1];
		(!n || n.type !== "text") && (n = ke(), n.position = {
			start: Rv(e.start),
			end: void 0
		}, t.push(n)), this.stack.push(n);
	}
	function T(e) {
		let t = this.stack.pop();
		t.value += this.sliceSerialize(e), t.position.end = Rv(e.end);
	}
	function te(e) {
		let n = this.stack[this.stack.length - 1];
		if (this.data.atHardBreak) {
			let t = n.children[n.children.length - 1];
			t.position.end = Rv(e.end), this.data.atHardBreak = void 0;
			return;
		}
		!this.data.setextHeadingSlurpLineEnding && t.canContainEols.includes(n.type) && (w.call(this, e), T.call(this, e));
	}
	function E() {
		this.data.atHardBreak = !0;
	}
	function ne() {
		let e = this.resume(), t = this.stack[this.stack.length - 1];
		t.value = e;
	}
	function re() {
		let e = this.resume(), t = this.stack[this.stack.length - 1];
		t.value = e;
	}
	function ie() {
		let e = this.resume(), t = this.stack[this.stack.length - 1];
		t.value = e;
	}
	function D() {
		let e = this.stack[this.stack.length - 1];
		if (this.data.inReference) {
			let t = this.data.referenceType || "shortcut";
			e.type += "Reference", e.referenceType = t, delete e.url, delete e.title;
		} else delete e.identifier, delete e.label;
		this.data.referenceType = void 0;
	}
	function O() {
		let e = this.stack[this.stack.length - 1];
		if (this.data.inReference) {
			let t = this.data.referenceType || "shortcut";
			e.type += "Reference", e.referenceType = t, delete e.url, delete e.title;
		} else delete e.identifier, delete e.label;
		this.data.referenceType = void 0;
	}
	function ae(e) {
		let t = this.sliceSerialize(e), n = this.stack[this.stack.length - 2];
		n.label = gf(t), n.identifier = Ru(t).toLowerCase();
	}
	function oe() {
		let e = this.stack[this.stack.length - 1], t = this.resume(), n = this.stack[this.stack.length - 1];
		this.data.inReference = !0, n.type === "link" ? n.children = e.children : n.alt = t;
	}
	function k() {
		let e = this.resume(), t = this.stack[this.stack.length - 1];
		t.url = e;
	}
	function se() {
		let e = this.resume(), t = this.stack[this.stack.length - 1];
		t.title = e;
	}
	function ce() {
		this.data.inReference = void 0;
	}
	function le() {
		this.data.referenceType = "collapsed";
	}
	function ue(e) {
		let t = this.resume(), n = this.stack[this.stack.length - 1];
		n.label = t, n.identifier = Ru(this.sliceSerialize(e)).toLowerCase(), this.data.referenceType = "full";
	}
	function de(e) {
		this.data.characterReferenceType = e.type;
	}
	function fe(e) {
		let t = this.sliceSerialize(e), n = this.data.characterReferenceType, r;
		n ? (r = mf(t, n === "characterReferenceMarkerNumeric" ? 10 : 16), this.data.characterReferenceType = void 0) : r = pf(t);
		let i = this.stack[this.stack.length - 1];
		i.value += r;
	}
	function pe(e) {
		let t = this.stack.pop();
		t.position.end = Rv(e.end);
	}
	function me(e) {
		T.call(this, e);
		let t = this.stack[this.stack.length - 1];
		t.url = this.sliceSerialize(e);
	}
	function he(e) {
		T.call(this, e);
		let t = this.stack[this.stack.length - 1];
		t.url = "mailto:" + this.sliceSerialize(e);
	}
	function ge() {
		return {
			type: "blockquote",
			children: []
		};
	}
	function _e() {
		return {
			type: "code",
			lang: null,
			meta: null,
			value: ""
		};
	}
	function ve() {
		return {
			type: "inlineCode",
			value: ""
		};
	}
	function ye() {
		return {
			type: "definition",
			identifier: "",
			label: null,
			title: null,
			url: ""
		};
	}
	function be() {
		return {
			type: "emphasis",
			children: []
		};
	}
	function A() {
		return {
			type: "heading",
			depth: 0,
			children: []
		};
	}
	function xe() {
		return { type: "break" };
	}
	function Se() {
		return {
			type: "html",
			value: ""
		};
	}
	function Ce() {
		return {
			type: "image",
			title: null,
			url: "",
			alt: null
		};
	}
	function we() {
		return {
			type: "link",
			title: null,
			url: "",
			children: []
		};
	}
	function Te(e) {
		return {
			type: "list",
			ordered: e.type === "listOrdered",
			start: null,
			spread: e._spread,
			children: []
		};
	}
	function Ee(e) {
		return {
			type: "listItem",
			spread: e._spread,
			checked: null,
			children: []
		};
	}
	function De() {
		return {
			type: "paragraph",
			children: []
		};
	}
	function Oe() {
		return {
			type: "strong",
			children: []
		};
	}
	function ke() {
		return {
			type: "text",
			value: ""
		};
	}
	function Ae() {
		return { type: "thematicBreak" };
	}
}
function Rv(e) {
	return {
		line: e.line,
		column: e.column,
		offset: e.offset
	};
}
function zv(e, t) {
	let n = -1;
	for (; ++n < t.length;) {
		let r = t[n];
		Array.isArray(r) ? zv(e, r) : Bv(e, r);
	}
}
function Bv(e, t) {
	let n;
	for (n in t) if (Fv.call(t, n)) switch (n) {
		case "canContainEols": {
			let r = t[n];
			r && e[n].push(...r);
			break;
		}
		case "transforms": {
			let r = t[n];
			r && e[n].push(...r);
			break;
		}
		case "enter":
		case "exit": {
			let r = t[n];
			r && Object.assign(e[n], r);
			break;
		}
	}
}
function Vv(e, t) {
	throw Error(e ? "Cannot close `" + e.type + "` (" + T_({
		start: e.start,
		end: e.end
	}) + "): a different token (`" + t.type + "`, " + T_({
		start: t.start,
		end: t.end
	}) + ") is open" : "Cannot close document, a token (`" + t.type + "`, " + T_({
		start: t.start,
		end: t.end
	}) + ") is still open");
}
//#endregion
//#region node_modules/.pnpm/remark-parse@11.0.0/node_modules/remark-parse/lib/index.js
function Hv(e) {
	let t = this;
	t.parser = n;
	function n(n) {
		return Iv(n, {
			...t.data("settings"),
			...e,
			extensions: t.data("micromarkExtensions") || [],
			mdastExtensions: t.data("fromMarkdownExtensions") || []
		});
	}
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/blockquote.js
function Uv(e, t) {
	let n = {
		type: "element",
		tagName: "blockquote",
		properties: {},
		children: e.wrap(e.all(t), !0)
	};
	return e.patch(t, n), e.applyData(t, n);
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/break.js
function Wv(e, t) {
	let n = {
		type: "element",
		tagName: "br",
		properties: {},
		children: []
	};
	return e.patch(t, n), [e.applyData(t, n), {
		type: "text",
		value: "\n"
	}];
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/code.js
function Gv(e, t) {
	let n = t.value ? t.value + "\n" : "", r = {}, i = t.lang ? t.lang.split(/\s+/) : [];
	i.length > 0 && (r.className = ["language-" + i[0]]);
	let a = {
		type: "element",
		tagName: "code",
		properties: r,
		children: [{
			type: "text",
			value: n
		}]
	};
	return t.meta && (a.data = { meta: t.meta }), e.patch(t, a), a = e.applyData(t, a), a = {
		type: "element",
		tagName: "pre",
		properties: {},
		children: [a]
	}, e.patch(t, a), a;
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/delete.js
function Kv(e, t) {
	let n = {
		type: "element",
		tagName: "del",
		properties: {},
		children: e.all(t)
	};
	return e.patch(t, n), e.applyData(t, n);
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/emphasis.js
function qv(e, t) {
	let n = {
		type: "element",
		tagName: "em",
		properties: {},
		children: e.all(t)
	};
	return e.patch(t, n), e.applyData(t, n);
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/footnote-reference.js
function Jv(e, t) {
	let n = typeof e.options.clobberPrefix == "string" ? e.options.clobberPrefix : "user-content-", r = String(t.identifier).toUpperCase(), i = cp(r.toLowerCase()), a = e.footnoteOrder.indexOf(r), o, s = e.footnoteCounts.get(r);
	s === void 0 ? (s = 0, e.footnoteOrder.push(r), o = e.footnoteOrder.length) : o = a + 1, s += 1, e.footnoteCounts.set(r, s);
	let c = {
		type: "element",
		tagName: "a",
		properties: {
			href: "#" + n + "fn-" + i,
			id: n + "fnref-" + i + (s > 1 ? "-" + s : ""),
			dataFootnoteRef: !0,
			ariaDescribedBy: ["footnote-label"]
		},
		children: [{
			type: "text",
			value: String(o)
		}]
	};
	e.patch(t, c);
	let l = {
		type: "element",
		tagName: "sup",
		properties: {},
		children: [c]
	};
	return e.patch(t, l), e.applyData(t, l);
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/heading.js
function Yv(e, t) {
	let n = {
		type: "element",
		tagName: "h" + t.depth,
		properties: {},
		children: e.all(t)
	};
	return e.patch(t, n), e.applyData(t, n);
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/html.js
function Xv(e, t) {
	if (e.options.allowDangerousHtml) {
		let n = {
			type: "raw",
			value: t.value
		};
		return e.patch(t, n), e.applyData(t, n);
	}
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/revert.js
function Zv(e, t) {
	let n = t.referenceType, r = "]";
	if (n === "collapsed" ? r += "[]" : n === "full" && (r += "[" + (t.label || t.identifier) + "]"), t.type === "imageReference") return [{
		type: "text",
		value: "![" + t.alt + r
	}];
	let i = e.all(t), a = i[0];
	a && a.type === "text" ? a.value = "[" + a.value : i.unshift({
		type: "text",
		value: "["
	});
	let o = i[i.length - 1];
	return o && o.type === "text" ? o.value += r : i.push({
		type: "text",
		value: r
	}), i;
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/image-reference.js
function Qv(e, t) {
	let n = String(t.identifier).toUpperCase(), r = e.definitionById.get(n);
	if (!r) return Zv(e, t);
	let i = {
		src: cp(r.url || ""),
		alt: t.alt
	};
	r.title !== null && r.title !== void 0 && (i.title = r.title);
	let a = {
		type: "element",
		tagName: "img",
		properties: i,
		children: []
	};
	return e.patch(t, a), e.applyData(t, a);
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/image.js
function $v(e, t) {
	let n = { src: cp(t.url) };
	t.alt !== null && t.alt !== void 0 && (n.alt = t.alt), t.title !== null && t.title !== void 0 && (n.title = t.title);
	let r = {
		type: "element",
		tagName: "img",
		properties: n,
		children: []
	};
	return e.patch(t, r), e.applyData(t, r);
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/inline-code.js
function ey(e, t) {
	let n = {
		type: "text",
		value: t.value.replace(/\r?\n|\r/g, " ")
	};
	e.patch(t, n);
	let r = {
		type: "element",
		tagName: "code",
		properties: {},
		children: [n]
	};
	return e.patch(t, r), e.applyData(t, r);
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/link-reference.js
function ty(e, t) {
	let n = String(t.identifier).toUpperCase(), r = e.definitionById.get(n);
	if (!r) return Zv(e, t);
	let i = { href: cp(r.url || "") };
	r.title !== null && r.title !== void 0 && (i.title = r.title);
	let a = {
		type: "element",
		tagName: "a",
		properties: i,
		children: e.all(t)
	};
	return e.patch(t, a), e.applyData(t, a);
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/link.js
function ny(e, t) {
	let n = { href: cp(t.url) };
	t.title !== null && t.title !== void 0 && (n.title = t.title);
	let r = {
		type: "element",
		tagName: "a",
		properties: n,
		children: e.all(t)
	};
	return e.patch(t, r), e.applyData(t, r);
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/list-item.js
function ry(e, t, n) {
	let r = e.all(t), i = n ? iy(n) : ay(t), a = {}, o = [];
	if (typeof t.checked == "boolean") {
		let e = r[0], n;
		e && e.type === "element" && e.tagName === "p" ? n = e : (n = {
			type: "element",
			tagName: "p",
			properties: {},
			children: []
		}, r.unshift(n)), n.children.length > 0 && n.children.unshift({
			type: "text",
			value: " "
		}), n.children.unshift({
			type: "element",
			tagName: "input",
			properties: {
				type: "checkbox",
				checked: t.checked,
				disabled: !0
			},
			children: []
		}), a.className = ["task-list-item"];
	}
	let s = -1;
	for (; ++s < r.length;) {
		let e = r[s];
		(i || s !== 0 || e.type !== "element" || e.tagName !== "p") && o.push({
			type: "text",
			value: "\n"
		}), e.type === "element" && e.tagName === "p" && !i ? o.push(...e.children) : o.push(e);
	}
	let c = r[r.length - 1];
	c && (i || c.type !== "element" || c.tagName !== "p") && o.push({
		type: "text",
		value: "\n"
	});
	let l = {
		type: "element",
		tagName: "li",
		properties: a,
		children: o
	};
	return e.patch(t, l), e.applyData(t, l);
}
function iy(e) {
	let t = !1;
	if (e.type === "list") {
		t = e.spread || !1;
		let n = e.children, r = -1;
		for (; !t && ++r < n.length;) t = ay(n[r]);
	}
	return t;
}
function ay(e) {
	return e.spread ?? e.children.length > 1;
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/list.js
function oy(e, t) {
	let n = {}, r = e.all(t), i = -1;
	for (typeof t.start == "number" && t.start !== 1 && (n.start = t.start); ++i < r.length;) {
		let e = r[i];
		if (e.type === "element" && e.tagName === "li" && e.properties && Array.isArray(e.properties.className) && e.properties.className.includes("task-list-item")) {
			n.className = ["contains-task-list"];
			break;
		}
	}
	let a = {
		type: "element",
		tagName: t.ordered ? "ol" : "ul",
		properties: n,
		children: e.wrap(r, !0)
	};
	return e.patch(t, a), e.applyData(t, a);
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/paragraph.js
function sy(e, t) {
	let n = {
		type: "element",
		tagName: "p",
		properties: {},
		children: e.all(t)
	};
	return e.patch(t, n), e.applyData(t, n);
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/root.js
function cy(e, t) {
	let n = {
		type: "root",
		children: e.wrap(e.all(t))
	};
	return e.patch(t, n), e.applyData(t, n);
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/strong.js
function ly(e, t) {
	let n = {
		type: "element",
		tagName: "strong",
		properties: {},
		children: e.all(t)
	};
	return e.patch(t, n), e.applyData(t, n);
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/table.js
function uy(e, t) {
	let n = e.all(t), r = n.shift(), i = [];
	if (r) {
		let n = {
			type: "element",
			tagName: "thead",
			properties: {},
			children: e.wrap([r], !0)
		};
		e.patch(t.children[0], n), i.push(n);
	}
	if (n.length > 0) {
		let r = {
			type: "element",
			tagName: "tbody",
			properties: {},
			children: e.wrap(n, !0)
		}, a = fc(t.children[1]), o = dc(t.children[t.children.length - 1]);
		a && o && (r.position = {
			start: a,
			end: o
		}), i.push(r);
	}
	let a = {
		type: "element",
		tagName: "table",
		properties: {},
		children: e.wrap(i, !0)
	};
	return e.patch(t, a), e.applyData(t, a);
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/table-row.js
function dy(e, t, n) {
	let r = n ? n.children : void 0, i = (r ? r.indexOf(t) : 1) === 0 ? "th" : "td", a = n && n.type === "table" ? n.align : void 0, o = a ? a.length : t.children.length, s = -1, c = [];
	for (; ++s < o;) {
		let n = t.children[s], r = {}, o = a ? a[s] : void 0;
		o && (r.align = o);
		let l = {
			type: "element",
			tagName: i,
			properties: r,
			children: []
		};
		n && (l.children = e.all(n), e.patch(n, l), l = e.applyData(n, l)), c.push(l);
	}
	let l = {
		type: "element",
		tagName: "tr",
		properties: {},
		children: e.wrap(c, !0)
	};
	return e.patch(t, l), e.applyData(t, l);
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/table-cell.js
function fy(e, t) {
	let n = {
		type: "element",
		tagName: "td",
		properties: {},
		children: e.all(t)
	};
	return e.patch(t, n), e.applyData(t, n);
}
//#endregion
//#region node_modules/.pnpm/trim-lines@3.0.1/node_modules/trim-lines/index.js
var py = 9, my = 32;
function hy(e) {
	let t = String(e), n = /\r?\n|\r/g, r = n.exec(t), i = 0, a = [];
	for (; r;) a.push(gy(t.slice(i, r.index), i > 0, !0), r[0]), i = r.index + r[0].length, r = n.exec(t);
	return a.push(gy(t.slice(i), i > 0, !1)), a.join("");
}
function gy(e, t, n) {
	let r = 0, i = e.length;
	if (t) {
		let t = e.codePointAt(r);
		for (; t === py || t === my;) r++, t = e.codePointAt(r);
	}
	if (n) {
		let t = e.codePointAt(i - 1);
		for (; t === py || t === my;) i--, t = e.codePointAt(i - 1);
	}
	return i > r ? e.slice(r, i) : "";
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/text.js
function _y(e, t) {
	let n = {
		type: "text",
		value: hy(String(t.value))
	};
	return e.patch(t, n), e.applyData(t, n);
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/thematic-break.js
function vy(e, t) {
	let n = {
		type: "element",
		tagName: "hr",
		properties: {},
		children: []
	};
	return e.patch(t, n), e.applyData(t, n);
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/handlers/index.js
var yy = {
	blockquote: Uv,
	break: Wv,
	code: Gv,
	delete: Kv,
	emphasis: qv,
	footnoteReference: Jv,
	heading: Yv,
	html: Xv,
	imageReference: Qv,
	image: $v,
	inlineCode: ey,
	linkReference: ty,
	link: ny,
	listItem: ry,
	list: oy,
	paragraph: sy,
	root: cy,
	strong: ly,
	table: uy,
	tableCell: fy,
	tableRow: dy,
	text: _y,
	thematicBreak: vy,
	toml: by,
	yaml: by,
	definition: by,
	footnoteDefinition: by
};
function by() {}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/footer.js
function xy(e, t) {
	let n = [{
		type: "text",
		value: "↩"
	}];
	return t > 1 && n.push({
		type: "element",
		tagName: "sup",
		properties: {},
		children: [{
			type: "text",
			value: String(t)
		}]
	}), n;
}
function Sy(e, t) {
	return "Back to reference " + (e + 1) + (t > 1 ? "-" + t : "");
}
function Cy(e) {
	let t = typeof e.options.clobberPrefix == "string" ? e.options.clobberPrefix : "user-content-", n = e.options.footnoteBackContent || xy, r = e.options.footnoteBackLabel || Sy, i = e.options.footnoteLabel || "Footnotes", a = e.options.footnoteLabelTagName || "h2", o = e.options.footnoteLabelProperties || { className: ["sr-only"] }, s = [], c = -1;
	for (; ++c < e.footnoteOrder.length;) {
		let i = e.footnoteById.get(e.footnoteOrder[c]);
		if (!i) continue;
		let a = e.all(i), o = String(i.identifier).toUpperCase(), l = cp(o.toLowerCase()), u = 0, d = [], f = e.footnoteCounts.get(o);
		for (; f !== void 0 && ++u <= f;) {
			d.length > 0 && d.push({
				type: "text",
				value: " "
			});
			let e = typeof n == "string" ? n : n(c, u);
			typeof e == "string" && (e = {
				type: "text",
				value: e
			}), d.push({
				type: "element",
				tagName: "a",
				properties: {
					href: "#" + t + "fnref-" + l + (u > 1 ? "-" + u : ""),
					dataFootnoteBackref: "",
					ariaLabel: typeof r == "string" ? r : r(c, u),
					className: ["data-footnote-backref"]
				},
				children: Array.isArray(e) ? e : [e]
			});
		}
		let p = a[a.length - 1];
		if (p && p.type === "element" && p.tagName === "p") {
			let e = p.children[p.children.length - 1];
			e && e.type === "text" ? e.value += " " : p.children.push({
				type: "text",
				value: " "
			}), p.children.push(...d);
		} else a.push(...d);
		let m = {
			type: "element",
			tagName: "li",
			properties: { id: t + "fn-" + l },
			children: e.wrap(a, !0)
		};
		e.patch(i, m), s.push(m);
	}
	if (s.length !== 0) return {
		type: "element",
		tagName: "section",
		properties: {
			dataFootnotes: !0,
			className: ["footnotes"]
		},
		children: [
			{
				type: "element",
				tagName: a,
				properties: {
					...jr(o),
					id: "footnote-label"
				},
				children: [{
					type: "text",
					value: i
				}]
			},
			{
				type: "text",
				value: "\n"
			},
			{
				type: "element",
				tagName: "ol",
				properties: {},
				children: e.wrap(s, !0)
			},
			{
				type: "text",
				value: "\n"
			}
		]
	};
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/state.js
var wy = {}.hasOwnProperty, Ty = {};
function Ey(e, t) {
	let n = t || Ty, r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), a = {
		all: s,
		applyData: Oy,
		definitionById: r,
		footnoteById: i,
		footnoteCounts: /* @__PURE__ */ new Map(),
		footnoteOrder: [],
		handlers: {
			...yy,
			...n.handlers
		},
		one: o,
		options: n,
		patch: Dy,
		wrap: Ay
	};
	return Et(e, function(e) {
		if (e.type === "definition" || e.type === "footnoteDefinition") {
			let t = e.type === "definition" ? r : i, n = String(e.identifier).toUpperCase();
			t.has(n) || t.set(n, e);
		}
	}), a;
	function o(e, t) {
		let n = e.type, r = a.handlers[n];
		if (wy.call(a.handlers, n) && r) return r(a, e, t);
		if (a.options.passThrough && a.options.passThrough.includes(n)) {
			if ("children" in e) {
				let { children: t, ...n } = e, r = jr(n);
				return r.children = a.all(e), r;
			}
			return jr(e);
		}
		return (a.options.unknownHandler || ky)(a, e, t);
	}
	function s(e) {
		let t = [];
		if ("children" in e) {
			let n = e.children, r = -1;
			for (; ++r < n.length;) {
				let i = a.one(n[r], e);
				if (i) {
					if (r && n[r - 1].type === "break" && (!Array.isArray(i) && i.type === "text" && (i.value = jy(i.value)), !Array.isArray(i) && i.type === "element")) {
						let e = i.children[0];
						e && e.type === "text" && (e.value = jy(e.value));
					}
					Array.isArray(i) ? t.push(...i) : t.push(i);
				}
			}
		}
		return t;
	}
}
function Dy(e, t) {
	e.position && (t.position = mc(e));
}
function Oy(e, t) {
	let n = t;
	if (e && e.data) {
		let t = e.data.hName, r = e.data.hChildren, i = e.data.hProperties;
		typeof t == "string" && (n.type === "element" ? n.tagName = t : n = {
			type: "element",
			tagName: t,
			properties: {},
			children: "children" in n ? n.children : [n]
		}), n.type === "element" && i && Object.assign(n.properties, jr(i)), "children" in n && n.children && r != null && (n.children = r);
	}
	return n;
}
function ky(e, t) {
	let n = t.data || {}, r = "value" in t && !(wy.call(n, "hProperties") || wy.call(n, "hChildren")) ? {
		type: "text",
		value: t.value
	} : {
		type: "element",
		tagName: "div",
		properties: {},
		children: e.all(t)
	};
	return e.patch(t, r), e.applyData(t, r);
}
function Ay(e, t) {
	let n = [], r = -1;
	for (t && n.push({
		type: "text",
		value: "\n"
	}); ++r < e.length;) r && n.push({
		type: "text",
		value: "\n"
	}), n.push(e[r]);
	return t && e.length > 0 && n.push({
		type: "text",
		value: "\n"
	}), n;
}
function jy(e) {
	let t = 0, n = e.charCodeAt(t);
	for (; n === 9 || n === 32;) t++, n = e.charCodeAt(t);
	return e.slice(t);
}
//#endregion
//#region node_modules/.pnpm/mdast-util-to-hast@13.2.1/node_modules/mdast-util-to-hast/lib/index.js
function My(e, t) {
	let n = Ey(e, t), r = n.one(e, void 0), i = Cy(n), a = Array.isArray(r) ? {
		type: "root",
		children: r
	} : r || {
		type: "root",
		children: []
	};
	return i && ("children" in a, a.children.push({
		type: "text",
		value: "\n"
	}, i)), a;
}
//#endregion
//#region node_modules/.pnpm/remark-rehype@11.1.2/node_modules/remark-rehype/lib/index.js
function Ny(e, t) {
	return e && "run" in e ? async function(n, r) {
		let i = My(n, {
			file: r,
			...t
		});
		await e.run(i, r);
	} : function(n, r) {
		return My(n, {
			file: r,
			...e || t
		});
	};
}
//#endregion
//#region node_modules/.pnpm/bail@2.0.2/node_modules/bail/index.js
function Py(e) {
	if (e) throw e;
}
//#endregion
//#region node_modules/.pnpm/is-plain-obj@4.1.0/node_modules/is-plain-obj/index.js
var Fy = /* @__PURE__ */ t((/* @__PURE__ */ n(((e, t) => {
	var n = Object.prototype.hasOwnProperty, r = Object.prototype.toString, i = Object.defineProperty, a = Object.getOwnPropertyDescriptor, o = function(e) {
		return typeof Array.isArray == "function" ? Array.isArray(e) : r.call(e) === "[object Array]";
	}, s = function(e) {
		if (!e || r.call(e) !== "[object Object]") return !1;
		var t = n.call(e, "constructor"), i = e.constructor && e.constructor.prototype && n.call(e.constructor.prototype, "isPrototypeOf");
		if (e.constructor && !t && !i) return !1;
		for (var a in e);
		return a === void 0 || n.call(e, a);
	}, c = function(e, t) {
		i && t.name === "__proto__" ? i(e, t.name, {
			enumerable: !0,
			configurable: !0,
			value: t.newValue,
			writable: !0
		}) : e[t.name] = t.newValue;
	}, l = function(e, t) {
		if (t === "__proto__") {
			if (!n.call(e, t)) return;
			if (a) return a(e, t).value;
		}
		return e[t];
	};
	t.exports = function e() {
		var t, n, r, i, a, u, d = arguments[0], f = 1, p = arguments.length, m = !1;
		for (typeof d == "boolean" && (m = d, d = arguments[1] || {}, f = 2), (d == null || typeof d != "object" && typeof d != "function") && (d = {}); f < p; ++f) if (t = arguments[f], t != null) for (n in t) r = l(d, n), i = l(t, n), d !== i && (m && i && (s(i) || (a = o(i))) ? (a ? (a = !1, u = r && o(r) ? r : []) : u = r && s(r) ? r : {}, c(d, {
			name: n,
			newValue: e(m, u, i)
		})) : i !== void 0 && c(d, {
			name: n,
			newValue: i
		}));
		return d;
	};
})))(), 1);
function Iy(e) {
	if (typeof e != "object" || !e) return !1;
	let t = Object.getPrototypeOf(e);
	return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Symbol.toStringTag in e) && !(Symbol.iterator in e);
}
//#endregion
//#region node_modules/.pnpm/trough@2.2.0/node_modules/trough/lib/index.js
function Ly() {
	let e = [], t = {
		run: n,
		use: r
	};
	return t;
	function n(...t) {
		let n = -1, r = t.pop();
		if (typeof r != "function") throw TypeError("Expected function as last argument, not " + r);
		i(null, ...t);
		function i(a, ...o) {
			let s = e[++n], c = -1;
			if (a) {
				r(a);
				return;
			}
			for (; ++c < t.length;) (o[c] === null || o[c] === void 0) && (o[c] = t[c]);
			t = o, s ? Ry(s, i)(...o) : r(null, ...o);
		}
	}
	function r(n) {
		if (typeof n != "function") throw TypeError("Expected `middelware` to be a function, not " + n);
		return e.push(n), t;
	}
}
function Ry(e, t) {
	let n;
	return r;
	function r(...t) {
		let r = e.length > t.length, o;
		r && t.push(i);
		try {
			o = e.apply(this, t);
		} catch (e) {
			let t = e;
			if (r && n) throw t;
			return i(t);
		}
		r || (o && o.then && typeof o.then == "function" ? o.then(a, i) : o instanceof Error ? i(o) : a(o));
	}
	function i(e, ...r) {
		n || (n = !0, t(e, ...r));
	}
	function a(e) {
		i(null, e);
	}
}
//#endregion
//#region node_modules/.pnpm/vfile@6.0.3/node_modules/vfile/lib/minpath.browser.js
var zy = {
	basename: By,
	dirname: Vy,
	extname: Hy,
	join: Uy,
	sep: "/"
};
function By(e, t) {
	if (t !== void 0 && typeof t != "string") throw TypeError("\"ext\" argument must be a string");
	Ky(e);
	let n = 0, r = -1, i = e.length, a;
	if (t === void 0 || t.length === 0 || t.length > e.length) {
		for (; i--;) if (e.codePointAt(i) === 47) {
			if (a) {
				n = i + 1;
				break;
			}
		} else r < 0 && (a = !0, r = i + 1);
		return r < 0 ? "" : e.slice(n, r);
	}
	if (t === e) return "";
	let o = -1, s = t.length - 1;
	for (; i--;) if (e.codePointAt(i) === 47) {
		if (a) {
			n = i + 1;
			break;
		}
	} else o < 0 && (a = !0, o = i + 1), s > -1 && (e.codePointAt(i) === t.codePointAt(s--) ? s < 0 && (r = i) : (s = -1, r = o));
	return n === r ? r = o : r < 0 && (r = e.length), e.slice(n, r);
}
function Vy(e) {
	if (Ky(e), e.length === 0) return ".";
	let t = -1, n = e.length, r;
	for (; --n;) if (e.codePointAt(n) === 47) {
		if (r) {
			t = n;
			break;
		}
	} else r ||= !0;
	return t < 0 ? e.codePointAt(0) === 47 ? "/" : "." : t === 1 && e.codePointAt(0) === 47 ? "//" : e.slice(0, t);
}
function Hy(e) {
	Ky(e);
	let t = e.length, n = -1, r = 0, i = -1, a = 0, o;
	for (; t--;) {
		let s = e.codePointAt(t);
		if (s === 47) {
			if (o) {
				r = t + 1;
				break;
			}
			continue;
		}
		n < 0 && (o = !0, n = t + 1), s === 46 ? i < 0 ? i = t : a !== 1 && (a = 1) : i > -1 && (a = -1);
	}
	return i < 0 || n < 0 || a === 0 || a === 1 && i === n - 1 && i === r + 1 ? "" : e.slice(i, n);
}
function Uy(...e) {
	let t = -1, n;
	for (; ++t < e.length;) Ky(e[t]), e[t] && (n = n === void 0 ? e[t] : n + "/" + e[t]);
	return n === void 0 ? "." : Wy(n);
}
function Wy(e) {
	Ky(e);
	let t = e.codePointAt(0) === 47, n = Gy(e, !t);
	return n.length === 0 && !t && (n = "."), n.length > 0 && e.codePointAt(e.length - 1) === 47 && (n += "/"), t ? "/" + n : n;
}
function Gy(e, t) {
	let n = "", r = 0, i = -1, a = 0, o = -1, s, c;
	for (; ++o <= e.length;) {
		if (o < e.length) s = e.codePointAt(o);
		else if (s === 47) break;
		else s = 47;
		if (s === 47) {
			if (!(i === o - 1 || a === 1)) if (i !== o - 1 && a === 2) {
				if (n.length < 2 || r !== 2 || n.codePointAt(n.length - 1) !== 46 || n.codePointAt(n.length - 2) !== 46) {
					if (n.length > 2) {
						if (c = n.lastIndexOf("/"), c !== n.length - 1) {
							c < 0 ? (n = "", r = 0) : (n = n.slice(0, c), r = n.length - 1 - n.lastIndexOf("/")), i = o, a = 0;
							continue;
						}
					} else if (n.length > 0) {
						n = "", r = 0, i = o, a = 0;
						continue;
					}
				}
				t && (n = n.length > 0 ? n + "/.." : "..", r = 2);
			} else n.length > 0 ? n += "/" + e.slice(i + 1, o) : n = e.slice(i + 1, o), r = o - i - 1;
			i = o, a = 0;
		} else s === 46 && a > -1 ? a++ : a = -1;
	}
	return n;
}
function Ky(e) {
	if (typeof e != "string") throw TypeError("Path must be a string. Received " + JSON.stringify(e));
}
//#endregion
//#region node_modules/.pnpm/vfile@6.0.3/node_modules/vfile/lib/minproc.browser.js
var qy = { cwd: Jy };
function Jy() {
	return "/";
}
//#endregion
//#region node_modules/.pnpm/vfile@6.0.3/node_modules/vfile/lib/minurl.shared.js
function Yy(e) {
	return !!(typeof e == "object" && e && "href" in e && e.href && "protocol" in e && e.protocol && e.auth === void 0);
}
//#endregion
//#region node_modules/.pnpm/vfile@6.0.3/node_modules/vfile/lib/minurl.browser.js
function Xy(e) {
	if (typeof e == "string") e = new URL(e);
	else if (!Yy(e)) {
		let t = /* @__PURE__ */ TypeError("The \"path\" argument must be of type string or an instance of URL. Received `" + e + "`");
		throw t.code = "ERR_INVALID_ARG_TYPE", t;
	}
	if (e.protocol !== "file:") {
		let e = /* @__PURE__ */ TypeError("The URL must be of scheme file");
		throw e.code = "ERR_INVALID_URL_SCHEME", e;
	}
	return Zy(e);
}
function Zy(e) {
	if (e.hostname !== "") {
		let e = /* @__PURE__ */ TypeError("File URL host must be \"localhost\" or empty on darwin");
		throw e.code = "ERR_INVALID_FILE_URL_HOST", e;
	}
	let t = e.pathname, n = -1;
	for (; ++n < t.length;) if (t.codePointAt(n) === 37 && t.codePointAt(n + 1) === 50) {
		let e = t.codePointAt(n + 2);
		if (e === 70 || e === 102) {
			let e = /* @__PURE__ */ TypeError("File URL path must not include encoded / characters");
			throw e.code = "ERR_INVALID_FILE_URL_PATH", e;
		}
	}
	return decodeURIComponent(t);
}
//#endregion
//#region node_modules/.pnpm/vfile@6.0.3/node_modules/vfile/lib/index.js
var Qy = [
	"history",
	"path",
	"basename",
	"stem",
	"extname",
	"dirname"
], $y = class {
	constructor(e) {
		let t;
		t = e ? Yy(e) ? { path: e } : typeof e == "string" || rb(e) ? { value: e } : e : {}, this.cwd = "cwd" in t ? "" : qy.cwd(), this.data = {}, this.history = [], this.messages = [], this.value, this.map, this.result, this.stored;
		let n = -1;
		for (; ++n < Qy.length;) {
			let e = Qy[n];
			e in t && t[e] !== void 0 && t[e] !== null && (this[e] = e === "history" ? [...t[e]] : t[e]);
		}
		let r;
		for (r in t) Qy.includes(r) || (this[r] = t[r]);
	}
	get basename() {
		return typeof this.path == "string" ? zy.basename(this.path) : void 0;
	}
	set basename(e) {
		tb(e, "basename"), eb(e, "basename"), this.path = zy.join(this.dirname || "", e);
	}
	get dirname() {
		return typeof this.path == "string" ? zy.dirname(this.path) : void 0;
	}
	set dirname(e) {
		nb(this.basename, "dirname"), this.path = zy.join(e || "", this.basename);
	}
	get extname() {
		return typeof this.path == "string" ? zy.extname(this.path) : void 0;
	}
	set extname(e) {
		if (eb(e, "extname"), nb(this.dirname, "extname"), e) {
			if (e.codePointAt(0) !== 46) throw Error("`extname` must start with `.`");
			if (e.includes(".", 1)) throw Error("`extname` cannot contain multiple dots");
		}
		this.path = zy.join(this.dirname, this.stem + (e || ""));
	}
	get path() {
		return this.history[this.history.length - 1];
	}
	set path(e) {
		Yy(e) && (e = Xy(e)), tb(e, "path"), this.path !== e && this.history.push(e);
	}
	get stem() {
		return typeof this.path == "string" ? zy.basename(this.path, this.extname) : void 0;
	}
	set stem(e) {
		tb(e, "stem"), eb(e, "stem"), this.path = zy.join(this.dirname || "", e + (this.extname || ""));
	}
	fail(e, t, n) {
		let r = this.message(e, t, n);
		throw r.fatal = !0, r;
	}
	info(e, t, n) {
		let r = this.message(e, t, n);
		return r.fatal = void 0, r;
	}
	message(e, t, n) {
		let r = new k_(e, t, n);
		return this.path && (r.name = this.path + ":" + r.name, r.file = this.path), r.fatal = !1, this.messages.push(r), r;
	}
	toString(e) {
		return this.value === void 0 ? "" : typeof this.value == "string" ? this.value : new TextDecoder(e || void 0).decode(this.value);
	}
};
function eb(e, t) {
	if (e && e.includes(zy.sep)) throw Error("`" + t + "` cannot be a path: did not expect `" + zy.sep + "`");
}
function tb(e, t) {
	if (!e) throw Error("`" + t + "` cannot be empty");
}
function nb(e, t) {
	if (!e) throw Error("Setting `" + t + "` requires `path` to be set too");
}
function rb(e) {
	return !!(e && typeof e == "object" && "byteLength" in e && "byteOffset" in e);
}
//#endregion
//#region node_modules/.pnpm/unified@11.0.5/node_modules/unified/lib/callable-instance.js
var ib = (function(e) {
	let t = this.constructor.prototype, n = t[e], r = function() {
		return n.apply(r, arguments);
	};
	return Object.setPrototypeOf(r, t), r;
}), ab = {}.hasOwnProperty, ob = new class e extends ib {
	constructor() {
		super("copy"), this.Compiler = void 0, this.Parser = void 0, this.attachers = [], this.compiler = void 0, this.freezeIndex = -1, this.frozen = void 0, this.namespace = {}, this.parser = void 0, this.transformers = Ly();
	}
	copy() {
		let t = new e(), n = -1;
		for (; ++n < this.attachers.length;) {
			let e = this.attachers[n];
			t.use(...e);
		}
		return t.data((0, Fy.default)(!0, {}, this.namespace)), t;
	}
	data(e, t) {
		return typeof e == "string" ? arguments.length === 2 ? (lb("data", this.frozen), this.namespace[e] = t, this) : ab.call(this.namespace, e) && this.namespace[e] || void 0 : e ? (lb("data", this.frozen), this.namespace = e, this) : this.namespace;
	}
	freeze() {
		if (this.frozen) return this;
		let e = this;
		for (; ++this.freezeIndex < this.attachers.length;) {
			let [t, ...n] = this.attachers[this.freezeIndex];
			if (n[0] === !1) continue;
			n[0] === !0 && (n[0] = void 0);
			let r = t.call(e, ...n);
			typeof r == "function" && this.transformers.use(r);
		}
		return this.frozen = !0, this.freezeIndex = Infinity, this;
	}
	parse(e) {
		this.freeze();
		let t = fb(e), n = this.parser || this.Parser;
		return sb("parse", n), n(String(t), t);
	}
	process(e, t) {
		let n = this;
		return this.freeze(), sb("process", this.parser || this.Parser), cb("process", this.compiler || this.Compiler), t ? r(void 0, t) : new Promise(r);
		function r(r, i) {
			let a = fb(e), o = n.parse(a);
			n.run(o, a, function(e, t, r) {
				if (e || !t || !r) return s(e);
				let i = t, a = n.stringify(i, r);
				mb(a) ? r.value = a : r.result = a, s(e, r);
			});
			function s(e, n) {
				e || !n ? i(e) : r ? r(n) : t(void 0, n);
			}
		}
	}
	processSync(e) {
		let t = !1, n;
		return this.freeze(), sb("processSync", this.parser || this.Parser), cb("processSync", this.compiler || this.Compiler), this.process(e, r), db("processSync", "process", t), n;
		function r(e, r) {
			t = !0, Py(e), n = r;
		}
	}
	run(e, t, n) {
		ub(e), this.freeze();
		let r = this.transformers;
		return !n && typeof t == "function" && (n = t, t = void 0), n ? i(void 0, n) : new Promise(i);
		function i(i, a) {
			let o = fb(t);
			r.run(e, o, s);
			function s(t, r, o) {
				let s = r || e;
				t ? a(t) : i ? i(s) : n(void 0, s, o);
			}
		}
	}
	runSync(e, t) {
		let n = !1, r;
		return this.run(e, t, i), db("runSync", "run", n), r;
		function i(e, t) {
			Py(e), r = t, n = !0;
		}
	}
	stringify(e, t) {
		this.freeze();
		let n = fb(t), r = this.compiler || this.Compiler;
		return cb("stringify", r), ub(e), r(e, n);
	}
	use(e, ...t) {
		let n = this.attachers, r = this.namespace;
		if (lb("use", this.frozen), e != null) if (typeof e == "function") s(e, t);
		else if (typeof e == "object") Array.isArray(e) ? o(e) : a(e);
		else throw TypeError("Expected usable value, not `" + e + "`");
		return this;
		function i(e) {
			if (typeof e == "function") s(e, []);
			else if (typeof e == "object") if (Array.isArray(e)) {
				let [t, ...n] = e;
				s(t, n);
			} else a(e);
			else throw TypeError("Expected usable value, not `" + e + "`");
		}
		function a(e) {
			if (!("plugins" in e) && !("settings" in e)) throw Error("Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither");
			o(e.plugins), e.settings && (r.settings = (0, Fy.default)(!0, r.settings, e.settings));
		}
		function o(e) {
			let t = -1;
			if (e != null) if (Array.isArray(e)) for (; ++t < e.length;) {
				let n = e[t];
				i(n);
			}
			else throw TypeError("Expected a list of plugins, not `" + e + "`");
		}
		function s(e, t) {
			let r = -1, i = -1;
			for (; ++r < n.length;) if (n[r][0] === e) {
				i = r;
				break;
			}
			if (i === -1) n.push([e, ...t]);
			else if (t.length > 0) {
				let [r, ...a] = t, o = n[i][1];
				Iy(o) && Iy(r) && (r = (0, Fy.default)(!0, o, r)), n[i] = [
					e,
					r,
					...a
				];
			}
		}
	}
}().freeze();
function sb(e, t) {
	if (typeof t != "function") throw TypeError("Cannot `" + e + "` without `parser`");
}
function cb(e, t) {
	if (typeof t != "function") throw TypeError("Cannot `" + e + "` without `compiler`");
}
function lb(e, t) {
	if (t) throw Error("Cannot call `" + e + "` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`.");
}
function ub(e) {
	if (!Iy(e) || typeof e.type != "string") throw TypeError("Expected node, got `" + e + "`");
}
function db(e, t, n) {
	if (!n) throw Error("`" + e + "` finished async. Use `" + t + "` instead");
}
function fb(e) {
	return pb(e) ? e : new $y(e);
}
function pb(e) {
	return !!(e && typeof e == "object" && "message" in e && "messages" in e);
}
function mb(e) {
	return typeof e == "string" || hb(e);
}
function hb(e) {
	return !!(e && typeof e == "object" && "byteLength" in e && "byteOffset" in e);
}
//#endregion
//#region node_modules/.pnpm/streamdown@1.6.11_@types+mdast@4.0.4_micromark-util-types@2.0.2_micromark@4.0.2_react@19.2.6/node_modules/streamdown/dist/chunk-JAPRZBRM.js
var Q = dt(), $ = (...e) => lt(pt(e)), gb = (e, t, n) => {
	let r = typeof t == "string" ? new Blob([t], { type: n }) : t, i = URL.createObjectURL(r), a = document.createElement("a");
	a.href = i, a.download = e, document.body.appendChild(a), a.click(), document.body.removeChild(a), URL.revokeObjectURL(i);
}, _b = (0, s.createContext)({ code: "" }), vb = () => (0, s.useContext)(_b), yb = ({ onCopy: e, onError: t, timeout: n = 2e3, children: r, className: i, code: a, ...o }) => {
	let [c, l] = (0, s.useState)(!1), u = (0, s.useRef)(0), { code: d } = vb(), { isAnimating: f } = (0, s.useContext)(zx), p = a ?? d, m = async () => {
		var r;
		if (typeof window > "u" || !((r = navigator == null ? void 0 : navigator.clipboard) != null && r.writeText)) {
			t?.(/* @__PURE__ */ Error("Clipboard API not available"));
			return;
		}
		try {
			c || (await navigator.clipboard.writeText(p), l(!0), e?.(), u.current = window.setTimeout(() => l(!1), n));
		} catch (e) {
			t?.(e);
		}
	};
	(0, s.useEffect)(() => () => {
		window.clearTimeout(u.current);
	}, []);
	let h = c ? Dg : Og;
	return (0, Q.jsx)("button", {
		className: $("cursor-pointer p-1 text-muted-foreground transition-all hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50", i),
		"data-streamdown": "code-block-copy-button",
		disabled: f,
		onClick: m,
		title: "Copy Code",
		type: "button",
		...o,
		children: r ?? (0, Q.jsx)(h, { size: 14 })
	});
}, bb = {
	"1c": "1c",
	"1c-query": "1cq",
	abap: "abap",
	"actionscript-3": "as",
	ada: "ada",
	adoc: "adoc",
	"angular-html": "html",
	"angular-ts": "ts",
	apache: "conf",
	apex: "cls",
	apl: "apl",
	applescript: "applescript",
	ara: "ara",
	asciidoc: "adoc",
	asm: "asm",
	astro: "astro",
	awk: "awk",
	ballerina: "bal",
	bash: "sh",
	bat: "bat",
	batch: "bat",
	be: "be",
	beancount: "beancount",
	berry: "berry",
	bibtex: "bib",
	bicep: "bicep",
	blade: "blade.php",
	bsl: "bsl",
	c: "c",
	"c#": "cs",
	"c++": "cpp",
	cadence: "cdc",
	cairo: "cairo",
	cdc: "cdc",
	clarity: "clar",
	clj: "clj",
	clojure: "clj",
	"closure-templates": "soy",
	cmake: "cmake",
	cmd: "cmd",
	cobol: "cob",
	codeowners: "CODEOWNERS",
	codeql: "ql",
	coffee: "coffee",
	coffeescript: "coffee",
	"common-lisp": "lisp",
	console: "sh",
	coq: "v",
	cpp: "cpp",
	cql: "cql",
	crystal: "cr",
	cs: "cs",
	csharp: "cs",
	css: "css",
	csv: "csv",
	cue: "cue",
	cypher: "cql",
	d: "d",
	dart: "dart",
	dax: "dax",
	desktop: "desktop",
	diff: "diff",
	docker: "dockerfile",
	dockerfile: "dockerfile",
	dotenv: "env",
	"dream-maker": "dm",
	edge: "edge",
	elisp: "el",
	elixir: "ex",
	elm: "elm",
	"emacs-lisp": "el",
	erb: "erb",
	erl: "erl",
	erlang: "erl",
	f: "f",
	"f#": "fs",
	f03: "f03",
	f08: "f08",
	f18: "f18",
	f77: "f77",
	f90: "f90",
	f95: "f95",
	fennel: "fnl",
	fish: "fish",
	fluent: "ftl",
	for: "for",
	"fortran-fixed-form": "f",
	"fortran-free-form": "f90",
	fs: "fs",
	fsharp: "fs",
	fsl: "fsl",
	ftl: "ftl",
	gdresource: "tres",
	gdscript: "gd",
	gdshader: "gdshader",
	genie: "gs",
	gherkin: "feature",
	"git-commit": "gitcommit",
	"git-rebase": "gitrebase",
	gjs: "js",
	gleam: "gleam",
	"glimmer-js": "js",
	"glimmer-ts": "ts",
	glsl: "glsl",
	gnuplot: "plt",
	go: "go",
	gql: "gql",
	graphql: "graphql",
	groovy: "groovy",
	gts: "gts",
	hack: "hack",
	haml: "haml",
	handlebars: "hbs",
	haskell: "hs",
	haxe: "hx",
	hbs: "hbs",
	hcl: "hcl",
	hjson: "hjson",
	hlsl: "hlsl",
	hs: "hs",
	html: "html",
	"html-derivative": "html",
	http: "http",
	hxml: "hxml",
	hy: "hy",
	imba: "imba",
	ini: "ini",
	jade: "jade",
	java: "java",
	javascript: "js",
	jinja: "jinja",
	jison: "jison",
	jl: "jl",
	js: "js",
	json: "json",
	json5: "json5",
	jsonc: "jsonc",
	jsonl: "jsonl",
	jsonnet: "jsonnet",
	jssm: "jssm",
	jsx: "jsx",
	julia: "jl",
	kotlin: "kt",
	kql: "kql",
	kt: "kt",
	kts: "kts",
	kusto: "kql",
	latex: "tex",
	lean: "lean",
	lean4: "lean",
	less: "less",
	liquid: "liquid",
	lisp: "lisp",
	lit: "lit",
	llvm: "ll",
	log: "log",
	logo: "logo",
	lua: "lua",
	luau: "luau",
	make: "mak",
	makefile: "mak",
	markdown: "md",
	marko: "marko",
	matlab: "m",
	md: "md",
	mdc: "mdc",
	mdx: "mdx",
	mediawiki: "wiki",
	mermaid: "mmd",
	mips: "s",
	mipsasm: "s",
	mmd: "mmd",
	mojo: "mojo",
	move: "move",
	nar: "nar",
	narrat: "narrat",
	nextflow: "nf",
	nf: "nf",
	nginx: "conf",
	nim: "nim",
	nix: "nix",
	nu: "nu",
	nushell: "nu",
	objc: "m",
	"objective-c": "m",
	"objective-cpp": "mm",
	ocaml: "ml",
	pascal: "pas",
	perl: "pl",
	perl6: "p6",
	php: "php",
	plsql: "pls",
	po: "po",
	polar: "polar",
	postcss: "pcss",
	pot: "pot",
	potx: "potx",
	powerquery: "pq",
	powershell: "ps1",
	prisma: "prisma",
	prolog: "pl",
	properties: "properties",
	proto: "proto",
	protobuf: "proto",
	ps: "ps",
	ps1: "ps1",
	pug: "pug",
	puppet: "pp",
	purescript: "purs",
	py: "py",
	python: "py",
	ql: "ql",
	qml: "qml",
	qmldir: "qmldir",
	qss: "qss",
	r: "r",
	racket: "rkt",
	raku: "raku",
	razor: "cshtml",
	rb: "rb",
	reg: "reg",
	regex: "regex",
	regexp: "regexp",
	rel: "rel",
	riscv: "s",
	rs: "rs",
	rst: "rst",
	ruby: "rb",
	rust: "rs",
	sas: "sas",
	sass: "sass",
	scala: "scala",
	scheme: "scm",
	scss: "scss",
	sdbl: "sdbl",
	sh: "sh",
	shader: "shader",
	shaderlab: "shader",
	shell: "sh",
	shellscript: "sh",
	shellsession: "sh",
	smalltalk: "st",
	solidity: "sol",
	soy: "soy",
	sparql: "rq",
	spl: "spl",
	splunk: "spl",
	sql: "sql",
	"ssh-config": "config",
	stata: "do",
	styl: "styl",
	stylus: "styl",
	svelte: "svelte",
	swift: "swift",
	"system-verilog": "sv",
	systemd: "service",
	talon: "talon",
	talonscript: "talon",
	tasl: "tasl",
	tcl: "tcl",
	templ: "templ",
	terraform: "tf",
	tex: "tex",
	tf: "tf",
	tfvars: "tfvars",
	toml: "toml",
	ts: "ts",
	"ts-tags": "ts",
	tsp: "tsp",
	tsv: "tsv",
	tsx: "tsx",
	turtle: "ttl",
	twig: "twig",
	typ: "typ",
	typescript: "ts",
	typespec: "tsp",
	typst: "typ",
	v: "v",
	vala: "vala",
	vb: "vb",
	verilog: "v",
	vhdl: "vhdl",
	vim: "vim",
	viml: "vim",
	vimscript: "vim",
	vue: "vue",
	"vue-html": "html",
	"vue-vine": "vine",
	vy: "vy",
	vyper: "vy",
	wasm: "wasm",
	wenyan: "wy",
	wgsl: "wgsl",
	wiki: "wiki",
	wikitext: "wiki",
	wit: "wit",
	wl: "wl",
	wolfram: "wl",
	xml: "xml",
	xsl: "xsl",
	yaml: "yaml",
	yml: "yml",
	zenscript: "zs",
	zig: "zig",
	zsh: "zsh",
	文言: "wy"
}, xb = ({ onDownload: e, onError: t, language: n, children: r, className: i, code: a, ...o }) => {
	let { code: c } = vb(), { isAnimating: l } = (0, s.useContext)(zx), u = a ?? c, d = `file.${n && n in bb ? bb[n] : "txt"}`;
	return (0, Q.jsx)("button", {
		className: $("cursor-pointer p-1 text-muted-foreground transition-all hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50", i),
		"data-streamdown": "code-block-download-button",
		disabled: l,
		onClick: () => {
			try {
				gb(d, u, "text/plain"), e?.();
			} catch (e) {
				t?.(e);
			}
		},
		title: "Download file",
		type: "button",
		...o,
		children: r ?? (0, Q.jsx)(kg, { size: 14 })
	});
}, Sb = () => (0, Q.jsxs)("div", {
	className: "w-full divide-y divide-border overflow-hidden rounded-xl border border-border",
	children: [(0, Q.jsx)("div", { className: "h-[46px] w-full bg-muted/80" }), (0, Q.jsx)("div", {
		className: "flex w-full items-center justify-center p-4",
		children: (0, Q.jsx)(Ag, { className: "size-4 animate-spin" })
	})]
}), Cb = /\.[^/.]+$/, wb = ({ node: e, className: t, src: n, alt: r, ...i }) => {
	let a = async () => {
		if (n) try {
			let e = await (await fetch(n)).blob(), t = new URL(n, window.location.origin).pathname.split("/").pop() || "", i = t.split(".").pop(), a = t.includes(".") && i !== void 0 && i.length <= 4, o = "";
			if (a) o = t;
			else {
				let n = e.type, i = "png";
				n.includes("jpeg") || n.includes("jpg") ? i = "jpg" : n.includes("png") ? i = "png" : n.includes("svg") ? i = "svg" : n.includes("gif") ? i = "gif" : n.includes("webp") && (i = "webp"), o = `${(r || t || "image").replace(Cb, "")}.${i}`;
			}
			gb(o, e, e.type);
		} catch (e) {
			console.error("Failed to download image:", e);
		}
	};
	return n ? (0, Q.jsxs)("div", {
		className: "group relative my-4 inline-block",
		"data-streamdown": "image-wrapper",
		children: [
			(0, Q.jsx)("img", {
				alt: r,
				className: $("max-w-full rounded-lg", t),
				"data-streamdown": "image",
				src: n,
				...i
			}),
			(0, Q.jsx)("div", { className: "pointer-events-none absolute inset-0 hidden rounded-lg bg-black/10 group-hover:block" }),
			(0, Q.jsx)("button", {
				className: $("absolute right-2 bottom-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-border bg-background/90 shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-background", "opacity-0 group-hover:opacity-100"),
				onClick: a,
				title: "Download image",
				type: "button",
				children: (0, Q.jsx)(kg, { size: 14 })
			})
		]
	}) : null;
}, Tb = async (e) => {
	let t = {
		startOnLoad: !1,
		theme: "default",
		securityLevel: "strict",
		fontFamily: "monospace",
		suppressErrorRendering: !0,
		...e
	}, n = (await import("./mermaid.core-4taRJON4.js")).default;
	return n.initialize(t), n;
}, Eb = (e, t) => new Promise((t, n) => {
	let r = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(e))), i = new Image();
	i.crossOrigin = "anonymous", i.onload = () => {
		let e = document.createElement("canvas"), r = i.width * 5, a = i.height * 5;
		e.width = r, e.height = a;
		let o = e.getContext("2d");
		if (!o) {
			n(/* @__PURE__ */ Error("Failed to create 2D canvas context for PNG export"));
			return;
		}
		o.drawImage(i, 0, 0, r, a), e.toBlob((e) => {
			if (!e) {
				n(/* @__PURE__ */ Error("Failed to create PNG blob"));
				return;
			}
			t(e);
		}, "image/png");
	}, i.onerror = () => n(/* @__PURE__ */ Error("Failed to load SVG image")), i.src = r;
}), Db = ({ chart: e, children: t, className: n, onDownload: r, config: i, onError: a }) => {
	let [o, c] = (0, s.useState)(!1), l = (0, s.useRef)(null), { isAnimating: u } = (0, s.useContext)(zx), d = async (t) => {
		try {
			if (t === "mmd") {
				gb("diagram.mmd", e, "text/plain"), c(!1), r?.(t);
				return;
			}
			let n = await Tb(i), o = e.split("").reduce((e, t) => (e << 5) - e + t.charCodeAt(0) | 0, 0), s = `mermaid-${Math.abs(o)}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, { svg: l } = await n.render(s, e);
			if (!l) {
				a?.(/* @__PURE__ */ Error("SVG not found. Please wait for the diagram to render."));
				return;
			}
			if (t === "svg") {
				gb("diagram.svg", l, "image/svg+xml"), c(!1), r?.(t);
				return;
			}
			if (t === "png") {
				gb("diagram.png", await Eb(l), "image/png"), r?.(t), c(!1);
				return;
			}
		} catch (e) {
			a?.(e);
		}
	};
	return (0, s.useEffect)(() => {
		let e = (e) => {
			l.current && !l.current.contains(e.target) && c(!1);
		};
		return document.addEventListener("mousedown", e), () => {
			document.removeEventListener("mousedown", e);
		};
	}, []), (0, Q.jsxs)("div", {
		className: "relative",
		ref: l,
		children: [(0, Q.jsx)("button", {
			className: $("cursor-pointer p-1 text-muted-foreground transition-all hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50", n),
			disabled: u,
			onClick: () => c(!o),
			title: "Download diagram",
			type: "button",
			children: t ?? (0, Q.jsx)(kg, { size: 14 })
		}), o && (0, Q.jsxs)("div", {
			className: "absolute top-full right-0 z-10 mt-1 min-w-[120px] overflow-hidden rounded-md border border-border bg-background shadow-lg",
			children: [
				(0, Q.jsx)("button", {
					className: "w-full px-3 py-2 text-left text-sm transition-colors hover:bg-muted/40",
					onClick: () => d("svg"),
					title: "Download diagram as SVG",
					type: "button",
					children: "SVG"
				}),
				(0, Q.jsx)("button", {
					className: "w-full px-3 py-2 text-left text-sm transition-colors hover:bg-muted/40",
					onClick: () => d("png"),
					title: "Download diagram as PNG",
					type: "button",
					children: "PNG"
				}),
				(0, Q.jsx)("button", {
					className: "w-full px-3 py-2 text-left text-sm transition-colors hover:bg-muted/40",
					onClick: () => d("mmd"),
					title: "Download diagram as MMD",
					type: "button",
					children: "MMD"
				})
			]
		})]
	});
}, Ob = 0, kb = () => {
	Ob += 1, Ob === 1 && (document.body.style.overflow = "hidden");
}, Ab = () => {
	Ob = Math.max(0, Ob - 1), Ob === 0 && (document.body.style.overflow = "");
}, jb = ({ chart: e, config: t, onFullscreen: n, onExit: r, className: i, ...a }) => {
	let [o, c] = (0, s.useState)(!1), { isAnimating: l, controls: u } = (0, s.useContext)(zx), d = (() => {
		if (typeof u == "boolean") return u;
		let e = u.mermaid;
		return e === !1 ? !1 : e === !0 || e === void 0 ? !0 : e.panZoom !== !1;
	})(), f = () => {
		c(!o);
	};
	return (0, s.useEffect)(() => {
		if (o) {
			kb();
			let e = (e) => {
				e.key === "Escape" && c(!1);
			};
			return document.addEventListener("keydown", e), () => {
				document.removeEventListener("keydown", e), Ab();
			};
		}
	}, [o]), (0, s.useEffect)(() => {
		o ? n?.() : r && r();
	}, [
		o,
		n,
		r
	]), (0, Q.jsxs)(Q.Fragment, { children: [(0, Q.jsx)("button", {
		className: $("cursor-pointer p-1 text-muted-foreground transition-all hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50", i),
		disabled: l,
		onClick: f,
		title: "View fullscreen",
		type: "button",
		...a,
		children: (0, Q.jsx)(jg, { size: 14 })
	}), o && (0, Q.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm",
		onClick: f,
		onKeyDown: (e) => {
			e.key === "Escape" && f();
		},
		role: "button",
		tabIndex: 0,
		children: [(0, Q.jsx)("button", {
			className: "absolute top-4 right-4 z-10 rounded-md p-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground",
			onClick: f,
			title: "Exit fullscreen",
			type: "button",
			children: (0, Q.jsx)(Ng, { size: 20 })
		}), (0, Q.jsx)("div", {
			className: "flex h-full w-full items-center justify-center p-4",
			onClick: (e) => e.stopPropagation(),
			onKeyDown: (e) => e.stopPropagation(),
			role: "presentation",
			children: (0, Q.jsx)(Wx, {
				chart: e,
				className: "h-full w-full [&>div]:h-full [&>div]:overflow-hidden [&_svg]:h-auto [&_svg]:w-auto",
				config: t,
				fullscreen: !0,
				showControls: d
			})
		})]
	})] });
}, Mb = (e) => {
	let t = [], n = [], r = e.querySelectorAll("thead th");
	for (let e of r) t.push(e.textContent?.trim() || "");
	let i = e.querySelectorAll("tbody tr");
	for (let e of i) {
		let t = [], r = e.querySelectorAll("td");
		for (let e of r) t.push(e.textContent?.trim() || "");
		n.push(t);
	}
	return {
		headers: t,
		rows: n
	};
}, Nb = (e) => {
	let { headers: t, rows: n } = e, r = (e) => {
		let t = !1, n = !1;
		for (let r = 0; r < e.length; r += 1) {
			let i = e[r];
			if (i === "\"") {
				t = !0, n = !0;
				break;
			}
			(i === "," || i === "\n") && (t = !0);
		}
		return t ? n ? `"${e.replace(/"/g, "\"\"")}"` : `"${e}"` : e;
	}, i = t.length > 0 ? n.length + 1 : n.length, a = Array(i), o = 0;
	t.length > 0 && (a[o] = t.map(r).join(","), o += 1);
	for (let e of n) a[o] = e.map(r).join(","), o += 1;
	return a.join("\n");
}, Pb = (e) => {
	let { headers: t, rows: n } = e, r = (e) => {
		let t = !1;
		for (let n = 0; n < e.length; n += 1) {
			let r = e[n];
			if (r === "	" || r === "\n" || r === "\r") {
				t = !0;
				break;
			}
		}
		if (!t) return e;
		let n = [];
		for (let t = 0; t < e.length; t += 1) {
			let r = e[t];
			r === "	" ? n.push("\\t") : r === "\n" ? n.push("\\n") : r === "\r" ? n.push("\\r") : n.push(r);
		}
		return n.join("");
	}, i = t.length > 0 ? n.length + 1 : n.length, a = Array(i), o = 0;
	t.length > 0 && (a[o] = t.map(r).join("	"), o += 1);
	for (let e of n) a[o] = e.map(r).join("	"), o += 1;
	return a.join("\n");
}, Fb = (e) => {
	let t = !1;
	for (let n = 0; n < e.length; n += 1) {
		let r = e[n];
		if (r === "\\" || r === "|") {
			t = !0;
			break;
		}
	}
	if (!t) return e;
	let n = [];
	for (let t = 0; t < e.length; t += 1) {
		let r = e[t];
		r === "\\" ? n.push("\\\\") : r === "|" ? n.push("\\|") : n.push(r);
	}
	return n.join("");
}, Ib = (e) => {
	let { headers: t, rows: n } = e;
	if (t.length === 0) return "";
	let r = Array(n.length + 2), i = 0;
	r[i] = `| ${t.map((e) => Fb(e)).join(" | ")} |`, i += 1;
	let a = Array(t.length);
	for (let e = 0; e < t.length; e += 1) a[e] = "---";
	r[i] = `| ${a.join(" | ")} |`, i += 1;
	for (let e of n) if (e.length < t.length) {
		let n = Array(t.length);
		for (let r = 0; r < t.length; r += 1) n[r] = r < e.length ? Fb(e[r]) : "";
		r[i] = `| ${n.join(" | ")} |`, i += 1;
	} else r[i] = `| ${e.map((e) => Fb(e)).join(" | ")} |`, i += 1;
	return r.join("\n");
}, Lb = ({ children: e, className: t, onCopy: n, onError: r, timeout: i = 2e3 }) => {
	let [a, o] = (0, s.useState)(!1), [c, l] = (0, s.useState)(!1), u = (0, s.useRef)(null), d = (0, s.useRef)(0), { isAnimating: f } = (0, s.useContext)(zx), p = async (e) => {
		var t;
		if (typeof window > "u" || !((t = navigator == null ? void 0 : navigator.clipboard) != null && t.write)) {
			r?.(/* @__PURE__ */ Error("Clipboard API not available"));
			return;
		}
		try {
			let t = (u.current?.closest("[data-streamdown=\"table-wrapper\"]"))?.querySelector("table");
			if (!t) {
				r?.(/* @__PURE__ */ Error("Table not found"));
				return;
			}
			let a = Mb(t), s = e === "csv" ? Nb(a) : Pb(a), c = new ClipboardItem({
				"text/plain": new Blob([s], { type: "text/plain" }),
				"text/html": new Blob([t.outerHTML], { type: "text/html" })
			});
			await navigator.clipboard.write([c]), l(!0), o(!1), n?.(e), d.current = window.setTimeout(() => l(!1), i);
		} catch (e) {
			r?.(e);
		}
	};
	(0, s.useEffect)(() => {
		let e = (e) => {
			u.current && !u.current.contains(e.target) && o(!1);
		};
		return document.addEventListener("mousedown", e), () => {
			document.removeEventListener("mousedown", e), window.clearTimeout(d.current);
		};
	}, []);
	let m = c ? Dg : Og;
	return (0, Q.jsxs)("div", {
		className: "relative",
		ref: u,
		children: [(0, Q.jsx)("button", {
			className: $("cursor-pointer p-1 text-muted-foreground transition-all hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50", t),
			disabled: f,
			onClick: () => o(!a),
			title: "Copy table",
			type: "button",
			children: e ?? (0, Q.jsx)(m, { size: 14 })
		}), a && (0, Q.jsxs)("div", {
			className: "absolute top-full right-0 z-10 mt-1 min-w-[120px] overflow-hidden rounded-md border border-border bg-background shadow-lg",
			children: [(0, Q.jsx)("button", {
				className: "w-full px-3 py-2 text-left text-sm transition-colors hover:bg-muted/40",
				onClick: () => p("csv"),
				title: "Copy table as CSV",
				type: "button",
				children: "CSV"
			}), (0, Q.jsx)("button", {
				className: "w-full px-3 py-2 text-left text-sm transition-colors hover:bg-muted/40",
				onClick: () => p("tsv"),
				title: "Copy table as TSV",
				type: "button",
				children: "TSV"
			})]
		})]
	});
}, Rb = ({ children: e, className: t, onDownload: n, onError: r }) => {
	let [i, a] = (0, s.useState)(!1), o = (0, s.useRef)(null), { isAnimating: c } = (0, s.useContext)(zx), l = (e) => {
		try {
			let t = (o.current?.closest("[data-streamdown=\"table-wrapper\"]"))?.querySelector("table");
			if (!t) {
				r?.(/* @__PURE__ */ Error("Table not found"));
				return;
			}
			let i = Mb(t), s = e === "csv" ? Nb(i) : Ib(i);
			gb(`table.${e === "csv" ? "csv" : "md"}`, s, e === "csv" ? "text/csv" : "text/markdown"), a(!1), n?.(e);
		} catch (e) {
			r?.(e);
		}
	};
	return (0, s.useEffect)(() => {
		let e = (e) => {
			o.current && !o.current.contains(e.target) && a(!1);
		};
		return document.addEventListener("mousedown", e), () => {
			document.removeEventListener("mousedown", e);
		};
	}, []), (0, Q.jsxs)("div", {
		className: "relative",
		ref: o,
		children: [(0, Q.jsx)("button", {
			className: $("cursor-pointer p-1 text-muted-foreground transition-all hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50", t),
			disabled: c,
			onClick: () => a(!i),
			title: "Download table",
			type: "button",
			children: e ?? (0, Q.jsx)(kg, { size: 14 })
		}), i && (0, Q.jsxs)("div", {
			className: "absolute top-full right-0 z-10 mt-1 min-w-[120px] overflow-hidden rounded-md border border-border bg-background shadow-lg",
			children: [(0, Q.jsx)("button", {
				className: "w-full px-3 py-2 text-left text-sm transition-colors hover:bg-muted/40",
				onClick: () => l("csv"),
				title: "Download table as CSV",
				type: "button",
				children: "CSV"
			}), (0, Q.jsx)("button", {
				className: "w-full px-3 py-2 text-left text-sm transition-colors hover:bg-muted/40",
				onClick: () => l("markdown"),
				title: "Download table as Markdown",
				type: "button",
				children: "Markdown"
			})]
		})]
	});
}, zb = ({ children: e, className: t, showControls: n, ...r }) => (0, Q.jsxs)("div", {
	className: "my-4 flex flex-col space-y-2",
	"data-streamdown": "table-wrapper",
	children: [n && (0, Q.jsxs)("div", {
		className: "flex items-center justify-end gap-1",
		children: [(0, Q.jsx)(Lb, {}), (0, Q.jsx)(Rb, {})]
	}), (0, Q.jsx)("div", {
		className: "overflow-x-auto",
		children: (0, Q.jsx)("table", {
			className: $("w-full border-collapse border border-border", t),
			"data-streamdown": "table",
			...r,
			children: e
		})
	})]
}), Bb = (0, s.lazy)(() => import("./code-block-IT6T5CEO-BB86-iZL.js").then((e) => ({ default: e.CodeBlock }))), Vb = (0, s.lazy)(() => import("./mermaid-VLURNSYL-DyiLFkNm.js").then((e) => ({ default: e.Mermaid }))), Hb = /language-([^\s]+)/;
function Ub(e, t) {
	if (!(e != null && e.position || t != null && t.position)) return !0;
	if (!(e != null && e.position && t != null && t.position)) return !1;
	let n = e.position.start, r = t.position.start, i = e.position.end, a = t.position.end;
	return n?.line === r?.line && n?.column === r?.column && i?.line === a?.line && i?.column === a?.column;
}
function Wb(e, t) {
	return e.className === t.className && Ub(e.node, t.node);
}
var Gb = (e, t) => typeof e == "boolean" ? e : e[t] !== !1, Kb = (e, t) => {
	if (typeof e == "boolean") return e;
	let n = e.mermaid;
	return n === !1 ? !1 : n === !0 || n === void 0 ? !0 : n[t] !== !1;
}, qb = (0, s.memo)(({ children: e, className: t, node: n, ...r }) => (0, Q.jsx)("ol", {
	className: $("list-inside list-decimal whitespace-normal", t),
	"data-streamdown": "ordered-list",
	...r,
	children: e
}), (e, t) => Wb(e, t));
qb.displayName = "MarkdownOl";
var Jb = (0, s.memo)(({ children: e, className: t, node: n, ...r }) => (0, Q.jsx)("li", {
	className: $("py-1 [&>p]:inline", t),
	"data-streamdown": "list-item",
	...r,
	children: e
}), (e, t) => e.className === t.className && Ub(e.node, t.node));
Jb.displayName = "MarkdownLi";
var Yb = (0, s.memo)(({ children: e, className: t, node: n, ...r }) => (0, Q.jsx)("ul", {
	className: $("list-inside list-disc whitespace-normal", t),
	"data-streamdown": "unordered-list",
	...r,
	children: e
}), (e, t) => Wb(e, t));
Yb.displayName = "MarkdownUl";
var Xb = (0, s.memo)(({ className: e, node: t, ...n }) => (0, Q.jsx)("hr", {
	className: $("my-6 border-border", e),
	"data-streamdown": "horizontal-rule",
	...n
}), (e, t) => Wb(e, t));
Xb.displayName = "MarkdownHr";
var Zb = (0, s.memo)(({ children: e, className: t, node: n, ...r }) => (0, Q.jsx)("span", {
	className: $("font-semibold", t),
	"data-streamdown": "strong",
	...r,
	children: e
}), (e, t) => Wb(e, t));
Zb.displayName = "MarkdownStrong";
var Qb = (0, s.memo)(({ children: e, className: t, href: n, node: r, ...i }) => {
	let a = n === "streamdown:incomplete-link";
	return (0, Q.jsx)("a", {
		className: $("wrap-anywhere font-medium text-primary underline", t),
		"data-incomplete": a,
		"data-streamdown": "link",
		href: n,
		rel: "noreferrer",
		target: "_blank",
		...i,
		children: e
	});
}, (e, t) => Wb(e, t) && e.href === t.href);
Qb.displayName = "MarkdownA";
var $b = (0, s.memo)(({ children: e, className: t, node: n, ...r }) => (0, Q.jsx)("h1", {
	className: $("mt-6 mb-2 font-semibold text-3xl", t),
	"data-streamdown": "heading-1",
	...r,
	children: e
}), (e, t) => Wb(e, t));
$b.displayName = "MarkdownH1";
var ex = (0, s.memo)(({ children: e, className: t, node: n, ...r }) => (0, Q.jsx)("h2", {
	className: $("mt-6 mb-2 font-semibold text-2xl", t),
	"data-streamdown": "heading-2",
	...r,
	children: e
}), (e, t) => Wb(e, t));
ex.displayName = "MarkdownH2";
var tx = (0, s.memo)(({ children: e, className: t, node: n, ...r }) => (0, Q.jsx)("h3", {
	className: $("mt-6 mb-2 font-semibold text-xl", t),
	"data-streamdown": "heading-3",
	...r,
	children: e
}), (e, t) => Wb(e, t));
tx.displayName = "MarkdownH3";
var nx = (0, s.memo)(({ children: e, className: t, node: n, ...r }) => (0, Q.jsx)("h4", {
	className: $("mt-6 mb-2 font-semibold text-lg", t),
	"data-streamdown": "heading-4",
	...r,
	children: e
}), (e, t) => Wb(e, t));
nx.displayName = "MarkdownH4";
var rx = (0, s.memo)(({ children: e, className: t, node: n, ...r }) => (0, Q.jsx)("h5", {
	className: $("mt-6 mb-2 font-semibold text-base", t),
	"data-streamdown": "heading-5",
	...r,
	children: e
}), (e, t) => Wb(e, t));
rx.displayName = "MarkdownH5";
var ix = (0, s.memo)(({ children: e, className: t, node: n, ...r }) => (0, Q.jsx)("h6", {
	className: $("mt-6 mb-2 font-semibold text-sm", t),
	"data-streamdown": "heading-6",
	...r,
	children: e
}), (e, t) => Wb(e, t));
ix.displayName = "MarkdownH6";
var ax = (0, s.memo)(({ children: e, className: t, node: n, ...r }) => {
	let { controls: i } = (0, s.useContext)(zx);
	return (0, Q.jsx)(zb, {
		className: t,
		"data-streamdown": "table-wrapper",
		showControls: Gb(i, "table"),
		...r,
		children: e
	});
}, (e, t) => Wb(e, t));
ax.displayName = "MarkdownTable";
var ox = (0, s.memo)(({ children: e, className: t, node: n, ...r }) => (0, Q.jsx)("thead", {
	className: $("bg-muted/80", t),
	"data-streamdown": "table-header",
	...r,
	children: e
}), (e, t) => Wb(e, t));
ox.displayName = "MarkdownThead";
var sx = (0, s.memo)(({ children: e, className: t, node: n, ...r }) => (0, Q.jsx)("tbody", {
	className: $("divide-y divide-border bg-muted/40", t),
	"data-streamdown": "table-body",
	...r,
	children: e
}), (e, t) => Wb(e, t));
sx.displayName = "MarkdownTbody";
var cx = (0, s.memo)(({ children: e, className: t, node: n, ...r }) => (0, Q.jsx)("tr", {
	className: $("border-border border-b", t),
	"data-streamdown": "table-row",
	...r,
	children: e
}), (e, t) => Wb(e, t));
cx.displayName = "MarkdownTr";
var lx = (0, s.memo)(({ children: e, className: t, node: n, ...r }) => (0, Q.jsx)("th", {
	className: $("whitespace-nowrap px-4 py-2 text-left font-semibold text-sm", t),
	"data-streamdown": "table-header-cell",
	...r,
	children: e
}), (e, t) => Wb(e, t));
lx.displayName = "MarkdownTh";
var ux = (0, s.memo)(({ children: e, className: t, node: n, ...r }) => (0, Q.jsx)("td", {
	className: $("px-4 py-2 text-sm", t),
	"data-streamdown": "table-cell",
	...r,
	children: e
}), (e, t) => Wb(e, t));
ux.displayName = "MarkdownTd";
var dx = (0, s.memo)(({ children: e, className: t, node: n, ...r }) => (0, Q.jsx)("blockquote", {
	className: $("my-4 border-muted-foreground/30 border-l-4 pl-4 text-muted-foreground italic", t),
	"data-streamdown": "blockquote",
	...r,
	children: e
}), (e, t) => Wb(e, t));
dx.displayName = "MarkdownBlockquote";
var fx = (0, s.memo)(({ children: e, className: t, node: n, ...r }) => (0, Q.jsx)("sup", {
	className: $("text-sm", t),
	"data-streamdown": "superscript",
	...r,
	children: e
}), (e, t) => Wb(e, t));
fx.displayName = "MarkdownSup";
var px = (0, s.memo)(({ children: e, className: t, node: n, ...r }) => (0, Q.jsx)("sub", {
	className: $("text-sm", t),
	"data-streamdown": "subscript",
	...r,
	children: e
}), (e, t) => Wb(e, t));
px.displayName = "MarkdownSub";
var mx = (0, s.memo)(({ children: e, className: t, node: n, ...r }) => {
	if ("data-footnotes" in r) {
		let n = (e) => {
			if (!(0, s.isValidElement)(e)) return !1;
			let t = Array.isArray(e.props.children) ? e.props.children : [e.props.children], n = !1, r = !1;
			for (let e of t) if (e) {
				if (typeof e == "string") e.trim() !== "" && (n = !0);
				else if ((0, s.isValidElement)(e)) if (e.props?.["data-footnote-backref"] !== void 0) r = !0;
				else {
					let t = Array.isArray(e.props.children) ? e.props.children : [e.props.children];
					for (let e of t) {
						if (typeof e == "string" && e.trim() !== "") {
							n = !0;
							break;
						}
						if ((0, s.isValidElement)(e) && e.props?.["data-footnote-backref"] === void 0) {
							n = !0;
							break;
						}
					}
				}
			}
			return r && !n;
		}, i = Array.isArray(e) ? e.map((e) => {
			if (!(0, s.isValidElement)(e)) return e;
			if (e.type === qb) {
				let t = (Array.isArray(e.props.children) ? e.props.children : [e.props.children]).filter((e) => !n(e));
				return t.length === 0 ? null : {
					...e,
					props: {
						...e.props,
						children: t
					}
				};
			}
			return e;
		}) : e;
		return (Array.isArray(i) ? i.some((e) => e !== null) : i !== null) ? (0, Q.jsx)("section", {
			className: t,
			...r,
			children: i
		}) : null;
	}
	return (0, Q.jsx)("section", {
		className: t,
		...r,
		children: e
	});
}, (e, t) => Wb(e, t));
mx.displayName = "MarkdownSection";
var hx = (0, s.memo)(({ node: e, className: t, children: n, ...r }) => {
	let i = (e?.position)?.start.line === (e?.position)?.end.line, { mermaid: a, controls: o } = (0, s.useContext)(zx);
	if (i) return (0, Q.jsx)("code", {
		className: $("rounded bg-muted px-1.5 py-0.5 font-mono text-sm", t),
		"data-streamdown": "inline-code",
		...r,
		children: n
	});
	let c = (t?.match(Hb))?.at(1) ?? "", l = "";
	if ((0, s.isValidElement)(n) && n.props && typeof n.props == "object" && "children" in n.props && typeof n.props.children == "string" ? l = n.props.children : typeof n == "string" && (l = n), c === "mermaid") {
		let e = Gb(o, "mermaid"), n = Kb(o, "download"), r = Kb(o, "copy"), i = Kb(o, "fullscreen"), c = Kb(o, "panZoom");
		return (0, Q.jsx)(s.Suspense, {
			fallback: (0, Q.jsx)(Sb, {}),
			children: (0, Q.jsxs)("div", {
				className: $("group relative my-4 h-auto rounded-xl border p-4", t),
				"data-streamdown": "mermaid-block",
				children: [e && (n || r || i) && (0, Q.jsxs)("div", {
					className: "flex items-center justify-end gap-2",
					children: [
						n && (0, Q.jsx)(Db, {
							chart: l,
							config: a?.config
						}),
						r && (0, Q.jsx)(yb, { code: l }),
						i && (0, Q.jsx)(jb, {
							chart: l,
							config: a?.config
						})
					]
				}), (0, Q.jsx)(Vb, {
					chart: l,
					config: a?.config,
					showControls: c
				})]
			})
		});
	}
	let u = Gb(o, "code");
	return (0, Q.jsx)(s.Suspense, {
		fallback: (0, Q.jsx)(Sb, {}),
		children: (0, Q.jsx)(Bb, {
			className: $("overflow-x-auto border-border border-t", t),
			code: l,
			language: c,
			children: u && (0, Q.jsxs)(Q.Fragment, { children: [(0, Q.jsx)(xb, {
				code: l,
				language: c
			}), (0, Q.jsx)(yb, {})] })
		})
	});
}, (e, t) => e.className === t.className && Ub(e.node, t.node));
hx.displayName = "MarkdownCode";
var gx = (0, s.memo)(wb, (e, t) => e.className === t.className && Ub(e.node, t.node));
gx.displayName = "MarkdownImg";
var _x = (0, s.memo)(({ children: e, className: t, node: n, ...r }) => {
	let i = (Array.isArray(e) ? e : [e]).filter((e) => e != null && e !== "");
	return i.length === 1 && (0, s.isValidElement)(i[0]) && i[0].props.node?.tagName === "img" ? (0, Q.jsx)(Q.Fragment, { children: e }) : (0, Q.jsx)("p", {
		className: t,
		...r,
		children: e
	});
}, (e, t) => Wb(e, t));
_x.displayName = "MarkdownParagraph";
var vx = {
	ol: qb,
	li: Jb,
	ul: Yb,
	hr: Xb,
	strong: Zb,
	a: Qb,
	h1: $b,
	h2: ex,
	h3: tx,
	h4: nx,
	h5: rx,
	h6: ix,
	table: ax,
	thead: ox,
	tbody: sx,
	tr: cx,
	th: lx,
	td: ux,
	blockquote: dx,
	code: hx,
	img: gx,
	pre: ({ children: e }) => e,
	sup: fx,
	sub: px,
	p: _x,
	section: mx
}, yx = [], bx = { allowDangerousHtml: !0 }, xx = /* @__PURE__ */ new WeakMap(), Sx = new class {
	constructor() {
		this.cache = /* @__PURE__ */ new Map(), this.keyCache = /* @__PURE__ */ new WeakMap(), this.maxSize = 100;
	}
	generateCacheKey(e) {
		let t = this.keyCache.get(e);
		if (t) return t;
		let n = e.rehypePlugins, r = e.remarkPlugins, i = e.remarkRehypeOptions;
		if (!(n || r || i)) {
			let t = "default";
			return this.keyCache.set(e, t), t;
		}
		let a = (e) => {
			if (!e || e.length === 0) return "";
			let t = "";
			for (let n = 0; n < e.length; n += 1) {
				let r = e[n];
				if (n > 0 && (t += ","), Array.isArray(r)) {
					let [e, n] = r;
					if (typeof e == "function") {
						let n = xx.get(e);
						n || (n = e.name, xx.set(e, n)), t += n;
					} else t += String(e);
					t += ":", t += JSON.stringify(n);
				} else if (typeof r == "function") {
					let e = xx.get(r);
					e || (e = r.name, xx.set(r, e)), t += e;
				} else t += String(r);
			}
			return t;
		}, o = a(n), s = `${a(r)}::${o}::${i ? JSON.stringify(i) : ""}`;
		return this.keyCache.set(e, s), s;
	}
	get(e) {
		let t = this.generateCacheKey(e), n = this.cache.get(t);
		return n && (this.cache.delete(t), this.cache.set(t, n)), n;
	}
	set(e, t) {
		let n = this.generateCacheKey(e);
		if (this.cache.size >= this.maxSize) {
			let e = this.cache.keys().next().value;
			e && this.cache.delete(e);
		}
		this.cache.set(n, t);
	}
	clear() {
		this.cache.clear();
	}
}(), Cx = (e) => {
	let t = wx(e), n = e.children || "";
	return Ex(t.runSync(t.parse(n), n), e);
}, wx = (e) => {
	let t = Sx.get(e);
	if (t) return t;
	let n = Tx(e);
	return Sx.set(e, n), n;
}, Tx = (e) => {
	let t = e.rehypePlugins || yx, n = e.remarkPlugins || yx, r = e.remarkRehypeOptions ? {
		...bx,
		...e.remarkRehypeOptions
	} : bx;
	return ob().use(Hv).use(n).use(Ny, r).use(t);
}, Ex = (e, t) => I_(e, {
	Fragment: Q.Fragment,
	components: t.components,
	ignoreInvalidStyle: !0,
	jsx: Q.jsx,
	jsxs: Q.jsxs,
	passKeys: !0,
	passNode: !0
}), Dx = /\[\^[^\]\s]{1,200}\](?!:)/, Ox = /\[\^[^\]\s]{1,200}\]:/, kx = /<\/(\w+)>/, Ax = /<(\w+)[\s>]/, jx = (e) => {
	let t = 0;
	for (; t < e.length && (e[t] === " " || e[t] === "	" || e[t] === "\n" || e[t] === "\r");) t += 1;
	return t + 1 < e.length && e[t] === "$" && e[t + 1] === "$";
}, Mx = (e) => {
	let t = e.length - 1;
	for (; t >= 0 && (e[t] === " " || e[t] === "	" || e[t] === "\n" || e[t] === "\r");) --t;
	return t >= 1 && e[t] === "$" && e[t - 1] === "$";
}, Nx = (e) => {
	let t = 0;
	for (let n = 0; n < e.length - 1; n += 1) e[n] === "$" && e[n + 1] === "$" && (t += 1, n += 1);
	return t;
}, Px = (e) => {
	let t = Dx.test(e), n = Ox.test(e);
	if (t || n) return [e];
	let r = i.lex(e, { gfm: !0 }), a = [], o = [];
	for (let e of r) {
		let t = e.raw, n = a.length;
		if (o.length > 0) {
			if (a[n - 1] += t, e.type === "html") {
				let e = t.match(kx);
				if (e) {
					let t = e[1];
					o.at(-1) === t && o.pop();
				}
			}
			continue;
		}
		if (e.type === "html" && e.block) {
			let e = t.match(Ax);
			if (e) {
				let n = e[1];
				t.includes(`</${n}>`) || o.push(n);
			}
		}
		if (t.trim() === "$$" && n > 0) {
			let e = a[n - 1], r = jx(e), i = Nx(e);
			if (r && i % 2 == 1) {
				a[n - 1] = e + t;
				continue;
			}
		}
		if (n > 0 && Mx(t)) {
			let e = a[n - 1], r = jx(e), i = Nx(e), o = Nx(t);
			if (r && i % 2 == 1 && !jx(t) && o === 1) {
				a[n - 1] = e + t;
				continue;
			}
		}
		a.push(t);
	}
	return a;
}, Fx = {
	raw: Fc,
	katex: [yr, { errorColor: "var(--color-muted-foreground)" }],
	sanitize: [el, {}],
	harden: [Ot, {
		allowedImagePrefixes: ["*"],
		allowedLinkPrefixes: ["*"],
		allowedProtocols: ["*"],
		defaultOrigin: void 0,
		allowDataImages: !0
	}]
}, Ix = {
	gfm: [gh, {}],
	math: [Oh, { singleDollarTextMath: !1 }],
	cjkFriendly: [pu, {}],
	cjkFriendlyGfmStrikethrough: [hu, {}]
}, Lx = Object.values(Fx), Rx = Object.values(Ix), zx = (0, s.createContext)({
	shikiTheme: ["github-light", "github-dark"],
	controls: !0,
	isAnimating: !1,
	mode: "streaming",
	mermaid: void 0
}), Bx = (0, s.memo)(({ content: e, shouldParseIncompleteMarkdown: t, ...n }) => {
	let r = (0, s.useMemo)(() => typeof e == "string" && t ? vg(e.trim()) : e, [e, t]);
	return (0, Q.jsx)(Cx, {
		...n,
		children: r
	});
}, (e, t) => {
	if (e.content !== t.content || e.shouldParseIncompleteMarkdown !== t.shouldParseIncompleteMarkdown || e.index !== t.index) return !1;
	if (e.components !== t.components) {
		let n = Object.keys(e.components || {}), r = Object.keys(t.components || {});
		if (n.length !== r.length || n.some((n) => e.components?.[n] !== t.components?.[n])) return !1;
	}
	return !(e.rehypePlugins !== t.rehypePlugins || e.remarkPlugins !== t.remarkPlugins);
});
Bx.displayName = "Block";
var Vx = ["github-light", "github-dark"], Hx = (0, s.memo)(({ children: e, mode: t = "streaming", parseIncompleteMarkdown: n = !0, components: r, rehypePlugins: i = Lx, remarkPlugins: a = Rx, className: o, shikiTheme: c = Vx, mermaid: l, controls: u = !0, isAnimating: d = !1, BlockComponent: f = Bx, parseMarkdownIntoBlocksFn: p = Px, ...m }) => {
	let h = (0, s.useId)(), [g, _] = (0, s.useTransition)(), [v, y] = (0, s.useState)([]), b = (0, s.useMemo)(() => p(typeof e == "string" ? e : ""), [e, p]);
	(0, s.useEffect)(() => {
		t === "streaming" ? _(() => {
			y(b);
		}) : y(b);
	}, [b, t]);
	let x = t === "streaming" ? v : b, ee = (0, s.useMemo)(() => x.map((e, t) => `${h}-${t}`), [x.length, h]), S = (0, s.useMemo)(() => ({
		shikiTheme: c,
		controls: u,
		isAnimating: d,
		mode: t,
		mermaid: l
	}), [
		c,
		u,
		d,
		t,
		l
	]), C = (0, s.useMemo)(() => ({
		...vx,
		...r
	}), [r]);
	return (0, s.useEffect)(() => {
		if (!(Array.isArray(i) && i.some((e) => Array.isArray(e) ? e[0] === yr : e === yr))) return;
		let t = !1;
		if (Array.isArray(a)) {
			let e = a.find((e) => Array.isArray(e) ? e[0] === Oh : e === Oh);
			e && Array.isArray(e) && e[1] && (t = e[1].singleDollarTextMath === !0);
		}
		let n = typeof e == "string" ? e : "", r = n.includes("$$"), o = t && (/[^$]\$[^$]/.test(n) || /^\$[^$]/.test(n) || /[^$]\$$/.test(n));
		(r || o) && Promise.resolve({              });
	}, [
		i,
		a,
		e
	]), t === "static" ? (0, Q.jsx)(zx.Provider, {
		value: S,
		children: (0, Q.jsx)("div", {
			className: $("space-y-4 whitespace-normal", o),
			children: (0, Q.jsx)(Cx, {
				components: C,
				rehypePlugins: i,
				remarkPlugins: a,
				...m,
				children: e
			})
		})
	}) : (0, Q.jsx)(zx.Provider, {
		value: S,
		children: (0, Q.jsx)("div", {
			className: $("space-y-4 whitespace-normal", o),
			children: x.map((e, t) => (0, Q.jsx)(f, {
				components: C,
				content: e,
				index: t,
				rehypePlugins: i,
				remarkPlugins: a,
				shouldParseIncompleteMarkdown: n,
				...m
			}, ee[t]))
		})
	});
}, (e, t) => e.children === t.children && e.shikiTheme === t.shikiTheme && e.isAnimating === t.isAnimating && e.mode === t.mode);
Hx.displayName = "Streamdown";
var Ux = ({ children: e, className: t, minZoom: n = .5, maxZoom: r = 3, zoomStep: i = .1, showControls: a = !0, initialZoom: o = 1, fullscreen: c = !1 }) => {
	let l = (0, s.useRef)(null), u = (0, s.useRef)(null), [d, f] = (0, s.useState)(o), [p, m] = (0, s.useState)({
		x: 0,
		y: 0
	}), [h, g] = (0, s.useState)(!1), [_, v] = (0, s.useState)({
		x: 0,
		y: 0
	}), [y, b] = (0, s.useState)({
		x: 0,
		y: 0
	}), x = (0, s.useCallback)((e) => {
		f((t) => Math.max(n, Math.min(r, t + e)));
	}, [n, r]), ee = (0, s.useCallback)(() => {
		x(i);
	}, [x, i]), S = (0, s.useCallback)(() => {
		x(-i);
	}, [x, i]), C = (0, s.useCallback)(() => {
		f(o), m({
			x: 0,
			y: 0
		});
	}, [o]), w = (0, s.useCallback)((e) => {
		e.preventDefault(), x(e.deltaY > 0 ? -i : i);
	}, [x, i]), T = (0, s.useCallback)((e) => {
		if (e.button !== 0 || e.isPrimary === !1) return;
		g(!0), v({
			x: e.clientX,
			y: e.clientY
		}), b(p);
		let t = e.currentTarget;
		t instanceof HTMLElement && t.setPointerCapture(e.pointerId);
	}, [p]), te = (0, s.useCallback)((e) => {
		if (!h) return;
		e.preventDefault();
		let t = e.clientX - _.x, n = e.clientY - _.y;
		m({
			x: y.x + t,
			y: y.y + n
		});
	}, [
		h,
		_,
		y
	]), E = (0, s.useCallback)((e) => {
		g(!1);
		let t = e.currentTarget;
		t instanceof HTMLElement && t.releasePointerCapture(e.pointerId);
	}, []);
	return (0, s.useEffect)(() => {
		let e = l.current;
		if (e) return e.addEventListener("wheel", w, { passive: !1 }), () => {
			e.removeEventListener("wheel", w);
		};
	}, [w]), (0, s.useEffect)(() => {
		let e = u.current;
		if (e && h) return document.body.style.userSelect = "none", e.addEventListener("pointermove", te, { passive: !1 }), e.addEventListener("pointerup", E), e.addEventListener("pointercancel", E), () => {
			document.body.style.userSelect = "", e.removeEventListener("pointermove", te), e.removeEventListener("pointerup", E), e.removeEventListener("pointercancel", E);
		};
	}, [
		h,
		te,
		E
	]), (0, Q.jsxs)("div", {
		className: $("relative", c ? "h-full w-full" : "w-full", t),
		ref: l,
		style: { cursor: h ? "grabbing" : "grab" },
		children: [a && (0, Q.jsxs)("div", {
			className: $("absolute z-10 flex flex-col gap-1 rounded-md border border-border bg-background/90 p-1 shadow-sm backdrop-blur-sm", c ? "bottom-4 left-4" : "bottom-2 left-2"),
			children: [
				(0, Q.jsx)("button", {
					className: "flex items-center justify-center rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50",
					disabled: d >= r,
					onClick: ee,
					title: "Zoom in",
					type: "button",
					children: (0, Q.jsx)(Pg, { size: 16 })
				}),
				(0, Q.jsx)("button", {
					className: "flex items-center justify-center rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50",
					disabled: d <= n,
					onClick: S,
					title: "Zoom out",
					type: "button",
					children: (0, Q.jsx)(Fg, { size: 16 })
				}),
				(0, Q.jsx)("button", {
					className: "flex items-center justify-center rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
					onClick: C,
					title: "Reset zoom and pan",
					type: "button",
					children: (0, Q.jsx)(Mg, { size: 16 })
				})
			]
		}), (0, Q.jsx)("div", {
			className: $("origin-center transition-transform duration-150 ease-out", c && "flex w-full items-center justify-center"),
			onPointerDown: T,
			ref: u,
			role: "application",
			style: {
				transform: `translate(${p.x}px, ${p.y}px) scale(${d})`,
				transformOrigin: "center center",
				touchAction: "none",
				willChange: "transform"
			},
			children: e
		})]
	});
}, Wx = ({ chart: e, className: t, config: n, fullscreen: r = !1, showControls: i = !0 }) => {
	let [a, o] = (0, s.useState)(null), [c, l] = (0, s.useState)(!0), [u, d] = (0, s.useState)(""), [f, p] = (0, s.useState)(""), [m, h] = (0, s.useState)(0), { mermaid: g } = (0, s.useContext)(zx), _ = g?.errorComponent;
	if ((0, s.useEffect)(() => {
		(async () => {
			try {
				o(null), l(!0);
				let t = await Tb(n), r = e.split("").reduce((e, t) => (e << 5) - e + t.charCodeAt(0) | 0, 0), i = `mermaid-${Math.abs(r)}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, { svg: a } = await t.render(i, e);
				d(a), p(a);
			} catch (e) {
				f || u || o(e instanceof Error ? e.message : "Failed to render Mermaid chart");
			} finally {
				l(!1);
			}
		})();
	}, [
		e,
		n,
		m
	]), c && !u && !f) return (0, Q.jsx)("div", {
		className: $("my-4 flex justify-center p-4", t),
		children: (0, Q.jsxs)("div", {
			className: "flex items-center space-x-2 text-muted-foreground",
			children: [(0, Q.jsx)("div", { className: "h-4 w-4 animate-spin rounded-full border-current border-b-2" }), (0, Q.jsx)("span", {
				className: "text-sm",
				children: "Loading diagram..."
			})]
		})
	});
	if (a && !u && !f) return _ ? (0, Q.jsx)(_, {
		chart: e,
		error: a,
		retry: () => h((e) => e + 1)
	}) : (0, Q.jsxs)("div", {
		className: $("rounded-lg border border-red-200 bg-red-50 p-4", t),
		children: [(0, Q.jsxs)("p", {
			className: "font-mono text-red-700 text-sm",
			children: ["Mermaid Error: ", a]
		}), (0, Q.jsxs)("details", {
			className: "mt-2",
			children: [(0, Q.jsx)("summary", {
				className: "cursor-pointer text-red-600 text-xs",
				children: "Show Code"
			}), (0, Q.jsx)("pre", {
				className: "mt-2 overflow-x-auto rounded bg-red-100 p-2 text-red-800 text-xs",
				children: e
			})]
		})]
	});
	let v = u || f;
	return (0, Q.jsx)(Ux, {
		className: $(r ? "h-full w-full overflow-hidden" : "my-4 overflow-hidden", t),
		fullscreen: r,
		maxZoom: 3,
		minZoom: .5,
		showControls: i,
		zoomStep: .1,
		children: (0, Q.jsx)("div", {
			"aria-label": "Mermaid chart",
			className: $("flex justify-center", r && "h-full w-full items-center"),
			dangerouslySetInnerHTML: { __html: v },
			role: "img"
		})
	});
};
//#endregion
export { ct as _, $ as a, ai as c, vn as d, hn as f, dt as g, pt as h, Hx as i, Gr as l, fn as m, _b as n, Vg as o, gn as p, Wx as r, gu as s, zx as t, Sn as u, lt as v, o as y };
