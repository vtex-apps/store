import React from 'react'
import { useQuery } from 'react-apollo'
import ProductListContext from '../ProductListContext/ProductListContext'
import { ExtensionPoint, useTreePath } from 'vtex.render-runtime'
import ListContextProvider from '../ListContext/ListContextProvider'
import useListContext from '../ListContext/useListContext'

import { mapCatalogProductToProductSummary } from './utils/normalize'
import ProductListEventCaller from './components/ProductListEventCaller'

import StoreQueries from '../../StoreResources/Queries'
const {productSearchV2
} = StoreQueries

const ORDER_BY_OPTIONS = {
  RELEVANCE: {
    name: 'admin/editor.productSummaryList.orderType.relevance',
    value: 'OrderByScoreDESC',
  },
  TOP_SALE_DESC: {
    name: 'admin/editor.productSummaryList.orderType.sales',
    value: 'OrderByTopSaleDESC',
  },
  PRICE_DESC: {
    name: 'admin/editor.productSummaryList.orderType.priceDesc',
    value: 'OrderByPriceDESC',
  },
  PRICE_ASC: {
    name: 'admin/editor.productSummaryList.orderType.priceAsc',
    value: 'OrderByPriceASC',
  },
  NAME_ASC: {
    name: 'admin/editor.productSummaryList.orderType.nameAsc',
    value: 'OrderByNameASC',
  },
  NAME_DESC: {
    name: 'admin/editor.productSummaryList.orderType.nameDesc',
    value: 'OrderByNameDESC',
  },
  RELEASE_DATE_DESC: {
    name: 'admin/editor.productSummaryList.orderType.releaseDate',
    value: 'OrderByReleaseDateDESC',
  },
  BEST_DISCOUNT_DESC: {
    name: 'admin/editor.productSummaryList.orderType.discount',
    value: 'OrderByBestDiscountDESC',
  },
}
const parseFilters = ({ id, value }) => `specificationFilter_${id}:${value}`

function getOrdinationProp(attribute) {
  return Object.keys(ORDER_BY_OPTIONS).map(
    key => ORDER_BY_OPTIONS[key][attribute]
  )
}

const ProductSummaryList = ({
  children,
  category = '',
  collection,
  hideUnavailableItems = false,
  orderBy = ORDER_BY_OPTIONS.TOP_SALE_DESC.value,
  specificationFilters = [],
  maxItems = 10,
  withFacets = false,
}) => {
  const { data } = useQuery(productSearchV2, {
    ssr: true,
    name: 'productList',
    variables: {
      category,
      ...(collection != null
        ? {
            collection,
          }
        : {}),
      specificationFilters: specificationFilters.map(parseFilters),
      orderBy,
      from: 0,
      to: maxItems - 1,
      hideUnavailableItems,
      withFacets,
    },
  })

  const { list } = useListContext()
  const { treePath } = useTreePath()

  const componentList =
    data.productSearch &&
    data.productSearch.products.map(product => {
      const normalizedProduct = mapCatalogProductToProductSummary(product)

      return (
        <ExtensionPoint
          id="product-summary"
          key={product.id}
          treePath={treePath}
          product={normalizedProduct}
        />
      )
    })

  const newListContextValue = list.concat(componentList)

  return (
    <ListContextProvider list={newListContextValue}>
      {children}
    </ListContextProvider>
  )
}

const EnhancedProductList = ({ children }) => {
  const { ProductListProvider } = ProductListContext

  return (
    <ProductListProvider>
      <ProductSummaryList>{children}</ProductSummaryList>
      <ProductListEventCaller />
    </ProductListProvider>
  )
}

EnhancedProductList.getSchema = () => ({
  title: 'admin/editor.productSummaryList.title',
  description: 'admin/editor.productSummaryList.description',
  type: 'object',
  properties: {
    category: {
      title: 'admin/editor.productSummaryList.category.title',
      description: 'admin/editor.productSummaryList.category.description',
      type: 'string',
      isLayout: false,
    },
    specificationFilters: {
      title: 'admin/editor.productSummaryList.specificationFilters.title',
      type: 'array',
      items: {
        title:
          'admin/editor.productSummaryList.specificationFilters.item.title',
        type: 'object',
        properties: {
          id: {
            type: 'string',
            title:
              'admin/editor.productSummaryList.specificationFilters.item.id.title',
          },
          value: {
            type: 'string',
            title:
              'admin/editor.productSummaryList.specificationFilters.item.value.title',
          },
        },
      },
    },
    collection: {
      title: 'admin/editor.productSummaryList.collection.title',
      type: 'number',
      isLayout: false,
    },
    orderBy: {
      title: 'admin/editor.productSummaryList.orderBy.title',
      type: 'string',
      enum: getOrdinationProp('value'),
      enumNames: getOrdinationProp('name'),
      default: ORDER_BY_OPTIONS.TOP_SALE_DESC.value,
      isLayout: false,
    },
    hideUnavailableItems: {
      title: 'admin/editor.productSummaryList.hideUnavailableItems',
      type: 'boolean',
      default: false,
      isLayout: false,
    },
    maxItems: {
      title: 'admin/editor.productSummaryList.maxItems.title',
      type: 'number',
      isLayout: false,
      default: 10,
    },
  },
})

export default EnhancedProductList
