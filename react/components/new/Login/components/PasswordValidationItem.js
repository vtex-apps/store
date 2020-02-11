import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default class PasswordValidationItem extends Component {
  render() {
    const { valid, prefix, label } = this.props
    const className = classNames('flex flex-row', {
      'c-success': valid !== undefined && valid,
      'c-danger': valid !== undefined && !valid,
      'c-muted-2': valid === undefined,
    })
    return (
      <div className={className}>
        <div className="w-20">
          <span className="t-small">{prefix}</span>
        </div>
        <div className="w-80">
          <span className="t-small">{label}</span>
        </div>
      </div>
    )
  }
}

PasswordValidationItem.propTypes = {
  /** Switch the icon to appear with the text (failed or success) */
  valid: PropTypes.bool,
  /** Label to appear before the text */
  prefix: PropTypes.string.isRequired,
  /** Label to appear into the item */
  label: PropTypes.string.isRequired,
}
