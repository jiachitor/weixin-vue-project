import {
  RECEIVE_PRODUCTS,
  ADD_TO_CART
} from '../mutation-types'

// mutations
export const productsMutations = {
  // 一旦触发该状态，就执行数据的改变
  [RECEIVE_PRODUCTS] (state, products) {
    state.products.productsInitialState = products
  },

  [ADD_TO_CART] ({ products }, productId) {
    const product = products.productsInitialState.find(p => p.id === productId)
    if (product.inventory > 0) {
      product.inventory--
    }
  }
}
