import React from 'react'

const WrapperContainer = ({ children, className }) => (
  <div className={className}>
    <div className="flex flex-column min-vh-100">{children}</div>
  </div>
)

export default WrapperContainer
