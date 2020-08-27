//Grunt is just JavaScript running in node, after all...
//var Dgeni = require('dgeni');

module.exports = function(grunt) {
    // All upfront config goes in a massive nested object.
    grunt.initConfig({
        // You can set arbitrary key-value pairs.
        distFolder: 'dist',
        // You can also set the value of a key as parsed JSON.
        // Allows us to reference properties we declared in package.json.
        pkg: grunt.file.readJSON('package.json'),
        // Grunt tasks are associated with specific properties.

        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            header: {
                files: {
                    'public/js/imdb-minsafe-header.js': [
                        'public/assets/ui-select2/isteven-multi-select.js',
                        'public/assets/ui-notification/ui-notification.js',
                        'public/assets/ui-select2/isteven-multi-select.js',
                        'public/assets/angular-bootstrap/ui-bootstrap-tpls.js'
                    ]
                }
            },
            footer: {
                files: {
                    'public/js/imdb-minsafe-footer.js': [
                        'public/js/app.js',
                        'public/js/config.js',
                        'public/js/directives.js',
                        'public/js/filters.js',
                        'public/js/services/**/*.js',
                        'public/js/controllers/**/*.js'
                    ]
                }
            }
        },
        concat: {
            header: { //target
                src: ['public/js/imdb-minsafe-header.js'],
                dest: 'public/js/imdb-concat-header.min.js'
            },
            footer: { //target
                src: ['public/js/imdb-minsafe-footer.js'],
                dest: 'public/js/imdb-concat-footer.min.js'
            }
        },
        uglify: {
            header: { //target
                src: ['public/js/imdb-concat-header.min.js'],
                dest: 'public/js/imdb-uglify-header.min.js'
            },
            footer: { //target
                src: ['public/js/imdb-concat-footer.min.js'],
                dest: 'public/js/imdb-uglify-footer.min.js'
            }
        },

        // these names generally match their npm package name.
        cssmin: {
            // Specify some options, usually specific to each plugin.
            options: {
                style: 'compressed',
                sourcemap: true
            },
            assets_css: {
                files: {
                    'public/assets/imdb-assets.min.css': [
                        'public/assets/ui-notification/notification.css',
                        'public/assets/highlight/styles/github.css',
                        'public/assets/ui-select2/isteven-multi-select.css',
                        'public/assets/angular-bootstrap/ui-bootstrap-csp.css',
                        'public/assets/nvd3/build/nv.d3.css',
                        'public/assets/draggable/dragular.css',
                        'public/assets/draggable/examples.css',
                        'public/assets/ng-bs-daterangepicker/bootstrap-daterangepicker/daterangepicker-bs3.css'
                    ]
                }
            }
        },

        watch: {
            js: {
                files:[
                    'public/js/**/*',
                    '!public/js/imdb-minsafe-header.js',
                    '!public/js/imdb-minsafe-footer.js',
                    '!public/js/imdb-concat-header.min.js',
                    '!public/js/imdb-concat-footer.min.js',
                    '!public/js/imdb-uglify-header.min.js',
                    '!public/js/imdb-uglify-footer.min.js'
                ],
                tasks: ['ngAnnotate','concat']
            },

            css: {
                files: [
                    'public/css/common.css'
                ],
                tasks: ['cssmin']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-ng-annotate');

    //grunt.registerTask('dgeni', 'Generate docs via dgeni.', function() {
    //    var done = this.async();
    //    var dgeni = new Dgeni([require('./docs/config')]);
    //    dgeni.generate().then(done);
    //});

    grunt.registerTask('imdb-prod', ['ngAnnotate', 'concat', 'uglify', 'cssmin']);
    grunt.registerTask('imdb', ['ngAnnotate', 'concat',  'cssmin', 'watch']);
};
