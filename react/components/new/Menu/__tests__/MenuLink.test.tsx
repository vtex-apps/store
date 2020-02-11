import { render } from '@vtex/test-tools/react'
import React from 'react'

import Menu from '../index'

describe('MenuLink Component', () => {
  function renderComponent() {
    const props = {
      links: [
        {
          externalPage: 'externalPage',
          internalPage: 'internalPage',
          page: 'page',
          params: 'params',
          position: 'position',
          text: 'text',
          typeOfRoute: 'typeOfRoute',
        },
      ],
    }

    return render(<Menu {...props} />)
  }

  it('should be rendered', () => {
    expect(renderComponent()).toBeDefined()
  })

  it('should match the snapshot', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toMatchSnapshot()
  })
})
