export const useCssHandles = (cssHandles: string[]) => {
  const handles: any = {}
  cssHandles.forEach(handle => {
    handles[handle] = handle
  })

  return handles
}