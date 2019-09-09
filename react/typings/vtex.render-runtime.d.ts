declare module 'vtex.render-runtime' {
  interface Runtime {
    account: string
    getSettings(id: string): StoreSettings
  }

  interface StoreSettings {
    storeName: string
    titleTag: string
  }

  export function useRuntime(): Runtime
  export const Helmet
}