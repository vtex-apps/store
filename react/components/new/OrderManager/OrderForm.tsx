import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useEffect,
  useState,
  FC,
} from 'react'
import { ApolloClient, ApolloError } from 'apollo-client'
import { useQuery } from 'react-apollo'
import Queries from '../CheckoutResources/Queries'
import { OrderForm } from 'vtex.checkout-graphql'

import { dummyOrderForm, emptyOrderForm } from './utils/dummyOrderForm'
import { logSplunk } from './utils/logger'

const { orderForm: OrderFormQuery } = Queries

interface Context {
  loading: boolean
  orderForm: OrderForm | undefined
  setOrderForm: (orderForm: Partial<OrderForm>) => void
  error: ApolloError | undefined
}

const OrderFormContext = createContext<Context | undefined>(undefined)

const updateApolloCache = (client: ApolloClient<any>, orderForm: OrderForm) => {
  const data = client.readQuery({ query: OrderFormQuery })
  client.writeQuery({
    query: OrderFormQuery,
    data: {
      ...data,
      orderForm,
    },
  })
}

export const OrderFormProvider: FC = ({ children }) => {
  const { client, loading: loadingQuery, data, error } = useQuery<{
    orderForm: OrderForm
  }>(OrderFormQuery, {
    ssr: false,
  })

  const [orderForm, setOrderForm] = useReducer(
    (orderForm: OrderForm, newOrderForm: Partial<OrderForm>) => ({
      ...orderForm,
      ...newOrderForm,
    }),
    dummyOrderForm
  )

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (error) {
      logSplunk({
        level: 'Important',
        type: 'Error',
        workflowType: 'OrderManager',
        workflowInstance: 'orderform-query',
        event: {
          message: error.message,
        },
      })
      console.error(error.message)
    }

    if (loadingQuery) {
      return
    }

    setLoading(false)

    if (data) {
      setOrderForm(data.orderForm)
      updateApolloCache(client, data.orderForm)
    }
  }, [client, data, error, loadingQuery])

  const value = useMemo(
    () => ({
      error,
      loading,
      orderForm: error ? emptyOrderForm : orderForm,
      setOrderForm: (newOrderForm: Partial<OrderForm>) => {
        updateApolloCache(client, { ...orderForm, ...newOrderForm })
        setOrderForm(newOrderForm)
      },
    }),
    [client, error, loading, orderForm]
  )
  return (
    <OrderFormContext.Provider value={value}>
      {children}
    </OrderFormContext.Provider>
  )
}

export const useOrderForm = () => {
  const context = useContext(OrderFormContext)
  if (context === undefined) {
    throw new Error('useOrderForm must be used within a OrderFormProvider')
  }

  return context
}

export default { OrderFormProvider, useOrderForm }
