/*
 * @Author: mulingyuer
 * @Date: 2023-08-26 23:50:22
 * @LastEditTime: 2023-09-05 00:37:56
 * @LastEditors: mulingyuer
 * @Description: vite配置文件
 * @FilePath: /Typecho_Plugin_JJEditor/vite.config.ts
 * 怎么可能会有bug！！！
 */
import { defineConfig } from "vite";
import type { PluginOption } from "vite";
import viteCompression from "vite-plugin-compression";

export default defineConfig((env) => {
	/** 插件 */
	const plugins: PluginOption[] = [];
	if (process.env.mode === "production") {
		//压缩处理
		plugins.push(
			viteCompression({
				algorithm: "brotliCompress",
				compressionOptions: {
					level: 11
				}
			}),
			viteCompression({
				algorithm: "gzip"
			})
		);
	}

	return {
		build: {
			outDir: "dist",
			lib: {
				entry: "src/main.ts",
				name: "JJEditor",
				fileName: "jj_editor",
				formats: ["iife"]
			},
			rollupOptions: {
				// 确保外部化处理那些你不想打包进库的依赖
				external: ["highlight.js", "mermaid", "katex"]
			},
			sourcemap: true
		},
		define: {
			"process.env": JSON.stringify(process.env)
		},
		plugins
	};
});
