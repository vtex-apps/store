import React from 'react'

const push = () => null

export const withPixel = WrappedComponent => {
  const withPixel = props => <WrappedComponent {...props} push={push} />
  return withPixel
}

export const usePixel = () => ({
  push: jest.fn(),
})
