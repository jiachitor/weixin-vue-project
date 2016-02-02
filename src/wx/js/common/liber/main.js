define(function(require){

    var lib = require('./libs/core'),
        lang = require('./libs/lang'),
        ObjUtil = require('./libs/object'),
        ArrUtil = require('./libs/array'),
        FunUtil = require('./libs/function'),
        StrUtil = require('./libs/string'),
        EvtUtil = require('./libs/event'),
        Flow = require('./libs/flow'),
        Reactive = require('./libs/reactive_obj'),
        Functional = require('./libs/functional');


    lib.mixin(lang).
        mixin(ObjUtil).
        mixin(ArrUtil).
        mixin(FunUtil).
        mixin(StrUtil).
        mixin(EvtUtil).
        mixin(Flow).
        mixin(Reactive);
    lib.fn = Functional._fn;
    return lib;
});
