import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Services, Validations } from '../utils'
import Context from '../context'
import getError from '../utils/getError'
// import ReCAPTCHA from './ReCAPTCHA'

export default class SendAccessKey extends Component {
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
  }

  sendToken = async ({
    user,
    locale,
    recaptcha,
    setGlobalLoading,
    withSession,
    parentAppId,
  }) => {
    const { useNewSession, onSuccess, onFailure } = this.props
    this.setState({ loading: true })
    setGlobalLoading(true)
    return (useNewSession
      ? withSession(() =>
          Services.sendVerificationCode({
            email: user.email,
            locale,
            recaptcha,
            parentAppId,
          })
        )
      : Services.sendVerificationCode({
          email: user.email,
          locale,
          recaptcha,
          parentAppId,
        })
    )
      .then(() => {
        this.setState({ loading: false }, () => {
          return setGlobalLoading(false, () => onSuccess(user))
        })
      })
      .catch(error => {
        this.setState({ loading: false }, () => {
          setGlobalLoading(false, () => onFailure(getError(error)))
        })
      })
  }

  render() {
    return (
      <Context.Consumer>
        {({
          state: globalState,
          handlers: { setGlobalLoading, withSession },
          parentAppId,
        }) =>
          this.props.children({
            state: {
              email: globalState.email,
              token: globalState.token,
              recaptcha: globalState.recaptcha,
            },
            loading: this.state.loading,
            action: ({ email, preference, recaptcha } = {}) =>
              this.sendToken({
                user: {
                  email: email || globalState.email,
                  ...(preference && { preference }),
                },
                locale: globalState.locale,
                recaptcha: recaptcha || globalState.recaptcha,
                setGlobalLoading,
                withSession,
                parentAppId,
              }),
            validation: Validations,
          })
        }
      </Context.Consumer>
    )
  }
}
