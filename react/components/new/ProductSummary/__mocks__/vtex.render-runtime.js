import React from 'react'

export function Link({ children }) {
  return children
}

export function ExtensionPoint(props) {
  return <div {...props} />
}

export function withRuntimeContext(Comp) {
  const InjectRuntime = props => {
    return <Comp {...props} runtime={{ hints: { mobile: false } }} />
  }

  return InjectRuntime
}

export const useRuntime = () => {
  return {
    hints: { mobile: false },
  }
}
