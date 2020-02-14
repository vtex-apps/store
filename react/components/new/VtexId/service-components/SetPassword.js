import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Services, Validations, Constants } from '../utils'
const { ApiAuthStatus: API_AUTH_STATUS } = Constants
import Context from '../context'
import getError from '../utils/getError'

export default class SetPassword extends Component {
  static propTypes = {
    onSuccess: PropTypes.func,
    onFailure: PropTypes.func,
    children: PropTypes.func.isRequired,
  }

  static defaultProps = {
    onSuccess: () => {},
    onFailure: () => {},
  }

  state = {
    loading: false,
    error: null,
  }

  setPassword = ({
    email,
    password,
    currentPassword,
    token,
    recaptcha,
    setGlobalLoading,
    parentAppId,
  }) => {
    const { onSuccess, onFailure } = this.props
    return Services.setPassword({
      login: email,
      newPassword: password,
      currentPassword,
      accesskey: token,
      recaptcha,
      parentAppId,
    })
      .then(({ authStatus } = { authStatus: 'UnexpectedError' }) => {
        this.setState({ loading: false }, () => {
          if (authStatus === API_AUTH_STATUS.Success) {
            return setGlobalLoading(false, onSuccess)
          }
          return setGlobalLoading(false, () => onFailure({ authStatus }))
        })
      })
      .catch(error => {
        this.setState({ loading: false, error }, () => {
          setGlobalLoading(false, () => onFailure(getError(error)))
        })
      })
  }

  render() {
    return (
      <Context.Consumer>
        {({
          state: { email, password, currentPassword, token },
          handlers: { setGlobalLoading },
          parentAppId,
        }) =>
          this.props.children({
            state: { email, password, currentPassword, token },
            loading: this.state.loading,
            action: () => {
              this.setState({ loading: true })
              setGlobalLoading(true)
              return this.setPassword({
                email,
                password,
                currentPassword,
                token,
                recaptcha: null,
                setGlobalLoading,
                parentAppId,
              })
            },
            validation: Validations,
          })
        }
      </Context.Consumer>
    )
  }
}
