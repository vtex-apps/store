import { useRuntime, useTreePath } from 'vtex.render-runtime'

/** This code has been copied and adapted from vtex.render-runtime,
 * while it doesn't export this hook */

function mountTreePath(base: string, children: string[]) {
  return [base, ...children].filter(id => !!id).join('/')
}

interface Options {
  children?: string[] | string
}

interface Extension {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  props?: Record<string, any>
  component?: string
  [key: string]: any
}

export const useExtension = ({ children }: Options = {}): Extension | null => {
  const { extensions } = useRuntime()

  const { treePath: baseTreePath } = useTreePath()

  const treePath = children
    ? mountTreePath(
        baseTreePath,
        Array.isArray(children) ? children : [children]
      )
    : baseTreePath

  const extension = treePath && extensions[treePath]

  return (extension as Extension) || null
}
