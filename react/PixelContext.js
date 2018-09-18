import React, { Component } from 'react'

const PixelContext = React.createContext()

const SUBSCRIPTION_TIMEOUT = 100

export function Pixel(WrappedComponent) {
  return class Pixel extends Component {

    renderComponent = context => {
      return (
        <WrappedComponent subscribe={context.subscribe} context={context}/>
      )
    }

    render() {
      return (
        <PixelContext.Consumer>
          {context => this.renderComponent(context)}
        </PixelContext.Consumer>
      )
    }
  }
}

export function pixelGlobalContext(WrappedComponent) {
  return class WithPixel extends Component {

    constructor(props) {
      super(props)
      this.state = {
        subscribers: []
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
        this.setState({
          subscribers: [subscriber, ...this.state.subscribers]
        })
      }
    }

    render() {
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
}

export default { Pixel }