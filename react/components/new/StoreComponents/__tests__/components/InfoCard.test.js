import React from 'react'
import { render } from '@vtex/test-tools/react'

import InfoCard from './../../InfoCard'

describe('<InfoCard />', () => {
  const renderComponent = props => {
    const defaultProps = {
      isFullModeStyle: false,
      headline: 'MY HEADLINE',
      subhead: 'MY SUBHEAD',
      imageUrl: 'my-image.com/image.png',
      callToActionText: 'CLICK HERE',
      callToActionUrl: 'classic-shoes/p'
    }
    return render(<InfoCard {...defaultProps} {...props} />)
  }

  it('should render with full mode style', () => {
    const { asFragment, getByTestId } = renderComponent({
      isFullModeStyle: true,
    })
    expect(asFragment()).toBeDefined()
    const container = getByTestId('container')
    expect(container.style['background-image']).toBeDefined()
    expect(asFragment()).toMatchSnapshot()
  })
  it('should render with image and text side by side', () => {
    const { asFragment, getByTestId } = renderComponent()
    expect(asFragment()).toBeDefined()
    const halfImage = getByTestId('half-image')
    expect(halfImage).toBeDefined()
    expect(asFragment()).toMatchSnapshot()
  })
  it('should render without a call to action', () => {
    const { asFragment } = renderComponent({
      isFullModeStyle: true,
      callToActionMode: 'none',
    })
    expect(asFragment()).toBeDefined()
    expect(asFragment()).toMatchSnapshot()
  })
  it('should wrap half image in a link with imageActionUrl', () => {
    const { asFragment } = renderComponent({
      isFullModeStyle: false,
      callToActionMode: 'none',
      imageActionUrl: 'classic-shoes/p',
    })
    expect(asFragment()).toBeDefined()
    expect(asFragment()).toMatchSnapshot()
  })
  it('should wrap whole container in a link with imageActionUrl', () => {
    const { asFragment } = renderComponent({
      isFullModeStyle: true,
      callToActionMode: 'none',
      imageActionUrl: 'classic-shoes/p',
      textAlignment: 'right',
      textPosition: 'center',
    })
    expect(asFragment()).toBeDefined()
    expect(asFragment()).toMatchSnapshot()
  })
  it('should insert span with class on headline', () => {
    const { asFragment } = renderComponent({
      isFullModeStyle: true,
      callToActionMode: 'none',
      textAlignment: 'right',
      textPosition: 'center',
      headline:
        'HEADLINE <span class="my-custom-class">THIS IS BOOOLD AND BLUE</span> HEADLINE STILL',
    })
    expect(asFragment()).toBeDefined()
    expect(asFragment()).toMatchSnapshot()
  })
  it('should not render subhead', () => {
    const { asFragment } = renderComponent({
      isFullModeStyle: true,
      callToActionMode: 'none',
      textAlignment: 'right',
      textPosition: 'center',
      headline:
        'HEADLINE <span class="my-custom-class">THIS IS BOOOLD AND BLUE</span> HEADLINE STILL',
      subhead: '',
    })
    expect(asFragment()).toBeDefined()
    expect(asFragment()).toMatchSnapshot()
  })
})
