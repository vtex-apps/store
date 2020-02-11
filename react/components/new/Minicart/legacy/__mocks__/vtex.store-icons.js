import React from 'react'

const iconMock = (size, className, name) => {
  return (
    <svg className={`${className} ${name}`} width={size} height={size}>
      <rect width={size} height={size} />
    </svg>
  )
}

export const IconCart = ({ size, className }) =>
  iconMock(size, className, 'IconCart')

export const IconCaret = ({ size, className }) =>
  iconMock(size, className, 'IconCaret')

export const IconDelete = ({ size, className }) =>
  iconMock(size, className, 'IconDelete')
