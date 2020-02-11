import React from 'react'
import { render, fireEvent, wait } from '@vtex/test-tools/react'
import { MockedProvider } from '@apollo/react-testing'

import BuyButton from '../../BuyButton'
import addToCartMutation from '../../components/BuyButton/mutations/addToCart.gql'

const mocks = [
  {
    request: {
      query: addToCartMutation,
      variables: { items: [] },
    },
    result: {
      data: {
        addToCart: {}
      }
    }
  }
]

describe('<BuyButton />', () => {
  const renderComponent = (customProps, text = 'Test') => {
    const props = {
      available: true,
      ...customProps,
    }

    return render(<BuyButton {...props}>{text}</BuyButton>, { graphql: { mocks }, MockedProvider })
  }

  it('should be rendered', async () => {
    const { asFragment } = renderComponent()
    await wait()
    expect(asFragment()).toBeDefined()
    expect(asFragment()).toBeTruthy()
  })

  it('should match snapshot normal', async () => {
    const { asFragment } = renderComponent({ available: true, skuItems: [] })
    await wait()
    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot unavailable', async () => {
    const { asFragment } = renderComponent({ available: false, skuItems: [] })
    await wait()
    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot loading', async () => {
    const { asFragment } = renderComponent({ available: false })
    await wait()
    expect(asFragment()).toMatchSnapshot()
  })

  it('should call onAddStart and onAddFinish', async () => {
    const onAddStart = jest.fn()
    const onAddFinish = jest.fn()

    const buttonText = 'Add to cart'

    const { getByText } = renderComponent(
      {
        available: true,
        skuItems: [],
        onAddStart,
        onAddFinish,
      },
      buttonText
    )
    
    await wait(() => {
      fireEvent.click(getByText(buttonText))
    })

    const assertions = () => {
      expect(onAddStart).toBeCalledTimes(1)
      expect(onAddFinish).toBeCalledTimes(1)
    }
    expect.assertions(assertions)
  })

  it('should show items prices', async () => {
    const skuItems = [
      {
        skuId: '1',
        quantity: 2,
        seller: '1',
        name: 'Item',
        brand: 'fo',
        price: 100,
        options: [
          { assemblyId: '1', id: '2', quantity: 2, seller: '1' },
          { assemblyId: '1', id: '3', quantity: 1, seller: '1' },
        ],
        assemblyOptions: {
          added: [
            {
              normalizedQuantity: 2,
              extraQuantity: 2,
              choiceType: 'MULTIPLE',
              item: {
                name: 'Assembly One',
                sellingPrice: 5,
                quantity: 2,
                id: '1',
                sellingPriceWithAssemblies: 6,
                assemblyOptions: {
                  added: [
                    {
                      item: {
                        sellingPrice: 1,
                        id: '3',
                        quantity: 1,
                        name: 'Recursive',
                        sellingPriceWithAssemblies: 1,
                      },
                    },
                  ],
                },
              },
            },
            {
              normalizedQuantity: 1,
              extraQuantity: 1,
              choiceType: 'MULTIPLE',
              item: {
                name: 'Assembly Two',
                sellingPrice: 3,
                quantity: 1,
                id: '2',
                sellingPriceWithAssemblies: 3,
              },
            },
          ],
          removed: [],
          parentPrice: 100,
        },
        sellingPriceWithAssemblies: 115,
      },
    ]
    const { getByText } = renderComponent(
      {
        available: true,
        skuItems,
        showItemsPrice: true,
      },
      null
    )
    const priceRegex = /230.00/
    await wait()
    getByText(priceRegex)
  })
})
