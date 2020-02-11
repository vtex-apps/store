import React, { FunctionComponent } from 'react'
import useCssHandles from '../CssHandles/useCssHandles'

const CSS_HANDLES = ['footerSpacer'] as const

const Spacer: FunctionComponent = () => {
  const handles = useCssHandles(CSS_HANDLES)

  return <div className={`${handles.footerSpacer} flex flex-grow-1`} />
}

export default Spacer
