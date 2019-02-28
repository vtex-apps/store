import reduce from 'lodash/reduce'
import map from 'lodash/map'
import filter from 'lodash/filter'
import flow from 'lodash/flow'
import toPairs from 'lodash/toPairs'
import find from 'lodash/find'

export default function transformPaymentData(paymentData) {
  const flattenedPayments = reduce(
    paymentData.transactions,
    (memo, transaction) => memo.concat(transaction.payments),
    []
  )

  const payments = map(
    flattenedPayments,
    transformPayment(paymentData.giftCards)
  )

  return payments
}

export const transformConnectorResponsesToArray = flow([
  toPairs,
  hasValueAndIsNotPrivate,
  toKeyValue,
])

function transformPayment(giftCards) {
  return payment => {
    if (payment.connectorResponses) {
      payment.connectorResponsesArray = transformConnectorResponsesToArray(
        payment.connectorResponses
      )
    }

    if (payment.giftCardId) {
      const giftCard = find(
        giftCards,
        giftCard => giftCard.id === payment.giftCardId
      )

      if (giftCard) {
        return {
          ...payment,
          giftCardData: giftCard,
        }
      }
    }

    return payment
  }
}

function hasValueAndIsNotPrivate(connectorResponses) {
  return filter(connectorResponses, c => c[0] && c[1] && c[0].charAt(0) !== '_')
}

function toKeyValue(connectorResponses) {
  return map(connectorResponses, c => ({ key: c[0], value: c[1] }))
}
