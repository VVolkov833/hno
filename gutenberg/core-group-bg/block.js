(function () {

    const effected_blocks = ['core/group'];

    const addClass = (classNames, classNameToAdd) => {
        const classes = classNames?.split(' ') || [];
        if (!hasClass(classNameToAdd)) {
            classes.push(classNameToAdd);
        }
        return [...new Set(classes)].join(' ');
    };

    const removeClass = (classNames, classNameToRemove) => {
        const classes = classNames?.split(' ') || [];
        const index = classes.indexOf(classNameToRemove);
        if (~index) {
            classes.splice(index, 1);
        }
        return classes.join(' ');
    };

    const hasClass = (classNames, classNameToCheck) => {
        const classes = classNames?.split(' ') || [];
        if (classes.includes(classNameToCheck)) { return true }
        return false;
    };


    // add new settings variables
    wp.hooks.addFilter(
        'blocks.registerBlockType',
        blockName + '-data',
        function (settings, name) {

            if (typeof settings.attributes === 'undefined' || !~effected_blocks.indexOf(name)) { return settings }

            settings.attributes = Object.assign(settings.attributes, {
                curve_bottom: {
                    type: 'boolean', // ++track on the fly if class name is present?
                },
                shadow: {
                    type: 'boolean',
                }
            });

            return settings;
        }
    );

    // add the control / input
    const el = wp.element.createElement;
    const toggle = (props, name, label) => {
        return (props.isSelected && ~effected_blocks.indexOf(props.name)) ? (
            el(wp.blockEditor.InspectorControls, {},
                el(wp.components.PanelBody, {},
                    el(wp.components.ToggleControl, {
                        label: label,
                        checked: !!props.attributes[name],
                        onChange: function () {
                            const addRemoveClass = !props.attributes[name] ? addClass : removeClass;
                            const newClassName = addRemoveClass(props.attributes.className, prefix + name);
                            props.setAttributes({ [name]: !props.attributes[name], className: newClassName });
                        }
                    })
                )
            )
        ) : null
    };
    const select = (props, name, label, options) => {
        return (
            props.isSelected && ~effected_blocks.indexOf(props.name) ? (
                el(
                    wp.blockEditor.InspectorControls,
                    {},
                    el(
                        wp.components.PanelBody,
                        {},
                        el(wp.components.SelectControl, {
                            label: label,
                            value: props.attributes[name] || 'no-bottom-curve', // Set default value to "No Bottom Curve"
                            options: options,
                            onChange: function (newValue) {
                                let clearedClassName = props.attributes.className;
                                options.forEach(option => {
                                    clearedClassName = removeClass(clearedClassName, prefix+option.value);
                                });
                                const newClassName = addClass(clearedClassName, newValue && prefix+newValue || '');
                                props.setAttributes({ [name]: newValue, className: newClassName });
                            },
                        })
                    )
                )
            ) : null
        );
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
                    select(props, 'curve_bottom', 'Bottom Curve', [
                        { value: '', label: 'No Bottom Curve' },
                        { value: 'curve-1', label: 'Curve 1' },
                        { value: 'curve-2', label: 'Curve 2' },
                        { value: 'curve-3', label: 'Curve 3' },
                    ]),
                    toggle(props, 'shadow', 'Add shadow'),
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

            if (attributes?.curve_top) {
                extraProps.className = addClass(extraProps.className, prefix + 'curve_top');
            }
            if (attributes?.curve_bottom) {
                extraProps.className = addClass(extraProps.className, prefix + 'curve_bottom');
            }

            return extraProps;
        }
    );

})();