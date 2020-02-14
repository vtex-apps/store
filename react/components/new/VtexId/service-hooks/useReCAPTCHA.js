import React, { useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import GoogleRecaptcha from 'react-google-recaptcha'
import { NOOP, Constants } from '../utils'
const {
  ReCAPTCHA: { SiteKey },
} = Constants
import useRefCallback from '../utils/useRefCallback'

const useReCAPTCHA = ({ onSuccess = NOOP } = {}) => {
  const recaptchaRef = useRef(null)

  const verifyRecaptcha = useRefCallback(() => {
    if (recaptchaRef) {
      recaptchaRef.current.execute()
    }
  }, [recaptchaRef])

  useEffect(() => {
    const div = document.createElement('div')
    div.setAttribute('class', 'dn')
    document.body.append(div)
    ReactDOM.render(
      <GoogleRecaptcha
        ref={recaptchaRef}
        sitekey={SiteKey}
        size="invisible"
        badge="inline"
        onChange={onSuccess}
      />,
      div
    )
    return () => div.remove()
  }, [onSuccess, recaptchaRef])

  return [verifyRecaptcha]
}

export default useReCAPTCHA
