import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { pathOr, path, map, sort, compose, head } from 'ramda'

const ITEM_AVAILABLE = 100

const lowestPriceInStockSeller = item => {
  if (item.sellers.length) {
    return sort((itemA, itemB) => itemA.commertialOffer && itemA.commertialOffer.availableQuantity > 0
      ? itemB.commertialOffer && itemB.commertialOffer.availableQuantity > 0
        ? itemA.commertialOffer.price - itemB.commertialOffer.price
        : -1
      : -1,
    item.sellers)[0]
  }
  return null
}

const lowestPriceItem = compose(
  head,
  sort((itemA, itemB) => (path(['seller', 'commertialOffer', 'price'], itemA) - path(['seller', 'commertialOffer', 'price'], itemB)))
)

const lowestPriceInStock = product => {
  const items = map(item => ({
    item,
    seller: lowestPriceInStockSeller(item),
  }), product.items)

  const { item, seller } = lowestPriceItem(items)

  const image = head(item.images)

  return {
    item,
    image,
    seller,
  }
}

export default function MicroData({ product }, { culture: { currency } }) {
  const { image, seller } = lowestPriceInStock(product)
  return (
    <div className="dn" vocab="http://schema.org/" typeof="Product">
      <span property="brand">{product.brand}</span>
      <span property="name">{product.productName}</span>
      {image && <img property="image" src={image.imageUrl} alt={image.imageLabel} />}
      <span property="description">{product.description}</span>
      Product #: <span property="mpn">{product.productId}</span>
      <span property="offers" typeof="Offer">
        <meta property="priceCurrency" content={currency} />
        $<span property="price">{path(['commertialOffer', 'price'], seller)}</span>
        (Sale ends <time property="priceValidUntil" dateTime={path(['commertialOffer', 'priceValidUntil'], seller)}>
          {path(['commertialOffer', 'priceValidUntil'], seller)}
        </time>)
        Available from: <span property="seller" typeof="Organization"
        >
          <span property="name">{seller.sellerName}</span>
        </span>
        Condition: <link property="itemCondition" href="http://schema.org/NewCondition" />New
        { pathOr(ITEM_AVAILABLE, ['commertialOffer', 'availableQuantity'], seller)
          ? <Fragment><link property="availability" href="http://schema.org/InStock"></link> In stock. Order now.</Fragment>
          : <Fragment><link property="availability" href="http://schema.org/OutOfStock"></link>Out of Stock</Fragment>
        }
      </span>
    </div>
  )
}

MicroData.propTypes = {
  product: PropTypes.object,
}

MicroData.contextTypes = {
  culture: PropTypes.object,
}
