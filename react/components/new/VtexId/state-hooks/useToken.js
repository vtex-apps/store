import { useContext, useEffect } from 'react'
import Context from '../context'

const useToken = () => {
  const {
    state: { token },
    handlers: { handleTokenChange },
  } = useContext(Context)

  useEffect(() => () => handleTokenChange(''), [handleTokenChange])

  return [token, handleTokenChange]
}

export default useToken
