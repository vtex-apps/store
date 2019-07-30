import React, { useMemo } from 'react'
import { Helmet, useRuntime } from 'vtex.render-runtime'
import { head, last, path } from 'ramda'
import useDataPixel from '../hooks/useDataPixel'

const titleSeparator = ' - '

const STORE_APP = 'vtex.store'

const ProductTitleAndPixel = ({ product, selectedItem, loading }) => {
  const { getSettings, account } = useRuntime()
  const { titleTag, productName, metaTagDescription } = product || {}
  let title = titleTag || productName || ''

  const settings = getSettings(STORE_APP)

  if (settings) {
    const { storeName, titleTag: storeTitleTag } = settings
    const storeData = storeName || storeTitleTag
    if (storeData) {
      title += title ? titleSeparator + storeData : storeData
    }
  }

  const pixelEvents = useMemo(() => {
    const { brand, categoryId, categoryTree, productId } = product || {}

    if (!product || typeof document === 'undefined' || !selectedItem) {
      return []
    }

    const pageInfo = {
      event: 'pageInfo',
      eventType: 'productView',
      accountName: account,
      pageCategory: 'Product',
      pageDepartment: categoryTree ? head(categoryTree).name : '',
      pageFacets: [],
      pageTitle: titleTag,
      pageUrl: window.location.href,
      productBrandName: brand,
      productCategoryId: Number(categoryId),
      productCategoryName: categoryTree ? last(categoryTree).name : '',
      productDepartmentId: categoryTree ? head(categoryTree).id : '',
      productDepartmentName: categoryTree ? head(categoryTree).name : '',
      productId: productId,
      productName: productName,
      skuStockOutFromProductDetail: [],
      skuStockOutFromShelf: [],
    }

    const { ean, referenceId, sellers } = selectedItem || {}

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

    // Add selected SKU property to the product object
    const eventProduct = {
      ...product,
      selectedSku: selectedItem,
    }

    const pageView = {
      event: 'pageView',
      pageTitle: title,
      pageUrl: location.href,
      referrer:
        document.referrer.indexOf(location.origin) === 0
          ? undefined
          : document.referrer,
      accountName: account,
    }

    return [
      pageView,
      pageInfo,
      {
        event: 'productView',
        product: eventProduct,
      },
    ]
  }, [account, product, productName, selectedItem, title, titleTag])

  useDataPixel(pixelEvents, path(['linkText'], product), loading)

  return (
    <Helmet
      title={title}
      meta={[
        metaTagDescription && {
          name: 'description',
          content: metaTagDescription,
        },
      ].filter(Boolean)}
    />
  )
}

export default ProductTitleAndPixel
