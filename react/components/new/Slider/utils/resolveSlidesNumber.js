/**
 * This function returns the number of slides to show depending on the size of the window.
 * If you pass a number it just returns that number.
 * If you pass an object it will return the number of slides of the closest breakpoint to the size of the window.
 * If you pass for example
 * perPage = {
 *   400: 2,
 *   1000: 3
 * }
 *
 * If the size of the window is something between 400px and 999px if will return 2,
 * if it is 1000px or bigger, it will return 3, and if it is smaller than 400px it
 * will return the default value; that is, 1.
 * @param {number|object} perPage
 * @param {number|undefined} minPerPage
 */
function resolveSlidesNumber(minPerPage, perPage, isMobile) {
  let result = minPerPage || 1
  if (typeof perPage === 'number') {
    result = perPage
  } else if (typeof perPage === 'object') {
    const innerWidth = window && window.innerWidth

    /** If it's on SSR, use placeholder screen sizes to get an approximate
     * guess of how many items are displayed per page */
    const windowSize = innerWidth || (isMobile ? 320 : 1024)

    for (const viewport in perPage) {
      if (windowSize >= viewport) {
        result = perPage[viewport]
      }
    }
  }
  return result < minPerPage ? minPerPage : result
}

export default resolveSlidesNumber
