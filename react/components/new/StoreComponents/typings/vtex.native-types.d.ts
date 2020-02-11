// import { ComponentType } from 'react'

declare module 'vtex.native-types' {
  import { ComponentType } from 'react'
  export const IOMessage: ComponentType<{
    id: string
    values: Record<string, any>
    ['data-testid']: string
  }>
}
