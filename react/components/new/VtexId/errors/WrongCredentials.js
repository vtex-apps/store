import StandardError from './StandardError'

class WrongCredentialsError extends StandardError {
  constructor(details) {
    super('Password or token entered is incorrect', 'WrongCredentials', details)
  }
}

export default WrongCredentialsError
