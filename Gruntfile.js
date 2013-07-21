'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function(connect, dir) {
    return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'
// templateFramework: 'handlebars'

module.exports = function(grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var yeomanConfig = {
        tpl: 'app/templates',
        app: 'app',
        mobile: 'smartphone',
        dist: 'static'
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        secret: grunt.file.readJSON('config/secret.json'),
        app: grunt.file.readJSON('config/app.json'),
        yeoman: yeomanConfig,
        sshexec: {
            api: {
                command: '<%= secret.api.command %> <%= app.name %>',
                options: {
                    host: '<%= secret.api.url %>',
                    username: '<%= secret.api.username %>',
                    password: '<%= secret.api.password %>'
                }
            },
            pull: {
                command: 'cd <%= app.path %> && git status',
                options: {
                    host: '<%= secret.host %>',
                    username: '<%= secret.username %>',
                    password: '<%= secret.password %>'
                }
            }
        },
        livereload: {
            port: 35728
        },
        watch: {
            coffee: {
                files: ['<%= yeoman.app %>/static/js/{,*/}*.coffee'],
                tasks: ['coffee:dist']
            },
            coffeeTest: {
                files: ['test/spec/{,*/}*.coffee'],
                tasks: ['coffee:test']
            },
            less: {
                files: ['<%= yeoman.app %>/static/less/{,*/}*.less'],
                tasks: ['less:dev']
            },
            'string-replace': {
                files: ['<%= yeoman.app %>/templates/*.{html,htm}'],
                tasks: ['copy:dev', 'string-replace:dev', 'preprocess:dev']
            },
            livereload: {
                files: [
                    '{.tmp,<%= yeoman.app %>}/*.{html,htm}',
                    '{.tmp,<%= yeoman.app %>}/static/css/{,*/}*.css',
                    '{.tmp,<%= yeoman.app %>}/static/js/{,*/}*.js',
                    '<%= yeoman.app %>/static/img/{,*/}*.{png,jpg,jpeg,gif,webp}'
                ],
                tasks: ['livereload']
            },
            handlebars: {
                files: [
                    '<%= yeoman.app %>/static/tpl/*.hbs'
                ],
                tasks: ['handlebars']
            }
        },
        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: '<%= app.dev.host %>'
            },
            livereload: {
                options: {
                    middleware: function(connect) {
                        return [lrSnippet, mountFolder(connect, '.tmp'), mountFolder(connect, 'app')];
                    }
                }
            },
            test: {
                options: {
                    middleware: function(connect) {
                        return [mountFolder(connect, '.tmp'), mountFolder(connect, 'test')];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function(connect) {
                        return [mountFolder(connect, 'static')];
                    }
                }
            }
        },
        less: {
            dev: {
                files: [{
                    '.tmp/static/css/aplication.css': '<%= yeoman.app %>/static/less/aplication.less'
                }, {
                    '.tmp/static/css/bootmetro.css': '<%= yeoman.app %>/static/less/bootmetro/bootmetro.less'
                }, {
                    '.tmp/static/css/bootmetro-responsive.css': '<%= yeoman.app %>/static/less/bootmetro/responsive.less'
                }, {
                    '.tmp/static/css/bootmetro-icons.css': '<%= yeoman.app %>/static/less/bootmetro/bootmetro-icons.less'
                }, {
                    '.tmp/static/css/bootmetro-icons-ie7.css': '<%= yeoman.app %>/static/less/bootmetro-icons-ie7.less'
                }, {
                    '.tmp/static/css/bootmetro-ui-light.css': '<%= yeoman.app %>/static/less/bootmetro/bootmetro-ui-light.less'
                }],
                options: {
                    paths: ['<%= yeoman.app %>/static/less']
                }
            },
            dist: {
                options: {
                    paths: ['<%= yeoman.app %>/static/less'],
                    yuicompress: true
                },
                files: [{
                    '.tmp/static/css/aplication.css': '<%= yeoman.app %>/static/less/aplication.less'
                }, {
                    'static/css/bootmetro.css': '<%= yeoman.app %>/static/less/bootmetro/bootmetro.less'
                }, {
                    'static/css/bootmetro-responsive.css': '<%= yeoman.app %>/static/less/bootmetro/responsive.less'
                }, {
                    'static/css/bootmetro-icons.css': '<%= yeoman.app %>/static/less/bootmetro/bootmetro-icons.less'
                }, {
                    'static/css/bootmetro-icons-ie7.css': '<%= yeoman.app %>/static/less/bootmetro-icons-ie7.less'
                }, {
                    'static/css/bootmetro-ui-light.css': '<%= yeoman.app %>/static/less/bootmetro/bootmetro-ui-light.less'
                }]
            }
        },
        manifest: {
            generate: {
                options: {
                    basePath: 'public',
                    cache: ['js/app.js', 'css/style.css'],
                    network: ['http://*', 'https://*'],
                    fallback: ['/ /offline.html'],
                    //exclude: ['js/jquery.min.js'],
                    preferOnline: true,
                    verbose: true,
                    timestamp: true
                },
                src: [
                    'some_files/*.html',
                    'static/js/*.min.js',
                    'static/css/*.css'
                ],
                dest: 'manifest.appcache'
            }
        },
        open: {
            server: {
                path: 'http://<%= connect.options.hostname %>:<%= connect.options.port %>'
            }
        },
        clean: {
            tmp: ['.tmp/*.html', '.tmp/tpl', '.tmp/<%= yeoman.mobile %>'],
            dist: ['.tmp', 'dist'],
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            dev: [
                'Gruntfile.js',
                './tmp/static/js/{,*/}*.js'
            ],
            all: [
                'Gruntfile.js',
                './tmp/static/js/{,*/}*.js',
                '<%= yeoman.app %>/static/js/{,*/}*.js',
                '!<%= yeoman.app %>/static/js/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://localhost:<%= connect.options.port %>/index.html']
                }
            }
        },
        coffee: {
            dist: {
                files: [{
                    // rather than compiling multiple files here you should
                    // require them into your main .coffee file
                    expand: true,
                    cwd: '<%= yeoman.app %>/static/js',
                    src: '*.coffee',
                    dest: '.tmp/static/js',
                    ext: '.js'
                }]
            },
            test: {
                files: [{
                    expand: true,
                    cwd: '.tmp/spec',
                    src: '*.coffee',
                    dest: 'test/spec'
                }]
            }
        },
        shell: {
            tpl: {
                command: '1',
                options: {
                    stdout: true
                }
            },
            api: {
                command: '1',
                options: {
                    stdout: true
                }
            },
            runserver: {
                command: 'python manage.py runserver_plus 127.0.0.1:9000',
                options: {
                    stdout: true
                }
            },
            syncdb: {
                command: 'python manage.py syncdb --migrate',
                options: {
                    stdout: true
                }
            },
            collectstatic: {
                command: 'python manage.py collectstatic -v 0 --clear --noinput',
                options: {
                    stdout: true
                }
            },
            compress: {
                command: 'python manage.py compress --force',
                options: {
                    stdout: true
                }
            },
            trans: {
                command: 'python manage.py update_translation_fields',
                options: {
                    stdout: true
                }
            }
        },
        preprocess: {
            dev: {
                options: {
                    context: {
                        DEBUG: true,
                        MOBILE: false,
                        APP_TYPE: 'dev'
                    }
                },
                files: {
                    '.tmp/index.html': '.tmp/tpl/<%= yeoman.app %>/templates/tpl-home.html',
                    '.tmp/default.html': '.tmp/tpl/<%= yeoman.app %>/templates/tpl-default.html',
                    '.tmp/contact.html': '.tmp/tpl/<%= yeoman.app %>/templates/tpl-contact.html',
                    '.tmp/home.html': '.tmp/tpl/<%= yeoman.app %>/templates/base.html',
                    '.tmp/gallery.html': '.tmp/tpl/<%= yeoman.app %>/templates/tpl-imagestore.html',
                    '.tmp/sidebar.html': '.tmp/tpl/<%= yeoman.app %>/templates/tpl-page-sidebar.html',
                    '.tmp/page.html': '.tmp/tpl/<%= yeoman.app %>/templates/tpl-page.html'
                }
            },
            devmob: {
                options: {
                    context: {
                        DEBUG: true,
                        MOBILE: true,
                        APP_TYPE: 'dev'
                    }
                },
                files: {
                    '.tmp/index.html': '.tmp/tpl/<%= yeoman.app %>/templates/tpl-home.html',
                    '.tmp/default.html': '.tmp/tpl/<%= yeoman.app %>/templates/tpl-default.html',
                    '.tmp/contact.html': '.tmp/tpl/<%= yeoman.app %>/templates/tpl-contact.html',
                    '.tmp/home.html': '.tmp/tpl/<%= yeoman.app %>/templates/base.html',
                    '.tmp/gallery.html': '.tmp/tpl/<%= yeoman.app %>/templates/tpl-imagestore.html',
                    '.tmp/sidebar.html': '.tmp/tpl/<%= yeoman.app %>/templates/tpl-page-sidebar.html',
                    '.tmp/page.html': '.tmp/tpl/<%= yeoman.app %>/templates/tpl-page.html'
                }
            },
            imagestore: {
                options: {
                    context: {
                        DEBUG: false,
                        MOBILE: false,
                        APP_TYPE: 'production'
                    }
                },
                files: {
                    '.tmp/imagestore/album_list.html': '.tmp/tpl/<%= yeoman.app %>/templates/imagestore-album_list.htm',
                    '.tmp/imagestore/image_list.html': '.tmp/tpl/<%= yeoman.app %>/templates/imagestore-image_list.htm'
                }
            },
            dist: {
                options: {
                    context: {
                        DEBUG: false,
                        MOBILE: false,
                        APP_TYPE: 'production'
                    }
                },
                files: {
                    '.tmp/tpl-home.html': '.tmp/tpl/<%= yeoman.app %>/templates/tpl-home.html',
                    '.tmp/tpl-default.html': '.tmp/tpl/<%= yeoman.app %>/templates/tpl-default.html',
                    '.tmp/tpl-edit.html': '.tmp/tpl/<%= yeoman.app %>/templates/tpl-edit.html',
                    '.tmp/tpl-contact.html': '.tmp/tpl/<%= yeoman.app %>/templates/tpl-contact.html',
                    '.tmp/base.html': '.tmp/tpl/<%= yeoman.app %>/templates/base.html',
                    '.tmp/tpl-imagestore.html': '.tmp/tpl/<%= yeoman.app %>/templates/tpl-imagestore.html',
                    '.tmp/tpl-page-sidebar.html': '.tmp/tpl/<%= yeoman.app %>/templates/tpl-page-sidebar.html',
                    '.tmp/tpl-page.html': '.tmp/tpl/<%= yeoman.app %>/templates/tpl-page.html'
                }
            },
            mobile: {
                options: {
                    context: {
                        DEBUG: false,
                        MOBILE: true,
                        APP_TYPE: 'production'
                    }
                },
                files: {
                    '.tmp/<%= yeoman.mobile %>/base.html': '.tmp/tpl/<%= yeoman.mobile %>/<%= yeoman.app %>/templates/base.html'
                }
            }
        },
        'string-replace': {
            devmob: {
                files: {
                    '.tmp/tpl/': '<%= yeoman.app %>/templates/{,*/}*.{html,htm}'
                },
                options: {
                    replacements: [{
                        pattern: '{{ LANGUAGE_CODE }}',
                        replacement: 'ru'
                    }, {
                        pattern: /{# (.*?) #}/ig,
                        replacement: ''
                    }, {
                        pattern: /{% load (.*?) %}/ig,
                        replacement: ''
                    }, {
                        pattern: /{% trans '(.*?)' %}/ig,
                        replacement: '$1'
                    }, {
                        pattern: /{% itrans '(.*?)' %}/ig,
                        replacement: '$1'
                    }, {
                        pattern: /{% trans "(.*?)" %}/ig,
                        replacement: '$1'
                    }, {
                        pattern: /{% itrans "(.*?)" %}/ig,
                        replacement: '$1'
                    }, {
                        pattern: /{{ (.*?) }}/ig,
                        replacement: '$1'
                    }, {
                        pattern: /{# (.*?) #}/ig,
                        replacement: ''
                    }, {
                        pattern: /{% static '(.*?)' %}/ig,
                        replacement: 'static/$1'
                    }, {
                        pattern: /{% (csrf_token|endcompress|endcache|else|endif|endfor|inplace_toolbar) %}/ig,
                        replacement: ''
                    }, {
                        pattern: /{% (url|include|block|endblock|cache|endcache|compress|endcompress|if|for|extends|show_page_content|show_content) (.*?) %}/ig,
                        replacement: ''
                    }, {
                        pattern: /@@(.*?)@@/ig,
                        replacement: '$1-mobile'
                    }]
                }
            },
            dev: {
                files: {
                    '.tmp/tpl/': '<%= yeoman.app %>/templates/{,*/}*.{html,htm}'
                },
                options: {
                    replacements: [{
                        pattern: '{{ LANGUAGE_CODE }}',
                        replacement: 'ru'
                    }, {
                        pattern: /{# (.*?) #}/ig,
                        replacement: ''
                    }, {
                        pattern: /{% load (.*?) %}/ig,
                        replacement: ''
                    }, {
                        pattern: /{% trans '(.*?)' %}/ig,
                        replacement: '$1'
                    }, {
                        pattern: /{% itrans '(.*?)' %}/ig,
                        replacement: '$1'
                    }, {
                        pattern: /{% trans "(.*?)" %}/ig,
                        replacement: '$1'
                    }, {
                        pattern: /{% itrans "(.*?)" %}/ig,
                        replacement: '$1'
                    }, {
                        pattern: /{{ (.*?) }}/ig,
                        replacement: '$1'
                    }, {
                        pattern: /{# (.*?) #}/ig,
                        replacement: ''
                    }, {
                        pattern: /{% static '(.*?)' %}/ig,
                        replacement: 'static/$1'
                    }, {
                        pattern: /{% (csrf_token|endcompress|endcache|else|endif|endfor|inplace_toolbar) %}/ig,
                        replacement: ''
                    }, {
                        pattern: /{% (url|include|block|endblock|cache|endcache|compress|endcompress|if|for|extends|show_page_content|show_content) (.*?) %}/ig,
                        replacement: ''
                    }, {
                        pattern: /@@(.*?)@@/ig,
                        replacement: '$1'
                    }]
                }
            },
            dist: {
                files: {
                    '.tmp/tpl/': '<%= yeoman.app %>/templates/{,*/}*.{html,htm}'
                },
                options: {
                    replacements: [{
                        pattern: /{% static '(.*?)' %}/ig,
                        replacement: 'static/$1'
                    }, {
                        pattern: /bower_components\//ig,
                        replacement: '../app/bower_components/'
                    }, {
                        pattern: /@@(.*?)@@/ig,
                        replacement: '$1'
                    }]
                }
            },
            mobile: {
                files: {
                    '.tmp/tpl/<%= yeoman.mobile %>/': '<%= yeoman.app %>/templates/{,*/}*.{html,htm}'
                },
                options: {
                    replacements: [{
                        pattern: /{% static '(.*?)' %}/ig,
                        replacement: 'static/$1'
                    }, {
                        pattern: /bower_components\//ig,
                        replacement: '../app/bower_components/'
                    }, {
                        pattern: /@@(.*?)@@/ig,
                        replacement: '$1-mobile'
                    }]
                }
            },
            django: {
                files: {
                    'templates/<%= yeoman.mobile %>/base.html': '.tmp/<%= yeoman.mobile %>/base.html',
                    'templates/tpl-home.html': '.tmp/tpl-home.html',
                    'templates/tpl-page.html': '.tmp/tpl-page.html',
                    'templates/tpl-page-sidebar.html': '.tmp/tpl-page-sidebar.html',
                    'templates/tpl-default.html': '.tmp/tpl-default.html',
                    'templates/tpl-edit.html': '.tmp/tpl-edit.html',
                    'templates/tpl-contact.html': '.tmp/tpl-contact.html',
                    'templates/tpl-imagestore.html': '.tmp/tpl-imagestore.html',
                    'templates/imagestore/album_list.html': '.tmp/imagestore/album_list.html',
                    'templates/imagestore/image_list.html': '.tmp/imagestore/image_list.html',
                    'templates/base.html': '.tmp/base.html'
                },
                options: {
                    replacements: [{
                        //pattern: /static\//ig,
                        //replacement: '/static/'
                        pattern: /"static\/(.*?)"/ig,
                        replacement: '"{% static \'$1\' %}"'
                    }, {
                        pattern: /@@(.*?)@@/ig,
                        replacement: '$1'
                    }]
                }
            }
        },
        uglify: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/js/main.js': [
                        //'<%= yeoman.app %>/static/js/{,*/}*.js',
                        //'.tmp/static/js/templates.js'
                        '<%= yeoman.app %>/static/js/*.js',
                        '.tmp/static/js/*.js'
                    ]
                }
            }
        },
        useminPrepare: {
            html: '.tmp/base.html',
            options: {
                //basedir: 'static',
                //basedir: '<%= yeoman.app %>',
                dest: '.'
            }
        },
        usemin: {
            html: ['.tmp/{,*/}*.html'],
            //css: ['<%= yeoman.dist %>/css/{,*/}*.css'],
            options: {
                dirs: ['dist']
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/static/img',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= yeoman.dist %>/img'
                }]
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/css/aplication.css': [
                        '.tmp/static/css/{,*/}*.css'
                        //'<%= yeoman.app %>/static/css/{,*/}*.css'
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    //removeComments: true
                    //collapseWhitespace: true
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '.tmp',
                    src: '*.html',
                    dest: 'dist'
                },
                {
                    expand: true,
                    cwd: '.tmp/<%= yeoman.mobile %>',
                    src: 'base.html',
                    dest: 'dist/<%= yeoman.mobile %>'
                }]
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: 'public',
                    src: [
                        '*.{ico,htm}',
                        '.htaccess',
                        'static/img/{,*/}*.{webp,gif}'
                    ]
                }]
            },
            css: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '.',
                    src: 'static/css/*.css'
                }]
            },
            vendor: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '.',
                    src: 'static/js/vendor/*.js'
                }]
            },
            templates: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '.',
                    src: 'templates/base/*.html'
                }]
            },
            img: {
                files: [{
                    dot: true,
                    expand: true,
                    cwd: '<%= yeoman.app %>/static/img',
                    src: '{,*/}*.{png,jpg,jpeg,webp,gif}',
                    dest: '<%= yeoman.dist %>/img'
                },
                {
                    dot: true,
                    expand: true,
                    cwd: '<%= yeoman.app %>/static/images',
                    src: '{,**/}*.{png,jpg,jpeg,webp,gif}',
                    dest: '<%= yeoman.dist %>/images'
                }]
            },
            dev: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '.tmp',
                    src: [
                        '*.ico',
                        'static/img/{,*/}*.{webp,gif}'
                    ]
                // }, {
                //     expand: true,
                //     dot: true,
                //     cwd: '<%= yeoman.app %>/templates',
                //     dest: '.tmp/tpl',
                //     src: '*.htm'
                }]
            },
            mobile: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '.tmp',
                    src: [
                        '*.ico',
                        'static/img/{,*/}*.{webp,gif}'
                    ]
                }, {
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>/templates',
                    dest: '.tmp/tpl',
                    src: '*.htm'
                }]
            }
        },
        bower: {
            all: {
                rjsConfig: '<%= yeoman.app %>/static/js/main.js'
            }
        },
        handlebars: {
            compile: {
                options: {
                    namespace: 'JST'
                },
                files: {
                    '.tmp/static/js/templates.js': ['<%= yeoman.app %>/static/tpl/*.hbs']
                }
            }
        },
        pull: {
            options: {
                flow: false,
                submodule: false
            }
        },
        release: {
            options: {
                // bump: false, //default: true
                // file: '.', //default: package.json
                // add: false, //default: true
                // commit: false, //default: true
                // tag: false, //default: true
                push: false, //default: true
                pushTags: false, //default: true
                flow: true, //default: false
                // folder: '.', //default project root
                // tagName: 'v<%= version %>', //default: '<%= version %>'
                commitMessage: 'check out my release <%= version %>', //default: 'release <%= version %>'
                // tagMessage: 'tagging version <%= version %>' //default: 'Version <%= version %>'
                npm: false //default: true
            }
        }
    });

    grunt.renameTask('regarde', 'watch');

    grunt.registerTask('createDefaultTemplate', function() {
        grunt.file.write('.tmp/static/js/templates.js', 'this.JST = this.JST || {};');
    });

    grunt.registerTask('server', function(target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
        }
        if (target === 'mobile') {
            return grunt.task.run([
                'clean:server',
                'coffee:dist',
                'createDefaultTemplate',
                'handlebars',
                'less:dev',
                'copy:dev',
                'jshint:all',
                'string-replace:devmob',
                'preprocess:devmob',
                'livereload-start',
                'connect:livereload',
                'open',
                'watch'
            ]);
        }


        grunt.task.run([
            'clean:server',
            'coffee:dist',
            'createDefaultTemplate',
            'handlebars',
            'less:dev',
            'copy:dev',
            'jshint:all',
            'string-replace:dev',
            'preprocess:dev',
            'livereload-start',
            'connect:livereload',
            'open',
            'watch'
        ]);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'coffee:dist',
        'createDefaultTemplate',
        'handlebars',
        'less:dist',
        'copy:dev',
        'string-replace:dist',
        'string-replace:mobile',
        'preprocess:dist',
        'preprocess:mobile',
        'useminPrepare',
        'copy:img',
        //'imagemin',
        'htmlmin:dist',
        'concat',
        'cssmin',
        'uglify:dist',
        // ,'clean:tmp'
        'preprocess:imagestore',
        'copy:dist',
        'usemin',
        'string-replace:django',
        'copy:css',
        'copy:vendor',
        'copy:templates',
        'clean:dist'
    ]);

    grunt.registerTask('run', [
        'shell:syncdb',
        'shell:collectstatic',
        'shell:compress',
        'shell:runserver'
    ]);

    grunt.registerTask('django', [
        'shell:syncdb',
        'shell:collectstatic',
        'shell:compress'
    ]);

    grunt.registerTask('test', [
        'clean:server',
        'coffee:dist',
        'createDefaultTemplate',
        'handlebars',
        'less:dev',
        'copy:dev',
        'string-replace:dev',
        'preprocess:dev',
        'jshint:all',
        'string-replace:dev',
        'connect:test',
        'mocha'
    ]);

    grunt.registerTask('trans', [
        // 'clean:server',
        'shell:trans'
        // 'copy:dev',
        // 'string-replace:dev',
        // 'preprocess:dev'
    ]);

    grunt.registerTask('ssh', [
        'sshexec:pull'
    ]);

    grunt.registerTask('default', [
        'test',
        'build'
    ]);

    grunt.registerTask('deploy', function(target) {
        if (target === 'prod') {
            return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            // 'test',
            // 'build',
            // 'release',
            'sshexec:api'
        ]);

    });
};