import { Component } from 'react'

export const withPixel = (WrappedComponent) => {
  return class Pixel extends Component {
    
    push(data) {
      console.log(">>> push: ", data)
      window.dataLayer.push(data)
    }

    render() {
      return (
        <WrappedComponent {...this.props} push={this.push} />
      )
    }
  }
}