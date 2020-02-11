import React from 'react'
import { render } from '@vtex/test-tools/react'

import CategoriesHighlights from '../../CategoriesHighlights'

describe('<CategoriesHighlights />', () => {
  const renderComponent = customProps => {
    const props = {
      cardShape: 'squared',
      showCategoriesHighlighted: true,
      ...customProps,
    }

    return render(<CategoriesHighlights {...props} />)
  }

  it('should be rendered', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toBeDefined()
    expect(asFragment()).toBeTruthy()
  })

  it('should match snapshot Squared', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot Rectangular', () => {
    const { asFragment } = renderComponent({ cardShape: 'rectangular' })
    expect(asFragment()).toMatchSnapshot()
  })
})
