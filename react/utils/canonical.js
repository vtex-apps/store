import { keys } from 'ramda'

const canonicalPathFromParams = (canonicalTemplate, params) => {
  const regex = new RegExp(`:(${keys(params).join('|')})`, 'g')

  return canonicalTemplate.replace(regex, (_, p) => params[p])
}

export default canonicalPathFromParams
