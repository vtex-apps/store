import React from 'react'
import { render } from '@vtex/test-tools/react'
import FormattedCurrency from '../FormattedCurrency'
import { useRuntime, RuntimeContext } from 'vtex.render-runtime'

const mockedUseRuntime = useRuntime as jest.Mock<RuntimeContext>

test('Use currencyCode as default format', () => {
  mockedUseRuntime.mockImplementation(() => ({
    culture: {
      currency: 'USD',
      customCurrencyDecimalDigits: null,
      customCurrencySymbol: null,
    },
  }))

  const { getByText, rerender } = render(<FormattedCurrency value={10} />)

  getByText('$10.00')

  mockedUseRuntime.mockImplementation(() => ({
    culture: {
      currency: 'BRL',
      customCurrencyDecimalDigits: null,
      customCurrencySymbol: null,
    },
  }))

  rerender(<FormattedCurrency value={10} />)

  getByText('R$10.00')
})

test('should use custom decimal digits', () => {
  mockedUseRuntime.mockImplementation(() => ({
    culture: {
      currency: 'BRL',
      customCurrencyDecimalDigits: 0,
      customCurrencySymbol: null,
    },
  }))

  const { getByText } = render(<FormattedCurrency value={10} />)

  getByText('R$10')
})
