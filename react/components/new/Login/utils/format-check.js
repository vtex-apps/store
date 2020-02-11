export const isValidPassword = password => {
  const pattern = new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
  return pattern.test(password)
}

export const isValidEmail = email => {
  const pattern = new RegExp(/^(([^<>()\[\]\\.,;:\s@!"]+(\.[^<>()\[\]\\.,;:\s@!"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
  return pattern.test(email)
}

export const isValidAccessCode = code => {
  const pattern = new RegExp(/^[0-9]{6}$/)
  return pattern.test(code)
}
