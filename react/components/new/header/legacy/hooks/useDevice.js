import { useState, useLayoutEffect } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { debounce } from 'debounce'

/**
 * Hook that handles dynamic device change on resize
 * @param {Number} mobileBreakpoint - break point of mobile change
 * @returns {Boolean, Boolean} - if its mobile or desktop
 */
const useDevice = (mobileBreakpoint = 640) => {
  const { hints } = useRuntime()

  const isMobile = !!window.innerWidth
    ? window.innerWidth <= mobileBreakpoint
    : hints.mobile

  const [mobile, setMobile] = useState(isMobile)
  const [desktop, setDesktop] = useState(!isMobile)

  useLayoutEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth <= mobileBreakpoint)
      setDesktop(window.innerWidth > mobileBreakpoint)
    }
    const debounced = debounce(handleResize, 100)
    window.addEventListener('resize', debounced)
    window.addEventListener('load', handleResize)
    return () => {
      window.removeEventListener('resize', debounced)
      window.removeEventListener('load', handleResize)
    }
  }, [mobileBreakpoint])

  return {
    mobile,
    desktop,
  }
}

export default useDevice
