describe('A full size element', function () {
    jasmine.getFixtures().fixturesPath = 'base/test/fixtures';

    beforeEach(function () {
        loadFixtures('element.html');

        var $viewport = $('#viewport'),
            $element = $('#element');

        $viewport.css({
            width: 300,
            height: 300
        });

        $element.css({
            width: 30,
            height: 30
        });
    });

    it('the viewport element should be available', function () {
        expect($('#viewport')).toExist();
    });

    it('the full size element should be available', function () {
        expect($('#element')).toExist();
    });
    //
    it('Default it should size to the size of the viewport', function () {
        var $element = $('#element');

        $element.fullSizeElement();

        expect($element.width()).toBe(300);
        expect($element.height()).toBe(300);
    });/**/
    //
    it('Default it should follow the size of the viewport but constrain the proportions', function () {
        var $viewport = $('#viewport'),
            $element = $('#element');

        $viewport.css({
            width: 100
        });
        $element.fullSizeElement();

        expect($element.width()).toBe(300);
        expect($element.height()).toBe(300);
    });/**/
    //
    it('It should follow the size of the viewport when constrainProportions is turned off', function () {
        var $viewport = $('#viewport'),
            $element = $('#element');

        $viewport.css({
            width: 100
        });
        $element.fullSizeElement({
            constrainProportions: false
        });

        expect($element.width()).toBe(100);
        expect($element.height()).toBe(300);
    });/**/
    //
    it('It should align nicely top, right', function () {
        var $viewport = $('#viewport'),
            $element = $('#element');

        $element.fullSizeElement({
            constrainProportions: false,
            fullWidth: false,
            halign: 'right'
        });

        expect($element.position().left).toBe(270);
    });/**/
});