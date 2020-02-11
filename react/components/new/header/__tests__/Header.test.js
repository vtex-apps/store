import React from 'react'
import { render } from '@vtex/test-tools/react'
import { useRuntime } from 'vtex.render-runtime'

import Header from '../legacy/index'

describe('Header Component', () => {
  beforeEach(() => {
    const { setHints } = useRuntime()
    setHints({ mobile: false, desktop: true })
  })

  it('should be rendered', () => {
    const component = render(<Header />)
    expect(component).toBeTruthy()
  })

  it('should match snapshot without leanmode', () => {
    const component = render(<Header />)
    expect(component.asFragment()).toMatchSnapshot()
  })

  it('should match snapshot with leanmode', () => {
    const component = render(<Header leanWhen="test" />)
    expect(component.asFragment()).toMatchSnapshot()
  })

  it('should match snapshot mobile without leanmode', () => {
    const { setHints } = useRuntime()
    setHints({ mobile: true, desktop: false })

    const component = render(<Header />)
    expect(component.asFragment()).toMatchSnapshot()
  })

  it('should match snapshot mobile with leanmode', () => {
    const { setHints } = useRuntime()
    setHints({ mobile: true, desktop: false })

    const component = render(<Header leanWhen="test" />)
    expect(component.asFragment()).toMatchSnapshot()
  })
})
