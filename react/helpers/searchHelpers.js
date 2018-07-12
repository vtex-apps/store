import * as RouteParser from 'route-parser'

export function joinPathWithRest(path, rest) {
  let pathValues = stripPath(path).split('/')
  pathValues = pathValues.concat((rest && rest.split(',')) || [])
  return pathValues.join('/')
}

export function getCategoriesFromQuery(query, map) {
  return getValuesByMap(query, map, 'c')
}

function getValuesByMap(query, map, mapValue) {
  const values = query.split('/')
  const mapValues = map.split(',')
  const brands = []
  mapValues.map((value, index) => {
    if (value === mapValue) {
      brands.push(values[index])
    }
  })
  return brands
}

export function findInTree(tree, values, index) {
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].Name.toUpperCase() === values[index].toUpperCase()) {
      if (index === values.length - 1) {
        return tree[i]
      }
      return findInTree(tree[i].Children, values, index + 1)
    }
  }
  return tree[0]
}

export function createMap(pathName, rest, isBrand) {
  let pathValues = stripPath(pathName).split('/')
  if (rest) pathValues = pathValues.concat(rest.split(','))
  const map =
    Array(pathValues.length - 1)
      .fill('c')
      .join(',') +
    (pathValues.length > 1 ? ',' : '') +
    (isBrand ? 'b' : 'c')
  return map
}

export function stripPath(pathName) {
  return pathName
    .replace(/^\//i, '')
    .replace(/\/s$/i, '')
    .replace(/\/d$/i, '')
    .replace(/\/b$/i, '')
}

function getPathOfPage(pagesPath) {
  const pages = require('../../pages/pages.json')
  return pages.pages[pagesPath].path
}

export function reversePagesPath(pagesPath, params) {
  const Parser = RouteParser.default ? RouteParser.default : RouteParser
  return new Parser(getPathOfPage(pagesPath) || '').reverse(params)
}
