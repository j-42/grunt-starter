module.exports = function(grunt) {

  // automatically load all tacks
  require('load-grunt-tasks')(grunt);

  // structure set-up
  var PathConfig = require('./grunt-settings.js');

  // tasks
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    config: PathConfig,

    // CSS ->  Stylus to css
    stylus: {
        compile: {
            options: {
              use: [
        				function() { return require('autoprefixer-stylus')('last 4 versions', 'ie 8','ie 9'); }
        			]
            },
            files: {
              '<%= config.cssDir %>main.css' : '<%= config.cssDir %>**/*.styl'
            }
        }
    },
    // CSS minify
    csso: {
      dynamic_mappings: {
        expand: true,
        cwd: '<%= config.cssDir %>',
        src: ['*.css', '!*.min.css'],
        dest: '<%= config.rootDir %><%= config.assetsDir %><%= config.cssDir %>',
        ext: '.min.css'
      }
    },
    // Js > check errors
    jshint: {
      options: {
        smarttabs: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: false,
        newcap: true,
        noarg: false,
        sub: false,
        undef: true,
        boss: true,
        eqnull: true,
        browser: false,
        unused: false,
        node: true,
        },
      globals: {
        $:true,
        jQuery: true,
        console: false,
      },
      files: {
        src: '<%= config.jsDir %>/main.js'
      },
    },
    // Js > concatenate files
    concat: {
      options: {
        separator: '',
      },
      dist: {
        src: ['<%= config.jsDir %><%= config.libsDir %>/**/*.js', '<%= config.jsDir %>/main.js'],
        dest: '<%= config.jsDir %>/main.concat.js',
      },
    },
    // Js > minify
    uglify: {
      my_target: {
        files: {
          '<%= config.rootDir %><%= config.assetsDir %><%= config.jsDir %>main.min.js': '<%= config.jsDir %>/main.concat.js'
        }
      }
    },
    // image optimizing
    imagemin: {
        dynamic: {
            options: {
                optimizationLevel: 3,
                cache:false,
                svgoPlugins: [{removeViewBox: false}]
            },
            files: [{
                expand: true,
                cwd: '<%= config.imgDir %>',
                src: ['**/*.{png,svg,jpg,gif}'],
                dest: '<%= config.rootDir %><%= config.assetsDir %><%= config.imgDir %>'
            }]
        }
    },
    // Livereload
    connect: {
      server: {
        options: {
            port:8002,
            hostname:'localhost',
            base:'<%= config.rootDir %>',
            livereload:true
        },
      }
    },
    /*
    // Keep multiple browsers & devices in sync when building websites.
    browserSync: {
      dev: {
        bsFiles: {
          src : ['*.html','<%= config.cssDir %>*.css', '*.css','<%= config.jsDir %>*.js', '*.js']
        },
        options: {
          server: {
            baseDir: "./",
            index: "index.html",
            directory: false
          },
          watchTask: true
        }
      }
    },
    */

    // watcher project
    watch: {
      options: {
        debounceDelay: 1,
        livereload: false,
      },
      // watch HTML
      html: {
        files: ['<%= config.rootDir %>**/*.html'],
        options: {
            spawn: false,
            livereload: true,
        }
      },
      // watch CSS
      stylus:{
        options: {
          livereload: false,
        },
          files:  '<%= config.cssDir %>**/*.styl',
          tasks: ['stylus', 'csso']
      },
      js: {
        options: {
            livereload: false,
        },
        files: '<%= config.jsDir %>**/*.js',
        tasks: ['jshint', 'concat', 'uglify']
      },
      images: {
        files: ['<%= config.imgDir %>**/**'],
        tasks: ['newer:imagemin'],
        options: {
            spawn: false,
            livereload: true,
        }
      }
    }

  });

  grunt.registerTask('default', ['localdev']);


  //watch
  grunt.registerTask('w', ['watch']);

  //browser sync
  grunt.registerTask('bs', ['connect']);

  //watch + livereload
  grunt.registerTask('localdev', ['connect', 'watch']);

  //watch + browser sync + livereload
  grunt.registerTask('teamdev', ['browserSync','connect', 'watch']);


  // COMPRESS
  // Js
  grunt.registerTask('js', ['jshint']);

  //img minify
  grunt.registerTask('imgmin', ['imagemin']);

};
