import React, { memo } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import PropTypes from 'prop-types'
import {
  pathOr,
  path,
  map,
  sort,
  compose,
  head,
  length,
  last,
  flip,
  gt,
  flatten,
  prop,
} from 'ramda'

const sortByPriceAsc = sort(
  (itemA, itemB) =>
    path(['commertialOffer', 'Price'], itemA) -
    path(['commertialOffer', 'Price'], itemB)
)

const lowHighForSellers = sellers => {
  const sortedByPrice = sortByPriceAsc(sellers)
  const withStock = sortedByPrice.filter(isSkuAvailable)
  if (withStock.length === 0) {
    return {
      low: sortedByPrice[0],
      high: last(sortedByPrice),
    }
  }

  return {
    low: withStock[0],
    high: last(withStock),
  }
}

const isSkuAvailable = compose(
  flip(gt)(0),
  pathOr(0, ['commertialOffer', 'AvailableQuantity'])
)

const getSKUAvailabilityString = seller =>
  isSkuAvailable(seller)
    ? 'http://schema.org/InStock'
    : 'http://schema.org/OutOfStock'

const parseSKUToOffer = (item, currency) => {
  const { low: seller } = lowHighForSellers(item.sellers)
  const offer = {
    '@type': 'Offer',
    price: path(['commertialOffer', 'Price'], seller),
    priceCurrency: currency,
    availability: getSKUAvailabilityString(seller),
    sku: item.itemId,
    itemCondition: 'http://schema.org/NewCondition',
    priceValidUntil: path(['commertialOffer', 'PriceValidUntil'], seller),
    seller: {
      '@type': 'Organization',
      name: seller.sellerName,
    },
  }

  return offer
}

const getAllSellers = items => {
  const allSellers = items.map(i => i.sellers)
  const flat = flatten(allSellers)
  return flat
}

const composeAggregateOffer = (product, currency) => {
  const safeItems = product.items || []

  const allSellers = getAllSellers(safeItems)
  const { low, high } = lowHighForSellers(allSellers)

  const offersList = map(element => {
    return parseSKUToOffer(element, currency)
  }, safeItems)

  const aggregateOffer = {
    '@type': 'AggregateOffer',
    lowPrice: path(['commertialOffer', 'Price'], low),
    highPrice: path(['commertialOffer', 'Price'], high),
    priceCurrency: currency,
    offers: offersList,
    offerCount: length(safeItems),
  }

  return aggregateOffer
}

const getCategoryName = compose(
  prop('name'),
  last,
  prop('categoryTree')
)

export const parseToJsonLD = (product, selectedItem, currency) => {
  const image = head(path(['images'], selectedItem))
  const brand = product.brand
  const name = product.productName

  const productLD = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: name,
    brand: brand,
    image: image && image.imageUrl,
    description: product.metaTagDescription,
    mpn: product.productId,
    sku: selectedItem.itemId,
    category:
      product.categoryTree &&
      product.categoryTree.length > 0 &&
      getCategoryName(product),
    offers: composeAggregateOffer(product, currency),
  }

  return JSON.stringify(productLD)
}

function StructuredData({ product, selectedItem }) {
  const {
    culture: { currency, locale },
  } = useRuntime()
  const productLD = parseToJsonLD(product, selectedItem, currency, locale)

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: productLD }}
    />
  )
}

StructuredData.propTypes = {
  product: PropTypes.object,
  selectedItem: PropTypes.object,
}

export default memo(StructuredData)
