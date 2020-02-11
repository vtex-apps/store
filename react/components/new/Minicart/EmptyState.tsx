import React, { FC } from 'react'
import useCssHandles from '../CssHandles/useCssHandles'

const CSS_HANDLES = ['minicartEmptyStateContainer'] as const

const EmptyState: FC = ({ children }) => {
  const handles = useCssHandles(CSS_HANDLES)

  return <div className={handles.minicartEmptyStateContainer}>{children}</div>
}

export default EmptyState
