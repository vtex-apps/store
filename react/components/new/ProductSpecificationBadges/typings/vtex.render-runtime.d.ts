/* Typings for `render-runtime` */
declare module 'vtex.render-runtime' {
  import { Component, ComponentType, ReactElement, ReactType } from 'react'

  interface Runtime {
    navigate: (options: NavigationOptions) => void
    culture: {
      country: string
    }
  }

  export interface NavigationOptions {
    page: string
    params?: any
  }

  export interface RenderContextProps {
    runtime: Runtime
  }

  interface ExtensionPointProps {
    id: string
    [key: string]: any
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
  export const withRuntimeContext: <TOriginalProps extends object>(
    Component: ComponentType<TOriginalProps & RenderContextProps>
  ) => ComponentType<TOriginalProps>

  export const useRuntime: () => Runtime
}
