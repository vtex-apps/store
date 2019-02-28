import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withRuntimeContext } from 'vtex.render-runtime'

class OrderPlacedContext extends Component {
  static propTypes = {
    /** Render runtime context */
    runtime: PropTypes.shape({
      page: PropTypes.string.isRequired,
      query: PropTypes.object.isRequired,
    }),
  }

  render() {
    const {
      runtime: { query },
    } = this.props

    return React.cloneElement(this.props.children,
      {
        orderGroupId: query.og,
      })
    }
  }
export default withRuntimeContext(OrderPlacedContext)
