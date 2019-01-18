import { buildCacheLocator } from 'vtex.render-runtime'

const STORE_GRAPHQL = 'vtex.store-graphql@2.x'

export const cacheLocator = {
  product: slug => buildCacheLocator(STORE_GRAPHQL, 'Product', slug),
}
