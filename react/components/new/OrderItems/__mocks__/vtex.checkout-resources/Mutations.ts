import gql from 'graphql-tag'

export const updateItems = gql`
  mutation MockMutation($orderItems: [ItemInput]) {
    updateItems(orderItems: $orderItems) {
      items
    }
  }
`
