module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
    	options:{
    		manage: false
    	},
    	my_target: {
    		files: [{
    			expand: true,
    			cwd: 'js/',
    			src: '**/*.js',
    			dest: 'js'
    		}]
    	}
    },
    cssmin: {
    	my_target: {
    		files: [{
				expand: true,
				cwd: 'css/',
				src: ['*.css', '!*.min.css'],
				dest: 'css/',
				ext: '.min.css'

    		}]
    	}
    },
    htmlmin: {
    	options: {
    		removeComments: true,
    		collapseWhitespace: true
    	},
    	my_target: {
    		files: [{
    			expand: true,
    			cwd: 'src/',
    			src: '**/*.html',
    			dest: 'src/',
    		}]
    	}
    }
  });

  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');

};