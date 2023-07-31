<?php

$block_mod_name = FCT_SET['pref'].basename( __DIR__ );
$block_dir_url = get_template_directory_uri() . '/gutenberg/'. basename( __DIR__ );

add_action( 'enqueue_block_editor_assets', function() use ($block_mod_name, $block_dir_url) {

    $block_path = __DIR__ . '/block.js';

    $js_block_mod_name = FCT_SET['var'].'/'.basename( __DIR__ );

    $script_contents = file_get_contents( $block_path );

    $inline_script  = '
        (() => {
            const prefix = "' . esc_js( $block_mod_name.'-' ) . '";
            const blockModName = "' . esc_js( $js_block_mod_name ) . '";
            '.$script_contents.'
        })();
    ';

    wp_register_script( $block_mod_name, '' );
    wp_enqueue_script( $block_mod_name );
    wp_add_inline_script( $block_mod_name, $inline_script );

    $style_path = __DIR__ . '/style.css';
    $style_contents = file_get_contents( $style_path );

});

add_action( 'current_screen', function($screen) use ($block_dir_url) {
    if( $screen->base !== 'site-editor' ) return;
    add_editor_style( $block_dir_url.'/style.css' );
});

add_action( 'wp_enqueue_scripts', function() use ($block_mod_name, $block_dir_url) {

    $style_path = __DIR__ . '/style.css';
    $style_contents = file_get_contents( $style_path );

    wp_register_style( $block_mod_name, false );
    wp_enqueue_style( $block_mod_name );
    wp_add_inline_style( $block_mod_name, $style_contents );
});