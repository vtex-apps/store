import queryString from 'query-string'

import { getHelmetLink } from '../SearchWrapper'

describe('getHelmetLink function', () => {
  it('should return null if no canonical is provided', () => {
    const result = getHelmetLink({
      canonicalLink: null,
      page: 1,
      rel: 'canonical',
    })

    // Cannot generate meta links if there's no canonical link to use
    expect(result).toBeNull()
  })

  it('should return null if resulting page is less than 1', () => {
    const canonicalLink = 'https://storetheme.vtex.com/apparel---accessories/'

    const canonicalLinkResult = getHelmetLink({
      canonicalLink,
      page: -1,
      rel: 'canonical',
    })

    const nextLinkResult = getHelmetLink({
      canonicalLink,
      page: -1,
      rel: 'next',
    })

    const prevLinkResult = getHelmetLink({
      canonicalLink,
      page: 1,
      rel: 'prev',
    })

    expect(canonicalLinkResult).toBeNull()
    expect(nextLinkResult).toBeNull()
    expect(prevLinkResult).toBeNull()
  })

  it('should not return page number if page is equal to 1', () => {
    const canonicalLink = 'https://storetheme.vtex.com/apparel---accessories/'

    const canonicalLinkResult = getHelmetLink({
      canonicalLink,
      page: 1,
      rel: 'canonical',
    })

    const nextLinkResult = getHelmetLink({
      canonicalLink,
      page: 0,
      rel: 'next',
    })

    const prevLinkResult = getHelmetLink({
      canonicalLink,
      page: 2,
      rel: 'prev',
    })

    const expectedResult = queryString.stringifyUrl({
      url: canonicalLink,
    })

    expect(canonicalLinkResult).toHaveProperty('href', expectedResult)
    expect(nextLinkResult).toHaveProperty('href', expectedResult)
    expect(prevLinkResult).toHaveProperty('href', expectedResult)
  })

  it('should return canonical link with page querystring appended to it', () => {
    const canonicalLink = 'https://storetheme.vtex.com/apparel---accessories/'
    const page = 2

    const canonicalLinkResult = getHelmetLink({
      canonicalLink,
      page,
      rel: 'canonical',
    })

    const nextLinkResult = getHelmetLink({
      canonicalLink,
      page: 1,
      rel: 'next',
    })

    const prevLinkResult = getHelmetLink({
      canonicalLink,
      page: 3,
      rel: 'prev',
    })

    const expectedResult = queryString.stringifyUrl({
      url: canonicalLink,
      query: {
        page,
      },
    })

    expect(canonicalLinkResult).toHaveProperty('href', expectedResult)
    expect(nextLinkResult).toHaveProperty('href', expectedResult)
    expect(prevLinkResult).toHaveProperty('href', expectedResult)
  })

  it('should not return the map on the canonical url of department pages', () => {
    const canonicalLink = 'https://storetheme.vtex.com/apparel---accessories/'

    const canonicalLinkResult = getHelmetLink({
      canonicalLink,
      page: 1,
      map: 'c',
      rel: 'canonical',
    })

    const expectedResult = queryString.stringifyUrl({
      url: canonicalLink,
    })

    expect(canonicalLinkResult).toHaveProperty('href', expectedResult)
  })

  it('should not return the map on the canonical url of category pages', () => {
    const canonicalLink = 'https://storetheme.vtex.com/apparel---accessories/'
    const map = 'c,c'
    const page = 2

    const canonicalLinkResult = getHelmetLink({
      canonicalLink,
      page,
      map,
      rel: 'canonical',
    })

    const expectedResult = queryString.stringifyUrl({
      url: canonicalLink,
      query: {
        page,
      },
    })

    expect(canonicalLinkResult).toHaveProperty('href', expectedResult)
  })

  it('should not return the map on the canonical url of subcategory pages', () => {
    const canonicalLink = 'https://storetheme.vtex.com/apparel---accessories/'
    const map = 'c,c,c'
    const page = 3

    const canonicalLinkResult = getHelmetLink({
      canonicalLink,
      page,
      map,
      rel: 'canonical',
    })

    const expectedResult = queryString.stringifyUrl({
      url: canonicalLink,
      query: {
        page,
      },
    })

    expect(canonicalLinkResult).toHaveProperty('href', expectedResult)
  })

  it('should not return the map on the canonical url of brand pages', () => {
    const canonicalLink = 'https://storetheme.vtex.com/apparel---accessories/'
    const map = 'b'

    const canonicalLinkResult = getHelmetLink({
      canonicalLink,
      page: 1,
      map,
      rel: 'canonical',
    })

    const expectedResult = queryString.stringifyUrl({
      url: canonicalLink,
    })

    expect(canonicalLinkResult).toHaveProperty('href', expectedResult)
  })

  it('should return the map on the canonical url when map has more than 4 categories', () => {
    const canonicalLink = 'https://storetheme.vtex.com/apparel---accessories/'
    const map = 'c,c,c,c,c'

    const canonicalLinkResult = getHelmetLink({
      canonicalLink,
      page: 1,
      map,
      rel: 'canonical',
    })

    const expectedResult = queryString.stringifyUrl({
      url: canonicalLink,
      query: {
        map,
      },
    })

    expect(canonicalLinkResult).toHaveProperty('href', expectedResult)
  })

  it('should return the map on the canonical url when map has category and brand', () => {
    const canonicalLink = 'https://storetheme.vtex.com/apparel---accessories/'
    const map = 'c,b'

    const canonicalLinkResult = getHelmetLink({
      canonicalLink,
      page: 1,
      map,
      rel: 'canonical',
    })

    const expectedResult = queryString.stringifyUrl({
      url: canonicalLink,
      query: {
        map,
      },
    })

    expect(canonicalLinkResult).toHaveProperty('href', expectedResult)
  })

  it('should return the map on the canonical url when map has any weird value', () => {
    const canonicalLink = 'https://storetheme.vtex.com/apparel---accessories/'
    const map = 'productClusterIds,c'

    const canonicalLinkResult = getHelmetLink({
      canonicalLink,
      page: 1,
      map,
      rel: 'canonical',
    })

    const expectedResult = queryString.stringifyUrl({
      url: canonicalLink,
      query: {
        map,
      },
    })

    expect(canonicalLinkResult).toHaveProperty('href', expectedResult)
  })
})
