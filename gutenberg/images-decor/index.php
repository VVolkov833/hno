<?php

$block_mod_name = FCT_SET['pref'].basename( __DIR__ ); // ++ can export those to the main index.php
$block_dir_url = get_template_directory_uri() . '/gutenberg/'. basename( __DIR__ );
$block_type_name = FCT_SET['var'].'/'.basename( __DIR__ );

add_action( 'init', function() use ($block_mod_name, $block_dir_url, $block_type_name) {

    $print_block = function($props, $content = null) use ($block_mod_name) {

        ob_start();

        ?>
            <div class="<?php echo $block_mod_name ?>">
                <div class="<?php echo $block_mod_name ?>-inner">
                    Content <?php echo( $content ) ?>
                </div>
            </div>
        <?php

        $content = ob_get_contents();
        ob_end_clean();
        return $content;
    };

    register_block_type( $block_type_name, [
        'editor_script' => $block_mod_name,
        'editor_style' => $block_mod_name.'-editor',
        'render_callback' => $print_block
    ] );


    $block_path = __DIR__ . '/block.js';
    $script_contents = file_get_contents( $block_path );

    $inline_script  = '
        (() => {
            const prefix = "' . esc_js( $block_mod_name.'-' ) . '";
            const blockModName = "' . esc_js( $block_type_name ) . '";
            '.$script_contents.'
        })();
    ';

    wp_register_script( $block_mod_name, '', ['wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components'] );  // to use variables without defining globals
    wp_enqueue_script( $block_mod_name );
    wp_add_inline_script( $block_mod_name, $inline_script );

    wp_register_style(
        $block_mod_name.'-editor',
        $block_dir_url.'/editor.css',
        ['wp-edit-blocks'],
        FCT_VER
    );
});

add_action( 'wp_enqueue_scripts', function() use ($block_mod_name, $block_type_name) {

    if ( !has_block( $block_type_name ) ) { return; }

    $style_path = __DIR__ . '/style.css';
    $style_contents = file_get_contents( $style_path );

    wp_register_style( $block_mod_name, false );
    wp_enqueue_style( $block_mod_name );
    wp_add_inline_style( $block_mod_name, FCT_DEV ? $style_contents : css_minify( $style_contents ) );
});