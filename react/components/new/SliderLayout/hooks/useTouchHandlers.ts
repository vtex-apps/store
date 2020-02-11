import { useState } from 'react'

import { useSliderControls } from './useSliderControls'
import { useSliderDispatch, useSliderState } from '../components/SliderContext'

const SWIPE_THRESHOLD = 75

export const useTouchHandlers = ({ infinite }: { infinite: boolean }) => {
  const dispatch = useSliderDispatch()
  const { transform } = useSliderState()
  const { goForward, goBack } = useSliderControls(infinite)

  const [touchState, setTouchState] = useState({
    touchStartX: 0,
    touchInitialTransform: transform,
  })

  const onTouchStart = (e: React.TouchEvent) => {
    const startX = e.touches[0].clientX
    setTouchState({ touchStartX: startX, touchInitialTransform: transform })
  }

  const onTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX

    const newTransform =
      touchState.touchInitialTransform +
      (currentX - touchState.touchStartX) / 100

    dispatch({
      type: 'TOUCH',
      payload: { transform: newTransform, isOnTouchMove: true },
    })
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX
    const delta = endX - touchState.touchStartX

    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      // Swipe from left to right
      if (delta > 0) {
        goBack()
      }

      // Swipe from right to left
      if (delta < 0) {
        goForward()
      }
    } else {
      // Ignore the swipe if the SWIPE_THRESHOLD is not reached
      dispatch({
        type: 'TOUCH',
        payload: {
          transform: touchState.touchInitialTransform,
          isOnTouchMove: false,
        },
      })
    }

    setTouchState({ touchStartX: 0, touchInitialTransform: transform })
    dispatch({
      type: 'TOUCH',
      payload: {
        isOnTouchMove: false,
      },
    })
  }

  return { onTouchEnd, onTouchStart, onTouchMove }
}
