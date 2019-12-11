import { contains, map, path as ramdaPath, uniq, zip } from 'ramda'
import queryString from 'query-string'

const categoriesInSequence = mapValues => {
  let count = 0
  for (const value of mapValues) {
    if (value !== 'c') {
      return count
    }
    count++
  }
  return count
}

const queryMapComparator = (tuple1, tuple2) => {
  const [, specFilterVal1] = tuple1 && tuple1[0].split('specificationFilter_')
  const [, specFilterVal2] = tuple2 && tuple2[0].split('specificationFilter_')
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

const normalizeQueryMap = (path, queryMap) => {
  const splitMap = queryMap.map.split(',')
  const splitQuery = queryMap.query
    ? queryMap.query.split('/').slice(1)
    : path.split('/')

  const categoryTreeDepth = categoriesInSequence(splitMap)
  const zippedMapQuery = zip(splitMap, splitQuery)

  const sorted =
    zippedMapQuery &&
    zippedMapQuery.slice(categoryTreeDepth).sort(queryMapComparator)

  const assembledSortedQuery = [
    ...zippedMapQuery.slice(0, categoryTreeDepth),
    ...uniq(sorted),
  ]

  const sortedQueryMap = assembledSortedQuery
    .map(value => (Array.isArray(value) ? value[0] : value))
    .join(',')
  const sortedQueryPath = assembledSortedQuery.map(tuple => tuple[1]).join('/')

  return {
    map: sortedQueryMap,
    path: sortedQueryPath,
  }
}

export const normalizeNavigation = navigation => {
  const { path, query } = navigation
  if (ramdaPath(['__RUNTIME__', 'route', 'domain'], window) !== 'store') {
    return navigation
  }

  const queryMap = query ? queryString.parse(query) : {}
  if (queryMap.map) {
    const pathSegments = path.startsWith('/')
      ? path.split('/').slice(1)
      : path.split('/')
    const mapValues = queryMap.map.split(',').slice(0, pathSegments.length)
    let convertedSegments = map(
      ([pathSegment, mapValue]) =>
        contains('specificationFilter', mapValue)
          ? pathSegment
          : pathSegment.toLowerCase(),
      zip(pathSegments, mapValues)
    ).join('/')

    const { map: sortedMap, path: sortedPath } = normalizeQueryMap(
      convertedSegments,
      queryMap
    )

    if (queryMap.query) {
      queryMap.query = `/${sortedPath}`
    } else {
      convertedSegments = sortedPath
    }

    queryMap.map = sortedMap
    navigation.query = queryString.stringify(queryMap, {
      encode: false,
    })

    navigation.path = path.startsWith('/')
      ? `/${convertedSegments}`
      : convertedSegments
    return navigation
  }

  navigation.path = navigation.path && navigation.path.toLowerCase()
  return navigation
}