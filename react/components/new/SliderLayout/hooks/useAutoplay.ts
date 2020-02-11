import { useEffect } from 'react'
import { useSliderState } from '../components/SliderContext'
import { useSliderControls } from './useSliderControls'
import useHovering from './useHovering'

export const useAutoplay = (
  infinite: boolean,
  containerRef: React.RefObject<HTMLDivElement>
) => {
  const { autoplay } = useSliderState()
  const { isHovering } = useHovering(containerRef)

  const shouldStop = autoplay && autoplay.stopOnHover && isHovering

  const { goForward } = useSliderControls(infinite)

  useEffect(() => {
    if (!autoplay) {
      return
    }

    const timeout = setTimeout(() => {
      goForward()
    }, autoplay.timeout)

    shouldStop && clearTimeout(timeout)

    return () => clearTimeout(timeout)
  }, [goForward, shouldStop, autoplay])
}
