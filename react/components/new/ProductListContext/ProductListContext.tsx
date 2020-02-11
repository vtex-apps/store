import React, { createContext, useContext, useReducer, FC } from 'react'

export interface Product {
  productId: string
  [key: string]: any
}
export interface State {
  nextImpressions: Product[]
  sentIds: Set<string>
}

type ReducerActions =
  | { type: 'SEND_IMPRESSION'; args: { product: Product } }
  | { type: 'RESET_NEXT_IMPRESSIONS' }

export type Dispatch = (action: ReducerActions) => void

const DEFAULT_STATE: State = {
  nextImpressions: [],
  sentIds: new Set<string>(),
}

const ProductListStateContext = createContext<State>(DEFAULT_STATE)
const ProductListDispatchContext = createContext<Dispatch>(action => {
  console.error('error in dispatch ', action)
})

function productListReducer(state: State, action: ReducerActions): State {
  switch (action.type) {
    case 'SEND_IMPRESSION': {
      const { product } = action.args
      let nextImpressions = state.nextImpressions
      if (!state.sentIds.has(product.productId)) {
        state.sentIds.add(product.productId)
        nextImpressions = state.nextImpressions.concat(product)
      }
      return {
        ...state,
        nextImpressions,
      }
    }
    case 'RESET_NEXT_IMPRESSIONS': {
      return { ...state, nextImpressions: [] }
    }
    default: {
      throw new Error(`Unhandled action type on product-list-context`)
    }
  }
}

const initialState: State = {
  nextImpressions: [],
  sentIds: new Set(),
}

const ProductListProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(productListReducer, initialState)
  return (
    <ProductListStateContext.Provider value={state}>
      <ProductListDispatchContext.Provider value={dispatch}>
        {children}
      </ProductListDispatchContext.Provider>
    </ProductListStateContext.Provider>
  )
}

const useProductListState = () => useContext(ProductListStateContext)

const useProductListDispatch = () => useContext(ProductListDispatchContext)

export default {
  ProductListProvider,
  useProductListState,
  useProductListDispatch,
}
