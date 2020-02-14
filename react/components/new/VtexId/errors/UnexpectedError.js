import StandardError from './StandardError'

class UnknownError extends StandardError {
  constructor(details) {
    super(
      'An unexpected error occurred in the client or the server.',
      'UnexpectedError',
      details
    )
  }
}

export default UnknownError
