import { buildCacheLocator } from 'vtex.render-runtime'

const SEARCH_GRAPHQL = 'vtex.search-graphql@0.x'

export const cacheLocator = {
  product: slug => buildCacheLocator(SEARCH_GRAPHQL, 'Product', slug),
}
