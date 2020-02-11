import React, { FunctionComponent } from 'react'
import { fireEvent, render, wait } from '@vtex/test-tools/react'
import { MockedProvider } from '@apollo/react-testing'
import { Item } from 'vtex.checkout-graphql'

import { mockOrderForm } from '../__mocks__/mockOrderForm'
import { Queries } from '../__mocks__/vtex.checkout-resources'
import { OrderFormProvider, useOrderForm } from '../OrderForm'

const { orderForm: OrderForm } = Queries

const mockQuery = {
  request: {
    query: OrderForm,
  },
  result: {
    data: {
      orderForm: mockOrderForm,
    },
  },
}

describe('OrderForm', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  it('should throw when useOrderForm is called outside a OrderFormProvider', () => {
    const oldConsoleError = console.error
    console.error = () => {}

    const Component: FunctionComponent = () => {
      useOrderForm()
      return <div>foo</div>
    }

    expect(() =>
      render(<Component />, {
        graphql: { mocks: [mockQuery] },
        MockedProvider,
      })
    ).toThrow('useOrderForm must be used within a OrderFormProvider')

    console.error = oldConsoleError
  })

  it('should set loading=true when fetching the order form', async () => {
    const Component: FunctionComponent = () => {
      const { loading } = useOrderForm()
      return <div>{loading ? 'Loading' : 'Not loading'}</div>
    }

    const { getByText } = render(
      <OrderFormProvider>
        <Component />
      </OrderFormProvider>,
      { graphql: { mocks: [mockQuery] }, MockedProvider }
    )

    expect(getByText('Loading')).toBeTruthy()
    await wait(() => jest.runAllTimers())
  })

  it('should correctly load the order form', async () => {
    const Component: FunctionComponent = () => {
      const { loading, orderForm } = useOrderForm()
      if (loading) {
        return <div>Loading</div>
      }
      return (
        <div>
          {orderForm &&
            orderForm.items.map((item: Item) => (
              <div key={item.id}>{item.name}</div>
            ))}
        </div>
      )
    }

    const { getByText } = render(
      <OrderFormProvider>
        <Component />
      </OrderFormProvider>,
      { graphql: { mocks: [mockQuery] }, MockedProvider }
    )

    await wait(() => jest.runAllTimers())
    expect(getByText(mockOrderForm.items[0].name)).toBeTruthy()
    expect(getByText(mockOrderForm.items[1].name)).toBeTruthy()
    expect(getByText(mockOrderForm.items[2].name)).toBeTruthy()
  })

  it('should correctly update the order form', async () => {
    const Component: FunctionComponent = () => {
      const { loading, orderForm, setOrderForm } = useOrderForm()
      if (loading || !orderForm) {
        return <div>Loading</div>
      }
      const handleClick = () => {
        const newItem = orderForm && {
          ...orderForm.items[1],
          name: 'Mirai zura!',
        }
        setOrderForm({ items: [newItem] })
      }
      return (
        <div>
          <div>
            {orderForm &&
              orderForm.items.map((item: Item) => (
                <div key={item.id}>{item.name}</div>
              ))}
          </div>
          <button onClick={handleClick}>update</button>
        </div>
      )
    }

    const { getByText } = render(
      <OrderFormProvider>
        <Component />
      </OrderFormProvider>,
      { graphql: { mocks: [mockQuery] }, MockedProvider }
    )

    await wait(() => {
      jest.runAllTimers()
      const button = getByText('update')
      fireEvent.click(button)
    })
    expect(getByText('Mirai zura!')).toBeTruthy()
  })
})
