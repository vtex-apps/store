import React from 'react'
import { defineMessages } from 'react-intl'
import useCssHandles from '../CssHandles/useCssHandles'
import Container from '../StoreComponents/Container'
import useResponsiveValues from '../ResponsiveValues/useResponsiveValues'

import {
  FlexLayoutTypes,
  useFlexLayoutContext,
} from './components/FlexLayoutContext'
import Row, { Props as RowProps } from './Row'

interface Props extends RowProps {
  fullWidth?: boolean
}

const CSS_HANDLES = ['flexRow'] as const

const FlexLayout: StorefrontFunctionComponent<Props> = props => {
  const responsiveProps = useResponsiveValues(props) as Props
  const { fullWidth } = responsiveProps
  const context = useFlexLayoutContext()
  const handles = useCssHandles(CSS_HANDLES)

  const content = <Row {...responsiveProps} />

  const isTopLevel = context.parent === FlexLayoutTypes.NONE

  if (fullWidth && !isTopLevel) {
    console.warn(
      'Prop `fullWidth` is allowed only on top-level `flex-layout.row` blocks.'
    )
  }

  if (fullWidth || !isTopLevel) {
    return <div className={handles.flexRow}>{content}</div>
  }

  return (
    <div className={handles.flexRow}>
      <Container>{content}</Container>
    </div>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.row.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.row.description',
  },
})

FlexLayout.schema = {
  title: messages.title.id,
  description: messages.description.id,
}

export default FlexLayout
