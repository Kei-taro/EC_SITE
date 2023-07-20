import { createSelector } from 'reselect'

const usersSelector = (state) => state.users;

export const getIsSignedIn = createSelector(
  [usersSelector],
  state => state.isSignedIn
);

export const getUserId = createSelector(
  [ usersSelector ],
  state => state.uid
);

export const getUsername = createSelector(
  [usersSelector],
  state => state.username
);

export const getProductsInCart = createSelector(
  [usersSelector],
  state => state.cart
);

export const getOrdersHistory = createSelector(
  [usersSelector],
  state => state.orders
);

/*
 [ソースコード概略]
 ユーザー情報を取得するための処理
 ※Selector:ReduxのStore内からStateを取得
 */
