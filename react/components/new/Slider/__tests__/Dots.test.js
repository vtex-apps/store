import React from 'react'
import { render, fireEvent } from '@vtex/test-tools/react'

import Dots from '../components/Dots.js'

describe('<Dots /> component', () => {
  const renderComponent = customProps => {
    const props = {
      totalSlides: 10,
      onChangeSlide: () => {},
      ...customProps,
    }

    const comp = <Dots {...props} />

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

  it('should be active when clicked', () => {
    const { container } = renderComponent({
      classes: { dot: 'dot', activeDot: 'active', notActiveDot: 'inactive' },
    })

    const dot = container.querySelector('.dot')
    fireEvent.click(dot)

    expect(container.querySelector('.inactive')).toBeTruthy()
  })
})
