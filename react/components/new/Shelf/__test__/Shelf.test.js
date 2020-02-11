/* eslint-env jest */
import React from 'react'
import { render } from '@vtex/test-tools/react'
import ProductList from '../components/ProductList'
import { productMock } from '../__mocks__/productMock'
import Shelf from '../Shelf'
import { resolvePaginationDotsVisibility } from '../utils/resolvePaginationDots'
const fs = require('fs')

describe('Shelf component', () => {
  const renderComponent = customProps => {
    const props = {
      maxItems: 1,
      itemsPerPage: 1,
      arrows: true,
      showTitle: true,
    }

    const titleText = 'store/shelf.title'
    const wrapper = render(<ProductList titleText={titleText} {...props} {...customProps} />)
    return wrapper
  }

  it('should be rendered', () => {
    const component = renderComponent()
    expect(component).toBeDefined()
  })

  it('should render nothing if there is no products', () => {
    const component = renderComponent({ products: [] })

    expect(component.container.querySelector('.title')).toBeFalsy()
  })

  it('should match the snapshot', () => {
    const component = renderComponent({ products: productMock })
    expect(component.asFragment()).toMatchSnapshot()
  })

  it('should show in Site Editor', () => {
    const { schema } = Shelf
    expect(schema).toBeDefined()
    expect(typeof schema.title).toBe('string')
  })
})

describe('Util functions', () => {
  it('should return the correct value for pagination dots visibility', () => {
    const MOBILE_ONLY = 'mobileOnly'
    const DESKTOP_ONLY = 'desktopOnly'
    const VISIBLE = 'visible'
    const HIDDEN = 'hidden'

    /** resolvePaginationDotsVisibility(visibility: string, isMobile: boolean) */
    expect(resolvePaginationDotsVisibility(MOBILE_ONLY, false)).toBeFalsy()
    expect(resolvePaginationDotsVisibility(MOBILE_ONLY, true)).toBeTruthy()

    expect(resolvePaginationDotsVisibility(DESKTOP_ONLY, false)).toBeTruthy()
    expect(resolvePaginationDotsVisibility(DESKTOP_ONLY, true)).toBeFalsy()

    expect(resolvePaginationDotsVisibility(VISIBLE, false)).toBeTruthy()
    expect(resolvePaginationDotsVisibility(VISIBLE, true)).toBeTruthy()

    expect(resolvePaginationDotsVisibility(HIDDEN, false)).toBeFalsy()
    expect(resolvePaginationDotsVisibility(HIDDEN, true)).toBeFalsy()
  })
})
