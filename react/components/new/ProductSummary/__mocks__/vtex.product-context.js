import React, { createContext } from 'react'

const ProductContext = createContext({})

export const ProductContextProvider = ({ product, query, ...rest }) => {
  return <ProductContext.Provider value={{ product, query }} {...rest} />
}
