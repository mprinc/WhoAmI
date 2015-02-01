module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			// define the files to lint
			files: ['gruntfile.js', 'app/js/**/*.js', '!app/js/lib/**/*.js'],
			// ignores: ['app/js/lib/**/*.js'],
			// configure JSHint (documented at http://www.jshint.com/docs/)
			options: {
				laxcomma: true, // http://jshint.com/docs/options/#laxcomma
				newcap: false, // http://jshint.com/docs/options/#newcap
				// more options here if you want to override JSHint defaults
				globals: {
					jQuery: true,
					console: true,
					module: true
				}
			}
		},
		compass: {
			dist: { // target
				options: { // Target options
					// config: 'config/config.rb',
					sassDir: 'sass',
					cssDir: 'css',
					environment: 'production'
				}
			},
			dev: { // Another target
				options: {
					sassDir: ['sass'],
					cssDir: ['css'],
					environment: 'development'
				}
			}
		},
		concat: {
			// https://www.npmjs.com/package/grunt-contrib-concat
			// http://gruntjs.com/configuring-tasks#globbing-patterns
			options: {
				// define a string to put between each file in the concatenated output
				separator: grunt.util.linefeed // ';' // https://github.com/gruntjs/grunt-contrib-concat#separator
			},
			dist: {
				// the files to concatenate
				src: [
					'app/js/**/*.js',
					'!app/js/lib/**/*.js'
				],
				// the location of the resulting JS file
				dest: 'dist/<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				src: 'dist/<%= pkg.name %>.js',
				dest: 'build/<%= pkg.name %>.min.js'
			}
		},
		watch: {
			js: {
				files: ['<%= jshint.files %>'],
				tasks: ['jshint'/*, 'qunit' */]
			},
			css: {
				files: ['**/*.{scss,sass}'],
				tasks: ['compass:dev']
			}
		}
	});
	
	// Load plugins that provides the "uglify", ... tasks
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compass');
	
	// Default task(s).
	grunt.registerTask('default', ['jshint', 'compass', 'concat', 'uglify']);
	grunt.registerTask('build', ['jshint', 'compass', 'concat', 'uglify', 'compass:dist']);
	grunt.registerTask('test', ['jshint', /* 'qunit'*/]);
};

