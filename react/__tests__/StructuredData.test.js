import { parseToJsonLD } from '../components/StructuredData'
import { getProduct, getItem } from '../__mocks__/productMock'
import { product as mktPlaceProduct } from '../__mocks__/marketplaceProductMock'
import { clone } from 'ramda'

describe('test parse to json logic', () => {
  it('test low and high offer logic', () => {
    const cheapItem = getItem('2', 45, 1)
    const product = getProduct()
    product.items.push(cheapItem)

    const currency = 'BRL'
    const result = JSON.parse(
      parseToJsonLD(product, product.items[1], currency)
    )

    expect(result.offers.lowPrice).toBe(
      cheapItem.sellers[0].commertialOffer.Price
    )
    expect(result.offers.highPrice).toBe(
      product.items[0].sellers[0].commertialOffer.Price
    )
    expect(result.offers.priceCurrency).toBe(currency)
    expect(result.sku).toBe(cheapItem.itemId)
    expect(result.category).toBe('Category C')
  })
  it('test availability logic', () => {
    const cheapItem = getItem('2', 45, 0)
    const itemAvailable = getItem('3', 60, 1)
    const product = getProduct()
    product.items.push(cheapItem)
    product.items.push(itemAvailable)

    const currency = 'BRL'
    const result = JSON.parse(
      parseToJsonLD(product, product.items[0], currency)
    )

    expect(result.offers.lowPrice).toBe(
      itemAvailable.sellers[0].commertialOffer.Price
    )
    expect(result.offers.highPrice).toBe(
      product.items[0].sellers[0].commertialOffer.Price
    )
    expect(result.offers.priceCurrency).toBe(currency)
    expect(result.offers.offers[0].availability).toBe(
      'http://schema.org/InStock'
    )
    expect(result.offers.offers[1].availability).toBe(
      'http://schema.org/OutOfStock'
    )
    expect(result.offers.offers[2].availability).toBe(
      'http://schema.org/InStock'
    )
  })

  it('handle multiple sellers correctly, get correct low price and high price', () => {
    const result = JSON.parse(
      parseToJsonLD(mktPlaceProduct, mktPlaceProduct.items[0], 'BRL')
    )

    expect(result.offers.lowPrice).toBe(869900)
    expect(result.offers.highPrice).toBe(955900)
    expect(result.offers.offerCount).toBe(1)
    expect(result.offers.offers[0].price).toBe(869900)
    expect(result.offers.offers[0].seller.name).toBe('another fake seller')
  })

  it('handle multiple sellers and multiple items correctly, get correct low price and high price', () => {
    const copyProduct = clone(mktPlaceProduct)
    const item = clone(copyProduct.items[0])
    item.sellers[2].commertialOffer.Price = 1000
    copyProduct.items.push(item)
    const result = JSON.parse(
      parseToJsonLD(copyProduct, copyProduct.items[0], 'BRL')
    )

    expect(result.offers.lowPrice).toBe(1000)
    expect(result.offers.highPrice).toBe(955900)
    expect(result.offers.offerCount).toBe(2)
    expect(result.offers.offers[0].price).toBe(869900)
    expect(result.offers.offers[0].seller.name).toBe('another fake seller')
    expect(result.offers.offers[1].price).toBe(1000)
    expect(result.offers.offers[1].seller.name).toBe(item.sellers[2].sellerName)
  })
})
