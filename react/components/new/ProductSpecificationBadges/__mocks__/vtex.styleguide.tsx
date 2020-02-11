import React, { FC } from 'react'

function withForwardedRef(Component: any) {
  const ComponentWithRef = React.forwardRef((props, ref) => {
    return <Component {...props} forwardedRef={ref} />
  })

  ComponentWithRef.displayName = Component.displayName || Component.name

  return ComponentWithRef
}

export const Button: FC<any> = ({ children, onClick }) => (
  <button onClick={onClick}>
    {children}
  </button>
)

export const Spinner: FC<any> = ({ }) => (
  <div>Spinner</div>
)

export const Input: FC<any> = withForwardedRef(({ forwardedRef }) => (
  <label>
    <span>Input</span>
    <input ref={forwardedRef} />
  </label>
))

export const Radio: FC<any> = ({ }) => (
  <div>Radio</div>
)
