export const SORT_OPTIONS = [
  {
    value: 'OrderByDefault',
    label: 'store/ordenation.default',
  },
  {
    value: 'OrderByScoreDESC',
    label: 'store/ordenation.relevance',
  },
  {
    value: 'OrderByTopSaleDESC',
    label: 'store/ordenation.sales',
  },
  {
    value: 'OrderByReleaseDateDESC',
    label: 'store/ordenation.release.date',
  },
  {
    value: 'OrderByBestDiscountDESC',
    label: 'store/ordenation.discount',
  },
  {
    value: 'OrderByPriceDESC',
    label: 'store/ordenation.price.descending',
  },
  {
    value: 'OrderByPriceASC',
    label: 'store/ordenation.price.ascending',
  },
  {
    value: 'OrderByNameASC',
    label: 'store/ordenation.name.ascending',
  },
  {
    value: 'OrderByNameDESC',
    label: 'store/ordenation.name.descending',
  },
]

// Quick function to get querystring
// https://stackoverflow.com/a/901144/5313009
// TODO: Replace this with a better function
const getParameterByName = (name, url) => {
  if (!url) url = window && window.location && window.location.href
  name = name.replace(/[[\]]/g, '\\$&')

  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`)
  const results = regex.exec(url)

  if (!results) return null
  if (!results[2]) return ''

  return (
    window &&
    window.decodeURIComponent &&
    window.decodeURIComponent(results[2].replace(/\+/g, ' '))
  )
}

export function getMapFromURL(url) {
  getParameterByName('map', url)
}

export function createInitialMap(params) {
  if (params.subcategory) {
    return 'c,c,c'
  }
  if (params.category) {
    return 'c,c'
  }
  if (params.department) {
    return 'c'
  }
  if (params.brand) {
    return 'b'
  }
  if (params.term) {
    return 'ft'
  }

  return params.terms
    .split('/')
    .map(() => 'ft')
    .join(',')
}

export function initializeMap(params, url) {
  return getMapFromURL(url) || createInitialMap(params)
}
