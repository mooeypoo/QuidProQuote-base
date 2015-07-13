/*global module:false*/
module.exports = function ( grunt ) {
	// Project configuration.

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-jscs');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-simple-mocha');
//	grunt.loadNpmTasks('grunt-jsduck');

	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON( 'package.json' ),
		// Task configuration.
		concat: {
			dist: {
				src: [
					'src/qpq.js',
					'src/module.exports.js',
					'src/mixins/qpq.mixin.List.js',
					'src/mixins/qpq.mixin.RatedItem.js',
					'src/structure/qpq.struct.Item.js',
					'src/structure/qpq.struct.Quote.js',
					'src/structure/qpq.struct.Collection.js',
					'src/qpq.CollectionManager.js'
				],
				dest: 'dist/QuidProQuote.dist.js'
			}
		},
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				unused: true,
				boss: true,
				eqnull: true,
				browser: true,
				globals: {}
			},
			gruntfile: {
				src: 'Gruntfile.js'
			}
		},
		jscs: {
			dist: [ 'src/js/*.js', 'src/js/**/*.js' ],
			options: {
				config: '.jscs.json'
			}
		},
		simplemocha: {
			options: {
				globals: [ 'expect' ],
				timeout: 3000,
				ignoreLeaks: false,
				ui: 'bdd',
				reporter: 'tap'
			},
			all: { src: [ 'test/*.js' ] }
		}
	} );

	// Default task.
	grunt.registerTask( 'default', [ 'jshint', 'jscs', 'concat', 'simplemocha' ] );
	grunt.registerTask( 'test', [ 'simplemocha' ] );
	// Build
	grunt.registerTask( 'build', [ 'jshint', 'jscs', 'concat' ] );
};
