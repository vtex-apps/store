import React from 'react'
import { render } from '@vtex/test-tools/react'

import CollectionBadges from '../../CollectionBadges'

describe('<CollectionBadges /> component', () => {
  function renderComponent(customProps = {}) {
    const component = <CollectionBadges {...customProps}>Test</CollectionBadges>

    return render(component)
  }

  it('should be able to mount and not break', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toBeTruthy()
  })

  it('should match snapshot without badges', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot with badges', () => {
    const { asFragment } = renderComponent({
      collectionBadgesText: ['badge1', 'badge2'],
    })
    expect(asFragment()).toMatchSnapshot()
  })
})
