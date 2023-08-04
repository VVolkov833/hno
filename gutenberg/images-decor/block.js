(() => {

	const el = wp.element.createElement;
	const InnerBlocks = wp.blockEditor.InnerBlocks;
    //const TextControl = wp.components.TextControl;
    const Button = wp.components.Button;
	const RichText = wp.blockEditor.RichText;
	const MediaUpload = wp.blockEditor.MediaUpload;


	wp.blocks.registerBlockType( blockModName, {
		title: 'Decor with Images',
        icon: 'columns',
		category: 'widgets',

		attributes: {
            sepia: {
                type: 'number'
            },
			media1ID: {
				type: 'number'
			},
			media1URL: {
				type: 'string'
			},
			media1Caption: {
				type: 'string'
			},
			media2ID: {
				type: 'number'
			},
			media2URL: {
				type: 'string'
			},
			media2Caption: {
				type: 'string'
			},
            media3ID: {
				type: 'number'
			},
			media3URL: {
				type: 'string'
			},
			media3Caption: {
				type: 'string'
			},
            media4ID: {
				type: 'number'
			},
			media4URL: {
				type: 'string'
			},
			media4Caption: {
				type: 'string'
			},
		},

		edit: props => {

			const onSelectImage = media => {
				return props.setAttributes( {
					media1URL: media.sizes.thumbnail ? media.sizes.thumbnail.url : media.url,
					media1ID: media.id,
				});
			};
            
			return el(
				'div',
				{ className: props.className+ ' ' +prefix+'main' },
                el(
					'figure',
					{},
					el( MediaUpload, {
						onSelect: onSelectImage,
						allowedTypes: 'image',
						value: props.attributes.media1ID,
						render: obj => {
							return el(
								Button,
								{
									onClick: obj.open,
								},
								! props.attributes.media1ID
									? 'Image'
									: el( 'img', { src: props.attributes.media1URL } )
							);
						},
					}),
                    el( RichText, {
                        tagName: 'figcaption',
                        placeholder: 'Caption',
                        value: props.attributes.media1Caption,
                        onChange: value => {
                            props.setAttributes( { media1Caption: value } );
                        },
                        allowedFormats: ['core/bold', 'core/italic']
                    }),
                ),
                el( // sidebar
                    wp.element.Fragment,
                    {},
                    el( wp.blockEditor.InspectorControls, {},
                        el( wp.components.PanelBody, {},
                            el( wp.components.RangeControl, {
                                label: 'Sepia effect (%)',
                                value: props.attributes.sepia || 0,
                                onChange: value => {
                                    props.setAttributes( { sepia: value } );
                                },
                                min: 0,
                                max: 100
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

// ++ sidebar to turn on sepia
