import React from 'react'

const ReactResizeDetector = ({ children }) => {
  const width = 200
  return <div>{children(width)}</div>
}

export default ReactResizeDetector
