import React from 'react'

const withRuntimeContext = Component => {
  const ExtendedComponent = props => (
    <Component runtime={{ hints: { mobile: true } }} {...props} />
  )

  ExtendedComponent.displayName = Component.displayName

  return ExtendedComponent
}

export { withRuntimeContext }
