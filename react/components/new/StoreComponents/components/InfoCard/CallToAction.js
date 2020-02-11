import React from 'react'
import Button from '../../../Styleguide/Button'
import { Link } from 'vtex.render-runtime'
import useCssHandles from '../../../CssHandles/useCssHandles'

import { callActionValues } from './SchemaTypes'

const CSS_HANDLES = ['infoCardCallActionContainer', 'infoCardCallActionText']

const CallToAction = ({ mode, text, url }) => {
  const handles = useCssHandles(CSS_HANDLES)

  if (mode === callActionValues.NONE) {
    return null
  }

  const ActionWrapper = ({ mode, text }) => {
    if (mode === callActionValues.BUTTON) {
      return <Button onClick={() => {}}>{text}</Button>
    }

    // Mode is link
    return (
      <p
        className={`${handles.infoCardCallActionText} link t-body b underline c-action-primary`}
      >
        {text}
      </p>
    )
  }

  return (
    <Link className={`${handles.infoCardCallActionContainer} mt6 mb6`} to={url}>
      <ActionWrapper text={text} mode={mode} />
    </Link>
  )
}

export default CallToAction
