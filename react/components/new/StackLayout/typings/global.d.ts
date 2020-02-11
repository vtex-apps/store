import { FunctionComponent } from 'react'
import { TachyonsScaleInput } from '../hooks/tachyons'

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
}
