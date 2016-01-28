/// <binding AfterBuild='lib' Clean='default' ProjectOpened='default, watch' />
/// <vs AfterBuild='lib' SolutionOpened='default' />
//https://github.com/JustMaier/angular-signalr-hub - IMP

// Include Gulp
var gulp = require('gulp');

// Include plugins
var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files', 'merge-stream'],
    replaceString: /\bgulp[\-.]/
});

// Define default destination folder
var dest = './www/';

gulp.task('default', ['src', 'lib', 'watch']);

//SRC
gulp.task('src', function () {
    var js = gulp.src(['./js/**/*.js', '!./js/**/*.min.js', '!./js/test/**/*.js'])
        .pipe(plugins.concat('src.js'))
        .pipe(gulp.dest(dest + 'js'))
        .pipe(plugins.rename({ suffix: '.min' }))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(dest + 'js'));

    var css = gulp.src('./css/**/*.css')
        .pipe(plugins.concat('src.css'))
        .pipe(gulp.dest(dest + 'css'))
        .pipe(plugins.rename({ suffix: '.min' }))
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest(dest + 'css'));

    return plugins.merge(js, css);
});

gulp.task('lib', function () {
    var js = gulp.src(plugins.mainBowerFiles())
        .pipe(plugins.filter('*.js'))
        .pipe(plugins.concat('lib.min.js'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(dest + 'js'));

    var css = gulp.src(plugins.mainBowerFiles())
        .pipe(plugins.filter('*.css'))
        .pipe(plugins.concat('lib.min.css'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(dest + 'css'));

    return plugins.merge(js, css);
});

//WATCH
gulp.task('watch', function () {

    gulp.watch('./www/js/**/*.js', ['src']);

    gulp.watch('./www/css/**/*.css', ['src']);

    gulp.watch('./scss/**/*.scss', ['sass']);
});

//http://andy-carter.com/blog/a-beginners-guide-to-package-manager-bower-and-using-gulp-to-manage-components