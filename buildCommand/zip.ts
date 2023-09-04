/*
 * @Author: mulingyuer
 * @Date: 2023-09-03 20:19:43
 * @LastEditTime: 2023-09-05 00:58:43
 * @LastEditors: mulingyuer
 * @Description: 将主题打包成zip文件
 * @FilePath: /Typecho_Plugin_JJEditor/buildCommand/zip.ts
 * 怎么可能会有bug！！！
 */
import { readdirSync, statSync, createWriteStream } from "node:fs";
import archiver from "archiver";
import { resolve, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/** 根目录 */
const rootPath = resolve(__dirname, "../");
/** 文件白名单 */
const whiteFileList: Array<string> = [];
/** 文件夹白名单 */
const whiteDirList = ["dist"];

/** 获取文件路径 */
function getFilePath(pathList: Array<string>) {
	/** 文件路径 */
	const filePathList: Array<{ fileName: string; path: string }> = [];
	pathList.forEach((name) => {
		const isWhiteFile = whiteFileList.includes(name);
		if (isWhiteFile) {
			filePathList.push({
				fileName: name,
				path: join(rootPath, name)
			});
			return;
		}
		if (name.endsWith(".php")) {
			filePathList.push({
				fileName: name,
				path: join(rootPath, name)
			});
		}
	});
	return filePathList;
}

/** 获取文件夹 */
function getDirPath(pathList: Array<string>) {
	/** 文件夹路径 */
	const dirPathList: Array<{ dirName: string; path: string }> = [];
	pathList.forEach((name) => {
		const isWhiteDir = whiteDirList.includes(name);
		if (!isWhiteDir) return;
		const fullPath = join(rootPath, name);
		const isDir = statSync(fullPath).isDirectory();
		if (isDir) dirPathList.push({ dirName: name, path: fullPath });
	});
	return dirPathList;
}

/** init */
(function init() {
	const pathList = readdirSync(rootPath);
	const filePathList = getFilePath(pathList);
	const dirPathList = getDirPath(pathList);

	//zip
	const output = createWriteStream(join(rootPath, "Typecho_Plugin_JJEditor.zip"));
	const archive = archiver("zip", {
		zlib: { level: 9 }
	});

	//监听完成事件
	output.on("close", () => {
		let size = archive.pointer() / (1024 * 1024);
		size = Math.floor(size * 100) / 100;
		console.log(`🔯：打包zip完成，zip大小为：${size} MB`);
	});

	// 使用管道方式导出到文件
	archive.pipe(output);

	// 添加单个文件
	filePathList.forEach((item) => {
		archive.file(item.path, { name: item.fileName });
	});

	// 添加整个文件夹，包括子路径
	dirPathList.forEach((item) => {
		archive.directory(`${item.path}/`, item.dirName);
	});

	// 将归档内容最终化
	archive.finalize();
})();
