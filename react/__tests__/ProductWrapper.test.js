/* eslint-env jest */
import React, { useContext } from 'react'
import { render, act } from '@vtex/test-tools/react'
import { getProduct, getItem } from '../__mocks__/productMock'
import ProductWrapper from '../ProductWrapper'
import { ProductContext } from '../__mocks__/vtex.product-context'
import { ProductDispatchContext } from '../__mocks__/vtex.product-context/ProductDispatchContext'

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
    return render(
      <ProductWrapper {...getProps(customProps)}>
        <ProductPageMock />
      </ProductWrapper>
    )
  }

  it('should render with correct title and no meta', () => {
    const product = getProduct()
    const { queryByText, queryByTestId } = renderComponent()

    expect(queryByText('<title>')).toBeDefined()
    expect(queryByText(product.titleTag)).toBeDefined()
    // Doesnt have metatag description, <meta> should not be rendered
    expect(queryByTestId('descritpion')).toBeNull()
  })

  it('should render with correct title and meta', () => {
    const product = getProduct({ metaTagDescription: 'MetaDescription' })
    const { getByText, getByTestId } = renderComponent({
      product,
      params: { slug: product.linkText },
      productQuery: { product, loading: false },
    })
    getByTestId('description')
    getByText(new RegExp(product.titleTag))
  })

  it('should switch items and reset state', async () => {
    const product = getProduct()
    const { rerender, getByText } = renderComponent()

    const newItem = getItem('2')
    const newProduct = getProduct({
      items: [newItem],
      productId: '2',
      linkText: 'product-slug-2',
      titleTag: 'Product 2',
      productName: 'Product 2',
    })
    const { dispatch } = useContext(ProductDispatchContext)
    const quantity = 3
    dispatch({ type: 'SET_QUANTITY', args: { quantity } })

    getByText(new RegExp(product.titleTag))
    getByText(`Selected Item id: ${product.items[0].itemId}`)
    getByText(`Selected Item name: ${product.items[0].name}`)
    getByText(`product slug: ${product.linkText}`)
    getByText(`Selected Quantity: ${quantity}`)
    const newProps = {
      product: newProduct,
      params: { slug: newProduct.linkText },
      productQuery: { product: newProduct, loading: false },
    }
    rerender(
      <ProductWrapper {...getProps(newProps)}>
        <ProductPageMock />
      </ProductWrapper>
    )
    act(() => {})
    await Promise.resolve()

    getByText(new RegExp(newProduct.titleTag))
    getByText(`Selected Item id: ${newProduct.items[0].itemId}`)
    getByText(`Selected Item name: ${newProduct.items[0].name}`)
    getByText(`product slug: ${newProduct.linkText}`)
    getByText(`Selected Quantity: 1`)
  })

  it('should select item with available quantity', async () => {
    const noQuantity = getItem('no quantity', 90, 0)
    const itemWithQuantity = getItem('Item with quantity', 90, 10)
    const otherItemWithQuantity = getItem('other item with quantity', 90, 10)
    const newProduct = getProduct({
      items: [noQuantity, noQuantity, itemWithQuantity, otherItemWithQuantity],
    })
    const { getByText, debug } = renderComponent({
      product: newProduct,
      params: { slug: newProduct.linkText },
      productQuery: { product: newProduct, loading: false },
    })

    getByText(`Selected Item id: ${itemWithQuantity.itemId}`)
    getByText(`Selected Item name: ${itemWithQuantity.name}`)
  })
})
