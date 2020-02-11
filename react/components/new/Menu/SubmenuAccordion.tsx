import classNames from 'classnames'
import React from 'react'
import { defineMessages } from 'react-intl'
import Collapsible from './components/Collapsible'

import useCssHandles from '../CssHandles/useCssHandles'

const CSS_HANDLES = ['submenuAccordion'] as const

interface Props {
  isOpen: boolean
  blockClass?: string
}

const SubmenuAccordion: StorefrontFunctionComponent<Props> = ({
  isOpen,
  children,
}) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <Collapsible open={isOpen} >
      <section className={classNames(handles.submenuAccordion, 'w-100 flex pl4 flex')}>
        {children}
      </section>
    </Collapsible>
  )
}

const messages = defineMessages({
  submenuTitle: {
    defaultMessage: '',
    id: 'editor.menu.submenu.title',
  },
})

SubmenuAccordion.getSchema = () => ({
  title: messages.submenuTitle.id,
  type: 'object',
})

export default SubmenuAccordion
