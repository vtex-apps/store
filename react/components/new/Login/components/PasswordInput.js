import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import Input from '../../Styleguide/Input'
import IconEyeSight from '../../StoreIcons/IconEyeSight'
import { ExtensionPoint, useChildBlock } from 'vtex.render-runtime'

import { translate } from '../utils/translate'
import PasswordValidationContent from './PasswordValidationContent'
import TooltipVerification from './TooltipVerification'

const SuffixIcon = ({ handleEyeIcon, showPassword }) => {
  const hasIconBlock = Boolean(useChildBlock({ id: 'icon-eye-sight' }))

  return (
    <span className="pointer" onClick={handleEyeIcon}>
      {hasIconBlock ? (
        <ExtensionPoint
          id="icon-eye-sight"
          type="filled"
          state={showPassword ? 'off' : 'on'}
          size={16}
        />
      ) : (
        <IconEyeSight
          type="filled"
          state={showPassword ? 'off' : 'on'}
          size={16}
        />
      )}
    </span>
  )
}

class PasswordInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showVerification: false,
      showPassword: false,
    }
    this.timeout = 0
  }

  handleEyeIcon = () =>
    this.setState({ showPassword: !this.state.showPassword })

  handlePasswordChange = event => {
    const lowerCaseLetters = /[a-z]/g
    const upperCaseLetters = /[A-Z]/g
    const numbers = /[0-9]/g

    const value = event.target.value

    if (this.timeout) {
      clearTimeout(this.timeout)
    }

    this.timeout = setTimeout(() => {
      this.setState({
        containsLowerLetter:
          value.length > 0 ? value.match(lowerCaseLetters) : undefined,
        containsUpperLetter:
          value.length > 0 ? value.match(upperCaseLetters) : undefined,
        containsNumber: value.length > 0 ? value.match(numbers) : undefined,
        atLeastEightCharacteres:
          value.length > 0 ? value.length >= 8 : undefined,
      })
    }, 300)

    this.props.onStateChange({ password: value })
  }

  render() {
    const {
      showVerification,
      containsLowerLetter,
      containsUpperLetter,
      containsNumber,
      atLeastEightCharacteres,
      showPassword,
    } = this.state

    const { intl, password, showPasswordVerificationIntoTooltip } = this.props

    const fields = [
      {
        id: 0,
        prefix: 'ABC',
        label: translate('store/login.password.uppercaseLetter', intl),
        valid: containsUpperLetter,
      },
      {
        id: 1,
        prefix: 'abc',
        label: translate('store/login.password.lowercaseLetter', intl),
        valid: containsLowerLetter,
      },
      {
        id: 2,
        prefix: '123',
        label: translate('store/login.password.number', intl),
        valid: containsNumber,
      },
      {
        id: 3,
        prefix: '***',
        label: translate('store/login.password.eightCharacteres', intl),
        valid: atLeastEightCharacteres,
      },
    ]

    return (
      <div className="relative">
        <Input
          type={`${showPassword ? 'text' : 'password'}`}
          value={password}
          onChange={this.handlePasswordChange}
          placeholder={
            this.props.placeholder ||
            translate('store/login.password.placeholder', intl)
          }
          onBlur={() =>
            this.setState({
              showVerification: !showPasswordVerificationIntoTooltip,
            })
          }
          onFocus={() => this.setState({ showVerification: true })}
          suffixIcon={
            <SuffixIcon
              showPassword={showPassword}
              handleEyeIcon={this.handleEyeIcon}
            />
          }
        />
        {showVerification &&
          (!showPasswordVerificationIntoTooltip ? (
            <div className="pa2">
              <PasswordValidationContent fields={fields} />
            </div>
          ) : (
            <TooltipVerification fields={fields} />
          ))}
      </div>
    )
  }
}

PasswordInput.propTypes = {
  /** Password set on state */
  password: PropTypes.string.isRequired,
  /** Placeholder to appear into the input */
  placeholder: PropTypes.string.isRequired,
  /** Set the type of password verification ui */
  showPasswordVerificationIntoTooltip: PropTypes.bool,
  /** Function to change de active tab */
  onStateChange: PropTypes.func.isRequired,
  /** Intl object*/
  intl: intlShape,
}

export default injectIntl(PasswordInput)
