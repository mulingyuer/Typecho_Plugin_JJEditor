/*
 * @Author: mulingyuer
 * @Date: 2023-09-03 23:41:44
 * @LastEditTime: 2023-09-04 00:30:17
 * @LastEditors: mulingyuer
 * @Description: 类型声明
 * @FilePath: /Typecho_Plugin_JJEditor/src/core/types.ts
 * 怎么可能会有bug！！！
 */
import type { EditorProps } from "bytemd";

/** 编辑器配置类型 */
export interface EditorConfig {
	/** 类型 */
	rel: string;
	/** 默认主题 */
	["default-theme"]: string;
	/** 主题链接前缀 */
	["theme-href"]: string;
	/** 插件链接前缀 */
	["plugin-href"]: string;
	/** 是否联动主题 */
	linkage: string;
	/** 是否开启数学公式 */
	math: string;
	/** 是否开启mermaid 图表 */
	mermaid: string;
}

/** 插件数组 */
export type PluginsItem =
	| Required<EditorProps>["plugins"][number]
	| { viewerEffect({ markdownBody }: { markdownBody: any }): void };
export type Plugins = PluginsItem[];
