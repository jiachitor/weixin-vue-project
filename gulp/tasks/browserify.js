var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    watchify = require('watchify'),
    gulpif = require('gulp-if'),
    streamify = require('gulp-streamify'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    sourcemaps = require('gulp-sourcemaps'),
    collapser = require('bundle-collapser'),
    es6transpiler = require('gulp-es6-module-transpiler'),
    babelify = require('babelify');

var browserSync = require('browser-sync');
var _ = require('lodash');
var config_browserify = require('../config').browserify;

var browserifyTask = function(options) {

    var bundler = browserify({
        entries: [options.base + options.entries],
        transform: babelify.configure({
            presets: ["es2015", "transform-runtime"]
        }),
        debug: true,
        cache: {},
        packageCache: {},
        fullPaths: true
    });

    var updateStart = Date.now();

    function bundle() {
        bundler
            .bundle()
            .on('error', gutil.log.bind(gutil, 'Browserify Error'))
            .pipe(source(options.outputFilename))
            .pipe(gulpif(!options.development, streamify(uglify())))
            .pipe(gulp.dest(options.dest))
            .pipe(browserSync.reload({
                stream: true
            }))
            .pipe(notify(function() {
                console.log(options.outputFilename + ' bundle built in ' + (Date.now() - updateStart) + 'ms');
            }));
    }

    bundler = watchify(bundler);
    bundler.on('update', bundle);

    return bundle();

};

//单个js文件进行编译
gulp.task('browserify_to_oneself', function(callback) {
    _.forEach(config_browserify.watch_pages, function(page) {
        browserifyTask({
            development: true,
            base: config_browserify.src + page + '/js/',
            entries: config_browserify.dest.entries,
            dest: config_browserify.src + page,
            outputFilename: config_browserify.dest.outputFile,
            bundleName: 'react ' + page,
            externals: config_browserify.dest.dependencies
        });
    });
    callback();
});

//重新刷新页面
function js_watch_to_oneself(callback) {
    browserSync.reload();
    callback();
}
