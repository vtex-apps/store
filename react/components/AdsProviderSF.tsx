import React, { useEffect, useState } from 'react'
import { AdsProvider } from '@vtex/ads-react'
import { Offer } from '@vtex/ads-core'
import productSearchV3 from 'vtex.store-resources/QueryProductSearchV3'
import { useApolloClient } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'

import {
  getSessionPromiseFromWindow,
  getUserData,
  SessionResponse,
} from '../hooks/getUserData'

interface AdsProviderSFProps {
  children?: React.ReactNode
}

interface Product {
  items: Array<{
    ean: string
    itemId: string
    sellers: Array<{ sellerId: string }>
  }>
}

const matcher = (product: Product, offer: Offer): boolean => {
  const productSku = product.items.find(
    item =>
      item.itemId === offer.skuId &&
      item.sellers.some(seller => seller.sellerId === offer.sellerId)
  )

  if (productSku === undefined) {
    return false
  }

  const seller = productSku.sellers.find(
    item => item.sellerId === offer.sellerId
  )

  if (!seller) {
    return false
  }

  productSku.sellers = [seller]
  product.items = [productSku]

  return true
}

export const AdsProviderSF = ({ children }: AdsProviderSFProps) => {
  const { account, getSettings } = useRuntime()
  const publisherId = getSettings('vtex.store')?.publisherId

  const [userId, setUserId] = useState<string | undefined>(undefined)
  const [sessionId, setSessionId] = useState<string>('session-id')

  useEffect(() => {
    getSessionPromiseFromWindow().then((data: SessionResponse) => {
      const profileFields = data?.response?.namespaces?.profile

      if (!profileFields) {
        return
      }

      setSessionId(data.response?.id ?? 'session-id')

      const userData = getUserData(profileFields)
      setUserId(userData.id as string | undefined)
    })
  }, [])

  const client = useApolloClient()
  const fetcher = async (offers: Offer[]): Promise<Product[]> => {
    const skuIds = offers.map(o => o.skuId).join(';')
    const { data } = await client.query<{
      productSearch: { products: Product[] }
    }>({
      query: productSearchV3,
      variables: { fullText: `sku.id:${skuIds}` },
    })
    return data.productSearch.products
  }

  if (!publisherId) {
    return children
  }

  return (
    <AdsProvider
      identity={{
        accountName: account,
        publisherId,
        userId: userId ?? 'userId',
        sessionId,
        channel: 'site',
      }}
      hydrationStrategy={{ fetcher, matcher, key: 'sf' }}
    >
      {children}
    </AdsProvider>
  )
}
