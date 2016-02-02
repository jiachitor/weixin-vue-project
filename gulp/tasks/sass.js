var gulp = require('gulp'),
    sass = require('gulp-sass'),
    notify = require('gulp-notify'),
    sourcemaps = require('gulp-sourcemaps'),
    minifycss = require('gulp-minify-css'),  //CSS压缩
    rename = require('gulp-rename'),        // 重命名
    fs = require('fs');

var browserSync = require('browser-sync');

var _ = require('lodash'),
    argv = require('yargs').argv,
    config_sass = require('../config').sass,
    set_env = require('../config').set_env;

function isRelease() {
    return !!argv.release;
}

//多个sass文件合并为一个css文件
gulp.task('sass_to_together', function () {
    var entries = [],
        stream;
    _.forEach(config_sass.pages, function (entry) {
        var curEntryName = 'app.scss',
            curEntry = config_sass.src + entry + '/scss/' + curEntryName;
        if (!fs.existsSync(curEntry)) {//如果当前语言没有入口文件，则使用默认的入口文件
            //curEntry = config_sass.src + curEntryName;
        }
        entries.push(curEntry);
    });

    stream = gulp.src(entries);

    if (isRelease()) {
        stream.pipe(sass())
            .pipe(rename('app.css'))
            .pipe(minifycss())
            .pipe(gulp.dest(set_env.environment[0] + '/css/'))
            .pipe(notify({message: 'the less_to_together to build complete'}));
    } else {
        stream.pipe(sourcemaps.init())
            .pipe(sass())
            .pipe(rename('app.css'))
            .pipe(sourcemaps.write('./maps'))
            .pipe(gulp.dest(set_env.environment[1] + '/css/'))
            .pipe(notify({message: 'the sass_to_together to develop complete'}));
    }

    return stream;
});

//单个sass文件转换为css文件
gulp.task('sass_to_oneself', function (callback) {

    _.forEach(config_sass.pages, function (page) {
        var curEntryName = 'app.scss',
            curEntry = config_sass.src + page + '/scss/' + curEntryName;
        if (!fs.existsSync(curEntry)) {//如果当前语言没有入口文件，则使用默认的入口文件
            //curEntry = config_sass.src + curEntryName;
        }

        gulp.src(curEntry)
            .pipe(sass())
            .pipe(rename('app.css'))
            .pipe(minifycss())
            .pipe(gulp.dest(config_sass.src + page+ '/'))
            .pipe(browserSync.reload({stream: true}))
            .pipe(notify({message: 'the sass_to_oneself to build complete'}));
    });
    callback();

});




