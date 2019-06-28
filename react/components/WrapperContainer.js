import React from 'react'

const WrapperContainer = ({ children, className }) => (
  <div className={className}>
    <div
      className="flex flex-column"
      style={{
        minHeight: '100vh',
      }}
    >
      {children}
    </div>
  </div>
)

export default WrapperContainer
