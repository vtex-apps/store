import { pathOr, head } from 'ramda'

import { Product } from '../ProductListContext'

import { changeImageUrlSize, toHttps } from './urlHelpers'

const defaultImage = { imageUrl: '', imageLabel: '' }
const defaultReference = { Value: '' }
const defaultSeller = { commertialOffer: { Price: 0, ListPrice: 0 } }

function findAvailableProduct(item: any) {
  return item.sellers.find(
    ({ commertialOffer = {} }: { commertialOffer: any }) =>
      commertialOffer.AvailableQuantity > 0
  )
}

export function parseToProductImpression(product: Product): Product {
  const parsedProduct = { ...product }
  const items = parsedProduct.items || []
  const sku = items.find(findAvailableProduct) || head(items)
  if (sku) {
    const [seller = defaultSeller] = pathOr([], ['sellers'], sku)
    const [referenceId = defaultReference] = pathOr([], ['referenceId'], sku)
    const [image = defaultImage] = pathOr([], ['images'], sku)

    const resizedImage = changeImageUrlSize(toHttps(image.imageUrl), 500)
    const parsedImage = { ...image, imageUrl: resizedImage }
    parsedProduct.sku = {
      ...sku,
      seller,
      referenceId,
      image: parsedImage,
    }
  }
  return parsedProduct
}
