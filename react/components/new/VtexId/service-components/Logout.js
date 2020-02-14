import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Services } from '../utils'
import Context from '../context'

export default class Logout extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    onFailure: PropTypes.func,
  }

  static defaultProps = {
    redirect: false,
    onSuccess: () => {},
    onFailure: () => {},
  }

  state = {
    loading: false,
  }

  logout = ({ setGlobalLoading, parentAppId }) => {
    const { onSuccess, onFailure } = this.props
    return Services.logout({ parentAppId })
      .then(() => {
        this.setState({ loading: false }, () => {
          return setGlobalLoading(false, onSuccess)
        })
      })
      .catch(error => {
        this.setState({ loading: false }, () => {
          setGlobalLoading(false, () => onFailure(error))
        })
      })
  }

  render() {
    return (
      <Context.Consumer>
        {({ handlers: { setGlobalLoading }, parentAppId }) =>
          this.props.children({
            loading: this.state.loading,
            action: () =>
              this.setState({ loading: true }, () =>
                setGlobalLoading(true, () =>
                  this.logout({ setGlobalLoading, parentAppId })
                )
              ),
          })
        }
      </Context.Consumer>
    )
  }
}
