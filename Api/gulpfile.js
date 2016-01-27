/// <binding AfterBuild='lib' Clean='default' ProjectOpened='default, watch' />
/// <vs AfterBuild='lib' SolutionOpened='default' />
//https://github.com/JustMaier/angular-signalr-hub - IMP

var gulp = require('gulp');
var bower = require('gulp-bower');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var merge = require('merge-stream');
var mainBowerFiles = require('main-bower-files');
var filter = require('gulp-filter');
//var sass = require('gulp-sass');

var project = { webroot: '' };
var paths = {
  webroot: './',
  bower: './bower_components/',
  lib: './lib/'
};

gulp.task('default', ['src-js', 'src-css', 'watch']);

//SRC
gulp.task('src-js', function () {
  return gulp.src(['./js/**/*.js', '!./js/**/*.min.js', '!./js/test/**/*.js'])
               .pipe(concat('src.js'))
               .pipe(gulp.dest('./build'))
               .pipe(rename({ suffix: '.min' }))
               .pipe(uglify())
               .pipe(gulp.dest('./build'));
});

gulp.task('src-css', function () { //, ['sass']
  return gulp.src('./css/**/*.css')
         .pipe(concat('src.css'))
         .pipe(gulp.dest('./build'))
         .pipe(rename({ suffix: '.min' }))
         .pipe(minifyCss())
         .pipe(gulp.dest('./build'));
});


//LIBS
gulp.task('lib', function () {

  var js = gulp.src(mainBowerFiles())
     .pipe(filter('*.js'))
     .pipe(concat('lib.min.js'))
     .pipe(uglify())
     .pipe(gulp.dest('./js/shared/lib'));

  var css = gulp.src(mainBowerFiles())
     .pipe(filter('*.css'))
     .pipe(concat('lib.min.css'))
     .pipe(uglify())
     .pipe(gulp.dest('./js/shared/lib'));

 return merge(js, css);
});

//WATCH
gulp.task('watch', function () {

  gulp.watch('./js/**/*.js', ['src-js']);

  gulp.watch('./css/**/*.css', ['src-css']);

  gulp.watch('/scss/**/*.scss', ['sass']);
});

//http://andy-carter.com/blog/a-beginners-guide-to-package-manager-bower-and-using-gulp-to-manage-components
//.concat(cssFiles)
//var cssFiles = ['./css/*'];