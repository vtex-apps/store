import { useContext } from 'react'
import ProductContext from './ProductContext'

function useProduct() {
  return useContext(ProductContext)
}

export default useProduct
