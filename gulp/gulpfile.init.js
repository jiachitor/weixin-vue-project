var http = require('http'),
    url = require('url'),
    exec = require('child_process').exec,
    fs = require('fs'),
    path = require('path'),
    extend = require('util')._extend;

var _ = require('lodash'),
    argv = require('yargs').argv,
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    minifycss = require('gulp-minify-css'),
    ssh = require('gulp-ssh'),
    targz = require('tar.gz'),
    browserSync = require('browser-sync'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    watchify = require('watchify'),
    gutil = require('gulp-util'),
    source = require('vinyl-source-stream'),
    gulpif = require('gulp-if'),
    streamify = require('gulp-streamify'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    del = require('del'),
    vueify = require('vueify'),
    babel = require("gulp-babel"),
    aliasify = require('aliasify'),
    rename = require('gulp-rename');

/*------------------------------------------开发项目-------------------------------------------*/
// 代理方法


function proxyTo(host, req, res) {
    var toUrl = ('http://' + host + req.url)
        .replace(/(\/image\/)/, '/');
    console.log("[proxy url] " + toUrl);
    console.log("------------------------------------");
    var location = url.parse(toUrl);

    var options = {
        host: location.host,
        hostname: location.hostname,
        port: location.port,
        method: req.method,
        path: location.path,
        headers: req.headers,
        auth: location.auth
    };
    options.headers.host = location.host;

    if (req.headers.referer) {
        options.headers.referer = req.headers.referer.replace(/^(http:\/\/)?([^\/])+\//, "$1" + host + "/");
    }

    console.log("[proxy request]");
    console.log(options);
    console.log("------------------------------------");
    var clientRequest = http.request(options, function(clientResponse) {
        res.writeHead(clientResponse.statusCode, clientResponse.headers);
        clientResponse.pipe(res, {
            end: false
        });
        clientResponse.on("end", function() {
            res.addTrailers(clientResponse.trailers);
            res.end();
        });
    });
    req.pipe(clientRequest);

}

function browserSyncTask(callback) {
    browserSync({
        browser: ["google chrome"],
        port: 3000,
        server: {
            baseDir: './src/',
            middleware: [
                require('compression')(),
                function(req, res, next) {
                    var urlObj = url.parse(req.url);
                    //如果是图片
                    if (/^(\/)?image\//i.test(urlObj.path)) {
                        proxyTo('image.dolphin.com', req, res);
                    } else if (/^(\/)?\/admin\/api\//i.test(urlObj.path)) {
                        proxyTo('172.16.77.64', req, res);
                    } else {
                        next();
                    }
                }
            ]
        },
        //proxy: {
        //    target: "localhost",
        //    reqHeaders: function (config) {
        //        return {
        //            "host": "172.16.77.64",
        //            "accept-encoding": "identity",
        //            "agent":           false
        //        }
        //    }
        //}
        // open: true
    });
    callback();
}


var _browserify_ = function(options) {

    aliasifyConfig = {
        aliases: {
            "node_modules": path.join(__dirname, "node_modules/"),
            "_actions": path.join(__dirname, "src/" + _PROJECT_ + "/js/actions"),
            "_config": path.join(__dirname, "src/" + _PROJECT_ + "/js/config"),
            "_common": path.join(__dirname, "src/" + _PROJECT_ + "/js/common"),
            "_components": path.join(__dirname, "src/" + _PROJECT_ + "/js/components"),
            "_filters": path.join(__dirname, "src/" + _PROJECT_ + "/js/filters"),
            "_data": path.join(__dirname, "src/" + _PROJECT_ + "/js/data"),
            "_stores": path.join(__dirname, "src/" + _PROJECT_ + "/js/stores"),
            "_templates": path.join(__dirname, "src/" + _PROJECT_ + "/js/templates"),
            "_ui": path.join(__dirname, "src/" + _PROJECT_ + "/js/ui"),
            "_utils": path.join(__dirname, "src/" + _PROJECT_ + "/js/utils"),
            '_sass': path.join(__dirname, "src/" + _PROJECT_ + "/sass"),
            '_assets': path.join(__dirname, "src/" + _PROJECT_ + "/assets"),
        },
        verbose: false
    }

    var bundler = browserify();
    bundler.add(options.entries);

    bundler.transform(babelify.configure({
        presets: ["es2015"]
    }));
    bundler.transform(aliasify, aliasifyConfig);
    bundler.transform(vueify);

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
gulp.task('browserify', function(callback) {
    _browserify_({
        development: true,
        base: './src/',
        entries: './src/' + _PROJECT_ + '/js/app.js',
        dest: './src/' + _PROJECT_ + '/static/',
        outputFilename: 'app.js',
    });
    callback();
});

// sass
function sassTask(callback) {
    // Serve files from the root of this project
    gulp.src('./src/' + _PROJECT_ + '/sass/app.scss')
        .pipe(sass().on('error', sass.logError))
        .on('error', gutil.log)
        .pipe(rename('app.css'))
        .pipe(minifycss())
        .pipe(gulp.dest('./src/' + _PROJECT_ + '/static/'))
        .pipe(notify('app.css to build complete'))
        .on('finish', callback);
}



gulp.task('watch', function() {
    var Go = gulp.series(browserSyncTask, 'browserify', sassTask);
    Go();

    gulp.watch([path.join(process.cwd(), 'src', _PROJECT_, 'sass', '*.scss')], gulp.series(sassTask));
    gulp.watch([path.join(process.cwd(), 'src', _PROJECT_, 'static', 'app.css')], browserSync.reload);
});
