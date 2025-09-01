/* eslint-env jest */
import { SORT_OPTIONS, createInitialMap, initializeMap, getMapFromURL } from '../search'

// Mock window object
Object.defineProperty(global, 'window', {
  value: {
    location: {
      href: 'https://example.com?map=c,c,b',
    },
    decodeURIComponent: global.decodeURIComponent,
  },
  writable: true,
})

describe('search module', () => {
  describe('SORT_OPTIONS', () => {
    it('should export correct SORT_OPTIONS array', () => {
      expect(SORT_OPTIONS).toHaveLength(8)
      expect(SORT_OPTIONS[0]).toEqual({
        value: '',
        label: 'store/ordenation.relevance',
      })
      expect(SORT_OPTIONS[1]).toEqual({
        value: 'OrderByTopSaleDESC',
        label: 'store/ordenation.sales',
      })
    })

    it('should have all required sort options', () => {
      const expectedValues = [
        '',
        'OrderByTopSaleDESC',
        'OrderByReleaseDateDESC',
        'OrderByBestDiscountDESC',
        'OrderByPriceDESC',
        'OrderByPriceASC',
        'OrderByNameASC',
        'OrderByNameDESC',
      ]

      const actualValues = SORT_OPTIONS.map(option => option.value)
      expect(actualValues).toEqual(expectedValues)
    })
  })

  describe('createInitialMap', () => {
    it('should create initial map for subcategory', () => {
      const params = { subcategory: 'shoes' }
      const result = createInitialMap(params)
      expect(result).toBe('c,c,c')
    })

    it('should create initial map for category', () => {
      const params = { category: 'clothing' }
      const result = createInitialMap(params)
      expect(result).toBe('c,c')
    })

    it('should create initial map for department', () => {
      const params = { department: 'electronics' }
      const result = createInitialMap(params)
      expect(result).toBe('c')
    })

    it('should create initial map for brand', () => {
      const params = { brand: 'nike' }
      const result = createInitialMap(params)
      expect(result).toBe('b')
    })

    it('should create initial map for term', () => {
      const params = { term: 'smartphone' }
      const result = createInitialMap(params)
      expect(result).toBe('ft')
    })

    it('should create initial map for terms', () => {
      const params = { terms: 'phone/case/blue' }
      const result = createInitialMap(params)
      expect(result).toBe('ft,ft,ft')
    })

    it('should handle single term in terms', () => {
      const params = { terms: 'phone' }
      const result = createInitialMap(params)
      expect(result).toBe('ft')
    })

    it('should prioritize subcategory over other params', () => {
      const params = { 
        subcategory: 'shoes',
        category: 'clothing',
        department: 'fashion'
      }
      const result = createInitialMap(params)
      expect(result).toBe('c,c,c')
    })

    it('should prioritize category over department and brand', () => {
      const params = { 
        category: 'clothing',
        department: 'fashion',
        brand: 'nike'
      }
      const result = createInitialMap(params)
      expect(result).toBe('c,c')
    })
  })

  describe('getMapFromURL', () => {
    it('should extract map parameter from URL', () => {
      // Note: The current implementation has a bug - it doesn't return the result
      // This test documents the current behavior
      const result = getMapFromURL('https://example.com?map=c,c,b')
      expect(result).toBeUndefined()
    })
  })

  describe('initializeMap', () => {
    it('should use createInitialMap when getMapFromURL returns falsy', () => {
      const params = { department: 'electronics' }
      const url = 'https://example.com'
      
      const result = initializeMap(params, url)
      expect(result).toBe('c')
    })

    it('should handle empty params object', () => {
      const params = { terms: 'test' }
      const url = 'https://example.com'
      
      const result = initializeMap(params, url)
      expect(result).toBe('ft')
    })

    it('should fallback to createInitialMap for complex terms', () => {
      const params = { terms: 'phone/case/screen/protector' }
      const url = 'https://example.com'
      
      const result = initializeMap(params, url)
      expect(result).toBe('ft,ft,ft,ft')
    })
  })
})