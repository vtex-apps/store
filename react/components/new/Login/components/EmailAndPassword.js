import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import Input from '../../Styleguide/Input'
import Button from '../../Styleguide/Button'
import { AuthStateLazy, AuthServiceLazy } from 'vtex.react-vtexid'
import { ExtensionPoint, useChildBlock } from 'vtex.render-runtime'

import { translate } from '../utils/translate'
import { isValidEmail, isValidPassword } from '../utils/format-check'
import { steps } from '../utils/steps'
import Form from './Form'
import FormError from './FormError'
import PasswordInput from './PasswordInput'
import GoBackButton from './GoBackButton'
import { USER_IDENTIFIER_INTERFACE_ID } from '../common/global'

import styles from '../styles.css'

/** EmailAndPasswordLogin component. */
class EmailAndPassword extends Component {
  static propTypes = {
    /** Next step */
    next: PropTypes.number.isRequired,
    /** Previous step */
    previous: PropTypes.number.isRequired,
    /** Set the type of password verification ui */
    showPasswordVerificationIntoTooltip: PropTypes.bool,
    /** Title to be displayed */
    title: PropTypes.string,
    /** Placeholder to email input */
    emailPlaceholder: PropTypes.string,
    /** Placeholder to password input */
    passwordPlaceholder: PropTypes.string,
    /** Function to change de active tab */
    onStateChange: PropTypes.func.isRequired,
    /** Intl object*/
    intl: intlShape,
    /** Whether to display the back button */
    showBackButton: PropTypes.bool,
    /** Function called after login success */
    loginCallback: PropTypes.func,
    /* Whether the user identifier interface has been extended */
    hasUserIdentifierExtension: PropTypes.bool,
    /** Placeholder for the identifier extension */
    identifierPlaceholder: PropTypes.string,
    /** Error message for the user identifier */
    invalidIdentifierError: PropTypes.string,
  }

  state = {
    isInvalidEmail: false,
    isInvalidPassword: false,
    isWrongCredentials: false,
    isUserBlocked: false,
    userIdentifierExtensionSubmitter: null,
  }

  handlePasswordChange = () => {
    this.setState({ isInvalidPassword: false, isWrongCredentials: false })
  }

  handleCreatePassword = event => {
    this.props.onStateChange({
      step: steps.EMAIL_VERIFICATION,
      isCreatePassword: true,
      isOnInitialScreen: false,
    })
    event.preventDefault()
  }

  handleSuccess = () => {
    this.props.loginCallback()
  }

  handleFailure = err => {
    err.code === 'WrongCredentials'
      ? this.setState({ isWrongCredentials: true })
      : err.code === 'BlockedUser'
        ? this.setState({ isUserBlocked: true })
        : console.error(err)
  }

  registerUserIdentifierExtensionSubmitter = userIdentifierExtensionSubmitter => {
    this.setState({ userIdentifierExtensionSubmitter })
  }

  trySubmit = (email, password, login) => {
    if (!isValidEmail(email)) {
      this.setState({ isInvalidEmail: true })
    } else if (!isValidPassword(password)) {
      this.setState({ isInvalidPassword: true })
    } else {
      login()
    }
  }

  handleOnSubmit = async (email, password, login, setEmail) => {
    if (this.state.userIdentifierExtensionSubmitter) {
      const emailResult = await this.state.userIdentifierExtensionSubmitter()
      setEmail(emailResult, () => {
        this.trySubmit(emailResult, password, login)
      })
    } else {
      this.trySubmit(email, password, login)
    }
  }

