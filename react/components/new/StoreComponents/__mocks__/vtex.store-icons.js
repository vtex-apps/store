import React from 'react'

const iconMock = ({ orientation = '', size, className = '', name }) => {
  return (
    <svg
      className={`${orientation} ${className} ${name}`}
      width={size}
      height={size}
    >
      <rect
        width={size}
        height={size}
        style={{ fill: 'rgb(0,0,255)', strokeWidth: 3, stroke: 'rgb(0,0,0)' }}
      />
    </svg>
  )
}

export const IconClose = ({ orientation, size, className }) =>
  iconMock({ orientation, size, className, name: 'IconClose' })

export const IconSearch = ({ orientation, size, className }) =>
  iconMock({ orientation, size, className, name: 'IconSearch' })

export const IconCaret = ({ orientation, size, className }) =>
  iconMock({ orientation, size, className, name: 'IconCaret' })
