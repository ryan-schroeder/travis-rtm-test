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
    },
    shell: {
      integrationStart: {
        command: `| docker-compose run --service-ports --rm integrationtester /bin/bash -c
                  | "node <%= grunt.task.current.args.indexOf('debug') !== -1 ? '--debug-brk=5858' : ''%>
                  | node_modules/grunt-cli/bin/grunt integrationTest"`.replace(/^\s*\|/gm, '').replace(/[\r|\n]+/gm, '').trim(),
        options: {
          callback: (err, stdout, stderr, done) => {
            if (err) {
              // save exit code for after force is in effect
              config.shell.integrationStart.options.callback.err = err
            }
            done()
          },
          execOptions: {
            cwd: 'test/it'
          }
        }
      },
      integrationCleanup: {
        command: 'docker-compose down -v --remove-orphans',
        options: {
          execOptions: {
            cwd: 'test/it'
          }
        }
      }
    }
  }

  console.log(config.shell.integrationStart.command)

  grunt.initConfig(config)

  grunt.loadNpmTasks('grunt-mocha-test')
  grunt.loadNpmTasks('grunt-env')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-mkdir')
  grunt.loadNpmTasks('grunt-exec')
  grunt.loadNpmTasks('grunt-shell')

  grunt.registerTask('forceOff', 'Forces the force flag off', function() {
    grunt.option('force', false)
  })

  grunt.registerTask('forceOn', 'Forces the force flag on', function() {
    grunt.option('force', true)
  })

  grunt.registerTask('test', ['clean:test', 'env:mochaTest', 'mkdir:mochaTest', 'mochaTest:unit'])
  grunt.registerTask('integrationTest', ['clean:test', 'env:integrationMochaTest', 'mkdir:mochaTest', 'mochaTest:integration'])
  grunt.registerTask('integration', ['forceOn', 'shell:integrationStart', 'shell:integrationCleanup', 'forceOff', 'checkIntegrationFail'])
  grunt.registerTask('checkIntegrationFail', 'Checking for integration test failures', function() {
    let err = config.shell.integrationStart.options.callback.err
    if (err) {
      grunt.fail.warn(err, grunt.fail.code.TASK_FAILURE)
    }
  })
}
