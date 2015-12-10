/// <vs AfterBuild='default' SolutionOpened='default' />
//https://github.com/JustMaier/angular-signalr-hub - IMP

var gulp = require('gulp');
var bower = require('gulp-bower');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var merge = require('gulp-merge');

var project = { webroot: '' };
var paths = {
  webroot: './',
  bower: './bower_components/',
  lib: './lib/'
};

gulp.task('default', ['watch', 'lib', 'src']);

gulp.task("lib", function () {
  var bower = {
    "angular": "angular/**/*.min.{js,css}",
    "angular": "angular-bootstrap/**/*.min.{js,css}", //Not getting copied
    "angular": "angular-local-storage/dist/**/*.min.{js,css}",
    "bootstrap": "bootstrap/dist/**/*.{js,map,css,ttf,svg,woff,eot}",
  }

  for (var destinationDir in bower) {
    gulp.src(paths.bower + bower[destinationDir]).pipe(gulp.dest(paths.lib + destinationDir));
  }

  var js = gulp.src('./lib/**/*.js')
       .pipe(concat('lib.js'))
       .pipe(rename({ suffix: '.min' }))
       .pipe(uglify())
       .pipe(gulp.dest('./lib'));

  var css = gulp.src('./lib/**/*.css')
          .pipe(concat('lib.css'))
          .pipe(rename({ suffix: '.min' }))
          .pipe(minifyCss())
          .pipe(gulp.dest('./lib'));

  return merge(js, css);
});

// Concatenate JS Files
gulp.task('src', function () {
  var js = gulp.src(['./js/**/*.js', '!./js/**/*.min.js', '!./js/test/**/*.js'])
          .pipe(concat('src.js'))
          .pipe(rename({ suffix: '.min' }))
          .pipe(uglify())
          .pipe(gulp.dest('./js'));

  var css = gulp.src('./content/**/*.css')
         .pipe(concat('src.css'))
         .pipe(rename({ suffix: '.min' }))
         .pipe(minifyCss())
         .pipe(gulp.dest('./css'));

  return merge(js, css);
});


//Watch
gulp.task('watch', function () {

  gulp.watch('/js/**/**/.js', ['src']);

  // recompile and minify
  gulp.watch('/scss/*.scss', ['sass']);
});







//"jquery": "jquery/jquery*.{js,map}",
//"bootstrap-touch-carousel": "bootstrap-touch-carousel/dist/**/*.{js,css}",
//"hammer.js": "hammer.js/hammer*.{js,map}",
//"jquery-validation": "jquery-validation/jquery.validate.js",
//"jquery-validation-unobtrusive": "jquery-validation-unobtrusive/jquery.validate.unobtrusive.js"