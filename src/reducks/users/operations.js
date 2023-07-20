import { fetchOrdersHistoryAction, fetchProductsInCartAction, signInAction, signOutAction} from "./actions";
import { push } from "connected-react-router";
import { auth, db, FirebaseTimestamp } from "../../firebase/index";

export function listenAuthState() {
  console.log("listenAuthState");
  return async (dispatch) => {
    
    return auth.onAuthStateChanged(user => {
      
      if (user) { //SignInしてる：store情報を更新する
        const uid = user.uid
        console.log("listenAuthState if");

        db.collection("users").doc(uid).get()
          .then(snapshot => {
            const data = snapshot.data()

            dispatch(signInAction({
              isSignedIn: true,
              role: data.role,
              uid: uid,
              username: data.username
            }))
            
          })
      }
      else { //SignInしてない：SignInさせる
        dispatch(push("/signin"))
      }
    })
  }
}


export function signIn(email,password) {
  console.log("signIn")
  
  return async (dispatch) => {
    //Validation
    if (email === "" || password === "") {
      alert("Enter the required items.");
      return false;
    }
    auth.signInWithEmailAndPassword(email, password)
      .then(result => {
        const user = result.user
        console.log("user:" , user)

        if (user) {
          const uid = user.uid
          db.collection("users").doc(uid).get()
            .then(snapshot => {
              const data = snapshot.data()

              dispatch(signInAction({
                isSignedIn: true,
                role: data.role,
                uid: uid,
                username: data.username
              }))
              dispatch(push("/"));
            })
          
        }

      })
    
  }
}

export function signUp(username, email, password, confirmPassword) {
  return async (dispatch) => {
    //Validation
    if (username === "" || email === "" || password === "" || confirmPassword === "" ) {
      alert("Enter the required items.");
      return false;
    }
    if (password !== confirmPassword) {
      alert("The re-entered password is incorrect.");
      return false;
    }

    console.log("signup")
    
    return auth.createUserWithEmailAndPassword(email, password)
      .then(result => {
        const user = result.user

        if (user) {
          const uid = user.uid
          const timestamp = FirebaseTimestamp.now()

          const userInitialData = {
            created_at: timestamp,
            email: email,
            role: "customer",
            uid: uid,
            updated_at: timestamp,
            username:username
          }


          db.collection("users").doc(uid).set(userInitialData)
            .then(() => {
              //return
              dispatch(push("/"));
            })
        }
      })
  }
}

export function signOut() {
  return async (dispatch) => {
    auth.signOut()
      .then(() => {
        dispatch(signOutAction());
        dispatch(push("/signin"))
      })
  }
}

export function resetPassword(email) {
  return async (dispatch) => {
    if (email === "") {
      alert("Enter the required items.");
      return false;
    }
    else {
      auth.sendPasswordResetEmail(email)
        .then(() => {
          alert("Send password reset to email")
          dispatch(push("/signin"))
        })
        .catch(() => {
          alert("Failure")
        })
    }
    
    
  }
}

export function addProductToCart(addedProduct) {
  return async (dispatch,getState) => {
    const uid = getState().users.uid
    const cartRef = db.collection("users").doc(uid).collection("cart").doc()
    addedProduct["cartId"] = cartRef.id
    await cartRef.set(addedProduct)
    dispatch(push("/productlist"))
  }
}

export function fetchProductsInCart(products) {
  return async (dispatch) => {
    dispatch(fetchProductsInCartAction(products))
  }
}

export function fetchOrdersHistory(products) {
  return async (dispatch, getState) => {
    const uid = getState().users.uid;
    const list = []

    db.collection("users").doc(uid)
      .collection("orders")
      .orderBy("updated_at", "desc")//更新日順に並び帰る
      .get()
      .then((snapshots) => {
        snapshots.forEach(snapshot => {
          const data = snapshot.data()
          list.push(data)
        })
        dispatch(fetchOrdersHistoryAction(list))
      })
  }
}

/*
 [ソースコード概略]
 dispatch()で飛ばされた各ページの処理(サインインとかアカウント作成とか)が集まってる
 */