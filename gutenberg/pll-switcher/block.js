( function() {
	const el = wp.element.createElement;

	wp.blocks.registerBlockType( 'fct-gutenberg/pll-switcher', {
		title: 'FCT PLL Switcher',
        icon: 'block-default',
		category: 'widgets',
		edit: function( props ) {
			return el(
				'div',
				{ className: props.className },
                'LANGUAGE'
			);
		},
		save: function( props ) {
            return null;
		}
	} );
} )();
