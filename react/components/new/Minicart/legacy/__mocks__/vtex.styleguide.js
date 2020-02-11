import React from 'react'

export const Button = ({ icon, ...props }) => (
  <button {...props}>Button test{props.children}</button>
)

export const ButtonWithIcon = ({ icon, ...props }) => (
  <button {...props}>
    Button test{icon} {props.children}
  </button>
)

export const Spinner = ({ children }) => <div>{children}</div>

export const ToastContext = React.createContext({
  showToast: jest.fn(),
})

export const withToast = WrappedComponent => {
  const withToast = props => (
    <WrappedComponent showToast={() => {}} hideToast={() => {}} {...props} />
  )
  return withToast
}
