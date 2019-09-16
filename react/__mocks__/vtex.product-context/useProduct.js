import { useContext } from 'react'
import { ProductContext } from './ProductContextProvider'

const useProduct = () => useContext(ProductContext)
export default useProduct
