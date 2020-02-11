/* Typings for `render-runtime` */
declare module 'vtex.render-runtime' {
  import { Component, ReactElement } from 'react'

  export interface NavigationOptions {
    page: string
    params?: any
  }

  export interface RuntimeProps {
    navigate: (options: NavigationOptions) => void
    hints: {
      mobile: boolean,
      desktop: boolean
    }
  }

  export interface RenderContextProps {
    runtime: RuntimeProps
  }

  export interface LinkProps {
    onClick?: (event: any) => void
    params?: object | null
    page?: string
    className?: string
    to?: string
  }

  export const ExtensionPoint: ReactElement
  export const Helmet: ReactElement
  export const Link: React.FunctionComponent<LinkProps>
  export const NoSSR: ReactElement
  export const RenderContextConsumer: ReactElement
  export const canUseDOM: boolean
  export const useRuntime: () => RuntimeProps
  export const withRuntimeContext: <TOriginalProps extends {}>(
    Component: ComponentType<TOriginalProps & RenderContextProps>
    ) => ComponentType<TOriginalProps>
    
  export const withSession: <TOriginalProps extends {}>(
    Component: ComponentType<TOriginalProps & RenderContextProps>
  ) => ComponentType<TOriginalProps>
  
  export const buildCacheLocator = (app: string, type: string, cacheId: string) => string

  interface RenderComponent<P = {}, S = {}> extends Component<P, S> {
    getCustomMessages?: (locale: string) => any
    schema: ComponentSchema
    getSchema?: (a: any, b: any?) => ComponentSchema
    uiSchema: UISchema
  }

  export interface ComponentsRegistry {
    [component: string]: RenderComponent<any, any>
  }

  export interface Window extends Window {
    __RENDER_7_COMPONENTS__: ComponentsRegistry
  }

  let global: Window
}
