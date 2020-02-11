import React from 'react'
import { render } from '@vtex/test-tools/react'

import Slider from '../components/Slider.js'
import Slide from '../components/Slide.js'
import SliderContainer from '../components/SliderContainer.js'

describe('<SliderContainer /> component', () => {
  const renderComponent = customProps => {
    const props = {
      ...customProps,
    }

    const comp = (
      <SliderContainer {...props}>
        <Slider onChangeSlide={() => {}}>
          <Slide>
            <div>
              <p>Slide 1</p>
            </div>
          </Slide>
          <Slide>
            <div>
              <p>Slide 2</p>
            </div>
          </Slide>
        </Slider>
      </SliderContainer>
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

  it('should match snapshot with another tag', () => {
    const { asFragment } = renderComponent({ tag: 'span' })
    expect(asFragment()).toMatchSnapshot()
  })

  it('should generate with tag', () => {
    const { container } = renderComponent({ tag: 'span' })
    expect(container.querySelector('span')).toBeTruthy()
  })
})
