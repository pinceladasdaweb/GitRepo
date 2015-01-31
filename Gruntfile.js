module.exports = function (grunt) {
    "use strict";

    var pkg = grunt.file.readJSON("package.json");

    grunt.initConfig({
        meta: {
            banner: '/*! '+pkg.name+' '+pkg.version+' | (c) 2015 '+pkg.author+' | '+pkg.licenses[0].type+' License */'
        },
        cssmin: {
            target: {
                files: {
                    'build/gitrepo.min.css': ['lib/*.css']
                }
            }
        },
        uglify: {
            options: {
                banner: '<%= meta.banner %>\n'
            },
            target: {
                files: {
                    'build/gitrepo.min.js': ['lib/gitrepo.js']
                }
            }
        },
        watch: {
            css: {
                files: ['lib/*.css'],
                tasks: ['cssmin'],
                options: {
                    livereload: true,
                },
            },
            js: {
                files: ['lib/gitrepo.js'],
                tasks: ['uglify'],
                options: {
                    livereload: true,
                },
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', [ 'cssmin', 'uglify' ]);
};
