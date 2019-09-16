import { parseToJsonLD } from '../components/StructuredData'
import { getProduct, getItem } from '../__mocks__/productMock'

describe('teste parse to json logic', () => {
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
      cheapItem.sellers[0].commertialOffer.Price
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
})
