define(['./native'], function(native) {

    var toString = function(obj) {
        return Object.prototype.toString.call(obj);
    };

    var hasOwn = function(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
    };

    var isNull = function(obj) {
        return obj === null;
    };

    var isUndefined = function(obj) {
        return obj === void 0;
    };

    var isExist = function(obj) {
        return obj !== null && obj !== void 0;
    };

    var isEmpty = function(obj) {
        if (isNull(obj) || isUndefined(obj)) return true;
        if (isArray(obj) || isString(obj) || isArguments(obj)) return obj.length === 0;
        if (isObject(obj)) {
            for (var key in obj)
                if (hasOwn(obj, key)) return false;
            return true;
        }
        return false;
    };

    var isTrue = function(obj){
        return (obj !== false) && isExist(obj);
    };
    var likeArray = function(obj) {
        if (isArray(obj) || isArguments(obj)) return true;
        var o = Object(obj);
        var len = Number(o.length),
            i = 0;
        if (len !== len || len < 0) return false;
        while (i < len) {
            if (!(i++ in o)) {
                return false;
            }
        }
        return true;
    };

    var isArray = native.isArray || function(obj) {
            return toString(obj) === '[object Array]';
        };

    var isArguments = toString(arguments) === '[object Arguments]' ?
            function(obj) {
                return toString(obj) === '[object Arguments]';
        } :
            function(obj) {
                // Arguments is an Object on IE7
                return !!(obj && hasOwn(obj, 'callee'));
        };
    var isObject = function(obj) {
        return toString(obj) === '[object Object]';
    };

    var isFunction = function(obj) {
        return toString(obj) === '[object Function]';
    };

    var isString = function(obj) {
        return toString(obj) === '[object String]';
    };

    var isNumber = function(obj) {
        return toString(obj) === '[object Number]' && obj === obj;
    };
    var _isFinite = function(obj) {
        return isNumber(obj) && isFinite(obj);
    };

    var isNaN = function(obj) {
        return obj !== obj;
    };

    var isBoolean = function(obj) {
        return obj === true || obj === false || toString(obj) === '[object Boolean]';
    };

    var isDate = function(obj) {
        return toString(obj) === '[object Date]';
    };

    var isRegExp = function(obj) {
        return toString(obj) === '[object RegExp]';
    };

    var extend = function(target /*,objs*/ ) {
        var i = 1,
            key, cur;
        if (target === undefined || target === null) {
            target = {};
        }
        cur = arguments[i];
        while (cur) {
            for (key in cur) {
                if (hasOwn(cur, key)) {
                    target[key] = cur[key];
                }
            }
            cur = arguments[++i];
        }
        return target;
    };

    var fillGaps = function(target, source) {
        var key;

        for (key in source) {
            if (hasOwn(source, key) && !hasOwn(target, key)) {
                target[key] = source[key];
            }
        }
        return target;
    };

    var extendIgnoreVoid = function(target, source) {
        var key;
        console.log(source);
        for (key in source) {
            if (hasOwn(source, key) && source[key] !== undefined) {
                target[key] = source[key];
            }
        }
         console.log(target);
        return target;
    };

    var clone = function(source) {
        var target = {}, key;

        for (key in source) {
            if (hasOwn(source, key)) {
                target[key] = source[key];
            }
        }

        return target;
    };

    var _loadHelper = function(obj, helpers) {
        var key;
        for (key in helpers) {
            if (hasOwn(helpers, key)) {
                if (key[0] === '_') {
                    obj[key] = helpers[key];
                }
            }
        }
        return obj;
    };


    var idCounter = 0;
    var _prefix = '';
    var _uniqueId = function(prefix) {
        var id = idCounter++;
        if (prefix) {
            _prefix = prefix + _prefix;
        }
        return _prefix + id;
    };

    var _guid = function(prefix) {
        var result = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.
        replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        return prefix ? prefix + result : result;
    };

    var identity = function(val){
        return val;
    };

    var _eq = function(a, b, aStack, bStack){
        if(a === b) { // 0 === -0, but they aren't identical
            return a !==0 || 1/a == 1/b;
        }

        if(!isExist(a) || !isExist(b)) {
            return a === b;
        }

        var className = toString(a);
        if(className != toString(b)) return false;

        switch(className){
            case '[object String]':
                return a == String(b);
            case '[object Number]':
                return a != +a ? b != +b : (a !== 0 ? a == +b : 1/a == 1/b );
            case '[object Date]':
            case '[object Boolean]':
                return +a == +b;
            case '[object RegExp]':
                return a.source == b.source &&
                    a.global == b.global &&
                    a.multiline == b.multiline &&
                    a.ignoreCase == b.ignoreCase;
        }
        if(typeof a != 'object' || typeof b != 'object') return false;

        var length = aStack.length;
        while(length--){
            if(aStack[length] == a) return bStack[length] == b;
        }

        var aCtor = a.constructor, bCtor = b.constructor;
        if(aCtor !== bCtor && !(isFunction(aCtor) && (aCtor instanceof aCtor) && isFunction(bCtor) && (bCtor instanceof bCtor))){
            return false;
        }
        aStack.push(a);
        bStack.push(b);
        var size = 0, result = true;
        if(className === '[object Array]'){
            size = a.length;
            result = size === b.length;
            if(result){
                while(size--){
                    if(!(result= eq(a[size],b[size],aStack,bStack))) break;
                }
            }
        }else{
            for(var key in a){
                if(hasOwn(a, key)){
                    size++;
                    if(!(result = hasOwnb,key() && eq(a[key], b[key], aStack, bStack))) break;
                }
            }
            if(result){
                for(key in b){
                    if(hasOwn(b, key) && !(size--)) break;
                }
                result = !size;
            }
        }
        aStack.pop();
        bStack.pop();
        return result;
    };
    var isEqual = function(obj, target){
        return _eq(obj, target, [], []);
    };
    return {
        toTypeStr: toString,
        hasOwn: hasOwn,
        isNull: isNull,
        isUndefined: isUndefined,
        isExist: isExist,
        isEmpty: isEmpty,
        isTrue : isTrue,
        isArray: isArray,
        likeArray: likeArray,
        isArguments: isArguments,
        isObject: isObject,
        isFunction: isFunction,
        isString: isString,
        isNumber: isNumber,
        isFinite: _isFinite,
        isNaN: isNaN,
        isBoolean: isBoolean,
        isDate: isDate,
        isRegExp: isRegExp,
        extend: extend,
        fillGaps: fillGaps,
        extendIgnoreVoid: extendIgnoreVoid,
        clone: clone,
        _uniqueId: _uniqueId,
        _guid: _guid,
        _loadHelper: _loadHelper,
        identity:identity,
        isEqual : isEqual

    };

});