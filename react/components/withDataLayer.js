import React, { Component } from 'react'
import PropTypes from 'prop-types'

const { Consumer, Provider } = React.createContext({
  dataLayer: [],
  set: () => {},
})

export { Provider as DataLayerProvider }

export default function withDataLayer(WrappedComponent) {
  return class DataLayer extends Component {
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
}

export const dataLayerProps = {
  dataLayer: PropTypes.array.isRequired,
  set: PropTypes.func.isRequired,
}

