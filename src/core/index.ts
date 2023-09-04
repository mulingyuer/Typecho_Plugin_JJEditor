/*
 * @Author: mulingyuer
 * @Date: 2023-08-27 01:21:30
 * @LastEditTime: 2023-09-04 00:38:47
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
import math from "./plugins/math";
import mediumZoom from "@bytemd/plugin-medium-zoom";
import mermaid from "./plugins/mermaid";
import type { EditorConfig, Plugins } from "./types";

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
	/** 配置数据 */
	private config: EditorConfig = {
		rel: "",
		"default-theme": "",
		"theme-href": "",
		"plugin-href": "",
		linkage: "",
		math: "",
		mermaid: ""
	};
	/** 预览样式link元素 */
	private previewStyleLink: HTMLLinkElement | undefined;

	constructor() {
		this.config = this.getEditorConfig();
		this.initPreviewStyle();
		this.initEdit();
	}

	/** 获取配置 */
	private getEditorConfig(): EditorConfig {
		const link = document.querySelector('link[rel="jj_editor"]')!;
		let config: EditorConfig = {
			rel: "",
			"default-theme": "",
			"theme-href": "",
			"plugin-href": "",
			linkage: "",
			math: "",
			mermaid: ""
		};
		Array.from(link.attributes).forEach((attr) => {
			const key = attr.name as keyof EditorConfig;
			const val = attr.value as EditorConfig[keyof EditorConfig];
			config[key] = val;
		});
		return config;
	}

	/** 编辑器初始化 */
	private initEdit() {
		/** 插件处理 */
		const plugins: Plugins = [gfm(), highlight(), mediumZoom()];
		// 是否解析数学公式
		if (this.config.math === "on") {
			plugins.push(math({ locale: MATH_LOCALE, katexOptions: {} }));
		}
		/** 是否开启mermaid 图表 */
		if (this.config.mermaid === "on") {
			plugins.push(mermaid({ locale: MERMAID_LOCALE }));
		}

		//创建编辑器实例
		this.jjEditor = new Editor({
			target: this.editorContainer,
			props: {
				value: this.nativeEditor.value,
				locale: zhHans,
				plugins
			}
		});
		//监听编辑器变化
		this.jjEditor.$on("change", this.onEditorChange);
	}

	/** 编辑器change事件 */
	private onEditorChange = (event: any) => {
		this.jjEditor!.$set({ value: event.detail.value });
		this.nativeEditor.value = event.detail.value;
	};

	/** 初始化预览样式 */
	private initPreviewStyle() {
		//保底处理，防止默认主题为空
		if (typeof this.config["default-theme"] === "string" && this.config["default-theme"].trim() === "") {
			this.config["default-theme"] = "juejin";
		}
		//是否联动JJ主题
		if (this.config.linkage === "on") {
			this.linkagePreviewStyle();
		} else {
			//走默认掘金主题
			this.defaultPreviewStyle();
		}
	}

	/** 联动JJ主题样式 */
	private linkagePreviewStyle() {
		let theme = "juejin";
		//获取用户配置
		const themeSelect = document.querySelector('select[name="fields[markdownTheme]"]') as HTMLSelectElement;
		if (themeSelect) {
			const selectTheme = themeSelect.value;
			if (this.config["default-theme"] !== "juejin" && selectTheme === "juejin") {
				theme = this.config["default-theme"];
			} else {
				theme = selectTheme;
			}
			//事件监听
			themeSelect.addEventListener("change", (event) => {
				const theme = (event.currentTarget as HTMLSelectElement).value;
				this.setLinkagePreviewStyle(theme);
			});
		} else {
			theme = this.config["default-theme"];
		}
		this.setLinkagePreviewStyle(theme);
	}

	/**  联动JJ主题样式设置预览样式 */
	private setLinkagePreviewStyle(theme: string) {
		if (!this.previewStyleLink) {
			this.previewStyleLink = this.createLink();
			document.head.appendChild(this.previewStyleLink);
		}
		this.previewStyleLink.setAttribute("href", `${this.config["theme-href"]}/static/css/markdown/${theme}.css`);
	}

	/** 默认预览样式 */
	private defaultPreviewStyle() {
		const baskLink = this.createLink(`${this.config["plugin-href"]}/css/base.css`);
		const styleLink = this.createLink(`${this.config["plugin-href"]}/css/juejin.css`);
		document.head.appendChild(baskLink);
		document.head.appendChild(styleLink);
	}

	/** 创建一个link元素 */
	private createLink(href?: string) {
		const link = document.createElement("link");
		link.setAttribute("rel", "stylesheet");
		link.setAttribute("type", "text/css");
		if (href) link.setAttribute("href", href);
		return link;
	}
}
