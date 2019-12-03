declare module 'vtex.render-runtime' {
  interface Runtime {
    account: string
    getSettings(id: string): StoreSettings
    route: {
      routeId: string
    }
  }

  interface StoreSettings {
    storeName: string
    titleTag: string
  }

  export function useRuntime(): Runtime
  export const Helmet
  export const canUseDOM: boolean
  export const LoadingContextProvider
}
