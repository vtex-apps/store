import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { withRuntimeContext } from 'vtex.render-runtime'
import { PLATFORM_GOCOMMERCE } from '../modules/platformCode'
import withImage from '../components/withImage'
import footer from './footer.css'

/**
 * "Powered By Vtex" image's component, used in Footer
 */
const FooterVtexLogo = ({ runtime, logoUrl, imageSrc }) => {
  if (!imageSrc) {
    return null
  }

  const isPlatformGCResult = runtime.platform === PLATFORM_GOCOMMERCE
  const vtexLogoItemClasses = classNames(footer.vtexLogoItem, {
    w4: isPlatformGCResult,
    'h3 w3': !isPlatformGCResult,
  })

  return (
    <div
      className={`${footer.badgeList} flex flex-row justify-center pv4-s pa0-ns items-center ml-auto-m`}
    >
      {logoUrl && (
        <span className={`${footer.badge} pa2-s pa1-ns`}>
          <img
            className={`${footer.logoImage} h3`}
            alt={runtime.platform}
            src={logoUrl}
          />
        </span>
      )}
      <span className={`${footer.badge} pa2-s pa1-ns nt7-ns`}>
        <img
          className={vtexLogoItemClasses}
          alt={runtime.platform}
          src={imageSrc}
        />
      </span>
    </div>
  )
}

FooterVtexLogo.displayName = 'FooterVtexLogo'

FooterVtexLogo.propTypes = {
  /** Get the account name to find the correct platfom */
  runtime: PropTypes.shape({
    account: PropTypes.string.isRequired,
    platform: PropTypes.string.isRequired,
  }).isRequired,
  /** If true, the original logo (with color) is used. If not, the grayscale's one */
  showInColor: PropTypes.bool,
  /** The source for an external customizable logo to show above "Powered By Vtex" */
  logoUrl: PropTypes.string,
  imageSrc: PropTypes.string,
}

const getImagePathFromProps = ({ runtime, showInColor }) =>
  `${runtime.platform}${showInColor ? '' : '-bw'}.svg`

export default withRuntimeContext(
  withImage(getImagePathFromProps)(FooterVtexLogo)
)
