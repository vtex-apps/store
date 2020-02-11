import React, { FunctionComponent } from 'react'
import useCssHandles from '../../CssHandles/useCssHandles'

import StickyRow from './StickyRow'

interface Props {
  sticky: boolean
}

const CSS_HANDLES = ['headerBorder'] as const

const Border: FunctionComponent<Props> = ({ sticky }) => {
  const handles = useCssHandles(CSS_HANDLES)
  return (
    <StickyRow sticky={sticky}>
      <div className={`${handles.headerBorder} bb b--muted-3`} />
    </StickyRow>
  )
}

export default Border
