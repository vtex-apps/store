import React from 'react'

export const withRuntimeContext = Comp => props => (
  <Comp {...props} runtime={{ hints: { mobile: false } }} />
)

export const ExtensionPoint = () => (
  <div className="extension-point-mock">Product Summary extension point</div>
)

export const NoSSR = ({ children }) => {
  return <div className="nossr-mock">{children}</div>
}
