import localStorage from '_common/localStorage.js'
import {
    Promise
}
from 'es6-promise'

function getToken() {
    if (localStorage.has("config_react")) {
        return localStorage.get("config_react").token;
    } else {
        if (localStorage.has("config")) {
            return localStorage.get("config").token;
        } else {
            return '';
        }
    }
}

function get(api, params) {
    var self = this;
    return mui.ajax(api, {
            type:'get',
            dataType:'json',
            data: params,
            timeout:10000,
            headers: {
                'Session-Token': self.getToken() || params.token
            }
        })
        .then(function(res) {
            return res.data;
        }).catch(function(ex) {
            // errorDATA.set({
            //     title:'Error ' + ex.textStatus,
            //     message: ex.error
            // });
            console.log('parsing failed', ex)
        });
}

function post(api, params) {
    var self = this,
        _headers;
    return mui.ajax(api, {
            type:'post',
            dataType:'json',
            data: params,
            timeout:10000,
            headers: (api === '/admin/api/signin') ? {
                'SESSION-TOKEN': 'sign-in',
                'accepts': 'text/html'
            } : {
                'Session-Token': self.getToken() || params.token
            }
        })
        .then(function(res) {
            return res.data;
        }).catch(function(ex) {
            // errorDATA.set({
            //     title:'Error ' + ex.textStatus,
            //     message: ex.error
            // });
            console.log('parsing failed', ex)
        });
}

export {
    getToken,
    get,
    post
};
