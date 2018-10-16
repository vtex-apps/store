import hoistNonReactStatics from 'hoist-non-react-statics'
import React, { Component } from 'react'
import { withRuntimeContext } from 'render'

const SUBSCRIPTION_TIMEOUT = 100

type EventType = 'productView'
  | 'otherView'
  | 'categoryView'
  | 'departmentView'
  | 'internalSiteSearchView'
  | 'pageInfo'
  | 'pageView'

interface PixelData {
  event?: EventType
  [data: string]: any
}

type PixelEventHandler = (data: PixelData) => void

interface Subscriber {
  productView?: PixelEventHandler
  categoryView?: PixelEventHandler
  departmentView?: PixelEventHandler
  internalSiteSearchView?: PixelEventHandler
  otherView?: PixelEventHandler
  pageInfo?: PixelEventHandler
  pageView?: PixelEventHandler
}

interface ContextType {
  subscribe: (s: Subscriber) => () => void
  push: (data: PixelData) => void
}

const PixelContext = React.createContext<ContextType>({
  push: () => undefined,
  subscribe: () => () => undefined,
})

/**
 * Pixel is the HOC Component that provides an event subscription to the
 * Wrapped Component. This component will be used by the installed apps.
 */
export function Pixel(WrappedComponent: React.ComponentType<{} & ContextType>) {
  const PixelComponent: React.StatelessComponent<{}> = props => (
    <PixelContext.Consumer>
      {({ subscribe, push }) =>
        <WrappedComponent
          {...props}
          push={push}
          subscribe={subscribe}
        />
      }
    </PixelContext.Consumer>
  )

  PixelComponent.displayName = `withPixel(${WrappedComponent.displayName})`

  return hoistNonReactStatics(PixelComponent, WrappedComponent)
}

interface ProviderState {
  subscribers: Subscriber[],
}

/**
 * HOC Component that has the Pixel logic, dispatching store events
 * to the subscribed external components.
 */
export class PixelProvider extends Component<{}, ProviderState> {
  public state = {
    subscribers: [],
  }

  /**
   * Notify all subscribers that have a valid event handler
   * defined for the corresponding data
   */
  public notifySubscribers = (data: PixelData) => {
    this.state.subscribers.forEach(subscriber => {
      if (data.event && subscriber[data.event]) {
        const eventHandler = subscriber[data.event] as PixelEventHandler
        eventHandler(data)
      }
    })
  }

  /**
   * Notify all subscribers of a event data
   */
  public push = (data: PixelData) => {
    const notifyAndPush = () => {
      this.notifySubscribers(data)
      if (window.dataLayer) {
        window.dataLayer.push(data)
      }
    }

    if (this.state.subscribers.length === 0) {
      setTimeout(notifyAndPush, SUBSCRIPTION_TIMEOUT)
    } else {
      notifyAndPush()
    }
  }

  /**
   * Subscribe to all pixel events
   *
   * @returns {Function} Unsubscribe function
   */
  public subscribe = (subscriber: Subscriber) => {
    if (subscriber) {
      this.setState(state => ({
        subscribers: [subscriber, ...state.subscribers],
      }))
    }

    return () => {
      this.setState(state => ({
        subscribers: state.subscribers.filter(sub => sub !== subscriber),
      }))
    }
  }

  public render() {
    return (
      <PixelContext.Provider
        value={{
          push: this.push,
          subscribe: this.subscribe,
        }}
      >
        {this.props.children}
      </PixelContext.Provider>
    )
  }
}

export default { Pixel }
