import PropTypes from 'prop-types'

export const objectLikeLinkArray = PropTypes.arrayOf(
  PropTypes.shape({
    url: PropTypes.string,
    title: PropTypes.string,
    target: PropTypes.oneOf(['_self', '_blank']),
  })
)

export const objectLikeBadgeArray = PropTypes.arrayOf(
  PropTypes.shape({
    image: PropTypes.string,
  })
)
