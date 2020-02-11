import { useMemo } from 'react'
import { useExtension } from './hooks/useExtension'
import applyModifiers from './applyModifiers'

/** Verifies if the handle contains only letters and numbers, and does not begin with a number  */
const validateCssHandle = (handle: string) => !/^\d|[^A-z0-9]/.test(handle)

const parseComponentName = (componentName: string) => {
  /* Matches until the first `.` or `@`.
   * Used to split something like `vtex.style-guide@2.0.1` into
   * `vtex`, `style-guide`, and `2`. */
  const splitAppName = /[^@.]+/g

  /* regex.exec is stateful, this is why running the command 3 times
   * provides 3 different results. Yeah I know.
   * There exists a `String.matchAll()` function but it's not
   * supported on Safari */
  const [vendor] = splitAppName.exec(componentName) || [null]
  const [name] = splitAppName.exec(componentName) || [null]
  const [major] = splitAppName.exec(componentName) || [null]

  return { vendor, name, major }
}

const normalizeComponentName = (componentName: string) => {
  const { vendor, name, major } = parseComponentName(componentName)

  return vendor && name && major && `${vendor}-${name}-${major}-x`
}

const generateCssHandles = <T extends CssHandlesInput>(
  namespace: string,
  handles: T,
  modifiers?: string | string[]
) => {
  return handles.reduce<Record<string, string>>((acc, handle) => {
    const isValid = !!namespace && validateCssHandle(handle)
    const transformedHandle = `${namespace}-${handle}`
    acc[handle] = isValid
      ? modifiers
        ? applyModifiers(transformedHandle, modifiers)
        : transformedHandle
      : ''

    if (!isValid) {
      console.error(
        `Invalid CSS handle "${handle}". It should only contain letters or numbers, and should start with a letter.`
      )
    }

    return acc
  }, {}) as CssHandles<T>
}

/**
 * Useful for creating CSS handles without creating a CSS file with empty
 * declarations.
 * Receives an array of strings (e.g. ['foo', 'bar']) and returns an
 * object with generated css class names, e.g.
 * { foo: 'vendor-appname-1-x-foo', bar: 'vendor-appname-1-x-bar' }.
 */
const useCssHandles = <T extends CssHandlesInput>(
  handles: T,
  options: CssHandlesOptions = {}
): CssHandles<T> => {
  const extension = useExtension()

  const { props = {}, component = '' } = extension || {}
  const blockClass = props.cssHandle || props.blockClass

  const values = useMemo<CssHandles<T>>(() => {
    const { migrationFrom } = options
    const normalizedComponent = normalizeComponentName(component)

    const namespaces = normalizedComponent ? [normalizedComponent] : []
    if (migrationFrom) {
      const migrations = Array.isArray(migrationFrom)
        ? migrationFrom
        : [migrationFrom]

      const normalizedMigrations = migrations
        .map(normalizeComponentName)
        .filter(
          current => !!current && current !== normalizedComponent
        ) as string[]

      namespaces.push(...normalizedMigrations)
    }

    return namespaces
      .map(component => generateCssHandles(component, handles, blockClass))
      .reduce<CssHandles<T>>(
        (acc: null | CssHandles<T>, cur: CssHandles<T>) => {
          if (!acc) {
            return cur
          }
          Object.keys(cur).forEach((key: ValueOf<T>) => {
            acc[key] = `${acc[key]} ${cur[key]}`
          })
          return acc
        },
        undefined as any
      )
  }, [blockClass, component, handles, options])

  return values
}

export default useCssHandles
