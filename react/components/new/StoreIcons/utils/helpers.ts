import { contains, find, propEq } from 'ramda'
import { ORIENTATIONS, SHAPES, STATES, TYPES } from './enhancements'

/**
 * Get the modifer from any collection matching the rule collection{id, modifier}
 * @param {*} id
 * @param {*} collection
 */
export const getModifier = (collection: Enhancement[], id?: string) => {
  const foundItem = find(propEq('id', id), collection)
  return !!foundItem ? foundItem.modifier : id
}

/**
 * Get a subset of the collections with given ids (passed with commas)
 * @param {*} tokens
 * @param {*} collection
 */
export const getSubset = (tokens: string, collection: Enhancement[]) => {
  const ids = tokens.split(',').join('')
  return collection.filter((item: any) => contains(item.id, ids))
}

/**
 * Get enhancement modifier
 * @param enhancementList list of enhancements
 * @param enhancement desired enhancement
 * @param supported all supported enhancement list
 */
export const getEnhancement = (
  enhancementList: Enhancement[],
  enhancement?: string,
  supported?: string
) => {
  const supportedEnhancements = !!supported
    ? getSubset(supported, enhancementList)
    : enhancementList
  const modifier = getModifier(supportedEnhancements, enhancement)
  return modifier
}

/**
 * Get orientation modifier
 * @param orientation desired orientation
 * @param supported suported orientations
 */
export const getOrientation = (orientation?: string, supported?: string) =>
  getEnhancement(ORIENTATIONS, orientation, supported)

/**
 * Get type modifier
 * @param type desired type
 * @param supported suported types
 */
export const getType = (type?: string, supported?: string) =>
  getEnhancement(TYPES, type, supported)

/**
 * Get state modifier
 * @param state desirend state
 * @param supported suported states
 */
export const getState = (state?: string, supported?: string) =>
  getEnhancement(STATES, state, supported)

/**
 * Get shape modifier
 * @param size icon size
 * @param background background color
 * @param shape desired shape
 * @param supported suported shapes
 */
export const getShape = (
  size: number,
  background: string,
  shape?: string,
  supported?: string
) => {
  const REDUCTION_PERCENTAGE = 0.4
  const getReduction = (size: number) => size * REDUCTION_PERCENTAGE
  const modifiers = getEnhancement(SHAPES, shape, supported)
  const reduction = getReduction(size)
  const padding = reduction / 2
  const reducedIconSize = size - reduction

  const wrapperProps = [
    { className: `${modifiers} flex` },
    { style: { padding, backgroundColor: background } },
  ]

  return { wrapperProps, reducedIconSize }
}
