import { useContext } from 'react'

import Context from '../context'

const useEmail = () => {
  const {
    state: { email },
    handlers: { handleEmailChange },
  } = useContext(Context)

  return [email, handleEmailChange]
}

export default useEmail
