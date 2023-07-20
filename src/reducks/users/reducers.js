import * as Actions from './actions';
import initialState from '../store/initialState';

export function UsersReducer(state = initialState.users, action) {
  switch (action.type) {
    case Actions.SIGN_IN:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state

    case Actions.SIGN_OUT:
      return {
        ...action.payload
      }

    case Actions.FETCH_PRODUCTS_IN_CART:
      return {
        ...state,
        //配列で返す
        cart: [...action.payload]
      }
    case Actions.FETCH_ORDERS_HISTORY:
      return {
        ...state,
        orders: [...action.payload]
      }
  }
}

/*
 [ソースコード概略]
 actionsから飛ばされたデータを振り分ける
 どんな感じで飛ばされてくるのかは不明
 */