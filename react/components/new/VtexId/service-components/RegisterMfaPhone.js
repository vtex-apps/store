import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Services, Validations, Constants } from '../utils'
const { ApiAuthStatus: API_AUTH_STATUS } = Constants
import Context from '../context'

export default class RegisterMfaPhone extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    onFailure: PropTypes.func,
    useNewSession: PropTypes.bool,
  }

  static defaultProps = {
    onSuccess: () => {},
    onFailure: () => {},
    useNewSession: false,
  }

  state = {
    loading: false,
    error: null,
  }

  registerMfaPhoneNumber = ({
    phoneNumber,
    recaptcha,
    setGlobalLoading,
    parentAppId,
  }) => {
    const { useNewSession, onSuccess, onFailure } = this.props
    return (useNewSession
      ? Services.withMfaSession(
          () =>
            Services.registerMfaPhoneNumber({
              phoneNumber,
              recaptcha,
              parentAppId,
            }),
          { parentAppId }
        )
      : Services.registerMfaPhoneNumber({
          phoneNumber,
          recaptcha,
          parentAppId,
        })
    )
      .then(({ authStatus }) => {
        this.setState({ loading: false }, () => {
          if (authStatus === API_AUTH_STATUS.Pending) {
            setGlobalLoading(false, onSuccess)
            return
          }
          setGlobalLoading(false, () => onFailure({ authStatus }))
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
          state: { phoneNumber },
          handlers: { setGlobalLoading },
          parentAppId,
        }) =>
          this.props.children({
            state: { phoneNumber },
            loading: this.state.loading,
            action: () => {
              this.setState({ loading: true }, () =>
                setGlobalLoading(true, () =>
                  this.registerMfaPhoneNumber({
                    phoneNumber,
                    recaptcha: null,
                    setGlobalLoading,
                    parentAppId,
                  })
                )
              )
            },
            validation: Validations,
          })
        }
      </Context.Consumer>
    )
  }
}
