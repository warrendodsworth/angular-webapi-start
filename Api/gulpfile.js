/// <vs AfterBuild='default' />
//https://github.com/JustMaier/angular-signalr-hub - IMP

var gulp = require('gulp');
var bower = require('gulp-bower');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var merge = require('gulp-merge');
var sass = require('gulp-sass');

var project = { webroot: '' };
var paths = {
  webroot: './',
  bower: './bower_components/',
  lib: './lib/'
};

gulp.task('default', ['watch', 'src-js', 'src-css']);


//SRC
gulp.task('src-js', function () {
  return gulp.src(['./js/**/*.js', '!./js/**/*.min.js', '!./js/test/**/*.js'])
               .pipe(concat('src.js'))
               .pipe(gulp.dest('./build'))
               .pipe(rename({ suffix: '.min' }))
               .pipe(uglify())
               .pipe(gulp.dest('./build'));
});

gulp.task('src-css', function () {
  return gulp.src('./content/**/*.css')
         .pipe(concat('src.css'))
         .pipe(gulp.dest('./build'))
         .pipe(rename({ suffix: '.min' }))
         .pipe(minifyCss())
         .pipe(gulp.dest('./build'));
});

//LIB
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
       .pipe(gulp.dest('./build'));

  var css = gulp.src('./lib/**/*.css')
          .pipe(concat('lib.css'))
          .pipe(rename({ suffix: '.min' }))
          .pipe(minifyCss())
          .pipe(gulp.dest('./build'));

  return merge(js, css);
});

gulp.task('sass', function () {
  return gulp.src('./scss/styles.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('./css'));
});

//WATCH
gulp.task('watch', function () {

  gulp.watch('./js/**/*.js', ['src-js']);

  gulp.watch('/scss/**/*.scss', ['sass']);
});




//gulp.task('test', function () {
//  console.log('Testing gulp on the cmd');
//})

//"jquery": "jquery/jquery*.{js,map}",
//"bootstrap-touch-carousel": "bootstrap-touch-carousel/dist/**/*.{js,css}",
//"hammer.js": "hammer.js/hammer*.{js,map}",
//"jquery-validation": "jquery-validation/jquery.validate.js",
//"jquery-validation-unobtrusive": "jquery-validation-unobtrusive/jquery.validate.unobtrusive.js"