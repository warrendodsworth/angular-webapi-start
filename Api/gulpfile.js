/// <binding Clean='default' ProjectOpened='watch' />
var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var filter = require('gulp-filter');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var fixmyjs = require('gulp-fixmyjs');
var stylish = require('jshint-stylish');
var jscs = require('gulp-jscs');
var less = require('gulp-less');
var sh = require('shelljs');
var bower = require('bower');
var livereload = require('livereload');
var stripDebug = require('gulp-strip-debug');
var todo = require('gulp-todo');
var mainBowerFiles = require('main-bower-files');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var plumber = require('gulp-plumber');
var Server = require('karma').Server;

var root = './www/';
var paths = {
    css: ['./less/**/*.less', root + 'css/**/*.css', '!' + root + 'lib/**.*'],
    js: [root + 'app.js', root + '**/*.js', '!' + root + 'lib/**.*'],
    font: root + 'fonts/',
    lib: root + 'lib/'
};

//Run test once and exit
gulp.task('test', function (done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('default', ['css', 'js', 'bower', 'todo']);

gulp.task('watch', ['default', 'livereload'], function () {
    gulp.watch(paths.css, ['css']);
    gulp.watch(paths.js, ['js']);
});

gulp.task('livereload', function () {
    var server = livereload.createServer();
    server.watch([paths.css, paths.js]);
});

gulp.task('js', function (done) {
    gulp.src(paths.js)
        .pipe(plumber())
        .pipe(gulp.dest(root))
        .pipe(concat('app.js'))
        .pipe(gulp.dest(paths.lib))
        .pipe(uglify())
        .pipe(stripDebug())
        .on('error', handleError)
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.lib))
        .on('end', done);
});

gulp.task('css', function (done) {
    gulp.src(paths.css)
        .pipe(plumber())
        .pipe(less())
        .pipe(concat('app.css'))
        .pipe(sourcemaps.init())
        .pipe(postcss([autoprefixer({ browsers: ['last 2 versions'] })]))
        .pipe(gulp.dest(paths.lib))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
       
        .pipe(rename({ extname: '.min.css' }))
        .pipe(sourcemaps.write('.'))
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
        .pipe(jsFilter.restore)

        .pipe(cssFilter)
        .pipe(less())
        .pipe(concat('bower.css'))
        .on('error', onError)
        .pipe(gulp.dest(paths.lib))
        .pipe(cssFilter.restore)

        .pipe(fontFilter)
        .on('error', onError)
        .pipe(gulp.dest(paths.font))
        .pipe(fontFilter.restore)

        .pipe(everythingElseFilter)
        .pipe(gulp.dest(paths.lib))
        .on('end', done);
});

// -> Will output a TODO.md with your todos 
gulp.task('todo', function () {
    gulp.src(paths.js)
        .pipe(todo())
        .pipe(gulp.dest('./'));
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

function handleError(err) {
    console.log(err);
    this.emit('end');
}


//.pipe(jshint())
//.pipe(jshint.reporter('default'))
//.pipe(fixmyjs({
//  //Jshint options   
//  esversion: 5
//}))
//.pipe(jscs({ fix: true }))
//.pipe(jscs.reporter('console'))
