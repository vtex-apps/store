import React from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import { useRuntime } from 'vtex.render-runtime'

const OfflineWrapper = ({ children }) => {
  const { preview } = useRuntime()
  const shouldShowOfflinePage =
    window && window.navigator && !window.navigator.onLine && preview

  if (shouldShowOfflinePage) return <ExtensionPoint id="offline-warning" />

  return children
}

export default OfflineWrapper
