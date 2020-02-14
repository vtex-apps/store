import {
  NetworkError,
  WrongCredentialsError,
  BlockedUserError,
  InvalidRecaptchaError,
} from '../errors/index'

const errorTypeByCode = {
  NetworkError,
  BlockedUser: BlockedUserError,
  WrongCredentials: WrongCredentialsError,
  InvalidMFAToken: WrongCredentialsError,
  InvalidRecaptcha: InvalidRecaptchaError,
}

export default errorTypeByCode
