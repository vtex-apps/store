import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Validations } from '../utils'
import Context from '../context'

class Token extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    handleTokenChange: PropTypes.func.isRequired,
    token: PropTypes.string,
  }

  componentWillUnmount = () => this.props.handleTokenChange('')

  render() {
    const { children, token, handleTokenChange } = this.props
    return children({
      value: token,
      setValue: handleTokenChange,
      validation: Validations,
    })
  }
}

const TokenWrapper = props => (
  <Context.Consumer>
    {({ state: { token }, handlers: { handleTokenChange } }) => (
      <Token {...props} token={token} handleTokenChange={handleTokenChange} />
    )}
  </Context.Consumer>
)

export default TokenWrapper
