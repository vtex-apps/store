import { contains, path as ramdaPath, zip, flatten } from 'ramda'
import queryString from 'query-string'

const SPEC_FILTER = 'specificationFilter'
const MAP_CATEGORY_CHAR = 'c'
const MAP_VALUES_SEP = ','
const PATH_SEPARATOR = '/'

const isLegacySearchFormat = (pathSegments, map) => {
  if (!map) {
    return false
  }
  return (
    map.includes(SPEC_FILTER) &&
    map.split(MAP_VALUES_SEP).length === pathSegments.length
  )
}

const categoriesInSequence = mapValues => {
  let count = 0
  for (const value of mapValues) {
    if (value !== MAP_CATEGORY_CHAR) {
      return count
    }
    count++
  }
  return count
}

const queryMapComparator = (tuple1, tuple2) => {
  const [, specFilterVal1] = tuple1 && tuple1[0].split(`${SPEC_FILTER}_`)
  const [, specFilterVal2] = tuple2 && tuple2[0].split(`${SPEC_FILTER}_`)
  const facetName1 = tuple1[1]
  const facetName2 = tuple2[1]

  const considerSpecificationFilter =
    specFilterVal1 &&
    specFilterVal2 &&
    !isNaN(Number(specFilterVal1)) &&
    !isNaN(Number(specFilterVal2))

  return considerSpecificationFilter
    ? Number(specFilterVal1) -
        Number(specFilterVal2) +
        facetName1.localeCompare(facetName2)
    : facetName1.localeCompare(facetName2)
}

const normalizeQueryMap = (pathSegments, mapSegments) => {
  const categoryTreeDepth = categoriesInSequence(mapSegments)
  const zippedMapQuery = zip(mapSegments, pathSegments)

  const sorted =
    zippedMapQuery &&
    zippedMapQuery.slice(categoryTreeDepth).sort(queryMapComparator)

  const assembledSortedQuery = zippedMapQuery
    .slice(0, categoryTreeDepth)
    .concat(sorted)

  const sortedMap = assembledSortedQuery
    .map(value => (Array.isArray(value) ? value[0] : value))
    .join(',')
  const sortedPathSegments = assembledSortedQuery.map(tuple => tuple[1])

  return {
    map: sortedMap,
    pathSegments: sortedPathSegments,
  }
}

const normalizeSearchNavigation = (pathSegments, map) => {
  return { pathSegments, map }
}

const getIgnoredSegments = ignore => {
  return ignore
    ? flatten(
        Object.values(ignore).map(routeModifier =>
          routeModifier.path.split(PATH_SEPARATOR)
        )
      )
    : []
}

const normalizeLegacySearchNavigation = (pathSegments, queryMap, query) => {
  if (queryMap.map) {
    const mapValues = queryMap.map.split(MAP_VALUES_SEP)
    let convertedSegments = zip(pathSegments, mapValues).map(
      ([pathSegment, mapValue]) =>
        contains(SPEC_FILTER, mapValue)
          ? pathSegment
          : pathSegment.toLowerCase()
    )

    const {
      pathSegments: sortedPathSegments,
      map: sortedMap,
    } = normalizeQueryMap(
      queryMap.query ? queryMap.query.split('/').slice(1) : convertedSegments,
      mapValues
    )

    queryMap.map = sortedMap
    if (queryMap.query) {
      queryMap.query = `/${sortedPathSegments.join('/')}`
    } else {
      convertedSegments = sortedPathSegments
    }

    const normalizedQuery = queryString.stringify(queryMap, {
      encode: false,
    })

    return { pathSegments: convertedSegments, query: normalizedQuery }
  }
  return { pathSegments: pathSegments, query: query }
}

export const normalizeNavigation = navigation => {
  if (ramdaPath(['__RUNTIME__', 'route', 'domain'], window) !== 'store') {
    return navigation
  }

  const { path, query, options } = navigation
  const parsedQuery = query ? queryString.parse(query) : {}
  const { map } = parsedQuery

  const pathSegments = path.startsWith(PATH_SEPARATOR)
    ? path.split(PATH_SEPARATOR).slice(1)
    : path.split(PATH_SEPARATOR)

  const normalizedNavigation =
    parsedQuery.query || isLegacySearchFormat(pathSegments, map)
      ? normalizeLegacySearchNavigation(pathSegments, parsedQuery, query)
      : normalizeSearchNavigation(pathSegments, query)

  navigation.path = path.startsWith('/')
    ? '/' + normalizedNavigation.pathSegments.join('/')
    : normalizedNavigation.pathSegments.join('/')
  navigation.query = normalizedNavigation.query
  return navigation
}
