import Vue from 'vue'
import Vuex from 'vuex'
import * as states from './states/index.js'  
import * as actions from './actions/index.js'  
import * as mutations from './mutations/index.js'  

Vue.use(Vuex)
Vue.config.debug = true

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex({
  state: {
    cart: states.cartStates,
    products: states.productStates
  },
  actions:[
    actions.shoppingCartActions
  ],
  mutations: [
    mutations.cartMutations.cartMutations, 
    mutations.productMutations.productsMutations
  ],
  strict: debug,
  middlewares: debug ? [Vuex.createLogger()] : []
})
