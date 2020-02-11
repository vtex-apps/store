import { FC, Component } from 'react'
import { Orientations } from '../modules/constants'

declare global {
  interface StorefrontFunctionComponent<P = {}> extends FC<P> {
    getSchema?(props: P): object
    schema?: object
  }

  interface StorefrontComponent<P = {}, S = {}> extends Component<P, S> {
    getSchema?(props: P): object
    schema: object
  }

  interface Condition {
    visibleWhen?: string
    displayValue?: string
  }

  interface BaseProps extends Condition {
    specificationGroupName: string
    orientation?: Orientations
    specificationsOptions?: ConditionWithName[]
    specificationName?: string
  }

  type ConditionWithName = Condition & {
    specificationName: BaseProps['specificationName']
  }
}
