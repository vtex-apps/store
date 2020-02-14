import React from 'react'
import { Validations } from '../utils'
import Context from '../context'
import PropTypes from 'prop-types'

const PhoneNumber = ({ children }) => {
  return (
    <Context.Consumer>
      {({ state: { phoneNumber }, handlers: { handlePhoneNumberChange } }) =>
        children({
          value: phoneNumber,
          setValue: handlePhoneNumberChange,
          validation: {
            ...Validations,
            validatePhone: () => true, // compatibility
          },
        })
      }
    </Context.Consumer>
  )
}

PhoneNumber.propTypes = {
  children: PropTypes.func.isRequired,
}

export default PhoneNumber
