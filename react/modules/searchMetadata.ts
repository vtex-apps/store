// eslint-disable-next-line no-restricted-imports
import { zipObj } from 'ramda'

import { SearchQueryData, CategoriesTrees } from './searchTypes'

const getDepartment = (searchQuery: SearchQueryData) => {
  return (
    searchQuery.facets &&
    searchQuery.facets.categoriesTrees &&
    searchQuery.facets.categoriesTrees.find(department => department.selected)
  )
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

const getLastCategory = (category: CategoriesTrees): CategoriesTrees => {
  const selectedCategory =
    category.children &&
    category.children.length > 0 &&
    category.children.find(currCategory => currCategory.selected)

  if (!selectedCategory) {
    return category
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

  const category = getLastCategory(department)

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
