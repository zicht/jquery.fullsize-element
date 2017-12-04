# Zicht Full Size Element

This is a plugin to create full size elements.

An element will size itself according to a provided viewport.

## Options

- fullWidth, boolean default to true,
- fullHeight: boolean default to true
- valign: string default to `center`. Possibilities `top`, `center` or `bottom`
- halign: string default to `center`. Possibilities `left`, `center` or `right`

The element where the plugin is applied to should have a data-viewport property. This is a css selector that is used
with the jQuery function [.closest()](http://api.jquery.com/closest/). When no viewport is defined the window object
will be used.

## Required CSS

### Import the included Sass file

Import the Sass file that's installed with this package into your project. It’s located at `~/scss/objects/_fullsize-element.scss`.

### Or, apply it manually

```css
img {
    position: absolute;
    visibility: hidden;
}
```

The image will be visible when finished preloading.

The viewport should have the following css:

```css
.viewport {
    position: relative;
    overflow: hidden;
}
```

## Usage

```javascript
jQuery(function ($) {
    $('.js-fullsize-element').fullSizeElement();
});

<div class="o-full-size-element">
    <img class="o-full-size-element__image  js-fullsize-element" src="http://lorempixel.com/1024/768/sports/1" data-viewport=".o-full-size-element">
</div>
```

# Maintainer
* Boudewijn Schoon <boudewijn@zicht.nl>
