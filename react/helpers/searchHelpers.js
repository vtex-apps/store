import SortOptions from '../constants/searchSortOptions'

function createMap(params, rest, isBrand) {
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

export function processSearchContextProps(props, state, DEFAULT_PAGE) {
  const preProps = {
    ...props,
    ...(props.params.brand && {
      query: {
        ...props.query,
        map: props.map || 'b',
      },
    }),
  }

  const {
    nextTreePath,
    params,
    query: {
      order: orderBy = SortOptions[0].value,
      page: pageProps,
      map: mapProps,
      rest = '',
    },
  } = preProps

  const {
    variables: { maxItemsPerPage },
  } = state

  const map = mapProps || createMap(params, rest)
  const page = pageProps ? parseInt(pageProps) : DEFAULT_PAGE
  const from = (page - 1) * maxItemsPerPage
  const to = from + maxItemsPerPage - 1

  return {
    ...preProps,
    map,
    rest,
    page,
    orderBy,
    pagesPath: nextTreePath,
    to,
  }
}
