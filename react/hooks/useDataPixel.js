import { useEffect, useRef } from 'react'
import { usePixel } from 'vtex.pixel-manager/PixelContext'

const useDataPixel = (data, isLoading = false) => {
  const { push } = usePixel()
  const prevLoadingRef = useRef(true)

  useEffect(() => {
    if (prevLoadingRef.current && !isLoading) {
      if (!data) {
        return
      }

      if (Array.isArray(data)) {
        data.forEach(event => push(event))
      } else {
        push(data)
      }
    }

    prevLoadingRef.current = isLoading
  }, [data, isLoading, push])
}

export default useDataPixel
