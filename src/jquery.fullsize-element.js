/*global jQuery, window*/

(function ($) {
    'use strict';

    /**
     * @typedef {Object} Size
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
     * @param $element
     * @returns Size
     */
    elementSize = function ($element) {
        return {
            width: $element.width(),
            height: $element.height()
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
     * @param {string} valign one of 'top', 'center', 'bottom'
     * @returns {Function}
     */
    createVAligner = function (valign) {
        var aligner;

        valign = $.inArray(valign, ['top', 'center', 'bottom']) !== -1 ? valign : defaultOptions.valign;

        if (valign === 'bottom') {
            aligner = function (height, viewportSize) {
                return -(height - viewportSize.height);
            };
        } else if (valign === 'center') {
            aligner = function (height, viewportSize) {
                return (viewportSize.height - height) / 2;
            };
        } else if (valign === 'top') {
            aligner = function () {
                return 0;
            };
        }

        return aligner;
    };

    /**
     * @param {string} halign one of 'left', 'center', 'right'
     * @returns {Function}
     */
    createHAligner = function (halign) {
        var aligner;

        halign = $.inArray(halign, ['left', 'center', 'right']) !== -1 ? halign : defaultOptions.halign;

        if (halign === 'right') {
            aligner = function (width, viewportSize) {
                return -(width - viewportSize.width);
            };
        } else if (halign === 'center') {
            aligner = function (width, viewportSize) {
                return (viewportSize.width - width) / 2;
            };
        } else if (halign === 'left') {
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

        if (constrainProportions === true) {
            if (fullWidth === true && fullHeight === true) {
                resizer = function (viewportSize, viewportRatio) {
                    var properties = {};

                    if (this.originalRatio < viewportRatio) {
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
            } else if (fullWidth === true) {
                resizer = function (viewportSize) {
                    return {
                        width: viewportSize.width,
                        height: viewportSize.width / originalRatio
                    };
                };
            } else if (fullHeight === true) {
                resizer = function (viewportSize) {
                    return {
                        width: viewportSize.height * this.originalRatio,
                        height: viewportSize.height
                    };
                };
            }
        } else {
            if (fullWidth === true && fullHeight === true) {
                resizer = function (viewportSize) {
                    return {
                        width: viewportSize.width,
                        height: viewportSize.height
                    };
                };
            } else if (fullWidth === true) {
                resizer = function (viewportSize) {
                    return {
                        width: viewportSize.width,
                        height: originalSize.height
                    };
                };
            } else if (fullHeight === true) {
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
                if (listening === false) {
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
            if ($element.get(0).tagName.toLowerCase() === 'img') {
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

    $.fn.fullSizeElement = function (options) {
        options = $.extend({}, defaultOptions, options || {});

        return this.each(function () {
            var $element = $(this),
                $viewport = options.$viewport,
                viewport = $element.data('viewport');

            if (viewport) {
                $viewport = $element.parent().closest(viewport);
            }

            FullSizeElement.factory($(this), ($viewport && $viewport.size()) ? $viewport : $window, options);
        });
    };
}(jQuery));