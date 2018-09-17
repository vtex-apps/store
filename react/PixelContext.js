import React, { Component } from 'react'

const PixelContext = React.createContext()

export const Pixel = (WrappedComponent) => {
  return class Pixel extends Component {
    constructor(props) {
      super(props)
    }

    renderComponent = (context) => {
      return (
        <WrappedComponent subscribe={context.subscribe} context={context}/>
      )
    }

    render() {
      return (
        <PixelContext.Consumer>
          {(context) => this.renderComponent(context)}
        </PixelContext.Consumer>
      )
    }
  }
}

export const pixelGlobalContext = (WrappedComponent) => {
  return class WithPixel extends Component {

    constructor(props) {
      super(props)
      this.state = {
        subscribers: []
      }
    }

    notifySubscribers = (data) => {
      this.state.subscribers.forEach(subscriber => {
        if (subscriber[data.event]) {
          subscriber[data.event](data)
        }
      })
    }
    
    push = (data) => {
      const notifyAndPush = () => {
        this.notifySubscribers(data)
        window.dataLayer.push(data)
      }

      if (this.state.subscribers.length === 0) {
        setTimeout(notifyAndPush, 100)
      } else {
        notifyAndPush()
      }
    }
    
    subscribe = (subscriber) => {
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
        }}>
          <WrappedComponent {...this.props} push={this.push} />
        </PixelContext.Provider>
      )
    }
  }
}

export default { Pixel }