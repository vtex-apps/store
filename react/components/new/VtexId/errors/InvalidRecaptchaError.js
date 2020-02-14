import StandardError from './StandardError'

class InvalidRecaptchaError extends StandardError {
  constructor(details) {
    super(
      'The current recaptcha value is invalid.',
      'InvalidRecaptcha',
      details
    )
  }
}

export default InvalidRecaptchaError
