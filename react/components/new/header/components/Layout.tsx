import React, { FunctionComponent } from 'react'

import StickyRows from './StickyRows'

const Layout: FunctionComponent = ({ children }) => {
  return <StickyRows>{children}</StickyRows>
}

export default Layout
