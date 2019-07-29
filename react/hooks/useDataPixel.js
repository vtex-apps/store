import { useEffect, useRef } from 'react'
import { usePixel } from 'vtex.pixel-manager/PixelContext'
import { isEmpty } from 'ramda'

const useDataPixel = (data, pageIdentifier, isLoading = false) => {
  const { push } = usePixel()
  const previousIdRef = useRef(null)

  const previuousId = previousIdRef.current

  useEffect(() => {
    if (pageIdentifier && !isLoading && previuousId !== pageIdentifier) {
      if (!data || isEmpty(data)) {
        return
      }

      if (Array.isArray(data)) {
        data.forEach(push)
      } else {
        push(data)
      }

      previousIdRef.current = pageIdentifier
    }
  }, [data, isLoading, pageIdentifier, previuousId, push])
}

export default useDataPixel
