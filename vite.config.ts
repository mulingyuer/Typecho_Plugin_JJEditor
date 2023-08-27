/*
 * @Author: mulingyuer
 * @Date: 2023-08-26 23:50:22
 * @LastEditTime: 2023-08-27 15:09:20
 * @LastEditors: mulingyuer
 * @Description: vite配置文件
 * @FilePath: /Typecho_Plugin_JJEditor/vite.config.ts
 * 怎么可能会有bug！！！
 */
import { defineConfig } from "vite";
// import { babel } from "@rollup/plugin-babel";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
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
	plugins: [
		// babel({
		// 	babelHelpers: "bundled",
		// 	exclude: "node_modules/**"
		// })
		visualizer({
			emitFile: true,
			filename: "analyzer.html",
			gzipSize: true
		})
	]
});
