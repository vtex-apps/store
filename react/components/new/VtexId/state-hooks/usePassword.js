import { useContext } from 'react'
import Context from '../context'

const usePassword = () => {
  const {
    state: { password },
    handlers: { handlePasswordChange },
  } = useContext(Context)

  return [password, handlePasswordChange]
}

export default usePassword
