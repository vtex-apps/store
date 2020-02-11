import React, { FunctionComponent } from 'react'

import useCumulativeHeightState from '../hooks/useCumulativeHeightState'

const RowContext = React.createContext<{
  onResize(height: number): void
  offset: number
}>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onResize: () => {},
  offset: 0,
})

const StickyRows: FunctionComponent = ({ children }) => {
  const { updateRowHeight, getAccumulatedHeight } = useCumulativeHeightState()

  return (
    <React.Fragment>
      {React.Children.map(children, (child, index) => (
        <RowContext.Provider
          value={{
            onResize: (height: number) => updateRowHeight({ height, index }),
            offset: getAccumulatedHeight(index),
          }}
        >
          {child}
        </RowContext.Provider>
      ))}
    </React.Fragment>
  )
}

export default StickyRows
export { RowContext }
