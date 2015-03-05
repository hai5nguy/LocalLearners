module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            options: {
                livereload: true
            },
            sass: {
                files: ['APP/_sass/**/*.{scss,sass}'],
                tasks: ['sass']
            },
            publicfolder: {
                files: ['APP/**'],
                tasks:  [ 'restart-web-server' ],
                options: {
                    nospawn: true
                }
            }
        },
        sass: {
            options: {
                style: 'expanded',
                sourcemap: 'none'
            },
            dist: {
                files: {
                    'app/public/css/style.css': 'APP/_sass/style.scss'
                }
            }
        },
        express: {
            webserver: {
                options: {
                    port: 5000,
                    script: 'APP/webserver.js'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express-server');

//    grunt.registerTask('default', ['sass:dist', 'watch']);
//
    grunt.registerTask('restart-web-server', 'restart web server', function(target) {
        grunt.task.run([
            'express:webserver:stop',
            'express:webserver'
        ]);
    });
//
//    grunt.registerTask('serve', 'start up a local web server', function(target) {
//
//        grunt.task.run([
//            'sass',
//            'express',
//            'watch'
//        ]);
//    });

    grunt.registerTask('default', 'start up a local web server', function (target) {
        grunt.task.run([
            'express',
            'watch'
        ]);
    });

    grunt.registerTask('withsass', 'local web server with sass watch', function (target) {
        grunt.task.run([
            'sass',
            'express',
            'watch'
        ]);
    })

};