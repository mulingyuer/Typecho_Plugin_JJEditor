/*
 * @Author: mulingyuer
 * @Date: 2024-05-05 01:00:56
 * @LastEditTime: 2024-05-05 01:16:17
 * @LastEditors: mulingyuer
 * @Description: typecho图片插入
 * @FilePath: /Typecho_Plugin_JJEditor/src/core/plugins/image.ts
 * 怎么可能会有bug！！！
 */
import type { BytemdPlugin } from "bytemd";

/** 获取图片按钮 */
const getImageButton = (function () {
	let imgBtn: HTMLButtonElement | null = null;

	return function () {
		if (imgBtn) return imgBtn;
		imgBtn = document.getElementById("wmd-image-button") as HTMLButtonElement;
		return imgBtn;
	};
})();

export default function image(): BytemdPlugin {
	const icon =
		'<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 48 48"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 10a2 2 0 0 1 2-2h34a2 2 0 0 1 2 2v28a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V10Z" clip-rule="evenodd"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M14.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" clip-rule="evenodd"></path><path stroke="currentColor" stroke-linejoin="round" stroke-width="4" d="m15 24 5 4 6-7 17 13v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-4l10-10Z"></path></svg>';

	return {
		actions: [
			{
				title: "图片",
				icon: icon,
				handler: {
					type: "action",
					click() {
						const imgBtn = getImageButton();
						if (!imgBtn) return;

						imgBtn.click();
					}
				}
			}
		]
	};
}
