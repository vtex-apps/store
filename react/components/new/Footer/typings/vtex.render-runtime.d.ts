/* Typings for `render-runtime` */
declare module 'vtex.render-runtime' {
  import { Component, ComponentType, ReactElement, ReactType } from 'react'

  export interface NavigationOptions {
    page: string
    params?: any
  }

  export interface RenderContextProps {
    runtime: {
      navigate: (options: NavigationOptions) => void
    }
  }

  interface ExtensionPointProps {
    id: string
    key: Record<string, any>
  }

  interface Pages {
    [name: string]: Page
  }

  interface Route {
    domain: string
    blockId: string
    canonicalPath?: string
    id: string
    params: Record<string, string>
    path: string
    title?: string
  }

  interface Culture {
    availableLocales: string[]
    locale: string
    language: string
    country: string
    currency: string
  }

  export interface RenderRuntime {
    account: string
    accountId: string
    appsEtag: string
    workspace: string
    disableSSR: boolean
    hints: {
      desktop: boolean
      mobile: boolean
      phone: boolean
      tablet: boolean
    }
    page: string
    route: Route
    version: string
    culture: Culture
    pages: Pages
    preview: boolean
    production: boolean
    publicEndpoint: string
    renderMajor: number
    query?: Record<string, string>
    start: boolean
    runtimeMeta: {
      version: string
      config?: any
    }
    settings: {
      app: Record<string, any>
    }
    segmentToken: string
    rootPath?: string
    workspaceCookie: string
    hasNewExtensions: boolean
    platform: string
  }

  export const ExtensionPoint: ComponentType<ExtensionPointProps>

  interface ChildBlockProps {
    id: string
  }

  export const ChildBlock: ComponentType<ChildBlockProps>
  export const useChildBlock = function({ id: string }): object {}

  export const Helmet: ReactElement
  export const Link: ReactType
  export const NoSSR: ReactElement
  export const RenderContextConsumer: ReactElement
  export const canUseDOM: boolean
  export const useRuntime: () => RenderRuntime
  export const withRuntimeContext: <TOriginalProps extends {}>(
    Component: ComponentType<TOriginalProps & RenderContextProps>
  ) => ComponentType<TOriginalProps>
}
