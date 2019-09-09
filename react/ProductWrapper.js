import PropTypes from 'prop-types'
import React, { useMemo, useReducer, useEffect } from 'react'
import { path, propEq, find } from 'ramda'
import { ProductOpenGraph } from 'vtex.open-graph'
import { ProductContext as ProductContextApp } from 'vtex.product-context'
import { ProductDispatchContext } from 'vtex.product-context/ProductDispatchContext'

import StructuredData from './components/StructuredData'
import WrapperContainer from './components/WrapperContainer'

import ProductTitleAndPixel from './components/ProductTitleAndPixel'

const findItemById = id => find(propEq('itemId', id))
function findAvailableProduct(item) {
  return item.sellers.find(
    ({ commertialOffer = {} }) => commertialOffer.AvailableQuantity > 0
  )
}

const defaultState = {
  selectedItem: null,
  selectedQuantity: 1,
  skuSelector: {
    areAllVariationsSelected: true,
  },
  assemblyOptions: {
    items: {},
    areGroupsValid: {},
  },
}

function reducer(state, action) {
  const args = action.args || {}
  switch (action.type) {
    case 'SET_QUANTITY':
      return {
        ...state,
        selectedQuantity: args.quantity,
      }
    case 'SKU_SELECTOR_SET_VARIATIONS_SELECTED': {
      return {
        ...state,
        skuSelector: {
          ...state.skuSelector,
          areAllVariationsSelected: args.allSelected,
        },
      }
    }
    case 'SET_SELECTED_ITEM': {
      return {
        ...state,
        selectedItem: args.item,
      }
    }
    case 'SET_ASSEMBLY_OPTIONS': {
      const { groupId, groupItems, isValid } = args
      return {
        ...state,
        assemblyOptions: {
          ...state.assemblyOptions,
          items: {
            ...state.assemblyOptions.items,
            [groupId]: groupItems,
          },
          areGroupsValid: {
            ...state.assemblyOptions.areGroupsValid,
            [groupId]: isValid,
          },
        },
      }
    }

    case 'SET_PRODUCT': {
      const differentSlug =
        path(['product', 'linkText'], state) !==
        path(['product', 'linkText'], args)
      return {
        ...state,
        product: args.product,
        ...(differentSlug ? defaultState : {}),
      }
    }
    default:
      return state
  }
}

function getSelectedItem(skuId, items) {
  return skuId
    ? findItemById(skuId)(items)
    : items.find(findAvailableProduct) || items[0]
}

function useProductInState(product, dispatch) {
  useEffect(() => {
    if (product) {
      dispatch({
        type: 'SET_PRODUCT',
        args: { product },
      })
    }
  }, [product, dispatch])
}

function useSelectedItemFromId(skuId, dispatch, product) {
  useEffect(() => {
    const items = (product && product.items) || []
    dispatch({
      type: 'SET_SELECTED_ITEM',
      args: { item: getSelectedItem(skuId, items) },
    })
  }, [dispatch, skuId, product])
}

function initReducer({ query, items, product }) {
  return {
    ...defaultState,
    selectedItem: getSelectedItem(query.skuId, items),
    product,
  }
}

const ProductWrapper = ({
  params: { slug },
  productQuery,
  productQuery: { product, loading } = {},
  query,
  children,
  ...props
}) => {
  const items = path(['items'], product) || []

  const [state, dispatch] = useReducer(
    reducer,
    { query, items, product },
    initReducer
  )

  // These hooks are used to keep the state in sync with API data, specially when switching between products without exiting the product page
  useProductInState(product, dispatch)
  useSelectedItemFromId(query.skuId, dispatch, product)

  const { selectedItem } = state

  const childrenProps = useMemo(
    () => ({
      productQuery,
      slug,
      ...props,
    }),
    [productQuery, slug, props]
  )

  return (
    <WrapperContainer className="vtex-product-context-provider">
      <ProductTitleAndPixel
        product={product}
        selectedItem={selectedItem}
        loading={loading}
      />
      <ProductContextApp.Provider value={state}>
        <ProductDispatchContext.Provider value={dispatch}>
          {product && <ProductOpenGraph />}
          {product && selectedItem && (
            <StructuredData product={product} selectedItem={selectedItem} />
          )}
          {React.cloneElement(children, childrenProps)}
        </ProductDispatchContext.Provider>
      </ProductContextApp.Provider>
    </WrapperContainer>
  )
}

ProductWrapper.propTypes = {
  params: PropTypes.object,
  productQuery: PropTypes.object,
  children: PropTypes.node,
  /* URL query params */
  query: PropTypes.object,
}

export default ProductWrapper
