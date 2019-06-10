export const SORT_OPTIONS = [
  {
    value: 'OrderByTopSaleDESC',
    label: 'ordenation.sales',
  },
  {
    value: 'OrderByReleaseDateDESC',
    label: 'ordenation.release.date',
  },
  {
    value: 'OrderByBestDiscountDESC',
    label: 'ordenation.discount',
  },
  {
    value: 'OrderByPriceDESC',
    label: 'ordenation.price.descending',
  },
  {
    value: 'OrderByPriceASC',
    label: 'ordenation.price.ascending',
  },
  {
    value: 'OrderByNameASC',
    label: 'ordenation.name.ascending',
  },
  {
    value: 'OrderByNameDESC',
    label: 'ordenation.name.descending',
  },
]

// Quick function to get querystring
// https://stackoverflow.com/a/901144/5313009
// TODO: Replace this with a better function
const getParameterByName = (name, url) => {
  if (!url) url = window && window.location && window.location.href
  name = name.replace(/[[\]]/g, '\\$&')

  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
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
  } else if (params.category) {
    return 'c,c'
  } else if (params.department) {
    return 'c'
  } else if (params.brand) {
    return 'b'
  } else if (params.term) {
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
