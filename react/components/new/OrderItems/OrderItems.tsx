import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react'
import { useMutation } from 'react-apollo'
import CheckoutMutations from '../CheckoutResources/Mutations'
const { updateItems: UpdateItems } = CheckoutMutations
import OrderQueue from '../OrderManager/OrderQueue'
const { 
  QueueStatus,
  useOrderQueue,
  useQueueStatus,
} = OrderQueue
import OrderFormOrder from '../OrderManager/OrderForm'
const { useOrderForm } = OrderFormOrder

const AVAILABLE = 'available'
const TASK_CANCELLED = 'TASK_CANCELLED'

enum Totalizers {
  SUBTOTAL = 'Items',
  DISCOUNT = 'Discounts',
}

interface Context {
  updateQuantity: (props: Partial<Item>) => void
  removeItem: (props: Partial<Item>) => void
}

interface CancellablePromiseLike<T> extends Promise<T> {
  cancel: () => void
}

interface EnqueuedTask {
  promise?: CancellablePromiseLike<any>
  variables?: any
}

const OrderItemsContext = createContext<Context | undefined>(undefined)

const noop = async (_: Partial<Item>) => {}

const maybeUpdateTotalizers = (
  totalizers: Totalizer[],
  value: number,
  oldItem: Item,
  newItem: Item
) => {
  if (oldItem.availability !== AVAILABLE) {
    return {}
  }

  const oldPrice = oldItem.price * oldItem.quantity
  const newPrice = newItem.price * newItem.quantity
  const subtotalDifference = newPrice - oldPrice

  const oldDiscount = (oldItem.sellingPrice - oldItem.price) * oldItem.quantity
  const newDiscount = (newItem.sellingPrice - newItem.price) * newItem.quantity
  const discountDifference = newDiscount - oldDiscount

  const newTotalizers = totalizers.map((totalizer: Totalizer) => {
    switch (totalizer.id) {
      case Totalizers.SUBTOTAL:
        return { ...totalizer, value: totalizer.value + subtotalDifference }
      case Totalizers.DISCOUNT:
        return { ...totalizer, value: totalizer.value + discountDifference }
      default:
        return totalizer
    }
  })
  const newValue = value + subtotalDifference + discountDifference

  return { totalizers: newTotalizers, value: newValue }
}

const enqueueTask = ({
  task,
  enqueue,
  queueStatusRef,
  setOrderForm,
  taskId,
}: {
  task: () => Promise<any>
  enqueue: (task: any, id?: string) => CancellablePromiseLike<any>
  queueStatusRef: React.MutableRefObject<QueueStatus>
  setOrderForm: (orderForm: Partial<OrderForm>) => void
  taskId?: string
}) => {
  const promise = enqueue(task, taskId)
  const cancelPromise = promise.cancel
  const newPromise = promise
    .then((newOrderForm: OrderForm) => {
      if (queueStatusRef.current === QueueStatus.FULFILLED) {
        setOrderForm(newOrderForm)
      }
    })
    .catch((error: any) => {
      if (!error || error.code !== TASK_CANCELLED) {
        throw error
      }
    }) as CancellablePromiseLike<void>

  newPromise.cancel = cancelPromise
  return newPromise
}

export const OrderItemsProvider: FC = ({ children }) => {
  const { enqueue, listen, isWaiting } = useOrderQueue()
  const { loading, orderForm, setOrderForm } = useOrderForm()

  const [updateItems] = useMutation(UpdateItems)

  const queueStatusRef = useQueueStatus(listen)
  const lastUpdateTaskRef = useRef({
    promise: undefined,
    variables: undefined,
  } as EnqueuedTask)

  if (!orderForm) {
    throw new Error('Unable to fetch order form.')
  }

  const { items, totalizers, value: orderFormValue } = orderForm

  const itemIds = useCallback(
    (props: Partial<Item>) => {
      let index = props.index
      let uniqueId = props.uniqueId

      if (index) {
        uniqueId = items[index].uniqueId as string
      } else if (uniqueId) {
        index = items.findIndex(
          (item: Item) => item.uniqueId === props.uniqueId
        ) as number
      } else {
        throw new Error(
          'Either index or uniqueId must be provided when updating an item'
        )
      }

      return { index, uniqueId }
    },
    [items]
  )

  const updateOrderForm = useCallback(
    (index: number, props: Partial<Item>) => {
      const newItem = { ...items[index], ...props }

      const updatedList = [
        ...items.slice(0, index),
        ...(props.quantity === 0 ? [] : [newItem]),
        ...items.slice(index + 1),
      ]

      setOrderForm({
        ...maybeUpdateTotalizers(
          totalizers,
          orderFormValue,
          items[index],
          newItem
        ),
        items: updatedList,
      })
    },
    [items, totalizers, orderFormValue, setOrderForm]
  )

  const mutationTask = useCallback(
    (items: Partial<Item>[]) => async () => {
      const {
        data: { updateItems: newOrderForm },
      } = await updateItems({
        variables: {
          orderItems: items,
        },
      })

      return newOrderForm
    },
    [updateItems]
  )

  const updateQuantity = useCallback(
    async (props: Partial<Item>) => {
      const { index, uniqueId } = itemIds(props)
      updateOrderForm(index, { quantity: props.quantity })
      const taskId = 'OrderItems-updateQuantity'
      let items = [{ uniqueId, quantity: props.quantity }]

      if (lastUpdateTaskRef.current.promise && isWaiting(taskId)) {
        lastUpdateTaskRef.current.promise.cancel()
        items = [
          ...lastUpdateTaskRef.current.variables.filter(
            (item: Pick<Item, 'uniqueId'>) => item.uniqueId !== uniqueId
          ),
          ...items,
        ]
      }

      lastUpdateTaskRef.current.promise = enqueueTask({
        task: mutationTask(items),
        enqueue,
        queueStatusRef,
        setOrderForm,
        taskId,
      })
      lastUpdateTaskRef.current.variables = items
    },
    [enqueue, itemIds, mutationTask, setOrderForm, updateOrderForm]
  )

  const removeItem = useCallback(
    (props: Partial<Item>) => updateQuantity({ ...props, quantity: 0 }),
    [updateQuantity]
  )

  const value = useMemo(
    () =>
      loading
        ? {
            updateQuantity: noop,
            removeItem: noop,
          }
        : { updateQuantity, removeItem },
    [loading, updateQuantity, removeItem]
  )

  return (
    <OrderItemsContext.Provider value={value}>
      {children}
    </OrderItemsContext.Provider>
  )
}

export const useOrderItems = () => {
  const context = useContext(OrderItemsContext)
  if (context === undefined) {
    throw new Error('useOrderItems must be used within a OrderItemsProvider')
  }

  return context
}

export default { OrderItemsProvider, useOrderItems }
