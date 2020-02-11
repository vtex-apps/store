import { useEffect } from 'react'
import useDevice from '../../DeviceDetector/useDevice'

import { useSliderDispatch, useSliderState } from '../components/SliderContext'

export const useScreenResize = (infinite: boolean) => {
  const {
    navigationStep,
    isPageNavigationStep,
    itemsPerPage,
  } = useSliderState()
  const { device } = useDevice()
  const dispatch = useSliderDispatch()

  useEffect(() => {
    const setNewState = (shouldCorrectItemPosition: boolean) => {
      dispatch({
        type: 'ADJUST_ON_RESIZE',
        payload: {
          shouldCorrectItemPosition,
          slidesPerPage: itemsPerPage[device],
          navigationStep: isPageNavigationStep
            ? itemsPerPage[device]
            : navigationStep,
        },
      })
    }
    const onResize = (value?: UIEvent): void => {
      setNewState(!value || infinite)
    }
    setNewState(false)

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [
    infinite,
    dispatch,
    itemsPerPage,
    device,
    isPageNavigationStep,
    navigationStep,
  ])
}
