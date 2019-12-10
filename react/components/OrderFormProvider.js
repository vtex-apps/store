import React, { useState, useCallback, useMemo } from 'react'
import { useQuery, useMutation } from 'react-apollo'

import {
  addToCart,
  updateItems,
  updateOrderFormProfile,
  updateOrderFormShipping,
  updateOrderFormCheckin,
} from 'vtex.store-resources/Mutations'
import { Provider } from 'vtex.store-resources/OrderFormContext'
import { orderForm } from 'vtex.store-resources/Queries'

const OrderFormProvider = ({ children }) => {
  const { loading, data = {}, refetch } = useQuery(orderForm, { ssr: false })
  const [addItem] = useMutation(addToCart)
  const [updateItemsMutation] = useMutation(updateItems)
  const [updateOrderFormProfileMutation] = useMutation(updateOrderFormProfile)
  const [updateOrderFormShippingMutation] = useMutation(updateOrderFormShipping)
  const [updateOrderFormCheckinMutation] = useMutation(updateOrderFormCheckin)

  const [toastMessage, updateToastMessage] = useState({
    isSuccess: null,
    text: null,
  })
  const updateAndRefetchOrderForm = useCallback(
    vars => {
      return updateItemsMutation(vars).then(() => {
        return refetch()
      })
    },
    [updateItemsMutation, refetch]
  )

  const context = useMemo(() => {
    return {
      orderFormContext: {
        loading,
        orderForm: data,
        refetch,
        message: toastMessage,
        addItem,
        updateToastMessage,
        updateOrderForm: updateItemsMutation,
        updateAndRefetchOrderForm,
        updateOrderFormProfile: updateOrderFormProfileMutation,
        updateOrderFormShipping: updateOrderFormShippingMutation,
        updateOrderFormCheckin: updateOrderFormCheckinMutation,
      },
    }
  }, [
    loading,
    data,
    refetch,
    toastMessage,
    addItem,
    updateItemsMutation,
    updateAndRefetchOrderForm,
    updateOrderFormProfileMutation,
    updateOrderFormShippingMutation,
    updateOrderFormCheckinMutation,
  ])

  return <Provider value={context}>{children}</Provider>
}

export default OrderFormProvider
