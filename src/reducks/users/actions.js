export const SIGN_IN = "SIGN_IN";
export function signInAction(userState) {
  console.log("signaction");
  return {
    type: "SIGN_IN",
    payload: {
      isSignedIn: true,
      role: userState.role,
      uid: userState.uid,
      username: userState.username
    }
  }
};

export const SIGN_OUT = "SIGN_OUT";
export function signOutAction() {
  return {
    type: "SIGN_OUT",
    payload: {
      isSignedIn: false,
      role: "",
      uid: "",
      username: ""
    }
  }
};

export const FETCH_PRODUCTS_IN_CART = "FETCH_PRODUCTS_IN_CART";
export function fetchProductsInCartAction(products) {
  return {
    type: "FETCH_PRODUCTS_IN_CART",
    payload: products
  }
}; 

export const FETCH_ORDERS_HISTORY = "FETCH_ORDERS_HISTORY";
export function fetchOrdersHistoryAction(history) {
  return {
    type: "FETCH_ORDERS_HISTORY",
    payload: history
  }
};

/*
 [ソースコード概略]
 dispatch()されたらデータをreducerに投げる
 */