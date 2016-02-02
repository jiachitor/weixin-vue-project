var src = './src/',
    build = './build/',
    appName = 'dzone_console_react',
    htmls = ['index'],
    langs = ['en'],
    environment = ['build','develop'],
    pages = ['app'],
    watch_pages = ['app'],
    dest = {
        "entries": ["app.js"],
        "outputFile": "app.bundle.js",
        "dependencies": "react"
    };

var options = {
    userName: 'baina',
    password: '123456',
    privateKey: './gulp/baina.key',
    packageName: 'dzone_console_react',
    packageRootDir: '/var/app/weibonews/available/r',
    packageDir: '/var/app/weibonews/available/r',
    appName: 'dzone_console_react',
    appDir: '/var/app/weibonews/enabled',
};


module.exports = {
    'jshint': {
        src: src + '**/*.js',
    },
    'browserSync':{
        browser: ["google chrome"],
        port: 3000,
        server: {
            baseDir: src
        }
    },
    'browserify': {
        src: src,
        pages: pages,
        watch_pages: watch_pages,
        langs: langs,
        dest: dest
    },
    'sass': {
        src: src,
        pages: pages
    },
    'watch': {
        src: src
    },
    'set_env': {
        environment: environment
    },
    'deploy':{
        options: options
    },
    'cleanUp':{
        packageName:appName
    },
    'timeStamp':{
        packageName:appName
    },
    'uglify':{
        packageName:appName
    },
    'tar_gz':{
        packageName:appName
    }
};