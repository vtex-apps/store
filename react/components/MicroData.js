import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { pathOr, path, map, sort, compose, head, split, filter } from 'ramda'

const ITEM_AVAILABLE = 100

const lowestPriceInStockSeller = item => {
  if (item.sellers.length) {
    return sort((itemA, itemB) => itemA.commertialOffer && itemA.commertialOffer.AvailableQuantity > 0
      ? itemB.commertialOffer && itemB.commertialOffer.AvailableQuantity > 0
        ? itemA.commertialOffer.Price - itemB.commertialOffer.Price
        : -1
      : -1,
      item.sellers)[0]
  }
  return null
}

const lowestPriceItem = compose(
  head,
  sort((itemA, itemB) => (path(['seller', 'commertialOffer', 'Price'], itemA) - path(['seller', 'commertialOffer', 'Price'], itemB)))
)

const lowestPriceInStockSKU = sku => {
  const itemSeller = [{
    sku,
    seller: lowestPriceInStockSeller(sku)
  }]
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
    parsedDescription = descriptionObject[locale] || descriptionObject[head(split('-', locale))]
  } catch (e) {
    console.warn('Failed to parse multilanguage product description')
  }
  return parsedDescription || description
}

const renderOffer = (item, currency) => {

  const { seller } = lowestPriceInStockSKU(item)

  return (
    <span property="offers" typeof="Offer">
      <meta property="priceCurrency" content={currency} />
      <span property="sku">{item.itemId}</span>
      $<span property="price">{path(['commertialOffer', 'Price'], seller)}</span>
      (Sale ends <time property="priceValidUntil" dateTime={path(['commertialOffer', 'PriceValidUntil'], seller)}>
        {path(['commertialOffer', 'PriceValidUntil'], seller)}
      </time>)
        Available from: <span property="seller" typeof="Organization"
      >
        <span property="name">{seller.sellerName}</span>
      </span>
      Condition: <link property="itemCondition" href="http://schema.org/NewCondition" />New
        {pathOr(ITEM_AVAILABLE, ['commertialOfferlowestPriceInStock', 'AvailableQuantity'], seller)
        ? <Fragment><link property="availability" href="http://schema.org/InStock"></link> In stock. Order now.</Fragment>
        : <Fragment><link property="availability" href="http://schema.org/OutOfStock"></link>Out of Stock</Fragment>
      }
    </span>
  )
}

export default function MicroData({ product, query }, { culture: { currency, locale } }) {
  const skuId = query.skuId || path(['items', '0', 'itemId'], product)
  const image = head(path(['items', '0', 'images'], product))
  console.log('product', product)
  return (
    <div className="dn" vocab="http://schema.org/" typeof="Product">
      <span property="brand">{product.brand}</span>
      <span property="name">{product.productName}</span>
      <span property="sku">{skuId}</span>
      {image && <img property="image" src={image.imageUrl} alt={image.imageLabel} />}
      <span property="description">{tryParsingLocale(product.description, locale)}</span>
      Product #: <span property="mpn">{product.productId}</span>
      {product.items.map(item => (
        <Fragment key={item.itemId}>
          {renderOffer(item, currency)}
        </Fragment>
      ))}
    </div>
  )
}

MicroData.propTypes = {
  product: PropTypes.object,
  query: PropTypes.object
}

MicroData.contextTypes = {
  culture: PropTypes.object,
}
