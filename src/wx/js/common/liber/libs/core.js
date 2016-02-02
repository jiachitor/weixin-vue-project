define(function(require){
    var slice = Array.prototype.slice,
        unshift = Array.prototype.unshift;
    
    var wrapper = require('./wrapper'),
        ObjUtil = require('./object'),
        ArrUtil = require('./array');
    
    var lib = function(obj){
        if(obj instanceof wrapper){
            return obj;
        }
        return new wrapper(obj);
    }
    
    //console.log(ObjUtil.functions(lang));
    function addToWrapper(name, func) {
        wrapper.prototype[name] = function() {
            var args = slice.call(arguments),
                previousChain = this._chain,
                result;
            var wrapped = this._wrapped;
            unshift.call(args,wrapped);
          
            result = wrapper._result(func.apply(this, args), this._chain,wrapped);
            this._chain = previousChain;
            return result;
        };
    };
    lib.mixin = function(obj){
        ArrUtil.forEach(ObjUtil.functions(obj),function(name){
            if(name[0] !== '_'){
                addToWrapper(name,lib[name] = obj[name]);
            }else{
                lib[name.substr(1)] = obj[name];
            }
        });
       
        return lib;
    };
    lib.chain = function(obj){
        return lib(obj).chain();
    }
    lib.isWrapped = function(obj){
        return obj instanceof wrapper;
    };
    
    lib.VERSION = '0.0.1';
    return lib; 
});