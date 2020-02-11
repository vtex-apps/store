interface Seller {
  commertialOffer: {
    AvailableQuantity: number
  }
}

interface ProductItem {
  itemId: string
  name: string
  images: Image[]
  variations: {
    name: string
    values: string[]
  }[]
  sellers: {
    commertialOffer: {
      Price: number
      ListPrice: number
      AvailableQuantity: number
    }
  }[]
}

interface Product {
  itemMetadata: ItemMetadata
  items: ProductItem[]
  skuSpecifications: SkuSpecification[]
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

declare module 'vtex.product-context/useProduct' {
  type GroupId = string

  interface AssemblyOptionItem {
    id: string
    quantity: number
    seller: string
    initialQuantity: number
    choiceType: string
    name: string
    price: number
    children: Record<string, AssemblyOptionItem[]> | null
  }

  type InputValues = Record<string, string>

  export interface ProductContext {
    product?: Product,
    selectedItem: ProductItem | null,
    selectedQuantity: number
    skuSelector: {
      isVisible: boolean
      areAllVariationsSelected: boolean
    }
    buyButton: {
      clicked: boolean
    }
    assemblyOptions: {
      items: Record<GroupId, AssemblyOptionItem[]>
      inputValues: Record<GroupId, InputValues>
      areGroupsValid: Record<GroupId, boolean>
    }
  }

  const useProduct: () => ProductContext
  export default useProduct
}

declare module 'vtex.product-context/ProductDispatchContext' {
  type DispatchFunction = (payload: { type: string; args?: any }) => void
  export const useProductDispatch: () => DispatchFunction
}

declare module 'vtex.product-context' {
  export const ProductContext
}