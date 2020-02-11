import React, { Fragment } from 'react'

export const useProductImpression = () => null
export const ProductListContext = {
  useProductListDispatch: () => null,
  // eslint-disable-next-line react/display-name
  ProductListProvider: ({ children }) => <Fragment>{children}</Fragment>,
}
