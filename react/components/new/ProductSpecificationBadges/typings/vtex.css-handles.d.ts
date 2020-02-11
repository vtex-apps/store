declare module 'vtex.css-handles' {
  type CssHandlesInput = readonly string[]
  type ValueOf<T extends readonly any[]> = T[number]
  type CssHandles<T extends CssHandlesInput> = Record<ValueOf<T>, string>
  interface CssHandlesOptions {
    migrationFrom?: string | string[]
  }

  export const useCssHandles: <T extends CssHandlesInput>(
    handles: T,
    options: CssHandlesOptions = {}
  ) => CssHandles<T>
  export const applyModifiers: (
    handles: string,
    modifier: string | string[]
  ) => string
}
