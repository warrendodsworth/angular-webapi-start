/// <binding AfterBuild='default' ProjectOpened='install' />
var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var filter = require('gulp-filter');
var sh = require('shelljs');
var uglify = require('gulp-uglify');
var mainBowerFiles = require('main-bower-files');
var less = require('gulp-less');
var jshint = require('gulp-jshint')
var livereload = require('livereload');

// http://clubmate.fi/bower-and-gulp-match-made-in-heaven-also/
var paths = {
  sass: ['./scss/**/*.scss'],
  css: ['./www/css/**/*.css'],
  js: ['./www/js/app.js', './www/**/*.js', '!./www/lib/**', '!./www/test/**'],
  bower: ['./www/lib/**/*.js', '!./www/lib/*.js', '!./www/lib/*.css']
};

gulp.task('default', ['css', 'js', 'bower-js', 'bower-css']);

gulp.task('watch', ['livereload'], function () {
  gulp.watch(paths.css, ['css']);
  gulp.watch(paths.js, ['js']);
});

gulp.task('livereload', function () {
  var server = livereload.createServer();
  server.watch('./www');
});

gulp.task('css', ['sass'], function (done) {
  gulp.src(paths.css)
    .pipe(concat('app.css'))
    .pipe(gulp.dest('./www/lib/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/lib/'))
    .on('end', done);
})

gulp.task('sass', function (done) {
  gulp.src(paths.sass)
    .pipe(sass())
    .pipe(concat('src.css'))
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('js', function (done) {
  gulp.src(paths.js)
    .pipe(filter('**/*.js'))
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./www/lib'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./www/lib'))
    .on('end', done);
});

gulp.task('jshint', function (done) {
  gulp.src(paths.js)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .on('end', done);
});

gulp.task('bower-js', function (done) {
  gulp.src(mainBowerFiles())
    .pipe(filter('*.js'))
    .pipe(concat('bower.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./www/lib'))
    .on('end', done);
});

gulp.task('bower-css', function (done) {
  gulp.src(mainBowerFiles())
    .pipe(filter(['*.less', '*.css']))
    .pipe(less())
    .pipe(concat('bower.min.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest('./www/lib'))
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
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
      );
    process.exit(1);
  }
  done();
});

