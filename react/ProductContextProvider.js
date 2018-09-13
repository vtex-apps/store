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
    return category && category.replace(/^\/|\/$/g, '')
  }

  getData = () => {
    const {
      data: { product },
    } = this.props
    const {
      titleTag,
      brand,
      categoryId,
      categoriesIds,
      categories,
      productId,
      productName,
      items,
    } = product || {}

    if (!product) {
      return []
    }

    const pageInfo = {
      accountName: global.__RUNTIME__.account,
      pageCategory: 'Product',
      pageDepartment: categories
        ? this.stripCategory(last(categories))
        : '',
      pageFacets: [],
      pageTitle: titleTag,
      pageUrl: window.location.href,
      productBrandName: brand,
      productCategoryId: Number(categoryId),
      productCategoryName: categories
        ? last(this.stripCategory(head(categories)).split('/'))
        : '',
      productDepartmentId: categoriesIds
        ? Number(this.stripCategory(last(categoriesIds)))
        : '',
      productDepartmentName: categories
        ? this.stripCategory(last(categories))
        : '',
      productId: productId,
      productName: productName,
      skuStockOutFromProductDetail: [],
      skuStockOutFromShelf: [],
    }

    const skuId = this.props.query.skuId || (items && head(items).itemId)

    const [sku] =
      (items && items.filter(product => product.itemId === skuId)) || []

    const { ean, referenceId, sellers } = sku || {}

    pageInfo.productEans = [ean]

    if (referenceId && referenceId.length >= 0) {
      const [{ Value: refIdValue }] = referenceId

      pageInfo.productReferenceId = refIdValue
    }

    if (sellers && sellers.length >= 0) {
      const [{ commertialOffer, sellerId }] = sellers

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
                id: productId,
                name: productName,
                brand: brand,
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
      {
        event: 'productView',
      },
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
    const { titleTag, metaTagDescription } = product || {}

    const productQuery = {
      loading,
      product,
    }

    const isNullOrEmpty = !product || !Object.keys(product).length

    if (isNullOrEmpty)
      productQuery.error = {
        message: 'Product not found!',
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
        <Helmet>
          {titleTag && <title>{titleTag}</title>}
          {metaTagDescription && (
            <meta name="description" content={metaTagDescription} />
          )}
        </Helmet>
        <Fragment>
          {!isNullOrEmpty && <MicroData product={product} />}
          <DataLayerApolloWrapper getData={this.getData} loading={loading}>
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
    errorPolicy: 'all',
  }),
}

export default compose(
  withApollo,
  graphql(productQuery, options)
)(ProductContextProvider)
