import React from 'react'

import Icon from './components/Icon'
import { getType, getState } from './utils/helpers'

const IconEyeSight = ({ type, state, ...props }: EnhancedIconProps) => {
  const typeModifier = getType(type, 'filled, outline')
  const stateModifier = getState(state)
  return (
    <Icon
      id={`mpa-eyesight${typeModifier}${stateModifier}`}
      handle="eyeSightIcon"
      {...props}
    />
  )
}

export default IconEyeSight
