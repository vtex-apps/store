import { useContext } from 'react'
import { ListContext } from './ListContextProvider'

const useListContext = () => {
  return useContext(ListContext)
}

export default useListContext
