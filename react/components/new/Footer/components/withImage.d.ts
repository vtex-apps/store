import { FC, ComponentType } from 'react'

export default (mapper: (props: any) => void) => (
  component: ComponentType<any>
) => FC
