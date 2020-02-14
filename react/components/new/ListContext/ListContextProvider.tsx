import React, { useMemo, FC } from 'react'

export interface ListContextProps {
  list: JSX.Element[]
}

export const ListContext = React.createContext<ListContextProps>({
  list: [],
})
ListContext.displayName = 'ListContext'

const ListContextProvider: FC<ListContextProps> = ({ list = [], children }) => {
  const value = useMemo(() => ({ list }), [list])
  return <ListContext.Provider value={value}>{children}</ListContext.Provider>
}
ListContextProvider.displayName = 'ListContextProvider'

export default ListContextProvider
