define(function(){
    var ArrayProto = Array.prototype,
        ObjProto = Object.prototype,
        FuncProto = Function.prototype;


    return {
        forEach      : ArrayProto.forEach,
        map          : ArrayProto.map,
        reduce       : ArrayProto.reduce,
        reduceRight  : ArrayProto.reduceRight,
        filter       : ArrayProto.filter,
        every        : ArrayProto.every,
        some         : ArrayProto.some,
        indexOf      : ArrayProto.indexOf,
        lastIndexOf  : ArrayProto.lastIndexOf,
        isArray      : Array.isArray,
        keys         : Object.keys,
        bind         : FuncProto.bind

    };

});
