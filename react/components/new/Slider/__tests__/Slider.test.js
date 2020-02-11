import React from 'react'
import { render } from '@vtex/test-tools/react'

import Slider from '../components/Slider.js'
import Slide from '../components/Slide.js'

describe('<Slider /> component', () => {
  const renderComponent = customProps => {
    const props = {
      loop: true,
      arrowRender: ({ orientation }) => {
        return <div>arrow {orientation}</div>
      },
      onChangeSlide: () => {},
      ...customProps,
    }

    const comp = (
      <Slider {...props}>
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
})
