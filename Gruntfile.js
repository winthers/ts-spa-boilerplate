
var fs = require('fs');
var _ = require("underscore");

module.exports = function (grunt) {
	
	grunt.initConfig({

		sass: {
	    	build: {
				options: { style: 'expanded', lineNumbers: true },
	      		files: 	 { './build/assets/css/main.css': './src/assets/sass/main.scss' }
	    	},
			release: {
				options: { style: 'compressed', lineNumbers: false },
	      		files: 	 { './build/assets/css/main.css': './src/assets/sass/main.scss' }
			}
	  	},

		copy: {
			typesMarionette: {
				src:"typings/backbone.marionette/index.d.ts",
				dest: "node_modules/@types/backbone.marionette/index.d.ts"
			},
			typesBackbone: {
				src:"typings/backbone/index.d.ts",
				dest: "node_modules/@types/backbone/index.d.ts"
			},
			config: {
				src: "src/config.js",
				dest: "build/config.js"
			},
			/* Add more asset types as needed */
			img: {
				files: [
					{ expand: true,  src: "src/assets/img/*", dest: "build/assets/img", flatten: true }
				]
			},
			font: {
				files: [
					{ expand: true,  src: "src/assets/font/*", dest: "build/asset/font/", flatten: true }
				]
	  		}
		},

	

		concat: {},

		clean: {
			release: ["build/bundle.js"],
			build: ["build/bundle.min.js"]
		},

		browserify: {
		    main: {
		        src:  'src/main.ts',
		        dest: 'build/bundle.js',
		    },
		    options: {
		        browserifyOptions: {
		            debug: true
		        },
		        configure: function (bundler) {
		            bundler.plugin(require('tsify'));
		            bundler.on('error', function (error) { console.error(error.toString()); })
		            bundler.transform(require('babelify'), {
		                presets: ['es2015'],
		                extensions: ['.ts']
		            });
		        }
		    }
		},

		uglify: {
			bundle: {
				files: {
					'build/bundle.min.js': ['build/bundle.js']
				}
			}
		}

		
	});

	
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-browserify');

	// Custom tasks 

	/**
	 * @description 
	 * Bumps/incriments the build (major.minor.build) version in the package.json
	 * major, minor should manuel be sat.
	 */ 
	grunt.registerTask("versionbump", "versionbump", function () {
		var objPackage = grunt.file.readJSON('package.json');

		var version = objPackage.version.split(".");

		var major = parseInt(version[0]);
		var minor = parseInt(version[1]);
		var build = parseInt(version[2]);

		build ++;


		objPackage.version = [major, minor, build].join(".");

		console.log("version bumped to: ", objPackage.version);
		grunt.file.write('package.json', JSON.stringify(objPackage));
	});


	/** @description Proccesses the index.html and enables underscore template features. */
	grunt.registerTask("process-view-template", "process-view-template", function (enviroment) {
		
		var tplIndex   = grunt.file.read("src/index.html");
		var objPackage = grunt.file.readJSON('package.json');
		
		var templateData = {
			title: objPackage.title,
			version: objPackage.version,
			isDevEnviroment: enviroment == "dev" ? true : false
		};

		var renderedTemplate = grunt.template.process(tplIndex, {data: templateData});
		grunt.file.write("build/index.html", renderedTemplate);
	});


	/** Tasks Registered   */

	grunt.registerTask("build", 	["sass:build",   "copy", "versionbump", "process-view-template:dev", "browserify", "clean:build"]);
	grunt.registerTask("release", 	["sass:release", "copy", "versionbump", "process-view-template", 	 "browserify", "uglify", "clean:release"]);
}