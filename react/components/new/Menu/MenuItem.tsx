import { path } from 'ramda'
import React, { Reducer, useReducer, useContext } from 'react'

import classNames from 'classnames'

import { defineMessages } from 'react-intl'
// import { ExtensionPoint } from 'vtex.render-runtime'
import { CategoryItemSchema } from './components/CategoryItem'
import { CustomItemSchema } from './components/CustomItem'
import Item from './components/Item'
import { IconProps} from './components/StyledLink'
import useSubmenuImplementation from './hooks/useSubmenuImplementation'

import useCssHandles from '../CssHandles/useCssHandles'
import MenuContext from './components/MenuContext'

const CSS_HANDLES = ['menuItem', 'menuItemInnerDiv']

const submenuInitialState = {
  hasBeenActive: false,
  isActive: false,
}

type SubmenuState = typeof submenuInitialState

type SubmenuAction = 
  | {type: 'SHOW_SUBMENU'}
  | {type: 'HIDE_SUBMENU'}

const submenuReducer: Reducer<SubmenuState, SubmenuAction> =  (state, action) => {
  switch (action.type) {
    case 'SHOW_SUBMENU':
      return {
        hasBeenActive: true,
        isActive: true,
      }
    case 'HIDE_SUBMENU':
      return {
        ...state,
        isActive: false,
      }
    default:
      return state
  }
}

const MenuItem: StorefrontFunctionComponent<MenuItemSchema> = ({
  children,
  ...props
}) => {
  const { experimentalOptimizeRendering } = useContext(MenuContext)
  const [{ isActive, hasBeenActive }, dispatch] = useReducer(submenuReducer, submenuInitialState)
  const handles = useCssHandles(CSS_HANDLES)

  const setActive = (value: boolean) => {
    dispatch({ type: value ? 'SHOW_SUBMENU' : 'HIDE_SUBMENU' })
  }

  /* This is a temporary check of which kind of submenu is being
   * inserted. This will be replaced by new functionality of useChildBlocks
   * in the future. */
  const submenuImplementation = useSubmenuImplementation()
  const isCollapsible = submenuImplementation === 'submenu.accordion'
  console.log('teste CHILDREN: ', children)

  if (isCollapsible) {
    console.log('teste isCollapsible: ')
    return (
      <li className={classNames(handles.menuItem, 'list')}>
        <div className={handles.menuItemInnerDiv}
          onClick={event => {
            setActive(!isActive)
            event.stopPropagation()
          }}>
          <Item {...props} accordion active={isActive} />
        </div>
        {(hasBeenActive || !experimentalOptimizeRendering) && children && ( /* Collapsible menus need to still persist after being open,
                             * to make the closing transition work properly */
          <>
            {/* <ExtensionPoint id="submenu" isOpen={isActive} />
            <ExtensionPoint id="unstable--submenu" isOpen={isActive} /> */}
            {/* <S */}
            {/* {props.submenuProps ? <Submenu {...props.submenuProps} /> : null} */}
            {/* {children} */}
            {React.cloneElement(children, { isOpen: isActive})}
          </>
        )}
      </li>
    )
  }

  return (
    <li
      className={classNames(handles.menuItem, 'list')}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}>
      <Item {...props} active={isActive} />
      {(isActive || !experimentalOptimizeRendering) && children && (
        <>
        {/* {children} */}
          {React.cloneElement(children, { isOpen: isActive})}
          {/* <ExtensionPoint id="submenu" isOpen={isActive} />
          <ExtensionPoint id="unstable--submenu" isOpen={isActive} /> */}
        </>
      )}
    </li>
  )
}

export interface MenuItemSchema {
  id: string
  type: 'category' | 'custom'
  iconProps: IconProps
  iconPosition: 'left' | 'right'
  highlight: boolean
  itemProps: CategoryItemSchema | CustomItemSchema
  blockClass?: string
  experimentalOptimizeRendering?: boolean
  submenuProps?: any
}

const messages = defineMessages({
  categoryIdTitle: {
    defaultMessage: '',
    id: 'admin/editor.menu.item.params.categoryId.title',
  },
  categoryTitle: {
    defaultMessage: '',
    id: 'admin/editor.menu.item.category.title',
  },
  customTitle: {
    defaultMessage: '',
    id: 'admin/editor.menu.item.custom.title',
  },
  customTypeTitle: {
    defaultMessage: '',
    id: 'admin/editor.menu.item.params.type.title',
  },
  externalTitle: {
    defaultMessage: '',
    id: 'admin/editor.menu.item.params.external.title',
  },
  highlightTitle: {
    defaultMessage: '',
    id: 'admin/editor.menu.item.highlight.title',
  },
  hrefTitle: {
    defaultMessage: '',
    id: 'admin/editor.menu.item.params.href.title',
  },
  iconIdTitle: {
    defaultMessage: '',
    id: 'admin/editor.menu.item.iconId.title',
  },
  internalTitle: {
    defaultMessage: '',
    id: 'admin/editor.menu.item.params.internal.title',
  },
  itemIdTitle: {
    defaultMessage: '',
    id: 'admin/editor.menu.item.id.title',
  },
  itemsTitle: {
    defaultMessage: '',
    id: 'admin/editor.menu.items.title',
  },
  noFollowTitle: {
    defaultMessage: '',
    id: 'admin/editor.menu.item.params.noFollow.title',
  },
  paramsTextTitle: {
    defaultMessage: '',
    id: 'admin/editor.menu.item.params.text.title',
  },
  paramsTitle: {
    defaultMessage: '',
    id: 'admin/editor.menu.item.params.title',
  },
  tagTitleTitle: {
    defaultMessage: '',
    id: 'admin/editor.menu.item.params.tagTitle.title',
  },
  typeTitle: {
    defaultMessage: '',
    id: 'admin/editor.menu.item.type.title',
  },
})

MenuItem.getSchema = props => {
  const text = path(['itemProps', 'text'], props)
  const id = props && props.id ? props.id : ''

  // tslint:disable: object-literal-sort-keys
  return {
    title: [text, id, messages.itemsTitle.id].find(e => !!e),
    type: 'object',
    required: ['type'],
    properties: {
      id: {
        default: id,
        title: messages.itemIdTitle.id,
        type: 'string',
      },
    },
  }
}

export default MenuItem

