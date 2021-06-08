import { RuntimeWithRoute, useRuntime } from 'vtex.render-runtime'

export function useCanonicalLink() {
  const { route, rootPath = '' } = useRuntime() as RuntimeWithRoute
  const { canonicalPath } = route

  const canonicalHost =
    window.__hostname__ || (window.location && window.location.hostname)

  if (!canonicalHost || !canonicalPath) {
    return null
  }

  const canonicalLink = `https://${canonicalHost}${rootPath}${canonicalPath}`

  return canonicalLink
}
