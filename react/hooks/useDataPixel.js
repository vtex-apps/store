import { useEffect, useRef } from 'react'
import { usePixel } from 'vtex.pixel-manager/PixelContext'
import { isEmpty } from 'ramda'

const useDataPixel = (data, pageIdentifier, isLoading = false) => {
  const { push } = usePixel()
  const previousIdRef = useRef(null)

  const previousId = previousIdRef.current

  useEffect(() => {
    if (pageIdentifier && !isLoading && previousId !== pageIdentifier) {
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
  }, [data, isLoading, pageIdentifier, previousId, push])
}

export default useDataPixel
