const React = require('react')

module.exports = {
  Provider: ({ children, value }) => (
    React.createElement('div', {
      'data-testid': 'order-form-context',
      'data-value': JSON.stringify(value)
    }, children)
  ),
}
