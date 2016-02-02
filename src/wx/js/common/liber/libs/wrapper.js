define(['./array','./lang'],function(ArrUtil,L){
    
    var wrapper = function(obj){
        
        this._wrapped = obj;
        this._chain = false;
    }
    
    wrapper.prototype.chain = function(){
        this._chain = true;
        return this;
    }
    
    wrapper.prototype.value = function(){
        
        return arguments.length > 0 ? 
                    (L.likeArray(this._wrapped ) ? 
                        ArrUtil._at(this._wrapped,arguments[0]) : this._wrapped[arguments[0]]) : 
                        this._wrapped;
    }
    
    wrapper.prototype.old = function(){
        return wrapper._result(this._old,this._chain);
    }
    
    wrapper._result = function (obj, chain, old) {
        obj = obj instanceof wrapper ? obj : new wrapper(obj);
        obj._old = old;
        return chain ? obj.chain() : obj.value();
    };

    
    
    
    return wrapper;
});