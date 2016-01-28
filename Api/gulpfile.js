/// <binding AfterBuild='lib' Clean='default' ProjectOpened='default, watch' />
/// <vs AfterBuild='lib' SolutionOpened='default' />
//https://github.com/JustMaier/angular-signalr-hub
//http://andy-carter.com/blog/a-beginners-guide-to-package-manager-bower-and-using-gulp-to-manage-components

// Include Gulp
var gulp = require('gulp');

// Include plugins
var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files', 'merge-stream'],
    replaceString: /\bgulp[\-.]/
});

// Define default destination folder
var dest = './www/';
var paths = {
    sass: ['./scss/**/*.scss'],
    cssFiles: ['./www/css/**/*.css'],
    jsFiles: ['./www/**/*.js', '!./www/lib/**/*.js', '!./www/js/test/**/*.js']
};

gulp.task('default', ['src', 'lib', 'watch']);

gulp.task('src', function () {
    var js = gulp.src(paths.jsFiles)
        .pipe(plugins.concat('src.js'))
        .pipe(gulp.dest(dest + 'js'))
        .pipe(plugins.rename({ suffix: '.min' }))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(dest + 'js'));

    var css = gulp.src(paths.cssFiles)
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
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest(dest + 'css'));

    return plugins.merge(js, css);
});

gulp.task('sass', function(done) {
  gulp.src(paths.sass)
    .pipe(plugins.sass())
    .on('error', plugins.sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(plugins.minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(plugins.rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function () {
    gulp.watch(paths.jsFiles, ['src']);
    gulp.watch(paths.cssFiles, ['src']);
    gulp.watch(paths.sass, ['sass']);
});
