import {
  ADD_TO_CART,
  CHECKOUT_REQUEST,
  CHECKOUT_SUCCESS,
  CHECKOUT_FAILURE
} from '../mutation-types'

// mutations
export const cartMutations = {
  [ADD_TO_CART] ({ cart }, productId) {
    cart.lastCheckout = null
    const record = cart.cartInitialState.added.find(p => p.id === productId)
    if (!record) {
      cart.cartInitialState.added.push({
        id: productId,
        quantity: 1
      })
    } else {
      record.quantity++
    }
  },

  [CHECKOUT_REQUEST] ({ cart }) {
    // clear cart
    cart.cartInitialState.added = []
    cart.cartInitialState.lastCheckout = null
  },

  [CHECKOUT_SUCCESS] ({ cart }) {
    cart.cartInitialState.lastCheckout = 'successful'
  },

  [CHECKOUT_FAILURE] ({ cart }, savedCartItems) {
    // rollback to the cart saved before sending the request
    cart.cartInitialState.added = savedCartItems
    cart.cartInitialState.lastCheckout = 'failed'
  }
}
