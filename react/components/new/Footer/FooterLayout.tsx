import React from 'react'
import useCssHandles from '../CssHandles/useCssHandles'

const CSS_HANDLES = ['footerLayout', 'footerLayoutSpacer'] as const

const FooterLayout: React.FC = props => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <>
      <div className={`${handles.footerLayoutSpacer} flex flex-grow-1`} />
      <div className={handles.footerLayout}>{props.children}</div>
    </>
  )
}

export default FooterLayout
