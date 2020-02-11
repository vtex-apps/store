import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { QueueStatus } from './constants'
import { TaskQueue } from './modules/TaskQueue'
import { CancellablePromiseLike } from './modules/SequentialTaskQueue'

type ListenFunction = (event: QueueStatus, callback: () => any) => () => void

interface Context {
  enqueue: <T extends any>(
    task: () => Promise<T>,
    id?: string
  ) => CancellablePromiseLike<T>
  listen: ListenFunction
  isWaiting: (id: string) => boolean
}

interface OrderQueueProviderProps {
  children: ReactNode
}

const OrderQueueContext = createContext<Context | undefined>(undefined)

export const useQueueStatus = (listen: ListenFunction) => {
  const queueStatus = useRef(QueueStatus.FULFILLED)

  useEffect(() => {
    const unlisten = listen(
      QueueStatus.PENDING,
      () => (queueStatus.current = QueueStatus.PENDING)
    )
    return unlisten
  }, [listen])

  useEffect(() => {
    const unlisten = listen(
      QueueStatus.FULFILLED,
      () => (queueStatus.current = QueueStatus.FULFILLED)
    )
    return unlisten
  }, [listen])

  return queueStatus
}

export const OrderQueueProvider: FC<OrderQueueProviderProps> = ({
  children,
}) => {
  const [queue] = useState(() => new TaskQueue())

  const value = useMemo(
    () => ({
      enqueue: queue.enqueue.bind(queue),
      listen: queue.listen.bind(queue),
      isWaiting: queue.isWaiting.bind(queue),
    }),
    [queue]
  )

  return (
    <OrderQueueContext.Provider value={value}>
      {children}
    </OrderQueueContext.Provider>
  )
}

export const useOrderQueue = () => {
  const context = useContext(OrderQueueContext)
  if (context === undefined) {
    throw new Error('useOrderQueue must be used within a OrderQueueProvider')
  }

  return context
}

export default {
  OrderQueueProvider,
  QueueStatus,
  useOrderQueue,
  useQueueStatus,
}
