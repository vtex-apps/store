import React, { FunctionComponent, useContext, useMemo } from 'react'

export enum FlexLayoutTypes {
  NONE = 'none',
  ROW = 'row',
  COL = 'col',
}

export interface FlexLayoutContextProps {
  parent: FlexLayoutTypes
  colGap: number
  rowGap: number
}

export type FlexLayoutContextValue = number | FlexLayoutTypes

export type FlexLayoutContext = FlexLayoutContextProps & {
  [key: string]: FlexLayoutContextValue
}

const FlexLayoutContext = React.createContext<FlexLayoutContext>({
  parent: FlexLayoutTypes.NONE,
  colGap: 0,
  rowGap: 0,
})

export const FlexLayoutContextProvider: FunctionComponent<
  FlexLayoutContextProps
> = ({ parent, colGap, rowGap, children }) => {
  const value = useMemo(
    () => ({
      parent,
      colGap,
      rowGap,
    }),
    [parent, colGap, rowGap]
  )

  return (
    <FlexLayoutContext.Provider value={value}>
      {children}
    </FlexLayoutContext.Provider>
  )
}

export const useFlexLayoutContext = () => useContext(FlexLayoutContext)
