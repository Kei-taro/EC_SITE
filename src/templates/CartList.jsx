import React, { useCallback } from "react"
import { GreyButton, PrimaryButton } from "../components/UIkit"
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import List from "@material-ui/core/List";
import { getProductsInCart } from "../reducks/users/selectors";
import { CartListItem } from "../components/Products";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  root: {
    margin: "0 auto",
    maxWidth: 512,
    width: "100%"
  }
})

function CartList() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)
  const productsInCart = getProductsInCart(selector)

  const goToOrder = useCallback(() => {
    dispatch(push("/order/confirm"))
  }, [])

  const backToHome = useCallback(() => {
    dispatch(push("/productlist"))
  },[])

   return (
     <section className="c-section-wrapin">
       <h2 className="u-text__headline">
         Shopping Cart
       </h2>
       <List className={classes.root}>
         {productsInCart.length > 0 && (
           productsInCart.map(product =>
             <CartListItem key={product.cartId} product={product} />
           )
         )}
       </List>
       <div className="module-spacer--medium" />
       <div className="p-grid__column">
         <PrimaryButton label={"Go to cash register"} onClick={goToOrder} />
         <div className="module-spacer--extra-extra-small" />
         <GreyButton label={"Continue shopping"} onClick={backToHome} />
       </div>
     </section>
   )
}
export default CartList

/*
 [ソースコード概略]

 */