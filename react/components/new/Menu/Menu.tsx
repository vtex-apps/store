import React, { useContext, useMemo } from 'react'

import classNames from 'classnames'
import { defineMessages } from 'react-intl'

import CategoryMenu from './components/CategoryMenu'
import Item from './components/Item'
import LevelContext from './components/LevelContext'
import MenuContext from './components/MenuContext'
import MenuItem, { MenuItemSchema } from './MenuItem'

import useCssHandles from '../CssHandles/useCssHandles'  

const CSS_HANDLES = ['menuContainer', 'menuContainerNav'] as const

const TypographyMap: Record<string, string> = {
  body: 't-body',
  heading1: 't-heading-1',
  heading2: 't-heading-2',
  heading3: 't-heading-3',
  heading4: 't-heading-4',
  heading5: 't-heading-5',
  mini: 't-mini',
  small: 't-small',
}

const Menu: StorefrontFunctionComponent<MenuSchema> = ({
  orientation = 'horizontal',
  textType,
  title,
  categoryId,
  items: itemsProps = [],
  children,
  experimentalOptimizeRendering = false,
}) => {
  const level = useContext(LevelContext)
  const handles = useCssHandles(CSS_HANDLES)
  const menuContext = useMemo(
    () => ({
      experimentalOptimizeRendering,
      hasTitle: title || categoryId ? true : false,
      orientation,
      textType: textType ? TypographyMap[textType] : TypographyMap.body,
    }),
    [orientation, textType]
  )

  const menuItems = itemsProps.map(
    ({ itemProps: { text }, itemProps, ...rest }) => (
      <MenuItem key={text} itemProps={itemProps} {...rest} />
    )
  )

  return (
    <LevelContext.Provider value={level + 1}>
      <MenuContext.Provider value={menuContext}>
          <nav className={handles.menuContainerNav}>
            <ul
              className={classNames(handles.menuContainer, 'list flex pl0 mv0', {
                'flex-column': orientation === 'vertical',
                'flex-row': orientation === 'horizontal',
              })}
            >
              {!categoryId && title && <Item {...title} isTitle />}
              {categoryId && <CategoryMenu categoryId={categoryId} />}
              {children}
              {menuItems}
            </ul>
          </nav>
      </MenuContext.Provider>
    </LevelContext.Provider>
  )
}

interface MenuSchema {
  orientation?: 'vertical' | 'horizontal'
  categoryId?: number
  textType?: Typography
  title?: MenuItemSchema
  additionalDef?: string
  blockClass?: string
  items?: MenuItemSchema[]
  experimentalOptimizeRendering?: boolean
}

enum Typography {
  heading1 = 't-heading-1',
  heading2 = 't-heading-2',
  heading3 = 't-heading-3',
  heading4 = 't-heading-4',
  heading5 = 't-heading-5',
  body = 't-body',
  small = 't-small',
  mini = 't-mini',
}

const messages = defineMessages({
  categoryDef: {
    defaultMessage: '',
    id: 'admin/editor.menu.def.category',
  },
  categoryIdTitle: {
    defaultMessage: '',
    id: 'admin/editor.menu.categoryId.title',
  },
  defTitle: {
    defaultMessage: '',
    id: 'admin/editor.menu.additionalDef.title',
  },
  horizontalLabel: {
    defaultMessage: '',
    id: 'admin/editor.menu.orientation.horizontal.label',
  },
  menuTitle: {
    defaultMessage: '',
    id: 'admin/editor.future-menu.title',
  },
  noneDef: {
    defaultMessage: '',
    id: 'admin/editor.menu.def.none',
  },
  orientationTitle: {
    defaultMessage: '',
    id: 'admin/editor.menu.orientation.title',
  },
  titleDef: {
    defaultMessage: '',
    id: 'admin/editor.menu.def.title',
  },
  typographyTitle: {
    defaultMessage: '',
    id: 'admin/editor.menu.typography.title',
  },
  verticalLabel: {
    defaultMessage: '',
    id: 'admin/editor.menu.orientation.vertical.label',
  },
})

Menu.getSchema = () => {
  // tslint:disable: object-literal-sort-keys
  return {
    title: messages.menuTitle.id,
  }
}

export default Menu
