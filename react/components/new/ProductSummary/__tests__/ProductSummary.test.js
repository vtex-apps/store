import ProductSummary from '../ProductSummaryCustom'

describe('<ProductSummary /> component', () => {
  it(`should parse a product succesfully and get sku as the first with available quantity`, () => {
    const product = {
      productId: '123456789',
      linkText: 'linkText',
      productName: 'productName',
      items: [
        {
          itemId: '1',
          name: 'item 1',
          sellers: [
            {
              sellerId: '1',
              commertialOffer: {
                AvailableQuantity: 0,
                Price: 10,
              },
            },
          ],
          images: [
            {
              imageUrl: 'image1',
              imageLabel: null,
            },
            {
              imageUrl: 'image2',
              imageLabel: null,
            },
          ],
        },
        {
          itemId: '2',
          name: 'item 2',
          sellers: [
            {
              sellerId: '1',
              commertialOffer: {
                AvailableQuantity: 3,
                Price: 15,
              },
            },
          ],
          images: [
            {
              imageUrl: 'image1',
              imageLabel: null,
            },
            {
              imageUrl: 'image2',
              imageLabel: null,
            },
          ],
        },
      ],
      productClusters: [
        {
          name: 'name',
        },
      ],
      quantity: 1,
    }
    const result = ProductSummary.mapCatalogProductToProductSummary(product)
    expect(result).toBeDefined()
    expect(result.sku.seller.sellerId).toBe('1')
    expect(result.sku.image).toBeDefined()
    expect(result.sku.itemId).toBe('2')
  })
  it(`should not break ProductSummary getSchema`, () => {
    expect(ProductSummary.getSchema).toEqual(expect.any(Function))
  })
})
