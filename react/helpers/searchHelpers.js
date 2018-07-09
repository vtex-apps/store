import QueryString from 'query-string'
import * as RouteParser from 'route-parser'

import SortOptions from '../constants/searchSortOptions'

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
  return (
    global.__RUNTIME__.pages[pagesPath] &&
    global.__RUNTIME__.pages[pagesPath].path
  )
}

export function reversePagesPath(pagesPath, params) {
  const Parser = RouteParser.default ? RouteParser.default : RouteParser
  return new Parser(getPathOfPage(pagesPath) || '').reverse(params)
}

function matchPagesPath(pagesPath, pathName) {
  const Parser = RouteParser.default ? RouteParser.default : RouteParser
  return new Parser(pagesPath).match(pathName)
}

function getSpecificationFilterFromLink(link) {
  return `specificationFilter_${link.split('specificationFilter_')[1]}`
}

export function getPagesArgs(
  { name, type, link },
  pathName,
  rest,
  { map, orderBy, pageNumber = 1 },
  pagesPath,
  isUnselectLink
) {
  const restValues = (rest && rest.split(',')) || []
  const mapValues = (map && map.split(',')) || []
  if (name) {
    if (isUnselectLink) {
      const pathValuesLength = stripPath(pathName).split('/').length
      const index = restValues.findIndex(
        item => name.toLowerCase() === item.toLowerCase()
      )
      if (index !== -1) {
        restValues.splice(index, 1)
        mapValues.splice(pathValuesLength + index, 1)
      }
    } else {
      switch (type) {
        case 'Brands': {
          mapValues.push('b')
          break
        }
        case 'SpecificationFilters': {
          mapValues.push(`${getSpecificationFilterFromLink(link)}`)
          break
        }
        default: {
          mapValues.push('c')
        }
      }
      restValues.push(name)
    }
  }

  const queryString = QueryString.stringify({
    map: mapValues.join(','),
    page: pageNumber !== 1 ? pageNumber : undefined,
    order: orderBy === SortOptions[0].value ? undefined : orderBy,
    rest: restValues.join(',') || undefined,
  })
  const params = matchPagesPath(getPathOfPage(pagesPath), pathName)
  return { page: pagesPath, params, queryString }
}
