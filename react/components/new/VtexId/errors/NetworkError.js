import StandardError from './StandardError'

class NetworkError extends StandardError {
  constructor(details) {
    super(
      "The app couldn't reach the internet. It may be offline.",
      'NetworkError',
      details
    )
  }
}

export default NetworkError
