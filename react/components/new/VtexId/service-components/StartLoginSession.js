import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Services, Validations } from '../utils'
import Context from '../context'

export default class StartLoginSession extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    onFailure: PropTypes.func,
  }

  static defaultProps = {
    onSuccess: () => {},
    onFailure: () => {},
  }

  state = {
    loading: false,
  }

  startSession = ({
    accountName,
    returnUrl,
    scope,
    user,
    setGlobalLoading,
    parentAppId,
  }) => {
    const { onSuccess, onFailure } = this.props
    return Services.startSession({
      accountName,
      returnUrl,
      scope,
      user,
      parentAppId,
    })
      .then(() => {
        this.setState({ loading: false }, () => {
          return setGlobalLoading(false, onSuccess)
        })
      })
      .catch(error => {
        console.log(error)
        this.setState({ loading: false, error }, () => {
          setGlobalLoading(false, () => onFailure(error))
        })
      })
  }

  render() {
    return (
      <Context.Consumer>
        {({
          state: { account, returnUrl, scope, email },
          handlers: { setGlobalLoading },
          parentAppId,
        }) =>
          this.props.children({
            state: { email },
            loading: this.state.loading,
            action: () =>
              this.setState({ loading: true }, () =>
                setGlobalLoading(true, () =>
                  this.startSession({
                    accountName: account,
                    returnUrl,
                    scope,
                    user: email,
                    setGlobalLoading,
                    parentAppId,
                  })
                )
              ),
            validation: Validations,
          })
        }
      </Context.Consumer>
    )
  }
}
