import PropTypes from 'prop-types'
import { Component } from 'react'

import withDataLayer, { dataLayerProps } from './withDataLayer'

class DataLayerWrapper extends Component {
  static propTypes = {
    /** Data to be pushed to the data layer. */
    data: PropTypes.object.isRequired,
    /** Loading information */
    loading: PropTypes.bool.isRequired,
    /** Function to format the data according to the data layer */
    formatToDataLayer: PropTypes.func.isRequired,
    /** Children nodes */
    children: PropTypes.node.isRequired,
    ...dataLayerProps,
  }

  pushToDataLayer = data => {
    this.props.pushToDataLayer(this.props.formatToDataLayer(data))
  }

  componentDidMount() {
    if (!this.props.loading) {
      this.pushToDataLayer(this.props.data)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.loading && !this.props.loading) {
      this.pushToDataLayer(this.props.data)
    }
  }

  render() {
    return this.props.children
  }
}

export default withDataLayer(DataLayerWrapper)
