import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { withApollo, graphql, compose } from 'react-apollo'
import { path, last, head } from 'ramda'

import MicroData from './components/MicroData'
import DataLayerApolloWrapper from './components/DataLayerApolloWrapper'
import productQuery from './queries/productQuery.gql'
import productPreviewFragment from './queries/productPreview.gql'
import { cacheLocator } from './cacheLocator'

class ProductContextProvider extends Component {
  static propTypes = {
    params: PropTypes.object,
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
    console.log(product)
    console.log(head(product.categories))

    let selectedItem, commertialOffer, sellerId, skuItems, initialItemIndex

    const [{ itemId: initialItem }] = product.items

    skuItems = product.items.slice()
    skuItems.sort(this.compareSku)

    initialItemIndex = skuItems.findIndex(item => item.itemId === initialItem)

    selectedItem = skuItems[0]
    if (selectedItem == null) {
      selectedItem = skuItems[initialItemIndex]
    }

    ;[{ commertialOffer }] = selectedItem.sellers
    sellerId = parseInt(selectedItem.sellers[0].sellerId)

    console.log('>> commertialOffer', commertialOffer)

    return {
      ecommerce: {
        detail: {
          products: [
            {
              id: product.productId,
              name: product.productName,
              brand: product.brand,
              category: path(['categories', '0'], product),
            },
          ],
        },
      },
      accountName: global.__RUNTIME__.account,
      pageCategory: 'Product',
      pageDepartment: this.stripCategory(last(product.categories)),
      pageFacets: [],
      pageTitle: document.title,
      pageUrl: window.location.href,
      // productBrandId: 2123,
      productBrandName: product.brand,
      productCategoryId: Number(product.categoryId),
      productCategoryName: last(
        this.stripCategory(head(product.categories)).split('/')
      ),
      productDepartmentId: Number(
        this.stripCategory(last(product.categoriesIds))
      ),
      productDepartmentName: this.stripCategory(last(product.categories)),
      productEans: Array['7891033117987'],
      productId: product.productId,
      productListPriceFrom: commertialOffer.ListPrice,
      productListPriceTo: commertialOffer.ListPrice,
      productName: product.productName,
      productPriceFrom: commertialOffer.Price,
      productPriceTo: commertialOffer.Price,
      productReferenceId: '11798',
      sellerId: sellerId,
      sellerIds: sellerId,
      shelfProductIds: Array[('2003029', '2002572')],
      skuStockOutFromProductDetail: [],
      skuStockOutFromShelf: [],
      skuStocks: { 2003960: 108 },
    }
  }

  render() {
    console.log('porps', this.props, this.context)
    const {
      data,
      params: { slug },
      client, // eslint-disable-line react/prop-types
    } = this.props
    const { loading } = data
    const productPreview = client.readFragment({
      id: cacheLocator.product(slug),
      fragment: productPreviewFragment,
    })
    const product = loading ? productPreview : data.product

    const productQuery = {
      loading,
      product,
    }

    return (
      <div className="vtex-product-details-container">
        <Fragment>
          {product && <MicroData product={product} />}
          <DataLayerApolloWrapper
            getData={this.getData}
            loading={this.props.data.loading}
          >
            {React.cloneElement(this.props.children, {
              productQuery,
              slug,
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
