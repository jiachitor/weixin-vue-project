var extend = require('util')._extend,
    _ = require('lodash'),
    gulp = require('gulp'),
    ssh = require('gulp-ssh'),
    shell = require('gulp-shell'),
    runSequence = require('run-sequence'),
    fs = require('fs');

var config_deploy = require('../config').deploy,
    options = config_deploy.options;

// 服务器代码部署
function _deploy(_options){

    options = extend(options, _options);

    var ssh_config = {
        host: options.host,
        port: 22,
        username: options.userName,
        debug:function(str){
            //console.log(str);
        }
    };

    if(options.usedFor === 'development'){
        ssh_config  = extend(ssh_config, {password:options.password});
    }else if(options.usedFor === 'production'){
        ssh_config  = extend(ssh_config, {privateKey:fs.readFileSync(options.privateKey).toString()});
    }

    // 通过ssh 上传到服务器的目录可以通过 ssh 客户端登陆验证一下。
    // 控制台默认是上传至 /home/baina   ，通过pwd 命令查看
    var gulpSSH = new ssh({
        ignoreErrors: false,
        sshConfig: ssh_config
    });

    // put local file to server
    //gulp.task('sftp-write', function (callback) {
    //    gulp.src('build/'+options.packageName+'.tar.gz')
    //        .pipe(gulpSSH.sftp('write', options.packageName+'.tar.gz'))
    //        .on('finish', callback);
    //});

    // put local file to server
    gulp.task('sftp-write', function () {
        gulp.src('build/'+options.packageName+'.tar.gz')
            .pipe(gulpSSH.sftp('write', options.packageName+'.tar.gz'))
            .on('finish', function(){
                var time= (new Date());
                console.log("[" + time + "]" + " Finished 'sftp-write'");
                setTimeout(function(){
                    var shell = gulp.series('shell');
                    shell();
                },1000);
            });
    });

    // execute commands in shell
    gulp.task('shell', function (callback) {
        var config = {
                rootDir:options.packageRootDir,
                distDir: options.packageDir,
                package: options.packageName,
                backupDirName:options.packageName + '_old',
                rootBackupDir: options.packageRootDir + '/' + options.packageName + '_old',
                backupDir: options.packageDir + '/' + options.packageName + '_old',
                appDir: options.appDir,
                app: options.appName,
                appDist: 'dzone-console-1.0dev/root/app',
                appSrc: options.packageName + '/app',
                libsReactDist:'dzone-console-1.0dev/root/libs/react',
                libsReactSrc: options.packageName + '/react'
            },
            postUploadCommand = 'mkdir -p -m a+rw <%= distDir %>;mv -f /home/baina/<%= package %>.tar.gz  <%= distDir %>/;rm -rf <%= rootBackupDir %>;rm -rf <%= backupDir %>;mkdir -p -m a+rxw <%= backupDir %>;cd <%= distDir %>;rm -rf ./<%= appDist %>;rm -rf ./<%= libsReactDist %>;chmod a+wx <%= package %>.tar.gz;tar zxvf <%= package %>.tar.gz;chmod -R a+wx ./<%= package %>;mv -f ./<%= appSrc %>  ./dzone-console-1.0dev/root/;mv -f ./<%= libsReactSrc %>  ./dzone-console-1.0dev/root/libs/;rm -f <%= package %>.tar.gz;rm -rf <%= package %>',
            command = _.template(postUploadCommand)(config).split(";");

        gulpSSH
            .shell(command, {filePath: 'shell.log'})
            .pipe(gulp.dest('logs'))
            .on('finish', callback);
    });

    var deploy = gulp.series('sftp-write','shell');
    deploy();
}

// 武汉国际版测试服务器
gulp.task('deploy_test', function(){

    var _options = {
        host:'172.16.77.64',
        usedFor:'development'
    };

    _deploy(_options);
});

// Dolphin News 日本服务器
gulp.task('deploy_int_jp', function(){

    var _options = {
        host:'54.248.108.236',
        usedFor:'production'
    };

    _deploy(_options);
});

// Dolphin News 法兰克福服务器
gulp.task('deploy_int_fk', function(){

    var _options = {
        host:'54.93.54.41',
        usedFor:'production'
    };

    _deploy(_options);
});

// Dolphin News 新加坡服务器
gulp.task('deploy_int_sp', function(){

    var _options = {
        host:'52.74.111.138',
        usedFor:'production'
    };

    _deploy(_options);
});

// Dolphin News 中文版服务器
gulp.task('deploy_cn_ali', function(){

    var _options = {
        host:'112.124.48.170',
        usedFor:'production'
    };

    _deploy(_options);
});

// topstory  法兰克福服务器
gulp.task('deploy_ts_int_fk', function(){

    var _options = {
        host:'54.93.192.163',
        usedFor:'production'
    };

    _deploy(_options);
});



