import useDevice from '../../DeviceDetector/useDevice'
import {
  normalizeResponsiveInput,
  MaybeResponsiveInput,
} from './normalizeResponsiveInput'

const useResponsiveValue = <T>(input: MaybeResponsiveInput<T>): T => {
  const { device } = useDevice()

  return normalizeResponsiveInput(input)[device]
}

const useResponsiveValues = <U>(input: U): U => {
  const { device } = useDevice()

  const keys = Object.keys(input) as (keyof U)[]

  let returnValue = { ...input }

  keys.forEach(key => {
    returnValue[key] = normalizeResponsiveInput(input[key])[device]
  })

  return returnValue
}

export { useResponsiveValue, useResponsiveValues }
