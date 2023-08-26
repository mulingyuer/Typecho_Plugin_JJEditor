/*
 * @Author: mulingyuer
 * @Date: 2023-08-26 23:50:22
 * @LastEditTime: 2023-08-27 03:04:25
 * @LastEditors: mulingyuer
 * @Description: vite配置文件
 * @FilePath: /Typecho_Plugin_JJEditor/vite.config.ts
 * 怎么可能会有bug！！！
 */
import { defineConfig } from "vite";
import { babel } from "@rollup/plugin-babel";

export default defineConfig({
	build: {
		outDir: "dist",
		lib: {
			entry: "src/main.ts",
			name: "JJEditor",
			fileName: "jj_editor",
			formats: ["iife"]
		},
		sourcemap: true
	},
	define: {
		"process.env": JSON.stringify(process.env)
	},
	plugins: [
		babel({
			babelHelpers: "bundled",
			exclude: "node_modules/**"
		})
	]
});
