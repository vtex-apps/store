import React from 'react'
import { render } from '@vtex/test-tools/react'
import fs from 'fs'

import ProductSummary from '../legacy/index'

describe('<ProductSummary /> component', () => {
  // TODO: Remove this later when we have a better way to resolve contentSchemas.json at test-tools
  const rawData = fs.readFileSync('../store/contentSchemas.json')
  const contentSchema = JSON.parse(rawData)
  const buyButtonText =
    contentSchema.definitions.ProductSummary.properties.buyButtonText.default

  const props = {
    runtime: { hints: {} },
    buyButtonText,
    product: {
      productId: '123456789',
      linkText: 'linkText',
      productName: 'productName',
      sku: {
        name: 'name',
        itemId: 'itemId',
        image: {
          imageUrl: '',
        },
        seller: {
          sellerId: 'sellerId',
          commertialOffer: {
            Installments: [
              {
                Value: 1,
                InterestRate: 1,
                NumberOfInstallments: 1,
              },
            ],
            Price: 1,
            ListPrice: 1,
          },
        },
      },
      productClusters: [
        {
          name: 'name',
        },
      ],
      quantity: 1,
    },
  }

  function renderComponent(customProps) {
    return render(<ProductSummary {...props} {...customProps} />)
  }

  it('should match the snapshot for normal mode', () => {
    const { asFragment } = renderComponent({ displayMode: 'normal' })
    expect(asFragment()).toMatchSnapshot()
  })

  it('should match the snapshot for small mode', () => {
    const { asFragment } = renderComponent({ displayMode: 'small' })
    expect(asFragment()).toMatchSnapshot()
  })

  it('should match the snapshot for inline normal mode', () => {
    const { asFragment } = renderComponent({ displayMode: 'inline' })
    expect(asFragment()).toMatchSnapshot()
  })

  it('should match the snapshot for inline price mode', () => {
    const { asFragment } = renderComponent({ displayMode: 'inlinePrice' })
    expect(asFragment()).toMatchSnapshot()
  })

  it('should render buy button in inline, small and normal mode', () => {
    const { getByText, rerender, container } = renderComponent({
      displayMode: 'normal',
    })
    expect(getByText('Buy')).toBeTruthy()

    rerender(<ProductSummary {...props} displayMode="small" />)
    expect(getByText('Buy')).toBeTruthy()

    rerender(<ProductSummary {...props} displayMode="inline" />)
    expect(getByText('Buy')).toBeTruthy()

    rerender(<ProductSummary {...props} displayMode="inlinePrice" />)
    expect(container.querySelector('.buyButtonContainer')).toBeFalsy()
  })

  it('should render quantity stepper only in inline price mode', () => {
    const { container, rerender } = renderComponent({ displayMode: 'normal' })
    expect(container.querySelector('.quantityStepperContainer')).toBeFalsy()

    rerender(<ProductSummary {...props} displayMode="inlinePrice" />)
    expect(container.querySelector('.quantityStepperContainer')).toBeTruthy()

    rerender(<ProductSummary {...props} displayMode="small" />)
    expect(container.querySelector('.quantityStepperContainer')).toBeFalsy()

    rerender(<ProductSummary {...props} displayMode="inline" />)
    expect(container.querySelector('.quantityStepperContainer')).toBeFalsy()
  })

  it(`should not break Shelf getSchema`, () => {
    expect(ProductSummary.getSchema).toEqual(expect.any(Function))
  })

  describe('Site editor editable', () => {
    it('should export getSchema and return object with title', () => {
      const schema = ProductSummary.schema || ProductSummary.getSchema({})
      expect(schema).toEqual(
        expect.objectContaining({ title: expect.any(String) })
      )
    })
  })
})
