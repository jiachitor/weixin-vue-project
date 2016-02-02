import shop from '_api/shop'
import * as types from '../mutation-types'

export const addToCart = types.ADD_TO_CART

export const checkout = (products) => (dispatch, state) => {
  const savedCartItems = [...state.cart.cartInitialState.added]
  dispatch(types.CHECKOUT_REQUEST)
  shop.buyProducts(
    products,
    () => dispatch(types.CHECKOUT_SUCCESS),
    () => dispatch(types.CHECKOUT_FAILURE, savedCartItems)
  )
}

export const getAllProducts = () => dispatch => {
  console.log(22222)
  shop.getProducts(products => {
    // 这里 dispatch 应该就是触发状态引发 state 的改变
    dispatch(types.RECEIVE_PRODUCTS, products)
  })
}
