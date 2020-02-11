import React from 'react'
export const Transition = props => {
  const mockedStyle = { opacity: 0, transform: 'translateX(-50%)' }
  return (
    <div {...props}>
      {props.children.map(children => children(mockedStyle))}
    </div>
  )
}
