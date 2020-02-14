import React, { FC } from 'react'
import useCssHandles from '../../CssHandles/useCssHandles'
import Drawer from '../../Drawer/Drawer'

import MinicartIconButton from './MinicartIconButton'

const DRAWER_CLOSE_ICON_HEIGHT = 58
const CSS_HANLDES = ['minicartSideBarContentWrapper']

interface Props {
  maxDrawerWidth: number | string
  drawerSlideDirection: SlideDirectionType
}

const DrawerMode: FC<Props> = ({
  maxDrawerWidth,
  drawerSlideDirection,
  children,
}) => {
  const handles = useCssHandles(CSS_HANLDES)

  return (
    <Drawer
      maxWidth={maxDrawerWidth}
      slideDirection={drawerSlideDirection}
      customIcon={<MinicartIconButton />}
    >
      <div
        className={`${handles.minicartSideBarContentWrapper} w-100 h-100`}
        style={{
          height: window.innerHeight - DRAWER_CLOSE_ICON_HEIGHT,
        }}
      >
        {children}
      </div>
    </Drawer>
  )
}

export default DrawerMode
