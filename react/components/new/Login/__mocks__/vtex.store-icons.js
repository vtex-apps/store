import React from 'react'

const iconMock = ({ name = '', size = 20, className = '' }) => (
  <svg width={size} height={size} className={`${name}-mock ${className}`}>
    <rect width={size} height={size} />
  </svg>
)

export const IconArrowBack = ({ size = 20, className = '' }) =>
  iconMock({ name: 'IconAssistantSales', size, className })

export const IconProfile = ({ size = 20, className = '' }) =>
  iconMock({ name: 'IconProfile', size, className })

export const IconEyeSight = ({
  size = 20,
  className = '',
  state = '',
  type = '',
}) =>
  iconMock({
    name: 'IconEyeSight',
    size,
    className: `${className} ${state} ${type}`,
  })
