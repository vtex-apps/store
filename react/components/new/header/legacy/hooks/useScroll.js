import { useState, useEffect } from 'react'
import throttle from 'throttleit'

/**
 * Hook that handles the scroll position
 * @returns {Number} - scroll position value
 */
const useScroll = () => {
  const [scroll, setScroll] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY)
    }
    const throttled = throttle(handleScroll, 100)
    window.addEventListener('scroll', throttled)
    return () => window.removeEventListener('scroll', throttled)
  }, [])

  return { scroll }
}

export default useScroll
