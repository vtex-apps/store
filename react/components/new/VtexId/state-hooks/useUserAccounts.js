import { useContext } from 'react'
import Context from '../context'
import { Validations } from '../utils'

const useUserAccounts = () => {
  const {
    state: { userAccounts },
    handlers: { handleUserAccountsChange },
  } = useContext(Context)

  const emails = (userAccounts || []).filter(email =>
    Validations.validateEmail(email)
  )

  return [emails, handleUserAccountsChange]
}

export default useUserAccounts
