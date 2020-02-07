import React from 'react'
import { render, waitForElement } from '@vtex/test-tools/react'

import PoweredBy from '../PoweredBy'

describe('PoweredBy', () => {
  it('should get the platform from runtime', async () => {
    const { getByAltText } = render(<PoweredBy />)

    const element = await waitForElement(() => getByAltText('VTEX'))

    const src = element.getAttribute('src')

    expect(src).toBe('vtex-bw.svg')
  })
})
