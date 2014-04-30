# Zicht Full Size Element

This is a plugin to create full size elements.

An element will size itself according to a provided viewport.

Options:

- fullWidth, boolean default to true,
- fullHeight: boolean default to true
- valign: string default to 'center'. Possibilities top/center/bottom
- halign: string default to 'center'. Possibilities left/center/right

The element where the plugin is applied to should have a data-viewport property. This is a css selector that is used
with the jQuery function [.closest()](http://api.jquery.com/closest/). When no viewport is defined the window object
will be used.
If the element is an image it should have the following css:

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

Usage:

```javascript
jQuery(function ($) {
    $('#img-1').fullSizeElement();
});

<div class="viewport">
    <img src="http://lorempixel.com/1024/768/sports/1" data-viewport="div" id="img-1">
</div>
```