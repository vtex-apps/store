import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { ExtensionPoint, useChildBlock } from 'vtex.render-runtime'
import Collapsible from './Collapsible'
import FixedContent from './FixedContent'
import { logo, collapsible, icons, lean, searchBar, login } from '../defaults'
import styles from '../store-header.css'

/**
 * Top menu that contains the fixed and collapsible parts
 */
const TopMenu = ({
  extraHeaders,
  leanMode,
  logoUrl,
  linkUrl,
  logoTitle,
  logoSize,
  showLogin,
  showSearchBar,
  iconClasses,
  labelClasses,
  collapsibleAnimation,
  mobile,
}) => {
  const hasMenu = !!useChildBlock({ id: 'menu' })
  const hasUnstableMenu = !!useChildBlock({ id: 'unstable--menu' })

  if (hasUnstableMenu) {
    console.warn(
      'The flag `unstable--` from the menu component will be deprecated soon, in favor of just `menu`. The `second-level-menu` will also be deprecated in favor of `menu`.'
    )
  }

  return (
    <Fragment>
      {extraHeaders}

      <FixedContent
        leanMode={leanMode}
        logoUrl={logoUrl}
        linkUrl={linkUrl}
        logoSize={logoSize}
        logoTitle={logoTitle}
        showSearchBar={showSearchBar}
        showLogin={showLogin}
        iconClasses={iconClasses}
        labelClasses={labelClasses}
        mobile={mobile}
      />

      <Collapsible
        collapsibleAnimation={collapsibleAnimation}
        leanMode={leanMode}
        mobile={mobile}
      >
        {hasMenu || hasUnstableMenu ? (
          <div className={styles.topMenuCompatibilityContainer}>
            <div className="flex flex-grow-1" />
            <ExtensionPoint id={hasMenu ? 'menu' : 'unstable--menu'} />
            <div className="flex flex-grow-1" />
          </div>
        ) : (
          <ExtensionPoint id="category-menu" />
        )}
      </Collapsible>
    </Fragment>
  )
}

TopMenu.propTypes = {
  /** If it's mobile mode */
  mobile: PropTypes.bool.isRequired,
  /** Very top aditional sections */
  extraHeaders: PropTypes.element,
  ...lean.propTypes,
  ...login.propTypes,
  ...searchBar.propTypes,
  ...logo.propTypes,
  ...icons.propTypes,
  ...collapsible.propTypes,
}

TopMenu.defaultProps = {
  ...lean.defaultProps,
  ...login.defaultProps,
  ...searchBar.defaultProps,
  ...logo.defaultProps,
  ...icons.defaultProps,
  ...collapsible.defaultProps,
}

export default TopMenu
