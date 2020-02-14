import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Services, Validations } from '../utils'
import Context from '../context'

export default class ResendMfaToken extends Component {
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
    error: null,
  }

  resendMfaToken = ({ recaptcha, setGlobalLoading, parentAppId }) => {
    const { onSuccess, onFailure } = this.props
    return Services.resendMfa({ recaptcha, parentAppId })
      .then(({ authStatus }) => {
        this.setState({ loading: false }, () => {
          if (authStatus === 'Pending') {
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
            ...this.state,
            action: () =>
              this.setState({ loading: true }, () =>
                setGlobalLoading(true, () =>
                  this.resendMfaToken({
                    recaptcha: null,
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
