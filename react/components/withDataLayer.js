import React, { Component } from 'react'
import PropTypes from 'prop-types'
import hoistNonReactStatics from 'hoist-non-react-statics'

const { Consumer, Provider } = React.createContext({
  dataLayer: [],
  set: () => {},
})

export { Provider as DataLayerProvider }

export default function withDataLayer(WrappedComponent) {
  class DataLayer extends Component {
    static displayName =
      `DataLayer(${WrappedComponent.displayName || WrappedComponent.name})`

    render() {
      return (
        <Consumer>
          {context => (
            <WrappedComponent {...this.props} {...context} />
          )}
        </Consumer>
      )
    }
  }

  return hoistNonReactStatics(DataLayer, WrappedComponent)
}

export const dataLayerProps = {
  dataLayer: PropTypes.array.isRequired,
  set: PropTypes.func.isRequired,
}

