/// <binding Clean='default' ProjectOpened='watch' />
"use strict";

var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var filter = require('gulp-filter');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var livereload = require('livereload');
var sh = require('shelljs');
var bower = require('bower');
var mainBowerFiles = require('main-bower-files');

//http://www.sitepoint.com/simple-gulpy-workflow-sass/
var paths = {
  css: ['./scss/**/*.scss', './wwwroot/css/**/*.css'],
  js: ['./wwwroot/js/app.js', './wwwroot/js/**/*.js'],
  font: './wwwroot/fonts/',
  lib: './wwwroot/lib/'
};

gulp.task('default', ['css', 'js', 'bower']);

gulp.task('watch', ['default', 'livereload'], function () {
  gulp.watch(paths.css, ['css']);
  gulp.watch(paths.js, ['js']);
});

gulp.task('livereload', function () {
  var server = livereload.createServer();
  server.watch('./wwwroot/');
});

gulp.task('css', function (done) {
  gulp.src(paths.css)
    .pipe(sourcemaps.init())
    .pipe(sass({ errLogToConsole: true }).on('error', sass.logError))
    .pipe(concat('app.css'))

    .pipe(gulp.dest(paths.lib))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.lib))
    .on('end', done);
});

gulp.task('js', function (done) {
  gulp.src(paths.js)
    .pipe(filter('**/*.js'))
    .pipe(concat('app.js'))

    .pipe(gulp.dest(paths.lib))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.lib))
    .on('end', done);
});

gulp.task('bower', ['install'], function (done) {
  var files = mainBowerFiles(),
    jsFilter = filter('**/*.js', { restore: true }),
    cssFilter = filter(['**/*.css'], { restore: true }),
    fontFilter = filter(['**/*.{eot,woff,woff2,svg,ttf,otf}'], { restore: true }),
    everythingElseFilter = filter(['**/*.!{js,css}'], { restore: true }),
    onError = function (err) {
      console.log(err);
    };

  if (!files.length) {
    return done();
  }

  gulp.src(mainBowerFiles())
    .pipe(jsFilter)
    .pipe(concat('bower.js'))
    .on('error', onError)
    .pipe(gulp.dest(paths.lib))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.lib))
    .pipe(jsFilter.restore)

    .pipe(cssFilter)
    .pipe(concat('bower.css'))
    .on('error', onError)
    .pipe(gulp.dest(paths.lib))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(paths.lib))
    .pipe(cssFilter.restore)

    .pipe(fontFilter)
    .pipe(gulp.dest(paths.font))
    .pipe(fontFilter.restore)

    .pipe(everythingElseFilter)
    .pipe(gulp.dest(paths.lib))
    .on('end', done);
});

gulp.task('install', ['git-check'], function () {
  return bower.commands.install()
    .on('log', function (data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function (done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
      );
    process.exit(1);
  }
  done();
});





//"use strict";

//var gulp = require("gulp"),
//    rimraf = require("rimraf"),
//    concat = require("gulp-concat"),
//    cssmin = require("gulp-cssmin"),
//    uglify = require("gulp-uglify");

//var paths = {
//    webroot: "./wwwroot/"
//};

//paths.js = paths.webroot + "js/**/*.js";
//paths.minJs = paths.webroot + "js/**/*.min.js";
//paths.css = paths.webroot + "css/**/*.css";
//paths.minCss = paths.webroot + "css/**/*.min.css";
//paths.concatJsDest = paths.webroot + "js/site.min.js";
//paths.concatCssDest = paths.webroot + "css/site.min.css";

//gulp.task("clean:js", function (cb) {
//    rimraf(paths.concatJsDest, cb);
//});

//gulp.task("clean:css", function (cb) {
//    rimraf(paths.concatCssDest, cb);
//});

//gulp.task("clean", ["clean:js", "clean:css"]);

//gulp.task("min:js", function () {
//    return gulp.src([paths.js, "!" + paths.minJs], { base: "." })
//        .pipe(concat(paths.concatJsDest))
//        .pipe(uglify())
//        .pipe(gulp.dest("."));
//});

//gulp.task("min:css", function () {
//    return gulp.src([paths.css, "!" + paths.minCss])
//        .pipe(concat(paths.concatCssDest))
//        .pipe(cssmin())
//        .pipe(gulp.dest("."));
//});

//gulp.task("min", ["min:js", "min:css"]);
