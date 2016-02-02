export function configRouter(router) {

    // normal routes
    router.map({
        // basic example
        // '/wx': {
        //     // the component can also be a plain string component id,
        //     // but a component with that id must be available in the
        //     // App component's scope.
        //     component: require('_components/home.vue')
        // },

        // basic example
        'home': {
            // the component can also be a plain string component id,
            // but a component with that id must be available in the
            // App component's scope.
            component: require('_components/home.vue')
        },

        '/button': {
            component: require('_components/button.vue')
        },
        '/cell': {
            component: require('_components/cell.vue')
        },
        '/toast': {
            component: require('_components/toast.vue')
        },
        '/dialog': {
            component: require('_components/dialog.vue')
        },
        '/progress': {
            component: require('_components/progress.vue')
        },
        '/message': {
            component: require('_components/message.vue')
        },
        '/article': {
            component: require('_components/article.vue')
        },
        '/actionsheet': {
            component: require('_components/actionsheet.vue')
        },
        '/icons': {
            component: require('_components/icons.vue')
        },
        '/jssdk': {
            component: require('_components/jssdk.vue')
        },

        // basic example
        'about': {
            // the component can also be a plain string component id,
            // but a component with that id must be available in the
            // App component's scope.
            component: require('_components/about.vue')
        },

        // nested example
        'user/:userId': {
            component: require('_components/user/index.vue'),
            subRoutes: {
                // matches "/user/:userId/profile/:something"
                'profile/:something': {
                    component: require('_components/user/profile.vue')
                },
                // matches "/user/:userId/posts"
                'posts': {
                    component: require('_components/user/posts.vue')
                },
                // matches "/user/:userId/settings"
                'settings': {
                    component: require('_components/user/settings.vue')
                }
            }
        },
        // advanced example
        'inbox': {
            component: require('_components/inbox/index.vue'),
            subRoutes: {
                '/message/:messageId': {
                    component: require('_components/inbox/message.vue')
                },
                '/archived': {
                    component: require('_components/inbox/archive.vue')
                },
                // default component to render into the nested outlet
                // when the parent route is matched but there's no
                // nested segment. In this case, "/inbox".
                '/': {
                    // inline component
                    component: {
                        template: 'default yo'
                    }
                }
            }
        },

        // not found handler
        '*': {
            component: require('_components/not-found.vue')
        },


    })

    // redirect
    router.redirect({
        'info': 'about',
        'hello/:userId': 'user/:userId'
    })

    // global before
    // 3 options:
    // 1. return a boolean
    // 2. return a Promise that resolves to a boolean
    // 3. call transition.next() or transition.abort()
    router.beforeEach((transition) => {
        /*if (transition.to.path === '/wx/forbidden') {
            router.app.authenticating = true
            setTimeout(() => {
                router.app.authenticating = false
                alert('this route is forbidden by a global before hook')
                transition.abort()
            }, 3000)
        } else {
            transition.next()
        }*/
        console.log(transition.to.path)
        if (transition.to.path === '/') {
            router.go('home')
        } else {
            if (transition.to.path === '/wx/forbidden') {
                router.app.authenticating = true
                setTimeout(() => {
                    router.app.authenticating = false
                    alert('this route is forbidden by a global before hook')
                    transition.abort()
                }, 3000)
            } else {
                transition.next()
            }
        }
    })
}
