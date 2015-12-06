/// <vs AfterBuild='default' SolutionOpened='default' />
//https://github.com/JustMaier/angular-signalr-hub - IMP


var gulp = require('gulp');
var bower = require('gulp-bower');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var project = { webroot: '' };
var paths = {
  webroot: "./" + project.webroot + "/",
  bower: "./bower_components/",
  lib: "./" + project.webroot + "/lib/"
};

gulp.task('default', function () {
  // place code for your default task here
});



gulp.task("copy", ["clean"], function () {
  var bower = {
    "bootstrap": "bootstrap/dist/**/*.{js,map,css,ttf,svg,woff,eot}",
    "bootstrap-touch-carousel": "bootstrap-touch-carousel/dist/**/*.{js,css}",
    "hammer.js": "hammer.js/hammer*.{js,map}",
    "jquery": "jquery/jquery*.{js,map}",
    "jquery-validation": "jquery-validation/jquery.validate.js",
    "jquery-validation-unobtrusive": "jquery-validation-unobtrusive/jquery.validate.unobtrusive.js"
  }

  for (var destinationDir in bower) {
    gulp.src(paths.bower + bower[destinationDir])
      .pipe(gulp.dest(paths.lib + destinationDir));
  }
});

//Runs bower install
gulp.task('bower', function () {
  return bower({ layout: "byComponent" }).pipe(gulp.dest('lib/'));

});

// Concatenate JS Files
gulp.task('scripts', function () {
  return gulp.src('/js/*.js')
             .pipe(concat('main.js'))
             .pipe(rename({ suffix: '.min' }))
             .pipe(uglify())
             .pipe(gulp.dest('/js/src'));
});

gulp.task('watch', function () {
  // Watch .js files
  gulp.watch('/js/*.js', ['scripts']);
  // Watch .scss files
  gulp.watch('/scss/*.scss', ['sass']);
  // Watch image files
  gulp.watch('/images/**/*', ['images']);
});

gulp.task('default', ['watch']);



