/*
 * @Author: mulingyuer
 * @Date: 2023-08-27 01:21:30
 * @LastEditTime: 2023-08-27 15:46:12
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

export default class JJEditor {
	/** 原生编辑器 */
	private nativeEditor = document.getElementById("text") as HTMLTextAreaElement;
	/** 编辑器容器 */
	private editorContainer = document.querySelector(".jj-editor-container") as HTMLDivElement;
	/** 掘金编辑器 */
	private jjEditor: Editor | undefined;

	constructor() {
		this.init();
	}

	/** 初始化 */
	private init() {
		this.jjEditor = new Editor({
			target: this.editorContainer,
			props: {
				value: this.nativeEditor.value,
				locale: zhHans,
				plugins: [gfm(), highlight(), math(), mediumZoom(), mermaid()]
			}
		});
		this.jjEditor.$on("change", this.onEditorChange);
	}

	/** change事件 */
	private onEditorChange = (event: any) => {
		this.jjEditor!.$set({ value: event.detail.value });
		this.nativeEditor.value = event.detail.value;
	};
}
