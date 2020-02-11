export interface Product {
  linkText: string
  productName: string
  brand: string
  categoryId: string
  categoryTree: Category[]
  productId: string
  titleTag: string
  metaTagDescription: string
  items: SKU[]
  skuSpecifications: SkuSpecification[]
}

export interface Category {
  id: string
  name: string
}

export interface SKU {
  itemId: string
  ean: string
  referenceId: [{ Value: string }]
  sellers: Seller[]
}

interface Seller {
  commertialOffer: CommertialOffer
  sellerId: string
}

interface CommertialOffer {
  ListPrice: number
  Price: number
}

interface Seller {
  commertialOffer: CommertialOffer
}

interface CommertialOffer {
  AvailableQuantity: number
}

interface SkuSpecification {
  field: SkuSpecificationField
  values: SkuSpecificationValues[]
}

interface SkuSpecificationField {
  name: string
}

interface SkuSpecificationValues {
  name: string
}