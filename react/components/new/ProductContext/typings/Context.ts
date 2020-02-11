type Action<K, V = void> = V extends void ? { type: K } : { type: K } & V

interface ProductAndQuery {
  query: Record<string, any>
  product: MaybeProduct
}

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

interface BuyButtonContextState {
  clicked: boolean
}

interface ProductContextState {
  selectedItem?: Item | null
  product: MaybeProduct
  selectedQuantity: number
  skuSelector: {
    isVisible: boolean
    areAllVariationsSelected: boolean
  }
  buyButton: BuyButtonContextState
  assemblyOptions: {
    items: Record<GroupId, AssemblyOptionItem[]>
    inputValues: Record<GroupId, InputValues>
    areGroupsValid: Record<GroupId, boolean>
  }
}

type InputValues = Record<string, string>

type Actions =
  | Action<'SET_QUANTITY', { args: { quantity: number } }>
  | Action<
      'SKU_SELECTOR_SET_VARIATIONS_SELECTED',
      { args: { allSelected: boolean } }
    >
  | Action<'SET_BUY_BUTTON_CLICKED', { args: { clicked: boolean } }>
  | Action<'SKU_SELECTOR_SET_IS_VISIBLE', { args: { isVisible: boolean } }>
  | Action<'SET_SELECTED_ITEM', { args: { item: Item | undefined | null } }>
  | Action<
      'SET_ASSEMBLY_OPTIONS',
      {
        args: {
          groupId: string
          groupItems: AssemblyOptionItem[]
          groupInputValues: InputValues
          isValid: boolean
        }
      }
    >
  | Action<'SET_PRODUCT', { args: { product: MaybeProduct } }>
