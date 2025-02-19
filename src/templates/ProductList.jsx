import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ProductCard } from "../components/Products"
import { fetchProducts } from '../reducks/products/operations';
import { getProducts } from '../reducks/products/selectors';

function ProductList() {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state)
  const products = getProducts(selector)

  const query = selector.router.location.search
  const gender = /^\?gender=/.test(query) ? query.split("?gender=")[1] : ""
                 //���K�\��
  const category = /^\?category=/.test(query) ? query.split("?category=")[1] : ""

  useEffect(() => {
    dispatch(fetchProducts(gender, category))
  }, [query])
   
  return (
    <section className="c-section-wrapin">
      <div className="p-grid__row">
        {products.length > 0 && (
          products.map(product => (
            <ProductCard
              key={product.id} id={product.id} name={product.name}
              images={product.images} price={product.price}
            />
          ))
        )}

      </div>
    </section>
  )
}

export default ProductList;

