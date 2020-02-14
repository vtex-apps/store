import { useContext } from 'react'
import Context from '../context'

const UserInfo = () => {
  const {
    state: { userInfo },
  } = useContext(Context)

  return userInfo
}

export default UserInfo
