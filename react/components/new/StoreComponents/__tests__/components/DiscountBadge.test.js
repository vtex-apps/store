import React from 'react'
import { render } from '@vtex/test-tools/react'

import DiscountBadge from '../../DiscountBadge'

describe('<DiscountBadge /> component', () => {
  function renderComponent(customProps = {}) {
    const props = {
      listPrice: 100,
      sellingPrice: 90,
      ...customProps,
    }
    const component = <DiscountBadge {...props}>Test</DiscountBadge>

    return render(component)
  }

  it('should be able to mount and not break', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toBeTruthy()
  })

  it('should match snapshot without label', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot with label', () => {
    const { asFragment } = renderComponent({ label: 'LABEL' })
    expect(asFragment()).toMatchSnapshot()
  })
})
