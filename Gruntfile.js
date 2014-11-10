module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            options: {
                livereload: true
            },
//            sass: {
//                files: ['design/sass/**/*.{scss,sass}'],
//                tasks: ['sass']
//            },
            publicfolder: {
                files: ['app/public/**.*'],
                tasks:  [ 'restart-web-server' ],
                options: {
                    spawn: true
                }
            }
        },
//        sass: {
//            options: {
//                style: 'expanded',
//                sourcemap: 'none'
//            },
//            dist: {
//                files: {
//                    'app/public/_style/style.css': 'design/sass/style.scss'
//                }
//            }
//        },
        express: {
            webserver: {
                options: {
                    script: 'app/webserver.js'
                }
            }
            // apiserver: {
            //     options: {
            //         script: 'app/apiserver.js'
            //     }
            // }
        }
    });

    //grunt.loadNpmTasks('grunt-contrib-sass');
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

    grunt.registerTask('local', 'start up a local web server', function(target) {
        grunt.task.run([
            'express',
            'watch'
        ]);
    });

};