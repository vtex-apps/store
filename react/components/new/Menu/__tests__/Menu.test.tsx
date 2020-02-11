import { render } from '@vtex/test-tools/react'
import React from 'react'

import Menu from '../Menu'

describe('Menu Component', () => {
  function renderComponent() {
    return render(<Menu />)
  }

  it('should be rendered', () => {
    expect(renderComponent()).toBeDefined()
  })

  it('should match the snapshot', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toMatchSnapshot()
  })

  it('should be editable through storefront', () => {
    expect(Menu.getSchema({})).toHaveProperty('title')
  })
})
