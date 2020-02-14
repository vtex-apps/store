import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Services, Validations, Constants } from '../utils'
import getError from '../utils/getError'
const { ApiAuthStatus: API_AUTH_STATUS } = Constants
import Context from '../context'

class ValidateMfa extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    setGlobalLoading: PropTypes.func.isRequired,
    handleTokenChange: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    onFailure: PropTypes.func,
    token: PropTypes.string,
    parentAppId: PropTypes.string,
  }

  static defaultProps = {
    onSuccess: () => {},
    onFailure: () => {},
  }

  state = {
    loading: false,
    error: null,
  }

  componentWillUnmount() {
    this.props.handleTokenChange('')
  }

  validateMfa = () => {
    const {
      token,
      onSuccess,
      onFailure,
      setGlobalLoading,
      parentAppId,
    } = this.props
    return Services.validateMfa({ mfaToken: token, parentAppId })
      .then(({ authStatus }) => {
        this.setState({ loading: false }, () => {
          if (authStatus === API_AUTH_STATUS.Success) {
            setGlobalLoading(false, onSuccess)
            return
          }
          setGlobalLoading(false, () => onFailure(getError({ authStatus })))
        })
      })
      .catch(errorCode => {
        this.setState({ loading: false }, () => {
          setGlobalLoading(false, () => onFailure(getError(errorCode)))
        })
      })
  }

  render() {
    const { token, children, setGlobalLoading } = this.props
    return children({
      state: { token },
      loading: this.state.loading,
      validation: Validations,
      action: () =>
        this.setState({ loading: true }, () =>
          setGlobalLoading(true, () => this.validateMfa())
        ),
    })
  }
}

const Wrapper = props => (
  <Context.Consumer>
    {({
      state: { token },
      handlers: { setGlobalLoading, handleTokenChange },
      parentAppId,
    }) => (
      <ValidateMfa
        {...props}
        token={token}
        setGlobalLoading={setGlobalLoading}
        handleTokenChange={handleTokenChange}
        parentAppId={parentAppId}
      />
    )}
  </Context.Consumer>
)

export default Wrapper
