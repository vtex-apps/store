import { useProductImpression } from 'vtex.product-list-context'

const ProductListEventCaller = () => {
  useProductImpression()
  return null
}

export default ProductListEventCaller
