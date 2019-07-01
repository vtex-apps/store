import React from 'react'

export const useRuntime = () => {
  return {
    account: 'vtex',
    getSettings: () => ({
      storeName: 'Store Name',
      titleTag: 'Store TitleTag',
    }),
    culture: { currency: 'BRL', locale: 'pt-BR' },
  }
}

export const Helmet = ({ title, meta }) => {
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
