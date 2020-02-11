import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import PasswordValidationItem from './PasswordValidationItem'

export default class PasswordValidationContent extends Component {
  render() {
    const { fields } = this.props

    return (
      <Fragment>
        {fields.map(
          field => (
            <div className="mt2" key={field.id}>
              <PasswordValidationItem
                label={field.label}
                prefix={field.prefix}
                valid={field.valid}
              />
            </div>
          )
        )}
      </Fragment>
    )
  }
}

PasswordValidationContent.propTypes = {
  /** Fields to appear into the content */
  fields: PropTypes.array.isRequired,
}
