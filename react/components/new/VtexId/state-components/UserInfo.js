import { useContext } from 'react'
import PropTypes from 'prop-types'
import { Validations } from '../utils'
import Context from '../context'

const UserInfo = ({ children }) => {
  const {
    state: { userInfo },
  } = useContext(Context)
  return children({
    value: userInfo,
    setValue: () =>
      console.warn('UserInfo Component does not expose a setValue'),
    validation: Validations,
  })
}

UserInfo.propTypes = {
  children: PropTypes.func.isRequired,
}

export default UserInfo
