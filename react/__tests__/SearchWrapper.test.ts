import { getHelmetLink } from '../SearchWrapper'

describe('getHelmetLink function', () => {
  it('should return null if no canonical is provided', () => {
    const result = getHelmetLink(null, 1, 'canonical')

    // Cannot generate meta links if there's no canonical link to use
    expect(result).toBeNull()
  })

  it('should return null if resulting page is less than 1', () => {
    const canonicalLink = 'https://storetheme.vtex.com/apparel---accessories/'

    const canonicalLinkResult = getHelmetLink(canonicalLink, -1, 'canonical')
    const nextLinkResult = getHelmetLink(canonicalLink, -1, 'next')
    const prevLinkResult = getHelmetLink(canonicalLink, 1, 'prev')

    expect(canonicalLinkResult).toBeNull()
    expect(nextLinkResult).toBeNull()
    expect(prevLinkResult).toBeNull()
  })

  it('should not return page number if page is equal to 1', () => {
    const canonicalLink = 'https://storetheme.vtex.com/apparel---accessories/'

    const canonicalLinkResult = getHelmetLink(canonicalLink, 1, 'canonical')
    const nextLinkResult = getHelmetLink(canonicalLink, 0, 'next')
    const prevLinkResult = getHelmetLink(canonicalLink, 2, 'prev')

    expect(canonicalLinkResult).toHaveProperty('href', encodeURI(canonicalLink))
    expect(nextLinkResult).toHaveProperty('href', encodeURI(canonicalLink))
    expect(prevLinkResult).toHaveProperty('href', encodeURI(canonicalLink))
  })

  it('should return canonical link with page querystring appended to it', () => {
    const canonicalLink = 'https://storetheme.vtex.com/apparel---accessories/'

    const canonicalLinkResult = getHelmetLink(canonicalLink, 2, 'canonical')
    const nextLinkResult = getHelmetLink(canonicalLink, 1, 'next')
    const prevLinkResult = getHelmetLink(canonicalLink, 3, 'prev')

    const expectedResult = encodeURI(`${canonicalLink}?page=2`)

    expect(canonicalLinkResult).toHaveProperty('href', expectedResult)
    expect(nextLinkResult).toHaveProperty('href', expectedResult)
    expect(prevLinkResult).toHaveProperty('href', expectedResult)
  })
})
