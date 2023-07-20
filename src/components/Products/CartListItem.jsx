import React from "react"
import Divider from "@material-ui/core/Divider"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemAvater from "@material-ui/core/ListItemAvatar"
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete"
import IconButton from "@material-ui/core/IconButton"
import { useSelector } from "react-redux"
import { getUserId } from "../../reducks/users/selectors"
import { db } from "../../firebase/index"

const useStyles = makeStyles({
  list: {
    height: 128
  },
  image: {
//はみ出た画像を正方形にカットする
    objectFit: "cover",
    margin: 16,
    height: 96,
    width: 96
  },
  text: {
    width: "100%"
  }
})

function CartListItem(props) {
  const classes = useStyles()
  const selector = useSelector((state) => state)
  const uid = getUserId(selector)

  const image = props.product.images[0].path
  const price = props.product.price.toLocaleString()
  const name = props.product.name
  const size = props.product.size

  const removeProductFromCart = (cartId) => {
    return db.collection("users").doc(uid)
             .collection("cart").doc(cartId)
             .delete()
  }

  return (
    <>
      <ListItem className={classes.list}>
        <ListItemAvater>
          <img className={classes.image} src={image} alt="Product image" />
        </ListItemAvater>
        <div className={classes.text}>
          <ListItemText
            primary={name}
            secondary={"Size:" + size}
          />
          <ListItemText
            primary={"¥" + price}
          />
        </div>
        <IconButton onClick={() => removeProductFromCart(props.product.cartId)} >
          <DeleteIcon />
        </IconButton>
      </ListItem>
      <Divider />
    </>
  )
}

export default CartListItem