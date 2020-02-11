import classNames from 'classnames'
import React from 'react'
import { defineMessages } from 'react-intl'

import useCssHandles from '../CssHandles/useCssHandles'

const CSS_HANDLES = ['submenu', 'submenuWrapper', 'submenuContainer'] as const

const MAX_TACHYONS_SCALE = 11
export type TachyonsScaleInput = string | number | undefined

/** TODO: This function is copied from the flex-layout app.
 * It should probably be exported to a separate package.
 */
const parseTachyonsValue = (value: TachyonsScaleInput, name?: string) => {
  if (!value) {
    return 0
  }

  const parsedValue = typeof value === 'string' ? parseInt(value, 10) : value

  if (isNaN(parsedValue) || String(parsedValue) !== String(value) || parsedValue < 0 || parsedValue > MAX_TACHYONS_SCALE) {
    if (name) {
      console.warn(`Invalid ${name} value. It should be an integer between 0 and ${MAX_TACHYONS_SCALE}.`)
    }
    return 0
  }

  return parsedValue
}


const Submenu: StorefrontFunctionComponent<SubmenuProps> = ({
  isOpen,
  width,
  children,
  orientation = Orientation.horizontal,
  paddingTop = 4,
  paddingBottom = 4,
}) => {
  console.log('teste SHOWING SUBMENU')
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={`${handles.submenuContainer} ${width === '100%' ? '' : 'relative'}`}>
      <div
        className={classNames(handles.submenuWrapper, `absolute left-0 bg-base pt${parseTachyonsValue(paddingTop, 'paddingTop')} pb${parseTachyonsValue(paddingBottom, 'paddingBottom')} bw1 bb b--muted-3 z-2`,
          {
            dn: !isOpen,
            flex: isOpen,
            'w-100': width === '100%',
            'w-auto ml6': width === 'auto',
          }
        )}
      >
        <section className={classNames(handles.submenu, 'w-100 flex justify-center', { 'flex-column': orientation === Orientation.vertical })}>{children}</section>
      </div>
    </div>
  )
}

enum Orientation {
  horizontal = 'horizontal',
  vertical = 'vertical',
}


export interface SubmenuProps extends SubmenuSchema {
  isOpen: boolean
  orientation: Orientation
  paddingTop: number | string
  paddingBottom: number | string
  blockClass?: string
}

interface SubmenuSchema {
  width: '100%' | 'auto'
}

const messages = defineMessages({
  submenuTitle: {
    defaultMessage: '',
    id: 'admin/editor.menu.submenu.title',
  },
  submenuWidthTitle: {
    defaultMessage: '',
    id: 'admin/editor.menu.item.submenuWidth.title',
  },
})

// tslint:disable: object-literal-sort-keys
Submenu.getSchema = () => ({
  title: messages.submenuTitle.id,
})

export default Submenu
