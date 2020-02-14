import { useContext } from 'react'
import Context from '../context.js'

const useCurrentPassword = () => {
  const {
    state: { currentPassword },
    handlers: { handleCurrentPasswordChange },
  } = useContext(Context)

  return [currentPassword, handleCurrentPasswordChange]
}

export default useCurrentPassword
