<?php

define( 'FCT_DEV', false ); // developer mode

define( 'FCT_SET_SLUG', 'fct' );
define( 'FCT_SET_PREF', FCT_SET_SLUG.'-' );

define( 'FCT_VER', wp_get_theme()->get( 'Version' ).FCT_DEV ? time() : '' );


add_action( 'wp_enqueue_scripts', function() {
	wp_enqueue_style( 'style', get_stylesheet_uri(), [], time() );
});

/* reusable blocks to the menu */
add_action( 'admin_menu', function() {
    add_menu_page(
        'Reusable Gutenberg Blocks',   // Page title
        'Reusable Blocks',             // Menu title
        'manage_options',              // Capability required to access the page
        'edit.php?post_type=wp_block', // URL or slug for the page
        '',                            // Function to render the page (empty, as we just want a link)
        'dashicons-block-default',     // Icon URL or Dashicon class (using default block icon)
        25                             // Position in the left menu (adjust as needed)
    );
});

add_shortcode( 'fct-year', function() { // always demanded by copyright XD
    return date( 'Y' );
});

require __DIR__ . '/gutenberg/index.php';

function css_minify($css) {
    $preg_replace = function($regexp, $replace, $string) { // avoid null result so that css still works even though not fully minified
        return preg_replace( $regexp, $replace, $string ) ?: $string . '/* --- failed '.$regexp.', '.$replace.' */';
    };
    $css = $preg_replace( '/\s+/', ' ', $css ); // one-line & only single speces
    $css = $preg_replace( '/ ?\/\*(?:.*?)\*\/ ?/', '', $css ); // remove comments
    $css = $preg_replace( '/ ?([\{\};:\>\~\+]) ?/', '$1', $css ); // remove spaces
    $css = $preg_replace( '/\+(\d|var)/', ' + $1', $css ); // restore spaces in functions
    $css = $preg_replace( '/(?:[^\}]*)\{\}/', '', $css ); // remove empty properties
    $css = str_replace( [';}', '( ', ' )'], ['}', '(', ')'], $css ); // remove last ; and spaces
    // ++ should also remove 0 from 0.5, but not from svg-s?
    // ++ try replacing ', ' with ','
    // ++ remove space between %3E %3C and before %3E and /%3E
    return trim( $css );
}

function js_after_DOM($script, $jQuery_check = false) {
    return
        ( $jQuery_check
            ? "!function(){let a=setInterval(function(){let b=document.readyState;if(b!=='complete'&&b!=='interactive'||typeof jQuery==='undefined'){return}let $=jQuery;clearInterval(a);a=null;"
            : "!function(){let a=setInterval(function(){let b=document.readyState;if(b!=='complete'&&b!=='interactive'){return}clearInterval(a);a=null;"
        )
        .$script
        ."}, 300 )}();";
}