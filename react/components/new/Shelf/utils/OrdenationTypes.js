const ordenationTypes = {
  ORDER_BY_RELEVANCE: {
    name: 'admin/editor.shelf.orderType.relevance',
    value: '',
  },
  ORDER_BY_TOP_SALE_DESC: {
    name: 'admin/editor.shelf.orderType.sales',
    value: 'OrderByTopSaleDESC',
  },
  ORDER_BY_PRICE_DESC: {
    name: 'admin/editor.shelf.orderType.priceDesc',
    value: 'OrderByPriceDESC',
  },
  ORDER_BY_PRICE_ASC: {
    name: 'admin/editor.shelf.orderType.priceAsc',
    value: 'OrderByPriceASC',
  },
  ORDER_BY_NAME_ASC: {
    name: 'admin/editor.shelf.orderType.nameAsc',
    value: 'OrderByNameASC',
  },
  ORDER_BY_NAME_DESC: {
    name: 'admin/editor.shelf.orderType.nameDesc',
    value: 'OrderByNameDESC',
  },
  ORDER_BY_RELEASE_DATE_DESC: {
    name: 'admin/editor.shelf.orderType.releaseDate',
    value: 'OrderByReleaseDateDESC',
  },
  ORDER_BY_BEST_DISCOUNT_DESC: {
    name: 'admin/editor.shelf.orderType.discount',
    value: 'OrderByBestDiscountDESC',
  },
}

export function getOrdenationNames() {
  const names = []
  for (const key in ordenationTypes) {
    names.push(ordenationTypes[key].name)
  }
  return names
}

export function getOrdenationValues() {
  const values = []
  for (const key in ordenationTypes) {
    values.push(ordenationTypes[key].value)
  }
  return values
}

export default ordenationTypes
