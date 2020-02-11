import React from 'react'

/**
 * Simple border
 */
const Border = () => {
  return (
    <div
      className="bb bw1 b--muted-4 relative"
      style={{
        top: 'inherit',
        boxSizing: 'content-box',
        zIndex: -2,
      }}
    />
  )
}

export default Border
