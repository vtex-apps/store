import React, { useState, useRef, useEffect, useContext, FunctionComponent, useMemo } from 'react'

const TRANSITION_DELAY = 250

function isFunction(value: any): value is (...rest: any) => any {
  return typeof value === 'function'
}

interface Props {
  open: boolean
}

interface CollapsibleContextValue {
  updateHeight?: (height: number) => void
}

const CollapsibleContext = React.createContext<CollapsibleContextValue>({})

const Collapsible: FunctionComponent<Props> = ({ children, open }) => {
  const { updateHeight: updateParentHeight } = useContext(CollapsibleContext)

  const [height, setHeight] = useState(0)

  const contextValue = useMemo(() => ({
    updateHeight: (heightDelta: number) => {
      setHeight(height + heightDelta)
      if (isFunction(updateParentHeight)) {
        updateParentHeight(heightDelta)
      }
    },
  }), [ updateParentHeight, height ])

  return (
    <CollapsibleContext.Provider value={contextValue}>
      <CollapsibleContainer open={open} height={height}>
        {children}
      </CollapsibleContainer>
    </CollapsibleContext.Provider>
  )
}

interface ContainerProps {
  open: boolean
  height: number
}

const CollapsibleContainer: FunctionComponent<ContainerProps> = ({ children, open, height }) => {
  const { updateHeight } = useContext(CollapsibleContext)

  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    /** Calculates the content size on the next browser render tick,
     * because the content might not exist right at the time of
     * changing the open prop
     */
    requestAnimationFrame(() => {
      const element = container.current

      /** The second verification here prevents it from trying to close
       * the menu on initialization (because `open` inits as `false`)
       */
      if (!element || (!open && height === 0)) {
        return
      }

      const initialHeight = element.offsetHeight
      const initialMaxHeight = element.style.maxHeight

      element.style.height = 'auto'
      element.style.maxHeight = 'none'

      const childrenHeight = element.offsetHeight

      element.style.height = `${initialHeight}px`
      element.style.maxHeight = initialMaxHeight

      /** Runs `getBoundingClientRect` to trigger a layout event
       *  in order to make the transition to the new height work.
       */
      element.getBoundingClientRect()

      if (isFunction(updateHeight)) {
        updateHeight(open ? childrenHeight : -childrenHeight)
      }
    })
  }, [open])

  return (
    <div
      className="overflow-hidden"
      ref={container}
      style={{
        height,
        transition: `height ${TRANSITION_DELAY}ms ease-out`,
      }}
    >
      {children}
    </div>
  )
}

export default Collapsible
