import { n as e, r as t } from "./src-nrT8XS4T.js";
import { b as n, s as r } from "./chunk-CSCIHK7Q-B8VwERSd.js";
import { d as i } from "./chunk-5ZQYHXKU-C-8o68S6.js";
import { a, i as o, s } from "./chunk-3OPIFGDE-C5vVxeYP.js";
import { a as c, i as l, n as u, r as d } from "./chunk-KSCS5N6A-BVicfIjK.js";
//#region node_modules/.pnpm/mermaid@11.15.0/node_modules/mermaid/dist/chunks/mermaid.core/chunk-LZXEDZCA.mjs
var f = {
	common: r,
	getConfig: n,
	insertCluster: o,
	insertEdge: u,
	insertEdgeLabel: d,
	insertMarkers: l,
	insertNode: a,
	interpolateToCurve: i,
	labelHelper: s,
	log: t,
	positionEdgeLabel: c
}, p = {}, m = /* @__PURE__ */ e((e) => {
	for (let t of e) p[t.name] = t;
}, "registerLayoutLoaders");
(/* @__PURE__ */ e(() => {
	m([{
		name: "dagre",
		loader: /* @__PURE__ */ e(async () => await import("./dagre-BM42HDAG-KmH4Bgvf.js"), "loader")
	}, {
		name: "cose-bilkent",
		loader: /* @__PURE__ */ e(async () => await import("./cose-bilkent-S5V4N54A-WB6jGfT6.js"), "loader")
	}]);
}, "registerDefaultLayoutLoaders"))();
var h = /* @__PURE__ */ e(async (e, t) => {
	if (!(e.layoutAlgorithm in p)) throw Error(`Unknown layout algorithm: ${e.layoutAlgorithm}`);
	if (e.diagramId) for (let t of e.nodes) {
		let n = t.domId || t.id;
		t.domId = `${e.diagramId}-${n}`;
	}
	let n = p[e.layoutAlgorithm], r = await n.loader(), { theme: i, themeVariables: a } = e.config, { useGradient: o, gradientStart: s, gradientStop: c } = a, l = t.attr("id");
	if (t.append("defs").append("filter").attr("id", `${l}-drop-shadow`).attr("height", "130%").attr("width", "130%").append("feDropShadow").attr("dx", "4").attr("dy", "4").attr("stdDeviation", 0).attr("flood-opacity", "0.06").attr("flood-color", `${i?.includes("dark") ? "#FFFFFF" : "#000000"}`), t.append("defs").append("filter").attr("id", `${l}-drop-shadow-small`).attr("height", "150%").attr("width", "150%").append("feDropShadow").attr("dx", "2").attr("dy", "2").attr("stdDeviation", 0).attr("flood-opacity", "0.06").attr("flood-color", `${i?.includes("dark") ? "#FFFFFF" : "#000000"}`), o) {
		let e = t.append("linearGradient").attr("id", t.attr("id") + "-gradient").attr("gradientUnits", "objectBoundingBox").attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "0%");
		e.append("svg:stop").attr("offset", "0%").attr("stop-color", s).attr("stop-opacity", 1), e.append("svg:stop").attr("offset", "100%").attr("stop-color", c).attr("stop-opacity", 1);
	}
	return r.render(e, t, f, { algorithm: n.algorithm });
}, "render"), g = /* @__PURE__ */ e((e = "", { fallback: n = "dagre" } = {}) => {
	if (e in p) return e;
	if (n in p) return t.warn(`Layout algorithm ${e} is not registered. Using ${n} as fallback.`), n;
	throw Error(`Both layout algorithms ${e} and ${n} are not registered.`);
}, "getRegisteredLayoutAlgorithm");
//#endregion
export { m as n, h as r, g as t };
