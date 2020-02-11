export enum InitialSelectionType {
  complete = 'complete',
  image = 'image',
  empty = 'empty',
}

export enum DisplayMode {
  select = 'select',
  default = 'default',
  slider = 'slider',
}

export interface SelectorProductItem extends Omit<ProductItem, 'variations'> {
  variations: string[]
  variationValues: Record<string, string>
}

export type SelectedVariations = Record<string, string | null>

export interface CallbackItem {
  name: string
  value: string
  skuId: string | null
  isMainAndImpossible: boolean
  possibleItems: SelectorProductItem[]
}

export interface Image {
  imageId: string
  imageLabel: string | null
  imageTag: string
  imageUrl: string
  imageText: string
}

export type ImageMap = Record<string, Record<string, Image | undefined>>

export interface DisplayOption {
  label: string
  onSelectItem: () => void
  image: Image | undefined
  available: boolean
  impossible: boolean
}

export interface DisplayVariation {
  name: string
  options: DisplayOption[]
}

export type Variations = Record<string, string[]>
