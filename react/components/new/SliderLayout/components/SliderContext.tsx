import React, { createContext, useReducer, useContext, FC } from 'react'
import useDevice from '../../DeviceDetector/useDevice'

interface AdjustOnResizeAction {
  type: 'ADJUST_ON_RESIZE'
  payload: {
    shouldCorrectItemPosition: boolean
    slidesPerPage: number
    navigationStep: number
  }
}

interface SlideAction {
  type: 'SLIDE'
  payload: {
    transform: number
    currentSlide: number
  }
}

interface TouchAction {
  type: 'TOUCH'
  payload: {
    transform?: number
    isOnTouchMove: boolean
  }
}

interface State extends SliderLayoutProps {
  /** Width of each slide */
  slideWidth: number
  /** Number of slides to show per page */
  slidesPerPage: number
  /** Index of the leftmost slide of the current page */
  currentSlide: number
  /** Current transform value */
  transform: number
  /** Total number of slides */
  totalItems: number
  /** Number of slides to slide in navigation */
  navigationStep: number
  /** Whether or not navigationStep prop is set to 'page' */
  isPageNavigationStep: boolean
  /** Whether or not a touchmove event is happening */
  isOnTouchMove: boolean
}

type Action = AdjustOnResizeAction | SlideAction | TouchAction
type Dispatch = (action: Action) => void

const SliderStateContext = createContext<State | undefined>(undefined)
const SliderDispatchContext = createContext<Dispatch | undefined>(undefined)

function sliderContextReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADJUST_ON_RESIZE':
      return {
        ...state,
        slidesPerPage: action.payload.slidesPerPage,
        navigationStep: action.payload.navigationStep,
        transform: action.payload.shouldCorrectItemPosition
          ? -state.slideWidth * state.currentSlide
          : state.transform,
      }
    case 'SLIDE':
      return {
        ...state,
        transform: action.payload.transform,
        currentSlide: action.payload.currentSlide,
      }
    case 'TOUCH':
      return {
        ...state,
        transform: action.payload.transform || state.transform,
        isOnTouchMove: action.payload.isOnTouchMove,
      }
    default:
      return state
  }
}

const SliderContextProvider: FC<SliderLayoutProps & { totalItems: number }> = ({
  autoplay,
  children,
  totalItems,
  label = 'slider',
  navigationStep = 'page',
  slideTransition = {
    speed: 400,
    delay: 0,
    timing: '',
  },
  itemsPerPage = {
    desktop: 5,
    tablet: 3,
    phone: 1,
  },
}) => {
  const { device } = useDevice()
  const resolvedNavigationStep =
    navigationStep === 'page' ? itemsPerPage[device] : navigationStep

  const [state, dispatch] = useReducer(sliderContextReducer, {
    slideWidth: 100 / totalItems,
    slidesPerPage: itemsPerPage[device],
    currentSlide: 0,
    transform: 0,
    navigationStep: resolvedNavigationStep,
    slideTransition,
    itemsPerPage,
    label,
    autoplay,
    totalItems,
    isPageNavigationStep: navigationStep === 'page',
    isOnTouchMove: false,
  })

  return (
    <SliderStateContext.Provider value={state}>
      <SliderDispatchContext.Provider value={dispatch}>
        {children}
      </SliderDispatchContext.Provider>
    </SliderStateContext.Provider>
  )
}

function useSliderState() {
  const context = useContext(SliderStateContext)
  if (context === undefined) {
    throw new Error(
      'useSliderState must be used within a SliderContextProvider'
    )
  }
  return context
}

function useSliderDispatch() {
  const context = useContext(SliderDispatchContext)

  if (context === undefined) {
    throw new Error(
      'useSliderDispatch must be used within a SliderContextProvider'
    )
  }
  return context
}

export { SliderContextProvider, useSliderDispatch, useSliderState }
