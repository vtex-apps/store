import { useEffect, useRef } from 'react'
import { usePixel } from 'vtex.pixel-manager/PixelContext'
import { isEmpty } from 'ramda'

const useDataPixel = (data, slug, isLoading = false) => {
  const { push } = usePixel()
  const previousSlugRef = useRef(null)

  const previousSlug = previousSlugRef.current

  useEffect(() => {
    if (slug && !isLoading && previousSlug !== slug) {
      if (!data || isEmpty(data)) {
        return
      }

      if (Array.isArray(data)) {
        data.forEach(push)
      } else {
        push(data)
      }

      previousSlugRef.current = slug
    }
  }, [data, isLoading, previousSlug, push, slug])
}

export default useDataPixel
