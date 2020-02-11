import React, { Fragment, useState } from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import PropTypes from 'prop-types'
import Container from '../../../StoreComponents/Container'
import classNames from 'classnames'
import Logo from './Logo'
import SearchBar from './SearchBar'
import Actions from './Actions'
import { logo, icons, lean, searchBar, login } from '../defaults'

import styles from '../store-header.css'

/**
 * Component that deals with content thats always fixed on top
 * Also handles the toggle between mobile search and mobile navbar
 */
const FixedContent = ({
  leanMode,
  logoUrl,
  linkUrl,
  logoTitle,
  logoSize,
  showSearchBar,
  showLogin,
  iconClasses,
  labelClasses,
  mobile,
}) => {
  const [mobileSearchActive, toggleSearch] = useState(false)
  const containerClasses = classNames(
    `${
      styles.topMenuContainer
    } relative flex justify-center bg-base h3 bb bw0 b--white`
  )
  const contentClasses = classNames(
    'w-100 mw9 flex justify-center',
    leanMode ? 'pv0' : 'pv6-l pv2-m'
  )

  return (
    <div className="w-100 bg-base">
      <Container
        className={containerClasses}
        style={{
          transform: 'translateZ(0)', //Avoid shaking
        }}
      >
        <div className={contentClasses} style={{ pointerEvents: 'none' }}>
          <div
            className="flex w-100 justify-between-m items-center pv3"
            style={{
              pointerEvents: 'auto',
            }}
          >
            {mobileSearchActive ? (
              mobile &&
              showSearchBar && (
                <div className="flex justify-start pa2 relative w-100">
                  <SearchBar
                    mobile={mobile}
                    iconClasses={iconClasses}
                    onCancel={() => toggleSearch(false)}
                  />
                </div>
              )
            ) : (
              <Fragment>
                {!leanMode && mobile && (
                  <ExtensionPoint
                    id="category-menu"
                    mobileMode
                    iconClasses={iconClasses}
                  />
                )}

                <Logo
                  logoUrl={logoUrl}
                  logoTitle={logoTitle}
                  linkUrl={linkUrl}
                  logoSize={logoSize}
                  mobile={mobile}
                />

                {!leanMode && !mobile && showSearchBar && (
                  <div className="dn db-ns flex-grow-1">
                    <SearchBar mobile={mobile} />
                  </div>
                )}

                <ExtensionPoint id="locale-switcher"/>

                <Actions
                  iconClasses={iconClasses}
                  labelClasses={labelClasses}
                  showSearchBar={showSearchBar}
                  showSearchIcon={showSearchBar}
                  leanMode={leanMode}
                  showLogin={showLogin}
                  onActiveSearch={() => toggleSearch(true)}
                  mobile={mobile}
                />

                {!mobile && (
                  <ExtensionPoint id="user-address" variation="inline" />
                )}
              </Fragment>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}

FixedContent.propTypes = {
  /** If it's mobile mode */
  mobile: PropTypes.bool.isRequired,
  ...lean.propTypes,
  ...login.propTypes,
  ...searchBar.propTypes,
  ...logo.propTypes,
  ...icons.propTypes,
}

FixedContent.defaultProps = {
  ...lean.defaultProps,
  ...login.defaultProps,
  ...searchBar.defaultProps,
  ...logo.defaultProps,
  ...icons.defaultProps,
}

export default FixedContent
