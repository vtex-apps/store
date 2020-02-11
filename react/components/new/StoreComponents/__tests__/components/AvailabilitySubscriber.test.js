import React from 'react'
import { render } from '@vtex/test-tools/react'
import { MockedProvider } from '@apollo/react-testing'

import AvailabilitySubscriber from '../../AvailabilitySubscriber'

describe('<AvailabilitySubscriber />', () => {
  function renderComponent(customProps = {}) {
    const props = {
      skuId: '111111',
      available: false,
      ...customProps,
    }

    return render(<AvailabilitySubscriber {...props} />, {
      graphql: { mocks: [] },
      MockedProvider
    })
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
