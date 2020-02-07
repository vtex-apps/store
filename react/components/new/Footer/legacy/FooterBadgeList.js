import React from 'react'
import PropTypes from 'prop-types'

import footerList from './footerList'

const FooterBadgeItem = ({ image }) => {
  return (image && <img src={image} />) || null
}

FooterBadgeItem.displayName = 'FooterBadgeItem'

FooterBadgeItem.propTypes = {
  image: PropTypes.string,
}

export default footerList(FooterBadgeItem)

