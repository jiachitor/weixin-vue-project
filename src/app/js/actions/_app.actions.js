//import AppDispatcher from '../dispatcher/AppDispatcher';

import * as API from '_utils/_api.util.js';

import Config from './_app.actions.config.js';

let Action = function(){
    const args = [].slice.call(arguments, 0);
    this.opts = args[0];
    this.init(args[0]);
}

Action.prototype = {
    constructor:Action,
    init:function(opts){
        if(opts.extend && opts.extend.length > 0){
            this.extendApi(opts.extend);
        }
    },
    extend: function(obj){
        [].slice.call(arguments, 1).forEach(function(source) {
            for (var attr in source) {
                obj[attr] = source[attr];
            }
        });
        return obj;
    },
    success: function(data, title, store, evName){
        Store.actions[store].ajax(data, title, evName);
    },
    failed:function(data, title, store, evName){
        Store.actions[store].ajax(data, title, evName);
    },
    get:function(params, api, title, store, tip){
        var self = this;
        API.get(api, params).then(function(data) {
            if (typeof(data) === 'undefined' ||  data.sta === -1) {
                self.failed(data, title, store, 'FAILED_' + title + '_' + tip);
            } else {
                self.success(data, title, store, 'SUCCESS_' + title + '_'  + tip);
            }
        });
    },
    post:function(params, api, title, store, tip){
        var self = this;
        API.post(api, params).then(function(data) {
            if (data.sta === 0 || /refresh\s+please/.test(data.tips)) {
                self.success(data, title, store, 'SUCCESS_' + title + '_'  + tip);
            } else {
                self.failed(data, title, store, 'FAILED_' + title + '_' + tip);
            }
        });
    },
    load:function(params){
        const _opts = this.opts,
            _fetch = _opts.fetch;
        this.get(params, _fetch.load.api, 'LOAD', _fetch.load.store, _opts.tip);
    },
    add:function(params){
        const _opts = this.opts,
            _fetch = _opts.fetch;
        this.post(params, _fetch.add.api, 'ADD', _fetch.load.store, _opts.tip);
    },
    update:function(params){
        const _opts = this.opts,
            _fetch = _opts.fetch;
        this.post(params, _fetch.update.api, 'UPDATE', _fetch.load.store, _opts.tip);
    },
    del:function(params){
        const _opts = this.opts,
            _fetch = _opts.fetch;
        this.post(params, _fetch.del.api, 'DEL', _fetch.load.store, _opts.tip);
    },
    sort:function(params){
        const _opts = this.opts,
            _fetch = _opts.fetch;
        this.post(params, _fetch.sort.api, 'SORT', _fetch.load.store, _opts.tip);
    },
    extendApi:function(apiArr){  
        var self = this,
            _opts = this.opts;
        apiArr.forEach(function(item, i){
            this.extend(this,{
                [item.eventNmae]: function(params){
                    self[item.type](params, item.api, item.title, item.store, _opts.tip);
                }
            });
        },this);
    },
}

let AppActions = new Action(Config.app);


export {
    Action,
    AppActions
}
