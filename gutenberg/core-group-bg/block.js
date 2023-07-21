( function() {

    const effected_blocks = ['core/group'];
    
    // add new settings variable
    wp.hooks.addFilter(
        'blocks.registerBlockType',
        blockName + '-data',
        function (settings, name) {

            if ( typeof settings.attributes === 'undefined' || !~effected_blocks.indexOf( name ) ) { return settings }

            settings.attributes = Object.assign( settings.attributes, {
                curveTop: {
                    type: 'boolean',
                },
                curveBottom: {
                    type: 'boolean',
                }
            });

            return settings;
        }
    );

    // add the control / input
    const el = wp.element.createElement;
    const toggle = (props, name, label) => {
        return props.isSelected && ~effected_blocks.indexOf( props.name ) ? (
            el( wp.blockEditor.InspectorControls, {},
                el( wp.components.PanelBody, {},
                    el( wp.components.ToggleControl, {
                        label: label,
                        checked: !!props.attributes[name],
                        onChange: function() {
                            console.log( name, props.attributes[name] );
                            props.setAttributes( { [name]: !props.attributes[name] } );
                        }
                    })
                )
            )
        ) : null
    };
    wp.hooks.addFilter(
        'editor.BlockEdit',
        blockName + '-control',
        wp.compose.createHigherOrderComponent( function ( BlockEdit ) {
            return function ( props ) {
                return el(
                    wp.element.Fragment,
                    {},
                    el( BlockEdit, props ),
                    toggle( props, 'curveTop', 'Apply Top Curve' ),
                    toggle( props, 'curveBottom', 'Apply Bottom Curve' )
                );
            };
        })
    );

    // add class name to the output block on save
    wp.hooks.addFilter(
        'blocks.getSaveContent.extraProps',
        blockName + '-save',
        function (extraProps, blockType, attributes) {

            if ( !~effected_blocks.indexOf( blockType.name ) ) { return extraProps }
            if ( typeof attributes.curveTop === 'undefined' || !attributes.curveTop ) { return extraProps }

            extraProps.className = extraProps.className + ' fct-img-to-bg';
            return extraProps;
        }
    );

})();