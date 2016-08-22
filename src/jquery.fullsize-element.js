/* global jQuery, window*/

(function ($) {
    /**
     * @typedef {object} Size
     * @property {number} width
     * @property {number} height
     */

    var $window = $(window),
        defaultOptions = {
            fullWidth: true,
            fullHeight: true,
            valign: 'center',
            halign: 'center',
            constrainProportions: true
        },
        elementSize,
        elementRatio,
        FullSizeElement,
        createResizer,
        createVAligner,
        createHAligner;

    /**
     * @param {jQuery} $element
     * @returns {Size}
     */
    elementSize = function ($element) {
        return {
            width: $element.outerWidth(true),
            height: $element.outerHeight(true)
        };
    };

    /**
     * If the ratio is greater then 1 then the element is in landscape mode
     * If the ratio is smaller then 1 then the element is in portrait mode
     *
     * @param {Size} size
     * @returns {number}
     */
    elementRatio = function (size) {
        return size.width / size.height;
    };

    /**
     * @param {string} config one of 'top', 'center', 'bottom'
     * @returns {Function}
     */
    createVAligner = function (config) {
        var aligner,
            valign = -1 !== $.inArray(config, ['top', 'center', 'bottom']) ? config : defaultOptions.valign;

        if ('bottom' === valign) {
            aligner = function (height, viewportSize) {
                return -(height - viewportSize.height);
            };
        } else if ('center' === valign) {
            aligner = function (height, viewportSize) {
                return (viewportSize.height - height) / 2;
            };
        } else if ('top' === valign) {
            aligner = function () {
                return 0;
            };
        }

        return aligner;
    };

    /**
     * @param {string} config one of 'left', 'center', 'right'
     * @returns {Function}
     */
    createHAligner = function (config) {
        var aligner,
            halign = -1 !== $.inArray(config, ['left', 'center', 'right']) ? config : defaultOptions.halign;

        if ('right' === halign) {
            aligner = function (width, viewportSize) {
                return -(width - viewportSize.width);
            };
        } else if ('center' === halign) {
            aligner = function (width, viewportSize) {
                return (viewportSize.width - width) / 2;
            };
        } else if ('left' === halign) {
            aligner = function () {
                return 0;
            };
        }

        return aligner;
    };

    /**
     * @param {boolean} constrainProportions
     * @param {boolean} fullWidth
     * @param {boolean} fullHeight
     * @param {Size} originalSize
     * @param {number} originalRatio
     * @returns {Function}
     */
    createResizer = function (constrainProportions, fullWidth, fullHeight, originalSize, originalRatio) {
        var resizer;

        if (true === fullWidth && true === fullHeight) {
            if (true === constrainProportions) {
                resizer = function (viewportSize, viewportRatio) {
                    var properties = {};

                    if (viewportRatio > originalRatio) {
                        // width leading
                        properties.width = viewportSize.width;
                        properties.height = Math.round(viewportSize.width / originalRatio);
                    } else {
                        // height leading
                        properties.width = Math.round(viewportSize.height * originalRatio);
                        properties.height = viewportSize.height;
                    }

                    return properties;
                };
            } else {
                resizer = function (viewportSize) {
                    return {
                        width: viewportSize.width,
                        height: viewportSize.height
                    };
                };
            }
        } else if (true === fullWidth) {
            if (true === constrainProportions) {
                resizer = function (viewportSize) {
                    return {
                        width: viewportSize.width,
                        height: viewportSize.width / originalRatio
                    };
                };
            } else {
                resizer = function (viewportSize) {
                    return {
                        width: viewportSize.width,
                        height: originalSize.height
                    };
                };
            }
        } else if (true === fullHeight) {
            if (true === constrainProportions) {
                resizer = function (viewportSize) {
                    return {
                        width: viewportSize.height * originalRatio,
                        height: viewportSize.height
                    };
                };
            } else {
                resizer = function (viewportSize) {
                    return {
                        width: originalSize.width,
                        height: viewportSize.height
                    };
                };
            }
        }

        return resizer;
    };

    /**
     * @param {jQuery} $element
     * @param {jQuery} $viewport
     * @param {object} options
     * @constructor
     */
    FullSizeElement = function ($element, $viewport, options) {
        this.$element = $element;
        this.$viewport = $viewport;

        this.originalSize = elementSize(this.$element);
        this.originalRatio = elementRatio(this.originalSize);

        this.valigner = createVAligner(options.valign);
        this.haligner = createHAligner(options.halign);
        this.resizer = createResizer(options.constrainProportions, options.fullWidth, options.fullHeight, this.originalSize, this.originalRatio);
    };
    FullSizeElement.prototype = {
        /**
         * Resize the element
         */
        resize: function () {
            var viewportSize = elementSize(this.$viewport),
                viewportRatio = elementRatio(viewportSize),
                properties;

            properties = this.resizer(viewportSize, viewportRatio);
            properties.top = this.valigner(properties.height, viewportSize);
            properties.left = this.haligner(properties.width, viewportSize);
            properties.visibility = 'visible';

            this.$element.css(properties);
        }
    };

    FullSizeElement.factory = (function () {
        var elements = [],
            addResizeListener;

        addResizeListener = (function () {
            var listening = false;

            return function () {
                if (false === listening) {
                    listening = true;

                    $window.on('resize', function () {
                        $.each(elements, function (index, fullSizeElement) {
                            fullSizeElement.resize();
                        });
                    });
                }
            };
        }());

        /**
         * @param {jQuery} $element
         * @param {jQuery} $viewport
         * @param {object} options
         */
        function create($element, $viewport, options) {
            var fullSizeElement = new FullSizeElement($element, $viewport, options);

            fullSizeElement.resize();
            elements.push(fullSizeElement);
            addResizeListener();
        }

        return function ($element, $viewport, options) {
            // if the element is an image it must be preloaded first
            if ('img' === $element.get(0).tagName.toLowerCase()) {
                $element.imagePreloader({
                    finish: function () {
                        create($element, $viewport, options);
                    }
                });
            } else {
                create($element, $viewport, options);
            }
        };
    }());

    $.fn.fullSizeElement = function (config) {
        var options = $.extend({}, defaultOptions, config || {});

        return this.each(function (index, el) {
            var $element = $(el),
                $viewport = options.$viewport,
                viewport = $element.data('viewport');

            if (viewport) {
                $viewport = $element.parent().closest(viewport);
            }

            FullSizeElement.factory($element, ($viewport && $viewport.size()) ? $viewport : $window, options);
        });
    };
}(jQuery));
