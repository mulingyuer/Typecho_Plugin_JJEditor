/*
 * @Author: mulingyuer
 * @Date: 2023-08-27 15:43:15
 * @LastEditTime: 2023-08-27 15:43:15
 * @LastEditors: mulingyuer
 * @Description: init
 * @FilePath: /Typecho_Plugin_JJEditor/public/init.js
 * 怎么可能会有bug！！！
 */
(function () {
	var editor = document.getElementById("text");
	var div = document.createElement("div");
	div.classList.add("jj-editor-container");
	editor.after(div);
})();
