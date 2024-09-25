<?php
namespace TypechoPlugin\Typecho_Plugin_JJEditor;

use Typecho\Plugin\PluginInterface;
use Typecho\Widget\Helper\Form;
use Typecho\Widget\Helper\Form\Element\Checkbox;
use Typecho\Widget\Helper\Form\Element\Radio;
use Utils\Helper;
use Widget\Options;

if (!defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}

/**
 * 掘金编辑器
 *
 * @package Typecho_Plugin_JJEditor
 * @author mulingyuer
 * @version 1.2.4
 * @link https://github.com/mulingyuer/Typecho_Plugin_JJEditor
 */
class Plugin implements PluginInterface
{
    /**
     * 激活插件方法,如果激活失败,直接抛出异常
     */
    public static function activate()
    {
        // 自定义header
        \Typecho\Plugin::factory('admin/header.php')->header = [__CLASS__, 'header'];

        // footer插入脚本
        \Typecho\Plugin::factory('admin/footer.php')->begin = [__CLASS__, 'footer'];

        // 独立页面插入自定义字段
        \Typecho\Plugin::factory('Widget_Contents_Page_Edit')->getDefaultFieldItems = __CLASS__ . '::addFields';

        return _t("插件已启用");
    }

    /**
     * 禁用插件方法,如果禁用失败,直接抛出异常
     */
    public static function deactivate()
    {
        return _t("插件已禁用");
    }

    /**
     * 获取插件配置面板
     *
     * @param Form $form 配置面板
     */
    public static function config(Form $form)
    {
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
    public static function personalConfig(Form $form)
    {
    }

    /**
     * 插件实现方法
     *
     * @access public
     * @return void
     */
    public static function render()
    {
    }

    /** 自定义header */
    public static function header($header)
    {
        $isEditPage = self::isEditPage();
        if (!$isEditPage) {
            return $header;
        }

        $my_css = self::getEditorCSS();

        return $header . $my_css;
    }

    /** 自定义footer */
    public static function footer()
    {
        $isEditPage = self::isEditPage();
        if (!$isEditPage) {
            return;
        }

        echo self::getEditorJS();
    }

    /** 判断是否编辑文章页 */
    public static function isEditPage()
    {
        // 获取当前页面的请求URL
        $request = new \Typecho\Request();
        $url = $request->getRequestUrl();
        if (strpos($url, __TYPECHO_ADMIN_DIR__ . 'write-post.php') !== false || strpos($url, __TYPECHO_ADMIN_DIR__ . 'write-page.php') !== false) {
            return true;
        }
        return false;
    }

    /** 获取编辑器css样式 */
    public static function getEditorCSS()
    {
        $options = \Typecho_Widget::widget('Widget_Options');
        $pluginUrl = $options->pluginUrl;
        $themeUrl = $options->themeUrl;
        // 主题样式
        $defaultTheme = Helper::options()->defaultMarkdownTheme;
        // 插件配置
        $pluginConfig = Options::alloc()->plugin('Typecho_Plugin_JJEditor');
        $style = self::generatedLink($pluginUrl . "/Typecho_Plugin_JJEditor/dist/style.css");
        // 是否解析数学公式
        if ($pluginConfig->math === 'on') {
            $style .= self::generatedLink($pluginUrl . "/Typecho_Plugin_JJEditor/dist/katex/katex.min.css");
        }

        // config
        $style .= '<link rel="jj_editor" default-theme="' . $defaultTheme . '" theme-href="' . $themeUrl . '" plugin-href="' . $pluginUrl . '/Typecho_Plugin_JJEditor/dist" linkage="' . $pluginConfig->linkage . '" math="' . $pluginConfig->math . '" mermaid="' . $pluginConfig->mermaid . '">';

        return $style;
    }

    /** 获取编辑器JavaScript脚本 */
    public static function getEditorJS()
    {
        $options = \Typecho_Widget::widget('Widget_Options');
        // 插件配置
        $pluginConfig = Options::alloc()->plugin('Typecho_Plugin_JJEditor');
        $pluginUrl = $options->pluginUrl;
        $script = self::generatedScript($pluginUrl . "/Typecho_Plugin_JJEditor/dist/js/init.js") .
        self::generatedScript($pluginUrl . "/Typecho_Plugin_JJEditor/dist/js/highlight.min.js");
        // 是否解析数学公式
        if ($pluginConfig->math === 'on') {
            $script .= self::generatedScript($pluginUrl . "/Typecho_Plugin_JJEditor/dist/katex/katex.min.js");
        }
        // 是否开启mermaid 图表
        if ($pluginConfig->mermaid === 'on') {
            $script .= self::generatedScript($pluginUrl . "/Typecho_Plugin_JJEditor/dist/js/mermaid.min.js");
        }

        // iife
        $script .= self::generatedScript($pluginUrl . "/Typecho_Plugin_JJEditor/dist/jj_editor.iife.js");

        return $script;
    }

    /** 生成link元素脚本 */
    public static function generatedLink($href)
    {
        return '<link rel="stylesheet" href="' . $href . '">';
    }

    /** 生成script元素脚本 */
    public static function generatedScript($src)
    {
        return '<script src="' . $src . '"></script>';
    }

    /** 添加自定义字段 */
    public static function addFields($layout)
    {
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
