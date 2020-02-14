import StandardError from './StandardError'

class BlockedUserError extends StandardError {
  constructor(details) {
    super(
      'Too many login attempts. Send recaptcha to continue.',
      'BlockedUser',
      details
    )
  }
}

export default BlockedUserError
