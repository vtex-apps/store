import useEffectSkipMount from '../../components/SKUSelector/components/hooks/useEffectSkipMount'
import { renderHook } from '@vtex/test-tools/react'

it('ensure that function wont be called on first render', () => {
  const fakeFn = jest.fn()
  const deps = ['a']
  const { rerender } = renderHook(() => useEffectSkipMount(fakeFn, deps))
  expect(fakeFn).toBeCalledTimes(0)
  rerender()
  expect(fakeFn).toBeCalledTimes(0)
})

it('ensure that after prop changes, provided function is called', () => {
  const fakeFn = jest.fn()
  const { rerender } = renderHook(({ deps }) => useEffectSkipMount(fakeFn, deps), {
    initialProps: {
      deps: ['a']
    }
  })
  expect(fakeFn).toBeCalledTimes(0)
  rerender({ deps: ['b'] })
  expect(fakeFn).toBeCalledTimes(1)
})
