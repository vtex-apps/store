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
  facets?: Facets
}

export interface Facets {
  categoriesTrees?: CategoriesTrees[]
  queryArgs?: QueryArgs
  specificationFilters?: SpecificationFilter[]
}

interface SpecificationFilter {
  facets?: any[]
  hidden: boolean
  name: string
  quantity: number
  type: string
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
