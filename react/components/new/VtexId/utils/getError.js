import errorTypeByCode from './errorTypeByCode'
import UnexpectedError from '../errors/UnexpectedError'

export default function(error) {
  // The VTEXID token api will return a status 401 and an specific text body
  // message whenever the user is blocked because of too many attempts.
  const legacyBlockedUserResponse = 'Seu login está bloqueado temporariamente.'

  const wasBlockedByToken =
    error && error.response && error.response.data === legacyBlockedUserResponse

  let errorCode = error && error.code
  errorCode = errorCode || (wasBlockedByToken && 'BlockedUser')
  errorCode = errorCode || (error && error.authStatus)
  errorCode =
    errorCode ||
    (error &&
      error.response &&
      error.response.data &&
      error.response.data.authStatus)
  errorCode = errorCode || ((error && error.message) || '').replace(/\s+/g, '')
  const errorDetails = error && error.details

  if (errorCode) {
    const ErrorType = errorTypeByCode[errorCode]
    return ErrorType
      ? new ErrorType(errorDetails)
      : new UnexpectedError(errorDetails)
  }
  return new UnexpectedError(errorDetails)
}
