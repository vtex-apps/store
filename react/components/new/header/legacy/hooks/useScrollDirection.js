import { useState, useEffect } from 'react'
import useScroll from './useScroll'

/**
 * Hook that handles the scroll direction
 * @returns {Number, Boolean, Boolean} - the current scroll value and if the scroll is up, or down
 */
const useScrollDirection = () => {
  const { scroll } = useScroll()
  const [scrollingUp, setScrollingUp] = useState(false)
  const [lastScroll, setLastScroll] = useState(0)

  useEffect(() => {
    setLastScroll(scroll)
    setScrollingUp(lastScroll > scroll)
  }, [scroll])

  return { scroll, scrollingUp }
}

export default useScrollDirection
