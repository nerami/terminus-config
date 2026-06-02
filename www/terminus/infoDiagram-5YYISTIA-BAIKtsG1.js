import { t as e } from "./mermaid-parser.core-C2N6lMD4.js";
import { n as t, r as n } from "./src-nrT8XS4T.js";
import { c as r } from "./chunk-CSCIHK7Q-B8VwERSd.js";
import { t as i } from "./chunk-WU5MYG2G-DhQZkdcJ.js";
//#region node_modules/.pnpm/mermaid@11.15.0/node_modules/mermaid/dist/chunks/mermaid.core/infoDiagram-5YYISTIA.mjs
var a = { parse: /* @__PURE__ */ t(async (t) => {
	let r = await e("info", t);
	n.debug(r);
}, "parse") }, o = { version: "11.15.0" }, s = {
	parser: a,
	db: { getVersion: /* @__PURE__ */ t(() => o.version, "getVersion") },
	renderer: { draw: /* @__PURE__ */ t((e, t, a) => {
		n.debug("rendering info diagram\n" + e);
		let o = i(t);
		r(o, 100, 400, !0), o.append("g").append("text").attr("x", 100).attr("y", 40).attr("class", "version").attr("font-size", 32).style("text-anchor", "middle").text(`v${a}`);
	}, "draw") }
};
//#endregion
export { s as diagram };
