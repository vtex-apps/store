import { useContext } from 'react'
import Context from '../context'

const usePhoneNumber = () => {
  const {
    state: { phoneNumber },
    handlers: { handlePhoneNumberChange },
  } = useContext(Context)

  return [phoneNumber, handlePhoneNumberChange]
}

export default usePhoneNumber
