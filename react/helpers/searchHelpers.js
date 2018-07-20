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

export function reversePagesPath(params) {
  if (params.term) return `/${params.term}`

  if (params.department && params.category && params.subcategory) {
    return `/${params.department}/${params.category}/${params.subcategory}`
  }

  if (params.department && params.category) {
    return `/${params.department}/${params.category}`
  }

  if (params.department) {
    return `/${params.department}`
  }

  return '/'
}
