<?php

namespace TypechoPlugin\Typecho_Plugin_JJEditor;

use Typecho\Plugin\PluginInterface;
use Typecho\Widget\Helper\Form;
use Utils\Helper;

if ( ! defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}

/**
 * 掘金编辑器
 *
 * @package Typecho_Plugin_JJEditor
 * @author mulingyuer
 * @version 1.0.0
 * @link https: //www.mulingyuer.com
 */
class Plugin implements PluginInterface {
    /**
     * 激活插件方法,如果激活失败,直接抛出异常
     */
    public static function activate() {
        // 在博客前端插入公共资源，比如css、js
        \Typecho\Plugin::factory('Widget_Archive')->header = __CLASS__.'::blogHeader';
        // 在后台插入样式
        \Typecho\Plugin::factory('admin/header.php')->header = __CLASS__.'::adminHeader';
        // 修改编辑器
        \Typecho\Plugin::factory('admin/write-post.php')->richEditor = __CLASS__.'::richEditor';
        \Typecho\Plugin::factory('admin/write-page.php')->richEditor = __CLASS__.'::richEditor';
    }

    /**
     * 禁用插件方法,如果禁用失败,直接抛出异常
     */
    public static function deactivate() {
    }

    /**
     * 获取插件配置面板
     *
     * @param Form $form 配置面板
     */
    public static function config(Form $form) {
        /** 分类名称 */
        // $name = new Text('word', null, 'Hello World', _t('说点什么'));
        // $form->addInput($name);
    }

    /**
     * 个人用户的配置面板
     *
     * @param Form $form
     */
    public static function personalConfig(Form $form) {
    }

    /**
     * 插件实现方法
     *
     * @access public
     * @return void
     */
    public static function render() {
        // echo '<span class="message success">'
        // .htmlspecialchars(Options::alloc()->plugin('HelloWorld')->word)
        //     .'</span>';
    }

    /**
     * @description: 在博客前端插入公共资源，比如css、js
     * @Date: 2023-08-27 00:34:29
     * @Author: mulingyuer
     */
    public static function blogHeader() {
        echo '';
    }

    /**
     * @description: 在后台插入样式
     * @param {*} $header
     * @Date: 2023-08-27 14:01:07
     * @Author: mulingyuer
     */
    public static function adminHeader($header) {
        $options   = \Typecho_Widget::widget('Widget_Options');
        $pluginUrl = $options->pluginUrl;
        $themeUrl  = $options->themeUrl;
        // 主题样式
        $defaultTheme = Helper::options()->defaultMarkdownTheme;
        $style        = '
          <link rel="stylesheet" href="'.$pluginUrl.'/Typecho_Plugin_JJEditor/dist/style.css">
          <link rel="stylesheet" href="'.$pluginUrl.'/Typecho_Plugin_JJEditor/dist/katex/katex.min.css">
          <link rel="stylesheet" href="'.$themeUrl.'/static/css/markdown/base.css">
          <link rel="jj_editor" default='.$defaultTheme.'" href="'.$themeUrl.'/static/css/markdown/">
        ';
        return $header.$style;
    }

    public static function richEditor($content, $edit) {
        $options   = \Typecho_Widget::widget('Widget_Options');
        $pluginUrl = $options->pluginUrl;
        echo '
          <script src="'.$pluginUrl.'/Typecho_Plugin_JJEditor/dist/init.js"></script>
          <script src="'.$pluginUrl.'/Typecho_Plugin_JJEditor/dist/highlight.min.js"></script>
          <script src="'.$pluginUrl.'/Typecho_Plugin_JJEditor/dist/mermaid.min.js"></script>
          <script src="'.$pluginUrl.'/Typecho_Plugin_JJEditor/dist/katex/katex.min.js"></script>
          <script src="'.$pluginUrl.'/Typecho_Plugin_JJEditor/dist/jj_editor.iife.js"></script>
        ';
    }
}
