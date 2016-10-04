'use strict'

module.exports = function(grunt) {
  
  let config = {
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      test: { folder: 'out/test' }
    },
    env: {
      mochaTest: {
        JUNIT_REPORT_PATH: 'out/test/results.xml'
      },
      integrationMochaTest: {
        JUNIT_REPORT_PATH: 'out/test/integration-results.xml'
      }
    },
    mkdir: {
      mochaTest: {
        options: {
          create: ['out/test']
        }
      }
    },
    mochaTest: {
      unit: {
        options: {
          // writes to file defined in env:mochaTest.
          reporter: 'mocha-jenkins-reporter'
        },
        src: ['test/unit/**/*.js']
      },
      integration: {
        options: {
          // writes to file defined in env:integrationMochaTest.
          reporter: 'mocha-jenkins-reporter'
        },
        src: ['test/it/**/*.js']
      }
    }
  }

  grunt.initConfig(config)

  grunt.loadNpmTasks('grunt-mocha-test')
  grunt.loadNpmTasks('grunt-env')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-mkdir')
  grunt.loadNpmTasks('grunt-exec')
  grunt.loadNpmTasks('grunt-shell')

  grunt.registerTask('test', ['clean:test', 'env:mochaTest', 'mkdir:mochaTest', 'mochaTest:unit'])
}
