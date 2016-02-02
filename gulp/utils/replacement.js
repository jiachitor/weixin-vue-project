var through = require('through'),
    _ = require('lodash');

module.exports = function (file, options) {
    var trans = options.i18n,
        appConfig = options.appConfig,
        data = '';
    return through(write, end);

    function write(buf) {
        data += buf;
    }

    function end() {
        this.queue(replacement(data));
        this.queue(null);
    }

    function replacement(data) {
        var reg = /_t\s*\(\s*['"]([^'"\)]*)['"]\s*\)/g,
            configReg = /_c\s*\(\s*['"]([^'"\)]*)['"]\s*\)/g;
        return data
            .replace(reg, function (m, k) {
                if (!trans || !trans[k]) {
                    return JSON.stringify(k);
                } else {
                    return JSON.stringify(trans[k]);
                }
            })
            .replace(configReg, function (m, k) {
                if (!appConfig || !appConfig[k]) {
                    return JSON.stringify(k);
                } else {
                    return JSON.stringify(appConfig[k]);
                }
            });
    }
}