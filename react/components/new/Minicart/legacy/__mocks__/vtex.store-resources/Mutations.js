import gql from 'graphql-tag'

export const addToCart = gql`
  mutation addToCart($items: [Item]) {
    addToCart(items: $items)
  }
`
export const updateItems = gql`
  mutation updateItems($items: [Item]) {
    updateItems(items: $items)
  }
`
