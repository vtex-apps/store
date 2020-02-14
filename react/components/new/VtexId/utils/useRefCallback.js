import { useRef, useEffect } from 'react'

/// Returns a wrapper function that persists through the lifetime of the component (like a ref)
/// and that internally calls the input callback
const useRefCallback = (callback, depsLst) => {
  const ref = useRef(callback)

  useEffect(() => {
    ref.current = callback
  }, [callback, ...depsLst])

  return (...args) => ref.current(...args)
}

export default useRefCallback
