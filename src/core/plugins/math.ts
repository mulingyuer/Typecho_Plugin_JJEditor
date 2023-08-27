/*
 * @Author: mulingyuer
 * @Date: 2023-08-27 15:13:31
 * @LastEditTime: 2023-08-27 15:32:31
 * @LastEditors: mulingyuer
 * @Description: math
 * @FilePath: /Typecho_Plugin_JJEditor/src/core/plugins/math.ts
 * 怎么可能会有bug！！！
 */
// @ts-nocheck
import remarkMath from "remark-math";
const block = "Block formula";
const blockText = "formula";
const inline = "Inline formula";
const inlineText = "formula";
const en = {
	block,
	blockText,
	inline,
	inlineText
};
const icons = {
	Formula:
		'<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 48 48"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="m40 9-3-3H8l18 18L8 42h29l3-3"/></svg>',
	Inline:
		'<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 48 48"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="m37 9-3-3H8l17 18L8 42h26l3-3M5 24h10M33 24h10"/></svg>',
	Block:
		'<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 48 48"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="m36 11-3-3H12l16 16-16 16h21l3-3M6 5v38M42 5v38"/></svg>'
};
function getMathActions(locale) {
	return [
		{
			icon: icons.Formula,
			handler: {
				type: "dropdown",
				actions: [
					{
						title: locale.inline,
						icon: icons.Inline,
						cheatsheet: `$${locale.inlineText}$`,
						handler: {
							type: "action",
							click({ wrapText, editor }) {
								wrapText("$");
								editor.focus();
							}
						}
					},
					{
						title: locale.block,
						icon: icons.Block,
						cheatsheet: `$$↵${locale.blockText}↵$$`,
						handler: {
							type: "action",
							click({ appendBlock, editor, codemirror }) {
								const { line } = appendBlock("$$\n\\TeX\n$$");
								editor.setSelection(codemirror.Pos(line + 1, 0), codemirror.Pos(line + 1, 4));
								editor.focus();
							}
						}
					}
				]
			}
		}
	];
}
export default function math({ locale: _locale, katexOptions } = {}) {
	const locale = { ...en, ..._locale };
	let katex = window.katex;
	return {
		remark: (processor) => processor.use(remarkMath),
		viewerEffect({ markdownBody }) {
			const renderMath = async (selector, displayMode) => {
				const els = markdownBody.querySelectorAll(selector);
				if (els.length === 0) return;
				if (!katex) {
					katex = await import("katex").then((m) => m.default);
				}
				els.forEach((el) => {
					katex.render(el.innerText, el, {
						...katexOptions,
						throwOnError: false,
						displayMode
					});
				});
			};
			renderMath(".math.math-inline", false);
			renderMath(".math.math-display", true);
		},
		actions: getMathActions(locale)
	};
}
