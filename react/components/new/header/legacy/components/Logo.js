import React from 'react'
import { ExtensionPoint, Link } from 'vtex.render-runtime'
import PropTypes from 'prop-types'
import { logo } from '../defaults'

import styles from '../store-header.css'

/**
 * Represents the header logo
 */
const Logo = ({ logoUrl, logoTitle, linkUrl, logoSize, mobile }) => {
  return (
    <div className={`${styles.topMenuLogo} pv2 mr5`}>
      <Link to={linkUrl} className={`outline-0 ${styles.logoLink}`}>
        <ExtensionPoint
          id="logo"
          url={logoUrl}
          title={logoTitle}
          width={mobile ? logoSize.mobile.width : logoSize.desktop.width}
          height={mobile ? logoSize.mobile.height : logoSize.desktop.height}
          isMobile={mobile}
        />
      </Link>
    </div>
  )
}

Logo.propTypes = {
  /** If it's mobile mode */
  mobile: PropTypes.bool.isRequired,
  ...logo.propTypes,
}

Logo.defaultProps = {
  ...logo.defaultProps,
}

export default Logo
