export function createMap(params, rest, isBrand) {
  const paramValues = Object.keys(params)
    .filter(param => !param.startsWith('_'))
    .map(key => params[key])
    .concat(rest ? rest.split(',') : [])
  const map =
    Array(paramValues.length - 1)
      .fill('c')
      .join(',') +
    (paramValues.length > 1 ? ',' : '') +
    (isBrand ? 'b' : 'c')
  return map
}
