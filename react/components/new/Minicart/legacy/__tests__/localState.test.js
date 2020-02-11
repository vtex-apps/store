import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import gql from 'graphql-tag'

import createLocalState from '../localState/index'
import addToCartMutation from '../localState/graphql/addToCartMutation.gql'
import updateItemsMutation from '../localState/graphql/updateItemsMutation.gql'
import { ITEMS_STATUS } from '../localState'

describe('Local State', () => {
  let cache, client

  beforeEach(() => {
    cache = new InMemoryCache()
    client = new ApolloClient({
      link: ApolloLink.empty(),
      cache,
    })

    const { resolvers, initialState } = createLocalState(client)

    client.addResolvers(resolvers)
    cache.writeData({ data: initialState })
  })

  it('should append new items to end of cart', async () => {
    const items = [
      {
        id: '100',
        name: 'Chiclete',
        imageUrl: 'imageUrl',
        detailUrl: '/chiclete/p',
        skuName: 'chiclete',
        quantity: 1,
        sellingPrice: 0,
        listPrice: 0,
        parentItemIndex: null,
        parentAssemblyBinding: null,
        assemblyOptions: {
          added: [],
          removed: [],
          parentPrice: 0,
        },
      },
      {
        id: '101',
        name: 'Chiclete de menta',
        imageUrl: 'imageUrl',
        detailUrl: '/chiclete-de-menta/p',
        skuName: 'chiclete de menta',
        quantity: 1,
        sellingPrice: 0,
        listPrice: 0,
        parentItemIndex: null,
        parentAssemblyBinding: null,
        assemblyOptions: {
          added: [],
          removed: [],
          parentPrice: 0,
        },
      },
    ]

    await client.mutate({ mutation: addToCartMutation, variables: { items } })

    const queryResult = client.readQuery({
      query: gql`
        query {
          minicart @client {
            items
          }
        }
      `,
    })

    const cacheItems = JSON.parse(queryResult.minicart.items)

    // assert that the cache items contains all items of the mutation
    expect(cacheItems).toEqual(
      expect.arrayContaining(items.map(expect.objectContaining))
    )

    cacheItems.forEach(item => {
      expect(item).toHaveProperty('localStatus', ITEMS_STATUS.MODIFIED)
    })
  })

  it('should update quantity of item in cart', async () => {
    const item = {
      id: '100',
      name: 'Chiclete',
      imageUrl: 'imageUrl',
      detailUrl: '/chiclete/p',
      skuName: 'chiclete',
      quantity: 1,
      sellingPrice: 0,
      listPrice: 0,
      parentItemIndex: null,
      parentAssemblyBinding: null,
      assemblyOptions: {
        added: [],
        removed: [],
        parentPrice: 0,
      },
    }

    cache.writeData({
      data: {
        minicart: {
          __typename: 'Minicart',
          items: JSON.stringify([item]),
        },
      },
    })

    const updateItemsPayload = [{ index: 0, quantity: 2, id: item.id }]

    await client.mutate({
      mutation: updateItemsMutation,
      variables: { items: updateItemsPayload },
    })

    const queryResult = client.readQuery({
      query: gql`
        query {
          minicart @client {
            items
          }
        }
      `,
    })

    const cacheItems = JSON.parse(queryResult.minicart.items)

    expect(cacheItems).toEqual(
      expect.arrayContaining(
        updateItemsPayload.map(item =>
          expect.objectContaining({
            id: item.id,
            localStatus: ITEMS_STATUS.MODIFIED,
          })
        )
      )
    )

    expect(cacheItems).toEqual(
      expect.arrayContaining(
        updateItemsPayload.map(item =>
          expect.objectContaining({ id: item.id, quantity: item.quantity })
        )
      )
    )
  })

  it('should update quantity of more than one item in cart', async () => {
    const items = [
      {
        id: '100',
        name: 'Chiclete',
        imageUrl: 'imageUrl',
        detailUrl: '/chiclete/p',
        skuName: 'chiclete',
        quantity: 1,
        sellingPrice: 0,
        listPrice: 0,
        parentItemIndex: null,
        parentAssemblyBinding: null,
        assemblyOptions: {
          added: [],
          removed: [],
          parentPrice: 0,
        },
      },
      {
        id: '101',
        name: 'Chiclete de menta',
        imageUrl: 'imageUrl',
        detailUrl: '/chiclete-de-menta/p',
        skuName: 'chiclete de menta',
        quantity: 1,
        sellingPrice: 0,
        listPrice: 0,
        parentItemIndex: null,
        parentAssemblyBinding: null,
        assemblyOptions: {
          added: [],
          removed: [],
          parentPrice: 0,
        },
      },
    ]

    cache.writeData({
      data: {
        minicart: {
          __typename: 'Minicart',
          items: JSON.stringify(items),
        },
      },
    })

    const updateItemsPayload = [
      { index: 0, quantity: 2, id: items[0].id },
      { index: 1, quantity: 9, id: items[1].id },
    ]

    await client.mutate({
      mutation: updateItemsMutation,
      variables: { items: updateItemsPayload },
    })

    const queryResult = client.readQuery({
      query: gql`
        query {
          minicart @client {
            items
          }
        }
      `,
    })

    const cacheItems = JSON.parse(queryResult.minicart.items)

    expect(cacheItems).toEqual(
      expect.arrayContaining(
        updateItemsPayload.map(item =>
          expect.objectContaining({
            id: item.id,
            localStatus: ITEMS_STATUS.MODIFIED,
          })
        )
      )
    )

    expect(cacheItems).toEqual(
      expect.arrayContaining(
        updateItemsPayload.map(item =>
          expect.objectContaining({ id: item.id, quantity: item.quantity })
        )
      )
    )
  })
})
