import PropTypes from 'prop-types'
import { Component } from 'react'

import withDataLayer, { dataLayerProps } from './withDataLayer'

class DataLayerApolloWrapper extends Component {
  static propTypes = {
    /** Is the query loading */
    loading: PropTypes.bool.isRequired,
    /** Function to format the data according to the data layer */
    getData: PropTypes.func.isRequired,
    /** Children nodes */
    children: PropTypes.node.isRequired,
    ...dataLayerProps,
  }

  updateDataLayer() {
    const data = this.props.getData()

    if (!data) {
      return
    }

    if (Array.isArray(data)) {
      data.forEach(this.props.set)
    } else {
      this.props.set(data)
    }
  }

  componentDidMount() {
    if (!this.props.loading) {
      this.updateDataLayer()
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.loading && !this.props.loading) {
      this.updateDataLayer()
    }
  }

  render() {
    return this.props.children
  }
}

export default withDataLayer(DataLayerApolloWrapper)
