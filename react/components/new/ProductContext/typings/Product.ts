type Maybe<T> = T | null | undefined

type MaybeProduct = Maybe<Product>

interface Product {
  cacheId: string
  productName: string
  productId: string
  description: string
  titleTag: string
  metaTagDescription: string
  linkText: string
  productReference: string
  categoryId: string
  categoriesIds: string[]
  categories: string[]
  categoryTree: {
    id: string
    name: string
    href: string
  }[]
  brand: string
  brandId: string
  properties: {
    name: string
    values: string
  }[]
  specificationGroups: {
    name: string
    specifications: {
      name: string
      values: string[]
    }[]
  }[]
  items: Item[]
  skuSpecifications: SkuSpecification[]
  itemMetadata: {
    items: ItemMetadata[]
    priceTable: any[]
  }
}

interface Item {
  itemId: string
  name: string
  nameComplete: string
  complementName: string
  ean: string
  referenceId: {
    Key: string
    Value: string
  }[]
  measurementUnit: string
  unitMultiplier: number
  images: {
    imageId: string
    imageLabel: string
    imageTag: string
    imageUrl: string
    imageText: string
  }[]
  videos: {
    videoUrl: string
  }[]
  sellers: Seller[]
  variations: {
    name: string
    values: string[]
  }[]
  productClusters: {
    id: string
    name: string
  }[]
  clusterHighlights: {
    id: string
    name: string
  }[]
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

interface Seller {
  sellerId: string
  sellerName: string
  addToCartLink: string
  sellerDefault: string
  commertialOffer: {
    discountHighlights: {
      name: string
    }[]
    teasers: {
      name: string
    }[]
    Price: number
    ListPrice: number
    PriceWithoutDiscount: number
    RewardValue: number
    PriceValidUntil: string
    AvailableQuantity: number
    Tax: number
    CacheVersionUsedToCallCheckout: string
  }
}

interface ItemMetadata {
  items: {
    id: string
    name: string
    imageUrl: string
    seller: string
    assemblyOptions: {
      id: string
      name: string
      required: boolean
      inputValues: InputValue[]
      composition: Composition | null
    }
  }[]
  priceTable: {
    type: string
    values: {
      id: string
      assemblyId: string
      price: number | null
    }[]
  }[]
}

type InputValue = TextInputValue | BooleanInputValue | OptionsInputValue

enum InputValueType {
  'TEXT' = 'TEXT',
  'BOOLEAN' = 'BOOLEAN',
  'OPTIONS' = 'OPTIONS',
}

interface TextInputValue {
  type: InputValueType.TEXT
  defaultValue: ''
  label: string
  maxLength: number
  domain: null
}

interface BooleanInputValue {
  type: InputValueType.BOOLEAN
  defaultValue: boolean
  label: string
  maxLength: null
  domain: null
}

interface OptionsInputValue {
  type: InputValueType.OPTIONS
  defaultValue: string
  label: string
  maxLength: null
  domain: string[]
}

interface Composition {
  minQuantity: number
  maxQuantity: number
  items: {
    id: string
    minQuantity: number
    maxQuantity: number
    priceTable: string
    seller: string
    initialQuantity: number
  }[]
}
