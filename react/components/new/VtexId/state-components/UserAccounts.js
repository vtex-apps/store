import React from 'react'
import PropTypes from 'prop-types'
import Context from '../context'
import { Validations } from '../utils'

const UserAccounts = ({ children }) => (
  <Context.Consumer>
    {({ state: { userAccounts }, handlers: { handleUserAccountsChange } }) =>
      children({
        value: (userAccounts || []).filter(email =>
          Validations.validateEmail(email)
        ),
        setValue: handleUserAccountsChange,
        validation: Validations,
      })
    }
  </Context.Consumer>
)

UserAccounts.propTypes = {
  children: PropTypes.func.isRequired,
}

export default UserAccounts
