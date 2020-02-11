import React from 'react'

export const useRuntime = () => {
  let hints = { mobile: false, desktop: true }
  const setHints = h => {
    hints = h
  }
  const page = 'test'
  const getSettings = () => ({ storeName: 'Store Name' })
  return { hints, setHints, page, getSettings }
}

export const useChildBlock = () => {
  return null
}

export const ExtensionPoint = ({ id }) => (
  <div className="extension-point-mock">{id}</div>
)

export const Link = ({ children }) => (
  <div className="link-mock">{children}</div>
)

export const NoSSR = ({ children }) => (
  <div className="no-ssr-mock">{children}</div>
)
