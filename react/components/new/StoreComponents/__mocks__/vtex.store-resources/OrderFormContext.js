import React from 'react'

const mockOrderForm = {
  orderForm: {
    orderFormId: '123',
  },
  items: [],
  addItem: ({ items = [] }) => new Promise(resolve => resolve({ data: { addItem: { ...mockOrderForm, items }}})),
  refetch: () => new Promise(resolve => resolve({ data: { orderForm: mockOrderForm }})),
  loading: false,
}

export function orderFormConsumer(Comp) {
  return class extends React.Component {
    render() {
      return <Comp {...this.props} orderFormContext={mockOrderForm} />
    }
  }
}

export function useOrderForm() {
  return mockOrderForm
}
