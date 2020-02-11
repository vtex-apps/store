import React from 'react'
import { FunctionComponent } from 'react'
import ReactDOM from 'react-dom'

export interface Props {
  cover?: boolean
  target?: HTMLElement
  zIndex?: number
}

const Portal: FunctionComponent<Props> = ({
  children,
  target,
  zIndex = 2147483647,
  cover,
}) => {
  if (!target) {
    target = window && window.document && window.document.body
  }

  if (!target) {
    return null
  }

  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        ...(cover
          ? {
              bottom: 0,
              right: 0,
              pointerEvents: 'none',
            }
          : {}),
        zIndex,
      }}
    >
      <div style={{ pointerEvents: 'auto' }}>{children}</div>
    </div>,
    target
  )
}

export default Portal
