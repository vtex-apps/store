import React from 'react'
import PropTypes from 'prop-types'
import { Validations } from '../utils'
import Context from '../context'

const Recaptcha = ({ children }) => {
  return (
    <Context.Consumer>
      {({ state: { recaptcha }, handlers: { handleRecaptchaChange } }) =>
        children({
          value: recaptcha,
          setValue: handleRecaptchaChange,
          validation: Validations,
        })
      }
    </Context.Consumer>
  )
}
Recaptcha.propTypes = {
  children: PropTypes.func.isRequired,
}

export default Recaptcha
