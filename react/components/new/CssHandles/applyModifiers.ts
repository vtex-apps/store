const validateModifier = (modifier: string) => {
  if (typeof modifier !== 'string') {
    console.error(
      `Invalid modifier type on \`cssHandles.applyModifier\`. All modifiers should be strings, found "${modifier}" `
    )
    return false
  }

  /* This is not an error, so doesn't log any message, but should
   * invalidate the current modifier and not include it*/
  if (modifier === '') {
    return false
  }

  if (/[^A-z0-9-]/.test(modifier)) {
    console.error(
      `Invalid modifier on \`cssHandles.applyModifier\`. Modifiers should contain only letters, numbers or -`
    )
    return false
  }

  return true
}

const applyModifiers = (handles: string, modifier: string | string[]) => {
  const normalizedModifiers =
    typeof modifier === 'string' ? [modifier] : modifier
  if (!Array.isArray(normalizedModifiers)) {
    console.error(
      'Invalid modifier type on `cssHandles.applyModifier`. Please use either a string or an array of strings'
    )
    return handles
  }

  const splitHandles = handles.split(' ')

  const modifiedHandles = normalizedModifiers
    .map(currentModifier => {
      const isValid = validateModifier(currentModifier)

      if (!isValid) {
        return ''
      }

      return splitHandles
        .map(handle => `${handle}--${currentModifier}`)
        .join(' ')
        .trim()
    })
    .filter(l => l.length > 0)
    .join(' ')
    .trim()

  return splitHandles
    .concat(modifiedHandles)
    .join(' ')
    .trim()
}

export default applyModifiers
