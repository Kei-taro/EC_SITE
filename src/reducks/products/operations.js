import { db, FirebaseTimestamp } from "../../firebase/index";
import { push } from "connected-react-router";
import { fetchProductsAction, deleteProductAction } from "./actions";

const productsRef = db.collection("products")

export function fetchProducts(gender, category) {
  return async (dispatch) => {
    let query = productsRef.orderBy("updated_at", "desc")
    query = (gender !== "") ? query.where("gender", "==", gender) : query
    query = (category !== "") ? query.where("category", "==", category) : query

    query.get()
      .then(snapshots => {
        const productList = []
        snapshots.forEach(snapshot => {
          const product = snapshot.data();
          productList.push(product)
        })
        dispatch(fetchProductsAction(productList))
      })
  }
}

export function saveProduct(id, name, description, category, gender, price, images, sizes) {
  return async (dispatch) => {
    const timestamp = FirebaseTimestamp.now()

    const data = {
      name: name,
      description: description,
      category: category,
      gender: gender,
      price: parseInt(price, 10),
      images: images,
      sizes: sizes,
      updated_at: timestamp
      
    }

    if (id === "") {
      const ref = productsRef.doc()//自動でIDが生成される
      id = ref.id
      data.id = id
      data.created_at = timestamp
    }
    
    return productsRef.doc(id).set(data, {merge:true})
      .then(() => {
        dispatch(push("/"))
      })
      .catch((error) => {
        throw new Error(error)
      })
  }
}

export function deleteProduct(id) {
  return async (dispatch, getState) => {
    productsRef.doc(id).delete()
      .then(() => {
        const prevProducts = getState().products.list;
        const nextProducts = prevProducts.filter(product => product.id !== id)
        dispatch(deleteProductAction(nextProducts))
      })
  }
}

export function orderProduct(productsInCart,amount) {
  return async (dispatch, getState) => {
    const uid = getState().users.uid
    const userRef = db.collection("users").doc(uid)
    const timestamp = FirebaseTimestamp.now()

    let products = [],
        soldOutProducts = []

    const batch = db.batch()

    for (const product of productsInCart) {
      //DBから商品情報を取得
      const snapshot = await productsRef.doc(product.productId).get()
      //商品の在庫情報を取得
      const sizes = snapshot.data().sizes

      //購入された商品の数を1個減らす
      const updatedSizes = sizes.map(size => {
        if (size.size === product.size) {
          if (size.quantity === 0) {
            soldOutProducts.push(product.name)
            return size
          }
          return {
            size: size.size,
            quantity: size.quantity - 1
          }
        }
        else {
          return size
        }
      })

      //注文履歴用の配列
      products.push({
        id: product.productId,
        images: product.images,
        name: product.name,
        price: product.price,
        size: product.size
      })

      batch.update(
        productsRef.doc(product.productId),
        { sizes: updatedSizes }
      )

      batch.delete(
        userRef.collection("cart").doc(product.cartId)
      )
    }
    if (soldOutProducts.length > 0) {
      const errorMessage = (soldOutProducts.length > 1) ?
        soldOutProducts.join("&") :
        soldOutProducts[0]
      alert("Sorry." + errorMessage + "sold out.")
      return false
    }
    else {
      batch.commit()
        .then(() => {
          const orderRef = userRef.collection("orders").doc();
          const date = timestamp.toDate();
          //配送日(3日後に設定)
          const shioongDate = FirebaseTimestamp.fromDate(new Date(date.setDate(date.getDate() + 3)))

          const history = {
            amount: amount,
            created_at: timestamp,
            id: orderRef.id,
            products: products,
            shipping_date: shioongDate,
            updated_at: timestamp
          }

          orderRef.set(history)
          dispatch(push("/order/complate"))
        })
        .catch(() => {
          alert("Sorry.Failed to process order.")
          return false
        })
    }
  }
}

/*
 [ソースコード概略]
 データベースにある商品情報を保存・削除する処理
 注文情報をデータベースに保存する
 */