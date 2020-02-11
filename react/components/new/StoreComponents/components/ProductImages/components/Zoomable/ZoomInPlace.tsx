import React, { FC, useRef, useState, useEffect, ReactElement } from 'react'
import { clamp } from 'ramda'

interface ContainerBounds {
  x: number,
  y: number,
  width: number,
  height: number,
}

type ZoomType = 'click' | 'hover'

interface Props {
  type: ZoomType 
  zoomContent?: ReactElement
  factor: number
}

type ReactMouseEvent = MouseEvent | React.MouseEvent<HTMLElement, MouseEvent>

const getBounds = (element?: Element | null): ContainerBounds | null => {
  if (!element) return null

  const bounds = element.getBoundingClientRect()
  return {
    x: bounds.left,
    y: bounds.top,
    width: bounds.width,
    height: bounds.height,
  }
}

const getMousePositionFromEvent = (event: ReactMouseEvent, bounds?: ContainerBounds | null): {x: number, y: number, isOutOfBounds?: boolean} => {
  if (!bounds) {
    return { x: 0, y: 0 }
  }

  const [ x, y ] = [ event.clientX - bounds.x, event.clientY - bounds.y ]

  const threshold = 20
  /* Uses out-of-bounds detection instead of simply a "mouse-out" event
    * to prevent from zooming out when the mouse hovers a button or suchlike */
  const isOutOfBounds = x < -threshold || y < -threshold || x > bounds.width + threshold || y > bounds.height + threshold

  // Values larger than 0 increase mouse movement sensivity
  const boost = 0.1
  return {
    x: clamp(0, bounds.width, (-bounds.width * boost) + (x * (1 + boost * 2))),
    y: clamp(0, bounds.height, (-bounds.height * boost) + (y * (1 + boost * 2))),
    isOutOfBounds,
  }
}

const ZoomInPlace: FC<Props> = ({ children, zoomContent, type, factor }) => {
  const [isZoomedIn, setZoom] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const containerBounds = useRef<ContainerBounds | null>(null)

  const setPositionAndScale = (x: number, y: number, scale: number) => {
    const contentElement = contentRef.current
    if (!contentElement) {
      return
    }

    contentElement.style.transform = `scale(${scale}, ${scale}) translate3d(${-x/scale}px, ${-y/scale}px, 0)`
  }

  const getContainerBounds = () => containerBounds.current || getBounds(containerRef.current)

  const handleMouseOver = () => {
    setZoom(true)
  }

  const handleClick = (event: ReactMouseEvent) => {
    setZoom(!isZoomedIn)

    if (!isZoomedIn) {
      const mousePosition = getMousePositionFromEvent(event, getContainerBounds())
      setPositionAndScale(mousePosition.x, mousePosition.y, factor)
    }
  }

  // Resets position when the image is zoomed out
  useEffect(() => {
    if (!isZoomedIn) {
      setPositionAndScale(0, 0, 1)
      containerBounds.current = null
    }
  }, [isZoomedIn])

  /* Adds mouse event handlers to the entire document, so that
   * mouse movement is not restricted to just the content element */
  const handleClickOutside = () => {
    if (isZoomedIn) {
      setZoom(false)
    }
  }

  const handleMouseMove = (event: ReactMouseEvent) => {
    if (!isZoomedIn) {
      return
    }

    const mousePosition = getMousePositionFromEvent(event, getContainerBounds())

    /* Uses out-of-bounds detection instead of simply a "mouse-out" event
     * to prevent from zooming out when the mouse hovers a button or suchlike */
    if (type === 'hover' && mousePosition.isOutOfBounds) {
      setZoom(false)
    } else {
      setPositionAndScale(mousePosition.x, mousePosition.y, factor)
    }
  }

  useEffect(() => {
    if (document) {
      document.addEventListener('mousemove', handleMouseMove)
      if (type === 'click') {
        document.addEventListener('click', handleClickOutside)
      }
    }
    return () => {
      if (document) {
        document.removeEventListener('mousemove', handleMouseMove)
        if (type === 'click') {
          document.removeEventListener('click', handleClickOutside)
        }
      }
    }
  })

  return (
    <div
      ref={containerRef}
      onMouseOver={type === 'hover' ? handleMouseOver : undefined}
      onClick={type === 'click' ? handleClick : undefined}
      className="relative">
      <div ref={contentRef} style={{
        transformOrigin: '0 0',
        fontSize: 0, /** Prevents accidental whitespaces on the content from stretching
                       * the container, and consequently the zoomed image */
      }}>
        {children}
        {zoomContent && isZoomedIn && (
          <div
            className="absolute top-0 left-0 right-0 bottom-0"
            style={{
              transformOrigin: '0 0',
              transform: `scale(${1/factor})`,
              fontSize: 0
            }}>
            {zoomContent}
          </div>
        )}
      </div>
    </div>
  )
}

export default ZoomInPlace