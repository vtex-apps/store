import React, { Component } from 'react'
import { withRuntimeContext } from 'render'

const PixelContext = React.createContext()

const SUBSCRIPTION_TIMEOUT = 100

/**
 * Pixel it's the HOC Component that provides an event subscription to the
 * Wrapped Component. This component will be used by the installed apps.
 */
export function Pixel(WrappedComponent) {
  return class Pixel extends Component {
    
    renderComponent = context => (
      <WrappedComponent subscribe={context.subscribe} context={context}/>
    )
    
    render() {
      return (
        <PixelContext.Consumer>
          {context => this.renderComponent(context)}
        </PixelContext.Consumer>
      )
    }
  }
}

/**
 * HOC Component that has the Pixel logic, dispatching store events
 * to the subscribed external components.
 */
export function pixelGlobalContext(WrappedComponent) {
  class WithPixel extends Component {
    
    constructor(props) {
      super(props)
      this.state = {
        subscribers: []
      }
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
          ...state,
          subscribers: [subscriber, ...state.subscribers]
        }))
      }
    }

    render() {
      this.initDataLayer()
      return (
        <PixelContext.Provider value={{
            subscribe: this.subscribe,
            ...this.state
          }}
        >
          <WrappedComponent {...this.props} push={this.push} />
        </PixelContext.Provider>
      )
    }
  }
  return withRuntimeContext(WithPixel)
}

export default { Pixel }