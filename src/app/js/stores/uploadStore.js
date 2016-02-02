import _ from 'lodash'

import {AppActions} from "_actions/_app.actions.js"

const itemsCache = Object.create(null)

// 数据与状态
let state = {
    data: {
        ajax: new Array(),
        active_type: []
    },
    set:function(name, data){
        if(_.isArray(this.data[name])){
            this.data[name].push(data);
        }else if(_.isObject(this.data[name])){
            this.data[name] = data;
        }else if(_.isString(this.data[name])){
            this.data[name] = data;
        }
    },
    get:function(name){
        return this.data[name];
    }
}

// 行为
let action = {
    rootStore: {},
    ajax: function(data, title, eventName) {
        this.rootStore.event.emit(eventName,{
            data: data
        })
    },
    load(params) {
        AppActions.load(params)
    },
    loadList(params) {
        AppActions.loadlist(params)
    },
    del(params) {
        AppActions.del(params)
    },
}

export default {
    displayName:'upload',
    state: state,
    action: action
}
