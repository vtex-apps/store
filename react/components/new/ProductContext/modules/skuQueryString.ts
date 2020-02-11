interface QueryParams {
  skuId?: string
  idsku?: string
}

// `idsku` querystring is to keep compatibility with Google Shopping integration
export const getSelectedSKUFromQueryString = (query: QueryParams) => query.skuId || query.idsku
