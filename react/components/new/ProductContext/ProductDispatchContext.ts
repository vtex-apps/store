import { createContext, useContext, Dispatch } from 'react'

export const ProductDispatchContext = createContext<Dispatch<Actions> | null>(
  null
)
function useProductDispatch() {
  return useContext(ProductDispatchContext)
}
export default { ProductDispatchContext, useProductDispatch }
