declare module 'vtex.render-runtime' {
  interface Runtime {
    account: string
    rootPath: string
    query: Record<string, string>
    navigate: (args: NavigateArgs) => void
    getSettings(id: string): StoreSettings
    route: {
      routeId: string
    }
  }

  interface RuntimeWithRoute extends Runtime {
    route: {
      routeId: string
      title?: string
      metaTags?: MetaTagsParams
      canonicalPath?: string
    }
  }

  interface MetaTagsParams {
    description: string
    keywords: string[]
  }

  interface NavigateArgs {
    fallbackToWindowLocation: boolean
    to: string
  }

  interface StoreSettings {
    storeName: string
    titleTag: string
    enablePageNumberTitle: boolean
    canonicalWithUrlParams: boolean
    removeStoreNameTitle: boolean
  }

  interface KeyValue {
    value: string
  }

  interface Session {
    id: string
    type: undefined
    namespaces: {
      store: {
        channel: string
      }
      profile: {
        isAuthenticated: KeyValue
        email: string
      }
    }
  }

  interface SessionUnauthorized {
    type: 'Unauthorized'
    message: string
  }

  interface SessionForbidden {
    type: 'Forbidden'
    message: string
  }

  export interface RenderSession {
    sessionPromise: Promise<SessionPromise>
  }

  export interface SessionPromise {
    response: SessionResponse
  }

  export type SessionResponse = Session | SessionUnauthorized | SessionForbidden

  export function useRuntime(): Runtime
  export const Helmet
  export const canUseDOM: boolean
  export const LoadingContextProvider
}

export {}
