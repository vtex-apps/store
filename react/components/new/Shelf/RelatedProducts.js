import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { path, last } from 'ramda'
import { Query } from 'react-apollo'
import useDevice from '../DeviceDetector/useDevice'
import { ProductListContext } from 'vtex.product-list-context'
import useProduct from '../ProductContext/useProduct'
import useCssHandles from '../CssHandles/useCssHandles'

import productRecommendations from './queries/productRecommendations.gql'
import ProductList from './components/ProductList'
import { productListSchemaPropTypes } from './utils/propTypes'

const CSS_HANDLES = ['relatedProducts']

const { ProductListProvider } = ProductListContext

// Previous values were in a wrong format with the message string in the enum value.
const fixRecommendation = recommendation => {
  if (recommendation.includes('editor.relatedProducts.')) {
    return last(recommendation.split('.'))
  }
  return recommendation
}

/**
 * Related Products Component. Queries and shows the related products
 */
const RelatedProducts = ({
  productQuery,
  productList,
  recommendation: cmsRecommendation,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const { isMobile } = useDevice()

  const productContext = useProduct()

  const productId =
    path(['product', 'productId'], productQuery) ||
    path(['product', 'productId'], productContext)

  const recommendation = productId ? fixRecommendation(cmsRecommendation) : null
  const variables = useMemo(() => {
    if (!productId) {
      return null
    }

    return {
      identifier: { field: 'id', value: productId },
      type: recommendation,
    }
  }, [productId, recommendation])

  if (!productId) {
    return null
  }

  return (
    <Query
      query={productRecommendations}
      variables={variables}
      partialRefetch
      ssr={false}
    >
      {({ data, loading }) => {
        if (!data) {
          return null
        }
        const { productRecommendations } = data
        const productListProps = {
          products: productRecommendations || [],
          loading,
          isMobile,
          ...productList,
        }
        return (
          <div className={handles.relatedProducts}>
            <ProductListProvider>
              <ProductList {...productListProps} />
            </ProductListProvider>
          </div>
        )
      }}
    </Query>
  )
}

RelatedProducts.propTypes = {
  /** Main product to have related products queried */
  slug: PropTypes.string,
  /** Graphql productQuery response. */
  productQuery: PropTypes.shape({
    /** Product to have related products queried */
    product: PropTypes.shape({
      productId: PropTypes.string,
    }),
    loading: PropTypes.bool,
  }),
  /** ProductList schema configuration */
  productList: PropTypes.shape(productListSchemaPropTypes),
}

RelatedProducts.defaultProps = {
  recommendation: 'similars',
  productList: {
    ...ProductList.defaultProps,
    titleText: 'Related Products',
  },
}

RelatedProducts.schema = {
  title: 'admin/editor.relatedProducts.title',
  description: 'admin/editor.relatedProducts.description',
  type: 'object',
  properties: {
    recommendation: {
      title: 'admin/editor.relatedProducts.recommendation',
      description: 'admin/editor.relatedProducts.recommendation.description',
      type: 'string',
      default: RelatedProducts.defaultProps.recommendation,
      enum: [
        'similars',
        'view',
        'buy',
        'accessories',
        'viewAndBought',
        'suggestions',
      ],
      enumNames: [
        'admin/editor.relatedProducts.similars',
        'admin/editor.relatedProducts.view',
        'admin/editor.relatedProducts.buy',
        'admin/editor.relatedProducts.accessories',
        'admin/editor.relatedProducts.viewAndBought',
        'admin/editor.relatedProducts.suggestions',
      ],
    },
    productList: ProductList.schema,
  },
}

export default RelatedProducts
