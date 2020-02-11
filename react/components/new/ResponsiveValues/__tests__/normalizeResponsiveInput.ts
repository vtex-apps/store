import {
  isResponsiveInput,
  normalizeResponsiveInput,
} from '../hooks/normalizeResponsiveInput'

console.warn = jest.fn()

describe('useResponsiveValue', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  describe('isResponsiveInput', () => {
    it('should return false if passed null', () => {
      const value = null

      expect(isResponsiveInput(value)).toBe(false)
    })
    it('should return false if passed a non-object', () => {
      const value = 2

      expect(isResponsiveInput(value)).toBe(false)
    })
    it('should return true if passed an object with a single device', () => {
      const value = {
        desktop: 1,
      }

      expect(isResponsiveInput(value)).toBe(true)
    })
    it('should return true if passed an object with all devices', () => {
      const value = {
        desktop: 1,
        mobile: 1,
        tablet: 1,
        phone: 1,
      }

      expect(isResponsiveInput(value)).toBe(true)
    })
    it('should return false if passed an object with an extraneous key', () => {
      const value = {
        desktop: 1,
        mobile: 1,
        tablet: 1,
        phone: 1,
        oops: 0,
      }

      expect(isResponsiveInput(value)).toBe(false)
    })
  })

  describe('responsiveValue', () => {
    it('should complain if "mobile" is defined along with "tablet"', () => {
      const value = {
        tablet: 1,
        phone: 1,
        mobile: 2,
        desktop: 3,
      }

      const result = normalizeResponsiveInput(value)

      expect(console.warn).toBeCalled()

      expect(result).toStrictEqual({
        phone: 1,
        tablet: 1,
        desktop: 3,
      })
    })

    it('should return an object with equal keys if the input has all the parameters', () => {
      const value = {
        desktop: 1,
        tablet: 2,
        phone: 3,
      }

      expect(normalizeResponsiveInput(value)).toStrictEqual({
        desktop: 1,
        tablet: 2,
        phone: 3,
      })
    })

    describe('fallbacks', () => {
      describe('single values should populate the object', () => {
        it('should work with straight values', () => {
          const value = 1

          expect(normalizeResponsiveInput(value)).toStrictEqual({
            desktop: 1,
            tablet: 1,
            phone: 1,
          })
        })
        it('should work with "desktop"', () => {
          const value = { desktop: 1 }

          expect(normalizeResponsiveInput(value)).toStrictEqual({
            desktop: 1,
            tablet: 1,
            phone: 1,
          })
        })
        it('should work with "mobile"', () => {
          const value = { mobile: 1 }

          expect(normalizeResponsiveInput(value)).toStrictEqual({
            desktop: 1,
            tablet: 1,
            phone: 1,
          })
        })
        it('should work with "tablet"', () => {
          const value = { tablet: 1 }

          expect(normalizeResponsiveInput(value)).toStrictEqual({
            desktop: 1,
            tablet: 1,
            phone: 1,
          })
        })
        it('should work with "phone"', () => {
          const value = {
            phone: 1,
          }

          expect(normalizeResponsiveInput(value)).toStrictEqual({
            desktop: 1,
            tablet: 1,
            phone: 1,
          })
        })
      })
      it('tablet should fallback to desktop instead of phone, when both are defined', () => {
        const value = {
          desktop: 1,
          phone: 2,
        }

        expect(normalizeResponsiveInput(value)).toStrictEqual({
          desktop: 1,
          tablet: 1,
          phone: 2,
        })
      })
      it('desktop should fallback to tablet instead of phone, when both are defined', () => {
        const value = {
          tablet: 1,
          phone: 2,
        }

        expect(normalizeResponsiveInput(value)).toStrictEqual({
          desktop: 1,
          tablet: 1,
          phone: 2,
        })
      })
      it('phone should fallback to tablet instead of desktop, when both are defined', () => {
        const value = {
          tablet: 1,
          desktop: 2,
        }

        expect(normalizeResponsiveInput(value)).toStrictEqual({
          desktop: 2,
          tablet: 1,
          phone: 1,
        })
      })
      it('tablet should fallback to mobile, ', () => {
        const value = {
          phone: 1,
          mobile: 2,
          desktop: 3,
        }

        expect(normalizeResponsiveInput(value)).toStrictEqual({
          desktop: 3,
          tablet: 2,
          phone: 1,
        })
      })
      it('phone and tablet should override mobile', () => {
        const value = {
          phone: 1,
          mobile: 2,
          tablet: 3,
          desktop: 4,
        }

        expect(normalizeResponsiveInput(value)).toStrictEqual({
          phone: 1,
          tablet: 3,
          desktop: 4,
        })
      })
    })
  })
})
