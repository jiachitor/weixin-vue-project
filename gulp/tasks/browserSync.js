var gulp = require('gulp');
var browserSync = require('browser-sync');
var _ = require('lodash');

var http = require('http');
var url = require('url');

var config_browserSync = require('../config').browserSync;

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
    var clientRequest = http.request(options, function (clientResponse) {
        res.writeHead(clientResponse.statusCode, clientResponse.headers);
        clientResponse.pipe(res, {end: false});
        clientResponse.on("end", function () {
            res.addTrailers(clientResponse.trailers);
            res.end();
        });
    });
    req.pipe(clientRequest);

}

gulp.task('browserSync', function (callback) {
    browserSync({
        browser: config_browserSync.browser,
        port: config_browserSync.port,
        server: {
            baseDir: config_browserSync.server.baseDir,
            middleware: [
                require('compression')(),
                function (req, res, next) {
                    var urlObj = url.parse(req.url);
                    //如果是图片
                    if (/^(\/)?image\//i.test(urlObj.path)) {
                        proxyTo('image.dolphin.com', req, res);
                    }else if (/^(\/)?\/admin\/api\//i.test(urlObj.path)) {
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
});