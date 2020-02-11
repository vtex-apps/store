import { fromPairs, pick, range, toPairs } from 'ramda'

export type TachyonsScaleInput = string | number | undefined
type Group<T, U> = { [key in keyof T]: U }
type TachyonsInputGroup<T> = Group<T, TachyonsScaleInput>
interface ResponsiveInput<T> {
  mobile: T
  desktop: T
}

const MAX_TACHYONS_SCALE = 11

//eslint-disable-next-line @typescript-eslint/no-explicit-any
const isResponsiveInput = <T>(value: any): value is ResponsiveInput<T> =>
  value && value.mobile != null && value.desktop != null

/** Takes a parser of units, and returns a parser that accepts either a
 * value or a responsive input of that same type of value
 * (i.e. {mobile: ..., desktop: ...}), and returns an object of the same
 * format of the input.
 */
export const parseResponsive = <T, U>(parse: (value: T) => U) => (
  value: T | ResponsiveInput<T>
): null | U | { mobile: U; desktop: U } => {
  if (isResponsiveInput(value)) {
    return {
      mobile: parse(value.mobile),
      desktop: parse(value.desktop),
    }
  }

  return parse(value)
}

/** Verifies if the input is a valid Tachyons scale value (i.e. a number
 * between 0 to 11) and converts to number if necessary
 */
const parseTachyonsValue = (value: TachyonsScaleInput, name?: string) => {
  if (!value) {
    return 0
  }

  const supportedValues = range(0, MAX_TACHYONS_SCALE + 1).map(String)

  if (!supportedValues.includes(String(value))) {
    if (name) {
      console.warn(
        `Invalid ${name} value ("${value}"). It should be an integer between 0 and ${MAX_TACHYONS_SCALE}.`
      )
    }

    return 0
  }

  return typeof value === 'string' ? parseInt(value, 10) : value
}

export const parseTachyonsGroup = <T>(group: TachyonsInputGroup<T>) => {
  const pairs = toPairs<TachyonsScaleInput>(group)

  const parsedValues = pairs.map<[string, number]>(([key, value]) => [
    key,
    parseTachyonsValue(value, key),
  ])

  return fromPairs(parsedValues) as Group<T, number>
}

const parseDimension = (input: string): null | number | string => {
  if (typeof input !== 'string') {
    return null
  }

  if (input === 'grow') {
    return 'grow'
  }

  const supportedUnits = ['%']
  const match = input.match(new RegExp(`(\\d*)(${supportedUnits.join('|')})`))

  if (!match) {
    return null
  }

  const value = match[1]
  // TODO: support multiple units
  // const unit = match[2]

  if (value == null) {
    return null
  }

  const parsedValue = parseInt(value, 10)

  return parsedValue
}

export const parseWidth = parseResponsive(parseDimension)

/** TODO: allow responsive values on height
 * (and verify height usage overall)
 **/
export const parseHeight = parseDimension

/** Maps objects keys to Tachyons classes, and returns a function
 * that parses Tachyons scale values to the mapped classes,
 * which in turn returns a string of classNames.
 **/
const mapToClasses = <T>(map: { [key in keyof T]: string }) => (
  props: { [key in keyof T]?: TachyonsScaleInput }
) => {
  const pickedProps = pick(Object.keys(map), props)

  const parsedProps = parseTachyonsGroup(pickedProps)

  const mappedProps = toPairs(parsedProps).map(
    ([key, value]) => `${map[key as (keyof T)] as string}${value}`
  )

  return mappedProps.join(' ')
}

// TODO: allow responsive values on paddings and margins
export const parsePaddings = mapToClasses({
  paddingTop: 'pt',
  paddingBottom: 'pb',
  paddingLeft: 'pl',
  paddingRight: 'pr',
})

export const parseMargins = mapToClasses({
  marginTop: 'mt',
  marginBottom: 'mb',
  marginLeft: 'ml',
  marginRight: 'mr',
})

const borderMap = {
  top: 'bt',
  right: 'br',
  bottom: 'bb',
  left: 'bl',
  all: 'ba',
}

export const parseBorders = ({ border, borderWidth, borderColor }: Border) => {
  const borders = border
    ? ([] as BorderBase[])
        .concat(border)
        .map(base => borderMap[base])
        .join(' ')
    : ''
  const width = borderWidth ? `bw${parseTachyonsValue(borderWidth, 'bw')}` : ''
  const color = borderColor ? `b--${borderColor.split(' ')[0]}` : ''

  return `${borders} ${width} ${color}`
}
