import React from 'react'

import Icon from './components/Icon'
import { getShape } from './utils/helpers'

interface Props extends EnhancedIconProps {
  readonly network: string
  readonly background: string
}

const IconSocial = ({ network, size, background, shape, ...props }: Props) => {
  const { wrapperProps, reducedIconSize } = getShape(size!, background, shape)

  return (
    <span {...wrapperProps}>
      <Icon
        id={`bnd-${network}`}
        handle="socialIcon"
        size={reducedIconSize}
        {...props}
      />
    </span>
  )
}

IconSocial.defautProps = {
  size: 16,
  viewBox: '0 0 16 16',
}

export default IconSocial
