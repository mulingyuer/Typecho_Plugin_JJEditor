# Typecho_Plugin_JJEditor

Typecho 插件-《掘金编辑器》

这段时间逛掘金发现掘金居然开源了文章编辑器，于是想着自己也照葫芦画瓢整一个给博客用，于是花了点时间研究，发现这玩意文档跟没有一样，难受的一批，折腾了好久才搞出来这一版。

目前存在一个缺陷就是直接在编辑器插入原生 html 标签，编辑器的预览无法正确的展示，但是前端查看内容是在的，这个目前没找到解决方案，等后续看看吧。

编辑器和高仿掘金主题实现主题展示联动，支持数学公式和 mermaid 图表，但是由于 Typecho 默认的解析器不支持，所以即便你通过编辑器使用了该功能，实际页面也无法正确展示，如果你需要的话可以去找一些增强解析的插件，比如：[typecho-markdown](https://github.com/mrgeneralgoo/typecho-markdown)，使用这个插件可以让 Typecho 前端正确解析数学公式和 mermaid 图表。

## 仓库镜像地址

由于国内部分用户反馈github不方便查看，特意加了国内的Gitee地址。

Gitee仓库：[Typecho_Plugin_JJEditor](https://gitee.com/mulingyuer/Typecho_Plugin_JJEditor)

## 效果图

![Typecho_Plugin_JJEditor预览图](/docs/images/Typecho_Plugin_JJEditor01.gif)

## 联动主题

[《Typecho_Theme_JJ 高仿掘金主题》](https://github.com/mulingyuer/Typecho_Theme_JJ)

## 主题配置

由于数学公式和 mermaid 图表解析需要比较大的依赖包，为此做成了可选项，默认是关闭了，这样打开编辑器时不会因为网络太差而转圈很久，而且大部分人的博客其实是不怎么用得到的。

主题联动也是默认关闭的，默认会有一个掘金样式文件加载，这样方便在非联动主题下，也能良好的预览内容。

![Typecho_Plugin_JJEditor配置](/docs/images/Typecho_Plugin_JJEditor02.jpg)

## 注意事项

1. 更新插件前请先禁用本插件，更新完插件内容后再启用，以免出现问题。
2. 启用后清理下浏览器缓存（CTRL+SHIFT+R），以避免样式不更新问题。
3. 编辑器 js 和 css 资源文件都进行了 gzip 和 br 压缩处理，如果你的站点支持，可以直接使用已经提供的压缩资源，以提高加载速度。
