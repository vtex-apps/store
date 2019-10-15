/* eslint-env jest */
import React, { useContext } from 'react'
import { render } from '@vtex/test-tools/react'
import { getProduct } from '../__mocks__/productMock'
import ProductWrapper from '../ProductWrapper'
import { ProductContext } from '../__mocks__/vtex.product-context'

const ProductPageMock = () => {
  const { selectedItem, product, selectedQuantity } = useContext(ProductContext)
  return (
    <div>
      <div>Product Page</div>
      <div>Selected Item id: {selectedItem && selectedItem.itemId}</div>
      <div>Selected Item name: {selectedItem && selectedItem.name}</div>
      <div>product slug: {product && product.linkText}</div>
      <div>Selected Quantity: {selectedQuantity}</div>
    </div>
  )
}

const descriptionId = 'description'

describe('ProductWrapper component', () => {
  const getProps = customProps => {
    const product = getProduct()
    const productQuery = {
      product,
      loading: false,
    }
    const props = {
      params: { slug: product.linkText },
      productQuery,
      query: {},
      ...customProps,
    }
    return props
  }
  const renderComponent = customProps => {
    const component = render(
      <ProductWrapper {...getProps(customProps)}>
        <ProductPageMock />
      </ProductWrapper>
    )
    const { getByText } = component
    return {
      ...component,
      getTitleTag: product => getByText(new RegExp(product.titleTag)),
    }
  }

  it('should render with correct title and no meta', () => {
    const product = getProduct()
    const { queryByTestId, getTitleTag } = renderComponent()
    getTitleTag(product)
    // Doesnt have metatag description, <meta> should not be rendered
    expect(queryByTestId(descriptionId)).toBeNull()
  })

  it('should render with correct title and meta', () => {
    const product = getProduct({ metaTagDescription: 'MetaDescription' })
    const { getTitleTag, getByTestId } = renderComponent({
      product,
      params: { slug: product.linkText },
      productQuery: { product, loading: false },
    })
    getByTestId(descriptionId)
    getTitleTag(product)
  })

  it('product wont break if category tree is an empty array', () => {
    const product = getProduct({ categoryTree: [] })
    const { getTitleTag } = renderComponent({
      product,
      params: { slug: product.linkText },
      productQuery: { product, loading: false },
    })
    getTitleTag(product)
  })
})
