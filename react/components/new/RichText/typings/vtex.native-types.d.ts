declare module 'vtex.native-types' {
  import { Component } from 'react'
  import { InjectedIntl, InjectedIntlProps } from 'react-intl'

  interface FormatIOMessageParams {
    id: string
    intl: InjectedIntl
  }

  export const formatIOMessage: (params: FormatIOMessageParams) => string

  interface IOMessageProps extends InjectedIntlProps {
    id: string
  }

  export const IOMessage: Component<IOMessageProps>
}
