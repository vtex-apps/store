import React from 'react'
import useCssHandles from '../CssHandles/useCssHandles'

const CSS_HANDLES = ['spacer']

const Spacer = () => {
  const handles = useCssHandles(CSS_HANDLES)
  return <div className={`${handles.spacer} flex flex-grow-1`}/>
}

export default Spacer
