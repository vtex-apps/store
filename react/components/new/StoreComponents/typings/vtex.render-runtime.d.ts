declare module 'vtex.render-runtime' {
  interface Runtime {
    setQuery: (vars: { skuId: string }, options?: { replace?: boolean } ) => void
    query?: { skuId?: string }
  }
  export const useRuntime: () => Runtime
}
