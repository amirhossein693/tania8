'use strict';

var path = require('path');

var fs = require('fs');

var _ = require('lodash');

var webpack = require('webpack');


module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      build: {
        files: [{
          expand: true,
          dot: true,
          extDot: 'last',
          cwd: 'dist',
          src: ['js/*.js', 'js/**/*.js'],
          dest: 'dist/',
          ext: '.js',
        }],  
      }
    },

    sass: {
      options: {
        sourceMap: true,
        includePaths: [
          'src/scss',
          'src/vendor'
        ]
      },
      app: {
        files: [{
          expand: true,
          cwd: 'src/scss',
          src: ['**/*.scss'],
          dest: 'dist/css',
          ext: '.css'
        }]
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 15 version']
      },
      build: {
        files: [
          {
            expand: true,
            cwd: 'dist',
            src: ['css/**/*.css'],
            dest: 'dist/',
            ext: '.css',
          }
        ]
      }
    },    

    cssmin: {
      build: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'dist',
          src: ['css/*.css', 'css/**/*.css'],
          dest: 'dist/',
          ext: '.css',
        }],  
      }
    },

    copy: {
      build: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'src/',
          src: ['**/*', '!scss/**', '!js/**'],
          dest: 'dist/'
        }],
      },
      serve: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'src/',
          src: ['**/*', '!scss/**', '!js/**'],
          dest: 'dist/'
        }],
      },      
    },

    webfont: {
      build: {
          src: 'src/images/iconfonts/*.svg',
          dest: 'src/fonts/iconfonts',
          destCss: 'src/scss/base',
          options: {
            htmlDemo: false,
            autoHint: false,
            stylesheet: 'scss',
            templateOptions: {
              baseClass: 'ico',
              classPrefix: 'ico-',
              mixinPrefix: 'mico-'
            },
          },
      }
    },

    webpack: {
      build: {
          // webpack options
          entry: "./src/js/script.js",

          output: {
            path: "dist/js/",
            filename: "script.bundle.js",
          },

          devtool: 'inline-source-map',

          plugins: [
            new webpack.ProvidePlugin({
              _: 'lodash' // let me use lodash as ejs engine (ejs-loader requirement)
            })
          ],

          module: {
            loaders: [
              { test: /\.ejs$/, loader: 'ejs-loader' },
              { test: /jquery\.js$/, loader: 'expose?jQuery' },
              { test: /\.js$/, loader: 'eslint-loader', exclude: /node_modules|vendor/}
            ]
          },

          resolve: {
            root: [
              path.resolve(__dirname + '/src/')
            ],
            modulesDirectories: [
              'node_modules',
              'vendor'
            ]
          },

          eslint: {
            configFile: path.resolve(__dirname + '/.eslintrc')
          },

          stats: {
            colors: true,
            modules: true,
            reasons: true
          },


          failOnError: false, // don't report error to grunt if webpack find errors
          // Use this if webpack errors are tolerable and grunt should continue

          watch: false, // use webpacks watcher
          // You need to keep the grunt process alive

          keepalive: false, // don't finish the grunt task
          // Use this in combination with the watch option

          inline: true,  // embed the webpack-dev-server runtime into the bundle
          // Defaults to false

        }
    },

    watch: {
      scss: {
        files: ['src/scss/**'],
        tasks: ['sass:app', 'autoprefixer:build', 'copy:serve'],
        options: {
          spawn: false,
        },
      },
      js: {
        files: ['src/js/**'],
        tasks: ['webpack', 'copy:serve'],
        options: {
          spawn: false,
        },
      },
      images: {
        files: ['src/images/**'],
        tasks: ['webfont:build', 'sass:app', 'autoprefixer:build',  'copy:serve'],
        options: {
          spawn: false,
        },
      },
    },

    clean: {
      build: ["dist"]
    }

  });

  // module(s)
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-webfont');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-eslint');

  // task(s).
  grunt.registerTask('build', [
                                'clean:build',
                                'webfont:build',
                                'sass:app',
                                'autoprefixer:build',
                                'copy:build',
                                'webpack',
                                'uglify:build',
                                'cssmin:build'
                              ]);

  grunt.registerTask('serve', [
                                'clean:build',
                                'webfont:build',
                                'sass:app',
                                'autoprefixer:build',
                                'copy:serve',
                                'webpack',
                                'watch'
                              ]);  

};