import { path } from 'ramda'

export function getProductImpression(product, customProps = {}) {
  return {
    id: product.productId,
    name: product.productName,
    list: 'Search Results',
    brand: product.brand,
    category: path(['categories', '0'], product),
    ...customProps,
  }
}
