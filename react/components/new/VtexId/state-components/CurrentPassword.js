import React from 'react'
import PropTypes from 'prop-types'
import { Validations } from '../utils'
import Context from '../context'

const CurrentPassword = ({ children }) => {
  return (
    <Context.Consumer>
      {({ state: { currentPassword }, handlers: { handleCurrentPasswordChange } }) =>
        children({
          value: currentPassword,
          setValue: handleCurrentPasswordChange,
          validation: Validations,
        })
      }
    </Context.Consumer>
  )
}
CurrentPassword.propTypes = {
  children: PropTypes.func.isRequired,
}

export default CurrentPassword
