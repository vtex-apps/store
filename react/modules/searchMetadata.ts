import { endsWith } from 'ramda'
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
    category.children.find(category => category.selected)

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
    !searchQuery.productSearch.breadcrumb
  ) {
    return
  }

  const searchTerm = searchQuery.productSearch.breadcrumb.find(breadcrumb => {
    return breadcrumb.href.includes('?map=') && endsWith('ft', breadcrumb.href)
  })

  if (!searchTerm) {
    return
  }

  const department = getDepartment(searchQuery)

  return {
    term: searchTerm.name,
    category: department ? department.name : null,
    results: searchQuery.productSearch.recordsFiltered,
  }
}
