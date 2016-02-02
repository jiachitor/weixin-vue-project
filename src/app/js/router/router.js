import Vue from 'vue'
import Router from 'vue-router'

import AppView from '_components/app.vue'
import HomeView from '_components/home.vue'
import ButtonView from '_components/button.vue'
import CellView from '_components/cell.vue'
import ToastView from '_components/toast.vue'
import DialogView from '_components/dialog.vue'
import ProgressView from '_components/progress.vue'
import MessageView from '_components/message.vue'
import ArticleView from '_components/article.vue'
import ActionsheetView from '_components/actionsheet.vue'
import IconsView from '_components/icons.vue'
import JssdkView from '_components/jssdk.vue'

import AboutView from '_components/about.vue'
import NotFoundView from '_components/not-found.vue'

Vue.use(Router)

const router = new Router({
    hashbang: true,
    history: false,
    saveScrollPosition: true,
    linkActiveClass: 'v-link-active'
})

// normal routes
router.map({
    '/': {
        component: HomeView
    },
    '/home': {
        component: HomeView
    },
    '/button': {
        component: ButtonView
    },
    '/cell': {
        component: CellView
    },
    '/toast': {
        component: ToastView
    },
    '/dialog': {
        component: DialogView
    },
    '/progress': {
        component: ProgressView
    },
    '/message': {
        component: MessageView
    },
    '/article': {
        component: ArticleView
    },
    '/actionsheet': {
        component: ActionsheetView
    },
    '/icons': {
        component: IconsView
    },
    '/jssdk': {
        component: JssdkView
    },

    // nested example
    /*'/user/:userId': {
      component: require('./components/user/index.vue'),
      subRoutes: {
        // matches "/user/:userId/profile/:something"
        'profile/:something': {
          component: require('./components/user/profile.vue')
        },
        // matches "/user/:userId/posts"
        'posts': {
          component: require('./components/user/posts.vue')
        },
        // matches "/user/:userId/settings"
        'settings': {
          component: require('./components/user/settings.vue')
        }
      }
    },*/

    /*'/news/:page': {
      component: NewsView
    },
    '/user/:id': {
      component: UserView
    },
    '/item/:id': {
      component: ItemView
    },*/

    // not found handler
    '*': {
        component: NotFoundView
    },
})

// redirect
router.redirect({
    '/': '/home'
})

// global before
// 3 options:
// 1. return a boolean
// 2. return a Promise that resolves to a boolean
// 3. call transition.next() or transition.abort()
/*router.beforeEach((transition) => {
  if (transition.to.path === '/forbidden') {
    router.app.authenticating = true
    setTimeout(() => {
      router.app.authenticating = false
      alert('this route is forbidden by a global before hook')
      transition.abort()
    }, 3000)
  } else {
    transition.next()
  }
})*/

router.beforeEach(function() {
    window.scrollTo(0, 0)
})


export function bootstrap() {
    const App = Vue.extend(AppView)
    router.start(App, '#app')
}
