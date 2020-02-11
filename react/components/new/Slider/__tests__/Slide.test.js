import React from 'react'
import { render } from '@vtex/test-tools/react'

import Slide from '../components/Slide.js'

describe('<Slide /> component', () => {
  const renderComponent = customProps => {
    const props = {
      ...customProps,
    }

    const comp = (
      <Slide {...props}>
        <div>
          <p>Testing</p>
        </div>
      </Slide>
    )

    return render(comp)
  }

  it('should be rendered', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toBeTruthy()
  })

  it('should match snapshot', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toMatchSnapshot()
  })

  it('should generate with the correct tag', () => {
    const { container, rerender } = renderComponent({ tag: 'span' })
    expect(container.querySelector('span')).toBeTruthy()

    rerender(<Slide tag="main" />)
    expect(container.querySelector('main')).toBeTruthy()

    rerender(<Slide tag="section" />)
    expect(container.querySelector('section')).toBeTruthy()
  })

  it('should math snapshot with tag', () => {
    const { asFragment } = renderComponent({ tag: 'span' })
    expect(asFragment()).toMatchSnapshot()
  })
})
