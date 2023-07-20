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
      const ref = productsRef.doc()//������ID�����������
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
      //DB���珤�i�����擾
      const snapshot = await productsRef.doc(product.productId).get()
      //���i�̍݌ɏ����擾
      const sizes = snapshot.data().sizes

      //�w�����ꂽ���i�̐���1���炷
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

      //��������p�̔z��
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
          //�z����(3����ɐݒ�)
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
 [�\�[�X�R�[�h�T��]
 �f�[�^�x�[�X�ɂ��鏤�i����ۑ��E�폜���鏈��
 ���������f�[�^�x�[�X�ɕۑ�����
 */