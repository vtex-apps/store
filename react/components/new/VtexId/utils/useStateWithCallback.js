import { useState, useRef, useCallback, useEffect } from 'react'

const useStateWithCallback = initialState => {
  const [state, setState] = useState(initialState)
  const callbackAfterSetState = useRef(null)
  const [refUpdaterCounter, setRefUpdaterCounter] = useState(0)

  const setStateWithCallback = useCallback(
    (stateUpdater, callback = null) => {
      setState(stateUpdater)
      callbackAfterSetState.current = callback
      setRefUpdaterCounter(counter => counter + 1)
    },
    [setState, callbackAfterSetState, setRefUpdaterCounter]
  )

  useEffect(() => {
    if (callbackAfterSetState.current) {
      const callback = callbackAfterSetState.current
      callbackAfterSetState.current = null
      callback(state)
    }
  }, [refUpdaterCounter, callbackAfterSetState, state])

  return [state, setStateWithCallback]
}

export default useStateWithCallback
