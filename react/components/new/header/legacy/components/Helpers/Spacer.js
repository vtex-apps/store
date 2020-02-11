import React from 'react'
import { spacer } from '../../defaults'
import useDevice from '../../hooks/useDevice'

/**
 * Spacer necessary to content due fixed Header
 */
const Spacer = ({ spacerHeightDesktop, spacerHeightMobile, spacerWidth, containerHeight }) => {
  const { desktop } = useDevice()

  const height = containerHeight || (desktop ? spacerHeightDesktop : spacerHeightMobile)

  return (
    <div
      className="z-1 bg-base w-100 relative"
      style={{
        height,
        width: spacerWidth,
      }}
    />
  )
}

Spacer.propTypes = {
  ...spacer.propTypes,
}

Spacer.defaultProps = {
  ...spacer.defaultProps,
}

export default Spacer
