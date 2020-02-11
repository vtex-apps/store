import React, { createContext, FC, useContext, useMemo, useRef } from 'react'

interface Context {
  enqueue: (_: any) => Promise<any>
  listen: () => () => void
}

const OrderQueueContext = createContext<Context | undefined>(undefined)

export const OrderQueueProvider: FC = ({ children }: any) => {
  const value = useMemo(
    () => ({
      enqueue: async (f: any) => f(),
      listen: () => () => {},
    }),
    []
  )

  return (
    <OrderQueueContext.Provider value={value}>
      {children}
    </OrderQueueContext.Provider>
  )
}

export const useOrderQueue = () => {
  return useContext(OrderQueueContext)
}

export const useQueueStatus = (_: any) => {
  return useRef('Fulfilled')
}

export enum QueueStatus {
  PENDING = 'Pending',
  FULFILLED = 'Fulfilled',
}
