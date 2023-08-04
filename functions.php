<?php

define( 'FCT_DEV', true ); // developer mode
define( 'FCT_SET', [
    'var'            => 'fct',
    'pref'           => 'fct-',
    'gmap_api_key'   => '',
    'fonts' => [
        'all' => '"Raleway", "Open Sans", sans-serif',
        'headings' => '"Raleway", sans-serif',
        //'h1' => '"Poppins", sans-serif',
        //'h2' => '"Poppins", sans-serif',
    ],
    'fonts_external' => '',
    'colors' => [ // can not use 'text', 'background'
        'plain' => '#666666',
        'link' => '#6ea2cc',
        'hover' => '#22323d',
        'headline' => '#60615f',
        'background' => '#83bff1',
        'border-easy' => '#eeeeee',
        'border-divide' => '#dddddd',
        'border-separate' => '#c5c5c5',
        'bg' => [
            'light' => '#83bff1',
            'medium' => '#78b0de',
            'dark' => '#6ea2cc',
        ],
        'gutenberg' => [ // keep the position or add text index index to change globally
            '#ffffff',
            '#000000',
            'bg' => [
                '#f8f9f9',
                '#ffffff',
                '#ababab',
            ]
        ]
    ],
    'font_sizes' => [ 11, 13, 14, 16, 18, 19, 22, 40 ],
    'defer_styles' => [
        'wp-block-library', 'classic-theme-styles'
    ],
    'defer_styles_theme' => true,
    'sections' => [
        'header' => 'Header',
        'footer' => 'Footer',
        'aside-left' => 'Left Sidebar',
        'aside-right' => 'Right Sidebar',
        'aside-bottom' => 'Bottom Sidebar',
    ],
    
]);

define( 'FCT_VER', wp_get_theme()->get( 'Version' ).FCT_DEV ? time() : '' );


add_action( 'after_setup_theme', function() {
	add_theme_support( 'wp-block-styles' );
	add_editor_style( 'editor-style.css' );
	
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'editor-styles' );
	add_theme_support( 'html5', array('style','script', ) );
	add_theme_support( 'automatic-feed-links' );
});

add_action( 'wp_enqueue_scripts', function() {
	wp_enqueue_style( 'style', get_stylesheet_uri(), [], time() );
});

require __DIR__ . '/gutenberg/index.php';
require __DIR__ . '/gutenberg/settings.php';

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
};