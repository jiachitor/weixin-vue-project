define(['./native', './lang', './array'], function(native, lang, ArrUtil) {


    var keys = native.keys || function(obj) {
        var keys = [],
            key;
        for (key in obj) {
            if (lang.hasOwn(obj, key)) {
                keys.push(key);
            }
        }
        return keys;
    };
    var functions = function(obj) {
        var funcs = [],
            key;
        for (key in obj) {
            if (lang.hasOwn(obj, key) && lang.isFunction(obj[key])) {
                funcs.push(key);
            }
        }
        return funcs;
    };

    var forEachKey = function(obj, fn, context) {
        // console.log(obj);
        ArrUtil.forEach(keys(obj), function(key) {
            var val = obj[key];
            fn.call(this, val, key, obj);
        }, context);
        return obj;
    };



    var reduceKey = function(obj, fn, memo, context) {

        return ArrUtil.reduce(keys(obj), function(memo, key) {
            return fn.call(this, memo, obj[key], key, obj);
        }, memo, context);
        // ArrUtil.reduce.apply(this,[keys(obj),function(memo,key){
        //     return fn.call(this,memo,obj[key],key,obj);
        // }].concat(Array.prototype.slice.call(arguments,2)));
    };

    var mapKey = function(obj, fn, context) {
        return reduceKey(obj, function(memo, v, k) {
            memo[k] = fn.call(this, v, k, obj);
            return memo;
        }, {}, context);
    };

    var result = function(obj, key) {
        if (obj[key] !== void 0) {
            return lang.isFunction(obj[key]) ? obj[key].apply(obj, ArrUtil.slice(arguments, 2)) : obj[key];
        } else {
            return void 0;
        }
    };

    var get = function(obj, key) {
        return key ? (lang.likeArray(obj) ? ArrUtil._at(obj, key) : result(obj[key])) : obj;
    };

    var length = function(obj) {
        if (this._chain) {
            this._chain = false;
        }
        return lang.likeArray(obj) ? obj['length'] : keys(obj).length;
    };


    var create = (function() {
        var ctor = function() {};

        return Object.create || function(obj, attrs) {
            ctor.prototype = obj;
            var o = new ctor();
            forEachKey(attrs, function(description, key) {
                o[key] = description.value;
            });
            return o;
        };
    })();

    function clone(obj) {
        var o;
        if (typeof obj == "object") {
            if (obj === null) {
                o = null;
            } else {
                if (obj instanceof Array) {
                    o = [];
                    for (var i = 0, len = obj.length; i < len; i++) {
                        o.push(clone(obj[i]));
                    }
                } else {
                    o = {};
                    for (var k in obj) {
                        o[k] = clone(obj[k]);
                    }
                }
            }
        } else {
            o = obj;
        }
        return o;
    }


    return {
        keys: keys,
        forEachKey: forEachKey,
        reduceKey: reduceKey,
        mapKey: mapKey,
        functions: functions,
        get: get,
        length: length,
        create: create,
        cloneObj: clone
    };
});