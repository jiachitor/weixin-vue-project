var gulp = require('gulp');
var _config_watch = require('../config').watch;

function watchProcess(callback){
    gulp.watch([
        _config_watch.src + '*/*.scss',
        _config_watch.src + '*/scss/*.scss'
    ], gulp.series('sass_to_oneself'));
    callback();
}

//wuhan 172.16.77.64
gulp.task('watch', gulp.series(
    'browserSync',
    'browserify_to_oneself',
    watchProcess
));
