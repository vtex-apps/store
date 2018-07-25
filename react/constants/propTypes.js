import PropTypes from 'prop-types'

export const queryShape = PropTypes.shape({
  /**
   * Rest of the search term, e.g: eletronics/smartphones/samsung implies that
   * rest will be equal to "smartphones,samsung".
   */
  rest: PropTypes.string,
  /** Determines the types of the terms, e.g: "c,c,b" (category, category, brand). */
  map: PropTypes.string,
  /** Search's ordenation. */
  order: PropTypes.string,
  /** Search's pagination. */
  page: PropTypes.string,
})

export const searchContextPropTypes = {
  params: PropTypes.shape({
    /** Brand name */
    brand: PropTypes.string,

    /** handles /:department/d
     *  or /:department/:category
     *  or /:department/:category/:subcategory */
    department: PropTypes.string,
    category: PropTypes.string,
    subcategory: PropTypes.string,

    /** Search's term, e.g: eletronics. */
    term: PropTypes.string,
  }),
  query: queryShape,
  /** Internal route path. e.g: 'store' */
  treePath: PropTypes.string,
  /** Next internal route path. e.g: 'store/department' */
  nextTreePath: PropTypes.string,
  /** Element children */
  children: PropTypes.node.isRequired,
}
