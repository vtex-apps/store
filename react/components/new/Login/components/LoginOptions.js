import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { ExtensionContainer } from 'vtex.render-runtime'

import Button from '../../Styleguide/Button'

import FacebookIcon from '../images/FacebookIcon'
import GoogleIcon from '../images/GoogleIcon'
import { translate } from '../utils/translate'
import FormTitle from './FormTitle'
import OAuth from './OAuth'

import styles from '../styles.css'

const PROVIDERS_ICONS = {
  Google: GoogleIcon,
  Facebook: FacebookIcon,
}

/** LoginOptions tab component. Displays a list of login options */
class LoginOptions extends Component {
  handleOptionClick = el => () => {
    this.props.onOptionsClick(el)
  }

  showOption = (option, optionName) => {
    const { isAlwaysShown, currentStep, options } = this.props
    return (
      options &&
      ((options[option] && !isAlwaysShown) || currentStep !== optionName)
    )
  }

  render() {
    const {
      className,
      title,
      fallbackTitle,
      options,
      loginCallback,
      intl,
      isAlwaysShown,
      providerPasswordButtonLabel,
    } = this.props

    const classes = classNames(styles.options, className, {
      [styles.optionsSticky]: isAlwaysShown,
    })

    return (
      <div className={classes}>
        <FormTitle>{title || translate(fallbackTitle, intl)}</FormTitle>
        <ul className={`${styles.optionsList} list pa0`}>
          <Fragment>
            {options.accessKeyAuthentication &&
              this.showOption(
                'accessKeyAuthentication',
                'store/loginOptions.emailVerification'
              ) && (
              <li className={`${styles.optionsListItem} mb3`}>
                <div className={classNames(styles.button, styles.accessCodeOptionBtn)}>
                  <Button
                    variation="secondary"
                    onClick={this.handleOptionClick(
                      'store/loginOptions.emailVerification'
                    )}
                  >
                    <span>
                      {translate(
                        'store/loginOptions.emailVerification',
                        intl
                      )}
                    </span>
                  </Button>
                </div>
              </li>
            )}
            {options.classicAuthentication &&
              this.showOption(
                'classicAuthentication',
                'store/loginOptions.emailAndPassword'
              ) && (
              <li className={`${styles.optionsListItem} mb3`}>
                <div className={classNames(styles.button, styles.emailPasswordOptionBtn)}>
                  <Button
                    variation="secondary"
                    onClick={this.handleOptionClick(
                      'store/loginOptions.emailAndPassword'
                    )}
                  >
                    <span>
                      {providerPasswordButtonLabel ||
                          translate(
                            'store/loginOptions.emailAndPassword',
                            intl
                          )}
                    </span>
                  </Button>
                </div>
              </li>
            )}
            {options.providers &&
              options.providers.map(({ providerName }, index) => {
                const hasIcon = PROVIDERS_ICONS.hasOwnProperty(providerName)
                return (
                  <li
                    className={`${styles.optionsListItem} mb3`}
                    key={`${providerName}-${index}`}
                  >
                    <OAuth
                      provider={providerName}
                      loginCallback={loginCallback}
                    >
                      {hasIcon
                        ? React.createElement(
                          PROVIDERS_ICONS[providerName],
                          null
                        )
                        : null}
                    </OAuth>
                  </li>
                )
              })}
          </Fragment>
          <li
            className={`${styles.optionsListItem} ${styles.optionsListItemContainer} mb3`}
          >
            <ExtensionContainer id="container" />
          </li>
        </ul>
      </div>
    )
  }
}

LoginOptions.propTypes = {
  /** Intl object*/
  intl: intlShape,
  /** Function to change de active tab */
  onOptionsClick: PropTypes.func.isRequired,
  /** Title that will be shown on top */
  title: PropTypes.string.isRequired,
  /** Fallback title that will be shown if there's no title */
  fallbackTitle: PropTypes.string.isRequired,
  /** List of options to be displayed */
  options: PropTypes.shape({
    accessKeyAuthentication: PropTypes.bool,
    classicAuthentication: PropTypes.bool,
    providers: PropTypes.arrayOf(
      PropTypes.shape({
        className: PropTypes.string,
        providerName: PropTypes.string,
      })
    ),
  }),
  /** Class of the root element */
  className: PropTypes.string,
  /** Whether this component is always rendered */
  isAlwaysShown: PropTypes.bool,
  /** Current option being displayed */
  currentStep: PropTypes.string,
  /** Function called after login success */
  loginCallback: PropTypes.func,
  /** Password login button text */
  providerPasswordButtonLabel: PropTypes.string,
}

export default injectIntl(LoginOptions)
