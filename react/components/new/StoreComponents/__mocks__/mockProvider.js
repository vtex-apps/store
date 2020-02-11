import React from 'react'

export const createClientMock = responseMock => ({
  query: () =>
    new Promise((resolve, reject) => {
      resolve(responseMock)
    }),
})
