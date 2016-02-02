define(['./lang','./array','./function'],function(L,ArrUtil,F){
    function ltrim(str){
        return (str || '').replace(/^\s+/g, '');
    };
    function rtrim(str){
        return (str || '').replace(/\s+$/g, '');
    };
    function trim(str){
        return (str || '').replace(/^\s+|\s+$/g, '');
    };
    
    
    function upperCase(str){
        return str.toUpperCase();
    };

    function lowerCase(str){
        return str.toLowerCase();
    };
    function _replace(str,reg,sub){
        return str.replace(reg,sub);
    }
    

    function concatWith(str,c,upper){
        str = trim(str);
        return str.replace(/[^\w\-\s\.]/g,'').
                   replace(/[_\s\-\.]+(\w)/g,function(match,l){return c+(upper ? upperCase(l) : l);}).
                   replace(/([a-z])([A-Z])/g,function(m,l1,l2){return l1+c+(upper ? upperCase(l2) : l2);});
                   
    };

    function camelCase(str){
        return concatWith(str,'',true).
                    replace(/^\w/g,lowerCase);
    };

    function hyphenate(str,lower){
        lower = lower === void 0 ? true : lower;
        return lower ? concatWith(str,'-').toLowerCase() : _concatWith(str,'-');
    };

    function underscorelize(str,lower){
        lower = lower === void 0 ? true : lower;
        return lower ? concatWith(str,'_').toLowerCase() : _concatWith(str,'_');
    };

    function strGuard(fn){
        return function(){
            var str = L.isNull(arguments[0]) || 
                      L.isUndefined(arguments[0]) || 
                      L.isNaN(arguments[0])? '' : String(arguments[0]);
            return fn.apply(this,[str].concat(Array.prototype.slice.call(arguments,1)));
        };
    };

    return {
        ltrim : strGuard(ltrim),
        rtrim : strGuard(rtrim),
        trim : strGuard(trim),
        upperCase : strGuard(upperCase),
        lowerCase : strGuard(lowerCase),
        concatWith : strGuard(concatWith),
        camelCase : strGuard(camelCase),
        hyphenate : strGuard(hyphenate),
        underscorelize : strGuard(underscorelize)
    }
});