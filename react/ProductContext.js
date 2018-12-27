import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { withApollo, graphql, compose } from 'react-apollo'
import { path, last, head, isEmpty } from 'ramda'
import { Helmet, withRuntimeContext } from 'render'

import MicroData from './components/MicroData'
import DataLayerApolloWrapper from './components/DataLayerApolloWrapper'
import productQuery from './queries/productQuery.gql'
import recommendationsAndBenefits from './queries/recommendationsAndBenefitsQuery.gql'
import productPreviewFragment from './queries/productPreview.gql'
import { cacheLocator } from './cacheLocator'

class ProductContext extends Component {
  static propTypes = {
    params: PropTypes.object,
    query: PropTypes.shape({
      skuId: PropTypes.string,
    }),
    data: PropTypes.object,
    children: PropTypes.node,
    runtime: PropTypes.object,
  }

  product() {
    const {
      catalog: {
        product: catalogProduct,
        loading: catalogLoading = true
      } = {},
      recommendationsAndBenefits: {
        product: recAndBenefitsProduct,
        loading: recAndBenefitsLoading = true
      } = {}
    } = this.props

    const catalogInfo = !catalogLoading && catalogProduct
    const recAndBenefitsInfo = catalogInfo && !recAndBenefitsLoading && recAndBenefitsProduct
    const product = {
      ...catalogInfo,
      ...recAndBenefitsInfo
    }
    return isEmpty(product)
      ? null
      : product
  }

  loading() {
    const {
      catalog: {
        loading: catalogLoading = true
      } = {},
      recommendationsAndBenefits: {
        loading: recAndBenefitsLoading = true
      } = {}
    } = this.props

    return catalogLoading || recAndBenefitsLoading
  }

  componentDidMount() {
    this.checkNotFoundProduct();
  }

  componentDidUpdate() {
    this.checkNotFoundProduct();
  }

  stripCategory(category) {
    return category && category.replace(/^\/|\/$/g, '')
  }

  getData = () => {
    const { query, runtime: { account } } = this.props
    const product = this.product()
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
      event: 'pageInfo',
      eventType: 'productView',
      accountName: account,
      pageCategory: 'Product',
      pageDepartment: categories ? this.stripCategory(last(categories)) : '',
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

    const skuId = query.skuId || (items && head(items).itemId)

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

      pageInfo.productListPriceFrom = `${commertialOffer.ListPrice}`
      pageInfo.productListPriceTo = `${commertialOffer.ListPrice}`
      pageInfo.productPriceFrom = `${commertialOffer.Price}`
      pageInfo.productPriceTo = `${commertialOffer.Price}`
      pageInfo.sellerId = `${sellerId}`
      pageInfo.sellerIds = `${sellerId}`
    }

    return [
      pageInfo,
      {
        event: 'productView',
        product,
      },
    ]
  }

  checkNotFoundProduct = () => {
    const loading = this.loading()
    const product = this.product()
    const { params: { slug }, runtime } = this.props
    if (!product && !loading) {
      runtime.navigate({
        page: 'store/search',
        params: { term: slug },
        query: `productLinkNotFound=${slug}`
      })
    }
  }

  render() {
    const {
      params: { slug },
      client,
    } = this.props

    const productPreview = client.readFragment({
      id: cacheLocator.product(slug),
      fragment: productPreviewFragment,
    })
    const loadedProduct = this.product()
    const product = loadedProduct
      ? loadedProduct
      : productPreview && productPreview.items
        ? productPreview
        : null

    const loading = this.loading()
    const { titleTag, metaTagDescription } = product || {}

    const productQuery = {
      loading,
      product,
    }

    if (!product && !loading) {
      productQuery.error = {
        message: 'Product not found!',
      }
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
        {
          <Fragment>
            {product && <MicroData product={product} />}
            <DataLayerApolloWrapper getData={this.getData} loading={loading}>
              {React.cloneElement(this.props.children, {
                productQuery,
                slug,
                ...breadcrumbsProps,
              })}
            </DataLayerApolloWrapper>
          </Fragment>
        }
      </div>
    )
  }
}

const catalogOptions = {
  name: 'catalog',
  options: props => ({
    variables: {
      slug: props.params.slug,
    },
    errorPolicy: 'all',
  }),
}

const recommendationsAndBenefitsOptions = {
  name: 'recommendationsAndBenefits',
  options: props => ({
    variables: {
      slug: props.params.slug,
    },
    errorPolicy: 'all',
    ssr: false,
  }),
}

export default compose(
  withApollo,
  withRuntimeContext,
  graphql(productQuery, catalogOptions),
  graphql(recommendationsAndBenefits, recommendationsAndBenefitsOptions)
)(ProductContext)
