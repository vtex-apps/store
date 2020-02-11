import useCssHandles from '../useCssHandles'
import { useExtension } from '../hooks/useExtension'

jest.mock('react', () => ({
  useMemo: (callback: () => any) => callback(),
}))

jest.mock('../hooks/useExtension', () => ({
  useExtension: jest.fn(() => ({
    component: 'vtex.app@2.1.0',
    props: {
      blockClass: 'blockClass',
    },
  })),
}))

console.error = jest.fn()

describe('useCssHandles', () => {
  it('should apply proper classes to proper handles', () => {
    const CSS_HANDLES = ['element1', 'element2']

    const handles = useCssHandles(CSS_HANDLES)

    expect(handles).toStrictEqual({
      element1: 'vtex-app-2-x-element1 vtex-app-2-x-element1--blockClass',
      element2: 'vtex-app-2-x-element2 vtex-app-2-x-element2--blockClass',
    })
  })
  it('should not apply blockClasses if not available', () => {
    const CSS_HANDLES = ['element1', 'element2']
    ;(useExtension as any).mockImplementationOnce(() => ({
      component: 'vtex.app@2.1.0',
      props: {},
    }))

    const handles = useCssHandles(CSS_HANDLES)

    expect(handles).toStrictEqual({
      element1: 'vtex-app-2-x-element1',
      element2: 'vtex-app-2-x-element2',
    })
  })
  describe('migration', () => {
    it('should add both the current app and the migration app', () => {
      const CSS_HANDLES = ['element1', 'element2']

      const handles = useCssHandles(CSS_HANDLES, {
        migrationFrom: 'vtex.previous-app@3.0.0',
      })

      expect(handles).toStrictEqual({
        element1:
          'vtex-app-2-x-element1 vtex-app-2-x-element1--blockClass vtex-previous-app-3-x-element1 vtex-previous-app-3-x-element1--blockClass',
        element2:
          'vtex-app-2-x-element2 vtex-app-2-x-element2--blockClass vtex-previous-app-3-x-element2 vtex-previous-app-3-x-element2--blockClass',
      })
    })
    it('should add more than one migration if needed', () => {
      const CSS_HANDLES = ['element1', 'element2']

      const handles = useCssHandles(CSS_HANDLES, {
        migrationFrom: ['vtex.previous-app@2.0.0', 'vtex.previous-app@3.0.0'],
      })

      expect(handles).toStrictEqual({
        element1:
          'vtex-app-2-x-element1 vtex-app-2-x-element1--blockClass vtex-previous-app-2-x-element1 vtex-previous-app-2-x-element1--blockClass vtex-previous-app-3-x-element1 vtex-previous-app-3-x-element1--blockClass',
        element2:
          'vtex-app-2-x-element2 vtex-app-2-x-element2--blockClass vtex-previous-app-2-x-element2 vtex-previous-app-2-x-element2--blockClass vtex-previous-app-3-x-element2 vtex-previous-app-3-x-element2--blockClass',
      })
    })

    it('doesnt repeat the migration if the current app happens to be the same as the migration one', () => {
      const CSS_HANDLES = ['element1', 'element2']

      const handles = useCssHandles(CSS_HANDLES, {
        migrationFrom: [
          'vtex.previous-app@2.0.0',
          'vtex.previous-app@3.0.0',
          'vtex.app@2.1.0',
        ],
      })

      expect(handles).toStrictEqual({
        element1:
          'vtex-app-2-x-element1 vtex-app-2-x-element1--blockClass vtex-previous-app-2-x-element1 vtex-previous-app-2-x-element1--blockClass vtex-previous-app-3-x-element1 vtex-previous-app-3-x-element1--blockClass',
        element2:
          'vtex-app-2-x-element2 vtex-app-2-x-element2--blockClass vtex-previous-app-2-x-element2 vtex-previous-app-2-x-element2--blockClass vtex-previous-app-3-x-element2 vtex-previous-app-3-x-element2--blockClass',
      })
    })
  })
})
