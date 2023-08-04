( function( blocks, blockEditor, element, components ) {
	var el = element.createElement;
	var RichText = blockEditor.RichText;
	var MediaUpload = blockEditor.MediaUpload;

	blocks.registerBlockType( 'fcp-gutenberg/team-member', {
		title: 'FCP Team Member',
        icon: 'tagcloud',
        category: 'widgets',
        parent: ['fcp-gutenberg/team'],

		attributes: {
			mediaID: {
				type: 'number'
			},
			mediaURL: {
				type: 'string'
			},
			full_name: {
				type: 'string'
			},
			position: {
				type: 'string'
			},
            
			email: {
				type: 'string'
			},
            xing: {
				type: 'string'
			},
            linkedin: {
				type: 'string'
			},
            github: {
				type: 'string'
			},
            stackoverflow: {
				type: 'string'
			},
            deviantart: {
				type: 'string'
			},
            personal_page: {
				type: 'string'
			}
		},

		edit: function( props ) {
			var attributes = props.attributes;

			var onSelectImage = function( media ) {
				return props.setAttributes( {
					mediaURL: media.sizes.thumbnail ? media.sizes.thumbnail.url : media.url,
					mediaID: media.id,
				} );
			};
            
			return el(
				'div',
				{ className: props.className },
                el(
                    'h3',
                    {},
                    'Team Member Tile'
                ),
                el(
					'div',
					{ className: 'fcp-member-avatar' },
					el( MediaUpload, {
						onSelect: onSelectImage,
						allowedTypes: 'image',
						value: attributes.mediaID,
						render: function( obj ) {
							return el(
								components.Button,
								{
									onClick: obj.open,
								},
								! attributes.mediaID
									? 'Upload Image'
									: el( 'img', { src: attributes.mediaURL } )
							);
						},
					})
				),

				el( RichText, {
					tagName: 'div',
					multiline: [false],
					placeholder: 'Full Name',
					value: attributes.full_name,
					onChange: function( value ) {
						props.setAttributes( { full_name: value } );
					},
                    allowedFormats: ['core/bold', 'core/italic']
				} ),
                el( RichText, {
					tagName: 'div',
					multiline: [false],
					placeholder: 'Position',
					value: attributes.position,
					onChange: function( value ) {
						props.setAttributes( { position: value } );
					},
                    allowedFormats: []
				} ),

                el( 'div',
                    { className: 'fcp-member-socials' },
                    el(
                        'strong',
                        {},
                        'Social Networks:'
                    ),
                    el( RichText, {
                        tagName: 'div',
                        multiline: [false],
                        className: 'fcp-i-email',
                        placeholder: 'Email',
                        value: attributes.email,
                        onChange: function( value ) {
                            props.setAttributes( { email: value } );
                        },
                        allowedFormats: []
                    } ),
                    el( RichText, {
                        tagName: 'div',
                        multiline: [false],
                        className: 'fcp-i-xing',
                        placeholder: 'Xing',
                        value: attributes.xing,
                        onChange: function( value ) {
                            props.setAttributes( { xing: value } );
                        },
                        allowedFormats: []
                    } ),
                    el( RichText, {
                        tagName: 'div',
                        multiline: [false],
                        className: 'fcp-i-linkedin',
                        placeholder: 'LinkedIn',
                        value: attributes.linkedin,
                        onChange: function( value ) {
                            props.setAttributes( { linkedin: value } );
                        },
                        allowedFormats: []
                    } ),
                    el( RichText, {
                        tagName: 'div',
                        multiline: [false],
                        className: 'fcp-i-github',
                        placeholder: 'GitHub',
                        value: attributes.github,
                        onChange: function( value ) {
                            props.setAttributes( { github: value } );
                        },
                        allowedFormats: []
                    } ),
                    el( RichText, {
                        tagName: 'div',
                        multiline: [false],
                        className: 'fcp-i-stackoverflow',
                        placeholder: 'Stackoverflow',
                        value: attributes.stackoverflow,
                        onChange: function( value ) {
                            props.setAttributes( { stackoverflow: value } );
                        },
                        allowedFormats: []
                    } ),
                    el( RichText, {
                        tagName: 'div',
                        multiline: [false],
                        className: 'fcp-i-deviantart',
                        placeholder: 'Deviant Art',
                        value: attributes.deviantart,
                        onChange: function( value ) {
                            props.setAttributes( { deviantart: value } );
                        },
                        allowedFormats: []
                    } ),
                    el( RichText, {
                        tagName: 'div',
                        multiline: [false],
                        className: 'fcp-i-url',
                        placeholder: 'Personal Page',
                        value: attributes.personal_page,
                        onChange: function( value ) {
                            props.setAttributes( { personal_page: value } );
                        },
                        allowedFormats: []
                    } ),
                ),
			);
		},
		save: function( props ) {
            return null;
		},
	} );
} )(
	window.wp.blocks,
	window.wp.blockEditor,
	window.wp.element,
	window.wp.components
);
