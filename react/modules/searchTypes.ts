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
    operator?: string
    searchState?: string
    correction?: {
      misspelled: boolean
    }
  }
  facets?: {
    categoriesTrees?: CategoriesTrees[]
    queryArgs?: QueryArgs
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

interface QueryArgs {
  query: string
  map: string
}
