var fs = require('fs'),
    path = require('path'),
    co = require('co'),
    replaceStream = require('replacestream');

var argv = process.argv.slice(2);

if (argv.length === 0) {
    console.log('Usage: node init [filename] ');
    return;
}

// 目录遍历
var walk = function(dir, done) {
    var results = [];
    return new Promise(
        // The resolver function is called with the ability to resolve or
        // reject the promise
        function(resolve, reject) {

            fs.readdir(dir, function(err, list) {
                if (err) return reject(err);
                var pending = list.length;
                if (!pending) return done(null, results);
                list.forEach(function(file, i) {
                    file = path.resolve(dir, file);

                    fs.stat(file, function(err, stat) {
                        if (stat && stat.isDirectory()) {

                            results.push(file);
                            var index = i + 1;
                            if (index == pending) {
                                resolve(results);
                            }
                            // walk(file, function(err, res) {
                            //   results = results.concat(res);
                            //   if (!--pending) done(null, results);
                            // });
                        }
                    });
                });
            });

        });
};


co(function*() {
    var result = yield walk(path.join(__dirname, 'src'));
    return result;
}).then(function(fileNameArr) {

    var files = [],
        filesArr = [];

    for (var fileName of fileNameArr) {
        files.push(fileName.split("\\").pop());
    }

    for (var file of files) {
        if (file == argv[0]) {
            console.log("init the project of " + argv[0] + "!")
            filesArr.push(file);
        }
    }

    if (filesArr.length === 0) {
        console.log("Without this project!")
        yield;
    } else {
        GO();
    }

}, function(err) {
    console.error(err.stack);
});


// 创造新的 'js' 文件
function init(appName, src_file, to_file) {
    return new Promise(
        // The resolver function is called with the ability to resolve or
        // reject the promise
        function(resolve, reject) {

            var readStream = fs.createReadStream(path.join(__dirname, 'gulp', src_file))
                .pipe(replaceStream('_PROJECT_', '"' + appName + '"'));
            var writeStream = fs.createWriteStream(path.join(__dirname, to_file));

            readStream.on('data', function(chunk) { // 当有数据流出时，写入数据
                if (writeStream.write(chunk) === false) { // 如果没有写完，暂停读取流
                    readStream.pause();
                }
            });

            writeStream.on('drain', function() { // 写完后，继续读取
                readStream.resume();
            });

            readStream.on('end', function() { // 当没有数据时，关闭数据流
                writeStream.end();
                resolve(true);
            });

        });
};

function GO() {
    co(function*() {
        // resolve multiple promises in parallel
        var a = yield init(argv[0], 'gulpfile.init.js', 'gulpfile.js');
        var res = yield [a];
        console.log(res);
        // => [1, 2]
    }).catch(onerror);

    // errors can be try/catched
    co(function*() {
        try {
            yield Promise.reject(new Error('boom'));
        } catch (err) {
            console.error(err.message); // "boom"
        }
    }).catch(onerror);

    function onerror(err) {
        // log any uncaught errors
        // co will not throw any errors you do not handle!!!
        // HANDLE ALL YOUR ERRORS!!!
        console.error(err.stack);
    }
}
