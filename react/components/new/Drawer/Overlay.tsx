import React, { RefForwardingComponent } from 'react'

interface Props {
  visible: boolean
  onClick(event: React.MouseEvent | React.TouchEvent): void
}

const Overlay: RefForwardingComponent<HTMLDivElement, Props> = (
  { visible, onClick }: Props,
  ref
) => {
  return (
    <div
      ref={ref}
      aria-hidden
      onClick={onClick}
      style={{
        opacity: visible ? 0.5 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 300ms',
      }}
      className="bg-base--inverted z-999 fixed top-0 bottom-0 left-0 right-0"
    />
  )
}

export default React.forwardRef(Overlay)
