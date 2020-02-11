import React, { Component } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { Link } from 'vtex.render-runtime'

import Button from '../../Styleguide/Button'
import { AuthServiceLazy } from 'vtex.react-vtexid'

import { translate } from '../utils/translate'
import styles from '../styles.css'

// Component that shows account options to the user.
class AccountOptions extends Component {
  static propTypes = {
    /** Intl object*/
    intl: intlShape,
  }

  render() {
    const { intl } = this.props
    return (
      <div className={`${styles.accountOptions} items-center w-100`}>
        <div className="ma4 min-h-2 b--muted-4">
          <Link page={'store.account'}>
            <button
              className={`${styles.button} bw1 ba ttu br2 t-action--small v-mid relative pv3 ph5 t-heading-5 bg-base b--transparent c-action-primary  hover-c-action-primary pointer`}
              closeonclick=""
            >
              <span className="t-action--small">
                {translate('store/login.myAccount', intl)}
              </span>
            </button>
          </Link>
        </div>
        <hr className="mv2 o-30" />
        <div className="ma4 min-h-2 b--muted-4">
          <AuthServiceLazy.RedirectLogout returnUrl="/">
            {({ action: logout }) => (
              <Button
                variation="tertiary"
                size="small"
                onClick={logout}
              >
                <span className="t-action--small">
                  {translate('store/login.logoutLabel', intl)}
                </span>
              </Button>
            )}
          </AuthServiceLazy.RedirectLogout>
        </div>
      </div>
    )
  }
}

export default injectIntl(AccountOptions)
