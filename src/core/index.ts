/*
 * @Author: mulingyuer
 * @Date: 2023-08-27 01:21:30
 * @LastEditTime: 2023-12-23 02:32:37
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
import { MATH_LOCALE, MERMAID_LOCALE } from "./language/zh";
import { MARKDOWN_HIGHLIGHT_MAP } from "./constant/markdown";
import type { EditorConfig, Plugins } from "./types";

export class JJEditor {
	/** 默认的编辑器TextArea元素 */
	private defaultTextArea: HTMLTextAreaElement = document.getElementById("text") as HTMLTextAreaElement;
	/** 编辑器容器 */
	private editorContainer = document.querySelector(".jj-editor-container") as HTMLDivElement;
	/** 掘金编辑器实例 */
	private editor: Editor | undefined;
	/** 编辑器插件配置数据 */
	private config: EditorConfig = {
		rel: "",
		"default-theme": "",
		"theme-href": "",
		"plugin-href": "",
		linkage: "",
		math: "",
		mermaid: ""
	};
	/** 基础文章样式 */
	private baseLink = this.createLinkElement();
	/** 文章主题link元素 */
	private articleThemeLink = this.createLinkElement();
	// 文章主题select元素
	private articleSelect: HTMLSelectElement | null = document.querySelector('select[name="fields[markdownTheme]"]');
	/** 代码高亮主题link元素 */
	private highlightThemeLink = this.createLinkElement();
	// 代码高亮主题
	private highlightSelect: HTMLSelectElement | null = document.querySelector('select[name="fields[highlightTheme]"]');
	// 友链样式checkbox元素
	private linksStyleCheckBox: HTMLInputElement | null = document.querySelector('input[name="fields[openLinkStyle][]"]');
	// 友链样式link元素
	private linksLink = this.createLinkElement();

	constructor() {
		Object.assign(this.config, this.getConfig());
		this.initPreviewStyle();
		this.initLinksPreviewStyle();
		this.initEditor();
	}

	/** 获取编辑器插件配置数据 */
	private getConfig(): EditorConfig {
		const link = document.querySelector('link[rel="jj_editor"]');
		const config: EditorConfig = {
			rel: "",
			"default-theme": "",
			"theme-href": "",
			"plugin-href": "",
			linkage: "",
			math: "",
			mermaid: ""
		};
		if (!link) return config;
		Array.from(link.attributes).forEach((attr) => {
			const key = attr.name as keyof EditorConfig;
			const val: EditorConfig[keyof EditorConfig] = attr.value;
			config[key] = val;
		});
		// 保底处理，防止默认主题为空
		if (typeof config["default-theme"] === "string" && config["default-theme"].trim() === "") {
			config["default-theme"] = "juejin";
		}

		return config;
	}

	/** 初始化编辑器 */
	private initEditor() {
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
		this.editor = new Editor({
			target: this.editorContainer,
			props: {
				value: this.defaultTextArea.value,
				locale: zhHans,
				plugins
			}
		});
		//监听编辑器变化
		this.editor.$on("change", (event) => {
			this.editor?.$set({ value: event.detail.value });
			this.defaultTextArea.value = event.detail.value;
		});
	}

	/** 初始化预览样式 */
	private initPreviewStyle() {
		const baseHref = `${this.config["plugin-href"]}/css/base.css`;
		let articleTheme = "juejin";
		// 如果没有联动使用插件自带的样式
		let articleThemeHref = `${this.config["plugin-href"]}/css/juejin.css`;
		let highlightTheme = "juejin";
		// 如果没有联动使用插件自带的样式
		let highlightThemeHref = `${this.config["plugin-href"]}/css/highlight_juejin.css`;
		//是否联动JJ主题
		if (this.config.linkage === "on") {
			// 文章主题
			if (this.articleSelect) {
				articleTheme = this.articleSelect.value;
				if (this.config["default-theme"] !== "juejin" && articleTheme === "juejin") {
					articleTheme = this.config["default-theme"];
				}
				//事件监听
				this.articleSelect.addEventListener("change", (event) => {
					const aTheme = (event.currentTarget as HTMLSelectElement).value;
					const href = `${this.config["theme-href"]}/static/css/markdown/${aTheme}.css`;
					this.articleThemeLink.setAttribute("href", href);
					// 如果用户没有指定代码高亮主题，采用主题配套的代码高亮
					if (this.highlightSelect && this.highlightSelect.value.trim() === "") {
						const hTheme = MARKDOWN_HIGHLIGHT_MAP[aTheme as keyof typeof MARKDOWN_HIGHLIGHT_MAP] ?? "juejin";
						const href = `${this.config["theme-href"]}/static/css/highlight/${hTheme}.css`;
						this.highlightThemeLink.setAttribute("href", href);
					}
				});
			}

			// 代码高亮主题
			if (this.highlightSelect) {
				highlightTheme = this.highlightSelect.value;
				if (highlightTheme.trim() === "") {
					highlightTheme = MARKDOWN_HIGHLIGHT_MAP[articleTheme as keyof typeof MARKDOWN_HIGHLIGHT_MAP] ?? "juejin";
				}
				//事件监听
				this.highlightSelect.addEventListener("change", (event) => {
					const theme = (event.currentTarget as HTMLSelectElement).value;
					const href = `${this.config["theme-href"]}/static/css/highlight/${theme}.css`;
					this.highlightThemeLink.setAttribute("href", href);
				});
			}

			// 生成链接
			articleThemeHref = `${this.config["theme-href"]}/static/css/markdown/${articleTheme}.css`;
			highlightThemeHref = `${this.config["theme-href"]}/static/css/highlight/${highlightTheme}.css`;
		}

		// 设置link元素href
		this.baseLink.setAttribute("href", baseHref);
		this.articleThemeLink.setAttribute("href", articleThemeHref);
		this.highlightThemeLink.setAttribute("href", highlightThemeHref);
		// 插入元素
		document.head.appendChild(this.baseLink);
		document.head.appendChild(this.articleThemeLink);
		document.head.appendChild(this.highlightThemeLink);
	}

	/** 初始化友链预览样式 */
	private initLinksPreviewStyle() {
		if (!this.linksStyleCheckBox) return;
		if (!this.linksStyleCheckBox.checked) return;
		const href = `${this.config["plugin-href"]}/css/links.css`;
		this.linksLink.setAttribute("href", href);
		// 监听事件
		this.linksStyleCheckBox.addEventListener("change", () => {
			if (this.linksStyleCheckBox!.checked) {
				this.linksLink.setAttribute("href", href);
			} else {
				this.linksLink.setAttribute("href", "");
			}
		});

		// 插入元素
		document.head.appendChild(this.linksLink);
	}

	/** 创建link元素 */
	private createLinkElement(href?: string, rel = "stylesheet") {
		const link = document.createElement("link");
		link.setAttribute("rel", rel);
		link.setAttribute("type", "text/css");
		if (href) link.setAttribute("href", href);
		return link;
	}
}
