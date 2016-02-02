import { EventEmitter } from 'events'

import _ from '_common/liber/main.js'

import homeStore from './homeStore.js'
import uploadStore from './uploadStore.js'

// EventEmitter 是nodejs核心的一部分 , 用来处理事件，及回调
// emit 触发事件， on 监听事件， removeListener 移除监听事件
let Store = {
    states: {},
    actions: {},
    event: new EventEmitter(),
    init: function() {
        var args = Array.prototype.slice.call(arguments);
        _.forEach(args, function(obj){
            this.states[obj.displayName] = {};
            this.actions[obj.displayName] = {};
            obj.action.rootStore = this;
            _.extend(this.states[obj.displayName], obj.state);  
            _.extend(this.actions[obj.displayName], obj.action);
        }, this);
    },
}

Store.init(
    homeStore,
    uploadStore
)

export default Store