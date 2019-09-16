import React, { createContext } from 'react'

export const ProductContext = createContext({})

const ProductContextProvider = ({ product, children }) => {
  return (
    <ProductContext.Provider
      value={{ product, selectedItem: product.items[0] }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export default ProductContextProvider
