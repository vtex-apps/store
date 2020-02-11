import React, { createContext, useReducer, useContext, FC } from 'react'
import useDevice from '../DeviceDetector/useDevice'

interface OpenMinicartAction {
  type: 'OPEN_MINICART'
}
interface CloseMinicartAction {
  type: 'CLOSE_MINICART'
}
interface SetOpenBehaviorAction {
  type: 'SET_OPEN_BEHAVIOR'
  value: 'click' | 'hover'
}

interface State {
  variation: MinicartVariationType
  open: boolean
  hasBeenOpened: boolean
  /** Controls the minicart opening behavior */
  openBehavior: 'click' | 'hover'
  /** Value provided by the user to openOnHover prop */
  openOnHoverProp: boolean
}

interface Props {
  openOnHover: boolean
  variation: MinicartVariationType
}

type Action = OpenMinicartAction | CloseMinicartAction | SetOpenBehaviorAction
type Dispatch = (action: Action) => void

const MinicartStateContext = createContext<State | undefined>(undefined)
const MinicartDispatchContext = createContext<Dispatch | undefined>(undefined)

function minicartContextReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'OPEN_MINICART':
      return {
        ...state,
        open: true,
        hasBeenOpened: true,
      }
    case 'CLOSE_MINICART':
      return {
        ...state,
        open: false,
      }
    case 'SET_OPEN_BEHAVIOR':
      return {
        ...state,
        openBehavior: action.value,
      }
    default:
      return state
  }
}

const MinicartContextProvider: FC<Props> = ({
  variation = 'drawer',
  openOnHover: openOnHoverProp = false,
  children,
}) => {
  const { isMobile } = useDevice()

  // This prevents a popup minicart from being used on a mobile device
  const resolvedVariation =
    isMobile || (window && window.innerWidth <= 480) ? 'drawer' : variation

  const [state, dispatch] = useReducer(minicartContextReducer, {
    variation: resolvedVariation,
    open: false,
    hasBeenOpened: false,
    openOnHoverProp,
    openBehavior:
      resolvedVariation === 'popup' && openOnHoverProp ? 'hover' : 'click',
  })

  return (
    <MinicartStateContext.Provider value={state}>
      <MinicartDispatchContext.Provider value={dispatch}>
        {children}
      </MinicartDispatchContext.Provider>
    </MinicartStateContext.Provider>
  )
}

function useMinicartState() {
  const context = useContext(MinicartStateContext)
  if (context === undefined) {
    throw new Error(
      'useMinicartState must be used within a MinicartContextProvider'
    )
  }
  return context
}

function useMinicartDispatch() {
  const context = useContext(MinicartDispatchContext)

  if (context === undefined) {
    throw new Error(
      'useMinicartDispatch must be used within a MinicartContextProvider'
    )
  }
  return context
}

export { MinicartContextProvider, useMinicartDispatch, useMinicartState }
