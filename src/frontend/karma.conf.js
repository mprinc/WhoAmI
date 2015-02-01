// Karma configuration
// Generated on Thu Dec 25 2014 11:20:38 GMT-0800 (PST)

module.exports = function(config) {
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',
		// https://github.com/karma-runner/karma/blob/master/docs/config/01-configuration-file.md#browserdisconnecttimeout
		// http://stackoverflow.com/questions/23803585/why-does-chrome-35-disconnect-after-running-my-karma-tests
		browserNoActivityTimeout: 60000,

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: [
			'mocha', 
			'sinon'
			// 'requirejs'
		],

		// list of files / patterns to load in the browser
		files: [
//			'app/js/lib/jointjs/rapid - joint.all.min.js',
			'app/lib/jquery/jquery.js',
			'app/js/lib/jointjs/joint.js',
//			'app/js/lib/jointjs/joint.shapes.devs.js',
			'app/lib/jquery-ui/jquery-ui.js',

			'app/lib/colorpicker/spectrum/spectrum.js',
			'app/js/lib/raphael/raphael.js',
			'app/js/lib/raphael/g.raphael.js',
			'app/js/lib/raphael/g.dot.js',
			'app/js/lib/raphael/g.line.js',
			'app/js/lib/raphael/g.bar.js',
			'app/js/lib/raphael/g.line.js',
			'app/lib/json.human.js/lib/crel.js',
			'app/lib/json.human.js/src/json.human.js',
			'app/lib/jsonpath/json-transform.js',
			'app/js/lib/raphael/g.dot.js',
			'app/js/lib/q/q.js',

			'app/js/bukvik/bukvik.js',
			'app/js/bukvik/dataset/dataset.js',
			'app/js/datatalks/datatalks.js',
			'app/js/datatalks/experiments/experiments.js',
			'app/js/bukvik/**/*.js',
			'app/js/datatalks/**/*.js',

			'app/lib/angular/angular.js',
			'app/lib/angular/angular-*.js',
			'app/lib/angular/ngStorage.js',
			'app/lib/angular/ui-bootstrap-tpls.min.js',
			'app/lib/colorpicker/angular-spectrum-colorpicker.js',
			
			'app/js/config/config.js',
			'app/js/services/datatalks/data.js',
			'app/js/services/experiments.js',
			'app/js/services/experimentAnalysis.js',
			'app/js/services/datasets.js',

			'app/js/directives/dataviews.js',

			'app/js/app.js',

			'node_modules/chai/chai.js',

//			'app/js/**/*.js',
			'test/unit/**/*.spec.js',
			
			// you need to make sure Karma includes the HTML files in the list of files it loads when it runs tests
			'app/partials/**/*.html',

			// testing plugins/libs
			'test/libs/**/*.js'
		],

		// list of files to exclude
		exclude: [
//			'app/js/app.js',
			'app/lib/angular/angular-loader.js',
			'app/lib/angular/*.min.js',
			'app/lib/angular/angular-scenario.js'
		],
		
		plugins: [
			'karma-mocha',
			'karma-sinon',
		    "karma-chrome-launcher",
			'karma-ng-html2js-preprocessor',
			'karma-coverage',
		],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			// Make sure that the relative base path here (and in the next step) and in your templateUrl are the same. 
			// So if your templateUrl is templates/foo.html, make sure you don't have /template/*.html or ../template/*.html 
			// or anything like that here to start off the path.
			'app/partials/**/*.html': ['ng-html2js'],
			
			// source files, that you wanna generate coverage for
			// do not include tests or libraries
			// (these files will be instrumented by Istanbul)
//			'app/js/directives/**/*.js': ['coverage'],
//			'app/js/bukvik/**/*.js': ['coverage'],
//			'app/js/controllers/**/*.js': ['coverage'],
//			'app/js/datatalks/**/*.js': ['coverage'],
//			'app/js/directives/**/*.js': ['coverage'],
//			'app/js/filters/**/*.js': ['coverage'],
//			'app/js/services/**/*.js': ['coverage'],
//			'app/js/app.js': ['coverage']
		},
		
		ngHtml2JsPreprocessor: {
			// In order to match file paths of html documents
			// (like those we require to include through karma config) into in-angular referenced paths, 
			// we need to:
			
			// 1) strip prefix from the file path of html document
			stripPrefix: 'app/',
			// 2) strip sufix from the file path of html document
			stripSufix: '',
			// 3) prepend this to the path
			prependPrefix: '',
			// and now finally we are matching the path that in-angular code 
			// (like directive "templateUrl") will ask for
		},
		
		// optionally, configure the reporter
		coverageReporter: {
			type : 'html',
			dir : 'coverage/'
		},

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['progress', 'coverage'],

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,


		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['Chrome'], // ['Chrome', 'Firefox', 'Safari'],

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false
	});
};
