/*
 * @Author: mulingyuer
 * @Date: 2023-08-27 01:21:30
 * @LastEditTime: 2023-08-27 22:42:47
 * @LastEditors: mulingyuer
 * @Description: 核心代码
 * @FilePath: /Typecho_Plugin_JJEditor/src/core/index.ts
 * 怎么可能会有bug！！！
 */
import { Editor } from "bytemd";
import "bytemd/dist/index.css";
import zhHans from "bytemd/locales/zh_Hans.json";
import gfm from "@bytemd/plugin-gfm";
import highlight from "./plugins/highlight";
// import "highlight.js/styles/default.css";
import math from "./plugins/math";
// import "katex/dist/katex.css";
import mediumZoom from "@bytemd/plugin-medium-zoom";
import mermaid from "./plugins/mermaid";
// import codePlacement from "./plugins/codePlacement";

// mermaid汉化
const MERMAID_LOCALE = {
	class: "类图",
	er: "关系图",
	flowchart: "流程图",
	gantt: "甘特图",
	mermaid: "Mermaid图表",
	mindmap: "思维导图",
	pie: "饼状图",
	sequence: "时序图",
	state: "状态图",
	timeline: "时间轴",
	uj: "旅程图"
};

// math汉化
const MATH_LOCALE = {
	block: "块级公式",
	blockText: "formula",
	inline: "行内公式",
	inlineText: "formula"
};

export default class JJEditor {
	/** 原生编辑器 */
	private nativeEditor = document.getElementById("text") as HTMLTextAreaElement;
	/** 编辑器容器 */
	private editorContainer = document.querySelector(".jj-editor-container") as HTMLDivElement;
	/** 掘金编辑器 */
	private jjEditor: Editor | undefined;
	/** 样式链接link元素 */
	private styleLink = document.querySelector('link[rel="jj_editor"]');
	/** 样式链接前缀 */
	private styleLinkPrefix = "";
	/** jj主题默认文章样式 */
	private JJDefaultTheme: string = "";
	/** 预览样式link元素 */
	private previewStyleLink: HTMLLinkElement | undefined;

	constructor() {
		this.init();
		this.initPreviewStyle();
	}

	/** 初始化 */
	private init() {
		this.jjEditor = new Editor({
			target: this.editorContainer,
			props: {
				value: this.nativeEditor.value,
				locale: zhHans,
				plugins: [
					gfm(),
					highlight(),
					math({ locale: MATH_LOCALE, katexOptions: {} }),
					mediumZoom(),
					mermaid({ locale: MERMAID_LOCALE })
				]
			}
		});
		this.jjEditor.$on("change", this.onEditorChange);
	}

	/** change事件 */
	private onEditorChange = (event: any) => {
		this.jjEditor!.$set({ value: event.detail.value });
		this.nativeEditor.value = event.detail.value;
	};

	/** 初始化预览样式 */
	private initPreviewStyle() {
		if (!this.styleLink) return;
		let theme = "juejin";
		this.styleLinkPrefix = this.styleLink.getAttribute("href")!;
		this.JJDefaultTheme = this.styleLink.getAttribute("default")!;
		if (typeof this.JJDefaultTheme === "string" && this.JJDefaultTheme.trim() === "") {
			this.JJDefaultTheme = "juejin";
		}
		//获取用户配置
		const themeSelect = document.querySelector('select[name="fields[markdownTheme]"]') as HTMLSelectElement;
		if (themeSelect) {
			const selectTheme = themeSelect.value;
			if (this.JJDefaultTheme !== "juejin" && selectTheme === "juejin") {
				theme = this.JJDefaultTheme;
			} else {
				theme = selectTheme;
			}
			//事件监听
			themeSelect.addEventListener("change", (event) => {
				const theme = (event.currentTarget as HTMLSelectElement).value;
				this.setPreviewStyle(theme);
			});
		} else {
			theme = this.JJDefaultTheme;
		}
		this.setPreviewStyle(theme);
	}

	/** 设置预览样式 */
	public setPreviewStyle(theme: string) {
		if (!this.previewStyleLink) {
			this.previewStyleLink = document.createElement("link");
			this.previewStyleLink.setAttribute("rel", "stylesheet");
			this.previewStyleLink.setAttribute("type", "text/css");
			document.head.appendChild(this.previewStyleLink);
		}
		this.previewStyleLink.setAttribute("href", `${this.styleLinkPrefix}/${theme}.css`);
	}
}
