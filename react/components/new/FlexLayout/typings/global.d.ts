import { FunctionComponent } from 'react'
import { TachyonsScaleInput } from '../modules/valuesParser'

declare global {
  interface StorefrontFunctionComponent<P = {}> extends FunctionComponent<P> {
    schema?: object
    getSchema?(props?: P): object
  }

  interface StorefrontComponent<P = {}, S = {}> extends Component<P, S> {
    schema?: object
    getSchema?(props: P): object
  }

  interface StorefrontElement extends ReactElement {
    schema?: object
    getSchema?(props: P): object
  }

  interface Gap {
    colGap: TachyonsScaleInput
    rowGap: TachyonsScaleInput
  }

  interface Flex {
    stretchContent: boolean
    grow: boolean
  }

  type BorderBase = 'top' | 'right' | 'bottom' | 'left' | 'all'

  interface Border {
    border: BorderBase | BorderBase[]
    borderWidth: TachyonsScaleInput
    borderColor: string
  }
}
