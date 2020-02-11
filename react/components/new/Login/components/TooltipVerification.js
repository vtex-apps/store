import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { isMobile } from 'react-device-detect'
import { translate } from '../utils/translate'
import Tooltip from './Tooltip'
import PasswordValidationContent from './PasswordValidationContent'

class TooltipVerification extends Component {
  render() {
    const { fields, intl } = this.props
    if (isMobile) {
      return (
        <Tooltip top title={translate('store/login.password.tooltip.title', intl)}>
          <PasswordValidationContent fields={fields} />
        </Tooltip>
      )
    }

    return (
      <Tooltip title={translate('store/login.password.tooltip.title', intl)}>
        <PasswordValidationContent fields={fields} />
      </Tooltip>
    )
  }
}

TooltipVerification.propTypes = {
  /** Fields to be verified in the tooltip */
  fields: PropTypes.array,
  /** Intl object*/
  intl: intlShape,
}

export default injectIntl(TooltipVerification)
