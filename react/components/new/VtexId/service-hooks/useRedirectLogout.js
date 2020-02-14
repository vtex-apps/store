import { Services } from '../utils'
import useRefCallback from '../utils/useRefCallback'

const useRedirectLogout = ({ returnUrl } = {}) => {
  const redirectLogout = useRefCallback(() => {
    Services.redirectLogout({ returnUrl })
  }, [Services, returnUrl])

  return [redirectLogout]
}

export default useRedirectLogout
