import hoistNonReactStatics from 'hoist-non-react-statics'
import React, { Component } from 'react'
import { withRuntimeContext } from 'render'

const SUBSCRIPTION_TIMEOUT = 100

type EventType = 'productView' | 'addToCart' | 'removeFromCart'

interface PixelData {
  event?: EventType
  [data: string]: any
}

type PixelEventHandler = (data: PixelData) => void

interface Subscriber {
  productView: PixelEventHandler
  addToCart: PixelEventHandler
  removeFromCart: PixelEventHandler
}

interface ContextType {
  subscribe: (s: Subscriber) => () => void
}

const PixelContext = React.createContext<ContextType>({
  subscribe: () => () => undefined,
})

/**
 * Pixel it's the HOC Component that provides an event subscription to the
 * Wrapped Component. This component will be used by the installed apps.
 */
export function Pixel(WrappedComponent: React.ComponentType<{} & ContextType>) {
  const PixelComponent: React.StatelessComponent<{}> = props => (
    <PixelContext.Consumer>
      {({ subscribe }) => <WrappedComponent {...props} subscribe={subscribe} />}
    </PixelContext.Consumer>
  )

  PixelComponent.displayName = 'Pixel'

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

  public notifySubscribers = (data: PixelData) => {
    this.state.subscribers.forEach(subscriber => {
      if (data.event && subscriber[data.event]) {
        const eventHandler = subscriber[data.event] as PixelEventHandler
        eventHandler(data)
      }
    })
  }

  public push = (data: PixelData) => {
    const notifyAndPush = () => {
      this.notifySubscribers(data)
    }

    if (this.state.subscribers.length === 0) {
      setTimeout(notifyAndPush, SUBSCRIPTION_TIMEOUT)
    } else {
      notifyAndPush()
    }
  }

  public subscribe = (subscriber: Subscriber) => {
    if (subscriber) {
      this.setState(state => ({
        subscribers: [subscriber, ...state.subscribers],
      }))
    }

    return () => {
      this.setState(state => ({
        subscribers: state.subscribers.filter(sub => sub === subscriber),
      }))
    }
  }

  public render() {
    return (
      <PixelContext.Provider value={{
        subscribe: this.subscribe,
      }}>
        {this.props.children}
      </PixelContext.Provider>
    )
  }
}

export default { Pixel }
