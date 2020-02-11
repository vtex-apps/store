declare module 'vtex.store-icons' {
  import { ComponentType } from 'react'
  interface Props {
    size: number
    viewBox?: string
  }

  export const IconLocationInput: ComponentType<Props>
  export const IconClose: ComponentType<Props & { type: string }>
}
