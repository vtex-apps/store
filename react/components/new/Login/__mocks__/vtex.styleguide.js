import React from 'react'

export const Button = ({ children }) => (
  <button type="button" className="Button-mock">
    {children}
  </button>
)
export const ButtonWithIcon = ({ children }) => (
  <button type="button" className="ButtonWithIcon-mock">
    {children}
  </button>
)

export const Input = props => <input {...props} />

export const Spinner = () => <div className="spinner"></div>
