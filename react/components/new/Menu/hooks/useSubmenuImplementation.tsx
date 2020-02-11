import { useRuntime, useTreePath } from 'vtex.render-runtime'

/** This is a throwaway function, while useChildBlock doesn't return
 * the "implements" block info, or which specialization of the block
 * is being used (i.e. whether its `submenu` or `submenu.accordion`)
 */
const useSubmenuImplementation = () => {
  const runtime = useRuntime()
  const treePathContext = useTreePath()

  const { treePath } = treePathContext
  const { extensions } = runtime

  if (!extensions || !treePath) {
    return null
  }

  const submenuTreePath = `${treePath}/submenu`

  const extension = extensions[submenuTreePath]

  if (!extension) {
    return null
  }

  const { component } = extension

  if (typeof component === 'string' && component.indexOf('SubmenuAccordion') > -1) {
    return 'submenu.accordion'
  }
  return 'submenu'
}

export default useSubmenuImplementation
