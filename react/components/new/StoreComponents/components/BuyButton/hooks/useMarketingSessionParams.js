import { useEffect, useState } from 'react'

import { path, pathOr } from 'ramda'

const getUtmParams = (publicFields) => ({
  source: path(['utm_source', 'value'], publicFields),
  medium: path(['utm_medium', 'value'], publicFields),
  campaign: path(['utm_campaign', 'value'], publicFields),
})

const getUtmiParams = (publicFields) => ({
  campaign: path(['utmi_cp', 'value'], publicFields),
  page: path(['utmi_p', 'value'], publicFields),
  part: path(['utmi_pc', 'value'], publicFields),
})

const getSessionPromiseFromWindow = () =>
    !window.__RENDER_8_SESSION__ || !window.__RENDER_8_SESSION__.sessionPromise
      ? Promise.resolve(null)
      : window.__RENDER_8_SESSION__.sessionPromise

const useMarketingSessionParams = () => {
  const [utmParams, setUtmParams] = useState(undefined)
  const [utmiParams, setUtmiParams] = useState(undefined)

  useEffect(() => {
    getSessionPromiseFromWindow().then(data => {
      const publicFields = pathOr({}, ['response', 'namespaces', 'public'], data)
      if (Object.keys(publicFields).length === 0) {
        return
      }
      
      setUtmParams(getUtmParams(publicFields))
      setUtmiParams(getUtmiParams(publicFields))
    }).catch(() => {
      // Do nothing!
    })
  }, [])

  return { utmParams, utmiParams }
}

export default useMarketingSessionParams
