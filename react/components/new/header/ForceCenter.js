import React from 'react'
import useCssHandles from '../CssHandles/useCssHandles'

const CSS_HANDLES = ['forceCenter', 'forceCenterInnerContainer']

const ForceCenter = ({ children }) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div
      className={`${handles.forceCenter} absolute left-0 right-0 flex justify-center z-1`}
      style={{ pointerEvents: 'none' }}
    >
      <div
        className={handles.forceCenterInnerContainer}
        style={{ pointerEvents: 'all' }}
      >
        {children}
      </div>
    </div>
  )
}

export default ForceCenter
