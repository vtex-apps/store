import React from 'react'
import PropTypes from 'prop-types'
import { render } from '@vtex/test-tools/react'

import ProductPrice from './../../ProductPrice'

describe('<ProductPrice />', () => {
  const defaultProps = {
    loaderClass: '',
    showListPrice: false,
    sellingPrice: 40,
  }

  const renderComponent = customProps => {
    const props = {
      ...defaultProps,
      ...customProps,
    }
    return render(<ProductPrice {...props} />)
  }

  it('should be mount', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toBeDefined()
  })

  it('should match snapshot', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot Loader', () => {
    const { asFragment } = renderComponent({ showListPrice: true })
    expect(asFragment()).toMatchSnapshot()
  })

  it('should show selling price and list price (with labels)', () => {
    const customProps = {
      listPrice: 50,
      showLabels: true,
      showListPrice: true,
      labelSellingPrice: 'To',
      labelListPrice: 'From'
    }
    const { getByText } = renderComponent(customProps)
    expect(getByText('From')).toBeDefined()
    expect(getByText('To')).toBeDefined()
    expect(getByText('$40.00')).toBeDefined()
    expect(getByText('$50.00')).toBeDefined()
  })

  it('should show selling price and list price but with NO labels', () => {
    const customProps = {
      listPrice: 50,
      showLabels: false,
      showListPrice: true,
      labelSellingPrice: 'To',
      labelListPrice: 'From'
    }
    const { getByText, queryByText } = renderComponent(customProps)
    expect(queryByText('From')).toBeNull()
    expect(queryByText('To')).toBeNull()
    expect(getByText('$40.00')).toBeDefined()
    expect(getByText('$50.00')).toBeDefined()
  })

  it('should show selling price and list price but with NO labels', () => {
    const customProps = {
      listPrice: 50,
      showLabels: false,
      showListPrice: true,
    }
    const { getByText, queryByText } = renderComponent(customProps)
    expect(queryByText('From')).toBeNull()
    expect(queryByText('To')).toBeNull()
    expect(getByText('$40.00')).toBeDefined()
    expect(getByText('$50.00')).toBeDefined()
  })

  it('should show selling price and list price but with custom labels', () => {
    const customProps = {
      listPrice: 50,
      showLabels: true,
      showListPrice: true,
      labelSellingPrice: 'Now',
      labelListPrice: 'Was',
    }
    const { getByText } = renderComponent(customProps)
    expect(getByText('Was')).toBeDefined()
    expect(getByText('Now')).toBeDefined()
    expect(getByText('$40.00')).toBeDefined()
    expect(getByText('$50.00')).toBeDefined()
  })

  it('should show range selling price (not list price)', () => {
    const customProps = {
      listPrice: 50,
      showLabels: true,
      showListPrice: false,
      labelSellingPrice: 'Now',
      labelListPrice: 'Was',
      sellingPriceList: [30, 50, 20, 55],
      showSellingPriceRange: true
    }
    const { getByText , queryByText } = renderComponent(customProps)
    // dont show labels
    expect(queryByText('Now')).toBeNull()
    expect(queryByText('Was')).toBeNull()
    // dont show selling price
    expect(queryByText('$40.00')).toBeNull()

    expect(getByText('$20.00 - $55.00')).toBeDefined()
  })

  it('show list price range and selling price range (no labels)', () => {
    const customProps = {
      listPrice: 50,
      showLabels: false,
      showListPrice: true,
      showListPriceRange: true,
      labelSellingPrice: 'Now',
      labelListPrice: 'Was',
      sellingPriceList: [30, 50, 20, 55],
      listPriceList: [100, 200, 300, 400],
      showSellingPriceRange: true
    }
    const { getByText , queryByText } = renderComponent(customProps)
    // dont show labels
    expect(queryByText('Now')).toBeNull()
    expect(queryByText('Was')).toBeNull()
    // dont show selling price
    expect(queryByText('$40.00')).toBeNull()
    expect(queryByText('$50.00')).toBeNull()
    
    expect(getByText('$20.00 - $55.00')).toBeDefined()
    expect(getByText('$100.00 - $400.00')).toBeDefined()
  })

  it('show list price range and selling price range (with labels)', () => {
    const customProps = {
      listPrice: 50,
      showLabels: true,
      showListPrice: true,
      showListPriceRange: true,
      labelSellingPrice: 'Now',
      labelListPrice: 'Was',
      sellingPriceList: [30, 50, 20, 55],
      listPriceList: [100, 200, 300, 400],
      showSellingPriceRange: true
    }
    const { getByText , queryByText } = renderComponent(customProps)
    // show labels
    expect(getByText('Now')).toBeDefined()
    expect(getByText('Was')).toBeDefined()
    // dont show selling price
    expect(queryByText('$40.00')).toBeNull()
    expect(queryByText('$50.00')).toBeNull()
    
    expect(getByText('$20.00 - $55.00')).toBeDefined()
    expect(getByText('$100.00 - $400.00')).toBeDefined()
  })
})
