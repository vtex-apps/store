interface SelectedItem {
  itemId: string
  sellers: {
    sellerId: string
    commertialOffer: {
      AvailableQuantity: number
    }
  }[]
}

interface Specification {
  name: string
  values: [string]
}

interface SpecificationGroup {
  name: string
  specifications: Specification[]
}

interface Product {
  specificationGroups?: SpecificationGroup[]
}

declare module 'vtex.product-context/useProduct' {
  const useProduct: () => ProductContext
  export default useProduct

  interface ProductContext {
    selectedQuantity: number
    product: Product | undefined
    selectedItem: SelectedItem | null
    skuSelector: {
      areAllVariationsSelected: boolean
      isVisible: boolean
    }
  }
}

declare module 'vtex.product-context/ProductDispatchContext' {
  type DispatchFunction = (payload: { type: string; args?: any }) => void
  export const useProductDispatch: () => DispatchFunction
}
