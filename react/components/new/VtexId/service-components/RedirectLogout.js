import PropTypes from 'prop-types'
import { Services } from '../utils'

const RedirectLogout = ({ children, returnUrl }) =>
  children({ action: () => Services.redirectLogout({ returnUrl }) })

RedirectLogout.propTypes = {
  children: PropTypes.func.isRequired,
  returnUrl: PropTypes.string,
}

export default RedirectLogout
