import { FunctionComponent, ReactElement } from 'react'

declare global {
  interface StorefrontFC<P = {}> extends FunctionComponent<P> {
    getSchema?(props: P): object
    schema?: object
  }

  interface StorefrontComponent<P = {}, S = {}> extends Component<P, S> {
    getSchema?(props: P): object
    schema: object
  }
}
