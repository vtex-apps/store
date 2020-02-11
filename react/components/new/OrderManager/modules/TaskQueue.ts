import {
  CancellablePromiseLike,
  SequentialTaskQueue,
} from './SequentialTaskQueue'
import { QueueStatus } from '../constants'

export const TASK_CANCELLED_CODE = 'TASK_CANCELLED'

interface EnqueuedTask {
  task: () => Promise<any>
  promise: CancellablePromiseLike<any>
}

export class TaskQueue {
  private queue: SequentialTaskQueue
  private taskIdMap: Record<string, EnqueuedTask>
  private listeners: Record<QueueStatus, (() => any)[]>
  private isEmpty: boolean

  public constructor() {
    this.queue = new SequentialTaskQueue()
    this.taskIdMap = {}
    this.listeners = {} as any
    this.isEmpty = true

    this.queue.on('drained', () => {
      this.isEmpty = true
      this.emit(QueueStatus.FULFILLED)
    })
  }

  public isWaiting(id: string) {
    return !!this.taskIdMap[id]
  }

  public enqueue(task: () => Promise<any>, id?: string) {
    if (this.isEmpty) {
      this.isEmpty = false
      this.emit(QueueStatus.PENDING)
    }

    if (id && this.taskIdMap[id]) {
      this.taskIdMap[id].promise.cancel()
    }

    const wrappedTask = () => {
      if (id && this.taskIdMap[id]) {
        delete this.taskIdMap[id]
      }
      return task()
    }

    const promise = this.queue.push(wrappedTask)
    const cancelPromise = promise.cancel
    promise.cancel = () =>
      cancelPromise({
        code: TASK_CANCELLED_CODE,
      })

    if (id) {
      this.taskIdMap[id] = {
        task,
        promise,
      }
    }

    return promise
  }

  public listen(event: QueueStatus, cb: () => any) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }

    this.listeners[event].push(cb)

    const unlisten = () => {
      const index = this.listeners[event].indexOf(cb)
      if (index !== -1) {
        this.listeners[event].splice(index, 1)
      }
    }

    return unlisten
  }

  private emit(event: QueueStatus) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb())
    }
  }
}
