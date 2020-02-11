const DEFAULT_COLOR = 'Pink'

export const getSKU = (color = DEFAULT_COLOR) => ({
  itemId: `SKU${color}`,
  name,
  nameComplete: `Simple SKU ${color}`,
  complementName: `Complete SKU Name ${color}`,
  unitMultiplier: 1,
  images: [
    {
      imageId: `SKU-image-${color}`,
      imageLabel: '',
      imageTag: `<img src="sku-image-${color}-url" width="#width#" height="#height#" alt="Frame-1" id="" />`,
      imageUrl: `sku-image-${color}-url`,
      imageText: 'Frame-1',
    },
  ],
  sellers: [
    {
      sellerId: '1',
      sellerName: 'VTEX',
      addToCartLink: `sku-image-${color}-add-card-url`,
      sellerDefault: true,
      commertialOffer: {
        Price: 35.7,
        ListPrice: 35.7,
        PriceWithoutDiscount: 35.7,
        RewardValue: 0,
        PriceValidUntil: '2020-02-21T16:09:13.7789996Z',
        AvailableQuantity: 18,
        Tax: 0,
        Installments: [
          {
            Value: 35.7,
            InterestRate: 0,
            TotalValuePlusInterestRate: 35.7,
            NumberOfInstallments: 1,
            Name: 'VTEXCard',
          },
        ],
      },
    },
  ],
  variations: [
    {
      name: 'Color',
      values: [color],
    },
  ],
})
