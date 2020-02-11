import React, { FC, ReactElement } from 'react'
import useDevice from '../../../../../DeviceDetector/useDevice'
import ZoomInPlace from './ZoomInPlace'

export enum ZoomMode {
  InPlaceClick = 'in-place-click',
  InPlaceHover = 'in-place-hover',
  Disabled = 'disabled'
}

interface Props {
  mode?: ZoomMode
  zoomContent?: ReactElement
  factor?: number
}


const Zoomable: FC<Props> = ({ children, factor = 2, zoomContent, mode = ZoomMode.InPlaceClick }) => {
  const { isMobile } = useDevice()

  if (isMobile && mode !== ZoomMode.Disabled) {
    // TODO: Good enough for now, but needs to be a gallery in the future.
    // Preferably photoswipe.com
    return (
      <ZoomInPlace type="click" factor={factor} zoomContent={zoomContent}>
        {children}
      </ZoomInPlace>
    )
  }

  switch (mode) {
    case ZoomMode.InPlaceHover:
      return (
        <ZoomInPlace type="hover" factor={factor} zoomContent={zoomContent}>
          {children}
        </ZoomInPlace>
      )
    case ZoomMode.InPlaceClick:
      return (
        <ZoomInPlace type="click" factor={factor} zoomContent={zoomContent}>
          {children}
        </ZoomInPlace>
      )
    case ZoomMode.Disabled:
    default:
      return <>{children}</>
  }
}

export default Zoomable