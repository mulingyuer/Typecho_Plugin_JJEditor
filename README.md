# Typecho_Plugin_JJEditor

Typecho 插件-《掘金编辑器》

这段时间逛掘金发现掘金居然开源了文章编辑器，于是想着自己也照葫芦画瓢整一个给博客用，于是花了点时间研究，发现这玩意文档跟没有一样，难受的一批，折腾了好久才搞出来这一版。

目前存在一个缺陷就是直接在编辑器插入原生 html 标签，编辑器的预览无法正确的展示，但是前端查看内容是在的，这个目前没找到解决方案，等后续看看吧。

编辑器和高仿掘金主题实现主题展示联动，支持数学公式和 mermaid 图表，但是由于 Typecho 默认的解析器不支持，所以即便你通过编辑器使用了该功能，实际页面也无法正确展示，如果你需要的话可以去找一些增强解析的插件，比如：[typecho-markdown](https://github.com/mrgeneralgoo/typecho-markdown)，使用这个插件可以让 Typecho 前端正确解析数学公式和 mermaid 图表。

## 效果图

![Typecho_Plugin_JJEditor预览图](/Typecho_Plugin_JJEditor01.gif)

## 联动主题

[《Typecho_Theme_JJ 高仿掘金主题》](https://github.com/mulingyuer/Typecho_Theme_JJ)
