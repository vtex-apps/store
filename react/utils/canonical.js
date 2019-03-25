import { isEmpty } from 'ramda'
import RouteParser from 'route-parser'

const canonicalPathFromParams = (canonicalRouteTemplate, params) =>
  !isEmpty(params) && canonicalRouteTemplate
    ? new RouteParser(canonicalRouteTemplate).reverse(params)
    : null

export default canonicalPathFromParams
