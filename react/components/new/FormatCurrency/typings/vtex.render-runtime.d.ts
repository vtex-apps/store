declare module 'vtex.render-runtime' {
  interface RuntimeContext {
    culture: {
      currency: string
      customCurrencyDecimalDigits?: number | null
      customCurrencySymbol?: string | null
    }
  }

  export const useRuntime = () => RuntimeContext
}
