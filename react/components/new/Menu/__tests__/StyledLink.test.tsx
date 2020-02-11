import { render } from '@vtex/test-tools/react'
import React from 'react'

import StyledLink from '../components/StyledLink'


describe('Icon should appear at the left', () => {
  function renderComponent(iconPos: "left" | "right" | undefined) {
    const props = {
      active: false,
      children: "Shop",
      highlight: false,
      iconProps: {
        activeClassName: "rebel-pink",
        id: "bnd-logo",
        mutedClassName: "c-action-primary",
        size: 16,
        viewBox: "0 0 16 16",
      },
      iconPosition: iconPos,
      id: "menu-item-shop",
      params: undefined,
      query: undefined,
      title: "Shop",
      to: "#",
      treePath: "store.home/$before_header.full/header-layout.desktop/header-row#3-desktop/vtex.menu@2.x:menu#websites/menu-item#shop"
    }
    return render(<StyledLink {...props} />)
  }

  it('should be rendered', () => {
    expect(renderComponent('left')).toBeDefined()
  })

  it('should not have icon', () => {
    const props = {
      active: false,
      children: "Shop",
      highlight: false,
      iconToTheRight: false,
      id: "menu-item-shop",
      params: undefined,
      query: undefined,
      title: "Shop",
      to: "#",
      treePath: "store.home/$before_header.full/header-layout.desktop/header-row#3-desktop/vtex.menu@2.x:menu#websites/menu-item#shop"
    }

    const {queryByTestId} = render(<StyledLink {...props} />)
    expect(queryByTestId('icon-right')).toBeNull()
    expect(queryByTestId('icon-left')).toBeNull()
  })

  it('should have icon to the left', () => {
    const {getByTestId} = renderComponent('left')
    expect(getByTestId('icon-left'))
  })

  it('should have icon to the right', () => {
    const {getByTestId} = renderComponent('right')
    expect(getByTestId('icon-right'))
  })

})