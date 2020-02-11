import React, { FunctionComponent, useContext, CSSProperties } from 'react'
import ReactResizeDetector from 'react-resize-detector'
import useCssHandles from '../../CssHandles/useCssHandles'

import { RowContext } from './StickyRows'

interface Props {
  sticky?: boolean
  zIndex?: number
}

const CSS_HANDLES = ['headerStickyRow'] as const

const StickyRow: FunctionComponent<Props> = ({ children, sticky, zIndex }) => {
  const handles = useCssHandles(CSS_HANDLES)
  const { offset, onResize } = useContext(RowContext)

  const stickyStyle: CSSProperties = {
    top: offset,
    zIndex,
  }

  return (
    <div
      style={sticky ? stickyStyle : undefined}
      className={`${handles.headerStickyRow} ${
        sticky ? `sticky ${!zIndex ? 'z-999' : ''}` : ''
      }`}
    >
      {children}

      {sticky && (
        <ReactResizeDetector
          handleHeight
          onResize={(_, height) => {
            onResize(height)
          }}
        />
      )}
    </div>
  )
}

export default StickyRow
