var gulp = require('gulp'),
    replace = require('gulp-replace'),
    uglify = require('gulp-uglify'),
    targz = require('tar.gz'),
    del = require('del');

var config_move = require('../config').move;
var config_cleanUp = require('../config').cleanUp;
var config_timeStamp = require('../config').timeStamp;
var config_uglify = require('../config').uglify;
var config_tar_gz = require('../config').tar_gz;

function clean(callback){
    del(['build'], callback);
}

function moveApp(callback){
    gulp.src([config_move.src + '/app/*'])
        .pipe(gulp.dest(config_move.dest+ '/' + config_move.packageName + '/app/'))
        .on('finish', callback);
}

function moveLibs(callback){
    gulp.src([config_move.src + '/libs/react/**/*'])
        .pipe(gulp.dest(config_move.dest+ '/' + config_move.packageName + '/react/'))
        .on('finish', callback);
}

function cleanUp(callback){
    console.log("cleanup doing");
    del(['build/'+ config_cleanUp.packageName +'/app/js', 'build/'+ config_cleanUp.packageName +'/app/scss'],callback)
}

function moveIndex(callback){
    gulp.src('build/'+ config_timeStamp.packageName +'/app/index.html')
        .pipe(gulp.dest('build/'+ config_timeStamp.packageName +'/temporary'))
        .on('finish', callback);
}

function replaceT(callback){
    var time= (new Date()).valueOf();
    gulp.src('build/'+ config_timeStamp.packageName +'/temporary/index.html')
        .pipe(replace('app.css', "app.css?version="+time))
        .pipe(replace('app.bundle.js', "app.bundle.js?version="+time))
        .pipe(gulp.dest('build/'+ config_timeStamp.packageName +'/app'))
        .on('finish', callback);
}

gulp.task('timeStamp', gulp.series(moveIndex, replaceT));

function moveJs(callback){
    gulp.src('build/'+ config_uglify.packageName +'/app/app.bundle.js')
        .pipe(gulp.dest('build/'+ config_uglify.packageName +'/temporary'))
        .on('finish', callback);
}

function uglifying(callback){
    gulp.src('build/'+ config_uglify.packageName +'/temporary/app.bundle.js')
        .pipe(uglify())
        .pipe(gulp.dest('build/'+ config_uglify.packageName +'/app'))
        .on('finish', callback);
}

gulp.task('uglify', gulp.series(moveJs, uglifying));

function tar_gz(callback){
    console.log('Compression Start!');
    var compress = new targz().compress('build/'+ config_tar_gz.packageName, 'build/'+ config_tar_gz.packageName +'.tar.gz', function(err){
        if(err){
            console.log(err);
        }
        console.log('The compression has ended!');
    });
    callback();
}

gulp.task('build',gulp.series(
    clean,
    gulp.parallel(
        moveApp,
        moveLibs
    ),
    gulp.parallel(
        cleanUp,
        'timeStamp',
        'uglify'
    ),
    tar_gz
));
