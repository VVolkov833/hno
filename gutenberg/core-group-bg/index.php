<?php

add_action( 'enqueue_block_editor_assets', function() {

    $block_name = FCT_SET['pref'].basename( __DIR__ );
    $block_url = get_template_directory_uri() . '/gutenberg/'. basename( __DIR__ ) . '/block.js';
    $block_path = __DIR__ . '/block.js';

    $script_contents = file_get_contents( $block_path );

    $inline_script  = '
        (() => {
            const blockName = "' . esc_js( FCT_SET['pref'].'/'.basename( __DIR__ ) ) . '";
            '.$script_contents.'
        })();
    ';

    wp_register_script( $block_name, '' );
    wp_enqueue_script( $block_name );
    wp_add_inline_script( $block_name, $inline_script );

});