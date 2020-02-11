import React, { FunctionComponent, useEffect } from 'react'
import { act, fireEvent, render } from '@vtex/test-tools/react'

import { QueueStatus } from '../constants'
import {
  OrderQueueProvider,
  useOrderQueue,
  useQueueStatus,
} from '../OrderQueue'

const createScheduledTask = (task: () => any, time: number) => () =>
  new Promise(resolve => {
    setTimeout(() => resolve(task()), time)
  })

describe('OrderQueue', () => {
  it('should throw when useOrderQueue is called outside a OrderQueueProvider', () => {
    const oldConsoleError = console.error
    console.error = () => {}

    const Component: FunctionComponent = () => {
      useOrderQueue()
      return <div>foo</div>
    }

    expect(() => render(<Component />)).toThrow(
      'useOrderQueue must be used within a OrderQueueProvider'
    )

    console.error = oldConsoleError
  })

  it('should run tasks in order', async () => {
    const results: string[] = []
    const tasks: PromiseLike<any>[] = []

    const InnerComponent: FunctionComponent = () => {
      const { enqueue } = useOrderQueue()
      useEffect(() => {
        tasks.push(enqueue(createScheduledTask(() => results.push('1'), 10)))
        tasks.push(enqueue(createScheduledTask(() => results.push('2'), 5)))
        tasks.push(enqueue(createScheduledTask(() => results.push('3'), 5)))
      }, [enqueue])
      return <div>foo</div>
    }

    const OuterComponent: FunctionComponent = () => (
      <OrderQueueProvider>
        <InnerComponent />
      </OrderQueueProvider>
    )

    render(<OuterComponent />)

    await Promise.all(tasks)
    expect(results).toEqual(['1', '2', '3'])
  })

  it('should keep the ref returned by useQueueStatus updated', async () => {
    let queueStatusRef: any = null
    let task = null

    const Component: FunctionComponent = () => {
      const { enqueue, listen } = useOrderQueue()
      queueStatusRef = useQueueStatus(listen)

      const handleClick = () => {
        task = enqueue(createScheduledTask(() => {}, 10))
      }

      return <button onClick={handleClick}>enqueue</button>
    }

    const { getByText } = render(
      <OrderQueueProvider>
        <Component />
      </OrderQueueProvider>
    )

    expect(queueStatusRef).toBeDefined()
    expect(queueStatusRef.current).toEqual(QueueStatus.FULFILLED)

    const button = getByText('enqueue')
    act(() => {
      fireEvent.click(button)
    })
    expect(queueStatusRef.current).toEqual(QueueStatus.PENDING)

    await task
    expect(queueStatusRef.current).toEqual(QueueStatus.FULFILLED)
  })
})
