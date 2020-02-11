import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import Button from '../../Styleguide/Button'
import { AuthServiceLazy } from 'vtex.react-vtexid'

import { translate } from '../utils/translate'
import styles from '../styles.css'

// Component that shows account options to the user.
import className from 'classnames'

const styleByProviderName = {
  Facebook: styles.facebookOptionBtn,
  Google: styles.googleOptionBtn,
}

class OAuth extends Component {
  static propTypes = {
    /** Intl object*/
    intl: intlShape,
    /** Name of the Provider to proceed with the Authentication */
    provider: PropTypes.string,
    /** Actual button */
    children: PropTypes.node,
    /** Function called after login success */
    loginCallback: PropTypes.func,
  }

  render() {
    const { intl, children, provider, loginCallback } = this.props
    return (
      <div className={className(styles.button, styles.buttonSocial, styleByProviderName[provider] || styles.customOAuthOptionBtn)}>
        <AuthServiceLazy.OAuthPopup useNewSession provider={provider} onSuccess={() => loginCallback()}>
          {({ loading, action: openOAuthPopup }) => (
            <Button
              isLoading={loading}
              variation="tertiary"
              onClick={openOAuthPopup}
            >
              {children}
              <span className={`t-action--small ${styles.oauthLabel} relative normal`}>
                {translate('store/loginOptions.oAuth', intl)}
                <span className={`${styles.oauthProvider} b ml2`}>{provider}</span>
              </span>
            </Button>
          )}
        </AuthServiceLazy.OAuthPopup>
      </div>
    )
  }
}

export default injectIntl(OAuth)
