import React, { Component } from 'react'
import PropTypes from 'prop-types'
import GoogleRecaptcha from 'react-google-recaptcha'
import { Constants } from '../utils'

export default class ReCAPTCHA extends Component {
  static propTypes = {
    onSuccess: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired,
  }

  state = {
    recaptchaRef: React.createRef(),
  }

  verifyRecaptcha = () => {
    console.log('verifying recaptcha...')
    this.state.recaptchaRef.current.execute()
  }

  render() {
    return (
      <React.Fragment>
        {this.props.children(this.verifyRecaptcha)}
        <div className="dn">
          <GoogleRecaptcha
            ref={this.state.recaptchaRef}
            sitekey={Constants.ReCAPTCHA.SiteKey}
            size={Constants.ReCAPTCHA.Size}
            badge="inline"
            onChange={value => {
              this.props.onSuccess(value)
            }}
          />
        </div>
      </React.Fragment>
    )
  }
}
