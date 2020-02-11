import React from 'react'

import Animation from '../../Animation'
import { render } from '@vtex/test-tools/react'

describe('<Animation /> component', () => {
  const renderComponent = customProps => {
    const comp = <Animation {...customProps}> Test </Animation>

    return render(comp)
  }

  it('should be rendered', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toBeTruthy()
  })

  it('should match snapshot animation left', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot animation right', () => {
    const { asFragment } = renderComponent({ type: 'drawerRight' })
    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot animation top', () => {
    const { asFragment } = renderComponent({ type: 'drawerTop' })
    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot animation bottom', () => {
    const { asFragment } = renderComponent({ type: 'drawerBottom' })
    expect(asFragment()).toMatchSnapshot()
  })
})
