import RouteParser from 'route-parser'

const canonicalPathFromParams = (canonicalTemplate, params) => {
  return new RouteParser(canonicalTemplate).reverse(params)
}

export default canonicalPathFromParams
