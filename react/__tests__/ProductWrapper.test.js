/* eslint-env jest */
import React, { useContext } from 'react'
import { render } from '@vtex/test-tools/react'
import { getProduct, getItem } from '../__mocks__/productMock'
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
      getSelectedItemId: item => getByText(`Selected Item id: ${item.itemId}`),
      getSelectedItemName: item =>
        getByText(`Selected Item name: ${item.name}`),
      getProductSlug: product => getByText(`product slug: ${product.linkText}`),
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

  it('should switch items and reset state', () => {
    const product = getProduct()
    const {
      rerender,
      getTitleTag,
      getSelectedItemId,
      getSelectedItemName,
      getProductSlug,
    } = renderComponent()

    const newItem = getItem('2')
    const newProduct = getProduct({
      items: [newItem],
      productId: '2',
      linkText: 'product-slug-2',
      titleTag: 'Product 2',
      productName: 'Product 2',
    })

    getTitleTag(product)
    getSelectedItemId(product.items[0])
    getSelectedItemName(product.items[0])
    getProductSlug(product)
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

    getTitleTag(newProduct)
    getSelectedItemId(newProduct.items[0])
    getSelectedItemName(newProduct.items[0])
    getProductSlug(newProduct)
  })

  it('should select first item with available quantity', async () => {
    const noQuantity = getItem('no quantity', 90, 0)
    const itemWithQuantity = getItem('Item with quantity', 90, 10)
    const otherItemWithQuantity = getItem('other item with quantity', 90, 10)
    const newProduct = getProduct({
      items: [noQuantity, noQuantity, itemWithQuantity, otherItemWithQuantity],
    })
    const { getSelectedItemId, getSelectedItemName } = renderComponent({
      product: newProduct,
      params: { slug: newProduct.linkText },
      productQuery: { product: newProduct, loading: false },
    })

    getSelectedItemId(itemWithQuantity)
    getSelectedItemName(itemWithQuantity)
  })

  it('should switch items when changing query prop', async () => {
    const itemone = getItem('1', 90, 1)
    const itemtwo = getItem('2', 90, 10)
    const itemthree = getItem('3', 90, 10)
    const newProduct = getProduct({
      items: [itemone, itemtwo, itemthree],
    })
    const props = {
      product: newProduct,
      params: { slug: newProduct.linkText },
      productQuery: { product: newProduct, loading: false },
    }
    const {
      getSelectedItemId,
      getSelectedItemName,
      rerender,
    } = renderComponent(props)

    getSelectedItemId(itemone)
    getSelectedItemName(itemone)

    const newProps = {
      ...props,
      query: { skuId: itemtwo.itemId },
    }
    rerender(
      <ProductWrapper {...getProps(newProps)}>
        <ProductPageMock />
      </ProductWrapper>
    )
    getSelectedItemId(itemtwo)
    getSelectedItemName(itemtwo)
  })
})
