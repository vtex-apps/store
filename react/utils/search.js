export const SORT_OPTIONS = [
  {
    value: '',
    label: 'ordenation.sort-by',
  },
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
