import React, { Component, Fragment } from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'ramda'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import Input from '../../../Styleguide/Input'
import Button from '../../../Styleguide/Button'
import withCssHandles from '../../../CssHandles/withCssHandles'
import SUBSCRIBE_NEWSLETTER from './mutations/subscribeNewsletter.graphql'
import formatIOMessage from '../../../NativeTypes/formatIOMessage'

const EMAIL_REGEX = /^[A-z0-9+_-]+(?:\.[A-z0-9+_-]+)*@(?:[A-z0-9](?:[A-z0-9-]*[A-z0-9])?\.)+[A-z0-9](?:[A-z0-9-]*[A-z0-9])?$/
const CSS_HANDLES = [
  'newsletter',
  'confirmation',
  'container',
  'confirmationTitle',
  'confirmationText',
  'form',
  'inputGroup',
  'buttonContainer',
  'label',
  'error',
]

class Newsletter extends Component {
  state = {
    email: '',
    loading: false,
    error: null,
    success: null,
    invalidEmail: false,
  }

  inputRef = React.createRef()

  componentDidMount() {
    this.mounted = true
  }

  componentWillUnmount() {
    this.mounted = false
  }

  safeSetState(...params) {
    if (this.mounted) {
      this.setState(...params)
    }
  }

  handleChangeEmail = e => {
    this.setState({ email: e.target.value })
  }

  validateEmail = () => {
    return EMAIL_REGEX.test(this.state.email)
  }

  handleSubmit = e => {
    e.preventDefault()
    if (!this.validateEmail()) {
      this.setState({ invalidEmail: true })
      if (this.inputRef && this.inputRef.current) {
        this.inputRef.current.focus()
      }
      return
    }

    this.setState({
      invalidEmail: false,
      loading: true,
      error: null,
      success: null,
    })

    this.props
      .subscribeNewsletter({ variables: { email: this.state.email } })
      .then(() => {
        this.safeSetState({ success: true, loading: false })
      })
      .catch(e => {
        this.safeSetState({ error: true, loading: false })
      })
  }

  render() {
    const { hideLabel, intl, submit, label, placeholder, cssHandles } = this.props
    const submitText = formatIOMessage({ id: submit, intl })
    const labelText = formatIOMessage({ id: label, intl })
    const placeholderText = formatIOMessage({ id: placeholder, intl })
    const confirmationTitle = formatIOMessage({
      id: 'store/newsletter.confirmationTitle',
      intl,
    })
    const confirmationText = formatIOMessage({
      id: 'store/newsletter.confirmationText',
      intl,
    })
    const invalidEmailText = formatIOMessage({
      id: 'store/newsletter.invalidEmail',
      intl,
    })
    const errorMsg = formatIOMessage({
      id: 'store/newsletter.error',
      intl,
    })

    return (
      <div
        className={`${cssHandles.newsletter} ${
          this.state.success ? cssHandles.confirmation : ''
        } w-100`}
      >
        <div className={`${cssHandles.container} mw9 mr-auto ml-auto pv9`}>
          {this.state.success ? (
            <Fragment>
              <div className={`${cssHandles.confirmationTitle} t-heading-3 pb4 tc`}>
                {confirmationTitle}
              </div>
              <div className={`${cssHandles.confirmationText} t-body tc`}>
                {confirmationText}
              </div>
            </Fragment>
          ) : (
            <form className={`${cssHandles.form} mw6 center tc ph5 ph0-ns`}>
              <label
                className={`${cssHandles.label} t-heading-3 tc ${
                  hideLabel ? 'dn' : ''
                }`}
                htmlFor="newsletter-input"
              >
                {labelText}
              </label>
              <div className={`${cssHandles.inputGroup} flex-ns pt5`}>
                <Input
                  ref={this.inputRef}
                  id="newsletter-input"
                  errorMessage={
                    this.state.invalidEmail ? invalidEmailText : null
                  }
                  placeholder={placeholderText}
                  name="newsletter"
                  value={this.state.email}
                  onChange={this.handleChangeEmail}
                />
                <div
                  className={`${
                    cssHandles.buttonContainer
                  } pl4-ns flex-none pt3 pt0-ns`}
                >
                  <Button
                    variation="primary"
                    type="submit"
                    onClick={this.handleSubmit}
                    isLoading={this.state.loading}
                  >
                    {submitText}
                  </Button>
                </div>
              </div>
              {this.state.error && (
                <div className={`${cssHandles.error} c-danger t-body pt5`}>
                  {errorMsg}
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    )
  }
}

Newsletter.defaultProps = {
  hideLabel: false,
  showTerms: false,
}

Newsletter.propTypes = {
  hideLabel: PropTypes.bool.isRequired,
  showTerms: PropTypes.bool.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  submit: PropTypes.string,
  subscribeNewsletter: PropTypes.func.isRequired,
  intl: intlShape,
}

Newsletter.getSchema = () => {
  return {
    title: 'admin/editor.newsletter.title',
    description: 'admin/editor.newsletter.description',
    type: 'object',
    properties: {
      hideLabel: {
        type: 'boolean',
        title: 'admin/editor.newsletter.hideLabel',
        default: false,
        isLayout: true,
      },
    },
  }
}

export default compose(
  graphql(SUBSCRIBE_NEWSLETTER, { name: 'subscribeNewsletter' }),
  withCssHandles(CSS_HANDLES),
  injectIntl
)(Newsletter)