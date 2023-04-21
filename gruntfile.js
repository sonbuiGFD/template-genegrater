const sass = require('node-sass');

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      version: '/*! <%= pkg.name %> - v<%= pkg.version %> - built on <%= grunt.template.today("dd-mm-yyyy") %> */\n',
      views: 'views',
      styles: 'styles',
      scripts: 'scripts',
      build: 'build',
    },
    sass: {
      options: {
        implementation: sass,
        sourceMap: false,
      },
      dist: {
        files: {
          '<%= meta.build %>/style.css': '<%= meta.styles %>/style.scss',
        },
      },
    },
    csslint: {
      options: {
        csslintrc: '.csslintrc',
      },
      files: ['<%= meta.build %>/style.css'],
    },
    autoprefixer: {
      options: {
        browsers: ['last 3 versions'],
      },
      files: {
        expand: true,
        src: '<%= meta.build %>/style.css',
      },
    },
    cssmin: {
      options: {
        advanced: false,
        keepBreaks: false,
        keepSpecialComments: 0,
      },
      compress: {
        files: [
          {
            '<%= meta.build %>/style.css': '<%= meta.build %>/style.css',
          },
        ],
      },
    },

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['<%= meta.scripts %>/*.js', '<%= meta.scripts %>/pages/*.js'],
        dest: '<%= meta.build %>/script.js',
      },
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
      },
      files: ['<%= meta.scripts %>/pages/*.js', '<%= meta.scripts %>/*.js'],
    },
    uglify: {
      options: {
        banner: '<%= meta.version %>',
        compress: true,
        beautify: false,
        preserveComments: false,
      },
      build: {
        src: '<%= meta.build %>/script.js',
        dest: '<%= meta.build %>/script.min.js',
      },
    },

    watch: {
      options: {
        spawn: false,
        interrupt: false,
        livereload: true,
      },
      less: {
        files: ['<%= meta.styles %>**/*.scss', '<%= meta.styles %>/*.scss'],
        tasks: ['sass', 'autoprefixer', 'csslint'],
      },
      js: {
        files: ['<%= meta.scripts %>pages/*.js', '<%= meta.scripts %>*.js'],
        tasks: ['jshint', 'concat'],
      },
      html: {
        files: ['<%= meta.views %>/**/*.ejs'],
        tasks: [],
      },
    },
    clean: {
      options: {
        force: true,
      },
      build: ['build'],
    },
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('build', ['clean', 'concat', 'sass', 'autoprefixer', 'jshint', 'csslint']);
  grunt.registerTask('min', ['clean', 'build', 'uglify', 'cssmin']);
  grunt.registerTask('default', ['build', 'watch']);
};
