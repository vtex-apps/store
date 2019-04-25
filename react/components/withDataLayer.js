import hoistNonReactStatics from 'hoist-non-react-statics'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Pixel } from 'vtex.pixel-manager/PixelContext'

const { Consumer, Provider } = React.createContext({
  dataLayer: [],
})

export { Provider as DataLayerProvider }

/**
 * Data layer context consumer, for new components use the Pixel interface.
 *
 * @deprecated
 */
export default function withDataLayer(WrappedComponent) {
  class DataLayer extends Component {
    static displayName = `DataLayer(${WrappedComponent.displayName ||
      WrappedComponent.name})`

    static propTypes = {
      push: PropTypes.func.isRequired,
      subscribe: PropTypes.func.isRequired,
    }

    render() {
      const {
        push,
        subscribe, // eslint-disable-line no-unused-vars
        ...props
      } = this.props

      // Use the push function from the pixel for backward-compatibility
      return (
        <Consumer>
          {context => <WrappedComponent {...props} {...context} set={push} />}
        </Consumer>
      )
    }
  }

  return hoistNonReactStatics(Pixel(DataLayer), WrappedComponent)
}

export const dataLayerProps = {
  dataLayer: PropTypes.array.isRequired,
  set: PropTypes.func.isRequired,
}
