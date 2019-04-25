import React, { Fragment } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import PropTypes from 'prop-types'
import {
  pathOr,
  path,
  map,
  sort,
  compose,
  head,
  split,
  length,
  last,
} from 'ramda'

const ITEM_AVAILABLE = 100

const lowestPriceInStockSeller = item => {
  if (item.sellers.length) {
    return sort(
      (itemA, itemB) =>
        itemA.commertialOffer && itemA.commertialOffer.AvailableQuantity > 0
          ? itemB.commertialOffer && itemB.commertialOffer.AvailableQuantity > 0
            ? itemA.commertialOffer.Price - itemB.commertialOffer.Price
            : -1
          : -1,
      item.sellers
    )[0]
  }
  return null
}

const lowestPriceItem = compose(
  head,
  sort(
    (itemA, itemB) =>
      path(['seller', 'commertialOffer', 'Price'], itemA) -
      path(['seller', 'commertialOffer', 'Price'], itemB)
  )
)

const lowestPriceInStockSKU = sku => {
  const itemSeller = [
    {
      sku,
      seller: lowestPriceInStockSeller(sku),
    },
  ]
  const { item, seller } = lowestPriceItem(itemSeller)

  return {
    item,
    seller,
  }
}

const tryParsingLocale = (description, locale) => {
  let parsedDescription
  try {
    const descriptionObject = JSON.parse(description)
    parsedDescription =
      descriptionObject[locale] || descriptionObject[head(split('-', locale))]
  } catch (e) {
    console.warn('Failed to parse multilanguage product description')
  }
  return parsedDescription || description
}

const highestPriceItem = compose(
  last,
  sort(
    (itemA, itemB) =>
      path(['seller', 'commertialOffer', 'Price'], itemA) -
      path(['seller', 'commertialOffer', 'Price'], itemB)
  )
)

const priceItems = items => {
  const lowPrice = lowestPriceItem(items)
  const highPrice = highestPriceItem(items)
  return {
    lowPrice,
    highPrice,
  }
}

const parseSKUToOffer = (item, currency) => {
  const { seller } = lowestPriceInStockSKU(item)
  const calculateAvailability = seller => {
    return pathOr(
      ITEM_AVAILABLE,
      ['commertialOfferlowestPriceInStock', 'AvailableQuantity'],
      seller
    )
      ? 'http://schema.org/InStock'
      : 'http://schema.org/OutOfStock'
  }

  const offer = {
    '@type': 'Offer',
    price: path(['commertialOffer', 'Price'], seller),
    priceCurrency: currency,
    availability: calculateAvailability(seller),
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

const composeAggregateOffer = (product, currency) => {
  const items = map(
    item => ({
      item,
      seller: lowestPriceInStockSeller(item),
    }),
    product.items
  )

  const { lowPrice, highPrice } = priceItems(items)
  const offersList = map((element, index) => {
    return parseSKUToOffer(element, currency)
  }, product.items)

  const aggregateOffer = {
    '@type': 'AggregateOffer',
    lowPrice: path(['seller', 'commertialOffer', 'Price'], lowPrice),
    highPrice: path(['seller', 'commertialOffer', 'Price'], highPrice),
    priceCurrency: currency,
    offers: [offersList],
    offerCount: length(items),
  }

  return aggregateOffer
}

const parseToJsonLD = (product, query, currency, locale) => {
  const skuId = query.skuId || path(['items', '0', 'itemId'], product)
  const image = head(path(['items', '0', 'images'], product))
  const brand = product.brand
  const name = product.productName
  const description = tryParsingLocale(product.description, locale)

  const productLD = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: name,
    brand: brand,
    image: image.imageUrl,
    description: description,
    mpn: product.productId,
    sku: skuId,
    offers: composeAggregateOffer(product, currency),
  }

  return JSON.stringify(productLD)
}

function StructuredData({ product, query }) {
  const {
    culture: { currency, locale },
  } = useRuntime()
  const productLD = parseToJsonLD(product, query, currency, locale)

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: productLD }}
    />
  )
}

StructuredData.propTypes = {
  product: PropTypes.object,
  query: PropTypes.object,
}

export default StructuredData
