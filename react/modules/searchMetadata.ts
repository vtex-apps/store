// eslint-disable-next-line no-restricted-imports
import { zipObj } from 'ramda'

import { SearchQueryData, CategoriesTrees, Facets } from './searchTypes'

const getDepartmentFromSpecificationFilters = (facets?: Facets) => {
  if (!facets?.queryArgs?.map.split(',').includes('c')) {
    return
  }

  const departmentFilter = facets.specificationFilters?.find(specFilter => {
    return specFilter.facets?.[0].key === 'category-1'
  })

  return departmentFilter?.facets?.find(facet => facet.selected)
}

const getDepartment = (searchQuery: SearchQueryData) => {
  if (searchQuery.facets?.categoriesTrees?.length) {
    return searchQuery.facets.categoriesTrees.find(
      department => department.selected
    )
  }
  return getDepartmentFromSpecificationFilters(searchQuery.facets)
}

export const getDepartmentMetadata = (searchQuery?: SearchQueryData) => {
  if (
    !searchQuery ||
    !searchQuery.facets ||
    !searchQuery.facets.categoriesTrees
  ) {
    return
  }

  const department = getDepartment(searchQuery)

  if (!department) {
    return
  }

  return {
    id: department.id,
    name: department.name,
  }
}

const getCategoryFromSpecificationFilters = (facets?: Facets) => {
  const totalCategories =
    facets?.queryArgs?.map.split(',').filter((key: string) => key === 'c')
      .length ?? 0

  if (totalCategories <= 1) {
    return
  }
  const categoryFilter = facets?.specificationFilters?.find(specFilter => {
    return specFilter.facets?.[0].key === 'category-2'
  })

  return categoryFilter?.facets?.find(facet => facet.selected)
}

const getLastCategory = (
  category: CategoriesTrees,
  facets?: Facets
): CategoriesTrees => {
  const selectedCategory =
    category.children &&
    category.children.length > 0 &&
    category.children.find(currCategory => currCategory.selected)

  if (!selectedCategory) {
    return getCategoryFromSpecificationFilters(facets) ?? category
  }

  return getLastCategory(selectedCategory)
}

export const getCategoryMetadata = (searchQuery?: SearchQueryData) => {
  if (
    !searchQuery ||
    !searchQuery.facets ||
    !searchQuery.facets.categoriesTrees
  ) {
    return
  }

  const department = getDepartment(searchQuery)

  if (!department) {
    return
  }

  const category = getLastCategory(department, searchQuery.facets)

  if (category === department) {
    return
  }

  return {
    id: category.id,
    name: category.name,
  }
}

export const getSearchMetadata = (searchQuery?: SearchQueryData) => {
  if (
    !searchQuery ||
    !searchQuery.productSearch ||
    !searchQuery.facets ||
    !searchQuery.facets.queryArgs
  ) {
    return
  }

  const { query, map } = searchQuery.facets.queryArgs
  const queryMap = zipObj(map.split(','), query.split('/'))

  const searchTerm = queryMap.ft

  if (!searchTerm) {
    return
  }

  const department = getDepartment(searchQuery)

  return {
    term: decodeURIComponent(searchTerm),
    category: department ? { id: department.id, name: department.name } : null,
    results: searchQuery.productSearch.recordsFiltered,
    operator: searchQuery.productSearch.operator,
    searchState: searchQuery.productSearch.searchState,
    correction: searchQuery.productSearch.correction,
  }
}
