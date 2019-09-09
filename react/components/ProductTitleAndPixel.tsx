import React, { useMemo, FC } from 'react'
import { Helmet, useRuntime } from 'vtex.render-runtime'
import { head, last, path } from 'ramda'
import useDataPixel from '../hooks/useDataPixel'

const titleSeparator = ' - '

const STORE_APP = 'vtex.store'

interface Product {
  linkText: string
  productName: string
  brand: string
  categoryId: string
  categoryTree: Category[]
  productId: string
  titleTag: string
  metaTagDescription: string
}

interface Category {
  id: string
  name: string
}

interface SKU {
  itemId: string
  ean: string
  referenceId: [{ Value: string }]
  sellers: Seller[]
}

interface Seller {
  commertialOffer: CommertialOffer
  sellerId: string
}

interface CommertialOffer {
  ListPrice: number
  Price: number
}

type MaybeProduct = Product | null

function usePageEvents(titleTag: string, product: MaybeProduct, selectedItem: SKU, loading: boolean) {
  const { account } = useRuntime()
  const { productName = undefined } = product || {}

  const pageEvents = useMemo(() => {
    const { brand = undefined, categoryId = undefined, categoryTree = undefined, productId = undefined } = product || {}

    if (!product || typeof document === 'undefined' || !selectedItem) {
      return []
    }

    const pageInfo: any = {
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

    const { ean = undefined, referenceId = undefined, sellers = undefined } = selectedItem || {}

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

    const pageView = {
      event: 'pageView',
      pageTitle: titleTag,
      pageUrl: location.href,
      referrer:
        document.referrer.indexOf(location.origin) === 0
          ? undefined
          : document.referrer,
      accountName: account,
    }

    return [pageView, pageInfo]
  }, [account, product, productName, selectedItem, titleTag])

  useDataPixel(pageEvents, path(['linkText'], product), loading)
}

function useProductEvents(product: Product, selectedItem: SKU, loading: boolean) {
  const productEvents = useMemo(() => {
    if (!product || typeof document === 'undefined' || !selectedItem) {
      return []
    }

    // Add selected SKU property to the product object
    const eventProduct = {
      ...product,
      selectedSku: selectedItem,
    }

    return [
      {
        event: 'productView',
        product: eventProduct,
      },
    ]
  }, [product, selectedItem])

  // When linkText or selectedItem changes, it will trigger the productEvents
  const pixelCacheKey =
    '' + (product && product.linkText) + (selectedItem && selectedItem.itemId)

  useDataPixel(productEvents, pixelCacheKey, loading)
}

function useTitle(product: Product) {
  const { getSettings } = useRuntime()
  const { titleTag = undefined, productName = undefined } = product || {}
  let title = titleTag || productName || ''

  const settings = getSettings(STORE_APP)

  if (settings) {
    const { storeName, titleTag: storeTitleTag } = settings
    const storeData = storeName || storeTitleTag
    if (storeData) {
      title += title ? titleSeparator + storeData : storeData
    }
  }

  return title
}

interface Props {
  product: Product
  selectedItem: SKU
  loading: boolean
}

const ProductTitleAndPixel: FC<Props> = ({ product, selectedItem, loading }) => {
  const { metaTagDescription = undefined } = product || {}
  const title = useTitle(product)

  usePageEvents(title, product, selectedItem, loading)
  useProductEvents(product, selectedItem, loading)

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
