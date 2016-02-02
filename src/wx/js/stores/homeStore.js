import _ from 'lodash'

import {AppActions} from "_actions/_app.actions.js"
import {getConfig} from '_utils/app.util.js'
const itemsCache = Object.create(null)

// 数据与状态
let state = {
    data: {
        ajax: new Array(),
        appConfig:{},
        curLocale:''
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
    setActiveType(opt){
        this.rootStore.event.emit('active_type_change',{
            data: opt
        })
    },
    isLogin(){
        var _localConfig = getConfig();
        console.log(_localConfig)
        if(_localConfig && _localConfig.signedIn){
            return true;
        }else{
            return false;
        }
    },
    setLocalConfig(){
        var _localConfig = getConfig();
        state.set('appConfig', _localConfig);
    },
    loadLocales(){
        AppActions.loadLocales()
    }
}

export default {
    displayName:'home',
    state: state,
    action: action
}
