import React, { Component } from '../../../../Library/Caches/typescript/2.9/node_modules/@types/react'
import PropTypes from '../../../../Library/Caches/typescript/2.9/node_modules/@types/prop-types'

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

