import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { last, head, path } from 'ramda'
import { Helmet, withRuntimeContext } from 'vtex.render-runtime'
import { ProductContext as ProductContextApp } from 'vtex.product-context'

import StructuredData from './components/StructuredData'

import DataLayerApolloWrapper from './components/DataLayerApolloWrapper'

class ProductWrapper extends Component {
  state = {
    selectedQuantity: 1,
  }

  static propTypes = {
    params: PropTypes.object,
    productQuery: PropTypes.object,
    children: PropTypes.node,
    runtime: PropTypes.object,
    /* URL query params */
    query: PropTypes.object,
  }

  stripCategory(category) {
    return category && category.replace(/^\/|\/$/g, '')
  }

  getData = () => {
    const {
      productQuery: { product },
      runtime: { account },
      query,
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

  setSelectedQuantity = value => this.setState({ selectedQuantity: value })

  render() {
    const {
      params: { slug },
      productQuery,
      productQuery: { product, loading },
      query,
      ...props
    } = this.props
    const { titleTag, metaTagDescription } = product || {}

    const items = path(['items'], product) || []
    const selectedItem = query.skuId
      ? items.find(sku => sku.itemId === query.skuId)
      : items[0]

    return (
      <div className="vtex-product-context-provider">
        <Helmet>{titleTag && <title>{titleTag}</title>}</Helmet>
        <ProductContextApp.Provider value={{
          product,
          categories: path(['categories'], product),
          selectedItem,
          onChangeQuantity: this.setSelectedQuantity,
          selectedQuantity: this.state.selectedQuantity,
        }}>
          {product && <StructuredData product={product} query={query} />}
          <DataLayerApolloWrapper getData={this.getData} loading={loading}>
            {React.cloneElement(this.props.children, {
              productQuery,
              slug,
              ...props,
            })}
          </DataLayerApolloWrapper>
        </ProductContextApp.Provider>
      </div>
    )
  }
}

export default withRuntimeContext(ProductWrapper)
