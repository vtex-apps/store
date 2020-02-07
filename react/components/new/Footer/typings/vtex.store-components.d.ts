declare module 'vtex.store-components' {
  import { ComponentType, ReactElement } from 'react'

  declare const Container: ComponentType<ContainerProps>

  interface ContainerProps {
    className: string
  }
}
