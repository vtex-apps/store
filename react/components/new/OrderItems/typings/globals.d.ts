interface OrderForm {
  items: Item[]
  marketingData: MarketingData | null
  totalizers: Totalizer[]
  value: number
}

interface Item {
  additionalInfo: ItemAdditionalInfo
  availability: string
  detailUrl: string
  id: string
  imageUrl: string
  index?: number
  listPrice: number
  measurementUnit: string
  name: string
  price: number
  productId: string
  quantity: number
  sellingPrice: number
  skuName: string
  skuSpecifications: SKUSpecification[]
  uniqueId: string
}

interface ItemAdditionalInfo {
  brandName: string
}

interface MarketingData {
  coupon: string
}

interface SKUSpecification {
  fieldName: string
  fieldValues: string[]
}

interface Totalizer {
  id: string
  name: string
  value: number
}
