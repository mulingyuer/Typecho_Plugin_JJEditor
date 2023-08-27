/*
 * @Author: mulingyuer
 * @Date: 2023-08-27 14:43:07
 * @LastEditTime: 2023-08-27 14:46:19
 * @LastEditors: mulingyuer
 * @Description: 代码高亮插件
 * @FilePath: /Typecho_Plugin_JJEditor/src/core/plugins/highlight.ts
 * 怎么可能会有bug！！！
 */
// @ts-nocheck
export default function highlight({ init } = {}) {
	let hljs = window.hljs;
	return {
		viewerEffect({ markdownBody }) {
			(async () => {
				const els = markdownBody.querySelectorAll("pre>code");
				if (els.length === 0) return;
				if (!hljs) {
					hljs = await import("highlight.js").then((m) => m.default);
					if (init) await init(hljs);
				}
				els.forEach((el) => {
					hljs.highlightElement(el);
				});
			})();
		}
	};
}
