import React, { Fragment, FC } from 'react'
import useCssHandles from '../CssHandles/useCssHandles'
import { useStickyScroll } from './useStickyScroll'

const CSS_HANDLES = ['container'] as const

enum Positions {
  BOTTOM = 'bottom',
  TOP = 'top',
}

interface Props {
  position?: Positions
  verticalSpacing?: number
}

interface StorefrontComponent extends FC<Props> {
  schema?: any
}

const StickyLayoutComponent: StorefrontComponent = ({
  children,
  position,
  verticalSpacing = 0,
}) => {
  const handles = useCssHandles(CSS_HANDLES)

  const { containerReference, container } = useStickyScroll({
    position,
    verticalSpacing,
  })

  if (
    !position ||
    (position !== Positions.BOTTOM && position !== Positions.TOP)
  ) {
    return <Fragment>{children}</Fragment>
  }

  return (
    <Fragment>
      <div ref={containerReference}></div>
      <div
        ref={container}
        className={handles.container}
        style={{
          position: 'relative',
          bottom: 0,
          zIndex: 10,
        }}
      >
        {children}
      </div>
    </Fragment>
  )
}

export default StickyLayoutComponent
