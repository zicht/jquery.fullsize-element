// Karma configuration
// Generated on Tue Oct 15 2013 17:47:15 GMT+0200 (CEST)

module.exports = function(config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '../',


        // frameworks to use
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            // dependencies
            {
                pattern: 'bower_components/jquery/jquery.js',
                watched: false,
                served: true,
                included: true
            },
            {
                pattern: 'bower_components/jasmine-jquery/lib/jasmine-jquery.js',
                watched: false,
                served: true,
                included: true
            },
            {
                pattern: 'bower_components/zicht-image-loader-js/dist/image-loader.min.js',
                watched: false,
                served: true,
                included: true
            },

            // fixtures
            {
                pattern: 'test/fixtures/*.html',
                watched: true,
                included: false,
                served: true
            },

            'src/*.js',
            'test/unit/*.js'
        ],


        // list of files to exclude
        exclude: [],


        // do not preprocess anything
        preprocessors: {},


        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['dots', 'junit'],


        junitReporter: {
            outputFile: 'test-results.xml'
        },


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true
    });
};
