import { values, map } from 'ramda'

const displayButtonTypes = {
  DISPLAY_ALWAYS: {
    name: 'admin/editor.productSummary.displayBuyButton.option.always',
    value: 'displayButtonAlways',
  },
  DISPLAY_ON_HOVER: {
    name: 'admin/editor.productSummary.displayBuyButton.option.hover',
    value: 'displayButtonHover',
  },
  DISPLAY_NONE: {
    name: 'admin/editor.productSummary.displayBuyButton.option.none',
    value: 'displayButtonNone',
  },
}

export function getDisplayButtonNames() {
  return map(opt => opt.name, values(displayButtonTypes))
}

export function getDisplayButtonValues() {
  return map(opt => opt.value, values(displayButtonTypes))
}

export default displayButtonTypes
