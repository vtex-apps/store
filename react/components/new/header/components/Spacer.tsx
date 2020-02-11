import React, { FunctionComponent } from 'react'
import useCssHandles from '../../CssHandles/useCssHandles'

const CSS_HANDLES = ['headerSpacer'] as const

const Spacer: FunctionComponent = () => {
  const handles = useCssHandles(CSS_HANDLES)

  return <div className={`${handles.headerSpacer} flex flex-grow-1`} />
}

export default Spacer
