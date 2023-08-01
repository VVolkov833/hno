(() => {

	const el = wp.element.createElement;
	const InnerBlocks = wp.blockEditor.InnerBlocks;

	wp.blocks.registerBlockType( blockModName, {
		title: 'FCT Cropped Height',
        icon: 'columns',
		category: 'widgets',

		attributes: {
			minHeight: {
				type: 'number'
			},
            maxHeight: {
				type: 'number'
			}
		},

		edit: props => {
            let style = {};
            if ( props.attributes.minHeight ) { style['min-height'] = props.attributes.minHeight+'px'; }
            if ( props.attributes.maxHeight ) { style['max-height'] = props.attributes.maxHeight+'px'; }
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
                                label: 'Min Height (px)',
                                value: props.attributes.minHeight || 300,
                                onChange: value => {
                                    props.setAttributes( { minHeight: value } );
                                },
                                min: 150,
                                max: 600
                            }),
                            el( wp.components.RangeControl, {
                                label: 'Max Height (px)',
                                value: props.attributes.maxHeight || 720,
                                onChange: value => {
                                    props.setAttributes( { maxHeight: value } );
                                },
                                min: 150,
                                max: 3000
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