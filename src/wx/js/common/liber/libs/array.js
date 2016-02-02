define(['./native', './lang'], function(native, L) {
    var toArray = function(obj) {
        if (L.isNull(obj) || L.isUndefined(obj)) return [];

        if (L.likeArray(obj)) {
            return Array.prototype.slice.call(obj);
        }
        if (obj.toArray && L.isFunction(obj.toArray)) return obj.toArray();
        return [obj];
    };

    function _composeArrNativeFn(fnName, replace) {
        var nativeMethod = native[fnName];
        return function() {
            if (fnName !== 'indexOf' && fnName !== 'lastIndexOf' && !L.isFunction(arguments[1])) {
                throw new TypeError(arguments[1] + " is not a function!");
            }
            //console.log(arguments[0]);
            var len = Object(arguments[0]).length >>> 0;

            if (nativeMethod && arguments[0]) {
                var result = nativeMethod.apply(arguments[0], Array.prototype.slice.call(arguments, 1));
                if (fnName === 'forEach') { // in order to be chainable
                    result = arguments[0];
                }
                return result;
            } else {

                return replace.apply(this, [len].concat(toArray(arguments)));
            }
        };
    }
    var forEach = _composeArrNativeFn('forEach', function(len, obj, fn, context) {

        for (var index = 0; index < len; index++) {
            if (index in obj) {
                fn.call(context, obj[index], index, obj);
            }
        }
        return obj;

    });

    var map = _composeArrNativeFn('map', function(len, obj, fn, context) {

        var resultArr = new Array(len);
        for (var index = 0; index < len; index++) {
            if (index in obj) {
                resultArr[index] = fn.call(context, obj[index], index, obj);
            }
        }
        return resultArr;
    });

    var every = _composeArrNativeFn('every', function(len, obj, fn, context) {
        if (this && this._chain) {
            this._chain = false;
        }
        for (var index = 0; index < len; index++) {
            if (index in obj) {
                if (!fn.call(context, obj[index], index, obj)) return false;
            }
        }

        return true;
    });

    var some = _composeArrNativeFn('some', function(len, obj, fn, context) {
        if (this && this._chain) {
            this._chain = false;
        }
        for (var index = 0; index < len; index++) {
            if (index in obj && fn.call(context, obj[index], index, obj)) {
                return true;
            }
        }
        return false;
    });

    var filter = _composeArrNativeFn('filter', function(len, obj, fn, context) {
        var result = [];
        for (var index = 0; index < len; index++) {
            if (index in obj && fn.call(context, obj[index], index, obj)) {
                result.push(obj[index]);
            }
        }
        return result;
    });

    var reduce = _composeArrNativeFn('reduce', function(len, obj, fn, memo, context) {
        var result, index = 0;
        if (arguments.length < 4) {
            if (len === 0) {
                throw new TypeError("Reduce of empty array with no initial value!");
            }

            result = obj[0];
            index = 1;
        } else {
            result = memo;
        }

        for (; index < len; index++) {
            if (index in obj) {
                result = fn.call(context, result, obj[index], index, obj);
            }
        }
        return result;
    });

    var reduceRight = _composeArrNativeFn('reduceRight', function(len, obj, fn, memo, context) {
        var result, index = len - 1;
        if (arguments.length < 4) {
            if (len === 0) {
                throw new TypeError("Reduce of empty array with no initial value!");
            }

            result = obj[len - 1];
            index = len - 2;
        } else {
            result = memo;
        }

        for (; index >= 0; index--) {
            if (index in obj) {
                result = fn.call(context, result, obj[index], index, obj);
            }
        }
        return result;
    });

    var rest = function(obj){
        return Array.prototype.slice.call(obj, 1);
    };
    //tools 
    var _equals = function(o1, o2, fn, context) {
        if (fn && L.isFunction(fn)) {
            return fn.call(context, o1, o2);
        } else {
            return o1 === o2;
        }
    };
    var indexOf = function(obj, target, fromIndex, fn, context) {
        if (this && this._chain) {
            this._chain = false;
        }
        if (native['indexOf'] && arguments.length <= 3) {
            return native['indexOf'].call(obj, target, fromIndex);
        }
        var index, len = Object(obj).length >>> 0;

        if (!L.isNumber(fromIndex)) {
            index = 0;
        } else {
            var absIndex = Math.floor(Math.abs(fromIndex));
            index = fromIndex < 0 ? Math.max(0, len - absIndex) : absIndex;
        }

        for (; index < len; index++) {
            if (index in obj) {
                if (_equals(target, obj[index], fn, context)) {
                    return index;
                }
            }
        }
        return -1;
    };

    var lastIndexOf = function(obj, target, fromIndex, fn, context) {
        if (this && this._chain) {
            this._chain = false;
        }
        if (native['lastIndexOf'] && arguments.length <= 3) {
            return native['lastIndexOf'].call(obj, target, fromIndex);
        }

        if (!L.isNumber(fromIndex) || (1 - Math.abs(fromIndex) > 0)) return -1;

        var index,
            len = Object(obj).length >>> 0,
            absIndex = Math.floor(Math.abs(fromIndex));

        index = fromIndex >= 0 ? Math.min(len - 1, absIndex) : (len - absIndex);

        for (; index >= 0; index--) {
            if (index in obj) {
                if (_equals(target, obj[index], fn, context)) {
                    return index;
                }
            }
        }
        return -1;
    };



    var _at = function(arr, index) {
        index = index < 0 ? arr.length + index : index;
        return arr[index];
    };

    var findOne = function(arr, fn, context) {
        var result;
        some(arr, function(item, index, arr) {
            var found = fn.call(this, item, index, arr);
            if (found) {
                result = item;
            }
            return found;
        }, context);
        return result;
    };

    var include = function(obj, target, fn, context) {
        if (this && this._chain) {
            this._chain = false;
        }
        return indexOf(obj, target, 0, fn, context) !== -1;
    };
    var contain = function(obj, arr, fn, context) {
        if (this && this._chain) {
            this._chain = false;
        }
        if (!L.likeArray(arr)) {
            throw new TypeError(arr + " should be a array like object!");
        }
        return every(arr, function(v) {
            return include(obj, v, fn, this);
        }, context);
    };

    var uniq = function(obj, fn, context) {
        return reduce(obj, function(memo, item) {
            if (!include(memo, item, fn, this)) {
                memo.push(item);
            }
            return memo;
        }, [], context);
    };

    var intersect = function(obj, arr, fn, context) {
        var result = [];
        if (!L.likeArray(arr)) {
            throw new TypeError(arr + " should be a array like object!");
        }

        return reduce(arr, function(memo, item) {
            if (include(obj, item, fn, this)) {
                memo.push(item);
            }
            return memo;
        }, result, context);
    };

    var union = function(obj, arr, fn, context) {
        var result = toArray(obj);
        if (!L.likeArray(arr)) {
            throw new TypeError(arr + " should be a array like object!");
        }

        return reduce(arr, function(memo, item) {
            if (!include(obj, item, fn, this)) {
                memo.push(item);
            }
            return memo;
        }, result, context);

    };

    var subtract = function(obj, arr, fn, context) {
        var result = [];
        if (!L.likeArray(arr)) {
            throw new TypeError(arr + " should be a array like object!");
        }
        fn = fn ? function() {
            return fn.call(this, arguments[1], arguments[0]);
        } : null;
        return reduce(obj, function(memo, item) {
            if (!include(arr, item, fn, this)) {
                memo.push(item);
            }
            return memo;
        }, result, context);

    };

    var flatten = function(obj) {
        return reduce(map(obj, toArray), function(memo, arr) {
            return memo.concat(arr);
        }, []);
    };

    var replace = function(obj, sub, finder, context) {
        var fn = L.isFunction(finder) ? finder : function(item) {
                return item === finder;
            };
        forEach(obj, function(item, index) {
            if (fn.call(this, item)) {
                obj[index] = sub;
            }
        }, context);
        return obj;
    };

    var fillInOrder = function(obj, arr, finder, tailed, context) {
        tailed = tailed === void 0 ? true : tailed;
        if (!L.likeArray(arr)) {
            throw new TypeError(arr + " should be a array like object!");
        }
        arr = toArray(arr);
        var fn = L.isFunction(finder) ? finder : function(item) {
                return item === finder;
            };
        every(obj, function(item, index) {
            if (arr.length > 0 && fn.call(this, item)) {
                obj[index] = Array.prototype.shift.call(arr);

            }
            return arr.length;
        }, context);

        if (arr.length > 0 && tailed) Array.prototype.splice.apply(obj, [obj.length, 0].concat(arr));
        return obj;
    };

    function arrayGuard(fn) {
        return function() {
            var obj = arguments[0];
            if (!L.likeArray(obj)) {
                throw new TypeError(obj + " should be array like object!");
            }
            return fn.apply(this, toArray(arguments));
        };
    }

    var mutators = reduce(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(memo, name) {
        var method = Array.prototype[name];
        memo[name] = arrayGuard(function(obj) {
            var args = [].slice.call(arguments, 1);
            method.apply(obj, args);
            var length = obj.length;
            if ((name == 'shift' || name == 'splice') && length === 0) delete obj[0];
            return obj;
        });
        return memo;
    }, {});

    var accessors = reduce(['concat', 'slice'], function(memo, name) {
        var method = Array.prototype[name];
        memo[name] = arrayGuard(function(obj) {
            var args = [].slice.call(arguments, 1);
            return method.apply(obj, args);
        });
        return memo;
    }, {});
    var join = arrayGuard(function(obj) {
        this._chain = false;
        var args = [].slice.call(arguments, 1);
        return Array.prototype.join.apply(obj, args);
    });

    return L.extend({
        toArray: toArray,
        forEach: forEach,
        map: map,
        every: every,
        some: some,
        filter: filter,
        reduce: reduce,
        reduceRight: reduceRight,
        rest: rest,
        indexOf: indexOf,
        lastIndexOf: lastIndexOf,
        _at: arrayGuard(_at),
        findOne: arrayGuard(findOne),
        include: arrayGuard(include),
        contain: arrayGuard(contain),
        uniq: arrayGuard(uniq),
        intersect: arrayGuard(intersect),
        union: arrayGuard(union),
        subtract: arrayGuard(subtract),
        flatten: arrayGuard(flatten),
        replace: arrayGuard(replace),
        fillInOrder: arrayGuard(fillInOrder),
        join: join
    }, mutators, accessors);
});