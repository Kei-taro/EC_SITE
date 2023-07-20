export const FETCH_PRODUCTS = "FETCH_PRODUCTS";
export function fetchProductsAction(products) {
  return {
    type: "FETCH_PRODUCTS",
    payload: products
  }
};

export const DELETE_PRODUCT = "DELETE_PRODUCT";
export function deleteProductAction(products) {
  return {
    type: "DELETE_PRODUCT",
    payload: products
  }
};
/*
 [ソースコード概略]

 */