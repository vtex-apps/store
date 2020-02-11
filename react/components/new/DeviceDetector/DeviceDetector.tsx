import React, { FunctionComponent } from 'react'
import useDevice, { DeviceInfo } from './useDevice'

export interface Props {
  children?: (deviceInfo: DeviceInfo) => React.ReactElement
}

const DeviceDetector: FunctionComponent<Props> = ({ children }) => {
  const { device, isMobile } = useDevice()

  if (!children) {
    return null
  }

  return children({ device, isMobile })
}

export default DeviceDetector
