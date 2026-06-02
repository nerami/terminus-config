import { n as e, r as t, t as n } from "./chunk-Dqa2HsxW.js";
//#region node_modules/.pnpm/@tanstack+pacer@0.20.1/node_modules/@tanstack/pacer/dist/utils.js
function r(e) {
	return typeof e == "function";
}
function i(e, ...t) {
	return r(e) ? e(...t) : e;
}
//#endregion
//#region node_modules/.pnpm/@tanstack+devtools-event-client@0.4.3/node_modules/@tanstack/devtools-event-client/dist/esm/plugin.js
var a = class {
	#e = !0;
	#t;
	#n;
	#r;
	#i;
	#a;
	#o;
	#s;
	#c = 0;
	#l = 5;
	#u = !1;
	#d = !1;
	#f = null;
	#p = () => {
		this.debugLog("Connected to event bus"), this.#a = !0, this.#u = !1, this.debugLog("Emitting queued events", this.#i), this.#i.forEach((e) => this.emitEventToBus(e)), this.#i = [], this.stopConnectLoop(), this.#n().removeEventListener("tanstack-connect-success", this.#p);
	};
	#m = () => {
		if (this.#c < this.#l) {
			this.#c++, this.dispatchCustomEvent("tanstack-connect", {});
			return;
		}
		this.#n().removeEventListener("tanstack-connect", this.#m), this.#d = !0, this.debugLog("Max retries reached, giving up on connection"), this.stopConnectLoop();
	};
	#h = () => {
		this.#u || (this.#u = !0, this.#n().addEventListener("tanstack-connect-success", this.#p), this.#m());
	};
	constructor({ pluginId: e, debug: t = !1, enabled: n = !0, reconnectEveryMs: r = 300 }) {
		this.#t = e, this.#e = n, this.#n = this.getGlobalTarget, this.#r = t, this.debugLog(" Initializing event subscription for plugin", this.#t), this.#i = [], this.#a = !1, this.#d = !1, this.#o = null, this.#s = r;
	}
	startConnectLoop() {
		this.#o !== null || this.#a || (this.debugLog(`Starting connect loop (every ${this.#s}ms)`), this.#o = setInterval(this.#m, this.#s));
	}
	stopConnectLoop() {
		this.#u = !1, this.#o !== null && (clearInterval(this.#o), this.#o = null, this.#i = [], this.debugLog("Stopped connect loop"));
	}
	debugLog(...e) {
		this.#r && console.log(`🌴 [tanstack-devtools:${this.#t}-plugin]`, ...e);
	}
	getGlobalTarget() {
		if (typeof globalThis < "u" && globalThis.__TANSTACK_EVENT_TARGET__) return this.debugLog("Using global event target"), globalThis.__TANSTACK_EVENT_TARGET__;
		if (typeof window < "u" && window.addEventListener !== void 0) return this.debugLog("Using window as event target"), window;
		let e = typeof EventTarget < "u" ? new EventTarget() : void 0;
		return e === void 0 || e.addEventListener === void 0 ? (this.debugLog("No event mechanism available, running in non-web environment"), {
			addEventListener: () => {},
			removeEventListener: () => {},
			dispatchEvent: () => !1
		}) : (this.debugLog("Using new EventTarget as fallback"), e);
	}
	getPluginId() {
		return this.#t;
	}
	dispatchCustomEventShim(e, t) {
		try {
			let n = new Event(e, { detail: t });
			this.#n().dispatchEvent(n);
		} catch {
			this.debugLog("Failed to dispatch shim event");
		}
	}
	dispatchCustomEvent(e, t) {
		try {
			this.#n().dispatchEvent(new CustomEvent(e, { detail: t }));
		} catch {
			this.dispatchCustomEventShim(e, t);
		}
	}
	emitEventToBus(e) {
		this.debugLog("Emitting event to client bus", e), this.dispatchCustomEvent("tanstack-dispatch-event", e);
	}
	createEventPayload(e, t) {
		return {
			type: `${this.#t}:${e}`,
			payload: t,
			pluginId: this.#t
		};
	}
	emit(e, t) {
		if (!this.#e) {
			this.debugLog("Event bus client is disabled, not emitting event", e, t);
			return;
		}
		if (this.#f && (this.debugLog("Emitting event to internal event target", e, t), this.#f.dispatchEvent(new CustomEvent(`${this.#t}:${e}`, { detail: this.createEventPayload(e, t) }))), this.#d) {
			this.debugLog("Previously failed to connect, not emitting to bus");
			return;
		}
		if (!this.#a) {
			this.debugLog("Bus not available, will be pushed as soon as connected"), this.#i.push(this.createEventPayload(e, t)), typeof CustomEvent < "u" && !this.#u && (this.#h(), this.startConnectLoop());
			return;
		}
		return this.emitEventToBus(this.createEventPayload(e, t));
	}
	on(e, t, n) {
		let r = n?.withEventTarget ?? !1, i = `${this.#t}:${e}`;
		if (r && (this.#f ||= new EventTarget(), this.#f.addEventListener(i, (e) => {
			t(e.detail);
		})), !this.#e) return this.debugLog("Event bus client is disabled, not registering event", i), () => {};
		let a = (e) => {
			this.debugLog("Received event from bus", e.detail), t(e.detail);
		};
		return this.#n().addEventListener(i, a), this.debugLog("Registered event to bus", i), () => {
			r && this.#f?.removeEventListener(i, a), this.#n().removeEventListener(i, a);
		};
	}
	onAll(e) {
		if (!this.#e) return this.debugLog("Event bus client is disabled, not registering event"), () => {};
		let t = (t) => {
			let n = t.detail;
			e(n);
		};
		return this.#n().addEventListener("tanstack-devtools-global", t), () => this.#n().removeEventListener("tanstack-devtools-global", t);
	}
	onAllPluginEvents(e) {
		if (!this.#e) return this.debugLog("Event bus client is disabled, not registering event"), () => {};
		let t = (t) => {
			let n = t.detail;
			this.#t && n.pluginId !== this.#t || e(n);
		};
		return this.#n().addEventListener("tanstack-devtools-global", t), () => this.#n().removeEventListener("tanstack-devtools-global", t);
	}
}, o = /* @__PURE__ */ new Map();
function s(e, t) {
	o.set(e, t);
}
function c(e) {
	if (e !== void 0) try {
		return JSON.parse(JSON.stringify(e));
	} catch {
		return null;
	}
}
function l(e) {
	return typeof e.get == "function" ? e.get() : e.state;
}
function u(e) {
	return {
		key: e.key,
		store: { state: c(l(e.store)) },
		options: c(e.options)
	};
}
var d = class extends a {
	constructor(e) {
		super({
			pluginId: "pacer",
			debug: e?.debug,
			reconnectEveryMs: 1e3
		});
	}
}, f = (e, t) => {
	let n = t.key;
	n && (s(n, t), ee.emit(e, u({
		...t,
		key: n
	})));
}, ee = new d(), p = /* @__PURE__ */ ((e) => (e[e.None = 0] = "None", e[e.Mutable = 1] = "Mutable", e[e.Watching = 2] = "Watching", e[e.RecursedCheck = 4] = "RecursedCheck", e[e.Recursed = 8] = "Recursed", e[e.Dirty = 16] = "Dirty", e[e.Pending = 32] = "Pending", e))(p || {});
/* @__NO_SIDE_EFFECTS__ */
function m({ update: e, notify: t, unwatched: n }) {
	return {
		link: r,
		unlink: i,
		propagate: a,
		checkDirty: o,
		shallowPropagate: s
	};
	function r(e, t, n) {
		let r = t.depsTail;
		if (r !== void 0 && r.dep === e) return;
		let i = r === void 0 ? t.deps : r.nextDep;
		if (i !== void 0 && i.dep === e) {
			i.version = n, t.depsTail = i;
			return;
		}
		let a = e.subsTail;
		if (a !== void 0 && a.version === n && a.sub === t) return;
		let o = t.depsTail = e.subsTail = {
			version: n,
			dep: e,
			sub: t,
			prevDep: r,
			nextDep: i,
			prevSub: a,
			nextSub: void 0
		};
		i !== void 0 && (i.prevDep = o), r === void 0 ? t.deps = o : r.nextDep = o, a === void 0 ? e.subs = o : a.nextSub = o;
	}
	function i(e, t = e.sub) {
		let r = e.dep, i = e.prevDep, a = e.nextDep, o = e.nextSub, s = e.prevSub;
		return a === void 0 ? t.depsTail = i : a.prevDep = i, i === void 0 ? t.deps = a : i.nextDep = a, o === void 0 ? r.subsTail = s : o.prevSub = s, s === void 0 ? (r.subs = o) === void 0 && n(r) : s.nextSub = o, a;
	}
	function a(e) {
		let n = e.nextSub, r;
		top: do {
			let i = e.sub, a = i.flags;
			if (a & 60 ? a & 12 ? a & 4 ? !(a & 48) && c(e, i) ? (i.flags = a | 40, a &= 1) : a = 0 : i.flags = a & -9 | 32 : a = 0 : i.flags = a | 32, a & 2 && t(i), a & 1) {
				let t = i.subs;
				if (t !== void 0) {
					let i = (e = t).nextSub;
					i !== void 0 && (r = {
						value: n,
						prev: r
					}, n = i);
					continue;
				}
			}
			if ((e = n) !== void 0) {
				n = e.nextSub;
				continue;
			}
			for (; r !== void 0;) if (e = r.value, r = r.prev, e !== void 0) {
				n = e.nextSub;
				continue top;
			}
			break;
		} while (!0);
	}
	function o(t, n) {
		let r, i = 0, a = !1;
		top: do {
			let o = t.dep, c = o.flags;
			if (n.flags & 16) a = !0;
			else if ((c & 17) == 17) {
				if (e(o)) {
					let e = o.subs;
					e.nextSub !== void 0 && s(e), a = !0;
				}
			} else if ((c & 33) == 33) {
				(t.nextSub !== void 0 || t.prevSub !== void 0) && (r = {
					value: t,
					prev: r
				}), t = o.deps, n = o, ++i;
				continue;
			}
			if (!a) {
				let e = t.nextDep;
				if (e !== void 0) {
					t = e;
					continue;
				}
			}
			for (; i--;) {
				let i = n.subs, o = i.nextSub !== void 0;
				if (o ? (t = r.value, r = r.prev) : t = i, a) {
					if (e(n)) {
						o && s(i), n = t.sub;
						continue;
					}
					a = !1;
				} else n.flags &= -33;
				n = t.sub;
				let c = t.nextDep;
				if (c !== void 0) {
					t = c;
					continue top;
				}
			}
			return a;
		} while (!0);
	}
	function s(e) {
		do {
			let n = e.sub, r = n.flags;
			(r & 48) == 32 && (n.flags = r | 16, (r & 6) == 2 && t(n));
		} while ((e = e.nextSub) !== void 0);
	}
	function c(e, t) {
		let n = t.depsTail;
		for (; n !== void 0;) {
			if (n === e) return !0;
			n = n.prevDep;
		}
		return !1;
	}
}
//#endregion
//#region node_modules/.pnpm/@tanstack+store@0.9.3/node_modules/@tanstack/store/dist/esm/atom.js
function te(e, t, n) {
	let r = typeof e == "object", i = r ? e : void 0;
	return {
		next: (r ? e.next : e)?.bind(i),
		error: (r ? e.error : t)?.bind(i),
		complete: (r ? e.complete : n)?.bind(i)
	};
}
var ne = [], re = 0, { link: ie, unlink: ae, propagate: oe, checkDirty: se, shallowPropagate: ce } = /* @__PURE__ */ m({
	update(e) {
		return e._update();
	},
	notify(e) {
		ne[ue++] = e, e.flags &= ~p.Watching;
	},
	unwatched(e) {
		e.depsTail !== void 0 && (e.depsTail = void 0, e.flags = p.Mutable | p.Dirty, pe(e));
	}
}), le = 0, ue = 0, de, fe = 0;
function pe(e) {
	let t = e.depsTail, n = t === void 0 ? e.deps : t.nextDep;
	for (; n !== void 0;) n = ae(n, e);
}
function me() {
	if (!(fe > 0)) {
		for (; le < ue;) {
			let e = ne[le];
			ne[le++] = void 0, e.notify();
		}
		le = 0, ue = 0;
	}
}
function he(e, t) {
	let n = typeof e == "function", r = e, i = {
		_snapshot: n ? void 0 : e,
		subs: void 0,
		subsTail: void 0,
		deps: void 0,
		depsTail: void 0,
		flags: n ? p.None : p.Mutable,
		get() {
			return de !== void 0 && ie(i, de, re), i._snapshot;
		},
		subscribe(e) {
			let t = te(e), n = { current: !1 }, r = ge(() => {
				i.get(), n.current ? t.next?.(i._snapshot) : n.current = !0;
			});
			return { unsubscribe: () => {
				r.stop();
			} };
		},
		_update(e) {
			let a = de, o = t?.compare ?? Object.is;
			if (n) de = i, ++re, i.depsTail = void 0;
			else if (e === void 0) return !1;
			n && (i.flags = p.Mutable | p.RecursedCheck);
			try {
				let t = i._snapshot, a = typeof e == "function" ? e(t) : e === void 0 && n ? r(t) : e;
				return t === void 0 || !o(t, a) ? (i._snapshot = a, !0) : !1;
			} finally {
				de = a, n && (i.flags &= ~p.RecursedCheck), pe(i);
			}
		}
	};
	return n ? (i.flags = p.Mutable | p.Dirty, i.get = function() {
		let e = i.flags;
		if (e & p.Dirty || e & p.Pending && se(i.deps, i)) {
			if (i._update()) {
				let e = i.subs;
				e !== void 0 && ce(e);
			}
		} else e & p.Pending && (i.flags = e & ~p.Pending);
		return de !== void 0 && ie(i, de, re), i._snapshot;
	}) : i.set = function(e) {
		if (i._update(e)) {
			let e = i.subs;
			e !== void 0 && (oe(e), ce(e), me());
		}
	}, i;
}
function ge(e) {
	let t = () => {
		let t = de;
		de = n, ++re, n.depsTail = void 0, n.flags = p.Watching | p.RecursedCheck;
		try {
			return e();
		} finally {
			de = t, n.flags &= ~p.RecursedCheck, pe(n);
		}
	}, n = {
		deps: void 0,
		depsTail: void 0,
		subs: void 0,
		subsTail: void 0,
		flags: p.Watching | p.RecursedCheck,
		notify() {
			let e = this.flags;
			e & p.Dirty || e & p.Pending && se(this.deps, this) ? t() : this.flags = p.Watching;
		},
		stop() {
			this.flags = p.None, this.depsTail = void 0, pe(this);
		}
	};
	return t(), n;
}
//#endregion
//#region node_modules/.pnpm/@tanstack+store@0.9.3/node_modules/@tanstack/store/dist/esm/store.js
var _e = class {
	constructor(e) {
		this.atom = he(e);
	}
	setState(e) {
		this.atom.set(e);
	}
	get state() {
		return this.atom.get();
	}
	get() {
		return this.state;
	}
	subscribe(e) {
		return this.atom.subscribe(te(e));
	}
};
//#endregion
//#region node_modules/.pnpm/@tanstack+pacer@0.20.1/node_modules/@tanstack/pacer/dist/throttler.js
function ve() {
	return {
		executionCount: 0,
		isPending: !1,
		lastArgs: void 0,
		lastExecutionTime: 0,
		nextExecutionTime: 0,
		status: "idle",
		maybeExecuteCount: 0
	};
}
var ye = {
	enabled: !0,
	leading: !0,
	trailing: !0,
	wait: 0
}, be = class {
	#e;
	constructor(e, t) {
		this.fn = e, this.store = new _e(ve()), this.setOptions = (e) => {
			this.options = {
				...this.options,
				...e
			}, this.#n() || this.cancel();
		}, this.maybeExecute = (...e) => {
			this.#t({ maybeExecuteCount: this.store.state.maybeExecuteCount + 1 });
			let t = Date.now(), n = t - this.store.state.lastExecutionTime, r = this.#r();
			if (this.options.leading && n >= r) this.#i(...e);
			else if (this.#t({ lastArgs: e }), !this.#e && this.options.trailing) {
				let e = r - (this.store.state.lastExecutionTime ? t - this.store.state.lastExecutionTime : 0);
				this.#t({ isPending: !0 }), this.#e = setTimeout(() => {
					let { lastArgs: e } = this.store.state;
					e !== void 0 && this.#i(...e);
				}, e);
			}
		}, this.flush = () => {
			this.store.state.isPending && this.store.state.lastArgs && this.#i(...this.store.state.lastArgs);
		}, this.cancel = () => {
			this.#a(), this.#t({
				lastArgs: void 0,
				isPending: !1
			});
		}, this.reset = () => {
			this.#t(ve());
		}, this.key = t.key, this.options = {
			...ye,
			...t
		}, this.#t(this.options.initialState ?? {}), this.key && ee.on("d-Throttler", (e) => {
			e.payload.key === this.key && (this.#t(e.payload.store.state), this.setOptions(e.payload.options));
		});
	}
	#t = (e) => {
		this.store.setState((t) => {
			let n = {
				...t,
				...e
			}, { isPending: r } = n;
			return {
				...n,
				status: this.#n() ? r ? "pending" : "idle" : "disabled"
			};
		}), f("Throttler", this);
	};
	#n = () => !!i(this.options.enabled, this);
	#r = () => i(this.options.wait, this);
	#i = (...e) => {
		if (!this.#n()) return;
		this.fn(...e);
		let t = Date.now(), n = t + this.#r();
		this.#a(), this.#t({
			executionCount: this.store.state.executionCount + 1,
			lastExecutionTime: t,
			nextExecutionTime: n,
			isPending: !1,
			lastArgs: void 0
		}), this.options.onExecute?.(e, this), setTimeout(() => {
			this.store.state.isPending || this.#t({ nextExecutionTime: void 0 });
		}, this.#r());
	};
	#a = () => {
		this.#e &&= (clearTimeout(this.#e), void 0);
	};
}, xe = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;
//#endregion
//#region node_modules/.pnpm/uuid@11.1.1/node_modules/uuid/dist/esm-browser/validate.js
function Se(e) {
	return typeof e == "string" && xe.test(e);
}
//#endregion
//#region node_modules/.pnpm/uuid@11.1.1/node_modules/uuid/dist/esm-browser/parse.js
function Ce(e) {
	if (!Se(e)) throw TypeError("Invalid UUID");
	let t;
	return Uint8Array.of((t = parseInt(e.slice(0, 8), 16)) >>> 24, t >>> 16 & 255, t >>> 8 & 255, t & 255, (t = parseInt(e.slice(9, 13), 16)) >>> 8, t & 255, (t = parseInt(e.slice(14, 18), 16)) >>> 8, t & 255, (t = parseInt(e.slice(19, 23), 16)) >>> 8, t & 255, (t = parseInt(e.slice(24, 36), 16)) / 1099511627776 & 255, t / 4294967296 & 255, t >>> 24 & 255, t >>> 16 & 255, t >>> 8 & 255, t & 255);
}
//#endregion
//#region node_modules/.pnpm/uuid@11.1.1/node_modules/uuid/dist/esm-browser/stringify.js
var we = [];
for (let e = 0; e < 256; ++e) we.push((e + 256).toString(16).slice(1));
function Te(e, t = 0) {
	return (we[e[t + 0]] + we[e[t + 1]] + we[e[t + 2]] + we[e[t + 3]] + "-" + we[e[t + 4]] + we[e[t + 5]] + "-" + we[e[t + 6]] + we[e[t + 7]] + "-" + we[e[t + 8]] + we[e[t + 9]] + "-" + we[e[t + 10]] + we[e[t + 11]] + we[e[t + 12]] + we[e[t + 13]] + we[e[t + 14]] + we[e[t + 15]]).toLowerCase();
}
//#endregion
//#region node_modules/.pnpm/uuid@11.1.1/node_modules/uuid/dist/esm-browser/rng.js
var Ee, De = new Uint8Array(16);
function Oe() {
	if (!Ee) {
		if (typeof crypto > "u" || !crypto.getRandomValues) throw Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
		Ee = crypto.getRandomValues.bind(crypto);
	}
	return Ee(De);
}
//#endregion
//#region node_modules/.pnpm/uuid@11.1.1/node_modules/uuid/dist/esm-browser/v35.js
function ke(e) {
	e = unescape(encodeURIComponent(e));
	let t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; ++n) t[n] = e.charCodeAt(n);
	return t;
}
var Ae = "6ba7b810-9dad-11d1-80b4-00c04fd430c8", je = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
function Me(e, t, n, r, i, a) {
	let o = typeof n == "string" ? ke(n) : n, s = typeof r == "string" ? Ce(r) : r;
	if (typeof r == "string" && (r = Ce(r)), r?.length !== 16) throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
	let c = new Uint8Array(16 + o.length);
	if (c.set(s), c.set(o, s.length), c = t(c), c[6] = c[6] & 15 | e, c[8] = c[8] & 63 | 128, i) {
		if (a ||= 0, a < 0 || a + 16 > i.length) throw RangeError(`UUID byte range ${a}:${a + 15} is out of buffer bounds`);
		for (let e = 0; e < 16; ++e) i[a + e] = c[e];
		return i;
	}
	return Te(c);
}
var Ne = { randomUUID: typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto) };
//#endregion
//#region node_modules/.pnpm/uuid@11.1.1/node_modules/uuid/dist/esm-browser/v4.js
function Pe(e, t, n) {
	if (Ne.randomUUID && !t && !e) return Ne.randomUUID();
	e ||= {};
	let r = e.random ?? e.rng?.() ?? Oe();
	if (r.length < 16) throw Error("Random bytes length must be >= 16");
	if (r[6] = r[6] & 15 | 64, r[8] = r[8] & 63 | 128, t) {
		if (n ||= 0, n < 0 || n + 16 > t.length) throw RangeError(`UUID byte range ${n}:${n + 15} is out of buffer bounds`);
		for (let e = 0; e < 16; ++e) t[n + e] = r[e];
		return t;
	}
	return Te(r);
}
//#endregion
//#region node_modules/.pnpm/uuid@11.1.1/node_modules/uuid/dist/esm-browser/sha1.js
function Fe(e, t, n, r) {
	switch (e) {
		case 0: return t & n ^ ~t & r;
		case 1: return t ^ n ^ r;
		case 2: return t & n ^ t & r ^ n & r;
		case 3: return t ^ n ^ r;
	}
}
function Ie(e, t) {
	return e << t | e >>> 32 - t;
}
function Le(e) {
	let t = [
		1518500249,
		1859775393,
		2400959708,
		3395469782
	], n = [
		1732584193,
		4023233417,
		2562383102,
		271733878,
		3285377520
	], r = new Uint8Array(e.length + 1);
	r.set(e), r[e.length] = 128, e = r;
	let i = e.length / 4 + 2, a = Math.ceil(i / 16), o = Array(a);
	for (let t = 0; t < a; ++t) {
		let n = new Uint32Array(16);
		for (let r = 0; r < 16; ++r) n[r] = e[t * 64 + r * 4] << 24 | e[t * 64 + r * 4 + 1] << 16 | e[t * 64 + r * 4 + 2] << 8 | e[t * 64 + r * 4 + 3];
		o[t] = n;
	}
	o[a - 1][14] = (e.length - 1) * 8 / 2 ** 32, o[a - 1][14] = Math.floor(o[a - 1][14]), o[a - 1][15] = (e.length - 1) * 8 & 4294967295;
	for (let e = 0; e < a; ++e) {
		let r = new Uint32Array(80);
		for (let t = 0; t < 16; ++t) r[t] = o[e][t];
		for (let e = 16; e < 80; ++e) r[e] = Ie(r[e - 3] ^ r[e - 8] ^ r[e - 14] ^ r[e - 16], 1);
		let i = n[0], a = n[1], s = n[2], c = n[3], l = n[4];
		for (let e = 0; e < 80; ++e) {
			let n = Math.floor(e / 20), o = Ie(i, 5) + Fe(n, a, s, c) + l + t[n] + r[e] >>> 0;
			l = c, c = s, s = Ie(a, 30) >>> 0, a = i, i = o;
		}
		n[0] = n[0] + i >>> 0, n[1] = n[1] + a >>> 0, n[2] = n[2] + s >>> 0, n[3] = n[3] + c >>> 0, n[4] = n[4] + l >>> 0;
	}
	return Uint8Array.of(n[0] >> 24, n[0] >> 16, n[0] >> 8, n[0], n[1] >> 24, n[1] >> 16, n[1] >> 8, n[1], n[2] >> 24, n[2] >> 16, n[2] >> 8, n[2], n[3] >> 24, n[3] >> 16, n[3] >> 8, n[3], n[4] >> 24, n[4] >> 16, n[4] >> 8, n[4]);
}
//#endregion
//#region node_modules/.pnpm/uuid@11.1.1/node_modules/uuid/dist/esm-browser/v5.js
function Re(e, t, n, r) {
	return Me(80, Le, e, t, n, r);
}
Re.DNS = Ae, Re.URL = je;
//#endregion
//#region node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/helpers/util.js
var h;
(function(e) {
	e.assertEqual = (e) => {};
	function t(e) {}
	e.assertIs = t;
	function n(e) {
		throw Error();
	}
	e.assertNever = n, e.arrayToEnum = (e) => {
		let t = {};
		for (let n of e) t[n] = n;
		return t;
	}, e.getValidEnumValues = (t) => {
		let n = e.objectKeys(t).filter((e) => typeof t[t[e]] != "number"), r = {};
		for (let e of n) r[e] = t[e];
		return e.objectValues(r);
	}, e.objectValues = (t) => e.objectKeys(t).map(function(e) {
		return t[e];
	}), e.objectKeys = typeof Object.keys == "function" ? (e) => Object.keys(e) : (e) => {
		let t = [];
		for (let n in e) Object.prototype.hasOwnProperty.call(e, n) && t.push(n);
		return t;
	}, e.find = (e, t) => {
		for (let n of e) if (t(n)) return n;
	}, e.isInteger = typeof Number.isInteger == "function" ? (e) => Number.isInteger(e) : (e) => typeof e == "number" && Number.isFinite(e) && Math.floor(e) === e;
	function r(e, t = " | ") {
		return e.map((e) => typeof e == "string" ? `'${e}'` : e).join(t);
	}
	e.joinValues = r, e.jsonStringifyReplacer = (e, t) => typeof t == "bigint" ? t.toString() : t;
})(h ||= {});
var ze;
(function(e) {
	e.mergeShapes = (e, t) => ({
		...e,
		...t
	});
})(ze ||= {});
var g = h.arrayToEnum([
	"string",
	"nan",
	"number",
	"integer",
	"float",
	"boolean",
	"date",
	"bigint",
	"symbol",
	"function",
	"undefined",
	"null",
	"array",
	"object",
	"unknown",
	"promise",
	"void",
	"never",
	"map",
	"set"
]), Be = (e) => {
	switch (typeof e) {
		case "undefined": return g.undefined;
		case "string": return g.string;
		case "number": return Number.isNaN(e) ? g.nan : g.number;
		case "boolean": return g.boolean;
		case "function": return g.function;
		case "bigint": return g.bigint;
		case "symbol": return g.symbol;
		case "object": return Array.isArray(e) ? g.array : e === null ? g.null : e.then && typeof e.then == "function" && e.catch && typeof e.catch == "function" ? g.promise : typeof Map < "u" && e instanceof Map ? g.map : typeof Set < "u" && e instanceof Set ? g.set : typeof Date < "u" && e instanceof Date ? g.date : g.object;
		default: return g.unknown;
	}
}, _ = h.arrayToEnum([
	"invalid_type",
	"invalid_literal",
	"custom",
	"invalid_union",
	"invalid_union_discriminator",
	"invalid_enum_value",
	"unrecognized_keys",
	"invalid_arguments",
	"invalid_return_type",
	"invalid_date",
	"invalid_string",
	"too_small",
	"too_big",
	"invalid_intersection_types",
	"not_multiple_of",
	"not_finite"
]), Ve = class e extends Error {
	get errors() {
		return this.issues;
	}
	constructor(e) {
		super(), this.issues = [], this.addIssue = (e) => {
			this.issues = [...this.issues, e];
		}, this.addIssues = (e = []) => {
			this.issues = [...this.issues, ...e];
		};
		let t = new.target.prototype;
		Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "ZodError", this.issues = e;
	}
	format(e) {
		let t = e || function(e) {
			return e.message;
		}, n = { _errors: [] }, r = (e) => {
			for (let i of e.issues) if (i.code === "invalid_union") i.unionErrors.map(r);
			else if (i.code === "invalid_return_type") r(i.returnTypeError);
			else if (i.code === "invalid_arguments") r(i.argumentsError);
			else if (i.path.length === 0) n._errors.push(t(i));
			else {
				let e = n, r = 0;
				for (; r < i.path.length;) {
					let n = i.path[r];
					r === i.path.length - 1 ? (e[n] = e[n] || { _errors: [] }, e[n]._errors.push(t(i))) : e[n] = e[n] || { _errors: [] }, e = e[n], r++;
				}
			}
		};
		return r(this), n;
	}
	static assert(t) {
		if (!(t instanceof e)) throw Error(`Not a ZodError: ${t}`);
	}
	toString() {
		return this.message;
	}
	get message() {
		return JSON.stringify(this.issues, h.jsonStringifyReplacer, 2);
	}
	get isEmpty() {
		return this.issues.length === 0;
	}
	flatten(e = (e) => e.message) {
		let t = {}, n = [];
		for (let r of this.issues) if (r.path.length > 0) {
			let n = r.path[0];
			t[n] = t[n] || [], t[n].push(e(r));
		} else n.push(e(r));
		return {
			formErrors: n,
			fieldErrors: t
		};
	}
	get formErrors() {
		return this.flatten();
	}
};
Ve.create = (e) => new Ve(e);
//#endregion
//#region node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/locales/en.js
var He = (e, t) => {
	let n;
	switch (e.code) {
		case _.invalid_type:
			n = e.received === g.undefined ? "Required" : `Expected ${e.expected}, received ${e.received}`;
			break;
		case _.invalid_literal:
			n = `Invalid literal value, expected ${JSON.stringify(e.expected, h.jsonStringifyReplacer)}`;
			break;
		case _.unrecognized_keys:
			n = `Unrecognized key(s) in object: ${h.joinValues(e.keys, ", ")}`;
			break;
		case _.invalid_union:
			n = "Invalid input";
			break;
		case _.invalid_union_discriminator:
			n = `Invalid discriminator value. Expected ${h.joinValues(e.options)}`;
			break;
		case _.invalid_enum_value:
			n = `Invalid enum value. Expected ${h.joinValues(e.options)}, received '${e.received}'`;
			break;
		case _.invalid_arguments:
			n = "Invalid function arguments";
			break;
		case _.invalid_return_type:
			n = "Invalid function return type";
			break;
		case _.invalid_date:
			n = "Invalid date";
			break;
		case _.invalid_string:
			typeof e.validation == "object" ? "includes" in e.validation ? (n = `Invalid input: must include "${e.validation.includes}"`, typeof e.validation.position == "number" && (n = `${n} at one or more positions greater than or equal to ${e.validation.position}`)) : "startsWith" in e.validation ? n = `Invalid input: must start with "${e.validation.startsWith}"` : "endsWith" in e.validation ? n = `Invalid input: must end with "${e.validation.endsWith}"` : h.assertNever(e.validation) : n = e.validation === "regex" ? "Invalid" : `Invalid ${e.validation}`;
			break;
		case _.too_small:
			n = e.type === "array" ? `Array must contain ${e.exact ? "exactly" : e.inclusive ? "at least" : "more than"} ${e.minimum} element(s)` : e.type === "string" ? `String must contain ${e.exact ? "exactly" : e.inclusive ? "at least" : "over"} ${e.minimum} character(s)` : e.type === "number" || e.type === "bigint" ? `Number must be ${e.exact ? "exactly equal to " : e.inclusive ? "greater than or equal to " : "greater than "}${e.minimum}` : e.type === "date" ? `Date must be ${e.exact ? "exactly equal to " : e.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(e.minimum))}` : "Invalid input";
			break;
		case _.too_big:
			n = e.type === "array" ? `Array must contain ${e.exact ? "exactly" : e.inclusive ? "at most" : "less than"} ${e.maximum} element(s)` : e.type === "string" ? `String must contain ${e.exact ? "exactly" : e.inclusive ? "at most" : "under"} ${e.maximum} character(s)` : e.type === "number" ? `Number must be ${e.exact ? "exactly" : e.inclusive ? "less than or equal to" : "less than"} ${e.maximum}` : e.type === "bigint" ? `BigInt must be ${e.exact ? "exactly" : e.inclusive ? "less than or equal to" : "less than"} ${e.maximum}` : e.type === "date" ? `Date must be ${e.exact ? "exactly" : e.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(e.maximum))}` : "Invalid input";
			break;
		case _.custom:
			n = "Invalid input";
			break;
		case _.invalid_intersection_types:
			n = "Intersection results could not be merged";
			break;
		case _.not_multiple_of:
			n = `Number must be a multiple of ${e.multipleOf}`;
			break;
		case _.not_finite:
			n = "Number must be finite";
			break;
		default: n = t.defaultError, h.assertNever(e);
	}
	return { message: n };
}, Ue = He;
function We() {
	return Ue;
}
//#endregion
//#region node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/helpers/parseUtil.js
var Ge = (e) => {
	let { data: t, path: n, errorMaps: r, issueData: i } = e, a = [...n, ...i.path || []], o = {
		...i,
		path: a
	};
	if (i.message !== void 0) return {
		...i,
		path: a,
		message: i.message
	};
	let s = "", c = r.filter((e) => !!e).slice().reverse();
	for (let e of c) s = e(o, {
		data: t,
		defaultError: s
	}).message;
	return {
		...i,
		path: a,
		message: s
	};
};
function v(e, t) {
	let n = We(), r = Ge({
		issueData: t,
		data: e.data,
		path: e.path,
		errorMaps: [
			e.common.contextualErrorMap,
			e.schemaErrorMap,
			n,
			n === He ? void 0 : He
		].filter((e) => !!e)
	});
	e.common.issues.push(r);
}
var Ke = class e {
	constructor() {
		this.value = "valid";
	}
	dirty() {
		this.value === "valid" && (this.value = "dirty");
	}
	abort() {
		this.value !== "aborted" && (this.value = "aborted");
	}
	static mergeArray(e, t) {
		let n = [];
		for (let r of t) {
			if (r.status === "aborted") return y;
			r.status === "dirty" && e.dirty(), n.push(r.value);
		}
		return {
			status: e.value,
			value: n
		};
	}
	static async mergeObjectAsync(t, n) {
		let r = [];
		for (let e of n) {
			let t = await e.key, n = await e.value;
			r.push({
				key: t,
				value: n
			});
		}
		return e.mergeObjectSync(t, r);
	}
	static mergeObjectSync(e, t) {
		let n = {};
		for (let r of t) {
			let { key: t, value: i } = r;
			if (t.status === "aborted" || i.status === "aborted") return y;
			t.status === "dirty" && e.dirty(), i.status === "dirty" && e.dirty(), t.value !== "__proto__" && (i.value !== void 0 || r.alwaysSet) && (n[t.value] = i.value);
		}
		return {
			status: e.value,
			value: n
		};
	}
}, y = Object.freeze({ status: "aborted" }), qe = (e) => ({
	status: "dirty",
	value: e
}), Je = (e) => ({
	status: "valid",
	value: e
}), Ye = (e) => e.status === "aborted", Xe = (e) => e.status === "dirty", Ze = (e) => e.status === "valid", Qe = (e) => typeof Promise < "u" && e instanceof Promise, b;
(function(e) {
	e.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, e.toString = (e) => typeof e == "string" ? e : e?.message;
})(b ||= {});
//#endregion
//#region node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/types.js
var $e = class {
	constructor(e, t, n, r) {
		this._cachedPath = [], this.parent = e, this.data = t, this._path = n, this._key = r;
	}
	get path() {
		return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
	}
}, et = (e, t) => {
	if (Ze(t)) return {
		success: !0,
		data: t.value
	};
	if (!e.common.issues.length) throw Error("Validation failed but no issues detected.");
	return {
		success: !1,
		get error() {
			if (this._error) return this._error;
			let t = new Ve(e.common.issues);
			return this._error = t, this._error;
		}
	};
};
function x(e) {
	if (!e) return {};
	let { errorMap: t, invalid_type_error: n, required_error: r, description: i } = e;
	if (t && (n || r)) throw Error("Can't use \"invalid_type_error\" or \"required_error\" in conjunction with custom error map.");
	return t ? {
		errorMap: t,
		description: i
	} : {
		errorMap: (t, i) => {
			let { message: a } = e;
			return t.code === "invalid_enum_value" ? { message: a ?? i.defaultError } : i.data === void 0 ? { message: a ?? r ?? i.defaultError } : t.code === "invalid_type" ? { message: a ?? n ?? i.defaultError } : { message: i.defaultError };
		},
		description: i
	};
}
var S = class {
	get description() {
		return this._def.description;
	}
	_getType(e) {
		return Be(e.data);
	}
	_getOrReturnCtx(e, t) {
		return t || {
			common: e.parent.common,
			data: e.data,
			parsedType: Be(e.data),
			schemaErrorMap: this._def.errorMap,
			path: e.path,
			parent: e.parent
		};
	}
	_processInputParams(e) {
		return {
			status: new Ke(),
			ctx: {
				common: e.parent.common,
				data: e.data,
				parsedType: Be(e.data),
				schemaErrorMap: this._def.errorMap,
				path: e.path,
				parent: e.parent
			}
		};
	}
	_parseSync(e) {
		let t = this._parse(e);
		if (Qe(t)) throw Error("Synchronous parse encountered promise.");
		return t;
	}
	_parseAsync(e) {
		let t = this._parse(e);
		return Promise.resolve(t);
	}
	parse(e, t) {
		let n = this.safeParse(e, t);
		if (n.success) return n.data;
		throw n.error;
	}
	safeParse(e, t) {
		let n = {
			common: {
				issues: [],
				async: t?.async ?? !1,
				contextualErrorMap: t?.errorMap
			},
			path: t?.path || [],
			schemaErrorMap: this._def.errorMap,
			parent: null,
			data: e,
			parsedType: Be(e)
		};
		return et(n, this._parseSync({
			data: e,
			path: n.path,
			parent: n
		}));
	}
	"~validate"(e) {
		let t = {
			common: {
				issues: [],
				async: !!this["~standard"].async
			},
			path: [],
			schemaErrorMap: this._def.errorMap,
			parent: null,
			data: e,
			parsedType: Be(e)
		};
		if (!this["~standard"].async) try {
			let n = this._parseSync({
				data: e,
				path: [],
				parent: t
			});
			return Ze(n) ? { value: n.value } : { issues: t.common.issues };
		} catch (e) {
			e?.message?.toLowerCase()?.includes("encountered") && (this["~standard"].async = !0), t.common = {
				issues: [],
				async: !0
			};
		}
		return this._parseAsync({
			data: e,
			path: [],
			parent: t
		}).then((e) => Ze(e) ? { value: e.value } : { issues: t.common.issues });
	}
	async parseAsync(e, t) {
		let n = await this.safeParseAsync(e, t);
		if (n.success) return n.data;
		throw n.error;
	}
	async safeParseAsync(e, t) {
		let n = {
			common: {
				issues: [],
				contextualErrorMap: t?.errorMap,
				async: !0
			},
			path: t?.path || [],
			schemaErrorMap: this._def.errorMap,
			parent: null,
			data: e,
			parsedType: Be(e)
		}, r = this._parse({
			data: e,
			path: n.path,
			parent: n
		});
		return et(n, await (Qe(r) ? r : Promise.resolve(r)));
	}
	refine(e, t) {
		let n = (e) => typeof t == "string" || t === void 0 ? { message: t } : typeof t == "function" ? t(e) : t;
		return this._refinement((t, r) => {
			let i = e(t), a = () => r.addIssue({
				code: _.custom,
				...n(t)
			});
			return typeof Promise < "u" && i instanceof Promise ? i.then((e) => e ? !0 : (a(), !1)) : i ? !0 : (a(), !1);
		});
	}
	refinement(e, t) {
		return this._refinement((n, r) => e(n) ? !0 : (r.addIssue(typeof t == "function" ? t(n, r) : t), !1));
	}
	_refinement(e) {
		return new rn({
			schema: this,
			typeName: C.ZodEffects,
			effect: {
				type: "refinement",
				refinement: e
			}
		});
	}
	superRefine(e) {
		return this._refinement(e);
	}
	constructor(e) {
		this.spa = this.safeParseAsync, this._def = e, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this), this["~standard"] = {
			version: 1,
			vendor: "zod",
			validate: (e) => this["~validate"](e)
		};
	}
	optional() {
		return an.create(this, this._def);
	}
	nullable() {
		return on.create(this, this._def);
	}
	nullish() {
		return this.nullable().optional();
	}
	array() {
		return Rt.create(this);
	}
	promise() {
		return nn.create(this, this._def);
	}
	or(e) {
		return Vt.create([this, e], this._def);
	}
	and(e) {
		return Gt.create(this, e, this._def);
	}
	transform(e) {
		return new rn({
			...x(this._def),
			schema: this,
			typeName: C.ZodEffects,
			effect: {
				type: "transform",
				transform: e
			}
		});
	}
	default(e) {
		let t = typeof e == "function" ? e : () => e;
		return new sn({
			...x(this._def),
			innerType: this,
			defaultValue: t,
			typeName: C.ZodDefault
		});
	}
	brand() {
		return new un({
			typeName: C.ZodBranded,
			type: this,
			...x(this._def)
		});
	}
	catch(e) {
		let t = typeof e == "function" ? e : () => e;
		return new cn({
			...x(this._def),
			innerType: this,
			catchValue: t,
			typeName: C.ZodCatch
		});
	}
	describe(e) {
		let t = this.constructor;
		return new t({
			...this._def,
			description: e
		});
	}
	pipe(e) {
		return dn.create(this, e);
	}
	readonly() {
		return fn.create(this);
	}
	isOptional() {
		return this.safeParse(void 0).success;
	}
	isNullable() {
		return this.safeParse(null).success;
	}
}, tt = /^c[^\s-]{8,}$/i, nt = /^[0-9a-z]+$/, rt = /^[0-9A-HJKMNP-TV-Z]{26}$/i, it = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, at = /^[a-z0-9_-]{21}$/i, ot = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, st = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, ct = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, lt = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", ut, dt = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, ft = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, pt = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, mt = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, ht = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, gt = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, _t = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", vt = RegExp(`^${_t}$`);
function yt(e) {
	let t = "[0-5]\\d";
	e.precision ? t = `${t}\\.\\d{${e.precision}}` : e.precision ?? (t = `${t}(\\.\\d+)?`);
	let n = e.precision ? "+" : "?";
	return `([01]\\d|2[0-3]):[0-5]\\d(:${t})${n}`;
}
function bt(e) {
	return RegExp(`^${yt(e)}$`);
}
function xt(e) {
	let t = `${_t}T${yt(e)}`, n = [];
	return n.push(e.local ? "Z?" : "Z"), e.offset && n.push("([+-]\\d{2}:?\\d{2})"), t = `${t}(${n.join("|")})`, RegExp(`^${t}$`);
}
function St(e, t) {
	return !!((t === "v4" || !t) && dt.test(e) || (t === "v6" || !t) && pt.test(e));
}
function Ct(e, t) {
	if (!ot.test(e)) return !1;
	try {
		let [n] = e.split(".");
		if (!n) return !1;
		let r = n.replace(/-/g, "+").replace(/_/g, "/").padEnd(n.length + (4 - n.length % 4) % 4, "="), i = JSON.parse(atob(r));
		return !(typeof i != "object" || !i || "typ" in i && i?.typ !== "JWT" || !i.alg || t && i.alg !== t);
	} catch {
		return !1;
	}
}
function wt(e, t) {
	return !!((t === "v4" || !t) && ft.test(e) || (t === "v6" || !t) && mt.test(e));
}
var Tt = class e extends S {
	_parse(e) {
		if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== g.string) {
			let t = this._getOrReturnCtx(e);
			return v(t, {
				code: _.invalid_type,
				expected: g.string,
				received: t.parsedType
			}), y;
		}
		let t = new Ke(), n;
		for (let r of this._def.checks) if (r.kind === "min") e.data.length < r.value && (n = this._getOrReturnCtx(e, n), v(n, {
			code: _.too_small,
			minimum: r.value,
			type: "string",
			inclusive: !0,
			exact: !1,
			message: r.message
		}), t.dirty());
		else if (r.kind === "max") e.data.length > r.value && (n = this._getOrReturnCtx(e, n), v(n, {
			code: _.too_big,
			maximum: r.value,
			type: "string",
			inclusive: !0,
			exact: !1,
			message: r.message
		}), t.dirty());
		else if (r.kind === "length") {
			let i = e.data.length > r.value, a = e.data.length < r.value;
			(i || a) && (n = this._getOrReturnCtx(e, n), i ? v(n, {
				code: _.too_big,
				maximum: r.value,
				type: "string",
				inclusive: !0,
				exact: !0,
				message: r.message
			}) : a && v(n, {
				code: _.too_small,
				minimum: r.value,
				type: "string",
				inclusive: !0,
				exact: !0,
				message: r.message
			}), t.dirty());
		} else if (r.kind === "email") ct.test(e.data) || (n = this._getOrReturnCtx(e, n), v(n, {
			validation: "email",
			code: _.invalid_string,
			message: r.message
		}), t.dirty());
		else if (r.kind === "emoji") ut ||= new RegExp(lt, "u"), ut.test(e.data) || (n = this._getOrReturnCtx(e, n), v(n, {
			validation: "emoji",
			code: _.invalid_string,
			message: r.message
		}), t.dirty());
		else if (r.kind === "uuid") it.test(e.data) || (n = this._getOrReturnCtx(e, n), v(n, {
			validation: "uuid",
			code: _.invalid_string,
			message: r.message
		}), t.dirty());
		else if (r.kind === "nanoid") at.test(e.data) || (n = this._getOrReturnCtx(e, n), v(n, {
			validation: "nanoid",
			code: _.invalid_string,
			message: r.message
		}), t.dirty());
		else if (r.kind === "cuid") tt.test(e.data) || (n = this._getOrReturnCtx(e, n), v(n, {
			validation: "cuid",
			code: _.invalid_string,
			message: r.message
		}), t.dirty());
		else if (r.kind === "cuid2") nt.test(e.data) || (n = this._getOrReturnCtx(e, n), v(n, {
			validation: "cuid2",
			code: _.invalid_string,
			message: r.message
		}), t.dirty());
		else if (r.kind === "ulid") rt.test(e.data) || (n = this._getOrReturnCtx(e, n), v(n, {
			validation: "ulid",
			code: _.invalid_string,
			message: r.message
		}), t.dirty());
		else if (r.kind === "url") try {
			new URL(e.data);
		} catch {
			n = this._getOrReturnCtx(e, n), v(n, {
				validation: "url",
				code: _.invalid_string,
				message: r.message
			}), t.dirty();
		}
		else r.kind === "regex" ? (r.regex.lastIndex = 0, r.regex.test(e.data) || (n = this._getOrReturnCtx(e, n), v(n, {
			validation: "regex",
			code: _.invalid_string,
			message: r.message
		}), t.dirty())) : r.kind === "trim" ? e.data = e.data.trim() : r.kind === "includes" ? e.data.includes(r.value, r.position) || (n = this._getOrReturnCtx(e, n), v(n, {
			code: _.invalid_string,
			validation: {
				includes: r.value,
				position: r.position
			},
			message: r.message
		}), t.dirty()) : r.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : r.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : r.kind === "startsWith" ? e.data.startsWith(r.value) || (n = this._getOrReturnCtx(e, n), v(n, {
			code: _.invalid_string,
			validation: { startsWith: r.value },
			message: r.message
		}), t.dirty()) : r.kind === "endsWith" ? e.data.endsWith(r.value) || (n = this._getOrReturnCtx(e, n), v(n, {
			code: _.invalid_string,
			validation: { endsWith: r.value },
			message: r.message
		}), t.dirty()) : r.kind === "datetime" ? xt(r).test(e.data) || (n = this._getOrReturnCtx(e, n), v(n, {
			code: _.invalid_string,
			validation: "datetime",
			message: r.message
		}), t.dirty()) : r.kind === "date" ? vt.test(e.data) || (n = this._getOrReturnCtx(e, n), v(n, {
			code: _.invalid_string,
			validation: "date",
			message: r.message
		}), t.dirty()) : r.kind === "time" ? bt(r).test(e.data) || (n = this._getOrReturnCtx(e, n), v(n, {
			code: _.invalid_string,
			validation: "time",
			message: r.message
		}), t.dirty()) : r.kind === "duration" ? st.test(e.data) || (n = this._getOrReturnCtx(e, n), v(n, {
			validation: "duration",
			code: _.invalid_string,
			message: r.message
		}), t.dirty()) : r.kind === "ip" ? St(e.data, r.version) || (n = this._getOrReturnCtx(e, n), v(n, {
			validation: "ip",
			code: _.invalid_string,
			message: r.message
		}), t.dirty()) : r.kind === "jwt" ? Ct(e.data, r.alg) || (n = this._getOrReturnCtx(e, n), v(n, {
			validation: "jwt",
			code: _.invalid_string,
			message: r.message
		}), t.dirty()) : r.kind === "cidr" ? wt(e.data, r.version) || (n = this._getOrReturnCtx(e, n), v(n, {
			validation: "cidr",
			code: _.invalid_string,
			message: r.message
		}), t.dirty()) : r.kind === "base64" ? ht.test(e.data) || (n = this._getOrReturnCtx(e, n), v(n, {
			validation: "base64",
			code: _.invalid_string,
			message: r.message
		}), t.dirty()) : r.kind === "base64url" ? gt.test(e.data) || (n = this._getOrReturnCtx(e, n), v(n, {
			validation: "base64url",
			code: _.invalid_string,
			message: r.message
		}), t.dirty()) : h.assertNever(r);
		return {
			status: t.value,
			value: e.data
		};
	}
	_regex(e, t, n) {
		return this.refinement((t) => e.test(t), {
			validation: t,
			code: _.invalid_string,
			...b.errToObj(n)
		});
	}
	_addCheck(t) {
		return new e({
			...this._def,
			checks: [...this._def.checks, t]
		});
	}
	email(e) {
		return this._addCheck({
			kind: "email",
			...b.errToObj(e)
		});
	}
	url(e) {
		return this._addCheck({
			kind: "url",
			...b.errToObj(e)
		});
	}
	emoji(e) {
		return this._addCheck({
			kind: "emoji",
			...b.errToObj(e)
		});
	}
	uuid(e) {
		return this._addCheck({
			kind: "uuid",
			...b.errToObj(e)
		});
	}
	nanoid(e) {
		return this._addCheck({
			kind: "nanoid",
			...b.errToObj(e)
		});
	}
	cuid(e) {
		return this._addCheck({
			kind: "cuid",
			...b.errToObj(e)
		});
	}
	cuid2(e) {
		return this._addCheck({
			kind: "cuid2",
			...b.errToObj(e)
		});
	}
	ulid(e) {
		return this._addCheck({
			kind: "ulid",
			...b.errToObj(e)
		});
	}
	base64(e) {
		return this._addCheck({
			kind: "base64",
			...b.errToObj(e)
		});
	}
	base64url(e) {
		return this._addCheck({
			kind: "base64url",
			...b.errToObj(e)
		});
	}
	jwt(e) {
		return this._addCheck({
			kind: "jwt",
			...b.errToObj(e)
		});
	}
	ip(e) {
		return this._addCheck({
			kind: "ip",
			...b.errToObj(e)
		});
	}
	cidr(e) {
		return this._addCheck({
			kind: "cidr",
			...b.errToObj(e)
		});
	}
	datetime(e) {
		return typeof e == "string" ? this._addCheck({
			kind: "datetime",
			precision: null,
			offset: !1,
			local: !1,
			message: e
		}) : this._addCheck({
			kind: "datetime",
			precision: e?.precision === void 0 ? null : e?.precision,
			offset: e?.offset ?? !1,
			local: e?.local ?? !1,
			...b.errToObj(e?.message)
		});
	}
	date(e) {
		return this._addCheck({
			kind: "date",
			message: e
		});
	}
	time(e) {
		return typeof e == "string" ? this._addCheck({
			kind: "time",
			precision: null,
			message: e
		}) : this._addCheck({
			kind: "time",
			precision: e?.precision === void 0 ? null : e?.precision,
			...b.errToObj(e?.message)
		});
	}
	duration(e) {
		return this._addCheck({
			kind: "duration",
			...b.errToObj(e)
		});
	}
	regex(e, t) {
		return this._addCheck({
			kind: "regex",
			regex: e,
			...b.errToObj(t)
		});
	}
	includes(e, t) {
		return this._addCheck({
			kind: "includes",
			value: e,
			position: t?.position,
			...b.errToObj(t?.message)
		});
	}
	startsWith(e, t) {
		return this._addCheck({
			kind: "startsWith",
			value: e,
			...b.errToObj(t)
		});
	}
	endsWith(e, t) {
		return this._addCheck({
			kind: "endsWith",
			value: e,
			...b.errToObj(t)
		});
	}
	min(e, t) {
		return this._addCheck({
			kind: "min",
			value: e,
			...b.errToObj(t)
		});
	}
	max(e, t) {
		return this._addCheck({
			kind: "max",
			value: e,
			...b.errToObj(t)
		});
	}
	length(e, t) {
		return this._addCheck({
			kind: "length",
			value: e,
			...b.errToObj(t)
		});
	}
	nonempty(e) {
		return this.min(1, b.errToObj(e));
	}
	trim() {
		return new e({
			...this._def,
			checks: [...this._def.checks, { kind: "trim" }]
		});
	}
	toLowerCase() {
		return new e({
			...this._def,
			checks: [...this._def.checks, { kind: "toLowerCase" }]
		});
	}
	toUpperCase() {
		return new e({
			...this._def,
			checks: [...this._def.checks, { kind: "toUpperCase" }]
		});
	}
	get isDatetime() {
		return !!this._def.checks.find((e) => e.kind === "datetime");
	}
	get isDate() {
		return !!this._def.checks.find((e) => e.kind === "date");
	}
	get isTime() {
		return !!this._def.checks.find((e) => e.kind === "time");
	}
	get isDuration() {
		return !!this._def.checks.find((e) => e.kind === "duration");
	}
	get isEmail() {
		return !!this._def.checks.find((e) => e.kind === "email");
	}
	get isURL() {
		return !!this._def.checks.find((e) => e.kind === "url");
	}
	get isEmoji() {
		return !!this._def.checks.find((e) => e.kind === "emoji");
	}
	get isUUID() {
		return !!this._def.checks.find((e) => e.kind === "uuid");
	}
	get isNANOID() {
		return !!this._def.checks.find((e) => e.kind === "nanoid");
	}
	get isCUID() {
		return !!this._def.checks.find((e) => e.kind === "cuid");
	}
	get isCUID2() {
		return !!this._def.checks.find((e) => e.kind === "cuid2");
	}
	get isULID() {
		return !!this._def.checks.find((e) => e.kind === "ulid");
	}
	get isIP() {
		return !!this._def.checks.find((e) => e.kind === "ip");
	}
	get isCIDR() {
		return !!this._def.checks.find((e) => e.kind === "cidr");
	}
	get isBase64() {
		return !!this._def.checks.find((e) => e.kind === "base64");
	}
	get isBase64url() {
		return !!this._def.checks.find((e) => e.kind === "base64url");
	}
	get minLength() {
		let e = null;
		for (let t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
		return e;
	}
	get maxLength() {
		let e = null;
		for (let t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
		return e;
	}
};
Tt.create = (e) => new Tt({
	checks: [],
	typeName: C.ZodString,
	coerce: e?.coerce ?? !1,
	...x(e)
});
function Et(e, t) {
	let n = (e.toString().split(".")[1] || "").length, r = (t.toString().split(".")[1] || "").length, i = n > r ? n : r;
	return Number.parseInt(e.toFixed(i).replace(".", "")) % Number.parseInt(t.toFixed(i).replace(".", "")) / 10 ** i;
}
var Dt = class e extends S {
	constructor() {
		super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
	}
	_parse(e) {
		if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== g.number) {
			let t = this._getOrReturnCtx(e);
			return v(t, {
				code: _.invalid_type,
				expected: g.number,
				received: t.parsedType
			}), y;
		}
		let t, n = new Ke();
		for (let r of this._def.checks) r.kind === "int" ? h.isInteger(e.data) || (t = this._getOrReturnCtx(e, t), v(t, {
			code: _.invalid_type,
			expected: "integer",
			received: "float",
			message: r.message
		}), n.dirty()) : r.kind === "min" ? (r.inclusive ? e.data < r.value : e.data <= r.value) && (t = this._getOrReturnCtx(e, t), v(t, {
			code: _.too_small,
			minimum: r.value,
			type: "number",
			inclusive: r.inclusive,
			exact: !1,
			message: r.message
		}), n.dirty()) : r.kind === "max" ? (r.inclusive ? e.data > r.value : e.data >= r.value) && (t = this._getOrReturnCtx(e, t), v(t, {
			code: _.too_big,
			maximum: r.value,
			type: "number",
			inclusive: r.inclusive,
			exact: !1,
			message: r.message
		}), n.dirty()) : r.kind === "multipleOf" ? Et(e.data, r.value) !== 0 && (t = this._getOrReturnCtx(e, t), v(t, {
			code: _.not_multiple_of,
			multipleOf: r.value,
			message: r.message
		}), n.dirty()) : r.kind === "finite" ? Number.isFinite(e.data) || (t = this._getOrReturnCtx(e, t), v(t, {
			code: _.not_finite,
			message: r.message
		}), n.dirty()) : h.assertNever(r);
		return {
			status: n.value,
			value: e.data
		};
	}
	gte(e, t) {
		return this.setLimit("min", e, !0, b.toString(t));
	}
	gt(e, t) {
		return this.setLimit("min", e, !1, b.toString(t));
	}
	lte(e, t) {
		return this.setLimit("max", e, !0, b.toString(t));
	}
	lt(e, t) {
		return this.setLimit("max", e, !1, b.toString(t));
	}
	setLimit(t, n, r, i) {
		return new e({
			...this._def,
			checks: [...this._def.checks, {
				kind: t,
				value: n,
				inclusive: r,
				message: b.toString(i)
			}]
		});
	}
	_addCheck(t) {
		return new e({
			...this._def,
			checks: [...this._def.checks, t]
		});
	}
	int(e) {
		return this._addCheck({
			kind: "int",
			message: b.toString(e)
		});
	}
	positive(e) {
		return this._addCheck({
			kind: "min",
			value: 0,
			inclusive: !1,
			message: b.toString(e)
		});
	}
	negative(e) {
		return this._addCheck({
			kind: "max",
			value: 0,
			inclusive: !1,
			message: b.toString(e)
		});
	}
	nonpositive(e) {
		return this._addCheck({
			kind: "max",
			value: 0,
			inclusive: !0,
			message: b.toString(e)
		});
	}
	nonnegative(e) {
		return this._addCheck({
			kind: "min",
			value: 0,
			inclusive: !0,
			message: b.toString(e)
		});
	}
	multipleOf(e, t) {
		return this._addCheck({
			kind: "multipleOf",
			value: e,
			message: b.toString(t)
		});
	}
	finite(e) {
		return this._addCheck({
			kind: "finite",
			message: b.toString(e)
		});
	}
	safe(e) {
		return this._addCheck({
			kind: "min",
			inclusive: !0,
			value: -(2 ** 53 - 1),
			message: b.toString(e)
		})._addCheck({
			kind: "max",
			inclusive: !0,
			value: 2 ** 53 - 1,
			message: b.toString(e)
		});
	}
	get minValue() {
		let e = null;
		for (let t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
		return e;
	}
	get maxValue() {
		let e = null;
		for (let t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
		return e;
	}
	get isInt() {
		return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && h.isInteger(e.value));
	}
	get isFinite() {
		let e = null, t = null;
		for (let n of this._def.checks) if (n.kind === "finite" || n.kind === "int" || n.kind === "multipleOf") return !0;
		else n.kind === "min" ? (t === null || n.value > t) && (t = n.value) : n.kind === "max" && (e === null || n.value < e) && (e = n.value);
		return Number.isFinite(t) && Number.isFinite(e);
	}
};
Dt.create = (e) => new Dt({
	checks: [],
	typeName: C.ZodNumber,
	coerce: e?.coerce || !1,
	...x(e)
});
var Ot = class e extends S {
	constructor() {
		super(...arguments), this.min = this.gte, this.max = this.lte;
	}
	_parse(e) {
		if (this._def.coerce) try {
			e.data = BigInt(e.data);
		} catch {
			return this._getInvalidInput(e);
		}
		if (this._getType(e) !== g.bigint) return this._getInvalidInput(e);
		let t, n = new Ke();
		for (let r of this._def.checks) r.kind === "min" ? (r.inclusive ? e.data < r.value : e.data <= r.value) && (t = this._getOrReturnCtx(e, t), v(t, {
			code: _.too_small,
			type: "bigint",
			minimum: r.value,
			inclusive: r.inclusive,
			message: r.message
		}), n.dirty()) : r.kind === "max" ? (r.inclusive ? e.data > r.value : e.data >= r.value) && (t = this._getOrReturnCtx(e, t), v(t, {
			code: _.too_big,
			type: "bigint",
			maximum: r.value,
			inclusive: r.inclusive,
			message: r.message
		}), n.dirty()) : r.kind === "multipleOf" ? e.data % r.value !== BigInt(0) && (t = this._getOrReturnCtx(e, t), v(t, {
			code: _.not_multiple_of,
			multipleOf: r.value,
			message: r.message
		}), n.dirty()) : h.assertNever(r);
		return {
			status: n.value,
			value: e.data
		};
	}
	_getInvalidInput(e) {
		let t = this._getOrReturnCtx(e);
		return v(t, {
			code: _.invalid_type,
			expected: g.bigint,
			received: t.parsedType
		}), y;
	}
	gte(e, t) {
		return this.setLimit("min", e, !0, b.toString(t));
	}
	gt(e, t) {
		return this.setLimit("min", e, !1, b.toString(t));
	}
	lte(e, t) {
		return this.setLimit("max", e, !0, b.toString(t));
	}
	lt(e, t) {
		return this.setLimit("max", e, !1, b.toString(t));
	}
	setLimit(t, n, r, i) {
		return new e({
			...this._def,
			checks: [...this._def.checks, {
				kind: t,
				value: n,
				inclusive: r,
				message: b.toString(i)
			}]
		});
	}
	_addCheck(t) {
		return new e({
			...this._def,
			checks: [...this._def.checks, t]
		});
	}
	positive(e) {
		return this._addCheck({
			kind: "min",
			value: BigInt(0),
			inclusive: !1,
			message: b.toString(e)
		});
	}
	negative(e) {
		return this._addCheck({
			kind: "max",
			value: BigInt(0),
			inclusive: !1,
			message: b.toString(e)
		});
	}
	nonpositive(e) {
		return this._addCheck({
			kind: "max",
			value: BigInt(0),
			inclusive: !0,
			message: b.toString(e)
		});
	}
	nonnegative(e) {
		return this._addCheck({
			kind: "min",
			value: BigInt(0),
			inclusive: !0,
			message: b.toString(e)
		});
	}
	multipleOf(e, t) {
		return this._addCheck({
			kind: "multipleOf",
			value: e,
			message: b.toString(t)
		});
	}
	get minValue() {
		let e = null;
		for (let t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
		return e;
	}
	get maxValue() {
		let e = null;
		for (let t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
		return e;
	}
};
Ot.create = (e) => new Ot({
	checks: [],
	typeName: C.ZodBigInt,
	coerce: e?.coerce ?? !1,
	...x(e)
});
var kt = class extends S {
	_parse(e) {
		if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== g.boolean) {
			let t = this._getOrReturnCtx(e);
			return v(t, {
				code: _.invalid_type,
				expected: g.boolean,
				received: t.parsedType
			}), y;
		}
		return Je(e.data);
	}
};
kt.create = (e) => new kt({
	typeName: C.ZodBoolean,
	coerce: e?.coerce || !1,
	...x(e)
});
var At = class e extends S {
	_parse(e) {
		if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== g.date) {
			let t = this._getOrReturnCtx(e);
			return v(t, {
				code: _.invalid_type,
				expected: g.date,
				received: t.parsedType
			}), y;
		}
		if (Number.isNaN(e.data.getTime())) return v(this._getOrReturnCtx(e), { code: _.invalid_date }), y;
		let t = new Ke(), n;
		for (let r of this._def.checks) r.kind === "min" ? e.data.getTime() < r.value && (n = this._getOrReturnCtx(e, n), v(n, {
			code: _.too_small,
			message: r.message,
			inclusive: !0,
			exact: !1,
			minimum: r.value,
			type: "date"
		}), t.dirty()) : r.kind === "max" ? e.data.getTime() > r.value && (n = this._getOrReturnCtx(e, n), v(n, {
			code: _.too_big,
			message: r.message,
			inclusive: !0,
			exact: !1,
			maximum: r.value,
			type: "date"
		}), t.dirty()) : h.assertNever(r);
		return {
			status: t.value,
			value: new Date(e.data.getTime())
		};
	}
	_addCheck(t) {
		return new e({
			...this._def,
			checks: [...this._def.checks, t]
		});
	}
	min(e, t) {
		return this._addCheck({
			kind: "min",
			value: e.getTime(),
			message: b.toString(t)
		});
	}
	max(e, t) {
		return this._addCheck({
			kind: "max",
			value: e.getTime(),
			message: b.toString(t)
		});
	}
	get minDate() {
		let e = null;
		for (let t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
		return e == null ? null : new Date(e);
	}
	get maxDate() {
		let e = null;
		for (let t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
		return e == null ? null : new Date(e);
	}
};
At.create = (e) => new At({
	checks: [],
	coerce: e?.coerce || !1,
	typeName: C.ZodDate,
	...x(e)
});
var jt = class extends S {
	_parse(e) {
		if (this._getType(e) !== g.symbol) {
			let t = this._getOrReturnCtx(e);
			return v(t, {
				code: _.invalid_type,
				expected: g.symbol,
				received: t.parsedType
			}), y;
		}
		return Je(e.data);
	}
};
jt.create = (e) => new jt({
	typeName: C.ZodSymbol,
	...x(e)
});
var Mt = class extends S {
	_parse(e) {
		if (this._getType(e) !== g.undefined) {
			let t = this._getOrReturnCtx(e);
			return v(t, {
				code: _.invalid_type,
				expected: g.undefined,
				received: t.parsedType
			}), y;
		}
		return Je(e.data);
	}
};
Mt.create = (e) => new Mt({
	typeName: C.ZodUndefined,
	...x(e)
});
var Nt = class extends S {
	_parse(e) {
		if (this._getType(e) !== g.null) {
			let t = this._getOrReturnCtx(e);
			return v(t, {
				code: _.invalid_type,
				expected: g.null,
				received: t.parsedType
			}), y;
		}
		return Je(e.data);
	}
};
Nt.create = (e) => new Nt({
	typeName: C.ZodNull,
	...x(e)
});
var Pt = class extends S {
	constructor() {
		super(...arguments), this._any = !0;
	}
	_parse(e) {
		return Je(e.data);
	}
};
Pt.create = (e) => new Pt({
	typeName: C.ZodAny,
	...x(e)
});
var Ft = class extends S {
	constructor() {
		super(...arguments), this._unknown = !0;
	}
	_parse(e) {
		return Je(e.data);
	}
};
Ft.create = (e) => new Ft({
	typeName: C.ZodUnknown,
	...x(e)
});
var It = class extends S {
	_parse(e) {
		let t = this._getOrReturnCtx(e);
		return v(t, {
			code: _.invalid_type,
			expected: g.never,
			received: t.parsedType
		}), y;
	}
};
It.create = (e) => new It({
	typeName: C.ZodNever,
	...x(e)
});
var Lt = class extends S {
	_parse(e) {
		if (this._getType(e) !== g.undefined) {
			let t = this._getOrReturnCtx(e);
			return v(t, {
				code: _.invalid_type,
				expected: g.void,
				received: t.parsedType
			}), y;
		}
		return Je(e.data);
	}
};
Lt.create = (e) => new Lt({
	typeName: C.ZodVoid,
	...x(e)
});
var Rt = class e extends S {
	_parse(e) {
		let { ctx: t, status: n } = this._processInputParams(e), r = this._def;
		if (t.parsedType !== g.array) return v(t, {
			code: _.invalid_type,
			expected: g.array,
			received: t.parsedType
		}), y;
		if (r.exactLength !== null) {
			let e = t.data.length > r.exactLength.value, i = t.data.length < r.exactLength.value;
			(e || i) && (v(t, {
				code: e ? _.too_big : _.too_small,
				minimum: i ? r.exactLength.value : void 0,
				maximum: e ? r.exactLength.value : void 0,
				type: "array",
				inclusive: !0,
				exact: !0,
				message: r.exactLength.message
			}), n.dirty());
		}
		if (r.minLength !== null && t.data.length < r.minLength.value && (v(t, {
			code: _.too_small,
			minimum: r.minLength.value,
			type: "array",
			inclusive: !0,
			exact: !1,
			message: r.minLength.message
		}), n.dirty()), r.maxLength !== null && t.data.length > r.maxLength.value && (v(t, {
			code: _.too_big,
			maximum: r.maxLength.value,
			type: "array",
			inclusive: !0,
			exact: !1,
			message: r.maxLength.message
		}), n.dirty()), t.common.async) return Promise.all([...t.data].map((e, n) => r.type._parseAsync(new $e(t, e, t.path, n)))).then((e) => Ke.mergeArray(n, e));
		let i = [...t.data].map((e, n) => r.type._parseSync(new $e(t, e, t.path, n)));
		return Ke.mergeArray(n, i);
	}
	get element() {
		return this._def.type;
	}
	min(t, n) {
		return new e({
			...this._def,
			minLength: {
				value: t,
				message: b.toString(n)
			}
		});
	}
	max(t, n) {
		return new e({
			...this._def,
			maxLength: {
				value: t,
				message: b.toString(n)
			}
		});
	}
	length(t, n) {
		return new e({
			...this._def,
			exactLength: {
				value: t,
				message: b.toString(n)
			}
		});
	}
	nonempty(e) {
		return this.min(1, e);
	}
};
Rt.create = (e, t) => new Rt({
	type: e,
	minLength: null,
	maxLength: null,
	exactLength: null,
	typeName: C.ZodArray,
	...x(t)
});
function zt(e) {
	if (e instanceof Bt) {
		let t = {};
		for (let n in e.shape) {
			let r = e.shape[n];
			t[n] = an.create(zt(r));
		}
		return new Bt({
			...e._def,
			shape: () => t
		});
	} else if (e instanceof Rt) return new Rt({
		...e._def,
		type: zt(e.element)
	});
	else if (e instanceof an) return an.create(zt(e.unwrap()));
	else if (e instanceof on) return on.create(zt(e.unwrap()));
	else if (e instanceof Kt) return Kt.create(e.items.map((e) => zt(e)));
	else return e;
}
var Bt = class e extends S {
	constructor() {
		super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
	}
	_getCached() {
		if (this._cached !== null) return this._cached;
		let e = this._def.shape(), t = h.objectKeys(e);
		return this._cached = {
			shape: e,
			keys: t
		}, this._cached;
	}
	_parse(e) {
		if (this._getType(e) !== g.object) {
			let t = this._getOrReturnCtx(e);
			return v(t, {
				code: _.invalid_type,
				expected: g.object,
				received: t.parsedType
			}), y;
		}
		let { status: t, ctx: n } = this._processInputParams(e), { shape: r, keys: i } = this._getCached(), a = [];
		if (!(this._def.catchall instanceof It && this._def.unknownKeys === "strip")) for (let e in n.data) i.includes(e) || a.push(e);
		let o = [];
		for (let e of i) {
			let t = r[e], i = n.data[e];
			o.push({
				key: {
					status: "valid",
					value: e
				},
				value: t._parse(new $e(n, i, n.path, e)),
				alwaysSet: e in n.data
			});
		}
		if (this._def.catchall instanceof It) {
			let e = this._def.unknownKeys;
			if (e === "passthrough") for (let e of a) o.push({
				key: {
					status: "valid",
					value: e
				},
				value: {
					status: "valid",
					value: n.data[e]
				}
			});
			else if (e === "strict") a.length > 0 && (v(n, {
				code: _.unrecognized_keys,
				keys: a
			}), t.dirty());
			else if (e !== "strip") throw Error("Internal ZodObject error: invalid unknownKeys value.");
		} else {
			let e = this._def.catchall;
			for (let t of a) {
				let r = n.data[t];
				o.push({
					key: {
						status: "valid",
						value: t
					},
					value: e._parse(new $e(n, r, n.path, t)),
					alwaysSet: t in n.data
				});
			}
		}
		return n.common.async ? Promise.resolve().then(async () => {
			let e = [];
			for (let t of o) {
				let n = await t.key, r = await t.value;
				e.push({
					key: n,
					value: r,
					alwaysSet: t.alwaysSet
				});
			}
			return e;
		}).then((e) => Ke.mergeObjectSync(t, e)) : Ke.mergeObjectSync(t, o);
	}
	get shape() {
		return this._def.shape();
	}
	strict(t) {
		return b.errToObj, new e({
			...this._def,
			unknownKeys: "strict",
			...t === void 0 ? {} : { errorMap: (e, n) => {
				let r = this._def.errorMap?.(e, n).message ?? n.defaultError;
				return e.code === "unrecognized_keys" ? { message: b.errToObj(t).message ?? r } : { message: r };
			} }
		});
	}
	strip() {
		return new e({
			...this._def,
			unknownKeys: "strip"
		});
	}
	passthrough() {
		return new e({
			...this._def,
			unknownKeys: "passthrough"
		});
	}
	extend(t) {
		return new e({
			...this._def,
			shape: () => ({
				...this._def.shape(),
				...t
			})
		});
	}
	merge(t) {
		return new e({
			unknownKeys: t._def.unknownKeys,
			catchall: t._def.catchall,
			shape: () => ({
				...this._def.shape(),
				...t._def.shape()
			}),
			typeName: C.ZodObject
		});
	}
	setKey(e, t) {
		return this.augment({ [e]: t });
	}
	catchall(t) {
		return new e({
			...this._def,
			catchall: t
		});
	}
	pick(t) {
		let n = {};
		for (let e of h.objectKeys(t)) t[e] && this.shape[e] && (n[e] = this.shape[e]);
		return new e({
			...this._def,
			shape: () => n
		});
	}
	omit(t) {
		let n = {};
		for (let e of h.objectKeys(this.shape)) t[e] || (n[e] = this.shape[e]);
		return new e({
			...this._def,
			shape: () => n
		});
	}
	deepPartial() {
		return zt(this);
	}
	partial(t) {
		let n = {};
		for (let e of h.objectKeys(this.shape)) {
			let r = this.shape[e];
			t && !t[e] ? n[e] = r : n[e] = r.optional();
		}
		return new e({
			...this._def,
			shape: () => n
		});
	}
	required(t) {
		let n = {};
		for (let e of h.objectKeys(this.shape)) if (t && !t[e]) n[e] = this.shape[e];
		else {
			let t = this.shape[e];
			for (; t instanceof an;) t = t._def.innerType;
			n[e] = t;
		}
		return new e({
			...this._def,
			shape: () => n
		});
	}
	keyof() {
		return $t(h.objectKeys(this.shape));
	}
};
Bt.create = (e, t) => new Bt({
	shape: () => e,
	unknownKeys: "strip",
	catchall: It.create(),
	typeName: C.ZodObject,
	...x(t)
}), Bt.strictCreate = (e, t) => new Bt({
	shape: () => e,
	unknownKeys: "strict",
	catchall: It.create(),
	typeName: C.ZodObject,
	...x(t)
}), Bt.lazycreate = (e, t) => new Bt({
	shape: e,
	unknownKeys: "strip",
	catchall: It.create(),
	typeName: C.ZodObject,
	...x(t)
});
var Vt = class extends S {
	_parse(e) {
		let { ctx: t } = this._processInputParams(e), n = this._def.options;
		function r(e) {
			for (let t of e) if (t.result.status === "valid") return t.result;
			for (let n of e) if (n.result.status === "dirty") return t.common.issues.push(...n.ctx.common.issues), n.result;
			let n = e.map((e) => new Ve(e.ctx.common.issues));
			return v(t, {
				code: _.invalid_union,
				unionErrors: n
			}), y;
		}
		if (t.common.async) return Promise.all(n.map(async (e) => {
			let n = {
				...t,
				common: {
					...t.common,
					issues: []
				},
				parent: null
			};
			return {
				result: await e._parseAsync({
					data: t.data,
					path: t.path,
					parent: n
				}),
				ctx: n
			};
		})).then(r);
		{
			let e, r = [];
			for (let i of n) {
				let n = {
					...t,
					common: {
						...t.common,
						issues: []
					},
					parent: null
				}, a = i._parseSync({
					data: t.data,
					path: t.path,
					parent: n
				});
				if (a.status === "valid") return a;
				a.status === "dirty" && !e && (e = {
					result: a,
					ctx: n
				}), n.common.issues.length && r.push(n.common.issues);
			}
			if (e) return t.common.issues.push(...e.ctx.common.issues), e.result;
			let i = r.map((e) => new Ve(e));
			return v(t, {
				code: _.invalid_union,
				unionErrors: i
			}), y;
		}
	}
	get options() {
		return this._def.options;
	}
};
Vt.create = (e, t) => new Vt({
	options: e,
	typeName: C.ZodUnion,
	...x(t)
});
var Ht = (e) => e instanceof Zt ? Ht(e.schema) : e instanceof rn ? Ht(e.innerType()) : e instanceof Qt ? [e.value] : e instanceof en ? e.options : e instanceof tn ? h.objectValues(e.enum) : e instanceof sn ? Ht(e._def.innerType) : e instanceof Mt ? [void 0] : e instanceof Nt ? [null] : e instanceof an ? [void 0, ...Ht(e.unwrap())] : e instanceof on ? [null, ...Ht(e.unwrap())] : e instanceof un || e instanceof fn ? Ht(e.unwrap()) : e instanceof cn ? Ht(e._def.innerType) : [], Ut = class e extends S {
	_parse(e) {
		let { ctx: t } = this._processInputParams(e);
		if (t.parsedType !== g.object) return v(t, {
			code: _.invalid_type,
			expected: g.object,
			received: t.parsedType
		}), y;
		let n = this.discriminator, r = t.data[n], i = this.optionsMap.get(r);
		return i ? t.common.async ? i._parseAsync({
			data: t.data,
			path: t.path,
			parent: t
		}) : i._parseSync({
			data: t.data,
			path: t.path,
			parent: t
		}) : (v(t, {
			code: _.invalid_union_discriminator,
			options: Array.from(this.optionsMap.keys()),
			path: [n]
		}), y);
	}
	get discriminator() {
		return this._def.discriminator;
	}
	get options() {
		return this._def.options;
	}
	get optionsMap() {
		return this._def.optionsMap;
	}
	static create(t, n, r) {
		let i = /* @__PURE__ */ new Map();
		for (let e of n) {
			let n = Ht(e.shape[t]);
			if (!n.length) throw Error(`A discriminator value for key \`${t}\` could not be extracted from all schema options`);
			for (let r of n) {
				if (i.has(r)) throw Error(`Discriminator property ${String(t)} has duplicate value ${String(r)}`);
				i.set(r, e);
			}
		}
		return new e({
			typeName: C.ZodDiscriminatedUnion,
			discriminator: t,
			options: n,
			optionsMap: i,
			...x(r)
		});
	}
};
function Wt(e, t) {
	let n = Be(e), r = Be(t);
	if (e === t) return {
		valid: !0,
		data: e
	};
	if (n === g.object && r === g.object) {
		let n = h.objectKeys(t), r = h.objectKeys(e).filter((e) => n.indexOf(e) !== -1), i = {
			...e,
			...t
		};
		for (let n of r) {
			let r = Wt(e[n], t[n]);
			if (!r.valid) return { valid: !1 };
			i[n] = r.data;
		}
		return {
			valid: !0,
			data: i
		};
	} else if (n === g.array && r === g.array) {
		if (e.length !== t.length) return { valid: !1 };
		let n = [];
		for (let r = 0; r < e.length; r++) {
			let i = e[r], a = t[r], o = Wt(i, a);
			if (!o.valid) return { valid: !1 };
			n.push(o.data);
		}
		return {
			valid: !0,
			data: n
		};
	} else if (n === g.date && r === g.date && +e == +t) return {
		valid: !0,
		data: e
	};
	else return { valid: !1 };
}
var Gt = class extends S {
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e), r = (e, r) => {
			if (Ye(e) || Ye(r)) return y;
			let i = Wt(e.value, r.value);
			return i.valid ? ((Xe(e) || Xe(r)) && t.dirty(), {
				status: t.value,
				value: i.data
			}) : (v(n, { code: _.invalid_intersection_types }), y);
		};
		return n.common.async ? Promise.all([this._def.left._parseAsync({
			data: n.data,
			path: n.path,
			parent: n
		}), this._def.right._parseAsync({
			data: n.data,
			path: n.path,
			parent: n
		})]).then(([e, t]) => r(e, t)) : r(this._def.left._parseSync({
			data: n.data,
			path: n.path,
			parent: n
		}), this._def.right._parseSync({
			data: n.data,
			path: n.path,
			parent: n
		}));
	}
};
Gt.create = (e, t, n) => new Gt({
	left: e,
	right: t,
	typeName: C.ZodIntersection,
	...x(n)
});
var Kt = class e extends S {
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e);
		if (n.parsedType !== g.array) return v(n, {
			code: _.invalid_type,
			expected: g.array,
			received: n.parsedType
		}), y;
		if (n.data.length < this._def.items.length) return v(n, {
			code: _.too_small,
			minimum: this._def.items.length,
			inclusive: !0,
			exact: !1,
			type: "array"
		}), y;
		!this._def.rest && n.data.length > this._def.items.length && (v(n, {
			code: _.too_big,
			maximum: this._def.items.length,
			inclusive: !0,
			exact: !1,
			type: "array"
		}), t.dirty());
		let r = [...n.data].map((e, t) => {
			let r = this._def.items[t] || this._def.rest;
			return r ? r._parse(new $e(n, e, n.path, t)) : null;
		}).filter((e) => !!e);
		return n.common.async ? Promise.all(r).then((e) => Ke.mergeArray(t, e)) : Ke.mergeArray(t, r);
	}
	get items() {
		return this._def.items;
	}
	rest(t) {
		return new e({
			...this._def,
			rest: t
		});
	}
};
Kt.create = (e, t) => {
	if (!Array.isArray(e)) throw Error("You must pass an array of schemas to z.tuple([ ... ])");
	return new Kt({
		items: e,
		typeName: C.ZodTuple,
		rest: null,
		...x(t)
	});
};
var qt = class e extends S {
	get keySchema() {
		return this._def.keyType;
	}
	get valueSchema() {
		return this._def.valueType;
	}
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e);
		if (n.parsedType !== g.object) return v(n, {
			code: _.invalid_type,
			expected: g.object,
			received: n.parsedType
		}), y;
		let r = [], i = this._def.keyType, a = this._def.valueType;
		for (let e in n.data) r.push({
			key: i._parse(new $e(n, e, n.path, e)),
			value: a._parse(new $e(n, n.data[e], n.path, e)),
			alwaysSet: e in n.data
		});
		return n.common.async ? Ke.mergeObjectAsync(t, r) : Ke.mergeObjectSync(t, r);
	}
	get element() {
		return this._def.valueType;
	}
	static create(t, n, r) {
		return n instanceof S ? new e({
			keyType: t,
			valueType: n,
			typeName: C.ZodRecord,
			...x(r)
		}) : new e({
			keyType: Tt.create(),
			valueType: t,
			typeName: C.ZodRecord,
			...x(n)
		});
	}
}, Jt = class extends S {
	get keySchema() {
		return this._def.keyType;
	}
	get valueSchema() {
		return this._def.valueType;
	}
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e);
		if (n.parsedType !== g.map) return v(n, {
			code: _.invalid_type,
			expected: g.map,
			received: n.parsedType
		}), y;
		let r = this._def.keyType, i = this._def.valueType, a = [...n.data.entries()].map(([e, t], a) => ({
			key: r._parse(new $e(n, e, n.path, [a, "key"])),
			value: i._parse(new $e(n, t, n.path, [a, "value"]))
		}));
		if (n.common.async) {
			let e = /* @__PURE__ */ new Map();
			return Promise.resolve().then(async () => {
				for (let n of a) {
					let r = await n.key, i = await n.value;
					if (r.status === "aborted" || i.status === "aborted") return y;
					(r.status === "dirty" || i.status === "dirty") && t.dirty(), e.set(r.value, i.value);
				}
				return {
					status: t.value,
					value: e
				};
			});
		} else {
			let e = /* @__PURE__ */ new Map();
			for (let n of a) {
				let r = n.key, i = n.value;
				if (r.status === "aborted" || i.status === "aborted") return y;
				(r.status === "dirty" || i.status === "dirty") && t.dirty(), e.set(r.value, i.value);
			}
			return {
				status: t.value,
				value: e
			};
		}
	}
};
Jt.create = (e, t, n) => new Jt({
	valueType: t,
	keyType: e,
	typeName: C.ZodMap,
	...x(n)
});
var Yt = class e extends S {
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e);
		if (n.parsedType !== g.set) return v(n, {
			code: _.invalid_type,
			expected: g.set,
			received: n.parsedType
		}), y;
		let r = this._def;
		r.minSize !== null && n.data.size < r.minSize.value && (v(n, {
			code: _.too_small,
			minimum: r.minSize.value,
			type: "set",
			inclusive: !0,
			exact: !1,
			message: r.minSize.message
		}), t.dirty()), r.maxSize !== null && n.data.size > r.maxSize.value && (v(n, {
			code: _.too_big,
			maximum: r.maxSize.value,
			type: "set",
			inclusive: !0,
			exact: !1,
			message: r.maxSize.message
		}), t.dirty());
		let i = this._def.valueType;
		function a(e) {
			let n = /* @__PURE__ */ new Set();
			for (let r of e) {
				if (r.status === "aborted") return y;
				r.status === "dirty" && t.dirty(), n.add(r.value);
			}
			return {
				status: t.value,
				value: n
			};
		}
		let o = [...n.data.values()].map((e, t) => i._parse(new $e(n, e, n.path, t)));
		return n.common.async ? Promise.all(o).then((e) => a(e)) : a(o);
	}
	min(t, n) {
		return new e({
			...this._def,
			minSize: {
				value: t,
				message: b.toString(n)
			}
		});
	}
	max(t, n) {
		return new e({
			...this._def,
			maxSize: {
				value: t,
				message: b.toString(n)
			}
		});
	}
	size(e, t) {
		return this.min(e, t).max(e, t);
	}
	nonempty(e) {
		return this.min(1, e);
	}
};
Yt.create = (e, t) => new Yt({
	valueType: e,
	minSize: null,
	maxSize: null,
	typeName: C.ZodSet,
	...x(t)
});
var Xt = class e extends S {
	constructor() {
		super(...arguments), this.validate = this.implement;
	}
	_parse(e) {
		let { ctx: t } = this._processInputParams(e);
		if (t.parsedType !== g.function) return v(t, {
			code: _.invalid_type,
			expected: g.function,
			received: t.parsedType
		}), y;
		function n(e, n) {
			return Ge({
				data: e,
				path: t.path,
				errorMaps: [
					t.common.contextualErrorMap,
					t.schemaErrorMap,
					We(),
					He
				].filter((e) => !!e),
				issueData: {
					code: _.invalid_arguments,
					argumentsError: n
				}
			});
		}
		function r(e, n) {
			return Ge({
				data: e,
				path: t.path,
				errorMaps: [
					t.common.contextualErrorMap,
					t.schemaErrorMap,
					We(),
					He
				].filter((e) => !!e),
				issueData: {
					code: _.invalid_return_type,
					returnTypeError: n
				}
			});
		}
		let i = { errorMap: t.common.contextualErrorMap }, a = t.data;
		if (this._def.returns instanceof nn) {
			let e = this;
			return Je(async function(...t) {
				let o = new Ve([]), s = await e._def.args.parseAsync(t, i).catch((e) => {
					throw o.addIssue(n(t, e)), o;
				}), c = await Reflect.apply(a, this, s);
				return await e._def.returns._def.type.parseAsync(c, i).catch((e) => {
					throw o.addIssue(r(c, e)), o;
				});
			});
		} else {
			let e = this;
			return Je(function(...t) {
				let o = e._def.args.safeParse(t, i);
				if (!o.success) throw new Ve([n(t, o.error)]);
				let s = Reflect.apply(a, this, o.data), c = e._def.returns.safeParse(s, i);
				if (!c.success) throw new Ve([r(s, c.error)]);
				return c.data;
			});
		}
	}
	parameters() {
		return this._def.args;
	}
	returnType() {
		return this._def.returns;
	}
	args(...t) {
		return new e({
			...this._def,
			args: Kt.create(t).rest(Ft.create())
		});
	}
	returns(t) {
		return new e({
			...this._def,
			returns: t
		});
	}
	implement(e) {
		return this.parse(e);
	}
	strictImplement(e) {
		return this.parse(e);
	}
	static create(t, n, r) {
		return new e({
			args: t || Kt.create([]).rest(Ft.create()),
			returns: n || Ft.create(),
			typeName: C.ZodFunction,
			...x(r)
		});
	}
}, Zt = class extends S {
	get schema() {
		return this._def.getter();
	}
	_parse(e) {
		let { ctx: t } = this._processInputParams(e);
		return this._def.getter()._parse({
			data: t.data,
			path: t.path,
			parent: t
		});
	}
};
Zt.create = (e, t) => new Zt({
	getter: e,
	typeName: C.ZodLazy,
	...x(t)
});
var Qt = class extends S {
	_parse(e) {
		if (e.data !== this._def.value) {
			let t = this._getOrReturnCtx(e);
			return v(t, {
				received: t.data,
				code: _.invalid_literal,
				expected: this._def.value
			}), y;
		}
		return {
			status: "valid",
			value: e.data
		};
	}
	get value() {
		return this._def.value;
	}
};
Qt.create = (e, t) => new Qt({
	value: e,
	typeName: C.ZodLiteral,
	...x(t)
});
function $t(e, t) {
	return new en({
		values: e,
		typeName: C.ZodEnum,
		...x(t)
	});
}
var en = class e extends S {
	_parse(e) {
		if (typeof e.data != "string") {
			let t = this._getOrReturnCtx(e), n = this._def.values;
			return v(t, {
				expected: h.joinValues(n),
				received: t.parsedType,
				code: _.invalid_type
			}), y;
		}
		if (this._cache ||= new Set(this._def.values), !this._cache.has(e.data)) {
			let t = this._getOrReturnCtx(e), n = this._def.values;
			return v(t, {
				received: t.data,
				code: _.invalid_enum_value,
				options: n
			}), y;
		}
		return Je(e.data);
	}
	get options() {
		return this._def.values;
	}
	get enum() {
		let e = {};
		for (let t of this._def.values) e[t] = t;
		return e;
	}
	get Values() {
		let e = {};
		for (let t of this._def.values) e[t] = t;
		return e;
	}
	get Enum() {
		let e = {};
		for (let t of this._def.values) e[t] = t;
		return e;
	}
	extract(t, n = this._def) {
		return e.create(t, {
			...this._def,
			...n
		});
	}
	exclude(t, n = this._def) {
		return e.create(this.options.filter((e) => !t.includes(e)), {
			...this._def,
			...n
		});
	}
};
en.create = $t;
var tn = class extends S {
	_parse(e) {
		let t = h.getValidEnumValues(this._def.values), n = this._getOrReturnCtx(e);
		if (n.parsedType !== g.string && n.parsedType !== g.number) {
			let e = h.objectValues(t);
			return v(n, {
				expected: h.joinValues(e),
				received: n.parsedType,
				code: _.invalid_type
			}), y;
		}
		if (this._cache ||= new Set(h.getValidEnumValues(this._def.values)), !this._cache.has(e.data)) {
			let e = h.objectValues(t);
			return v(n, {
				received: n.data,
				code: _.invalid_enum_value,
				options: e
			}), y;
		}
		return Je(e.data);
	}
	get enum() {
		return this._def.values;
	}
};
tn.create = (e, t) => new tn({
	values: e,
	typeName: C.ZodNativeEnum,
	...x(t)
});
var nn = class extends S {
	unwrap() {
		return this._def.type;
	}
	_parse(e) {
		let { ctx: t } = this._processInputParams(e);
		return t.parsedType !== g.promise && t.common.async === !1 ? (v(t, {
			code: _.invalid_type,
			expected: g.promise,
			received: t.parsedType
		}), y) : Je((t.parsedType === g.promise ? t.data : Promise.resolve(t.data)).then((e) => this._def.type.parseAsync(e, {
			path: t.path,
			errorMap: t.common.contextualErrorMap
		})));
	}
};
nn.create = (e, t) => new nn({
	type: e,
	typeName: C.ZodPromise,
	...x(t)
});
var rn = class extends S {
	innerType() {
		return this._def.schema;
	}
	sourceType() {
		return this._def.schema._def.typeName === C.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
	}
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e), r = this._def.effect || null, i = {
			addIssue: (e) => {
				v(n, e), e.fatal ? t.abort() : t.dirty();
			},
			get path() {
				return n.path;
			}
		};
		if (i.addIssue = i.addIssue.bind(i), r.type === "preprocess") {
			let e = r.transform(n.data, i);
			if (n.common.async) return Promise.resolve(e).then(async (e) => {
				if (t.value === "aborted") return y;
				let r = await this._def.schema._parseAsync({
					data: e,
					path: n.path,
					parent: n
				});
				return r.status === "aborted" ? y : r.status === "dirty" || t.value === "dirty" ? qe(r.value) : r;
			});
			{
				if (t.value === "aborted") return y;
				let r = this._def.schema._parseSync({
					data: e,
					path: n.path,
					parent: n
				});
				return r.status === "aborted" ? y : r.status === "dirty" || t.value === "dirty" ? qe(r.value) : r;
			}
		}
		if (r.type === "refinement") {
			let e = (e) => {
				let t = r.refinement(e, i);
				if (n.common.async) return Promise.resolve(t);
				if (t instanceof Promise) throw Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
				return e;
			};
			if (n.common.async === !1) {
				let r = this._def.schema._parseSync({
					data: n.data,
					path: n.path,
					parent: n
				});
				return r.status === "aborted" ? y : (r.status === "dirty" && t.dirty(), e(r.value), {
					status: t.value,
					value: r.value
				});
			} else return this._def.schema._parseAsync({
				data: n.data,
				path: n.path,
				parent: n
			}).then((n) => n.status === "aborted" ? y : (n.status === "dirty" && t.dirty(), e(n.value).then(() => ({
				status: t.value,
				value: n.value
			}))));
		}
		if (r.type === "transform") if (n.common.async === !1) {
			let e = this._def.schema._parseSync({
				data: n.data,
				path: n.path,
				parent: n
			});
			if (!Ze(e)) return y;
			let a = r.transform(e.value, i);
			if (a instanceof Promise) throw Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
			return {
				status: t.value,
				value: a
			};
		} else return this._def.schema._parseAsync({
			data: n.data,
			path: n.path,
			parent: n
		}).then((e) => Ze(e) ? Promise.resolve(r.transform(e.value, i)).then((e) => ({
			status: t.value,
			value: e
		})) : y);
		h.assertNever(r);
	}
};
rn.create = (e, t, n) => new rn({
	schema: e,
	typeName: C.ZodEffects,
	effect: t,
	...x(n)
}), rn.createWithPreprocess = (e, t, n) => new rn({
	schema: t,
	effect: {
		type: "preprocess",
		transform: e
	},
	typeName: C.ZodEffects,
	...x(n)
});
var an = class extends S {
	_parse(e) {
		return this._getType(e) === g.undefined ? Je(void 0) : this._def.innerType._parse(e);
	}
	unwrap() {
		return this._def.innerType;
	}
};
an.create = (e, t) => new an({
	innerType: e,
	typeName: C.ZodOptional,
	...x(t)
});
var on = class extends S {
	_parse(e) {
		return this._getType(e) === g.null ? Je(null) : this._def.innerType._parse(e);
	}
	unwrap() {
		return this._def.innerType;
	}
};
on.create = (e, t) => new on({
	innerType: e,
	typeName: C.ZodNullable,
	...x(t)
});
var sn = class extends S {
	_parse(e) {
		let { ctx: t } = this._processInputParams(e), n = t.data;
		return t.parsedType === g.undefined && (n = this._def.defaultValue()), this._def.innerType._parse({
			data: n,
			path: t.path,
			parent: t
		});
	}
	removeDefault() {
		return this._def.innerType;
	}
};
sn.create = (e, t) => new sn({
	innerType: e,
	typeName: C.ZodDefault,
	defaultValue: typeof t.default == "function" ? t.default : () => t.default,
	...x(t)
});
var cn = class extends S {
	_parse(e) {
		let { ctx: t } = this._processInputParams(e), n = {
			...t,
			common: {
				...t.common,
				issues: []
			}
		}, r = this._def.innerType._parse({
			data: n.data,
			path: n.path,
			parent: { ...n }
		});
		return Qe(r) ? r.then((e) => ({
			status: "valid",
			value: e.status === "valid" ? e.value : this._def.catchValue({
				get error() {
					return new Ve(n.common.issues);
				},
				input: n.data
			})
		})) : {
			status: "valid",
			value: r.status === "valid" ? r.value : this._def.catchValue({
				get error() {
					return new Ve(n.common.issues);
				},
				input: n.data
			})
		};
	}
	removeCatch() {
		return this._def.innerType;
	}
};
cn.create = (e, t) => new cn({
	innerType: e,
	typeName: C.ZodCatch,
	catchValue: typeof t.catch == "function" ? t.catch : () => t.catch,
	...x(t)
});
var ln = class extends S {
	_parse(e) {
		if (this._getType(e) !== g.nan) {
			let t = this._getOrReturnCtx(e);
			return v(t, {
				code: _.invalid_type,
				expected: g.nan,
				received: t.parsedType
			}), y;
		}
		return {
			status: "valid",
			value: e.data
		};
	}
};
ln.create = (e) => new ln({
	typeName: C.ZodNaN,
	...x(e)
});
var un = class extends S {
	_parse(e) {
		let { ctx: t } = this._processInputParams(e), n = t.data;
		return this._def.type._parse({
			data: n,
			path: t.path,
			parent: t
		});
	}
	unwrap() {
		return this._def.type;
	}
}, dn = class e extends S {
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e);
		if (n.common.async) return (async () => {
			let e = await this._def.in._parseAsync({
				data: n.data,
				path: n.path,
				parent: n
			});
			return e.status === "aborted" ? y : e.status === "dirty" ? (t.dirty(), qe(e.value)) : this._def.out._parseAsync({
				data: e.value,
				path: n.path,
				parent: n
			});
		})();
		{
			let e = this._def.in._parseSync({
				data: n.data,
				path: n.path,
				parent: n
			});
			return e.status === "aborted" ? y : e.status === "dirty" ? (t.dirty(), {
				status: "dirty",
				value: e.value
			}) : this._def.out._parseSync({
				data: e.value,
				path: n.path,
				parent: n
			});
		}
	}
	static create(t, n) {
		return new e({
			in: t,
			out: n,
			typeName: C.ZodPipeline
		});
	}
}, fn = class extends S {
	_parse(e) {
		let t = this._def.innerType._parse(e), n = (e) => (Ze(e) && (e.value = Object.freeze(e.value)), e);
		return Qe(t) ? t.then((e) => n(e)) : n(t);
	}
	unwrap() {
		return this._def.innerType;
	}
};
fn.create = (e, t) => new fn({
	innerType: e,
	typeName: C.ZodReadonly,
	...x(t)
}), Bt.lazycreate;
var C;
(function(e) {
	e.ZodString = "ZodString", e.ZodNumber = "ZodNumber", e.ZodNaN = "ZodNaN", e.ZodBigInt = "ZodBigInt", e.ZodBoolean = "ZodBoolean", e.ZodDate = "ZodDate", e.ZodSymbol = "ZodSymbol", e.ZodUndefined = "ZodUndefined", e.ZodNull = "ZodNull", e.ZodAny = "ZodAny", e.ZodUnknown = "ZodUnknown", e.ZodNever = "ZodNever", e.ZodVoid = "ZodVoid", e.ZodArray = "ZodArray", e.ZodObject = "ZodObject", e.ZodUnion = "ZodUnion", e.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", e.ZodIntersection = "ZodIntersection", e.ZodTuple = "ZodTuple", e.ZodRecord = "ZodRecord", e.ZodMap = "ZodMap", e.ZodSet = "ZodSet", e.ZodFunction = "ZodFunction", e.ZodLazy = "ZodLazy", e.ZodLiteral = "ZodLiteral", e.ZodEnum = "ZodEnum", e.ZodEffects = "ZodEffects", e.ZodNativeEnum = "ZodNativeEnum", e.ZodOptional = "ZodOptional", e.ZodNullable = "ZodNullable", e.ZodDefault = "ZodDefault", e.ZodCatch = "ZodCatch", e.ZodPromise = "ZodPromise", e.ZodBranded = "ZodBranded", e.ZodPipeline = "ZodPipeline", e.ZodReadonly = "ZodReadonly";
})(C ||= {});
var w = Tt.create, pn = Dt.create;
ln.create, Ot.create;
var T = kt.create;
At.create, jt.create, Mt.create, Nt.create;
var mn = Pt.create, hn = Ft.create;
It.create, Lt.create;
var gn = Rt.create, E = Bt.create;
Bt.strictCreate;
var _n = Vt.create, vn = Ut.create;
Gt.create, Kt.create;
var yn = qt.create;
Jt.create, Yt.create, Xt.create, Zt.create;
var D = Qt.create, bn = en.create, xn = tn.create;
nn.create, rn.create, an.create, on.create;
var Sn = rn.createWithPreprocess;
dn.create;
var Cn = {
	string: ((e) => Tt.create({
		...e,
		coerce: !0
	})),
	number: ((e) => Dt.create({
		...e,
		coerce: !0
	})),
	boolean: ((e) => kt.create({
		...e,
		coerce: !0
	})),
	bigint: ((e) => Ot.create({
		...e,
		coerce: !0
	})),
	date: ((e) => At.create({
		...e,
		coerce: !0
	}))
}, wn = E({
	name: w(),
	arguments: w()
}), Tn = E({
	id: w(),
	type: D("function"),
	function: wn,
	encryptedValue: w().optional()
}), En = E({
	id: w(),
	role: w(),
	content: w().optional(),
	name: w().optional(),
	encryptedValue: w().optional()
}), Dn = E({
	type: D("text"),
	text: w()
}), On = vn("type", [E({
	type: D("data"),
	value: w(),
	mimeType: w()
}), E({
	type: D("url"),
	value: w(),
	mimeType: w().optional()
})]), kn = E({
	type: D("image"),
	source: On,
	metadata: hn().optional()
}), An = E({
	type: D("audio"),
	source: On,
	metadata: hn().optional()
}), jn = E({
	type: D("video"),
	source: On,
	metadata: hn().optional()
}), Mn = E({
	type: D("document"),
	source: On,
	metadata: hn().optional()
}), Nn = E({
	type: D("binary"),
	mimeType: w(),
	id: w().optional(),
	url: w().optional(),
	data: w().optional(),
	filename: w().optional()
}), Pn = (e, t) => {
	!e.id && !e.url && !e.data && t.addIssue({
		code: _.custom,
		message: "BinaryInputContent requires at least one of id, url, or data.",
		path: ["id"]
	});
};
Nn.superRefine((e, t) => {
	Pn(e, t);
});
var Fn = vn("type", [
	Dn,
	kn,
	An,
	jn,
	Mn,
	Nn
]).superRefine((e, t) => {
	e.type === "binary" && Pn(e, t);
}), In = vn("role", [
	En.extend({
		role: D("developer"),
		content: w()
	}),
	En.extend({
		role: D("system"),
		content: w()
	}),
	En.extend({
		role: D("assistant"),
		content: w().optional(),
		toolCalls: gn(Tn).optional()
	}),
	En.extend({
		role: D("user"),
		content: _n([w(), gn(Fn)])
	}),
	E({
		id: w(),
		content: w(),
		role: D("tool"),
		toolCallId: w(),
		error: w().optional(),
		encryptedValue: w().optional()
	}),
	E({
		id: w(),
		role: D("activity"),
		activityType: w(),
		content: yn(mn())
	}),
	E({
		id: w(),
		role: D("reasoning"),
		content: w(),
		encryptedValue: w().optional()
	})
]);
_n([
	D("developer"),
	D("system"),
	D("assistant"),
	D("user"),
	D("tool"),
	D("activity"),
	D("reasoning")
]);
var Ln = E({
	description: w(),
	value: w()
}), Rn = E({
	name: w(),
	description: w(),
	parameters: mn(),
	metadata: yn(mn()).optional()
}), zn = E({
	threadId: w(),
	runId: w(),
	parentRunId: w().optional(),
	state: mn(),
	messages: gn(In),
	tools: gn(Rn),
	context: gn(Ln),
	forwardedProps: mn()
}), Bn = mn(), Vn = class extends Error {
	constructor(e) {
		super(e);
	}
}, Hn = class extends Vn {
	constructor() {
		super("Connect not implemented. This method is not supported by the current agent.");
	}
}, Un = E({
	name: w(),
	description: w().optional()
}), Wn = E({
	name: w().optional(),
	type: w().optional(),
	description: w().optional(),
	version: w().optional(),
	provider: w().optional(),
	documentationUrl: w().optional(),
	metadata: yn(hn()).optional()
}), Gn = E({
	streaming: T().optional(),
	websocket: T().optional(),
	httpBinary: T().optional(),
	pushNotifications: T().optional(),
	resumable: T().optional()
}), Kn = E({
	supported: T().optional(),
	items: gn(Rn).optional(),
	parallelCalls: T().optional(),
	clientProvided: T().optional()
}), qn = E({
	structuredOutput: T().optional(),
	supportedMimeTypes: gn(w()).optional()
}), Jn = E({
	snapshots: T().optional(),
	deltas: T().optional(),
	memory: T().optional(),
	persistentState: T().optional()
}), Yn = E({
	supported: T().optional(),
	delegation: T().optional(),
	handoffs: T().optional(),
	subAgents: gn(Un).optional()
}), Xn = E({
	supported: T().optional(),
	streaming: T().optional(),
	encrypted: T().optional()
}), Zn = E({
	image: T().optional(),
	audio: T().optional(),
	video: T().optional(),
	pdf: T().optional(),
	file: T().optional()
}), Qn = E({
	image: T().optional(),
	audio: T().optional()
}), $n = E({
	input: Zn.optional(),
	output: Qn.optional()
}), er = E({
	codeExecution: T().optional(),
	sandboxed: T().optional(),
	maxIterations: pn().optional(),
	maxExecutionTime: pn().optional()
}), tr = E({
	supported: T().optional(),
	approvals: T().optional(),
	interventions: T().optional(),
	feedback: T().optional()
});
E({
	identity: Wn.optional(),
	transport: Gn.optional(),
	tools: Kn.optional(),
	output: qn.optional(),
	state: Jn.optional(),
	multiAgent: Yn.optional(),
	reasoning: Xn.optional(),
	multimodal: $n.optional(),
	execution: er.optional(),
	humanInTheLoop: tr.optional(),
	custom: yn(hn()).optional()
});
var nr = _n([
	D("developer"),
	D("system"),
	D("assistant"),
	D("user")
]), O = /* @__PURE__ */ function(e) {
	return e.TEXT_MESSAGE_START = "TEXT_MESSAGE_START", e.TEXT_MESSAGE_CONTENT = "TEXT_MESSAGE_CONTENT", e.TEXT_MESSAGE_END = "TEXT_MESSAGE_END", e.TEXT_MESSAGE_CHUNK = "TEXT_MESSAGE_CHUNK", e.TOOL_CALL_START = "TOOL_CALL_START", e.TOOL_CALL_ARGS = "TOOL_CALL_ARGS", e.TOOL_CALL_END = "TOOL_CALL_END", e.TOOL_CALL_CHUNK = "TOOL_CALL_CHUNK", e.TOOL_CALL_RESULT = "TOOL_CALL_RESULT", e.THINKING_START = "THINKING_START", e.THINKING_END = "THINKING_END", e.THINKING_TEXT_MESSAGE_START = "THINKING_TEXT_MESSAGE_START", e.THINKING_TEXT_MESSAGE_CONTENT = "THINKING_TEXT_MESSAGE_CONTENT", e.THINKING_TEXT_MESSAGE_END = "THINKING_TEXT_MESSAGE_END", e.STATE_SNAPSHOT = "STATE_SNAPSHOT", e.STATE_DELTA = "STATE_DELTA", e.MESSAGES_SNAPSHOT = "MESSAGES_SNAPSHOT", e.ACTIVITY_SNAPSHOT = "ACTIVITY_SNAPSHOT", e.ACTIVITY_DELTA = "ACTIVITY_DELTA", e.RAW = "RAW", e.CUSTOM = "CUSTOM", e.RUN_STARTED = "RUN_STARTED", e.RUN_FINISHED = "RUN_FINISHED", e.RUN_ERROR = "RUN_ERROR", e.STEP_STARTED = "STEP_STARTED", e.STEP_FINISHED = "STEP_FINISHED", e.REASONING_START = "REASONING_START", e.REASONING_MESSAGE_START = "REASONING_MESSAGE_START", e.REASONING_MESSAGE_CONTENT = "REASONING_MESSAGE_CONTENT", e.REASONING_MESSAGE_END = "REASONING_MESSAGE_END", e.REASONING_MESSAGE_CHUNK = "REASONING_MESSAGE_CHUNK", e.REASONING_END = "REASONING_END", e.REASONING_ENCRYPTED_VALUE = "REASONING_ENCRYPTED_VALUE", e;
}({}), k = E({
	type: xn(O),
	timestamp: pn().optional(),
	rawEvent: mn().optional()
}).passthrough(), rr = k.extend({
	type: D(O.TEXT_MESSAGE_START),
	messageId: w(),
	role: nr.default("assistant"),
	name: w().optional()
}), ir = k.extend({
	type: D(O.TEXT_MESSAGE_CONTENT),
	messageId: w(),
	delta: w()
}), ar = k.extend({
	type: D(O.TEXT_MESSAGE_END),
	messageId: w()
}), or = k.extend({
	type: D(O.TEXT_MESSAGE_CHUNK),
	messageId: w().optional(),
	role: nr.optional(),
	delta: w().optional(),
	name: w().optional()
}), sr = k.extend({ type: D(O.THINKING_TEXT_MESSAGE_START) }), cr = ir.omit({
	messageId: !0,
	type: !0
}).extend({ type: D(O.THINKING_TEXT_MESSAGE_CONTENT) }), lr = k.extend({ type: D(O.THINKING_TEXT_MESSAGE_END) }), ur = k.extend({
	type: D(O.TOOL_CALL_START),
	toolCallId: w(),
	toolCallName: w(),
	parentMessageId: w().optional()
}), dr = k.extend({
	type: D(O.TOOL_CALL_ARGS),
	toolCallId: w(),
	delta: w()
}), fr = k.extend({
	type: D(O.TOOL_CALL_END),
	toolCallId: w()
}), pr = k.extend({
	messageId: w(),
	type: D(O.TOOL_CALL_RESULT),
	toolCallId: w(),
	content: w(),
	role: D("tool").optional()
}), mr = k.extend({
	type: D(O.TOOL_CALL_CHUNK),
	toolCallId: w().optional(),
	toolCallName: w().optional(),
	parentMessageId: w().optional(),
	delta: w().optional()
}), hr = k.extend({
	type: D(O.THINKING_START),
	title: w().optional()
}), gr = k.extend({ type: D(O.THINKING_END) }), _r = k.extend({
	type: D(O.STATE_SNAPSHOT),
	snapshot: Bn
}), vr = k.extend({
	type: D(O.STATE_DELTA),
	delta: gn(mn())
}), yr = k.extend({
	type: D(O.MESSAGES_SNAPSHOT),
	messages: gn(In)
}), br = k.extend({
	type: D(O.ACTIVITY_SNAPSHOT),
	messageId: w(),
	activityType: w(),
	content: yn(mn()),
	replace: T().optional().default(!0)
}), xr = k.extend({
	type: D(O.ACTIVITY_DELTA),
	messageId: w(),
	activityType: w(),
	patch: gn(mn())
}), Sr = k.extend({
	type: D(O.RAW),
	event: mn(),
	source: w().optional()
}), Cr = k.extend({
	type: D(O.CUSTOM),
	name: w(),
	value: mn()
}), wr = k.extend({
	type: D(O.RUN_STARTED),
	threadId: w(),
	runId: w(),
	parentRunId: w().optional(),
	input: zn.optional()
}), Tr = k.extend({
	type: D(O.RUN_FINISHED),
	threadId: w(),
	runId: w(),
	result: mn().optional()
}), Er = k.extend({
	type: D(O.RUN_ERROR),
	message: w(),
	code: w().optional()
}), Dr = k.extend({
	type: D(O.STEP_STARTED),
	stepName: w()
}), Or = k.extend({
	type: D(O.STEP_FINISHED),
	stepName: w()
}), kr = _n([D("tool-call"), D("message")]), Ar = vn("type", [
	rr,
	ir,
	ar,
	or,
	hr,
	gr,
	sr,
	cr,
	lr,
	ur,
	dr,
	fr,
	mr,
	pr,
	_r,
	vr,
	yr,
	br,
	xr,
	Sr,
	Cr,
	wr,
	Tr,
	Er,
	Dr,
	Or,
	k.extend({
		type: D(O.REASONING_START),
		messageId: w()
	}),
	k.extend({
		type: D(O.REASONING_MESSAGE_START),
		messageId: w(),
		role: D("reasoning")
	}),
	k.extend({
		type: D(O.REASONING_MESSAGE_CONTENT),
		messageId: w(),
		delta: w()
	}),
	k.extend({
		type: D(O.REASONING_MESSAGE_END),
		messageId: w()
	}),
	k.extend({
		type: D(O.REASONING_MESSAGE_CHUNK),
		messageId: w().optional(),
		delta: w().optional()
	}),
	k.extend({
		type: D(O.REASONING_END),
		messageId: w()
	}),
	k.extend({
		type: D(O.REASONING_ENCRYPTED_VALUE),
		subtype: kr,
		entityId: w(),
		encryptedValue: w()
	})
]), jr = (function() {
	var e = function(t, n) {
		return e = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e, t) {
			e.__proto__ = t;
		} || function(e, t) {
			for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
		}, e(t, n);
	};
	return function(t, n) {
		e(t, n);
		function r() {
			this.constructor = t;
		}
		t.prototype = n === null ? Object.create(n) : (r.prototype = n.prototype, new r());
	};
})(), Mr = Object.prototype.hasOwnProperty;
function Nr(e, t) {
	return Mr.call(e, t);
}
function Pr(e) {
	if (Array.isArray(e)) {
		for (var t = Array(e.length), n = 0; n < t.length; n++) t[n] = "" + n;
		return t;
	}
	if (Object.keys) return Object.keys(e);
	var r = [];
	for (var i in e) Nr(e, i) && r.push(i);
	return r;
}
function Fr(e) {
	switch (typeof e) {
		case "object": return JSON.parse(JSON.stringify(e));
		case "undefined": return null;
		default: return e;
	}
}
function Ir(e) {
	for (var t = 0, n = e.length, r; t < n;) {
		if (r = e.charCodeAt(t), r >= 48 && r <= 57) {
			t++;
			continue;
		}
		return !1;
	}
	return !0;
}
function Lr(e) {
	return e.indexOf("/") === -1 && e.indexOf("~") === -1 ? e : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
function Rr(e) {
	return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
function zr(e) {
	if (e === void 0) return !0;
	if (e) {
		if (Array.isArray(e)) {
			for (var t = 0, n = e.length; t < n; t++) if (zr(e[t])) return !0;
		} else if (typeof e == "object") {
			for (var r = Pr(e), i = r.length, a = 0; a < i; a++) if (zr(e[r[a]])) return !0;
		}
	}
	return !1;
}
function Br(e, t) {
	var n = [e];
	for (var r in t) {
		var i = typeof t[r] == "object" ? JSON.stringify(t[r], null, 2) : t[r];
		i !== void 0 && n.push(r + ": " + i);
	}
	return n.join("\n");
}
var Vr = function(e) {
	jr(t, e);
	function t(t, n, r, i, a) {
		var o = this.constructor, s = e.call(this, Br(t, {
			name: n,
			index: r,
			operation: i,
			tree: a
		})) || this;
		return s.name = n, s.index = r, s.operation = i, s.tree = a, Object.setPrototypeOf(s, o.prototype), s.message = Br(t, {
			name: n,
			index: r,
			operation: i,
			tree: a
		}), s;
	}
	return t;
}(Error), Hr = /* @__PURE__ */ e({
	JsonPatchError: () => A,
	_areEquals: () => Qr,
	applyOperation: () => qr,
	applyPatch: () => Jr,
	applyReducer: () => Yr,
	deepClone: () => Ur,
	getValueByPointer: () => Kr,
	validate: () => Zr,
	validator: () => Xr
}), A = Vr, Ur = Fr, Wr = {
	add: function(e, t, n) {
		return e[t] = this.value, { newDocument: n };
	},
	remove: function(e, t, n) {
		var r = e[t];
		return delete e[t], {
			newDocument: n,
			removed: r
		};
	},
	replace: function(e, t, n) {
		var r = e[t];
		return e[t] = this.value, {
			newDocument: n,
			removed: r
		};
	},
	move: function(e, t, n) {
		var r = Kr(n, this.path);
		r &&= Fr(r);
		var i = qr(n, {
			op: "remove",
			path: this.from
		}).removed;
		return qr(n, {
			op: "add",
			path: this.path,
			value: i
		}), {
			newDocument: n,
			removed: r
		};
	},
	copy: function(e, t, n) {
		var r = Kr(n, this.from);
		return qr(n, {
			op: "add",
			path: this.path,
			value: Fr(r)
		}), { newDocument: n };
	},
	test: function(e, t, n) {
		return {
			newDocument: n,
			test: Qr(e[t], this.value)
		};
	},
	_get: function(e, t, n) {
		return this.value = e[t], { newDocument: n };
	}
}, Gr = {
	add: function(e, t, n) {
		return Ir(t) ? e.splice(t, 0, this.value) : e[t] = this.value, {
			newDocument: n,
			index: t
		};
	},
	remove: function(e, t, n) {
		return {
			newDocument: n,
			removed: e.splice(t, 1)[0]
		};
	},
	replace: function(e, t, n) {
		var r = e[t];
		return e[t] = this.value, {
			newDocument: n,
			removed: r
		};
	},
	move: Wr.move,
	copy: Wr.copy,
	test: Wr.test,
	_get: Wr._get
};
function Kr(e, t) {
	if (t == "") return e;
	var n = {
		op: "_get",
		path: t
	};
	return qr(e, n), n.value;
}
function qr(e, t, n, r, i, a) {
	if (n === void 0 && (n = !1), r === void 0 && (r = !0), i === void 0 && (i = !0), a === void 0 && (a = 0), n && (typeof n == "function" ? n(t, 0, e, t.path) : Xr(t, 0)), t.path === "") {
		var o = { newDocument: e };
		if (t.op === "add") return o.newDocument = t.value, o;
		if (t.op === "replace") return o.newDocument = t.value, o.removed = e, o;
		if (t.op === "move" || t.op === "copy") return o.newDocument = Kr(e, t.from), t.op === "move" && (o.removed = e), o;
		if (t.op === "test") {
			if (o.test = Qr(e, t.value), o.test === !1) throw new A("Test operation failed", "TEST_OPERATION_FAILED", a, t, e);
			return o.newDocument = e, o;
		} else if (t.op === "remove") return o.removed = e, o.newDocument = null, o;
		else if (t.op === "_get") return t.value = e, o;
		else if (n) throw new A("Operation `op` property is not one of operations defined in RFC-6902", "OPERATION_OP_INVALID", a, t, e);
		else return o;
	} else {
		r || (e = Fr(e));
		var s = (t.path || "").split("/"), c = e, l = 1, u = s.length, d = void 0, f = void 0, ee = void 0;
		for (ee = typeof n == "function" ? n : Xr;;) {
			if (f = s[l], f && f.indexOf("~") != -1 && (f = Rr(f)), i && (f == "__proto__" || f == "prototype" && l > 0 && s[l - 1] == "constructor")) throw TypeError("JSON-Patch: modifying `__proto__` or `constructor/prototype` prop is banned for security reasons, if this was on purpose, please set `banPrototypeModifications` flag false and pass it to this function. More info in fast-json-patch README");
			if (n && d === void 0 && (c[f] === void 0 ? d = s.slice(0, l).join("/") : l == u - 1 && (d = t.path), d !== void 0 && ee(t, 0, e, d)), l++, Array.isArray(c)) {
				if (f === "-") f = c.length;
				else if (n && !Ir(f)) throw new A("Expected an unsigned base-10 integer value, making the new referenced value the array element with the zero-based index", "OPERATION_PATH_ILLEGAL_ARRAY_INDEX", a, t, e);
				else Ir(f) && (f = ~~f);
				if (l >= u) {
					if (n && t.op === "add" && f > c.length) throw new A("The specified index MUST NOT be greater than the number of elements in the array", "OPERATION_VALUE_OUT_OF_BOUNDS", a, t, e);
					var o = Gr[t.op].call(t, c, f, e);
					if (o.test === !1) throw new A("Test operation failed", "TEST_OPERATION_FAILED", a, t, e);
					return o;
				}
			} else if (l >= u) {
				var o = Wr[t.op].call(t, c, f, e);
				if (o.test === !1) throw new A("Test operation failed", "TEST_OPERATION_FAILED", a, t, e);
				return o;
			}
			if (c = c[f], n && l < u && (!c || typeof c != "object")) throw new A("Cannot perform operation at the desired path", "OPERATION_PATH_UNRESOLVABLE", a, t, e);
		}
	}
}
function Jr(e, t, n, r, i) {
	if (r === void 0 && (r = !0), i === void 0 && (i = !0), n && !Array.isArray(t)) throw new A("Patch sequence must be an array", "SEQUENCE_NOT_AN_ARRAY");
	r || (e = Fr(e));
	for (var a = Array(t.length), o = 0, s = t.length; o < s; o++) a[o] = qr(e, t[o], n, !0, i, o), e = a[o].newDocument;
	return a.newDocument = e, a;
}
function Yr(e, t, n) {
	var r = qr(e, t);
	if (r.test === !1) throw new A("Test operation failed", "TEST_OPERATION_FAILED", n, t, e);
	return r.newDocument;
}
function Xr(e, t, n, r) {
	if (typeof e != "object" || !e || Array.isArray(e)) throw new A("Operation is not an object", "OPERATION_NOT_AN_OBJECT", t, e, n);
	if (!Wr[e.op]) throw new A("Operation `op` property is not one of operations defined in RFC-6902", "OPERATION_OP_INVALID", t, e, n);
	if (typeof e.path != "string") throw new A("Operation `path` property is not a string", "OPERATION_PATH_INVALID", t, e, n);
	if (e.path.indexOf("/") !== 0 && e.path.length > 0) throw new A("Operation `path` property must start with \"/\"", "OPERATION_PATH_INVALID", t, e, n);
	if ((e.op === "move" || e.op === "copy") && typeof e.from != "string") throw new A("Operation `from` property is not present (applicable in `move` and `copy` operations)", "OPERATION_FROM_REQUIRED", t, e, n);
	if ((e.op === "add" || e.op === "replace" || e.op === "test") && e.value === void 0) throw new A("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)", "OPERATION_VALUE_REQUIRED", t, e, n);
	if ((e.op === "add" || e.op === "replace" || e.op === "test") && zr(e.value)) throw new A("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)", "OPERATION_VALUE_CANNOT_CONTAIN_UNDEFINED", t, e, n);
	if (n) {
		if (e.op == "add") {
			var i = e.path.split("/").length, a = r.split("/").length;
			if (i !== a + 1 && i !== a) throw new A("Cannot perform an `add` operation at the desired path", "OPERATION_PATH_CANNOT_ADD", t, e, n);
		} else if (e.op === "replace" || e.op === "remove" || e.op === "_get") {
			if (e.path !== r) throw new A("Cannot perform the operation at a path that does not exist", "OPERATION_PATH_UNRESOLVABLE", t, e, n);
		} else if (e.op === "move" || e.op === "copy") {
			var o = Zr([{
				op: "_get",
				path: e.from,
				value: void 0
			}], n);
			if (o && o.name === "OPERATION_PATH_UNRESOLVABLE") throw new A("Cannot perform the operation from a path that does not exist", "OPERATION_FROM_UNRESOLVABLE", t, e, n);
		}
	}
}
function Zr(e, t, n) {
	try {
		if (!Array.isArray(e)) throw new A("Patch sequence must be an array", "SEQUENCE_NOT_AN_ARRAY");
		if (t) Jr(Fr(t), Fr(e), n || !0);
		else {
			n ||= Xr;
			for (var r = 0; r < e.length; r++) n(e[r], r, t, void 0);
		}
	} catch (e) {
		if (e instanceof A) return e;
		throw e;
	}
}
function Qr(e, t) {
	if (e === t) return !0;
	if (e && t && typeof e == "object" && typeof t == "object") {
		var n = Array.isArray(e), r = Array.isArray(t), i, a, o;
		if (n && r) {
			if (a = e.length, a != t.length) return !1;
			for (i = a; i-- !== 0;) if (!Qr(e[i], t[i])) return !1;
			return !0;
		}
		if (n != r) return !1;
		var s = Object.keys(e);
		if (a = s.length, a !== Object.keys(t).length) return !1;
		for (i = a; i-- !== 0;) if (!t.hasOwnProperty(s[i])) return !1;
		for (i = a; i-- !== 0;) if (o = s[i], !Qr(e[o], t[o])) return !1;
		return !0;
	}
	return e !== e && t !== t;
}
//#endregion
//#region node_modules/.pnpm/fast-json-patch@3.1.1/node_modules/fast-json-patch/module/duplex.mjs
var $r = /* @__PURE__ */ e({
	compare: () => ui,
	generate: () => ci,
	observe: () => si,
	unobserve: () => oi
}), ei = /* @__PURE__ */ new WeakMap(), ti = function() {
	function e(e) {
		this.observers = /* @__PURE__ */ new Map(), this.obj = e;
	}
	return e;
}(), ni = function() {
	function e(e, t) {
		this.callback = e, this.observer = t;
	}
	return e;
}();
function ri(e) {
	return ei.get(e);
}
function ii(e, t) {
	return e.observers.get(t);
}
function ai(e, t) {
	e.observers.delete(t.callback);
}
function oi(e, t) {
	t.unobserve();
}
function si(e, t) {
	var n = [], r, i = ri(e);
	if (!i) i = new ti(e), ei.set(e, i);
	else {
		var a = ii(i, t);
		r = a && a.observer;
	}
	if (r) return r;
	if (r = {}, i.value = Fr(e), t) {
		r.callback = t, r.next = null;
		var o = function() {
			ci(r);
		}, s = function() {
			clearTimeout(r.next), r.next = setTimeout(o);
		};
		typeof window < "u" && (window.addEventListener("mouseup", s), window.addEventListener("keyup", s), window.addEventListener("mousedown", s), window.addEventListener("keydown", s), window.addEventListener("change", s));
	}
	return r.patches = n, r.object = e, r.unobserve = function() {
		ci(r), clearTimeout(r.next), ai(i, r), typeof window < "u" && (window.removeEventListener("mouseup", s), window.removeEventListener("keyup", s), window.removeEventListener("mousedown", s), window.removeEventListener("keydown", s), window.removeEventListener("change", s));
	}, i.observers.set(t, new ni(t, r)), r;
}
function ci(e, t) {
	t === void 0 && (t = !1);
	var n = ei.get(e.object);
	li(n.value, e.object, e.patches, "", t), e.patches.length && Jr(n.value, e.patches);
	var r = e.patches;
	return r.length > 0 && (e.patches = [], e.callback && e.callback(r)), r;
}
function li(e, t, n, r, i) {
	if (t !== e) {
		typeof t.toJSON == "function" && (t = t.toJSON());
		for (var a = Pr(t), o = Pr(e), s = !1, c = o.length - 1; c >= 0; c--) {
			var l = o[c], u = e[l];
			if (Nr(t, l) && !(t[l] === void 0 && u !== void 0 && Array.isArray(t) === !1)) {
				var d = t[l];
				typeof u == "object" && u && typeof d == "object" && d && Array.isArray(u) === Array.isArray(d) ? li(u, d, n, r + "/" + Lr(l), i) : u !== d && (i && n.push({
					op: "test",
					path: r + "/" + Lr(l),
					value: Fr(u)
				}), n.push({
					op: "replace",
					path: r + "/" + Lr(l),
					value: Fr(d)
				}));
			} else Array.isArray(e) === Array.isArray(t) ? (i && n.push({
				op: "test",
				path: r + "/" + Lr(l),
				value: Fr(u)
			}), n.push({
				op: "remove",
				path: r + "/" + Lr(l)
			}), s = !0) : (i && n.push({
				op: "test",
				path: r,
				value: e
			}), n.push({
				op: "replace",
				path: r,
				value: t
			}));
		}
		if (!(!s && a.length == o.length)) for (var c = 0; c < a.length; c++) {
			var l = a[c];
			!Nr(e, l) && t[l] !== void 0 && n.push({
				op: "add",
				path: r + "/" + Lr(l),
				value: Fr(t[l])
			});
		}
	}
}
function ui(e, t, n) {
	n === void 0 && (n = !1);
	var r = [];
	return li(e, t, r, "", n), r;
}
//#endregion
//#region node_modules/.pnpm/fast-json-patch@3.1.1/node_modules/fast-json-patch/index.mjs
var di = Object.assign({}, Hr, $r, {
	JsonPatchError: Vr,
	deepClone: Fr,
	escapePathComponent: Lr,
	unescapePathComponent: Rr
}), fi = function(e, t) {
	return fi = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e, t) {
		e.__proto__ = t;
	} || function(e, t) {
		for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
	}, fi(e, t);
};
function pi(e, t) {
	if (typeof t != "function" && t !== null) throw TypeError("Class extends value " + String(t) + " is not a constructor or null");
	fi(e, t);
	function n() {
		this.constructor = e;
	}
	e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
}
var mi = function() {
	return mi = Object.assign || function(e) {
		for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n], t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
		return e;
	}, mi.apply(this, arguments);
};
function hi(e, t) {
	var n = {};
	for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
	if (e != null && typeof Object.getOwnPropertySymbols == "function") for (var i = 0, r = Object.getOwnPropertySymbols(e); i < r.length; i++) t.indexOf(r[i]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[i]) && (n[r[i]] = e[r[i]]);
	return n;
}
function gi(e, t, n, r) {
	function i(e) {
		return e instanceof n ? e : new n(function(t) {
			t(e);
		});
	}
	return new (n ||= Promise)(function(n, a) {
		function o(e) {
			try {
				c(r.next(e));
			} catch (e) {
				a(e);
			}
		}
		function s(e) {
			try {
				c(r.throw(e));
			} catch (e) {
				a(e);
			}
		}
		function c(e) {
			e.done ? n(e.value) : i(e.value).then(o, s);
		}
		c((r = r.apply(e, t || [])).next());
	});
}
function _i(e, t) {
	var n = {
		label: 0,
		sent: function() {
			if (a[0] & 1) throw a[1];
			return a[1];
		},
		trys: [],
		ops: []
	}, r, i, a, o = Object.create((typeof Iterator == "function" ? Iterator : Object).prototype);
	return o.next = s(0), o.throw = s(1), o.return = s(2), typeof Symbol == "function" && (o[Symbol.iterator] = function() {
		return this;
	}), o;
	function s(e) {
		return function(t) {
			return c([e, t]);
		};
	}
	function c(s) {
		if (r) throw TypeError("Generator is already executing.");
		for (; o && (o = 0, s[0] && (n = 0)), n;) try {
			if (r = 1, i && (a = s[0] & 2 ? i.return : s[0] ? i.throw || ((a = i.return) && a.call(i), 0) : i.next) && !(a = a.call(i, s[1])).done) return a;
			switch (i = 0, a && (s = [s[0] & 2, a.value]), s[0]) {
				case 0:
				case 1:
					a = s;
					break;
				case 4: return n.label++, {
					value: s[1],
					done: !1
				};
				case 5:
					n.label++, i = s[1], s = [0];
					continue;
				case 7:
					s = n.ops.pop(), n.trys.pop();
					continue;
				default:
					if ((a = n.trys, !(a = a.length > 0 && a[a.length - 1])) && (s[0] === 6 || s[0] === 2)) {
						n = 0;
						continue;
					}
					if (s[0] === 3 && (!a || s[1] > a[0] && s[1] < a[3])) {
						n.label = s[1];
						break;
					}
					if (s[0] === 6 && n.label < a[1]) {
						n.label = a[1], a = s;
						break;
					}
					if (a && n.label < a[2]) {
						n.label = a[2], n.ops.push(s);
						break;
					}
					a[2] && n.ops.pop(), n.trys.pop();
					continue;
			}
			s = t.call(e, n);
		} catch (e) {
			s = [6, e], i = 0;
		} finally {
			r = a = 0;
		}
		if (s[0] & 5) throw s[1];
		return {
			value: s[0] ? s[1] : void 0,
			done: !0
		};
	}
}
function vi(e) {
	var t = typeof Symbol == "function" && Symbol.iterator, n = t && e[t], r = 0;
	if (n) return n.call(e);
	if (e && typeof e.length == "number") return { next: function() {
		return e && r >= e.length && (e = void 0), {
			value: e && e[r++],
			done: !e
		};
	} };
	throw TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function yi(e, t) {
	var n = typeof Symbol == "function" && e[Symbol.iterator];
	if (!n) return e;
	var r = n.call(e), i, a = [], o;
	try {
		for (; (t === void 0 || t-- > 0) && !(i = r.next()).done;) a.push(i.value);
	} catch (e) {
		o = { error: e };
	} finally {
		try {
			i && !i.done && (n = r.return) && n.call(r);
		} finally {
			if (o) throw o.error;
		}
	}
	return a;
}
function bi(e, t, n) {
	if (n || arguments.length === 2) for (var r = 0, i = t.length, a; r < i; r++) (a || !(r in t)) && (a ||= Array.prototype.slice.call(t, 0, r), a[r] = t[r]);
	return e.concat(a || Array.prototype.slice.call(t));
}
function xi(e) {
	return this instanceof xi ? (this.v = e, this) : new xi(e);
}
function Si(e, t, n) {
	if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
	var r = n.apply(e, t || []), i, a = [];
	return i = Object.create((typeof AsyncIterator == "function" ? AsyncIterator : Object).prototype), s("next"), s("throw"), s("return", o), i[Symbol.asyncIterator] = function() {
		return this;
	}, i;
	function o(e) {
		return function(t) {
			return Promise.resolve(t).then(e, d);
		};
	}
	function s(e, t) {
		r[e] && (i[e] = function(t) {
			return new Promise(function(n, r) {
				a.push([
					e,
					t,
					n,
					r
				]) > 1 || c(e, t);
			});
		}, t && (i[e] = t(i[e])));
	}
	function c(e, t) {
		try {
			l(r[e](t));
		} catch (e) {
			f(a[0][3], e);
		}
	}
	function l(e) {
		e.value instanceof xi ? Promise.resolve(e.value.v).then(u, d) : f(a[0][2], e);
	}
	function u(e) {
		c("next", e);
	}
	function d(e) {
		c("throw", e);
	}
	function f(e, t) {
		e(t), a.shift(), a.length && c(a[0][0], a[0][1]);
	}
}
function Ci(e) {
	if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
	var t = e[Symbol.asyncIterator], n;
	return t ? t.call(e) : (e = typeof vi == "function" ? vi(e) : e[Symbol.iterator](), n = {}, r("next"), r("throw"), r("return"), n[Symbol.asyncIterator] = function() {
		return this;
	}, n);
	function r(t) {
		n[t] = e[t] && function(n) {
			return new Promise(function(r, a) {
				n = e[t](n), i(r, a, n.done, n.value);
			});
		};
	}
	function i(e, t, n, r) {
		Promise.resolve(r).then(function(t) {
			e({
				value: t,
				done: n
			});
		}, t);
	}
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/util/isFunction.js
function j(e) {
	return typeof e == "function";
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/util/createErrorClass.js
function wi(e) {
	var t = e(function(e) {
		Error.call(e), e.stack = (/* @__PURE__ */ Error()).stack;
	});
	return t.prototype = Object.create(Error.prototype), t.prototype.constructor = t, t;
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/util/UnsubscriptionError.js
var Ti = wi(function(e) {
	return function(t) {
		e(this), this.message = t ? t.length + " errors occurred during unsubscription:\n" + t.map(function(e, t) {
			return t + 1 + ") " + e.toString();
		}).join("\n  ") : "", this.name = "UnsubscriptionError", this.errors = t;
	};
});
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/util/arrRemove.js
function Ei(e, t) {
	if (e) {
		var n = e.indexOf(t);
		0 <= n && e.splice(n, 1);
	}
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/Subscription.js
var Di = function() {
	function e(e) {
		this.initialTeardown = e, this.closed = !1, this._parentage = null, this._finalizers = null;
	}
	return e.prototype.unsubscribe = function() {
		var e, t, n, r, i;
		if (!this.closed) {
			this.closed = !0;
			var a = this._parentage;
			if (a) if (this._parentage = null, Array.isArray(a)) try {
				for (var o = vi(a), s = o.next(); !s.done; s = o.next()) s.value.remove(this);
			} catch (t) {
				e = { error: t };
			} finally {
				try {
					s && !s.done && (t = o.return) && t.call(o);
				} finally {
					if (e) throw e.error;
				}
			}
			else a.remove(this);
			var c = this.initialTeardown;
			if (j(c)) try {
				c();
			} catch (e) {
				i = e instanceof Ti ? e.errors : [e];
			}
			var l = this._finalizers;
			if (l) {
				this._finalizers = null;
				try {
					for (var u = vi(l), d = u.next(); !d.done; d = u.next()) {
						var f = d.value;
						try {
							Ai(f);
						} catch (e) {
							i ??= [], e instanceof Ti ? i = bi(bi([], yi(i)), yi(e.errors)) : i.push(e);
						}
					}
				} catch (e) {
					n = { error: e };
				} finally {
					try {
						d && !d.done && (r = u.return) && r.call(u);
					} finally {
						if (n) throw n.error;
					}
				}
			}
			if (i) throw new Ti(i);
		}
	}, e.prototype.add = function(t) {
		if (t && t !== this) if (this.closed) Ai(t);
		else {
			if (t instanceof e) {
				if (t.closed || t._hasParent(this)) return;
				t._addParent(this);
			}
			(this._finalizers = this._finalizers ?? []).push(t);
		}
	}, e.prototype._hasParent = function(e) {
		var t = this._parentage;
		return t === e || Array.isArray(t) && t.includes(e);
	}, e.prototype._addParent = function(e) {
		var t = this._parentage;
		this._parentage = Array.isArray(t) ? (t.push(e), t) : t ? [t, e] : e;
	}, e.prototype._removeParent = function(e) {
		var t = this._parentage;
		t === e ? this._parentage = null : Array.isArray(t) && Ei(t, e);
	}, e.prototype.remove = function(t) {
		var n = this._finalizers;
		n && Ei(n, t), t instanceof e && t._removeParent(this);
	}, e.EMPTY = (function() {
		var t = new e();
		return t.closed = !0, t;
	})(), e;
}(), Oi = Di.EMPTY;
function ki(e) {
	return e instanceof Di || e && "closed" in e && j(e.remove) && j(e.add) && j(e.unsubscribe);
}
function Ai(e) {
	j(e) ? e() : e.unsubscribe();
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/config.js
var ji = {
	onUnhandledError: null,
	onStoppedNotification: null,
	Promise: void 0,
	useDeprecatedSynchronousErrorHandling: !1,
	useDeprecatedNextContext: !1
}, Mi = {
	setTimeout: function(e, t) {
		var n = [...arguments].slice(2), r = Mi.delegate;
		return r?.setTimeout ? r.setTimeout.apply(r, bi([e, t], yi(n))) : setTimeout.apply(void 0, bi([e, t], yi(n)));
	},
	clearTimeout: function(e) {
		return (Mi.delegate?.clearTimeout || clearTimeout)(e);
	},
	delegate: void 0
};
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/util/reportUnhandledError.js
function Ni(e) {
	Mi.setTimeout(function() {
		var t = ji.onUnhandledError;
		if (t) t(e);
		else throw e;
	});
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/util/noop.js
function Pi() {}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/NotificationFactories.js
var Fi = (function() {
	return Ri("C", void 0, void 0);
})();
function Ii(e) {
	return Ri("E", void 0, e);
}
function Li(e) {
	return Ri("N", e, void 0);
}
function Ri(e, t, n) {
	return {
		kind: e,
		value: t,
		error: n
	};
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/util/errorContext.js
var zi = null;
function Bi(e) {
	if (ji.useDeprecatedSynchronousErrorHandling) {
		var t = !zi;
		if (t && (zi = {
			errorThrown: !1,
			error: null
		}), e(), t) {
			var n = zi, r = n.errorThrown, i = n.error;
			if (zi = null, r) throw i;
		}
	} else e();
}
function Vi(e) {
	ji.useDeprecatedSynchronousErrorHandling && zi && (zi.errorThrown = !0, zi.error = e);
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/Subscriber.js
var Hi = function(e) {
	pi(t, e);
	function t(t) {
		var n = e.call(this) || this;
		return n.isStopped = !1, t ? (n.destination = t, ki(t) && t.add(n)) : n.destination = Xi, n;
	}
	return t.create = function(e, t, n) {
		return new Ki(e, t, n);
	}, t.prototype.next = function(e) {
		this.isStopped ? Yi(Li(e), this) : this._next(e);
	}, t.prototype.error = function(e) {
		this.isStopped ? Yi(Ii(e), this) : (this.isStopped = !0, this._error(e));
	}, t.prototype.complete = function() {
		this.isStopped ? Yi(Fi, this) : (this.isStopped = !0, this._complete());
	}, t.prototype.unsubscribe = function() {
		this.closed || (this.isStopped = !0, e.prototype.unsubscribe.call(this), this.destination = null);
	}, t.prototype._next = function(e) {
		this.destination.next(e);
	}, t.prototype._error = function(e) {
		try {
			this.destination.error(e);
		} finally {
			this.unsubscribe();
		}
	}, t.prototype._complete = function() {
		try {
			this.destination.complete();
		} finally {
			this.unsubscribe();
		}
	}, t;
}(Di), Ui = Function.prototype.bind;
function Wi(e, t) {
	return Ui.call(e, t);
}
var Gi = function() {
	function e(e) {
		this.partialObserver = e;
	}
	return e.prototype.next = function(e) {
		var t = this.partialObserver;
		if (t.next) try {
			t.next(e);
		} catch (e) {
			qi(e);
		}
	}, e.prototype.error = function(e) {
		var t = this.partialObserver;
		if (t.error) try {
			t.error(e);
		} catch (e) {
			qi(e);
		}
		else qi(e);
	}, e.prototype.complete = function() {
		var e = this.partialObserver;
		if (e.complete) try {
			e.complete();
		} catch (e) {
			qi(e);
		}
	}, e;
}(), Ki = function(e) {
	pi(t, e);
	function t(t, n, r) {
		var i = e.call(this) || this, a;
		if (j(t) || !t) a = {
			next: t ?? void 0,
			error: n ?? void 0,
			complete: r ?? void 0
		};
		else {
			var o;
			i && ji.useDeprecatedNextContext ? (o = Object.create(t), o.unsubscribe = function() {
				return i.unsubscribe();
			}, a = {
				next: t.next && Wi(t.next, o),
				error: t.error && Wi(t.error, o),
				complete: t.complete && Wi(t.complete, o)
			}) : a = t;
		}
		return i.destination = new Gi(a), i;
	}
	return t;
}(Hi);
function qi(e) {
	ji.useDeprecatedSynchronousErrorHandling ? Vi(e) : Ni(e);
}
function Ji(e) {
	throw e;
}
function Yi(e, t) {
	var n = ji.onStoppedNotification;
	n && Mi.setTimeout(function() {
		return n(e, t);
	});
}
var Xi = {
	closed: !0,
	next: Pi,
	error: Ji,
	complete: Pi
}, Zi = (function() {
	return typeof Symbol == "function" && Symbol.observable || "@@observable";
})();
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/util/identity.js
function Qi(e) {
	return e;
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/util/pipe.js
function $i() {
	return ea([...arguments]);
}
function ea(e) {
	return e.length === 0 ? Qi : e.length === 1 ? e[0] : function(t) {
		return e.reduce(function(e, t) {
			return t(e);
		}, t);
	};
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/Observable.js
var ta = function() {
	function e(e) {
		e && (this._subscribe = e);
	}
	return e.prototype.lift = function(t) {
		var n = new e();
		return n.source = this, n.operator = t, n;
	}, e.prototype.subscribe = function(e, t, n) {
		var r = this, i = ia(e) ? e : new Ki(e, t, n);
		return Bi(function() {
			var e = r, t = e.operator, n = e.source;
			i.add(t ? t.call(i, n) : n ? r._subscribe(i) : r._trySubscribe(i));
		}), i;
	}, e.prototype._trySubscribe = function(e) {
		try {
			return this._subscribe(e);
		} catch (t) {
			e.error(t);
		}
	}, e.prototype.forEach = function(e, t) {
		var n = this;
		return t = na(t), new t(function(t, r) {
			var i = new Ki({
				next: function(t) {
					try {
						e(t);
					} catch (e) {
						r(e), i.unsubscribe();
					}
				},
				error: r,
				complete: t
			});
			n.subscribe(i);
		});
	}, e.prototype._subscribe = function(e) {
		return this.source?.subscribe(e);
	}, e.prototype[Zi] = function() {
		return this;
	}, e.prototype.pipe = function() {
		return ea([...arguments])(this);
	}, e.prototype.toPromise = function(e) {
		var t = this;
		return e = na(e), new e(function(e, n) {
			var r;
			t.subscribe(function(e) {
				return r = e;
			}, function(e) {
				return n(e);
			}, function() {
				return e(r);
			});
		});
	}, e.create = function(t) {
		return new e(t);
	}, e;
}();
function na(e) {
	return e ?? ji.Promise ?? Promise;
}
function ra(e) {
	return e && j(e.next) && j(e.error) && j(e.complete);
}
function ia(e) {
	return e && e instanceof Hi || ra(e) && ki(e);
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/util/lift.js
function aa(e) {
	return j(e?.lift);
}
function oa(e) {
	return function(t) {
		if (aa(t)) return t.lift(function(t) {
			try {
				return e(t, this);
			} catch (e) {
				this.error(e);
			}
		});
		throw TypeError("Unable to lift unknown Observable type");
	};
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/operators/OperatorSubscriber.js
function sa(e, t, n, r, i) {
	return new ca(e, t, n, r, i);
}
var ca = function(e) {
	pi(t, e);
	function t(t, n, r, i, a, o) {
		var s = e.call(this, t) || this;
		return s.onFinalize = a, s.shouldUnsubscribe = o, s._next = n ? function(e) {
			try {
				n(e);
			} catch (e) {
				t.error(e);
			}
		} : e.prototype._next, s._error = i ? function(e) {
			try {
				i(e);
			} catch (e) {
				t.error(e);
			} finally {
				this.unsubscribe();
			}
		} : e.prototype._error, s._complete = r ? function() {
			try {
				r();
			} catch (e) {
				t.error(e);
			} finally {
				this.unsubscribe();
			}
		} : e.prototype._complete, s;
	}
	return t.prototype.unsubscribe = function() {
		var t;
		if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
			var n = this.closed;
			e.prototype.unsubscribe.call(this), !n && ((t = this.onFinalize) == null || t.call(this));
		}
	}, t;
}(Hi), la = wi(function(e) {
	return function() {
		e(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed";
	};
}), ua = function(e) {
	pi(t, e);
	function t() {
		var t = e.call(this) || this;
		return t.closed = !1, t.currentObservers = null, t.observers = [], t.isStopped = !1, t.hasError = !1, t.thrownError = null, t;
	}
	return t.prototype.lift = function(e) {
		var t = new da(this, this);
		return t.operator = e, t;
	}, t.prototype._throwIfClosed = function() {
		if (this.closed) throw new la();
	}, t.prototype.next = function(e) {
		var t = this;
		Bi(function() {
			var n, r;
			if (t._throwIfClosed(), !t.isStopped) {
				t.currentObservers ||= Array.from(t.observers);
				try {
					for (var i = vi(t.currentObservers), a = i.next(); !a.done; a = i.next()) a.value.next(e);
				} catch (e) {
					n = { error: e };
				} finally {
					try {
						a && !a.done && (r = i.return) && r.call(i);
					} finally {
						if (n) throw n.error;
					}
				}
			}
		});
	}, t.prototype.error = function(e) {
		var t = this;
		Bi(function() {
			if (t._throwIfClosed(), !t.isStopped) {
				t.hasError = t.isStopped = !0, t.thrownError = e;
				for (var n = t.observers; n.length;) n.shift().error(e);
			}
		});
	}, t.prototype.complete = function() {
		var e = this;
		Bi(function() {
			if (e._throwIfClosed(), !e.isStopped) {
				e.isStopped = !0;
				for (var t = e.observers; t.length;) t.shift().complete();
			}
		});
	}, t.prototype.unsubscribe = function() {
		this.isStopped = this.closed = !0, this.observers = this.currentObservers = null;
	}, Object.defineProperty(t.prototype, "observed", {
		get: function() {
			return this.observers?.length > 0;
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype._trySubscribe = function(t) {
		return this._throwIfClosed(), e.prototype._trySubscribe.call(this, t);
	}, t.prototype._subscribe = function(e) {
		return this._throwIfClosed(), this._checkFinalizedStatuses(e), this._innerSubscribe(e);
	}, t.prototype._innerSubscribe = function(e) {
		var t = this, n = this, r = n.hasError, i = n.isStopped, a = n.observers;
		return r || i ? Oi : (this.currentObservers = null, a.push(e), new Di(function() {
			t.currentObservers = null, Ei(a, e);
		}));
	}, t.prototype._checkFinalizedStatuses = function(e) {
		var t = this, n = t.hasError, r = t.thrownError, i = t.isStopped;
		n ? e.error(r) : i && e.complete();
	}, t.prototype.asObservable = function() {
		var e = new ta();
		return e.source = this, e;
	}, t.create = function(e, t) {
		return new da(e, t);
	}, t;
}(ta), da = function(e) {
	pi(t, e);
	function t(t, n) {
		var r = e.call(this) || this;
		return r.destination = t, r.source = n, r;
	}
	return t.prototype.next = function(e) {
		var t, n;
		(n = (t = this.destination)?.next) == null || n.call(t, e);
	}, t.prototype.error = function(e) {
		var t, n;
		(n = (t = this.destination)?.error) == null || n.call(t, e);
	}, t.prototype.complete = function() {
		var e, t;
		(t = (e = this.destination)?.complete) == null || t.call(e);
	}, t.prototype._subscribe = function(e) {
		return this.source?.subscribe(e) ?? Oi;
	}, t;
}(ua), fa = function(e) {
	pi(t, e);
	function t(t) {
		var n = e.call(this) || this;
		return n._value = t, n;
	}
	return Object.defineProperty(t.prototype, "value", {
		get: function() {
			return this.getValue();
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype._subscribe = function(t) {
		var n = e.prototype._subscribe.call(this, t);
		return !n.closed && t.next(this._value), n;
	}, t.prototype.getValue = function() {
		var e = this, t = e.hasError, n = e.thrownError, r = e._value;
		if (t) throw n;
		return this._throwIfClosed(), r;
	}, t.prototype.next = function(t) {
		e.prototype.next.call(this, this._value = t);
	}, t;
}(ua), pa = {
	now: function() {
		return (pa.delegate || Date).now();
	},
	delegate: void 0
}, ma = function(e) {
	pi(t, e);
	function t(t, n, r) {
		t === void 0 && (t = Infinity), n === void 0 && (n = Infinity), r === void 0 && (r = pa);
		var i = e.call(this) || this;
		return i._bufferSize = t, i._windowTime = n, i._timestampProvider = r, i._buffer = [], i._infiniteTimeWindow = !0, i._infiniteTimeWindow = n === Infinity, i._bufferSize = Math.max(1, t), i._windowTime = Math.max(1, n), i;
	}
	return t.prototype.next = function(t) {
		var n = this, r = n.isStopped, i = n._buffer, a = n._infiniteTimeWindow, o = n._timestampProvider, s = n._windowTime;
		r || (i.push(t), !a && i.push(o.now() + s)), this._trimBuffer(), e.prototype.next.call(this, t);
	}, t.prototype._subscribe = function(e) {
		this._throwIfClosed(), this._trimBuffer();
		for (var t = this._innerSubscribe(e), n = this, r = n._infiniteTimeWindow, i = n._buffer.slice(), a = 0; a < i.length && !e.closed; a += r ? 1 : 2) e.next(i[a]);
		return this._checkFinalizedStatuses(e), t;
	}, t.prototype._trimBuffer = function() {
		var e = this, t = e._bufferSize, n = e._timestampProvider, r = e._buffer, i = e._infiniteTimeWindow, a = (i ? 1 : 2) * t;
		if (t < Infinity && a < r.length && r.splice(0, r.length - a), !i) {
			for (var o = n.now(), s = 0, c = 1; c < r.length && r[c] <= o; c += 2) s = c;
			s && r.splice(0, s + 1);
		}
	}, t;
}(ua), ha = function(e) {
	pi(t, e);
	function t(t, n) {
		return e.call(this) || this;
	}
	return t.prototype.schedule = function(e, t) {
		return t === void 0 && (t = 0), this;
	}, t;
}(Di), ga = {
	setInterval: function(e, t) {
		var n = [...arguments].slice(2), r = ga.delegate;
		return r?.setInterval ? r.setInterval.apply(r, bi([e, t], yi(n))) : setInterval.apply(void 0, bi([e, t], yi(n)));
	},
	clearInterval: function(e) {
		return (ga.delegate?.clearInterval || clearInterval)(e);
	},
	delegate: void 0
}, _a = function(e) {
	pi(t, e);
	function t(t, n) {
		var r = e.call(this, t, n) || this;
		return r.scheduler = t, r.work = n, r.pending = !1, r;
	}
	return t.prototype.schedule = function(e, t) {
		if (t === void 0 && (t = 0), this.closed) return this;
		this.state = e;
		var n = this.id, r = this.scheduler;
		return n != null && (this.id = this.recycleAsyncId(r, n, t)), this.pending = !0, this.delay = t, this.id = this.id ?? this.requestAsyncId(r, this.id, t), this;
	}, t.prototype.requestAsyncId = function(e, t, n) {
		return n === void 0 && (n = 0), ga.setInterval(e.flush.bind(e, this), n);
	}, t.prototype.recycleAsyncId = function(e, t, n) {
		if (n === void 0 && (n = 0), n != null && this.delay === n && this.pending === !1) return t;
		t != null && ga.clearInterval(t);
	}, t.prototype.execute = function(e, t) {
		if (this.closed) return /* @__PURE__ */ Error("executing a cancelled action");
		this.pending = !1;
		var n = this._execute(e, t);
		if (n) return n;
		this.pending === !1 && this.id != null && (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
	}, t.prototype._execute = function(e, t) {
		var n = !1, r;
		try {
			this.work(e);
		} catch (e) {
			n = !0, r = e || /* @__PURE__ */ Error("Scheduled action threw falsy error");
		}
		if (n) return this.unsubscribe(), r;
	}, t.prototype.unsubscribe = function() {
		if (!this.closed) {
			var t = this, n = t.id, r = t.scheduler, i = r.actions;
			this.work = this.state = this.scheduler = null, this.pending = !1, Ei(i, this), n != null && (this.id = this.recycleAsyncId(r, n, null)), this.delay = null, e.prototype.unsubscribe.call(this);
		}
	}, t;
}(ha), va = 1, ya, ba = {};
function xa(e) {
	return e in ba ? (delete ba[e], !0) : !1;
}
var Sa = {
	setImmediate: function(e) {
		var t = va++;
		return ba[t] = !0, ya ||= Promise.resolve(), ya.then(function() {
			return xa(t) && e();
		}), t;
	},
	clearImmediate: function(e) {
		xa(e);
	}
}, Ca = Sa.setImmediate, wa = Sa.clearImmediate, Ta = {
	setImmediate: function() {
		var e = [...arguments];
		return (Ta.delegate?.setImmediate || Ca).apply(void 0, bi([], yi(e)));
	},
	clearImmediate: function(e) {
		return (Ta.delegate?.clearImmediate || wa)(e);
	},
	delegate: void 0
}, Ea = function(e) {
	pi(t, e);
	function t(t, n) {
		var r = e.call(this, t, n) || this;
		return r.scheduler = t, r.work = n, r;
	}
	return t.prototype.requestAsyncId = function(t, n, r) {
		return r === void 0 && (r = 0), r !== null && r > 0 ? e.prototype.requestAsyncId.call(this, t, n, r) : (t.actions.push(this), t._scheduled ||= Ta.setImmediate(t.flush.bind(t, void 0)));
	}, t.prototype.recycleAsyncId = function(t, n, r) {
		if (r === void 0 && (r = 0), r == null ? this.delay > 0 : r > 0) return e.prototype.recycleAsyncId.call(this, t, n, r);
		var i = t.actions;
		n != null && i[i.length - 1]?.id !== n && (Ta.clearImmediate(n), t._scheduled === n && (t._scheduled = void 0));
	}, t;
}(_a), Da = function() {
	function e(t, n) {
		n === void 0 && (n = e.now), this.schedulerActionCtor = t, this.now = n;
	}
	return e.prototype.schedule = function(e, t, n) {
		return t === void 0 && (t = 0), new this.schedulerActionCtor(this, e).schedule(n, t);
	}, e.now = pa.now, e;
}(), Oa = function(e) {
	pi(t, e);
	function t(t, n) {
		n === void 0 && (n = Da.now);
		var r = e.call(this, t, n) || this;
		return r.actions = [], r._active = !1, r;
	}
	return t.prototype.flush = function(e) {
		var t = this.actions;
		if (this._active) {
			t.push(e);
			return;
		}
		var n;
		this._active = !0;
		do
			if (n = e.execute(e.state, e.delay)) break;
		while (e = t.shift());
		if (this._active = !1, n) {
			for (; e = t.shift();) e.unsubscribe();
			throw n;
		}
	}, t;
}(Da), ka = new (function(e) {
	pi(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return t.prototype.flush = function(e) {
		this._active = !0;
		var t = this._scheduled;
		this._scheduled = void 0;
		var n = this.actions, r;
		e ||= n.shift();
		do
			if (r = e.execute(e.state, e.delay)) break;
		while ((e = n[0]) && e.id === t && n.shift());
		if (this._active = !1, r) {
			for (; (e = n[0]) && e.id === t && n.shift();) e.unsubscribe();
			throw r;
		}
	}, t;
}(Oa))(Ea), Aa = new Oa(_a), ja = new ta(function(e) {
	return e.complete();
});
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/util/isScheduler.js
function Ma(e) {
	return e && j(e.schedule);
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/util/args.js
function Na(e) {
	return e[e.length - 1];
}
function Pa(e) {
	return j(Na(e)) ? e.pop() : void 0;
}
function Fa(e) {
	return Ma(Na(e)) ? e.pop() : void 0;
}
function Ia(e, t) {
	return typeof Na(e) == "number" ? e.pop() : t;
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/util/isArrayLike.js
var La = (function(e) {
	return e && typeof e.length == "number" && typeof e != "function";
});
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/util/isPromise.js
function Ra(e) {
	return j(e?.then);
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/util/isInteropObservable.js
function za(e) {
	return j(e[Zi]);
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/util/isAsyncIterable.js
function Ba(e) {
	return Symbol.asyncIterator && j(e?.[Symbol.asyncIterator]);
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/util/throwUnobservableError.js
function Va(e) {
	return /* @__PURE__ */ TypeError("You provided " + (typeof e == "object" && e ? "an invalid object" : "'" + e + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/symbol/iterator.js
function Ha() {
	return typeof Symbol != "function" || !Symbol.iterator ? "@@iterator" : Symbol.iterator;
}
var Ua = Ha();
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/util/isIterable.js
function Wa(e) {
	return j(e?.[Ua]);
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/util/isReadableStreamLike.js
function Ga(e) {
	return Si(this, arguments, function() {
		var t, n, r, i;
		return _i(this, function(a) {
			switch (a.label) {
				case 0: t = e.getReader(), a.label = 1;
				case 1: a.trys.push([
					1,
					,
					9,
					10
				]), a.label = 2;
				case 2: return [4, xi(t.read())];
				case 3: return n = a.sent(), r = n.value, i = n.done, i ? [4, xi(void 0)] : [3, 5];
				case 4: return [2, a.sent()];
				case 5: return [4, xi(r)];
				case 6: return [4, a.sent()];
				case 7: return a.sent(), [3, 2];
				case 8: return [3, 10];
				case 9: return t.releaseLock(), [7];
				case 10: return [2];
			}
		});
	});
}
function Ka(e) {
	return j(e?.getReader);
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/observable/innerFrom.js
function qa(e) {
	if (e instanceof ta) return e;
	if (e != null) {
		if (za(e)) return Ja(e);
		if (La(e)) return Ya(e);
		if (Ra(e)) return Xa(e);
		if (Ba(e)) return Qa(e);
		if (Wa(e)) return Za(e);
		if (Ka(e)) return $a(e);
	}
	throw Va(e);
}
function Ja(e) {
	return new ta(function(t) {
		var n = e[Zi]();
		if (j(n.subscribe)) return n.subscribe(t);
		throw TypeError("Provided object does not correctly implement Symbol.observable");
	});
}
function Ya(e) {
	return new ta(function(t) {
		for (var n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
		t.complete();
	});
}
function Xa(e) {
	return new ta(function(t) {
		e.then(function(e) {
			t.closed || (t.next(e), t.complete());
		}, function(e) {
			return t.error(e);
		}).then(null, Ni);
	});
}
function Za(e) {
	return new ta(function(t) {
		var n, r;
		try {
			for (var i = vi(e), a = i.next(); !a.done; a = i.next()) {
				var o = a.value;
				if (t.next(o), t.closed) return;
			}
		} catch (e) {
			n = { error: e };
		} finally {
			try {
				a && !a.done && (r = i.return) && r.call(i);
			} finally {
				if (n) throw n.error;
			}
		}
		t.complete();
	});
}
function Qa(e) {
	return new ta(function(t) {
		eo(e, t).catch(function(e) {
			return t.error(e);
		});
	});
}
function $a(e) {
	return Qa(Ga(e));
}
function eo(e, t) {
	var n, r, i, a;
	return gi(this, void 0, void 0, function() {
		var o, s;
		return _i(this, function(c) {
			switch (c.label) {
				case 0: c.trys.push([
					0,
					5,
					6,
					11
				]), n = Ci(e), c.label = 1;
				case 1: return [4, n.next()];
				case 2:
					if (r = c.sent(), r.done) return [3, 4];
					if (o = r.value, t.next(o), t.closed) return [2];
					c.label = 3;
				case 3: return [3, 1];
				case 4: return [3, 11];
				case 5: return s = c.sent(), i = { error: s }, [3, 11];
				case 6: return c.trys.push([
					6,
					,
					9,
					10
				]), r && !r.done && (a = n.return) ? [4, a.call(n)] : [3, 8];
				case 7: c.sent(), c.label = 8;
				case 8: return [3, 10];
				case 9:
					if (i) throw i.error;
					return [7];
				case 10: return [7];
				case 11: return t.complete(), [2];
			}
		});
	});
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/util/executeSchedule.js
function to(e, t, n, r, i) {
	r === void 0 && (r = 0), i === void 0 && (i = !1);
	var a = t.schedule(function() {
		n(), i ? e.add(this.schedule(null, r)) : this.unsubscribe();
	}, r);
	if (e.add(a), !i) return a;
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/operators/observeOn.js
function no(e, t) {
	return t === void 0 && (t = 0), oa(function(n, r) {
		n.subscribe(sa(r, function(n) {
			return to(r, e, function() {
				return r.next(n);
			}, t);
		}, function() {
			return to(r, e, function() {
				return r.complete();
			}, t);
		}, function(n) {
			return to(r, e, function() {
				return r.error(n);
			}, t);
		}));
	});
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/operators/subscribeOn.js
function ro(e, t) {
	return t === void 0 && (t = 0), oa(function(n, r) {
		r.add(e.schedule(function() {
			return n.subscribe(r);
		}, t));
	});
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/scheduled/scheduleObservable.js
function io(e, t) {
	return qa(e).pipe(ro(t), no(t));
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/scheduled/schedulePromise.js
function ao(e, t) {
	return qa(e).pipe(ro(t), no(t));
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/scheduled/scheduleArray.js
function oo(e, t) {
	return new ta(function(n) {
		var r = 0;
		return t.schedule(function() {
			r === e.length ? n.complete() : (n.next(e[r++]), n.closed || this.schedule());
		});
	});
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/scheduled/scheduleIterable.js
function so(e, t) {
	return new ta(function(n) {
		var r;
		return to(n, t, function() {
			r = e[Ua](), to(n, t, function() {
				var e, t, i;
				try {
					e = r.next(), t = e.value, i = e.done;
				} catch (e) {
					n.error(e);
					return;
				}
				i ? n.complete() : n.next(t);
			}, 0, !0);
		}), function() {
			return j(r?.return) && r.return();
		};
	});
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/scheduled/scheduleAsyncIterable.js
function co(e, t) {
	if (!e) throw Error("Iterable cannot be null");
	return new ta(function(n) {
		to(n, t, function() {
			var r = e[Symbol.asyncIterator]();
			to(n, t, function() {
				r.next().then(function(e) {
					e.done ? n.complete() : n.next(e.value);
				});
			}, 0, !0);
		});
	});
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/scheduled/scheduleReadableStreamLike.js
function lo(e, t) {
	return co(Ga(e), t);
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/scheduled/scheduled.js
function uo(e, t) {
	if (e != null) {
		if (za(e)) return io(e, t);
		if (La(e)) return oo(e, t);
		if (Ra(e)) return ao(e, t);
		if (Ba(e)) return co(e, t);
		if (Wa(e)) return so(e, t);
		if (Ka(e)) return lo(e, t);
	}
	throw Va(e);
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/observable/from.js
function fo(e, t) {
	return t ? uo(e, t) : qa(e);
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/observable/of.js
function M() {
	var e = [...arguments];
	return fo(e, Fa(e));
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/observable/throwError.js
function N(e, t) {
	var n = j(e) ? e : function() {
		return e;
	}, r = function(e) {
		return e.error(n());
	};
	return new ta(t ? function(e) {
		return t.schedule(r, 0, e);
	} : r);
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/Notification.js
var po;
(function(e) {
	e.NEXT = "N", e.ERROR = "E", e.COMPLETE = "C";
})(po ||= {});
var mo = function() {
	function e(e, t, n) {
		this.kind = e, this.value = t, this.error = n, this.hasValue = e === "N";
	}
	return e.prototype.observe = function(e) {
		return ho(this, e);
	}, e.prototype.do = function(e, t, n) {
		var r = this, i = r.kind, a = r.value, o = r.error;
		return i === "N" ? e?.(a) : i === "E" ? t?.(o) : n?.();
	}, e.prototype.accept = function(e, t, n) {
		return j(e?.next) ? this.observe(e) : this.do(e, t, n);
	}, e.prototype.toObservable = function() {
		var e = this, t = e.kind, n = e.value, r = e.error, i = t === "N" ? M(n) : t === "E" ? N(function() {
			return r;
		}) : t === "C" ? ja : 0;
		if (!i) throw TypeError("Unexpected notification kind " + t);
		return i;
	}, e.createNext = function(t) {
		return new e("N", t);
	}, e.createError = function(t) {
		return new e("E", void 0, t);
	}, e.createComplete = function() {
		return e.completeNotification;
	}, e.completeNotification = new e("C"), e;
}();
function ho(e, t) {
	var n, r, i, a = e, o = a.kind, s = a.value, c = a.error;
	if (typeof o != "string") throw TypeError("Invalid notification, missing \"kind\"");
	o === "N" ? (n = t.next) == null || n.call(t, s) : o === "E" ? (r = t.error) == null || r.call(t, c) : (i = t.complete) == null || i.call(t);
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/util/EmptyError.js
var go = wi(function(e) {
	return function() {
		e(this), this.name = "EmptyError", this.message = "no elements in sequence";
	};
});
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/lastValueFrom.js
function _o(e, t) {
	var n = typeof t == "object";
	return new Promise(function(r, i) {
		var a = !1, o;
		e.subscribe({
			next: function(e) {
				o = e, a = !0;
			},
			error: i,
			complete: function() {
				a ? r(o) : n ? r(t.defaultValue) : i(new go());
			}
		});
	});
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/firstValueFrom.js
function vo(e, t) {
	var n = typeof t == "object";
	return new Promise(function(r, i) {
		var a = new Ki({
			next: function(e) {
				r(e), a.unsubscribe();
			},
			error: i,
			complete: function() {
				n ? r(t.defaultValue) : i(new go());
			}
		});
		e.subscribe(a);
	});
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/util/isDate.js
function yo(e) {
	return e instanceof Date && !isNaN(e);
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/operators/timeout.js
var bo = wi(function(e) {
	return function(t) {
		t === void 0 && (t = null), e(this), this.message = "Timeout has occurred", this.name = "TimeoutError", this.info = t;
	};
});
function xo(e, t) {
	var n = yo(e) ? { first: e } : typeof e == "number" ? { each: e } : e, r = n.first, i = n.each, a = n.with, o = a === void 0 ? So : a, s = n.scheduler, c = s === void 0 ? t ?? Aa : s, l = n.meta, u = l === void 0 ? null : l;
	if (r == null && i == null) throw TypeError("No timeout provided.");
	return oa(function(e, t) {
		var n, a, s = null, l = 0, d = function(e) {
			a = to(t, c, function() {
				try {
					n.unsubscribe(), qa(o({
						meta: u,
						lastValue: s,
						seen: l
					})).subscribe(t);
				} catch (e) {
					t.error(e);
				}
			}, e);
		};
		n = e.subscribe(sa(t, function(e) {
			a?.unsubscribe(), l++, t.next(s = e), i > 0 && d(i);
		}, void 0, void 0, function() {
			a?.closed || a?.unsubscribe(), s = null;
		})), !l && d(r == null ? i : typeof r == "number" ? r : +r - c.now());
	});
}
function So(e) {
	throw new bo(e);
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/operators/map.js
function Co(e, t) {
	return oa(function(n, r) {
		var i = 0;
		n.subscribe(sa(r, function(n) {
			r.next(e.call(t, n, i++));
		}));
	});
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/operators/mergeInternals.js
function wo(e, t, n, r, i, a, o, s) {
	var c = [], l = 0, u = 0, d = !1, f = function() {
		d && !c.length && !l && t.complete();
	}, ee = function(e) {
		return l < r ? p(e) : c.push(e);
	}, p = function(e) {
		a && t.next(e), l++;
		var s = !1;
		qa(n(e, u++)).subscribe(sa(t, function(e) {
			i?.(e), a ? ee(e) : t.next(e);
		}, function() {
			s = !0;
		}, void 0, function() {
			if (s) try {
				l--;
				for (var e = function() {
					var e = c.shift();
					o ? to(t, o, function() {
						return p(e);
					}) : p(e);
				}; c.length && l < r;) e();
				f();
			} catch (e) {
				t.error(e);
			}
		}));
	};
	return e.subscribe(sa(t, ee, function() {
		d = !0, f();
	})), function() {
		s?.();
	};
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/operators/mergeMap.js
function To(e, t, n) {
	return n === void 0 && (n = Infinity), j(t) ? To(function(n, r) {
		return Co(function(e, i) {
			return t(n, e, r, i);
		})(qa(e(n, r)));
	}, n) : (typeof t == "number" && (n = t), oa(function(t, r) {
		return wo(t, r, e, n);
	}));
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/operators/mergeAll.js
function Eo(e) {
	return e === void 0 && (e = Infinity), To(Qi, e);
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/operators/concatAll.js
function Do() {
	return Eo(1);
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/observable/concat.js
function Oo() {
	var e = [...arguments];
	return Do()(fo(e, Fa(e)));
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/observable/defer.js
function ko(e) {
	return new ta(function(t) {
		qa(e()).subscribe(t);
	});
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/observable/merge.js
function Ao() {
	var e = [...arguments], t = Fa(e), n = Ia(e, Infinity), r = e;
	return r.length ? r.length === 1 ? qa(r[0]) : Eo(n)(fo(r, t)) : ja;
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/observable/never.js
var jo = new ta(Pi);
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/operators/filter.js
function Mo(e, t) {
	return oa(function(n, r) {
		var i = 0;
		n.subscribe(sa(r, function(n) {
			return e.call(t, n, i++) && r.next(n);
		}));
	});
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/operators/catchError.js
function No(e) {
	return oa(function(t, n) {
		var r = null, i = !1, a;
		r = t.subscribe(sa(n, void 0, void 0, function(o) {
			a = qa(e(o, No(e)(t))), r ? (r.unsubscribe(), r = null, a.subscribe(n)) : i = !0;
		})), i && (r.unsubscribe(), r = null, a.subscribe(n));
	});
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/operators/scanInternals.js
function Po(e, t, n, r, i) {
	return function(a, o) {
		var s = n, c = t, l = 0;
		a.subscribe(sa(o, function(t) {
			var n = l++;
			c = s ? e(c, t, n) : (s = !0, t), r && o.next(c);
		}, i && (function() {
			s && o.next(c), o.complete();
		})));
	};
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/operators/concatMap.js
function Fo(e, t) {
	return j(t) ? To(e, t, 1) : To(e, 1);
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/operators/defaultIfEmpty.js
function Io(e) {
	return oa(function(t, n) {
		var r = !1;
		t.subscribe(sa(n, function(e) {
			r = !0, n.next(e);
		}, function() {
			r || n.next(e), n.complete();
		}));
	});
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/operators/take.js
function Lo(e) {
	return e <= 0 ? function() {
		return ja;
	} : oa(function(t, n) {
		var r = 0;
		t.subscribe(sa(n, function(t) {
			++r <= e && (n.next(t), e <= r && n.complete());
		}));
	});
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/operators/ignoreElements.js
function Ro() {
	return oa(function(e, t) {
		e.subscribe(sa(t, Pi));
	});
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/operators/dematerialize.js
function zo() {
	return oa(function(e, t) {
		e.subscribe(sa(t, function(e) {
			return ho(e, t);
		}));
	});
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/operators/distinctUntilChanged.js
function Bo(e, t) {
	return t === void 0 && (t = Qi), e ??= Vo, oa(function(n, r) {
		var i, a = !0;
		n.subscribe(sa(r, function(n) {
			var o = t(n);
			(a || !e(i, o)) && (a = !1, i = o, r.next(n));
		}));
	});
}
function Vo(e, t) {
	return e === t;
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/operators/endWith.js
function Ho() {
	var e = [...arguments];
	return function(t) {
		return Oo(t, M.apply(void 0, bi([], yi(e))));
	};
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/operators/finalize.js
function Uo(e) {
	return oa(function(t, n) {
		try {
			t.subscribe(n);
		} finally {
			n.add(e);
		}
	});
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/operators/scan.js
function Wo(e, t) {
	return oa(Po(e, t, arguments.length >= 2, !0));
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/operators/share.js
function Go(e) {
	e === void 0 && (e = {});
	var t = e.connector, n = t === void 0 ? function() {
		return new ua();
	} : t, r = e.resetOnError, i = r === void 0 ? !0 : r, a = e.resetOnComplete, o = a === void 0 ? !0 : a, s = e.resetOnRefCountZero, c = s === void 0 ? !0 : s;
	return function(e) {
		var t, r, a, s = 0, l = !1, u = !1, d = function() {
			r?.unsubscribe(), r = void 0;
		}, f = function() {
			d(), t = a = void 0, l = u = !1;
		}, ee = function() {
			var e = t;
			f(), e?.unsubscribe();
		};
		return oa(function(e, p) {
			s++, !u && !l && d();
			var m = a ??= n();
			p.add(function() {
				s--, s === 0 && !u && !l && (r = Ko(ee, c));
			}), m.subscribe(p), !t && s > 0 && (t = new Ki({
				next: function(e) {
					return m.next(e);
				},
				error: function(e) {
					u = !0, d(), r = Ko(f, i, e), m.error(e);
				},
				complete: function() {
					l = !0, d(), r = Ko(f, o), m.complete();
				}
			}), qa(e).subscribe(t));
		})(e);
	};
}
function Ko(e, t) {
	var n = [...arguments].slice(2);
	if (t === !0) {
		e();
		return;
	}
	if (t !== !1) {
		var r = new Ki({ next: function() {
			r.unsubscribe(), e();
		} });
		return qa(t.apply(void 0, bi([], yi(n)))).subscribe(r);
	}
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/operators/shareReplay.js
function qo(e, t, n) {
	var r, i, a, o, s = !1;
	return e && typeof e == "object" ? (r = e.bufferSize, o = r === void 0 ? Infinity : r, i = e.windowTime, t = i === void 0 ? Infinity : i, a = e.refCount, s = a === void 0 ? !1 : a, n = e.scheduler) : o = e ?? Infinity, Go({
		connector: function() {
			return new ma(o, t, n);
		},
		resetOnError: !0,
		resetOnComplete: !1,
		resetOnRefCountZero: s
	});
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/operators/switchMap.js
function Jo(e, t) {
	return oa(function(n, r) {
		var i = null, a = 0, o = !1, s = function() {
			return o && !i && r.complete();
		};
		n.subscribe(sa(r, function(n) {
			i?.unsubscribe();
			var o = 0, c = a++;
			qa(e(n, c)).subscribe(i = sa(r, function(e) {
				return r.next(t ? t(n, e, c, o++) : e);
			}, function() {
				i = null, s();
			}));
		}, function() {
			o = !0, s();
		}));
	});
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/operators/takeUntil.js
function Yo(e) {
	return oa(function(t, n) {
		qa(e).subscribe(sa(n, function() {
			return n.complete();
		}, Pi)), !n.closed && t.subscribe(n);
	});
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/operators/tap.js
function Xo(e, t, n) {
	var r = j(e) || t || n ? {
		next: e,
		error: t,
		complete: n
	} : e;
	return r ? oa(function(e, t) {
		var n;
		(n = r.subscribe) == null || n.call(r);
		var i = !0;
		e.subscribe(sa(t, function(e) {
			var n;
			(n = r.next) == null || n.call(r, e), t.next(e);
		}, function() {
			var e;
			i = !1, (e = r.complete) == null || e.call(r), t.complete();
		}, function(e) {
			var n;
			i = !1, (n = r.error) == null || n.call(r, e), t.error(e);
		}, function() {
			var e, t;
			i && ((e = r.unsubscribe) == null || e.call(r)), (t = r.finalize) == null || t.call(r);
		}));
	}) : Qi;
}
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/operators/withLatestFrom.js
function Zo() {
	var e = [...arguments], t = Pa(e);
	return oa(function(n, r) {
		for (var i = e.length, a = Array(i), o = e.map(function() {
			return !1;
		}), s = !1, c = function(t) {
			qa(e[t]).subscribe(sa(r, function(e) {
				a[t] = e, !s && !o[t] && (o[t] = !0, (s = o.every(Qi)) && (o = null));
			}, Pi));
		}, l = 0; l < i; l++) c(l);
		n.subscribe(sa(r, function(e) {
			if (s) {
				var n = bi([e], yi(a));
				r.next(t ? t.apply(void 0, bi([], yi(n))) : n);
			}
		}));
	});
}
//#endregion
//#region node_modules/.pnpm/untruncate-json@0.0.1/node_modules/untruncate-json/dist/esm/index.js
function Qo(e) {
	return " \r\n	".indexOf(e) >= 0;
}
function $o(e) {
	for (var t = ["topLevel"], n = 0, r, i, a, o = function(e) {
		return t.push(e);
	}, s = function(e) {
		return t[t.length - 1] = e;
	}, c = function(e) {
		r ?? (r = n, i = t.length, a = e);
	}, l = function(e) {
		e === a && (r = void 0, i = void 0, a = void 0);
	}, u = function() {
		return t.pop();
	}, d = function() {
		return n--;
	}, f = function(e) {
		if ("0" <= e && e <= "9") {
			o("number");
			return;
		}
		switch (e) {
			case "\"":
				o("string");
				return;
			case "-":
				o("numberNeedsDigit");
				return;
			case "t":
				o("true");
				return;
			case "f":
				o("false");
				return;
			case "n":
				o("null");
				return;
			case "[":
				o("arrayNeedsValue");
				return;
			case "{":
				o("objectNeedsKey");
				return;
		}
	}, ee = e.length; n < ee; n++) {
		var p = e[n];
		switch (t[t.length - 1]) {
			case "topLevel":
				f(p);
				break;
			case "string":
				switch (p) {
					case "\"":
						u();
						break;
					case "\\":
						c("stringEscape"), o("stringEscaped");
						break;
				}
				break;
			case "stringEscaped":
				p === "u" ? o("stringUnicode") : (l("stringEscape"), u());
				break;
			case "stringUnicode":
				n - e.lastIndexOf("u", n) === 4 && (l("stringEscape"), u());
				break;
			case "number":
				p === "." ? s("numberNeedsDigit") : p === "e" || p === "E" ? s("numberNeedsExponent") : (p < "0" || p > "9") && (d(), u());
				break;
			case "numberNeedsDigit":
				s("number");
				break;
			case "numberNeedsExponent":
				s(p === "+" || p === "-" ? "numberNeedsDigit" : "number");
				break;
			case "true":
			case "false":
			case "null":
				(p < "a" || p > "z") && (d(), u());
				break;
			case "arrayNeedsValue":
				p === "]" ? u() : Qo(p) || (l("collectionItem"), s("arrayNeedsComma"), f(p));
				break;
			case "arrayNeedsComma":
				p === "]" ? u() : p === "," && (c("collectionItem"), s("arrayNeedsValue"));
				break;
			case "objectNeedsKey":
				p === "}" ? u() : p === "\"" && (c("collectionItem"), s("objectNeedsColon"), o("string"));
				break;
			case "objectNeedsColon":
				p === ":" && s("objectNeedsValue");
				break;
			case "objectNeedsValue":
				Qo(p) || (l("collectionItem"), s("objectNeedsComma"), f(p));
				break;
			case "objectNeedsComma":
				p === "}" ? u() : p === "," && (c("collectionItem"), s("objectNeedsKey"));
				break;
		}
	}
	i != null && (t.length = i);
	for (var m = [r == null ? e : e.slice(0, r)], te = function(t) {
		return m.push(t.slice(e.length - e.lastIndexOf(t[0])));
	}, ne = t.length - 1; ne >= 0; ne--) switch (t[ne]) {
		case "string":
			m.push("\"");
			break;
		case "numberNeedsDigit":
		case "numberNeedsExponent":
			m.push("0");
			break;
		case "true":
			te("true");
			break;
		case "false":
			te("false");
			break;
		case "null":
			te("null");
			break;
		case "arrayNeedsValue":
		case "arrayNeedsComma":
			m.push("]");
			break;
		case "objectNeedsKey":
		case "objectNeedsColon":
		case "objectNeedsValue":
		case "objectNeedsComma":
			m.push("}");
			break;
	}
	return m.join("");
}
//#endregion
//#region node_modules/.pnpm/@bufbuild+protobuf@2.12.0/node_modules/@bufbuild/protobuf/dist/esm/wire/varint.js
function es() {
	let e = 0, t = 0;
	for (let n = 0; n < 28; n += 7) {
		let r = this.buf[this.pos++];
		if (e |= (r & 127) << n, !(r & 128)) return this.assertBounds(), [e, t];
	}
	let n = this.buf[this.pos++];
	if (e |= (n & 15) << 28, t = (n & 112) >> 4, !(n & 128)) return this.assertBounds(), [e, t];
	for (let n = 3; n <= 31; n += 7) {
		let r = this.buf[this.pos++];
		if (t |= (r & 127) << n, !(r & 128)) return this.assertBounds(), [e, t];
	}
	throw Error("invalid varint");
}
function ts(e, t, n) {
	for (let r = 0; r < 28; r += 7) {
		let i = e >>> r, a = !(!(i >>> 7) && t == 0), o = (a ? i | 128 : i) & 255;
		if (n.push(o), !a) return;
	}
	let r = e >>> 28 & 15 | (t & 7) << 4, i = !!(t >> 3);
	if (n.push((i ? r | 128 : r) & 255), i) {
		for (let e = 3; e < 31; e += 7) {
			let r = t >>> e, i = !!(r >>> 7), a = (i ? r | 128 : r) & 255;
			if (n.push(a), !i) return;
		}
		n.push(t >>> 31 & 1);
	}
}
var ns = 4294967296;
function rs(e) {
	let t = e[0] === "-";
	t && (e = e.slice(1));
	let n = 1e6, r = 0, i = 0;
	function a(t, a) {
		let o = Number(e.slice(t, a));
		i *= n, r = r * n + o, r >= ns && (i += r / ns | 0, r %= ns);
	}
	return a(-24, -18), a(-18, -12), a(-12, -6), a(-6), t ? cs(r, i) : ss(r, i);
}
function is(e, t) {
	let n = ss(e, t), r = n.hi & 2147483648;
	r && (n = cs(n.lo, n.hi));
	let i = as(n.lo, n.hi);
	return r ? "-" + i : i;
}
function as(e, t) {
	if ({lo: e, hi: t} = os(e, t), t <= 2097151) return String(ns * t + e);
	let n = e & 16777215, r = (e >>> 24 | t << 8) & 16777215, i = t >> 16 & 65535, a = n + r * 6777216 + i * 6710656, o = r + i * 8147497, s = i * 2, c = 1e7;
	return a >= c && (o += Math.floor(a / c), a %= c), o >= c && (s += Math.floor(o / c), o %= c), s.toString() + ls(o) + ls(a);
}
function os(e, t) {
	return {
		lo: e >>> 0,
		hi: t >>> 0
	};
}
function ss(e, t) {
	return {
		lo: e | 0,
		hi: t | 0
	};
}
function cs(e, t) {
	return t = ~t, e ? e = ~e + 1 : t += 1, ss(e, t);
}
var ls = (e) => {
	let t = String(e);
	return "0000000".slice(t.length) + t;
};
function us(e, t) {
	if (e >= 0) {
		for (; e > 127;) t.push(e & 127 | 128), e >>>= 7;
		t.push(e);
	} else {
		for (let n = 0; n < 9; n++) t.push(e & 127 | 128), e >>= 7;
		t.push(1);
	}
}
function ds() {
	let e = this.buf[this.pos++], t = e & 127;
	if (!(e & 128) || (e = this.buf[this.pos++], t |= (e & 127) << 7, !(e & 128)) || (e = this.buf[this.pos++], t |= (e & 127) << 14, !(e & 128)) || (e = this.buf[this.pos++], t |= (e & 127) << 21, !(e & 128))) return this.assertBounds(), t;
	e = this.buf[this.pos++], t |= (e & 15) << 28;
	for (let t = 5; e & 128 && t < 10; t++) e = this.buf[this.pos++];
	if (e & 128) throw Error("invalid varint");
	return this.assertBounds(), t >>> 0;
}
//#endregion
//#region node_modules/.pnpm/@bufbuild+protobuf@2.12.0/node_modules/@bufbuild/protobuf/dist/esm/proto-int64.js
var fs = /* @__PURE__ */ ps();
function ps() {
	let e = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(8));
	if (typeof BigInt == "function" && typeof e.getBigInt64 == "function" && typeof e.getBigUint64 == "function" && typeof e.setBigInt64 == "function" && typeof e.setBigUint64 == "function" && (globalThis.Deno || typeof process != "object" || typeof process.env != "object" || process.env.BUF_BIGINT_DISABLE !== "1")) {
		let t = BigInt("-9223372036854775808"), n = BigInt("9223372036854775807"), r = BigInt("0"), i = BigInt("18446744073709551615");
		return {
			zero: BigInt(0),
			supported: !0,
			parse(e) {
				let r = typeof e == "bigint" ? e : BigInt(e);
				if (r > n || r < t) throw Error(`invalid int64: ${e}`);
				return r;
			},
			uParse(e) {
				let t = typeof e == "bigint" ? e : BigInt(e);
				if (t > i || t < r) throw Error(`invalid uint64: ${e}`);
				return t;
			},
			enc(t) {
				return e.setBigInt64(0, this.parse(t), !0), {
					lo: e.getInt32(0, !0),
					hi: e.getInt32(4, !0)
				};
			},
			uEnc(t) {
				return e.setBigInt64(0, this.uParse(t), !0), {
					lo: e.getInt32(0, !0),
					hi: e.getInt32(4, !0)
				};
			},
			dec(t, n) {
				return e.setInt32(0, t, !0), e.setInt32(4, n, !0), e.getBigInt64(0, !0);
			},
			uDec(t, n) {
				return e.setInt32(0, t, !0), e.setInt32(4, n, !0), e.getBigUint64(0, !0);
			}
		};
	}
	return {
		zero: "0",
		supported: !1,
		parse(e) {
			return typeof e != "string" && (e = e.toString()), ms(e), e;
		},
		uParse(e) {
			return typeof e != "string" && (e = e.toString()), hs(e), e;
		},
		enc(e) {
			return typeof e != "string" && (e = e.toString()), ms(e), rs(e);
		},
		uEnc(e) {
			return typeof e != "string" && (e = e.toString()), hs(e), rs(e);
		},
		dec(e, t) {
			return is(e, t);
		},
		uDec(e, t) {
			return as(e, t);
		}
	};
}
function ms(e) {
	if (!/^-?[0-9]+$/.test(e)) throw Error("invalid int64: " + e);
}
function hs(e) {
	if (!/^[0-9]+$/.test(e)) throw Error("invalid uint64: " + e);
}
//#endregion
//#region node_modules/.pnpm/@bufbuild+protobuf@2.12.0/node_modules/@bufbuild/protobuf/dist/esm/wire/text-encoding.js
var gs = Symbol.for("@bufbuild/protobuf/text-encoding");
function _s() {
	if (globalThis[gs] == null) {
		let e = new globalThis.TextEncoder(), t = new globalThis.TextDecoder(), n;
		globalThis[gs] = {
			encodeUtf8(t) {
				return e.encode(t);
			},
			decodeUtf8(e, r) {
				return r ? (n === void 0 && (n = new globalThis.TextDecoder("utf-8", { fatal: !0 })), n.decode(e)) : t.decode(e);
			},
			checkUtf8(e) {
				try {
					return !0;
				} catch {
					return !1;
				}
			}
		};
	}
	return globalThis[gs];
}
//#endregion
//#region node_modules/.pnpm/@bufbuild+protobuf@2.12.0/node_modules/@bufbuild/protobuf/dist/esm/wire/binary-encoding.js
var vs;
(function(e) {
	e[e.Varint = 0] = "Varint", e[e.Bit64 = 1] = "Bit64", e[e.LengthDelimited = 2] = "LengthDelimited", e[e.StartGroup = 3] = "StartGroup", e[e.EndGroup = 4] = "EndGroup", e[e.Bit32 = 5] = "Bit32";
})(vs ||= {});
var P = class {
	constructor(e = _s().encodeUtf8) {
		this.encodeUtf8 = e, this.stack = [], this.chunks = [], this.buf = [];
	}
	finish() {
		this.buf.length && (this.chunks.push(new Uint8Array(this.buf)), this.buf = []);
		let e = 0;
		for (let t = 0; t < this.chunks.length; t++) e += this.chunks[t].length;
		let t = new Uint8Array(e), n = 0;
		for (let e = 0; e < this.chunks.length; e++) t.set(this.chunks[e], n), n += this.chunks[e].length;
		return this.chunks = [], t;
	}
	fork() {
		return this.stack.push({
			chunks: this.chunks,
			buf: this.buf
		}), this.chunks = [], this.buf = [], this;
	}
	join() {
		let e = this.finish(), t = this.stack.pop();
		if (!t) throw Error("invalid state, fork stack empty");
		return this.chunks = t.chunks, this.buf = t.buf, this.uint32(e.byteLength), this.raw(e);
	}
	tag(e, t) {
		return this.uint32((e << 3 | t) >>> 0);
	}
	raw(e) {
		return this.buf.length && (this.chunks.push(new Uint8Array(this.buf)), this.buf = []), this.chunks.push(e), this;
	}
	uint32(e) {
		for (bs(e); e > 127;) this.buf.push(e & 127 | 128), e >>>= 7;
		return this.buf.push(e), this;
	}
	int32(e) {
		return ys(e), us(e, this.buf), this;
	}
	bool(e) {
		return this.buf.push(+!!e), this;
	}
	bytes(e) {
		return this.uint32(e.byteLength), this.raw(e);
	}
	string(e) {
		let t = this.encodeUtf8(e);
		return this.uint32(t.byteLength), this.raw(t);
	}
	float(e) {
		xs(e);
		let t = new Uint8Array(4);
		return new DataView(t.buffer).setFloat32(0, e, !0), this.raw(t);
	}
	double(e) {
		let t = new Uint8Array(8);
		return new DataView(t.buffer).setFloat64(0, e, !0), this.raw(t);
	}
	fixed32(e) {
		bs(e);
		let t = new Uint8Array(4);
		return new DataView(t.buffer).setUint32(0, e, !0), this.raw(t);
	}
	sfixed32(e) {
		ys(e);
		let t = new Uint8Array(4);
		return new DataView(t.buffer).setInt32(0, e, !0), this.raw(t);
	}
	sint32(e) {
		return ys(e), e = (e << 1 ^ e >> 31) >>> 0, us(e, this.buf), this;
	}
	sfixed64(e) {
		let t = new Uint8Array(8), n = new DataView(t.buffer), r = fs.enc(e);
		return n.setInt32(0, r.lo, !0), n.setInt32(4, r.hi, !0), this.raw(t);
	}
	fixed64(e) {
		let t = new Uint8Array(8), n = new DataView(t.buffer), r = fs.uEnc(e);
		return n.setInt32(0, r.lo, !0), n.setInt32(4, r.hi, !0), this.raw(t);
	}
	int64(e) {
		let t = fs.enc(e);
		return ts(t.lo, t.hi, this.buf), this;
	}
	sint64(e) {
		let t = fs.enc(e), n = t.hi >> 31;
		return ts(t.lo << 1 ^ n, (t.hi << 1 | t.lo >>> 31) ^ n, this.buf), this;
	}
	uint64(e) {
		let t = fs.uEnc(e);
		return ts(t.lo, t.hi, this.buf), this;
	}
}, F = class {
	constructor(e, t = _s().decodeUtf8) {
		this.decodeUtf8 = t, this.varint64 = es, this.uint32 = ds, this.buf = e, this.len = e.length, this.pos = 0, this.view = new DataView(e.buffer, e.byteOffset, e.byteLength);
	}
	tag() {
		let e = this.pos, t = this.uint32(), n = this.pos - e;
		if (n > 5 || n == 5 && this.buf[this.pos - 1] > 15) throw Error("illegal tag: varint overflows uint32");
		let r = t >>> 3, i = t & 7;
		if (r <= 0 || i > 5) throw Error("illegal tag: field no " + r + " wire type " + i);
		return [r, i];
	}
	skip(e, t) {
		let n = this.pos;
		switch (e) {
			case vs.Varint:
				for (; this.buf[this.pos++] & 128;);
				break;
			case vs.Bit64: this.pos += 4;
			case vs.Bit32:
				this.pos += 4;
				break;
			case vs.LengthDelimited:
				let n = this.uint32();
				this.pos += n;
				break;
			case vs.StartGroup:
				for (;;) {
					let [e, n] = this.tag();
					if (n === vs.EndGroup) {
						if (t !== void 0 && e !== t) throw Error("invalid end group tag");
						break;
					}
					this.skip(n, e);
				}
				break;
			default: throw Error("cant skip wire type " + e);
		}
		return this.assertBounds(), this.buf.subarray(n, this.pos);
	}
	assertBounds() {
		if (this.pos > this.len) throw RangeError("premature EOF");
	}
	int32() {
		return this.uint32() | 0;
	}
	sint32() {
		let e = this.uint32();
		return e >>> 1 ^ -(e & 1);
	}
	int64() {
		return fs.dec(...this.varint64());
	}
	uint64() {
		return fs.uDec(...this.varint64());
	}
	sint64() {
		let [e, t] = this.varint64(), n = -(e & 1);
		return e = (e >>> 1 | (t & 1) << 31) ^ n, t = t >>> 1 ^ n, fs.dec(e, t);
	}
	bool() {
		let [e, t] = this.varint64();
		return e !== 0 || t !== 0;
	}
	fixed32() {
		return this.view.getUint32((this.pos += 4) - 4, !0);
	}
	sfixed32() {
		return this.view.getInt32((this.pos += 4) - 4, !0);
	}
	fixed64() {
		return fs.uDec(this.sfixed32(), this.sfixed32());
	}
	sfixed64() {
		return fs.dec(this.sfixed32(), this.sfixed32());
	}
	float() {
		return this.view.getFloat32((this.pos += 4) - 4, !0);
	}
	double() {
		return this.view.getFloat64((this.pos += 8) - 8, !0);
	}
	bytes() {
		let e = this.uint32(), t = this.pos;
		return this.pos += e, this.assertBounds(), this.buf.subarray(t, t + e);
	}
	string(e) {
		return this.decodeUtf8(this.bytes(), e);
	}
};
function ys(e) {
	if (typeof e == "string") e = Number(e);
	else if (typeof e != "number") throw Error("invalid int32: " + typeof e);
	if (!Number.isInteger(e) || e > 2147483647 || e < -2147483648) throw Error("invalid int32: " + e);
}
function bs(e) {
	if (typeof e == "string") e = Number(e);
	else if (typeof e != "number") throw Error("invalid uint32: " + typeof e);
	if (!Number.isInteger(e) || e > 4294967295 || e < 0) throw Error("invalid uint32: " + e);
}
function xs(e) {
	if (typeof e == "string") {
		let t = e;
		if (e = Number(e), Number.isNaN(e) && t !== "NaN") throw Error("invalid float32: " + t);
	} else if (typeof e != "number") throw Error("invalid float32: " + typeof e);
	if (Number.isFinite(e) && (e > 34028234663852886e22 || e < -34028234663852886e22)) throw Error("invalid float32: " + e);
}
//#endregion
//#region node_modules/.pnpm/@ag-ui+proto@0.0.53/node_modules/@ag-ui/proto/dist/index.mjs
var Ss = /* @__PURE__ */ function(e) {
	return e[e.NULL_VALUE = 0] = "NULL_VALUE", e[e.UNRECOGNIZED = -1] = "UNRECOGNIZED", e;
}({});
function Cs() {
	return { fields: {} };
}
var ws = {
	encode(e, t = new P()) {
		return Object.entries(e.fields).forEach(([e, n]) => {
			n !== void 0 && Es.encode({
				key: e,
				value: n
			}, t.uint32(10).fork()).join();
		}), t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = Cs();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1: {
					if (e !== 10) break;
					let t = Es.decode(n, n.uint32());
					t.value !== void 0 && (i.fields[t.key] = t.value);
					continue;
				}
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return ws.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = Cs();
		return t.fields = Object.entries(e.fields ?? {}).reduce((e, [t, n]) => (n !== void 0 && (e[t] = n), e), {}), t;
	},
	wrap(e) {
		let t = Cs();
		if (e !== void 0) for (let n of Object.keys(e)) t.fields[n] = e[n];
		return t;
	},
	unwrap(e) {
		let t = {};
		if (e.fields) for (let n of Object.keys(e.fields)) t[n] = e.fields[n];
		return t;
	}
};
function Ts() {
	return {
		key: "",
		value: void 0
	};
}
var Es = {
	encode(e, t = new P()) {
		return e.key !== "" && t.uint32(10).string(e.key), e.value !== void 0 && I.encode(I.wrap(e.value), t.uint32(18).fork()).join(), t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = Ts();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 10) break;
					i.key = n.string();
					continue;
				case 2:
					if (e !== 18) break;
					i.value = I.unwrap(I.decode(n, n.uint32()));
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return Es.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = Ts();
		return t.key = e.key ?? "", t.value = e.value ?? void 0, t;
	}
};
function Ds() {
	return {
		nullValue: void 0,
		numberValue: void 0,
		stringValue: void 0,
		boolValue: void 0,
		structValue: void 0,
		listValue: void 0
	};
}
var I = {
	encode(e, t = new P()) {
		return e.nullValue !== void 0 && t.uint32(8).int32(e.nullValue), e.numberValue !== void 0 && t.uint32(17).double(e.numberValue), e.stringValue !== void 0 && t.uint32(26).string(e.stringValue), e.boolValue !== void 0 && t.uint32(32).bool(e.boolValue), e.structValue !== void 0 && ws.encode(ws.wrap(e.structValue), t.uint32(42).fork()).join(), e.listValue !== void 0 && ks.encode(ks.wrap(e.listValue), t.uint32(50).fork()).join(), t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = Ds();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 8) break;
					i.nullValue = n.int32();
					continue;
				case 2:
					if (e !== 17) break;
					i.numberValue = n.double();
					continue;
				case 3:
					if (e !== 26) break;
					i.stringValue = n.string();
					continue;
				case 4:
					if (e !== 32) break;
					i.boolValue = n.bool();
					continue;
				case 5:
					if (e !== 42) break;
					i.structValue = ws.unwrap(ws.decode(n, n.uint32()));
					continue;
				case 6:
					if (e !== 50) break;
					i.listValue = ks.unwrap(ks.decode(n, n.uint32()));
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return I.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = Ds();
		return t.nullValue = e.nullValue ?? void 0, t.numberValue = e.numberValue ?? void 0, t.stringValue = e.stringValue ?? void 0, t.boolValue = e.boolValue ?? void 0, t.structValue = e.structValue ?? void 0, t.listValue = e.listValue ?? void 0, t;
	},
	wrap(e) {
		let t = Ds();
		if (e === null) t.nullValue = Ss.NULL_VALUE;
		else if (typeof e == "boolean") t.boolValue = e;
		else if (typeof e == "number") t.numberValue = e;
		else if (typeof e == "string") t.stringValue = e;
		else if (globalThis.Array.isArray(e)) t.listValue = e;
		else if (typeof e == "object") t.structValue = e;
		else if (e !== void 0) throw new globalThis.Error("Unsupported any value type: " + typeof e);
		return t;
	},
	unwrap(e) {
		if (e.stringValue !== void 0) return e.stringValue;
		if (e?.numberValue !== void 0) return e.numberValue;
		if (e?.boolValue !== void 0) return e.boolValue;
		if (e?.structValue !== void 0) return e.structValue;
		if (e?.listValue !== void 0) return e.listValue;
		if (e?.nullValue !== void 0) return null;
	}
};
function Os() {
	return { values: [] };
}
var ks = {
	encode(e, t = new P()) {
		for (let n of e.values) I.encode(I.wrap(n), t.uint32(10).fork()).join();
		return t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = Os();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 10) break;
					i.values.push(I.unwrap(I.decode(n, n.uint32())));
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return ks.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = Os();
		return t.values = e.values?.map((e) => e) || [], t;
	},
	wrap(e) {
		let t = Os();
		return t.values = e ?? [], t;
	},
	unwrap(e) {
		return e?.hasOwnProperty("values") && globalThis.Array.isArray(e.values) ? e.values : e;
	}
}, As = /* @__PURE__ */ function(e) {
	return e[e.ADD = 0] = "ADD", e[e.REMOVE = 1] = "REMOVE", e[e.REPLACE = 2] = "REPLACE", e[e.MOVE = 3] = "MOVE", e[e.COPY = 4] = "COPY", e[e.TEST = 5] = "TEST", e[e.UNRECOGNIZED = -1] = "UNRECOGNIZED", e;
}({});
function js() {
	return {
		op: 0,
		path: "",
		from: void 0,
		value: void 0
	};
}
var Ms = {
	encode(e, t = new P()) {
		return e.op !== 0 && t.uint32(8).int32(e.op), e.path !== "" && t.uint32(18).string(e.path), e.from !== void 0 && t.uint32(26).string(e.from), e.value !== void 0 && I.encode(I.wrap(e.value), t.uint32(34).fork()).join(), t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = js();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 8) break;
					i.op = n.int32();
					continue;
				case 2:
					if (e !== 18) break;
					i.path = n.string();
					continue;
				case 3:
					if (e !== 26) break;
					i.from = n.string();
					continue;
				case 4:
					if (e !== 34) break;
					i.value = I.unwrap(I.decode(n, n.uint32()));
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return Ms.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = js();
		return t.op = e.op ?? 0, t.path = e.path ?? "", t.from = e.from ?? void 0, t.value = e.value ?? void 0, t;
	}
};
function Ns() {
	return {
		id: "",
		type: "",
		function: void 0
	};
}
var Ps = {
	encode(e, t = new P()) {
		return e.id !== "" && t.uint32(10).string(e.id), e.type !== "" && t.uint32(18).string(e.type), e.function !== void 0 && Is.encode(e.function, t.uint32(26).fork()).join(), t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = Ns();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 10) break;
					i.id = n.string();
					continue;
				case 2:
					if (e !== 18) break;
					i.type = n.string();
					continue;
				case 3:
					if (e !== 26) break;
					i.function = Is.decode(n, n.uint32());
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return Ps.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = Ns();
		return t.id = e.id ?? "", t.type = e.type ?? "", t.function = e.function !== void 0 && e.function !== null ? Is.fromPartial(e.function) : void 0, t;
	}
};
function Fs() {
	return {
		name: "",
		arguments: ""
	};
}
var Is = {
	encode(e, t = new P()) {
		return e.name !== "" && t.uint32(10).string(e.name), e.arguments !== "" && t.uint32(18).string(e.arguments), t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = Fs();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 10) break;
					i.name = n.string();
					continue;
				case 2:
					if (e !== 18) break;
					i.arguments = n.string();
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return Is.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = Fs();
		return t.name = e.name ?? "", t.arguments = e.arguments ?? "", t;
	}
};
function Ls() {
	return {
		value: "",
		mimeType: ""
	};
}
var Rs = {
	encode(e, t = new P()) {
		return e.value !== "" && t.uint32(10).string(e.value), e.mimeType !== "" && t.uint32(18).string(e.mimeType), t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = Ls();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 10) break;
					i.value = n.string();
					continue;
				case 2:
					if (e !== 18) break;
					i.mimeType = n.string();
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return Rs.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = Ls();
		return t.value = e.value ?? "", t.mimeType = e.mimeType ?? "", t;
	}
};
function zs() {
	return {
		value: "",
		mimeType: void 0
	};
}
var Bs = {
	encode(e, t = new P()) {
		return e.value !== "" && t.uint32(10).string(e.value), e.mimeType !== void 0 && t.uint32(18).string(e.mimeType), t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = zs();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 10) break;
					i.value = n.string();
					continue;
				case 2:
					if (e !== 18) break;
					i.mimeType = n.string();
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return Bs.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = zs();
		return t.value = e.value ?? "", t.mimeType = e.mimeType ?? void 0, t;
	}
};
function Vs() {
	return {
		data: void 0,
		url: void 0
	};
}
var Hs = {
	encode(e, t = new P()) {
		return e.data !== void 0 && Rs.encode(e.data, t.uint32(10).fork()).join(), e.url !== void 0 && Bs.encode(e.url, t.uint32(18).fork()).join(), t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = Vs();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 10) break;
					i.data = Rs.decode(n, n.uint32());
					continue;
				case 2:
					if (e !== 18) break;
					i.url = Bs.decode(n, n.uint32());
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return Hs.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = Vs();
		return t.data = e.data !== void 0 && e.data !== null ? Rs.fromPartial(e.data) : void 0, t.url = e.url !== void 0 && e.url !== null ? Bs.fromPartial(e.url) : void 0, t;
	}
};
function Us() {
	return { text: "" };
}
var Ws = {
	encode(e, t = new P()) {
		return e.text !== "" && t.uint32(10).string(e.text), t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = Us();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 10) break;
					i.text = n.string();
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return Ws.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = Us();
		return t.text = e.text ?? "", t;
	}
};
function Gs() {
	return {
		source: void 0,
		metadata: void 0
	};
}
var Ks = {
	encode(e, t = new P()) {
		return e.source !== void 0 && Hs.encode(e.source, t.uint32(10).fork()).join(), e.metadata !== void 0 && I.encode(I.wrap(e.metadata), t.uint32(18).fork()).join(), t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = Gs();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 10) break;
					i.source = Hs.decode(n, n.uint32());
					continue;
				case 2:
					if (e !== 18) break;
					i.metadata = I.unwrap(I.decode(n, n.uint32()));
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return Ks.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = Gs();
		return t.source = e.source !== void 0 && e.source !== null ? Hs.fromPartial(e.source) : void 0, t.metadata = e.metadata ?? void 0, t;
	}
};
function qs() {
	return {
		source: void 0,
		metadata: void 0
	};
}
var Js = {
	encode(e, t = new P()) {
		return e.source !== void 0 && Hs.encode(e.source, t.uint32(10).fork()).join(), e.metadata !== void 0 && I.encode(I.wrap(e.metadata), t.uint32(18).fork()).join(), t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = qs();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 10) break;
					i.source = Hs.decode(n, n.uint32());
					continue;
				case 2:
					if (e !== 18) break;
					i.metadata = I.unwrap(I.decode(n, n.uint32()));
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return Js.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = qs();
		return t.source = e.source !== void 0 && e.source !== null ? Hs.fromPartial(e.source) : void 0, t.metadata = e.metadata ?? void 0, t;
	}
};
function Ys() {
	return {
		source: void 0,
		metadata: void 0
	};
}
var Xs = {
	encode(e, t = new P()) {
		return e.source !== void 0 && Hs.encode(e.source, t.uint32(10).fork()).join(), e.metadata !== void 0 && I.encode(I.wrap(e.metadata), t.uint32(18).fork()).join(), t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = Ys();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 10) break;
					i.source = Hs.decode(n, n.uint32());
					continue;
				case 2:
					if (e !== 18) break;
					i.metadata = I.unwrap(I.decode(n, n.uint32()));
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return Xs.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = Ys();
		return t.source = e.source !== void 0 && e.source !== null ? Hs.fromPartial(e.source) : void 0, t.metadata = e.metadata ?? void 0, t;
	}
};
function Zs() {
	return {
		source: void 0,
		metadata: void 0
	};
}
var Qs = {
	encode(e, t = new P()) {
		return e.source !== void 0 && Hs.encode(e.source, t.uint32(10).fork()).join(), e.metadata !== void 0 && I.encode(I.wrap(e.metadata), t.uint32(18).fork()).join(), t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = Zs();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 10) break;
					i.source = Hs.decode(n, n.uint32());
					continue;
				case 2:
					if (e !== 18) break;
					i.metadata = I.unwrap(I.decode(n, n.uint32()));
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return Qs.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = Zs();
		return t.source = e.source !== void 0 && e.source !== null ? Hs.fromPartial(e.source) : void 0, t.metadata = e.metadata ?? void 0, t;
	}
};
function $s() {
	return {
		text: void 0,
		image: void 0,
		audio: void 0,
		video: void 0,
		document: void 0
	};
}
var ec = {
	encode(e, t = new P()) {
		return e.text !== void 0 && Ws.encode(e.text, t.uint32(10).fork()).join(), e.image !== void 0 && Ks.encode(e.image, t.uint32(18).fork()).join(), e.audio !== void 0 && Js.encode(e.audio, t.uint32(26).fork()).join(), e.video !== void 0 && Xs.encode(e.video, t.uint32(34).fork()).join(), e.document !== void 0 && Qs.encode(e.document, t.uint32(42).fork()).join(), t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = $s();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 10) break;
					i.text = Ws.decode(n, n.uint32());
					continue;
				case 2:
					if (e !== 18) break;
					i.image = Ks.decode(n, n.uint32());
					continue;
				case 3:
					if (e !== 26) break;
					i.audio = Js.decode(n, n.uint32());
					continue;
				case 4:
					if (e !== 34) break;
					i.video = Xs.decode(n, n.uint32());
					continue;
				case 5:
					if (e !== 42) break;
					i.document = Qs.decode(n, n.uint32());
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return ec.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = $s();
		return t.text = e.text !== void 0 && e.text !== null ? Ws.fromPartial(e.text) : void 0, t.image = e.image !== void 0 && e.image !== null ? Ks.fromPartial(e.image) : void 0, t.audio = e.audio !== void 0 && e.audio !== null ? Js.fromPartial(e.audio) : void 0, t.video = e.video !== void 0 && e.video !== null ? Xs.fromPartial(e.video) : void 0, t.document = e.document !== void 0 && e.document !== null ? Qs.fromPartial(e.document) : void 0, t;
	}
};
function tc() {
	return {
		id: "",
		role: "",
		content: void 0,
		name: void 0,
		toolCalls: [],
		toolCallId: void 0,
		error: void 0,
		contentParts: []
	};
}
var nc = {
	encode(e, t = new P()) {
		e.id !== "" && t.uint32(10).string(e.id), e.role !== "" && t.uint32(18).string(e.role), e.content !== void 0 && t.uint32(26).string(e.content), e.name !== void 0 && t.uint32(34).string(e.name);
		for (let n of e.toolCalls) Ps.encode(n, t.uint32(42).fork()).join();
		e.toolCallId !== void 0 && t.uint32(50).string(e.toolCallId), e.error !== void 0 && t.uint32(58).string(e.error);
		for (let n of e.contentParts) ec.encode(n, t.uint32(66).fork()).join();
		return t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = tc();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 10) break;
					i.id = n.string();
					continue;
				case 2:
					if (e !== 18) break;
					i.role = n.string();
					continue;
				case 3:
					if (e !== 26) break;
					i.content = n.string();
					continue;
				case 4:
					if (e !== 34) break;
					i.name = n.string();
					continue;
				case 5:
					if (e !== 42) break;
					i.toolCalls.push(Ps.decode(n, n.uint32()));
					continue;
				case 6:
					if (e !== 50) break;
					i.toolCallId = n.string();
					continue;
				case 7:
					if (e !== 58) break;
					i.error = n.string();
					continue;
				case 8:
					if (e !== 66) break;
					i.contentParts.push(ec.decode(n, n.uint32()));
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return nc.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = tc();
		return t.id = e.id ?? "", t.role = e.role ?? "", t.content = e.content ?? void 0, t.name = e.name ?? void 0, t.toolCalls = e.toolCalls?.map((e) => Ps.fromPartial(e)) || [], t.toolCallId = e.toolCallId ?? void 0, t.error = e.error ?? void 0, t.contentParts = e.contentParts?.map((e) => ec.fromPartial(e)) || [], t;
	}
}, rc = /* @__PURE__ */ function(e) {
	return e[e.TEXT_MESSAGE_START = 0] = "TEXT_MESSAGE_START", e[e.TEXT_MESSAGE_CONTENT = 1] = "TEXT_MESSAGE_CONTENT", e[e.TEXT_MESSAGE_END = 2] = "TEXT_MESSAGE_END", e[e.TOOL_CALL_START = 3] = "TOOL_CALL_START", e[e.TOOL_CALL_ARGS = 4] = "TOOL_CALL_ARGS", e[e.TOOL_CALL_END = 5] = "TOOL_CALL_END", e[e.STATE_SNAPSHOT = 6] = "STATE_SNAPSHOT", e[e.STATE_DELTA = 7] = "STATE_DELTA", e[e.MESSAGES_SNAPSHOT = 8] = "MESSAGES_SNAPSHOT", e[e.RAW = 9] = "RAW", e[e.CUSTOM = 10] = "CUSTOM", e[e.RUN_STARTED = 11] = "RUN_STARTED", e[e.RUN_FINISHED = 12] = "RUN_FINISHED", e[e.RUN_ERROR = 13] = "RUN_ERROR", e[e.STEP_STARTED = 14] = "STEP_STARTED", e[e.STEP_FINISHED = 15] = "STEP_FINISHED", e[e.UNRECOGNIZED = -1] = "UNRECOGNIZED", e;
}({});
function ic() {
	return {
		type: 0,
		timestamp: void 0,
		rawEvent: void 0
	};
}
var L = {
	encode(e, t = new P()) {
		return e.type !== 0 && t.uint32(8).int32(e.type), e.timestamp !== void 0 && t.uint32(16).int64(e.timestamp), e.rawEvent !== void 0 && I.encode(I.wrap(e.rawEvent), t.uint32(26).fork()).join(), t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = ic();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 8) break;
					i.type = n.int32();
					continue;
				case 2:
					if (e !== 16) break;
					i.timestamp = Uc(n.int64());
					continue;
				case 3:
					if (e !== 26) break;
					i.rawEvent = I.unwrap(I.decode(n, n.uint32()));
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return L.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = ic();
		return t.type = e.type ?? 0, t.timestamp = e.timestamp ?? void 0, t.rawEvent = e.rawEvent ?? void 0, t;
	}
};
function ac() {
	return {
		baseEvent: void 0,
		messageId: "",
		role: void 0,
		name: void 0
	};
}
var oc = {
	encode(e, t = new P()) {
		return e.baseEvent !== void 0 && L.encode(e.baseEvent, t.uint32(10).fork()).join(), e.messageId !== "" && t.uint32(18).string(e.messageId), e.role !== void 0 && t.uint32(26).string(e.role), e.name !== void 0 && t.uint32(34).string(e.name), t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = ac();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 10) break;
					i.baseEvent = L.decode(n, n.uint32());
					continue;
				case 2:
					if (e !== 18) break;
					i.messageId = n.string();
					continue;
				case 3:
					if (e !== 26) break;
					i.role = n.string();
					continue;
				case 4:
					if (e !== 34) break;
					i.name = n.string();
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return oc.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = ac();
		return t.baseEvent = e.baseEvent !== void 0 && e.baseEvent !== null ? L.fromPartial(e.baseEvent) : void 0, t.messageId = e.messageId ?? "", t.role = e.role ?? void 0, t.name = e.name ?? void 0, t;
	}
};
function sc() {
	return {
		baseEvent: void 0,
		messageId: "",
		delta: ""
	};
}
var cc = {
	encode(e, t = new P()) {
		return e.baseEvent !== void 0 && L.encode(e.baseEvent, t.uint32(10).fork()).join(), e.messageId !== "" && t.uint32(18).string(e.messageId), e.delta !== "" && t.uint32(26).string(e.delta), t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = sc();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 10) break;
					i.baseEvent = L.decode(n, n.uint32());
					continue;
				case 2:
					if (e !== 18) break;
					i.messageId = n.string();
					continue;
				case 3:
					if (e !== 26) break;
					i.delta = n.string();
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return cc.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = sc();
		return t.baseEvent = e.baseEvent !== void 0 && e.baseEvent !== null ? L.fromPartial(e.baseEvent) : void 0, t.messageId = e.messageId ?? "", t.delta = e.delta ?? "", t;
	}
};
function lc() {
	return {
		baseEvent: void 0,
		messageId: ""
	};
}
var uc = {
	encode(e, t = new P()) {
		return e.baseEvent !== void 0 && L.encode(e.baseEvent, t.uint32(10).fork()).join(), e.messageId !== "" && t.uint32(18).string(e.messageId), t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = lc();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 10) break;
					i.baseEvent = L.decode(n, n.uint32());
					continue;
				case 2:
					if (e !== 18) break;
					i.messageId = n.string();
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return uc.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = lc();
		return t.baseEvent = e.baseEvent !== void 0 && e.baseEvent !== null ? L.fromPartial(e.baseEvent) : void 0, t.messageId = e.messageId ?? "", t;
	}
};
function dc() {
	return {
		baseEvent: void 0,
		toolCallId: "",
		toolCallName: "",
		parentMessageId: void 0
	};
}
var fc = {
	encode(e, t = new P()) {
		return e.baseEvent !== void 0 && L.encode(e.baseEvent, t.uint32(10).fork()).join(), e.toolCallId !== "" && t.uint32(18).string(e.toolCallId), e.toolCallName !== "" && t.uint32(26).string(e.toolCallName), e.parentMessageId !== void 0 && t.uint32(34).string(e.parentMessageId), t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = dc();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 10) break;
					i.baseEvent = L.decode(n, n.uint32());
					continue;
				case 2:
					if (e !== 18) break;
					i.toolCallId = n.string();
					continue;
				case 3:
					if (e !== 26) break;
					i.toolCallName = n.string();
					continue;
				case 4:
					if (e !== 34) break;
					i.parentMessageId = n.string();
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return fc.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = dc();
		return t.baseEvent = e.baseEvent !== void 0 && e.baseEvent !== null ? L.fromPartial(e.baseEvent) : void 0, t.toolCallId = e.toolCallId ?? "", t.toolCallName = e.toolCallName ?? "", t.parentMessageId = e.parentMessageId ?? void 0, t;
	}
};
function pc() {
	return {
		baseEvent: void 0,
		toolCallId: "",
		delta: ""
	};
}
var mc = {
	encode(e, t = new P()) {
		return e.baseEvent !== void 0 && L.encode(e.baseEvent, t.uint32(10).fork()).join(), e.toolCallId !== "" && t.uint32(18).string(e.toolCallId), e.delta !== "" && t.uint32(26).string(e.delta), t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = pc();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 10) break;
					i.baseEvent = L.decode(n, n.uint32());
					continue;
				case 2:
					if (e !== 18) break;
					i.toolCallId = n.string();
					continue;
				case 3:
					if (e !== 26) break;
					i.delta = n.string();
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return mc.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = pc();
		return t.baseEvent = e.baseEvent !== void 0 && e.baseEvent !== null ? L.fromPartial(e.baseEvent) : void 0, t.toolCallId = e.toolCallId ?? "", t.delta = e.delta ?? "", t;
	}
};
function hc() {
	return {
		baseEvent: void 0,
		toolCallId: ""
	};
}
var gc = {
	encode(e, t = new P()) {
		return e.baseEvent !== void 0 && L.encode(e.baseEvent, t.uint32(10).fork()).join(), e.toolCallId !== "" && t.uint32(18).string(e.toolCallId), t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = hc();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 10) break;
					i.baseEvent = L.decode(n, n.uint32());
					continue;
				case 2:
					if (e !== 18) break;
					i.toolCallId = n.string();
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return gc.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = hc();
		return t.baseEvent = e.baseEvent !== void 0 && e.baseEvent !== null ? L.fromPartial(e.baseEvent) : void 0, t.toolCallId = e.toolCallId ?? "", t;
	}
};
function _c() {
	return {
		baseEvent: void 0,
		snapshot: void 0
	};
}
var vc = {
	encode(e, t = new P()) {
		return e.baseEvent !== void 0 && L.encode(e.baseEvent, t.uint32(10).fork()).join(), e.snapshot !== void 0 && I.encode(I.wrap(e.snapshot), t.uint32(18).fork()).join(), t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = _c();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 10) break;
					i.baseEvent = L.decode(n, n.uint32());
					continue;
				case 2:
					if (e !== 18) break;
					i.snapshot = I.unwrap(I.decode(n, n.uint32()));
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return vc.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = _c();
		return t.baseEvent = e.baseEvent !== void 0 && e.baseEvent !== null ? L.fromPartial(e.baseEvent) : void 0, t.snapshot = e.snapshot ?? void 0, t;
	}
};
function yc() {
	return {
		baseEvent: void 0,
		delta: []
	};
}
var bc = {
	encode(e, t = new P()) {
		e.baseEvent !== void 0 && L.encode(e.baseEvent, t.uint32(10).fork()).join();
		for (let n of e.delta) Ms.encode(n, t.uint32(18).fork()).join();
		return t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = yc();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 10) break;
					i.baseEvent = L.decode(n, n.uint32());
					continue;
				case 2:
					if (e !== 18) break;
					i.delta.push(Ms.decode(n, n.uint32()));
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return bc.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = yc();
		return t.baseEvent = e.baseEvent !== void 0 && e.baseEvent !== null ? L.fromPartial(e.baseEvent) : void 0, t.delta = e.delta?.map((e) => Ms.fromPartial(e)) || [], t;
	}
};
function xc() {
	return {
		baseEvent: void 0,
		messages: []
	};
}
var Sc = {
	encode(e, t = new P()) {
		e.baseEvent !== void 0 && L.encode(e.baseEvent, t.uint32(10).fork()).join();
		for (let n of e.messages) nc.encode(n, t.uint32(18).fork()).join();
		return t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = xc();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 10) break;
					i.baseEvent = L.decode(n, n.uint32());
					continue;
				case 2:
					if (e !== 18) break;
					i.messages.push(nc.decode(n, n.uint32()));
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return Sc.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = xc();
		return t.baseEvent = e.baseEvent !== void 0 && e.baseEvent !== null ? L.fromPartial(e.baseEvent) : void 0, t.messages = e.messages?.map((e) => nc.fromPartial(e)) || [], t;
	}
};
function Cc() {
	return {
		baseEvent: void 0,
		event: void 0,
		source: void 0
	};
}
var wc = {
	encode(e, t = new P()) {
		return e.baseEvent !== void 0 && L.encode(e.baseEvent, t.uint32(10).fork()).join(), e.event !== void 0 && I.encode(I.wrap(e.event), t.uint32(18).fork()).join(), e.source !== void 0 && t.uint32(26).string(e.source), t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = Cc();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 10) break;
					i.baseEvent = L.decode(n, n.uint32());
					continue;
				case 2:
					if (e !== 18) break;
					i.event = I.unwrap(I.decode(n, n.uint32()));
					continue;
				case 3:
					if (e !== 26) break;
					i.source = n.string();
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return wc.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = Cc();
		return t.baseEvent = e.baseEvent !== void 0 && e.baseEvent !== null ? L.fromPartial(e.baseEvent) : void 0, t.event = e.event ?? void 0, t.source = e.source ?? void 0, t;
	}
};
function Tc() {
	return {
		baseEvent: void 0,
		name: "",
		value: void 0
	};
}
var Ec = {
	encode(e, t = new P()) {
		return e.baseEvent !== void 0 && L.encode(e.baseEvent, t.uint32(10).fork()).join(), e.name !== "" && t.uint32(18).string(e.name), e.value !== void 0 && I.encode(I.wrap(e.value), t.uint32(26).fork()).join(), t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = Tc();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 10) break;
					i.baseEvent = L.decode(n, n.uint32());
					continue;
				case 2:
					if (e !== 18) break;
					i.name = n.string();
					continue;
				case 3:
					if (e !== 26) break;
					i.value = I.unwrap(I.decode(n, n.uint32()));
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return Ec.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = Tc();
		return t.baseEvent = e.baseEvent !== void 0 && e.baseEvent !== null ? L.fromPartial(e.baseEvent) : void 0, t.name = e.name ?? "", t.value = e.value ?? void 0, t;
	}
};
function Dc() {
	return {
		baseEvent: void 0,
		threadId: "",
		runId: ""
	};
}
var Oc = {
	encode(e, t = new P()) {
		return e.baseEvent !== void 0 && L.encode(e.baseEvent, t.uint32(10).fork()).join(), e.threadId !== "" && t.uint32(18).string(e.threadId), e.runId !== "" && t.uint32(26).string(e.runId), t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = Dc();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 10) break;
					i.baseEvent = L.decode(n, n.uint32());
					continue;
				case 2:
					if (e !== 18) break;
					i.threadId = n.string();
					continue;
				case 3:
					if (e !== 26) break;
					i.runId = n.string();
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return Oc.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = Dc();
		return t.baseEvent = e.baseEvent !== void 0 && e.baseEvent !== null ? L.fromPartial(e.baseEvent) : void 0, t.threadId = e.threadId ?? "", t.runId = e.runId ?? "", t;
	}
};
function kc() {
	return {
		baseEvent: void 0,
		threadId: "",
		runId: "",
		result: void 0
	};
}
var Ac = {
	encode(e, t = new P()) {
		return e.baseEvent !== void 0 && L.encode(e.baseEvent, t.uint32(10).fork()).join(), e.threadId !== "" && t.uint32(18).string(e.threadId), e.runId !== "" && t.uint32(26).string(e.runId), e.result !== void 0 && I.encode(I.wrap(e.result), t.uint32(34).fork()).join(), t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = kc();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 10) break;
					i.baseEvent = L.decode(n, n.uint32());
					continue;
				case 2:
					if (e !== 18) break;
					i.threadId = n.string();
					continue;
				case 3:
					if (e !== 26) break;
					i.runId = n.string();
					continue;
				case 4:
					if (e !== 34) break;
					i.result = I.unwrap(I.decode(n, n.uint32()));
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return Ac.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = kc();
		return t.baseEvent = e.baseEvent !== void 0 && e.baseEvent !== null ? L.fromPartial(e.baseEvent) : void 0, t.threadId = e.threadId ?? "", t.runId = e.runId ?? "", t.result = e.result ?? void 0, t;
	}
};
function jc() {
	return {
		baseEvent: void 0,
		code: void 0,
		message: ""
	};
}
var Mc = {
	encode(e, t = new P()) {
		return e.baseEvent !== void 0 && L.encode(e.baseEvent, t.uint32(10).fork()).join(), e.code !== void 0 && t.uint32(18).string(e.code), e.message !== "" && t.uint32(26).string(e.message), t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = jc();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 10) break;
					i.baseEvent = L.decode(n, n.uint32());
					continue;
				case 2:
					if (e !== 18) break;
					i.code = n.string();
					continue;
				case 3:
					if (e !== 26) break;
					i.message = n.string();
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return Mc.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = jc();
		return t.baseEvent = e.baseEvent !== void 0 && e.baseEvent !== null ? L.fromPartial(e.baseEvent) : void 0, t.code = e.code ?? void 0, t.message = e.message ?? "", t;
	}
};
function Nc() {
	return {
		baseEvent: void 0,
		stepName: ""
	};
}
var Pc = {
	encode(e, t = new P()) {
		return e.baseEvent !== void 0 && L.encode(e.baseEvent, t.uint32(10).fork()).join(), e.stepName !== "" && t.uint32(18).string(e.stepName), t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = Nc();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 10) break;
					i.baseEvent = L.decode(n, n.uint32());
					continue;
				case 2:
					if (e !== 18) break;
					i.stepName = n.string();
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return Pc.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = Nc();
		return t.baseEvent = e.baseEvent !== void 0 && e.baseEvent !== null ? L.fromPartial(e.baseEvent) : void 0, t.stepName = e.stepName ?? "", t;
	}
};
function Fc() {
	return {
		baseEvent: void 0,
		stepName: ""
	};
}
var Ic = {
	encode(e, t = new P()) {
		return e.baseEvent !== void 0 && L.encode(e.baseEvent, t.uint32(10).fork()).join(), e.stepName !== "" && t.uint32(18).string(e.stepName), t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = Fc();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 10) break;
					i.baseEvent = L.decode(n, n.uint32());
					continue;
				case 2:
					if (e !== 18) break;
					i.stepName = n.string();
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return Ic.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = Fc();
		return t.baseEvent = e.baseEvent !== void 0 && e.baseEvent !== null ? L.fromPartial(e.baseEvent) : void 0, t.stepName = e.stepName ?? "", t;
	}
};
function Lc() {
	return {
		baseEvent: void 0,
		messageId: void 0,
		role: void 0,
		delta: void 0,
		name: void 0
	};
}
var Rc = {
	encode(e, t = new P()) {
		return e.baseEvent !== void 0 && L.encode(e.baseEvent, t.uint32(10).fork()).join(), e.messageId !== void 0 && t.uint32(18).string(e.messageId), e.role !== void 0 && t.uint32(26).string(e.role), e.delta !== void 0 && t.uint32(34).string(e.delta), e.name !== void 0 && t.uint32(42).string(e.name), t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = Lc();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 10) break;
					i.baseEvent = L.decode(n, n.uint32());
					continue;
				case 2:
					if (e !== 18) break;
					i.messageId = n.string();
					continue;
				case 3:
					if (e !== 26) break;
					i.role = n.string();
					continue;
				case 4:
					if (e !== 34) break;
					i.delta = n.string();
					continue;
				case 5:
					if (e !== 42) break;
					i.name = n.string();
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return Rc.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = Lc();
		return t.baseEvent = e.baseEvent !== void 0 && e.baseEvent !== null ? L.fromPartial(e.baseEvent) : void 0, t.messageId = e.messageId ?? void 0, t.role = e.role ?? void 0, t.delta = e.delta ?? void 0, t.name = e.name ?? void 0, t;
	}
};
function zc() {
	return {
		baseEvent: void 0,
		toolCallId: void 0,
		toolCallName: void 0,
		parentMessageId: void 0,
		delta: void 0
	};
}
var Bc = {
	encode(e, t = new P()) {
		return e.baseEvent !== void 0 && L.encode(e.baseEvent, t.uint32(10).fork()).join(), e.toolCallId !== void 0 && t.uint32(18).string(e.toolCallId), e.toolCallName !== void 0 && t.uint32(26).string(e.toolCallName), e.parentMessageId !== void 0 && t.uint32(34).string(e.parentMessageId), e.delta !== void 0 && t.uint32(42).string(e.delta), t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = zc();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 10) break;
					i.baseEvent = L.decode(n, n.uint32());
					continue;
				case 2:
					if (e !== 18) break;
					i.toolCallId = n.string();
					continue;
				case 3:
					if (e !== 26) break;
					i.toolCallName = n.string();
					continue;
				case 4:
					if (e !== 34) break;
					i.parentMessageId = n.string();
					continue;
				case 5:
					if (e !== 42) break;
					i.delta = n.string();
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return Bc.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = zc();
		return t.baseEvent = e.baseEvent !== void 0 && e.baseEvent !== null ? L.fromPartial(e.baseEvent) : void 0, t.toolCallId = e.toolCallId ?? void 0, t.toolCallName = e.toolCallName ?? void 0, t.parentMessageId = e.parentMessageId ?? void 0, t.delta = e.delta ?? void 0, t;
	}
};
function Vc() {
	return {
		textMessageStart: void 0,
		textMessageContent: void 0,
		textMessageEnd: void 0,
		toolCallStart: void 0,
		toolCallArgs: void 0,
		toolCallEnd: void 0,
		stateSnapshot: void 0,
		stateDelta: void 0,
		messagesSnapshot: void 0,
		raw: void 0,
		custom: void 0,
		runStarted: void 0,
		runFinished: void 0,
		runError: void 0,
		stepStarted: void 0,
		stepFinished: void 0,
		textMessageChunk: void 0,
		toolCallChunk: void 0
	};
}
var Hc = {
	encode(e, t = new P()) {
		return e.textMessageStart !== void 0 && oc.encode(e.textMessageStart, t.uint32(10).fork()).join(), e.textMessageContent !== void 0 && cc.encode(e.textMessageContent, t.uint32(18).fork()).join(), e.textMessageEnd !== void 0 && uc.encode(e.textMessageEnd, t.uint32(26).fork()).join(), e.toolCallStart !== void 0 && fc.encode(e.toolCallStart, t.uint32(34).fork()).join(), e.toolCallArgs !== void 0 && mc.encode(e.toolCallArgs, t.uint32(42).fork()).join(), e.toolCallEnd !== void 0 && gc.encode(e.toolCallEnd, t.uint32(50).fork()).join(), e.stateSnapshot !== void 0 && vc.encode(e.stateSnapshot, t.uint32(58).fork()).join(), e.stateDelta !== void 0 && bc.encode(e.stateDelta, t.uint32(66).fork()).join(), e.messagesSnapshot !== void 0 && Sc.encode(e.messagesSnapshot, t.uint32(74).fork()).join(), e.raw !== void 0 && wc.encode(e.raw, t.uint32(82).fork()).join(), e.custom !== void 0 && Ec.encode(e.custom, t.uint32(90).fork()).join(), e.runStarted !== void 0 && Oc.encode(e.runStarted, t.uint32(98).fork()).join(), e.runFinished !== void 0 && Ac.encode(e.runFinished, t.uint32(106).fork()).join(), e.runError !== void 0 && Mc.encode(e.runError, t.uint32(114).fork()).join(), e.stepStarted !== void 0 && Pc.encode(e.stepStarted, t.uint32(122).fork()).join(), e.stepFinished !== void 0 && Ic.encode(e.stepFinished, t.uint32(130).fork()).join(), e.textMessageChunk !== void 0 && Rc.encode(e.textMessageChunk, t.uint32(138).fork()).join(), e.toolCallChunk !== void 0 && Bc.encode(e.toolCallChunk, t.uint32(146).fork()).join(), t;
	},
	decode(e, t) {
		let n = e instanceof F ? e : new F(e), r = t === void 0 ? n.len : n.pos + t, i = Vc();
		for (; n.pos < r;) {
			let e = n.uint32();
			switch (e >>> 3) {
				case 1:
					if (e !== 10) break;
					i.textMessageStart = oc.decode(n, n.uint32());
					continue;
				case 2:
					if (e !== 18) break;
					i.textMessageContent = cc.decode(n, n.uint32());
					continue;
				case 3:
					if (e !== 26) break;
					i.textMessageEnd = uc.decode(n, n.uint32());
					continue;
				case 4:
					if (e !== 34) break;
					i.toolCallStart = fc.decode(n, n.uint32());
					continue;
				case 5:
					if (e !== 42) break;
					i.toolCallArgs = mc.decode(n, n.uint32());
					continue;
				case 6:
					if (e !== 50) break;
					i.toolCallEnd = gc.decode(n, n.uint32());
					continue;
				case 7:
					if (e !== 58) break;
					i.stateSnapshot = vc.decode(n, n.uint32());
					continue;
				case 8:
					if (e !== 66) break;
					i.stateDelta = bc.decode(n, n.uint32());
					continue;
				case 9:
					if (e !== 74) break;
					i.messagesSnapshot = Sc.decode(n, n.uint32());
					continue;
				case 10:
					if (e !== 82) break;
					i.raw = wc.decode(n, n.uint32());
					continue;
				case 11:
					if (e !== 90) break;
					i.custom = Ec.decode(n, n.uint32());
					continue;
				case 12:
					if (e !== 98) break;
					i.runStarted = Oc.decode(n, n.uint32());
					continue;
				case 13:
					if (e !== 106) break;
					i.runFinished = Ac.decode(n, n.uint32());
					continue;
				case 14:
					if (e !== 114) break;
					i.runError = Mc.decode(n, n.uint32());
					continue;
				case 15:
					if (e !== 122) break;
					i.stepStarted = Pc.decode(n, n.uint32());
					continue;
				case 16:
					if (e !== 130) break;
					i.stepFinished = Ic.decode(n, n.uint32());
					continue;
				case 17:
					if (e !== 138) break;
					i.textMessageChunk = Rc.decode(n, n.uint32());
					continue;
				case 18:
					if (e !== 146) break;
					i.toolCallChunk = Bc.decode(n, n.uint32());
					continue;
			}
			if ((e & 7) == 4 || e === 0) break;
			n.skip(e & 7);
		}
		return i;
	},
	create(e) {
		return Hc.fromPartial(e ?? {});
	},
	fromPartial(e) {
		let t = Vc();
		return t.textMessageStart = e.textMessageStart !== void 0 && e.textMessageStart !== null ? oc.fromPartial(e.textMessageStart) : void 0, t.textMessageContent = e.textMessageContent !== void 0 && e.textMessageContent !== null ? cc.fromPartial(e.textMessageContent) : void 0, t.textMessageEnd = e.textMessageEnd !== void 0 && e.textMessageEnd !== null ? uc.fromPartial(e.textMessageEnd) : void 0, t.toolCallStart = e.toolCallStart !== void 0 && e.toolCallStart !== null ? fc.fromPartial(e.toolCallStart) : void 0, t.toolCallArgs = e.toolCallArgs !== void 0 && e.toolCallArgs !== null ? mc.fromPartial(e.toolCallArgs) : void 0, t.toolCallEnd = e.toolCallEnd !== void 0 && e.toolCallEnd !== null ? gc.fromPartial(e.toolCallEnd) : void 0, t.stateSnapshot = e.stateSnapshot !== void 0 && e.stateSnapshot !== null ? vc.fromPartial(e.stateSnapshot) : void 0, t.stateDelta = e.stateDelta !== void 0 && e.stateDelta !== null ? bc.fromPartial(e.stateDelta) : void 0, t.messagesSnapshot = e.messagesSnapshot !== void 0 && e.messagesSnapshot !== null ? Sc.fromPartial(e.messagesSnapshot) : void 0, t.raw = e.raw !== void 0 && e.raw !== null ? wc.fromPartial(e.raw) : void 0, t.custom = e.custom !== void 0 && e.custom !== null ? Ec.fromPartial(e.custom) : void 0, t.runStarted = e.runStarted !== void 0 && e.runStarted !== null ? Oc.fromPartial(e.runStarted) : void 0, t.runFinished = e.runFinished !== void 0 && e.runFinished !== null ? Ac.fromPartial(e.runFinished) : void 0, t.runError = e.runError !== void 0 && e.runError !== null ? Mc.fromPartial(e.runError) : void 0, t.stepStarted = e.stepStarted !== void 0 && e.stepStarted !== null ? Pc.fromPartial(e.stepStarted) : void 0, t.stepFinished = e.stepFinished !== void 0 && e.stepFinished !== null ? Ic.fromPartial(e.stepFinished) : void 0, t.textMessageChunk = e.textMessageChunk !== void 0 && e.textMessageChunk !== null ? Rc.fromPartial(e.textMessageChunk) : void 0, t.toolCallChunk = e.toolCallChunk !== void 0 && e.toolCallChunk !== null ? Bc.fromPartial(e.toolCallChunk) : void 0, t;
	}
};
function Uc(e) {
	let t = globalThis.Number(e.toString());
	if (t > globalThis.Number.MAX_SAFE_INTEGER) throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
	if (t < globalThis.Number.MIN_SAFE_INTEGER) throw new globalThis.Error("Value is smaller than Number.MIN_SAFE_INTEGER");
	return t;
}
var Wc = (e) => {
	if (!(!e || typeof e != "object")) {
		if (e.data) return {
			type: "data",
			value: e.data.value,
			mimeType: e.data.mimeType
		};
		if (e.url) return {
			type: "url",
			value: e.url.value,
			mimeType: e.url.mimeType
		};
	}
}, Gc = (e) => {
	if (!(!e || typeof e != "object")) {
		if (e.text) return {
			type: "text",
			text: e.text.text
		};
		if (e.image) return {
			type: "image",
			source: Wc(e.image.source),
			metadata: e.image.metadata
		};
		if (e.audio) return {
			type: "audio",
			source: Wc(e.audio.source),
			metadata: e.audio.metadata
		};
		if (e.video) return {
			type: "video",
			source: Wc(e.video.source),
			metadata: e.video.metadata
		};
		if (e.document) return {
			type: "document",
			source: Wc(e.document.source),
			metadata: e.document.metadata
		};
	}
};
function Kc(e) {
	let t = Hc.decode(e), n = Object.values(t).find((e) => e !== void 0);
	if (!n) throw Error("Invalid event");
	if (n.type = rc[n.baseEvent.type], n.timestamp = n.baseEvent.timestamp, n.rawEvent = n.baseEvent.rawEvent, n.type === O.MESSAGES_SNAPSHOT) for (let e of n.messages) {
		let t = e;
		if (t.role === "user" && Array.isArray(t.contentParts)) {
			let e = t.contentParts.map((e) => Gc(e)).filter((e) => e !== void 0);
			e.length > 0 && (t.content = e);
		}
		Array.isArray(t.contentParts) && t.contentParts.length === 0 && (t.contentParts = void 0), t.toolCalls?.length === 0 && (t.toolCalls = void 0);
	}
	if (n.type === O.STATE_DELTA) for (let e of n.delta) e.op = As[e.op].toLowerCase(), Object.keys(e).forEach((t) => {
		e[t] === void 0 && delete e[t];
	});
	return Object.keys(n).forEach((e) => {
		n[e] === void 0 && delete n[e];
	}), Ar.parse(n);
}
//#endregion
//#region node_modules/.pnpm/compare-versions@6.1.1/node_modules/compare-versions/lib/esm/utils.js
var qc = /^[v^~<>=]*?(\d+)(?:\.([x*]|\d+)(?:\.([x*]|\d+)(?:\.([x*]|\d+))?(?:-([\da-z\-]+(?:\.[\da-z\-]+)*))?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?)?)?$/i, Jc = (e) => {
	if (typeof e != "string") throw TypeError("Invalid argument expected string");
	let t = e.match(qc);
	if (!t) throw Error(`Invalid argument not valid semver ('${e}' received)`);
	return t.shift(), t;
}, Yc = (e) => e === "*" || e === "x" || e === "X", Xc = (e) => {
	let t = parseInt(e, 10);
	return isNaN(t) ? e : t;
}, Zc = (e, t) => typeof e == typeof t ? [e, t] : [String(e), String(t)], Qc = (e, t) => {
	if (Yc(e) || Yc(t)) return 0;
	let [n, r] = Zc(Xc(e), Xc(t));
	return n > r ? 1 : n < r ? -1 : 0;
}, $c = (e, t) => {
	for (let n = 0; n < Math.max(e.length, t.length); n++) {
		let r = Qc(e[n] || "0", t[n] || "0");
		if (r !== 0) return r;
	}
	return 0;
}, el = (e, t) => {
	let n = Jc(e), r = Jc(t), i = n.pop(), a = r.pop(), o = $c(n, r);
	return o === 0 ? i && a ? $c(i.split("."), a.split(".")) : i || a ? i ? -1 : 1 : 0 : o;
}, R = (e) => {
	if (typeof structuredClone == "function") return structuredClone(e);
	try {
		return JSON.parse(JSON.stringify(e));
	} catch {
		return Array.isArray(e) ? [...e] : { ...e };
	}
};
function tl() {
	return Pe();
}
function nl(e) {
	if (Object.freeze(e), typeof e == "object" && e) for (let t of Object.values(e)) typeof t == "object" && t && !Object.isFrozen(t) && nl(t);
	return e;
}
async function z(e, t, n, r) {
	let i = typeof process < "u" && process.env !== void 0, a = i && !!process.env.VITEST_WORKER_ID, o = i && !!process.env.VITEST_WORKER_ID, s = R(t), c = R(n), l = s, u = c, d;
	for (let t of e) try {
		o && (nl(l), nl(u));
		let e = await r(t, l, u);
		if (e === void 0) continue;
		if (e.messages !== void 0 && e.messages !== l && (l = R(e.messages)), e.state !== void 0 && e.state !== u && (u = R(e.state)), d = e.stopPropagation, d === !0) break;
	} catch (e) {
		if (o && e instanceof TypeError) {
			if (a) throw e;
			console.error("AG-UI: Subscriber attempted to mutate frozen inputs in-place. Return mutations via AgentStateMutation instead of mutating directly.", e);
		} else a || console.error("Subscriber error:", e);
		continue;
	}
	return {
		...l === s ? {} : { messages: o && Object.isFrozen(l) ? R(l) : l },
		...u === c ? {} : { state: o && Object.isFrozen(u) ? R(u) : u },
		...d === void 0 ? {} : { stopPropagation: d }
	};
}
function rl(e) {
	if (!e) return {
		enabled: !1,
		events: !1,
		lifecycle: !1,
		verbose: !1
	};
	if (e === !0) return {
		enabled: !0,
		events: !0,
		lifecycle: !0,
		verbose: !0
	};
	let t = e.events ?? !0, n = e.lifecycle ?? !0, r = e.verbose ?? !1;
	return {
		enabled: t || n,
		events: t,
		lifecycle: n,
		verbose: r
	};
}
function il(e) {
	if (e instanceof al) return e;
	if (e === !0) return new al(rl(!0));
}
var al = class {
	constructor(e) {
		this.config = e;
	}
	event(e, t, n, r) {
		this.config.events && (this.config.verbose ? console.debug(`[${e}] ${t}`, typeof n == "string" ? n : JSON.stringify(n)) : console.debug(`[${e}] ${t}`, r ?? n));
	}
	lifecycle(e, t, n) {
		this.config.lifecycle && (n ? console.debug(`[${e}] ${t}`, n) : console.debug(`[${e}] ${t}`));
	}
	get eventsEnabled() {
		return this.config.events;
	}
	get lifecycleEnabled() {
		return this.config.lifecycle;
	}
	get enabled() {
		return this.config.enabled;
	}
};
function ol(e) {
	return e.enabled ? new al(e) : void 0;
}
function sl(e, t, n) {
	if (t) {
		let r = e.find((e) => e.id === t);
		if (r?.role === "assistant") return r;
		r && console.warn(`TOOL_CALL_START: parentMessageId '${t}' matches a '${r.role}' message, not assistant — falling back to toolCallId`);
		let i = {
			id: r ? n : t,
			role: "assistant",
			toolCalls: []
		};
		return e.push(i), i;
	}
	let r = {
		id: n,
		role: "assistant",
		toolCalls: []
	};
	return e.push(r), r;
}
var cl = (e, t, n, r, i) => {
	let a = il(i), o = R(n.messages), s = R(e.state), c = {}, l = (e) => {
		e.messages !== void 0 && (o = e.messages, c.messages = e.messages), e.state !== void 0 && (s = e.state, c.state = e.state);
	}, u = () => {
		let e = R(c);
		return c = {}, e.messages !== void 0 || e.state !== void 0 ? M(e) : ja;
	};
	return t.pipe(Fo(async (t) => {
		let i = await z(r, o, s, (r, i, a) => r.onEvent?.({
			event: t,
			agent: n,
			input: e,
			messages: i,
			state: a
		}));
		if (l(i), i.stopPropagation === !0 ? a?.event("APPLY", "Event dropped:", t, {
			type: t.type,
			reason: "stopPropagation by subscriber"
		}) : a?.event("APPLY", "Event applied:", t, {
			type: t.type,
			subscribers: r.length
		}), i.stopPropagation === !0) return u();
		switch (t.type) {
			case O.TEXT_MESSAGE_START: {
				let i = await z(r, o, s, (r, i, a) => r.onTextMessageStartEvent?.({
					event: t,
					messages: i,
					state: a,
					agent: n,
					input: e
				}));
				if (l(i), i.stopPropagation !== !0) {
					let { messageId: e, role: n = "assistant", name: r } = t;
					if (!o.find((t) => t.id === e)) {
						let t = {
							id: e,
							role: n,
							content: "",
							...r !== void 0 && { name: r }
						};
						o.push(t), l({ messages: o });
					}
				}
				return u();
			}
			case O.TEXT_MESSAGE_CONTENT: {
				let { messageId: i, delta: a } = t, c = o.find((e) => e.id === i);
				if (!c) return console.warn(`TEXT_MESSAGE_CONTENT: No message found with ID '${i}'`), u();
				let d = await z(r, o, s, (r, i, a) => r.onTextMessageContentEvent?.({
					event: t,
					messages: i,
					state: a,
					agent: n,
					input: e,
					textMessageBuffer: typeof c.content == "string" ? c.content : ""
				}));
				return l(d), d.stopPropagation !== !0 && (c.content = `${typeof c.content == "string" ? c.content : ""}${a}`, l({ messages: o })), u();
			}
			case O.TEXT_MESSAGE_END: {
				let { messageId: i } = t, a = o.find((e) => e.id === i);
				return a ? (l(await z(r, o, s, (r, i, o) => r.onTextMessageEndEvent?.({
					event: t,
					messages: i,
					state: o,
					agent: n,
					input: e,
					textMessageBuffer: typeof a.content == "string" ? a.content : ""
				}))), await Promise.all(r.map((t) => {
					t.onNewMessage?.({
						message: a,
						messages: o,
						state: s,
						agent: n,
						input: e
					});
				})), u()) : (console.warn(`TEXT_MESSAGE_END: No message found with ID '${i}'`), u());
			}
			case O.TOOL_CALL_START: {
				let i = await z(r, o, s, (r, i, a) => r.onToolCallStartEvent?.({
					event: t,
					messages: i,
					state: a,
					agent: n,
					input: e
				}));
				if (l(i), i.stopPropagation !== !0) {
					let { toolCallId: e, toolCallName: n, parentMessageId: r } = t, i = sl(o, r, e);
					i.toolCalls ??= [], i.toolCalls.push({
						id: e,
						type: "function",
						function: {
							name: n,
							arguments: ""
						}
					}), l({ messages: o });
				}
				return u();
			}
			case O.TOOL_CALL_ARGS: {
				let { toolCallId: i, delta: a } = t, c = o.find((e) => e.toolCalls?.some((e) => e.id === i));
				if (!c) return console.warn(`TOOL_CALL_ARGS: No message found containing tool call with ID '${i}'`), u();
				let d = c.toolCalls?.find((e) => e.id === i);
				if (!d) return console.warn(`TOOL_CALL_ARGS: No tool call found with ID '${i}'`), u();
				let f = await z(r, o, s, (r, i, a) => {
					let o = d.function.arguments, s = d.function.name, c = {};
					try {
						c = $o(o);
					} catch {}
					return r.onToolCallArgsEvent?.({
						event: t,
						messages: i,
						state: a,
						agent: n,
						input: e,
						toolCallBuffer: o,
						toolCallName: s,
						partialToolCallArgs: c
					});
				});
				return l(f), f.stopPropagation !== !0 && (d.function.arguments += a, l({ messages: o })), u();
			}
			case O.TOOL_CALL_END: {
				let { toolCallId: i } = t, a = o.find((e) => e.toolCalls?.some((e) => e.id === i));
				if (!a) return console.warn(`TOOL_CALL_END: No message found containing tool call with ID '${i}'`), u();
				let c = a.toolCalls?.find((e) => e.id === i);
				return c ? (l(await z(r, o, s, (r, i, a) => {
					let o = c.function.arguments, s = c.function.name, l = {};
					try {
						l = JSON.parse(o);
					} catch {}
					return r.onToolCallEndEvent?.({
						event: t,
						messages: i,
						state: a,
						agent: n,
						input: e,
						toolCallName: s,
						toolCallArgs: l
					});
				})), await Promise.all(r.map((t) => {
					t.onNewToolCall?.({
						toolCall: c,
						messages: o,
						state: s,
						agent: n,
						input: e
					});
				})), u()) : (console.warn(`TOOL_CALL_END: No tool call found with ID '${i}'`), u());
			}
			case O.TOOL_CALL_RESULT: {
				let i = await z(r, o, s, (r, i, a) => r.onToolCallResultEvent?.({
					event: t,
					messages: i,
					state: a,
					agent: n,
					input: e
				}));
				if (l(i), i.stopPropagation !== !0) {
					let { messageId: i, toolCallId: a, content: c, role: u } = t, d = {
						id: i,
						toolCallId: a,
						role: u || "tool",
						content: c
					};
					o.push(d), await Promise.all(r.map((t) => {
						t.onNewMessage?.({
							message: d,
							messages: o,
							state: s,
							agent: n,
							input: e
						});
					})), l({ messages: o });
				}
				return u();
			}
			case O.STATE_SNAPSHOT: {
				let i = await z(r, o, s, (r, i, a) => r.onStateSnapshotEvent?.({
					event: t,
					messages: i,
					state: a,
					agent: n,
					input: e
				}));
				if (l(i), i.stopPropagation !== !0) {
					let { snapshot: e } = t;
					s = e, l({ state: s });
				}
				return u();
			}
			case O.STATE_DELTA: {
				let i = await z(r, o, s, (r, i, a) => r.onStateDeltaEvent?.({
					event: t,
					messages: i,
					state: a,
					agent: n,
					input: e
				}));
				if (l(i), i.stopPropagation !== !0) {
					let { delta: e } = t;
					try {
						s = di.applyPatch(s, e, !0, !1).newDocument, l({ state: s });
					} catch (t) {
						let n = t instanceof Error ? t.message : String(t);
						console.warn(`Failed to apply state patch:\nCurrent state: ${JSON.stringify(s, null, 2)}\nPatch operations: ${JSON.stringify(e, null, 2)}\nError: ${n}`);
					}
				}
				return u();
			}
			case O.MESSAGES_SNAPSHOT: {
				let i = await z(r, o, s, (r, i, a) => r.onMessagesSnapshotEvent?.({
					event: t,
					messages: i,
					state: a,
					agent: n,
					input: e
				}));
				if (l(i), i.stopPropagation !== !0) {
					let { messages: e } = t, n = new Map(e.map((e) => [e.id, e])), r = (e) => e === "activity" || e === "reasoning";
					o = o.filter((e) => r(e.role) || n.has(e.id)).map((e) => r(e.role) ? e : n.get(e.id));
					let i = new Set(o.map((e) => e.id));
					for (let t of e) i.has(t.id) || o.push(t);
					l({ messages: o });
				}
				return u();
			}
			case O.ACTIVITY_SNAPSHOT: {
				let i = t, a = o.findIndex((e) => e.id === i.messageId), c = a >= 0 ? o[a] : void 0, d = c?.role === "activity" ? c : void 0, f = i.replace ?? !0, ee = await z(r, o, s, (t, r, a) => t.onActivitySnapshotEvent?.({
					event: i,
					messages: r,
					state: a,
					agent: n,
					input: e,
					activityMessage: d,
					existingMessage: c
				}));
				if (l(ee), ee.stopPropagation !== !0) {
					let t = {
						id: i.messageId,
						role: "activity",
						activityType: i.activityType,
						content: R(i.content)
					}, c;
					a === -1 ? (o.push(t), c = t) : d ? f && (o[a] = {
						...d,
						activityType: i.activityType,
						content: R(i.content)
					}) : f && (o[a] = t, c = t), l({ messages: o }), c && await Promise.all(r.map((t) => t.onNewMessage?.({
						message: c,
						messages: o,
						state: s,
						agent: n,
						input: e
					})));
				}
				return u();
			}
			case O.ACTIVITY_DELTA: {
				let i = t, a = o.findIndex((e) => e.id === i.messageId);
				if (a === -1) return u();
				let c = o[a];
				if (c.role !== "activity") return console.warn(`ACTIVITY_DELTA: Message '${i.messageId}' is not an activity message`), u();
				let d = c, f = await z(r, o, s, (t, r, a) => t.onActivityDeltaEvent?.({
					event: i,
					messages: r,
					state: a,
					agent: n,
					input: e,
					activityMessage: d
				}));
				if (l(f), f.stopPropagation !== !0) try {
					let e = R(d.content ?? {}), t = di.applyPatch(e, i.patch ?? [], !0, !1).newDocument;
					o[a] = {
						...d,
						content: R(t),
						activityType: i.activityType
					}, l({ messages: o });
				} catch (e) {
					let t = e instanceof Error ? e.message : String(e);
					console.warn(`Failed to apply activity patch for '${i.messageId}': ${t}`);
				}
				return u();
			}
			case O.RAW: return l(await z(r, o, s, (r, i, a) => r.onRawEvent?.({
				event: t,
				messages: i,
				state: a,
				agent: n,
				input: e
			}))), u();
			case O.CUSTOM: return l(await z(r, o, s, (r, i, a) => r.onCustomEvent?.({
				event: t,
				messages: i,
				state: a,
				agent: n,
				input: e
			}))), u();
			case O.RUN_STARTED: {
				let i = await z(r, o, s, (r, i, a) => r.onRunStartedEvent?.({
					event: t,
					messages: i,
					state: a,
					agent: n,
					input: e
				}));
				if (l(i), i.stopPropagation !== !0) {
					let e = t;
					if (e.input?.messages) {
						for (let t of e.input.messages) o.find((e) => e.id === t.id) || o.push(t);
						l({ messages: o });
					}
				}
				return u();
			}
			case O.RUN_FINISHED: return l(await z(r, o, s, (r, i, a) => r.onRunFinishedEvent?.({
				event: t,
				messages: i,
				state: a,
				agent: n,
				input: e,
				result: t.result
			}))), u();
			case O.RUN_ERROR: return l(await z(r, o, s, (r, i, a) => r.onRunErrorEvent?.({
				event: t,
				messages: i,
				state: a,
				agent: n,
				input: e
			}))), u();
			case O.STEP_STARTED: return l(await z(r, o, s, (r, i, a) => r.onStepStartedEvent?.({
				event: t,
				messages: i,
				state: a,
				agent: n,
				input: e
			}))), u();
			case O.STEP_FINISHED: return l(await z(r, o, s, (r, i, a) => r.onStepFinishedEvent?.({
				event: t,
				messages: i,
				state: a,
				agent: n,
				input: e
			}))), u();
			case O.TEXT_MESSAGE_CHUNK: throw Error("TEXT_MESSAGE_CHUNK must be tranformed before being applied");
			case O.TOOL_CALL_CHUNK: throw Error("TOOL_CALL_CHUNK must be tranformed before being applied");
			case O.THINKING_START: return u();
			case O.THINKING_END: return u();
			case O.THINKING_TEXT_MESSAGE_START: return u();
			case O.THINKING_TEXT_MESSAGE_CONTENT: return u();
			case O.THINKING_TEXT_MESSAGE_END: return u();
			case O.REASONING_START: return l(await z(r, o, s, (r, i, a) => r.onReasoningStartEvent?.({
				event: t,
				messages: i,
				state: a,
				agent: n,
				input: e
			}))), u();
			case O.REASONING_MESSAGE_START: {
				let i = await z(r, o, s, (r, i, a) => r.onReasoningMessageStartEvent?.({
					event: t,
					messages: i,
					state: a,
					agent: n,
					input: e
				}));
				if (l(i), i.stopPropagation !== !0) {
					let { messageId: e } = t;
					if (!o.find((t) => t.id === e)) {
						let t = {
							id: e,
							role: "reasoning",
							content: ""
						};
						o.push(t), l({ messages: o });
					}
				}
				return u();
			}
			case O.REASONING_MESSAGE_CONTENT: {
				let { messageId: i, delta: a } = t, c = o.find((e) => e.id === i);
				if (!c) return console.warn(`REASONING_MESSAGE_CONTENT: No message found with ID '${i}'`), u();
				let d = await z(r, o, s, (r, i, a) => r.onReasoningMessageContentEvent?.({
					event: t,
					messages: i,
					state: a,
					agent: n,
					input: e,
					reasoningMessageBuffer: typeof c.content == "string" ? c.content : ""
				}));
				return l(d), d.stopPropagation !== !0 && (c.content = `${typeof c.content == "string" ? c.content : ""}${a}`, l({ messages: o })), u();
			}
			case O.REASONING_MESSAGE_END: {
				let { messageId: i } = t, a = o.find((e) => e.id === i);
				return a ? (l(await z(r, o, s, (r, i, o) => r.onReasoningMessageEndEvent?.({
					event: t,
					messages: i,
					state: o,
					agent: n,
					input: e,
					reasoningMessageBuffer: typeof a.content == "string" ? a.content : ""
				}))), await Promise.all(r.map((t) => {
					t.onNewMessage?.({
						message: a,
						messages: o,
						state: s,
						agent: n,
						input: e
					});
				})), u()) : (console.warn(`REASONING_MESSAGE_END: No message found with ID '${i}'`), u());
			}
			case O.REASONING_MESSAGE_CHUNK: throw Error("REASONING_MESSAGE_CHUNK must be transformed before being applied");
			case O.REASONING_END: return l(await z(r, o, s, (r, i, a) => r.onReasoningEndEvent?.({
				event: t,
				messages: i,
				state: a,
				agent: n,
				input: e
			}))), u();
			case O.REASONING_ENCRYPTED_VALUE: {
				let { subtype: i, entityId: a, encryptedValue: d } = t, f = await z(r, o, s, (r, i, a) => r.onReasoningEncryptedValueEvent?.({
					event: t,
					messages: i,
					state: a,
					agent: n,
					input: e
				}));
				if (l(f), f.stopPropagation !== !0) {
					let e = !1;
					if (i === "tool-call") {
						for (let t of o) if (t.role === "assistant" && t.toolCalls) {
							let n = t.toolCalls.find((e) => e.id === a);
							if (n) {
								n.encryptedValue = d, e = !0;
								break;
							}
						}
					} else {
						let t = o.find((e) => e.id === a);
						t?.role !== "activity" && t && (t.encryptedValue = d, e = !0);
					}
					e && (c.messages = o);
				}
				return u();
			}
		}
		return t.type, u();
	}), Eo(), r.length > 0 ? Io({}) : (e) => e);
}, ll = (e) => (t) => {
	let n = il(e), r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), a = !1, o = !1, s = !1, c = /* @__PURE__ */ new Map(), l = !1, u = !1, d = !1, f = () => {
		r.clear(), i.clear(), c.clear(), l = !1, u = !1, a = !1, o = !1, d = !0;
	};
	return t.pipe(To((e) => {
		let t = e.type;
		if (n?.event("VERIFY", "Event:", e, { type: e.type }), o) return N(() => new Vn(`Cannot send event type '${t}': The run has already errored with 'RUN_ERROR'. No further events can be sent.`));
		if (a && t !== O.RUN_ERROR && t !== O.RUN_STARTED) return N(() => new Vn(`Cannot send event type '${t}': The run has already finished with 'RUN_FINISHED'. Start a new run with 'RUN_STARTED'.`));
		if (!s) {
			if (s = !0, t !== O.RUN_STARTED && t !== O.RUN_ERROR) return N(() => new Vn("First event must be 'RUN_STARTED'"));
		} else if (t === O.RUN_STARTED) {
			if (d && !a) return N(() => new Vn("Cannot send 'RUN_STARTED' while a run is still active. The previous run must be finished with 'RUN_FINISHED' before starting a new run."));
			a && f();
		}
		switch (t) {
			case O.TEXT_MESSAGE_START: {
				let t = e.messageId;
				return r.has(t) ? N(() => new Vn(`Cannot send 'TEXT_MESSAGE_START' event: A text message with ID '${t}' is already in progress. Complete it with 'TEXT_MESSAGE_END' first.`)) : (r.set(t, !0), M(e));
			}
			case O.TEXT_MESSAGE_CONTENT: {
				let t = e.messageId;
				return r.has(t) ? M(e) : N(() => new Vn(`Cannot send 'TEXT_MESSAGE_CONTENT' event: No active text message found with ID '${t}'. Start a text message with 'TEXT_MESSAGE_START' first.`));
			}
			case O.TEXT_MESSAGE_END: {
				let t = e.messageId;
				return r.has(t) ? (r.delete(t), M(e)) : N(() => new Vn(`Cannot send 'TEXT_MESSAGE_END' event: No active text message found with ID '${t}'. A 'TEXT_MESSAGE_START' event must be sent first.`));
			}
			case O.TOOL_CALL_START: {
				let t = e.toolCallId;
				return i.has(t) ? N(() => new Vn(`Cannot send 'TOOL_CALL_START' event: A tool call with ID '${t}' is already in progress. Complete it with 'TOOL_CALL_END' first.`)) : (i.set(t, !0), M(e));
			}
			case O.TOOL_CALL_ARGS: {
				let t = e.toolCallId;
				return i.has(t) ? M(e) : N(() => new Vn(`Cannot send 'TOOL_CALL_ARGS' event: No active tool call found with ID '${t}'. Start a tool call with 'TOOL_CALL_START' first.`));
			}
			case O.TOOL_CALL_END: {
				let t = e.toolCallId;
				return i.has(t) ? (i.delete(t), M(e)) : N(() => new Vn(`Cannot send 'TOOL_CALL_END' event: No active tool call found with ID '${t}'. A 'TOOL_CALL_START' event must be sent first.`));
			}
			case O.STEP_STARTED: {
				let t = e.stepName;
				return c.has(t) ? N(() => new Vn(`Step "${t}" is already active for 'STEP_STARTED'`)) : (c.set(t, !0), M(e));
			}
			case O.STEP_FINISHED: {
				let t = e.stepName;
				return c.has(t) ? (c.delete(t), M(e)) : N(() => new Vn(`Cannot send 'STEP_FINISHED' for step "${t}" that was not started`));
			}
			case O.RUN_STARTED: return d = !0, M(e);
			case O.RUN_FINISHED:
				if (c.size > 0) {
					let e = Array.from(c.keys()).join(", ");
					return N(() => new Vn(`Cannot send 'RUN_FINISHED' while steps are still active: ${e}`));
				}
				if (r.size > 0) {
					let e = Array.from(r.keys()).join(", ");
					return N(() => new Vn(`Cannot send 'RUN_FINISHED' while text messages are still active: ${e}`));
				}
				if (i.size > 0) {
					let e = Array.from(i.keys()).join(", ");
					return N(() => new Vn(`Cannot send 'RUN_FINISHED' while tool calls are still active: ${e}`));
				}
				return a = !0, M(e);
			case O.RUN_ERROR: return o = !0, M(e);
			case O.CUSTOM: return M(e);
			case O.THINKING_TEXT_MESSAGE_START: return l ? u ? N(() => new Vn("Cannot send 'THINKING_TEXT_MESSAGE_START' event: A thinking message is already in progress. Complete it with 'THINKING_TEXT_MESSAGE_END' first.")) : (u = !0, M(e)) : N(() => new Vn("Cannot send 'THINKING_TEXT_MESSAGE_START' event: A thinking step is not in progress. Create one with 'THINKING_START' first."));
			case O.THINKING_TEXT_MESSAGE_CONTENT: return u ? M(e) : N(() => new Vn("Cannot send 'THINKING_TEXT_MESSAGE_CONTENT' event: No active thinking message found. Start a message with 'THINKING_TEXT_MESSAGE_START' first."));
			case O.THINKING_TEXT_MESSAGE_END: return u ? (u = !1, M(e)) : N(() => new Vn("Cannot send 'THINKING_TEXT_MESSAGE_END' event: No active thinking message found. A 'THINKING_TEXT_MESSAGE_START' event must be sent first."));
			case O.THINKING_START: return l ? N(() => new Vn("Cannot send 'THINKING_START' event: A thinking step is already in progress. End it with 'THINKING_END' first.")) : (l = !0, M(e));
			case O.THINKING_END: return l ? (l = !1, M(e)) : N(() => new Vn("Cannot send 'THINKING_END' event: No active thinking step found. A 'THINKING_START' event must be sent first."));
			default: return M(e);
		}
	}));
}, ul = function(e) {
	return e.HEADERS = "headers", e.DATA = "data", e;
}({}), dl = (e, t) => ko(() => fo(fetch(e, t))).pipe(Jo((e) => {
	if (!e.ok) {
		let t = e.headers.get("content-type") || "";
		return fo(e.text()).pipe(To((n) => {
			let r = n;
			if (t.includes("application/json")) try {
				r = JSON.parse(n);
			} catch {}
			let i = Error(`HTTP ${e.status}: ${typeof r == "string" ? r : JSON.stringify(r)}`);
			return i.status = e.status, i.payload = r, N(() => i);
		}));
	}
	let t = {
		type: ul.HEADERS,
		status: e.status,
		headers: e.headers
	}, n = e.body?.getReader();
	return n ? new ta((e) => (e.next(t), (async () => {
		try {
			for (;;) {
				let { done: t, value: r } = await n.read();
				if (t) break;
				let i = {
					type: ul.DATA,
					data: r
				};
				e.next(i);
			}
			e.complete();
		} catch (t) {
			e.error(t);
		}
	})(), () => {
		n.cancel().catch((e) => {
			if (e?.name !== "AbortError") throw e;
		});
	})) : N(() => Error("Failed to getReader() from response"));
})), fl = (e, t) => {
	let n = il(t), r = new ua(), i = new TextDecoder("utf-8", { fatal: !1 }), a = "";
	e.subscribe({
		next: (e) => {
			if (e.type !== ul.HEADERS && e.type === ul.DATA && e.data) {
				let t = i.decode(e.data, { stream: !0 });
				a += t;
				let n = a.split(/\n\n/);
				a = n.pop() || "";
				for (let e of n) o(e);
			}
		},
		error: (e) => r.error(e),
		complete: () => {
			a && (a += i.decode(), o(a)), r.complete();
		}
	});
	function o(e) {
		let t = e.split("\n"), i = [];
		for (let e of t) e.startsWith("data:") && i.push(e.slice(5).replace(/^ /, ""));
		if (i.length > 0) try {
			let e = i.join("\n"), t = JSON.parse(e);
			n?.event("SSE", "Event received:", t, { type: t.type }), r.next(t);
		} catch (e) {
			r.error(e);
		}
	}
	return r.asObservable();
}, pl = (e) => {
	let t = new ua(), n = new Uint8Array();
	e.subscribe({
		next: (e) => {
			if (e.type !== ul.HEADERS && e.type === ul.DATA && e.data) {
				let t = new Uint8Array(n.length + e.data.length);
				t.set(n, 0), t.set(e.data, n.length), n = t, r();
			}
		},
		error: (e) => t.error(e),
		complete: () => {
			if (n.length > 0) try {
				r();
			} catch {
				console.warn("Incomplete or invalid protocol buffer data at stream end");
			}
			t.complete();
		}
	});
	function r() {
		for (; n.length >= 4;) {
			let e = 4 + new DataView(n.buffer, n.byteOffset, 4).getUint32(0, !1);
			if (n.length < e) break;
			try {
				let r = Kc(n.slice(4, e));
				t.next(r), n = n.slice(e);
			} catch (e) {
				let n = e instanceof Error ? e.message : String(e);
				t.error(Error(`Failed to decode protocol buffer message: ${n}`));
				return;
			}
		}
	}
	return t.asObservable();
}, ml = (e, t) => {
	let n = il(t), r = new ua(), i = new ma(), a = !1;
	return e.subscribe({
		next: (e) => {
			if (i.next(e), e.type === ul.HEADERS && !a) {
				a = !0;
				let t = e.headers.get("content-type");
				n?.lifecycle("HTTP", "Stream format detected:", {
					contentType: t,
					parser: t === "application/vnd.ag-ui.event+proto" ? "protobuf" : "sse"
				}), t === "application/vnd.ag-ui.event+proto" ? pl(i).subscribe({
					next: (e) => r.next(e),
					error: (e) => r.error(e),
					complete: () => r.complete()
				}) : fl(i, n).subscribe({
					next: (e) => {
						try {
							let t = Ar.parse(e);
							n?.event("HTTP", "Event validated:", t, {
								type: t.type,
								valid: !0
							}), r.next(t);
						} catch (t) {
							n?.event("HTTP", "Event invalid:", {
								json: e,
								error: String(t)
							}), r.error(t);
						}
					},
					error: (e) => {
						if (e?.name === "AbortError") {
							r.next({
								type: O.RUN_ERROR,
								message: e.message || "Request aborted",
								code: "abort",
								rawEvent: e
							}), r.complete();
							return;
						}
						return r.error(e);
					},
					complete: () => r.complete()
				});
			} else a || r.error(Error("No headers event received before data events"));
		},
		error: (e) => {
			i.error(e), r.error(e);
		},
		complete: () => {
			i.complete();
		}
	}), r.asObservable();
}, B = bn([
	"TextMessageStart",
	"TextMessageContent",
	"TextMessageEnd",
	"ActionExecutionStart",
	"ActionExecutionArgs",
	"ActionExecutionEnd",
	"ActionExecutionResult",
	"AgentStateMessage",
	"MetaEvent",
	"RunStarted",
	"RunFinished",
	"RunError",
	"NodeStarted",
	"NodeFinished"
]), hl = bn([
	"LangGraphInterruptEvent",
	"PredictState",
	"Exit"
]);
vn("type", [
	E({
		type: D(B.enum.TextMessageStart),
		messageId: w(),
		parentMessageId: w().optional(),
		role: w().optional()
	}),
	E({
		type: D(B.enum.TextMessageContent),
		messageId: w(),
		content: w()
	}),
	E({
		type: D(B.enum.TextMessageEnd),
		messageId: w()
	}),
	E({
		type: D(B.enum.ActionExecutionStart),
		actionExecutionId: w(),
		actionName: w(),
		parentMessageId: w().optional()
	}),
	E({
		type: D(B.enum.ActionExecutionArgs),
		actionExecutionId: w(),
		args: w()
	}),
	E({
		type: D(B.enum.ActionExecutionEnd),
		actionExecutionId: w()
	}),
	E({
		type: D(B.enum.ActionExecutionResult),
		actionName: w(),
		actionExecutionId: w(),
		result: w()
	}),
	E({
		type: D(B.enum.AgentStateMessage),
		threadId: w(),
		agentName: w(),
		nodeName: w(),
		runId: w(),
		active: T(),
		role: w(),
		state: w(),
		running: T()
	}),
	E({
		type: D(B.enum.MetaEvent),
		name: hl,
		value: mn()
	}),
	E({
		type: D(B.enum.RunError),
		message: w(),
		code: w().optional()
	})
]), E({
	id: w(),
	role: w(),
	content: w(),
	parentMessageId: w().optional()
}), E({
	id: w(),
	name: w(),
	arguments: mn(),
	parentMessageId: w().optional()
}), E({
	id: w(),
	result: mn(),
	actionExecutionId: w(),
	actionName: w()
});
var gl = (e) => {
	if (typeof e == "string") return e;
	if (!Array.isArray(e)) return;
	let t = e.filter((e) => e.type === "text").map((e) => e.text).filter((e) => e.length > 0);
	if (t.length !== 0) return t.join("\n");
}, _l = (e, t, n) => (r) => {
	let i = {}, a = !0, o = !0, s = "", c = null, l = null, u = [], d = {}, f = (e) => {
		typeof e == "object" && e && ("messages" in e && delete e.messages, i = e);
	};
	return r.pipe(To((r) => {
		switch (r.type) {
			case O.TEXT_MESSAGE_START: {
				let e = r;
				return [{
					type: B.enum.TextMessageStart,
					messageId: e.messageId,
					role: e.role
				}];
			}
			case O.TEXT_MESSAGE_CONTENT: {
				let e = r;
				return [{
					type: B.enum.TextMessageContent,
					messageId: e.messageId,
					content: e.delta
				}];
			}
			case O.TEXT_MESSAGE_END: {
				let e = r;
				return [{
					type: B.enum.TextMessageEnd,
					messageId: e.messageId
				}];
			}
			case O.TOOL_CALL_START: {
				let e = r;
				return u.push({
					id: e.toolCallId,
					type: "function",
					function: {
						name: e.toolCallName,
						arguments: ""
					}
				}), o = !0, d[e.toolCallId] = e.toolCallName, [{
					type: B.enum.ActionExecutionStart,
					actionExecutionId: e.toolCallId,
					actionName: e.toolCallName,
					parentMessageId: e.parentMessageId
				}];
			}
			case O.TOOL_CALL_ARGS: {
				let c = r, d = u.find((e) => e.id === c.toolCallId);
				if (!d) return console.warn(`TOOL_CALL_ARGS: No tool call found with ID '${c.toolCallId}'`), [];
				d.function.arguments += c.delta;
				let ee = !1;
				if (l) {
					let e = l.find((e) => e.tool == d.function.name);
					if (e) try {
						let t = JSON.parse($o(d.function.arguments));
						e.tool_argument && e.tool_argument in t ? (f({
							...i,
							[e.state_key]: t[e.tool_argument]
						}), ee = !0) : e.tool_argument || (f({
							...i,
							[e.state_key]: t
						}), ee = !0);
					} catch {}
				}
				return [{
					type: B.enum.ActionExecutionArgs,
					actionExecutionId: c.toolCallId,
					args: c.delta
				}, ...ee ? [{
					type: B.enum.AgentStateMessage,
					threadId: e,
					agentName: n,
					nodeName: s,
					runId: t,
					running: a,
					role: "assistant",
					state: JSON.stringify(i),
					active: o
				}] : []];
			}
			case O.TOOL_CALL_END: {
				let e = r;
				return [{
					type: B.enum.ActionExecutionEnd,
					actionExecutionId: e.toolCallId
				}];
			}
			case O.TOOL_CALL_RESULT: {
				let e = r;
				return [{
					type: B.enum.ActionExecutionResult,
					actionExecutionId: e.toolCallId,
					result: e.content,
					actionName: d[e.toolCallId] || "unknown"
				}];
			}
			case O.RAW: return [];
			case O.CUSTOM: {
				let e = r;
				switch (e.name) {
					case "Exit":
						a = !1;
						break;
					case "PredictState":
						l = e.value;
						break;
				}
				return [{
					type: B.enum.MetaEvent,
					name: e.name,
					value: e.value
				}];
			}
			case O.STATE_SNAPSHOT: return f(r.snapshot), [{
				type: B.enum.AgentStateMessage,
				threadId: e,
				agentName: n,
				nodeName: s,
				runId: t,
				running: a,
				role: "assistant",
				state: JSON.stringify(i),
				active: o
			}];
			case O.STATE_DELTA: {
				let c = r, l = di.applyPatch(i, c.delta, !0, !1);
				return l ? (f(l.newDocument), [{
					type: B.enum.AgentStateMessage,
					threadId: e,
					agentName: n,
					nodeName: s,
					runId: t,
					running: a,
					role: "assistant",
					state: JSON.stringify(i),
					active: o
				}]) : [];
			}
			case O.MESSAGES_SNAPSHOT: return c = r.messages, [{
				type: B.enum.AgentStateMessage,
				threadId: e,
				agentName: n,
				nodeName: s,
				runId: t,
				running: a,
				role: "assistant",
				state: JSON.stringify({
					...i,
					...c ? { messages: c } : {}
				}),
				active: !0
			}];
			case O.RUN_STARTED: return [];
			case O.RUN_FINISHED: return c && (i.messages = c), Object.keys(i).length === 0 ? [] : [{
				type: B.enum.AgentStateMessage,
				threadId: e,
				agentName: n,
				nodeName: s,
				runId: t,
				running: a,
				role: "assistant",
				state: JSON.stringify({
					...i,
					...c ? { messages: vl(c) } : {}
				}),
				active: !1
			}];
			case O.RUN_ERROR: {
				let e = r;
				return [{
					type: B.enum.RunError,
					message: e.message,
					code: e.code
				}];
			}
			case O.STEP_STARTED: return s = r.stepName, u = [], l = null, [{
				type: B.enum.AgentStateMessage,
				threadId: e,
				agentName: n,
				nodeName: s,
				runId: t,
				running: a,
				role: "assistant",
				state: JSON.stringify(i),
				active: !0
			}];
			case O.STEP_FINISHED: return u = [], l = null, [{
				type: B.enum.AgentStateMessage,
				threadId: e,
				agentName: n,
				nodeName: s,
				runId: t,
				running: a,
				role: "assistant",
				state: JSON.stringify(i),
				active: !1
			}];
			default: return [];
		}
	}));
};
function vl(e) {
	let t = [];
	for (let n of e) if (n.role === "assistant" || n.role === "user" || n.role === "system") {
		let e = gl(n.content);
		if (e) {
			let r = {
				id: n.id,
				role: n.role,
				content: e
			};
			t.push(r);
		}
		if (n.role === "assistant" && n.toolCalls && n.toolCalls.length > 0) for (let e of n.toolCalls) {
			let r = {
				id: e.id,
				name: e.function.name,
				arguments: JSON.parse(e.function.arguments),
				parentMessageId: n.id
			};
			t.push(r);
		}
	} else if (n.role === "tool") {
		let r = "unknown";
		for (let t of e) if (t.role === "assistant" && t.toolCalls?.length) {
			for (let e of t.toolCalls) if (e.id === n.toolCallId) {
				r = e.function.name;
				break;
			}
		}
		let i = {
			id: n.id,
			result: n.content,
			actionExecutionId: n.toolCallId,
			actionName: r
		};
		t.push(i);
	}
	return t;
}
var yl = (e) => (t) => {
	let n = il(e), r, i, a, o, s = () => {
		if (!r || o !== "text") throw Error("No text message to close");
		let e = {
			type: O.TEXT_MESSAGE_END,
			messageId: r.messageId
		};
		return o = void 0, r = void 0, n?.event("TRANSFORM", "TEXT_MESSAGE_END", e, { messageId: e.messageId }), e;
	}, c = () => {
		if (!i || o !== "tool") throw Error("No tool call to close");
		let e = {
			type: O.TOOL_CALL_END,
			toolCallId: i.toolCallId
		};
		return o = void 0, i = void 0, n?.event("TRANSFORM", "TOOL_CALL_END", e, { toolCallId: e.toolCallId }), e;
	}, l = () => {
		if (!a || o !== "reasoning") throw Error("No reasoning message to close");
		let e = {
			type: O.REASONING_MESSAGE_END,
			messageId: a.messageId
		};
		return o = void 0, a = void 0, n?.event("TRANSFORM", "REASONING_MESSAGE_END", e, { messageId: e.messageId }), e;
	}, u = () => o === "text" ? [s()] : o === "tool" ? [c()] : o === "reasoning" ? [l()] : [];
	return t.pipe(To((e) => {
		switch (e.type) {
			case O.TEXT_MESSAGE_START:
			case O.TEXT_MESSAGE_CONTENT:
			case O.TEXT_MESSAGE_END:
			case O.TOOL_CALL_START:
			case O.TOOL_CALL_ARGS:
			case O.TOOL_CALL_END:
			case O.TOOL_CALL_RESULT:
			case O.STATE_SNAPSHOT:
			case O.STATE_DELTA:
			case O.MESSAGES_SNAPSHOT:
			case O.CUSTOM:
			case O.RUN_STARTED:
			case O.RUN_FINISHED:
			case O.RUN_ERROR:
			case O.STEP_STARTED:
			case O.STEP_FINISHED:
			case O.THINKING_START:
			case O.THINKING_END:
			case O.THINKING_TEXT_MESSAGE_START:
			case O.THINKING_TEXT_MESSAGE_CONTENT:
			case O.THINKING_TEXT_MESSAGE_END:
			case O.REASONING_START:
			case O.REASONING_MESSAGE_START:
			case O.REASONING_MESSAGE_CONTENT:
			case O.REASONING_MESSAGE_END:
			case O.REASONING_END: return [...u(), e];
			case O.RAW:
			case O.ACTIVITY_SNAPSHOT:
			case O.ACTIVITY_DELTA:
			case O.REASONING_ENCRYPTED_VALUE: return [e];
			case O.TEXT_MESSAGE_CHUNK:
				let t = e, s = [];
				if ((o !== "text" || t.messageId !== void 0 && t.messageId !== r?.messageId) && s.push(...u()), o !== "text") {
					if (t.messageId === void 0) throw Error("First TEXT_MESSAGE_CHUNK must have a messageId");
					r = {
						messageId: t.messageId,
						name: t.name
					}, o = "text";
					let e = {
						type: O.TEXT_MESSAGE_START,
						messageId: t.messageId,
						role: t.role || "assistant",
						...t.name !== void 0 && { name: t.name }
					};
					s.push(e), n?.event("TRANSFORM", "TEXT_MESSAGE_START", e, { messageId: t.messageId });
				}
				if (t.delta !== void 0) {
					let e = {
						type: O.TEXT_MESSAGE_CONTENT,
						messageId: r.messageId,
						delta: t.delta
					};
					s.push(e), n?.event("TRANSFORM", "TEXT_MESSAGE_CONTENT", e, { messageId: r.messageId });
				}
				return s;
			case O.TOOL_CALL_CHUNK:
				let c = e, l = [];
				if ((o !== "tool" || c.toolCallId !== void 0 && c.toolCallId !== i?.toolCallId) && l.push(...u()), o !== "tool") {
					if (c.toolCallId === void 0) throw Error("First TOOL_CALL_CHUNK must have a toolCallId");
					if (c.toolCallName === void 0) throw Error("First TOOL_CALL_CHUNK must have a toolCallName");
					i = {
						toolCallId: c.toolCallId,
						toolCallName: c.toolCallName,
						parentMessageId: c.parentMessageId
					}, o = "tool";
					let e = {
						type: O.TOOL_CALL_START,
						toolCallId: c.toolCallId,
						toolCallName: c.toolCallName,
						parentMessageId: c.parentMessageId
					};
					l.push(e), n?.event("TRANSFORM", "TOOL_CALL_START", e, {
						toolCallId: c.toolCallId,
						toolCallName: c.toolCallName
					});
				}
				if (c.delta !== void 0) {
					let e = {
						type: O.TOOL_CALL_ARGS,
						toolCallId: i.toolCallId,
						delta: c.delta
					};
					l.push(e), n?.event("TRANSFORM", "TOOL_CALL_ARGS", e, { toolCallId: i.toolCallId });
				}
				return l;
			case O.REASONING_MESSAGE_CHUNK:
				let d = e, f = [];
				if ((o !== "reasoning" || d.messageId && d.messageId !== a?.messageId) && f.push(...u()), o !== "reasoning") {
					if (d.messageId === void 0) throw Error("First REASONING_MESSAGE_CHUNK must have a messageId");
					a = { messageId: d.messageId }, o = "reasoning";
					let e = {
						type: O.REASONING_MESSAGE_START,
						messageId: d.messageId
					};
					f.push(e), n?.event("TRANSFORM", "REASONING_MESSAGE_START", e, { messageId: d.messageId });
				}
				if (d.delta !== void 0) {
					let e = {
						type: O.REASONING_MESSAGE_CONTENT,
						messageId: a.messageId,
						delta: d.delta
					};
					f.push(e), n?.event("TRANSFORM", "REASONING_MESSAGE_CONTENT", e, { messageId: a.messageId });
				}
				return f;
		}
		return e.type, [];
	}), Uo(() => {
		u();
	}));
}, bl = class {
	runNext(e, t) {
		return t.run(e).pipe(yl(!1));
	}
	runNextWithState(e, t) {
		let n = R(e.messages || []), r = R(e.state || {}), i = new ma();
		return cl(e, i, t, []).subscribe((e) => {
			e.messages !== void 0 && (n = e.messages), e.state !== void 0 && (r = e.state);
		}), this.runNext(e, t).pipe(Fo(async (e) => (i.next(e), await new Promise((e) => setTimeout(e, 0)), {
			event: e,
			messages: R(n),
			state: R(r)
		})));
	}
}, xl = class extends bl {
	constructor(e) {
		super(), this.fn = e;
	}
	run(e, t) {
		return this.fn(e, t);
	}
};
function Sl(e) {
	let t = e.content;
	if (Array.isArray(t)) {
		let n = t.filter((e) => typeof e == "object" && !!e && "type" in e && e.type === "text" && typeof e.text == "string").map((e) => e.text).join("");
		return {
			...e,
			content: n
		};
	}
	return typeof t == "string" ? e : {
		...e,
		content: ""
	};
}
var Cl = class extends bl {
	run(e, t) {
		let { parentRunId: n, ...r } = e, i = {
			...r,
			messages: r.messages.map(Sl)
		};
		return this.runNext(i, t);
	}
}, wl = "THINKING_START", Tl = "THINKING_END", El = "THINKING_TEXT_MESSAGE_START", Dl = "THINKING_TEXT_MESSAGE_CONTENT", Ol = "THINKING_TEXT_MESSAGE_END", kl = class extends bl {
	constructor(...e) {
		super(...e), this.currentReasoningId = null, this.currentMessageId = null;
	}
	warnAboutTransformation(e, t) {
		typeof process < "u" && process.env !== void 0 && process.env.SUPPRESS_TRANSFORMATION_WARNINGS || console.warn(`AG-UI is converting ${e} to ${t}. To remove this warning, upgrade your AG-UI integration package (e.g. @ag-ui/langgraph). To surpress it, set SUPPRESS_TRANSFORMATION_WARNINGS=true in your .env file.`);
	}
	run(e, t) {
		return this.currentReasoningId = null, this.currentMessageId = null, this.runNext(e, t).pipe(Co((e) => this.transformEvent(e)));
	}
	transformEvent(e) {
		switch (e.type) {
			case wl: {
				this.currentReasoningId = tl();
				let { title: t, ...n } = e;
				return this.warnAboutTransformation(wl, O.REASONING_START), {
					...n,
					type: O.REASONING_START,
					messageId: this.currentReasoningId
				};
			}
			case El: return this.currentMessageId = tl(), this.warnAboutTransformation(El, O.REASONING_MESSAGE_START), {
				...e,
				type: O.REASONING_MESSAGE_START,
				messageId: this.currentMessageId,
				role: "assistant"
			};
			case Dl: {
				let { delta: t, ...n } = e;
				return this.warnAboutTransformation(Dl, O.REASONING_MESSAGE_CONTENT), {
					...n,
					type: O.REASONING_MESSAGE_CONTENT,
					messageId: this.currentMessageId ?? tl(),
					delta: t
				};
			}
			case Ol: {
				let t = this.currentMessageId ?? tl();
				return this.warnAboutTransformation(Ol, O.REASONING_MESSAGE_END), {
					...e,
					type: O.REASONING_MESSAGE_END,
					messageId: t
				};
			}
			case Tl: {
				let t = this.currentReasoningId ?? tl();
				return this.warnAboutTransformation(Tl, O.REASONING_END), {
					...e,
					type: O.REASONING_END,
					messageId: t
				};
			}
			default: return e;
		}
	}
};
function Al(e) {
	return e.startsWith("image/") ? "image" : e.startsWith("audio/") ? "audio" : e.startsWith("video/") ? "video" : "document";
}
function jl(e) {
	return typeof e == "object" && !!e && "type" in e && e.type === "binary" && "mimeType" in e && typeof e.mimeType == "string";
}
function Ml(e) {
	let t = Al(e.mimeType);
	return e.data ? {
		type: t,
		source: {
			type: "data",
			value: e.data,
			mimeType: e.mimeType
		},
		...e.filename ? { metadata: { filename: e.filename } } : {}
	} : e.url ? {
		type: t,
		source: {
			type: "url",
			value: e.url,
			mimeType: e.mimeType
		},
		...e.filename ? { metadata: { filename: e.filename } } : {}
	} : e;
}
function Nl(e) {
	let t = e.content;
	if (!Array.isArray(t)) return e;
	let n = t.map((e) => jl(e) ? Ml(e) : e);
	return {
		...e,
		content: n
	};
}
var Pl = class extends bl {
	run(e, t) {
		let n = {
			...e,
			messages: e.messages.map(Nl)
		};
		return this.runNext(n, t);
	}
}, Fl = "0.0.53", Il = class {
	get maxVersion() {
		return Fl;
	}
	get debug() {
		return this._debug;
	}
	set debug(e) {
		this._debug = rl(e), this._debugLogger = ol(this._debug);
	}
	get debugLogger() {
		return this._debugLogger;
	}
	set debugLogger(e) {
		typeof e == "boolean" ? this._debugLogger = e ? ol(rl(!0)) : void 0 : this._debugLogger = e;
	}
	constructor({ agentId: e, description: t, threadId: n, initialMessages: r, initialState: i, debug: a } = {}) {
		this.subscribers = [], this.isRunning = !1, this.middlewares = [], this.agentId = e, this.description = t ?? "", this.threadId = n ?? Pe(), this.messages = R(r ?? []), this.state = R(i ?? {}), this._debug = rl(a), this._debugLogger = ol(this._debug), el(this.maxVersion, "0.0.39") <= 0 && this.middlewares.unshift(new Cl()), el(this.maxVersion, "0.0.45") <= 0 && this.middlewares.unshift(new kl()), el(this.maxVersion, "0.0.47") <= 0 && this.middlewares.unshift(new Pl());
	}
	subscribe(e) {
		return this.subscribers.push(e), { unsubscribe: () => {
			this.subscribers = this.subscribers.filter((t) => t !== e);
		} };
	}
	use(...e) {
		let t = e.map((e) => typeof e == "function" ? new xl(e) : e);
		return this.middlewares.push(...t), this;
	}
	async runAgent(e, t) {
		try {
			this.isRunning = !0, this.agentId = this.agentId ?? Pe();
			let n = this.prepareRunAgentInput(e);
			this.debugLogger?.lifecycle("LIFECYCLE", "Run started:", {
				agentId: this.agentId,
				threadId: this.threadId
			});
			let r, i = new Set(this.messages.map((e) => e.id)), a = [
				{ onRunFinishedEvent: (e) => {
					r = e.result;
				} },
				...this.subscribers,
				t ?? {}
			];
			await this.onInitialize(n, a), this.activeRunDetach$ = new ua();
			let o;
			this.activeRunCompletionPromise = new Promise((e) => {
				o = e;
			}), await _o($i(() => this.middlewares.length === 0 ? this.run(n) : this.middlewares.reduceRight((e, t) => ({
				run: (n) => t.run(n, e),
				get messages() {
					return e.messages;
				},
				get state() {
					return e.state;
				}
			}), this).run(n), yl(this.debugLogger), ll(this.debugLogger), (e) => e.pipe(Yo(this.activeRunDetach$)), (e) => this.apply(n, e, a), (e) => this.processApplyEvents(n, e, a), No((e) => (this.debugLogger?.lifecycle("LIFECYCLE", "Run errored:", {
				agentId: this.agentId,
				error: e instanceof Error ? e.message : String(e)
			}), this.isRunning = !1, this.onError(n, e, a))), Uo(() => {
				this.debugLogger?.lifecycle("LIFECYCLE", "Run finished:", {
					agentId: this.agentId,
					threadId: this.threadId
				}), this.isRunning = !1, this.onFinalize(n, a), o?.(), o = void 0, this.activeRunCompletionPromise = void 0, this.activeRunDetach$ = void 0;
			}))(M(null)));
			let s = R(this.messages).filter((e) => !i.has(e.id));
			return {
				result: r,
				newMessages: s
			};
		} finally {
			this.isRunning = !1;
		}
	}
	connect(e) {
		throw new Hn();
	}
	async connectAgent(e, t) {
		try {
			this.isRunning = !0, this.agentId = this.agentId ?? Pe();
			let n = this.prepareRunAgentInput(e), r, i = new Set(this.messages.map((e) => e.id)), a = [
				{ onRunFinishedEvent: (e) => {
					r = e.result;
				} },
				...this.subscribers,
				t ?? {}
			];
			await this.onInitialize(n, a), this.activeRunDetach$ = new ua();
			let o;
			this.activeRunCompletionPromise = new Promise((e) => {
				o = e;
			}), await _o($i(() => ko(() => this.connect(n)), yl(this.debugLogger), ll(this.debugLogger), (e) => e.pipe(Yo(this.activeRunDetach$)), (e) => this.apply(n, e, a), (e) => this.processApplyEvents(n, e, a), No((e) => (this.isRunning = !1, e instanceof Hn ? ja : this.onError(n, e, a))), Uo(() => {
				this.isRunning = !1, this.onFinalize(n, a), o?.(), o = void 0, this.activeRunCompletionPromise = void 0, this.activeRunDetach$ = void 0;
			}))(M(null)), { defaultValue: void 0 });
			let s = R(this.messages).filter((e) => !i.has(e.id));
			return {
				result: r,
				newMessages: s
			};
		} finally {
			this.isRunning = !1;
		}
	}
	abortRun() {}
	async detachActiveRun() {
		if (!this.activeRunDetach$) return;
		let e = this.activeRunCompletionPromise ?? Promise.resolve();
		this.activeRunDetach$.next(), this.activeRunDetach$?.complete(), await e;
	}
	apply(e, t, n) {
		return cl(e, t, this, n, this.debugLogger);
	}
	processApplyEvents(e, t, n) {
		return t.pipe(Xo((t) => {
			t.messages && (this.messages = t.messages, n.forEach((t) => {
				t.onMessagesChanged?.({
					messages: this.messages,
					state: this.state,
					agent: this,
					input: e
				});
			})), t.state && (this.state = t.state, n.forEach((t) => {
				t.onStateChanged?.({
					state: this.state,
					messages: this.messages,
					agent: this,
					input: e
				});
			}));
		}));
	}
	prepareRunAgentInput(e) {
		let t = R(this.messages).filter((e) => e.role !== "activity");
		return {
			threadId: this.threadId,
			runId: e?.runId || Pe(),
			tools: R(e?.tools ?? []),
			context: R(e?.context ?? []),
			forwardedProps: R(e?.forwardedProps ?? {}),
			state: R(this.state),
			messages: t
		};
	}
	async onInitialize(e, t) {
		let n = await z(t, this.messages, this.state, (t, n, r) => t.onRunInitialized?.({
			messages: n,
			state: r,
			agent: this,
			input: e
		}));
		(n.messages !== void 0 || n.state !== void 0) && (n.messages && (this.messages = n.messages, e.messages = n.messages, t.forEach((t) => {
			t.onMessagesChanged?.({
				messages: this.messages,
				state: this.state,
				agent: this,
				input: e
			});
		})), n.state && (this.state = n.state, e.state = n.state, t.forEach((t) => {
			t.onStateChanged?.({
				state: this.state,
				messages: this.messages,
				agent: this,
				input: e
			});
		})));
	}
	onError(e, t, n) {
		return fo(z(n, this.messages, this.state, (n, r, i) => n.onRunFailed?.({
			error: t,
			messages: r,
			state: i,
			agent: this,
			input: e
		}))).pipe(Co((r) => {
			let i = r;
			if ((i.messages !== void 0 || i.state !== void 0) && (i.messages !== void 0 && (this.messages = i.messages, n.forEach((t) => {
				t.onMessagesChanged?.({
					messages: this.messages,
					state: this.state,
					agent: this,
					input: e
				});
			})), i.state !== void 0 && (this.state = i.state, n.forEach((t) => {
				t.onStateChanged?.({
					state: this.state,
					messages: this.messages,
					agent: this,
					input: e
				});
			}))), i.stopPropagation !== !0) {
				let e = String(t);
				if (!(t.name === "AbortError" || t.message === "Fetch is aborted" || t.message === "signal is aborted without reason" || t.message === "component unmounted" || e === "component unmounted")) throw console.error("Agent execution failed:", t), t;
			}
			return {};
		}));
	}
	async onFinalize(e, t) {
		let n = await z(t, this.messages, this.state, (t, n, r) => t.onRunFinalized?.({
			messages: n,
			state: r,
			agent: this,
			input: e
		}));
		(n.messages !== void 0 || n.state !== void 0) && (n.messages !== void 0 && (this.messages = n.messages, t.forEach((t) => {
			t.onMessagesChanged?.({
				messages: this.messages,
				state: this.state,
				agent: this,
				input: e
			});
		})), n.state !== void 0 && (this.state = n.state, t.forEach((t) => {
			t.onStateChanged?.({
				state: this.state,
				messages: this.messages,
				agent: this,
				input: e
			});
		})));
	}
	clone() {
		let e = Object.create(Object.getPrototypeOf(this));
		return e.agentId = this.agentId, e.description = this.description, e.threadId = this.threadId, e.messages = R(this.messages), e.state = R(this.state), e._debug = this._debug, e._debugLogger = this._debugLogger, e.isRunning = this.isRunning, e.subscribers = [...this.subscribers], e.middlewares = [...this.middlewares], e;
	}
	addMessage(e) {
		this.messages.push(e), (async () => {
			for (let t of this.subscribers) await t.onNewMessage?.({
				message: e,
				messages: this.messages,
				state: this.state,
				agent: this
			});
			if (e.role === "assistant" && e.toolCalls) for (let t of e.toolCalls) for (let e of this.subscribers) await e.onNewToolCall?.({
				toolCall: t,
				messages: this.messages,
				state: this.state,
				agent: this
			});
			for (let e of this.subscribers) await e.onMessagesChanged?.({
				messages: this.messages,
				state: this.state,
				agent: this
			});
		})();
	}
	addMessages(e) {
		this.messages.push(...e), (async () => {
			for (let t of e) {
				for (let e of this.subscribers) await e.onNewMessage?.({
					message: t,
					messages: this.messages,
					state: this.state,
					agent: this
				});
				if (t.role === "assistant" && t.toolCalls) for (let e of t.toolCalls) for (let t of this.subscribers) await t.onNewToolCall?.({
					toolCall: e,
					messages: this.messages,
					state: this.state,
					agent: this
				});
			}
			for (let e of this.subscribers) await e.onMessagesChanged?.({
				messages: this.messages,
				state: this.state,
				agent: this
			});
		})();
	}
	setMessages(e) {
		this.messages = R(e), (async () => {
			for (let e of this.subscribers) await e.onMessagesChanged?.({
				messages: this.messages,
				state: this.state,
				agent: this
			});
		})();
	}
	setState(e) {
		this.state = R(e), (async () => {
			for (let e of this.subscribers) await e.onStateChanged?.({
				messages: this.messages,
				state: this.state,
				agent: this
			});
		})();
	}
	legacy_to_be_removed_runAgentBridged(e) {
		this.agentId = this.agentId ?? Pe();
		let t = this.prepareRunAgentInput(e);
		return (this.middlewares.length === 0 ? this.run(t) : this.middlewares.reduceRight((e, t) => ({
			run: (n) => t.run(n, e),
			get messages() {
				return e.messages;
			},
			get state() {
				return e.state;
			}
		}), this).run(t)).pipe(yl(this.debugLogger), ll(this.debugLogger), _l(this.threadId, t.runId, this.agentId), (e) => e.pipe(Co((e) => (this.debugLogger?.event("LEGACY", "Event:", e, { type: e.type }), e))));
	}
}, Ll = class extends Il {
	requestInit(e) {
		return {
			method: "POST",
			headers: {
				...this.headers,
				"Content-Type": "application/json",
				Accept: "text/event-stream"
			},
			body: JSON.stringify(e),
			signal: this.abortController.signal
		};
	}
	runAgent(e, t) {
		return this.abortController = e?.abortController ?? new AbortController(), super.runAgent(e, t);
	}
	abortRun() {
		this.abortController.abort(), super.abortRun();
	}
	constructor(e) {
		super(e), this.abortController = new AbortController(), this.url = e.url, this.headers = R(e.headers ?? {});
	}
	run(e) {
		return ml(dl(this.url, this.requestInit(e)), this.debugLogger);
	}
	clone() {
		let e = super.clone();
		e.url = this.url, e.headers = R(this.headers ?? {});
		let t = new AbortController(), n = this.abortController.signal;
		return n.aborted && t.abort(n.reason), e.abortController = t, e;
	}
};
//#endregion
//#region node_modules/.pnpm/@copilotkit+shared@1.59.2_@ag-ui+core@0.0.53/node_modules/@copilotkit/shared/dist/utils/clipboard.mjs
async function Rl(e) {
	if (!navigator.clipboard?.writeText) return console.error("Clipboard API is not available"), !1;
	try {
		return await navigator.clipboard.writeText(e), !0;
	} catch (e) {
		return console.error("Failed to copy to clipboard:", e), !1;
	}
}
//#endregion
//#region node_modules/.pnpm/graphql@16.14.0/node_modules/graphql/jsutils/isObjectLike.mjs
function zl(e) {
	return typeof e == "object" && !!e;
}
//#endregion
//#region node_modules/.pnpm/graphql@16.14.0/node_modules/graphql/jsutils/invariant.mjs
function Bl(e, t) {
	if (!e) throw Error(t ?? "Unexpected invariant triggered.");
}
//#endregion
//#region node_modules/.pnpm/graphql@16.14.0/node_modules/graphql/language/location.mjs
var Vl = /\r\n|[\n\r]/g;
function Hl(e, t) {
	let n = 0, r = 1;
	for (let i of e.body.matchAll(Vl)) {
		if (typeof i.index == "number" || Bl(!1), i.index >= t) break;
		n = i.index + i[0].length, r += 1;
	}
	return {
		line: r,
		column: t + 1 - n
	};
}
//#endregion
//#region node_modules/.pnpm/graphql@16.14.0/node_modules/graphql/language/printLocation.mjs
function Ul(e) {
	return Wl(e.source, Hl(e.source, e.start));
}
function Wl(e, t) {
	let n = e.locationOffset.column - 1, r = "".padStart(n) + e.body, i = t.line - 1, a = e.locationOffset.line - 1, o = t.line + a, s = t.line === 1 ? n : 0, c = t.column + s, l = `${e.name}:${o}:${c}\n`, u = r.split(/\r\n|[\n\r]/g), d = u[i];
	if (d.length > 120) {
		let e = Math.floor(c / 80), t = c % 80, n = [];
		for (let e = 0; e < d.length; e += 80) n.push(d.slice(e, e + 80));
		return l + Gl([
			[`${o} |`, n[0]],
			...n.slice(1, e + 1).map((e) => ["|", e]),
			["|", "^".padStart(t)],
			["|", n[e + 1]]
		]);
	}
	return l + Gl([
		[`${o - 1} |`, u[i - 1]],
		[`${o} |`, d],
		["|", "^".padStart(c)],
		[`${o + 1} |`, u[i + 1]]
	]);
}
function Gl(e) {
	let t = e.filter(([e, t]) => t !== void 0), n = Math.max(...t.map(([e]) => e.length));
	return t.map(([e, t]) => e.padStart(n) + (t ? " " + t : "")).join("\n");
}
//#endregion
//#region node_modules/.pnpm/graphql@16.14.0/node_modules/graphql/error/GraphQLError.mjs
function Kl(e) {
	let t = e[0];
	return t == null || "kind" in t || "length" in t ? {
		nodes: t,
		source: e[1],
		positions: e[2],
		path: e[3],
		originalError: e[4],
		extensions: e[5]
	} : t;
}
var ql = class e extends Error {
	constructor(t, ...n) {
		let { nodes: r, source: i, positions: a, path: o, originalError: s, extensions: c } = Kl(n);
		super(t), this.name = "GraphQLError", this.path = o ?? void 0, this.originalError = s ?? void 0, this.nodes = Jl(Array.isArray(r) ? r : r ? [r] : void 0);
		let l = Jl(this.nodes?.map((e) => e.loc).filter((e) => e != null));
		this.source = i ?? l?.[0]?.source, this.positions = a ?? l?.map((e) => e.start), this.locations = a && i ? a.map((e) => Hl(i, e)) : l?.map((e) => Hl(e.source, e.start));
		let u = zl(s?.extensions) ? s?.extensions : void 0;
		/* c8 ignore start */
		this.extensions = c ?? u ?? Object.create(null), Object.defineProperties(this, {
			message: {
				writable: !0,
				enumerable: !0
			},
			name: { enumerable: !1 },
			nodes: { enumerable: !1 },
			source: { enumerable: !1 },
			positions: { enumerable: !1 },
			originalError: { enumerable: !1 }
		}), s != null && s.stack ? Object.defineProperty(this, "stack", {
			value: s.stack,
			writable: !0,
			configurable: !0
		}) : Error.captureStackTrace ? Error.captureStackTrace(this, e) : Object.defineProperty(this, "stack", {
			value: Error().stack,
			writable: !0,
			configurable: !0
		});
		/* c8 ignore stop */
	}
	get [Symbol.toStringTag]() {
		return "GraphQLError";
	}
	toString() {
		let e = this.message;
		if (this.nodes) for (let t of this.nodes) t.loc && (e += "\n\n" + Ul(t.loc));
		else if (this.source && this.locations) for (let t of this.locations) e += "\n\n" + Wl(this.source, t);
		return e;
	}
	toJSON() {
		let e = { message: this.message };
		return this.locations != null && (e.locations = this.locations), this.path != null && (e.path = this.path), this.extensions != null && Object.keys(this.extensions).length > 0 && (e.extensions = this.extensions), e;
	}
};
function Jl(e) {
	return e === void 0 || e.length === 0 ? void 0 : e;
}
//#endregion
//#region node_modules/.pnpm/@copilotkit+shared@1.59.2_@ag-ui+core@0.0.53/node_modules/@copilotkit/shared/dist/utils/errors.mjs
var Yl = /* @__PURE__ */ function(e) {
	return e.CRITICAL = "critical", e.WARNING = "warning", e.INFO = "info", e;
}({}), Xl = /* @__PURE__ */ function(e) {
	return e.BANNER = "banner", e.TOAST = "toast", e.SILENT = "silent", e.DEV_ONLY = "dev_only", e;
}({}), Zl = {
	COPILOT_ERROR: "CopilotError",
	COPILOT_API_DISCOVERY_ERROR: "CopilotApiDiscoveryError",
	COPILOT_REMOTE_ENDPOINT_DISCOVERY_ERROR: "CopilotKitRemoteEndpointDiscoveryError",
	COPILOT_KIT_AGENT_DISCOVERY_ERROR: "CopilotKitAgentDiscoveryError",
	COPILOT_KIT_LOW_LEVEL_ERROR: "CopilotKitLowLevelError",
	COPILOT_KIT_VERSION_MISMATCH_ERROR: "CopilotKitVersionMismatchError",
	RESOLVED_COPILOT_KIT_ERROR: "ResolvedCopilotKitError",
	CONFIGURATION_ERROR: "ConfigurationError",
	MISSING_PUBLIC_API_KEY_ERROR: "MissingPublicApiKeyError",
	UPGRADE_REQUIRED_ERROR: "UpgradeRequiredError"
};
Zl.CONFIGURATION_ERROR, Zl.MISSING_PUBLIC_API_KEY_ERROR, Zl.UPGRADE_REQUIRED_ERROR, Zl.COPILOT_API_DISCOVERY_ERROR, Zl.COPILOT_REMOTE_ENDPOINT_DISCOVERY_ERROR, Zl.COPILOT_KIT_AGENT_DISCOVERY_ERROR;
var Ql = /* @__PURE__ */ function(e) {
	return e.NETWORK_ERROR = "NETWORK_ERROR", e.NOT_FOUND = "NOT_FOUND", e.AGENT_NOT_FOUND = "AGENT_NOT_FOUND", e.API_NOT_FOUND = "API_NOT_FOUND", e.REMOTE_ENDPOINT_NOT_FOUND = "REMOTE_ENDPOINT_NOT_FOUND", e.AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR", e.MISUSE = "MISUSE", e.UNKNOWN = "UNKNOWN", e.VERSION_MISMATCH = "VERSION_MISMATCH", e.CONFIGURATION_ERROR = "CONFIGURATION_ERROR", e.MISSING_PUBLIC_API_KEY_ERROR = "MISSING_PUBLIC_API_KEY_ERROR", e.UPGRADE_REQUIRED_ERROR = "UPGRADE_REQUIRED_ERROR", e;
}({}), $l = "https://docs.copilotkit.ai", eu = (e) => `See more: [${e}](${e})`, tu = {
	[Ql.NETWORK_ERROR]: {
		statusCode: 503,
		troubleshootingUrl: `${$l}/troubleshooting/common-issues#network-errors-api-not-found`,
		visibility: Xl.BANNER,
		severity: Yl.CRITICAL
	},
	[Ql.NOT_FOUND]: {
		statusCode: 404,
		troubleshootingUrl: `${$l}/troubleshooting/common-issues#network-errors-api-not-found`,
		visibility: Xl.BANNER,
		severity: Yl.CRITICAL
	},
	[Ql.AGENT_NOT_FOUND]: {
		statusCode: 500,
		troubleshootingUrl: `${$l}/langgraph-python/coagent-troubleshooting/common-coagent-issues#i-am-getting-agent-not-found-error`,
		visibility: Xl.BANNER,
		severity: Yl.CRITICAL
	},
	[Ql.API_NOT_FOUND]: {
		statusCode: 404,
		troubleshootingUrl: `${$l}/troubleshooting/common-issues#network-errors-api-not-found`,
		visibility: Xl.BANNER,
		severity: Yl.CRITICAL
	},
	[Ql.REMOTE_ENDPOINT_NOT_FOUND]: {
		statusCode: 404,
		troubleshootingUrl: `${$l}/troubleshooting/common-issues#remote-endpoint-not-found-error`,
		visibility: Xl.BANNER,
		severity: Yl.CRITICAL
	},
	[Ql.AUTHENTICATION_ERROR]: {
		statusCode: 401,
		troubleshootingUrl: `${$l}/troubleshooting/common-issues`,
		visibility: Xl.BANNER,
		severity: Yl.CRITICAL
	},
	[Ql.MISUSE]: {
		statusCode: 400,
		troubleshootingUrl: null,
		visibility: Xl.DEV_ONLY,
		severity: Yl.WARNING
	},
	[Ql.UNKNOWN]: {
		statusCode: 500,
		visibility: Xl.TOAST,
		severity: Yl.CRITICAL
	},
	[Ql.CONFIGURATION_ERROR]: {
		statusCode: 400,
		troubleshootingUrl: null,
		severity: Yl.WARNING,
		visibility: Xl.BANNER
	},
	[Ql.MISSING_PUBLIC_API_KEY_ERROR]: {
		statusCode: 400,
		troubleshootingUrl: null,
		severity: Yl.CRITICAL,
		visibility: Xl.BANNER
	},
	[Ql.UPGRADE_REQUIRED_ERROR]: {
		statusCode: 402,
		troubleshootingUrl: null,
		severity: Yl.WARNING,
		visibility: Xl.BANNER
	},
	[Ql.VERSION_MISMATCH]: {
		statusCode: 400,
		troubleshootingUrl: null,
		visibility: Xl.DEV_ONLY,
		severity: Yl.INFO
	}
}, nu = class extends ql {
	constructor({ message: e = "Unknown error occurred", code: t, severity: n, visibility: r }) {
		let i = Zl.COPILOT_ERROR, a = tu[t], { statusCode: o } = a, s = r ?? a.visibility ?? Xl.TOAST, c = n ?? ("severity" in a ? a.severity : void 0);
		super(e, { extensions: {
			name: i,
			statusCode: o,
			code: t,
			visibility: s,
			severity: c,
			troubleshootingUrl: "troubleshootingUrl" in a ? a.troubleshootingUrl : null,
			originalError: {
				message: e,
				stack: (/* @__PURE__ */ Error()).stack
			}
		} }), this.code = t, this.name = i, this.statusCode = o, this.severity = c, this.visibility = s;
	}
}, ru = class extends nu {
	constructor(e = {}) {
		let t = e.url ?? "", n = "";
		t?.includes("/info") ? n = "when fetching CopilotKit info" : t.includes("/actions/execute") ? n = "when attempting to execute actions." : t.includes("/agents/state") ? n = "when attempting to get agent state." : t.includes("/agents/execute") && (n = "when attempting to execute agent(s).");
		let r = e.message ?? (e.url ? `Failed to find CopilotKit API endpoint at url ${e.url} ${n}` : "Failed to find CopilotKit API endpoint."), i = e.code ?? Ql.API_NOT_FOUND, a = `${r}.\n\n${eu(tu[i].troubleshootingUrl)}`;
		super({
			message: a,
			code: i
		}), this.name = Zl.COPILOT_API_DISCOVERY_ERROR;
	}
}, iu = class extends ru {
	constructor(e) {
		let t = e?.message ?? (e?.url ? `Failed to find or contact remote endpoint at url ${e.url}` : "Failed to find or contact remote endpoint"), n = Ql.REMOTE_ENDPOINT_NOT_FOUND;
		super({
			message: t,
			code: n
		}), this.name = Zl.COPILOT_REMOTE_ENDPOINT_DISCOVERY_ERROR;
	}
}, au = class extends nu {
	constructor(e) {
		let { agentName: t, availableAgents: n } = e, r = Ql.AGENT_NOT_FOUND, i = eu(tu[r].troubleshootingUrl), a;
		if (n.length) {
			let e = n.map((e) => e.name).join(", ");
			a = t ? `Agent '${t}' was not found. Available agents are: ${e}. Please verify the agent name in your configuration and ensure it matches one of the available agents.\n\n${i}` : `The requested agent was not found. Available agents are: ${e}. Please verify the agent name in your configuration and ensure it matches one of the available agents.\n\n${i}`;
		} else a = `${t ? `Agent '${t}'` : "The requested agent"} was not found. Please set up at least one agent before proceeding. ${i}`;
		super({
			message: a,
			code: r
		}), this.name = Zl.COPILOT_KIT_AGENT_DISCOVERY_ERROR;
	}
}, ou = class extends nu {
	constructor({ error: e, url: t, message: n }) {
		let r = Ql.NETWORK_ERROR, i = e.code, a = n ?? lu({
			errorCode: i,
			url: t
		});
		super({
			message: a,
			code: r
		}), this.name = Zl.COPILOT_KIT_LOW_LEVEL_ERROR;
	}
}, su = class extends nu {
	constructor(e) {
		super({
			message: e,
			code: Ql.CONFIGURATION_ERROR
		}), this.name = Zl.CONFIGURATION_ERROR, this.severity = Yl.WARNING;
	}
}, cu = class extends su {
	constructor(e) {
		super(e), this.name = Zl.MISSING_PUBLIC_API_KEY_ERROR, this.severity = Yl.CRITICAL;
	}
}, lu = ({ errorCode: e, url: t }) => {
	let n = tu[Ql.NETWORK_ERROR].troubleshootingUrl, r = (e = `Failed to fetch from url ${t}.`) => `${e}.

Possible reasons:
- -The server may have an error preventing it from returning a response (Check the server logs for more info).
- -The server might be down or unreachable
- -There might be a network issue (e.g., DNS failure, connection timeout) 
- -The URL might be incorrect
- -The server is not running on the specified port

${eu(n)}`;
	if (t.includes("/info")) return r(`Failed to fetch CopilotKit agents/action information from url ${t}.`);
	if (t.includes("/actions/execute")) return r(`Fetch call to ${t} to execute actions failed.`);
	if (t.includes("/agents/state")) return r(`Fetch call to ${t} to get agent state failed.`);
	if (t.includes("/agents/execute")) return r(`Fetch call to ${t} to execute agent(s) failed.`);
	switch (e) {
		case "ECONNREFUSED": return `Connection to ${t} was refused. Ensure the server is running and accessible.\n\n${eu(n)}`;
		case "ENOTFOUND": return `The server on ${t} could not be found. Check the URL or your network configuration.\n\n${eu(tu[Ql.NOT_FOUND].troubleshootingUrl)}`;
		case "ETIMEDOUT": return `The connection to ${t} timed out. The server might be overloaded or taking too long to respond.\n\n${eu(n)}`;
		default: return;
	}
};
//#endregion
//#region node_modules/.pnpm/@copilotkit+shared@1.59.2_@ag-ui+core@0.0.53/node_modules/@copilotkit/shared/dist/utils/random-id.mjs
function uu() {
	return "ck-" + Pe();
}
function du() {
	return Pe();
}
function fu(e) {
	if (typeof e == "function") return e.toString();
	if (Array.isArray(e)) return e.map(fu);
	if (typeof e == "object" && e) {
		let t = {};
		for (let n of Object.keys(e)) t[n] = fu(e[n]);
		return t;
	}
	return e;
}
function pu(e, t) {
	let n = "e4b01160-ff74-4c6e-9b27-d53cd930fe8e", r = t ? Re(t, n) : n;
	return Re(typeof e == "string" ? e : JSON.stringify(fu(e)), r);
}
//#endregion
//#region node_modules/.pnpm/partial-json@0.1.7/node_modules/partial-json/dist/options.js
var mu = /* @__PURE__ */ n(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.Allow = e.ALL = e.COLLECTION = e.ATOM = e.SPECIAL = e.INF = e._INFINITY = e.INFINITY = e.NAN = e.BOOL = e.NULL = e.OBJ = e.ARR = e.NUM = e.STR = void 0, e.STR = 1, e.NUM = 2, e.ARR = 4, e.OBJ = 8, e.NULL = 16, e.BOOL = 32, e.NAN = 64, e.INFINITY = 128, e._INFINITY = 256, e.INF = e.INFINITY | e._INFINITY, e.SPECIAL = e.NULL | e.BOOL | e.INF | e.NAN, e.ATOM = e.STR | e.NUM | e.SPECIAL, e.COLLECTION = e.ARR | e.OBJ, e.ALL = e.ATOM | e.COLLECTION, e.Allow = {
		STR: e.STR,
		NUM: e.NUM,
		ARR: e.ARR,
		OBJ: e.OBJ,
		NULL: e.NULL,
		BOOL: e.BOOL,
		NAN: e.NAN,
		INFINITY: e.INFINITY,
		_INFINITY: e._INFINITY,
		INF: e.INF,
		SPECIAL: e.SPECIAL,
		ATOM: e.ATOM,
		COLLECTION: e.COLLECTION,
		ALL: e.ALL
	}, e.default = e.Allow;
})), hu = /* @__PURE__ */ t((/* @__PURE__ */ n(((e) => {
	var t = e && e.__createBinding || (Object.create ? (function(e, t, n, r) {
		r === void 0 && (r = n);
		var i = Object.getOwnPropertyDescriptor(t, n);
		(!i || ("get" in i ? !t.__esModule : i.writable || i.configurable)) && (i = {
			enumerable: !0,
			get: function() {
				return t[n];
			}
		}), Object.defineProperty(e, r, i);
	}) : (function(e, t, n, r) {
		r === void 0 && (r = n), e[r] = t[n];
	})), n = e && e.__exportStar || function(e, n) {
		for (var r in e) r !== "default" && !Object.prototype.hasOwnProperty.call(n, r) && t(n, e, r);
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.Allow = e.MalformedJSON = e.PartialJSON = e.parseJSON = e.parse = void 0;
	var r = mu();
	Object.defineProperty(e, "Allow", {
		enumerable: !0,
		get: function() {
			return r.Allow;
		}
	}), n(mu(), e);
	var i = class extends Error {};
	e.PartialJSON = i;
	var a = class extends Error {};
	e.MalformedJSON = a;
	function o(e, t = r.Allow.ALL) {
		if (typeof e != "string") throw TypeError(`expecting str, got ${typeof e}`);
		if (!e.trim()) throw Error(`${e} is empty`);
		return s(e.trim(), t);
	}
	e.parseJSON = o;
	var s = (e, t) => {
		let n = e.length, o = 0, s = (e) => {
			throw new i(`${e} at position ${o}`);
		}, c = (e) => {
			throw new a(`${e} at position ${o}`);
		}, l = () => (p(), o >= n && s("Unexpected end of input"), e[o] === "\"" ? u() : e[o] === "{" ? d() : e[o] === "[" ? f() : e.substring(o, o + 4) === "null" || r.Allow.NULL & t && n - o < 4 && "null".startsWith(e.substring(o)) ? (o += 4, null) : e.substring(o, o + 4) === "true" || r.Allow.BOOL & t && n - o < 4 && "true".startsWith(e.substring(o)) ? (o += 4, !0) : e.substring(o, o + 5) === "false" || r.Allow.BOOL & t && n - o < 5 && "false".startsWith(e.substring(o)) ? (o += 5, !1) : e.substring(o, o + 8) === "Infinity" || r.Allow.INFINITY & t && n - o < 8 && "Infinity".startsWith(e.substring(o)) ? (o += 8, Infinity) : e.substring(o, o + 9) === "-Infinity" || r.Allow._INFINITY & t && 1 < n - o && n - o < 9 && "-Infinity".startsWith(e.substring(o)) ? (o += 9, -Infinity) : e.substring(o, o + 3) === "NaN" || r.Allow.NAN & t && n - o < 3 && "NaN".startsWith(e.substring(o)) ? (o += 3, NaN) : ee()), u = () => {
			let i = o, a = !1;
			for (o++; o < n && (e[o] !== "\"" || a && e[o - 1] === "\\");) a = e[o] === "\\" ? !a : !1, o++;
			if (e.charAt(o) == "\"") try {
				return JSON.parse(e.substring(i, ++o - Number(a)));
			} catch (e) {
				c(String(e));
			}
			else if (r.Allow.STR & t) try {
				return JSON.parse(e.substring(i, o - Number(a)) + "\"");
			} catch {
				return JSON.parse(e.substring(i, e.lastIndexOf("\\")) + "\"");
			}
			s("Unterminated string literal");
		}, d = () => {
			o++, p();
			let i = {};
			try {
				for (; e[o] !== "}";) {
					if (p(), o >= n && r.Allow.OBJ & t) return i;
					let a = u();
					p(), o++;
					try {
						i[a] = l();
					} catch (e) {
						if (r.Allow.OBJ & t) return i;
						throw e;
					}
					p(), e[o] === "," && o++;
				}
			} catch {
				if (r.Allow.OBJ & t) return i;
				s("Expected '}' at end of object");
			}
			return o++, i;
		}, f = () => {
			o++;
			let n = [];
			try {
				for (; e[o] !== "]";) n.push(l()), p(), e[o] === "," && o++;
			} catch {
				if (r.Allow.ARR & t) return n;
				s("Expected ']' at end of array");
			}
			return o++, n;
		}, ee = () => {
			if (o === 0) {
				e === "-" && c("Not sure what '-' is");
				try {
					return JSON.parse(e);
				} catch (n) {
					if (r.Allow.NUM & t) try {
						return JSON.parse(e.substring(0, e.lastIndexOf("e")));
					} catch {}
					c(String(n));
				}
			}
			let i = o;
			for (e[o] === "-" && o++; e[o] && ",]}".indexOf(e[o]) === -1;) o++;
			o == n && !(r.Allow.NUM & t) && s("Unterminated number literal");
			try {
				return JSON.parse(e.substring(i, o));
			} catch {
				e.substring(i, o) === "-" && s("Not sure what '-' is");
				try {
					return JSON.parse(e.substring(i, e.lastIndexOf("e")));
				} catch (e) {
					c(String(e));
				}
			}
		}, p = () => {
			for (; o < n && " \n\r	".includes(e[o]);) o++;
		};
		return l();
	};
	e.parse = o;
})))(), 1);
function gu(e, t = "unset") {
	try {
		return JSON.parse(e);
	} catch {
		return t === "unset" ? null : t;
	}
}
function _u(e) {
	try {
		let t = hu.parse(e);
		return t && typeof t == "object" && !Array.isArray(t) ? t : {};
	} catch {
		return {};
	}
}
function vu(e, t) {
	return (n) => Math.min(e * 2 ** (n - 1), t);
}
//#endregion
//#region node_modules/.pnpm/@copilotkit+shared@1.59.2_@ag-ui+core@0.0.53/node_modules/@copilotkit/shared/dist/constants/index.mjs
var yu = "https://api.cloud.copilotkit.ai", bu = `${yu}/copilotkit/v1`, xu = "X-CopilotCloud-Public-Api-Key", Su = "default", Cu = {
	enabled: !1,
	events: !1,
	lifecycle: !1,
	verbose: !1
};
function wu(e) {
	if (!e) return Cu;
	if (e === !0) return {
		enabled: !0,
		events: !0,
		lifecycle: !0,
		verbose: !1
	};
	let t = e.events ?? !0, n = e.lifecycle ?? !0, r = t || n;
	return {
		enabled: r,
		events: t,
		lifecycle: n,
		verbose: r && (e.verbose ?? !1)
	};
}
//#endregion
//#region node_modules/.pnpm/@copilotkit+shared@1.59.2_@ag-ui+core@0.0.53/node_modules/@copilotkit/shared/dist/standard-schema.mjs
function Tu(e) {
	let t = e["~standard"];
	return typeof t == "object" && !!t && "jsonSchema" in t && t.jsonSchema != null && typeof t.jsonSchema == "object" && "input" in t.jsonSchema && typeof t.jsonSchema.input == "function";
}
function Eu(e, t) {
	if (Tu(e)) return e["~standard"].jsonSchema.input({ target: "draft-07" });
	if (typeof e.toJSONSchema == "function") return e.toJSONSchema();
	let n = e["~standard"].vendor;
	if (n === "zod" && t?.zodToJsonSchema) return t.zodToJsonSchema(e, { $refStrategy: "none" });
	throw Error(`Cannot convert schema to JSON Schema. The schema (vendor: "${n}") does not implement Standard JSON Schema V1 and no zodToJsonSchema fallback is available. Use a library that supports Standard JSON Schema (e.g., Zod 3.24+, Valibot v1+, ArkType v2+) or pass a zodToJsonSchema function in options.`);
}
//#endregion
//#region node_modules/.pnpm/@copilotkit+shared@1.59.2_@ag-ui+core@0.0.53/node_modules/@copilotkit/shared/dist/attachments/utils.mjs
var Du = 20 * 1024 * 1024;
function Ou(e) {
	return e.startsWith("image/") ? "image" : e.startsWith("audio/") ? "audio" : e.startsWith("video/") ? "video" : "document";
}
function ku(e) {
	return e < 1024 ? `${e} B` : e < 1024 * 1024 ? `${(e / 1024).toFixed(1)} KB` : `${(e / (1024 * 1024)).toFixed(1)} MB`;
}
function Au(e, t = Du) {
	return e.size > t;
}
function ju(e) {
	return new Promise((t, n) => {
		let r = new FileReader();
		r.onload = (e) => {
			let r = (e.target?.result)?.split(",")[1];
			r ? t(r) : n(/* @__PURE__ */ Error("Failed to read file as base64"));
		}, r.onerror = n, r.readAsDataURL(e);
	});
}
function Mu(e) {
	return typeof document > "u" ? Promise.resolve(void 0) : new Promise((t) => {
		let n = !1, r = document.createElement("video"), i = document.createElement("canvas"), a = URL.createObjectURL(e), o = (e) => {
			n || (n = !0, URL.revokeObjectURL(a), t(e));
		}, s = setTimeout(() => {
			console.warn(`[CopilotKit] generateVideoThumbnail: timed out for file "${e.name}"`), o(void 0);
		}, 1e4);
		r.preload = "metadata", r.muted = !0, r.playsInline = !0, r.onloadeddata = () => {
			r.currentTime = .1;
		}, r.onseeked = () => {
			clearTimeout(s), i.width = r.videoWidth, i.height = r.videoHeight;
			let e = i.getContext("2d");
			e ? (e.drawImage(r, 0, 0), o(i.toDataURL("image/jpeg", .7))) : (console.warn("[CopilotKit] generateVideoThumbnail: could not get 2d canvas context"), o(void 0));
		}, r.onerror = () => {
			clearTimeout(s), console.warn(`[CopilotKit] generateVideoThumbnail: video element error for file "${e.name}"`), o(void 0);
		}, r.src = a;
	});
}
function Nu(e, t) {
	return !t || t === "*/*" ? !0 : t.split(",").map((e) => e.trim()).some((t) => {
		if (t.startsWith(".")) return (e.name ?? "").toLowerCase().endsWith(t.toLowerCase());
		if (t.endsWith("/*")) {
			let n = t.slice(0, -2);
			return e.type.startsWith(n + "/");
		}
		return e.type === t;
	});
}
function Pu(e) {
	return e.type === "url" ? e.value : `data:${e.mimeType};base64,${e.value}`;
}
function Fu(e) {
	return e.includes("pdf") ? "PDF" : e.includes("sheet") || e.includes("excel") ? "XLS" : e.includes("presentation") || e.includes("powerpoint") ? "PPT" : e.includes("word") || e.includes("document") ? "DOC" : e.includes("text/") ? "TXT" : "FILE";
}
//#endregion
//#region node_modules/.pnpm/@copilotkit+shared@1.59.2_@ag-ui+core@0.0.53/node_modules/@copilotkit/shared/dist/logger.mjs
var Iu = console, Lu = /* @__PURE__ */ function(e) {
	return e.SERVICE_NOT_CONFIGURED = "service_not_configured", e.INVALID_AUDIO_FORMAT = "invalid_audio_format", e.AUDIO_TOO_LONG = "audio_too_long", e.AUDIO_TOO_SHORT = "audio_too_short", e.RATE_LIMITED = "rate_limited", e.AUTH_FAILED = "auth_failed", e.PROVIDER_ERROR = "provider_error", e.NETWORK_ERROR = "network_error", e.INVALID_REQUEST = "invalid_request", e;
}({}), Ru = "Generate A2UI v0.9 JSON.\n\n## A2UI Protocol Instructions\n\nA2UI (Agent to UI) is a protocol for rendering rich UI surfaces from agent responses.\n\nCRITICAL: You MUST call the render_a2ui tool with ALL of these arguments:\n- surfaceId: A unique ID for the surface (e.g. \"product-comparison\")\n- components: REQUIRED — the A2UI component array. NEVER omit this. Only use\n  components listed in the Available Components schema provided as context.\n- data: OPTIONAL — a JSON object written to the root of the surface data model.\n  Use for pre-filling form values or providing data for path-bound components.\n- every component must have the \"component\" field specifying the component type.\n  ONLY use component names from the Available Components schema — do NOT invent\n  component names or use names not in the schema.\n\nCOMPONENT ID RULES:\n- Exactly one component MUST have id=\"root\". This is the surface's entry\n  point — the renderer begins at \"root\" and walks the child/children tree\n  from there. Every other component must be reachable from \"root\". If no\n  component has id=\"root\", the surface renders an empty loading placeholder\n  and none of your components will be shown.\n- Every component ID must be unique within the surface.\n- A component MUST NOT reference itself as child/children. This causes a\n  circular dependency error. For example, if a component has id=\"avatar\",\n  its child must be a DIFFERENT id (e.g. \"avatar-img\"), never \"avatar\".\n- The child/children tree must be a DAG — no cycles allowed.\n\nREPEATING CONTENT (TEMPLATES):\nTo repeat a component for each item in an array, use the structural children format:\n  children: { componentId: \"card-id\", path: \"/items\" }\nThis tells the renderer to create one instance of \"card-id\" per item in the \"/items\" array.\n\nPATH RULES FOR TEMPLATES:\nComponents inside a repeating template use RELATIVE paths (no leading slash).\nThe path is resolved relative to each array item automatically.\nIf a container has children: { componentId: \"card\", path: \"/items\" } and each item\nhas a key \"name\", use { \"path\": \"name\" } (NO leading slash — relative to item).\nCRITICAL: Do NOT use \"/name\" (absolute) inside templates — use \"name\" (relative).\nThe container's path (\"/items\") uses a leading slash (absolute), but all\ncomponents INSIDE the template use paths WITHOUT leading slash.\n\nCOMPONENT VALUES — DEFAULT RULE:\nUse inline literal values for ALL component properties. Pass strings, numbers,\narrays, and objects directly on the component. Do NOT use { \"path\": \"...\" }\nobjects unless the property's schema explicitly allows it (see exception below).\nCRITICAL: USING { \"path\": \"...\" } ON A PROPERTY THAT DOES NOT DECLARE PATH\nSUPPORT IN ITS SCHEMA WILL CAUSE A RUNTIME CRASH AND BREAK THE ENTIRE UI.\nALWAYS CHECK THE COMPONENT SCHEMA FIRST — IF THE PROPERTY ONLY ACCEPTS A\nPLAIN TYPE, YOU MUST USE A LITERAL VALUE.\nVERY IMPORTANT: THE APPLICATION WILL BREAK IF YOU DO NOT FOLLOW THIS RULE!\n\nFor example, a chart's \"data\" must always be an inline array:\n  \"data\": [{\"label\": \"Jan\", \"value\": 100}, {\"label\": \"Feb\", \"value\": 200}]\nA metric's \"value\" must always be an inline string:\n  \"value\": \"$1,200\"\n\nPATH BINDING EXCEPTION — SCHEMA-DRIVEN:\nA few properties accept { \"path\": \"/some/path\" } as an alternative to a literal\nvalue. You can identify these in the Available Components schema: the property\nwill list BOTH a literal type AND an object-with-path option. If a property only\nshows a single type (string, number, array, etc.), it does NOT support path\nbinding — use a literal value only.\n\nPath binding is typically used for editable form inputs so the client can write\nuser input back to the data model. When building forms:\n- Bind input \"value\" to a data model path: \"value\": { \"path\": \"/form/name\" }\n- Pre-fill via the \"data\" tool argument: \"data\": { \"form\": { \"name\": \"Alice\" } }\n- Capture values on submit via button action context:\n    \"action\": { \"event\": { \"name\": \"submit\", \"context\": { \"name\": { \"path\": \"/form/name\" } } } }\n\nREPEATING CONTENT uses a structural children format (not the same as value binding):\n  children: { componentId: \"card-id\", path: \"/items\" }\nComponents inside templates use RELATIVE paths (no leading slash): { \"path\": \"name\" }.", zu = "Create polished, visually appealing interfaces. ONLY use components listed in the\nAvailable Components schema — do NOT use component names that are not in the schema.\n\nDesign principles:\n- Create clear visual hierarchy within cards and layouts.\n- Keep cards clean — avoid clutter. Whitespace is good.\n- Use consistent surfaceIds (lowercase, hyphenated).\n- NEVER use the same ID for a component and its child — this creates a\n  circular dependency. E.g. if id=\"avatar\", child must NOT be \"avatar\".\n- For side-by-side comparisons, use a container with structural children\n  (children: { componentId, path }) to repeat a card template per data item.\n- Include images when relevant (logos, icons, product photos):\n  - Prefer company logos via Google favicons: https://www.google.com/s2/favicons?domain=example.com&sz=128\n  - Do NOT invent Unsplash photo-IDs — they will 404. Only use real, known URLs.\n- For buttons: action MUST use this exact nested format:\n    \"action\": { \"event\": { \"name\": \"myAction\", \"context\": { \"key\": \"value\" } } }\n  The \"event\" key holds an OBJECT with \"name\" (required) and \"context\" (optional).\n  Do NOT use a flat format like {\"event\": \"name\"} — \"event\" must be an object.\n- For forms: check the component schema — if an input's \"value\" property\n  supports path binding, use it for editable fields. The submit button's\n  action context should reference the same paths to capture user input.\n\nUse the SAME surfaceId as the main surface. Match action names to button action event names.";
//#endregion
//#region node_modules/.pnpm/@copilotkit+shared@1.59.2_@ag-ui+core@0.0.53/node_modules/@copilotkit/shared/dist/index.mjs
function Bu(e) {
	return {
		status: null,
		license: null,
		checkFeature: () => !0,
		getLimit: () => null
	};
}
//#endregion
//#region node_modules/.pnpm/phoenix@1.8.7/node_modules/phoenix/priv/static/phoenix.mjs
var Vu = (e) => typeof e == "function" ? e : function() {
	return e;
}, Hu = typeof self < "u" ? self : null, Uu = typeof window < "u" ? window : null, Wu = Hu || Uu || globalThis, Gu = "2.0.0", Ku = {
	connecting: 0,
	open: 1,
	closing: 2,
	closed: 3
}, qu = 100, Ju = 1e4, Yu = 1e3, Xu = {
	closed: "closed",
	errored: "errored",
	joined: "joined",
	joining: "joining",
	leaving: "leaving"
}, Zu = {
	close: "phx_close",
	error: "phx_error",
	join: "phx_join",
	reply: "phx_reply",
	leave: "phx_leave"
}, Qu = {
	longpoll: "longpoll",
	websocket: "websocket"
}, $u = { complete: 4 }, ed = "base64url.bearer.phx.", td = class {
	constructor(e, t, n, r) {
		this.channel = e, this.event = t, this.payload = n || function() {
			return {};
		}, this.receivedResp = null, this.timeout = r, this.timeoutTimer = null, this.recHooks = [], this.sent = !1;
	}
	resend(e) {
		this.timeout = e, this.reset(), this.send();
	}
	send() {
		this.hasReceived("timeout") || (this.startTimeout(), this.sent = !0, this.channel.socket.push({
			topic: this.channel.topic,
			event: this.event,
			payload: this.payload(),
			ref: this.ref,
			join_ref: this.channel.joinRef()
		}));
	}
	receive(e, t) {
		return this.hasReceived(e) && t(this.receivedResp.response), this.recHooks.push({
			status: e,
			callback: t
		}), this;
	}
	reset() {
		this.cancelRefEvent(), this.ref = null, this.refEvent = null, this.receivedResp = null, this.sent = !1;
	}
	matchReceive({ status: e, response: t, _ref: n }) {
		this.recHooks.filter((t) => t.status === e).forEach((e) => e.callback(t));
	}
	cancelRefEvent() {
		this.refEvent && this.channel.off(this.refEvent);
	}
	cancelTimeout() {
		clearTimeout(this.timeoutTimer), this.timeoutTimer = null;
	}
	startTimeout() {
		this.timeoutTimer && this.cancelTimeout(), this.ref = this.channel.socket.makeRef(), this.refEvent = this.channel.replyEventName(this.ref), this.channel.on(this.refEvent, (e) => {
			this.cancelRefEvent(), this.cancelTimeout(), this.receivedResp = e, this.matchReceive(e);
		}), this.timeoutTimer = setTimeout(() => {
			this.trigger("timeout", {});
		}, this.timeout);
	}
	hasReceived(e) {
		return this.receivedResp && this.receivedResp.status === e;
	}
	trigger(e, t) {
		this.channel.trigger(this.refEvent, {
			status: e,
			response: t
		});
	}
}, nd = class {
	constructor(e, t) {
		this.callback = e, this.timerCalc = t, this.timer = null, this.tries = 0;
	}
	reset() {
		this.tries = 0, clearTimeout(this.timer);
	}
	scheduleTimeout() {
		clearTimeout(this.timer), this.timer = setTimeout(() => {
			this.tries += 1, this.callback();
		}, this.timerCalc(this.tries + 1));
	}
}, rd = class {
	constructor(e, t, n) {
		this.state = Xu.closed, this.topic = e, this.params = Vu(t || {}), this.socket = n, this.bindings = [], this.bindingRef = 0, this.timeout = this.socket.timeout, this.joinedOnce = !1, this.joinPush = new td(this, Zu.join, this.params, this.timeout), this.pushBuffer = [], this.stateChangeRefs = [], this.rejoinTimer = new nd(() => {
			this.socket.isConnected() && this.rejoin();
		}, this.socket.rejoinAfterMs), this.stateChangeRefs.push(this.socket.onError(() => this.rejoinTimer.reset())), this.stateChangeRefs.push(this.socket.onOpen(() => {
			this.rejoinTimer.reset(), this.isErrored() && this.rejoin();
		})), this.joinPush.receive("ok", () => {
			this.state = Xu.joined, this.rejoinTimer.reset(), this.pushBuffer.forEach((e) => e.send()), this.pushBuffer = [];
		}), this.joinPush.receive("error", () => {
			this.state = Xu.errored, this.socket.isConnected() && this.rejoinTimer.scheduleTimeout();
		}), this.onClose(() => {
			this.rejoinTimer.reset(), this.socket.hasLogger() && this.socket.log("channel", `close ${this.topic} ${this.joinRef()}`), this.state = Xu.closed, this.socket.remove(this);
		}), this.onError((e) => {
			this.socket.hasLogger() && this.socket.log("channel", `error ${this.topic}`, e), this.isJoining() && this.joinPush.reset(), this.state = Xu.errored, this.socket.isConnected() && this.rejoinTimer.scheduleTimeout();
		}), this.joinPush.receive("timeout", () => {
			this.socket.hasLogger() && this.socket.log("channel", `timeout ${this.topic} (${this.joinRef()})`, this.joinPush.timeout), new td(this, Zu.leave, Vu({}), this.timeout).send(), this.state = Xu.errored, this.joinPush.reset(), this.socket.isConnected() && this.rejoinTimer.scheduleTimeout();
		}), this.on(Zu.reply, (e, t) => {
			this.trigger(this.replyEventName(t), e);
		});
	}
	join(e = this.timeout) {
		if (this.joinedOnce) throw Error("tried to join multiple times. 'join' can only be called a single time per channel instance");
		return this.timeout = e, this.joinedOnce = !0, this.rejoin(), this.joinPush;
	}
	onClose(e) {
		this.on(Zu.close, e);
	}
	onError(e) {
		return this.on(Zu.error, (t) => e(t));
	}
	on(e, t) {
		let n = this.bindingRef++;
		return this.bindings.push({
			event: e,
			ref: n,
			callback: t
		}), n;
	}
	off(e, t) {
		this.bindings = this.bindings.filter((n) => !(n.event === e && (t === void 0 || t === n.ref)));
	}
	canPush() {
		return this.socket.isConnected() && this.isJoined();
	}
	push(e, t, n = this.timeout) {
		if (t ||= {}, !this.joinedOnce) throw Error(`tried to push '${e}' to '${this.topic}' before joining. Use channel.join() before pushing events`);
		let r = new td(this, e, function() {
			return t;
		}, n);
		return this.canPush() ? r.send() : (r.startTimeout(), this.pushBuffer.push(r)), r;
	}
	leave(e = this.timeout) {
		this.rejoinTimer.reset(), this.joinPush.cancelTimeout(), this.state = Xu.leaving;
		let t = () => {
			this.socket.hasLogger() && this.socket.log("channel", `leave ${this.topic}`), this.trigger(Zu.close, "leave");
		}, n = new td(this, Zu.leave, Vu({}), e);
		return n.receive("ok", () => t()).receive("timeout", () => t()), n.send(), this.canPush() || n.trigger("ok", {}), n;
	}
	onMessage(e, t, n) {
		return t;
	}
	isMember(e, t, n, r) {
		return this.topic === e ? r && r !== this.joinRef() ? (this.socket.hasLogger() && this.socket.log("channel", "dropping outdated message", {
			topic: e,
			event: t,
			payload: n,
			joinRef: r
		}), !1) : !0 : !1;
	}
	joinRef() {
		return this.joinPush.ref;
	}
	rejoin(e = this.timeout) {
		this.isLeaving() || (this.socket.leaveOpenTopic(this.topic), this.state = Xu.joining, this.joinPush.resend(e));
	}
	trigger(e, t, n, r) {
		let i = this.onMessage(e, t, n, r);
		if (t && !i) throw Error("channel onMessage callbacks must return the payload, modified or unmodified");
		let a = this.bindings.filter((t) => t.event === e);
		for (let e = 0; e < a.length; e++) a[e].callback(i, n, r || this.joinRef());
	}
	replyEventName(e) {
		return `chan_reply_${e}`;
	}
	isClosed() {
		return this.state === Xu.closed;
	}
	isErrored() {
		return this.state === Xu.errored;
	}
	isJoined() {
		return this.state === Xu.joined;
	}
	isJoining() {
		return this.state === Xu.joining;
	}
	isLeaving() {
		return this.state === Xu.leaving;
	}
}, id = class {
	static request(e, t, n, r, i, a, o) {
		if (Wu.XDomainRequest) {
			let n = new Wu.XDomainRequest();
			return this.xdomainRequest(n, e, t, r, i, a, o);
		} else if (Wu.XMLHttpRequest) {
			let s = new Wu.XMLHttpRequest();
			return this.xhrRequest(s, e, t, n, r, i, a, o);
		} else if (Wu.fetch && Wu.AbortController) return this.fetchRequest(e, t, n, r, i, a, o);
		else throw Error("No suitable XMLHttpRequest implementation found");
	}
	static fetchRequest(e, t, n, r, i, a, o) {
		let s = {
			method: e,
			headers: n,
			body: r
		}, c = null;
		return i && (c = new AbortController(), setTimeout(() => c.abort(), i), s.signal = c.signal), Wu.fetch(t, s).then((e) => e.text()).then((e) => this.parseJSON(e)).then((e) => o && o(e)).catch((e) => {
			e.name === "AbortError" && a ? a() : o && o(null);
		}), c;
	}
	static xdomainRequest(e, t, n, r, i, a, o) {
		return e.timeout = i, e.open(t, n), e.onload = () => {
			let t = this.parseJSON(e.responseText);
			o && o(t);
		}, a && (e.ontimeout = a), e.onprogress = () => {}, e.send(r), e;
	}
	static xhrRequest(e, t, n, r, i, a, o, s) {
		e.open(t, n, !0), e.timeout = a;
		for (let [t, n] of Object.entries(r)) e.setRequestHeader(t, n);
		return e.onerror = () => s && s(null), e.onreadystatechange = () => {
			e.readyState === $u.complete && s && s(this.parseJSON(e.responseText));
		}, o && (e.ontimeout = o), e.send(i), e;
	}
	static parseJSON(e) {
		if (!e || e === "") return null;
		try {
			return JSON.parse(e);
		} catch {
			return console && console.log("failed to parse JSON response", e), null;
		}
	}
	static serialize(e, t) {
		let n = [];
		for (var r in e) {
			if (!Object.prototype.hasOwnProperty.call(e, r)) continue;
			let i = t ? `${t}[${r}]` : r, a = e[r];
			typeof a == "object" ? n.push(this.serialize(a, i)) : n.push(encodeURIComponent(i) + "=" + encodeURIComponent(a));
		}
		return n.join("&");
	}
	static appendParams(e, t) {
		return Object.keys(t).length === 0 ? e : `${e}${e.match(/\?/) ? "&" : "?"}${this.serialize(t)}`;
	}
}, ad = (e) => {
	let t = "", n = new Uint8Array(e), r = n.byteLength;
	for (let e = 0; e < r; e++) t += String.fromCharCode(n[e]);
	return btoa(t);
}, od = class {
	constructor(e, t) {
		t && t.length === 2 && t[1].startsWith(ed) && (this.authToken = atob(t[1].slice(ed.length))), this.endPoint = null, this.token = null, this.skipHeartbeat = !0, this.reqs = /* @__PURE__ */ new Set(), this.awaitingBatchAck = !1, this.currentBatch = null, this.currentBatchTimer = null, this.batchBuffer = [], this.onopen = function() {}, this.onerror = function() {}, this.onmessage = function() {}, this.onclose = function() {}, this.pollEndpoint = this.normalizeEndpoint(e), this.readyState = Ku.connecting, setTimeout(() => this.poll(), 0);
	}
	normalizeEndpoint(e) {
		return e.replace("ws://", "http://").replace("wss://", "https://").replace(RegExp("(.*)/" + Qu.websocket), "$1/" + Qu.longpoll);
	}
	endpointURL() {
		return id.appendParams(this.pollEndpoint, { token: this.token });
	}
	closeAndRetry(e, t, n) {
		this.close(e, t, n), this.readyState = Ku.connecting;
	}
	ontimeout() {
		this.onerror("timeout"), this.closeAndRetry(1005, "timeout", !1);
	}
	isActive() {
		return this.readyState === Ku.open || this.readyState === Ku.connecting;
	}
	poll() {
		let e = { Accept: "application/json" };
		this.authToken && (e["X-Phoenix-AuthToken"] = this.authToken), this.ajax("GET", e, null, () => this.ontimeout(), (e) => {
			if (e) {
				var { status: t, token: n, messages: r } = e;
				if (t === 410 && this.token !== null) {
					this.onerror(410), this.closeAndRetry(3410, "session_gone", !1);
					return;
				}
				this.token = n;
			} else t = 0;
			switch (t) {
				case 200:
					r.forEach((e) => {
						setTimeout(() => this.onmessage({ data: e }), 0);
					}), this.poll();
					break;
				case 204:
					this.poll();
					break;
				case 410:
					this.readyState = Ku.open, this.onopen({}), this.poll();
					break;
				case 403:
					this.onerror(403), this.close(1008, "forbidden", !1);
					break;
				case 0:
				case 500:
					this.onerror(500), this.closeAndRetry(1011, "internal server error", 500);
					break;
				default: throw Error(`unhandled poll status ${t}`);
			}
		});
	}
	send(e) {
		typeof e != "string" && (e = ad(e)), this.currentBatch ? this.currentBatch.push(e) : this.awaitingBatchAck ? this.batchBuffer.push(e) : (this.currentBatch = [e], this.currentBatchTimer = setTimeout(() => {
			this.batchSend(this.currentBatch), this.currentBatch = null;
		}, 0));
	}
	batchSend(e, t = 0) {
		this.awaitingBatchAck = !0;
		let n = t + qu, r = e.slice(t, n);
		this.ajax("POST", { "Content-Type": "application/x-ndjson" }, r.join("\n"), () => this.onerror("timeout"), (t) => {
			!t || t.status !== 200 ? (this.awaitingBatchAck = !1, this.onerror(t && t.status), this.closeAndRetry(1011, "internal server error", !1)) : n < e.length ? this.batchSend(e, n) : this.batchBuffer.length > 0 ? (this.batchSend(this.batchBuffer), this.batchBuffer = []) : this.awaitingBatchAck = !1;
		});
	}
	close(e, t, n) {
		for (let e of this.reqs) e.abort();
		this.readyState = Ku.closed;
		let r = Object.assign({
			code: 1e3,
			reason: void 0,
			wasClean: !0
		}, {
			code: e,
			reason: t,
			wasClean: n
		});
		this.batchBuffer = [], clearTimeout(this.currentBatchTimer), this.currentBatchTimer = null, typeof CloseEvent < "u" ? this.onclose(new CloseEvent("close", r)) : this.onclose(r);
	}
	ajax(e, t, n, r, i) {
		let a;
		a = id.request(e, this.endpointURL(), t, n, this.timeout, () => {
			this.reqs.delete(a), r();
		}, (e) => {
			this.reqs.delete(a), this.isActive() && i(e);
		}), this.reqs.add(a);
	}
}, sd = {
	HEADER_LENGTH: 1,
	META_LENGTH: 4,
	KINDS: {
		push: 0,
		reply: 1,
		broadcast: 2
	},
	encode(e, t) {
		if (e.payload.constructor === ArrayBuffer) return t(this.binaryEncode(e));
		{
			let n = [
				e.join_ref,
				e.ref,
				e.topic,
				e.event,
				e.payload
			];
			return t(JSON.stringify(n));
		}
	},
	decode(e, t) {
		if (e.constructor === ArrayBuffer) return t(this.binaryDecode(e));
		{
			let [n, r, i, a, o] = JSON.parse(e);
			return t({
				join_ref: n,
				ref: r,
				topic: i,
				event: a,
				payload: o
			});
		}
	},
	binaryEncode(e) {
		let { join_ref: t, ref: n, event: r, topic: i, payload: a } = e, o = new TextEncoder(), s = o.encode(t), c = o.encode(n), l = o.encode(i), u = o.encode(r);
		this.assertFieldSize(s.byteLength, "join_ref"), this.assertFieldSize(c.byteLength, "ref"), this.assertFieldSize(l.byteLength, "topic"), this.assertFieldSize(u.byteLength, "event");
		let d = this.META_LENGTH + s.byteLength + c.byteLength + l.byteLength + u.byteLength, f = new ArrayBuffer(this.HEADER_LENGTH + d), ee = new Uint8Array(f), p = new DataView(f), m = 0;
		p.setUint8(m++, this.KINDS.push), p.setUint8(m++, s.byteLength), p.setUint8(m++, c.byteLength), p.setUint8(m++, l.byteLength), p.setUint8(m++, u.byteLength), ee.set(s, m), m += s.byteLength, ee.set(c, m), m += c.byteLength, ee.set(l, m), m += l.byteLength, ee.set(u, m), m += u.byteLength;
		var te = new Uint8Array(f.byteLength + a.byteLength);
		return te.set(ee, 0), te.set(new Uint8Array(a), f.byteLength), te.buffer;
	},
	assertFieldSize(e, t) {
		if (e > 255) throw Error(`unable to convert ${t} to binary: must be less than or equal to 255 bytes, but is ${e} bytes`);
	},
	binaryDecode(e) {
		let t = new DataView(e), n = t.getUint8(0), r = new TextDecoder();
		switch (n) {
			case this.KINDS.push: return this.decodePush(e, t, r);
			case this.KINDS.reply: return this.decodeReply(e, t, r);
			case this.KINDS.broadcast: return this.decodeBroadcast(e, t, r);
		}
	},
	decodePush(e, t, n) {
		let r = t.getUint8(1), i = t.getUint8(2), a = t.getUint8(3), o = this.HEADER_LENGTH + this.META_LENGTH - 1, s = n.decode(e.slice(o, o + r));
		o += r;
		let c = n.decode(e.slice(o, o + i));
		o += i;
		let l = n.decode(e.slice(o, o + a));
		return o += a, {
			join_ref: s,
			ref: null,
			topic: c,
			event: l,
			payload: e.slice(o, e.byteLength)
		};
	},
	decodeReply(e, t, n) {
		let r = t.getUint8(1), i = t.getUint8(2), a = t.getUint8(3), o = t.getUint8(4), s = this.HEADER_LENGTH + this.META_LENGTH, c = n.decode(e.slice(s, s + r));
		s += r;
		let l = n.decode(e.slice(s, s + i));
		s += i;
		let u = n.decode(e.slice(s, s + a));
		s += a;
		let d = n.decode(e.slice(s, s + o));
		s += o;
		let f = {
			status: d,
			response: e.slice(s, e.byteLength)
		};
		return {
			join_ref: c,
			ref: l,
			topic: u,
			event: Zu.reply,
			payload: f
		};
	},
	decodeBroadcast(e, t, n) {
		let r = t.getUint8(1), i = t.getUint8(2), a = this.HEADER_LENGTH + 2, o = n.decode(e.slice(a, a + r));
		a += r;
		let s = n.decode(e.slice(a, a + i));
		return a += i, {
			join_ref: null,
			ref: null,
			topic: o,
			event: s,
			payload: e.slice(a, e.byteLength)
		};
	}
}, cd = class {
	constructor(e, t = {}) {
		this.stateChangeCallbacks = {
			open: [],
			close: [],
			error: [],
			message: []
		}, this.channels = [], this.sendBuffer = [], this.ref = 0, this.fallbackRef = null, this.timeout = t.timeout || Ju, this.transport = t.transport || Wu.WebSocket || od, this.primaryPassedHealthCheck = !1, this.longPollFallbackMs = t.longPollFallbackMs, this.fallbackTimer = null, this.sessionStore = t.sessionStorage || Wu && Wu.sessionStorage, this.establishedConnections = 0, this.defaultEncoder = sd.encode.bind(sd), this.defaultDecoder = sd.decode.bind(sd), this.closeWasClean = !0, this.disconnecting = !1, this.binaryType = t.binaryType || "arraybuffer", this.connectClock = 1, this.pageHidden = !1, this.transport === od ? (this.encode = this.defaultEncoder, this.decode = this.defaultDecoder) : (this.encode = t.encode || this.defaultEncoder, this.decode = t.decode || this.defaultDecoder);
		let n = null;
		Uu && Uu.addEventListener && (Uu.addEventListener("pagehide", (e) => {
			this.conn && (this.disconnect(), n = this.connectClock);
		}), Uu.addEventListener("pageshow", (e) => {
			n === this.connectClock && (n = null, this.connect());
		}), Uu.addEventListener("visibilitychange", () => {
			document.visibilityState === "hidden" ? this.pageHidden = !0 : (this.pageHidden = !1, !this.isConnected() && !this.closeWasClean && this.teardown(() => this.connect()));
		})), this.heartbeatIntervalMs = t.heartbeatIntervalMs || 3e4, this.rejoinAfterMs = (e) => t.rejoinAfterMs ? t.rejoinAfterMs(e) : [
			1e3,
			2e3,
			5e3
		][e - 1] || 1e4, this.reconnectAfterMs = (e) => t.reconnectAfterMs ? t.reconnectAfterMs(e) : [
			10,
			50,
			100,
			150,
			200,
			250,
			500,
			1e3,
			2e3
		][e - 1] || 5e3, this.logger = t.logger || null, !this.logger && t.debug && (this.logger = (e, t, n) => {
			console.log(`${e}: ${t}`, n);
		}), this.longpollerTimeout = t.longpollerTimeout || 2e4, this.params = Vu(t.params || {}), this.endPoint = `${e}/${Qu.websocket}`, this.vsn = t.vsn || Gu, this.heartbeatTimeoutTimer = null, this.heartbeatTimer = null, this.pendingHeartbeatRef = null, this.reconnectTimer = new nd(() => {
			if (this.pageHidden) {
				this.log("Not reconnecting as page is hidden!"), this.teardown();
				return;
			}
			this.teardown(() => this.connect());
		}, this.reconnectAfterMs), this.authToken = t.authToken;
	}
	getLongPollTransport() {
		return od;
	}
	replaceTransport(e) {
		this.connectClock++, this.closeWasClean = !0, clearTimeout(this.fallbackTimer), this.reconnectTimer.reset(), this.conn &&= (this.conn.close(), null), this.transport = e;
	}
	protocol() {
		return location.protocol.match(/^https/) ? "wss" : "ws";
	}
	endPointURL() {
		let e = id.appendParams(id.appendParams(this.endPoint, this.params()), { vsn: this.vsn });
		return e.charAt(0) === "/" ? e.charAt(1) === "/" ? `${this.protocol()}:${e}` : `${this.protocol()}://${location.host}${e}` : e;
	}
	disconnect(e, t, n) {
		this.connectClock++, this.disconnecting = !0, this.closeWasClean = !0, clearTimeout(this.fallbackTimer), this.reconnectTimer.reset(), this.teardown(() => {
			this.disconnecting = !1, e && e();
		}, t, n);
	}
	connect(e) {
		e && (console && console.log("passing params to connect is deprecated. Instead pass :params to the Socket constructor"), this.params = Vu(e)), !(this.conn && !this.disconnecting) && (this.longPollFallbackMs && this.transport !== od ? this.connectWithFallback(od, this.longPollFallbackMs) : this.transportConnect());
	}
	log(e, t, n) {
		this.logger && this.logger(e, t, n);
	}
	hasLogger() {
		return this.logger !== null;
	}
	onOpen(e) {
		let t = this.makeRef();
		return this.stateChangeCallbacks.open.push([t, e]), t;
	}
	onClose(e) {
		let t = this.makeRef();
		return this.stateChangeCallbacks.close.push([t, e]), t;
	}
	onError(e) {
		let t = this.makeRef();
		return this.stateChangeCallbacks.error.push([t, e]), t;
	}
	onMessage(e) {
		let t = this.makeRef();
		return this.stateChangeCallbacks.message.push([t, e]), t;
	}
	ping(e) {
		if (!this.isConnected()) return !1;
		let t = this.makeRef(), n = Date.now();
		this.push({
			topic: "phoenix",
			event: "heartbeat",
			payload: {},
			ref: t
		});
		let r = this.onMessage((i) => {
			i.ref === t && (this.off([r]), e(Date.now() - n));
		});
		return !0;
	}
	transportName(e) {
		switch (e) {
			case od: return "LongPoll";
			default: return e.name;
		}
	}
	transportConnect() {
		this.connectClock++, this.closeWasClean = !1;
		let e;
		this.authToken && (e = ["phoenix", `${ed}${btoa(this.authToken).replace(/=/g, "")}`]), this.conn = new this.transport(this.endPointURL(), e), this.conn.binaryType = this.binaryType, this.conn.timeout = this.longpollerTimeout, this.conn.onopen = () => this.onConnOpen(), this.conn.onerror = (e) => this.onConnError(e), this.conn.onmessage = (e) => this.onConnMessage(e), this.conn.onclose = (e) => this.onConnClose(e);
	}
	getSession(e) {
		return this.sessionStore && this.sessionStore.getItem(e);
	}
	storeSession(e, t) {
		this.sessionStore && this.sessionStore.setItem(e, t);
	}
	connectWithFallback(e, t = 2500) {
		clearTimeout(this.fallbackTimer);
		let n = !1, r = !0, i, a = this.transportName(e), o = (t) => {
			this.log("transport", `falling back to ${a}...`, t), this.off([void 0, i]), r = !1, this.replaceTransport(e), this.transportConnect();
		};
		if (this.getSession(`phx:fallback:${a}`)) return o("memorized");
		this.fallbackTimer = setTimeout(o, t), i = this.onError((e) => {
			this.log("transport", "error", e), r && !n && (clearTimeout(this.fallbackTimer), o(e));
		}), this.fallbackRef && this.off([this.fallbackRef]), this.fallbackRef = this.onOpen(() => {
			if (n = !0, !r) {
				let t = this.transportName(e);
				return this.primaryPassedHealthCheck || this.storeSession(`phx:fallback:${t}`, "true"), this.log("transport", `established ${t} fallback`);
			}
			clearTimeout(this.fallbackTimer), this.fallbackTimer = setTimeout(o, t), this.ping((e) => {
				this.log("transport", "connected to primary after", e), this.primaryPassedHealthCheck = !0, clearTimeout(this.fallbackTimer);
			});
		}), this.transportConnect();
	}
	clearHeartbeats() {
		clearTimeout(this.heartbeatTimer), clearTimeout(this.heartbeatTimeoutTimer);
	}
	onConnOpen() {
		this.hasLogger() && this.log("transport", `${this.transportName(this.transport)} connected to ${this.endPointURL()}`), this.closeWasClean = !1, this.disconnecting = !1, this.establishedConnections++, this.flushSendBuffer(), this.reconnectTimer.reset(), this.resetHeartbeat(), this.stateChangeCallbacks.open.forEach(([, e]) => e());
	}
	heartbeatTimeout() {
		this.pendingHeartbeatRef && (this.pendingHeartbeatRef = null, this.hasLogger() && this.log("transport", "heartbeat timeout. Attempting to re-establish connection"), this.triggerChanError(), this.closeWasClean = !1, this.teardown(() => this.reconnectTimer.scheduleTimeout(), Yu, "heartbeat timeout"));
	}
	resetHeartbeat() {
		this.conn && this.conn.skipHeartbeat || (this.pendingHeartbeatRef = null, this.clearHeartbeats(), this.heartbeatTimer = setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs));
	}
	teardown(e, t, n) {
		if (!this.conn) return e && e();
		let r = this.conn;
		this.waitForBufferDone(r, () => {
			t ? r.close(t, n || "") : r.close(), this.waitForSocketClosed(r, () => {
				this.conn === r && (this.conn.onopen = function() {}, this.conn.onerror = function() {}, this.conn.onmessage = function() {}, this.conn.onclose = function() {}, this.conn = null), e && e();
			});
		});
	}
	waitForBufferDone(e, t, n = 1) {
		if (n === 5 || !e.bufferedAmount) {
			t();
			return;
		}
		setTimeout(() => {
			this.waitForBufferDone(e, t, n + 1);
		}, 150 * n);
	}
	waitForSocketClosed(e, t, n = 1) {
		if (n === 5 || e.readyState === Ku.closed) {
			t();
			return;
		}
		setTimeout(() => {
			this.waitForSocketClosed(e, t, n + 1);
		}, 150 * n);
	}
	onConnClose(e) {
		this.conn && (this.conn.onclose = () => {});
		let t = e && e.code;
		this.hasLogger() && this.log("transport", "close", e), this.triggerChanError(), this.clearHeartbeats(), !this.closeWasClean && t !== 1e3 && this.reconnectTimer.scheduleTimeout(), this.stateChangeCallbacks.close.forEach(([, t]) => t(e));
	}
	onConnError(e) {
		this.hasLogger() && this.log("transport", "error", e);
		let t = this.transport, n = this.establishedConnections;
		this.stateChangeCallbacks.error.forEach(([, r]) => {
			r(e, t, n);
		}), (t === this.transport || n > 0) && this.triggerChanError();
	}
	triggerChanError() {
		this.channels.forEach((e) => {
			e.isErrored() || e.isLeaving() || e.isClosed() || e.trigger(Zu.error);
		});
	}
	connectionState() {
		switch (this.conn && this.conn.readyState) {
			case Ku.connecting: return "connecting";
			case Ku.open: return "open";
			case Ku.closing: return "closing";
			default: return "closed";
		}
	}
	isConnected() {
		return this.connectionState() === "open";
	}
	remove(e) {
		this.off(e.stateChangeRefs), this.channels = this.channels.filter((t) => t !== e);
	}
	off(e) {
		for (let t in this.stateChangeCallbacks) this.stateChangeCallbacks[t] = this.stateChangeCallbacks[t].filter(([t]) => e.indexOf(t) === -1);
	}
	channel(e, t = {}) {
		let n = new rd(e, t, this);
		return this.channels.push(n), n;
	}
	push(e) {
		if (this.hasLogger()) {
			let { topic: t, event: n, payload: r, ref: i, join_ref: a } = e;
			this.log("push", `${t} ${n} (${a}, ${i})`, r);
		}
		this.isConnected() ? this.encode(e, (e) => this.conn.send(e)) : this.sendBuffer.push(() => this.encode(e, (e) => this.conn.send(e)));
	}
	makeRef() {
		let e = this.ref + 1;
		return e === this.ref ? this.ref = 0 : this.ref = e, this.ref.toString();
	}
	sendHeartbeat() {
		this.pendingHeartbeatRef && !this.isConnected() || (this.pendingHeartbeatRef = this.makeRef(), this.push({
			topic: "phoenix",
			event: "heartbeat",
			payload: {},
			ref: this.pendingHeartbeatRef
		}), this.heartbeatTimeoutTimer = setTimeout(() => this.heartbeatTimeout(), this.heartbeatIntervalMs));
	}
	flushSendBuffer() {
		this.isConnected() && this.sendBuffer.length > 0 && (this.sendBuffer.forEach((e) => e()), this.sendBuffer = []);
	}
	onConnMessage(e) {
		this.decode(e.data, (e) => {
			let { topic: t, event: n, payload: r, ref: i, join_ref: a } = e;
			i && i === this.pendingHeartbeatRef && (this.clearHeartbeats(), this.pendingHeartbeatRef = null, this.heartbeatTimer = setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs)), this.hasLogger() && this.log("receive", `${r.status || ""} ${t} ${n} ${i && "(" + i + ")" || ""}`, r);
			for (let e = 0; e < this.channels.length; e++) {
				let o = this.channels[e];
				o.isMember(t, n, r, a) && o.trigger(n, r, i, a);
			}
			for (let t = 0; t < this.stateChangeCallbacks.message.length; t++) {
				let [, n] = this.stateChangeCallbacks.message[t];
				n(e);
			}
		});
	}
	leaveOpenTopic(e) {
		let t = this.channels.find((t) => t.topic === e && (t.isJoined() || t.isJoining()));
		t && (this.hasLogger() && this.log("transport", `leaving duplicate topic "${e}"`), t.leave());
	}
}, ld = Symbol("Let zodToJsonSchema decide on which parser to use"), ud = {
	name: void 0,
	$refStrategy: "root",
	basePath: ["#"],
	effectStrategy: "input",
	pipeStrategy: "all",
	dateStrategy: "format:date-time",
	mapStrategy: "entries",
	removeAdditionalStrategy: "passthrough",
	allowedAdditionalProperties: !0,
	rejectedAdditionalProperties: !1,
	definitionPath: "definitions",
	target: "jsonSchema7",
	strictUnions: !1,
	definitions: {},
	errorMessages: !1,
	markdownDescription: !1,
	patternStrategy: "escape",
	applyRegexFlags: !1,
	emailStrategy: "format:email",
	base64Strategy: "contentEncoding:base64",
	nameStrategy: "ref",
	openAiAnyTypeName: "OpenAiAnyType"
}, dd = (e) => typeof e == "string" ? {
	...ud,
	name: e
} : {
	...ud,
	...e
}, fd = (e) => {
	let t = dd(e), n = t.name === void 0 ? t.basePath : [
		...t.basePath,
		t.definitionPath,
		t.name
	];
	return {
		...t,
		flags: { hasReferencedOpenAiAnyType: !1 },
		currentPath: n,
		propertyPath: void 0,
		seen: new Map(Object.entries(t.definitions).map(([e, n]) => [n._def, {
			def: n._def,
			path: [
				...t.basePath,
				t.definitionPath,
				e
			],
			jsonSchema: void 0
		}]))
	};
};
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/errorMessages.js
function pd(e, t, n, r) {
	r?.errorMessages && n && (e.errorMessage = {
		...e.errorMessage,
		[t]: n
	});
}
function V(e, t, n, r, i) {
	e[t] = n, pd(e, t, r, i);
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/getRelativePath.js
var md = (e, t) => {
	let n = 0;
	for (; n < e.length && n < t.length && e[n] === t[n]; n++);
	return [(e.length - n).toString(), ...t.slice(n)].join("/");
}, H;
(function(e) {
	e.assertEqual = (e) => {};
	function t(e) {}
	e.assertIs = t;
	function n(e) {
		throw Error();
	}
	e.assertNever = n, e.arrayToEnum = (e) => {
		let t = {};
		for (let n of e) t[n] = n;
		return t;
	}, e.getValidEnumValues = (t) => {
		let n = e.objectKeys(t).filter((e) => typeof t[t[e]] != "number"), r = {};
		for (let e of n) r[e] = t[e];
		return e.objectValues(r);
	}, e.objectValues = (t) => e.objectKeys(t).map(function(e) {
		return t[e];
	}), e.objectKeys = typeof Object.keys == "function" ? (e) => Object.keys(e) : (e) => {
		let t = [];
		for (let n in e) Object.prototype.hasOwnProperty.call(e, n) && t.push(n);
		return t;
	}, e.find = (e, t) => {
		for (let n of e) if (t(n)) return n;
	}, e.isInteger = typeof Number.isInteger == "function" ? (e) => Number.isInteger(e) : (e) => typeof e == "number" && Number.isFinite(e) && Math.floor(e) === e;
	function r(e, t = " | ") {
		return e.map((e) => typeof e == "string" ? `'${e}'` : e).join(t);
	}
	e.joinValues = r, e.jsonStringifyReplacer = (e, t) => typeof t == "bigint" ? t.toString() : t;
})(H ||= {});
var hd;
(function(e) {
	e.mergeShapes = (e, t) => ({
		...e,
		...t
	});
})(hd ||= {});
var U = H.arrayToEnum([
	"string",
	"nan",
	"number",
	"integer",
	"float",
	"boolean",
	"date",
	"bigint",
	"symbol",
	"function",
	"undefined",
	"null",
	"array",
	"object",
	"unknown",
	"promise",
	"void",
	"never",
	"map",
	"set"
]), gd = (e) => {
	switch (typeof e) {
		case "undefined": return U.undefined;
		case "string": return U.string;
		case "number": return Number.isNaN(e) ? U.nan : U.number;
		case "boolean": return U.boolean;
		case "function": return U.function;
		case "bigint": return U.bigint;
		case "symbol": return U.symbol;
		case "object": return Array.isArray(e) ? U.array : e === null ? U.null : e.then && typeof e.then == "function" && e.catch && typeof e.catch == "function" ? U.promise : typeof Map < "u" && e instanceof Map ? U.map : typeof Set < "u" && e instanceof Set ? U.set : typeof Date < "u" && e instanceof Date ? U.date : U.object;
		default: return U.unknown;
	}
}, W = H.arrayToEnum([
	"invalid_type",
	"invalid_literal",
	"custom",
	"invalid_union",
	"invalid_union_discriminator",
	"invalid_enum_value",
	"unrecognized_keys",
	"invalid_arguments",
	"invalid_return_type",
	"invalid_date",
	"invalid_string",
	"too_small",
	"too_big",
	"invalid_intersection_types",
	"not_multiple_of",
	"not_finite"
]), _d = class e extends Error {
	get errors() {
		return this.issues;
	}
	constructor(e) {
		super(), this.issues = [], this.addIssue = (e) => {
			this.issues = [...this.issues, e];
		}, this.addIssues = (e = []) => {
			this.issues = [...this.issues, ...e];
		};
		let t = new.target.prototype;
		Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "ZodError", this.issues = e;
	}
	format(e) {
		let t = e || function(e) {
			return e.message;
		}, n = { _errors: [] }, r = (e) => {
			for (let i of e.issues) if (i.code === "invalid_union") i.unionErrors.map(r);
			else if (i.code === "invalid_return_type") r(i.returnTypeError);
			else if (i.code === "invalid_arguments") r(i.argumentsError);
			else if (i.path.length === 0) n._errors.push(t(i));
			else {
				let e = n, r = 0;
				for (; r < i.path.length;) {
					let n = i.path[r];
					r === i.path.length - 1 ? (e[n] = e[n] || { _errors: [] }, e[n]._errors.push(t(i))) : e[n] = e[n] || { _errors: [] }, e = e[n], r++;
				}
			}
		};
		return r(this), n;
	}
	static assert(t) {
		if (!(t instanceof e)) throw Error(`Not a ZodError: ${t}`);
	}
	toString() {
		return this.message;
	}
	get message() {
		return JSON.stringify(this.issues, H.jsonStringifyReplacer, 2);
	}
	get isEmpty() {
		return this.issues.length === 0;
	}
	flatten(e = (e) => e.message) {
		let t = Object.create(null), n = [];
		for (let r of this.issues) if (r.path.length > 0) {
			let n = r.path[0];
			t[n] = t[n] || [], t[n].push(e(r));
		} else n.push(e(r));
		return {
			formErrors: n,
			fieldErrors: t
		};
	}
	get formErrors() {
		return this.flatten();
	}
};
_d.create = (e) => new _d(e);
//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v3/locales/en.js
var vd = (e, t) => {
	let n;
	switch (e.code) {
		case W.invalid_type:
			n = e.received === U.undefined ? "Required" : `Expected ${e.expected}, received ${e.received}`;
			break;
		case W.invalid_literal:
			n = `Invalid literal value, expected ${JSON.stringify(e.expected, H.jsonStringifyReplacer)}`;
			break;
		case W.unrecognized_keys:
			n = `Unrecognized key(s) in object: ${H.joinValues(e.keys, ", ")}`;
			break;
		case W.invalid_union:
			n = "Invalid input";
			break;
		case W.invalid_union_discriminator:
			n = `Invalid discriminator value. Expected ${H.joinValues(e.options)}`;
			break;
		case W.invalid_enum_value:
			n = `Invalid enum value. Expected ${H.joinValues(e.options)}, received '${e.received}'`;
			break;
		case W.invalid_arguments:
			n = "Invalid function arguments";
			break;
		case W.invalid_return_type:
			n = "Invalid function return type";
			break;
		case W.invalid_date:
			n = "Invalid date";
			break;
		case W.invalid_string:
			typeof e.validation == "object" ? "includes" in e.validation ? (n = `Invalid input: must include "${e.validation.includes}"`, typeof e.validation.position == "number" && (n = `${n} at one or more positions greater than or equal to ${e.validation.position}`)) : "startsWith" in e.validation ? n = `Invalid input: must start with "${e.validation.startsWith}"` : "endsWith" in e.validation ? n = `Invalid input: must end with "${e.validation.endsWith}"` : H.assertNever(e.validation) : n = e.validation === "regex" ? "Invalid" : `Invalid ${e.validation}`;
			break;
		case W.too_small:
			n = e.type === "array" ? `Array must contain ${e.exact ? "exactly" : e.inclusive ? "at least" : "more than"} ${e.minimum} element(s)` : e.type === "string" ? `String must contain ${e.exact ? "exactly" : e.inclusive ? "at least" : "over"} ${e.minimum} character(s)` : e.type === "number" || e.type === "bigint" ? `Number must be ${e.exact ? "exactly equal to " : e.inclusive ? "greater than or equal to " : "greater than "}${e.minimum}` : e.type === "date" ? `Date must be ${e.exact ? "exactly equal to " : e.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(e.minimum))}` : "Invalid input";
			break;
		case W.too_big:
			n = e.type === "array" ? `Array must contain ${e.exact ? "exactly" : e.inclusive ? "at most" : "less than"} ${e.maximum} element(s)` : e.type === "string" ? `String must contain ${e.exact ? "exactly" : e.inclusive ? "at most" : "under"} ${e.maximum} character(s)` : e.type === "number" ? `Number must be ${e.exact ? "exactly" : e.inclusive ? "less than or equal to" : "less than"} ${e.maximum}` : e.type === "bigint" ? `BigInt must be ${e.exact ? "exactly" : e.inclusive ? "less than or equal to" : "less than"} ${e.maximum}` : e.type === "date" ? `Date must be ${e.exact ? "exactly" : e.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(e.maximum))}` : "Invalid input";
			break;
		case W.custom:
			n = "Invalid input";
			break;
		case W.invalid_intersection_types:
			n = "Intersection results could not be merged";
			break;
		case W.not_multiple_of:
			n = `Number must be a multiple of ${e.multipleOf}`;
			break;
		case W.not_finite:
			n = "Number must be finite";
			break;
		default: n = t.defaultError, H.assertNever(e);
	}
	return { message: n };
}, yd = vd;
function bd() {
	return yd;
}
//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v3/helpers/parseUtil.js
var xd = (e) => {
	let { data: t, path: n, errorMaps: r, issueData: i } = e, a = [...n, ...i.path || []], o = {
		...i,
		path: a
	};
	if (i.message !== void 0) return {
		...i,
		path: a,
		message: i.message
	};
	let s = "", c = r.filter((e) => !!e).slice().reverse();
	for (let e of c) s = e(o, {
		data: t,
		defaultError: s
	}).message;
	return {
		...i,
		path: a,
		message: s
	};
};
function G(e, t) {
	let n = bd(), r = xd({
		issueData: t,
		data: e.data,
		path: e.path,
		errorMaps: [
			e.common.contextualErrorMap,
			e.schemaErrorMap,
			n,
			n === vd ? void 0 : vd
		].filter((e) => !!e)
	});
	e.common.issues.push(r);
}
var Sd = class e {
	constructor() {
		this.value = "valid";
	}
	dirty() {
		this.value === "valid" && (this.value = "dirty");
	}
	abort() {
		this.value !== "aborted" && (this.value = "aborted");
	}
	static mergeArray(e, t) {
		let n = [];
		for (let r of t) {
			if (r.status === "aborted") return K;
			r.status === "dirty" && e.dirty(), n.push(r.value);
		}
		return {
			status: e.value,
			value: n
		};
	}
	static async mergeObjectAsync(t, n) {
		let r = [];
		for (let e of n) {
			let t = await e.key, n = await e.value;
			r.push({
				key: t,
				value: n
			});
		}
		return e.mergeObjectSync(t, r);
	}
	static mergeObjectSync(e, t) {
		let n = {};
		for (let r of t) {
			let { key: t, value: i } = r;
			if (t.status === "aborted" || i.status === "aborted") return K;
			t.status === "dirty" && e.dirty(), i.status === "dirty" && e.dirty(), t.value !== "__proto__" && (i.value !== void 0 || r.alwaysSet) && (n[t.value] = i.value);
		}
		return {
			status: e.value,
			value: n
		};
	}
}, K = Object.freeze({ status: "aborted" }), Cd = (e) => ({
	status: "dirty",
	value: e
}), wd = (e) => ({
	status: "valid",
	value: e
}), Td = (e) => e.status === "aborted", Ed = (e) => e.status === "dirty", Dd = (e) => e.status === "valid", Od = (e) => typeof Promise < "u" && e instanceof Promise, q;
(function(e) {
	e.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, e.toString = (e) => typeof e == "string" ? e : e?.message;
})(q ||= {});
//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v3/types.js
var kd = class {
	constructor(e, t, n, r) {
		this._cachedPath = [], this.parent = e, this.data = t, this._path = n, this._key = r;
	}
	get path() {
		return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
	}
}, Ad = (e, t) => {
	if (Dd(t)) return {
		success: !0,
		data: t.value
	};
	if (!e.common.issues.length) throw Error("Validation failed but no issues detected.");
	return {
		success: !1,
		get error() {
			if (this._error) return this._error;
			let t = new _d(e.common.issues);
			return this._error = t, this._error;
		}
	};
};
function J(e) {
	if (!e) return {};
	let { errorMap: t, invalid_type_error: n, required_error: r, description: i } = e;
	if (t && (n || r)) throw Error("Can't use \"invalid_type_error\" or \"required_error\" in conjunction with custom error map.");
	return t ? {
		errorMap: t,
		description: i
	} : {
		errorMap: (t, i) => {
			let { message: a } = e;
			return t.code === "invalid_enum_value" ? { message: a ?? i.defaultError } : i.data === void 0 ? { message: a ?? r ?? i.defaultError } : t.code === "invalid_type" ? { message: a ?? n ?? i.defaultError } : { message: i.defaultError };
		},
		description: i
	};
}
var Y = class {
	get description() {
		return this._def.description;
	}
	_getType(e) {
		return gd(e.data);
	}
	_getOrReturnCtx(e, t) {
		return t || {
			common: e.parent.common,
			data: e.data,
			parsedType: gd(e.data),
			schemaErrorMap: this._def.errorMap,
			path: e.path,
			parent: e.parent
		};
	}
	_processInputParams(e) {
		return {
			status: new Sd(),
			ctx: {
				common: e.parent.common,
				data: e.data,
				parsedType: gd(e.data),
				schemaErrorMap: this._def.errorMap,
				path: e.path,
				parent: e.parent
			}
		};
	}
	_parseSync(e) {
		let t = this._parse(e);
		if (Od(t)) throw Error("Synchronous parse encountered promise.");
		return t;
	}
	_parseAsync(e) {
		let t = this._parse(e);
		return Promise.resolve(t);
	}
	parse(e, t) {
		let n = this.safeParse(e, t);
		if (n.success) return n.data;
		throw n.error;
	}
	safeParse(e, t) {
		let n = {
			common: {
				issues: [],
				async: t?.async ?? !1,
				contextualErrorMap: t?.errorMap
			},
			path: t?.path || [],
			schemaErrorMap: this._def.errorMap,
			parent: null,
			data: e,
			parsedType: gd(e)
		};
		return Ad(n, this._parseSync({
			data: e,
			path: n.path,
			parent: n
		}));
	}
	"~validate"(e) {
		let t = {
			common: {
				issues: [],
				async: !!this["~standard"].async
			},
			path: [],
			schemaErrorMap: this._def.errorMap,
			parent: null,
			data: e,
			parsedType: gd(e)
		};
		if (!this["~standard"].async) try {
			let n = this._parseSync({
				data: e,
				path: [],
				parent: t
			});
			return Dd(n) ? { value: n.value } : { issues: t.common.issues };
		} catch (e) {
			e?.message?.toLowerCase()?.includes("encountered") && (this["~standard"].async = !0), t.common = {
				issues: [],
				async: !0
			};
		}
		return this._parseAsync({
			data: e,
			path: [],
			parent: t
		}).then((e) => Dd(e) ? { value: e.value } : { issues: t.common.issues });
	}
	async parseAsync(e, t) {
		let n = await this.safeParseAsync(e, t);
		if (n.success) return n.data;
		throw n.error;
	}
	async safeParseAsync(e, t) {
		let n = {
			common: {
				issues: [],
				contextualErrorMap: t?.errorMap,
				async: !0
			},
			path: t?.path || [],
			schemaErrorMap: this._def.errorMap,
			parent: null,
			data: e,
			parsedType: gd(e)
		}, r = this._parse({
			data: e,
			path: n.path,
			parent: n
		});
		return Ad(n, await (Od(r) ? r : Promise.resolve(r)));
	}
	refine(e, t) {
		let n = (e) => typeof t == "string" || t === void 0 ? { message: t } : typeof t == "function" ? t(e) : t;
		return this._refinement((t, r) => {
			let i = e(t), a = () => r.addIssue({
				code: W.custom,
				...n(t)
			});
			return typeof Promise < "u" && i instanceof Promise ? i.then((e) => e ? !0 : (a(), !1)) : i ? !0 : (a(), !1);
		});
	}
	refinement(e, t) {
		return this._refinement((n, r) => e(n) ? !0 : (r.addIssue(typeof t == "function" ? t(n, r) : t), !1));
	}
	_refinement(e) {
		return new Pf({
			schema: this,
			typeName: X.ZodEffects,
			effect: {
				type: "refinement",
				refinement: e
			}
		});
	}
	superRefine(e) {
		return this._refinement(e);
	}
	constructor(e) {
		this.spa = this.safeParseAsync, this._def = e, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this), this["~standard"] = {
			version: 1,
			vendor: "zod",
			validate: (e) => this["~validate"](e)
		};
	}
	optional() {
		return Ff.create(this, this._def);
	}
	nullable() {
		return If.create(this, this._def);
	}
	nullish() {
		return this.nullable().optional();
	}
	array() {
		return hf.create(this);
	}
	promise() {
		return Nf.create(this, this._def);
	}
	or(e) {
		return vf.create([this, e], this._def);
	}
	and(e) {
		return Sf.create(this, e, this._def);
	}
	transform(e) {
		return new Pf({
			...J(this._def),
			schema: this,
			typeName: X.ZodEffects,
			effect: {
				type: "transform",
				transform: e
			}
		});
	}
	default(e) {
		let t = typeof e == "function" ? e : () => e;
		return new Lf({
			...J(this._def),
			innerType: this,
			defaultValue: t,
			typeName: X.ZodDefault
		});
	}
	brand() {
		return new Bf({
			typeName: X.ZodBranded,
			type: this,
			...J(this._def)
		});
	}
	catch(e) {
		let t = typeof e == "function" ? e : () => e;
		return new Rf({
			...J(this._def),
			innerType: this,
			catchValue: t,
			typeName: X.ZodCatch
		});
	}
	describe(e) {
		let t = this.constructor;
		return new t({
			...this._def,
			description: e
		});
	}
	pipe(e) {
		return Vf.create(this, e);
	}
	readonly() {
		return Hf.create(this);
	}
	isOptional() {
		return this.safeParse(void 0).success;
	}
	isNullable() {
		return this.safeParse(null).success;
	}
}, jd = /^c[^\s-]{8,}$/i, Md = /^[0-9a-z]+$/, Nd = /^[0-9A-HJKMNP-TV-Z]{26}$/i, Pd = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, Fd = /^[a-z0-9_-]{21}$/i, Id = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, Ld = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, Rd = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, zd = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", Bd, Vd = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Hd = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, Ud = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, Wd = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, Gd = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, Kd = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, qd = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", Jd = RegExp(`^${qd}$`);
function Yd(e) {
	let t = "[0-5]\\d";
	e.precision ? t = `${t}\\.\\d{${e.precision}}` : e.precision ?? (t = `${t}(\\.\\d+)?`);
	let n = e.precision ? "+" : "?";
	return `([01]\\d|2[0-3]):[0-5]\\d(:${t})${n}`;
}
function Xd(e) {
	return RegExp(`^${Yd(e)}$`);
}
function Zd(e) {
	let t = `${qd}T${Yd(e)}`, n = [];
	return n.push(e.local ? "Z?" : "Z"), e.offset && n.push("([+-]\\d{2}:?\\d{2})"), t = `${t}(${n.join("|")})`, RegExp(`^${t}$`);
}
function Qd(e, t) {
	return !!((t === "v4" || !t) && Vd.test(e) || (t === "v6" || !t) && Ud.test(e));
}
function $d(e, t) {
	if (!Id.test(e)) return !1;
	try {
		let [n] = e.split(".");
		if (!n) return !1;
		let r = n.replace(/-/g, "+").replace(/_/g, "/").padEnd(n.length + (4 - n.length % 4) % 4, "="), i = JSON.parse(atob(r));
		return !(typeof i != "object" || !i || "typ" in i && i?.typ !== "JWT" || !i.alg || t && i.alg !== t);
	} catch {
		return !1;
	}
}
function ef(e, t) {
	return !!((t === "v4" || !t) && Hd.test(e) || (t === "v6" || !t) && Wd.test(e));
}
var tf = class e extends Y {
	_parse(e) {
		if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== U.string) {
			let t = this._getOrReturnCtx(e);
			return G(t, {
				code: W.invalid_type,
				expected: U.string,
				received: t.parsedType
			}), K;
		}
		let t = new Sd(), n;
		for (let r of this._def.checks) if (r.kind === "min") e.data.length < r.value && (n = this._getOrReturnCtx(e, n), G(n, {
			code: W.too_small,
			minimum: r.value,
			type: "string",
			inclusive: !0,
			exact: !1,
			message: r.message
		}), t.dirty());
		else if (r.kind === "max") e.data.length > r.value && (n = this._getOrReturnCtx(e, n), G(n, {
			code: W.too_big,
			maximum: r.value,
			type: "string",
			inclusive: !0,
			exact: !1,
			message: r.message
		}), t.dirty());
		else if (r.kind === "length") {
			let i = e.data.length > r.value, a = e.data.length < r.value;
			(i || a) && (n = this._getOrReturnCtx(e, n), i ? G(n, {
				code: W.too_big,
				maximum: r.value,
				type: "string",
				inclusive: !0,
				exact: !0,
				message: r.message
			}) : a && G(n, {
				code: W.too_small,
				minimum: r.value,
				type: "string",
				inclusive: !0,
				exact: !0,
				message: r.message
			}), t.dirty());
		} else if (r.kind === "email") Rd.test(e.data) || (n = this._getOrReturnCtx(e, n), G(n, {
			validation: "email",
			code: W.invalid_string,
			message: r.message
		}), t.dirty());
		else if (r.kind === "emoji") Bd ||= new RegExp(zd, "u"), Bd.test(e.data) || (n = this._getOrReturnCtx(e, n), G(n, {
			validation: "emoji",
			code: W.invalid_string,
			message: r.message
		}), t.dirty());
		else if (r.kind === "uuid") Pd.test(e.data) || (n = this._getOrReturnCtx(e, n), G(n, {
			validation: "uuid",
			code: W.invalid_string,
			message: r.message
		}), t.dirty());
		else if (r.kind === "nanoid") Fd.test(e.data) || (n = this._getOrReturnCtx(e, n), G(n, {
			validation: "nanoid",
			code: W.invalid_string,
			message: r.message
		}), t.dirty());
		else if (r.kind === "cuid") jd.test(e.data) || (n = this._getOrReturnCtx(e, n), G(n, {
			validation: "cuid",
			code: W.invalid_string,
			message: r.message
		}), t.dirty());
		else if (r.kind === "cuid2") Md.test(e.data) || (n = this._getOrReturnCtx(e, n), G(n, {
			validation: "cuid2",
			code: W.invalid_string,
			message: r.message
		}), t.dirty());
		else if (r.kind === "ulid") Nd.test(e.data) || (n = this._getOrReturnCtx(e, n), G(n, {
			validation: "ulid",
			code: W.invalid_string,
			message: r.message
		}), t.dirty());
		else if (r.kind === "url") try {
			new URL(e.data);
		} catch {
			n = this._getOrReturnCtx(e, n), G(n, {
				validation: "url",
				code: W.invalid_string,
				message: r.message
			}), t.dirty();
		}
		else r.kind === "regex" ? (r.regex.lastIndex = 0, r.regex.test(e.data) || (n = this._getOrReturnCtx(e, n), G(n, {
			validation: "regex",
			code: W.invalid_string,
			message: r.message
		}), t.dirty())) : r.kind === "trim" ? e.data = e.data.trim() : r.kind === "includes" ? e.data.includes(r.value, r.position) || (n = this._getOrReturnCtx(e, n), G(n, {
			code: W.invalid_string,
			validation: {
				includes: r.value,
				position: r.position
			},
			message: r.message
		}), t.dirty()) : r.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : r.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : r.kind === "startsWith" ? e.data.startsWith(r.value) || (n = this._getOrReturnCtx(e, n), G(n, {
			code: W.invalid_string,
			validation: { startsWith: r.value },
			message: r.message
		}), t.dirty()) : r.kind === "endsWith" ? e.data.endsWith(r.value) || (n = this._getOrReturnCtx(e, n), G(n, {
			code: W.invalid_string,
			validation: { endsWith: r.value },
			message: r.message
		}), t.dirty()) : r.kind === "datetime" ? Zd(r).test(e.data) || (n = this._getOrReturnCtx(e, n), G(n, {
			code: W.invalid_string,
			validation: "datetime",
			message: r.message
		}), t.dirty()) : r.kind === "date" ? Jd.test(e.data) || (n = this._getOrReturnCtx(e, n), G(n, {
			code: W.invalid_string,
			validation: "date",
			message: r.message
		}), t.dirty()) : r.kind === "time" ? Xd(r).test(e.data) || (n = this._getOrReturnCtx(e, n), G(n, {
			code: W.invalid_string,
			validation: "time",
			message: r.message
		}), t.dirty()) : r.kind === "duration" ? Ld.test(e.data) || (n = this._getOrReturnCtx(e, n), G(n, {
			validation: "duration",
			code: W.invalid_string,
			message: r.message
		}), t.dirty()) : r.kind === "ip" ? Qd(e.data, r.version) || (n = this._getOrReturnCtx(e, n), G(n, {
			validation: "ip",
			code: W.invalid_string,
			message: r.message
		}), t.dirty()) : r.kind === "jwt" ? $d(e.data, r.alg) || (n = this._getOrReturnCtx(e, n), G(n, {
			validation: "jwt",
			code: W.invalid_string,
			message: r.message
		}), t.dirty()) : r.kind === "cidr" ? ef(e.data, r.version) || (n = this._getOrReturnCtx(e, n), G(n, {
			validation: "cidr",
			code: W.invalid_string,
			message: r.message
		}), t.dirty()) : r.kind === "base64" ? Gd.test(e.data) || (n = this._getOrReturnCtx(e, n), G(n, {
			validation: "base64",
			code: W.invalid_string,
			message: r.message
		}), t.dirty()) : r.kind === "base64url" ? Kd.test(e.data) || (n = this._getOrReturnCtx(e, n), G(n, {
			validation: "base64url",
			code: W.invalid_string,
			message: r.message
		}), t.dirty()) : H.assertNever(r);
		return {
			status: t.value,
			value: e.data
		};
	}
	_regex(e, t, n) {
		return this.refinement((t) => e.test(t), {
			validation: t,
			code: W.invalid_string,
			...q.errToObj(n)
		});
	}
	_addCheck(t) {
		return new e({
			...this._def,
			checks: [...this._def.checks, t]
		});
	}
	email(e) {
		return this._addCheck({
			kind: "email",
			...q.errToObj(e)
		});
	}
	url(e) {
		return this._addCheck({
			kind: "url",
			...q.errToObj(e)
		});
	}
	emoji(e) {
		return this._addCheck({
			kind: "emoji",
			...q.errToObj(e)
		});
	}
	uuid(e) {
		return this._addCheck({
			kind: "uuid",
			...q.errToObj(e)
		});
	}
	nanoid(e) {
		return this._addCheck({
			kind: "nanoid",
			...q.errToObj(e)
		});
	}
	cuid(e) {
		return this._addCheck({
			kind: "cuid",
			...q.errToObj(e)
		});
	}
	cuid2(e) {
		return this._addCheck({
			kind: "cuid2",
			...q.errToObj(e)
		});
	}
	ulid(e) {
		return this._addCheck({
			kind: "ulid",
			...q.errToObj(e)
		});
	}
	base64(e) {
		return this._addCheck({
			kind: "base64",
			...q.errToObj(e)
		});
	}
	base64url(e) {
		return this._addCheck({
			kind: "base64url",
			...q.errToObj(e)
		});
	}
	jwt(e) {
		return this._addCheck({
			kind: "jwt",
			...q.errToObj(e)
		});
	}
	ip(e) {
		return this._addCheck({
			kind: "ip",
			...q.errToObj(e)
		});
	}
	cidr(e) {
		return this._addCheck({
			kind: "cidr",
			...q.errToObj(e)
		});
	}
	datetime(e) {
		return typeof e == "string" ? this._addCheck({
			kind: "datetime",
			precision: null,
			offset: !1,
			local: !1,
			message: e
		}) : this._addCheck({
			kind: "datetime",
			precision: e?.precision === void 0 ? null : e?.precision,
			offset: e?.offset ?? !1,
			local: e?.local ?? !1,
			...q.errToObj(e?.message)
		});
	}
	date(e) {
		return this._addCheck({
			kind: "date",
			message: e
		});
	}
	time(e) {
		return typeof e == "string" ? this._addCheck({
			kind: "time",
			precision: null,
			message: e
		}) : this._addCheck({
			kind: "time",
			precision: e?.precision === void 0 ? null : e?.precision,
			...q.errToObj(e?.message)
		});
	}
	duration(e) {
		return this._addCheck({
			kind: "duration",
			...q.errToObj(e)
		});
	}
	regex(e, t) {
		return this._addCheck({
			kind: "regex",
			regex: e,
			...q.errToObj(t)
		});
	}
	includes(e, t) {
		return this._addCheck({
			kind: "includes",
			value: e,
			position: t?.position,
			...q.errToObj(t?.message)
		});
	}
	startsWith(e, t) {
		return this._addCheck({
			kind: "startsWith",
			value: e,
			...q.errToObj(t)
		});
	}
	endsWith(e, t) {
		return this._addCheck({
			kind: "endsWith",
			value: e,
			...q.errToObj(t)
		});
	}
	min(e, t) {
		return this._addCheck({
			kind: "min",
			value: e,
			...q.errToObj(t)
		});
	}
	max(e, t) {
		return this._addCheck({
			kind: "max",
			value: e,
			...q.errToObj(t)
		});
	}
	length(e, t) {
		return this._addCheck({
			kind: "length",
			value: e,
			...q.errToObj(t)
		});
	}
	nonempty(e) {
		return this.min(1, q.errToObj(e));
	}
	trim() {
		return new e({
			...this._def,
			checks: [...this._def.checks, { kind: "trim" }]
		});
	}
	toLowerCase() {
		return new e({
			...this._def,
			checks: [...this._def.checks, { kind: "toLowerCase" }]
		});
	}
	toUpperCase() {
		return new e({
			...this._def,
			checks: [...this._def.checks, { kind: "toUpperCase" }]
		});
	}
	get isDatetime() {
		return !!this._def.checks.find((e) => e.kind === "datetime");
	}
	get isDate() {
		return !!this._def.checks.find((e) => e.kind === "date");
	}
	get isTime() {
		return !!this._def.checks.find((e) => e.kind === "time");
	}
	get isDuration() {
		return !!this._def.checks.find((e) => e.kind === "duration");
	}
	get isEmail() {
		return !!this._def.checks.find((e) => e.kind === "email");
	}
	get isURL() {
		return !!this._def.checks.find((e) => e.kind === "url");
	}
	get isEmoji() {
		return !!this._def.checks.find((e) => e.kind === "emoji");
	}
	get isUUID() {
		return !!this._def.checks.find((e) => e.kind === "uuid");
	}
	get isNANOID() {
		return !!this._def.checks.find((e) => e.kind === "nanoid");
	}
	get isCUID() {
		return !!this._def.checks.find((e) => e.kind === "cuid");
	}
	get isCUID2() {
		return !!this._def.checks.find((e) => e.kind === "cuid2");
	}
	get isULID() {
		return !!this._def.checks.find((e) => e.kind === "ulid");
	}
	get isIP() {
		return !!this._def.checks.find((e) => e.kind === "ip");
	}
	get isCIDR() {
		return !!this._def.checks.find((e) => e.kind === "cidr");
	}
	get isBase64() {
		return !!this._def.checks.find((e) => e.kind === "base64");
	}
	get isBase64url() {
		return !!this._def.checks.find((e) => e.kind === "base64url");
	}
	get minLength() {
		let e = null;
		for (let t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
		return e;
	}
	get maxLength() {
		let e = null;
		for (let t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
		return e;
	}
};
tf.create = (e) => new tf({
	checks: [],
	typeName: X.ZodString,
	coerce: e?.coerce ?? !1,
	...J(e)
});
function nf(e, t) {
	let n = (e.toString().split(".")[1] || "").length, r = (t.toString().split(".")[1] || "").length, i = n > r ? n : r;
	return Number.parseInt(e.toFixed(i).replace(".", "")) % Number.parseInt(t.toFixed(i).replace(".", "")) / 10 ** i;
}
var rf = class e extends Y {
	constructor() {
		super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
	}
	_parse(e) {
		if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== U.number) {
			let t = this._getOrReturnCtx(e);
			return G(t, {
				code: W.invalid_type,
				expected: U.number,
				received: t.parsedType
			}), K;
		}
		let t, n = new Sd();
		for (let r of this._def.checks) r.kind === "int" ? H.isInteger(e.data) || (t = this._getOrReturnCtx(e, t), G(t, {
			code: W.invalid_type,
			expected: "integer",
			received: "float",
			message: r.message
		}), n.dirty()) : r.kind === "min" ? (r.inclusive ? e.data < r.value : e.data <= r.value) && (t = this._getOrReturnCtx(e, t), G(t, {
			code: W.too_small,
			minimum: r.value,
			type: "number",
			inclusive: r.inclusive,
			exact: !1,
			message: r.message
		}), n.dirty()) : r.kind === "max" ? (r.inclusive ? e.data > r.value : e.data >= r.value) && (t = this._getOrReturnCtx(e, t), G(t, {
			code: W.too_big,
			maximum: r.value,
			type: "number",
			inclusive: r.inclusive,
			exact: !1,
			message: r.message
		}), n.dirty()) : r.kind === "multipleOf" ? nf(e.data, r.value) !== 0 && (t = this._getOrReturnCtx(e, t), G(t, {
			code: W.not_multiple_of,
			multipleOf: r.value,
			message: r.message
		}), n.dirty()) : r.kind === "finite" ? Number.isFinite(e.data) || (t = this._getOrReturnCtx(e, t), G(t, {
			code: W.not_finite,
			message: r.message
		}), n.dirty()) : H.assertNever(r);
		return {
			status: n.value,
			value: e.data
		};
	}
	gte(e, t) {
		return this.setLimit("min", e, !0, q.toString(t));
	}
	gt(e, t) {
		return this.setLimit("min", e, !1, q.toString(t));
	}
	lte(e, t) {
		return this.setLimit("max", e, !0, q.toString(t));
	}
	lt(e, t) {
		return this.setLimit("max", e, !1, q.toString(t));
	}
	setLimit(t, n, r, i) {
		return new e({
			...this._def,
			checks: [...this._def.checks, {
				kind: t,
				value: n,
				inclusive: r,
				message: q.toString(i)
			}]
		});
	}
	_addCheck(t) {
		return new e({
			...this._def,
			checks: [...this._def.checks, t]
		});
	}
	int(e) {
		return this._addCheck({
			kind: "int",
			message: q.toString(e)
		});
	}
	positive(e) {
		return this._addCheck({
			kind: "min",
			value: 0,
			inclusive: !1,
			message: q.toString(e)
		});
	}
	negative(e) {
		return this._addCheck({
			kind: "max",
			value: 0,
			inclusive: !1,
			message: q.toString(e)
		});
	}
	nonpositive(e) {
		return this._addCheck({
			kind: "max",
			value: 0,
			inclusive: !0,
			message: q.toString(e)
		});
	}
	nonnegative(e) {
		return this._addCheck({
			kind: "min",
			value: 0,
			inclusive: !0,
			message: q.toString(e)
		});
	}
	multipleOf(e, t) {
		return this._addCheck({
			kind: "multipleOf",
			value: e,
			message: q.toString(t)
		});
	}
	finite(e) {
		return this._addCheck({
			kind: "finite",
			message: q.toString(e)
		});
	}
	safe(e) {
		return this._addCheck({
			kind: "min",
			inclusive: !0,
			value: -(2 ** 53 - 1),
			message: q.toString(e)
		})._addCheck({
			kind: "max",
			inclusive: !0,
			value: 2 ** 53 - 1,
			message: q.toString(e)
		});
	}
	get minValue() {
		let e = null;
		for (let t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
		return e;
	}
	get maxValue() {
		let e = null;
		for (let t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
		return e;
	}
	get isInt() {
		return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && H.isInteger(e.value));
	}
	get isFinite() {
		let e = null, t = null;
		for (let n of this._def.checks) if (n.kind === "finite" || n.kind === "int" || n.kind === "multipleOf") return !0;
		else n.kind === "min" ? (t === null || n.value > t) && (t = n.value) : n.kind === "max" && (e === null || n.value < e) && (e = n.value);
		return Number.isFinite(t) && Number.isFinite(e);
	}
};
rf.create = (e) => new rf({
	checks: [],
	typeName: X.ZodNumber,
	coerce: e?.coerce || !1,
	...J(e)
});
var af = class e extends Y {
	constructor() {
		super(...arguments), this.min = this.gte, this.max = this.lte;
	}
	_parse(e) {
		if (this._def.coerce) try {
			e.data = BigInt(e.data);
		} catch {
			return this._getInvalidInput(e);
		}
		if (this._getType(e) !== U.bigint) return this._getInvalidInput(e);
		let t, n = new Sd();
		for (let r of this._def.checks) r.kind === "min" ? (r.inclusive ? e.data < r.value : e.data <= r.value) && (t = this._getOrReturnCtx(e, t), G(t, {
			code: W.too_small,
			type: "bigint",
			minimum: r.value,
			inclusive: r.inclusive,
			message: r.message
		}), n.dirty()) : r.kind === "max" ? (r.inclusive ? e.data > r.value : e.data >= r.value) && (t = this._getOrReturnCtx(e, t), G(t, {
			code: W.too_big,
			type: "bigint",
			maximum: r.value,
			inclusive: r.inclusive,
			message: r.message
		}), n.dirty()) : r.kind === "multipleOf" ? e.data % r.value !== BigInt(0) && (t = this._getOrReturnCtx(e, t), G(t, {
			code: W.not_multiple_of,
			multipleOf: r.value,
			message: r.message
		}), n.dirty()) : H.assertNever(r);
		return {
			status: n.value,
			value: e.data
		};
	}
	_getInvalidInput(e) {
		let t = this._getOrReturnCtx(e);
		return G(t, {
			code: W.invalid_type,
			expected: U.bigint,
			received: t.parsedType
		}), K;
	}
	gte(e, t) {
		return this.setLimit("min", e, !0, q.toString(t));
	}
	gt(e, t) {
		return this.setLimit("min", e, !1, q.toString(t));
	}
	lte(e, t) {
		return this.setLimit("max", e, !0, q.toString(t));
	}
	lt(e, t) {
		return this.setLimit("max", e, !1, q.toString(t));
	}
	setLimit(t, n, r, i) {
		return new e({
			...this._def,
			checks: [...this._def.checks, {
				kind: t,
				value: n,
				inclusive: r,
				message: q.toString(i)
			}]
		});
	}
	_addCheck(t) {
		return new e({
			...this._def,
			checks: [...this._def.checks, t]
		});
	}
	positive(e) {
		return this._addCheck({
			kind: "min",
			value: BigInt(0),
			inclusive: !1,
			message: q.toString(e)
		});
	}
	negative(e) {
		return this._addCheck({
			kind: "max",
			value: BigInt(0),
			inclusive: !1,
			message: q.toString(e)
		});
	}
	nonpositive(e) {
		return this._addCheck({
			kind: "max",
			value: BigInt(0),
			inclusive: !0,
			message: q.toString(e)
		});
	}
	nonnegative(e) {
		return this._addCheck({
			kind: "min",
			value: BigInt(0),
			inclusive: !0,
			message: q.toString(e)
		});
	}
	multipleOf(e, t) {
		return this._addCheck({
			kind: "multipleOf",
			value: e,
			message: q.toString(t)
		});
	}
	get minValue() {
		let e = null;
		for (let t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
		return e;
	}
	get maxValue() {
		let e = null;
		for (let t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
		return e;
	}
};
af.create = (e) => new af({
	checks: [],
	typeName: X.ZodBigInt,
	coerce: e?.coerce ?? !1,
	...J(e)
});
var of = class extends Y {
	_parse(e) {
		if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== U.boolean) {
			let t = this._getOrReturnCtx(e);
			return G(t, {
				code: W.invalid_type,
				expected: U.boolean,
				received: t.parsedType
			}), K;
		}
		return wd(e.data);
	}
};
of.create = (e) => new of({
	typeName: X.ZodBoolean,
	coerce: e?.coerce || !1,
	...J(e)
});
var sf = class e extends Y {
	_parse(e) {
		if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== U.date) {
			let t = this._getOrReturnCtx(e);
			return G(t, {
				code: W.invalid_type,
				expected: U.date,
				received: t.parsedType
			}), K;
		}
		if (Number.isNaN(e.data.getTime())) return G(this._getOrReturnCtx(e), { code: W.invalid_date }), K;
		let t = new Sd(), n;
		for (let r of this._def.checks) r.kind === "min" ? e.data.getTime() < r.value && (n = this._getOrReturnCtx(e, n), G(n, {
			code: W.too_small,
			message: r.message,
			inclusive: !0,
			exact: !1,
			minimum: r.value,
			type: "date"
		}), t.dirty()) : r.kind === "max" ? e.data.getTime() > r.value && (n = this._getOrReturnCtx(e, n), G(n, {
			code: W.too_big,
			message: r.message,
			inclusive: !0,
			exact: !1,
			maximum: r.value,
			type: "date"
		}), t.dirty()) : H.assertNever(r);
		return {
			status: t.value,
			value: new Date(e.data.getTime())
		};
	}
	_addCheck(t) {
		return new e({
			...this._def,
			checks: [...this._def.checks, t]
		});
	}
	min(e, t) {
		return this._addCheck({
			kind: "min",
			value: e.getTime(),
			message: q.toString(t)
		});
	}
	max(e, t) {
		return this._addCheck({
			kind: "max",
			value: e.getTime(),
			message: q.toString(t)
		});
	}
	get minDate() {
		let e = null;
		for (let t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
		return e == null ? null : new Date(e);
	}
	get maxDate() {
		let e = null;
		for (let t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
		return e == null ? null : new Date(e);
	}
};
sf.create = (e) => new sf({
	checks: [],
	coerce: e?.coerce || !1,
	typeName: X.ZodDate,
	...J(e)
});
var cf = class extends Y {
	_parse(e) {
		if (this._getType(e) !== U.symbol) {
			let t = this._getOrReturnCtx(e);
			return G(t, {
				code: W.invalid_type,
				expected: U.symbol,
				received: t.parsedType
			}), K;
		}
		return wd(e.data);
	}
};
cf.create = (e) => new cf({
	typeName: X.ZodSymbol,
	...J(e)
});
var lf = class extends Y {
	_parse(e) {
		if (this._getType(e) !== U.undefined) {
			let t = this._getOrReturnCtx(e);
			return G(t, {
				code: W.invalid_type,
				expected: U.undefined,
				received: t.parsedType
			}), K;
		}
		return wd(e.data);
	}
};
lf.create = (e) => new lf({
	typeName: X.ZodUndefined,
	...J(e)
});
var uf = class extends Y {
	_parse(e) {
		if (this._getType(e) !== U.null) {
			let t = this._getOrReturnCtx(e);
			return G(t, {
				code: W.invalid_type,
				expected: U.null,
				received: t.parsedType
			}), K;
		}
		return wd(e.data);
	}
};
uf.create = (e) => new uf({
	typeName: X.ZodNull,
	...J(e)
});
var df = class extends Y {
	constructor() {
		super(...arguments), this._any = !0;
	}
	_parse(e) {
		return wd(e.data);
	}
};
df.create = (e) => new df({
	typeName: X.ZodAny,
	...J(e)
});
var ff = class extends Y {
	constructor() {
		super(...arguments), this._unknown = !0;
	}
	_parse(e) {
		return wd(e.data);
	}
};
ff.create = (e) => new ff({
	typeName: X.ZodUnknown,
	...J(e)
});
var pf = class extends Y {
	_parse(e) {
		let t = this._getOrReturnCtx(e);
		return G(t, {
			code: W.invalid_type,
			expected: U.never,
			received: t.parsedType
		}), K;
	}
};
pf.create = (e) => new pf({
	typeName: X.ZodNever,
	...J(e)
});
var mf = class extends Y {
	_parse(e) {
		if (this._getType(e) !== U.undefined) {
			let t = this._getOrReturnCtx(e);
			return G(t, {
				code: W.invalid_type,
				expected: U.void,
				received: t.parsedType
			}), K;
		}
		return wd(e.data);
	}
};
mf.create = (e) => new mf({
	typeName: X.ZodVoid,
	...J(e)
});
var hf = class e extends Y {
	_parse(e) {
		let { ctx: t, status: n } = this._processInputParams(e), r = this._def;
		if (t.parsedType !== U.array) return G(t, {
			code: W.invalid_type,
			expected: U.array,
			received: t.parsedType
		}), K;
		if (r.exactLength !== null) {
			let e = t.data.length > r.exactLength.value, i = t.data.length < r.exactLength.value;
			(e || i) && (G(t, {
				code: e ? W.too_big : W.too_small,
				minimum: i ? r.exactLength.value : void 0,
				maximum: e ? r.exactLength.value : void 0,
				type: "array",
				inclusive: !0,
				exact: !0,
				message: r.exactLength.message
			}), n.dirty());
		}
		if (r.minLength !== null && t.data.length < r.minLength.value && (G(t, {
			code: W.too_small,
			minimum: r.minLength.value,
			type: "array",
			inclusive: !0,
			exact: !1,
			message: r.minLength.message
		}), n.dirty()), r.maxLength !== null && t.data.length > r.maxLength.value && (G(t, {
			code: W.too_big,
			maximum: r.maxLength.value,
			type: "array",
			inclusive: !0,
			exact: !1,
			message: r.maxLength.message
		}), n.dirty()), t.common.async) return Promise.all([...t.data].map((e, n) => r.type._parseAsync(new kd(t, e, t.path, n)))).then((e) => Sd.mergeArray(n, e));
		let i = [...t.data].map((e, n) => r.type._parseSync(new kd(t, e, t.path, n)));
		return Sd.mergeArray(n, i);
	}
	get element() {
		return this._def.type;
	}
	min(t, n) {
		return new e({
			...this._def,
			minLength: {
				value: t,
				message: q.toString(n)
			}
		});
	}
	max(t, n) {
		return new e({
			...this._def,
			maxLength: {
				value: t,
				message: q.toString(n)
			}
		});
	}
	length(t, n) {
		return new e({
			...this._def,
			exactLength: {
				value: t,
				message: q.toString(n)
			}
		});
	}
	nonempty(e) {
		return this.min(1, e);
	}
};
hf.create = (e, t) => new hf({
	type: e,
	minLength: null,
	maxLength: null,
	exactLength: null,
	typeName: X.ZodArray,
	...J(t)
});
function gf(e) {
	if (e instanceof _f) {
		let t = {};
		for (let n in e.shape) {
			let r = e.shape[n];
			t[n] = Ff.create(gf(r));
		}
		return new _f({
			...e._def,
			shape: () => t
		});
	} else if (e instanceof hf) return new hf({
		...e._def,
		type: gf(e.element)
	});
	else if (e instanceof Ff) return Ff.create(gf(e.unwrap()));
	else if (e instanceof If) return If.create(gf(e.unwrap()));
	else if (e instanceof Cf) return Cf.create(e.items.map((e) => gf(e)));
	else return e;
}
var _f = class e extends Y {
	constructor() {
		super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
	}
	_getCached() {
		if (this._cached !== null) return this._cached;
		let e = this._def.shape(), t = H.objectKeys(e);
		return this._cached = {
			shape: e,
			keys: t
		}, this._cached;
	}
	_parse(e) {
		if (this._getType(e) !== U.object) {
			let t = this._getOrReturnCtx(e);
			return G(t, {
				code: W.invalid_type,
				expected: U.object,
				received: t.parsedType
			}), K;
		}
		let { status: t, ctx: n } = this._processInputParams(e), { shape: r, keys: i } = this._getCached(), a = [];
		if (!(this._def.catchall instanceof pf && this._def.unknownKeys === "strip")) for (let e in n.data) i.includes(e) || a.push(e);
		let o = [];
		for (let e of i) {
			let t = r[e], i = n.data[e];
			o.push({
				key: {
					status: "valid",
					value: e
				},
				value: t._parse(new kd(n, i, n.path, e)),
				alwaysSet: e in n.data
			});
		}
		if (this._def.catchall instanceof pf) {
			let e = this._def.unknownKeys;
			if (e === "passthrough") for (let e of a) o.push({
				key: {
					status: "valid",
					value: e
				},
				value: {
					status: "valid",
					value: n.data[e]
				}
			});
			else if (e === "strict") a.length > 0 && (G(n, {
				code: W.unrecognized_keys,
				keys: a
			}), t.dirty());
			else if (e !== "strip") throw Error("Internal ZodObject error: invalid unknownKeys value.");
		} else {
			let e = this._def.catchall;
			for (let t of a) {
				let r = n.data[t];
				o.push({
					key: {
						status: "valid",
						value: t
					},
					value: e._parse(new kd(n, r, n.path, t)),
					alwaysSet: t in n.data
				});
			}
		}
		return n.common.async ? Promise.resolve().then(async () => {
			let e = [];
			for (let t of o) {
				let n = await t.key, r = await t.value;
				e.push({
					key: n,
					value: r,
					alwaysSet: t.alwaysSet
				});
			}
			return e;
		}).then((e) => Sd.mergeObjectSync(t, e)) : Sd.mergeObjectSync(t, o);
	}
	get shape() {
		return this._def.shape();
	}
	strict(t) {
		return q.errToObj, new e({
			...this._def,
			unknownKeys: "strict",
			...t === void 0 ? {} : { errorMap: (e, n) => {
				let r = this._def.errorMap?.(e, n).message ?? n.defaultError;
				return e.code === "unrecognized_keys" ? { message: q.errToObj(t).message ?? r } : { message: r };
			} }
		});
	}
	strip() {
		return new e({
			...this._def,
			unknownKeys: "strip"
		});
	}
	passthrough() {
		return new e({
			...this._def,
			unknownKeys: "passthrough"
		});
	}
	extend(t) {
		return new e({
			...this._def,
			shape: () => ({
				...this._def.shape(),
				...t
			})
		});
	}
	merge(t) {
		return new e({
			unknownKeys: t._def.unknownKeys,
			catchall: t._def.catchall,
			shape: () => ({
				...this._def.shape(),
				...t._def.shape()
			}),
			typeName: X.ZodObject
		});
	}
	setKey(e, t) {
		return this.augment({ [e]: t });
	}
	catchall(t) {
		return new e({
			...this._def,
			catchall: t
		});
	}
	pick(t) {
		let n = {};
		for (let e of H.objectKeys(t)) t[e] && this.shape[e] && (n[e] = this.shape[e]);
		return new e({
			...this._def,
			shape: () => n
		});
	}
	omit(t) {
		let n = {};
		for (let e of H.objectKeys(this.shape)) t[e] || (n[e] = this.shape[e]);
		return new e({
			...this._def,
			shape: () => n
		});
	}
	deepPartial() {
		return gf(this);
	}
	partial(t) {
		let n = {};
		for (let e of H.objectKeys(this.shape)) {
			let r = this.shape[e];
			t && !t[e] ? n[e] = r : n[e] = r.optional();
		}
		return new e({
			...this._def,
			shape: () => n
		});
	}
	required(t) {
		let n = {};
		for (let e of H.objectKeys(this.shape)) if (t && !t[e]) n[e] = this.shape[e];
		else {
			let t = this.shape[e];
			for (; t instanceof Ff;) t = t._def.innerType;
			n[e] = t;
		}
		return new e({
			...this._def,
			shape: () => n
		});
	}
	keyof() {
		return Af(H.objectKeys(this.shape));
	}
};
_f.create = (e, t) => new _f({
	shape: () => e,
	unknownKeys: "strip",
	catchall: pf.create(),
	typeName: X.ZodObject,
	...J(t)
}), _f.strictCreate = (e, t) => new _f({
	shape: () => e,
	unknownKeys: "strict",
	catchall: pf.create(),
	typeName: X.ZodObject,
	...J(t)
}), _f.lazycreate = (e, t) => new _f({
	shape: e,
	unknownKeys: "strip",
	catchall: pf.create(),
	typeName: X.ZodObject,
	...J(t)
});
var vf = class extends Y {
	_parse(e) {
		let { ctx: t } = this._processInputParams(e), n = this._def.options;
		function r(e) {
			for (let t of e) if (t.result.status === "valid") return t.result;
			for (let n of e) if (n.result.status === "dirty") return t.common.issues.push(...n.ctx.common.issues), n.result;
			let n = e.map((e) => new _d(e.ctx.common.issues));
			return G(t, {
				code: W.invalid_union,
				unionErrors: n
			}), K;
		}
		if (t.common.async) return Promise.all(n.map(async (e) => {
			let n = {
				...t,
				common: {
					...t.common,
					issues: []
				},
				parent: null
			};
			return {
				result: await e._parseAsync({
					data: t.data,
					path: t.path,
					parent: n
				}),
				ctx: n
			};
		})).then(r);
		{
			let e, r = [];
			for (let i of n) {
				let n = {
					...t,
					common: {
						...t.common,
						issues: []
					},
					parent: null
				}, a = i._parseSync({
					data: t.data,
					path: t.path,
					parent: n
				});
				if (a.status === "valid") return a;
				a.status === "dirty" && !e && (e = {
					result: a,
					ctx: n
				}), n.common.issues.length && r.push(n.common.issues);
			}
			if (e) return t.common.issues.push(...e.ctx.common.issues), e.result;
			let i = r.map((e) => new _d(e));
			return G(t, {
				code: W.invalid_union,
				unionErrors: i
			}), K;
		}
	}
	get options() {
		return this._def.options;
	}
};
vf.create = (e, t) => new vf({
	options: e,
	typeName: X.ZodUnion,
	...J(t)
});
var yf = (e) => e instanceof Of ? yf(e.schema) : e instanceof Pf ? yf(e.innerType()) : e instanceof kf ? [e.value] : e instanceof jf ? e.options : e instanceof Mf ? H.objectValues(e.enum) : e instanceof Lf ? yf(e._def.innerType) : e instanceof lf ? [void 0] : e instanceof uf ? [null] : e instanceof Ff ? [void 0, ...yf(e.unwrap())] : e instanceof If ? [null, ...yf(e.unwrap())] : e instanceof Bf || e instanceof Hf ? yf(e.unwrap()) : e instanceof Rf ? yf(e._def.innerType) : [], bf = class e extends Y {
	_parse(e) {
		let { ctx: t } = this._processInputParams(e);
		if (t.parsedType !== U.object) return G(t, {
			code: W.invalid_type,
			expected: U.object,
			received: t.parsedType
		}), K;
		let n = this.discriminator, r = t.data[n], i = this.optionsMap.get(r);
		return i ? t.common.async ? i._parseAsync({
			data: t.data,
			path: t.path,
			parent: t
		}) : i._parseSync({
			data: t.data,
			path: t.path,
			parent: t
		}) : (G(t, {
			code: W.invalid_union_discriminator,
			options: Array.from(this.optionsMap.keys()),
			path: [n]
		}), K);
	}
	get discriminator() {
		return this._def.discriminator;
	}
	get options() {
		return this._def.options;
	}
	get optionsMap() {
		return this._def.optionsMap;
	}
	static create(t, n, r) {
		let i = /* @__PURE__ */ new Map();
		for (let e of n) {
			let n = yf(e.shape[t]);
			if (!n.length) throw Error(`A discriminator value for key \`${t}\` could not be extracted from all schema options`);
			for (let r of n) {
				if (i.has(r)) throw Error(`Discriminator property ${String(t)} has duplicate value ${String(r)}`);
				i.set(r, e);
			}
		}
		return new e({
			typeName: X.ZodDiscriminatedUnion,
			discriminator: t,
			options: n,
			optionsMap: i,
			...J(r)
		});
	}
};
function xf(e, t) {
	let n = gd(e), r = gd(t);
	if (e === t) return {
		valid: !0,
		data: e
	};
	if (n === U.object && r === U.object) {
		let n = H.objectKeys(t), r = H.objectKeys(e).filter((e) => n.indexOf(e) !== -1), i = {
			...e,
			...t
		};
		for (let n of r) {
			let r = xf(e[n], t[n]);
			if (!r.valid) return { valid: !1 };
			i[n] = r.data;
		}
		return {
			valid: !0,
			data: i
		};
	} else if (n === U.array && r === U.array) {
		if (e.length !== t.length) return { valid: !1 };
		let n = [];
		for (let r = 0; r < e.length; r++) {
			let i = e[r], a = t[r], o = xf(i, a);
			if (!o.valid) return { valid: !1 };
			n.push(o.data);
		}
		return {
			valid: !0,
			data: n
		};
	} else if (n === U.date && r === U.date && +e == +t) return {
		valid: !0,
		data: e
	};
	else return { valid: !1 };
}
var Sf = class extends Y {
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e), r = (e, r) => {
			if (Td(e) || Td(r)) return K;
			let i = xf(e.value, r.value);
			return i.valid ? ((Ed(e) || Ed(r)) && t.dirty(), {
				status: t.value,
				value: i.data
			}) : (G(n, { code: W.invalid_intersection_types }), K);
		};
		return n.common.async ? Promise.all([this._def.left._parseAsync({
			data: n.data,
			path: n.path,
			parent: n
		}), this._def.right._parseAsync({
			data: n.data,
			path: n.path,
			parent: n
		})]).then(([e, t]) => r(e, t)) : r(this._def.left._parseSync({
			data: n.data,
			path: n.path,
			parent: n
		}), this._def.right._parseSync({
			data: n.data,
			path: n.path,
			parent: n
		}));
	}
};
Sf.create = (e, t, n) => new Sf({
	left: e,
	right: t,
	typeName: X.ZodIntersection,
	...J(n)
});
var Cf = class e extends Y {
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e);
		if (n.parsedType !== U.array) return G(n, {
			code: W.invalid_type,
			expected: U.array,
			received: n.parsedType
		}), K;
		if (n.data.length < this._def.items.length) return G(n, {
			code: W.too_small,
			minimum: this._def.items.length,
			inclusive: !0,
			exact: !1,
			type: "array"
		}), K;
		!this._def.rest && n.data.length > this._def.items.length && (G(n, {
			code: W.too_big,
			maximum: this._def.items.length,
			inclusive: !0,
			exact: !1,
			type: "array"
		}), t.dirty());
		let r = [...n.data].map((e, t) => {
			let r = this._def.items[t] || this._def.rest;
			return r ? r._parse(new kd(n, e, n.path, t)) : null;
		}).filter((e) => !!e);
		return n.common.async ? Promise.all(r).then((e) => Sd.mergeArray(t, e)) : Sd.mergeArray(t, r);
	}
	get items() {
		return this._def.items;
	}
	rest(t) {
		return new e({
			...this._def,
			rest: t
		});
	}
};
Cf.create = (e, t) => {
	if (!Array.isArray(e)) throw Error("You must pass an array of schemas to z.tuple([ ... ])");
	return new Cf({
		items: e,
		typeName: X.ZodTuple,
		rest: null,
		...J(t)
	});
};
var wf = class e extends Y {
	get keySchema() {
		return this._def.keyType;
	}
	get valueSchema() {
		return this._def.valueType;
	}
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e);
		if (n.parsedType !== U.object) return G(n, {
			code: W.invalid_type,
			expected: U.object,
			received: n.parsedType
		}), K;
		let r = [], i = this._def.keyType, a = this._def.valueType;
		for (let e in n.data) r.push({
			key: i._parse(new kd(n, e, n.path, e)),
			value: a._parse(new kd(n, n.data[e], n.path, e)),
			alwaysSet: e in n.data
		});
		return n.common.async ? Sd.mergeObjectAsync(t, r) : Sd.mergeObjectSync(t, r);
	}
	get element() {
		return this._def.valueType;
	}
	static create(t, n, r) {
		return n instanceof Y ? new e({
			keyType: t,
			valueType: n,
			typeName: X.ZodRecord,
			...J(r)
		}) : new e({
			keyType: tf.create(),
			valueType: t,
			typeName: X.ZodRecord,
			...J(n)
		});
	}
}, Tf = class extends Y {
	get keySchema() {
		return this._def.keyType;
	}
	get valueSchema() {
		return this._def.valueType;
	}
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e);
		if (n.parsedType !== U.map) return G(n, {
			code: W.invalid_type,
			expected: U.map,
			received: n.parsedType
		}), K;
		let r = this._def.keyType, i = this._def.valueType, a = [...n.data.entries()].map(([e, t], a) => ({
			key: r._parse(new kd(n, e, n.path, [a, "key"])),
			value: i._parse(new kd(n, t, n.path, [a, "value"]))
		}));
		if (n.common.async) {
			let e = /* @__PURE__ */ new Map();
			return Promise.resolve().then(async () => {
				for (let n of a) {
					let r = await n.key, i = await n.value;
					if (r.status === "aborted" || i.status === "aborted") return K;
					(r.status === "dirty" || i.status === "dirty") && t.dirty(), e.set(r.value, i.value);
				}
				return {
					status: t.value,
					value: e
				};
			});
		} else {
			let e = /* @__PURE__ */ new Map();
			for (let n of a) {
				let r = n.key, i = n.value;
				if (r.status === "aborted" || i.status === "aborted") return K;
				(r.status === "dirty" || i.status === "dirty") && t.dirty(), e.set(r.value, i.value);
			}
			return {
				status: t.value,
				value: e
			};
		}
	}
};
Tf.create = (e, t, n) => new Tf({
	valueType: t,
	keyType: e,
	typeName: X.ZodMap,
	...J(n)
});
var Ef = class e extends Y {
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e);
		if (n.parsedType !== U.set) return G(n, {
			code: W.invalid_type,
			expected: U.set,
			received: n.parsedType
		}), K;
		let r = this._def;
		r.minSize !== null && n.data.size < r.minSize.value && (G(n, {
			code: W.too_small,
			minimum: r.minSize.value,
			type: "set",
			inclusive: !0,
			exact: !1,
			message: r.minSize.message
		}), t.dirty()), r.maxSize !== null && n.data.size > r.maxSize.value && (G(n, {
			code: W.too_big,
			maximum: r.maxSize.value,
			type: "set",
			inclusive: !0,
			exact: !1,
			message: r.maxSize.message
		}), t.dirty());
		let i = this._def.valueType;
		function a(e) {
			let n = /* @__PURE__ */ new Set();
			for (let r of e) {
				if (r.status === "aborted") return K;
				r.status === "dirty" && t.dirty(), n.add(r.value);
			}
			return {
				status: t.value,
				value: n
			};
		}
		let o = [...n.data.values()].map((e, t) => i._parse(new kd(n, e, n.path, t)));
		return n.common.async ? Promise.all(o).then((e) => a(e)) : a(o);
	}
	min(t, n) {
		return new e({
			...this._def,
			minSize: {
				value: t,
				message: q.toString(n)
			}
		});
	}
	max(t, n) {
		return new e({
			...this._def,
			maxSize: {
				value: t,
				message: q.toString(n)
			}
		});
	}
	size(e, t) {
		return this.min(e, t).max(e, t);
	}
	nonempty(e) {
		return this.min(1, e);
	}
};
Ef.create = (e, t) => new Ef({
	valueType: e,
	minSize: null,
	maxSize: null,
	typeName: X.ZodSet,
	...J(t)
});
var Df = class e extends Y {
	constructor() {
		super(...arguments), this.validate = this.implement;
	}
	_parse(e) {
		let { ctx: t } = this._processInputParams(e);
		if (t.parsedType !== U.function) return G(t, {
			code: W.invalid_type,
			expected: U.function,
			received: t.parsedType
		}), K;
		function n(e, n) {
			return xd({
				data: e,
				path: t.path,
				errorMaps: [
					t.common.contextualErrorMap,
					t.schemaErrorMap,
					bd(),
					vd
				].filter((e) => !!e),
				issueData: {
					code: W.invalid_arguments,
					argumentsError: n
				}
			});
		}
		function r(e, n) {
			return xd({
				data: e,
				path: t.path,
				errorMaps: [
					t.common.contextualErrorMap,
					t.schemaErrorMap,
					bd(),
					vd
				].filter((e) => !!e),
				issueData: {
					code: W.invalid_return_type,
					returnTypeError: n
				}
			});
		}
		let i = { errorMap: t.common.contextualErrorMap }, a = t.data;
		if (this._def.returns instanceof Nf) {
			let e = this;
			return wd(async function(...t) {
				let o = new _d([]), s = await e._def.args.parseAsync(t, i).catch((e) => {
					throw o.addIssue(n(t, e)), o;
				}), c = await Reflect.apply(a, this, s);
				return await e._def.returns._def.type.parseAsync(c, i).catch((e) => {
					throw o.addIssue(r(c, e)), o;
				});
			});
		} else {
			let e = this;
			return wd(function(...t) {
				let o = e._def.args.safeParse(t, i);
				if (!o.success) throw new _d([n(t, o.error)]);
				let s = Reflect.apply(a, this, o.data), c = e._def.returns.safeParse(s, i);
				if (!c.success) throw new _d([r(s, c.error)]);
				return c.data;
			});
		}
	}
	parameters() {
		return this._def.args;
	}
	returnType() {
		return this._def.returns;
	}
	args(...t) {
		return new e({
			...this._def,
			args: Cf.create(t).rest(ff.create())
		});
	}
	returns(t) {
		return new e({
			...this._def,
			returns: t
		});
	}
	implement(e) {
		return this.parse(e);
	}
	strictImplement(e) {
		return this.parse(e);
	}
	static create(t, n, r) {
		return new e({
			args: t || Cf.create([]).rest(ff.create()),
			returns: n || ff.create(),
			typeName: X.ZodFunction,
			...J(r)
		});
	}
}, Of = class extends Y {
	get schema() {
		return this._def.getter();
	}
	_parse(e) {
		let { ctx: t } = this._processInputParams(e);
		return this._def.getter()._parse({
			data: t.data,
			path: t.path,
			parent: t
		});
	}
};
Of.create = (e, t) => new Of({
	getter: e,
	typeName: X.ZodLazy,
	...J(t)
});
var kf = class extends Y {
	_parse(e) {
		if (e.data !== this._def.value) {
			let t = this._getOrReturnCtx(e);
			return G(t, {
				received: t.data,
				code: W.invalid_literal,
				expected: this._def.value
			}), K;
		}
		return {
			status: "valid",
			value: e.data
		};
	}
	get value() {
		return this._def.value;
	}
};
kf.create = (e, t) => new kf({
	value: e,
	typeName: X.ZodLiteral,
	...J(t)
});
function Af(e, t) {
	return new jf({
		values: e,
		typeName: X.ZodEnum,
		...J(t)
	});
}
var jf = class e extends Y {
	_parse(e) {
		if (typeof e.data != "string") {
			let t = this._getOrReturnCtx(e), n = this._def.values;
			return G(t, {
				expected: H.joinValues(n),
				received: t.parsedType,
				code: W.invalid_type
			}), K;
		}
		if (this._cache ||= new Set(this._def.values), !this._cache.has(e.data)) {
			let t = this._getOrReturnCtx(e), n = this._def.values;
			return G(t, {
				received: t.data,
				code: W.invalid_enum_value,
				options: n
			}), K;
		}
		return wd(e.data);
	}
	get options() {
		return this._def.values;
	}
	get enum() {
		let e = {};
		for (let t of this._def.values) e[t] = t;
		return e;
	}
	get Values() {
		let e = {};
		for (let t of this._def.values) e[t] = t;
		return e;
	}
	get Enum() {
		let e = {};
		for (let t of this._def.values) e[t] = t;
		return e;
	}
	extract(t, n = this._def) {
		return e.create(t, {
			...this._def,
			...n
		});
	}
	exclude(t, n = this._def) {
		return e.create(this.options.filter((e) => !t.includes(e)), {
			...this._def,
			...n
		});
	}
};
jf.create = Af;
var Mf = class extends Y {
	_parse(e) {
		let t = H.getValidEnumValues(this._def.values), n = this._getOrReturnCtx(e);
		if (n.parsedType !== U.string && n.parsedType !== U.number) {
			let e = H.objectValues(t);
			return G(n, {
				expected: H.joinValues(e),
				received: n.parsedType,
				code: W.invalid_type
			}), K;
		}
		if (this._cache ||= new Set(H.getValidEnumValues(this._def.values)), !this._cache.has(e.data)) {
			let e = H.objectValues(t);
			return G(n, {
				received: n.data,
				code: W.invalid_enum_value,
				options: e
			}), K;
		}
		return wd(e.data);
	}
	get enum() {
		return this._def.values;
	}
};
Mf.create = (e, t) => new Mf({
	values: e,
	typeName: X.ZodNativeEnum,
	...J(t)
});
var Nf = class extends Y {
	unwrap() {
		return this._def.type;
	}
	_parse(e) {
		let { ctx: t } = this._processInputParams(e);
		return t.parsedType !== U.promise && t.common.async === !1 ? (G(t, {
			code: W.invalid_type,
			expected: U.promise,
			received: t.parsedType
		}), K) : wd((t.parsedType === U.promise ? t.data : Promise.resolve(t.data)).then((e) => this._def.type.parseAsync(e, {
			path: t.path,
			errorMap: t.common.contextualErrorMap
		})));
	}
};
Nf.create = (e, t) => new Nf({
	type: e,
	typeName: X.ZodPromise,
	...J(t)
});
var Pf = class extends Y {
	innerType() {
		return this._def.schema;
	}
	sourceType() {
		return this._def.schema._def.typeName === X.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
	}
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e), r = this._def.effect || null, i = {
			addIssue: (e) => {
				G(n, e), e.fatal ? t.abort() : t.dirty();
			},
			get path() {
				return n.path;
			}
		};
		if (i.addIssue = i.addIssue.bind(i), r.type === "preprocess") {
			let e = r.transform(n.data, i);
			if (n.common.async) return Promise.resolve(e).then(async (e) => {
				if (t.value === "aborted") return K;
				let r = await this._def.schema._parseAsync({
					data: e,
					path: n.path,
					parent: n
				});
				return r.status === "aborted" ? K : r.status === "dirty" || t.value === "dirty" ? Cd(r.value) : r;
			});
			{
				if (t.value === "aborted") return K;
				let r = this._def.schema._parseSync({
					data: e,
					path: n.path,
					parent: n
				});
				return r.status === "aborted" ? K : r.status === "dirty" || t.value === "dirty" ? Cd(r.value) : r;
			}
		}
		if (r.type === "refinement") {
			let e = (e) => {
				let t = r.refinement(e, i);
				if (n.common.async) return Promise.resolve(t);
				if (t instanceof Promise) throw Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
				return e;
			};
			if (n.common.async === !1) {
				let r = this._def.schema._parseSync({
					data: n.data,
					path: n.path,
					parent: n
				});
				return r.status === "aborted" ? K : (r.status === "dirty" && t.dirty(), e(r.value), {
					status: t.value,
					value: r.value
				});
			} else return this._def.schema._parseAsync({
				data: n.data,
				path: n.path,
				parent: n
			}).then((n) => n.status === "aborted" ? K : (n.status === "dirty" && t.dirty(), e(n.value).then(() => ({
				status: t.value,
				value: n.value
			}))));
		}
		if (r.type === "transform") if (n.common.async === !1) {
			let e = this._def.schema._parseSync({
				data: n.data,
				path: n.path,
				parent: n
			});
			if (!Dd(e)) return K;
			let a = r.transform(e.value, i);
			if (a instanceof Promise) throw Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
			return {
				status: t.value,
				value: a
			};
		} else return this._def.schema._parseAsync({
			data: n.data,
			path: n.path,
			parent: n
		}).then((e) => Dd(e) ? Promise.resolve(r.transform(e.value, i)).then((e) => ({
			status: t.value,
			value: e
		})) : K);
		H.assertNever(r);
	}
};
Pf.create = (e, t, n) => new Pf({
	schema: e,
	typeName: X.ZodEffects,
	effect: t,
	...J(n)
}), Pf.createWithPreprocess = (e, t, n) => new Pf({
	schema: t,
	effect: {
		type: "preprocess",
		transform: e
	},
	typeName: X.ZodEffects,
	...J(n)
});
var Ff = class extends Y {
	_parse(e) {
		return this._getType(e) === U.undefined ? wd(void 0) : this._def.innerType._parse(e);
	}
	unwrap() {
		return this._def.innerType;
	}
};
Ff.create = (e, t) => new Ff({
	innerType: e,
	typeName: X.ZodOptional,
	...J(t)
});
var If = class extends Y {
	_parse(e) {
		return this._getType(e) === U.null ? wd(null) : this._def.innerType._parse(e);
	}
	unwrap() {
		return this._def.innerType;
	}
};
If.create = (e, t) => new If({
	innerType: e,
	typeName: X.ZodNullable,
	...J(t)
});
var Lf = class extends Y {
	_parse(e) {
		let { ctx: t } = this._processInputParams(e), n = t.data;
		return t.parsedType === U.undefined && (n = this._def.defaultValue()), this._def.innerType._parse({
			data: n,
			path: t.path,
			parent: t
		});
	}
	removeDefault() {
		return this._def.innerType;
	}
};
Lf.create = (e, t) => new Lf({
	innerType: e,
	typeName: X.ZodDefault,
	defaultValue: typeof t.default == "function" ? t.default : () => t.default,
	...J(t)
});
var Rf = class extends Y {
	_parse(e) {
		let { ctx: t } = this._processInputParams(e), n = {
			...t,
			common: {
				...t.common,
				issues: []
			}
		}, r = this._def.innerType._parse({
			data: n.data,
			path: n.path,
			parent: { ...n }
		});
		return Od(r) ? r.then((e) => ({
			status: "valid",
			value: e.status === "valid" ? e.value : this._def.catchValue({
				get error() {
					return new _d(n.common.issues);
				},
				input: n.data
			})
		})) : {
			status: "valid",
			value: r.status === "valid" ? r.value : this._def.catchValue({
				get error() {
					return new _d(n.common.issues);
				},
				input: n.data
			})
		};
	}
	removeCatch() {
		return this._def.innerType;
	}
};
Rf.create = (e, t) => new Rf({
	innerType: e,
	typeName: X.ZodCatch,
	catchValue: typeof t.catch == "function" ? t.catch : () => t.catch,
	...J(t)
});
var zf = class extends Y {
	_parse(e) {
		if (this._getType(e) !== U.nan) {
			let t = this._getOrReturnCtx(e);
			return G(t, {
				code: W.invalid_type,
				expected: U.nan,
				received: t.parsedType
			}), K;
		}
		return {
			status: "valid",
			value: e.data
		};
	}
};
zf.create = (e) => new zf({
	typeName: X.ZodNaN,
	...J(e)
});
var Bf = class extends Y {
	_parse(e) {
		let { ctx: t } = this._processInputParams(e), n = t.data;
		return this._def.type._parse({
			data: n,
			path: t.path,
			parent: t
		});
	}
	unwrap() {
		return this._def.type;
	}
}, Vf = class e extends Y {
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e);
		if (n.common.async) return (async () => {
			let e = await this._def.in._parseAsync({
				data: n.data,
				path: n.path,
				parent: n
			});
			return e.status === "aborted" ? K : e.status === "dirty" ? (t.dirty(), Cd(e.value)) : this._def.out._parseAsync({
				data: e.value,
				path: n.path,
				parent: n
			});
		})();
		{
			let e = this._def.in._parseSync({
				data: n.data,
				path: n.path,
				parent: n
			});
			return e.status === "aborted" ? K : e.status === "dirty" ? (t.dirty(), {
				status: "dirty",
				value: e.value
			}) : this._def.out._parseSync({
				data: e.value,
				path: n.path,
				parent: n
			});
		}
	}
	static create(t, n) {
		return new e({
			in: t,
			out: n,
			typeName: X.ZodPipeline
		});
	}
}, Hf = class extends Y {
	_parse(e) {
		let t = this._def.innerType._parse(e), n = (e) => (Dd(e) && (e.value = Object.freeze(e.value)), e);
		return Od(t) ? t.then((e) => n(e)) : n(t);
	}
	unwrap() {
		return this._def.innerType;
	}
};
Hf.create = (e, t) => new Hf({
	innerType: e,
	typeName: X.ZodReadonly,
	...J(t)
}), _f.lazycreate;
var X;
(function(e) {
	e.ZodString = "ZodString", e.ZodNumber = "ZodNumber", e.ZodNaN = "ZodNaN", e.ZodBigInt = "ZodBigInt", e.ZodBoolean = "ZodBoolean", e.ZodDate = "ZodDate", e.ZodSymbol = "ZodSymbol", e.ZodUndefined = "ZodUndefined", e.ZodNull = "ZodNull", e.ZodAny = "ZodAny", e.ZodUnknown = "ZodUnknown", e.ZodNever = "ZodNever", e.ZodVoid = "ZodVoid", e.ZodArray = "ZodArray", e.ZodObject = "ZodObject", e.ZodUnion = "ZodUnion", e.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", e.ZodIntersection = "ZodIntersection", e.ZodTuple = "ZodTuple", e.ZodRecord = "ZodRecord", e.ZodMap = "ZodMap", e.ZodSet = "ZodSet", e.ZodFunction = "ZodFunction", e.ZodLazy = "ZodLazy", e.ZodLiteral = "ZodLiteral", e.ZodEnum = "ZodEnum", e.ZodEffects = "ZodEffects", e.ZodNativeEnum = "ZodNativeEnum", e.ZodOptional = "ZodOptional", e.ZodNullable = "ZodNullable", e.ZodDefault = "ZodDefault", e.ZodCatch = "ZodCatch", e.ZodPromise = "ZodPromise", e.ZodBranded = "ZodBranded", e.ZodPipeline = "ZodPipeline", e.ZodReadonly = "ZodReadonly";
})(X ||= {}), tf.create, rf.create, zf.create, af.create, of.create, sf.create, cf.create, lf.create, uf.create, df.create, ff.create, pf.create, mf.create, hf.create, _f.create, _f.strictCreate, vf.create, bf.create, Sf.create, Cf.create, wf.create, Tf.create, Ef.create, Df.create, Of.create, kf.create, jf.create, Mf.create, Nf.create, Pf.create, Ff.create, If.create, Pf.createWithPreprocess, Vf.create;
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/any.js
function Uf(e) {
	if (e.target !== "openAi") return {};
	let t = [
		...e.basePath,
		e.definitionPath,
		e.openAiAnyTypeName
	];
	return e.flags.hasReferencedOpenAiAnyType = !0, { $ref: e.$refStrategy === "relative" ? md(t, e.currentPath) : t.join("/") };
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/array.js
function Wf(e, t) {
	let n = { type: "array" };
	return e.type?._def && e.type?._def?.typeName !== X.ZodAny && (n.items = Z(e.type._def, {
		...t,
		currentPath: [...t.currentPath, "items"]
	})), e.minLength && V(n, "minItems", e.minLength.value, e.minLength.message, t), e.maxLength && V(n, "maxItems", e.maxLength.value, e.maxLength.message, t), e.exactLength && (V(n, "minItems", e.exactLength.value, e.exactLength.message, t), V(n, "maxItems", e.exactLength.value, e.exactLength.message, t)), n;
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/bigint.js
function Gf(e, t) {
	let n = {
		type: "integer",
		format: "int64"
	};
	if (!e.checks) return n;
	for (let r of e.checks) switch (r.kind) {
		case "min":
			t.target === "jsonSchema7" ? r.inclusive ? V(n, "minimum", r.value, r.message, t) : V(n, "exclusiveMinimum", r.value, r.message, t) : (r.inclusive || (n.exclusiveMinimum = !0), V(n, "minimum", r.value, r.message, t));
			break;
		case "max":
			t.target === "jsonSchema7" ? r.inclusive ? V(n, "maximum", r.value, r.message, t) : V(n, "exclusiveMaximum", r.value, r.message, t) : (r.inclusive || (n.exclusiveMaximum = !0), V(n, "maximum", r.value, r.message, t));
			break;
		case "multipleOf":
			V(n, "multipleOf", r.value, r.message, t);
			break;
	}
	return n;
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/boolean.js
function Kf() {
	return { type: "boolean" };
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/branded.js
function qf(e, t) {
	return Z(e.type._def, t);
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/catch.js
var Jf = (e, t) => Z(e.innerType._def, t);
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/date.js
function Yf(e, t, n) {
	let r = n ?? t.dateStrategy;
	if (Array.isArray(r)) return { anyOf: r.map((n, r) => Yf(e, t, n)) };
	switch (r) {
		case "string":
		case "format:date-time": return {
			type: "string",
			format: "date-time"
		};
		case "format:date": return {
			type: "string",
			format: "date"
		};
		case "integer": return Xf(e, t);
	}
}
var Xf = (e, t) => {
	let n = {
		type: "integer",
		format: "unix-time"
	};
	if (t.target === "openApi3") return n;
	for (let r of e.checks) switch (r.kind) {
		case "min":
			V(n, "minimum", r.value, r.message, t);
			break;
		case "max":
			V(n, "maximum", r.value, r.message, t);
			break;
	}
	return n;
};
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/default.js
function Zf(e, t) {
	return {
		...Z(e.innerType._def, t),
		default: e.defaultValue()
	};
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/effects.js
function Qf(e, t) {
	return t.effectStrategy === "input" ? Z(e.schema._def, t) : Uf(t);
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/enum.js
function $f(e) {
	return {
		type: "string",
		enum: Array.from(e.values)
	};
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/intersection.js
var ep = (e) => "type" in e && e.type === "string" ? !1 : "allOf" in e;
function tp(e, t) {
	let n = [Z(e.left._def, {
		...t,
		currentPath: [
			...t.currentPath,
			"allOf",
			"0"
		]
	}), Z(e.right._def, {
		...t,
		currentPath: [
			...t.currentPath,
			"allOf",
			"1"
		]
	})].filter((e) => !!e), r = t.target === "jsonSchema2019-09" ? { unevaluatedProperties: !1 } : void 0, i = [];
	return n.forEach((e) => {
		if (ep(e)) i.push(...e.allOf), e.unevaluatedProperties === void 0 && (r = void 0);
		else {
			let t = e;
			if ("additionalProperties" in e && e.additionalProperties === !1) {
				let { additionalProperties: n, ...r } = e;
				t = r;
			} else r = void 0;
			i.push(t);
		}
	}), i.length ? {
		allOf: i,
		...r
	} : void 0;
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/literal.js
function np(e, t) {
	let n = typeof e.value;
	return n !== "bigint" && n !== "number" && n !== "boolean" && n !== "string" ? { type: Array.isArray(e.value) ? "array" : "object" } : t.target === "openApi3" ? {
		type: n === "bigint" ? "integer" : n,
		enum: [e.value]
	} : {
		type: n === "bigint" ? "integer" : n,
		const: e.value
	};
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/string.js
var rp = void 0, ip = {
	cuid: /^[cC][^\s-]{8,}$/,
	cuid2: /^[0-9a-z]+$/,
	ulid: /^[0-9A-HJKMNP-TV-Z]{26}$/,
	email: /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_'+\-\.]*)[a-zA-Z0-9_+-]@([a-zA-Z0-9][a-zA-Z0-9\-]*\.)+[a-zA-Z]{2,}$/,
	emoji: () => (rp === void 0 && (rp = RegExp("^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", "u")), rp),
	uuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
	ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
	ipv4Cidr: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,
	ipv6: /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/,
	ipv6Cidr: /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
	base64: /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
	base64url: /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,
	nanoid: /^[a-zA-Z0-9_-]{21}$/,
	jwt: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/
};
function ap(e, t) {
	let n = { type: "string" };
	if (e.checks) for (let r of e.checks) switch (r.kind) {
		case "min":
			V(n, "minLength", typeof n.minLength == "number" ? Math.max(n.minLength, r.value) : r.value, r.message, t);
			break;
		case "max":
			V(n, "maxLength", typeof n.maxLength == "number" ? Math.min(n.maxLength, r.value) : r.value, r.message, t);
			break;
		case "email":
			switch (t.emailStrategy) {
				case "format:email":
					lp(n, "email", r.message, t);
					break;
				case "format:idn-email":
					lp(n, "idn-email", r.message, t);
					break;
				case "pattern:zod":
					up(n, ip.email, r.message, t);
					break;
			}
			break;
		case "url":
			lp(n, "uri", r.message, t);
			break;
		case "uuid":
			lp(n, "uuid", r.message, t);
			break;
		case "regex":
			up(n, r.regex, r.message, t);
			break;
		case "cuid":
			up(n, ip.cuid, r.message, t);
			break;
		case "cuid2":
			up(n, ip.cuid2, r.message, t);
			break;
		case "startsWith":
			up(n, RegExp(`^${op(r.value, t)}`), r.message, t);
			break;
		case "endsWith":
			up(n, RegExp(`${op(r.value, t)}$`), r.message, t);
			break;
		case "datetime":
			lp(n, "date-time", r.message, t);
			break;
		case "date":
			lp(n, "date", r.message, t);
			break;
		case "time":
			lp(n, "time", r.message, t);
			break;
		case "duration":
			lp(n, "duration", r.message, t);
			break;
		case "length":
			V(n, "minLength", typeof n.minLength == "number" ? Math.max(n.minLength, r.value) : r.value, r.message, t), V(n, "maxLength", typeof n.maxLength == "number" ? Math.min(n.maxLength, r.value) : r.value, r.message, t);
			break;
		case "includes":
			up(n, RegExp(op(r.value, t)), r.message, t);
			break;
		case "ip":
			r.version !== "v6" && lp(n, "ipv4", r.message, t), r.version !== "v4" && lp(n, "ipv6", r.message, t);
			break;
		case "base64url":
			up(n, ip.base64url, r.message, t);
			break;
		case "jwt":
			up(n, ip.jwt, r.message, t);
			break;
		case "cidr":
			r.version !== "v6" && up(n, ip.ipv4Cidr, r.message, t), r.version !== "v4" && up(n, ip.ipv6Cidr, r.message, t);
			break;
		case "emoji":
			up(n, ip.emoji(), r.message, t);
			break;
		case "ulid":
			up(n, ip.ulid, r.message, t);
			break;
		case "base64":
			switch (t.base64Strategy) {
				case "format:binary":
					lp(n, "binary", r.message, t);
					break;
				case "contentEncoding:base64":
					V(n, "contentEncoding", "base64", r.message, t);
					break;
				case "pattern:zod":
					up(n, ip.base64, r.message, t);
					break;
			}
			break;
		case "nanoid": up(n, ip.nanoid, r.message, t);
		case "toLowerCase":
		case "toUpperCase":
		case "trim": break;
		default: ((e) => {})(r);
	}
	return n;
}
function op(e, t) {
	return t.patternStrategy === "escape" ? cp(e) : e;
}
var sp = /* @__PURE__ */ new Set("ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789");
function cp(e) {
	let t = "";
	for (let n = 0; n < e.length; n++) sp.has(e[n]) || (t += "\\"), t += e[n];
	return t;
}
function lp(e, t, n, r) {
	e.format || e.anyOf?.some((e) => e.format) ? (e.anyOf ||= [], e.format && (e.anyOf.push({
		format: e.format,
		...e.errorMessage && r.errorMessages && { errorMessage: { format: e.errorMessage.format } }
	}), delete e.format, e.errorMessage && (delete e.errorMessage.format, Object.keys(e.errorMessage).length === 0 && delete e.errorMessage)), e.anyOf.push({
		format: t,
		...n && r.errorMessages && { errorMessage: { format: n } }
	})) : V(e, "format", t, n, r);
}
function up(e, t, n, r) {
	e.pattern || e.allOf?.some((e) => e.pattern) ? (e.allOf ||= [], e.pattern && (e.allOf.push({
		pattern: e.pattern,
		...e.errorMessage && r.errorMessages && { errorMessage: { pattern: e.errorMessage.pattern } }
	}), delete e.pattern, e.errorMessage && (delete e.errorMessage.pattern, Object.keys(e.errorMessage).length === 0 && delete e.errorMessage)), e.allOf.push({
		pattern: dp(t, r),
		...n && r.errorMessages && { errorMessage: { pattern: n } }
	})) : V(e, "pattern", dp(t, r), n, r);
}
function dp(e, t) {
	if (!t.applyRegexFlags || !e.flags) return e.source;
	let n = {
		i: e.flags.includes("i"),
		m: e.flags.includes("m"),
		s: e.flags.includes("s")
	}, r = n.i ? e.source.toLowerCase() : e.source, i = "", a = !1, o = !1, s = !1;
	for (let e = 0; e < r.length; e++) {
		if (a) {
			i += r[e], a = !1;
			continue;
		}
		if (n.i) {
			if (o) {
				if (r[e].match(/[a-z]/)) {
					s ? (i += r[e], i += `${r[e - 2]}-${r[e]}`.toUpperCase(), s = !1) : r[e + 1] === "-" && r[e + 2]?.match(/[a-z]/) ? (i += r[e], s = !0) : i += `${r[e]}${r[e].toUpperCase()}`;
					continue;
				}
			} else if (r[e].match(/[a-z]/)) {
				i += `[${r[e]}${r[e].toUpperCase()}]`;
				continue;
			}
		}
		if (n.m) {
			if (r[e] === "^") {
				i += "(^|(?<=[\r\n]))";
				continue;
			} else if (r[e] === "$") {
				i += "($|(?=[\r\n]))";
				continue;
			}
		}
		if (n.s && r[e] === ".") {
			i += o ? `${r[e]}\r\n` : `[${r[e]}\r\n]`;
			continue;
		}
		i += r[e], r[e] === "\\" ? a = !0 : o && r[e] === "]" ? o = !1 : !o && r[e] === "[" && (o = !0);
	}
	try {
		new RegExp(i);
	} catch {
		return console.warn(`Could not convert regex pattern at ${t.currentPath.join("/")} to a flag-independent form! Falling back to the flag-ignorant source`), e.source;
	}
	return i;
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/record.js
function fp(e, t) {
	if (t.target === "openAi" && console.warn("Warning: OpenAI may not support records in schemas! Try an array of key-value pairs instead."), t.target === "openApi3" && e.keyType?._def.typeName === X.ZodEnum) return {
		type: "object",
		required: e.keyType._def.values,
		properties: e.keyType._def.values.reduce((n, r) => ({
			...n,
			[r]: Z(e.valueType._def, {
				...t,
				currentPath: [
					...t.currentPath,
					"properties",
					r
				]
			}) ?? Uf(t)
		}), {}),
		additionalProperties: t.rejectedAdditionalProperties
	};
	let n = {
		type: "object",
		additionalProperties: Z(e.valueType._def, {
			...t,
			currentPath: [...t.currentPath, "additionalProperties"]
		}) ?? t.allowedAdditionalProperties
	};
	if (t.target === "openApi3") return n;
	if (e.keyType?._def.typeName === X.ZodString && e.keyType._def.checks?.length) {
		let { type: r, ...i } = ap(e.keyType._def, t);
		return {
			...n,
			propertyNames: i
		};
	} else if (e.keyType?._def.typeName === X.ZodEnum) return {
		...n,
		propertyNames: { enum: e.keyType._def.values }
	};
	else if (e.keyType?._def.typeName === X.ZodBranded && e.keyType._def.type._def.typeName === X.ZodString && e.keyType._def.type._def.checks?.length) {
		let { type: r, ...i } = qf(e.keyType._def, t);
		return {
			...n,
			propertyNames: i
		};
	}
	return n;
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/map.js
function pp(e, t) {
	return t.mapStrategy === "record" ? fp(e, t) : {
		type: "array",
		maxItems: 125,
		items: {
			type: "array",
			items: [Z(e.keyType._def, {
				...t,
				currentPath: [
					...t.currentPath,
					"items",
					"items",
					"0"
				]
			}) || Uf(t), Z(e.valueType._def, {
				...t,
				currentPath: [
					...t.currentPath,
					"items",
					"items",
					"1"
				]
			}) || Uf(t)],
			minItems: 2,
			maxItems: 2
		}
	};
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/nativeEnum.js
function mp(e) {
	let t = e.values, n = Object.keys(e.values).filter((e) => typeof t[t[e]] != "number").map((e) => t[e]), r = Array.from(new Set(n.map((e) => typeof e)));
	return {
		type: r.length === 1 ? r[0] === "string" ? "string" : "number" : ["string", "number"],
		enum: n
	};
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/never.js
function hp(e) {
	return e.target === "openAi" ? void 0 : { not: Uf({
		...e,
		currentPath: [...e.currentPath, "not"]
	}) };
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/null.js
function gp(e) {
	return e.target === "openApi3" ? {
		enum: ["null"],
		nullable: !0
	} : { type: "null" };
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/union.js
var _p = {
	ZodString: "string",
	ZodNumber: "number",
	ZodBigInt: "integer",
	ZodBoolean: "boolean",
	ZodNull: "null"
};
function vp(e, t) {
	if (t.target === "openApi3") return yp(e, t);
	let n = e.options instanceof Map ? Array.from(e.options.values()) : e.options;
	if (n.every((e) => e._def.typeName in _p && (!e._def.checks || !e._def.checks.length))) {
		let e = n.reduce((e, t) => {
			let n = _p[t._def.typeName];
			return n && !e.includes(n) ? [...e, n] : e;
		}, []);
		return { type: e.length > 1 ? e : e[0] };
	} else if (n.every((e) => e._def.typeName === "ZodLiteral" && !e.description)) {
		let e = n.reduce((e, t) => {
			let n = typeof t._def.value;
			switch (n) {
				case "string":
				case "number":
				case "boolean": return [...e, n];
				case "bigint": return [...e, "integer"];
				case "object": if (t._def.value === null) return [...e, "null"];
				default: return e;
			}
		}, []);
		if (e.length === n.length) {
			let t = e.filter((e, t, n) => n.indexOf(e) === t);
			return {
				type: t.length > 1 ? t : t[0],
				enum: n.reduce((e, t) => e.includes(t._def.value) ? e : [...e, t._def.value], [])
			};
		}
	} else if (n.every((e) => e._def.typeName === "ZodEnum")) return {
		type: "string",
		enum: n.reduce((e, t) => [...e, ...t._def.values.filter((t) => !e.includes(t))], [])
	};
	return yp(e, t);
}
var yp = (e, t) => {
	let n = (e.options instanceof Map ? Array.from(e.options.values()) : e.options).map((e, n) => Z(e._def, {
		...t,
		currentPath: [
			...t.currentPath,
			"anyOf",
			`${n}`
		]
	})).filter((e) => !!e && (!t.strictUnions || typeof e == "object" && Object.keys(e).length > 0));
	return n.length ? { anyOf: n } : void 0;
};
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/nullable.js
function bp(e, t) {
	if ([
		"ZodString",
		"ZodNumber",
		"ZodBigInt",
		"ZodBoolean",
		"ZodNull"
	].includes(e.innerType._def.typeName) && (!e.innerType._def.checks || !e.innerType._def.checks.length)) return t.target === "openApi3" ? {
		type: _p[e.innerType._def.typeName],
		nullable: !0
	} : { type: [_p[e.innerType._def.typeName], "null"] };
	if (t.target === "openApi3") {
		let n = Z(e.innerType._def, {
			...t,
			currentPath: [...t.currentPath]
		});
		return n && "$ref" in n ? {
			allOf: [n],
			nullable: !0
		} : n && {
			...n,
			nullable: !0
		};
	}
	let n = Z(e.innerType._def, {
		...t,
		currentPath: [
			...t.currentPath,
			"anyOf",
			"0"
		]
	});
	return n && { anyOf: [n, { type: "null" }] };
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/number.js
function xp(e, t) {
	let n = { type: "number" };
	if (!e.checks) return n;
	for (let r of e.checks) switch (r.kind) {
		case "int":
			n.type = "integer", pd(n, "type", r.message, t);
			break;
		case "min":
			t.target === "jsonSchema7" ? r.inclusive ? V(n, "minimum", r.value, r.message, t) : V(n, "exclusiveMinimum", r.value, r.message, t) : (r.inclusive || (n.exclusiveMinimum = !0), V(n, "minimum", r.value, r.message, t));
			break;
		case "max":
			t.target === "jsonSchema7" ? r.inclusive ? V(n, "maximum", r.value, r.message, t) : V(n, "exclusiveMaximum", r.value, r.message, t) : (r.inclusive || (n.exclusiveMaximum = !0), V(n, "maximum", r.value, r.message, t));
			break;
		case "multipleOf":
			V(n, "multipleOf", r.value, r.message, t);
			break;
	}
	return n;
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/object.js
function Sp(e, t) {
	let n = t.target === "openAi", r = {
		type: "object",
		properties: {}
	}, i = [], a = e.shape();
	for (let e in a) {
		let o = a[e];
		if (o === void 0 || o._def === void 0) continue;
		let s = wp(o);
		s && n && (o._def.typeName === "ZodOptional" && (o = o._def.innerType), o.isNullable() || (o = o.nullable()), s = !1);
		let c = Z(o._def, {
			...t,
			currentPath: [
				...t.currentPath,
				"properties",
				e
			],
			propertyPath: [
				...t.currentPath,
				"properties",
				e
			]
		});
		c !== void 0 && (r.properties[e] = c, s || i.push(e));
	}
	i.length && (r.required = i);
	let o = Cp(e, t);
	return o !== void 0 && (r.additionalProperties = o), r;
}
function Cp(e, t) {
	if (e.catchall._def.typeName !== "ZodNever") return Z(e.catchall._def, {
		...t,
		currentPath: [...t.currentPath, "additionalProperties"]
	});
	switch (e.unknownKeys) {
		case "passthrough": return t.allowedAdditionalProperties;
		case "strict": return t.rejectedAdditionalProperties;
		case "strip": return t.removeAdditionalStrategy === "strict" ? t.allowedAdditionalProperties : t.rejectedAdditionalProperties;
	}
}
function wp(e) {
	try {
		return e.isOptional();
	} catch {
		return !0;
	}
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/optional.js
var Tp = (e, t) => {
	if (t.currentPath.toString() === t.propertyPath?.toString()) return Z(e.innerType._def, t);
	let n = Z(e.innerType._def, {
		...t,
		currentPath: [
			...t.currentPath,
			"anyOf",
			"1"
		]
	});
	return n ? { anyOf: [{ not: Uf(t) }, n] } : Uf(t);
}, Ep = (e, t) => {
	if (t.pipeStrategy === "input") return Z(e.in._def, t);
	if (t.pipeStrategy === "output") return Z(e.out._def, t);
	let n = Z(e.in._def, {
		...t,
		currentPath: [
			...t.currentPath,
			"allOf",
			"0"
		]
	});
	return { allOf: [n, Z(e.out._def, {
		...t,
		currentPath: [
			...t.currentPath,
			"allOf",
			n ? "1" : "0"
		]
	})].filter((e) => e !== void 0) };
};
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/promise.js
function Dp(e, t) {
	return Z(e.type._def, t);
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/set.js
function Op(e, t) {
	let n = {
		type: "array",
		uniqueItems: !0,
		items: Z(e.valueType._def, {
			...t,
			currentPath: [...t.currentPath, "items"]
		})
	};
	return e.minSize && V(n, "minItems", e.minSize.value, e.minSize.message, t), e.maxSize && V(n, "maxItems", e.maxSize.value, e.maxSize.message, t), n;
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/tuple.js
function kp(e, t) {
	return e.rest ? {
		type: "array",
		minItems: e.items.length,
		items: e.items.map((e, n) => Z(e._def, {
			...t,
			currentPath: [
				...t.currentPath,
				"items",
				`${n}`
			]
		})).reduce((e, t) => t === void 0 ? e : [...e, t], []),
		additionalItems: Z(e.rest._def, {
			...t,
			currentPath: [...t.currentPath, "additionalItems"]
		})
	} : {
		type: "array",
		minItems: e.items.length,
		maxItems: e.items.length,
		items: e.items.map((e, n) => Z(e._def, {
			...t,
			currentPath: [
				...t.currentPath,
				"items",
				`${n}`
			]
		})).reduce((e, t) => t === void 0 ? e : [...e, t], [])
	};
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/undefined.js
function Ap(e) {
	return { not: Uf(e) };
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/unknown.js
function jp(e) {
	return Uf(e);
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/readonly.js
var Mp = (e, t) => Z(e.innerType._def, t), Np = (e, t, n) => {
	switch (t) {
		case X.ZodString: return ap(e, n);
		case X.ZodNumber: return xp(e, n);
		case X.ZodObject: return Sp(e, n);
		case X.ZodBigInt: return Gf(e, n);
		case X.ZodBoolean: return Kf();
		case X.ZodDate: return Yf(e, n);
		case X.ZodUndefined: return Ap(n);
		case X.ZodNull: return gp(n);
		case X.ZodArray: return Wf(e, n);
		case X.ZodUnion:
		case X.ZodDiscriminatedUnion: return vp(e, n);
		case X.ZodIntersection: return tp(e, n);
		case X.ZodTuple: return kp(e, n);
		case X.ZodRecord: return fp(e, n);
		case X.ZodLiteral: return np(e, n);
		case X.ZodEnum: return $f(e);
		case X.ZodNativeEnum: return mp(e);
		case X.ZodNullable: return bp(e, n);
		case X.ZodOptional: return Tp(e, n);
		case X.ZodMap: return pp(e, n);
		case X.ZodSet: return Op(e, n);
		case X.ZodLazy: return () => e.getter()._def;
		case X.ZodPromise: return Dp(e, n);
		case X.ZodNaN:
		case X.ZodNever: return hp(n);
		case X.ZodEffects: return Qf(e, n);
		case X.ZodAny: return Uf(n);
		case X.ZodUnknown: return jp(n);
		case X.ZodDefault: return Zf(e, n);
		case X.ZodBranded: return qf(e, n);
		case X.ZodReadonly: return Mp(e, n);
		case X.ZodCatch: return Jf(e, n);
		case X.ZodPipeline: return Ep(e, n);
		case X.ZodFunction:
		case X.ZodVoid:
		case X.ZodSymbol: return;
		default: return ((e) => void 0)(t);
	}
};
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parseDef.js
function Z(e, t, n = !1) {
	let r = t.seen.get(e);
	if (t.override) {
		let i = t.override?.(e, t, r, n);
		if (i !== ld) return i;
	}
	if (r && !n) {
		let e = Pp(r, t);
		if (e !== void 0) return e;
	}
	let i = {
		def: e,
		path: t.currentPath,
		jsonSchema: void 0
	};
	t.seen.set(e, i);
	let a = Np(e, e.typeName, t), o = typeof a == "function" ? Z(a(), t) : a;
	if (o && Fp(e, t, o), t.postProcess) {
		let n = t.postProcess(o, e, t);
		return i.jsonSchema = o, n;
	}
	return i.jsonSchema = o, o;
}
var Pp = (e, t) => {
	switch (t.$refStrategy) {
		case "root": return { $ref: e.path.join("/") };
		case "relative": return { $ref: md(t.currentPath, e.path) };
		case "none":
		case "seen": return e.path.length < t.currentPath.length && e.path.every((e, n) => t.currentPath[n] === e) ? (console.warn(`Recursive reference detected at ${t.currentPath.join("/")}! Defaulting to any`), Uf(t)) : t.$refStrategy === "seen" ? Uf(t) : void 0;
	}
}, Fp = (e, t, n) => (e.description && (n.description = e.description, t.markdownDescription && (n.markdownDescription = e.description)), n), Ip = (e, t) => {
	let n = fd(t), r = typeof t == "object" && t.definitions ? Object.entries(t.definitions).reduce((e, [t, r]) => ({
		...e,
		[t]: Z(r._def, {
			...n,
			currentPath: [
				...n.basePath,
				n.definitionPath,
				t
			]
		}, !0) ?? Uf(n)
	}), {}) : void 0, i = typeof t == "string" ? t : t?.nameStrategy === "title" ? void 0 : t?.name, a = Z(e._def, i === void 0 ? n : {
		...n,
		currentPath: [
			...n.basePath,
			n.definitionPath,
			i
		]
	}, !1) ?? Uf(n), o = typeof t == "object" && t.name !== void 0 && t.nameStrategy === "title" ? t.name : void 0;
	o !== void 0 && (a.title = o), n.flags.hasReferencedOpenAiAnyType && (r ||= {}, r[n.openAiAnyTypeName] || (r[n.openAiAnyTypeName] = {
		type: [
			"string",
			"number",
			"integer",
			"boolean",
			"array",
			"null"
		],
		items: { $ref: n.$refStrategy === "relative" ? "1" : [
			...n.basePath,
			n.definitionPath,
			n.openAiAnyTypeName
		].join("/") }
	}));
	let s = i === void 0 ? r ? {
		...a,
		[n.definitionPath]: r
	} : a : {
		$ref: [
			...n.$refStrategy === "relative" ? [] : n.basePath,
			n.definitionPath,
			i
		].join("/"),
		[n.definitionPath]: {
			...r,
			[i]: a
		}
	};
	return n.target === "jsonSchema7" ? s.$schema = "http://json-schema.org/draft-07/schema#" : (n.target === "jsonSchema2019-09" || n.target === "openAi") && (s.$schema = "https://json-schema.org/draft/2019-09/schema#"), n.target === "openAi" && ("anyOf" in s || "oneOf" in s || "allOf" in s || "type" in s && Array.isArray(s.type)) && console.warn("Warning: OpenAI may not support schemas with unions as roots! Try wrapping it in an object property."), s;
};
//#endregion
//#region node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/dist/esm5/internal/observable/dom/fetch.js
function Lp(e, t) {
	t === void 0 && (t = {});
	var n = t.selector, r = hi(t, ["selector"]);
	return new ta(function(t) {
		var i = new AbortController(), a = i.signal, o = !0, s = r.signal;
		if (s) if (s.aborted) i.abort();
		else {
			var c = function() {
				a.aborted || i.abort();
			};
			s.addEventListener("abort", c), t.add(function() {
				return s.removeEventListener("abort", c);
			});
		}
		var l = mi(mi({}, r), { signal: a }), u = function(e) {
			o = !1, t.error(e);
		};
		return fetch(e, l).then(function(e) {
			n ? qa(n(e)).subscribe(sa(t, void 0, function() {
				o = !1, t.complete();
			}, u)) : (o = !1, t.next(e), t.complete());
		}).catch(u), function() {
			o && i.abort();
		};
	});
}
//#endregion
//#region node_modules/.pnpm/@copilotkit+core@1.59.2_@ag-ui+core@0.0.53_zod@4.4.3/node_modules/@copilotkit/core/dist/index.mjs
function Rp(e) {
	return new ta((t) => {
		e.onOpen(() => t.next({ type: "open" })), e.onError((e) => t.next({
			type: "error",
			error: e
		}));
	});
}
function zp(e) {
	return new ta((t) => {
		e.join().receive("ok", () => {
			t.next({ type: "joined" }), t.complete();
		}).receive("error", (e) => {
			t.next({
				type: "error",
				response: e
			}), t.complete();
		}).receive("timeout", () => {
			t.next({ type: "timeout" }), t.complete();
		});
	});
}
function Bp(e) {
	return ko(() => {
		let t = new cd(e.url, e.options), n = Rp(t).pipe(qo({
			bufferSize: 1,
			refCount: !0
		}));
		return t.connect(), Oo(M({
			socket: t,
			signals$: n
		}), jo).pipe(Uo(() => t.disconnect()));
	});
}
function Vp(e) {
	return e.socket$.pipe(Jo(({ socket: t }) => ko(() => {
		let n = t.channel(e.topic, e.params);
		return Oo(M({
			channel: n,
			joinOutcome$: zp(n).pipe(qo({
				bufferSize: 1,
				refCount: !0
			}))
		}), jo).pipe(Uo(() => {
			e.leaveOnUnsubscribe !== !1 && n.leave();
		}));
	})));
}
function Hp(e, t) {
	return new ta((n) => {
		let r = e.on(t, (e) => n.next(e));
		return () => {
			e.off(t, r);
		};
	});
}
function Up(e) {
	return e.pipe(Jo((e) => e.joinOutcome$));
}
function Wp(e) {
	return Up(e).pipe(Lo(1), To((e) => {
		if (e.type === "joined") return ja;
		throw e.type === "timeout" ? /* @__PURE__ */ Error("Timed out joining channel") : /* @__PURE__ */ Error(`Failed to join channel: ${JSON.stringify(e.response)}`);
	}));
}
function Gp(e) {
	return e.pipe(Jo((e) => e.signals$));
}
function Kp(e, t) {
	return e.pipe(Wo((e, t) => t.type === "open" ? 0 : e + 1, 0), Mo((e) => e >= t), Lo(1), To((e) => N(() => /* @__PURE__ */ Error(`WebSocket connection failed after ${e} consecutive errors`))));
}
var qp = "ag_ui_event", Jp = "replay_complete", Yp = "stream_idle", Xp = "stop_run", Zp = class extends Error {
	constructor(e) {
		super(e ? `Thread ${e} is locked` : "Thread is locked"), this.name = "AgentThreadLockedError";
	}
}, Qp = class e extends Il {
	config;
	socket = null;
	activeChannel = null;
	canonicalRunId = null;
	sharedState;
	constructor(e, t = { lastSeenEventIds: /* @__PURE__ */ new Map() }) {
		super(), this.config = e, this.sharedState = t;
	}
	clone() {
		return new e(this.config, this.sharedState);
	}
	async connectAgent(e, t) {
		let n = this;
		try {
			this.isRunning = !0, this.agentId = this.agentId ?? tl();
			let r = e?.runId || !this.canonicalRunId ? e : {
				...e,
				runId: this.canonicalRunId
			}, i = this.prepareRunAgentInput(r), a, o = new Set(this.messages.map((e) => e.id)), s = [
				{ onRunFinishedEvent: (e) => {
					a = e.result;
				} },
				...this.subscribers,
				t ?? {}
			];
			await this.onInitialize(i, s), n.activeRunDetach$ = new ua();
			let c;
			n.activeRunCompletionPromise = new Promise((e) => {
				c = e;
			});
			let l = ko(() => this.connect(i)).pipe(yl(this.debug), Yo(n.activeRunDetach$)), u = this.apply(i, l, s);
			await _o(this.processApplyEvents(i, u, s).pipe(No((e) => (this.isRunning = !1, this.onError(i, e, s))), Uo(() => {
				this.isRunning = !1, this.onFinalize(i, s), c?.(), c = void 0, n.activeRunCompletionPromise = void 0, n.activeRunDetach$ = void 0;
			})), { defaultValue: void 0 });
			let d = R(this.messages).filter((e) => !o.has(e.id));
			return {
				result: a,
				newMessages: d
			};
		} finally {
			this.isRunning = !1;
		}
	}
	abortRun() {
		if (this.activeChannel && this.canonicalRunId) {
			let e = setTimeout(() => t(), 5e3), t = () => {
				clearTimeout(e), this.detachActiveRun(), this.cleanup();
			};
			this.activeChannel.push(Xp, { run_id: this.canonicalRunId }).receive("ok", t).receive("error", t).receive("timeout", t);
		} else this.detachActiveRun(), this.cleanup();
	}
	run(e) {
		return this.threadId = e.threadId, this.canonicalRunId = e.runId, ko(() => this.requestJoinCredentials$("run", e)).pipe(Jo((t) => {
			if (t === null) return N(() => /* @__PURE__ */ Error("REST run request returned no credentials"));
			let n = this.applyCanonicalRunIdentity(e, t, { fallbackToInputRunId: !0 });
			return this.observeThread$(n, t, {
				completeOnRunError: !1,
				streamMode: "run"
			});
		}));
	}
	connect(e) {
		return this.threadId = e.threadId, this.canonicalRunId = null, ko(() => this.requestJoinCredentials$("connect", e)).pipe(Jo((t) => {
			if (t === null) return ja;
			let n = this.applyCanonicalRunIdentity(e, t, { fallbackToInputRunId: !1 });
			return this.observeThread$(n, t, {
				completeOnRunError: !1,
				streamMode: "connect"
			});
		}));
	}
	cleanupOwned(e, t) {
		e && (e.leave(), this.activeChannel === e && (this.activeChannel = null)), t && (t.disconnect(), this.socket === t && (this.socket = null)), this.canonicalRunId = null;
	}
	cleanup() {
		this.cleanupOwned(this.activeChannel, this.socket);
	}
	requestJoinCredentials$(e, t) {
		return ko(async () => {
			try {
				let n = await fetch(this.buildRuntimeUrl(e), {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						...this.config.headers
					},
					body: JSON.stringify({
						threadId: t.threadId,
						runId: t.runId,
						messages: t.messages,
						tools: t.tools,
						context: t.context,
						state: t.state,
						forwardedProps: t.forwardedProps,
						...e === "connect" ? { lastSeenEventId: this.getReconnectCursor(t) } : {}
					}),
					...this.config.credentials ? { credentials: this.config.credentials } : {}
				});
				if (n.status === 204 && e === "connect") return null;
				if (n.status === 409 && e === "run") throw new Zp(t.threadId);
				if (!n.ok) {
					let e = await n.text().catch(() => "");
					throw Error(e || n.statusText || String(n.status));
				}
				return this.normalizeJoinCredentials(await n.json(), t);
			} catch (t) {
				throw t instanceof Zp ? t : Error(`REST ${e} request failed: ${t instanceof Error ? t.message : String(t)}`, { cause: t });
			}
		});
	}
	normalizeJoinCredentials(e, t) {
		let n = e && typeof e == "object" ? e : null, r = n?.realtime && typeof n.realtime == "object" ? n.realtime : null;
		if (typeof n?.joinToken != "string" || !n.joinToken) throw Error("missing joinToken");
		if (typeof r?.clientUrl != "string" || !r.clientUrl) throw Error("missing realtime.clientUrl");
		if (typeof r.topic != "string" || !r.topic) throw Error("missing realtime.topic");
		return {
			threadId: typeof n.threadId == "string" && n.threadId ? n.threadId : t.threadId,
			runId: typeof n.runId == "string" && n.runId ? n.runId : null,
			joinToken: n.joinToken,
			realtime: {
				clientUrl: r.clientUrl,
				topic: r.topic
			}
		};
	}
	observeThread$(e, t, n) {
		return this.observeThreadSession$(e, t, n).pipe(No((t) => this.isSocketReconnectExhaustedError(t) ? this.requestJoinCredentials$("connect", e).pipe(Jo((t) => t === null ? ja : this.observeThread$(this.applyCanonicalRunIdentity(e, t, { fallbackToInputRunId: n.streamMode === "run" }), t, {
			...n,
			channelMode: "connect",
			replayCursor: this.getReconnectCursor(e)
		}))) : N(() => t)));
	}
	observeThreadSession$(e, t, n) {
		return ko(() => {
			let r = null, i = null, a = Bp({
				url: t.realtime.clientUrl,
				options: {
					params: {
						...this.config.socketParams,
						join_token: t.joinToken
					},
					reconnectAfterMs: vu(100, 1e4),
					rejoinAfterMs: vu(1e3, 3e4)
				}
			}).pipe(Xo(({ socket: e }) => {
				r = e, this.socket = r;
			}), qo({
				bufferSize: 1,
				refCount: !0
			})), o = this.createThreadChannelParams(e, n.channelMode ?? n.streamMode, n.replayCursor), s = Vp({
				socket$: a,
				topic: t.realtime.topic,
				params: o
			}).pipe(Xo(({ channel: e }) => {
				i = e, this.activeChannel = i;
			}), qo({
				bufferSize: 1,
				refCount: !0
			})), c = this.observeThreadEvents$(e.threadId, s, n).pipe(Go()), l = this.observeControlEvent$(e.threadId, s, Jp).pipe(Ro(), Go()), u = this.observeControlEvent$(e.threadId, s, Yp).pipe(qo({
				bufferSize: 1,
				refCount: !0
			})), d = n.streamMode === "connect" ? u.pipe(Lo(1)) : ja, f = Ao(c.pipe(Ro(), Ho(null), Lo(1)), d);
			return Ao(this.joinThreadChannel$(s), this.observeSocketHealth$(a).pipe(Yo(f)), c.pipe(Yo(d)), l.pipe(Yo(f)), d.pipe(Ro())).pipe(Uo(() => this.cleanupOwned(i, r)));
		});
	}
	joinThreadChannel$(e) {
		return Wp(e);
	}
	observeSocketHealth$(e) {
		return Kp(Gp(e), 5);
	}
	observeThreadEvents$(e, t, n) {
		return t.pipe(Jo(({ channel: e }) => this.observeChannelEvent$(e, qp)), Xo((t) => {
			this.updateLastSeenEventId(e, t);
		}), To((e) => this.createThreadNotifications(e, {
			completeOnRunError: n.completeOnRunError,
			completeOnRunFinished: n.streamMode === "run",
			errorOnRunError: n.streamMode === "run"
		})), zo());
	}
	observeControlEvent$(e, t, n) {
		return t.pipe(Jo(({ channel: e }) => this.observeChannelEvent$(e, n)), Xo((t) => this.updateLastSeenEventIdFromControl(e, t)));
	}
	observeChannelEvent$(e, t) {
		return Hp(e, t);
	}
	createThreadNotifications(e, t) {
		if (e.type === O.RUN_FINISHED) return t.completeOnRunFinished ? [mo.createNext(e), mo.createComplete()] : [mo.createNext(e)];
		if (e.type === O.RUN_ERROR) {
			let n = e.message ?? "Run error";
			return t.completeOnRunError ? [mo.createNext(e), mo.createComplete()] : t.errorOnRunError ? [mo.createNext(e), mo.createError(Error(n))] : [mo.createNext(e)];
		}
		return [mo.createNext(e)];
	}
	buildRuntimeUrl(e) {
		let t = `${this.config.runtimeUrl}/agent/${encodeURIComponent(this.config.agentId)}/${e}`, n = typeof window < "u" && window.location ? window.location.origin : "http://localhost";
		return new URL(t, new URL(this.config.runtimeUrl, n)).toString();
	}
	createThreadChannelParams(e, t, n) {
		return t === "run" ? {
			stream_mode: "run",
			run_id: e.runId
		} : {
			stream_mode: "connect",
			last_seen_event_id: n === void 0 ? this.getReconnectCursor(e) : n
		};
	}
	getLastSeenEventId(e) {
		return this.sharedState.lastSeenEventIds.get(e) ?? null;
	}
	getReconnectCursor(e) {
		return this.getLastSeenEventId(e.threadId);
	}
	clearReconnectCursor(e) {
		this.sharedState.lastSeenEventIds.delete(e);
	}
	updateLastSeenEventId(e, t) {
		let n = this.readEventId(t);
		n && this.sharedState.lastSeenEventIds.set(e, n);
	}
	updateLastSeenEventIdFromControl(e, t) {
		let n = this.readControlEventId(t);
		n && this.sharedState.lastSeenEventIds.set(e, n);
	}
	readEventId(e) {
		let t = e.metadata;
		if (!t || typeof t != "object") return null;
		let n = t.cpki_event_id;
		return typeof n == "string" ? n : null;
	}
	readControlEventId(e) {
		if (!e || typeof e != "object") return null;
		let t = e.latestEventId;
		return typeof t == "string" ? t : null;
	}
	applyCanonicalRunIdentity(e, t, n) {
		this.threadId = t.threadId;
		let r = t.runId ?? (n.fallbackToInputRunId ? e.runId : null);
		return this.canonicalRunId = r, {
			...e,
			threadId: t.threadId,
			...r === null ? {} : { runId: r }
		};
	}
	isSocketReconnectExhaustedError(e) {
		return e instanceof Error && e.message.includes("WebSocket connection failed after");
	}
};
function $p(e) {
	return "headers" in e;
}
function em(e) {
	return "credentials" in e;
}
function tm(e) {
	return typeof e == "object" && !!e && "name" in e && e.name === "ZodError";
}
function nm(e) {
	return (e instanceof DOMException || e instanceof Error) && e.name === "AbortError";
}
function rm(e) {
	return e.pipe(No((e) => {
		if (tm(e) || nm(e)) return ja;
		throw e;
	}));
}
var im = class e extends Ll {
	runtimeUrl;
	credentials;
	runtimeAgentId;
	transport;
	singleEndpointUrl;
	runtimeMode;
	intelligence;
	_capabilities;
	delegate;
	runtimeInfoPromise;
	constructor(e) {
		let t = e.runtimeUrl ? e.runtimeUrl.replace(/\/$/, "") : void 0, n = e.transport ?? "auto", r = e.runtimeAgentId ?? e.agentId ?? "", i = n === "single" ? t ?? e.runtimeUrl ?? "" : `${t ?? e.runtimeUrl}/agent/${encodeURIComponent(r)}/run`;
		if (!i) throw Error("ProxiedCopilotRuntimeAgent requires a runtimeUrl when transport is set to 'single'.");
		super({
			...e,
			url: i
		}), this.runtimeUrl = t ?? e.runtimeUrl, this.credentials = e.credentials, this.runtimeAgentId = e.runtimeAgentId, this.transport = n, this.runtimeMode = e.runtimeMode ?? "sse", this.intelligence = e.intelligence, this._capabilities = e.capabilities, e.debug && (this.debug = e.debug), this.transport === "single" && (this.singleEndpointUrl = this.runtimeUrl);
	}
	routedAgentId() {
		let e = this.runtimeAgentId ?? this.agentId;
		if (!e) throw Error("ProxiedCopilotRuntimeAgent: cannot make a runtime request without an agentId or runtimeAgentId.");
		return e;
	}
	get capabilities() {
		return this._capabilities;
	}
	async getCapabilities() {
		return this._capabilities ?? {};
	}
	async detachActiveRun() {
		this.delegate && await this.delegate.detachActiveRun(), await super.detachActiveRun();
	}
	abortRun() {
		if (this.delegate) {
			this.syncDelegate(this.delegate), this.delegate.abortRun(), this.detachActiveRun();
			return;
		}
		if (!this.agentId || !this.threadId || typeof fetch > "u") return;
		let e = this.routedAgentId();
		if (this.transport === "single") {
			if (!this.singleEndpointUrl) return;
			let t = new Headers({
				...this.headers,
				"Content-Type": "application/json"
			});
			fetch(this.singleEndpointUrl, {
				method: "POST",
				headers: t,
				body: JSON.stringify({
					method: "agent/stop",
					params: {
						agentId: e,
						threadId: this.threadId
					}
				}),
				...this.credentials ? { credentials: this.credentials } : {}
			}).catch((e) => {
				console.error("ProxiedCopilotRuntimeAgent: stop request failed", e);
			});
			return;
		}
		if (!this.runtimeUrl) return;
		let t = `${this.runtimeUrl}/agent/${encodeURIComponent(e)}/stop/${encodeURIComponent(this.threadId)}`, n = typeof window < "u" && window.location ? window.location.origin : "http://localhost", r = new URL(this.runtimeUrl, n), i = new URL(t, r);
		fetch(i.toString(), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...this.headers
			},
			...this.credentials ? { credentials: this.credentials } : {}
		}).catch((e) => {
			console.error("ProxiedCopilotRuntimeAgent: stop request failed", e);
		});
	}
	async connectAgent(e, t) {
		if (this.runtimeMode !== "intelligence") return super.connectAgent(e, t);
		this.delegate && await this.delegate.detachActiveRun(), await this.resolveDelegate();
		let n = this.delegate, r = n.subscribe({
			onMessagesChanged: () => {
				this.setMessages([...n.messages]);
			},
			onStateChanged: () => {
				this.setState({ ...n.state });
			},
			onRunInitialized: () => {
				this.isRunning = !0;
			},
			onRunFinalized: () => {
				this.isRunning = !1;
			},
			onRunFailed: () => {
				this.isRunning = !1;
			},
			onRunErrorEvent: () => {
				this.isRunning = !1;
			}
		}), i = this.subscribers.map((e) => n.subscribe(e));
		try {
			let r = await n.connectAgent(e, t);
			return this.setMessages([...n.messages]), this.setState({ ...n.state }), r;
		} finally {
			this.isRunning = !1, r.unsubscribe();
			for (let e of i) e.unsubscribe();
		}
	}
	connect(e) {
		return this.runtimeMode === "intelligence" ? this.#e(e) : this.#t(e);
	}
	run(e) {
		return this.runtimeMode === "intelligence" ? this.#n(e) : this.#r(e);
	}
	#e(e) {
		return ko(() => fo(this.resolveDelegate())).pipe(Jo((t) => rm(t.connect(e))));
	}
	#t(e) {
		let t = this.routedAgentId();
		if (this.transport === "single") {
			if (!this.singleEndpointUrl) throw Error("Single endpoint transport requires a runtimeUrl");
			let n = this.createSingleRouteRequestInit(e, "agent/connect", { agentId: t });
			return rm(ml(dl(this.singleEndpointUrl, n)));
		}
		return rm(ml(dl(`${this.runtimeUrl}/agent/${t}/connect`, this.requestInit(e))));
	}
	#n(e) {
		return ko(() => fo(this.resolveDelegate())).pipe(Jo((t) => rm(t.run(e))));
	}
	#r(e) {
		if (this.transport === "single") {
			if (!this.singleEndpointUrl) throw Error("Single endpoint transport requires a runtimeUrl");
			let t = this.createSingleRouteRequestInit(e, "agent/run", { agentId: this.routedAgentId() });
			return rm(ml(dl(this.singleEndpointUrl, t)));
		}
		return rm(super.run(e));
	}
	clone() {
		let t = new e({
			runtimeUrl: this.runtimeUrl,
			agentId: this.agentId,
			runtimeAgentId: this.runtimeAgentId,
			description: this.description,
			headers: { ...this.headers },
			credentials: this.credentials,
			transport: this.transport,
			runtimeMode: this.runtimeMode,
			intelligence: this.intelligence,
			capabilities: this._capabilities,
			debug: this.debug
		});
		return t.threadId = this.threadId, t.setState(this.state), t.setMessages(this.messages), this.delegate && (t.delegate = this.delegate.clone(), t.syncDelegate(t.delegate)), t;
	}
	clearReplayCursor(e) {
		this.runtimeMode === "intelligence" && this.delegate?.clearReconnectCursor?.(e);
	}
	async resolveDelegate() {
		if (await this.ensureRuntimeMode(), !this.delegate) {
			if (this.runtimeMode !== "intelligence") throw Error("A delegate is only created for Intelligence mode");
			this.delegate = this.createIntelligenceDelegate();
		}
		return this.syncDelegate(this.delegate), this.delegate;
	}
	async ensureRuntimeMode() {
		if (this.runtimeMode === "pending") {
			if (!this.runtimeUrl) throw Error("Runtime URL is not set");
			this.runtimeInfoPromise ??= this.fetchRuntimeInfo().then((e) => {
				this.runtimeMode = e.mode ?? "sse", this.intelligence = e.intelligence;
			}), await this.runtimeInfoPromise;
		}
	}
	async fetchRuntimeInfo() {
		let e = { ...this.headers };
		if (this.transport === "auto") return this.fetchRuntimeInfoAutoDetect(e);
		let t, n;
		if (this.transport === "single") {
			if (!this.singleEndpointUrl) throw Error("Single endpoint transport requires a runtimeUrl");
			e["Content-Type"] ||= "application/json", n = this.runtimeUrl, t = {
				method: "POST",
				body: JSON.stringify({ method: "info" })
			};
		} else n = `${this.runtimeUrl}/info`, t = {};
		let r = await fetch(n, {
			...t,
			headers: e,
			...this.credentials ? { credentials: this.credentials } : {}
		});
		if (!r.ok) throw Error(`Runtime info request failed with status ${r.status}`);
		return await r.json();
	}
	async fetchRuntimeInfoAutoDetect(e) {
		try {
			let t = await fetch(`${this.runtimeUrl}/info`, {
				headers: { ...e },
				...this.credentials ? { credentials: this.credentials } : {}
			});
			if (t.status >= 200 && t.status < 300) return this.transport = "rest", await t.json();
		} catch {}
		let t = { ...e };
		t["Content-Type"] ||= "application/json";
		let n = await fetch(this.runtimeUrl, {
			method: "POST",
			headers: t,
			body: JSON.stringify({ method: "info" }),
			...this.credentials ? { credentials: this.credentials } : {}
		});
		if (!n.ok) throw Error(`Runtime info request failed with status ${n.status}`);
		return this.transport = "single", this.singleEndpointUrl = this.runtimeUrl, await n.json();
	}
	createSingleRouteRequestInit(e, t, n) {
		if (!this.agentId) throw Error("ProxiedCopilotRuntimeAgent requires agentId to make runtime requests");
		let r = super.requestInit(e), i = new Headers(r.headers ?? {});
		i.set("Content-Type", "application/json"), i.set("Accept", i.get("Accept") ?? "text/event-stream");
		let a;
		if (typeof r.body == "string") try {
			a = JSON.parse(r.body);
		} catch (e) {
			console.warn("ProxiedCopilotRuntimeAgent: failed to parse request body for single route transport", e);
		}
		let o = { method: t };
		return n && Object.keys(n).length > 0 && (o.params = n), a !== void 0 && (o.body = a), {
			...r,
			headers: i,
			body: JSON.stringify(o),
			...this.credentials ? { credentials: this.credentials } : {}
		};
	}
	createIntelligenceDelegate() {
		let e = this.routedAgentId();
		if (!this.runtimeUrl || !e || !this.intelligence?.wsUrl) throw Error("Intelligence mode requires runtimeUrl, agentId, and intelligence websocket metadata");
		return new Qp({
			url: this.intelligence.wsUrl,
			runtimeUrl: this.runtimeUrl,
			agentId: e,
			headers: { ...this.headers },
			credentials: this.credentials
		});
	}
	syncDelegate(e) {
		e.agentId = this.routedAgentId(), e.description = this.description, e.threadId = this.threadId, e.setMessages(this.messages), e.setState(this.state), $p(e) && (e.headers = { ...this.headers }), em(e) && (e.credentials = this.credentials);
	}
}, am = class {
	_agents = {};
	localAgents = {};
	remoteAgents = {};
	_runtimeUrl;
	_runtimeVersion;
	_runtimeConnectionStatus = xm.Disconnected;
	_runtimeTransport = "auto";
	_audioFileTranscriptionEnabled = !1;
	_runtimeMode = "sse";
	_intelligence;
	_a2uiEnabled = !1;
	_openGenerativeUIEnabled = !1;
	_licenseStatus;
	_telemetryDisabled = !1;
	constructor(e) {
		this.core = e;
	}
	get agents() {
		return this._agents;
	}
	get runtimeUrl() {
		return this._runtimeUrl;
	}
	get runtimeVersion() {
		return this._runtimeVersion;
	}
	get runtimeConnectionStatus() {
		return this._runtimeConnectionStatus;
	}
	get runtimeTransport() {
		return this._runtimeTransport;
	}
	get audioFileTranscriptionEnabled() {
		return this._audioFileTranscriptionEnabled;
	}
	get runtimeMode() {
		return this._runtimeMode;
	}
	get intelligence() {
		return this._intelligence;
	}
	get a2uiEnabled() {
		return this._a2uiEnabled;
	}
	get openGenerativeUIEnabled() {
		return this._openGenerativeUIEnabled;
	}
	get licenseStatus() {
		return this._licenseStatus;
	}
	get telemetryDisabled() {
		return this._telemetryDisabled;
	}
	initialize(e) {
		this.localAgents = this.assignAgentIds(e), this.applyHeadersToAgents(this.localAgents), this.applyCredentialsToAgents(this.localAgents), this._agents = this.localAgents;
	}
	setRuntimeUrl(e) {
		let t = e ? e.replace(/\/$/, "") : void 0;
		this._runtimeUrl !== t && (this._runtimeUrl = t, this.updateRuntimeConnection());
	}
	setRuntimeTransport(e) {
		this._runtimeTransport !== e && (this._runtimeTransport = e, this.updateRuntimeConnection());
	}
	setAgents__unsafe_dev_only(e) {
		Object.entries(e).forEach(([e, t]) => {
			t && this.validateAndAssignAgentId(e, t);
		}), this.localAgents = e, this._agents = {
			...this.localAgents,
			...this.remoteAgents
		}, this.applyHeadersToAgents(this._agents), this.applyCredentialsToAgents(this._agents), this.notifyAgentsChanged();
	}
	addAgent__unsafe_dev_only({ id: e, agent: t }) {
		this.validateAndAssignAgentId(e, t), this.localAgents[e] = t, this.applyHeadersToAgent(t), this.applyCredentialsToAgent(t), this._agents = {
			...this.localAgents,
			...this.remoteAgents
		}, this.notifyAgentsChanged();
	}
	removeAgent__unsafe_dev_only(e) {
		delete this.localAgents[e], this._agents = {
			...this.localAgents,
			...this.remoteAgents
		}, this.notifyAgentsChanged();
	}
	registerProxiedAgent({ agentId: e, runtimeAgentId: t }) {
		if (Object.prototype.hasOwnProperty.call(this._agents, e)) throw Error(`CopilotKitCore.registerProxiedAgent: agentId "${e}" is already registered. Pick a different agentId, or unregister the existing agent first.`);
		let n = this.core, r = n.debug, i = new im({
			runtimeUrl: this._runtimeUrl,
			agentId: e,
			runtimeAgentId: t,
			transport: this._runtimeTransport,
			credentials: n.credentials,
			runtimeMode: this._runtimeUrl ? this._runtimeConnectionStatus === xm.Connected ? this._runtimeMode : "pending" : "sse",
			intelligence: this._intelligence,
			debug: r ? wu(r) : void 0
		});
		return this.applyHeadersToAgent(i), this.localAgents[e] = i, this._agents = {
			...this.localAgents,
			...this.remoteAgents
		}, this.notifyAgentsChanged(), {
			agent: i,
			unregister: () => {
				this.localAgents[e] === i && (delete this.localAgents[e], this._agents = {
					...this.localAgents,
					...this.remoteAgents
				}, this.notifyAgentsChanged());
			}
		};
	}
	getAgent(e) {
		if (e in this._agents) return this._agents[e];
		this.runtimeUrl !== void 0 && (this.runtimeConnectionStatus === xm.Disconnected || this.runtimeConnectionStatus === xm.Connecting) || console.warn(`Agent ${e} not found`);
	}
	applyHeadersToAgent(e) {
		e instanceof Ll && (e.headers = { ...this.core.headers });
	}
	applyHeadersToAgents(e) {
		Object.values(e).forEach((e) => {
			this.applyHeadersToAgent(e);
		});
	}
	applyCredentialsToAgent(e) {
		e instanceof im && (e.credentials = this.core.credentials);
	}
	applyCredentialsToAgents(e) {
		Object.values(e).forEach((e) => {
			this.applyCredentialsToAgent(e);
		});
	}
	async updateRuntimeConnection() {
		if (!(typeof window > "u")) {
			if (!this.runtimeUrl) {
				this._runtimeConnectionStatus = xm.Disconnected, this._runtimeVersion = void 0, this._audioFileTranscriptionEnabled = !1, this._runtimeMode = "sse", this._intelligence = void 0, this._a2uiEnabled = !1, this._openGenerativeUIEnabled = !1, this.remoteAgents = {}, this._agents = this.localAgents, await this.notifyRuntimeStatusChanged(xm.Disconnected), await this.notifyAgentsChanged();
				return;
			}
			this._runtimeConnectionStatus = xm.Connecting, await this.notifyRuntimeStatusChanged(xm.Connecting);
			try {
				let e = await this.fetchRuntimeInfo(), { version: t, ...n } = e, r = this.core.credentials, i = this.core.debug;
				this.remoteAgents = Object.fromEntries(Object.entries(n.agents).map(([t, { description: n, capabilities: a }]) => {
					let o = new im({
						runtimeUrl: this.runtimeUrl,
						agentId: t,
						description: n,
						transport: this._runtimeTransport,
						credentials: r,
						runtimeMode: e.mode ?? "sse",
						intelligence: e.intelligence,
						capabilities: a,
						debug: i ? wu(i) : void 0
					});
					return this.applyHeadersToAgent(o), [t, o];
				})), this._agents = {
					...this.localAgents,
					...this.remoteAgents
				}, this._runtimeConnectionStatus = xm.Connected, this._runtimeVersion = t, this._audioFileTranscriptionEnabled = e.audioFileTranscriptionEnabled ?? !1, this._runtimeMode = e.mode ?? "sse", this._intelligence = e.intelligence, this._a2uiEnabled = e.a2uiEnabled ?? !1, this._openGenerativeUIEnabled = e.openGenerativeUIEnabled ?? !1, this._licenseStatus = e.licenseStatus, this._telemetryDisabled = e.telemetryDisabled ?? !1, await this.notifyRuntimeStatusChanged(xm.Connected), await this.notifyAgentsChanged();
			} catch (e) {
				this._runtimeConnectionStatus = xm.Error, this._runtimeVersion = void 0, this._audioFileTranscriptionEnabled = !1, this._runtimeMode = "sse", this._intelligence = void 0, this._a2uiEnabled = !1, this._openGenerativeUIEnabled = !1, this.remoteAgents = {}, this._agents = this.localAgents, await this.notifyRuntimeStatusChanged(xm.Error), await this.notifyAgentsChanged();
				let t = e instanceof Error ? e.message : JSON.stringify(e);
				Iu.warn(`Failed to load runtime info (${this.runtimeUrl}/info): ${t}`);
				let n = e instanceof Error ? e : Error(String(e));
				await this.core.emitError({
					error: n,
					code: ym.RUNTIME_INFO_FETCH_FAILED,
					context: { runtimeUrl: this.runtimeUrl }
				});
			}
		}
	}
	async fetchRuntimeInfo() {
		if (!this.runtimeUrl) throw Error("Runtime URL is not set");
		let e = this.core.headers, t = this.core.credentials, n = { ...e };
		if (this._runtimeTransport === "single") return this.fetchRuntimeInfoSingle(n, t);
		if (this._runtimeTransport === "auto") return this.fetchRuntimeInfoAutoDetect(n, t);
		let r = await fetch(`${this.runtimeUrl}/info`, {
			headers: n,
			...t ? { credentials: t } : {}
		});
		if (!r.ok) throw Error(`Runtime info request failed with status ${r.status}`);
		return await r.json();
	}
	async fetchRuntimeInfoSingle(e, t) {
		e["Content-Type"] ||= "application/json";
		let n = await fetch(this.runtimeUrl, {
			method: "POST",
			headers: e,
			body: JSON.stringify({ method: "info" }),
			...t ? { credentials: t } : {}
		});
		if (!n.ok) throw Error(`Runtime info request failed with status ${n.status}`);
		return await n.json();
	}
	async fetchRuntimeInfoAutoDetect(e, t) {
		try {
			let n = await fetch(`${this.runtimeUrl}/info`, {
				headers: { ...e },
				...t ? { credentials: t } : {}
			});
			if (n.status >= 200 && n.status < 300) return this._runtimeTransport = "rest", await n.json();
		} catch {}
		let n = await this.fetchRuntimeInfoSingle({ ...e }, t);
		return this._runtimeTransport = "single", n;
	}
	assignAgentIds(e) {
		return Object.entries(e).forEach(([e, t]) => {
			t && this.validateAndAssignAgentId(e, t);
		}), e;
	}
	validateAndAssignAgentId(e, t) {
		if (t.agentId && t.agentId !== e) throw Error(`Agent registration mismatch: Agent with ID "${t.agentId}" cannot be registered under key "${e}". The agent ID must match the registration key or be undefined.`);
		t.agentId ||= e;
	}
	async notifyRuntimeStatusChanged(e) {
		await this.core.notifySubscribers((t) => t.onRuntimeConnectionStatusChanged?.({
			copilotkit: this.core,
			status: e
		}), "Error in CopilotKitCore subscriber (onRuntimeConnectionStatusChanged):");
	}
	async notifyAgentsChanged() {
		await this.core.notifySubscribers((e) => e.onAgentsChanged?.({
			copilotkit: this.core,
			agents: this._agents
		}), "Subscriber onAgentsChanged error:");
	}
}, om = class {
	_context = {};
	constructor(e) {
		this.core = e;
	}
	get context() {
		return this._context;
	}
	addContext({ description: e, value: t }) {
		let n = du();
		return this._context[n] = {
			description: e,
			value: t
		}, this.notifySubscribers(), n;
	}
	removeContext(e) {
		delete this._context[e], this.notifySubscribers();
	}
	async notifySubscribers() {
		await this.core.notifySubscribers((e) => e.onContextChanged?.({
			copilotkit: this.core,
			context: this._context
		}), "Subscriber onContextChanged error:");
	}
}, sm = class {
	_suggestionsConfig = {};
	_suggestions = {};
	_runningSuggestions = {};
	constructor(e) {
		this.core = e;
	}
	initialize(e) {
		for (let t of e) this._suggestionsConfig[du()] = t;
	}
	addSuggestionsConfig(e) {
		let t = du();
		return this._suggestionsConfig[t] = e, this.notifySuggestionsConfigChanged(), t;
	}
	removeSuggestionsConfig(e) {
		delete this._suggestionsConfig[e], this.notifySuggestionsConfigChanged();
	}
	reloadSuggestions(e) {
		this.clearSuggestions(e);
		let t = this.core.getAgent(e), n = t?.messages?.length ?? 0, r = !1;
		for (let i of Object.values(this._suggestionsConfig)) {
			if (i.consumerAgentId !== void 0 && i.consumerAgentId !== "*" && i.consumerAgentId !== e || !this.shouldShowSuggestions(i, n)) continue;
			let a = du();
			if (cm(i)) {
				if (!t) continue;
				r || (r = !0, this.notifySuggestionsStartedLoading(e)), this.generateSuggestions(a, i, e);
			} else lm(i) && this.addStaticSuggestions(a, i, e);
		}
	}
	clearSuggestions(e) {
		let t = this._runningSuggestions[e];
		if (t) {
			for (let e of t) e.abortRun();
			delete this._runningSuggestions[e];
		}
		this._suggestions[e] = {}, this.notifySuggestionsChanged(e, []);
	}
	getSuggestions(e) {
		return {
			suggestions: Object.values(this._suggestions[e] ?? {}).flat(),
			isLoading: (this._runningSuggestions[e]?.length ?? 0) > 0
		};
	}
	async generateSuggestions(e, t, n) {
		let r;
		try {
			let i = this.core.getAgent(t.providerAgentId ?? "default");
			if (!i) throw Error(`Suggestions provider agent not found: ${t.providerAgentId}`);
			let a = this.core.getAgent(n);
			if (!a) throw Error(`Suggestions consumer agent not found: ${n}`);
			r = i.clone(), r.threadId = e, r.messages = JSON.parse(JSON.stringify(a.messages)), r.state = JSON.parse(JSON.stringify(a.state)), this._suggestions[n] = {
				...this._suggestions[n],
				[e]: []
			}, this._runningSuggestions[n] = [...this._runningSuggestions[n] ?? [], r], r.addMessage({
				id: e,
				role: "user",
				content: [
					"Suggest what the user could say next. Provide clear, highly relevant suggestions by calling the `copilotkitSuggest` tool.",
					`Provide at least ${t.minSuggestions ?? 1} and at most ${t.maxSuggestions ?? 3} suggestions.`,
					`The user has the following tools available: ${JSON.stringify(this.core.buildFrontendTools(n))}.`,
					` ${t.instructions}`
				].join("\n")
			}), await r.runAgent({
				context: Object.values(this.core.context),
				forwardedProps: {
					...this.core.properties,
					toolChoice: {
						type: "function",
						function: { name: "copilotkitSuggest" }
					}
				},
				tools: [um]
			}, { onMessagesChanged: ({ messages: t }) => {
				this.extractSuggestions(t, e, n, !0);
			} });
		} catch (e) {
			console.warn("Error generating suggestions:", e);
		} finally {
			this.finalizeSuggestions(e, n);
			let t = this._runningSuggestions[n];
			if (r && t) {
				let e = t.filter((e) => e !== r);
				this._runningSuggestions[n] = e, e.length === 0 && (delete this._runningSuggestions[n], await this.notifySuggestionsFinishedLoading(n));
			}
		}
	}
	finalizeSuggestions(e, t) {
		let n = this._suggestions[t], r = n?.[e];
		if (n && r && r.length > 0) {
			let i = r.filter((e) => e.title !== "" || e.message !== "").map((e) => ({
				...e,
				isLoading: !1
			}));
			i.length > 0 ? n[e] = i : delete n[e];
			let a = Object.values(this._suggestions[t] ?? {}).flat();
			this.notifySuggestionsChanged(t, a, "finalized");
		}
	}
	extractSuggestions(e, t, n, r) {
		let i = e.findIndex((e) => e.id === t);
		if (i == -1) return;
		let a = [], o = e.slice(i + 1);
		for (let e of o) if (e.role === "assistant" && e.toolCalls) {
			for (let t of e.toolCalls) if (t.function.name === "copilotkitSuggest") {
				let e = _u(Array.isArray(t.function.arguments) ? t.function.arguments.join("") : t.function.arguments);
				if (e && typeof e == "object" && "suggestions" in e) {
					let t = e.suggestions;
					if (Array.isArray(t)) for (let e of t) e && typeof e == "object" && "title" in e && a.push({
						title: e.title ?? "",
						message: e.message ?? "",
						isLoading: !1
					});
				}
			}
		}
		r && a.length > 0 && (a[a.length - 1].isLoading = !0);
		let s = this._suggestions[n];
		if (s) {
			s[t] = a;
			let e = Object.values(this._suggestions[n] ?? {}).flat();
			this.notifySuggestionsChanged(n, e, "suggestions changed");
		}
	}
	async notifySuggestionsConfigChanged() {
		await this.core.notifySubscribers((e) => e.onSuggestionsConfigChanged?.({
			copilotkit: this.core,
			suggestionsConfig: this._suggestionsConfig
		}), "Subscriber onSuggestionsConfigChanged error:");
	}
	async notifySuggestionsChanged(e, t, n = "") {
		await this.core.notifySubscribers((n) => n.onSuggestionsChanged?.({
			copilotkit: this.core,
			agentId: e,
			suggestions: t
		}), `Subscriber onSuggestionsChanged error: ${n}`);
	}
	async notifySuggestionsStartedLoading(e) {
		await this.core.notifySubscribers((t) => t.onSuggestionsStartedLoading?.({
			copilotkit: this.core,
			agentId: e
		}), "Subscriber onSuggestionsStartedLoading error:");
	}
	async notifySuggestionsFinishedLoading(e) {
		await this.core.notifySubscribers((t) => t.onSuggestionsFinishedLoading?.({
			copilotkit: this.core,
			agentId: e
		}), "Subscriber onSuggestionsFinishedLoading error:");
	}
	shouldShowSuggestions(e, t) {
		let n = e.available;
		if (!n) return cm(e) ? t > 0 : t === 0;
		switch (n) {
			case "disabled": return !1;
			case "before-first-message": return t === 0;
			case "after-first-message": return t > 0;
			case "always": return !0;
			default: return !1;
		}
	}
	addStaticSuggestions(e, t, n) {
		let r = t.suggestions.map((e) => ({
			...e,
			isLoading: !1
		}));
		this._suggestions[n] = {
			...this._suggestions[n],
			[e]: r
		};
		let i = Object.values(this._suggestions[n] ?? {}).flat();
		this.notifySuggestionsChanged(n, i, "static suggestions added");
	}
};
function cm(e) {
	return "instructions" in e;
}
function lm(e) {
	return "suggestions" in e;
}
var um = {
	name: "copilotkitSuggest",
	description: "Suggest what the user could say next",
	parameters: {
		type: "object",
		properties: { suggestions: {
			type: "array",
			description: "List of suggestions shown to the user as buttons.",
			items: {
				type: "object",
				properties: {
					title: {
						type: "string",
						description: "The title of the suggestion. This is shown as a button and should be short."
					},
					message: {
						type: "string",
						description: "The message to send when the suggestion is clicked. This should be a clear, complete sentence and will be sent as an instruction to the AI."
					}
				},
				required: ["title", "message"]
			}
		} },
		required: ["suggestions"]
	}
}, dm = class {
	_tools = [];
	_runAbortController = null;
	_runDepth = 0;
	_lastConnectedThreadId = null;
	constructor(e) {
		this.core = e;
	}
	abortCurrentRun() {
		this._runAbortController?.abort();
	}
	get _internal() {
		return this.core;
	}
	get tools() {
		return this._tools;
	}
	initialize(e) {
		this._tools = e;
	}
	addTool(e) {
		if (this._tools.findIndex((t) => t.name === e.name && t.agentId === e.agentId) !== -1) {
			Iu.warn(`Tool already exists: '${e.name}' for agent '${e.agentId || "global"}', skipping.`);
			return;
		}
		this._tools.push(e);
	}
	removeTool(e, t) {
		this._tools = this._tools.filter((n) => t === void 0 ? !(n.name === e && !n.agentId) : !(n.name === e && n.agentId === t));
	}
	getTool(e) {
		let { toolName: t, agentId: n } = e;
		if (n) {
			let e = this._tools.find((e) => e.name === t && e.agentId === n);
			if (e) return e;
		}
		return this._tools.find((e) => e.name === t && !e.agentId);
	}
	setTools(e) {
		this._tools = [...e];
	}
	async connectAgent({ agent: e }) {
		try {
			let t = e.threadId ?? null, n = t !== this._lastConnectedThreadId;
			if (this._lastConnectedThreadId = t, await e.detachActiveRun(), n) {
				e.setMessages([]), e.setState({});
				let n = e;
				t && typeof n.clearReplayCursor == "function" && n.clearReplayCursor(t);
			}
			e instanceof Ll && (e.headers = { ...this._internal.headers });
			let r = await e.connectAgent({
				forwardedProps: this._internal.properties,
				tools: this.buildFrontendTools(e.agentId),
				context: Object.values(this._internal.context)
			}, this.createAgentErrorSubscriber(e));
			return this.processAgentResult({
				runAgentResult: r,
				agent: e
			});
		} catch (t) {
			let n = t instanceof Error ? t : Error(String(t));
			if (!(n.name === "AbortError" || n.message === "Fetch is aborted" || n.message === "signal is aborted without reason" || n.message === "component unmounted")) {
				let t = {};
				e.agentId && (t.agentId = e.agentId), await this._internal.emitError({
					error: n,
					code: ym.AGENT_CONNECT_FAILED,
					context: t
				});
			}
			return { newMessages: [] };
		}
	}
	async runAgent({ agent: e, forwardedProps: t }) {
		e.agentId && this._internal.suggestionEngine.clearSuggestions(e.agentId), e instanceof Ll && (e.headers = { ...this._internal.headers }), e.detachActiveRun && await e.detachActiveRun();
		let n = this._runDepth === 0, r;
		if (n) {
			this._runAbortController = new AbortController();
			let t = this._runAbortController;
			r = e.abortRun.bind(e), e.abortRun = () => {
				t.abort(), r();
			};
		}
		this._runDepth++;
		try {
			let n = await e.runAgent({
				forwardedProps: {
					...this._internal.properties,
					...t
				},
				tools: this.buildFrontendTools(e.agentId),
				context: Object.values(this._internal.context)
			}, this.createAgentErrorSubscriber(e));
			return await this.processAgentResult({
				runAgentResult: n,
				agent: e
			});
		} catch (t) {
			let n = t instanceof Error ? t : Error(String(t)), r = {};
			return e.agentId && (r.agentId = e.agentId), await this._internal.emitError({
				error: n,
				code: ym.AGENT_RUN_FAILED,
				context: r
			}), { newMessages: [] };
		} finally {
			this._runDepth--, n && r && (e.abortRun = r);
		}
	}
	async processAgentResult({ runAgentResult: e, agent: t }) {
		let { newMessages: n } = e, r = t.agentId, i = !1;
		for (let e of n) if (e.role === "assistant") {
			for (let a of e.toolCalls || []) if (n.findIndex((e) => e.role === "tool" && e.toolCallId === a.id) === -1) {
				let n = this.getTool({
					toolName: a.function.name,
					agentId: t.agentId
				});
				if (n) await this.executeSpecificTool(n, a, e, t, r) && (i = !0);
				else {
					let n = this.getTool({
						toolName: "*",
						agentId: t.agentId
					});
					n && await this.executeWildcardTool(n, a, e, t, r) && (i = !0);
				}
			}
		}
		return i && !this._runAbortController?.signal.aborted ? (await this._internal.waitForPendingFrameworkUpdates(), await this.runAgent({ agent: t })) : (this._internal.suggestionEngine.reloadSuggestions(r), e);
	}
	async executeToolHandler({ tool: e, toolCall: t, agent: n, agentId: r, handlerArgs: i, toolType: a, messageId: o }) {
		let s = "", c, l = !1, u;
		try {
			u = gm(i, t.function.name);
		} catch (e) {
			let n = e instanceof Error ? e : Error(String(e));
			c = n.message, l = !0, await this._internal.emitError({
				error: n,
				code: ym.TOOL_ARGUMENT_PARSE_FAILED,
				context: {
					agentId: r,
					toolCallId: t.id,
					toolName: t.function.name,
					rawArguments: i,
					toolType: a,
					...o ? { messageId: o } : {}
				}
			});
		}
		if (await this._internal.notifySubscribers((e) => e.onToolExecutionStart?.({
			copilotkit: this.core,
			toolCallId: t.id,
			agentId: r,
			toolName: t.function.name,
			args: u
		}), "Subscriber onToolExecutionStart error:"), !c) try {
			let r = await e.handler(u, {
				toolCall: t,
				agent: n,
				signal: this._runAbortController?.signal
			});
			s = r == null ? "" : typeof r == "string" ? r : JSON.stringify(r);
		} catch (e) {
			let n = e instanceof Error ? e : Error(String(e));
			c = n.message, await this._internal.emitError({
				error: n,
				code: ym.TOOL_HANDLER_FAILED,
				context: {
					agentId: r,
					toolCallId: t.id,
					toolName: t.function.name,
					parsedArgs: u,
					toolType: a,
					...o ? { messageId: o } : {}
				}
			});
		}
		return c && (s = `Error: ${c}`), await this._internal.notifySubscribers((e) => e.onToolExecutionEnd?.({
			copilotkit: this.core,
			toolCallId: t.id,
			agentId: r,
			toolName: t.function.name,
			result: c ? "" : s,
			error: c
		}), "Subscriber onToolExecutionEnd error:"), {
			result: s,
			error: c,
			isArgumentError: l
		};
	}
	async executeSpecificTool(e, t, n, r, i) {
		if (e?.agentId && e.agentId !== r.agentId) return !1;
		let a = {
			result: "",
			error: void 0,
			isArgumentError: !1
		};
		e?.handler && (a = await this.executeToolHandler({
			tool: e,
			toolCall: t,
			agent: r,
			agentId: i,
			handlerArgs: t.function.arguments,
			toolType: "specific",
			messageId: n.id
		}));
		{
			let i = r.messages.findIndex((e) => e.id === n.id);
			if (i === -1) return !1;
			let o = {
				id: du(),
				role: "tool",
				toolCallId: t.id,
				content: a.result
			};
			if (r.messages.splice(i + 1, 0, o), !a.error && e?.followUp !== !1) return !0;
		}
		return !1;
	}
	async executeWildcardTool(e, t, n, r, i) {
		if (e?.agentId && e.agentId !== r.agentId) return !1;
		let a = "", o;
		if (e?.handler) {
			let s;
			try {
				s = gm(t.function.arguments, t.function.name);
			} catch (e) {
				let r = e instanceof Error ? e : Error(String(e));
				o = r.message, await this._internal.emitError({
					error: r,
					code: ym.TOOL_ARGUMENT_PARSE_FAILED,
					context: {
						agentId: i,
						toolCallId: t.id,
						toolName: t.function.name,
						rawArguments: t.function.arguments,
						toolType: "wildcard",
						messageId: n.id
					}
				});
			}
			let c = {
				toolName: t.function.name,
				args: s
			};
			if (await this._internal.notifySubscribers((e) => e.onToolExecutionStart?.({
				copilotkit: this.core,
				toolCallId: t.id,
				agentId: i,
				toolName: t.function.name,
				args: c
			}), "Subscriber onToolExecutionStart error:"), !o) try {
				let n = await e.handler(c, {
					toolCall: t,
					agent: r
				});
				a = n == null ? "" : typeof n == "string" ? n : JSON.stringify(n);
			} catch (e) {
				let r = e instanceof Error ? e : Error(String(e));
				o = r.message, await this._internal.emitError({
					error: r,
					code: ym.TOOL_HANDLER_FAILED,
					context: {
						agentId: i,
						toolCallId: t.id,
						toolName: t.function.name,
						parsedArgs: c,
						toolType: "wildcard",
						messageId: n.id
					}
				});
			}
			o && (a = `Error: ${o}`), await this._internal.notifySubscribers((e) => e.onToolExecutionEnd?.({
				copilotkit: this.core,
				toolCallId: t.id,
				agentId: i,
				toolName: t.function.name,
				result: o ? "" : a,
				error: o
			}), "Subscriber onToolExecutionEnd error:");
		}
		{
			let i = r.messages.findIndex((e) => e.id === n.id);
			if (i === -1) return !1;
			let s = {
				id: du(),
				role: "tool",
				toolCallId: t.id,
				content: a
			};
			if (r.messages.splice(i + 1, 0, s), !o && e?.followUp !== !1) return !0;
		}
		return !1;
	}
	async runTool(e) {
		let { name: t, agentId: n, parameters: r = {}, followUp: i = !1 } = e, a = this.getTool({
			toolName: t,
			agentId: n
		});
		if (!a) {
			let e = /* @__PURE__ */ Error(`Tool not found: ${t}`);
			throw await this._internal.emitError({
				error: e,
				code: ym.TOOL_NOT_FOUND,
				context: {
					toolName: t,
					agentId: n
				}
			}), e;
		}
		let o = n ?? "default", s = this._internal.getAgent(o);
		if (!s) {
			let e = /* @__PURE__ */ Error(`Agent not found: ${o}`);
			throw await this._internal.emitError({
				error: e,
				code: ym.AGENT_NOT_FOUND,
				context: { agentId: o }
			}), e;
		}
		let c = du(), l = {
			id: du(),
			role: "assistant",
			content: "",
			toolCalls: [{
				id: c,
				type: "function",
				function: {
					name: t,
					arguments: JSON.stringify(r)
				}
			}]
		};
		s.messages.push(l);
		let u = {
			result: "",
			error: void 0,
			isArgumentError: !1
		};
		a.handler && (u = await this.executeToolHandler({
			tool: a,
			toolCall: l.toolCalls[0],
			agent: s,
			agentId: o,
			handlerArgs: r,
			toolType: "runTool"
		}));
		let d = {
			id: du(),
			role: "tool",
			toolCallId: c,
			content: u.result
		}, f = s.messages.findIndex((e) => e.id === l.id);
		if (f === -1 ? s.messages.push(d) : s.messages.splice(f + 1, 0, d), !u.error && i !== !1) {
			if (typeof i == "string" && i !== "generate") {
				let e = {
					id: du(),
					role: "user",
					content: i
				};
				s.messages.push(e);
			}
			await this._internal.waitForPendingFrameworkUpdates(), await this.runAgent({ agent: s });
		}
		return {
			toolCallId: c,
			result: u.result,
			error: u.error
		};
	}
	buildFrontendTools(e) {
		return this._tools.filter((t) => t.available !== !1 && t.available !== "disabled" && (!t.agentId || t.agentId === e)).map((e) => ({
			name: e.name,
			description: e.description ?? "",
			parameters: pm(e)
		}));
	}
	createAgentErrorSubscriber(e) {
		let t = async (t, n, r = {}) => {
			let i = { ...r };
			e.agentId && (i.agentId = e.agentId), await this._internal.emitError({
				error: t,
				code: n,
				context: i
			});
		};
		return {
			onRunFailed: async ({ error: e }) => {
				await t(e, e instanceof Zp ? ym.AGENT_THREAD_LOCKED : ym.AGENT_RUN_FAILED_EVENT, { source: "onRunFailed" });
			},
			onRunErrorEvent: async ({ event: e }) => {
				let n = e?.rawEvent instanceof Error ? e.rawEvent : e?.rawEvent?.error instanceof Error ? e.rawEvent.error : void 0, r = typeof e?.rawEvent?.error == "string" ? e.rawEvent.error : e?.message ?? "Agent run error", i = n ?? Error(r);
				e?.code && !i.code && (i.code = e.code), await t(i, ym.AGENT_RUN_ERROR_EVENT, {
					source: "onRunErrorEvent",
					event: e,
					runtimeErrorCode: e?.code
				});
			}
		};
	}
}, fm = {
	type: "object",
	properties: {}
};
function pm(e) {
	if (!e.parameters) return { ...fm };
	let t = Eu(e.parameters, { zodToJsonSchema: Ip });
	if (!t || typeof t != "object") return { ...fm };
	let { $schema: n, ...r } = t;
	return typeof r.type != "string" && (r.type = "object"), (typeof r.properties != "object" || r.properties === null) && (r.properties = {}), mm(r), r;
}
function mm(e) {
	if (!e || typeof e != "object") return;
	if (Array.isArray(e)) {
		e.forEach(mm);
		return;
	}
	let t = e;
	t.additionalProperties !== void 0 && delete t.additionalProperties;
	for (let e of Object.values(t)) mm(e);
}
function hm(e, t) {
	if (typeof e == "object" && e && !Array.isArray(e)) return e;
	throw Error(`Tool arguments for ${t} parsed to non-object (${typeof e})`);
}
function gm(e, t) {
	return e === "" || e == null ? (Iu.debug(`[parseToolArguments] Tool "${t}" received empty/null/undefined arguments — defaulting to {}`), {}) : hm(typeof e == "string" ? JSON.parse(e) : e, t);
}
var _m = class {
	stateByRun = /* @__PURE__ */ new Map();
	messageToRun = /* @__PURE__ */ new Map();
	activeRun = /* @__PURE__ */ new Map();
	agentSubscriptions = /* @__PURE__ */ new Map();
	constructor(e) {
		this.core = e;
	}
	initialize() {}
	subscribeToAgent(e) {
		if (!e.agentId) return;
		let t = e.agentId, n = this.agentSubscriptions.get(t);
		n && (n(), this.agentSubscriptions.delete(t));
		let r = !1, i, a = !1, o = (e) => ({
			...e,
			runId: i ?? e.runId
		}), { unsubscribe: s } = e.subscribe({
			onRunStartedEvent: ({ input: t, state: n }) => {
				r || (i = a && t.runId === i ? tl() : t.runId, a = !1, this.handleRunStarted(e, o(t), n));
			},
			onRunFinishedEvent: ({ input: t, state: n }) => {
				r || (a = !0, this.handleRunFinished(e, o(t), n));
			},
			onRunErrorEvent: ({ input: t, state: n }) => {
				r || (a = !0, this.handleRunFinished(e, o(t), n));
			},
			onStateSnapshotEvent: ({ event: t, input: n, state: i }) => {
				r || this.handleStateSnapshot(e, t, o(n), i);
			},
			onStateDeltaEvent: ({ event: t, input: n, state: i }) => {
				r || this.handleStateDelta(e, t, o(n), i);
			},
			onMessagesSnapshotEvent: ({ event: t, input: n, messages: i }) => {
				r || this.handleMessagesSnapshot(e, t, o(n), i);
			},
			onNewMessage: ({ message: t, input: n }) => {
				r || this.handleNewMessage(e, t, n ? o(n) : void 0);
			}
		});
		this.agentSubscriptions.set(t, () => {
			r = !0, s();
		});
	}
	unsubscribeFromAgent(e) {
		let t = this.agentSubscriptions.get(e);
		t && (t(), this.agentSubscriptions.delete(e));
	}
	getStateByRun(e, t, n) {
		let r = this.stateByRun.get(e)?.get(t)?.get(n);
		if (r) return JSON.parse(JSON.stringify(r));
	}
	getRunIdForMessage(e, t, n) {
		return this.messageToRun.get(e)?.get(t)?.get(n);
	}
	getStatesForThread(e, t) {
		return this.stateByRun.get(e)?.get(t) ?? /* @__PURE__ */ new Map();
	}
	getRunIdsForThread(e, t) {
		let n = this.stateByRun.get(e)?.get(t);
		return n ? Array.from(n.keys()) : [];
	}
	handleRunStarted(e, t, n) {
		if (!e.agentId) return;
		let { threadId: r, runId: i } = t;
		this.activeRun.set(`${e.agentId}:${r}`, i), n && Object.keys(n).length > 0 && this.saveState(e.agentId, r, i, n);
	}
	handleRunFinished(e, t, n) {
		if (!e.agentId) return;
		let { threadId: r, runId: i } = t;
		this.activeRun.delete(`${e.agentId}:${r}`), n && Object.keys(n).length > 0 && this.saveState(e.agentId, r, i, n);
	}
	handleStateSnapshot(e, t, n, r) {
		if (!e.agentId) return;
		let { threadId: i, runId: a } = n, o = {
			...r,
			...t.snapshot
		};
		this.saveState(e.agentId, i, a, o);
	}
	handleStateDelta(e, t, n, r) {
		if (!e.agentId) return;
		let { threadId: i, runId: a } = n;
		this.saveState(e.agentId, i, a, r);
	}
	handleMessagesSnapshot(e, t, n, r) {
		if (!e.agentId) return;
		let { threadId: i, runId: a } = n;
		for (let n of t.messages) this.associateMessageWithRun(e.agentId, i, n.id, a);
	}
	handleNewMessage(e, t, n) {
		if (!e.agentId) return;
		if (!n) {
			let n = e.threadId ?? "", r = this.activeRun.get(`${e.agentId}:${n}`);
			r && this.associateMessageWithRun(e.agentId, n, t.id, r);
			return;
		}
		let { threadId: r, runId: i } = n;
		this.associateMessageWithRun(e.agentId, r, t.id, i);
	}
	saveState(e, t, n, r) {
		this.stateByRun.has(e) || this.stateByRun.set(e, /* @__PURE__ */ new Map());
		let i = this.stateByRun.get(e);
		i.has(t) || i.set(t, /* @__PURE__ */ new Map()), i.get(t).set(n, JSON.parse(JSON.stringify(r)));
	}
	associateMessageWithRun(e, t, n, r) {
		this.messageToRun.has(e) || this.messageToRun.set(e, /* @__PURE__ */ new Map());
		let i = this.messageToRun.get(e);
		i.has(t) || i.set(t, /* @__PURE__ */ new Map()), i.get(t).set(n, r);
	}
	clearAgentState(e) {
		this.stateByRun.delete(e), this.messageToRun.delete(e);
	}
	clearThreadState(e, t) {
		this.stateByRun.get(e)?.delete(t), this.messageToRun.get(e)?.delete(t);
	}
}, vm = class {
	_stores = {};
	_snapshot = null;
	constructor(e) {
		this.core = e;
	}
	register(e, t) {
		if (e in this._stores) {
			let t = this._stores[e];
			delete this._stores[e], this._snapshot = null, this.notifyUnregistered(e, t).catch((e) => {
				console.error("ThreadStoreRegistry notifyUnregistered failed:", e);
			});
		}
		this._stores[e] = t, this._snapshot = null, this.notifyRegistered(e, t).catch((e) => {
			console.error("ThreadStoreRegistry notifyRegistered failed:", e);
		});
	}
	unregister(e) {
		if (!(e in this._stores)) return;
		let t = this._stores[e];
		delete this._stores[e], this._snapshot = null, this.notifyUnregistered(e, t).catch((e) => {
			console.error("ThreadStoreRegistry notifyUnregistered failed:", e);
		});
	}
	get(e) {
		return this._stores[e];
	}
	getAll() {
		return this._snapshot === null && (this._snapshot = Object.freeze({ ...this._stores })), this._snapshot;
	}
	async notifyRegistered(e, t) {
		await this.core.notifySubscribers((n) => n.onThreadStoreRegistered?.({
			copilotkit: this.core,
			agentId: e,
			store: t
		}), "Subscriber onThreadStoreRegistered error:");
	}
	async notifyUnregistered(e, t) {
		await this.core.notifySubscribers((n) => n.onThreadStoreUnregistered?.({
			copilotkit: this.core,
			agentId: e,
			prevStore: t
		}), "Subscriber onThreadStoreUnregistered error:");
	}
}, ym = /* @__PURE__ */ function(e) {
	return e.RUNTIME_INFO_FETCH_FAILED = "runtime_info_fetch_failed", e.AGENT_CONNECT_FAILED = "agent_connect_failed", e.AGENT_RUN_FAILED = "agent_run_failed", e.AGENT_RUN_FAILED_EVENT = "agent_run_failed_event", e.AGENT_RUN_ERROR_EVENT = "agent_run_error_event", e.TOOL_ARGUMENT_PARSE_FAILED = "tool_argument_parse_failed", e.TOOL_HANDLER_FAILED = "tool_handler_failed", e.TOOL_NOT_FOUND = "tool_not_found", e.AGENT_NOT_FOUND = "agent_not_found", e.AGENT_THREAD_LOCKED = "agent_thread_locked", e.TRANSCRIPTION_FAILED = "transcription_failed", e.TRANSCRIPTION_SERVICE_NOT_CONFIGURED = "transcription_service_not_configured", e.TRANSCRIPTION_INVALID_AUDIO = "transcription_invalid_audio", e.TRANSCRIPTION_RATE_LIMITED = "transcription_rate_limited", e.TRANSCRIPTION_AUTH_FAILED = "transcription_auth_failed", e.TRANSCRIPTION_NETWORK_ERROR = "transcription_network_error", e.SUBSCRIBER_CALLBACK_FAILED = "subscriber_callback_failed", e;
}({}), bm = new Set([
	"onMessagesChanged",
	"onStateChanged",
	"onRunInitialized",
	"onRunFinalized",
	"onRunFailed",
	"onRunErrorEvent"
]), xm = /* @__PURE__ */ function(e) {
	return e.Disconnected = "disconnected", e.Connected = "connected", e.Connecting = "connecting", e.Error = "error", e;
}({}), Sm = class {
	_headers;
	_credentials;
	_properties;
	_defaultThrottleMs;
	_debug;
	subscribers = /* @__PURE__ */ new Set();
	agentRegistry;
	contextStore;
	suggestionEngine;
	runHandler;
	stateManager;
	threadStoreRegistry;
	previousAgentIds = /* @__PURE__ */ new Set();
	constructor({ runtimeUrl: e, runtimeTransport: t = "auto", headers: n = {}, credentials: r, properties: i = {}, agents__unsafe_dev_only: a = {}, tools: o = [], suggestionsConfig: s = [], debug: c }) {
		this._headers = n, this._credentials = r, this._properties = i, this._debug = c, this.agentRegistry = new am(this), this.contextStore = new om(this), this.suggestionEngine = new sm(this), this.runHandler = new dm(this), this.stateManager = new _m(this), this.threadStoreRegistry = new vm(this), this.agentRegistry.initialize(a), this.runHandler.initialize(o), this.suggestionEngine.initialize(s), this.stateManager.initialize(), this.agentRegistry.setRuntimeTransport(t), this.agentRegistry.setRuntimeUrl(e), this.previousAgentIds = new Set(Object.keys(a)), this.subscribe({ onAgentsChanged: ({ agents: e }) => {
			Object.values(e).forEach((e) => {
				e.agentId && this.stateManager.subscribeToAgent(e);
			});
			let t = new Set(Object.keys(e));
			for (let e of Object.keys(this.threadStoreRegistry.getAll())) if (this.previousAgentIds.has(e) && !t.has(e)) try {
				this.threadStoreRegistry.unregister(e);
			} catch (t) {
				console.error(`CopilotKitCore.onAgentsChanged: threadStoreRegistry.unregister failed for "${e}":`, t);
			}
			for (let e of this.previousAgentIds) if (!t.has(e)) try {
				this.stateManager.unsubscribeFromAgent(e);
			} catch (t) {
				console.error(`CopilotKitCore.onAgentsChanged: stateManager.unsubscribeFromAgent failed for "${e}":`, t);
			}
			this.previousAgentIds = t;
		} });
	}
	async notifySubscribers(e, t) {
		await Promise.all(Array.from(this.subscribers).map(async (n) => {
			try {
				await e(n);
			} catch (e) {
				console.error(t, e);
			}
		}));
	}
	async emitError({ error: e, code: t, context: n = {} }) {
		await this.notifySubscribers((r) => r.onError?.({
			copilotkit: this,
			error: e,
			code: t,
			context: n
		}), "Subscriber onError error:");
	}
	logAndEmitError(e, t, n = "error") {
		console[n](e, t.error), this.emitError(t).catch((t) => {
			console.error(e + " — emitError itself failed:", t);
		});
	}
	get context() {
		return this.contextStore.context;
	}
	get agents() {
		return this.agentRegistry.agents;
	}
	get tools() {
		return this.runHandler.tools;
	}
	get runtimeUrl() {
		return this.agentRegistry.runtimeUrl;
	}
	setRuntimeUrl(e) {
		this.agentRegistry.setRuntimeUrl(e);
	}
	get runtimeTransport() {
		return this.agentRegistry.runtimeTransport;
	}
	setRuntimeTransport(e) {
		this.agentRegistry.setRuntimeTransport(e);
	}
	get runtimeVersion() {
		return this.agentRegistry.runtimeVersion;
	}
	get headers() {
		return this._headers;
	}
	get credentials() {
		return this._credentials;
	}
	get properties() {
		return this._properties;
	}
	get defaultThrottleMs() {
		return this._defaultThrottleMs;
	}
	setDefaultThrottleMs(e) {
		if (e !== void 0 && (!Number.isFinite(e) || e < 0)) {
			this.logAndEmitError(`CopilotKitCore.setDefaultThrottleMs: value must be a non-negative finite number or undefined, got ${e}. Keeping current value (${this._defaultThrottleMs}).`, {
				error: /* @__PURE__ */ Error(`setDefaultThrottleMs: invalid value (${e}), keeping current value (${this._defaultThrottleMs})`),
				code: ym.SUBSCRIBER_CALLBACK_FAILED,
				context: {
					value: e,
					currentValue: this._defaultThrottleMs
				}
			});
			return;
		}
		this._defaultThrottleMs = e;
	}
	get debug() {
		return this._debug;
	}
	setDebug(e) {
		this._debug = e;
	}
	get runtimeConnectionStatus() {
		return this.agentRegistry.runtimeConnectionStatus;
	}
	get audioFileTranscriptionEnabled() {
		return this.agentRegistry.audioFileTranscriptionEnabled;
	}
	get runtimeMode() {
		return this.agentRegistry.runtimeMode;
	}
	get intelligence() {
		return this.agentRegistry.intelligence;
	}
	get a2uiEnabled() {
		return this.agentRegistry.a2uiEnabled;
	}
	get openGenerativeUIEnabled() {
		return this.agentRegistry.openGenerativeUIEnabled;
	}
	get licenseStatus() {
		return this.agentRegistry.licenseStatus;
	}
	get telemetryDisabled() {
		return this.agentRegistry.telemetryDisabled;
	}
	setHeaders(e) {
		this._headers = e, this.agentRegistry.applyHeadersToAgents(this.agentRegistry.agents), this.notifySubscribers((e) => e.onHeadersChanged?.({
			copilotkit: this,
			headers: this.headers
		}), "Subscriber onHeadersChanged error:");
	}
	setCredentials(e) {
		this._credentials = e, this.agentRegistry.applyCredentialsToAgents(this.agentRegistry.agents);
	}
	setProperties(e) {
		this._properties = e, this.notifySubscribers((e) => e.onPropertiesChanged?.({
			copilotkit: this,
			properties: this.properties
		}), "Subscriber onPropertiesChanged error:");
	}
	setAgents__unsafe_dev_only(e) {
		this.agentRegistry.setAgents__unsafe_dev_only(e);
	}
	addAgent__unsafe_dev_only(e) {
		this.agentRegistry.addAgent__unsafe_dev_only(e);
	}
	removeAgent__unsafe_dev_only(e) {
		this.agentRegistry.removeAgent__unsafe_dev_only(e);
	}
	registerProxiedAgent(e) {
		return this.agentRegistry.registerProxiedAgent(e);
	}
	getAgent(e) {
		return this.agentRegistry.getAgent(e);
	}
	addContext(e) {
		return this.contextStore.addContext(e);
	}
	removeContext(e) {
		this.contextStore.removeContext(e);
	}
	registerThreadStore(e, t) {
		this.threadStoreRegistry.register(e, t);
	}
	unregisterThreadStore(e) {
		this.threadStoreRegistry.unregister(e);
	}
	getThreadStore(e) {
		return this.threadStoreRegistry.get(e);
	}
	getThreadStores() {
		return this.threadStoreRegistry.getAll();
	}
	addSuggestionsConfig(e) {
		return this.suggestionEngine.addSuggestionsConfig(e);
	}
	removeSuggestionsConfig(e) {
		this.suggestionEngine.removeSuggestionsConfig(e);
	}
	reloadSuggestions(e) {
		this.suggestionEngine.reloadSuggestions(e);
	}
	clearSuggestions(e) {
		this.suggestionEngine.clearSuggestions(e);
	}
	getSuggestions(e) {
		return this.suggestionEngine.getSuggestions(e);
	}
	addTool(e) {
		this.runHandler.addTool(e);
	}
	removeTool(e, t) {
		this.runHandler.removeTool(e, t);
	}
	getTool(e) {
		return this.runHandler.getTool(e);
	}
	setTools(e) {
		this.runHandler.setTools(e);
	}
	subscribe(e) {
		return this.subscribers.add(e), { unsubscribe: () => {
			this.subscribers.delete(e);
		} };
	}
	subscribeToAgentWithOptions(e, t, n) {
		let r = n?.throttleMs ?? this._defaultThrottleMs ?? 0, i = 0;
		if (!Number.isFinite(r) || r < 0) {
			let t = n?.throttleMs === void 0 ? "defaultThrottleMs" : "throttleMs";
			this.logAndEmitError(`CopilotKitCore.subscribeToAgentWithOptions: ${t} must be a non-negative finite number, got ${r}. Falling back to unthrottled.`, {
				error: /* @__PURE__ */ Error(`subscribeToAgentWithOptions: invalid ${t} (${r}), falling back to unthrottled`),
				code: ym.SUBSCRIBER_CALLBACK_FAILED,
				context: {
					agentId: e.agentId,
					source: t,
					value: r
				}
			});
		} else i = r;
		let a = e.agentId || "(unknown agent)", o = (t, n, ...r) => {
			let i = (n, r) => {
				this.logAndEmitError(`CopilotKitCore.subscribeToAgentWithOptions[${a}]: ${t} callback ${r}:`, {
					error: n instanceof Error ? n : Error(String(n)),
					code: ym.SUBSCRIBER_CALLBACK_FAILED,
					context: {
						agentId: e.agentId,
						callback: t
					}
				});
			};
			try {
				let e = n(...r);
				return e instanceof Promise ? e.catch((e) => {
					i(e, "rejected");
				}) : e;
			} catch (e) {
				i(e, "threw");
			}
		}, s = (e) => {
			let t = {};
			if (e.onMessagesChanged) {
				let n = e.onMessagesChanged;
				t.onMessagesChanged = (e) => o("onMessagesChanged", n, e);
			}
			if (e.onStateChanged) {
				let n = e.onStateChanged;
				t.onStateChanged = (e) => o("onStateChanged", n, e);
			}
			if (e.onRunInitialized) {
				let n = e.onRunInitialized;
				t.onRunInitialized = (e) => o("onRunInitialized", n, e);
			}
			if (e.onRunFinalized) {
				let n = e.onRunFinalized;
				t.onRunFinalized = (e) => o("onRunFinalized", n, e);
			}
			if (e.onRunFailed) {
				let n = e.onRunFailed;
				t.onRunFailed = (e) => o("onRunFailed", n, e);
			}
			if (e.onRunErrorEvent) {
				let n = e.onRunErrorEvent;
				t.onRunErrorEvent = (e) => o("onRunErrorEvent", n, e);
			}
			return t;
		};
		for (let n of Object.keys(t)) if (typeof t[n] == "function" && !bm.has(n)) {
			let t = `CopilotKitCore.subscribeToAgentWithOptions[${a}]: callback "${n}" is not supported and was dropped. Supported callbacks: ${Array.from(bm).join(", ")}. Use agent.subscribe() directly for event handlers and per-item notifications.`;
			this.logAndEmitError(t, {
				error: Error(t),
				code: ym.SUBSCRIBER_CALLBACK_FAILED,
				context: {
					agentId: e.agentId,
					droppedCallback: n
				}
			}, "warn");
		}
		if (i <= 0) {
			let n = e.subscribe(s(t));
			return { unsubscribe: () => n.unsubscribe() };
		}
		let c = !0, l = null, u = null, d = new be(() => {
			if (c && t.onMessagesChanged && l) {
				let e = l;
				l = null, o("onMessagesChanged", t.onMessagesChanged, e);
			}
			if (c && t.onStateChanged && u) {
				let e = u;
				u = null, o("onStateChanged", t.onStateChanged, e);
			}
		}, {
			wait: i,
			leading: !0,
			trailing: !0
		}), f = {};
		t.onRunInitialized && (f.onRunInitialized = t.onRunInitialized), t.onRunFinalized && (f.onRunFinalized = t.onRunFinalized), t.onRunFailed && (f.onRunFailed = t.onRunFailed), t.onRunErrorEvent && (f.onRunErrorEvent = t.onRunErrorEvent);
		let ee = s(f);
		t.onMessagesChanged && (ee.onMessagesChanged = (e) => {
			l = e, d.maybeExecute();
		}), t.onStateChanged && (ee.onStateChanged = (e) => {
			u = e, d.maybeExecute();
		});
		let p = e.subscribe(ee);
		return { unsubscribe: () => {
			c = !1, d.cancel(), p.unsubscribe();
		} };
	}
	async connectAgent(e) {
		return this.runHandler.connectAgent(e);
	}
	stopAgent(e) {
		this.runHandler.abortCurrentRun(), e.agent.abortRun();
	}
	async runAgent(e) {
		return this.runHandler.runAgent(e);
	}
	async runTool(e) {
		return this.runHandler.runTool(e);
	}
	getStateByRun(e, t, n) {
		return this.stateManager.getStateByRun(e, t, n);
	}
	getRunIdForMessage(e, t, n) {
		return this.stateManager.getRunIdForMessage(e, t, n);
	}
	getRunIdsForThread(e, t) {
		return this.stateManager.getRunIdsForThread(e, t);
	}
	buildFrontendTools(e) {
		return this.runHandler.buildFrontendTools(e);
	}
	async waitForPendingFrameworkUpdates() {}
}, Cm = /* @__PURE__ */ function(e) {
	return e.InProgress = "inProgress", e.Executing = "executing", e.Complete = "complete", e;
}({}), wm = {
	boot: "@@micro-redux/boot",
	init: "@@micro-redux/init",
	stop: "@@micro-redux/stop"
}, Tm = { type: wm.boot };
function Em(e, t) {
	let n = ((...n) => ({
		...t(...n),
		type: e
	}));
	return n.type = e, n.match = (t) => t.type === e, n;
}
function Dm() {
	return { kind: "props" };
}
function Om() {
	return { kind: "empty" };
}
function km(e, t) {
	let n = {};
	for (let r of Object.keys(t)) {
		let i = t[r];
		if (!i) continue;
		let a = `[${e}] ${r}`;
		if (i.kind === "props") {
			n[r] = Em(a, (e) => ({ ...e }));
			continue;
		}
		n[r] = Em(a, () => ({}));
	}
	return n;
}
function Am(...e) {
	if (e.length < 2) throw Error("on requires at least one action creator and one reducer");
	let t = e[e.length - 1];
	return {
		creators: e.slice(0, -1),
		reducer: t
	};
}
function jm(e, ...t) {
	let n = /* @__PURE__ */ new Map();
	for (let e of t) for (let t of e.creators) {
		let r = n.get(t.type) ?? [];
		r.push(e.reducer), n.set(t.type, r);
	}
	return (t, r) => {
		let i = t ?? e, a = n.get(r.type);
		if (!a || a.length === 0) return i;
		let o = i;
		for (let e of a) o = e(o, r);
		return o;
	};
}
function Mm(...e) {
	if (e.length === 1) {
		let t = e[0], n = !1, r, i;
		return (e) => n && e === r ? i : (r = e, i = t(e), n = !0, i);
	}
	let t = e[e.length - 1], n = e.slice(0, -1), r = !1, i = [], a;
	return (e) => {
		let o = n.map((t) => t(e));
		return r && o.length === i.length && o.every((e, t) => e === i[t]) ? a : (i = o, a = t(...o), r = !0, a);
	};
}
function Nm(e) {
	return (t) => t.pipe(Co(e), Bo());
}
function Pm(...e) {
	if (e.length === 0) throw Error("ofType requires at least one action creator");
	let t = new Set(e.map((e) => e.type));
	return (e) => e.pipe(Mo((e) => t.has(e.type)));
}
function Fm(e, t = {}) {
	return t.dispatch === !1 ? {
		run: e,
		dispatch: !1
	} : {
		run: e,
		dispatch: !0
	};
}
function Im(e) {
	let t = e.reducer, n = e.effects ?? [], r = !1, i = !1, a = new Di(), o = t(void 0, Tm), s = new fa(o), c = new ua(), l = (e) => {
		if (r) throw Error("Store is in a failed state due to an effect error");
		o = t(o, e), s.next(o), c.next(e);
	}, u = (e) => {
		r || (r = !0, i = !1, a.unsubscribe(), a = new Di(), c.error(e), s.error(e));
	}, d = () => {
		for (let e of n) {
			let t = c.asObservable().pipe(no(ka)), n = s.asObservable();
			if (e.dispatch) {
				let i = e.run(t, n).subscribe({
					next: (e) => {
						r || l(e);
					},
					error: (e) => {
						u(e);
					}
				});
				a.add(i);
				continue;
			}
			let i = e.run(t, n).subscribe({ error: (e) => {
				u(e);
			} });
			a.add(i);
		}
	};
	return {
		dispatch(e) {
			l(e);
		},
		getState() {
			return o;
		},
		get state$() {
			return s.asObservable();
		},
		get actions$() {
			return c.asObservable();
		},
		select(e) {
			return s.asObservable().pipe(Nm(e));
		},
		init() {
			r || i || (i = !0, d(), !r && l({ type: wm.init }));
		},
		stop() {
			r || !i || (l({ type: wm.stop }), a.unsubscribe(), a = new Di(), i = !1);
		}
	};
}
var Lm = "thread_metadata", Rm = "/threads/subscribe", zm = 5, Bm = 15e3, Vm = {
	threads: [],
	isLoading: !1,
	isFetchingNextPage: !1,
	error: null,
	context: null,
	sessionId: 0,
	metadataCredentialsRequested: !1,
	metadataJoinCode: null,
	nextCursor: null
}, Q = km("Thread Adapter", {
	started: Om(),
	stopped: Om(),
	contextChanged: Dm(),
	fetchNextPageRequested: Om(),
	renameRequested: Dm(),
	archiveRequested: Dm(),
	deleteRequested: Dm()
}), $ = km("Thread REST", {
	listRequested: Dm(),
	listSucceeded: Dm(),
	listFailed: Dm(),
	nextPageSucceeded: Dm(),
	nextPageFailed: Dm(),
	metadataCredentialsRequested: Dm(),
	metadataCredentialsSucceeded: Dm(),
	metadataCredentialsFailed: Dm(),
	mutationFinished: Dm()
}), Hm = km("Thread Socket", {
	opened: Dm(),
	errored: Dm(),
	joinFailed: Dm(),
	joinTimedOut: Dm(),
	metadataReceived: Dm()
}), Um = km("Thread Domain", {
	threadUpserted: Dm(),
	threadDeleted: Dm()
});
function Wm(e) {
	return [...e].sort((e, t) => {
		let n = e.lastRunAt ?? e.updatedAt ?? e.createdAt;
		return (t.lastRunAt ?? t.updatedAt ?? t.createdAt).localeCompare(n);
	});
}
function Gm(e, t) {
	let n = e.findIndex((e) => e.id === t.id);
	if (n === -1) return Wm([...e, t]);
	let r = [...e];
	return r[n] = t, Wm(r);
}
var Km = jm(Vm, Am(Q.contextChanged, (e, { context: t }) => ({
	...e,
	context: t,
	sessionId: e.sessionId + 1,
	threads: [],
	isLoading: !!t,
	isFetchingNextPage: !1,
	error: null,
	metadataCredentialsRequested: !1,
	metadataJoinCode: null,
	nextCursor: null
})), Am(Q.stopped, (e) => ({
	...e,
	threads: [],
	isLoading: !1,
	isFetchingNextPage: !1,
	error: null,
	metadataCredentialsRequested: !1,
	metadataJoinCode: null,
	nextCursor: null
})), Am($.listRequested, (e, { sessionId: t }) => t !== e.sessionId || !e.context ? e : {
	...e,
	isLoading: !0,
	error: null
}), Am($.listSucceeded, (e, { sessionId: t, threads: n, joinCode: r, nextCursor: i }) => t === e.sessionId ? {
	...e,
	threads: Wm(n),
	isLoading: !1,
	error: null,
	metadataJoinCode: r,
	nextCursor: i
} : e), Am($.listFailed, (e, { sessionId: t, error: n }) => t === e.sessionId ? {
	...e,
	isLoading: !1,
	error: n
} : e), Am($.nextPageSucceeded, (e, { sessionId: t, threads: n, nextCursor: r }) => {
	if (t !== e.sessionId) return e;
	let i = e.threads;
	for (let e of n) i = Gm(i, e);
	return {
		...e,
		threads: i,
		isFetchingNextPage: !1,
		nextCursor: r
	};
}), Am($.nextPageFailed, (e, { sessionId: t, error: n }) => t === e.sessionId ? {
	...e,
	isFetchingNextPage: !1,
	error: n
} : e), Am($.metadataCredentialsFailed, (e, { sessionId: t, error: n }) => t === e.sessionId ? {
	...e,
	error: n
} : e), Am($.metadataCredentialsRequested, (e, { sessionId: t }) => t === e.sessionId ? {
	...e,
	metadataCredentialsRequested: !0
} : e), Am(Q.fetchNextPageRequested, (e) => !e.nextCursor || e.isFetchingNextPage ? e : {
	...e,
	isFetchingNextPage: !0
}), Am($.mutationFinished, (e, { outcome: t }) => ({
	...e,
	error: t.ok ? e.error : t.error
})), Am(Um.threadUpserted, (e, { sessionId: t, thread: n }) => t === e.sessionId ? {
	...e,
	threads: Gm(e.threads, n)
} : e), Am(Um.threadDeleted, (e, { sessionId: t, threadId: n }) => t === e.sessionId ? {
	...e,
	threads: e.threads.filter((e) => e.id !== n)
} : e)), qm = Mm((e) => e.threads);
Mm((e) => e.isLoading);
var Jm = Mm((e) => e.error);
Mm((e) => e.nextCursor != null), Mm((e) => e.isFetchingNextPage);
var Ym = 0;
function Xm() {
	return Ym += 1, `thread-request-${Ym}`;
}
function Zm(e, t, n) {
	return ko(() => {
		let r = { agentId: t.agentId };
		t.includeArchived && (r.includeArchived = "true"), t.limit != null && (r.limit = String(t.limit));
		let i = new URLSearchParams(r);
		return Lp(`${t.runtimeUrl}/threads?${i.toString()}`, {
			selector: (e) => {
				if (!e.ok) throw Error(`Failed to fetch threads: ${e.status}`);
				return e.json();
			},
			fetch: e.fetch,
			method: "GET",
			headers: { ...t.headers }
		}).pipe(xo({
			first: Bm,
			with: () => {
				throw Error("Request timed out");
			}
		}), Co((e) => $.listSucceeded({
			sessionId: n,
			threads: e.threads,
			joinCode: typeof e.joinCode == "string" && e.joinCode.length > 0 ? e.joinCode : null,
			nextCursor: e.nextCursor ?? null
		})), No((e) => M($.listFailed({
			sessionId: n,
			error: e instanceof Error ? e : Error(String(e))
		}))));
	});
}
function Qm(e, t, n) {
	return ko(() => Lp(`${t.runtimeUrl}${Rm}`, {
		selector: async (e) => {
			if (!e.ok) throw Error(`Failed to fetch thread metadata credentials: ${e.status}`);
			return e.json();
		},
		fetch: e.fetch,
		method: "POST",
		headers: {
			...t.headers,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({})
	}).pipe(xo({
		first: Bm,
		with: () => {
			throw Error("Request timed out");
		}
	}), Co((e) => {
		if (typeof e.joinToken != "string" || e.joinToken.length === 0) throw Error("missing joinToken");
		return $.metadataCredentialsSucceeded({
			sessionId: n,
			joinToken: e.joinToken
		});
	}), No((e) => M($.metadataCredentialsFailed({
		sessionId: n,
		error: e instanceof Error ? e : Error(String(e))
	})))));
}
function $m(e, t, n) {
	return ko(() => Lp(`${t.runtimeUrl}${n.path}`, {
		selector: async (e) => {
			if (!e.ok) throw Error(`Request failed: ${e.status}`);
			return null;
		},
		fetch: e.fetch,
		method: n.method,
		headers: {
			...t.headers,
			"Content-Type": "application/json"
		},
		body: JSON.stringify(n.body)
	}).pipe(Co(() => $.mutationFinished({ outcome: {
		requestId: n.requestId,
		ok: !0
	} })), No((e) => M($.mutationFinished({ outcome: {
		requestId: n.requestId,
		ok: !1,
		error: e instanceof Error ? e : Error(String(e))
	} })))));
}
function eh(e) {
	let t = Im({
		reducer: Km,
		effects: [
			Fm((e, t) => e.pipe(Pm(Q.contextChanged), Zo(t), Mo(([, e]) => !!e.context), Co(([, e]) => $.listRequested({ sessionId: e.sessionId })))),
			Fm((t, n) => t.pipe(Pm($.listRequested), Jo((r) => n.pipe(Co((e) => e.context), Mo((e) => !!e), Lo(1), Co((e) => ({
				action: r,
				context: e
			})), Yo(t.pipe(Pm(Q.contextChanged, Q.stopped))), Jo(({ action: t, context: n }) => Zm(e, n, t.sessionId)))))),
			Fm((e, t) => e.pipe(Pm($.listSucceeded), Zo(t), Mo(([e, t]) => e.sessionId === t.sessionId && !t.metadataCredentialsRequested && !!t.context?.wsUrl && !!t.metadataJoinCode), Co(([e]) => $.metadataCredentialsRequested({ sessionId: e.sessionId })))),
			Fm((t, n) => t.pipe(Pm($.metadataCredentialsRequested), Jo((r) => n.pipe(Co((e) => e.context), Mo((e) => !!e), Lo(1), Co((e) => ({
				action: r,
				context: e
			})), Yo(t.pipe(Pm(Q.contextChanged, Q.stopped))), Jo(({ action: t, context: n }) => Qm(e, n, t.sessionId)))))),
			Fm((e, t) => e.pipe(Pm($.metadataCredentialsSucceeded), Zo(t), Mo(([e, t]) => e.sessionId === t.sessionId && !!t.context?.wsUrl), Jo(([t, n]) => {
				let r = n.context, i = t.joinToken, a = n.metadataJoinCode, o = e.pipe(Pm(Q.contextChanged, Q.stopped));
				return ko(() => {
					let e = Bp({
						url: r.wsUrl,
						options: {
							params: { join_token: i },
							reconnectAfterMs: vu(100, 1e4),
							rejoinAfterMs: vu(1e3, 3e4)
						}
					}).pipe(qo({
						bufferSize: 1,
						refCount: !0
					})), n = Vp({
						socket$: e,
						topic: `user_meta:${a}`
					}).pipe(qo({
						bufferSize: 1,
						refCount: !0
					})), s = Gp(e).pipe(Go()), c = Kp(s, zm).pipe(No(() => (console.warn(`[threads] WebSocket failed after ${zm} attempts, giving up`), M(void 0))), Go());
					return Ao(s.pipe(Co((e) => e.type === "open" ? Hm.opened({ sessionId: t.sessionId }) : Hm.errored({ sessionId: t.sessionId }))), n.pipe(Jo(({ channel: e }) => Hp(e, Lm)), Co((e) => Hm.metadataReceived({
						sessionId: t.sessionId,
						payload: e
					}))), Up(n).pipe(Mo((e) => e.type !== "joined"), Co((e) => e.type === "timeout" ? Hm.joinTimedOut({ sessionId: t.sessionId }) : Hm.joinFailed({ sessionId: t.sessionId })))).pipe(Yo(Ao(o, c)));
				});
			}))),
			Fm((e, t) => e.pipe(Pm(Hm.metadataReceived), Zo(t), Mo(([e, t]) => e.sessionId === t.sessionId), Co(([e, t]) => e.payload.operation === "deleted" ? Um.threadDeleted({
				sessionId: e.sessionId,
				threadId: e.payload.deleted.id
			}) : e.payload.operation === "archived" && !t.context?.includeArchived ? Um.threadDeleted({
				sessionId: e.sessionId,
				threadId: e.payload.threadId
			}) : Um.threadUpserted({
				sessionId: e.sessionId,
				thread: e.payload.thread
			})))),
			Fm((t, n) => t.pipe(Pm(Q.fetchNextPageRequested), Zo(n), Mo(([, e]) => !!e.context && !!e.nextCursor), Jo(([, n]) => {
				let r = n.context, i = {
					agentId: r.agentId,
					cursor: n.nextCursor
				};
				return r.includeArchived && (i.includeArchived = "true"), r.limit != null && (i.limit = String(r.limit)), Lp(`${r.runtimeUrl}/threads?${new URLSearchParams(i).toString()}`, {
					selector: (e) => {
						if (!e.ok) throw Error(`Failed to fetch next page: ${e.status}`);
						return e.json();
					},
					fetch: e.fetch,
					method: "GET",
					headers: { ...r.headers }
				}).pipe(xo({
					first: Bm,
					with: () => {
						throw Error("Request timed out");
					}
				}), Co((e) => $.nextPageSucceeded({
					sessionId: n.sessionId,
					threads: e.threads,
					nextCursor: e.nextCursor ?? null
				})), No((e) => M($.nextPageFailed({
					sessionId: n.sessionId,
					error: e instanceof Error ? e : Error(String(e))
				}))), Yo(t.pipe(Pm(Q.contextChanged, Q.stopped))));
			}))),
			Fm((t, n) => t.pipe(Pm(Q.renameRequested, Q.archiveRequested, Q.deleteRequested), Zo(n), To(([t, n]) => {
				let r = n.context;
				if (!r?.runtimeUrl) {
					let e = t.requestId;
					return M($.mutationFinished({ outcome: {
						requestId: e,
						ok: !1,
						error: /* @__PURE__ */ Error("Runtime URL is not configured")
					} }));
				}
				let i = { agentId: r.agentId };
				return Q.renameRequested.match(t) ? $m(e, r, {
					requestId: t.requestId,
					method: "PATCH",
					path: `/threads/${encodeURIComponent(t.threadId)}`,
					body: {
						...i,
						name: t.name
					}
				}) : Q.archiveRequested.match(t) ? $m(e, r, {
					requestId: t.requestId,
					method: "POST",
					path: `/threads/${encodeURIComponent(t.threadId)}/archive`,
					body: i
				}) : $m(e, r, {
					requestId: t.requestId,
					method: "DELETE",
					path: `/threads/${encodeURIComponent(t.threadId)}`,
					body: i
				});
			})))
		]
	});
	function n(e) {
		let n = vo(Ao(t.actions$.pipe(Pm($.mutationFinished), Mo((t) => t.outcome.requestId === e.requestId), Co((e) => e.outcome)), t.actions$.pipe(Pm(Q.stopped), Co(() => ({
			requestId: e.requestId,
			ok: !1,
			error: /* @__PURE__ */ Error("Thread store stopped before mutation completed")
		})))).pipe(Lo(1))).then((e) => {
			if (!e.ok) throw e.error;
		});
		return t.dispatch(e), n;
	}
	return {
		start() {
			t.init(), t.dispatch(Q.started());
		},
		stop() {
			t.dispatch(Q.stopped()), t.stop();
		},
		setContext(e) {
			t.dispatch(Q.contextChanged({ context: e }));
		},
		refresh() {
			let { sessionId: e, context: n } = t.getState();
			n && t.dispatch($.listRequested({ sessionId: e }));
		},
		fetchNextPage() {
			t.dispatch(Q.fetchNextPageRequested());
		},
		renameThread(e, t) {
			return n(Q.renameRequested({
				requestId: Xm(),
				threadId: e,
				name: t
			}));
		},
		archiveThread(e) {
			return n(Q.archiveRequested({
				requestId: Xm(),
				threadId: e
			}));
		},
		deleteThread(e) {
			return n(Q.deleteRequested({
				requestId: Xm(),
				threadId: e
			}));
		},
		getState() {
			return t.getState();
		},
		select: t.select.bind(t)
	};
}
var th = qm, nh = Jm;
//#endregion
export { pn as $, du as A, Yl as B, bu as C, _u as D, gu as E, Ql as F, bi as G, Ll as H, ou as I, gn as J, C as K, iu as L, au as M, ru as N, pu as O, nu as P, D as Q, Xl as R, yu as S, Su as T, mi as U, Rl as V, hi as W, Cn as X, T as Y, bn as Z, Ou as _, eh as a, hn as at, ju as b, Ip as c, Ru as d, E as et, Lu as f, Fu as g, Mu as h, Cm as i, _n as it, su as j, uu as k, Bu as l, ku as m, xm as n, yn as nt, th as o, Ve as ot, Au as p, mn as q, im as r, w as rt, nh as s, Sm as t, Sn as tt, zu as u, Pu as v, xu as w, Eu as x, Nu as y, cu as z };
