interface OrderFormContext {
  orderForm: OrderForm
  loading: boolean
}

interface OrderFormItem {
  additionalInfo: ItemAdditionalInfo
  availability: string
  detailUrl: string
  id: string
  imageUrl: string
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
  productCategories: Record<string, string>
  productCategoryIds: string
  productRefId: string
}

interface ItemAdditionalInfo {
  brandName: string
}

interface SKUSpecification {
  fieldName: string
  fieldValues: string[]
}

interface OrderForm {
  id: string
  items: OrderFormItem[]
  marketingData: MarketingData
  totalizers: Totalizer[]
  value: number
  messages: OrderFormMessages
}

interface MarketingData {
  coupon: string
}

interface Totalizer {
  id: string
  name: string
  value: number
}

interface OrderFormMessages {
  couponMessages: Message[]
  generalMessages: Message[]
}

interface Message {
  code: string
  status: string
  text: string
}
