import React, { createContext, FC, useContext, useMemo, useState } from 'react'

import { mockOrderForm } from '../mockOrderForm'

interface Context {
  loading: boolean
  orderForm: any
  setOrderForm: (_: any) => void
}

const OrderFormContext = createContext<Context | undefined>(undefined)

export const OrderFormProvider: FC = ({ children }: any) => {
  const [orderForm, setOrderForm] = useState(mockOrderForm)

  const value = useMemo(
    () => ({
      loading: false,
      orderForm,
      setOrderForm,
    }),
    [orderForm]
  )

  return (
    <OrderFormContext.Provider value={value}>
      {children}
    </OrderFormContext.Provider>
  )
}

export const useOrderForm = () => {
  return useContext(OrderFormContext)
}
