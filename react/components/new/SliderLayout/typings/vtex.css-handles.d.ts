declare module 'vtex.css-handles' {
  export const useCssHandles = <T extends CssHandlesInput>(
    handles: T
  ): CssHandles<T> => {
    let cssHandles: CssHandles<T>

    // This is not actually what is returned by useCssHandles
    // just a mock for typechecking and testing.
    handles.forEach(handle => {
      cssHandles[handle] = handle
    })

    return cssHandles
  }
}

type CssHandlesInput = readonly string[]
type ValueOf<T extends readonly any[]> = T[number]
type CssHandles<T extends CssHandlesInput> = Record<ValueOf<T>, string>
