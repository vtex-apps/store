import React, { FunctionComponent } from 'react'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['footerSpacer'] as const

const Spacer: FunctionComponent = () => {
  const handles = useCssHandles(CSS_HANDLES)

  return <div className={`${handles.footerSpacer} flex flex-grow-1`} />
}

export default Spacer
