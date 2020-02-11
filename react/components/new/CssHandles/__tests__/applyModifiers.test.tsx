import applyModifiers from '../applyModifiers'

console.error = jest.fn()

describe('applyModifier', () => {
  it('should apply a single modifier properly', () => {
    const handle = 'vtex-app-2-x-handle vtex-app-2-x-handle--blockClass'
    const modifier = 'test'

    const modified = applyModifiers(handle, modifier)

    expect(modified).toBe(
      'vtex-app-2-x-handle vtex-app-2-x-handle--blockClass vtex-app-2-x-handle--test vtex-app-2-x-handle--blockClass--test'
    )
  })
  it('should apply multiple modifiers properly', () => {
    const handle = 'vtex-app-2-x-handle vtex-app-2-x-handle--blockClass'
    const modifiers = ['test', 'test2']

    const modified = applyModifiers(handle, modifiers)

    expect(modified).toBe(
      'vtex-app-2-x-handle vtex-app-2-x-handle--blockClass vtex-app-2-x-handle--test vtex-app-2-x-handle--blockClass--test vtex-app-2-x-handle--test2 vtex-app-2-x-handle--blockClass--test2'
    )
  })
  it('should not apply modifier if its not a string', () => {
    const handle = 'vtex-app-2-x-handle vtex-app-2-x-handle--blockClass'
    const modifier = 0 as any

    const modified = applyModifiers(handle, modifier)

    expect(modified).toBe('vtex-app-2-x-handle vtex-app-2-x-handle--blockClass')
  })

  describe('validation', () => {
    it('should refrain from applying a modifier from an array if its not a string', () => {
      const handle = 'vtex-app-2-x-handle vtex-app-2-x-handle--blockClass'
      const modifiers = ['ok', 0, null] as any

      const modified = applyModifiers(handle, modifiers)

      expect(modified).toBe(
        'vtex-app-2-x-handle vtex-app-2-x-handle--blockClass vtex-app-2-x-handle--ok vtex-app-2-x-handle--blockClass--ok'
      )
    })
    it('should not apply a modifier with spaces, should allow with dashes', () => {
      const handle = 'vtex-app-2-x-handle vtex-app-2-x-handle--blockClass'
      const modifiers = ['ok', 'test 1', 'test-2', 'test\t3', 'test\n4']

      const modified = applyModifiers(handle, modifiers)

      expect(modified).toBe(
        'vtex-app-2-x-handle vtex-app-2-x-handle--blockClass vtex-app-2-x-handle--ok vtex-app-2-x-handle--blockClass--ok vtex-app-2-x-handle--test-2 vtex-app-2-x-handle--blockClass--test-2'
      )
    })
    it('should not apply a modifier if its empty', () => {
      const handle = 'vtex-app-2-x-handle vtex-app-2-x-handle--blockClass'
      const modifiers = ['ok', '', '\t', ' ']

      const modified = applyModifiers(handle, modifiers)

      expect(modified).toBe(
        'vtex-app-2-x-handle vtex-app-2-x-handle--blockClass vtex-app-2-x-handle--ok vtex-app-2-x-handle--blockClass--ok'
      )
    })
  })
})
