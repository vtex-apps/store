const patterns = {
  hasNumber: /\d/,
  hasNotANumber: /[^\d]/,
  lowerCaseLetter: /[a-z]/,
  upperCaseLetter: /[A-Z]/,
  email: /^(([^<>()\[\]\\.,;:\s@!"]+(\.[^<>()\[\]\\.,;:\s@!"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
}
export const validateEmail = email => {
  if (!email) return false
  return patterns.email.test(String(email).toLowerCase())
}

export const hasChar = value =>
  patterns.lowerCaseLetter.test(String(value || '').toLowerCase())

export const hasOnlyNumbers = value =>
  patterns.hasNumber.test(String(value || ''))

export const validatePassword = pass => {
  if (!pass) {
    return {
      passwordIsValid: false,
      hasNumber: false,
      hasMinLength: false,
      hasLowerCaseLetter: false,
      hasUpperCaseLetter: false,
    }
  }
  const hasMinLength = !!(pass && pass.length >= 8)
  const hasNumber = patterns.hasNumber.test(pass)
  const hasLowerCaseLetter = patterns.lowerCaseLetter.test(pass)
  const hasUpperCaseLetter = patterns.upperCaseLetter.test(pass)

  return {
    passwordIsValid:
      hasNumber && hasMinLength && hasLowerCaseLetter && hasUpperCaseLetter,
    hasNumber,
    hasMinLength,
    hasLowerCaseLetter,
    hasUpperCaseLetter,
  }
}

export const validatePhone = () => true