  render() {
    const {
      title,
      intl,
      onStateChange,
      previous,
      showBackButton,
      emailPlaceholder,
      passwordPlaceholder,
      showPasswordVerificationIntoTooltip,
      hasUserIdentifierExtension,
      identifierPlaceholder,
      invalidIdentifierError,
    } = this.props

    const {
      isInvalidEmail,
      isInvalidPassword,
      isWrongCredentials,
      isUserBlocked,
    } = this.state

    return (
      <Form
        className={`${styles.emailVerification} ${styles.emailAndPasswordForm} w-100`}
        title={title || translate('store/loginOptions.emailAndPassword', intl)}
        onSubmit={e => this.handleOnSubmit(e)}
        content={
          <Fragment>
            <div className={`${styles.inputContainer} ${styles.inputContainerEmail}`}>
              <AuthStateLazy.Email>
                {({ value, setValue }) => {
                  if (hasUserIdentifierExtension) {
                    return (
                      <ExtensionPoint
                        id={USER_IDENTIFIER_INTERFACE_ID}
                        identifierPlaceholder={
                          identifierPlaceholder || emailPlaceholder
                        }
                        renderInput={({ value, onChange, placeholder }) => (
                          <Input
                            value={value}
                            onChange={e => {
                              onChange(e)
                              this.setState({ isInvalidEmail: false })
                            }}
                            placeholder={placeholder}
                          />
                        )}
                        registerSubmitter={
                          this.registerUserIdentifierExtensionSubmitter
                        }
                      />
                    )
                  }
                  return (
                    <Input
                      value={value || ''}
                      onChange={e => {
                        setValue(e.target.value)
                        this.setState({ isInvalidEmail: false })
                      }}
                      placeholder={
                        emailPlaceholder ||
                        translate('store/login.email.placeholder', intl)
                      }
                    />
                  )
                }}
              </AuthStateLazy.Email>
            </div>
            <FormError show={isInvalidEmail}>
              {invalidIdentifierError ||
                translate('store/login.invalidEmail', intl)}
            </FormError>
            <div className={`${styles.inputContainer} ${styles.inputContainerPassword} pv3 flex flex-column`}>
              <AuthStateLazy.Password>
                {({ value, setValue }) => (
                  <PasswordInput
                    password={value || ''}
                    onStateChange={({ password }) => {
                      setValue(password)
                      this.handlePasswordChange()
                    }}
                    placeholder={
                      passwordPlaceholder ||
                      translate('store/login.password.placeholder', intl)
                    }
                    showPasswordVerificationIntoTooltip={
                      showPasswordVerificationIntoTooltip
                    }
                  />
                )}
              </AuthStateLazy.Password>
            </div>
            <FormError show={isInvalidPassword}>
              {translate('store/login.invalidPassword', intl)}
            </FormError>
            <FormError show={isWrongCredentials}>
              {translate('store/login.wrongCredentials', intl)}
            </FormError>
            <FormError show={isUserBlocked}>
              {translate('store/login.userBlocked', intl)}
            </FormError>
            <div
              className={`${styles.formLinkContainer} flex justify-end ph0 pv2`}
            >
              <a
                href=""
                className="link dim c-link"
                onClick={this.handleCreatePassword}
              >
                <span className="t-small">
                  {translate('store/login.forgotPassword', intl)}
                </span>
              </a>
            </div>
          </Fragment>
        }
        footer={
          <Fragment>
            {showBackButton && (
              <GoBackButton
                onStateChange={onStateChange}
                changeTab={{ step: previous }}
              />
            )}
            <div className={`${styles.sendButton} ml-auto`}>
              <AuthServiceLazy.LoginWithPassword
                useNewSession
                onSuccess={this.handleSuccess}
                onFailure={this.handleFailure}
              >
                {({
                  state: { email, password },
                  loading,
                  action: loginWithPassword,
                }) => (
                  <AuthStateLazy.Email>
                    {({ setValue: setEmail }) => (
                      <Button
                        variation="primary"
                        size="small"
                        type="submit"
                        onClick={e => {
                          e.preventDefault()
                          this.handleOnSubmit(
                            email,
                            password,
                            loginWithPassword,
                            setEmail
                          )
                        }}
                        isLoading={loading}
                      >
                        <span className="t-small">
                          {translate('store/login.signIn', intl)}
                        </span>
                      </Button>
                    )}
                  </AuthStateLazy.Email>
                )}
              </AuthServiceLazy.LoginWithPassword>
            </div>
          </Fragment>
        }
      >
        <div
          className={`${styles.formLinkContainer} flex justify-center ph0 mt4`}
        >
          <a
            href=""
            className="link dim c-link"
            onClick={e => this.handleCreatePassword(e)}
          >
            <span className="t-small">
              {translate('store/login.notHaveAccount', intl)}
            </span>
          </a>
        </div>
      </Form>
    )
  }
}

const withHasUserIdentifierExtension = Component => {
  const Wrapper = props => {
    const hasUserIdentifierExtension = !!useChildBlock({
      id: USER_IDENTIFIER_INTERFACE_ID,
    })
    return (
      <Component
        {...props}
        hasUserIdentifierExtension={hasUserIdentifierExtension}
      />
    )
  }
  return Wrapper
}

export default withHasUserIdentifierExtension(injectIntl(EmailAndPassword))
