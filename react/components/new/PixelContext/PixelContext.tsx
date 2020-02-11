import hoistNonReactStatics from 'hoist-non-react-statics'
import React, { useContext, createContext, PureComponent } from 'react'

type EventType =
  | 'homeView'
  | 'productView'
  | 'productClick'
  | 'productImpression'
  | 'otherView'
  | 'categoryView'
  | 'departmentView'
  | 'internalSiteSearchView'
  | 'pageInfo'
  | 'pageView'
  | 'addToCart'
  | 'removeFromCart'
  | 'pageComponentInteraction'
  | 'orderPlaced'
  | 'installWebApp'

export interface PixelData {
  event?: EventType
  [data: string]: any
}

interface PixelEvent extends Event {
  data: any
}

export interface PixelContextType {
  push: (data: PixelData) => void
}

declare var process: {
  env: {
    NODE_ENV: 'production' | 'development'
    VTEX_APP_ID: string
  }
}

interface Props {
  currency: string
}

const PixelContext = createContext<PixelContextType>({
  push: () => undefined,
})

const getDisplayName = <T extends {}>(comp: React.ComponentType<T>) =>
  comp.displayName || comp.name || 'Component'

export const usePixel = () => useContext(PixelContext)

/**
 * withPixel is the HOC Component that provides an event subscription to the
 * Wrapped Component. This component will be used by the installed apps.
 */
export function withPixel<T>(
  WrappedComponent: React.ComponentType<T & PixelContextType>
) {
  const PixelComponent: React.FC<T> = props => {
    const { push } = usePixel()
    return <WrappedComponent {...props} push={push} />
  }

  PixelComponent.displayName = `withPixel(${getDisplayName(WrappedComponent)})`

  return hoistNonReactStatics(PixelComponent, WrappedComponent)
}

class PixelProvider extends PureComponent<Props> {
  private pixelContextValue: PixelContextType

  public constructor(props: Props) {
    super(props)

    this.pixelContextValue = {
      push: this.push,
    }
  }

  public componentDidMount() {
    window.addEventListener('message', this.handleWindowMessage)
  }

  public componentWillUnmount() {
    window.removeEventListener('message', this.handleWindowMessage)
  }

  /**
   * Push event to iframe
   */
  public push = (data: PixelData) => {
    // Add all events to window when is linking to ease debugging
    // **Don't make those if's one!**
    if (process.env.NODE_ENV === 'development') {
      if (typeof window !== 'undefined') {
        window.pixelManagerEvents = window.pixelManagerEvents || []
        window.pixelManagerEvents.push(data)
      }
    }

    this.handlePixelEvent(data)
  }

  public render() {
    return (
      <PixelContext.Provider value={this.pixelContextValue}>
        {this.props.children}
      </PixelContext.Provider>
    )
  }

  private handleWindowMessage = (e: PixelEvent) => {
    if (e.data.pageComponentInteraction) {
      this.push({
        data: e.data,
        event: 'pageComponentInteraction',
      })
    }
  }

  private enhanceEvent = (event: PixelData, currency: string) => ({
    currency,
    eventName: `vtex:${event.event}`,
    ...event,
  })

  private handlePixelEvent = (event: PixelData) => {
    const eventData = this.enhanceEvent(event, this.props.currency)
    try {
      window.postMessage(eventData, window.origin)
    } catch (e) {
      // IE and Edge have a bug on postMessage inside promises.
      // Ignoring for now, will try to find a workaround that
      // makes postMessage work on those browsers.
      // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/14719328/
    }
  }
}

export default { Pixel: withPixel, withPixel, PixelProvider, usePixel }