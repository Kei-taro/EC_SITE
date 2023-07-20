import React, { useEffect } from "react"
import IconButton from "@material-ui/core/IconButton"
import Badge from "@material-ui/core/Badge"
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart"
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder"
import MenuIcon from "@material-ui/icons/Menu"
import { getProductsInCart, getUserId } from "../../reducks/users/selectors"
import { useDispatch, useSelector } from "react-redux"
import { db } from "../../firebase/index"
import { fetchProductsInCart } from "../../reducks/users/operations"
import { push } from "connected-react-router"

function HeaderMenus(props) {
  const selector = useSelector((state) => state)
  const uid = getUserId(selector)
  const dispatch = useDispatch()
  let produtsInCart = getProductsInCart(selector)

  useEffect(() => {
    const unsubscribe = db.collection("users").doc(uid).collection("cart")
      .onSnapshot(snapshots => {
        snapshots.docChanges().forEach(change => {
          const product = change.doc.data()
          const changeType = change.type
          console.log("type:", changeType)
          
          switch (changeType) {
            case "added": //�J�[�g�ɏ��i��ǉ�
              produtsInCart.push(product)
              break
            case "modified": //�J�[�g�̒��g���ω�
              //���Ԗڂ̃J�[�g�̒��g��ύX���邩���߂�
              const index = produtsInCart.findIndex(product => product.cartId === change.doc.id)
              produtsInCart[index] = product
              break
            case "removed": //�J�[�g�̒��g���폜
              //change�ȊO�̃A�C�e����z��ɓ����
              produtsInCart = produtsInCart.filter(product => product.cartId !== change.doc.id)
              break
            default:
              break
          }
        })
        dispatch(fetchProductsInCart(produtsInCart))
      })
    //DB�Ɛڑ���؂�(���X�i�[�̉���)
    return () => unsubscribe()
  },[])
  
  return (
    <>
      <IconButton onClick={() => dispatch(push("/cart"))}>
{/* Badge��overlap="rectangular"��ǉ����Ȃ��ƃG���[���N���� */}
        <Badge badgeContent={produtsInCart.length} color="secondary" overlap="rectangular" >
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
      <IconButton>
        <FavoriteBorderIcon />
      </IconButton>
      <IconButton onClick={(event) => props.handleDrawerToggle(event)} >
        <MenuIcon />
      </IconButton>
    </>
  )

}

export default HeaderMenus