var gulp = require('gulp'),
    argv = require('yargs').argv,
    config = require('../config').set_env;

gulp.task('set-env', function () {
    //argv.release 是指在输入 gulp set-env 命令时是否带有 --release 参数，并且这个参数可以被赋值
    //加入 --release 参数表示线上部署
    global.gulp.buildDir = argv.release ? config.environment[0] : config.environment[1];
});