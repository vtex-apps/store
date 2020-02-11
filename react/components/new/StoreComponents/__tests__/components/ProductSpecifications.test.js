import React from 'react'

import ProductSpecifications from '../../ProductSpecifications'
import { render } from '@vtex/test-tools/react'

describe('<ProductSpecifications /> component', () => {
  const renderComponent = customProps => {
    const props = {
      ...customProps,
    }
    const comp = <ProductSpecifications {...props} />

    return render(comp)
  }

  it('should be rendered', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toBeTruthy()
  })

  it('should match snapshot with table view and no specifications', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot with table view and with specification', () => {
    const { asFragment } = renderComponent({
      specifications: [{ name: 'test', values: ['value'] }],
    })
    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot with tabs view', () => {
    const { asFragment } = renderComponent({
      specifications: [{ name: 'test', values: ['value'] }],
      tabsMode: true,
    })
    expect(asFragment()).toMatchSnapshot()
  })
})
