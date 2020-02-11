import React from 'react'

export const withDevice = Component => {
  const ExtendedComponent = props => <Component isMobile {...props} />

  ExtendedComponent.displayName = Component.displayName

  return ExtendedComponent
}
