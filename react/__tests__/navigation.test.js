import { normalizeNavigation } from '../utils/navigation'

describe('Navigation route modifier', () => {
  window.__RUNTIME__ = {
    route: {
      domain: 'store',
    },
  }

  it('should lowercase the path', () => {
    const path = '/Category1/category2/Category3'
    const query =
      'map=c,c,c,specificationFilter_1&query=/Category1/category2/Category3/xpto'
    const expectedPath = path.toLocaleLowerCase()
    const expectedQuery = query
    const result = normalizeNavigation({ path, query })

    expect(result).toEqual({ path: expectedPath, query: expectedQuery })
  })
  it('should sort specification filters', () => {
    const path = '/Category1/category2/Category3'
    const query =
      'map=c,c,c,specificationFilter_2,specificationFilter_0,specificationFilter_1&query=/Category1/category2/Category3/xpto2/xpto0/xpto1'
    const expectedPath = path.toLocaleLowerCase()
    const expectedQuery =
      'map=c,c,c,specificationFilter_0,specificationFilter_1,specificationFilter_2&query=/Category1/category2/Category3/xpto0/xpto1/xpto2'
    const result = normalizeNavigation({ path, query })

    expect(result).toEqual({ path: expectedPath, query: expectedQuery })
  })
  it('intelligent search queries should have the following order: /[category hierarchy/alphabetically]/[brand alphabetically]/[specs alphabetically]', () => {
    const path = '/departmentvalue/categoryvalue1/categoryvalue2'
    const query =
      'map=specificationFilter,category-2,category-2,brand,category-1,brand,&query=/specvalue/categoryvalue2/categoryvalue1/brandvalue2/departmentvalue/brandvalue1'
    const expectedPath = path.toLocaleLowerCase()
    const expectedQuery =
      'map=category-1,category-2,category-2,brand,brand,specificationFilter&query=/departmentvalue/categoryvalue1/categoryvalue2/brandvalue1/brandvalue2/specvalue'
    const result = normalizeNavigation({ path, query })

    expect(result).toEqual({ path: expectedPath, query: expectedQuery })
  })
  it('should preserve case for new routes pattern', () => {
    const path = '/foo/bar/nice_Bar'
    const expectedPath = '/foo/bar/nice_Bar'
    const ignore = { 'nice-bar': { path: 'nice_Bar' } }
    const result = normalizeNavigation({ path, ignore })
    expect(result).toEqual({ path: expectedPath, ignore, query: undefined })
  })
})
