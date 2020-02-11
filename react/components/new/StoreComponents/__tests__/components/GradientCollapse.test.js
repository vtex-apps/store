import React from 'react'
import { render } from '@vtex/test-tools/react'

import GradientCollapse from '../../GradientCollapse'

describe('<GradientCollapse /> component', () => {
  function renderComponent(customProps = {}) {
    const props = {
      collapseHeight: 50,
      ...customProps,
    }
    const component = <GradientCollapse {...props}>Test</GradientCollapse>

    return render(component)
  }

  it('should be able to mount and not break', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toBeTruthy()
  })

  it('should match snapshot', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toMatchSnapshot()
  })
})
