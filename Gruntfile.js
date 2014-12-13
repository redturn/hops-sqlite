module.exports = function(grunt) {
  
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.initConfig({
    jshint: {
      grunt: {
        options: {
          'laxcomma': true
        },
        src: [ 'Gruntfile.js' ]
      },
      lib: {
        options: {
          'laxcomma': true
        },
        src: [ 'lib/**/*.js' ]
      },
      test: {
        options: {
          'laxcomma': true,
          'expr': true
        },
        src: [ 'test/**/*.js' ]
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: [ 'test/**/*.js' ]
      }
    }
  });

  grunt.registerTask('test', [ 'mochaTest' ]);
  grunt.registerTask('validate', [ 'jshint', 'test' ]);

};