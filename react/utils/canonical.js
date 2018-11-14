import { keys } from 'ramda'

const canonicalPathFromParams = (canonicalTemplate, params) => {
  console.log(params)
  const regex = new RegExp(`:(${keys(params).join('|')})`, 'g')

  console.log(regex)

  return canonicalTemplate.replace(regex, (_, p) => params[p])
}

export default canonicalPathFromParams
