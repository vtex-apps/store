import React, { ReactElement, Suspense, useReducer } from 'react'
import { defineMessages } from 'react-intl'

import IconClose from '../StoreIcons/IconClose'
import IconMenu from '../StoreIcons/IconMenu'
import useCssHandles from '../CssHandles/useCssHandles'

import Overlay from './Overlay'
import Portal from './Portal'
import useLockScroll from './modules/useLockScroll'

const Swipable = React.lazy(() => import('./Swipable'))

interface MenuState {
  isOpen: boolean
  hasBeenOpened: boolean
}

interface MenuAction {
  type: 'open' | 'close'
}

const initialMenuState: MenuState = {
  isOpen: false,
  hasBeenOpened: false,
}

function menuReducer(state: MenuState, action: MenuAction) {
  switch (action.type) {
    case 'open':
      return {
        ...state,
        isOpen: true,
        hasBeenOpened: true,
      }
    case 'close':
      return {
        ...state,
        isOpen: false,
      }
    default:
      return state
  }
}

const useMenuState = () => {
  const [state, dispatch] = useReducer(menuReducer, initialMenuState)
  const setLockScroll = useLockScroll()

  const setMenuOpen = (value: boolean) => {
    dispatch({ type: value ? 'open' : 'close' })
    setLockScroll(value)
  }

  const openMenu = () => setMenuOpen(true)
  const closeMenu = () => setMenuOpen(false)

  return {
    state,
    openMenu,
    closeMenu,
  }
}

const CSS_HANDLES = [
  'openIconContainer',
  'drawer',
  'closeIconContainer',
  'childrenContainer',
  'closeIconButton',
]

const Drawer: StorefrontComponent<
  DrawerSchema & { customIcon: ReactElement }
> = ({
  width,
  customIcon,
  maxWidth = 450,
  isFullWidth,
  slideDirection = 'horizontal',
  children,
}) => {
  const { state: menuState, openMenu, closeMenu } = useMenuState()
  const { isOpen: isMenuOpen, hasBeenOpened: hasMenuBeenOpened } = menuState
  const handles = useCssHandles(CSS_HANDLES)

  const direction =
    slideDirection === 'horizontal' || slideDirection === 'leftToRight'
      ? 'left'
      : 'right'

  const swipeHandler = direction === 'left' ? 'onSwipeLeft' : 'onSwipeRight'

  return (
    <>
      <div
        className={`pa4 pointer ${handles.openIconContainer}`}
        onClick={openMenu}
        aria-hidden
      >
        {customIcon || <IconMenu size={20} />}
      </div>
      <Portal>
        <Overlay visible={isMenuOpen} onClick={closeMenu} />
        <Suspense fallback={<React.Fragment />}>
          <Swipable
            {...{
              [swipeHandler]: closeMenu,
            }}
            enabled={isMenuOpen}
            position={isMenuOpen ? 'center' : direction}
            allowOutsideDrag
            className={`${handles.drawer} ${
              direction === 'right' ? 'right-0' : 'left-0'
            } fixed top-0 bottom-0 bg-base z-999 flex flex-column`}
            style={{
              width: width || (isFullWidth ? '100%' : '85%'),
              maxWidth,
              minWidth: 280,
              pointerEvents: isMenuOpen ? 'auto' : 'none',
            }}
          >
            <div
              style={{
                WebkitOverflowScrolling: 'touch',
                overflowY: 'scroll',
              }}
            >
              <div className={`flex ${handles.closeIconContainer}`}>
                <button
                  className={`${handles.closeIconButton} pa4 pointer bg-transparent transparent bn pointer`}
                  onClick={closeMenu}
                >
                  <IconClose size={30} type="line" />
                </button>
              </div>
              <div className={`${handles.childrenContainer} flex flex-grow-1`}>
                {hasMenuBeenOpened && children}
              </div>
            </div>
          </Swipable>
        </Suspense>
      </Portal>
    </>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.drawer.title',
  },
})

Drawer.getSchema = () => {
  return {
    title: messages.title.id,
  }
}

export default Drawer
