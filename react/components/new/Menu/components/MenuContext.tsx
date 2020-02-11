import { createContext } from 'react'

const MenuContext = createContext<MenuContextValue>({
  experimentalOptimizeRendering: false,
  hasTitle: false,
  orientation: 'horizontal',
  textType: 't-body',
})

interface MenuContextValue {
  hasTitle: boolean
  orientation: 'horizontal' | 'vertical'
  textType: string
  experimentalOptimizeRendering?: boolean
}

export default MenuContext
