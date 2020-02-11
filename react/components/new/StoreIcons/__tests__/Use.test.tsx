import React from 'react'
import { render } from '@vtex/test-tools/react'
import Use from '../components/Use'

describe('Use', () => {
  it('should match snapshot', () => {
    const component = render(
      <svg>
        <Use id="tst-snapshot" />
      </svg>
    ).asFragment()
    expect(component).toMatchSnapshot()
  })
})
