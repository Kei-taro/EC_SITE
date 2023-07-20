import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { db, FirebaseTimestamp } from '../firebase/index'
import { makeStyles } from "@material-ui/core/styles"
import HTMLReactParser from "html-react-parser"
import { ImageSwiper, SizeTable } from "../components/Products"
import { addProductToCart } from '../reducks/users/operations'

const useStyles = makeStyles((theme) => ({
  sliderBox: {
    [theme.breakpoints.down("sm")]: {
      margin: "0 auto 24px auto",
      height: 320,
      width: 320
    },
    [theme.breakpoints.up("sm")]: {
      margin: "0 auto",
      height: 400,
      width: 400
    }
  },
  detail: {
    textAlign:"left",
    [theme.breakpoints.down("sm")]: {
      margin: "0 auto 16px auto",
      height: "auto",
      width: 320
    },
    [theme.breakpoints.up("sm")]: {
      margin: "0 auto",
      height: "auto",
      width: 400
    }
  },
  price: {
    fontSize: 36
  }
}))


//���s�R�[�h��<br>�ɕϊ�
function returnCodeToBr(text) {
  if (text === "") {
    return text
  }
  else {
    //React����HTML�^�O���g����悤�ɂȂ�
    return HTMLReactParser(text.replace(/\r?\n/g,"<br/>"))
  }
}

function ProductDetail() {
  const classes = useStyles()
  const selector = useSelector((state) => state)
  const path = selector.router.location.pathname
  const id = path.split("/product/")[1]
  const dispach = useDispatch()

  const [product, setProduct] = useState(null)

  console.log("ProductDetail")

  //���̃����_�[���������ꂽ���useEffect�����s�����
  useEffect(() => {
    db.collection("products").doc(id).get()
      .then(doc => {
        const data = doc.data();
        setProduct(data)
      })
  }, [])

//�q�R���|�[�l���g(SizeTabele)�ŌĂԂ��߃R�[���o�b�N�֐��Ń���������
  const addProduct = useCallback((selectedSize) => {
    const timeStamp = FirebaseTimestamp.now();
    dispach(addProductToCart({
      added_at: timeStamp,
      description: product.description,
      gender: product.gender,
      images: product.images,
      name: product.name,
      price: product.price,
      productId: product.id,
      quantity: 1,
      size: selectedSize
    }))
  }, [product])
  //product���X�V���ꂽ��addProduct�֐����Đ�������

  return (
    <section className="c-section-wrapin">
      {product && (
        <div className="p-grid__row" >
          <div className={classes.sliderBox}>
            <ImageSwiper images={product.images} />
          </div>
          <div className={classes.detail}>
            <h2 className="u-text__headline">{product.name}</h2>
            <p className={classes.price}>{product.price.toLocaleString()}</p>
            <div className="module-spacer--small" />
            <SizeTable addProduct={addProduct} sizes={product.sizes} />
            <div className="module-spacer--small" />
            <p>{returnCodeToBr(product.description)}</p>
          </div>
        </div>
      )}
    </section>
  )
}

export default ProductDetail;

/*
 [�\�[�X�R�[�h�T��]
 ���i�̏ڍ׃y�[�W
 */