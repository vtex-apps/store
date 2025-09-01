const React = require('react')

module.exports = {
  // OrderForm related mocks
  OrderFormContext: {
    Provider: ({ children, value }) => (
      React.createElement('div', {
        'data-testid': 'order-form-context',
        'data-value': JSON.stringify(value)
      }, children)
    ),
  },
  
  // GraphQL mutations and queries
  MutationAddToCart: {},
  MutationUpdateItems: {},
  MutationUpdateOrderFormProfile: {},
  MutationUpdateOrderFormShipping: {},
  MutationUpdateOrderFormCheckin: {},
  QueryOrderForm: {},
  QueryProductSearchV3: {},
}
