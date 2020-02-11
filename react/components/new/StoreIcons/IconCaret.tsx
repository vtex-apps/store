import React from 'react'
import classnames from 'classnames'
import Icon from './components/Icon'
import { getOrientation } from './utils/helpers'

const IconCaret = ({ orientation, thin = false, ...props }: CaretProps) => {
  const orientationModifier = getOrientation(orientation)
  const id: string = classnames({
    [`nav-thin-caret${orientationModifier}`]: thin,
    [`nav-caret${orientationModifier}`]: !thin,
  })
  return <Icon id={id} handle="caretIcon" {...props} />
}

export default IconCaret
