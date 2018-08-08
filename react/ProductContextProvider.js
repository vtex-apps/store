import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { withApollo, graphql, compose } from 'react-apollo'
import { path, last, head } from 'ramda'
import { Helmet } from 'render'

import MicroData from './components/MicroData'
import DataLayerApolloWrapper from './components/DataLayerApolloWrapper'
import productQuery from './queries/productQuery.gql'
import productPreviewFragment from './queries/productPreview.gql'
import { cacheLocator } from './cacheLocator'

class ProductContextProvider extends Component {
  static propTypes = {
    params: PropTypes.object,
    query: PropTypes.shape({
      skuId: PropTypes.string,
    }),
    data: PropTypes.object,
    children: PropTypes.node,
  }

  stripCategory(category) {
    return category.replace(/^\/|\/$/g, '')
  }

  getData = () => {
    const {
      data: { product },
    } = this.props

    if (!product) {
      return []
    }

    const pageInfo = {
      accountName: global.__RUNTIME__.account,
      pageCategory: 'Product',
      pageDepartment: product
        ? this.stripCategory(last(product.categories))
        : '',
      pageFacets: [],
      pageTitle: product.titleTag,
      pageUrl: window.location.href,
      productBrandName: product.brand,
      productCategoryId: Number(product.categoryId),
      productCategoryName: product
        ? last(this.stripCategory(head(product.categories)).split('/'))
        : '',
      productDepartmentId: Number(
        this.stripCategory(last(product.categoriesIds))
      ),
      productDepartmentName: product
        ? this.stripCategory(last(product.categories))
        : '',
      productId: product.productId,
      productName: product.productName,
      skuStockOutFromProductDetail: [],
      skuStockOutFromShelf: [],
      // productBrandId: 2123,
      // shelfProductIds: Array[('2003029', '2002572')],
      // skuStocks: { 2003960: 108 },
    }

    const skuId = this.props.query.skuId || head(product.items).itemId

    const [sku] =
      product.items.filter(product => product.itemId === skuId) || []

    const { ean, referenceId } = sku

    pageInfo.productEans = [ean]

    if (referenceId && referenceId.length >= 0) {
      const [{ Value: refIdValue }] = referenceId

      pageInfo.productReferenceId = refIdValue
    }

    if (sku.sellers && sku.sellers.length >= 0) {
      const [{ commertialOffer, sellerId }] = sku.sellers

      pageInfo.productListPriceFrom = commertialOffer.ListPrice + ''
      pageInfo.productListPriceTo = commertialOffer.ListPrice + ''
      pageInfo.productPriceFrom = commertialOffer.Price + ''
      pageInfo.productPriceTo = commertialOffer.Price + ''
      pageInfo.sellerId = sellerId + ''
      pageInfo.sellerIds = sellerId + ''
    }

    return [
      {
        ecommerce: {
          detail: {
            products: [
              {
                id: product.productId,
                name: product.productName,
                brand: product.brand,
                category: this.stripCategory(
                  path(['categories', '0'], product)
                ),
                price: pageInfo.productPriceTo,
              },
            ],
          },
        },
      },
      pageInfo,
    ]
  }

  render() {
    const {
      data: apolloData,
      params: { slug },
      client,
    } = this.props
    const productPreview = client.readFragment({
      id: cacheLocator.product(slug),
      fragment: productPreviewFragment,
    })
    const data = apolloData || {}
    const { loading } = data
    const product = loading ? productPreview : data.product || {}

    const productQuery = {
      loading,
      product,
    }

    /**
     * The breadcrumbs components is being used in multiple pages, therefore we need to adapt the data to its needs insteadof
     * making the component do the changes it self.**/
    const breadcrumbsProps = {
      term: slug,
      categories: product ? product.categories : null,
    }

    return (
      <div className="vtex-product-context-provider">
        {product &&
          <Helmet>
            <title>{product.titleTag}</title>
            <meta name="description" content={product.metaTagDescription} />
          </Helmet>
        }
        <Fragment>
          {product && <MicroData product={product} />}
          <DataLayerApolloWrapper
            getData={this.getData}
            loading={loading}
          >
            {React.cloneElement(this.props.children, {
              productQuery,
              slug,
              ...breadcrumbsProps,
            })}
          </DataLayerApolloWrapper>
        </Fragment>
      </div>
    )
  }
}

const options = {
  options: props => ({
    variables: {
      slug: props.params.slug,
    },
  }),
}

export default compose(
  withApollo,
  graphql(productQuery, options)
)(ProductContextProvider)
