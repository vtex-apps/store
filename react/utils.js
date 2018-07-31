import { path, last, head } from 'ramda'

function stripCategory(category) {
  return category.replace(/^\/|\/$/g, '')
}

export function getProductCategory(product) {
  return stripCategory(path(['categories', '0'], product))
}

export function getProductDepartment(product) {}
