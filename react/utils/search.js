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
  if (params.department) {
    return 'c'
  } else if (params.brand) {
    return 'b'
  }

  return ['ft']
    .concat(params.terms ? params.terms.split('/').map(() => 'ft') : [])
    .join(',')
}
