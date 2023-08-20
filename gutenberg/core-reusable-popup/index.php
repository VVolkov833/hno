<?php

$block_mod_name = FCT_SET['pref'].basename( __DIR__ );
$block_dir_url = get_template_directory_uri() . '/gutenberg/'. basename( __DIR__ );
$block_type_name = FCT_SET['var'].'/'.basename( __DIR__ );

add_action( 'enqueue_block_editor_assets', function() use ($block_mod_name, $block_type_name) {

    $block_path = __DIR__ . '/block.js';

    // select reusable blocks
    // Get the current language using Polylang (pll) plugin
    $current_language = function_exists( 'pll_current_language' ) ? pll_current_language() : 'default';

    // Get reusable blocks
    $reusable_blocks = get_posts(
        array(
            'post_type'      => 'wp_block',
            'posts_per_page' => -1,
            'lang'           => $current_language, // Set the current language
        )
    );

    // Create an array to store block IDs and titles
    $block_array = [];

    foreach ( $reusable_blocks as $block ) {
        $block_array[] = [
            'value' => 'popup-id-'.$block->ID,
            'label' => $block->post_title
        ];
    }

    // Convert the PHP array to a JSON object for use in JavaScript
    $block_array_json = json_encode( $block_array );

    $script_contents = file_get_contents( $block_path );

    $inline_script  = '
        (() => {
            const prefix = "' . esc_js( $block_mod_name.'-' ) . '";
            const blockModName = "' . esc_js( $block_type_name ) . '";
            const blockArray = ' . $block_array_json . ';
            '.$script_contents.'
        })();
    ';

    wp_register_script( $block_mod_name, '' ); // to use variables without defining globals
    wp_enqueue_script( $block_mod_name );
    wp_add_inline_script( $block_mod_name, $inline_script );

    $style_path = __DIR__ . '/style.css';
    $style_contents = file_get_contents( $style_path );

});

add_action( 'current_screen', function($screen) use ($block_dir_url) { // for block theme editor // ++ check if the next enqueue loads the script second time
    if( $screen->base !== 'site-editor' ) return;
    add_editor_style( $block_dir_url.'/style.css' );
});
add_action( 'enqueue_block_editor_assets', function() use ($block_dir_url) { // for common editor
    add_editor_style( $block_dir_url.'/style.css' );
});

add_action( 'wp_enqueue_scripts', function() use ($block_mod_name) {

    $style_path = __DIR__ . '/style.css';
    $style_contents = file_get_contents( $style_path );

    wp_register_style( $block_mod_name, false );
    wp_enqueue_style( $block_mod_name );
    wp_add_inline_style( $block_mod_name, FCT_DEV ? $style_contents : css_minify( $style_contents ) );
});