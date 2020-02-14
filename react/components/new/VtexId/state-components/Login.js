import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Validations } from '../utils'
import Context from '../context'

export default class VtexIdConsumer extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
  }

  render() {
    return (
      <Context.Consumer>
        {({ state, handlers }) =>
          this.props.children(state, handlers, Validations)
        }
      </Context.Consumer>
    )
  }
}
