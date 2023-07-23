<?php

add_action( 'enqueue_block_editor_assets', function() {

    $block_name = FCT_SET['pref'].basename( __DIR__ );
    $block_dir_url = get_template_directory_uri() . '/gutenberg/'. basename( __DIR__ );
    $block_path = __DIR__ . '/block.js';

    $script_contents = file_get_contents( $block_path );

    $inline_script  = '
        (() => {
            const prefix = "' . esc_js( FCT_SET['pref'] ) . '";
            const blockName = "' . esc_js( FCT_SET['pref'].'/'.basename( __DIR__ ) ) . '";
            '.$script_contents.'
        })();
    ';

    wp_register_script( $block_name, '' );
    wp_enqueue_script( $block_name );
    wp_add_inline_script( $block_name, $inline_script );

    wp_register_style(
        $block_name . '-style',
        $block_dir_url.'/style.css',
        [],
        FCT_VER
    );
    wp_enqueue_style($block_name . '-style');

});