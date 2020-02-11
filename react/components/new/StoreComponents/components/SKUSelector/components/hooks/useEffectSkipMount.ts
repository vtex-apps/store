import { useEffect, useRef, EffectCallback } from 'react'

const useEffectSkipMount = (func: EffectCallback, deps: any[]) => {
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    return func()
  }, deps)
}

export default useEffectSkipMount
