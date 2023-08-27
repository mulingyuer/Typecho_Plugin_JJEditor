/*
 * @Author: mulingyuer
 * @Date: 2023-08-27 16:43:42
 * @LastEditTime: 2023-08-27 17:54:26
 * @LastEditors: mulingyuer
 * @Description: 任务列表
 * @FilePath: /Typecho_Plugin_JJEditor/src/core/plugins/codePlacement.ts
 * 怎么可能会有bug！！！
 */
import type { BytemdPlugin } from "bytemd";
import remark2rehype from "remark-rehype";
import raw from "rehype-raw";
import rehypeStringify from "rehype-stringify";

const icon =
	'<svg t="1693126663445" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11965" width="200" height="200"><path d="M85.312 164.8v604.8h853.376v-604.8H85.312zM682.688 870.4V960H341.312v-89.6H0V64h1024v806.4h-341.312zM390.08 632.128L128 503.04V422.336l262.08-128.64V390.4L230.784 462.976l159.296 72.832v96.32zM529.6 256H576l-82.048 413.184H448L529.6 256z m104.32 376.128V535.808l159.296-72.832-159.296-72.512V293.632L896 422.4v80.768L633.92 632.128z" fill="#262626" p-id="11966"></path></svg>';

export default function codePlacement(): BytemdPlugin {
	return {
		actions: [
			{
				title: "代码置入",
				icon: icon,
				handler: {
					type: "action",
					click({ appendBlock, editor }) {
						console.log("🚀 ~ file: codePlacement.ts:24 ~ editor:", editor);
						console.log("🚀 ~ file: codePlacement.ts:24 ~ appendBlock:", appendBlock);
						appendBlock(
							`<iframe src="//player.bilibili.com/player.html?aid=830093185&bvid=BV1Vu4y1X7TM&cid=1242690096&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>\n`
						);
						// editor.setValue(`<div style="color: red;">这是一些红色的文字。</div>`);
						editor.focus();
					}
				}
			}
		],
		viewerEffect({ markdownBody, file }) {
			console.log("🚀 ~ file: codePlacement.ts:36 ~ markdownBody:", markdownBody, file);
		},
		remark(p) {
			p.use(remark2rehype, { allowDangerousHtml: true })
				.use(raw)
				.use(rehypeStringify as any);
			return p;
		},
		rehype(p) {
			return p;
		}
	};
}
