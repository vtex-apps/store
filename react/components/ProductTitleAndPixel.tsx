/* eslint-disable no-restricted-imports */
import React, { useMemo, FC } from 'react'
import { Helmet, useRuntime, canUseDOM } from 'vtex.render-runtime'
import { path } from 'ramda'

import useDataPixel from '../hooks/useDataPixel'
import { usePageView } from './PageViewPixel'
import { PixelEvent } from '../typings/event'

const titleSeparator = ' - '

const STORE_APP = 'vtex.store'

interface Product {
  linkText: string
  productName: string
  brand: string
  brandId: string
  categoryId: string
  categories: string[]
  categoryTree: Category[]
  productId: string
  titleTag: string
  metaTagDescription: string
  productReference: string
  items: SKU[]
}

interface ProductViewEvent {
  detailUrl: string
  brand: string
  brandId: string
  productReference: string
  linkText: string
  categoryId: string
  categories: string[]
  categoryTree: Category[]
  productId: string
  productName: string
  items: SKUEvent[]
  selectedSku: SKUEvent
}

interface Category {
  id: string
  name: string
}

interface SKUEvent extends Omit<SKU, 'images'> {
  imageUrl: string
}

interface SKU {
  itemId: string
  ean: string
  name: string
  images: Image[]
  referenceId: [{ Value: string }]
  sellers: Seller[]
}

interface Image {
  imageId: string
  imageLabel: string
  imageUrl: string
}

interface Seller {
  commertialOffer: CommertialOffer
  sellerId: string
  sellerName: string
}

interface CommertialOffer {
  ListPrice: number
  Price: number
  AvailableQuantity: number
}

type MaybeProduct = Product | null

function usePageInfo(
  titleTag: string,
  product: MaybeProduct,
  loading: boolean
) {
  const { account } = useRuntime()

  const pageEvents = useMemo(() => {
    if (!product || !canUseDOM) {
      return []
    }

    const pageInfo: PixelEvent = {
      event: 'pageInfo',
      eventType: 'productView',
      accountName: account,
      pageTitle: titleTag,
      pageUrl: window.location.href,
    }

    return pageInfo
  }, [account, product, titleTag])

  useDataPixel(pageEvents, path(['linkText'], product), loading)
}

function getSkuProperties(item: SKU): SKUEvent {
  return {
    itemId: item.itemId,
    name: item.name,
    ean: item.ean,
    referenceId: item.referenceId,
    imageUrl:
      item.images && item.images.length > 0 ? item.images[0].imageUrl : '',
    sellers: item.sellers.map(seller => ({
      sellerId: seller.sellerId,
      sellerName: seller.sellerName,
      commertialOffer: {
        Price: seller.commertialOffer.Price,
        ListPrice: seller.commertialOffer.ListPrice,
        AvailableQuantity: seller.commertialOffer.AvailableQuantity,
      },
    })),
  }
}

function useProductEvents(
  product: Product,
  selectedItem: SKU,
  loading: boolean
) {
  const productEvents = useMemo(() => {
    const hasCategoryTree = Boolean(product?.categoryTree?.length)

    if (!product || !canUseDOM || !selectedItem || !hasCategoryTree) {
      return []
    }

    const eventProduct: ProductViewEvent = {
      detailUrl: `/${product.linkText}/p`,
      brand: product.brand,
      brandId: product.brandId,
      productReference: product.productReference,
      linkText: product.linkText,
      categoryId: product.categoryId,
      categories: product.categories,
      categoryTree: product.categoryTree,
      productId: product.productId,
      productName: product.productName,
      items: product.items.map(getSkuProperties),
      selectedSku: getSkuProperties(selectedItem),
    }

    return [
      {
        event: 'productView',
        product: eventProduct,
      },
    ]
  }, [product, selectedItem])

  // When linkText or selectedItem changes, it will trigger the productEvents
  const pixelCacheKey = `${product?.linkText}${selectedItem?.itemId}`

  useDataPixel(productEvents, pixelCacheKey, loading)
}

function useTitle(product: Product) {
  const { getSettings } = useRuntime()
  const { titleTag = undefined, productName = undefined } = product || {}
  let title = titleTag ?? productName ?? ''

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

const ProductTitleAndPixel: FC<Props> = ({
  product,
  selectedItem,
  loading,
}) => {
  const { metaTagDescription = undefined } = product || {}
  const title = useTitle(product)

  const pixelCacheKey = path<string>(['linkText'], product)
  usePageView({
    title,
    skip: pixelCacheKey === undefined,
    cacheKey: pixelCacheKey,
  })
  usePageInfo(title, product, loading)
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
