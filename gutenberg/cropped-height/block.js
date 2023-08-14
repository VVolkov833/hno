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
			maxHeight: {
				type: 'number'
			},
            buttonText: {
                type: 'string'
            }
		},

		edit: props => {
            let style = {};
            if ( props.attributes.height ) { style['--height'] = props.attributes.height+'px'; }
            if ( props.attributes.maxHeight ) { style['--max-height'] = props.attributes.maxHeight+'px'; }
            if ( props.attributes.buttonText ) { style['--button-text'] = '"'+props.attributes.buttonText+'"'; }
			return el( 'div',
				{ className: props.className+ ' ' +prefix+'main', style },
				el( InnerBlocks, {
                    allowedBlocks: [
                        'core/heading', 'core/paragraph', 'core/list', 'core/image', 'core/button', 'core/buttons', 'core/table', 'core/separator'
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
                            el( wp.components.RangeControl, {
                                label: 'Max-height extend (px)',
                                value: props.attributes.maxHeight || 800,
                                onChange: value => {
                                    props.setAttributes( { maxHeight: value } );
                                },
                                min: 600,
                                max: 3000
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

// ++ can count the height by js and add it as css variable on ready and resize
// ++ can make a variant with checkbox and label
// ++ can make an option to move everything along with the content reveal
// ++ can optimize the animation, like keep the paddings of inner and move everything to single hover
// ++ can actually make it on basis of core/group