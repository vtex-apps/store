import React, {
  FunctionComponent,
  Fragment,
  useContext,
  useEffect,
  useReducer,
} from 'react'
import ApolloClient, { ApolloQueryResult } from 'apollo-client'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import { withApollo } from 'react-apollo'
import ProductSummaryContext from '../ProductSummary/ProductSummaryContext'

import Stars from './components/Stars'
import useCssHandles from '../CssHandles/useCssHandles'
import TotalReviewsByProductId from './graphql/totalReviewsByProductId.graphql'
import AverageRatingByProductId from './graphql/averageRatingByProductId.graphql'

interface Props {
  client: ApolloClient<NormalizedCacheObject>
}

interface TotalData {
  totalReviewsByProductId: number
}

interface AverageData {
  averageRatingByProductId: number
}

interface State {
  total: number
  average: number
  hasTotal: boolean
  hasAverage: boolean
}

type ReducerActions =
  | { type: 'SET_TOTAL'; args: { total: number } }
  | { type: 'SET_AVERAGE'; args: { average: number } }

const initialState = {
  total: 0,
  average: 0,
  hasTotal: false,
  hasAverage: false,
}

const reducer = (state: State, action: ReducerActions) => {
  switch (action.type) {
    case 'SET_TOTAL':
      return {
        ...state,
        total: action.args.total,
        hasTotal: true,
      }
    case 'SET_AVERAGE':
      return {
        ...state,
        average: action.args.average,
        hasAverage: true,
      }
  }
}

const CSS_HANDLES = ['inlineContainer'] as const

const RatingInline: FunctionComponent<Props> = props => {
  const { client } = props

  const handles = useCssHandles(CSS_HANDLES)
  const { product }: any = useContext(ProductSummaryContext)
  const { productId }: any = product || {}

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (!productId) {
      return
    }

    client
      .query({
        query: TotalReviewsByProductId,
        variables: {
          productId: productId,
        },
      })
      .then((response: ApolloQueryResult<TotalData>) => {
        const total = response.data.totalReviewsByProductId
        dispatch({
          type: 'SET_TOTAL',
          args: { total },
        })
      })

    client
      .query({
        query: AverageRatingByProductId,
        variables: {
          productId: productId,
        },
      })
      .then((response: ApolloQueryResult<AverageData>) => {
        const average = response.data.averageRatingByProductId
        dispatch({
          type: 'SET_AVERAGE',
          args: { average },
        })
      })
  }, [client, productId])

  return (
    <div className={`${handles.inlineContainer} review-summary mw8 center`}>
      {!state.hasTotal || !state.hasAverage ? null : state.total == 0 ? null : (
        <Fragment>
          <span className="t-heading-5 v-mid">
            <Stars rating={state.average} />
          </span>
        </Fragment>
      )}
    </div>
  )
}

export default withApollo(RatingInline)
