/* eslint react/prop-types:0 */
import React, { forwardRef } from 'react'

export const ToastContext = React.createContext({ showToast: jest.fn() })

export function withToast(Comp) {
  return function WrappedWithToast(props) {
    return <Comp {...props} showToast={jest.fn()} />
  }
}

export function Tabs(props) {
  return <div className="tabs-mock"> {props.children} </div>
}

export function Tab(props) {
  return <div className="tab-mock"> {props.children} </div>
}

export function Spinner(props) {
  return <div className="spinner-mock"> {props.children} </div>
}

export function Dropdown(props) {
  const { onChange, options } = props
  let { value } = props

  if (value === null) {
    value = undefined
  }

  return (
    <select value={value} onChange={onChange}>
      {options.map(op => (
        <option key={op.value} value={op.value}>
          {op.label}
        </option>
      ))}
    </select>
  )
}

export const Input = forwardRef(function Input(
  { label, error, errorMessage, isLoading, prefix, suffix, ...props },
  ref
) {
  return (
    <label>
      {label}
      {prefix}
      <input
        data-isloading={isLoading}
        data-error={error}
        data-errormessage={errorMessage}
        ref={ref}
        {...props}
      />
      {suffix}
    </label>
  )
})

export const Button = jest.fn(({ isLoading, variation, block, children, ...props }) => {
  return (
    <button
      data-variation={variation}
      data-isloading={isLoading}
      data-block={block}
      {...props}>
      {children}
    </button>
  )
})
