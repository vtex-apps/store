import { contains, map, path as ramdaPath, uniq, zip } from 'ramda'
import queryString from 'query-string'

const CATEGORY_TREE_MAX_DEPTH = 5

const normalizeQueryMap = (categoryTreeDepth, queryMap) => {
  const splitMap = queryMap.map && queryMap.map.split(',')
  const splitQuery = queryMap.query && queryMap.query.split('/').slice(1)
  const zippedMapQuery = zip(splitMap, splitQuery)

  const sorted =
    zippedMapQuery &&
    zippedMapQuery.slice(categoryTreeDepth).sort((tuple1, tuple2) => {
      const [, specFilterVal1] = tuple1[0].split('specificationFilter_')
      const [, specFilterVal2] = tuple2[0].split('specificationFilter_')
      const facetName1 = tuple1[1]
      const facetName2 = tuple2[1]
      return (
        Number(specFilterVal1) -
        Number(specFilterVal2) +
        facetName1.localeCompare(facetName2)
      )
    })

  const assembledSortedQuery = [
    ...zippedMapQuery.slice(0, categoryTreeDepth),
    ...uniq(sorted),
  ]

  queryMap.map = assembledSortedQuery.map(tuple => tuple[0]).join(',')
  queryMap.query = `/${assembledSortedQuery.map(tuple => tuple[1]).join('/')}`
}

export const normalizeNavigation = navigation => {
  const { path, query } = navigation
  if (ramdaPath(['__RUNTIME__', 'route', 'domain'], window) !== 'store') {
    return navigation
  }

  const queryMap = query ? queryString.parse(query) : {}
  if (queryMap && queryMap.map) {
    const pathSegments = path.startsWith('/')
      ? path.split('/').slice(1)
      : path.split('/')
    const mapValues = queryMap.map.split(',').slice(0, pathSegments.length)
    const convertedSegments = map(
      ([pathSegment, mapValue]) =>
        contains('specificationFilter', mapValue)
          ? pathSegment
          : pathSegment.toLowerCase(),
      zip(pathSegments, mapValues)
    )
    const categoryTreeDepth = Math.min(
      convertedSegments.length,
      CATEGORY_TREE_MAX_DEPTH
    )

    normalizeQueryMap(categoryTreeDepth, queryMap)
    navigation.query = queryString.stringify(queryMap, {
      encode: false,
    })

    navigation.path = path.startsWith('/')
      ? `/${convertedSegments.join('/')}`
      : convertedSegments.join('/')
    return navigation
  }

  navigation.path = navigation.path && navigation.path.toLowerCase()
  return navigation
}
