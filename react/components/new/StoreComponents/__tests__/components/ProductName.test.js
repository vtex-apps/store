import React from 'react'
import ProductName from './../../ProductName'
import { render } from '@vtex/test-tools/react'
import PropTypes from 'prop-types'

describe('<ProductName />', () => {
  const defaultProps = {
    loaderClass: '',
    name: 'ProductTest',
  }

  const context = { culture: { currency: 'USD' } }

  const renderComponent = customProps => {
    const props = {
      ...defaultProps,
      ...customProps,
    }
    return render(<ProductName {...props} />, {
      context,
      childContextTypes: {
        culture: PropTypes.object,
      },
    })
  }

  it('should be mounted', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toBeDefined()
  })

  it('should match the snapshot with only Name', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toMatchSnapshot()
  })

  it('should match the snapshot with Name and SkuName', () => {
    const { asFragment } = renderComponent({
      skuName: 'ProductSkuName',
      showSku: true,
    })

    expect(asFragment()).toMatchSnapshot()
  })

  it('should match the snapshot with Name and Brand', () => {
    const { asFragment } = renderComponent({
      brandName: 'ProductBrandName',
      showBrandName: true,
    })
    expect(asFragment()).toMatchSnapshot()
  })

  it('should match the snapshot with Name and Product Reference', () => {
    const { asFragment } = renderComponent({
      productReference: 'productReferenceTest',
      showProductReference: true,
    })
    expect(asFragment()).toMatchSnapshot()
  })

  it('should match the snapshot with all options', () => {
    const { asFragment } = renderComponent({
      skuName: 'ProductSkuName',
      showSku: true,
      brandName: 'ProductBrandName',
      showBrandName: true,
      productReference: 'productReferenceTest',
      showProductReference: true,
    })
    expect(asFragment()).toMatchSnapshot()
  })

  it('should match the snapshot Loader', () => {
    const { asFragment } = renderComponent({ name: undefined })
    expect(asFragment()).toMatchSnapshot()
  })
})
