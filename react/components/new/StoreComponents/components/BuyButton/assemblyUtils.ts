type GroupId = string
type GroupTypes = 'SINGLE' | 'TOGGLE' | 'MULTIPLE'

export const sumAssembliesPrice = (
  assemblyOptions: Record<GroupId, AssemblyOptionItem[]>
) => {
  const cleanAssemblies = assemblyOptions || {}
  const assembliesGroupItems = Object.values(cleanAssemblies)
  return assembliesGroupItems.reduce<number>(
    (sum: number, groupItems: AssemblyOptionItem[]) => {
      const groupPrice = groupItems.reduce<number>((groupSum, item) => {
        const childrenPrice: number = item.children
          ? sumAssembliesPrice(item.children)
          : 0
        const itemCost = item.price * item.quantity
        return groupSum + itemCost + childrenPrice * item.quantity
      }, 0)
      return groupPrice + sum
    },
    0
  )
}

interface AssemblyOptionItem {
  price: number
  choiceType: GroupTypes
  children: Record<GroupId, AssemblyOptionItem[]> | null
  name: string
  id: string
  initialQuantity: number
  quantity: number
  seller: string
}

type InputValue = Record<string, string | boolean>

export interface AssemblyOptions {
  items: Record<GroupId, AssemblyOptionItem[]>
  inputValues: Record<GroupId, InputValue>
  areGroupsValid: Record<string, boolean>
}

type Option = ItemOption | InputValuesOption

export interface ItemOption {
  assemblyId: string
  id: string
  quantity: number
  seller: string
  options?: Option[]
}

export interface InputValuesOption {
  assemblyId: string
  inputValues: InputValue
}

interface AddedItem {
  id: string
  name: string
  quantity: number
  sellingPrice: number
  sellingPriceWithAssemblies: number
  assemblyOptions?: ParsedAssemblyOptionsMeta
}

interface CartAddedOption {
  normalizedQuantity: number
  extraQuantity: number
  choiceType: GroupTypes
  item: AddedItem
}

interface CartRemovedOption {
  name: string
  initialQuantity: number
  removedQuantity: number
}

interface ParsedAssemblyOptionsMeta {
  added: CartAddedOption[]
  removed: CartRemovedOption[]
  parentPrice: number
}

interface ParsedAssemblyOptions {
  options: Option[]
  assemblyOptions: ParsedAssemblyOptionsMeta
}

export const transformAssemblyOptions = (
  assemblyOptionsItems: Record<GroupId, AssemblyOptionItem[]> = {},
  inputValues: Record<GroupId, InputValue> = {},
  parentPrice: number,
  parentQuantity: number
): ParsedAssemblyOptions => {
  // contains options sent as arguments to graphql mutation
  const options: Option[] = []

  // array with added assemblies data to show in minicart optimistic preview
  const added: CartAddedOption[] = []

  // array with removed assemblies data to show in minicart optimistic preview
  const removed: CartRemovedOption[] = []

  const assemblyItemsKeys: GroupId[] = Object.keys(assemblyOptionsItems)

  for (const groupId of assemblyItemsKeys) {
    const items = assemblyOptionsItems[groupId]
    for (const item of items) {
      const childrenAddedData = item.children
        ? transformAssemblyOptions(
            item.children,
            {},
            item.price,
            item.quantity * parentQuantity
          )
        : null

      const {
        options: childrenOptions,
        assemblyOptions: childrenAssemblyOptions,
      } = childrenAddedData || {
        options: undefined,
        assemblyOptions: undefined,
      }

      const { quantity, initialQuantity } = item

      if (quantity >= initialQuantity && quantity > 0) {
        added.push({
          normalizedQuantity: quantity,
          extraQuantity: quantity - initialQuantity,
          choiceType: item.choiceType,
          item: {
            name: item.name,
            sellingPrice: item.price,
            quantity,
            sellingPriceWithAssemblies:
              item.price + sumAssembliesPrice(item.children || {}),
            id: item.id,
            ...(childrenAssemblyOptions
              ? { assemblyOptions: childrenAssemblyOptions }
              : {}),
          },
        })
      }

      if (quantity < initialQuantity && item.choiceType === 'TOGGLE') {
        removed.push({
          name: item.name,
          initialQuantity,
          removedQuantity: initialQuantity - quantity,
        })
      }

      const addedChildrenCount = childrenAddedData
        ? childrenAddedData.options.length
        : 0

      if (quantity !== initialQuantity || addedChildrenCount > 0) {
        options.push({
          assemblyId: groupId,
          id: item.id,
          quantity: quantity * parentQuantity,
          seller: item.seller,
          ...(childrenOptions && childrenOptions.length > 0
            ? { options: childrenOptions }
            : {}),
        })
      }
    }
  }

  const assemblyInputValuesKeys: GroupId[] = Object.keys(inputValues)

  for (const groupId of assemblyInputValuesKeys) {
    const inputValuesObject = inputValues[groupId] || {}
    if (Object.keys(inputValuesObject).length > 0) {
      options.push({
        assemblyId: groupId,
        inputValues: inputValues[groupId],
      })
    }
  }

  return {
    options,
    assemblyOptions: {
      added,
      removed,
      parentPrice,
    },
  }
}
