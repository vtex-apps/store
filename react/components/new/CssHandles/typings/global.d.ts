interface CssHandlesOptions {
  migrationFrom?: string | string[]
  blockClass?: string
}
type CssHandlesInput = readonly string[]
type ValueOf<T extends readonly any[]> = T[number]
type CssHandles<T extends CssHandlesInput> = Record<ValueOf<T>, string>
