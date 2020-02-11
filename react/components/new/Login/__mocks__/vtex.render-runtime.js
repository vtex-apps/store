import React from 'react'

export const ExtensionContainer = ({ id }) => (
  <div className="ExtensionContainer-mock">{id}</div>
)

export const Link = ({ page, className, children }) => (
  <a href={page} className={className}>
    {children}
  </a>
)

// eslint-disable-next-line react/display-name
export const withRuntimeContext = WrappedComponent => props => {
  const mockedRuntime = {
    page: '',
    history: {
      location: {
        pathname: '',
        search: '',
      },
    },
  }
  return <WrappedComponent {...props} runtime={mockedRuntime} />
}

export const withSession = () => comp => comp
