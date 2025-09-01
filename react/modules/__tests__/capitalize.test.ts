/* eslint-env jest */
import { capitalize } from '../capitalize'

describe('capitalize function', () => {
  it('should capitalize the first letter of a string', () => {
    expect(capitalize('hello')).toBe('Hello')
    expect(capitalize('world')).toBe('World')
    expect(capitalize('test')).toBe('Test')
  })

  it('should return undefined when input is undefined', () => {
    expect(capitalize(undefined)).toBeUndefined()
  })

  it('should handle empty string correctly', () => {
    expect(capitalize('')).toBe('')
  })

  it('should handle single character strings', () => {
    expect(capitalize('a')).toBe('A')
    expect(capitalize('z')).toBe('Z')
    expect(capitalize('1')).toBe('1')
  })

  it('should preserve the rest of the string unchanged', () => {
    expect(capitalize('hELLO')).toBe('HELLO')
    expect(capitalize('tEST cASE')).toBe('TEST cASE')
    expect(capitalize('mixedCaseString')).toBe('MixedCaseString')
  })

  it('should handle strings with special characters', () => {
    expect(capitalize('!hello')).toBe('!hello')
    expect(capitalize('@test')).toBe('@test')
    expect(capitalize('123abc')).toBe('123abc')
  })

  it('should handle strings starting with numbers', () => {
    expect(capitalize('1hello')).toBe('1hello')
    expect(capitalize('9test')).toBe('9test')
  })

  it('should handle strings with spaces', () => {
    expect(capitalize(' hello')).toBe(' hello')
    expect(capitalize('hello world')).toBe('Hello world')
  })
})