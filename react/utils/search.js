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

export function createMap(params, rest, isBrand) {
  const paramValues = Object.keys(params)
    .filter(param => !param.startsWith('_'))
    .map(key => params[key])
    .concat(rest ? rest.split(',') : [])
  const map =
    paramValues.length > 0 &&
    Array(paramValues.length - 1)
      .fill('c')
      .join(',') +
    (paramValues.length > 1 ? ',' : '') +
    (isBrand ? 'b' : 'c')
  return map
}

export const canonicalPathFromParams = ({
  brand,
  department,
  category,
  subcategory,
}) =>
  ['', brand || department, category, subcategory].reduce(
    (acc, curr) => (curr ? `${acc}/${curr}` : acc)
  )
