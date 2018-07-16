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

function getPathByParams(params) {
  if (params.term) return `/${params.term}`
  if (params.department && params.category && params.subcategory) {
    return `/${params.department}/${params.category}/${params.subcategory}`
  }
  if (params.department && params.category) {
    return `/${params.department}/${params.category}`
  }
  if (params.department) return `/${params.department}`
  return '/'
}

export function reversePagesPath(pagesPath, params) {
  if (!pagesPath) {
    return getPathByParams(params)
  }
  switch (pagesPath) {
    case 'store/search':
      return `/${params.term}`
    case 'store/department':
      return `/${params.department}`
    case 'store/category':
      return `/${params.department}/${params.category}`
    case 'store/subcategory':
      return `/${params.department}/${params.category}/${params.subcategory}`
    default:
      return '/'
  }
}
