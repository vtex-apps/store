import React, { createContext, FC } from 'react'

export const ProductContext = createContext({})

const ProductContextProvider: FC<any> = ({ product, children, skuSelector }) => {
  return (
    <ProductContext.Provider
      value={{ product, selectedItem: product.items[0], skuSelector }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export default ProductContextProvider
