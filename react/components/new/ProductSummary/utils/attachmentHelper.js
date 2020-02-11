import { pathOr } from 'ramda'

export const CHOICE_TYPES = {
  SINGLE: 'SINGLE',
  MULTIPLE: 'MULTIPLE',
  TOGGLE: 'TOGGLE',
}

export const getProductPrice = product =>
  pathOr(0, ['sku', 'seller', 'commertialOffer', 'Price'], product)
