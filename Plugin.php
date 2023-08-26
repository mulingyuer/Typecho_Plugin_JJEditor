<?php

namespace TypechoPlugin\Typecho_Plugin_JJEditor;

use Typecho\Plugin\PluginInterface;
use Typecho\Widget\Helper\Form;
use Typecho\Widget\Helper\Form\Element\Text;

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
        \Typecho\Plugin::factory('Widget_Archive')->header   = __CLASS__.'::blogHeader';
        \Typecho\Plugin::factory('admin/header.php')->header = __CLASS__.'::adminHeader';
        // 修改编辑器
        \Typecho\Plugin::factory('admin/write-post.php')->richEditor = __CLASS__.'::richEditor';
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
        $name = new Text('word', null, 'Hello World', _t('说点什么'));
        $form->addInput($name);
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

    public static function adminHeader() {
        $options = \Typecho_Widget::widget('Widget_Options');
        ?>
        <!DOCTYPE HTML>
        <html>
          <head>
              <meta charset="<?php $options->charset();?>">
              <meta name="renderer" content="webkit">
              <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
              <title><?php _e('%s - %s - Powered by Typecho', $menu->title, $options->title);?></title>
              <meta name="robots" content="noindex, nofollow">
              <link rel="stylesheet" href="<?php echo $options->adminStaticUrl('css', 'normalize.css', true); ?>">
              <link rel="stylesheet" href="<?php echo $options->adminStaticUrl('css', 'grid.css', true); ?>">
              <link rel="stylesheet" href="<?php echo $options->adminStaticUrl('css', 'style.css', true); ?>">
              <link rel="stylesheet" type="text/css" href="<?php echo $options->pluginUrl.'/Typecho_Plugin_JJEditor/dist/style.css'; ?>">
          </head>
          <body<?php if (isset($bodyClass)) {echo ' class="'.$bodyClass.'"';}?>>

        <?php
}

    public static function richEditor($content, $edit) {
        $options = \Typecho_Widget::widget('Widget_Options');
        $path    = $options->pluginUrl.'/Typecho_Plugin_JJEditor/dist/jj_editor.iife.js';
        echo '<script src="'.$path.'"></script>';
    }
}
