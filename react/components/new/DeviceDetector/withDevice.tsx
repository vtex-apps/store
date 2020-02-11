import React, { FC, ComponentType } from 'react'
import useDevice, { DeviceInfo } from './useDevice'

interface WithDeviceProps {
  deviceInfo: DeviceInfo
}

const withDevice = <P extends object>(
  Component: ComponentType<P>
): FC<P & WithDeviceProps> => ({ ...props }: WithDeviceProps) => {
  const { isMobile, device } = useDevice()

  return <Component device={device} isMobile={isMobile} {...(props as P)} />
}

export default withDevice
