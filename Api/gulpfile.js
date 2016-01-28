/// <binding AfterBuild='lib' Clean='default' ProjectOpened='default, watch' />
/// <vs AfterBuild='lib' SolutionOpened='default' />
//https://github.com/JustMaier/angular-signalr-hub
//http://andy-carter.com/blog/a-beginners-guide-to-package-manager-bower-and-using-gulp-to-manage-components

// Include Gulp
var gulp = require('gulp');

// Include plugins
var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files', 'merge-stream', 'shelljs'],
    replaceString: /\bgulp[\-.]/
});

// Define default destination folder
var paths = {
    sass: ['./scss/**/*.scss'],
    css: ['./www/css/**/*.css'],
    js: ['./www/**/*.js', '!./www/lib/**/*.js', '!./www/js/test/**/*.js']
};

gulp.task('default', ['src', 'lib', 'watch']);

gulp.task('src', function () {
    gulp.src(paths.js)
        .pipe(plugins.concat('src.js'))
        .pipe(gulp.dest('./www/js'))
        .pipe(plugins.rename({ suffix: '.min' }))
        .pipe(plugins.uglify())
        .pipe(gulp.dest('./www/js'));
});

gulp.task('lib', function () {
    gulp.src(plugins.mainBowerFiles())
        .pipe(plugins.filter('*.js'))
        .pipe(plugins.concat('lib.min.js'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest('./www/js'));
    /*
        var css = gulp.src(plugins.mainBowerFiles())
            .pipe(plugins.filter('*.css'))
            .pipe(plugins.concat('lib.min.css'))
            .pipe(plugins.minifyCss())
            .pipe(gulp.dest('./www/css'));
    
        return plugins.mergeStream(js, css);*/
});

gulp.task('sass', function (done) {
    gulp.src(paths.sass)
        .pipe(plugins.sass())
        .on('error', plugins.sass.logError)
        .pipe(gulp.dest('./www/css'))
        .pipe(plugins.minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(plugins.rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./www/css'))
        .on('end', done);
});

gulp.task('watch', function () {
    gulp.watch(paths.js, ['src']);
    gulp.watch(paths.css, ['src']);
    gulp.watch(paths.sass, ['sass']);
});


/*
gulp.task('install', ['git-check'], function () {
    return bower.commands.install()
        .on('log', function (data) {
            plugins.gutil.log('bower', plugins.gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('git-check', function (done) {
    if (!plugins.sh.which('git')) {
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
*/

/*
    var css = gulp.src(paths.css)
        .pipe(plugins.concat('src.css'))
        .pipe(gulp.dest(dest + 'css'))
        .pipe(plugins.rename({ suffix: '.min' }))
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest(dest + 'css'));

    return plugins.merge(js, css);
*/