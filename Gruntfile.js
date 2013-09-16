module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: {
				curly:    false, // true: force { }
				eqnull:   true,  // true: enable something == null
				eqeqeq:   false, // true: force ===
				immed:    true,  // true: immidiatly invocated fns has to be in ()
				newcap:   true,  // true: construcotr has to have firt letter uppercased
				noarg:    true,  // true: no arguments.caller and arguments.callee
				sub:      true,  // true: no warning about a['something'] if a.something can be used
				undef:    true,  // true: can't use undeclared vars
				browser:  true,  // true: set window object and other stuff as globals
				devel:    true,  // true: set alert,confirm,console,... as globals
				boss:     true,  // true: allow assigments in conditions and return statements
				forin:    true,  // true: hasOwnProperty has to be in all for..in cycles
				noempty:  true,  // true: no empty blocks
				unused:   true,  // true: warn about unused vars
				trailing: true,  // true: no trailing whitespaces
				supernew: true,  // true: enable 'new Constructor' instead of 'new Constructor()' 
				onevar:   false, // true: only one var per fn
				funcscope: false,   // no 'var' in blocks
				maxdepth: 5,        // max nesting depth
				quotmark: 'single', // single: force '
				globals: {
					app: true,
					bg: true,
					chrome: false,
					define: false,
					require: false,
					requestAnimationFrame: true
				}
			},
			files: ['scripts/app/*.js', 'scripts/app/**/*.js']
		}
	});

	// Load the plugin that provides the 'uglify' task.
	grunt.loadNpmTasks('grunt-contrib-jshint');

	// Default task(s).
	grunt.registerTask('default', ['jshint']);

};