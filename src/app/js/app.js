import Vue from 'vue'
import { Promise } from 'es6-promise'

import Resource from 'vue-resource'
import { domain, fromNow } from '_filters'

import { bootstrap } from './router/router.js'
// import '_sass/app.scss'

console.log('[detect] ', mui.os)

Vue.use(Resource)  

Vue.filter('fromNow', fromNow)
Vue.filter('domain', domain)

bootstrap();
