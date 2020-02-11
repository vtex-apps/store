import { pluck, values } from 'ramda'

const gapPaddingTypes = {
  NONE: {
    name: 'admin/editor.shelf.gapType.none',
    value:'ph0',
  },
  SMALL: {
    name: 'admin/editor.shelf.gapType.small',
    value:'ph3',
  },
  MEDIUM: {
    name: 'admin/editor.shelf.gapType.medium',
    value:'ph5',
  },
  LARGE: {
    name: 'admin/editor.shelf.gapType.large',
    value:'ph7',
  },
}

export const getGapPaddingNames = () => values(pluck('name', gapPaddingTypes))

export const getGapPaddingValues = () => values(pluck('value', gapPaddingTypes))

export default gapPaddingTypes