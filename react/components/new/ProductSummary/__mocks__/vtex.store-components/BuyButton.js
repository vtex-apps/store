import React from 'react'

/**
 * BuyButton Mocked Component.
 */
const BuyButton = ({ children }) => {
  return <div className="buy-button-mock">{children}</div>
}

BuyButton.mapCatalogItemToCart = function mapCatalogItemToCart({
  selectedQuantity,
}) {
  return [
    {
      index: 0,
      quantity: selectedQuantity,
      detailUrl: '/product-name/p',
      name: 'Product name',
      brand: 'Brand',
      category: 'Category',
      productRefId: 'REF',
      seller: 'VTEX',
      price: 9,
      listPrice: 10,
      variant: 'Name',
      skuId: '1',
      imageUrl: 'https://foo.com/image.png',
    },
  ]
}

export default BuyButton
