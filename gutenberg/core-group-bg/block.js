(function () {

    const effected_blocks = ['core/group'];

    // add new settings variables
    wp.hooks.addFilter(
        'blocks.registerBlockType',
        blockName + '-data',
        function (settings, name) {

            if (typeof settings.attributes === 'undefined' || !~effected_blocks.indexOf(name)) { return settings }

            settings.attributes = Object.assign(settings.attributes, {
                curve_top: {
                    type: 'boolean',
                },
                curve_bottom: {
                    type: 'boolean',
                }
            });

            return settings;
        }
    );

    // add the control / input
    const el = wp.element.createElement;
    const toggle = (props, name, label) => {
        return ( props.isSelected && ~effected_blocks.indexOf(props.name) ) ? (
            el(wp.blockEditor.InspectorControls, {},
                el(wp.components.PanelBody, {},
                    el(wp.components.ToggleControl, {
                        label: label,
                        checked: !!props.attributes[name],
                        onChange: function () {
                            //console.log( props.attributes.className );
                            props.setAttributes({ [name]: !props.attributes[name], className: 'ahaha' });
                            console.log( props.attributes.className );
                            //props.setAttributes({ className: updatedClassName });
                            //console.log( props.getAttribute( 'className' ) );
                            //props.setAttributes({ 'data-ahaha': 'ahaha' });
                        }
                    })
                )
            )
        ) : null
    };

    wp.hooks.addFilter(
        'editor.BlockEdit',
        blockName + '-control',
        wp.compose.createHigherOrderComponent(function (BlockEdit) {
            return function (props) {
                return el(
                    wp.element.Fragment,
                    {},
                    el(BlockEdit, props),
                    toggle(props, 'curve_top', 'Apply Top Curve'),
                    toggle(props, 'curve_bottom', 'Apply Bottom Curve')
                );
            };
        })
    );

    // add class name to the output block on save
    wp.hooks.addFilter(
        'blocks.getSaveContent.extraProps',
        blockName + '-save',
        function (extraProps, blockType, attributes) {

            if (!~effected_blocks.indexOf(blockType.name)) { return extraProps }

            const addClass = (classNames, classNameToAdd) => {
                const classes = classNames.split(' ');
                if (!classes.includes(classNameToAdd)) {
                    classes.push(classNameToAdd);
                }
                return [...new Set(classes)].join(' ');
            };

            const removeClass = (classNames, classNameToRemove) => {
                const classes = classNames.split(' ');
                const index = classes.indexOf(classNameToRemove);
                if (index !== -1) {
                    classes.splice(index, 1);
                }
                return classes.join(' ');
            };

            if ( attributes?.curve_top ) {
                extraProps.className = addClass(extraProps.className, 'fct-curve-top');
            }
            if ( attributes?.curve_bottom ) {
                extraProps.className = addClass(extraProps.className, 'fct-curve-bottom');
            }

            return extraProps;
        }
    );

})();