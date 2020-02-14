import { useContext } from 'react'
import Context from '../context'

const useRecaptcha = () => {
  const {
    state: { recaptcha },
    handlers: { handleRecaptchaChange },
  } = useContext(Context)

  return [recaptcha, handleRecaptchaChange]
}

export default useRecaptcha
