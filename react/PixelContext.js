import hoistNonReactStatics from 'hoist-non-react-statics'
import React, { Component } from 'react'
import { withRuntimeContext } from 'render'

const PixelContext = React.createContext()

const SUBSCRIPTION_TIMEOUT = 100

/**
 * Pixel it's the HOC Component that provides an event subscription to the
 * Wrapped Component. This component will be used by the installed apps.
 */
export function Pixel(WrappedComponent) {
  const Pixel = () => (
    <PixelContext.Consumer>
      {({ subscribe }) => <WrappedComponent {...this.props} subscribe={subscribe} />}
    </PixelContext.Consumer>
  )

  Pixel.displayName = 'Pixel'

  return hoistNonReactStatics(Pixel, WrappedComponent)
}

/**
 * HOC Component that has the Pixel logic, dispatching store events
 * to the subscribed external components.
 */
export function pixelProvider(WrappedComponent) {
  class PixelProvider extends Component {
    state = {
      subscribers: [],
    }

    /**
     * Ensure that the Data Layer exists and will be recreated
     * after each children change (navigation).
     */
    initDataLayer = () => {
      const { dataLayer } = window
      if (dataLayer) {
        dataLayer.splice(0, dataLayer.length)
      } else {
        window.dataLayer = []
      }
    }

    notifySubscribers = data => {
      this.state.subscribers.forEach(subscriber => {
        if (subscriber[data.event]) {
          subscriber[data.event](data)
        }
      })
    }

    push = data => {
      const notifyAndPush = () => {
        this.notifySubscribers(data)
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push(data)
      }

      if (this.state.subscribers.length === 0) {
        setTimeout(notifyAndPush, SUBSCRIPTION_TIMEOUT)
      } else {
        notifyAndPush()
      }
    }

    subscribe = subscriber => {
      if (subscriber) {
        this.setState(state => ({
          subscribers: [subscriber, ...state.subscribers],
        }))
      }
    }

    render() {
      this.initDataLayer()

      return (
        <PixelContext.Provider value={{
          subscribe: this.subscribe,
        }}>
          <WrappedComponent {...this.props} push={this.push} />
        </PixelContext.Provider>
      )
    }
  }

  return hoistNonReactStatics(
    withRuntimeContext(PixelProvider),
    WrappedComponent
  )
}

export default { Pixel }
