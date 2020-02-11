/** The user is able to input `mobile` as a device (as opposed to `desktop`),
 * but the output will be converted to `phone` and `tablet` */
export enum InputDevices {
  mobile = 'mobile',
  phone = 'phone',
  tablet = 'tablet',
  desktop = 'desktop',
}

export enum OutputDevices {
  phone = 'phone',
  tablet = 'tablet',
  desktop = 'desktop',
}

export type ResponsiveInput<T> = { [P in keyof typeof InputDevices]?: T }
export type MaybeResponsiveInput<T> = T | ResponsiveInput<T>

export type ResponsiveOutput<T> = { [P in keyof typeof OutputDevices]: T }

//eslint-disable-next-line @typescript-eslint/no-explicit-any
const isUndefined = (value: any) => typeof value === 'undefined'

/** Returns the first argument that is not undefined */
const firstDefinedValue = <T>(...values: T[]): T =>
  values.find(value => !isUndefined(value)) as T

/** Returns the first value of the input that is not undefined,
 * given a sorted array of keys */
const fallbackOrder = <T>(
  input: ResponsiveInput<T>,
  devices: (keyof ResponsiveInput<T>)[]
) => firstDefinedValue(...devices.map(key => input[key])) as T

/** Checks if the input value is a ResponsiveInput type (an object with
 * one or more keys of Device type--e.g. `desktop`, `mobile`) */
//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isResponsiveInput = <T>(value: any): value is ResponsiveInput<T> =>
  Boolean(
    value &&
      Object.keys(InputDevices).some(device => !isUndefined(value[device])) &&
      Object.keys(value).every(key => key in InputDevices)
  )

const showWarnings = <T>(value: ResponsiveInput<T>) => {
  if (!isUndefined(value.mobile)) {
    let devices: string[] = []
    if (!isUndefined(value.phone)) {
      devices.push('"phone"')
    }
    if (!isUndefined(value.tablet)) {
      devices.push('"tablet"')
    }
    if (devices.length === 0) {
      return
    }
    const devicesLabel = devices.join(' and ')
    console.warn(
      `You are defining a "mobile" value along with ${devicesLabel} ${
        devices.length > 1 ? 'values' : 'value'
      } in the props of a component. Please use "phone" and "tablet" in this case.`
    )
  }
}

/** Takes an input that might be a responsive object or not
 * (i.e. either "prop: {mobile: 1, desktop:2}" or just "prop: 2")
 * and returns an object of the values broken down into devices
 * (i.e. {phone: 1, tablet: 1, desktop: 2})
 */
export const normalizeResponsiveInput = <T>(
  value: MaybeResponsiveInput<T>
): ResponsiveOutput<T> => {
  if (isResponsiveInput(value)) {
    const { mobile, tablet, phone, desktop } = InputDevices

    showWarnings(value)

    return {
      phone: fallbackOrder(value, [phone, mobile, tablet, desktop]),
      tablet: fallbackOrder(value, [tablet, mobile, desktop, phone]),
      desktop: fallbackOrder(value, [desktop, tablet, phone, mobile]),
    }
  }

  return {
    phone: value,
    tablet: value,
    desktop: value,
  }
}
