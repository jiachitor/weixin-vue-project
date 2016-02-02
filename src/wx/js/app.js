// warning: vue-router requires Vue 0.12.10+
import Vue from 'vue'
import VueRouter from 'vue-router'
import './config/weixin-config.js'
import { configRouter } from './config/route-config.js'
require('es6-promise').polyfill()

// install router
Vue.use(VueRouter)

// create router
const router = new VueRouter({
    hashbang: true,
    history: false,
    saveScrollPosition: true
})

// configure router
configRouter(router)

// boostrap the app
const App = Vue.extend(require('./components/app.vue'))
router.start(App, '#app')

// just for debugging
window.router = router


