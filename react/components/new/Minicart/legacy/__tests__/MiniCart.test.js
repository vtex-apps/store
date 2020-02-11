import React from 'react'
import { render, fireEvent, wait } from '@vtex/test-tools/react'
import { orderForm as orderFormQuery } from 'vtex.store-resources/Queries'

import orderForm from '../__mocks__/orderForm'
import emptyOrderForm from '../__mocks__/emptyOrderForm'
import MiniCart from '../../index'

const mocks = [
  {
    request: {
      query: orderFormQuery,
    },
    result: {
      data: {
        orderForm,
      },
    },
  },
]

const emptyMock = [
  {
    request: {
      query: orderFormQuery,
    },
    result: {
      data: {
        orderForm: emptyOrderForm,
      },
    },
  },
]

describe('<MiniCart />', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  it('should render popup onClick', async () => {
    const { getByText, baseElement } = render(
      <MiniCart type="popup" hideContent={false} />
    )

    await wait(() => {
      jest.runAllTimers()
    })

    let box = baseElement.querySelector('.box')
    let sidebar = baseElement.querySelector('.sidebar')

    // Expect box be null before click
    expect(box).toBeNull()
    // Sidebar should not exist before and after click
    expect(sidebar).toBeNull()

    await wait(() => {
      fireEvent.click(getByText(/button test/i))
    })

    await wait(() => {
      jest.runAllTimers()
    })

    box = baseElement.querySelector('.box')
    sidebar = baseElement.querySelector('.sidebar')

    // Expect Minicart Popup redered
    expect(box).toBeDefined()
    expect(box).not.toBeNull()
    // Expect sidebar still not rendered
    expect(sidebar).toBeNull()
  })

  it('should display sidebar onClick', async () => {
    const { getByText, baseElement } = render(
      <MiniCart type="sidebar" hideContent={false} />
    )

    await wait(() => {
      jest.runAllTimers()
    })

    let box = baseElement.querySelector('.box')
    let sidebar = baseElement.querySelector('.sidebarScrim.dn')

    // Expect box be null before and after click
    expect(box).toBeNull()
    // Sidebar should have diplay none class before click
    expect(sidebar).toBeDefined()
    expect(sidebar).not.toBeNull()

    await wait(() => {
      fireEvent.click(getByText(/button test/i))
    })

    await wait(() => {
      jest.runAllTimers()
    })

    box = baseElement.querySelector('.box')
    sidebar = baseElement.querySelector('.sidebarScrim.dn')

    // Expect sidebar dont have display none after click
    expect(sidebar).toBeNull()
    expect(box).toBeNull()
  })

  it('should match the snapshot in popup mode', async () => {
    const leftClick = { button: 0 }

    const { getByText, asFragment } = render(
      <MiniCart type="popup" hideContent={false} />,
      { graphql: { mocks } }
    )

    await wait(() => {
      jest.runAllTimers()
    })

    await wait(() => {
      fireEvent.click(getByText(/button test/i), leftClick)
    })

    await wait(() => {
      jest.runAllTimers()
    })

    expect(asFragment()).toMatchSnapshot()
  })

  it('should match the snapshot in sidebar mode', async () => {
    const { baseElement } = render(
      <MiniCart type="sidebar" hideContent={false} />,
      { graphql: { mocks } }
    )

    await wait(async () => {
      jest.runAllTimers()
    })
    
    expect(baseElement).toMatchSnapshot()
  })

  it('should be editable in Site Editor', () => {
    const schema = MiniCart.schema || MiniCart.getSchema({})
    expect(schema).toEqual(
      expect.objectContaining({ title: expect.any(String) })
    )
  })

  it('should not show item quantity if there are no items in cart', async () => {
    const { queryByTestId } = render(
      <MiniCart type="sidebar" hideContent={false} showTotalItemsQty={false} />,
      { graphql: { mocks: emptyMock } }
    )

    await wait(() => {
      jest.runAllTimers()
    })

    expect(queryByTestId('item-qty')).toBeNull()
  })

  it('should show the quantity of different items in cart', async () => {
    const { getByTestId } = render(
      <MiniCart type="sidebar" hideContent={false} showTotalItemsQty={false} />,
      { graphql: { mocks } }
    )

    await wait(() => {
      jest.runAllTimers()
    })

    expect(getByTestId('item-qty').textContent).toBe('1')
  })

  it('should show the total quantity of items in cart', async () => {
    const { getByTestId } = render(
      <MiniCart type="sidebar" hideContent={false} showTotalItemsQty />,
      { graphql: { mocks } }
    )

    await wait(() => {
      jest.runAllTimers()
    })

    expect(getByTestId('item-qty').textContent).toBe('2')
  })

  it('should not show price if showPrice is false', async () => {
    const { queryByTestId } = render(
      <MiniCart type="sidebar" hideContent={false} showPrice={false} />,
      { graphql: { mocks } }
    )
    await wait(() => {
      jest.runAllTimers()
    })
    expect(queryByTestId('total-price')).toBeNull()
  })

  it('should not show price if there are no items in the cart', async () => {
    const { queryByTestId } = render(
      <MiniCart type="sidebar" hideContent={false} showPrice />,
      { graphql: { mocks: emptyMock } }
    )
    await wait(() => {
      jest.runAllTimers()
    })

    expect(queryByTestId('total-price')).toBeNull()
  })

  it('should show price if there are items in the cart', async () => {
    const { getByTestId } = render(
      <MiniCart type="sidebar" hideContent={false} showPrice />,
      { graphql: { mocks } }
    )
    await wait(() => {
      jest.runAllTimers()
    })
    expect(getByTestId('total-price')).toBeInTheDocument()
  })

  it('should not show price if showPrice is false', async () => {
    const { queryByTestId } = render(
      <MiniCart type="sidebar" hideContent={false} showPrice={false} />,
      { graphql: { mocks } }
    )
    await wait(() => {
      jest.runAllTimers()
    })
    expect(queryByTestId('total-price')).toBeNull()
  })

  it('should show price if there are items in the cart', async () => {
    const { getByTestId } = render(
      <MiniCart type="sidebar" hideContent={false} showPrice />,
      { graphql: { mocks } }
    )

    await wait(() => {
      jest.runAllTimers()
    })
    
    expect(getByTestId('total-price')).toBeInTheDocument()
  })
})
