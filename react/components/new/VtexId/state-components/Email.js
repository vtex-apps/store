import React from 'react'
import PropTypes from 'prop-types'
import { Validations } from '../utils'
import Context from '../context'

const Email = ({ children }) => {
  return (
    <Context.Consumer>
      {({ state: { email }, handlers: { handleEmailChange } }) =>
        children({
          value: email,
          setValue: handleEmailChange,
          validation: Validations,
        })
      }
    </Context.Consumer>
  )
}

Email.propTypes = {
  children: PropTypes.func.isRequired,
}

export default Email
