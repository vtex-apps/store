declare module 'vtex.native-types' {
  import { ComponentType } from 'react'
  import { InjectedIntl } from 'react-intl'

  export const IOMessage: ComponentType<{ id: string }>

  interface Options {
    intl: InjectedIntl
    id: string
  }

  export const formatIOMessage: (options: Options) => string
}
