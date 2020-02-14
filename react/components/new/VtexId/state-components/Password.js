import React from 'react'
import PropTypes from 'prop-types'
import { Validations } from '../utils'
import Context from '../context'

const Password = ({ children }) => {
  return (
    <Context.Consumer>
      {({ state: { password }, handlers: { handlePasswordChange } }) =>
        children({
          value: password,
          setValue: handlePasswordChange,
          validation: Validations,
        })
      }
    </Context.Consumer>
  )
}
Password.propTypes = {
  children: PropTypes.func.isRequired,
}

export default Password
