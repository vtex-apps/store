export interface SearchQuery {
  loading: boolean
  products: any
  data?: SearchQueryData
  variables: {
    query: string
    map: string
  }
}

export interface SearchQueryData {
  searchMetadata?: {
    titleTag: string
    metaTagDescription: string
  }
  productSearch?: {
    breadcrumb: Breadcrumb[]
    recordsFiltered: number
  }
  facets?: {
    categoriesTrees?: CategoriesTrees[]
  }
}

export interface Breadcrumb {
  name: string
  href: string
}

export interface CategoriesTrees {
  id: string
  name: string
  selected: boolean
  children?: CategoriesTrees[]
}
