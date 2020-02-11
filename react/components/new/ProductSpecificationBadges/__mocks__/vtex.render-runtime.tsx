import React, { FC } from 'react'

const fakeRuntime = {
  account: 'vtex',
  getSettings: () => ({
    storeName: 'Store Name',
    titleTag: 'Store TitleTag',
  }),
  culture: { currency: 'BRL', locale: 'pt-BR', country: 'BRA' },
}

export const useRuntime = () => {
  return fakeRuntime
}

export const Helmet: FC<any> = ({ title, meta }) => {
  return (
    <div>
      <title>{title}</title>
      {meta.map(m => {
        return (
          <meta
            key={m.name}
            name={m.name}
            content={m.content}
            data-react-helmet
            data-testid={m.name}
          />
        )
      })}
    </div>
  )
}

export const withRuntimeContext: FC<any> = WrappedComponent => {
  return props => {
    return <WrappedComponent {...props} runtime={fakeRuntime} />
  }
}
