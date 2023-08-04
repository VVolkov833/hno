(() => {

	const el = wp.element.createElement;
	const InnerBlocks = wp.blockEditor.InnerBlocks;
    const TextControl = wp.components.TextControl;

	wp.blocks.registerBlockType( blockModName, {
		title: 'FCT Cropped Height',
        icon: 'columns',
		category: 'widgets',

		attributes: {
			height: {
				type: 'number'
			},
            buttonText: {
                type: 'string'
            }
		},

		edit: props => {
            let style = {};
            if ( props.attributes.height ) { style['--height'] = props.attributes.height+'px'; }
            if ( props.attributes.buttonText ) { style['--button-text'] = '"'+props.attributes.buttonText+'"'; }
			return el( 'div',
				{ className: prefix+'main', 'style': style },
				el( InnerBlocks, {
                    allowedBlocks: [
                        'core/heading', 'core/paragraph', 'core/image', 'core/button'
                    ],
                    template: [
                        [ 'core/heading', {} ],
                        [ 'core/paragraph', {} ],
                        [ 'core/button', {} ]
                    ],
                    templateLock: false
                }),
                el( // sidebar
                    wp.element.Fragment,
                    {},
                    el( wp.blockEditor.InspectorControls, {},
                        el( wp.components.PanelBody, {},
                            el( wp.components.RangeControl, {
                                label: 'Height (px)',
                                value: props.attributes.height || 300,
                                onChange: value => {
                                    props.setAttributes( { height: value } );
                                },
                                min: 100,
                                max: 800
                            }),
                            el( TextControl, {
                                label: 'Button Text',
                                placeholder: 'Ausklappen',
                                value: props.attributes.buttonText,
                                onChange: function( value ) {
                                    props.setAttributes( { buttonText: value } );
                                }
                            })
                        )
                    )
                )
			);
		},
		save: props => {
			return el( InnerBlocks.Content );
		},
	} );
})();

// ++ can actually make it on basis of core/group