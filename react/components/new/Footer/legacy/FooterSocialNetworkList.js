import PropTypes from 'prop-types'
import React from 'react'

import footerList from './footerList'
import withImage from '../components/withImage'
import footer from './footer.css'

/**
 * Shows an image for an specific social network
 */
const FooterSocialNetworkItem = ({ imageSrc, url }) => {
  if (!imageSrc) {
    return null
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener"
      className={`${footer.socialNetworkList} c-muted-1`}>
      <img className={`${footer.socialNetworkItem} w2 h2`} src={imageSrc} />
    </a>
  )
}

FooterSocialNetworkItem.displayName = 'FooterSocialNetworkItem'

FooterSocialNetworkItem.propTypes = {
  /** Social network icon source */
  imageSrc: PropTypes.string,
  /** For which link should the user be redirected if the image is clicked */
  url: PropTypes.string,
  /** If true, the original logo (with color) is used. If not, the grayscale's one */
  showInColor: PropTypes.bool.isRequired,
  /** Indicates from which social network should the image be displayed */
  socialNetwork: PropTypes.oneOf([
    'Facebook',
    'Twitter',
    'Instagram',
    'Youtube',
  ]),
}
const getImagePathFromProps = ({ socialNetwork, showInColor }) =>
  `${socialNetwork.toLowerCase()}${showInColor ? '' : '-bw'}.svg`

export default footerList(
  withImage(getImagePathFromProps)(FooterSocialNetworkItem)
)
