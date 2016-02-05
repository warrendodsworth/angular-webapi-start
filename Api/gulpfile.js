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
var livereload = require('livereload');

var paths = {
    sass: ['./scss/**/*.scss'],
    js: ['./www/js/**/*.js', './www/account/**/*.js', './www/home/**/*.js',
        './www/shared/**/*.js', './www/user/**/*.js', '!./www/js/test/**/*.js'],
    bower: ['./www/lib/**/*.js', '!./www/lib/*.js', '!./www/lib/*.css']
};

gulp.task('default', ['sass', 'js', 'bower-js', 'bower-css']); //, 'livereload' //, 'watch'

gulp.task('watch', ['livereload'], function () {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.js, ['js']);
    gulp.watch(paths.bower, ['bower-js', 'bower-css']);
});

gulp.task('livereload', function () {
    var server = livereload.createServer();
    server.watch('./www');
});

gulp.task('sass', function (done) {
    gulp.src(paths.sass)
        .pipe(sass())
        .pipe(concat('app.css'))
        .on('error', sass.logError)
        .pipe(gulp.dest('./www/css/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});

gulp.task('js', function () {
    gulp.src(paths.js)
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./www/lib'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('./www/lib'));
});

gulp.task('bower-js', function () {
    gulp.src(mainBowerFiles())
        .pipe(filter('*.js'))
        .pipe(concat('bower.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./www/lib'));
});

gulp.task('bower-css', function () {
    gulp.src(mainBowerFiles())
        .pipe(filter(['*.less', '*.css']))
        .pipe(less())
        .pipe(concat('bower.min.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('./www/lib'));
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

// http://clubmate.fi/bower-and-gulp-match-made-in-heaven-also/
gulp.task('test', function () {
    gulp.src('./www/lib/*.()')
        .pipe(gulp.dest('./www/lib/test'));
    // return gulp.src(mainBowerFiles())
    //     .pipe(gulp.dest('./www/lib'))
});