<?php

namespace TypechoPlugin\Typecho_Plugin_JJEditor;

use Typecho\Plugin\PluginInterface;
use Typecho\Widget\Helper\Form;
use Typecho\Widget\Helper\Form\Element\Checkbox;
use Typecho\Widget\Helper\Form\Element\Radio;
use Utils\Helper;
use Widget\Options;

if ( ! defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}

/**
 * 掘金编辑器
 *
 * @package Typecho_Plugin_JJEditor
 * @author mulingyuer
 * @version 1.2.1
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
        // 独立页面插入自定义字段
        \Typecho\Plugin::factory('Widget_Contents_Page_Edit')->getDefaultFieldItems = __CLASS__.'::addFields';
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
        /** 是否与JJ主题联动样式 */
        $linkage = new Radio('linkage', array('on' => _t('联动'), 'off' => _t('不联动')), 'off', _t('是否与 <a href="https://github.com/mulingyuer/Typecho_Theme_JJ" target="_blank">JJ主题</a> 联动样式'), _t('注意：联动样式只会在编辑器的预览框生效。'));
        $form->addInput($linkage);
        /** 是否开启计算公式预览 */
        $math = new Radio('math', array('on' => _t('开启'), 'off' => _t('关闭')), 'off', _t('是否开启预览计算公式'), _t('注意：开启该功能会加载计算公式依赖，如果服务器网络不好，在无缓存情况下会导致编辑器不会马上加载出来！'));
        $form->addInput($math);
        /** 是否开启mermaid 图表 */
        $mermaid = new Radio('mermaid', array('on' => _t('开启'), 'off' => _t('关闭')), 'off', _t('是否开启mermaid 图表'), _t('注意：开启该功能会加载计算公式依赖，如果服务器网络不好，在无缓存情况下会导致编辑器不会马上加载出来！'));
        $form->addInput($mermaid);
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
        // 获取当前页面的请求URL
        $request = new \Typecho\Request();
        $url     = $request->getRequestUrl();
        if (strpos($url, '/admin/write-post.php') === false && strpos($url, '/admin/write-page.php') === false) {
            return $header;
        }
        $options   = \Typecho_Widget::widget('Widget_Options');
        $pluginUrl = $options->pluginUrl;
        $themeUrl  = $options->themeUrl;
        // 主题样式
        $defaultTheme = Helper::options()->defaultMarkdownTheme;
        // 插件配置
        $pluginConfig = Options::alloc()->plugin('Typecho_Plugin_JJEditor');
        $style        = '<link rel="stylesheet" href="'.$pluginUrl.'/Typecho_Plugin_JJEditor/dist/style.css">';
        // 是否解析数学公式
        if ($pluginConfig->math === 'on') {
            $style .= '<link rel="stylesheet" href="'.$pluginUrl.'/Typecho_Plugin_JJEditor/dist/katex/katex.min.css">';
        }

        // config
        $style .= '<link rel="jj_editor" default-theme="'.$defaultTheme.'" theme-href="'.$themeUrl.'" plugin-href="'.$pluginUrl.'/Typecho_Plugin_JJEditor/dist" linkage="'.$pluginConfig->linkage.'" math="'.$pluginConfig->math.'" mermaid="'.$pluginConfig->mermaid.'">';

        return $header.$style;
    }

    /** 自定义编辑器 */
    public static function richEditor($content, $edit) {
        $options = \Typecho_Widget::widget('Widget_Options');
        // 插件配置
        $pluginConfig = Options::alloc()->plugin('Typecho_Plugin_JJEditor');
        $pluginUrl    = $options->pluginUrl;
        $script       = '<script src="'.$pluginUrl.'/Typecho_Plugin_JJEditor/dist/js/init.js"></script>
          <script src="'.$pluginUrl.'/Typecho_Plugin_JJEditor/dist/js/highlight.min.js"></script>';
        // 是否解析数学公式
        if ($pluginConfig->math === 'on') {
            $script .= '<script src="'.$pluginUrl.'/Typecho_Plugin_JJEditor/dist/katex/katex.min.js"></script>';
        }
        // 是否开启mermaid 图表
        if ($pluginConfig->mermaid === 'on') {
            $script .= '<script src="'.$pluginUrl.'/Typecho_Plugin_JJEditor/dist/js/mermaid.min.js"></script>';
        }

        // iife
        $script .= '<script src="'.$pluginUrl.'/Typecho_Plugin_JJEditor/dist/jj_editor.iife.js"></script>';

        echo $script;
    }

    /** 添加自定义字段 */
    public static function addFields($layout) {
        // 是否启用友链样式
        $openLinkStyle = new Checkbox('openLinkStyle',
            array(
                'open' => _t('开启'),
            ),
            array(''),
            _t('是否启用友链样式'),
            _t('启用后可以预览 <a href="https://github.com/mulingyuer/Typecho_Theme_JJ" target="_blank">JJ主题</a> 的友链样式效果，如果是其他主题只能在编辑页有效果。该设置仅友链页启用即可。'));
        $layout->addItem($openLinkStyle);

    }

}
